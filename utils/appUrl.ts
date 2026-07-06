/** Browser origin for redirects (localhost in dev, production in prod). */
export function getAppOrigin(): string {
    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin.replace(/\/$/, '');
    }

    const envOrigin = import.meta.env.VITE_APP_URL;
    if (typeof envOrigin === 'string' && envOrigin.length > 0) {
        return envOrigin.replace(/\/$/, '');
    }

    return 'https://cvarchitect.app';
}

export function getAppUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getAppOrigin()}${normalizedPath}`;
}
