import type { ResumeData, Experience, Project } from '../types';
import { parseDescriptionBullets, parseAchievementBullets, stripMarkdown } from './templateUtils';

export type ActionVerbDomain =
  | 'engineering'
  | 'design'
  | 'product'
  | 'marketing'
  | 'sales'
  | 'finance'
  | 'operations'
  | 'leadership'
  | 'general';

/**
 * Categorized Master Action Verbs (250+ recruiter-approved, high-impact verbs).
 */
export const ACTION_VERBS_BY_CATEGORY: Record<string, string[]> = {
  leadership: [
    'Spearheaded',
    'Orchestrated',
    'Championed',
    'Directed',
    'Mobilized',
    'Guided',
    'Steered',
    'Headed',
    'Empowered',
    'Mentored',
    'Delegated',
    'Coordinated',
    'Governed',
    'Chaired',
    'Unified',
    'Cultivated',
    'Fostered',
    'Inspired',
    'Supervised',
    'Advised',
  ],
  engineering: [
    'Architected',
    'Engineered',
    'Developed',
    'Deployed',
    'Programmed',
    'Automated',
    'Configured',
    'Integrated',
    'Migrated',
    'Refactored',
    'Containerized',
    'Constructed',
    'Provisioned',
    'Standardized',
    'Implemented',
    'Secured',
    'Optimized',
    'Instrumented',
    'Benchmarked',
    'Synthesized',
    'Hardened',
    'Scaled',
    'Overhauled',
    'Decoupled',
  ],
  design: [
    'Designed',
    'Conceptualized',
    'Prototyped',
    'Wireframed',
    'Iterated',
    'Visualized',
    'Crafted',
    'Standardized',
    'Reimagined',
    'Authored',
    'Mapped',
    'Revamped',
    'Harmonized',
    'Streamlined',
    'Modernized',
    'Structured',
    'Curated',
    'Illustrated',
    'Validated',
    'Pioneered',
  ],
  product: [
    'Pioneered',
    'Launched',
    'Formulated',
    'Strategized',
    'Prioritized',
    'Delivered',
    'Defined',
    'Executed',
    'Introduced',
    'Scaled',
    'Accelerated',
    'Transformed',
    'Disrupted',
    'Spearheaded',
    'Rolled out',
    'Positioned',
    'Navigated',
    'Orchestrated',
    'Established',
  ],
  optimization: [
    'Accelerated',
    'Streamlined',
    'Overhauled',
    'Optimized',
    'Maximized',
    'Reduced',
    'Minimized',
    'Enhanced',
    'Upgraded',
    'Modernized',
    'Refined',
    'Consolidated',
    'Boosted',
    'Amplified',
    'Expedited',
    'Eliminated',
    'Restructured',
    'Trimmed',
    'Elevated',
    'Sharpened',
  ],
  execution: [
    'Executed',
    'Delivered',
    'Implemented',
    'Completed',
    'Produced',
    'Dispatched',
    'Fulfilled',
    'Finalized',
    'Realized',
    'Enacted',
    'Resolved',
    'Attained',
    'Generated',
    'Achieved',
    'Surpassed',
    'Outperformed',
    'Instituted',
    'Maintained',
    'Succeeded',
    'Administered',
  ],
  growth_sales_marketing: [
    'Generated',
    'Negotiated',
    'Captured',
    'Acquired',
    'Secured',
    'Expanded',
    'Cultivated',
    'Converted',
    'Penetrated',
    'Closed',
    'Campaigned',
    'Promoted',
    'Attracted',
    'Monetized',
    'Outpaced',
    'Deepened',
    'Partnered',
    'Targeted',
    'Brokered',
    'Prospected',
  ],
  finance_analysis: [
    'Evaluated',
    'Benchmarked',
    'Audited',
    'Analyzed',
    'Forecasted',
    'Quantified',
    'Investigated',
    'Assessed',
    'Surveyed',
    'Modeled',
    'Appraised',
    'Calculated',
    'Reconciled',
    'Projected',
    'Formulated',
    'Diagnosed',
    'Identified',
    'Budgeted',
    'Arbitrated',
    'Extrapolated',
  ],
  collaboration_operations: [
    'Partnered',
    'Facilitated',
    'Unified',
    'Harmonized',
    'Synchronized',
    'Aligned',
    'Administered',
    'Coordinated',
    'Standardized',
    'Negotiated',
    'Mediated',
    'Liaised',
    'Maintained',
    'Mobilized',
    'Interfaced',
    'Consolidated',
    'Bridged',
    'Collaborated',
    'Streamlined',
  ],
};

