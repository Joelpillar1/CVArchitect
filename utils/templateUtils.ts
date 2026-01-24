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

// Alias for achievements (same logic as descriptions)
export const parseAchievementBullets = parseDescriptionBullets;

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
