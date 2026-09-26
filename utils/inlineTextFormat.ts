import type { ResumeData } from '../types';
import {
  formatDate,
  formatNameDisplay,
  formatJobTitleDisplay,
  formatContactText,
  formatLocationDisplay,
  formatLinkedInDisplay,
  parseDescriptionBullets,
  parseAchievementBullets,
} from './templateUtils';

/**
 * Transform-aware text matching for the resume agent's inline formatting toolbar
 * (bold / italic / underline / link / AI rewrite).
 *
 * The toolbar lets a user select ANY rendered text on the resume canvas and format
 * it like Microsoft Word. The source of truth is `ResumeData`, but the preview does
 * NOT render it verbatim everywhere: names are title-cased, contact info lowercased,
 * dates reformatted ("2021-01" -> "Jan 2021"), bullet markers stripped, and skills
 * title-cased. Naive verbatim string matching therefore silently no-ops on those
 * sections, and first-match-wins traversal applies the edit to the wrong field when
 * the same text appears twice (e.g. a phrase in both the summary and a bullet).
 *
 * This module builds a field-path model of the resume (stored text + the rendered
 * variants the templates actually display), matches the selection against it, and
 * applies edits to the exact field the user selected — optionally disambiguated by
 * the DOM text of the element the selection lives in.
 */

// ── Field-path model ──────────────────────────────────────────────────────────

export interface TextMatch {
  /** Dotted path into ResumeData, e.g. "experience.0.description.2". */
  path: string;
  /** The stored field text (source of truth). */
  stored: string;
  /** The exact stored span that maps to the user's selection (original casing). */
  span: string;
  /** Start offset of `span` inside `stored` (for stored-variant matches). */
  start: number;
  end: number;
  /** Whether the selection was located in the stored text or only in a rendered variant. */
  via: 'stored' | 'rendered';
}

interface Candidate {
  path: string;
  stored: string;
  /** Render variants the preview displays (case transforms, formatted dates, …). */
  variants: string[];
}

function pushCandidate(list: Candidate[], path: string, stored: unknown, rendered?: string): void {
  if (typeof stored !== 'string' || !stored.trim()) return;
  const variants = [stored];
  if (typeof rendered === 'string' && rendered && rendered !== stored) {
    variants.push(rendered);
  }
  list.push({ path, stored, variants });
}

/** Lowercases and collapses whitespace so formatting-tag-free text compares cleanly. */
export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Escape a string for use inside a RegExp. */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Strip inline tags from a stored string and return a mapper from plain-text
 * offsets back into the raw (tagged) string. Selections live in the rendered
 * DOM, which has no tags, so matching must run on the plain text while edits
 * splice into the raw stored string.
 */
export function plainTextWithOffsets(stored: string): { plain: string; toRaw: (plainOffset: number) => number } {
  const plainToRaw: number[] = [];
  let plain = '';
  let i = 0;
  while (i < stored.length) {
    if (stored[i] === '<') {
      while (i < stored.length && stored[i] !== '>') i++;
      i++; // skip '>'
      continue;
    }
    plainToRaw.push(i);
    plain += stored[i];
    i++;
  }
  const toRaw = (plainOffset: number): number => {
    if (plainOffset <= 0) return 0;
    if (plainOffset >= plainToRaw.length) return stored.length;
    return plainToRaw[plainOffset];
  };
  return { plain, toRaw };
}

/**
 * Body-text fields are the descriptive paragraphs and bullet lines a user should
 * be able to format inline (bold / italic / underline / link / AI rewrite).
 * Structural fields — dates, section headers, experience headers (job title,
 * company, location), contact info — are deliberately excluded, so they never
 * respond to the selection toolbar even when highlighted. Skills are body text:
 * the toolbar works on the skill chips/lines, so users can bold a skill etc.
 */
