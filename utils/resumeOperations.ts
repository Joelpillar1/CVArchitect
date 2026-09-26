import type { ResumeData } from '../types';
import { parseDescriptionBullets, parseAchievementBullets, splitSkillsList, stripMarkdown } from './templateUtils';
import { serializeResumeToText } from './resumeText';
import {
  ResumeOperationSchema,
  operationRequiresEvidence,
  ARRAY_ITEM_FIELDS,
  type ResumeOperation,
  type ArraySection,
  type BulletSection,
} from '../types/resumeOperations';
import { normalizeSectionType, createDefaultSectionOrder } from './sectionRegistry';

/**
 * Pure, immutable reducer + validator for structured resume operations.
 *
 * `validateOperation` runs on BOTH the server (before an operation is streamed to the
 * client) and the client (before it is applied), so the two never diverge.
 * `applyOperation` is a pure function of (data, op) → data — it never mutates its input
 * and never reads wall-clock/random state, so runs are reproducible and undo is exact.
 */

export class OperationError extends Error {
  code: string;
  constructor(message: string, code = 'operation_error') {
    super(message);
    this.name = 'OperationError';
    this.code = code;
  }
}

export type ValidationResult = { ok: true } | { ok: false; error: string; code: string };

const ok: ValidationResult = { ok: true };
const fail = (error: string, code = 'invalid_operation'): ValidationResult => ({ ok: false, error, code });

// ── Section access helpers ───────────────────────────────────────────────────

/** The array backing a structured section (empty array when the section is absent). */
function getSectionArray(data: ResumeData, section: ArraySection): Array<{ id?: string; [k: string]: unknown }> {
  const arr = (data as unknown as Record<string, unknown>)[section];
  return Array.isArray(arr) ? (arr as Array<{ id?: string; [k: string]: unknown }>) : [];
}

/**
 * Finds index of an item in a section array with resilient matching:
 * 1. Exact id match
 * 2. Stripped prefix / parent item ID (e.g. "bullet_1787021048820_2" -> "1787021048820")
 * 3. Formatted ID prefix (e.g. "exp_1" -> index 0)
 * 4. Numeric index (e.g. "3" -> 3rd item, index 2)
 */
export function findItemIndex(
  arr: Array<{ id?: string; [k: string]: unknown }>,
  itemId: string | undefined,
  section?: string,
): number {
  if (!arr || !arr.length) return -1;
  if (!itemId || itemId.trim() === '') return -1;
  const target = itemId.trim().toLowerCase();

  // If the model literally supplied '<itemid>' or 'itemid' or '<id>'
  if (target === '<itemid>' || target === 'itemid' || target === '<id>') {
    return 0;
  }

  // 1. Exact id match
  let idx = arr.findIndex((i) => (i.id ?? '').toLowerCase() === target);
  if (idx >= 0) return idx;

  // 2. Stripped prefixes / suffixes (e.g. "bullet_1787021048820_2", "exp_1787021048820")
  const stripped = target.replace(/^(bullet_|exp_|item_|edu_|proj_|cert_|lang_|lead_)/, '');
  idx = arr.findIndex((i) => {
    const rawId = (i.id ?? '').toLowerCase();
    if (!rawId) return false;
    return rawId === stripped || stripped.startsWith(rawId) || rawId.startsWith(stripped);
  });
  if (idx >= 0) return idx;

  // 3. Number/index match (e.g. "exp_1", "exp-1", "experience-1", "1", "3", "proj_2")
  const numMatch = target.match(/^(?:exp|proj|edu|cert|lead|item)?[_-]?(\d+)$/i);
  if (numMatch) {
    const num = parseInt(numMatch[1], 10);
    // 1-based index (e.g. 1st item is 1, 3rd is 3)
    if (num >= 1 && num <= arr.length) return num - 1;
    // 0-based fallback
    if (num === 0 && arr.length > 0) return 0;
  }

  // 4. Clean alphanumeric string comparison for fuzzy entity / role / name matching
  const cleanTarget = target.replace(/[^a-z0-9]/g, '');

  if (cleanTarget.length >= 3) {
    // 5. Match by Company / Organization / School / Project Name / Certificate Name
    idx = arr.findIndex((item) => {
      const nameField = String(item.company || item.organization || item.school || item.name || item.issuer || '').toLowerCase().trim();
      if (!nameField) return false;
      const cleanName = nameField.replace(/[^a-z0-9]/g, '');
      if (cleanName.length < 3) return false;
      return (
        nameField === target ||
        cleanName === cleanTarget ||
        (cleanName.length >= 4 && cleanTarget.includes(cleanName)) ||
        (cleanTarget.length >= 4 && cleanName.includes(cleanTarget))
      );
    });
    if (idx >= 0) return idx;

    // 6. Match by Role / Position / Title / Degree
    idx = arr.findIndex((item) => {
      const roleField = String(item.role || item.title || item.position || item.degree || '').toLowerCase().trim();
      if (!roleField) return false;
      const cleanRole = roleField.replace(/[^a-z0-9]/g, '');
      if (cleanRole.length < 3) return false;
      return (
        roleField === target ||
        cleanRole === cleanTarget ||
        (cleanRole.length >= 4 && cleanTarget.includes(cleanRole)) ||
        (cleanTarget.length >= 4 && cleanRole.includes(cleanTarget))
      );
    });
    if (idx >= 0) return idx;

    // 7. Combined Role + Company match (e.g. "NanoPay Lead UI/UX Designer" or "Lead UI/UX Designer at NanoPay")
    idx = arr.findIndex((item) => {
      const combined = `${item.role || item.title || item.degree || ''} ${item.company || item.name || item.organization || item.school || ''}`.toLowerCase().trim();
      const cleanCombined = combined.replace(/[^a-z0-9]/g, '');
      if (cleanCombined.length < 4 || cleanTarget.length < 4) return false;
      return cleanCombined.includes(cleanTarget) || cleanTarget.includes(cleanCombined);
    });
    if (idx >= 0) return idx;
  }

  return -1;
}

