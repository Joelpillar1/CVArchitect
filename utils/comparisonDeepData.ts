/**
 * Deep content for the head-to-head comparison pages.
 *
 * Rules for this file:
 *   1. Every competitor fact below comes from the competitor's own public
 *      pricing or product page, read on DEEP_VERIFIED. Do not add a claim you
 *      have not read there.
 *   2. We publish the dimensions where Cvarchitect loses, including cost.
 *   3. No template counts for Cvarchitect. No em-dashes in copy.
 *   4. Screenshots are unaltered captures of the public pricing page, captioned
 *      with the source URL and the capture date.
 *
 * Consumed by components/ComparisonPage.tsx.
 */

import type { Edge } from './comparisonData';

export const DEEP_VERIFIED = '24 October 2026';

export interface FreePlanTrap {
  title: string;
  detail: string;
}

export interface DeepDive {
  dimension: string;
  us: string;
  them: string;
  edge: Edge;
}

export interface CostComparison {
  /** Cheapest way to keep paid access for 12 months, in USD. */
  them12: number;
  themLabel: string;
  note: string;
}

export interface EvidenceShot {
  src: string;
  alt: string;
  caption: string;
  sourceUrl: string;
  captured: string;
  /** Intrinsic pixel size, used to reserve layout space. Defaults to 1440x1000. */
  width?: number;
  height?: number;
}

export interface RelatedLink {
  href: string;
  title: string;
  detail: string;
}

export interface CompetitorDeep {
  slug: string;
  /** The one-line core tradeoff. */
  headline: string;
  /** Expanded "who this is for" paragraph. */
  bestForDetail: string;
  /** Who should not pick this tool. */
  notFor: string[];
  /** What the free plan actually gives you, line by line. */
  freePlanLines: string[];
  /** Free-plan traps to check before you invest time. */
  freePlanTraps: FreePlanTrap[];
  /** Feature-by-feature deep dive. */
  deepDives: DeepDive[];
  cost: CostComparison;
  screenshot: EvidenceShot;
  /** Extra FAQs merged into the page and its FAQ schema. */
  deepFaqs: Array<{ q: string; a: string }>;
  related: RelatedLink[];
}

/** Cvarchitect's own paid entry, used in the cost chart and copy. */
export const CVARCHITECT_PAID = {
  monthly: 10,
  once: 99,
  /** Cheapest paid path over 12 months. The $99 lifetime never renews. */
  annual: 99,
  label: '$99 once, or $10 per month',
};

export interface CostBar {
  name: string;
  amount: number;
  note: string;
  slug: string | null;
  us: boolean;
}

/**
 * Cheapest 12-month paid cost per tool. Cvarchitect is the $99 one-time price.
 * Competitor figures use each provider's cheapest ongoing plan, read from its
 * pricing page on DEEP_VERIFIED. Sorted ascending.
 */
export const COST_12_MONTHS: CostBar[] = [
  { name: 'Zety', amount: 71.4, note: '$5.95/mo billed yearly', slug: 'zety', us: false },
  { name: 'Resume Genius', amount: 95.4, note: '$7.95/mo billed yearly', slug: 'resume-genius', us: false },
  { name: 'Kickresume', amount: 96, note: '$8/mo billed yearly', slug: 'kickresume', us: false },
  { name: 'Cvarchitect', amount: 99, note: '$99 once, no renewal', slug: null, us: true },
  { name: 'Rezi', amount: 149, note: '$149 once', slug: 'rezi', us: false },
  { name: 'Enhancv', amount: 198, note: '$99 per 6 months', slug: 'enhancv', us: false },
  { name: 'Resume.io', amount: 199.8, note: '$49.95 per quarter', slug: 'resume-io', us: false },
  { name: 'Novoresume', amount: 199.99, note: '$199.99 per year, no renewal', slug: 'novoresume', us: false },
  { name: 'Teal', amount: 320.39, note: '$79 per 90 days', slug: 'teal', us: false },
  { name: 'Jobscan', amount: 359.8, note: '$89.95 per quarter', slug: 'jobscan', us: false },
];

