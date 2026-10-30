import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useHydrating } from '../contexts/HydrationContext';
import {
  ArrowRight,
  Check,
  Download,
  FileCheck,
  FileText,
  Sparkles,
  Target
} from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import { PublicVisualCta } from './PublicVisualCta';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import CoverLetterPreview from './cover-letters/CoverLetterPreview';
import {
  COVER_LETTER_TEMPLATES,
  CoverLetterTemplateType
} from '../utils/coverLetterConfig';

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

/* Scaled A4 letter used as a product visual. */
function LetterFrame({
  template,
  className = '',
  size = 'md'
}: {
  template: CoverLetterTemplateType;
  className?: string;
  size?: 'md' | 'lg' | 'thumb';
}) {
  const box =
    size === 'lg'
      ? 'w-[318px] h-[450px] sm:w-[397px] sm:h-[562px] lg:w-[476px] lg:h-[674px]'
      : size === 'thumb'
        ? 'w-[140px] h-[198px]'
        : 'w-[318px] h-[450px] sm:w-[357px] sm:h-[506px]';
  const scale =
    size === 'lg'
      ? 'scale-[0.40] sm:scale-[0.50] lg:scale-[0.60]'
      : size === 'thumb'
        ? 'scale-[0.176]'
        : 'scale-[0.40] sm:scale-[0.45]';
  const chrome =
    size === 'thumb' ? 'rounded-lg shadow-sm' : 'rounded-xl shadow-2xl ring-1 ring-black/10';

  return (
    <div data-resume-preview className={`relative mx-auto ${box} overflow-hidden bg-white ${chrome} ${className}`}>
      <div
        className={`origin-top-left ${scale}`}
        style={{ width: '210mm', minHeight: '297mm' }}
      >
        <CoverLetterPreview template={template} />
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Target className="w-4 h-4 text-brand-green" />,
    label: 'Job aware',
    title: 'Writes for the job, not just the role',
    body: "The posting's requirements, tone and vocabulary drive the draft, with no keyword stuffing and no generic openings."
  },
  {
    icon: <FileCheck className="w-4 h-4 text-brand-green" />,
    label: 'Grounded',
    title: 'Grounded in your real history',
    body: 'Every sentence traces back to a role, metric or skill already on your resume. Nothing is invented or padded.'
  },
  {
    icon: <Download className="w-4 h-4 text-brand-green" />,
    label: 'Export ready',
    title: 'Edit, preview, export',
    body: 'Tune the wording inline, switch templates live, then download a pixel-perfect PDF or DOCX in one click.'
  },
];

const STEPS = [
  {
    icon: <FileText className="w-4 h-4 text-brand-green" />,
    title: 'Add your resume and the job',
    body: 'Pick a saved resume or paste a job description. Cvarchitect reads both before writing a word.'
  },
  {
    icon: <Sparkles className="w-4 h-4 text-brand-green" />,
    title: 'Cvarchitect drafts the letter',
    body: 'A one-page letter in your voice, mapped to the role and grounded in your actual experience.'
  },
  {
    icon: <Download className="w-4 h-4 text-brand-green" />,
    title: 'Edit, preview, export',
    body: 'Refine anything, preview it instantly, and download a clean PDF or editable DOCX.'
  },
];

