import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ResumeData } from '../types';

const { callAIJSON } = vi.hoisted(() => ({ callAIJSON: vi.fn() }));

vi.mock('../services/aiService', () => ({
  callAIJSON,
  callAIText: vi.fn(),
}));

import { tailorResumeToJob } from '../components/utils/aiEnhancer';

/**
 * The full-rewrite tailoring path keeps its top-level fields and returns
 * `changes` for every other visible section. This is what lets education,
 * certifications, languages, awards, and custom sections be tailored without
 * inventing a section the template does not render.
 */

function resume(): ResumeData {
  return {
    fullName: 'Ada Lovelace',
    jobTitle: 'Software Engineer',
    email: 'ada@example.com',
    phone: '555-0100',
    location: 'London',
    summary: 'Original summary',
    experience: [
      {
        id: 'e1',
        role: 'Software Engineer',
        company: 'Acme',
        startDate: '2020-01',
        endDate: 'Present',
        description: ['Built reliable systems'],
      },
    ],
    education: [
      { id: 'ed1', school: 'University of London', degree: 'BSc Computer Science', year: '2019' },
    ],
    skills: 'TypeScript, React',
    certifications: [
      { id: 'c1', name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2022' },
    ],
    customSections: {
      custom_test: {
        id: 'custom_test',
        title: 'Notes',
        contentType: 'text',
        content: 'Original note',
      },
    },
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications', 'custom_test'],
    sectionVisibility: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      certifications: true,
      custom_test: true,
    },
    template: 'free',
  } as ResumeData;
}

describe('tailorResumeToJob changes', () => {
  beforeEach(() => {
    callAIJSON.mockReset();
  });

  it('returns changes only for visible sections outside the top-level fields', async () => {
    callAIJSON.mockResolvedValue({
      summary: 'Tailored summary',
      experience: [{ description: '• Built tailored systems' }],
      skills: 'TypeScript, React, Node.js',
      changes: [
        {
          section: 'certifications',
          itemId: 'c1',
          field: 'name',
          original: 'AWS Solutions Architect',
          proposed: 'AWS Certified Solutions Architect',
          reason: 'Matches the job requirements',
        },
        {
          section: 'custom_test',
          original: 'Original note',
          proposed: 'Tailored note',
          reason: 'Matches the job requirements',
        },
        {
          section: 'summary',
          original: 'Original summary',
          proposed: 'Duplicate summary',
          reason: 'Top-level field already covers this',
        },
        {
          section: 'not_a_section',
          original: 'x',
          proposed: 'y',
          reason: 'Unknown section',
        },
      ],
    });

    const result = await tailorResumeToJob(resume(), 'Senior software engineer role');

    expect(result.summary).toBe('Tailored summary');
    expect(result.skills).toBe('TypeScript, React, Node.js');
    expect(result.changes?.map((change) => change.section)).toEqual([
      'certifications',
      'custom_test',
    ]);
    expect(result.changes?.[0].field).toBe('name');
    expect(result.changes?.[0].itemId).toBe('c1');
  });

  it('omits top-level fields the visible composition does not include', async () => {
    const student = resume();
    student.sectionOrder = ['education', 'experience', 'skills'];
    student.sectionVisibility = {
      education: true,
      experience: true,
      skills: true,
    };
    student.summary = 'Should not be tailored';

    callAIJSON.mockResolvedValue({
      summary: 'Invented summary',
      experience: [{ description: '• Built tailored systems' }],
      skills: 'TypeScript, React, Node.js',
      changes: [],
    });

    const result = await tailorResumeToJob(student, 'Junior engineer role');

    expect(result.summary).toBeUndefined();
    expect(result.experience).toHaveLength(1);
    expect(result.skills).toBe('TypeScript, React, Node.js');
  });
});
