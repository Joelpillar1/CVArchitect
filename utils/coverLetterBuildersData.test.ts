import { describe, it, expect } from 'vitest';
import { getCompetitor } from './comparisonData';
import { COVER_LETTER_FAQS, COVER_LETTER_PICKS } from './coverLetterBuildersData';

describe('cover letter builder listicle data', () => {
  it('keeps the listicle at five distinct picks', () => {
    expect(COVER_LETTER_PICKS).toHaveLength(5);
    const names = COVER_LETTER_PICKS.map((pick) => pick.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('links every competitor pick to real comparison data', () => {
    for (const pick of COVER_LETTER_PICKS) {
      if (pick.slug === null) {
        expect(pick.name).toBe('Cvarchitect');
        continue;
      }
      expect(getCompetitor(pick.slug)?.name, pick.slug).toBe(pick.name);
    }
  });

  it('gives every pick complete, quotable copy', () => {
    for (const pick of COVER_LETTER_PICKS) {
      expect(pick.award.startsWith('Best for '), pick.name).toBe(true);
      expect(pick.summary.length, pick.name).toBeGreaterThan(80);
      expect(pick.price.length, pick.name).toBeGreaterThan(10);
      expect(pick.bestFor.length, pick.name).toBeGreaterThan(10);
      expect(pick.href.startsWith('/'), pick.name).toBe(true);
    }
  });

  it('does not publish a Cvarchitect template count', () => {
    const cvarchitect = COVER_LETTER_PICKS.find((pick) => pick.slug === null);
    expect(cvarchitect).toBeDefined();
    expect(`${cvarchitect?.summary} ${cvarchitect?.price} ${cvarchitect?.bestFor}`).not.toMatch(
      /\b\d+\s+(?:cover letter\s+)?templates\b/i,
    );
  });

  it('keeps every FAQ populated', () => {
    expect(COVER_LETTER_FAQS.length).toBeGreaterThanOrEqual(5);
    for (const faq of COVER_LETTER_FAQS) {
      expect(faq.q.length).toBeGreaterThan(20);
      expect(faq.a.length).toBeGreaterThan(80);
    }
  });

  it('avoids em-dashes in new copy', () => {
    const copy = [
      ...COVER_LETTER_PICKS.flatMap((pick) => [pick.award, pick.summary, pick.price, pick.bestFor]),
      ...COVER_LETTER_FAQS.flatMap((faq) => [faq.q, faq.a]),
    ].join('\n');
    expect(copy).not.toContain('\u2014');
  });
});
