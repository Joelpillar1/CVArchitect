import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TEMPLATE_CONFIG, getTemplateCategory } from '../utils/templateConfig';
import { getTemplatePreviewData } from '../utils/sampleResumeData';
import { TemplateType, ResumeData } from '../types';

// Direct template components from dashboard
import VanguardTemplate from './templates/VanguardTemplate';
import ElevateResume from './templates/ElevateResume';
import PrimeProfile from './templates/PrimeProfile';
import SimpleProTemplate from './templates/SimpleProTemplate';
import DevTemplate from './templates/DevTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ApexTemplate from './templates/ApexTemplate';
import WonsultingTemplate from './templates/WonsultingTemplate';
import StyledTemplate from './templates/StyledTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import JakeTemplate from './templates/JakeTemplate';
import AnalystTemplate from './templates/AnalystTemplate';
import RegentTemplate from './templates/RegentTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import FreshGradTemplate from './templates/FreshGradTemplate';
import SageTemplate from './templates/SageTemplate';
import ReziTemplate from './templates/ReziTemplate';
import StudentTemplate from './templates/StudentTemplate';

/** Template IDs excluded from the landing-page preview (still available in the dashboard) */
const LANDING_EXCLUDED: Set<TemplateType> = new Set([
  'impact',       // Impact
  'free',         // CareerCraft
  'freshgrad8',   // Campus Modern
  'modern',       // Modern
  'professional', // Pro Clean
  'times',        // Times Classic
  'simplepro',    // Simple Pro
  'elevate',      // Elevate
  'prime',        // Prime Profile
  'student',      // Student Profile
  'freshgrad1',   // Campus Classic
  'dev',          // DevPro
]);

/** Display order for landing page: Harvard first, followed by Regent then Vanguard */
const LANDING_ORDER: TemplateType[] = [
  'rezi',         // Harvard
  'regent',       // Regent Serif
  'vanguard',     // The Vanguard
  'elegant',      // Elegant
  'minimalist',   // Minimalist
  'jake',         // Jake Template
  'gaurav',       // Analyst
  'sage',         // Sage
  'apex',         // Apex Exec
  'classic',      // Classic
  'wonsulting',   // Expert Template
  'styled',       // Styled
];

/* Category definitions */
type CategoryId = 'all' | 'tech' | 'academic' | 'executive' | 'classic' | 'entry';

interface CategoryFilter {
  id: CategoryId;
  label: string;
  templateIds?: TemplateType[];
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', label: 'All Templates' },
  {
    id: 'tech',
    label: 'Tech & Dev',
    templateIds: ['gaurav', 'vanguard', 'jake']
  },
  {
    id: 'academic',
    label: 'Ivy & Academic',
    templateIds: ['rezi', 'wonsulting', 'regent']
  },
  {
    id: 'executive',
    label: 'Executive',
    templateIds: ['apex', 'sage', 'styled']
  },
  {
    id: 'classic',
    label: 'Classic Clean',
    templateIds: ['classic', 'jake', 'regent', 'minimalist', 'elegant']
  },
  {
    id: 'entry',
    label: 'Student & Entry',
    templateIds: ['rezi', 'sage', 'styled', 'elegant', 'twocolumn']
  },
];

/**
 * Direct A4 Sheet Renderer.
 * Mounts the exact dashboard template with realistic resume data.
 * Preserves Harvard (rezi) and Jake (jake) untouched; removes accent colors (#000000) for all other templates.
 */
interface DirectTemplateSheetProps {
  templateId: TemplateType;
}

