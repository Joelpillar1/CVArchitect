import {
  JobDescription,
  JobDescriptionSchema,
  JobRequirement,
  JobRequirementCategoryEnum,
  HiringSignalInsight,
  generateStableId,
} from '../types/agentContract';
import { callAIJSON } from './aiService';

/**
 * CVArchitect Job Description Intelligence Engine (Phase 4 Foundation)
 *
 * Capabilities:
 * 1. Ingests raw JD text or retrieves public job posting URLs.
 * 2. Strips boilerplate (navigation, cookies, footers, application forms).
 * 3. Decomposes requirements into weighted, categorized entries with explicit evidence demonstration patterns.
 * 4. Distinguishes EXPLICIT JD REQUIREMENTS from INFERRED HIRING SIGNALS.
 * 5. Returns structured errors on unreachable URLs to facilitate seamless UI fallback.
 */

export interface JobAnalysisFetchResult {
  ok: boolean;
  jobText?: string;
  sourceUrl?: string;
  error?: string;
  code?: 'url_fetch_failed' | 'invalid_url' | 'empty_content' | 'rate_limited';
}

export interface JobDescriptionAnalysisResult {
  ok: boolean;
  jobData?: JobDescription;
  error?: string;
  code?: string;
}

/**
 * Strips HTML boilerplate and extracts clean job description body text.
 */
