import React, { useState } from 'react';
import { SavedTemplate } from '../types';
import { Trash2, Copy, AlertTriangle, Bookmark, Edit, CheckSquare, Square, X } from 'lucide-react';
import ResumePreview from './ResumePreview';
import { getTemplateMetadata } from '../utils/templateConfig';

interface MyTemplatesProps {
  templates: SavedTemplate[];
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onDuplicateTemplate?: (template: SavedTemplate) => void;
}

export default function MyTemplates({ templates, onLoadTemplate, onDeleteTemplate, onDuplicateTemplate }: MyTemplatesProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false);

  // --- Single delete ---
  const handleDelete = () => {
    if (confirmDeleteId) {
      onDeleteTemplate(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  // --- Select mode helpers ---
  const toggleSelectMode = () => {
    setIsSelectMode((prev) => !prev);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(templates.map((t) => t.id)));
  const clearSelection = () => setSelectedIds(new Set());

  // --- Batch delete ---
  const handleBatchDelete = () => {
    selectedIds.forEach((id) => onDeleteTemplate(id));
    setSelectedIds(new Set());
    setConfirmBatchDelete(false);
    setIsSelectMode(false);
  };

  const templateToDelete = templates.find((t) => t.id === confirmDeleteId);
  const allSelected = templates.length > 0 && selectedIds.size === templates.length;

  return (
    <div className="p-8 md:p-12 h-full overflow-y-auto bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-brand-dark tracking-tight mb-3">My Templates</h2>
            <p className="text-gray-500 text-lg font-light">
              Your personalized collection of resumes. Ready to be adapted and deployed.
            </p>
          </div>

          {/* Header actions */}
          {templates.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              {isSelectMode ? (
                <>
                  {/* Select All / Deselect All */}
                  <button
                    onClick={allSelected ? clearSelection : selectAll}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-brand-dark transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </button>

                  {/* Batch delete button */}
                  {selectedIds.size > 0 && (
                    <button
                      onClick={() => setConfirmBatchDelete(true)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm"
                    >
                      <Trash2 size={14} />
                      Delete ({selectedIds.size})
                    </button>
                  )}

                  {/* Cancel select mode */}
                  <button
                    onClick={toggleSelectMode}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <X size={15} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleSelectMode}
                  className="flex items-center gap-2 border border-gray-300 hover:border-brand-green hover:text-brand-dark text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:bg-brand-secondary"
                >
                  <CheckSquare size={15} />
                  Select
                </button>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        <div>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {templates.map((template) => {
                const metadata = getTemplateMetadata(template.baseTemplate);
                const isSelected = selectedIds.has(template.id);

                return (
                  <div
                    key={template.id}
                    className={`group bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col h-[340px] ${
                      isSelectMode
                        ? isSelected
                          ? 'border-brand-green shadow-lg ring-2 ring-brand-green/30 cursor-pointer'
                          : 'border-gray-200 hover:border-brand-green hover:shadow-md cursor-pointer'
                        : 'border-gray-200 hover:border-brand-green hover:shadow-xl cursor-pointer'
                    }`}
                    onClick={() => {
                      if (isSelectMode) toggleSelect(template.id);
                      else onLoadTemplate(template);
                    }}
                  >
                    {/* Template Preview Area */}
                    <div className="relative flex-1 bg-gray-100 overflow-hidden w-full">
                      {/* Scaled Resume Preview */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210mm] origin-top transform scale-[0.34] pointer-events-none select-none shadow-md">
                        <ResumePreview data={template.data} template={template.baseTemplate} />
                      </div>

                      {/* Select Mode Overlay */}
                      {isSelectMode && (
                        <div
                          className={`absolute inset-0 z-10 transition-all duration-200 ${
                            isSelected ? 'bg-brand-green/10' : 'bg-transparent hover:bg-brand-dark/5'
                          }`}
                        >
                          {/* Checkbox */}
                          <div className="absolute top-2 left-2 z-20">
                            <div
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shadow-sm transition-all ${
                                isSelected
                                  ? 'bg-brand-green border-brand-green'
                                  : 'bg-white/90 border-gray-300 backdrop-blur-sm'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-3.5 h-3.5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hover Overlay (non-select mode) */}
                      {!isSelectMode && (
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
                      )}

                      {/* Action Buttons: Duplicate & Delete (non-select mode) */}
                      {!isSelectMode && (
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
                      )}
                    </div>

                    {/* Template Footer Info */}
                    <div className="h-20 px-4 flex items-center justify-between border-t border-gray-100 bg-white z-20 relative">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                          {metadata.icon}
                        </div>
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

      {/* Single Delete Confirmation Modal */}
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

      {/* Batch Delete Confirmation Modal */}
      {confirmBatchDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm" onClick={() => setConfirmBatchDelete(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-dark">
                  Delete {selectedIds.size} Template{selectedIds.size > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  You are about to permanently delete{' '}
                  <span className="font-semibold text-brand-dark">
                    {selectedIds.size} template{selectedIds.size > 1 ? 's' : ''}
                  </span>. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setConfirmBatchDelete(false)}
                className="px-4 py-2 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-4 py-2 rounded-lg font-semibold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete {selectedIds.size} Template{selectedIds.size > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}