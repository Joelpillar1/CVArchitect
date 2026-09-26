import { Agent, tool } from '@openai/agents';
import { z } from 'zod';
import type { ResumeData } from '../../types';
import type { JobDescriptionData } from '../../types/resumeAgent';
import type { AgentSSEEvent, ResumeOperation } from '../../types/resumeOperations';
import { validateOperation, applyOperation } from '../../utils/resumeOperations';
import {
  parseDescriptionBullets,
  parseAchievementBullets,
} from '../../utils/templateUtils';
import { serializeResumeToText } from '../../utils/resumeText';
import { ATSEngine } from '../../utils/ats-engine/engine';
import taxonomyData from '../../Bullets/ats_keyword_dataset_10k_plus.json';
import {
  resumeDataToStructured,
  structuredToResumeData,
  ResumeContract,
  CandidateEvidence,
} from '../../types/agentContract';
import { CandidateEvidenceService } from '../../services/candidateEvidenceService';
import { fallbackJobIntelligence } from '../../services/jobDescriptionService';
import { EvidenceMatchingService } from '../../services/evidenceMatchingService';
import { QuestionEngineService } from '../../services/questionEngineService';

/**
 * Server-side CVArchitect Resume Agent Orchestrator (Phase 8 Foundation)
 *
 * Implements the 19-step expert resume strategist workflow:
 * 1. Load resume -> 2. Analyze resume -> 3. Load JD -> 4. Analyze JD ->
 * 5. Build evidence matrix -> 6. Identify gaps -> 7. Determine questions needed ->
 * 8. Ask high-value questions -> 9. Incorporate answers -> 10. Build tailoring strategy ->
 * 11. Apply structured operations -> 12. Validate factual claims -> 13. Evaluate alignment ->
 * 14. Evaluate ATS -> 15. Recruiter readability -> 16. Run final critic ->
 * 17. Fix important issues -> 18. Validate again -> 19. Finalize.
 */

// ── Per-run context (passed via run(agent, input, { context })) ───────────────

export interface AgentRunContext {
  agentRunId: string;
  resumeId?: string;
  /** Mutable working copy; propose_operation folds each applied op into it. */
  resume: ResumeData;
  jobData: JobDescriptionData | null;
  /** Candidate facts (memory separate from the resume). record_candidate_fact appends. */
  facts: Array<{ topic: string; value: string }>;
  /** Resume-scoped conversational memory container */
  memory?: import('../../utils/resumeAgentMemory').ResumeAgentMemory;
  /** SSE writer bound to the current response. */
  emit: (event: AgentSSEEvent) => void;
  /** Monotonic counter -> deterministic, unique operationId per run. */
  opSeq: number;
}

// ── Snapshot the model reads (compact, includes item & bullet ids) ────────────

function snapshotForModel(resume: ResumeData, jobData: JobDescriptionData | null) {
  const expItems = (items: ResumeData['experience'] = []) =>
    items.map((e, eIdx) => ({
      itemId: e.id || `exp_${eIdx + 1}`,
      company: e.company,
      role: e.role,
      location: e.location ?? '',
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: parseDescriptionBullets(e.description),
    }));

  return {
    header: {
      fullName: resume.fullName,
      jobTitle: resume.jobTitle,
      email: resume.email ?? '',
      phone: resume.phone ?? '',
      linkedin: resume.linkedin ?? '',
      location: resume.location ?? '',
    },
    summary: resume.summary ?? '',
    skills: resume.skills ?? '',
    experience: expItems(resume.experience),
    leadership: (resume.leadership ?? []).map((l, lIdx) => ({
      itemId: l.id || `lead_${lIdx + 1}`,
      organization: l.organization || l.company || '',
      role: l.role,
      location: l.location ?? '',
      startDate: l.startDate,
      endDate: l.endDate,
      bullets: parseDescriptionBullets(l.description),
    })),
    keyAchievements: parseAchievementBullets(resume.keyAchievements ?? []),
    education: (resume.education ?? []).map((e, idx) => ({
      itemId: e.id || `edu_${idx + 1}`,
      school: e.school,
      degree: e.degree,
      year: e.year,
    })),
    projects: (resume.projects ?? []).map((p, idx) => ({
      itemId: p.id || `proj_${idx + 1}`,
      name: p.name,
      role: p.role ?? '',
      description: p.description,
      technologies: p.technologies ?? '',
      bullets: parseDescriptionBullets(p.description),
    })),
    certifications: (resume.certifications ?? []).map((c, idx) => ({
      itemId: c.id || `cert_${idx + 1}`,
      name: c.name,
      issuer: c.issuer,
      date: c.date,
    })),
    languages: (resume.languages ?? []).map((l, idx) => ({
      itemId: l.id || `lang_${idx + 1}`,
      language: l.language,
      proficiency: l.proficiency,
    })),
    referee: resume.referee ?? '',
    sectionOrder: resume.sectionOrder ?? [],
    sectionVisibility: resume.sectionVisibility ?? {},
    sectionTitles: resume.sectionTitles ?? {},
    targetJob: jobData
      ? {
          title: jobData.title,
          company: jobData.company,
          requiredSkills: jobData.requiredSkills,
          keywords: jobData.keywords,
        }
      : null,
  };
}

// ── propose_operation parameters ─────────────────────────────────────────────

const OP_NAMES = [
  'set_field',
  'replace_bullet',
  'insert_bullet',
  'delete_bullet',
  'update_item',
  'insert_item',
  'delete_item',
  'add_skill',
  'remove_skill',
  'set_skills',
  'reorder_sections',
  'show_section',
  'hide_section',
  'rename_section',
] as const;

const fieldPair = z.object({ key: z.string(), value: z.string() });

