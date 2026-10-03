import type { Job } from '../types/job';

/**
 * Resolve the links a job card / details modal should send a user to.
 *
 * The product promise behind the "company website" affordances is that clicking them lands
 * on the *career page that actually lists the job* — not a generic company homepage or a
 * bare ATS board. That breaks down in practice because the same visual slot is fed by three
 * different fields depending on where the job came from:
 *
 *  - `sourceUrl`  — set by the ATS providers (Greenhouse/Lever/Ashby) to the employer's
 *                   hosted posting page. This is the most specific, trustworthy target.
 *  - `applyUrl`   — frequently the same posting with an `/apply` or `/application` suffix
 *                   (Ashby and Lever do this) or, for older hand-entered jobs, the only
 *                   posting link we have.
 *  - `companyWebsiteUrl` — for admin/mock jobs this is the company's careers *landing*
 *                   page. A sensible last resort, but it does not identify the posting.
 *
 * Hence the precedence below: exact posting first, then the apply link with its action
 * suffix stripped, then the careers landing page. Every consumer (card, modal, landing
 * section) must use these helpers so the three slots cannot drift apart again.
 */

/** Trailing path segments that turn a posting page into an application action. */
const APPLICATION_SUFFIX = /\/(?:apply|application)\/?$/i;

/**
 * Strip a trailing `/apply` or `/application` so the URL points at the posting itself.
 * A no-op for URLs that are already posting pages.
 */
export function toJobPostingPage(url: string): string {
  return url.replace(APPLICATION_SUFFIX, '');
}

/**
 * The most specific *view this job* URL available.
 *
 * Returns `undefined` only when the job carries no link at all, so callers can conditionally
 * render the affordance instead of producing a dead `href`.
 */
export function getJobPostingUrl(
  job: Pick<Job, 'sourceUrl' | 'applyUrl' | 'companyWebsiteUrl'>,
): string | undefined {
  if (job.sourceUrl) return toJobPostingPage(job.sourceUrl);
  if (job.applyUrl) return toJobPostingPage(job.applyUrl);
  return job.companyWebsiteUrl || undefined;
}

/**
 * The company's careers page, when we know a link that plausibly represents it.
 *
 * Used as the fallback target for the logo / "company page" affordances and for the logo
 * domain lookup, so a job with neither `sourceUrl` nor `applyUrl` still resolves to a real
 * employer page rather than nowhere.
 */
export function getCompanyCareersUrl(
  job: Pick<Job, 'sourceUrl' | 'applyUrl' | 'companyWebsiteUrl'>,
): string | undefined {
  return job.companyWebsiteUrl || getJobPostingUrl(job);
}
