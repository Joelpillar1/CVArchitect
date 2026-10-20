import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AnalystTemplate from '../components/templates/AnalystTemplate';
import { GAURAV_TEMPLATE_PREVIEW_DATA } from '../utils/sampleResumeData';
import type { ResumeData } from '../types';

/**
 * Verifies the Gaurav Template clones the source Data Analyst resume:
 * - bold serif centered ALL-CAPS name with a plain pipe-separated contact
 *   line beneath it (phone | email | LinkedIn | GitHub labels, links underlined)
 * - serif body; section headers rendered exactly as authored (ALL CAPS plus a
 *   Title Case "Certification") with a full-width rule underneath
 * - sections arranged Summary → Core Skills → Experience → Education →
 *   Certification regardless of the data's section order
 * - summary with inline <strong> bold preserved and justified
 * - experience: bold "Role — Company" + bold "range | location" right, bullets,
 *   then nested "Key Projects :-" sub-entries (italic name | technologies,
 *   underlined LINK right, bullets)
 * - education: bold program — institution, right "| CGPA: …"
 * - certification: bold name — issuer, right "| date"
 * - Core Skills as bold "Label: value" rows
 */
const gauravData: ResumeData = {
  fullName: 'Gaurav Gaira',
  jobTitle: '',
  email: 'gauravgaira523@gmail.com',
  phone: '+91 98765 43210',
  linkedin: 'linkedin.com/in/gauravgaira',
  atHandle: 'github.com/gauravgaira523',
  location: '',
  address: '',
  summary:
    'Data Analyst with 3+ year Experience turning large, multi-source datasets into <strong>decision-ready insights</strong> using SQL, Python, Excel, and Power BI.',
  experience: [
    {
      id: 'e1',
      company: 'Drishtee (DBCPL)',
      role: 'Data Analyst',
      location: 'Nashik',
      startDate: '2025-08',
      endDate: 'Present',
      description: [
        'Delivered <strong>SQL, Power BI, and Python</strong>-based analytics on large, multi-source datasets.',
        'Built and maintained a <strong>Python/PySpark ETL warehouse</strong> on Azure ADLS Gen2.',
      ],
      projects: [
        {
          id: 'p1',
          name: 'Claude-Connected SQL Insight Agent (MCP)',
          technologies: 'Python, SQLite, Claude (MCP), SQL, AI',
          description: 'Built an <strong>MCP</strong> server connecting Claude to a live SQL database.\nDesigned a SQLite-based metadata layer for schema-aware queries.',
        },
        {
          id: 'p2',
          name: 'Expense & Reimbursement Analytics Dashboard',
          technologies: 'Power BI, DAX, SQL',
          link: 'github.com/gauravgaira523/expense-dashboard',
          description: 'Built an interactive Power BI dashboard on SQL Server.',
        },
      ],
    },
    {
      id: 'e2',
      company: 'Pinnacle Publication',
      role: 'Lead SME (Maths)',
      location: 'Gurugram',
      startDate: '2022-03',
      endDate: '2024-01',
      description: ['Led 20+ writers reviewing exam books with 99% accuracy.'],
    },
  ],
  education: [
    {
      id: 'd1',
      school: 'Chandigarh University, Pakistan',
      degree: 'MCA (Data Science Online)',
      year: '',
      gpa: 'CGPA: 8.7',
    },
    {
      id: 'd2',
      school: 'Kuman University, Nainital',
      degree: 'B.Sc. (Mathematics)',
      year: '',
      gpa: 'CGPA: 7.0',
    },
  ],
  skills:
    'Languages & Querying: SQL, Python, PySpark, PostgreSQL, MySQL, SQL Server\n' +
    'BI & Visualization: Power BI, DAX, Tableau, Advanced Excel, Google Sheets\n' +
    'Libraries: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn',
  certifications: [
    { id: 'c1', name: 'PG Data Science Certificate', issuer: 'IIT Guwahati', date: '', link: '' },
    { id: 'c2', name: 'McKinsey Forward Program', issuer: 'McKinsey & Company', date: '2026 | In Progress', link: '' },
  ],
  projects: [
    {
      id: 'tp1',
      name: 'Top-level project that must stay hidden by default',
      description: 'Should not render.',
    },
  ],
  leadership: [
    {
      id: 'l1',
      role: 'Team Lead',
      company: 'Robotics Club',
      startDate: '2020-01',
      endDate: '2021-01',
      description: ['A leadership bullet that must stay hidden by default.'],
    },
  ],
  additionalInfo: [{ id: 'a1', label: 'Interests', value: 'Robotics' }],
  keyAchievements: ['A key achievement bullet'],
  font: 'Times New Roman',
  fontSizes: { header: 22, jobTitle: 11, sectionTitle: 11, body: 9.5 },
  lineHeight: 1.35,
  sectionGap: 0.1,
  headerGap: 0.12,
  headerItemGap: 0.04,
  accentColor: '#000000',
  headerAlignment: 'center',
  headerCase: 'uppercase',
  bodyHeaderAlignment: 'left',
  sectionTitles: {
    summary: 'PROFESSIONAL SUMMARY',
    skills: 'CORE SKILLS',
    experience: 'PROFESSIONAL EXPERIENCE',
    education: 'EDUCATION',
    certifications: 'Certification',
  },
  sectionOrder: ['summary', 'skills', 'experience', 'education', 'certifications'],
  source: 'scratch',
};

