import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { run, setDefaultOpenAIKey, setTracingDisabled, user, assistant } from '@openai/agents';
import type { ResumeData } from '../../types';
import type { JobDescriptionData } from '../../types/resumeAgent';
import { getSupabaseAdminConfig, isSupabaseAdminConfigured, getOpenAIConfig } from '../lib/serverEnv';
import { createSSE } from '../lib/sse';
import { getAgent, type AgentRunContext } from './agentDefinition';
import { analyzeResumeState } from '../../utils/resumeState';
import { detectUserIntent } from '../../utils/intentDetector';
import { getResponseMode, getResponseModeDirectives } from '../../utils/responseMode';
import { resolveAgentTask, detectParsingQualityIssues } from '../../utils/taskRequirements';
import { getResumePriorities } from '../../utils/resumePriorities';
import { handleTaskTurn } from '../../utils/agentTaskState';

/**
 * POST /api/agent/run — the CVArchitect Agent's streaming endpoint (Vercel Node).
 *
 * Auth mirrors api/create-checkout-session.ts (Bearer Supabase access token →
 * supabaseAdmin.auth.getUser). All request validation happens BEFORE any SSE bytes are
 * written, so failures return clean JSON status codes. Once streaming starts we only
 * ever emit SSE frames. The OpenAI key lives only in this process — it never reaches
 * the client.
 */

export const maxDuration = 60;

// Serverless traces would post to OpenAI on every invocation — disable once per cold start.
setTracingDisabled(true);

import {
  ResumeAgentMemory,
  createEmptyResumeMemory,
  extractDurableInformation,
  upsertMemoryFact,
  recordMemoryMetric,
  recordMemoryCorrection,
  recordMemoryDecision,
  recordRejectedClaim,
  reconcileMemoryWithResume,
} from '../../utils/resumeAgentMemory';
import {
  retrieveRelevantMemory,
  formatResumeMemoryBlock,
} from '../../utils/relevantMemoryRetrieval';
import {
  requiresResumeEvidence,
  determineRequiredResumeSections,
  extractResumeEvidence,
  formatResumeEvidenceBlock,
  validateMutationAgainstCurrentResume,
} from '../../utils/resumeGrounding';

interface AgentRunBody {
  resumeId?: string;
  message?: string;
  resume?: ResumeData;
  jobData?: JobDescriptionData | null;
  /** Prior conversation turns, replayed so the agent has memory and can resume after a
   *  clarifying question. Newest last; the server caps and converts these to input items. */
  history?: Array<{ role?: string; content?: string }>;
  /** Candidate facts loaded from the client profile store (topic/value pairs). */
  profileFacts?: Array<{ topic?: string; value?: string }>;
  /** Resume-scoped conversational memory */
  memory?: ResumeAgentMemory | null;
  /** Upload lifecycle metadata for agent situational awareness */
  justUploaded?: boolean;
  filename?: string | null;
  uploadStatus?: 'pending' | 'analyzed' | null;
  pendingAction?: { type: string; description?: string; operations?: unknown[]; targetSection?: string } | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // ── Config ──────────────────────────────────────────────────────────────────
  const adminConfig = getSupabaseAdminConfig();
  if (!isSupabaseAdminConfigured(adminConfig)) {
    return res.status(500).json({ error: 'Server auth is not configured.' });
  }
  const openai = getOpenAIConfig();
  if (!openai.apiKey) {
    return res.status(500).json({ error: 'AI service is not configured.' });
  }

  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  const accessToken = authHeader.slice(7);
  const supabaseAdmin = createClient(adminConfig.url, adminConfig.serviceRoleKey);
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
  if (authError || !authData.user) {
    console.warn('[api/agent/run] Auth verification failed:', authError?.message || 'No user found');
    return res.status(401).json({ error: 'Your session has expired. Please sign in again to continue.', details: authError?.message });
  }

