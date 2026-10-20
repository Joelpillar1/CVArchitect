import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TimesTemplate from '../components/templates/TimesTemplate';
import type { ResumeData } from '../types';

const sampleTimesData: ResumeData = {
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
  skills: 'Product Strategy, Roadmap Planning, Agile, Scrum',
};

describe('TimesTemplate (Times Classic) item spacing', () => {
  it('renders compact spacing between multiple single-line education entries and certifications', () => {
    const html = renderToStaticMarkup(React.createElement(TimesTemplate, { data: sampleTimesData }));

    // Education entries should not use the huge 0.16in+ itemGap between single lines
    expect(html).not.toMatch(/Ahmadu Bello University[\s\S]*?margin-bottom:0\.1[6-9]in/);
    // Certifications should also use compact spacing instead of 0.16in+
    expect(html).not.toMatch(/Google UX Design[\s\S]*?margin-bottom:0\.1[6-9]in/);
    // Both should use the compact entry gap (0.04in - 0.06in)
    expect(html).toContain('margin-bottom:0.04in');
  });

  it('uses 0.08in spacing when an education entry has coursework details', () => {
    const dataWithCoursework: ResumeData = {
      ...sampleTimesData,
      education: [
        {
          id: 'ed1',
          school: 'Ahmadu Bello University',
          degree: 'B.Sc Computer Science',
          year: 'Jan 2026',
          relevantCourses: 'Algorithms, Data Structures',
        },
        {
          id: 'ed2',
          school: 'Bayero University Kano',
          degree: 'B.Sc Mathematics',
          year: 'Jan 2023',
        },
      ],
    };

    const html = renderToStaticMarkup(React.createElement(TimesTemplate, { data: dataWithCoursework }));
    expect(html).toContain('margin-bottom:0.08in');
  });
});
