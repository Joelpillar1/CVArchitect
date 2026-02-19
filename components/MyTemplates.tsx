import React, { useState } from 'react';
import { SavedTemplate } from '../types';
import { ArrowRight, Trash2, AlertTriangle, Bookmark, Edit } from 'lucide-react';
import ResumePreview from './ResumePreview';
import { getTemplateMetadata } from '../utils/templateConfig';

interface MyTemplatesProps {
  templates: SavedTemplate[];
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function MyTemplates({ templates, onLoadTemplate, onDeleteTemplate }: MyTemplatesProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {templates.map((template) => {
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
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210mm] origin-top transform scale-[0.34] pointer-events-none select-none shadow-md">
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