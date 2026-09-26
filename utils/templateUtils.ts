import React, { type CSSProperties } from 'react';
import type { ResumeData, CourseworkItem, ExpertSkillItem } from '../types';
import RichText from '../components/RichText';

/**
 * Split inline formatting tags (bold/italic/underline/link) that wrap a whole
 * value — e.g. "<strong>2021-01</strong>" — from the value itself. The inline
 * formatting toolbar stores tags inside date fields, so the date formatters
 * strip them, parse the bare text, then re-apply the tags to the formatted
 * output. Without this, "Jan 2021" would render as literal "<strong>..." text.
 */
const splitInlineTags = (value: string): { core: string; wrap: (v: string) => string } => {
    const leading: string[] = [];
    let rest = value;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const m = rest.match(/^<(strong|b|em|i|u|a)(\s[^>]*)?>/i);
        if (!m) break;
        leading.push(m[0]);
        rest = rest.slice(m[0].length);
    }
    const trailing: string[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const m = rest.match(/<\/(strong|b|em|i|u|a)>\s*$/i);
        if (!m) break;
        trailing.unshift(m[0]);
        rest = rest.slice(0, rest.length - m[0].length);
    }
    const wrap = (value: string) => leading.join('') + value + trailing.join('');
    return { core: rest, wrap };
};

export const formatDate = (dateString: string | null | undefined): string => {
    // Handle null, undefined, or empty strings
    if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
        return '';
    }

    const trimmed = dateString.trim();

    // Inline formatting tags (bold/italic/underline/link) applied by the inline
    // formatting toolbar live INSIDE date fields (e.g. "<strong>2021-01</strong>").
    // Strip them so the date still parses, remember which tags wrapped the whole
    // value, and re-apply them to the formatted output — otherwise "Jan 2021"
    // would render as literal "<strong>..." text or disappear entirely.
    const { core: trimmedCore, wrap } = splitInlineTags(trimmed);

    // Handle "Present" or "Current"
    if (trimmedCore.toLowerCase() === 'present' || trimmedCore.toLowerCase() === 'current') {
        return wrap('Present');
    }

    // Check if it's already "Invalid Date" string
    if (trimmedCore === 'Invalid Date' || trimmedCore.toLowerCase().includes('invalid')) {
        return '';
    }

    // If it's already in "Month Year" format (e.g., "Jan 2020", "January 2020"), validate and return it
    if (trimmedCore.match(/^[A-Za-z]+\s+\d{4}$/)) {
        // Validate the month name
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthName = trimmedCore.split(' ')[0].toLowerCase();
        if (monthNames.some(m => monthName.startsWith(m))) {
            return wrap(trimmedCore);
        }
    }

    // Try to parse YYYY-MM format (e.g., "2024-01")
    if (trimmedCore.match(/^\d{4}-\d{2}$/)) {
        try {
            const [year, month] = trimmedCore.split('-');
            const yearNum = parseInt(year, 10);
            const monthNum = parseInt(month, 10);
            
            // Validate month is between 1-12
            if (monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
                const date = new Date(yearNum, monthNum - 1);
                if (!isNaN(date.getTime())) {
                    const formatted = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                    // Double-check we didn't get "Invalid Date"
                    if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                        return wrap(formatted);
                    }
                }
            }
        } catch (e) {
            // ignore and continue to next format
        }
    }

    // Try to parse YYYY-MM-DD format
    if (trimmedCore.match(/^\d{4}-\d{2}-\d{2}$/)) {
        try {
            const date = new Date(trimmedCore);
            if (!isNaN(date.getTime())) {
                const formatted = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                    return wrap(formatted);
                }
            }
        } catch (e) {
            // ignore and continue
        }
    }

    // Try to parse as general date string
    try {
        const date = new Date(trimmedCore);
        if (!isNaN(date.getTime())) {
            const formatted = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
            // Check if we got "Invalid Date" string
            if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                return wrap(formatted);
            }
        }
    } catch (e) {
        // ignore
    }

    // If all parsing attempts failed, return empty string instead of showing "Invalid Date"
    return '';
};

export const formatDateRange = (startDate?: string | null, endDate?: string | null): string => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    if (end) return end;
    return '';
};

export const stripMarkdown = (text: string): string => {
    if (!text || typeof text !== 'string') return text;
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\\/g, '');
};

export const descriptionToString = (description: string | string[] | undefined | null): string => {
    if (Array.isArray(description)) {
        return description.filter(Boolean).map(stripMarkdown).join('\n');
    }
    if (!description || typeof description !== 'string') {
        return '';
    }
    return stripMarkdown(description);
};

