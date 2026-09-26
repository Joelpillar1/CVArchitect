import { describe, it, expect, beforeEach } from 'vitest';
import {
  CandidateEvidenceService,
  extractNumericTokens,
} from '../services/candidateEvidenceService';
import { INITIAL_DATA, type ResumeData } from '../types';

describe('Phase 3: Candidate Evidence Engine & Provenance', () => {
  let service: CandidateEvidenceService;

  beforeEach(() => {
    service = new CandidateEvidenceService();
  });

  // 1. Evidence Extraction & Retrieval
  it('extracts structured candidate evidence from a Resume snapshot with source: "resume"', () => {
    const resumeFixture: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Sarah Connor',
      jobTitle: 'Principal Security Architect',
      summary: 'Cybersecurity leader with 10 years defending distributed cloud networks.',
      skills: 'AWS, Kubernetes, Zero Trust, Python, Rust',
      experience: [
        {
          id: 'exp_cyber',
          company: 'Cyberdyne Systems',
          role: 'Lead Security Engineer',
          startDate: '2020-01',
          endDate: 'Present',
          description: [
            'Built Zero Trust architecture protecting 50,000 corporate endpoints',
            'Led incident response team of 8 security engineers',
          ],
        },
      ],
      education: [
        {
          id: 'edu_mit',
          school: 'MIT',
          degree: 'BS Computer Science',
          year: '2019',
        },
      ],
    };

    const evidenceList = service.extractEvidenceFromResume(resumeFixture, 'cand_sarah');
    expect(evidenceList.length).toBeGreaterThan(3);

    const endpointClaim = evidenceList.find((e) => e.claim.includes('50,000'));
    expect(endpointClaim).toBeDefined();
    expect(endpointClaim?.sourceType).toBe('resume');
    expect(endpointClaim?.status).toBe('verified');
    expect(endpointClaim?.confidence).toBe(1.0);
    expect(endpointClaim?.relatedResumeItemId).toBe('exp_cyber');

    // Test retrieval helpers
    const expEvidence = service.getEvidenceForResumeItem('exp_cyber');
    expect(expEvidence.length).toBeGreaterThanOrEqual(2);

    const searchResults = service.searchCandidateEvidence('Zero Trust', 'cand_sarah');
    expect(searchResults.length).toBeGreaterThanOrEqual(1);
  });

  // 2. Explicit Candidate Answer Input
  it('records explicit candidate answers with verified provenance', () => {
    const evidence = service.addCandidateEvidence({
      candidateId: 'cand_sarah',
      claim: 'Reduced infrastructure costs by 28% through autoscaling optimization',
      context: 'Q3 AWS Cost Reduction Project',
      topic: 'AWS Cloud Cost Optimization',
      sourceType: 'candidate_answer',
      sourceId: 'q_cost_reduction_metrics',
      status: 'verified',
    });

    expect(evidence.id).toBeDefined();
    expect(evidence.sourceType).toBe('candidate_answer');
    expect(evidence.status).toBe('verified');
    expect(evidence.metrics.some((m) => m.value.includes('28'))).toBe(true);

    const fetched = service.getEvidenceById(evidence.id);
    expect(fetched?.claim).toContain('28%');
  });

  // 3. Valid Grounded Claim Approval
  it('approves a rewritten bullet when the claim and metrics are grounded in evidence', () => {
    // Seed verified evidence
    service.addCandidateEvidence({
      candidateId: 'cand_sarah',
      claim: 'Engineered payment retry mechanism, reducing failed transactions by 24%',
      topic: 'Payment Reliability',
      sourceType: 'candidate_answer',
      sourceId: 'q_payment_reliability',
      status: 'verified',
    });

    const rewriteClaim = 'Spearheaded automated payment retry framework, reducing transaction failure rates by 24%';
    const validation = service.validateClaimAgainstEvidence(rewriteClaim);

    expect(validation.isValid).toBe(true);
    expect(validation.status).toBe('approved');
    expect(validation.code).toBe('valid');
    expect(validation.matchedEvidenceIds.length).toBeGreaterThan(0);
  });

  // 4. Unsupported Metrics Rejection (e.g. 35% without evidence)
  it('strictly REJECTS ungrounded metric claims when no evidence exists', () => {
    // Verified evidence only has 10%
    service.addCandidateEvidence({
      candidateId: 'cand_sarah',
      claim: 'Improved API latency by 10% in legacy service',
      topic: 'Latency',
      sourceType: 'resume',
      sourceId: 'bullet_1',
      status: 'verified',
    });

    // AI attempts to invent "Reduced costs by 35%"
    const hallucinatedClaim = 'Architected cloud caching infrastructure, reducing operational costs by 35%';
    const validation = service.validateClaimAgainstEvidence(hallucinatedClaim);

    expect(validation.isValid).toBe(false);
    expect(validation.status).toBe('rejected');
    expect(validation.code).toBe('unsupported_metric');
    expect(validation.missingEvidenceDetails?.ungroundedMetrics).toContain('35');
    expect(validation.reasons.some((r) => r.includes('Ungrounded metric'))).toBe(true);
  });

  // 5. Missing Evidence Rejection (Claim with no grounding)
  it('strictly REJECTS claims with zero backing in candidate history', () => {
    const ungroundedClaim = 'Led international aerospace rocket navigation telemetry department at NASA';
    const validation = service.validateClaimAgainstEvidence(ungroundedClaim);

    expect(validation.isValid).toBe(false);
    expect(validation.status).toBe('rejected');
    expect(validation.code).toBe('missing_evidence');
  });

  // 6. Conflicting Evidence Detection
  it('detects and REJECTS claims that directly conflict with candidate evidence', () => {
    // Candidate confirmed in evidence: "team of 4 engineers"
    service.addCandidateEvidence({
      candidateId: 'cand_sarah',
      claim: 'Directly managed an engineering team of 4 software developers',
      topic: 'Team Size',
      sourceType: 'candidate_answer',
      sourceId: 'q_team_size',
      status: 'verified',
    });

    // AI generates: "Directed high-performing team of 20 software developers"
    const conflictingClaim = 'Spearheaded agile delivery while managing a team of 20 software developers';
    const validation = service.validateClaimAgainstEvidence(conflictingClaim);

    expect(validation.isValid).toBe(false);
    expect(validation.status).toBe('rejected');
    expect(validation.code).toBe('conflicting_evidence');
    expect(validation.missingEvidenceDetails?.conflictingClaims?.length).toBeGreaterThan(0);
    expect(validation.reasons.some((r) => r.includes('Conflicting claim'))).toBe(true);
  });

  // 7. Numeric Token Extraction
  it('extracts and normalizes numeric tokens accurately', () => {
    const tokens = extractNumericTokens('Grew revenue from $1,200,000 to $3,500,000 (+42.5%) across 15,000 customers');
    expect(tokens).toContain('1200000');
    expect(tokens).toContain('3500000');
    expect(tokens).toContain('42.5');
    expect(tokens).toContain('15000');
  });
});
