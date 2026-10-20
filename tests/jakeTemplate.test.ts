import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import JakeTemplate from '../components/templates/JakeTemplate';
import { JAKE_TEMPLATE_PREVIEW_DATA } from '../utils/sampleResumeData';
import type { ResumeData } from '../types';

/**
 * Verifies the Jake Template clones the source resume's layout:
 * - bold serif centered name with a plain pipe-separated contact line beneath
 *   it (links underlined, no dark banner)
 * - small-caps serif section headers with full-width rules
 * - sections arranged Education → Experience → Projects → Technical Skills
 *   regardless of the data's section order
 * - entries indented from the section rule, bullets indented further
 * - education: bold school + right location / italic degree + italic date
 * - experience: bold role + date / italic company + italic location / bullets
 * - projects: bold "Name | italic Technologies" + right-aligned date
 * - bold "Label: value" technical-skills rows
 * - Leadership hidden by default like the other sections absent from the
 *   source resume (renders again on explicit opt-in)
 */
const jakeData: ResumeData = {
  fullName: 'Firstname Lastname',
  jobTitle: 'Professional Role',
  email: 'jake@su.edu',
  phone: '123-456-7890',
  linkedin: 'linkedin.com/in/jake',
  atHandle: 'github.com/jake',
  location: '',
  address: '',
  summary: 'Summary line that must stay hidden by default.',
  experience: [
    {
      id: 'e1',
      company: 'ABC Company',
      role: 'Junior Data Scientist Intern',
      location: 'Vancouver, BC',
      startDate: '2021-09',
      endDate: '2022-01',
      description: ['Participated in the development of the Hyper-Kamiokande experiment'],
    },
  ],
  education: [
    {
      id: 'd1',
      school: 'University of British Columbia',
      degree: 'Bachelor of Science, Computer Science',
      year: 'Jan. 2018 - May 2023',
      location: 'Vancouver, BC',
    },
  ],
  skills:
    'Languages: Python, Javascript, Typescript, Java, SQL, C++\n' +
    'Frameworks: React.js, Django, JUnit, Tensorflow',
  certifications: [{ id: 'c1', name: 'Deep Learning Certificate', issuer: 'Coursera', date: '2022' }],
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
      name: 'Gitytics',
      description: 'Developed a full-stack web application using Flask',
      technologies: 'Python, Flask, React, PostgreSQL, Docker',
      date: 'July 2023',
    },
  ],
  font: 'Times New Roman',
  fontSizes: { header: 20, jobTitle: 11, sectionTitle: 11, body: 9 },
  lineHeight: 1.4,
  sectionGap: 0.1,
  headerGap: 0.08,
  accentColor: '#000000',
  headerAlignment: 'center',
  contactAlignment: 'center',
  bodyHeaderAlignment: 'left',
  showContactIcons: false,
  sectionOrder: ['education', 'experience', 'projects', 'skills'],
  source: 'scratch',
} as ResumeData;

const html = renderToStaticMarkup(React.createElement(JakeTemplate, { data: jakeData }));

