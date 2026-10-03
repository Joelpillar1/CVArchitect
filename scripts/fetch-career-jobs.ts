/**
 * Fetch career-page jobs for newly discovered employers and emit `data/careerJobs.ts`.
 *
 * Pipeline reuse is deliberate: this imports the SAME `fetchSourceJobs` +
 * normalization code that `api/jobs-sync.ts` uses in production, so whatever lands in the
 * generated file is byte-for-byte what a live sync would have written. Nothing about the
 * mapping (department inference, skill extraction, salary parsing) is reimplemented here.
 *
 * De-duplication is the whole point of the exercise, so it happens twice:
 *   1. **Company level** — employers already represented in the existing feed are dropped
 *      outright, because a second board for the same employer is not new information.
 *   2. **Posting level** — within the new batch, `${company}|${title}|${location}` collapses
 *      a posting that appears on two of a company's boards.
 *
 *   npx esbuild scripts/fetch-career-jobs.ts --bundle --platform=node --format=esm \
 *     --outfile=dist/fetch.mjs --external:@supabase/supabase-js && node dist/fetch.mjs
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { fetchSourceJobs, logoUrlForDomain, type NormalizedJob } from '../api/_lib/jobs';
import { MOCK_JOBS } from '../data/mockJobs';
import type { Job } from '../types/job';

/**
 * Boards that resolved to the wrong employer during recon and must not be fetched.
 *
 *  - `Remote`   — remote.com's careers page fingerprints Greenhouse board
 *                 `leadingeducators`, which is a different employer entirely.
 *  - `FourKites` — resolved to Greenhouse `this_part`, which returns no postings; excluded so
 *                 a dead token is never pinned into the seed list.
 *  - `Velocity Global` — resolved to Ashby `pebl` (25 unrelated HR postings) by fingerprint;
 *                 the token does not belong to Velocity Global, so it is dropped rather than
 *                 filing another company's roles under this name.
 *  - `Bolt`     — `ashby:bolt` returns no postings, so the fingerprint was for a defunct board.
 */
const FALSE_POSITIVES = new Set(['Remote', 'FourKites', 'Velocity Global', 'Bolt']);

interface ReconRow {
  name: string;
  domain: string;
  provider?: string;
  slug?: string;
  detection?: string;
}

/**
 * Snapshot of the previous run, used to backfill employers that do not answer this run.
 *
 * A full rebuild is otherwise lossy: a single transient network blip (or a board that is slow
 * to respond) drops that employer's postings from the shipped bundle. Reading the last run's
 * output and re-adding its postings for any employer that failed *transiently* keeps a flaky
 * network from quietly shrinking the feed.
 */
const SNAPSHOT = '.tmp/careerJobs.previous.json';

function readPreviousJobs(): Job[] {
  try {
    return JSON.parse(readFileSync(SNAPSHOT, 'utf8')) as Job[];
  } catch {
    return [];
  }
}

/** Retry a fetch a few times with backoff — most failures here are momentary. */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 1500): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw lastErr;
}

/** A board that returned a hard HTTP status is gone; only retry-able failures are backfilled. */
function isPermanentFailure(error?: string): boolean {
  return Boolean(error && /HTTP \d{3}/.test(error));
}

/** Existing employers, so a board we already read is never re-added. */
function existingCompanies(): Set<string> {
  return new Set(MOCK_JOBS.map((j) => j.company.trim().toLowerCase()));
}

