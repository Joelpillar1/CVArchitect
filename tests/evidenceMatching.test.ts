import { describe, it, expect, beforeEach } from 'vitest';
import { EvidenceMatchingService } from '../services/evidenceMatchingService';
import {
  JobDescription,
  JobRequirement,
  CandidateEvidence,
  EvidenceMatrixSchema,
} from '../types/agentContract';

describe('Phase 5: Resume-to-JD Evidence Matching & Evidence Matrix', () => {
  let service: EvidenceMatchingService;

  beforeEach(() => {
    service = new EvidenceMatchingService();
  });

  // 1. Direct Strong Match (e.g. React & TypeScript)
  it('identifies strong evidence match and recommends "keep"', () => {
    const requirement: JobRequirement = {
      id: 'req_ts_react',
      category: 'tool',
      text: 'Must have 5+ years of experience architecting large-scale React and TypeScript applications',
      importance: 'must_have',
      weight: 1.0,
      origin: 'explicit_jd_requirement',
      keywords: ['React', 'TypeScript', 'Architecting', 'Large-scale'],
      acceptableEvidencePatterns: ['building production React and TypeScript web apps'],
    };

    const evidence: CandidateEvidence = {
      id: 'ev_react_ts',
      claim: 'Architected large-scale enterprise dashboard in React and TypeScript serving 100k daily active users',
      topic: 'Frontend Architecture',
      sourceType: 'resume',
      sourceId: 'bullet_1',
      confidence: 1.0,
      status: 'verified',
      metrics: [{ value: '100k', type: 'volume' }],
      skills: ['React', 'TypeScript', 'Frontend'],
      verifiedAt: Date.now(),
    };

    const { score } = service.calculateRelevance(requirement, evidence);
    expect(score).toBeGreaterThanOrEqual(0.75);

    const strength = service.determineStrength(score, [
      {
        evidenceId: evidence.id,
        claim: evidence.claim,
        sourceType: evidence.sourceType,
        sourceId: evidence.sourceId,
        relevanceScore: score,
        metrics: evidence.metrics,
      },
    ]);
    expect(strength).toBe('strong');

    const { action } = service.determineAction(requirement, strength, []);
    expect(action).toBe('keep');
  });

  // 2. Moderate Match (e.g. Design Systems vs Component Library)
  it('identifies moderate evidence match (e.g. component library for design system) and recommends "emphasize"', () => {
    const requirement: JobRequirement = {
      id: 'req_design_system',
      category: 'technical_architecture',
      text: 'Experience creating and scaling cross-platform Design Systems',
      importance: 'must_have',
      weight: 1.0,
      origin: 'explicit_jd_requirement',
      keywords: ['Design System', 'Figma', 'Components'],
      acceptableEvidencePatterns: ['building design systems and reusable components'],
    };

    const evidence: CandidateEvidence = {
      id: 'ev_comp_lib',
      claim: 'Built reusable component library in Figma and Storybook adopted by 12 frontend engineers',
      topic: 'Component Library',
      sourceType: 'resume',
      sourceId: 'bullet_12',
      confidence: 1.0,
      status: 'verified',
      metrics: [{ value: '12', type: 'headcount' }],
      skills: ['Figma', 'Storybook', 'UI Components'],
      verifiedAt: Date.now(),
    };

    const { score } = service.calculateRelevance(requirement, evidence);
    expect(score).toBeGreaterThanOrEqual(0.45);
    expect(score).toBeLessThan(0.85);

    const strength = service.determineStrength(score, [
      {
        evidenceId: evidence.id,
        claim: evidence.claim,
        sourceType: evidence.sourceType,
        sourceId: evidence.sourceId,
        relevanceScore: score,
        metrics: evidence.metrics,
      },
    ]);
    expect(strength).toBe('moderate');

    const { action } = service.determineAction(requirement, strength, [
      {
        evidenceId: evidence.id,
        claim: evidence.claim,
        sourceType: evidence.sourceType,
        sourceId: evidence.sourceId,
        relevanceScore: score,
        metrics: evidence.metrics,
      },
    ]);
    expect(action).toBe('emphasize');
  });

  // 3. Weak Match (e.g. Brief mention without metrics/outcomes)
  it('identifies weak evidence and recommends "rewrite" with impact framing', () => {
    const requirement: JobRequirement = {
      id: 'req_growth_testing',
      category: 'responsibility',
      text: 'Lead A/B testing growth experimentation to drive measurable user acquisition and conversion metrics',
      importance: 'must_have',
      weight: 1.0,
      origin: 'explicit_jd_requirement',
      keywords: ['A/B Testing', 'Experimentation', 'Conversion', 'Acquisition'],
      acceptableEvidencePatterns: ['running A/B tests with conversion outcomes'],
    };

    // Candidate has only a casual unquantified bullet
    const evidence: CandidateEvidence = {
      id: 'ev_testing_casual',
      claim: 'Helped team set up basic testing experiments on landing page',
      topic: 'Testing',
      sourceType: 'resume',
      sourceId: 'bullet_old',
      confidence: 1.0,
      status: 'verified',
      metrics: [],
      skills: ['Testing'],
      verifiedAt: Date.now(),
    };

    const { score } = service.calculateRelevance(requirement, evidence);
    const strength = service.determineStrength(score, [
      {
        evidenceId: evidence.id,
        claim: evidence.claim,
        sourceType: evidence.sourceType,
        sourceId: evidence.sourceId,
        relevanceScore: score,
        metrics: evidence.metrics,
      },
    ]);
    expect(strength).toBe('weak');

    const { action } = service.determineAction(requirement, strength, []);
    expect(action).toBe('rewrite');
  });

  // 4. Missing Requirement (Candidate Question Prompt)
  it('identifies missing required skill/duty and recommends "ask_question"', () => {
    const requirement: JobRequirement = {
      id: 'req_team_lead',
      category: 'leadership_management',
      text: 'Experience managing and mentoring a team of engineers',
      importance: 'must_have',
      weight: 1.0,
      origin: 'explicit_jd_requirement',
      keywords: ['Managing', 'Team', 'Mentoring', 'Leadership'],
      acceptableEvidencePatterns: ['direct people management', 'mentoring developers'],
    };

    // Candidate evidence has zero leadership claims
    const strength = service.determineStrength(0, []);
    expect(strength).toBe('missing');

    const { action } = service.determineAction(requirement, strength, []);
    expect(action).toBe('ask_question');
  });

  // 5. Missing Hard Requirement (Do Not Claim)
  it('identifies missing hard non-negotiable credential and recommends "do_not_claim"', () => {
    const requirement: JobRequirement = {
      id: 'req_phd',
      category: 'education',
      text: 'PhD in Quantum Physics or Doctorate in Applied Mathematics required',
      importance: 'must_have',
      weight: 1.0,
      origin: 'explicit_jd_requirement',
      keywords: ['PhD', 'Doctorate', 'Quantum Physics'],
      acceptableEvidencePatterns: ['Doctorate degree transcript'],
    };

    const strength = service.determineStrength(0, []);
    expect(strength).toBe('missing');

    const { action } = service.determineAction(requirement, strength, []);
    expect(action).toBe('do_not_claim');
  });

  // 6. Comprehensive Multi-Requirement Evidence Matrix Generation
  it('generates a full Evidence Matrix with breakdown counters, gaps, and weighted match score', () => {
    const mockJob: JobDescription = {
      id: 'job_lead_designer',
      title: 'Lead Product Designer',
      company: 'Figma',
      location: 'San Francisco, CA',
      remoteStatus: 'hybrid',
      rawText: 'Lead Product Designer job description...',
      seniority: 'lead',
      domain: 'Design Tools',
      requirements: [
        {
          id: 'req_1',
          category: 'tool',
          text: 'Expertise in Figma design systems and auto-layout',
          importance: 'must_have',
          weight: 1.0,
          origin: 'explicit_jd_requirement',
          keywords: ['Figma', 'Design Systems', 'Auto-layout'],
          acceptableEvidencePatterns: ['Figma design systems'],
        },
        {
          id: 'req_2',
          category: 'cross_functional_collaboration',
          text: 'Partner closely with engineering and product managers on specifications',
          importance: 'must_have',
          weight: 1.0,
          origin: 'explicit_jd_requirement',
          keywords: ['Partner', 'Engineering', 'Product Managers', 'Specifications'],
          acceptableEvidencePatterns: ['cross-functional collaboration'],
        },
        {
          id: 'req_3',
          category: 'leadership_management',
          text: 'Direct team leadership and designer mentoring experience',
          importance: 'should_have',
          weight: 0.7,
          origin: 'explicit_jd_requirement',
          keywords: ['Leadership', 'Mentoring', 'Team'],
          acceptableEvidencePatterns: ['mentoring designers'],
        },
      ],
      requiredSkills: ['Figma', 'Design Systems'],
      preferredSkills: ['Leadership'],
      responsibilities: ['Architect design systems', 'Partner with engineering'],
      experienceRequirements: ['5+ years in product design'],
      tools: ['Figma', 'Storybook'],
      education: ['BS in Design or related field'],
      domainKnowledge: ['SaaS Design'],
      softSkills: ['Collaboration'],
      keywords: ['Design System', 'Figma', 'Collaboration'],
      keyPhrases: ['cross-functional specifications'],
      hiringSignals: ['Scaling core product platform'],
      hiringSignalInsights: [],
      parsedAt: Date.now(),
    };

    const candidateEvidence: CandidateEvidence[] = [
      {
        id: 'ev_1',
        claim: 'Architected complete Figma design system with 200+ auto-layout components for 40 designers',
        topic: 'Design Systems',
        sourceType: 'resume',
        sourceId: 'bullet_1',
        confidence: 1.0,
        status: 'verified',
        metrics: [{ value: '200+', type: 'volume' }, { value: '40', type: 'headcount' }],
        skills: ['Figma', 'Design Systems', 'Auto-layout'],
        verifiedAt: Date.now(),
      },
      {
        id: 'ev_2',
        claim: 'Partnered with 8 engineering leads and product managers to deliver design handoffs',
        topic: 'Collaboration',
        sourceType: 'resume',
        sourceId: 'bullet_2',
        confidence: 1.0,
        status: 'verified',
        metrics: [{ value: '8', type: 'headcount' }],
        skills: ['Cross-functional Collaboration'],
        verifiedAt: Date.now(),
      },
    ];

    const matrix = service.generateEvidenceMatrix(mockJob, candidateEvidence, 'cand_123');

    expect(matrix.jobTitle).toBe('Lead Product Designer');
    expect(matrix.overallMatchScore).toBeGreaterThan(60);
    expect(matrix.coverageBreakdown.totalRequirements).toBe(3);
    expect(matrix.coverageBreakdown.strongCount).toBeGreaterThanOrEqual(1);
    expect(matrix.coverageBreakdown.missingCount).toBe(1); // req_3 leadership is missing
    expect(matrix.recommendedQuestions.length).toBeGreaterThan(0);
    expect(matrix.keyStrengths.length).toBeGreaterThan(0);

    // Verify strict Zod schema validation
    const valid = EvidenceMatrixSchema.safeParse(matrix);
    expect(valid.success).toBe(true);
  });
});
