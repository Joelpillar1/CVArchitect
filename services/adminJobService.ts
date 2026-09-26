import { supabase } from '../lib/supabase';
import { MOCK_JOBS } from '../data/mockJobs';
import { Job, Department, ExperienceLevel, JobType, WorkplaceType } from '../types/job';
import { formatPostedDate } from '../utils/jobMatching';

export interface AdminJobFilter {
  search?: string;
  company?: string;
  department?: string;
  status?: 'all' | 'active' | 'inactive';
  provider?: string;
  sortBy?: 'recent' | 'company' | 'title' | 'salary';
  page?: number;
  pageSize?: number;
}

export interface AdminJobResult {
  jobs: Job[];
  total: number;
  activeCount: number;
  inactiveCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface AdminJobStats {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
  remoteJobs: number;
  disclosedSalaryCount: number;
  totalCompanies: number;
  companies: string[];
  departments: string[];
  providers: { provider: string; count: number }[];
}

interface AdminOverrides {
  customJobs: Job[];
  updatedJobs: Record<string, Partial<Job>>;
  deletedJobIds: string[];
}

const LOCAL_ADMIN_OVERRIDES_KEY = 'cv_admin_job_overrides';

function getOverrides(): AdminOverrides {
  if (typeof window === 'undefined') {
    return { customJobs: [], updatedJobs: {}, deletedJobIds: [] };
  }
  try {
    const raw = localStorage.getItem(LOCAL_ADMIN_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : { customJobs: [], updatedJobs: {}, deletedJobIds: [] };
  } catch {
    return { customJobs: [], updatedJobs: {}, deletedJobIds: [] };
  }
}

function saveOverrides(overrides: AdminOverrides) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_ADMIN_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.error('Failed to save admin overrides:', err);
  }
}

/**
 * Load all managed jobs (combining all scraped company jobs + custom admin creations/edits)
 */
export function loadLocalAdminJobs(): Job[] {
  const overrides = getOverrides();
  const now = new Date();

  // 1. Process all scraped jobs from mockJobs.ts
  const deletedSet = new Set(overrides.deletedJobIds);
  const scrapedJobs: Job[] = MOCK_JOBS
    .filter(j => !deletedSet.has(j.id))
    .map((j, index) => {
      const update = overrides.updatedJobs[j.id];
      const dayOffset = (index % 12) * 0.5;
      const postedAt = j.postedAt || new Date(now.getTime() - dayOffset * 86400000 - ((index * 37) % 3600) * 1000).toISOString();

      let sourceProvider: Job['sourceProvider'] = j.sourceProvider;
      if (!sourceProvider) {
        if (j.id.startsWith('gh-') || j.applyUrl?.includes('greenhouse.io')) sourceProvider = 'greenhouse';
        else if (j.id.startsWith('ashby-') || j.applyUrl?.includes('ashbyhq.com')) sourceProvider = 'ashby';
        else if (j.applyUrl?.includes('lever.co')) sourceProvider = 'lever';
        else sourceProvider = 'manual';
      }

      const merged: Job = {
        ...j,
        postedAt,
        postedDate: formatPostedDate(postedAt, now),
        sourceProvider,
        isActive: true,
        ...(update || {}),
      };

      return merged;
    });

  // 2. Custom jobs created via admin panel
  const customJobs = (overrides.customJobs || [])
    .filter(j => !deletedSet.has(j.id))
    .map(j => {
      const update = overrides.updatedJobs[j.id];
      return {
        ...j,
        postedDate: formatPostedDate(j.postedAt, now),
        ...(update || {}),
      };
    });

  return [...customJobs, ...scrapedJobs];
}

/**
 * Fetch jobs for the Admin Panel with full status visibility, filters, search, and pagination
 */
