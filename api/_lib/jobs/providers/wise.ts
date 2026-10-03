import type { JobSourceCompany, NormalizedJob } from '../types';
import {
  buildJobId,
  detectWorkplaceType,
  extractSkills,
  inferExperienceLevel,
  logoUrlForDomain,
  mapDepartment,
} from '../normalize';

/**
 * Wise (wise.jobs) job provider.
 *
 * wise.jobs runs on the Attrax ATS which renders everything client-side, so there is no
 * public JSON board API we can read directly. Instead, we use two signals:
 *
 *  1. `https://wise.jobs/vacanciessitemap.xml` — an XML sitemap Attrax publishes server-side
 *     containing every live posting's canonical URL and last-modified date. This is the
 *     authoritative list of active jobs and the source of `postedAt`.
 *
 *  2. The URL slug itself — Attrax generates human-readable slugs in the form
 *     `{job-title-kebab}-in-{city-kebab}-jid-{numericId}`, which lets us recover a clean
 *     title and location for every job without a second HTTP round-trip per posting.
 *
 * Limitations of this approach vs. a JSON board API:
 *  - No salary data (not published by Wise).
 *  - No department text (inferred from title via the shared `mapDepartment` helper).
 *  - Description is generic since we don't fetch each job detail page.
 *
 * We could improve accuracy by fetching individual job pages, but their HTML body is also
 * injected via RequireJS after page load, so static HTTP fetching would still return no
 * description. The sitemap approach is therefore the most reliable lightweight strategy.
 */

export const WISE_PROVIDER = 'html' as const; // Use 'html' as the provider tag so it integrates with existing infrastructure

const SITEMAP_URL = 'https://wise.jobs/vacanciessitemap.xml';
const COMPANY_NAME = 'Wise';
const COMPANY_DOMAIN = 'wise.com';
const CAREERS_URL = 'https://wise.jobs/jobs';

/**
 * Parsed entry from the Wise vacancies sitemap.
 */
interface WiseSitemapEntry {
  url: string;
  /** Null when the sitemap entry omits `<lastmod>` — never invented. */
  lastmod: string | null;
  /** Extracted numeric job ID from the `-jid-{n}` suffix. */
  jid: string;
}

/**
 * Parse the raw XML sitemap text into a list of vacancy entries.
 *
 * We deliberately avoid importing a full XML parser to keep the bundle slim —
 * the sitemap structure is simple enough that regex is correct and faster.
 */
export function parseWiseSitemap(xml: string): WiseSitemapEntry[] {
  const entries: WiseSitemapEntry[] = [];

  // Split on <url>...</url> blocks
  const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
  let match: RegExpExecArray | null;

  while ((match = urlBlockRegex.exec(xml)) !== null) {
    const block = match[1];

    const locMatch = /<loc>(https:\/\/wise\.jobs\/job\/[^<]+)<\/loc>/.exec(block);
    const lastmodMatch = /<lastmod>([^<]+)<\/lastmod>/.exec(block);

    if (!locMatch) continue;

    const url = locMatch[1].trim();
    // No lastmod → no date. Falling back to "now" made every sync re-stamp the posting
    // to the current day, pinning old jobs at "Today" forever.
    const lastmod = lastmodMatch ? lastmodMatch[1].trim() : null;

    // Extract jid suffix: -jid-{number} at end of path
    const jidMatch = /-jid-(\d+)$/.exec(url);
    if (!jidMatch) continue;

    entries.push({ url, lastmod, jid: jidMatch[1] });
  }

  return entries;
}

/**
 * Derive a human-readable job title and city from an Attrax URL slug.
 *
 * Slug format: `https://wise.jobs/job/{words}-in-{city}-jid-{n}`
 *
 * Examples:
 *   senior-software-engineer-ii-contacts-team-java-in-london-jid-583
 *     → title: "Senior Software Engineer II - Contacts Team - Java"
 *     → location: "London"
 *
 *   compliance-system-manager-in-tallinn-jid-1143
 *     → title: "Compliance System Manager"
 *     → location: "Tallinn"
 */
