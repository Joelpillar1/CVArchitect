import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RegentTemplate from '../components/templates/RegentTemplate';
import type { ResumeData } from '../types';

const sampleRegentData: ResumeData = {
  fullName: 'Emma Gates',
  jobTitle: 'Senior Product Manager',
  phone: '+123-45678',
  email: 'emma@example.com',
  location: 'San Francisco, CA',
  summary: 'Senior Product Manager specializing in enterprise SaaS platforms.',
  experience: [
    {
      id: 'e1',
      company: 'TechFlow Solutions',
      role: 'Senior Product Manager',
      startDate: '2021-03',
      endDate: 'Present',
      description: ['Spearheaded the design and deployment of analytics dashboard.'],
    },
  ],
  education: [
    {
      id: 'ed1',
      school: 'Yale University',
      degree: "Bachelor's Degree in Computer Science",
      year: '2014 - 2018',
    },
  ],
  skills: 'Strategy & Product: Product Strategy, Roadmap Planning\nMethodologies: Agile, Scrum',
  certifications: [],
};

describe('RegentTemplate header styles and casing', () => {
  it('renders section headers with 0.08in breathing room padding for horizontal lines', () => {
    const html = renderToStaticMarkup(React.createElement(RegentTemplate, { data: sampleRegentData }));

    // Section headers should have paddingTop: 0.08in and paddingBottom: 0.08in
    expect(html).toContain('padding-top:0.08in');
    expect(html).toContain('padding-bottom:0.08in');
  });

  it('renders section headers in ALL CAPS by default', () => {
    const html = renderToStaticMarkup(React.createElement(RegentTemplate, { data: sampleRegentData }));

    // Experience, Education, Skills headers should be uppercase
    expect(html).toContain('EXPERIENCE');
    expect(html).toContain('EDUCATION');
    expect(html).toContain('CORE COMPETENCIES');
  });

  it('renders professional title (jobTitle) in ALL CAPS by default', () => {
    const html = renderToStaticMarkup(React.createElement(RegentTemplate, { data: sampleRegentData }));

    // Professional title should be in uppercase
    expect(html).toContain('SENIOR PRODUCT MANAGER');
  });

  it('respects explicit sectionHeaderCase and jobTitleCase overrides when provided', () => {
    const customizedData: ResumeData = {
      ...sampleRegentData,
      sectionHeaderCase: 'titlecase',
      jobTitleCase: 'sentence',
    };

    const html = renderToStaticMarkup(React.createElement(RegentTemplate, { data: customizedData }));

    expect(html).toContain('Experience');
    expect(html).toContain('Senior Product Manager');
  });

  it('renders compact spacing between multiple education entries and multiple certifications', () => {
    const multiItemData: ResumeData = {
      ...sampleRegentData,
      education: [
        {
          id: 'ed1',
          school: 'Ahmadu Bello University',
          degree: 'B.Sc Computer Science',
          year: 'Jan 2026',
        },
        {
          id: 'ed2',
          school: 'Bayero University Kano',
          degree: 'B.Sc Mathematics',
          year: 'Jan 2023',
        },
      ],
      certifications: [
        {
          id: 'c1',
          name: 'Google UX Design',
          issuer: 'Google',
          date: 'Jan 2024',
        },
        {
          id: 'c2',
          name: 'Graphics',
          issuer: 'DesignersDAO',
          date: 'Jan 2024',
        },
      ],
    };

    const html = renderToStaticMarkup(React.createElement(RegentTemplate, { data: multiItemData }));

    // Education entries should not use the huge 0.16in+ ENTRY_GAP between single lines
    expect(html).not.toMatch(/Ahmadu Bello University[\s\S]*?margin-bottom:0\.1[6-9]in/);
    // Certifications should also use compact spacing instead of 0.16in+
    expect(html).not.toMatch(/Google UX Design[\s\S]*?margin-bottom:0\.1[6-9]in/);
    // Both should use the compact entry gap
    expect(html).toContain('margin-bottom:0.04in');
  });
});
