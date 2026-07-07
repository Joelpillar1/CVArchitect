import { FunctionsHttpError, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { PlanId } from '../types/pricing';
import { getAppOrigin } from '../utils/appUrl';

interface CheckoutSessionResponse {
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
  details?: unknown;
  environment?: string;
}

function getSupabaseAnonKey(): string {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  return anonKey || publishableKey || '';
}

function getCheckoutErrorMessage(data: CheckoutSessionResponse, fallback: string): string {
  if (data.error) return data.error;
  return fallback;
}

async function readFunctionsError(error: FunctionsHttpError): Promise<CheckoutSessionResponse> {
  try {
    return (await error.context.json()) as CheckoutSessionResponse;
  } catch {
    return {};
  }
}

/** Wait for Supabase session after OAuth or signup (token may lag behind user state). */
export async function waitForAuthSession(timeoutMs = 15000): Promise<Session> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return session;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error('Please sign in to upgrade your plan.');
}

async function invokeEdgeCheckout(planId: PlanId, returnOrigin: string): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke<CheckoutSessionResponse>(
    'create-checkout-session',
    {
      body: { planId, returnOrigin },
    }
  );

  if (!error && data?.checkoutUrl) {
    return data.checkoutUrl;
  }

  if (error instanceof FunctionsHttpError) {
    const body = await readFunctionsError(error);
    const message = getCheckoutErrorMessage(body, error.message);
    console.warn('Edge checkout invoke failed:', message, body);
    throw new Error(message);
  }

  if (error) {
    console.warn('Edge checkout invoke failed:', error.message, error);
  }

  return null;
}

async function fetchVercelCheckout(
  planId: PlanId,
  session: Session,
  returnOrigin: string
): Promise<string | null> {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ planId, returnOrigin }),
    });

    const data: CheckoutSessionResponse = await response.json().catch(() => ({}));

    if (response.ok && data.checkoutUrl) {
      return data.checkoutUrl;
    }

    const message = getCheckoutErrorMessage(data, `Checkout failed (${response.status})`);
    console.warn('Vercel checkout fallback failed:', message, data);
    if (!response.ok) {
      throw new Error(message);
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    console.warn('Vercel checkout fallback error:', err);
  }

  return null;
}

async function fetchDirectEdgeCheckout(
  planId: PlanId,
  session: Session,
  returnOrigin: string
): Promise<string | null> {
  const edgeUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
  const apikey = getSupabaseAnonKey();

  if (!edgeUrl || !apikey) return null;

  try {
    const response = await fetch(edgeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
        apikey,
      },
      body: JSON.stringify({ planId, returnOrigin }),
    });

    const data: CheckoutSessionResponse = await response.json().catch(() => ({}));

    if (response.ok && data.checkoutUrl) {
      return data.checkoutUrl;
    }

    const message = getCheckoutErrorMessage(
      data,
      `Checkout failed (${response.status}). Is create-checkout-session deployed?`
    );
    console.warn('Direct edge checkout failed:', message, data);
    if (!response.ok) {
      throw new Error(message);
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Checkout')) {
      throw err;
    }
    console.warn('Direct edge checkout error:', err);
  }

  return null;
}

/**
 * Create a Dodo Payments checkout session via Supabase Edge Function (with fallbacks).
 */
export async function createCheckoutSession(planId: PlanId): Promise<string> {
  const session = await waitForAuthSession();
  const returnOrigin = getAppOrigin();

  try {
    const checkoutUrl = await invokeEdgeCheckout(planId, returnOrigin);
    if (checkoutUrl) return checkoutUrl;
  } catch (err) {
    // Surface explicit Dodo/config errors from the primary edge path.
    throw err;
  }

  const checkoutUrl =
    (await fetchDirectEdgeCheckout(planId, session, returnOrigin)) ||
    (await fetchVercelCheckout(planId, session, returnOrigin));

  if (!checkoutUrl) {
    throw new Error(
      'Failed to start checkout. Ensure create-checkout-session is deployed to Supabase and Dodo secrets are set.'
    );
  }

  return checkoutUrl;
}