/** Normalize common field name aliases produced by LLMs to canonical schema fields. */
export function normalizeItemFields(
  section: ArraySection,
  rawFields: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawFields || {})) {
    const k = key.trim();
    if (section === 'experience' || section === 'leadership') {
      if (k === 'bullets') result.description = value;
      else if (k === 'title' || k === 'position') result.role = value;
      else if (k === 'dates' || k === 'period') result.startDate = value;
      else result[k] = value;
    } else if (section === 'education') {
      if (k === 'institution' || k === 'university' || k === 'college') result.school = value;
      else if (k === 'graduationYear' || k === 'date' || k === 'dates') result.year = value;
      else result[k] = value;
    } else if (section === 'projects') {
      if (k === 'techStack' || k === 'skills' || k === 'tools') result.technologies = value;
      else result[k] = value;
    } else if (section === 'certifications') {
      if (k === 'organization' || k === 'authority') result.issuer = value;
      else result[k] = value;
    } else {
      result[k] = value;
    }
  }
  return result;
}

/** The current bullet list for a bullet-section target, normalized to string[]. */
function getBullets(data: ResumeData, section: BulletSection, itemId?: string): string[] | null {
  if (section === 'keyAchievements') {
    return parseAchievementBullets(data.keyAchievements ?? []);
  }
  if (section === 'projects') {
    const items = data.projects ?? [];
    const idx = findItemIndex(items, itemId, section);
    if (idx < 0) {
      // Fallback check in experience if section was mislabeled
      const expIdx = findItemIndex(data.experience ?? [], itemId, 'experience');
      if (expIdx >= 0) return parseDescriptionBullets((data.experience ?? [])[expIdx].description);
      return null;
    }
    return parseDescriptionBullets(items[idx].description);
  }
  const arr = section === 'experience' ? data.experience : data.leadership;
  const items = arr ?? [];
  let idx = findItemIndex(items, itemId, section);
  if (idx < 0) {
    // Fallback check in projects if section was mislabeled as experience
    const projIdx = findItemIndex(data.projects ?? [], itemId, 'projects');
    if (projIdx >= 0) return parseDescriptionBullets((data.projects ?? [])[projIdx].description);
    return null;
  }
  return parseDescriptionBullets(items[idx].description);
}

// ── Anti-hallucination: numeric grounding ────────────────────────────────────

/**
 * Checks if a numeric token is a standard 4-digit calendar year (e.g. 2022).
 */
export function isDateOrYearToken(tok: string): boolean {
  const num = parseInt(tok, 10);
  if (!Number.isNaN(num)) {
    // 4-digit years between 1950 and 2050 are calendar years, not quantitative performance metrics
    if (tok.length === 4 && num >= 1950 && num <= 2050) return true;
  }
  return false;
}

