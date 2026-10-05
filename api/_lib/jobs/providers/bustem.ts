import type { JobSourceCompany, NormalizedJob } from '../types';
import {
  bucketSections,
  buildJobId,
  detectWorkplaceType,
  extractSkills,
  htmlToText,
  inferExperienceLevel,
  logoUrlForDomain,
  mapDepartment,
  mapJobType,
  parseSalarySummary,
  splitHtmlSections,
} from '../normalize';

/**
 * Bustem (bustem.com) careers-page provider.
 *
 * Bustem has no ATS at all — they don't run Greenhouse, Lever, Ashby or any other board.
 * Their careers page is a hand-built Framer site listing every open role on the page, with a
 * separate static detail page per posting. There is no JSON board API and no sitemap of jobs,
 * so `discoverJobSource()` correctly reports "no ATS fingerprint in HTML".
 *
 * Rather than drop the employer (7 open roles, real money, NYC-based), we read their pages
 * directly — the same escape hatch `wise.ts` uses for Wise, which renders client-side and so
 * has no readable board either. Two sources, in order:
 *
 *  1. `https://bustem.com/careers` — the index. Authoritative list of live posting slugs.
 *     Anything absent from here is gone, which is what keeps closed roles out of the feed.
 *
 *  2. `https://bustem.com/careers/{slug}` — one detail page per posting. Framer renders these
 *     server-side, so plain HTTP gets the full body: title, the `Location / Employment Type /
 *     Department / Compensation` fact block, and the description under `Job Overview`.
 *
 * Why detail pages rather than the index alone: the index card only carries a title, a
 * `City · Type · Workplace` line and a pay range. That's enough for a card but not for the
 * detail modal or resume matching, both of which read `description`, `responsibilities` and
 * `requirements`. Seven extra requests per sync is a cheap trade for a real description.
 *
 * No `postedAt` is emitted. Neither page publishes a publication date and we don't invent one,
 * so the feed never pins a Bustem role at "today".
 */

export const BUSTEM_PROVIDER = 'html' as const;

const CAREERS_URL = 'https://bustem.com/careers';
const BASE = 'https://bustem.com';

/** Exported so `fetch-career-jobs.ts` and `jobs-sync.ts` share one declaration. */
export const BUSTEM_COMPANY: JobSourceCompany = {
  name: 'Bustem',
  domain: 'bustem.com',
  careersUrl: CAREERS_URL,
  // No ATS token — this company is handled by its own fetcher, like Wise.
};

/** One posting as advertised on the index page. */
export interface BustemListingEntry {
  slug: string;
  url: string;
  /** `City · Type · Workplace` line from the index card, e.g. `New York, NY · Full time · On-Site`. */
  meta?: string;
  /** Pay range printed on the index card, e.g. `$100K – $130K`. Fallback for the detail page. */
  pay?: string;
}

/**
 * Pull the live posting slugs out of the index page.
 *
 * The index marks each card with a link to `./careers/{slug}`. Anchors without a slug — the
 * page's own `/careers` self-link, nav and footer links — are excluded by requiring a segment
 * after the slash, so only real postings survive.
 *
 * The card's meta and pay lines are captured from a short window after the link. They matter
 * because the two sources disagree on what they know: the index knows the workplace mode
 * (`On-Site`) but not the title, while the detail page knows the title but not the workplace
 * mode. Merging both is the only way to get all three of title, location and workplace type.
 */
export function parseBustemListing(html: string): BustemListingEntry[] {
  const seen = new Set<string>();
  const entries: BustemListingEntry[] = [];
  const anchor = /href="(?:https?:\/\/bustem\.com)?\.?\/?careers\/([a-z0-9][a-z0-9-]*)"/gi;

  let match: RegExpExecArray | null;
  while ((match = anchor.exec(html)) !== null) {
    const slug = match[1].toLowerCase();
    if (seen.has(slug)) continue;
    seen.add(slug);

    const window = html.slice(match.index, match.index + 1600);
    const meta = /<p[^>]*>([^<]*·[^<]*)<\/p>/i.exec(window)?.[1].trim();
    const pay = /<p[^>]*>([^<]*\$[^<]*)<\/p>/i.exec(window)?.[1].trim();

    entries.push({
      slug,
      url: `${BASE}/careers/${slug}`,
      ...(meta ? { meta } : {}),
      ...(pay ? { pay } : {}),
    });
  }

  return entries;
}