/**
 * Weak / Passive verb blacklist and their executive power-verb replacements.
 */
export const WEAK_VERBS_BLACKLIST: Record<string, string[]> = {
  'helped': ['Spearheaded', 'Orchestrated', 'Facilitated', 'Accelerated', 'Coordinated'],
  'helped to': ['Spearheaded', 'Orchestrated', 'Engineered', 'Delivered'],
  'assisted': ['Partnered with', 'Collaborated on', 'Facilitated', 'Supported delivery of'],
  'assisted with': ['Co-architected', 'Co-engineered', 'Facilitated', 'Delivered'],
  'assisted in': ['Contributed to', 'Co-developed', 'Accelerated'],
  'worked on': ['Engineered', 'Architected', 'Designed', 'Constructed', 'Overhauled'],
  'worked with': ['Partnered with', 'Liaised with', 'Collaborated across', 'Aligned with'],
  'responsible for': ['Spearheaded', 'Directed', 'Owned', 'Governed', 'Managed'],
  'handled': ['Resolved', 'Streamlined', 'Administered', 'Executed', 'Managed'],
  'participated in': ['Contributed to', 'Co-authored', 'Executed', 'Mobilized'],
  'utilized': ['Leveraged', 'Integrated', 'Deployed', 'Applied', 'Implemented'],
  'used': ['Employed', 'Deployed', 'Integrated', 'Applied', 'Leveraged'],
  'supported': ['Reinforced', 'Championed', 'Maintained', 'Bolstered'],
  'served as': ['Led as', 'Operated as', 'Directed'],
  'involved in': ['Drove', 'Spearheaded', 'Engineered', 'Delivered'],
  'tried to': ['Initiated', 'Piloted', 'Pioneered'],
  'attempted': ['Piloted', 'Spearheaded', 'Initiated'],
  'tasked with': ['Commissioned to', 'Appointed to', 'Directed to'],
};

export function isWeakVerb(verbOrPhrase: string): boolean {
  if (!verbOrPhrase) return false;
  const clean = verbOrPhrase.toLowerCase().trim();
  return clean in WEAK_VERBS_BLACKLIST;
}

export function suggestPowerVerbReplacement(weakVerbOrPhrase: string, domain: ActionVerbDomain = 'general'): string[] {
  const clean = weakVerbOrPhrase.toLowerCase().trim();
  if (WEAK_VERBS_BLACKLIST[clean]) {
    return WEAK_VERBS_BLACKLIST[clean];
  }
  return getRecommendedActionVerbs({ domain, count: 4 });
}

export const ALL_ACTION_VERBS_FLAT = Array.from(
  new Set(Object.values(ACTION_VERBS_BY_CATEGORY).flat())
);

const ADVERB_PREFIXES = new Set([
  'successfully',
  'cross-functionally',
  'proactively',
  'consistently',
  'collaboratively',
  'strategically',
  'effectively',
  'independently',
  'efficiently',
  'continually',
  'directly',
  'globally',
  'rapidly',
  'agilely',
]);

/**
 * Normalizes a word to its canonical base verb form for matching.
 */
export function normalizeVerb(word: string): string {
  if (!word) return '';
  let w = word.toLowerCase().trim().replace(/[^a-z-]/g, '');
  if (!w) return '';

  // Handle common irregular forms
  const irregulars: Record<string, string> = {
    led: 'lead',
    built: 'build',
    drove: 'drive',
    ran: 'run',
    held: 'hold',
    wrote: 'write',
    spoke: 'speak',
    won: 'win',
    sold: 'sell',
    met: 'meet',
    grew: 'grow',
    made: 'make',
    cut: 'cut',
    overcame: 'overcome',
  };
  if (irregulars[w]) return irregulars[w];

  // Strip regular past tense -ed, -ing, -s
  if (w.endsWith('ied') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('ized') || w.endsWith('ised')) return w.slice(0, -1);
  if (w.endsWith('ed') && w.length > 4) {
    if (w.endsWith('ted') || w.endsWith('ded')) {
      const base = w.slice(0, -2);
      if (base.endsWith('t') || base.endsWith('d')) return base;
      return base + 'e';
    }
    if (w.endsWith('red') || w.endsWith('ned') || w.endsWith('led') || w.endsWith('med')) {
      return w.slice(0, -2);
    }
    return w.slice(0, -2);
  }
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);

  return w;
}