/** Redirect the user to Dodo Payments hosted checkout. */
export async function redirectToCheckout(planId: PlanId): Promise<void> {
  const checkoutUrl = await createCheckoutSession(planId);
  window.location.assign(checkoutUrl);
}

export type ManageSubscriptionAction = 'cancel' | 'change_plan' | 'portal' | 'link_subscription';

interface ManageSubscriptionResponse {
  success?: boolean;
  error?: string;
  message?: string;
  portalUrl?: string;
  scheduled?: boolean;
  planId?: PlanId;
  requiresCheckout?: boolean;
}

async function invokeManageSubscription(
  body: Record<string, unknown>
): Promise<ManageSubscriptionResponse> {
  const session = await waitForAuthSession();
  const returnOrigin = getAppOrigin();

  const { data, error } = await supabase.functions.invoke<ManageSubscriptionResponse>(
    'manage-subscription',
    { body: { ...body, returnOrigin } }
  );

  if (!error && data) {
    if (data.error) {
      const err = new Error(data.error) as Error & { requiresCheckout?: boolean };
      if (data.requiresCheckout) err.requiresCheckout = true;
      throw err;
    }
    return data;
  }

  if (error instanceof FunctionsHttpError) {
    const errBody = await readFunctionsError(error);
    if (errBody.error) {
      const err = new Error(errBody.error) as Error & { requiresCheckout?: boolean };
      if (errBody.requiresCheckout) err.requiresCheckout = true;
      throw err;
    }
  }

  const response = await fetch('/api/manage-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ ...body, returnOrigin }),
  });

  const fallbackData: ManageSubscriptionResponse = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(
      fallbackData.error || `Subscription request failed (${response.status})`
    ) as Error & { requiresCheckout?: boolean };
    if (fallbackData.requiresCheckout) err.requiresCheckout = true;
    throw err;
  }

  return fallbackData;
}

export async function linkDodoSubscriptionFromCheckout(subscriptionId: string): Promise<void> {
  await invokeManageSubscription({ action: 'link_subscription', subscriptionId });
}

export async function cancelSubscription(): Promise<string> {
  const data = await invokeManageSubscription({ action: 'cancel' });
  return data.message || 'Subscription will cancel at the end of your billing period.';
}

export async function changeSubscriptionPlan(planId: PlanId): Promise<{
  message: string;
  scheduled: boolean;
}> {
  try {
    const data = await invokeManageSubscription({ action: 'change_plan', planId });
    return {
      message: data.message || 'Plan updated successfully.',
      scheduled: Boolean(data.scheduled),
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('checkout')) {
      const checkoutError = error as Error & { requiresCheckout?: boolean };
      throw checkoutError;
    }
    throw error;
  }
}

export async function openBillingPortal(): Promise<void> {
  const data = await invokeManageSubscription({ action: 'portal' });
  if (!data.portalUrl) {
    throw new Error('Billing portal link was not returned.');
  }
  window.location.assign(data.portalUrl);
}

/** Upgrade or change plan — uses Dodo change-plan API when subscribed, otherwise checkout. */
export async function upgradeToPlan(
  planId: PlanId,
  options?: { hasDodoSubscription?: boolean }
): Promise<{ usedCheckout: boolean; scheduled?: boolean; message?: string }> {
  if (options?.hasDodoSubscription) {
    try {
      const result = await changeSubscriptionPlan(planId);
      return { usedCheckout: false, scheduled: result.scheduled, message: result.message };
    } catch (error) {
      const requiresCheckout =
        typeof error === 'object' &&
        error !== null &&
        'requiresCheckout' in error &&
        Boolean((error as { requiresCheckout?: boolean }).requiresCheckout);

      if (!requiresCheckout) {
        const message = error instanceof Error ? error.message.toLowerCase() : '';
        if (!message.includes('linked') && !message.includes('checkout')) {
          throw error;
        }
      }

      await redirectToCheckout(planId);
      return { usedCheckout: true };
    }
  }

  await redirectToCheckout(planId);
  return { usedCheckout: true };
}

/** Webhook URL to register in Dodo dashboard (uses Supabase secrets). */
export function getDodoWebhookUrl(): string {
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dodo-webhook`;
}