/** Clip text to `max` characters at the nearest word boundary, marking the cut. */
function trimText(text: string, max: number): string {
  if (!text || text.length <= max) return text || '';
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

/**
 * Map a normalized posting onto the `Job` shape the dashboard components consume.
 *
 * `domain` is carried through so each posting records the employer's own careers URL in
 * `companyWebsiteUrl`. The card and modal deliberately prefer `sourceUrl` (the exact
 * posting) over this — see `utils/jobPostingUrl.ts` — but it keeps the fallback target on
 * the company's own site instead of an ATS host, and fixes logo-domain resolution when the
 * favicon fails.
 */
function toJob(job: NormalizedJob, domain: string): Job {
  return {
    companyWebsiteUrl: domain ? `https://${domain}/careers` : undefined,
    id: job.id,
    title: job.title,
    company: job.company,
    companyLogo: job.companyLogo || logoUrlForDomain(job.companySlug) || undefined,
    location: job.location || 'Location not specified',
    workplaceType: job.workplaceType,
    jobType: job.jobType,
    experienceLevel: job.experienceLevel,
    department: job.department,
    salary: job.salary
      ? {
          min: job.salary.min,
          max: job.salary.max,
          // The dashboard renders a currency glyph, and every other job in the feed uses '$'.
          currency: job.salary.currency === 'USD' ? '$' : job.salary.currency,
          period: job.salary.period,
        }
      : null,
    salarySummary: job.salarySummary,
    // ATS bodies run to ~7 KB on average and occasionally far more. The feed only ever shows a
    // preview, and `applyUrl` always links to the full posting, so the body is clipped at a
    // word boundary — otherwise the generated module is ~27 MB and gates the whole bundle.
    description: trimText(job.description, 1800),
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    benefits: job.benefits,
    skills: job.skills,
    // Recomputed at render time by JobCard; this is the stored fallback.
    postedDate: 'Recently posted',
    applyUrl: job.applyUrl,
    sourceProvider: job.provider,
    sourceUrl: job.sourceUrl,
    postedAt: job.postedAt,
    firstSeenAt: new Date().toISOString(),
  };
}

async function main() {
  const recon = JSON.parse(readFileSync('.tmp/recon-results.json', 'utf8')) as {
    resolved: ReconRow[];
  };

  const existing = existingCompanies();
  const targets = recon.resolved.filter(
    (r) => !FALSE_POSITIVES.has(r.name) && !existing.has(r.name.trim().toLowerCase()),
  );

  const skippedExisting = recon.resolved.filter((r) => existing.has(r.name.trim().toLowerCase()));
  console.log(`Existing feed employers: ${existing.size}`);
  console.log(`Skipping already-in-feed boards: ${skippedExisting.map((r) => r.name).join(', ') || '(none)'}`);
  console.log(`Fetching ${targets.length} new boards...\n`);

  const perCompany: Array<{ company: string; provider: string; slug: string; jobs: number; error?: string }> = [];
  const allJobs: Array<{ job: NormalizedJob; domain: string }> = [];
  const seen = new Set<string>();

  let cursor = 0;
  const CONCURRENCY = 6;

  async function worker() {
    while (cursor < targets.length) {
      const row = targets[cursor++];
      try {
        const jobs = await withRetry(() =>
          fetchSourceJobs({
            company: row.name,
            domain: row.domain,
            provider: row.provider as any,
            slug: row.slug as string,
            careersUrl: `https://${row.domain}/careers`,
            detection: (row.detection as any) || 'probe',
          }),
        );

        let kept = 0;
        for (const job of jobs) {
          // Posting-level dedupe: a company running two boards can list the same role twice.
          const key = `${job.company.toLowerCase()}|${job.title.toLowerCase()}|${(job.location || '').toLowerCase()}`;
          if (seen.has(key)) continue;
          seen.add(key);
          allJobs.push({ job, domain: row.domain });
          kept += 1;
        }

        perCompany.push({ company: row.name, provider: row.provider!, slug: row.slug!, jobs: kept });
        console.log(`  ${row.name.padEnd(20)} ${row.provider}:${row.slug} → ${kept} jobs`);
      } catch (err) {
        const message = (err as Error).message;
        perCompany.push({ company: row.name, provider: row.provider!, slug: row.slug!, jobs: 0, error: message });
        console.log(`  ${row.name.padEnd(20)} FAILED: ${message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));

  const freshJobs = allJobs.map(({ job, domain }) => toJob(job, domain));

  // Re-add the previous run's postings for any employer that answered with nothing this run
  // for a *transient* reason (network error, empty response). A board that returned a hard
  // HTTP status is genuinely gone, so its old postings are dropped rather than kept as ghosts.
  const previous = readPreviousJobs();
  const backfillNames = new Set(
    perCompany.filter((c) => c.jobs === 0 && !isPermanentFailure(c.error)).map((c) => c.company),
  );
  const backfilled = previous.filter((job) => backfillNames.has(job.company));
  if (backfilled.length) {
    console.log(
      `\nBackfilled ${backfilled.length} postings for ${backfillNames.size} employer(s) that failed transiently: ${[...backfillNames].join(', ')}`,
    );
  }

  const jobs = [...freshJobs, ...backfilled].sort(
    (a, b) => a.company.localeCompare(b.company) || a.title.localeCompare(b.title),
  );

  const header = `/**
 * AUTO-GENERATED by scripts/fetch-career-jobs.ts — do not edit by hand.
 *
 * Jobs read directly from the career pages of ${new Set(jobs.map((j) => j.company)).size} employers that were NOT
 * already represented in the feed. Generated ${new Date().toISOString()}.
 *
 * Sources: ${perCompany
    .filter((c) => c.jobs > 0)
    .map((c) => `${c.company} (${c.provider})`)
    .join(', ')}.
 *
 * Postings are de-duplicated by company+title+location at generation time.
 *
 * The array is emitted in chunks and concatenated. A single ~13 MB array literal drives the
 * TypeScript checker into "expression produces a union type that is too complex to
 * represent" (TS2590); splitting it keeps each literal small enough to infer.
 */

import type { Job } from '../types/job';

`;

  const CHUNK_SIZE = 200;
  const chunks: string[] = [];
  for (let i = 0; i < jobs.length; i += CHUNK_SIZE) {
    chunks.push(`const CHUNK_${i / CHUNK_SIZE}: Job[] = ${JSON.stringify(jobs.slice(i, i + CHUNK_SIZE), null, 2)};`);
  }
  const assembled =
    `export const CAREER_JOBS: Job[] = [\n` +
    chunks.map((_, i) => `  ...CHUNK_${i},`).join('\n') +
    `\n];\n`;

  writeFileSync('data/careerJobs.ts', `${header}${chunks.join('\n\n')}\n\n${assembled}`);
  writeFileSync('.tmp/fetch-report.json', JSON.stringify({ perCompany, totalJobs: jobs.length, companies: new Set(jobs.map((j) => j.company)).size }, null, 2));
  // Snapshot for the next run's backfill (see `readPreviousJobs`). Kept out of `data/` so the
  // shipped bundle stays the only committed artifact.
  writeFileSync(SNAPSHOT, JSON.stringify(jobs));

  const succeeded = perCompany.filter((c) => c.jobs > 0);
  const failed = perCompany.filter((c) => c.error || c.jobs === 0);
  console.log(`\n=== DONE ===`);
  console.log(`${jobs.length} jobs from ${succeeded.length} employers (${new Set(jobs.map((j) => j.company)).size} distinct)`);
  console.log(`Empty/failed: ${failed.map((c) => c.company).join(', ') || '(none)'}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
