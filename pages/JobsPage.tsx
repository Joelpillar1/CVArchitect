import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Loader2,
  RefreshCw,
  FolderOpen,
  Building2,
} from 'lucide-react';
import { Job, JobFilterState } from '../types/job';
import { ResumeData } from '../types';
import { getSavedJobIds, toggleSaveJob, calculateJobMatchScore, formatSalary } from '../utils/jobMatching';
import { DEFAULT_PAGE_SIZE, fetchJobFeed, fetchJobFeedStats, fetchJobCompanies, type JobFeedStats } from '../services/jobFeedService';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import JobDetailsModal from '../components/jobs/JobDetailsModal';
import SelectResumeModal from '../components/jobs/SelectResumeModal';
import { useToast } from '../contexts/ToastContext';
import { SavedTemplate, TemplateType } from '../types';
import { saveToStorage } from '../utils/statePersistence';

export function formatJobDescriptionForChat(job: Job): string {
  if (!job) return '';
  const parts: string[] = [];
  parts.push(`Please tailor my resume for this role:`);
  if (job.title) parts.push(`\n**Target Role:** ${job.title}`);
  if (job.company) parts.push(`**Company:** ${job.company}`);
  if (job.location) parts.push(`**Location:** ${job.location}${job.workplaceType ? ` (${job.workplaceType})` : ''}`);
  if (job.jobType) parts.push(`**Job Type:** ${job.jobType}`);
  if (job.salary) {
    const salaryStr = formatSalary(job.salary);
    if (salaryStr) parts.push(`**Compensation:** ${salaryStr}`);
  }

  if (job.description) {
    const desc = typeof job.description === 'string' ? job.description.trim() : String(job.description);
    if (desc) parts.push(`\n**Job Description & Overview:**\n${desc}`);
  }

  if (job.responsibilities) {
    if (Array.isArray(job.responsibilities) && job.responsibilities.length > 0) {
      parts.push(`\n**Key Responsibilities:**\n${job.responsibilities.map((r) => `• ${r}`).join('\n')}`);
    } else if (typeof job.responsibilities === 'string' && job.responsibilities.trim()) {
      parts.push(`\n**Key Responsibilities:**\n${job.responsibilities.trim()}`);
    }
  }

  if (job.requirements) {
    if (Array.isArray(job.requirements) && job.requirements.length > 0) {
      parts.push(`\n**Requirements & Qualifications:**\n${job.requirements.map((r) => `• ${r}`).join('\n')}`);
    } else if (typeof job.requirements === 'string' && job.requirements.trim()) {
      parts.push(`\n**Requirements & Qualifications:**\n${job.requirements.trim()}`);
    }
  }

  if (job.skills) {
    if (Array.isArray(job.skills) && job.skills.length > 0) {
      parts.push(`\n**Skills & Technologies:**\n${job.skills.join(', ')}`);
    } else if (typeof job.skills === 'string' && job.skills.trim()) {
      parts.push(`\n**Skills & Technologies:**\n${job.skills.trim()}`);
    }
  }

  return parts.join('\n');
}

interface JobsPageProps {
  resumeData?: ResumeData | null;
  savedTemplates?: SavedTemplate[];
  currentResumeId?: string | null;
  currentTemplate?: TemplateType;
  onTailorResume?: (job: Job) => void;
  onSelectResumeForTailoring?: (
    resume: {
      id: string | null;
      tag: string;
      baseTemplate: TemplateType;
      data: ResumeData;
    },
    job: Job
  ) => void;
}

const INITIAL_FILTERS: JobFilterState = {
  search: '',
  company: 'all',
  workplaceType: 'all',
  jobType: 'all',
  experienceLevel: 'all',
  department: 'all',
  minSalary: 0,
  sortBy: 'recent',
  onlySaved: false,
};

/** Search is debounced so typing does not fire a query per keystroke. */
const SEARCH_DEBOUNCE_MS = 350;

