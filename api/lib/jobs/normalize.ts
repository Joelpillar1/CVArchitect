import type { Department, ExperienceLevel, JobType, WorkplaceType } from '../../../types/job';
import type { NormalizedSalary } from './types';

/**
 * Provider-agnostic normalization helpers.
 *
 * ATS payloads are messy and inconsistent in *specific, known* ways, so this module
 * exists to absorb that mess in one testable place:
 *
 *  - Greenhouse returns job bodies as HTML-escaped HTML (`&lt;div&gt;`), so entities must
 *    be decoded before tag-stripping or every description reads as tag soup.
 *  - Lever returns `workplaceType` already lowercased (`'hybrid'`) while Ashby returns a
 *    boolean `isRemote` plus a nullable `workplaceType`, and Greenhouse returns neither —
 *    only a free-text `location.name` such as `"Hybrid - London"`. All three collapse
 *    into one `WorkplaceType`.
 *  - No provider exposes an experience level at all, so it must be *inferred from the
 *    title* — and inference must decline (return null) rather than guess.
 *  - Departments are free text (`"Technical Program Management"`, `"Administrative"`), but
 *    the jobs UI filters on a closed enum. `mapDepartment` projects into that enum and the
 *    caller keeps the raw string alongside it.
 *
 * Nothing here performs I/O, which is what makes the mapping unit-testable.
 */

const HTML_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&mdash;': '—',
  '&ndash;': '–',
  '&rsquo;': '\u2019',
  '&lsquo;': '\u2018',
  '&ldquo;': '\u201c',
  '&rdquo;': '\u201d',
  '&hellip;': '…',
  '&bull;': '•',
  '&deg;': '°',
  '&euro;': '€',
  '&pound;': '£',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
};

/**
 * Decode the named + numeric HTML entities that appear in ATS job bodies.
 *
 * Applied twice on Greenhouse content, since it arrives double-escaped.
 */
export function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => safeCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => safeCodePoint(parseInt(dec, 10)))
    .replace(/&[a-z]+;/gi, (m) => HTML_ENTITIES[m.toLowerCase()] ?? m);
}

/** Convert a code point to a character, tolerating out-of-range values in dirty HTML. */
function safeCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return '';
  try {
    return String.fromCodePoint(code);
  } catch {
    return '';
  }
}