/**
 * Digit-runs in a string, normalized (grouping commas stripped, decimals kept):
 * "grew 1,200 users (+32%)" → ["1200", "32"]. Tokens are compared exactly (as a set),
 * never by substring, so "20" is NOT considered present in "2020".
 */
export function extractNumericTokens(text: string): Set<string> {
  const tokens = new Set<string>();
  const re = /(?:^|[^\d.,])(\d+(?:,\d{3})*(?:\.\d+)?|\d*\.\d+)(?=[^\d.,]|$)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const raw = match[1];
    if (!raw) continue;
    const clean = raw.replace(/,/g, '');
    const num = Number(clean);
    if (!Number.isNaN(num)) tokens.add(clean);
  }
  return tokens;
}

/**
 * Validates that every numeric token in `proposed` is grounded in at least one
 * string in `evidencePool`. If any number is ungrounded, returns the offending
 * numbers; otherwise returns an empty array.
 */
export function findUngroundedNumbers(proposed: string, evidencePool: readonly string[]): string[] {
  const proposedTokens = extractNumericTokens(proposed);
  if (proposedTokens.size === 0) return [];

  const evidenceTokens = new Set<string>();
  for (const text of evidencePool) {
    if (!text) continue;
    for (const tok of extractNumericTokens(text)) evidenceTokens.add(tok);
  }

  const ungrounded: string[] = [];
  for (const tok of proposedTokens) {
    if (isDateOrYearToken(tok)) continue;
    if (!evidenceTokens.has(tok)) ungrounded.push(tok);
  }
  return ungrounded;
}

/**
 * Finds placeholder tokens like [X]%, [X], [metric], etc. in proposed text.
 */
