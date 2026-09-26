import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Check, 
  Share2,
  Briefcase,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Job } from '../../types/job';
import { ResumeData } from '../../types';
import { formatSalary, formatPostedDate } from '../../utils/jobMatching';

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  resumeData?: ResumeData | null;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onTailorResume: (job: Job) => void;
  onGenerateCoverLetter: (job: Job) => void;
}

export default function JobDetailsModal({
  job,
  isOpen,
  onClose,
  resumeData,
  isSaved,
  onToggleSave,
  onTailorResume,
  onGenerateCoverLetter,
}: JobDetailsModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [applied, setApplied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const handleCopyLink = () => {
    const shareUrl = job.applyUrl || job.sourceUrl || window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleApply = () => {
    if (job.applyUrl || job.sourceUrl) {
      window.open(job.applyUrl || job.sourceUrl, '_blank', 'noopener,noreferrer');
    }
    setApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Subtle modern backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-150" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl z-10 overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Clean Minimal Header */}
        <div className="p-6 sm:p-8 border-b border-neutral-100 flex items-start justify-between gap-4 bg-white">
          <div className="min-w-0 flex-1">
            {/* Company & Source Links */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt=""
                  width={22}
                  height={22}
                  className="w-[22px] h-[22px] rounded-md object-contain shrink-0 border border-neutral-150 p-0.5 bg-white"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-[22px] h-[22px] rounded-md bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                  <Building2 size={13} />
                </div>
              )}
              <span className="font-semibold text-neutral-900 text-sm">{job.company}</span>
              
              {(job.companyWebsiteUrl || job.sourceUrl) && (
                <a
                  href={job.companyWebsiteUrl || job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                  title={`Visit ${job.company} careers page`}
                >
                  <span>Company page</span>
                  <ExternalLink size={11} className="shrink-0 text-neutral-400" />
                </a>
              )}
            </div>

            {/* Main Job Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mt-2.5">
              {job.title}
            </h1>

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 mt-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-neutral-400 shrink-0" />
                <span>{job.location}</span>
                {job.workplaceType && <span className="text-neutral-400">({job.workplaceType})</span>}
              </span>
              
              {job.jobType && (
                <span className="flex items-center gap-1">
                  <Briefcase size={13} className="text-neutral-400 shrink-0" />
                  <span>{job.jobType}</span>
                </span>
              )}

              <span className="flex items-center gap-1">
                <Clock size={13} className="text-neutral-400 shrink-0" />
                <span>{formatPostedDate(job.postedAt) || job.postedDate}</span>
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 text-neutral-800">
          
          {/* Key Parameters Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-150">
              <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                Compensation
              </span>
              <span className="font-semibold text-neutral-900 text-xs sm:text-sm block truncate">
                {formatSalary(job.salary)}
              </span>
            </div>

            <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-150">
              <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                Experience
              </span>
              <span className="font-semibold text-neutral-900 text-xs sm:text-sm block truncate">
                {job.experienceLevel || 'Not specified'}
              </span>
            </div>

            <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-150">
              <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                Department
              </span>
              <span className="font-semibold text-neutral-900 text-xs sm:text-sm block truncate">
                {job.department || 'General'}
              </span>
            </div>

            <div className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-150">
              <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                Workplace
              </span>
              <span className="font-semibold text-neutral-900 text-xs sm:text-sm block truncate">
                {job.workplaceType || job.jobType || 'Standard'}
              </span>
            </div>
          </div>

          {/* Role Description */}
          {job.description && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                About The Role
              </h2>
              <p className="text-neutral-700 text-sm leading-relaxed font-normal whitespace-pre-line">
                {job.description}
              </p>
            </div>
          )}

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Key Responsibilities
              </h2>
              <ul className="space-y-2 text-sm text-neutral-700">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Qualifications */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Requirements & Qualifications
              </h2>
              <ul className="space-y-2 text-sm text-neutral-700">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills & Technologies */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200/60 text-neutral-800 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Benefits & Perks
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-700">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-neutral-50/70 p-2.5 rounded-lg border border-neutral-150 leading-relaxed text-xs">
                    <CheckCircle2 size={14} className="text-neutral-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Clean Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-neutral-150 flex flex-wrap items-center justify-between gap-3">
          {/* Secondary bookmark & share actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(job.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          {/* Primary AI & Apply action buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => onTailorResume(job)}
              className="px-4 py-2 rounded-xl bg-brand-dark hover:bg-brand-dark/90 text-white font-medium text-xs transition-colors flex items-center justify-center whitespace-nowrap shadow-sm"
            >
              <span>Tailor Resume</span>
            </button>

            <button
              onClick={() => onGenerateCoverLetter(job)}
              className="px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-medium text-xs transition-colors whitespace-nowrap"
            >
              <span>Cover Letter</span>
            </button>

            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-900 font-medium text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <ExternalLink size={12} className="shrink-0 text-neutral-500" />
              <span>{applied ? 'Applied' : 'Apply on Site'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

