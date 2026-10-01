import type { JobProvider, JobSourceCompany, ResolvedJobSource } from './types';
import { ALL_PROVIDERS, PROVIDER_ADAPTERS } from './providers';
import { companyTokensFromDomain, slugifyCompany } from './normalize';

/**
 * Automatic ATS discovery.
 *
 * The goal: given only a company name and domain, work out *which* applicant-tracking
 * system runs its careers page and under which board token — so the company list does not
 * have to be maintained by hand.
 *
 * Two stages, cheapest first:
 *
 *  1. **Fingerprint** the careers page HTML. Employers embed their ATS everywhere — a
 *     `vercel.com/careers` fetch contains 172 references to `greenhouse.io`. When the
 *     token is visible in a URL (…/boards.greenhouse.io/vercel…), this succeeds in one
 *     request with no guessing.
 *
 *  2. **Probe** candidate tokens when fingerprinting comes up empty. This stage exists
 *     because stage 1 is genuinely insufficient: `openai.com/careers` shows *no* ATS
 *     fingerprint at all (it is client-rendered), yet `openai` is a valid Ashby board with
 *     795 postings. So the domain is turned into token candidates and each provider is
 *     asked directly.
 *
 * Probing deliberately hits *lightweight* endpoints (Greenhouse without `content=true`,
 * Ashby without `includeCompensation=true`, Lever's hosted page) — a full Lever board can
 * be 6 MB and an Ashby board 13 MB, which is far too much data to download just to answer
 * "does this board exist?".
 */

const FETCH_TIMEOUT_MS = 20_000;

/** Careers-page paths worth trying when a company has no explicit `careersUrl`. */
const CAREERS_PATHS = ['/careers', '/jobs', '/careers/jobs', '/company/careers', '/join-us'];

