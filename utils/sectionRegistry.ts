import type { ResumeData, AdditionalInfoItem, Experience, Education, Certification, Project, LanguageItem, CourseworkItem, ExpertSkillItem } from '../types';
import type {
  ResumeSectionType,
  SectionDefinition,
  SectionRendererKind,
  CustomSectionData,
} from '../types/resumeSections';

/**
 * Static Section Registry defining all 36 supported resume section types,
 * default titles, default visibility flags, renderer routing kinds, and capabilities.
 */
export const SECTION_REGISTRY: Record<ResumeSectionType, SectionDefinition> = {
  contact: {
    type: 'contact',
    defaultTitle: 'Contact',
    defaultVisible: true,
    isRequired: true,
    canHide: false,
    canRename: false,
    canReorder: false,
    rendererKind: 'contact',
    dataField: 'contact',
  },
  summary: {
    type: 'summary',
    defaultTitle: 'Professional Summary',
    defaultVisible: true,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'text',
    dataField: 'summary',
  },
  experience: {
    type: 'experience',
    defaultTitle: 'Work Experience',
    defaultVisible: true,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'experience',
    dataField: 'experience',
  },
  education: {
    type: 'education',
    defaultTitle: 'Education',
    defaultVisible: true,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'education',
    dataField: 'education',
  },
  skills: {
    type: 'skills',
    defaultTitle: 'Skills',
    defaultVisible: true,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'skills',
    dataField: 'skills',
  },
  expert_skills: {
    type: 'expert_skills',
    defaultTitle: 'Expert-Level Skills',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'expert_skills',
    dataField: 'expertSkills',
  },
  technical_skills: {
    type: 'technical_skills',
    defaultTitle: 'Technical Skills',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'skills',
    dataField: 'technicalSkills',
  },
  core_competencies: {
    type: 'core_competencies',
    defaultTitle: 'Core Competencies',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'skills',
    dataField: 'coreCompetencies',
  },
  tools_and_technologies: {
    type: 'tools_and_technologies',
    defaultTitle: 'Tools & Technologies',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'skills',
    dataField: 'toolsAndTechnologies',
  },
  projects: {
    type: 'projects',
    defaultTitle: 'Projects',
    defaultVisible: true,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'projects',
    dataField: 'projects',
  },
  certifications: {
    type: 'certifications',
    defaultTitle: 'Certifications',
    defaultVisible: true,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'certifications',
    dataField: 'certifications',
  },
  licenses: {
    type: 'licenses',
    defaultTitle: 'Licenses',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'certifications',
    dataField: 'licenses',
  },
  achievements: {
    type: 'achievements',
    defaultTitle: 'Key Achievements',
    defaultVisible: true,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'bullets',
    dataField: 'keyAchievements',
  },
  awards: {
    type: 'awards',
    defaultTitle: 'Awards',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'bullets',
    dataField: 'awards',
  },
  languages: {
    type: 'languages',
    defaultTitle: 'Languages',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'languages',
    dataField: 'languages',
  },
  leadership: {
    type: 'leadership',
    defaultTitle: 'Leadership',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'experience',
    dataField: 'leadership',
  },
  volunteering: {
    type: 'volunteering',
    defaultTitle: 'Volunteering',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'experience',
    dataField: 'volunteering',
  },
  involvement: {
    type: 'involvement',
    defaultTitle: 'Involvement',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'experience',
    dataField: 'involvement',
  },
  memberships: {
    type: 'memberships',
    defaultTitle: 'Memberships',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'certifications',
    dataField: 'memberships',
  },
  publications: {
    type: 'publications',
    defaultTitle: 'Publications',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'bullets',
    dataField: 'publications',
  },
  conferences_speaking: {
    type: 'conferences_speaking',
    defaultTitle: 'Conferences & Speaking',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'bullets',
    dataField: 'conferencesSpeaking',
  },
  research: {
    type: 'research',
    defaultTitle: 'Research',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'experience',
    dataField: 'research',
  },
  teaching: {
    type: 'teaching',
    defaultTitle: 'Teaching',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'experience',
    dataField: 'teaching',
  },
  coursework: {
    type: 'coursework',
    defaultTitle: 'Relevant Coursework',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'coursework',
    dataField: 'coursework',
  },
  thesis: {
    type: 'thesis',
    defaultTitle: 'Thesis',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'text',
    dataField: 'thesis',
  },
  academic_achievements: {
    type: 'academic_achievements',
    defaultTitle: 'Academic Achievements',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'bullets',
    dataField: 'academicAchievements',
  },
  portfolio: {
    type: 'portfolio',
    defaultTitle: 'Portfolio',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'projects',
    dataField: 'portfolio',
  },
  case_studies: {
    type: 'case_studies',
    defaultTitle: 'Case Studies',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'projects',
    dataField: 'caseStudies',
  },
  selected_work: {
    type: 'selected_work',
    defaultTitle: 'Selected Work',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'projects',
    dataField: 'selectedWork',
  },
  patents: {
    type: 'patents',
    defaultTitle: 'Patents',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'certifications',
    dataField: 'patents',
  },
  grants: {
    type: 'grants',
    defaultTitle: 'Grants',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'certifications',
    dataField: 'grants',
  },
  security_clearance: {
    type: 'security_clearance',
    defaultTitle: 'Security Clearance',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'text',
    dataField: 'securityClearance',
  },
  military: {
    type: 'military',
    defaultTitle: 'Military Experience',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'experience',
    dataField: 'military',
  },
  clinical_experience: {
    type: 'clinical_experience',
    defaultTitle: 'Clinical Experience',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'experience',
    dataField: 'clinicalExperience',
  },
  interests: {
    type: 'interests',
    defaultTitle: 'Interests',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'text',
    dataField: 'interests',
  },
  references: {
    type: 'references',
    defaultTitle: 'References',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'text',
    dataField: 'referee',
  },
  additional_information: {
    type: 'additional_information',
    defaultTitle: 'Additional Information',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'key_value',
    dataField: 'additionalInfo',
  },
  custom: {
    type: 'custom',
    defaultTitle: 'Custom Section',
    defaultVisible: false,
    isRequired: false,
    canHide: true,
    canRename: true,
    canReorder: true,
    rendererKind: 'custom',
    dataField: 'custom',
  },
};

