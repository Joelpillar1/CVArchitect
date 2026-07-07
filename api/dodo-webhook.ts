import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Webhook } from 'standardwebhooks';
import { getDodoConfig } from './lib/dodoConfig';
import {
  activateSubscription,
  extractMetadata,
  finalizeDowngrade,
  findUserIdByEmail,
  getSupabaseAdmin,
  linkDodoSubscription,
  mapProductToPlan,
  markCancelAtPeriodEnd,
  AppPlanId,
} from './lib/subscriptionActivation';

async function getRawBody(req: VercelRequest): Promise<string> {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function resolveUserAndPlan(event: Record<string, unknown>): Promise<{
  userId: string | null;
  planId: AppPlanId | null;
}> {
  const config = getDodoConfig();
  const supabaseAdmin = getSupabaseAdmin();
  const { userId, planId, email, productId } = extractMetadata(event);

  let finalUserId = userId ?? null;
  if (!finalUserId) {
    finalUserId = await findUserIdByEmail(supabaseAdmin, email);
  }

  let finalPlanId = planId ?? null;
  if (!finalPlanId) {
    finalPlanId = mapProductToPlan(
      productId,
      config.sprintProductId,
      config.buildProductId,
      config.blueprintProductId
    );
  }

  return { userId: finalUserId, planId: finalPlanId };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const config = getDodoConfig();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, webhook-id, webhook-signature, webhook-timestamp'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Dodo Payments webhook endpoint is active',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const rawBody = await getRawBody(req);
  let event: Record<string, unknown>;

  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  if (config.webhookKey) {
    try {
      const webhook = new Webhook(config.webhookKey);
      await webhook.verify(rawBody, {
        'webhook-id': (req.headers['webhook-id'] as string) || '',
        'webhook-signature': (req.headers['webhook-signature'] as string) || '',
        'webhook-timestamp': (req.headers['webhook-timestamp'] as string) || '',
      });
    } catch (error) {
      console.error('Invalid Dodo webhook signature:', error);
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const eventType = (event.type as string) || '';
  const supabaseAdmin = getSupabaseAdmin();
  const meta = extractMetadata(event);

  if (eventType === 'subscription.updated' && meta.cancelAtNextBillingDate) {
    const finalUserId = meta.userId ?? (await findUserIdByEmail(supabaseAdmin, meta.email));
    if (!finalUserId) {
      return res.status(400).json({ error: 'Could not resolve user for cancellation event' });
    }

    await markCancelAtPeriodEnd(supabaseAdmin, finalUserId);
    if (meta.subscriptionId) {
      await linkDodoSubscription(supabaseAdmin, finalUserId, meta.subscriptionId, meta.customerId);
    }

    return res.status(200).json({ success: true, message: 'Cancellation scheduled', userId: finalUserId });
  }

  if (
    eventType === 'payment.succeeded' ||
    eventType === 'subscription.active' ||
    eventType === 'subscription.renewed' ||
    eventType === 'subscription.updated' ||
    eventType === 'subscription.plan_changed' ||
    eventType === 'checkout.session.completed'
  ) {
    const { userId, planId } = await resolveUserAndPlan(event);

    if (!userId || !planId) {
      return res.status(400).json({ error: 'Could not resolve user or plan for payment event' });
    }

    const result = await activateSubscription(supabaseAdmin, userId, planId, {
      dodoSubscriptionId: meta.subscriptionId,
      dodoCustomerId: meta.customerId,
      subscriptionEnd: meta.nextBillingDate ?? undefined,
      cancelAtPeriodEnd: meta.cancelAtNextBillingDate ? true : false,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Failed to activate subscription' });
    }

    return res.status(200).json({ success: true, message: 'Subscription activated', userId, planId });
  }

  if (
    eventType === 'subscription.cancelled' ||
    eventType === 'payment.failed' ||
    eventType === 'refund.succeeded'
  ) {
    const finalUserId = meta.userId ?? (await findUserIdByEmail(supabaseAdmin, meta.email));
    if (!finalUserId) {
      return res.status(400).json({ error: 'Could not resolve user for downgrade event' });
    }

    const result = await finalizeDowngrade(supabaseAdmin, finalUserId);
    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Failed to downgrade subscription' });
    }

    return res.status(200).json({ success: true, message: 'Subscription downgraded', userId: finalUserId });
  }

  return res.status(200).json({ success: true, message: 'Event ignored', eventType });
}
