import { describe, it, expect } from 'vitest';
import { INITIAL_DATA, type ResumeData } from '../types';
import { applyOperation, validateOperation, OperationError } from './resumeOperations';
import type { ResumeOperation } from '../types/resumeOperations';

/** Build a valid op with the server-assigned envelope + default evidence. */
function op(partial: Partial<ResumeOperation> & { op: ResumeOperation['op'] }): ResumeOperation {
  return {
    operationId: 'op_1',
    agentRunId: 'run_1',
    reason: 'test',
    evidence: ['from resume'],
    ...(partial as object),
  } as ResumeOperation;
}

/** A compact, deterministic resume fixture. */
function fixture(): ResumeData {
  return {
    ...INITIAL_DATA,
    fullName: 'Ada Lovelace',
    summary: 'Original summary.',
    skills: 'Python, SQL',
    experience: [
      { id: 'e1', company: 'Acme', role: 'Engineer', startDate: '2020-01', endDate: 'Present', description: ['Built things', 'Shipped features'] },
    ],
    education: [{ id: 'ed1', school: 'MIT', degree: 'BS CS', year: '2019' }],
    certifications: [],
    projects: [],
    leadership: [],
    keyAchievements: ['Won an award'],
  };
}

describe('applyOperation — immutability', () => {
  it('never mutates the input data', () => {
    const data = fixture();
    const snapshot = JSON.parse(JSON.stringify(data));
    applyOperation(data, op({ op: 'set_field', field: 'summary', value: 'New summary.' } as any));
    expect(data).toEqual(snapshot);
  });
});

describe('set_field', () => {
  it('sets a scalar field', () => {
    const next = applyOperation(fixture(), op({ op: 'set_field', field: 'summary', value: 'New summary.' } as any));
    expect(next.summary).toBe('New summary.');
  });
  it('maps referee → references data key', () => {
    const next = applyOperation(fixture(), op({ op: 'set_field', field: 'referee', value: 'On request' } as any));
    expect(next.referee).toBe('On request');
  });
});

describe('bullets — experience', () => {
  it('replaces a bullet by index and stores back as an array', () => {
    const next = applyOperation(fixture(), op({ op: 'replace_bullet', section: 'experience', itemId: 'e1', bulletIndex: 0, value: 'Rebuilt things' } as any));
    expect(next.experience[0].description).toEqual(['Rebuilt things', 'Shipped features']);
  });
  it('inserts a bullet at the end (index === length)', () => {
    const next = applyOperation(fixture(), op({ op: 'insert_bullet', section: 'experience', itemId: 'e1', bulletIndex: 2, value: 'Mentored juniors' } as any));
    expect(next.experience[0].description).toEqual(['Built things', 'Shipped features', 'Mentored juniors']);
  });
  it('deletes a bullet by index', () => {
    const next = applyOperation(fixture(), op({ op: 'delete_bullet', section: 'experience', itemId: 'e1', bulletIndex: 0, evidence: [] } as any));
    expect(next.experience[0].description).toEqual(['Shipped features']);
  });
});

describe('bullets — keyAchievements (no itemId)', () => {
  it('replaces an achievement bullet', () => {
    const next = applyOperation(fixture(), op({ op: 'replace_bullet', section: 'keyAchievements', bulletIndex: 0, value: 'Won two awards' } as any));
    expect(next.keyAchievements).toEqual(['Won two awards']);
  });
});

describe('array items', () => {
  it('update_item patches allowed fields only', () => {
    const next = applyOperation(fixture(), op({ op: 'update_item', section: 'education', itemId: 'ed1', fields: { degree: 'MS CS' } } as any));
    expect(next.education[0].degree).toBe('MS CS');
    expect(next.education[0].school).toBe('MIT');
  });
  it('insert_item assigns a collision-free id', () => {
    const next = applyOperation(fixture(), op({ op: 'insert_item', section: 'certifications', item: { name: 'AWS SAA', issuer: 'Amazon', date: '2023' } } as any));
    expect(next.certifications).toHaveLength(1);
    expect(next.certifications[0].id).toBeTruthy();
    expect(next.certifications[0].name).toBe('AWS SAA');
  });
  it('delete_item removes by id', () => {
    const next = applyOperation(fixture(), op({ op: 'delete_item', section: 'education', itemId: 'ed1', evidence: [] } as any));
    expect(next.education).toHaveLength(0);
  });
});

describe('skills — dedup', () => {
  it('add_skill appends when new', () => {
    const next = applyOperation(fixture(), op({ op: 'add_skill', value: 'TypeScript' } as any));
    expect(next.skills).toBe('Python, SQL, TypeScript');
  });
  it('add_skill is case-insensitively idempotent', () => {
    const next = applyOperation(fixture(), op({ op: 'add_skill', value: 'python' } as any));
    expect(next.skills).toBe('Python, SQL');
  });
  it('remove_skill removes case-insensitively', () => {
    const next = applyOperation(fixture(), op({ op: 'remove_skill', value: 'sql', evidence: [] } as any));
    expect(next.skills).toBe('Python');
  });
});