export function parseWiseSlug(url: string): { title: string; location: string } {
  // Remove base URL and strip trailing -jid-{n}
  const path = url.replace('https://wise.jobs/job/', '');
  const slug = path.replace(/-jid-\d+$/, '');

  // Find the last occurrence of '-in-' which separates title from city
  const inSepIdx = slug.lastIndexOf('-in-');

  let rawTitle: string;
  let rawCity: string;

  if (inSepIdx !== -1) {
    rawTitle = slug.slice(0, inSepIdx);
    rawCity = slug.slice(inSepIdx + 4); // skip '-in-'
  } else {
    // Fallback: no location separator found
    rawTitle = slug;
    rawCity = '';
  }

  // Convert kebab-case to Title Case and apply some prettification:
  // 1. Split on '-'
  // 2. Capitalise each word
  // 3. Join with spaces; abbreviations like "ii", "iii", "aml", "kyc", "fx" → uppercase
  const ABBREVS = new Set(['ii', 'iii', 'iv', 'vi', 'aml', 'kyc', 'fx', 'ux', 'ui', 'ai',
    'api', 'sdk', 'ml', 'sre', 'hr', 'qa', 'b2b', 'b2c', 'emea', 'apac', 'latam',
    'cto', 'cfo', 'coo', 'vp', 'pm', 'it', 'crm']);

  const toTitle = (kebab: string) =>
    kebab
      .split('-')
      .map((w) => {
        if (!w) return '';
        return ABBREVS.has(w.toLowerCase()) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1);
      })
      .join(' ');

  // The title often contains team sub-names separated by extra -'s which look better as " - "
  // We reconstruct by recognising multi-word 'team' or 'platform' separators.
  // Simple heuristic: capitalise each word and trust the result.
  const title = toTitle(rawTitle);
  const location = rawCity ? toTitle(rawCity) : 'Location not specified';

  return { title, location };
}

/**
 * Normalise one sitemap entry into a `NormalizedJob` ready for persistence.
 */
function sitemapEntryToJob(
  entry: WiseSitemapEntry,
  company: Pick<JobSourceCompany, 'name' | 'domain'>,
): NormalizedJob {
  const { title, location } = parseWiseSlug(entry.url);

  const workplaceType = detectWorkplaceType({ location, text: title });
  const experienceLevel = inferExperienceLevel(title);
  const department = mapDepartment('', title);

  return {
    id: buildJobId(WISE_PROVIDER, `wise-${entry.jid}`),
    externalId: `wise-${entry.jid}`,
    provider: WISE_PROVIDER,
    companySlug: 'wise',
    company: company.name,
    companyLogo: logoUrlForDomain(company.domain),
    title,
    location,
    workplaceType,
    jobType: 'Full-time',
    experienceLevel,
    department,
    sourceDepartment: '',
    salary: null,
    salarySummary: null,
    description: `${title} at ${company.name}. ${location ? `Based in ${location}. ` : ''}Join Wise and help move money around the world instantly, conveniently, and transparently. See the full job description at wise.jobs.`,
    responsibilities: [],
    requirements: [],
    benefits: [
      'Flexible working',
      'Stock options',
      'Annual bonus',
      'Health insurance',
      'Learning & development budget',
      'Mission-driven culture',
    ],
    skills: extractSkills(title, ''),
    applyUrl: entry.url,
    sourceUrl: entry.url,
    postedAt: entry.lastmod,
    raw: entry,
  };
}

/**
 * Fetch all active Wise job postings from their Attrax sitemap.
 *
 * Returns an array of normalized jobs — one per sitemap entry.
 * Never throws; on network failure the caller receives an empty array and should
 * record the error via the standard `CompanySyncResult.error` field.
 */
export async function fetchWiseJobs(
  fetchImpl: typeof fetch = fetch,
  company: Pick<JobSourceCompany, 'name' | 'domain'> = {
    name: COMPANY_NAME,
    domain: COMPANY_DOMAIN,
  },
): Promise<NormalizedJob[]> {
  const response = await fetchImpl(SITEMAP_URL, {
    headers: {
      'User-Agent': 'CVArchitect-JobBot/1.0 (+https://cvarchitect.com/bot)',
      Accept: 'application/xml,text/xml,*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`wise sitemap returned HTTP ${response.status}`);
  }

  const xml = await response.text();
  const entries = parseWiseSitemap(xml);

  if (entries.length === 0) {
    throw new Error('wise sitemap parsed but contained no job entries');
  }

  return entries.map((e) => sitemapEntryToJob(e, company));
}

/** Exported company descriptor for use in `jobCompanies.ts`. */
export const WISE_COMPANY: JobSourceCompany = {
  name: COMPANY_NAME,
  domain: COMPANY_DOMAIN,
  careersUrl: CAREERS_URL,
  // No standard ATS token — we handle this company via its own dedicated fetcher.
  // Provider and slug are intentionally omitted so normal discovery is bypassed.
};
