import { ResumeData, INITIAL_DATA } from '../types';
import { createDefaultSectionOrder, normalizeSectionType, hasSectionContent } from './sectionRegistry';
import { getTemplateDefaultSectionOrder } from './templateSectionDefaults';

/**
 * Migrates resumes that stored their INVOLVEMENT content under `leadership`
 * (the Free/CareerCraft template used to display the leadership field as the
 * INVOLVEMENT section) so they use the first-class `involvement` section
 * instead: content, section order, titles, and visibility all move over.
 *
 * Pure and idempotent — returns the input object unchanged when the migration
 * does not apply (non-free resumes, or involvement already populated).
 */
export function migrateLeadershipToInvolvement(data: ResumeData): ResumeData {
  if (!data || typeof data !== 'object') return data;

  const leadership = Array.isArray(data.leadership) ? data.leadership : [];
  const involvement = Array.isArray(data.involvement) ? data.involvement : [];
  if (leadership.length === 0 || involvement.length > 0) return data;

  const leadershipTitle = data.sectionTitles?.leadership ?? '';
  const usedAsInvolvement = data.template === 'free' || /involvement/i.test(leadershipTitle);
  if (!usedAsInvolvement) return data;

  // Section order: replace 'leadership' with 'involvement' (never duplicate it).
  let sectionOrder = data.sectionOrder;
  if (Array.isArray(sectionOrder)) {
    const alreadyListed = sectionOrder.includes('involvement');
    sectionOrder = sectionOrder.flatMap((id) =>
      id === 'leadership' ? (alreadyListed ? [] : ['involvement']) : [id]
    );
  }

  // Titles: drop the leadership title and carry it over to involvement.
  let sectionTitles = data.sectionTitles;
  if (sectionTitles && 'leadership' in sectionTitles) {
    const { leadership: lt, ...restTitles } = sectionTitles;
    sectionTitles = sectionTitles.involvement !== undefined
      ? restTitles
      : lt
      ? { ...restTitles, involvement: lt }
      : restTitles;
  }

  // Visibility: same carry-over treatment.
  let sectionVisibility = data.sectionVisibility;
  if (sectionVisibility && 'leadership' in sectionVisibility) {
    const { leadership: lv, ...restVisibility } = sectionVisibility;
    sectionVisibility = sectionVisibility.involvement !== undefined
      ? restVisibility
      : { ...restVisibility, involvement: lv };
  }

  return {
    ...data,
    involvement: [...leadership],
    leadership: [],
    sectionOrder,
    sectionTitles,
    sectionVisibility,
  };
}

/**
 * Sanitizes and normalizes any ResumeData object (e.g. from Supabase JSONB,
 * localStorage, or file upload) so all fields have guaranteed safe types.
 * Prevents runtime crashes from null arrays, non-string skills, or missing fields.
 */
export function sanitizeResumeData(data: Partial<ResumeData> | null | undefined): ResumeData {
  if (!data || typeof data !== 'object') {
    return { ...INITIAL_DATA };
  }

  const clean: ResumeData = { ...INITIAL_DATA, ...data };

  // Ensure array fields are ALWAYS valid arrays
  clean.experience = Array.isArray(data.experience) ? data.experience : [];
  clean.education = Array.isArray(data.education) ? data.education : [];
  clean.certifications = Array.isArray(data.certifications) ? data.certifications : [];
  clean.projects = Array.isArray(data.projects) ? data.projects : [];
  clean.leadership = Array.isArray(data.leadership) ? data.leadership : [];
  clean.additionalInfo = Array.isArray(data.additionalInfo) ? data.additionalInfo : [];
  clean.languages = Array.isArray(data.languages) ? data.languages : [];

  // Ensure string fields are ALWAYS strings
  clean.fullName = typeof data.fullName === 'string' ? data.fullName : (data.fullName || '');
  clean.jobTitle = typeof data.jobTitle === 'string' ? data.jobTitle : (data.jobTitle || '');
  clean.email = typeof data.email === 'string' ? data.email : (data.email || '');
  clean.phone = typeof data.phone === 'string' ? data.phone : (data.phone || '');
  clean.location = typeof data.location === 'string' ? data.location : (data.location || '');
  clean.address = typeof data.address === 'string' ? data.address : (data.address || '');
  clean.linkedin = typeof data.linkedin === 'string' ? data.linkedin : (data.linkedin || '');
  clean.github = typeof data.github === 'string' ? data.github : (data.github || '');
  clean.portfolio = typeof data.portfolio === 'string' ? data.portfolio : (data.portfolio || '');
  clean.summary = typeof data.summary === 'string' ? data.summary : (data.summary || '');
  clean.skills = typeof data.skills === 'string'
    ? data.skills
    : Array.isArray(data.skills)
    ? (data.skills as string[]).join(', ')
    : (data.skills || '');

  // Ensure customSections, sectionVisibility, sectionTitles are valid objects
  clean.customSections = (data.customSections && typeof data.customSections === 'object' && !Array.isArray(data.customSections))
    ? data.customSections
    : {};
  clean.sectionVisibility = (data.sectionVisibility && typeof data.sectionVisibility === 'object' && !Array.isArray(data.sectionVisibility))
    ? data.sectionVisibility
    : {};
  clean.sectionTitles = (data.sectionTitles && typeof data.sectionTitles === 'object' && !Array.isArray(data.sectionTitles))
    ? data.sectionTitles
    : {};
  clean.userAddedSections = Array.isArray(data.userAddedSections)
    ? Array.from(new Set(data.userAddedSections.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)))
    : [];

  // Existing content migrations first (leadership -> involvement), so the
  // order fill-in below sees the final content locations. `hadOrder` guards
  // against clobbering the migration's own order rewrite.
  const hadOrder = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0;
  const migrated = migrateLeadershipToInvolvement(clean);

  // Missing order (old saves, corrupted payloads): fall back to THIS template's
  // gallery-promise defaults rather than the generic registry order, so a loaded
  // resume matches the template's previewed section structure.
  let order: string[] = Array.isArray(migrated.sectionOrder) ? migrated.sectionOrder : [];
  if (!hadOrder) {
    order = data.template
      ? getTemplateDefaultSectionOrder(data.template)
      : createDefaultSectionOrder();
  }

  // Load-time fill-in (event-time, not render-time): template-default sections
  // that hold saved content but predate the template's default order (legacy
  // generic orders) are appended so the template's previewed sections keep
  // rendering. Content outside the template's defaults stays out of the order —
  // stored, never lost, and surfaced by findSectionsHiddenByDefaults.
  const orderNorm = new Set(order.map((s) => normalizeSectionType(s) || s));
  for (const id of getTemplateDefaultSectionOrder(migrated.template)) {
    const canonical = normalizeSectionType(id);
    if (!canonical || orderNorm.has(canonical)) continue;
    if (!hasSectionContent(migrated, canonical)) continue;
    order = [...order, id];
    orderNorm.add(canonical);
  }
  migrated.sectionOrder = order;

  return migrated;
}
