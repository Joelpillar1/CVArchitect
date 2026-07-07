import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getDodoConfig } from './dodoConfig';

export type AppPlanId = 'sprint' | 'build' | 'blueprint';

const LEGACY_PLAN_MAP: Record<string, AppPlanId> = {
    week_pass: 'sprint',
    pro_monthly: 'build',
};

export function normalizePlanId(planId: string): AppPlanId | null {
    if (planId === 'sprint' || planId === 'build' || planId === 'blueprint') {
        return planId;
    }
    return LEGACY_PLAN_MAP[planId] ?? null;
}

export function getSupabaseAdmin(): SupabaseClient {
  const config = getDodoConfig();
  return createClient(config.supabaseUrl, config.serviceRoleKey);
}

export function mapProductToPlan(
  productId: string | undefined,
  sprintProductId: string,
  buildProductId: string,
  blueprintProductId: string
): AppPlanId | null {
  if (!productId) return null;
  if (productId === sprintProductId) return 'sprint';
  if (productId === buildProductId) return 'build';
  if (productId === blueprintProductId) return 'blueprint';
  return null;
}

export function getPlanDates(planId: AppPlanId): {
  billingCycle: 'weekly' | 'monthly' | 'quarterly';
  subscriptionStart: Date;
  subscriptionEnd: Date;
} {
  const subscriptionStart = new Date();

  if (planId === 'sprint') {
    const subscriptionEnd = new Date(subscriptionStart);
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);
    return { billingCycle: 'weekly', subscriptionStart, subscriptionEnd };
  }

  if (planId === 'build') {
    const subscriptionEnd = new Date(subscriptionStart);
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    return { billingCycle: 'monthly', subscriptionStart, subscriptionEnd };
  }

  const subscriptionEnd = new Date(subscriptionStart);
  subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 3);
  return { billingCycle: 'quarterly', subscriptionStart, subscriptionEnd };
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

export async function activateSubscription(
  supabaseAdmin: SupabaseClient,
  userId: string,
  planId: AppPlanId
): Promise<{ success: boolean; error?: string }> {
  const { billingCycle, subscriptionStart, subscriptionEnd } = getPlanDates(planId);
  const credits = 999999;

  const { data: existingSub } = await supabaseAdmin
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .single();

  const payload = {
    plan_id: planId,
    credits,
    billing_cycle: billingCycle,
    subscription_start: subscriptionStart.toISOString(),
    subscription_end: subscriptionEnd.toISOString(),
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  if (existingSub) {
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update(payload)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to update subscription:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  const { error } = await supabaseAdmin.from('subscriptions').insert({
    user_id: userId,
    ...payload,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to create subscription:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function downgradeSubscription(
  supabaseAdmin: SupabaseClient,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: currentSub } = await supabaseAdmin
    .from('subscriptions')
    .select('plan_id, credits')
    .eq('user_id', userId)
    .single();

  const newCredits = currentSub?.plan_id === 'free' ? currentSub.credits : 1;

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      plan_id: 'free',
      credits: newCredits,
      billing_cycle: 'monthly',
      subscription_start: new Date().toISOString(),
      subscription_end: null,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to downgrade subscription:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export function extractWebhookPayload(event: Record<string, unknown>): Record<string, unknown> {
  const data = (event.data ?? {}) as Record<string, unknown>;
  const nested = data.object as Record<string, unknown> | undefined;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return { ...data, ...nested };
  }
  return data;
}

export function extractMetadata(event: Record<string, unknown>): {
  userId?: string;
  planId?: AppPlanId;
  email?: string;
  productId?: string;
} {
  const data = extractWebhookPayload(event);
  const metadata = (data.metadata ?? data.custom_metadata ?? {}) as Record<string, string>;

  const customer = (data.customer ?? {}) as Record<string, string>;
  const productCart = data.product_cart as Array<{ product_id?: string }> | undefined;
  const products = data.products as Array<{ product_id?: string }> | undefined;
  const lineItems = data.line_items as Array<{ product_id?: string }> | undefined;

  const productId =
    (data.product_id as string | undefined) ||
    productCart?.[0]?.product_id ||
    products?.[0]?.product_id ||
    lineItems?.[0]?.product_id;

  const planIdRaw = metadata.plan_id || metadata.planId;
  const normalizedPlan = planIdRaw ? normalizePlanId(planIdRaw) : null;

  return {
    userId: metadata.user_id || metadata.userId,
    planId: normalizedPlan ?? undefined,
    email:
      metadata.email ||
      customer.email ||
      (data.customer_email as string | undefined) ||
      (data.email as string | undefined),
    productId,
  };
}
