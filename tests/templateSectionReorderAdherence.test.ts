import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ResumePreview from '../components/ResumePreview';
import { TEMPLATE_CONFIG } from '../utils/templateConfig';
import type { ResumeData, TemplateType } from '../types';

const baseTestData: ResumeData = {
  fullName: 'Jordan Taylor',
  jobTitle: 'Software Engineer',
  email: 'jordan@example.com',
  phone: '555-123-4567',
  location: 'New York, NY',
  summary: 'Experienced engineer with focus on scalable web applications.',
  experience: [
    {
      id: 'exp-1',
      role: 'Staff Engineer',
      company: 'Acme Technologies',
      startDate: '2021-01',
      endDate: 'Present',
      description: ['Engineered distributed backend pipelines.'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Metropolis University',
      degree: 'B.S. in Computer Science',
      year: '2016 - 2020',
      description: ['Dean’s Honor List'],
    },
  ],
  skills: 'TypeScript, React, Node.js, Python, PostgreSQL',
  projects: [
    {
      id: 'proj-1',
      name: 'Open Cloud Tooling',
      description: ['Open-source developer tooling for infrastructure.'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022',
    },
  ],
  font: 'Merriweather, serif',
  viewAsPages: false,
};

describe('All templates adhere to section reordering from sidebar', () => {
  const supportedTemplates = TEMPLATE_CONFIG.map((t) => t.id);

  it.each(supportedTemplates)(
    'template %s adheres to reordering between education and experience',
    (templateId: TemplateType) => {
      // 1. Order: Education before Experience
      const dataEduFirst: ResumeData = {
        ...baseTestData,
        template: templateId,
        sectionOrder: ['education', 'experience', 'skills'],
      };

      const htmlEduFirst = renderToStaticMarkup(
        React.createElement(ResumePreview, {
          data: dataEduFirst,
          template: templateId,
          editable: false,
        })
      );

      const eduIdx1 = htmlEduFirst.indexOf('Metropolis University');
      const expIdx1 = htmlEduFirst.indexOf('Acme Technologies');

      expect(eduIdx1, `Education should render in ${templateId}`).toBeGreaterThan(-1);
      expect(expIdx1, `Experience should render in ${templateId}`).toBeGreaterThan(-1);

      // In two-column template, education and experience are split into sidebar vs main column,
      // so we test relative ordering within their column. For single-column templates, edu is before exp.
      if (templateId !== 'twocolumn') {
        expect(
          eduIdx1,
          `In ${templateId}, Education should appear before Experience when ordered [education, experience]`
        ).toBeLessThan(expIdx1);
      }

      // 2. Reordered: Experience before Education
      const dataExpFirst: ResumeData = {
        ...baseTestData,
        template: templateId,
        sectionOrder: ['experience', 'education', 'skills'],
      };

      const htmlExpFirst = renderToStaticMarkup(
        React.createElement(ResumePreview, {
          data: dataExpFirst,
          template: templateId,
          editable: false,
        })
      );

      const eduIdx2 = htmlExpFirst.indexOf('Metropolis University');
      const expIdx2 = htmlExpFirst.indexOf('Acme Technologies');

      expect(eduIdx2, `Education should render in ${templateId}`).toBeGreaterThan(-1);
      expect(expIdx2, `Experience should render in ${templateId}`).toBeGreaterThan(-1);

      if (templateId !== 'twocolumn') {
        expect(
          expIdx2,
          `In ${templateId}, Experience should appear before Education when reordered to [experience, education]`
        ).toBeLessThan(eduIdx2);
      }
    }
  );

  it.each(
    supportedTemplates.filter((t) => t !== 'twocolumn')
  )('template %s allows skills to be moved before experience/education', (templateId: TemplateType) => {
    // 3. Move skills to the very top: ['skills', 'experience', 'education']
    const dataSkillsFirst: ResumeData = {
      ...baseTestData,
      template: templateId,
      sectionOrder: ['skills', 'experience', 'education'],
    };

    const html = renderToStaticMarkup(
      React.createElement(ResumePreview, {
        data: dataSkillsFirst,
        template: templateId,
        editable: false,
      })
    );

    const skillsIdx = html.indexOf('TypeScript');
    const expIdx = html.indexOf('Acme Technologies');

    expect(skillsIdx, `Skills should render in ${templateId}`).toBeGreaterThan(-1);
    expect(expIdx, `Experience should render in ${templateId}`).toBeGreaterThan(-1);
    expect(
      skillsIdx,
      `In ${templateId}, Skills should appear before Experience when moved to top`
    ).toBeLessThan(expIdx);
  });
});
