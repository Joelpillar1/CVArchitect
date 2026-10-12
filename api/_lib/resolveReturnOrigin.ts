const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/cvarchitect\.app$/,
  /^https:\/\/www\.cvarchitect\.app$/,
  /^http:\/\/cvarchitect\.app$/,
  /^http:\/\/www\.cvarchitect\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/,
  /^https:\/\/[\w.-]+\.vercel\.app$/,
];

export function resolveReturnOrigin(requested: string | undefined, fallback: string): string {
  const safeFallback = fallback.replace(/\/$/, '');

  // In local development, Puppeteer runs locally on the host machine.
  // It MUST connect to localhost:5173 so requests coming from phones on WiFi (192.168.x.x)
  // or mobile emulators do not fail due to Windows Firewall socket loopback blocks.
  if (safeFallback.includes('localhost') || safeFallback.includes('127.0.0.1')) {
    return safeFallback;
  }

  if (!requested || typeof requested !== 'string') {
    return safeFallback;
  }

  const normalized = requested.replace(/\/$/, '');

  // If a request from a mobile device on local network reaches a server that knows its fallback
  if (/^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(normalized)) {
    return safeFallback;
  }

  const allowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(normalized));
  return allowed ? normalized : safeFallback;
}
