import { describe, it, expect } from 'vitest';
import { INITIAL_DATA, type ResumeData } from '../types';
import {
  extractStartingVerb,
  normalizeVerb,
  getAllResumeBullets,
  getUsedStartingVerbs,
  getUsedStartingVerbsForCompany,
  getRecommendedActionVerbs,
  ensureUniqueActionVerb,
  buildVerbDiversityPromptContext,
  detectActionVerbDomain,
  isWeakVerb,
  suggestPowerVerbReplacement,
} from './actionVerbs';

function testResume(): ResumeData {
  return {
    ...INITIAL_DATA,
    fullName: 'Jane Doe',
    jobTitle: 'Senior Software Engineer',
    summary: 'Experienced software engineer.',
    skills: 'TypeScript, React, Node.js',
    experience: [
      {
        id: 'e1',
        company: 'Google',
        role: 'Staff Software Engineer',
        startDate: '2021-01',
        endDate: 'Present',
        description: [
          'Architected distributed microservices platform processing 50M+ daily events.',
          'Spearheaded cloud migration to Kubernetes reducing compute costs by $250K.',
          'Cross-functionally led 6 engineers across product delivery milestones.',
        ],
      },
      {
        id: 'e2',
        company: 'Meta',
        role: 'Software Engineer',
        startDate: '2019-01',
        endDate: '2020-12',
        description: [
          'Engineered GraphQL APIs improving response times by 35%.',
          'Optimized database queries and indexing strategies.',
        ],
      },
    ],
    projects: [
      {
        id: 'p1',
        name: 'OpenSource Tool',
        description: ['Developed real-time monitoring dashboard.'],
      },
    ],
    keyAchievements: ['Pioneered automated testing framework across 12 repositories.'],
  };
}

describe('extractStartingVerb & normalizeVerb', () => {
  it('extracts standard first word verbs', () => {
    expect(extractStartingVerb('Architected high-throughput pipeline')).toBe('Architected');
    expect(extractStartingVerb('Spearheaded the migration')).toBe('Spearheaded');
    expect(extractStartingVerb('Built responsive web applications')).toBe('Built');
  });

  it('skips leading adverbs to extract the operative action verb', () => {
    expect(extractStartingVerb('Cross-functionally led 6 engineers')).toBe('led');
    expect(extractStartingVerb('Successfully launched the mobile app')).toBe('launched');
    expect(extractStartingVerb('Proactively optimized database queries')).toBe('optimized');
  });

  it('handles bullet characters, markdown, and numbers', () => {
    expect(extractStartingVerb('• Engineered modern full-stack features')).toBe('Engineered');
    expect(extractStartingVerb('1. Deployed microservices on AWS')).toBe('Deployed');
    expect(extractStartingVerb('- **Formulated** new testing protocols')).toBe('Formulated');
  });

  it('normalizes irregular and past tense verbs to base forms', () => {
    expect(normalizeVerb('led')).toBe('lead');
    expect(normalizeVerb('built')).toBe('build');
    expect(normalizeVerb('architected')).toBe('architect');
    expect(normalizeVerb('spearheaded')).toBe('spearhead');
    expect(normalizeVerb('engineered')).toBe('engineer');
  });
});

describe('getAllResumeBullets & getUsedStartingVerbs', () => {
  it('extracts all bullets across all resume sections', () => {
    const data = testResume();
    const bullets = getAllResumeBullets(data);
    expect(bullets.length).toBe(7); // 3 from Google, 2 from Meta, 1 from projects, 1 from achievements
  });

  it('collects all used starting verbs across the whole resume', () => {
    const data = testResume();
    const used = getUsedStartingVerbs(data);
    expect(used.has('architect')).toBe(true);
    expect(used.has('spearhead')).toBe(true);
    expect(used.has('lead')).toBe(true);
    expect(used.has('engineer')).toBe(true);
    expect(used.has('optimize')).toBe(true);
    expect(used.has('build') || used.has('develop')).toBe(true);
    expect(used.has('pioneer')).toBe(true);
  });

  it('collects used verbs specific to a company', () => {
    const data = testResume();
    const googleVerbs = getUsedStartingVerbsForCompany(data, 'Google');
    expect(googleVerbs.has('architect')).toBe(true);
    expect(googleVerbs.has('spearhead')).toBe(true);
    expect(googleVerbs.has('lead')).toBe(true);
    expect(googleVerbs.has('engineer')).toBe(false); // engineered was at Meta
  });
});

