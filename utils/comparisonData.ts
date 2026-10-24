/**
 * Comparison content for the AEO/GEO pages.
 *
 * Rules for this file:
 *   1. Every competitor claim below was read from the competitor's own pricing
 *      page on the date in COMPARISON_VERIFIED. Do not add a claim you have not
 *      verified there.
 *   2. We are allowed to lose rows. A comparison where we win everything is not
 *      credible and does not get cited.
 *   3. No template counts for Cvarchitect. The templates page deliberately does
 *      not publish a number, so the comparison copy must not either.
 *
 * Consumed by:
 *   - components/CompareHubPage.tsx
 *   - components/ComparisonPage.tsx
 *   - components/BestResumeBuildersPage.tsx
 *   - scripts/routes.mjs (prerender + sitemap)
 */

export const COMPARISON_VERIFIED = 'October 2026';

/**
 * Machine-readable version of COMPARISON_VERIFIED. Used for schema
 * `dateModified` and the sitemap `lastmod`, so an updated comparison is
 * visibly fresher to crawlers instead of looking untouched since launch.
 * Bump both constants together after re-reading every competitor pricing page.
 */
export const COMPARISON_VERIFIED_ISO = '2026-10-24';

export type Edge = 'us' | 'them' | 'tie';

export interface ComparisonRow {
  label: string;
  us: string;
  them: string;
  edge: Edge;
}

export interface Competitor {
  slug: string;
  name: string;
  siteUrl: string;
  pricingUrl: string;
  /** One line used on the hub cards. */
  category: string;
  /** The verdict sentence under the H1. */
  verdict: string;
  /** The short, quotable answer. Two or three sentences. */
  shortAnswer: string;
  /** Free plan summary, used in the hub table. */
  freePlan: string;
  /** Paid entry summary, used in the hub table. */
  entryPrice: string;
  /** Billing model, used in the hub table. */
  billing: string;
  lifetime: string;
  /** One line on who the tool suits best. */
  bestFor: string;
  rows: ComparisonRow[];
  theyWin: string[];
  weWin: string[];
  chooseThem: string[];
  chooseUs: string[];
  faqs: Array<{ q: string; a: string }>;
}

