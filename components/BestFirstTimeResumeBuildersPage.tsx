import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Lightbulb,
  ListChecks,
  PenLine,
  Search,
  ShieldCheck,
  Target,
} from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { useHydrating } from '../contexts/HydrationContext';
import { useAuth } from '../contexts/AuthContext';
import { COMPARISON_VERIFIED, getCompetitor } from '../utils/comparisonData';
import {
  FIRST_RESUME_BULLET_EXAMPLES,
  FIRST_RESUME_CHECKLIST,
  FIRST_RESUME_MISTAKES,
  FIRST_RESUME_SECTIONS,
  FIRST_RESUME_WEEK_PLAN,
  FIRST_TIME_FAQS,
  FIRST_TIME_PICKS,
} from '../utils/firstTimeResumeData';
import type { FirstTimePick } from '../utils/firstTimeResumeData';
import { CompareBadge, CtaBand, FaqList, SectionHeading, fadeInUp } from './CompareShared';

const BASE_URL = 'https://cvarchitect.app';
const PAGE_UPDATED_ISO = '2026-10-23';

const CVARCHITECT_DETAILS = {
  freePlan: '1 resume analysis, 10 AI rewrites, 3 PDF exports',
  entryPrice: '$10 per month, or $99 once',
  lifetime: '$99',
  strongestAt: 'Guided first draft plus job-specific rewrite',
};

const SECTION_IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  contact: { width: 1460, height: 175 },
  education: { width: 3955, height: 765 },
  experience: { width: 3955, height: 1580 },
  projects: { width: 3955, height: 535 },
  leadership: { width: 1460, height: 670 },
  skills: { width: 3955, height: 635 },
};

const FREE_PLAN_CHECKS = [
  {
    title: 'Can you export a PDF?',
    detail:
      'Some free plans allow you to build a resume but limit downloads to TXT. Check the export before you spend time editing.',
  },
  {
    title: 'Is there a watermark?',
    detail:
      'A watermark can make a first resume look unfinished. Preview the downloaded file, not just the editor.',
  },
  {
    title: 'Does the trial auto-renew?',
    detail:
      'A low trial price can renew at a much higher monthly rate. Read the renewal price and the cancellation window.',
  },
  {
    title: 'Are AI rewrites included?',
    detail:
      'A free template is not the same as a free rewrite. Check how many analyses or AI actions you get before the paywall.',
  },
  {
    title: 'Can you write a cover letter too?',
    detail:
      'Some plans include matching cover letters, and some charge separately. If you need both documents, compare the bundle.',
  },
  {
    title: 'Is there a one-time option?',
    detail:
      'If you only need one resume for one application, a lifetime or one-time pass can be cheaper than three months of a subscription.',
  },
];

function getPickDetails(pick: FirstTimePick) {
  if (!pick.slug) {
    return {
      name: 'Cvarchitect',
      key: 'cvarchitect',
      href: pick.href,
      freePlan: CVARCHITECT_DETAILS.freePlan,
      entryPrice: CVARCHITECT_DETAILS.entryPrice,
      lifetime: CVARCHITECT_DETAILS.lifetime,
      strongestAt: CVARCHITECT_DETAILS.strongestAt,
    };
  }

  const competitor = getCompetitor(pick.slug);
  if (!competitor) {
    throw new Error(`Missing comparison data for ${pick.slug}`);
  }

  return {
    name: competitor.name,
    key: competitor.slug,
    href: `/compare/${competitor.slug}`,
    freePlan: competitor.freePlan,
    entryPrice: competitor.entryPrice,
    lifetime: competitor.lifetime,
    strongestAt: pick.bestFor,
  };
}

const FIRST_TIME_TABLE_ROWS = FIRST_TIME_PICKS.map((pick) => ({
  ...getPickDetails(pick),
  bestFor: pick.bestFor,
}));

