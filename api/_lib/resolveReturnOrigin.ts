const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/cvarchitect\.app$/,
  /^https:\/\/www\.cvarchitect\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[\w-]+\.vercel\.app$/,
];

export function resolveReturnOrigin(requested: string | undefined, fallback: string): string {
  const safeFallback = fallback.replace(/\/$/, '');

  if (!requested || typeof requested !== 'string') {
    return safeFallback;
  }

  const normalized = requested.replace(/\/$/, '');
  const allowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(normalized));
  return allowed ? normalized : safeFallback;
}
