import { describe, it, expect, beforeEach } from 'vitest';
import { ResumeCriticService, MAX_REVISIONS } from '../services/resumeCriticService';
import { CandidateEvidenceService } from '../services/candidateEvidenceService';
import {
  ResumeContract,
  resumeDataToStructured,
  JobDescription,
} from '../types/agentContract';
import { INITIAL_DATA, type ResumeData } from '../types';

describe('Phase 10: Resume Critic and Revision Loop', () => {
  let criticService: ResumeCriticService;
  let evidenceService: CandidateEvidenceService;

  beforeEach(() => {
    evidenceService = new CandidateEvidenceService();
    criticService = new ResumeCriticService(evidenceService);
  });

  it('evaluates resume across all 11 dimensions and catches passive verbs and formatting risks', () => {
    const legacyData: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Sarah Jenkins',
      jobTitle: 'Senior Cloud Architect',
      summary: 'Experienced **cloud architect** building *scalable* systems.', // Contains markdown symbols
      skills: 'AWS, Kubernetes, Terraform, Go, Docker',
      experience: [
        {
          id: 'exp_1',
          company: 'Acme Corp',
          role: 'Lead Architect',
          startDate: '2020',
          endDate: 'Present',
          description: [
            'Responsible for developing multi-region cloud infrastructure', // Weak passive opening
            'Engineered Kubernetes autoscaler reducing latency by 35%', // 35% is verified
          ],
        },
      ],
    };

    evidenceService.addCandidateEvidence({
      candidateId: 'cand_sarah',
      claim: 'Engineered Kubernetes autoscaler reducing latency by 35%',
      sourceType: 'resume',
      sourceId: 'bullet_2',
      status: 'verified',
    });

    const contract: ResumeContract = resumeDataToStructured(legacyData);
    const evaluation = criticService.evaluateResume(contract, null, undefined, 0);

    expect(evaluation.overallScore).toBeGreaterThan(0);
    expect(evaluation.dimensions.factualAccuracy).toBeDefined();
    expect(evaluation.dimensions.atsCompatibility).toBeDefined();
    expect(evaluation.dimensions.clarity).toBeDefined();
    expect(evaluation.findings.length).toBeGreaterThan(0);

    // Finding 1: Weak passive verb
    const weakVerbFinding = evaluation.findings.find((f) => f.category === 'weak_bullet');
    expect(weakVerbFinding).toBeDefined();
    expect(weakVerbFinding?.severity).toBe('high');
    expect(weakVerbFinding?.proposedCorrection).toBeDefined();

    // Finding 2: ATS markdown risk
    const atsRiskFinding = evaluation.findings.find((f) => f.category === 'ats_risk');
    expect(atsRiskFinding).toBeDefined();
    expect(atsRiskFinding?.severity).toBe('high');
  });

  it('catches fabricated metrics as critical severity', () => {
    const legacyData: ResumeData = {
      ...INITIAL_DATA,
      experience: [
        {
          id: 'exp_1',
          company: 'Fintech Corp',
          role: 'Engineer',
          startDate: '2021',
          endDate: '2023',
          description: ['Increased quarterly revenue by 85% with zero downtime'], // 85% is ungrounded
        },
      ],
    };

    const contract = resumeDataToStructured(legacyData);
    const evaluation = criticService.evaluateResume(contract, null, [], 0);

    const fabricatedFinding = evaluation.findings.find((f) => f.category === 'fabricated_metric');
    expect(fabricatedFinding).toBeDefined();
    expect(fabricatedFinding?.severity).toBe('critical');
    expect(evaluation.passedQualityThreshold).toBe(false);
  });

  it('runs the autonomous bounded revision loop and improves score within MAX_REVISIONS', () => {
    const legacyData: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Alex Vance',
      summary: 'Experienced **developer**.', // Markdown symbol
      experience: [
        {
          id: 'exp_1',
          company: 'Valve',
          role: 'Systems Engineer',
          startDate: '2020',
          endDate: 'Present',
          description: [
            'Responsible for developing physics simulation pipeline', // Passive opening with fix
          ],
        },
      ],
    };

    const contract = resumeDataToStructured(legacyData);
    const result = criticService.runRevisionLoop(contract, null, undefined, 'cand_alex');

    expect(result.isFinal).toBe(true);
    expect(result.totalIterations).toBeLessThanOrEqual(MAX_REVISIONS);
    expect(result.appliedCorrections.length).toBeGreaterThan(0);

    // Verify passive opening was corrected
    const updatedDesc = result.finalResumeData.experience[0].description as string[];
    expect(updatedDesc[0]).toContain('Engineered physics simulation pipeline');
  });
});
