/**
 * ATS resume checker listicle data.
 *
 * Pricing for Jobscan, Rezi, Teal, and Zety comes from
 * utils/comparisonData.ts, where every figure is tied to a public pricing page
 * and the COMPARISON_VERIFIED date. The ATS-specific positioning below was read
 * from each provider's own product page.
 */

export interface AtsCheckerPick {
  award: string;
  name: string;
  /** Null means Cvarchitect. */
  slug: string | null;
  href: string;
  summary: string;
  price: string;
  bestFor: string;
}

export const ATS_CHECKER_PICKS: AtsCheckerPick[] = [
  {
    award: 'Best for job-specific tailoring',
    name: 'Cvarchitect',
    slug: null,
    href: '/resume-checker',
    summary:
      'Paste the job post and your resume. Cvarchitect scores the match, shows the gaps, and rewrites the resume around the role. The ATS check and the rewrite live in the same workflow.',
    price: 'Free plan includes 1 resume analysis; $10 per month or $99 once',
    bestFor: 'People who want the scan and the rewrite in one place, including first-time writers',
  },
  {
    award: 'Best for standalone keyword matching',
    name: 'Jobscan',
    slug: 'jobscan',
    href: '/compare/jobscan',
    summary:
      'The best-known standalone scanner. Paste a resume and a job post to get a match rate, missing keywords, and ATS formatting findings. The free plan includes five scans per month.',
    price: 'Free 5 scans per month; $49.95 per month or $89.95 every 3 months',
    bestFor: 'Diagnosing a resume against one posting without changing tools',
  },
  {
    award: 'Best for a numeric ATS score',
    name: 'Rezi',
    slug: 'rezi',
    href: '/compare/rezi',
    summary:
      'Scores a resume across 23 ATS metrics, then offers AI rewriting and interview practice. The lifetime plan removes the subscription.',
    price: '$29 per month or $149 once',
    bestFor: 'Score-driven optimization and a one-time payment',
  },
  {
    award: 'Best for job-search workflow',
    name: 'Teal',
    slug: 'teal',
    href: '/compare/teal',
    summary:
      'Matches keywords against a posting, tracks applications, and keeps the resume, cover letter, and job pipeline in one workspace. The free plan includes 10 AI credits and top-5 keyword matching.',
    price: 'Free forever, Teal+ from $13 per week',
    bestFor: 'High-volume searches with many applications',
  },
  {
    award: 'Best for a detailed content audit',
    name: 'Zety',
    slug: 'zety',
    href: '/compare/zety',
    summary:
      'A guided builder with a Resume Check that flags 30+ issues, plus 18 cover letter templates. The checker is part of the builder, not a standalone scanner.',
    price: '$1.95 for 14 days, then $25.95 every 4 weeks',
    bestFor: 'Writers who want a content audit while they build',
  },
];

export const ATS_CHECKER_FAQS = [
  {
    q: 'What is the best ATS resume checker in 2026?',
    a: 'It depends on what you need. Cvarchitect is the strongest when you want the scan and the rewrite in one workflow. Jobscan is the strongest standalone scanner. Rezi is the strongest for a numeric score and a one-time payment. Teal is the strongest for a full job-search workflow. Zety is the strongest for a detailed content audit inside a guided builder.',
  },
  {
    q: 'Is Jobscan worth paying for?',
    a: 'Jobscan is worth it if you want a standalone scanner, a job tracker, and five free scans per month to test it. Premium is $49.95 per month or $89.95 every three months. If you want the scan to turn into a rewritten resume without switching tools, Cvarchitect is $10 per month or $99 once and includes the rewrite.',
  },
  {
    q: 'Do ATS checkers guarantee interviews?',
    a: 'No. ATS checkers approximate keyword matching and formatting rules. Use the score to find gaps, not as a guarantee. The content, the role fit, and the recruiter still decide the outcome.',
  },
  {
    q: 'Which ATS checker has the best free plan?',
    a: 'Jobscan gives five scans per month. Cvarchitect gives one resume analysis, 10 AI rewrites, and 3 PDF exports. Rezi gives one resume, one AI interview, and 3 PDF downloads. Teal gives 10 AI credits and top-5 keyword matching. Zety lets you build for free but limits downloads to TXT.',
  },
  {
    q: 'Can an ATS checker rewrite my resume?',
    a: 'Some can. Cvarchitect rewrites the resume against the posting. Rezi offers AI rewriting. Jobscan Premium includes AI Optimize and a bullet point generator. Teal and Zety offer editing help. Always review the output before you send it.',
  },
  {
    q: 'Is Cvarchitect a good Jobscan alternative?',
    a: 'Yes, if you want the scan and the rewrite in one workflow, a lower paid entry price, and a one-time payment option. Jobscan is the better fit if you want a standalone scanner and a job tracker that works with an existing resume builder.',
  },
  {
    q: 'Do I need a separate ATS checker if I use an AI resume builder?',
    a: 'Not always. Cvarchitect includes a job-specific match and ATS score in the editor, so the check and the rewrite are one step. Other builders may not show a score, so a standalone checker can still be useful as a second opinion.',
  },
];
