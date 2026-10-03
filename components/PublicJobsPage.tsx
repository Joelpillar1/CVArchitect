import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Loader2,
  RefreshCw,
  FolderOpen,
  Building2,
  Check,
  X,
  Clock,
} from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { Job, JobFilterState } from '../types/job';
import { formatSalary } from '../utils/jobMatching';
import {
  DEFAULT_PAGE_SIZE,
  fetchJobFeed,
  fetchJobFeedStats,
  type JobFeedStats,
} from '../services/jobFeedService';
import JobFilters from './jobs/JobFilters';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { saveToStorage } from '../utils/statePersistence';
import { formatJobDescriptionForChat } from '../pages/JobsPage';

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

const SEARCH_DEBOUNCE_MS = 350;

const POPULAR_TAGS = [
  { label: 'Remote', filter: { workplaceType: 'Remote' as const } },
  { label: 'Engineering', filter: { department: 'Engineering' } },
  { label: 'AI & Data', filter: { department: 'AI & Data' } },
  { label: 'Design & UX', filter: { department: 'Design & UX' } },
  { label: 'Product', filter: { department: 'Product' } },
  { label: '$120k+', filter: { minSalary: 120000 } },
  { label: 'Full-time', filter: { jobType: 'Full-time' as const } },
];

interface JobUnlockModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => Promise<void>;
  onNavigateToSignup: () => void;
  onNavigateToLogin: () => void;
}

