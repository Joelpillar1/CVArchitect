import React, { useEffect } from 'react';
import { AlertCircle, X, Loader2 } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndExit: () => void | Promise<void>;
  onDiscardAndExit: () => void;
  isSaving?: boolean;
  actionType?: 'back' | 'reload' | null;
  resumeTitle?: string;
}

export default function UnsavedChangesModal({
  isOpen,
  onClose,
  onSaveAndExit,
  onDiscardAndExit,
  isSaving = false,
  actionType = 'back',
  resumeTitle,
}: UnsavedChangesModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const isReload = actionType === 'reload';
  const displayTitle = resumeTitle?.trim() || 'your resume';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={isSaving ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-modal-title"
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm sm:max-w-md w-full shadow-xl space-y-5 animate-in zoom-in-95 duration-150 text-left relative"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          title="Close dialog"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header with Neutral Icon and Clean Text */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
            <AlertCircle className="w-5 h-5 text-gray-800" />
          </div>
          <div className="space-y-1">
            <h3 id="unsaved-modal-title" className="text-base font-bold text-gray-900 tracking-tight">
              Unsaved Changes
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              {isReload ? (
                <>
                  You have unsaved edits on <span className="font-semibold text-gray-900">"{displayTitle}"</span>. Would you like to save before reloading?
                </>
              ) : (
                <>
                  You have unsaved edits on <span className="font-semibold text-gray-900">"{displayTitle}"</span>. Would you like to save before leaving?
                </>
              )}
            </p>
          </div>
        </div>

        {/* 2 Buttons: Leave and Save/Exit */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onDiscardAndExit}
            disabled={isSaving}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all cursor-pointer text-center disabled:opacity-50"
          >
            Leave
          </button>

          <button
            type="button"
            onClick={onSaveAndExit}
            disabled={isSaving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-brand-green hover:bg-brand-greenHover text-brand-dark text-xs font-bold transition-all shadow-2xs cursor-pointer text-center disabled:opacity-60 active:scale-98"
          >
            {isSaving ? (
              <>
                <Loader2 size={13} className="animate-spin text-brand-dark shrink-0" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isReload ? 'Save/Reload' : 'Save/Exit'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
