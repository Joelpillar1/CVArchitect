/**
 * Cover letter builder listicle data.
 *
 * Pricing comes from utils/comparisonData.ts, where every competitor figure is
 * tied to a public pricing page and the COMPARISON_VERIFIED date. This file
 * only adds cover-letter-specific positioning that was read from each
 * competitor's own cover letter page.
 */

export interface CoverLetterPick {
  award: string;
  name: string;
  /** Null means Cvarchitect. */
  slug: string | null;
  href: string;
  summary: string;
  price: string;
  bestFor: string;
}

export const COVER_LETTER_PICKS: CoverLetterPick[] = [
  {
    award: 'Best for tailoring to a job post',
    name: 'Cvarchitect',
    slug: null,
    href: '/cover-letter',
    summary:
      'Paste the job posting and your resume. Cvarchitect drafts a letter that matches the role and your real experience, then lets you edit it before export. Cover letters are included on paid plans.',
    price: 'Cover letters on paid plans, $10 per month or $99 once',
    bestFor: 'First-time writers and anyone targeting a specific posting',
  },
  {
    award: 'Best for template and example variety',
    name: 'Teal',
    slug: 'teal',
    href: '/compare/teal',
    summary:
      'A job-search workspace with over 100 cover letter templates and 1,500+ examples. The free plan includes 10 AI credits and job tracking; Teal+ adds more AI and workflow features.',
    price: 'Free forever, Teal+ from $13 per week',
    bestFor: 'People who want a large library and a job tracker in one place',
  },
  {
    award: 'Best for design and matching sets',
    name: 'Kickresume',
    slug: 'kickresume',
    href: '/compare/kickresume',
    summary:
      'Cover letter designs that match the resume templates, plus a GPT-4.1 powered AI writer. Four cover letter templates are free with unlimited downloads; the AI writer requires Premium.',
    price: '$24 monthly, from $8 monthly billed yearly',
    bestFor: 'Design-led applications and matching resume and cover letter sets',
  },
  {
    award: 'Best for guided examples',
    name: 'Resume.io',
    slug: 'resume-io',
    href: '/compare/resume-io',
    summary:
      'A guided cover letter builder with recruiter-reviewed templates and a deep library of examples by role. Free accounts can build a letter, but downloads are TXT only.',
    price: '$2.95 for 7 days, then $29.95 every 4 weeks',
    bestFor: 'Guided editing and a large example library',
  },
  {
    award: 'Best for a traditional guided builder',
    name: 'Zety',
    slug: 'zety',
    href: '/compare/zety',
    summary:
      'Eighteen cover letter templates, an AI cover letter generator, and a step-by-step editor. Free downloads are TXT only; PDF and Word require Pro.',
    price: '$1.95 for 14 days, then $25.95 every 4 weeks',
    bestFor: 'Writers who want a familiar guided editor and AI drafting',
  },
];

export const COVER_LETTER_FAQS = [
  {
    q: 'What is the best cover letter builder in 2026?',
    a: 'It depends on the job. Cvarchitect is the strongest for a letter tailored to a specific posting, because it starts from the job description and your resume. Teal has the largest template and example library among these five. Kickresume is the strongest for design. Resume.io is the strongest for guided examples. Zety is the strongest for a traditional step-by-step builder.',
  },
  {
    q: 'Are cover letter builders worth paying for?',
    a: 'If you apply to several roles and tailor each letter, yes. The time saved on structure, tone, and job-specific wording is the value. For one or two applications, the free tiers are enough.',
  },
  {
    q: 'Can a cover letter builder write a letter for a specific job?',
    a: 'Yes. The better tools use the job posting and your resume, not a generic template. Cvarchitect drafts from the posting and your verified experience. Kickresume and Zety offer AI drafting. Resume.io and Teal lean more on templates and examples.',
  },
  {
    q: 'Which cover letter builder has the best free plan?',
    a: 'Kickresume allows unlimited downloads on four free cover letter templates. Teal includes 10 AI credits and 10 free templates. Resume.io and Zety allow free building but limit free downloads to TXT. Cvarchitect\'s free plan focuses on resume tailoring; cover letter generation starts on paid plans.',
  },
  {
    q: 'Is Cvarchitect good for first-time cover letter writers?',
    a: 'Yes. You start with the job posting and your existing experience, and Cvarchitect drafts a structured letter before you edit it. That gives a first-time writer a complete example grounded in their own background, instead of a blank page or a generic template. Cover letter generation is included on paid plans.',
  },
  {
    q: 'Do cover letter builders pass ATS screening?',
    a: 'A cover letter is usually read by a person, but the same formatting rules apply: a single column, standard fonts, no images, and keywords from the posting. All five tools here produce clean documents; the content matters more than the builder.',
  },
  {
    q: 'Is Cvarchitect a good alternative to Zety for cover letters?',
    a: 'Yes, if you want a letter built from the job posting and your own experience, and you want a one-time payment option. Zety is the better fit if you want a traditional guided editor with 18 templates and are comfortable with an auto-renewing subscription.',
  },
];
