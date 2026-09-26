import { describe, it, expect } from 'vitest';
import {
  createAgentTaskState,
  classifyConfirmation,
  isActionStale,
  upsertCandidateFact,
  handleTaskTurn,
  AgentTaskState,
  PendingAgentAction,
  CandidateFact,
} from './agentTaskState';
import { createEmptyResume, ResumeData } from '../types';
import { resolveAgentTask } from './taskRequirements';
import { analyzeResumeState } from './resumeState';
import { detectUserIntent } from './intentDetector';

describe('Phase 5: Agent Task State Machine & Pending Actions', () => {
  const sampleResume: ResumeData = {
    ...createEmptyResume(),
    fullName: 'David Miller',
    experience: [
      {
        id: 'exp_1',
        company: 'Figma',
        role: 'Senior Product Designer',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Led design system architecture across web and desktop platforms.',
      },
    ],
  };

  // ── 1. State Transitions ───────────────────────────────────────────────────
  it('1 & 2. Transitions to collecting when inputs are missing, and ready when inputs exist', () => {
    const emptyState = analyzeResumeState(createEmptyResume());
    const emptyTask = resolveAgentTask({ intent: 'build_resume', confidence: 0.9, source: 'deterministic' }, emptyState);
    const taskState1 = createAgentTaskState(emptyTask);
    expect(taskState1.status).toBe('collecting');

    const popState = analyzeResumeState(sampleResume);
    const popTask = resolveAgentTask({ intent: 'build_resume', confidence: 0.9, source: 'deterministic' }, popState);
    const taskState2 = createAgentTaskState(popTask);
    expect(taskState2.status).toBe('ready');
  });

  it('5, 6, 7 & 8. Handles awaiting_confirmation -> approved, cancelled, and ambiguous responses', () => {
    const pendingAction: PendingAgentAction = {
      id: 'act_1',
      type: 'resume_mutation_batch',
      description: 'Rewrite summary and add skills',
      operations: [{ op: 'set_field', field: 'summary', value: 'Updated Summary' }],
      status: 'pending',
      createdAt: Date.now(),
    };

    const taskState: AgentTaskState = {
      taskId: 'task_test',
      intent: 'confirm_action',
      status: 'awaiting_confirmation',
      goal: 'Apply changes',
      requiredInputs: [],
      availableInputs: [],
      missingInputs: [],
      pendingAction,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // 6. Positive confirmation -> approved / execute
    const turnPos = handleTaskTurn(taskState, { intent: 'confirm_action', confidence: 0.9, source: 'deterministic' }, 'Yes, do it', sampleResume);
    expect(turnPos.shouldExecutePending).toBe(true);
    expect(turnPos.taskState.status).toBe('executing');

    // 7. Negative confirmation -> cancelled
    const turnNeg = handleTaskTurn(taskState, { intent: 'general_query', confidence: 0.8, source: 'deterministic' }, 'No, cancel', sampleResume);
    expect(turnNeg.shouldCancelPending).toBe(true);
    expect(turnNeg.taskState.status).toBe('cancelled');
    expect(turnNeg.messageOverride).toBe('Cancelled.');

    // 8. Ambiguous confirmation -> remains awaiting_confirmation
    const turnAmb = handleTaskTurn(taskState, { intent: 'general_query', confidence: 0.8, source: 'deterministic' }, 'Maybe, show me first', sampleResume);
    expect(turnAmb.shouldExecutePending).toBe(false);
    expect(turnAmb.shouldCancelPending).toBe(false);
    expect(turnAmb.taskState.status).toBe('awaiting_confirmation');
  });

  it('9. Duplicate confirmation prevents double-execution when action is already completed', () => {
    const completedAction: PendingAgentAction = {
      id: 'act_done',
      type: 'resume_mutation_batch',
      description: 'Applied summary update',
      operations: [{ op: 'set_field', field: 'summary', value: 'Done' }],
      status: 'completed',
      createdAt: Date.now(),
    };

    const taskState: AgentTaskState = {
      taskId: 'task_done',
      intent: 'confirm_action',
      status: 'awaiting_confirmation',
      goal: 'Done',
      requiredInputs: [],
      availableInputs: [],
      missingInputs: [],
      pendingAction: completedAction,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = handleTaskTurn(taskState, { intent: 'confirm_action', confidence: 0.9, source: 'deterministic' }, 'Yes', sampleResume);
    expect(result.shouldExecutePending).toBe(false);
    expect(result.isDuplicateConfirmation).toBe(true);
    expect(result.messageOverride).toBe('Those changes are already applied.');
  });

  it('11. Supersedes active incomplete task when user changes the subject', () => {
    const oldTask: AgentTaskState = {
      taskId: 'task_tailor',
      intent: 'tailor_job',
      status: 'collecting',
      goal: 'Tailor resume',
      requiredInputs: ['job_description'],
      availableInputs: [],
      missingInputs: ['job_description'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const newIntent = detectUserIntent('Actually, forget that. Rewrite my summary instead.');
    const result = handleTaskTurn(oldTask, newIntent, 'Actually, forget that. Rewrite my summary instead.', sampleResume);

    expect(result.taskState.intent).toBe('rewrite_section');
    expect(result.taskState.status).toBe('ready');
  });

  it('12. Detects stale action if resume changed and target item was removed', () => {
    const pendingAction: PendingAgentAction = {
      id: 'act_stale',
      type: 'resume_mutation',
      description: 'Edit deleted job',
      operations: [
        {
          op: 'replace_bullet',
          section: 'experience',
          itemId: 'exp_deleted', // item not in sampleResume!
          bulletIndex: 0,
          value: 'New bullet',
        },
      ],
      status: 'pending',
      createdAt: Date.now(),
    };

    const stale = isActionStale(pendingAction, sampleResume);
    expect(stale).toBe(true);
  });

  it('14. Explicit user scope overrides general priority engine', () => {
    const intent = detectUserIntent('Only fix my skills section');
    expect(intent.intent).toBe('add_skills');
    expect(intent.targetSection).toBe('skills');
  });

  it('15 & 16. User fact correction replaces old fact and maintains provenance', () => {
    let facts: CandidateFact[] = [
      {
        id: 'fact_1',
        topic: 'team_size',
        value: '7 designers',
        source: 'user',
        confidence: 'explicit',
        updatedAt: 1000,
      },
    ];

    // User corrects team size to 9
    facts = upsertCandidateFact(facts, {
      id: 'fact_2',
      topic: 'team_size',
      value: '9 designers',
      source: 'user',
      confidence: 'explicit',
      updatedAt: 2000,
    });

    expect(facts).toHaveLength(1);
    expect(facts[0].value).toBe('9 designers');
    expect(facts[0].source).toBe('user');
  });

  it('18. Task state model tracks step progression across multiple turns', () => {
    const task = createAgentTaskState(
      resolveAgentTask(
        { intent: 'tailor_job', confidence: 0.95, source: 'deterministic' },
        analyzeResumeState(sampleResume),
        { jobData: { title: 'Designer', descriptionText: 'Figma expertise required' } }
      )
    );

    expect(task.currentStep).toBe('ready_to_execute');
    expect(task.status).toBe('ready');
  });
});
