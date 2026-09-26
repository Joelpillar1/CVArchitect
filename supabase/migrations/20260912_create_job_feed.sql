-- ============================================
-- Migration: Create the company career-page job feed
-- ============================================
--
-- These two tables back the "Jobs" section of the dashboard.
--
-- Unlike every other table in this project, `jobs` is NOT user-owned: a job posting is
-- global data shared by all readers, and individual rows must never be scoped to
-- `auth.uid()`. The design therefore differs from `saved_resumes`:
--
--   * `job_source_companies` records WHICH company boards we read, how they were resolved
--     (declared / fingerprint / probe), and how their last sync went, so a board that
--     breaks or goes stale can be found and pruned without guessing.
--   * `jobs` stores one row per posting, keyed by a provider-scoped external id, with
--     `first_seen_at` / `last_seen_at` maintained by the sync. That pair is what lets the
--     UI show "first seen" dates and lets a posting that disappears from a board be
--     deactivated rather than deleted — the same lifecycle a career-page aggregator needs.
--
-- Writes happen exclusively through the service role in `api/jobs-sync.ts`, so RLS is
-- enabled with read-only policies for authenticated users. The service role bypasses RLS,
-- which means a compromised anon key can read the feed but never forge jobs.

-- --------------------------------------------
-- Source companies (which boards we read)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_source_companies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  /** Display name, e.g. "Vercel". */
  company text NOT NULL,
  /** Registrable domain, e.g. "vercel.com". */
  domain text NOT NULL,
  /** Applicant-tracking system: greenhouse | lever | ashby | html. */
  provider text NOT NULL,
  /** Board token, e.g. "vercel". */
  slug text NOT NULL,
  /** The employer's own careers page. */
  careers_url text,
  /** How provider/slug were obtained: declared | fingerprint | probe | fallback. */
  detection text NOT NULL DEFAULT 'declared',
  is_active boolean NOT NULL DEFAULT true,
  /** Bookkeeping so broken boards are visible instead of silently empty. */
  last_synced_at timestamptz,
  last_sync_status text,
  last_sync_error text,
  last_jobs_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- One board per provider, so re-running the sync upserts instead of duplicating.
  UNIQUE (provider, slug)
);

COMMENT ON TABLE public.job_source_companies IS
  'Company career-page boards (ATS) that the job feed is sourced from. Written only by the sync service role.';

-- --------------------------------------------
-- Jobs
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
  /** Globally stable key: `${provider}:${external_id}`. */
  id text PRIMARY KEY,
  external_id text NOT NULL,
  provider text NOT NULL,
  company_slug text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  company_logo text,
  location text,
  /** Remote | Hybrid | On-site — NULL when the posting discloses nothing. */
  workplace_type text,
  /** Full-time | Part-time | Contract | Internship. */
  job_type text,
  /** Inferred from the title; NULL when the title carries no seniority signal. */
  experience_level text,
  /** Normalized into the app's finite department enum, including 'Other'. */
  department text NOT NULL DEFAULT 'Other',
  /** Raw department/team text straight from the ATS. */
  source_department text,
  salary_min numeric,
  salary_max numeric,
  salary_currency text,
  salary_period text,
  /** Human-readable pay text when no structured range exists. */
  salary_summary text,
  description text,
  responsibilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  apply_url text,
  /** The employer's own posting URL — provenance for "direct from source". */
  source_url text,
  /** When the employer published it. */
  posted_at timestamptz,
  /** First time our feed observed it. */
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  /** Last time it was still present on the board. */
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  /** False once a posting disappears from its board; retained for history. */
  is_active boolean NOT NULL DEFAULT true,
  /** Original provider payload, so mapping improvements can be re-applied offline. */
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.jobs IS
  'Job postings read directly from company career pages (Greenhouse/Lever/Ashby). Global read-only feed; written only by the sync service role.';

-- --------------------------------------------
-- Row Level Security
-- --------------------------------------------
ALTER TABLE public.job_source_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- The feed is shared data: any signed-in user may read it. There is deliberately no
-- INSERT/UPDATE/DELETE policy, so only the service role (which bypasses RLS) can write.
DROP POLICY IF EXISTS "Authenticated users can read job source companies" ON public.job_source_companies;
CREATE POLICY "Authenticated users can read job source companies"
  ON public.job_source_companies FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can read jobs" ON public.jobs;
CREATE POLICY "Authenticated users can read jobs"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (true);

-- --------------------------------------------
-- Indexes for the feed's read patterns
-- --------------------------------------------
-- The dashboard lists active jobs newest-first.
CREATE INDEX IF NOT EXISTS jobs_active_posted_idx
  ON public.jobs (is_active, posted_at DESC NULLS LAST);
-- Filter chips: workplace type, department, job type.
CREATE INDEX IF NOT EXISTS jobs_workplace_type_idx ON public.jobs (workplace_type);
CREATE INDEX IF NOT EXISTS jobs_department_idx ON public.jobs (department);
CREATE INDEX IF NOT EXISTS jobs_job_type_idx ON public.jobs (job_type);
CREATE INDEX IF NOT EXISTS jobs_experience_level_idx ON public.jobs (experience_level);
CREATE INDEX IF NOT EXISTS jobs_company_idx ON public.jobs (company);
-- Salary sorting/filtering ignores postings with no published pay.
CREATE INDEX IF NOT EXISTS jobs_salary_max_idx ON public.jobs (salary_max DESC NULLS LAST);
-- Full-text search across the fields the search box queries.
CREATE INDEX IF NOT EXISTS jobs_search_idx ON public.jobs
  USING gin (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(company, '') || ' ' ||
      coalesce(location, '') || ' ' || coalesce(source_department, '') || ' ' ||
      coalesce(description, '')
    )
  );

CREATE INDEX IF NOT EXISTS job_source_companies_active_idx
  ON public.job_source_companies (is_active, company);

-- --------------------------------------------
-- Grants
-- --------------------------------------------
GRANT SELECT ON public.jobs TO authenticated;
GRANT SELECT ON public.job_source_companies TO authenticated;
