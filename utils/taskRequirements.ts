import { UserIntentResult } from './intentDetector';
import { ResumeStateAnalysis } from './resumeState';
import { AgentResponseMode, getResponseMode } from './responseMode';
import { JobDescriptionData } from '../types/resumeAgent';
import { ResumeData } from '../types';

export interface PendingAction {
  type: string;
  description?: string;
  operations?: unknown[];
  targetSection?: string;
}

export interface AgentTask {
  intent: UserIntentResult['intent'];
  responseMode: AgentResponseMode;
  goal: string;
  requiredInputs: string[];
  availableInputs: string[];
  missingInputs: string[];
  canExecute: boolean;
  targetSection?: string;
  targetRole?: string;
  targetJob?: string;
  pendingAction?: PendingAction | null;
  nextStep: 'EXECUTE' | 'REQUEST_INPUT' | 'ANALYZE' | 'ANSWER' | 'CONFIRM';
  promptGuidance: string;
}

export interface ResolveTaskOptions {
  jobData?: JobDescriptionData | null;
  pendingAction?: PendingAction | null;
  message?: string;
  hasIssues?: boolean;
}

/**
 * Checks for obvious parsing anomalies or malformed resume fields from OCR/PDF extraction.
 */
export function detectParsingQualityIssues(resume: ResumeData): { hasIssues: boolean; flags: string[] } {
  const flags: string[] = [];

  if (!resume.fullName || resume.fullName.trim().length === 0) {
    flags.push('missing_full_name');
  }

  // Check if skills contain giant paragraphs (e.g. OCR misrecognized section)
  if (resume.skills && resume.skills.length > 500 && !resume.skills.includes(',')) {
    flags.push('skills_contain_paragraph_text');
  }

  // Check if experiences have empty descriptions
  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    const emptyDescriptions = resume.experience.filter((exp) => {
      if (!exp.description) return true;
      if (Array.isArray(exp.description)) return exp.description.length === 0 || exp.description.every((b) => !b || !b.trim());
      return typeof exp.description === 'string' && exp.description.trim().length === 0;
    });
    if (emptyDescriptions.length === resume.experience.length) {
      flags.push('experience_bullets_empty');
    }
  }

  return {
    hasIssues: flags.length > 0,
    flags,
  };
}

/**
 * Deterministically resolves the AgentTask from user intent, resume state, and available context.
 */
