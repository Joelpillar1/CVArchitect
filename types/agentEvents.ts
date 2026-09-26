import { z } from 'zod';
import type { ResumeOperation } from './resumeOperations';

/**
 * CVArchitect Typed Streaming Event Protocol (Phase 9 Foundation)
 *
 * Defines structured, safe progress events emitted by the server during streaming.
 * Provides user-facing progress updates without exposing internal chain-of-thought.
 */

export const AgentProgressStageEnum = z.enum([
  'agent_started',
  'resume_analysis_started',
  'resume_analysis_completed',
  'job_analysis_started',
  'job_analysis_completed',
  'mapping_started',
  'mapping_completed',
  'gap_found',
  'question_generated',
  'question_answered',
  'evidence_added',
  'tailoring_started',
  'resume_operation',
  'operation_applied',
  'validation_passed',
  'validation_failed',
  'ats_check_started',
  'ats_check_completed',
  'critic_started',
  'critic_completed',
  'revision_started',
  'revision_completed',
  'agent_completed',
  'agent_error',
]);

export type AgentProgressStage = z.infer<typeof AgentProgressStageEnum>;

export interface ProgressDisplayItem {
  id: string;
  stage: AgentProgressStage;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: string;
  timestamp: number;
}

export type AgentStreamEvent =
  | { type: 'agent_started'; agentRunId: string; timestamp: number }
  | { type: 'resume_analysis_started'; message?: string }
  | { type: 'resume_analysis_completed'; bulletCount: number; skillCount: number }
  | { type: 'job_analysis_started'; message?: string }
  | { type: 'job_analysis_completed'; jobTitle: string; requirementCount: number }
  | { type: 'mapping_started'; message?: string }
  | { type: 'mapping_completed'; matchScore: number; strongCount: number; missingCount: number }
  | { type: 'gap_found'; requirement: string; gapType: string }
  | { type: 'question_generated'; question: string; category?: string; priority?: string; questionId?: string }
  | { type: 'question_answered'; questionId: string; answerText: string }
  | { type: 'evidence_added'; claim: string; sourceType: string }
  | { type: 'tailoring_started'; message?: string }
  | { type: 'resume_operation'; op: ResumeOperation }
  | { type: 'operation_applied'; operationId: string; summary?: string }
  | { type: 'validation_passed'; operationId: string }
  | { type: 'validation_failed'; operationId: string; reason: string }
  | { type: 'ats_check_started'; message?: string }
  | { type: 'ats_check_completed'; score: number; keywordsMatched: number }
  | { type: 'critic_started'; message?: string }
  | { type: 'critic_completed'; findingsCount: number }
  | { type: 'revision_started'; message?: string }
  | { type: 'revision_completed'; message?: string }
  | { type: 'chat_delta'; text: string }
  | { type: 'awaiting_input'; question: string; category?: string; skillTag?: string }
  | { type: 'fact_recorded'; topic: string; value: string }
  | { type: 'decision_recorded'; decision: string; category?: string }
  | { type: 'memory_updated'; memory: unknown }
  | { type: 'agent_completed'; agentRunId: string; summary?: string }
  | { type: 'agent_error'; message: string; code?: string }
  // Backward compatibility alias
  | { type: 'run_started'; agentRunId: string }
  | { type: 'operation'; op: ResumeOperation }
  | { type: 'run_completed'; agentRunId: string }
  | { type: 'error'; message: string; code?: string };

/** Map structured events to clean, user-facing progress checklist text */
export function formatProgressLabel(event: AgentStreamEvent): { stage: AgentProgressStage; label: string; status: 'in_progress' | 'completed' | 'failed' } | null {
  switch (event.type) {
    case 'agent_started':
    case 'run_started':
      return { stage: 'agent_started', label: 'Starting agent session...', status: 'in_progress' };

    case 'resume_analysis_started':
      return { stage: 'resume_analysis_started', label: 'Analyzing candidate resume...', status: 'in_progress' };

    case 'resume_analysis_completed':
      return { stage: 'resume_analysis_completed', label: `Resume analyzed (${event.bulletCount} bullets, ${event.skillCount} skills)`, status: 'completed' };

    case 'job_analysis_started':
      return { stage: 'job_analysis_started', label: 'Analyzing target job posting...', status: 'in_progress' };

    case 'job_analysis_completed':
      return { stage: 'job_analysis_completed', label: `Job requirements identified for ${event.jobTitle} (${event.requirementCount} requirements)`, status: 'completed' };

    case 'mapping_started':
      return { stage: 'mapping_started', label: 'Mapping experience to job requirements...', status: 'in_progress' };

    case 'mapping_completed':
      return { stage: 'mapping_completed', label: `Experience mapped (${event.matchScore}% initial alignment)`, status: 'completed' };

    case 'gap_found':
      return { stage: 'gap_found', label: `Identified gap: ${event.requirement.slice(0, 50)}...`, status: 'in_progress' };

    case 'question_generated':
      return { stage: 'question_generated', label: 'Generated high-value clarifying question', status: 'completed' };

    case 'evidence_added':
      return { stage: 'evidence_added', label: 'Recorded verified candidate evidence', status: 'completed' };

    case 'tailoring_started':
      return { stage: 'tailoring_started', label: 'Tailoring experience & achievements...', status: 'in_progress' };

    case 'resume_operation':
    case 'operation':
      return { stage: 'resume_operation', label: `Applying live update: ${event.op.op.replace(/_/g, ' ')}`, status: 'in_progress' };

    case 'operation_applied':
      return { stage: 'operation_applied', label: `Live preview updated (${event.operationId})`, status: 'completed' };

    case 'validation_passed':
      return { stage: 'validation_passed', label: 'Factual claims and metrics validated', status: 'completed' };

    case 'validation_failed':
      return { stage: 'validation_failed', label: `Validation blocked ungrounded claim: ${event.reason}`, status: 'failed' };

    case 'ats_check_started':
      return { stage: 'ats_check_started', label: 'Checking ATS compatibility...', status: 'in_progress' };

    case 'ats_check_completed':
      return { stage: 'ats_check_completed', label: `ATS check passed (${event.keywordsMatched} keywords matched, score: ${event.score}%)`, status: 'completed' };

    case 'critic_started':
      return { stage: 'critic_started', label: 'Running final recruiter diagnostic review...', status: 'in_progress' };

    case 'critic_completed':
      return { stage: 'critic_completed', label: `Review completed (${event.findingsCount} issues refined)`, status: 'completed' };

    case 'revision_started':
      return { stage: 'revision_started', label: 'Polishing final revisions...', status: 'in_progress' };

    case 'revision_completed':
      return { stage: 'revision_completed', label: 'Revisions finalized', status: 'completed' };

    case 'agent_completed':
    case 'run_completed':
      return { stage: 'agent_completed', label: 'Tailoring finalized successfully', status: 'completed' };

    case 'agent_error':
    case 'error':
      return { stage: 'agent_error', label: `Error: ${event.message}`, status: 'failed' };

    default:
      return null;
  }
}