/** Strip tags/boilerplate from a job body and collapse it into readable text. */
export function htmlToText(html: string): string {
  if (!html) return '';
  let text = decodeHtmlEntities(html);

  text = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article|ul|ol)>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n• ')
    .replace(/<[^>]+>/g, ' ');

  return text
    .split('\n')
    .map((line) => line.replace(/[ \t\u00a0]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * Pull bullet-style lines out of a job body.
 *
 * Used for the responsibilities/requirements/benefits lists the UI renders. Prefers real
 * `<li>` items; falls back to dash/bullet-prefixed lines when the body is plain text.
 */
export function extractBullets(html: string, limit = 12): string[] {
  if (!html) return [];
  const decoded = decodeHtmlEntities(html);

  const liMatches = decoded.match(/<li\b[^>]*>([\s\S]*?)<\/li>/gi);
  let items: string[] = [];

  if (liMatches && liMatches.length) {
    items = liMatches.map((li) => htmlToText(li).replace(/^[•\-\s]+/, '').trim());
  } else {
    items = htmlToText(decoded)
      .split('\n')
      .map((line) => line.replace(/^[•\-*\u2022\s]+/, '').trim());
  }

  return items
    .filter((item) => item.length > 3 && item.length < 400)
    .slice(0, limit);
}

/**
 * Collapse a provider's workplace signal into the UI enum.
 *
 * Precedence is deliberate: a provider-supplied `workplaceType`/`isRemote` always beats
 * text sniffing, because companies write locations like `"Remote - EMEA"` for roles that
 * are actually office-based, and `"Hybrid - London"` is a genuine hybrid signal.
 */
export function detectWorkplaceType(input: {
  workplaceType?: string | null;
  isRemote?: boolean | null;
  location?: string | null;
  text?: string | null;
}): WorkplaceType | null {
  const declared = (input.workplaceType || '').toLowerCase().trim();
  if (declared) {
    if (declared.includes('hybrid')) return 'Hybrid';
    if (declared.includes('remote')) return 'Remote';
    if (declared.includes('onsite') || declared.includes('on-site') || declared.includes('on site')) {
      return 'On-site';
    }
  }

  if (input.isRemote === true) return 'Remote';

  const haystack = `${input.location || ''} ${input.text || ''}`.toLowerCase();
  if (/\bhybrid\b/.test(haystack)) return 'Hybrid';
  if (/\bon-?site\b|\bin-?office\b|\bin person\b/.test(haystack)) return 'On-site';
  if (/\bremote\b|\bwork from anywhere\b|\bfully distributed\b|\btelecommut/.test(haystack)) {
    return 'Remote';
  }

  // No signal at all — say so instead of defaulting to Remote and overstating the result.
  return null;
}

/** Map an ATS commitment/employment-type string onto the UI enum. */
export function mapJobType(raw?: string | null): JobType | null {
  if (!raw) return null;
  const value = raw.toLowerCase();
  if (/intern|placement|apprentice/.test(value)) return 'Internship';
  if (/part[\s-]?time/.test(value)) return 'Part-time';
  if (/contract|contractor|temporary|temp\b|freelance|fixed[\s-]?term/.test(value)) return 'Contract';
  if (/full[\s-]?time|fulltime|regular|permanent/.test(value)) return 'Full-time';
  return null;
}

/**
 * Infer seniority from a job title.
 *
 * Checked most-specific-first: an `"Intern"` title must not fall through to the `Senior`
 * branch just because the description mentions senior colleagues. Returns null when the
 * title carries no seniority signal — the UI then shows the badge as absent rather than
 * mislabelling a mid-level role.
 */
export function inferExperienceLevel(title: string): ExperienceLevel | null {
  if (!title) return null;
  const t = title.toLowerCase();

  if (/\b(intern|internship|trainee|apprentice|placement student)\b/.test(t)) return 'Entry Level';

  // NOTE: a bare "partner" is deliberately NOT treated as executive. Titles such as
  // "Administrative Business Partner" and "People Partner" are common staff roles, and
  // matching them would park ordinary postings in the Executive bucket.
  if (/\b(chief|ceo|cto|cfo|coo|cmo|ciso|president|vice president|vp|svp|evp|head of|director|managing partner)\b/.test(t)) {
    return 'Executive';
  }

  if (/\b(principal|staff|distinguished|fellow)\b/.test(t)) return 'Lead / Staff';

  // "Senior" is checked before the management words on purpose. Employers write titles such
  // as "Senior Technical Program Manager", where "Senior" is the seniority the employer
  // actually chose and "Manager" describes the function — so a user filtering by "Senior"
  // should still see that posting rather than having it hidden under Lead / Staff.
  if (/\b(senior|sr\.?|snr)\b/.test(t)) return 'Senior';

  if (/\b(lead|manager|supervisor|superintendent|architect)\b/.test(t)) {
    return 'Lead / Staff';
  }

  if (/\b(entry[\s-]?level|graduate|grad|junior|jr\.?|associate|assistant|apprentice)\b/.test(t)) {
    return 'Entry Level';
  }
  if (/\b(mid[\s-]?level|intermediate|experienced)\b/.test(t)) return 'Mid Level';

  return null;
}

/**
 * Ordered keyword rules projecting free-text ATS departments into the UI enum.
 *
 * Order matters: `"Data Engineer"` matches both `AI & Data` and `Engineering`, so the
 * data/AI rule is tested first to land it in `AI & Data`. Anything unmatched becomes
 * `Other` — an honest bucket, rather than dumping unrelated roles into `Engineering`.
 */
const DEPARTMENT_RULES: Array<{ department: Department; pattern: RegExp }> = [
  {
    department: 'AI & Data',
    // Short tokens (ai, ml, nlp) carry their own trailing boundary so "Air" and "MLK"
    // cannot match; the longer stems are deliberately prefixes so "Data Science",
    // "Analytics" and "Data Engineering" all land here.
    pattern:
      /\b(?:a\.i\b|ai\b|artificial intelligence|machine learning|ml\b|mlops|deep learning|data scien|data engineer|data analytic|analytics|data platform|business intelligence|research scientist|applied scientist|nlp\b|computer vision)/,
  },
  {
    department: 'Engineering',
    // Stems are prefixes so "Engineering", "Engineering Manager" and "Developer" match.
    // "technical program" is intentionally absent: TPM work is bucketed under Product
    // below, and leaving it here would shadow that rule.
    pattern:
      /\b(?:engineer|software|developer|front[\s-]?end|back[\s-]?end|full[\s-]?stack|mobile|android|ios\b|devops|sre\b|site reliability|platform|infrastructure|security|cyber|qa\b|quality assurance|test|automation|architect|systems|database|cloud|network|embedded|firmware|web)/,
  },
  {
    department: 'Design & UX',
    pattern: /\b(?:design|ux\b|ui\b|user experience|user research|visual|creative|interaction)/,
  },
  {
    department: 'Product',
    // `product\b` is a whole word on purpose: a prefix match would pull "Production" in.
    pattern:
      /\b(?:product\b|program manager|project manager|project management|technical program management|scrum|roadmap|pm\b)/,
  },
  {
    department: 'Finance',
    pattern:
      /\b(?:finance|financial|accounting|accountant|fp&a|treasury|tax\b|payroll|audit|controller|billing|revenue operations)/,
  },
  {
    department: 'Sales & Growth',
    pattern:
      /\b(?:sales\b|account executive|account manager|business development|bd\b|revenue|partnership|growth|solutions engineer|sales engineer|go[\s-]?to[\s-]?market|gtm\b)/,
  },
  {
    department: 'Marketing',
    pattern:
      /\b(?:marketing|content|seo\b|sem\b|communications|social media|demand generation|brand|copywriter|editor|public relations|pr\b|lifecycle)/,
  },
  {
    department: 'Operations',
    pattern:
      /\b(?:operations|operational|ops\b|customer success|customer support|support|help desk|people|human resources|hr\b|recruit|talent|legal|counsel|compliance|facilities|workplace|administrat|office|logistics|supply chain|procurement)/,
  },
];

/**
 * Project a free-text department/team string into the jobs-UI enum.
 *
 * Scans the raw department first, then the title, then falls back to `Other`.
 */
export function mapDepartment(rawDepartment?: string | null, title?: string | null): Department {
  const haystacks = [rawDepartment || '', title || ''].filter(Boolean);
  for (const haystack of haystacks) {
    const value = haystack.toLowerCase();
    for (const rule of DEPARTMENT_RULES) {
      if (rule.pattern.test(value)) return rule.department;
    }
  }
  return 'Other';
}

/** Map an ATS/pay-interval string onto a salary period. */
export function parseIntervalToPeriod(interval?: string | null): NormalizedSalary['period'] {
  const value = (interval || '').toLowerCase();
  if (value.includes('hour') || value === '1 hour' || value === 'hourly') return 'hourly';
  if (value.includes('month')) return 'monthly';
  if (value.includes('week')) return 'monthly';
  return 'yearly';
}

interface AshbyCompensationComponent {
  compensationType?: string;
  interval?: string;
  currencyCode?: string;
  minValue?: number | null;
  maxValue?: number | null;
  summary?: string | null;
}

interface AshbyCompensation {
  compensationTierSummary?: string | null;
  compensationTiers?: Array<{ components?: AshbyCompensationComponent[] }>;
}

/**
 * Extract a structured salary range from Ashby's compensation block.
 *
 * Ashby is the only provider of the three that publishes pay. A posting can carry several
 * components (salary, equity, bonus), so this deliberately selects only `Salary`
 * components and ignores equity — mixing an equity valuation into a salary filter is how
 * job boards end up showing implausible ranges. Returns a null salary plus a display
 * summary when no numeric salary component exists.
 */
export function parseAshbyCompensation(compensation: AshbyCompensation | null | undefined): {
  salary: NormalizedSalary | null;
  summary: string | null;
} {
  const summary = compensation?.compensationTierSummary?.trim() || null;
  const tiers = compensation?.compensationTiers || [];

  let min: number | null = null;
  let max: number | null = null;
  let currency = 'USD';
  let period: NormalizedSalary['period'] = 'yearly';

  for (const tier of tiers) {
    for (const component of tier.components || []) {
      const type = (component.compensationType || '').toLowerCase();
      if (type !== 'salary') continue;

      const cMin = typeof component.minValue === 'number' ? component.minValue : null;
      const cMax = typeof component.maxValue === 'number' ? component.maxValue : null;

      if (cMin !== null) min = min === null ? cMin : Math.min(min, cMin);
      if (cMax !== null) max = max === null ? cMax : Math.max(max, cMax);
      if (component.currencyCode) currency = component.currencyCode;
      period = parseIntervalToPeriod(component.interval);
    }
  }

  if (min === null && max === null) return { salary: null, summary };
  return {
    salary: { min: min ?? max ?? 0, max: max ?? min ?? 0, currency, period },
    summary,
  };
}

/**
 * Parse a Greenhouse/Lever-style pay summary such as `"$91,000–$120,000/year"` when a
 * provider exposes pay only as prose.
 *
 * Returns null rather than guessing when two numbers are not clearly a range.
 */
export function parseSalarySummary(text?: string | null): NormalizedSalary | null {
  if (!text) return null;
  const cleaned = text.replace(/[,]/g, '');
  const match = cleaned.match(
    /([$£€])\s?(\d{2,7})(?:\.\d+)?\s?(?:k|K)?\s?(?:-|–|—|to)\s?(?:[$£€]\s?)?(\d{2,7})(?:\.\d+)?\s?(k|K)?/,
  );
  if (!match) return null;

  const [, symbol, rawMin, rawMax, kSuffix] = match;
  const multiplier = kSuffix || /k/i.test(cleaned.slice(match.index || 0, (match.index || 0) + 40)) ? 1000 : 1;
  const min = Number(rawMin) * multiplier;
  const max = Number(rawMax) * multiplier;
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= 0) return null;

  const currency = symbol === '£' ? 'GBP' : symbol === '€' ? 'EUR' : 'USD';
  const period: NormalizedSalary['period'] = /hour|\/hr/i.test(cleaned)
    ? 'hourly'
    : /month|\/mo/i.test(cleaned)
      ? 'monthly'
      : 'yearly';

  return { min, max, currency, period };
}

/**
 * A curated skill vocabulary used to recover `skills[]` from a job body.
 *
 * No ATS returns a skills array, but the jobs UI scores resume match primarily on
 * `job.skills`, so dropping it entirely would gut the match feature. Scanning a known
 * vocabulary is more precise than tokenizing the body (which surfaces junk like `"the"`
 * and `"you"`), and matching is word-bounded so `"Go"` and `"R"` do not match substrings.
 */
const SKILL_VOCABULARY: string[] = [
  // languages
  'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'Ruby', 'PHP', 'C++', 'C#', 'Scala',
  'Kotlin', 'Swift', 'Objective-C', 'Elixir', 'Erlang', 'Clojure', 'Haskell', 'Perl', 'R', 'MATLAB',
  'SQL', 'Bash', 'Shell', 'Dart', 'Lua', 'Groovy', 'COBOL', 'Fortran', 'Julia', 'Solidity',
  // frontend
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Remix', 'Astro', 'Redux', 'GraphQL', 'REST',
  'TailwindCSS', 'SASS', 'HTML', 'CSS', 'Webpack', 'Vite', 'Jest', 'Playwright', 'Cypress',
  'React Native', 'Flutter', 'SwiftUI',
  // backend / platform
  'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', '.NET', 'Rails',
  'Laravel', 'gRPC', 'Kafka', 'RabbitMQ', 'Redis', 'Elasticsearch', 'Celery',
  // data / ml
  'PyTorch', 'TensorFlow', 'scikit-learn', 'Pandas', 'NumPy', 'Spark', 'Airflow', 'dbt', 'Snowflake',
  'Databricks', 'BigQuery', 'Redshift', 'LangChain', 'LlamaIndex', 'RAG', 'LLM', 'NLP',
  'Computer Vision', 'MLOps', 'Vector Databases', 'pgvector', 'Pinecone', 'Hugging Face',
  'OpenAI', 'Anthropic', 'Gemini', 'Prompt Engineering', 'Fine-tuning',
  // cloud / infra / devops
  'AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'Pulumi', 'Helm',
  'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'ArgoCD', 'Prometheus', 'Grafana',
  'Datadog', 'Serverless', 'Linux', 'Kafka Streams', 'Istio',
  // databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'Cassandra', 'SQLite', 'Neo4j', 'Oracle',
  'SQL Server', 'Supabase', 'Firebase', 'Prisma', 'Oracle DB',
  // design / product / business
  'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro',
  'User Research', 'Prototyping', 'Design Systems', 'Wireframing', 'Accessibility', 'WCAG',
  'Jira', 'Confluence', 'Asana', 'Trello', 'Notion', 'Salesforce', 'HubSpot', 'SAP', 'Workday',
  'NetSuite', 'Tableau', 'Power BI', 'Looker', 'Excel', 'Google Analytics', 'SEO', 'SEM',
  'Salesforce Administrator', 'Salesforce Developer', 'Apex', 'Lightning', 'SOQL',
  'Agile', 'Scrum', 'Kanban', 'SAFe', 'Stakeholder Management', 'Product Strategy', 'Roadmapping',
  'OKRs', 'A/B Testing', 'Go-to-Market', 'Account Management', 'Salesforce CRM',
  'Medical Writing', 'Regulatory Affairs', 'Clinical Trials', 'Epic', 'HL7', 'FHIR',
];

/** Recover skills present in a job's text using the curated vocabulary above. */
export function extractSkills(...texts: Array<string | null | undefined>): string[] {
  const haystack = texts.filter(Boolean).join('\n');
  if (!haystack) return [];

  const found: string[] = [];
  for (const skill of SKILL_VOCABULARY) {
    // Escape regex metacharacters so "C++", "Next.js" and "CI/CD" match literally.
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Word boundaries only where the skill starts/ends with a word character.
    const startsWord = /^\w/.test(skill);
    const endsWord = /\w$/.test(skill);
    const pattern = `${startsWord ? '\\b' : ''}${escaped}${endsWord ? '\\b' : ''}`;
    if (new RegExp(pattern, 'i').test(haystack)) found.push(skill);
  }

  return found.slice(0, 18);
}

/** Coerce a provider timestamp (ISO string, epoch ms, or epoch seconds) to ISO 8601. */
export function toIsoString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number' && Number.isFinite(value)) {
    // Lever reports epoch milliseconds; tolerate seconds too.
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  return null;
}

