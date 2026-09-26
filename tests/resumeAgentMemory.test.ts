import { describe, it, expect, beforeEach } from 'vitest';
import {
  ResumeAgentMemory,
  createEmptyResumeMemory,
  upsertMemoryFact,
  recordMemoryMetric,
  recordMemoryCorrection,
  recordMemoryDecision,
  recordRejectedClaim,
  cloneResumeMemory,
  extractDurableInformation,
  reconcileMemoryWithResume,
} from '../utils/resumeAgentMemory';
import {
  retrieveRelevantMemory,
  formatResumeMemoryBlock,
} from '../utils/relevantMemoryRetrieval';
import {
  duplicateResumeAgentMemory,
  getResumeAgentMemory,
  saveResumeAgentMemory,
} from '../services/resumeMemoryService';
import { ResumeData, INITIAL_DATA } from '../types';

// In-memory mock localStorage for Node test environment
const memoryStore = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => memoryStore.get(key) || null,
  setItem: (key: string, val: string) => memoryStore.set(key, val),
  removeItem: (key: string) => memoryStore.delete(key),
  clear: () => memoryStore.clear(),
};
(globalThis as any).localStorage = mockLocalStorage;

describe('Resume-Scoped Conversational Memory System', () => {
  let memoryA: ResumeAgentMemory;
  let memoryB: ResumeAgentMemory;

  beforeEach(() => {
    mockLocalStorage.clear();
    memoryA = createEmptyResumeMemory('resume_123');
    memoryB = createEmptyResumeMemory('resume_456');
  });

  // ── 1. Isolation by resumeId ───────────────────────────────────────────────
  it('1. Memory is strictly isolated by resumeId (Resume A vs Resume B)', () => {
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'team_size',
      value: '9 designers',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    memoryB = upsertMemoryFact(memoryB, {
      topic: 'team_size',
      value: '4 designers',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    expect(memoryA.candidateFacts.find((f) => f.topic === 'team_size')?.value).toBe('9 designers');
    expect(memoryB.candidateFacts.find((f) => f.topic === 'team_size')?.value).toBe('4 designers');
    expect(memoryA.resumeId).toBe('resume_123');
    expect(memoryB.resumeId).toBe('resume_456');
  });

  // ── 2. Memory survives a new run / persistence ─────────────────────────────
  it('2. Memory persists and survives across runs via storage layer', async () => {
    memoryA = recordMemoryMetric(memoryA, {
      key: 'conversion_lift',
      value: '18%',
      context: 'checkout redesign',
      source: 'user',
      confidence: 'explicit',
    });

    await saveResumeAgentMemory('resume_123', memoryA);
    const loaded = await getResumeAgentMemory('resume_123');

    expect(loaded.metrics.length).toBe(1);
    expect(loaded.metrics[0].value).toBe('18%');
    expect(loaded.metrics[0].context).toBe('checkout redesign');
  });

  // ── 3. Candidate facts persist with provenance ─────────────────────────────
  it('3. Candidate facts persist with source and explicit provenance', () => {
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'react_experience',
      value: '4 years',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    const fact = memoryA.candidateFacts.find((f) => f.topic === 'react_experience');
    expect(fact).toBeDefined();
    expect(fact?.provenance).toBe('user_explicit');
    expect(fact?.confidence).toBe('explicit');
    expect(fact?.value).toBe('4 years');
  });

  // ── 4. Explicit user correction supersedes older facts ─────────────────────
  it('4. Explicit user correction supersedes old fact and records provenance', () => {
    // Initial statement: 9 designers
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'team_size',
      value: '9 designers',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    // User later corrects: 12 designers
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'team_size',
      value: '12 designers',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    expect(memoryA.candidateFacts.length).toBe(1);
    expect(memoryA.candidateFacts[0].value).toBe('12 designers');
    expect(memoryA.corrections.length).toBe(1);
    expect(memoryA.corrections[0].originalValue).toBe('9 designers');
    expect(memoryA.corrections[0].correctedValue).toBe('12 designers');
  });

  it('4b. Inferred fact cannot overwrite explicit user fact', () => {
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'team_size',
      value: '12 designers',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    // An AI inference attempts to overwrite
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'team_size',
      value: '5 designers',
      source: 'inferred',
      provenance: 'inferred',
      confidence: 'inferred',
    });

    expect(memoryA.candidateFacts[0].value).toBe('12 designers');
    expect(memoryA.candidateFacts[0].provenance).toBe('user_explicit');
  });

  // ── 5 & 6. Relevant memories retrieved, irrelevant excluded ───────────────
  it('5 & 6. Relevant memories are retrieved while irrelevant memories are excluded from prompt block', () => {
    // Add relevant metric
    memoryA = recordMemoryMetric(memoryA, {
      key: 'checkout_conversion',
      value: '18%',
      context: 'checkout redesign',
      source: 'user',
      confidence: 'explicit',
    });

    // Add unrelated fact
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'university_hobbies',
      value: 'played badminton in 2018',
      source: 'profile',
      provenance: 'profile',
      confidence: 'explicit',
    });

    const relevant = retrieveRelevantMemory(memoryA, {
      message: 'Please rewrite my checkout redesign bullet to make it punchier.',
      resume: INITIAL_DATA,
    });

    const block = formatResumeMemoryBlock(relevant);

    expect(block).toContain('18%');
    expect(block).toContain('checkout');
    expect(block).not.toContain('badminton');
  });

  // ── 7. Previous metrics are reused ─────────────────────────────────────────
  it('7. Previous metrics are recorded and accessible across turns', () => {
    memoryA = recordMemoryMetric(memoryA, {
      key: 'user_scale',
      value: '120,000 users',
      context: 'checkout redesign',
      source: 'user',
      confidence: 'explicit',
    });

    const slice = retrieveRelevantMemory(memoryA, {
      message: 'Make the redesign bullet stronger',
      resume: INITIAL_DATA,
    });

    expect(slice.metrics.some((m) => m.value === '120,000 users')).toBe(true);
  });

  // ── 8. Previous rejected claims are not regenerated ───────────────────────
  it('8. Previous rejected claims are formatted as DO NOT CLAIM directives', () => {
    memoryA = recordRejectedClaim(memoryA, {
      claim: 'Candidate led a team of 10 designers',
      reason: 'Candidate did not lead them',
    });

    const slice = retrieveRelevantMemory(memoryA, {
      message: 'Update my lead designer experience',
      resume: INITIAL_DATA,
    });

    const block = formatResumeMemoryBlock(slice);
    expect(block).toContain('REJECTED_CLAIMS');
    expect(block).toContain('DO NOT CLAIM: "Candidate led a team of 10 designers"');
  });

  // ── 9. Previous decisions are respected ────────────────────────────────────
  it('9. User decisions (e.g. UK English, title unchanged) are preserved', () => {
    memoryA = recordMemoryDecision(memoryA, {
      decision: 'Keep Product Designer title unchanged',
      category: 'role_title',
    });
    memoryA = recordMemoryDecision(memoryA, {
      decision: 'Use UK English throughout resume',
      category: 'language_style',
    });

    const slice = retrieveRelevantMemory(memoryA, {
      message: 'Tailor my resume for a Senior role',
      resume: INITIAL_DATA,
    });

    const block = formatResumeMemoryBlock(slice);
    expect(block).toContain('Keep Product Designer title unchanged');
    expect(block).toContain('Use UK English throughout resume');
  });

  // ── 10. Agent prevents repeated questions ──────────────────────────────────
  it('10. Memory contains fact so agent does not need to re-ask', () => {
    memoryA = recordMemoryMetric(memoryA, {
      key: 'users_affected',
      value: '120,000',
      context: 'checkout redesign',
      source: 'user',
      confidence: 'explicit',
    });

    const slice = retrieveRelevantMemory(memoryA, {
      message: 'Rewrite that bullet',
      resume: INITIAL_DATA,
    });

    const knownMetric = slice.metrics.find((m) => m.key === 'users_affected');
    expect(knownMetric).toBeDefined();
    expect(knownMetric?.value).toBe('120,000');
  });

  // ── 11 & 12. Cross-resume isolation across conversations ──────────────────
  it('11 & 12. Different resume does not retrieve previous resume memory', () => {
    memoryA = recordMemoryMetric(memoryA, {
      key: 'sign_up_lift',
      value: '22%',
      context: 'sign-ups',
      source: 'user',
      confidence: 'explicit',
    });

    // Query on Resume B
    const sliceB = retrieveRelevantMemory(memoryB, {
      message: 'Improve my metrics',
      resume: INITIAL_DATA,
    });

    expect(sliceB.metrics.length).toBe(0);
    expect(formatResumeMemoryBlock(sliceB)).not.toContain('22%');
  });

  // ── 13. Current resume edits supersede stale memory ────────────────────────
  it('13. Explicit edits in current resume take precedence over stale memory', () => {
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'current_job_title',
      value: 'Junior Designer',
      source: 'resume',
      provenance: 'resume_explicit',
      confidence: 'explicit',
    });

    const updatedResume: ResumeData = {
      ...INITIAL_DATA,
      jobTitle: 'Lead Product Architect',
    };

    const reconciled = reconcileMemoryWithResume(memoryA, updatedResume);
    const titleFact = reconciled.candidateFacts.find((f) => f.topic === 'current_job_title');
    expect(titleFact?.value).toBe('Lead Product Architect');
  });

  // ── 14. AI-generated text does not become a candidate fact ─────────────────
  it('14. Inferred candidate facts are tagged as inferred and ranked lowest', () => {
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'conversion_boost',
      value: '25%',
      source: 'inferred',
      provenance: 'inferred',
      confidence: 'inferred',
    });

    const fact = memoryA.candidateFacts[0];
    expect(fact.provenance).toBe('inferred');
    expect(fact.confidence).toBe('inferred');
  });

  // ── 15 & 16. Deterministic extraction: metrics vs "I don't know" ───────────
  it('15. User-provided metrics become reusable facts via deterministic extraction', () => {
    const extracted = extractDurableInformation(
      'It increased sign-ups by 22% and affected about 120,000 users.'
    );

    expect(extracted.metrics.length).toBeGreaterThanOrEqual(1);
    expect(extracted.metrics.some((m) => m.value.includes('22%'))).toBe(true);
    expect(extracted.facts.some((f) => f.value.includes('120,000'))).toBe(true);
  });

  it('16. "I don\'t know" does NOT create a fake metric or fact', () => {
    const extracted = extractDurableInformation("I don't know the exact conversion metric.");
    expect(extracted.metrics.length).toBe(0);
    expect(extracted.facts.length).toBe(0);
  });

  // ── 17. Resume duplication creates independent memory clone ────────────────
  it('17. Resume duplication creates an independent copy without cross-mutation', () => {
    memoryA = upsertMemoryFact(memoryA, {
      topic: 'team_size',
      value: '9 designers',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    // Duplicate memory to Resume C
    let memoryC = cloneResumeMemory(memoryA, 'resume_789');
    expect(memoryC.resumeId).toBe('resume_789');
    expect(memoryC.candidateFacts[0].value).toBe('9 designers');

    // Mutate Resume C
    memoryC = upsertMemoryFact(memoryC, {
      topic: 'team_size',
      value: '15 designers',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    // Verify Resume A is untouched!
    expect(memoryA.candidateFacts[0].value).toBe('9 designers');
    expect(memoryC.candidateFacts[0].value).toBe('15 designers');
  });

  // ── 18 & 19. Rolling summary and trivial messages ──────────────────────────
  it('18 & 19. Trivial messages do not pollute memory and summary is preserved', () => {
    const trivial1 = extractDurableInformation('Okay');
    const trivial2 = extractDurableInformation('Thanks!');
    const trivial3 = extractDurableInformation('Can you rewrite this?');

    expect(trivial1.facts.length).toBe(0);
    expect(trivial2.facts.length).toBe(0);
    expect(trivial3.facts.length).toBe(0);

    memoryA.conversationSummary = 'User is tailoring for Senior Product Designer roles with focus on checkout metrics.';
    const slice = retrieveRelevantMemory(memoryA, { message: 'Hello', resume: INITIAL_DATA });
    expect(slice.conversationSummary).toContain('Senior Product Designer');
  });

  // ── 20. Compact memory formatting ──────────────────────────────────────────
  it('20. Memory block formatting remains compact and structured', () => {
    memoryA = recordMemoryMetric(memoryA, {
      key: 'conversion_lift',
      value: '18%',
      context: 'checkout',
      source: 'user',
      confidence: 'explicit',
    });
    memoryA = recordMemoryDecision(memoryA, {
      decision: 'Do not claim management experience',
      category: 'experience_scope',
    });

    const slice = retrieveRelevantMemory(memoryA, {
      message: 'Rewrite checkout bullet',
      resume: INITIAL_DATA,
    });

    const block = formatResumeMemoryBlock(slice);
    expect(block.startsWith('[RESUME_MEMORY]')).toBe(true);
    expect(block.endsWith('[/RESUME_MEMORY]')).toBe(true);
    expect(block.length).toBeLessThan(1000); // Extremely compact
  });

  // ── Multi-user Account Isolation ──────────────────────────────────────────
  it('Strictly isolates memories and drafts between two different user accounts', async () => {
    const userA_Id = 'usr_alice_111';
    const userB_Id = 'usr_bob_222';

    let aliceMemory = createEmptyResumeMemory('draft');
    aliceMemory = upsertMemoryFact(aliceMemory, {
      topic: 'current_role',
      value: 'Principal Engineer at Google',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    let bobMemory = createEmptyResumeMemory('draft');
    bobMemory = upsertMemoryFact(bobMemory, {
      topic: 'current_role',
      value: 'Junior Designer at Startup',
      source: 'user',
      provenance: 'user_explicit',
      confidence: 'explicit',
    });

    await saveResumeAgentMemory('draft', aliceMemory, userA_Id);
    await saveResumeAgentMemory('draft', bobMemory, userB_Id);

    const loadedAlice = await getResumeAgentMemory('draft', userA_Id);
    const loadedBob = await getResumeAgentMemory('draft', userB_Id);

    expect(loadedAlice.candidateFacts.find((f) => f.topic === 'current_role')?.value).toBe(
      'Principal Engineer at Google'
    );
    expect(loadedBob.candidateFacts.find((f) => f.topic === 'current_role')?.value).toBe(
      'Junior Designer at Startup'
    );
  });
});

