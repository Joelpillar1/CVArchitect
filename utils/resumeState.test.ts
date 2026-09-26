import { describe, it, expect } from 'vitest';
import { createEmptyResume, INITIAL_DATA, ResumeData } from '../types';
import {
  analyzeResumeState,
  buildResumeContext,
  isMeaningfulString,
  parseMeaningfulSkills,
  isMeaningfulExperience,
  isMeaningfulEducation,
} from './resumeState';

describe('Phase 1: Deterministic Resume State Detection', () => {
  // Case 1 — Brand New Resume
  it('correctly classifies a brand new empty resume as EMPTY', () => {
    const emptyResume = createEmptyResume();
    const result = analyzeResumeState(emptyResume);

    expect(result.contentState).toBe('EMPTY');
    expect(result.state).toBe('EMPTY');
    expect(result.hasMeaningfulContent).toBe(false);
    expect(result.isDemoData).toBe(false);
    expect(result.stats.experienceCount).toBe(0);
    expect(result.stats.educationCount).toBe(0);
    expect(result.stats.skillsCount).toBe(0);
    expect(result.stats.hasSummary).toBe(false);
    expect(result.missingOrWeakSections).toContain('experience');
    expect(result.missingOrWeakSections).toContain('skills');
  });

  // Case 2 — INITIAL_DATA / Demo Data Identification
  it('identifies demo data and refuses to treat it as authentic user resume data', () => {
    const result = analyzeResumeState(INITIAL_DATA);

    expect(result.isDemoData).toBe(true);
    expect(result.contentState).toBe('EMPTY');
    expect(result.hasMeaningfulContent).toBe(false);
  });

  // Case 3 — Experience Only (Partial Resume)
  it('correctly classifies an experience-only resume as PARTIAL', () => {
    const partialResume: ResumeData = {
      ...createEmptyResume(),
      fullName: 'Sarah Connor',
      experience: [
        {
          id: 'exp_1',
          company: 'Cyberdyne Systems',
          role: 'Security Consultant',
          startDate: '2021-01',
          endDate: 'Present',
          description: ['Hardened perimeter network infrastructure', 'Audited firewall rules'],
        },
      ],
    };

    const result = analyzeResumeState(partialResume);

    expect(result.contentState).toBe('PARTIAL');
    expect(result.state).toBe('PARTIAL');
    expect(result.hasMeaningfulContent).toBe(true);
    expect(result.stats.experienceCount).toBe(1);
    expect(result.stats.skillsCount).toBe(0);
    expect(result.sections.experience.status).toBe('partial');
    expect(result.sections.skills.status).toBe('empty');
  });

  // Case 4 — Complete Resume
  it('correctly classifies a well-rounded resume with core sections as COMPLETE', () => {
    const completeResume: ResumeData = {
      ...createEmptyResume(),
      fullName: 'David Miller',
      jobTitle: 'Senior Cloud Architect',
      email: 'david.miller@example.com',
      phone: '+1 415 555 0199',
      location: 'Austin, TX',
      summary:
        'Executive Cloud Architect with 10+ years of expertise scaling Kubernetes clusters and architecting multi-region AWS cloud solutions.',
      skills: 'AWS, Kubernetes, Terraform, Go, Python, Docker, CI/CD',
      experience: [
        {
          id: 'exp_1',
          company: 'Stripe',
          role: 'Staff Infrastructure Engineer',
          startDate: '2022-01',
          endDate: 'Present',
          description: [
            'Architected distributed deployment engine handling 50k daily builds',
            'Reduced AWS compute spend by $320k annually through spot instance optimization',
          ],
        },
        {
          id: 'exp_2',
          company: 'Datadog',
          role: 'Senior DevOps Engineer',
          startDate: '2019-03',
          endDate: '2021-12',
          description: [
            'Maintained multi-cluster Kubernetes topology serving 2M daily queries',
          ],
        },
      ],
      education: [
        {
          id: 'edu_1',
          school: 'UT Austin',
          degree: 'B.S. in Computer Science',
          year: '2018',
        },
      ],
    };

    const result = analyzeResumeState(completeResume);

    expect(result.contentState).toBe('COMPLETE');
    expect(result.state).toBe('COMPLETE');
    expect(result.hasMeaningfulContent).toBe(true);
    expect(result.sections.contact.status).toBe('complete');
    expect(result.sections.summary.status).toBe('complete');
    expect(result.sections.experience.status).toBe('complete');
    expect(result.sections.skills.status).toBe('complete');
    expect(result.sections.education.status).toBe('complete');
    expect(result.stats.experienceCount).toBe(2);
    expect(result.stats.skillsCount).toBe(7);
  });

  // Case 5 — Uploaded Resume Pending
  it('correctly handles upload state when upload is pending analysis', () => {
    const result = analyzeResumeState(createEmptyResume(), {
      uploadStatus: 'pending',
      filename: 'sarah_resume.pdf',
    });

    expect(result.uploadState).toBe('PENDING_ANALYSIS');
    expect(result.state).toBe('UPLOADED_PENDING_ANALYSIS');
    expect(result.upload.exists).toBe(true);
    expect(result.upload.status).toBe('pending');
    expect(result.upload.filename).toBe('sarah_resume.pdf');
  });

  // Case 6 — Uploaded Resume Successfully Parsed
  it('correctly handles upload state when parsed with content', () => {
    const parsedResume: ResumeData = {
      ...createEmptyResume(),
      fullName: 'Elena Rostova',
      jobTitle: 'Data Engineer',
      skills: 'Python, SQL, Apache Spark',
      experience: [
        {
          id: 'exp_1',
          company: 'Fintech Inc',
          role: 'Data Engineer',
          startDate: '2023-01',
          endDate: 'Present',
          description: 'Built ETL pipelines',
        },
      ],
    };

    const result = analyzeResumeState(parsedResume, {
      justUploaded: true,
      uploadStatus: 'analyzed',
      filename: 'elena_cv.pdf',
    });

    expect(result.uploadState).toBe('ANALYZED');
    expect(result.state).toBe('ANALYZED');
    expect(result.contentState).toBe('PARTIAL'); // Content is partial, but upload state is ANALYZED
    expect(result.upload.justUploaded).toBe(true);
    expect(result.upload.filename).toBe('elena_cv.pdf');
  });

  // Helper Verification Tests
  describe('Content validation helpers', () => {
    it('isMeaningfulString rejects empty strings and generic placeholders', () => {
      expect(isMeaningfulString('')).toBe(false);
      expect(isMeaningfulString('   ')).toBe(false);
      expect(isMeaningfulString('YOUR NAME')).toBe(false);
      expect(isMeaningfulString('PROFESSIONAL ROLE')).toBe(false);
      expect(isMeaningfulString('your.email@example.com')).toBe(false);
      expect(isMeaningfulString('Company Name')).toBe(false);
      expect(isMeaningfulString('John Doe')).toBe(true);
      expect(isMeaningfulString('Staff Software Engineer')).toBe(true);
    });

    it('parseMeaningfulSkills filters placeholder and empty skill entries', () => {
      expect(parseMeaningfulSkills('Skill 1, Skill 2, Skill 3')).toEqual([]);
      expect(parseMeaningfulSkills('React, TypeScript, Skill 1, Node.js, , ')).toEqual([
        'React',
        'TypeScript',
        'Node.js',
      ]);
    });

    it('isMeaningfulExperience evaluates actual content vs placeholders', () => {
      expect(
        isMeaningfulExperience({
          id: '1',
          company: 'Company Name',
          role: 'Job Title',
          startDate: '',
          endDate: '',
          description: ['Key responsibility or achievement'],
        })
      ).toBe(false);

      expect(
        isMeaningfulExperience({
          id: '1',
          company: 'Google',
          role: 'Software Engineer',
          startDate: '2022',
          endDate: 'Present',
          description: ['Optimized search indexing pipeline'],
        })
      ).toBe(true);
    });

    it('isMeaningfulEducation evaluates actual content vs placeholders', () => {
      expect(
        isMeaningfulEducation({
          id: '1',
          school: 'University Name',
          degree: 'Degree Name, Major',
          year: '',
        })
      ).toBe(false);

      expect(
        isMeaningfulEducation({
          id: '1',
          school: 'Stanford University',
          degree: 'B.S. in Computer Science',
          year: '2021',
        })
      ).toBe(true);
    });
  });

  // Step 6: AI-safe Compact Context Builder
  describe('buildResumeContext', () => {
    it('produces compact context for the agent without duplicated resume text', () => {
      const resume: ResumeData = {
        ...createEmptyResume(),
        fullName: 'Alice Johnson',
        jobTitle: 'Frontend Engineer',
        skills: 'React, TypeScript, CSS, HTML5, Jest',
        experience: [
          {
            id: 'exp_1',
            company: 'Vercel',
            role: 'Frontend Engineer',
            startDate: '2022',
            endDate: 'Present',
            description: 'Engineered next-gen web components',
          },
        ],
      };

      const analysis = analyzeResumeState(resume, {
        filename: 'alice_cv.pdf',
        uploadStatus: 'analyzed',
      });

      const aiContext = buildResumeContext(resume, analysis);

      expect(aiContext.contentState).toBe('PARTIAL');
      expect(aiContext.upload.filename).toBe('alice_cv.pdf');
      expect(aiContext.stats.experienceCount).toBe(1);
      expect(aiContext.stats.skillsCount).toBe(5);
      expect(aiContext.stats.hasSummary).toBe(false);
      expect(aiContext.missingOrWeakSections).toContain('summary');
      expect(aiContext.isDemoData).toBe(false);
    });
  });
});
