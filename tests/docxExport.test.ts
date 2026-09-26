import { describe, it, expect } from 'vitest';
import { buildResumeDocxDocument, parseHtmlToDocxRuns } from '../utils/docxExport';
import { ResumeData, INITIAL_DATA } from '../types';
import { Packer } from 'docx';

describe('docxExport', () => {
  it('parses inline HTML tags into docx text runs and links', () => {
    const html = 'Led <b>engineering team</b> and increased revenue by <strong>25%</strong>. See <a href="https://example.com">portfolio</a>.';
    const runs = parseHtmlToDocxRuns(html);
    expect(runs.length).toBeGreaterThan(0);
  });

  it('builds a valid DOCX document from comprehensive ResumeData', async () => {
    const sampleData: ResumeData = {
      ...INITIAL_DATA,
      fullName: 'Alex Morgan',
      jobTitle: 'Senior Software Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/alexmorgan',
      atHandle: 'https://github.com/alexmorgan',
      summary: 'Experienced full-stack engineer with expertise in <b>React</b>, <b>Node.js</b>, and cloud architectures.',
      experience: [
        {
          id: 'exp1',
          role: 'Staff Engineer',
          company: 'Acme Corp',
          location: 'San Francisco, CA',
          startDate: '2022',
          endDate: 'Present',
          description: [
            'Architected distributed microservices platform reducing latency by <b>40%</b>',
            'Mentored 8 junior engineers across frontend and backend stacks',
          ],
        },
      ],
      education: [
        {
          id: 'edu1',
          school: 'University of California, Berkeley',
          degree: 'B.S. in Computer Science',
          year: '2018 - 2022',
          gpa: '3.9',
          relevantCourses: 'Distributed Systems, Operating Systems, Algorithms',
        },
      ],
      skills: 'TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL',
      projects: [
        {
          id: 'proj1',
          name: 'Open Source Cloud Orchestrator',
          link: 'https://github.com/alexmorgan/orchestrator',
          technologies: 'Go, Docker, gRPC',
          description: 'High-throughput cluster manager supporting 10k+ concurrent nodes.',
        },
      ],
      certifications: [
        {
          id: 'cert1',
          name: 'AWS Certified Solutions Architect - Professional',
          issuer: 'Amazon Web Services',
          date: '2023',
        },
      ],
      leadership: [
        {
          id: 'lead1',
          role: 'Tech Lead',
          company: 'Open Source Initiative',
          startDate: '2021',
          endDate: 'Present',
          description: 'Led core contributor working group for web developer toolchains.',
        },
      ],
    };

    const doc = buildResumeDocxDocument(sampleData);
    expect(doc).toBeDefined();

    // Verify Packer can generate buffer without errors
    const buffer = await Packer.toBuffer(doc);
    expect(buffer).toBeDefined();
    expect(buffer.byteLength).toBeGreaterThan(1000);
  });
});
