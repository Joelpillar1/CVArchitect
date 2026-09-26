import React, { useState, useEffect } from 'react';
import {
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  ArrowUpDown,
} from 'lucide-react';
import { ResumeData } from '../../types';
import {
  getResolvedSectionOrder,
  getSectionTitle,
  createDefaultSectionOrder,
  isSectionVisible,
  normalizeSectionType,
  SECTION_REGISTRY,
} from '../../utils/sectionRegistry';

interface ReorderSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onReorder: (newOrder: string[]) => void;
  onToggleVisibility?: (sectionId: string, visible: boolean) => void;
}

export default function ReorderSectionsModal({
  isOpen,
  onClose,
  data,
  onReorder,
  onToggleVisibility,
}: ReorderSectionsModalProps) {
  const [sections, setSections] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sync sections when modal opens or data changes
  useEffect(() => {
    if (isOpen && data) {
      const resolved = getResolvedSectionOrder(data).filter(
        (id) => id !== 'contact' && normalizeSectionType(id) !== 'contact'
      );
      setSections(resolved);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    setSections(newSections);
    onReorder(newSections);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Immediately swap elements in real time during drag
    const newSections = [...sections];
    const [moved] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, moved);

    setDraggedIndex(index);
    setSections(newSections);
    onReorder(newSections);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleResetToDefault = () => {
    const defaultOrder = createDefaultSectionOrder().filter((id) => id !== 'contact');
    setSections(defaultOrder);
    onReorder(defaultOrder);
  };

  const handleToggle = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentVis = isSectionVisible(data, sectionId);
    if (onToggleVisibility) {
      onToggleVisibility(sectionId, !currentVis);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-brand-border/60 max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border bg-brand-secondary/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-brand-dark flex items-center justify-center font-bold">
              <ArrowUpDown className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark tracking-tight">Reorder Sections</h2>
              <p className="text-xs text-brand-dark/60">
                Drag or use arrows to change the order of sections on your resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-dark/40 hover:text-brand-dark hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 custom-scrollbar">
          {sections.map((sectionId, index) => {
            const title = getSectionTitle(data, sectionId);
            const visible = isSectionVisible(data, sectionId);
            const isDragging = draggedIndex === index;
            const canMoveUp = index > 0;
            const canMoveDown = index < sections.length - 1;

            return (
              <div
                key={sectionId}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-150 select-none ${
                  isDragging
                    ? 'opacity-80 scale-[1.02] border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-400'
                    : 'bg-white border-brand-border hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5 touch-none">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Position Badge */}
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Section Title */}
                  <span
                    className={`text-xs font-bold truncate ${
                      visible ? 'text-brand-dark' : 'text-slate-400 line-through'
                    }`}
                  >
                    {title}
                  </span>
                </div>

                {/* Actions: Move Up, Move Down, Toggle Visibility */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={!canMoveUp}
                    title="Move up"
                    className="p-1 rounded-lg text-slate-400 hover:text-brand-dark hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={!canMoveDown}
                    title="Move down"
                    className="p-1 rounded-lg text-slate-400 hover:text-brand-dark hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {onToggleVisibility && (
                    <button
                      type="button"
                      onClick={(e) => handleToggle(sectionId, e)}
                      title={visible ? 'Hide section' : 'Show section'}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ml-1 ${
                        visible
                          ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {sections.length === 0 && (
            <div className="text-center py-8 text-xs text-brand-dark/50">
              No active sections to reorder.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-brand-border bg-brand-secondary/30 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-xs font-semibold text-brand-dark/70 hover:text-brand-dark transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-dark hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
