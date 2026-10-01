import type { Department, ExperienceLevel, JobType, WorkplaceType } from '../../../types/job';

/**
 * Shared contracts for the company-career-page job ingestion pipeline.
 *
 * Every provider in this folder reads the *company's own* applicant-tracking-system
 * board — the same data source that renders that company's careers page. Nothing in
 * this module touches aggregators (LinkedIn / Indeed / Glassdoor); one board always
 * belongs to exactly one employer.
 *
 * The pipeline is deliberately split into pure functions (this file + `normalize.ts`)
 * and effectful ones (`providers/*`, `discovery.ts`) so the mapping logic that turns
 * messy ATS payloads into UI enums can be unit-tested without network access.
 */

/** Applicant-tracking systems we can read directly. */
export type JobProvider = 'greenhouse' | 'lever' | 'ashby';

/** Providers plus the generic HTML fallback used for hand-built careers pages. */
export type AnyJobProvider = JobProvider | 'html';

/**
 * A company we want jobs from.
 *
 * `provider`/`slug` are optional: when omitted, `discovery.ts` probes the company's
 * careers page to work out which ATS it uses and under which board token.
 */
export interface JobSourceCompany {
  /** Display name, e.g. "Vercel". */
  name: string;
  /** Registrable domain, e.g. "vercel.com" — used for discovery and logo resolution. */
  domain: string;
  /** Explicit careers page. Defaults to `https://{domain}/careers`. */
  careersUrl?: string;
  /** Known ATS. When omitted, discovery detects it. */
  provider?: JobProvider;
  /** Known board token, e.g. "vercel" for greenhouse. */
  slug?: string;
}

/** The result of resolving `JobSourceCompany` into something fetchable. */
export interface ResolvedJobSource {
  company: string;
  /** Carried through so logos and provenance survive the discovery round-trip. */
  domain: string;
  provider: AnyJobProvider;
  slug: string;
  careersUrl: string;
  /** How `provider`/`slug` were obtained — useful for debugging discovery quality. */
  detection: 'declared' | 'fingerprint' | 'probe' | 'fallback';
}

export interface NormalizedSalary {
  min: number;
  max: number;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

/**
 * One job posting, provider-agnostic and ready to persist.
 *
 * Fields that ATS payloads genuinely cannot supply (salary at Greenhouse/Lever,
 * experience level everywhere, structured skills everywhere) are nullable or empty
 * rather than fabricated — the UI treats "unknown" as unknown instead of inventing
 * plausible-looking numbers.
 */
export interface NormalizedJob {
  /** Globally stable key: `${provider}:${externalId}`. */
  id: string;
  externalId: string;
  provider: AnyJobProvider;
  companySlug: string;
  company: string;
  companyLogo: string | null;
  title: string;
  location: string;
  workplaceType: WorkplaceType | null;
  jobType: JobType | null;
  experienceLevel: ExperienceLevel | null;
  /** Normalized into the finite UI enum so filters keep working. */
  department: Department;
  /** Raw department/team text from the ATS, preserved for display + debugging. */
  sourceDepartment: string;
  salary: NormalizedSalary | null;
  /** Human-readable pay summary when a structured range is unavailable. */
  salarySummary: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  applyUrl: string;
  sourceUrl: string;
  /** When the employer published the posting, ISO 8601 — null if not published. */
  postedAt: string | null;
  /** Raw provider payload, kept for re-normalization if our mapping improves. */
  raw: unknown;
}

/** Outcome of fetching one company. Never throws — failures are reported per company
 *  so a single broken board cannot abort a whole sync run. */
export interface CompanySyncResult {
  company: string;
  source: ResolvedJobSource | null;
  jobs: NormalizedJob[];
  ok: boolean;
  error?: string;
}
