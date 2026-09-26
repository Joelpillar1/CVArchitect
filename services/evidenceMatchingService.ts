import {
  JobDescription,
  JobRequirement,
  CandidateEvidence,
  EvidenceMatrix,
  EvidenceMatrixSchema,
  EvidenceMatchItem,
  MatchedEvidenceSnippet,
  EvidenceStrength,
  EvidenceAction,
  generateStableId,
} from '../types/agentContract';
import { extractNumericTokens } from './candidateEvidenceService';

/**
 * CVArchitect Resume-to-JD Evidence Matching Engine (Phase 5 Foundation)
 *
 * Evaluates: "What does the job require, and what evidence does this candidate have?"
 * Multi-factor matching across semantic relevance, explicit skills, responsibilities,
 * tools, metrics, outcomes, and seniority context.
 */

interface ScoredEvidence {
  evidence: CandidateEvidence;
  score: number;
  matchedKeywords: string[];
}

/** Stopwords filtered out of keyword comparisons */
const STOPWORDS = new Set([
  'and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by',
  'of', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has',
  'experience', 'years', 'ability', 'proficient', 'knowledge', 'understanding',
  'strong', 'proven', 'demonstrated', 'working', 'skills', 'role', 'work'
]);

export class EvidenceMatchingService {
  /**
   * Evaluates relevance between a single JobRequirement and a CandidateEvidence claim
   */
  public calculateRelevance(
    requirement: JobRequirement,
    evidence: CandidateEvidence
  ): { score: number; matchedKeywords: string[] } {
    const reqText = requirement.text.toLowerCase();
    const claimText = `${evidence.claim} ${evidence.context || ''} ${evidence.topic} ${evidence.skills.join(' ')}`.toLowerCase();

    // 1. Direct explicit keyword matches
    const reqKeywords = requirement.keywords.length > 0
      ? requirement.keywords.map((k) => k.toLowerCase())
      : reqText.split(/[\s,;•/]+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));

    const matchedKeywords: string[] = [];
    let keywordHits = 0;

    for (const kw of reqKeywords) {
      if (claimText.includes(kw)) {
        keywordHits += 1;
        matchedKeywords.push(kw);
      }
    }

    const keywordRatio = reqKeywords.length > 0 ? keywordHits / reqKeywords.length : 0;

    // 2. Semantic / Concept Similarity Heuristics
    let semanticBonus = 0;

    // Design Systems & Component Libraries
    if (/design system/i.test(reqText) && /component library|figma components|ui kit|design tokens/i.test(claimText)) {
      semanticBonus += 0.35;
      matchedKeywords.push('component library (design system)');
    }

    // Cross-functional Collaboration
    if (/collaborat|cross-functional|partner/i.test(reqText) && /worked with|aligned with|stakeholder|partnered with|led team/i.test(claimText)) {
      semanticBonus += 0.3;
      matchedKeywords.push('stakeholder collaboration');
    }

    // Cloud / DevOps / Infrastructure
    if (/cloud|infrastructure|devops|aws/i.test(reqText) && /kubernetes|docker|terraform|ci\/cd|microservices/i.test(claimText)) {
      semanticBonus += 0.3;
      matchedKeywords.push('cloud infrastructure');
    }

    // A/B Testing & Experimentation
    if (/experiment|a\/b test|growth/i.test(reqText) && /conversion|hypothesis|analytics|funnel|activation/i.test(claimText)) {
      semanticBonus += 0.35;
      matchedKeywords.push('growth experimentation');
    }

    // Leadership / Management
    if (/manage|lead|mentor/i.test(reqText) && /directed|oversaw|managed|guided|mentored/i.test(claimText)) {
      semanticBonus += 0.35;
      matchedKeywords.push('leadership');
    }