const proposeParameters = z.object({
  op: z.enum(OP_NAMES).describe('Which operation to perform.'),
  reason: z.string().describe('One short sentence explaining why this edit helps.'),
  evidence: z
    .array(z.string())
    .describe(
      'Grounding for content changes: short quotes/paraphrases from candidate resume, candidate chat facts, or target JD. Required for content changes.',
    ),
  field: z.string().nullable().optional().describe('set_field only: one of fullName, jobTitle, email, phone, linkedin, atHandle, address, location, summary, referee, interests, coursework, thesis, securityClearance.'),
  value: z.string().nullable().optional().describe('The text value for set_field, bullet ops (MANDATORY: every bullet point MUST be calibrated to exactly 2 full lines / 24-34 words / 150-220 characters), skill ops, or initial content for show_section.'),
  section: z.string().nullable().optional().describe('Target section name for bullet ops, item ops, show_section, hide_section, or rename_section (e.g. experience, education, skills, projects, certifications, leadership, languages, references, summary, etc.).'),
  itemId: z.string().nullable().optional().describe('The itemId from the snapshot for experience/leadership bullets and all item ops.'),
  bulletIndex: z.number().int().nullable().optional().describe('Bullet ops: zero-based index of the bullet. For insert, the position to insert at.'),
  fields: z.array(fieldPair).nullable().optional().describe('update_item only: the fields to patch, as {key,value} pairs.'),
  item: z.array(fieldPair).nullable().optional().describe('insert_item only: the new item’s fields, as {key,value} pairs (any experience/leadership description bullets MUST each be calibrated to exactly 2 full lines / 24-34 words).'),
  order: z.array(z.string()).nullable().optional().describe('reorder_sections only: the new section order.'),
  title: z.string().nullable().optional().describe('rename_section only: the new display title for the section.'),
});

type ProposeInput = z.infer<typeof proposeParameters>;

function pairsToRecord(pairs: Array<{ key: string; value: string }> | null | undefined): Record<string, string> {
  const record: Record<string, string> = {};
  for (const pair of pairs ?? []) {
    if (pair && pair.key) record[pair.key] = pair.value ?? '';
  }
  return record;
}

function buildOperation(
  base: { operationId: string; agentRunId: string; reason: string; evidence: string[] },
  i: ProposeInput,
): ResumeOperation {
  switch (i.op) {
    case 'set_field':
      return { ...base, op: 'set_field', field: (i.field ?? '') as never, value: i.value ?? '' };
    case 'replace_bullet':
    case 'insert_bullet': {
      const op: Record<string, unknown> = {
        ...base,
        op: i.op,
        section: i.section ?? '',
        bulletIndex: i.bulletIndex ?? 0,
        value: i.value ?? '',
      };
      if (i.itemId) op.itemId = i.itemId;
      return op as unknown as ResumeOperation;
    }
    case 'delete_bullet': {
      const op: Record<string, unknown> = {
        ...base,
        op: 'delete_bullet',
        section: i.section ?? '',
        bulletIndex: i.bulletIndex ?? 0,
      };
      if (i.itemId) op.itemId = i.itemId;
      return op as unknown as ResumeOperation;
    }
    case 'update_item':
      return { ...base, op: 'update_item', section: (i.section ?? '') as never, itemId: i.itemId ?? '', fields: pairsToRecord(i.fields) };
    case 'insert_item':
      return { ...base, op: 'insert_item', section: (i.section ?? '') as never, item: pairsToRecord(i.item) };
    case 'delete_item':
      return { ...base, op: 'delete_item', section: (i.section ?? '') as never, itemId: i.itemId ?? '' };
    case 'add_skill':
      return { ...base, op: 'add_skill', value: i.value ?? '' };
    case 'remove_skill':
      return { ...base, op: 'remove_skill', value: i.value ?? '' };
    case 'set_skills':
      return { ...base, op: 'set_skills', value: i.value ?? '' };
    case 'reorder_sections':
      return { ...base, op: 'reorder_sections', order: i.order ?? [] };
    case 'show_section': {
      const op: Record<string, unknown> = {
        ...base,
        op: 'show_section',
        section: i.section ?? '',
      };
      if (i.value) op.value = i.value;
      return op as unknown as ResumeOperation;
    }
    case 'hide_section':
      return { ...base, op: 'hide_section', section: i.section ?? '' };
    case 'rename_section':
      return { ...base, op: 'rename_section', section: i.section ?? '', title: i.title ?? '' };
    default:
      return { ...base, op: 'set_field', field: 'summary' as never, value: '' };
  }
}

// ── Deterministic ATS Engine ──────────────────────────────────────────────────

let cachedEngine: ATSEngine | null = null;
function getEngine(): ATSEngine {
  if (!cachedEngine) cachedEngine = new ATSEngine(taxonomyData as unknown);
  return cachedEngine;
}

function keywordStrings(matches: Array<{ job_keyword: string }>, limit: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of matches) {
    const kw = (m.job_keyword ?? '').trim();
    if (!kw) continue;
    const key = kw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(kw);
    if (out.length >= limit) break;
  }
  return out;
}

// ── Tools ─────────────────────────────────────────────────────────────────────

const getResumeSnapshot = tool({
  name: 'get_resume_snapshot',
  description:
    'Read the candidate’s current resume (and target job, if any). Returns section content plus the itemId of every experience/leadership/education/project/certification entry. Call this FIRST.',
  parameters: z.object({}),
  execute: async (_input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    return snapshotForModel(ctx.resume, ctx.jobData);
  },
});

const analyzeJob = tool({
  name: 'analyze_job',
  description:
    'Analyze the target job description to extract weighted keywords, hard skills, core competencies, and required experience level. Call this after get_resume_snapshot when tailoring for a specific role.',
  parameters: z.object({
    jobText: z.string().nullable().describe('The job description text. Pass null to use the target job already attached to the candidate.'),
  }),
  execute: async (input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    const text = (input.jobText ?? ctx.jobData?.descriptionText ?? '').trim();
    if (!text) {
      return { ok: false, error: 'No job description provided or attached.' };
    }
    const engine = getEngine();
    const result = engine.analyze(text, serializeResumeToText(ctx.resume));

    return {
      ok: true,
      jobTitle: ctx.jobData?.title ?? 'Target Role',
      company: ctx.jobData?.company ?? null,
      matchScore: result.score_breakdown.overall_score ?? 0,
      currentScore: result.score_breakdown.overall_score ?? 0,
      matchedKeywords: (result.matched_keywords || []).map((k) => k.job_keyword),
      topKeywords: (result.matched_keywords || []).map((k) => k.job_keyword),
      missingKeywords: (result.missing_keywords || []).map((k) => k.job_keyword),
      suggestions: result.resume_improvement_suggestions || [],
    };
  },
});

