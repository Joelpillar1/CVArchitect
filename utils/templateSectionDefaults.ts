import type { ResumeData, TemplateType } from '../types';
import type { ResumeSectionType } from '../types/resumeSections';
import { getTemplatePreviewData } from './sampleResumeData';
import {
  SECTION_REGISTRY,
  normalizeSectionType,
  getSectionTitle,
  hasSectionContent,
  isSectionHiddenByTemplateDefault,
} from './sectionRegistry';

/**
 * Template default sections — the single source of truth.
 *
 * Every template's gallery preview is rendered from `getTemplatePreviewData()`,
 * so its `sectionOrder` / `sectionTitles` ARE the template's promised look.
 * Creation, template switches, and uploads snap to these defaults so what the
 * user previews in the gallery is exactly what their resume shows — while
 * sections the user explicitly added (tracked in `data.userAddedSections`) and
 * custom sections are kept after the defaults.
 *
 * Enforcement is event-time only (create / switch / upload / load fill-in),
 * never render-time, so user customization is never clobbered mid-session.
 */

/** Default section order for a template = exactly what its gallery preview renders. */
export function getTemplateDefaultSectionOrder(
  templateId?: TemplateType | string | null
): string[] {
  const preview = getTemplatePreviewData((templateId || 'free') as TemplateType);
  const order = Array.isArray(preview.sectionOrder) ? preview.sectionOrder : [];
  const cleaned = order.filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
  return Array.from(new Set(cleaned));
}

/**
 * Effective default title per default section id — the title the gallery
 * preview shows (explicit `sectionTitles` entry, else the registry default).
 */
export function getTemplateDefaultSectionTitles(
  templateId?: TemplateType | string | null
): Record<string, string> {
  const preview = getTemplatePreviewData((templateId || 'free') as TemplateType);
  const titles: Record<string, string> = {};
  for (const id of getTemplateDefaultSectionOrder(templateId)) {
    titles[id] = getSectionTitle(preview, id);
  }
  return titles;
}

