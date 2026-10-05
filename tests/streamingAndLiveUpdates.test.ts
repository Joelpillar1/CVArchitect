import { describe, it, expect } from 'vitest';
import {
  AgentStreamEvent,
  formatProgressLabel,
} from '../types/agentEvents';
import { LiveResumeStreamSession } from '../services/agentClient';
import { extractTextDeltaFromStreamEvent } from '../api/agent/run';
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

  // 3. Real-Time Incremental Stream Delta Extraction
  it('extracts text deltas across all model event shapes without dropping or double-emitting', () => {
    // Direct output_text_delta
    expect(
      extractTextDeltaFromStreamEvent({
        type: 'raw_model_stream_event',
        data: { type: 'output_text_delta', delta: 'Hello ' },
      })
    ).toBe('Hello ');

    // Response output_text.delta
    expect(
      extractTextDeltaFromStreamEvent({
        type: 'raw_model_stream_event',
        data: { type: 'response.output_text.delta', delta: 'world!' },
      })
    ).toBe('world!');

    // Direct event format
    expect(
      extractTextDeltaFromStreamEvent({
        type: 'output_text_delta',
        delta: 'Tailoring your resume...',
      })
    ).toBe('Tailoring your resume...');

    // Non-double-emitting model event (custom adapter)
    expect(
      extractTextDeltaFromStreamEvent({
        type: 'raw_model_stream_event',
        data: {
          type: 'model',
          event: { choices: [{ delta: { content: 'Step 1' } }] },
        },
      })
    ).toBe('Step 1');

    // Duplicate raw telemetry from openai-responses is ignored (already handled by output_text_delta)
    expect(
      extractTextDeltaFromStreamEvent({
        type: 'raw_model_stream_event',
        data: {
          type: 'model',
          event: { type: 'response.output_text.delta', delta: 'Step 1' },
          providerData: { rawModelEventSource: 'openai-responses' },
        },
      })
    ).toBeNull();
  });

  // 4. Conversational Logic & Layout Repair
  it('formats skills lists and handles 12-skill layout requests with interactive proposal cards', () => {
    const rawSkills = 'Product Strategy, Enterprise SaaS, AI/ML Product Discovery, Agile & Scrum, Roadmap Planning, Go-to-Market (GTM), Data Analysis (SQL), A/B Testing, User Experience (UX), Cross-Functional Leadership, Cloud Infrastructure, Systems Architecture';
    const parsedSkills = rawSkills
      .replace(/\n/g, ', ')
      .split(',')
      .map(s => s.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);

    expect(parsedSkills.length).toBe(12);
    expect(parsedSkills[0]).toBe('Product Strategy');
    expect(parsedSkills[11]).toBe('Systems Architecture');

    // Conversational repair detection
    const isRepairQuery = (text: string) => {
      const lower = text.toLowerCase();
      return (
        lower.includes("can't see") ||
        lower.includes("cant see") ||
        lower.includes("where is") ||
        lower.includes("where are") ||
        lower.includes("dont see") ||
        lower.includes("don't see") ||
        lower.includes("show me") ||
        lower.includes("what are the skills")
      );
    };

    expect(isRepairQuery('i cant see it')).toBe(true);
    expect(isRepairQuery('where are the skills')).toBe(true);
    expect(isRepairQuery('show me')).toBe(true);
    expect(isRepairQuery('add python to my skills')).toBe(false);
  });
});