export const parseDescriptionBullets = (description: string | string[]): string[] => {
    // Handle array format (new format).
    if (Array.isArray(description)) {
        return description.map(bullet =>
            stripMarkdown(String(bullet === null || bullet === undefined ? '' : bullet).replace(/^[•·\-*]\s*/, ''))
        );
    }

    // Handle string format (legacy format)
    if (!description || typeof description !== 'string') return [];

    const cleaned = stripMarkdown(description);

    // First, try splitting by newlines (most common)
    if (cleaned.includes('\n')) {
        return cleaned.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^[•·\-*]\s*/, '')); // Remove existing bullets
    }

    // If no newlines but contains bullet characters, split by them
    if (cleaned.includes('•')) {
        return cleaned.split('•')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    // Try splitting by " - " (dash with spaces)
    if (cleaned.includes(' - ')) {
        return cleaned.split(' - ')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    // If no separators found, return as single item
    return [cleaned.trim()];
};

/**
 * Ensures that a single bullet point string ends with a full-stop (period '.').
 * Handles existing periods, trailing whitespace, trailing punctuation (; , - :),
 * and markdown bold/italic formatting.
 */
export const ensureBulletEndsWithPeriod = (bullet: string): string => {
    if (!bullet || typeof bullet !== 'string') return '';
    const trimmed = bullet.trim();
    if (!trimmed) return '';

    // Already ends with a period or closing quotation/markdown after a period
    if (
        trimmed.endsWith('.') ||
        trimmed.endsWith('.**') ||
        trimmed.endsWith('.*') ||
        trimmed.endsWith('._') ||
        trimmed.endsWith('."') ||
        trimmed.endsWith(".'") ||
        trimmed.endsWith('.)')
    ) {
        return trimmed;
    }

    // Remove any trailing semicolon, comma, colon, or dashes at the end of the line
    const cleaned = trimmed.replace(/[,;:\-\–\—\s]+$/, '');
    if (!cleaned) return '';

    // Check again after stripping trailing punctuation
    if (
        cleaned.endsWith('.') ||
        cleaned.endsWith('.**') ||
        cleaned.endsWith('.*') ||
        cleaned.endsWith('._') ||
        cleaned.endsWith('."') ||
        cleaned.endsWith(".'") ||
        cleaned.endsWith('.)')
    ) {
        return cleaned;
    }

    return `${cleaned}.`;
};

/**
 * Processes a description field (string or string[]) so that each bullet point
 * within it ends with a full-stop ('.').
 */
export const ensureDescriptionBulletsEndWithPeriod = (
    description: string | string[]
): string | string[] => {
    if (Array.isArray(description)) {
        return description.map((bullet) => (bullet ? ensureBulletEndsWithPeriod(bullet) : ''));
    }
    if (!description || typeof description !== 'string') {
        return description;
    }

    // If string has newlines, process each line individually
    if (description.includes('\n')) {
        return description
            .split('\n')
            .map((line) => {
                const trimmed = line.trim();
                if (!trimmed) return '';
                // If line starts with bullet marker (e.g. "• ", "- ", "* ", "1. "), preserve the marker
                const match = line.match(/^(\s*(?:[•·\-*]|\d+\.)\s*)(.*)$/);
                if (match) {
                    const marker = match[1];
                    const content = match[2];
                    return content.trim() ? `${marker}${ensureBulletEndsWithPeriod(content)}` : line;
                }
                return ensureBulletEndsWithPeriod(line);
            })
            .join('\n');
    }

    // If string contains "•" without newlines
    if (description.includes('•')) {
        const parts = description.split('•');
        return parts
            .map((part, idx) => {
                if (idx === 0 && !part.trim()) return '';
                const trimmed = part.trim();
                return trimmed ? `• ${ensureBulletEndsWithPeriod(trimmed)}` : '';
            })
            .filter(Boolean)
            .join('\n');
    }

    return ensureBulletEndsWithPeriod(description);
};

/**
 * Ensures all bullet points across all resume sections (experience, projects,
 * leadership, keyAchievements, coursework, customSections, additionalInfo)
 * end with a full-stop ('.').
 */
export const formatAllResumeBullets = <T extends Partial<ResumeData>>(resume: T): T => {
    if (!resume || typeof resume !== 'object') return resume;

    const updated: T = { ...resume };

    if (Array.isArray(updated.experience)) {
        updated.experience = updated.experience.map((exp) => ({
            ...exp,
            description: exp.description ? (ensureDescriptionBulletsEndWithPeriod(exp.description) as any) : exp.description,
        }));
    }

    if (Array.isArray(updated.projects)) {
        updated.projects = updated.projects.map((proj) => ({
            ...proj,
            description: proj.description ? (ensureDescriptionBulletsEndWithPeriod(proj.description) as any) : proj.description,
        }));
    }

    if (Array.isArray(updated.leadership)) {
        updated.leadership = updated.leadership.map((lead) => ({
            ...lead,
            description: lead.description ? (ensureDescriptionBulletsEndWithPeriod(lead.description) as any) : lead.description,
        }));
    }

    if (updated.keyAchievements) {
        if (Array.isArray(updated.keyAchievements)) {
            updated.keyAchievements = updated.keyAchievements.map((b) => (b ? ensureBulletEndsWithPeriod(b) : ''));
        } else if (typeof updated.keyAchievements === 'string') {
            updated.keyAchievements = ensureDescriptionBulletsEndWithPeriod(updated.keyAchievements) as string;
        }
    }

    if (Array.isArray(updated.coursework)) {
        updated.coursework = updated.coursework.map((cw) => ({
            ...cw,
            description: cw.description ? (ensureDescriptionBulletsEndWithPeriod(cw.description) as any) : cw.description,
        }));
    }

    if (updated.awards) {
        if (Array.isArray(updated.awards)) {
            updated.awards = updated.awards.map((b) => (b ? ensureBulletEndsWithPeriod(b) : ''));
        } else if (typeof updated.awards === 'string') {
            updated.awards = ensureDescriptionBulletsEndWithPeriod(updated.awards) as string;
        }
    }

    if (updated.publications) {
        if (Array.isArray(updated.publications)) {
            updated.publications = updated.publications.map((b) => (b ? ensureBulletEndsWithPeriod(b) : ''));
        } else if (typeof updated.publications === 'string') {
            updated.publications = ensureDescriptionBulletsEndWithPeriod(updated.publications) as string;
        }
    }

    if (updated.conferencesSpeaking) {
        if (Array.isArray(updated.conferencesSpeaking)) {
            updated.conferencesSpeaking = updated.conferencesSpeaking.map((b) => (b ? ensureBulletEndsWithPeriod(b) : ''));
        } else if (typeof updated.conferencesSpeaking === 'string') {
            updated.conferencesSpeaking = ensureDescriptionBulletsEndWithPeriod(updated.conferencesSpeaking) as string;
        }
    }

    if (updated.academicAchievements) {
        if (Array.isArray(updated.academicAchievements)) {
            updated.academicAchievements = updated.academicAchievements.map((b) => (b ? ensureBulletEndsWithPeriod(b) : ''));
        } else if (typeof updated.academicAchievements === 'string') {
            updated.academicAchievements = ensureDescriptionBulletsEndWithPeriod(updated.academicAchievements) as string;
        }
    }

    if (Array.isArray(updated.additionalInfo)) {
        updated.additionalInfo = updated.additionalInfo.map((info) => ({
            ...info,
            value: info.value && (info.value.includes('•') || info.value.includes('\n'))
                ? (ensureDescriptionBulletsEndWithPeriod(info.value) as string)
                : info.value,
        }));
    }

    if (updated.customSections && typeof updated.customSections === 'object') {
        const customSecs: Record<string, any> = { ...updated.customSections };
        for (const key of Object.keys(customSecs)) {
            const sec = customSecs[key];
            if (sec && sec.contentType === 'bullets' && Array.isArray(sec.content)) {
                customSecs[key] = {
                    ...sec,
                    content: sec.content.map((b: string) => (b ? ensureBulletEndsWithPeriod(b) : '')),
                };
            }
        }
        updated.customSections = customSecs;
    }

    return updated;
};


/** Shared spacing defaults for resume templates (inches) */
export const TEMPLATE_SPACING = {
    marginHorizontal: 25 / 96,
    marginVertical: 25 / 96,
    sectionGap: 0.1,
    headerGap: 0.08,
    headerItemGap: 0.04,
    headerContactGap: 0.04,
    compact: {
        marginHorizontal: 25 / 96,
        marginVertical: 25 / 96,
        sectionGap: 0.1,
        headerGap: 0.08,
    },
} as const;

/** Standard bullet list classes — use on all templates for consistent indent */
export const BULLET_LIST_CLASS = 'list-disc list-outside ml-5 space-y-1';

export type SpacingVariant = 'default' | 'compact';

export function getMarginHorizontalIn(data: ResumeData, variant: SpacingVariant = 'default'): number {
    if (data.margins?.horizontal !== undefined) {
        const val = data.margins.horizontal;
        return val > 2 ? val / 96 : val;
    }
    return variant === 'compact' ? TEMPLATE_SPACING.compact.marginHorizontal : TEMPLATE_SPACING.marginHorizontal;
}

export function getMarginVerticalIn(data: ResumeData, variant: SpacingVariant = 'default'): number {
    if (data.margins?.vertical !== undefined) {
        const val = data.margins.vertical;
        return val > 2 ? val / 96 : val;
    }
    return variant === 'compact' ? TEMPLATE_SPACING.compact.marginVertical : TEMPLATE_SPACING.marginVertical;
}

export function getSectionGapIn(data: ResumeData, variant: SpacingVariant = 'default'): number {
    const rawGap = data.sectionGap !== undefined ? data.sectionGap : (variant === 'compact' ? TEMPLATE_SPACING.compact.sectionGap : TEMPLATE_SPACING.sectionGap);
    return Math.min(0.2, Math.max(0, rawGap));
}

export function getHeaderGapIn(data: ResumeData, variant: SpacingVariant = 'default'): number {
    // The header is the resume's top block, and the first section (Professional
    // Summary) sits directly below it. Folding the section gap in here makes the
    // summary respond to the Section Gap control like every other section — the
    // space under the header tightens/loosens with the rest of the page.
    const headerGap = data.headerGap !== undefined ? data.headerGap : (variant === 'compact' ? TEMPLATE_SPACING.compact.headerGap : TEMPLATE_SPACING.headerGap);
    return headerGap + getSectionGapIn(data, variant);
}

export function getHeaderItemGapIn(data: ResumeData): number {
    const raw = data.headerItemGap ?? TEMPLATE_SPACING.headerItemGap;
    return Math.max(0.03, raw);
}

export function getItemGapIn(data: ResumeData, minGap: number = 0.16): number {
    return Math.max(minGap, getSectionGapIn(data) * 1.15);
}

/** Square bullet used between header contact items (Sage-style) */
/**
 * Contact separator rendered as a small, perfectly-centered circle.
 * Uses em units so it scales with the surrounding font size, and
 * `bg-current` so it inherits the text color of its container.
 */
export const CONTACT_SEPARATOR = React.createElement('span', {
    style: {
        display: 'inline-block',
        width: '0.3em',
        height: '0.3em',
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        verticalAlign: 'middle',
        // nudge up slightly to sit at the optical center of the text
        position: 'relative',
        top: '-0.08em',
    } as CSSProperties,
    'aria-hidden': true,
});

export function getHeaderContactGapIn(data: ResumeData): number {
    const raw = data.headerContactGap ?? TEMPLATE_SPACING.headerContactGap;
    return Math.max(0.03, raw);
}

/**
 * Whether the job title should render before the contact line in the header.
 * When the user hasn't set a preference, each template keeps its own native
 * order via the `nativeTitleFirst` fallback.
 */
export function isTitleFirst(data: ResumeData, nativeTitleFirst: boolean): boolean {
    if (data.headerOrder === 'title-first') return true;
    if (data.headerOrder === 'contact-first') return false;
    return nativeTitleFirst;
}

export function getPagePaddingStyle(data: ResumeData, variant: SpacingVariant = 'default'): CSSProperties {
    const h = getMarginHorizontalIn(data, variant);
    const v = getMarginVerticalIn(data, variant);
    return {
        paddingLeft: `${h}in`,
        paddingRight: `${h}in`,
        paddingTop: `${v}in`,
        paddingBottom: `${v}in`,
    };
}

export function sectionMarginBottom(data: ResumeData, variant: SpacingVariant = 'default'): CSSProperties {
    return { marginBottom: `${getSectionGapIn(data, variant)}in` };
}

export function splitSkillsList(skills: string): string[] {
    if (!skills) return [];
    return skills
        .split(/[\n,\r|•]+/)
        .map((s) => s.trim().replace(/^[-*•]\s*/, ''))
        .filter(Boolean);
}

export function getSkillsColumnCount(count?: number): number {
    if (count === 2) return 2;
    if (count === 4) return 4;
    return 3;
}

export function getSkillsGridColsClass(count?: number): string {
    if (count === 2) return 'grid-cols-2';
    if (count === 4) return 'grid-cols-4';
    return 'grid-cols-3';
}

export function splitSkillsIntoColumns(skills: string, columnCount: number = 3): string[][] {
    const list = splitSkillsList(skills);
    const cols = getSkillsColumnCount(columnCount);
    const perCol = Math.ceil(list.length / cols) || 1;
    const columns: string[][] = [];
    for (let i = 0; i < cols; i++) {
        const slice = list.slice(i * perCol, (i + 1) * perCol);
        if (slice.length > 0) columns.push(slice);
    }
    return columns;
}

/**
 * Decode HTML entities in text, including legacy multi-encoded junk. Data saved by
 * an older bug can hold strings like `&amp;gt;` (a `>` that got re-escaped on every
 * write-back); decode repeatedly until stable so it resolves back to the real
 * character the user typed. Pure regex — never parses HTML, so raw `<`/`>` the
 * user typed stays untouched.
 */
function decodeEntitiesInText(text: string): string {
    const named: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
        '&#39;': "'",
        '&#x27;': "'",
        '&nbsp;': ' ',
    };
    let prev = text;
    let cur = text;
    for (let i = 0; i < 5; i++) {
        cur = prev.replace(
            /&(?:amp|lt|gt|quot|apos|nbsp|#39|#x27);/gi,
            (m) => named[m.toLowerCase()] ?? m
        );
        if (cur === prev) break;
        prev = cur;
    }
    return cur;
}

/**
 * Serialize a node back to the string that should be stored in ResumeData.
 * Text nodes are read as their DECODED characters; element nodes are rebuilt by
 * serializing their children (recursively, so entities never re-encode) and
 * wrapping them in the tag — this preserves inline bold/italic/link formatting
 * without the entity re-escaping that reading innerHTML (or outerHTML) causes.
 * A typed `&` must round-trip as `&`, never grow into `&amp;amp;amp;…`.
 */
function serializeCellNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        return decodeEntitiesInText(node.textContent ?? '');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    // Decorative bullet markers (span[data-bullet]) are layout-only — templates
    // render them for the hanging-bullet look, but they are not skill content.
    // Drop them so the stored skills string never accumulates "• Skill" junk.
    if (el.hasAttribute('data-bullet')) return '';
    // Line-break artifacts (a contentEditable inserts <br> when you delete inside
    // a cell) are editing noise, not resume content — drop them entirely so they
    // never leak into the stored skills string and render as literal text.
    if (tag === 'br') return '';
    // Some browsers wrap Enter-inserted content in <div>/<p>; keep their content,
    // just unwrap the wrapper so only the text (and formatting tags) survive.
    // <span> is also unwrapped: in this editor spans are layout-only wrappers
    // (the cell's flex-1 container, RichText's neutral wrapper) — inline
    // formatting lives in <strong>/<em>/<u>/<a>. Preserving spans would let each
    // write-back re-wrap the stored skills string in another <span> layer, and
    // RichText renders unknown tags as literal text, showing "<span>Skill</span>"
    // on the resume. Unwrapping keeps the stored string plain "Skill".
    if (tag === 'div' || tag === 'p' || tag === 'span') {
        return Array.from(el.childNodes).map(serializeCellNode).join('');
    }
    const attrs = Array.from(el.attributes)
        .map((a) => ` ${a.name}${a.value !== '' ? `="${a.value}"` : ''}`)
        .join('');
    const inner = Array.from(el.childNodes).map(serializeCellNode).join('');
    return `<${tag}${attrs}>${inner}</${tag}>`;
}

