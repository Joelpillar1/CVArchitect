import { ResumeData } from '../types';
import { JobDescriptionData } from '../types/resumeAgent';
import {
  ResumeAgentMemory,
  CandidateFactMemoryItem,
  MetricMemoryItem,
  CorrectionMemoryItem,
  DecisionMemoryItem,
  RejectedSuggestionMemoryItem,
  JobContextMemoryItem,
  normalizeTopicKey,
} from './resumeAgentMemory';

export interface MemoryRetrievalQuery {
  message: string;
  resume: ResumeData;
  jobData?: JobDescriptionData | null;
  targetSection?: string;
}

export interface RelevantMemorySlice {
  resumeId: string;
  facts: CandidateFactMemoryItem[];
  metrics: MetricMemoryItem[];
  corrections: CorrectionMemoryItem[];
  decisions: DecisionMemoryItem[];
  rejectedSuggestions: RejectedSuggestionMemoryItem[];
  jobContext?: JobContextMemoryItem | null;
  conversationSummary: string;
}

function extractKeywords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['the', 'and', 'for', 'with', 'that', 'this', 'have', 'from', 'you', 'your'].includes(w));
  return new Set(words);
}

function computeOverlap(text: string, keywords: Set<string>): number {
  if (!text || keywords.size === 0) return 0;
  const targetWords = extractKeywords(text);
  let overlap = 0;
  for (const word of targetWords) {
    if (keywords.has(word)) overlap += 1;
  }
  return overlap;
}

/**
 * Retrieves the relevant memory slice for a given user request and context.
 * Filters out irrelevant items while always preserving high-priority decisions,
 * corrections, and active metrics.
 */
export function retrieveRelevantMemory(
  memory: ResumeAgentMemory,
  query: MemoryRetrievalQuery
): RelevantMemorySlice {
  if (!memory) {
    return {
      resumeId: 'unknown',
      facts: [],
      metrics: [],
      corrections: [],
      decisions: [],
      rejectedSuggestions: [],
      conversationSummary: '',
    };
  }

  const queryKeywords = extractKeywords(`${query.message} ${query.targetSection || ''} ${query.jobData?.title || ''}`);

  // 1. Facts filtering: score by relevance + include recent explicit facts
  const rankedFacts = [...(memory.candidateFacts || [])].map((fact) => {
    const text = `${fact.topic} ${fact.value} ${fact.context || ''}`;
    const score = computeOverlap(text, queryKeywords);
    return { fact, score };
  });

  // Keep facts with overlap or top explicit facts (up to 8 facts max to keep prompt compact)
  const relevantFacts = rankedFacts
    .filter((item) => item.score > 0 || item.fact.provenance === 'user_explicit')
    .sort((a, b) => b.score - a.score || b.fact.updatedAt - a.fact.updatedAt)
    .slice(0, 8)
    .map((item) => item.fact);

  // 2. Metrics filtering: prioritize metrics relevant to current query or recent
  const rankedMetrics = [...(memory.metrics || [])].map((metric) => {
    const text = `${metric.key} ${metric.value} ${metric.context}`;
    const score = computeOverlap(text, queryKeywords);
    return { metric, score };
  });

  const relevantMetrics = rankedMetrics
    .sort((a, b) => b.score - a.score || b.metric.updatedAt - a.metric.updatedAt)
    .slice(0, 6)
    .map((item) => item.metric);

  // 3. Decisions: Always keep active user decisions (capped at 5 to keep compact)
  const relevantDecisions = [...(memory.decisions || [])]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  // 4. Corrections: Always keep recent user corrections (capped at 5)
  const relevantCorrections = [...(memory.corrections || [])]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  // 5. Rejected Suggestions: Keep recent rejections so agent doesn't regenerate (capped at 5)
  const relevantRejected = [...(memory.rejectedSuggestions || [])]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  // 6. Job Context: find matching or latest job context
  let relevantJob: JobContextMemoryItem | null = null;
  if (memory.jobContexts && memory.jobContexts.length > 0) {
    if (query.jobData?.title) {
      const targetTitle = normalizeTopicKey(query.jobData.title);
      relevantJob =
        memory.jobContexts.find((j) => normalizeTopicKey(j.title || '') === targetTitle) ||
        memory.jobContexts[memory.jobContexts.length - 1];
    } else {
      relevantJob = memory.jobContexts[memory.jobContexts.length - 1];
    }
  }

  return {
    resumeId: memory.resumeId,
    facts: relevantFacts,
    metrics: relevantMetrics,
    corrections: relevantCorrections,
    decisions: relevantDecisions,
    rejectedSuggestions: relevantRejected,
    jobContext: relevantJob,
    conversationSummary: memory.conversationSummary || '',
  };
}

