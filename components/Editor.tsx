import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { canAccessTemplate } from '../utils/pricingConfig';
import { ChevronLeft, Maximize2, Minimize2, Download, User, Briefcase, GraduationCap, Award, Layout as LayoutIcon, Target, CheckCircle, Monitor, Edit3, Palette, ShoppingCart } from 'lucide-react';
import FormSection from './FormSection';
import ResumePreview from './ResumePreview';
import EditorSidebarRight from './EditorSidebarRight';
import EditorSidebarLeft from './EditorSidebarLeft';
import VanguardTemplate from './templates/VanguardTemplate';
import ElevateResume from './templates/ElevateResume';
import PrimeProfile from './templates/PrimeProfile';
import ImpactTemplate from './templates/ImpactTemplate';
import FreeTemplate from './templates/FreeTemplate';
import SimpleProTemplate from './templates/SimpleProTemplate';
import DevTemplate from './templates/DevTemplate';
import EliteTemplate from './templates/EliteTemplate';
import ApexTemplate from './templates/ApexTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import WonsultingTemplate from './templates/WonsultingTemplate';
import StyledTemplate from './templates/StyledTemplate';
import SmartTemplate from './templates/SmartTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import CreditDisplay from './CreditDisplay';

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

export type EditorTab = 'personal' | 'summary' | 'education' | 'experience' | 'achievements' | 'skills' | 'certifications' | 'additionalInfo' | 'references' | 'design' | 'job-match';

import { analyzeResume } from './utils/resumeAnalytics';

import { useNavigate } from 'react-router-dom';
import { FileText as FileTextIcon } from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../utils/statePersistence';

