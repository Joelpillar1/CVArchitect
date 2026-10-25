import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, ExternalLink } from 'lucide-react';
import { useHydrating } from '../contexts/HydrationContext';
import { useAuth } from '../contexts/AuthContext';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import CompareCostChart from './CompareCostChart';
import { CompareBadge, CtaBand, FaqList, SectionHeading, fadeInUp } from './CompareShared';
import { COMPARISON_VERIFIED, COMPARISON_VERIFIED_ISO, COMPETITORS } from '../utils/comparisonData';
import { COST_12_MONTHS, DEEP_VERIFIED } from '../utils/comparisonDeepData';
import {
  PRICING_INDEX_CHEAPEST,
  PRICING_INDEX_CVARCHITECT,
  PRICING_INDEX_FAQS,
  PRICING_INDEX_FINDINGS,
  PRICING_INDEX_FULL_TITLE,
  PRICING_INDEX_META_DESCRIPTION,
  PRICING_INDEX_META_TITLE,
  PRICING_INDEX_MOST_EXPENSIVE,
  PRICING_INDEX_PATH,
  PRICING_INDEX_ROWS,
  PRICING_INDEX_SHORT_ANSWER,
  PRICING_INDEX_SPREAD,
  PRICING_INDEX_TOOL_COUNT,
  formatUsd,
} from '../utils/pricingIndexData';

const BASE_URL = 'https://cvarchitect.app';
const PAGE_URL = `${BASE_URL}${PRICING_INDEX_PATH}`;
const CITATION = `Cvarchitect. "${PRICING_INDEX_FULL_TITLE}." ${DEEP_VERIFIED}. ${PAGE_URL}`;