export default function CoverLetterLandingPage() {
  const hydrating = useHydrating();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [template, setTemplate] = useState<CoverLetterTemplateType>('modern');
  const templateRows = useRef<Record<string, HTMLButtonElement | null>>({});
  const manualLock = useRef(0);
  const prerendering =
    typeof window !== 'undefined' && (window as any).__PRERENDER_HYDRATION__ === true;

  // Scroll-driven selection: whichever template row crosses the viewport
  // centre becomes the active preview.
  useEffect(() => {
    if (prerendering) return;
    const rows = Object.values(templateRows.current).filter(Boolean) as HTMLButtonElement[];
    if (!rows.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < manualLock.current) return;
        const hit = entries.find((entry) => entry.isIntersecting);
        const id = hit?.target.getAttribute('data-template') as CoverLetterTemplateType | null;
        if (id) setTemplate(id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [prerendering]);

  const startPath = user ? '/dashboard/cover-letter' : '/signup?redirect=/dashboard/cover-letter';
  const scrollToTemplates = () => {
    document.getElementById('cover-letter-templates')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const activeTemplate = COVER_LETTER_TEMPLATES.find((t) => t.id === template) || COVER_LETTER_TEMPLATES[0];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO
        title="AI Cover Letter Generator | Cvarchitect"
        description="Write a cover letter that matches the job and your real experience. AI-drafted, editable, ATS-safe, and exportable to PDF or DOCX."
        canonicalPath="/cover-letter"
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        {/* ─── HERO ─── */}
        <section className="relative pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={hydrating ? false : 'hidden'} animate="visible" variants={fadeInUp} className="flex flex-col items-center">
              <div className="mb-6">
                <Badge chip="Cover Letters">Tailored to the job</Badge>
              </div>

              <h1 className="text-[clamp(2.1rem,4.8vw,3.9rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-6 max-w-3xl">
                {'A cover letter that '}
                <br />
                <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                  sounds like you
                </span>
              </h1>

              <p className="text-base sm:text-lg text-brand-dark/60 max-w-xl mx-auto leading-relaxed mb-9 text-balance">
                Paste the job description. Get a one-page letter built from your real experience.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(startPath)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm sm:text-base font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover cursor-pointer"
                >
                  Write my cover letter
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={scrollToTemplates}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-brand-dark shadow-xs transition-colors hover:bg-brand-secondary cursor-pointer"
                >
                  See the templates
                </button>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-brand-dark/50">
                {['Free to start', 'PDF & DOCX export', 'No credit card'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand-green" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── SHOWCASE ─── */}
        <section className="relative bg-brand-dark text-white py-16 md:py-24 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={hydrating ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeInUp}
              >
                <span className="text-brand-green font-bold text-[11px] uppercase tracking-[0.16em]">
                  Grounded, not generic
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mt-3">
                  One page. Your voice. Their job description.
                </h2>
                <p className="text-sm sm:text-base text-white/65 mt-4 leading-relaxed max-w-md">
                  No more blank-page panic or copy-pasted letters. Every draft is built from roles, skills and
                  wins that already exist on your resume.
                </p>

                <ul className="mt-7 space-y-3">
                  {[
                    'Every claim traces back to a role on your resume',
                    "Mirrors the posting's language without keyword stuffing",
                    'Editable, previewable and export-ready in one place'
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-green/20">
                        <Check className="w-3 h-3 text-brand-green" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(startPath)}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-sm font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover cursor-pointer"
                >
                  Open the builder
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={hydrating ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center"
              >
                <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <LetterFrame template="modern" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="relative py-24 md:py-32 bg-brand-bg border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={hydrating ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              className="text-center mb-14"
            >
              <Badge chip="Why it works">Built on your resume, not a template</Badge>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mt-5 text-balance">
                Letters that sound human, because they are yours
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={hydrating ? false : 'hidden'}
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeInUp}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                  className="h-full rounded-xl bg-white border border-brand-border p-6 sm:p-7 transition-shadow hover:shadow-md flex flex-col"
                >
                  <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-dark/75 bg-brand-bg border border-brand-border px-2.5 py-1 rounded-lg">
                    {feature.icon}
                    {feature.label}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-brand-dark mt-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-brand-dark/60 mt-2.5 leading-relaxed">
                    {feature.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TEMPLATES ─── */}
        <section id="cover-letter-templates" className="relative py-24 md:py-32 bg-white border-t border-brand-border scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={hydrating ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <Badge chip="Templates">Eight styles, one voice</Badge>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mt-5 text-balance">
                Pick the look. Keep your words.
              </h2>
              <p className="text-base text-brand-dark/60 mt-4 max-w-2xl mx-auto">
                Every template is ATS-safe, fully editable, and exports cleanly to PDF or DOCX.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[auto_auto] lg:justify-center gap-10 lg:gap-14 items-start">
              {/* Template selector */}
              <div>
                {/* Mobile: horizontal template cards */}
                <div className="-mx-4 px-4 lg:hidden">
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {COVER_LETTER_TEMPLATES.map((t) => {
                      const isActive = t.id === template;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            manualLock.current = Date.now() + 1200;
                            setTemplate(t.id);
                          }}
                          aria-pressed={isActive}
                          className={`w-[158px] shrink-0 snap-start rounded-xl border p-2 text-left transition-colors cursor-pointer ${
                            isActive ? 'border-brand-dark bg-brand-dark' : 'border-brand-border bg-brand-bg'
                          }`}
                        >
                          <div className={`overflow-hidden rounded-lg bg-white ${isActive ? 'ring-2 ring-brand-green' : 'ring-1 ring-black/5'}`}>
                            <LetterFrame template={t.id} size="thumb" />
                          </div>
                          <span className={`mt-2 block px-0.5 text-sm font-semibold ${isActive ? 'text-white' : 'text-brand-dark'}`}>
                            {t.name}
                          </span>
                          <span className={`mt-0.5 block px-0.5 text-[11px] leading-snug ${isActive ? 'text-white/60' : 'text-brand-dark/45'}`}>
                            {t.subtitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop: vertical rail list */}
                <div className="relative hidden lg:block">
                  {COVER_LETTER_TEMPLATES.map((t) => {
                    const isActive = t.id === template;
                    return (
                      <button
                        key={t.id}
                        ref={(el) => { templateRows.current[t.id] = el; }}
                        data-template={t.id}
                        onClick={() => {
                          manualLock.current = Date.now() + 1200;
                          setTemplate(t.id);
                        }}
                        aria-pressed={isActive}
                        className="group relative flex w-full flex-col items-start py-4 pl-6 text-left cursor-pointer"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-border" />
                        {isActive && (
                          <motion.span
                            layoutId="template-rail"
                            initial={false}
                            className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-green"
                            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                          />
                        )}
                        <span className={`text-xl font-semibold tracking-tight transition-colors ${isActive ? 'text-brand-dark' : 'text-brand-dark/40 group-hover:text-brand-dark/60'}`}>
                          {t.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(startPath)}
                  className="mt-8 hidden lg:inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-sm font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover cursor-pointer"
                >
                  Get started for free
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Sticky live preview */}
              <div className="flex flex-col items-center self-start lg:sticky lg:top-20">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={template}
                    initial={hydrating ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl bg-brand-bg border border-brand-border p-3 shadow-sm"
                  >
                    <LetterFrame template={template} size="lg" />
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {activeTemplate.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-brand-border bg-white px-2 py-0.5 text-[11px] font-medium text-brand-dark/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="mt-10 flex justify-center lg:hidden">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(startPath)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-sm font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover cursor-pointer"
              >
                Get started for free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="relative py-24 md:py-32 bg-brand-bg border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={hydrating ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeInUp}
              className="text-center mb-14"
            >
              <Badge chip="How it works">Three steps, one page</Badge>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mt-5 text-balance">
                From job post to ready-to-send in minutes
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={hydrating ? false : 'hidden'}
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeInUp}
                  transition={{ delay: i * 0.08 }}
                  className="relative rounded-xl bg-white border border-brand-border p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-dark/70 bg-brand-bg border border-brand-border px-2.5 py-1 rounded-lg">
                      {step.icon}
                      {`Step ${i + 1}`}
                    </span>
                    <span className="text-[30px] font-bold leading-none text-brand-dark/10 tabular-nums">
                      {`0${i + 1}`}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-brand-dark mt-4">{step.title}</h3>
                  <p className="text-sm text-brand-dark/60 mt-2 leading-relaxed">{step.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <PublicVisualCta
          badge="JD-Matched Cover Letters"
          badgeIcon={<Sparkles className="w-3.5 h-3.5 text-brand-green" />}
          headline={<>Your next application<br className="hidden sm:inline" /> deserves a better letter.</>}
          sub={<>Start free, write a compelling, tailored letter in minutes,<br className="hidden sm:inline" /> and export in PDF or Word whenever you are ready.</>}
          ctaLabel="Write my cover letter"
          onCta={() => navigate(startPath)}
          trustBullets={[
            'Tuned to exact JD keywords',
            'PDF & DOCX download',
            'Executive & modern templates'
          ]}
        />
      </main>

      <PublicFooter />
    </div>
  );
}
