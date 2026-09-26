import { describe, it, expect } from 'vitest';
import { RunContext } from '@openai/agents';
import { getAgent, AgentRunContext } from '../api/agent/agentDefinition';
import { INITIAL_DATA, type ResumeData } from '../types';
import type { AgentSSEEvent } from '../types/resumeOperations';
import { resolveAgentTask, detectParsingQualityIssues } from '../utils/taskRequirements';
import { getResumePriorities } from '../utils/resumePriorities';
import { handleTaskTurn, upsertCandidateFact, isActionStale } from '../utils/agentTaskState';

describe('Phase 8: CVArchitect Resume Agent Orchestrator', () => {
  const mockResume: ResumeData = {
    ...INITIAL_DATA,
    fullName: 'Elena Rostova',
    jobTitle: 'Senior Infrastructure Engineer',
    summary: 'Cloud systems engineer with 7 years scaling distributed databases.',
    skills: 'AWS, Kubernetes, Terraform, Go, PostgreSQL',
    experience: [
      {
        id: 'exp_cloud',
        company: 'CloudScale Inc',
        role: 'Lead Cloud Architect',
        startDate: '2020-01',
        endDate: 'Present',
        description: [
          'Engineered Kubernetes cluster managing 500 microservices with 99.99% uptime',
          'Responsible for internal billing telemetry infrastructure',
        ],
      },
    ],
    education: [
      {
        id: 'edu_1',
        school: 'University of Washington',
        degree: 'BS Computer Engineering',
        year: '2017',
      },
    ],
  };

  it('initializes single primary CVArchitect agent with specialized tools', () => {
    const agent = getAgent('gpt-4o-mini');
    expect(agent.name).toBe('CVArchitect Agent');
    expect(agent.tools.length).toBe(11);

    const toolNames = agent.tools.map((t: any) => t.name);
    expect(toolNames).toContain('get_resume_snapshot');
    expect(toolNames).toContain('analyze_job');
    expect(toolNames).toContain('get_evidence_matrix');
    expect(toolNames).toContain('request_clarification');
    expect(toolNames).toContain('search_candidate_profile');
    expect(toolNames).toContain('record_candidate_fact');
    expect(toolNames).toContain('record_user_decision');
    expect(toolNames).toContain('record_correction');
    expect(toolNames).toContain('reject_claim');
    expect(toolNames).toContain('propose_operation');
    expect(toolNames).toContain('run_resume_critic');
  });

  it('executes get_resume_snapshot and returns item and bullet IDs', async () => {
    const agent = getAgent('gpt-4o-mini');
    const snapshotTool = agent.tools.find((t: any) => t.name === 'get_resume_snapshot') as any;

    const emittedEvents: AgentSSEEvent[] = [];
    const context: AgentRunContext = {
      agentRunId: 'run_test_1',
      resume: JSON.parse(JSON.stringify(mockResume)),
      jobData: {
        title: 'Principal Site Reliability Engineer',
        company: 'Stripe',
        descriptionText: 'SRE role managing multi-region Kubernetes clusters.',
        requiredSkills: ['Kubernetes', 'AWS', 'Terraform'],
        keywords: ['Kubernetes', 'SRE', 'Reliability'],
      },
      facts: [],
      emit: (e) => emittedEvents.push(e),
      opSeq: 0,
    };

    const rc = new RunContext<AgentRunContext>(context);
    const snapshot: any = await snapshotTool.invoke(rc, JSON.stringify({}));
    expect(snapshot.header.fullName).toBe('Elena Rostova');
    expect(snapshot.experience[0].itemId).toBe('exp_cloud');
    expect(snapshot.experience[0].bullets.length).toBe(2);
    expect(snapshot.targetJob?.company).toBe('Stripe');
  });

  it('executes get_evidence_matrix tool and generates categorized match strengths', async () => {
    const agent = getAgent('gpt-4o-mini');
    const matrixTool = agent.tools.find((t: any) => t.name === 'get_evidence_matrix') as any;

    const context: AgentRunContext = {
      agentRunId: 'run_test_2',
      resume: JSON.parse(JSON.stringify(mockResume)),
      jobData: null,
      facts: [],
      emit: () => {},
      opSeq: 0,
    };

    const rc = new RunContext<AgentRunContext>(context);
    const result: any = await matrixTool.invoke(
      rc,
      JSON.stringify({ jobText: 'Must have experience with Kubernetes clusters and Terraform infrastructure.' })
    );

    expect(result.ok).toBe(true);
    expect(result.overallMatchScore).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it('executes propose_operation tool, validates grounding, and streams live operation', async () => {
    const agent = getAgent('gpt-4o-mini');
    const proposeTool = agent.tools.find((t: any) => t.name === 'propose_operation') as any;

    const emittedEvents: AgentSSEEvent[] = [];
    const context: AgentRunContext = {
      agentRunId: 'run_test_3',
      resume: JSON.parse(JSON.stringify(mockResume)),
      jobData: null,
      facts: [],
      emit: (e) => emittedEvents.push(e),
      opSeq: 0,
    };

    // Grounded bullet update citing original 99.99% stat
    const opInput = {
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'exp_cloud',
      bulletIndex: 0,
      value: 'Architected multi-region Kubernetes platform orchestrating 500 microservices with 99.99% availability',
      reason: 'Strengthen action verb and specify platform architecture.',
      evidence: ['Engineered Kubernetes cluster managing 500 microservices with 99.99% uptime'],
      field: null,
      fields: null,
      item: null,
      order: null,
    };

    const rc = new RunContext<AgentRunContext>(context);
    const res: any = await proposeTool.invoke(rc, JSON.stringify(opInput));
    expect(res.applied).toBe(true);
    expect(emittedEvents.some((e) => e.type === 'operation')).toBe(true);

    // Verify working copy was updated
    expect((context.resume.experience[0].description as string[])[0]).toContain('Architected multi-region Kubernetes');
  });

  it('executes run_resume_critic tool and flags passive opening verbs', async () => {
    const agent = getAgent('gpt-4o-mini');
    const criticTool = agent.tools.find((t: any) => t.name === 'run_resume_critic') as any;

    const context: AgentRunContext = {
      agentRunId: 'run_test_4',
      resume: JSON.parse(JSON.stringify(mockResume)), // Second bullet opens with "Responsible for..."
      jobData: null,
      facts: [],
      emit: () => {},
      opSeq: 0,
    };

    const rc = new RunContext<AgentRunContext>(context);
    const criticResult: any = await criticTool.invoke(rc, JSON.stringify({}));
    expect(criticResult.clean).toBe(false);
    expect(criticResult.findingCount).toBeGreaterThanOrEqual(1);
    expect(criticResult.findings[0].description).toContain('Passive phrasing');
  });

  // ── Phase 4 Task Intelligence & Anti-Hallucination Scenarios ────────────────
  describe('Phase 4: Task Execution & Grounding Safeguards', () => {
    it('1 & 2. Distinguishes EMPTY build request from POPULATED build request', () => {
      const emptyState = { contentState: 'EMPTY', hasMeaningfulContent: false, stats: { experienceCount: 0, educationCount: 0, skillsCount: 0, projectCount: 0, hasSummary: false } } as any;
      const populatedState = { contentState: 'COMPLETE', hasMeaningfulContent: true, stats: { experienceCount: 2, educationCount: 1, skillsCount: 5, projectCount: 0, hasSummary: true } } as any;

      const emptyTask = resolveAgentTask({ intent: 'build_resume', confidence: 0.9, source: 'deterministic' }, emptyState, { message: 'Build my resume' });
      expect(emptyTask.canExecute).toBe(false);
      expect(emptyTask.missingInputs).toContain('target_role');

      const popTask = resolveAgentTask({ intent: 'build_resume', confidence: 0.9, source: 'deterministic' }, populatedState, { message: 'Build my resume' });
      expect(popTask.canExecute).toBe(true);
      expect(popTask.missingInputs).toHaveLength(0);
    });

    it('3 & 4. Tailor with JD executes; tailor without JD requests JD input', () => {
      const popState = { contentState: 'COMPLETE', hasMeaningfulContent: true, stats: { experienceCount: 2, educationCount: 1, skillsCount: 5, projectCount: 0, hasSummary: true } } as any;

      const taskWithoutJd = resolveAgentTask({ intent: 'tailor_job', confidence: 0.9, source: 'deterministic' }, popState, { message: 'Tailor my resume', jobData: null });
      expect(taskWithoutJd.canExecute).toBe(false);
      expect(taskWithoutJd.missingInputs).toContain('job_description');

      const taskWithJd = resolveAgentTask({ intent: 'tailor_job', confidence: 0.9, source: 'deterministic' }, popState, {
        message: 'Tailor my resume',
        jobData: { title: 'Lead SRE', descriptionText: 'Must know Kubernetes' },
      });
      expect(taskWithJd.canExecute).toBe(true);
    });

    it('5 & 20. Rejects ungrounded metrics and prevents hallucinating revenue/percentages', async () => {
      const agent = getAgent('gpt-4o-mini');
      const proposeTool = agent.tools.find((t: any) => t.name === 'propose_operation') as any;

      const emittedEvents: AgentSSEEvent[] = [];
      const context: AgentRunContext = {
        agentRunId: 'run_test_hallucination',
        resume: JSON.parse(JSON.stringify(mockResume)),
        jobData: null,
        facts: [],
        emit: (e) => emittedEvents.push(e),
        opSeq: 0,
      };

      // Hallucinated bullet inventing 45% conversion with no candidate facts
      const hallucinatedOp = {
        op: 'replace_bullet',
        section: 'experience',
        itemId: 'exp_cloud',
        bulletIndex: 0,
        value: 'Increased checkout conversion by 45% and grew annual revenue by $1.2M',
        reason: 'Added fabricated metrics.',
        evidence: [],
      };

      const rc = new RunContext<AgentRunContext>(context);
      const res: any = await proposeTool.invoke(rc, JSON.stringify(hallucinatedOp));
      // Validation rejects ungrounded metric claims
      expect(res.applied).toBe(false);
      expect(res.error).toBeDefined();
    });

    it('8. Bounds general resume improvement priorities to maximum 4 actions', () => {
      const popState = { stats: { experienceCount: 2, skillsCount: 2, educationCount: 0, hasSummary: false } } as any;
      const priorities = getResumePriorities(mockResume, popState);
      expect(priorities.length).toBeLessThanOrEqual(4);
    });

    it('10. Gracefully returns failure details on invalid operations without hallucinating success', async () => {
      const agent = getAgent('gpt-4o-mini');
      const proposeTool = agent.tools.find((t: any) => t.name === 'propose_operation') as any;

      const context: AgentRunContext = {
        agentRunId: 'run_test_fail',
        resume: JSON.parse(JSON.stringify(mockResume)),
        jobData: null,
        facts: [],
        emit: () => {},
        opSeq: 0,
      };

      const invalidOp = {
        op: 'replace_bullet',
        section: 'experience',
        itemId: 'non_existent_id',
        bulletIndex: 99,
        value: 'Updated bullet',
        reason: 'Fix bullet',
        evidence: [],
      };

      const rc = new RunContext<AgentRunContext>(context);
      const res: any = await proposeTool.invoke(rc, JSON.stringify(invalidOp));
      expect(res.applied).toBe(false);
      expect(res.error).toBeDefined();
    });

    it('17. Detects malformed or suspicious parsed resume data', () => {
      const malformedResume: ResumeData = {
        ...mockResume,
        fullName: '',
        skills: 'Paragraph of unbroken text with no commas '.repeat(30),
      };
      const check = detectParsingQualityIssues(malformedResume);
      expect(check.hasIssues).toBe(true);
      expect(check.flags).toContain('missing_full_name');
      expect(check.flags).toContain('skills_contain_paragraph_text');
    });
  });

  // ── Phase 5 Multi-Turn Task State & Pending Actions ─────────────────────────
  describe('Phase 5: Multi-Turn Task & Confirmation Integration', () => {
    it('A & B. Executes pending batch on YES, cancels without mutation on NO', () => {
      const pendingTask = {
        taskId: 'task_tailor_batch',
        intent: 'confirm_action',
        status: 'awaiting_confirmation',
        goal: 'Apply tailoring batch',
        requiredInputs: [],
        availableInputs: [],
        missingInputs: [],
        pendingAction: {
          id: 'act_101',
          type: 'resume_mutation_batch',
          description: 'Tailor summary and skills',
          operations: [{ op: 'set_field', field: 'summary', value: 'New tailored summary' }],
          status: 'pending',
          createdAt: Date.now(),
        },
      };

      // Turn A: User says Yes -> execute pending
      const resYes = handleTaskTurn(pendingTask, { intent: 'confirm_action', confidence: 0.9 }, 'Yes, apply it', mockResume);
      expect(resYes.shouldExecutePending).toBe(true);
      expect(resYes.taskState.status).toBe('executing');

      // Turn B: User says No -> cancel
      const resNo = handleTaskTurn(pendingTask, { intent: 'general_query', confidence: 0.8 }, 'No, cancel', mockResume);
      expect(resNo.shouldCancelPending).toBe(true);
      expect(resNo.taskState.status).toBe('cancelled');
      expect(resNo.messageOverride).toBe('Cancelled.');
    });

    it('C. Rejects duplicate confirmation when task is already completed', () => {
      const doneTask = {
        taskId: 'task_done',
        intent: 'confirm_action',
        status: 'awaiting_confirmation',
        goal: 'Done',
        requiredInputs: [],
        availableInputs: [],
        missingInputs: [],
        pendingAction: {
          id: 'act_done',
          type: 'resume_mutation_batch',
          description: 'Applied',
          operations: [],
          status: 'completed',
          createdAt: Date.now(),
        },
      };

      const res = handleTaskTurn(doneTask, { intent: 'confirm_action', confidence: 0.9 }, 'Yes', mockResume);
      expect(res.shouldExecutePending).toBe(false);
      expect(res.isDuplicateConfirmation).toBe(true);
      expect(res.messageOverride).toBe('Those changes are already applied.');
    });

    it('D. User interruption supersedes previous task', () => {
      const pendingTask = {
        taskId: 'task_old',
        intent: 'tailor_job',
        status: 'collecting',
        goal: 'Tailor resume',
        requiredInputs: ['job_description'],
        availableInputs: [],
        missingInputs: ['job_description'],
      };

      const res = handleTaskTurn(pendingTask, { intent: 'rewrite_section', confidence: 0.9 }, 'Actually, just rewrite my summary', mockResume);
      expect(res.taskState.intent).toBe('rewrite_section');
      expect(res.taskState.status).toBe('ready');
    });

    it('E & F. Stale action detection and candidate fact replacement', () => {
      const stalePending = {
        id: 'act_stale',
        operations: [{ op: 'replace_bullet', section: 'experience', itemId: 'deleted_item_id', bulletIndex: 0, value: 'test' }],
        status: 'pending',
      };
      expect(isActionStale(stalePending, mockResume)).toBe(true);

      // Fact correction
      let facts = [{ id: 'f1', topic: 'location', value: 'London', source: 'user', confidence: 'explicit', updatedAt: 100 }];
      facts = upsertCandidateFact(facts, { id: 'f2', topic: 'location', value: 'San Francisco', source: 'user', confidence: 'explicit', updatedAt: 200 });
      expect(facts).toHaveLength(1);
      expect(facts[0].value).toBe('San Francisco');
    });
  });
});

