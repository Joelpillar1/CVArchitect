import React from 'react';
import { 
  MapPin, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  Building2
} from 'lucide-react';
import { Job } from '../../types/job';
import { ResumeData } from '../../types';
import { calculateJobMatchScore, formatSalary, formatPostedDate } from '../../utils/jobMatching';

interface JobCardProps {
  job: Job;
  resumeData?: ResumeData | null;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onTailorResume: (job: Job) => void;
}

export default function JobCard({
  job,
  resumeData,
  isSaved,
  onToggleSave,
  onSelectJob,
  onTailorResume
}: JobCardProps) {
  const { score } = calculateJobMatchScore(job, resumeData);

  return (
    <div 
      onClick={() => onSelectJob(job)}
      className="bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-400 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-md group"
    >
      <div className="p-5 sm:p-6">
        {/* Header: Company, Location & Save Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt=""
                  width={20}
                  height={20}
                  loading="lazy"
                  className="w-5 h-5 rounded-md shrink-0 object-contain border border-neutral-150 p-0.5 bg-white"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  <Building2 size={11} />
                </div>
              )}
              <span className="font-semibold text-neutral-900 text-sm truncate">
                {job.company}
              </span>
              {(job.companyWebsiteUrl || job.sourceUrl) && (
                <a
                  href={job.companyWebsiteUrl || job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-0.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                  title={`Visit ${job.company} careers page`}
                >
                  <ExternalLink size={10} className="shrink-0" />
                </a>
              )}
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
              <MapPin size={12} className="shrink-0 text-neutral-400" />
              <span className="truncate">{job.location}</span>
            </p>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              isSaved 
                ? 'bg-neutral-900 border-neutral-900 text-white' 
                : 'bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
            aria-label={isSaved ? 'Remove bookmark' : 'Save bookmark'}
          >
            {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
        </div>

        {/* Job Title */}
        <h3 className="text-base font-bold text-neutral-900 line-clamp-1 mb-3 group-hover:text-neutral-700 transition-colors">
          {job.title}
        </h3>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {job.workplaceType && (
            <span className="text-xs px-2.5 py-0.5 rounded-md border border-neutral-200/70 bg-neutral-50 text-neutral-700 font-medium">
              {job.workplaceType}
            </span>
          )}
          {job.jobType && (
            <span className="text-xs px-2.5 py-0.5 rounded-md border border-neutral-200/70 bg-neutral-50 text-neutral-700 font-medium">
              {job.jobType}
            </span>
          )}
          {job.department && (
            <span className="text-xs px-2.5 py-0.5 rounded-md border border-neutral-200/70 bg-neutral-50 text-neutral-700 font-medium">
              {job.department}
            </span>
          )}
        </div>

        {/* Salary Row */}
        <div className="flex items-center justify-between py-2 px-3 bg-neutral-50/80 rounded-xl border border-neutral-150 text-xs">
          <span className="font-semibold text-neutral-900 truncate">
            {formatSalary(job.salary)}
          </span>
          {job.experienceLevel && (
            <span className="text-neutral-500 font-medium text-[11px] shrink-0 ml-2">
              {job.experienceLevel}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 sm:px-6 py-3 bg-neutral-50/40 border-t border-neutral-150 flex items-center justify-between gap-2 text-xs text-neutral-500">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center gap-1 text-neutral-400 truncate">
            <Clock size={12} className="shrink-0" />
            <span className="truncate">{formatPostedDate(job.postedAt) || job.postedDate}</span>
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onTailorResume(job);
          }}
          className="inline-flex items-center justify-center px-3 py-1.5 bg-brand-dark hover:bg-brand-dark/90 text-white font-medium rounded-lg text-xs transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          <span>Tailor Resume</span>
        </button>
      </div>
    </div>
  );
}