export function cleanHtmlToText(html: string): string {
  let text = html;

  // Remove scripts, styles, noscript, iframes, svgs, header, nav, footer
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  text = text.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');
  text = text.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ');
  text = text.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');

  // Replace block tags with newlines
  text = text.replace(/<\/(div|p|h1|h2|h3|h4|h5|h6|li|tr|section|article)>/gi, '\n');
  text = text.replace(/<br\s*[\/]?>/gi, '\n');
  text = text.replace(/<li\b[^>]*>/gi, ' • ');

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode basic HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Normalize whitespace
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * Retrieves raw text from a target job posting URL.
 */
export async function retrieveJobUrl(url: string): Promise<JobAnalysisFetchResult> {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return {
      ok: false,
      error: 'Please provide a valid URL starting with http:// or https://',
      code: 'invalid_url',
    };
  }

  try {
    const response = await fetch(trimmed, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Could not access job page (${response.status} ${response.statusText}). Please paste the job description text directly.`,
        code: 'url_fetch_failed',
      };
    }

    const html = await response.text();
    const cleanText = cleanHtmlToText(html);

    if (!cleanText || cleanText.length < 80) {
      return {
        ok: false,
        error: 'The job posting content was empty or protected by a login wall. Please paste the job text directly.',
        code: 'empty_content',
      };
    }

    return {
      ok: true,
      jobText: cleanText,
      sourceUrl: trimmed,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: `Network error reaching URL: ${err.message || 'Unable to connect'}. Please paste the job text directly.`,
      code: 'url_fetch_failed',
    };
  }
}

/**
 * Determines evidence patterns that would demonstrate a requirement.
 */
export function generateEvidencePatterns(requirementText: string, category: string): string[] {
  const lower = requirementText.toLowerCase();

  if (category === 'cross_functional_collaboration' || /collaborat|cross-functional|stakeholder|partner/i.test(lower)) {
    return [
      'working with cross-functional engineering and design partners',
      'product planning and requirement reviews',
      'design handoff and technical specification review',
      'feature prioritization with stakeholders',
      'leading end-to-end product launches',
    ];
  }

  if (category === 'technical_architecture' || /architect|scale|distributed|system design|infrastructure/i.test(lower)) {
    return [
      'system architecture diagrams and technical RFCs',
      'scaling microservices or database queries under load',
      'infrastructure modernization or cloud migration',
      'reducing latency or improving uptime metrics',
    ];
  }

  if (/testing|experiment|a\/b|hypothesis/i.test(lower)) {
    return [
      'designing and executing A/B test experiments',
      'statistical analysis of conversion or engagement funnels',
      'translating experimental findings into feature roadmaps',
      'quantified conversion or retention improvements',
    ];
  }

  if (/leader|manage|mentor|hire/i.test(lower)) {
    return [
      'mentoring and onboarding junior and mid-level team members',
      'leading sprint planning, retrospectives, or team delivery',
      'direct headcount oversight or hiring panel contributions',
    ];
  }

  // Default fallback patterns based on requirement keywords
  const words = requirementText.split(/\s+/).filter((w) => w.length > 4).slice(0, 3);
  return [
    `hands-on production experience with ${words.join(' ')}`,
    `delivering business outcomes involving ${words[0] || 'domain tools'}`,
  ];
}

/**
 * Deterministic heuristic fallback parser for job descriptions.
 */
export function fallbackJobIntelligence(cleanText: string, sourceUrl = ''): JobDescription {
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0] || 'Target Role';

  // Extract seniority
  let seniority: JobDescription['seniority'] = 'unspecified';
  if (/principal|staff/i.test(cleanText)) seniority = 'principal';
  else if (/lead|manager|head/i.test(cleanText)) seniority = 'lead';
  else if (/senior|sr\./i.test(cleanText)) seniority = 'senior';
  else if (/junior|entry|associate/i.test(cleanText)) seniority = 'junior';
  else if (/director|vp|executive/i.test(cleanText)) seniority = 'executive';
  else if (/mid|intermediate/i.test(cleanText)) seniority = 'mid';

  // Extract requirements from bullet lines (or sentence lines if no bullets present)
  let rawReqLines = lines.filter((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));
  if (rawReqLines.length === 0) {
    rawReqLines = cleanText
      .split(/(?<=[.?!])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);
  }
  const requirements: JobRequirement[] = rawReqLines.slice(0, 15).map((line, idx) => {
    const text = line.replace(/^[-*•\s]+/, '').trim();
    let category: JobRequirement['category'] = 'responsibility';

    if (/react|typescript|python|java|aws|sql|node|docker|kubernetes|terraform/i.test(text)) category = 'tool';
    else if (/years?|experience/i.test(text)) category = 'experience_years';
    else if (/collaborat|stakeholder|communication/i.test(text)) category = 'cross_functional_collaboration';
    else if (/architect|system design|distributed|infrastructure/i.test(text)) category = 'technical_architecture';
    else if (/degree|bachelor|master|phd/i.test(text)) category = 'education';

    const isMustHave = /must|required|essential|minimum/i.test(text) || idx < 5;
    const importance = isMustHave ? 'must_have' : 'should_have';
    const weight = importance === 'must_have' ? 1.0 : 0.7;

    return {
      id: `req_${idx + 1}`,
      category,
      text,
      importance,
      weight,
      origin: 'explicit_jd_requirement',
      keywords: text.split(/\s+/).filter((w) => w.length > 3).slice(0, 4),
      acceptableEvidencePatterns: generateEvidencePatterns(text, category),
    };
  });

  return {
    id: generateStableId('jd'),
    title: firstLine.slice(0, 60),
    company: 'Target Employer',
    location: '',
    sourceUrl,
    remoteStatus: /remote/i.test(cleanText) ? 'remote' : /hybrid/i.test(cleanText) ? 'hybrid' : 'unspecified',
    rawText: cleanText,
    seniority,
    domain: /fintech|payment/i.test(cleanText) ? 'Fintech' : /health/i.test(cleanText) ? 'Healthcare' : 'Technology',
    requirements,
    requiredSkills: requirements.filter((r) => r.importance === 'must_have').map((r) => r.text.slice(0, 30)),
    preferredSkills: requirements.filter((r) => r.importance === 'should_have').map((r) => r.text.slice(0, 30)),
    responsibilities: requirements.filter((r) => r.category === 'responsibility').map((r) => r.text),
    experienceRequirements: requirements.filter((r) => r.category === 'experience_years').map((r) => r.text),
    tools: ['Figma', 'TypeScript', 'React', 'Node.js', 'SQL'].filter((t) => new RegExp(t, 'i').test(cleanText)),
    education: requirements.filter((r) => r.category === 'education').map((r) => r.text),
    domainKnowledge: [],
    softSkills: ['Cross-functional collaboration', 'Problem solving', 'Communication'],
    keywords: ['Agile', 'Product Strategy', 'Scalability', 'System Design'],
    keyPhrases: ['cross-functional collaboration', 'system architecture', 'end-to-end delivery'],
    hiringSignals: ['Growing engineering team', 'Active feature expansion'],
    hiringSignalInsights: [
      {
        signal: 'Emphasis on cross-functional alignment and end-to-end ownership',
        inference: 'Team is expanding and values independent engineers who unblock themselves',
        strategicAdvice: 'Highlight product planning and direct stakeholder collaboration in your experience bullets',
      },
    ],
    parsedAt: Date.now(),
  };
}

/**
 * Full AI-powered Job Description Intelligence Pipeline.
 */
export async function analyzeJobDescription(
  input: { rawText?: string; url?: string }
): Promise<JobDescriptionAnalysisResult> {
  let jdText = input.rawText?.trim() || '';
  let sourceUrl = input.url?.trim() || '';

  // 1. If URL supplied, retrieve & clean
  if (sourceUrl) {
    const fetchResult = await retrieveJobUrl(sourceUrl);
    if (!fetchResult.ok) {
      return {
        ok: false,
        error: fetchResult.error,
        code: fetchResult.code,
      };
    }
    jdText = fetchResult.jobText || '';
  }

  if (!jdText || jdText.length < 30) {
    return {
      ok: false,
      error: 'Job description text is required and cannot be empty.',
      code: 'empty_content',
    };
  }

  // 2. Structure using AI extraction
  const prompt = `
You are an expert Executive Recruiter and ATS Strategy Architect.
Analyze the following Job Description and produce a structured, weighted intelligence model.

Job Description:
"""
${jdText}
"""

CRITICAL INSTRUCTIONS:
1. DISTINGUISH EXPLICIT REQUIREMENTS FROM INFERRED HIRING SIGNALS:
   - "requirements": explicit expectations directly stated in the text.
   - "hiringSignalInsights": strategic inferences based on tech stack, team stage, or migration signals.
2. DO NOT TREAT EVERY REQUIREMENT AS EQUALLY IMPORTANT:
   - Assign importance: "must_have" (weight 1.0), "should_have" (weight 0.7), or "nice_to_have" (weight 0.4).
3. FOR EACH REQUIREMENT, specify "acceptableEvidencePatterns" (3-5 concrete examples of candidate work that proves the capability).
4. DO NOT INVENT company information. If company name is not mentioned, use "Target Employer".

Return STRICTLY valid JSON conforming to this schema:
{
  "title": "Exact job title",
  "company": "Company name or 'Target Employer'",
  "location": "City, Country or Remote",
  "remoteStatus": "remote" | "hybrid" | "on_site" | "unspecified",
  "seniority": "entry" | "junior" | "mid" | "senior" | "lead" | "principal" | "executive" | "unspecified",
  "domain": "e.g. Fintech, Healthcare, SaaS, E-Commerce",
  "requiredSkills": ["array of must-have technical/domain skills"],
  "preferredSkills": ["array of nice-to-have skills"],
  "responsibilities": ["key duties"],
  "experienceRequirements": ["e.g. 5+ years building distributed services"],
  "tools": ["tools, languages, frameworks, e.g. TypeScript, AWS, Kafka"],
  "education": ["degree or certification requirements"],
  "domainKnowledge": ["specific industry protocols or domain areas"],
  "softSkills": ["communication, stakeholder alignment, leadership"],
  "keywords": ["top ATS keywords"],
  "keyPhrases": ["multi-word search phrases, e.g. 'zero trust architecture'"],
  "hiringSignals": ["observable team/tech signals"],
  "hiringSignalInsights": [
    {
      "signal": "Observed job posting context",
      "inference": "Strategic takeaway on what the hiring manager really needs",
      "strategicAdvice": "How candidate should position their experience"
    }
  ],
  "requirements": [
    {
      "id": "req_1",
      "category": "required_skill" | "preferred_skill" | "responsibility" | "experience_years" | "tool" | "education" | "domain_knowledge" | "soft_skill" | "cross_functional_collaboration" | "technical_architecture" | "leadership_management",
      "text": "Exact text of the requirement",
      "importance": "must_have" | "should_have" | "nice_to_have",
      "weight": 1.0,
      "origin": "explicit_jd_requirement",
      "keywords": ["key", "terms"],
      "acceptableEvidencePatterns": [
        "concrete work example 1",
        "concrete work example 2"
      ]
    }
  ]
}
`;

  try {
    const raw = await callAIJSON(prompt, 'gpt-4o', 0.2);
    const parsedData: JobDescription = JobDescriptionSchema.parse({
      id: generateStableId('jd'),
      title: raw.title || 'Target Role',
      company: raw.company || 'Target Employer',
      location: raw.location || '',
      sourceUrl,
      remoteStatus: raw.remoteStatus || 'unspecified',
      rawText: jdText,
      seniority: raw.seniority || 'unspecified',
      domain: raw.domain || 'Technology',
      requiredSkills: Array.isArray(raw.requiredSkills) ? raw.requiredSkills : [],
      preferredSkills: Array.isArray(raw.preferredSkills) ? raw.preferredSkills : [],
      responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
      experienceRequirements: Array.isArray(raw.experienceRequirements) ? raw.experienceRequirements : [],
      tools: Array.isArray(raw.tools) ? raw.tools : [],
      education: Array.isArray(raw.education) ? raw.education : [],
      domainKnowledge: Array.isArray(raw.domainKnowledge) ? raw.domainKnowledge : [],
      softSkills: Array.isArray(raw.softSkills) ? raw.softSkills : [],
      keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
      keyPhrases: Array.isArray(raw.keyPhrases) ? raw.keyPhrases : [],
      hiringSignals: Array.isArray(raw.hiringSignals) ? raw.hiringSignals : [],
      hiringSignalInsights: Array.isArray(raw.hiringSignalInsights) ? raw.hiringSignalInsights : [],
      requirements: Array.isArray(raw.requirements)
        ? raw.requirements.map((req: any, idx: number) => ({
            id: req.id || `req_${idx + 1}`,
            category: req.category || 'responsibility',
            text: req.text || 'Job Requirement',
            importance: req.importance || 'must_have',
            weight: typeof req.weight === 'number' ? req.weight : (req.importance === 'must_have' ? 1.0 : 0.7),
            origin: req.origin || 'explicit_jd_requirement',
            keywords: Array.isArray(req.keywords) ? req.keywords : [],
            acceptableEvidencePatterns: Array.isArray(req.acceptableEvidencePatterns) && req.acceptableEvidencePatterns.length > 0
              ? req.acceptableEvidencePatterns
              : generateEvidencePatterns(req.text || '', req.category || 'responsibility'),
          }))
        : [],
      parsedAt: Date.now(),
    });

    return {
      ok: true,
      jobData: parsedData,
    };
  } catch (err: any) {
    console.warn('AI job analysis failed, falling back to heuristic extraction:', err);
    return {
      ok: true,
      jobData: fallbackJobIntelligence(jdText, sourceUrl),
    };
  }
}
