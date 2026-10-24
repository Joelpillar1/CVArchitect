import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHydrating } from '../contexts/HydrationContext';
import { ArrowRight } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import { COMPARISON_VERIFIED, COMPARISON_VERIFIED_ISO, getCompetitor } from '../utils/comparisonData';
import { COVER_LETTER_FAQS, COVER_LETTER_PICKS } from '../utils/coverLetterBuildersData';
import { CompareBadge, CtaBand, FaqList, SectionHeading, fadeInUp } from './CompareShared';

const BASE_URL = 'https://cvarchitect.app';

const COVER_LETTER_TABLE_ROWS = COVER_LETTER_PICKS.map((pick) => {
  if (!pick.slug) {
    return {
      name: 'Cvarchitect',
      key: 'cvarchitect',
      href: pick.href,
      freePlan: 'Free resume plan; cover letters start on paid plans',
      entryPrice: '$10 per month, or $99 once',
      lifetime: '$99',
      strongestAt: 'Job-specific tailoring',
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
});

export default function BestCoverLetterBuildersPage() {
  const hydrating = useHydrating();
  const navigate = useNavigate();
  const { user } = useAuth();
  const startPath = user ? '/dashboard/cover-letter' : '/signup?redirect=/dashboard/cover-letter';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Best cover letter builders',
          item: `${BASE_URL}/best-cover-letter-builders`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}/best-cover-letter-builders`,
      url: `${BASE_URL}/best-cover-letter-builders`,
      name: 'Best Cover Letter Builders in 2026',
      dateModified: COMPARISON_VERIFIED_ISO,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Best cover letter builders in 2026',
      itemListElement: COVER_LETTER_PICKS.map((pick, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: pick.name,
        url: `${BASE_URL}${pick.href}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: COVER_LETTER_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO
        title="Best Cover Letter Builders in 2026: Compared"
        description={`Five cover letter builders compared by job-specific tailoring, template variety, design, examples, and guided editing. Verified ${COMPARISON_VERIFIED}.`}
        canonicalPath="/best-cover-letter-builders"
        jsonLd={jsonLd}
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        <section aria-label="Overview" className="relative pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={hydrating ? false : 'hidden'}
              animate="visible"
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="mb-6">
                <CompareBadge chip="2026 guide">{`Verified ${COMPARISON_VERIFIED}`}</CompareBadge>
              </div>
              <h1 className="text-[clamp(2rem,4.6vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-5 max-w-3xl">
                {'Best cover letter builders '}
                <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                  by use case
                </span>
              </h1>
              <p className="text-base sm:text-lg text-brand-dark/60 max-w-2xl mx-auto leading-relaxed">
                Five tools, five different cover letter jobs. We picked them by what they are actually good at, not by
                who paid for the list.
              </p>
            </motion.div>
          </div>
        </section>

        <section aria-label="Short answer" className="relative pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-brand-dark">The short answer</h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-dark/70">
                For a letter tailored to a specific job, Cvarchitect is the strongest pick. Teal is the strongest for
                template and example variety, Kickresume for design, Resume.io for guided examples, and Zety for a
                traditional AI-assisted editor.
              </p>
            </div>
          </div>
        </section>

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
                  because the tools solve different cover letter problems.
                </li>
                <li>
                  <strong className="font-semibold text-brand-dark">Disclosure.</strong> Cvarchitect is our product. It
                  appears in the category it wins, and we publish the categories where the other four are stronger.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="the-picks"
          aria-label="The five picks"
          className="relative py-12 md:py-16 bg-white border-y border-brand-border"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="The picks" title="Five tools, five jobs" />

            <div className="mt-8 space-y-4">
              {COVER_LETTER_PICKS.map((pick, index) => (
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
                        Try it
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="comparison-table" aria-label="Comparison table" className="relative py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Side by side"
              title="All five, in one table"
              description={`Pricing read from each provider on ${COMPARISON_VERIFIED}.`}
            />

            <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                <caption className="sr-only">Cover letter builder comparison table</caption>
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
                  {COVER_LETTER_TABLE_ROWS.map((row) => (
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
                      <td className="py-3.5 px-3 text-brand-dark/75">{row.freePlan}</td>
                      <td className="py-3.5 px-3 text-brand-dark/75">{row.entryPrice}</td>
                      <td className="py-3.5 px-3 text-brand-dark/75">{row.lifetime}</td>
                      <td className="py-3.5 px-3 text-brand-dark/75">{row.strongestAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section
          id="faq"
          aria-label="Frequently asked questions"
          className="relative py-14 md:py-20 bg-white border-y border-brand-border"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Questions" title="Choosing a cover letter builder" />
            <div className="mt-8">
              <FaqList faqs={COVER_LETTER_FAQS} />
            </div>
          </div>
        </section>

        <CtaBand
          headline={
            <>
              Paste the job post.
              <br className="hidden sm:inline" /> Get a letter that fits it.
            </>
          }
          sub={
            <>
              Cover letter generation is included on paid plans.
              <br className="hidden sm:inline" /> Resume tailoring is free to try.
            </>
          }
          ctaLabel="See the cover letter builder"
          onCta={() => navigate(startPath)}
          secondary={
            <Link
              to="/cover-letter"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm sm:text-base font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              Cover letter examples
            </Link>
          }
        />
      </main>

      <PublicFooter />
    </div>
  );
}
