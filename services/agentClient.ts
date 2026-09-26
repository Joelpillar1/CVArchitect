import { supabase } from '../lib/supabase';
import type { ResumeData } from '../types';
import type { JobDescriptionData } from '../types/resumeAgent';
import type { ResumeOperation } from '../types/resumeOperations';
import type { AgentStreamEvent, ProgressDisplayItem } from '../types/agentEvents';
import { formatProgressLabel } from '../types/agentEvents';
import { applyOperation } from '../utils/resumeOperations';

/**
 * Client runner for the streaming CVArchitect Agent (Phase 9 Foundation).
 *
 * Responsibilities:
 * 1. Reads typed SSE frames (`AgentStreamEvent`).
 * 2. Emits structured progress checklist updates without exposing internal chain-of-thought.
 * 3. Applies live validated operations immediately to update the ResumePreview.
 * 4. Preserves initial resume snapshot to support atomic rollback on interruption or error.
 */

export interface RunAgentCallbacks {
  onRunStarted?: (agentRunId: string) => void;
  onChatDelta?: (text: string) => void;
  onOperation?: (op: ResumeOperation, updatedResume: ResumeData) => void;
  onProgressItem?: (item: ProgressDisplayItem) => void;
  onAwaitingInput?: (payload: { question: string; category?: string; skillTag?: string }) => void;
  onFactRecorded?: (payload: { topic: string; value: string }) => void;
  onDecisionRecorded?: (payload: { decision: string; category?: string }) => void;
  onMemoryUpdated?: (memory: import('../utils/resumeAgentMemory').ResumeAgentMemory) => void;
  onError?: (message: string, code?: string) => void;
  onDone?: (agentRunId: string | null) => void;
}

export interface AgentHistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface RunAgentParams extends RunAgentCallbacks {
  resumeId?: string;
  message: string;
  resume: ResumeData;
  jobData?: JobDescriptionData | null;
  history?: AgentHistoryTurn[];
  profileFacts?: Array<{ topic: string; value: string }>;
  memory?: import('../utils/resumeAgentMemory').ResumeAgentMemory | null;
  signal?: AbortSignal;
  justUploaded?: boolean;
  filename?: string;
  uploadStatus?: 'pending' | 'analyzed' | null;
}

export class LiveResumeStreamSession {
  private initialResumeSnapshot: ResumeData;
  private currentWorkingResume: ResumeData;
  private appliedOperations: ResumeOperation[] = [];

  constructor(initialResume: ResumeData) {
    this.initialResumeSnapshot = JSON.parse(JSON.stringify(initialResume));
    this.currentWorkingResume = JSON.parse(JSON.stringify(initialResume));
  }

  public applyLiveOperation(op: ResumeOperation): ResumeData {
    try {
      this.currentWorkingResume = applyOperation(this.currentWorkingResume, op);
      this.appliedOperations.push(op);
      return this.currentWorkingResume;
    } catch (err) {
      console.warn('Failed to apply live operation on client copy:', err);
      return this.currentWorkingResume;
    }
  }

  public getWorkingResume(): ResumeData {
    return this.currentWorkingResume;
  }

  public rollbackToOriginal(): ResumeData {
    this.currentWorkingResume = JSON.parse(JSON.stringify(this.initialResumeSnapshot));
    this.appliedOperations = [];
    return this.currentWorkingResume;
  }

  public getAppliedOperations(): ResumeOperation[] {
    return [...this.appliedOperations];
  }
}

