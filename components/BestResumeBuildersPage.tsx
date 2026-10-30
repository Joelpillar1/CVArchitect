import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHydrating } from '../contexts/HydrationContext';
import { ArrowRight } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import { BEST_PICKS, COMPARISON_VERIFIED, COMPARISON_VERIFIED_ISO, COMPETITORS } from '../utils/comparisonData';
import { CompareBadge, CtaBand, FaqList, SectionHeading, fadeInUp } from './CompareShared';

const BASE_URL = 'https://cvarchitect.app';

// The listicle is deliberately five picks. New comparison pages can be added
// without forcing a sixth award or a sixth row into this table.
const LISTICLE_COMPETITORS = COMPETITORS.filter((competitor) =>
  BEST_PICKS.some((pick) => pick.slug === competitor.slug),
);

const FAQS = [
  {
    q: 'What is the best AI resume builder in 2026?',
    a: 'It depends on what you are optimising for. Cvarchitect is the strongest for rewriting a resume against a specific job posting, with 10 free AI rewrites and unlimited use at $10 per month. Teal is strongest for managing a full job search. Rezi adds a live AI mock interview and a one-time payment. Kickresume is strongest for design. Resume.io is strongest for browsing examples before you write.',
  },
  {
    q: 'Are AI resume builders worth paying for?',
    a: 'They are worth paying for if you apply to more than a handful of roles and tailor each resume. The time saved rewriting bullet points and matching keywords usually exceeds the subscription cost. If you apply to one or two roles, the free tiers are enough.',
  },
  {
    q: 'Do AI resume builders pass ATS screening?',
    a: 'The builder does not decide that, the resume format and content do. All five tools here produce ATS-readable documents, but a single-column layout, standard section headings, and keywords taken from the job posting matter more than which tool you use.',
  },
  {
    q: 'Which AI resume builder has the best free plan?',
    a: 'Kickresume allows unlimited downloads on four free templates. Cvarchitect allows 3 free PDF exports plus 10 AI rewrites. Teal gives 10 AI credits and unlimited job tracking. Resume.io free accounts can only download TXT, and Rezi free accounts get 3 PDF downloads.',
  },
];

