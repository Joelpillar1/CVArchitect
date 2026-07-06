import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { PlanId } from '../types/pricing';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId?: string;
  error?: string;
}

/** Wait for Supabase session after OAuth or signup (token may lag behind user state). */
export async function waitForAuthSession(timeoutMs = 10000): Promise<Session> {
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

/**
 * Create a Dodo Payments checkout session via Supabase Edge Function.
 * Dodo API keys are read from Supabase secrets server-side.
 */
export async function createCheckoutSession(planId: PlanId): Promise<string> {
  const session = await waitForAuthSession();

  const supabaseKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${EDGE_FUNCTION_URL}/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      apikey: supabaseKey,
    },
    body: JSON.stringify({ planId }),
  });

  const data: CheckoutSessionResponse = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to start checkout. Please try again.');
  }

  if (!data.checkoutUrl) {
    throw new Error('Checkout URL was not returned. Please contact support.');
  }

  return data.checkoutUrl;
}

/**
 * Redirect the user to Dodo Payments hosted checkout.
 */
export async function redirectToCheckout(planId: PlanId): Promise<void> {
  const checkoutUrl = await createCheckoutSession(planId);
  window.location.assign(checkoutUrl);
}

/** Webhook URL to register in Dodo dashboard (uses Supabase secrets). */
export function getDodoWebhookUrl(): string {
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dodo-webhook`;
}
