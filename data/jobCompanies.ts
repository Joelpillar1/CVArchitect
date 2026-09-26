import type { JobSourceCompany } from '../api/lib/jobs/types';

/**
 * Seed list of companies whose **own** careers pages we read directly.
 *
 * Every entry below was verified against the provider's public board API, and the live
 * posting count at verification time is noted in the comment so a token that silently goes
 * stale is easy to spot. This list is intentionally small: the sync is designed to prove
 * out end-to-end on a few hundred boards before scaling.
 *
 * `provider` + `slug` are declared explicitly (rather than left to auto-discovery) for two
 * reasons:
 *  1. Correctness. `vercel` and `reddit` both have a stray same-named Ashby board with a
 *     single unrelated posting; declaring the provider removes that ambiguity.
 *  2. Cost. Declared sources need no discovery requests at all, so a full sync spends its
 *     network budget reading job boards instead of probing for them.
 *
 * Companies with no `provider` will be resolved by `api/lib/jobs/discovery.ts`, which
 * fingerprints the careers page and falls back to probing candidate tokens.
 */
export const JOB_SOURCE_COMPANIES: JobSourceCompany[] = [
  // ---- Greenhouse ----
  { name: 'Vercel', domain: 'vercel.com', provider: 'greenhouse', slug: 'vercel' }, // 86
  { name: 'Figma', domain: 'figma.com', provider: 'greenhouse', slug: 'figma' }, // 153
  { name: 'Stripe', domain: 'stripe.com', provider: 'greenhouse', slug: 'stripe' }, // 635
  { name: 'GitLab', domain: 'gitlab.com', provider: 'greenhouse', slug: 'gitlab' }, // 227
  { name: 'Databricks', domain: 'databricks.com', provider: 'greenhouse', slug: 'databricks' }, // 892
  { name: 'Robinhood', domain: 'robinhood.com', provider: 'greenhouse', slug: 'robinhood' }, // 126
  { name: 'Coinbase', domain: 'coinbase.com', provider: 'greenhouse', slug: 'coinbase' }, // 218
  { name: 'Airbnb', domain: 'airbnb.com', provider: 'greenhouse', slug: 'airbnb' }, // 164
  { name: 'Reddit', domain: 'reddit.com', provider: 'greenhouse', slug: 'reddit' }, // 148
  { name: 'Discord', domain: 'discord.com', provider: 'greenhouse', slug: 'discord' }, // 46
  { name: 'Dropbox', domain: 'dropbox.com', provider: 'greenhouse', slug: 'dropbox' }, // 41
  { name: 'Cloudflare', domain: 'cloudflare.com', provider: 'greenhouse', slug: 'cloudflare' }, // 358
  { name: 'MongoDB', domain: 'mongodb.com', provider: 'greenhouse', slug: 'mongodb' }, // 405
  { name: 'Twilio', domain: 'twilio.com', provider: 'greenhouse', slug: 'twilio' }, // 149
  { name: 'Affirm', domain: 'affirm.com', provider: 'greenhouse', slug: 'affirm' }, // 207
  { name: 'Chime', domain: 'chime.com', provider: 'greenhouse', slug: 'chime' }, // 70
  { name: 'Samsara', domain: 'samsara.com', provider: 'greenhouse', slug: 'samsara' }, // 262
  { name: 'Flexport', domain: 'flexport.com', provider: 'greenhouse', slug: 'flexport' }, // 179
  { name: 'Instacart', domain: 'instacart.com', provider: 'greenhouse', slug: 'instacart' }, // 106
  { name: 'Lyft', domain: 'lyft.com', provider: 'greenhouse', slug: 'lyft' }, // 183
  { name: 'Pinterest', domain: 'pinterest.com', provider: 'greenhouse', slug: 'pinterest' }, // 184
  { name: 'Squarespace', domain: 'squarespace.com', provider: 'greenhouse', slug: 'squarespace' }, // 28
  { name: 'Anthropic', domain: 'anthropic.com', provider: 'greenhouse', slug: 'anthropic' }, // 595
  { name: 'Brex', domain: 'brex.com', provider: 'greenhouse', slug: 'brex' }, // 272
  { name: 'Gusto', domain: 'gusto.com', provider: 'greenhouse', slug: 'gusto' }, // 95
  { name: 'Asana', domain: 'asana.com', provider: 'greenhouse', slug: 'asana' }, // 103
  { name: 'Duolingo', domain: 'duolingo.com', provider: 'greenhouse', slug: 'duolingo' }, // 80

  // ---- Lever ----
  { name: 'Palantir', domain: 'palantir.com', provider: 'lever', slug: 'palantir' }, // 311
  { name: 'Spotify', domain: 'spotify.com', provider: 'lever', slug: 'spotify' },

  // ---- Ashby ----
  { name: 'OpenAI', domain: 'openai.com', provider: 'ashby', slug: 'openai' }, // 795
  { name: 'Ramp', domain: 'ramp.com', provider: 'ashby', slug: 'ramp' }, // 145
  { name: 'Notion', domain: 'notion.so', provider: 'ashby', slug: 'notion' }, // 127
  { name: 'Linear', domain: 'linear.app', provider: 'ashby', slug: 'linear' }, // 30
  { name: 'Vanta', domain: 'vanta.com', provider: 'ashby', slug: 'vanta' }, // 105
  { name: 'Harvey', domain: 'harvey.ai', provider: 'ashby', slug: 'harvey' }, // 325
  { name: 'ElevenLabs', domain: 'elevenlabs.io', provider: 'ashby', slug: 'elevenlabs' }, // 246
  { name: 'Replit', domain: 'replit.com', provider: 'ashby', slug: 'replit' }, // 77
  { name: 'Supabase', domain: 'supabase.com', provider: 'ashby', slug: 'supabase' }, // 60
  { name: 'Modal', domain: 'modal.com', provider: 'ashby', slug: 'modal' }, // 31
  { name: 'Plaid', domain: 'plaid.com', provider: 'ashby', slug: 'plaid' }, // 110

  // ---- Resolved by auto-discovery ----
  // Datadog's careers page carries no ATS fingerprint and its board token does not match
  // its domain (`datadoghq.com` → board `datadog`), so it was only found by the probe
  // stage. It is declared here now that discovery has answered, to avoid re-probing it on
  // every sync — discovery remains the path for newly added companies.
  { name: 'Datadog', domain: 'datadoghq.com', provider: 'greenhouse', slug: 'datadog' },
];

/**
 * Companies deliberately left for auto-discovery.
 *
 * Nothing is declared, so `discoverJobSource()` fingerprints the careers page and probes
 * candidate tokens. Kept separate from the main list so it is obvious which entries are
 * resolved on the fly and which are pinned.
 */
export const JOB_DISCOVERY_COMPANIES: JobSourceCompany[] = [];
