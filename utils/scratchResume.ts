import { Experience, ResumeData, TemplateType } from '../types';
import { getTemplatePreviewData } from './sampleResumeData';

/**
 * Builds the data for a resume created "from scratch" in the onboarding modal.
 *
 * A new resume opens with the chosen template's OWN preview content (the same
 * data the template gallery renders), so the editor shows the design
 * immediately instead of a blank page. The onboarding answers then
 * personalize the header:
 *   - Name          → fullName (the demo identity is replaced entirely)
 *   - Contact       → smart-parsed into email / phone / LinkedIn / GitHub /
 *                     portfolio / @handle / location
 *   - Target Role   → jobTitle, but ONLY for templates that render a
 *                     professional-title line (never gaurav, minimalist,
 *                     rezi or scholar)
 *   - Experience    → shapes the demo work history: how many roles are kept
 *                     and how far back the timeline starts
 *
 * Everything else (summary, skills, education, projects, certifications)
 * stays as demo content for the user to edit over — the app's demo-data
 * detection treats it as placeholder until they do.
 */

/**
 * Template ids whose headers never render a professional-title line
 * (verified per template: these files contain no jobTitle rendering).
 */
export const TEMPLATES_WITHOUT_JOB_TITLE: TemplateType[] = ['gaurav', 'minimalist', 'rezi', 'scholar', 'modern', 'dev'];

export function templateShowsJobTitle(template: TemplateType): boolean {
    return !TEMPLATES_WITHOUT_JOB_TITLE.includes(template);
}

export interface ScratchContactFields {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    atHandle?: string;
    location?: string;
}

/**
 * Splits a free-form "Contact" string (comma / semicolon / pipe / newline
 * separated) into typed contact fields:
 *   - linkedin.com/... → linkedin    - github.com/...   → github
 *   - anything@x.y     → email       - digit-heavy      → phone
 *   - @handle          → atHandle    - other hostname   → portfolio
 *   - leftovers        → location (joined with commas)
 */
export function parseContactInput(contact: string): ScratchContactFields {
    const result: ScratchContactFields = {};
    if (!contact || !contact.trim()) return result;

    const leftover: string[] = [];

    for (const rawToken of contact.split(/[,;|\n]+/)) {
        const token = rawToken.trim();
        if (!token) continue;

        const cleaned = token.replace(/^https?:\/\//i, '').replace(/\/+$/, '');

        if (/linkedin\.com/i.test(cleaned)) {
            result.linkedin = cleaned;
        } else if (/github\.com/i.test(cleaned)) {
            result.github = cleaned;
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
            result.email = cleaned;
        } else if (/^[+\d][\d\s().-]+$/.test(cleaned) && (cleaned.match(/\d/g) || []).length >= 7) {
            result.phone = cleaned;
        } else if (/^@[A-Za-z0-9_.-]+$/.test(cleaned)) {
            result.atHandle = cleaned.slice(1);
        } else if (/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+(\/\S*)?$/.test(cleaned)) {
            result.portfolio = cleaned;
        } else {
            leftover.push(token);
        }
    }

    if (leftover.length > 0) result.location = leftover.join(', ');
    return result;
}

/** How many demo roles to keep per experience level (null = keep all). */
const EXPERIENCE_KEEP_COUNT: Record<string, number | null> = {
    entry: 1,
    mid: 2,
    senior: 3,
    executive: null,
};

/** How far back the oldest kept role should start, in years. */
const EXPERIENCE_SPAN_YEARS: Record<string, number> = {
    entry: 1,
    mid: 4,
    senior: 6,
    executive: 9,
};

function getYear(value?: string): number | null {
    const match = value?.match(/\b(19|20)\d{2}\b/);
    return match ? Number(match[0]) : null;
}

function withStartYear(entry: Experience, year: number): Experience {
    if (!entry.startDate) return entry;
    return { ...entry, startDate: entry.startDate.replace(/\b(19|20)\d{2}\b/, String(year)) };
}

/**
 * Shapes a (newest-first) experience list to the chosen level: trims it to
 * the level's role count and retracts the oldest kept role's start year so
 * the timeline plausibly spans that level's typical years of experience.
 * Never mutates the input.
 */
export function applyExperienceLevel(experience: Experience[], level?: string): Experience[] {
    if (!Array.isArray(experience) || experience.length === 0) return Array.isArray(experience) ? experience : [];

    const keep = EXPERIENCE_KEEP_COUNT[level ?? ''] ?? null;
    const trimmed = keep === null ? [...experience] : experience.slice(0, Math.max(1, keep));
    if (trimmed.length === 0) return trimmed;

    const span = EXPERIENCE_SPAN_YEARS[level ?? ''];
    if (!span) return trimmed;

    const oldest = trimmed[trimmed.length - 1];
    const originalStart = getYear(oldest.startDate);
    if (originalStart === null) return trimmed;

    let target = new Date().getFullYear() - span;

    // Keep newest-first ordering: never start after the entry listed above it…
    if (trimmed.length >= 2) {
        const aboveStart = getYear(trimmed[trimmed.length - 2].startDate);
        if (aboveStart !== null) target = Math.min(target, aboveStart - 1);
    }
    // …nor after this entry's own end year.
    const end = getYear(oldest.endDate);
    if (end !== null) target = Math.min(target, end - 1);

    if (target === originalStart) return trimmed;
    trimmed[trimmed.length - 1] = withStartYear(oldest, target);
    return trimmed;
}

export interface ScratchResumeOptions {
    template: TemplateType;
    /** "Full Name" from onboarding. */
    name?: string;
    /** "Contact" free text from onboarding (see parseContactInput). */
    contact?: string;
    /** "Target Role" from onboarding. */
    jobTitle?: string;
    /** "Experience Level" from onboarding: entry | mid | senior | executive. */
    experienceLevel?: string;
}

export function buildScratchResumeData(options: ScratchResumeOptions): ResumeData {
    const preview = getTemplatePreviewData(options.template);
    // Deep clone: preview datasets are shared module-level objects also
    // rendered by the template gallery — never mutate them in place.
    const data: ResumeData = JSON.parse(JSON.stringify(preview)) as ResumeData;

    data.template = options.template;
    data.source = 'scratch';
    // Demo scaffolding must not leak into the user's own resume.
    data.currentTag = '';
    data.resumeTitle = '';
    data.jobDescription = '';
    data.hasJobMatchRun = false;

    const name = options.name?.trim();
    const parsedContact = parseContactInput(options.contact ?? '');

    if (name) data.fullName = name;

    if (name || options.contact?.trim()) {
        // Replacing the demo identity: drop every demo contact field so the
        // header never mixes the sample person's details with the user's.
        data.email = '';
        data.phone = '';
        data.linkedin = '';
        data.github = '';
        data.portfolio = '';
        data.atHandle = '';
        data.location = '';
        data.address = '';
        Object.assign(data, parsedContact);
    }

    // Templates without a professional-title line (gaurav, minimalist, rezi,
    // scholar) never display it — don't inject one into their data either.
    const jobTitle = options.jobTitle?.trim();
    if (jobTitle && templateShowsJobTitle(options.template)) {
        data.jobTitle = jobTitle;
    }

    data.experience = applyExperienceLevel(data.experience, options.experienceLevel);

    return data;
}
