import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import DevTemplate from '../components/templates/DevTemplate';
import { DEV_TEMPLATE_PREVIEW_DATA, getTemplatePreviewData } from '../utils/sampleResumeData';
import type { ResumeData } from '../types';

/**
 * Verifies the DevPro (dev) template clones the reference developer resume:
 * - centered serif name with an icon contact line beneath it and NO
 *   professional/job title rendered at the top
 * - bold serif uppercase section headers with a full-width dark rule under
 *   each heading (no grey separator lines between sections)
 * - sections: Professional Summary → Education → Work Experience →
 *   Projects/Open-Source → Involvement → Skills
 * - experience entries: bold role with right-aligned location on the first
 *   line, company with right-aligned date range on the second line, then
 *   bullets
 * - preview data uses the standard resume identity (Alexander Williams,
 *   United States) — no "New York" anywhere
 */
const devData: ResumeData = {
  ...DEV_TEMPLATE_PREVIEW_DATA,
  // Deliberately set — this template must never render it.
  jobTitle: 'SENIOR SOFTWARE DEVELOPER',
} as ResumeData;

const html = renderToStaticMarkup(React.createElement(DevTemplate, { data: devData }));

describe('DevTemplate', () => {
  it('renders the standard identity with a serif name, icon contact line, and no professional title', () => {
    expect(html).toContain('Alexander Williams');
    expect(html).toContain('United States');
    expect(html).toContain('+1 (555) 123-4567');
    expect(html).toContain('alexander.williams@example.com');
    expect(html).toContain('linkedin.com/in/alexander-williams');
    // contact icons on (reference shows map-pin / mail / phone / linkedin icons)
    expect(html).toContain('data-path="location"');
    // no job title anywhere, even though the data carries one
    expect(html).not.toContain('data-path="jobTitle"');
    expect(html).not.toContain('SENIOR SOFTWARE DEVELOPER');
    // no New York in the rendered resume
    expect(html).not.toContain('New York');
  });

  it('renders uppercase serif section headers with a dark full-width rule and no grey separators', () => {
    expect(html).toContain('>PROFESSIONAL SUMMARY<');
    expect(html).toContain('>EDUCATION<');
    expect(html).toContain('>WORK EXPERIENCE<');
    expect(html).toContain('>PROJECTS/OPEN-SOURCE<');
    expect(html).toContain('>INVOLVEMENT<');
    expect(html).toContain('>SKILLS<');
    // each header wrap carries the dark 1px rule under the heading
    expect(html).toMatch(/section-header-wrap[^>]*border-bottom:1px solid #1a1a1a/);
    // no <hr> separator lines anywhere
    expect(html).not.toContain('<hr');
  });

  it('pins the reference section arrangement: summary, education, experience, projects, involvement, skills', () => {
    const summary = html.indexOf('>PROFESSIONAL SUMMARY<');
    const edu = html.indexOf('>EDUCATION<');
    const exp = html.indexOf('>WORK EXPERIENCE<');
    const proj = html.indexOf('>PROJECTS/OPEN-SOURCE<');
    const inv = html.indexOf('>INVOLVEMENT<');
    const skills = html.indexOf('>SKILLS<');
    expect(summary).toBeGreaterThan(-1);
    expect(edu).toBeGreaterThan(summary);
    expect(exp).toBeGreaterThan(edu);
    expect(proj).toBeGreaterThan(exp);
    expect(inv).toBeGreaterThan(proj);
    expect(skills).toBeGreaterThan(inv);
  });

  it('puts the location on the job-title line and the dates on the company line', () => {
    // first line of an entry: role → location
    const roleIdx = html.indexOf('data-path="experience.0.role"');
    const locIdx = html.indexOf('data-path="experience.0.location"');
    const companyIdx = html.indexOf('data-path="experience.0.company"');
    const dateIdx = html.indexOf('June 2023');
    expect(roleIdx).toBeGreaterThan(-1);
    expect(locIdx).toBeGreaterThan(roleIdx);
    // second line: company → date range (dates follow the company, not the role)
    expect(companyIdx).toBeGreaterThan(locIdx);
    expect(dateIdx).toBeGreaterThan(companyIdx);
    // the date range never sits next to the role on the first line
    expect(dateIdx - locIdx).toBeLessThan(companyIdx - locIdx + 500);
    // company rendered plainly (no italic dash joining role and company)
    expect(html).not.toContain(' - Stripe');
  });

  it('keeps every editor data-path for experience, education, projects, involvement, summary, and skills', () => {
    expect(html).toContain('data-path="summary"');
    expect(html).toContain('data-path="education.0.degree"');
    expect(html).toContain('data-path="education.0.school"');
    expect(html).toContain('data-path="experience.0.description.0"');
    expect(html).toContain('data-path="experience.3.role"');
    expect(html).toContain('data-path="projects.0.name"');
    expect(html).toContain('data-path="projects.0.technologies"');
    expect(html).toContain('data-path="projects.1.description.1"');
    expect(html).toContain('data-path="involvement.0.company"');
    expect(html).toContain('data-path="involvement.1.description.1"');
    expect(html).toContain('data-path="skills"');
  });

  it('renders skills as category rows, keeping labels and bucketing plain lists', () => {
    // no flat grid — category rows instead
    expect(html).not.toContain('data-skills-grid');
    expect(html).not.toContain('data-skill-cell');
    const text = html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
    // labeled sample rows kept as-is with a bold "Category:" label
    expect(text).toContain('Languages:');
    expect(text).toContain('TypeScript, JavaScript, Go, Python, SQL');
    expect(text).toContain('Frameworks:');
    expect(text).toContain('Cloud & DevOps:');
    // a plain comma list is still shown in category form (auto-bucketed)
    const flat = renderToStaticMarkup(
      React.createElement(DevTemplate, { data: { ...DEV_TEMPLATE_PREVIEW_DATA, skills: 'React, Python, Docker' } as ResumeData })
    );
    const flatText = flat.replace(/<[^>]+>/g, '');
    expect(flatText).toMatch(/Languages:\s*Python/);
    expect(flatText).toMatch(/Frameworks:\s*React/);
    expect(flatText).toMatch(/Tools:\s*Docker/);
  });

  it('is returned by getTemplatePreviewData with the app font and standard identity', () => {
    const data = getTemplatePreviewData('dev');
    expect(data.fullName).toBe('Alexander Williams');
    expect(data.template).toBe('dev');
    expect(data.jobTitle).toBe('');
    expect(data.location).toBe('United States');
    expect(data.font).toContain('Merriweather');
    expect(data.sectionTitles?.summary).toBe('Professional Summary');
    expect(data.sectionTitles?.experience).toBe('Work Experience');
    expect(JSON.stringify(data)).not.toContain('New York');
  });
});
