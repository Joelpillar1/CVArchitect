/**
 * First-party attribution for AI answer engines.
 *
 * Why this exists: AI assistants send a small but disproportionately valuable
 * slice of traffic. This module records where a visitor actually came from
 * (ChatGPT, Perplexity, Claude, Copilot, Gemini, plain search, social, direct)
 * and keeps it on the visitor until they sign up, so the signup row carries the
 * source instead of collapsing into "direct".
 *
 * Behaviour:
 *   - Internal navigation is ignored, so clicking around the site never
 *     overwrites the original source.
 *   - The first non-direct touch and the last non-direct touch are both kept.
 *   - A direct visit never overwrites an existing source.
 *   - Each new external arrival pushes an `attribution_capture` event to
 *     `window.dataLayer` (GTM container GTM-MDN77DFB), so a GA4 tag can record
 *     it without shipping more code.
 *   - At signup, `getAttributionMetadata()` is merged into Supabase
 *     `user_metadata`, which makes this query possible:
 *
 *       select raw_user_meta_data->>'signup_channel' as channel,
 *              raw_user_meta_data->>'signup_source'  as source,
 *              count(*)
 *       from auth.users
 *       where created_at > now() - interval '30 days'
 *       group by 1, 2
 *       order by 3 desc;
 */

export type AttributionChannel = 'ai' | 'search' | 'social' | 'referral' | 'direct';

export interface Attribution {
  channel: AttributionChannel;
  source: string;
  referrer: string;
  landing: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  capturedAt: string;
}

interface AttributionState {
  firstTouch: Attribution;
  lastTouch: Attribution;
}

const STORAGE_KEY = 'cv_attribution_v1';

interface HostRule {
  host: string;
  source: string;
}

/** Checked in order. AI first, because gemini.google.com is also a Google host. */
const AI_HOSTS: HostRule[] = [
  { host: 'chatgpt.com', source: 'chatgpt' },
  { host: 'chat.openai.com', source: 'chatgpt' },
  { host: 'perplexity.ai', source: 'perplexity' },
  { host: 'claude.ai', source: 'claude' },
  { host: 'gemini.google.com', source: 'gemini' },
  { host: 'bard.google.com', source: 'gemini' },
  { host: 'copilot.microsoft.com', source: 'copilot' },
  { host: 'you.com', source: 'you' },
  { host: 'phind.com', source: 'phind' },
  { host: 'poe.com', source: 'poe' },
  { host: 'meta.ai', source: 'meta-ai' },
  { host: 'deepseek.com', source: 'deepseek' },
  { host: 'grok.com', source: 'grok' },
  { host: 'x.ai', source: 'grok' },
  { host: 'chat.mistral.ai', source: 'mistral' },
  { host: 'chat.qwen.ai', source: 'qwen' },
];

const SEARCH_HOSTS: HostRule[] = [
  { host: 'bing.com', source: 'bing' },
  { host: 'duckduckgo.com', source: 'duckduckgo' },
  { host: 'search.yahoo.com', source: 'yahoo' },
  { host: 'yahoo.com', source: 'yahoo' },
  { host: 'ecosia.org', source: 'ecosia' },
  { host: 'search.brave.com', source: 'brave' },
  { host: 'brave.com', source: 'brave' },
  { host: 'yandex.com', source: 'yandex' },
  { host: 'yandex.ru', source: 'yandex' },
  { host: 'baidu.com', source: 'baidu' },
  { host: 'kagi.com', source: 'kagi' },
  { host: 'startpage.com', source: 'startpage' },
];

const SOCIAL_HOSTS: HostRule[] = [
  { host: 'linkedin.com', source: 'linkedin' },
  { host: 'lnkd.in', source: 'linkedin' },
  { host: 'x.com', source: 'x' },
  { host: 'twitter.com', source: 'x' },
  { host: 't.co', source: 'x' },
  { host: 'facebook.com', source: 'facebook' },
  { host: 'fb.com', source: 'facebook' },
  { host: 'instagram.com', source: 'instagram' },
  { host: 'reddit.com', source: 'reddit' },
  { host: 'redd.it', source: 'reddit' },
  { host: 'tiktok.com', source: 'tiktok' },
  { host: 'youtube.com', source: 'youtube' },
  { host: 'youtu.be', source: 'youtube' },
  { host: 'pinterest.com', source: 'pinterest' },
  { host: 'threads.net', source: 'threads' },
  { host: 'news.ycombinator.com', source: 'hacker-news' },
  { host: 'medium.com', source: 'medium' },
  { host: 'quora.com', source: 'quora' },
  { host: 'substack.com', source: 'substack' },
];

/** utm_source values that should be treated as an AI assistant referral. */
const AI_UTM_SOURCES = new Set([
  'chatgpt',
  'openai',
  'perplexity',
  'perplexity-ai',
  'claude',
  'anthropic',
  'gemini',
  'copilot',
  'bing-copilot',
  'you',
  'phind',
  'poe',
  'meta-ai',
  'deepseek',
  'grok',
  'mistral',
  'qwen',
  'llm',
]);

function matchesHost(host: string, rule: string): boolean {
  return host === rule || host.endsWith(`.${rule}`);
}

function findRule(host: string, rules: HostRule[]): HostRule | undefined {
  return rules.find((rule) => matchesHost(host, rule.host));
}

