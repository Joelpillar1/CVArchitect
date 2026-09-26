import { describe, it, expect } from 'vitest';
import {
  SECTION_REGISTRY,
  SECTION_ALIASES,
  normalizeSectionType,
  getSectionDefinition,
  createDefaultSectionOrder,
  getSectionContent,
  hasSectionContent,
  isSectionVisible,
  getSectionTitle,
  resolveSection,
} from '../utils/sectionRegistry';
import type { ResumeSectionType } from '../types/resumeSections';
import type { ResumeData } from '../types';
import { INITIAL_DATA } from '../types';

describe('Phase 1: Resume Section Domain Architecture', () => {
  const ALL_37_TYPES: ResumeSectionType[] = [
    'contact',
    'summary',
    'experience',
    'education',
    'skills',
    'expert_skills',
    'technical_skills',
    'core_competencies',
    'tools_and_technologies',
    'projects',
    'certifications',
    'licenses',
    'achievements',
    'awards',
    'languages',
    'leadership',
    'volunteering',
    'memberships',
    'publications',
    'conferences_speaking',
    'research',
    'teaching',
    'coursework',
    'thesis',
    'academic_achievements',
    'portfolio',
    'case_studies',
    'selected_work',
    'patents',
    'grants',
    'security_clearance',
    'military',
    'clinical_experience',
    'interests',
    'references',
    'additional_information',
    'custom',
  ];

  const CORE_8_VISIBLE: ResumeSectionType[] = [
    'contact',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'achievements',
  ];

  describe('1. Section Registry', () => {
    it('1 & 2. Registry contains every approved section type with no duplicates', () => {
      const registeredTypes = Object.keys(SECTION_REGISTRY);
      expect(registeredTypes.length).toBe(37);
      expect(new Set(registeredTypes).size).toBe(37);

      for (const type of ALL_37_TYPES) {
        expect(SECTION_REGISTRY[type]).toBeDefined();
        expect(SECTION_REGISTRY[type].type).toBe(type);
      }
    });

    it('3. Exactly the intended 8 core sections are defaultVisible: true', () => {
      const defaultVisibleTypes = ALL_37_TYPES.filter((t) => SECTION_REGISTRY[t].defaultVisible);
      expect(defaultVisibleTypes.sort()).toEqual([...CORE_8_VISIBLE].sort());
      expect(defaultVisibleTypes.length).toBe(8);
    });

    it('4. All other optional sections are defaultVisible: false', () => {
      const hiddenTypes = ALL_37_TYPES.filter((t) => !SECTION_REGISTRY[t].defaultVisible);
      expect(hiddenTypes.length).toBe(29);
      for (const type of hiddenTypes) {
        expect(CORE_8_VISIBLE.includes(type)).toBe(false);
      }
    });

    it('5. Contact cannot be hidden and is required', () => {
      expect(SECTION_REGISTRY.contact.isRequired).toBe(true);
      expect(SECTION_REGISTRY.contact.canHide).toBe(false);
      expect(SECTION_REGISTRY.contact.rendererKind).toBe('contact');
    });

    it('getSectionDefinition returns valid definition for canonical and alias types', () => {
      expect(getSectionDefinition('experience')?.type).toBe('experience');
      expect(getSectionDefinition('keyAchievements')?.type).toBe('achievements');
      expect(getSectionDefinition('unknown_type')).toBeNull();
    });
  });

  describe('2. Section Aliases & Normalization', () => {
    it('6. Legacy aliases normalize correctly', () => {
      expect(normalizeSectionType('keyAchievements')).toBe('achievements');
      expect(normalizeSectionType('additionalInfo')).toBe('additional_information');
      expect(normalizeSectionType('personal')).toBe('contact');
      expect(normalizeSectionType('referee')).toBe('references');
      expect(normalizeSectionType('technicalSkills')).toBe('technical_skills');
      expect(normalizeSectionType('coreCompetencies')).toBe('core_competencies');
      expect(normalizeSectionType('toolsAndTechnologies')).toBe('tools_and_technologies');
      expect(normalizeSectionType('conferencesSpeaking')).toBe('conferences_speaking');
      expect(normalizeSectionType('academicAchievements')).toBe('academic_achievements');
      expect(normalizeSectionType('caseStudies')).toBe('case_studies');
      expect(normalizeSectionType('selectedWork')).toBe('selected_work');
      expect(normalizeSectionType('securityClearance')).toBe('security_clearance');
      expect(normalizeSectionType('clinicalExperience')).toBe('clinical_experience');
    });

    it('7. achievements resolves from keyAchievements', () => {
      const data: ResumeData = {
        ...INITIAL_DATA,
        keyAchievements: ['Launched product with $2M ARR', 'Mentored 10 engineers'],
      };
      const content = getSectionContent(data, 'achievements');
      expect(content).toEqual(data.keyAchievements);
    });

    it('8. references resolves from referee', () => {
      const data: ResumeData = {
        ...INITIAL_DATA,
        referee: 'Available upon request from former managers.',
      };
      const content = getSectionContent(data, 'references');
      expect(content).toBe('Available upon request from former managers.');
    });

    it('9. additional_information resolves from additionalInfo', () => {
      const data: ResumeData = {
        ...INITIAL_DATA,
        additionalInfo: [{ id: '1', label: 'Languages', value: 'English, French' }],
      };
      const content = getSectionContent(data, 'additional_information');
      expect(content).toEqual(data.additionalInfo);
    });
  });

  describe('3. Presence, Visibility, and Titles', () => {
    it('10. sectionOrder determines presence for optional sections', () => {
      const withoutLeadership: ResumeData = {
        ...INITIAL_DATA,
        sectionOrder: ['summary', 'experience', 'skills'],
      };
      const resolvedBefore = resolveSection(withoutLeadership, 'leadership');
      expect(resolvedBefore?.present).toBe(false);

      const withLeadership: ResumeData = {
        ...INITIAL_DATA,
        sectionOrder: ['summary', 'leadership', 'experience'],
      };
      const resolvedAfter = resolveSection(withLeadership, 'leadership');
      expect(resolvedAfter?.present).toBe(true);
    });

    it('11. Explicit visibility overrides default behavior', () => {
      const data: ResumeData = {
        ...INITIAL_DATA,
        sectionOrder: ['summary', 'experience', 'skills'],
        sectionVisibility: {
          experience: false, // Core section explicitly hidden
          leadership: true,  // Optional section explicitly shown
        },
      };
      expect(isSectionVisible(data, 'experience')).toBe(false);
      expect(isSectionVisible(data, 'leadership')).toBe(true);

      const resolvedExp = resolveSection(data, 'experience');
      expect(resolvedExp?.visible).toBe(false);
    });

    it('12. Hidden sections retain their canonical content', () => {
      const data: ResumeData = {
        ...INITIAL_DATA,
        experience: [{ id: '1', role: 'Staff Eng', company: 'Tech Inc', startDate: '2021', endDate: '2023', description: 'Led cloud migration' }],
        sectionOrder: ['summary', 'experience'],
        sectionVisibility: { experience: false },
      };
      const resolved = resolveSection(data, 'experience');
      expect(resolved?.visible).toBe(false);
      expect(resolved?.content).toEqual(data.experience);
      expect(resolved?.hasContent).toBe(true);
    });

    it('Resolves custom section titles and falls back to default titles', () => {
      const data: ResumeData = {
        ...INITIAL_DATA,
        sectionTitles: {
          experience: 'Work History & Career',
        },
      };
      expect(getSectionTitle(data, 'experience')).toBe('Work History & Career');
      expect(getSectionTitle(data, 'education')).toBe('Education');
    });
  });

  describe('4. Type-Aware Content Validation (hasSectionContent)', () => {
    it('13 & 15. Empty strings and whitespace-only strings are not considered content', () => {
      const data: ResumeData = {
        ...INITIAL_DATA,
        summary: '',
        coursework: '     ',
        thesis: '\n\t  ',
      };
      expect(hasSectionContent(data, 'summary')).toBe(false);
      expect(hasSectionContent(data, 'coursework')).toBe(false);
      expect(hasSectionContent(data, 'thesis')).toBe(false);
    });

    it('14. Empty arrays are not considered content', () => {
      const data: ResumeData = {
        ...INITIAL_DATA,
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        leadership: [],
        volunteering: [],
      };
      expect(hasSectionContent(data, 'experience')).toBe(false);
      expect(hasSectionContent(data, 'education')).toBe(false);
      expect(hasSectionContent(data, 'projects')).toBe(false);
      expect(hasSectionContent(data, 'certifications')).toBe(false);
      expect(hasSectionContent(data, 'leadership')).toBe(false);
      expect(hasSectionContent(data, 'volunteering')).toBe(false);
    });

    it('16. Meaningful AdditionalInfoItem entries count as content, empty ones do not', () => {
      const emptyInfo: ResumeData = {
        ...INITIAL_DATA,
        additionalInfo: [{ id: '1', label: '', value: '  ' }],
      };
      expect(hasSectionContent(emptyInfo, 'additional_information')).toBe(false);

      const validInfo: ResumeData = {
        ...INITIAL_DATA,
        additionalInfo: [{ id: '1', label: 'Certifications', value: 'AWS Solutions Architect' }],
      };
      expect(hasSectionContent(validInfo, 'additional_information')).toBe(true);
    });

    it('17. Custom sections resolve correctly according to contentType', () => {
      const customData: ResumeData = {
        ...INITIAL_DATA,
        sectionOrder: ['custom_patents_1'],
        customSections: {
          custom_patents_1: {
            id: 'custom_patents_1',
            title: 'Issued Patents',
            contentType: 'bullets',
            content: ['US Patent 9,123,456 for Distributed Computing'],
          },
        },
      };

      const resolved = resolveSection(customData, 'custom_patents_1');
      expect(resolved).not.toBeNull();
      expect(resolved?.id).toBe('custom_patents_1');
      expect(resolved?.type).toBe('custom');
      expect(resolved?.title).toBe('Issued Patents');
      expect(resolved?.rendererKind).toBe('custom');
      expect(resolved?.hasContent).toBe(true);
      expect(resolved?.present).toBe(true);
      expect(resolved?.visible).toBe(true);
    });
  });

  describe('5. Immutability & Safety', () => {
    it('18. Existing ResumeData shapes remain fully compatible', () => {
      expect(INITIAL_DATA.fullName).toBeDefined();
      expect(INITIAL_DATA.experience).toBeDefined();
      expect(INITIAL_DATA.sectionOrder).toBeDefined();
    });

    it('19. resolveSection is pure and does not mutate ResumeData', () => {
      const original: ResumeData = JSON.parse(JSON.stringify(INITIAL_DATA));
      const clonedBefore: ResumeData = JSON.parse(JSON.stringify(INITIAL_DATA));

      resolveSection(original, 'experience');
      resolveSection(original, 'summary');
      resolveSection(original, 'keyAchievements');
      resolveSection(original, 'additionalInfo');
      resolveSection(original, 'custom_nonexistent');

      expect(original).toEqual(clonedBefore);
    });

    it('20. createDefaultSectionOrder() does not mutate input data and returns canonical order', () => {
      const order = createDefaultSectionOrder();
      expect(order).toEqual([
        'summary',
        'achievements',
        'skills',
        'experience',
        'education',
        'projects',
        'certifications',
        'additional_information',
        'references',
      ]);
    });
  });

  describe('6. Backward Compatibility Contract (Legacy Resume Fixture)', () => {
    it('loads a legacy ResumeData object without migration, preserving order and content', () => {
      const legacyResume: ResumeData = {
        fullName: 'Alex Mercer',
        jobTitle: 'Principal Systems Architect',
        email: 'alex@example.com',
        phone: '+1 (555) 019-2834',
        location: 'Seattle, WA',
        summary: 'Experienced systems architect with 12+ years designing distributed storage engines.',
        experience: [
          {
            id: 'exp_1',
            role: 'Lead Architect',
            company: 'Cloud Corp',
            startDate: '2018-01',
            endDate: 'Present',
            description: ['Architected multi-region consensus protocol', 'Reduced p99 tail latency by 45%'],
          },
        ],
        education: [
          {
            id: 'edu_1',
            school: 'University of Washington',
            degree: 'B.S. in Computer Science',
            year: '2012',
          },
        ],
        skills: 'Rust, Go, Raft, Distributed Systems, Kubernetes',
        certifications: [
          {
            id: 'cert_1',
            name: 'AWS Solutions Architect Professional',
            issuer: 'Amazon Web Services',
            date: '2022',
          },
        ],
        sectionOrder: ['summary', 'skills', 'experience', 'education', 'certifications'],
      };

      const clone = JSON.parse(JSON.stringify(legacyResume));

      // 1. Resolve core sections
      const resolvedExp = resolveSection(legacyResume, 'experience');
      expect(resolvedExp?.present).toBe(true);
      expect(resolvedExp?.visible).toBe(true);
      expect(resolvedExp?.hasContent).toBe(true);
      expect(resolvedExp?.content).toEqual(legacyResume.experience);

      const resolvedSkills = resolveSection(legacyResume, 'skills');
      expect(resolvedSkills?.present).toBe(true);
      expect(resolvedSkills?.visible).toBe(true);
      expect(resolvedSkills?.hasContent).toBe(true);

      // 2. Unmentioned optional sections (e.g. leadership)
      const resolvedLeadership = resolveSection(legacyResume, 'leadership');
      expect(resolvedLeadership?.present).toBe(false);
      expect(resolvedLeadership?.visible).toBe(false);

      // 3. Immutability verification
      expect(legacyResume).toEqual(clone);
    });
  });

  describe('7. AI Agent Section Operations (show_section, hide_section, rename_section)', () => {
    it('applies show_section operation and populates scalar content when provided', async () => {
      const { validateOperation, applyOperation } = await import('../utils/resumeOperations');

      const op = {
        operationId: 'op_test_1',
        agentRunId: 'run_test_1',
        op: 'show_section' as const,
        section: 'references',
        value: 'Available upon request from previous engineering managers.',
        reason: 'Add requested reference section',
        evidence: [],
      };

      const check = validateOperation(op, INITIAL_DATA);
      expect(check.ok).toBe(true);

      const updated = applyOperation(INITIAL_DATA, op);
      expect(updated.referee).toBe('Available upon request from previous engineering managers.');
      expect(updated.sectionVisibility?.references).toBe(true);
      expect(updated.sectionOrder).toContain('references');

      const resolved = resolveSection(updated, 'references');
      expect(resolved?.visible).toBe(true);
      expect(resolved?.hasContent).toBe(true);
      expect(resolved?.content).toBe('Available upon request from previous engineering managers.');
    });

    it('applies hide_section operation and rejects hiding contact', async () => {
      const { validateOperation, applyOperation } = await import('../utils/resumeOperations');

      // 1. Hide summary
      const hideSummaryOp = {
        operationId: 'op_test_2',
        agentRunId: 'run_test_1',
        op: 'hide_section' as const,
        section: 'summary',
        reason: 'Remove summary section per candidate request',
        evidence: [],
      };

      const checkSummary = validateOperation(hideSummaryOp, INITIAL_DATA);
      expect(checkSummary.ok).toBe(true);

      const updated = applyOperation(INITIAL_DATA, hideSummaryOp);
      expect(updated.sectionVisibility?.summary).toBe(false);
      expect(updated.summary).toBe(INITIAL_DATA.summary); // data preserved

      const resolvedSummary = resolveSection(updated, 'summary');
      expect(resolvedSummary?.visible).toBe(false);

      // 2. Reject hiding contact
      const hideContactOp = {
        operationId: 'op_test_3',
        agentRunId: 'run_test_1',
        op: 'hide_section' as const,
        section: 'contact',
        reason: 'Hide contact',
        evidence: [],
      };
      const checkContact = validateOperation(hideContactOp, INITIAL_DATA);
      expect(checkContact.ok).toBe(false);
    });

    it('applies rename_section operation', async () => {
      const { validateOperation, applyOperation } = await import('../utils/resumeOperations');

      const renameOp = {
        operationId: 'op_test_4',
        agentRunId: 'run_test_1',
        op: 'rename_section' as const,
        section: 'experience',
        title: 'Professional Work History',
        reason: 'Tailored title for executive review',
        evidence: [],
      };

      const check = validateOperation(renameOp, INITIAL_DATA);
      expect(check.ok).toBe(true);

      const updated = applyOperation(INITIAL_DATA, renameOp);
      expect(updated.sectionTitles?.experience).toBe('Professional Work History');

      const resolved = resolveSection(updated, 'experience');
      expect(resolved?.title).toBe('Professional Work History');
    });
  });

  describe('8. Inline Text Candidates & Bullet Editing', () => {
    it('buildTextCandidates includes bullets for experience, projects, achievements, and custom sections', async () => {
      const { buildTextCandidates, isBodyTextField } = await import('../utils/inlineTextFormat');

      const dataWithCustom: ResumeData = {
        ...INITIAL_DATA,
        volunteering: [
          {
            id: 'vol_1',
            role: 'Mentor',
            company: 'Tech NGO',
            description: ['Mentored 10 junior developers', 'Organized community workshops'],
          },
        ],
        customSections: {
          custom_awards: {
            id: 'custom_awards',
            title: 'Key Accolades',
            contentType: 'bullets',
            content: ['Top Performer 2023', 'Innovation Award 2024'],
          },
        },
      };

      const candidates = buildTextCandidates(dataWithCustom);
      const paths = candidates.map((c) => c.path);

      expect(paths).toContain('volunteering.0.description.0');
      expect(paths).toContain('volunteering.0.description.1');
      expect(paths).toContain('customSections.custom_awards.content.0');
      expect(paths).toContain('customSections.custom_awards.content.1');

      expect(isBodyTextField('volunteering.0.description.0')).toBe(true);
      expect(isBodyTextField('customSections.custom_awards.content.0')).toBe(true);
      expect(isBodyTextField('projects.0.description.0')).toBe(true);
    });

    it('parseDescriptionBullets preserves empty strings for in-progress bullet typing', async () => {
      const { parseDescriptionBullets } = await import('../utils/templateUtils');

      const bulletsWithEmpty = ['First bullet line', ''];
      const parsed = parseDescriptionBullets(bulletsWithEmpty);

      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toBe('First bullet line');
      expect(parsed[1]).toBe('');
    });

    it('ensureBulletEndsWithPeriod ensures bullets end with full-stop', async () => {
      const { ensureBulletEndsWithPeriod } = await import('../utils/templateUtils');

      expect(ensureBulletEndsWithPeriod('Led a team of 5 engineers')).toBe('Led a team of 5 engineers.');
      expect(ensureBulletEndsWithPeriod('Led a team of 5 engineers.')).toBe('Led a team of 5 engineers.');
      expect(ensureBulletEndsWithPeriod('Led a team of 5 engineers;')).toBe('Led a team of 5 engineers.');
      expect(ensureBulletEndsWithPeriod('Led a team of 5 engineers,')).toBe('Led a team of 5 engineers.');
      expect(ensureBulletEndsWithPeriod('Led a team of 5 engineers -')).toBe('Led a team of 5 engineers.');
      expect(ensureBulletEndsWithPeriod('Led a team with **React and TypeScript**')).toBe('Led a team with **React and TypeScript**.');
      expect(ensureBulletEndsWithPeriod('Completed feature (v2.0).')).toBe('Completed feature (v2.0).');
      expect(ensureBulletEndsWithPeriod('')).toBe('');
      expect(ensureBulletEndsWithPeriod('   ')).toBe('');
    });

    it('formatAllResumeBullets formats all bullets across resume sections', async () => {
      const { formatAllResumeBullets } = await import('../utils/templateUtils');

      const input = {
        experience: [
          {
            id: 'exp1',
            company: 'Tech Corp',
            role: 'Engineer',
            startDate: '2020',
            endDate: '2022',
            description: '• Built scalable microservices\n• Increased performance by 30%',
          },
          {
            id: 'exp2',
            company: 'Design Studio',
            role: 'Designer',
            startDate: '2018',
            endDate: '2020',
            description: ['Created wireframes and prototypes', 'Conducted user interviews;'],
          },
        ],
        projects: [
          {
            id: 'proj1',
            name: 'App',
            description: 'Mobile iOS app developed with Swift',
          },
        ],
        keyAchievements: ['Top performer of the year', 'Published research paper.'],
      };

      const formatted = formatAllResumeBullets(input as any);

      expect(formatted.experience[0].description).toBe(
        '• Built scalable microservices.\n• Increased performance by 30%.'
      );
      expect(formatted.experience[1].description).toEqual([
        'Created wireframes and prototypes.',
        'Conducted user interviews.',
      ]);
      expect(formatted.keyAchievements).toEqual([
        'Top performer of the year.',
        'Published research paper.',
      ]);
    });

    it('Expert-Level skills resolves and renders with parseExpertSkillItems', async () => {
      const { parseExpertSkillItems } = await import('../utils/templateUtils');
      
      const structuredInput = [
        { id: '1', category: 'Leadership', skills: 'Speaking, Fundraising, Product Development' },
        { id: '2', category: 'Front End', skills: 'HTML, CSS, Bootstrap, Webflow' },
      ];
      expect(parseExpertSkillItems(structuredInput)).toEqual(structuredInput);

      const rawStringInput = `Leadership: Speaking, Fundraising, Product Development\nFront End: HTML, CSS, Bootstrap, Webflow\nFields of Interest: Early-Stage Fundraising, Growth`;
      const parsed = parseExpertSkillItems(rawStringInput);
      expect(parsed.length).toBe(3);
      expect(parsed[0].category).toBe('Leadership');
      expect(parsed[0].skills).toBe('Speaking, Fundraising, Product Development');
      expect(parsed[1].category).toBe('Front End');
      expect(parsed[2].category).toBe('Fields of Interest');

      const data: ResumeData = {
        ...INITIAL_DATA,
        expertSkills: structuredInput,
      };
      expect(hasSectionContent(data, 'expert_skills')).toBe(true);
      expect(getSectionContent(data, 'expert_skills')).toEqual(structuredInput);
      expect(normalizeSectionType('expertSkills')).toBe('expert_skills');
      expect(normalizeSectionType('expert_level_skills')).toBe('expert_skills');
      expect(normalizeSectionType('expertLevelSkills')).toBe('expert_skills');
    });
  });
});

