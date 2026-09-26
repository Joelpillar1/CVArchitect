import { describe, it, expect } from 'vitest';
import { RunContext } from '@openai/agents';
import { INITIAL_DATA, type ResumeData } from '../../types';
import type { JobDescriptionData } from '../../types/resumeAgent';
import type { AgentSSEEvent } from '../../types/resumeOperations';
import { getAgent, type AgentRunContext } from './agentDefinition';

/**
 * Agent tool tests — instruction.md §36.
 *
 * These drive the REAL tool implementations from agentDefinition.ts through the
 * SDK's `invoke` boundary (JSON-string input → zod parse → execute), with a fake
 * run context whose `emit` collects SSE events. No OpenAI API key or network is
 * involved: `getAgent()` only constructs the agent, and we never call `run()`.
 */

/** Structural view of a tool so tests don't depend on SDK internals. */
interface InvocableTool {
  name: string;
  invoke: (runContext: RunContext<AgentRunContext>, input: string) => Promise<unknown>;
}

function toolOf(name: string): InvocableTool {
  const agent = getAgent('gpt-4o');
  const t = agent.tools.find((x) => (x as { name?: string }).name === name);
  if (!t) throw new Error(`Missing tool: ${name}`);
  return t as unknown as InvocableTool;
}

/** A compact, deterministic resume fixture. */
function fixture(): ResumeData {
  return {
    ...INITIAL_DATA,
    fullName: 'Ada Lovelace',
    jobTitle: 'Senior Product Manager',
    summary: 'Product manager with 8 years of experience running A/B tests and user research.',
    skills: 'SQL, Figma',
    experience: [
      {
        id: 'e1',
        company: 'Acme',
        role: 'Senior Product Manager',
        location: 'London',
        startDate: '2021-03',
        endDate: 'Present',
        description: ['Ran A/B testing experiments', 'Led cross-functional teams'],
      },
    ],
    education: [{ id: 'ed1', school: 'MIT', degree: 'BS CS', year: '2019' }],
    certifications: [],
    projects: [],
    leadership: [],
    keyAchievements: ['Grew activation by 18%'],
    languages: [],
  };
}

function makeContext(
  resume: ResumeData,
  jobData: JobDescriptionData | null = null,
  facts: Array<{ topic: string; value: string }> = [],
) {
  const events: AgentSSEEvent[] = [];
  const ctx: AgentRunContext = {
    agentRunId: 'run_test_1',
    resume,
    jobData,
    facts,
    emit: (e) => events.push(e),
    opSeq: 0,
  };
  return { ctx, events, rc: new RunContext<AgentRunContext>(ctx) };
}

/** All flat propose_operation fields present-but-nullable, like the model emits. */
function proposeInput(overrides: Record<string, unknown>): string {
  return JSON.stringify({
    op: 'set_field',
    reason: 'test',
    evidence: [],
    field: null,
    value: null,
    section: null,
    itemId: null,
    bulletIndex: null,
    fields: null,
    item: null,
    order: null,
    ...overrides,
  });
}

describe('get_resume_snapshot', () => {
  it('returns header, sections, and itemIds for structured entries', async () => {
    const { ctx, rc } = makeContext(fixture());
    const out = (await toolOf('get_resume_snapshot').invoke(rc, JSON.stringify({}))) as {
      header: { fullName: string };
      experience: Array<{ itemId: string; company: string; bullets: string[] }>;
      education: Array<{ itemId: string; school: string }>;
      summary: string;
      skills: string;
    };
    expect(out.header.fullName).toBe('Ada Lovelace');
    expect(out.experience).toEqual([
      { itemId: 'e1', company: 'Acme', role: 'Senior Product Manager', location: 'London', startDate: '2021-03', endDate: 'Present', bullets: ['Ran A/B testing experiments', 'Led cross-functional teams'] },
    ]);
    expect(out.education[0].itemId).toBe('ed1');
    expect(out.summary).toContain('A/B tests');
    expect(out.skills).toBe('SQL, Figma');
    // Never exposes internal ids of the working copy.
    expect(JSON.stringify(out)).not.toContain('opSeq');
  });

  it('includes the target job when one is attached to the run', async () => {
    const job: JobDescriptionData = {
      title: 'Senior Product Manager',
      company: 'Stripe',
      descriptionText: '',
      requiredSkills: ['SQL'],
      preferredSkills: [],
      responsibilities: [],
      keywords: ['A/B testing'],
    };
    const { ctx, rc } = makeContext(fixture(), job);
    const out = (await toolOf('get_resume_snapshot').invoke(rc, JSON.stringify({}))) as {
      targetJob: { title: string; company: string };
    };
    expect(out.targetJob).toEqual({ title: 'Senior Product Manager', company: 'Stripe', requiredSkills: ['SQL'], keywords: ['A/B testing'] });
  });
});

