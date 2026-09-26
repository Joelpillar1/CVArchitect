import { ResumeStateAnalysis } from './resumeState';

export type UserIntent =
  | 'build_resume'
  | 'improve_entire_resume'
  | 'analyze_uploaded_resume'
  | 'tailor_job'
  | 'add_experience'
  | 'add_skills'
  | 'rewrite_section'
  | 'optimize_ats'
  | 'improve_metrics'
  | 'confirm_action'
  | 'general_query';

export interface UserIntentResult {
  intent: UserIntent;
  confidence: number;
  source: 'deterministic';
  targetSection?: string;
}

export interface DetectIntentOptions {
  /**
   * Set to true if the chat session currently has a pending action awaiting user confirmation.
   */
  hasPendingAction?: boolean;
  /**
   * Category of the active clarifying question if applicable.
   */
  activeQuestionCategory?: string;
}

/**
 * Deterministically classifies the user's intent from the incoming message,
 * informed by resume state and conversation status.
 */
export function detectUserIntent(
  message: string,
  resumeAnalysis?: ResumeStateAnalysis | null,
  options?: DetectIntentOptions
): UserIntentResult {
  const text = (message || '').trim();
  const lower = text.toLowerCase();

  // Edge Case: Empty or Whitespace
  if (!text) {
    return {
      intent: 'general_query',
      confidence: 0.1,
      source: 'deterministic',
    };
  }

  // ── 1. Confirm Action ───────────────────────────────────────────────────────
  // Handle explicit confirmation phrases
  const isExplicitConfirmPhrase =
    /^(yes|yeah|yep|sure|y|ok|okay|do it|go ahead|proceed|apply it|confirm|looks good|insert it|make the change|make these changes|apply changes|accept|perfect|sounds good)\b[.!]*$/i.test(
      lower
    ) ||
    /^(please )?(apply|insert|update|save|commit) (it|this|the changes?|them|now)\b/i.test(lower) ||
    /^go ahead and (insert|apply|add|update|do it)\b/i.test(lower) ||
    (Boolean(options?.hasPendingAction) && /^(yes|yeah|yep|sure|ok|okay|proceed|do it|go ahead|apply|insert)\b/i.test(lower));

  if (isExplicitConfirmPhrase) {
    const confidence = options?.hasPendingAction ? 0.98 : lower.length < 5 ? 0.75 : 0.9;
    return {
      intent: 'confirm_action',
      confidence,
      source: 'deterministic',
    };
  }

  // ── 2. Tailor Job ───────────────────────────────────────────────────────────
  // Match tailoring, matching against JD, or pasting job descriptions
  const isJobTailorPattern =
    /\b(tailor|match|align|adapt|customize|target)\b.*\b(job|role|jd|position|posting|description)\b/i.test(
      lower
    ) ||
    /\b(fit|optimize)\b.*\b(for (this|the) (job|role|position|jd))\b/i.test(lower) ||
    /\b(match (my )?(resume|cv) to)\b/i.test(lower) ||
    /\btailor (my )?(resume|cv)\b/i.test(lower) ||
    /\b(job description|responsibilities|must-have requirements|qualifications)\s*:/i.test(lower) ||
    /\b(job description|target job|target position|target role)\b/i.test(lower);

  if (isJobTailorPattern) {
    return {
      intent: 'tailor_job',
      confidence: 0.94,
      source: 'deterministic',
    };
  }

  // ── 3. Analyze Uploaded Resume ──────────────────────────────────────────────
  const isUploadAnalysisPattern =
    /\b(analyze|review|scan|check|critique|evaluate|audit)\b.*\b(uploaded|my cv|my resume|this resume|this cv|the file)\b/i.test(
      lower
    ) ||
    /\bwhat('s| is) wrong with (my )?(uploaded )?(cv|resume)\b/i.test(lower) ||
    /\breview the resume i just uploaded\b/i.test(lower);

  if (isUploadAnalysisPattern) {
    return {
      intent: 'analyze_uploaded_resume',
      confidence: resumeAnalysis?.upload?.justUploaded ? 0.96 : 0.88,
      source: 'deterministic',
    };
  }

  // ── 4. Optimize ATS ─────────────────────────────────────────────────────────
  const isAtsPattern =
    /\b(ats|applicant tracking system)\b/i.test(lower) ||
    /\b(ats[- ]friendly|ats score|pass ats|beat the ats)\b/i.test(lower);

  if (isAtsPattern) {
    return {
      intent: 'optimize_ats',
      confidence: 0.93,
      source: 'deterministic',
    };
  }

  // ── 5. Improve Metrics & Measurable Impact ──────────────────────────────────
  const isMetricsPattern =
    /\b(quantitativ\w*|quantif\w*|measurable|metrics?|numbers?|percentages?|achievements?|outcomes?|impact)\b/i.test(
      lower
    ) &&
    /\b(add|improve|more|make|include|boost|strengthen|increase|quantif\w*)\b/i.test(lower);

  if (isMetricsPattern) {
    return {
      intent: 'improve_metrics',
      confidence: 0.91,
      source: 'deterministic',
      targetSection: 'experience',
    };
  }

  // ── 6. Add Experience / Jobs ────────────────────────────────────────────────
  const isAddExperiencePattern =
    /\b(add|insert|include|new)\b.*\b(experience|job|role|position|company|work history)\b/i.test(
      lower
    ) ||
    /\b(i want to add a (role|job|company)|add another job)\b/i.test(lower);

  if (isAddExperiencePattern) {
    return {
      intent: 'add_experience',
      confidence: 0.92,
      source: 'deterministic',
      targetSection: 'experience',
    };
  }

  // ── 7. Add Skills ───────────────────────────────────────────────────────────
  const isSkillsPattern =
    /\b(add|include|insert|suggest|recommend|what|fix|only fix)\b.*\bskills?\b/i.test(lower) ||
    /\b(improve|update|expand)\b.*\bskills? (section)?\b/i.test(lower) ||
    /\b(add (python|react|typescript|sql|aws|java|docker|kubernetes|node|tools))\b/i.test(lower);

  if (isSkillsPattern) {
    return {
      intent: 'add_skills',
      confidence: 0.91,
      source: 'deterministic',
      targetSection: 'skills',
    };
  }

  // ── 8. Rewrite Section ──────────────────────────────────────────────────────
  const isRewriteSectionPattern =
    /\b(rewrite|rephrase|redo|fix|edit|polish|update|only fix)\b.*\b(summary|experience|bullets?|education|skills?|projects?|header|contact)\b/i.test(
      lower
    ) ||
    /\b(improve the bullets|rewrite this section|fix this education section)\b/i.test(lower);

  if (isRewriteSectionPattern) {
    let targetSection = 'experience';
    if (lower.includes('summary')) targetSection = 'summary';
    else if (lower.includes('skills')) targetSection = 'skills';
    else if (lower.includes('education')) targetSection = 'education';
    else if (lower.includes('project')) targetSection = 'projects';
    else if (lower.includes('contact') || lower.includes('header')) targetSection = 'contact';

    return {
      intent: 'rewrite_section',
      confidence: 0.89,
      source: 'deterministic',
      targetSection,
    };
  }

  // ── 9. Improve Entire Resume ────────────────────────────────────────────────
  const isImproveEntirePattern =
    /\b(improve|fix|enhance|strengthen|polish|level up|refine|critique|review)\b.*\b(my )?(resume|cv|entire resume)\b/i.test(
      lower
    ) ||
    /\b(make (my )?(resume|cv) better)\b/i.test(lower);

  if (isImproveEntirePattern) {
    return {
      intent: 'improve_entire_resume',
      confidence: 0.9,
      source: 'deterministic',
    };
  }

  // ── 10. Build Resume ────────────────────────────────────────────────────────
  const isBuildResumePattern =
    /\b(build|create|generate|write|make|start)\b.*\b(a )?(new )?(resume|cv|from scratch)\b/i.test(
      lower
    ) ||
    /\b(i need a (new )?resume|help me (build|create) (a )?resume)\b/i.test(lower);

  if (isBuildResumePattern) {
    return {
      intent: 'build_resume',
      confidence: 0.92,
      source: 'deterministic',
    };
  }

  // ── 11. General Query / Fallback ────────────────────────────────────────────
  // Calculate a baseline confidence based on general question patterns
  const isQuestion = /^(what|how|why|when|where|can you|could you|is it|should i)\b/i.test(lower);
  const confidence = isQuestion ? 0.65 : 0.4;

  return {
    intent: 'general_query',
    confidence,
    source: 'deterministic',
  };
}
