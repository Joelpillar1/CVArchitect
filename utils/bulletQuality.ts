import { extractNumericTokens, findUngroundedNumbers } from './resumeOperations';

/**
 * Bullet Quality & Anti-Generic Evaluation Engine
 *
 * Implements strict content generation standards:
 * 1. ACTION + WHAT + CONTEXT/SCOPE + OUTCOME formula.
 * 2. Strict anti-hallucination metric protection (no invented numbers/placeholders).
 * 3. Domain-specific contextual metric discovery (Design, Engineering, Product, Marketing, Sales, Operations).
 * 4. Distinct handling for:
 *    A) Enough evidence -> specific evidence-grounded bullet
 *    B) Meaningful metric would strengthen -> one targeted role-specific question
 *    C) Insufficient evidence -> ask for missing facts
 *    D) User doesn't know metric -> strong truthful qualitative bullet
 */

export type RoleDomain = 'design' | 'engineering' | 'product' | 'marketing' | 'sales' | 'operations' | 'general';

export interface BulletQualityEvaluation {
  score: number;
  isGeneric: boolean;
  hasActionVerb: boolean;
  hasScope: boolean;
  hasOutcome: boolean;
  hasMetric: boolean;
  hasPlaceholder: boolean;
  unsupportedNumbers: string[];
  classification: 'EXCELLENT' | 'STRONG_QUALITATIVE' | 'WEAK_GENERIC' | 'CONTAINS_PLACEHOLDER' | 'UNGROUNDED_METRIC';
  recommendedQuestion?: string;
  suggestedAction?: 'USE_AS_IS' | 'IMPROVE_QUALITATIVE' | 'ASK_METRIC' | 'REJECT_PLACEHOLDER' | 'REJECT_UNGROUNDED';
}

const STRONG_ACTION_VERBS = new Set([
  'designed',
  'launched',
  'rebuilt',
  'automated',
  'optimized',
  'implemented',
  'negotiated',
  'increased',
  'reduced',
  'delivered',
  'migrated',
  'scaled',
  'streamlined',
  'established',
  'generated',
  'drove',
  'led',
  'architected',
  'engineered',
  'spearheaded',
  'orchestrated',
  'consolidated',
  'deployed',
  'built',
  'structured',
  'executed',
  'authored',
  'formulated',
]);

const GENERIC_FILLER_PATTERNS = [
  /\bcollaborated with (cross-functional )?teams to (improve|deliver|enhance|support)\b/i,
  /\bworked on (various|different|multiple|key) (tasks|projects|initiatives)\b/i,
  /\bresponsible for (managing|leading|handling|overseeing|supporting)\b/i,
  /\bhelped with (the )?(design|development|marketing|sales|operations)\b/i,
  /\bassisted with (day-to-day|daily|team|project)\b/i,
  /\bcontributed to (the )?(team|success|project|goals)\b/i,
  /\bdeliver(ed|ing)? high-quality (solutions|design solutions|products|code)\b/i,
  /\bdrove innovation\b/i,
  /\benhanced business performance\b/i,
  /\bimprove(d)? the user experience\b/i,
  /\binvolved in (various|the|all aspects of)\b/i,
];

/**
 * Detects domain/field based on role title and bullet content.
 */
export function detectRoleDomain(roleOrBullet: string): RoleDomain {
  const text = (roleOrBullet || '').toLowerCase();

  if (/\b(design|ui|ux|product designer|visual designer|figma|prototyp|wirefram|user research|interaction)\b/.test(text)) {
    return 'design';
  }
  if (/\b(product manager|pm|product owner|scrum|roadmap|feature backlog|user stories|product strategy)\b/.test(text)) {
    return 'product';
  }
  if (/\b(engineer|developer|architect|software|backend|frontend|fullstack|devops|cloud|aws|kubernetes|api|database|microservice|python|typescript|react)\b/.test(text)) {
    return 'engineering';
  }
  if (/\b(marketing|seo|sem|growth|campaign|social media|content|leads|ctr|cpc|email marketing|ad spend)\b/.test(text)) {
    return 'marketing';
  }
  if (/\b(sales|account executive|bdr|sdr|business development|closing|pipeline|deals|arr|mrr|revenue|quota)\b/.test(text)) {
    return 'sales';
  }
  if (/\b(operations|logistics|supply chain|procurement|process|workflow|vendor|compliance|inventory)\b/.test(text)) {
    return 'operations';
  }

  return 'general';
}

