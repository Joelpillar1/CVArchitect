import type { JobSourceCompany, NormalizedJob } from '../types';
import {
  buildJobId,
  decodeHtmlEntities,
  detectWorkplaceType,
  extractBullets,
  extractSkills,
  htmlToText,
  inferExperienceLevel,
  logoUrlForDomain,
  mapDepartment,
  mapJobType,
  parseSalarySummary,
  toIsoString,
} from '../normalize';

/**
 * Lever reader.
 *
 * Endpoint: `GET https://api.lever.co/v0/postings/{token}?mode=json`
 * (returns a bare JSON array, not an envelope object).
 *
 * Lever is the most opinionated of the three, and its payload is correspondingly the
 * easiest to normalize:
 *  - `text` is the title, `categories` carries location/team/commitment in one object.
 *  - `workplaceType` is already normalized (`'remote' | 'hybrid' | 'onsite'`), so it is
 *    trusted ahead of any text sniffing.
 *  - Description sections arrive pre-split as `lists[]` with human headings
 *    (`"What We Require"`), which beats parsing a single blob.
 *  - `createdAt` is **epoch milliseconds**, handled by `toIsoString`.
 */

export const LEVER_PROVIDER = 'lever' as const;

export function buildLeverUrl(token: string): string {
  return `https://api.lever.co/v0/postings/${encodeURIComponent(token)}?mode=json`;
}

interface LeverPosting {
  id?: string;
  text?: string;
  createdAt?: number;
  hostedUrl?: string;
  applyUrl?: string;
  workplaceType?: string | null;
  country?: string | null;
  descriptionPlain?: string;
  description?: string;
  categories?: {
    location?: string;
    team?: string;
    department?: string;
    commitment?: string;
    allLocations?: string[];
  };
  lists?: Array<{ text?: string; content?: string }>;
}

/** Lever's board endpoint returns the array directly (no `{ postings: [] }` wrapper). */
export function normalizeLeverJobs(
  payload: unknown,
  company: Pick<JobSourceCompany, 'name' | 'domain'>,
  slug: string,
): NormalizedJob[] {
  const postings = Array.isArray(payload) ? (payload as LeverPosting[]) : [];
  return postings
    .map((posting) => normalizeLeverJob(posting, company, slug))
    .filter((job): job is NormalizedJob => job !== null);
}

const REQUIREMENT = /require|qualification|looking for|you have|you'll need|must have|preferred|who you are|what you bring/i;
const BENEFIT = /benefit|perk|what we offer|why join|we offer|compensation/i;
const RESPONSIBILITY = /responsibilit|what you.ll do|duties|impact|the role|about the role|you will|day to day/i;

function normalizeLeverJob(
  posting: LeverPosting,
  company: Pick<JobSourceCompany, 'name' | 'domain'>,
  slug: string,
): NormalizedJob | null {
  const externalId = (posting.id || '').trim();
  const title = (posting.text || '').trim();
  if (!externalId || !title) return null;

  const categories = posting.categories || {};
  const bodyHtml = posting.description || '';
  const bodyPlain = posting.descriptionPlain || (bodyHtml ? htmlToText(bodyHtml) : '');
  const location = categories.location?.trim() || 'Location not specified';

  // Lever pre-splits the posting into named sections; bucket those by heading.
  const responsibilities: string[] = [];
  const requirements: string[] = [];
  const benefits: string[] = [];
  const extras: string[] = [];

  for (const list of posting.lists || []) {
    const heading = list.text || '';
    // `list.content` is HTML-escaped in some boards, so decode before extracting bullets.
    const bullets = extractBullets(decodeHtmlEntities(list.content || ''), 12);
    if (!bullets.length) continue;

    if (BENEFIT.test(heading)) benefits.push(...bullets);
    else if (REQUIREMENT.test(heading)) requirements.push(...bullets);
    else if (RESPONSIBILITY.test(heading)) responsibilities.push(...bullets);
    else extras.push(heading ? `${heading}` : '', ...bullets);
  }

  // Anything in an unrecognised section is still useful body text for the detail modal.
  const description = [bodyPlain, ...extras.filter(Boolean)].filter(Boolean).join('\n');

  const sourceDepartment = categories.department?.trim() || categories.team?.trim() || '';

  return {
    id: buildJobId(LEVER_PROVIDER, externalId),
    externalId,
    provider: LEVER_PROVIDER,
    companySlug: slug,
    company: company.name,
    companyLogo: logoUrlForDomain(company.domain),
    title,
    location,
    workplaceType: detectWorkplaceType({
      workplaceType: posting.workplaceType,
      location,
      text: description.slice(0, 2000),
    }),
    jobType: mapJobType(categories.commitment),
    experienceLevel: inferExperienceLevel(title),
    department: mapDepartment(sourceDepartment, title),
    sourceDepartment,
    salary: parseSalarySummary(description),
    salarySummary: null,
    description,
    responsibilities: dedupe(responsibilities).slice(0, 12),
    requirements: dedupe(requirements).slice(0, 12),
    benefits: dedupe(benefits).slice(0, 10),
    skills: extractSkills(title, description),
    applyUrl: posting.applyUrl || posting.hostedUrl || `https://jobs.lever.co/${slug}`,
    sourceUrl: posting.hostedUrl || posting.applyUrl || `https://jobs.lever.co/${slug}`,
    postedAt: toIsoString(posting.createdAt ?? null),
    raw: posting,
  };
}

function dedupe(items: string[]): string[] {
  return items.filter((item, idx) => Boolean(item) && items.indexOf(item) === idx);
}
