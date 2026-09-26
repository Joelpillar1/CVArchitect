import { describe, it, expect } from 'vitest';
import { INITIAL_DATA, type ResumeData } from '../types';
import { serializeResumeToText } from './resumeText';

function fixture(): ResumeData {
  return {
    ...INITIAL_DATA,
    fullName: 'Ada Lovelace',
    jobTitle: 'Backend Engineer',
    summary: 'Engineer who ships reliable services.',
    skills: 'Python, SQL, Kubernetes',
    experience: [
      {
        id: 'e1',
        company: 'Acme',
        role: 'Engineer',
        startDate: '2020-01',
        endDate: 'Present',
        description: ['Built a payments API', 'Cut latency by 40%'],
      },
    ],
    leadership: [
      { id: 'l1', company: 'OSS', role: 'Maintainer', startDate: '2019', endDate: '2021', description: ['Reviewed 200 PRs'] },
    ],
    education: [{ id: 'ed1', school: 'MIT', degree: 'BS CS', year: '2019' }],
    certifications: [{ id: 'c1', name: 'AWS SAA', issuer: 'Amazon', date: '2023' }],
    projects: [{ id: 'p1', name: 'Widgetizer', description: 'A CLI tool', technologies: 'Rust' }],
    languages: [{ id: 'lang1', language: 'French', proficiency: 'Fluent' }],
    keyAchievements: ['Won an internal hackathon'],
  };
}

describe('serializeResumeToText', () => {
  it('includes content from every populated section', () => {
    const text = serializeResumeToText(fixture());
    for (const needle of [
      'Ada Lovelace',
      'Backend Engineer',
      'ships reliable services',
      'Python, SQL, Kubernetes',
      'Built a payments API',
      'Cut latency by 40%',
      'Reviewed 200 PRs', // leadership bullets
      'Won an internal hackathon', // key achievements
      'Widgetizer',
      'Rust',
      'BS CS',
      'AWS SAA',
      'French',
    ]) {
      expect(text).toContain(needle);
    }
  });

  it('drops empty/whitespace values and never throws on sparse data', () => {
    const sparse: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Solo',
      jobTitle: '',
      summary: '   ',
      skills: '',
      experience: [],
      leadership: [],
      education: [],
      certifications: [],
      projects: [],
      languages: [],
      additionalInfo: [],
      keyAchievements: [],
    };
    const text = serializeResumeToText(sparse);
    expect(text).toBe('Solo');
  });

  it('handles legacy string bullet descriptions', () => {
    const legacy = fixture();
    legacy.experience[0].description = 'A single legacy bullet string';
    const text = serializeResumeToText(legacy);
    expect(text).toContain('A single legacy bullet string');
  });
});
