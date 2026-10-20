import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ApexTemplate from '../components/templates/ApexTemplate';
import VanguardTemplate from '../components/templates/VanguardTemplate';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ElevateResume from '../components/templates/ElevateResume';
import { formatJobTitleDisplay } from '../utils/templateUtils';
import type { ResumeData } from '../types';

const baseResumeData: ResumeData = {
  fullName: 'Sarah Jenkins',
  jobTitle: 'Senior Product Designer',
  email: 'sarah@example.com',
  phone: '+1 555-0100',
  summary: 'Experienced product designer with background in fintech.',
  skills: 'UI/UX, Figma, Prototyping',
  experience: [
    {
      id: 'exp1',
      role: 'Senior Product Designer',
      company: 'TechCorp',
      startDate: '2021',
      endDate: 'Present',
      description: ['Led design system initiatives.'],
    },
  ],
  education: [],
  certifications: [],
};

describe('Professional Title (jobTitle) default uppercase casing', () => {
  it('formatJobTitleDisplay defaults to uppercase when jobTitleCase is undefined', () => {
    expect(formatJobTitleDisplay('Senior Product Designer')).toBe('SENIOR PRODUCT DESIGNER');
    expect(formatJobTitleDisplay('full stack engineer')).toBe('FULL STACK ENGINEER');
    expect(formatJobTitleDisplay('Chief Executive Officer')).toBe('CHIEF EXECUTIVE OFFICER');
  });

  it('formatJobTitleDisplay respects explicit sentence/title case when requested', () => {
    expect(formatJobTitleDisplay('senior product designer', 'sentence')).toBe('Senior Product Designer');
    expect(formatJobTitleDisplay('CHIEF EXECUTIVE OFFICER', 'sentence')).toBe('Chief Executive Officer');
  });

  it('ApexTemplate renders professional title in uppercase by default', () => {
    const html = renderToStaticMarkup(React.createElement(ApexTemplate, { data: baseResumeData }));
    expect(html).toContain('SENIOR PRODUCT DESIGNER');
  });

  it('VanguardTemplate renders professional title in uppercase by default', () => {
    const html = renderToStaticMarkup(React.createElement(VanguardTemplate, { data: baseResumeData }));
    expect(html).toContain('SENIOR PRODUCT DESIGNER');
  });

  it('ClassicTemplate renders professional title in uppercase by default', () => {
    const html = renderToStaticMarkup(React.createElement(ClassicTemplate, { data: baseResumeData }));
    expect(html).toContain('SENIOR PRODUCT DESIGNER');
  });

  it('ElevateResume renders professional title in uppercase by default', () => {
    const html = renderToStaticMarkup(React.createElement(ElevateResume, { data: baseResumeData }));
    expect(html).toContain('SENIOR PRODUCT DESIGNER');
  });

  it('Templates respect explicit sentence case override', () => {
    const sentenceData: ResumeData = {
      ...baseResumeData,
      jobTitleCase: 'sentence',
    };
    const html = renderToStaticMarkup(React.createElement(ApexTemplate, { data: sentenceData }));
    expect(html).toContain('Senior Product Designer');
  });
});

describe('Contact Links (LinkedIn, Portfolio, GitHub) always have underline', () => {
  const contactResumeData: ResumeData = {
    ...baseResumeData,
    linkedin: 'in/sarahjenkins',
    github: 'sarahjenkins',
    portfolio: 'sarahjenkins.design',
  };

  it('ApexTemplate renders linkedin, github, and portfolio with underline', () => {
    const html = renderToStaticMarkup(React.createElement(ApexTemplate, { data: contactResumeData }));
    expect(html).toContain('data-path="linkedin"');
    expect(html).toContain('data-path="github"');
    expect(html).toContain('data-path="portfolio"');
    // Ensure all 3 links have text-decoration: underline
    expect(html).toMatch(/data-path="linkedin"[^>]*style="[^"]*text-decoration:underline/);
    expect(html).toMatch(/data-path="github"[^>]*style="[^"]*text-decoration:underline/);
    expect(html).toMatch(/data-path="portfolio"[^>]*style="[^"]*text-decoration:underline/);
  });

  it('VanguardTemplate renders linkedin, github, and portfolio with underline', () => {
    const html = renderToStaticMarkup(React.createElement(VanguardTemplate, { data: contactResumeData }));
    expect(html).toMatch(/data-path="linkedin"[^>]*style="[^"]*text-decoration:underline/);
    expect(html).toMatch(/data-path="github"[^>]*style="[^"]*text-decoration:underline/);
    expect(html).toMatch(/data-path="portfolio"[^>]*style="[^"]*text-decoration:underline/);
  });

  it('ClassicTemplate renders linkedin, github, and portfolio with underline', () => {
    const html = renderToStaticMarkup(React.createElement(ClassicTemplate, { data: contactResumeData }));
    expect(html).toMatch(/data-path="linkedin"[^>]*style="[^"]*text-decoration:underline/);
    expect(html).toMatch(/data-path="github"[^>]*style="[^"]*text-decoration:underline/);
    expect(html).toMatch(/data-path="portfolio"[^>]*style="[^"]*text-decoration:underline/);
  });
});
