import { describe, it, expect } from 'vitest';
import { analyzeResume } from '../components/utils/resumeAnalytics';
import { createEmptyResume, ResumeData } from '../types';

/**
 * Regression suite for the "Create Resume from scratch" crash.
 *
 * Dashboard's onboarding modal used to spread a not-yet-assigned variable in
 * its scratch branch, so the editor received `{ jobTitle, source }` only —
 * no `experience` array. `analyzeResume` then threw
 * "Cannot read properties of undefined (reading 'length')" inside
 * calculateExperienceScore and the whole <Editor> tree unmounted.
 *
 * The creation flow is fixed at the source, but partial resume objects can
 * still reach analyzeResume (records saved by the old buggy flow, partial
 * imports, agent patches), so every data reader must tolerate missing fields.
 */
describe('analyzeResume robustness (partial / empty resume data)', () => {
  it('does not throw on a freshly created empty resume', () => {
    const data = createEmptyResume();
    const result = analyzeResume(data);

    expect(result.atsScore).toBeGreaterThanOrEqual(0);
    expect(result.atsScore).toBeLessThanOrEqual(100);
    expect(result.sectionScores.experience).toBe(0);
    expect(result.sectionScores.education).toBe(0);
  });

  it('does not throw on the exact partial shape the buggy scratch flow produced', () => {
    // What Dashboard used to save: job title + source, nothing else.
    const partial = { jobTitle: 'Professional Role', source: 'scratch' } as unknown as ResumeData;

    const result = analyzeResume(partial);

    expect(Number.isFinite(result.atsScore)).toBe(true);
    expect(result.sectionScores.experience).toBe(0);
    expect(result.sectionScores.personalInfo).toBe(0);
  });

  it('does not throw when experience is explicitly undefined', () => {
    const data: ResumeData = {
      ...createEmptyResume(),
      experience: undefined as unknown as ResumeData['experience'],
      summary: 'Product-minded engineer with a decade of experience.',
      skills: 'TypeScript, React, Node.js',
    };

    const result = analyzeResume(data);

    expect(result.sectionScores.experience).toBe(0);
    expect(Number.isFinite(result.jobMatchScore)).toBe(true);
    expect(Number.isFinite(result.atsScore)).toBe(true);
  });

  it('still scores a fully populated resume normally', () => {
    const data: ResumeData = {
      ...createEmptyResume(),
      fullName: 'Alexander Williams',
      email: 'alexander.williams@example.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/alexander-williams',
      location: 'Cincinnati, OH',
      summary: 'Software engineer with 6+ years building web platforms and leading cross-functional delivery.',
      skills: 'TypeScript, React, Node.js, PostgreSQL, AWS',
      experience: [
        {
          id: 'exp_1',
          company: 'Acme Corp',
          role: 'Senior Engineer',
          location: 'Cincinnati, OH',
          date: '2020 - Present',
          description: 'Led a team of 5 engineers shipping a platform serving 2M users.\nCut infrastructure costs by 30% via autoscaling.',
        },
        {
          id: 'exp_2',
          company: 'Globex',
          role: 'Engineer',
          location: 'Remote',
          date: '2017 - 2020',
          description: 'Built customer-facing dashboards used by 40k businesses daily.',
        },
      ],
      education: [
        {
          id: 'edu_1',
          school: 'University of Cincinnati',
          degree: 'B.S. Computer Science',
          location: 'Cincinnati, OH',
          date: '2013 - 2017',
        },
      ],
      jobDescription: 'Seeking a senior TypeScript engineer with React and AWS experience to lead platform initiatives.',
    };

    const result = analyzeResume(data);

    expect(result.sectionScores.experience).toBeGreaterThan(0);
    expect(result.sectionScores.education).toBeGreaterThan(0);
    expect(result.sectionScores.personalInfo).toBeGreaterThan(0);
    expect(result.atsScore).toBeGreaterThan(0);
  });
});
