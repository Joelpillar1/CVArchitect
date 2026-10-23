import { describe, it, expect } from 'vitest';
import { getRelatedLinks } from './relatedLinks';

const FIRST_TIME_HREF = '/best-resume-builders-for-first-time-writers';

describe('related links', () => {
  it('sends first-job posts to the first-time-writer listicle', () => {
    const links = getRelatedLinks({
      slug: 'how-to-make-a-resume-for-your-first-job-2026',
      title: 'How to make a resume for your first job',
      category: 'Guides',
      tags: ['first job', 'resume'],
    });
    expect(links.map((link) => link.href)).toContain(FIRST_TIME_HREF);
  });

  it('sends no-experience posts to the first-time-writer listicle', () => {
    const links = getRelatedLinks({
      slug: 'student-resume-no-experience-guide',
      title: 'Student resume with no experience',
      category: 'Students',
      tags: ['no experience', 'student resume'],
    });
    expect(links.map((link) => link.href)).toContain(FIRST_TIME_HREF);
  });

  it('still gives cover letter posts the cover letter builder first', () => {
    const links = getRelatedLinks({
      slug: 'cover-letter-guide-2026',
      title: 'Cover letter guide',
      category: 'Cover letters',
      tags: ['cover letter'],
    });
    expect(links[0]?.href).toBe('/cover-letter');
  });

  it('never returns duplicate links', () => {
    const links = getRelatedLinks({
      slug: 'resume-templates-2026',
      title: 'Resume templates',
      category: 'Templates',
      tags: ['template', 'resume format'],
    });
    const hrefs = links.map((link) => link.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs.length).toBeGreaterThan(0);
  });
});
