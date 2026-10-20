import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ScholarTemplate from '../components/templates/ScholarTemplate';
import {
  SCHOLAR_TEMPLATE_PREVIEW_DATA,
  getTemplatePreviewData,
} from '../utils/sampleResumeData';
import type { ResumeData } from '../types';

/**
 * Verifies the Scholar template clones the academic CV reference:
 * - bold centered name with a gap-separated contact line beneath it (location,
 *   email, phone, LinkedIn/GitHub label links opening their destinations —
 *   links tinted with the accent color, no banner), no job-title line
 * - uppercase serif section titles with a full-width rule BELOW each title
 * - sections arranged Education → Skills → Projects → Experience →
 *   Certifications regardless of the data's section order
 * - education: bold school + right location / italic degree + italic date
 * - experience: bold company + right location / italic role + italic date / bullets
 * - projects: bold name + right italic date, technologies on their own italic line
 * - plain bold "Label: value" skill rows (no bullets)
 * - certifications: bold issuer + ": " + name
 * - Summary, Leadership, Achievements, Additional Info and References hidden by
 *   default (render again on explicit opt-in)
 * - the app font (data.font → Merriweather fallback), not a hardcoded face
 */
const scholarData: ResumeData = {
  fullName: 'Firstname Lastname',
  jobTitle: 'Professional Role',
  email: 'first@example.com',
  phone: '123-456-7890',
  linkedin: 'linkedin.com/in/first',
  github: 'github.com/first',
  location: 'Cincinnati, OH',
  address: '',
  summary: 'Summary line that must stay hidden by default.',
  experience: [
    {
      id: 'e1',
      company: 'Conseil Departemental',
      role: 'Network Engineering Intern',
      location: 'Limoges, France',
      startDate: '2026-05',
      endDate: '2026-08',
      description: ['Evaluated and deployed virtualization hypervisors.'],
    },
  ],
  education: [
    {
      id: 'd1',
      school: 'University of Cincinnati',
      degree: 'Master of Engineering in Artificial Intelligence',
      year: 'Aug. 2026 - Expected Aug. 2027',
      location: 'Cincinnati, OH, USA',
    },
  ],
  skills:
    'Programming: Python, C/C++, Java, SQL\n' +
    'Languages: French (Native), English (Professional)',
  certifications: [
    { id: 'c1', issuer: 'Hugging Face', name: 'The LLM Course - Transformers, NLP', date: '' },
  ],
  keyAchievements: ['A key achievement bullet'],
  additionalInfo: [{ id: 'a1', label: 'Interests', value: 'Robotics' }],
  leadership: [
    {
      id: 'l1',
      role: 'Team Lead',
      company: 'Robotics Club',
      description: ['A leadership bullet that must stay hidden by default.'],
    },
  ],
  referee: 'Dr. Reference Available',
  projects: [
    {
      id: 'p1',
      name: 'Soccer Coach RAG Assistant',
      description: 'Built a retrieval pipeline with sentence-transformer embeddings.',
      technologies: 'Python, RAG, Ollama, ChromaDB',
      date: 'Jul. 2026 - Present',
    },
  ],
  font: 'Merriweather, serif',
  fontSizes: { header: 20, jobTitle: 11, sectionTitle: 11, body: 9.5 },
  lineHeight: 1.4,
  sectionGap: 0.1,
  headerGap: 0.08,
  accentColor: '#1F3864',
  headerAlignment: 'center',
  contactAlignment: 'center',
  bodyHeaderAlignment: 'left',
  showContactIcons: false,
  sectionOrder: ['education', 'skills', 'projects', 'experience', 'certifications'],
  source: 'scratch',
} as ResumeData;

const html = renderToStaticMarkup(React.createElement(ScholarTemplate, { data: scholarData }));

