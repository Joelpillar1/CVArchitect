import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHydrating } from '../contexts/HydrationContext';
import { ArrowRight, Check } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { useAuth } from '../contexts/AuthContext';
import { TEMPLATE_CONFIG } from '../utils/templateConfig';
import {
  ROLE_LAST_UPDATED,
  ROLE_LAST_UPDATED_LABEL,
  getRelatedRoleGuides,
  getRoleGuide,
} from '../utils/roleTemplates';
import { TemplateGalleryCard } from './TemplateGalleryCard';
import { getRolePreviewData } from '../utils/rolePreviewData';
import { CompareBadge, CtaBand, FaqList, SectionHeading, fadeInUp } from './CompareShared';

const BASE_URL = 'https://cvarchitect.app';

export default function RoleTemplatePage() {
  const hydrating = useHydrating();
  const { role: slug } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const guide = getRoleGuide(slug);

  if (!guide) {
    return <Navigate to="/resume-templates" replace />;
  }

  const startPath = user ? '/dashboard/templates' : '/signup?redirect=/dashboard/templates';
  const path = `/resume-templates/${guide.slug}`;
  const url = `${BASE_URL}${path}`;

  const picks = guide.templatePicks
    .map((pick) => ({
      reason: pick.reason,
      template: TEMPLATE_CONFIG.find((template) => template.id === pick.id),
    }))
    .filter((entry): entry is { reason: string; template: (typeof TEMPLATE_CONFIG)[number] } =>
      Boolean(entry.template)
    );

  const related = getRelatedRoleGuides(guide);
  const rolePreview = getRolePreviewData(guide.slug);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Resume templates', item: `${BASE_URL}/resume-templates` },
        { '@type': 'ListItem', position: 3, name: `${guide.role} resume template`, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': url,
      url,
      name: guide.metaTitle,
      description: guide.metaDescription,
      dateModified: ROLE_LAST_UPDATED,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
      mainEntity: { '@id': `${url}#templates` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${url}#templates`,
      name: `${guide.role} resume templates`,
      numberOfItems: picks.length,
      itemListElement: picks.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: `${entry.template.name} resume template`,
          url: `${url}#template-${entry.template.id}`,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
      <SEO
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords.join(', ')}
        canonicalPath={path}
        jsonLd={jsonLd}
      />
      <PublicHeader />

      <main className="flex-1 pt-24 md:pt-32">
        {/* ─── HERO ─── */}
        <section aria-label={`${guide.role} resume template overview`} className="relative pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-brand-dark/45">
                <li>
                  <Link to="/" className="transition-colors hover:text-brand-dark">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to="/resume-templates" className="transition-colors hover:text-brand-dark">
                    Resume templates
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-brand-dark/70">
                  {guide.role}
                </li>
              </ol>
            </nav>

            <motion.div initial={hydrating ? false : 'hidden'} animate="visible" variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="mb-6">
                <CompareBadge chip="Role guide">{`Updated ${ROLE_LAST_UPDATED_LABEL}`}</CompareBadge>
              </div>

              <h1 className="text-[clamp(2.1rem,4.8vw,3.9rem)] font-bold tracking-[-0.03em] leading-[1.05] text-brand-dark mb-6 max-w-3xl">
                {`${guide.h1[0]} `}
                <br />
                <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">
                  {guide.h1[1]}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-brand-dark/60 max-w-2xl mx-auto leading-relaxed mb-9 text-balance">
                {guide.intro}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(startPath)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm sm:text-base font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover cursor-pointer"
                >
                  {`Build my ${guide.resumeLabel} resume`}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <Link
                  to="/resume-templates"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-brand-dark shadow-xs transition-colors hover:bg-brand-secondary"
                >
                  Browse all templates
                </Link>
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

        {/* ─── TEMPLATE PICKS ─── */}
        <section aria-label={`${guide.role} resume templates`} className="relative py-14 md:py-20 bg-white border-y border-brand-border scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Templates"
              title={`Three resume layouts for ${guide.role.toLowerCase()} roles`}
              description="Pick a layout, then make the content specific. Every option below keeps a single parseable column."
            />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {picks.map((entry, index) => (
                <div key={entry.template.id} className="flex flex-col">
                  <TemplateGalleryCard
                    template={entry.template}
                    index={index}
                    anchorId={`template-${entry.template.id}`}
                    onUse={() => navigate(startPath)}
                    rolePreview={rolePreview}
                  />
                  <p className="mt-3 px-1 text-xs leading-relaxed text-brand-dark/55">{entry.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHAT TO INCLUDE ─── */}
        <section aria-label={`What ${guide.resumeLabel} hiring managers look for`} className="relative py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14">
              <div>
                <SectionHeading
                  eyebrow="What gets screened"
                  title={`What hiring managers look for in ${guide.resumeLabel} resumes`}
                  description="These are the details that survive the first scan. If one is missing, the resume is read as a weaker match before anyone reaches the bullets."
                />

                <ol className="mt-8 space-y-5">
                  {guide.lookFor.map((item, index) => (
                    <li key={item} className="flex items-start gap-4">
                      <span className="mt-0.5 shrink-0 font-mono text-xs font-bold text-brand-dark/35">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm sm:text-base leading-relaxed text-brand-dark/70">{item}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <aside className="rounded-2xl border border-brand-border bg-white p-6 sm:p-7 h-fit">
                <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark/45">
                  Keywords to include
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-dark/60">
                  Use the exact term from the job post where it is honest. Do not add a tool you cannot discuss.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {guide.keywords.map((keyword) => (
                    <li
                      key={keyword}
                      className="rounded-full border border-brand-border bg-brand-bg px-3 py-1.5 text-xs font-medium text-brand-dark/70"
                    >
                      {keyword}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/resume-checker"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark transition-colors hover:text-brand-dark/70"
                >
                  Check a draft against a job post
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </aside>
            </div>
          </div>
        </section>

        {/* ─── EXAMPLE BULLETS ─── */}
        <section aria-label="Example resume bullets" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Example bullets"
              title="Bullets you can adapt"
              description="Replace the brackets with your own numbers. Keep the structure, and drop any bullet that does not match your experience."
            />

            <ul className="mt-8 space-y-3">
              {guide.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 rounded-xl border border-brand-border bg-brand-bg/60 px-4 py-3.5 text-sm leading-relaxed text-brand-dark/75"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── MISTAKES ─── */}
        <section aria-label="Common resume mistakes" className="relative py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Avoid these"
              title={`Mistakes that get ${guide.resumeLabel} resumes filtered`}
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {guide.mistakes.map((mistake) => (
                <article key={mistake.title} className="rounded-2xl border border-brand-border bg-white p-6">
                  <h3 className="text-base font-bold text-brand-dark">{mistake.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-dark/60">{mistake.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section aria-label="Frequently asked questions" className="relative py-14 md:py-20 bg-white border-y border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="FAQ"
              title={`Questions we hear about ${guide.resumeLabel} resumes`}
            />
            <div className="mt-8">
              <FaqList faqs={guide.faqs} />
            </div>
          </div>
        </section>

        {/* ─── RELATED ROLES ─── */}
        {related.length > 0 && (
          <section aria-label="Related role guides" className="relative py-14 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <SectionHeading eyebrow="Keep going" title="Other role guides" />
                <Link
                  to="/resume-templates"
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-dark/60 transition-colors hover:text-brand-dark"
                >
                  All templates
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/resume-templates/${item.slug}`}
                    className="group flex flex-col rounded-xl border border-brand-border bg-white p-5 transition-colors hover:border-brand-dark/25"
                  >
                    <h3 className="text-base font-bold text-brand-dark">{item.role}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-brand-dark/55">{item.summary}</p>
                    <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                      View guide
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBand
          headline={<>Start with the<br className="hidden sm:inline" /> free plan.</>}
          sub={<>One tailored resume, every free template, 10 AI rewrites,<br className="hidden sm:inline" /> and 3 PDF exports. No credit card.</>}
          ctaLabel="Build my resume"
          onCta={() => navigate(startPath)}
          badge="Free to start"
        />
      </main>

      <PublicFooter />
    </div>
  );
}
