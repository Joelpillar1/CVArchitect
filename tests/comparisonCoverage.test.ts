import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { COMPETITORS, comparisonMetaDescription, comparisonMetaTitle } from '../utils/comparisonData';
import { COST_12_MONTHS, COMPETITOR_DEEP, getCompetitorDeep } from '../utils/comparisonDeepData';
import { seoMetadataProblems } from '../scripts/seoLimits.mjs';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/** Read a PNG's intrinsic size from the IHDR chunk. */
function pngSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  expect(bytes.subarray(0, 8)).toEqual(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('comparison coverage', () => {
  it('has deep content for every competitor, and no orphans', () => {
    for (const competitor of COMPETITORS) {
      expect(getCompetitorDeep(competitor.slug), competitor.slug).toBeTruthy();
    }
    expect(COMPETITOR_DEEP).toHaveLength(COMPETITORS.length);
  });

  it('has a screenshot file for every competitor', () => {
    for (const deep of COMPETITOR_DEEP) {
      const file = path.join(PUBLIC_DIR, deep.screenshot.src);
      expect(existsSync(file), `${deep.slug} -> ${deep.screenshot.src}`).toBe(true);
    }
  });

  it('declares the screenshot size the file actually has', () => {
    for (const deep of COMPETITOR_DEEP) {
      const file = path.join(PUBLIC_DIR, deep.screenshot.src);
      const actual = pngSize(file);
      expect(actual.width, `${deep.slug} width`).toBe(deep.screenshot.width ?? 1440);
      expect(actual.height, `${deep.slug} height`).toBe(deep.screenshot.height ?? 1000);
    }
  });

  it('has a 12-month cost bar for every competitor', () => {
    const slugs = COST_12_MONTHS.map((bar) => bar.slug).filter((slug): slug is string => slug !== null);
    for (const competitor of COMPETITORS) {
      expect(slugs, competitor.slug).toContain(competitor.slug);
    }
  });

  it('cites a source and a capture date on every screenshot', () => {
    for (const deep of COMPETITOR_DEEP) {
      expect(deep.screenshot.sourceUrl.startsWith('https://')).toBe(true);
      expect(deep.screenshot.captured).toMatch(/\d{4}/);
      expect(deep.screenshot.caption.length).toBeGreaterThan(40);
      expect(deep.screenshot.alt.length).toBeGreaterThan(20);
    }
  });

  it('publishes rows where the competitor wins', () => {
    for (const competitor of COMPETITORS) {
      expect(
        competitor.rows.some((row) => row.edge === 'them'),
        `${competitor.slug} has no row where the competitor wins`,
      ).toBe(true);
      expect(competitor.theyWin.length).toBeGreaterThan(0);
    }
  });

  it('keeps the 12-month chart sorted', () => {
    const amounts = COST_12_MONTHS.map((bar) => bar.amount);
    expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
  });

  it('passes the strict SEO limits on every comparison page', () => {
    for (const competitor of COMPETITORS) {
      expect(
        seoMetadataProblems({
          title: comparisonMetaTitle(competitor),
          description: comparisonMetaDescription(competitor),
        }),
        competitor.slug,
      ).toEqual([]);
    }
  });

  it('has no em-dashes in comparison copy', () => {
    const strings = COMPETITORS.flatMap((competitor) => [
      competitor.category,
      competitor.verdict,
      competitor.shortAnswer,
      competitor.freePlan,
      competitor.entryPrice,
      competitor.billing,
      competitor.lifetime,
      competitor.bestFor,
      ...competitor.rows.flatMap((row) => [row.label, row.us, row.them]),
      ...competitor.theyWin,
      ...competitor.weWin,
      ...competitor.chooseThem,
      ...competitor.chooseUs,
      ...competitor.faqs.flatMap((faq) => [faq.q, faq.a]),
    ]);

    const deepStrings = COMPETITOR_DEEP.flatMap((deep) => [
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
    ]);

    for (const value of [...strings, ...deepStrings]) {
      expect(value).not.toContain('\u2014');
    }
  });
});
