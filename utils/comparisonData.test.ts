import { describe, it, expect } from 'vitest';
import {
  BEST_PICKS,
  COMPETITOR_COUNT,
  COMPETITOR_NAME_LIST,
  COMPETITOR_NAMES,
  COMPETITORS,
  getCompetitor,
} from './comparisonData';

describe('comparison data', () => {
  it('keeps competitor slugs and names unique', () => {
    const slugs = COMPETITORS.map((competitor) => competitor.slug);
    const names = COMPETITORS.map((competitor) => competitor.name);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('exposes a complete, human-readable competitor list', () => {
    expect(COMPETITOR_COUNT).toBe(COMPETITORS.length);
    expect(COMPETITOR_NAMES).toEqual(COMPETITORS.map((competitor) => competitor.name));
    for (const name of COMPETITOR_NAMES) {
      expect(COMPETITOR_NAME_LIST).toContain(name);
    }
  });

  it('includes the Zety comparison with verified pricing facts', () => {
    const zety = getCompetitor('zety');
    expect(zety).toBeDefined();
    expect(zety?.name).toBe('Zety');
    expect(zety?.freePlan).toContain('TXT');
    expect(zety?.entryPrice).toContain('$25.95');
    expect(zety?.lifetime).toBe('Not offered');
    expect(zety?.rows.some((row) => row.label === 'Free download format')).toBe(true);
  });

  it('includes the Jobscan comparison with verified pricing facts', () => {
    const jobscan = getCompetitor('jobscan');
    expect(jobscan).toBeDefined();
    expect(jobscan?.name).toBe('Jobscan');
    expect(jobscan?.freePlan).toContain('5 resume scans');
    expect(jobscan?.entryPrice).toContain('$49.95');
    expect(jobscan?.lifetime).toBe('Not offered');
    expect(jobscan?.rows.some((row) => row.label === 'Job tracker')).toBe(true);
  });

  it('keeps the Kickresume pricing aligned with its public pricing page', () => {
    const kickresume = getCompetitor('kickresume');
    expect(kickresume).toBeDefined();
    expect(kickresume?.name).toBe('Kickresume');
    expect(kickresume?.entryPrice).toContain('$24 per month');
    expect(kickresume?.entryPrice).toContain('$18 per month quarterly');
    expect(kickresume?.entryPrice).toContain('$8 per month yearly');
    // The old $19 / $9 / $4.50 figures were read from a stale page and must not return.
    expect(kickresume?.entryPrice).not.toContain('$4.50');
    expect(kickresume?.entryPrice).not.toContain('$19');
  });

  it('gives every competitor enough content for a complete page', () => {
    for (const competitor of COMPETITORS) {
      expect(competitor.shortAnswer.length, competitor.slug).toBeGreaterThan(80);
      expect(competitor.rows.length, competitor.slug).toBeGreaterThanOrEqual(4);
      expect(competitor.faqs.length, competitor.slug).toBeGreaterThanOrEqual(2);
      expect(competitor.theyWin.length, competitor.slug).toBeGreaterThanOrEqual(1);
      expect(competitor.weWin.length, competitor.slug).toBeGreaterThanOrEqual(1);
      expect(competitor.chooseThem.length, competitor.slug).toBeGreaterThanOrEqual(1);
      expect(competitor.chooseUs.length, competitor.slug).toBeGreaterThanOrEqual(1);
    }
  });

  it('keeps every comparison row fully populated and on an allowed edge', () => {
    for (const competitor of COMPETITORS) {
      for (const row of competitor.rows) {
        expect(row.label.length, competitor.slug).toBeGreaterThan(0);
        expect(row.us.length, competitor.slug).toBeGreaterThan(0);
        expect(row.them.length, competitor.slug).toBeGreaterThan(0);
        expect(['us', 'them', 'tie'], `${competitor.slug}: ${row.label}`).toContain(row.edge);
      }
    }
  });

  it('keeps every listicle pick linked to a real comparison or to Cvarchitect', () => {
    for (const pick of BEST_PICKS) {
      if (pick.slug === null) {
        expect(pick.name).toBe('Cvarchitect');
        continue;
      }
      expect(getCompetitor(pick.slug)?.name, pick.slug).toBe(pick.name);
    }
  });
});
