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
  toIsoString,
} from '../normalize';

/**
 * Greenhouse reader.
 *
 * Greenhouse powers the careers page of a very large share of tech employers (Vercel,
 * Figma, Stripe, GitLab...). Its public board API is the same feed that renders
 * `job-boards.greenhouse.io/{company}`, so reading it is reading the company's own
 * careers page — no aggregator is involved.
 *
 * Endpoint: `GET https://boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true`
 *
 * Quirks handled here:
 *  - `content` arrives as **HTML-escaped HTML**, so it must be decoded before parsing.
 *  - The API never returns an employment type or experience level; `jobType` is null and
 *    seniority is inferred from the title.
 *  - Pay, when published at all, hides in the free-form `metadata[]` array under names
 *    like `"Pay Range"`, so it is parsed opportunistically from there.
 */

export const GREENHOUSE_PROVIDER = 'greenhouse' as const;

export function buildGreenhouseUrl(token: string): string {
  return `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs?content=true`;
}

interface GreenhouseJob {
  /** Optional in practice: malformed rows have been seen, and the adapter skips them. */
  id?: number | string;
  title?: string;
  absolute_url?: string;
  company_name?: string;
  updated_at?: string;
  first_published?: string;
  content?: string;
  location?: { name?: string };
  departments?: Array<{ name?: string }>;
  offices?: Array<{ name?: string }>;
  metadata?: Array<{ name?: string; value?: unknown }>;
}

export interface GreenhousePayload {
  jobs?: GreenhouseJob[];
}

/** Pull a pay range out of Greenhouse's free-form metadata array, if present. */
function salaryFromMetadata(metadata: GreenhouseJob['metadata']): {
  salary: NormalizedJob['salary'];
  summary: string | null;
} {
  for (const entry of metadata || []) {
    const name = (entry.name || '').toLowerCase();
    if (!/pay|salary|compensation|comp\b|wage|rate/.test(name)) continue;
    if (typeof entry.value !== 'string') continue;

    const parsed = parseSalarySummary(entry.value);
    if (parsed) return { salary: parsed, summary: entry.value.trim() };
  }
  return { salary: null, summary: null };
}

export function normalizeGreenhouseJobs(
  payload: GreenhousePayload,
  company: Pick<JobSourceCompany, 'name' | 'domain'>,
  slug: string,
): NormalizedJob[] {
  const jobs = payload?.jobs;
  if (!Array.isArray(jobs)) return [];

  return jobs
    .map((job) => normalizeGreenhouseJob(job, company, slug))
    .filter((job): job is NormalizedJob => job !== null);
}

function normalizeGreenhouseJob(
  job: GreenhouseJob,
  company: Pick<JobSourceCompany, 'name' | 'domain'>,
  slug: string,
): NormalizedJob | null {
  const externalId = job.id !== undefined && job.id !== null ? String(job.id) : '';
  const title = (job.title || '').trim();
  if (!externalId || !title) return null;

  const rawContent = job.content || '';
  const description = htmlToText(rawContent);
  const locationName = job.location?.name?.trim() || '';
  const sourceDepartment =
    job.departments?.map((d) => d.name).filter(Boolean).join(', ') ||
    job.offices?.map((o) => o.name).filter(Boolean).join(', ') ||
    '';

  const { responsibilities, requirements, benefits } = bucketSections(splitHtmlSections(rawContent));
  const { salary, summary } = salaryFromMetadata(job.metadata);
  const postedAt = toIsoString(job.first_published || job.updated_at || null);

  return {
    id: buildJobId(GREENHOUSE_PROVIDER, externalId),
    externalId,
    provider: GREENHOUSE_PROVIDER,
    companySlug: slug,
    company: job.company_name?.trim() || company.name,
    companyLogo: logoUrlForDomain(company.domain),
    title,
    location: locationName || 'Location not specified',
    workplaceType: detectWorkplaceType({
      location: locationName,
      text: `${title} ${description.slice(0, 2000)}`,
    }),
    // Greenhouse exposes no employment type on the board API.
    jobType: mapJobType(null),
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
    applyUrl: job.absolute_url || `https://job-boards.greenhouse.io/${slug}`,
    sourceUrl: job.absolute_url || `https://job-boards.greenhouse.io/${slug}`,
    postedAt,
    raw: job,
  };
}
