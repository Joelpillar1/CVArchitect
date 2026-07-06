import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import {
  getDodoApiBaseUrl,
  getDodoConfig,
  getProductIdForPlan,
  isDodoCheckoutConfigured,
} from './_shared/dodoConfig.ts';
import { normalizePlanId } from './_shared/subscriptionActivation.ts';
import { resolveReturnOrigin } from './_shared/resolveReturnOrigin.ts';

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

  const config = getDodoConfig();

  if (!isDodoCheckoutConfigured(config)) {
    console.error('Dodo checkout not configured', {
      hasApiKey: !!config.apiKey,
      hasSprint: !!config.sprintProductId,
      hasBuild: !!config.buildProductId,
      hasBlueprint: !!config.blueprintProductId,
      hasSupabaseUrl: !!config.supabaseUrl,
      hasServiceRole: !!config.serviceRoleKey,
    });
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

  const accessToken = authHeader.slice(7);
  const supabaseAdmin = createClient(config.supabaseUrl, config.serviceRoleKey);
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired session.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { planId: rawPlanId, returnOrigin } = await req.json().catch(() => ({}));
  const planId = normalizePlanId(rawPlanId || '');

  if (!planId) {
    return new Response(JSON.stringify({ error: 'Invalid plan selected.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const productId = getProductIdForPlan(planId, config);
  if (!productId) {
    return new Response(JSON.stringify({ error: 'Plan is not configured for checkout.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const user = authData.user;
  const userName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Customer';

  const origin = resolveReturnOrigin(returnOrigin, config.appUrl);
  const returnUrl = `${origin}/dashboard?payment=success&plan=${planId}`;

  try {
    const response = await fetch(`${getDodoApiBaseUrl(config.environment)}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: {
          email: user.email,
          name: userName,
        },
        return_url: returnUrl,
        metadata: {
          user_id: user.id,
          plan_id: planId,
          email: user.email,
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Dodo checkout session error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to create checkout session.', details: data }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!data.checkout_url) {
      return new Response(
        JSON.stringify({ error: 'Checkout URL was not returned by payment provider.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ checkoutUrl: data.checkout_url, sessionId: data.session_id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to create checkout session.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
