/**
 * Curated internal links from blog posts to the marketing pages.
 *
 * The blog has the most pages and the most links pointing at it, but until now
 * it pointed at none of the conversion pages. This module scores each post
 * against a small set of rules and returns the three most relevant resources,
 * so a post about cover letters sends readers to the cover letter page instead
 * of a generic homepage link.
 *
 * Links render in the prerendered HTML, which also gives crawlers a direct path
 * from every article to /resume-templates, /cover-letter, /compare, and the
 * listicle.
 */

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

interface LinkRule {
  link: RelatedLink;
  weight: number;
  test: RegExp;
}

const TEMPLATES: RelatedLink = {
  href: '/resume-templates',
  label: 'Resume templates',
  description: 'Browse ATS-friendly layouts by career stage and start from one.',
};

const COVER_LETTER: RelatedLink = {
  href: '/cover-letter',
  label: 'Cover letter builder',
  description: 'Write a letter that matches the resume you just built.',
};

const COMPARE: RelatedLink = {
  href: '/compare',
  label: 'Compare resume builders',
  description: 'Pricing and free plans for six resume and ATS tools, side by side.',
};

const FIRST_RESUME: RelatedLink = {
  href: '/best-resume-builders-for-first-time-writers',
  label: 'First resume builders',
  description: 'Five builders compared for students and first-time applicants.',
};

const ATS_CHECKERS: RelatedLink = {
  href: '/best-ats-resume-checkers',
  label: 'Best ATS resume checkers',
  description: 'Five checkers compared by scanning, scoring, and rewriting.',
};

const BEST_BUILDERS: RelatedLink = {
  href: '/best-ai-resume-builders',
  label: 'Best AI resume builders',
  description: 'Which builder fits your search, ranked by use case.',
};

const CHECKER: RelatedLink = {
  href: '/resume-checker',
  label: 'Resume checker',
  description: 'Score a resume against a job post before you apply.',
};

const ACTION_WORDS: RelatedLink = {
  href: '/action-words',
  label: '150+ action verbs',
  description: 'Swap weak verbs for language recruiters actually scan for.',
};

/**
 * Order matters only for ties: the first rule with the same weight wins.
 * Patterns run against slug, title, category, tags, and excerpt.
 */
const RULES: LinkRule[] = [
  { link: COVER_LETTER, weight: 6, test: /cover[-\s]?letter/ },
  { link: FIRST_RESUME, weight: 5, test: /first job|first resume|first-time|no experience|student resume|entry[- ]level|recent graduate/ },
  { link: COMPARE, weight: 5, test: /comparison|compare|\bvs\.?\b|alternative|free resume builder/ },
  { link: ACTION_WORDS, weight: 4, test: /action verb|action word|bullet point|resume bullet/ },
  { link: ATS_CHECKERS, weight: 4, test: /ats (?:resume )?(?:checker|scan|score)|beat ats|ats-friendly/ },
  { link: TEMPLATES, weight: 4, test: /template|resume layout|resume format|resume examples/ },
  { link: BEST_BUILDERS, weight: 4, test: /ai resume|resume builder|ai career/ },
  { link: CHECKER, weight: 3, test: /\bats\b|keyword|optimi[sz]e|optimi[sz]ation|resume score|job match/ },
];

/** Used when a post matches fewer than three rules. */
const FALLBACKS: RelatedLink[] = [TEMPLATES, COMPARE, COVER_LETTER];

const MAX_LINKS = 3;

export function getRelatedLinks(post: {
  slug: string;
  title: string;
  category: string;
  tags: string[];
}): RelatedLink[] {
  const haystack = [post.slug, post.title, post.category, post.tags.join(' ')].join(' ').toLowerCase();

  const scored = RULES.map((rule, index) => ({
    link: rule.link,
    score: rule.test.test(haystack) ? rule.weight : 0,
    index,
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.link);

  const links: RelatedLink[] = [];

  for (const link of [...scored, ...FALLBACKS]) {
    if (links.length === MAX_LINKS) break;
    if (!links.some((existing) => existing.href === link.href)) {
      links.push(link);
    }
  }

  return links;
}
