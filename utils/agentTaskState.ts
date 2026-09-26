import { UserIntent, UserIntentResult } from './intentDetector';
import { AgentTask } from './taskRequirements';
import { ResumeOperation } from '../types/resumeOperations';
import { ResumeData } from '../types';

export type TaskStatus =
  | 'idle'
  | 'collecting'
  | 'ready'
  | 'awaiting_confirmation'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface PendingAgentAction {
  id: string;
  type: 'resume_mutation' | 'resume_mutation_batch' | 'job_tailoring' | 'resume_improvement';
  description: string;
  operations: ResumeOperation[];
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed' | 'cancelled';
  resumeVersion?: string | number;
  createdAt: number;
  executedAt?: number;
}

export interface CandidateFact {
  id: string;
  topic: string;
  value: string;
  source: 'resume' | 'user' | 'profile' | 'inferred';
  confidence: 'explicit' | 'inferred';
  provenance?: 'user_explicit' | 'resume_explicit' | 'profile' | 'inferred';
  sourceLocation?: string;
  updatedAt: number;
}

export interface JobContextState {
  id: string;
  title?: string;
  company?: string | null;
  seniority?: string;
  extractedSkills?: string[];
  keywords?: string[];
  analyzedAt: number;
  analysisResult?: unknown;
}