describe('analyze_job', () => {
  it('returns ok:false when no job text is available', async () => {
    const { ctx, rc } = makeContext(fixture());
    const out = (await toolOf('analyze_job').invoke(rc, JSON.stringify({ jobText: null }))) as {
      ok: boolean;
      error: string;
    };
    expect(out.ok).toBe(false);
    expect(out.error).toContain('No job description');
  });

  it('runs a deterministic grounded gap analysis (matched vs missing)', async () => {
    const { ctx, rc } = makeContext(fixture());
    const out = (await toolOf('analyze_job').invoke(
      rc,
      JSON.stringify({
        jobText:
          'Senior Product Manager needed. Must excel at stakeholder management and cross-functional collaboration. ' +
          'Hands-on experience with A/B testing, user research, roadmapping, and agile methodologies required. SQL is a plus.',
      }),
    )) as {
      ok: boolean;
      matchScore: number;
      matchedKeywords: string[];
      missingKeywords: string[];
      suggestions: unknown[];
    };
    expect(out.ok).toBe(true);
    expect(typeof out.matchScore).toBe('number');
    expect(out.matchedKeywords.length).toBeGreaterThan(0);
    // The resume mentions A/B testing + user research, but NOT stakeholder management.
    expect(out.matchedKeywords.some((k) => /A\/B testing/i.test(k))).toBe(true);
    expect(out.missingKeywords.some((k) => /stakeholder management/i.test(k))).toBe(true);
    expect(Array.isArray(out.suggestions)).toBe(true);
  });
});

describe('propose_operation — valid edits stream live', () => {
  it('applies a grounded bullet rewrite, emits an operation event with a deterministic id', async () => {
    const { ctx, events, rc } = makeContext(fixture());
    const out = (await toolOf('propose_operation').invoke(
      rc,
      proposeInput({
        op: 'replace_bullet',
        reason: 'Lead with impact',
        evidence: ['Ran A/B testing experiments', 'Grew activation by 18%'],
        section: 'experience',
        itemId: 'e1',
        bulletIndex: 0,
        value: 'Ran A/B tests that lifted activation 18%',
      }),
    )) as { applied: boolean; operationId?: string };

    expect(out.applied).toBe(true);
    expect(out.operationId).toBe('op_run_test_1_1');
    expect(ctx.resume.experience[0].description[0]).toBe('Ran A/B tests that lifted activation 18%');
    expect(ctx.resume.experience[0].description[1]).toBe('Led cross-functional teams');

    const opEvent = events.find((e) => e.type === 'operation');
    expect(opEvent).toBeTruthy();
    if (opEvent?.type === 'operation') {
      expect(opEvent.op.agentRunId).toBe('run_test_1');
      expect(opEvent.op.operationId).toBe('op_run_test_1_1');
      expect(opEvent.op).toMatchObject({ op: 'replace_bullet', bulletIndex: 0 });
    }
  });

  it('assigns distinct, monotonic operationIds across calls', async () => {
    const { ctx, rc } = makeContext(fixture());
    const a = (await toolOf('propose_operation').invoke(
      rc,
      proposeInput({ op: 'add_skill', value: 'TypeScript', evidence: ['SQL, Figma'] }),
    )) as { operationId: string };
    const b = (await toolOf('propose_operation').invoke(
      rc,
      proposeInput({ op: 'add_skill', value: 'Kubernetes', evidence: ['SQL, Figma'] }),
    )) as { operationId: string };
    expect(a.operationId).toBe('op_run_test_1_1');
    expect(b.operationId).toBe('op_run_test_1_2');
    expect(ctx.resume.skills).toBe('SQL, Figma, TypeScript, Kubernetes');
  });

  it('records a confirmed candidate fact and keeps the resume untouched', async () => {
    const { ctx, events, rc } = makeContext(fixture());
    const out = (await toolOf('record_candidate_fact').invoke(
      rc,
      JSON.stringify({ topic: 'Team size at Acme', value: 'Led a team of 6 engineers' }),
    )) as { recorded: boolean };
    expect(out.recorded).toBe(true);
    expect(ctx.facts).toEqual([{ topic: 'Team size at Acme', value: 'Led a team of 6 engineers' }]);
    expect(events.some((e) => e.type === 'fact_recorded')).toBe(true);
  });

  it('is idempotent by topic — re-recording updates instead of duplicating', async () => {
    const { ctx, rc } = makeContext(
      fixture(),
      null,
      [{ topic: 'Team size at Acme', value: 'Led 2 engineers' }],
    );
    await toolOf('record_candidate_fact').invoke(
      rc,
      JSON.stringify({ topic: 'Team size at Acme', value: 'Led 6 engineers' }),
    );
    expect(ctx.facts).toEqual([{ topic: 'Team size at Acme', value: 'Led 6 engineers' }]);
  });

  it('rejects a fact with no topic or value', async () => {
    const { ctx, rc } = makeContext(fixture());
    const out = (await toolOf('record_candidate_fact').invoke(
      rc,
      JSON.stringify({ topic: '', value: 'x' }),
    )) as { recorded: boolean; error: string };
    expect(out.recorded).toBe(false);
    expect(out.error).toContain('required');
  });
});

