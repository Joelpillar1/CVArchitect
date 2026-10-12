import React from 'react';
import RegentTemplate from '../components/templates/RegentTemplate';
import type { ResumeData } from '../types';

/**
 * TEMP DEV HARNESS — renders the Regent ("Centered Classic") template with the
 * exact content from the reference screenshot so the layout can be diffed
 * against it. Remove before shipping.
 */
const REFERENCE_DATA: ResumeData = {
  fullName: 'Emma Gates',
  jobTitle: 'Software Developer',
  phone: '+123-45678',
  email: 'Emma.123@gmail.com',
  location: 'United States',
  linkedin: 'LinkedIn',
  summary:
    'Software developer with 10+ years of experience designing and deploying scalable, high-traffic applications used by millions; improved application performance by 30%, reduced deployment time by 40% through CI/CD automation, and lowered bug rate by 25% via rigorous testing; full-stack expertise in Java, JavaScript (React, Node.js), TypeScript, and Python with cloud modernization using Google Cloud Platform, and Docker',
  experience: [
    {
      id: '1',
      company: 'CF',
      role: 'Software Developer',
      startDate: '2022-07',
      endDate: 'Present',
      description: [
        'Engineered scalable backend services handling millions of daily users, reducing request latency by 30% through architectural refactors and efficient concurrency patterns.',
        'Partnered with product managers, designers, and QA to deliver 12+ feature releases in agile sprints, accelerating time-to-market by 25% while maintaining a 25% reduction in post-release bug rate.',
        'Streamlined data access patterns and optimized hot paths in the codebase, delivering a 30% increase in application performance and enabling more efficient resource utilization during peak traffic.',
        'Led the integration of cloud services using Google Cloud Platform to enhance system reliability.',
      ],
    },
    {
      id: '2',
      company: 'Tech Solutions Inc.',
      role: 'Software Engineer',
      startDate: '2018-06',
      endDate: '2022-06',
      description: [
        'Engineered and maintained React/Node.js web applications serving thousands of daily users, improving front-end responsiveness and reducing page load times by 30%.',
        'Developed scalable REST APIs and orchestrated integrations with third-party services, improving system extensibility and contributing to a 25% reduction in defect rate by enforcing consistent contracts and integration tests.',
        'Conducted 200+ peer code reviews that identified and resolved critical defects early, contributing to a 25% reduction in bug rate and accelerating feature delivery by 15%.',
        'Reduced bug rate by 25% through rigorous testing and debugging practices.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Yale University',
      degree: "Bachelor's Degree in Computer Science",
      year: 'Sep 2014 - Jun 2018',
      relevantCourses: 'Data Structures, Algorithms, Software Engineering, Database Systems',
    },
  ],
  projects: [
    {
      id: '1',
      name: 'Google, Automated Deployment Pipeline',
      startDate: '2021-01',
      endDate: '2023-06',
      description: [
        'Developed a CI/CD pipeline using Jenkins and Docker to automate application deployment.',
        'Reduced deployment time by 40% and minimized manual errors through automation.',
      ],
    },
    {
      id: '2',
      name: 'Open Source Community, Open Source Contribution: React Component Library',
      startDate: '2023-05',
      endDate: '2024-05',
      description: [
        'Contributed to an open-source React component library improving accessibility features.',
        'Enhanced user experience and increased adoption by developer community.',
      ],
    },
  ],
  skills: '',
  certifications: [],
  coreCompetencies:
    'Languages: Java, C++, JavaScript, Python, TypeScript, SQL\nFrameworks: React, Angular, Node.js, Express, Spring Boot, Django\nTools: Git, Docker, Jenkins, Kubernetes, Webpack, Babel\nCloud & Infrastructure: Google Cloud Platform, AWS, Azure, Firebase, Docker Swarm, Terraform\nDev Practices: Agile, Scrum, Kanban, Test-Driven Development (TDD), Continuous Integration (CI), Continuous Deployment (CD)\nLanguages: English',
  language: 'en',
  accentColor: '#000000',
  fontSizes: { header: 18, jobTitle: 12, sectionTitle: 12, body: 9.5 },
  lineHeight: 1.45,
  headerAlignment: 'center',
  contactAlignment: 'center',
  sectionHeaderAlignment: 'center',
  contentAlignment: 'left',
  sectionOrder: ['summary', 'experience', 'education', 'projects', 'core_competencies'],
  sectionTitles: {
    experience: 'Professional Experience',
    core_competencies: 'Core Competencies',
  },
  sectionVisibility: {
    summary: true,
    experience: true,
    education: true,
    projects: true,
    core_competencies: true,
  },
  margins: { horizontal: 0.4, vertical: 0.4 },
  source: 'scratch',
  hasJobMatchRun: false,
} as unknown as ResumeData;

export default function RegentReferenceCheck() {
  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h1 className="text-lg font-bold mb-3">Regent / Centered Classic — reference comparison</h1>
      <div className="bg-white mx-auto shadow-lg" style={{ width: '210mm' }} data-template-name="regent-reference">
        <RegentTemplate data={REFERENCE_DATA} />
      </div>
    </div>
  );
}