export const COMPETITORS: Competitor[] = [
  {
    slug: 'resume-io',
    name: 'Resume.io',
    siteUrl: 'https://resume.io',
    pricingUrl: 'https://resume.io/pricing',
    category: 'The guided template library',
    verdict: 'The stronger library. The weaker free plan.',
    shortAnswer:
      'Resume.io is the better choice if you want a huge library of examples and a polished, guided editor, and you are willing to pay a subscription. Cvarchitect is the better choice if you want the free plan to produce a real, downloadable PDF and you want the resume rewritten against a specific job posting. Resume.io free accounts can only download TXT.',
    freePlan: '1 resume and 1 cover letter, TXT downloads only',
    entryPrice: '$2.95 for 7 days, then $29.95 every 4 weeks',
    billing: 'Subscription, trial converts automatically',
    lifetime: 'Not offered',
    bestFor: 'Guided editing and non-English markets',
    rows: [
      {
        label: 'Free plan includes',
        us: '1 resume, all free templates, 10 AI rewrites, 3 PDF exports',
        them: '1 resume and 1 cover letter, TXT downloads only',
        edge: 'us',
      },
      {
        label: 'Paid entry price',
        us: '$10 per month, or $99 once',
        them: '$2.95 for 7 days, then $29.95 every 4 weeks',
        edge: 'us',
      },
      {
        label: 'Billing model',
        us: 'Monthly subscription or one-time payment',
        them: 'Subscription, trial converts automatically',
        edge: 'us',
      },
      {
        label: 'Free plan downloads',
        us: 'PDF, no watermark, 3 exports',
        them: 'TXT only',
        edge: 'us',
      },
      {
        label: 'Tailoring to a job post',
        us: 'Paste the posting, the agent rewrites the resume',
        them: 'AI suggestions while you edit',
        edge: 'us',
      },
      {
        label: 'Cover letters',
        us: 'Unlimited on paid plans',
        them: '1 on free, unlimited on paid',
        edge: 'tie',
      },
      {
        label: 'ATS score or match check',
        us: 'Free resume vs job description checker',
        them: 'ATS scorer available',
        edge: 'tie',
      },
      {
        label: 'Template and example library',
        us: 'Templates by career stage, guides inside the blog',
        them: 'A large template and example library',
        edge: 'them',
      },
      {
        label: 'Country and language sites',
        us: 'English',
        them: 'Localized sites for multiple countries',
        edge: 'them',
      },
      {
        label: 'One-time payment option',
        us: '$99 lifetime',
        them: 'Not offered',
        edge: 'us',
      },
    ],
    theyWin: [
      'Library depth. Resume.io has a much larger template and example library, which helps when you are starting from a blank page.',
      'Editor polish. The guided flow is mature and hard to get lost in.',
      'Localization. Resume.io runs localized sites for several markets, so it is worth checking if you apply outside an English-speaking country.',
    ],
    weWin: [
      'The free plan is actually usable. Three watermarked-free PDF exports beat TXT only.',
      'Job-posting tailoring is the starting point, not an add-on. You paste the posting and the resume is rewritten around it.',
      'You can pay once. $99 lifetime versus an auto-renewing subscription.',
    ],
    chooseThem: [
      'You want to browse hundreds of examples before you write anything.',
      'You are applying in a non-English market and want a localized builder.',
      'You are happy with a subscription and want the most guided editing experience.',
    ],
    chooseUs: [
      'This is your first resume and you want to export a real PDF without paying.',
      'You are applying to one specific role and want the resume rewritten for it.',
      'You would rather pay once than manage another subscription.',
    ],
    faqs: [
      {
        q: 'Is Cvarchitect cheaper than Resume.io?',
        a: 'Cvarchitect is $10 per month or $99 once. Resume.io starts with a $2.95 seven-day trial that renews at $29.95 every four weeks, or $49.95 per quarter. Over a year, Cvarchitect costs less unless you cancel Resume.io during the trial.',
      },
      {
        q: 'Can I download a PDF for free on Resume.io?',
        a: 'No. Resume.io free accounts can only download in TXT format. Cvarchitect free accounts can export three PDFs without a watermark.',
      },
      {
        q: 'Does Resume.io tailor your resume to a job description?',
        a: 'Resume.io offers AI writing suggestions inside its editor. Cvarchitect starts from the job posting: you paste it in and the agent rewrites the resume against that specific role.',
      },
      {
        q: 'Does Cvarchitect have as many templates as Resume.io?',
        a: 'No. Resume.io has a larger template and example library. Cvarchitect focuses on ATS-tested layouts organized by career stage, and puts the effort into tailoring rather than library size.',
      },
    ],
  },
  {
    slug: 'teal',
    name: 'Teal',
    siteUrl: 'https://www.tealhq.com',
    pricingUrl: 'https://www.tealhq.com/pricing',
    category: 'The job-search workspace',
    verdict: 'Better job tracking. Shorter free leash on AI.',
    shortAnswer:
      'Teal is the better choice if you are running a full job search and want a tracker, keyword matching, and a networking CRM in the same place. Cvarchitect is the better choice if the resume itself is the bottleneck and you want unlimited AI rewriting for a flat monthly price. Teal free accounts get 10 AI credits and top-5 keyword matching; Teal+ starts at $13 per week.',
    freePlan: '10 templates, 10 AI credits, top-5 keyword matching',
    entryPrice: '$13 per week, $29 per 30 days, $79 per 90 days',
    billing: 'Weekly, monthly, or quarterly',
    lifetime: 'Not offered',
    bestFor: 'High-volume job searches',
    rows: [
      {
        label: 'Free plan includes',
        us: '1 resume, all free templates, 10 AI rewrites, 3 PDF exports',
        them: '10 templates, 10 AI credits, top-5 keyword matching',
        edge: 'tie',
      },
      {
        label: 'Paid entry price',
        us: '$10 per month, or $99 once',
        them: '$13 per week, $29 per 30 days, $79 per 90 days',
        edge: 'us',
      },
      {
        label: 'Billing model',
        us: 'Monthly subscription or one-time payment',
        them: 'Weekly, monthly, or quarterly',
        edge: 'us',
      },
      {
        label: 'AI rewriting limits',
        us: '10 rewrites free, unlimited on paid',
        them: '10 credits free, unlimited on Teal+',
        edge: 'tie',
      },
      {
        label: 'Tailoring to a job post',
        us: 'Paste the posting, the agent rewrites the resume',
        them: 'Keyword matching against a job description',
        edge: 'us',
      },
      {
        label: 'Cover letters',
        us: 'Unlimited on paid plans',
        them: 'Cover letter builder included',
        edge: 'tie',
      },
      {
        label: 'Job application tracker',
        us: 'Not included',
        them: 'Included on free and paid',
        edge: 'them',
      },
      {
        label: 'Networking CRM',
        us: 'Not included',
        them: 'Included on Teal+',
        edge: 'them',
      },
      {
        label: 'Template and example library',
        us: 'Templates by career stage, guides inside the blog',
        them: '10 templates free, plus a resume examples library',
        edge: 'them',
      },
      {
        label: 'One-time payment option',
        us: '$99 lifetime',
        them: 'Not offered',
        edge: 'us',
      },
    ],
    theyWin: [
      'Job tracking is genuinely good, and it is free. Bookmarks, notes, stages, goals, all in one place.',
      'The free tier is generous for a first resume. 10 templates and 10 AI credits is a real trial, not a teaser.',
      'The networking CRM is unusual. Most resume builders stop at the document.',
    ],
    weWin: [
      'Unlimited AI rewriting for $10 per month, versus $13 per week at the entry Teal+ tier.',
      'Tailoring starts from the job posting rather than a keyword list, so the rewrite reads like a person wrote it.',
      'A $99 lifetime option exists. Teal is subscription only.',
    ],
    chooseThem: [
      'You are applying to many roles and need a tracker to stay organised.',
      'You want keyword matching plus a job board in the same tool.',
      'You want to network into a role, not just apply to it.',
    ],
    chooseUs: [
      'You already have a shortlist and the resume is the weak link.',
      'You want unlimited rewrites without a weekly meter.',
      'You want to pay once and stop thinking about it.',
    ],
    faqs: [
      {
        q: 'Is Teal free?',
        a: 'Teal has a free forever plan with 10 templates, 10 AI credits, top-5 keyword matching, and unlimited job tracking. AI rewriting and unlimited templates require Teal+, which starts at $13 per week.',
      },
      {
        q: 'Is Cvarchitect cheaper than Teal?',
        a: 'Cvarchitect is $10 per month or $99 once. Teal+ is $13 per week, $29 per 30 days, or $79 per 90 days. Cvarchitect is cheaper for anyone who keeps a paid plan longer than a month.',
      },
      {
        q: 'Does Cvarchitect track job applications?',
        a: 'No. Cvarchitect focuses on producing the tailored resume and cover letter. If you want a tracker, Teal is the better fit, and the two can be used together.',
      },
      {
        q: 'Can I use Teal and Cvarchitect together?',
        a: 'Yes. Use Cvarchitect to tailor the resume and cover letter for a role, then track the application in Teal. Nothing in either tool prevents that.',
      },
    ],
  },
  {
    slug: 'rezi',
    name: 'Rezi',
    siteUrl: 'https://www.rezi.ai',
    pricingUrl: 'https://www.rezi.ai/pricing',
    category: 'The ATS score specialist',
    verdict: 'Better scoring and interview prep. Higher monthly price.',
    shortAnswer:
      'Rezi is the better choice if you want a numeric ATS score, interview practice, and a one-time payment at any price. Cvarchitect is the better choice if you want unlimited tailoring for less per month and a free plan that exports real PDFs. Rezi Pro is $29 per month, and its lifetime plan is $149.',
    freePlan: '1 resume, 1 AI interview, 3 PDF downloads',
    entryPrice: '$29 per month, or $149 once',
    billing: 'Monthly or one-time',
    lifetime: '$149 one-time',
    bestFor: 'ATS score optimisation and interview prep',
    rows: [
      {
        label: 'Free plan includes',
        us: '1 resume, all free templates, 10 AI rewrites, 3 PDF exports',
        them: '1 resume, 1 AI interview, 3 PDF downloads',
        edge: 'tie',
      },
      {
        label: 'Paid entry price',
        us: '$10 per month, or $99 once',
        them: '$29 per month, or $149 once',
        edge: 'us',
      },
      {
        label: 'Billing model',
        us: 'Monthly subscription or one-time payment',
        them: 'Monthly subscription or one-time payment',
        edge: 'tie',
      },
      {
        label: 'Tailoring to a job post',
        us: 'Paste the posting, the agent rewrites the resume',
        them: 'AI keyword targeting from the job description',
        edge: 'us',
      },
      {
        label: 'ATS score',
        us: 'Resume vs job description match checker',
        them: 'Rezi Score across 23 metrics',
        edge: 'them',
      },
      {
        label: 'Interview practice',
        us: 'Interview prep guidance',
        them: 'AI interview practice included',
        edge: 'them',
      },
      {
        label: 'Cover letters',
        us: 'Unlimited on paid plans',
        them: 'Included',
        edge: 'tie',
      },
      {
        label: 'Export formats',
        us: 'PDF and DOCX on paid plans',
        them: 'PDF, DOCX, and Google Drive',
        edge: 'tie',
      },
      {
        label: 'One-time payment option',
        us: '$99 lifetime',
        them: '$149 lifetime',
        edge: 'us',
      },
    ],
    theyWin: [
      'Rezi Score is the most explicit ATS feedback loop of the four. Twenty-three metrics, scored, with fixes.',
      'AI interview practice is included. That is a different job than resume writing, and Rezi does it.',
      'Google Drive export is a small thing that matters if your workflow lives there.',
    ],
    weWin: [
      '$10 per month versus $29. $99 lifetime versus $149.',
      'The free plan includes 10 AI rewrites, so you can judge the output quality before paying.',
      'Tailoring starts from the posting and rewrites the whole resume, not just keyword coverage.',
    ],
    chooseThem: [
      'You want a number to optimise against and will iterate until the score moves.',
      'You want interview practice in the same subscription.',
      'You are willing to pay $149 once for a permanent tool.',
    ],
    chooseUs: [
      'You want the same one-time model at $99 instead of $149.',
      'You want unlimited tailoring at a lower monthly price.',
      'You want to see the AI output quality on the free plan before paying.',
    ],
    faqs: [
      {
        q: 'Is Rezi better than Cvarchitect for ATS?',
        a: 'Rezi gives you a more explicit score: 23 metrics with a number to improve. Cvarchitect focuses on tailoring the resume to a specific posting and checking the match against that posting. If you want a score to optimise, Rezi is stronger. If you want the rewrite, Cvarchitect is stronger.',
      },
      {
        q: 'How much does Rezi cost?',
        a: 'Rezi Pro is $29 per month. A lifetime plan is available for a one-time $149 payment. The free plan allows one resume, one AI interview, and three PDF downloads.',
      },
      {
        q: 'Is Cvarchitect cheaper than Rezi?',
        a: 'Yes. Cvarchitect is $10 per month or $99 once, compared with $29 per month or $149 once at Rezi.',
      },
      {
        q: 'Do both tools offer DOCX export?',
        a: 'Yes. Cvarchitect includes DOCX export on paid plans, and Rezi lists DOCX and Google Drive export.',
      },
    ],
  },
  {
    slug: 'kickresume',
    name: 'Kickresume',
    siteUrl: 'https://www.kickresume.com',
    pricingUrl: 'https://www.kickresume.com/en/pricing/',
    category: 'The design-first builder',
    verdict: 'Better looking documents. Weaker free AI.',
    shortAnswer:
      'Kickresume is the better choice if design matters to you, you want matching resume and cover letter templates, or you are a student who qualifies for free premium. Cvarchitect is the better choice if you want AI tailoring included without a premium upgrade and a free plan that is not limited to four templates. Kickresume Premium starts at $8 per month billed yearly.',
    freePlan: '4 resume templates, 4 cover letter templates, unlimited downloads',
    entryPrice: '$24 per month, $18 per month quarterly, $8 per month yearly',
    billing: 'Monthly, quarterly, or yearly',
    lifetime: 'Not offered',
    bestFor: 'Design-led industries and students',
    rows: [
      {
        label: 'Free plan includes',
        us: '1 resume, all free templates, 10 AI rewrites, 3 PDF exports',
        them: '4 resume templates, 4 cover letter templates, unlimited downloads',
        edge: 'them',
      },
      {
        label: 'Paid entry price',
        us: '$10 per month, or $99 once',
        them: '$24 monthly, $18 monthly on quarterly, $8 monthly on yearly',
        edge: 'us',
      },
      {
        label: 'Billing model',
        us: 'Monthly subscription or one-time payment',
        them: 'Monthly, quarterly, or yearly',
        edge: 'us',
      },
      {
        label: 'AI features on the free plan',
        us: '10 AI rewrites included',
        them: 'AI writer requires Premium',
        edge: 'us',
      },
      {
        label: 'Tailoring to a job post',
        us: 'Paste the posting, the agent rewrites the resume',
        them: 'AI writer from a job ad, Premium only',
        edge: 'us',
      },
      {
        label: 'Templates',
        us: 'All free templates, all layouts on paid plans',
        them: '4 free, 40+ on Premium',
        edge: 'them',
      },
      {
        label: 'Design customization',
        us: 'Template layouts and accent colors',
        them: '40+ templates with deep type and color controls',
        edge: 'them',
      },
      {
        label: 'Matching cover letters',
        us: 'Cover letters on paid plans',
        them: 'Matching cover letter templates',
        edge: 'them',
      },
      {
        label: 'One-time payment option',
        us: '$99 lifetime',
        them: 'Not offered',
        edge: 'us',
      },
    ],
    theyWin: [
      'Design is the product. A large template library, matching cover letters, and deep type and color controls produce documents that look considered.',
      'The free plan allows unlimited downloads, which is rare.',
      'Students and teachers can get Premium free, which makes it a strong pick for a first design-led resume.',
    ],
    weWin: [
      'AI is in the free plan, not behind a Premium upgrade.',
      'Tailoring starts from the job posting and rewrites the whole resume.',
      'A one-time $99 option exists. Kickresume is subscription only.',
    ],
    chooseThem: [
      'You want the best-looking document and will pay for design.',
      'You want a matching resume and cover letter set.',
      'You are a student who can verify status and get Premium free.',
    ],
    chooseUs: [
      'You want AI tailoring without upgrading first.',
      'You are applying to a specific role and need the content rewritten.',
      'You want to pay once rather than yearly.',
    ],
    faqs: [
      {
        q: 'Is Kickresume free?',
        a: 'Kickresume has a free plan with four resume templates, four matching cover letter templates, one basic website template, 20,000 pre-written phrases, 1,500+ resume examples, and unlimited downloads. AI writing, the ATS checker, and the full template library require Premium. Students and teachers can get Premium free.',
      },
      {
        q: 'How much does Kickresume Premium cost?',
        a: 'Kickresume Premium is $24 per month, $18 per month billed quarterly, or $8 per month billed yearly. There is a 14-day money-back guarantee.',
      },
      {
        q: 'Does Kickresume include AI resume writing on the free plan?',
        a: 'No. The AI writer and ATS checker are Premium features. Cvarchitect includes 10 AI rewrites on its free plan.',
      },
      {
        q: 'Which is better for design, Kickresume or Cvarchitect?',
        a: 'Kickresume. It has a larger template library, 26 typefaces, and matching cover letter designs. Cvarchitect optimizes for tailoring and ATS-safe layouts rather than design variety.',
      },
    ],
  },
  {
    slug: 'zety',
    name: 'Zety',
    siteUrl: 'https://www.zety.com',
    pricingUrl: 'https://www.zety.com/pricing',
    category: 'The established guided builder',
    verdict: 'The mature editor. The TXT-only free plan.',
    shortAnswer:
      'Zety is the better choice if you want a long-established guided editor and you are comfortable with an auto-renewing subscription. Cvarchitect is the better choice if you want a free PDF, AI rewrites on the free plan, and a one-time payment option. Zety free accounts can only download TXT; Pro starts with a $1.95 14-day trial and renews at $25.95 every 4 weeks.',
    freePlan: 'Free resume builder, TXT downloads only',
    entryPrice: '$1.95 for 14 days, then $25.95 every 4 weeks',
    billing: 'Auto-renewing subscription, monthly or annual',
    lifetime: 'Not offered',
    bestFor: 'Guided editing and established templates',
    rows: [
      {
        label: 'Free plan includes',
        us: '1 resume, all free templates, 10 AI rewrites, 3 PDF exports',
        them: 'Free resume builder, TXT downloads only',
        edge: 'us',
      },
      {
        label: 'Paid entry price',
        us: '$10 per month, or $99 once',
        them: '$1.95 for 14 days, then $25.95 every 4 weeks',
        edge: 'us',
      },
      {
        label: 'Free download format',
        us: 'PDF',
        them: 'TXT only',
        edge: 'us',
      },
      {
        label: 'Billing model',
        us: 'Monthly subscription or one-time payment',
        them: 'Auto-renewing monthly or annual subscription',
        edge: 'us',
      },
      {
        label: 'Templates',
        us: 'All free templates, all layouts on paid plans',
        them: '18+ templates',
        edge: 'tie',
      },
      {
        label: 'Cover letters',
        us: 'Cover letters on paid plans',
        them: 'Cover letter builder and matching templates, PDF and Word on paid',
        edge: 'tie',
      },
      {
        label: 'Resume check',
        us: 'Job-match analysis built into the editor',
        them: 'Resume Check flags 30+ issues',
        edge: 'them',
      },
      {
        label: 'Annual price',
        us: 'Not offered',
        them: '$71.40 per year, $5.95 per month',
        edge: 'them',
      },
      {
        label: 'One-time payment option',
        us: '$99 lifetime',
        them: 'Not offered',
        edge: 'us',
      },
    ],
    theyWin: [
      'The editor is mature and the template library covers 18+ layouts.',
      'Annual billing drops the effective price to $5.95 per month.',
      'Resume Check flags more than 30 issues in a draft.',
      'The free plan lets you build and download a TXT version without paying.',
    ],
    weWin: [
      'The free plan exports a real PDF, while Zety free downloads are TXT only.',
      'AI rewrites are included on the free plan, not behind a trial.',
      'A $99 one-time option exists. Zety is subscription only.',
      'There is no auto-renewing trial to cancel.',
    ],
    chooseThem: [
      'You want a guided editor with a long track record.',
      'You are willing to pay annually to get the lowest monthly price.',
      'You want a resume check that flags 30+ issues.',
    ],
    chooseUs: [
      'You need a PDF from the free plan.',
      'You want AI tailoring against a job post without a trial timer.',
      'You want to pay once instead of renewing a subscription.',
    ],
    faqs: [
      {
        q: 'Is Zety free?',
        a: 'Zety has a free plan, but free downloads are TXT only. PDF and Word downloads require Pro, which starts with a $1.95 14-day trial and then renews at $25.95 every 4 weeks.',
      },
      {
        q: 'How much does Zety cost?',
        a: 'Pro is $1.95 for 14 days, then $25.95 every 4 weeks. The annual plan is $5.95 per month, billed $71.40 once a year. Both plans renew automatically until you cancel.',
      },
      {
        q: 'Does Zety offer a lifetime plan?',
        a: 'No. Zety offers a monthly Pro plan and an annual plan. Cvarchitect offers a $99 one-time lifetime option.',
      },
      {
        q: 'Which is better for a free PDF resume, Zety or Cvarchitect?',
        a: 'Cvarchitect. Zety free accounts can only download TXT. Cvarchitect free accounts include 3 PDF exports, 10 AI rewrites, and access to all free templates.',
      },
      {
        q: 'Is Cvarchitect a good alternative to Zety?',
        a: 'Yes, if you want a free plan that exports PDFs, includes AI rewrites without a trial, and offers a one-time payment option. Zety is the better fit if you want an established guided editor and are willing to pay annually for the lowest monthly price.',
      },
    ],
  },
  {
    slug: 'jobscan',
    name: 'Jobscan',
    siteUrl: 'https://www.jobscan.co',
    pricingUrl: 'https://www.jobscan.co/pricing',
    category: 'The standalone ATS scanner',
    verdict: 'The stronger scanner. The higher monthly price.',
    shortAnswer:
      'Jobscan is the better choice if you want a standalone ATS scan, a job tracker, and a scanner that sits beside your existing resume workflow. Cvarchitect is the better choice if you want the scan and the rewrite in one place, a $10 monthly plan, a $99 one-time option, and cover letters included. Jobscan gives five free scans per month; Cvarchitect gives one free resume analysis, 10 AI rewrites, and 3 PDF exports.',
    freePlan: '5 resume scans per month, 5 ATS and recruiter findings',
    entryPrice: '$49.95 per month, or $89.95 every 3 months',
    billing: 'Subscription, quarterly plan includes a 7-day trial',
    lifetime: 'Not offered',
    bestFor: 'Standalone keyword matching and ATS diagnostics',
    rows: [
      {
        label: 'Free plan includes',
        us: '1 resume analysis, 10 AI rewrites, 3 PDF exports',
        them: '5 resume scans per month, 5 ATS and recruiter findings',
        edge: 'them',
      },
      {
        label: 'Paid entry price',
        us: '$10 per month, or $99 once',
        them: '$49.95 per month, or $89.95 every 3 months',
        edge: 'us',
      },
      {
        label: 'Billing model',
        us: 'Monthly subscription or one-time payment',
        them: 'Subscription, quarterly plan includes a 7-day trial',
        edge: 'us',
      },
      {
        label: 'ATS score or match check',
        us: 'Job-specific match and ATS score',
        them: 'Match rate and ATS findings',
        edge: 'tie',
      },
      {
        label: 'Rewrite after the scan',
        us: 'Agent rewrites the resume against the posting',
        them: 'AI Optimize and bullet generator on Premium',
        edge: 'us',
      },
      {
        label: 'Job tracker',
        us: 'Not a standalone job tracker',
        them: 'Job tracker included on free and paid plans',
        edge: 'them',
      },
      {
        label: 'Cover letters',
        us: 'Unlimited on paid plans',
        them: 'AI cover letter generator on Premium',
        edge: 'tie',
      },
      {
        label: 'One-time payment option',
        us: '$99 lifetime',
        them: 'Not offered',
        edge: 'us',
      },
    ],
    theyWin: [
      'Five free scans per month, compared with one free resume analysis on Cvarchitect.',
      'A standalone job tracker plus Auto Apply credits on Premium.',
      'A dedicated scanner that can sit beside a resume builder you already like.',
      'A wider set of recruiter and ATS findings in the scan report.',
    ],
    weWin: [
      'Lower paid entry: $10 per month or $99 once, versus $49.95 per month.',
      'The scan turns into a rewritten resume in the same workflow.',
      'A one-time lifetime option. Jobscan is subscription only.',
      'Cover letters are included on paid plans.',
    ],
    chooseThem: [
      'You already have a resume you like and want a second opinion on keyword match.',
      'You want a job tracker and Auto Apply credits in the same tool.',
      'You are comfortable with a $49.95 monthly or $89.95 quarterly subscription.',
    ],
    chooseUs: [
      'You want the scan and the rewrite in one place.',
      'You want a one-time payment option.',
      'You want cover letters and interview prep on the same paid plan.',
      'You want a lower paid entry price.',
    ],
    faqs: [
      {
        q: 'Is Jobscan free?',
        a: 'Jobscan has a free plan with five resume scans per month and five ATS and recruiter findings. Unlimited scans and the AI optimization tools require Premium.',
      },
      {
        q: 'How much does Jobscan cost?',
        a: 'Premium is $49.95 per month or $89.95 every three months, which works out to about $29.98 per month. The quarterly plan includes a 7-day trial. Jobscan does not offer a lifetime plan.',
      },
      {
        q: 'Is Cvarchitect a good alternative to Jobscan?',
        a: 'Yes, if you want the scan and the rewrite in one workflow, a lower paid entry price, and a one-time payment option. Jobscan is the better fit if you want a standalone scanner and a job tracker that works with an existing resume builder.',
      },
      {
        q: 'Does Jobscan rewrite my resume?',
        a: 'Jobscan Premium includes AI Optimize and a bullet point generator, so it can suggest job-specific changes. You still review the output. Cvarchitect rewrites the resume against the posting as part of the same workflow.',
      },
      {
        q: 'Do ATS checkers guarantee interviews?',
        a: 'No. ATS checkers approximate keyword matching and formatting rules. Use the score to find gaps, not as a guarantee. The content, the role fit, and the recruiter still decide the outcome.',
      },
      {
        q: 'Which has the better free plan, Jobscan or Cvarchitect?',
        a: 'They do different jobs. Jobscan gives five scans per month. Cvarchitect gives one resume analysis, 10 AI rewrites, and 3 PDF exports. If you want to test the rewrite, Cvarchitect gives you more to work with. If you want more scan volume, Jobscan wins.',
      },
    ],
  },
];