/**
 * Legacy and camelCase aliases mapped to canonical ResumeSectionType.
 */
export const SECTION_ALIASES: Record<string, ResumeSectionType> = {
  keyAchievements: 'achievements',
  additionalInfo: 'additional_information',
  personal: 'contact',
  referee: 'references',
  expertSkills: 'expert_skills',
  expert_level_skills: 'expert_skills',
  expertLevelSkills: 'expert_skills',
  technicalSkills: 'technical_skills',
  coreCompetencies: 'core_competencies',
  toolsAndTechnologies: 'tools_and_technologies',
  conferencesSpeaking: 'conferences_speaking',
  academicAchievements: 'academic_achievements',
  caseStudies: 'case_studies',
  selectedWork: 'selected_work',
  securityClearance: 'security_clearance',
  clinicalExperience: 'clinical_experience',
};

/**
 * Normalize an arbitrary section type/id string to its canonical ResumeSectionType.
 * Returns null if the value does not correspond to any known section type or alias.
 * Never throws.
 */
export function normalizeSectionType(type: string): ResumeSectionType | null {
  if (!type || typeof type !== 'string') return null;
  const trimmed = type.trim();
  if (trimmed in SECTION_REGISTRY) {
    return trimmed as ResumeSectionType;
  }
  if (trimmed in SECTION_ALIASES) {
    return SECTION_ALIASES[trimmed];
  }
  return null;
}

/**
 * Retrieves the static SectionDefinition for a section type or alias.
 * Returns null for unknown types.
 */
export function getSectionDefinition(type: string): SectionDefinition | null {
  const normalized = normalizeSectionType(type);
  if (!normalized) return null;
  return SECTION_REGISTRY[normalized] || null;
}

/**
 * Creates the default section order for a newly created resume, containing the
 * standard core sections in canonical order.
 */
export function createDefaultSectionOrder(): string[] {
  return [
    'summary',
    'achievements',
    'skills',
    'experience',
    'education',
    'projects',
    'certifications',
  ];
}

/**
 * Explicitly maps a section type to its canonical data field in ResumeData.
 * Never throws and never uses unchecked indexers.
 */