describe('getRecommendedActionVerbs', () => {
  it('recommends verbs that do NOT include already used verbs', () => {
    const data = testResume();
    const used = getUsedStartingVerbs(data);
    const recommended = getRecommendedActionVerbs({
      usedVerbs: used,
      domain: 'engineering',
      count: 6,
    });

    for (const rec of recommended) {
      expect(used.has(normalizeVerb(rec))).toBe(false);
      expect(used.has(rec.toLowerCase())).toBe(false);
    }
    expect(recommended.length).toBeGreaterThanOrEqual(5);
  });
});

describe('ensureUniqueActionVerb', () => {
  it('replaces a colliding starting verb with an unused diverse verb', () => {
    const data = testResume();
    const used = getUsedStartingVerbs(data); // contains 'spearheaded', 'architected', etc.

    const collidingBullet = 'Spearheaded modern authentication workflow across enterprise services.';
    const uniqueBullet = ensureUniqueActionVerb(collidingBullet, used, 'engineering');

    const firstWord = extractStartingVerb(uniqueBullet);
    expect(firstWord).not.toBe('Spearheaded');
    expect(used.has(normalizeVerb(firstWord!))).toBe(false);
    expect(uniqueBullet.includes('modern authentication workflow across enterprise services.')).toBe(true);
  });

  it('keeps the bullet unchanged if its verb is already unique', () => {
    const data = testResume();
    const used = getUsedStartingVerbs(data); // does NOT contain 'Standardized'

    const bullet = 'Standardized code review protocols across 4 engineering squads.';
    const result = ensureUniqueActionVerb(bullet, used, 'engineering');
    expect(result).toBe(bullet);
  });
});

describe('buildVerbDiversityPromptContext', () => {
  it('builds clear prompt instructions with active bullets, forbidden verbs, and recommended verbs', () => {
    const data = testResume();
    const context = buildVerbDiversityPromptContext({
      resumeData: data,
      targetRole: 'Staff Engineer',
      targetCompany: 'Google',
      currentBullet: 'Helped with frontend performance',
    });

    expect(context).toContain('ACTIVE BULLETS ON RESUME');
    expect(context).toContain('FORBIDDEN STARTING VERBS');
    expect(context).toContain('RECOMMENDED FRESH STARTING VERBS');
    expect(context).toContain('spearhead');
    expect(context).toContain('architect');
    expect(context).toContain('STRICT ACTION VERB RULES');
  });
});

describe('isWeakVerb & suggestPowerVerbReplacement', () => {
  it('identifies weak and passive verbs and phrases', () => {
    expect(isWeakVerb('helped')).toBe(true);
    expect(isWeakVerb('assisted with')).toBe(true);
    expect(isWeakVerb('worked on')).toBe(true);
    expect(isWeakVerb('responsible for')).toBe(true);
    expect(isWeakVerb('participated in')).toBe(true);
    expect(isWeakVerb('utilized')).toBe(true);
    expect(isWeakVerb('Spearheaded')).toBe(false);
    expect(isWeakVerb('Architected')).toBe(false);
  });

  it('suggests power verb replacements for weak phrasing', () => {
    const replacements = suggestPowerVerbReplacement('helped');
    expect(replacements.length).toBeGreaterThanOrEqual(3);
    expect(replacements).toContain('Spearheaded');

    const workReplacements = suggestPowerVerbReplacement('worked on');
    expect(workReplacements).toContain('Engineered');
  });
});

