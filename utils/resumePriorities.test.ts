import { describe, it, expect } from 'vitest';
import { assessResumeQuality, getResumePriorities } from './resumePriorities';
import { analyzeResumeState } from './resumeState';
import { createEmptyResume, ResumeData } from '../types';

describe('Phase 4: Resume Quality Scoring & Priority Actions', () => {
  it('calculates low quality score on an empty resume', () => {
    const emptyResume = createEmptyResume();
    const score = assessResumeQuality(emptyResume);

    expect(score.completeness).toBe(0);
    expect(score.overallScore).toBeLessThan(35);
  });

  it('calculates higher quality scores for a complete, quantified resume', () => {
    const strongResume: ResumeData = {
      ...createEmptyResume(),
      fullName: 'Alice Walker',
      email: 'alice@example.com',
      jobTitle: 'Staff Infrastructure Engineer',
      summary: 'Staff Engineer with 10+ years designing distributed cloud architectures and microservices.',
      skills: 'Kubernetes, Go, AWS, Terraform, Docker, Python, Kafka',
      experience: [
        {
          id: 'exp_1',
          company: 'Cloud Scale',
          role: 'Staff Infrastructure Engineer',
          startDate: '2020-01',
          endDate: 'Present',
          description: 'Architected Kubernetes platform serving 2M+ active daily requests, reducing latency by 45ms.',
        },
      ],
      education: [
        {
          id: 'edu_1',
          institution: 'Stanford University',
          degree: 'MS Computer Science',
          graduationDate: '2018',
        },
      ],
    };

    const score = assessResumeQuality(strongResume);
    expect(score.completeness).toBe(100);
    expect(score.impact).toBeGreaterThanOrEqual(80);
    expect(score.overallScore).toBeGreaterThanOrEqual(80);
  });

  it('prioritizes adding a summary when experience exists but summary is empty', () => {
    const resumeNoSummary: ResumeData = {
      ...createEmptyResume(),
      fullName: 'Bob Smith',
      experience: [
        {
          id: 'exp_1',
          company: 'Acme',
          role: 'Developer',
          startDate: '2020',
          endDate: 'Present',
          description: 'Built React apps.',
        },
      ],
    };

    const state = analyzeResumeState(resumeNoSummary);
    const priorities = getResumePriorities(resumeNoSummary, state);

    expect(priorities.length).toBeGreaterThan(0);
    expect(priorities[0].action).toBe('ADD_SUMMARY');
    expect(priorities[0].priority).toBe('CRITICAL');
  });

  it('bounds priority actions to at most 4 items', () => {
    const partialResume: ResumeData = {
      ...createEmptyResume(),
      fullName: 'Charlie',
      experience: [
        {
          id: 'exp_1',
          company: 'Acme',
          role: 'Dev',
          startDate: '2020',
          endDate: 'Present',
          description: 'Worked on web features.',
        },
      ],
    };
    const state = analyzeResumeState(partialResume);
    const priorities = getResumePriorities(partialResume, state);

    expect(priorities.length).toBeLessThanOrEqual(4);
  });
});