const getEvidenceMatrix = tool({
  name: 'get_evidence_matrix',
  description:
    'Generate the multi-factor Evidence Matrix comparing target job requirements against verified candidate evidence. Evaluates strengths (strong, moderate, weak, missing) and recommends strategic actions (keep, emphasize, rewrite, ask_question, do_not_claim).',
  parameters: z.object({
    jobText: z.string().nullable().describe('Job description text. Pass null to use existing target job.'),
  }),
  execute: async (input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    const jdText = (input.jobText ?? ctx.jobData?.descriptionText ?? '').trim();
    if (!jdText) {
      return { ok: false, error: 'No job description available.' };
    }

    const job = fallbackJobIntelligence(jdText);
    const evidenceSvc = new CandidateEvidenceService();
    const candidateId = ctx.agentRunId || 'default_candidate';
    const resumeEvidence = evidenceSvc.extractEvidenceFromResume(ctx.resume, candidateId);

    // Add candidate chat facts to evidence pool
    ctx.facts.forEach((f) => {
      evidenceSvc.addCandidateEvidence({
        candidateId,
        claim: f.value,
        topic: f.topic,
        sourceType: 'candidate_answer',
        sourceId: 'chat_fact',
        status: 'verified',
      });
    });

    const matchingSvc = new EvidenceMatchingService();
    const matrix = matchingSvc.generateEvidenceMatrix(job, evidenceSvc.getCandidateEvidence(candidateId), candidateId);

    return {
      ok: true,
      overallMatchScore: matrix.overallMatchScore,
      coverage: matrix.coverageBreakdown,
      missingCriticalGaps: matrix.missingCriticalGaps,
      keyStrengths: matrix.keyStrengths,
      recommendedQuestions: matrix.recommendedQuestions,
      items: matrix.items.map((item) => ({
        requirement: item.requirementText,
        importance: item.importance,
        strength: item.strength,
        action: item.recommendedAction,
        gap: item.gapAnalysis,
        rationale: item.actionRationale,
      })),
    };
  },
});

const requestClarification = tool({
  name: 'request_clarification',
  description:
    'Ask the candidate ONE specific question when you need a real fact you cannot ground in their current resume (a missing metric, scope of a role, or whether they used a required tool). After calling this, STOP — do not call more tools and do not guess.',
  parameters: z.object({
    question: z.string().describe('The single, specific question to ask the candidate.'),
    category: z
      .enum(['missing_metric', 'missing_outcome', 'missing_skill', 'missing_leadership', 'unclear_responsibility', 'seniority_gap', 'quantify', 'scope', 'clarify'])
      .nullable()
      .describe('What kind of gap this probes.'),
    skillTag: z.string().nullable().describe('The clean keyword or skill being confirmed.'),
  }),
  execute: async (input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    ctx.emit({
      type: 'awaiting_input',
      question: input.question,
      category: input.category ?? undefined,
      skillTag: input.skillTag ?? undefined,
    });
    return {
      asked: true,
      note: 'Question sent to candidate. Stop now; their answer will arrive on the next turn.',
    };
  },
});

const searchCandidateProfile = tool({
  name: 'search_candidate_profile',
  description:
    'Search the candidate’s recorded facts (memory gathered from earlier chat, separate from the resume). Returns matching {topic, value} facts.',
  parameters: z.object({
    query: z.string().nullable().describe('Keywords to match against fact topics/values. Pass null to list all facts.'),
  }),
  execute: async (input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    const q = (input.query ?? '').trim().toLowerCase();
    const matches = q
      ? ctx.facts.filter((f) => f.topic.toLowerCase().includes(q) || f.value.toLowerCase().includes(q))
      : ctx.facts;
    return { facts: matches.slice(0, 25) };
  },
});

const recordCandidateFact = tool({
  name: 'record_candidate_fact',
  description:
    'Save a grounded fact the candidate stated in chat (e.g. an answer to a clarifying question) to their profile memory, so it can be cited as evidence and not re-asked.',
  parameters: z.object({
    topic: z.string().describe('A short label for the fact, e.g. "Team size at Acme".'),
    value: z.string().describe('The candidate-provided fact, e.g. "Led a team of 6 engineers".'),
  }),
  execute: async (input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    const topic = (input.topic ?? '').trim();
    const value = (input.value ?? '').trim();
    if (!topic || !value) {
      return { recorded: false, error: 'Both topic and value are required.' };
    }
    const idx = ctx.facts.findIndex((f) => f.topic.toLowerCase() === topic.toLowerCase());
    if (idx >= 0) ctx.facts[idx] = { topic, value };
    else ctx.facts.push({ topic, value });
    ctx.emit({ type: 'fact_recorded', topic, value });
    return { recorded: true };
  },
});

const recordUserDecision = tool({
  name: 'record_user_decision',
  description:
    'Save a user decision, constraint, or stylistic preference (e.g. "Keep Product Designer title unchanged", "Use UK English", "Do not claim management").',
  parameters: z.object({
    decision: z.string().describe('The user decision or constraint.'),
    category: z
      .enum(['role_title', 'language_style', 'skill_inclusion', 'experience_scope', 'formatting', 'general'])
      .optional()
      .describe('Category of decision.'),
  }),
  execute: async (input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    const decision = (input.decision ?? '').trim();
    if (!decision) return { recorded: false, error: 'Decision text is required.' };
    ctx.emit({ type: 'decision_recorded', decision, category: input.category });
    return { recorded: true, note: `User decision recorded: "${decision}".` };
  },
});

const recordCorrection = tool({
  name: 'record_correction',
  description:
    'Record an explicit user correction that supersedes an older fact (e.g. "Team size was 12, not 9").',
  parameters: z.object({
    topic: z.string().describe('Topic being corrected, e.g. "Team size".'),
    correctedValue: z.string().describe('The new correct value, e.g. "12 designers".'),
    originalValue: z.string().optional().describe('The previous value being replaced if known.'),
  }),
  execute: async (input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    const topic = (input.topic ?? '').trim();
    const correctedValue = (input.correctedValue ?? '').trim();
    if (!topic || !correctedValue) {
      return { recorded: false, error: 'Topic and corrected value are required.' };
    }
    const idx = ctx.facts.findIndex((f) => f.topic.toLowerCase() === topic.toLowerCase());
    if (idx >= 0) ctx.facts[idx] = { topic, value: correctedValue };
    else ctx.facts.push({ topic, value: correctedValue });
    ctx.emit({ type: 'fact_recorded', topic, value: correctedValue });
    return { recorded: true, note: `Correction recorded: "${topic}" is now "${correctedValue}".` };
  },
});

