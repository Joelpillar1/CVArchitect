import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHydrating } from '../contexts/HydrationContext';
import { AlertTriangle, ArrowRight, Check, ExternalLink, Minus } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import {
  COMPARISON_VERIFIED,
  COMPARISON_VERIFIED_ISO,
  COMPETITORS,
  comparisonMetaDescription,
  comparisonMetaTitle,
  getCompetitor,
} from '../utils/comparisonData';
import {
  COST_12_MONTHS,
  CVARCHITECT_PAID,
  DEEP_VERIFIED,
  getCompetitorDeep,
} from '../utils/comparisonDeepData';
import {
  BulletList,
  CompareBadge,
  ComparisonTable,
  CtaBand,
  FaqList,
  SectionHeading,
  fadeInUp,
} from './CompareShared';
import CompareCostChart from './CompareCostChart';

const BASE_URL = 'https://cvarchitect.app';

const US_FACTS = {
  bestFor: 'First-time writers and anyone tailoring to one job',
  freePlan: '1 resume, all free templates, 10 AI rewrites, 3 PDF exports',
  paid: CVARCHITECT_PAID.label,
  billing: 'Monthly subscription or one-time payment',
  lifetime: '$99 one-time',
};

function EdgeChip({ edge, competitorName }: { edge: 'us' | 'them' | 'tie'; competitorName: string }) {
  if (edge === 'tie') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-bg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-dark/45">
        <Minus className="h-3 w-3" aria-hidden="true" />
        Even
      </span>
    );
  }
  if (edge === 'us') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-dark">
        <Check className="h-3 w-3" aria-hidden="true" />
        Cvarchitect
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-dark/55">
      <Check className="h-3 w-3" aria-hidden="true" />
      {competitorName}
    </span>
  );
}

