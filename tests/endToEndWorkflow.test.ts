import { describe, it, expect, beforeEach } from 'vitest';
import { CVArchitectOrchestrator } from '../services/cvArchitectOrchestrator';
import { INITIAL_DATA, type ResumeData } from '../types';
import { AgentStreamEvent } from '../types/agentEvents';
import type { ResumeOperation } from '../types/resumeOperations';

describe('Complete CVArchitect End-to-End Workflow (Phases 1-10)', () => {
  let orchestrator: CVArchitectOrchestrator;

  beforeEach(() => {
    orchestrator = new CVArchitectOrchestrator();
  });

  const realisticResume: ResumeData = {
    ...INITIAL_DATA,
    fullName: 'Marcus Brody',
    jobTitle: 'Senior Full Stack Engineer',
    summary: 'Senior software engineer with 6 years building distributed cloud applications and frontend architectures.',
    skills: 'TypeScript, React, Node.js, AWS, PostgreSQL, Docker, GraphQL',
    experience: [
      {
        id: 'exp_fintech',
        company: 'PayFlow Systems',
        role: 'Senior Backend Engineer',
        startDate: '2021-03',
        endDate: 'Present',
        description: [
          'Engineered real-time transaction processing pipeline with Node.js and PostgreSQL handling 25,000 TPS',
          'Responsible for developing partner payment integrations', // Passive verb for critic to catch and fix
        ],
      },
      {
        id: 'exp_agency',
        company: 'DevCraft Labs',
        role: 'Full Stack Developer',
        startDate: '2018-06',
        endDate: '2021-02',
        description: [
          'Built responsive customer checkout dashboards in React and TypeScript',
        ],
      },
    ],
    education: [
      {
        id: 'edu_1',
        school: 'University of Michigan',
        degree: 'BS Computer Science',
        year: '2018',
      },
    ],
  };

  const realisticJobPosting = `
    Staff Software Engineer — Distributed Infrastructure
    Stripe | San Francisco, CA | Hybrid
    
    About Stripe:
    Stripe is building economic infrastructure for the internet.
    
    Key Responsibilities:
    • Architect high-throughput distributed transaction state machines handling massive scale
    • Lead cross-functional engineering initiatives and mentor mid-level software engineers
    • Drive zero-downtime database migrations on PostgreSQL and AWS infrastructure
    
    Must-Have Requirements:
    • 5+ years building distributed backend services in TypeScript or Go
    • Proven experience with PostgreSQL, AWS cloud services, and Docker containers
    • Demonstrated technical leadership and cross-functional project delivery
  `;

  it('runs complete 19-step workflow from upload through job intelligence, evidence matrix, questions, live mutations, and final critic evaluation', async () => {
    const emittedProgress: AgentStreamEvent[] = [];
    const emittedOperations: ResumeOperation[] = [];

    const result = await orchestrator.executeWorkflow({
      resume: realisticResume,
      jobInput: { rawText: realisticJobPosting },
      candidateAnswers: [
        {
          requirement: 'Technical leadership and mentoring',
          answerText: 'Led sprint delivery for team of 5 backend engineers and mentored 2 junior developers through promotion.',
        },
      ],
      candidateId: 'cand_marcus',
      onProgress: (ev) => emittedProgress.push(ev),
      onOperation: (op) => emittedOperations.push(op),
    });

    expect(result.success).toBe(true);

    // 1. Verify Job Intelligence
    expect(result.jobData.title).toContain('Staff Software Engineer');
    expect(result.jobData.requirements.length).toBeGreaterThan(0);

    // 2. Verify Evidence Matrix
    expect(result.initialMatrix.overallMatchScore).toBeGreaterThan(50);
    expect(result.updatedMatrix.overallMatchScore).toBeGreaterThanOrEqual(result.initialMatrix.overallMatchScore);

    // 3. Verify Progress Events Streamed
    const eventTypes = emittedProgress.map((e) => e.type);
    expect(eventTypes).toContain('agent_started');
    expect(eventTypes).toContain('resume_analysis_completed');
    expect(eventTypes).toContain('job_analysis_completed');
    expect(eventTypes).toContain('mapping_completed');
    expect(eventTypes).toContain('tailoring_started');
    expect(eventTypes).toContain('ats_check_completed');
    expect(eventTypes).toContain('critic_completed');
    expect(eventTypes).toContain('agent_completed');

    // 4. Verify Structured Operations Applied Live
    expect(result.appliedOperations.length).toBeGreaterThan(0);

    // 5. Verify Final Critic & 11-Dimension Evaluation
    expect(result.finalEvaluation.overallScore).toBeGreaterThanOrEqual(75);
    expect(result.finalEvaluation.dimensions.jobAlignment).toBeDefined();
    expect(result.finalEvaluation.dimensions.factualAccuracy).toBe(100);

    // 6. Verify Passive Verb Was Cleaned
    const finalDesc = result.finalResumeData.experience[0].description as string[];
    expect(finalDesc.some((d) => /^Engineered|^Delivered|^Architected/i.test(d))).toBe(true);
    expect(finalDesc.some((d) => /^Responsible for/i.test(d))).toBe(false);

    // 7. Verify Renderable ResumeData is 100% template-compatible
    expect(result.finalResumeData.fullName).toBe('Marcus Brody');
    expect(result.finalResumeData.experience.length).toBe(2);
  });
});
