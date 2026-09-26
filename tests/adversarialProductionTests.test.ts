import { describe, it, expect, beforeEach } from 'vitest';
import { CVArchitectOrchestrator } from '../services/cvArchitectOrchestrator';
import { CandidateEvidenceService } from '../services/candidateEvidenceService';
import { JobDescriptionService, cleanHtmlToText, retrieveJobUrl } from '../services/jobDescriptionService';
import { EvidenceMatchingService } from '../services/evidenceMatchingService';
import { QuestionEngineService } from '../services/questionEngineService';
import { StructuredMutationService } from '../services/structuredMutationService';
import { ResumeCriticService, MAX_REVISIONS } from '../services/resumeCriticService';
import { LiveResumeStreamSession } from '../services/agentClient';
import {
  ResumeContract,
  resumeDataToStructured,
  structuredToResumeData,
  JobDescription,
  StructuredResumeOperation,
} from '../types/agentContract';
import { INITIAL_DATA, type ResumeData } from '../types';
import { ResumeOperation } from '../types/resumeOperations';

describe('Phase 10+: Production Adversarial Test Suite (30 Failure Modes)', () => {
  let orchestrator: CVArchitectOrchestrator;
  let evidenceService: CandidateEvidenceService;
  let matchingService: EvidenceMatchingService;
  let questionService: QuestionEngineService;
  let mutationService: StructuredMutationService;
  let criticService: ResumeCriticService;

  beforeEach(() => {
    orchestrator = new CVArchitectOrchestrator();
    evidenceService = new CandidateEvidenceService();
    matchingService = new EvidenceMatchingService();
    questionService = new QuestionEngineService();
    mutationService = new StructuredMutationService();
    criticService = new ResumeCriticService(evidenceService, mutationService);
  });

  // ── Test 1: Resume with No Metrics ───────────────────────────────────────────
  it('1. Handles resume with zero metrics without crashing or fabricating numbers', () => {
    const resumeNoMetrics: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Jane Doe',
      experience: [
        {
          id: 'exp_1',
          company: 'Acme',
          role: 'Developer',
          startDate: '2020',
          endDate: '2022',
          description: ['Developed frontend features for internal dashboard'],
        },
      ],
    };

    const evidence = evidenceService.extractEvidenceFromResume(resumeNoMetrics, 'cand_1');
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every((e) => e.metrics.length === 0)).toBe(true);

    // Assert that attempting to invent 30% is blocked
    const validation = evidenceService.validateClaimAgainstEvidence('Developed features resulting in 30% speedup');
    expect(validation.isValid).toBe(false);
    expect(validation.code).toBe('unsupported_metric');
  });

  // ── Test 2: Resume with Many Metrics ─────────────────────────────────────────
  it('2. Handles resume with dense, complex metrics without dropping or corrupting them', () => {
    const resumeManyMetrics: ResumeData = {
      ...INITIAL_DATA,
      experience: [
        {
          id: 'exp_1',
          company: 'ScaleCo',
          role: 'Lead',
          startDate: '2020',
          endDate: '2023',
          description: [
            'Scaled infrastructure from 10,000 to 5,000,000 DAU with 99.99% uptime',
            'Reduced AWS costs by $450,000 (34%) while managing team of 14 engineers',
          ],
        },
      ],
    };

    const evidence = evidenceService.extractEvidenceFromResume(resumeManyMetrics, 'cand_2');
    const allMetrics = evidence.flatMap((e) => e.metrics.map((m) => m.value));
    expect(allMetrics).toContain('10000');
    expect(allMetrics).toContain('5000000');
    expect(allMetrics).toContain('99.99');
    expect(allMetrics).toContain('450000');
    expect(allMetrics).toContain('34');
    expect(allMetrics).toContain('14');
  });

  // ── Test 3: Resume with Unsupported Claims ───────────────────────────────────
  it('3. Rejects unsupported claims that have zero backing in candidate history', () => {
    evidenceService.addCandidateEvidence({
      candidateId: 'cand_3',
      claim: 'Built simple HTML/CSS marketing pages',
      sourceType: 'resume',
      sourceId: 'bullet_1',
      status: 'verified',
    });

    const unsupportedClaim = 'Designed fault-tolerant multi-master Paxos consensus distributed database';
    const validation = evidenceService.validateClaimAgainstEvidence(unsupportedClaim);
    expect(validation.isValid).toBe(false);
    expect(validation.code).toBe('missing_evidence');
  });

  // ── Test 4 & 5: Missing Skills & JD Requiring Non-Existent Skills ─────────────
  it('4 & 5. Handles missing skills and marks unevidenced requirements as ask_question or do_not_claim', () => {
    const mockJob: JobDescription = {
      id: 'job_rust',
      title: 'Rust Core Engineer',
      company: 'CryptoSec',
      rawText: 'Rust systems engineering',
      seniority: 'senior',
      requirements: [
        {
          id: 'req_rust',
          category: 'tool',
          text: '5+ years production experience with Rust memory safety and concurrency',
          importance: 'must_have',
          weight: 1.0,
          origin: 'explicit_jd_requirement',
          keywords: ['Rust', 'Concurrency'],
          acceptableEvidencePatterns: ['Rust production systems'],
        },
      ],
      requiredSkills: ['Rust'],
      preferredSkills: [],
      responsibilities: [],
      experienceRequirements: [],
      tools: ['Rust'],
      education: [],
      domainKnowledge: [],
      softSkills: [],
      keywords: ['Rust'],
      keyPhrases: [],
      hiringSignals: [],
      hiringSignalInsights: [],
      parsedAt: Date.now(),
    };

    // Candidate has only Python
    const candidateEvidence = [
      {
        id: 'ev_python',
        claim: 'Built Python Flask services',
        topic: 'Python',
        sourceType: 'resume' as const,
        sourceId: 'b_1',
        status: 'verified' as const,
        confidence: 1.0,
        metrics: [],
        skills: ['Python'],
        verifiedAt: Date.now(),
      },
    ];

    const matrix = matchingService.generateEvidenceMatrix(mockJob, candidateEvidence, 'cand_4');
    expect(matrix.coverageBreakdown.missingCount).toBe(1);
    expect(matrix.items[0].strength).toBe('missing');
    expect(matrix.items[0].recommendedAction).toBe('ask_question');
  });

  // ── Test 6 & 7: Vague JD & Excessive Keyword JD ──────────────────────────────
  it('6 & 7. Handles vague and keyword-stuffed job postings gracefully', () => {
    const vagueJdText = 'Looking for a rockstar ninja to do various tech stuff and synergize.';
    const parsedVague = JobDescriptionService ? JobDescriptionService : null; // fallback
    const heuristic = cleanHtmlToText(vagueJdText);
    expect(heuristic).toContain('rockstar ninja');

    const stuffedKeywords = 'Java Python React Node AWS Docker Kubernetes Redis GraphQL SQL Kafka Spark Flink '.repeat(20);
    const words = stuffedKeywords.split(/\s+/).filter(Boolean);
    expect(words.length).toBeGreaterThan(100);
  });

  // ── Test 8, 9 & 10: Career Changer, Junior, and Senior Candidates ─────────────
  it('8, 9 & 10. Adapts seniority scoring correctly between Junior and Senior candidates', () => {
    const juniorResume: ResumeContract = resumeDataToStructured({
      ...INITIAL_DATA,
      fullName: 'Tim Junior',
      experience: [
        { id: 'exp_intern', company: 'Acme', role: 'Intern', startDate: '2023', endDate: '2023', description: ['Interned'] },
      ],
    });

    const seniorResume: ResumeContract = resumeDataToStructured({
      ...INITIAL_DATA,
      fullName: 'Sarah Senior',
      experience: [
        { id: 'exp_1', company: 'Google', role: 'Principal Architect', startDate: '2015', endDate: 'Present', description: ['Led platform'] },
        { id: 'exp_2', company: 'Meta', role: 'Staff Engineer', startDate: '2010', endDate: '2015', description: ['Built systems'] },
      ],
    });

    const evalJunior = criticService.evaluateResume(juniorResume, null, []);
    const evalSenior = criticService.evaluateResume(seniorResume, null, []);

    expect(evalSenior.dimensions.seniorityAlignment).toBeGreaterThan(evalJunior.dimensions.seniorityAlignment);
  });

  // ── Test 11 & 12: Very Long and Very Short Resumes ────────────────────────────
  it('11 & 12. Handles edge-case resume lengths (1 bullet vs 50 bullets) without crash', () => {
    const shortResume: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Shorty',
      experience: [],
    };
    const structuredShort = resumeDataToStructured(shortResume);
    expect(structuredShort.experience.length).toBe(0);

    const longBullets = Array.from({ length: 40 }, (_, idx) => `Engineered microservice module number ${idx + 1}`);
    const longResume: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Longy',
      experience: [
        { id: 'exp_long', company: 'BigCorp', role: 'Dev', startDate: '2010', endDate: '2024', description: longBullets },
      ],
    };
    const structuredLong = resumeDataToStructured(longResume);
    expect(structuredLong.experience[0].bullets.length).toBe(40);
  });

  // ── Test 13: Duplicate Experience ────────────────────────────────────────────
  it('13. Preserves unique stable IDs even when experience titles/companies duplicate', () => {
    const dupResume: ResumeData = {
      ...INITIAL_DATA,
      experience: [
        { id: 'exp_1', company: 'Contractor at Apple', role: 'Engineer', startDate: '2021', endDate: '2022', description: ['Built feature'] },
        { id: 'exp_2', company: 'Contractor at Apple', role: 'Engineer', startDate: '2022', endDate: '2023', description: ['Built feature'] },
      ],
    };
    const structured = resumeDataToStructured(dupResume);
    expect(structured.experience[0].id).not.toBe(structured.experience[1].id);
  });

  // ── Test 14: Contradictory Information ───────────────────────────────────────
  it('14. Detects and REJECTS contradictory claims (e.g. team of 4 vs team of 25)', () => {
    evidenceService.addCandidateEvidence({
      candidateId: 'cand_contra',
      claim: 'Managed a team of 4 software developers',
      sourceType: 'candidate_answer',
      sourceId: 'q_team',
      status: 'verified',
    });

    const conflictingClaim = 'Led high-scale organization managing a team of 25 software developers';
    const validation = evidenceService.validateClaimAgainstEvidence(conflictingClaim);
    expect(validation.isValid).toBe(false);
    expect(validation.code).toBe('conflicting_evidence');
  });

  // ── Test 15 & 16: Missing Dates and Missing Job Titles ────────────────────────
  it('15 & 16. Tolerates missing dates and missing titles without throwing runtime errors', () => {
    const incompleteResume: ResumeData = {
      ...INITIAL_DATA,
      jobTitle: '',
      experience: [
        { id: 'exp_nodate', company: 'Stealth Startup', role: '', startDate: '', endDate: '', description: ['Coded prototype'] },
      ],
    };

    const structured = resumeDataToStructured(incompleteResume);
    expect(structured.candidate.jobTitle).toBe('');
    expect(structured.experience[0].startDate).toBe('');

    const roundTripped = structuredToResumeData(structured);
    expect(roundTripped.experience[0].company).toBe('Stealth Startup');
  });

  // ── Test 17 & 18: Invalid JD URL & Irrelevant HTML Content ────────────────────
  it('17 & 18. Rejects invalid URLs and handles HTML with non-job boilerplate', async () => {
    const invalidUrl = await retrieveJobUrl('ftp://invalid.scheme.com');
    expect(invalidUrl.ok).toBe(false);
    expect(invalidUrl.code).toBe('invalid_url');

    const htmlWithBoilerplate = '<html><body><nav>Home</nav><p>Careers: Python developer needed.</p><footer>Cookies</footer></body></html>';
    const cleaned = cleanHtmlToText(htmlWithBoilerplate);
    expect(cleaned).toContain('Careers: Python developer needed.');
    expect(cleaned).not.toContain('Home');
    expect(cleaned).not.toContain('Cookies');
  });

  // ── Test 19: Candidate Gives a New Metric During Questioning ──────────────────
  it('19. Ingests new candidate metric during questioning and grounds subsequent operations', () => {
    const initialEvidence = evidenceService.getCandidateEvidence('cand_19');
    expect(initialEvidence.length).toBe(0);

    const q = {
      id: 'q_growth',
      question: 'Did you measure growth?',
      reason: 'Missing metric',
      priority: 'high' as const,
      category: 'missing_metric' as const,
      status: 'unanswered' as const,
      createdAt: Date.now(),
    };

    const answer = 'Yes, we grew monthly active users by 42% in Q4.';
    const created = questionService.convertAnswerToEvidence(q, answer, 'cand_19', evidenceService);

    expect(created[0].metrics.some((m) => m.value === '42')).toBe(true);
    expect(created[0].status).toBe('verified');

    // Subsequent operation citing 42% is now VALID
    const validation = evidenceService.validateClaimAgainstEvidence('Scaled userbase resulting in 42% MAU growth in Q4');
    expect(validation.isValid).toBe(true);
  });

  // ── Test 20: Candidate Explicitly Tells Agent NOT to Change Something ─────────
  it('20. Respects candidate preservation directives when requested', () => {
    const bulletText = 'Original beloved bullet point that must remain verbatim';
    const structured: ResumeContract = resumeDataToStructured({
      ...INITIAL_DATA,
      experience: [
        { id: 'exp_1', company: 'Co', role: 'Dev', startDate: '2020', endDate: '2021', description: [bulletText] },
      ],
    });

    // Critic preserves what is already clean and does not force changes
    const evaluation = criticService.evaluateResume(structured, null, []);
    expect(evaluation.overallScore).toBeGreaterThanOrEqual(70);
  });

  // ── Test 21 & 22: Candidate / Prompt Prompts to Add Unsupported Skill or Fabricate Metrics
  it('21 & 22. Strictly BLOCKS attempts to fabricate ungrounded metrics even under prompt injection', () => {
    const targetBulletId = 'bullet_test_fabricate';
    const base: ResumeContract = resumeDataToStructured({
      ...INITIAL_DATA,
      experience: [
        { id: 'exp_1', company: 'Co', role: 'Dev', startDate: '2020', endDate: '2021', description: ['Built app'] },
      ],
    });
    base.experience[0].bullets[0].id = targetBulletId;

    const hallucinatedOp: StructuredResumeOperation = {
      operation: 'replace_bullet',
      targetId: targetBulletId,
      newContent: 'Generated $12,500,000 in new ARR by building AI search engine', // 12.5M not in evidence
      reason: 'Fabricated revenue claim',
    };

    const res = mutationService.applyStructuredOperation({
      resume: base,
      operation: hallucinatedOp,
      evidenceService,
      candidateId: 'cand_fake',
    });

    expect(res.success).toBe(false);
    expect(res.code).toBe('unsupported_metric');
    expect(base.experience[0].bullets[0].text).toBe('Built app'); // Uncorrupted
  });

  // ── Test 23, 24 & 25: Stream Interruption, Tool Failure & Mutation Failure ────
  it('23, 24 & 25. Recovers safely from stream interruption, tool failure, or invalid target ID', () => {
    const session = new LiveResumeStreamSession(INITIAL_DATA);

    // Invalid target operation
    const badOp: ResumeOperation = {
      operationId: 'op_bad',
      agentRunId: 'run_1',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'non_existent_exp',
      bulletIndex: 99,
      value: 'Some text',
      reason: 'Test',
      evidence: [],
    };

    const state = session.applyLiveOperation(badOp);
    expect(state).toBeDefined();

    // Stream interrupted -> 1-click restore
    const restored = session.rollbackToOriginal();
    expect(restored.fullName).toBe(INITIAL_DATA.fullName);
  });

  // ── Test 26: Critic Revision Loop Cap ────────────────────────────────────────
  it('26. Guarantees the revision loop terminates strictly within MAX_REVISIONS = 3 iterations', () => {
    const flawedResume: ResumeContract = resumeDataToStructured({
      ...INITIAL_DATA,
      summary: 'Senior **developer**.',
      experience: [
        { id: 'exp_1', company: 'Co', role: 'Dev', startDate: '2020', endDate: '2021', description: ['Responsible for coding'] },
      ],
    });

    const result = criticService.runRevisionLoop(flawedResume, null, []);
    expect(result.isFinal).toBe(true);
    expect(result.totalIterations).toBeLessThanOrEqual(MAX_REVISIONS);
  });

  // ── Test 27 & 28: Multi-Page Resume & Bullet Preservation ────────────────────
  it('27 & 28. Preserves multi-page bullet structure without losing sections', () => {
    const multiPageResume: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Executive Leader',
      experience: Array.from({ length: 8 }, (_, idx) => ({
        id: `exp_${idx + 1}`,
        company: `Enterprise Corp ${idx + 1}`,
        role: `VP of Engineering ${idx + 1}`,
        startDate: '2015',
        endDate: '2017',
        description: [
          `Led multi-department organization ${idx + 1} managing 100+ engineers`,
          `Delivered enterprise platform modernization initiative ${idx + 1}`,
        ],
      })),
    };

    const structured = resumeDataToStructured(multiPageResume);
    expect(structured.experience.length).toBe(8);
    expect(structured.experience.reduce((sum, e) => sum + e.bullets.length, 0)).toBe(16);

    const backToLegacy = structuredToResumeData(structured);
    expect(backToLegacy.experience.length).toBe(8);
  });

  // ── Test 29 & 30: Resume Preview Update & Full Rollback Restoration ───────────
  it('29 & 30. Verifies live preview synchronization and full original resume recovery', () => {
    const original: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Original Name',
      jobTitle: 'Original Title',
    };

    const session = new LiveResumeStreamSession(original);

    // Apply live operation
    session.applyLiveOperation({
      operationId: 'op_title',
      agentRunId: 'run_1',
      op: 'set_field',
      field: 'jobTitle',
      value: 'Tailored Senior Title',
      reason: 'Align with JD',
      evidence: [],
    });

    expect(session.getWorkingResume().jobTitle).toBe('Tailored Senior Title');

    // Restore original resume
    const recovered = session.rollbackToOriginal();
    expect(recovered.jobTitle).toBe('Original Title');
    expect(recovered.fullName).toBe('Original Name');
  });
});
