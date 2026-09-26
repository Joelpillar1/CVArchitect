import { describe, it, expect } from 'vitest';
import {
  evaluateBulletQuality,
  isGenericBullet,
  generateTargetedMetricQuestion,
  craftEnhancedBullet,
  detectRoleDomain,
  containsPlaceholders,
  isTwoFullLines,
} from './bulletQuality';
import { validateOperation, applyOperation } from './resumeOperations';
import { ResumeData } from '../types';

describe('Resume Bullet Content Quality & Anti-Generic Engine', () => {
  const baseResume: ResumeData = {
    fullName: 'Jane Doe',
    jobTitle: 'Senior Product Designer',
    email: 'jane@example.com',
    phone: '+1-555-0100',
    summary: 'Senior Product Designer with 6+ years of experience in design systems and conversion optimization.',
    experience: [
      {
        id: 'exp_1',
        company: 'Acme Corp',
        role: 'Lead Product Designer',
        startDate: '2021',
        endDate: 'Present',
        description:
          '- Redesigned checkout experience across web and mobile, reducing cart abandonment by 18%.\n- Managed a design system used by 12 cross-functional product teams.',
      },
      {
        id: 'exp_2',
        company: 'Beta Labs',
        role: 'UX Designer',
        startDate: '2018',
        endDate: '2021',
        description:
          '- Redesigned the customer onboarding flow to simplify registration.\n- Built wireframes and interactive prototypes for web application.',
      },
    ],
    education: [],
    skills: 'Figma, Design Systems, UX Research, Prototyping',
  };

  // 1. Existing metric is preserved
  it('1. preserves existing metrics in candidate resume bullets without altering numbers', () => {
    const originalBullet = 'Redesigned checkout experience across web and mobile, reducing cart abandonment by 18%.';
    const enhanced = craftEnhancedBullet(originalBullet, { verifiedMetric: 'reducing cart abandonment by 18%' });

    expect(enhanced).toContain('18%');
    expect(enhanced).toContain('checkout experience');
  });

  // 2. Existing metric is correctly reused
  it('2. correctly reuses verified candidate numbers when refining bullet phrasing', () => {
    const rawBullet = 'Redesigned checkout flow.';
    const enhanced = craftEnhancedBullet(rawBullet, { verifiedMetric: 'reducing cart abandonment by 18%' });

    expect(enhanced).toContain('18%');
    expect(enhanced).toContain('checkout');
  });

  // 3. No metric is invented when none exists
  it('3. does not invent metrics or numbers when none are present in evidence', () => {
    const rawBullet = 'Redesigned the customer onboarding flow to simplify registration.';
    const enhanced = craftEnhancedBullet(rawBullet);

    // Enhanced should contain concrete scope/action without invented percentages or dollar amounts
    expect(enhanced).not.toMatch(/\b\d+(\.\d+)?%/);
    expect(enhanced).not.toMatch(/\$\d+/);
    expect(enhanced).not.toMatch(/\[X\]/i);
    expect(enhanced).toContain('onboarding flow');
  });

  // 4. Generic bullet is rejected/improved
  it('4. detects and rejects generic vacuous filler bullets', () => {
    const genericBullet = 'Collaborated with cross-functional teams to improve user experiences and deliver high-quality design solutions.';
    expect(isGenericBullet(genericBullet)).toBe(true);

    const evalResult = evaluateBulletQuality(genericBullet);
    expect(evalResult.isGeneric).toBe(true);
    expect(evalResult.classification).toBe('WEAK_GENERIC');

    const improved = craftEnhancedBullet(genericBullet);
    expect(isGenericBullet(improved)).toBe(false);
    expect(improved).toContain('UX architecture');
  });

  // 5. Context-specific metric question is generated based on role domain
  it('5. generates targeted, domain-specific metric discovery questions', () => {
    // Design domain
    const designQ = generateTargetedMetricQuestion('Redesigned checkout purchase experience', 'Product Designer');
    expect(designQ).toMatch(/conversion|checkout completion|cart abandonment/i);

    // Engineering domain
    const engQ = generateTargetedMetricQuestion('Migrated monolith to microservices on AWS', 'Senior Backend Engineer');
    expect(engQ).toMatch(/latency|deployment frequency|error rates|infrastructure costs/i);

    // Marketing domain
    const mktQ = generateTargetedMetricQuestion('Launched organic content campaign', 'Marketing Lead');
    expect(mktQ).toMatch(/traffic|leads|conversion/i);

    // Sales domain
    const salesQ = generateTargetedMetricQuestion('Managed enterprise client relationships', 'Account Executive');
    expect(salesQ).toMatch(/revenue|pipeline|accounts/i);

    // Operations domain
    const opsQ = generateTargetedMetricQuestion('Automated invoice processing workflow', 'Operations Manager');
    expect(opsQ).toMatch(/time|cost|teams/i);
  });

  // 6. User-provided metric is remembered and used on the next turn
  it('6. integrates user-provided metrics supplied during conversation into the bullet', () => {
    const rawBullet = 'Redesigned the company website.';
    const userAnswer = 'increasing sign-up conversion by 22%';
    const enhanced = craftEnhancedBullet(rawBullet, { verifiedMetric: userAnswer });

    expect(enhanced).toContain('22%');
    expect(enhanced).toContain('web');
  });

  // 7. Agent does not repeatedly ask for the same metric once candidate facts exist
  it('7. recognizes verified metrics and suppresses redundant metric inquiry', () => {
    const bulletWithMetric = 'Redesigned checkout experience across web and mobile, reducing cart abandonment by 18%.';
    const evalResult = evaluateBulletQuality(bulletWithMetric, { evidencePool: ['18'] });

    expect(evalResult.hasMetric).toBe(true);
    expect(evalResult.recommendedQuestion).toBeUndefined();
    expect(evalResult.classification).toBe('EXCELLENT');
  });

  // 8. Qualitative bullet is produced when the user cannot provide a metric
  it('8. produces a strong, concrete qualitative bullet when user cannot provide a metric', () => {
    const raw = 'Redesigned the checkout experience.';
    const qualitative = craftEnhancedBullet(raw, { isQualitativeOnly: true });

    expect(qualitative).toBe(
      'Redesigned the checkout experience across web and mobile platforms, simplifying the purchase flow and improving interaction clarity.'
    );
    expect(qualitative).not.toMatch(/\d+%/);
    expect(containsPlaceholders(qualitative)).toBe(false);
  });

  // 9. Unsupported numbers are rejected by validation
  it('9. rejects operations containing ungrounded numbers or fake placeholders via validateOperation', () => {
    // Ungrounded metric
    const ungroundedOp = {
      operationId: 'op_ungrounded',
      agentRunId: 'run_test',
      reason: 'Improve onboarding bullet',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'exp_2',
      bulletIndex: 0,
      value: 'Redesigned customer onboarding, accelerating user adoption by 45%.',
      evidence: ['Redesigned the customer onboarding flow to simplify registration.'],
    };

    const ungroundedResult = validateOperation(ungroundedOp, baseResume);
    expect(ungroundedResult.ok).toBe(false);
    if (!ungroundedResult.ok) {
      expect(ungroundedResult.code).toBe('ungrounded_metric');
    }

    // Fake placeholder
    const placeholderOp = {
      operationId: 'op_placeholder',
      agentRunId: 'run_test',
      reason: 'Improve onboarding bullet with placeholder',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'exp_2',
      bulletIndex: 0,
      value: 'Redesigned customer onboarding, improving conversion by [X]%.',
      evidence: ['Redesigned the customer onboarding flow to simplify registration.'],
    };

    const placeholderResult = validateOperation(placeholderOp, baseResume);
    expect(placeholderResult.ok).toBe(false);
    if (!placeholderResult.ok) {
      expect(placeholderResult.code).toBe('placeholder_error');
    }
  });

  // 10. Multiple bullets for the same role remain distinct and evidence-based
  it('10. keeps multiple bullets for the same role distinct, preventing duplicated metrics', () => {
    const bullet1 = 'Redesigned checkout experience across web and mobile, reducing cart abandonment by 18%.';
    const bullet2 = 'Architected a modular design system adopted across 12 cross-functional product teams.';

    const eval1 = evaluateBulletQuality(bullet1, { evidencePool: ['18'] });
    const eval2 = evaluateBulletQuality(bullet2, { evidencePool: ['12'] });

    expect(eval1.score).toBeGreaterThanOrEqual(80);
    expect(eval2.score).toBeGreaterThanOrEqual(80);
    expect(eval1.hasMetric).toBe(true);
    expect(eval2.hasMetric).toBe(true);
    expect(bullet1).not.toEqual(bullet2);
  });

  // 11. Existing candidate facts are reused instead of asking again
  it('11. verifies and accepts grounded numbers from candidate profile facts in validateOperation', () => {
    const verifiedFacts = ['Customer onboarding redesign achieved 15% reduction in drop-off.'];
    const groundedOp = {
      operationId: 'op_grounded',
      agentRunId: 'run_test',
      reason: 'Apply verified fact from conversation',
      op: 'replace_bullet',
      section: 'experience',
      itemId: 'exp_2',
      bulletIndex: 0,
      value: 'Redesigned customer onboarding flow across web platforms, achieving a 15% reduction in user drop-off.',
      evidence: ['Customer onboarding redesign achieved 15% reduction in drop-off.'],
    };

    const result = validateOperation(groundedOp, baseResume, verifiedFacts);
    expect(result.ok).toBe(true);
  });

  // 12. Tailoring to a JD does not introduce unsupported skills or metrics
  it('12. ensures tailoring adheres to truthful candidate evidence without hallucinated tools or numbers', () => {
    const jdSkills = ['Kubernetes', 'Go', 'GraphQL'];

    // Operation attempting to claim 99.9% uptime and Kubernetes when candidate is a Product Designer
    const invalidTailorOp = {
      operationId: 'op_invalid_tailor',
      agentRunId: 'run_test',
      reason: 'Tailor bullet for backend role',
      op: 'insert_bullet',
      section: 'experience',
      itemId: 'exp_1',
      bulletIndex: 0,
      value: 'Implemented Kubernetes microservices architecture maintaining 99.9% uptime.',
      evidence: ['Managed a design system used by 12 cross-functional product teams.'],
    };

    const result = validateOperation(invalidTailorOp, baseResume, jdSkills);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('ungrounded_metric');
    }
  });

  // 13. Bullet length is calibrated to exactly 2 full lines
  it('13. calibrates generated and improved bullets to exactly 2 full lines (~140-220 characters / 22-35 words)', () => {
    const rawShort = 'Redesigned checkout flow.';
    const enhanced = craftEnhancedBullet(rawShort, { role: 'Product Designer' });

    expect(isTwoFullLines(enhanced)).toBe(true);
    expect(enhanced.length).toBeGreaterThanOrEqual(130);
    expect(enhanced.length).toBeLessThanOrEqual(235);
  });
});
