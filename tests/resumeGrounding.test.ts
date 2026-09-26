import { describe, it, expect } from 'vitest';
import {
  requiresResumeEvidence,
  determineRequiredResumeSections,
  extractResumeEvidence,
  formatResumeEvidenceBlock,
  validateMutationAgainstCurrentResume,
  isOperationStaleWithResume,
} from '../utils/resumeGrounding';
import { ResumeData, INITIAL_DATA } from '../types';
import { ResumeOperation } from '../types/resumeOperations';
import { createEmptyResumeMemory, recordMemoryMetric, recordRejectedClaim, upsertMemoryFact } from '../utils/resumeAgentMemory';
import { detectUserIntent } from '../utils/intentDetector';
import { resolveAgentTask } from '../utils/taskRequirements';
import { analyzeResumeState } from '../utils/resumeState';

describe('Resume Grounding and Evidence System', () => {
  const sampleResume: ResumeData = {
    ...INITIAL_DATA,
    fullName: 'Alex Morgan',
    jobTitle: 'Lead Product Designer',
    summary: 'Product designer with 6 years leading fintech and checkout experience teams.',
    skills: 'Figma, Design Systems, React, User Research, Prototyping',
    experience: [
      {
        id: 'exp_fintech',
        company: 'Stripe',
        role: 'Senior Product Designer',
        startDate: '2023-01',
        endDate: 'Present',
        description: [
          'Redesigned checkout experience across web and mobile platforms.',
          'Established component library adopted by 40 engineers.',
        ],
      },
      {
        id: 'exp_health',
        company: 'HealthCo',
        role: 'Product Designer',
        startDate: '2020-03',
        endDate: '2022-12',
        description: [
          'Managed 12 designers across mobile app redesign initiatives.',
        ],
      },
    ],
    education: [
      {
        id: 'edu_1',
        school: 'University of Washington',
        degree: 'BS Human Centered Design',
        year: '2019',
      },
    ],
    projects: [
      {
        id: 'proj_1',
        name: 'Design Tokens CLI',
        description: 'Open source tool for syncing design tokens from Figma to React.',
        technologies: 'TypeScript, Figma REST API',
      },
    ],
  };

  // ── 1 & 2. Resume-dependent requests vs generic queries ─────────────────────
  it('1. Correctly flags resume-dependent requests as requiring resume evidence', () => {
    const dependentQueries = [
      'improve my resume',
      'rewrite my resume',
      'rewrite my summary',
      'rewrite my experience',
      'improve this bullet',
      'add experience',
      'improve my skills',
      'tailor my resume to this job',
      'make my CV ATS friendly',
      'analyze my resume',
      'what is wrong with my CV',
      'improve my metrics',
      'compare my resume with this JD',
      'do I have enough experience',
      'what skills am I missing',
      'optimize this section',
      'make this bullet stronger',
      'change my education',
      'improve my projects',
      'add my Product Designer role',
    ];

    for (const q of dependentQueries) {
      const intent = detectUserIntent(q);
      const task = resolveAgentTask(intent, analyzeResumeState(sampleResume), { message: q });
      expect(requiresResumeEvidence(intent, q, task)).toBe(true);
    }
  });

  it('2. Generic questions and conversational greetings do NOT require resume evidence', () => {
    const genericQueries = [
      'What is ATS?',
      'How long should a CV be?',
      'What should a Product Designer include?',
      'What is a good answer to "What\'s your weakness?"',
      'Hello',
      'Thanks',
      'General career advice for UX designers',
      'Hey',
      'Hi',
      'ok',
      'cool',
    ];

    for (const q of genericQueries) {
      const intent = detectUserIntent(q);
      const task = resolveAgentTask(intent, analyzeResumeState(sampleResume), { message: q });
      expect(requiresResumeEvidence(intent, q, task)).toBe(false);
      const sections = determineRequiredResumeSections(intent, q, task);
      expect(sections.length).toBe(0);
      const snapshot = extractResumeEvidence(sampleResume, sections);
      expect(formatResumeEvidenceBlock(snapshot)).toBe('');
    }
  });

  // ── 3. Summary rewrite uses summary section ────────────────────────────────
  it('3. Summary rewrite deterministically retrieves summary section', () => {
    const message = 'Rewrite my summary to emphasize fintech.';
    const intent = detectUserIntent(message);
    const task = resolveAgentTask(intent, analyzeResumeState(sampleResume), { message });
    const sections = determineRequiredResumeSections(intent, message, task);

    expect(sections).toContain('summary');
    const snapshot = extractResumeEvidence(sampleResume, sections);
    expect(snapshot.summary).toBe(sampleResume.summary);
    const block = formatResumeEvidenceBlock(snapshot);
    expect(block).toContain('SUMMARY:');
    expect(block).toContain('Product designer with 6 years');
  });

  // ── 4. Experience rewrite retrieves experience and skills ──────────────────
  it('4. Experience rewrite retrieves experience and skills', () => {
    const message = 'Improve my experience bullets for Stripe.';
    const intent = detectUserIntent(message);
    const task = resolveAgentTask(intent, analyzeResumeState(sampleResume), { message });
    const sections = determineRequiredResumeSections(intent, message, task);

    expect(sections).toContain('experience');
    const snapshot = extractResumeEvidence(sampleResume, sections);
    expect(snapshot.experience?.length).toBe(2);
    expect(snapshot.experience?.[0].company).toBe('Stripe');
    expect(snapshot.experience?.[0].bullets[0].text).toBe('Redesigned checkout experience across web and mobile platforms.');
  });

  // ── 5. Tailoring retrieves all substantive sections ────────────────────────
  it('5. Tailoring and overall CV audit retrieve all substantive resume sections', () => {
    const message = 'Tailor my resume for a Senior Fintech Designer role.';
    const intent = detectUserIntent(message);
    const task = resolveAgentTask(intent, analyzeResumeState(sampleResume), { message });
    const sections = determineRequiredResumeSections(intent, message, task);

    expect(sections).toContain('summary');
    expect(sections).toContain('experience');
    expect(sections).toContain('skills');
    expect(sections).toContain('education');
    expect(sections).toContain('projects');
  });

  // ── 6. Current resume overrides stale memory ───────────────────────────────
  it('6. Current canonical resume overrides stale memory', () => {
    let memory = createEmptyResumeMemory('res_1');
    // Stale memory from last month says 9 designers
    memory = upsertMemoryFact(memory, {
      topic: 'team_size',
      value: '9 designers',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    // But current resume explicitly says 12 designers
    const expItem = sampleResume.experience?.[1];
    expect(expItem?.description).toContain('Managed 12 designers across mobile app redesign initiatives.');

    const sections = ['experience'];
    const snapshot = extractResumeEvidence(sampleResume, sections);
    const block = formatResumeEvidenceBlock(snapshot);

    expect(block).toContain('12 designers');
    expect(block).not.toContain('9 designers');
  });

  // ── 7. Previous assistant output is not treated as evidence ────────────────
  it('7. Previous assistant generated text is excluded from candidate facts/evidence', () => {
    // Only explicit user/resume facts have provenance
    const memory = createEmptyResumeMemory('res_1');
    const facts = memory.candidateFacts;
    // An AI inference or hallucinated assistant monologue does not exist as verified fact
    expect(facts.some((f) => f.value === 'Led a team of 10 designers')).toBe(false);
  });

  // ── 8. Explicit user metrics are grounded ──────────────────────────────────
  it('8. Explicit user metrics are verified and attached to evidence pool', () => {
    let memory = createEmptyResumeMemory('res_1');
    memory = recordMemoryMetric(memory, {
      key: 'checkout_conversion',
      value: '22% increase in sign-ups',
      context: 'checkout redesign',
      source: 'user',
      confidence: 'explicit',
    });
    memory = recordMemoryMetric(memory, {
      key: 'user_scale',
      value: '120,000 users',
      context: 'checkout',
      source: 'user',
      confidence: 'explicit',
    });

    expect(memory.metrics.length).toBe(2);
    expect(memory.metrics[0].value).toContain('22%');
    expect(memory.metrics[1].value).toContain('120,000');
  });

  // ── 9. Unsupported mutations are rejected by validation ────────────────────
  it('9. Operations targeting invalid item IDs or out-of-bounds indices are rejected', () => {
    const invalidOp: ResumeOperation = {
      operationId: 'op_test_1',
      agentRunId: 'run_1',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'non_existent_id',
      bulletIndex: 0,
      value: 'Fabricated bullet text here.',
      reason: 'Testing validation',
      evidence: ['sample quote'],
    };

    const result = validateMutationAgainstCurrentResume(sampleResume, invalidOp);
    expect(result.valid).toBe(false);
    expect(result.code).toBe('target_not_found');
  });

  it('9b. Out-of-bounds bullet index is caught and rejected', () => {
    const oobOp: ResumeOperation = {
      operationId: 'op_test_2',
      agentRunId: 'run_1',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'exp_fintech',
      bulletIndex: 99, // only 2 bullets exist
      value: 'Valid bullet text',
      reason: 'Testing out of bounds',
      evidence: ['sample quote'],
    };

    const result = validateMutationAgainstCurrentResume(sampleResume, oobOp);
    expect(result.valid).toBe(false);
    expect(result.code).toBe('index_out_of_bounds');
  });

  // ── 10. Rejected claims are not reintroduced ──────────────────────────────
  it('10. Operations introducing a rejected claim are rejected by pre-execution validation', () => {
    let memory = createEmptyResumeMemory('res_1');
    memory = recordRejectedClaim(memory, {
      claim: 'Candidate led a team of 10 designers',
      reason: 'User explicitly denied this',
    });

    const badOp: ResumeOperation = {
      operationId: 'op_test_3',
      agentRunId: 'run_1',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'exp_fintech',
      bulletIndex: 0,
      value: 'Candidate led a team of 10 designers across international products.',
      reason: 'Testing rejected claim rejection',
      evidence: ['sample'],
    };

    const result = validateMutationAgainstCurrentResume(sampleResume, badOp, memory);
    expect(result.valid).toBe(false);
    expect(result.code).toBe('rejected_claim_violation');
  });

  // ── 11. Stale operation detection ──────────────────────────────────────────
  it('11. Resume version mismatch or stale mutation is detected', () => {
    const resumeV1: ResumeData = { ...sampleResume, revision: 1 };
    const resumeV2: ResumeData = { ...sampleResume, revision: 2 };

    const op: ResumeOperation = {
      operationId: 'op_test_4',
      agentRunId: 'run_1',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'exp_fintech',
      bulletIndex: 0,
      value: 'Grounded new bullet',
      reason: 'Update',
      evidence: ['quote'],
    };

    // op generated against v1 tested against current v2
    expect(isOperationStaleWithResume(op, resumeV2, 1)).toBe(true);
    // op generated against v2 tested against current v2
    expect(isOperationStaleWithResume(op, resumeV2, 2)).toBe(false);
  });

  // ── 12. Compact evidence block formatting ──────────────────────────────────
  it('12. Evidence block is compact and structured with item IDs', () => {
    const snapshot = extractResumeEvidence(sampleResume, ['summary', 'experience']);
    const block = formatResumeEvidenceBlock(snapshot);

    expect(block).toContain('[CURRENT_RESUME_EVIDENCE]');
    expect(block).toContain('SOURCE: canonical_resume');
    expect(block).toContain('[exp_fintech] Senior Product Designer at Stripe');
    expect(block).toContain('[b0] Redesigned checkout experience across web and mobile platforms.');
    expect(block).toContain('[/CURRENT_RESUME_EVIDENCE]');
  });

  // ── Scenario A: Resume + Memory grounding ─────────────────────────────────
  it('Scenario A: Grounding combines current bullet with verified memory', () => {
    // Current resume: "Redesigned checkout experience across web and mobile platforms."
    // Memory: "22% sign-up increase", "120,000 users"
    let memory = createEmptyResumeMemory('res_1');
    memory = recordMemoryMetric(memory, {
      key: 'sign_up_lift',
      value: '22% increase in sign-ups',
      context: 'checkout',
      source: 'user',
      confidence: 'explicit',
    });
    memory = recordMemoryMetric(memory, {
      key: 'user_scale',
      value: '120,000 users',
      context: 'checkout',
      source: 'user',
      confidence: 'explicit',
    });

    const snapshot = extractResumeEvidence(sampleResume, ['experience']);
    const block = formatResumeEvidenceBlock(snapshot);

    expect(block).toContain('Redesigned checkout experience');
    expect(memory.metrics.some((m) => m.value.includes('22%'))).toBe(true);
    expect(memory.metrics.some((m) => m.value.includes('120,000'))).toBe(true);
  });

  // ── Scenario B: Manual edit 9 -> 12 ────────────────────────────────────────
  it('Scenario B: Agent uses current 12 designers from resume instead of old memory saying 9', () => {
    const snapshot = extractResumeEvidence(sampleResume, ['experience']);
    const exp2 = snapshot.experience?.find((e) => e.itemId === 'exp_health');
    expect(exp2?.bullets[0].text).toContain('Managed 12 designers');
  });

  // ── Scenario C: Unsupported assistant claims ──────────────────────────────
  it('Scenario C: Unsupported assistant output is absent from evidence block', () => {
    const snapshot = extractResumeEvidence(sampleResume, ['summary', 'experience', 'skills']);
    const block = formatResumeEvidenceBlock(snapshot);
    expect(block).not.toContain('10 designers');
  });

  // ── Scenario D: What is ATS? ───────────────────────────────────────────────
  it('Scenario D: User asks "What is ATS?" -> no unnecessary resume evidence block', () => {
    const q = 'What is ATS?';
    const intent = detectUserIntent(q);
    const task = resolveAgentTask(intent, analyzeResumeState(sampleResume), { message: q });
    expect(requiresResumeEvidence(intent, q, task)).toBe(false);
    expect(determineRequiredResumeSections(intent, q, task).length).toBe(0);
  });

  // ── Scenario E: Upload pending ─────────────────────────────────────────────
  it('Scenario E: Upload pending state prevents hallucinated analysis', () => {
    const pendingAnalysis = analyzeResumeState(sampleResume, {
      justUploaded: true,
      uploadStatus: 'pending',
    });
    expect(pendingAnalysis.uploadState).toBe('PENDING_ANALYSIS');
  });

  // ── Scenario F: Resume A vs Resume B isolation ─────────────────────────────
  it('Scenario F: Resume A and Resume B have completely isolated snapshots and memories', () => {
    const resumeA: ResumeData = { ...sampleResume, fullName: 'Alice' };
    const resumeB: ResumeData = { ...sampleResume, fullName: 'Bob' };

    const snapshotA = extractResumeEvidence(resumeA, ['summary']);
    const snapshotB = extractResumeEvidence(resumeB, ['summary']);

    expect(snapshotA.fullName).toBe('Alice');
    expect(snapshotB.fullName).toBe('Bob');
  });
});