describe('JakeTemplate', () => {
  it('renders the serif name with a plain underlined-link contact line and no dark banner', () => {
    expect(html).toContain('Firstname Lastname');
    // no dark band behind/under the contact (the thin section rules are
    // intentionally black — they are part of the reference layout)
    expect(html).not.toContain('min-height:0.22in');
    expect(html).not.toContain('#D32020');
    expect(html).not.toContain('color:#FFFFFF');
    // contact div follows the name directly — no banner element between them
    expect(html).toMatch(/<\/h1><div class="flex flex-wrap items-center w-full mx-auto text-gray-900/);
    // name uses the template's serif font — no sans-serif override anywhere
    expect(html).not.toContain('Arial');
    expect(html).toContain('Times New Roman');
    // arrangement: name → contact line → first section
    const nameIdx = html.indexOf('Firstname Lastname');
    const phoneIdx = html.indexOf('123-456-7890');
    const eduIdx = html.indexOf('>Education<');
    expect(nameIdx).toBeGreaterThan(-1);
    expect(phoneIdx).toBeGreaterThan(nameIdx);
    expect(eduIdx).toBeGreaterThan(phoneIdx);
    // contact items pipe-separated with working links
    expect(html).toContain('mailto:jake@su.edu');
    expect(html).toContain('in/jake');
    expect(html).toContain('github.com/jake');
    expect(html).toMatch(/<span class="mx-1.5 select-none">\|<\/span>/);
    // links underlined like the reference
    expect(html).toContain('text-decoration:underline');
    // no professional/role title line on this template
    expect(html).not.toContain('Professional Role');
    expect(html).not.toContain('data-path="jobTitle"');
  });

  it('renders small-caps section headers with a rule, not the legacy all-caps default', () => {
    expect(html).toContain('font-variant:small-caps');
    expect(html).toContain('>Education<');
    expect(html).toContain('>Experience<');
    expect(html).toContain('>Projects<');
    expect(html).toContain('>Technical Skills<');
    expect(html).not.toContain('>EDUCATION<');
    expect(html).toContain('section-divider');
    // body is serif
    expect(html).toContain('Times New Roman');
  });

  it('renders Education → Experience → Projects → Technical Skills and adheres to reordering', () => {
    const edu = html.indexOf('>Education<');
    const exp = html.indexOf('>Experience<');
    const proj = html.indexOf('>Projects<');
    const skills = html.indexOf('>Technical Skills<');
    expect(edu).toBeGreaterThan(-1);
    expect(exp).toBeGreaterThan(edu);
    expect(proj).toBeGreaterThan(exp);
    expect(skills).toBeGreaterThan(proj);

    // Test explicit reordering:
    const reorderedHtml = renderToStaticMarkup(React.createElement(JakeTemplate, {
      data: {
        ...jakeData,
        sectionOrder: ['skills', 'projects', 'experience', 'education'],
      },
    }));
    const reorderedSkills = reorderedHtml.indexOf('>Technical Skills<');
    const reorderedProj = reorderedHtml.indexOf('>Projects<');
    const reorderedExp = reorderedHtml.indexOf('>Experience<');
    const reorderedEdu = reorderedHtml.indexOf('>Education<');
    expect(reorderedSkills).toBeGreaterThan(-1);
    expect(reorderedProj).toBeGreaterThan(reorderedSkills);
    expect(reorderedExp).toBeGreaterThan(reorderedProj);
    expect(reorderedEdu).toBeGreaterThan(reorderedExp);
  });

  it('indents section entries from the rule and bullets further still', () => {
    expect(html).toContain('padding-left:0.18in');
    expect(html).toContain('list-disc list-outside ml-4');
    // entries sit inside the padded wrapper (content appears after the indent)
    expect(html).toMatch(/padding-left:0\.18in[\s\S]*University of British Columbia/);
  });

  it('renders education as bold school + right location, italic degree + right italic date', () => {
    const schoolIdx = html.indexOf('University of British Columbia');
    const locIdx = html.indexOf('Vancouver, BC');
    const degreeIdx = html.indexOf('Bachelor of Science, Computer Science');
    const dateIdx = html.indexOf('Jan. 2018 - May 2023');
    expect(schoolIdx).toBeGreaterThan(-1);
    expect(locIdx).toBeGreaterThan(schoolIdx);
    expect(degreeIdx).toBeGreaterThan(locIdx);
    expect(dateIdx).toBeGreaterThan(degreeIdx);
    // date is italic and right-aligned on line 2
    expect(html).toMatch(/class="italic shrink-0 ml-4"/);
    // location sits in the school row (data-path education.0.location)
    expect(html).toContain('data-path="education.0.location"');
  });

  it('renders experience as bold role + date, then italic company + italic location', () => {
    expect(html).toContain('Junior Data Scientist Intern');
    expect(html).toContain('Sep 2021 - Jan 2022');
    expect(html).toContain('ABC Company');
    expect(html).toMatch(/class="shrink-0 ml-4" data-path="experience\.0\.location"/);
    expect(html).toContain('Participated in the development of the Hyper-Kamiokande experiment');
  });

  it('renders projects as "Name | italic Technologies" with the date right aligned', () => {
    const nameIdx = html.indexOf('Gitytics');
    const techIdx = html.indexOf('Python, Flask, React, PostgreSQL, Docker');
    const dateIdx = html.indexOf('July 2023');
    expect(nameIdx).toBeGreaterThan(-1);
    expect(techIdx).toBeGreaterThan(nameIdx);
    expect(dateIdx).toBeGreaterThan(techIdx);
    expect(html).toMatch(/class="font-normal italic"/);
    expect(html).toContain('data-path="projects.0.date"');
  });

  it('renders technical skills as bold "Label: value" rows', () => {
    expect(html).toMatch(/Languages<\/span>:/);
    expect(html).toMatch(/Frameworks<\/span>:/);
    expect(html).toContain('Python, Javascript, Typescript, Java, SQL, C++');
    // label rows carry the skills data-path so edits write back to data.skills
    expect(html).toContain('data-path="skills"');
  });

  it('hides Professional Summary, Key Achievements, Certifications, Additional Information, Leadership and References by default', () => {
    // the content exists in the data but must not render on this template
    expect(html).not.toContain('Summary line that must stay hidden by default.');
    expect(html).not.toContain('A key achievement bullet');
    expect(html).not.toContain('Deep Learning Certificate');
    expect(html).not.toContain('Robotics');
    expect(html).not.toContain('Dr. Reference Available');
    expect(html).not.toContain('A leadership bullet that must stay hidden by default.');
    expect(html).not.toContain('>Professional Summary<');
    expect(html).not.toContain('>References<');
    expect(html).not.toContain('>Leadership<');
  });

  it('renders those sections once the user explicitly adds them', () => {
    const optedIn = renderToStaticMarkup(
      React.createElement(JakeTemplate, {
        data: {
          ...jakeData,
          sectionVisibility: {
            summary: true,
            achievements: true,
            certifications: true,
            additional_information: true,
            references: true,
            leadership: true,
          },
        },
      })
    );
    expect(optedIn).toContain('>Professional Summary<');
    expect(optedIn).toContain('Summary line that must stay hidden by default.');
    expect(optedIn).toContain('A key achievement bullet');
    expect(optedIn).toContain('Deep Learning Certificate');
    expect(optedIn).toContain('Robotics');
    expect(optedIn).toContain('Dr. Reference Available');
    // leadership renders too once explicitly opted in
    expect(optedIn).toContain('>Leadership<');
    expect(optedIn).toContain('A leadership bullet that must stay hidden by default.');
  });

  it('renders technical skills in categories even from a plain comma list', () => {
    const flat = renderToStaticMarkup(
      React.createElement(JakeTemplate, {
        data: { ...jakeData, skills: 'Java, Python, SQL, React, Django, Git, Docker' },
      })
    );
    expect(flat).toMatch(/Languages<\/span>:/);
    expect(flat).toMatch(/Frameworks<\/span>:/);
    expect(flat).toMatch(/Tools<\/span>:/);
  });
});

describe('JakeTemplate preview data', () => {
  const previewHtml = renderToStaticMarkup(React.createElement(JakeTemplate, { data: JAKE_TEMPLATE_PREVIEW_DATA }));

  it('carries three experience entries and three projects with three bullets each', () => {
    expect(JAKE_TEMPLATE_PREVIEW_DATA.experience).toHaveLength(3);
    expect(JAKE_TEMPLATE_PREVIEW_DATA.projects).toHaveLength(3);
    // the two added projects carry exactly three bullets each
    const gitytics = JAKE_TEMPLATE_PREVIEW_DATA.projects.find((p) => p.name === 'Gitytics');
    const paintball = JAKE_TEMPLATE_PREVIEW_DATA.projects.find((p) => p.name === 'Simple Paintball');
    const asLines = (desc: string | string[] | undefined) =>
      Array.isArray(desc) ? desc : (desc || '').split('\n');
    expect(asLines(gitytics?.description)).toHaveLength(3);
    expect(asLines(paintball?.description)).toHaveLength(3);
  });

  it('renders the added entries and no Leadership section', () => {
    expect(previewHtml).toContain('Information Technology Support Specialist');
    expect(previewHtml).toContain('Gitytics');
    expect(previewHtml).toContain('Simple Paintball');
    // three bullets rendered for each added project
    expect(previewHtml).toContain('Deployed website on AWS EC2');
    expect(previewHtml).toContain('Deployed website on shared Linux web server');
    // no Leadership section, even though the base gallery data includes one
    // (match the h2 header specifically — the skills rows may legitimately
    // carry a "Leadership:" category label)
    expect(previewHtml).not.toMatch(/<h2[^>]*>Leadership<\/h2>/);
    expect(previewHtml).not.toContain('Chapter President');
    expect(previewHtml).not.toContain('Organized monthly workshops');
  });
});