export function isBodyTextField(path: string): boolean {
  return (
    path === 'summary' ||
    path === 'skills' ||
    path === 'technicalSkills' ||
    path === 'coreCompetencies' ||
    path === 'toolsAndTechnologies' ||
    /^(?:experience|leadership|volunteering|research|teaching|military|clinicalExperience)\.\d+\.description(?:\.\d+)?$/.test(path) ||
    /^(?:projects|portfolio|caseStudies|selectedWork)\.\d+\.description(?:\.\d+)?$/.test(path) ||
    /^(?:coursework)\.\d+\.description(?:\.\d+)?$/.test(path) ||
    /^(?:coursework)\.\d+\.skills$/.test(path) ||
    /^(?:keyAchievements|achievements|awards|publications|conferencesSpeaking|academicAchievements)(?:\.\d+)?$/.test(path) ||
    /^customSections\.[^.]+\.content(?:\.\d+)?$/.test(path) ||
    path === 'coursework' ||
    path === 'thesis' ||
    path === 'interests' ||
    path === 'referee' ||
    path === 'securityClearance'
  );
}

export interface MatchOptions {
  /**
   * Only match body-text fields. When true, selections in dates, headers,
   * contact info, etc. never match, so formatting / rewrite no-ops on them.
   */
  bodyTextOnly?: boolean;
  /**
   * Character offset of the selection start within the DOM context element
   * (the field the user actually clicked into). When the selected text appears
   * more than once in a field (e.g. the same word bolded twice), the toolbar
   * must edit the occurrence the user selected — not the first match. Offsets
   * are approximate (the DOM strips tags and may transform casing), so the
   * occurrence whose preceding text best matches the DOM text before the
   * selection wins.
   */
  selectionOffset?: number;
}