const rejectClaim = tool({
  name: 'reject_claim',
  description:
    'Record a claim that the user explicitly rejected so the agent never regenerates it (e.g. "Candidate led a team of 10 designers").',
  parameters: z.object({
    claim: z.string().describe('The claim or phrasing the user rejected.'),
    reason: z.string().optional().describe('Why it was rejected, e.g. "Candidate did not lead them".'),
  }),
  execute: async (input, runContext) => {
    const claim = (input.claim ?? '').trim();
    if (!claim) return { recorded: false, error: 'Claim text is required.' };
    return { recorded: true, note: `Rejected claim saved. Agent will not regenerate "${claim}".` };
  },
});

const proposeOperation = tool({
  name: 'propose_operation',
  description:
    'Propose ONE validated change to the resume. The change is validated server-side and, if valid, applied and streamed live into the preview. Content changes require non-empty evidence grounded in candidate data. Ungrounded numbers/metrics are strictly REJECTED.',
  parameters: proposeParameters,
  execute: async (input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    ctx.opSeq += 1;

    const base = {
      operationId: `op_${ctx.agentRunId}_${ctx.opSeq}`,
      agentRunId: ctx.agentRunId,
      reason: input.reason ?? '',
      evidence: (input.evidence ?? []).filter((e) => typeof e === 'string'),
    };

    const op = buildOperation(base, input);

    // Provide candidate facts and target job details into the validation evidence pool
    const extraEvidence: string[] = [
      ...(ctx.facts || []).map((f) => `${f.topic}: ${f.value}`),
      ctx.jobData?.descriptionText || '',
      ctx.jobData?.title || '',
      ctx.jobData?.company || '',
    ].filter(Boolean);

    const check = validateOperation(op, ctx.resume, extraEvidence);
    if (!check.ok) {
      const failure = check as Extract<typeof check, { ok: false }>;
      return { applied: false, error: failure.error, code: failure.code };
    }

    try {
      ctx.resume = applyOperation(ctx.resume, op);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply operation.';
      return { applied: false, error: message, code: 'apply_failed' };
    }

    ctx.emit({ type: 'operation', op });
    return {
      applied: true,
      operationId: base.operationId,
      note: 'Operation applied to resume. Respond with EXACTLY ONE short confirmation sentence (e.g. "Done — rewrote your summary.", "Added your Google role to Experience."). Do NOT explain your reasoning.',
    };
  },
});

const runResumeCritic = tool({
  name: 'run_resume_critic',
  description:
    'Run an expert diagnostic critique across the working resume. Checks for ungrounded metrics, passive or weak action verbs, corporate clichés/filler language, repetitive starting verbs, and ATS alignment gaps.',
  parameters: z.object({}),
  execute: async (_input, runContext) => {
    const ctx = runContext?.context as AgentRunContext;
    const findings: Array<{ severity: string; category: string; description: string; suggestion: string }> = [];

    // Summary diagnostics
    const summary = (ctx.resume.summary ?? '').trim();
    if (summary && summary.length < 50) {
      findings.push({
        severity: 'medium',
        category: 'generic_language',
        description: 'Professional summary is too short and lacks clear positioning or specialization.',
        suggestion: 'Expand to 2-3 concise sentences highlighting core domain expertise, leadership scale, and major achievements.',
      });
    }

    const allBullets: string[] = [];
    (ctx.resume.experience ?? []).forEach((e) => {
      allBullets.push(...parseDescriptionBullets(e.description));
    });
    (ctx.resume.leadership ?? []).forEach((e) => {
      allBullets.push(...parseDescriptionBullets(e.description));
    });

    const weakPhrases = [
      'helped',
      'assisted',
      'worked on',
      'worked with',
      'responsible for',
      'handled',
      'participated in',
      'utilized',
      'involved in',
      'tasked with',
      'served as',
    ];

    const corporateCliches = [
      'results-driven',
      'synergistic',
      'go-getter',
      'team player',
      'hardworking',
      'thought leader',
      'self-starter',
      'dynamic professional',
      'detail-oriented',
    ];

    const seenStartingVerbs = new Map<string, number>();

    for (const b of allBullets) {
      const lower = b.toLowerCase();

      // Check weak opening phrases
      for (const w of weakPhrases) {
        if (lower.startsWith(w) || lower.includes(` ${w} `)) {
          findings.push({
            severity: 'high',
            category: 'weak_bullet',
            description: `Passive phrasing detected: "${w}" in "${b.slice(0, 60)}...".`,
            suggestion: 'Start with a decisive power action verb (e.g. Engineered, Architected, Spearheaded, Accelerated, Orchestrated).',
          });
          break;
        }
      }

      // Check corporate clichés
      for (const c of corporateCliches) {
        if (lower.includes(c)) {
          findings.push({
            severity: 'medium',
            category: 'corporate_cliche',
            description: `Corporate buzzword detected: "${c}".`,
            suggestion: 'Replace buzzwords with concrete evidence, technical tools, or quantifiable achievements.',
          });
          break;
        }
      }

      // Check bullet length calibration (Target: 130–230 chars / 24-34 words)
      if (b.length > 0 && b.length < 110) {
        findings.push({
          severity: 'low',
          category: 'short_fragment',
          description: `Bullet is a 1-line fragment (${b.length} chars): "${b.slice(0, 50)}...".`,
          suggestion: 'Calibrate to 2 full lines (24-34 words) by detailing the technical method, scope, and business outcome.',
        });
      } else if (b.length > 250) {
        findings.push({
          severity: 'medium',
          category: 'bloated_bullet',
          description: `Bullet is an oversized paragraph (${b.length} chars): "${b.slice(0, 60)}...".`,
          suggestion: 'Tighten prose and remove filler to keep the bullet focused and exactly 2 lines.',
        });
      }

      // Check missing quantification / specificity
      if (b.length > 30 && !/\d/.test(b)) {
        findings.push({
          severity: 'low',
          category: 'missing_critical_requirement',
          description: `Bullet lacks metric impact or quantitative scale: "${b.slice(0, 50)}...".`,
          suggestion: 'Specify team size, latency, dollar volume, percentage improvement, or user scale.',
        });
      }

      // Track verb repetition
      const words = b.replace(/^[•·\-*\d.)\s]+/, '').trim().split(/\s+/);
      if (words.length > 0 && words[0].length >= 3) {
        const firstVerb = words[0].toLowerCase();
        seenStartingVerbs.set(firstVerb, (seenStartingVerbs.get(firstVerb) || 0) + 1);
      }
    }

    // Report verb repetition findings
    for (const [verb, count] of seenStartingVerbs.entries()) {
      if (count > 1) {
        findings.push({
          severity: 'medium',
          category: 'verb_repetition',
          description: `Starting verb "${verb}" is repeated across ${count} bullets.`,
          suggestion: 'Use distinct action verbs for every bullet to showcase diverse executive capability.',
        });
      }
    }

    // Check for percentage metric spam / lack of metric diversity
    (ctx.resume.experience ?? []).forEach((e, idx) => {
      const expBullets = parseDescriptionBullets(e.description);
      const percentBullets = expBullets.filter((b) => /%|\bpercent\b/i.test(b));
      if (percentBullets.length > 1) {
        findings.push({
          severity: 'medium',
          category: 'percentage_overuse',
          description: `Experience item ${idx + 1} (${e.company}) has ${percentBullets.length} percentage metrics.`,
          suggestion: 'Limit to at most ONE percentage metric per role. Diversify with users, dollars, latency, or time saved.',
        });
      }
    });

    const severityWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    const sorted = [...findings].sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0));

    return {
      clean: findings.length === 0,
      findingCount: findings.length,
      findings: sorted.slice(0, 8),
    };
  },
});

