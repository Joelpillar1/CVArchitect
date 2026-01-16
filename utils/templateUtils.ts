export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    if (dateString.toLowerCase() === 'present' || dateString.toLowerCase() === 'current') {
        return 'Present';
    }

    // If it's already in "Month Year" format (e.g., "Jan 2020"), just return it
    if (dateString.match(/^[A-Za-z]+\s+\d{4}$/)) {
        return dateString;
    }

    // Try to parse YYYY-MM
    if (dateString.match(/^\d{4}-\d{2}$/)) {
        try {
            const [year, month] = dateString.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
            }
        } catch (e) {
            // ignore
        }
    }

    // Try to parse YYYY-MM-DD
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }

    // Fallback: return as is
    return dateString;
};

export const parseDescriptionBullets = (description: string): string[] => {
    if (!description) return [];

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