/** Every editable string in the resume, with the variants the templates render. */
export function buildTextCandidates(data: ResumeData): Candidate[] {
  const out: Candidate[] = [];

  const pushDate = (path: string, value: unknown) =>
    pushCandidate(out, path, value, formatDate(typeof value === 'string' ? value : ''));

  pushCandidate(out, 'fullName', data.fullName, formatNameDisplay(data.fullName, data.headerCase));
  pushCandidate(out, 'jobTitle', data.jobTitle, formatJobTitleDisplay(data.jobTitle, data.jobTitleCase));
  pushCandidate(out, 'email', data.email, formatContactText(data.email));
  pushCandidate(out, 'phone', data.phone, formatContactText(data.phone));
  pushCandidate(out, 'atHandle', data.atHandle, formatContactText(data.atHandle));
  pushCandidate(out, 'address', data.address, formatLocationDisplay(data.address));
  pushCandidate(out, 'linkedin', data.linkedin, formatLinkedInDisplay(data.linkedin));
  pushCandidate(out, 'location', data.location, formatLocationDisplay(data.location));
  pushCandidate(out, 'summary', data.summary);
  pushCandidate(out, 'skills', data.skills);
  pushCandidate(out, 'technicalSkills', data.technicalSkills);
  pushCandidate(out, 'coreCompetencies', data.coreCompetencies);
  pushCandidate(out, 'toolsAndTechnologies', data.toolsAndTechnologies);
  pushCandidate(out, 'referee', data.referee);
  pushCandidate(out, 'interests', data.interests);
  pushCandidate(out, 'thesis', data.thesis);
  pushCandidate(out, 'securityClearance', data.securityClearance);

  if (Array.isArray(data.coursework)) {
    data.coursework.forEach((item, i) => {
      const base = `coursework.${i}`;
      pushCandidate(out, `${base}.courseName`, item.courseName);
      pushCandidate(out, `${base}.institution`, item.institution);
      pushCandidate(out, `${base}.year`, item.year);
      pushCandidate(out, `${base}.skills`, item.skills);
      const bullets = parseDescriptionBullets(item.description || '');
      bullets.forEach((b: any, j: number) => {
        const raw = String(b || '');
        const cleaned = raw.replace(/^[•·\-*]\s*/, '');
        pushCandidate(out, `${base}.description.${j}`, raw, cleaned !== raw ? cleaned : undefined);
      });
    });
  } else if (typeof data.coursework === 'string') {
    pushCandidate(out, 'coursework', data.coursework);
  }

  // 1. Experience-like sections
  const expKeys = [
    'experience',
    'leadership',
    'volunteering',
    'research',
    'teaching',
    'military',
    'clinicalExperience',
  ] as const;

  expKeys.forEach((key) => {
    const items = (data[key] as any[]) || [];
    items.forEach((exp, i) => {
      const base = `${key}.${i}`;
      pushCandidate(out, `${base}.company`, exp.company);
      pushCandidate(out, `${base}.role`, exp.role);
      pushCandidate(out, `${base}.roleSummary`, exp.roleSummary);
      pushCandidate(out, `${base}.location`, exp.location);
      pushDate(`${base}.startDate`, exp.startDate);
      pushDate(`${base}.endDate`, exp.endDate);

      const bullets = parseDescriptionBullets(exp.description);
      bullets.forEach((b: any, j: number) => {
        const raw = String(b || '');
        const cleaned = raw.replace(/^[•·\-*]\s*/, '');
        pushCandidate(out, `${base}.description.${j}`, raw, cleaned !== raw ? cleaned : undefined);
      });
    });
  });

  // 2. Education
  (data.education || []).forEach((edu, i) => {
    pushCandidate(out, `education.${i}.school`, edu.school);
    pushCandidate(out, `education.${i}.degree`, edu.degree);
    pushCandidate(out, `education.${i}.year`, edu.year);
  });

  // 3. Certifications-like sections
  const certKeys = ['certifications', 'licenses', 'patents', 'grants', 'memberships'] as const;
  certKeys.forEach((key) => {
    const items = (data[key] as any[]) || [];
    items.forEach((cert, i) => {
      pushCandidate(out, `${key}.${i}.name`, cert.name);
      pushCandidate(out, `${key}.${i}.issuer`, cert.issuer);
      pushCandidate(out, `${key}.${i}.date`, cert.date);
    });
  });

  // 4. Projects-like sections
  const projKeys = ['projects', 'portfolio', 'caseStudies', 'selectedWork'] as const;
  projKeys.forEach((key) => {
    const items = (data[key] as any[]) || [];
    items.forEach((p, i) => {
      const base = `${key}.${i}`;
      pushCandidate(out, `${base}.name`, p.name);
      pushCandidate(out, `${base}.technologies`, p.technologies);
      pushCandidate(out, `${base}.link`, p.link);

      const bullets = parseDescriptionBullets(p.description);
      bullets.forEach((b: any, j: number) => {
        const raw = String(b || '');
        const cleaned = raw.replace(/^[•·\-*]\s*/, '');
        pushCandidate(out, `${base}.description.${j}`, raw, cleaned !== raw ? cleaned : undefined);
      });
    });
  });

  // 5. Bullet-list sections
  const bulletKeys = [
    'keyAchievements',
    'achievements',
    'awards',
    'publications',
    'conferencesSpeaking',
    'academicAchievements',
  ] as const;

  bulletKeys.forEach((key) => {
    const val = data[key as keyof ResumeData];
    const bullets = parseAchievementBullets(val as any);
    bullets.forEach((item, i) => {
      const raw = typeof item === 'string' ? item : '';
      pushCandidate(out, `${key}.${i}`, raw, raw.replace(/^[•·\-*]\s*/, ''));
    });
  });

  // 6. Additional Info
  (data.additionalInfo || []).forEach((info, i) => {
    pushCandidate(out, `additionalInfo.${i}.label`, info.label);
    pushCandidate(out, `additionalInfo.${i}.value`, info.value);
  });

  // 7. Languages
  (data.languages || []).forEach((lang, i) => {
    pushCandidate(out, `languages.${i}.language`, lang.language);
    pushCandidate(out, `languages.${i}.proficiency`, lang.proficiency);
  });

  // 8. Custom Sections
  if (data.customSections) {
    Object.entries(data.customSections).forEach(([id, custom]) => {
      pushCandidate(out, `customSections.${id}.title`, custom.title);
      if (custom.contentType === 'text') {
        pushCandidate(out, `customSections.${id}.content`, custom.content as string);
      } else if (custom.contentType === 'bullets') {
        const bullets = Array.isArray(custom.content)
          ? (custom.content as string[])
          : typeof custom.content === 'string'
          ? (custom.content as string).split('\n')
          : [];
        bullets.forEach((b, j) => {
          const raw = String(b || '');
          pushCandidate(out, `customSections.${id}.content.${j}`, raw, raw.replace(/^[•·\-*]\s*/, ''));
        });
      } else if (custom.contentType === 'key_value' && Array.isArray(custom.content)) {
        (custom.content as any[]).forEach((item, j) => {
          pushCandidate(out, `customSections.${id}.content.${j}.label`, item.label);
          pushCandidate(out, `customSections.${id}.content.${j}.value`, item.value);
        });
      }
    });
  }

  return out;
}