export default function ComparisonPage() {
  const hydrating = useHydrating();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const competitor = slug ? getCompetitor(slug) : undefined;
  const deep = slug ? getCompetitorDeep(slug) : undefined;

  if (!competitor || !deep) {
    return <Navigate to="/compare" replace />;
  }

  const allFaqs = [...competitor.faqs, ...deep.deepFaqs];
  const startPath = user ? '/dashboard' : '/signup';
  const path = `/compare/${competitor.slug}`;
  const title = comparisonMetaTitle(competitor);
  const description = comparisonMetaDescription(competitor);

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
      '@type': 'Article',
      '@id': `${BASE_URL}${path}#article`,
      headline: title,
      description,
      image: `${BASE_URL}${deep.screenshot.src}`,
      url: `${BASE_URL}${path}`,
      dateModified: COMPARISON_VERIFIED_ISO,
      datePublished: COMPARISON_VERIFIED_ISO,
      author: { '@id': `${BASE_URL}/#organization` },
      publisher: { '@id': `${BASE_URL}/#organization` },
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allFaqs.map((faq) => ({
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
        {/* HERO */}
        <section aria-label="Comparison overview" className="relative pb-12 md:pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
              <motion.div
                initial={hydrating ? false : 'hidden'}
                animate="visible"
                variants={fadeInUp}
                className="flex flex-col items-start"
              >
                <div className="mb-6">
                  <CompareBadge chip="Compare">{`Verified ${COMPARISON_VERIFIED}`}</CompareBadge>
                </div>

                <h1 className="text-[clamp(2rem,4.6vw,3.4rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-5">
                  {'Cvarchitect vs '}
                  <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                    {competitor.name}
                  </span>
                </h1>

                <p className="text-base sm:text-lg font-medium text-brand-dark/75 max-w-xl leading-relaxed mb-3">
                  {competitor.verdict}
                </p>
                <p className="text-xs sm:text-sm text-brand-dark/45 mb-8">
                  {`${competitor.category}. Public pricing read in ${COMPARISON_VERIFIED}.`}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
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

              <figure className="rounded-2xl border border-brand-border bg-white p-2 shadow-sm">
                <img
                  src={deep.screenshot.src}
                  alt={deep.screenshot.alt}
                  width={deep.screenshot.width ?? 1440}
                  height={deep.screenshot.height ?? 1000}
                  loading="eager"
                  decoding="async"
                  className="h-auto w-full rounded-xl border border-brand-border/60 object-cover"
                />
                <figcaption className="px-3 py-3 text-[11px] leading-relaxed text-brand-dark/50">
                  {deep.screenshot.caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* SHORT ANSWER */}
        <section id="short-answer" aria-label="The short answer" className="relative pb-14 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-3">
                The short answer
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-brand-dark/80">{competitor.shortAnswer}</p>
              <p className="mt-5 border-t border-brand-border pt-5 text-sm leading-relaxed text-brand-dark/70">
                {deep.headline}
              </p>
            </div>
          </div>
        </section>

        {/* AT A GLANCE */}
        <section aria-label="At a glance" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="At a glance"
              title="Two tools, five facts each"
              description={`The fastest way to decide. Every figure was read from each product's public page in ${COMPARISON_VERIFIED}.`}
            />
            <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <caption className="sr-only">{`Snapshot of Cvarchitect and ${competitor.name}`}</caption>
                <thead>
                  <tr className="border-b border-brand-border">
                    <th scope="col" className="w-[22%] py-3 pr-4 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
                      &nbsp;
                    </th>
                    <th scope="col" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-brand-dark">
                      Cvarchitect
                    </th>
                    <th scope="col" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-brand-dark/55">
                      {competitor.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Best for', us: US_FACTS.bestFor, them: competitor.bestFor },
                    { label: 'Free plan', us: US_FACTS.freePlan, them: competitor.freePlan },
                    { label: 'Paid entry', us: US_FACTS.paid, them: competitor.entryPrice },
                    { label: 'Billing', us: US_FACTS.billing, them: competitor.billing },
                    { label: 'One-time option', us: US_FACTS.lifetime, them: competitor.lifetime },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-brand-border/70 align-top">
                      <th scope="row" className="py-3.5 pr-4 font-semibold text-brand-dark/80">
                        {row.label}
                      </th>
                      <td className="bg-brand-green/10 py-3.5 px-4 text-brand-dark/80">{row.us}</td>
                      <td className="py-3.5 px-4 text-brand-dark/60">{row.them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SIDE BY SIDE */}
        <section id="side-by-side" aria-label="Side by side comparison" className="relative py-14 md:py-20">
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

        {/* COST OVER 12 MONTHS */}
        <section aria-label="Cost over 12 months" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Cost over 12 months"
              title="What a year of paid access actually costs"
              description="Each bar is the cheapest way to keep paid access for 12 months, using the provider's own published plan."
            />
            <div className="mt-8">
              <CompareCostChart
                bars={COST_12_MONTHS}
                caption={`Cvarchitect is $99 once and does not renew. Competitor figures are the cheapest ongoing plan and renew unless cancelled. Read ${COMPARISON_VERIFIED}. ${deep.cost.note}`}
              />
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-brand-border bg-brand-bg p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/45 mb-1">Cvarchitect</p>
                <p className="text-sm font-semibold text-brand-dark">{US_FACTS.paid}</p>
              </div>
              <div className="rounded-xl border border-brand-border bg-brand-bg p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/45 mb-1">
                  {competitor.name}
                </p>
                <p className="text-sm font-semibold text-brand-dark">{deep.cost.themLabel}</p>
              </div>
              <div className="rounded-xl border border-brand-border bg-brand-bg p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/45 mb-1">Difference</p>
                <p className="text-sm font-semibold text-brand-dark">
                  {deep.cost.them12 >= CVARCHITECT_PAID.annual
                    ? `Cvarchitect saves about $${Math.round(deep.cost.them12 - CVARCHITECT_PAID.annual)} over 12 months`
                    : `About $${Math.round(CVARCHITECT_PAID.annual - deep.cost.them12)} cheaper than Cvarchitect over 12 months`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FREE PLAN REALITY CHECK */}
        <section aria-label="Free plan reality check" className="relative py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Free plan reality check"
              title={`What you really get free on ${competitor.name}`}
              description="The free tier is where most people start, and it is where the fine print lives."
            />
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section
                aria-label={`${competitor.name} free plan`}
                className="rounded-2xl border border-brand-border bg-white p-6 sm:p-7"
              >
                <h3 className="text-base sm:text-lg font-bold text-brand-dark mb-4">{`${competitor.name} free plan`}</h3>
                <BulletList items={deep.freePlanLines} />
              </section>
              <section aria-label="Free plan traps" className="rounded-2xl border border-brand-border bg-white p-6 sm:p-7">
                <h3 className="mb-4 inline-flex items-center gap-2 text-base sm:text-lg font-bold text-brand-dark">
                  <AlertTriangle className="h-4 w-4 text-brand-dark/40" aria-hidden="true" />
                  Watch for
                </h3>
                <ul className="space-y-5">
                  {deep.freePlanTraps.map((trap) => (
                    <li key={trap.title}>
                      <p className="text-sm font-semibold text-brand-dark mb-1">{trap.title}</p>
                      <p className="text-sm leading-relaxed text-brand-dark/65">{trap.detail}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </section>

        {/* FEATURE DEEP DIVE */}
        <section aria-label="Feature deep dive" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Feature deep dive"
              title="Dimension by dimension"
              description="We label the winner on each row, including the ones Cvarchitect does not win."
            />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {deep.deepDives.map((dive) => (
                <article key={dive.dimension} className="rounded-2xl border border-brand-border bg-brand-bg p-5 sm:p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="text-sm sm:text-base font-bold text-brand-dark">{dive.dimension}</h3>
                    <EdgeChip edge={dive.edge} competitorName={competitor.name} />
                  </div>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/45">Cvarchitect</dt>
                      <dd className="text-sm leading-relaxed text-brand-dark/75">{dive.us}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/45">
                        {competitor.name}
                      </dt>
                      <dd className="text-sm leading-relaxed text-brand-dark/60">{dive.them}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* STRENGTHS */}
        <section id="strengths" aria-label="Where each tool wins" className="relative py-14 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Where each one wins"
              title="No tool wins every row"
              description="If a comparison page claims otherwise, it is an ad, not a comparison."
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <section
                aria-label={`Where ${competitor.name} is stronger`}
                className="rounded-2xl border border-brand-border bg-white p-6 sm:p-7"
              >
                <h3 className="text-base sm:text-lg font-bold text-brand-dark mb-4">
                  {`Where ${competitor.name} is stronger`}
                </h3>
                <BulletList items={competitor.theyWin} />
              </section>
              <section
                aria-label="Where Cvarchitect is stronger"
                className="rounded-2xl border border-brand-border bg-white p-6 sm:p-7"
              >
                <h3 className="text-base sm:text-lg font-bold text-brand-dark mb-4">Where Cvarchitect is stronger</h3>
                <BulletList items={competitor.weWin} tone="positive" />
              </section>
            </div>
          </div>
        </section>

        {/* DECISION */}
        <section id="decision" aria-label="Decision guide" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Decision" title="Which one should you pick?" />
            <div className="mt-6 rounded-2xl border border-brand-border bg-brand-bg p-5 sm:p-6">
              <p className="text-sm sm:text-base leading-relaxed text-brand-dark/75">{deep.bestForDetail}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <section
                aria-label={`Pick ${competitor.name} if`}
                className="rounded-2xl border border-brand-border bg-brand-bg p-6 sm:p-7"
              >
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-2">
                  {`Pick ${competitor.name} if`}
                </h3>
                <BulletList items={competitor.chooseThem} />
                <h4 className="mt-6 mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45">
                  Look elsewhere if
                </h4>
                <BulletList items={deep.notFor} />
              </section>
              <section
                aria-label="Pick Cvarchitect if"
                className="rounded-2xl border border-brand-dark/15 bg-brand-dark p-6 sm:p-7 text-white"
              >
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

        {/* FAQ */}
        <section id="faq" aria-label="Frequently asked questions" className="relative py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Questions" title={`${competitor.name} vs Cvarchitect, answered`} />
            <div className="mt-8">
              <FaqList faqs={allFaqs} />
            </div>
          </div>
        </section>

        <CtaBand
          headline={
            <>
              Tailor one resume
              <br className="hidden sm:inline" /> to one job, free.
            </>
          }
          sub={
            <>
              10 AI rewrites and 3 PDF exports, no credit card.
              <br className="hidden sm:inline" /> Upgrade only if you want unlimited.
            </>
          }
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

        {/* METHOD + RELATED */}
        <section
          id="methodology"
          aria-label="Comparison methodology and related links"
          className="relative py-14 md:py-16 bg-white border-t border-brand-border"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <section aria-labelledby="methodology-heading">
                <h2 id="methodology-heading" className="text-sm font-bold uppercase tracking-wider text-brand-dark/45 mb-3">
                  How we compare
                </h2>
                <p className="text-sm leading-relaxed text-brand-dark/65">
                  {`We read each product's public pricing and product pages in ${DEEP_VERIFIED} and record only what is stated there. We do not accept payment for placement, and we publish the rows where Cvarchitect loses, including cost. Prices and features change, so confirm on ${competitor.name}'s pricing page before you buy.`}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-brand-dark/45">
                  {`Screenshot source: ${deep.screenshot.sourceUrl}. Captured ${deep.screenshot.captured}. Shown unaltered for comparison.`}
                </p>
              </section>
              <nav aria-labelledby="other-comparisons-heading">
                <h2
                  id="other-comparisons-heading"
                  className="text-sm font-bold uppercase tracking-wider text-brand-dark/45 mb-3"
                >
                  Related reading
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deep.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="block rounded-xl border border-brand-border bg-brand-bg p-4 transition-colors hover:border-brand-dark/20"
                      >
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-dark">
                          {link.title}
                          <ArrowRight className="w-3.5 h-3.5 text-brand-dark/30" />
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-brand-dark/55">{link.detail}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-6 mb-3 text-sm font-bold uppercase tracking-wider text-brand-dark/45">
                  Other comparisons
                </h3>
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
