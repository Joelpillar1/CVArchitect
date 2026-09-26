import { UserIntentResult } from './intentDetector';
import { ResumeStateAnalysis } from './resumeState';

export type AgentResponseMode = 'ACT' | 'ANALYZE' | 'ANSWER' | 'ASK' | 'CONFIRM';

export interface ResponseModeContext {
  hasPendingAction?: boolean;
  missingRequiredInfo?: boolean;
}

/**
 * Deterministically computes the response mode for the agent based on user intent and resume state.
 */
export function getResponseMode(
  intent: UserIntentResult,
  resumeAnalysis: ResumeStateAnalysis,
  context?: ResponseModeContext
): AgentResponseMode {
  // 1. CONFIRM Mode: user is confirming a pending action or stating "yes/do it"
  if (intent.intent === 'confirm_action') {
    return 'CONFIRM';
  }

  // 2. ASK Mode: if crucial required info is genuinely missing before an action can execute
  // e.g. building from scratch on an EMPTY resume with no role/target info
  if (
    context?.missingRequiredInfo ||
    (intent.intent === 'build_resume' &&
      resumeAnalysis.contentState === 'EMPTY' &&
      !resumeAnalysis.hasMeaningfulContent)
  ) {
    return 'ASK';
  }

  // 3. ANALYZE Mode: auditing uploaded document or analyzing resume gaps
  if (intent.intent === 'analyze_uploaded_resume') {
    return 'ANALYZE';
  }

  // 4. ANSWER Mode: general knowledge, informational questions, greetings
  if (intent.intent === 'general_query') {
    return 'ANSWER';
  }

  // 5. ACT Mode: all actionable mutation and tailoring intents
  // build_resume (when context exists), add_experience, add_skills, rewrite_section, improve_metrics, optimize_ats, tailor_job, improve_entire_resume
  return 'ACT';
}

/**
 * Returns concise, non-negotiable behavioral directives tailored to the active response mode.
 */
export function getResponseModeDirectives(mode: AgentResponseMode): string {
  switch (mode) {
    case 'ACT':
      return `RESPONSE_MODE: ACT
- Direct tool execution is MANDATORY. Execute the required resume operation ('propose_operation') immediately.
- After the operation applies successfully, return EXACTLY ONE short confirmation sentence (e.g., "Done — I rewrote your summary.", "Added your role at Google to Experience.").
- DO NOT explain your reasoning, methodology, or ATS strategy.
- DO NOT summarize the resume or list bullet points of what you changed.`;

    case 'ANALYZE':
      return `RESPONSE_MODE: ANALYZE
- Provide a concise diagnostic evaluation.
- MAXIMUM 3 short bullet points.
- NO introductory paragraphs, NO closing disclaimers, NO filler sentences.`;

    case 'ANSWER':
      return `RESPONSE_MODE: ANSWER
- Answer the user's question directly.
- MAXIMUM 3 short sentences.
- Do not turn standard questions into long tutorials.`;

    case 'ASK':
      return `RESPONSE_MODE: ASK
- Ask EXACTLY ONE single, targeted question using 'request_clarification' or direct text.
- Never dump multiple questions or questionnaires.`;

    case 'CONFIRM':
      return `RESPONSE_MODE: CONFIRM
- Output an ultra-short confirmation (e.g., "Done.", "Applied.", "Yes — applied the changes.").
- Zero explanation.`;

    default:
      return `RESPONSE_MODE: ACT
- Be extremely concise. Action first, minimal explanation.`;
  }
}
