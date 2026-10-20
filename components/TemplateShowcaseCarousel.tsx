import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TEMPLATE_CONFIG, getTemplateCategory } from '../utils/templateConfig';
import { getTemplatePreviewData } from '../utils/sampleResumeData';
import { TemplateType } from '../types';

// Direct template components from the dashboard
import VanguardTemplate from './templates/VanguardTemplate';
import ElevateResume from './templates/ElevateResume';
import PrimeProfile from './templates/PrimeProfile';
import ImpactTemplate from './templates/ImpactTemplate';
import FreeTemplate from './templates/FreeTemplate';
import SimpleProTemplate from './templates/SimpleProTemplate';
import DevTemplate from './templates/DevTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ApexTemplate from './templates/ApexTemplate';
import WonsultingTemplate from './templates/WonsultingTemplate';
import StyledTemplate from './templates/StyledTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import TimesTemplate from './templates/TimesTemplate';
import JakeTemplate from './templates/JakeTemplate';
import ScholarTemplate from './templates/ScholarTemplate';
import AnalystTemplate from './templates/AnalystTemplate';
import RegentTemplate from './templates/RegentTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import FreshGradTemplate from './templates/FreshGradTemplate';
import FreshGrad8Template from './templates/FreshGrad8Template';
import SageTemplate from './templates/SageTemplate';
import ReziTemplate from './templates/ReziTemplate';
import StudentTemplate from './templates/StudentTemplate';
import InternTemplate from './templates/InternTemplate';

/* ATS logos / icons simulation */
const ATS_LOGOS = [
  { name: 'Workday', initial: 'W', color: 'bg-blue-600 text-white' },
  { name: 'Taleo', initial: 'T', color: 'bg-orange-600 text-white' },
  { name: 'Greenhouse', initial: 'G', color: 'bg-emerald-600 text-white' },
  { name: 'Lever', initial: 'L', color: 'bg-cyan-700 text-white' },
];

/**
 * Direct A4 Resume Sheet Renderer.
 * Directly mounts the chosen dashboard template with full resume content.
 * Bypasses pagination slicing measurements so it renders instantly with 0ms delay,
 * zero layout thrashing, and zero skeleton placeholder states.
 */
interface DirectTemplateSheetProps {
  templateId: TemplateType;
}

