import type { AdditionalInfoItem } from '../types';

export type ResumeSectionType =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'expert_skills'
  | 'technical_skills'
  | 'core_competencies'
  | 'tools_and_technologies'
  | 'projects'
  | 'certifications'
  | 'licenses'
  | 'achievements'
  | 'awards'
  | 'languages'
  | 'leadership'
  | 'volunteering'
  | 'memberships'
  | 'publications'
  | 'conferences_speaking'
  | 'research'
  | 'teaching'
  | 'coursework'
  | 'thesis'
  | 'academic_achievements'
  | 'portfolio'
  | 'case_studies'
  | 'selected_work'
  | 'patents'
  | 'grants'
  | 'security_clearance'
  | 'military'
  | 'clinical_experience'
  | 'interests'
  | 'references'
  | 'additional_information'
  | 'custom';

export type SectionRendererKind =
  | 'contact'
  | 'text'
  | 'experience'
  | 'education'
  | 'skills'
  | 'expert_skills'
  | 'projects'
  | 'certifications'
  | 'bullets'
  | 'languages'
  | 'key_value'
  | 'coursework'
  | 'custom';

export type CustomSectionContentType =
  | 'bullets'
  | 'text'
  | 'key_value';

export interface CustomSectionData {
  id: string;
  title: string;
  contentType: CustomSectionContentType;
  content: string | string[] | AdditionalInfoItem[];
}

export interface ResumeSectionConfig {
  sectionOrder: string[];
  sectionVisibility?: Record<string, boolean>;
  sectionTitles?: Record<string, string>;
  customSections?: Record<string, CustomSectionData>;
}

export interface SectionDefinition {
  readonly type: ResumeSectionType;
  readonly defaultTitle: string;
  readonly defaultVisible: boolean;
  readonly isRequired: boolean;
  readonly canHide: boolean;
  readonly canRename: boolean;
  readonly canReorder: boolean;
  readonly rendererKind: SectionRendererKind;
  readonly dataField: string | 'custom';
}