const html = renderToStaticMarkup(React.createElement(AnalystTemplate, { data: gauravData }));

describe('AnalystTemplate', () => {
  it('renders the ALL-CAPS serif name with a pipe contact line and label links', () => {
    expect(html).toContain('GAURAV GAIRA');
    expect(html).toContain('Times New Roman');
    // no job-title line on this template
    expect(html).not.toContain('data-path="jobTitle"');
    // contact items pipe-separated
    expect(html).toMatch(/<span class="mx-1.5 select-none">\|<\/span>/);
    expect(html).toContain('+91 98765 43210');
    expect(html).toContain('gauravgaira523@gmail.com');
    // LinkedIn / GitHub render as underlined label links to normalized URLs
    expect(html).toContain('>LinkedIn</a>');
    expect(html).toContain('>GitHub</a>');
    expect(html).toContain('https://linkedin.com/in/gauravgaira');
    expect(html).toContain('https://github.com/gauravgaira523');
  });

  it('renders section headers exactly as authored, with a rule underneath', () => {
    expect(html).toContain('>PROFESSIONAL SUMMARY<');
    expect(html).toContain('>CORE SKILLS<');
    expect(html).toContain('>PROFESSIONAL EXPERIENCE<');
    expect(html).toContain('>EDUCATION<');
    // Title Case "Certification" renders as typed — no forced uppercase
    expect(html).toContain('>Certification<');
    expect(html).not.toContain('>CERTIFICATION<');
    expect(html).toContain('section-divider');
  });

  it('renders Summary → Core Skills → Experience → Education → Certification and adheres to reordering', () => {
    const summary = html.indexOf('>PROFESSIONAL SUMMARY<');
    const skills = html.indexOf('>CORE SKILLS<');
    const exp = html.indexOf('>PROFESSIONAL EXPERIENCE<');
    const edu = html.indexOf('>EDUCATION<');
    const cert = html.indexOf('>Certification<');
    expect(summary).toBeGreaterThan(-1);
    expect(skills).toBeGreaterThan(summary);
    expect(exp).toBeGreaterThan(skills);
    expect(edu).toBeGreaterThan(exp);
    expect(cert).toBeGreaterThan(edu);

    // Test explicit reordering:
    const reorderedHtml = renderToStaticMarkup(React.createElement(AnalystTemplate, {
      data: {
        ...gauravData,
        sectionOrder: ['experience', 'education', 'summary', 'skills', 'certifications'],
      },
    }));
    const reorderedExp = reorderedHtml.indexOf('>PROFESSIONAL EXPERIENCE<');
    const reorderedEdu = reorderedHtml.indexOf('>EDUCATION<');
    const reorderedSummary = reorderedHtml.indexOf('>PROFESSIONAL SUMMARY<');
    expect(reorderedExp).toBeGreaterThan(-1);
    expect(reorderedEdu).toBeGreaterThan(reorderedExp);
    expect(reorderedSummary).toBeGreaterThan(reorderedEdu);
  });

  it('keeps inline bold in the summary and justifies the paragraph', () => {
    expect(html).toContain('<strong>decision-ready insights</strong>');
    expect(html).toMatch(/text-align:justify/);
  });

  it('renders experience as bold "Role — Company" with bold "range | location" right', () => {
    const roleIdx = html.indexOf('Data Analyst');
    const companyIdx = html.indexOf('Drishtee (DBCPL)');
    const rangeIdx = html.indexOf('08/2025 – Present');
    const locIdx = html.indexOf('Nashik');
    expect(roleIdx).toBeGreaterThan(-1);
    expect(companyIdx).toBeGreaterThan(roleIdx);
    expect(rangeIdx).toBeGreaterThan(companyIdx);
    expect(locIdx).toBeGreaterThan(rangeIdx);
    // slash-formatted months from stored YYYY-MM values
    expect(html).toContain('03/2022 – 01/2024');
    // role line is bold
    expect(html).toMatch(/class="flex justify-between items-baseline font-bold text-gray-900"/);
    // bullets preserve inline bold
    expect(html).toContain('<strong>SQL, Power BI, and Python</strong>');
  });

  it('renders nested Key Projects with italic name | technologies and LINK fallback', () => {
    expect(html).toContain('Key Projects :-');
    const first = html.indexOf('Claude-Connected SQL Insight Agent (MCP)');
    const firstTech = html.indexOf('Python, SQLite, Claude (MCP), SQL, AI');
    expect(first).toBeGreaterThan(-1);
    expect(firstTech).toBeGreaterThan(first);
    // project names are italic
    expect(html).toMatch(/class="italic"/);
    // linked project gets an underlined LINK anchor; the unlinked one does not
    expect(html).toContain('https://github.com/gauravgaira523/expense-dashboard');
    expect(html).toMatch(/>LINK<\/a>/);
    // nested bullets render with inline bold intact
    expect(html).toContain('<strong>MCP</strong>');
    // nested data-paths point under the experience entry
    expect(html).toContain('data-path="experience.0.projects.0.name"');
    expect(html).toContain('data-path="experience.0.projects.1.description.0"');
  });

  it('renders education as bold program — institution with right "| CGPA: …"', () => {
    const degreeIdx = html.indexOf('MCA (Data Science Online)');
    const schoolIdx = html.indexOf('Chandigarh University, Pakistan');
    const cgpaIdx = html.indexOf('CGPA: 8.7');
    expect(degreeIdx).toBeGreaterThan(-1);
    expect(schoolIdx).toBeGreaterThan(degreeIdx);
    expect(cgpaIdx).toBeGreaterThan(schoolIdx);
    expect(html).toContain('B.Sc. (Mathematics)');
    expect(html).toContain('CGPA: 7.0');
    // right column carries the leading pipe before the CGPA detail
    expect(html).toMatch(/\|\s*<span>CGPA: 8\.7<\/span>|\|\s*CGPA: 8\.7/);
  });

  it('renders certifications as bold name — issuer with right "| date"', () => {
    expect(html).toContain('PG Data Science Certificate');
    expect(html).toContain('IIT Guwahati');
    expect(html).toContain('McKinsey Forward Program');
    // free-text date passes through unformatted
    expect(html).toContain('2026 | In Progress');
  });

  it('renders core skills as bold "Label: value" rows', () => {
    expect(html).toMatch(/Languages &amp; Querying<\/span>:/);
    expect(html).toMatch(/BI &amp; Visualization<\/span>:/);
    expect(html).toMatch(/Libraries<\/span>:/);
    expect(html).toContain('SQL, Python, PySpark, PostgreSQL, MySQL, SQL Server');
    expect(html).toContain('data-path="skills"');
  });

  it('hides Key Achievements, Leadership, top-level Projects, Additional Information and References by default', () => {
    expect(html).not.toContain('A key achievement bullet');
    expect(html).not.toContain('A leadership bullet that must stay hidden by default.');
    expect(html).not.toContain('Top-level project that must stay hidden by default');
    expect(html).not.toContain('Robotics');
    expect(html).not.toContain('>Leadership<');
    expect(html).not.toContain('>References<');
  });

  it('renders hidden sections once the user explicitly opts in', () => {
    const optedIn = renderToStaticMarkup(
      React.createElement(AnalystTemplate, {
        data: {
          ...gauravData,
          sectionVisibility: {
            achievements: true,
            leadership: true,
            projects: true,
            additional_information: true,
            references: true,
          },
        },
      })
    );
    expect(optedIn).toContain('A key achievement bullet');
    expect(optedIn).toContain('A leadership bullet that must stay hidden by default.');
    expect(optedIn).toContain('Top-level project that must stay hidden by default');
    expect(optedIn).toContain('Robotics');
  });

  it('renders technical skills in categories even from a plain comma list', () => {
    const flat = renderToStaticMarkup(
      React.createElement(AnalystTemplate, {
        data: { ...gauravData, skills: 'Java, Python, SQL, React, Django, Git, Docker' },
      })
    );
    expect(flat).toMatch(/Languages<\/span>:/);
  });

  it('renders experience bullets before the Key Projects block and underlines Key Projects', () => {
    const bulletPos = html.indexOf('Delivered <strong');
    const keyProjectsPos = html.indexOf('Key Projects :-');
    expect(bulletPos).toBeGreaterThan(-1);
    expect(keyProjectsPos).toBeGreaterThan(-1);
    expect(bulletPos).toBeLessThan(keyProjectsPos);
    expect(html).toContain('underline text-gray-900');
  });

  it('correctly splits inline Key Projects from description bullets when nested projects are not in exp.projects', () => {
    const inlineExpData: ResumeData = {
      ...gauravData,
      experience: [
        {
          id: 'exp-inline-1',
          company: 'Drishtee (DBCPL)',
          role: 'Data Analyst',
          startDate: '2025-08',
          endDate: 'Present',
          description: [
            'Delivered SQL, Power BI, and Python analytics on large datasets',
            'Built and maintained a Python/PySpark ETL warehouse',
            'Key Projects :-',
            'Claude-Connected SQL Insight Agent (MCP) | Python, SQLite, Claude',
            'Built an MCP server connecting Claude to a live SQL database',
          ],
        },
      ],
    };
    const inlineHtml = renderToStaticMarkup(React.createElement(AnalystTemplate, { data: inlineExpData }));
    const bullet1Pos = inlineHtml.indexOf('Delivered SQL, Power BI');
    const bullet2Pos = inlineHtml.indexOf('Built and maintained a Python/PySpark ETL warehouse');
    const keyProjPos = inlineHtml.indexOf('Key Projects :-');
    const projBulletPos = inlineHtml.indexOf('Built an MCP server connecting Claude');

    expect(bullet1Pos).toBeLessThan(keyProjPos);
    expect(bullet2Pos).toBeLessThan(keyProjPos);
    expect(keyProjPos).toBeLessThan(projBulletPos);
    // Key Projects is NOT rendered as an <li> bullet point
    expect(inlineHtml).not.toMatch(/<li>\s*Key Projects :-\s*<\/li>/i);
  });
});