export const COMPETITOR_DEEP: CompetitorDeep[] = [
  {
    slug: 'resume-io',
    headline:
      'Resume.io is the bigger library with the more guided editor. Cvarchitect is the stronger free plan and the one that rewrites your resume for a specific job.',
    bestForDetail:
      'Resume.io is built for people who want to browse hundreds of examples, edit inside a polished step-by-step editor, and are comfortable paying a subscription. It is also the better pick if you are applying outside an English-speaking market, because it runs localized sites for many countries.',
    notFor: [
      'You need a PDF from the free plan. Resume.io free downloads are TXT only.',
      'You want the resume rewritten against one job posting rather than edited by hand.',
      'You would rather pay once than keep a subscription.',
    ],
    freePlanLines: [
      'One resume and one cover letter',
      'Downloads in TXT format only',
      'Limited resume sharing and analytics',
      'No premium templates or colors',
    ],
    freePlanTraps: [
      {
        title: 'TXT only downloads',
        detail:
          'Free accounts can build a full resume but cannot export a PDF. Check the export button before you spend an hour in the editor.',
      },
      {
        title: 'The trial converts automatically',
        detail:
          'The $2.95 price is a 7-day trial. After 7 days it renews at $29.95 every 4 weeks unless you cancel in time.',
      },
      {
        title: 'One document at a time',
        detail:
          'The free plan holds a single resume and a single cover letter, so tailoring to several jobs means upgrading.',
      },
    ],
    deepDives: [
      {
        dimension: 'Template and example library',
        us: 'Templates by career stage, with writing guides in the blog.',
        them: '500+ free resume examples plus a large library split into ATS, Google Docs, Word, modern, professional, and simple categories.',
        edge: 'them',
      },
      {
        dimension: 'Editor experience',
        us: 'Guided first draft, then a job-specific rewrite.',
        them: 'A mature, guided editor with AI suggestions as you type.',
        edge: 'them',
      },
      {
        dimension: 'Free plan export',
        us: '3 PDF exports, no watermark.',
        them: 'TXT only.',
        edge: 'us',
      },
      {
        dimension: 'Job posting tailoring',
        us: 'Paste the posting and the agent rewrites the resume around it.',
        them: 'AI writing suggestions inside the editor.',
        edge: 'us',
      },
      {
        dimension: 'Cover letters',
        us: 'Unlimited on paid plans.',
        them: 'One on the free plan, unlimited on paid.',
        edge: 'tie',
      },
      {
        dimension: 'ATS check',
        us: 'Free resume vs job description checker.',
        them: 'ATS scorer available.',
        edge: 'tie',
      },
      {
        dimension: 'Country and language sites',
        us: 'English.',
        them: 'Localized sites for dozens of countries and languages.',
        edge: 'them',
      },
      {
        dimension: 'One-time payment',
        us: '$99 lifetime.',
        them: 'Not offered.',
        edge: 'us',
      },
    ],
    cost: {
      them12: 199.8,
      themLabel: '$49.95 every 3 months, about $199.80 a year',
      note: 'Resume.io has no lifetime plan, so the annual figure keeps recurring. Cvarchitect is $99 once, or $10 a month, and does not renew.',
    },
    screenshot: {
      src: '/images/compare/resume-io-pricing-2026-10.png',
      alt: 'Resume.io pricing page showing a $2.95 seven-day trial, a $49.95 quarterly plan, and a $0 free plan with TXT only downloads',
      caption:
        'Resume.io pricing on 24 October 2026. The free plan downloads in TXT only, and the $2.95 price is a trial that renews at $29.95 every 4 weeks.',
      sourceUrl: 'https://resume.io/pricing',
      captured: '24 October 2026',
    },
    deepFaqs: [
      {
        q: 'Is Resume.io cheaper than Cvarchitect over a year?',
        a: 'No. Resume.io is $49.95 every 3 months, about $199.80 a year, and it renews. Cvarchitect is $99 once, or $10 a month, and the $99 plan does not renew.',
      },
      {
        q: 'Can I download a PDF from the Resume.io free plan?',
        a: 'No. Resume.io free accounts can build a resume but download TXT only. A PDF needs a paid plan.',
      },
      {
        q: 'Does Resume.io have a lifetime plan?',
        a: 'No. Resume.io is subscription only, with a $2.95 seven-day trial that renews at $29.95 every 4 weeks.',
      },
    ],
    related: [
      {
        href: '/best-ai-resume-builders',
        title: 'Best AI resume builders',
        detail: 'The wider market comparison if you are still shortlisting tools.',
      },
      {
        href: '/best-resume-builders-for-first-time-writers',
        title: 'Best resume builders for first-time writers',
        detail: 'Five picks for people writing a resume for the first time.',
      },
      {
        href: '/resume-checker',
        title: 'Free resume checker',
        detail: 'Check how your draft reads against a job description.',
      },
      {
        href: '/resume-templates',
        title: 'Resume templates',
        detail: 'ATS-ready layouts by career stage.',
      },
    ],
  },
  {
    slug: 'teal',
    headline:
      'Teal is the job-search workspace. Cvarchitect is the resume itself. If you are juggling many applications, Teal tracks them; if the resume is the bottleneck, Cvarchitect fixes it.',
    bestForDetail:
      'Teal is built for people running a full job search: bookmarking roles, tracking stages, matching keywords, and reaching out to contacts. The free tier is unusually generous, with unlimited job tracking and 10 AI credits.',
    notFor: [
      'You want unlimited AI rewriting without a weekly meter.',
      'You do not need a tracker or a networking CRM.',
      'You want to pay once instead of renewing.',
    ],
    freePlanLines: [
      '10 resume templates',
      '10 AI credits for bullets, summaries, and cover letters',
      'Top-5 keyword matching',
      'Basic analysis mode',
      'Unlimited job tracking',
    ],
    freePlanTraps: [
      {
        title: 'AI credits run out quickly',
        detail:
          'The free plan gives 10 credits. Bullets cost credits, and a summary or a cover letter costs more, so a full rewrite can use them up fast.',
      },
      {
        title: 'Keyword matching is capped',
        detail:
          'Free accounts see the top 5 keywords from a posting. The full keyword list and the match score require Teal+.',
      },
      {
        title: 'Weekly billing adds up',
        detail:
          'Teal+ starts at $13 per week. Stay on the weekly plan for a month and you have spent about $56.',
      },
    ],
    deepDives: [
      {
        dimension: 'Job application tracker',
        us: 'Not included.',
        them: 'Included on free and paid, with bookmarks, stages, notes, and goals.',
        edge: 'them',
      },
      {
        dimension: 'Networking CRM',
        us: 'Not included.',
        them: 'Included on Teal+.',
        edge: 'them',
      },
      {
        dimension: 'Job description keyword matching',
        us: 'Paste the posting and the agent rewrites the resume.',
        them: 'Top 5 keywords free, unlimited on Teal+, with a match score.',
        edge: 'tie',
      },
      {
        dimension: 'AI rewriting',
        us: '10 rewrites free, unlimited on paid.',
        them: '10 credits free, unlimited on Teal+.',
        edge: 'tie',
      },
      {
        dimension: 'Free templates',
        us: 'All free templates.',
        them: '10 templates on the free plan.',
        edge: 'them',
      },
      {
        dimension: 'Cover letters',
        us: 'Unlimited on paid plans.',
        them: 'AI cover letter generator, 2 credits free.',
        edge: 'tie',
      },
      {
        dimension: 'Paid entry price',
        us: '$10 per month, or $99 once.',
        them: '$13 per week, $29 per 30 days, $79 per 90 days.',
        edge: 'us',
      },
      {
        dimension: 'One-time payment',
        us: '$99 lifetime.',
        them: 'Not offered.',
        edge: 'us',
      },
    ],
    cost: {
      them12: 320.39,
      themLabel: '$79 every 90 days, about $320 a year',
      note: 'Teal is subscription only, so the annual figure keeps recurring. Cvarchitect is $99 once, or $10 a month.',
    },
    screenshot: {
      src: '/images/compare/teal-pricing-2026-10.png',
      alt: 'Teal pricing page showing the Free Forever plan and Teal+ at $13 per week',
      caption:
        'Teal pricing on 24 October 2026. The free plan includes 10 templates, 10 AI credits, and unlimited job tracking.',
      sourceUrl: 'https://www.tealhq.com/pricing',
      captured: '24 October 2026',
    },
    deepFaqs: [
      {
        q: 'Is Teal cheaper than Cvarchitect?',
        a: 'Teal+ is $13 per week, $29 per 30 days, or $79 per 90 days, about $320 a year, and it renews. Cvarchitect is $99 once, or $10 a month.',
      },
      {
        q: 'What does the Teal free plan include?',
        a: 'Ten resume templates, 10 AI credits, top-5 keyword matching, basic analysis mode, and unlimited job tracking.',
      },
      {
        q: 'Does Teal have a lifetime plan?',
        a: 'No. Teal+ is a subscription with weekly, 30-day, and 90-day options.',
      },
    ],
    related: [
      {
        href: '/best-ai-resume-builders',
        title: 'Best AI resume builders',
        detail: 'How the builders compare when tracking is not the point.',
      },
      {
        href: '/compare',
        title: 'All comparisons',
        detail: 'Every head-to-head we publish.',
      },
      {
        href: '/resume-checker',
        title: 'Free resume checker',
        detail: 'Match a draft against a posting before you apply.',
      },
      {
        href: '/resume-templates',
        title: 'Resume templates',
        detail: 'ATS-ready layouts by career stage.',
      },
    ],
  },
  {
    slug: 'rezi',
    headline:
      'Rezi is the ATS score and interview practice specialist. Cvarchitect is the lower price with the stronger free plan. Rezi gives you a number; Cvarchitect gives you the rewrite.',
    bestForDetail:
      'Rezi is built for people who want a measurable ATS score, a structured feedback loop across 23 metrics, and interview practice in the same subscription. The lifetime plan removes the monthly cost if you are willing to pay $149 once.',
    notFor: [
      'You want the lowest monthly price.',
      'You want more than one resume on the free plan.',
      'You want tailoring from a job posting rather than a keyword score.',
    ],
    freePlanLines: [
      'One resume',
      'One AI interview',
      '3 PDF downloads',
      'Standard format templates',
      'AI resume writer and editor',
    ],
    freePlanTraps: [
      {
        title: 'One resume only',
        detail:
          'The free plan holds a single resume, so applying to several roles with tailored versions means upgrading.',
      },
      {
        title: 'The Rezi Score is limited',
        detail: 'The 23-metric Rezi Score is full on Pro. Free accounts see a limited version.',
      },
      {
        title: 'The highest monthly price here',
        detail:
          'Rezi Pro is $29 per month, the highest monthly price of the builders compared on this page.',
      },
    ],
    deepDives: [
      {
        dimension: 'ATS score',
        us: 'Resume vs job description match checker.',
        them: 'Rezi Score across 23 metrics, with fixes.',
        edge: 'them',
      },
      {
        dimension: 'Interview practice',
        us: 'Interview prep guidance.',
        them: 'AI interview practice included.',
        edge: 'them',
      },
      {
        dimension: 'Free plan',
        us: '1 resume analysis, 10 AI rewrites, 3 PDF exports.',
        them: '1 resume, 1 AI interview, 3 PDF downloads.',
        edge: 'tie',
      },
      {
        dimension: 'Job posting tailoring',
        us: 'Paste the posting and the agent rewrites the resume.',
        them: 'AI keyword targeting from the job description.',
        edge: 'us',
      },
      {
        dimension: 'Export formats',
        us: 'PDF and DOCX on paid plans.',
        them: 'PDF, DOCX, and Google Drive.',
        edge: 'tie',
      },
      {
        dimension: 'Paid entry price',
        us: '$10 per month, or $99 once.',
        them: '$29 per month, or $149 once.',
        edge: 'us',
      },
      {
        dimension: 'One-time payment',
        us: '$99 lifetime.',
        them: '$149 lifetime.',
        edge: 'us',
      },
    ],
    cost: {
      them12: 149,
      themLabel: '$149 once, or $29 per month',
      note: 'Rezi offers a $149 lifetime plan, so the annual figure can be a one-time cost like Cvarchitect. Cvarchitect is $99 once.',
    },
    screenshot: {
      src: '/images/compare/rezi-pricing-2026-10.png',
      alt: 'Rezi pricing page showing a free plan, Pro at $29 per month, and a $149 lifetime plan',
      caption: 'Rezi pricing on 24 October 2026. Pro is $29 per month, with a $149 lifetime option.',
      sourceUrl: 'https://www.rezi.ai/pricing',
      captured: '24 October 2026',
    },
    deepFaqs: [
      {
        q: 'Is Rezi cheaper than Cvarchitect?',
        a: 'Rezi Pro is $29 per month, and Rezi also sells a $149 lifetime plan. Cvarchitect is $10 per month or $99 once, so Cvarchitect is cheaper on both the monthly and the lifetime option.',
      },
      {
        q: 'Can I download a PDF free on Rezi?',
        a: 'Yes, with limits. The Rezi free plan includes one resume and 3 PDF downloads.',
      },
      {
        q: 'Does Rezi tailor a resume to a job description?',
        a: 'Rezi offers AI keyword targeting from a job description and a 23-metric Rezi Score. Cvarchitect rewrites the resume against the posting instead of only scoring it.',
      },
    ],
    related: [
      {
        href: '/best-ats-resume-checkers',
        title: 'Best ATS resume checkers',
        detail: 'How the scanners compare on score detail and price.',
      },
      {
        href: '/resume-checker',
        title: 'Free resume checker',
        detail: 'Check your draft against a posting before you apply.',
      },
      {
        href: '/best-ai-resume-builders',
        title: 'Best AI resume builders',
        detail: 'The wider market comparison.',
      },
      {
        href: '/compare',
        title: 'All comparisons',
        detail: 'Every head-to-head we publish.',
      },
    ],
  },
  {
    slug: 'kickresume',
    headline:
      'Kickresume is the design-first builder with matching documents. Cvarchitect is the one with AI in the free plan and a one-time option. Kickresume is cheaper per year; Cvarchitect is stronger before you pay.',
    bestForDetail:
      'Kickresume is built for people who care about how the document looks: 40+ templates, matching cover letters, deep type and color controls, and a personal website template. Students and teachers can get Premium free.',
    notFor: [
      'You want AI writing without a Premium upgrade.',
      'You want the ATS checker before you pay.',
      'You want a one-time payment rather than a subscription.',
    ],
    freePlanLines: [
      '4 basic resume templates',
      '4 matching cover letter templates',
      '1 basic website template',
      '20,000 pre-written phrases',
      '1,500+ resume examples',
      'Unlimited downloads',
    ],
    freePlanTraps: [
      {
        title: 'AI is Premium only',
        detail:
          'The AI Writer and the AI Resume and Cover Letter Writer require Premium. The free plan is templates and pre-written phrases.',
      },
      {
        title: 'The ATS checker is Premium only',
        detail:
          'The ATS Resume Checker is a Premium feature, so you cannot test ATS safety on the free plan.',
      },
      {
        title: 'Design is locked to four templates',
        detail: 'The free plan includes 4 of the 40+ templates and 2 of the 26 typefaces.',
      },
    ],
    deepDives: [
      {
        dimension: 'Design and templates',
        us: 'Template layouts and accent colors.',
        them: '40+ resume templates, 40+ matching cover letters, 26 typefaces, and about a million design combinations.',
        edge: 'them',
      },
      {
        dimension: 'Free plan breadth',
        us: 'All free templates, 10 AI rewrites, 3 PDF exports.',
        them: '4 resume templates, 4 cover letter templates, unlimited downloads.',
        edge: 'them',
      },
      {
        dimension: 'AI writing on the free plan',
        us: '10 AI rewrites included.',
        them: 'AI Writer requires Premium.',
        edge: 'us',
      },
      {
        dimension: 'ATS checker',
        us: 'Job-match analysis built into the editor.',
        them: 'ATS Resume Checker on Premium.',
        edge: 'us',
      },
      {
        dimension: 'Job posting tailoring',
        us: 'Paste the posting and the agent rewrites the resume.',
        them: 'AI Writer from a job ad, Premium only.',
        edge: 'us',
      },
      {
        dimension: 'Matching cover letters',
        us: 'Cover letters on paid plans.',
        them: 'Matching cover letter templates.',
        edge: 'them',
      },
      {
        dimension: 'Yearly price',
        us: 'Not offered.',
        them: '$8 per month billed yearly, $96 a year.',
        edge: 'them',
      },
      {
        dimension: 'One-time payment',
        us: '$99 lifetime.',
        them: 'Not offered.',
        edge: 'us',
      },
    ],
    cost: {
      them12: 96,
      themLabel: '$8 per month billed yearly, $96 a year',
      note: 'Kickresume is cheaper than Cvarchitect on a 12-month basis if you take the yearly plan. It is subscription only, while Cvarchitect is $99 once and does not renew.',
    },
    screenshot: {
      src: '/images/compare/kickresume-pricing-2026-10.png',
      alt: 'Kickresume pricing page showing yearly at $8 per month, quarterly at $18 per month, monthly at $24 per month, and a free plan',
      caption:
        'Kickresume pricing on 24 October 2026. Yearly is $8 per month, quarterly $18, monthly $24, with a free plan of four templates.',
      sourceUrl: 'https://www.kickresume.com/en/pricing/',
      captured: '24 October 2026',
    },
    deepFaqs: [
      {
        q: 'Is Kickresume cheaper than Cvarchitect?',
        a: 'On a 12-month basis, yes if you take the yearly plan. Kickresume Premium is $8 per month billed yearly, $96 a year. The monthly plan is $24 and quarterly is $18. Cvarchitect is $99 once and does not renew.',
      },
      {
        q: 'Can I use Kickresume AI on the free plan?',
        a: 'No. The AI Writer and the AI Resume and Cover Letter Writer require Premium. The free plan includes four templates, pre-written phrases, and unlimited downloads.',
      },
      {
        q: 'Does Kickresume have a lifetime plan?',
        a: 'No. Kickresume Premium renews monthly, quarterly, or yearly, and offers a 14-day money-back guarantee.',
      },
    ],
    related: [
      {
        href: '/resume-templates',
        title: 'Resume templates',
        detail: 'ATS-ready layouts by career stage.',
      },
      {
        href: '/best-cover-letter-builders',
        title: 'Best cover letter builders',
        detail: 'How the cover letter tools compare.',
      },
      {
        href: '/best-resume-builders-for-first-time-writers',
        title: 'Best resume builders for first-time writers',
        detail: 'Five picks for a first resume.',
      },
      {
        href: '/compare',
        title: 'All comparisons',
        detail: 'Every head-to-head we publish.',
      },
    ],
  },
  {
    slug: 'zety',
    headline:
      'Zety is the mature guided editor with a cheap annual plan. Cvarchitect is the one with a real free export and no auto-renewing trial. Zety is cheaper per year; Cvarchitect is safer before you pay.',
    bestForDetail:
      'Zety is built for people who want a long-established, step-by-step editor, a resume check that flags issues, and a low annual price. It is a comfortable choice if you are happy with an auto-renewing subscription.',
    notFor: [
      'You need a PDF from the free plan.',
      'You want AI tailoring against a job post without a trial timer.',
      'You want to pay once instead of renewing.',
    ],
    freePlanLines: [
      'Resume builder and resume templates',
      'Cover letter builder and cover letter templates',
      'TXT download only',
      'Unlimited downloads, prints, and edits',
    ],
    freePlanTraps: [
      {
        title: 'TXT only free downloads',
        detail: 'Free accounts can build a resume but cannot export a PDF or Word file.',
      },
      {
        title: 'The trial auto-renews',
        detail:
          '$1.95 is a 14-day trial. After 14 days it renews at $25.95 every 4 weeks unless you cancel.',
      },
      {
        title: 'Job matches are generic',
        detail:
          'Instant job matches recommend roles from your resume rather than rewriting it for one posting.',
      },
    ],
    deepDives: [
      {
        dimension: 'Editor experience',
        us: 'Guided first draft, then a job-specific rewrite.',
        them: 'A mature, step-by-step editor with a long track record.',
        edge: 'them',
      },
      {
        dimension: 'Resume check',
        us: 'Job-match analysis built into the editor.',
        them: 'Resume Check flags 30+ issues.',
        edge: 'them',
      },
      {
        dimension: 'Free download format',
        us: 'PDF, no watermark, 3 exports.',
        them: 'TXT only.',
        edge: 'us',
      },
      {
        dimension: 'Job posting tailoring',
        us: 'Paste the posting and the agent rewrites the resume.',
        them: 'Instant job matches from your resume.',
        edge: 'us',
      },
      {
        dimension: 'Templates',
        us: 'All free templates, all layouts on paid plans.',
        them: '18+ templates.',
        edge: 'tie',
      },
      {
        dimension: 'Annual price',
        us: 'Not offered.',
        them: '$5.95 per month billed yearly, $71.40 a year.',
        edge: 'them',
      },
      {
        dimension: 'One-time payment',
        us: '$99 lifetime.',
        them: 'Not offered.',
        edge: 'us',
      },
    ],
    cost: {
      them12: 71.4,
      themLabel: '$5.95 per month billed yearly, $71.40 a year',
      note: 'Zety is the cheapest paid plan on this page over 12 months, if you take the annual plan. It renews each year, while Cvarchitect is $99 once.',
    },
    screenshot: {
      src: '/images/compare/zety-pricing-2026-10.png',
      alt: 'Zety pricing page showing a free Basic package, a Pro package at $1.95 for 14 days, and an annual package at $5.95 per month',
      caption:
        'Zety pricing on 24 October 2026. Pro starts with a $1.95 14-day trial, then renews at $25.95 every 4 weeks. Free downloads are TXT only.',
      sourceUrl: 'https://www.zety.com/pricing',
      captured: '24 October 2026',
    },
    deepFaqs: [
      {
        q: 'Is Zety cheaper than Cvarchitect?',
        a: 'On a 12-month basis, yes if you take the annual plan. Zety is $5.95 per month billed yearly, $71.40 a year. The monthly price is $1.95 for 14 days, then $25.95 every 4 weeks. Cvarchitect is $99 once and does not renew.',
      },
      {
        q: 'Can I download a PDF from the Zety free plan?',
        a: 'No. Zety free accounts can build a resume and a cover letter but download TXT only.',
      },
      {
        q: 'What happens after the Zety trial ends?',
        a: 'The $1.95 price covers 14 days. After that it renews at $25.95 every 4 weeks unless you cancel.',
      },
    ],
    related: [
      {
        href: '/best-ai-resume-builders',
        title: 'Best AI resume builders',
        detail: 'The wider market comparison.',
      },
      {
        href: '/cover-letter',
        title: 'Cover letter builder',
        detail: 'Write a letter that sounds like you.',
      },
      {
        href: '/resume-templates',
        title: 'Resume templates',
        detail: 'ATS-ready layouts by career stage.',
      },
      {
        href: '/compare',
        title: 'All comparisons',
        detail: 'Every head-to-head we publish.',
      },
    ],
  },
  {
    slug: 'jobscan',
    headline:
      'Jobscan is the standalone ATS scanner with the deepest diagnostics. Cvarchitect is cheaper and does the rewrite in the same place. Jobscan tells you what is missing; Cvarchitect fixes it.',
    bestForDetail:
      'Jobscan is built for people who already have a resume they like and want a second opinion on how it matches a specific posting, with a job tracker, LinkedIn optimization, and Auto Apply credits on Premium.',
    notFor: [
      'You want the scan and the rewrite in one tool.',
      'You want a lower paid entry price.',
      'You want a one-time payment option.',
    ],
    freePlanLines: [
      '5 resume scans per month',
      '5 ATS and recruiter findings',
      'Job tracker',
      'Resume builder and resume manager',
      'Chrome extension',
    ],
    freePlanTraps: [
      {
        title: 'Scan volume is capped',
        detail: 'Free accounts get 5 scans a month. Unlimited scans require Premium.',
      },
      {
        title: 'The AI tools are Premium',
        detail:
          'AI Optimize, the cover letter generator, and the bullet point generator require Premium.',
      },
      {
        title: 'The highest paid entry here',
        detail: 'Premium is $49.95 per month, or $89.95 every 3 months after a 7-day trial.',
      },
    ],
    deepDives: [
      {
        dimension: 'ATS scanning depth',
        us: 'Job-specific match and ATS score.',
        them: 'Detects the specific ATS on a posting and tailors findings to its parsing rules.',
        edge: 'them',
      },
      {
        dimension: 'Free scan volume',
        us: '1 resume analysis.',
        them: '5 resume scans per month.',
        edge: 'them',
      },
      {
        dimension: 'Rewrite after the scan',
        us: 'The agent rewrites the resume against the posting.',
        them: 'AI Optimize and a bullet generator on Premium.',
        edge: 'us',
      },
      {
        dimension: 'Job tracker and Auto Apply',
        us: 'Not a standalone job tracker.',
        them: 'Job tracker on free and paid, Auto Apply credits on Premium.',
        edge: 'them',
      },
      {
        dimension: 'LinkedIn optimization',
        us: 'Not included.',
        them: 'LinkedIn optimizer on Premium.',
        edge: 'them',
      },
      {
        dimension: 'Cover letters',
        us: 'Unlimited on paid plans.',
        them: 'AI cover letter generator on Premium.',
        edge: 'tie',
      },
      {
        dimension: 'Paid entry price',
        us: '$10 per month, or $99 once.',
        them: '$49.95 per month, or $89.95 every 3 months.',
        edge: 'us',
      },
      {
        dimension: 'One-time payment',
        us: '$99 lifetime.',
        them: 'Not offered.',
        edge: 'us',
      },
    ],
    cost: {
      them12: 359.8,
      themLabel: '$89.95 every 3 months, about $359.80 a year',
      note: 'Jobscan is the most expensive paid plan on this page over 12 months. It is subscription only, while Cvarchitect is $99 once.',
    },
    screenshot: {
      src: '/images/compare/jobscan-pricing-2026-10.png',
      alt: 'Jobscan pricing page showing a free plan, a quarterly plan at $29.98 per month billed as $89.95 every 3 months, and a monthly plan at $49.95',
      caption:
        'Jobscan pricing on 24 October 2026. Free includes 5 scans a month. Premium is $49.95 a month, or $89.95 every 3 months after a 7-day trial.',
      sourceUrl: 'https://app.jobscan.co/plan',
      captured: '24 October 2026',
    },
    deepFaqs: [
      {
        q: 'Is Jobscan cheaper than Cvarchitect?',
        a: 'No. Jobscan Premium is $49.95 per month, or $89.95 every 3 months, about $359.80 a year, and it renews. Cvarchitect is $99 once, or $10 a month.',
      },
      {
        q: 'How many free scans does Jobscan give?',
        a: 'The Jobscan free plan includes 5 resume scans a month and 5 ATS and recruiter findings.',
      },
      {
        q: 'Does Jobscan rewrite a resume?',
        a: 'Jobscan Premium includes AI Optimize and a bullet point generator. Cvarchitect rewrites the full resume against the posting and exports an ATS-ready PDF in the same flow.',
      },
    ],
    related: [
      {
        href: '/best-ats-resume-checkers',
        title: 'Best ATS resume checkers',
        detail: 'How the scanners compare on depth and price.',
      },
      {
        href: '/resume-checker',
        title: 'Free resume checker',
        detail: 'Match a draft against a posting before you apply.',
      },
      {
        href: '/best-ai-resume-builders',
        title: 'Best AI resume builders',
        detail: 'The wider market comparison.',
      },
      {
        href: '/compare',
        title: 'All comparisons',
        detail: 'Every head-to-head we publish.',
      },
    ],
  },
  {
    slug: 'novoresume',
    headline:
      'Novoresume is the more polished designer and it never charges you twice without asking. Cvarchitect is the free plan you can finish on, and the one that rewrites for a specific job.',
    bestForDetail:
      'Novoresume suits people who care how the resume looks and want to pay for a fixed period instead of holding a subscription. Premium unlocks custom layouts, 74 color themes, creative backgrounds, picture styles, a matching cover letter, and a ten-page limit. The free Basic account is genuinely free indefinitely, which is more than most competitors offer.',
    notFor: [
      'You need more than one page without paying. Basic is capped at one page.',
      'You want a cover letter on the free plan. Novoresume includes one only with premium.',
      'You want the resume rewritten against a specific job posting.',
    ],
    freePlanLines: [
      'One resume version',
      'Capped at one page',
      'Predefined layouts only',
      '3 fonts and 30 color themes',
      'No cover letter',
    ],
    freePlanTraps: [
      {
        title: 'One page is a hard cap',
        detail:
          'Basic accounts cannot go past a single page. If your experience needs two pages, you are upgrading before you can export.',
      },
      {
        title: 'The design tools are the paid product',
        detail:
          'Custom layouts, 74 color themes, creative backgrounds, and picture styles are premium only. Basic gets predefined layouts, 3 fonts, and 30 color themes.',
      },
      {
        title: 'A whole year is due at once',
        detail:
          'The $199.99 yearly price is the cheapest rate, but it is prepaid. The $23.99 monthly option is the flexible one.',
      },
    ],
    deepDives: [
      {
        dimension: 'Design controls',
        us: 'Templates by career stage, tuned for ATS parsing.',
        them: 'Custom layout, 12 fonts, 74 color themes, creative backgrounds, 4 picture styles.',
        edge: 'them',
      },
      {
        dimension: 'Free plan ceiling',
        us: 'Three PDF exports with no page cap.',
        them: 'One page, predefined layouts, 3 fonts.',
        edge: 'us',
      },
      {
        dimension: 'Cover letters',
        us: 'Paid plans only.',
        them: 'Matching cover letter with premium, none on Basic.',
        edge: 'them',
      },
      {
        dimension: 'Billing',
        us: '$10 monthly, or $99 once.',
        them: '$23.99 monthly, $49.99 quarterly, or $199.99 yearly, prepaid.',
        edge: 'tie',
      },
      {
        dimension: 'Job posting tailoring',
        us: 'Paste the posting and the agent rewrites the resume around it.',
        them: 'Not described on the pricing page.',
        edge: 'us',
      },
      {
        dimension: 'Cost over 12 months',
        us: '$99 once.',
        them: '$199.99 prepaid for a year.',
        edge: 'us',
      },
      {
        dimension: 'Page length on premium',
        us: 'No stated cap.',
        them: 'Up to ten pages.',
        edge: 'them',
      },
    ],
    cost: {
      them12: 199.99,
      themLabel: '$199.99 prepaid for 12 months',
      note: 'Novoresume does not auto-renew, so the year is paid up front. Cvarchitect is $99 once, and that plan never renews either.',
    },
    screenshot: {
      src: '/images/compare/novoresume-pricing-2026-10.png',
      alt: 'Novoresume pricing page showing a free Basic plan, and Premium at 199.99 USD per year, 49.99 USD per quarter, and 23.99 USD per month',
      caption:
        'Novoresume pricing on 24 October 2026, served to a US visitor. Basic is free indefinitely but capped at one page. Premium is prepaid with no recurring billing.',
      sourceUrl: 'https://novoresume.com/pricing',
      captured: '24 October 2026',
      width: 1280,
      height: 1280,
    },
    deepFaqs: [
      {
        q: 'Is Novoresume cheaper than Cvarchitect over a year?',
        a: 'No. Novoresume is $199.99 for a prepaid year, or $49.99 a quarter. Cvarchitect is $99 once, or $10 a month.',
      },
      {
        q: 'Does Novoresume auto-renew?',
        a: 'No. Novoresume says its pricing is not subscription based and it will not charge you again without consent. The trade-off is that the cheapest yearly rate is paid up front.',
      },
      {
        q: 'What does the Novoresume free plan include?',
        a: 'One resume version capped at one page, predefined layouts, 3 fonts, 30 color themes, and no cover letter. Custom layouts, 74 color themes, backgrounds, and picture styles need premium.',
      },
    ],
    related: [
      {
        href: '/resume-builder-pricing-index',
        title: 'Resume Builder Pricing Index 2026',
        detail: 'Every tool in this comparison, ranked by 12-month cost.',
      },
      {
        href: '/best-ai-resume-builders',
        title: 'Best AI resume builders',
        detail: 'The wider market comparison if you are still shortlisting.',
      },
      {
        href: '/resume-templates',
        title: 'Resume templates',
        detail: 'ATS-ready layouts by career stage.',
      },
      {
        href: '/compare',
        title: 'All comparisons',
        detail: 'Every head-to-head we publish.',
      },
    ],
  },
  {
    slug: 'resume-genius',
    headline:
      'Resume Genius gives away more templates and a free cover letter. Cvarchitect gives away a PDF of the resume itself and rewrites it for the job.',
    bestForDetail:
      'Resume Genius is a content library as much as a builder. Free accounts get Word and Google Docs templates, a cover letter builder that exports in three formats, an AI summary generator, a resume checker, an expert review, and job board access. The resume builder itself is the weak spot on the free plan, because it exports TXT only.',
    notFor: [
      'You need a PDF of your resume without paying.',
      'You want the resume rewritten against a specific posting rather than summarised.',
      'You want to pay once. Resume Genius renews monthly or annually.',
    ],
    freePlanLines: [
      'Resume builder with TXT downloads only',
      'Cover letter builder with PDF, Word, and TXT',
      'Word and Google Docs templates',
      'AI (GPT-4) summary generator',
      'Resume checker, expert review, and job board access',
    ],
    freePlanTraps: [
      {
        title: 'The resume downloads as TXT',
        detail:
          'Free accounts can build a full resume, but the export is plain text. The cover letter builder is the part that exports a real document.',
      },
      {
        title: 'The trial converts',
        detail:
          'The $2.95 price covers 14 days. After that it renews at $23.95 every four weeks unless you cancel.',
      },
      {
        title: 'The annual plan renews too',
        detail:
          'The $95.40 annual price is the cheapest rate, and it renews automatically every year.',
      },
    ],
    deepDives: [
      {
        dimension: 'Free resume export',
        us: 'PDF, 3 exports, no watermark.',
        them: 'TXT only.',
        edge: 'us',
      },
      {
        dimension: 'Free cover letter export',
        us: 'Paid plans only.',
        them: 'PDF, Word, and TXT.',
        edge: 'them',
      },
      {
        dimension: 'Template files',
        us: 'Builder templates only.',
        them: 'Word and Google Docs templates, free.',
        edge: 'them',
      },
      {
        dimension: 'Expert review',
        us: 'Free resume vs job description checker.',
        them: 'Expert resume review included.',
        edge: 'them',
      },
      {
        dimension: 'Job posting tailoring',
        us: 'Paste the posting and the agent rewrites the resume.',
        them: 'AI summary generator; posting rewriting is not described on the pricing page.',
        edge: 'us',
      },
      {
        dimension: 'Cost over 12 months',
        us: '$99 once, no renewal.',
        them: '$95.40 a year, renews annually.',
        edge: 'them',
      },
      {
        dimension: 'One-time payment',
        us: '$99 lifetime.',
        them: 'Not offered.',
        edge: 'us',
      },
    ],
    cost: {
      them12: 95.4,
      themLabel: '$95.40 for 12 months, renews annually',
      note: 'Resume Genius is $3.60 cheaper than Cvarchitect in year one, then renews at $95.40 a year. Cvarchitect is $99 once, so it is cheaper from year two.',
    },
    screenshot: {
      src: '/images/compare/resume-genius-pricing-2026-10.png',
      alt: 'Resume Genius pricing page showing a $0 free plan with TXT only resume downloads, a $2.95 14-day trial, and a $7.95 per month annual plan',
      caption:
        'Resume Genius pricing on 24 October 2026. The free resume builder exports TXT only. The $2.95 trial renews at $23.95 every 4 weeks, and the annual plan is $95.40.',
      sourceUrl: 'https://resumegenius.com/pricing',
      captured: '24 October 2026',
    },
    deepFaqs: [
      {
        q: 'Is Resume Genius cheaper than Cvarchitect over a year?',
        a: 'By $3.60 in the first year. Resume Genius is $95.40 a year and renews annually. Cvarchitect is $99 once, so from year two Cvarchitect costs nothing while Resume Genius renews at $95.40.',
      },
      {
        q: 'Can I download a PDF resume for free on Resume Genius?',
        a: 'No. The free resume builder exports TXT only. The free cover letter builder does export PDF, Word, and TXT. Cvarchitect free accounts export three PDF resumes.',
      },
      {
        q: 'Does Resume Genius have a one-time payment?',
        a: 'No. It sells a 14-day trial at $2.95 that renews at $23.95 every four weeks, or an annual plan at $95.40 that renews yearly. Cvarchitect offers a $99 one-time plan.',
      },
    ],
    related: [
      {
        href: '/resume-builder-pricing-index',
        title: 'Resume Builder Pricing Index 2026',
        detail: 'Every tool in this comparison, ranked by 12-month cost.',
      },
      {
        href: '/best-resume-builders-for-first-time-writers',
        title: 'Best resume builders for first-time writers',
        detail: 'Picks for people writing a resume for the first time.',
      },
      {
        href: '/resume-templates',
        title: 'Resume templates',
        detail: 'ATS-ready layouts by career stage.',
      },
      {
        href: '/compare',
        title: 'All comparisons',
        detail: 'Every head-to-head we publish.',
      },
    ],
  },
  {
    slug: 'enhancv',
    headline:
      'Enhancv makes the better-looking document and coaches you while you write it. Cvarchitect keeps the free plan open and charges once.',
    bestForDetail:
      'Enhancv is for people who want the resume to look designed rather than templated. Pro includes thousands of design options, pro sections, unlimited section items, real-time content suggestions, an ATS check, resume translation, and a job application tracker. The catch is the free plan: seven days, basic sections, Enhancv branding, and a 12 item ceiling.',
    notFor: [
      'You need more than seven days to finish a resume without paying.',
      'You want an unbranded export from the free plan.',
      'You want to pay once rather than renew every month or six months.',
    ],
    freePlanLines: [
      'Seven-day free plan',
      'All resume templates',
      'Basic resume sections only',
      'Enhancv branding on the document',
      'Maximum 12 section items',
    ],
    freePlanTraps: [
      {
        title: 'Seven days, then it stops',
        detail:
          'The free plan is a trial, not a permanent tier. If you do not finish and export inside the week, you are paying to continue.',
      },
      {
        title: 'Branding stays on the document',
        detail:
          'Free documents carry Enhancv branding. Removing it needs Pro.',
      },
      {
        title: '12 section items is a low ceiling',
        detail:
          'A career changer with several roles, projects, and certifications can hit the 12 item limit before the resume is finished.',
      },
    ],
    deepDives: [
      {
        dimension: 'Design and customization',
        us: 'Templates by career stage, tuned for ATS parsing.',
        them: 'Thousands of design options, pro sections, unlimited section items.',
        edge: 'them',
      },
      {
        dimension: 'Free plan duration',
        us: 'Ongoing, no expiry.',
        them: 'Seven days.',
        edge: 'us',
      },
      {
        dimension: 'Free plan branding',
        us: 'No watermark, 3 PDF exports.',
        them: 'Enhancv branding on free documents.',
        edge: 'us',
      },
      {
        dimension: 'Content suggestions',
        us: '10 AI rewrites on free, unlimited on paid.',
        them: 'Real-time suggestions inside the editor on Pro.',
        edge: 'tie',
      },
      {
        dimension: 'Job description tailoring',
        us: 'Paste the posting and the agent rewrites the resume.',
        them: 'Paste the job ad and Enhancv shows what to include.',
        edge: 'tie',
      },
      {
        dimension: 'ATS check',
        us: 'Free resume vs job description checker.',
        them: 'ATS check included on Pro.',
        edge: 'tie',
      },
      {
        dimension: 'Cost over 12 months',
        us: '$99 once.',
        them: '$198, two six-month payments.',
        edge: 'us',
      },
    ],
    cost: {
      them12: 198,
      themLabel: '$99 every 6 months, about $198 a year',
      note: 'Enhancv list prices are $39 a month, $69 a quarter, and $99 every six months. Cvarchitect is $99 once. Enhancv runs frequent discounts, so the page can show less than list price.',
    },
    screenshot: {
      src: '/images/compare/enhancv-pricing-2026-10.png',
      alt: 'Enhancv pricing page showing a seven-day free plan and a Pro quarterly plan displayed at a promotional rate',
      caption:
        'Enhancv pricing on 24 October 2026. The page showed a limited-time discount at capture time: $9.15 per month on the quarterly plan, or $27.46 every 3 months. Enhancv list prices are $39 per month, $69 per quarter, and $99 every 6 months.',
      sourceUrl: 'https://enhancv.com/pricing/',
      captured: '24 October 2026',
    },
    deepFaqs: [
      {
        q: 'Is Enhancv cheaper than Cvarchitect?',
        a: 'At list price, no. Enhancv is $99 every six months, about $198 a year. Cvarchitect is $99 once. Enhancv runs frequent discounts, so check the page before you decide.',
      },
      {
        q: 'How long does the Enhancv free plan last?',
        a: 'Seven days. After that you need Pro to keep editing and downloading. Cvarchitect free access does not expire.',
      },
      {
        q: 'Does Enhancv download Word files?',
        a: 'No. Enhancv exports PDF only, which keeps the layout fixed. Cvarchitect includes DOCX on paid plans.',
      },
    ],
    related: [
      {
        href: '/resume-builder-pricing-index',
        title: 'Resume Builder Pricing Index 2026',
        detail: 'Every tool in this comparison, ranked by 12-month cost.',
      },
      {
        href: '/best-ai-resume-builders',
        title: 'Best AI resume builders',
        detail: 'The wider market comparison if you are still shortlisting.',
      },
      {
        href: '/resume-templates',
        title: 'Resume templates',
        detail: 'ATS-ready layouts by career stage.',
      },
      {
        href: '/compare',
        title: 'All comparisons',
        detail: 'Every head-to-head we publish.',
      },
    ],
  },
];

export function getCompetitorDeep(slug: string): CompetitorDeep | undefined {
  return COMPETITOR_DEEP.find((competitor) => competitor.slug === slug);
}
