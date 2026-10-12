import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCreemConfig } from './_lib/creemConfig';
import {
  activateSubscription,
  findUserIdByEmail,
  getSupabaseAdmin,
  mapProductToPlan,
  normalizePlanId,
  verifyCreemWebhookSignature,
} from './_lib/creemSubscriptionActivation';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, creem-signature');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const creemConfig = getCreemConfig();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Creem webhook endpoint is active',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawBody = await getRawBody(req);
  let event: Record<string, any>;

  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const signatureHeader = req.headers['creem-signature'] as string | undefined;
  if (creemConfig.webhookSecret) {
    const isValid = verifyCreemWebhookSignature(
      rawBody,
      signatureHeader || null,
      creemConfig.webhookSecret
    );
    if (!isValid) {
      console.error('Invalid Creem webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const eventType = event.eventType || event.event_type || event.type;
  const eventObject = event.object || {};
  console.log(`Received Creem webhook event: ${eventType}`, { id: event.id });

  const supabaseAdmin = getSupabaseAdmin(creemConfig);

  try {
    switch (eventType) {
      case 'checkout.completed': {
        const metadata = eventObject.metadata || {};
        const customer = eventObject.customer || {};
        const subscription = eventObject.subscription || null;
        const product = eventObject.product || {};

        let userId = metadata.userId || metadata.user_id || null;
        const customerEmail = customer.email || metadata.email;

        if (!userId && customerEmail) {
          userId = await findUserIdByEmail(supabaseAdmin, customerEmail);
        }

        const rawPlan = metadata.planId || metadata.plan_id;
        let planId = rawPlan ? normalizePlanId(rawPlan) : null;
        if (!planId) {
          const productId = typeof product === 'string' ? product : product.id;
          planId = mapProductToPlan(productId, creemConfig);
        }

        if (!userId) {
          console.warn('checkout.completed: User not found for email:', customerEmail);
          return res.status(200).json({ success: false, message: 'User not found' });
        }

        if (!planId) {
          planId = 'build';
        }

        const subId = typeof subscription === 'string' ? subscription : subscription?.id;
        const custId = typeof customer === 'string' ? customer : customer?.id;

        await activateSubscription(supabaseAdmin, userId, planId, {
          creemSubscriptionId: subId || undefined,
          creemCustomerId: custId || undefined,
        });
        break;
      }

      case 'subscription.paid':
      case 'subscription.active': {
        const metadata = eventObject.metadata || {};
        const customer = eventObject.customer || {};
        const product = eventObject.product || {};

        let userId = metadata.userId || metadata.user_id || null;
        const customerEmail = customer.email || metadata.email;

        if (!userId && customerEmail) {
          userId = await findUserIdByEmail(supabaseAdmin, customerEmail);
        }

        const rawPlan = metadata.planId || metadata.plan_id;
        let planId = rawPlan ? normalizePlanId(rawPlan) : null;
        if (!planId) {
          const productId = typeof product === 'string' ? product : product.id;
          planId = mapProductToPlan(productId, creemConfig);
        }

        if (!userId) {
          const subId = eventObject.id;
          const { data: existingSub } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id, plan_id')
            .eq('creem_subscription_id', subId)
            .single();

          if (existingSub) {
            userId = existingSub.user_id;
            planId = planId || existingSub.plan_id;
          }
        }

        if (userId && planId) {
          const subId = eventObject.id;
          const custId = typeof customer === 'string' ? customer : customer?.id;
          const periodEnd = eventObject.current_period_end_date || null;

          await activateSubscription(supabaseAdmin, userId, planId, {
            creemSubscriptionId: subId,
            creemCustomerId: custId,
            subscriptionEnd: periodEnd,
            cancelAtPeriodEnd: false,
          });
        }
        break;
      }

      case 'subscription.canceled': {
        const subId = eventObject.id;
        if (subId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              is_active: false,
              plan_id: 'free',
              credits: 1,
              cancel_at_period_end: false,
              updated_at: new Date().toISOString(),
            })
            .eq('creem_subscription_id', subId);
        }
        break;
      }

      case 'subscription.scheduled_cancel': {
        const subId = eventObject.id;
        if (subId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              cancel_at_period_end: true,
              updated_at: new Date().toISOString(),
            })
            .eq('creem_subscription_id', subId);
        }
        break;
      }

      default:
        console.log(`Unhandled Creem event: ${eventType}`);
        break;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing Creem webhook:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Webhook error',
    });
  }
}