describe('propose_operation — invalid ops are rejected, never applied', () => {
  it('rejects an unknown itemId without touching the resume', async () => {
    const { ctx, events, rc } = makeContext(fixture());
    const before = JSON.stringify(ctx.resume);
    const out = (await toolOf('propose_operation').invoke(
      rc,
      proposeInput({
        op: 'replace_bullet',
        reason: 'test',
        evidence: ['Ran A/B testing experiments'],
        section: 'experience',
        itemId: 'nope',
        bulletIndex: 0,
        value: 'Anything',
      }),
    )) as { applied: boolean; code?: string; error?: string };

    expect(out.applied).toBe(false);
    expect(out.code).toBe('unknown_item');
    expect(JSON.stringify(ctx.resume)).toBe(before);
    expect(events.some((e) => e.type === 'operation')).toBe(false);
  });

  it('rejects a fabricated metric (ungrounded number)', async () => {
    const { ctx, events, rc } = makeContext(fixture());
    const before = JSON.stringify(ctx.resume);
    const out = (await toolOf('propose_operation').invoke(
      rc,
      proposeInput({
        op: 'replace_bullet',
        reason: 'Stronger',
        evidence: ['Ran A/B testing experiments'],
        section: 'experience',
        itemId: 'e1',
        bulletIndex: 0,
        value: 'Increased revenue by 99%',
      }),
    )) as { applied: boolean; code?: string };

    expect(out.applied).toBe(false);
    expect(out.code).toBe('ungrounded_metric');
    expect(JSON.stringify(ctx.resume)).toBe(before);
    expect(events.some((e) => e.type === 'operation')).toBe(false);
  });

  it('rejects content changes with empty evidence (anti-hallucination gate)', async () => {
    const { ctx, rc } = makeContext(fixture());
    const out = (await toolOf('propose_operation').invoke(
      rc,
      proposeInput({
        op: 'set_field',
        field: 'summary',
        value: 'A brand new summary that came from nowhere.',
        evidence: [],
      }),
    )) as { applied: boolean; code?: string };
    expect(out.applied).toBe(false);
    expect(out.code).toBe('missing_evidence');
  });

  it('rejects an invalid operation type before any mutation', async () => {
    const { ctx, events, rc } = makeContext(fixture());
    const before = JSON.stringify(ctx.resume);
    // The SDK rejects the unknown op at schema validation, so the result may be
    // undefined — what matters is that nothing is applied and nothing is emitted.
    const out = (await toolOf('propose_operation').invoke(
      rc,
      proposeInput({ op: 'not_an_op', field: 'summary', value: 'x', evidence: ['e'] }),
    )) as { applied?: boolean } | undefined;
    expect(out?.applied).not.toBe(true);
    expect(JSON.stringify(ctx.resume)).toBe(before);
    expect(events.some((e) => e.type === 'operation')).toBe(false);
  });
});

describe('request_clarification — human-in-the-loop', () => {
  it('emits an awaiting_input event and asks the model to stop', async () => {
    const { ctx, events, rc } = makeContext(fixture());
    const out = (await toolOf('request_clarification').invoke(
      rc,
      JSON.stringify({
        question: 'Did the onboarding redesign move activation, conversion, or retention?',
        category: 'quantify',
        skillTag: null,
      }),
    )) as { asked: boolean };

    expect(out.asked).toBe(true);
    expect(events).toContainEqual(
      expect.objectContaining({
        type: 'awaiting_input',
        question: 'Did the onboarding redesign move activation, conversion, or retention?',
        category: 'quantify',
      }),
    );
  });
});

describe('search_candidate_profile — memory lookup', () => {
  it('returns matching facts for a query and all facts when the query is null', async () => {
    const facts = [
      { topic: 'Team size at Acme', value: 'Led a team of 6 engineers' },
      { topic: 'A/B tests at Acme', value: 'Ran onboarding experiments' },
    ];
    const { ctx, rc } = makeContext(fixture(), null, facts);

    const all = (await toolOf('search_candidate_profile').invoke(rc, JSON.stringify({ query: null }))) as {
      facts: Array<{ topic: string }>;
    };
    expect(all.facts).toHaveLength(2);

    const hit = (await toolOf('search_candidate_profile').invoke(rc, JSON.stringify({ query: 'team' }))) as {
      facts: Array<{ topic: string }>;
    };
    expect(hit.facts).toEqual([{ topic: 'Team size at Acme', value: 'Led a team of 6 engineers' }]);
  });
});

describe('agent modelSettings — output token & temperature bounds', () => {
  it('configures server-side maxTokens ceiling and deterministic temperature', () => {
    const agent = getAgent('gpt-4o');
    expect(agent.modelSettings?.maxTokens).toBe(350);
    expect(agent.modelSettings?.temperature).toBe(0.35);
  });
});