export default function JobsPage({
  resumeData,
  savedTemplates = [],
  currentResumeId,
  currentTemplate = 'vanguard',
  onTailorResume,
  onSelectResumeForTailoring,
}: JobsPageProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobFeedStats | null>(null);
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excludesUndisclosedSalary, setExcludesUndisclosedSalary] = useState(false);

  const [filters, setFilters] = useState<JobFilterState>(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => getSavedJobIds());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resumeSelectJob, setResumeSelectJob] = useState<Job | null>(null);

  /** Guards against a slow earlier request overwriting a newer result. */
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters.search]);

  /** Load one page and either replace (page 1) or append. */
  const loadJobs = useCallback(
    async (targetPage: number, append: boolean) => {
      const requestId = ++requestIdRef.current;
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const result = await fetchJobFeed({
          search: debouncedSearch,
          company: filters.company,
          workplaceType: filters.workplaceType,
          jobType: filters.jobType,
          experienceLevel: filters.experienceLevel,
          department: filters.department,
          minSalary: filters.minSalary,
          sortBy: filters.sortBy,
          page: targetPage,
          pageSize: DEFAULT_PAGE_SIZE,
        });

        // A newer request has superseded this one; drop the stale response.
        if (requestId !== requestIdRef.current) return;

        setJobs((previous) => (append ? [...previous, ...result.jobs] : result.jobs));
        setTotal(result.total);
        setPage(result.page);
        setHasMore(result.hasMore);
        setExcludesUndisclosedSalary(result.salaryFilterExcludesUndisclosed);
        setError(null);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError((err as Error).message || 'Could not load jobs.');
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    // `filters.search` is intentionally excluded: `debouncedSearch` already trails it.
    [debouncedSearch, filters.company, filters.workplaceType, filters.jobType, filters.experienceLevel, filters.department, filters.minSalary, filters.sortBy],
  );

  // Refetch from page 1 whenever the filter set changes.
  useEffect(() => {
    loadJobs(1, false);
  }, [loadJobs]);

  // Header statistics are genuine database counts, loaded once.
  useEffect(() => {
    let cancelled = false;
    fetchJobFeedStats().then((result) => {
      if (!cancelled) setStats(result);
    });
    fetchJobCompanies().then((companies) => {
      if (!cancelled) setAvailableCompanies(companies);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleSave = (jobId: string) => {
    const isNowSaved = toggleSaveJob(jobId);
    setSavedJobIds(getSavedJobIds());
    const targetJob = jobs.find((j) => j.id === jobId);
    const title = targetJob?.title || 'Job';
    if (isNowSaved) {
      showToast(`Saved "${title}" to your bookmarks.`, 'success');
    } else {
      showToast(`Removed "${title}" from bookmarks.`, 'info');
    }
  };

  /** Saved-only filtering is client-side, since bookmarks live in localStorage. */
  const visibleJobs = useMemo(() => {
    const filtered = filters.onlySaved ? jobs.filter((job) => savedJobIds.includes(job.id)) : jobs;

    // Best-match ordering depends on the resume, so it cannot be a database ORDER BY.
    if (filters.sortBy !== 'match_score') return filtered;

    return [...filtered].sort(
      (a, b) => calculateJobMatchScore(b, resumeData).score - calculateJobMatchScore(a, resumeData).score,
    );
  }, [jobs, filters.onlySaved, filters.sortBy, savedJobIds, resumeData]);

  /**
   * Median advertised top-of-range across postings that disclose pay.
   *
   * A median (not a mean) is used because a handful of executive postings would drag an
   * average upward and misrepresent the feed.
   */
  const medianSalary = useMemo(() => {
    const values = jobs
      .map((job) => job.salary?.max || job.salary?.min || 0)
      .filter((value) => value > 0)
      .sort((a, b) => a - b);
    if (!values.length) return null;
    const mid = Math.floor(values.length / 2);
    const median = values.length % 2 ? values[mid] : Math.round((values[mid - 1] + values[mid]) / 2);
    return { median, sampleSize: values.length };
  }, [jobs]);

  const handleTailorResume = (job: Job) => {
    setResumeSelectJob(job);
  };

  const handleSelectResumeForJob = (
    chosenResume: {
      id: string | null;
      tag: string;
      baseTemplate: TemplateType;
      data: ResumeData;
    },
    targetJob: Job
  ) => {
    setResumeSelectJob(null);
    if (onSelectResumeForTailoring) {
      onSelectResumeForTailoring(chosenResume, targetJob);
      return;
    }
    if (onTailorResume) {
      onTailorResume(targetJob);
      return;
    }

    const jobPrompt = formatJobDescriptionForChat(targetJob);
    saveToStorage('cv_app_data', chosenResume.data);
    saveToStorage('cv_app_template', chosenResume.baseTemplate);
    if (chosenResume.id) {
      saveToStorage('cv_app_resume_id', chosenResume.id);
    }
    saveToStorage('cv_pending_chat_prompt', jobPrompt);
    saveToStorage('editor_openJobMatchTab', true);
    saveToStorage('editor_activeMobileTab', 'job-match');
    showToast(`Loaded "${chosenResume.tag}" for "${targetJob.title}".`, 'success');
    navigate('/dashboard/editor', {
      state: {
        pendingChatPrompt: jobPrompt,
        openChat: true,
      },
    });
  };

  const handleGenerateCoverLetter = (job: Job) => {
    navigate('/dashboard/cover-letter', {
      state: {
        prefillJob: {
          jobTitle: job.title,
          companyName: job.company,
          jobDescription: `${job.title} at ${job.company}\n\nRole Overview:\n${job.description}\n\nKey Requirements:\n${job.requirements.join('\n')}`,
        },
      },
    });
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Explore Available Jobs
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Browse live verified job opportunities matching your experience.
          </p>
        </div>

        {/* Highlight Stats Row — clean, live database counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Open Roles
            </div>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">
              {stats ? stats.total.toLocaleString() : '—'}
            </div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Remote Positions
            </div>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">
              {stats ? stats.remote.toLocaleString() : '—'}
            </div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Median Pay
            </div>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">
              {medianSalary ? `$${Math.round(medianSalary.median / 1000)}k` : '—'}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              {medianSalary ? `${medianSalary.sampleSize} of ${jobs.length} disclose pay` : 'Not disclosed'}
            </div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Saved Roles
            </div>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">
              {savedJobIds.length}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <JobFilters
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
          savedCount={savedJobIds.length}
          totalJobsCount={total}
          filteredCount={visibleJobs.length}
          availableCompanies={availableCompanies}
        />

        {/* Salary filter caveat */}
        {excludesUndisclosedSalary && (
          <div className="mb-6 flex items-start gap-2 text-xs text-neutral-700 bg-neutral-100 border border-neutral-200 rounded-xl px-3.5 py-2.5">
            <DollarSign size={14} className="mt-0.5 shrink-0 text-neutral-500" />
            <span>
              Showing only roles with published pay above your minimum. Many company career pages
              do not disclose salary, so those roles are excluded from this list.
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-3" size={28} />
            <p className="text-sm">Loading roles from company career pages…</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-3xl border border-red-200 p-10 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
              <RefreshCw size={26} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Could not load jobs</h3>
            <p className="text-sm text-gray-500 mb-6 font-light">{error}</p>
            <button
              onClick={() => loadJobs(1, false)}
              className="px-6 py-3 bg-brand-dark hover:bg-black text-white font-bold rounded-xl text-sm transition-all shadow-md"
            >
              Try again
            </button>
          </div>
        )}

        {/* Job Listings Grid */}
        {!loading && !error && visibleJobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {visibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  resumeData={resumeData}
                  isSaved={savedJobIds.includes(job.id)}
                  onToggleSave={handleToggleSave}
                  onSelectJob={(j) => setSelectedJob(j)}
                  onTailorResume={handleTailorResume}
                />
              ))}
            </div>

            {/* Pagination — the feed can hold thousands of postings, so pages are loaded
                incrementally rather than all at once. */}
            {!filters.onlySaved && (hasMore || jobs.length > 0) && (
              <div className="flex flex-col items-center gap-2 mt-10">
                {hasMore ? (
                  <button
                    onClick={() => loadJobs(page + 1, true)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-gray-400 text-gray-800 font-semibold rounded-xl text-sm transition-all shadow-sm disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 size={15} className="animate-spin" />}
                    {loadingMore ? 'Loading…' : 'Load more roles'}
                  </button>
                ) : (
                  <p className="text-xs text-gray-400">You have reached the end of the results.</p>
                )}
                <p className="text-xs text-gray-400">
                  Showing {visibleJobs.length} of {total.toLocaleString()} matching roles
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && visibleJobs.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-sm my-12 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
              {total === 0 && !filters.search ? <Building2 size={32} /> : <FolderOpen size={32} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {total === 0 && !filters.search
                ? 'No jobs have been synced yet'
                : 'No matching jobs found'}
            </h3>
            <p className="text-sm text-gray-500 mb-6 font-light">
              {filters.onlySaved
                ? "You haven't saved any jobs to your bookmarks yet. Click the bookmark icon on any job card to save it."
                : total === 0 && !filters.search
                  ? 'The job feed is empty. Run a sync to pull the latest roles from company career pages.'
                  : 'Try adjusting your search criteria, clearing filters, or browsing all departments.'}
            </p>
            <button
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="px-6 py-3 bg-brand-dark hover:bg-black text-white font-bold rounded-xl text-sm transition-all shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Job Details Modal */}
        <JobDetailsModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          resumeData={resumeData}
          isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
          onToggleSave={handleToggleSave}
          onTailorResume={(j) => {
            setSelectedJob(null);
            handleTailorResume(j);
          }}
          onGenerateCoverLetter={(j) => {
            setSelectedJob(null);
            handleGenerateCoverLetter(j);
          }}
        />

        {/* Select Resume Modal */}
        <SelectResumeModal
          isOpen={!!resumeSelectJob}
          onClose={() => setResumeSelectJob(null)}
          job={resumeSelectJob}
          savedTemplates={savedTemplates}
          currentResumeData={resumeData}
          currentResumeId={currentResumeId}
          currentTemplate={currentTemplate}
          onSelectResume={handleSelectResumeForJob}
        />
      </div>
    </div>
  );
}
