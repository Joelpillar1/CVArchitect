import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { canAccessTemplate } from '../utils/pricingConfig';
import { ChevronLeft, ChevronDown, Maximize2, Minimize2, Download, User, Briefcase, GraduationCap, Award, Layout as LayoutIcon, Target, CheckCircle, Monitor, Edit3, Palette, ShoppingCart, Save, Check, Loader2, PanelLeftOpen, ZoomIn, ZoomOut, Pencil, Printer, FileText, Code } from 'lucide-react';
import ResumePreview from './ResumePreview';
import ResumeWorkspace from './resume-agent/ResumeWorkspace';
import EditorSidebarRight from './EditorSidebarRight';
import EditorSidebarLeft from './EditorSidebarLeft';
import DesignCustomizationModal from './resume-agent/DesignCustomizationModal';
import VanguardTemplate from './templates/VanguardTemplate';
import ElevateResume from './templates/ElevateResume';
import PrimeProfile from './templates/PrimeProfile';
import ImpactTemplate from './templates/ImpactTemplate';
import FreeTemplate from './templates/FreeTemplate';
import SimpleProTemplate from './templates/SimpleProTemplate';
import DevTemplate from './templates/DevTemplate';
import ApexTemplate from './templates/ApexTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import WonsultingTemplate from './templates/WonsultingTemplate';
import StyledTemplate from './templates/StyledTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import TimesTemplate from './templates/TimesTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import SageTemplate from './templates/SageTemplate';
import ReziTemplate from './templates/ReziTemplate';
import FreshGradTemplate from './templates/FreshGradTemplate';
import FreshGrad8Template from './templates/FreshGrad8Template';
import StudentTemplate from './templates/StudentTemplate';
import PrintPortal from './PrintPortal';


interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  template: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  onBack: () => void;
  onSave?: (data?: ResumeData) => void;
  onSaveAsTemplate: (data?: ResumeData) => void;
  currentResumeId?: string | null;
  showWelcomeModal?: boolean;
  onCloseWelcomeModal?: () => void;
  auditResult?: { score: number; keywords: string[]; issues: string[] } | null;
  userSubscription: UserSubscription;
  onAIAction: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
  onShowPaywall?: (feature: 'templates' | 'job-match' | 'general' | 'credits' | 'export') => void;
}

export type EditorTab = 'personal' | 'summary' | 'education' | 'experience' | 'achievements' | 'skills' | 'certifications' | 'additionalInfo' | 'references' | 'projects' | 'leadership' | 'design' | 'job-match' | (string & {}) | '' | null;

import { analyzeResume } from './utils/resumeAnalytics';

import { useNavigate, useLocation } from 'react-router-dom';
import { FileText as FileTextIcon } from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../utils/statePersistence';
import { exportResumeToPdf, exportCoverLetterToPdf, printResumeToPdf, exportResumeToPlainText } from '../utils/pdfExport';
import { exportResumeToDocx } from '../utils/docxExport';