export function getSectionContent(data: ResumeData, type: ResumeSectionType, customId?: string): unknown {
  if (!data) return null;

  switch (type) {
    case 'contact':
      return {
        fullName: data.fullName,
        jobTitle: data.jobTitle,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin,
        github: data.github,
        portfolio: data.portfolio,
        location: data.location,
        address: data.address,
        atHandle: data.atHandle,
      };
    case 'summary':
      return data.summary;
    case 'experience':
      return data.experience;
    case 'education':
      return data.education;
    case 'skills':
      return data.skills;
    case 'expert_skills':
      return data.expertSkills;
    case 'technical_skills':
      return data.technicalSkills;
    case 'core_competencies':
      return data.coreCompetencies;
    case 'tools_and_technologies':
      return data.toolsAndTechnologies;
    case 'projects':
      return data.projects;
    case 'certifications':
      return data.certifications;
    case 'licenses':
      return data.licenses;
    case 'achievements':
      return data.keyAchievements;
    case 'awards':
      return data.awards;
    case 'languages':
      return data.languages;
    case 'leadership':
      return data.leadership;
    case 'volunteering':
      return data.volunteering;
    case 'involvement':
      return data.involvement;
    case 'memberships':
      return data.memberships;
    case 'publications':
      return data.publications;
    case 'conferences_speaking':
      return data.conferencesSpeaking;
    case 'research':
      return data.research;
    case 'teaching':
      return data.teaching;
    case 'coursework':
      return data.coursework;
    case 'thesis':
      return data.thesis;
    case 'academic_achievements':
      return data.academicAchievements;
    case 'portfolio':
      return data.portfolio;
    case 'case_studies':
      return data.caseStudies;
    case 'selected_work':
      return data.selectedWork;
    case 'patents':
      return data.patents;
    case 'grants':
      return data.grants;
    case 'security_clearance':
      return data.securityClearance;
    case 'military':
      return data.military;
    case 'clinical_experience':
      return data.clinicalExperience;
    case 'interests':
      return data.interests;
    case 'references':
      return data.referee;
    case 'additional_information':
      return data.additionalInfo;
    case 'custom':
      if (customId && data.customSections && data.customSections[customId]) {
        return data.customSections[customId];
      }
      return data.customSections;
    default:
      return null;
  }
}

/**
 * Type-aware content validator. Evaluates whether a section contains non-empty,
 * meaningful user content. Never uses Object.keys() as a generic empty check.
 */