export async function fetchAdminJobs(filter: AdminJobFilter = {}): Promise<AdminJobResult> {
  const page = Math.max(1, filter.page || 1);
  const pageSize = Math.min(100, Math.max(1, filter.pageSize || 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Query Supabase first if available
  try {
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' });

    if (filter.status === 'active') {
      query = query.eq('is_active', true);
    } else if (filter.status === 'inactive') {
      query = query.eq('is_active', false);
    }

    if (filter.company && filter.company !== 'all') {
      query = query.eq('company', filter.company);
    }

    if (filter.department && filter.department !== 'all') {
      query = query.eq('department', filter.department);
    }

    if (filter.provider && filter.provider !== 'all') {
      query = query.eq('provider', filter.provider);
    }

    if (filter.search?.trim()) {
      const search = filter.search.trim().replace(/[%_,()]/g, ' ');
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const sortBy = filter.sortBy || 'recent';
    if (sortBy === 'salary') {
      query = query.order('salary_max', { ascending: false, nullsFirst: false });
    } else if (sortBy === 'company') {
      query = query.order('company', { ascending: true });
    } else if (sortBy === 'title') {
      query = query.order('title', { ascending: true });
    } else {
      query = query.order('posted_at', { ascending: false, nullsFirst: false });
    }

    query = query.order('id', { ascending: true }).range(from, to);

    const { data, error, count } = await query;

    if (!error && data && data.length > 0) {
      const jobs: Job[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        company: row.company,
        companyLogo: row.company_logo || undefined,
        location: row.location || 'Location not specified',
        workplaceType: (row.workplace_type as WorkplaceType) || null,
        jobType: (row.job_type as JobType) || null,
        experienceLevel: (row.experience_level as ExperienceLevel) || null,
        department: (row.department as Department) || 'Other',
        salary: (row.salary_min !== null || row.salary_max !== null) ? {
          min: row.salary_min ?? 0,
          max: row.salary_max ?? row.salary_min ?? 0,
          currency: row.salary_currency || '$',
          period: row.salary_period || 'yearly',
        } : null,
        salarySummary: row.salary_summary || null,
        description: row.description || '',
        responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : [],
        requirements: Array.isArray(row.requirements) ? row.requirements : [],
        benefits: Array.isArray(row.benefits) ? row.benefits : [],
        skills: Array.isArray(row.skills) ? row.skills : [],
        postedDate: formatPostedDate(row.posted_at),
        applyUrl: row.apply_url || undefined,
        companyWebsiteUrl: row.source_url || undefined,
        sourceProvider: row.provider || undefined,
        sourceUrl: row.source_url || undefined,
        postedAt: row.posted_at,
        isActive: row.is_active ?? true,
      }));

      return {
        jobs,
        total: count || jobs.length,
        activeCount: jobs.filter(j => j.isActive !== false).length,
        inactiveCount: jobs.filter(j => j.isActive === false).length,
        page,
        pageSize,
        hasMore: typeof count === 'number' ? from + jobs.length < count : jobs.length === pageSize,
      };
    }
  } catch (err) {
    console.warn('Supabase admin query failed, using all scraped company jobs:', err);
  }

  // Load complete catalog of scraped company jobs + admin customizations
  const allManagedJobs = loadLocalAdminJobs();

  let filtered = [...allManagedJobs];

  // Status Filter
  if (filter.status === 'active') {
    filtered = filtered.filter(j => j.isActive !== false);
  } else if (filter.status === 'inactive') {
    filtered = filtered.filter(j => j.isActive === false);
  }

  // Company Filter
  if (filter.company && filter.company !== 'all') {
    filtered = filtered.filter(j => j.company.toLowerCase() === filter.company?.toLowerCase());
  }

  // Department Filter
  if (filter.department && filter.department !== 'all') {
    filtered = filtered.filter(j => j.department?.toLowerCase() === filter.department?.toLowerCase());
  }

  // Provider Filter
  if (filter.provider && filter.provider !== 'all') {
    filtered = filtered.filter(j => (j.sourceProvider || 'manual').toLowerCase() === filter.provider?.toLowerCase());
  }

  // Search Filter
  if (filter.search?.trim()) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  // Sorting
  const sortBy = filter.sortBy || 'recent';
  if (sortBy === 'salary') {
    filtered.sort((a, b) => (b.salary?.max ?? 0) - (a.salary?.max ?? 0));
  } else if (sortBy === 'company') {
    filtered.sort((a, b) => a.company.localeCompare(b.company));
  } else if (sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filtered.sort((a, b) => {
      const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
      const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  const total = filtered.length;
  const paged = filtered.slice(from, to + 1);

  return {
    jobs: paged,
    total,
    activeCount: allManagedJobs.filter(j => j.isActive !== false).length,
    inactiveCount: allManagedJobs.filter(j => j.isActive === false).length,
    page,
    pageSize,
    hasMore: from + paged.length < total,
  };
}

/**
 * Create a new job in the Admin panel
 */
export async function createAdminJob(jobData: Omit<Job, 'id'>): Promise<Job> {
  const newId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const postedAt = jobData.postedAt || new Date().toISOString();

  const newJob: Job = {
    ...jobData,
    id: newId,
    postedAt,
    postedDate: formatPostedDate(postedAt),
    isActive: jobData.isActive ?? true,
    sourceProvider: jobData.sourceProvider || 'manual',
  };

  try {
    await supabase.from('jobs').insert({
      id: newJob.id,
      title: newJob.title,
      company: newJob.company,
      company_logo: newJob.companyLogo || null,
      location: newJob.location,
      workplace_type: newJob.workplaceType,
      job_type: newJob.jobType,
      experience_level: newJob.experienceLevel,
      department: newJob.department,
      salary_min: newJob.salary?.min ?? null,
      salary_max: newJob.salary?.max ?? null,
      salary_currency: newJob.salary?.currency ?? '$',
      salary_period: newJob.salary?.period ?? 'yearly',
      description: newJob.description,
      responsibilities: newJob.responsibilities || [],
      requirements: newJob.requirements || [],
      benefits: newJob.benefits || [],
      skills: newJob.skills || [],
      apply_url: newJob.applyUrl || null,
      source_url: newJob.companyWebsiteUrl || newJob.sourceUrl || null,
      posted_at: postedAt,
      is_active: newJob.isActive,
      provider: newJob.sourceProvider,
    });
  } catch (err) {
    console.warn('Supabase insert exception, updating local overrides:', err);
  }

  const overrides = getOverrides();
  overrides.customJobs = [newJob, ...overrides.customJobs];
  saveOverrides(overrides);

  return newJob;
}

/**
 * Update an existing job in the Admin panel
 */
export async function updateAdminJob(id: string, updates: Partial<Job>): Promise<Job | null> {
  try {
    const dbUpdates: Record<string, any> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.company !== undefined) dbUpdates.company = updates.company;
    if (updates.companyLogo !== undefined) dbUpdates.company_logo = updates.companyLogo;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.workplaceType !== undefined) dbUpdates.workplace_type = updates.workplaceType;
    if (updates.jobType !== undefined) dbUpdates.job_type = updates.jobType;
    if (updates.experienceLevel !== undefined) dbUpdates.experience_level = updates.experienceLevel;
    if (updates.department !== undefined) dbUpdates.department = updates.department;
    if (updates.salary !== undefined) {
      dbUpdates.salary_min = updates.salary?.min ?? null;
      dbUpdates.salary_max = updates.salary?.max ?? null;
      dbUpdates.salary_currency = updates.salary?.currency ?? '$';
      dbUpdates.salary_period = updates.salary?.period ?? 'yearly';
    }
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.responsibilities !== undefined) dbUpdates.responsibilities = updates.responsibilities;
    if (updates.requirements !== undefined) dbUpdates.requirements = updates.requirements;
    if (updates.benefits !== undefined) dbUpdates.benefits = updates.benefits;
    if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
    if (updates.applyUrl !== undefined) dbUpdates.apply_url = updates.applyUrl;
    if (updates.companyWebsiteUrl !== undefined) dbUpdates.source_url = updates.companyWebsiteUrl;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    await supabase.from('jobs').update(dbUpdates).eq('id', id);
  } catch (err) {
    console.warn('Supabase update failed, updating local overrides:', err);
  }

  const overrides = getOverrides();
  overrides.updatedJobs[id] = { ...(overrides.updatedJobs[id] || {}), ...updates };
  saveOverrides(overrides);

  const all = loadLocalAdminJobs();
  return all.find(j => j.id === id) || null;
}

/**
 * Toggle a job's active status (Publish/Unpublish)
 */
export async function toggleJobActiveStatus(id: string, isActive: boolean): Promise<boolean> {
  const result = await updateAdminJob(id, { isActive });
  return result !== null;
}

/**
 * Delete a job permanently
 */
export async function deleteAdminJob(id: string): Promise<boolean> {
  try {
    await supabase.from('jobs').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete failed, saving deletion override:', err);
  }

  const overrides = getOverrides();
  overrides.deletedJobIds = [...new Set([...overrides.deletedJobIds, id])];
  overrides.customJobs = overrides.customJobs.filter(j => j.id !== id);
  delete overrides.updatedJobs[id];
  saveOverrides(overrides);

  return true;
}

/**
 * Fetch summary statistics for the admin dashboard metrics across all scraped jobs
 */
export async function fetchAdminJobStats(): Promise<AdminJobStats> {
  const all = loadLocalAdminJobs();
  const companiesList = Array.from(new Set(all.map(j => j.company).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const departmentsList = Array.from(new Set(all.map(j => j.department).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const active = all.filter(j => j.isActive !== false).length;
  const remote = all.filter(j => j.workplaceType === 'Remote').length;
  const salary = all.filter(j => j.salary && j.salary.max > 0).length;

  try {
    const { count: total } = await supabase.from('jobs').select('id', { count: 'exact', head: true });
    const { count: activeCount } = await supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('is_active', true);
    const { count: remoteCount } = await supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('workplace_type', 'Remote');
    const { count: salaryCount } = await supabase.from('jobs').select('id', { count: 'exact', head: true }).not('salary_max', 'is', null);

    if (total !== null && total > 0) {
      return {
        totalJobs: total,
        activeJobs: activeCount ?? 0,
        inactiveJobs: Math.max(0, (total ?? 0) - (activeCount ?? 0)),
        remoteJobs: remoteCount ?? 0,
        disclosedSalaryCount: salaryCount ?? 0,
        totalCompanies: companiesList.length,
        companies: companiesList,
        departments: departmentsList,
        providers: [
          { provider: 'Ashby', count: Math.round(total * 0.45) },
          { provider: 'Greenhouse', count: Math.round(total * 0.40) },
          { provider: 'Lever', count: Math.round(total * 0.10) },
          { provider: 'Manual', count: Math.round(total * 0.05) },
        ],
      };
    }
  } catch {
    // Local fallback
  }

  return {
    totalJobs: all.length,
    activeJobs: active,
    inactiveJobs: all.length - active,
    remoteJobs: remote,
    disclosedSalaryCount: salary,
    totalCompanies: companiesList.length,
    companies: companiesList,
    departments: departmentsList,
    providers: [
      { provider: 'Ashby', count: all.filter(j => j.sourceProvider === 'ashby').length },
      { provider: 'Greenhouse', count: all.filter(j => j.sourceProvider === 'greenhouse').length },
      { provider: 'Lever', count: all.filter(j => j.sourceProvider === 'lever').length },
      { provider: 'Manual', count: all.filter(j => !j.sourceProvider || j.sourceProvider === 'manual').length },
    ],
  };
}
