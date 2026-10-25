/**
 * Recapture the competitor pricing screenshots used on the /compare pages.
 *
 * Usage:
 *   node scripts/capture-pricing.mjs                # the three newest targets
 *   node scripts/capture-pricing.mjs novoresume     # one or more slugs
 *   node scripts/capture-pricing.mjs all            # every target below
 *
 * Output: public/images/compare/<slug>-pricing-YYYY-MM.png at 1440x1000,
 * matching the existing captures.
 *
 * Rules:
 *   - The capture is the public pricing page as rendered, viewport only.
 *     Nothing is annotated, cropped around a claim, or edited afterwards.
 *   - A cookie/consent dialog is dismissed only so it does not cover the
 *     prices. No other page state is changed.
 *   - The capture date in the filename and in each page's caption must match.
 */

import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'compare');
const VIEWPORT = { width: 1440, height: 1000, deviceScaleFactor: 1 };

/** Date stamp used in the filename. Keep in sync with DEEP_VERIFIED. */
const STAMP = '2026-10';

const TARGETS = [
  { slug: 'novoresume', url: 'https://novoresume.com/pricing' },
  { slug: 'resume-genius', url: 'https://resumegenius.com/pricing' },
  { slug: 'enhancv', url: 'https://enhancv.com/pricing/' },
  // Existing captures, kept here so the whole set can be refreshed together.
  { slug: 'resume-io', url: 'https://resume.io/pricing' },
  { slug: 'teal', url: 'https://www.tealhq.com/pricing' },
  { slug: 'rezi', url: 'https://www.rezi.ai/pricing' },
  { slug: 'kickresume', url: 'https://www.kickresume.com/en/pricing/' },
  { slug: 'zety', url: 'https://www.zety.com/pricing' },
  { slug: 'jobscan', url: 'https://www.jobscan.co/pricing' },
];

/** Selectors for the usual consent dialogs. Clicking one only closes the banner. */
const CONSENT_SELECTORS = [
  '#onetrust-accept-btn-handler',
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  'button[data-testid="cookie-accept"]',
  'button[aria-label="Accept all"]',
  'button[aria-label="Accept cookies"]',
  'button[id*="accept" i]',
  'button[class*="accept" i]',
];

function resolveChromePath() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const candidates =
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

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error('No local Chrome/Edge found. Set CHROME_PATH.');
}

async function dismissConsent(page) {
  for (const selector of CONSENT_SELECTORS) {
    try {
      const handle = await page.$(selector);
      if (!handle) continue;
      const visible = await handle.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (!visible) continue;
      await handle.click();
      await new Promise((resolve) => setTimeout(resolve, 900));
      return selector;
    } catch {
      // Banner gone, covered, or not clickable. Try the next selector.
    }
  }
  return null;
}

function selectTargets(argv) {
  const requested = argv.filter((arg) => !arg.startsWith('-'));
  if (requested.length === 0) return TARGETS.slice(0, 3);
  if (requested.includes('all')) return TARGETS;

  const picked = TARGETS.filter((target) => requested.includes(target.slug));
  const unknown = requested.filter((slug) => !TARGETS.some((target) => target.slug === slug));
  if (unknown.length > 0) {
    throw new Error(`Unknown slug(s): ${unknown.join(', ')}`);
  }
  return picked;
}

const targets = selectTargets(process.argv.slice(2));
mkdirSync(OUT_DIR, { recursive: true });

const executablePath = resolveChromePath();
console.log(`[capture] chromium: ${executablePath}`);

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
});

const failures = [];

try {
  for (const target of targets) {
    const page = await browser.newPage();
    try {
      await page.setViewport(VIEWPORT);
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      );
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const consent = await dismissConsent(page);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const file = path.join(OUT_DIR, `${target.slug}-pricing-${STAMP}.png`);
      await page.screenshot({ path: file, type: 'png' });

      const title = await page.title();
      console.log(
        `[capture] ${target.slug} -> ${path.relative(process.cwd(), file)}${consent ? ` (dismissed ${consent})` : ''} | ${title}`,
      );
    } catch (error) {
      failures.push(`${target.slug}: ${error.message}`);
      console.error(`[capture] FAILED ${target.slug}: ${error.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error(`[capture] ${failures.length} capture(s) failed`);
  process.exitCode = 1;
} else {
  console.log(`[capture] OK: ${targets.length} screenshot(s) written`);
}
