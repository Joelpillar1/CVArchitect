import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { getDodoConfig } from './_shared/dodoConfig.ts';
import {
  activateSubscription,
  downgradeSubscription,
  extractMetadata,
  findUserIdByEmail,
  getSupabaseAdmin,
  mapProductToPlan,
  AppPlanId,
} from './_shared/subscriptionActivation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'content-type, webhook-id, webhook-signature, webhook-timestamp',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

async function resolveUserAndPlan(
  event: Record<string, unknown>,
  config: ReturnType<typeof getDodoConfig>
): Promise<{ userId: string | null; planId: AppPlanId | null }> {
  const supabaseAdmin = getSupabaseAdmin(config);
  const { userId, planId, email, productId } = extractMetadata(event);

  let finalUserId = userId ?? null;
  if (!finalUserId) {
    finalUserId = await findUserIdByEmail(supabaseAdmin, email);
  }

  let finalPlanId = planId ?? null;
  if (!finalPlanId) {
    finalPlanId = mapProductToPlan(productId, config);
  }

  return { userId: finalUserId, planId: finalPlanId };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  const config = getDodoConfig();

  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Dodo Payments webhook endpoint is active',
        timestamp: new Date().toISOString(),
        environment: {
          hasWebhookSecret: !!config.webhookKey,
          hasSprintProductId: !!config.sprintProductId,
          hasBuildProductId: !!config.buildProductId,
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
  let event: Record<string, unknown>;

  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (config.webhookKey) {
    try {
      const webhook = new Webhook(config.webhookKey);
      await webhook.verify(rawBody, {
        'webhook-id': req.headers.get('webhook-id') || '',
        'webhook-signature': req.headers.get('webhook-signature') || '',
        'webhook-timestamp': req.headers.get('webhook-timestamp') || '',
      });
    } catch (error) {
      console.error('Invalid Dodo webhook signature:', error);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } else {
    console.warn('Dodo webhook secret not set — skipping signature verification');
  }

  const eventType = (event.type as string) || '';
  console.log('Dodo webhook received:', eventType);

  const supabaseAdmin = getSupabaseAdmin(config);

  if (
    eventType === 'payment.succeeded' ||
    eventType === 'subscription.active' ||
    eventType === 'subscription.renewed'
  ) {
    const { userId, planId } = await resolveUserAndPlan(event, config);

    if (!userId) {
      console.error('Missing userId in Dodo event:', JSON.stringify(event));
      return new Response(JSON.stringify({ error: 'Could not resolve user for payment event' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!planId) {
      console.error('Unknown product/plan in Dodo event:', JSON.stringify(event));
      return new Response(JSON.stringify({ error: 'Unknown product/plan ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await activateSubscription(supabaseAdmin, userId, planId);
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error || 'Failed to activate subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Subscription activated', userId, planId }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  if (
    eventType === 'subscription.cancelled' ||
    eventType === 'payment.failed' ||
    eventType === 'refund.succeeded'
  ) {
    const { userId, email } = extractMetadata(event);
    const finalUserId = userId ?? (await findUserIdByEmail(supabaseAdmin, email));

    if (!finalUserId) {
      return new Response(JSON.stringify({ error: 'Could not resolve user for downgrade event' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await downgradeSubscription(supabaseAdmin, finalUserId);
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error || 'Failed to downgrade subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Subscription downgraded', userId: finalUserId }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Event ignored', eventType }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
});
