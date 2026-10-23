/**
 * IndexNow submission script for CVArchitect.
 *
 * Implements the IndexNow protocol (https://www.bing.com/indexnow/getstarted and https://www.indexnow.org).
 * Notifies search engines (Bing, Yandex, Naver, Seznam, etc.) instantly when pages are created or updated.
 *
 * Usage:
 *   node scripts/indexnow.mjs                 # Submit all public indexable pages
 *   node scripts/indexnow.mjs /blog/my-post   # Submit specific route(s)
 *   node scripts/indexnow.mjs --dry-run       # Preview payload without sending
 *   node scripts/indexnow.mjs --engine bing   # Target bing.com directly instead of api.indexnow.org
 */

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_URL,
  STATIC_ROUTES,
  COMPARISON_ROUTES,
  ROLE_ROUTES,
} from './routes.mjs';
import { blogPosts } from '../utils/blogData.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

// Parse CLI flags and arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const useBing = args.includes('--engine') && args[args.indexOf('--engine') + 1] === 'bing';
const specificPaths = args.filter((arg) => arg.startsWith('/') || arg.startsWith('http'));

/**
 * Locate the IndexNow key and key file from public/ or environment variable.
 */
function getIndexNowKey() {
  if (process.env.INDEXNOW_KEY) {
    const key = process.env.INDEXNOW_KEY.trim();
    return {
      key,
      fileName: `${key}.txt`,
    };
  }

  // Look for 32-character hex .txt file in public/
  const files = readdirSync(PUBLIC_DIR);
  const keyFile = files.find((file) => /^[a-f0-9]{32}\.txt$/i.test(file));

  if (!keyFile) {
    throw new Error(
      'Could not find IndexNow key file (*.txt with 32 hex chars) in public/ directory. ' +
        'Set INDEXNOW_KEY env var or place <key>.txt in public/.'
    );
  }

  const keyContent = readFileSync(path.join(PUBLIC_DIR, keyFile), 'utf8').trim();
  const keyFromFilename = path.parse(keyFile).name;

  if (keyContent !== keyFromFilename) {
    console.warn(
      `[IndexNow] Warning: Key content (${keyContent}) does not match filename (${keyFromFilename}). Using key from file content.`
    );
  }

  return {
    key: keyContent,
    fileName: keyFile,
  };
}

/**
 * Gather all public URLs that should be indexed.
 */
function getAllPublicUrls() {
  const routes = new Set();

  for (const r of STATIC_ROUTES) {
    routes.add(r.path);
  }
  for (const r of COMPARISON_ROUTES) {
    routes.add(r.path);
  }
  for (const r of ROLE_ROUTES) {
    routes.add(r.path);
  }
  routes.add('/blog');
  for (const post of blogPosts) {
    routes.add(`/blog/${post.slug}`);
  }

  return Array.from(routes).map((routePath) =>
    routePath.startsWith('http') ? routePath : `${SITE_URL}${routePath}`
  );
}

async function submitToIndexNow() {
  const { key, fileName } = getIndexNowKey();
  const host = new URL(SITE_URL).hostname;
  const keyLocation = `${SITE_URL}/${fileName}`;

  const urlsToSubmit =
    specificPaths.length > 0
      ? specificPaths.map((p) => (p.startsWith('http') ? p : `${SITE_URL}${p}`))
      : getAllPublicUrls();

  const endpoints = useBing
    ? ['https://www.bing.com/indexnow']
    : ['https://www.bing.com/indexnow', 'https://api.indexnow.org/IndexNow'];

  const payload = {
    host,
    key,
    keyLocation,
    urlList: urlsToSubmit,
  };

  console.log(`\n======================================================`);
  console.log(`[IndexNow] Preparing submission for ${host}`);
  console.log(`  Key:         ${key}`);
  console.log(`  KeyLocation: ${keyLocation}`);
  console.log(`  URLs Count:  ${urlsToSubmit.length}`);
  console.log(`======================================================\n`);

  if (isDryRun) {
    console.log('[IndexNow] --dry-run specified. Payload preview:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('\n[IndexNow] Dry run complete. No network request sent.');
    return;
  }

  for (const endpoint of endpoints) {
    console.log(`[IndexNow] Sending POST request to ${endpoint}...`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.text();
      const status = response.status;

      console.log(`\n[IndexNow] Response: HTTP ${status} ${response.statusText}`);

      switch (status) {
        case 200:
          console.log('✅ OK: URLs submitted successfully to IndexNow.');
          return;
        case 202:
          console.log(
            '✅ Accepted: URL submission received. IndexNow is validating or has validated the key.'
          );
          return;
        case 400:
          console.error('❌ Bad Request: Invalid format or payload.', responseBody);
          return;
        case 403:
          console.error('❌ Forbidden: Key not valid or keyLocation not found/matching.', responseBody);
          return;
        case 422:
          console.error('❌ Unprocessable Entity: URLs do not belong to host or key mismatch.', responseBody);
          return;
        case 429:
          console.error('⚠️ Too Many Requests: Rate limited by IndexNow.', responseBody);
          return;
        default:
          console.log(`HTTP ${status}:`, responseBody || '(empty body)');
          return;
      }
    } catch (error) {
      console.warn(`[IndexNow] Request to ${endpoint} failed: ${error.message}`);
    }
  }

  console.error('[IndexNow] All endpoints failed. Please check network connectivity.');
}

submitToIndexNow();
