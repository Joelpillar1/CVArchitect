import { describe, it, expect } from 'vitest';
import {
  AgentStreamEvent,
  formatProgressLabel,
} from '../types/agentEvents';
import { LiveResumeStreamSession } from '../services/agentClient';
import { INITIAL_DATA, type ResumeData } from '../types';
import type { ResumeOperation } from '../types/resumeOperations';

describe('Phase 9: Streaming and Live Resume Updates', () => {
  const mockResume: ResumeData = {
    ...INITIAL_DATA,
    fullName: 'David Hassel',
    experience: [
      {
        id: 'exp_1',
        company: 'Stripe',
        role: 'Software Engineer',
        startDate: '2021',
        endDate: 'Present',
        description: ['Initial bullet point'],
      },
    ],
  };

  // 1. User-Facing Progress Label Formatting (No Chain-of-Thought)
  it('formats structured events into clean user-facing progress labels', () => {
    const event1: AgentStreamEvent = {
      type: 'resume_analysis_completed',
      bulletCount: 6,
      skillCount: 8,
    };
    const p1 = formatProgressLabel(event1);
    expect(p1?.label).toContain('Resume analyzed (6 bullets, 8 skills)');
    expect(p1?.status).toBe('completed');

    const event2: AgentStreamEvent = {
      type: 'job_analysis_completed',
      jobTitle: 'Senior SRE',
      requirementCount: 5,
    };
    const p2 = formatProgressLabel(event2);
    expect(p2?.label).toContain('Job requirements identified for Senior SRE');

    const event3: AgentStreamEvent = {
      type: 'ats_check_completed',
      score: 92,
      keywordsMatched: 14,
    };
    const p3 = formatProgressLabel(event3);
    expect(p3?.label).toContain('ATS check passed');
    expect(p3?.label).toContain('score: 92%');

    const event4: AgentStreamEvent = {
      type: 'validation_failed',
      operationId: 'op_123',
      reason: 'Ungrounded metric 50% not found in verified evidence',
    };
    const p4 = formatProgressLabel(event4);
    expect(p4?.status).toBe('failed');
    expect(p4?.label).toContain('Validation blocked ungrounded claim');
  });

  // 2. Live Session Updates & Instant Rollback Protection
  it('applies live operations to working resume and supports atomic rollback', () => {
    const session = new LiveResumeStreamSession(mockResume);

    const op: ResumeOperation = {
      operationId: 'op_live_1',
      agentRunId: 'run_123',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'exp_1',
      bulletIndex: 0,
      value: 'Architected real-time streaming pipeline processing 10k events/sec',
      reason: 'Strengthen technical depth',
      evidence: ['Initial bullet point'],
    };

    const updated = session.applyLiveOperation(op);
    expect((updated.experience[0].description as string[])[0]).toBe(
      'Architected real-time streaming pipeline processing 10k events/sec'
    );
    expect(session.getAppliedOperations().length).toBe(1);

    // Rollback simulation (e.g. on stream interruption or user abort)
    const rolledBack = session.rollbackToOriginal();
    expect((rolledBack.experience[0].description as string[])[0]).toBe('Initial bullet point');
    expect(session.getAppliedOperations().length).toBe(0);
  });
});
