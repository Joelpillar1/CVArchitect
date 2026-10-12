import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { getCreemApiBaseUrl, getCreemConfig } from '../_shared/creemConfig.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const config = getCreemConfig();
  if (!config.apiKey) {
    return new Response(JSON.stringify({ error: 'Payment provider is not configured.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createClient(config.supabaseUrl, config.serviceRoleKey);
  const accessToken = authHeader.slice(7);
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired session.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const user = authData.user;
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;
  const apiBase = getCreemApiBaseUrl(config.environment);

  const { data: subscription, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (subError && subError.code !== 'PGRST116') {
    return new Response(JSON.stringify({ error: 'Could not load subscription.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (action === 'link_subscription') {
    const creemSubscriptionId = body.subscriptionId as string;
    const creemCustomerId = body.customerId as string;

    if (!creemSubscriptionId && !creemCustomerId) {
      return new Response(JSON.stringify({ error: 'Missing subscription or customer ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (creemSubscriptionId) updates.creem_subscription_id = creemSubscriptionId;
    if (creemCustomerId) updates.creem_customer_id = creemCustomerId;

    await supabaseAdmin.from('subscriptions').update(updates).eq('user_id', user.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (action === 'portal') {
    let customerId =
      subscription?.creem_customer_id ||
      subscription?.dodo_customer_id;

    // If customer ID is not saved in DB, query Creem by user email
    if (!customerId && user.email) {
      try {
        const custRes = await fetch(`${apiBase}/customers?email=${encodeURIComponent(user.email)}`, {
          headers: { 'x-api-key': config.apiKey },
        });
        if (custRes.ok) {
          const custData = await custRes.json();
          const items = custData?.items || custData?.result?.items || (Array.isArray(custData) ? custData : [custData]);
          const found = items?.[0];
          if (found?.id) {
            customerId = found.id;
            await supabaseAdmin
              .from('subscriptions')
              .update({ creem_customer_id: customerId, updated_at: new Date().toISOString() })
              .eq('user_id', user.id);
          }
        }
      } catch (e) {
        console.warn('Failed to query Creem customer by email:', e);
      }
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: 'No active billing customer found. Please subscribe first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const portalRes = await fetch(`${apiBase}/customers/billing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
        },
        body: JSON.stringify({ customer_id: customerId }),
      });

      const portalData = await portalRes.json().catch(() => ({}));
      const portalUrl =
        portalData.customer_portal_link ||
        portalData.customerPortalLink ||
        portalData.url;

      if (!portalRes.ok || !portalUrl) {
        console.error('Failed to generate Creem customer billing link:', portalData);
        return new Response(
          JSON.stringify({ error: portalData.message || 'Failed to generate billing portal link.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify({ success: true, portalUrl }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Error generating billing portal link:', err);
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : 'Portal request failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (action === 'cancel') {
    const creemSubId =
      subscription?.creem_subscription_id ||
      subscription?.dodo_subscription_id;

    if (!creemSubId) {
      return new Response(
        JSON.stringify({ error: 'No active subscription found to cancel.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const cancelRes = await fetch(`${apiBase}/subscriptions/${creemSubId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
        },
        body: JSON.stringify({ mode: 'scheduled' }),
      });

      if (!cancelRes.ok) {
        const cancelData = await cancelRes.json().catch(() => ({}));
        console.error('Creem subscription cancel failed:', cancelData);
        return new Response(
          JSON.stringify({ error: cancelData.message || 'Failed to cancel subscription with Creem.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      await supabaseAdmin
        .from('subscriptions')
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Subscription will cancel at the end of your billing period.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error('Error canceling subscription:', err);
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : 'Cancel request failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
