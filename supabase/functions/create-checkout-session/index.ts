import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import {
  getCreemApiBaseUrl,
  getCreemConfig,
  getProductIdForPlan,
  isCreemCheckoutConfigured,
} from './_shared/creemConfig.ts';
import { normalizePlanId } from './_shared/creemSubscriptionActivation.ts';
import { resolveReturnOrigin } from './_shared/resolveReturnOrigin.ts';
import { getMinilyticsAttribution } from './_shared/minilyticsAttribution.ts';

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

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const accessToken = authHeader.slice(7);
  const supabaseAdmin = createClient(config.supabaseUrl, config.serviceRoleKey);
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired session.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json().catch(() => ({}));
  const { planId: rawPlanId, returnOrigin } = body;
  const minilytics = getMinilyticsAttribution(req.headers.get('cookie') || undefined, body);
  const planId = normalizePlanId(rawPlanId || '');

  if (!planId) {
    return new Response(JSON.stringify({ error: 'Invalid plan selected.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Prevent Lifetime members from accidentally purchasing recurring Build plans
  const { data: userSub } = await supabaseAdmin
    .from('subscriptions')
    .select('plan_id, is_active')
    .eq('user_id', authData.user.id)
    .single();

  if (userSub?.is_active && userSub.plan_id === 'lifetime' && planId !== 'lifetime') {
    return new Response(
      JSON.stringify({
        error: 'You already have active Lifetime access. A Build subscription is not needed.',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (!isCreemCheckoutConfigured(config, planId)) {
    console.error('Creem checkout not fully configured:', {
      hasApiKey: !!config.apiKey,
      hasSupabaseUrl: !!config.supabaseUrl,
      hasServiceRole: !!config.serviceRoleKey,
      planId,
      productId: getProductIdForPlan(planId, config),
    });
    return new Response(
      JSON.stringify({
        error: `Payment provider is not configured for plan "${planId}". Please ensure Creem API key and Product IDs are set in Supabase secrets.`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  const productId = getProductIdForPlan(planId, config);
  const user = authData.user;
  const userName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Customer';

  const origin = resolveReturnOrigin(returnOrigin, config.appUrl);
  const returnUrl = `${origin}/dashboard?payment=success&plan=${planId}`;

  try {
    const apiBase = getCreemApiBaseUrl(config.environment);
    console.log('Creating Creem checkout session:', {
      environment: config.environment,
      planId,
      productId,
      userId: user.id,
    });

    const response = await fetch(`${apiBase}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
      },
      body: JSON.stringify({
        product_id: productId,
        customer: {
          email: user.email,
          name: userName,
        },
        success_url: returnUrl,
        metadata: {
          userId: user.id,
          planId: planId,
          email: user.email,
          ml_visitor_id: minilytics.visitorId,
          ml_session_id: minilytics.sessionId,
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Creem checkout creation failed:', {
        status: response.status,
        data,
      });
      const errorMsg =
        data.message || data.error || `Creem API error (${response.status})`;
      return new Response(
        JSON.stringify({ error: errorMsg, details: data }),
        {
          status: response.status >= 400 && response.status < 500 ? response.status : 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const checkoutUrl = data.checkout_url || data.checkoutUrl;
    if (!checkoutUrl) {
      console.error('Creem checkout response missing checkout_url:', data);
      return new Response(
        JSON.stringify({ error: 'Checkout URL was not returned by Creem.' }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        checkoutUrl,
        sessionId: data.id,
        environment: config.environment,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error creating Creem checkout session:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal Server Error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