function formatNameList(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export const COMPETITOR_COUNT = COMPETITORS.length;

export const COMPETITOR_NAMES = COMPETITORS.map((competitor) => competitor.name);

/** "Resume.io, Teal, Rezi, Kickresume, and Zety" without a hand-maintained list. */
export const COMPETITOR_NAME_LIST = formatNameList(COMPETITOR_NAMES);

export function getCompetitor(slug: string): Competitor | undefined {
  return COMPETITORS.find((competitor) => competitor.slug === slug);
}

/** The listicle picks, ordered by use case rather than a single winner. */
export const BEST_PICKS = [
  {
    award: 'Best for tailoring to a job posting',
    name: 'Cvarchitect',
    slug: null as string | null,
    href: '/',
    summary:
      'Paste the job posting and the agent rewrites the resume around it. 10 AI rewrites are free, unlimited on the $10 monthly plan.',
    price: 'Free to start, $10 per month, or $99 once',
    bestFor: 'First-time writers and anyone targeting a specific role',
  },
  {
    award: 'Best for running the whole job search',
    name: 'Teal',
    slug: 'teal',
    href: '/compare/teal',
    summary:
      'Resume builder plus a job tracker, keyword matching, and a networking CRM. The free tier includes unlimited tracking.',
    price: 'Free forever, Teal+ from $13 per week',
    bestFor: 'High-volume applicants juggling many roles',
  },
  {
    award: 'Best for a one-time payment',
    name: 'Rezi',
    slug: 'rezi',
    href: '/compare/rezi',
    summary:
      'A numeric ATS score across 23 metrics plus AI interview practice. The lifetime plan removes the subscription entirely.',
    price: '$29 per month or $149 once',
    bestFor: 'People who want to pay once and optimise against a score',
  },
  {
    award: 'Best for design and matching documents',
    name: 'Kickresume',
    slug: 'kickresume',
    href: '/compare/kickresume',
    summary:
      'The best-looking output of the four, with a large template library, matching cover letters, and deep design controls.',
    price: '$24 monthly, from $8 monthly billed yearly',
    bestFor: 'Design-led industries and students',
  },
  {
    award: 'Best for examples and guided editing',
    name: 'Resume.io',
    slug: 'resume-io',
    href: '/compare/resume-io',
    summary:
      'A large resume example library and a mature guided editor, with localized sites for several countries.',
    price: '$2.95 trial, then $29.95 every 4 weeks',
    bestFor: 'Guided editing and non-English markets',
  },
];
