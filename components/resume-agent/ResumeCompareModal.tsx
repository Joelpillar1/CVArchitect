import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Download,
  RotateCcw,
  Loader2,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { ResumeData, TemplateType } from '../../types';
import { JobDescriptionData } from '../../types/resumeAgent';
import ResumePreview from '../ResumePreview';
import { useToast } from '../../contexts/ToastContext';
import { captureElementBox, downloadFile } from '../../utils/pdfExport';

export interface ResumeCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialResume: ResumeData;
  tailoredResume: ResumeData;
  template: TemplateType;
  jobData?: JobDescriptionData | null;
  onRevertToOriginal?: () => void;
}

// Standard physical sheet width and height for Letter/A4 in CSS px at 96 DPI
const SHEET_NATURAL_WIDTH_PX = 816;
const SHEET_NATURAL_HEIGHT_PX = 1056;

// Zoom bounds for the side-by-side preview. Fit mode picks its own scale inside
// these bounds; manual mode lets the reader inspect small print up to 200%.
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export default function ResumeCompareModal({
  isOpen,
  onClose,
  initialResume,
  tailoredResume,
  template,
  jobData,
  onRevertToOriginal,
}: ResumeCompareModalProps) {
  const { showToast } = useToast();
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'diff'>('visual');
  const [viewMode, setViewMode] = useState<'fit' | 'manual'>('fit');

  // Dynamic zoom scale so the on-screen modal fits 100% of both sheets without cutting off sides
  const [zoomScale, setZoomScale] = useState(0.55);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // References to measure natural height of rendered documents
  const leftInnerRef = useRef<HTMLDivElement>(null);
  const rightInnerRef = useRef<HTMLDivElement>(null);
  const [naturalHeight, setNaturalHeight] = useState(SHEET_NATURAL_HEIGHT_PX);

  // Synchronized scroll refs for modal preview
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingLeftRef = useRef(false);
  const isSyncingRightRef = useRef(false);

  // Hidden offscreen container for clean high-DPI image capture
  const exportCardRef = useRef<HTMLDivElement>(null);

  // Update natural height when documents render
  useEffect(() => {
    if (!isOpen || activeTab !== 'visual') return;
    const timer = setTimeout(() => {
      const leftH = leftInnerRef.current?.scrollHeight || SHEET_NATURAL_HEIGHT_PX;
      const rightH = rightInnerRef.current?.scrollHeight || SHEET_NATURAL_HEIGHT_PX;
      const maxH = Math.max(leftH, rightH, SHEET_NATURAL_HEIGHT_PX);
      setNaturalHeight(maxH);
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen, activeTab, initialResume, tailoredResume, template]);

  // Auto-calculate zoom scale so all sides (top, bottom, left, right) fit inside modal
  const computeFitScale = useCallback(() => {
    if (!previewContainerRef.current) return null;

    const container = previewContainerRef.current;
    const totalWidth = container.clientWidth;
    const totalHeight = container.clientHeight;

    // Available width per column:
    // Modal padding ~32px, gap between columns ~24px, scroll track buffer ~16px
    const colWidth = Math.max(200, (totalWidth - 72) / 2);

    // Available height: container height minus header title row (~40px) and padding (~32px)
    const availableHeight = Math.max(200, totalHeight - 76);

    // Calculate scale factor to fit BOTH width AND height
    const scaleX = colWidth / SHEET_NATURAL_WIDTH_PX;
    const scaleY = availableHeight / SHEET_NATURAL_HEIGHT_PX;

    // Fit mode: choose the smaller scale factor so the entire sheet is 100% visible
    const fitScale = Math.min(scaleX, scaleY);

    // Bound scale safely
    return Math.min(1.0, Math.max(MIN_ZOOM, fitScale));
  }, []);

  // Fit mode follows the container; manual mode keeps the reader's zoom.
  const recalculateScale = useCallback(() => {
    if (viewMode !== 'fit') return;
    const fitScale = computeFitScale();
    if (fitScale != null) setZoomScale(fitScale);
  }, [viewMode, computeFitScale]);

  const clampZoom = (value: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));

  const zoomBy = (delta: number) => {
    setViewMode('manual');
    setZoomScale((prev) => clampZoom(prev + delta));
  };

  const zoomTo = (value: number) => {
    setViewMode('manual');
    setZoomScale(clampZoom(value));
  };

  const zoomToFit = () => {
    const fitScale = computeFitScale();
    setViewMode('fit');
    if (fitScale != null) setZoomScale(fitScale);
  };

  useEffect(() => {
    if (!isOpen || activeTab !== 'visual') return;
    recalculateScale();

    const observer = new ResizeObserver(() => {
      recalculateScale();
    });

    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    return () => observer.disconnect();
  }, [isOpen, activeTab, recalculateScale]);

  // Scroll sync handlers (vertical and horizontal, proportional to each column)
  const syncScroll = (from: HTMLDivElement, to: HTMLDivElement) => {
    const fromTopMax = from.scrollHeight - from.clientHeight;
    const fromLeftMax = from.scrollWidth - from.clientWidth;
    to.scrollTop =
      fromTopMax > 0 ? (from.scrollTop / fromTopMax) * (to.scrollHeight - to.clientHeight) : 0;
    to.scrollLeft =
      fromLeftMax > 0 ? (from.scrollLeft / fromLeftMax) * (to.scrollWidth - to.clientWidth) : 0;
  };

  const handleLeftScroll = () => {
    if (isSyncingLeftRef.current) return;
    if (!leftScrollRef.current || !rightScrollRef.current) return;
    isSyncingRightRef.current = true;
    syncScroll(leftScrollRef.current, rightScrollRef.current);
    setTimeout(() => {
      isSyncingRightRef.current = false;
    }, 40);
  };

  const handleRightScroll = () => {
    if (isSyncingRightRef.current) return;
    if (!leftScrollRef.current || !rightScrollRef.current) return;
    isSyncingLeftRef.current = true;
    syncScroll(rightScrollRef.current, leftScrollRef.current);
    setTimeout(() => {
      isSyncingLeftRef.current = false;
    }, 40);
  };

  if (!isOpen) return null;

  // Compute stats
  const initialSkillCount = (initialResume.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean).length;
  const tailoredSkillCount = (tailoredResume.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean).length;
  const skillsAdded = Math.max(0, tailoredSkillCount - initialSkillCount);
  const candidateName = tailoredResume.fullName || initialResume.fullName || 'Candidate';
  const targetJobTitle = jobData?.title || 'Target Role';

  // Download high-resolution comparison image matching exact reference
  const handleDownloadComparisonImage = async () => {
    if (!exportCardRef.current || isExportingImage) return;

    setIsExportingImage(true);
    showToast('Rendering high-resolution comparison image...', 'info');

    try {
      // Use the same capture pipeline as resume PDF/image downloads:
      // foreignObject rasterization first (Chrome's own layout and paint, so
      // contact icons and section rules stay exactly where the preview puts
      // them), with the hardened html2canvas path as the fallback.
      const canvas = await captureElementBox(exportCardRef.current, {
        scale: 2, // 2x Retina resolution for razor-sharp typography
        background: null, // keep the outer 16px corner radius transparent
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) throw new Error('PNG encoding failed');

      const safeName = candidateName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      downloadFile(blob, `cvarchitect-comparison-${safeName}.png`);

      showToast('Comparison image downloaded! Ready to share or save.', 'success');
    } catch (err) {
      console.error('Failed to export comparison image:', err);
      showToast('Could not generate image. Please try again.', 'error');
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleRevert = () => {
    if (onRevertToOriginal) {
      onRevertToOriginal();
      onClose();
      showToast('Reverted to original resume baseline.', 'info');
    }
  };

  const scaledWidthPx = Math.round(SHEET_NATURAL_WIDTH_PX * zoomScale);
  const scaledHeightPx = Math.round(naturalHeight * zoomScale);
  const zoomPercent = Math.round(zoomScale * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between gap-3 shrink-0">
          {/* Left: Tab Switcher (Side-by-Side & Key Upgrades) + Fit/Zoom controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'visual'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setActiveTab('diff')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'diff'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Key Upgrades
              </button>
            </div>

            {/* Zoom controls: zoom out / reset / zoom in / fit */}
            {activeTab === 'visual' && (
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => zoomBy(-ZOOM_STEP)}
                  disabled={zoomScale <= MIN_ZOOM}
                  className="flex items-center justify-center p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => zoomTo(1)}
                  className={`px-2 py-1 rounded-lg tabular-nums transition-all cursor-pointer ${
                    viewMode === 'manual' && Math.abs(zoomScale - 1) < 0.005
                      ? 'bg-white text-gray-900 font-bold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Reset zoom to 100%"
                  aria-label={`Zoom level ${zoomPercent} percent. Reset to 100 percent`}
                >
                  {zoomPercent}%
                </button>

                <button
                  type="button"
                  onClick={() => zoomBy(ZOOM_STEP)}
                  disabled={zoomScale >= MAX_ZOOM}
                  className="flex items-center justify-center p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={zoomToFit}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'fit'
                      ? 'bg-white text-gray-900 font-bold shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Fit both resumes on screen with all sides visible"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Fit</span>
                </button>
              </div>
            )}

            {skillsAdded > 0 && (
              <span className="hidden lg:inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                +{skillsAdded} skills aligned
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Revert Button (if callback provided) */}
            {onRevertToOriginal && (
              <button
                onClick={handleRevert}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors cursor-pointer"
                title="Rollback all tailoring changes"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                <span>Revert</span>
              </button>
            )}

            {/* Download Comparison Button (Matches Editor App Theme & Font Style in Title Case) */}
            <button
              onClick={handleDownloadComparisonImage}
              disabled={isExportingImage}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold text-brand-dark bg-brand-green hover:bg-brand-greenHover transition-colors shadow-xs active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              title="Download comparison image"
            >
              {isExportingImage ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-dark" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-brand-dark" />
                  <span>Download Comparison</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'visual' ? (
          <div className="flex-1 overflow-hidden p-3 sm:p-5 bg-white flex flex-col justify-between min-h-0">
            {/* The Light Gray Comparison Container */}
            <div
              ref={previewContainerRef}
              className="w-full bg-[#F1F2F4] rounded-2xl p-3 sm:p-5 flex flex-col flex-1 overflow-hidden border border-gray-200/80 min-h-0"
            >
              {/* Column Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2.5 mb-1 shrink-0 text-center">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
                  Original Resume (Before)
                </h3>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
                  Tailored with Cvarchitect (After)
                </h3>
              </div>

              {/* Side-by-Side Synchronized Scroll Documents */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 overflow-hidden min-h-0">
                {/* Left: Original */}
                <div
                  ref={leftScrollRef}
                  onScroll={handleLeftScroll}
                  className="overflow-auto flex items-start p-1 [scrollbar-width:thin]"
                >
                  <div
                    style={{
                      width: `${scaledWidthPx}px`,
                      height: `${scaledHeightPx}px`,
                      flexShrink: 0,
                      position: 'relative',
                    }}
                    className="shadow-md rounded-xs bg-white mx-auto"
                  >
                    <div
                      ref={leftInnerRef}
                      style={{
                        width: `${SHEET_NATURAL_WIDTH_PX}px`,
                        transform: `scale(${zoomScale})`,
                        transformOrigin: 'top left',
                      }}
                      className="bg-white rounded-xs select-none"
                    >
                      <ResumePreview data={initialResume} template={template} editable={false} />
                    </div>
                  </div>
                </div>

                {/* Right: Tailored */}
                <div
                  ref={rightScrollRef}
                  onScroll={handleRightScroll}
                  className="overflow-auto flex items-start p-1 [scrollbar-width:thin]"
                >
                  <div
                    style={{
                      width: `${scaledWidthPx}px`,
                      height: `${scaledHeightPx}px`,
                      flexShrink: 0,
                      position: 'relative',
                    }}
                    className="shadow-md rounded-xs bg-white mx-auto"
                  >
                    <div
                      ref={rightInnerRef}
                      style={{
                        width: `${SHEET_NATURAL_WIDTH_PX}px`,
                        transform: `scale(${zoomScale})`,
                        transformOrigin: 'top left',
                      }}
                      className="bg-white rounded-xs select-none"
                    >
                      <ResumePreview data={tailoredResume} template={template} editable={false} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bar below the Gray Box */}
            <div className="pt-3 px-2 flex items-center justify-between text-sm shrink-0">
              <div className="flex items-center gap-2">
                <img
                  src="/images/logo icon.png"
                  alt="CVArchitect Logo"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
                <span className="text-gray-500 text-xs sm:text-sm">
                  Powered by <strong className="font-bold text-gray-900">cvarchitect.app</strong>
                </span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-900">
                Tailor your resume to any job.
              </div>
            </div>
          </div>
        ) : (
          /* Key Upgrades Tab */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Quick Scoreboard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Target Role
                  </div>
                  <div className="text-base font-bold text-gray-900 truncate">
                    {targetJobTitle}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    Keywords integrated
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Skills Aligned
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {tailoredSkillCount} skills
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    {skillsAdded > 0 ? `+${skillsAdded} added from job description` : 'Optimized for ATS'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    ATS Verification
                  </div>
                  <div className="text-base font-bold text-emerald-600">
                    Ready to Submit
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Grounded with truth
                  </div>
                </div>
              </div>

              {/* Summary Upgrade */}
              {tailoredResume.summary !== initialResume.summary && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Professional Summary Upgrade
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900 block mb-1">Original:</span>
                      {initialResume.summary || '(Empty summary)'}
                    </div>
                    <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                      <span className="font-semibold text-emerald-800 block mb-1">Tailored:</span>
                      {tailoredResume.summary}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Upgrade */}
              {tailoredResume.skills !== initialResume.skills && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Skills Inventory Alignment
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600">
                      <span className="font-semibold text-gray-900 block mb-1">Original Skills:</span>
                      {initialResume.skills}
                    </div>
                    <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <span className="font-semibold text-emerald-800 block mb-1">Tailored Skills:</span>
                      {tailoredResume.skills}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 
        ══════════════════════════════════════════════════════════════════════════
        OFFSCREEN EXPORT CARD (Full 820px width per sheet — NO CLIPPING)
        ══════════════════════════════════════════════════════════════════════════
      */}
      <div
        ref={exportCardRef}
        data-export-card
        style={{
          position: 'fixed',
          left: '-99999px',
          top: '0',
          width: '1832px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          padding: '40px',
          boxSizing: 'border-box',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        {/* The Gray Box Container */}
        <div
          style={{
            backgroundColor: '#F1F2F4',
            borderRadius: '16px',
            border: '1px solid rgba(229, 231, 235, 0.8)',
            padding: '36px 40px 40px 40px',
            boxSizing: 'border-box',
          }}
        >
          {/* Column Headers */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '820px',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827',
              }}
            >
              Original Resume (Before)
            </div>
            <div
              style={{
                width: '820px',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827',
              }}
            >
              Tailored with Cvarchitect (After)
            </div>
          </div>

          {/* Side-by-Side Resume Sheets — Each gets full 820px width with no clipping */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Sheet: Original (Before) */}
            <div
              style={{
                width: '820px',
                minWidth: '820px',
                maxWidth: '820px',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
              }}
            >
              <ResumePreview data={initialResume} template={template} editable={false} />
            </div>

            {/* Right Sheet: Tailored (After) */}
            <div
              style={{
                width: '820px',
                minWidth: '820px',
                maxWidth: '820px',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
              }}
            >
              <ResumePreview data={tailoredResume} template={template} editable={false} />
            </div>
          </div>
        </div>

        {/* Promotional Footer Banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            paddingLeft: '8px',
            paddingRight: '8px',
            boxSizing: 'border-box',
          }}
        >
          {/* Left: Powered by cvarchitect.app */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/images/logo icon.png"
              alt="CVArchitect Logo"
              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '16px', color: '#6B7280' }}>
              Powered by{' '}
              <strong style={{ fontWeight: '700', color: '#111827' }}>cvarchitect.app</strong>
            </span>
          </div>

          {/* Right: Tagline */}
          <div
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#111827',
            }}
          >
            Tailor your resume to any job.
          </div>
        </div>
      </div>
    </div>
  );
}