/**
 * Formats a compact `[RESUME_MEMORY]` block for injection into the agent's prompt.
 */
export function formatResumeMemoryBlock(slice: RelevantMemorySlice): string {
  const sections: string[] = [];

  // 1. Facts & Metrics
  const factLines: string[] = [];
  for (const m of slice.metrics) {
    factLines.push(`- ${m.context} ${m.key}: ${m.value}`);
  }
  for (const f of slice.facts) {
    const key = f.topic;
    if (!slice.metrics.some((m) => `${m.context} ${m.key}`.toLowerCase() === key.toLowerCase())) {
      factLines.push(`- ${f.topic}: ${f.value}`);
    }
  }
  if (factLines.length > 0) {
    sections.push(`VERIFIED_FACTS:\n${factLines.join('\n')}`);
  }

  // 2. Corrections
  if (slice.corrections.length > 0) {
    const corrLines = slice.corrections.map((c) =>
      c.originalValue
        ? `- Candidate corrected "${c.topic}": changed from "${c.originalValue}" to "${c.correctedValue}".`
        : `- Candidate fact correction: "${c.correctedValue}".`
    );
    sections.push(`CORRECTIONS:\n${corrLines.join('\n')}`);
  }

  // 3. Decisions & Constraints
  if (slice.decisions.length > 0) {
    const decLines = slice.decisions.map((d) => `- ${d.decision}`);
    sections.push(`DECISIONS:\n${decLines.join('\n')}`);
  }

  // 4. Rejected Suggestions
  if (slice.rejectedSuggestions.length > 0) {
    const rejLines = slice.rejectedSuggestions.map((r) => `- DO NOT CLAIM: "${r.claim}" (${r.reason || 'rejected by user'}).`);
    sections.push(`REJECTED_CLAIMS:\n${rejLines.join('\n')}`);
  }

  // 5. Relevant Job Context
  if (slice.jobContext) {
    const jc = slice.jobContext;
    const jcLines: string[] = [];
    if (jc.title) jcLines.push(`- Target role: ${jc.title}${jc.company ? ` at ${jc.company}` : ''}`);
    if (jc.requiredSkills && jc.requiredSkills.length > 0) {
      jcLines.push(`- Priority skills: ${jc.requiredSkills.slice(0, 6).join(', ')}`);
    }
    if (jc.userDecisions && jc.userDecisions.length > 0) {
      jcLines.push(`- Tailoring choices: ${jc.userDecisions.slice(0, 3).join('; ')}`);
    }
    if (jcLines.length > 0) {
      sections.push(`RELEVANT_JOB_CONTEXT:\n${jcLines.join('\n')}`);
    }
  }

  // 6. Conversation Summary
  if (slice.conversationSummary && slice.conversationSummary.trim()) {
    sections.push(`CONVERSATION_SUMMARY:\n${slice.conversationSummary.trim()}`);
  }

  if (sections.length === 0) {
    return '';
  }

  return `[RESUME_MEMORY]\n\n${sections.join('\n\n')}\n\n[/RESUME_MEMORY]`;
}
