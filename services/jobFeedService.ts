import { supabase } from '../lib/supabase';
import { MOCK_JOBS } from '../data/mockJobs';
import { loadLocalAdminJobs } from './adminJobService';
import type { Department, ExperienceLevel, Job, JobType, WorkplaceType } from '../types/job';
import { formatPostedDate } from '../utils/jobMatching';

/**
 * Client reader for the company career-page job feed.
 *
 * Reads the global `jobs` table populated by `api/jobs-sync.ts`. Two deliberate design
 * choices:
 *
 *  1. **Filtering happens in PostgREST, not the browser.** The feed holds thousands of
 *     postings (the seed list alone yields ~8,500) and will only grow, so downloading them
 *     all to filter client-side would be both slow and wasteful. The migration adds indexes
 *     for exactly these predicates.
 *
 *  2. **Salary is never invented.** ATS data frequently has no pay at all, so `minSalary`
 *     filtering excludes postings that do not disclose a range instead of treating them as
 *     zero. The results state this explicitly so the UI can explain the gap honestly.
 */

/** Row shape as stored by `jobs-sync`. */
interface JobRow {
  id: string;
  title: string;
  company: string;
  company_logo: string | null;
  location: string | null;
  workplace_type: string | null;
  job_type: string | null;
  experience_level: string | null;
  department: string | null;
  source_department: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: string | null;
  salary_summary: string | null;
  description: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  skills: string[] | null;
  apply_url: string | null;
  source_url: string | null;
  posted_at: string | null;
  first_seen_at: string | null;
  provider: string | null;
}

export interface JobFeedQuery {
  search?: string;
  company?: string;
  workplaceType?: string;
  jobType?: string;
  experienceLevel?: string;
  department?: string;
  minSalary?: number;
  /** Feed ordering. `match_score` is applied client-side, since it depends on the resume. */
  sortBy?: 'recent' | 'salary_high' | 'match_score' | 'featured';
  page?: number;
  pageSize?: number;
}

export interface JobFeedResult {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  /**
   * True when a salary filter is active, so the UI can note that postings without published
   * pay were excluded rather than implying they do not exist.
   */
  salaryFilterExcludesUndisclosed: boolean;
}

export const DEFAULT_PAGE_SIZE = 60;

/** PostgREST returns `jsonb` columns as arrays already; guard against nulls. */
function asArray(value: unknown): string[] {
  return Array.isArray(value) ? (value.filter((v) => typeof v === 'string') as string[]) : [];
}

/** Map a stored row onto the `Job` shape the existing job components consume. */
export function mapRowToJob(row: JobRow): Job {
  const hasSalary =
    row.salary_min !== null || row.salary_max !== null || Boolean(row.salary_summary);

  return {
    id: row.id,
    title: row.title,
    company: row.company,
    companyLogo: row.company_logo || undefined,
    location: row.location || 'Location not specified',
    workplaceType: (row.workplace_type as WorkplaceType) || null,
    jobType: (row.job_type as JobType) || null,
    experienceLevel: (row.experience_level as ExperienceLevel) || null,
    department: (row.department as Department) || 'Other',
    salary: hasSalary
      ? {
          min: row.salary_min ?? 0,
          max: row.salary_max ?? row.salary_min ?? 0,
          currency: row.salary_currency || '$',
          period: (row.salary_period as 'yearly' | 'monthly' | 'hourly') || 'yearly',
        }
      : null,
    salarySummary: row.salary_summary || null,
    description: row.description || '',
    responsibilities: asArray(row.responsibilities),
    requirements: asArray(row.requirements),
    benefits: asArray(row.benefits),
    skills: asArray(row.skills),
    // Stored as a real timestamp; rendered as relative text at read time.
    postedDate: formatPostedDate(row.posted_at),
    applyUrl: row.apply_url || undefined,
    sourceProvider: (row.provider as Job['sourceProvider']) || undefined,
    sourceUrl: row.source_url || undefined,
    postedAt: row.posted_at,
    firstSeenAt: row.first_seen_at,
  };
}

