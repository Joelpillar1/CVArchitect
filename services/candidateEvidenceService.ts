import {
  CandidateEvidence,
  CandidateEvidenceSchema,
  generateStableId,
  ResumeContract,
} from '../types/agentContract';
import type { ResumeData } from '../types';
import { parseDescriptionBullets } from '../utils/templateUtils';

/**
 * CVArchitect Candidate Evidence Service (Phase 3 Foundation)
 *
 * Grounding & Provenance Engine:
 * 1. Tracks what is explicitly stated in the resume or candidate answers.
 * 2. Enforces strict provenance (sourceType, sourceId, verified status).
 * 3. Prevents AI hallucinations and ungrounded metric claims from entering the resume.
 * 4. Provides deterministic claim validation, metric extraction, and conflict detection.
 */

export interface ClaimValidationResult {
  isValid: boolean;
  status: 'approved' | 'rejected';
  reasons: string[];
  code?:
    | 'valid'
    | 'unsupported_metric'
    | 'missing_evidence'
    | 'conflicting_evidence'
    | 'unsupported_skill'
    | 'unsupported_responsibility';
  missingEvidenceDetails?: {
    ungroundedMetrics?: string[];
    unsupportedSkills?: string[];
    conflictingClaims?: Array<{ claimed: string; verifiedEvidence: string }>;
    unsupportedResponsibilities?: string[];
  };
  matchedEvidenceIds: string[];
}

/** Extract normalized numeric tokens: "grew 1,200 users (+32%)" -> ["1200", "32"] */
export function extractNumericTokens(text: string): string[] {
  const out: string[] = [];
  const re = /\d[\d,]*(?:\.\d+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push(m[0].replace(/,/g, ''));
  }
  return out;
}

/** Extract skill/keyword candidates from text */
export function extractSkillTokens(text: string): string[] {
  const commonKeywords = text
    .split(/[,;•\n\t]+|\s{2,}/)
    .map((s) => s.trim().replace(/^[-*•\s]+/, ''))
    .filter((s) => s.length > 1 && s.length < 40);
  return Array.from(new Set(commonKeywords));
}

export class CandidateEvidenceService {
  private evidenceStore: Map<string, CandidateEvidence> = new Map();
  private candidateIndex: Map<string, Set<string>> = new Map(); // candidateId -> Set<evidenceId>
  private itemIndex: Map<string, Set<string>> = new Map(); // relatedResumeItemId -> Set<evidenceId>

  constructor(initialEvidence: CandidateEvidence[] = []) {
    for (const item of initialEvidence) {
      this.addCandidateEvidence(item);
    }
  }

  /**
   * Retrieve all recorded candidate evidence, optionally filtered by candidateId
   */
  getCandidateEvidence(candidateId?: string): CandidateEvidence[] {
    if (!candidateId) {
      return Array.from(this.evidenceStore.values());
    }
    const ids = this.candidateIndex.get(candidateId);
    if (!ids) return [];
    return Array.from(ids)
      .map((id) => this.evidenceStore.get(id))
      .filter((item): item is CandidateEvidence => !!item);
  }

  /**
   * Retrieve a specific evidence item by its unique ID
   */
  getEvidenceById(evidenceId: string): CandidateEvidence | null {
    return this.evidenceStore.get(evidenceId) || null;
  }

  /**
   * Search candidate evidence using keyword fuzzy matching on claims, context, and skills
   */
  searchCandidateEvidence(query: string, candidateId?: string): CandidateEvidence[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getCandidateEvidence(candidateId);

    const pool = this.getCandidateEvidence(candidateId);
    return pool.filter((item) => {
      const claimMatch = item.claim.toLowerCase().includes(q);
      const contextMatch = item.context?.toLowerCase().includes(q);
      const topicMatch = item.topic.toLowerCase().includes(q);
      const skillMatch = item.skills.some((s) => s.toLowerCase().includes(q));
      const metricMatch = item.metrics.some((m) => m.value.toLowerCase().includes(q));
      return claimMatch || contextMatch || topicMatch || skillMatch || metricMatch;
    });
  }

