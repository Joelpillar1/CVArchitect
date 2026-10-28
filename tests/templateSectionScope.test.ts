import { describe, expect, it } from 'vitest';
import { INITIAL_DATA, type ResumeData } from '../types';
import {
  getVisibleSectionIds,
  getVisibleSectionTitles,
} from '../utils/sectionRegistry';
import { applyTemplateSectionDefaults } from '../utils/templateSectionDefaults';

/**
 * AI tailoring must work with the sections the selected template actually
 * renders. A template's default composition is a starting point, not a
 * capability limit: a Student resume starts without a Professional Summary, but
 * adding one puts it in the composition and therefore in the agent's scope.
 */
describe('template section scope', () => {
  const studentDefault = (): ResumeData =>
    applyTemplateSectionDefaults({ ...INITIAL_DATA, template: undefined }, 'student');

  it('a new resume starts with only the template default composition', () => {
    const student = studentDefault();
    const ids = getVisibleSectionIds(student);

    expect(student.sectionOrder).not.toContain('summary');
    expect(student.sectionOrder).not.toContain('achievements');
    expect(ids).not.toContain('summary');
    expect(ids).not.toContain('achievements');
    expect(ids).toContain('experience');
    expect(ids).toContain('skills');
    expect(ids).toContain('education');
  });

  it('includes a template-hidden section when the user explicitly adds it', () => {
    const student: ResumeData = {
      ...studentDefault(),
      sectionOrder: [...(studentDefault().sectionOrder || []), 'summary'],
      sectionVisibility: { summary: true },
    };

    expect(getVisibleSectionIds(student)).toContain('summary');
  });

  it('keeps the summary for templates that default to it', () => {
    const vanguard = applyTemplateSectionDefaults(
      { ...INITIAL_DATA, template: undefined },
      'vanguard'
    );
    const ids = getVisibleSectionIds(vanguard);

    expect(ids).toContain('summary');
    expect(ids).toContain('achievements');
    expect(ids).toContain('experience');
  });

  it('returns human-readable titles in display order', () => {
    const student = studentDefault();
    const titles = getVisibleSectionTitles(student);

    expect(titles).not.toContain('Professional Summary');
    // Titles are the ones the preview actually renders, including renames.
    expect(titles).toContain('Skills & Interests');
    expect(titles).toContain('Work Experience');
  });

  it('treats an explicit order as the composition (content alone does not add a section)', () => {
    const legacy: ResumeData = {
      ...INITIAL_DATA,
      template: 'vanguard',
      sectionOrder: ['summary', 'skills', 'experience'],
    };

    // keyAchievements still has sample content, but it is not in this
    // document's composition. The eye toggle / Add Section brings it back.
    expect(getVisibleSectionIds(legacy)).not.toContain('achievements');
  });
});
