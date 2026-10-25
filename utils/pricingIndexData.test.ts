import { describe, expect, it } from 'vitest';
import { COMPETITORS } from './comparisonData';
import { seoMetadataProblems } from '../scripts/seoLimits.mjs';
import {
  PRICING_INDEX_CHEAPEST,
  PRICING_INDEX_CVARCHITECT,
  PRICING_INDEX_FAQS,
  PRICING_INDEX_FINDINGS,
  PRICING_INDEX_META_DESCRIPTION,
  PRICING_INDEX_META_TITLE,
  PRICING_INDEX_MOST_EXPENSIVE,
  PRICING_INDEX_ONE_TIME_COUNT,
  PRICING_INDEX_ROWS,
  PRICING_INDEX_SHORT_ANSWER,
  PRICING_INDEX_SPREAD,
  PRICING_INDEX_SUBSCRIPTION_ONLY,
  PRICING_INDEX_TOOL_COUNT,
  formatUsd,
} from './pricingIndexData';

describe('pricing index data', () => {
  it('lists every competitor plus Cvarchitect, and nothing else', () => {
    expect(PRICING_INDEX_TOOL_COUNT).toBe(COMPETITORS.length + 1);
    expect(PRICING_INDEX_ROWS).toHaveLength(PRICING_INDEX_TOOL_COUNT);

    const slugs = PRICING_INDEX_ROWS.map((row) => row.slug).filter((slug): slug is string => slug !== null);
    expect(new Set(slugs).size).toBe(COMPETITORS.length);
    for (const competitor of COMPETITORS) {
      expect(slugs).toContain(competitor.slug);
    }
  });

  it('is ordered by 12-month cost, cheapest first', () => {
    const costs = PRICING_INDEX_ROWS.map((row) => row.twelveMonthCost);
    const sorted = [...costs].sort((a, b) => a - b);
    expect(costs).toEqual(sorted);
    expect(PRICING_INDEX_CHEAPEST.twelveMonthCost).toBe(Math.min(...costs));
    expect(PRICING_INDEX_MOST_EXPENSIVE.twelveMonthCost).toBe(Math.max(...costs));
  });

  it('records the verified headline figures', () => {
    expect(PRICING_INDEX_CHEAPEST.name).toBe('Zety');
    expect(PRICING_INDEX_CHEAPEST.twelveMonthCost).toBe(71.4);
    expect(PRICING_INDEX_MOST_EXPENSIVE.name).toBe('Jobscan');
    expect(PRICING_INDEX_MOST_EXPENSIVE.twelveMonthCost).toBe(359.8);
    expect(PRICING_INDEX_CVARCHITECT.twelveMonthCost).toBe(99);
    expect(PRICING_INDEX_SPREAD).toBeCloseTo(288.4, 2);
  });

  it('counts one-time plans honestly', () => {
    expect(PRICING_INDEX_ONE_TIME_COUNT).toBe(2);
    expect(PRICING_INDEX_SUBSCRIPTION_ONLY).toBe(PRICING_INDEX_TOOL_COUNT - 2);
  });

  it('sources every row to a real https pricing page and links internally', () => {
    for (const row of PRICING_INDEX_ROWS) {
      expect(row.sourceUrl.startsWith('https://')).toBe(true);
      expect(row.sourceUrl).toMatch(/pricing/i);
      expect(row.freePlan.length).toBeGreaterThan(0);
      expect(row.entryPrice.length).toBeGreaterThan(0);
      expect(row.renewal.length).toBeGreaterThan(0);
      expect(row.twelveMonthBasis.length).toBeGreaterThan(0);
      expect(row.sourceLabel.length).toBeGreaterThan(0);

      if (row.slug) {
        expect(row.href).toBe(`/compare/${row.slug}`);
      } else {
        expect(row.href).toBe('/pricing');
        expect(row.us).toBe(true);
      }
    }
  });

  it('does not promise a ranking Cvarchitect does not hold', () => {
    expect(PRICING_INDEX_CHEAPEST.us).toBe(false);
    expect(PRICING_INDEX_CVARCHITECT.twelveMonthCost).toBeGreaterThan(PRICING_INDEX_CHEAPEST.twelveMonthCost);
    const index = PRICING_INDEX_ROWS.findIndex((row) => row.us);
    expect(index).toBe(2);
  });

  it('contains no em-dashes in any generated copy', () => {
    const strings = [
      PRICING_INDEX_SHORT_ANSWER,
      ...PRICING_INDEX_FINDINGS,
      ...PRICING_INDEX_FAQS.flatMap((faq) => [faq.q, faq.a]),
      ...PRICING_INDEX_ROWS.flatMap((row) => [row.freePlan, row.entryPrice, row.renewal, row.twelveMonthBasis]),
    ];
    for (const value of strings) {
      expect(value).not.toContain('\u2014');
    }
  });

  it('passes the SEO title and description limits', () => {
    expect(
      seoMetadataProblems({ title: PRICING_INDEX_META_TITLE, description: PRICING_INDEX_META_DESCRIPTION }),
    ).toEqual([]);
  });

  it('formats money with cents only when present', () => {
    expect(formatUsd(71.4)).toBe('$71.40');
    expect(formatUsd(99)).toBe('$99');
    expect(formatUsd(359.8)).toBe('$359.80');
    expect(formatUsd(320.39)).toBe('$320.39');
    expect(formatUsd(1234.5)).toBe('$1,234.50');
  });
});
