import {
  JobDescription,
  PersonalizedQuestion,
  QuestionSchema,
  CandidateEvidence,
  EvidenceMatrix,
  EvidenceMatchItem,
  generateStableId,
  ResumeContract,
} from '../types/agentContract';
import type { ResumeData } from '../types';
import {
  CandidateEvidenceService,
  extractNumericTokens,
  extractSkillTokens,
  getEvidenceService,
} from './candidateEvidenceService';
import { getEvidenceMatchingService } from './evidenceMatchingService';
import { parseDescriptionBullets } from '../utils/templateUtils';

/**
 * CVArchitect Personalized Question Engine (Phase 6 Foundation)
 *
 * Generates high-impact, grounded clarifying questions based on:
 * 1. Candidate's actual resume bullets and roles.
 * 2. Target job's explicit requirements.
 * 3. Evidence Matrix gap analysis (missing metrics, missing outcomes, weak evidence, seniority gaps).
 *
 * Converts candidate answers into strict verified CandidateEvidence records and
 * automatically updates the Evidence Matrix.
 */

export interface GenerateQuestionsParams {
  job: JobDescription;
  resume: ResumeData | ResumeContract;
  evidenceMatrix: EvidenceMatrix;
  existingEvidence?: CandidateEvidence[];
}

export interface SaveAnswerParams {
  questionId: string;
  answerText: string;
  question: PersonalizedQuestion;
  job: JobDescription;
  evidenceMatrix: EvidenceMatrix;
  evidenceService?: CandidateEvidenceService;
  candidateId?: string;
}

export interface SaveAnswerResult {
  updatedQuestion: PersonalizedQuestion;
  newEvidence: CandidateEvidence[];
  updatedMatrix: EvidenceMatrix;
}

export class QuestionEngineService {
  /**
   * Generates prioritized, personalized questions targeting high-impact resume gaps
   */
  public generateCandidateQuestions(params: GenerateQuestionsParams): PersonalizedQuestion[] {
    const { job, resume, evidenceMatrix } = params;
    const questions: PersonalizedQuestion[] = [];

    const expList = Array.isArray(resume.experience) ? resume.experience : [];
    const allBullets: Array<{ text: string; company: string; role: string; itemId?: string }> = [];

    for (const exp of expList) {
      const company = exp.company || 'Company';
      const role = exp.role || 'Role';
      const bullets = Array.isArray(exp.bullets)
        ? exp.bullets.map((b) => (typeof b === 'string' ? b : b.text))
        : parseDescriptionBullets(exp.description);

      bullets.forEach((b) => {
        if (b && b.trim()) {
          allBullets.push({ text: b.trim(), company, role, itemId: exp.id });
        }
      });
    }

    // 1. Evaluate Evidence Matrix items needing inquiry
    for (const item of evidenceMatrix.items) {
      if (item.recommendedAction === 'ask_question' || item.strength === 'missing' || item.strength === 'weak') {
        const reqText = item.requirementText;
        const reqLower = reqText.toLowerCase();

        // ── A. Missing Conversion / Revenue / Scale Metric ──────────────────
        if (/conversion|revenue|scale|latency|throughput|performance|cost|roi|\$|%/i.test(reqLower)) {
          // Find matching resume bullet mentioning the feature/project
          const relatedBullet = allBullets.find(
            (b) => /redesign|built|developed|launched|optimized|created|improved/i.test(b.text)
          );

          if (relatedBullet) {
            questions.push(
              QuestionSchema.parse({
                id: generateStableId('q_metric'),
                question: `The role emphasizes ${reqText.slice(0, 40)}. Your resume says you "${relatedBullet.text.slice(0, 65)}...". Did you measure conversion, revenue, latency, speedup, or another quantitative outcome after this work?`,
                reason: `The job requires ${reqText}, and adding a concrete metric to your ${relatedBullet.company} experience will significantly strengthen your ATS match.`,
                relatedRequirement: reqText,
                targetRequirementId: item.requirementId,
                relatedResumeItem: `${relatedBullet.role} at ${relatedBullet.company}`,
                targetBulletId: relatedBullet.itemId,
                expectedEvidence: 'Specific metric (e.g. +24% conversion, 40ms latency reduction, $500k savings)',
                priority: item.importance === 'must_have' ? 'critical' : 'high',
                category: 'missing_metric',
                suggestedFactTopic: `${relatedBullet.company} Performance Metrics`,
                status: 'unanswered',
                createdAt: Date.now(),
              })
            );
            continue;
          }
        }

        // ── B. Missing Leadership / Cross-Functional Scope ──────────────────
        if (/leadership|collaborat|stakeholder|partner|manage|lead|cross-functional/i.test(reqLower)) {
          const collabBullet = allBullets.find(
            (b) => /worked with|team|engineers|designers|stakeholders|partnered/i.test(b.text)
          );

          if (collabBullet) {
            questions.push(
              QuestionSchema.parse({
                id: generateStableId('q_lead'),
                question: `This role requires cross-functional leadership. Your resume mentions "${collabBullet.text.slice(0, 65)}...". Were you responsible for coordinating the work, making product decisions, or driving the project through launch?`,
                reason: `The employer is looking for demonstrated ownership in ${reqText}.`,
                relatedRequirement: reqText,
                targetRequirementId: item.requirementId,
                relatedResumeItem: `${collabBullet.role} at ${collabBullet.company}`,
                expectedEvidence: 'Scope of coordination, decision-making authority, or team size',
                priority: 'critical',
                category: 'missing_leadership',
                suggestedFactTopic: 'Cross-functional Ownership',
                status: 'unanswered',
                createdAt: Date.now(),
              })
            );
            continue;
          }
        }

        // ── C. Missing Required Skill or Tool ───────────────────────────────
        if (item.importance === 'must_have' && (item.requirementCategory === 'tool' || item.requirementCategory === 'required_skill')) {
          questions.push(
            QuestionSchema.parse({
              id: generateStableId('q_skill'),
              question: `The job listing requires experience with "${reqText}". Have you used this technology or a direct alternative in any of your past roles or personal projects?`,
              reason: `Missing critical must-have technical skill "${reqText}".`,
              relatedRequirement: reqText,
              targetRequirementId: item.requirementId,
              expectedEvidence: 'Tool usage context, duration, or project implementation details',
              priority: 'critical',
              category: 'missing_skill',
              skillTag: reqText.slice(0, 30),
              status: 'unanswered',
              createdAt: Date.now(),
            })
          );
          continue;
        }

        // ── D. Missing Outcome / Impact ─────────────────────────────────────
        if (item.strength === 'weak') {
          questions.push(
            QuestionSchema.parse({
              id: generateStableId('q_outcome'),
              question: `Regarding the requirement for "${reqText}": what was the measurable outcome or team impact of your work in this area?`,
              reason: `Your existing resume mention for this requirement lacks clear business impact.`,
              relatedRequirement: reqText,
              targetRequirementId: item.requirementId,
              expectedEvidence: 'Business outcome, efficiency gain, or organizational benefit',
              priority: 'high',
              category: 'missing_outcome',
              status: 'unanswered',
              createdAt: Date.now(),
            })
          );
          continue;
        }
      }
    }

    // 2. Check for Ambiguous / Vague Bullets (e.g. "Worked on billing platform")
    for (const bullet of allBullets) {
      if (/^worked on\b|^helped with\b|^assisted in\b|^responsible for\b/i.test(bullet.text) && bullet.text.split(/\s+/).length < 8) {
        questions.push(
          QuestionSchema.parse({
            id: generateStableId('q_vague'),
            question: `In your role at ${bullet.company}, your resume states: "${bullet.text}". What specific features, architecture, or technologies did you personally build or deliver?`,
            reason: 'Weak passive action verb without specific deliverables or technologies.',
            relatedResumeItem: `${bullet.role} at ${bullet.company}`,
            expectedEvidence: 'Specific technical deliverables, systems built, or measurable output',
            priority: 'high',
            category: 'unclear_responsibility',
            suggestedFactTopic: `${bullet.company} Core Deliverables`,
            status: 'unanswered',
            createdAt: Date.now(),
          })
        );
      }
    }

    // Sort by priority (critical > high > medium > low) and return unique questions
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    questions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return questions.slice(0, 6);
  }

