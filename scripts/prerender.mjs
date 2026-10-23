/**
 * Build-time prerender.
 *
 * Renders every public route in a real headless browser and writes the
 * resulting HTML to dist/<route>/index.html. Crawlers that do not execute
 * JavaScript (GPTBot, OAI-SearchBot, ClaudeBot, most of Perplexity) then see
 * the same page a user sees.
 *
 * Why a real browser instead of React SSR:
 *   - react-helmet-async is unreliable under React 19 in this app
 *   - framer-motion and several components touch window/document at runtime
 *   - we already ship puppeteer-core + @sparticuz/chromium for PDF export
 *
 * Usage:
 *   node scripts/prerender.mjs           (strict: fails the build on any error)
 *   node scripts/prerender.mjs --warn    (never fails, logs instead)
 */
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { getPrerenderRoutes, buildMainSitemap, buildBlogSitemap, SITE_URL } from './routes.mjs';
import { HYDRATION_EXACT_ROUTES, HYDRATION_ROUTE_PREFIXES } from '../utils/hydrationRoutes.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PRERENDER_PORT || 4178);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const STRICT = !process.argv.includes('--warn');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/* Static server with SPA fallback (serves the fresh dist build)        */
/* ------------------------------------------------------------------ */
function startServer(root) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
      const candidates = [
        path.join(root, safePath),
        path.join(root, `${safePath}.html`),
        path.join(root, safePath, 'index.html'),
      ];

      for (const candidate of candidates) {
        if (existsSync(candidate) && path.extname(candidate)) {
          const body = await readFile(candidate);
          res.writeHead(200, { 'Content-Type': MIME[path.extname(candidate)] || 'application/octet-stream' });
          res.end(body);
          return;
        }
      }

      // SPA fallback
      const body = await readFile(path.join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(body);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`server error: ${error.message}`);
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

/* ------------------------------------------------------------------ */
/* Chromium resolution: local browser first, then serverless build     */
/* ------------------------------------------------------------------ */
async function resolveChromePath() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const localCandidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        ]
      : process.platform === 'darwin'
        ? [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
          ]
        : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];

  for (const candidate of localCandidates) {
    if (existsSync(candidate)) return candidate;
  }

  // Vercel / Lambda build images have no Chrome; this package ships one.
  const chromium = (await import('@sparticuz/chromium')).default;
  return chromium.executablePath();
}

/* ------------------------------------------------------------------ */
/* Snapshot helpers                                                    */
/* ------------------------------------------------------------------ */
async function settlePage(page) {
  await page.waitForFunction(
    () => {
      const root = document.getElementById('root');
      return !!root && root.children.length > 0 && document.body.innerText.trim().length > 40;
    },
    { timeout: 45000, polling: 200 }
  );

  await page.evaluate(() => document.fonts.ready);
  await sleep(150);

  // whileInView sections start at opacity 0 and only animate once visible.
  // Walk the whole page so every section reaches its final state.
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(320, Math.round(window.innerHeight * 0.75));
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await wait(80);
    }
    window.scrollTo(0, 0);
    await wait(250);
  });
}

async function serialize(page) {
  return page.evaluate(() => {
    // Safety net for any element still parked at its motion initial state.
    document.querySelectorAll('*').forEach((element) => {
      const style = element.style;
      if (!style) return;
      if (style.opacity === '0') style.opacity = '1';
      if (style.visibility === 'hidden') style.visibility = 'visible';
      if (style.transform && style.transform !== 'none') style.transform = 'none';
    });

    // Resume previews render the candidate name as an <h1>. They are decorative
    // and must not count against the page's own heading structure.
    const h1Count = Array.from(document.querySelectorAll('h1')).filter(
      (heading) => !heading.closest('[data-resume-preview], .resume-preview-root')
    ).length;

    return {
      html: `<!DOCTYPE html>\n${document.documentElement.outerHTML}`,
      h1Count,
    };
  });
}

