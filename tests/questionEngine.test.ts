import { describe, it, expect, beforeEach } from 'vitest';
import { QuestionEngineService } from '../services/questionEngineService';
import { CandidateEvidenceService } from '../services/candidateEvidenceService';
import { EvidenceMatchingService } from '../services/evidenceMatchingService';
import {
  JobDescription,
  CandidateEvidence,
  EvidenceMatrix,
} from '../types/agentContract';
import { INITIAL_DATA, type ResumeData } from '../types';

describe('Phase 6: CVArchitect Personalized Question Engine', () => {
  let questionService: QuestionEngineService;
  let evidenceService: CandidateEvidenceService;
  let matchingService: EvidenceMatchingService;

  beforeEach(() => {
    questionService = new QuestionEngineService();
    evidenceService = new CandidateEvidenceService();
    matchingService = new EvidenceMatchingService();
  });

  // 1. Missing Metric Scenario
  it('generates a specific metric question when resume mentions project without quantitative outcome', () => {
    const mockJob: JobDescription = {
      id: 'job_pm_growth',
      title: 'Growth Product Manager',
      company: 'Shopify',
      rawText: 'Growth PM focusing on checkout conversion optimization',
      seniority: 'senior',
      requirements: [
        {
          id: 'req_conversion',
          category: 'responsibility',
          text: 'Drive checkout conversion optimization and funnel completion metrics',
          importance: 'must_have',
          weight: 1.0,
          origin: 'explicit_jd_requirement',
          keywords: ['Conversion', 'Optimization', 'Funnel', 'Metrics'],
          acceptableEvidencePatterns: ['conversion lift metrics'],
        },
      ],
      requiredSkills: ['Conversion Optimization'],
      preferredSkills: [],
      responsibilities: ['Drive conversion'],
      experienceRequirements: ['4+ years'],
      tools: ['Amplitude'],
      education: [],
      domainKnowledge: ['E-Commerce'],
      softSkills: [],
      keywords: ['Conversion'],
      keyPhrases: ['checkout conversion optimization'],
      hiringSignals: [],
      hiringSignalInsights: [],
      parsedAt: Date.now(),
    };

    const mockResume: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Alex Morgan',
      experience: [
        {
          id: 'exp_acme',
          company: 'Acme Commerce',
          role: 'Product Lead',
          startDate: '2021-01',
          endDate: 'Present',
          description: ['Redesigned the multi-step checkout experience for mobile shoppers'],
        },
      ],
    };

    // Extract initial evidence and generate initial matrix
    const initialEvidence = evidenceService.extractEvidenceFromResume(mockResume, 'cand_alex');
    const matrix = matchingService.generateEvidenceMatrix(mockJob, initialEvidence, 'cand_alex');

    const questions = questionService.generateCandidateQuestions({
      job: mockJob,
      resume: mockResume,
      evidenceMatrix: matrix,
      existingEvidence: initialEvidence,
    });

    expect(questions.length).toBeGreaterThan(0);
    const metricQ = questions.find((q) => q.category === 'missing_metric');
    expect(metricQ).toBeDefined();
    expect(metricQ?.question).toContain('redesigned the multi-step checkout experience');
    expect(metricQ?.question).toContain('conversion');
    expect(metricQ?.priority).toBe('critical');
  });

  // 2. Missing Leadership Evidence Scenario
  it('generates a cross-functional leadership scope question when bullet mentions collaboration', () => {
    const mockJob: JobDescription = {
      id: 'job_lead_eng',
      title: 'Lead Frontend Engineer',
      company: 'Linear',
      rawText: 'Cross-functional leadership required',
      seniority: 'lead',
      requirements: [
        {
          id: 'req_lead',
          category: 'cross_functional_collaboration',
          text: 'Cross-functional leadership and engineering project ownership',
          importance: 'must_have',
          weight: 1.0,
          origin: 'explicit_jd_requirement',
          keywords: ['Leadership', 'Cross-functional', 'Ownership'],
          acceptableEvidencePatterns: ['coordinating cross-functional engineering teams'],
        },
      ],
      requiredSkills: ['Cross-functional leadership'],
      preferredSkills: [],
      responsibilities: ['Lead projects'],
      experienceRequirements: ['5+ years'],
      tools: [],
      education: [],
      domainKnowledge: [],
      softSkills: [],
      keywords: [],
      keyPhrases: [],
      hiringSignals: [],
      hiringSignalInsights: [],
      parsedAt: Date.now(),
    };

    const mockResume: ResumeData = {
      ...INITIAL_DATA,
      experience: [
        {
          id: 'exp_1',
          company: 'SaaSify',
          role: 'Senior Developer',
          startDate: '2020',
          endDate: 'Present',
          description: ['Worked with engineers and designers on quarterly milestones'],
        },
      ],
    };

    const initialEvidence = evidenceService.extractEvidenceFromResume(mockResume, 'cand_1');
    const matrix = matchingService.generateEvidenceMatrix(mockJob, initialEvidence, 'cand_1');

    const questions = questionService.generateCandidateQuestions({
      job: mockJob,
      resume: mockResume,
      evidenceMatrix: matrix,
      existingEvidence: initialEvidence,
    });

    const leadQ = questions.find((q) => q.category === 'missing_leadership');
    expect(leadQ).toBeDefined();
    expect(leadQ?.question).toContain('cross-functional leadership');
    expect(leadQ?.question).toContain('coordinating the work, making product decisions, or driving the project');
  });

  // 3. Ambiguous / Vague Bullet Clarification
  it('detects ambiguous bullet points (e.g. "Worked on billing platform") and prompts for concrete deliverables', () => {
    const mockJob: JobDescription = {
      id: 'job_dev',
      title: 'Software Engineer',
      company: 'Tech Corp',
      rawText: 'Backend Developer',
      seniority: 'mid',
      requirements: [],
      requiredSkills: [],
      preferredSkills: [],
      responsibilities: [],
      experienceRequirements: [],
      tools: [],
      education: [],
      domainKnowledge: [],
      softSkills: [],
      keywords: [],
      keyPhrases: [],
      hiringSignals: [],
      hiringSignalInsights: [],
      parsedAt: Date.now(),
    };

    const mockResume: ResumeData = {
      ...INITIAL_DATA,
      experience: [
        {
          id: 'exp_vague',
          company: 'OldCo',
          role: 'Developer',
          startDate: '2022',
          endDate: '2023',
          description: ['Worked on billing platform'],
        },
      ],
    };

    const emptyMatrix: EvidenceMatrix = {
      id: 'mat_1',
      candidateId: 'cand_1',
      overallMatchScore: 50,
      coverageBreakdown: { strongCount: 0, moderateCount: 0, weakCount: 0, missingCount: 0, totalRequirements: 0 },
      items: [],
      missingCriticalGaps: [],
      keyStrengths: [],
      recommendedQuestions: [],
      generatedAt: Date.now(),
    };

    const questions = questionService.generateCandidateQuestions({
      job: mockJob,
      resume: mockResume,
      evidenceMatrix: emptyMatrix,
    });

    const vagueQ = questions.find((q) => q.category === 'unclear_responsibility');
    expect(vagueQ).toBeDefined();
    expect(vagueQ?.question).toContain('Worked on billing platform');
    expect(vagueQ?.question).toContain('What specific features, architecture, or technologies did you personally build');
  });

  // 4. No Useful Question Needed when all requirements are strong
  it('returns no questions when all critical job requirements are strongly evidenced', () => {
    const mockJob: JobDescription = {
      id: 'job_full',
      title: 'Senior TypeScript Engineer',
      company: 'Acme',
      rawText: 'TypeScript required',
      seniority: 'senior',
      requirements: [
        {
          id: 'req_ts',
          category: 'tool',
          text: '5+ years experience building TypeScript backends',
          importance: 'must_have',
          weight: 1.0,
          origin: 'explicit_jd_requirement',
          keywords: ['TypeScript'],
          acceptableEvidencePatterns: ['TypeScript backends'],
        },
      ],
      requiredSkills: ['TypeScript'],
      preferredSkills: [],
      responsibilities: [],
      experienceRequirements: [],
      tools: ['TypeScript'],
      education: [],
      domainKnowledge: [],
      softSkills: [],
      keywords: ['TypeScript'],
      keyPhrases: [],
      hiringSignals: [],
      hiringSignalInsights: [],
      parsedAt: Date.now(),
    };

    const mockResume: ResumeData = {
      ...INITIAL_DATA,
      experience: [
        {
          id: 'exp_ts',
          company: 'Acme',
          role: 'Lead Engineer',
          startDate: '2019',
          endDate: 'Present',
          description: ['Built high-throughput TypeScript backend service processing 50M requests/day'],
        },
      ],
    };

    const initialEvidence = evidenceService.extractEvidenceFromResume(mockResume, 'cand_ts');
    const matrix = matchingService.generateEvidenceMatrix(mockJob, initialEvidence, 'cand_ts');

    const questions = questionService.generateCandidateQuestions({
      job: mockJob,
      resume: mockResume,
      evidenceMatrix: matrix,
      existingEvidence: initialEvidence,
    });

    expect(questions.length).toBe(0);
  });

  // 5. Answer Processing, Provenance Storage & Matrix Recalculation
  it('processes candidate answer, creates verified evidence, and recalculates matrix to "strong"', () => {
    const mockJob: JobDescription = {
      id: 'job_growth_test',
      title: 'Growth PM',
      company: 'Stripe',
      rawText: 'Conversion optimization',
      seniority: 'senior',
      requirements: [
        {
          id: 'req_conv',
          category: 'responsibility',
          text: 'Improve onboarding conversion rate',
          importance: 'must_have',
          weight: 1.0,
          origin: 'explicit_jd_requirement',
          keywords: ['Conversion', 'Onboarding'],
          acceptableEvidencePatterns: ['conversion metrics'],
        },
      ],
      requiredSkills: [],
      preferredSkills: [],
      responsibilities: [],
      experienceRequirements: [],
      tools: [],
      education: [],
      domainKnowledge: [],
      softSkills: [],
      keywords: [],
      keyPhrases: [],
      hiringSignals: [],
      hiringSignalInsights: [],
      parsedAt: Date.now(),
    };

    // Initially unevidenced
    const matrixBefore = matchingService.generateEvidenceMatrix(mockJob, [], 'cand_user');
    expect(matrixBefore.coverageBreakdown.missingCount).toBe(1);

    const question = {
      id: 'q_onboarding_conv',
      question: 'Did you measure onboarding conversion after the revamp?',
      reason: 'Missing conversion metric for Stripe PM role',
      relatedRequirement: 'Improve onboarding conversion rate',
      targetRequirementId: 'req_conv',
      expectedEvidence: 'Conversion percentage lift',
      priority: 'critical' as const,
      category: 'missing_metric' as const,
      status: 'unanswered' as const,
      createdAt: Date.now(),
    };

    // Candidate answers with facts
    const answerText = 'Yes, after the redesign onboarding conversion increased by 24% across 50,000 new signups.';
    const result = questionService.saveCandidateAnswer({
      questionId: question.id,
      question,
      answerText,
      job: mockJob,
      evidenceMatrix: matrixBefore,
      evidenceService,
      candidateId: 'cand_user',
    });

    // Verify question is answered
    expect(result.updatedQuestion.status).toBe('answered');
    expect(result.updatedQuestion.answerText).toBe(answerText);

    // Verify verified evidence created with strict provenance
    expect(result.newEvidence.length).toBe(1);
    const ev = result.newEvidence[0];
    expect(ev.sourceType).toBe('candidate_answer');
    expect(ev.sourceId).toBe('q_onboarding_conv');
    expect(ev.status).toBe('verified');
    expect(ev.confidence).toBe(1.0);
    expect(ev.metrics.some((m) => m.value === '24')).toBe(true);

    // Verify matrix recalculation: requirement is now strong/moderate!
    expect(result.updatedMatrix.overallMatchScore).toBeGreaterThan(60);
    expect(result.updatedMatrix.coverageBreakdown.missingCount).toBe(0);
    const updatedReqItem = result.updatedMatrix.items.find((i) => i.requirementId === 'req_conv');
    expect(updatedReqItem?.strength).toBe('strong');
    expect(updatedReqItem?.recommendedAction).toBe('keep');
  });
});
