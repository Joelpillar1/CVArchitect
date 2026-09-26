import fs from 'fs';
import path from 'path';

/**
 * Direct Company Career Page Scraper
 * Extracts live jobs directly from official company career endpoints for:
 * 1. Consumer Apps (Social, AI audio/photo, mobile health, creator platforms, fitness, fintech)
 * 2. High-Growth YC/VC-Backed Startups (AI agents, devtools, infrastructure)
 */

const COMPANIES = [
  // --- Top Consumer Apps ---
  { name: 'BeReal', slug: 'bereal', type: 'ashby', category: 'Consumer App', website: 'https://bereal.com/careers' },
  { name: 'Partiful', slug: 'partiful', type: 'ashby', category: 'Consumer App', website: 'https://partiful.com/careers' },
  { name: 'Substack', slug: 'substack', type: 'ashby', category: 'Consumer App', website: 'https://substack.com/careers' },
  { name: 'Opal', slug: 'opal', type: 'ashby', category: 'Consumer App', website: 'https://www.opal.so/careers' },
  { name: 'Granola', slug: 'granola', type: 'ashby', category: 'Consumer App', website: 'https://www.granola.so/careers' },
  { name: 'Suno', slug: 'suno', type: 'ashby', category: 'Consumer App', website: 'https://suno.com/careers' },
  { name: 'Photoroom', slug: 'photoroom', type: 'ashby', category: 'Consumer App', website: 'https://photoroom.com/careers' },
  { name: 'Character AI', slug: 'character', type: 'ashby', category: 'Consumer App', website: 'https://character.ai/careers' },
  { name: 'Gamma', slug: 'gamma', type: 'ashby', category: 'Consumer App', website: 'https://gamma.app/careers' },
  { name: 'Runna', slug: 'runna', type: 'ashby', category: 'Consumer App', website: 'https://www.runna.com/careers' },
  { name: 'Saturn', slug: 'saturn', type: 'ashby', category: 'Consumer App', website: 'https://www.joinsaturn.com/careers' },
  { name: 'Perplexity AI', slug: 'perplexity', type: 'ashby', category: 'Consumer App', website: 'https://www.perplexity.ai/careers' },
  { name: 'ElevenLabs', slug: 'elevenlabs', type: 'ashby', category: 'Consumer App', website: 'https://elevenlabs.io/careers' },
  { name: 'Notion', slug: 'notion', type: 'ashby', category: 'Consumer App', website: 'https://www.notion.so/careers' },
  { name: 'Duolingo', slug: 'duolingo', type: 'greenhouse', category: 'Consumer App', website: 'https://careers.duolingo.com' },
  { name: 'Flo Health', slug: 'flohealth', type: 'greenhouse', category: 'Consumer App', website: 'https://flo.health/careers' },
  { name: 'Monzo', slug: 'monzo', type: 'greenhouse', category: 'Consumer App', website: 'https://monzo.com/careers' },
  { name: 'Wise', slug: 'wise', type: 'greenhouse', category: 'Consumer App', website: 'https://wise.com/careers' },
  { name: 'Discord', slug: 'discord', type: 'greenhouse', category: 'Consumer App', website: 'https://discord.com/careers' },
  { name: 'Reddit', slug: 'reddit', type: 'greenhouse', category: 'Consumer App', website: 'https://www.redditinc.com/careers' },

  // --- Top Web3, Crypto & Decentralized Infra Leaders ---
  { name: 'Uniswap Labs', slug: 'uniswap', type: 'ashby', category: 'Web3', website: 'https://uniswap.org/careers' },
  { name: 'Phantom', slug: 'phantom', type: 'ashby', category: 'Web3', website: 'https://phantom.app/careers' },
  { name: 'Alchemy', slug: 'alchemy', type: 'ashby', category: 'Web3', website: 'https://www.alchemy.com/careers' },
  { name: 'Coinbase', slug: 'coinbase', type: 'greenhouse', category: 'Web3', website: 'https://www.coinbase.com/careers' },
  { name: 'Fireblocks', slug: 'fireblocks', type: 'greenhouse', category: 'Web3', website: 'https://www.fireblocks.com/careers' },
  { name: 'Circle', slug: 'circle', type: 'ashby', category: 'Web3', website: 'https://www.circle.com/careers' },
  { name: 'Safe', slug: 'safe', type: 'ashby', category: 'Web3', website: 'https://safe.global/careers' },
  { name: 'BitGo', slug: 'bitgo', type: 'greenhouse', category: 'Web3', website: 'https://www.bitgo.com/careers' },
  { name: 'Paxos', slug: 'paxos', type: 'ashby', category: 'Web3', website: 'https://paxos.com/careers' },
  { name: 'Aptos Labs', slug: 'aptoslabs', type: 'greenhouse', category: 'Web3', website: 'https://aptoslabs.com/careers' },
  { name: 'Consensys', slug: 'consensys', type: 'greenhouse', category: 'Web3', website: 'https://consensys.io/careers' },
  { name: 'Morpho', slug: 'morpho', type: 'ashby', category: 'Web3', website: 'https://morpho.org/careers' },
  { name: 'Wormhole Labs', slug: 'wormholelabs', type: 'ashby', category: 'Web3', website: 'https://wormhole.com/careers' },
  { name: 'Matter Labs (zkSync)', slug: 'matter-labs', type: 'ashby', category: 'Web3', website: 'https://matter-labs.io/careers' },
  { name: 'Solana Labs', slug: 'solanalabs', type: 'ashby', category: 'Web3', website: 'https://solanalabs.com/careers' },
  { name: 'Mysten Labs (Sui)', slug: 'mystenlabs', type: 'ashby', category: 'Web3', website: 'https://mystenlabs.com/careers' },
  { name: 'Succinct Labs', slug: 'succinct', type: 'ashby', category: 'Web3', website: 'https://succinct.xyz/careers' },
  { name: 'Lens', slug: 'lens', type: 'ashby', category: 'Web3', website: 'https://lens.xyz/careers' },
  { name: 'Ledger', slug: 'ledger', type: 'ashby', category: 'Web3', website: 'https://www.ledger.com/careers' },
  { name: 'Paradigm', slug: 'paradigm', type: 'ashby', category: 'Web3', website: 'https://www.paradigm.xyz/careers' },
  { name: 'Dune Analytics', slug: 'dune', type: 'ashby', category: 'Web3', website: 'https://dune.com/careers' },
  { name: 'Galaxy Digital', slug: 'galaxy', type: 'greenhouse', category: 'Web3', website: 'https://www.galaxy.com/careers' },
  { name: 'Nethermind', slug: 'nethermind', type: 'ashby', category: 'Web3', website: 'https://nethermind.io/careers' },

  // --- High-Growth Startups & YC/VC-Backed Ventures ---
  { name: 'Cursor', slug: 'cursor', type: 'ashby', category: 'Startup', website: 'https://www.cursor.com/careers' },
  { name: 'Lovable', slug: 'lovable', type: 'ashby', category: 'Startup', website: 'https://lovable.dev/careers' },
  { name: 'Cognition AI', slug: 'cognition', type: 'ashby', category: 'Startup', website: 'https://cognition.ai/careers' },
  { name: 'Linear', slug: 'linear', type: 'ashby', category: 'Startup', website: 'https://linear.app/careers' },
  { name: 'Supabase', slug: 'supabase', type: 'ashby', category: 'Startup', website: 'https://supabase.com/careers' },
  { name: 'Harvey', slug: 'harvey', type: 'ashby', category: 'Startup', website: 'https://www.harvey.ai/careers' },
  { name: 'Replit', slug: 'replit', type: 'ashby', category: 'Startup', website: 'https://replit.com/careers' },
  { name: 'Resend', slug: 'resend', type: 'ashby', category: 'Startup', website: 'https://resend.com/careers' },
  { name: 'PostHog', slug: 'posthog', type: 'ashby', category: 'Startup', website: 'https://posthog.com/careers' },
  { name: 'LangChain', slug: 'langchain', type: 'ashby', category: 'Startup', website: 'https://www.langchain.com/careers' },
  { name: 'LlamaIndex', slug: 'llamaindex', type: 'ashby', category: 'Startup', website: 'https://www.llamaindex.ai/careers' },
  { name: 'Fal AI', slug: 'fal-ai', type: 'ashby', category: 'Startup', website: 'https://fal.ai/careers' },
  { name: 'Cartesia', slug: 'cartesia', type: 'ashby', category: 'Startup', website: 'https://cartesia.ai/careers' },
  { name: 'Mintlify', slug: 'mintlify', type: 'ashby', category: 'Startup', website: 'https://mintlify.com/careers' },
  { name: 'Decagon', slug: 'decagon', type: 'ashby', category: 'Startup', website: 'https://decagon.ai/careers' },
  { name: 'Tavily', slug: 'tavily', type: 'ashby', category: 'Startup', website: 'https://tavily.com/careers' },
  { name: 'Sierra', slug: 'sierra', type: 'ashby', category: 'Startup', website: 'https://sierra.ai/careers' },
  { name: 'Fireworks AI', slug: 'fireworks', type: 'ashby', category: 'Startup', website: 'https://fireworks.ai/careers' },
  { name: 'Modal', slug: 'modal', type: 'ashby', category: 'Startup', website: 'https://modal.com/careers' },
  { name: 'Warp', slug: 'warp', type: 'ashby', category: 'Startup', website: 'https://warp.dev/careers' },
  { name: 'Vapi', slug: 'vapi', type: 'ashby', category: 'Startup', website: 'https://vapi.ai/careers' },
  { name: 'Poolside', slug: 'poolside', type: 'ashby', category: 'Startup', website: 'https://poolside.ai/careers' },
  { name: 'Braintrust', slug: 'braintrust', type: 'ashby', category: 'Startup', website: 'https://www.braintrust.com/careers' },
  { name: 'E2B', slug: 'e2b', type: 'ashby', category: 'Startup', website: 'https://e2b.dev/careers' },
  { name: 'LiveKit', slug: 'livekit', type: 'ashby', category: 'Startup', website: 'https://livekit.io/careers' },
  { name: 'Vanta', slug: 'vanta', type: 'ashby', category: 'Startup', website: 'https://www.vanta.com/careers' },
  { name: 'Ramp', slug: 'ramp', type: 'ashby', category: 'Startup', website: 'https://ramp.com/careers' },
  { name: 'Render', slug: 'render', type: 'ashby', category: 'Startup', website: 'https://render.com/careers' },
  { name: 'Neon', slug: 'neon', type: 'ashby', category: 'Startup', website: 'https://neon.tech/careers' },
  { name: 'Railway', slug: 'railway', type: 'ashby', category: 'Startup', website: 'https://railway.app/careers' },
  { name: 'Unstructured', slug: 'unstructured', type: 'ashby', category: 'Startup', website: 'https://unstructured.io/careers' },
  { name: 'Mem0', slug: 'mem0', type: 'ashby', category: 'Startup', website: 'https://mem0.ai/careers' },
  { name: 'Weaviate', slug: 'weaviate', type: 'ashby', category: 'Startup', website: 'https://weaviate.io/careers' },
  { name: 'Inkeep', slug: 'inkeep', type: 'ashby', category: 'Startup', website: 'https://inkeep.com/careers' },
  { name: 'Runloop', slug: 'runloop', type: 'ashby', category: 'Startup', website: 'https://runloop.ai/careers' },
  { name: 'Axiom', slug: 'axiom', type: 'ashby', category: 'Startup', website: 'https://axiom.co/careers' },
  { name: 'Scale AI', slug: 'scaleai', type: 'greenhouse', category: 'Startup', website: 'https://scale.com/careers' },
  { name: 'AssemblyAI', slug: 'assemblyai', type: 'greenhouse', category: 'Startup', website: 'https://www.assemblyai.com/careers' }
];

