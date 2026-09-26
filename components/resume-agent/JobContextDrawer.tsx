import React, { useState } from 'react';
import { X, Briefcase, Building2, CheckCircle, AlertCircle, FileText, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { JobDescriptionData, JobMatchAnalysis } from '../../types/resumeAgent';

interface JobContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: JobDescriptionData | null;
  analysis?: JobMatchAnalysis | null;
}

export default function JobContextDrawer({ isOpen, onClose, jobData, analysis }: JobContextDrawerProps) {
  const [isJDExpanded, setIsJDExpanded] = useState(false);

  if (!isOpen || !jobData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-200 overflow-hidden animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Job Context</h3>
              <p className="text-xs text-slate-300">Target Role Parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-slate-800">
          {/* Target Role & Company Card */}
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Target Role</span>
              <h4 className="font-bold text-base text-slate-900 leading-tight">{jobData.title}</h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{jobData.company}</span>
              {jobData.seniority && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                    {jobData.seniority}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Key Requirements List */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Key Requirements</span>
            </h4>
            <div className="space-y-2">
              {jobData.requiredSkills.map((req, idx) => {
                const isMatched = analysis?.strongMatches?.some(sm => sm.toLowerCase().includes(req.toLowerCase())) ?? true;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-gray-200 text-xs shadow-2xs"
                  >
                    {isMatched ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span className="font-medium text-slate-800 leading-snug">{req}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keywords Cloud */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Target ATS Keywords</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {jobData.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Full Job Description Text (Expandable) */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={() => setIsJDExpanded(!isJDExpanded)}
              className="w-full p-3.5 flex items-center justify-between bg-white text-xs font-bold text-slate-900 hover:bg-gray-50 border-b border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Original Job Description</span>
              </div>
              {isJDExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {isJDExpanded && (
              <div className="p-4 text-xs font-mono text-slate-600 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto bg-slate-900 text-slate-200">
                {jobData.descriptionText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
