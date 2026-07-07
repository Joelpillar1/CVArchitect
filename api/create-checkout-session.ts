import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { normalizePlanId } from './lib/subscriptionActivation';
import {
  getDodoApiBaseUrl,
  getDodoConfig,
  getProductIdForPlan,
  isDodoCheckoutConfigured,
} from './lib/dodoConfig';
import { resolveReturnOrigin } from './lib/resolveReturnOrigin';
import { formatDodoCheckoutError } from './lib/dodoCheckoutErrors';

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

  const accessToken = authHeader.slice(7);
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
  if (authError || !authData.user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  const { planId: rawPlanId, returnOrigin } = req.body || {};
  const planId = normalizePlanId(rawPlanId || '');
  if (!planId) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  const productId = getProductIdForPlan(planId, config);
  if (!productId) {
    return res.status(400).json({ error: 'Plan is not configured for checkout.' });
  }

  const user = authData.user;
  const userName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'Customer';

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const requestOrigin = host ? `${proto}://${host}` : config.appUrl.replace(/\/$/, '');
  const origin = resolveReturnOrigin(returnOrigin || requestOrigin, config.appUrl);
  const returnUrl = `${origin}/dashboard?payment=success&plan=${planId}`;

  try {
    const apiBase = getDodoApiBaseUrl(config.environment);
    console.log('Creating Dodo checkout', { environment: config.environment, apiBase, planId });

    const response = await fetch(`${apiBase}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: { email: user.email, name: userName },
        return_url: returnUrl,
        metadata: { user_id: user.id, plan_id: planId, email: user.email },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Dodo checkout session error:', { status: response.status, data, planId, environment: config.environment });
      return res.status(response.status).json({
        error: formatDodoCheckoutError(data, config.environment),
        details: data,
        environment: config.environment,
      });
    }

    if (!data.checkout_url) {
      return res.status(500).json({ error: 'Checkout URL was not returned by payment provider.' });
    }

    return res.status(200).json({
      checkoutUrl: data.checkout_url,
      sessionId: data.session_id,
      environment: config.environment,
    });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
}
