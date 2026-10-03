import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  DollarSign,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BadgeCheck,
  Clock,
} from 'lucide-react';
import { fetchJobFeed, fetchJobFeedStats, type JobFeedStats } from '../services/jobFeedService';
import { Job } from '../types/job';
import { MOCK_JOBS } from '../data/mockJobs';
import { formatSalary } from '../utils/jobMatching';
import { getCompanyLogoUrl, getCompanyDomain } from '../utils/companyLogo';
import JobRolesMarquee from './JobRolesMarquee';
import { useAuth } from '../contexts/AuthContext';

interface LandingJobsSectionProps {
  onTailorJob?: (job: Job) => void;
}

function VerticalBoundLines() {
  return (
    <div
      className="absolute inset-y-0 left-3 right-3 sm:left-6 sm:right-6 md:left-[calc(100vw/6)] md:right-[calc(100vw/6)] pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-0 w-px bg-brand-border" />
      <div className="absolute inset-y-0 right-0 w-px bg-brand-border" />
    </div>
  );
}

export default function LandingJobsSection({ onTailorJob }: LandingJobsSectionProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobFeedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadJobs() {
      try {
        const result = await fetchJobFeed({ pageSize: 12 });
        if (isMounted && result && result.jobs.length > 0) {
          setJobs(result.jobs);
        } else if (isMounted) {
          setJobs(MOCK_JOBS.slice(0, 12));
        }
      } catch (err) {
        if (isMounted) setJobs(MOCK_JOBS.slice(0, 12));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadJobs();
    fetchJobFeedStats().then((res) => {
      if (isMounted && res) {
        setStats(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayJobs = jobs.slice(0, 6);

  const handleTailorClick = (job: Job) => {
    if (onTailorJob) {
      onTailorJob(job);
    } else if (user) {
      try {
        sessionStorage.setItem('cv_pending_job_context', JSON.stringify(job));
        sessionStorage.setItem('cv_pending_selected_job', JSON.stringify(job));
      } catch (_) {}
      navigate('/dashboard/jobs', { state: { selectedJob: job, autoOpenDetails: true } });
    } else {
      try {
        sessionStorage.setItem('cv_pending_job_context', JSON.stringify(job));
        sessionStorage.setItem('cv_pending_selected_job', JSON.stringify(job));
      } catch (_) {}
      navigate('/jobs');
    }
  };

  return (
    <section id="jobs" className="relative py-24 md:py-36 bg-brand-bg text-brand-dark overflow-hidden border-t border-brand-border">
      <VerticalBoundLines />
      <div className="relative z-10 w-full max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 sm:gap-2.5 py-1 pl-1 pr-3.5 sm:pr-5 rounded-full bg-white border border-brand-green/50 shadow-sm mb-6 max-w-full"
          >
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-dark animate-pulse" />
              Live Feed
            </span>
            <span className="text-xs sm:text-sm font-semibold text-brand-dark whitespace-nowrap truncate">
              {stats && stats.total > 0 ? `${stats.total.toLocaleString()} Verified Tech Postings` : 'Verified Tech Postings'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark text-balance"
          >
            Find high-impact roles.{' '}
            <span className="underline decoration-brand-green decoration-[5px] underline-offset-[8px]">
              Tailor in one click.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-base sm:text-lg text-brand-dark/60 leading-relaxed max-w-2xl mx-auto"
          >
            We index real, unexpired openings directly from top company career portals. Pick any role to tailor your resume instantly with zero hallucinations.
          </motion.p>
        </div>

        {/* Multi-row Animated Job Roles Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 overflow-hidden"
        >
          <JobRolesMarquee />
        </motion.div>

        {/* Jobs Grid */}
        {/* Jobs Grid (Clean Minimalist Cards Matching Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {displayJobs.map((job, idx) => {
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
                <motion.div
                  key={job.id || idx}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                  onClick={() => handleTailorClick(job)}
                  className="bg-white border border-brand-border hover:border-brand-dark/30 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-xs flex flex-col justify-between overflow-hidden cursor-pointer group"
                >
                  <div>
                    {/* Job Title */}
                    <h3 className="text-base sm:text-[17px] font-bold text-brand-dark tracking-tight group-hover:text-brand-dark transition-colors line-clamp-2 mb-1">
                      {job.title}
                    </h3>

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

                  {/* Actions Bar: Apply */}
                  <div className="flex items-center gap-2 mt-4 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTailorClick(job);
                      }}
                      className="px-5 py-1.5 rounded-full bg-brand-dark hover:bg-brand-dark/90 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Metrics Bar + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 bg-white rounded-2xl border border-brand-border p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto">
            <div className="text-left">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
                {stats && stats.total > 0 ? stats.total.toLocaleString() : '—'}
              </div>
              <div className="text-xs text-brand-dark/60 mt-1 font-medium">Verified Active Jobs</div>
            </div>
            <div className="text-left">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">1-Click</div>
              <div className="text-xs text-brand-dark/60 mt-1 font-medium">Agent Resume Tailoring</div>
            </div>
            <div className="text-left">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">98%</div>
              <div className="text-xs text-brand-dark/60 mt-1 font-medium">ATS Match Rate</div>
            </div>
            <div className="text-left">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">Zero</div>
              <div className="text-xs text-brand-dark/60 mt-1 font-medium">Ghost Postings</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-dark hover:bg-brand-dark/90 text-white font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{stats && stats.total > 0 ? `Explore All ${stats.total.toLocaleString()} Jobs` : 'Explore All Jobs'}</span>
              <ArrowRight className="w-4 h-4 text-brand-green" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