export default function Editor({ data, onChange, template, onTemplateChange, onBack, onSave, onSaveAsTemplate, currentResumeId, showWelcomeModal, onCloseWelcomeModal, auditResult, userSubscription, onAIAction, onShowPaywall }: EditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const location = useLocation();
  const [activeMobileTabState, setActiveMobileTabState] = useState<'editor' | 'preview' | 'job-match'>(() => {
    return loadFromStorage<'editor' | 'preview' | 'job-match'>('editor_activeMobileTab', 'editor');
  });
  const [activeTabState, setActiveTabState] = useState<EditorTab>(() => {
    return loadFromStorage<EditorTab>('editor_activeTab', 'personal');
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [coverLetterContent, setCoverLetterContent] = useState<string>('');
  const [isPrintingCoverLetter, setIsPrintingCoverLetter] = useState(false);
  const [zoomState, setZoomStateInternal] = useState(() => {
    return loadFromStorage<number>('editor_zoom', 1);
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState(
    data.resumeTitle || data.currentTag || (data.fullName ? `${data.fullName}'s Resume` : 'Untitled Resume')
  );

  // Close download menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    }
    if (isDownloadMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDownloadMenuOpen]);

  // Auto-switch to job-match mobile tab if navigated with chat intent
  React.useEffect(() => {
    const locState = location.state as any;
    const shouldOpenJobMatch = locState?.openChat || locState?.pendingChatPrompt || loadFromStorage<boolean>('editor_openJobMatchTab', false);
    if (shouldOpenJobMatch) {
      setActiveMobileTabState('job-match');
      saveToStorage('editor_activeMobileTab', 'job-match');
      try {
        localStorage.removeItem('editor_openJobMatchTab');
      } catch (_) {}
    }
  }, [location.state]);

  React.useEffect(() => {
    if (!isEditingTitle) {
      setTitleInputValue(
        data.resumeTitle || data.currentTag || (data.fullName ? `${data.fullName}'s Resume` : 'Untitled Resume')
      );
    }
  }, [data.resumeTitle, data.currentTag, data.fullName, isEditingTitle]);

  const handleSaveClick = React.useCallback(async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      if (onSave) {
        const resolvedTitle =
          titleInputValue.trim() ||
          data.resumeTitle?.trim() ||
          data.currentTag?.trim() ||
          (data.fullName?.trim() ? `${data.fullName.trim()}'s Resume` : 'Untitled Resume');
        const enrichedData: ResumeData = {
          ...data,
          resumeTitle: resolvedTitle,
          currentTag: resolvedTitle,
        };
        await onSave(enrichedData);
      }
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to save resume:', error);
      setSaveStatus('idle');
    }
  }, [onSave, data, titleInputValue, saveStatus]);

  const [undoStack, setUndoStack] = useState<ResumeData[]>([]);
  const [redoStack, setRedoStack] = useState<ResumeData[]>([]);
  const resumeDataRef = React.useRef<ResumeData>(data);
  resumeDataRef.current = data;

  const handleChangeData = React.useCallback((newData: ResumeData) => {
    const prev = resumeDataRef.current;
    if (JSON.stringify(prev) !== JSON.stringify(newData)) {
      setUndoStack((prevStack) => [...prevStack.slice(-30), prev]);
      setRedoStack([]);
    }
    onChange(newData);
  }, [onChange]);

  const handleUndo = React.useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);
    setRedoStack((prev) => [resumeDataRef.current, ...prev]);
    setUndoStack(newUndo);
    onChange(previous);
  }, [undoStack, onChange]);

  const handleRedo = React.useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    const newRedo = redoStack.slice(1);
    setUndoStack((prev) => [...prev, resumeDataRef.current]);
    setRedoStack(newRedo);
    onChange(next);
  }, [redoStack, onChange]);

  // Global Keyboard Shortcuts (Undo: Ctrl+Z / Cmd+Z, Redo: Ctrl+Y / Ctrl+Shift+Z / Cmd+Shift+Z)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isInput) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Wrapper functions that persist immediately
  const setActiveTab = React.useCallback((tab: EditorTab) => {
    setActiveTabState(tab);
    saveToStorage('editor_activeTab', tab);
  }, []);

  const setZoom = React.useCallback((zoom: number | ((prev: number) => number)) => {
    setZoomStateInternal(prev => {
      const newZoom = typeof zoom === 'function' ? zoom(prev) : zoom;
      saveToStorage('editor_zoom', newZoom);
      return newZoom;
    });
  }, []);

  const setActiveMobileTab = React.useCallback((tab: 'editor' | 'preview' | 'job-match') => {
    setActiveMobileTabState(tab);
    saveToStorage('editor_activeMobileTab', tab);
  }, []);

  // Use the state variables
  const activeTab = activeTabState;
  const activeMobileTab = activeMobileTabState;
  const zoom = zoomState;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setZoom(1);

  const [isLeftSidebarOpenState, setIsLeftSidebarOpenState] = useState(() => {
    return loadFromStorage<boolean>('editor_isLeftSidebarOpen', true);
  });

  const setIsLeftSidebarOpen = React.useCallback((open: boolean | ((prev: boolean) => boolean)) => {
    setIsLeftSidebarOpenState(prev => {
      const next = typeof open === 'function' ? open(prev) : open;
      saveToStorage('editor_isLeftSidebarOpen', next);
      return next;
    });
  }, []);

  const isLeftSidebarOpen = isLeftSidebarOpenState;


  // A4 Dimensions in px (approx)
  const A4_WIDTH_PX = 794; // 210mm
  const A4_HEIGHT_PX = 1123; // 297mm

  // Real-time analytics for header
  const analytics = React.useMemo(() => analyzeResume(data), [data]);

  // Helper to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 ring-green-500/20';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 ring-yellow-500/20';
    return 'text-gray-600 bg-gray-50 ring-gray-500/20';
  };

  React.useEffect(() => {
    document.title = `${data.fullName} - Resume`;
    return () => {
      document.title = 'CV Architect';
    };
  }, [data.fullName]);

  // Shortcuts: Ctrl+S to save, Ctrl+B / Ctrl+\ to toggle left sidebar
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveClick();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'b' || e.key === '\\')) {
        e.preventDefault();
        setIsLeftSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveClick, setIsLeftSidebarOpen]);

  const handleDownload = async () => {
    if (!canAccessTemplate(userSubscription.planId, template)) {
      onShowPaywall?.('export');
      return;
    }

    setIsDownloading(true);
    try {
      await exportResumeToPdf(data, template);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`PDF export failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDocxDownload = async () => {
    if (!canAccessTemplate(userSubscription.planId, template)) {
      onShowPaywall?.('export');
      return;
    }

    setIsDownloading(true);
    try {
      await exportResumeToDocx(data);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert(`Word export failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintDownload = () => {
    if (!canAccessTemplate(userSubscription.planId, template)) {
      onShowPaywall?.('export');
      return;
    }
    printResumeToPdf();
  };

  const handleTextDownload = (format: 'text' | 'markdown') => {
    if (!canAccessTemplate(userSubscription.planId, template)) {
      onShowPaywall?.('export');
      return;
    }
    exportResumeToPlainText(data, format);
  };

  const handleCoverLetterDownload = async (content: string) => {
    if (!canAccessTemplate(userSubscription.planId, template)) {
      onShowPaywall?.('export');
      return;
    }

    setIsDownloading(true);
    try {
      await exportCoverLetterToPdf(content, data, data.jobTitle);
    } catch (error) {
      console.error('Error exporting cover letter PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderPrintTemplate = () => {
    if (isPrintingCoverLetter) {
      return (
        <div className="p-8 max-w-[210mm] mx-auto bg-white text-black font-sans leading-relaxed whitespace-pre-wrap">
          {coverLetterContent}
        </div>
      );
    }

    switch (template) {
      case 'vanguard': return <VanguardTemplate data={data} />;
      case 'elevate': return <ElevateResume data={data} />;
      case 'prime': return <PrimeProfile data={data} />;
      case 'impact': return <ImpactTemplate data={data} />;
      case 'free': return <FreeTemplate data={data} />;
      case 'simplepro': return <SimpleProTemplate data={data} />;
      case 'dev': return <DevTemplate data={data} />;
      case 'elite':
      case 'apex': return <ApexTemplate data={data} />;
      case 'modern': return <ModernTemplate data={data} />;
      case 'executive': return <ExecutiveTemplate data={data} />;
      case 'classic': return <ClassicTemplate data={data} />;
      case 'minimalist': return <MinimalistTemplate data={data} />;
      case 'wonsulting': return <WonsultingTemplate data={data} />;
      case 'styled': return <StyledTemplate data={data} />;
      case 'smart':
      case 'elegant': return <ElegantTemplate data={data} />;
      case 'professional': return <ProfessionalTemplate data={data} />;
      case 'times': return <TimesTemplate data={data} />;
      case 'twocolumn': return <TwoColumnTemplate data={data} />;
      case 'sage': return <SageTemplate data={data} />;
      case 'rezi': return <ReziTemplate data={data} />;
      case 'freshgrad1':
      case 'freshgrad2':
      case 'freshgrad4':
      case 'freshgrad5':
      case 'freshgrad6':
        return <FreshGradTemplate data={data} />;
      case 'freshgrad3':
      case 'freshgrad7':
      case 'freshgrad8':
        return <FreshGrad8Template data={data} />;
      case 'student': return <StudentTemplate data={data} />;
      default: return <VanguardTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full bg-brand-bg">
      {/* Global Header / Main Top Bar */}
      <div className="h-14 border-b border-brand-border flex items-center justify-between px-3 sm:px-4 bg-white shrink-0 z-40 shadow-2xs gap-2 relative">
        {/* Left: Back Arrow */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-600 hover:text-neutral-900 cursor-pointer shrink-0"
            title="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Middle: Resume Naming Section */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center max-w-[160px] sm:max-w-[260px] md:max-w-xs lg:max-w-sm pointer-events-auto">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInputValue}
              onChange={(e) => {
                setTitleInputValue(e.target.value);
                handleChangeData({
                  ...data,
                  resumeTitle: e.target.value,
                  currentTag: e.target.value,
                });
              }}
              onBlur={() => {
                setIsEditingTitle(false);
                const trimmed = titleInputValue.trim();
                const finalTitle = trimmed || (data.fullName ? `${data.fullName}'s Resume` : 'Untitled Resume');
                setTitleInputValue(finalTitle);
                handleChangeData({
                  ...data,
                  resumeTitle: finalTitle,
                  currentTag: finalTitle,
                });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                  const trimmed = titleInputValue.trim();
                  const finalTitle = trimmed || (data.fullName ? `${data.fullName}'s Resume` : 'Untitled Resume');
                  setTitleInputValue(finalTitle);
                  handleChangeData({
                    ...data,
                    resumeTitle: finalTitle,
                    currentTag: finalTitle,
                  });
                } else if (e.key === 'Escape') {
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              placeholder="Name your resume..."
              className="px-2.5 py-1 text-xs sm:text-sm font-bold text-center text-brand-dark bg-white border border-brand-green rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 w-full shadow-2xs"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTitleInputValue(data.resumeTitle || data.currentTag || (data.fullName ? `${data.fullName}'s Resume` : 'Untitled Resume'));
                setIsEditingTitle(true);
              }}
              className="group flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold text-brand-dark hover:bg-neutral-100 transition-all text-center truncate cursor-pointer max-w-full border border-transparent hover:border-neutral-200"
              title="Click to rename resume"
            >
              <span className="truncate">
                {data.resumeTitle || data.currentTag || (data.fullName ? `${data.fullName}'s Resume` : 'Untitled Resume')}
              </span>
              <Pencil size={12} className="text-neutral-400 group-hover:text-brand-dark shrink-0 transition-opacity opacity-60 group-hover:opacity-100" />
            </button>
          )}
        </div>

        {/* Right: Actions (Zoom, Full Preview, Save, Cover Letter, Download) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-neutral-100 rounded-lg p-0.5 text-xs text-brand-dark border border-neutral-200">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-700 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-1.5 py-0.5 font-mono font-bold text-[11px] hover:bg-white rounded transition-colors text-neutral-700 cursor-pointer"
              title="Reset Zoom (100%)"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-700 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Full Preview Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
              isFullscreen
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-200'
            }`}
            title={isFullscreen ? 'Exit Full Preview' : 'Full Preview'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          <div className="h-4 w-px bg-neutral-200 mx-0.5" />

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 border ${
              saveStatus === 'saved'
                ? 'bg-brand-green hover:bg-brand-greenHover text-brand-dark border-brand-green/60 shadow-xs'
                : 'bg-white text-brand-dark hover:bg-brand-secondary border-brand-border hover:border-gray-300'
            }`}
            title="Save Resume (Ctrl+S)"
          >
            {saveStatus === 'saving' ? (
              <Loader2 size={14} className="animate-spin text-brand-dark" />
            ) : saveStatus === 'saved' ? (
              <Check size={14} className="text-brand-dark stroke-[2.5]" />
            ) : (
              <Save size={14} className="text-brand-dark" />
            )}
            <span className="hidden sm:inline">{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/cover-letter')}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 border border-brand-border rounded-lg text-xs font-semibold text-brand-dark hover:bg-brand-secondary transition-colors cursor-pointer"
            title="Create Cover Letter"
          >
            <FileTextIcon size={14} />
            <span>Cover Letter</span>
          </button>
          {/* Mobile Cover Letter Icon */}
          <button onClick={() => navigate('/dashboard/cover-letter')} className="xl:hidden p-1.5 text-brand-dark/70 hover:text-brand-dark" title="Create Cover Letter">
            <FileTextIcon size={18} />
          </button>

          {canAccessTemplate(userSubscription.planId, template) ? (
            <div className="relative inline-flex items-center" ref={downloadMenuRef}>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green hover:bg-brand-greenHover text-brand-dark rounded-l-lg text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-95 border border-brand-green/60 disabled:opacity-75 disabled:cursor-not-allowed"
                title="Direct PDF Download"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span className="hidden sm:inline">Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span className="hidden sm:inline">Download</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                disabled={isDownloading}
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
                      handleDownload();
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
                  <button
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      handlePrintDownload();
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

                  {/* 3. Export Word (.docx) */}
                  <button
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      handleDocxDownload();
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

                  {/* 4. Export Text / Markdown */}
                  <div className="h-px bg-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      handleTextDownload('text');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer group"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    <span className="text-xs font-medium">Export Plain Text (.txt)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      handleTextDownload('markdown');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer group"
                  >
                    <Code className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    <span className="text-xs font-medium">Export Markdown (.md)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onShowPaywall?.('export')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green hover:bg-brand-greenHover text-brand-dark rounded-lg text-xs font-bold transition-all shadow-xs ring-2 ring-brand-green/40 hover:shadow-sm cursor-pointer active:scale-95 border border-brand-green/60"
            >
              <ShoppingCart size={14} className="text-brand-dark" />
              <span className="hidden sm:inline">Buy Resume</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel: Accordion Editor */}
        <div className={`
          border-r border-brand-border bg-white flex-col transition-all duration-300 shrink-0
          ${isFullscreen || !isLeftSidebarOpen ? 'w-0 opacity-0 overflow-hidden border-none' : 'w-full md:w-96'}
          ${activeMobileTab === 'editor' ? 'flex' : (isLeftSidebarOpen && !isFullscreen ? 'hidden md:flex' : 'hidden')}
        `}>
          <EditorSidebarLeft
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            data={data}
            onChange={handleChangeData}
            currentTemplate={template}
            onTemplateChange={onTemplateChange}
            userSubscription={userSubscription}
            onAIAction={onAIAction}
            onShowPaywall={onShowPaywall}
            auditResult={auditResult}
            onToggleSidebar={() => setIsLeftSidebarOpen(false)}
          />
        </div>

        {/* Middle Panel: Canvas/Preview with Word-like Live In-Place Editing & Floating Figma Toolbar */}
        <div className={`
          flex-1 bg-brand-bg flex-col h-full overflow-hidden relative
          ${activeMobileTab === 'preview' ? 'flex' : 'hidden md:flex'}
        `}>
          {!isLeftSidebarOpen && !isFullscreen && (
            <button
              type="button"
              onClick={() => setIsLeftSidebarOpen(true)}
              className="hidden md:flex items-center gap-1.5 absolute top-3 left-3 z-20 px-2.5 py-1.5 bg-white/95 backdrop-blur-xs hover:bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-200/90 shadow-xs hover:shadow-md rounded-xl text-xs font-semibold transition-all cursor-pointer animate-fadeIn group"
              title="Show Left Sidebar (Ctrl+B)"
            >
              <PanelLeftOpen size={15} className="text-neutral-600 group-hover:text-neutral-900" />
              <span>Show Sidebar</span>
            </button>
          )}

          <ResumeWorkspace
            data={data}
            onChangeData={handleChangeData}
            template={template}
            onChangeTemplate={onTemplateChange}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            isFullscreen={isFullscreen}
            onToggleFullscreen={setIsFullscreen}
            saveStatus={saveStatus}
            onSave={onSave ? () => onSave(data) : undefined}
            onOpenDesignModal={() => setIsDesignModalOpen(true)}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            hideToolbar={false}
            showSectionControls={false}
          />
        </div>

        {/* Right Panel: Job Match & ATS Tools */}
        <div className={`
          transition-all duration-300
          ${isFullscreen ? 'w-0 opacity-0 overflow-hidden' : 'w-full lg:w-96 shrink-0'}
          ${activeMobileTab === 'job-match' ? 'flex' : 'hidden lg:flex'}
        `}>
          <EditorSidebarRight
            data={data}
            onChange={handleChangeData}
            onSave={onSave}
            onSaveAsTemplate={onSaveAsTemplate}
            currentResumeId={currentResumeId}
            currentTemplate={template}
            userSubscription={userSubscription}
            onAIAction={onAIAction}
          />
        </div>

      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden h-16 bg-white border-t border-brand-border flex items-center justify-around shrink-0 z-30 sticky bottom-0 pb-safe">
        <button
          onClick={() => setActiveMobileTab('editor')}
          className={`flex flex-col items-center gap-1 p-2 ${activeMobileTab === 'editor' ? 'text-brand-green' : 'text-gray-400'}`}
        >
          <Edit3 size={20} />
          <span className="text-[10px] font-medium">Editor</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('preview')}
          className={`flex flex-col items-center gap-1 p-2 ${activeMobileTab === 'preview' ? 'text-brand-green' : 'text-gray-400'}`}
        >
          <Monitor size={20} />
          <span className="text-[10px] font-medium">Preview</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('job-match')}
          className={`flex flex-col items-center gap-1 p-2 ${activeMobileTab === 'job-match' ? 'text-brand-green' : 'text-gray-400'}`}
        >
          <Target size={20} />
          <span className="text-[10px] font-medium">Job Match</span>
        </button>
      </div>

      {/* Design Customization Slide-Over Modal */}
      <DesignCustomizationModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        data={data}
        onChangeData={onChange}
      />


      {/* Hidden Print Container - Rendered via PrintPortal to escape app layout constraints */}
      <PrintPortal
        data={data}
        template={template}
        isPrintingCoverLetter={isPrintingCoverLetter}
        coverLetterContent={coverLetterContent}
      />
      {/* Welcome / AI Audit Modal */}
      {showWelcomeModal && onCloseWelcomeModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-brand-dark p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h2 className="text-2xl font-bold relative z-10">Initial AI Audit</h2>
              <p className="text-gray-300 text-sm relative z-10">Based on your target role: <span className="text-brand-green font-semibold">{data.jobTitle}</span></p>
            </div>

            {/* Body */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Resume Score</p>
                  <div className="text-4xl font-extrabold text-brand-dark">{auditResult?.score || 65}<span className="text-gray-300 text-2xl">/100</span></div>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-brand-green flex items-center justify-center bg-green-50">
                  <Target className="text-brand-green w-8 h-8" />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="mt-0.5 text-orange-500"><LayoutIcon size={18} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Formatting Issues</h4>
                    <p className="text-xs text-gray-600">
                      {auditResult?.issues?.[0] || "Your summary section needs better structure."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onCloseWelcomeModal}
                className="w-full py-4 bg-brand-green hover:opacity-90 text-brand-dark font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Fix Issues Now <ChevronLeft className="rotate-180" size={20} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