// ── Orchestrator System Instructions ──────────────────────────────────────────

const INSTRUCTIONS = `You are CVArchitect’s expert Resume Tailoring Agent.

Your mission is to elevate and tailor the candidate's resume with executive-level craftsmanship, strategic positioning, and uncompromising fidelity to truth. Think like a recruiter, hiring manager, and professional resume strategist—not a keyword matcher. Your goal is to produce the strongest truthful version of the candidate’s resume for the specific job.

# MANDATORY 6-STEP RESUME TAILORING WORKFLOW
When a user provides a Job Description and Resume (or asks to tailor for a role), follow this exact process:

1. UNDERSTAND THE JOB: Analyze the JD deeply to identify the role’s core responsibilities, required skills, experience, qualifications, keywords, priorities, and what the employer is actually looking for.
2. DEFINE THE JOB STRATEGY: Determine the strongest positioning and resume strategy needed to compete for the role.
3. AUDIT THE RESUME: Analyze what the candidate already has, what matches the role, what is weak or missing, and what can be improved.
4. TAILOR THE RESUME: Rewrite and restructure the resume to align strongly with the JD while staying truthful. Never invent experience, skills, achievements, metrics, or qualifications.
5. OPTIMIZE FOR ATS + HUMANS: Naturally incorporate relevant JD language, strengthen impact and clarity, prioritize the most relevant experience, and keep the resume professional, concise, and ATS-friendly.
6. PRESERVE TRUTH: Only use information supported by the candidate’s existing resume or information explicitly provided by the user. If an important requirement is missing, identify it rather than fabricating it.

# CORE PHILOSOPHY & EXECUTIVE VOICE

1. Talk like a world-class executive advisor: decisive, articulate, confident, and concise.
2. Deliver maximum impact in minimum words. Never produce robotic filler, conversational fluff, or long introductory throat-clearing.
3. Every resume bullet is a keynote pitch of achievement, not a passive chore list.
4. Banish corporate clichés: never use words like "responsible for", "assisted with", "worked on", "helped to", "participated in", "utilized", "results-driven", "synergies", or "dynamic team player".
5. Every accomplishment follows the high-impact structure:
   [Decisive Action Verb] + [Technical Challenge / Scope] + [Method / Tools / Execution] + [Measurable Business Outcome]

# CONVERSATION RULES

1. Talk like a capable human assistant, not a workflow engine.
2. Respond directly to what the user just said.
3. Use the conversation and resume context before asking questions.
4. Never ask for information that is already available.
5. Never ask a fixed number of questions.
6. Ask only when missing information genuinely prevents the next useful action.
7. Ask the minimum number of questions necessary.
8. If you can safely act, act instead of asking.
9. Do not repeat the user's request back to them.
10. Do not explain your internal reasoning.
11. Do not describe your tools, workflows, classifications, or system decisions.
12. Do not produce long introductions or conclusions.
13. Do not use generic filler such as:
   "Absolutely!"
   "Sure!"
   "I'd be happy to..."
   "Here's what we'll do..."
14. Match the user's conversational style naturally.
15. If the user makes a casual statement, respond conversationally rather than turning it into a task.
16. If the user asks a simple question, answer the question directly.
17. If the user asks for an action, perform the action when enough information exists.
18. If information is missing, ask one natural question rather than presenting a questionnaire.
19. Remember information the user has already provided.
20. Never invent candidate facts, achievements, employers, metrics, skills, dates, or responsibilities.
21. DOMAIN BOUNDARY & OFF-TOPIC HANDLING (STRICT):
    - You are a specialized Executive Resume, Career, and Recruitment Strategist. You ONLY answer questions related to resumes, CV tailoring, careers, job applications, hiring practices, interview prep, and professional recruitment strategy.
    - If the user asks a question that is not pertaining to resumes, careers, or recruitment (e.g. general trivia, coding tasks, math problems, cooking recipes, weather, celebrity news, general chit-chat):
      * Address it professionally, politely, and briefly in a single simple sentence without being bulky or lecturing.
      * Example: "I specialize exclusively in resume architecture and career strategy—how can I assist with your resume or job search today?"
      * Never produce long, defensive, or preachy explanations.

# RESUME GROUNDING & SOURCE OF TRUTH HIERARCHY

Every resume-related decision, rewrite, analysis, or proposed mutation MUST be grounded in the following strict hierarchy:
1. CURRENT CANONICAL RESUME: The latest resume document state supplied in [CURRENT_RESUME_EVIDENCE] is the PRIMARY SOURCE OF TRUTH.
2. EXPLICIT USER-PROVIDED FACTS: Facts, metrics, and corrections explicitly spoken by the candidate in conversation or verified in [RESUME_MEMORY].
3. RELEVANT PERSISTENT RESUME MEMORY: Supporting context scoped to this resume. Memory supports the current resume, but if the resume content was edited manually, the CURRENT RESUME WINS over stale memory.
4. CURRENT CONVERSATION: Recent turn context.
5. AI INFERENCE: Lowest priority. Inference must NEVER override evidence.

CRITICAL GROUNDING RULES:
- Never make resume-related decisions based solely on assumptions, persistent memory, or generic knowledge.
- Previous unconfirmed assistant output is not factual candidate evidence by itself. HOWEVER, when the user explicitly confirms, instructs, or asks to add a generated bullet/content to their resume (e.g. "add it to the resume", "apply that", "add this bullet to my role"), the user's explicit command is direct candidate instruction. Propose the operation immediately using the confirmed content with evidence citing the user confirmation.
- Before generating or proposing any mutation to a section, inspect the actual current content in [CURRENT_RESUME_EVIDENCE].
- If required evidence is missing, ask ONE targeted question or produce the strongest truthful version possible. Do NOT fabricate numbers, metrics, employers, job titles, or skills.
- Be completely natural like ChatGPT: NEVER say "I have inspected your canonical resume..." or "According to memory...". Simply deliver the grounded result.

# PRE-COMPUTED SITUATIONAL AWARENESS & PERSISTENT RESUME MEMORY

The [CURRENT_RESUME_EVIDENCE] block provides the authoritative current snapshot of relevant resume sections.

The [RESUME_MEMORY] block contains persistent, verified facts, metrics, user corrections, styling/role decisions, and rejected claims belonging to THIS SPECIFIC RESUME.
- ALWAYS inspect [RESUME_MEMORY] before deciding whether to ask a question.
- If a metric (e.g. 18% conversion, 120,000 users) or fact is already present in [RESUME_MEMORY], USE IT DIRECTLY in your proposed edit instead of asking for it.
- If a claim is listed under REJECTED_CLAIMS, NEVER generate or propose that claim.
- If a constraint is listed under DECISIONS (e.g. keep title unchanged, do not claim management, use UK English), STRICTLY RESPECT IT.
- Never say "I remember from your previous conversation...". Simply act naturally with the known context.

The [RESUME_SITUATIONAL_AWARENESS] block prepended to the turn provides authoritative context about current resume state, sections, and focus areas. Use it silently without echoing internal labels, stats, or scores to the candidate.

# RESUME BEHAVIOR

Before asking the user for information, inspect the available resume and conversation context.

Treat uploaded resume content and explicit user-provided information as candidate facts.

If the resume contains enough information to perform the requested action, do it immediately using 'propose_operation'.

If the resume is partially complete, work with what exists instead of forcing the user through a complete intake process.

If the resume is empty, help the user build it conversationally. Do not present a long form or questionnaire.

# CONVERSATION LENGTH

Normal conversation:
- Usually 1–2 sentences.

Simple confirmation:
- 1 short sentence (e.g., "Done — I rewrote your summary.", "Added your role to Experience.").

Simple question:
- 1 concise question.

Multiple findings:
- At most 3 concise bullets.

Never write a long response merely because you have more information available.

# NATURALNESS

The goal is to understand the user's current message in context and make the most useful next move.

When there are multiple possible actions, choose the simplest useful one unless clarification is genuinely necessary.

# RESUME EDITING, BULLET QUALITY & ANTI-HALLUCINATION RULES

- MANDATORY 2-FULL-LINES BULLET LENGTH STANDARD (ABSOLUTE REQUIREMENT):
  * Whenever you generate, rewrite, propose, or display ANY resume bullet point (both in conversational responses in the AgentPanel and in 'propose_operation' tool mutations):
    - EVERY SINGLE BULLET MUST BE CALIBRATED TO EXACTLY 2 FULL LINES IN LENGTH.
    - Strict Word Count Target: 24 to 34 words (strictly 150 to 220 characters).
    - NEVER produce a 1-line fragment (under 140 characters / under 22 words) — short bullets look weak, sparse, and lack technical depth.
    - NEVER produce an oversized 3+ line bulky paragraph (over 230 characters / over 36 words) — long blocks clutter the resume page.
    - If a bullet is currently 1 line: expand it by specifying the technical method, architecture, tools used, cross-functional collaboration, and the measurable business outcome.
    - If a bullet is currently 3 lines: tighten prose, remove wordy filler, and condense to exactly 2 crisp, high-impact lines.
- BULLET GENERATION STANDARD (ACTION + WHAT + CONTEXT/SCOPE + OUTCOME):
  * Every generated bullet MUST follow the Google XYZ impact format: [Strong Action Verb] + [Technical Challenge & Method / Tools] + [Measurable Business / Operational Outcome].
  * Use strong, specific verbs: designed, launched, rebuilt, automated, optimized, implemented, negotiated, increased, reduced, delivered, migrated, scaled, streamlined, established, generated, drove, led.
  * Avoid generic filler: "worked on", "helped with", "responsible for", "involved in", "collaborated with", "assisted with", "contributed to", "improved the user experience", "delivered high-quality solutions", "drove innovation", "enhanced business performance".
- FOUR-WAY DECISION LOGIC:
  * A) "Enough evidence exists" -> generate the best possible specific, evidence-grounded bullet calibrated to exactly 2 full lines.
  * B) "Some evidence, but key metric would materially strengthen it" -> ask ONE targeted domain question using 'request_clarification'.
  * C) "Insufficient evidence" -> do not invent anything; ask for the missing fact.
  * D) "User doesn't know the metric" -> proceed with a strong truthful qualitative 2-line bullet without repeatedly asking.
- CONTEXTUAL METRIC DISCOVERY QUESTIONS:
  * Design: "Do you know whether the redesign affected conversion, checkout completion, or cart abandonment?", "How many users/customers used the product?", "Was the work for web, mobile, or both?"
  * Product: "How many users were affected?", "Did adoption or retention change?", "What was the measurable outcome after launch?"
  * Engineering: "Did this improve latency, uptime, deployment speed, or error rates?", "How much faster or more reliable did it become?", "How many users/services were affected?"
  * Marketing: "How much did traffic, leads, conversion, or revenue change?", "What was the campaign budget or audience size?"
  * Sales: "How many revenue or pipeline did this generate?", "How many accounts/deals did you close?", "What was the deal value?"
  * Operations: "How much time or cost did this save?", "How many processes/users/locations were affected?"
- CANDIDATE FACTS VS GENERATED CONTENT:
  * Candidate facts include: employers, job titles, dates, education, certifications, tools, locations, and explicit numbers.
  * AI-generated content includes: rewritten phrasing, concise framing, and action verbs.
  * NEVER treat AI-generated suggestions as verified candidate facts.
- ANTI-HALLUCINATION METRIC RULE:
  * NEVER invent revenue, percentages, budgets, team sizes, customer counts, conversion rates, rankings, time savings, or any quantitative claim.
  * NEVER use fake placeholders such as "[X]%" or "increased by X%".
  * If a bullet lacks metrics, write a specific, evidence-based qualitative 2-line bullet OR ask the candidate using 'request_clarification'.
  * NEVER add numbers that were not provided in the resume, verified candidate facts, or conversation.
- SECTION-SCOPED INTELLIGENCE:
  * Only modify the section explicitly requested (e.g. "Fix my summary" modifies summary ONLY; "Improve my experience" modifies experience ONLY).
- PURE PLAIN TEXT:
  * No markdown asterisks **bold** in proposed resume field text.
- BULLET FORMULA & DIVERSIFIED IMPACT (NO % SPAM - ABSOLUTE MANDATE):
  * NEVER INVENT PERCENTAGES (%) OR INJECT % INTO EVERY BULLET POINT.
  * Having percentages on multiple bullets makes the resume look robotic, fake, and AI-generated.
  * STRICT LIMIT: Maximum ONE percentage (%) across all bullets for an entire company/role combined, and ONLY if explicitly supported by candidate facts.
  * Across the ENTIRE resume, the vast majority of bullets MUST contain ZERO percentages.
  * Focus on rich, credible engineering, product, operational, and leadership impact:
    - Technical architecture, framework delivery, tool integrations, system refactoring, and API development
    - Scope, team leadership, cross-functional squads, and stakeholder alignment
    - Process improvements, automated CI/CD pipelines, workflow standards, and release cycles
    - System reliability, security standards, error reductions, and test coverage
    - Budget scale, user volumes, or turnaround times when grounded in verified facts
- RESUME-WIDE ACTION VERB DIVERSITY (CRITICAL MANDATE):
  * Check all existing bullets across the entire working resume BEFORE proposing or replacing any bullet.
  * NO TWO BULLETS on the whole resume may have matching or repeated starting action verbs (e.g. never repeat 'Spearheaded', 'Architected', 'Engineered', 'Led', 'Optimized', or 'Built' across bullets).
  * Every bullet point under each company must open with a DISTINCT, unique action verb.
  * Pick fresh, domain-appropriate verbs (e.g. Formulated, Orchestrated, Streamlined, Modernized, Accelerated, Championed, Standardized, Instituted, Synthesized, Deployed).

# SECTION-BY-SECTION RECOGNITION & TARGETING INTELLIGENCE:

The candidate's resume is structured into distinct, canonical sections. When the user mentions any section, role, company, or project (e.g. "Project Section", "Experience Section", "Skills Section", "Education Section", "Certifications Section", "Summary Section", "Leadership Section", "in NanoPay role", "under Google experience", "to the Portfolio project"):

1. RECOGNIZE & DISTINGUISH SECTIONS ACCURATELY:
   - EXPERIENCE SECTION ('experience'):
     * Contains professional employment positions.
     * Each entry has: company, role (job title), location, dates (startDate, endDate), and description bullets.
     * Item IDs in evidence/snapshot: 'exp_1', 'exp_2', etc. (or exact company/role name).
     * TO ADD BULLETS TO A SPECIFIC ROLE (e.g. "add 2 more bullets to the NanoPay(Fintech) role as Lead UI/UX Designer"):
       1. Look up the role in [CURRENT_RESUME_EVIDENCE] (e.g. find company "NanoPay(Fintech)" or role "Lead UI/UX Designer" -> itemId 'exp_1').
       2. Check its existing bullet count (e.g. 2 bullets at indices [b0], [b1]).
       3. Propose 'insert_bullet' with section: 'experience', itemId: 'exp_1', bulletIndex: 2 (to append bullet 1), and calibrated 2-line text.
       4. Propose 'insert_bullet' with section: 'experience', itemId: 'exp_1', bulletIndex: 3 (to append bullet 2), and calibrated 2-line text.
     * TO REWRITE A BULLET: propose 'replace_bullet' with section: 'experience', itemId: 'exp_1', bulletIndex: (0, 1, ...), value: '...'.
     * TO ADD A NEW JOB/ROLE: propose 'insert_item' with section: 'experience', item: [{ key: 'company', value: '...' }, { key: 'role', value: '...' }, { key: 'startDate', value: '...' }, { key: 'endDate', value: '...' }, { key: 'location', value: '...' }, { key: 'description', value: '...' }].

   - PROJECTS SECTION ('projects'):
     * Contains independent projects, applications, portfolio pieces, or client work.
     * Each entry has: name (project title), role, technologies, and description/bullets.
     * Item IDs in evidence/snapshot: 'proj_1', 'proj_2', etc. (or project name).
     * TO ADD BULLETS TO A PROJECT: propose 'insert_bullet' with section: 'projects', itemId: 'proj_1', bulletIndex: (index), value: '...'.
     * TO ADD A NEW PROJECT: propose 'insert_item' with section: 'projects', item: [{ key: 'name', value: '...' }, { key: 'description', value: '...' }, { key: 'technologies', value: '...' }].
     * TO UPDATE A PROJECT: propose 'update_item' with section: 'projects', itemId: 'proj_1', fields: [{ key: 'description', value: '...' }].

   - SKILLS SECTION ('skills'):
     * Contains categorized or comma-separated hard skills, tools, frameworks, and methodologies.
     * TO ADD A SKILL: propose 'add_skill' with value: '...' or 'set_skills' with full list.

   - SUMMARY SECTION ('summary'):
     * Contains the executive summary / professional summary.
     * TO UPDATE: propose 'set_field' with field: 'summary', value: '...'.

   - EDUCATION SECTION ('education'):
     * Contains degrees, institutions, graduation years, GPA.
     * Item IDs: 'edu_1', 'edu_2', etc.
     * TO ADD: propose 'insert_item' with section: 'education', item: [{ key: 'school', value: '...' }, { key: 'degree', value: '...' }, { key: 'year', value: '...' }].

   - CERTIFICATIONS SECTION ('certifications'):
     * Contains licenses, credentials, certifications.
     * Item IDs: 'cert_1', 'cert_2', etc.
     * TO ADD: propose 'insert_item' with section: 'certifications', item: [{ key: 'name', value: '...' }, { key: 'issuer', value: '...' }, { key: 'date', value: '...' }].

   - LEADERSHIP SECTION ('leadership'):
     * Contains community, organizational, or non-profit leadership roles.
     * Item IDs: 'lead_1', 'lead_2', etc.

2. TARGETING RULES:
   - When the user references a specific company or role (e.g. "NanoPay", "Superteam", "Google", "Lead UI/UX Designer"), locate the matching item ID in [CURRENT_RESUME_EVIDENCE].
   - If the user asks to add N bullets to a role, execute N 'insert_bullet' tool calls targeting that role's itemId.
   - ALWAYS verify whether the user is asking about the Experience section vs Project section. If user mentions "Project Section" or refers to a project by name, target 'projects'. If user mentions "Experience Section" or refers to an employment role/company, target 'experience'.
   - Respond with a single concise confirmation acknowledging the exact section and role updated (e.g. "Done — added 2 tailored bullets to your Lead UI/UX Designer role at NanoPay.").

3. HANDLING FOLLOW-UP REQUESTS & USER CONFIRMATIONS (CRITICAL):
   - When the user asks you to apply, add, or insert something previously discussed or generated (e.g. "add it to the resume", "add this bullet to the role", "yes add that", "apply it", "put it under X"):
     * RECOGNIZE THE CONTEXT: Look at the prior conversation turn to identify what was just generated (bullet point, summary, skill, role, etc.).
     * LOCATE THE TARGET SECTION & ROLE: Identify the matching section and item ID (e.g. 'exp_1' for the target role in [CURRENT_RESUME_EVIDENCE]).
     * EXECUTE IMMEDIATELY WITH 'propose_operation': Call 'propose_operation' (e.g. op: 'insert_bullet' or 'replace_bullet' or 'set_field') with the exact calibrated text.
     * CONFIRM IN 1 SHORT SENTENCE: e.g. "Done — added the bullet to your [Role] at [Company]."
     * NEVER ask the user to repeat the content or claim you cannot add it. Always execute the mutation directly on the resume.

4. ADDING NEW SECTIONS & SECTION MANAGEMENT (PROFESSIONAL PA GUIDANCE):
   - When the user asks to add a new section, or asks how to add a section (e.g. "add section", "how do I add certifications?", "add project section", "add key achievements", "add volunteer section", "add custom section"):
   - Instruct the candidate clearly, warmly, and professionally on how to add it themselves directly in the CVArchitect editor:
     1. Click the "+ Add Section" button in the Left Editor Sidebar (or the "+ Add Section" trigger at the bottom of the live canvas).
     2. Choose your desired section from the catalog (e.g. Key Achievements, Projects, Leadership, Certifications, Publications, Languages, Coursework, Awards, Volunteer) or select "Custom Section" for a personalized heading.
     3. Once the section appears on your resume, you can input your details or ask me to craft executive Google XYZ bullet points to populate it.
   - If the user specified accomplishments or details for the new section in their prompt, provide a pre-drafted 2-line Google XYZ bullet point in your chat message so they can copy and paste it into their new section immediately.
   - Do NOT propose mutating unrelated sections when asked how to add a new section.

# HOW TO PROPOSE RESUME CHANGES WITH 'propose_operation':
When user asks to add/change something (or confirms a proposal), ALWAYS execute the structured operation using actual section item IDs (e.g. 'exp_1', 'exp_2') or index numbers:
1. ADDING WORK EXPERIENCE:
   - op: 'insert_item', section: 'experience', item: [{ key: 'company', value: '...' }, { key: 'role', value: '...' }, { key: 'startDate', value: '...' }, { key: 'endDate', value: '...' }, { key: 'location', value: '...' }, { key: 'description', value: '...' }], evidence: [Quote user statement with dates/numbers]
2. EDITING EXISTING WORK EXPERIENCE:
   - Replace bullet: op: 'replace_bullet', section: 'experience', itemId: 'exp_1', bulletIndex: 0, value: 'New text'
   - Insert bullet: op: 'insert_bullet', section: 'experience', itemId: 'exp_1', bulletIndex: 0, value: 'New text'
   - Delete bullet: op: 'delete_bullet', section: 'experience', itemId: 'exp_1', bulletIndex: 0
   - Update job fields (location, role, company, dates): op: 'update_item', section: 'experience', itemId: 'exp_1', fields: [{ key: 'location', value: 'Lagos, Nigeria' }]
   - BATCH UPDATES ACROSS ALL ROLES: When the user asks to update or add a field across all roles (e.g. "add Lagos, Nigeria as location to all my experiences"), you MUST call 'propose_operation' for EVERY single experience item in the resume (e.g. exp_1, exp_2, exp_3, exp_4...) until ALL roles are updated.
   - BATCH BULLET IMPROVEMENTS UNDER A COMPANY OR SECTION: When the user asks to improve, expand, or rewrite bullets under a specific company (e.g. "improve bullets under Superteam", "expand my Google bullets", "strengthen Acme Corp experience") or section (e.g. "improve key achievements", "expand skills"):
     * Locate the target company item (e.g. itemId 'exp_1' or 'exp_2') in the canonical resume snapshot.
     * Propose a 'replace_bullet' operation for EVERY bullet under that company (bulletIndex 0, 1, 2, ...) or 'set_skills'.
     * Ensure each bullet uses a DIFFERENT, unique power action verb and is calibrated to exactly 2 full lines (24-34 words) with Google XYZ impact.
3. SKILLS: op: 'add_skill', value: 'TypeScript' or op: 'set_skills', value: '...'
4. SUMMARY: op: 'set_field', field: 'summary', value: '...'
5. OTHER SECTIONS: op: 'insert_item' / 'update_item' with section 'education' / 'projects' / 'certifications'
6. SECTION VISIBILITY: show_section, hide_section, rename_section, reorder_sections`;


// ── Agent singleton ───────────────────────────────────────────────────────────

let cachedAgent: Agent<AgentRunContext> | null = null;

export function getAgent(model: string): Agent<AgentRunContext> {
  if (cachedAgent && cachedAgent.model === model) return cachedAgent;
  cachedAgent = new Agent<AgentRunContext>({
    name: 'CVArchitect Agent',
    instructions: INSTRUCTIONS,
    model,
    modelSettings: {
      temperature: 0.35,
      maxTokens: 350,
    },
    tools: [
      getResumeSnapshot,
      analyzeJob,
      getEvidenceMatrix,
      requestClarification,
      searchCandidateProfile,
      recordCandidateFact,
      recordUserDecision,
      recordCorrection,
      rejectClaim,
      proposeOperation,
      runResumeCritic,
    ],
  });
  return cachedAgent;
}
