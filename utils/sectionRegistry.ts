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
    'additional_information',
    'references',
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
        data.linkedin?.trim()
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
      const val = getSectionContent(data, type) as ExpertSkillItem[] | string | undefined;
      if (Array.isArray(val)) {
        return val.some((item) => Boolean(item?.category?.trim() || item?.skills?.trim()));
      }
      return typeof val === 'string' && val.trim().length > 0;
    }
    case 'experience':
    case 'leadership':
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
  if (!type) return false;

  const def = SECTION_REGISTRY[type];

  // 1. Explicit sectionVisibility flag takes absolute precedence
  if (data.sectionVisibility && id in data.sectionVisibility) {
    return Boolean(data.sectionVisibility[id]);
  }
  if (data.sectionVisibility && type in data.sectionVisibility) {
    return Boolean(data.sectionVisibility[type]);
  }

  // 2. If present in sectionOrder, it is visible
  if (Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0) {
    if (data.sectionOrder.some((s) => s === id || normalizeSectionType(s) === type)) {
      return true;
    }
  }

  // 3. If section contains non-empty user content and hasn't been explicitly hidden, treat as visible
  if (hasSectionContent(data, type, isCustom ? id : undefined)) {
    return true;
  }

  return def ? def.defaultVisible : false;
}

/**
 * Resolves the complete, ordered list of section IDs to render for a given document.
 * Preserves the exact user-specified sequence in `sectionOrder`, and dynamically
 * includes any populated sections that have not been explicitly hidden.
 */
export function getResolvedSectionOrder(data: ResumeData): string[] {
  if (!data) return createDefaultSectionOrder();

  const baseOrder = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0
    ? data.sectionOrder
    : createDefaultSectionOrder();

  const normalizedBase = Array.from(new Set(baseOrder.map((s) => normalizeSectionType(s) || s)));

  // Discover any non-core or optional sections in data that contain content
  const allRegisteredTypes = Object.keys(SECTION_REGISTRY) as ResumeSectionType[];
  const extraPopulated: string[] = [];

  for (const t of allRegisteredTypes) {
    if (t === 'contact' || t === 'custom') continue;
    if (normalizedBase.includes(t)) continue;
    if (isSectionVisible(data, t) && hasSectionContent(data, t)) {
      extraPopulated.push(t);
    }
  }

  // Include populated custom sections
  if (data.customSections) {
    for (const customId of Object.keys(data.customSections)) {
      if (!normalizedBase.includes(customId) && isSectionVisible(data, customId) && hasSectionContent(data, 'custom', customId)) {
        extraPopulated.push(customId);
      }
    }
  }

  return [...normalizedBase, ...extraPopulated];
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

  if (!type) return null;

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
