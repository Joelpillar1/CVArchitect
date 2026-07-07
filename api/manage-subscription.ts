import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import {
  activateSubscription,
  extractMetadata,
  finalizeDowngrade,
  findUserIdByEmail,
  getSupabaseAdmin,
  linkDodoSubscription,
  mapProductToPlan,
  markCancelAtPeriodEnd,
  normalizePlanId,
  schedulePlanChange,
  AppPlanId,
} from './lib/subscriptionActivation';
import {
  cancelDodoSubscriptionAtPeriodEnd,
  changeDodoSubscriptionPlan,
  createDodoCustomerPortalSession,
  fetchDodoSubscription,
} from './lib/dodoSubscriptionApi';
import { getDodoConfig, getProductIdForPlan, isDodoCheckoutConfigured } from './lib/dodoConfig';
import { resolveReturnOrigin } from './lib/resolveReturnOrigin';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const config = getDodoConfig();
  if (!isDodoCheckoutConfigured(config)) {
    return res.status(500).json({ error: 'Payment provider is not configured.' });
  }

  const supabaseAdmin = createClient(config.supabaseUrl, config.serviceRoleKey);
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
  if (authError || !authData.user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  const user = authData.user;
  const body = req.body || {};
  const action = body.action as string;
  const returnOrigin = resolveReturnOrigin(body.returnOrigin, config.appUrl);

  const { data: subscription, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (subError && subError.code !== 'PGRST116') {
    return res.status(500).json({ error: 'Could not load subscription.' });
  }

  if (action === 'link_subscription') {
    const subscriptionId = body.subscriptionId as string | undefined;
    if (!subscriptionId) return res.status(400).json({ error: 'subscriptionId is required.' });

    const dodoSub = await fetchDodoSubscription(config, subscriptionId);
    if (!dodoSub) {
      return res.status(400).json({ error: 'Could not verify subscription with payment provider.' });
    }

    const linkResult = await linkDodoSubscription(
      supabaseAdmin,
      user.id,
      dodoSub.subscriptionId,
      dodoSub.customerId
    );
    if (!linkResult.success) return res.status(500).json({ error: linkResult.error });

    return res.status(200).json({ success: true });
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
      return res.status(400).json({ error: 'No billing profile found. Complete a checkout first.' });
    }

    const portal = await createDodoCustomerPortalSession(
      config,
      customerId,
      `${returnOrigin}/dashboard/settings?tab=subscription`
    );
    if (!portal.success || !portal.link) {
      return res.status(500).json({ error: portal.error || 'Failed to open billing portal.' });
    }

    return res.status(200).json({ success: true, portalUrl: portal.link });
  }

  if (action === 'cancel') {
    const dodoSubscriptionId = subscription?.dodo_subscription_id as string | undefined;
    if (!dodoSubscriptionId) {
      return res.status(400).json({ error: 'No active billing subscription found to cancel.' });
    }

    const cancelResult = await cancelDodoSubscriptionAtPeriodEnd(config, dodoSubscriptionId);
    if (!cancelResult.success) return res.status(500).json({ error: cancelResult.error });

    const markResult = await markCancelAtPeriodEnd(supabaseAdmin, user.id);
    if (!markResult.success) return res.status(500).json({ error: markResult.error });

    return res.status(200).json({
      success: true,
      message: 'Subscription will cancel at the end of your billing period.',
    });
  }

  if (action === 'change_plan') {
    const planId = normalizePlanId(body.planId || '');
    if (!planId) return res.status(400).json({ error: 'Invalid plan selected.' });

    const currentPlanId = (subscription?.plan_id as string) || 'free';
    if (currentPlanId === planId) return res.status(400).json({ error: 'You are already on this plan.' });

    const dodoSubscriptionId = subscription?.dodo_subscription_id as string | undefined;
    if (!dodoSubscriptionId) {
      return res.status(409).json({
        error: 'No linked subscription found. Use checkout to subscribe first.',
        requiresCheckout: true,
      });
    }

    const productId = getProductIdForPlan(planId, config);
    const direction = comparePlanChange(currentPlanId, planId);
    const changeResult = await changeDodoSubscriptionPlan(config, dodoSubscriptionId, productId, {
      direction,
      userId: user.id,
      planId,
    });

    if (!changeResult.success) return res.status(500).json({ error: changeResult.error });

    if (changeResult.scheduled) {
      await schedulePlanChange(supabaseAdmin, user.id, planId);
      return res.status(200).json({
        success: true,
        scheduled: true,
        message: 'Plan change scheduled for your next billing date.',
        planId,
      });
    }

    const activateResult = await activateSubscription(supabaseAdmin, user.id, planId, {
      dodoSubscriptionId,
      dodoCustomerId: subscription?.dodo_customer_id as string | undefined,
      cancelAtPeriodEnd: false,
      scheduledPlanId: null,
    });

    if (!activateResult.success) {
      return res.status(500).json({ error: activateResult.error || 'Plan changed in billing but app update failed.' });
    }

    return res.status(200).json({
      success: true,
      scheduled: false,
      message: 'Plan updated successfully.',
      planId,
    });
  }

  return res.status(400).json({ error: 'Unknown action.' });
}
