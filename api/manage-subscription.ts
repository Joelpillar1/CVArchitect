import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { getCreemApiBaseUrl, getCreemConfig } from './_lib/creemConfig';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const config = getCreemConfig();
  if (!config.apiKey) {
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

  const user = authData.user;
  const { action, customerId: inputCustId, subscriptionId: inputSubId } = req.body || {};
  const apiBase = getCreemApiBaseUrl(config.environment);

  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (action === 'link_subscription') {
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (inputSubId) updates.creem_subscription_id = inputSubId;
    if (inputCustId) updates.creem_customer_id = inputCustId;

    await supabaseAdmin.from('subscriptions').update(updates).eq('user_id', user.id);
    return res.status(200).json({ success: true });
  }

  if (action === 'portal') {
    let customerId =
      subscription?.creem_customer_id ||
      subscription?.dodo_customer_id;

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
      return res.status(400).json({ error: 'No active billing customer found. Please subscribe first.' });
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
        return res.status(502).json({
          error: portalData.message || 'Failed to generate billing portal link.',
        });
      }

      return res.status(200).json({ success: true, portalUrl });
    } catch (err) {
      return res.status(500).json({
        error: err instanceof Error ? err.message : 'Portal request failed',
      });
    }
  }

  if (action === 'cancel') {
    const creemSubId =
      subscription?.creem_subscription_id ||
      subscription?.dodo_subscription_id;

    if (!creemSubId) {
      return res.status(400).json({ error: 'No active subscription found to cancel.' });
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
        return res.status(502).json({
          error: cancelData.message || 'Failed to cancel subscription with Creem.',
        });
      }

      await supabaseAdmin
        .from('subscriptions')
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      return res.status(200).json({
        success: true,
        message: 'Subscription will cancel at the end of your billing period.',
      });
    } catch (err) {
      return res.status(500).json({
        error: err instanceof Error ? err.message : 'Cancel request failed',
      });
    }
  }

  return res.status(400).json({ error: `Unknown action: ${action}` });
}