/**
 * Extracts the starting action verb from a bullet point.
 */
export function extractStartingVerb(bulletText: string): string | null {
  if (!bulletText) return null;
  const clean = stripMarkdown(bulletText)
    .replace(/^[•·\-*\d.)\s]+/, '')
    .trim();
  if (!clean) return null;

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  let firstWord = words[0].replace(/[^a-zA-Z-]/g, '');
  if (ADVERB_PREFIXES.has(firstWord.toLowerCase()) && words.length > 1) {
    firstWord = words[1].replace(/[^a-zA-Z-]/g, '');
  }

  if (firstWord.length < 3) return null;
  return firstWord;
}

export interface BulletInfo {
  text: string;
  section: string;
  companyOrTitle?: string;
  startingVerb: string | null;
  normalizedVerb: string | null;
}

/**
 * Extracts all active bullet points from across the entire ResumeData.
 */
export function getAllResumeBullets(data: ResumeData | null | undefined): BulletInfo[] {
  if (!data) return [];
  const results: BulletInfo[] = [];

  const addBullets = (raw: unknown, section: string, companyOrTitle?: string) => {
    const list = parseDescriptionBullets(raw as any);
    for (const b of list) {
      const text = b.trim();
      if (text.length > 0) {
        const verb = extractStartingVerb(text);
        results.push({
          text,
          section,
          companyOrTitle,
          startingVerb: verb,
          normalizedVerb: verb ? normalizeVerb(verb) : null,
        });
      }
    }
  };

  // 1. Experience-like sections
  const expSections: (keyof ResumeData)[] = [
    'experience',
    'leadership',
    'volunteering',
    'research',
    'teaching',
    'military',
    'clinicalExperience',
  ];
  for (const sec of expSections) {
    const items = data[sec];
    if (Array.isArray(items)) {
      for (const item of items as Experience[]) {
        const title = item.company || item.role || sec;
        addBullets(item.description, sec, title);
      }
    }
  }

  // 2. Projects-like sections
  const projSections: (keyof ResumeData)[] = [
    'projects',
    'portfolio',
    'caseStudies',
    'selectedWork',
  ];
  for (const sec of projSections) {
    const items = data[sec];
    if (Array.isArray(items)) {
      for (const item of items as Project[]) {
        const title = item.name || sec;
        addBullets(item.description, sec, title);
      }
    }
  }

  // 3. Bullet-list sections (keyAchievements, awards, publications, etc.)
  const bulletSections: (keyof ResumeData)[] = [
    'keyAchievements',
    'achievements',
    'awards',
    'publications',
    'conferencesSpeaking',
    'academicAchievements',
  ];
  for (const sec of bulletSections) {
    const val = data[sec];
    if (val) {
      const list = parseAchievementBullets(val as any);
      for (const b of list) {
        const text = b.trim();
        if (text.length > 0) {
          const verb = extractStartingVerb(text);
          results.push({
            text,
            section: sec,
            startingVerb: verb,
            normalizedVerb: verb ? normalizeVerb(verb) : null,
          });
        }
      }
    }
  }

  // 4. Custom Sections
  if (data.customSections) {
    for (const [id, custom] of Object.entries(data.customSections)) {
      if (custom.contentType === 'bullets' && custom.content) {
        addBullets(custom.content, `custom_${id}`, custom.title || id);
      }
    }
  }

  return results;
}

/**
 * Gets a set of all normalized action verbs currently active on the resume.
 */
export function getUsedStartingVerbs(data: ResumeData | null | undefined): Set<string> {
  const bullets = getAllResumeBullets(data);
  const verbs = new Set<string>();
  for (const b of bullets) {
    if (b.normalizedVerb) {
      verbs.add(b.normalizedVerb);
    }
    if (b.startingVerb) {
      verbs.add(b.startingVerb.toLowerCase());
    }
  }
  return verbs;
}

/**
 * Gets a set of action verbs used under a specific company/organization.
 */