// ── Plain-text editing over tagged strings ────────────────────────────────────

/** Remove inline tags without collapsing whitespace (unlike normalizeText). */
export function stripInlineTags(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Apply a plain-text edit (oldPlain → newPlain) to a string that may contain
 * inline tags (e.g. "<strong>Led</strong> the launch"). Tags that fall entirely
 * outside the edited region are preserved; tags that wrap or sit inside the
 * edited region are dropped (the region is replaced with the new plain text).
 * The edit region is snapped to whole words so partial-word diffs (e.g.
 * "Led" → "Directed") don't split a styled word in half.
 */
export function applyPlainEdit(stored: string, oldPlain: string, newPlain: string): string {
  if (oldPlain === newPlain) return stored;
  const minLen = Math.min(oldPlain.length, newPlain.length);
  let pre = 0;
  while (pre < minLen && oldPlain[pre] === newPlain[pre]) pre++;
  let suf = 0;
  while (suf < minLen - pre && oldPlain[oldPlain.length - 1 - suf] === newPlain[newPlain.length - 1 - suf]) suf++;
  // Snap the region to whole-word boundaries in the OLD text.
  while (pre > 0 && !/\s/.test(oldPlain[pre - 1])) pre--;
  let b = oldPlain.length - suf;
  while (b < oldPlain.length && !/\s/.test(oldPlain[b])) b++;
  // The edited region has the same length delta as the whole strings, so the new
  // region starts at `pre` and spans (b - pre) + (newPlain.length - oldPlain.length).
  const newMiddle = newPlain.slice(pre, pre + (b - pre) + (newPlain.length - oldPlain.length));

  if (!/<[^>]+>/.test(stored)) {
    return newPlain;
  }

  // Map a plain-text offset to the corresponding raw index in the tagged string.
  const mapOffset = (plainOffset: number): number => {
    let plain = 0;
    let i = 0;
    while (i < stored.length && plain < plainOffset) {
      if (stored[i] === '<') {
        while (i < stored.length && stored[i] !== '>') i++;
        i++;
        continue;
      }
      plain++;
      i++;
    }
    return i;
  };
  const tagA = mapOffset(pre);
  const tagB = mapOffset(b);
  const region = stored.slice(tagA, tagB);

  // Drop a closing tag right after the region when its opening tag was inside it
  // (the tag pair became orphaned by the edit).
  let dropAfter = 0;
  const openTag = region.match(/<([a-z][a-z0-9]*)\b[^>]*>/i);
  if (openTag) {
    const closeRe = new RegExp(`</${openTag[1]}\s*>`, 'i');
    const after = stored.slice(tagB);
    const m = after.match(closeRe);
    if (m && m.index === 0) dropAfter = m[0].length;
  }
  // Symmetric: drop an opening tag right before the region whose closer is inside.
  let dropBefore = 0;
  if (tagA > 0) {
    const before = stored.slice(0, tagA);
    const m = before.match(/<([a-z][a-z0-9]*)\b[^>]*>$/i);
    if (m) {
      const closeRe = new RegExp(`</${m[1]}\s*>`);
      if (closeRe.test(region)) dropBefore = m[0].length;
    }
  }
  return stored.slice(0, tagA - dropBefore) + newMiddle + stored.slice(tagB + dropAfter);
}

// ── Structural-field detection ────────────────────────────────────────────────

/**
 * True when `text` exactly matches a structural (non-body-text) field — a date,
 * experience header (role, company, location), contact line, education entry,
 * skill list, etc. The resume workspace uses this to keep the selection toolbar
 * off those elements even when the highlighted words also appear in body text
 * (e.g. selecting the job title "Engineer" while a bullet also says "Engineer").
 */
export function isStructuralText(text: string, data: ResumeData): boolean {
  const ctx = text.trim();
  if (!ctx || ctx.length < 2) return false;
  const norm = normalizeText(ctx);
  for (const c of buildTextCandidates(data)) {
    if (isBodyTextField(c.path)) continue;
    if (normalizeText(c.stored) === norm) return true;
    for (const v of c.variants) {
      if (normalizeText(v) === norm) return true;
    }
  }
  return false;
}

// ── Matching ──────────────────────────────────────────────────────────────────

/** Normalized text of the DOM element that precedes the selection start. */
function beforeSelectionText(contextText: string | undefined, selOffset: number): string {
  if (!contextText || selOffset < 0) return '';
  return normalizeText(contextText.slice(0, selOffset));
}

/**
 * Find the user's exact occurrence of `needle` inside `haystack`. `haystack`
 * must be the PLAIN (tag-free) text of the field — raw stored offsets are
 * derived by the caller via the tagged-string offset map.
 *
 * When the needle occurs once, its position is returned. When it repeats, the
 * occurrence whose preceding text best matches the DOM text before the
 * selection (and whose offset is closest to the DOM selection offset) wins —
 * this is what lets "bold THIS word" land on the occurrence the user actually
 * selected, even when the same word appears twice in the field.
 */
function pickOccurrence(
  haystack: string,
  needle: string,
  beforeSel: string,
  selOffset: number,
  caseSensitive: boolean,
): { start: number; end: number } | null {
  const source = caseSensitive ? haystack : haystack.toLowerCase();
  const target = caseSensitive ? needle : needle.toLowerCase();
  if (target.length === 0) return null;
  const occs: number[] = [];
  let i = source.indexOf(target);
  while (i >= 0) {
    occs.push(i);
    i = source.indexOf(target, i + 1);
  }
  if (occs.length === 0) return null;
  if (occs.length === 1) return { start: occs[0], end: occs[0] + target.length };

  let best = occs[0];
  let bestScore = -Infinity;
  for (const start of occs) {
    let score = 0;
    if (beforeSel) {
      const preceding = normalizeText(haystack.slice(0, start));
      if (preceding.endsWith(beforeSel)) score += 1000;
    }
    if (selOffset >= 0) {
      // Penalize occurrences far from where the caret actually is. The DOM
      // strips tags (and may transform casing), so this is a soft signal only.
      score -= Math.abs(start - selOffset) / Math.max(1, haystack.length);
    }
    if (score > bestScore) {
      best = start;
      bestScore = score;
    }
  }
  return { start: best, end: best + target.length };
}

/**
 * Locate the user's selection inside ResumeData.
 *
 * `contextText` (optional) is the full rendered text of the DOM element the
 * selection lives in (e.g. the whole bullet, the summary paragraph). When a
 * candidate's rendered/stored text matches it, that field is strongly preferred —
 * this is what makes "bold this word in THIS bullet" land in the right place even
 * when the same phrase also appears in the summary.
 */
export function findBestTextMatch(
  selected: string,
  data: ResumeData,
  contextText?: string,
  options: MatchOptions = {},
): TextMatch | null {
  const sel = selected.trim();
  if (sel.length < 2) return null;
  const ctxNorm = contextText ? normalizeText(contextText) : '';
  const selOffset = options.selectionOffset ?? -1;
  const beforeSel = beforeSelectionText(contextText, selOffset);

  let best: TextMatch | null = null;
  let bestScore = -Infinity;

  for (const c of buildTextCandidates(data)) {
    if (options.bodyTextOnly && !isBodyTextField(c.path)) continue;
    let score = -Infinity;
    let start = -1;
    let end = -1;
    let via: 'stored' | 'rendered' = 'stored';

    // 1. Exact substring in the stored text (the ideal case) — occurrence-aware.
    const exact = pickOccurrence(c.stored, sel, beforeSel, selOffset, true);
    if (exact) {
      score = 10_000 - sel.length;
      start = exact.start;
      end = exact.end;
    } else {
      // 2. Case-insensitive in stored (covers title-cased names, sentence-cased job
      //    titles, lowercased contact info, title-cased skills, …).
      const ci = pickOccurrence(c.stored, sel, beforeSel, selOffset, false);
      if (ci) {
        score = 8_000 - sel.length;
        start = ci.start;
        end = ci.end;
      } else {
        // 3. Whitespace-normalized in stored (the DOM collapses runs of whitespace,
        //    so a multi-space stored field needs its whitespace collapsed to match).
        const normHaystack = c.stored.toLowerCase().replace(/\s+/g, ' ');
        const normNeedle = sel.toLowerCase().replace(/\s+/g, ' ');
        const norm = pickOccurrence(normHaystack, normNeedle, beforeSel, selOffset, true);
        if (norm) {
          score = 6_000 - sel.length;
          start = norm.start;
          end = norm.end;
        }
      }
    }

    // 4. Fields carrying inline formatting tags (<strong>, <em>, <a>, …): the DOM
    //    selection is tag-free, so it can't be a raw substring of the tagged stored
    //    text when it crosses a tag boundary ("summary highlighting" vs
    //    "<strong>summary</strong> highlighting"). Match the selection against the
    //    de-tagged text instead, mapping the found offsets back into the raw string.
    //    Whitespace-normalized matches can't map 1:1, so they edit the whole field.
    if (score < 0 && /<[^>]+>/.test(c.stored)) {
      const { plain, toRaw } = plainTextWithOffsets(c.stored);
      const plainExact = pickOccurrence(plain, sel, beforeSel, selOffset, true);
      if (plainExact) {
        score = 9_000 - sel.length;
        start = toRaw(plainExact.start);
        end = toRaw(plainExact.end);
      } else {
        const plainCi = pickOccurrence(plain, sel, beforeSel, selOffset, false);
        if (plainCi) {
          score = 7_500 - sel.length;
          start = toRaw(plainCi.start);
          end = toRaw(plainCi.end);
        } else {
          const plainNormHaystack = plain.toLowerCase().replace(/\s+/g, ' ');
          const plainNormNeedle = sel.toLowerCase().replace(/\s+/g, ' ');
          const plainNorm = pickOccurrence(plainNormHaystack, plainNormNeedle, beforeSel, selOffset, true);
          if (plainNorm) {
            score = 5_500 - sel.length;
            start = 0;
            end = c.stored.length;
          }
        }
      }
    }

    // 5. Rendered variants (formatted dates, stripped bullet markers, …). The span
    //    cannot be mapped back 1:1 into stored, so the whole field gets edited.
    if (score < 0) {
      for (const variant of c.variants.slice(1)) {
        const ri = pickOccurrence(variant, sel, '', -1, false);
        if (ri) {
          score = 5_000 - sel.length;
          start = ri.start;
          end = ri.end;
          via = 'rendered';
          break;
        }
      }
    }

    if (score < 0) continue;

    // DOM-context bonus: this candidate is the element the user actually selected.
    // Equality with the selected element's full text is the strongest signal (the
    // whole field was selected). When the context is a short leaf (a skill chip,
    // a single word inside a tag), a field that STARTS/ENDS with it is a strong
    // hint too — e.g. selecting "React" in the skills grid where the stored field
    // is "React, TypeScript, …".
    if (ctxNorm && ctxNorm.length >= 2) {
      const strippedStored = normalizeText(c.stored);
      const ctxIsLeaf = ctxNorm.length < 60;
      const equalsCtx =
        strippedStored === ctxNorm ||
        c.variants.some((v) => normalizeText(v) === ctxNorm);
      const bordersCtx =
        ctxIsLeaf &&
        (strippedStored.startsWith(ctxNorm + ' ') ||
          strippedStored.endsWith(' ' + ctxNorm) ||
          strippedStored.startsWith(ctxNorm + ',') ||
          strippedStored.endsWith(',' + ctxNorm) ||
          strippedStored.includes(' ' + ctxNorm + ' ') ||
          strippedStored.includes(' ' + ctxNorm + ',') ||
          strippedStored.includes(', ' + ctxNorm + ' '));
      if (equalsCtx) score += 100_000;
      else if (bordersCtx) score += 50_000;
    }

    if (score > bestScore) {
      best = {
        path: c.path,
        stored: c.stored,
        span: via === 'stored' ? c.stored.slice(start, end) : c.stored,
        start,
        end,
        via,
      };
      bestScore = score;
    }
  }

  return best;
}

/**
 * True when the raw stored string has the span at [start, end) wrapped EXACTLY
 * by `<tag>…</tag>` (its opening tag sits right before `start`, its closing tag
 * right after `end`).
 */
function isSpanWrappedByTag(stored: string, start: number, end: number, tag: string): boolean {
  if (start < 0 || end <= start || end > stored.length) return false;
  const before = stored.slice(0, start);
  const open = before.match(/<([a-z][a-z0-9]*)\b[^>]*>\s*$/i);
  if (!open || open[1].toLowerCase() !== tag) return false;
  const after = stored.slice(end);
  const close = after.match(/^\s*<\/([a-z][a-z0-9]*)\s*>/i);
  return !!close && close[1].toLowerCase() === tag;
}

/**
 * True when some `<tag>…</tag>` wrapper in the stored string strictly contains
 * the span at [start, end) — i.e. the selection sits INSIDE formatted text
 * (a partial word, or a word inside a bold phrase).
 */
function wrapperContainsSpan(stored: string, start: number, end: number, tag: string): boolean {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(stored))) {
    const openEnd = m.index + m[0].indexOf('>') + 1;
    const closeStart = m.index + m[0].lastIndexOf('</');
    if (openEnd <= start && end <= closeStart) return true;
  }
  return false;
}

