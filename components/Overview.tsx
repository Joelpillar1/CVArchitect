import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Crown, ArrowRight, Trash2, Copy, AlertTriangle, Eye, Edit, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { SavedTemplate } from '../types';
import { UserSubscription } from '../types/pricing';
import { getPlanDisplayName } from '../utils/pricingConfig';
import ResumePreview from './ResumePreview';
import { Job } from '../types/job';
import { calculateJobMatchScore, formatSalary } from '../utils/jobMatching';
import { fetchJobFeed } from '../services/jobFeedService';
import { getTemplateMetadata } from '../utils/templateConfig';

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
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [featuredJobs, setFeaturedJobs] = React.useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = React.useState(true);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div onClick={onCreateNew} className="group border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-green/50 hover:bg-white transition-all duration-300 min-h-[340px]">
            <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-green/20 transition-all duration-300">
              <Plus className="text-gray-400 group-hover:text-brand-dark" size={28} />
            </div>
            <h4 className="font-semibold text-brand-dark text-lg mb-2">Start Blank</h4>
            <p className="text-sm text-gray-400 font-light">Create a masterpiece from scratch</p>
          </div>

          {recentTemplates.map((template) => {
            const metadata = getTemplateMetadata(template.baseTemplate);
            return (
              <div
                key={template.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:border-brand-green hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-[340px]"
                onClick={() => onLoadTemplate(template)}
              >
                {/* Template Preview Area - Real Render */}
                <div className="relative flex-1 bg-gray-100 overflow-hidden w-full">
                  {/* Scaled Resume Preview - Centered */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210mm] origin-top transform scale-[0.45] pointer-events-none select-none">
                    <ResumePreview data={template.data} template={template.baseTemplate} />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/20 backdrop-blur-[2px]">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200 flex flex-col gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onLoadTemplate(template); }}
                        className="bg-brand-green hover:bg-brand-greenHover text-brand-dark px-5 py-2 rounded-lg font-bold shadow-xl transition-all flex items-center justify-center gap-1.5 text-sm"
                      >
                        <Edit size={14} /> Resume Editing
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons: Duplicate & Delete */}
                  <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    {onDuplicateTemplate && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDuplicateTemplate(template); }}
                        className="bg-white/90 backdrop-blur-sm text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-green hover:text-brand-dark transition-all shadow-sm cursor-pointer"
                        title="Duplicate Resume"
                      >
                        <Copy size={13} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(template.id); }}
                      className="bg-white/90 backdrop-blur-sm text-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all shadow-sm cursor-pointer"
                      title="Delete Template"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Template Footer Info */}
                <div className="h-20 px-4 flex items-center justify-between border-t border-gray-100 bg-white z-20 relative">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Logo / Icon */}
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      {metadata.icon}
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col overflow-hidden">
                      <h3 className="text-sm font-bold text-gray-900 truncate pr-2">
                        {template.tag}
                      </h3>
                      <span className="text-xs text-gray-500 truncate">
                        {metadata.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Jobs Section */}
        <div className="mt-14 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recommended Jobs
              </h3>
              <p className="text-gray-500 text-sm mt-0.5">
                Positions matching your profile and resume.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/jobs')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white font-medium text-xs transition-colors self-start sm:self-auto"
            >
              <span>View All Jobs</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loadingJobs ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse flex flex-col justify-between h-48"
                >
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-5 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              ))
            ) : featuredJobs.length > 0 ? (
              featuredJobs.map((job) => {
                const activeResume = savedTemplates[0]?.data;
                const { score } = calculateJobMatchScore(job, activeResume);

                return (
                  <div
                    key={job.id}
                    onClick={() => navigate('/dashboard/jobs')}
                    className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-400 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {job.company}
                          </span>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-gray-400" />
                            {job.location}
                          </p>
                        </div>

                        <div className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium">
                          {score}% Match
                        </div>
                      </div>

                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-2.5">
                        {job.title}
                      </h4>

                      <div className="flex items-center gap-1.5 mb-3">
                        {job.workplaceType && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-gray-50 text-gray-700 border border-gray-200 font-medium">
                            {job.workplaceType}
                          </span>
                        )}
                        {job.jobType && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-gray-50 text-gray-700 border border-gray-200 font-medium">
                            {job.jobType}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-gray-900 bg-gray-50 p-2 rounded border border-gray-100 mb-3">
                        {formatSalary(job.salary)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                      <span className="text-gray-500 font-medium">Click to view role</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-dark hover:bg-brand-dark/90 text-white font-medium rounded text-xs transition-colors">
                        Tailor Resume
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-sm text-gray-500 bg-white rounded-xl border border-gray-200">
                Explore thousands of active roles in the jobs section.
              </div>
            )}
          </div>
        </div>
      </div>

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