function ArticleFigure({
  src,
  alt,
  caption,
  width,
  height,
  aspect,
  fit = 'contain',
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  aspect: string;
  fit?: 'contain' | 'cover';
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div
        className="overflow-hidden rounded-xl border border-brand-border bg-white"
        style={{ aspectRatio: aspect }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      </div>
      {caption ? (
        <figcaption className="mt-2.5 text-xs leading-relaxed text-brand-dark/50">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export default function BestFirstTimeResumeBuildersPage() {
  const hydrating = useHydrating();
  const navigate = useNavigate();
  const { user } = useAuth();
  const startPath = user ? '/dashboard' : '/signup?redirect=/dashboard';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Best resume builders for first-time writers',
          item: `${BASE_URL}/best-resume-builders-for-first-time-writers`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}/best-resume-builders-for-first-time-writers`,
      url: `${BASE_URL}/best-resume-builders-for-first-time-writers`,
      name: 'Best Resume Builders for First-Time Writers in 2026',
      description:
        'Five resume builders for first-time writers compared by guided drafting, student templates, step-by-step prompts, job-search workflow, and examples.',
      datePublished: PAGE_UPDATED_ISO,
      dateModified: PAGE_UPDATED_ISO,
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/Student/Reume%20Sample%20Feature.png`,
        width: 1200,
        height: 630,
      },
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${BASE_URL}/best-resume-builders-for-first-time-writers#article`,
      headline: 'Best Resume Builders for First-Time Writers in 2026',
      description:
        'A detailed first-resume guide with five builder picks, a section-by-section checklist, weak-to-strong bullet examples, ATS rules, and a 7-day plan.',
      image: [`${BASE_URL}/images/Student/Reume%20Sample%20Feature.png`],
      datePublished: PAGE_UPDATED_ISO,
      dateModified: PAGE_UPDATED_ISO,
      author: { '@type': 'Organization', name: 'Cvarchitect', url: BASE_URL },
      publisher: { '@type': 'Organization', name: 'Cvarchitect', url: BASE_URL },
      mainEntityOfPage: {
        '@id': `${BASE_URL}/best-resume-builders-for-first-time-writers`,
      },
      articleSection: 'Resume builders',
      isPartOf: { '@id': `${BASE_URL}/#website` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Best resume builders for first-time writers in 2026',
      itemListElement: FIRST_TIME_PICKS.map((pick, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: pick.name,
        url: `${BASE_URL}${pick.href}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FIRST_TIME_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO
        title="Best Resume Builders for First-Time Writers (2026)"
        description={`Five first-resume builders compared by guided drafting, student templates, and examples, plus a checklist, ATS rules, and a 7-day plan. Verified ${COMPARISON_VERIFIED}.`}
        canonicalPath="/best-resume-builders-for-first-time-writers"
        ogImage={`${BASE_URL}/images/Student/Reume%20Sample%20Feature.png`}
        jsonLd={jsonLd}
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        <section aria-label="Overview" className="relative pb-12 md:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            <motion.div
              initial={hydrating ? false : 'hidden'}
              animate="visible"
              variants={fadeInUp}
            >
              <div className="mb-6">
                <CompareBadge chip="2026 guide">{`Verified ${COMPARISON_VERIFIED}`}</CompareBadge>
              </div>
              <h1 className="text-[clamp(2.15rem,5vw,4.1rem)] font-bold tracking-[-0.04em] leading-[0.98] text-brand-dark mb-5 max-w-3xl">
                <span className="block">Best resume builders for</span>
                <span className="block underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                  first-time writers
                </span>
              </h1>
              <p className="text-base sm:text-lg text-brand-dark/60 max-w-2xl leading-relaxed">
                You do not need a long work history to write a strong first resume. You need a builder that turns
                coursework, part-time jobs, projects, and volunteering into evidence a recruiter can use.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(startPath)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-dark px-6 py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-brand-dark/90 cursor-pointer"
                >
                  Start my first resume
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#the-picks"
                  className="inline-flex items-center justify-center rounded-xl border border-brand-border bg-white px-6 py-3 text-sm sm:text-base font-semibold text-brand-dark transition-colors hover:bg-brand-bg"
                >
                  See the five picks
                </a>
              </div>
              <p className="mt-4 text-xs font-medium text-brand-dark/40">
                Updated October 2026. Pricing read from each provider's public page.
              </p>
            </motion.div>

            <motion.div
              initial={hydrating ? false : 'hidden'}
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: hydrating ? 0 : 0.08 }}
            >
              <ArticleFigure
                src="/images/Student/Reume Sample Feature.png"
                alt="First resume sample with education, experience, leadership, and skills sections"
                caption="A first resume can lead with education, projects, and part-time work instead of a long employment history."
                width={1200}
                height={630}
                aspect="1200 / 630"
                fit="cover"
                priority
                className="rounded-2xl"
              />
            </motion.div>
          </div>
        </section>

        <section aria-label="Short answer" className="relative pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark" aria-hidden="true" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brand-dark">The short answer</h2>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-dark/70">
                    For a guided first draft that turns your real experience into a job-specific resume, Cvarchitect is
                    the strongest pick. Kickresume is best for design-led students, Zety for step-by-step prompts, Teal
                    for applying to many roles, and Resume.io for browsing examples before you start.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="at-a-glance" aria-label="At a glance" className="relative pb-14 md:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="At a glance"
              title="Free plan, paid entry, and one-time option"
              description={`Pricing read from each provider's public page in ${COMPARISON_VERIFIED}.`}
            />
            <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <caption className="sr-only">First-time resume builder comparison table</caption>
                <thead>
                  <tr className="border-b border-brand-border">
                    <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Tool
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Best for
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Free plan
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Paid entry
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      One-time option
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FIRST_TIME_TABLE_ROWS.map((row) => (
                    <tr
                      key={row.key}
                      className={`border-b border-brand-border/70 align-top ${
                        row.key === 'cvarchitect' ? 'bg-brand-green/[0.08]' : ''
                      }`}
                    >
                      <th scope="row" className="py-3.5 pr-4 font-bold text-brand-dark">
                        {row.key === 'cvarchitect' ? (
                          row.name
                        ) : (
                          <Link to={row.href} className="font-semibold text-brand-dark/85 hover:underline">
                            {row.name}
                          </Link>
                        )}
                      </th>
                      <td className="py-3.5 px-3 text-brand-dark/75">{row.bestFor}</td>
                      <td className="py-3.5 px-3 text-brand-dark/75">{row.freePlan}</td>
                      <td className="py-3.5 px-3 text-brand-dark/75">{row.entryPrice}</td>
                      <td className="py-3.5 px-3 text-brand-dark/75">{row.lifetime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="how-we-picked" aria-label="How we picked" className="relative pb-14 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-4">
                How we picked
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed text-brand-dark/75">
                <li className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark/50" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-brand-dark">Built for a first resume.</strong> We weighted
                    guided drafting, student examples, free export, and ATS-safe layouts more heavily than advanced
                    features a first-time writer will not use.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark/50" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-brand-dark">Public pricing only.</strong>{` Every price below was read from the provider's own pricing page in ${COMPARISON_VERIFIED}.`}
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark/50" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-brand-dark">One category per tool.</strong> No single winner.
                    The picks solve different first-resume problems, and we publish the trade-offs.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark/50" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-brand-dark">Disclosure.</strong> Cvarchitect is our product. It
                    appears in the category it wins, and the other four picks are here because they are genuinely
                    useful for a first-time writer.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="the-picks"
          aria-label="The five picks"
          className="relative py-14 md:py-20 bg-white border-y border-brand-border"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The picks"
              title="Five tools, five first-resume jobs"
              description="Each pick is here for a different reason. Start with the job you need the tool to do."
            />

            <div className="mt-8 space-y-5">
              {FIRST_TIME_PICKS.map((pick, index) => {
                const details = getPickDetails(pick);
                return (
                  <article
                    key={pick.name}
                    className="rounded-2xl border border-brand-border bg-brand-bg p-6 sm:p-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-8">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-3xl font-bold text-brand-dark/20">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-dark/45">
                            {pick.award.replace('Best for ', '')}
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl sm:text-2xl font-bold text-brand-dark">{pick.name}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-brand-dark/70">{pick.summary}</p>
                        <div className="mt-5 flex items-center gap-2">
                          {pick.slug ? (
                            <Link
                              to={pick.href}
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-dark hover:underline"
                            >
                              {`Compare ${pick.name}`}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          ) : (
                            <button
                              onClick={() => navigate(startPath)}
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-dark hover:underline cursor-pointer"
                            >
                              Start my first resume
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-brand-border bg-white p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">Free plan</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-brand-dark/75">{details.freePlan}</p>
                        </div>
                        <div className="rounded-xl border border-brand-border bg-white p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">Paid entry</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-brand-dark/75">{details.entryPrice}</p>
                        </div>
                        <div className="rounded-xl border border-brand-border bg-white p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">One-time</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-brand-dark/75">{details.lifetime}</p>
                        </div>
                        <div className="sm:col-span-3 rounded-xl border border-brand-border bg-white p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">Best for</p>
                          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-brand-dark/85">
                            {pick.bestFor}
                          </p>
                        </div>
                        <div className="sm:col-span-3 rounded-xl border border-brand-green/30 bg-brand-green/[0.08] p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/45">
                            Why it works for a first resume
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-brand-dark/75">{pick.whyItWorks}</p>
                        </div>
                        <div className="sm:col-span-3 rounded-xl border border-brand-border bg-white p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">Watch out</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-brand-dark/70">{pick.watchOut}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="what-a-first-resume-needs" aria-label="What a first resume needs" className="relative py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The document"
              title="What a first resume actually needs"
              description="A first resume is not a shorter version of a ten-year resume. It is a different document. Lead with the evidence you have."
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {FIRST_RESUME_SECTIONS.map((section) => {
                const size = SECTION_IMAGE_SIZES[section.id] ?? { width: 1200, height: 630 };
                return (
                  <article key={section.id} className="rounded-2xl border border-brand-border bg-white p-5 sm:p-6">
                    <ArticleFigure
                      src={section.image}
                      alt={section.imageAlt}
                      caption={section.imageCaption}
                      width={size.width}
                      height={size.height}
                      aspect={section.aspect}
                      className="mb-4"
                    />
                    <h3 className="text-lg font-bold text-brand-dark">{section.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-dark/65">{section.description}</p>
                    <ul className="mt-3 space-y-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-sm leading-relaxed text-brand-dark/70">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark/40" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center rounded-2xl border border-brand-border bg-white p-5 sm:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-brand-dark/50" aria-hidden="true" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark/50">Optional summary</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-brand-dark/70">
                  A summary is optional on a first resume. If you use one, keep it to two or three lines and make it
                  specific. Replace "hardworking student" with the degree, the relevant project, and the kind of role
                  you want.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-brand-dark/70">
                  Skip it when space is tight or when the top third of the page already shows your best evidence.
                </p>
              </div>
              <ArticleFigure
                src="/images/Student/Summary.png"
                alt="Example resume summary section with a short paragraph about a candidate's background and strengths"
                caption="A summary should add context, not repeat the rest of the page."
                width={3955}
                height={510}
                aspect="3955 / 510"
              />
            </div>
          </div>
        </section>

        <section
          id="turn-experience-into-bullets"
          aria-label="Turn experience into bullets"
          className="relative py-14 md:py-20 bg-white border-y border-brand-border"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The rewrite"
              title="Turn classwork, side jobs, and volunteering into experience"
              description="A first resume gets stronger when you describe the work, not the job title. Use the same formula for every entry."
            />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Search,
                  title: 'Name the situation',
                  detail: 'What was the task, project, or problem? Give the reader enough context to understand the work.',
                },
                {
                  icon: PenLine,
                  title: 'Show the action',
                  detail: 'What did you actually do? Start with a verb and name the tools, people, or process you used.',
                },
                {
                  icon: Target,
                  title: 'Add the result',
                  detail: 'What changed? Use a number, a deadline, a grade, a customer outcome, or a concrete deliverable.',
                },
              ].map((step) => (
                <div key={step.title} className="rounded-2xl border border-brand-border bg-brand-bg p-5">
                  <step.icon className="h-5 w-5 text-brand-dark/55" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-bold text-brand-dark">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/65">{step.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <caption className="sr-only">Weak and strong first-resume bullet examples</caption>
                <thead>
                  <tr className="border-b border-brand-border">
                    <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Before
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Stronger bullet
                    </th>
                    <th scope="col" className="py-3 pl-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FIRST_RESUME_BULLET_EXAMPLES.map((example) => (
                    <tr key={example.before} className="border-b border-brand-border/70 align-top">
                      <td className="py-3.5 pr-4 text-brand-dark/55">{example.before}</td>
                      <td className="py-3.5 px-3 font-medium text-brand-dark/85">{example.after}</td>
                      <td className="py-3.5 pl-3 text-xs text-brand-dark/45">{example.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 rounded-2xl border border-brand-border bg-brand-bg p-6">
              <h3 className="text-sm font-bold text-brand-dark">Where to find evidence when you think you have none</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Course projects',
                  'Part-time jobs',
                  'Volunteering',
                  'Student clubs',
                  'Sports teams',
                  'Side projects',
                  'Freelance work',
                  'Caregiving',
                  'Competitions',
                  'Certifications',
                  'Languages',
                  'Community work',
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-dark/65"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="ats-rules" aria-label="ATS rules for first resumes" className="relative py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start">
            <div>
              <SectionHeading
                eyebrow="The layout"
                title="ATS rules for first resumes"
                description="Most first resumes are read by software before a person sees them. A clean structure matters more than a decorative template."
              />

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: FileText,
                    title: 'One column',
                    detail: 'Keep the core text in one column. Sidebars and text boxes can scramble the reading order.',
                  },
                  {
                    icon: GraduationCap,
                    title: 'Standard headings',
                    detail: 'Use Education, Experience, Projects, and Skills. Creative headings can confuse the parser.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Selectable text',
                    detail: 'Export a PDF, select the text, and paste it into a plain editor. If it comes out as an image, the ATS may not read it.',
                  },
                  {
                    icon: Search,
                    title: 'Honest keywords',
                    detail: 'Use the job post language where it is true. Put the terms in projects, experience, education, and skills.',
                  },
                ].map((rule) => (
                  <div key={rule.title} className="rounded-2xl border border-brand-border bg-white p-5">
                    <rule.icon className="h-5 w-5 text-brand-dark/55" aria-hidden="true" />
                    <h3 className="mt-3 text-sm font-bold text-brand-dark">{rule.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-dark/65">{rule.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-brand-border bg-white p-6">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-brand-dark/55" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-brand-dark">First-resume checklist</h3>
                </div>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                  {FIRST_RESUME_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-brand-dark/70">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark/40" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:pt-10">
              <ArticleFigure
                src="/images/Student/Reume Sample.png"
                alt="Full one-page first resume sample with contact details, education, experience, leadership, and skills sections"
                caption="Use the structure, not the placeholder text. One column, standard headings, and selectable text make the page easier to parse."
                width={1460}
                height={2270}
                aspect="1460 / 2270"
              />
            </div>
          </div>
        </section>

        <section
          id="free-plan-checks"
          aria-label="Free plan checks"
          className="relative py-14 md:py-20 bg-white border-y border-brand-border"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Before you pay"
              title="Six free-plan traps first-time writers should check"
              description="A free plan is only useful if you can leave with the file you need. Check these before you invest an hour in a draft."
            />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FREE_PLAN_CHECKS.map((check, index) => (
                <div key={check.title} className="rounded-2xl border border-brand-border bg-brand-bg p-5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-brand-dark/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-bold text-brand-dark">{check.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/65">{check.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="seven-day-plan" aria-label="Seven day plan" className="relative py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The plan"
              title="Write your first resume in seven days"
              description="One focused task per day. By the end, you have a tailored one-page resume and one application sent."
            />
            <ol className="mt-8 space-y-3">
              {FIRST_RESUME_WEEK_PLAN.map((day, index) => (
                <li
                  key={day.day}
                  className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 rounded-2xl border border-brand-border bg-white p-5 sm:p-6"
                >
                  <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:w-20">
                    <span className="font-mono text-lg font-bold text-brand-dark/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">{day.day}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-dark">{day.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-dark/65">{day.detail}</p>
                    <p className="mt-2 text-xs font-semibold text-brand-dark/45">{`Output: ${day.output}`}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="mistakes"
          aria-label="First resume mistakes"
          className="relative py-14 md:py-20 bg-white border-y border-brand-border"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The cleanup"
              title="Eight first-resume mistakes to fix before you apply"
              description="Most first drafts have the same problems. Fix these before you spend time on design."
            />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {FIRST_RESUME_MISTAKES.map((item) => (
                <article key={item.mistake} className="rounded-2xl border border-brand-border bg-brand-bg p-5">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark/45" aria-hidden="true" />
                    <h3 className="text-sm font-bold leading-relaxed text-brand-dark">{item.mistake}</h3>
                  </div>
                  <p className="mt-2 pl-6 text-sm leading-relaxed text-brand-dark/65">{`Fix: ${item.fix}`}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" aria-label="Frequently asked questions" className="relative py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Questions" title="First resume questions, answered" />
            <div className="mt-8">
              <FaqList faqs={FIRST_TIME_FAQS} />
            </div>
          </div>
        </section>

        <section
          id="related"
          aria-label="Related first-resume guides"
          className="relative py-14 md:py-20 bg-white border-y border-brand-border"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Keep going"
              title="Related first-resume guides"
              description="The listicle is the starting point. These guides go deeper on the sections, keywords, and examples."
            />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  href: '/blog/how-to-make-a-resume-for-your-first-job-2026',
                  title: 'How to make a resume for your first job',
                  detail: 'A step-by-step walkthrough with first-job examples and a section-by-section checklist.',
                },
                {
                  href: '/blog/student-resume-no-experience-guide',
                  title: 'Student resume with no experience',
                  detail: 'How to use coursework, projects, clubs, and volunteering when paid work is thin.',
                },
                {
                  href: '/blog/how-to-write-a-cv-with-no-experience-2026',
                  title: 'How to write a CV with no experience',
                  detail: 'A no-experience guide for international applicants and first-time CV writers.',
                },
                {
                  href: '/blog/ats-keywords-master-list-2026',
                  title: 'ATS keywords master list',
                  detail: 'Industry keyword lists and a safe way to use them without keyword stuffing.',
                },
                {
                  href: '/resume-templates',
                  title: 'Resume templates',
                  detail: 'ATS-ready layouts by career stage, including first-resume and student options.',
                },
                {
                  href: '/best-ai-resume-builders',
                  title: 'Best AI resume builders',
                  detail: 'The broader builder comparison if you want to compare the full market first.',
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group rounded-2xl border border-brand-border bg-brand-bg p-5 transition-colors hover:border-brand-dark/25"
                >
                  <BookOpen className="h-4 w-4 text-brand-dark/40" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-bold text-brand-dark group-hover:underline">{link.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">{link.detail}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CtaBand
          badge="Built for first-time writers"
          headline={
            <>
              <span className="block">Your first resume does not need</span>
              <span className="block">a long work history.</span>
            </>
          }
          sub={
            <>
              It needs evidence, a clean layout, and one target job. Start with the free plan and see what Cvarchitect can
              build from what you already have.
            </>
          }
          ctaLabel="Start my first resume free"
          onCta={() => navigate(startPath)}
          secondary={
            <Link
              to="/compare"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm sm:text-base font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              Compare all tools
            </Link>
          }
        />
      </main>

      <PublicFooter />
    </div>
  );
}