export function getUsedStartingVerbsForCompany(
  data: ResumeData | null | undefined,
  companyOrTitle: string
): Set<string> {
  if (!companyOrTitle) return new Set();
  const bullets = getAllResumeBullets(data);
  const verbs = new Set<string>();
  const target = companyOrTitle.toLowerCase().trim();

  for (const b of bullets) {
    if (b.companyOrTitle && b.companyOrTitle.toLowerCase().trim() === target) {
      if (b.normalizedVerb) verbs.add(b.normalizedVerb);
      if (b.startingVerb) verbs.add(b.startingVerb.toLowerCase());
    }
  }
  return verbs;
}

/**
 * Detects domain/field based on role, company, or bullet text.
 */
export function detectActionVerbDomain(contextText: string): ActionVerbDomain {
  const lower = (contextText || '').toLowerCase();
  if (/\b(software|engineer|developer|backend|frontend|fullstack|devops|cloud|aws|kubernetes|api|database|microservice|python|typescript|react)\b/.test(lower)) {
    return 'engineering';
  }
  if (/\b(design|ui|ux|product designer|visual designer|figma|prototyp|wirefram|user research|interaction)\b/.test(lower)) {
    return 'design';
  }
  if (/\b(product manager|pm|product owner|scrum|roadmap|feature backlog|user stories|product strategy)\b/.test(lower)) {
    return 'product';
  }
  if (/\b(marketing|seo|sem|growth|campaign|social media|content|leads|ctr|cpc|email marketing|ad spend)\b/.test(lower)) {
    return 'marketing';
  }
  if (/\b(sales|account executive|bdr|sdr|business development|closing|pipeline|deals|arr|mrr|revenue|quota)\b/.test(lower)) {
    return 'sales';
  }
  if (/\b(finance|accounting|audit|financial|budget|tax|cpa|bookkeep|treasury|valuation|p&l)\b/.test(lower)) {
    return 'finance';
  }
  if (/\b(operations|logistics|supply chain|procurement|process|workflow|vendor|compliance|inventory)\b/.test(lower)) {
    return 'operations';
  }
  if (/\b(director|vp|head of|lead|manager|chief|president|founder|principal)\b/.test(lower)) {
    return 'leadership';
  }
  return 'general';
}

/**
 * Returns a list of diverse, high-impact action verbs that have NOT been used on the resume.
 */
export function getRecommendedActionVerbs(options: {
  usedVerbs: Set<string> | string[];
  domain?: ActionVerbDomain;
  count?: number;
}): string[] {
  const { usedVerbs, domain = 'general', count = 10 } = options;
  const usedSet = usedVerbs instanceof Set ? usedVerbs : new Set(usedVerbs.map(v => v.toLowerCase()));

  // Prioritize category matching the domain
  let candidatePool: string[] = [];
  if (domain !== 'general' && ACTION_VERBS_BY_CATEGORY[domain]) {
    candidatePool.push(...ACTION_VERBS_BY_CATEGORY[domain]);
  }
  // Add complementary categories
  candidatePool.push(...ACTION_VERBS_BY_CATEGORY.optimization);
  candidatePool.push(...ACTION_VERBS_BY_CATEGORY.execution);
  candidatePool.push(...ACTION_VERBS_BY_CATEGORY.leadership);
  candidatePool.push(...ALL_ACTION_VERBS_FLAT);

  const recommended: string[] = [];
  const seenInRecommended = new Set<string>();

  for (const verb of candidatePool) {
    const norm = normalizeVerb(verb);
    const lower = verb.toLowerCase();
    if (!usedSet.has(norm) && !usedSet.has(lower) && !seenInRecommended.has(norm)) {
      recommended.push(verb);
      seenInRecommended.add(norm);
      if (recommended.length >= count) break;
    }
  }

  // Fallback if all are exhausted
  if (recommended.length === 0) {
    return ['Spearheaded', 'Architected', 'Orchestrated', 'Accelerated', 'Streamlined', 'Engineered'];
  }

  return recommended;
}

/**
 * Replaces the opening action verb of a bullet point with a fresh, unused verb if it collides with usedVerbs.
 */