export function hasSectionContent(data: ResumeData, type: ResumeSectionType, customId?: string): boolean {
  if (!data) return false;

  switch (type) {
    case 'contact': {
      return Boolean(
        data.fullName?.trim() ||
        data.email?.trim() ||
        data.phone?.trim() ||
        data.location?.trim() ||
        data.address?.trim() ||
        data.linkedin?.trim() ||
        data.github?.trim() ||
        (typeof data.portfolio === 'string' && data.portfolio.trim())
      );
    }
    case 'summary':
    case 'thesis':
    case 'security_clearance':
    case 'interests':
    case 'references': {
      const val = getSectionContent(data, type) as string | undefined;
      return typeof val === 'string' && val.trim().length > 0;
    }
    case 'coursework': {
      const val = getSectionContent(data, type) as CourseworkItem[] | string | undefined;
      if (Array.isArray(val)) {
        return val.some(
          (c) =>
            Boolean(c?.courseName?.trim()) ||
            Boolean(c?.institution?.trim()) ||
            Boolean(c?.skills?.trim()) ||
            (Array.isArray(c?.description) ? c.description.some((d) => Boolean(d?.trim())) : Boolean(c?.description?.trim()))
        );
      }
      return typeof val === 'string' && val.trim().length > 0;
    }
    case 'skills':
    case 'technical_skills':
    case 'core_competencies':
    case 'tools_and_technologies': {
      const val = getSectionContent(data, type) as string | undefined;
      return typeof val === 'string' && val.trim().length > 0;
    }
    case 'expert_skills': {
      return false;
    }
    case 'experience':
    case 'leadership':
    case 'involvement':
    case 'volunteering':
    case 'research':
    case 'teaching':
    case 'military':
    case 'clinical_experience': {
      const val = getSectionContent(data, type) as Experience[] | undefined;
      return Array.isArray(val) && val.length > 0;
    }
    case 'education': {
      const val = data.education;
      return Array.isArray(val) && val.length > 0;
    }
    case 'projects':
    case 'portfolio':
    case 'case_studies':
    case 'selected_work': {
      const val = getSectionContent(data, type) as Project[] | undefined;
      return Array.isArray(val) && val.length > 0;
    }
    case 'certifications':
    case 'licenses':
    case 'memberships':
    case 'patents':
    case 'grants': {
      const val = getSectionContent(data, type) as Certification[] | undefined;
      return Array.isArray(val) && val.length > 0;
    }
    case 'achievements':
    case 'awards':
    case 'publications':
    case 'conferences_speaking':
    case 'academic_achievements': {
      const val = getSectionContent(data, type) as string | string[] | undefined;
      if (Array.isArray(val)) {
        return val.some((b) => typeof b === 'string' && b.trim().length > 0);
      }
      return typeof val === 'string' && val.trim().length > 0;
    }
    case 'languages': {
      const val = data.languages;
      return Array.isArray(val) && val.length > 0;
    }
    case 'additional_information': {
      const val = data.additionalInfo;
      return (
        Array.isArray(val) &&
        val.some((item) => typeof item?.label === 'string' && item.label.trim().length > 0 && typeof item?.value === 'string' && item.value.trim().length > 0)
      );
    }
    case 'custom': {
      if (customId && data.customSections && data.customSections[customId]) {
        const cs = data.customSections[customId];
        if (cs.contentType === 'text') {
          return typeof cs.content === 'string' && cs.content.trim().length > 0;
        }
        if (cs.contentType === 'bullets') {
          return Array.isArray(cs.content) && cs.content.some((b) => typeof b === 'string' && b.trim().length > 0);
        }
        if (cs.contentType === 'key_value') {
          return (
            Array.isArray(cs.content) &&
            (cs.content as AdditionalInfoItem[]).some(
              (i) => typeof i?.label === 'string' && i.label.trim().length > 0 && typeof i?.value === 'string' && i.value.trim().length > 0
            )
          );
        }
      }
      return false;
    }
    default:
      return false;
  }
}

/**
 * Determines whether a section is visible on a resume document.
 * 1. Explicit sectionVisibility[id] wins.
 * 2. Legacy resumes without sectionVisibility preserve sectionOrder presence as visible.
 * 3. Otherwise falls back to Registry default visibility.
 */
export function isSectionVisible(data: ResumeData, id: string): boolean {
  if (!data || !id) return false;

  const isCustom = id.startsWith('custom_') || id === 'custom';
  const type = isCustom ? 'custom' : normalizeSectionType(id);
  if (!type || type === 'expert_skills') return false;

  const def = SECTION_REGISTRY[type];

  // 1. Explicit sectionVisibility flag takes absolute precedence. The eye
  // toggle is a user decision and always wins over the template default.
  if (data.sectionVisibility && id in data.sectionVisibility) {
    return Boolean(data.sectionVisibility[id]);
  }
  if (data.sectionVisibility && type in data.sectionVisibility) {
    return Boolean(data.sectionVisibility[type]);
  }

  // 2. sectionOrder is the document's composition. A section in the order is
  // rendered unless the user explicitly hid it above. This is what lets any
  // template render any section once it has been added, and what keeps a
  // template's default sections visible even when the template's legacy
  // hidden list still mentions them.
  if (Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0) {
    if (data.sectionOrder.some((s) => s === id || normalizeSectionType(s) === type)) {
      return true;
    }
  }

  // 3. Legacy/no-order documents: a template's hidden list still describes
  // which sections are outside its default composition.
  if (isSectionHiddenByTemplateDefault(data.template, id, data.sectionVisibility)) {
    return false;
  }

  // 4. If section contains non-empty user content and hasn't been explicitly hidden, treat as visible
  if (hasSectionContent(data, type, isCustom ? id : undefined)) {
    return true;
  }

  return def ? def.defaultVisible : false;
}

/**
 * Sections hidden by default for specific templates — the template's source
 * document doesn't include them, but users can still add them explicitly
 * (Add Section and visibility toggles write sectionVisibility[id] = true).
 */
