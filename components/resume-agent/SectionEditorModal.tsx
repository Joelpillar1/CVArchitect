import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, Save } from 'lucide-react';

interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionName: string;
  initialValue: string;
  onSaveValue: (newValue: string) => void;
}

export default function SectionEditorModal({
  isOpen,
  onClose,
  sectionName,
  initialValue,
  onSaveValue,
}: SectionEditorModalProps) {
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveValue(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-100 relative text-slate-800 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-brand-dark flex items-center justify-center font-bold border border-slate-200">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-brand-dark">Edit Resume Section</h3>
            <p className="text-xs text-slate-500">Updating: <span className="font-semibold text-brand-dark">{sectionName}</span></p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            autoFocus
            className="w-full p-3 bg-slate-50 border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 rounded-xl text-xs text-brand-dark font-medium focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-dark hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4 text-brand-green" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
