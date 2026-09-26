import { describe, it, expect } from 'vitest';
import { getResponseMode, getResponseModeDirectives } from './responseMode';
import { analyzeResumeState } from './resumeState';
import { detectUserIntent } from './intentDetector';
import { createEmptyResume, ResumeData } from '../types';

describe('Phase 3: Deterministic Response Mode & Directives', () => {
  // ── 1. Response Mode Mapping Tests ──────────────────────────────────────────
  it('maps confirm_action to CONFIRM mode', () => {
    const intent = detectUserIntent('Yes, apply it', null, { hasPendingAction: true });
    const state = analyzeResumeState(createEmptyResume());
    const mode = getResponseMode(intent, state);

    expect(mode).toBe('CONFIRM');
  });

  it('maps build_resume on an EMPTY resume with no content to ASK mode', () => {
    const intent = detectUserIntent('Build my resume');
    const state = analyzeResumeState(createEmptyResume());
    const mode = getResponseMode(intent, state);

    expect(mode).toBe('ASK');
  });

  it('maps build_resume on a PARTIAL resume to ACT mode', () => {
    const partialResume: ResumeData = {
      ...createEmptyResume(),
      fullName: 'John Doe',
      jobTitle: 'Backend Engineer',
    };
    const intent = detectUserIntent('Build my resume');
    const state = analyzeResumeState(partialResume);
    const mode = getResponseMode(intent, state);

    expect(mode).toBe('ACT');
  });

  it('maps analyze_uploaded_resume to ANALYZE mode', () => {
    const intent = detectUserIntent('Analyze my uploaded CV');
    const state = analyzeResumeState(createEmptyResume(), {
      justUploaded: true,
      uploadStatus: 'analyzed',
      filename: 'cv.pdf',
    });
    const mode = getResponseMode(intent, state);

    expect(mode).toBe('ANALYZE');
  });

  it('maps general_query to ANSWER mode', () => {
    const intent = detectUserIntent('What makes a good executive summary?');
    const state = analyzeResumeState(createEmptyResume());
    const mode = getResponseMode(intent, state);

    expect(mode).toBe('ANSWER');
  });

  it('maps mutation intents (add_experience, add_skills, rewrite_section, improve_metrics, optimize_ats, tailor_job) to ACT mode', () => {
    const state = analyzeResumeState(createEmptyResume());

    const mutationPhrases = [
      'Add my job at Google',
      'Add React and TypeScript',
      'Rewrite my summary',
      'Make my bullets more quantitative',
      'Make this ATS friendly',
      'Tailor my resume to this job',
      'Improve my CV',
    ];

    for (const phrase of mutationPhrases) {
      const intent = detectUserIntent(phrase);
      const mode = getResponseMode(intent, state);
      expect(mode).toBe('ACT');
    }
  });

  // ── 2. Response Directives Tests ────────────────────────────────────────────
  describe('getResponseModeDirectives', () => {
    it('returns strict 1-sentence confirmation rule for ACT mode', () => {
      const directives = getResponseModeDirectives('ACT');
      expect(directives).toContain('RESPONSE_MODE: ACT');
      expect(directives).toContain('EXACTLY ONE short confirmation sentence');
      expect(directives).toContain('DO NOT explain your reasoning');
    });

    it('returns 3-bullet max rule for ANALYZE mode', () => {
      const directives = getResponseModeDirectives('ANALYZE');
      expect(directives).toContain('RESPONSE_MODE: ANALYZE');
      expect(directives).toContain('MAXIMUM 3 short bullet points');
      expect(directives).toContain('NO introductory paragraphs');
    });

    it('returns 3-sentence max rule for ANSWER mode', () => {
      const directives = getResponseModeDirectives('ANSWER');
      expect(directives).toContain('RESPONSE_MODE: ANSWER');
      expect(directives).toContain('MAXIMUM 3 short sentences');
    });

    it('returns single question rule for ASK mode', () => {
      const directives = getResponseModeDirectives('ASK');
      expect(directives).toContain('RESPONSE_MODE: ASK');
      expect(directives).toContain('EXACTLY ONE single, targeted question');
    });

    it('returns ultra-short confirmation rule for CONFIRM mode', () => {
      const directives = getResponseModeDirectives('CONFIRM');
      expect(directives).toContain('RESPONSE_MODE: CONFIRM');
      expect(directives).toContain('ultra-short confirmation');
      expect(directives).toContain('Zero explanation');
    });
  });
});
