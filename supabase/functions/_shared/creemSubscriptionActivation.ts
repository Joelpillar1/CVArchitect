import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { CreemConfig, CreemPlanId, getCreemApiBaseUrl, getCreemConfig } from './creemConfig.ts';

export function normalizePlanId(planId: string): CreemPlanId | null {
  const normalized = planId.trim().toLowerCase();
  if (normalized === 'lifetime') return 'lifetime';
  if (normalized === 'build' || normalized === 'pro_monthly' || normalized === 'sprint' || normalized === 'blueprint' || normalized === 'week_pass') {
    return 'build';
  }
  return null;
}

export function getSupabaseAdmin(config: CreemConfig): SupabaseClient {
  return createClient(config.supabaseUrl, config.serviceRoleKey);
}

export function mapProductToPlan(
  productId: string | undefined,
  config: CreemConfig
): CreemPlanId | null {
  if (!productId) return null;
  if (config.lifetimeProductId && productId === config.lifetimeProductId) return 'lifetime';
  if (config.buildProductId && productId === config.buildProductId) return 'build';
  return null;
}

function getPlanDates(planId: CreemPlanId) {
  const subscriptionStart = new Date();

  if (planId === 'build') {
    const subscriptionEnd = new Date(subscriptionStart);
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    return { billingCycle: 'monthly', subscriptionStart, subscriptionEnd };
  }

  // Lifetime plan
  const subscriptionEnd = new Date(subscriptionStart);
  subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 100);
  return { billingCycle: 'lifetime', subscriptionStart, subscriptionEnd };
}

export async function findUserIdByEmail(
  supabaseAdmin: SupabaseClient,
  email: string | undefined
): Promise<string | null> {
  if (!email) return null;

  try {
    const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error || !authUsers?.users) return null;

    const match = authUsers.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );
    return match?.id ?? null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

export interface ActivateSubscriptionOptions {
  creemSubscriptionId?: string;
  creemCustomerId?: string;
  subscriptionEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  scheduledPlanId?: string | null;
}

export async function activateSubscription(
  supabaseAdmin: SupabaseClient,
  userId: string,
  planId: CreemPlanId,
  options: ActivateSubscriptionOptions = {}
): Promise<{ success: boolean; error?: string }> {
  const { billingCycle, subscriptionStart, subscriptionEnd } = getPlanDates(planId);
  const credits = 999999;

  const { data: existingSub } = await supabaseAdmin
    .from('subscriptions')
    .select('id, creem_customer_id, creem_subscription_id')
    .eq('user_id', userId)
    .single();

  // If upgrading to Lifetime, auto-cancel previous recurring subscription in Creem
  if (planId === 'lifetime' && existingSub?.creem_subscription_id) {
    try {
      const config = getCreemConfig();
      if (config.apiKey) {
        const apiBase = getCreemApiBaseUrl(config.environment);
        await fetch(`${apiBase}/subscriptions/${existingSub.creem_subscription_id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
          },
          body: JSON.stringify({ mode: 'immediate' }),
        });
        console.log(`Auto-cancelled previous recurring subscription ${existingSub.creem_subscription_id} on lifetime upgrade`);
      }
    } catch (cancelErr) {
      console.warn('Failed to auto-cancel recurring subscription on lifetime activation:', cancelErr);
    }
  }

  const payload: Record<string, unknown> = {
    plan_id: planId,
    credits,
    billing_cycle: billingCycle,
    subscription_start: subscriptionStart.toISOString(),
    subscription_end: options.subscriptionEnd || (subscriptionEnd ? subscriptionEnd.toISOString() : null),
    is_active: true,
    cancel_at_period_end: options.cancelAtPeriodEnd ?? false,
    scheduled_plan_id: options.scheduledPlanId ?? null,
    updated_at: new Date().toISOString(),
  };

  if (options.creemSubscriptionId) {
    payload.creem_subscription_id = options.creemSubscriptionId;
  } else if (planId === 'lifetime') {
    // Lifetime is a one-time purchase, clear recurring subscription ID
    payload.creem_subscription_id = null;
  }
  if (options.creemCustomerId) {
    payload.creem_customer_id = options.creemCustomerId;
  }

  let error;
  if (existingSub) {
    const res = await supabaseAdmin
      .from('subscriptions')
      .update(payload)
      .eq('user_id', userId);
    error = res.error;
  } else {
    payload.user_id = userId;
    payload.created_at = new Date().toISOString();
    const res = await supabaseAdmin.from('subscriptions').insert(payload);
    error = res.error;
  }

  if (error) {
    console.error('Failed to activate subscription:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/** Verify Creem webhook HMAC-SHA256 signature against the raw body */
export async function verifyCreemWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!signatureHeader || !secret) {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const computedSignature = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return computedSignature.toLowerCase() === signatureHeader.trim().toLowerCase();
  } catch (err) {
    console.error('Error verifying Creem signature:', err);
    return false;
  }
}
