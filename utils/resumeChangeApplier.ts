import type { ResumeData } from '../types';
import type { ResumeChange } from '../types/resumeAgent';
import { SECTION_REGISTRY, normalizeSectionType } from './sectionRegistry';
import { parseAchievementBullets, parseDescriptionBullets, stripMarkdown } from './templateUtils';

/**
 * Applies a single AI `ResumeChange` to a resume.
 *
 * The old accept handler only understood summary / skills / keyAchievements /
 * experience. This applier is renderer-kind aware, so the agent can tailor any
 * section that is actually on the preview: scalar sections, root bullet lists,
 * experience-like arrays, education / certification / project / language /
 * key-value items, and user-created custom sections.
 *
 * It is deliberately conservative: if a change cannot be mapped to real
 * content, the resume is returned unchanged rather than creating a section or
 * inventing an item.
 */

const ROOT_BULLET_FIELDS: Record<string, keyof ResumeData> = {
  achievements: 'keyAchievements',
  awards: 'awards',
  publications: 'publications',
  conferences_speaking: 'conferencesSpeaking',
  academic_achievements: 'academicAchievements',
};

const SCALAR_FIELDS: Record<string, keyof ResumeData> = {
  summary: 'summary',
  skills: 'skills',
  technical_skills: 'technicalSkills',
  core_competencies: 'coreCompetencies',
  tools_and_technologies: 'toolsAndTechnologies',
  thesis: 'thesis',
  security_clearance: 'securityClearance',
  interests: 'interests',
  references: 'referee',
};

/** Default field to rewrite when the model did not name one. */
const PRIMARY_FIELDS: Record<string, string> = {
  experience: 'roleSummary',
  leadership: 'roleSummary',
  involvement: 'roleSummary',
  volunteering: 'roleSummary',
  research: 'roleSummary',
  teaching: 'roleSummary',
  military: 'roleSummary',
  clinical_experience: 'roleSummary',
  education: 'degree',
  certifications: 'name',
  licenses: 'name',
  memberships: 'name',
  patents: 'name',
  grants: 'name',
  projects: 'description',
  portfolio: 'description',
  case_studies: 'description',
  selected_work: 'description',
  languages: 'language',
  additional_information: 'value',
  coursework: 'courseName',
};

const PRIMARY_MATCH_FIELDS: Record<string, string[]> = {
  experience: ['roleSummary', 'role', 'company'],
  leadership: ['roleSummary', 'role', 'company'],
  involvement: ['roleSummary', 'role', 'company'],
  volunteering: ['roleSummary', 'role', 'company'],
  research: ['roleSummary', 'role', 'company'],
  teaching: ['roleSummary', 'role', 'company'],
  military: ['roleSummary', 'role', 'company'],
  clinical_experience: ['roleSummary', 'role', 'company'],
  education: ['degree', 'school'],
  certifications: ['name', 'issuer'],
  licenses: ['name', 'issuer'],
  memberships: ['name', 'issuer'],
  patents: ['name', 'issuer'],
  grants: ['name', 'issuer'],
  projects: ['name', 'description'],
  portfolio: ['name', 'description'],
  case_studies: ['name', 'description'],
  selected_work: ['name', 'description'],
  languages: ['language', 'proficiency'],
  additional_information: ['label', 'value'],
  coursework: ['courseName', 'institution', 'skills'],
};

const CUSTOM_SECTION_PREFIX = 'custom_';

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : ''))
      .filter((item) => item.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim()) {
    return parseAchievementBullets(value);
  }
  return [];
}

function replaceInStringList(
  list: string[],
  proposed: string,
  change: ResumeChange
): string[] {
  if (
    typeof change.bulletIndex === 'number' &&
    change.bulletIndex >= 0 &&
    change.bulletIndex < list.length
  ) {
    const next = [...list];
    next[change.bulletIndex] = proposed;
    return next;
  }
  if (change.original) {
    const original = change.original.trim();
    const idx = list.findIndex((item) => item.trim() === original);
    if (idx >= 0) {
      const next = [...list];
      next[idx] = proposed;
      return next;
    }
  }
  return [...list, proposed];
}

function itemMatchesOriginal(item: any, section: string, original: string): boolean {
  if (!original) return false;
  const target = original.trim().toLowerCase();
  if (!target) return false;

  const fields = PRIMARY_MATCH_FIELDS[section] || ['name', 'title', 'description'];
  for (const field of fields) {
    const value = item?.[field];
    if (typeof value === 'string' && value.trim().toLowerCase() === target) return true;
  }

  const bullets = parseDescriptionBullets(item?.description);
  return bullets.some((bullet) => bullet.trim().toLowerCase() === target);
}

function findItemIndex(items: any[], section: string, change: ResumeChange): number {
  if (!Array.isArray(items) || items.length === 0) return -1;

  if (change.itemId) {
    const target = change.itemId.trim().toLowerCase();
    const idx = items.findIndex(
      (item) => String(item?.id ?? '').trim().toLowerCase() === target
    );
    if (idx >= 0) return idx;
  }

  if (change.original) {
    const idx = items.findIndex((item) =>
      itemMatchesOriginal(item, section, change.original)
    );
    if (idx >= 0) return idx;
  }

  // Languages / key-value lists are commonly addressed by position.
  if (
    typeof change.bulletIndex === 'number' &&
    change.bulletIndex >= 0 &&
    change.bulletIndex < items.length &&
    (section === 'languages' || section === 'additional_information')
  ) {
    return change.bulletIndex;
  }

  return -1;
}