export default function PricingIndexPage() {
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
        { '@type': 'ListItem', position: 2, name: PRICING_INDEX_FULL_TITLE, item: PAGE_URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': `${PAGE_URL}#dataset`,
      name: PRICING_INDEX_FULL_TITLE,
      alternateName: 'Resume builder and ATS checker cost dataset 2026',
      description:
        "Free-plan limits, paid entry prices, and the cheapest 12-month paid cost for seven resume and ATS tools, read from each provider's own public pricing page.",
      url: PAGE_URL,
      creator: { '@id': `${BASE_URL}/#organization` },
      publisher: { '@id': `${BASE_URL}/#organization` },
      datePublished: COMPARISON_VERIFIED_ISO,
      dateModified: COMPARISON_VERIFIED_ISO,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      isAccessibleForFree: true,
      keywords: [
        'resume builder pricing',
        'resume builder cost',
        'ATS checker pricing',
        'free resume builder',
        'resume builder comparison 2026',
      ],
      temporalCoverage: '2026',
      spatialCoverage: 'United States',
      measurementTechnique:
        "Manual review of each provider's public pricing page, recording free-plan limits, the cheapest paid entry, and the cheapest way to keep paid access for 12 months.",
      variableMeasured: [
        { '@type': 'PropertyValue', name: 'Free plan limits' },
        { '@type': 'PropertyValue', name: 'Paid entry price (USD)' },
        { '@type': 'PropertyValue', name: 'Cheapest 12-month paid cost (USD)' },
      ],
      citation: PRICING_INDEX_ROWS.map((row) => row.sourceUrl),
      isBasedOn: PRICING_INDEX_ROWS.map((row) => row.sourceUrl),
      distribution: [
        {
          '@type': 'DataDownload',
          encodingFormat: 'text/html',
          contentUrl: PAGE_URL,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: PRICING_INDEX_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO
        title={PRICING_INDEX_META_TITLE}
        description={PRICING_INDEX_META_DESCRIPTION}
        canonicalPath={PRICING_INDEX_PATH}
        jsonLd={jsonLd}
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        {/* ─── HERO ─── */}
        <section className="relative pb-10 md:pb-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={hydrating ? false : 'hidden'}
              animate="visible"
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="mb-6">
                <CompareBadge chip="Data">{`Verified ${COMPARISON_VERIFIED}`}</CompareBadge>
              </div>
              <h1 className="text-[clamp(2rem,4.6vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-5 max-w-3xl">
                {'Resume Builder Pricing Index '}
                <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">2026</span>
              </h1>
              <p className="text-base sm:text-lg text-brand-dark/60 max-w-2xl mx-auto leading-relaxed">
                {`What ${PRICING_INDEX_TOOL_COUNT} resume and ATS tools actually cost: the free plan, the paid entry price, and the cheapest honest way to stay paid up for a year. Every figure is read from the provider's own pricing page, not estimated.`}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── SHORT ANSWER ─── */}
        <section aria-labelledby="short-answer-heading" className="relative pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-4">
                <Database className="h-4 w-4 text-brand-dark/50" aria-hidden="true" />
                <h2
                  id="short-answer-heading"
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45"
                >
                  The short answer
                </h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-brand-dark/80">{PRICING_INDEX_SHORT_ANSWER}</p>
              <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-brand-border pt-6">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-dark/45">Tools reviewed</dt>
                  <dd className="mt-1 text-2xl font-bold text-brand-dark">{PRICING_INDEX_TOOL_COUNT}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-dark/45">Cheapest 12 months</dt>
                  <dd className="mt-1 text-2xl font-bold text-brand-dark">
                    {formatUsd(PRICING_INDEX_CHEAPEST.twelveMonthCost)}
                  </dd>
                  <dd className="text-xs text-brand-dark/50">{PRICING_INDEX_CHEAPEST.name}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-dark/45">Cvarchitect</dt>
                  <dd className="mt-1 text-2xl font-bold text-brand-dark">
                    {formatUsd(PRICING_INDEX_CVARCHITECT.twelveMonthCost)}
                  </dd>
                  <dd className="text-xs text-brand-dark/50">paid once</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-dark/45">Full spread</dt>
                  <dd className="mt-1 text-2xl font-bold text-brand-dark">{formatUsd(PRICING_INDEX_SPREAD)}</dd>
                  <dd className="text-xs text-brand-dark/50">cheapest to priciest</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ─── KEY FINDINGS ─── */}
        <section aria-labelledby="findings-heading" className="relative py-12 md:py-16 bg-white border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Key findings"
              title="What the numbers show"
              description={`Read from each provider's public pricing page on ${DEEP_VERIFIED}.`}
            />
            <ul className="mt-8 space-y-3.5">
              {PRICING_INDEX_FINDINGS.map((finding) => (
                <li key={finding} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-brand-dark/75">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden="true" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── COST CHART ─── */}
        <section aria-labelledby="chart-heading" className="relative py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Cost over 12 months"
              title="The cheapest way to stay paid up for a year"
              description="Each bar uses the provider's lowest ongoing price, or its one-time plan where that is cheaper. Sorted cheapest first."
            />
            <div className="mt-8">
              <CompareCostChart
                bars={COST_12_MONTHS}
                caption={`Original chart by Cvarchitect. Amounts are US dollars read from each provider's public pricing page on ${DEEP_VERIFIED}. Cvarchitect is shown at its one-time price of ${formatUsd(PRICING_INDEX_CVARCHITECT.twelveMonthCost)}.`}
              />
            </div>
          </div>
        </section>

        {/* ─── FULL TABLE ─── */}
        <section aria-labelledby="table-heading" className="relative py-12 md:py-16 bg-white border-y border-brand-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The dataset"
              title="Free plan, paid entry, and 12-month cost"
              description={`Every cell below was read from the provider's own pricing page on ${DEEP_VERIFIED}. Rows are ordered by 12-month cost, cheapest first.`}
            />

            <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[940px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  {`Free plan limits, paid entry price, cheapest 12-month cost, and renewal behaviour for ${PRICING_INDEX_TOOL_COUNT} resume and ATS tools, verified ${COMPARISON_VERIFIED}.`}
                </caption>
                <thead>
                  <tr className="border-b border-brand-border">
                    <th scope="col" className="w-[13%] py-3 pr-4 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Tool
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Free plan
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Paid entry
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Cheapest 12 months
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Renews automatically
                    </th>
                    <th scope="col" className="py-3 px-3 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_INDEX_ROWS.map((row) => (
                    <tr
                      key={row.name}
                      className={`border-b border-brand-border/70 align-top ${row.us ? 'bg-brand-green/[0.08]' : ''}`}
                    >
                      <th scope="row" className="py-3.5 pr-4 font-bold text-brand-dark">
                        <Link to={row.href} className="hover:underline">
                          {row.name}
                        </Link>
                      </th>
                      <td className="py-3.5 px-3 text-brand-dark/65">{row.freePlan}</td>
                      <td className="py-3.5 px-3 text-brand-dark/65">{row.entryPrice}</td>
                      <td className="py-3.5 px-3 font-semibold text-brand-dark">
                        {formatUsd(row.twelveMonthCost)}
                        <span className="block text-xs font-normal text-brand-dark/50">{row.twelveMonthBasis}</span>
                      </td>
                      <td className="py-3.5 px-3 text-brand-dark/65">{row.renewal}</td>
                      <td className="py-3.5 px-3">
                        <a
                          href={row.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-dark/60 underline decoration-brand-dark/20 underline-offset-2 hover:text-brand-dark"
                        >
                          {row.sourceLabel}
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-brand-dark/45">
              {`One-time plans: ${PRICING_INDEX_ROWS.filter((row) => /one-time|lifetime/i.test(row.lifetime))
                .map((row) => `${row.name} at ${formatUsd(row.twelveMonthCost)}`)
                .join(', ')}. All other tools renew on the cadence shown.`}
            </p>
          </div>
        </section>

        {/* ─── METHODOLOGY + CITATION ─── */}
        <section
          id="methodology"
          aria-labelledby="methodology-heading"
          className="relative py-12 md:py-16"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2
                id="methodology-heading"
                className="text-sm font-bold uppercase tracking-wider text-brand-dark/45 mb-3"
              >
                Methodology
              </h2>
              <p className="text-sm leading-relaxed text-brand-dark/65">
                {`We read each provider's public pricing page on ${DEEP_VERIFIED} and recorded three things: what the free plan includes, the cheapest paid entry price, and the cheapest way to keep paid access for 12 months. The 12-month figure uses the provider's lowest ongoing price, not a one-off trial, and switches to a one-time plan where the provider sells one and it is cheaper. Prices are in US dollars and exclude taxes and promotions.`}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-dark/65">
                We do not accept payment for placement. Cvarchitect appears in this index as one of the tools, and it does not rank first: on 12-month cost it is third. We publish the ranking we computed.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-brand-dark/45">
                Prices and plans change. Confirm on the provider's site before you buy.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark/45 mb-3">Cite this index</h2>
              <p className="text-sm leading-relaxed text-brand-dark/65">
                You are welcome to quote or reproduce these figures with attribution. Suggested citation:
              </p>
              <p className="mt-3 rounded-xl border border-brand-border bg-white p-4 font-mono text-xs leading-relaxed text-brand-dark/70">
                {CITATION}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-brand-dark/45">
                Figures are published under CC BY 4.0. The source URLs for every row are in the table above.
              </p>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section
          aria-labelledby="pricing-index-faq-heading"
          className="relative py-12 md:py-16 bg-white border-y border-brand-border"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Questions" title="Resume builder pricing, answered" />
            <div className="mt-8">
              <FaqList faqs={PRICING_INDEX_FAQS} />
            </div>
          </div>
        </section>

        {/* ─── RELATED COMPARISONS ─── */}
        <section aria-labelledby="related-comparisons-heading" className="relative py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <SectionHeading
                eyebrow="Go deeper"
                title="Head-to-head comparisons"
                description="Each row in the table links to its full comparison, including the rows where Cvarchitect loses."
              />
              <Link
                to="/compare"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-dark/60 transition-colors hover:text-brand-dark"
              >
                All comparisons
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {COMPETITORS.map((competitor) => (
                <Link
                  key={competitor.slug}
                  to={`/compare/${competitor.slug}`}
                  className="group rounded-2xl border border-brand-border bg-white p-5 transition-colors hover:border-brand-dark/25"
                >
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/40">
                    {competitor.category}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-brand-dark">
                    {`Cvarchitect vs ${competitor.name}`}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-dark/60">{competitor.verdict}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CtaBand
          headline={<>Start on the<br className="hidden sm:inline" /> free plan.</>}
          sub={<>10 AI rewrites, 3 PDF exports, no credit card.<br className="hidden sm:inline" /> Compare the output before you compare the pricing.</>}
          ctaLabel="Try Cvarchitect free"
          onCta={() => navigate(startPath)}
          secondary={
            <Link
              to="/pricing"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm sm:text-base font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              See Cvarchitect pricing
            </Link>
          }
        />
      </main>

      <PublicFooter />
    </div>
  );
}