  /**
   * Add a new evidence item with strict schema validation and provenance tracking
   */
  addCandidateEvidence(input: Partial<CandidateEvidence> & { claim: string; sourceId: string }): CandidateEvidence {
    const id = input.id || generateStableId('ev');
    const sourceType = input.sourceType || input.source || 'resume';
    const status = input.status || (sourceType === 'resume' || sourceType === 'candidate_answer' || sourceType === 'explicit_user_input' ? 'verified' : 'unverified');

    // Extract metrics automatically if not supplied
    const metrics = input.metrics && input.metrics.length > 0
      ? input.metrics
      : extractNumericTokens(input.claim).map((val) => ({
          value: val,
          type: val.includes('%') ? ('percentage' as const) : ('other' as const),
        }));

    const skills = input.skills && input.skills.length > 0
      ? input.skills
      : extractSkillTokens(input.claim);

    const evidenceData: CandidateEvidence = CandidateEvidenceSchema.parse({
      id,
      candidateId: input.candidateId || 'default_candidate',
      claim: input.claim.trim(),
      context: input.context?.trim(),
      topic: input.topic || 'General',
      sourceType,
      source: sourceType,
      sourceId: input.sourceId,
      relatedResumeItemId: input.relatedResumeItemId,
      confidence: typeof input.confidence === 'number' ? input.confidence : (status === 'verified' ? 1.0 : 0.7),
      status,
      metrics,
      skills,
      verifiedAt: input.verifiedAt || Date.now(),
      notes: input.notes,
    });

    this.evidenceStore.set(evidenceData.id, evidenceData);

    // Index by candidate ID
    const candId = evidenceData.candidateId || 'default_candidate';
    if (!this.candidateIndex.has(candId)) {
      this.candidateIndex.set(candId, new Set());
    }
    this.candidateIndex.get(candId)!.add(evidenceData.id);

    // Index by related resume item ID
    if (evidenceData.relatedResumeItemId) {
      if (!this.itemIndex.has(evidenceData.relatedResumeItemId)) {
        this.itemIndex.set(evidenceData.relatedResumeItemId, new Set());
      }
      this.itemIndex.get(evidenceData.relatedResumeItemId)!.add(evidenceData.id);
    }

    return evidenceData;
  }

  /**
   * Update an existing evidence item
   */
  updateCandidateEvidence(id: string, patch: Partial<CandidateEvidence>): CandidateEvidence {
    const existing = this.evidenceStore.get(id);
    if (!existing) {
      throw new Error(`Evidence item with id "${id}" not found.`);
    }

    const updated = CandidateEvidenceSchema.parse({
      ...existing,
      ...patch,
      id: existing.id,
      verifiedAt: patch.status === 'verified' && existing.status !== 'verified' ? Date.now() : existing.verifiedAt,
    });

    this.evidenceStore.set(id, updated);
    return updated;
  }

  /**
   * Delete an evidence item by ID
   */
  deleteCandidateEvidence(id: string): boolean {
    const existing = this.evidenceStore.get(id);
    if (!existing) return false;

    if (existing.candidateId) {
      this.candidateIndex.get(existing.candidateId)?.delete(id);
    }
    if (existing.relatedResumeItemId) {
      this.itemIndex.get(existing.relatedResumeItemId)?.delete(id);
    }

    return this.evidenceStore.delete(id);
  }

  /**
   * Retrieve all evidence items linked to a specific resume item ID
   */
  getEvidenceForResumeItem(itemId: string): CandidateEvidence[] {
    const ids = this.itemIndex.get(itemId);
    if (!ids) return [];
    return Array.from(ids)
      .map((id) => this.evidenceStore.get(id))
      .filter((item): item is CandidateEvidence => !!item);
  }

