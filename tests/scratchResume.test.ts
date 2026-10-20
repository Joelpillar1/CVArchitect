import { describe, it, expect } from 'vitest';
import {
  buildScratchResumeData,
  parseContactInput,
  applyExperienceLevel,
  templateShowsJobTitle,
  TEMPLATES_WITHOUT_JOB_TITLE,
} from '../utils/scratchResume';
import { getTemplatePreviewData } from '../utils/sampleResumeData';
import { Experience, TemplateType } from '../types';

/**
 * Verifies the "Create from scratch" flow (Option A):
 * - a new resume opens with the chosen template's own preview content so the
 *   editor shows the real design instead of a blank page
 * - onboarding answers personalize the header: Name → fullName, Contact →
 *   smart-parsed fields, Target Role → jobTitle (only for templates that
 *   render a title line), Experience Level → demo work-history shape
 * - the shared preview datasets are never mutated
 */
describe('templateShowsJobTitle', () => {
  it('is false exactly for the templates without a professional-title line', () => {
    expect(TEMPLATES_WITHOUT_JOB_TITLE).toEqual(['gaurav', 'minimalist', 'rezi', 'scholar', 'modern', 'dev']);
    for (const t of TEMPLATES_WITHOUT_JOB_TITLE) {
      expect(templateShowsJobTitle(t)).toBe(false);
    }
  });

  it('is true for templates that render a job title', () => {
    (['vanguard', 'classic', 'jake', 'freshgrad8', 'free'] as TemplateType[]).forEach((t) => {
      expect(templateShowsJobTitle(t)).toBe(true);
    });
  });
});

describe('parseContactInput', () => {
  it('returns nothing for empty input', () => {
    expect(parseContactInput('')).toEqual({});
    expect(parseContactInput('   ')).toEqual({});
  });

  it('classifies each supported token', () => {
    expect(parseContactInput('john@example.com')).toEqual({ email: 'john@example.com' });
    expect(parseContactInput('+44 20 7946 0958')).toEqual({ phone: '+44 20 7946 0958' });
    expect(parseContactInput('github.com/johnny')).toEqual({ github: 'github.com/johnny' });
    expect(parseContactInput('@johnnydev')).toEqual({ atHandle: 'johnnydev' });
    expect(parseContactInput('ada.dev')).toEqual({ portfolio: 'ada.dev' });
    expect(parseContactInput('Austin, TX')).toEqual({ location: 'Austin, TX' });
  });

  it('strips protocols and trailing slashes from profile links', () => {
    expect(parseContactInput('https://linkedin.com/in/john/')).toEqual({ linkedin: 'linkedin.com/in/john' });
  });

  it('splits a combined string into typed fields', () => {
    const parsed = parseContactInput(
      'ada@example.com, +1 (555) 987-6543, linkedin.com/in/ada, github.com/ada, Austin, TX'
    );
    expect(parsed).toEqual({
      email: 'ada@example.com',
      phone: '+1 (555) 987-6543',
      linkedin: 'linkedin.com/in/ada',
      github: 'github.com/ada',
      location: 'Austin, TX',
    });
  });
});

