import { describe, it, expect } from 'vitest';
import {
  HYDRATION_EXACT_ROUTES,
  HYDRATION_ROUTE_PREFIXES,
  isHydrationRoute,
  shouldHydrate,
} from './hydrationRoutes';

describe('hydration route allowlist', () => {
  it('accepts every exact route in the allowlist', () => {
    for (const route of HYDRATION_EXACT_ROUTES) {
      expect(isHydrationRoute(route), route).toBe(true);
    }
  });

  it('accepts the exact prefix roots', () => {
    for (const prefix of HYDRATION_ROUTE_PREFIXES) {
      expect(isHydrationRoute(prefix), prefix).toBe(true);
    }
  });

  it('accepts nested blog, template, and comparison paths', () => {
    expect(isHydrationRoute('/blog/best-resume-templates-2026')).toBe(true);
    expect(isHydrationRoute('/resume-templates/nurse')).toBe(true);
    expect(isHydrationRoute('/resume-templates/software-engineer')).toBe(true);
    expect(isHydrationRoute('/compare/teal')).toBe(true);
    expect(isHydrationRoute('/compare/resume-io')).toBe(true);
    expect(isHydrationRoute('/best-cover-letter-builders')).toBe(true);
    expect(isHydrationRoute('/best-ats-resume-checkers')).toBe(true);
    expect(isHydrationRoute('/best-resume-builders-for-first-time-writers')).toBe(true);
  });

  it('rejects routes that only share a prefix string', () => {
    expect(isHydrationRoute('/resume-templates-extra')).toBe(false);
    expect(isHydrationRoute('/comparison')).toBe(false);
    expect(isHydrationRoute('/blogger')).toBe(false);
  });

  it('rejects dashboard and legacy routes that are not allowlisted', () => {
    expect(isHydrationRoute('/')).toBe(false);
    expect(isHydrationRoute('/dashboard')).toBe(false);
    expect(isHydrationRoute('/dashboard/templates')).toBe(false);
    expect(isHydrationRoute('/forgot-password')).toBe(false);
    expect(isHydrationRoute('/reset-password')).toBe(false);
  });

  it('keeps the shouldHydrate alias in sync', () => {
    expect(shouldHydrate('/pricing')).toBe(true);
    expect(shouldHydrate('/dashboard')).toBe(false);
  });
});