const DirectTemplateSheet = React.memo(function DirectTemplateSheet({
  templateId
}: DirectTemplateSheetProps) {
  const baseData = useMemo(() => getTemplatePreviewData(templateId), [templateId]);
  const data = useMemo<ResumeData>(() => {
    // Keep Harvard (rezi) and Jake (jake) completely untouched
    if (templateId === 'rezi' || templateId === 'jake') {
      return baseData;
    }

    return {
      ...baseData,
      font: 'Merriweather, Georgia, serif',
      accentColor: '#000000',
    };
  }, [baseData, templateId]);

  const renderContent = () => {
    switch (templateId) {
      case 'vanguard': return <VanguardTemplate data={data} />;
      case 'elevate': return <ElevateResume data={data} />;
      case 'prime': return <PrimeProfile data={data} />;
      case 'simplepro': return <SimpleProTemplate data={data} />;
      case 'dev': return <DevTemplate data={data} />;
      case 'executive': return <ExecutiveTemplate data={data} />;
      case 'classic': return <ClassicTemplate data={data} />;
      case 'apex': return <ApexTemplate data={data} />;
      case 'wonsulting': return <WonsultingTemplate data={data} />;
      case 'styled': return <StyledTemplate data={data} />;
      case 'elegant': return <ElegantTemplate data={data} />;
      case 'minimalist': return <MinimalistTemplate data={data} />;
      case 'jake': return <JakeTemplate data={data} />;
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
        return null;
      case 'sage': return <SageTemplate data={data} />;
      case 'rezi': return <ReziTemplate data={data} />;
      case 'student': return <StudentTemplate data={data} />;
      default: return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div
      className="resume-preview-root resume-page-sheet resume-page w-[210mm] min-h-[297mm] bg-white text-left rounded-none shadow-xs flex flex-col pointer-events-none select-none font-serif"
      style={{
        boxSizing: 'border-box',
        fontFamily: 'Merriweather, Georgia, serif',
        fontSize: `${data.fontSizes?.body || 9.5}pt`,
        lineHeight: data.lineHeight || 1.5,
      }}
    >
      {renderContent()}
    </div>
  );
});

export default function TemplateStudioDeck() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active state: starts with the first arranged template
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateType>(LANDING_ORDER[0]);

  // Filter templates based on selected category, sorted according to LANDING_ORDER
  const filteredTemplates = useMemo(() => {
    const visible = TEMPLATE_CONFIG.filter(t => !LANDING_EXCLUDED.has(t.id));
    const sorted = [...visible].sort((a, b) => {
      const idxA = LANDING_ORDER.indexOf(a.id);
      const idxB = LANDING_ORDER.indexOf(b.id);
      const posA = idxA === -1 ? 999 : idxA;
      const posB = idxB === -1 ? 999 : idxB;
      return posA - posB;
    });
    if (selectedCategory === 'all') return sorted;
    const cat = CATEGORY_FILTERS.find(c => c.id === selectedCategory);
    if (!cat?.templateIds) return sorted;
    return sorted.filter(t => cat.templateIds!.includes(t.id));
  }, [selectedCategory]);

  // Ensure active template is valid when switching categories
  useEffect(() => {
    if (filteredTemplates.length > 0 && !filteredTemplates.some(t => t.id === selectedTemplateId)) {
      setSelectedTemplateId(filteredTemplates[0].id);
    }
  }, [filteredTemplates, selectedTemplateId]);

  // Active template metadata
  const activeTemplate = useMemo(() => {
    return TEMPLATE_CONFIG.find(t => t.id === selectedTemplateId) || TEMPLATE_CONFIG[0];
  }, [selectedTemplateId]);

  // Dynamic scale calculation to fit the exact whole resume width inside the frame
  const sheetContainerRef = useRef<HTMLDivElement>(null);
  const [sheetScale, setSheetScale] = useState(0.72);

  useEffect(() => {
    if (!sheetContainerRef.current) return;
    const updateScale = () => {
      if (sheetContainerRef.current) {
        const w = sheetContainerRef.current.clientWidth;
        if (w > 0) {
          // 210mm in standard CSS px at 96 DPI is 793.7px
          // Scaling by w / 793.7 fits the entire width of the resume edge-to-edge with zero cutoff
          setSheetScale(w / 793.7);
        }
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(sheetContainerRef.current);
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

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

  return (
    <div className="w-full">


      {/* ─── Main Split-Screen Studio Stage ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* ══════════════════════════════════════════════════
            LEFT COLUMN: Template Selector & Live ATS Audit
            ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 flex flex-col gap-3.5 order-2 lg:order-1">
          {/* 1. Interactive Template Selector List */}
          <div className="bg-white rounded-xl border border-brand-border p-3 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-brand-border/60">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-dark/70">
                <Layers className="w-3 h-3 text-brand-green" />
                <span>Select Architecture</span>
              </div>
              <span className="text-[11px] text-brand-dark/50 font-medium">
                {filteredTemplates.length} layouts
              </span>
            </div>

            {/* Scrollable Template List */}
            <div className="max-h-[580px] lg:max-h-[660px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filteredTemplates.map((template) => {
                const isSelected = template.id === selectedTemplateId;
                const category = getTemplateCategory(template);

                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`group w-full py-1.5 px-2.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-brand-dark text-white border-brand-dark shadow-xs ring-1 ring-brand-green/30'
                        : 'bg-white hover:bg-brand-secondary/40 text-brand-dark border-transparent hover:border-brand-border'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Active Beacon or Template Icon */}
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-brand-green text-brand-dark font-black shadow-xs'
                            : 'bg-brand-secondary text-brand-dark/70 group-hover:bg-brand-border/60'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="text-[10px] font-black">{template.name.charAt(0)}</span>
                        )}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold truncate">{template.name}</h4>
                          <span
                            className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-brand-secondary text-brand-dark/60'
                            }`}
                          >
                            {category}
                          </span>
                        </div>
                        <p
                          className={`text-[10px] truncate transition-colors ${
                            isSelected ? 'text-white/70' : 'text-brand-dark/50'
                          }`}
                        >
                          {template.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isSelected
                          ? 'text-brand-green translate-x-0.5'
                          : 'text-brand-dark/30 group-hover:text-brand-dark/60'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>


        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT COLUMN: Hero Stage & Live A4 Resume Viewport
            ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex flex-col order-1 lg:order-2">
          {/* Light Grey Main Frame: matching rounded-xl corner radius of other card */}
          <div className="bg-[#EEF1F4] rounded-xl border border-brand-border pt-4 px-4 sm:pt-6 sm:px-6 pb-0 shadow-xs flex flex-col overflow-hidden">
            {/* ── Top Stage Toolbar: Clean template title & category ── */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-gray-200/80">
              {/* Active Template Title & Badge */}
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-brand-dark tracking-tight">
                  {activeTemplate.name}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/70 bg-white border border-gray-200/90 px-2 py-0.5 rounded-full shadow-2xs">
                  {getTemplateCategory(activeTemplate)}
                </span>
              </div>
            </div>

            {/* ── Document Viewport Frame: Main resume touching the bottom with ZERO corner radius ── */}
            <div className="w-full flex items-start justify-center">
              <div
                ref={sheetContainerRef}
                className="relative w-full h-[360px] sm:h-[480px] lg:h-[640px] bg-white rounded-none shadow-md border-t border-x border-gray-200/80 border-b-0 overflow-hidden mx-auto flex items-start justify-start select-none"
              >


                {/* Scaled High-Res A4 Resume Sheet (Zero Corner Radius - pure A4 sheet) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTemplateId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    style={{
                      width: '210mm',
                      minHeight: '297mm',
                      transform: `scale(${sheetScale})`,
                      transformOrigin: 'top left',
                    }}
                    className="pointer-events-none select-none bg-white rounded-none"
                  >
                    <DirectTemplateSheet
                      templateId={selectedTemplateId}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Bottom Center Primary CTA: Bigger, Centered & Borderless */}
                <div className="absolute bottom-3 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => handleUseTemplate(selectedTemplateId)}
                    className="px-6 py-2.5 sm:px-10 sm:py-4 rounded-xl bg-brand-dark hover:bg-brand-green text-white hover:text-brand-dark font-black text-xs sm:text-base shadow-2xl hover:shadow-brand-green/30 border-0 flex items-center gap-2 sm:gap-3.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap group"
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green group-hover:text-brand-dark transition-all group-hover:translate-x-1.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