    // 3. Metric / Quantitative depth bonus
    let metricBonus = 0;
    const reqNeedsMetrics = /quantif|metric|scale|high volume|tps|throughput|revenue|\$|%/i.test(reqText);
    const evidenceHasMetrics = evidence.metrics.length > 0 || extractNumericTokens(claimText).length > 0;
    if (evidenceHasMetrics) {
      metricBonus += reqNeedsMetrics ? 0.25 : 0.1;
    }

    // 4. Source confidence multiplier
    const confidence = evidence.confidence || (evidence.status === 'verified' ? 1.0 : 0.7);

    // Calculate final composite score
    const rawScore = (keywordRatio * 0.5) + semanticBonus + metricBonus;
    const finalScore = Math.min(1.0, Math.max(0.0, rawScore * confidence));

    return {
      score: finalScore,
      matchedKeywords: Array.from(new Set(matchedKeywords)),
    };
  }

  /**
   * Determine evidence strength from score and evidence properties
   */
  public determineStrength(score: number, matchedEvidence: MatchedEvidenceSnippet[]): EvidenceStrength {
    if (matchedEvidence.length === 0 || score < 0.2) {
      return 'missing';
    }
    if (score >= 0.75) {
      return 'strong';
    }
    if (score >= 0.45) {
      return 'moderate';
    }
    return 'weak';
  }

  /**
   * Determine recommended action based on strength, requirement importance, and category
   */
  public determineAction(
    requirement: JobRequirement,
    strength: EvidenceStrength,
    matchedEvidence: MatchedEvidenceSnippet[]
  ): { action: EvidenceAction; rationale: string; gapAnalysis: string } {
    switch (strength) {
      case 'strong':
        return {
          action: 'keep',
          rationale: 'Candidate already demonstrates verified, strong competency for this requirement.',
          gapAnalysis: 'No gap. Existing evidence is well-aligned and quantified.',
        };

      case 'moderate':
        return {
          action: 'emphasize',
          rationale: 'Candidate has verified adjacent or partial experience that should be highlighted more prominently in target bullets.',
          gapAnalysis: `Experience exists (${matchedEvidence[0]?.claim.slice(0, 60)}...) but could be phrased with direct job terminology.`,
        };

      case 'weak':
        return {
          action: 'rewrite',
          rationale: 'Candidate has preliminary backing for this skill/task, but the current wording lacks impact, metrics, or clarity.',
          gapAnalysis: 'Evidence is present but buried or expressed without measurable outcomes.',
        };

      case 'missing': {
        // Distinguish askable gaps from impossible/hard requirements
        const isHardDegreeOrNiche = /phd|doctorate|md|bar exam|security clearance/i.test(requirement.text);
        if (isHardDegreeOrNiche) {
          return {
            action: 'do_not_claim',
            rationale: 'Candidate lacks this mandatory credential. Never fabricate or invent missing certifications/degrees.',
            gapAnalysis: `Missing credential (${requirement.text}). Must not be claimed without verified proof.`,
          };
        }

        if (requirement.importance === 'must_have') {
          return {
            action: 'ask_question',
            rationale: 'This is a critical must-have requirement with zero current evidence. Ask the candidate for real experience before tailoring.',
            gapAnalysis: `Missing evidence for required skill/duty: "${requirement.text}". Probe candidate background with a clarifying question.`,
          };
        }

        return {
          action: 'ask_question',
          rationale: 'Candidate record has no backing for this preferred requirement. Inquire if they have relevant unlisted experience.',
          gapAnalysis: `Preferred requirement "${requirement.text}" is currently unevidenced.`,
        };
      }
    }
  }

  /**
   * Core Method: Generate the complete Evidence Matrix matching JobDescription against CandidateEvidence
   */
  public generateEvidenceMatrix(
    job: JobDescription,
    evidencePool: CandidateEvidence[],
    candidateId = 'default_candidate'
  ): EvidenceMatrix {
    const items: EvidenceMatchItem[] = [];
    const verifiedPool = evidencePool.filter((e) => e.status === 'verified');

    let strongCount = 0;
    let moderateCount = 0;
    let weakCount = 0;
    let missingCount = 0;

    let weightedScoreSum = 0;
    let totalWeightSum = 0;

    const missingCriticalGaps: string[] = [];
    const keyStrengths: string[] = [];
    const recommendedQuestions: string[] = [];

    for (const req of job.requirements) {
      // Find and score all candidate evidence items for this requirement
      const scoredList: ScoredEvidence[] = [];

      for (const ev of verifiedPool) {
        const { score, matchedKeywords } = this.calculateRelevance(req, ev);
        if (score > 0.15) {
          scoredList.push({ evidence: ev, score, matchedKeywords });
        }
      }

      // Sort by relevance descending
      scoredList.sort((a, b) => b.score - a.score);

      const bestMatch = scoredList[0];
      const bestScore = bestMatch ? bestMatch.score : 0;

      const matchedSnippets: MatchedEvidenceSnippet[] = scoredList.slice(0, 3).map((s) => ({
        evidenceId: s.evidence.id,
        claim: s.evidence.claim,
        sourceType: s.evidence.sourceType,
        sourceId: s.evidence.sourceId,
        relatedResumeItemId: s.evidence.relatedResumeItemId,
        relevanceScore: s.score,
        metrics: s.evidence.metrics,
      }));

      const strength = this.determineStrength(bestScore, matchedSnippets);
      const { action, rationale, gapAnalysis } = this.determineAction(req, strength, matchedSnippets);

      // Track counters
      if (strength === 'strong') {
        strongCount += 1;
        keyStrengths.push(req.text);
      } else if (strength === 'moderate') {
        moderateCount += 1;
      } else if (strength === 'weak') {
        weakCount += 1;
      } else if (strength === 'missing') {
        missingCount += 1;
        if (req.importance === 'must_have') {
          missingCriticalGaps.push(req.text);
        }
      }

      if (action === 'ask_question') {
        recommendedQuestions.push(`Do you have experience with: ${req.text}?`);
      }

      // Calculate weighted score contribution
      const weight = req.weight || (req.importance === 'must_have' ? 1.0 : req.importance === 'should_have' ? 0.7 : 0.4);
      const scoreOutOf100 = Math.round(bestScore * 100);

      weightedScoreSum += scoreOutOf100 * weight;
      totalWeightSum += weight;

      items.push({
        requirementId: req.id,
        requirementText: req.text,
        requirementCategory: req.category,
        importance: req.importance,
        weight,
        strength,
        recommendedAction: action,
        matchedEvidence: matchedSnippets,
        evidenceSnippet: bestMatch ? bestMatch.evidence.claim : null,
        score: scoreOutOf100,
        gapAnalysis,
        actionRationale: rationale,
      });
    }

    const overallMatchScore = totalWeightSum > 0 ? Math.round(weightedScoreSum / totalWeightSum) : 0;

    const matrixData: EvidenceMatrix = {
      id: generateStableId('matrix'),
      jobId: job.id,
      jobTitle: job.title,
      candidateId,
      overallMatchScore: Math.min(100, Math.max(0, overallMatchScore)),
      coverageBreakdown: {
        strongCount,
        moderateCount,
        weakCount,
        missingCount,
        totalRequirements: job.requirements.length,
      },
      items,
      missingCriticalGaps,
      keyStrengths,
      recommendedQuestions: Array.from(new Set(recommendedQuestions)).slice(0, 5),
      generatedAt: Date.now(),
    };

    return EvidenceMatrixSchema.parse(matrixData);
  }
}

// Global Singleton Instance
let defaultMatchingService: EvidenceMatchingService | null = null;
export function getEvidenceMatchingService(): EvidenceMatchingService {
  if (!defaultMatchingService) {
    defaultMatchingService = new EvidenceMatchingService();
  }
  return defaultMatchingService;
}