/**
 * Humanize a publication date for the card footer (`"3 days ago"`).
 *
 * Mirrors the wording the mock data used so the existing card UI needed no changes.
 */
export function formatPostedDate(iso: string | null, now: Date = new Date()): string {
  if (!iso) return 'Recently posted';
  const posted = new Date(iso);
  if (Number.isNaN(posted.getTime())) return 'Recently posted';

  const diffMs = now.getTime() - posted.getTime();
  if (diffMs < 0) return 'Just now';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`;

  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

/**
 * Resolve a company logo URL from its domain.
 *
 * ATS payloads ship no logo, and the jobs cards render one, so favicons are used as a
 * dependency-free stand-in. Returns null for anything that is not a real domain, which
 * keeps a placeholder from being rendered as a broken image.
 */
export function logoUrlForDomain(domain?: string | null): string | null {
  if (!domain) return null;
  const bare = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .trim();
  if (!bare || !bare.includes('.')) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bare)}&sz=128`;
}

/** Build a stable, collision-free job id across providers. */
export function buildJobId(provider: string, externalId: string): string {
  return `${provider}:${externalId}`;
}

export interface HtmlSection {
  heading: string;
  html: string;
}

/**
 * Split a job body into heading-delimited sections.
 *
 * Greenhouse and hand-built careers pages return one undifferentiated HTML blob such as
 * `"What you'll do ... Our requirements ... Benefits"`. The jobs UI wants discrete
 * responsibility/requirement/benefit lists, so the blob is cut at its headings first and
 * bucketed afterwards.
 */
