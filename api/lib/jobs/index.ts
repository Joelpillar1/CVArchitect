import type {
  AnyJobProvider,
  CompanySyncResult,
  JobSourceCompany,
  NormalizedJob,
  ResolvedJobSource,
} from './types';
import { PROVIDER_ADAPTERS } from './providers';
import { discoverJobSource, fetchWithTimeout, type FetchLike } from './discovery';

/**
 * Ingestion orchestrator.
 *
 * Turns a list of companies into normalized jobs, one company at a time. This is the only
 * module in the pipeline that both performs I/O and knows about providers, so the sync
 * endpoint above it stays a thin persistence layer.
 *
 * Failure isolation is a hard requirement: a single company with a dead board, a renamed
 * token, or a hanging request must not abort the run. Every company therefore resolves to
 * a `CompanySyncResult` — successes and errors alike — and the caller records per-company
 * status so bad sources can be pruned without losing the whole sync.
 */

export * from './types';
export * from './normalize';
export { PROVIDER_ADAPTERS, ALL_PROVIDERS } from './providers';
export {
  discoverJobSource,
  fingerprintCareersHtml,
  boardUrlFor,
  fetchWithTimeout,
} from './discovery';
export type { DiscoveryResult, FetchLike } from './discovery';

/** How many companies to fetch in parallel. Kept low to stay a good citizen with ATS APIs. */
const DEFAULT_CONCURRENCY = 5;

/** Fetch and normalize every job for one already-resolved source. */
export async function fetchSourceJobs(
  source: ResolvedJobSource,
  fetchImpl: FetchLike = fetch,
  timeoutMs?: number,
): Promise<NormalizedJob[]> {
  if (source.provider === 'html') {
    // Custom, hand-built careers page. Handled by the HTML fallback path, which needs a
    // headless browser and per-site parsing; not attempted by the JSON providers here.
    return [];
  }

  const adapter = PROVIDER_ADAPTERS[source.provider as Exclude<AnyJobProvider, 'html'>];
  if (!adapter) return [];

  const url = adapter.buildUrl(source.slug);
  const response = await fetchWithTimeout(url, {}, fetchImpl, timeoutMs);
  if (!response.ok) {
    throw new Error(`${source.provider}:${source.slug} returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  return adapter.normalize(payload, { name: source.company, domain: source.domain }, source.slug);
}

/**
 * Resolve, fetch and normalize one company.
 *
 * Never throws — a failure is reported as `{ ok: false, error }` so the sync can keep going
 * and mark that company's last-sync status.
 */
export async function fetchCompanyJobs(
  company: JobSourceCompany,
  fetchImpl: FetchLike = fetch,
): Promise<CompanySyncResult> {
  try {
    const { source, notes } = await discoverJobSource(company, fetchImpl);

    if (!source) {
      return {
        company: company.name,
        source: null,
        jobs: [],
        ok: false,
        error: notes.join(' | ') || 'No job source could be resolved.',
      };
    }

    const jobs = await fetchSourceJobs(source, fetchImpl);
    if (!jobs.length) {
      return {
        company: company.name,
        source,
        jobs: [],
        ok: false,
        error: `Resolved ${source.provider}:${source.slug} but it returned no jobs.`,
      };
    }

    return { company: company.name, source, jobs, ok: true };
  } catch (err) {
    return {
      company: company.name,
      source: null,
      jobs: [],
      ok: false,
      error: (err as Error).message || 'Unknown ingestion error',
    };
  }
}

/**
 * Fetch many companies with bounded concurrency.
 *
 * Sequential fetching would take minutes across a few hundred boards; unbounded parallelism
 * gets the caller rate-limited. A small worker pool is the middle ground, and the
 * concurrency limit is configurable so the cron job and an admin-triggered backfill can use
 * different settings.
 */
export async function fetchCompaniesJobs(
  companies: JobSourceCompany[],
  options: {
    fetchImpl?: FetchLike;
    concurrency?: number;
    onCompanyDone?: (result: CompanySyncResult) => void;
  } = {},
): Promise<CompanySyncResult[]> {
  const fetchImpl = options.fetchImpl || fetch;
  const concurrency = Math.max(1, Math.min(options.concurrency || DEFAULT_CONCURRENCY, 20));
  const results: CompanySyncResult[] = new Array(companies.length);
  let cursor = 0;

  async function worker() {
    while (cursor < companies.length) {
      const index = cursor++;
      const result = await fetchCompanyJobs(companies[index], fetchImpl);
      results[index] = result;
      options.onCompanyDone?.(result);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, companies.length) }, worker));
  return results;
}

/** Aggregate stats for a sync run's log line. */
export function summarizeSync(results: CompanySyncResult[]): {
  companies: number;
  succeeded: number;
  failed: number;
  jobs: number;
} {
  return {
    companies: results.length,
    succeeded: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    jobs: results.reduce((total, r) => total + r.jobs.length, 0),
  };
}
