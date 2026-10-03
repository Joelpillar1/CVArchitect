import { describe, it, expect } from 'vitest';
import { getJobPostingUrl, toJobPostingPage } from './jobPostingUrl';

/**
 * The link on the job card and details modal must point at the exact posting, not a generic
 * careers landing page. These cases pin the precedence that makes that true.
 */
describe('getJobPostingUrl', () => {
  it('prefers the exact posting in sourceUrl over the careers landing page', () => {
    expect(
      getJobPostingUrl({
        sourceUrl: 'https://jobs.ashbyhq.com/abridge/ebb03b3f-0000',
        applyUrl: 'https://jobs.ashbyhq.com/abridge/ebb03b3f-0000/application',
        companyWebsiteUrl: 'https://abridge.com/careers',
      }),
    ).toBe('https://jobs.ashbyhq.com/abridge/ebb03b3f-0000');
  });

  it('falls back to applyUrl with its action suffix stripped', () => {
    expect(getJobPostingUrl({ applyUrl: 'https://jobs.lever.co/acme/abc/apply' })).toBe(
      'https://jobs.lever.co/acme/abc',
    );
    expect(getJobPostingUrl({ applyUrl: 'https://jobs.ashbyhq.com/acme/abc/application' })).toBe(
      'https://jobs.ashbyhq.com/acme/abc',
    );
  });

  it('falls back to the company careers page when no posting link exists', () => {
    expect(getJobPostingUrl({ companyWebsiteUrl: 'https://monzo.com/careers' })).toBe(
      'https://monzo.com/careers',
    );
  });

  it('returns undefined when the job carries no link at all', () => {
    expect(getJobPostingUrl({})).toBeUndefined();
  });
});

describe('toJobPostingPage', () => {
  it('leaves an already-specific posting URL untouched', () => {
    const url = 'https://job-boards.greenhouse.io/monzo/jobs/8143930';
    expect(toJobPostingPage(url)).toBe(url);
  });
});
