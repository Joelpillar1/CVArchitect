import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const readPublic = (name: string) =>
  readFileSync(path.join(process.cwd(), 'public', name), 'utf8');

const LLMS = readPublic('llms.txt');
const LLMS_FULL = readPublic('llms-full.txt');

/** Copy that is no longer true about the current product or plan set. */
const STALE_COPY = [
  'Career Build',
  'iCIMS',
  'Harvard Classic',
  'Executive Pro',
  'Modern Minimalist',
  'Tech Developer',
  'Student Fresh Grad',
  '2026-10-01',
];

describe('AI manifest files', () => {
  it('do not contain stale plan, template, or ATS copy', () => {
    for (const file of [LLMS, LLMS_FULL]) {
      for (const stale of STALE_COPY) {
        expect(file, stale).not.toContain(stale);
      }
    }
  });

  it('describe the current paid plans', () => {
    for (const file of [LLMS, LLMS_FULL]) {
      expect(file).toContain('Build ($10/month)');
      expect(file).toContain('$99 one-time');
    }
  });

  it('describe the current free tier accurately', () => {
    expect(LLMS_FULL).toContain('1 AI-tailored resume and job match');
    expect(LLMS_FULL).toContain('3 PDF downloads on the base templates');
    expect(LLMS_FULL).toContain('DOCX export and cover letter generation are paid-plan features');
  });

  it('use the four supported ATS names', () => {
    for (const file of [LLMS, LLMS_FULL]) {
      for (const ats of ['Workday', 'Greenhouse', 'Lever', 'Taleo']) {
        expect(file, ats).toContain(ats);
      }
    }
  });

  it('avoid em-dashes', () => {
    for (const file of [LLMS, LLMS_FULL]) {
      expect(file).not.toContain('\u2014');
    }
  });
});
