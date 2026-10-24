import { describe, it, expect } from 'vitest';
import { blogPosts } from '../utils/blogData';
import { ROLE_GUIDES } from '../utils/roleTemplates';
import { seoMetadataProblems } from '../scripts/seoLimits.mjs';

/**
 * Strict rules for page and blog metadata.
 *
 * Titles must stay within the search-result width and descriptions within the
 * snippet width, so nothing ships truncated. The same limits gate the built
 * HTML in scripts/verify-prerender.mjs, so every prerendered page is covered
 * even when its title lives in a component rather than here.
 */
describe('SEO metadata limits', () => {
  it('every blog post title and description fits the limits', () => {
    const problems: string[] = [];
    for (const post of blogPosts) {
      problems.push(
        ...seoMetadataProblems({
          path: `/blog/${post.slug}`,
          title: post.metaTitle,
          description: post.metaDescription,
        }),
      );
    }
    expect(problems).toEqual([]);
  });

  it('every role template title and description fits the limits', () => {
    const problems: string[] = [];
    for (const guide of ROLE_GUIDES) {
      problems.push(
        ...seoMetadataProblems({
          path: `/resume-templates/${guide.slug}`,
          title: guide.metaTitle,
          description: guide.metaDescription,
        }),
      );
    }
    expect(problems).toEqual([]);
  });
});
