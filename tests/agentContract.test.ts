import { describe, it, expect } from 'vitest';
import {
  ResumeSchema,
  ResumeSectionSchema,
  ExperienceSchema,
  ResumeBulletSchema,
  CandidateSchema,
  SkillSchema,
  EducationSchema,
  ProjectSchema,
  CertificationSchema,
  JobDescriptionSchema,
  JobRequirementSchema,
  CandidateEvidenceSchema,
  EvidenceMatchSchema,
  QuestionSchema,
  ResumeOperationSchema,
  EvaluationSchema,
  CriticFindingSchema,
  parseBulletToStructured,
  resumeDataToStructured,
  structuredToResumeData,
} from '../types/agentContract';
import { INITIAL_DATA, type ResumeData } from '../types';

describe('Phase 2: Agent Structured Data Contracts', () => {
  // 1. ResumeBulletSchema
  it('validates a complete decomposed bullet with metrics and evidence references', () => {
    const bullet = {
      id: 'bullet_1',
      text: 'Spearheaded payment pipeline redesign using TypeScript and Redis, reducing latency by 45%',
      action: 'Spearheaded',
      responsibility: 'Payment pipeline redesign',
      skill: 'Distributed Systems',
      tools: ['TypeScript', 'Redis'],
      metric: {
        value: '45%',
        type: 'percentage' as const,
        isVerified: true,
      },
      outcome: 'Reduced latency across all checkout endpoints',
      scope: 'Global checkout infrastructure',
      evidenceReferences: ['ev_claim_123'],
    };

    const parsed = ResumeBulletSchema.safeParse(bullet);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.action).toBe('Spearheaded');
      expect(parsed.data.metric?.value).toBe('45%');
      expect(parsed.data.metric?.isVerified).toBe(true);
      expect(parsed.data.evidenceReferences).toContain('ev_claim_123');
    }
  });

  it('correctly decomposes raw bullet text into structured components', () => {
    const bullet = parseBulletToStructured(
      'Engineered real-time data streaming pipeline for 100,000+ users using Kafka',
      'bullet_test'
    );
    expect(bullet.id).toBe('bullet_test');
    expect(bullet.action).toBe('Engineered');
    expect(bullet.metric?.value).toContain('100,000+');
    expect(bullet.metric?.type).toBe('volume');
  });

  // 2. CandidateEvidenceSchema (Provenance & Verification Rules)
  it('strictly validates candidate evidence with source provenance', () => {
    const validEvidence = {
      id: 'ev_001',
      candidateId: 'cand_1',
      claim: 'Grew activation rate by 24% in Q3',
      context: 'Onboarding user experience redesign',
      topic: 'Activation Metric',
      metrics: [{ value: '24%', unit: '%', category: 'activation' }],
      source: 'candidate_answer' as const,
      sourceId: 'q_onboarding_activation',
      status: 'verified' as const,
      notes: 'Confirmed by user in clarifying question turn',
    };

    const parseResult = CandidateEvidenceSchema.safeParse(validEvidence);
    expect(parseResult.success).toBe(true);
  });

  it('rejects invalid evidence source', () => {
    const invalidEvidence = {
      id: 'ev_fake',
      claim: 'Invented statistic',
      topic: 'Fake',
      source: 'ai_hallucination', // Invalid enum
      sourceId: 'none',
      status: 'verified',
    };

    const parseResult = CandidateEvidenceSchema.safeParse(invalidEvidence);
    expect(parseResult.success).toBe(false);
  });

  // 3. JobDescriptionSchema & JobRequirementSchema
  it('validates rich job description with categorized requirements', () => {
    const jd = {
      id: 'job_senior_pm',
      title: 'Senior Product Manager',
      company: 'Stripe',
      location: 'San Francisco, CA',
      remoteStatus: 'hybrid' as const,
      seniority: 'senior' as const,
      domain: 'Fintech',
      requirements: [
        {
          id: 'req_1',
          category: 'required_skill' as const,
          text: '5+ years experience running quantitative A/B testing',
          importance: 'must_have' as const,
          keywords: ['A/B Testing', 'Experimentation'],
          minYears: 5,
        },
        {
          id: 'req_2',
          category: 'tool' as const,
          text: 'Proficiency with SQL, Amplitude, and Figma',
          importance: 'must_have' as const,
          keywords: ['SQL', 'Amplitude', 'Figma'],
        },
      ],
      requiredSkills: ['SQL', 'A/B Testing', 'Product Analytics'],
      preferredSkills: ['Python', 'GraphQL'],
      responsibilities: ['Lead experimentation roadmap', 'Drive growth metrics'],
      experienceRequirements: ['5+ years in high-growth B2B SaaS'],
      tools: ['SQL', 'Amplitude', 'Figma', 'Jira'],
      education: ['BS in Computer Science, Economics, or equivalent practical experience'],
      domainKnowledge: ['Payments', 'Billing APIs', 'SaaS Onboarding'],
      softSkills: ['Stakeholder alignment', 'Cross-functional leadership'],
      keywords: ['Fintech', 'SaaS', 'Retention', 'Activation'],
      hiringSignals: ['Scaling international checkout platform'],
    };

    const parsed = JobDescriptionSchema.safeParse(jd);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.domainKnowledge).toContain('Payments');
      expect(parsed.data.requirements.length).toBe(2);
    }
  });

  // 4. EvidenceMatchSchema & QuestionSchema
  it('validates evidence match and question schemas', () => {
    const match = {
      id: 'match_1',
      requirementId: 'req_1',
      evidenceId: 'ev_001',
      matchType: 'exact' as const,
      confidenceScore: 0.95,
      reasoning: 'Candidate directly achieved 24% activation lift matching the experimentation mandate',
    };
    expect(EvidenceMatchSchema.safeParse(match).success).toBe(true);

    const question = {
      id: 'q_1',
      targetRequirementId: 'req_2',
      question: 'Which specific tools did you use to track SQL queries at Acme?',
      category: 'clarify' as const,
      reason: 'The role requires Amplitude/SQL and your bullet mentions analytics generally',
      suggestedFactTopic: 'Analytics Stack at Acme',
      status: 'unanswered' as const,
    };
    expect(QuestionSchema.safeParse(question).success).toBe(true);
  });

  // 5. EvaluationSchema & CriticFindingSchema
  it('validates evaluation and critic findings', () => {
    const evalData = {
      id: 'eval_1',
      overallScore: 88,
      categoryScores: {
        skillsMatch: 90,
        experienceMatch: 85,
        quantificationScore: 92,
        atsCoverageScore: 88,
        brevityScore: 95,
        roleAlignmentScore: 86,
      },
      strengths: ['High quantification rate across experience bullets'],
      gaps: ['Missing Kubernetes keyword mentioned in JD'],
      topRecommendations: [
        {
          id: 'rec_1',
          title: 'Strengthen summary positioning for Fintech',
          description: 'Mention payment processing systems in opening summary hook',
          section: 'summary',
          expectedImpact: 'high' as const,
        },
      ],
      evaluatorVersion: 'v2',
    };
    expect(EvaluationSchema.safeParse(evalData).success).toBe(true);

    const critic = {
      id: 'critic_1',
      severity: 'critical' as const,
      type: 'ungrounded_metric' as const,
      message: 'Claimed 50% revenue boost without citation in candidate evidence',
      quote: 'Boosted revenue by 50%',
      suggestedFix: 'Clarify with candidate or remove ungrounded percentage',
    };
    expect(CriticFindingSchema.safeParse(critic).success).toBe(true);
  });

  // 6. ResumeSchema & Bidirectional Converters
  it('converts ResumeData to structured contract and back without loss', () => {
    const legacyData: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Marie Curie',
      jobTitle: 'Lead Research Scientist',
      summary: 'Experienced researcher in radiation physics and chemistry.',
      skills: 'Spectrometry, Python, LaTeX, Laboratory Management',
      experience: [
        {
          id: 'exp_1',
          company: 'Sorbonne University',
          role: 'Head of Laboratory',
          location: 'Paris, France',
          startDate: '1906-05',
          endDate: '1934-07',
          description: [
            'Directed multi-disciplinary research team of 15 physicists',
            'Published 20+ peer-reviewed papers advancing nuclear science',
          ],
        },
      ],
      education: [
        {
          id: 'edu_1',
          school: 'University of Paris',
          degree: 'Doctor of Science in Physics',
          year: '1903',
        },
      ],
    };

    // Forward conversion
    const structured = resumeDataToStructured(legacyData);
    const validStructured = ResumeSchema.safeParse(structured);
    expect(validStructured.success).toBe(true);

    if (validStructured.success) {
      expect(validStructured.data.candidate.fullName).toBe('Marie Curie');
      expect(validStructured.data.experience[0].bullets.length).toBe(2);
      expect(validStructured.data.skills.length).toBe(4);
      expect(validStructured.data.skills.map((s) => s.name)).toContain('Spectrometry');
    }

    // Backward conversion
    const roundTripped = structuredToResumeData(structured);
    expect(roundTripped.fullName).toBe('Marie Curie');
    expect(roundTripped.jobTitle).toBe('Lead Research Scientist');
    expect(roundTripped.experience[0].company).toBe('Sorbonne University');
    expect(Array.isArray(roundTripped.experience[0].description)).toBe(true);
    expect((roundTripped.experience[0].description as string[])[0]).toBe(
      'Directed multi-disciplinary research team of 15 physicists'
    );
  });
});