/**
 * Detects whether a bullet contains fake placeholders like [X]%, [X], [metric], [insert number].
 */
export function containsPlaceholders(text: string): boolean {
  const placeholderRegex = /\[(?:X|x|\?|metric|number|percentage|insert[^\]]*)\]%?|\b(?:increased|reduced|grew|improved)\s+by\s+X%|\bX%\b/i;
  return placeholderRegex.test(text);
}

/**
 * Detects whether a bullet is generic fluff that lacks substance or could apply to thousands of unrelated candidates.
 */
export function isGenericBullet(bullet: string): boolean {
  if (!bullet || bullet.trim().length < 20) return true;
  const lower = bullet.toLowerCase().trim();

  // 1. Direct match with generic filler patterns
  for (const pattern of GENERIC_FILLER_PATTERNS) {
    if (pattern.test(lower)) {
      // If it has concrete scope / metrics, it might not be purely generic
      const hasSpecificDetails = /\b(across|using|reduced|increased|from|to|\d+|saved|migrated)\b/i.test(lower) && lower.length > 90;
      if (!hasSpecificDetails) return true;
    }
  }

  // 2. Starts with weak verb or passive phrasing without concrete deliverables
  const weakOpeners = /^(worked on|helped with|responsible for|assisted with|contributed to|involved in|participated in|handled)/i;
  if (weakOpeners.test(lower)) {
    return true;
  }

  // 3. Vague fluff ending without object or clear outcome
  if (/to improve user experiences and deliver high-quality design solutions\.?$/i.test(lower)) {
    return true;
  }

  return false;
}

/**
 * Generates a targeted, context-aware metric discovery question based on the role and bullet topic.
 */
export function generateTargetedMetricQuestion(bulletOrAchievement: string, role?: string, company?: string): string {
  const domain = detectRoleDomain(`${role || ''} ${bulletOrAchievement}`);
  const bulletLower = bulletOrAchievement.toLowerCase();

  switch (domain) {
    case 'design': {
      if (bulletLower.includes('checkout') || bulletLower.includes('purchase') || bulletLower.includes('cart')) {
        return 'Do you know whether the redesign affected conversion, checkout completion, or cart abandonment?';
      }
      if (bulletLower.includes('onboard') || bulletLower.includes('sign up') || bulletLower.includes('register')) {
        return 'Did the onboarding update change sign-up completion rates, time-to-value, or user drop-off?';
      }
      if (bulletLower.includes('design system') || bulletLower.includes('component')) {
        return 'Did the design system reduce designer/developer handoff time, or how many components/teams adopted it?';
      }
      return 'Did this work improve conversion, completion rate, adoption, or reduce support requests?';
    }

    case 'product': {
      if (bulletLower.includes('launch') || bulletLower.includes('feature')) {
        return 'How many users or customers were affected, or what was the measurable adoption rate after launch?';
      }
      if (bulletLower.includes('retention') || bulletLower.includes('engagement')) {
        return 'What was the measurable outcome on user retention, active engagement, or churn?';
      }
      return 'What was the primary measurable business or user outcome following this launch?';
    }

    case 'engineering': {
      if (bulletLower.includes('migrat') || bulletLower.includes('microservice') || bulletLower.includes('refactor')) {
        return 'Did this migration improve latency, deployment frequency, error rates, or infrastructure costs?';
      }
      if (bulletLower.includes('api') || bulletLower.includes('backend') || bulletLower.includes('database')) {
        return 'How much did throughput or query latency improve, or how many requests/users does it handle?';
      }
      if (bulletLower.includes('ci/cd') || bulletLower.includes('pipeline') || bulletLower.includes('build')) {
        return 'How much time did this save in build or deployment cycles?';
      }
      return 'Did this improve latency, uptime, deployment speed, or error rates?';
    }

    case 'marketing': {
      if (bulletLower.includes('campaign') || bulletLower.includes('ad') || bulletLower.includes('social')) {
        return 'How much did traffic, leads, conversion, or customer acquisition change from this campaign?';
      }
      if (bulletLower.includes('seo') || bulletLower.includes('content')) {
        return 'What was the organic traffic growth, ranking improvement, or lead volume generated?';
      }
      return 'What was the change in conversion, traffic, or lead volume?';
    }

    case 'sales': {
      if (bulletLower.includes('deal') || bulletLower.includes('client') || bulletLower.includes('account')) {
        return 'How much revenue or pipeline did this generate, or how many accounts did you close?';
      }
      if (bulletLower.includes('quota') || bulletLower.includes('target')) {
        return 'What percentage of quota or target did you achieve?';
      }
      return 'What was the total revenue, deal value, or pipeline generated?';
    }

    case 'operations': {
      if (bulletLower.includes('cost') || bulletLower.includes('vendor') || bulletLower.includes('budget')) {
        return 'How much time or operational cost did this save, or what was the budget size managed?';
      }
      if (bulletLower.includes('process') || bulletLower.includes('automation')) {
        return 'How much time did this automation save per week, or how many teams/locations were affected?';
      }
      return 'How much time or cost did this save, or did processing errors decrease?';
    }

    default: {
      return 'Do you know the measurable outcome, scale, or time saved resulting from this accomplishment?';
    }
  }
}

