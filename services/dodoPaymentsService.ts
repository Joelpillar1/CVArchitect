import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { PlanId } from '../types/pricing';
import { getAppOrigin } from '../utils/appUrl';

interface CheckoutSessionResponse {
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

function getSupabaseAnonKey(): string {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  return anonKey || publishableKey || '';
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

    console.warn('Vercel checkout fallback failed:', data.error || response.status);
  } catch (err) {
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

    const detail = data.error || `HTTP ${response.status}`;
    console.warn('Direct edge checkout failed:', detail);
    if (!response.ok) {
      throw new Error(data.error || `Checkout failed (${response.status}). Is create-checkout-session deployed?`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Checkout failed')) {
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

  const checkoutUrl =
    (await invokeEdgeCheckout(planId, returnOrigin)) ||
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

/** Webhook URL to register in Dodo dashboard (uses Supabase secrets). */
export function getDodoWebhookUrl(): string {
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dodo-webhook`;
}