/**
 * Turn the `Location / Employment Type / Department / Compensation` block into a field map.
 *
 * Framer renders it as one <p> where labels and values are separated by <br>, so the block is
 * reduced to plain lines first and then walked for known labels. A missing label yields a
 * missing field rather than an invented one.
 */
export function parseBustemFactBlock(paragraphHtml: string): Record<string, string> {
  // Framer emits `<br class="framer-text">`, so the attribute has to be consumed too — a bare
  // `<br\s*\/? >` matches nothing here and the labels collapse onto one line.
  const text = htmlToText(paragraphHtml.replace(/<br[^>]*>/gi, '\n'));
  const labels = ['Location', 'Employment Type', 'Department', 'Compensation'];
  const found: Record<string, string> = {};

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const label = labels.find((l) => lines[i].toLowerCase() === l.toLowerCase());
    if (!label) continue;
    const value = lines[i + 1];
    if (value && !labels.some((l) => l.toLowerCase() === value.toLowerCase())) {
      found[label] = value;
    }
  }

  return found;
}

/**
 * Extract the `<p>` that carries the fact block, or an empty string when the page shape has
 * changed.
 *
 * Anchored on the `Employment Type` label rather than matching `<p>…Employment Type…</p>`
 * outright: a non-greedy `\<p\b[\s\S]*?` scan still starts at the document's *first* `<p>` and
 * spans across intervening `</p>` tags, so it returns the navigation paragraph. Walking out
 * from the label guarantees the paragraph that actually contains it.
 */
function factParagraphHtml(html: string): string {
  const labelIdx = html.indexOf('Employment Type');
  if (labelIdx === -1) return '';

  const open = html.lastIndexOf('<p', labelIdx);
  if (open === -1) return '';

  const close = html.indexOf('</p>', labelIdx);
  if (close === -1 || close < open) return '';

  return html.slice(open, close + 4);
}

/** Body under `data-framer-name="Job Overview"`, i.e. everything after the fact block. */
function overviewHtml(html: string): string {
  const marker = 'data-framer-name="Job Overview"';
  const start = html.indexOf(marker);
  if (start === -1) return '';
  const tail = html.slice(start);

  // The overview div wraps an inner container (`Content Lead Description`) before the action
  // row. Cutting at the first inner `data-framer-name` would therefore keep ~60 characters of
  // an empty wrapper, so cut at the `Apply Button` that closes the section instead.
  const end = tail.indexOf('data-framer-name="Apply Button"');
  return end === -1 ? tail : tail.slice(0, end);
}

/** Title lives in the first <h2> inside the `Job Header` region. */
function detailTitle(html: string): string {
  const headerIdx = html.indexOf('data-framer-name="Job Header"');
  const region = headerIdx === -1 ? html : html.slice(headerIdx);
  const heading = /<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(region);
  return heading ? htmlToText(heading[1]) : '';
}

/**
 * Parse one detail page into the pieces a `NormalizedJob` needs.
 * Returns null when neither a title nor a body can be found, so a broken page is skipped
 * instead of filed as a blank posting.
 */
export function parseBustemDetail(
  html: string,
  entry: BustemListingEntry,
): {
  title: string;
  location: string;
  employmentType: string;
  department: string;
  compensation: string;
  bodyHtml: string;
} | null {
  const title = detailTitle(html);
  const facts = parseBustemFactBlock(factParagraphHtml(html));
  const bodyHtml = overviewHtml(html);

  if (!title && htmlToText(bodyHtml).length < 40) return null;

  return {
    title,
    location: facts.Location || '',
    employmentType: facts['Employment Type'] || '',
    department: facts.Department || '',
    compensation: facts.Compensation || '',
    bodyHtml,
  };
}

/**
 * Normalize one parsed detail page.
 *
 * `raw` keeps the parsed fields (not the whole document) — enough to re-run the mapping if our
 * bucketing changes, without shipping 250 KB of Framer markup per posting into the bundle.
 */