describe('ScholarTemplate', () => {
  it('renders the app font, centered name and a gap-separated contact line (no pipes, no job title)', () => {
    expect(html).toContain('Firstname Lastname');
    // the app font, not a hardcoded Times New Roman
    expect(html).toContain('font-family:Merriweather, serif');
    expect(html).not.toContain('Times New Roman');
    expect(html).not.toContain('Arial');
    // no pipe separators in the contact line
    expect(html).not.toContain('select-none">|</span>');
    // no banner behind the contact and no job-title line
    expect(html).not.toContain('data-path="jobTitle"');
    expect(html).not.toContain('Professional Role');
    // location leads the contact line, links carry the accent color
    const locIdx = html.indexOf('Cincinnati, OH');
    const emIdx = html.indexOf('mailto:first@example.com');
    expect(locIdx).toBeGreaterThan(-1);
    expect(emIdx).toBeGreaterThan(locIdx);
    // label links (LinkedIn/GitHub, not the whole URL) that open the
    // destination profile directly on click
    expect(html).toMatch(/>LinkedIn<\/a>/);
    expect(html).toMatch(/>GitHub<\/a>/);
    expect(html).toMatch(/href="[^"]*linkedin\.com\/in\/first/);
    expect(html).toMatch(/href="[^"]*github\.com\/first/);
    expect(html).toContain('color:#1F3864');
    // arrangement: name → contact → first section
    const nameIdx = html.indexOf('Firstname Lastname');
    const eduIdx = html.indexOf('>EDUCATION<');
    expect(eduIdx).toBeGreaterThan(emIdx);
    expect(nameIdx).toBeGreaterThan(-1);
  });

  it('renders uppercase serif section titles with the rule below and no grey rule above', () => {
    expect(html).toContain('>EDUCATION<');
    expect(html).toContain('>SKILLS<');
    expect(html).toContain('>PROJECTS<');
    expect(html).toContain('>EXPERIENCE<');
    // rule sits below the title inside section-header-wrap
    expect(html).toMatch(/section-header[\s\S]{0,400}?section-divider/);
    // no legacy grey rule above titles
    expect(html).not.toContain('border-top');
  });

  it('renders Education → Skills → Projects → Experience and adheres to reordering', () => {
    const edu = html.indexOf('>EDUCATION<');
    const skills = html.indexOf('>SKILLS<');
    const proj = html.indexOf('>PROJECTS<');
    const exp = html.indexOf('>EXPERIENCE<');
    expect(edu).toBeGreaterThan(-1);
    expect(skills).toBeGreaterThan(edu);
    expect(proj).toBeGreaterThan(skills);
    expect(exp).toBeGreaterThan(proj);
    // sections missing from the data order (summary/leadership) stay hidden
    expect(html).not.toContain('Summary line that must stay hidden by default.');
    expect(html).not.toContain('A leadership bullet that must stay hidden by default.');
    expect(html).not.toContain('Dr. Reference Available');
    expect(html).not.toContain('A key achievement bullet');
    expect(html).not.toContain('Robotics');

    // Test explicit reordering:
    const reorderedHtml = renderToStaticMarkup(React.createElement(ScholarTemplate, {
      data: {
        ...scholarData,
        sectionOrder: ['experience', 'education', 'skills', 'projects'],
      },
    }));
    const reorderedExp = reorderedHtml.indexOf('>EXPERIENCE<');
    const reorderedEdu = reorderedHtml.indexOf('>EDUCATION<');
    expect(reorderedExp).toBeGreaterThan(-1);
    expect(reorderedEdu).toBeGreaterThan(reorderedExp);
  });

  it('renders education as bold school + right location, italic degree + right italic date', () => {
    const schoolIdx = html.indexOf('University of Cincinnati');
    const locIdx = html.indexOf('Cincinnati, OH, USA');
    const degreeIdx = html.indexOf('Master of Engineering in Artificial Intelligence');
    const dateIdx = html.indexOf('Aug. 2026 - Expected Aug. 2027');
    expect(schoolIdx).toBeGreaterThan(-1);
    expect(locIdx).toBeGreaterThan(schoolIdx);
    expect(degreeIdx).toBeGreaterThan(locIdx);
    expect(dateIdx).toBeGreaterThan(degreeIdx);
    expect(html).toContain('data-path="education.0.location"');
  });

  it('renders experience as bold company + right location, italic role + right italic date', () => {
    // company leads (the inversion vs Jake)
    const companyIdx = html.indexOf('Conseil Departemental');
    const roleIdx = html.indexOf('Network Engineering Intern');
    expect(companyIdx).toBeGreaterThan(-1);
    expect(roleIdx).toBeGreaterThan(companyIdx);
    // formatted date range for the experience entry
    expect(html).toContain('May 2026 - Aug 2026');
    expect(html).toContain('Evaluated and deployed virtualization hypervisors.');
    expect(html).toContain('data-path="experience.0.location"');
    // bullets are disc-style
    expect(html).toContain('list-disc list-outside');
  });

  it('renders projects as bold name + right italic date, technologies on their own italic line', () => {
    const nameIdx = html.indexOf('Soccer Coach RAG Assistant');
    const dateIdx = html.indexOf('Jul. 2026 - Present');
    const techIdx = html.indexOf('Python, RAG, Ollama, ChromaDB');
    expect(nameIdx).toBeGreaterThan(-1);
    expect(dateIdx).toBeGreaterThan(nameIdx);
    // technologies come after the date on a separate italic line
    expect(techIdx).toBeGreaterThan(dateIdx);
    expect(html).toContain('data-path="projects.0.date"');
    expect(html).toContain('Built a retrieval pipeline');
  });

  it('renders skills as plain bold "Label: value" rows without bullets', () => {
    expect(html).toMatch(/Programming<\/span>:/);
    expect(html).toMatch(/Languages<\/span>:/);
    expect(html).toContain('Python, C/C++, Java, SQL');
    expect(html).toContain('data-path="skills"');
    // no bullet markers anywhere inside the skills block
    const skillsBlock = html.slice(html.indexOf('data-path="skills"'), html.indexOf('>PROJECTS<'));
    expect(skillsBlock).not.toContain('list-disc');
  });

  it('buckets a plain comma skills list into categories', () => {
    const flat = renderToStaticMarkup(
      React.createElement(ScholarTemplate, {
        data: { ...scholarData, skills: 'Java, Python, SQL, React, Docker, Git' },
      })
    );
    expect(flat).toMatch(/Languages<\/span>:/);
    expect(flat).toMatch(/Frameworks<\/span>:/);
  });

  it('renders certifications as bold issuer + colon + name', () => {
    expect(html).toMatch(/Hugging Face<\/span>:/);
    expect(html).toContain('The LLM Course - Transformers, NLP');
    expect(html).toContain('data-path="certifications.0.issuer"');
  });

  it('renders hidden sections once the user explicitly adds them', () => {
    const optedIn = renderToStaticMarkup(
      React.createElement(ScholarTemplate, {
        data: {
          ...scholarData,
          sectionVisibility: {
            summary: true,
            achievements: true,
            additional_information: true,
            references: true,
            leadership: true,
          },
        },
      })
    );
    expect(optedIn).toContain('Summary line that must stay hidden by default.');
    expect(optedIn).toContain('A key achievement bullet');
    expect(optedIn).toContain('Robotics');
    expect(optedIn).toContain('Dr. Reference Available');
    expect(optedIn).toContain('A leadership bullet that must stay hidden by default.');
  });
});

