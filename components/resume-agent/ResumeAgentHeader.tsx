import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronDown, Layout, Check, Loader2, Save, ZoomIn, ZoomOut, Maximize2, Printer, FileText, Code } from 'lucide-react';
import { JobMatchAnalysis } from '../../types/resumeAgent';
import { TemplateType } from '../../types';
import TemplateDropdown from './TemplateDropdown';

interface ResumeAgentHeaderProps {
  resumeTitle: string;
  onUpdateTitle: (title: string) => void;
  jobMatch?: JobMatchAnalysis | null;
  hasJobDescription: boolean;
  onOpenJobContext: () => void;
  onOpenJobInput: () => void;
  onSave: () => void;
  onExportPDF: () => void;
  onPrintPDF?: () => void;
  onExportDocx?: () => void;
  onExportText?: (format: 'text' | 'markdown') => void;
  template: TemplateType;
  onChangeTemplate: (t: TemplateType) => void;
  onUndoLastAgentRun?: () => void;
  isSaving?: boolean;
  isExporting?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved';
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onOpenFullscreen?: () => void;
  onNavigateDashboard?: () => void;
}

export default function ResumeAgentHeader({
  resumeTitle,
  onUpdateTitle,
  jobMatch,
  hasJobDescription,
  onOpenJobContext,
  onOpenJobInput,
  onSave,
  onExportPDF,
  onPrintPDF,
  onExportDocx,
  onExportText,
  template,
  onChangeTemplate,
  onUndoLastAgentRun,
  isSaving = false,
  isExporting = false,
  saveStatus = 'idle',
  zoom = 1.2,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onOpenFullscreen,
  onNavigateDashboard,
}: ResumeAgentHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-brand-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-xs">
      {/* Left: Brand Logo & Title & Save Status Indicator */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          onClick={(e) => {
            if (onNavigateDashboard) {
              e.preventDefault();
              onNavigateDashboard();
            }
          }}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          title="Back to Dashboard"
        >
          <img src="/images/logo icon.png" alt="CV Architect Logo" className="w-8 h-8 object-contain" />
          <span className="text-base font-extrabold tracking-tight text-brand-dark hidden sm:inline-block">
            CV Architect
          </span>
        </Link>

        <div className="h-4 w-px bg-gray-200" />

        {isEditingTitle ? (
          <input
            type="text"
            value={resumeTitle}
            onChange={(e) => onUpdateTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            autoFocus
            className="px-2 py-0.5 text-xs font-bold text-brand-dark border border-brand-green rounded focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-xs font-extrabold text-brand-dark hover:bg-brand-secondary px-2 py-1 rounded transition-colors tracking-tight"
            title="Click to rename"
          >
            {resumeTitle || 'Untitled Resume'}
          </button>
        )}
      </div>

      {/* Center: Template Selector Dropdown Pill Only */}
      <div className="hidden md:flex items-center">
        <TemplateDropdown currentTemplate={template} onChangeTemplate={onChangeTemplate} />
      </div>

      {/* Right Actions: Save, Zoom, Fullscreen, and Download PDF */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving || saveStatus === 'saving'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border uppercase tracking-tight ${
            saveStatus === 'saved'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-brand-secondary hover:bg-gray-200 text-brand-dark border-brand-border'
          }`}
          title="Save resume changes"
        >
          {isSaving || saveStatus === 'saving' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-dark/70" />
              <span>Saving...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-brand-dark/70" />
              <span>Save</span>
            </>
          )}
        </button>

        {/* Zoom Controls */}
        {onZoomIn && onZoomOut && (
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-0.5 text-xs text-brand-dark border border-gray-200">
            <button
              onClick={onZoomOut}
              className="p-1 hover:bg-white rounded transition-colors text-gray-700 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetZoom}
              className="px-1.5 py-0.5 font-mono font-bold text-[11px] hover:bg-white rounded transition-colors text-gray-700 cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              className="p-1 hover:bg-white rounded transition-colors text-gray-700 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Fullscreen Button */}
        {onOpenFullscreen && (
          <button
            onClick={onOpenFullscreen}
            className="p-2 rounded-lg text-xs font-bold text-brand-dark bg-brand-secondary hover:bg-gray-200 border border-brand-border transition-colors uppercase tracking-tight cursor-pointer"
            title="Fullscreen Document Preview"
          >
            <Maximize2 className="w-3.5 h-3.5 text-brand-dark/70" />
          </button>
        )}

        {/* Download Button with Dropdown Options */}
        <div className="relative inline-flex rounded-lg shadow-xs" ref={menuRef}>
          <button
            onClick={() => {
              if (!isExporting) onExportPDF();
            }}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-l-lg text-xs font-extrabold text-brand-dark bg-brand-green hover:bg-brand-greenHover transition-colors uppercase tracking-wider disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            title="Direct PDF Download"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-brand-dark animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-brand-dark" />
                <span>Download</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
            disabled={isExporting}
            className="px-2 py-1.5 rounded-r-lg border-l border-brand-dark/15 text-brand-dark bg-brand-green hover:bg-brand-greenHover transition-colors cursor-pointer"
            title="Download Options"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDownloadMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-gray-200 p-1.5 z-50 animate-pop-in">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Export Options
              </div>

              {/* 1. Direct PDF Download */}
              <button
                onClick={() => {
                  setIsDownloadMenuOpen(false);
                  onExportPDF();
                }}
                className="w-full flex items-start gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <Download className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0 group-hover:scale-110 group-hover:text-gray-700 transition-all" />
                <div>
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    Download PDF
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">Fast</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-normal">Direct high-res client download</div>
                </div>
              </button>

              {/* 2. Native Vector Print / Save as PDF */}
              {onPrintPDF && (
                <button
                  onClick={() => {
                    setIsDownloadMenuOpen(false);
                    onPrintPDF();
                  }}
                  className="w-full flex items-start gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <Printer className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0 group-hover:scale-110 group-hover:text-gray-700 transition-all" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      Print / Vector PDF
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-1.5 py-0.2 rounded">Vector</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-normal">Selectable text & ATS optimized</div>
                  </div>
                </button>
              )}

              {/* 3. Export Word (.docx) */}
              {onExportDocx && (
                <button
                  onClick={() => {
                    setIsDownloadMenuOpen(false);
                    onExportDocx();
                  }}
                  className="w-full flex items-start gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0 group-hover:scale-110 group-hover:text-gray-700 transition-all" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      Download Word (.docx)
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded">Word</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-normal">Editable ATS Word document</div>
                  </div>
                </button>
              )}

              {/* 3. Export as Plain Text */}
              {onExportText && (
                <>
                  <div className="h-px bg-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      onExportText('text');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer group"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    <span className="text-xs font-medium">Export Plain Text (.txt)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      onExportText('markdown');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer group"
                  >
                    <Code className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    <span className="text-xs font-medium">Export Markdown (.md)</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