/** Remove the `<tag>…</tag>` wrapper around the span at [start, end). */
function unwrapTagAt(stored: string, start: number, end: number, tag: string): string {
  if (start < 0 || end <= start || end > stored.length) return stored;
  const before = stored.slice(0, start);
  const open = before.match(/<([a-z][a-z0-9]*)\b[^>]*>\s*$/i);
  if (!open || open[1].toLowerCase() !== tag) return stored;
  const openStart = start - open[0].length;
  const after = stored.slice(end);
  const close = after.match(/^\s*<\/([a-z][a-z0-9]*)\s*>/i);
  if (!close || close[1].toLowerCase() !== tag) return stored;
  return stored.slice(0, openStart) + stored.slice(start, end) + stored.slice(end + close[0].length);
}

/**
 * True when the selected span is already wrapped in `tag` inside its field. The
 * check is positional (scoped to the exact occurrence the user selected), so a
 * plain second occurrence of a word whose FIRST occurrence is bolded reports
 * "not formatted" — the Bold button must not show Remove Bold for it, and
 * clicking Bold must wrap the selected occurrence, not the first one.
 */
export function isTextFormatted(
  selected: string,
  data: ResumeData,
  tag: string,
  contextText?: string,
  options: MatchOptions = {},
): boolean {
  const m = findBestTextMatch(selected, data, contextText, options);
  if (!m) return false;
  if (m.via === 'stored' && m.start >= 0 && m.end > m.start) {
    if (isSpanWrappedByTag(m.stored, m.start, m.end, tag)) return true;
    // Partial selection inside a wrapper (a word within a bold phrase).
    return wrapperContainsSpan(m.stored, m.start, m.end, tag);
  }
  const span = m.via === 'stored' ? m.span : m.stored;
  const pattern = new RegExp(
    `<${tag}\\b[^>]*>(?:[\\s\\S]*?)${escapeRegExp(span)}(?:[\\s\\S]*?)<\\/${tag}>`,
    'i',
  );
  return pattern.test(m.stored);
}

