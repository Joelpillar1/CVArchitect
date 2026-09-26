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
  parseAshbyCompensation,
  splitHtmlSections,
  toIsoString,
} from '../normalize';

/**
 * Ashby reader.
 *
 * Endpoint: `GET https://api.ashbyhq.com/posting-api/job-board/{token}?includeCompensation=true`
 *
 * Ashby is the richest of the three sources and the closest thing to a "real" structured
 * feed:
 *  - `workplaceType` and `isRemote` are explicit, so remote status is not guesswork.
 *  - `employmentType` (`"FullTime"`, `"Contract"`) maps cleanly to the UI enum.
 *  - `publishedAt` is ISO 8601 and only listed postings are returned.
 *  - `compensation` carries real salary ranges **with currency and interval**, making it
 *    the one provider that can populate the salary filter honestly.
 *
 * Requesting `includeCompensation=true` is what surfaces pay; without it the field is
 * omitted, which silently degrades the salary filter to "unknown".
 */

export const ASHBY_PROVIDER = 'ashby' as const;

export function buildAshbyUrl(token: string): string {
  return `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(token)}?includeCompensation=true`;
}

interface AshbyJob {
  id?: string;
  title?: string;
  department?: string | null;
  team?: string | null;
  employmentType?: string | null;
  location?: string | null;
  secondaryLocations?: Array<{ location?: string }>;
  publishedAt?: string | null;
  isListed?: boolean | string | null;
  isRemote?: boolean | string | null;
  workplaceType?: string | null;
  jobUrl?: string;
  applyUrl?: string;
  descriptionHtml?: string;
  descriptionPlain?: string;
  compensation?: Parameters<typeof parseAshbyCompensation>[0];
}

export interface AshbyPayload {
  jobs?: AshbyJob[];
}

/** Ashby sometimes serializes booleans as strings on older boards. */
function asBoolean(value: unknown): boolean | null {
  if (value === true || value === 'true' || value === 'True') return true;
  if (value === false || value === 'false' || value === 'False') return false;
  return null;
}

export function normalizeAshbyJobs(
  payload: AshbyPayload,
  company: Pick<JobSourceCompany, 'name' | 'domain'>,
  slug: string,
): NormalizedJob[] {
  const jobs = payload?.jobs;
  if (!Array.isArray(jobs)) return [];

  return jobs
    .map((job) => normalizeAshbyJob(job, company, slug))
    .filter((job): job is NormalizedJob => job !== null);
}

function normalizeAshbyJob(
  job: AshbyJob,
  company: Pick<JobSourceCompany, 'name' | 'domain'>,
  slug: string,
): NormalizedJob | null {
  const externalId = (job.id || '').trim();
  const title = (job.title || '').trim();
  if (!externalId || !title) return null;

  // Skip postings the employer has pulled from the public board.
  if (asBoolean(job.isListed) === false) return null;

  const rawHtml = job.descriptionHtml || '';
  const description = job.descriptionPlain || (rawHtml ? htmlToText(rawHtml) : '');

  const secondary = (job.secondaryLocations || [])
    .map((entry) => entry?.location)
    .filter((value): value is string => Boolean(value));
  const primaryLocation = job.location?.trim() || '';
  const allLocations = [primaryLocation, ...secondary].filter(Boolean);
  const location = allLocations.length ? allLocations.join(', ') : 'Location not specified';

  const sourceDepartment = job.department?.trim() || job.team?.trim() || '';
  const { responsibilities, requirements, benefits } = bucketSections(splitHtmlSections(rawHtml));
  const { salary, summary } = parseAshbyCompensation(job.compensation);
  const publishedAt = toIsoString(job.publishedAt ?? null);

  return {
    id: buildJobId(ASHBY_PROVIDER, externalId),
    externalId,
    provider: ASHBY_PROVIDER,
    companySlug: slug,
    company: company.name,
    companyLogo: logoUrlForDomain(company.domain),
    title,
    location,
    workplaceType: detectWorkplaceType({
      workplaceType: job.workplaceType,
      isRemote: asBoolean(job.isRemote) === true,
      location,
      text: description.slice(0, 2000),
    }),
    jobType: mapJobType(job.employmentType),
    experienceLevel: inferExperienceLevel(title),
    department: mapDepartment(sourceDepartment, title),
    sourceDepartment,
    salary,
    salarySummary: summary,
    description,
    responsibilities,
    requirements,
    benefits,
    skills: extractSkills(title, description),
    applyUrl: job.applyUrl || job.jobUrl || `https://jobs.ashbyhq.com/${slug}`,
    sourceUrl: job.jobUrl || job.applyUrl || `https://jobs.ashbyhq.com/${slug}`,
    postedAt: publishedAt,
    raw: job,
  };
}
