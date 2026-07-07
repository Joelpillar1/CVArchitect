import React, { type CSSProperties } from 'react';
import type { ResumeData } from '../types';

export const formatDate = (dateString: string | null | undefined): string => {
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

    // If it's already in "Month Year" format (e.g., "Jan 2020", "January 2020"), validate and return it
    if (trimmed.match(/^[A-Za-z]+\s+\d{4}$/)) {
        // Validate the month name
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthName = trimmed.split(' ')[0].toLowerCase();
        if (monthNames.some(m => monthName.startsWith(m))) {
            return trimmed;
        }
    }

    // Try to parse YYYY-MM format (e.g., "2024-01")
    if (trimmed.match(/^\d{4}-\d{2}$/)) {
        try {
            const [year, month] = trimmed.split('-');
            const yearNum = parseInt(year, 10);
            const monthNum = parseInt(month, 10);
            
            // Validate month is between 1-12
            if (monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
                const date = new Date(yearNum, monthNum - 1);
                if (!isNaN(date.getTime())) {
                    const formatted = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                    // Double-check we didn't get "Invalid Date"
                    if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                        return formatted;
                    }
                }
            }
        } catch (e) {
            // ignore and continue to next format
        }
    }

    // Try to parse YYYY-MM-DD format
    if (trimmed.match(/^\d{4}-\d{2}-\d{2}$/)) {
        try {
            const date = new Date(trimmed);
            if (!isNaN(date.getTime())) {
                const formatted = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                    return formatted;
                }
            }
        } catch (e) {
            // ignore and continue
        }
    }

    // Try to parse as general date string
    try {
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) {
            const formatted = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
            // Check if we got "Invalid Date" string
            if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                return formatted;
            }
        }
    } catch (e) {
        // ignore
    }

    // If all parsing attempts failed, return empty string instead of showing "Invalid Date"
    return '';
};

export const descriptionToString = (description: string | string[] | undefined | null): string => {
    if (Array.isArray(description)) {
        return description.filter(Boolean).join('\n');
    }
    if (!description || typeof description !== 'string') {
        return '';
    }
    return description;
};

export const parseDescriptionBullets = (description: string | string[]): string[] => {
    // Handle array format (new format)
    if (Array.isArray(description)) {
        return description.filter(bullet => bullet && bullet.trim());
    }

    // Handle string format (legacy format)
    if (!description || typeof description !== 'string') return [];

    // First, try splitting by newlines (most common)
    if (description.includes('\n')) {
        return description.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^[•·\-*]\s*/, '')); // Remove existing bullets
    }

    // If no newlines but contains bullet characters, split by them
    if (description.includes('•')) {
        return description.split('•')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    // Try splitting by " - " (dash with spaces)
    if (description.includes(' - ')) {
        return description.split(' - ')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    // Try splitting by asterisks
    if (description.includes('*')) {
        return description.split('*')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    // If no separators found, return as single item
    return [description.trim()];
};

/** Shared spacing defaults for resume templates (inches) */
export const TEMPLATE_SPACING = {
    marginHorizontal: 0.5,
    marginVertical: 0.5,
    sectionGap: 0.16,
    headerGap: 0.08,
    headerItemGap: 0.01,
    headerContactGap: 0.02,
    compact: {
        marginHorizontal: 0.35,
        marginVertical: 0.35,
        sectionGap: 0.10,
        headerGap: 0.08,
    },
} as const;

/** Standard bullet list classes — use on all templates for consistent indent */
export const BULLET_LIST_CLASS = 'list-disc list-outside ml-5 space-y-1';

export type SpacingVariant = 'default' | 'compact';

export function getMarginHorizontalIn(data: ResumeData, variant: SpacingVariant = 'default'): number {
    if (data.margins?.horizontal !== undefined) return data.margins.horizontal;
    return variant === 'compact' ? TEMPLATE_SPACING.compact.marginHorizontal : TEMPLATE_SPACING.marginHorizontal;
}

export function getMarginVerticalIn(data: ResumeData, variant: SpacingVariant = 'default'): number {
    if (data.margins?.vertical !== undefined) return data.margins.vertical;
    return variant === 'compact' ? TEMPLATE_SPACING.compact.marginVertical : TEMPLATE_SPACING.marginVertical;
}

export function getSectionGapIn(data: ResumeData, variant: SpacingVariant = 'default'): number {
    if (data.sectionGap !== undefined) return data.sectionGap;
    return variant === 'compact' ? TEMPLATE_SPACING.compact.sectionGap : TEMPLATE_SPACING.sectionGap;
}

export function getHeaderGapIn(data: ResumeData, variant: SpacingVariant = 'default'): number {
    if (data.headerGap !== undefined) return data.headerGap;
    return variant === 'compact' ? TEMPLATE_SPACING.compact.headerGap : TEMPLATE_SPACING.headerGap;
}

export function getHeaderItemGapIn(data: ResumeData): number {
    return data.headerItemGap ?? TEMPLATE_SPACING.headerItemGap;
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
    return data.headerContactGap ?? TEMPLATE_SPACING.headerContactGap;
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
    return skills.split(',').map((s) => s.trim()).filter(Boolean);
}

export function splitSkillsIntoColumns(skills: string, columnCount: number = 3): string[][] {
    const list = splitSkillsList(skills);
    const cols = columnCount === 2 ? 2 : 3;
    const perCol = Math.ceil(list.length / cols) || 1;
    const columns: string[][] = [];
    for (let i = 0; i < cols; i++) {
        const slice = list.slice(i * perCol, (i + 1) * perCol);
        if (slice.length > 0) columns.push(slice);
    }
    return columns;
}

/** Lowercase contact text for consistent header display */
export function formatContactText(value: string | null | undefined): string {
    if (!value || typeof value !== 'string') return '';
    return value.trim().toLowerCase();
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

/** Job title display: Uppercase or Sentence case. Defaults to sentence case. */
export function formatJobTitleDisplay(
    value: string | null | undefined,
    jobTitleCase?: ResumeData['jobTitleCase']
): string {
    if (!value || typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (jobTitleCase === 'uppercase') return trimmed.toUpperCase();
    // Sentence case: first letter capitalized, the rest lowercased.
    const lower = trimmed.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
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

    // If it's already in "Month Year" format, validate and return it
    if (trimmed.match(/^[A-Za-z]+\s+\d{4}$/)) {
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthName = trimmed.split(' ')[0].toLowerCase();
        if (monthNames.some(m => monthName.startsWith(m))) {
            return trimmed;
        }
    }

    // Try to parse YYYY-MM format (e.g., "2024-01")
    if (trimmed.match(/^\d{4}-\d{2}$/)) {
        try {
            const [year, month] = trimmed.split('-');
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
                        return formatted;
                    }
                }
            }
        } catch (e) {
            // ignore and continue to next format
        }
    }

    // Try to parse YYYY-MM-DD format
    if (trimmed.match(/^\d{4}-\d{2}-\d{2}$/)) {
        try {
            const date = new Date(trimmed);
            if (!isNaN(date.getTime())) {
                const formatted = date.toLocaleString('en-US', { 
                    month: monthStyle, 
                    year: 'numeric' 
                });
                if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                    return formatted;
                }
            }
        } catch (e) {
            // ignore and continue
        }
    }

    // Try to parse as general date string
    try {
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) {
            const formatted = date.toLocaleString('en-US', { 
                month: monthStyle, 
                year: 'numeric' 
            });
            // Check if we got "Invalid Date" string
            if (formatted && formatted !== 'Invalid Date' && !formatted.toLowerCase().includes('invalid')) {
                return formatted;
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
