import React, { useState } from 'react';
import { SavedTemplate, TemplateType } from '../types';
import { ArrowRight, Bookmark, LayoutTemplate, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface MyTemplatesProps {
  templates: SavedTemplate[];
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function MyTemplates({ templates, onLoadTemplate, onDeleteTemplate }: MyTemplatesProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  const handleDelete = () => {
    if (confirmDeleteId) {
      onDeleteTemplate(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const templateToDelete = templates.find(t => t.id === confirmDeleteId);

  return (
    <div className="p-8 md:p-12 h-full overflow-y-auto bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-brand-dark tracking-tight mb-3">My Templates</h2>
            <p className="text-gray-500 text-lg font-light">
              Your personalized collection of resumes. Ready to be adapted and deployed.
            </p>
          </div>
        </div>

        <div>
          {templates.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:border-brand-green hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Template Preview - Optimized CSS Preview */}
                  <div className="aspect-[210/297] bg-gray-50 relative overflow-hidden p-4">
                    {/* Template Style Preview */}
                    <div className="w-full h-full bg-white rounded-sm shadow-inner p-3 flex flex-col gap-1.5">
                      {/* Header simulation */}
                      <div className="h-8 bg-gray-100 rounded-sm"></div>
                      <div className="h-1 bg-gray-200 w-3/4 rounded-full"></div>

                      {/* Section 1 */}
                      <div className="mt-2">
                        <div className="h-2 w-16 rounded-sm mb-1 bg-brand-green"></div>
                        <div className="space-y-0.5">
                          <div className="h-1 bg-gray-300 w-full rounded-full"></div>
                          <div className="h-1 bg-gray-300 w-5/6 rounded-full"></div>
                          <div className="h-1 bg-gray-300 w-4/5 rounded-full"></div>
                        </div>
                      </div>

                      {/* Section 2 */}
                      <div className="mt-2">
                        <div className="h-2 w-12 rounded-sm mb-1 bg-brand-green"></div>
                        <div className="space-y-0.5">
                          <div className="h-1 bg-gray-300 w-full rounded-full"></div>
                          <div className="h-1 bg-gray-300 w-11/12 rounded-full"></div>
                        </div>
                      </div>

                      {/* Section 3 */}
                      <div className="mt-2">
                        <div className="h-2 w-14 rounded-sm mb-1 bg-brand-green"></div>
                        <div className="grid grid-cols-2 gap-0.5">
                          <div className="h-1 bg-gray-300 rounded-full"></div>
                          <div className="h-1 bg-gray-300 rounded-full"></div>
                          <div className="h-1 bg-gray-300 rounded-full"></div>
                          <div className="h-1 bg-gray-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-2 right-2 z-20 bg-brand-green text-brand-dark text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wide">
                      <Bookmark size={8} className="fill-brand-dark" />
                      Saved
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(template.id); }}
                      className="absolute top-2 left-2 z-40 bg-white/90 backdrop-blur-sm text-gray-400 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                      title="Delete Template"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Hover Overlay with Use Template button */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/20 backdrop-blur-[1px]">
                      <div className="transform scale-90 group-hover:scale-100 transition-transform duration-200">
                        <button
                          onClick={(e) => { e.stopPropagation(); onLoadTemplate(template); }}
                          className="bg-brand-green hover:bg-brand-greenHover text-brand-dark px-5 py-2 rounded-lg font-bold shadow-xl transition-all flex items-center justify-center gap-1.5 text-sm"
                        >
                          Use Template <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-3 bg-white border-t border-gray-100">
                    <h3 className="text-sm font-bold text-brand-dark truncate">{template.tag}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Based on {getBaseTemplateName(template.baseTemplate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 mx-auto bg-brand-secondary rounded-full flex items-center justify-center mb-6">
                <Bookmark className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark">No Saved Templates</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Go to the editor, perfect your resume, and use the "Save as New Template" feature in the Design tab to start building your library.
              </p>
            </div>
          )}
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