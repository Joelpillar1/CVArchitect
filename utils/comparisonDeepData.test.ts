import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { COMPETITORS } from './comparisonData';
import {
  COMPETITOR_DEEP,
  COST_12_MONTHS,
  CVARCHITECT_PAID,
  DEEP_VERIFIED,
  getCompetitorDeep,
} from './comparisonDeepData';

const hasEmDash = (value: string) => value.includes('\u2014');
const hasOldBrandCasing = (value: string) => /CVArchitect|CV Architect/.test(value);

describe('comparison deep data', () => {
  it('has exactly one deep entry for every competitor', () => {
    expect(COMPETITOR_DEEP.length).toBe(COMPETITORS.length);
    for (const competitor of COMPETITORS) {
      expect(getCompetitorDeep(competitor.slug), competitor.slug).toBeDefined();
    }
  });

  it('gives every competitor enough depth for a long page', () => {
    for (const deep of COMPETITOR_DEEP) {
      expect(deep.headline.length, deep.slug).toBeGreaterThan(80);
      expect(deep.bestForDetail.length, deep.slug).toBeGreaterThan(120);
      expect(deep.deepDives.length, deep.slug).toBeGreaterThanOrEqual(6);
      expect(deep.freePlanTraps.length, deep.slug).toBeGreaterThanOrEqual(3);
      expect(deep.freePlanLines.length, deep.slug).toBeGreaterThanOrEqual(3);
      expect(deep.notFor.length, deep.slug).toBeGreaterThanOrEqual(3);
      expect(deep.deepFaqs.length, deep.slug).toBeGreaterThanOrEqual(3);
      expect(deep.related.length, deep.slug).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps every deep dive row fully populated and on an allowed edge', () => {
    for (const deep of COMPETITOR_DEEP) {
      for (const dive of deep.deepDives) {
        expect(dive.dimension.length, deep.slug).toBeGreaterThan(0);
        expect(dive.us.length, deep.slug).toBeGreaterThan(0);
        expect(dive.them.length, deep.slug).toBeGreaterThan(0);
        expect(['us', 'them', 'tie'], `${deep.slug}: ${dive.dimension}`).toContain(dive.edge);
      }
    }
  });

  it('matches the 12 month cost chart to each deep cost figure', () => {
    for (const deep of COMPETITOR_DEEP) {
      const bar = COST_12_MONTHS.find((item) => item.slug === deep.slug);
      expect(bar, deep.slug).toBeDefined();
      expect(bar?.amount, deep.slug).toBe(deep.cost.them12);
      expect(deep.cost.themLabel.length, deep.slug).toBeGreaterThan(0);
      expect(deep.cost.note.length, deep.slug).toBeGreaterThan(0);
    }
  });

  it('marks Cvarchitect as the one-time bar at the published price', () => {
    const us = COST_12_MONTHS.find((item) => item.us);
    expect(us).toBeDefined();
    expect(us?.name).toBe('Cvarchitect');
    expect(us?.amount).toBe(CVARCHITECT_PAID.annual);
    expect(us?.slug).toBeNull();
    expect(COST_12_MONTHS.filter((item) => item.us).length).toBe(1);
  });

  it('points every screenshot at a real file in public', () => {
    for (const deep of COMPETITOR_DEEP) {
      expect(deep.screenshot.src.startsWith('/images/compare/'), deep.slug).toBe(true);
      expect(deep.screenshot.captured, deep.slug).toBe(DEEP_VERIFIED);
      expect(deep.screenshot.sourceUrl.startsWith('https://'), deep.slug).toBe(true);
      expect(deep.screenshot.alt.length, deep.slug).toBeGreaterThan(40);
      expect(deep.screenshot.caption.length, deep.slug).toBeGreaterThan(40);
      const file = join(process.cwd(), 'public', deep.screenshot.src);
      expect(existsSync(file), `${deep.slug}: ${file}`).toBe(true);
    }
  });

  it('keeps copy free of em-dashes and old brand casing', () => {
    for (const deep of COMPETITOR_DEEP) {
      const strings = [
        deep.headline,
        deep.bestForDetail,
        ...deep.notFor,
        ...deep.freePlanLines,
        ...deep.freePlanTraps.flatMap((trap) => [trap.title, trap.detail]),
        ...deep.deepDives.flatMap((dive) => [dive.dimension, dive.us, dive.them]),
        deep.cost.themLabel,
        deep.cost.note,
        deep.screenshot.alt,
        deep.screenshot.caption,
        ...deep.deepFaqs.flatMap((faq) => [faq.q, faq.a]),
        ...deep.related.flatMap((link) => [link.title, link.detail]),
      ];
      for (const value of strings) {
        expect(hasEmDash(value), `${deep.slug}: ${value}`).toBe(false);
        expect(hasOldBrandCasing(value), `${deep.slug}: ${value}`).toBe(false);
      }
    }
  });
});