  // ── Validate body (before streaming) ─────────────────────────────────────────
  const body = (req.body || {}) as AgentRunBody;
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return res.status(400).json({ error: 'A message is required.' });
  }
  if (!body.resume || typeof body.resume !== 'object') {
    return res.status(400).json({ error: 'A resume snapshot is required.' });
  }

  // ── Begin streaming ──────────────────────────────────────────────────────────
  setDefaultOpenAIKey(openai.apiKey);
  const agent = getAgent(openai.model);

  const agentRunId = `run_${randomUUID()}`;
  const sse = createSSE(res);

  // Working copy the tools mutate; never the caller's object.
  const workingResume: ResumeData = JSON.parse(JSON.stringify(body.resume));

  // ── Resume-Scoped Memory Initialization & Extraction ─────────────────────────
  let currentMemory: ResumeAgentMemory =
    body.memory && typeof body.memory === 'object' && body.memory.resumeId
      ? body.memory
      : (workingResume.agentMemory || createEmptyResumeMemory(body.resumeId || 'draft'));

  // Reconcile with latest resume document
  currentMemory = reconcileMemoryWithResume(currentMemory, workingResume);

  // Extract durable information from incoming user message (metrics, corrections, decisions, facts)
  const extracted = extractDurableInformation(message, undefined, workingResume);
  for (const f of extracted.facts) {
    currentMemory = upsertMemoryFact(currentMemory, { source: 'user', ...f });
  }
  for (const m of extracted.metrics) {
    currentMemory = recordMemoryMetric(currentMemory, { source: 'user', confidence: 'explicit', ...m });
  }
  for (const c of extracted.corrections) {
    currentMemory = recordMemoryCorrection(currentMemory, c);
  }
  for (const d of extracted.decisions) {
    currentMemory = recordMemoryDecision(currentMemory, d);
  }
  for (const r of extracted.rejectedClaims) {
    currentMemory = recordRejectedClaim(currentMemory, r);
  }

  // Populate candidate facts from memory and profile
  const facts = [
    ...(Array.isArray(body.profileFacts)
      ? body.profileFacts
          .filter((f) => f && typeof f.topic === 'string' && typeof f.value === 'string')
          .map((f) => ({ topic: f.topic as string, value: f.value as string }))
      : []),
    ...currentMemory.candidateFacts.map((f) => ({ topic: f.topic, value: f.value })),
  ];

  const context: AgentRunContext = {
    agentRunId,
    resumeId: body.resumeId || currentMemory.resumeId,
    resume: workingResume,
    jobData: body.jobData ?? null,
    facts,
    memory: currentMemory,
    emit: (event) => {
      if (event.type === 'fact_recorded') {
        currentMemory = upsertMemoryFact(currentMemory, {
          topic: event.topic,
          value: event.value,
          source: 'user',
          provenance: 'user_explicit',
          confidence: 'explicit',
        });
      } else if (event.type === 'decision_recorded') {
        currentMemory = recordMemoryDecision(currentMemory, {
          decision: event.decision,
          category: (event.category as any) || 'general',
        });
      }
      sse.send(event);
    },
    opSeq: 0,
  };

  // ── Situational Awareness, Intent, & Task Resolution ────────────────────────
  const resumeAnalysis = analyzeResumeState(workingResume, {
    justUploaded: Boolean(body.justUploaded),
    filename: body.filename,
    uploadStatus: body.uploadStatus,
  });

  const intent = detectUserIntent(message, resumeAnalysis);
  const task = resolveAgentTask(intent, resumeAnalysis, {
    jobData: body.jobData,
    pendingAction: body.pendingAction,
    message,
  });

  // Handle deterministic state machine shortcuts (cancellation, duplicate confirmation, instant execution)
  if (body.pendingAction) {
    const rawTaskState = {
      taskId: 'current_task',
      intent: intent.intent,
      status: 'awaiting_confirmation' as const,
      goal: 'Apply pending changes',
      requiredInputs: [],
      availableInputs: [],
      missingInputs: [],
      pendingAction: {
        id: 'act_current',
        type: 'resume_mutation_batch' as const,
        description: body.pendingAction.description || 'Pending changes',
        operations: (body.pendingAction.operations as any[]) || [],
        status: 'pending' as const,
        createdAt: Date.now(),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const turnOutcome = handleTaskTurn(rawTaskState, intent, message, workingResume);

    if (turnOutcome.isDuplicateConfirmation || turnOutcome.shouldCancelPending) {
      const reply = turnOutcome.messageOverride || (turnOutcome.shouldCancelPending ? 'Cancelled.' : 'Those changes are already applied.');
      sse.send({ type: 'run_started', agentRunId });
      sse.send({ type: 'chat_delta', text: reply });
      sse.send({ type: 'memory_updated', memory: currentMemory });
      sse.send({ type: 'run_completed', agentRunId });
      sse.close();
      return;
    }
  }

  const responseMode = task.responseMode;
  const priorities = getResumePriorities(workingResume, resumeAnalysis, body.jobData);
  const parsingQuality = detectParsingQualityIssues(workingResume);

  // ── Upload Lifecycle Guard: Don't hallucinate if upload is still extracting ───
  if (body.uploadStatus === 'pending' && requiresResumeEvidence(intent, message, task)) {
    sse.send({ type: 'run_started', agentRunId });
    sse.send({
      type: 'chat_delta',
      text: "Your resume is still being processed. I’ll review it once extraction finishes.",
    });
    sse.send({ type: 'memory_updated', memory: currentMemory });
    sse.send({ type: 'run_completed', agentRunId });
    sse.close();
    return;
  }

  // ── Extract Grounding Resume Evidence Snapshot ────────────────────────────────
  let evidenceBlock = '';
  if (requiresResumeEvidence(intent, message, task)) {
    const requiredSections = determineRequiredResumeSections(intent, message, task, workingResume);
    const evidenceSnapshot = extractResumeEvidence(workingResume, requiredSections, (workingResume as any).revision);
    evidenceBlock = formatResumeEvidenceBlock(evidenceSnapshot);
  }

  // ── Retrieve Compact Relevant Memory ─────────────────────────────────────────
  const relevantSlice = retrieveRelevantMemory(currentMemory, {
    message,
    resume: workingResume,
    jobData: body.jobData,
    targetSection: task.targetSection,
  });
  const memoryBlock = formatResumeMemoryBlock(relevantSlice);

  const awarenessBlock = `[RESUME_SITUATIONAL_AWARENESS]

${getResponseModeDirectives(responseMode)}

TASK_RESOLUTION:
goal: ${task.goal}
can_execute: ${task.canExecute}
missing_inputs: ${task.missingInputs.join(', ') || 'none'}
guidance: ${task.promptGuidance}

USER_INTENT:
name: ${intent.intent}
confidence: ${intent.confidence}

RESUME:
content_state: ${resumeAnalysis.contentState}
upload_state: ${resumeAnalysis.uploadState}
just_uploaded: ${resumeAnalysis.upload.justUploaded}
filename: ${resumeAnalysis.upload.filename || 'none'}
is_demo_data: ${resumeAnalysis.isDemoData}
${parsingQuality.hasIssues ? `parsing_flags: ${parsingQuality.flags.join(', ')}` : ''}

STATS:
experience: ${resumeAnalysis.stats.experienceCount}
education: ${resumeAnalysis.stats.educationCount}
skills: ${resumeAnalysis.stats.skillsCount}
projects: ${resumeAnalysis.stats.projectCount}
has_summary: ${resumeAnalysis.stats.hasSummary}

SECTIONS:
contact: ${resumeAnalysis.sections.contact.status}
summary: ${resumeAnalysis.sections.summary.status}
experience: ${resumeAnalysis.sections.experience.status}
education: ${resumeAnalysis.sections.education.status}
skills: ${resumeAnalysis.sections.skills.status}
projects: ${resumeAnalysis.sections.projects.status}

PRIORITY_ACTIONS:
${priorities.map((p) => `- ${p.action} (${p.section}): ${p.description}`).join('\n') || 'none'}

FOCUS:
${resumeAnalysis.missingOrWeakSections.join(', ') || 'none'}

[/RESUME_SITUATIONAL_AWARENESS]`;

  const promptSections = [evidenceBlock, memoryBlock, awarenessBlock, message].filter(Boolean);
  const contextualUserPrompt = promptSections.join('\n\n');

  // Replay prior turns so the agent has conversation memory and can continue after a
  // clarifying question. Cap history and trim prior verbose assistant monologues.
  const historyItems = Array.isArray(body.history)
    ? body.history
        .filter(
          (t) =>
            t &&
            typeof t.content === 'string' &&
            t.content.trim() &&
            (t.role === 'user' || t.role === 'assistant'),
        )
        .slice(-10)
        .map((t) => {
          if (t.role === 'user') {
            return user(t.content as string);
          }
          // Preserve assistant replies in history so full bullets and generated content remain accessible for follow-ups
          const cleanText = (t.content as string).trim();
          const trimmed = cleanText.length > 1200 ? cleanText.slice(0, 1200) + '...' : cleanText;
          return assistant(trimmed);
        })
    : [];
  const runInput = historyItems.length ? [...historyItems, user(contextualUserPrompt)] : contextualUserPrompt;

  // Bound turns strictly based on response mode (prevents rambling after action execution)
  const maxTurns = responseMode === 'CONFIRM' || responseMode === 'ANSWER' ? 3 : responseMode === 'ANALYZE' ? 4 : 6;

  // Cancellation: client abort / disconnect → stop the SDK run.
  const ac = new AbortController();
  let runSettled = false;
  // Only treat a connection close as a cancellation if the run hasn't finished yet.
  // (Our own res.end() also fires 'close'; the flag stops that from looking like an abort.)
  const onClose = () => {
    if (!runSettled) ac.abort();
  };
  res.on('close', onClose);

  sse.send({ type: 'run_started', agentRunId });

  let textDeltas = 0;

  try {
    const result = await run(agent, runInput, {
      stream: true,
      context,
      signal: ac.signal,
      maxTurns,
    });

    for await (const event of result) {
      if (ac.signal.aborted) break;
      if (event.type === 'raw_model_stream_event') {
        const data = event.data as { type?: string; delta?: string };
        // @openai/agents normalizes the model's text stream to "output_text_delta".
        // Accept the raw Responses API name too, so this survives an SDK version change.
        if (
          (data.type === 'output_text_delta' || data.type === 'response.output_text.delta') &&
          data.delta
        ) {
          textDeltas += 1;
          sse.send({ type: 'chat_delta', text: data.delta });
        }
      }
    }

    await result.completed;
    runSettled = true;

    // Fallback: if nothing streamed as deltas, forward the final text so the user still
    // gets a reply (covers non-streaming providers / any missed delta events).
    if (!ac.signal.aborted) {
      if (textDeltas === 0) {
        const finalText = String((result as { finalOutput?: unknown }).finalOutput ?? '').trim();
        if (finalText) sse.send({ type: 'chat_delta', text: finalText });
      }
      sse.send({ type: 'memory_updated', memory: currentMemory });
      sse.send({ type: 'run_completed', agentRunId });
    }
  } catch (err) {
    runSettled = true;
    console.error('[agent] run error', err instanceof Error ? err.stack || err.message : String(err));
    if (!ac.signal.aborted) {
      const userMessage = formatUserFriendlyAgentErrorMessage(err);
      sse.send({ type: 'error', message: userMessage, code: 'run_failed' });
    }
  } finally {
    runSettled = true;
    res.off('close', onClose);
    sse.close();
  }
}

export function formatUserFriendlyAgentErrorMessage(err: unknown): string {
  const raw = (err instanceof Error ? err.message : String(err || '')).toLowerCase();

  if (raw.includes('rate limit') || raw.includes('429') || raw.includes('too many requests')) {
    return "We're experiencing high demand right now. Please try again in a few moments.";
  }
  if (raw.includes('token') && (raw.includes('maximum') || raw.includes('context') || raw.includes('limit') || raw.includes('length'))) {
    return 'Your resume or conversation history is quite long. Try clearing chat or asking a more focused question.';
  }
  if (raw.includes('network') || raw.includes('econnreset') || raw.includes('timeout') || raw.includes('fetch failed')) {
    return 'A connection issue occurred while generating the response. Please check your connection and try again.';
  }
  if (raw.includes('unauthorized') || raw.includes('api key') || raw.includes('auth') || raw.includes('401')) {
    return 'Unable to access the AI service. Please refresh or try again.';
  }
  return 'I encountered a temporary issue while optimizing your resume. Please try asking again.';
}
