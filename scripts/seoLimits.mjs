/**
 * Hard limits for page and blog metadata.
 *
 * A title longer than ~60 characters gets truncated in search results, and a
 * description longer than ~160 gets cut off. These are enforced in two places so
 * an over-long title can never ship again:
 *
 *   - `npm run build`  -> scripts/verify-prerender.mjs checks the built HTML
 *   - `npm run test`   -> tests/seoMetadata.test.ts checks the source (blog + role guides)
 *
 * If you must change a limit, change it here only.
 */
export const SEO_TITLE_MAX = 60;
export const SEO_TITLE_MIN = 15;
export const SEO_DESCRIPTION_MAX = 160;
export const SEO_DESCRIPTION_MIN = 70;

/**
 * Decode the handful of HTML entities that can appear inside a `<title>` or a
 * meta description so the length we measure matches what a search engine sees.
 */
export function decodeEntities(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Return a list of human-readable problems for one page's metadata.
 * Empty array means the page passes every rule.
 *
 * @param {{ path: string, title?: string, description?: string }} input
 * @returns {string[]}
 */
export function seoMetadataProblems({ path, title, description }) {
  const problems = [];
  const t = decodeEntities(title || '');
  const d = decodeEntities(description || '');

  if (!t) problems.push(`${path}: missing title`);
  else if (t.length > SEO_TITLE_MAX) {
    problems.push(`${path}: title is ${t.length} chars (max ${SEO_TITLE_MAX}): "${t}"`);
  } else if (t.length < SEO_TITLE_MIN) {
    problems.push(`${path}: title is ${t.length} chars (min ${SEO_TITLE_MIN}): "${t}"`);
  }

  if (!d) problems.push(`${path}: missing meta description`);
  else if (d.length > SEO_DESCRIPTION_MAX) {
    problems.push(`${path}: description is ${d.length} chars (max ${SEO_DESCRIPTION_MAX})`);
  } else if (d.length < SEO_DESCRIPTION_MIN) {
    problems.push(`${path}: description is ${d.length} chars (min ${SEO_DESCRIPTION_MIN})`);
  }

  return problems;
}