function JobUnlockModal({
  job,
  isOpen,
  onClose,
  onGoogleSignIn,
  onNavigateToSignup,
  onNavigateToLogin,
}: JobUnlockModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[420px] bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-black/5 z-10 my-auto text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200/80 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={15} />
          </button>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-[-0.02em] leading-tight mb-2 pt-2">
            Sign up to apply
          </h2>

          <p className="text-[13px] sm:text-sm text-[#86868B] font-normal leading-relaxed mb-6 max-w-[340px] mx-auto">
            Create a free account to apply directly for{' '}
            <span className="font-semibold text-[#1D1D1F]">"{job.title}"</span>{' '}
            and tailor your resume in seconds.
          </p>

          {/* Features */}
          <div className="bg-[#F5F5F7] rounded-2xl p-4 mb-6 text-left space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#1D1D1F] font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <Check size={10} strokeWidth={3} />
              </div>
              <span>Direct link to verified career page</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#1D1D1F] font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <Check size={10} strokeWidth={3} />
              </div>
              <span>1-Click AI Resume Tailoring tailored to this job</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#1D1D1F] font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <Check size={10} strokeWidth={3} />
              </div>
              <span>Free plan included — no credit card required</span>
            </div>
          </div>

          {/* Auth Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#D2D2D7] bg-white hover:bg-[#F5F5F7] px-4 py-3 text-[14px] font-semibold text-[#1D1D1F] shadow-2xs transition-all cursor-pointer active:scale-[0.99]"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={onNavigateToSignup}
              className="w-full rounded-2xl bg-brand-green hover:bg-brand-greenHover text-brand-dark py-3 font-bold text-[14px] shadow-xs transition-all text-center cursor-pointer active:scale-[0.99]"
            >
              Sign up with Email →
            </button>
          </div>

          {/* Switch to sign in */}
          <p className="text-center text-xs text-[#86868B] mt-5">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function PublicJobsPage() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobFeedStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excludesUndisclosedSalary, setExcludesUndisclosedSalary] = useState(false);

  const [filters, setFilters] = useState<JobFilterState>(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [unlockModalJob, setUnlockModalJob] = useState<Job | null>(null);

  const requestIdRef = useRef(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Load jobs with pagination
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
    [
      debouncedSearch,
      filters.company,
      filters.workplaceType,
      filters.jobType,
      filters.experienceLevel,
      filters.department,
      filters.minSalary,
      filters.sortBy,
    ],
  );

  // Refetch when filters change
  useEffect(() => {
    loadJobs(1, false);
  }, [loadJobs]);

  // Load stats once
  useEffect(() => {
    let cancelled = false;
    fetchJobFeedStats().then((result) => {
      if (!cancelled && result) setStats(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const stageJobContext = (job: Job) => {
    try {
      const jobPrompt = formatJobDescriptionForChat(job);
      sessionStorage.setItem('cv_pending_job_context', JSON.stringify(job));
      saveToStorage('cv_pending_chat_prompt', jobPrompt);
      saveToStorage('editor_openJobMatchTab', true);
      saveToStorage('editor_activeMobileTab', 'job-match');
    } catch (_) {}
  };

  const handleApplyClick = (job: Job) => {
    stageJobContext(job);
    if (user) {
      // For signed-in users, navigate to dashboard jobs and display the full details
      try {
        sessionStorage.setItem('cv_pending_selected_job', JSON.stringify(job));
      } catch (_) {}
      navigate('/dashboard/jobs', { state: { selectedJob: job, autoOpenDetails: true } });
    } else {
      // For guests, open the Apple-standard sign up modal
      try {
        sessionStorage.setItem('cv_pending_selected_job', JSON.stringify(job));
      } catch (_) {}
      setUnlockModalJob(job);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      showToast('Could not sign in with Google.', 'error');
    }
  };

  const handleNavigateToSignup = () => {
    navigate('/signup?redirect=/dashboard/jobs');
  };

  const handleNavigateToLogin = () => {
    navigate('/login?redirect=/dashboard/jobs');
  };

  const handleTagClick = (tagFilter: Partial<JobFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...tagFilter,
    }));
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark overflow-x-clip">
      <SEO
        title="Verified Job Board — 1-Click Agent Resume Tailoring | CVArchitect"
        description="Explore verified jobs with transparent salaries. Match your experience and tailor your resume in seconds with CVArchitect Agent."
        canonicalPath="/jobs"
      />

      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32 pb-24">
        {/* HERO SECTION */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            {/* Live badge */}
            <div className="mb-5 inline-flex items-center gap-2 sm:gap-2.5 py-1 pl-1 pr-3.5 sm:pr-5 rounded-full bg-white border border-brand-green/50 shadow-2xs">
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-dark animate-pulse" />
                Live Job Feed
              </span>
              <span className="text-xs sm:text-sm font-semibold text-brand-dark whitespace-nowrap truncate">
                {stats && stats.total > 0 ? `${stats.total.toLocaleString()} Verified Roles` : 'Verified Roles'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-4 max-w-3xl">
              Verified jobs with{' '}
              <span className="underline decoration-brand-green decoration-[5px] underline-offset-[8px]">
                1-click Agent tailoring
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-brand-dark/65 max-w-2xl mx-auto leading-relaxed mb-8">
              Explore active roles directly from top career portals with verified salary ranges. Sign up free to apply and tailor your resume instantly.
            </p>

            {/* Quick Filter Pill Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mb-8">
              <span className="text-xs font-semibold text-brand-dark/50 mr-1 hidden sm:inline">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => handleTagClick(tag.filter)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-brand-border text-xs font-semibold text-brand-dark/80 hover:text-brand-dark hover:border-brand-green hover:bg-brand-secondary/60 transition-all cursor-pointer shadow-2xs"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Highlight Stats Bar */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-10 text-left">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">
                  Active Roles
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                  {stats ? stats.total.toLocaleString() : '—'}
                </div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">
                  Remote Positions
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                  {stats ? stats.remote.toLocaleString() : '—'}
                </div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">
                  Median Pay
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                  {medianSalary ? `$${Math.round(medianSalary.median / 1000)}k` : '—'}
                </div>
                <div className="text-[10px] text-brand-dark/50 mt-0.5 truncate">
                  {medianSalary ? `${medianSalary.sampleSize} disclose pay` : 'Verified market rates'}
                </div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">
                  ATS Match Rate
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                  98%
                </div>
                <div className="text-[10px] text-brand-dark/50 mt-0.5">
                  Zero hallucinations
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* LISTINGS & FILTERS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Job Filters */}
          <div className="mb-6">
            <JobFilters
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTERS)}
              savedCount={0}
              totalJobsCount={total}
              filteredCount={jobs.length}
            />
          </div>

          {/* Salary filter caveat */}
          {excludesUndisclosedSalary && (
            <div className="mb-6 flex items-start gap-2 text-xs text-brand-dark/80 bg-white border border-brand-border rounded-xl px-4 py-3 shadow-2xs">
              <DollarSign size={15} className="mt-0.5 shrink-0 text-brand-green" />
              <span>
                Showing roles with published compensation above your threshold. Postings with undisclosed compensation are omitted.
              </span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-brand-dark/50">
              <Loader2 className="animate-spin mb-3 text-brand-green" size={32} />
              <p className="text-sm font-medium">Fetching verified roles from career portals…</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-white rounded-3xl border border-red-200 p-10 text-center max-w-lg mx-auto shadow-sm my-12">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
                <RefreshCw size={26} />
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">Could not load job feed</h3>
              <p className="text-sm text-brand-dark/60 mb-6">{error}</p>
              <button
                onClick={() => loadJobs(1, false)}
                className="px-6 py-3 bg-brand-dark hover:bg-brand-dark/90 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* Job Listings Grid */}
          {!loading && !error && jobs.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-fadeIn">
                {jobs.map((job) => {
                  const salaryFormatted = formatSalary(job.salary);
                  const dateToFormat = job.postedAt ?? job.firstSeenAt;
                  let displayDate = 'Recently posted';
                  if (dateToFormat) {
                    try {
                      const d = new Date(dateToFormat);
                      if (!isNaN(d.getTime())) {
                        displayDate = d.toLocaleDateString('en-US', {
                          month: 'long',
                          day: '2-digit',
                          year: 'numeric',
                        });
                      }
                    } catch (_) {}
                  }

                  return (
                    <div
                      key={job.id}
                      onClick={() => handleApplyClick(job)}
                      className="bg-white rounded-2xl border border-brand-border hover:border-brand-dark/30 p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xs cursor-pointer group"
                    >
                      <div>
                        {/* Job Title */}
                        <h2 className="text-base sm:text-[17px] font-bold text-brand-dark tracking-tight leading-snug group-hover:text-brand-dark transition-colors mb-1">
                          {job.title}
                        </h2>

                        {/* Role Tags (Workplace, Department, Job Type, Experience) */}
                        <div className="flex flex-wrap items-center gap-1.5 my-2.5">
                          {job.workplaceType && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                              {job.workplaceType}
                            </span>
                          )}
                          {job.department && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand-secondary text-brand-dark/80 border border-brand-border">
                              {job.department}
                            </span>
                          )}
                          {job.jobType && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand-secondary text-brand-dark/80 border border-brand-border">
                              {job.jobType}
                            </span>
                          )}
                          {job.experienceLevel && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand-secondary text-brand-dark/80 border border-brand-border">
                              {job.experienceLevel}
                            </span>
                          )}
                        </div>

                        {/* Skills / Tech Tags */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                            {job.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200/80"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-brand-dark/40">
                                +{job.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Salary Row */}
                        {salaryFormatted && (
                          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-brand-dark my-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-brand-green/30 border border-brand-green text-brand-dark text-[10px] flex items-center justify-center font-bold">
                              $
                            </span>
                            <span>{salaryFormatted}</span>
                          </div>
                        )}

                        {/* Posted Date */}
                        <div className="flex items-center gap-1.5 text-xs text-brand-dark/55 font-normal my-1.5">
                          <Clock size={13} className="text-brand-dark/40" />
                          <span>{displayDate}</span>
                        </div>
                      </div>

                      {/* Bottom Action Pill: Apply */}
                      <div className="flex items-center gap-2 mt-4 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyClick(job);
                          }}
                          className="px-5 py-1.5 rounded-full bg-brand-dark hover:bg-brand-dark/90 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {(hasMore || jobs.length > 0) && (
                <div className="flex flex-col items-center gap-2.5 mt-12">
                  {hasMore ? (
                    <button
                      onClick={() => loadJobs(page + 1, true)}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-brand-border hover:border-brand-dark text-brand-dark font-bold rounded-2xl text-sm transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                    >
                      {loadingMore && <Loader2 size={16} className="animate-spin text-brand-green" />}
                      {loadingMore ? 'Loading roles…' : 'Load more verified roles'}
                    </button>
                  ) : (
                    <p className="text-xs text-brand-dark/50 font-medium">You have viewed all matching postings.</p>
                  )}
                  <p className="text-xs text-brand-dark/50">
                    Showing {jobs.length} of {total.toLocaleString()} active roles
                  </p>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && jobs.length === 0 && (
            <div className="bg-white rounded-3xl border border-brand-border p-12 text-center max-w-lg mx-auto shadow-sm my-12 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center mx-auto mb-4 text-brand-dark/40">
                {total === 0 && !filters.search ? <Building2 size={32} /> : <FolderOpen size={32} />}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">
                {total === 0 && !filters.search ? 'No jobs available right now' : 'No matching jobs found'}
              </h3>
              <p className="text-sm text-brand-dark/60 mb-6 leading-relaxed">
                Try adjusting your search keywords, broadening department filters, or resetting filters.
              </p>
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="px-6 py-3 bg-brand-dark hover:bg-brand-dark/90 text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* Signup Modal for Guests */}
        <JobUnlockModal
          job={unlockModalJob}
          isOpen={!!unlockModalJob}
          onClose={() => setUnlockModalJob(null)}
          onGoogleSignIn={handleGoogleSignIn}
          onNavigateToSignup={handleNavigateToSignup}
          onNavigateToLogin={handleNavigateToLogin}
        />
      </main>

      <PublicFooter />
    </div>
  );
}
