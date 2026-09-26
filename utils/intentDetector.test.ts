import { describe, it, expect } from 'vitest';
import { detectUserIntent } from './intentDetector';
import { analyzeResumeState } from './resumeState';
import { createEmptyResume, ResumeData } from '../types';

describe('Phase 2: Deterministic User Intent Detection', () => {
  // ── 1. Intent Category Tests ────────────────────────────────────────────────
  describe('build_resume', () => {
    it('detects requests to create or build a new resume from scratch', () => {
      const phrases = [
        'Build my CV',
        'Create a resume for me',
        'I need a new resume',
        'Make me a resume from scratch',
        'Generate a new cv',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('build_resume');
        expect(res.confidence).toBeGreaterThanOrEqual(0.85);
      }
    });
  });

  describe('improve_entire_resume', () => {
    it('detects broad requests to improve or polish the entire document', () => {
      const phrases = [
        'Improve my CV',
        'Make my resume better',
        'Fix my resume',
        'Can you polish my entire resume?',
        'Strengthen my resume',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('improve_entire_resume');
        expect(res.confidence).toBeGreaterThanOrEqual(0.85);
      }
    });
  });

  describe('analyze_uploaded_resume', () => {
    it('detects requests to audit or evaluate an uploaded resume', () => {
      const phrases = [
        'Analyze this resume',
        'What is wrong with my uploaded CV?',
        'Review the resume I just uploaded',
        'Audit my uploaded resume',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('analyze_uploaded_resume');
        expect(res.confidence).toBeGreaterThanOrEqual(0.85);
      }
    });

    it('has boosted confidence when upload metadata indicates justUploaded', () => {
      const state = analyzeResumeState(createEmptyResume(), {
        justUploaded: true,
        uploadStatus: 'analyzed',
        filename: 'cv.pdf',
      });
      const res = detectUserIntent('Review this resume', state);
      expect(res.intent).toBe('analyze_uploaded_resume');
      expect(res.confidence).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('tailor_job', () => {
    it('detects requests to match, align, or target a specific job description', () => {
      const phrases = [
        'Tailor my resume to this job',
        'Match my CV to this JD',
        'Optimize my resume for this position',
        'Adapt my resume for this role',
        'Job Description: Must have 5+ years React and Node.js',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('tailor_job');
        expect(res.confidence).toBeGreaterThanOrEqual(0.9);
      }
    });
  });

  describe('add_experience', () => {
    it('detects requests to insert or add work history and jobs', () => {
      const phrases = [
        'Add another job',
        'Add my work experience',
        'I want to add a role',
        'Insert a new position at Acme Corp',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('add_experience');
        expect(res.targetSection).toBe('experience');
      }
    });
  });

  describe('add_skills', () => {
    it('detects requests to add or suggest skills', () => {
      const phrases = [
        'Add skills',
        'What skills should I add?',
        'Improve my skills section',
        'Add TypeScript and Python',
        'Suggest skills for my role',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('add_skills');
        expect(res.targetSection).toBe('skills');
      }
    });
  });

  describe('rewrite_section', () => {
    it('detects targeted requests to rewrite specific sections', () => {
      const cases = [
        { text: 'Rewrite my summary', target: 'summary' },
        { text: 'Rewrite my experience section', target: 'experience' },
        { text: 'Fix this education section', target: 'education' },
        { text: 'Improve the bullets under my current job', target: 'experience' },
        { text: 'Update my projects section', target: 'projects' },
      ];

      for (const c of cases) {
        const res = detectUserIntent(c.text);
        expect(res.intent).toBe('rewrite_section');
        expect(res.targetSection).toBe(c.target);
      }
    });
  });

  describe('optimize_ats', () => {
    it('detects ATS optimization requests', () => {
      const phrases = [
        'Make this ATS friendly',
        'Optimize my CV for ATS',
        'Improve the ATS score',
        'How does my resume score against ATS systems?',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('optimize_ats');
        expect(res.confidence).toBeGreaterThanOrEqual(0.9);
      }
    });
  });

  describe('improve_metrics', () => {
    it('detects requests to add quantitative results and measurable impact', () => {
      const phrases = [
        'Add measurable results',
        'Make my bullets more quantitative',
        'Improve the metrics in my experience',
        'Add numbers to my achievements',
        'Quantify my bullets with more impact',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('improve_metrics');
        expect(res.confidence).toBeGreaterThanOrEqual(0.9);
      }
    });
  });

  describe('confirm_action', () => {
    it('detects user confirmation and execution approval', () => {
      const phrases = [
        'Yes',
        'Do it',
        'Go ahead',
        'Proceed',
        'Go ahead and insert it',
        'Apply these changes',
        'Looks good',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase, null, { hasPendingAction: true });
        expect(res.intent).toBe('confirm_action');
        expect(res.confidence).toBeGreaterThanOrEqual(0.85);
      }
    });
  });

  describe('general_query', () => {
    it('falls back to general_query for broad questions and conversational greetings', () => {
      const phrases = [
        'What makes a good resume?',
        'What is the best resume format?',
        'Hello',
        'How are you today?',
      ];
      for (const phrase of phrases) {
        const res = detectUserIntent(phrase);
        expect(res.intent).toBe('general_query');
      }
    });
  });

  // ── 2. Edge Case Tests ──────────────────────────────────────────────────────
  describe('Edge cases', () => {
    it('handles empty string and pure whitespace gracefully', () => {
      expect(detectUserIntent('').intent).toBe('general_query');
      expect(detectUserIntent('    ').intent).toBe('general_query');
    });

    it('handles mixed capitalization and heavy punctuation', () => {
      expect(detectUserIntent('iMPROVE MY CV!!!').intent).toBe('improve_entire_resume');
      expect(detectUserIntent('TAILOR FOR THIS JOB...').intent).toBe('tailor_job');
      expect(detectUserIntent('add skills???').intent).toBe('add_skills');
    });

    it('prioritizes specific actionable intent over broad improve when multiple match', () => {
      const res = detectUserIntent('Tailor my resume and improve it for this job description');
      expect(res.intent).toBe('tailor_job');
    });

    it('distinguishes ATS questions from general skills questions', () => {
      expect(detectUserIntent('What skills are important for ATS?').intent).toBe('optimize_ats');
      expect(detectUserIntent('What skills should I add?').intent).toBe('add_skills');
    });
  });

  // ── 3. Resume State & Awareness Integration ────────────────────────────────
  describe('Integration with Resume State Analysis', () => {
    it('accurately couples empty resume state with build_resume intent', () => {
      const emptyResume = createEmptyResume();
      const state = analyzeResumeState(emptyResume);
      const intent = detectUserIntent('Build my resume', state);

      expect(state.contentState).toBe('EMPTY');
      expect(intent.intent).toBe('build_resume');
    });

    it('accurately couples partial resume state with improve_entire_resume intent', () => {
      const partialResume: ResumeData = {
        ...createEmptyResume(),
        fullName: 'Marcus Vance',
        experience: [
          {
            id: 'exp_1',
            company: 'Tech Corp',
            role: 'Lead Developer',
            startDate: '2020',
            endDate: 'Present',
            description: 'Built APIs',
          },
        ],
      };
      const state = analyzeResumeState(partialResume);
      const intent = detectUserIntent('Improve my CV', state);

      expect(state.contentState).toBe('PARTIAL');
      expect(intent.intent).toBe('improve_entire_resume');
    });

    it('tracks uploaded analyzed state correctly with analyze_uploaded_resume', () => {
      const state = analyzeResumeState(createEmptyResume(), {
        justUploaded: true,
        uploadStatus: 'analyzed',
        filename: 'marcus_cv.pdf',
      });
      const intent = detectUserIntent('What is wrong with my uploaded resume?', state);

      expect(state.uploadState).toBe('ANALYZED');
      expect(state.upload.justUploaded).toBe(true);
      expect(intent.intent).toBe('analyze_uploaded_resume');
    });

    it('tracks pending upload state so agent knows parsing is in flight', () => {
      const state = analyzeResumeState(createEmptyResume(), {
        justUploaded: true,
        uploadStatus: 'pending',
        filename: 'marcus_cv.pdf',
      });

      expect(state.uploadState).toBe('PENDING_ANALYSIS');
      expect(state.state).toBe('UPLOADED_PENDING_ANALYSIS');
    });
  });
});
