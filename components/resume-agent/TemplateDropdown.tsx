import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Layout, Sparkles, Crown, Eye } from 'lucide-react';
import { TemplateType } from '../../types';

interface TemplateDropdownProps {
  currentTemplate: TemplateType;
  onChangeTemplate: (t: TemplateType) => void;
}

export interface TemplateOption {
  id: TemplateType;
  name: string;
  category: string;
  badge?: string;
  layoutType: 'clean' | 'two-column' | 'header-accent' | 'serif' | 'compact';
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: 'vanguard', name: 'Vanguard Minimal', category: 'ATS Standard', badge: 'Popular', layoutType: 'clean' },
  { id: 'rezi', name: 'Arch Template', category: 'ATS Optimized', badge: 'Top Match', layoutType: 'clean' },
  { id: 'modern', name: 'Modern Tech', category: 'Tech & Product', layoutType: 'two-column' },
  { id: 'prime', name: 'Prime Profile', category: 'Executive', layoutType: 'header-accent' },
  { id: 'impact', name: 'Impact Bold', category: 'Senior Roles', layoutType: 'compact' },
  { id: 'classic', name: 'Classic Serif', category: 'Academic & Law', layoutType: 'serif' },
  { id: 'times', name: 'Times Classic', category: 'ATS Serif', badge: 'New', layoutType: 'serif' },
  { id: 'simplepro', name: 'Simple Pro', category: 'Clean Professional', layoutType: 'clean' },
  { id: 'sage', name: 'Sage Professional', category: 'Management', layoutType: 'clean' },
  { id: 'wonsulting', name: 'Expert Template', category: 'Consulting', layoutType: 'clean' },
  { id: 'styled', name: 'Styled Professional', category: 'Creative Design', layoutType: 'header-accent' },
];

export default function TemplateDropdown({ currentTemplate, onChangeTemplate }: TemplateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = TEMPLATE_OPTIONS.find((t) => t.id === currentTemplate) || TEMPLATE_OPTIONS[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left select-none">
      {/* Main Header Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider bg-brand-bg text-brand-dark hover:bg-brand-secondary shadow-xs uppercase flex items-center gap-2 transition-all cursor-pointer border border-brand-border"
      >
        <Layout className="w-3.5 h-3.5 text-brand-green shrink-0" />
        <span className="truncate max-w-[130px]">Template: {selectedOption.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-brand-green transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom Dropdown Menu with Visual Mini Template Cards */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-brand-border z-50 p-2 space-y-1 animate-fade-in text-brand-dark">
          <div className="px-3 py-2 border-b border-brand-border flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-brand-dark/50 tracking-wider">
              Select Resume Template ({TEMPLATE_OPTIONS.length})
            </span>
            <span className="text-[10px] font-bold text-brand-dark bg-brand-green/20 px-2 py-0.5 rounded-md text-brand-dark">
              ATS Optimized
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 custom-scrollbar p-1">
            {TEMPLATE_OPTIONS.map((option) => {
              const isSelected = option.id === currentTemplate;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    onChangeTemplate(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'bg-brand-secondary border border-brand-green/50 shadow-2xs'
                      : 'hover:bg-brand-secondary/60 border border-transparent'
                  }`}
                >
                  {/* Miniature Visual Layout Schematic Card */}
                  <div className={`w-10 h-13 rounded-lg border bg-white p-1 flex flex-col justify-between shrink-0 shadow-2xs ${isSelected ? 'border-brand-green bg-brand-green/10' : 'border-gray-200'}`}>
                    <div className="w-full h-1 bg-brand-dark rounded-xs opacity-70" />
                    {option.layoutType === 'two-column' ? (
                      <div className="grid grid-cols-3 gap-0.5 flex-1 my-1">
                        <div className="col-span-1 bg-gray-200 rounded-xs" />
                        <div className="col-span-2 space-y-0.5">
                          <div className="w-full h-0.5 bg-gray-300 rounded-xs" />
                          <div className="w-full h-0.5 bg-gray-300 rounded-xs" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 flex-1 my-1">
                        <div className="w-full h-0.5 bg-gray-300 rounded-xs" />
                        <div className="w-3/4 h-0.5 bg-gray-300 rounded-xs" />
                        <div className="w-full h-0.5 bg-gray-300 rounded-xs" />
                      </div>
                    )}
                    <div className="w-1/2 h-0.5 bg-brand-dark rounded-xs opacity-50" />
                  </div>

                  {/* Template Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-brand-dark font-extrabold' : 'text-brand-dark/90'}`}>
                        {option.name}
                      </h4>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>

                    <p className="text-[10px] text-brand-dark/60 mt-0.5">{option.category}</p>

                    {option.badge && (
                      <span className="inline-block mt-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {option.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