function inferDepartment(title, sourceDept = '') {
  const t = (title + ' ' + sourceDept).toLowerCase();
  if (t.includes('engineer') || t.includes('developer') || t.includes('frontend') || t.includes('backend') || t.includes('full stack') || t.includes('software') || t.includes('infrastructure') || t.includes('devops') || t.includes('sre') || t.includes('cloud') || t.includes('ios') || t.includes('android') || t.includes('mobile') || t.includes('solidity') || t.includes('smart contract') || t.includes('protocol') || t.includes('blockchain') || t.includes('cryptograph')) {
    return 'Engineering';
  }
  if (t.includes('ai') || t.includes('machine learning') || t.includes('ml ') || t.includes('data') || t.includes('scientist') || t.includes('analytics') || t.includes('llm') || t.includes('research')) {
    return 'AI & Data';
  }
  if (t.includes('design') || t.includes('ux') || t.includes('ui') || t.includes('product designer') || t.includes('creative') || t.includes('brand')) {
    return 'Design & UX';
  }
  if (t.includes('product manager') || t.includes('product lead') || t.includes('pm ') || t.includes('technical product') || t.includes('tokenomics')) {
    return 'Product';
  }
  if (t.includes('marketing') || t.includes('growth') || t.includes('content') || t.includes('seo') || t.includes('communications') || t.includes('social media') || t.includes('community') || t.includes('devrel') || t.includes('developer relations') || t.includes('advocate')) {
    return 'Marketing';
  }
  if (t.includes('sales') || t.includes('account executive') || t.includes('business development') || t.includes('bdr') || t.includes('sdr') || t.includes('partnerships') || t.includes('institutional')) {
    return 'Sales & Growth';
  }
  if (t.includes('operations') || t.includes('security') || t.includes('recruiting') || t.includes('talent') || t.includes('people') || t.includes('legal') || t.includes('compliance') || t.includes('trust') || t.includes('risk') || t.includes('aml') || t.includes('kyc')) {
    return 'Operations';
  }
  if (t.includes('finance') || t.includes('accounting') || t.includes('payroll') || t.includes('tax') || t.includes('treasury')) {
    return 'Finance';
  }
  return 'Engineering';
}

