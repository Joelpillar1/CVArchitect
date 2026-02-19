import React from 'react';
import { Plus, FileText, Zap, Crown, ArrowRight, Trash2, AlertTriangle, Eye, Edit } from 'lucide-react';
import { SavedTemplate } from '../types';
import { UserSubscription } from '../types/pricing';
import ResumePreview from './ResumePreview';
import { getTemplateMetadata } from '../utils/templateConfig';

interface OverviewProps {
  onCreateNew: () => void;
  savedTemplates: SavedTemplate[];
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  userName?: string;
  userSubscription?: UserSubscription;
}

export default function Overview({ onCreateNew, savedTemplates, onLoadTemplate, onDeleteTemplate, userName, userSubscription }: OverviewProps) {
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const recentTemplates = savedTemplates.slice(0, 5);
  const templateToDelete = savedTemplates.find(t => t.id === confirmDeleteId);

  const handleDelete = () => {
    if (confirmDeleteId) {
      onDeleteTemplate(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const getPlanName = (id?: string) => {
    switch (id) {
      case 'week_pass': return 'Career Sprint';
      case 'pro_monthly': return 'Career Marathon';
      default: return 'Free Plan';
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatCard
            icon={<FileText className="text-brand-dark" />}
            label="Active Resumes"
            value={savedTemplates.length.toString()}
          />
          <StatCard
            icon={<Zap className="text-yellow-600" />}
            label="AI Credits"
            value={userSubscription?.credits.toString() || '0'}
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
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210mm] origin-top transform scale-[0.45] pointer-events-none select-none shadow-md">
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

                  {/* Delete Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(template.id); }}
                    className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm text-gray-400 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                    title="Delete Template"
                  >
                    <Trash2 size={14} />
                  </button>
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