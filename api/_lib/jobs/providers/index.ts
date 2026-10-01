import type { JobProvider, JobSourceCompany, NormalizedJob } from '../types';
import {
  ASHBY_PROVIDER,
  buildAshbyUrl,
  normalizeAshbyJobs,
} from './ashby';
import {
  GREENHOUSE_PROVIDER,
  buildGreenhouseUrl,
  normalizeGreenhouseJobs,
} from './greenhouse';
import { LEVER_PROVIDER, buildLeverUrl, normalizeLeverJobs } from './lever';

/**
 * Provider registry.
 *
 * Keeping the adapters behind one interface means `discovery.ts` can probe candidates
 * generically ("does this token exist on Lever?") and the sync loop never branches on
 * provider name. Adding SmartRecruiters/Workable later is a new file plus one entry here.
 *
 * These functions are pure — no network access — so they stay unit-testable.
 */
export interface ProviderAdapter {
  provider: JobProvider;
  /** Public board endpoint for a company token. */
  buildUrl(token: string): string;
  /** Map a raw board payload onto normalized jobs. */
  normalize(
    payload: unknown,
    company: Pick<JobSourceCompany, 'name' | 'domain'>,
    slug: string,
  ): NormalizedJob[];
}

export const PROVIDER_ADAPTERS: Record<JobProvider, ProviderAdapter> = {
  [GREENHOUSE_PROVIDER]: {
    provider: GREENHOUSE_PROVIDER,
    buildUrl: buildGreenhouseUrl,
    normalize: (payload, company, slug) =>
      normalizeGreenhouseJobs(payload as Parameters<typeof normalizeGreenhouseJobs>[0], company, slug),
  },
  [LEVER_PROVIDER]: {
    provider: LEVER_PROVIDER,
    buildUrl: buildLeverUrl,
    normalize: normalizeLeverJobs,
  },
  [ASHBY_PROVIDER]: {
    provider: ASHBY_PROVIDER,
    buildUrl: buildAshbyUrl,
    normalize: (payload, company, slug) =>
      normalizeAshbyJobs(payload as Parameters<typeof normalizeAshbyJobs>[0], company, slug),
  },
};

export const ALL_PROVIDERS: JobProvider[] = [
  GREENHOUSE_PROVIDER,
  LEVER_PROVIDER,
  ASHBY_PROVIDER,
];

export { ASHBY_PROVIDER, GREENHOUSE_PROVIDER, LEVER_PROVIDER };
