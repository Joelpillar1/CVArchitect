import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { getCompetitor } from './comparisonData';
import {
  FIRST_RESUME_BULLET_EXAMPLES,
  FIRST_RESUME_CHECKLIST,
  FIRST_RESUME_MISTAKES,
  FIRST_RESUME_SECTIONS,
  FIRST_RESUME_WEEK_PLAN,
  FIRST_TIME_FAQS,
  FIRST_TIME_PICKS,
} from './firstTimeResumeData';

describe('first-time resume builder listicle data', () => {
  it('keeps the listicle at five distinct picks', () => {
    expect(FIRST_TIME_PICKS).toHaveLength(5);
    const names = FIRST_TIME_PICKS.map((pick) => pick.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('links every competitor pick to real comparison data', () => {
    for (const pick of FIRST_TIME_PICKS) {
      if (pick.slug === null) {
        expect(pick.name).toBe('Cvarchitect');
        continue;
      }
      expect(getCompetitor(pick.slug)?.name, pick.slug).toBe(pick.name);
    }
  });

  it('gives every pick complete, quotable copy', () => {
    for (const pick of FIRST_TIME_PICKS) {
      expect(pick.award.startsWith('Best for '), pick.name).toBe(true);
      expect(pick.summary.length, pick.name).toBeGreaterThan(80);
      expect(pick.bestFor.length, pick.name).toBeGreaterThan(10);
      expect(pick.whyItWorks.length, pick.name).toBeGreaterThan(60);
      expect(pick.watchOut.length, pick.name).toBeGreaterThan(30);
      expect(pick.href.startsWith('/'), pick.name).toBe(true);
    }
  });

  it('positions Cvarchitect for first-time writers and keeps Resume.io in examples', () => {
    const cvarchitect = FIRST_TIME_PICKS.find((pick) => pick.slug === null);
    expect(cvarchitect?.bestFor).toMatch(/first-time writers/i);

    const resumeIo = FIRST_TIME_PICKS.find((pick) => pick.slug === 'resume-io');
    expect(resumeIo).toBeDefined();
    expect(resumeIo?.award.toLowerCase()).not.toContain('first-time');
    expect(resumeIo?.bestFor.toLowerCase()).not.toContain('first-time');
    expect(resumeIo?.watchOut).toContain('not the first-time-writer winner');
  });

  it('does not publish a Cvarchitect template count', () => {
    const cvarchitect = FIRST_TIME_PICKS.find((pick) => pick.slug === null);
    expect(cvarchitect).toBeDefined();
    expect(
      `${cvarchitect?.summary} ${cvarchitect?.bestFor} ${cvarchitect?.whyItWorks} ${cvarchitect?.watchOut}`,
    ).not.toMatch(/\b\d+\s+(?:resume\s+)?templates\b/i);
  });

  it('gives every resume section a local image, descriptive alt text, and a caption', () => {
    expect(FIRST_RESUME_SECTIONS).toHaveLength(6);
    for (const section of FIRST_RESUME_SECTIONS) {
      expect(section.image.startsWith('/images/'), section.id).toBe(true);
      expect(section.imageAlt.length, section.id).toBeGreaterThan(30);
      expect(section.imageCaption.length, section.id).toBeGreaterThan(30);
      expect(section.aspect, section.id).toContain('/');
      expect(section.bullets.length, section.id).toBeGreaterThanOrEqual(3);
      const filePath = path.join(process.cwd(), 'public', section.image.replace(/^\//, ''));
      expect(existsSync(filePath), filePath).toBe(true);
    }
  });

  it('keeps the practical first-resume content populated', () => {
    expect(FIRST_RESUME_BULLET_EXAMPLES.length).toBeGreaterThanOrEqual(6);
    for (const example of FIRST_RESUME_BULLET_EXAMPLES) {
      expect(example.before.length).toBeGreaterThanOrEqual(10);
      expect(example.after.length).toBeGreaterThan(40);
      expect(example.source.length).toBeGreaterThan(3);
    }
    expect(FIRST_RESUME_CHECKLIST.length).toBeGreaterThanOrEqual(10);
    expect(FIRST_RESUME_MISTAKES.length).toBeGreaterThanOrEqual(6);
    expect(FIRST_RESUME_WEEK_PLAN).toHaveLength(7);
    for (const day of FIRST_RESUME_WEEK_PLAN) {
      expect(day.detail.length).toBeGreaterThan(60);
      expect(day.output.length).toBeGreaterThan(10);
    }
  });

  it('keeps every FAQ populated', () => {
    expect(FIRST_TIME_FAQS.length).toBeGreaterThanOrEqual(8);
    for (const faq of FIRST_TIME_FAQS) {
      expect(faq.q.length).toBeGreaterThan(20);
      expect(faq.a.length).toBeGreaterThan(80);
    }
  });

  it('avoids em-dashes in new copy', () => {
    const copy = [
      ...FIRST_TIME_PICKS.flatMap((pick) => [
        pick.award,
        pick.summary,
        pick.bestFor,
        pick.whyItWorks,
        pick.watchOut,
      ]),
      ...FIRST_RESUME_SECTIONS.flatMap((section) => [
        section.title,
        section.description,
        section.imageAlt,
        section.imageCaption,
        ...section.bullets,
      ]),
      ...FIRST_RESUME_BULLET_EXAMPLES.flatMap((example) => [
        example.before,
        example.after,
        example.source,
      ]),
      ...FIRST_RESUME_CHECKLIST,
      ...FIRST_RESUME_MISTAKES.flatMap((item) => [item.mistake, item.fix]),
      ...FIRST_RESUME_WEEK_PLAN.flatMap((day) => [day.day, day.title, day.detail, day.output]),
      ...FIRST_TIME_FAQS.flatMap((faq) => [faq.q, faq.a]),
    ].join('\n');
    expect(copy).not.toContain('\u2014');
  });
});
