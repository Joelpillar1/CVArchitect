import { ResumeData } from '../types';
import { CandidateFact as BaseCandidateFact } from './agentTaskState';

export type FactProvenance = 'user_explicit' | 'resume_explicit' | 'profile' | 'inferred';
export type FactConfidence = 'explicit' | 'inferred';

export interface CandidateFactMemoryItem {
  id: string;
  topic: string;
  value: string;
  source: 'user' | 'resume' | 'profile' | 'inferred';
  provenance: FactProvenance;
  confidence: FactConfidence;
  context?: string;
  sourceLocation?: string;
  updatedAt: number;
}

export interface MetricMemoryItem {
  id: string;
  key: string;
  value: string;
  context: string;
  source: 'user' | 'resume' | 'profile';
  confidence: FactConfidence;
  unit?: string;
  updatedAt: number;
}

export interface CorrectionMemoryItem {
  id: string;
  topic: string;
  originalValue?: string;
  correctedValue: string;
  rationale?: string;
  supersededFactId?: string;
  updatedAt: number;
}

export interface DecisionMemoryItem {
  id: string;
  decision: string;
  category: 'role_title' | 'language_style' | 'skill_inclusion' | 'experience_scope' | 'formatting' | 'general';
  context?: string;
  updatedAt: number;
}

export interface PreferenceMemoryItem {
  id: string;
  preference: string;
  category?: string;
  updatedAt: number;
}

export interface RejectedSuggestionMemoryItem {
  id: string;
  claim: string;
  reason?: string;
  section?: string;
  updatedAt: number;
}

export interface JobContextMemoryItem {
  id: string;
  title?: string;
  company?: string | null;
  seniority?: string;
  descriptionText?: string;
  requiredSkills?: string[];
  matchedRequirements?: string[];
  missingRequirements?: string[];
  userDecisions?: string[];
  tailoringChoices?: Record<string, string>;
  updatedAt: number;
}