describe('applyExperienceLevel', () => {
  const mk = (id: string, startDate: string, endDate: string): Experience => ({
    id,
    company: `Company ${id}`,
    role: 'Engineer',
    startDate,
    endDate,
    description: 'Did things.',
  });

  // Newest-first, like every template renders them.
  const history = [
    mk('1', '2023-01', 'Present'),
    mk('2', '2021-01', 'Present'),
    mk('3', '2019-01', 'Present'),
    mk('4', '2016-01', '2018-12'),
  ];

  it('keeps every entry and changes nothing without a level', () => {
    expect(applyExperienceLevel(history, undefined)).toEqual(history);
    expect(applyExperienceLevel(history, '')).toEqual(history);
  });

  it('entry level keeps one role starting about a year ago', () => {
    const result = applyExperienceLevel(history, 'entry');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    const expectedYear = new Date().getFullYear() - 1;
    expect(result[0].startDate).toBe(`${expectedYear}-01`);
    expect(result[0].endDate).toBe('Present'); // "Present" is never rewritten
  });

  it('mid level keeps two roles and retracts the oldest start by ~4 years', () => {
    const result = applyExperienceLevel(history, 'mid');
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
    const expectedYear = new Date().getFullYear() - 4;
    expect(result[1].startDate).toBe(`${expectedYear}-01`);
  });

  it('senior level keeps three roles', () => {
    const result = applyExperienceLevel(history, 'senior');
    expect(result.map((e) => e.id)).toEqual(['1', '2', '3']);
  });

  it('executive keeps every role and stretches the timeline back ~9 years', () => {
    const result = applyExperienceLevel(history, 'executive');
    expect(result).toHaveLength(4);
    const expectedYear = new Date().getFullYear() - 9;
    expect(result[3].startDate).toBe(`${expectedYear}-01`);
    expect(result[3].endDate).toBe('2018-12'); // end untouched
  });

  it('never lets the retracted start jump past the entry above it', () => {
    const tight = [mk('1', '2021-01', 'Present'), mk('2', '2020-01', 'Present'), mk('3', '2019-01', 'Present')];
    const result = applyExperienceLevel(tight, 'senior'); // target thisYear-6 would exceed 2020
    // Capped at 2020 - 1 = 2019, which equals the original start → unchanged.
    expect(result[2].startDate).toBe('2019-01');
  });

  it('never rewrites yearless dates and preserves month-name formats', () => {
    // The kept (oldest) entry has no parseable year → left untouched.
    const odd = [mk('1', 'Ongoing', 'Someday'), mk('2', 'June 2018', 'Present')];
    const result = applyExperienceLevel(odd, 'entry');
    expect(result).toHaveLength(1);
    expect(result[0].startDate).toBe('Ongoing');

    // "Month YYYY" format keeps its month when the year is retracted.
    const monthed = applyExperienceLevel([mk('1', 'June 2018', 'Present')], 'entry');
    expect(monthed[0].startDate).toBe(`June ${new Date().getFullYear() - 1}`);
  });
});

describe('buildScratchResumeData', () => {
  it('personalizes the header but keeps the template demo body (vanguard)', () => {
    const preview = getTemplatePreviewData('vanguard');
    const data = buildScratchResumeData({
      template: 'vanguard',
      name: 'Ada Lovelace',
      contact: 'ada@example.com, +1 (555) 987-6543, linkedin.com/in/ada, github.com/ada, Austin, TX',
      jobTitle: 'Senior Product Manager',
      experienceLevel: 'entry',
    });

    // Header identity fully replaced — no demo contact remnants.
    expect(data.fullName).toBe('Ada Lovelace');
    expect(data.email).toBe('ada@example.com');
    expect(data.phone).toBe('+1 (555) 987-6543');
    expect(data.linkedin).toBe('linkedin.com/in/ada');
    expect(data.github).toBe('github.com/ada');
    expect(data.location).toBe('Austin, TX');
    expect(data.atHandle).toBe('');
    expect(data.portfolio).toBe('');

    // Target role becomes the job title on title-line templates.
    expect(data.jobTitle).toBe('Senior Product Manager');

    // Demo scaffolding cleared, template + origin recorded.
    expect(data.template).toBe('vanguard');
    expect(data.source).toBe('scratch');
    expect(data.currentTag).toBe('');
    expect(data.resumeTitle).toBe('');
    expect(data.jobDescription).toBe('');
    expect(data.hasJobMatchRun).toBe(false);

    // Demo body preserved for the user to edit over, shaped by level.
    expect(data.summary).toBe(preview.summary);
    expect(data.skills).toBe(preview.skills);
    expect(data.education).toEqual(preview.education);
    expect(data.experience).toHaveLength(1); // entry level
  });

  it('does not inject a job title into templates without a title line', () => {
    for (const template of TEMPLATES_WITHOUT_JOB_TITLE) {
      const preview = getTemplatePreviewData(template);
      const data = buildScratchResumeData({ template, name: 'Ada Lovelace', jobTitle: 'Professor' });
      expect(data.jobTitle).toBe(preview.jobTitle); // untouched
      expect(data.fullName).toBe('Ada Lovelace');
    }
  });

  it('never mutates the shared preview datasets', () => {
    const before = JSON.parse(JSON.stringify(getTemplatePreviewData('vanguard')));
    const built = buildScratchResumeData({ template: 'vanguard', name: 'X Y', experienceLevel: 'entry' });
    if (built.experience[0]) built.experience[0].company = 'MUTATED CO';
    const after = getTemplatePreviewData('vanguard');
    expect(after).toEqual(before);
    expect(after.experience[0].company).not.toBe('MUTATED CO');
  });

  it('keeps pure preview parity when nothing personalizing is provided', () => {
    const preview = getTemplatePreviewData('classic');
    const data = buildScratchResumeData({ template: 'classic' });
    expect(data).toEqual({ ...preview, template: 'classic', source: 'scratch', currentTag: '', resumeTitle: '', jobDescription: '', hasJobMatchRun: false });
  });
});
