import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHydrating } from '../contexts/HydrationContext';
import { ArrowRight, Check, LayoutTemplate } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import { PublicVisualCta } from './PublicVisualCta';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import { TemplateGalleryCard } from './TemplateGalleryCard';
import { TEMPLATE_CONFIG, getTemplateCategory } from '../utils/templateConfig';
import { ROLE_GUIDES } from '../utils/roleTemplates';

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

export default function ResumeTemplatesPage() {
  const hydrating = useHydrating();
  const navigate = useNavigate();
  const { user } = useAuth();

  const startPath = user ? '/dashboard/templates' : '/signup?redirect=/dashboard/templates';

  /* Templates grouped by category, in the order the categories appear in the config. */
  const groups = useMemo<Array<{ category: string; templates: Array<{ template: (typeof TEMPLATE_CONFIG)[number]; index: number }> }>>(() => {
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
        title="Resume Templates | ATS-Ready Designs | Cvarchitect"
        description="Browse ATS-tested resume templates. Pick a layout, add your details, and export a recruiter-ready PDF or DOCX in minutes."
        canonicalPath="/resume-templates"
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        {/* ─── HERO ─── */}
        <section className="relative pb-14 md:pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={hydrating ? false : 'hidden'} animate="visible" variants={fadeInUp} className="flex flex-col items-center">
              <div className="mb-6">
                <Badge chip="Templates">ATS-ready designs</Badge>
              </div>

              <h1 className="text-[clamp(2.1rem,4.8vw,3.9rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-6 max-w-3xl">
                {'Resume templates '}
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
                      {`${group.category} templates`}
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
                      <TemplateGalleryCard
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

        {/* ─── BY ROLE ─── */}
        <section aria-labelledby="templates-by-role" className="relative py-14 md:py-16 bg-brand-bg border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-3">
                  By role
                </p>
                <h2 id="templates-by-role" className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-brand-dark">
                  Start from your job title
                </h2>
                <p className="text-sm text-brand-dark/55 mt-2 max-w-xl leading-relaxed">
                  Each guide pairs three layouts with the experience, keywords, and bullets hiring managers scan for.
                </p>
              </div>
              <Link
                to="/blog/resume-examples-by-industry-2026"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-dark/60 transition-colors hover:text-brand-dark"
              >
                Examples by industry
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {ROLE_GUIDES.map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/resume-templates/${guide.slug}`}
                  className="group flex flex-col rounded-xl border border-brand-border bg-white p-5 transition-colors hover:border-brand-dark/25"
                >
                  <h3 className="text-base font-bold text-brand-dark">{guide.role}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-brand-dark/55">{guide.summary}</p>
                  <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                    View guide
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <PublicVisualCta
          badge="ATS-Optimized Formats"
          badgeIcon={<LayoutTemplate className="w-3.5 h-3.5 text-brand-green" />}
          headline={<>Your experience deserves<br className="hidden sm:inline" /> a better layout.</>}
          sub={<>Start free, customize your favorite template,<br className="hidden sm:inline" /> and export a recruiter-approved resume in minutes.</>}
          ctaLabel="Build my resume"
          onCta={() => navigate(startPath)}
          trustBullets={[
            'ATS-friendly & parser tested',
            '3 free exports included',
            'One-click typography styling'
          ]}
        />
      </main>

      <PublicFooter />
    </div>
  );
}
