import { describe, it, expect } from 'vitest';
import { CAREER_JOBS } from '../data/careerJobs';
import { MOCK_JOBS } from '../data/mockJobs';

/**
 * Guards for the generated career-page feed (`scripts/fetch-career-jobs.ts`).
 *
 * The generator is the only thing standing between a live ATS board and the job board, so
 * these assertions encode the two properties that actually matter and are easy to lose on a
 * regeneration: the data must be renderable, and it must contain postings we did not already
 * have.
 */

describe('Generated career-page job feed', () => {
  it('is non-empty and every posting is renderable', () => {
    expect(CAREER_JOBS.length).toBeGreaterThan(1000);

    for (const job of CAREER_JOBS) {
      expect(job.id, `job ${job.title} is missing an id`).toBeTruthy();
      expect(job.title.trim().length).toBeGreaterThan(0);
      expect(job.company.trim().length).toBeGreaterThan(0);
      expect(job.location.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(job.responsibilities)).toBe(true);
      expect(Array.isArray(job.requirements)).toBe(true);
      expect(Array.isArray(job.skills)).toBe(true);
      // Provenance must survive so the card can show "direct from source".
      expect(job.sourceProvider).toBeTruthy();
    }
  });

  it('contains no duplicate posting ids', () => {
    const ids = CAREER_JOBS.map((j) => j.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not repeat any employer already present in the existing feed', () => {
    const existing = new Set(MOCK_JOBS.map((j) => j.company.trim().toLowerCase()));
    const overlapping = [...new Set(CAREER_JOBS.map((j) => j.company))].filter((company) =>
      existing.has(company.trim().toLowerCase()),
    );

    expect(overlapping).toEqual([]);
  });

  it('contains no duplicate company + title + location posting', () => {
    const keys = CAREER_JOBS.map(
      (j) => `${j.company.toLowerCase()}|${j.title.toLowerCase()}|${j.location.toLowerCase()}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('spans a meaningful number of new employers', () => {
    const companies = new Set(CAREER_JOBS.map((j) => j.company));
    expect(companies.size).toBeGreaterThan(50);
  });
});