export default function BestResumeBuildersPage() {
  const hydrating = useHydrating();
  const navigate = useNavigate();
  const { user } = useAuth();
  const startPath = user ? '/dashboard' : '/signup';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Best AI resume builders',
          item: `${BASE_URL}/best-ai-resume-builders`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}/best-ai-resume-builders`,
      url: `${BASE_URL}/best-ai-resume-builders`,
      name: 'Best AI Resume Builders in 2026',
      dateModified: COMPARISON_VERIFIED_ISO,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Best AI resume builders in 2026',
      itemListElement: BEST_PICKS.map((pick, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: pick.name,
        url: `${BASE_URL}${pick.href}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO
        title="Best AI Resume Builders in 2026: Compared"
        description={`Five AI resume builders compared by what they are actually good at: job-post tailoring, job tracking, ATS scoring, design, and examples. Verified ${COMPARISON_VERIFIED}.`}
        canonicalPath="/best-ai-resume-builders"
        jsonLd={jsonLd}
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        {/* ─── HERO ─── */}
        <section aria-label="Overview" className="relative pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={hydrating ? false : 'hidden'} animate="visible" variants={fadeInUp} className="flex flex-col items-center">
              <div className="mb-6">
                <CompareBadge chip="2026 guide">{`Verified ${COMPARISON_VERIFIED}`}</CompareBadge>
              </div>
              <h1 className="text-[clamp(2rem,4.6vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-5 max-w-3xl">
                {'Best AI resume builders '}
                <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                  by use case
                </span>
              </h1>
              <p className="text-base sm:text-lg text-brand-dark/60 max-w-2xl mx-auto leading-relaxed">
                Five tools, five different jobs. We picked them by what they are actually good at, not by who paid for
                the list.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── HOW WE PICKED ─── */}
        <section id="how-we-picked" aria-label="How we picked" className="relative pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-4">
                How we picked
              </h2>
              <ul className="space-y-2.5 text-sm leading-relaxed text-brand-dark/75">
                <li>
                  <strong className="font-semibold text-brand-dark">Public pricing only.</strong>{` Every price below was read from the provider's own pricing page in ${COMPARISON_VERIFIED}.`}
                </li>
                <li>
                  <strong className="font-semibold text-brand-dark">One category per tool.</strong> No single winner,
                  because the tools solve different problems.
                </li>
                <li>
                  <strong className="font-semibold text-brand-dark">Disclosure.</strong> Cvarchitect is our product. It
                  appears in the category it wins, and we publish the categories where the other four are stronger.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── PICKS ─── */}
        <section id="the-picks" aria-label="The five picks" className="relative py-12 md:py-16 bg-white border-y border-brand-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="The picks" title="Five tools, five jobs" />

            <div className="mt-8 space-y-4">
              {BEST_PICKS.map((pick, index) => (
                <article
                  key={pick.name}
                  className="rounded-2xl border border-brand-border bg-brand-bg p-6 sm:p-7 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 md:items-center"
                >
                  <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1 md:w-16">
                    <span className="font-mono text-2xl font-bold text-brand-dark/20">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 md:leading-tight">
                      {pick.award.replace('Best for ', '')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-dark">{pick.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-dark/65">{pick.summary}</p>
                    <p className="mt-2 text-xs font-semibold text-brand-dark/45">
                      {`${pick.price}. Best for ${pick.bestFor.toLowerCase()}.`}
                    </p>
                  </div>

                  <div className="md:text-right">
                    {pick.slug ? (
                      <Link
                        to={pick.href}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-dark hover:underline"
                      >
                        Compare
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => navigate(startPath)}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-dark hover:underline cursor-pointer"
                      >
                        Try it free
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TABLE ─── */}
        <section id="comparison-table" aria-label="Comparison table" className="relative py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Side by side"
              title="All five, in one table"
              description={`Pricing read from each provider on ${COMPARISON_VERIFIED}.`}
            />

            <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                <caption className="sr-only">AI resume builder comparison table</caption>
                <thead>
                  <tr className="border-b border-brand-border">
                    <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Tool
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
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Strongest at
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-brand-border/70 bg-brand-green/[0.08] align-top">
                    <th scope="row" className="py-3.5 pr-4 font-bold text-brand-dark">
                      Cvarchitect
                    </th>
                    <td className="py-3.5 px-3 text-brand-dark/75">1 resume, all free templates, 10 AI rewrites, 3 PDF exports</td>
                    <td className="py-3.5 px-3 text-brand-dark/75">$10 per month, or $99 once</td>
                    <td className="py-3.5 px-3 text-brand-dark/75">$99</td>
                    <td className="py-3.5 px-3 text-brand-dark/75">Tailoring to a job posting</td>
                  </tr>
                  {LISTICLE_COMPETITORS.map((competitor) => (
                    <tr key={competitor.slug} className="border-b border-brand-border/70 align-top">
                      <th scope="row" className="py-3.5 pr-4 font-semibold text-brand-dark/85">
                        <Link to={`/compare/${competitor.slug}`} className="hover:underline">
                          {competitor.name}
                        </Link>
                      </th>
                      <td className="py-3.5 px-3 text-brand-dark/60">{competitor.freePlan}</td>
                      <td className="py-3.5 px-3 text-brand-dark/60">{competitor.entryPrice}</td>
                      <td className="py-3.5 px-3 text-brand-dark/60">{competitor.lifetime}</td>
                      <td className="py-3.5 px-3 text-brand-dark/60">{competitor.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" aria-label="Frequently asked questions" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Questions" title="Choosing an AI resume builder" />
            <div className="mt-8">
              <FaqList faqs={FAQS} />
            </div>
          </div>
        </section>

        <CtaBand
          headline={<>See the output before<br className="hidden sm:inline" /> you compare the pricing.</>}
          sub={<>10 AI rewrites and 3 PDF exports on the free plan.<br className="hidden sm:inline" /> No credit card required.</>}
          ctaLabel="Try Cvarchitect free"
          onCta={() => navigate(startPath)}
          secondary={
            <Link
              to="/compare"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm sm:text-base font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              All comparisons
            </Link>
          }
        />
      </main>

      <PublicFooter />
    </div>
  );
}
