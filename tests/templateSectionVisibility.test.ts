import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ResumePreview from '../components/ResumePreview';
import { TEMPLATE_CONFIG } from '../utils/templateConfig';
import type { ResumeData, TemplateType } from '../types';

/**
 * Universal section model contract:
 * - every template renders every section kind when it is present and visible
 * - the per-section eye toggle removes that section from the rendered output
 * - a user-added custom section renders immediately
 *
 * These are structural render tests, not pixel tests. Each section gets a
 * unique marker so a marker appearing anywhere in the HTML proves the section
 * rendered, and a hidden section's marker disappearing proves the toggle works.
 */

// Pure digit markers survive the title-case / uppercase transforms some
// templates apply to section content, so a missing marker always means the
// section was not rendered rather than re-cased.
const MARKERS: Record<string, string> = {
  summary: '900001',
  experience: '900002',
  education: '900003',
  skills: '900004',
  projects: '900005',
  certifications: '900006',
  leadership: '900007',
  languages: '900008',
  additional_information: '900009',
  achievements: '900010',
  awards: '900011',
  custom_test: '900012',
};

const ALL_SECTIONS = Object.keys(MARKERS);

function baseData(template: TemplateType): ResumeData {
  return {
    fullName: 'Jordan Taylor',
    jobTitle: 'Software Engineer',
    email: 'jordan@example.com',
    phone: '555-123-4567',
    location: 'New York, NY',
    summary: MARKERS.summary,
    experience: [
      {
        id: 'exp-1',
        role: 'Staff Engineer',
        company: MARKERS.experience,
        startDate: '2021-01',
        endDate: 'Present',
        description: ['Engineered distributed backend pipelines.'],
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: MARKERS.education,
        degree: 'B.S. in Computer Science',
        year: '2016 - 2020',
      },
    ],
    skills: MARKERS.skills,
    projects: [
      {
        id: 'proj-1',
        name: MARKERS.projects,
        description: ['Open-source developer tooling for infrastructure.'],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: MARKERS.certifications,
        issuer: 'Amazon Web Services',
        date: '2022',
      },
    ],
    leadership: [
      {
        id: 'lead-1',
        role: 'Community Lead',
        company: MARKERS.leadership,
        startDate: '2022',
        endDate: 'Present',
        description: ['Built a local engineering community.'],
      },
    ],
    languages: [
      { id: 'lang-1', language: MARKERS.languages, proficiency: 'Native' },
    ],
    additionalInfo: [
      { id: 'info-1', label: 'Clearance', value: MARKERS.additional_information },
    ],
    keyAchievements: [MARKERS.achievements],
    awards: [MARKERS.awards],
    customSections: {
      custom_test: {
        id: 'custom_test',
        title: 'Notes',
        contentType: 'text',
        content: MARKERS.custom_test,
      },
    },
    sectionOrder: [...ALL_SECTIONS],
    sectionVisibility: Object.fromEntries(ALL_SECTIONS.map((id) => [id, true])),
    template: template,
    font: 'Merriweather, serif',
    viewAsPages: false,
  };
}

function render(data: ResumeData, template: TemplateType): string {
  return renderToStaticMarkup(
    React.createElement(ResumePreview, {
      data,
      template,
      editable: false,
    })
  );
}

describe('every template renders every visible section', () => {
  const templates = TEMPLATE_CONFIG.map((t) => t.id);

  it.each(templates)('%s renders all section kinds', (templateId: TemplateType) => {
    const html = render(baseData(templateId), templateId);
    for (const [section, marker] of Object.entries(MARKERS)) {
      expect(
        html,
        `${templateId} should render ${section} when it is visible`
      ).toContain(marker);
    }
  });

  it.each(templates)('%s hides each section with the eye toggle', (templateId: TemplateType) => {
    for (const section of ALL_SECTIONS) {
      const data = baseData(templateId);
      data.sectionVisibility = { ...data.sectionVisibility, [section]: false };
      const html = render(data, templateId);
      expect(
        html,
        `${templateId} should hide ${section} when sectionVisibility[${section}] is false`
      ).not.toContain(MARKERS[section]);
    }
  });
});
