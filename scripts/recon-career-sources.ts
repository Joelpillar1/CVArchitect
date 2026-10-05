/**
 * Recon runner: resolve every candidate company to a concrete ATS board and report it.
 *
 * Discovery-only, so it is cheap (fingerprint + light probe). The output decides which
 * companies the full fetch in `fetch-career-jobs.ts` will visit.
 *
 *   npx esbuild scripts/recon-career-sources.ts --bundle --platform=node --format=esm \
 *     --outfile=.tmp/recon.mjs && node .tmp/recon.mjs
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { discoverJobSource } from '../api/_lib/jobs';
import { CANDIDATE_COMPANIES } from './probe-career-sources';
import { AGENT_REACH_CANDIDATES } from './agent-reach-candidates';
import { AGENT_REACH_CANDIDATES_WAVE4 } from './agent-reach-candidates-wave4';
import { AGENT_REACH_CANDIDATES_WAVE5 } from './agent-reach-candidates-wave5';
import { AGENT_REACH_CANDIDATES_WAVE6 } from './agent-reach-candidates-wave6';
import { AGENT_REACH_CANDIDATES_WAVE7 } from './agent-reach-candidates-wave7';
import { AGENT_REACH_CANDIDATES_WAVE8 } from './agent-reach-candidates-wave8';
import { AGENT_REACH_CANDIDATES_WAVE9 } from './agent-reach-candidates-wave9';

/**
 * Every candidate list — the hand-curated set plus both Agent Reach discovery waves.
 * Deduplicated by domain so a company named in more than one place is probed once.
 */
const ALL_CANDIDATES = (() => {
  const seen = new Set<string>();
  const merged = [];
  for (const company of [
    ...CANDIDATE_COMPANIES,
    ...AGENT_REACH_CANDIDATES,
    ...AGENT_REACH_CANDIDATES_WAVE4,
    ...AGENT_REACH_CANDIDATES_WAVE5,
    ...AGENT_REACH_CANDIDATES_WAVE6,
    ...AGENT_REACH_CANDIDATES_WAVE7,
    ...AGENT_REACH_CANDIDATES_WAVE8,
    ...AGENT_REACH_CANDIDATES_WAVE9,
  ]) {
    const key = company.domain.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(company);
  }
  return merged;
})();

/**
 * Results stream to disk after every company so a slow/hung probe can never discard the work
 * already done — discovery across ~100 employers takes minutes and involves third-party
 * endpoints whose latency we do not control.
 */
const OUT = '.tmp/recon-results.json';

interface ReconRow {
  name: string;
  domain: string;
  provider?: string;
  slug?: string;
  detection?: string;
  error?: string;
}

async function main() {
  const rows = new Map<string, ReconRow>();
  let cursor = 0;
  let done = 0;

  // Resume from a previous run. Discovery is the expensive half of the pipeline (one
  // careers-page fetch plus up to a handful of board probes per company), so re-probing
  // boards that already resolved both wastes time and risks a transient network failure
  // demoting a company that was fine before. Only the resolved boards are seeded; an
  // unresolved company is retried in case a new ATS path has appeared for it.
  if (existsSync(OUT)) {
    try {
      const previous = JSON.parse(readFileSync(OUT, 'utf8')) as { resolved?: ReconRow[] };
      for (const row of previous.resolved || []) {
        if (row.provider) rows.set(row.name, row);
      }
      console.log(`Resuming: ${rows.size} board(s) already resolved, skipping their re-probe.`);
    } catch {
      console.log('Existing recon results were unreadable; starting fresh.');
    }
  }

  const flush = () => {
    const payload = {
      done,
      total: ALL_CANDIDATES.length,
      resolved: [...rows.values()].filter((r) => r.provider),
      unresolved: [...rows.values()].filter((r) => !r.provider),
    };
    writeFileSync(OUT, JSON.stringify(payload, null, 2));
  };

  async function worker() {
    while (cursor < ALL_CANDIDATES.length) {
      const company = ALL_CANDIDATES[cursor++];
      // Already resolved on a previous run — keep the proven board without re-probing.
      if (rows.has(company.name)) {
        done += 1;
        continue;
      }
      const row: ReconRow = { name: company.name, domain: company.domain };
      try {
        const { source } = await discoverJobSource(company);
        if (source && source.provider !== 'html') {
          row.provider = source.provider;
          row.slug = source.slug;
          row.detection = source.detection;
        }
      } catch (err) {
        row.error = (err as Error).message;
      }
      rows.set(company.name, row);
      done += 1;
      flush();
      console.log(`[${done}/${ALL_CANDIDATES.length}] ${company.name} → ${row.provider ? `${row.provider}:${row.slug}` : 'unresolved'}`);
    }
  }

  const CONCURRENCY = 12;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, ALL_CANDIDATES.length) }, worker));
  flush();

  // Discovery opens many keep-alive sockets and the event loop can outlive the last probe, so
  // without an explicit exit the run hangs after `flush()` — every invocation then waits out
  // the full shell timeout despite the work being finished and persisted.
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
