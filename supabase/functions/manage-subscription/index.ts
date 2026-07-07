import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { getDodoConfig, getProductIdForPlan, isDodoCheckoutConfigured } from '../_shared/dodoConfig.ts';
import {
  activateSubscription,
  finalizeDowngrade,
  linkDodoSubscription,
  markCancelAtPeriodEnd,
  normalizePlanId,
  schedulePlanChange,
} from '../_shared/subscriptionActivation.ts';
import {
  cancelDodoSubscriptionAtPeriodEnd,
  changeDodoSubscriptionPlan,
  createDodoCustomerPortalSession,
  fetchDodoSubscription,
} from '../_shared/dodoSubscriptionApi.ts';
import { resolveReturnOrigin } from '../create-checkout-session/_shared/resolveReturnOrigin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PLAN_TIER_ORDER: Record<string, number> = {
  free: 0,
  sprint: 1,
  week_pass: 1,
  build: 2,
  pro_monthly: 2,
  blueprint: 3,
};

function comparePlanChange(fromPlanId: string, toPlanId: string): 'upgrade' | 'downgrade' | 'same' {
  const fromTier = PLAN_TIER_ORDER[fromPlanId] ?? 0;
  const toTier = PLAN_TIER_ORDER[toPlanId] ?? 0;
  if (toTier > fromTier) return 'upgrade';
  if (toTier < fromTier) return 'downgrade';
  return 'same';
}

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
  const returnOrigin = resolveReturnOrigin(body.returnOrigin, config.appUrl);

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
    const subscriptionId = body.subscriptionId as string | undefined;
    if (!subscriptionId) {
      return new Response(JSON.stringify({ error: 'subscriptionId is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dodoSub = await fetchDodoSubscription(config, subscriptionId);
    if (!dodoSub) {
      return new Response(JSON.stringify({ error: 'Could not verify subscription with payment provider.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const linkResult = await linkDodoSubscription(
      supabaseAdmin,
      user.id,
      dodoSub.subscriptionId,
      dodoSub.customerId
    );

    if (!linkResult.success) {
      return new Response(JSON.stringify({ error: linkResult.error || 'Failed to link subscription.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (action === 'portal') {
    let customerId = subscription?.dodo_customer_id as string | undefined;

    if (!customerId && subscription?.dodo_subscription_id) {
      const dodoSub = await fetchDodoSubscription(config, subscription.dodo_subscription_id);
      customerId = dodoSub?.customerId;
      if (customerId) {
        await linkDodoSubscription(supabaseAdmin, user.id, subscription.dodo_subscription_id, customerId);
      }
    }

    if (!customerId) {
      return new Response(JSON.stringify({ error: 'No billing profile found. Complete a checkout first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const portal = await createDodoCustomerPortalSession(
      config,
      customerId,
      `${returnOrigin}/dashboard/settings?tab=subscription`
    );

    if (!portal.success || !portal.link) {
      return new Response(JSON.stringify({ error: portal.error || 'Failed to open billing portal.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, portalUrl: portal.link }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (action === 'cancel') {
    const dodoSubscriptionId = subscription?.dodo_subscription_id as string | undefined;
    if (!dodoSubscriptionId) {
      return new Response(JSON.stringify({ error: 'No active billing subscription found to cancel.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cancelResult = await cancelDodoSubscriptionAtPeriodEnd(config, dodoSubscriptionId);
    if (!cancelResult.success) {
      return new Response(JSON.stringify({ error: cancelResult.error || 'Failed to cancel subscription.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const markResult = await markCancelAtPeriodEnd(supabaseAdmin, user.id);
    if (!markResult.success) {
      return new Response(JSON.stringify({ error: markResult.error || 'Failed to update subscription status.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscription will cancel at the end of your billing period.',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (action === 'change_plan') {
    const planId = normalizePlanId(body.planId || '');
    if (!planId) {
      return new Response(JSON.stringify({ error: 'Invalid plan selected.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const currentPlanId = (subscription?.plan_id as string) || 'free';
    if (currentPlanId === planId) {
      return new Response(JSON.stringify({ error: 'You are already on this plan.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dodoSubscriptionId = subscription?.dodo_subscription_id as string | undefined;
    if (!dodoSubscriptionId) {
      return new Response(
        JSON.stringify({
          error: 'No linked subscription found. Use checkout to subscribe first.',
          requiresCheckout: true,
        }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const productId = getProductIdForPlan(planId, config);
    const direction = comparePlanChange(currentPlanId, planId);
    const changeResult = await changeDodoSubscriptionPlan(config, dodoSubscriptionId, productId, {
      direction,
      userId: user.id,
      planId,
    });

    if (!changeResult.success) {
      return new Response(JSON.stringify({ error: changeResult.error || 'Failed to change plan.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (changeResult.scheduled) {
      await schedulePlanChange(supabaseAdmin, user.id, planId);
      return new Response(
        JSON.stringify({
          success: true,
          scheduled: true,
          message: 'Plan change scheduled for your next billing date.',
          planId,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const activateResult = await activateSubscription(supabaseAdmin, user.id, planId, {
      dodoSubscriptionId,
      dodoCustomerId: subscription?.dodo_customer_id as string | undefined,
      cancelAtPeriodEnd: false,
      scheduledPlanId: null,
    });

    if (!activateResult.success) {
      return new Response(JSON.stringify({ error: activateResult.error || 'Plan changed in billing but app update failed.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        scheduled: false,
        message: 'Plan updated successfully.',
        planId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(JSON.stringify({ error: 'Unknown action.' }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
