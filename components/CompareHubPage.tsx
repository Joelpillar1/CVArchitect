import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHydrating } from '../contexts/HydrationContext';
import { ArrowRight } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import {
  COMPARISON_VERIFIED,
  COMPARISON_VERIFIED_ISO,
  COMPETITOR_COUNT,
  COMPETITOR_NAME_LIST,
  COMPETITORS,
} from '../utils/comparisonData';
import { CompareBadge, CtaBand, SectionHeading, fadeInUp } from './CompareShared';

const BASE_URL = 'https://cvarchitect.app';

const US = {
  freePlan: '1 resume, all free templates, 10 AI rewrites, 3 PDF exports',
  entryPrice: '$10 per month, or $99 once',
  lifetime: '$99 one-time',
  bestFor: 'First-time writers and anyone targeting a specific role',
};

export default function CompareHubPage() {
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
        { '@type': 'ListItem', position: 2, name: 'Compare', item: `${BASE_URL}/compare` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${BASE_URL}/compare`,
      name: 'Cvarchitect comparisons',
      description: `Side-by-side comparisons of Cvarchitect with ${COMPETITOR_NAME_LIST}.`,
      url: `${BASE_URL}/compare`,
      dateModified: COMPARISON_VERIFIED_ISO,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
      hasPart: COMPETITORS.map((competitor) => ({
        '@type': 'WebPage',
        name: `Cvarchitect vs ${competitor.name}`,
        url: `${BASE_URL}/compare/${competitor.slug}`,
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO
        title={`Compare Cvarchitect vs ${COMPETITOR_COUNT} resume and ATS tools`}
        description={`Side-by-side comparisons of Cvarchitect, ${COMPETITOR_NAME_LIST}. Free plans, pricing, and ATS checks, verified ${COMPARISON_VERIFIED}.`}
        canonicalPath="/compare"
        jsonLd={jsonLd}
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        <section className="relative pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={hydrating ? false : 'hidden'} animate="visible" variants={fadeInUp} className="flex flex-col items-center">
              <div className="mb-6">
                <CompareBadge chip="Compare">{`Verified ${COMPARISON_VERIFIED}`}</CompareBadge>
              </div>
              <h1 className="text-[clamp(2rem,4.6vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-5 max-w-3xl">
                {'Compare Cvarchitect '}
                <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                  honestly
                </span>
              </h1>
              <p className="text-base sm:text-lg text-brand-dark/60 max-w-2xl mx-auto leading-relaxed">
                {`${COMPETITOR_COUNT} head-to-head comparisons, built from each product's public pricing page. We include the rows where Cvarchitect loses.`}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── SUMMARY TABLE ─── */}
        <section className="relative py-12 md:py-16 bg-white border-y border-brand-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="At a glance"
              title="Free plan, paid entry, and one-time option"
              description={`Read from each provider's pricing page on ${COMPARISON_VERIFIED}.`}
            />

            <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <caption className="sr-only">{`Pricing comparison across Cvarchitect and ${COMPETITOR_COUNT} competitors`}</caption>
                <thead>
                  <tr className="border-b border-brand-border">
                    <th scope="col" className="w-[18%] py-3 pr-4 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
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
                      Best for
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-brand-border/70 bg-brand-green/[0.08] align-top">
                    <th scope="row" className="py-3.5 pr-4 font-bold text-brand-dark">
                      Cvarchitect
                    </th>
                    <td className="py-3.5 px-3 text-brand-dark/75">{US.freePlan}</td>
                    <td className="py-3.5 px-3 text-brand-dark/75">{US.entryPrice}</td>
                    <td className="py-3.5 px-3 text-brand-dark/75">{US.lifetime}</td>
                    <td className="py-3.5 px-3 text-brand-dark/75">{US.bestFor}</td>
                  </tr>
                  {COMPETITORS.map((competitor) => (
                    <tr key={competitor.slug} className="border-b border-brand-border/70 align-top">
                      <th scope="row" className="py-3.5 pr-4 font-semibold text-brand-dark/85">
                        <Link to={`/compare/${competitor.slug}`} className="hover:underline">
                          {competitor.name}
                        </Link>
                      </th>
                      <td className="py-3.5 px-3 text-brand-dark/60">{competitor.freePlan}</td>
                      <td className="py-3.5 px-3 text-brand-dark/60">{competitor.entryPrice}</td>
                      <td className="py-3.5 px-3 text-brand-dark/60">{competitor.lifetime}</td>
                      <td className="py-3.5 px-3 text-brand-dark/60">{competitor.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── CARDS ─── */}
        <section id="comparisons" aria-label="Head to head comparisons" className="relative py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Head to head" title="Pick the comparison you need" />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {COMPETITORS.map((competitor) => (
                <article key={competitor.slug} className="flex">
                  <Link
                    to={`/compare/${competitor.slug}`}
                    className="group flex flex-col w-full rounded-2xl border border-brand-border bg-white p-6 sm:p-7 transition-colors hover:border-brand-dark/25"
                  >
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/40 mb-2">
                      {competitor.category}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-brand-dark">
                      {`Cvarchitect vs ${competitor.name}`}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">{competitor.verdict}</p>
                    <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                      Read the comparison
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING INDEX ─── */}
        <section aria-label="Resume builder pricing index" className="relative pb-14 md:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/resume-builder-pricing-index"
              className="group flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-2xl border border-brand-border bg-white p-6 sm:p-7 transition-colors hover:border-brand-dark/25"
            >
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/40 mb-2">
                  Original data
                </p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-brand-dark">
                  Resume Builder Pricing Index 2026
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">
                  {`One dated dataset: free-plan limits, paid entry prices, and the cheapest 12-month cost for ${COMPETITOR_COUNT + 1} tools, every row sourced to the provider's own pricing page.`}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-brand-dark">
                Read the index
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </section>

        <CtaBand
          headline={<>Start with the<br className="hidden sm:inline" /> free plan.</>}
          sub={<>10 AI rewrites, 3 PDF exports, no credit card.<br className="hidden sm:inline" /> Compare the output before you compare the pricing.</>}
          ctaLabel="Try Cvarchitect free"
          onCta={() => navigate(startPath)}
          secondary={
            <Link
              to="/best-ai-resume-builders"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm sm:text-base font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              Best AI resume builders
            </Link>
          }
        />

        <section id="methodology" aria-labelledby="how-we-compare-heading" className="relative py-14 md:py-16 bg-white border-t border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="how-we-compare-heading" className="text-sm font-bold uppercase tracking-wider text-brand-dark/45 mb-3">How we compare</h2>
            <p className="text-sm leading-relaxed text-brand-dark/65">
              {`Every row comes from the provider's own public pricing page, read in ${COMPARISON_VERIFIED}. We do not accept payment for placement. We publish the categories where competitors are stronger, because a comparison that only goes one way is not useful to anyone deciding where to spend money. Prices and plans change, so confirm on the provider's site before you buy.`}
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
