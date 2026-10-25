import { describe, it, expect } from 'vitest';
import { ROLE_GUIDES, getRoleGuide, getRelatedRoleGuides } from '../utils/roleTemplates';
import { ROLE_PREVIEWS_BY_SLUG } from '../utils/rolePreviewData';
import { TEMPLATE_CONFIG } from '../utils/templateConfig';
import { seoMetadataProblems } from '../scripts/seoLimits.mjs';

const REQUIRED_SLUGS = [
  'nurse',
  'software-engineer',
  'teacher',
  'data-analyst',
  'project-manager',
  'customer-service',
];

function stringsOf(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringsOf);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(stringsOf);
  }
  return [];
}

describe('Role template guides', () => {
  it('covers the six required roles exactly once', () => {
    const slugs = ROLE_GUIDES.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of REQUIRED_SLUGS) {
      expect(slugs).toContain(slug);
    }
  });

  it('uses URL-safe slugs', () => {
    for (const guide of ROLE_GUIDES) {
      expect(guide.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('picks only templates that exist in the gallery', () => {
    const ids = new Set(TEMPLATE_CONFIG.map((template) => template.id));
    for (const guide of ROLE_GUIDES) {
      expect(guide.templatePicks.length).toBe(3);
      for (const pick of guide.templatePicks) {
        expect(ids.has(pick.id)).toBe(true);
      }
    }
  });

  it('links only to roles that exist', () => {
    const slugs = new Set(ROLE_GUIDES.map((guide) => guide.slug));
    for (const guide of ROLE_GUIDES) {
      expect(guide.related.length).toBe(3);
      for (const slug of guide.related) {
        expect(slugs.has(slug)).toBe(true);
      }
      expect(guide.related).not.toContain(guide.slug);
    }
  });

  it('resolves helpers correctly', () => {
    expect(getRoleGuide('nurse')?.role).toBe('Nurse');
    expect(getRoleGuide('does-not-exist')).toBeUndefined();
    expect(getRelatedRoleGuides(getRoleGuide('nurse')!).length).toBe(3);
  });

  it('keeps copy specific and complete', () => {
    for (const guide of ROLE_GUIDES) {
      expect(guide.h1[0].length).toBeGreaterThan(10);
      expect(guide.h1[1].length).toBeGreaterThan(5);
      expect(guide.intro.length).toBeGreaterThan(150);
      expect(guide.lookFor.length).toBeGreaterThanOrEqual(4);
      expect(guide.bullets.length).toBeGreaterThanOrEqual(4);
      expect(guide.keywords.length).toBeGreaterThanOrEqual(10);
      expect(guide.mistakes.length).toBeGreaterThanOrEqual(3);
      expect(guide.faqs.length).toBeGreaterThanOrEqual(4);
      // Strict SEO limits: 15-60 chars title, 70-160 description. The brand
      // suffix is dropped when it does not fit, so it is not required here.
      expect(
        seoMetadataProblems({ title: guide.metaTitle, description: guide.metaDescription }),
        guide.slug,
      ).toEqual([]);
    }
  });

  it('never uses an em-dash or a template count', () => {
    for (const guide of ROLE_GUIDES) {
      for (const value of stringsOf(guide)) {
        expect(value).not.toContain('\u2014');
        expect(value).not.toMatch(/\b\d+\+?\s*(templates?|layouts?)\b/i);
      }
    }
  });
});

describe('Role preview data', () => {
  it('has a complete sample resume for every role', () => {
    for (const guide of ROLE_GUIDES) {
      const preview = ROLE_PREVIEWS_BY_SLUG[guide.slug];
      expect(preview).toBeDefined();
      expect(preview.fullName.length).toBeGreaterThan(3);
      expect(preview.jobTitle.length).toBeGreaterThan(3);
      expect(preview.summary.length).toBeGreaterThan(60);
      expect(preview.experience.length).toBeGreaterThanOrEqual(2);
      expect(preview.education.length).toBeGreaterThanOrEqual(1);
      expect(preview.skills.length).toBeGreaterThan(30);
      expect(preview.certifications.length).toBeGreaterThanOrEqual(1);
      for (const experience of preview.experience) {
        expect(experience.description.length).toBeGreaterThanOrEqual(2);
        expect(experience.company.length).toBeGreaterThan(1);
      }
    }
  });

  it('keeps preview copy free of em-dashes', () => {
    for (const preview of Object.values(ROLE_PREVIEWS_BY_SLUG)) {
      for (const value of stringsOf(preview)) {
        expect(value).not.toContain('\u2014');
      }
    }
  });

  it('does not reuse one persona title across all roles', () => {
    const titles = Object.values(ROLE_PREVIEWS_BY_SLUG).map((preview) => preview.jobTitle);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
