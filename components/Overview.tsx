import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Crown, ArrowRight, Trash2, Copy, AlertTriangle, Eye, Edit, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { SavedTemplate, ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { getPlanDisplayName } from '../utils/pricingConfig';
import ResumePreview from './ResumePreview';
import { Job } from '../types/job';
import { getSavedJobIds, toggleSaveJob } from '../utils/jobMatching';
import { fetchJobFeed } from '../services/jobFeedService';
import { getTemplateMetadata } from '../utils/templateConfig';
import JobCard from './jobs/JobCard';
import JobDetailsModal from './jobs/JobDetailsModal';
import SelectResumeModal from './jobs/SelectResumeModal';
import { useToast } from '../contexts/ToastContext';
import { formatJobDescriptionForChat } from '../pages/JobsPage';
import { saveToStorage } from '../utils/statePersistence';

interface OverviewProps {
  onCreateNew: () => void;
  savedTemplates: SavedTemplate[];
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onDuplicateTemplate?: (template: SavedTemplate) => void;
  userName?: string;
  userSubscription?: UserSubscription;
}

export default function Overview({ onCreateNew, savedTemplates, onLoadTemplate, onDeleteTemplate, onDuplicateTemplate, userName, userSubscription }: OverviewProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [featuredJobs, setFeaturedJobs] = React.useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = React.useState(true);
  const [savedJobIds, setSavedJobIds] = React.useState<string[]>(() => getSavedJobIds());
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [resumeSelectJob, setResumeSelectJob] = React.useState<Job | null>(null);
  const recentTemplates = savedTemplates.slice(0, 5);
  const templateToDelete = savedTemplates.find(t => t.id === confirmDeleteId);

  React.useEffect(() => {
    let isMounted = true;
    fetchJobFeed({ pageSize: 3, sortBy: 'recent' })
      .then((res) => {
        if (isMounted) {
          setFeaturedJobs(res.jobs);
          setLoadingJobs(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingJobs(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleSave = (jobId: string) => {
    const isNowSaved = toggleSaveJob(jobId);
    setSavedJobIds(getSavedJobIds());
    const targetJob = featuredJobs.find((j) => j.id === jobId);
    const title = targetJob?.title || 'Job';
    if (isNowSaved) {
      showToast(`Saved "${title}" to your bookmarks.`, 'success');
    } else {
      showToast(`Removed "${title}" from bookmarks.`, 'info');
    }
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
    setSelectedJob(null);
    navigate('/dashboard/cover-letter', {
      state: {
        prefillJob: {
          jobTitle: job.title,
          companyName: job.company,
          jobDescription: `${job.title} at ${job.company}\n\nRole Overview:\n${job.description || ''}\n\nKey Requirements:\n${(job.requirements || []).join('\n')}`,
        },
      },
    });
  };

  const handleDelete = () => {
    if (confirmDeleteId) {
      onDeleteTemplate(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const getPlanName = (id?: string) => getPlanDisplayName(id);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-8 md:p-12 h-full overflow-y-auto bg-brand-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-brand-dark tracking-tight mb-3">
              {getGreeting()}, {userName || 'there'}.
            </h2>
            <p className="text-gray-500 text-lg font-light">
              You have {savedTemplates.length} active resumes ready for deployment.
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="bg-brand-green hover:bg-brand-greenHover text-brand-dark px-8 py-4 rounded-xl font-semibold shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Plus size={20} />
            Create New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <StatCard
            icon={<FileText className="text-brand-dark" />}
            label="Active Resumes"
            value={savedTemplates.length.toString()}
          />
          <StatCard
            icon={<Crown className="text-purple-600" />}
            label="Current Plan"
            value={getPlanName(userSubscription?.planId)}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-brand-dark tracking-tight">Recent Work</h3>
          {savedTemplates.length > 5 && (
            <button className="text-sm font-medium text-gray-500 hover:text-brand-dark flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Start Blank Card */}
          <div
            onClick={onCreateNew}
            className="group bg-[#EEF1F4] rounded-[24px] border border-dashed border-gray-300 hover:border-brand-green p-3 sm:p-3.5 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Top Card Header */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="bg-[#6F7682] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
                New Resume
              </div>
              <div className="w-6 h-6 rounded-full bg-brand-green text-brand-dark flex items-center justify-center shadow-2xs">
                <Plus size={13} className="stroke-[3]" />
              </div>
            </div>

            {/* Inner White Frame */}
            <div className="relative w-full aspect-[4/3] bg-white rounded-xl border border-dashed border-gray-200 group-hover:border-brand-green/50 overflow-hidden shadow-2xs flex flex-col items-center justify-center p-4 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-brand-green/20 transition-all duration-300">
                <Plus className="text-gray-400 group-hover:text-brand-dark" size={24} />
              </div>
              <h4 className="font-bold text-brand-dark text-sm">Start Blank</h4>
              <p className="text-[11px] text-gray-400 font-medium text-center">Create from scratch</p>
            </div>

            {/* Bottom Subtitle Line */}
            <div className="mt-2 px-1 flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium truncate">Blank Canvas</span>
              <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider shrink-0 ml-2">Quick Start</span>
            </div>
          </div>

          {/* Recent Templates Cards */}
          {recentTemplates.map((template) => {
            const metadata = getTemplateMetadata(template.baseTemplate);
            return (
              <div
                key={template.id}
                className="group bg-[#EEF1F4] rounded-[24px] border border-gray-200/80 p-3 sm:p-3.5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => onLoadTemplate(template)}
              >
                {/* Top Card Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  {/* Name / Tag Pill */}
                  <div className="bg-[#6F7682] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-2xs tracking-tight truncate max-w-[170px]">
                    {template.tag || metadata.name}
                  </div>

                  {/* Right Actions: Duplicate & Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    {onDuplicateTemplate && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDuplicateTemplate(template); }}
                        className="w-6 h-6 rounded-full bg-[#6F7682]/20 text-gray-700 flex items-center justify-center hover:bg-brand-green hover:text-brand-dark transition-all shadow-2xs"
                        title="Duplicate Resume"
                      >
                        <Copy size={11} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(template.id); }}
                      className="w-6 h-6 rounded-full bg-[#6F7682]/20 text-gray-700 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-2xs"
                      title="Delete Template"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Inner White Preview Canvas */}
                <div className="relative w-full aspect-[4/3] bg-white rounded-xl border border-gray-200/70 overflow-hidden shadow-2xs flex items-center justify-center">
                  {/* Scaled Resume Preview */}
                  <div className="absolute inset-0 flex items-start justify-center pt-2 overflow-hidden pointer-events-none select-none">
                    <div className="w-[210mm] origin-top transform scale-[0.27] sm:scale-[0.29] pointer-events-none select-none shadow-xs rounded-xs bg-white">
                      <ResumePreview data={template.data} template={template.baseTemplate} />
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/25 backdrop-blur-[2px] p-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); onLoadTemplate(template); }}
                      className="bg-brand-green hover:bg-brand-greenHover text-brand-dark px-4 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs"
                    >
                      <Edit size={13} /> Resume Editing
                    </button>
                  </div>
                </div>

                {/* Bottom Subtitle Line */}
                <div className="mt-2 px-1 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium truncate">{metadata.name}</span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 ml-2">
                    {new Date(template.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Jobs Section */}
        <div className="mt-14 pt-10 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                Recommended Jobs
              </h3>
              <p className="text-neutral-500 text-sm mt-0.5 font-light">
                Live verified positions matching your profile and background.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/jobs')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-dark hover:bg-brand-dark/90 text-white font-semibold text-xs transition-all self-start sm:self-auto shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>View All Jobs</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingJobs ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 animate-pulse flex flex-col justify-between h-[230px]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5.5 h-5.5 rounded-md bg-neutral-150" />
                      <div className="h-4 bg-neutral-100 rounded w-1/3" />
                    </div>
                    <div className="h-5 bg-neutral-100 rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-neutral-100 rounded w-16" />
                      <div className="h-5 bg-neutral-100 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-9 bg-neutral-100 rounded-xl" />
                </div>
              ))
            ) : featuredJobs.length > 0 ? (
              featuredJobs.map((job) => {
                const activeResume = savedTemplates[0]?.data;
                const isSaved = savedJobIds.includes(job.id);

                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    resumeData={activeResume}
                    isSaved={isSaved}
                    onToggleSave={handleToggleSave}
                    onSelectJob={(j) => setSelectedJob(j)}
                    onTailorResume={(j) => setResumeSelectJob(j)}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-sm text-neutral-500 bg-white rounded-2xl border border-neutral-200/80">
                Explore active verified roles in the jobs section.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        resumeData={savedTemplates[0]?.data}
        isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
        onToggleSave={handleToggleSave}
        onTailorResume={(job) => {
          setSelectedJob(null);
          setResumeSelectJob(job);
        }}
        onGenerateCoverLetter={handleGenerateCoverLetter}
      />

      {/* Select Resume Modal for Tailoring */}
      <SelectResumeModal
        isOpen={Boolean(resumeSelectJob)}
        onClose={() => setResumeSelectJob(null)}
        job={resumeSelectJob}
        savedTemplates={savedTemplates}
        currentResumeData={savedTemplates[0]?.data}
        currentResumeId={savedTemplates[0]?.id}
        currentTemplate={savedTemplates[0]?.baseTemplate || 'vanguard'}
        onSelectResume={handleSelectResumeForJob}
      />

      {/* Confirmation Modal */}
      {confirmDeleteId && templateToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-dark">Delete Template</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Are you sure you want to delete the template tagged as "{templateToDelete.tag}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg font-semibold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-brand-surface p-8 rounded-2xl shadow-soft border border-brand-border flex items-center gap-6 hover:shadow-lg transition-shadow duration-300">
    <div className="w-14 h-14 rounded-xl bg-brand-secondary flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <h4 className="text-3xl font-bold text-brand-dark tracking-tight">{value}</h4>
    </div>
  </div>
);