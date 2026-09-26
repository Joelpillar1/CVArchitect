import React from 'react';
import { X, Sliders, Grid, ArrowUpDown } from 'lucide-react';
import { ResumeData } from '../../types';

interface DesignCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onChangeData: (data: ResumeData) => void;
}

export default function DesignCustomizationModal({
  isOpen,
  onClose,
  data,
  onChangeData,
}: DesignCustomizationModalProps) {
  if (!isOpen) return null;

  const handleChange = (field: keyof ResumeData, value: any) => {
    onChangeData({ ...data, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fade-in select-none">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-brand-border">
        {/* Header */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-brand-dark">Design & Layout Customization</h3>
              <p className="text-[11px] text-gray-500">Fine-tune alignment, spacing, and styling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-dark hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">

          {/* Job Title Case */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark">Job Title Casing</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleChange('jobTitleCase', 'sentence')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  (!data.jobTitleCase || data.jobTitleCase === 'sentence')
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Sentence Case
              </button>
              <button
                onClick={() => handleChange('jobTitleCase', 'uppercase')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  data.jobTitleCase === 'uppercase'
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                UPPERCASE
              </button>
            </div>
          </div>

          {/* Header Casing */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark">Section Title Casing</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'uppercase', label: 'UPPERCASE' },
                { id: 'capitalize', label: 'Capitalize' },
                { id: 'titlecase', label: 'Title Case' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleChange('sectionHeaderCase', id)}
                  className={`py-2 px-2.5 rounded-lg border text-[11px] font-bold transition-all ${
                    (data.sectionHeaderCase || 'uppercase') === id
                      ? 'bg-brand-dark text-white border-brand-dark'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Header Order */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-green" />
              <span>Header Layout Order</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleChange('headerOrder', 'title-first')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  (!data.headerOrder || data.headerOrder === 'title-first')
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Title First
              </button>
              <button
                onClick={() => handleChange('headerOrder', 'contact-first')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  data.headerOrder === 'contact-first'
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Contact First
              </button>
            </div>
          </div>

          {/* Skills Column Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-brand-green" />
              <span>Skills Grid Columns</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleChange('skillsColumnCount', 2)}
                className={`py-2 px-2 rounded-lg border text-xs font-bold transition-all text-center ${
                  (data.skillsColumnCount || 3) === 2
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                2 Cols
              </button>
              <button
                onClick={() => handleChange('skillsColumnCount', 3)}
                className={`py-2 px-2 rounded-lg border text-xs font-bold transition-all text-center ${
                  (data.skillsColumnCount || 3) === 3
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                3 Cols
              </button>
              <button
                onClick={() => handleChange('skillsColumnCount', 4)}
                className={`py-2 px-2 rounded-lg border text-xs font-bold transition-all text-center ${
                  data.skillsColumnCount === 4
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                4 Cols
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-border bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 bg-brand-green hover:bg-brand-greenHover text-brand-dark font-extrabold text-xs rounded-xl transition-colors uppercase tracking-wider shadow-xs"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
}
