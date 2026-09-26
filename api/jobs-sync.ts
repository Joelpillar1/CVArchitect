import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import { getEnv, getSupabaseAdminConfig, isSupabaseAdminConfigured } from './lib/serverEnv';
import {
  fetchCompaniesJobs,
  summarizeSync,
  type CompanySyncResult,
  type JobSourceCompany,
} from './lib/jobs';
import { JOB_SOURCE_COMPANIES } from '../data/jobCompanies';

/**
 * POST /api/jobs-sync — ingest jobs from company career pages into Supabase.
 *
 * This is the write side of the feed. It is deliberately NOT user-facing: it is invoked by
 * a scheduler (Vercel Cron / GitHub Action) with a shared secret, because a full run reads
 * several megabytes per company and must never be triggerable by a browser session.
 *
 * Shaped by the realities of the upstream boards:
 *
 *  - **Idempotent.** Every row is upserted on `${provider}:${external_id}`, so a re-run
 *    after a partial failure converges rather than duplicating. Necessary because a run
 *    touching ~40 boards routinely exceeds a single serverless invocation.
 *  - **Failure-isolated.** A dead board, a renamed token or a 13 MB response that times out
 *    is reported per company; the run continues and records the error on that source row.
 *  - **Soft-delete.** Postings that vanish from a board are marked `is_active = false`
 *    rather than deleted, so `first_seen_at` history and any saved bookmarks survive. Only
 *    companies that synced *successfully* are reconciled this way — otherwise a transient
 *    outage would wipe the feed.
 *
 * Auth: `Authorization: Bearer $JOBS_SYNC_SECRET` (falls back to `CRON_SECRET`, which
 * Vercel Cron sends automatically).
 *
 * Method: both GET and POST are accepted. Vercel Cron issues GET requests, while POST is
 * used for manual runs and backfills — restricting to POST would leave the schedule broken
 * with a confusing 405.
 */

export const maxDuration = 300;

/**
 * Service-role client type for the untyped schema.
 *
 * Spelled out rather than derived via `ReturnType<typeof createClient>`: that helper
 * resolves against the function's last generic overload and yields a client whose schema is
 * `never`, which makes every `.from(...)` call untypeable.
 */
type AdminClient = SupabaseClient<any, 'public', any>;

/** Postings per Supabase request. Keeps a full-feed upsert under the request size limit. */
const UPSERT_CHUNK_SIZE = 400;

function readProvidedSecret(req: VercelRequest): string {
  const header = req.headers.authorization;
  if (typeof header === 'string' && header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }
  const alt = req.headers['x-jobs-sync-secret'];
  if (typeof alt === 'string') return alt.trim();
  const query = req.query?.secret;
  if (typeof query === 'string') return query.trim();
  return '';
}

/** Constant-time comparison so the shared secret cannot be probed by timing. */
function secretsMatch(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface JobsSyncBody {
  /** Restrict the run to specific company names — handy for testing one source. */
  only?: string[];
  /** Cap how many companies this run processes, for incremental backfills. */
  limit?: number;
  concurrency?: number;
  /** Skip the soft-delete reconciliation (useful when running a partial slice). */
  skipDeactivate?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  // GET is what Vercel Cron sends; POST is for manual/backfill runs.
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const expectedSecret = getEnv('JOBS_SYNC_SECRET', 'CRON_SECRET');
  if (!expectedSecret) {
    return res.status(500).json({
      error: 'Sync is not configured: set JOBS_SYNC_SECRET (or CRON_SECRET) in the environment.',
    });
  }
  if (!secretsMatch(readProvidedSecret(req), expectedSecret)) {
    return res.status(401).json({ error: 'Invalid sync credentials.' });
  }

  const config = getSupabaseAdminConfig();
  if (!isSupabaseAdminConfigured(config)) {
    return res.status(500).json({ error: 'Supabase admin credentials are not configured.' });
  }

  const startedAt = Date.now();
  // Cron GETs carry no body, so fall back to query params for the `only`/`limit` controls.
  const body: JobsSyncBody =
    req.method === 'GET'
      ? {
          only: typeof req.query?.only === 'string' ? req.query.only.split(',') : undefined,
          limit: req.query?.limit ? Number(req.query.limit) : undefined,
        }
      : ((req.body as JobsSyncBody) || {});
  const supabaseAdmin = createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const companies = await resolveCompaniesToSync(supabaseAdmin, body);
    if (!companies.length) {
      return res.status(200).json({ ok: true, message: 'No companies to sync.', summary: summarizeSync([]) });
    }

    // Collect per-company errors without letting one abort the batch.
    const failures: Array<{ company: string; error: string }> = [];

    const results = await fetchCompaniesJobs(companies, {
      concurrency: body.concurrency,
      onCompanyDone: (result) => {
        if (!result.ok && result.error) failures.push({ company: result.company, error: result.error });
      },
    });

    const upserted = await persistResults(supabaseAdmin, results, body.skipDeactivate === true);
    const summary = summarizeSync(results);

    console.log(
      `[jobs-sync] ${summary.jobs} jobs from ${summary.succeeded}/${summary.companies} companies ` +
        `(${summary.failed} failed) in ${Math.round((Date.now() - startedAt) / 1000)}s`,
    );

    return res.status(200).json({
      ok: true,
      summary: { ...summary, upserted, deactivated: upserted.deactivated },
      failures: failures.slice(0, 25),
      durationMs: Date.now() - startedAt,
      // Surfaced for curl/debug runs; a scheduler ignores it.
      details: results.map((r) => ({
        company: r.company,
        source: r.source ? `${r.source.provider}:${r.source.slug} (${r.source.detection})` : null,
        jobs: r.jobs.length,
        ok: r.ok,
        error: r.error,
      })),
    });
  } catch (err) {
    console.error('[jobs-sync] fatal error:', err);
    return res.status(500).json({ error: (err as Error).message || 'Job sync failed.' });
  }
}

