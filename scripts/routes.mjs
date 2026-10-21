/**
 * Single source of truth for every public URL.
 *
 * Consumed by:
 *   - scripts/prerender.mjs   (builds static HTML per route)
 *   - sitemap generation      (dist/sitemap.xml, dist/sitemap-blog.xml)
 *
 * Blog posts come from utils/blogData.ts, so adding a post automatically
 * prerenders it and adds it to the sitemap. Nothing to keep in sync by hand.
 */
import { blogPosts } from '../utils/blogData.ts';

export const SITE_URL = 'https://cvarchitect.app';

/** Indexable marketing pages. Order is irrelevant. */
export const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { path: '/resume-templates', priority: '0.9', changefreq: 'weekly' },
  { path: '/cover-letter', priority: '0.9', changefreq: 'monthly' },
  { path: '/resume-checker', priority: '0.9', changefreq: 'monthly' },
  { path: '/action-words', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/support', priority: '0.4', changefreq: 'yearly' },
  { path: '/contact', priority: '0.4', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.3', changefreq: 'yearly' },
];

/** Prerendered for instant paint, but never indexed. */
export const UTILITY_ROUTES = ['/signup', '/login'];

/** Routes that must never be prerendered. */
export const PRIVATE_PREFIXES = ['/dashboard', '/resume-agent', '/editor', '/print-resume', '/dev-', '/screenshot', '/auth/'];

export function isPrivateRoute(routePath) {
  return PRIVATE_PREFIXES.some((prefix) => routePath.startsWith(prefix));
}

export function getPrerenderRoutes() {
  const routes = [
    ...STATIC_ROUTES.map((route) => ({ path: route.path, index: true })),
    ...blogPosts.map((post) => ({ path: `/blog/${post.slug}`, index: true })),
    ...UTILITY_ROUTES.map((routePath) => ({ path: routePath, index: false })),
  ];

  // Guard rail: never prerender an authenticated page.
  return routes.filter((route) => {
    if (isPrivateRoute(route.path)) {
      throw new Error(`Refusing to prerender private route: ${route.path}`);
    }
    return true;
  });
}

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function wrapUrlset(entries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}

/** Main sitemap: marketing pages only. */
export function buildMainSitemap() {
  const entries = STATIC_ROUTES.map((route) =>
    urlEntry({
      loc: `${SITE_URL}${route.path}`,
      changefreq: route.changefreq,
      priority: route.priority,
    })
  );
  return wrapUrlset(entries);
}

/** Blog sitemap: index plus every post, with lastmod from publishDate. */
export function buildBlogSitemap() {
  const entries = [
    urlEntry({ loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: '0.8' }),
    ...blogPosts.map((post) =>
      urlEntry({
        loc: `${SITE_URL}/blog/${post.slug}`,
        lastmod: post.publishDate,
        changefreq: 'monthly',
        priority: '0.7',
      })
    ),
  ];
  return wrapUrlset(entries);
}