function detailToJob(
  entry: BustemListingEntry,
  company: Pick<JobSourceCompany, 'name' | 'domain'>,
  detail: NonNullable<ReturnType<typeof parseBustemDetail>>,
): NormalizedJob {
  const title = detail.title;
  const location = detail.location || 'Location not specified';
  const sections = splitHtmlSections(detail.bodyHtml);
  const buckets = bucketSections(sections);
  const description = htmlToText(detail.bodyHtml);
  // The detail page never says whether the role is on-site, but the index card does.
  const workplaceType = detectWorkplaceType({
    location,
    text: `${title} ${detail.employmentType} ${entry.meta || ''}`,
  });
  const jobType = mapJobType(detail.employmentType || entry.meta || '');
  const compensation = detail.compensation || entry.pay || '';

  return {
    id: buildJobId(BUSTEM_PROVIDER, `bustem-${entry.slug}`),
    externalId: `bustem-${entry.slug}`,
    provider: BUSTEM_PROVIDER,
    companySlug: 'bustem',
    company: company.name,
    companyLogo: logoUrlForDomain(company.domain),
    title,
    location,
    workplaceType,
    jobType,
    experienceLevel: inferExperienceLevel(title),
    department: mapDepartment(detail.department, title),
    sourceDepartment: detail.department,
    salary: parseSalarySummary(compensation),
    salarySummary: compensation || null,
    description,
    responsibilities: buckets.responsibilities,
    requirements: buckets.requirements,
    benefits: buckets.benefits,
    skills: extractSkills(title, description),
    applyUrl: entry.url,
    sourceUrl: entry.url,
    // Neither page publishes a date; we don't invent one.
    postedAt: null,
    raw: {
      slug: entry.slug,
      location: detail.location,
      employmentType: detail.employmentType,
      department: detail.department,
      compensation,
    },
  };
}

/** Default agent string so Bustem can identify and rate-limit us. */
const BOT_HEADERS = {
  'User-Agent': 'CVArchitect-JobBot/1.0 (+https://cvarchitect.com/bot)',
  Accept: 'text/html,application/xhtml+xml,*/*',
};

/**
 * Fetch every live Bustem posting.
 *
 * Detail pages are read with a small amount of concurrency: 7 sequential round-trips is
 * a noticeable slice of a sync budget, but this is a single employer so the fan-out stays
 * modest. Never throws for an individual posting — a failed detail page is dropped rather
 * than aborting the whole employer.
 */
export async function fetchBustemJobs(
  fetchImpl: typeof fetch = fetch,
  company: Pick<JobSourceCompany, 'name' | 'domain'> = BUSTEM_COMPANY,
  concurrency = 4,
): Promise<NormalizedJob[]> {
  const indexResponse = await fetchImpl(CAREERS_URL, { headers: BOT_HEADERS });
  if (!indexResponse.ok) {
    throw new Error(`bustem careers index returned HTTP ${indexResponse.status}`);
  }

  const indexHtml = await indexResponse.text();
  const entries = parseBustemListing(indexHtml);
  if (!entries.length) {
    throw new Error('bustem careers index parsed but contained no postings');
  }

  const jobs: NormalizedJob[] = [];
  let cursor = 0;

  async function worker() {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      try {
        const response = await fetchImpl(entry.url, { headers: BOT_HEADERS });
        if (!response.ok) continue;
        const detail = parseBustemDetail(await response.text(), entry);
        if (!detail || !detail.title) continue;
        jobs.push(detailToJob(entry, company, detail));
      } catch {
        // One bad posting must not cost us the other six.
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));

  // Stable order: the index page's order is the order Bustem published them in, and a sync
  // that reorders nothing diffs cleanly.
  const order = new Map(entries.map((e, i) => [e.slug, i]));
  jobs.sort((a, b) => (order.get(String(a.raw && (a.raw as { slug: string }).slug)) ?? 0) -
    (order.get(String(b.raw && (b.raw as { slug: string }).slug)) ?? 0));

  if (!jobs.length) {
    throw new Error('bustem detail pages parsed but yielded no postings');
  }

  return jobs;
}