export function splitHtmlSections(html: string): HtmlSection[] {
  if (!html) return [];
  const decoded = decodeHtmlEntities(html);
  const headingPattern = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;

  const marks: Array<{ index: number; length: number; heading: string }> = [];
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(decoded)) !== null) {
    marks.push({ index: match.index, length: match[0].length, heading: htmlToText(match[1]) });
  }

  if (!marks.length) return [{ heading: '', html: decoded }];

  const sections: HtmlSection[] = [];

  // Content before the first heading still matters (usually the role intro).
  const preamble = decoded.slice(0, marks[0].index);
  if (htmlToText(preamble).length > 20) sections.push({ heading: '', html: preamble });

  marks.forEach((mark, idx) => {
    const start = mark.index + mark.length;
    const end = idx + 1 < marks.length ? marks[idx + 1].index : decoded.length;
    const body = decoded.slice(start, end);
    if (htmlToText(body).length > 10) sections.push({ heading: mark.heading, html: body });
  });

  return sections;
}

/**
 * Bucket heading-delimited sections into the three lists the UI renders.
 *
 * Headings are wildly inconsistent across employers (`"You Will"`, `"What We Require"`,
 * `"Perks & Benefits"`), so matching is loose keyword matching rather than equality, and
 * unmatched sections fall through to `responsibilities` only when they contain bullets.
 */
