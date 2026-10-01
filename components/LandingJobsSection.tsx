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
} from 'lucide-react';
import { fetchJobFeed } from '../services/jobFeedService';
import { Job } from '../types/job';
import { MOCK_JOBS } from '../data/mockJobs';
import { formatSalary } from '../utils/jobMatching';
import { getCompanyLogoUrl, getCompanyDomain } from '../utils/companyLogo';

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
  const [jobs, setJobs] = useState<Job[]>([]);
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
    return () => {
      isMounted = false;
    };
  }, []);

  const displayJobs = jobs.slice(0, 6);

  const handleTailorClick = (job: Job) => {
    if (onTailorJob) {
      onTailorJob(job);
    } else {
      try {
        sessionStorage.setItem('cv_pending_job_context', JSON.stringify(job));
      } catch (_) {}
      navigate('/dashboard/jobs');
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
            <span className="text-xs sm:text-sm font-semibold text-brand-dark whitespace-nowrap truncate">8,500+ Verified Tech Postings</span>
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

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {displayJobs.map((job, idx) => {
              const salaryFormatted = formatSalary(job.salary);
              return (
                <motion.div
                  key={job.id || idx}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                  className="group relative bg-white border border-brand-border hover:border-brand-dark/30 rounded-2xl p-5 sm:p-6 transition-colors duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden cursor-default"
                >
                  {/* Top: Company Header & Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 border border-brand-border shadow-xs flex items-center justify-center overflow-hidden">
                          <img
                            src={getCompanyLogoUrl(job.company, job.companyLogo, job.companyWebsiteUrl || job.sourceUrl)}
                            alt={`${job.company} logo`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              const domain = getCompanyDomain(job.company, job.companyWebsiteUrl || job.sourceUrl);
                              if (!img.dataset.fallback) {
                                img.dataset.fallback = 'true';
                                img.src = `https://unavatar.io/${domain}?fallback=https://logo.clearbit.com/${domain}`;
                              }
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-brand-dark text-sm truncate">
                              {job.company}
                            </h4>
                            <BadgeCheck className="w-4 h-4 text-[#3B82F6] fill-[#3B82F6] shrink-0 inline-block" stroke="white" strokeWidth={2} />
                          </div>
                          <p className="text-xs text-brand-dark/55 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-brand-dark/40 shrink-0" />
                            <span className="truncate">{job.location || 'Remote'}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg font-bold text-brand-dark tracking-tight group-hover:text-emerald-800 transition-colors line-clamp-1 mb-2.5">
                      {job.title}
                    </h3>

                    {/* Salary & Workplace Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {salaryFormatted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-green/20 text-brand-dark border border-brand-green/40">
                          <DollarSign className="w-3 h-3 text-brand-dark" />
                          {salaryFormatted}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-secondary text-brand-dark/70 border border-brand-border">
                          Competitive Pay
                        </span>
                      )}

                      {job.workplaceType && (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-brand-secondary text-brand-dark/70 border border-brand-border">
                          {job.workplaceType}
                        </span>
                      )}
                    </div>

                    {/* Key skills preview */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {job.skills.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand-secondary text-brand-dark/70 border border-brand-border"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] text-brand-dark/50">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3.5 border-t border-brand-border flex items-center gap-2 mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTailorClick(job)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-brand-green hover:bg-brand-greenHover text-brand-dark font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-dark" />
                      <span>Tailor Resume</span>
                    </motion.button>

                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-brand-secondary hover:bg-brand-border text-brand-dark/70 hover:text-brand-dark transition-colors flex items-center justify-center border border-brand-border cursor-pointer"
                        title="View original job posting"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">8,500+</div>
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
              onClick={() => navigate('/dashboard/jobs')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-dark hover:bg-brand-dark/90 text-white font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore All 8,500+ Jobs</span>
              <ArrowRight className="w-4 h-4 text-brand-green" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
