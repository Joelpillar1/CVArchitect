import { DodoConfig, getDodoApiBaseUrl } from './dodoConfig.ts';

export interface DodoSubscriptionDetails {
  subscriptionId: string;
  customerId?: string;
  productId?: string;
  status?: string;
  cancelAtNextBillingDate?: boolean;
  nextBillingDate?: string;
}

async function dodoFetch(
  config: DodoConfig,
  path: string,
  init: RequestInit
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  const apiBase = getDodoApiBaseUrl(config.environment);
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
      ...(init.headers || {}),
    },
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: response.ok, status: response.status, data };
}

export async function fetchDodoSubscription(
  config: DodoConfig,
  subscriptionId: string
): Promise<DodoSubscriptionDetails | null> {
  const { ok, data } = await dodoFetch(config, `/subscriptions/${subscriptionId}`, {
    method: 'GET',
  });

  if (!ok) return null;

  return {
    subscriptionId: (data.subscription_id as string) || subscriptionId,
    customerId: data.customer_id as string | undefined,
    productId: data.product_id as string | undefined,
    status: data.status as string | undefined,
    cancelAtNextBillingDate: Boolean(data.cancel_at_next_billing_date),
    nextBillingDate: data.next_billing_date as string | undefined,
  };
}

export async function cancelDodoSubscriptionAtPeriodEnd(
  config: DodoConfig,
  subscriptionId: string
): Promise<{ success: boolean; error?: string }> {
  const { ok, status, data } = await dodoFetch(config, `/subscriptions/${subscriptionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ cancel_at_next_billing_date: true }),
  });

  if (!ok) {
    const message =
      (data.error as string | undefined) ||
      (data.message as string | undefined) ||
      `Failed to cancel subscription (${status})`;
    return { success: false, error: message };
  }

  return { success: true };
}

export async function changeDodoSubscriptionPlan(
  config: DodoConfig,
  subscriptionId: string,
  productId: string,
  options: {
    direction: 'upgrade' | 'downgrade' | 'same';
    userId: string;
    planId: string;
  }
): Promise<{ success: boolean; error?: string; scheduled?: boolean }> {
  const isDowngrade = options.direction === 'downgrade';
  const body = {
    product_id: productId,
    quantity: 1,
    proration_billing_mode: isDowngrade ? 'do_not_bill' : 'difference_immediately',
    effective_at: isDowngrade ? 'next_billing_date' : 'immediately',
    on_payment_failure: 'prevent_change',
    metadata: {
      user_id: options.userId,
      plan_id: options.planId,
    },
  };

  const { ok, status, data } = await dodoFetch(
    config,
    `/subscriptions/${subscriptionId}/change-plan`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );

  if (!ok) {
    const message =
      (data.error as string | undefined) ||
      (data.message as string | undefined) ||
      `Failed to change plan (${status})`;
    return { success: false, error: message };
  }

  return { success: true, scheduled: isDowngrade };
}

export async function createDodoCustomerPortalSession(
  config: DodoConfig,
  customerId: string,
  returnUrl: string
): Promise<{ success: boolean; link?: string; error?: string }> {
  const params = new URLSearchParams({ return_url: returnUrl });
  const { ok, status, data } = await dodoFetch(
    config,
    `/customers/${customerId}/customer-portal/session?${params.toString()}`,
    { method: 'POST', body: JSON.stringify({}) }
  );

  if (!ok) {
    const message =
      (data.error as string | undefined) ||
      (data.message as string | undefined) ||
      `Failed to open billing portal (${status})`;
    return { success: false, error: message };
  }

  const link = data.link as string | undefined;
  if (!link) return { success: false, error: 'Billing portal link was not returned.' };
  return { success: true, link };
}