/**
 * Serialize a skills cell back to the string that should be stored in ResumeData:
 * inline tags (bold/italic/links) are preserved, text is read as the exact
 * characters the user typed. Reading innerHTML directly would HTML-encode
 * special characters (& → &amp;), and the next render would escape those again —
 * doubling the encoding on every write-back (a typed `&` became
 * `&amp;amp;amp;…` over a few edits).
 */
function decodeCellContent(cell: HTMLElement): string {
    const out = Array.from(cell.childNodes).map(serializeCellNode).join('');
    // Drop the invisible placeholder (nbsp — raw char or serialized &nbsp;
    // entity) seeded into freshly appended cells so the bullet marker always
    // renders, even while the cell is empty.
    return out
        .replace(/\u00A0/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        // Heal legacy artifacts: older builds stored literal <br> tags (left
        // behind by deleting inside a cell) as TEXT, which then rendered as
        // visible `<br></br>` in the document. They are editing noise, not
        // content — drop them from the stored string.
        .replace(/<br\s*\/?>/gi, '')
        .replace(/<\/br>/gi, '')
        // Stray bullet glyphs (•) inside a cell are typing artifacts from an
        // older caret bug that dropped keystrokes into the bullet marker — they
        // are never legitimate skill content (skills are comma-separated labels).
        .replace(/\u2022/g, '')
        .trim();
}

/**
 * Read a rendered skills grid (a `<ul data-skills-grid>` whose `<li>` cells flow
 * row-major) back into the comma-joined skills string. Cell order = DOM order =
 * visual row-major order (1 2 3 / 4 5 6 / 7 8 9), so the stored string matches
 * what the user sees. Inline tags inside cells (bold/italic/links) are preserved;
 * empty cells (appended by Enter navigation) are dropped. Returns null when the
 * sheet has no skills grid.
 */
export function readSkillsGrid(sheet: HTMLElement): string | null {
    const grid = sheet.querySelector('[data-skills-grid]');
    if (!grid) return null;
    const cells = Array.from(grid.querySelectorAll<HTMLElement>('li[data-skill-cell]'));
    const items = cells.map((cell) => {
        let html = decodeCellContent(cell);
        // Strip the outer RichText <span> wrapper (if any), keeping inner tags.
        html = html.replace(/^<span[^>]*>/i, '').replace(/<\/span>$/i, '').trim();
        return html;
    });
    return items.filter(Boolean).join(', ');
}

/**
 * Place caret in a skills grid cell.
 * If selectAllIfPlaceholder is true and the cell has placeholder text (e.g. "Skill 2"),
 * it selects the text so immediate typing replaces the placeholder cleanly.
 */
export function placeCaretInSkillCell(cell: HTMLElement, selectAllIfPlaceholder = true): void {
    let textContainer = cell.querySelector('.flex-1') as HTMLElement | null;
    if (!textContainer) {
        const spans = Array.from(cell.querySelectorAll('span')).filter((s) => !s.hasAttribute('data-bullet'));
        if (spans.length > 0) {
            textContainer = spans[spans.length - 1];
        }
    }
    const target = textContainer || cell;

    const rawText = (target.textContent || '').replace(/\u00A0/g, ' ').trim();
    const isPlaceholder = /^Skill\s*\d+$/i.test(rawText);

    const range = document.createRange();
    if (selectAllIfPlaceholder && isPlaceholder) {
        range.selectNodeContents(target);
    } else if (rawText === '' || target.textContent === '\u00A0') {
        range.selectNodeContents(target);
    } else {
        const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
        let lastText: Text | null = null;
        while (walker.nextNode()) {
            lastText = walker.currentNode as Text;
        }
        if (lastText) {
            range.setStart(lastText, lastText.data.length);
            range.collapse(true);
        } else {
            range.selectNodeContents(target);
            range.collapse(false);
        }
    }

    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
}

/**
 * Append a fresh empty skill cell with bullet marker to a skills grid.
 */
export function appendEmptySkillCell(grid: HTMLElement): HTMLElement {
    const li = document.createElement('li');
    li.setAttribute('data-skill-cell', '');

    const existingCell = grid.querySelector('li[data-skill-cell]') as HTMLElement | null;
    if (existingCell) {
        li.className = existingCell.className || 'flex items-baseline gap-2 min-w-0';
        const existingBullet = existingCell.querySelector('span[data-bullet]');
        if (existingBullet) {
            li.appendChild(existingBullet.cloneNode(true));
        } else {
            const defaultBullet = document.createElement('span');
            defaultBullet.setAttribute('data-bullet', '');
            defaultBullet.setAttribute('aria-hidden', 'true');
            defaultBullet.className = 'shrink-0 select-none pointer-events-none text-gray-700 leading-none';
            defaultBullet.textContent = '•';
            li.appendChild(defaultBullet);
        }
    } else {
        li.className = 'flex items-baseline gap-2 min-w-0';
        const defaultBullet = document.createElement('span');
        defaultBullet.setAttribute('data-bullet', '');
        defaultBullet.setAttribute('aria-hidden', 'true');
        defaultBullet.className = 'shrink-0 select-none pointer-events-none text-gray-700 leading-none';
        defaultBullet.textContent = '•';
        li.appendChild(defaultBullet);
    }

    const text = document.createElement('span');
    text.className = 'flex-1 leading-snug';
    text.textContent = '\u00A0';
    li.appendChild(text);
    grid.appendChild(li);
    return li;
}

/** Lowercase contact text for consistent header display (emails, handles) */
export function formatContactText(value: string | null | undefined): string {
    if (!value || typeof value !== 'string') return '';
    return value.trim().toLowerCase();
}

/**
 * Title-case location display for contact info (e.g. "San Francisco, CA", "London, UK", "New York, NY")
 * Capitalizes city and region names while preserving standard country and state abbreviations.
 */
export function formatLocationDisplay(value: string | null | undefined): string {
    if (!value || typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';

    const UPPERCASE_ACRONYMS = new Set([
        'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
        'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
        'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
        'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
        'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy',
        'dc', 'uk', 'us', 'usa', 'uae', 'eu', 'on', 'bc', 'ab', 'qc',
        'mb', 'sk', 'ns', 'nb', 'nl', 'pe', 'nsw', 'vic', 'qld',
        'sa', 'tas', 'act', 'nt', 'nyc', 'sf', 'gbr', 'nz'
    ]);

    return trimmed.replace(/\b([a-zA-Z]+)\b/g, (match) => {
        const lower = match.toLowerCase();
        if (UPPERCASE_ACRONYMS.has(lower)) {
            return lower.toUpperCase();
        }
        return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
    });
}

/** Title-case name display (sentence-style); respects headerCase when set */
export function formatNameDisplay(
    value: string | null | undefined,
    headerCase?: ResumeData['headerCase']
): string {
    if (!value || typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';

    switch (headerCase) {
        case 'uppercase':
            return trimmed.toUpperCase();
        case 'lowercase':
            return trimmed.toLowerCase();
        case 'capitalize':
        default:
            return trimmed
                .toLowerCase()
                .replace(/(^|[\s\-'])(\w)/g, (_, sep, ch) => sep + ch.toUpperCase());
    }
}

/** Small words kept lowercase in Title Case (Chicago-style). */
const TITLE_CASE_SMALL_WORDS = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'via', 'vs', 'with',
]);

/**
 * Format a section title according to the section-header casing setting.
 * - 'uppercase'  → ALL CAPS
 * - 'capitalize' → Every Word Capitalized
 * - 'titlecase'  → Title Case (small words like "of"/"and"/"the" stay lowercase)
 * - anything else → title returned as-is
 */
export function formatSectionTitle(
    title: string | null | undefined,
    sectionHeaderCase?: ResumeData['sectionHeaderCase']
): string {
    if (!title) return '';
    const trimmed = title.trim();
    if (!trimmed) return '';
    switch (sectionHeaderCase) {
        case 'uppercase':
            return trimmed.toUpperCase();
        case 'capitalize':
            return trimmed
                .toLowerCase()
                .replace(/(^|[\s\-'])(\w)/g, (_, sep, ch) => sep + ch.toUpperCase());
        case 'titlecase': {
            const words = trimmed.toLowerCase().split(/(\s+)/);
            return words
                .map((w, i) => {
                    if (!w.trim()) return w;
                    const bare = w.toLowerCase().replace(/[^a-z]/g, '');
                    const isSmall = TITLE_CASE_SMALL_WORDS.has(bare);
                    const first = i === 0;
                    const last = i === words.length - 1;
                    if (first || last || !isSmall) {
                        // Capitalize the first letter of the word and any letter after a hyphen (e.g. "Expert-Level").
                        return w.replace(/(^|[-\s'])(\w)/g, (_, sep, ch) => sep + ch.toUpperCase());
                    }
                    return w;
                })
                .join('');
        }
        default:
            // No setting (legacy data) keeps the classic all-caps section titles.
            return trimmed.toUpperCase();
    }
}

/** Job title display: Uppercase or Sentence case. Defaults to sentence case. */
export function formatJobTitleDisplay(
    value: string | null | undefined,
    jobTitleCase?: ResumeData['jobTitleCase']
): string {
    if (!value || typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (jobTitleCase === 'uppercase') return trimmed.toUpperCase();
    
    // Sentence/Title Case: capitalize each word cleanly
    return trimmed.replace(/\b\w+/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
}

/** Compact LinkedIn label: in/username */
export function formatLinkedInDisplay(linkedin: string | null | undefined): string {
    if (!linkedin || typeof linkedin !== 'string') return '';
    let s = linkedin.trim().toLowerCase();
    s = s.replace(/^https?:\/\//, '');
    s = s.replace(/^www\./, '');
    s = s.replace(/^linkedin\.com\//, '');
    const inMatch = s.match(/(?:^|\/)in\/([^/?#\s]+)/);
    if (inMatch) return `in/${inMatch[1]}`;
    if (s.startsWith('in/')) return s.split('?')[0].split('#')[0];
    if (s && !s.includes('/')) return `in/${s}`;
    return s.split('?')[0].split('#')[0];
}

/** Full LinkedIn URL for href attributes */
export function getLinkedInHref(linkedin: string | null | undefined): string {
    const display = formatLinkedInDisplay(linkedin);
    if (!display) return '';
    return normalizeUrl(`linkedin.com/${display}`);
}

// Alias for achievements (same logic as descriptions)
export const parseAchievementBullets = parseDescriptionBullets;

/** Canonical section IDs used by template renderSection switches */
export const normalizeSectionId = (id: string): string => {
    if (id === 'keyAchievements') return 'achievements';
    return id;
};

/** Deduplicated section order with alias normalization (e.g. keyAchievements → achievements) */
export const getNormalizedSectionOrder = (
    sectionOrder?: string[] | null,
    fallback: string[] = []
): string[] => {
    const order = sectionOrder?.length ? sectionOrder : fallback;
    return Array.from(new Set(order.map(normalizeSectionId)));
};

/**
 * Format date to month year format with different month styles
 * @param dateString - Date string in various formats
 * @param monthStyle - 'short' for "Jan 2024" or 'long' for "January 2024"
 * @returns Formatted date string or empty string if invalid
 */
export const formatMonthYear = (dateString: string | null | undefined, monthStyle: 'short' | 'long' = 'short'): string => {
    // Handle null, undefined, or empty strings
    if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
        return '';
    }

    const trimmed = dateString.trim();

    // Handle "Present" or "Current"
    if (trimmed.toLowerCase() === 'present' || trimmed.toLowerCase() === 'current') {
        return 'Present';
    }

    // Check if it's already "Invalid Date" string
    if (trimmed === 'Invalid Date' || trimmed.toLowerCase().includes('invalid')) {
        return '';
    }

    const { core: trimmedCore, wrap } = splitInlineTags(trimmed);

    // If it's already in "Month Year" format, validate and return it
    if (trimmedCore.match(/^[A-Za-z]+\s+\d{4}$/)) {
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthName = trimmedCore.split(' ')[0].toLowerCase();
        if (monthNames.some(m => monthName.startsWith(m))) {
            return wrap(trimmedCore);
        }
    }

    // Try to parse YYYY-MM format (e.g., "2024-01")
    if (trimmedCore.match(/^\d{4}-\d{2}$/)) {
        try {
            const [year, month] = trimmedCore.split('-');
            const yearNum = parseInt(year, 10);
            const monthNum = parseInt(month, 10);
            
            // Validate month is between 1-12
            if (monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
                const date = new Date(yearNum, monthNum - 1);
                if (!isNaN(date.getTime())) {
                    const formatted = date.toLocaleString('en-US', { 
                        month: monthStyle, 
                        year: 'numeric' 
                    });
                    // Double-check we didn't get "Invalid Date"
                    if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                        return wrap(formatted);
                    }
                }
            }
        } catch (e) {
            // ignore and continue to next format
        }
    }

    // Try to parse YYYY-MM-DD format
    if (trimmedCore.match(/^\d{4}-\d{2}-\d{2}$/)) {
        try {
            const date = new Date(trimmedCore);
            if (!isNaN(date.getTime())) {
                const formatted = date.toLocaleString('en-US', { 
                    month: monthStyle, 
                    year: 'numeric' 
                });
                if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                    return wrap(formatted);
                }
            }
        } catch (e) {
            // ignore and continue
        }
    }

    // Try to parse as general date string
    try {
        const date = new Date(trimmedCore);
        if (!isNaN(date.getTime())) {
            const formatted = date.toLocaleString('en-US', { 
                month: monthStyle, 
                year: 'numeric' 
            });
            // Check if we got "Invalid Date" string
            if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                return wrap(formatted);
            }
        }
    } catch (e) {
        // ignore
    }

    // If all parsing attempts failed, return empty string instead of showing "Invalid Date"
    return '';
};

/**
 * Normalize URL to ensure it's clickable in PDF
 * Adds http:// or https:// if missing, and ensures proper format
 * @param url - URL string (may be partial or full)
 * @returns Normalized URL with protocol
 */
export const normalizeUrl = (url: string | null | undefined): string => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return '';
    }
    
    const trimmed = url.trim();
    
    // If already has protocol, return as is
    if (trimmed.match(/^https?:\/\//i)) {
        return trimmed;
    }
    
    // If starts with mailto:, return as is
    if (trimmed.toLowerCase().startsWith('mailto:')) {
        return trimmed;
    }
    
    // If it's an email address, add mailto:
    if (trimmed.includes('@') && trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return `mailto:${trimmed}`;
    }
    
    // For LinkedIn and other domains, add https://
    // Check if it looks like a domain (contains a dot and no spaces)
    if (trimmed.includes('.') && !trimmed.includes(' ')) {
        return `https://${trimmed}`;
    }
    
    // Otherwise, assume it's a relative URL or invalid, return as is
    return trimmed;
};

/**
 * Standard Coursework section renderer helper across resume templates.
 * Matches the dedicated Coursework format:
 * 1. Course Name (bold / accent)
 * 2. Institution • Year • Skills (joined with • separators)
 * 3. Applied description bullet points
 */
export function renderCourseworkBlockHelper({
  data,
  title,
  items,
  basePath = 'coursework',
  renderSectionHeader,
  renderTextBlock,
  bodyStyle,
  accentColor,
}: {
  data: ResumeData;
  title: string;
  items: CourseworkItem[] | string;
  basePath?: string;
  renderSectionHeader: (title: string) => React.ReactNode;
  renderTextBlock?: (title: string, text: string, path?: string) => React.ReactNode;
  bodyStyle?: React.CSSProperties;
  accentColor?: string;
}): React.ReactNode {
  if (!items) return null;
  if (typeof items === 'string') {
    if (!items.trim()) return null;
    return renderTextBlock ? renderTextBlock(title, items, basePath) : null;
  }
  if (!Array.isArray(items) || items.length === 0) return null;

  const validItems = items.filter(
    (c) => c?.courseName?.trim() || c?.institution?.trim() || c?.skills?.trim() || c?.description
  );
  if (validItems.length === 0) return null;

  const itemGap = `${Math.max(0.14, getSectionGapIn(data) * 1.15)}in`;
  const defaultAccent = accentColor || data.accentColor || '#000000';
  const defaultBodyStyle: React.CSSProperties = bodyStyle || {
    fontSize: `${data.fontSizes?.body || 8.5}pt`,
    lineHeight: data.lineHeight || 1.5,
  };

  return React.createElement(
    'section',
    { style: { marginBottom: `${getSectionGapIn(data)}in` } },
    renderSectionHeader(title),
    validItems.map((item, index) => {
      const bullets = parseDescriptionBullets(item.description || '');
      const children: React.ReactNode[] = [];

      // 1. Top Header Row (Course Name + Institution on the left, Year on the right)
      const leftParts: React.ReactNode[] = [];
      if (item.courseName?.trim()) {
        leftParts.push(
          React.createElement(
            'span',
            {
              key: 'courseName',
              'data-path': `${basePath}.${index}.courseName`,
              className: 'font-bold leading-snug text-gray-800',
              style: {
                color: defaultAccent,
                fontSize: `${(data.fontSizes?.body || 8.5) * 1.05}pt`,
              },
            },
            React.createElement(RichText, { text: item.courseName })
          )
        );
      }
      if (item.institution?.trim()) {
        leftParts.push(
          React.createElement(
            'span',
            {
              key: 'institution',
              className: 'font-normal italic text-gray-700 ml-1.5',
              style: defaultBodyStyle,
            },
            item.courseName?.trim() ? ' — ' : '',
            React.createElement(
              'span',
              { 'data-path': `${basePath}.${index}.institution` },
              React.createElement(RichText, { text: item.institution })
            )
          )
        );
      }

      const headerRow = React.createElement(
        'div',
        {
          key: 'header',
          className: 'flex justify-between items-baseline mb-0.5',
        },
        React.createElement('div', { className: 'flex flex-wrap items-baseline' }, leftParts),
        item.year?.trim()
          ? React.createElement(
              'div',
              {
                key: 'year',
                'data-path': `${basePath}.${index}.year`,
                className: 'text-right whitespace-nowrap text-gray-600 pl-2 font-normal',
                style: defaultBodyStyle,
              },
              React.createElement(RichText, { text: item.year })
            )
          : null
      );
      children.push(headerRow);

      // 2. Skills Covered (Dedicated leading row)
      if (item.skills?.trim()) {
        children.push(
          React.createElement(
            'div',
            {
              key: 'skills',
              className: 'text-gray-700 mb-1 leading-snug',
              style: defaultBodyStyle,
            },
            React.createElement('span', { className: 'font-semibold text-gray-800' }, 'Skills Covered: '),
            React.createElement(
              'span',
              { 'data-path': `${basePath}.${index}.skills` },
              React.createElement(RichText, { text: item.skills })
            )
          )
        );
      }

      // 3. Applied Bullets
      if (bullets.length > 0) {
        children.push(
          React.createElement(
            'ul',
            {
              key: 'bullets',
              className: 'list-disc list-outside ml-5 space-y-1 text-gray-800',
              style: defaultBodyStyle,
            },
            bullets.map((line, i) =>
              React.createElement(
                'li',
                {
                  key: i,
                  'data-path': `${basePath}.${index}.description.${i}`,
                },
                React.createElement(RichText, { text: line ? line.replace(/^[•-]\s*/, '') : '' })
              )
            )
          )
        );
      }

      return React.createElement(
        'div',
        {
          key: item.id || index,
          className: 'w-full break-inside-avoid',
          style: { marginBottom: index === validItems.length - 1 ? 0 : itemGap },
        },
        children
      );
    })
  );
}

/** Helper to get text alignment class for full name / header */
export function getHeaderAlignmentClass(align?: 'left' | 'center' | 'right'): string {
  if (align === 'left') return 'text-left';
  if (align === 'right') return 'text-right';
  return 'text-center';
}

/** Helper to get text alignment class for professional / job title */
export function getJobTitleAlignmentClass(
  titleAlign?: 'left' | 'center' | 'right',
  headerAlign?: 'left' | 'center' | 'right'
): string {
  const align = titleAlign || headerAlign || 'center';
  if (align === 'left') return 'text-left';
  if (align === 'right') return 'text-right';
  return 'text-center';
}

/** Helper to get flex/text alignment class for contact items */
export function getContactAlignmentClass(
  contactAlign?: 'left' | 'center' | 'right',
  headerAlign?: 'left' | 'center' | 'right'
): string {
  const align = contactAlign || headerAlign || 'center';
  if (align === 'left') return 'justify-start text-left';
  if (align === 'right') return 'justify-end text-right';
  return 'justify-center text-center';
}

/** Helper to get text alignment class for section headers (Experience, Education, Projects, etc.) */
export function getSectionHeaderAlignmentClass(
  bodyAlign?: 'left' | 'center' | 'right',
  aliasAlign?: 'left' | 'center' | 'right'
): string {
  const align = bodyAlign || aliasAlign || 'left';
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

/**
 * Parses raw or structured expert skill items into normalized ExpertSkillItem objects.
 * Handles:
 * - ExpertSkillItem[]
 * - Multi-line strings with "Category: skills" or pipe-separated values
 */
export function parseExpertSkillItems(items: ExpertSkillItem[] | string | undefined | null): ExpertSkillItem[] {
  if (!items) return [];
  if (Array.isArray(items)) {
    return items.filter(
      (item) => item && (Boolean(item.category?.trim()) || Boolean(item.skills?.trim()))
    );
  }
  if (typeof items === 'string') {
    const lines = items.split('\n').map((l) => l.trim()).filter(Boolean);
    return lines.map((line, idx) => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        return {
          id: `item-${idx + 1}`,
          category: line.slice(0, colonIdx).trim(),
          skills: line.slice(colonIdx + 1).trim(),
        };
      }
      return {
        id: `item-${idx + 1}`,
        category: '',
        skills: line,
      };
    });
  }
  return [];
}

export interface RenderExpertSkillsBlockHelperProps {
  data: ResumeData;
  title: string;
  items: ExpertSkillItem[] | string;
  basePath?: string;
  renderSectionHeader: (title: string) => React.ReactNode;
  renderTextBlock?: (title: string, text: string, path?: string) => React.ReactNode;
  bodyStyle?: React.CSSProperties;
  accentColor?: string;
}

/**
 * Standard Expert-Level Skills section renderer helper across all resume templates.
 * Matches the reference format:
 *   [Category in Bold]: [Skills List in normal body style]
 * e.g.
 *   Leadership: Speaking, Fundraising, Product Development, Communication, Partnerships
 *   Front End: HTML, CSS, Bootstrap, Webflow | Design: Photoshop, Illustrator, Sketch
 */
export function renderExpertSkillsBlockHelper({
  data,
  title,
  items,
  basePath = 'expertSkills',
  renderSectionHeader,
  bodyStyle,
}: RenderExpertSkillsBlockHelperProps): React.ReactNode {
  const parsedItems = parseExpertSkillItems(items);
  if (parsedItems.length === 0) return null;

  const defaultBodyStyle: React.CSSProperties = bodyStyle || {
    fontSize: `${data.fontSizes?.body || 9}pt`,
    lineHeight: data.lineHeight || 1.5,
  };

  return React.createElement(
    'section',
    {
      className: 'break-inside-avoid',
      style: { marginBottom: `${getSectionGapIn(data)}in` },
    },
    renderSectionHeader(title),
    React.createElement(
      'div',
      {
        className: 'space-y-1 text-gray-800',
        style: defaultBodyStyle,
      },
      parsedItems.map((item, index) => {
        const hasCategory = Boolean(item.category?.trim());
        return React.createElement(
          'div',
          {
            key: item.id || index,
            className: 'leading-relaxed',
          },
          hasCategory
            ? [
                React.createElement(
                  'span',
                  {
                    key: 'cat',
                    'data-path': `${basePath}.${index}.category`,
                    className: 'font-bold text-gray-900',
                  },
                  React.createElement(RichText, { text: item.category.trim() }),
                  item.category.trim().endsWith(':') ? ' ' : ': '
                ),
                React.createElement(
                  'span',
                  {
                    key: 'skills',
                    'data-path': `${basePath}.${index}.skills`,
                  },
                  React.createElement(RichText, { text: item.skills ?? '' })
                ),
              ]
            : React.createElement(
                'span',
                {
                  key: 'skills',
                  'data-path': `${basePath}.${index}.skills`,
                },
                React.createElement(RichText, { text: item.skills ?? '' })
              )
        );
      })
    )
  );
}