export const TEMPLATE_HIDDEN_SECTION_TYPES: Record<string, string[]> = {
  jake: ['summary', 'achievements', 'certifications', 'additional_information', 'references', 'leadership'],
  // The Scholar source resume shows Education / Skills / Projects / Experience /
  // Certifications only — no summary or leadership-style sections.
  scholar: ['summary', 'achievements', 'additional_information', 'references', 'leadership'],
  // The Gaurav source resume shows Summary / Core Skills / Experience /
  // Education / Certification only — its project entries live nested under
  // experience, so the top-level Projects section stays hidden by default too.
  gaurav: ['achievements', 'leadership', 'projects', 'additional_information', 'references'],
  sage: ['leadership', 'projects', 'additional_information', 'references'],
  times: ['leadership', 'projects', 'additional_information', 'references'],
  regent: ['leadership', 'projects', 'additional_information', 'references'],
  professional: ['leadership', 'projects', 'additional_information', 'references'],
  styled: ['leadership', 'projects', 'additional_information', 'references'],
  modern: ['projects', 'leadership', 'additional_information', 'references', 'certifications', 'achievements'],
  rezi: [
    'summary',
    'projects',
    'certifications',
    'achievements',
    'additional_information',
    'references',
    'coursework',
    'languages',
    'volunteering',
    'awards',
    'publications',
  ],
  student: ['summary', 'achievements', 'references', 'additional_information'],
  free: ['summary', 'achievements', 'references', 'additional_information'],
  freshgrad1: ['summary', 'achievements', 'references', 'additional_information'],
  freshgrad2: ['summary', 'achievements', 'references', 'additional_information'],
  freshgrad3: ['summary', 'achievements', 'references', 'additional_information'],
  freshgrad4: ['summary', 'achievements', 'references', 'additional_information'],
  freshgrad5: ['summary', 'achievements', 'references', 'additional_information'],
  freshgrad6: ['summary', 'achievements', 'references', 'additional_information'],
  freshgrad7: ['summary', 'achievements', 'references', 'additional_information'],
  freshgrad8: ['achievements', 'references', 'leadership', 'additional_information'],
};

/**
 * Whether `sectionKey` is hidden by default on `templateId` and has not been
 * explicitly opted in via sectionVisibility (checks both the raw key and its
 * canonical type, mirroring isSectionVisible's precedence rules).
 *
 * Additional Information and References are hidden by default across all templates
 * unless the user explicitly adds them via the editor (sectionVisibility[id] = true).
 */
export function isSectionHiddenByTemplateDefault(
  templateId: string | undefined,
  sectionKey: string,
  sectionVisibility?: Record<string, boolean>
): boolean {
  if (!sectionKey) return false;
  const type = normalizeSectionType(sectionKey) || sectionKey;
  if (sectionVisibility && sectionVisibility[sectionKey] === true) return false;
  if (sectionVisibility && sectionVisibility[type] === true) return false;
  if (sectionVisibility && sectionVisibility[sectionKey] === false) return true;
  if (sectionVisibility && sectionVisibility[type] === false) return true;

  // Additional Information and References are removed by default across all templates
  // unless explicitly added by the user via the editor (sectionVisibility = true).
  if (type === 'additional_information' || type === 'references') {
    return true;
  }

  if (!templateId) return false;
  const hidden = TEMPLATE_HIDDEN_SECTION_TYPES[templateId];
  if (!hidden) return false;
  return hidden.includes(type);
}

/**
 * True when the user explicitly added this section — via the sidebar's
 * "Add Section", the canvas + dock, or the hidden-content notice banner after
 * an upload. Every add path sets `sectionVisibility[id] === true` and records
 * the canonical type in `userAddedSections`.
 *
 * Template-level "this section isn't part of this design" blocks must yield to
 * an explicit add: content is never silently dropped from the preview after
 * the user asked for it. Default rendering is unaffected (no flag, not
 * user-added → the block applies exactly as before).
 */
export function isSectionExplicitlyAdded(
  data: Pick<ResumeData, 'sectionVisibility' | 'userAddedSections'> | null | undefined,
  sectionKey: string
): boolean {
  if (!data || !sectionKey) return false;
  const type = normalizeSectionType(sectionKey) || sectionKey;
  const visibility = data.sectionVisibility;
  if (visibility) {
    if (visibility[sectionKey] === true) return true;
    if (visibility[type] === true) return true;
  }
  const userAdded = data.userAddedSections;
  if (Array.isArray(userAdded)) {
    return userAdded.some(
      (s) => s === sectionKey || s === type || normalizeSectionType(s) === type
    );
  }
  return false;
}

