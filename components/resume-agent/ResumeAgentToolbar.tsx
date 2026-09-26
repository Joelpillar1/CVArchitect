import React, { useState, useRef, useEffect } from 'react';
import {
  Undo,
  Redo,
  Type,
  Minus,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUpDown,
  MoveVertical,
  List,
  ListChecks,
  Indent,
  Outdent,
  FileText,
  Maximize,
  CaseSensitive,
  Heading,
  Layers,
  LayoutGrid,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Pipette,
} from 'lucide-react';
import { ResumeData } from '../../types';
import { PAGE_SIZE_OPTIONS } from '@/utils/pageSizeConfig';

interface ResumeAgentToolbarProps {
  data: ResumeData;
  onChangeData: (newData: ResumeData) => void;
  onOpenDesignModal?: () => void;
  onOpenAddSection?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  /** Backwards compatibility */
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onOpenFullscreen?: () => void;
  onSave?: () => void;
  pendingChangesCount?: number;
  reviewMode?: boolean;
  onSetReviewMode?: (mode: boolean) => void;
  saveStatus?: 'idle' | 'saving' | 'saved';
  embedded?: boolean;
  className?: string;
}

const FONT_OPTIONS = [
  { id: 'Merriweather, serif', label: 'Merriweather' },
  { id: 'Inter, sans-serif', label: 'Inter' },
  { id: 'Roboto, sans-serif', label: 'Roboto' },
  { id: 'Arial, sans-serif', label: 'Arial' },
  { id: 'Georgia, serif', label: 'Georgia' },
  { id: 'Times New Roman, serif', label: 'Times New Roman' },
  { id: 'Calibri, sans-serif', label: 'Calibri' },
  { id: 'Montserrat, sans-serif', label: 'Montserrat' },
  { id: 'Open Sans, sans-serif', label: 'Open Sans' },
  { id: 'Lato, sans-serif', label: 'Lato' },
  { id: 'Playfair Display, serif', label: 'Playfair Display' },
  { id: 'Garamond, serif', label: 'Garamond' },
];

const ACCENT_COLORS = [
  '#000000', // Black
  '#333C4D', // Slate / Brand Dark
  '#2563EB', // Blue
  '#059669', // Emerald
  '#DC2626', // Red
  '#7C3AED', // Purple
  '#D97706', // Amber
  '#0D9488', // Teal
  '#E11D48', // Rose
  '#4B5563', // Gray
];

/** Custom Figma-style Tooltip Component with downward arrow pointer */
function Tooltip({
  text,
  children,
  className = '',
  disabled = false,
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`relative group/tooltip flex items-center justify-center ${className}`}>
      {children}
      {!disabled && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-150 ease-out transform scale-95 group-hover/tooltip:scale-100 flex flex-col items-center">
          <div className="bg-[#18181b] text-white text-[11px] font-medium px-2.5 py-1 rounded-xl shadow-xl border border-white/10 whitespace-nowrap leading-tight">
            {text}
          </div>
          <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-[#18181b] -mt-[0.5px]" />
        </div>
      )}
    </div>
  );
}

