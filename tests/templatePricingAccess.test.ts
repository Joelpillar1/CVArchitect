import { describe, it, expect } from 'vitest';
import { FREE_TEMPLATES, ALL_TEMPLATES, getTemplatesForPlan, canAccessTemplate } from '../utils/pricingConfig';

describe('Template Pricing Access (Free vs Pro)', () => {
  it('Finance (modern) and Student Intern (intern) are Pro templates and not in FREE_TEMPLATES', () => {
    expect(FREE_TEMPLATES).not.toContain('modern');
    expect(FREE_TEMPLATES).not.toContain('intern');
    expect(ALL_TEMPLATES).toContain('modern');
    expect(ALL_TEMPLATES).toContain('intern');
  });

  it('Free/foundation plan templates list does not include Finance or Student Intern', () => {
    const freeTemplates = getTemplatesForPlan('free');
    expect(freeTemplates).not.toContain('modern');
    expect(freeTemplates).not.toContain('intern');
  });

  it('Paid plans have access to Finance and Student Intern templates', () => {
    const buildTemplates = getTemplatesForPlan('build');
    expect(buildTemplates).toContain('modern');
    expect(buildTemplates).toContain('intern');
  });
});