const DirectTemplateSheet = React.memo(function DirectTemplateSheet({ templateId }: DirectTemplateSheetProps) {
  const data = useMemo(() => getTemplatePreviewData(templateId), [templateId]);

  const renderContent = () => {
    switch (templateId) {
      case 'vanguard': return <VanguardTemplate data={data} />;
      case 'elevate': return <ElevateResume data={data} />;
      case 'prime': return <PrimeProfile data={data} />;
      case 'impact': return <ImpactTemplate data={data} />;
      case 'free': return <FreeTemplate data={data} />;
      case 'simplepro': return <SimpleProTemplate data={data} />;
      case 'dev': return <DevTemplate data={data} />;
      case 'modern': return <ModernTemplate data={data} />;
      case 'executive': return <ExecutiveTemplate data={data} />;
      case 'classic': return <ClassicTemplate data={data} />;
      case 'apex': return <ApexTemplate data={data} />;
      case 'wonsulting': return <WonsultingTemplate data={data} />;
      case 'styled': return <StyledTemplate data={data} />;
      case 'elegant': return <ElegantTemplate data={data} />;
      case 'minimalist': return <MinimalistTemplate data={data} />;
      case 'professional': return <ProfessionalTemplate data={data} />;
      case 'times': return <TimesTemplate data={data} />;
      case 'jake': return <JakeTemplate data={data} />;
      case 'scholar': return <ScholarTemplate data={data} />;
      case 'gaurav': return <AnalystTemplate data={data} />;
      case 'regent': return <RegentTemplate data={data} />;
      case 'twocolumn': return <TwoColumnTemplate data={data} />;
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
      case 'sage': return <SageTemplate data={data} />;
      case 'rezi': return <ReziTemplate data={data} />;
      case 'student': return <StudentTemplate data={data} />;
      case 'intern': return <InternTemplate data={data} />;
      default: return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white text-left shadow-xs flex flex-col pointer-events-none select-none"
      style={{
        boxSizing: 'border-box',
        fontFamily: data.font || 'Inter, sans-serif',
        fontSize: `${data.fontSizes?.body || 9.5}pt`,
        lineHeight: data.lineHeight || 1.5,
      }}
    >
      {renderContent()}
    </div>
  );
});

export default function TemplateShowcaseCarousel() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Find classic as default initial template
  const initialIndex = TEMPLATE_CONFIG.findIndex(t => t.id === 'classic');
  const [activeIndex, setActiveIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  // ATS score loading animation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Measure container width for accurate, responsive centering
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Trigger ATS loading scan when active template changes
  useEffect(() => {
    setIsScanning(true);
    setScanProgress(0);

    const startTime = performance.now();
    const duration = 450; // 450ms smooth scan simulation

    let rafId: number;
    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setScanProgress(progress);

      if (progress < 100) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        setIsScanning(false);
      }
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [activeIndex]);

  const activeTemplate = TEMPLATE_CONFIG[activeIndex] || TEMPLATE_CONFIG[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TEMPLATE_CONFIG.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TEMPLATE_CONFIG.length - 1 ? 0 : prev + 1));
  };

  const handleUseTemplate = (templateId: TemplateType) => {
    try {
      localStorage.setItem('cv_architect_selected_template', templateId);
    } catch (err) {
      console.warn('Storage write error:', err);
    }

    if (user) {
      navigate(`/dashboard?template=${templateId}`);
    } else {
      navigate(`/signup?redirect=/dashboard&template=${templateId}`);
    }
  };

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Card dimensions for carousel translation math
  const cardWidth = containerWidth < 640 ? 310 : containerWidth < 1024 ? 360 : 400;
  const cardGap = containerWidth < 640 ? 20 : 28;

  // Exact pixel coordinate to center the active card in the viewport
  const targetX = (containerWidth / 2) - (activeIndex * (cardWidth + cardGap) + cardWidth / 2);

  return (
    <div className="w-full select-none">
      {/* ─── Top Active Template Title & ATS Status Pill ─── */}
      <div className="text-center mb-8 sm:mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTemplate.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-dark mb-3">
              {activeTemplate.name}
            </h3>

            {/* ATS Parsability Badge & Company Logomarks */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-brand-border shadow-xs">
              {/* ATS Icons cluster */}
              <div className="flex items-center -space-x-1">
                {ATS_LOGOS.map((ats) => (
                  <div
                    key={ats.name}
                    title={ats.name}
                    className={`w-5 h-5 rounded-full ${ats.color} flex items-center justify-center text-[10px] font-black border border-white shadow-2xs`}
                  >
                    {ats.initial}
                  </div>
                ))}
              </div>

              {/* Verified Text */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-dark/80">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span>Parsable by all major ATS</span>
              </div>

              {/* Category chip */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 bg-brand-secondary px-2 py-0.5 rounded-full">
                {getTemplateCategory(activeTemplate)}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Carousel Viewport & Horizontal Track ─── */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden py-4 min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex items-center"
      >
        {/* Soft edge fades on extreme left/right edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-brand-bg via-brand-bg/80 to-transparent z-10 pointer-events-none" />

        {/* Sliding Flex Container Centered on Active Card */}
        <motion.div
          className="flex items-center"
          animate={{ x: targetX }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 30,
            mass: 0.8
          }}
          style={{ willChange: 'transform' }}
        >
          {TEMPLATE_CONFIG.map((template, idx) => {
            const isActive = idx === activeIndex;

            return (
              <div
                key={template.id}
                className="shrink-0 flex flex-col items-center cursor-pointer transition-all duration-300"
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${cardGap}px`,
                }}
                onClick={() => {
                  if (!isActive) setActiveIndex(idx);
                }}
              >
                {/* Name Label floating above each card */}
                <div className="h-8 flex items-center justify-center mb-2">
                  <span
                    className={`text-sm sm:text-base font-bold transition-all duration-300 ${
                      isActive
                        ? 'text-brand-dark scale-105'
                        : 'text-brand-dark/40 hover:text-brand-dark/70'
                    }`}
                  >
                    {template.name}
                  </span>
                </div>

                {/* Resume Card Frame */}
                <div
                  className={`relative w-full aspect-[1/1.4] rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'scale-100 border-2 border-brand-green shadow-2xl ring-4 ring-brand-green/15 z-20'
                      : 'scale-[0.91] border border-brand-border/90 opacity-60 hover:opacity-85 shadow-sm hover:scale-[0.93] z-10'
                  } bg-white overflow-hidden flex flex-col`}
                >
                  {/* Real Live Rendered Resume Template */}
                  <div className="relative w-full h-full bg-white overflow-hidden pointer-events-none select-none flex items-start justify-center pt-1.5">
                    <div className="w-[210mm] origin-top transform scale-[0.38] sm:scale-[0.44] lg:scale-[0.49] pointer-events-none select-none">
                      <DirectTemplateSheet templateId={template.id} />
                    </div>
                  </div>

                  {/* ── Active Card Interactive Overlays ── */}
                  {isActive && (
                    <>
                      {/* Left Navigation Arrow */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        aria-label="Previous template"
                        className="absolute -left-5 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-dark hover:bg-brand-dark/90 text-white flex items-center justify-center shadow-xl border border-white/20 transition-transform hover:scale-110 active:scale-95 cursor-pointer z-30"
                      >
                        <ChevronLeft className="w-5 h-5 text-brand-green" />
                      </button>

                      {/* Right Navigation Arrow */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        aria-label="Next template"
                        className="absolute -right-5 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-dark hover:bg-brand-dark/90 text-white flex items-center justify-center shadow-xl border border-white/20 transition-transform hover:scale-110 active:scale-95 cursor-pointer z-30"
                      >
                        <ChevronRight className="w-5 h-5 text-brand-green" />
                      </button>

                      {/* Center Floating CTA Button */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseTemplate(activeTemplate.id);
                          }}
                          className="px-6 sm:px-7 py-3 rounded-lg bg-brand-dark hover:bg-brand-dark/90 text-white font-bold text-xs sm:text-sm shadow-2xl border border-brand-green/50 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
                        >
                          <span>Use this template</span>
                          <ArrowRight className="w-4 h-4 text-brand-green" />
                        </button>
                      </div>

                      {/* Bottom ATS Parsability Card */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl border border-brand-green/40 p-3 sm:p-3.5 shadow-lg">
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                            <span className="font-mono text-[11px] font-bold tracking-wider text-brand-dark/80 uppercase">
                              ATS Parsability
                            </span>
                          </div>
                          <span className="font-mono text-brand-dark font-extrabold text-sm">
                            {isScanning ? `${scanProgress}%` : '100%'}
                          </span>
                        </div>

                        {/* Animated Score Progress Bar */}
                        <div className="w-full bg-brand-secondary h-2 rounded-full overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-brand-green rounded-full transition-all duration-150 ease-out"
                            style={{ width: `${isScanning ? scanProgress : 100}%` }}
                          />
                        </div>

                        {/* Status Note */}
                        <div className="flex items-center justify-between text-[11px] text-brand-dark/65 font-medium">
                          <span className="truncate">
                            {isScanning
                              ? 'Scanning Workday & Greenhouse parser taxonomy...'
                              : 'Every section read correctly by all major ATS'}
                          </span>
                          {!isScanning && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-brand-green/20 px-2 py-0.5 rounded-full shrink-0 ml-1">
                              <Check className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ─── Bottom Navigation Dots & Indicators ─── */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {/* Template Index & Category Info */}
        <div className="flex items-center gap-3 text-xs font-mono text-brand-dark/60">
          <span>
            Template <strong className="text-brand-dark font-bold">{activeIndex + 1}</strong> of {TEMPLATE_CONFIG.length}
          </span>
          <span className="w-1 h-1 rounded-full bg-brand-dark/20" />
          <span className="text-brand-dark/70 font-semibold">{activeTemplate.subtitle}</span>
        </div>

        {/* Clickable Dots / Micro-indicators */}
        <div className="flex items-center gap-1.5 max-w-full overflow-x-auto py-1 scrollbar-none">
          {TEMPLATE_CONFIG.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`Jump to ${t.name}`}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                i === activeIndex
                  ? 'w-6 bg-brand-green'
                  : 'w-1.5 bg-brand-dark/20 hover:bg-brand-dark/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
