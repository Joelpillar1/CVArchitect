/**
 * Minilytics browser helpers.
 *
 * The tracking script exposes `window.minilytics` as a queue function. Keep
 * every call optional-chained so a blocked script never breaks the app.
 */

export interface MinilyticsAttribution {
  ml_visitor_id: string;
  ml_session_id: string;
}

function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';

  const prefix = `${name}=`;
  const match = document.cookie
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

/** Read the visitor and session ids from the script API or its first-party cookies. */
export function getMinilyticsAttribution(): MinilyticsAttribution {
  let fromApi: { ml_visitor_id?: string; ml_session_id?: string } | undefined;

  if (typeof window !== 'undefined') {
    try {
      fromApi = window.minilytics?.attribution?.();
    } catch {
      fromApi = undefined;
    }
  }

  return {
    ml_visitor_id: fromApi?.ml_visitor_id || readCookie('ml_vid'),
    ml_session_id: fromApi?.ml_session_id || readCookie('ml_sid'),
  };
}

/** Fire a Minilytics goal without letting analytics break a user flow. */
export function trackMinilyticsGoal(goal: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  try {
    window.minilytics?.('goal', goal, properties);
  } catch {
    // Analytics must never break a user flow.
  }
}

/** Link the anonymous visit to the signed-in user. */
export function identifyMinilyticsUser(user: {
  id: string;
  email?: string | null;
  name?: string | null;
}): void {
  if (!user?.id || typeof window === 'undefined') return;

  try {
    window.minilytics?.('identify', {
      user_id: user.id,
      email: user.email || undefined,
      name: user.name || undefined,
    });
  } catch {
    // Analytics must never break a user flow.
  }
}