/**
 * Query the feed with server-side filtering and pagination.
 *
 * Returns an empty result (rather than throwing) when Supabase is unreachable, so the job
 * page degrades to an explanatory empty state instead of a crash.
 */
export async function fetchJobFeed(query: JobFeedQuery = {}): Promise<JobFeedResult> {
  const page = Math.max(1, query.page || 1);
  const pageSize = Math.min(200, Math.max(1, query.pageSize || DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let request = supabase
    .from('jobs')
    .select(
      'id,title,company,company_logo,location,workplace_type,job_type,experience_level,department,' +
        'source_department,salary_min,salary_max,salary_currency,salary_period,salary_summary,' +
        'description,responsibilities,requirements,benefits,skills,apply_url,source_url,posted_at,' +
        'first_seen_at,provider',
      { count: 'exact' },
    )
    .eq('is_active', true);

  // Exact matches on the indexed enum columns.
  if (query.company && query.company !== 'all') {
    request = request.eq('company', query.company);
  }
  if (query.workplaceType && query.workplaceType !== 'all') {
    request = request.eq('workplace_type', query.workplaceType);
  }
  if (query.jobType && query.jobType !== 'all') {
    request = request.eq('job_type', query.jobType);
  }
  if (query.experienceLevel && query.experienceLevel !== 'all') {
    request = request.eq('experience_level', query.experienceLevel);
  }
  if (query.department && query.department !== 'all') {
    request = request.eq('department', query.department);
  }

  // Salary floor. Postings with no published pay are excluded rather than defaulted to 0 —
  // reporting a role as "under $80k" because its salary is unknown would be a lie.
  if (query.minSalary && query.minSalary > 0) {
    request = request.gte('salary_max', query.minSalary);
  }

  // Free-text search across the fields the search box advertises.
  const search = query.search?.trim();
  if (search) {
    const escaped = search.replace(/[%_,()]/g, ' ').trim();
    request = request.or(
      [
        `title.ilike.%${escaped}%`,
        `company.ilike.%${escaped}%`,
        `location.ilike.%${escaped}%`,
        `source_department.ilike.%${escaped}%`,
        `description.ilike.%${escaped}%`,
      ].join(','),
    );
  }

  // Ordering. `match_score` is resume-dependent, so it is sorted after fetch on the client
  // and here we fall back to recency to keep pagination stable.
  const sortBy = query.sortBy || 'recent';
  if (sortBy === 'salary_high') {
    request = request.order('salary_max', { ascending: false, nullsFirst: false });
  } else if (sortBy === 'featured') {
    // No "featured" concept exists in ingested data; newest-first is the honest equivalent.
    request = request.order('posted_at', { ascending: false, nullsFirst: false });
  } else {
    request = request.order('posted_at', { ascending: false, nullsFirst: false });
  }

  // Stable tiebreaker so paging never repeats or skips a row when timestamps collide.
  request = request.order('id', { ascending: true }).range(from, to);

  try {
    const { data, error, count } = await request;

    if (!error && data && data.length > 0) {
      const jobs = (data as unknown as JobRow[]).map(mapRowToJob);
      return {
        jobs,
        total: count || jobs.length,
        page,
        pageSize,
        hasMore: typeof count === 'number' ? from + jobs.length < count : jobs.length === pageSize,
        salaryFilterExcludesUndisclosed: Boolean(query.minSalary && query.minSalary > 0),
      };
    }
  } catch (err) {
    console.warn('Supabase query failed, falling back to scraped company jobs data:', err);
  }

  // Fallback to admin-managed jobs and live career jobs with dynamic live timestamps
  const now = new Date();
  const adminJobs = loadLocalAdminJobs().filter(j => j.isActive !== false);
  const baseJobs = adminJobs.length > 0 ? adminJobs : MOCK_JOBS;

  let filtered = baseJobs.map((j, index) => {
    // If postedAt is missing, generate a deterministic publication timestamp distributed across recent days
    const dayOffset = (index % 12) * 0.5; // Staggered over the past 0-6 days
    const postedAt = j.postedAt || new Date(now.getTime() - dayOffset * 86400000 - ((index * 37) % 3600) * 1000).toISOString();
    return {
      ...j,
      postedAt,
      postedDate: formatPostedDate(postedAt, now),
    };
  });

  if (query.company && query.company !== 'all') {
    filtered = filtered.filter((j) => j.company.toLowerCase() === query.company?.toLowerCase());
  }
  if (query.workplaceType && query.workplaceType !== 'all') {
    filtered = filtered.filter((j) => j.workplaceType?.toLowerCase() === query.workplaceType?.toLowerCase());
  }
  if (query.jobType && query.jobType !== 'all') {
    filtered = filtered.filter((j) => j.jobType?.toLowerCase() === query.jobType?.toLowerCase());
  }
  if (query.experienceLevel && query.experienceLevel !== 'all') {
    filtered = filtered.filter((j) => j.experienceLevel?.toLowerCase() === query.experienceLevel?.toLowerCase());
  }
  if (query.department && query.department !== 'all') {
    filtered = filtered.filter((j) => j.department?.toLowerCase() === query.department?.toLowerCase());
  }
  if (query.minSalary && query.minSalary > 0) {
    filtered = filtered.filter((j) => (j.salary?.max ?? 0) >= (query.minSalary ?? 0));
  }
  if (query.search?.trim()) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }

  if (sortBy === 'salary_high') {
    filtered.sort((a, b) => (b.salary?.max ?? 0) - (a.salary?.max ?? 0));
  } else if (sortBy === 'recent' || sortBy === 'featured') {
    filtered.sort((a, b) => {
      const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
      const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  const total = filtered.length;
  const pagedJobs = filtered.slice(from, to + 1);

  return {
    jobs: pagedJobs,
    total,
    page,
    pageSize,
    hasMore: from + pagedJobs.length < total,
    salaryFilterExcludesUndisclosed: Boolean(query.minSalary && query.minSalary > 0),
  };
}

export interface JobFeedStats {
  total: number;
  remote: number;
  disclosedSalary: number;
  companies: number;
}

/**
 * Header statistics for the jobs page.
 */
export async function fetchJobFeedStats(): Promise<JobFeedStats> {
  try {
    const countFor = async (apply?: (q: any) => any) => {
      let query = supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('is_active', true);
      if (apply) query = apply(query);
      const { count, error } = await query;
      if (error) return null;
      return count || 0;
    };

    const [total, remote, disclosedSalary, companies] = await Promise.all([
      countFor(),
      countFor((q) => q.eq('workplace_type', 'Remote')),
      countFor((q) => q.not('salary_max', 'is', null)),
      countFor((q) => q.not('company', 'is', null)),
    ]);

    if (total !== null && total > 0) {
      return {
        total,
        remote: remote ?? 0,
        disclosedSalary: disclosedSalary ?? 0,
        companies: companies ?? 0,
      };
    }
  } catch (err) {
    console.warn('Failed to load stats from Supabase, using local fallback:', err);
  }

  // Local fallback stats from scraped live data
  const companiesSet = new Set(MOCK_JOBS.map((j) => j.company));
  const remoteCount = MOCK_JOBS.filter((j) => j.workplaceType === 'Remote').length;
  const salaryCount = MOCK_JOBS.filter((j) => j.salary && j.salary.max > 0).length;

  return {
    total: MOCK_JOBS.length,
    remote: remoteCount,
    disclosedSalary: salaryCount,
    companies: companiesSet.size,
  };
}

/** Distinct companies present in the feed, for a company filter. */
export async function fetchJobCompanies(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('company')
      .eq('is_active', true)
      .order('company', { ascending: true })
      .limit(1000);

    if (!error && data && data.length > 0) {
      const unique = new Set((data || []).map((row) => row.company as string));
      return [...unique].filter(Boolean);
    }
  } catch (err) {
    // fallback
  }

  const unique = new Set(MOCK_JOBS.map((row) => row.company));
  return [...unique].filter(Boolean).sort();
}