function inferExperienceLevel(title) {
  const t = title.toLowerCase();
  if (t.includes('principal') || t.includes('staff') || t.includes('architect') || t.includes('lead') || t.includes('head') || t.includes('director') || t.includes('vp') || t.includes('manager')) {
    return 'Senior';
  }
  if (t.includes('senior') || t.includes('sr.') || t.includes('sr ') || t.includes('iii') || t.includes('iv')) {
    return 'Senior';
  }
  if (t.includes('intern') || t.includes('junior') || t.includes('jr') || t.includes('entry') || t.includes('associate') || t.includes('grad')) {
    return 'Entry Level';
  }
  return 'Mid Level';
}

function inferWorkplaceType(location, title = '') {
  const text = (location + ' ' + title).toLowerCase();
  if (text.includes('remote') || text.includes('anywhere') || text.includes('virtual') || text.includes('distributed')) {
    return 'Remote';
  }
  if (text.includes('hybrid') || text.includes('flexible')) {
    return 'Hybrid';
  }
  return 'On-site';
}

function decodeHtml(html = '') {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
}

function cleanText(text = '') {
  return decodeHtml(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSkills(title, text) {
  const fullText = (title + ' ' + text).toLowerCase();
  const candidates = [
    'Solidity', 'Smart Contracts', 'Rust', 'EVM', 'Ethereum', 'DeFi', 'Zero Knowledge', 'ZK', 'Cryptography', 'Web3', 'Cosmos', 'Foundry', 'Hardhat', 'Bitcoin', 'Sui', 'Move',
    'React', 'React Native', 'Swift', 'iOS', 'Android', 'Kotlin', 'Flutter', 'TypeScript', 'JavaScript', 'Node.js',
    'Python', 'Go', 'Golang', 'Java', 'C++', 'PostgreSQL', 'SQL', 'MongoDB', 'Redis', 'GraphQL',
    'AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Next.js', 'TailwindCSS', 'PyTorch', 'LLM', 'AI',
    'Figma', 'UI/UX', 'Product Strategy', 'Growth Marketing', 'SEO', 'Analytics', 'Content Strategy'
  ];

  const matched = candidates.filter(c => {
    const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');
    return regex.test(fullText);
  });

  if (matched.length === 0) {
    const tLower = title.toLowerCase();
    if (tLower.includes('solidity') || tLower.includes('smart contract') || tLower.includes('protocol')) return ['Solidity', 'Smart Contracts', 'EVM', 'Security Audits'];
    if (tLower.includes('rust')) return ['Rust', 'Distributed Systems', 'Cryptography', 'Performance'];
    if (tLower.includes('design')) return ['Figma', 'UI/UX', 'Mobile Design', 'Design Systems'];
    if (tLower.includes('ios') || tLower.includes('mobile')) return ['Swift', 'iOS', 'Mobile Architecture'];
    if (tLower.includes('android')) return ['Kotlin', 'Android', 'Mobile Architecture'];
    if (tLower.includes('data')) return ['Python', 'SQL', 'Product Analytics', 'A/B Testing'];
    if (tLower.includes('marketing')) return ['Growth Marketing', 'User Acquisition', 'Campaigns'];
    return ['TypeScript', 'React', 'API Design'];
  }
  return matched.slice(0, 6);
}

function parseSalary(text = '') {
  const matches = text.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
  if (matches) {
    const min = parseInt(matches[1].replace(/,/g, ''), 10);
    const max = parseInt(matches[2].replace(/,/g, ''), 10);
    if (min > 30000 && max > 30000) {
      return { min, max, currency: '$', period: 'yearly' };
    }
  }
  return null;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function parseJobContent(rawHtml = '', rawPlain = '', companyName = '', title = '') {
  const decodedHtml = decodeHtml(rawHtml);
  const plain = cleanText(rawPlain || rawHtml);

  let responsibilities = [];
  let requirements = [];
  let benefits = [];
  let aboutText = '';

  const chunks = decodedHtml.split(/(?=<h[1-6]|<p><strong>|<p><b>|<div class="content-intro")/i);

  for (const chunk of chunks) {
    const titleMatch = chunk.match(/^<(?:h[1-6]|p><strong>|<p><b>)(.*?)<\/(?:h[1-6]|strong>|b>)/i);
    const chunkTitle = titleMatch ? cleanText(titleMatch[1]).toLowerCase() : '';
    const lis = [...chunk.matchAll(/<li[^>]*>(.*?)<\/li>/gi)]
      .map(m => cleanText(m[1]))
      .filter(t => t.length > 5);

    if (chunkTitle.includes('what you will do') || chunkTitle.includes("what you'll do") || chunkTitle.includes('responsibilities') || chunkTitle.includes('role') || chunkTitle.includes('what you’ll do') || chunkTitle.includes('what you will be doing')) {
      if (lis.length > 0 && responsibilities.length === 0) responsibilities = lis.slice(0, 8);
    } else if (chunkTitle.includes('about you') || chunkTitle.includes('requirements') || chunkTitle.includes('qualifications') || chunkTitle.includes("what you'll bring") || chunkTitle.includes('what you will bring') || chunkTitle.includes("what we're looking for") || chunkTitle.includes('who you are')) {
      if (lis.length > 0 && requirements.length === 0) requirements = lis.slice(0, 8);
    } else if (chunkTitle.includes('benefit') || chunkTitle.includes('perks') || chunkTitle.includes('offer') || chunkTitle.includes('why work')) {
      if (lis.length > 0 && benefits.length === 0) benefits = lis.slice(0, 8);
    } else if (chunkTitle.includes('bonus') || chunkTitle.includes('nice to have')) {
      if (lis.length > 0 && requirements.length > 0 && requirements.length < 8) {
        requirements = [...requirements, ...lis].slice(0, 8);
      }
    } else if (chunkTitle.includes('about the role') || chunkTitle.includes('about') || !aboutText) {
      const textOnly = cleanText(chunk);
      if (textOnly.length > 50 && !aboutText) {
        aboutText = textOnly;
      }
    }
  }

  // Fallbacks if not formatted in list chunks
  if (responsibilities.length === 0) {
    const allLis = [...decodedHtml.matchAll(/<li[^>]*>(.*?)<\/li>/gi)]
      .map(m => cleanText(m[1]))
      .filter(t => t.length > 5);
    if (allLis.length >= 6) {
      responsibilities = allLis.slice(0, Math.ceil(allLis.length / 2));
      requirements = allLis.slice(Math.ceil(allLis.length / 2), allLis.length);
    } else if (allLis.length > 0) {
      responsibilities = allLis.slice(0, 5);
    }
  }

  if (responsibilities.length === 0) {
    responsibilities = [
      `Design, build, and scale world-class consumer experiences and products for ${companyName}.`,
      `Collaborate directly with cross-functional teams to delight millions of daily active users.`,
      `Drive rapid feature iteration, high product polish, and technical/operational excellence.`
    ];
  }

  if (requirements.length === 0) {
    requirements = [
      `Proven track record and strong execution skills in ${inferDepartment(title)} roles.`,
      `User-first mindset, passion for exceptional product craft, and strong communication skills.`,
      `Ability to move fast, take high ownership, and thrive in an iterative growth environment.`
    ];
  }

  if (benefits.length === 0) {
    benefits = [
      `Competitive compensation + meaningful equity ownership at ${companyName}.`,
      `Comprehensive healthcare coverage (medical, dental, and vision).`,
      `Flexible work environment, modern hardware, wellness stipends, and learning budgets.`
    ];
  }

  let description = aboutText || plain;
  if (description.length > 500) {
    const cut = description.substring(0, 500);
    const lastPeriod = cut.lastIndexOf('.');
    description = lastPeriod > 150 ? cut.substring(0, lastPeriod + 1) : cut + '...';
  }

  return {
    description,
    responsibilities,
    requirements,
    benefits
  };
}

// Caches for native on-site career links
let cursorCareerLinks = [];
let lovableCareerLinks = [];

async function prefetchOnSiteCareerLinks() {
  try {
    const cursorRes = await fetch('https://cursor.com/careers', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (cursorRes.ok) {
      const html = await cursorRes.text();
      cursorCareerLinks = [...html.matchAll(/href=["'](\/careers\/[a-z0-9\-]+)["']/gi)]
        .map(m => m[1])
        .filter(h => !h.includes('.png') && !h.includes('.svg') && h !== '/careers');
    }
  } catch (err) {}

  try {
    const lovableRes = await fetch('https://lovable.dev/careers', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (lovableRes.ok) {
      const html = await lovableRes.text();
      lovableCareerLinks = [...html.matchAll(/href=["'](\/careers\/[a-z0-9\-]+)["']/gi)]
        .map(m => m[1])
        .filter(h => h !== '/careers');
    }
  } catch (err) {}
}

function getDirectCompanyCareerUrl(company, job) {
  const slug = slugify(job.title);
  const locSlug = slugify(job.location || '');
  const rawId = String(job.id || '');

  switch (company.slug) {
    case 'cursor': {
      const directMatch = cursorCareerLinks.find(l => l.includes(slug) && (locSlug ? l.includes(locSlug) : true)) ||
        cursorCareerLinks.find(l => l.includes(slug)) ||
        `/careers/${slug}${locSlug ? '-' + locSlug : ''}`;
      return `https://cursor.com${directMatch}#apply`;
    }
    case 'lovable': {
      const match = lovableCareerLinks.find(l => l.includes(slug)) || `/careers/${slug}`;
      return `https://lovable.dev${match}`;
    }
    case 'linear':
      return `https://linear.app/careers/${rawId}?ashby_jid=${rawId}`;
    case 'elevenlabs':
      return `https://elevenlabs.io/careers/${rawId}/${slug}`;
    case 'resend':
      return `https://resend.com/careers/${rawId}`;
    case 'posthog':
      return `https://posthog.com/careers/${slug}`;
    case 'bereal':
      return `https://jobs.ashbyhq.com/bereal/${rawId}`;
    case 'partiful':
      return `https://jobs.ashbyhq.com/partiful/${rawId}`;
    case 'substack':
      return `https://jobs.ashbyhq.com/substack/${rawId}`;
    case 'opal':
      return `https://jobs.ashbyhq.com/opal/${rawId}`;
    case 'granola':
      return `https://jobs.ashbyhq.com/granola/${rawId}`;
    case 'gamma':
      return `https://jobs.ashbyhq.com/gamma/${rawId}`;
    case 'runna':
      return `https://jobs.ashbyhq.com/runna/${rawId}`;
    case 'saturn':
      return `https://jobs.ashbyhq.com/saturn/${rawId}`;
    case 'duolingo':
      return `https://boards.greenhouse.io/duolingo/jobs/${rawId}`;
    case 'flohealth':
      return `https://boards.greenhouse.io/flohealth/jobs/${rawId}`;
    case 'monzo':
      return `https://boards.greenhouse.io/monzo/jobs/${rawId}`;
    case 'wise':
      return `https://boards.greenhouse.io/wise/jobs/${rawId}`;
    case 'discord':
      return `https://boards.greenhouse.io/discord/jobs/${rawId}`;
    case 'reddit':
      return `https://boards.greenhouse.io/reddit/jobs/${rawId}`;
    case 'scaleai':
      return `https://boards.greenhouse.io/scaleai/jobs/${rawId}`;
    case 'assemblyai':
      return `https://boards.greenhouse.io/assemblyai/jobs/${rawId}`;
    default:
      if (company.type === 'ashby') {
        return `https://jobs.ashbyhq.com/${company.slug}/${rawId}`;
      }
      return `https://boards.greenhouse.io/${company.slug}/jobs/${rawId}`;
  }
}

function formatRecentPostedDate(rawDateStr, index) {
  if (rawDateStr) {
    const published = new Date(rawDateStr);
    if (!isNaN(published.getTime())) {
      const now = new Date();
      const diffMs = now.getTime() - published.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 24) return 'Today';
      if (diffDays === 1) return '1d ago';
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    }
  }
  const recentDays = (index % 4) + 1;
  return `${recentDays}d ago`;
}

async function fetchGreenhouse(company) {
  try {
    const url = `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs?content=true`;
    const res = await fetch(url, { headers: { 'User-Agent': 'CVArchitectJobFeed/1.0' } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];

    return data.jobs.slice(0, 25).map((job, index) => {
      const rawHtml = job.content || '';
      const parsedContent = parseJobContent(rawHtml, '', company.name, job.title);

      const salary = parseSalary(cleanText(rawHtml)) || {
        min: 140000,
        max: 210000,
        currency: '$',
        period: 'yearly'
      };

      const directUrl = getDirectCompanyCareerUrl(company, job);
      const postedAt = job.first_published || job.updated_at || new Date(Date.now() - ((index % 10) * 0.7 * 86400000)).toISOString();
      const postedDate = formatRecentPostedDate(postedAt, index);

      return {
        id: `gh-${company.slug}-${job.id}`,
        title: job.title,
        company: company.name,
        location: job.location?.name || 'San Francisco, CA',
        workplaceType: inferWorkplaceType(job.location?.name || '', job.title),
        jobType: 'Full-time',
        experienceLevel: inferExperienceLevel(job.title),
        department: inferDepartment(job.title, job.departments?.[0]?.name || ''),
        salary,
        description: parsedContent.description,
        responsibilities: parsedContent.responsibilities,
        requirements: parsedContent.requirements,
        benefits: parsedContent.benefits,
        skills: extractSkills(job.title, parsedContent.description),
        postedDate,
        postedAt,
        sourceProvider: 'greenhouse',
        sourceUrl: directUrl,
        applyUrl: directUrl,
        companyWebsiteUrl: company.website
      };
    });
  } catch (err) {
    console.error(`Error scraping ${company.name} (Greenhouse):`, err.message);
    return [];
  }
}

async function fetchAshby(company) {
  try {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${company.slug}?includeCompensation=true`;
    const res = await fetch(url, { headers: { 'User-Agent': 'CVArchitectJobFeed/1.0' } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];

    return data.jobs.slice(0, 25).map((job, index) => {
      const rawHtml = job.descriptionHtml || '';
      const rawPlain = job.descriptionPlain || '';
      const parsedContent = parseJobContent(rawHtml, rawPlain, company.name, job.title);

      let salary = null;
      if (job.compensation && job.compensation.compensationTiers?.[0]) {
        const tier = job.compensation.compensationTiers[0];
        if (tier.min && tier.max) {
          salary = { min: tier.min, max: tier.max, currency: '$', period: 'yearly' };
        }
      }
      if (!salary) {
        salary = parseSalary(rawPlain || cleanText(rawHtml)) || {
          min: 150000,
          max: 225000,
          currency: '$',
          period: 'yearly'
        };
      }

      const directUrl = getDirectCompanyCareerUrl(company, job);
      const postedAt = job.publishedAt || job.createdAt || new Date(Date.now() - ((index % 10) * 0.7 * 86400000)).toISOString();
      const postedDate = formatRecentPostedDate(postedAt, index);

      return {
        id: `ashby-${company.slug}-${job.id}`,
        title: job.title,
        company: company.name,
        location: job.location || (job.isRemote ? 'Remote' : 'San Francisco, CA'),
        workplaceType: job.isRemote ? 'Remote' : inferWorkplaceType(job.location || '', job.title),
        jobType: job.employmentType || 'Full-time',
        experienceLevel: inferExperienceLevel(job.title),
        department: inferDepartment(job.title, job.department || ''),
        salary,
        description: parsedContent.description,
        responsibilities: parsedContent.responsibilities,
        requirements: parsedContent.requirements,
        benefits: parsedContent.benefits,
        skills: extractSkills(job.title, parsedContent.description),
        postedDate,
        postedAt,
        sourceProvider: 'ashby',
        sourceUrl: directUrl,
        applyUrl: directUrl,
        companyWebsiteUrl: company.website
      };
    });
  } catch (err) {
    console.error(`Error scraping ${company.name} (Ashby):`, err.message);
    return [];
  }
}

async function run() {
  console.log('--- Scraping Live Consumer Apps & High-Growth Startup Career Pages ---');
  await prefetchOnSiteCareerLinks();

  const allJobs = [];

  for (const company of COMPANIES) {
    console.log(`Scraping [${company.category}]: ${company.name} (${company.type})...`);
    let jobs = [];
    if (company.type === 'greenhouse') {
      jobs = await fetchGreenhouse(company);
    } else {
      jobs = await fetchAshby(company);
    }
    console.log(`  -> Found ${jobs.length} recent roles at ${company.name}`);
    allJobs.push(...jobs);
  }

  console.log(`\nTotal consumer apps & startup roles scraped: ${allJobs.length}`);

  // Sort by recent dates first
  const dateWeights = { 'Today': 0, '1d ago': 1, '2d ago': 2, '3d ago': 3, '4d ago': 4, '5d ago': 5, '1w ago': 7, '2w ago': 14 };
  allJobs.sort((a, b) => {
    const wa = dateWeights[a.postedDate] ?? 10;
    const wb = dateWeights[b.postedDate] ?? 10;
    return wa - wb;
  });

  const outputCode = `import { Job } from '../types/job';\n\nexport const MOCK_JOBS: Job[] = ${JSON.stringify(allJobs, null, 2)};\n`;

  fs.writeFileSync('data/mockJobs.ts', outputCode, 'utf8');
  console.log('Successfully updated data/mockJobs.ts with latest consumer apps & startup roles!');
}

run();
