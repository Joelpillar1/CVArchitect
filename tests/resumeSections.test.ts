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
  isSectionHiddenByTemplateDefault,
  isSectionExplicitlyAdded,
  getSectionTitle,
  resolveSection,
} from '../utils/sectionRegistry';
import type { ResumeSectionType } from '../types/resumeSections';
import type { ResumeData } from '../types';
import { INITIAL_DATA } from '../types';
import { buildTextCandidates } from '../utils/inlineTextFormat';

describe('Phase 1: Resume Section Domain Architecture', () => {
  const ALL_38_TYPES: ResumeSectionType[] = [
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
    'involvement',
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
      expect(registeredTypes.length).toBe(38);
      expect(new Set(registeredTypes).size).toBe(38);

      for (const type of ALL_38_TYPES) {
        expect(SECTION_REGISTRY[type]).toBeDefined();
        expect(SECTION_REGISTRY[type].type).toBe(type);
      }
    });

    it('3. Exactly the intended 8 core sections are defaultVisible: true', () => {
      const defaultVisibleTypes = ALL_38_TYPES.filter((t) => SECTION_REGISTRY[t].defaultVisible);
      expect(defaultVisibleTypes.sort()).toEqual([...CORE_8_VISIBLE].sort());
      expect(defaultVisibleTypes.length).toBe(8);
    });

    it('4. All other optional sections are defaultVisible: false', () => {
      const hiddenTypes = ALL_38_TYPES.filter((t) => !SECTION_REGISTRY[t].defaultVisible);
      expect(hiddenTypes.length).toBe(30);
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

    it('16b. Contact section correctly resolves github and portfolio', () => {
      const contactData: ResumeData = {
        ...INITIAL_DATA,
        fullName: 'Jane Doe',
        github: 'github.com/janedoe',
        portfolio: 'janedoe.dev',
      };
      const contact = getSectionContent(contactData, 'contact') as any;
      expect(contact.github).toBe('github.com/janedoe');
      expect(contact.portfolio).toBe('janedoe.dev');
      expect(hasSectionContent(contactData, 'contact')).toBe(true);

      const candidates = buildTextCandidates(contactData);
      expect(candidates.some((c: any) => c.path === 'github')).toBe(true);
      expect(candidates.some((c: any) => c.path === 'portfolio')).toBe(true);
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
            startDate: '',
            endDate: '',
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
      // expert_skills is retired and never treated as populated content
      expect(hasSectionContent(data, 'expert_skills')).toBe(false);
      expect(getSectionContent(data, 'expert_skills')).toEqual(structuredInput);
      expect(normalizeSectionType('expertSkills')).toBe('expert_skills');
      expect(normalizeSectionType('expert_level_skills')).toBe('expert_skills');
      expect(normalizeSectionType('expertLevelSkills')).toBe('expert_skills');
    });

    it('GitHub and Portfolio formatters return clean labels "GitHub" and "Portfolio" with normalized URLs', async () => {
      const {
        formatGitHubDisplay,
        getGitHubHref,
        formatPortfolioDisplay,
        getPortfolioHref,
      } = await import('../utils/templateUtils');

      // GitHub
      expect(formatGitHubDisplay('https://github.com/johndoe')).toBe('GitHub');
      expect(formatGitHubDisplay('github.com/johndoe')).toBe('GitHub');
      expect(formatGitHubDisplay('johndoe')).toBe('GitHub');
      expect(formatGitHubDisplay('')).toBe('');
      expect(formatGitHubDisplay(undefined)).toBe('');
      expect(getGitHubHref('johndoe')).toBe('https://github.com/johndoe');
      expect(getGitHubHref('https://github.com/johndoe')).toBe('https://github.com/johndoe');

      // Portfolio
      expect(formatPortfolioDisplay('https://myportfolio.dev')).toBe('Portfolio');
      expect(formatPortfolioDisplay('myportfolio.dev/projects')).toBe('Portfolio');
      expect(formatPortfolioDisplay('')).toBe('');
      expect(formatPortfolioDisplay(undefined)).toBe('');
      expect(getPortfolioHref('myportfolio.dev')).toBe('https://myportfolio.dev');
      expect(getPortfolioHref('https://myportfolio.dev')).toBe('https://myportfolio.dev');
    });

    it('Harvard template is grouped under Student category', async () => {
      const { TEMPLATE_CONFIG, getTemplateCategory } = await import('../utils/templateConfig');

      const harvardTemplate = TEMPLATE_CONFIG.find(t => t.id === 'rezi');
      expect(harvardTemplate).toBeDefined();
      expect(harvardTemplate?.name).toBe('Harvard');
      expect(getTemplateCategory(harvardTemplate!)).toBe('Student');

      // Also ensure generic lookup with id 'rezi' or name 'Harvard' returns 'Student'
      expect(getTemplateCategory({ id: 'rezi' as any, name: 'Harvard', subtitle: 'Ivy' })).toBe('Student');
    });

    it('Analyst template is named "Analyst" with updated preview details', async () => {
      const { TEMPLATE_CONFIG } = await import('../utils/templateConfig');
      const { GAURAV_TEMPLATE_PREVIEW_DATA } = await import('../utils/sampleResumeData');

      const analystTemplate = TEMPLATE_CONFIG.find(t => t.id === 'gaurav');
      expect(analystTemplate).toBeDefined();
      expect(analystTemplate?.name).toBe('Analyst');

      expect(GAURAV_TEMPLATE_PREVIEW_DATA.fullName).toBe('Alexander Williams');
      expect(GAURAV_TEMPLATE_PREVIEW_DATA.email).toBe('alexander.williams@example.com');
      expect(GAURAV_TEMPLATE_PREVIEW_DATA.phone).toBe('+1 (555) 123-4567');
      expect(GAURAV_TEMPLATE_PREVIEW_DATA.atHandle).toBe('');
      expect(GAURAV_TEMPLATE_PREVIEW_DATA.experience[0].role).toBe('Senior Data Analyst');
    });

    it('Sage template hides leadership, projects, additional_information, and references by default', async () => {
      const { isSectionHiddenByTemplateDefault, TEMPLATE_HIDDEN_SECTION_TYPES } = await import('../utils/sectionRegistry');

      expect(TEMPLATE_HIDDEN_SECTION_TYPES.sage).toEqual([
        'leadership',
        'projects',
        'additional_information',
        'references',
      ]);

      expect(isSectionHiddenByTemplateDefault('sage', 'leadership')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('sage', 'projects')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('sage', 'additionalInfo')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('sage', 'additional_information')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('sage', 'referee')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('sage', 'references')).toBe(true);

      // Other sections remain visible
      expect(isSectionHiddenByTemplateDefault('sage', 'experience')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('sage', 'education')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('sage', 'skills')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('sage', 'summary')).toBe(false);

      // Opt-in via sectionVisibility works
      expect(isSectionHiddenByTemplateDefault('sage', 'leadership', { leadership: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('sage', 'projects', { projects: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('sage', 'additionalInfo', { additionalInfo: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('sage', 'references', { references: true })).toBe(false);
    });

    it('Times Classic template hides leadership, projects, additional_information, and references by default', async () => {
      const { isSectionHiddenByTemplateDefault, TEMPLATE_HIDDEN_SECTION_TYPES } = await import('../utils/sectionRegistry');

      expect(TEMPLATE_HIDDEN_SECTION_TYPES.times).toEqual([
        'leadership',
        'projects',
        'additional_information',
        'references',
      ]);

      expect(isSectionHiddenByTemplateDefault('times', 'leadership')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('times', 'projects')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('times', 'additionalInfo')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('times', 'additional_information')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('times', 'referee')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('times', 'references')).toBe(true);

      // Other sections remain visible
      expect(isSectionHiddenByTemplateDefault('times', 'experience')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('times', 'education')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('times', 'skills')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('times', 'summary')).toBe(false);

      // Opt-in via sectionVisibility works
      expect(isSectionHiddenByTemplateDefault('times', 'leadership', { leadership: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('times', 'projects', { projects: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('times', 'additionalInfo', { additionalInfo: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('times', 'references', { references: true })).toBe(false);
    });

    it('Regent Serif template hides leadership, projects, additional_information, and references by default', async () => {
      const { isSectionHiddenByTemplateDefault, TEMPLATE_HIDDEN_SECTION_TYPES } = await import('../utils/sectionRegistry');

      expect(TEMPLATE_HIDDEN_SECTION_TYPES.regent).toEqual([
        'leadership',
        'projects',
        'additional_information',
        'references',
      ]);

      expect(isSectionHiddenByTemplateDefault('regent', 'leadership')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('regent', 'projects')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('regent', 'additionalInfo')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('regent', 'additional_information')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('regent', 'referee')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('regent', 'references')).toBe(true);

      // Other sections remain visible
      expect(isSectionHiddenByTemplateDefault('regent', 'experience')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('regent', 'education')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('regent', 'skills')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('regent', 'summary')).toBe(false);

      // Opt-in via sectionVisibility works
      expect(isSectionHiddenByTemplateDefault('regent', 'leadership', { leadership: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('regent', 'projects', { projects: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('regent', 'additionalInfo', { additionalInfo: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('regent', 'references', { references: true })).toBe(false);
    });

    it('Pro Clean template hides leadership, projects, additional_information, and references by default', async () => {
      const { isSectionHiddenByTemplateDefault, TEMPLATE_HIDDEN_SECTION_TYPES } = await import('../utils/sectionRegistry');

      expect(TEMPLATE_HIDDEN_SECTION_TYPES.professional).toEqual([
        'leadership',
        'projects',
        'additional_information',
        'references',
      ]);

      expect(isSectionHiddenByTemplateDefault('professional', 'leadership')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('professional', 'projects')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('professional', 'additionalInfo')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('professional', 'additional_information')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('professional', 'referee')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('professional', 'references')).toBe(true);

      // Other sections remain visible
      expect(isSectionHiddenByTemplateDefault('professional', 'experience')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('professional', 'education')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('professional', 'skills')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('professional', 'summary')).toBe(false);

      // Opt-in via sectionVisibility works
      expect(isSectionHiddenByTemplateDefault('professional', 'leadership', { leadership: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('professional', 'projects', { projects: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('professional', 'additionalInfo', { additionalInfo: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('professional', 'references', { references: true })).toBe(false);
    });

    it('Styled template hides leadership, projects, additional_information, and references by default', async () => {
      const { isSectionHiddenByTemplateDefault, TEMPLATE_HIDDEN_SECTION_TYPES } = await import('../utils/sectionRegistry');

      expect(TEMPLATE_HIDDEN_SECTION_TYPES.styled).toEqual([
        'leadership',
        'projects',
        'additional_information',
        'references',
      ]);

      expect(isSectionHiddenByTemplateDefault('styled', 'leadership')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('styled', 'projects')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('styled', 'additionalInfo')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('styled', 'additional_information')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('styled', 'referee')).toBe(true);
      expect(isSectionHiddenByTemplateDefault('styled', 'references')).toBe(true);

      // Other sections remain visible
      expect(isSectionHiddenByTemplateDefault('styled', 'experience')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('styled', 'education')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('styled', 'skills')).toBe(false);
      expect(isSectionHiddenByTemplateDefault('styled', 'summary')).toBe(false);

      // Opt-in via sectionVisibility works
      expect(isSectionHiddenByTemplateDefault('styled', 'leadership', { leadership: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('styled', 'projects', { projects: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('styled', 'additionalInfo', { additionalInfo: true })).toBe(false);
      expect(isSectionHiddenByTemplateDefault('styled', 'references', { references: true })).toBe(false);
    });

    it('CLASSIC_TEMPLATE_PREVIEW_DATA has Professional Summary, no professional title, and is tailored for engineering in New Zealand', async () => {
      const { CLASSIC_TEMPLATE_PREVIEW_DATA, getTemplatePreviewData } = await import('../utils/sampleResumeData');

      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.jobTitle).toBe('');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.location).toBe('Auckland, New Zealand');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.sectionTitles?.summary).toBe('Professional Summary');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.sectionTitles?.skills).toBe('Skills');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.summary).toContain('Chartered Mechanical and Systems Engineer');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.summary).toContain('New Zealand');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.experience.length).toBe(3);
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.experience[0].role).toBe('Lead Mechanical Systems Engineer');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.experience[0].company).toBe('Beca Engineering');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.experience[0].location).toBe('Auckland, New Zealand');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.education.length).toBe(2);
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.education[0].degree).toBe('Master of Engineering (Mechanical)');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.education[0].school).toBe('University of Auckland');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.certifications.length).toBe(3);
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.certifications[0].name).toBe('Chartered Professional Engineer (CPEng) – Mechanical');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.certifications[0].issuer).toBe('Engineering New Zealand');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.skills).toContain('Technical Skills: CAD/CAM');
      expect(CLASSIC_TEMPLATE_PREVIEW_DATA.skills).toContain('Software & Standards: Revit MEP');

      const classicPreview = getTemplatePreviewData('classic');
      expect(classicPreview.jobTitle).toBe('');
      expect(classicPreview.location).toBe('Auckland, New Zealand');
      expect(classicPreview.sectionTitles?.summary).toBe('Professional Summary');
      expect(classicPreview.summary).toBe(CLASSIC_TEMPLATE_PREVIEW_DATA.summary);
      expect(classicPreview.experience).toEqual(CLASSIC_TEMPLATE_PREVIEW_DATA.experience);
    });

    it('sanitizeResumeData converts null and undefined collections to safe defaults', async () => {
      const { sanitizeResumeData } = await import('../utils/resumeSanitizer');

      const corruptedInput: any = {
        fullName: 'Jane Doe',
        experience: null,
        education: null,
        skills: null,
        summary: null,
        projects: null,
        certifications: null,
        languages: null,
        additionalInfo: null,
        leadership: null,
      };

      const sanitized = sanitizeResumeData(corruptedInput);

      expect(sanitized.fullName).toBe('Jane Doe');
      expect(Array.isArray(sanitized.experience)).toBe(true);
      expect(sanitized.experience).toEqual([]);
      expect(Array.isArray(sanitized.education)).toBe(true);
      expect(sanitized.education).toEqual([]);
      expect(typeof sanitized.skills).toBe('string');
      expect(sanitized.skills).toBe('');
      expect(typeof sanitized.summary).toBe('string');
      expect(sanitized.summary).toBe('');
      expect(Array.isArray(sanitized.projects)).toBe(true);
      expect(Array.isArray(sanitized.certifications)).toBe(true);
      expect(Array.isArray(sanitized.languages)).toBe(true);
      expect(Array.isArray(sanitized.additionalInfo)).toBe(true);
      expect(Array.isArray(sanitized.leadership)).toBe(true);
    });
  });

  describe('Involvement section: Free/CareerCraft migration', () => {
    const freeResumeWithLeadership: ResumeData = {
      ...INITIAL_DATA,
      template: 'free',
      leadership: [
        {
          id: '1',
          role: 'President',
          company: 'Robotics Club',
          location: 'University of Wisconsin–Madison',
          startDate: 'September 2019',
          endDate: 'Present',
          description: ['Ran weekly build sessions'],
        },
      ],
      sectionOrder: ['education', 'experience', 'leadership', 'skills'],
      sectionTitles: { leadership: 'INVOLVEMENT' },
      sectionVisibility: { leadership: true, summary: false },
    };

    it('moves leadership content into the involvement section for free-template resumes', async () => {
      const { migrateLeadershipToInvolvement } = await import('../utils/resumeSanitizer');

      const migrated = migrateLeadershipToInvolvement(freeResumeWithLeadership);

      expect(migrated.involvement).toHaveLength(1);
      expect(migrated.involvement?.[0].role).toBe('President');
      expect(migrated.leadership).toEqual([]);
      expect(migrated.sectionOrder).toEqual(['education', 'experience', 'involvement', 'skills']);
      expect(migrated.sectionTitles?.involvement).toBe('INVOLVEMENT');
      expect(migrated.sectionTitles && 'leadership' in migrated.sectionTitles).toBe(false);
      expect(migrated.sectionVisibility?.involvement).toBe(true);
      expect(migrated.sectionVisibility?.summary).toBe(false);
      expect(migrated.sectionVisibility && 'leadership' in migrated.sectionVisibility).toBe(false);
    });

    it('leaves leadership data untouched when it is not used as involvement', async () => {
      const { migrateLeadershipToInvolvement } = await import('../utils/resumeSanitizer');

      const otherResume: ResumeData = {
        ...INITIAL_DATA,
        template: 'vanguard',
        leadership: [
          {
            id: '1',
            role: 'Team Lead',
            company: 'Engineering Org',
            startDate: 'January 2020',
            endDate: 'Present',
            description: ['Led the team'],
          },
        ],
        sectionTitles: { leadership: 'Leadership & Activities' },
      };

      const result = migrateLeadershipToInvolvement(otherResume);
      expect(result).toBe(otherResume);
      expect(result.leadership).toHaveLength(1);
      expect(result.involvement ?? []).toHaveLength(0);
    });

    it('is idempotent once the involvement section has content', async () => {
      const { migrateLeadershipToInvolvement } = await import('../utils/resumeSanitizer');

      const once = migrateLeadershipToInvolvement(freeResumeWithLeadership);
      const twice = migrateLeadershipToInvolvement(once);
      expect(twice).toBe(once);
      expect(twice.involvement).toHaveLength(1);
    });

    it('CareerCraft preview uses the Involvement section with the reference template entries', async () => {
      const { getTemplatePreviewData } = await import('../utils/sampleResumeData');

      const preview = getTemplatePreviewData('free');

      // Uses involvement — not leadership
      expect(preview.leadership ?? []).toHaveLength(0);
      expect(preview.sectionOrder).toContain('involvement');
      expect(preview.sectionOrder).not.toContain('leadership');
      expect(preview.sectionTitles?.involvement).toBe('INVOLVEMENT');
      expect(preview.sectionTitles && 'leadership' in preview.sectionTitles).toBe(false);

      // Reference template's involvement details are present
      const roles = (preview.involvement ?? []).map((e) => e.role);
      expect(roles).toEqual(
        expect.arrayContaining([
          'Associate Member',
          'Active Member',
          'General Member',
          'Electrical Lead & Powertrain Engineer', // pre-existing entry kept
        ])
      );

      const associate = (preview.involvement ?? []).find((e) => e.role === 'Associate Member');
      expect(associate?.location).toBe('University of Wisconsin–Madison');
      expect(associate?.company).toBe('Capital Management Club');
      expect(associate?.startDate).toBe('September 2019');
      expect(associate?.endDate).toBe('Present');
      expect(associate?.description).toEqual([
        'Develop equity research skills through attending training sessions that utilize FactSet software',
        'Learn value and growth-based investing strategies by looking at relevant company multiples',
      ]);

      // Resolves as a visible, experience-rendered section (entries with bulleted descriptions)
      const resolved = resolveSection(preview, 'involvement');
      expect(resolved?.visible).toBe(true);
      expect(resolved?.hasContent).toBe(true);
      expect(resolved?.rendererKind).toBe('experience');
    });

    it('removes additional_information and references by default across templates until added via editor', () => {
      const templates = ['vanguard', 'freshgrad1', 'freshgrad8', 'student', 'free', 'times', 'classic'];

      templates.forEach((tpl) => {
        const defaultResume: ResumeData = {
          ...INITIAL_DATA,
          template: tpl as any,
          additionalInfo: [{ id: '1', label: 'Hobbies', value: 'Photography' }],
          referee: 'Available upon request',
        };

        // By default (not added via editor / sectionVisibility = true), both sections must be hidden
        expect(isSectionHiddenByTemplateDefault(tpl, 'additional_information', defaultResume.sectionVisibility)).toBe(true);
        expect(isSectionHiddenByTemplateDefault(tpl, 'additionalInfo', defaultResume.sectionVisibility)).toBe(true);
        expect(isSectionHiddenByTemplateDefault(tpl, 'references', defaultResume.sectionVisibility)).toBe(true);
        expect(isSectionHiddenByTemplateDefault(tpl, 'referee', defaultResume.sectionVisibility)).toBe(true);

        expect(isSectionVisible(defaultResume, 'additional_information')).toBe(false);
        expect(isSectionVisible(defaultResume, 'additionalInfo')).toBe(false);
        expect(isSectionVisible(defaultResume, 'references')).toBe(false);
        expect(isSectionVisible(defaultResume, 'referee')).toBe(false);

        const resolvedAddl = resolveSection(defaultResume, 'additional_information');
        expect(resolvedAddl?.visible).toBe(false);

        const resolvedRef = resolveSection(defaultResume, 'references');
        expect(resolvedRef?.visible).toBe(false);

        // When added via the editor (sectionVisibility set to true)
        const optedInResume: ResumeData = {
          ...defaultResume,
          sectionVisibility: {
            additional_information: true,
            references: true,
          },
        };

        expect(isSectionHiddenByTemplateDefault(tpl, 'additional_information', optedInResume.sectionVisibility)).toBe(false);
        expect(isSectionHiddenByTemplateDefault(tpl, 'references', optedInResume.sectionVisibility)).toBe(false);

        expect(isSectionVisible(optedInResume, 'additional_information')).toBe(true);
        expect(isSectionVisible(optedInResume, 'references')).toBe(true);

        const resolvedOptedAddl = resolveSection(optedInResume, 'additional_information');
        expect(resolvedOptedAddl?.visible).toBe(true);
        expect(resolvedOptedAddl?.hasContent).toBe(true);

        const resolvedOptedRef = resolveSection(optedInResume, 'references');
        expect(resolvedOptedOptedRef => resolvedOptedRef?.visible).toBeTruthy();
        expect(resolvedOptedRef?.visible).toBe(true);
        expect(resolvedOptedRef?.hasContent).toBe(true);
      });
    });

    it('preserves typed text and splits accurately when Enter is pressed on a bullet', () => {
      // Simulates the handleBulletEnter logic
      const lines = ['Initial bullet'];
      const bulletIndex = 0;
      const liveDomText = 'Initial bullet with freshly typed words';
      const stored = liveDomText;
      const caretOffset = liveDomText.length;
      const beforeTagged = stored.slice(0, caretOffset);
      const afterTagged = stored.slice(caretOffset);

      const cleanBefore = beforeTagged.trim();
      const cleanAfter = afterTagged.trim();

      lines.splice(bulletIndex, 1, cleanBefore, cleanAfter);

      expect(lines).toEqual(['Initial bullet with freshly typed words', '']);

      // Now simulate typing into the new empty bullet and pressing Enter again
      const newBulletIndex = 1;
      const secondTyped = 'Second line typed by user';
      const secondBefore = secondTyped.slice(0, secondTyped.length);
      const secondAfter = secondTyped.slice(secondTyped.length);

      lines.splice(newBulletIndex, 1, secondBefore.trim(), secondAfter.trim());

      expect(lines).toEqual([
        'Initial bullet with freshly typed words',
        'Second line typed by user',
        '',
      ]);
    });
  });
});

describe('isSectionExplicitlyAdded — explicit adds beat template design blocks', () => {
  it('is false when there is no data or no section key', () => {
    expect(isSectionExplicitlyAdded(null, 'summary')).toBe(false);
    expect(isSectionExplicitlyAdded(undefined, 'summary')).toBe(false);
    expect(isSectionExplicitlyAdded({ sectionVisibility: { summary: true } }, '')).toBe(false);
  });

  it('is false by default so template "not part of this design" blocks still apply', () => {
    expect(isSectionExplicitlyAdded({}, 'summary')).toBe(false);
    expect(isSectionExplicitlyAdded({ sectionVisibility: {} }, 'achievements')).toBe(false);
    expect(
      isSectionExplicitlyAdded({ sectionVisibility: { summary: false } }, 'summary')
    ).toBe(false);
  });

  it('is true when sectionVisibility opts in via the raw key or canonical type', () => {
    expect(isSectionExplicitlyAdded({ sectionVisibility: { summary: true } }, 'summary')).toBe(true);
    expect(isSectionExplicitlyAdded({ sectionVisibility: { references: true } }, 'references')).toBe(
      true
    );
    // Legacy order ids resolve to their canonical type
    expect(
      isSectionExplicitlyAdded({ sectionVisibility: { achievements: true } }, 'keyAchievements')
    ).toBe(true);
  });

  it('is true when the section is recorded in userAddedSections', () => {
    expect(isSectionExplicitlyAdded({ userAddedSections: ['summary'] }, 'summary')).toBe(true);
    // Canonical type matches an aliased entry
    expect(isSectionExplicitlyAdded({ userAddedSections: ['achievements'] }, 'keyAchievements')).toBe(
      true
    );
    expect(isSectionExplicitlyAdded({ userAddedSections: ['awards'] }, 'awards')).toBe(true);
    expect(isSectionExplicitlyAdded({ userAddedSections: ['awards'] }, 'summary')).toBe(false);
  });
});