describe('ScholarTemplate preview data', () => {
  const previewHtml = renderToStaticMarkup(
    React.createElement(ScholarTemplate, { data: SCHOLAR_TEMPLATE_PREVIEW_DATA })
  );

  it('carries the standard demo identity and reference content', () => {
    expect(SCHOLAR_TEMPLATE_PREVIEW_DATA.fullName).toBe('Alexander Williams');
    expect(SCHOLAR_TEMPLATE_PREVIEW_DATA.email).toBe('alexander.williams@example.com');
    expect(SCHOLAR_TEMPLATE_PREVIEW_DATA.education).toHaveLength(3);
    expect(SCHOLAR_TEMPLATE_PREVIEW_DATA.projects).toHaveLength(6);
    expect(SCHOLAR_TEMPLATE_PREVIEW_DATA.experience).toHaveLength(2);
    expect(SCHOLAR_TEMPLATE_PREVIEW_DATA.certifications).toHaveLength(2);
    expect(previewHtml).toContain('Alexander Williams');
    expect(previewHtml).toContain('Soccer Coach RAG Assistant');
    expect(previewHtml).toContain('Bordeaux INP Football Team');
    expect(previewHtml).toContain('Kaggle');
  });

  it('shows exactly the reference sections in order: EDUCATION → SKILLS → PROJECTS → EXPERIENCE → CERTIFICATIONS', () => {
    const order = [
      '>EDUCATION<',
      '>SKILLS<',
      '>PROJECTS<',
      '>EXPERIENCE<',
      '>CERTIFICATIONS &amp; ONLINE COURSES<',
    ].map((needle) => previewHtml.indexOf(needle));
    order.forEach((idx) => expect(idx).toBeGreaterThan(-1));
    for (let i = 1; i < order.length; i++) {
      expect(order[i]).toBeGreaterThan(order[i - 1]);
    }
    // nothing else renders
    expect(previewHtml).not.toMatch(/<h2[^>]*>SUMMARY<\/h2>/);
    expect(previewHtml).not.toMatch(/<h2[^>]*>LEADERSHIP<\/h2>/);
    expect(previewHtml).not.toMatch(/<h2[^>]*>ADDITIONAL INFORMATION<\/h2>/);
    expect(previewHtml).not.toContain('Chapter President');
  });

  it('renders compact spacing between multiple single-line education entries and certifications', () => {
    const multiEntryData: ResumeData = {
      ...scholarData,
      education: [
        {
          id: 'ed1',
          school: 'University of Cincinnati',
          degree: 'Master of Engineering',
          year: '2026',
        },
        {
          id: 'ed2',
          school: 'Bayero University Kano',
          degree: 'B.Sc Mathematics',
          year: '2023',
        },
      ],
      certifications: [
        {
          id: 'c1',
          name: 'The LLM Course',
          issuer: 'Hugging Face',
          date: '2024',
        },
        {
          id: 'c2',
          name: 'Deep Learning Specialization',
          issuer: 'Coursera',
          date: '2024',
        },
      ],
    };

    const rendered = renderToStaticMarkup(React.createElement(ScholarTemplate, { data: multiEntryData }));
    // Single-line entries should not use large 0.16in+ gaps
    expect(rendered).not.toMatch(/University of Cincinnati[\s\S]*?margin-bottom:0\.1[6-9]in/);
    expect(rendered).not.toMatch(/The LLM Course[\s\S]*?margin-bottom:0\.1[6-9]in/);
    // Should use compact entry gap (0.04in - 0.06in)
    expect(rendered).toMatch(/margin-bottom:0\.0[4-6]in/);
  });

  it('is returned by getTemplatePreviewData with the app font', () => {
    const data = getTemplatePreviewData('scholar');
    expect(data.font).toBe('Merriweather, serif');
    expect(data.fullName).toBe('Alexander Williams');
    expect(data.sectionOrder).toEqual([
      'education',
      'skills',
      'projects',
      'experience',
      'certifications',
    ]);
    expect(data.accentColor).toBe('#1F3864');
  });
});
