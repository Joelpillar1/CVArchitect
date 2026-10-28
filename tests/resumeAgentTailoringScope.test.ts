import { beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_DATA, type ResumeData } from '../types';
import type { JobDescriptionData } from '../types/resumeAgent';

vi.mock('../services/aiService', () => ({
  callAIJSON: vi.fn(),
  callAIText: vi.fn(),
}));

import { callAIJSON } from '../services/aiService';
import { generateTailoredChanges } from '../services/resumeAgentService';
import { applyTemplateSectionDefaults } from '../utils/templateSectionDefaults';

const job: JobDescriptionData = {
  title: 'Product Manager',
  company: 'Stripe',
  descriptionText: 'Own the roadmap and ship measurable outcomes.',
  requiredSkills: ['SQL', 'Roadmapping'],
  preferredSkills: [],
  responsibilities: ['Own the roadmap'],
  keywords: ['roadmap', 'SQL'],
};

const modelChanges = [
  {
    section: 'summary',
    original: INITIAL_DATA.summary,
    proposed: 'Product Manager specializing in SQL and roadmapping with a track record of shipping measurable outcomes.',
    reason: 'Aligns the summary with the target role.',
    evidence: [INITIAL_DATA.summary],
  },
  {
    section: 'experience',
    itemId: '1',
    bulletIndex: 0,
    original: 'Key responsibility or achievement',
    proposed: 'Delivered a roadmap that improved activation for the core product surface across three teams.',
    reason: 'Adds target-role language.',
    evidence: ['Role: Job Title at Company Name'],
  },
];

describe('generateTailoredChanges section scope', () => {
  beforeEach(() => {
    vi.mocked(callAIJSON).mockReset();
  });

  it('drops summary proposals for a template with no summary section', async () => {
    vi.mocked(callAIJSON).mockResolvedValue(modelChanges);
    const student = applyTemplateSectionDefaults(
      { ...INITIAL_DATA, template: undefined },
      'student'
    );

    const changes = await generateTailoredChanges(student, job);

    expect(changes.map((change) => change.section)).not.toContain('summary');
    expect(changes.map((change) => change.section)).toContain('experience');

    const prompt = vi.mocked(callAIJSON).mock.calls[0][0] as string;
    expect(prompt).toContain('NO Professional Summary section');
    expect(prompt).not.toContain('"section": "summary"');
  });

  it('keeps summary proposals for a template that renders a summary', async () => {
    vi.mocked(callAIJSON).mockResolvedValue(modelChanges);
    const vanguard = applyTemplateSectionDefaults(
      { ...INITIAL_DATA, template: undefined },
      'vanguard'
    );

    const changes = await generateTailoredChanges(vanguard, job);

    expect(changes.map((change) => change.section)).toContain('summary');

    const prompt = vi.mocked(callAIJSON).mock.calls[0][0] as string;
    expect(prompt).toContain('"section": "summary"');
  });

  it('never falls back to a summary on a template without one', async () => {
    vi.mocked(callAIJSON).mockRejectedValue(new Error('AI unavailable'));
    const student = applyTemplateSectionDefaults(
      { ...INITIAL_DATA, template: undefined },
      'student'
    );

    const changes = await generateTailoredChanges(student, job);

    expect(changes.map((change) => change.section)).not.toContain('summary');
  });
});
