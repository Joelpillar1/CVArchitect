/**
 * Routes cleared for hydration. Keep this list small until each route has been
 * verified with scripts/verify-hydration.mjs.
 *
 * Shared by the browser entry and the build-time prerender so both sides agree
 * on which pages get the deterministic first-render treatment.
 */
export const HYDRATION_EXACT_ROUTES = [
  '/blog',
  '/pricing',
  '/cover-letter',
  '/best-ai-resume-builders',
  '/best-cover-letter-builders',
  '/best-ats-resume-checkers',
  '/best-resume-builders-for-first-time-writers',
  '/privacy',
  '/terms',
  '/refund-policy',
  '/contact',
  '/support',
  '/login',
  '/signup',
  '/action-words',
  '/resume-checker',
];

export const HYDRATION_ROUTE_PREFIXES = ['/blog/', '/resume-templates', '/compare'];

export function isHydrationRoute(pathname: string): boolean {
  return (
    HYDRATION_EXACT_ROUTES.includes(pathname) ||
    HYDRATION_ROUTE_PREFIXES.some(
      (prefix) =>
        pathname === prefix ||
        pathname.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`),
    )
  );
}

export const shouldHydrate = isHydrationRoute;