// ── Applying edits ────────────────────────────────────────────────────────────

/** Clone `data` and replace the string at a dotted path via `transform`. */
export function setTextAtPath(
  data: ResumeData,
  path: string,
  transform: (old: string) => string,
): ResumeData {
  const parts = path.split('.');
  const clone: Record<string, unknown> = { ...(data as unknown as Record<string, unknown>) };
  let cur: unknown = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = (cur as Record<string, unknown>)[key];
    const nextIsNumeric = /^\d+$/.test(parts[i + 1]);
    const clonedNext =
      next == null
        ? (nextIsNumeric ? [] : {})
        : Array.isArray(next)
          ? [...next]
          : typeof next === 'object'
            ? { ...(next as Record<string, unknown>) }
            : // Legacy string fields (newline-separated bullets) are upgraded to
              // the modern array format the first time an edit targets one of
              // their lines — assigning an index onto a string primitive would
              // throw a TypeError and silently drop the user's edit.
              nextIsNumeric && typeof next === 'string'
              ? parseDescriptionBullets(next)
              : next;
    (cur as Record<string, unknown>)[key] = clonedNext;
    cur = clonedNext;
  }
  const last = parts[parts.length - 1];
  (cur as Record<string, unknown>)[last] = transform(
    String((cur as Record<string, unknown>)[last] ?? ''),
  );
  return clone as unknown as ResumeData;
}

