import React, { useEffect, useState } from 'react';
import { 
  X, 
  FileText, 
  Building2, 
  Calendar, 
  ChevronRight, 
  Check, 
  Plus
} from 'lucide-react';
import { Job } from '../../types/job';
import { ResumeData, SavedTemplate, TemplateType, INITIAL_DATA } from '../../types';
import { getTemplateMetadata } from '../../utils/templateConfig';
import { loadFromStorage } from '../../utils/statePersistence';

interface SelectResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  savedTemplates?: SavedTemplate[];
  currentResumeData?: ResumeData | null;
  currentResumeId?: string | null;
  currentTemplate?: TemplateType;
  onSelectResume: (
    resume: {
      id: string | null;
      tag: string;
      baseTemplate: TemplateType;
      data: ResumeData;
    },
    job: Job
  ) => void;
}

export default function SelectResumeModal({
  isOpen,
  onClose,
  job,
  savedTemplates = [],
  currentResumeData,
  currentResumeId,
  currentTemplate = 'vanguard',
  onSelectResume,
}: SelectResumeModalProps) {
  const [selectedKey, setSelectedKey] = useState<string>('current_draft');

  // Build the list of selectable resume items
  const items: Array<{
    id: string | null;
    keyId: string;
    tag: string;
    baseTemplate: TemplateType;
    data: ResumeData;
    dateLabel?: string;
    isCurrentActive?: boolean;
  }> = [];

  // Add saved templates from database
  savedTemplates.forEach((template) => {
    const isCurrent = template.id === currentResumeId;
    items.push({
      id: template.id,
      keyId: template.id,
      tag: template.tag || 'Untitled Resume',
      baseTemplate: template.baseTemplate || 'vanguard',
      data: template.data,
      dateLabel: template.createdAt ? new Date(template.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
      isCurrentActive: isCurrent,
    });
  });

  // If current active resume is not in savedTemplates (e.g., initial draft or unsaved changes)
  const isCurrentInSaved = savedTemplates.some((t) => t.id === currentResumeId);
  const activeData = currentResumeData || loadFromStorage<ResumeData>('cv_app_data', INITIAL_DATA);

  if (!isCurrentInSaved || items.length === 0) {
    items.unshift({
      id: currentResumeId || null,
      keyId: 'current_draft',
      tag: activeData.fullName ? `${activeData.fullName}'s Resume (Active Draft)` : 'Current Active Draft',
      baseTemplate: currentTemplate,
      data: activeData,
      dateLabel: 'Active Editor Session',
      isCurrentActive: true,
    });
  }

  // Auto-select the first available resume or current resume on open
  useEffect(() => {
    if (isOpen && items.length > 0) {
      if (currentResumeId && items.some((t) => t.id === currentResumeId)) {
        setSelectedKey(currentResumeId);
      } else {
        setSelectedKey(items[0].keyId);
      }
    }
  }, [isOpen, currentResumeId, savedTemplates.length]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const handleConfirmSelection = (item: typeof items[0]) => {
    if (!item) return;
    onSelectResume(
      {
        id: item.id,
        tag: item.tag,
        baseTemplate: item.baseTemplate,
        data: item.data || activeData,
      },
      job
    );
  };

  const selectedItem = items.find((i) => i.keyId === selectedKey) || items[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-150" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl z-10 overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-neutral-100 flex items-start justify-between gap-4 bg-gradient-to-b from-neutral-50/70 to-white">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Choose a Resume to Tailor
            </h2>
            
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Target Role:</span>
              <strong className="text-neutral-800 font-semibold">{job.title}</strong>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-600 inline-flex items-center gap-1">
                <Building2 size={13} className="text-neutral-400" />
                {job.company}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Resume Selection List */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Select an existing resume to align with this job
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isSelected = item.keyId === selectedKey || (selectedItem && selectedItem.keyId === item.keyId);
              const metadata = getTemplateMetadata(item.baseTemplate);
              const candidateName = item.data?.fullName || item.data?.personal?.fullName;
              const targetTitle = item.data?.jobTitle || item.data?.personal?.jobTitle;

              return (
                <div
                  key={item.keyId}
                  onClick={() => setSelectedKey(item.keyId)}
                  onDoubleClick={() => handleConfirmSelection(item)}
                  className={`group relative p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-brand-dark bg-neutral-50/90 ring-2 ring-brand-dark/10 shadow-sm'
                      : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Left icon badge */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-brand-dark text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-600 group-hover:bg-white group-hover:border group-hover:border-neutral-200'
                      }`}
                    >
                      <FileText size={20} />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-neutral-900 truncate">
                          {item.tag}
                        </h3>
                        {item.isCurrentActive && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-200/70 text-neutral-700">
                            Active
                          </span>
                        )}
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                          {metadata?.name || item.baseTemplate}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 flex-wrap">
                        {candidateName && (
                          <span className="truncate font-medium text-neutral-700">
                            {candidateName}
                          </span>
                        )}
                        {targetTitle && (
                          <>
                            <span className="text-neutral-300">•</span>
                            <span className="truncate text-neutral-500">{targetTitle}</span>
                          </>
                        )}
                        {item.dateLabel && (
                          <>
                            <span className="text-neutral-300">•</span>
                            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                              <Calendar size={11} />
                              {item.dateLabel}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Radio / Selection Indicator */}
                  <div className="shrink-0 flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-brand-dark border-brand-dark text-white'
                          : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                      }`}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-neutral-150 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selectedItem}
            onClick={() => {
              if (selectedItem) {
                handleConfirmSelection(selectedItem);
              }
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              selectedItem
                ? 'bg-brand-dark hover:bg-brand-dark/90 text-white cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <span>Continue to Editor</span>
            <ChevronRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