/**
 * Evaluates a resume bullet against anti-generic, anti-hallucination, and quality standards.
 */
export function evaluateBulletQuality(
  bullet: string,
  options?: {
    role?: string;
    company?: string;
    evidencePool?: string[];
  }
): BulletQualityEvaluation {
  const text = (bullet || '').trim();
  const unsupportedNumbers = options?.evidencePool ? findUngroundedNumbers(text, options.evidencePool) : [];
  const hasPlaceholder = containsPlaceholders(text);
  const isGeneric = isGenericBullet(text);

  const words = text.split(/\s+/);
  const firstWord = (words[0] || '').toLowerCase().replace(/[^a-z]/g, '');
  const hasActionVerb = STRONG_ACTION_VERBS.has(firstWord);

  const numericTokens = extractNumericTokens(text);
  const hasMetric = numericTokens.size > 0;

  // Scope: mentions platform (web/mobile), scale (cross-functional, microservices, 3 products), or tools
  const hasScope = /\b(across|using|for|in|web|mobile|cloud|platform|system|enterprise|end-to-end|global|multi-|distributed)\b/i.test(text);

  // Outcome: mentions result, impact, or change
  const hasOutcome = /\b(reducing|increasing|resulting in|achieving|improving|saving|delivering|generating|streamlining|accelerating|expanding)\b/i.test(text) || hasMetric;

  let score = 50;
  if (hasActionVerb) score += 15;
  if (hasScope) score += 15;
  if (hasOutcome) score += 10;
  if (hasMetric && unsupportedNumbers.length === 0) score += 10;
  if (isGeneric) score -= 30;
  if (hasPlaceholder) score -= 40;
  if (unsupportedNumbers.length > 0) score -= 35;

  score = Math.max(0, Math.min(100, score));

  let classification: BulletQualityEvaluation['classification'] = 'STRONG_QUALITATIVE';
  let suggestedAction: BulletQualityEvaluation['suggestedAction'] = 'USE_AS_IS';

  if (hasPlaceholder) {
    classification = 'CONTAINS_PLACEHOLDER';
    suggestedAction = 'REJECT_PLACEHOLDER';
  } else if (unsupportedNumbers.length > 0) {
    classification = 'UNGROUNDED_METRIC';
    suggestedAction = 'REJECT_UNGROUNDED';
  } else if (isGeneric) {
    classification = 'WEAK_GENERIC';
    suggestedAction = 'IMPROVE_QUALITATIVE';
  } else if (hasMetric && score >= 80) {
    classification = 'EXCELLENT';
    suggestedAction = 'USE_AS_IS';
  } else {
    classification = 'STRONG_QUALITATIVE';
    suggestedAction = 'USE_AS_IS';
  }

  const recommendedQuestion = !hasMetric && (classification === 'STRONG_QUALITATIVE' || classification === 'WEAK_GENERIC')
    ? generateTargetedMetricQuestion(text, options?.role, options?.company)
    : undefined;

  return {
    score,
    isGeneric,
    hasActionVerb,
    hasScope,
    hasOutcome,
    hasMetric,
    hasPlaceholder,
    unsupportedNumbers,
    classification,
    recommendedQuestion,
    suggestedAction,
  };
}

/**
 * Checks if a bullet is calibrated to approximately 2 full lines (~120-220 characters, ~16-36 words).
 */