function unwrapTag(text: string, span: string, tag: string): string {
  const pattern = new RegExp(
    `<${tag}\\b[^>]*>([\\s\\S]*?${escapeRegExp(span)}[\\s\\S]*?)<\\/${tag}>`,
    'gi',
  );
  return text.replace(pattern, '$1');
}

/**
 * Word-style bold/italic/underline toggle: wraps the selected span in `tag`, or
 * removes the wrapping when it is already applied. Operates on the exact field the
 * selection belongs to.
 */
export function toggleInlineTag(
  data: ResumeData,
  selected: string,
  tag: string,
  contextText?: string,
  options: MatchOptions = {},
): ResumeData {
  const m = findBestTextMatch(selected, data, contextText, options);
  if (!m) return data;

  if (m.via === 'stored') {
    const span = m.span;
    // Exact wrapper around the selected occurrence: unwrap just that one, so
    // removing bold from the SECOND of two bolded words leaves the first alone.
    if (isSpanWrappedByTag(m.stored, m.start, m.end, tag)) {
      return setTextAtPath(data, m.path, (old) => unwrapTagAt(old, m.start, m.end, tag));
    }
    // Selection sits inside formatted text (partial word / nested): unwrap the
    // containing wrapper, like Word does for a partial selection.
    if (wrapperContainsSpan(m.stored, m.start, m.end, tag)) {
      return setTextAtPath(data, m.path, (old) => unwrapTag(old, span, tag));
    }
    return setTextAtPath(
      data,
      m.path,
      (old) => old.slice(0, m.start) + `<${tag}>` + span + `</${tag}>` + old.slice(m.end),
    );
  }

  // Rendered-only match (dates, LinkedIn, stripped markers): edit the whole field.
  if (isTextFormatted(selected, data, tag, contextText, options)) {
    return setTextAtPath(data, m.path, (old) =>
      old.replace(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'), '$1'),
    );
  }
  return setTextAtPath(data, m.path, (old) => `<${tag}>` + old + `</${tag}>`);
}

/** Toggle a hyperlink: wrap with `<a href>` when `url` is given, else unwrap. */
export function toggleInlineLink(
  data: ResumeData,
  selected: string,
  url: string | null,
  contextText?: string,
  options: MatchOptions = {},
): ResumeData {
  const m = findBestTextMatch(selected, data, contextText, options);
  if (!m) return data;
  const span = m.span;

  if (m.via === 'stored') {
    if (!url) {
      // Remove only the wrapper around the selected occurrence.
      if (isSpanWrappedByTag(m.stored, m.start, m.end, 'a')) {
        return setTextAtPath(data, m.path, (old) => unwrapTagAt(old, m.start, m.end, 'a'));
      }
      return setTextAtPath(data, m.path, (old) => unwrapTag(old, span, 'a'));
    }
    // Re-linking an already-linked span: swap the URL (unwrap the exact wrapper
    // first — the span itself stays at the same offsets — then re-wrap).
    if (isSpanWrappedByTag(m.stored, m.start, m.end, 'a')) {
      return setTextAtPath(
        data,
        m.path,
        (old) => {
          const un = unwrapTagAt(old, m.start, m.end, 'a');
          return un.slice(0, m.start) + `<a href="${url}">` + span + `</a>` + un.slice(m.end);
        },
      );
    }
    return setTextAtPath(
      data,
      m.path,
      (old) =>
        old.slice(0, m.start) + `<a href="${url}">` + span + `</a>` + old.slice(m.end),
    );
  }

  if (!url) {
    return setTextAtPath(data, m.path, (old) =>
      old.replace(new RegExp(`<a\\b[^>]*>([\\s\\S]*?)<\\/a>`, 'gi'), '$1'),
    );
  }
  return setTextAtPath(data, m.path, (old) => `<a href="${url}">` + old + `</a>`);
}

/** Replace the selected span with `replacement` (used by the AI inline rewrite). */
export function replaceSelectedText(
  data: ResumeData,
  selected: string,
  replacement: string,
  contextText?: string,
  options: MatchOptions = {},
): ResumeData {
  const m = findBestTextMatch(selected, data, contextText, options);
  if (!m) return data;
  if (m.via === 'stored') {
    return setTextAtPath(
      data,
      m.path,
      (old) => old.slice(0, m.start) + replacement + old.slice(m.end),
    );
  }
  return setTextAtPath(data, m.path, () => replacement);
}
