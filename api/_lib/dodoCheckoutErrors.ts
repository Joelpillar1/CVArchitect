/** Turn Dodo API error payloads into user-actionable checkout messages. */
export function formatDodoCheckoutError(
  details: unknown,
  environment?: string
): string {
  const payload = (details ?? {}) as Record<string, unknown>;
  const code = String(payload.code || payload.error_code || '');
  const message = String(payload.message || payload.error || '');

  const envHint = environment === 'test_mode' ? 'test' : environment === 'live_mode' ? 'live' : 'current';

  if (
    code.includes('PRODUCT') ||
    message.toLowerCase().includes('product') ||
    code === 'MISSING_PRODUCT_INFORMATION'
  ) {
    return `Checkout product mismatch in ${envHint} mode. In Supabase secrets, set DODO_*_PRODUCT_ID to product IDs from the same Dodo ${envHint} environment as DODO_PAYMENTS_API_KEY.`;
  }

  if (code.includes('SUBSCRIPTION') || message.toLowerCase().includes('subscription')) {
    return message || 'This customer already has an active Dodo subscription for this product.';
  }

  if (message) return message;
  return 'Payment provider rejected checkout. Verify Dodo API key, environment, and product IDs match.';
}
