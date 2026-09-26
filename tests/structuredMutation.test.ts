import { describe, it, expect, beforeEach } from 'vitest';
import { StructuredMutationService } from '../services/structuredMutationService';
import { CandidateEvidenceService } from '../services/candidateEvidenceService';
import {
  ResumeContract,
  resumeDataToStructured,
  StructuredResumeOperation,
} from '../types/agentContract';
import { INITIAL_DATA, type ResumeData } from '../types';

describe('Phase 7: Structured Resume Mutation Engine', () => {
  let mutationService: StructuredMutationService;
  let evidenceService: CandidateEvidenceService;
  let baseResume: ResumeContract;

  beforeEach(() => {
    mutationService = new StructuredMutationService();
    evidenceService = new CandidateEvidenceService();

    const legacyData: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'David Hassel',
      jobTitle: 'Senior Frontend Architect',
      summary: 'Frontend developer with 6 years experience building modern web apps.',
      skills: 'TypeScript, React, CSS, GraphQL',
      experience: [
        {
          id: 'exp_stripe',
          company: 'Stripe',
          role: 'Senior Engineer',
          startDate: '2021',
          endDate: 'Present',
          description: [
            'Built internal payment review dashboards using React',
            'Collaborated with design team on component library',
          ],
        },
      ],
      education: [
        {
          id: 'edu_ucb',
          school: 'UC Berkeley',
          degree: 'BS Computer Science',
          year: '2019',
        },
      ],
      projects: [
        {
          id: 'proj_oss',
          name: 'FastForm OSS',
          description: 'High-performance React form state library',
        },
      ],
    };

    baseResume = resumeDataToStructured(legacyData);
    // Seed initial evidence
    evidenceService.extractEvidenceFromResume(legacyData, 'cand_david');
  });

  // 1. replace_bullet
  it('replaces a targeted bullet point and updates both structured and renderable resume models', () => {
    const targetBulletId = baseResume.experience[0].bullets[0].id;

    // Seed verified evidence for the new claim
    const newBulletText = 'Architected real-time payment triage dashboard with React, serving 5,000 operators';
    evidenceService.addCandidateEvidence({
      candidateId: 'cand_david',
      claim: newBulletText,
      sourceType: 'candidate_answer',
      sourceId: 'q_triage_dashboard',
      status: 'verified',
    });

    const op: StructuredResumeOperation = {
      operation: 'replace_bullet',
      targetId: targetBulletId,
      newContent: newBulletText,
      reason: 'Adds operator scale and strengthens action verb.',
      evidenceIds: ['ev_triage_123'],
    };

    const res = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: op,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(res.success).toBe(true);
    expect(res.updatedContract?.experience[0].bullets[0].text).toBe(newBulletText);
    expect(res.updatedContract?.experience[0].bullets[0].evidenceReferences).toContain('ev_triage_123');

    // Renderable ResumeData check
    const expDesc = res.updatedResumeData?.experience[0].description as string[];
    expect(expDesc[0]).toBe(newBulletText);
  });

  // 2. add_bullet
  it('adds a new bullet point to target experience item', () => {
    const newBulletText = 'Led migration of legacy components to Tailwind CSS';
    evidenceService.addCandidateEvidence({
      candidateId: 'cand_david',
      claim: newBulletText,
      sourceType: 'candidate_answer',
      sourceId: 'q_tailwind_migration',
      status: 'verified',
    });

    const op: StructuredResumeOperation = {
      operation: 'add_bullet',
      targetId: 'exp_stripe',
      newContent: newBulletText,
      reason: 'Demonstrates modern styling and refactoring capability.',
    };

    const res = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: op,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(res.success).toBe(true);
    expect(res.updatedContract?.experience[0].bullets.length).toBe(3);
    expect(res.updatedContract?.experience[0].bullets[2].text).toBe(newBulletText);
  });

  // 3. remove_bullet
  it('removes a target bullet point cleanly', () => {
    const targetBulletId = baseResume.experience[0].bullets[1].id;

    const op: StructuredResumeOperation = {
      operation: 'remove_bullet',
      targetId: targetBulletId,
      reason: 'Removes redundant bullet point.',
    };

    const res = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: op,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(res.success).toBe(true);
    expect(res.updatedContract?.experience[0].bullets.length).toBe(1);
    expect(res.updatedContract?.experience[0].bullets[0].id).not.toBe(targetBulletId);
  });

  // 4. replace_summary
  it('replaces the professional summary and activates visibility', () => {
    const newSummary = 'Senior Frontend Architect with 6 years leading enterprise design systems and high-throughput web applications.';
    evidenceService.addCandidateEvidence({
      candidateId: 'cand_david',
      claim: newSummary,
      sourceType: 'candidate_answer',
      sourceId: 'q_summary_refine',
      status: 'verified',
    });

    const op: StructuredResumeOperation = {
      operation: 'replace_summary',
      targetId: 'summary',
      newContent: newSummary,
      reason: 'Position candidate as Senior Architect aligned with target job.',
    };

    const res = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: op,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(res.success).toBe(true);
    expect(res.updatedContract?.candidate.summary).toBe(newSummary);
    expect(res.updatedResumeData?.summary).toBe(newSummary);
  });

  // 5. add_skill & remove_skill
  it('adds and removes skills with automatic sync to raw skills string', () => {
    const addOp: StructuredResumeOperation = {
      operation: 'add_skill',
      targetId: 'skills',
      newContent: 'Next.js',
      reason: 'Key framework requirement for target role.',
      category: 'framework',
    };

    const resAdd = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: addOp,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(resAdd.success).toBe(true);
    expect(resAdd.updatedContract?.skills.some((s) => s.name === 'Next.js')).toBe(true);
    expect(resAdd.updatedResumeData?.skills).toContain('Next.js');

    const removeOp: StructuredResumeOperation = {
      operation: 'remove_skill',
      targetId: 'CSS',
      reason: 'Consolidate basic skill tags.',
    };

    const resRemove = mutationService.applyStructuredOperation({
      resume: resAdd.updatedContract!,
      operation: removeOp,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(resRemove.success).toBe(true);
    expect(resRemove.updatedContract?.skills.some((s) => s.name === 'CSS')).toBe(false);
  });

  // 6. reorder_skills & reorder_section
  it('reorders skills and resume sections accurately', () => {
    const reorderSkillsOp: StructuredResumeOperation = {
      operation: 'reorder_skills',
      targetId: 'skills',
      newContent: ['GraphQL', 'React', 'TypeScript'],
      reason: 'Highlight backend API skills first.',
    };

    const resSkills = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: reorderSkillsOp,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(resSkills.success).toBe(true);
    expect(resSkills.updatedContract?.skills[0].name).toBe('GraphQL');

    const reorderSecOp: StructuredResumeOperation = {
      operation: 'reorder_section',
      targetId: 'sections',
      newContent: ['skills', 'experience', 'education', 'projects'],
      reason: 'Lead with technical skills overview.',
    };

    const resSec = mutationService.applyStructuredOperation({
      resume: resSkills.updatedContract!,
      operation: reorderSecOp,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(resSec.success).toBe(true);
    expect(resSec.updatedContract?.sections[0].type).toBe('skills');
  });

  // 7. update_project & update_education
  it('updates project and education fields deterministically', () => {
    const projOp: StructuredResumeOperation = {
      operation: 'update_project',
      targetId: 'proj_oss',
      newContent: {
        technologies: 'React, TypeScript, Rollup',
        link: 'https://github.com/david/fastform',
      },
      reason: 'Add technologies and live repository link.',
    };

    const resProj = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: projOp,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(resProj.success).toBe(true);
    expect(resProj.updatedContract?.projects[0].technologies).toBe('React, TypeScript, Rollup');

    const eduOp: StructuredResumeOperation = {
      operation: 'update_education',
      targetId: 'edu_ucb',
      newContent: { gpa: '3.9', honors: 'Dean\'s Honor List' },
      reason: 'Add academic honors.',
    };

    const resEdu = mutationService.applyStructuredOperation({
      resume: resProj.updatedContract!,
      operation: eduOp,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(resEdu.success).toBe(true);
    expect(resEdu.updatedContract?.education[0].gpa).toBe('3.9');
  });

  // 8. Target Not Found Rejection (Safe No-Op)
  it('rejects operation when target ID is missing without altering resume', () => {
    const op: StructuredResumeOperation = {
      operation: 'replace_bullet',
      targetId: 'non_existent_bullet_999',
      newContent: 'Some text',
      reason: 'Invalid target test',
    };

    const res = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: op,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(res.success).toBe(false);
    expect(res.code).toBe('target_not_found');
    expect(res.updatedContract).toBeUndefined();
  });

  // 9. Ungrounded Metric Claim Rejection
  it('strictly REJECTS ungrounded numerical metric hallucinations and aborts mutation', () => {
    const targetBulletId = baseResume.experience[0].bullets[0].id;

    // AI attempts to invent "45% performance boost" without candidate evidence
    const hallucinatedContent = 'Optimized payment rendering engine resulting in 45% boost in client performance';

    const op: StructuredResumeOperation = {
      operation: 'replace_bullet',
      targetId: targetBulletId,
      newContent: hallucinatedContent,
      reason: 'Fabricated metric test',
    };

    const res = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: op,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(res.success).toBe(false);
    expect(res.code).toBe('unsupported_metric');
    expect(res.error).toContain('Ungrounded metric(s)');
    expect(res.updatedContract).toBeUndefined();

    // Verify original bullet is unchanged
    expect(baseResume.experience[0].bullets[0].text).toContain('Built internal payment review dashboards');
  });

  // 10. Snapshot History & Rollback Protection
  it('creates version snapshots on each mutation and supports instantaneous rollback', () => {
    const targetBulletId = baseResume.experience[0].bullets[0].id;
    const initialText = baseResume.experience[0].bullets[0].text;

    evidenceService.addCandidateEvidence({
      candidateId: 'cand_david',
      claim: 'Upgraded payment gateway',
      sourceType: 'candidate_answer',
      sourceId: 'q_test',
      status: 'verified',
    });

    const op1: StructuredResumeOperation = {
      operation: 'replace_bullet',
      targetId: targetBulletId,
      newContent: 'Upgraded payment gateway',
      reason: 'First mutation',
    };

    const res1 = mutationService.applyStructuredOperation({
      resume: baseResume,
      operation: op1,
      evidenceService,
      candidateId: 'cand_david',
    });

    expect(res1.success).toBe(true);
    expect(res1.snapshotId).toBeDefined();

    const history = mutationService.getSnapshotHistory('cand_david');
    expect(history.length).toBeGreaterThanOrEqual(1);

    // Rollback to version snapshot
    const restored = mutationService.restoreSnapshot('cand_david', res1.updatedContract!.version);
    expect(restored?.experience[0].bullets[0].text).toBe('Upgraded payment gateway');
  });
});