export function bucketSections(sections: HtmlSection[]): {
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
} {
  const responsibilities: string[] = [];
  const requirements: string[] = [];
  const benefits: string[] = [];

  const REQUIREMENT = /require|qualification|looking for|you have|you'll need|you will need|must have|basic qualif|preferred|skills|experience in|who you are|what you bring/i;
  const BENEFIT = /benefit|perk|what we offer|why join|we provide|compensation|we offer|our offer|total rewards/i;
  const RESPONSIBILITY = /responsibilit|what you.ll do|what you will do|duties|day to day|day-to-day|your impact|the role|about the role|you will|role overview|job description/i;

  for (const section of sections) {
    const bullets = extractBullets(section.html, 14);
    const heading = section.heading || '';

    if (BENEFIT.test(heading)) {
      benefits.push(...bullets);
      continue;
    }
    if (REQUIREMENT.test(heading)) {
      requirements.push(...bullets);
      continue;
    }
    if (RESPONSIBILITY.test(heading)) {
      responsibilities.push(...bullets);
      continue;
    }

    // Unrecognised heading: keep its bullets as responsibilities, which is the least
    // misleading bucket for descriptive prose and matches what the card renders.
    if (bullets.length) responsibilities.push(...bullets);
  }

  // De-duplicate while preserving order — some bodies repeat a bullet under two headings.
  const dedupe = (items: string[]) => items.filter((item, idx) => item && items.indexOf(item) === idx);

  return {
    responsibilities: dedupe(responsibilities).slice(0, 12),
    requirements: dedupe(requirements).slice(0, 12),
    benefits: dedupe(benefits).slice(0, 10),
  };
}

/** Normalize a company display name into an ATS board token candidate. */
export function slugifyCompany(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

/** Turn a domain (`"jobs.vercel.com"` → `"vercel"`) into candidate board tokens. */
export function companyTokensFromDomain(domain: string): string[] {
  const bare = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];

  const labels = bare.split('.').filter(Boolean);
  // Drop the public suffix, keeping subdomain + registrable name as candidates.
  const withoutTld = labels.slice(0, Math.max(1, labels.length - 1));
  const candidates = new Set<string>();

  const registrable = withoutTld[withoutTld.length - 1] || '';
  if (registrable) {
    candidates.add(registrable);
    candidates.add(registrable.replace(/-/g, ''));
    candidates.add(registrable.replace(/-/g, '_'));
    candidates.add(registrable.replace(/-/g, ''));
  }
  // Subdomains such as jobs.acme.com or careers.acme.io.
  for (const label of withoutTld.slice(0, -1)) {
    if (!['jobs', 'careers', 'job', 'boards', 'apply', 'work', 'hire'].includes(label)) {
      candidates.add(label);
    }
  }

  return [...candidates].filter((c) => c.length > 1);
}