function dispatch(
  event: AgentStreamEvent,
  cb: RunAgentCallbacks,
  session: LiveResumeStreamSession,
  setRunId: (id: string) => void
): void {
  // Generate user-facing progress label
  const progress = formatProgressLabel(event);
  if (progress) {
    cb.onProgressItem?.({
      id: `prog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      stage: progress.stage,
      label: progress.label,
      status: progress.status,
      timestamp: Date.now(),
    });
  }

  switch (event.type) {
    case 'agent_started':
    case 'run_started':
      setRunId(event.agentRunId);
      cb.onRunStarted?.(event.agentRunId);
      break;

    case 'chat_delta':
      cb.onChatDelta?.(event.text);
      break;

    case 'resume_operation':
    case 'operation': {
      const updatedResume = session.applyLiveOperation(event.op);
      cb.onOperation?.(event.op, updatedResume);
      break;
    }

    case 'awaiting_input':
      cb.onAwaitingInput?.({ question: event.question, category: event.category, skillTag: event.skillTag });
      break;

    case 'fact_recorded':
      cb.onFactRecorded?.({ topic: event.topic, value: event.value });
      break;

    case 'decision_recorded':
      cb.onDecisionRecorded?.({ decision: event.decision, category: event.category });
      break;

    case 'memory_updated':
      if (event.memory && typeof event.memory === 'object') {
        cb.onMemoryUpdated?.(event.memory as any);
      }
      break;

    case 'agent_error':
    case 'error':
      cb.onError?.(event.message, event.code);
      break;

    case 'agent_completed':
    case 'run_completed':
      // Handled in completion
      break;
  }
}

export async function runAgent(params: RunAgentParams): Promise<void> {
  const {
    resumeId,
    message,
    resume,
    jobData,
    history,
    profileFacts,
    memory,
    signal,
    justUploaded,
    filename,
    uploadStatus,
    ...cb
  } = params;

  let agentRunId: string | null = null;
  const setRunId = (id: string) => {
    agentRunId = id;
  };

  const session = new LiveResumeStreamSession(resume);

  let response: Response;
  try {
    let { data: { session: authSession } } = await supabase.auth.getSession();
    
    // Check if token is missing, expired, or near expiry (within 60s), and attempt a refresh
    const now = Math.floor(Date.now() / 1000);
    const isExpiredOrClose = !authSession?.access_token || (authSession.expires_at && authSession.expires_at - now < 60);

    if (isExpiredOrClose) {
      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshData?.session?.access_token) {
          authSession = refreshData.session;
        }
      } catch {
        /* Network hiccup during session refresh */
      }
    }

    if (!authSession?.access_token) {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      const errorMsg = isOffline
        ? 'Network connection issue. Please check your internet connection and try again.'
        : 'Your session has expired. Please sign in to continue using the AI agent.';
      cb.onError?.(errorMsg, isOffline ? 'network' : 'unauthenticated');
      cb.onDone?.(null);
      return;
    }

    response = await fetch('/api/agent/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authSession.access_token}`,
      },
      body: JSON.stringify({
        resumeId: resumeId || null,
        message,
        resume,
        jobData: jobData ?? null,
        history: history ?? [],
        profileFacts: profileFacts ?? [],
        memory: memory ?? null,
        justUploaded: Boolean(justUploaded),
        filename: filename || null,
        uploadStatus: uploadStatus || null,
      }),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) {
      cb.onDone?.(agentRunId);
      return;
    }
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    const isFetchError = err instanceof TypeError && /fetch|network|load failed/i.test(err.message);
    const msg = (isOffline || isFetchError)
      ? 'Network connection issue. Please check your internet connection and try again.'
      : err instanceof Error ? err.message : 'Unable to connect to the agent service.';
    cb.onError?.(msg, 'network');
    cb.onDone?.(agentRunId);
    return;
  }

  if (!response.ok || !response.body) {
    let msg = `Agent request failed (${response.status}).`;
    let errorCode = 'http_error';
    try {
      const data = await response.json();
      if (data?.error) msg = data.error;
    } catch {
      /* non-JSON error body */
    }

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    if (response.status === 401) {
      errorCode = 'unauthenticated';
      msg = isOffline
        ? 'Network connection issue. Please check your internet connection and try again.'
        : 'Your session has expired. Please sign in again to continue.';
    } else if (response.status === 429) {
      errorCode = 'rate_limit';
      msg = 'The AI agent is currently receiving high demand. Please wait a moment and try again.';
    } else if (response.status >= 500) {
      errorCode = 'server_error';
      msg = 'The agent service is temporarily unavailable. Please try again in a few moments.';
    }

    cb.onError?.(msg, errorCode);
    cb.onDone?.(agentRunId);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundaryIndex: number;
      while ((boundaryIndex = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, boundaryIndex);
        buffer = buffer.slice(boundaryIndex + 2);

        for (const line of frame.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr) as AgentStreamEvent;
            dispatch(event, cb, session, setRunId);
          } catch (parseErr) {
            console.warn('Failed to parse SSE line as JSON:', jsonStr, parseErr);
          }
        }
      }
    }

    // Flush any remaining data in the buffer
    if (buffer.trim()) {
      for (const line of buffer.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const jsonStr = trimmed.slice(5).trim();
        if (!jsonStr) continue;
        try {
          const event = JSON.parse(jsonStr) as AgentStreamEvent;
          dispatch(event, cb, session, setRunId);
        } catch {
          /* ignore trailing partial */
        }
      }
    }
  } catch (err) {
    if (signal?.aborted) {
      cb.onDone?.(agentRunId);
      return;
    }
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    const msg = isOffline
      ? 'Network connection was interrupted. Please check your internet connection and try again.'
      : 'Connection was interrupted while generating your response. Please try asking again.';
    cb.onError?.(msg, 'stream_interrupted');
  } finally {
    cb.onDone?.(agentRunId);
  }
}
