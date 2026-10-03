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
            <h2 className="text-4xl font-bold text-brand-dark tracking-tight mb-3">My Resumes</h2>
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
                    className={`group bg-[#EEF1F4] rounded-[24px] border transition-all duration-300 p-3 sm:p-3.5 flex flex-col ${
                      isSelectMode
                        ? isSelected
                          ? 'border-brand-green shadow-md ring-2 ring-brand-green/30 cursor-pointer'
                          : 'border-gray-200/80 hover:border-gray-300 hover:shadow-md cursor-pointer'
                        : 'border-gray-200/80 hover:border-gray-300 hover:shadow-lg cursor-pointer'
                    }`}
                    onClick={() => {
                      if (isSelectMode) toggleSelect(template.id);
                      else onLoadTemplate(template);
                    }}
                  >
                    {/* Top Card Header */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      {/* Name / Tag Pill */}
                      <div className="bg-[#6F7682] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-2xs tracking-tight truncate max-w-[170px]">
                        {template.tag || metadata.name}
                      </div>

                      {/* Right Actions */}
                      {isSelectMode ? (
                        <div className="shrink-0">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-2xs transition-all ${
                              isSelected
                                ? 'bg-brand-green border-brand-green'
                                : 'bg-white/90 border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ) : (
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
                      )}
                    </div>

                    {/* Inner White Preview Canvas */}
                    <div className="relative w-full aspect-[4/3] bg-white rounded-xl border border-gray-200/70 overflow-hidden shadow-2xs flex items-center justify-center">
                      {/* Scaled Resume Preview */}
                      <div className="absolute inset-0 flex items-start justify-center pt-2 overflow-hidden pointer-events-none select-none">
                        <div className="w-[210mm] origin-top transform scale-[0.27] sm:scale-[0.29] pointer-events-none select-none shadow-xs rounded-xs bg-white">
                          <ResumePreview data={template.data} template={template.baseTemplate} />
                        </div>
                      </div>

                      {/* Hover Overlay (non-select mode) */}
                      {!isSelectMode && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/25 backdrop-blur-[2px] p-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); onLoadTemplate(template); }}
                            className="bg-brand-green hover:bg-brand-greenHover text-brand-dark px-4 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs"
                          >
                            <Edit size={13} /> Resume Editing
                          </button>
                        </div>
                      )}
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