function dedupeIds(ids: readonly (string | undefined | null)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (typeof id !== 'string') continue;
    const trimmed = id.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

/**
 * Snaps a resume onto `targetTemplateId`'s default sections:
 * - `sectionOrder` becomes [template defaults, then user-added sections in
 *   their previous relative order, then custom sections] — template-owned
 *   sections the new template doesn't include leave the order (content is
 *   never touched or deleted; Add Section can bring them back).
 * - `sectionTitles` for default sections snap to the preview's effective
 *   titles (so "Work Experience" on DevPro becomes "Experience" on a template
 *   whose gallery says "Experience"); user-added/custom sections keep their
 *   current titles.
 * - Explicit `sectionVisibility` flags persist (the eye toggle is a user
 *   decision); user-added sections blocked by the new template's hidden list
 *   get an explicit `true` so they stay visible as added.
 * - No-op when the target template is already the document's template with an
 *   explicit order (re-selecting the active template must not reset a manual
 *   reorder or rename).
 *
 * Pure — returns a new object; the input's content arrays are shared as-is.
 */
export function applyTemplateSectionDefaults(
  data: Partial<ResumeData> | null | undefined,
  targetTemplateId: TemplateType,
  options: { force?: boolean; preserveExtras?: boolean } = {}
): ResumeData {
  const source: Partial<ResumeData> = data || {};
  const defaults = getTemplateDefaultSectionOrder(targetTemplateId);
  const currentOrder = Array.isArray(source.sectionOrder)
    ? source.sectionOrder.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    : [];

  // Re-selecting the active template with an explicit order: nothing to do.
  // Import passes force:true so a same-template upload still appends its extra
  // content-bearing sections after the template defaults.
  if (!options.force && source.template === targetTemplateId && currentOrder.length > 0) {
    return { ...source, template: targetTemplateId } as ResumeData;
  }

  // A brand-new resume starts with exactly the template's default composition.
  // Extra content is only preserved when this is a real switch (the document
  // already had another template) or an upload (force:true). Otherwise the
  // starter sample would leak sections the template does not default to.
  const preserveExtras =
    options.preserveExtras ??
    Boolean(options.force || (source.template && source.template !== targetTemplateId));

  const defaultTitleMap = getTemplateDefaultSectionTitles(targetTemplateId);
  const norm = (id: string) => normalizeSectionType(id) || id;
  const defaultNorms = new Set(defaults.map(norm));

  // Sections kept across the switch: user-added + custom + any content-bearing
  // section that was visible in the previous composition. This is what makes a
  // template switch lossless: a project stays a project and keeps rendering
  // after the new template's defaults instead of disappearing into a notice.
  //
  // An upload is broader: the parsed document may not carry a sectionOrder, so
  // every registered section with content is a candidate. A section the user
  // explicitly hid is never re-surfaced.
  const extraCandidates = options.force
    ? [
        ...currentOrder,
        ...(Object.keys(SECTION_REGISTRY) as ResumeSectionType[]).filter(
          (type) => type !== 'contact' && type !== 'custom' && type !== 'expert_skills'
        ),
        ...Object.keys(source.customSections || {}),
      ]
    : currentOrder;

  const contentBearingKeeps = preserveExtras
    ? dedupeIds(extraCandidates).filter((id) => {
        if (defaultNorms.has(norm(id))) return false;
        const type = normalizeSectionType(id) || id;
        if (source.sectionVisibility?.[id] === false || source.sectionVisibility?.[type] === false) return false;
        if (id.startsWith('custom_')) return true;
        const canonical = normalizeSectionType(id);
        return canonical ? hasSectionContent(source as ResumeData, canonical) : false;
      })
    : [];

  // Compared by canonical type so aliases ('additionalInfo' vs
  // 'additional_information') never duplicate a default section.
  const candidateKeeps = dedupeIds([
    ...(source.userAddedSections || []),
    ...Object.keys(source.customSections || {}),
    ...contentBearingKeeps,
  ]);
  const preservedSet = new Set(candidateKeeps.filter((id) => !defaultNorms.has(norm(id))));

  // Keep the user's previous relative order for preserved sections, then any
  // preserved ids that were missing from the order.
  const keptFromOrder = currentOrder.filter((id) => preservedSet.has(id));
  const keptNorms = new Set(keptFromOrder.map(norm));
  const keptMissing = Array.from(preservedSet).filter((id) => !keptNorms.has(norm(id)));

  // Final order, deduped by canonical type.
  const newOrder: string[] = [];
  const orderNorms = new Set<string>();
  for (const id of [...defaults, ...keptFromOrder, ...keptMissing]) {
    const n = norm(id);
    if (orderNorms.has(n)) continue;
    orderNorms.add(n);
    newOrder.push(id);
  }

  // Titles: defaults snap to the preview; preserved sections keep theirs.
  const defaultNormToId = new Map<string, string>();
  for (const id of defaults) defaultNormToId.set(norm(id), id);
  const finalTitles: Record<string, string> = {};
  for (const id of newOrder) {
    const n = norm(id);
    const defaultId = defaultNormToId.get(n);
    if (defaultId !== undefined) {
      finalTitles[id] = defaultTitleMap[defaultId];
    } else {
      const current =
        source.sectionTitles?.[id] ||
        source.sectionTitles?.[n] ||
        source.customSections?.[id]?.title ||
        getSectionTitle(source as ResumeData, id);
      if (current) finalTitles[id] = current;
    }
  }

  // Visibility: explicit flags persist; make sure preserved sections the new
  // template hides by default stay visible (they were explicitly added).
  const finalVisibility: Record<string, boolean> = { ...(source.sectionVisibility || {}) };
  for (const id of [...keptFromOrder, ...keptMissing]) {
    const n = norm(id);
    if (!(n in finalVisibility) && !(id in finalVisibility) && isSectionHiddenByTemplateDefault(targetTemplateId, id)) {
      finalVisibility[n] = true;
    }
  }

  return {
    ...source,
    template: targetTemplateId,
    sectionOrder: newOrder,
    sectionTitles: finalTitles,
    sectionVisibility: finalVisibility,
    userAddedSections: dedupeIds(source.userAddedSections || []),
  } as ResumeData;
}

export interface HiddenContentSection {
  id: string;
  title: string;
  isCustom: boolean;
}

/**
 * Sections that contain saved content but sit outside `sectionOrder` — i.e.
 * stored (never lost) yet not shown on this template. Surfaced by the editor's
 * one-time notice so the user can add them with one click after an upload.
 *
 * Sections the user explicitly hid (`sectionVisibility[id] === false`) are not
 * listed: hiding was their decision, not a template default.
 */
export function findSectionsHiddenByDefaults(
  data: Partial<ResumeData> | null | undefined
): HiddenContentSection[] {
  if (!data || typeof data !== 'object') return [];
  const order = Array.isArray(data.sectionOrder) ? data.sectionOrder : [];
  const orderSet = new Set(order.map((s) => normalizeSectionType(s) || s));
  const visibility = data.sectionVisibility || {};
  const out: HiddenContentSection[] = [];

  const registryKeys = Object.keys(SECTION_REGISTRY) as ResumeSectionType[];
  for (const key of registryKeys) {
    // contact is header data, custom is handled below, and expert_skills has no
    // visibility path (isSectionVisible always rejects it) — never offer those.
    if (key === 'contact' || key === 'custom' || key === 'expert_skills') continue;
    if (orderSet.has(key)) continue;
    if (visibility[key] === false) continue;
    if (!hasSectionContent(data as ResumeData, key)) continue;
    out.push({ id: key, title: getSectionTitle(data as ResumeData, key), isCustom: false });
  }

  for (const customId of Object.keys(data.customSections || {})) {
    if (orderSet.has(customId)) continue;
    if (visibility[customId] === false) continue;
    if (!hasSectionContent(data as ResumeData, 'custom', customId)) continue;
    out.push({
      id: customId,
      title: getSectionTitle(data as ResumeData, customId),
      isCustom: true,
    });
  }

  return out;
}