describe('validateOperation', () => {
  it('rejects out-of-range bulletIndex', () => {
    const r = validateOperation(op({ op: 'replace_bullet', section: 'experience', itemId: 'e1', bulletIndex: 9, value: 'x' } as any), fixture());
    expect(r.ok).toBe(false);
  });
  it('rejects an unknown itemId', () => {
    const r = validateOperation(op({ op: 'update_item', section: 'education', itemId: 'nope', fields: { degree: 'X' } } as any), fixture());
    expect(r.ok).toBe(false);
  });
  it('rejects content ops with empty evidence', () => {
    const r = validateOperation(op({ op: 'set_field', field: 'summary', value: 'Invented.', evidence: [] } as any), fixture());
    expect(r.ok).toBe(false);
    if (!r.ok) expect((r as Extract<typeof r, { ok: false }>).code).toBe('missing_evidence');
  });
  it('rejects disallowed fields on update_item', () => {
    const r = validateOperation(op({ op: 'update_item', section: 'education', itemId: 'ed1', fields: { hackerScore: '9000' } } as any), fixture());
    expect(r.ok).toBe(false);
  });
  it('allows a delete op without evidence', () => {
    const r = validateOperation(op({ op: 'delete_bullet', section: 'experience', itemId: 'e1', bulletIndex: 0, evidence: [] } as any), fixture());
    expect(r.ok).toBe(true);
  });
  it('accepts a well-formed content op', () => {
    const r = validateOperation(op({ op: 'add_skill', value: 'Go' } as any), fixture());
    expect(r.ok).toBe(true);
  });
});

describe('validateOperation — numeric grounding (anti-hallucination)', () => {
  it('rejects a fabricated metric in a bullet (number in neither evidence nor resume)', () => {
    const r = validateOperation(
      op({ op: 'replace_bullet', section: 'experience', itemId: 'e1', bulletIndex: 0, value: 'Increased revenue by 32%', evidence: ['Built things'] } as any),
      fixture(),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect((r as Extract<typeof r, { ok: false }>).code).toBe('ungrounded_metric');
  });

  it('rejects a fabricated metric in the summary', () => {
    const r = validateOperation(
      op({ op: 'set_field', field: 'summary', value: 'Engineer who delivered $2M in savings.', evidence: ['Original summary.'] } as any),
      fixture(),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect((r as Extract<typeof r, { ok: false }>).code).toBe('ungrounded_metric');
  });

  it('accepts a metric grounded in the cited evidence', () => {
    const r = validateOperation(
      op({ op: 'replace_bullet', section: 'experience', itemId: 'e1', bulletIndex: 0, value: 'Increased revenue by 32%', evidence: ['Candidate confirmed: revenue grew 32% in FY22'] } as any),
      fixture(),
    );
    expect(r.ok).toBe(true);
  });

  it('accepts a number already present elsewhere on the resume', () => {
    const data: ResumeData = { ...fixture(), summary: 'Grew revenue 40% YoY.' };
    const r = validateOperation(
      op({ op: 'replace_bullet', section: 'experience', itemId: 'e1', bulletIndex: 0, value: 'Sustained the 40% growth trajectory', evidence: ['Shipped features'] } as any),
      data,
    );
    expect(r.ok).toBe(true);
  });

  it('does not flag numbers inside skill names (HTML5, OAuth 2.0)', () => {
    expect(validateOperation(op({ op: 'add_skill', value: 'HTML5' } as any), fixture()).ok).toBe(true);
    expect(validateOperation(op({ op: 'set_skills', value: 'Python, OAuth 2.0, ISO 27001' } as any), fixture()).ok).toBe(true);
  });

  it('ignores commas/decimals when matching (1,200 grounds "1200")', () => {
    const r = validateOperation(
      op({ op: 'insert_bullet', section: 'experience', itemId: 'e1', bulletIndex: 2, value: 'Onboarded 1,200 users', evidence: ['reached 1200 users in year one'] } as any),
      fixture(),
    );
    expect(r.ok).toBe(true);
  });

  it('does not require grounding for a bullet with no numbers', () => {
    const r = validateOperation(
      op({ op: 'replace_bullet', section: 'experience', itemId: 'e1', bulletIndex: 0, value: 'Rebuilt the onboarding flow end to end', evidence: ['Built things'] } as any),
      fixture(),
    );
    expect(r.ok).toBe(true);
  });
});

describe('applyOperation — throws on unvalidated bad target', () => {
  it('throws OperationError for an out-of-range index', () => {
    expect(() => applyOperation(fixture(), op({ op: 'delete_bullet', section: 'experience', itemId: 'e1', bulletIndex: 5, evidence: [] } as any))).toThrow(OperationError);
  });
});