export function ensureUniqueActionVerb(
  bullet: string,
  usedVerbs: Set<string> | string[],
  domain: ActionVerbDomain = 'general'
): string {
  if (!bullet || !bullet.trim()) return bullet;
  const clean = bullet.trim();
  const currentVerb = extractStartingVerb(clean);
  if (!currentVerb) return clean;

  const usedSet = usedVerbs instanceof Set ? usedVerbs : new Set(usedVerbs.map(v => v.toLowerCase()));
  const currentNorm = normalizeVerb(currentVerb);

  // If the current verb is not in the used set, it is unique and fine!
  if (!usedSet.has(currentNorm) && !usedSet.has(currentVerb.toLowerCase())) {
    return clean;
  }

  // Find a fresh verb
  const freshVerbs = getRecommendedActionVerbs({ usedVerbs: usedSet, domain, count: 5 });
  const replacementVerb = freshVerbs[0];
  if (!replacementVerb) return clean;

  // Replace opening verb while preserving punctuation and remaining words
  const words = clean.split(/\s+/);
  if (words.length > 0) {
    words[0] = replacementVerb;
    return words.join(' ');
  }

  return clean;
}

/**
 * Processes a multiline bullet text or array of bullets to strictly guarantee
 * that NO starting action verb is repeated twice. If duplicate starting verbs
 * are detected, fresh distinct power verbs are injected automatically.
 */
export function ensureAllBulletsHaveUniqueVerbs(
  bulletsInput: string | string[],
  usedVerbs: Set<string> | string[] = new Set(),
  domain: ActionVerbDomain = 'general'
): string {
  let lines: string[] = [];
  if (Array.isArray(bulletsInput)) {
    lines = bulletsInput;
  } else if (typeof bulletsInput === 'string') {
    lines = bulletsInput.split('\n');
  }

  const usedSet = usedVerbs instanceof Set ? new Set(usedVerbs) : new Set(usedVerbs.map(v => v.toLowerCase()));
  const seenInBatch = new Set<string>();
  const processedLines: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Extract bullet content without bullet prefix
    const bulletPrefixMatch = trimmed.match(/^([•·\-*\d.)\s]+)(.*)$/);
    const prefix = bulletPrefixMatch && bulletPrefixMatch[1].trim() ? bulletPrefixMatch[1] : '• ';
    const textOnly = bulletPrefixMatch && bulletPrefixMatch[1].trim() ? bulletPrefixMatch[2].trim() : trimmed;

    if (!textOnly) continue;

    const currentVerb = extractStartingVerb(textOnly);
    if (!currentVerb) {
      processedLines.push(`${prefix.startsWith('•') ? prefix : '• '}${textOnly}`);
      continue;
    }

    const norm = normalizeVerb(currentVerb);
    const lower = currentVerb.toLowerCase();

    // Check collision with already used verbs on resume OR previous bullets in this same batch
    if (seenInBatch.has(norm) || seenInBatch.has(lower) || usedSet.has(norm) || usedSet.has(lower)) {
      // Find a fresh replacement verb
      const combinedAvoidSet = new Set([...usedSet, ...seenInBatch]);
      const freshVerbs = getRecommendedActionVerbs({ usedVerbs: combinedAvoidSet, domain, count: 5 });
      const replacementVerb = freshVerbs[0] || 'Accelerated';

      // Replace starting verb in textOnly
      const words = textOnly.split(/\s+/);
      if (words.length > 0) {
        words[0] = replacementVerb;
      }
      const updatedText = words.join(' ');
      const newNorm = normalizeVerb(replacementVerb);
      seenInBatch.add(newNorm);
      seenInBatch.add(replacementVerb.toLowerCase());
      processedLines.push(`${prefix.startsWith('•') ? prefix : '• '}${updatedText}`);
    } else {
      seenInBatch.add(norm);
      seenInBatch.add(lower);
      processedLines.push(`${prefix.startsWith('•') ? prefix : '• '}${textOnly}`);
    }
  }

  return processedLines.join('\n');
}

/**
 * Builds a prompt snippet specifying already-used verbs and recommended fresh verbs
 * to inject into AI generation contexts.
 */
export function buildVerbDiversityPromptContext(
  resume: ResumeData,
  domain: ActionVerbDomain = 'general'
): string {
  const used = Array.from(getUsedStartingVerbs(resume));
  const recommended = getRecommendedActionVerbs({ usedVerbs: new Set(used), domain, count: 12 });
  return `
Already Used Action Verbs on Resume (DO NOT REPEAT): ${used.join(', ') || 'None'}
Recommended Fresh Power Verbs: ${recommended.join(', ')}
`;
}