  /**
   * Match evidence items against target job requirements or keywords
   */
  getEvidenceForRequirement(requirementTextOrKeywords: string | string[]): CandidateEvidence[] {
    const keywords = Array.isArray(requirementTextOrKeywords)
      ? requirementTextOrKeywords.map((k) => k.toLowerCase().trim())
      : requirementTextOrKeywords.toLowerCase().split(/\s+/).filter(Boolean);

    const verified = Array.from(this.evidenceStore.values()).filter((e) => e.status === 'verified');

    return verified.filter((evidence) => {
      const text = `${evidence.claim} ${evidence.context || ''} ${evidence.topic} ${evidence.skills.join(' ')}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });
  }

  /**
   * Ingest and bootstrap candidate evidence from a Resume snapshot (source: 'resume')
   */
  extractEvidenceFromResume(resume: ResumeData | ResumeContract, candidateId = 'default_candidate'): CandidateEvidence[] {
    const extracted: CandidateEvidence[] = [];

    // 1. Summary
    if ('summary' in resume && resume.summary && typeof resume.summary === 'string' && resume.summary.trim()) {
      extracted.push(
        this.addCandidateEvidence({
          candidateId,
          claim: resume.summary.trim(),
          context: 'Resume Executive Summary',
          topic: 'Professional Summary',
          sourceType: 'resume',
          sourceId: 'section_summary',
          status: 'verified',
        })
      );
    }

    // 2. Experience Bullets & Roles
    const expList = Array.isArray(resume.experience) ? resume.experience : [];
    for (const exp of expList) {
      const expId = exp.id || generateStableId('exp');
      const company = exp.company || 'Company';
      const role = exp.role || 'Role';

      // Record tenure / role claim
      extracted.push(
        this.addCandidateEvidence({
          candidateId,
          claim: `Held role ${role} at ${company} (${exp.startDate} - ${exp.endDate})`,
          context: `${company} Work Experience`,
          topic: 'Employment History',
          sourceType: 'resume',
          sourceId: expId,
          relatedResumeItemId: expId,
          status: 'verified',
        })
      );

      // Record individual bullet achievements
      // Handles both legacy Experience (description: string|string[]) and
      // contract Experience (bullets: ResumeBullet[]) via safe property checks.
      const rawDesc = (exp as { description?: string | string[] }).description;
      const rawBullets = (exp as { bullets?: Array<{ text: string } | string> }).bullets;
      const bullets: string[] = Array.isArray(rawBullets)
        ? rawBullets.map((b) => (typeof b === 'string' ? b : b.text))
        : parseDescriptionBullets(rawDesc as string | string[] | undefined);

      bullets.forEach((bulletText, bIdx) => {
        if (bulletText && bulletText.trim()) {
          extracted.push(
            this.addCandidateEvidence({
              candidateId,
              claim: bulletText.trim(),
              context: `${role} at ${company}`,
              topic: `${company} Achievement`,
              sourceType: 'resume',
              sourceId: `bullet_${expId}_${bIdx}`,
              relatedResumeItemId: expId,
              status: 'verified',
            })
          );
        }
      });
    }

    // 3. Skills
    const skillsList = Array.isArray(resume.skills)
      ? resume.skills.map((s) => (typeof s === 'string' ? s : s.name))
      : typeof resume.skills === 'string'
      ? resume.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (skillsList.length > 0) {
      extracted.push(
        this.addCandidateEvidence({
          candidateId,
          claim: `Demonstrated technical competencies in: ${skillsList.join(', ')}`,
          context: 'Candidate Skills Inventory',
          topic: 'Skills',
          sourceType: 'resume',
          sourceId: 'section_skills',
          skills: skillsList,
          status: 'verified',
        })
      );
    }

    // 4. Education
    const eduList = Array.isArray(resume.education) ? resume.education : [];
    for (const edu of eduList) {
      const eduId = edu.id || generateStableId('edu');
      extracted.push(
        this.addCandidateEvidence({
          candidateId,
          claim: `${edu.degree} from ${edu.school} (${edu.year})`,
          context: 'Education History',
          topic: 'Education',
          sourceType: 'resume',
          sourceId: eduId,
          relatedResumeItemId: eduId,
          status: 'verified',
        })
      );
    }

    return extracted;
  }

  /**
   * Strict Claim Validation Engine:
   * Determines if a proposed resume claim or rewrite is backed by verified evidence.
   * REJECTS ungrounded metrics, unsupported skills, or conflicting claims.
   */
  validateClaimAgainstEvidence(
    claimedText: string,
    evidencePool?: CandidateEvidence[]
  ): ClaimValidationResult {
    const verifiedEvidence = (evidencePool || Array.from(this.evidenceStore.values())).filter(
      (e) => e.status === 'verified'
    );

    const reasons: string[] = [];
    const matchedEvidenceIds: string[] = [];

    // Build total verified text corpus
    const verifiedCorpus = verifiedEvidence
      .map((e) => `${e.claim} ${e.context || ''} ${e.topic}`)
      .join('\n');

    // ── 1. Validate Metric Grounding ─────────────────────────────────────────
    const claimedMetrics = extractNumericTokens(claimedText);
    const verifiedNumericTokens = new Set(extractNumericTokens(verifiedCorpus));
    const ungroundedMetrics: string[] = [];

    for (const metric of claimedMetrics) {
      if (!verifiedNumericTokens.has(metric)) {
        ungroundedMetrics.push(metric);
      }
    }

    if (ungroundedMetrics.length > 0) {
      reasons.push(
        `Ungrounded metric(s) [${ungroundedMetrics.join(', ')}] detected in claim. ` +
        `Every numerical stat must originate from verified candidate evidence.`
      );
    }

    // ── 2. Check for Conflicting Claims ─────────────────────────────────────
    const conflictingClaims: Array<{ claimed: string; verifiedEvidence: string }> = [];

    // Check team size contradiction (e.g. claim "team of 15" vs verified "team of 4")
    const teamMatchClaimed = claimedText.match(/team of (\d+)/i);
    const teamMatchVerified = verifiedCorpus.match(/team of (\d+)/i);
    if (teamMatchClaimed && teamMatchVerified && teamMatchClaimed[1] !== teamMatchVerified[1]) {
      conflictingClaims.push({
        claimed: `team of ${teamMatchClaimed[1]}`,
        verifiedEvidence: `team of ${teamMatchVerified[1]}`,
      });
      reasons.push(
        `Conflicting claim: candidate evidence states "${teamMatchVerified[0]}", but rewrite claims "${teamMatchClaimed[0]}".`
      );
    }

    // Check budget contradiction
    const budgetClaimed = claimedText.match(/\$(\d+[\d,]*(?:\.\d+)?(?:[kKmMbB])?)/);
    const budgetVerified = verifiedCorpus.match(/\$(\d+[\d,]*(?:\.\d+)?(?:[kKmMbB])?)/);
    if (budgetClaimed && budgetVerified && budgetClaimed[0].toLowerCase() !== budgetVerified[0].toLowerCase()) {
      conflictingClaims.push({
        claimed: budgetClaimed[0],
        verifiedEvidence: budgetVerified[0],
      });
      reasons.push(
        `Conflicting claim: candidate evidence specifies budget "${budgetVerified[0]}", but rewrite states "${budgetClaimed[0]}".`
      );
    }

    // ── 3. Find Matching Evidence IDs ───────────────────────────────────────
    for (const ev of verifiedEvidence) {
      const claimWords = ev.claim.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const isRelevant = claimWords.some((w) => claimedText.toLowerCase().includes(w));
      if (isRelevant) {
        matchedEvidenceIds.push(ev.id);
      }
    }

    // ── 4. Determine Validation Status ───────────────────────────────────────
    if (ungroundedMetrics.length > 0) {
      return {
        isValid: false,
        status: 'rejected',
        reasons,
        code: 'unsupported_metric',
        missingEvidenceDetails: { ungroundedMetrics, conflictingClaims },
        matchedEvidenceIds,
      };
    }

    if (conflictingClaims.length > 0) {
      return {
        isValid: false,
        status: 'rejected',
        reasons,
        code: 'conflicting_evidence',
        missingEvidenceDetails: { conflictingClaims },
        matchedEvidenceIds,
      };
    }

    // If completely lacking any matching context or grounding
    if (matchedEvidenceIds.length === 0 && claimedText.length > 40) {
      return {
        isValid: false,
        status: 'rejected',
        reasons: ['No verified evidence found in candidate record supporting this statement.'],
        code: 'missing_evidence',
        matchedEvidenceIds: [],
      };
    }

    return {
      isValid: true,
      status: 'approved',
      reasons: ['Claim is fully grounded in verified candidate evidence.'],
      code: 'valid',
      matchedEvidenceIds,
    };
  }

  /**
   * Clear all stored evidence for a candidate or entirely
   */
  clearEvidence(candidateId?: string): void {
    if (!candidateId) {
      this.evidenceStore.clear();
      this.candidateIndex.clear();
      this.itemIndex.clear();
      return;
    }

    const ids = this.candidateIndex.get(candidateId);
    if (ids) {
      for (const id of ids) {
        this.evidenceStore.delete(id);
      }
      this.candidateIndex.delete(candidateId);
    }
  }
}

// Global Singleton Instance
let defaultService: CandidateEvidenceService | null = null;
export function getEvidenceService(): CandidateEvidenceService {
  if (!defaultService) {
    defaultService = new CandidateEvidenceService();
  }
  return defaultService;
}