/**
 * Resolves the complete, ordered list of section IDs to render for a given document.
 * Preserves the exact user-specified sequence in `sectionOrder`.
 *
 * When the document has an explicit order (every saved/created resume after
 * sanitizeResumeData), standard sections render strictly from that order —
 * content alone never creates a section, so each resume shows exactly its
 * template's default sections plus whatever the user added. Without an explicit
 * order (raw/partial payloads), populated sections are still discovered so no
 * content is dropped. Custom sections are always kept: they exist only because
 * the user created them.
 */
export function getResolvedSectionOrder(data: ResumeData): string[] {
  if (!data) return createDefaultSectionOrder();

  const hasExplicitOrder = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0;
  const baseOrder = hasExplicitOrder ? data.sectionOrder! : createDefaultSectionOrder();

  const normalizedBase = Array.from(new Set(baseOrder.map((s) => normalizeSectionType(s) || s)))
    .filter((s) => s !== 'expert_skills' && s !== 'expertSkills');

  const extraPopulated: string[] = [];

  // Include populated custom sections (always — user-created by definition).
  if (data.customSections) {
    for (const customId of Object.keys(data.customSections)) {
      if (!normalizedBase.includes(customId) && isSectionVisible(data, customId) && hasSectionContent(data, 'custom', customId)) {
        extraPopulated.push(customId);
      }
    }
  }

  // Standard sections: discovered for documents without an explicit order,
  // or when explicitly enabled by the user via sectionVisibility[t] = true.
  const allRegisteredTypes = Object.keys(SECTION_REGISTRY) as ResumeSectionType[];
  for (const t of allRegisteredTypes) {
    if (t === 'contact' || t === 'custom') continue;
    if (normalizedBase.includes(t)) continue;
    if (extraPopulated.includes(t)) continue;
    const explicitlyEnabled = Boolean(
      data.sectionVisibility && (
        data.sectionVisibility[t] === true ||
        (SECTION_REGISTRY[t]?.dataField && data.sectionVisibility[SECTION_REGISTRY[t].dataField] === true)
      )
    );
    if ((!hasExplicitOrder || explicitlyEnabled) && isSectionVisible(data, t) && hasSectionContent(data, t)) {
      extraPopulated.push(t);
    }
  }

  return [...normalizedBase, ...extraPopulated];
}

/**
 * Apply the per-section eye toggle to a resume document.
 *
 * Hiding writes an explicit `false` (the user's decision always wins). Showing
 * writes `true` and, if the section is not in the current composition yet,
 * appends it so the preview updates immediately. The canonical type is
 * recorded too so aliases and template switches stay consistent.
 *
 * For documents without an explicit `sectionOrder`, the order we persist is the
 * composition that is actually visible now, not the raw registry default. This
 * preserves legacy template defaults: hiding one section must not surface a
 * different section the template intentionally leaves out (for example the
 * Student template's Professional Summary).
 */
export function applySectionVisibilityToggle(data: ResumeData, sectionId: string): ResumeData {
  if (!data || !sectionId || sectionId === 'personal' || sectionId === 'contact') return data;

  const canonical = normalizeSectionType(sectionId) || sectionId;
  const renderedNow =
    getResolvedSectionOrder(data).some(
      (id) => id === sectionId || normalizeSectionType(id) === canonical
    ) && isSectionVisible(data, sectionId);
  const nextVisible = !renderedNow;

  const currentOrder =
    Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0
      ? data.sectionOrder
      : getResolvedSectionOrder(data).filter((id) => isSectionVisible(data, id));

  const nextVisibility: Record<string, boolean> = {
    ...(data.sectionVisibility || {}),
    [sectionId]: nextVisible,
  };
  if (canonical !== sectionId) nextVisibility[canonical] = nextVisible;

  let nextOrder = currentOrder;
  let nextUserAdded = data.userAddedSections || [];
  if (nextVisible) {
    const inOrder = currentOrder.some(
      (id) => id === sectionId || normalizeSectionType(id) === canonical
    );
    if (!inOrder) nextOrder = [...currentOrder, sectionId];
    nextUserAdded = Array.from(new Set([...nextUserAdded, sectionId, canonical]));
  }

  return {
    ...data,
    sectionOrder: nextOrder,
    sectionVisibility: nextVisibility,
    userAddedSections: nextUserAdded,
  };
}