export default function ResumeAgentToolbar({
  data,
  onChangeData,
  onOpenAddSection,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  embedded = false,
  className,
}: ResumeAgentToolbarProps) {
  // Toolset page state: 0 = Typography & Color, 1 = Alignment & Spacing, 2 = Layout & Design Options
  const [toolPage, setToolPage] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const TOTAL_PAGES = 3;

  // Popover state management
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  // Values
  const currentFontSize = data.fontSizes?.body ?? 9;
  const currentFontObj = FONT_OPTIONS.find(f => f.id === data.font) || FONT_OPTIONS[0];
  const currentLineHeight = data.lineHeight ?? 1.5;
  const currentSectionGap = data.sectionGap ?? 0.1;
  const currentBulletStyle: ResumeData['bulletStyle'] = data.bulletStyle ?? 'disc';
  const currentAccentColor = data.accentColor || '#000000';
  const currentBulletIndent = data.bulletIndent ?? 0;
  const currentHeaderAlign = data.contactAlignment || data.headerAlignment || 'center';
  const currentSectionHeaderAlign = data.bodyHeaderAlignment || data.sectionHeaderAlignment || 'left';
  const currentPageSize = (data.pageSize || 'letter').toLowerCase();
  const currentSectionHeaderCase = data.sectionHeaderCase || 'uppercase';
  const currentJobTitleCase = data.jobTitleCase || 'sentence';
  const currentHeaderOrder = data.headerOrder || 'title-first';
  const currentSkillsColumnCount = data.skillsColumnCount || 3;
  const showContactIcons = data.showContactIcons ?? true;

  const rawHor = data.margins?.horizontal;
  const currentMargin = rawHor !== undefined ? (rawHor > 2 ? rawHor / 96 : rawHor) : 25 / 96;
  const currentMarginPx = Math.round(currentMargin * 96);

  // Handlers
  const handleFontSizeChange = (delta: number) => {
    const newBodySize = Math.max(7, Math.min(14, Math.round((currentFontSize + delta) * 2) / 2));
    const ratio = newBodySize / (data.fontSizes?.body || 9);

    onChangeData({
      ...data,
      fontSizes: {
        header: Math.round((data.fontSizes?.header || 20) * ratio),
        jobTitle: Math.round((data.fontSizes?.jobTitle || 12) * ratio),
        sectionTitle: Math.round((data.fontSizes?.sectionTitle || 11) * ratio),
        body: newBodySize,
      },
    });
  };

  const handleLineHeightChange = (delta: number) => {
    const next = Math.max(1.0, Math.min(2.5, Math.round((currentLineHeight + delta) * 20) / 20));
    onChangeData({ ...data, lineHeight: next });
  };

  const handleSectionGapChange = (delta: number) => {
    const next = Math.max(0, Math.min(0.25, Math.round((currentSectionGap + delta) * 100) / 100));
    onChangeData({ ...data, sectionGap: next });
  };

  const handleMarginChange = (deltaPx: number) => {
    const nextPx = Math.max(8, Math.min(60, currentMarginPx + deltaPx));
    onChangeData({
      ...data,
      margins: {
        horizontal: nextPx / 96,
        vertical: nextPx / 96,
      },
    });
  };

  const cycleSectionCase = () => {
    const nextCase = currentSectionHeaderCase === 'uppercase' ? 'titlecase' : 'uppercase';
    onChangeData({ ...data, sectionHeaderCase: nextCase });
  };

  const cycleJobTitleCase = () => {
    const nextCase = currentJobTitleCase === 'uppercase' ? 'sentence' : 'uppercase';
    onChangeData({ ...data, jobTitleCase: nextCase });
  };

  const toggleHeaderOrder = () => {
    const nextOrder = currentHeaderOrder === 'title-first' ? 'contact-first' : 'title-first';
    onChangeData({ ...data, headerOrder: nextOrder });
  };

  const cycleSkillsColumns = () => {
    const nextCols = currentSkillsColumnCount === 2 ? 3 : currentSkillsColumnCount === 3 ? 4 : 2;
    onChangeData({ ...data, skillsColumnCount: nextCols });
  };

  const nextToolPage = () => {
    setOpenDropdown(null);
    setSlideDirection('forward');
    setToolPage(prev => (prev + 1) % TOTAL_PAGES);
  };

  const prevToolPage = () => {
    setOpenDropdown(null);
    setSlideDirection('backward');
    setToolPage(prev => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const slideAnimClass = slideDirection === 'forward' ? 'animate-toolbar-slide-right' : 'animate-toolbar-slide-left';

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 select-none z-30 flex items-center bg-brand-dark/95 backdrop-blur-xl px-2.5 py-1.5 rounded-full shadow-[0_16px_40px_rgba(51,60,77,0.35)] border border-white/15 text-xs font-semibold text-white transition-all duration-300 max-w-[calc(100vw-2rem)] ${className || ''}`}
    >
      {/* Persistent Add Section Button */}
      {onOpenAddSection && (
        <>
          <Tooltip text="Add section">
            <button
              type="button"
              onClick={onOpenAddSection}
              className="p-1.5 rounded-full bg-brand-green hover:bg-brand-greenHover text-brand-dark transition-all cursor-pointer shadow-xs active:scale-95 group font-bold flex items-center justify-center shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </Tooltip>

          {/* Vertical Line Divider */}
          <div className="h-4 w-px bg-white/20 mx-1 shrink-0" />
        </>
      )}

      {/* Dynamic Paginated Tool Area */}
      <div className="flex items-center gap-1.5 transition-all duration-200">
        
        {/* ================= PAGE 0: Typography & Color ================= */}
        {toolPage === 0 && (
          <div key={`tool-page-0-${slideDirection}`} className={`flex items-center gap-1.5 ${slideAnimClass}`}>
            {/* Undo & Redo */}
            <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-0.5 border border-white/10">
              <Tooltip text="Undo (Ctrl+Z)">
                <button
                  type="button"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className={`p-1.5 rounded-full transition-colors ${
                    canUndo
                      ? 'hover:bg-white/20 text-white cursor-pointer'
                      : 'text-white/30 cursor-not-allowed opacity-40'
                  }`}
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
              </Tooltip>

              <Tooltip text="Redo (Ctrl+Y)">
                <button
                  type="button"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className={`p-1.5 rounded-full transition-colors ${
                    canRedo
                      ? 'hover:bg-white/20 text-white cursor-pointer'
                      : 'text-white/30 cursor-not-allowed opacity-40'
                  }`}
                >
                  <Redo className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>

            {/* Paper Size Selector */}
            <div className="relative">
              <Tooltip text="Paper size" disabled={openDropdown === 'paper'}>
                <button
                  type="button"
                  onClick={() => toggleDropdown('paper')}
                  className={`px-2 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    openDropdown === 'paper'
                      ? 'bg-brand-green text-brand-dark border-brand-green'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="uppercase text-[10px]">{currentPageSize === 'a4' ? 'A4' : 'LTR'}</span>
                </button>
              </Tooltip>

              {openDropdown === 'paper' && (
                <div className="absolute bottom-full mb-3 left-0 w-36 bg-brand-dark rounded-2xl shadow-2xl border border-white/15 z-[100] p-1.5 space-y-0.5 animate-fadeIn text-white">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-white/50 border-b border-white/10 mb-1">
                    Paper Size
                  </div>
                  {PAGE_SIZE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onChangeData({ ...data, pageSize: opt.id as any });
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-2.5 py-1.5 text-left rounded-lg text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        currentPageSize === opt.id ? 'bg-brand-green text-brand-dark font-extrabold' : 'hover:bg-white/10 text-white/90'
                      }`}
                    >
                      <span>{opt.name}</span>
                      {currentPageSize === opt.id && <Check className="w-3 h-3 text-brand-dark stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Family Dropdown */}
            <div className="relative">
              <Tooltip text="Font family" disabled={openDropdown === 'font'}>
                <button
                  type="button"
                  onClick={() => toggleDropdown('font')}
                  className={`px-2.5 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    openDropdown === 'font'
                      ? 'bg-brand-green text-brand-dark border-brand-green'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[75px]">{currentFontObj.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'font' ? 'rotate-180' : 'text-white/60'}`} />
                </button>
              </Tooltip>

              {openDropdown === 'font' && (
                <div className="absolute bottom-full mb-3 left-0 w-52 bg-brand-dark rounded-2xl shadow-2xl border border-white/15 z-[100] p-1.5 space-y-0.5 animate-fadeIn max-h-64 overflow-y-auto custom-scrollbar text-white">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-white/50 border-b border-white/10 mb-1">
                    Font Family
                  </div>
                  {FONT_OPTIONS.map(font => (
                    <button
                      key={font.id}
                      onClick={() => {
                        onChangeData({ ...data, font: font.id });
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-2.5 py-1.5 text-left rounded-lg text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        data.font === font.id ? 'bg-brand-green text-brand-dark font-extrabold' : 'hover:bg-white/10 text-white/90'
                      }`}
                      style={{ fontFamily: font.id }}
                    >
                      <span>{font.label}</span>
                      {data.font === font.id && <Check className="w-3 h-3 text-brand-dark stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Size Stepper */}
            <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-0.5 border border-white/10">
              <Tooltip text="Decrease size">
                <button
                  type="button"
                  onClick={() => handleFontSizeChange(-0.5)}
                  className="p-1 hover:bg-white/20 rounded-full text-white/90 transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </Tooltip>

              <Tooltip text="Font size">
                <span className="px-1.5 font-bold text-xs min-w-[22px] text-center font-mono text-white">
                  {currentFontSize}
                </span>
              </Tooltip>

              <Tooltip text="Increase size">
                <button
                  type="button"
                  onClick={() => handleFontSizeChange(0.5)}
                  className="p-1 hover:bg-white/20 rounded-full text-white/90 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </Tooltip>
            </div>

            {/* Accent Color Picker (A_) */}
            <div className="relative">
              <Tooltip text="Pick a color" disabled={openDropdown === 'color'}>
                <button
                  type="button"
                  onClick={() => toggleDropdown('color')}
                  className={`p-1.5 rounded-full border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    openDropdown === 'color'
                      ? 'bg-brand-green text-brand-dark border-brand-green'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  <span className="font-extrabold text-xs leading-none">A</span>
                  <div className="w-3 h-1 rounded-full" style={{ backgroundColor: currentAccentColor }} />
                </button>
              </Tooltip>

              {openDropdown === 'color' && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[216px] bg-brand-dark rounded-2xl shadow-2xl border border-white/15 z-[100] p-3 space-y-2.5 animate-fadeIn text-white">
                  <div className="text-[10px] font-extrabold uppercase text-white/50 tracking-wider pb-1.5 border-b border-white/10">
                    Accent Color
                  </div>
                  <div className="grid grid-cols-5 gap-2 justify-items-center py-0.5">
                    {ACCENT_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          onChangeData({ ...data, accentColor: color });
                          setOpenDropdown(null);
                        }}
                        className="size-7 rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer shadow-xs relative shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {currentAccentColor.toLowerCase() === color.toLowerCase() && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow-md stroke-[2.5]" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <label
                      className="relative flex size-7 items-center justify-center rounded-lg border border-white/25 overflow-hidden cursor-pointer shrink-0 shadow-inner hover:border-white/50 transition-colors"
                      style={{ backgroundColor: currentAccentColor }}
                      title="Choose custom color"
                    >
                      <input
                        type="color"
                        value={currentAccentColor}
                        onChange={e => onChangeData({ ...data, accentColor: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Pipette className="w-3.5 h-3.5 text-white mix-blend-difference opacity-80 pointer-events-none" />
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={currentAccentColor}
                        onChange={e => onChangeData({ ...data, accentColor: e.target.value })}
                        placeholder="#000000"
                        className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-black/40 border border-white/20 rounded-lg focus:outline-none focus:border-brand-green uppercase text-white tracking-wider"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shift Arrow to Page 1 */}
            <Tooltip text="More tools">
              <button
                type="button"
                onClick={nextToolPage}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer shadow-xs ml-0.5 group"
              >
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Tooltip>
          </div>
        )}

        {/* ================= PAGE 1: Spacing, Alignment & Bullets ================= */}
        {toolPage === 1 && (
          <div key={`tool-page-1-${slideDirection}`} className={`flex items-center gap-1.5 ${slideAnimClass}`}>
            {/* Back Arrow to Page 0 */}
            <Tooltip text="Previous tools">
              <button
                type="button"
                onClick={prevToolPage}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer shadow-xs mr-0.5 group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </Tooltip>

            {/* Alignment Controls Popover */}
            <div className="relative">
              <Tooltip text="Alignment options" disabled={openDropdown === 'align'}>
                <button
                  type="button"
                  onClick={() => toggleDropdown('align')}
                  className={`px-2.5 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    openDropdown === 'align'
                      ? 'bg-brand-green text-brand-dark border-brand-green'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Align</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'align' ? 'rotate-180' : 'text-white/60'}`} />
                </button>
              </Tooltip>

              {openDropdown === 'align' && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-brand-dark rounded-2xl shadow-2xl border border-white/15 z-[100] p-3 space-y-2.5 animate-fadeIn text-white">
                  <div className="text-[10px] font-extrabold uppercase text-white/50 tracking-wider pb-1 border-b border-white/10">
                    Alignment Options
                  </div>

                  {/* 1. Contact Info (Works for Name, Contacts, and Professional Title together) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white/90">
                      <span>Contact Info</span>
                      <span className="text-[9px] font-mono font-bold text-brand-green uppercase">{currentHeaderAlign}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                      {(['left', 'center', 'right'] as const).map(align => (
                        <button
                          key={`contact-info-${align}`}
                          type="button"
                          onClick={() => onChangeData({ ...data, headerAlignment: align, contactAlignment: align, jobTitleAlignment: align })}
                          className={`py-1 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                            currentHeaderAlign === align
                              ? 'bg-brand-green text-brand-dark shadow-xs'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                          {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                          {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Section Headers */}
                  <div className="space-y-1 pt-1.5 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white/90">
                      <span>Section Headers</span>
                      <span className="text-[9px] font-mono font-bold text-brand-green uppercase">{currentSectionHeaderAlign}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                      {(['left', 'center', 'right'] as const).map(align => (
                        <button
                          key={`section-${align}`}
                          type="button"
                          onClick={() => onChangeData({ ...data, bodyHeaderAlignment: align, sectionHeaderAlignment: align })}
                          className={`py-1 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                            currentSectionHeaderAlign === align
                              ? 'bg-brand-green text-brand-dark shadow-xs'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                          {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                          {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Line Height Control */}
            <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-0.5 border border-white/10">
              <Tooltip text="Line spacing">
                <div className="pl-1.5 pr-0.5 text-white/60">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </Tooltip>

              <Tooltip text="Decrease line spacing">
                <button
                  type="button"
                  onClick={() => handleLineHeightChange(-0.05)}
                  className="p-1 hover:bg-white/20 rounded-full text-white/90 transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </Tooltip>

              <Tooltip text="Line spacing">
                <span className="px-1 font-bold text-xs min-w-[26px] text-center font-mono text-white">
                  {currentLineHeight.toFixed(2)}
                </span>
              </Tooltip>

              <Tooltip text="Increase line spacing">
                <button
                  type="button"
                  onClick={() => handleLineHeightChange(0.05)}
                  className="p-1 hover:bg-white/20 rounded-full text-white/90 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </Tooltip>
            </div>

            {/* Section Gap Control */}
            <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-0.5 border border-white/10">
              <Tooltip text="Section gap">
                <div className="pl-1.5 pr-0.5 text-white/60">
                  <MoveVertical className="w-3.5 h-3.5" />
                </div>
              </Tooltip>

              <Tooltip text="Decrease section gap">
                <button
                  type="button"
                  onClick={() => handleSectionGapChange(-0.02)}
                  className="p-1 hover:bg-white/20 rounded-full text-white/90 transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </Tooltip>

              <Tooltip text="Section gap">
                <span className="px-1 font-bold text-xs min-w-[26px] text-center font-mono text-white">
                  {currentSectionGap.toFixed(2)}
                </span>
              </Tooltip>

              <Tooltip text="Increase section gap">
                <button
                  type="button"
                  onClick={() => handleSectionGapChange(0.02)}
                  className="p-1 hover:bg-white/20 rounded-full text-white/90 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </Tooltip>
            </div>

            {/* List Bullet Style */}
            <div className="relative">
              <Tooltip text="Bullet style" disabled={openDropdown === 'bullet'}>
                <button
                  type="button"
                  onClick={() => toggleDropdown('bullet')}
                  className={`p-1.5 rounded-full border flex items-center gap-0.5 transition-all cursor-pointer ${
                    openDropdown === 'bullet'
                      ? 'bg-brand-green text-brand-dark border-brand-green'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  {currentBulletStyle === 'check' ? (
                    <ListChecks className="w-3.5 h-3.5" />
                  ) : (
                    <List className="w-3.5 h-3.5" />
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'bullet' ? 'rotate-180' : 'text-white/60'}`} />
                </button>
              </Tooltip>

              {openDropdown === 'bullet' && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-44 bg-brand-dark rounded-2xl shadow-2xl border border-white/15 z-[100] p-1.5 space-y-0.5 animate-fadeIn text-white">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-white/50 border-b border-white/10 mb-1">
                    Bullet Style
                  </div>
                  {[
                    { value: 'disc', label: '• Standard Bullet' },
                    { value: 'check', label: '✓ Checklist' },
                    { value: 'dash', label: '– Dash Marker' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChangeData({ ...data, bulletStyle: opt.value as ResumeData['bulletStyle'] });
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-2.5 py-1.5 text-left rounded-lg text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        currentBulletStyle === opt.value
                          ? 'bg-brand-green text-brand-dark font-extrabold'
                          : 'hover:bg-white/10 text-white/90'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {currentBulletStyle === opt.value && <Check className="w-3 h-3 text-brand-dark stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bullets Indent & Outdent */}
            <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-0.5 border border-white/10">
              <Tooltip text="Outdent bullets">
                <button
                  type="button"
                  onClick={() => onChangeData({ ...data, bulletIndent: Math.max(0, currentBulletIndent - 8) })}
                  disabled={currentBulletIndent <= 0}
                  className={`p-1.5 rounded-full transition-colors ${
                    currentBulletIndent > 0 ? 'hover:bg-white/20 text-white cursor-pointer' : 'text-white/30 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <Outdent className="w-3.5 h-3.5" />
                </button>
              </Tooltip>

              <Tooltip text="Indent bullets">
                <button
                  type="button"
                  onClick={() => onChangeData({ ...data, bulletIndent: Math.min(48, currentBulletIndent + 8) })}
                  className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition-colors"
                >
                  <Indent className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>

            {/* Shift Arrow to Page 2 */}
            <Tooltip text="More tools">
              <button
                type="button"
                onClick={nextToolPage}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer shadow-xs ml-0.5 group"
              >
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Tooltip>
          </div>
        )}

        {/* ================= PAGE 2: Layout & Design Features ================= */}
        {toolPage === 2 && (
          <div key={`tool-page-2-${slideDirection}`} className={`flex items-center gap-1.5 ${slideAnimClass}`}>
            {/* Back Arrow to Page 1 */}
            <Tooltip text="Previous tools">
              <button
                type="button"
                onClick={prevToolPage}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer shadow-xs mr-0.5 group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </Tooltip>

            {/* Section Casing Toggle (Pure Icon - 2 Options: UPPERCASE vs Title Case) */}
            <Tooltip text={`Section case: ${currentSectionHeaderCase === 'uppercase' ? 'UPPERCASE' : 'Title Case'}`}>
              <button
                type="button"
                onClick={cycleSectionCase}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  currentSectionHeaderCase === 'uppercase'
                    ? 'bg-brand-green text-brand-dark border-brand-green'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                <CaseSensitive className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {/* Job Title Casing Toggle (Pure Icon) */}
            <Tooltip text={`Job title case: ${currentJobTitleCase === 'uppercase' ? 'UPPERCASE' : 'Title Case'}`}>
              <button
                type="button"
                onClick={cycleJobTitleCase}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  currentJobTitleCase === 'uppercase'
                    ? 'bg-brand-green text-brand-dark border-brand-green'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                <Heading className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {/* Header Layout Order (Title First vs Contact First) */}
            <Tooltip text={`Header order: ${currentHeaderOrder === 'title-first' ? 'Title first' : 'Contact first'}`}>
              <button
                type="button"
                onClick={toggleHeaderOrder}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  currentHeaderOrder === 'title-first'
                    ? 'bg-brand-green text-brand-dark border-brand-green'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {/* Skills Grid Columns Toggle (2, 3, 4 Cols) */}
            <Tooltip text={`Skills columns: ${currentSkillsColumnCount} cols`}>
              <button
                type="button"
                onClick={cycleSkillsColumns}
                className="p-1.5 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-0.5"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold text-white/75">{currentSkillsColumnCount}</span>
              </button>
            </Tooltip>

            {/* Page Margins Stepper */}
            <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-0.5 border border-white/10">
              <Tooltip text="Page margins">
                <div className="pl-1.5 pr-0.5 text-white/60">
                  <Maximize className="w-3.5 h-3.5" />
                </div>
              </Tooltip>

              <Tooltip text="Decrease margins">
                <button
                  type="button"
                  onClick={() => handleMarginChange(-2)}
                  className="p-1 hover:bg-white/20 rounded-full text-white/90 transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </Tooltip>

              <Tooltip text="Margins">
                <span className="px-1 font-bold text-xs min-w-[26px] text-center font-mono text-white">
                  {currentMarginPx}px
                </span>
              </Tooltip>

              <Tooltip text="Increase margins">
                <button
                  type="button"
                  onClick={() => handleMarginChange(2)}
                  className="p-1 hover:bg-white/20 rounded-full text-white/90 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </Tooltip>
            </div>

            {/* Contact Icons Toggle (Pure Icon) */}
            <Tooltip text={showContactIcons ? 'Hide contact icons' : 'Show contact icons'}>
              <button
                type="button"
                onClick={() => onChangeData({ ...data, showContactIcons: !showContactIcons })}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  showContactIcons
                    ? 'bg-brand-green text-brand-dark border-brand-green'
                    : 'bg-white/10 hover:bg-white/20 text-white/60 border-white/10'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {/* Shift Arrow loop back to Page 0 */}
            <Tooltip text="More tools">
              <button
                type="button"
                onClick={nextToolPage}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer shadow-xs ml-0.5 group"
              >
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
