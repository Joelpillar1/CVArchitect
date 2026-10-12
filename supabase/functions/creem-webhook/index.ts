import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getCreemConfig } from '../_shared/creemConfig.ts';
import {
  activateSubscription,
  findUserIdByEmail,
  getSupabaseAdmin,
  mapProductToPlan,
  normalizePlanId,
  verifyCreemWebhookSignature,
} from '../_shared/creemSubscriptionActivation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, creem-signature, authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  const config = getCreemConfig();

  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Creem webhook endpoint is active',
        timestamp: new Date().toISOString(),
        environment: {
          hasWebhookSecret: !!config.webhookSecret,
          hasBuildProductId: !!config.buildProductId,
          hasLifetimeProductId: !!config.lifetimeProductId,
          hasSprintProductId: !!config.sprintProductId,
          hasBlueprintProductId: !!config.blueprintProductId,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rawBody = await req.text();
  let event: Record<string, any>;

  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Webhook signature verification
  const signatureHeader = req.headers.get('creem-signature');
  if (config.webhookSecret) {
    const isValid = await verifyCreemWebhookSignature(
      rawBody,
      signatureHeader,
      config.webhookSecret
    );
    if (!isValid) {
      console.error('Invalid Creem webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } else {
    console.warn('CREEM_WEBHOOK_SECRET is not configured; skipping signature verification');
  }

  const eventType = event.eventType || event.event_type || event.type;
  const eventObject = event.object || {};
  console.log(`Received Creem webhook event: ${eventType}`, { id: event.id });

  const supabaseAdmin = getSupabaseAdmin(config);

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
          planId = mapProductToPlan(productId, config);
        }

        if (!userId) {
          console.warn('checkout.completed: User not found for email:', customerEmail);
          return new Response(
            JSON.stringify({ success: false, message: 'User not found' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!planId) {
          console.warn('checkout.completed: Plan could not be identified, defaulting to build');
          planId = 'build';
        }

        const subId = typeof subscription === 'string' ? subscription : subscription?.id;
        const custId = typeof customer === 'string' ? customer : customer?.id;

        const result = await activateSubscription(supabaseAdmin, userId, planId, {
          creemSubscriptionId: subId || undefined,
          creemCustomerId: custId || undefined,
        });

        console.log(`Activated plan ${planId} for user ${userId}`, result);
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
          planId = mapProductToPlan(productId, config);
        }

        if (!userId) {
          // Try finding by subscription ID or customer ID in database
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
        console.log('subscription.canceled for subId:', subId);

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
        console.log('subscription.scheduled_cancel for subId:', subId);

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
        console.log(`Unhandled Creem event type: ${eventType}`);
        break;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing Creem webhook:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Processing error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