function isGoogleSearchHost(host: string): boolean {
  return host === 'google.com' || host.endsWith('.google.com') || /^google\.[a-z]{2,}(\.[a-z]{2,})?$/.test(host);
}

function isSameOrigin(host: string, currentHost: string): boolean {
  return host === currentHost || host.endsWith(`.${currentHost}`);
}

function readState(): AttributionState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AttributionState>;
    if (!parsed?.firstTouch || !parsed?.lastTouch) return null;

    return parsed as AttributionState;
  } catch {
    return null;
  }
}

function writeState(state: AttributionState): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full quota. Attribution is best effort, never fatal.
  }
}

function pushToDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const target = window as unknown as { dataLayer?: Record<string, unknown>[] };
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push(payload);
}

/**
 * Classifies the current arrival. Returns null for internal navigation, which
 * must not overwrite a real source.
 */
function classifyArrival(url: URL, referrer: string): Attribution | null {
  const utmSource = url.searchParams.get('utm_source')?.trim().toLowerCase() || null;
  const utmMedium = url.searchParams.get('utm_medium')?.trim().toLowerCase() || null;
  const utmCampaign = url.searchParams.get('utm_campaign')?.trim().toLowerCase() || null;

  let host = '';
  if (referrer) {
    try {
      host = new URL(referrer).hostname.toLowerCase();
    } catch {
      host = '';
    }
  }

  if (host && isSameOrigin(host, url.hostname.toLowerCase())) {
    return null;
  }

  const base = {
    referrer: referrer || '',
    landing: url.pathname,
    utmSource,
    utmMedium,
    utmCampaign,
    capturedAt: new Date().toISOString(),
  };

  if (utmSource && AI_UTM_SOURCES.has(utmSource)) {
    return { ...base, channel: 'ai', source: utmSource };
  }

  if (utmMedium === 'ai' || utmMedium === 'llm') {
    return { ...base, channel: 'ai', source: utmSource || 'ai' };
  }

  const aiRule = findRule(host, AI_HOSTS);
  if (aiRule) {
    return { ...base, channel: 'ai', source: aiRule.source };
  }

  if (isGoogleSearchHost(host)) {
    return { ...base, channel: 'search', source: 'google' };
  }

  const searchRule = findRule(host, SEARCH_HOSTS);
  if (searchRule) {
    return { ...base, channel: 'search', source: searchRule.source };
  }

  const socialRule = findRule(host, SOCIAL_HOSTS);
  if (socialRule) {
    return { ...base, channel: 'social', source: socialRule.source };
  }

  if (!host && !utmSource) {
    return { ...base, channel: 'direct', source: 'direct' };
  }

  return { ...base, channel: 'referral', source: host || utmSource || 'unknown' };
}

/**
 * Records the current arrival. Call once at boot, before React renders.
 * Safe to call on every page load.
 */
export function captureAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;

  let url: URL;
  try {
    url = new URL(window.location.href);
  } catch {
    return null;
  }

  const next = classifyArrival(url, document.referrer || '');
  if (!next) {
    // Internal navigation. Keep whatever source brought the visitor in.
    return readState()?.lastTouch ?? null;
  }

  const existing = readState();

  if (next.channel === 'direct' && existing) {
    return existing.lastTouch;
  }

  const state: AttributionState = existing
    ? { firstTouch: existing.firstTouch, lastTouch: next }
    : { firstTouch: next, lastTouch: next };

  writeState(state);

  if (next.channel !== 'direct') {
    pushToDataLayer({
      event: 'attribution_capture',
      attribution_channel: next.channel,
      attribution_source: next.source,
      attribution_landing: next.landing,
      attribution_utm_source: next.utmSource ?? '',
    });

    if (next.channel === 'ai') {
      pushToDataLayer({
        event: 'ai_referral',
        ai_source: next.source,
        landing_path: next.landing,
      });
    }
  }

  return next;
}

/** Most recent non-direct touch, or null when nothing has been recorded. */
export function getAttribution(): Attribution | null {
  return readState()?.lastTouch ?? null;
}

/** Everything worth storing on a user, flattened for Supabase user_metadata. */
export function getAttributionMetadata(): Record<string, string> {
  const state = readState();
  if (!state) return {};

  const { firstTouch, lastTouch } = state;
  const metadata: Record<string, string> = {
    signup_channel: lastTouch.channel,
    signup_source: lastTouch.source,
    signup_landing: lastTouch.landing,
    signup_first_channel: firstTouch.channel,
    signup_first_source: firstTouch.source,
    signup_first_landing: firstTouch.landing,
    signup_captured_at: firstTouch.capturedAt,
  };

  if (lastTouch.referrer) metadata.signup_referrer = lastTouch.referrer.slice(0, 300);
  if (lastTouch.utmSource) metadata.signup_utm_source = lastTouch.utmSource;
  if (lastTouch.utmMedium) metadata.signup_utm_medium = lastTouch.utmMedium;
  if (lastTouch.utmCampaign) metadata.signup_utm_campaign = lastTouch.utmCampaign;

  return metadata;
}

/** Fires the signup event so GA4 can separate AI signups from the rest. */
export function trackSignupAttribution(method: 'email' | 'google'): void {
  const attribution = getAttribution();

  pushToDataLayer({
    event: 'signup_attribution',
    signup_method: method,
    attribution_channel: attribution?.channel ?? 'unknown',
    attribution_source: attribution?.source ?? 'unknown',
  });
}