export default function Editor({ data, onChange, template, onTemplateChange, onBack, onSave, onSaveAsTemplate, currentResumeId, showWelcomeModal, onCloseWelcomeModal, auditResult, userSubscription, onAIAction, onShowPaywall }: EditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMobileTabState, setActiveMobileTabState] = useState<'editor' | 'preview' | 'design'>(() => {
    return loadFromStorage<'editor' | 'preview' | 'design'>('editor_activeMobileTab', 'editor');
  });
  const [activeTabState, setActiveTabState] = useState<EditorTab>(() => {
    return loadFromStorage<EditorTab>('editor_activeTab', 'personal');
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const [coverLetterContent, setCoverLetterContent] = useState<string>('');
  const [isPrintingCoverLetter, setIsPrintingCoverLetter] = useState(false);
  const [zoomState, setZoomStateInternal] = useState(() => {
    return loadFromStorage<number>('editor_zoom', 0.5);
  });

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

  const setActiveMobileTab = React.useCallback((tab: 'editor' | 'preview' | 'design') => {
    setActiveMobileTabState(tab);
    saveToStorage('editor_activeMobileTab', tab);
  }, []);

  // Use the state variables
  const activeTab = activeTabState;
  const activeMobileTab = activeMobileTabState;
  const zoom = zoomState;

  // Auto-adjust initial zoom based on screen width
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setZoom(0.45);
      else if (window.innerWidth < 768) setZoom(0.6);
      else if (window.innerWidth < 1024) setZoom(0.7);
      else setZoom(0.8);
    };
    handleResize(); // Set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));

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

  const handleDownload = () => {
    const subscriptionManager = new SubscriptionManager(userSubscription);
    if (!canAccessTemplate(userSubscription.planId, template)) {
      onShowPaywall?.('export');
      return;
    }

    setIsDownloading(true);
    // Ensure we are printing resume, not cover letter
    setIsPrintingCoverLetter(false);

    // Update document title for the PDF filename
    const originalTitle = document.title;
    document.title = `${data.fullName.replace(/\s+/g, '_')}_Resume`;

    // Ensure all links have proper href attributes before printing
    setTimeout(() => {
      // Find all links in the print container and ensure they have proper URLs
      const printContainer = document.querySelector('.print-resume');
      if (printContainer) {
        const links = printContainer.querySelectorAll('a[href]');
        links.forEach((link: Element) => {
          const anchor = link as HTMLAnchorElement;
          const href = anchor.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#')) {
            // Ensure relative URLs become absolute
            if (href.includes('@')) {
              anchor.href = `mailto:${href}`;
            } else if (href.includes('.')) {
              anchor.href = `https://${href}`;
            }
          }
          // Ensure links are visible and clickable
          anchor.style.textDecoration = 'underline';
          anchor.style.color = 'inherit';
        });
      }

      // Add a small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        // Trigger browser print dialog
        // Note: For best results, users should:
        // 1. Use Chrome/Edge browser
        // 2. In print dialog, ensure "Background graphics" is enabled
        // 3. Use "Save as PDF" (not "Print to PDF" which may rasterize)
        window.print();
        document.title = originalTitle;
        setIsDownloading(false);
      });
    }, 200);
  };

  const handleCoverLetterDownload = (content: string) => {
    const subscriptionManager = new SubscriptionManager(userSubscription);
    // Optional: Check export permissions for Cover Letter too, if desired
    if (!canAccessTemplate(userSubscription.planId, template)) {
      onShowPaywall?.('export');
      return;
    }

    setCoverLetterContent(content);
    setIsPrintingCoverLetter(true);

    const originalTitle = document.title;
    document.title = `${data.fullName.replace(/\s+/g, '_')}_Cover_Letter`;

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      setIsPrintingCoverLetter(false);
    }, 100);
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
      case 'elite': return <EliteTemplate data={data} />;
      case 'apex': return <ApexTemplate data={data} />;
      case 'modern': return <ModernTemplate data={data} />;
      case 'executive': return <ExecutiveTemplate data={data} />;
      case 'classic': return <ClassicTemplate data={data} />;
      case 'minimalist': return <MinimalistTemplate data={data} />;
      case 'wonsulting': return <WonsultingTemplate data={data} />;
      case 'styled': return <StyledTemplate data={data} />;
      case 'smart': return <SmartTemplate data={data} />;
      case 'elegant': return <ElegantTemplate data={data} />;
      case 'professional': return <ProfessionalTemplate data={data} />;
      case 'twocolumn': return <TwoColumnTemplate data={data} />;
      default: return <VanguardTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full bg-brand-bg">
      {/* Global Header */}
      <div className="h-16 border-b border-brand-border flex items-center justify-between px-2 sm:px-4 bg-brand-bg shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button onClick={onBack} className="p-2 hover:bg-brand-secondary rounded-full transition-colors shrink-0">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-gray-500">Home</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500">Template</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-brand-dark">My Resume</span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Real-time Scores */}
          <div className="hidden md:flex items-center gap-3 mr-4 border-r border-gray-200 pr-4 h-8">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset transition-all ${getScoreColor(analytics.atsScore)}`}>
              <Target size={14} className="opacity-80" />
              <span>ATS Score: {analytics.atsScore}</span>
            </div>
            {analytics.jobMatchScore > 0 && data.jobDescription && data.jobDescription.trim().length > 20 && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset transition-all ${getScoreColor(analytics.jobMatchScore)}`}>
                <Briefcase size={14} className="opacity-80" />
                <span>Job Match: {analytics.jobMatchScore}%</span>
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <CreditDisplay
              userSubscription={userSubscription}
              onUpgradeClick={() => onShowPaywall?.('general')}
            />
          </div>
          <button
            onClick={() => navigate('/dashboard/cover-letter')}
            className="hidden sm:flex items-center gap-2 px-3 py-2 border border-brand-border rounded-lg text-sm font-medium text-brand-dark hover:bg-brand-secondary transition-colors"
          >
            <FileTextIcon size={16} />
            <span className="hidden md:inline">Cover Letter</span>
          </button>
          {/* Mobile Cover Letter Icon */}
          <button onClick={() => navigate('/dashboard/cover-letter')} className="sm:hidden p-2 text-gray-500 hover:text-brand-dark">
            <FileTextIcon size={20} />
          </button>

          {canAccessTemplate(userSubscription.planId, template) ? (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 border border-brand-border rounded-lg text-sm font-medium text-brand-dark hover:bg-brand-secondary transition-colors"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
          ) : (
            <button
              onClick={() => onShowPaywall?.('export')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm ring-2 ring-brand-green/50 animate-pulse"
            >
              <ShoppingCart size={16} className="text-brand-green" />
              <span className="hidden sm:inline">Buy this Resume</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel: Accordion Editor */}
        <div className={`
          border-r border-brand-border bg-brand-bg flex-col transition-all duration-300
          ${isFullscreen ? 'w-0 opacity-0 overflow-hidden' : 'w-full md:w-96'}
          ${activeMobileTab === 'editor' ? 'flex' : 'hidden md:flex'}
        `}>
          <EditorSidebarLeft
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            data={data}
            onChange={onChange}
            currentTemplate={template}
            onTemplateChange={onTemplateChange}
            userSubscription={userSubscription}
            onAIAction={onAIAction}
            onShowPaywall={onShowPaywall}
            auditResult={auditResult}
          />
        </div>

        {/* Middle Panel: Canvas/Preview */}
        <div className={`
          flex-1 bg-brand-bg overflow-auto relative flex flex-col items-center py-8
          ${activeMobileTab === 'preview' ? 'flex' : 'hidden md:flex'}
        `}>
          {/* Zoom Controls Overlay */}
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:absolute md:top-4 md:right-4 md:left-auto md:translate-x-0 md:bottom-auto z-20 flex items-center gap-2 bg-white/90 backdrop-blur border border-gray-200 p-1.5 rounded-lg shadow-lg">
            <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Minimize2 size={16} /></button>
            <span className="text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Maximize2 size={16} /></button>
          </div>

          {/* Resume Container with layout-enforcing wrapper */}
          <div
            style={{
              width: `${A4_WIDTH_PX * zoom}px`,
              height: `${A4_HEIGHT_PX * zoom}px`,
              transition: 'width 0.2s, height 0.2s'
            }}
            className="relative shrink-0 transition-all duration-200"
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                width: '210mm',
                height: '297mm'
              }}
              className="absolute top-0 left-0 bg-white shadow-2xl"
            >
              <ResumePreview data={data} template={template} />
            </div>
          </div>
        </div>

        {/* Right Panel: Design Tools */}
        <div className={`
          transition-all duration-300
          ${isFullscreen ? 'w-0 opacity-0 overflow-hidden' : 'w-full lg:w-80'}
          ${activeMobileTab === 'design' ? 'flex' : 'hidden lg:flex'}
        `}>
          <EditorSidebarRight
            data={data}
            onChange={onChange}
            onSave={onSave}
            onSaveAsTemplate={onSaveAsTemplate}
            currentResumeId={currentResumeId}
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
          onClick={() => setActiveMobileTab('design')}
          className={`flex flex-col items-center gap-1 p-2 ${activeMobileTab === 'design' ? 'text-brand-green' : 'text-gray-400'}`}
        >
          <Palette size={20} />
          <span className="text-[10px] font-medium">Design</span>
        </button>
      </div>

      {/* Hidden Print Container */}
      {/* Hidden Print Container - Rendered via Portal to escape app layout constraints */}
      {createPortal(
        <div className="hidden print:block absolute top-0 left-0 w-full h-auto bg-white z-[9999] print:w-full print:max-w-[210mm]">
          <table className="w-full">
            <thead>
              <tr>
                <td>
                  {/* Top Margin Spacer (repeats on every page) */}
                  <div style={{ height: '10mm' }}></div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div
                    className="print-resume"
                    style={{
                      fontFamily: data.font || 'Inter, sans-serif',
                      fontSize: `${data.fontSizes?.body || 10.5}pt`,
                      lineHeight: data.lineHeight || 1.4,
                    }}
                  >
                    {renderPrintTemplate()}
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  {/* Bottom Margin Spacer (repeats on every page) */}
                  <div style={{ height: '10mm' }}></div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>,
        document.body
      )}
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
