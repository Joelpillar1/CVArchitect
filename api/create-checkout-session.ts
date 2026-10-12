import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { normalizePlanId } from './_lib/creemSubscriptionActivation';
import {
  getCreemApiBaseUrl,
  getCreemConfig,
  getProductIdForPlan,
  isCreemCheckoutConfigured,
} from './_lib/creemConfig';
import { resolveReturnOrigin } from './_lib/resolveReturnOrigin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const config = getCreemConfig();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const accessToken = authHeader.slice(7);
  const supabaseAdmin = createClient(config.supabaseUrl, config.serviceRoleKey);
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
  if (authError || !authData.user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  const { planId: rawPlanId, returnOrigin } = req.body || {};
  const planId = normalizePlanId(rawPlanId || '');
  if (!planId) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  // Prevent Lifetime members from accidentally purchasing recurring Build plans
  const { data: userSub } = await supabaseAdmin
    .from('subscriptions')
    .select('plan_id, is_active')
    .eq('user_id', authData.user.id)
    .single();

  if (userSub?.is_active && userSub.plan_id === 'lifetime' && planId !== 'lifetime') {
    return res.status(400).json({
      error: 'You already have active Lifetime access. A Build subscription is not needed.',
    });
  }

  if (!isCreemCheckoutConfigured(config, planId)) {
    return res.status(500).json({ error: `Payment provider is not configured for plan "${planId}".` });
  }

  const productId = getProductIdForPlan(planId, config);
  const user = authData.user;
  const userName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Customer';

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const requestOrigin = host ? `${proto}://${host}` : config.appUrl.replace(/\/$/, '');
  const origin = resolveReturnOrigin(returnOrigin, requestOrigin);
  const returnUrl = `${origin}/dashboard?payment=success&plan=${planId}`;

  try {
    const apiBase = getCreemApiBaseUrl(config.environment);
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
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Creem checkout error:', data);
      return res.status(response.status).json({
        error: data.message || data.error || 'Failed to create checkout session.',
        details: data,
      });
    }

    const checkoutUrl = data.checkout_url || data.checkoutUrl;
    if (!checkoutUrl) {
      return res.status(502).json({ error: 'Checkout URL was not returned by Creem.' });
    }

    return res.status(200).json({
      checkoutUrl,
      sessionId: data.id,
      environment: config.environment,
    });
  } catch (error) {
    console.error('Unexpected error creating Creem checkout session:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
}