function applyToObjectArray(
  items: any[],
  section: string,
  change: ResumeChange,
  proposed: string
): any[] {
  const idx = findItemIndex(items, section, change);
  if (idx < 0) return items;

  const current = items[idx] || {};
  const nextItem = { ...current };

  // An explicit field always wins (e.g. education.degree, languages.proficiency).
  if (change.field) {
    nextItem[change.field] = proposed;
    return items.map((item, i) => (i === idx ? nextItem : item));
  }

  const hasDescription =
    Array.isArray(current.description) || typeof current.description === 'string';

  // Bullet-targeted change inside an experience-like or project item.
  if (
    hasDescription &&
    (typeof change.bulletIndex === 'number' || Boolean(change.original))
  ) {
    const bullets = parseDescriptionBullets(current.description);
    nextItem.description = replaceInStringList(bullets, proposed, change);
    return items.map((item, i) => (i === idx ? nextItem : item));
  }

  // A whole-item rewrite. Use the section's primary field so experience keeps
  // its role summary instead of collapsing into a one-line description.
  const primary = PRIMARY_FIELDS[section] || 'name';
  nextItem[primary] = proposed;
  return items.map((item, i) => (i === idx ? nextItem : item));
}

function applyCustomSectionChange(
  data: ResumeData,
  customId: string,
  change: ResumeChange,
  proposed: string
): ResumeData {
  const custom = data.customSections?.[customId];
  if (!custom) return data;

  if (custom.contentType === 'text') {
    return {
      ...data,
      customSections: {
        ...(data.customSections || {}),
        [customId]: { ...custom, content: proposed },
      },
    };
  }

  if (custom.contentType === 'bullets') {
    const list = asStringList(custom.content);
    return {
      ...data,
      customSections: {
        ...(data.customSections || {}),
        [customId]: { ...custom, content: replaceInStringList(list, proposed, change) },
      },
    };
  }

  // key_value custom sections are an array of { id, label, value }.
  const items = Array.isArray(custom.content) ? [...custom.content] : [];
  const idx = findItemIndex(items as any[], 'additional_information', change);
  if (idx >= 0) {
    const item = { ...(items[idx] as any) };
    item[change.field === 'label' ? 'label' : 'value'] = proposed;
    items[idx] = item;
  } else {
    items.push({
      id: `custom_item_${Date.now()}`,
      label: change.original?.trim() || 'Detail',
      value: proposed,
    } as any);
  }

  return {
    ...data,
    customSections: {
      ...(data.customSections || {}),
      [customId]: { ...custom, content: items },
    },
  };
}

export function applyResumeChange(data: ResumeData, change: ResumeChange): ResumeData {
  const proposed = stripMarkdown(change.proposed || '').trim();
  if (!proposed) return data;

  const rawSection = String(change.section || '').trim();
  if (!rawSection) return data;

  if (rawSection.startsWith(CUSTOM_SECTION_PREFIX)) {
    return applyCustomSectionChange(data, rawSection, change, proposed);
  }

  const canonical = normalizeSectionType(rawSection) || rawSection;

  // Contact / header fields (the agent normally does not propose these, but the
  // applier is safe if it does).
  if (canonical === 'contact' && change.field) {
    const allowed = [
      'fullName',
      'jobTitle',
      'email',
      'phone',
      'location',
      'address',
      'linkedin',
      'github',
      'portfolio',
    ];
    if (allowed.includes(change.field)) {
      return { ...data, [change.field]: proposed } as ResumeData;
    }
    return data;
  }

  if (canonical === 'custom') {
    return applyCustomSectionChange(data, rawSection, change, proposed);
  }

  // Scalar text sections.
  const scalarField = SCALAR_FIELDS[canonical];
  if (scalarField) {
    return { ...data, [scalarField]: proposed } as ResumeData;
  }

  // Coursework can be a string or a CourseworkItem[].
  if (canonical === 'coursework') {
    const current = data.coursework;
    if (Array.isArray(current)) {
      return { ...data, coursework: applyToObjectArray(current, 'coursework', change, proposed) };
    }
    return { ...data, coursework: proposed };
  }

  // Root-level bullet lists (achievements, awards, publications, etc.).
  const rootBulletField = ROOT_BULLET_FIELDS[canonical];
  if (rootBulletField) {
    const current = (data as any)[rootBulletField];
    const list = asStringList(current);
    return { ...data, [rootBulletField]: replaceInStringList(list, proposed, change) } as ResumeData;
  }

  // Structured array sections: use the registry's backing field.
  const definition = SECTION_REGISTRY[canonical as keyof typeof SECTION_REGISTRY];
  if (definition && definition.dataField !== 'custom') {
    const field = definition.dataField as keyof ResumeData;
    const current = (data as any)[field];
    if (Array.isArray(current)) {
      return { ...data, [field]: applyToObjectArray(current, canonical, change, proposed) } as ResumeData;
    }
  }

  // Last resort: a field the model explicitly named and that exists as a string.
  if (change.field && typeof (data as any)[change.field] === 'string') {
    return { ...data, [change.field]: proposed } as ResumeData;
  }

  return data;
}

/** Human-readable label for a section id, used in change cards and summaries. */
export function resumeChangeSectionLabel(data: ResumeData, section: string): string {
  if (section.startsWith(CUSTOM_SECTION_PREFIX)) {
    return data.customSections?.[section]?.title || 'Custom Section';
  }
  const canonical = normalizeSectionType(section) || section;
  const def = SECTION_REGISTRY[canonical as keyof typeof SECTION_REGISTRY];
  return data.sectionTitles?.[section] || data.sectionTitles?.[canonical] || def?.defaultTitle || section;
}