/**
 * The sections this document will actually render, in display order.
 *
 * Template-aware: a section the selected design does not include by default
 * (for example Professional Summary on the Student template) is reported as
 * absent unless the user explicitly added it via `sectionVisibility`.
 *
 * AI tailoring uses this so it edits the sections that are on the resume
 * instead of inventing sections the chosen design does not have.
 */
export function getVisibleSectionIds(data: ResumeData): string[] {
  if (!data) return [];

  // Exactly the sections the preview renders: resolved order, visible, and
  // non-empty. Templates already skip empty sections, so the agent's scope must
  // skip them too. This is also why a user-added section is picked up
  // automatically on the next run.
  return getResolvedSectionOrder(data).filter((id) => {
    if (!id.startsWith('custom_') && normalizeSectionType(id) === 'contact') return false;
    if (!isSectionVisible(data, id)) return false;
    if (id.startsWith('custom_')) return hasSectionContent(data, 'custom', id);
    const type = normalizeSectionType(id);
    return type ? hasSectionContent(data, type) : false;
  });
}

/**
 * Human-readable titles for the sections the document renders, matching the
 * order of `getVisibleSectionIds`. Custom sections use their own title.
 */
export function getVisibleSectionTitles(data: ResumeData): string[] {
  if (!data) return [];
  // Honor sectionTitles overrides so the agent sees the same heading the
  // preview shows (for example a renamed "Work Experience").
  return getVisibleSectionIds(data).map((id) => getSectionTitle(data, id));
}

/**
 * Resolves the display title for a section.
 * 1. Explicit sectionTitles[id] override wins.
 * 2. Custom section customSections[id].title wins for custom sections.
 * 3. Default title from SECTION_REGISTRY fallback.
 */
export function getSectionTitle(data: ResumeData, id: string): string {
  if (!data || !id) return '';

  const isCustom = id.startsWith('custom_') || id === 'custom';
  const type = isCustom ? 'custom' : normalizeSectionType(id);
  if (!type) return id;

  const def = SECTION_REGISTRY[type];

  if (data.sectionTitles && id in data.sectionTitles && data.sectionTitles[id]?.trim()) {
    return data.sectionTitles[id].trim();
  }
  if (data.sectionTitles && type in data.sectionTitles && data.sectionTitles[type]?.trim()) {
    return data.sectionTitles[type].trim();
  }
  if (isCustom && data.customSections && data.customSections[id]?.title?.trim()) {
    return data.customSections[id].title.trim();
  }

  return def ? def.defaultTitle : id;
}

/**
 * Resolved representation of a section for a specific resume document.
 */
export interface ResolvedSection {
  id: string;
  type: ResumeSectionType;
  title: string;
  visible: boolean;
  present: boolean;
  hasContent: boolean;
  supported: boolean;
  rendererKind: SectionRendererKind;
  content: unknown;
}

/**
 * Pure resolver that evaluates section state for a given document.
 * Never mutates ResumeData.
 */
export function resolveSection(data: ResumeData, id: string): ResolvedSection | null {
  if (!data || !id) return null;

  const isCustom = id.startsWith('custom_') || id === 'custom';
  const type = isCustom ? 'custom' : normalizeSectionType(id);

  if (!type || type === 'expert_skills') return null;

  const def = SECTION_REGISTRY[type];
  if (!def) return null;

  // 1. Determine presence (exists in sectionOrder or contact is always present)
  const isPresent =
    type === 'contact' ||
    (Array.isArray(data.sectionOrder) && data.sectionOrder.some((s) => s === id || normalizeSectionType(s) === type));

  // 2. Determine visibility
  const isVisible = isSectionVisible(data, id);

  // 3. Resolve title
  const title = getSectionTitle(data, id);

  // 4. Resolve canonical content & content presence
  const content = getSectionContent(data, type, isCustom ? id : undefined);
  const contentPresent = hasSectionContent(data, type, isCustom ? id : undefined);

  return {
    id,
    type,
    title,
    visible: isVisible,
    present: isPresent,
    hasContent: contentPresent,
    supported: true,
    rendererKind: def.rendererKind,
    content,
  };
}
