import { describe, expect, it } from 'vitest';
import { INITIAL_DATA, type ResumeData } from '../types';
import type { ResumeChange } from '../types/resumeAgent';
import { applyResumeChange } from '../utils/resumeChangeApplier';

const change = (overrides: Partial<ResumeChange>): ResumeChange => ({
  id: 'c1',
  section: 'summary',
  original: '',
  proposed: 'Tailored text',
  reason: 'test',
  evidence: [],
  status: 'pending',
  timestamp: 0,
  ...overrides,
});

const base = (): ResumeData => ({
  ...INITIAL_DATA,
  leadership: [
    {
      id: 'lead_1',
      role: 'Community Lead',
      company: 'Open Source',
      location: '',
      startDate: '2022',
      endDate: 'Present',
      description: ['Built a community', 'Ran events'],
    },
  ],
  education: [
    {
      id: 'edu_1',
      school: 'State University',
      degree: 'BSc Computer Science',
      year: '2020',
      location: '',
    },
  ],
  certifications: [
    { id: 'cert_1', name: 'AWS Certified', issuer: 'Amazon', date: '2023' },
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'Resume Builder',
      description: 'Built a resume editor',
      technologies: 'React',
      link: '',
      date: '2024',
    },
  ],
  languages: [
    { id: 'lang_1', language: 'English', proficiency: 'Native' },
  ],
  additionalInfo: [
    { id: 'info_1', label: 'Volunteering', value: 'Local mentor' },
  ],
  awards: ['Employee of the Year'],
  coursework: 'Algorithms, Databases',
  customSections: {
    custom_text: {
      id: 'custom_text',
      title: 'Notes',
      contentType: 'text',
      content: 'Old note',
    },
    custom_bullets: {
      id: 'custom_bullets',
      title: 'Highlights',
      contentType: 'bullets',
      content: ['Old highlight'],
    },
    custom_kv: {
      id: 'custom_kv',
      title: 'Details',
      contentType: 'key_value',
      content: [{ id: 'kv_1', label: 'Clearance', value: 'None' }],
    },
  },
});

describe('applyResumeChange', () => {
  it('updates scalar sections', () => {
    const next = applyResumeChange(base(), change({ section: 'summary', proposed: 'New summary' }));
    expect(next.summary).toBe('New summary');
  });

  it('updates an experience bullet by itemId and bulletIndex', () => {
    const next = applyResumeChange(
      base(),
      change({
        section: 'experience',
        itemId: INITIAL_DATA.experience[0].id,
        bulletIndex: 0,
        proposed: 'Tailored bullet',
      })
    );
    expect(next.experience[0].description[0]).toBe('Tailored bullet');
  });

  it('updates leadership without touching experience', () => {
    const next = applyResumeChange(
      base(),
      change({
        section: 'leadership',
        itemId: 'lead_1',
        bulletIndex: 1,
        proposed: 'Tailored leadership bullet',
      })
    );
    expect(next.leadership?.[0].description[1]).toBe('Tailored leadership bullet');
    expect(next.experience[0].description[0]).toBe(INITIAL_DATA.experience[0].description[0]);
  });

  it('updates a structured education field', () => {
    const next = applyResumeChange(
      base(),
      change({ section: 'education', itemId: 'edu_1', field: 'degree', proposed: 'MSc Software Engineering' })
    );
    expect(next.education[0].degree).toBe('MSc Software Engineering');
    expect(next.education[0].school).toBe('State University');
  });

  it('updates a certification name by default', () => {
    const next = applyResumeChange(
      base(),
      change({ section: 'certifications', itemId: 'cert_1', proposed: 'AWS Solutions Architect' })
    );
    expect(next.certifications[0].name).toBe('AWS Solutions Architect');
  });

  it('updates a project description bullet', () => {
    const next = applyResumeChange(
      base(),
      change({ section: 'projects', itemId: 'proj_1', bulletIndex: 0, proposed: 'Tailored project bullet' })
    );
    expect(next.projects?.[0].description).toContain('Tailored project bullet');
  });

  it('updates a language proficiency', () => {
    const next = applyResumeChange(
      base(),
      change({ section: 'languages', itemId: 'lang_1', field: 'proficiency', proposed: 'Fluent' })
    );
    expect(next.languages?.[0].proficiency).toBe('Fluent');
  });

  it('updates a key-value item value', () => {
    const next = applyResumeChange(
      base(),
      change({ section: 'additional_information', itemId: 'info_1', proposed: 'Mentored 12 students' })
    );
    expect(next.additionalInfo?.[0].value).toBe('Mentored 12 students');
  });

  it('updates a root bullet list', () => {
    const next = applyResumeChange(
      base(),
      change({ section: 'achievements', bulletIndex: 0, proposed: 'Tailored achievement' })
    );
    expect(Array.isArray(next.keyAchievements)).toBe(true);
    expect((next.keyAchievements as string[])[0]).toBe('Tailored achievement');
  });

  it('updates awards by appending when no index is given', () => {
    const next = applyResumeChange(
      base(),
      change({ section: 'awards', proposed: 'Dean List' })
    );
    expect(next.awards).toContain('Dean List');
  });

  it('updates coursework as a scalar', () => {
    const next = applyResumeChange(
      base(),
      change({ section: 'coursework', proposed: 'Distributed Systems' })
    );
    expect(next.coursework).toBe('Distributed Systems');
  });

  it('updates custom text, bullet, and key-value sections', () => {
    const withText = applyResumeChange(
      base(),
      change({ section: 'custom_text', proposed: 'New note' })
    );
    expect(withText.customSections?.custom_text.content).toBe('New note');

    const withBullet = applyResumeChange(
      base(),
      change({ section: 'custom_bullets', bulletIndex: 0, proposed: 'New highlight' })
    );
    expect(withBullet.customSections?.custom_bullets.content).toEqual(['New highlight']);

    const withKv = applyResumeChange(
      base(),
      change({ section: 'custom_kv', itemId: 'kv_1', proposed: 'Active' })
    );
    expect((withKv.customSections?.custom_kv.content as any[])[0].value).toBe('Active');
  });
});