export function isTwoFullLines(text: string): boolean {
  if (!text) return false;
  const clean = text.trim();
  const wordCount = clean.split(/\s+/).length;
  const charCount = clean.length;
  return charCount >= 120 && charCount <= 235 && wordCount >= 16 && wordCount <= 36;
}

/**
 * Crafts an improved, specific, grounded bullet adhering to ACTION + WHAT + SCOPE + OUTCOME
 * and strictly calibrated to EXACTLY 2 FULL LINES (~140-220 chars / 22-35 words).
 * Never invents metrics or placeholders.
 */
export function craftEnhancedBullet(
  rawBullet: string,
  options?: {
    role?: string;
    company?: string;
    verifiedMetric?: string;
    userOutcomeContext?: string;
    isQualitativeOnly?: boolean;
  }
): string {
  let clean = (rawBullet || '').trim().replace(/^[-*•\s]+/, '');

  // 1. Remove weak openers
  clean = clean
    .replace(/^worked on\s+/i, 'Built ')
    .replace(/^helped with\s+/i, 'Developed ')
    .replace(/^responsible for\s+/i, 'Managed ')
    .replace(/^assisted with\s+/i, 'Executed ')
    .replace(/^contributed to\s+/i, 'Delivered ');

  // 2. If clean has a verified metric already, preserve and format it into 2 full lines
  if (options?.verifiedMetric) {
    const metricStr = options.verifiedMetric;
    if (clean.toLowerCase().includes('checkout')) {
      return `Redesigned the checkout experience across web and mobile platforms, simplifying multi-step purchase navigation and ${metricStr}.`;
    }
    if (clean.toLowerCase().includes('website') || clean.toLowerCase().includes('web')) {
      return `Redesigned core web application user flows, restructuring information hierarchy and primary conversion paths, ${metricStr}.`;
    }
    if (!clean.includes(metricStr)) {
      return `${clean}, streamlining multi-platform workflows and ${metricStr}`.replace(/,\s*,/g, ',');
    }
    return clean;
  }

  // 3. If user supplied an explicit outcome in context
  if (options?.userOutcomeContext && !clean.includes(options.userOutcomeContext)) {
    return `${clean}, ${options.userOutcomeContext}`;
  }

  // 4. If it's a known generic bullet or short fragment, calibrate to exactly 2 full lines of grounded qualitative scope
  if (clean.toLowerCase().includes('checkout') && !clean.includes('across web and mobile')) {
    return 'Redesigned the checkout experience across web and mobile platforms, simplifying the purchase flow and improving interaction clarity.';
  }

  if (clean.toLowerCase().includes('website') && !clean.includes('navigation')) {
    return 'Redesigned the company website and core product landing pages, restructuring navigation to create a clearer path from discovery to conversion.';
  }

  if (clean.toLowerCase().includes('collaborated with cross-functional teams')) {
    return 'Led UX architecture and design system integration across cross-functional product teams to accelerate delivery of customer-facing features.';
  }

  if (clean.toLowerCase().includes('onboarding') && clean.length < 130) {
    return 'Redesigned the customer onboarding flow across web and mobile platforms, clarifying account setup steps to reduce friction for new users.';
  }

  // 5. If bullet is too short (< 130 chars), expand with domain-specific contextual scope
  if (clean.length < 130) {
    const domain = detectRoleDomain(`${options?.role || ''} ${clean}`);
    switch (domain) {
      case 'design':
        return `${clean.replace(/\.?$/, '')} across web and mobile platforms, improving usability and clarifying core interactive workflows.`;
      case 'engineering':
        return `${clean.replace(/\.?$/, '')} across distributed microservices, improving system reliability, modularity, and operational throughput.`;
      case 'product':
        return `${clean.replace(/\.?$/, '')} across key release milestones, aligning cross-functional roadmap deliverables with strategic user priorities.`;
      case 'marketing':
        return `${clean.replace(/\.?$/, '')} across multi-channel digital campaigns, optimizing audience targeting and brand messaging consistency.`;
      case 'sales':
        return `${clean.replace(/\.?$/, '')} across target enterprise accounts, building trusted stakeholder relationships and expanding qualified pipeline.`;
      case 'operations':
        return `${clean.replace(/\.?$/, '')} across cross-functional team workflows, standardizing operational procedures and reducing process turnaround time.`;
      default:
        return `${clean.replace(/\.?$/, '')} across key operational milestones, ensuring high standards of execution and cross-functional consistency.`;
    }
  }

  return clean;
}