  /**
   * Converts a candidate's answer into verified CandidateEvidence records with strict provenance
   */
  public convertAnswerToEvidence(
    question: PersonalizedQuestion,
    answerText: string,
    candidateId = 'default_candidate',
    evidenceService?: CandidateEvidenceService
  ): CandidateEvidence[] {
    const service = evidenceService || getEvidenceService();
    const cleanAnswer = answerText.trim();
    if (!cleanAnswer) return [];

    const extractedNumeric = extractNumericTokens(cleanAnswer);
    const metrics = extractedNumeric.map((val) => ({
      value: val,
      type: val.includes('%') ? ('percentage' as const) : ('other' as const),
    }));

    const skills = extractSkillTokens(cleanAnswer);

    // Create the primary verified evidence record
    const evidenceItem = service.addCandidateEvidence({
      candidateId,
      claim: cleanAnswer,
      context: question.relatedResumeItem || question.reason,
      topic: question.suggestedFactTopic || question.skillTag || 'Candidate Answer',
      sourceType: 'candidate_answer',
      sourceId: question.id,
      relatedResumeItemId: question.targetBulletId,
      confidence: 1.0,
      status: 'verified',
      metrics,
      skills,
      notes: `Captured in response to clarifying question: "${question.question}"`,
    });

    return [evidenceItem];
  }

  /**
   * Saves candidate answer, generates verified evidence, and recalculates affected EvidenceMatrix items
   */
  public saveCandidateAnswer(params: SaveAnswerParams): SaveAnswerResult {
    const { question, answerText, job, evidenceMatrix, candidateId = 'default_candidate' } = params;
    const service = params.evidenceService || getEvidenceService();

    // 1. Convert to verified evidence
    const newEvidence = this.convertAnswerToEvidence(question, answerText, candidateId, service);

    // 2. Mark question as answered
    const updatedQuestion: PersonalizedQuestion = QuestionSchema.parse({
      ...question,
      status: 'answered',
      answerText,
      answerEvidenceId: newEvidence[0]?.id,
      generatedEvidenceIds: newEvidence.map((e) => e.id),
      answeredAt: Date.now(),
    });

    // 3. Recalculate Evidence Matrix with updated evidence pool
    const allEvidence = service.getCandidateEvidence(candidateId);
    const matchingService = getEvidenceMatchingService();
    const updatedMatrix = matchingService.generateEvidenceMatrix(job, allEvidence, candidateId);

    return {
      updatedQuestion,
      newEvidence,
      updatedMatrix,
    };
  }
}

// Global Singleton Instance
let defaultQuestionService: QuestionEngineService | null = null;
export function getQuestionEngineService(): QuestionEngineService {
  if (!defaultQuestionService) {
    defaultQuestionService = new QuestionEngineService();
  }
  return defaultQuestionService;
}