export interface AgentTaskState {
  taskId: string;
  intent: UserIntent;
  status: TaskStatus;
  goal: string;
  targetSection?: string;
  targetRole?: string;
  requiredInputs: string[];
  availableInputs: string[];
  missingInputs: string[];
  pendingAction?: PendingAgentAction | null;
  completedSteps?: string[];
  currentStep?: string;
  failedStep?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export type ConfirmationType = 'POSITIVE' | 'NEGATIVE' | 'AMBIGUOUS';

/**
 * Deterministically classifies confirmation intent into POSITIVE, NEGATIVE, or AMBIGUOUS.
 */
export function classifyConfirmation(message: string): ConfirmationType {
  const text = message.trim().toLowerCase();

  // Negative confirmation phrases
  if (
    /^(no|nope|nah|not yet|cancel|don't|stop|forget it|nevermind|do not apply|don't apply|discard)\b/i.test(text) ||
    /\b(cancel|stop|don't do that|never mind)\b/i.test(text)
  ) {
    return 'NEGATIVE';
  }

  // Ambiguous confirmation phrases
  if (
    /^(maybe|perhaps|i'll think about it|let me see|can you show me|show me first|what changes|explain first|not sure)\b/i.test(
      text
    )
  ) {
    return 'AMBIGUOUS';
  }

  // Positive confirmation phrases
  if (
    /^(yes|yeah|yep|sure|y|ok|okay|do it|go ahead|proceed|apply|confirm|looks good|insert it|make the change|make these changes|accept|perfect|sounds good)\b/i.test(
      text
    ) ||
    /\b(apply|insert|update|save|commit) (it|this|the changes?|them|now)\b/i.test(text) ||
    /\bgo ahead\b/i.test(text)
  ) {
    return 'POSITIVE';
  }

  return 'AMBIGUOUS';
}

/**
 * Creates an AgentTaskState from a newly resolved task.
 */
export function createAgentTaskState(task: AgentTask, existingTaskId?: string): AgentTaskState {
  const now = Date.now();
  let status: TaskStatus = 'ready';

  if (!task.canExecute) {
    status = 'collecting';
  } else if (task.nextStep === 'CONFIRM' || task.pendingAction) {
    status = 'awaiting_confirmation';
  }

  return {
    taskId: existingTaskId || `task_${now}_${Math.random().toString(36).slice(2, 7)}`,
    intent: task.intent,
    status,
    goal: task.goal,
    targetSection: task.targetSection,
    targetRole: task.targetRole,
    requiredInputs: task.requiredInputs,
    availableInputs: task.availableInputs,
    missingInputs: task.missingInputs,
    pendingAction: task.pendingAction
      ? {
          id: `act_${now}`,
          type: 'resume_mutation_batch',
          description: task.pendingAction.description || 'Pending resume mutation',
          operations: (task.pendingAction.operations as ResumeOperation[]) || [],
          status: 'pending',
          createdAt: now,
        }
      : null,
    completedSteps: [],
    currentStep: task.canExecute ? 'ready_to_execute' : 'gather_inputs',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Validates whether a pending action is still safe to apply given the current resume state.
 */
export function isActionStale(
  pendingAction: PendingAgentAction,
  currentResume: ResumeData,
  recordedResumeVersion?: string | number
): boolean {
  if (pendingAction.resumeVersion !== undefined && recordedResumeVersion !== undefined) {
    if (pendingAction.resumeVersion !== recordedResumeVersion) return true;
  }

  // Verify target items for operations still exist
  for (const op of pendingAction.operations) {
    if ('itemId' in op && op.itemId) {
      const sectionKey = op.section as keyof ResumeData;
      const list = currentResume[sectionKey];
      if (Array.isArray(list)) {
        const itemExists = list.some((item: unknown) => {
          if (typeof item === 'object' && item !== null && 'id' in item) {
            return (item as { id: string }).id === op.itemId;
          }
          return false;
        });
        if (!itemExists) return true;
      }
    }
  }

  return false;
}

/**
 * Upserts candidate facts. New explicit user facts overwrite older facts on the same topic.
 */
export function upsertCandidateFact(facts: CandidateFact[], newFact: CandidateFact): CandidateFact[] {
  const normalizedTopic = newFact.topic.trim().toLowerCase();
  const existingIndex = facts.findIndex((f) => f.topic.trim().toLowerCase() === normalizedTopic);

  if (existingIndex >= 0) {
    const updated = [...facts];
    updated[existingIndex] = {
      ...newFact,
      updatedAt: Date.now(),
    };
    return updated;
  }

  return [...facts, { ...newFact, updatedAt: Date.now() }];
}

/**
 * Handles task state transitions across turns.
 */
export function handleTaskTurn(
  currentState: AgentTaskState | null,
  newIntent: UserIntentResult,
  userMessage: string,
  currentResume: ResumeData
): {
  taskState: AgentTaskState;
  shouldExecutePending: boolean;
  shouldCancelPending: boolean;
  isDuplicateConfirmation: boolean;
  isStale: boolean;
  messageOverride?: string;
} {
  const now = Date.now();

  // 1. Check if user is confirming or cancelling an existing pending action
  if (currentState && currentState.status === 'awaiting_confirmation' && currentState.pendingAction) {
    const confType = classifyConfirmation(userMessage);

    // Duplicate confirmation check
    if (currentState.pendingAction.status === 'completed' && confType === 'POSITIVE') {
      return {
        taskState: currentState,
        shouldExecutePending: false,
        shouldCancelPending: false,
        isDuplicateConfirmation: true,
        isStale: false,
        messageOverride: 'Those changes are already applied.',
      };
    }

    if (confType === 'POSITIVE') {
      // Check for stale action
      const isStale = isActionStale(currentState.pendingAction, currentResume);
      if (isStale) {
        const staleState: AgentTaskState = {
          ...currentState,
          status: 'failed',
          error: 'Resume content changed before confirmation.',
          updatedAt: now,
        };
        return {
          taskState: staleState,
          shouldExecutePending: false,
          shouldCancelPending: true,
          isDuplicateConfirmation: false,
          isStale: true,
          messageOverride: 'The resume changed since those changes were proposed. Let me re-evaluate.',
        };
      }

      const approvedState: AgentTaskState = {
        ...currentState,
        status: 'executing',
        pendingAction: {
          ...currentState.pendingAction,
          status: 'approved',
        },
        updatedAt: now,
      };

      return {
        taskState: approvedState,
        shouldExecutePending: true,
        shouldCancelPending: false,
        isDuplicateConfirmation: false,
        isStale: false,
      };
    }

    if (confType === 'NEGATIVE') {
      const cancelledState: AgentTaskState = {
        ...currentState,
        status: 'cancelled',
        pendingAction: {
          ...currentState.pendingAction,
          status: 'cancelled',
        },
        updatedAt: now,
      };

      return {
        taskState: cancelledState,
        shouldExecutePending: false,
        shouldCancelPending: true,
        isDuplicateConfirmation: false,
        isStale: false,
        messageOverride: 'Cancelled.',
      };
    }

    if (confType === 'AMBIGUOUS') {
      return {
        taskState: currentState,
        shouldExecutePending: false,
        shouldCancelPending: false,
        isDuplicateConfirmation: false,
        isStale: false,
      };
    }
  }

  // 2. User starts a new task (interruption or progression)
  // If an old task was incomplete and user asks for something else, the old task is superseded.
  return {
    taskState: {
      taskId: `task_${now}`,
      intent: newIntent.intent,
      status: 'ready',
      goal: `Handle user request: ${newIntent.intent}`,
      requiredInputs: [],
      availableInputs: [],
      missingInputs: [],
      pendingAction: null,
      completedSteps: [],
      currentStep: 'execute',
      createdAt: now,
      updatedAt: now,
    },
    shouldExecutePending: false,
    shouldCancelPending: false,
    isDuplicateConfirmation: false,
    isStale: false,
  };
}