export function findPlaceholderTokens(text: string): string[] {
  const matches: string[] = [];
  const placeholderRegex = /\[(?:X|x|\?|metric|number|percentage|insert[^\]]*)\]%?|\b(?:increased|reduced|grew|improved)\s+by\s+X%|\bX%\b/gi;
  let match: RegExpExecArray | null;
  while ((match = placeholderRegex.exec(text)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

// ── Validator ────────────────────────────────────────────────────────────────

/**
 * Validate a proposed operation against the current resume state.
 *
 * Rules:
 *   1. Shape adheres to `ResumeOperationSchema` (Zod parse).
 *   2. Content-producing ops must have a non-empty `evidence` list.
 *   3. Numeric tokens in the proposed text MUST be grounded in the cited evidence.
 *   4. No fake placeholders like [X]% or [metric] are allowed.
 *   5. Targets (items, bullet indices, sections) must exist on the current resume.
 */
export function validateOperation(
  op: unknown,
  data: ResumeData,
  extraEvidence: readonly string[] = [],
): ValidationResult {
  const parsed = ResumeOperationSchema.safeParse(op);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const msg = firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Malformed operation.';
    return fail(`Malformed operation: ${msg}`, 'schema_error');
  }

  const o = parsed.data;

  // 1. Evidence presence for content-producing ops
  if (operationRequiresEvidence(o.op) && (!o.evidence || o.evidence.length === 0)) {
    return fail(
      `Operation "${o.op}" creates or changes content and requires at least one cited evidence string.`,
      'missing_evidence',
    );
  }

  // 2. Numeric grounding & placeholder checks across all operations that supply proposed text
  // (Skills like HTML5, OAuth 2.0 are names/tools, exempt from performance metric grounding)
  const isSkillOp = o.op === 'add_skill' || o.op === 'set_skills' || o.op === 'remove_skill';
  const proposedText =
    isSkillOp
      ? null
      : 'value' in o
      ? o.value
      : 'fields' in o
      ? Object.values(o.fields).join(' ')
      : 'item' in o
      ? Object.values(o.item).join(' ')
      : null;

  if (proposedText) {
    const placeholders = findPlaceholderTokens(proposedText);
    if (placeholders.length > 0) {
      return fail(
        `Proposed text contains placeholder(s) [${placeholders.join(', ')}]. Never use fake placeholders or ungrounded estimates.`,
        'placeholder_error',
      );
    }

    if (o.evidence && o.evidence.length > 0) {
      // We pool the operation's cited evidence WITH the entire current resume text
      // and extra verified context (candidate facts, target JD) as ground truth.
      const baselineText = serializeResumeToText(data);
      const pool = [...o.evidence, ...extraEvidence, baselineText];
      const ungrounded = findUngroundedNumbers(proposedText, pool);
      if (ungrounded.length > 0) {
        return fail(
          `Ungrounded number(s) [${ungrounded.join(', ')}] in proposed text. Every number must appear in the candidate's resume, verified chat facts, or target JD.`,
          'ungrounded_metric',
        );
      }
    }
  }

  // 3. Target existence checks
  switch (o.op) {
    case 'set_field':
      return ok;

    case 'replace_bullet':
    case 'delete_bullet': {
      const bullets = getBullets(data, o.section, o.itemId);
      if (bullets === null) return fail(`No ${o.section} item with id "${o.itemId ?? ''}".`, 'unknown_item');
      if (o.bulletIndex < 0 || o.bulletIndex >= bullets.length) {
        return fail(
          `bulletIndex ${o.bulletIndex} out of range (section has ${bullets.length} bullets).`,
          'bad_bullet_index',
        );
      }
      return ok;
    }

    case 'insert_bullet': {
      const bullets = getBullets(data, o.section, o.itemId);
      if (bullets === null) return fail(`No ${o.section} item with id "${o.itemId ?? ''}".`, 'unknown_item');
      if (o.bulletIndex < 0 || o.bulletIndex > bullets.length) {
        return fail(
          `bulletIndex ${o.bulletIndex} out of range for insert (section has ${bullets.length} bullets).`,
          'bad_bullet_index',
        );
      }
      return ok;
    }

    case 'update_item': {
      const arr = getSectionArray(data, o.section);
      if (findItemIndex(arr, o.itemId, o.section) < 0) return fail(`No ${o.section} item with id "${o.itemId}".`, 'unknown_item');
      const normalized = normalizeItemFields(o.section, o.fields);
      const allowed = ARRAY_ITEM_FIELDS[o.section];
      const bad = Object.keys(normalized).filter((k) => !allowed.includes(k));
      if (bad.length) return fail(`Fields not allowed on ${o.section}: ${bad.join(', ')}.`, 'bad_field');
      if (Object.keys(normalized).length === 0) return fail('update_item requires at least one field.', 'empty_patch');
      return ok;
    }

    case 'insert_item': {
      const normalized = normalizeItemFields(o.section, o.item);
      const allowed = ARRAY_ITEM_FIELDS[o.section];
      const bad = Object.keys(normalized).filter((k) => !allowed.includes(k));
      if (bad.length) return fail(`Fields not allowed on ${o.section}: ${bad.join(', ')}.`, 'bad_field');
      if (Object.keys(normalized).length === 0) return fail('insert_item requires at least one field.', 'empty_item');
      return ok;
    }

    case 'delete_item': {
      const arr = getSectionArray(data, o.section);
      if (findItemIndex(arr, o.itemId, o.section) < 0) return fail(`No ${o.section} item with id "${o.itemId}".`, 'unknown_item');
      return ok;
    }

    case 'add_skill':
    case 'set_skills':
      if (!o.value.trim()) return fail('Skill value cannot be empty.', 'empty_value');
      return ok;

    case 'remove_skill':
      if (!o.value.trim()) return fail('Skill value cannot be empty.', 'empty_value');
      return ok;

    case 'reorder_sections':
      if (!o.order.length) return fail('reorder_sections requires a non-empty order.', 'empty_order');
      return ok;

    case 'show_section': {
      const normalized = normalizeSectionType(o.section) || (o.section.startsWith('custom_') ? 'custom' : null);
      if (!normalized && !o.section.trim()) {
        return fail(`Unknown section "${o.section}".`, 'unknown_section');
      }
      return ok;
    }

    case 'hide_section': {
      const normalized = normalizeSectionType(o.section);
      if (normalized === 'contact') {
        return fail('Contact section is required and cannot be hidden.', 'cannot_hide_contact');
      }
      return ok;
    }

    case 'rename_section':
      if (!o.title.trim()) return fail('Section title cannot be empty.', 'empty_title');
      return ok;

    default:
      return fail('Unknown operation.', 'unknown_op');
  }
}

// ── Reducer ─────────────────────────────────────────────────────────────────

/** Deterministic, collision-free id for a newly inserted array item. */
function nextItemId(existing: Array<{ id?: string }>, section: string): string {
  const ids = new Set(existing.map((i) => i.id).filter(Boolean));
  let n = existing.length + 1;
  let id = `${section}-${n}`;
  while (ids.has(id)) {
    n += 1;
    id = `${section}-${n}`;
  }
  return id;
}

/** Case-insensitive skill dedup preserving original ordering + casing. */
function mergeSkill(current: string, value: string): string {
  const list = splitSkillsList(current);
  const add = value.trim();
  if (!add) return current;
  if (list.some((s) => s.toLowerCase() === add.toLowerCase())) return list.join(', ');
  return [...list, add].join(', ');
}

function removeSkill(current: string, value: string): string {
  const target = value.trim().toLowerCase();
  return splitSkillsList(current)
    .filter((s) => s.toLowerCase() !== target)
    .join(', ');
}

/** Write a bullet list back onto a bullet-section target, returning new ResumeData. */
function writeBullets(data: ResumeData, section: BulletSection, itemId: string | undefined, bullets: string[]): ResumeData {
  if (section === 'keyAchievements') {
    return { ...data, keyAchievements: bullets };
  }
  if (section === 'projects') {
    const items = data.projects ?? [];
    let idx = findItemIndex(items, itemId, 'projects');
    if (idx >= 0) {
      const next = items.map((item, i) => (i === idx ? { ...item, description: bullets } : item));
      return { ...data, projects: next } as ResumeData;
    }
    // Fallback: check experience
    const expItems = data.experience ?? [];
    const expIdx = findItemIndex(expItems, itemId, 'experience');
    if (expIdx >= 0) {
      const next = expItems.map((item, i) => (i === expIdx ? { ...item, description: bullets } : item));
      return { ...data, experience: next } as ResumeData;
    }
    return data;
  }
  const key = section === 'experience' ? 'experience' : 'leadership';
  const arr = (section === 'experience' ? data.experience : data.leadership) ?? [];
  let idx = findItemIndex(arr, itemId, section);
  if (idx < 0) {
    // Fallback: check projects
    const projItems = data.projects ?? [];
    const projIdx = findItemIndex(projItems, itemId, 'projects');
    if (projIdx >= 0) {
      const next = projItems.map((item, i) => (i === projIdx ? { ...item, description: bullets } : item));
      return { ...data, projects: next } as ResumeData;
    }
    return data;
  }
  const next = arr.map((item, i) => (i === idx ? { ...item, description: bullets } : item));
  return { ...data, [key]: next } as ResumeData;
}

/**
 * Apply one validated operation to the resume, returning a new ResumeData.
 * Throws OperationError on an unresolvable target — callers MUST validate first.
 */
export function applyOperation(data: ResumeData, op: ResumeOperation): ResumeData {
  switch (op.op) {
    case 'set_field':
      return { ...data, [op.field]: stripMarkdown(op.value) };

    case 'replace_bullet': {
      const bullets = getBullets(data, op.section, op.itemId);
      if (bullets === null) throw new OperationError(`No ${op.section} item "${op.itemId}"`, 'unknown_item');
      if (op.bulletIndex < 0 || op.bulletIndex >= bullets.length) throw new OperationError('bulletIndex out of range', 'bad_index');
      const next = [...bullets];
      next[op.bulletIndex] = stripMarkdown(op.value);
      return writeBullets(data, op.section, op.itemId, next);
    }

    case 'insert_bullet': {
      const bullets = getBullets(data, op.section, op.itemId);
      if (bullets === null) throw new OperationError(`No ${op.section} item "${op.itemId}"`, 'unknown_item');
      if (op.bulletIndex < 0 || op.bulletIndex > bullets.length) throw new OperationError('bulletIndex out of range', 'bad_index');
      const next = [...bullets];
      next.splice(op.bulletIndex, 0, stripMarkdown(op.value));
      return writeBullets(data, op.section, op.itemId, next);
    }

    case 'delete_bullet': {
      const bullets = getBullets(data, op.section, op.itemId);
      if (bullets === null) throw new OperationError(`No ${op.section} item "${op.itemId}"`, 'unknown_item');
      if (op.bulletIndex < 0 || op.bulletIndex >= bullets.length) throw new OperationError('bulletIndex out of range', 'bad_index');
      const next = bullets.filter((_, i) => i !== op.bulletIndex);
      return writeBullets(data, op.section, op.itemId, next);
    }

    case 'update_item': {
      const arr = getSectionArray(data, op.section);
      const idx = findItemIndex(arr, op.itemId, op.section);
      if (idx < 0) throw new OperationError(`No ${op.section} item "${op.itemId}"`, 'unknown_item');
      const allowed = ARRAY_ITEM_FIELDS[op.section];
      const normalized = normalizeItemFields(op.section, op.fields);
      const patch: Record<string, string> = {};
      for (const [k, v] of Object.entries(normalized)) if (allowed.includes(k)) patch[k] = stripMarkdown(v);
      const next = arr.map((item, i) => (i === idx ? { ...item, ...patch } : item));
      return { ...data, [op.section]: next } as ResumeData;
    }

    case 'insert_item': {
      const arr = getSectionArray(data, op.section);
      const allowed = ARRAY_ITEM_FIELDS[op.section];
      const normalized = normalizeItemFields(op.section, op.item);
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(normalized)) if (allowed.includes(k)) clean[k] = stripMarkdown(v);
      const item = { id: nextItemId(arr, op.section), ...clean };
      return { ...data, [op.section]: [...arr, item] } as ResumeData;
    }

    case 'delete_item': {
      const arr = getSectionArray(data, op.section);
      const idx = findItemIndex(arr, op.itemId, op.section);
      if (idx < 0) throw new OperationError(`No ${op.section} item "${op.itemId}"`, 'unknown_item');
      return { ...data, [op.section]: arr.filter((_, i) => i !== idx) } as ResumeData;
    }

    case 'add_skill':
      return { ...data, skills: mergeSkill(data.skills ?? '', stripMarkdown(op.value)) };

    case 'remove_skill':
      return { ...data, skills: removeSkill(data.skills ?? '', stripMarkdown(op.value)) };

    case 'set_skills':
      return { ...data, skills: stripMarkdown(op.value) };

    case 'reorder_sections':
      return { ...data, sectionOrder: [...op.order] };

    case 'show_section': {
      const canonical = normalizeSectionType(op.section) || op.section;
      const vis = { ...(data.sectionVisibility || {}) };
      vis[op.section] = true;
      vis[canonical] = true;

      const order = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0
        ? [...data.sectionOrder]
        : createDefaultSectionOrder();

      if (!order.some((s) => s === op.section || normalizeSectionType(s) === canonical)) {
        order.push(op.section);
      }

      const nextData: ResumeData = {
        ...data,
        sectionVisibility: vis,
        sectionOrder: order,
      };

      // If initial/default content value is supplied, populate the canonical scalar field
      if (op.value && typeof op.value === 'string') {
        const cleanVal = stripMarkdown(op.value);
        if (canonical === 'references') nextData.referee = cleanVal;
        else if (canonical === 'summary') nextData.summary = cleanVal;
        else if (canonical === 'interests') nextData.interests = cleanVal;
        else if (canonical === 'coursework') nextData.coursework = cleanVal;
        else if (canonical === 'thesis') nextData.thesis = cleanVal;
        else if (canonical === 'security_clearance') nextData.securityClearance = cleanVal;
      }

      return nextData;
    }

    case 'hide_section': {
      const canonical = normalizeSectionType(op.section) || op.section;
      const vis = { ...(data.sectionVisibility || {}) };
      vis[op.section] = false;
      vis[canonical] = false;

      return {
        ...data,
        sectionVisibility: vis,
      };
    }

    case 'rename_section': {
      const canonical = normalizeSectionType(op.section) || op.section;
      const titles = { ...(data.sectionTitles || {}) };
      titles[op.section] = stripMarkdown(op.title);
      titles[canonical] = stripMarkdown(op.title);

      return {
        ...data,
        sectionTitles: titles,
      };
    }

    default: {
      const _exhaustive: never = op;
      throw new OperationError(`Unhandled operation: ${JSON.stringify(_exhaustive)}`, 'unknown_op');
    }
  }
}

/** Fold a batch of operations; used when replaying a whole run. */
export function applyOperations(data: ResumeData, ops: ResumeOperation[]): ResumeData {
  return ops.reduce((acc, op) => applyOperation(acc, op), data);
}

/** Human-readable section label for UI grouping (redline cards, toasts). */
export function operationDisplaySection(op: ResumeOperation): string {
  switch (op.op) {
    case 'set_field':
      if (op.field === 'summary') return 'summary';
      if (op.field === 'referee') return 'references';
      return 'header';
    case 'add_skill':
    case 'remove_skill':
    case 'set_skills':
      return 'skills';
    case 'reorder_sections':
      return 'layout';
    case 'show_section':
    case 'hide_section':
    case 'rename_section':
      return op.section;
    default:
      return (op as { section?: string }).section ?? 'resume';
  }
}

// Re-export so consumers can import both the schema and the reducer from one module.
export { ResumeOperationSchema } from '../types/resumeOperations';
export type { ResumeOperation } from '../types/resumeOperations';
