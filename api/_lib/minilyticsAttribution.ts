export interface MinilyticsAttribution {
  visitorId: string;
  sessionId: string;
}

function readCookie(cookieHeader: string | undefined, name: string): string {
  if (!cookieHeader) return '';

  const prefix = `${name}=`;
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!match) return '';

  const raw = match.slice(prefix.length);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

/**
 * Prefer ids sent by the browser because the Supabase Edge Function lives on a
 * different origin. Fall back to first-party cookies for same-origin requests.
 */
export function getMinilyticsAttribution(
  cookieHeader: string | undefined,
  body?: Record<string, unknown> | null
): MinilyticsAttribution {
  return {
    visitorId: firstString(
      body?.ml_visitor_id,
      body?.mlVisitorId,
      readCookie(cookieHeader, 'ml_vid')
    ),
    sessionId: firstString(
      body?.ml_session_id,
      body?.mlSessionId,
      readCookie(cookieHeader, 'ml_sid')
    ),
  };
}