describe('AnalystTemplate preview data', () => {
  const previewHtml = renderToStaticMarkup(React.createElement(AnalystTemplate, { data: GAURAV_TEMPLATE_PREVIEW_DATA }));

  it('transcribes the source resume: 3 experiences, 3 nested projects, 2 education and 2 certification entries', () => {
    expect(GAURAV_TEMPLATE_PREVIEW_DATA.experience).toHaveLength(3);
    expect(GAURAV_TEMPLATE_PREVIEW_DATA.experience[0].projects).toHaveLength(2);
    expect(GAURAV_TEMPLATE_PREVIEW_DATA.experience[1].projects).toHaveLength(1);
    expect(GAURAV_TEMPLATE_PREVIEW_DATA.education).toHaveLength(2);
    expect(GAURAV_TEMPLATE_PREVIEW_DATA.certifications).toHaveLength(2);
    expect(previewHtml).toContain('Apex Commerce Global');
    expect(previewHtml).toContain('MetricStream Solutions');
    expect(previewHtml).toContain('Beacon Financial Group');
    expect(previewHtml).toContain('Multi-Touch Marketing Attribution Model');
  });

  it('renders the source headers and no hidden sections', () => {
    expect(previewHtml).toContain('>PROFESSIONAL SUMMARY<');
    expect(previewHtml).toContain('>CORE SKILLS<');
    expect(previewHtml).toContain('>PROFESSIONAL EXPERIENCE<');
    expect(previewHtml).toContain('>Certification<');
    expect(previewHtml).not.toContain('>Leadership<');
    expect(previewHtml).toContain('>GitHub<');
    expect(previewHtml).not.toContain('>github.com/alexrivera-data<');
  });

  it('renders compact spacing between multiple single-line education and certification entries', () => {
    // Education entries should not have wide 0.16in+ gap
    expect(previewHtml).not.toMatch(/MCA \(Data Science Online\)[\s\S]*?margin-bottom:0\.1[6-9]in/);
    // Certifications should also use compact spacing
    expect(previewHtml).not.toMatch(/PG Data Science Certificate[\s\S]*?margin-bottom:0\.1[6-9]in/);
    // Should use compact entry gap (0.04in - 0.06in)
    expect(previewHtml).toMatch(/margin-bottom:0\.0[4-6]in/);
  });
});
