import { describe, it, expect } from 'vitest';
import { formatPostedDate } from './jobMatching';

/**
 * Format tests for the posted-date label.
 *
 * Two properties matter for trust in the job feed and are easy to regress:
 *  - "Today" is a calendar-day comparison, not a rolling 24h window (a 10 PM posting
 *    must not read as "Today" the next morning).
 *  - A timestamp in the future is bad source data, not a reason to pin "Today"
 *    indefinitely (the original bug: re-synced jobs fetched days ago showed "Today").
 */
describe('formatPostedDate', () => {
  // Fixed local "now": 2026-10-02 09:00 local time.
  const now = new Date(2026, 9, 2, 9, 0, 0);

  it('returns "Recently posted" for null/undefined', () => {
    expect(formatPostedDate(null, now)).toBe('Recently posted');
    expect(formatPostedDate(undefined, now)).toBe('Recently posted');
  });

  it('returns "Today" for the same calendar day even outside 24 hours', () => {
    // 00:30 the same local day — only 8.5h ago, but also covers the >24h case:
    // 2026-10-01 23:00 is 10h ago AND yesterday, so it must NOT say "Today".
    expect(formatPostedDate(new Date(2026, 9, 2, 0, 30).toISOString(), now)).toBe('Today');
  });

  it('returns "1 day ago" for last night instead of "Today"', () => {
    // 10 PM the previous evening — 11h ago. The old rolling-window logic called this
    // "Today"; the calendar-day comparison must not.
    expect(formatPostedDate(new Date(2026, 9, 1, 22, 0).toISOString(), now)).toBe('1 day ago');
  });

  it('returns "Recently posted" for far-future timestamps instead of pinning "Today"', () => {
    // Clock-skewed / fabricated date a week ahead: the original code said "Today"
    // forever because diffMs < 24h held until time caught up.
    const future = new Date(now.getTime() + 7 * 86_400_000);
    expect(formatPostedDate(future.toISOString(), now)).toBe('Recently posted');
  });

  it('tolerates sub-day future skew as "Today"', () => {
    // Date-only strings parsed as UTC midnight can land slightly "ahead" of local now.
    const soon = new Date(now.getTime() + 2 * 3_600_000);
    expect(formatPostedDate(soon.toISOString(), now)).toBe('Today');
  });

  it('counts days, weeks and months from calendar boundaries', () => {
    expect(formatPostedDate(new Date(2026, 8, 29).toISOString(), now)).toBe('3 days ago');
    expect(formatPostedDate(new Date(2026, 8, 22).toISOString(), now)).toBe('1 week ago');
    expect(formatPostedDate(new Date(2026, 8, 15).toISOString(), now)).toBe('2 weeks ago');
    expect(formatPostedDate(new Date(2026, 7, 20).toISOString(), now)).toBe('1 month ago');
  });

  it('passes through legacy relative strings', () => {
    expect(formatPostedDate('Today', now)).toBe('Today');
    expect(formatPostedDate('just now', now)).toBe('Today');
    expect(formatPostedDate('3d ago', now)).toBe('3d ago');
  });

  it('passes through unparseable values verbatim', () => {
    expect(formatPostedDate('not-a-date', now)).toBe('not-a-date');
  });
});