export interface ConversationTurnMemoryItem {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ResumeAgentMemory {
  resumeId: string;
  candidateFacts: CandidateFactMemoryItem[];
  corrections: CorrectionMemoryItem[];
  metrics: MetricMemoryItem[];
  decisions: DecisionMemoryItem[];
  preferences: PreferenceMemoryItem[];
  rejectedSuggestions: RejectedSuggestionMemoryItem[];
  jobContexts: JobContextMemoryItem[];
  conversationSummary: string;
  recentConversation: ConversationTurnMemoryItem[];
  updatedAt: number;
}

const PROVENANCE_RANK: Record<FactProvenance, number> = {
  user_explicit: 4,
  resume_explicit: 3,
  profile: 2,
  inferred: 1,
};

export const genMemoryId = (prefix = 'mem'): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/**
 * Creates a fresh empty ResumeAgentMemory container scoped to a specific resumeId.
 */
export function createEmptyResumeMemory(resumeId: string): ResumeAgentMemory {
  return {
    resumeId: resumeId || 'draft',
    candidateFacts: [],
    corrections: [],
    metrics: [],
    decisions: [],
    preferences: [],
    rejectedSuggestions: [],
    jobContexts: [],
    conversationSummary: '',
    recentConversation: [],
    updatedAt: Date.now(),
  };
}

/**
 * Normalizes strings for matching topics/keys.
 */
export function normalizeTopicKey(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[_\s-]+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

/**
 * Upserts candidate facts with strict provenance hierarchy:
 * user_explicit > resume_explicit > profile > inferred.
 * When confidence levels match, the later update wins.
 */
export function upsertMemoryFact(
  memory: ResumeAgentMemory,
  newFact: Omit<CandidateFactMemoryItem, 'id' | 'updatedAt'> & { id?: string; updatedAt?: number }
): ResumeAgentMemory {
  const normTopic = normalizeTopicKey(newFact.topic);
  const now = Date.now();
  const fullNewFact: CandidateFactMemoryItem = {
    id: newFact.id || genMemoryId('fact'),
    topic: newFact.topic.trim(),
    value: newFact.value.trim(),
    source: newFact.source,
    provenance: newFact.provenance || (newFact.source === 'user' ? 'user_explicit' : 'resume_explicit'),
    confidence: newFact.confidence || 'explicit',
    context: newFact.context,
    sourceLocation: newFact.sourceLocation,
    updatedAt: newFact.updatedAt || now,
  };

  const facts = [...memory.candidateFacts];
  const existingIdx = facts.findIndex((f) => normalizeTopicKey(f.topic) === normTopic);

  if (existingIdx >= 0) {
    const existing = facts[existingIdx];
    const existingRank = PROVENANCE_RANK[existing.provenance] || 1;
    const newRank = PROVENANCE_RANK[fullNewFact.provenance] || 1;

    // A lower ranked provenance cannot overwrite a higher ranked provenance
    if (newRank < existingRank) {
      return memory;
    }

    // If new fact supersedes existing with different value, record correction if from user
    if (existing.value.trim() !== fullNewFact.value.trim() && fullNewFact.provenance === 'user_explicit') {
      const correction: CorrectionMemoryItem = {
        id: genMemoryId('corr'),
        topic: fullNewFact.topic,
        originalValue: existing.value,
        correctedValue: fullNewFact.value,
        supersededFactId: existing.id,
        updatedAt: now,
      };
      facts[existingIdx] = fullNewFact;
      return {
        ...memory,
        candidateFacts: facts,
        corrections: [correction, ...memory.corrections.filter((c) => normalizeTopicKey(c.topic) !== normTopic)],
        updatedAt: now,
      };
    }

    facts[existingIdx] = fullNewFact;
    return {
      ...memory,
      candidateFacts: facts,
      updatedAt: now,
    };
  }

  return {
    ...memory,
    candidateFacts: [...facts, fullNewFact],
    updatedAt: now,
  };
}

/**
 * Records a quantified metric with context.
 */
export function recordMemoryMetric(
  memory: ResumeAgentMemory,
  metric: Omit<MetricMemoryItem, 'id' | 'updatedAt'> & { id?: string; updatedAt?: number }
): ResumeAgentMemory {
  const normKey = normalizeTopicKey(metric.key);
  const normContext = normalizeTopicKey(metric.context || '');
  const now = Date.now();

  const fullMetric: MetricMemoryItem = {
    id: metric.id || genMemoryId('metric'),
    key: metric.key.trim(),
    value: metric.value.trim(),
    context: metric.context ? metric.context.trim() : 'general',
    source: metric.source || 'user',
    confidence: metric.confidence || 'explicit',
    unit: metric.unit,
    updatedAt: metric.updatedAt || now,
  };

  const metrics = [...memory.metrics];
  const existingIdx = metrics.findIndex(
    (m) => normalizeTopicKey(m.key) === normKey && normalizeTopicKey(m.context || '') === normContext
  );

  if (existingIdx >= 0) {
    metrics[existingIdx] = fullMetric;
  } else {
    metrics.push(fullMetric);
  }

  // Also reflect as candidate fact for cross-referencing
  const updatedMemory = upsertMemoryFact(
    { ...memory, metrics, updatedAt: now },
    {
      topic: `${fullMetric.context} ${fullMetric.key}`.trim(),
      value: fullMetric.value,
      source: fullMetric.source,
      provenance: fullMetric.source === 'user' ? 'user_explicit' : 'resume_explicit',
      confidence: fullMetric.confidence,
      context: fullMetric.context,
    }
  );

  return updatedMemory;
}

/**
 * Records an explicit correction made by the user.
 */
export function recordMemoryCorrection(
  memory: ResumeAgentMemory,
  correction: Omit<CorrectionMemoryItem, 'id' | 'updatedAt'> & { id?: string; updatedAt?: number }
): ResumeAgentMemory {
  const now = Date.now();
  const fullCorrection: CorrectionMemoryItem = {
    id: correction.id || genMemoryId('corr'),
    topic: correction.topic.trim(),
    originalValue: correction.originalValue?.trim(),
    correctedValue: correction.correctedValue.trim(),
    rationale: correction.rationale?.trim(),
    supersededFactId: correction.supersededFactId,
    updatedAt: correction.updatedAt || now,
  };

  const corrections = [
    fullCorrection,
    ...memory.corrections.filter((c) => normalizeTopicKey(c.topic) !== normalizeTopicKey(fullCorrection.topic)),
  ];

  // Update candidate fact store to reflect the corrected fact as user_explicit
  const updatedMemory = upsertMemoryFact(
    { ...memory, corrections, updatedAt: now },
    {
      topic: fullCorrection.topic,
      value: fullCorrection.correctedValue,
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    }
  );

  return updatedMemory;
}

/**
 * Records a user decision / instruction / preference (e.g. "Keep Product Designer title unchanged", "Use UK English").
 */
export function recordMemoryDecision(
  memory: ResumeAgentMemory,
  decision: Omit<DecisionMemoryItem, 'id' | 'updatedAt'> & { id?: string; updatedAt?: number }
): ResumeAgentMemory {
  const now = Date.now();
  const fullDecision: DecisionMemoryItem = {
    id: decision.id || genMemoryId('dec'),
    decision: decision.decision.trim(),
    category: decision.category || 'general',
    context: decision.context?.trim(),
    updatedAt: decision.updatedAt || now,
  };

  const normDec = normalizeTopicKey(fullDecision.decision);
  const existing = memory.decisions.filter((d) => normalizeTopicKey(d.decision) !== normDec);

  return {
    ...memory,
    decisions: [fullDecision, ...existing],
    updatedAt: now,
  };
}

/**
 * Records a rejected suggestion / invalid claim so the agent does not regenerate it.
 */
export function recordRejectedClaim(
  memory: ResumeAgentMemory,
  rejected: Omit<RejectedSuggestionMemoryItem, 'id' | 'updatedAt'> & { id?: string; updatedAt?: number }
): ResumeAgentMemory {
  const now = Date.now();
  const fullRejected: RejectedSuggestionMemoryItem = {
    id: rejected.id || genMemoryId('rej'),
    claim: rejected.claim.trim(),
    reason: rejected.reason?.trim(),
    section: rejected.section?.trim(),
    updatedAt: rejected.updatedAt || now,
  };

  const normClaim = normalizeTopicKey(fullRejected.claim);
  const existing = memory.rejectedSuggestions.filter((r) => normalizeTopicKey(r.claim) !== normClaim);

  return {
    ...memory,
    rejectedSuggestions: [fullRejected, ...existing],
    updatedAt: now,
  };
}

/**
 * Clones a memory snapshot for a duplicated resume.
 * Ensures the new resume starts with an independent copy and will not mutate the original.
 */
export function cloneResumeMemory(sourceMemory: ResumeAgentMemory, newResumeId: string): ResumeAgentMemory {
  const deepCloned: ResumeAgentMemory = JSON.parse(JSON.stringify(sourceMemory));
  const now = Date.now();
  return {
    ...deepCloned,
    resumeId: newResumeId,
    candidateFacts: deepCloned.candidateFacts.map((f) => ({ ...f, id: genMemoryId('fact') })),
    corrections: deepCloned.corrections.map((c) => ({ ...c, id: genMemoryId('corr') })),
    metrics: deepCloned.metrics.map((m) => ({ ...m, id: genMemoryId('metric') })),
    decisions: deepCloned.decisions.map((d) => ({ ...d, id: genMemoryId('dec') })),
    preferences: deepCloned.preferences.map((p) => ({ ...p, id: genMemoryId('pref') })),
    rejectedSuggestions: deepCloned.rejectedSuggestions.map((r) => ({ ...r, id: genMemoryId('rej') })),
    jobContexts: deepCloned.jobContexts.map((j) => ({ ...j, id: genMemoryId('job') })),
    updatedAt: now,
  };
}

export interface MemoryExtractionResult {
  facts: Array<{ topic: string; value: string; provenance: FactProvenance; confidence: FactConfidence; context?: string }>;
  metrics: Array<{ key: string; value: string; context: string; unit?: string }>;
  corrections: Array<{ topic: string; originalValue?: string; correctedValue: string; rationale?: string }>;
  decisions: Array<{ decision: string; category: DecisionMemoryItem['category']; context?: string }>;
  rejectedClaims: Array<{ claim: string; reason?: string }>;
}

/**
 * Deterministic durable information extractor.
 * Extracts explicit user metrics, corrections, decisions, and rejections WITHOUT calling an expensive LLM.
 * Ignores trivial messages ("ok", "thanks", "sure", "can you rewrite this?").
 * Ignores "I don't know" / uncertainty.
 */
export function extractDurableInformation(
  userMessage: string,
  _assistantReply?: string,
  _currentResume?: ResumeData
): MemoryExtractionResult {
  const text = userMessage.trim();
  const lower = text.toLowerCase();

  const result: MemoryExtractionResult = {
    facts: [],
    metrics: [],
    corrections: [],
    decisions: [],
    rejectedClaims: [],
  };

  // 1. Filter out trivial acknowledgements / commands that carry no durable memory
  if (
    /^(ok|okay|thanks|thank you|sounds good|looks good|yes|no|yep|nope|sure|please|can you rewrite this|rewrite this|make it better|improve it)\b/i.test(
      lower
    ) &&
    text.split(/\s+/).length <= 4
  ) {
    return result;
  }

  // 2. Filter out uncertainty ("I don't know", "not sure", "don't have metrics")
  if (/\b(i don't know|not sure|i do not know|don't have (the )?metrics|no metric|cannot remember|don't recall)\b/i.test(lower)) {
    return result;
  }

  // 3. Extract Corrections ("Actually, it was X, not Y", "It was X designers, not Y", "Actually 12, not 9")
  const correctionMatch = text.match(/actually(?:,)?\s*(?:it was|there were)?\s*([^\.,]+)(?:,\s*not\s*([^\.,]+))?/i);
  if (correctionMatch) {
    const correctedPart = correctionMatch[1]?.trim();
    const originalPart = correctionMatch[2]?.trim();
    if (correctedPart && correctedPart.length > 1) {
      result.corrections.push({
        topic: 'User Correction',
        originalValue: originalPart,
        correctedValue: correctedPart,
        rationale: text,
      });

      // Extract structured fact from correction if it contains quantifiable or team info
      if (/\b(\d+)\s*(designers?|engineers?|developers?|people|members?|users?)\b/i.test(correctedPart)) {
        const match = correctedPart.match(/(\d+)\s*(designers?|engineers?|developers?|people|members?|users?)/i);
        if (match) {
          result.facts.push({
            topic: match[2].toLowerCase().includes('designer')
              ? 'team_size_designers'
              : match[2].toLowerCase().includes('user')
              ? 'user_count'
              : 'team_size',
            value: match[0],
            provenance: 'user_explicit',
            confidence: 'explicit',
          });
        }
      }
    }
  }

  // 4. Extract Explicit Team Size / Candidate Facts
  // "My team had 9 designers", "I worked at Stripe from 2022 to 2024", "I used React for 4 years"
  const teamMatch = text.match(/(?:my team had|team of|led a team of|collaborated with|managed)\s*(\d+)\s*([a-z]+)/i);
  if (teamMatch) {
    result.facts.push({
      topic: `team_size_${teamMatch[2].toLowerCase()}`,
      value: `${teamMatch[1]} ${teamMatch[2]}`,
      provenance: 'user_explicit',
      confidence: 'explicit',
    });
  }

  const expYearsMatch = text.match(/(?:i used|i have|worked with)\s*([a-z0-9\.\+\#]+)\s*for\s*(\d+)\s*(?:years|yrs)/i);
  if (expYearsMatch) {
    result.facts.push({
      topic: `${expYearsMatch[1].toLowerCase()}_experience`,
      value: `${expYearsMatch[2]} years`,
      provenance: 'user_explicit',
      confidence: 'explicit',
    });
  }

  const tenureMatch = text.match(/worked at\s*([a-z0-9\s]+)\s*from\s*(\d{4})\s*to\s*(\d{4}|present)/i);
  if (tenureMatch) {
    result.facts.push({
      topic: `${tenureMatch[1].trim().toLowerCase()}_tenure`,
      value: `${tenureMatch[2]} - ${tenureMatch[3]}`,
      provenance: 'user_explicit',
      confidence: 'explicit',
    });
  }

  // 5. Extract Explicit Quantified Metrics (conversion %, users, revenue, time savings)
  // "increased sign-ups by 22% and affected about 120,000 users"
  const percentMatch = text.match(/\b\d+(?:\.\d+)?%|\b\d+\s*percent\b/gi);
  if (percentMatch) {
    for (const p of percentMatch) {
      let context = 'general';
      if (/conversion/i.test(text)) context = 'conversion';
      else if (/sign-?up/i.test(text)) context = 'sign-ups';
      else if (/checkout/i.test(text)) context = 'checkout';
      else if (/revenue/i.test(text)) context = 'revenue';
      else if (/retention/i.test(text)) context = 'retention';
      else if (/traffic/i.test(text)) context = 'traffic';
      else if (/latency|speed|performance/i.test(text)) context = 'performance';

      result.metrics.push({
        key: `${context}_lift`,
        value: p.trim(),
        context,
        unit: '%',
      });
      result.facts.push({
        topic: `${context}_metric`,
        value: p.trim(),
        provenance: 'user_explicit',
        confidence: 'explicit',
        context,
      });
    }
  }

  const userScaleMatch = text.match(/(\d{1,3}(?:,\d{3})+|\d+(?:k|m|million|thousand)?)\s*(?:users?|customers?|visitors?|clients?|subscribers?|shoppers?)/i);
  if (userScaleMatch) {
    const rawVal = userScaleMatch[0];
    result.metrics.push({
      key: 'user_scale',
      value: rawVal,
      context: /checkout/i.test(text) ? 'checkout' : 'product_scale',
    });
    result.facts.push({
      topic: 'user_scale',
      value: rawVal,
      provenance: 'user_explicit',
      confidence: 'explicit',
    });
  }

  // 6. Extract User Decisions & Constraints
  // "Don't mention Kubernetes because I only experimented with it."
  // "Keep the Product Designer title unchanged."
  // "Use UK English."
  // "Don't exaggerate my management experience."
  // "Keep this bullet focused on revenue."
  if (/\b(?:don't|do not|never)\s*(?:mention|claim|say|include|exaggerate)\s*([^\.,]+)/i.test(text)) {
    const m = text.match(/\b(?:don't|do not|never)\s*(?:mention|claim|say|include|exaggerate)\s*([^\.,]+)/i);
    if (m) {
      result.decisions.push({
        decision: `Do not include or exaggerate: ${m[1].trim()}`,
        category: 'skill_inclusion',
      });
    }
  }

  const keepTitleMatch =
    text.match(/\bkeep\s+(?:the\s+)?([^\.,]+)\s+(?:title\s+)?unchanged\b/i) ||
    text.match(/\bkeep\s+my\s+title\s+as\s+([^\.,]+)\b/i);
  if (keepTitleMatch) {
    result.decisions.push({
      decision: `Keep title unchanged as: ${keepTitleMatch[1].trim()}`,
      category: 'role_title',
    });
  }

  if (/\buse\s+(uk|us|british|american)\s+english\b/i.test(text)) {
    const m = text.match(/\buse\s+(uk|us|british|american)\s+english\b/i);
    if (m) {
      result.decisions.push({
        decision: `Use ${m[1].toUpperCase()} English throughout resume`,
        category: 'language_style',
      });
    }
  }

  // 7. Extract Rejected Claims
  // "I didn't lead them", "I didn't manage", "I never worked on backend"
  if (/\b(i didn't|i did not|i never|was not|wasn't)\s+(lead|manage|build|own|create|supervise)\s*([^\.,]+)?/i.test(text)) {
    const m = text.match(/\b(i didn't|i did not|i never|was not|wasn't)\s+([^\.,]+)/i);
    if (m) {
      result.rejectedClaims.push({
        claim: `Candidate did not ${m[2].trim()}`,
        reason: 'User explicitly denied this role/action',
      });
    }
  }

  return result;
}

/**
 * Reconciles memory with direct edits made to the resume document.
 * If the resume document explicitly has a value that differs from stale memory,
 * the resume document value takes precedence.
 */
export function reconcileMemoryWithResume(memory: ResumeAgentMemory, resume: ResumeData): ResumeAgentMemory {
  let updated = { ...memory };

  // Check if jobTitle in resume changed
  if (resume.jobTitle && resume.jobTitle.trim()) {
    const titleFact: CandidateFactMemoryItem = {
      id: genMemoryId('fact'),
      topic: 'current_job_title',
      value: resume.jobTitle.trim(),
      source: 'resume',
      provenance: 'resume_explicit',
      confidence: 'explicit',
      updatedAt: Date.now(),
    };
    updated = upsertMemoryFact(updated, titleFact);
  }

  return updated;
}
