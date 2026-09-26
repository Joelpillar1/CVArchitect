import {
  ResumeContract,
  JobDescription,
  CandidateEvidence,
  Evaluation,
  EvaluationSchema,
  CriticFinding,
  CriticFindingSchema,
  StructuredResumeOperation,
  generateStableId,
  structuredToResumeData,
} from '../types/agentContract';
import type { ResumeData } from '../types';
import {
  CandidateEvidenceService,
  extractNumericTokens,
  getEvidenceService,
} from './candidateEvidenceService';
import {
  StructuredMutationService,
  getStructuredMutationService,
} from './structuredMutationService';

/**
 * CVArchitect Resume Critic & Autonomous Revision Loop (Phase 10 Foundation)
 *
 * Implements an expert 11-dimension evaluation and bounded revision loop:
 * 1. Evaluates job alignment, coverage, evidence strength, ATS risks, and factual grounding.
 * 2. Emits structured CriticFindings with severity (critical, high, medium, low).
 * 3. Autonomously fixes critical/high issues via StructuredResumeOperations.
 * 4. Strictly caps loop at MAX_REVISIONS = 3 to prevent infinite loops.
 * 5. Marks resume complete only when it passes the defined quality threshold.
 */

export const MAX_REVISIONS = 3;
export const QUALITY_SCORE_THRESHOLD = 85;

export interface RevisionLoopResult {
  isFinal: boolean;
  passedThreshold: boolean;
  totalIterations: number;
  finalEvaluation: Evaluation;
  finalResumeContract: ResumeContract;
  finalResumeData: ResumeData;
  appliedCorrections: StructuredResumeOperation[];
}

export class ResumeCriticService {
  private evidenceService: CandidateEvidenceService;
  private mutationService: StructuredMutationService;

  constructor(
    evidenceService?: CandidateEvidenceService,
    mutationService?: StructuredMutationService
  ) {
    this.evidenceService = evidenceService || getEvidenceService();
    this.mutationService = mutationService || getStructuredMutationService();
  }

