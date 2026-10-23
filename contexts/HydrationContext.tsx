import React, { createContext, useContext } from 'react';

/**
 * True only for the first render of a prerendered page that we are hydrating.
 * Motion components use it to start at their final state so the client's first
 * render matches the static HTML instead of replaying the entrance animation.
 */
const HydrationContext = createContext(false);

export const HydrationProvider = HydrationContext.Provider;

export function useHydrating(): boolean {
  return useContext(HydrationContext);
}

/** True when the document already contains server/prerendered markup. */
export function hasPrerenderedMarkup(): boolean {
  if (typeof document === 'undefined') return false;
  const root = document.getElementById('root');
  return Boolean(root && root.childElementCount > 0);
}

export {
  HYDRATION_EXACT_ROUTES,
  HYDRATION_ROUTE_PREFIXES,
  isHydrationRoute,
  shouldHydrate,
} from '../utils/hydrationRoutes';
