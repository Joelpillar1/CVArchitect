import React from 'react';
import { Plus, FileText, Zap, Crown, ArrowRight, Bookmark, Trash2, AlertTriangle } from 'lucide-react';
import { SavedTemplate, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';

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

  const getBaseTemplateName = (base: TemplateType) => {
    switch (base) {
      case 'free': return 'CareerCraft';
      case 'simplepro': return 'SimplePro';
      case 'vanguard': return 'The Vanguard';
      case 'elevate': return 'Elevate Resume';
      case 'prime': return 'Prime Profile';
      case 'impact': return 'Impact';
      case 'dev': return 'DevPro';
      case 'elite': return 'Elite Professional';
      case 'apex': return 'Apex Executive';
      case 'modern': return 'Modern Professional';
      case 'executive': return 'Executive Suite';
      case 'classic': return 'Classic Professional';
      default: return 'Custom';
    }
  };

  const getPlanName = (id?: string) => {
    switch (id) {
      case 'week_pass': return 'Career Sprint';
      case 'pro_monthly': return 'Career Marathon';
      default: return 'Free Plan';
    }
  };

  return (
    <div className="p-8 md:p-12 h-full overflow-y-auto bg-brand-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-brand-dark tracking-tight mb-3">
              Good morning, {userName || 'there'}.
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
          <div onClick={onCreateNew} className="group border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-green/50 hover:bg-white transition-all duration-300 min-h-[320px]">
            <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-green/20 transition-all duration-300">
              <Plus className="text-gray-400 group-hover:text-brand-dark" size={28} />
            </div>
            <h4 className="font-semibold text-brand-dark text-lg mb-2">Start Blank</h4>
            <p className="text-sm text-gray-400 font-light">Create a masterpiece from scratch</p>
          </div>

          {recentTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onLoadTemplate(template)}
              className="bg-brand-surface p-5 rounded-2xl shadow-soft border border-brand-border hover:shadow-float hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className="aspect-[3/4] rounded-xl bg-gray-50 mb-5 overflow-hidden relative shadow-inner p-4">
                {/* CSS Preview */}
                <div className="w-full h-full bg-white rounded-sm shadow-inner p-3 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="h-6 bg-gray-100 rounded-sm"></div>
                  <div className="h-1 bg-gray-200 w-3/4 rounded-full"></div>
                  <div className="mt-2">
                    <div className="h-1.5 w-12 rounded-sm mb-1 bg-brand-green"></div>
                    <div className="space-y-0.5">
                      <div className="h-1 bg-gray-300 w-full rounded-full"></div>
                      <div className="h-1 bg-gray-300 w-5/6 rounded-full"></div>
                    </div>
                  </div>
                  <div className="mt-1">
                    <div className="h-1.5 w-10 rounded-sm mb-1 bg-brand-green"></div>
                    <div className="space-y-0.5">
                      <div className="h-1 bg-gray-300 w-11/12 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(template.id); }}
                  className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm text-gray-400 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                  title="Delete Template"
                >
                  <Trash2 size={14} />
                </button>

                <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-brand-green text-brand-dark font-semibold py-3 rounded-lg shadow-lg text-sm">Resume Editing</button>
                </div>
              </div>
              <div className="mt-auto">
                <h4 className="font-bold text-brand-dark text-lg truncate">{template.tag}</h4>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 font-medium">
                  <Bookmark size={12} />
                  {getBaseTemplateName(template.baseTemplate)}
                </div>
              </div>
            </div>
          ))}
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