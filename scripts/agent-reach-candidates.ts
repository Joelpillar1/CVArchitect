/**
 * Candidate employers discovered with **Agent Reach** (Exa web search + Jina Reader).
 *
 * These were surfaced by reading a curated "AI startups hiring in 2026" roundup and a few
 * early-stage job boards, then extracting each company's own domain. Names are deliberately
 * *not* household brands: applied-AI, agent infrastructure, vector/retrieval, AI security,
 * voice and AI-fintech companies whose postings an aggregator tends to bury under the big
 * logos.
 *
 * No `provider`/`slug` is declared on purpose — `scripts/recon-career-sources.ts` runs the
 * SAME `discoverJobSource()` the production sync uses, so each company is proven to resolve
 * to a real ATS board before it is trusted. Everything here is a *candidate*: recon records
 * which ones actually answer.
 */

import type { JobSourceCompany } from '../api/_lib/jobs/types';

export const AGENT_REACH_CANDIDATES: JobSourceCompany[] = [
  // AI / agent infrastructure & inference
  { name: 'Simplismart', domain: 'simplismart.ai' },
  { name: 'Braintrust', domain: 'braintrust.dev' },
  { name: 'Taktile', domain: 'taktile.com' },
  { name: 'Emergent', domain: 'emergent.sh' },
  { name: 'Sarvam AI', domain: 'sarvam.ai' },
  { name: 'LinqAlpha', domain: 'linqalpha.com' },
  { name: 'LanceDB', domain: 'lancedb.com' },
  { name: 'Langfuse', domain: 'langfuse.com' },
  { name: 'OpenRouter', domain: 'openrouter.ai' },
  { name: 'Sail Research', domain: 'sailresearch.com' },
  { name: 'Vapi', domain: 'vapi.ai' },
  { name: 'Weaviate', domain: 'weaviate.io' },
  { name: 'Aembit', domain: 'aembit.io' },
  { name: 'Augment Code', domain: 'augmentcode.com' },
  { name: 'Bolna', domain: 'bolna.ai' },
  { name: 'Cartesia', domain: 'cartesia.ai' },
  { name: 'DeepInfra', domain: 'deepinfra.com' },
  { name: 'Descope', domain: 'descope.com' },
  { name: 'Dust', domain: 'dust.tt' },
  { name: 'Exa', domain: 'exa.ai' },
  { name: 'Fal', domain: 'fal.ai' },
  { name: 'Graphite', domain: 'graphite.dev' },
  { name: 'Hebbia', domain: 'hebbia.ai' },
  { name: 'Marqo', domain: 'marqo.ai' },
  { name: 'Reducto', domain: 'reducto.ai' },
  { name: 'Rogo', domain: 'rogo.ai' },
  { name: 'RunPod', domain: 'runpod.io' },
  { name: 'Superlinked', domain: 'superlinked.com' },
  { name: 'Tavily', domain: 'tavily.com' },
  { name: 'Zilliz', domain: 'zilliz.com' },
  { name: 'Factory', domain: 'factory.ai' },
  { name: 'Gnani AI', domain: 'gnani.ai' },
  { name: 'Greptile', domain: 'greptile.com' },
  { name: 'Gumloop', domain: 'gumloop.com' },
  { name: 'Maven AGI', domain: 'mavenagi.com' },
  { name: 'Mintlify', domain: 'mintlify.com' },
  { name: 'Oasis Security', domain: 'oasis.security' },
  { name: 'Observe.AI', domain: 'observe.ai' },
  { name: 'Qodo', domain: 'qodo.ai' },
  { name: 'Synthflow', domain: 'synthflow.ai' },
  { name: 'Upwind Security', domain: 'upwind.io' },
  { name: 'Yellow.ai', domain: 'yellow.ai' },
  { name: 'You.com', domain: 'you.com' },
  { name: 'Corti', domain: 'corti.ai' },
  { name: 'Harmonic Security', domain: 'harmonic.security' },
  { name: 'Tenex.AI', domain: 'tenex.ai' },
  { name: 'Fireworks AI', domain: 'fireworks.ai' },
  { name: 'Ada', domain: 'ada.cx' },
  { name: 'Saviynt', domain: 'saviynt.com' },
  { name: 'Uniphore', domain: 'uniphore.com' },
  { name: 'Activeloop', domain: 'activeloop.ai' },
  { name: 'Adept AI', domain: 'adept.ai' },
  { name: 'Cognition', domain: 'cognition.ai' },
  { name: 'Composio', domain: 'composio.dev' },
  { name: 'Contextual AI', domain: 'contextual.ai' },
  { name: 'Deepset', domain: 'deepset.ai' },
  { name: 'Ema', domain: 'ema.ai' },
  { name: 'Essential AI', domain: 'essential.ai' },
  { name: 'Fixie', domain: 'fixie.ai' },
  { name: 'Imbue', domain: 'imbue.com' },
  { name: 'Krutrim', domain: 'olakrutrim.com' },
  { name: 'Lovable', domain: 'lovable.dev' },
  { name: 'Mercor', domain: 'mercor.com' },
  { name: 'Nscale', domain: 'nscale.com' },
  { name: 'Patronus AI', domain: 'patronus.ai' },
  { name: 'Poolside', domain: 'poolside.ai' },
  { name: 'Prime Intellect', domain: 'primeintellect.ai' },
  { name: 'Qure.ai', domain: 'qure.ai' },
  { name: 'Resolve AI', domain: 'resolve.ai' },
  { name: 'Writer', domain: 'writer.com' },
  { name: 'Browserbase', domain: 'browserbase.com' },
  { name: 'Eventual Treasury', domain: 'eventualtreasury.com' },
  { name: 'Loop AI', domain: 'loopai.com' },
  { name: '8club', domain: '8club.co' },
  { name: 'ZZAZZ', domain: 'zzazz.com' },
  { name: 'Smallest AI', domain: 'smallest.ai' },
  { name: 'Wisdom AI', domain: 'wisdom.ai' },
];