/**
 * Decide which companies this run should touch.
 *
 * The seed list is the baseline, but companies discovered on previous runs are persisted in
 * `job_source_companies` and folded back in — otherwise automatic discovery would only ever
 * work once and every subsequent run would have to re-probe.
 */
async function resolveCompaniesToSync(
  supabaseAdmin: AdminClient,
  body: JobsSyncBody,
): Promise<JobSourceCompany[]> {
  const byKey = new Map<string, JobSourceCompany>();

  for (const company of JOB_SOURCE_COMPANIES) {
    byKey.set(company.name.toLowerCase(), company);
  }

  const { data: stored } = await supabaseAdmin
    .from('job_source_companies')
    .select('company, domain, provider, slug, careers_url')
    .eq('is_active', true);

  for (const row of stored || []) {
    const key = (row.company as string).toLowerCase();
    // The seed entry wins, since it carries an explicitly verified provider/slug.
    if (byKey.has(key)) continue;
    byKey.set(key, {
      name: row.company as string,
      domain: row.domain as string,
      provider: row.provider as JobSourceCompany['provider'],
      slug: row.slug as string,
      careersUrl: (row.careers_url as string) || undefined,
    });
  }

  let companies = [...byKey.values()];

  if (body.only?.length) {
    const wanted = new Set(body.only.map((n) => n.toLowerCase()));
    companies = companies.filter((c) => wanted.has(c.name.toLowerCase()));
  }
  if (typeof body.limit === 'number' && body.limit > 0) {
    companies = companies.slice(0, body.limit);
  }

  return companies;
}

/** Shape one normalized job into its `jobs` row. */
function toJobRow(job: CompanySyncResult['jobs'][number]) {
  return {
    id: job.id,
    external_id: job.externalId,
    provider: job.provider,
    company_slug: job.companySlug,
    title: job.title,
    company: job.company,
    company_logo: job.companyLogo,
    location: job.location,
    workplace_type: job.workplaceType,
    job_type: job.jobType,
    experience_level: job.experienceLevel,
    department: job.department,
    source_department: job.sourceDepartment || null,
    salary_min: job.salary?.min ?? null,
    salary_max: job.salary?.max ?? null,
    salary_currency: job.salary?.currency ?? null,
    salary_period: job.salary?.period ?? null,
    salary_summary: job.salarySummary,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    benefits: job.benefits,
    skills: job.skills,
    apply_url: job.applyUrl,
    source_url: job.sourceUrl,
    posted_at: job.postedAt,
    last_seen_at: new Date().toISOString(),
    is_active: true,
    raw: job.raw,
  };
}

/**
 * Write a sync run to Supabase.
 *
 * `first_seen_at` is intentionally omitted from the upsert payload: the column defaults on
 * insert and must not be overwritten on update, or "first seen" would silently become
 * "last seen" on every run.
 */
async function persistResults(
  supabaseAdmin: AdminClient,
  results: CompanySyncResult[],
  skipDeactivate: boolean,
): Promise<{ jobs: number; deactivated: number }> {
  const rows = results.flatMap((result) => result.jobs.map(toJobRow));

  let upserted = 0;
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK_SIZE) {
    const chunk = rows.slice(i, i + UPSERT_CHUNK_SIZE);
    const { error } = await supabaseAdmin.from('jobs').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`[jobs-sync] upsert failed for chunk @${i}:`, error.message);
      continue;
    }
    upserted += chunk.length;
  }

  // Record per-company sync health so broken boards are discoverable.
  const sourceRows = results
    .filter((result) => result.source)
    .map((result) => ({
      company: result.source!.company,
      domain: result.source!.domain,
      provider: result.source!.provider,
      slug: result.source!.slug,
      careers_url: result.source!.careersUrl,
      detection: result.source!.detection,
      is_active: true,
      last_synced_at: new Date().toISOString(),
      last_sync_status: result.ok ? 'ok' : 'error',
      last_sync_error: result.error || null,
      last_jobs_count: result.jobs.length,
      updated_at: new Date().toISOString(),
    }));

  if (sourceRows.length) {
    const { error } = await supabaseAdmin
      .from('job_source_companies')
      .upsert(sourceRows, { onConflict: 'provider,slug' });
    if (error) console.error('[jobs-sync] source status upsert failed:', error.message);
  }

  let deactivated = 0;
  if (!skipDeactivate) {
    for (const result of results) {
      // Only reconcile companies that actually answered. A failed fetch returns no jobs and
      // must not be read as "the company has no openings", which would hide the whole feed.
      if (!result.ok) continue;

      const seenIds = result.jobs.map((job) => job.id);
      let query = supabaseAdmin
        .from('jobs')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('company_slug', result.source?.slug || '');

      // PostgREST has no clean "NOT IN empty list", so guard the case where a board
      // returned jobs but all were filtered out during normalization.
      if (seenIds.length) query = query.not('id', 'in', `(${seenIds.map((id) => `"${id}"`).join(',')})`);

      const { data } = await query.select('id');
      deactivated += data?.length || 0;
    }
  }

  return { jobs: upserted, deactivated };
}
