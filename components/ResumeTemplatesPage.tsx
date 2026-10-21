import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import ResumePreview from './ResumePreview';
import { TemplateCardPreviewCanvas } from './ui/TemplateSkeleton';
import { TEMPLATE_CONFIG, getTemplateCategory } from '../utils/templateConfig';
import { getTemplatePreviewData } from '../utils/sampleResumeData';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

function Badge({ chip, children }: { chip: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 py-1 pl-1 pr-4 rounded-full bg-white border border-brand-green/50 shadow-sm">
      <span className="px-3 py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
        {chip}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-brand-dark whitespace-nowrap">{children}</span>
    </span>
  );
}

type TemplateItem = (typeof TEMPLATE_CONFIG)[number];

/* Gallery card: mounts its resume preview only once it approaches the viewport. */
function TemplateCard({ template, index, onUse }: { template: TemplateItem; index: number; onUse: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    // Fallback so previews always mount, even if the observer never reports.
    const fallback = window.setTimeout(() => setVisible(true), 1500 + index * 60);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [visible, index]);

  const previewData = useMemo(
    () => ({ ...getTemplatePreviewData(template.id), font: 'Merriweather, serif' }),
    [template.id]
  );

  return (
    <div
      ref={ref}
      className="group flex flex-col rounded-xl border border-brand-border bg-white p-3 transition-shadow hover:shadow-md cursor-pointer"
      onClick={onUse}
    >
      <div className="relative overflow-hidden rounded-lg">
        {visible ? (
          <TemplateCardPreviewCanvas scaleClass="scale-[0.47] sm:scale-[0.32] lg:scale-[0.34] xl:scale-[0.40]">
            <ResumePreview data={previewData} template={template.id} editable={false} />
          </TemplateCardPreviewCanvas>
        ) : (
          <div className="aspect-[4/3] w-full rounded-lg bg-brand-secondary" />
        )}

        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-brand-dark/0 p-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:bg-brand-dark/25 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onUse(); }}
            className="w-full rounded-lg bg-brand-green px-3 py-2 text-xs font-bold text-brand-dark shadow-lg transition-colors hover:bg-brand-greenHover cursor-pointer"
          >
            Use this template
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-brand-dark">{template.name}</h3>
          <p className="mt-0.5 truncate text-[11px] text-brand-dark/45">{getTemplateCategory(template)}</p>
        </div>
      </div>
    </div>
  );
}

export default function ResumeTemplatesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const startPath = user ? '/dashboard/templates' : '/signup?redirect=/dashboard/templates';

  /* Templates grouped by category, in the order the categories appear in the config. */
  const groups = useMemo(() => {
    const order = Array.from(new Set(TEMPLATE_CONFIG.map((t) => getTemplateCategory(t))));
    let index = 0;
    return order.map((category) => ({
      category,
      templates: TEMPLATE_CONFIG.filter((t) => getTemplateCategory(t) === category).map((template) => ({
        template,
        index: index++,
      })),
    }));
  }, []);

  const groupId = (category: string) => `templates-${category.toLowerCase().replace(/\s+/g, '-')}`;

  const scrollToGrid = () => {
    document.getElementById('resume-templates-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToGroup = (category: string) => {
    document.getElementById(groupId(category))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO
        title="Resume Templates | ATS-Ready Designs | CVArchitect"
        description="Browse ATS-tested resume templates. Pick a layout, add your details, and export a recruiter-ready PDF or DOCX in minutes."
        canonicalPath="/resume-templates"
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        {/* ─── HERO ─── */}
        <section className="relative pb-14 md:pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col items-center">
              <div className="mb-6">
                <Badge chip="Templates">ATS-ready designs</Badge>
              </div>

              <h1 className="text-[clamp(2.1rem,4.8vw,3.9rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-6 max-w-3xl">
                Resume templates{' '}
                <br />
                <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                  that get read
                </span>
              </h1>

              <p className="text-base sm:text-lg text-brand-dark/60 max-w-xl mx-auto leading-relaxed mb-9 text-balance">
                Pick a layout, add your details, and export. Every template is ATS-tested.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(startPath)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm sm:text-base font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover cursor-pointer"
                >
                  Build my resume
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={scrollToGrid}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-brand-dark shadow-xs transition-colors hover:bg-brand-secondary cursor-pointer"
                >
                  Browse templates
                </button>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-brand-dark/50">
                {['Free to start', 'ATS-tested layouts', 'PDF & DOCX export'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand-green" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── GALLERY ─── */}
        <section id="resume-templates-grid" className="relative py-16 md:py-20 bg-white border-t border-brand-border scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-brand-dark">
                  Browse all templates
                </h2>
                <p className="text-sm text-brand-dark/50 mt-1.5">
                  ATS-tested layouts you can edit and export in minutes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {groups.map((group) => (
                  <button
                    key={group.category}
                    onClick={() => scrollToGroup(group.category)}
                    className="rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold bg-brand-bg text-brand-dark/60 border border-brand-border transition-colors hover:text-brand-dark hover:bg-brand-secondary cursor-pointer"
                  >
                    {group.category}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-12 sm:space-y-14">
              {groups.map((group) => (
                <div key={group.category} id={groupId(group.category)} className="scroll-mt-28">
                  <div className="flex items-center gap-4 mb-5">
                    <h3 className="text-lg sm:text-xl font-bold tracking-[-0.01em] text-brand-dark">
                      {group.category} templates
                    </h3>
                    <span className="h-px flex-1 bg-brand-border" aria-hidden="true" />
                    {group.templates.length > 3 && (
                      <button
                        onClick={() => { navigate(startPath); }}
                        className="inline-flex shrink-0 items-center gap-1 text-xs sm:text-sm font-semibold text-brand-dark/55 transition-colors hover:text-brand-dark cursor-pointer whitespace-nowrap"
                      >
                        View all
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {group.templates.slice(0, 3).map(({ template, index }) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        index={index}
                        onUse={() => { navigate(startPath); }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative py-20 md:py-28 bg-brand-dark text-white overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-[clamp(2rem,4.2vw,3.2rem)] font-bold tracking-[-0.03em] leading-[1.05]">
              Your experience deserves a better layout.
            </h2>
            <p className="text-sm sm:text-base text-white/60 mt-4 max-w-xl mx-auto">
              Start free, pick a template, and export your first resume in minutes.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(startPath)}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm sm:text-base font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover cursor-pointer"
            >
              Build my resume
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
