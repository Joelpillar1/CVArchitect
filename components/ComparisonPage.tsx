import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHydrating } from '../contexts/HydrationContext';
import { ArrowRight, ExternalLink } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import {
  COMPARISON_VERIFIED,
  COMPARISON_VERIFIED_ISO,
  COMPETITORS,
  getCompetitor,
} from '../utils/comparisonData';
import {
  BulletList,
  CompareBadge,
  ComparisonTable,
  CtaBand,
  FaqList,
  SectionHeading,
  fadeInUp,
} from './CompareShared';

const BASE_URL = 'https://cvarchitect.app';

export default function ComparisonPage() {
  const hydrating = useHydrating();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const competitor = slug ? getCompetitor(slug) : undefined;

  if (!competitor) {
    return <Navigate to="/compare" replace />;
  }

  const startPath = user ? '/dashboard' : '/signup';
  const path = `/compare/${competitor.slug}`;
  const title = `Cvarchitect vs ${competitor.name} (2026): Price and Free Plan Compared`;
  const description = `${competitor.name} vs Cvarchitect: ${competitor.verdict} Compare free plans, pricing, and job-post tailoring. Verified ${COMPARISON_VERIFIED}.`;

  const others = COMPETITORS.filter((item) => item.slug !== competitor.slug);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: `${BASE_URL}/compare` },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Cvarchitect vs ${competitor.name}`,
          item: `${BASE_URL}${path}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}${path}`,
      url: `${BASE_URL}${path}`,
      name: title,
      dateModified: COMPARISON_VERIFIED_ISO,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: competitor.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO title={title} description={description} canonicalPath={path} jsonLd={jsonLd} />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        {/* ─── HERO ─── */}
        <section aria-label="Comparison overview" className="relative pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={hydrating ? false : 'hidden'} animate="visible" variants={fadeInUp} className="flex flex-col items-center">
              <div className="mb-6">
                <CompareBadge chip="Compare">{`Verified ${COMPARISON_VERIFIED}`}</CompareBadge>
              </div>

              <h1 className="text-[clamp(2rem,4.6vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-5 max-w-3xl">
                {'Cvarchitect vs '}
                <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                  {competitor.name}
                </span>
              </h1>

              <p className="text-base sm:text-lg font-medium text-brand-dark/75 max-w-2xl mx-auto leading-relaxed mb-3">
                {competitor.verdict}
              </p>
              <p className="text-xs sm:text-sm text-brand-dark/45 mb-8">
                {`${competitor.category}. Public pricing read in ${COMPARISON_VERIFIED}.`}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(startPath)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm sm:text-base font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover cursor-pointer"
                >
                  Try Cvarchitect free
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <a
                  href={competitor.pricingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-brand-dark shadow-xs transition-colors hover:bg-brand-secondary"
                >
                  {`See ${competitor.name} pricing`}
                  <ExternalLink className="w-3.5 h-3.5 text-brand-dark/40" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── SHORT ANSWER ─── */}
        <section id="short-answer" aria-label="The short answer" className="relative pb-14 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-3">
                The short answer
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-brand-dark/80">{competitor.shortAnswer}</p>
            </div>
          </div>
        </section>

        {/* ─── TABLE ─── */}
        <section id="side-by-side" aria-label="Side by side comparison" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Side by side"
              title={`Cvarchitect and ${competitor.name}, row by row`}
              description={`Everything below comes from each product's public pricing page. Checked ${COMPARISON_VERIFIED}.`}
            />
            <div className="mt-8">
              <ComparisonTable rows={competitor.rows} competitorName={competitor.name} />
            </div>
          </div>
        </section>

        {/* ─── STRENGTHS ─── */}
        <section id="strengths" aria-label="Where each tool wins" className="relative py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Where each one wins"
              title="No tool wins every row"
              description="If a comparison page claims otherwise, it is an ad, not a comparison."
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <section aria-label={`Where ${competitor.name} is stronger`} className="rounded-2xl border border-brand-border bg-white p-6 sm:p-7">
                <h3 className="text-base sm:text-lg font-bold text-brand-dark mb-4">
                  {`Where ${competitor.name} is stronger`}
                </h3>
                <BulletList items={competitor.theyWin} />
              </section>
              <section aria-label="Where Cvarchitect is stronger" className="rounded-2xl border border-brand-border bg-white p-6 sm:p-7">
                <h3 className="text-base sm:text-lg font-bold text-brand-dark mb-4">Where Cvarchitect is stronger</h3>
                <BulletList items={competitor.weWin} tone="positive" />
              </section>
            </div>
          </div>
        </section>

        {/* ─── CHOOSE ─── */}
        <section id="decision" aria-label="Decision guide" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Decision" title="Which one should you pick?" />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <section aria-label={`Pick ${competitor.name} if`} className="rounded-2xl border border-brand-border bg-brand-bg p-6 sm:p-7">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-2">
                  {`Pick ${competitor.name} if`}
                </h3>
                <BulletList items={competitor.chooseThem} />
              </section>
              <section aria-label="Pick Cvarchitect if" className="rounded-2xl border border-brand-dark/15 bg-brand-dark p-6 sm:p-7 text-white">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/50 mb-2">
                  Pick Cvarchitect if
                </h3>
                <ul className="space-y-3">
                  {competitor.chooseUs.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" aria-label="Frequently asked questions" className="relative py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Questions" title={`${competitor.name} vs Cvarchitect, answered`} />
            <div className="mt-8">
              <FaqList faqs={competitor.faqs} />
            </div>
          </div>
        </section>

        <CtaBand
          headline={<>Tailor one resume<br className="hidden sm:inline" /> to one job, free.</>}
          sub={<>10 AI rewrites and 3 PDF exports, no credit card.<br className="hidden sm:inline" /> Upgrade only if you want unlimited.</>}
          ctaLabel="Start free"
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

        {/* ─── METHOD + RELATED ─── */}
        <section id="methodology" aria-label="Comparison methodology and related links" className="relative py-14 md:py-16 bg-white border-t border-brand-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <section aria-labelledby="methodology-heading">
                <h2 id="methodology-heading" className="text-sm font-bold uppercase tracking-wider text-brand-dark/45 mb-3">How we compare</h2>
                <p className="text-sm leading-relaxed text-brand-dark/65">
                  {`We read each product's public pricing page in ${COMPARISON_VERIFIED} and record only what is stated there. We do not accept payment for placement, and we publish the rows where Cvarchitect loses. Prices change, so confirm on ${competitor.name}'s pricing page before you buy.`}
                </p>
              </section>
              <nav aria-labelledby="other-comparisons-heading">
                <h2 id="other-comparisons-heading" className="text-sm font-bold uppercase tracking-wider text-brand-dark/45 mb-3">
                  Other comparisons
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/compare/${item.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark/70 hover:text-brand-dark hover:underline"
                      >
                        {`Cvarchitect vs ${item.name}`}
                        <ArrowRight className="w-3.5 h-3.5 text-brand-dark/30" />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/best-ai-resume-builders"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark/70 hover:text-brand-dark hover:underline"
                    >
                      Best AI resume builders
                      <ArrowRight className="w-3.5 h-3.5 text-brand-dark/30" />
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
