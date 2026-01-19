/**
 * Utility function to get description bullets from either string or array format
 * Supports backward compatibility with legacy string-based descriptions
 */
export function getDescriptionBullets(description: string | string[]): string[] {
    if (Array.isArray(description)) {
        return description.filter(bullet => bullet && bullet.trim());
    }

    if (typeof description === 'string' && description.trim()) {
        return description
            .split('\n')
            .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
            .filter(line => line);
    }

    return [];
}

/**
 * Parse description bullets and clean them up
 * Legacy function for backward compatibility
 */
export function parseDescriptionBullets(description: string | string[]): string[] {
    return getDescriptionBullets(description);
}
