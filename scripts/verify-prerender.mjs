/**
 * Post-build verification for the prerendered output.
 * Fails if any page is missing a title, a canonical, real text, or has
 * more than one page-level <h1>.
 *
 *   node scripts/verify-prerender.mjs
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { getPrerenderRoutes } from './routes.mjs';
import { seoMetadataProblems } from './seoLimits.mjs';

const DIST = path.resolve('dist');
const SITE = 'https://cvarchitect.app';

/** Expected pages come from the route manifest, so this gate cannot drift. */
const EXPECTED = getPrerenderRoutes().map((route) => route.path);

function fileFor(routePath) {
  if (routePath === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, routePath.slice(1), 'index.html');
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function blogRoutes() {
  const dir = path.join(DIST, 'blog');
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => `/blog/${entry.name}`);
}

const problems = [];
const rows = [];

const allRoutes = [...new Set([...EXPECTED, ...(await blogRoutes())])];

for (const route of allRoutes) {
  const file = fileFor(route);
  let html;
  try {
    html = await readFile(file, 'utf8');
  } catch {
    problems.push(`${route}: missing file`);
    continue;
  }

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '';
  const description = (html.match(/<meta name="description"[^>]*content="([^"]*)"/i) || [])[1] || '';
  const canonical = (html.match(/rel="canonical"[^>]*href="([^"]+)"/i) || [])[1] || '';
  const text = textOf(html);
  const pageH1s = (html.match(/<h1[\s>]/gi) || []).length;
  const hiddenOpacity = (html.match(/opacity:\s*0(?:;|"|')/g) || []).length;
  const expectedCanonical = `${SITE}${route}`;

  problems.push(...seoMetadataProblems({ path: route, title, description }));
  if (text.length < 400) problems.push(`${route}: thin text (${text.length})`);
  if (!canonical) problems.push(`${route}: missing canonical`);
  else if (canonical.replace(/\/$/, '') !== expectedCanonical.replace(/\/$/, '')) {
    problems.push(`${route}: canonical ${canonical} != ${expectedCanonical}`);
  }
  if (pageH1s === 0) problems.push(`${route}: no <h1>`);
  if (html.includes('crawler-shell')) problems.push(`${route}: legacy crawler shell present`);

  rows.push({ route, title: title.slice(0, 44), chars: text.length, h1: pageH1s, hiddenOpacity, canonical });
}

const pad = (value, width) => String(value).padEnd(width);
console.log(`${pad('route', 34)} ${pad('chars', 7)} ${pad('h1s', 4)} ${pad('hidden', 7)} title`);
for (const row of rows) {
  console.log(`${pad(row.route, 34)} ${pad(row.chars, 7)} ${pad(row.h1, 3)} ${pad(row.hiddenOpacity, 7)} ${row.title}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`\nOK: ${rows.length} prerendered pages verified`);
