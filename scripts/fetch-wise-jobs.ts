/**
 * Fetch and list all Wise jobs from wise.jobs/vacanciessitemap.xml
 * Run with: node --loader ts-node/esm scripts/fetch-wise-jobs.mjs
 * OR:       npx tsx scripts/fetch-wise-jobs.ts
 */

import { parseWiseSitemap, parseWiseSlug } from '../api/_lib/jobs/providers/wise';

const SITEMAP_URL = 'https://wise.jobs/vacanciessitemap.xml';

async function main() {
  console.log(`\n🔍 Fetching Wise jobs from ${SITEMAP_URL}...\n`);

  const res = await fetch(SITEMAP_URL, {
    headers: { 'User-Agent': 'CVArchitect-JobBot/1.0' },
  });

  if (!res.ok) {
    console.error(`❌ HTTP ${res.status}: ${res.statusText}`);
    process.exit(1);
  }

  const xml = await res.text();
  const entries = parseWiseSitemap(xml);

  console.log(`✅ Found ${entries.length} jobs\n`);
  console.log('─'.repeat(80));

  // Group by inferred location
  const byLocation: Record<string, typeof entries> = {};
  for (const e of entries) {
    const { location } = parseWiseSlug(e.url);
    if (!byLocation[location]) byLocation[location] = [];
    byLocation[location].push(e);
  }

  // Print jobs sorted by lastmod (newest first); entries without lastmod sink to the end.
  const sorted = [...entries].sort((a, b) => (b.lastmod || '').localeCompare(a.lastmod || ''));

  let n = 1;
  for (const entry of sorted) {
    const { title, location } = parseWiseSlug(entry.url);
    const date = entry.lastmod
      ? new Date(entry.lastmod).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric',
        })
      : 'no date';
    console.log(`${String(n).padStart(3)}. [${date}] ${title}`);
    console.log(`      📍 ${location} | 🔗 ${entry.url}`);
    n++;
  }

  console.log('\n─'.repeat(80));
  console.log(`\n📊 Locations breakdown:`);
  for (const [loc, jobs] of Object.entries(byLocation).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`   ${loc.padEnd(30)} ${jobs.length} jobs`);
  }

  console.log(`\n✅ Total: ${entries.length} open positions at Wise\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
