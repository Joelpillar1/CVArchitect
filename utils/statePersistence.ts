/**
 * State Persistence Utilities
 * 
 * Provides debounced and immediate localStorage persistence to prevent
 * data loss when switching between tabs/routes.
 */

// Debounce timer storage
let debounceTimers: Map<string, NodeJS.Timeout> = new Map();

/**
 * Immediately save to localStorage (synchronous)
 */
export const saveToStorage = (key: string, value: any): void => {
    try {
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (error) {
        console.error(`Failed to save to localStorage (${key}):`, error);
    }
};

/**
 * Debounced save to localStorage (for frequent updates)
 * Use this for state that changes frequently (like resumeData during typing)
 */
export const debouncedSaveToStorage = (
    key: string,
    value: any,
    delay: number = 500
): void => {
    // Clear existing timer for this key
    const existingTimer = debounceTimers.get(key);
    if (existingTimer) {
        clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
        saveToStorage(key, value);
        debounceTimers.delete(key);
    }, delay);

    debounceTimers.set(key, timer);
};

/**
 * Load from localStorage
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        
        // Try to parse as JSON, fallback to string
        try {
            return JSON.parse(item) as T;
        } catch {
            return item as T;
        }
    } catch (error) {
        console.error(`Failed to load from localStorage (${key}):`, error);
        return defaultValue;
    }
};

/**
 * Remove from localStorage
 */
export const removeFromStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Failed to remove from localStorage (${key}):`, error);
    }
};

/**
 * Save multiple items at once (immediate)
 */
export const saveMultipleToStorage = (items: Record<string, any>): void => {
    try {
        Object.entries(items).forEach(([key, value]) => {
            saveToStorage(key, value);
        });
    } catch (error) {
        console.error('Failed to save multiple items to localStorage:', error);
    }
};

/**
 * Clear all debounce timers (useful for cleanup)
 */
export const clearAllDebounceTimers = (): void => {
    debounceTimers.forEach(timer => clearTimeout(timer));
    debounceTimers.clear();
};