export function resolveAgentTask(
  intent: UserIntentResult,
  resumeAnalysis: ResumeStateAnalysis,
  options?: ResolveTaskOptions
): AgentTask {
  const message = options?.message || '';
  const lowerMsg = message.toLowerCase();
  const targetSection = intent.targetSection;
  const pendingAction = options?.pendingAction || null;
  const hasPendingAction = Boolean(pendingAction);

  const availableInputs: string[] = [];
  const requiredInputs: string[] = [];
  const missingInputs: string[] = [];

  // 1. Audit Available Inputs
  if (resumeAnalysis.hasMeaningfulContent) {
    availableInputs.push('resume');
  }
  if (resumeAnalysis.stats.experienceCount > 0) {
    availableInputs.push('experience');
  }
  if (resumeAnalysis.stats.skillsCount > 0) {
    availableInputs.push('skills');
  }
  if (resumeAnalysis.stats.hasSummary) {
    availableInputs.push('summary');
  }
  if (resumeAnalysis.stats.educationCount > 0) {
    availableInputs.push('education');
  }
  if (options?.jobData?.descriptionText?.trim()) {
    availableInputs.push('job_description');
  }
  if (hasPendingAction) {
    availableInputs.push('pending_action');
  }
  if (resumeAnalysis.uploadState === 'ANALYZED') {
    availableInputs.push('analyzed_upload');
  }

  let goal = 'Assist the candidate with their resume';
  let promptGuidance = 'Respond accurately and concisely.';

  switch (intent.intent) {
    case 'confirm_action': {
      requiredInputs.push('pending_action');
      goal = 'Execute the user-approved pending resume operations';
      promptGuidance = hasPendingAction
        ? 'Execute the confirmed operation immediately and confirm in 1 short phrase ("Done.", "Applied.").'
        : 'If no pending action exists, ask what change the user would like to make.';
      break;
    }

    case 'tailor_job': {
      requiredInputs.push('resume', 'job_description');
      goal = 'Tailor existing resume evidence to the target job description';
      promptGuidance =
        'Compare candidate resume facts against JD requirements. Do NOT invent missing skills or facts. Apply verified alignment operations and confirm in 1 sentence.';
      break;
    }

    case 'analyze_uploaded_resume': {
      requiredInputs.push('resume');
      goal = 'Audit the uploaded resume and identify top 3 high-impact gaps';
      promptGuidance =
        'Evaluate the uploaded resume. Highlight at most 3 concise bullet points with zero intro/conclusion filler.';
      break;
    }

    case 'add_experience': {
      requiredInputs.push('role_or_company');
      // Check if message mentions a role or company
      const mentionsRoleOrCompany =
        /\b(at|for|as|role|position|engineer|manager|developer|designer|lead|director|intern)\b/i.test(
          lowerMsg
        );
      if (mentionsRoleOrCompany) {
        availableInputs.push('role_or_company');
      }
      goal = 'Add a new work experience entry to the resume';
      promptGuidance =
        'Extract role, company, dates, and bullets from candidate text. Propose insert_item operation and confirm in 1 sentence.';
      break;
    }

    case 'add_skills': {
      requiredInputs.push('resume');
      goal = 'Add verified skills or suggest high-relevance skills';
      promptGuidance =
        'Add requested skills or suggest relevant skills matching background. Apply operation and confirm in 1 sentence.';
      break;
    }

    case 'rewrite_section': {
      requiredInputs.push('target_section');
      if (targetSection) {
        availableInputs.push('target_section');
      }
      goal = `Rewrite and strengthen the ${targetSection || 'specified'} section`;
      promptGuidance =
        'Preserve candidate facts while strengthening action verbs, clarity, and structure. Apply operation and confirm in 1 sentence.';
      break;
    }

    case 'improve_metrics': {
      requiredInputs.push('experience');
      goal = 'Enhance resume bullets with strong impact and specificity without inventing metrics';
      promptGuidance =
        'Refine bullets to focus on outcomes and scope. NEVER hallucinate fake revenue, percentages, or metrics. If metric is missing, use scope/delivery framing or ask candidate.';
      break;
    }

    case 'optimize_ats': {
      requiredInputs.push('resume');
      goal = 'Optimize resume structure, headings, and keyword clarity for ATS';
      promptGuidance =
        'Improve keyword alignment and clean formatting. Do NOT keyword-stuff or add unsupported skills.';
      break;
    }

    case 'build_resume': {
      if (resumeAnalysis.contentState === 'EMPTY') {
        // Check if message supplies target role
        const hasRoleMention = /\b(for|as a|as an|targeting|aiming for|role)\b/i.test(lowerMsg);
        requiredInputs.push('target_role');
        if (hasRoleMention) {
          availableInputs.push('target_role');
        }
      }
      goal = 'Build or structure foundational resume content';
      promptGuidance =
        resumeAnalysis.contentState === 'EMPTY'
          ? 'Ask exactly ONE targeted question: "What role are you targeting?"'
          : 'Resume already contains content. Expand foundational sections directly.';
      break;
    }

    case 'improve_entire_resume': {
      requiredInputs.push('resume');
      goal = 'Identify top 3-5 weaknesses and apply bounded high-impact improvements';
      promptGuidance =
        'Focus on top priority weaknesses (summary, weakest experience bullets). Apply bounded operations and confirm in 1 sentence.';
      break;
    }

    case 'general_query':
    default: {
      goal = 'Answer candidate inquiry with accurate resume advice';
      promptGuidance = 'Answer directly in $\\le 3$ sentences without fluff.';
      break;
    }
  }

  // Calculate missing inputs
  for (const req of requiredInputs) {
    if (!availableInputs.includes(req)) {
      missingInputs.push(req);
    }
  }

  const canExecute = missingInputs.length === 0;

  // Determine Next Step & Response Mode
  let nextStep: AgentTask['nextStep'] = 'EXECUTE';
  if (!canExecute) {
    nextStep = 'REQUEST_INPUT';
  } else if (intent.intent === 'confirm_action') {
    nextStep = 'CONFIRM';
  } else if (intent.intent === 'analyze_uploaded_resume') {
    nextStep = 'ANALYZE';
  } else if (intent.intent === 'general_query') {
    nextStep = 'ANSWER';
  } else {
    nextStep = 'EXECUTE';
  }

  const responseMode =
    nextStep === 'REQUEST_INPUT'
      ? 'ASK'
      : getResponseMode(intent, resumeAnalysis, {
          hasPendingAction,
          missingRequiredInfo: !canExecute,
        });

  return {
    intent: intent.intent,
    responseMode,
    goal,
    requiredInputs,
    availableInputs,
    missingInputs,
    canExecute,
    targetSection,
    targetRole: options?.jobData?.title || undefined,
    targetJob: options?.jobData?.title || undefined,
    pendingAction,
    nextStep,
    promptGuidance,
  };
}
