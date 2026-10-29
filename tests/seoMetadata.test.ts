import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
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

/**
 * Bing was reporting the two most-crawled URLs as missing an H1 even though
 * the prerendered HTML has exactly one. The www host was answering with a 308
 * (Vercel's `permanent: true`), which Bing's site scan can treat as the final
 * response instead of following it to the canonical page. A 301 makes the
 * consolidation unambiguous for every crawler.
 */
describe('canonical host redirect', () => {
  const config = JSON.parse(
    readFileSync(path.resolve(process.cwd(), 'vercel.json'), 'utf8'),
  ) as {
    redirects: Array<{
      source: string;
      destination: string;
      permanent?: boolean;
      statusCode?: number;
      has?: Array<{ type: string; value: string }>;
    }>;
  };

  const wwwRedirect = config.redirects.find((redirect) =>
    redirect.has?.some(
      (condition) => condition.type === 'host' && condition.value === 'www.cvarchitect.app',
    ),
  );

  it('redirects www to the apex host with a 301', () => {
    expect(wwwRedirect).toBeDefined();
    expect(wwwRedirect?.destination).toBe('https://cvarchitect.app/$1');
    expect(wwwRedirect?.statusCode).toBe(301);
    expect(wwwRedirect?.permanent).toBeUndefined();
  });
});