/** ATS host patterns, capturing the board token when the URL discloses it. */
const FINGERPRINTS: Array<{ provider: JobProvider; pattern: RegExp }> = [
  {
    provider: 'greenhouse',
    pattern: /(?:boards|job-boards)\.greenhouse\.io\/(?:embed\/job_board\/?[^"'\s]*?for=|)([a-z0-9][a-z0-9_-]{1,60})/i,
  },
  { provider: 'greenhouse', pattern: /boards-api\.greenhouse\.io\/v1\/boards\/([a-z0-9][a-z0-9_-]{1,60})/i },
  { provider: 'lever', pattern: /jobs\.lever\.co\/([a-z0-9][a-z0-9_-]{1,60})/i },
  { provider: 'lever', pattern: /api\.lever\.co\/v0\/postings\/([a-z0-9][a-z0-9_-]{1,60})/i },
  { provider: 'ashby', pattern: /jobs\.ashbyhq\.com\/([a-z0-9][a-z0-9_-]{1,60})/i },
  { provider: 'ashby', pattern: /api\.ashbyhq\.com\/posting-api\/job-board\/([a-z0-9][a-z0-9_-]{1,60})/i },
];

/** Tokens that appear in ATS URLs but are not company boards. */
const TOKEN_BLOCKLIST = new Set([
  'embed', 'job_board', 'js', 'css', 'api', 'v1', 'static', 'assets', 'images', 'widgets',
  'posting-api', 'job-board', 'jobs', 'boards', 'www', 'com',
]);

export interface DiscoveryResult {
  source: ResolvedJobSource | null;
  /** Human-readable trail of what was tried — surfaced in sync logs. */
  notes: string[];
}

/** A fetch implementation, injectable so discovery can be tested without network access. */
export type FetchLike = typeof fetch;

/** Fetch with an abort-based timeout so a hanging board cannot stall a whole sync. */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  fetchImpl: FetchLike = fetch,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
        Accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Stage 1 — read a company's careers page and look for an embedded ATS board.
 *
 * Returns every distinct (provider, token) pair found, so a page linking to several
 * boards (some companies run Greenhouse for engineering and Lever for sales) still works.
 */
export function fingerprintCareersHtml(html: string): Array<{ provider: JobProvider; slug: string }> {
  if (!html) return [];
  const found = new Map<string, { provider: JobProvider; slug: string }>();

  for (const { provider, pattern } of FINGERPRINTS) {
    const global = new RegExp(pattern.source, 'gi');
    let match: RegExpExecArray | null;
    while ((match = global.exec(html)) !== null) {
      const slug = (match[1] || '').toLowerCase().trim();
      if (!slug || TOKEN_BLOCKLIST.has(slug) || slug.length < 2) continue;
      found.set(`${provider}:${slug}`, { provider, slug });
    }
  }

  return [...found.values()];
}

/**
 * Stage 2 — ask each provider directly whether a token is a live board.
 *
 * Returns the fetched payload when the provider's *light* endpoint is enough to
 * normalize from, letting the caller reuse it instead of issuing a second request.
 */
export async function probeProviderToken(
  provider: JobProvider,
  token: string,
  fetchImpl: FetchLike = fetch,
): Promise<{ ok: boolean }> {
  try {
    if (provider === 'lever') {
      // No cheap JSON endpoint exists for Lever, so test the hosted board page instead of
      // downloading a multi-megabyte postings array just to check existence.
      const response = await fetchWithTimeout(`https://jobs.lever.co/${encodeURIComponent(token)}`, {}, fetchImpl);
      if (!response.ok) return { ok: false };
      const body = await response.text();
      // Lever serves its own 404 page with a 200 in some configurations.
      if (/page not found|posting not found|no longer available/i.test(body) && body.length < 4000) {
        return { ok: false };
      }
      return { ok: true };
    }

    // Greenhouse and Ashby both have a lightweight variant without descriptions/pay.
    const url =
      provider === 'greenhouse'
        ? `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs`
        : `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(token)}`;

    const response = await fetchWithTimeout(url, {}, fetchImpl);
    if (!response.ok) return { ok: false };

    const payload = await response.json().catch(() => null);
    if (!payload || !Array.isArray((payload as { jobs?: unknown[] }).jobs)) return { ok: false };
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/**
 * Resolve a company into something fetchable.
 *
 * Order of preference:
 *  1. An explicitly declared provider/slug (no network at all).
 *  2. Fingerprinting the careers page.
 *  3. Probing domain-derived tokens across all providers.
 *  4. Give up and return null — the sync reports the company as unresolved rather than
 *     silently fetching nothing.
 */
export async function discoverJobSource(
  company: JobSourceCompany,
  fetchImpl: FetchLike = fetch,
): Promise<DiscoveryResult> {
  const notes: string[] = [];

  // 1. Declared up front.
  if (company.provider && company.slug) {
    return {
      source: {
        company: company.name,
        domain: company.domain,
        provider: company.provider,
        slug: company.slug,
        careersUrl: company.careersUrl || `https://${company.domain}/careers`,
        detection: 'declared',
      },
      notes: [`Using declared ${company.provider} board "${company.slug}".`],
    };
  }

  // 2. Fingerprint the careers page.
  const careersCandidates = company.careersUrl
    ? [company.careersUrl]
    : CAREERS_PATHS.map((path) => `https://${company.domain}${path}`);

  for (const careersUrl of careersCandidates) {
    try {
      const response = await fetchWithTimeout(careersUrl, {}, fetchImpl);
      if (!response.ok) {
        notes.push(`${careersUrl} → HTTP ${response.status}`);
        continue;
      }

      const html = await response.text();
      const matches = fingerprintCareersHtml(html);

      if (!matches.length) {
        notes.push(`${careersUrl} → no ATS fingerprint in HTML`);
        continue;
      }

      // Prefer the declared provider when the page references several boards.
      const ordered = company.provider
        ? [...matches].sort((a, b) => (a.provider === company.provider ? -1 : b.provider === company.provider ? 1 : 0))
        : matches;

      for (const match of ordered) {
        notes.push(`${careersUrl} → fingerprint ${match.provider}:${match.slug}`);
        return {
          source: {
            company: company.name,
            domain: company.domain,
            provider: match.provider,
            slug: match.slug,
            careersUrl,
            detection: 'fingerprint',
          },
          notes,
        };
      }
    } catch (err) {
      notes.push(`${careersUrl} → ${(err as Error).message}`);
    }
  }

  // 3. Probe candidate tokens.
  //
  // The slugified display NAME is included alongside the domain, because a board token
  // frequently does not match the domain: Datadog's Greenhouse board is `datadog` while its
  // domain is `datadoghq.com`, so domain-derived tokens alone never find it.
  const tokens = [
    ...(company.slug ? [company.slug] : []),
    slugifyCompany(company.name),
    ...companyTokensFromDomain(company.domain),
  ];
  const uniqueTokens = [...new Set(tokens)].filter(Boolean);

  const providersToProbe: JobProvider[] = company.provider ? [company.provider] : ALL_PROVIDERS;

  for (const token of uniqueTokens) {
    for (const provider of providersToProbe) {
      const result = await probeProviderToken(provider, token, fetchImpl);
      if (!result.ok) continue;

      // The probe only proves the board exists. Its lightweight payload deliberately omits
      // descriptions/pay, so the sync re-fetches the full board rather than normalizing
      // from this response — otherwise every job would land with an empty description.
      notes.push(`probe hit ${provider}:${token}`);
      return {          source: {
            company: company.name,
            domain: company.domain,
            provider,
            slug: token,
            careersUrl: company.careersUrl || `https://${company.domain}/careers`,
            detection: 'probe',
          },
        notes,
      };
    }
  }

  notes.push('No ATS board found for this company.');
  return { source: null, notes };
}

/** Build the canonical public board URL for a resolved source (used for provenance display). */
export function boardUrlFor(source: ResolvedJobSource): string {
  if (source.provider === 'html') return source.careersUrl;
  return PROVIDER_ADAPTERS[source.provider].buildUrl(source.slug);
}