function outputPathFor(routePath) {
  if (routePath === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, routePath.replace(/^\//, ''), 'index.html');
}

function inspect(html, routePath, h1Count) {
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '';
  const canonical = (html.match(/<link rel="canonical"[^>]*href="([^"]+)"/i) || [])[1] || '';
  const expectedCanonical = `${SITE_URL}${routePath === '/' ? '/' : routePath}`;

  // Visible text of the document, ignoring markup.
  const rootLength = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;

  const problems = [];
  if (!title) problems.push('missing <title>');
  if (!rootLength) problems.push('empty document');
  if (rootLength && rootLength < 400) problems.push(`thin document (${rootLength} chars of text)`);
  if (h1Count > 1) problems.push(`${h1Count} page-level <h1> tags`);
  if (canonical && canonical.replace(/\/$/, '') !== expectedCanonical.replace(/\/$/, '')) {
    problems.push(`canonical mismatch (${canonical})`);
  }

  return { title, rootLength, h1Count, canonical, problems };
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
async function main() {
  if (!existsSync(path.join(DIST, 'index.html'))) {
    throw new Error('dist/index.html not found. Run `vite build` before prerendering.');
  }

  const routes = getPrerenderRoutes();
  console.log(`[prerender] ${routes.length} routes`);

  // Preserve the untouched SPA shell for the catch-all rewrite, so private
  // routes (dashboard, editor) do not flash the prerendered marketing page.
  const shellHtml = await readFile(path.join(DIST, 'index.html'), 'utf8');
  if (/<div id="root">\s*<\/div>/.test(shellHtml)) {
    await writeFile(path.join(DIST, 'spa.html'), shellHtml, 'utf8');
    console.log('[prerender] spa shell saved');
  }

  const server = await startServer(DIST);
  const executablePath = await resolveChromePath();
  console.log(`[prerender] chromium: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  const failures = [];
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  // Hydrated routes must snapshot their deterministic first render, not the
  // post-pagination DOM, or the browser cannot attach to the static HTML.
  await page.evaluateOnNewDocument(({ exact, prefixes }) => {
    window.__PRERENDER_HYDRATION__ =
      exact.includes(location.pathname) ||
      prefixes.some(
        (prefix) => location.pathname === prefix || location.pathname.startsWith(prefix)
      );
  }, { exact: HYDRATION_EXACT_ROUTES, prefixes: HYDRATION_ROUTE_PREFIXES });
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    // Third-party analytics must not run during prerender.
    if (/googletagmanager|google-analytics|clarity|hotjar|facebook|doubleclick/i.test(url)) {
      request.abort();
      return;
    }
    request.continue();
  });

  try {
    for (const route of routes) {
      const startedAt = Date.now();
      try {
        const response = await page.goto(`${ORIGIN}${route.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        });

        if (response && response.status() >= 400) {
          throw new Error(`HTTP ${response.status()}`);
        }

        await settlePage(page);
        const snapshot = await serialize(page);
        const report = inspect(snapshot.html, route.path, snapshot.h1Count);

        if (report.problems.length) {
          throw new Error(report.problems.join(', '));
        }

        const target = outputPathFor(route.path);
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, snapshot.html, 'utf8');

        console.log(
          `[prerender] ok  ${route.path.padEnd(52)} ${String(Date.now() - startedAt).padStart(5)}ms  ` +
            `title="${report.title.slice(0, 48)}"`
        );
      } catch (error) {
        failures.push({ path: route.path, error: error.message });
        console.error(`[prerender] FAIL ${route.path}: ${error.message}`);
      }
    }
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
    server.close();
  }

  await writeFile(path.join(DIST, 'sitemap.xml'), buildMainSitemap(), 'utf8');
  await writeFile(path.join(DIST, 'sitemap-blog.xml'), buildBlogSitemap(), 'utf8');
  console.log('[prerender] sitemaps written');

  if (failures.length) {
    const summary = failures.map((failure) => `  - ${failure.path}: ${failure.error}`).join('\n');
    if (STRICT) {
      throw new Error(`Prerender failed for ${failures.length} route(s):\n${summary}`);
    }
    console.warn(`[prerender] ${failures.length} route(s) failed (warn mode):\n${summary}`);
  }

  console.log(`[prerender] done: ${routes.length - failures.length}/${routes.length} routes`);
}

main().catch((error) => {
  console.error('[prerender] fatal:', error.message);
  process.exit(1);
});
