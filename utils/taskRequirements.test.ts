import { describe, it, expect } from 'vitest';
import { resolveAgentTask, detectParsingQualityIssues } from './taskRequirements';
import { analyzeResumeState } from './resumeState';
import { detectUserIntent } from './intentDetector';
import { createEmptyResume, ResumeData } from '../types';

describe('Phase 4: Task Requirement Engine & Parsing Quality', () => {
  const samplePopulatedResume: ResumeData = {
    ...createEmptyResume(),
    fullName: 'Jane Doe',
    jobTitle: 'Senior Frontend Engineer',
    summary: 'Experienced engineer with 7+ years in React and TypeScript.',
    skills: 'React, TypeScript, Next.js, Redux',
    experience: [
      {
        id: 'exp_1',
        company: 'Stripe',
        role: 'Senior Frontend Engineer',
        startDate: '2021-01',
        endDate: 'Present',
        description: 'Led core dashboard architecture serving 500k+ business accounts.',
      },
    ],
    education: [
      {
        id: 'edu_1',
        institution: 'UC Berkeley',
        degree: 'BS Computer Science',
        graduationDate: '2019',
      },
    ],
  };

  // ── 1. Empty Resume vs Populated Resume Tasks ──────────────────────────────
  describe('build_resume task resolution', () => {
    it('requires target_role when resume is EMPTY and role is not mentioned', () => {
      const state = analyzeResumeState(createEmptyResume());
      const intent = detectUserIntent('Build my resume', state);
      const task = resolveAgentTask(intent, state, { message: 'Build my resume' });

      expect(task.canExecute).toBe(false);
      expect(task.missingInputs).toContain('target_role');
      expect(task.responseMode).toBe('ASK');
      expect(task.nextStep).toBe('REQUEST_INPUT');
    });

    it('can execute build_resume when resume already contains existing background', () => {
      const state = analyzeResumeState(samplePopulatedResume);
      const intent = detectUserIntent('Build my resume', state);
      const task = resolveAgentTask(intent, state, { message: 'Build my resume' });

      expect(task.canExecute).toBe(true);
      expect(task.missingInputs).toHaveLength(0);
      expect(task.responseMode).toBe('ACT');
      expect(task.nextStep).toBe('EXECUTE');
    });
  });

  // ── 2. Tailor Job Task Resolution ──────────────────────────────────────────
  describe('tailor_job task resolution', () => {
    it('requires job_description when none is provided or attached', () => {
      const state = analyzeResumeState(samplePopulatedResume);
      const intent = detectUserIntent('Tailor my resume to this job', state);
      const task = resolveAgentTask(intent, state, { message: 'Tailor my resume to this job', jobData: null });

      expect(task.canExecute).toBe(false);
      expect(task.missingInputs).toContain('job_description');
      expect(task.responseMode).toBe('ASK');
    });

    it('can execute tailor_job when job description is attached', () => {
      const state = analyzeResumeState(samplePopulatedResume);
      const intent = detectUserIntent('Tailor my resume to this job', state);
      const task = resolveAgentTask(intent, state, {
        message: 'Tailor my resume to this job',
        jobData: {
          title: 'Senior Frontend Engineer',
          descriptionText: 'Looking for a Senior Frontend Engineer with React and TypeScript experience.',
        },
      });

      expect(task.canExecute).toBe(true);
      expect(task.missingInputs).toHaveLength(0);
      expect(task.responseMode).toBe('ACT');
    });
  });

  // ── 3. Section Specific Requests ───────────────────────────────────────────
  describe('section specific task resolution', () => {
    it('correctly maps rewrite_section to targetSection (summary)', () => {
      const state = analyzeResumeState(samplePopulatedResume);
      const intent = detectUserIntent('Rewrite my summary', state);
      const task = resolveAgentTask(intent, state, { message: 'Rewrite my summary' });

      expect(task.canExecute).toBe(true);
      expect(task.targetSection).toBe('summary');
      expect(task.responseMode).toBe('ACT');
    });

    it('correctly maps add_experience with available role/company inputs', () => {
      const state = analyzeResumeState(samplePopulatedResume);
      const intent = detectUserIntent('Add my role at Google as Tech Lead', state);
      const task = resolveAgentTask(intent, state, { message: 'Add my role at Google as Tech Lead' });

      expect(task.canExecute).toBe(true);
      expect(task.responseMode).toBe('ACT');
    });
  });

  // ── 4. Confirmation Task Resolution ────────────────────────────────────────
  describe('confirm_action task resolution', () => {
    it('executes pending action when pendingAction is provided', () => {
      const state = analyzeResumeState(samplePopulatedResume);
      const intent = detectUserIntent('Yes, apply changes', state, { hasPendingAction: true });
      const task = resolveAgentTask(intent, state, {
        message: 'Yes, apply changes',
        pendingAction: {
          type: 'resume_mutation_batch',
          operations: [{ op: 'set_field', field: 'summary', value: 'Updated' }],
        },
      });

      expect(task.canExecute).toBe(true);
      expect(task.responseMode).toBe('CONFIRM');
      expect(task.nextStep).toBe('CONFIRM');
    });
  });

  // ── 5. Parsing Quality & Anomalies ─────────────────────────────────────────
  describe('detectParsingQualityIssues', () => {
    it('flags missing full name', () => {
      const corruptResume: ResumeData = {
        ...createEmptyResume(),
        fullName: '',
      };
      const result = detectParsingQualityIssues(corruptResume);
      expect(result.hasIssues).toBe(true);
      expect(result.flags).toContain('missing_full_name');
    });

    it('flags skills containing massive paragraph text', () => {
      const corruptResume: ResumeData = {
        ...samplePopulatedResume,
        skills: 'A'.repeat(600), // No commas, massive block
      };
      const result = detectParsingQualityIssues(corruptResume);
      expect(result.hasIssues).toBe(true);
      expect(result.flags).toContain('skills_contain_paragraph_text');
    });

    it('flags empty experience descriptions', () => {
      const corruptResume: ResumeData = {
        ...samplePopulatedResume,
        experience: [
          {
            id: 'exp_1',
            company: 'Acme',
            role: 'Dev',
            startDate: '2020',
            endDate: '2021',
            description: '',
          },
        ],
      };
      const result = detectParsingQualityIssues(corruptResume);
      expect(result.hasIssues).toBe(true);
      expect(result.flags).toContain('experience_bullets_empty');
    });
  });
});