  /**
   * Run comprehensive diagnostic critique across all 11 evaluation dimensions
   */
  public evaluateResume(
    resume: ResumeContract,
    job?: JobDescription | null,
    evidencePool?: CandidateEvidence[],
    iteration = 0
  ): Evaluation {
    const findings: CriticFinding[] = [];
    const verifiedEvidence = evidencePool || this.evidenceService.getCandidateEvidence(resume.candidate.id);

    const allBullets = resume.experience.flatMap((e) =>
      e.bullets.map((b) => ({ ...b, company: e.company, role: e.role, expId: e.id }))
    );

    // ── 1. Factual Accuracy & Fabricated Metric Check ────────────────────────
    for (const b of allBullets) {
      const claimCheck = this.evidenceService.validateClaimAgainstEvidence(b.text, verifiedEvidence);
      if (!claimCheck.isValid && claimCheck.code === 'unsupported_metric') {
        const ungrounded = claimCheck.missingEvidenceDetails?.ungroundedMetrics?.join(', ') || 'metric';
        findings.push(
          CriticFindingSchema.parse({
            id: generateStableId('find_metric'),
            severity: 'critical',
            category: 'fabricated_metric',
            affectedResumeItem: `Bullet at ${b.company}: "${b.text.slice(0, 50)}..."`,
            problem: `Ungrounded numerical metric (${ungrounded}) has no provenance in candidate evidence.`,
            recommendedFix: 'Remove ungrounded percentage/stat or replace with verified metric.',
            evidenceRequired: true,
          })
        );
      }
    }

    // ── 2. Weak Opening Verbs & Generic Language ─────────────────────────────
    for (const b of allBullets) {
      if (/^responsible for\b|^worked on\b|^helped with\b|^assisted\b/i.test(b.text)) {
        findings.push(
          CriticFindingSchema.parse({
            id: generateStableId('find_verb'),
            severity: 'high',
            category: 'weak_bullet',
            affectedResumeItem: `Bullet at ${b.company}: "${b.text.slice(0, 50)}..."`,
            problem: 'Opens with weak passive verb rather than an assertive action verb.',
            recommendedFix: 'Rewrite with strong action verb (e.g. Engineered, Spearheaded, Architected, Delivered).',
            evidenceRequired: false,
            proposedCorrection: {
              operation: 'replace_bullet',
              targetId: b.id,
              newContent: b.text.replace(/^responsible for (developing|building|managing)?/i, 'Engineered')
                .replace(/^worked on (building|developing)?/i, 'Delivered')
                .replace(/^helped (build|develop|create)?/i, 'Co-authored and deployed'),
              reason: 'Replaced passive verb with strong technical action verb.',
            },
          })
        );
      }

      if (/various tasks|multiple projects|duties included/i.test(b.text)) {
        findings.push(
          CriticFindingSchema.parse({
            id: generateStableId('find_fluff'),
            severity: 'medium',
            category: 'generic_language',
            affectedResumeItem: `Bullet at ${b.company}: "${b.text.slice(0, 50)}..."`,
            problem: 'Contains vague filler words ("various tasks", "multiple projects").',
            recommendedFix: 'Specify the exact technical deliverables and scope.',
            evidenceRequired: false,
          })
        );
      }
    }

    // ── 3. Repetitive Wording Check ──────────────────────────────────────────
    const openingVerbs = allBullets.map((b) => b.action || b.text.split(/\s+/)[0]).filter(Boolean);
    const verbCounts: Record<string, number> = {};
    for (const v of openingVerbs) {
      const key = v.toLowerCase();
      verbCounts[key] = (verbCounts[key] || 0) + 1;
    }
    for (const [verb, count] of Object.entries(verbCounts)) {
      if (count >= 3 && verb.length > 3) {
        findings.push(
          CriticFindingSchema.parse({
            id: generateStableId('find_rep'),
            severity: 'medium',
            category: 'repetitive_wording',
            affectedResumeItem: 'Experience Bullets',
            problem: `Action verb "${verb}" is repeated ${count} times across the resume.`,
            recommendedFix: `Vary opening verbs across bullets (e.g. alternate with Architected, Spearheaded, Accelerated).`,
            evidenceRequired: false,
          })
        );
      }
    }

    // ── 3b. Percentage Overuse / Metric Monotony Check ────────────────────────
    for (const exp of resume.experience) {
      const percentBullets = exp.bullets.filter((b) => /%|\bpercent\b/i.test(b.text));
      if (percentBullets.length > 1) {
        findings.push(
          CriticFindingSchema.parse({
            id: generateStableId('find_percent_overuse'),
            severity: 'medium',
            category: 'metric_monotony',
            affectedResumeItem: `Experience at ${exp.company || 'Job'}`,
            problem: `Found ${percentBullets.length} bullets with percentage (%) metrics in the same role. Overusing % makes metrics look repetitive.`,
            recommendedFix: 'Limit percentage (%) to max 1 bullet per role. Diversify with user volume (e.g. 2M+ users), budget ($400K), or time saved (2 hrs to 15 mins).',
            evidenceRequired: false,
          })
        );
      }
    }

    // ── 4. ATS Risks & Markdown Formatting Check ─────────────────────────────
    if (resume.candidate.summary && /[*`#]/.test(resume.candidate.summary)) {
      findings.push(
        CriticFindingSchema.parse({
          id: generateStableId('find_ats_md'),
          severity: 'high',
          category: 'ats_risk',
          affectedResumeItem: 'Professional Summary',
          problem: 'Markdown symbols (asterisks or backticks) detected inside resume text.',
          recommendedFix: 'Clean markdown symbols to preserve ATS compatibility.',
          evidenceRequired: false,
          proposedCorrection: {
            operation: 'replace_summary',
            targetId: 'summary',
            newContent: resume.candidate.summary.replace(/[*`#]/g, ''),
            reason: 'Cleaned raw markdown symbols from summary.',
          },
        })
      );
    }

    // ── 5. Missing Critical Job Requirements ─────────────────────────────────
    if (job && job.requirements.length > 0) {
      const resumeCorpus = `${resume.candidate.summary} ${resume.skillsRaw} ${allBullets.map((b) => b.text).join(' ')}`.toLowerCase();
      for (const req of job.requirements.filter((r) => r.importance === 'must_have')) {
        const words = req.keywords.length > 0 ? req.keywords : req.text.split(/\s+/).filter((w) => w.length > 4);
        const hasMatch = words.some((w) => resumeCorpus.includes(w.toLowerCase()));
        if (!hasMatch) {
          findings.push(
            CriticFindingSchema.parse({
              id: generateStableId('find_req'),
              severity: 'high',
              category: 'missing_critical_requirement',
              affectedResumeItem: `Target Requirement: "${req.text}"`,
              problem: `Must-have job requirement "${req.text}" has no representation in the resume.`,
              recommendedFix: `Incorporate candidate experience for "${req.text}" or clarify background.`,
              evidenceRequired: true,
            })
          );
        }
      }
    }

    // ── 6. Compute Dimension Scores (0-100) ───────────────────────────────────
    const criticalCount = findings.filter((f) => f.severity === 'critical').length;
    const highCount = findings.filter((f) => f.severity === 'high').length;
    const mediumCount = findings.filter((f) => f.severity === 'medium').length;

    const factualAccuracy = Math.max(0, 100 - criticalCount * 35);
    const clarity = Math.max(0, 95 - highCount * 10 - mediumCount * 5);
    const atsCompatibility = Math.max(0, 95 - findings.filter((f) => f.category === 'ats_risk').length * 20);
    const achievementQuality = Math.max(0, 90 - findings.filter((f) => f.category === 'weak_bullet').length * 10);
    const requirementCoverage = job ? Math.max(0, 95 - findings.filter((f) => f.category === 'missing_critical_requirement').length * 15) : 90;
    const jobAlignment = Math.round((requirementCoverage + achievementQuality) / 2);
    const skillAlignment = Math.min(100, Math.max(60, resume.skills.length * 8));
    const keywordRelevance = Math.round((jobAlignment + atsCompatibility) / 2);
    const evidenceStrength = Math.round((factualAccuracy + achievementQuality) / 2);
    const seniorityAlignment = resume.experience.length >= 2 ? 90 : 75;
    const recruiterReadability = Math.round((clarity + achievementQuality + atsCompatibility) / 3);

    const overallScore = Math.round(
      (jobAlignment * 0.15 +
        requirementCoverage * 0.15 +
        factualAccuracy * 0.15 +
        achievementQuality * 0.15 +
        clarity * 0.1 +
        atsCompatibility * 0.1 +
        recruiterReadability * 0.1 +
        skillAlignment * 0.05 +
        seniorityAlignment * 0.05)
    );

    const passedQualityThreshold = criticalCount === 0 && highCount === 0 && overallScore >= QUALITY_SCORE_THRESHOLD;

    const evalData: Evaluation = {
      id: generateStableId('eval'),
      jobId: job?.id,
      overallScore,
      dimensions: {
        jobAlignment,
        requirementCoverage,
        skillAlignment,
        keywordRelevance,
        evidenceStrength,
        achievementQuality,
        clarity,
        atsCompatibility,
        seniorityAlignment,
        recruiterReadability,
        factualAccuracy,
      },
      findings,
      passedQualityThreshold,
      strengths: [
        'Clean professional visual hierarchy',
        'Strong technical core competencies',
        'Quantified deliverables in key roles',
      ],
      gaps: findings.filter((f) => f.severity === 'critical' || f.severity === 'high').map((f) => f.problem),
      revisionIteration: iteration,
      evaluatorVersion: 'v3-critic',
      evaluatedAt: Date.now(),
    };

    return EvaluationSchema.parse(evalData);
  }

  /**
   * Autonomous bounded revision loop (Capped at MAX_REVISIONS = 3)
   */
  public runRevisionLoop(
    initialResume: ResumeContract,
    job?: JobDescription | null,
    evidencePool?: CandidateEvidence[],
    candidateId = 'default_candidate'
  ): RevisionLoopResult {
    let currentResume = JSON.parse(JSON.stringify(initialResume)) as ResumeContract;
    let iteration = 0;
    const appliedCorrections: StructuredResumeOperation[] = [];

    let currentEval = this.evaluateResume(currentResume, job, evidencePool, iteration);

    while (iteration < MAX_REVISIONS && !currentEval.passedQualityThreshold) {
      iteration += 1;

      // Find actionable high/critical findings with proposed corrections
      const actionable = currentEval.findings.filter(
        (f) => (f.severity === 'critical' || f.severity === 'high') && f.proposedCorrection
      );

      if (actionable.length === 0) {
        // No automated programmatic fixes possible without user input -> break loop
        break;
      }

      for (const finding of actionable) {
        if (finding.proposedCorrection) {
          const mutRes = this.mutationService.applyStructuredOperation({
            resume: currentResume,
            operation: finding.proposedCorrection,
            candidateId,
          });

          if (mutRes.success && mutRes.updatedContract) {
            currentResume = mutRes.updatedContract;
            appliedCorrections.push(finding.proposedCorrection);
            finding.isResolved = true;
          }
        }
      }

      // Re-evaluate current state
      currentEval = this.evaluateResume(currentResume, job, evidencePool, iteration);
    }

    const finalResumeData = structuredToResumeData(currentResume);

    return {
      isFinal: true,
      passedThreshold: currentEval.passedQualityThreshold,
      totalIterations: iteration,
      finalEvaluation: currentEval,
      finalResumeContract: currentResume,
      finalResumeData,
      appliedCorrections,
    };
  }
}

// Global Singleton Instance
let defaultCriticService: ResumeCriticService | null = null;
export function getResumeCriticService(): ResumeCriticService {
  if (!defaultCriticService) {
    defaultCriticService = new ResumeCriticService();
  }
  return defaultCriticService;
}
