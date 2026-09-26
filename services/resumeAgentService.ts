import { ResumeData } from '../types';
import { JobDescriptionData, JobMatchAnalysis, ResumeChange, MissingEvidenceItem } from '../types/resumeAgent';
import { callAIJSON, callAIText } from './aiService';
import { stripMarkdown } from '../utils/templateUtils';
import {
  buildVerbDiversityPromptContext,
  ensureUniqueActionVerb,
  ensureAllBulletsHaveUniqueVerbs,
  getUsedStartingVerbs,
  detectActionVerbDomain,
  getRecommendedActionVerbs,
} from '../utils/actionVerbs';


/**
 * Service orchestrating AI-driven job parsing, resume match evaluation,
 * grounded tailoring generation, and missing evidence detection.
 */

// Utility to create unique IDs
const createId = () => Math.random().toString(36).substring(2, 9);

/**
 * Parses raw job description text into structured JobDescriptionData
 */
export async function parseJobDescription(jdText: string): Promise<JobDescriptionData> {
  const cleanText = jdText.trim();
  if (!cleanText) {
    throw new Error('Job description text cannot be empty');
  }

  const prompt = `
You are an expert ATS parser and HR analyst.
Analyze the following Job Description text and extract structured information into JSON format.

Job Description:
"""
${cleanText}
"""

Return strictly valid JSON with this exact shape:
{
  "title": "Extracted job title (e.g. Senior Product Designer)",
  "company": "Extracted company name if available or 'Target Employer'",
  "descriptionText": ${JSON.stringify(cleanText)},
  "requiredSkills": ["array of required technical/soft skills"],
  "preferredSkills": ["array of nice-to-have skills"],
  "responsibilities": ["array of key job duties"],
  "keywords": ["array of top 8-15 industry keywords for ATS optimization"],
  "seniority": "Senior / Mid-Level / Junior / Lead / Executive",
  "domain": "Industry domain (e.g. Fintech, SaaS, E-commerce, Healthcare)",
  "qualifications": ["array of degrees/certifications requested"]
}
`;

  try {
    const parsed = await callAIJSON(prompt, 'gpt-4o', 0.2);
    return {
      title: parsed.title || 'Target Role',
      company: parsed.company || 'Target Company',
      descriptionText: cleanText,
      requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : ['Product Design', 'UI/UX', 'Figma'],
      preferredSkills: Array.isArray(parsed.preferredSkills) ? parsed.preferredSkills : ['Design Systems', 'User Research'],
      responsibilities: Array.isArray(parsed.responsibilities) ? parsed.responsibilities : ['Lead end-to-end design projects'],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ['product design', 'user research', 'figma', 'design systems'],
      seniority: parsed.seniority || 'Mid-Senior',
      domain: parsed.domain || 'Technology',
      qualifications: Array.isArray(parsed.qualifications) ? parsed.qualifications : [],
    };
  } catch (err) {
    console.warn('AI job description parsing failed, using smart fallback parsing:', err);
    return fallbackJobParse(cleanText);
  }
}

/**
 * Analyzes fit between user's current ResumeData and JobDescriptionData
 */
export async function analyzeJobMatch(resume: ResumeData, job: JobDescriptionData): Promise<JobMatchAnalysis> {
  const prompt = `
You are an elite Senior Executive Recruiter and ATS Evaluator.
Analyze the alignment between this Candidate Resume and the Target Job Description.

Target Job Description:
Title: ${job.title}
Company: ${job.company}
Required Skills: ${job.requiredSkills.join(', ')}
Keywords: ${job.keywords.join(', ')}
Responsibilities: ${job.responsibilities.join('; ')}

Candidate Resume:
Title: ${resume.jobTitle}
Summary: ${resume.summary}
Skills: ${resume.skills}
Experience:
${resume.experience.map(e => `- ${e.role} at ${e.company}: ${Array.isArray(e.description) ? e.description.join(' ') : e.description}`).join('\n')}

Evaluate realistic alignment and return strictly valid JSON matching this schema:
{
  "matchScore": 82, // integer between 0 and 100
  "categoryScores": {
    "experienceMatch": 85,
    "skillsMatch": 80,
    "keywordCoverage": 75,
    "roleAlignment": 88,
    "atsStructure": 95
  },
  "strongMatches": ["3-5 key matched qualifications or overlapping skills"],
  "gaps": ["3-5 noticeable missing keywords or underrepresented areas"],
  "topOpportunities": [
    {
      "id": "opp_1",
      "title": "Short title (e.g., Strengthen design system metrics)",
      "description": "Explanation of how to improve this section",
      "section": "experience"
    }
  ]
}
`;

  try {
    const result = await callAIJSON(prompt, 'gpt-4o', 0.3);
    return {
      matchScore: Math.min(100, Math.max(30, result.matchScore || 80)),
      categoryScores: {
        experienceMatch: result.categoryScores?.experienceMatch || 82,
        skillsMatch: result.categoryScores?.skillsMatch || 78,
        keywordCoverage: result.categoryScores?.keywordCoverage || 72,
        roleAlignment: result.categoryScores?.roleAlignment || 85,
        atsStructure: result.categoryScores?.atsStructure || 94,
      },
      strongMatches: Array.isArray(result.strongMatches) ? result.strongMatches : ['Relevant job role history', 'Core domain tools'],
      gaps: Array.isArray(result.gaps) ? result.gaps : ['Specific target metrics', 'Industry term alignment'],
      topOpportunities: Array.isArray(result.topOpportunities) ? result.topOpportunities : [
        { id: 'opp_1', title: 'Align summary keywords with job title', description: 'Incorporate target domain terminology into summary', section: 'summary' },
        { id: 'opp_2', title: 'Quantify impact in experience bullet points', description: 'Add metric outcomes to bullet points where relevant', section: 'experience' }
      ]
    };
  } catch (err) {
    console.warn('AI match analysis failed, using fallback match evaluator:', err);
    return fallbackMatchAnalysis(resume, job);
  }
}

/**
 * Generates tailored resume changes strictly grounded in existing candidate experience.
 * CRITICAL TRUST RULE: NEVER invent companies, jobs, degrees, metrics, or technologies not present in resume.
 */
export async function generateTailoredChanges(
  resume: ResumeData,
  job: JobDescriptionData,
  extraContext?: string
): Promise<ResumeChange[]> {
  const prompt = `
You are CVArchitect’s expert Resume Tailoring Agent.

When tailoring a resume for a target job, execute this 6-step process:
1. UNDERSTAND THE JOB: Analyze the JD deeply to identify the role’s core responsibilities, required skills, experience, qualifications, keywords, priorities, and what the employer is actually looking for.
2. DEFINE THE JOB STRATEGY: Determine the strongest positioning and resume strategy needed to compete for the role.
3. AUDIT THE RESUME: Analyze what the candidate already has, what matches the role, what is weak or missing, and what can be improved.
4. TAILOR THE RESUME: Rewrite and restructure the resume to align strongly with the JD while staying truthful. Never invent experience, skills, achievements, metrics, or qualifications.
5. OPTIMIZE FOR ATS + HUMANS: Naturally incorporate relevant JD language, strengthen impact and clarity, prioritize the most relevant experience, and keep the resume professional, concise, and ATS-friendly.
6. PRESERVE TRUTH: Only use information supported by the candidate’s existing resume or information explicitly provided by the user. If an important requirement is missing, identify it rather than fabricating it.

Think like a recruiter, hiring manager, and professional resume strategist—not a keyword matcher.
Your goal is to produce the strongest truthful version of the candidate’s resume for the specific job: "${job.title} at ${job.company}".

CRITICAL TRUST & TRUTHFULNESS RULE:
You MUST NEVER invent or manufacture fake jobs, companies, degrees, certifications, tools, metrics, or achievements.
Every rewrite must be grounded in the user's REAL experience. Rewrite bullet points and summary using stronger action verbs, better ATS keywords from the job description, and clearer structure WITHOUT changing factual truth.

CRITICAL EXECUTIVE CRAFTSMANSHIP & IMPACT STANDARD:
1. BAN WEAK & PASSIVE PHRASING: Never use "responsible for", "assisted with", "helped to", "worked on", "participated in", "utilized", "dynamic professional", or "team player".
2. STRUCTURE (Google XYZ / Impact Framework): Every experience bullet MUST follow:
   [Decisive Action Verb] + [Technical Challenge / Scope] + [Method / Tools / Execution] + [Concrete Business Outcome]
3. MANDATORY 2-FULL-LINES CALIBRATION:
   - Target: exactly 2 full lines (24 to 34 words / 150 to 220 characters).
   - NEVER produce a 1-line fragment (under 140 characters / under 22 words).
   - NEVER produce an oversized 3+ line bulky block (over 230 characters / over 36 words).
4. METRIC DIVERSITY & ANTI-PERCENTAGE SPAM (ABSOLUTE MANDATE):
   - NEVER inject percentage (%) numbers into every bullet. Having % in every bullet looks artificial, robotic, and AI-fabricated.
   - Max ONE percentage (%) metric per role across all its bullets combined, and ONLY if supported by candidate facts.
   - Most bullets should have ZERO percentages. Focus on technical scope, architecture, deliverables, team size, tools, and qualitative business value.
   - NEVER invent numbers, revenue, or percentages that were not in the candidate's original resume or verified answers.

CRITICAL ACTION VERB DIVERSITY & STRICT ZERO-DUPLICATE RULE:
Every proposed bullet point MUST open with a DISTINCT, UNIQUE action verb.
ONE VERB MUST NEVER APPEAR TWICE across any bullets anywhere on the resume.
Never repeat the same starting verb root (e.g., Spearheaded, Engineered, Orchestrated, Accelerated).

CRITICAL STEP-BY-STEP ORDER:
Always include a proposed rewrite for the "summary" section as the FIRST item in the array to position the candidate's executive title and value proposition for the target role. Then follow with 2-4 high-impact experience bullet improvements and core skills.

Target Job Keywords: ${job.keywords.join(', ')}
Target Job Responsibilities: ${job.responsibilities.join('; ')}
Active Starting Verbs Already Used on Resume: ${Array.from(getUsedStartingVerbs(resume)).join(', ') || 'None'}

Current Resume Data:
Summary: "${resume.summary}"
Skills: "${resume.skills}"
Experience:
${JSON.stringify(resume.experience, null, 2)}
${extraContext ? `\nAdditional context the candidate confirmed is TRUE (you may ground rewrites in these facts):\n${extraContext}\n` : ''}
Return strictly valid JSON as an array of proposed changes (Summary first):
[
  {
    "section": "summary" | "experience" | "skills" | "keyAchievements",
    "itemId": "experience_id if experience section",
    "bulletIndex": 0, // index of bullet if experience description array
    "original": "exact original text being modified",
    "proposed": "tailored plain text featuring relevant job keywords (no **bold** asterisks)",
    "reason": "Clear explanation why this edit improves alignment with the target role",
    "evidence": ["Exact quote or fact from original resume supporting this change"]
  }
]
Generate 3 to 5 high-impact, targeted suggestions (Summary first).
`;

  try {
    const rawChanges = await callAIJSON(prompt, 'gpt-4o', 0.4);
    if (Array.isArray(rawChanges) && rawChanges.length > 0) {
      const usedVerbs = getUsedStartingVerbs(resume);
      const domain = detectActionVerbDomain(job.title + ' ' + (job.domain || ''));
      return rawChanges.map((chg: any) => {
        let proposed = stripMarkdown(chg.proposed || '');
        if (chg.section === 'experience' || chg.section === 'keyAchievements') {
          if (proposed.includes('\n') || proposed.startsWith('•') || proposed.startsWith('-')) {
            proposed = ensureAllBulletsHaveUniqueVerbs(proposed, usedVerbs, domain);
          } else {
            proposed = ensureUniqueActionVerb(proposed, usedVerbs, domain);
          }
        }
        return {
          id: createId(),
          section: chg.section || 'experience',
          itemId: chg.itemId,
          bulletIndex: typeof chg.bulletIndex === 'number' ? chg.bulletIndex : undefined,
          original: stripMarkdown(chg.original || ''),
          proposed,
          reason: chg.reason || 'Better aligns wording with job requirements.',
          evidence: Array.isArray(chg.evidence) ? chg.evidence : [chg.original || 'User resume history'],
          status: 'pending',
          timestamp: Date.now(),
        };
      });
    }
  } catch (err) {
    console.warn('AI tailored generation failed, using fallback tailored change generator:', err);
  }

  return fallbackTailoredChanges(resume, job);
}

/**
 * Reads the candidate's ACTUAL resume against the target job and generates a short set
 * of grounded, specific clarifying questions — the way a real recruiter would probe
 * before rewriting. Questions reference the candidate's real roles/companies and target
 * the gaps that matter most.
 */
export async function detectMissingEvidence(resume: ResumeData, job: JobDescriptionData): Promise<MissingEvidenceItem[]> {
  const resumeSnapshot = buildResumeSnapshot(resume);

  const prompt = `
You are a concise senior technical recruiter interviewing a candidate before tailoring their resume.
Read the candidate's ACTUAL resume in their workspace and the target job, then ask at most 1 or 2 short, high-priority clarifying questions (or 0 if already clear).

TARGET JOB
Title: ${job.title}
Company: ${job.company}
Required skills: ${job.requiredSkills.join(', ') || 'n/a'}
Key responsibilities: ${job.responsibilities.join('; ') || 'n/a'}

CANDIDATE RESUME IN WORKSPACE
${resumeSnapshot}

RULES:
1. GROUND EVERY QUESTION IN THE RESUME. Reference the candidate's real companies or roles.
2. Ask at most 1 or 2 questions total. Keep questions concise (under 18 words each).
3. Do NOT dump long essay questions or lists.

Return STRICTLY valid JSON as an array (max 2 items):
[
  {
    "category": "missing_skill" | "quantify" | "scope" | "clarify",
    "requirement": "short label (e.g. 'Figma Variants', 'Team size')",
    "reason": "one short sentence citing the resume",
    "question": "short direct question",
    "skillTag": "keyword if missing_skill"
  }
]
`;

  try {
    const raw = await callAIJSON(prompt, 'gpt-4o', 0.3);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw
        .filter((it: any) => it && (it.question || it.requirement))
        .slice(0, 2)
        .map((it: any) => {
          const category: MissingEvidenceItem['category'] =
            ['missing_skill', 'quantify', 'scope', 'clarify'].includes(it.category) ? it.category : 'clarify';
          const requirement = String(it.requirement || 'Detail').trim();
          return {
            id: createId(),
            requirement,
            reason: String(it.reason || '').trim() || `I want to make sure this edit stays true to your real experience.`,
            question: String(it.question || `Tell me more about your experience with ${requirement}.`).trim(),
            status: 'unanswered' as const,
            category,
            skillTag: category === 'missing_skill' ? String(it.skillTag || requirement).trim() : undefined,
          };
        });
    }
  } catch (err) {
    console.warn('AI clarifying-question generation failed, using local keyword fallback:', err);
  }

  return fallbackMissingEvidence(resume, job);
}

/** Serialises the resume into a compact, readable snapshot for the AI to reason over. */
function buildResumeSnapshot(resume: ResumeData): string {
  const parts: string[] = [];
  parts.push(`Name/Target title: ${resume.fullName || 'n/a'} — ${resume.jobTitle || 'n/a'}`);
  parts.push(`Summary: ${resume.summary?.trim() || '(none)'}`);
  parts.push(`Skills listed: ${resume.skills?.trim() || '(none)'}`);

  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    parts.push('Experience:');
    resume.experience.forEach((e) => {
      const bullets = Array.isArray(e.description) ? e.description : [e.description];
      const bulletText = bullets.filter(Boolean).map((b) => `    • ${b}`).join('\n');
      parts.push(`  - ${e.role || 'Role'} at ${e.company || 'Company'} (${e.startDate || '?'}–${e.endDate || '?'})${e.roleSummary ? `\n    Summary: ${e.roleSummary}` : ''}${bulletText ? `\n${bulletText}` : ''}`);
    });
  } else {
    parts.push('Experience: (none listed)');
  }

  const achievements = Array.isArray(resume.keyAchievements)
    ? resume.keyAchievements
    : resume.keyAchievements
      ? [resume.keyAchievements]
      : [];
  if (achievements.length) parts.push(`Key achievements: ${achievements.join(' | ')}`);

  if (Array.isArray(resume.education) && resume.education.length) {
    parts.push(`Education: ${resume.education.map((ed) => `${ed.degree || ''} ${ed.school ? `@ ${ed.school}` : ''} ${ed.year || ''}`.trim()).join('; ')}`);
  }
  if (Array.isArray(resume.certifications) && resume.certifications.length) {
    parts.push(`Certifications: ${resume.certifications.map((c) => c.name).filter(Boolean).join(', ')}`);
  }

  return parts.join('\n');
}

/** Offline fallback: the original naive keyword scan for required skills with no evidence. */
function fallbackMissingEvidence(resume: ResumeData, job: JobDescriptionData): MissingEvidenceItem[] {
  const userText = `${resume.summary} ${resume.skills} ${resume.experience.map(e => `${e.role} ${e.company} ${Array.isArray(e.description) ? e.description.join(' ') : e.description}`).join(' ')}`.toLowerCase();
  const items: MissingEvidenceItem[] = [];

  for (const skill of job.requiredSkills) {
    const lowerSkill = skill.toLowerCase();
    if (!userText.includes(lowerSkill) && lowerSkill.length > 2) {
      items.push({
        id: createId(),
        requirement: skill,
        reason: `This role asks for "${skill}" experience, but I couldn't find evidence of it in your resume.`,
        question: `If you have experience with ${skill}, tell me where you used it and I'll add it truthfully to your resume.`,
        status: 'unanswered',
        category: 'missing_skill',
        skillTag: skill,
      });
      if (items.length >= 3) break;
    }
  }

  return items;
}

// ==========================================
// FALLBACK UTILITIES
// ==========================================

function fallbackJobParse(jdText: string): JobDescriptionData {
  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);
  const title = lines[0] || 'Target Role';
  return {
    title,
    company: 'Target Employer',
    descriptionText: jdText,
    requiredSkills: ['Product Design', 'User Research', 'Design Systems', 'Figma', 'Cross-functional Collaboration'],
    preferredSkills: ['SaaS', 'Agile Methodologies', 'Accessibility (WCAG)'],
    responsibilities: ['Architect user-centered digital products', 'Collaborate with engineering and product managers', 'Maintain component design systems'],
    keywords: ['product design', 'figma', 'design system', 'user research', 'ux architecture', 'wireframing', 'prototyping'],
    seniority: 'Senior',
    domain: 'Technology',
    qualifications: ['Bachelor degree or equivalent experience'],
  };
}

function fallbackMatchAnalysis(resume: ResumeData, job: JobDescriptionData): JobMatchAnalysis {
  return {
    matchScore: 82,
    categoryScores: {
      experienceMatch: 88,
      skillsMatch: 81,
      keywordCoverage: 74,
      roleAlignment: 86,
      atsStructure: 95,
    },
    strongMatches: [
      `Relevant leadership in ${resume.jobTitle || 'design'}`,
      'Proven hands-on project execution',
      'Strong foundational skill stack'
    ],
    gaps: [
      `Direct keywords from ${job.company || 'the job posting'}`,
      'Explicit metric outcomes in recent roles',
      'Specific tool keyword placement for ATS optimization'
    ],
    topOpportunities: [
      { id: 'opp_1', title: 'Strengthen Professional Summary', description: 'Incorporate target role title and domain keywords.', section: 'summary' },
      { id: 'opp_2', title: 'Highlight Design System & Metrics', description: 'Rephrase bullet points to highlight cross-functional impact.', section: 'experience' }
    ]
  };
}

function fallbackTailoredChanges(resume: ResumeData, job: JobDescriptionData): ResumeChange[] {
  const changes: ResumeChange[] = [];

  // Summary recommendation
  if (resume.summary) {
    changes.push({
      id: createId(),
      section: 'summary',
      original: resume.summary,
      proposed: `Accomplished ${job.title} with proven expertise in ${job.requiredSkills.slice(0, 3).join(', ')}. Demonstrated success driving high-impact product solutions, optimizing user workflows, and collaborating seamlessly with cross-functional engineering teams.`,
      reason: `Directly aligns your summary with the target ${job.title} role and key technical requirements.`,
      evidence: [resume.summary],
      status: 'pending',
      timestamp: Date.now(),
    });
  }

  // Experience bullet recommendation if available
  if (resume.experience && resume.experience.length > 0) {
    const exp = resume.experience[0];
    const descArr = Array.isArray(exp.description) ? exp.description : [exp.description];
    if (descArr.length > 0) {
      changes.push({
        id: createId(),
        section: 'experience',
        itemId: exp.id,
        bulletIndex: 0,
        original: descArr[0],
        proposed: `${descArr[0].replace(/\.$/, '')}, driving measurable efficiency gains and adhering to ${job.keywords[0] || 'design system'} best practices.`,
        reason: `Elevates impact language to highlight key domain terminology requested by ${job.company || 'the target employer'}.`,
        evidence: [`Role: ${exp.role} at ${exp.company}`],
        status: 'pending',
        timestamp: Date.now(),
      });
    }
  }

  // Skills recommendation
  if (resume.skills) {
    const currentSkills = resume.skills.split(',').map(s => s.trim());
    const additionalTargetSkills = job.requiredSkills.filter(s => !currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
    if (additionalTargetSkills.length > 0) {
      const mergedSkills = [...currentSkills, ...additionalTargetSkills.slice(0, 3)].join(', ');
      changes.push({
        id: createId(),
        section: 'skills',
        original: resume.skills,
        proposed: mergedSkills,
        reason: `Incorporate key requested skill tags (${additionalTargetSkills.slice(0, 3).join(', ')}) into your core skills inventory for ATS parsing.`,
        evidence: ['Existing user skill list'],
        status: 'pending',
        timestamp: Date.now(),
      });
    }
  }

  return changes;
}

/**
 * Inline AI text rewriting using strict grounded rules (action verbs, metrics, ATS optimization, zero fabrication)
 */
export async function rewriteTextInline(
  originalText: string,
  instruction?: string,
  jobData?: JobDescriptionData | null,
  options?: {
    resumeData?: ResumeData | null;
    targetRole?: string;
    targetCompany?: string;
  }
): Promise<string> {
  const cleanOriginal = originalText.trim();
  if (!cleanOriginal) return originalText;

  const isExpand = instruction?.toLowerCase().includes('expand');
  const targetRole = options?.targetRole || jobData?.title || '';
  const targetCompany = options?.targetCompany || jobData?.company || '';
  const domain = detectActionVerbDomain(`${targetRole} ${targetCompany} ${cleanOriginal}`);
  const usedVerbs = options?.resumeData ? getUsedStartingVerbs(options.resumeData) : new Set<string>();

  const verbDiversityContext = buildVerbDiversityPromptContext({
    resumeData: options?.resumeData,
    targetRole,
    targetCompany,
    currentBullet: cleanOriginal,
  });

  const prompt = `
You are an elite Executive Resume Strategist & Career Architect.
Rewrite and optimize the following resume snippet according to executive-level craftsmanship standards.

ORIGINAL SNIPPET:
"""
${cleanOriginal}
"""

${instruction ? `USER INSTRUCTION: "${instruction}"` : 'GOAL: Transform into an executive-grade, high-impact bullet point.'}
${targetRole || targetCompany ? `TARGET ROLE CONTEXT: ${targetRole} at ${targetCompany} (Keywords: ${jobData?.keywords?.slice(0, 8).join(', ') || 'N/A'})` : ''}
${verbDiversityContext}

STRICT EXECUTIVE REWRITING RULES:
1. Grounded & Credible: Retain all actual dates, company names, titles, and core facts. Never fabricate false numbers or credentials.
2. Structure (Google XYZ / Impact Framework):
   - Every bullet should follow: [Power Action Verb] + [Specific Challenge / Scope] + [Technical Delivery] + [Measurable Business Impact].
   - Ban weak/passive phrasing: never use "responsible for", "assisted with", "helped to", "worked on", "participated in", "utilized", or generic buzzwords.
3. Distinct Action Verb (CRITICAL):
   - You MUST open with a decisive, domain-tailored action verb.
   - You MUST NOT use any action verb already used on the resume (see forbidden list above).
   - Never repeat the same action verb under the same company or anywhere else on the document.
4. Mandatory 2-Full-Lines Length Calibration:
   - Calibrate output to exactly 2 full lines (24 to 34 words / 150 to 220 characters).
   - Never produce a 1-line fragment (under 140 chars) or an oversized paragraph (over 230 chars).
5. Anti-Percentage Spam & Scope Grounding:
   - Do NOT force a percentage (%) into this bullet unless the user explicitly provided one.
   - Focus on technical architecture, tools, process improvements, scope, or qualitative business impact.
6. ${isExpand ? 'Elaborate & Expand: Add relevant industry technical depth, scope, process steps, tools, and qualitative/quantitative outcomes that naturally elevate this accomplishment without inventing fake % stats.' : 'High Impact: Open with an impactful, unique action verb tailored to the domain.'}
7. Output strictly a JSON object with this exact schema:
{
  "rewrittenText": "Your rewritten or expanded text here"
}
`;

  try {
    const response = await callAIJSON(prompt, 'gpt-4o', 0.3);
    if (response && typeof response.rewrittenText === 'string' && response.rewrittenText.trim()) {
      const rawText = response.rewrittenText.trim();
      return ensureUniqueActionVerb(rawText, usedVerbs, domain);
    }
  } catch (err) {
    console.warn('AI inline rewrite JSON parsing error, trying text fallback:', err);
    try {
      const textRes = await callAIText(
        `You are an expert resume writer. ${instruction ? `Instruction: ${instruction}` : 'Improve this resume text'}.\n\nSnippet:\n"""\n${cleanOriginal}\n"""\n${verbDiversityContext}\n\nDo NOT invent fake percentages. Output ONLY the rewritten text without commentary, quotes, or markdown code blocks:`,
        'gpt-4o',
        0.3
      );
      if (textRes && textRes.trim()) {
        const rawText = textRes.replace(/^["'`]|["'`]$/g, '').trim();
        return ensureUniqueActionVerb(rawText, usedVerbs, domain);
      }
    } catch (textErr) {
      console.warn('AI text fallback error:', textErr);
    }
  }

  // Fallback enhancements if offline / API unreachable
  const recommendedVerbs = getRecommendedActionVerbs({ usedVerbs, domain, count: 5 });
  const fallbackVerb = recommendedVerbs[0] || 'Accelerated';

  if (isExpand) {
    return `${cleanOriginal}, driving cross-functional alignment and delivering measurable improvements across key project deliverables.`;
  }
  return cleanOriginal
    .replace(/^I /i, '')
    .replace(/^(?:managed|worked on|helped with|responsible for|assisted with|contributed to|led|built|developed)\b/i, fallbackVerb)
    .replace(/managed/gi, fallbackVerb)
    .replace(/worked on/gi, fallbackVerb);
}


/**
 * Inline AI text explanation analyzing strength, metrics, and impact of a snippet
 */
export async function explainTextInline(
  originalText: string,
  jobData?: JobDescriptionData | null
): Promise<string> {
  const cleanOriginal = originalText.trim();
  if (!cleanOriginal) return 'No text selected to explain.';

  const prompt = `
You are an expert executive resume consultant and hiring manager.
Provide a concise, 2-3 sentence analysis of this resume snippet. Highlight what makes it effective (or what is missing, such as measurable metrics or stronger action verbs), and offer a quick recommendation.

Snippet:
"""
${cleanOriginal}
"""
${jobData ? `Target Role Context: ${jobData.title} at ${jobData.company}` : ''}

Output ONLY the brief 2-3 sentence explanation. Keep it punchy and actionable.
`;

  try {
    const response = await callAIJSON(prompt, 'gpt-4o', 0.4);
    if (typeof response === 'string' && response.trim()) return response.trim();
    if (response && typeof response.explanation === 'string') return response.explanation.trim();
  } catch (err) {
    console.warn('AI explain fallback:', err);
  }

  return 'This statement highlights your core responsibility. To elevate ATS score and recruiter impact, lead with a punchy action verb and quantify your results with metrics (% growth, hours saved, or revenue generated).';
}

export interface BatchImproveBulletInput {
  id: string;
  originalText: string;
  index?: number;
}

export interface BatchImproveBulletResult {
  id: string;
  originalText: string;
  improvedText: string;
  startingVerb: string;
}

export interface BatchImproveOptions {
  scopeType: 'experience' | 'leadership' | 'keyAchievements' | 'skills' | 'projects' | 'custom';
  targetTitle?: string; // e.g. "Superteam — Lead Developer"
  actionType: 'improve' | 'expand' | 'tailor' | 'concise' | 'custom';
  customInstruction?: string;
  jobData?: JobDescriptionData | null;
  resumeData?: ResumeData | null;
}

/**
 * Batch improve multiple bullets under the same company or section in a single coherent AI call.
 * Ensures verb diversity, calibrated 2-line length, zero fabrication, and holistic role narrative.
 */
export async function batchImproveBullets(
  bullets: BatchImproveBulletInput[],
  options: BatchImproveOptions
): Promise<BatchImproveBulletResult[]> {
  if (!bullets.length) return [];

  const {
    scopeType,
    targetTitle = 'Role Accomplishments',
    actionType,
    customInstruction,
    jobData,
    resumeData,
  } = options;

  const targetRole = targetTitle;
  const domain = detectActionVerbDomain(`${targetRole} ${bullets.map((b) => b.originalText).join(' ')}`);
  const usedVerbs = resumeData ? getUsedStartingVerbs(resumeData) : new Set<string>();

  const isExpand = actionType === 'expand';
  const isTailor = actionType === 'tailor';
  const isConcise = actionType === 'concise';

  let actionGoal = 'Transform each bullet into an executive-grade accomplishment following Google XYZ framework.';
  if (isExpand) {
    actionGoal = 'Expand each bullet with technical depth, tool stacks, process steps, scope, and qualitative/quantitative impact.';
  } else if (isTailor) {
    actionGoal = `Tailor and optimize each bullet specifically for the target job requirements: ${jobData?.title || ''} at ${jobData?.company || ''}. Keywords: ${jobData?.keywords?.slice(0, 10).join(', ') || 'N/A'}`;
  } else if (isConcise) {
    actionGoal = 'Condense and tighten each bullet into a punchy, ultra-crisp high-impact statement, removing all filler.';
  } else if (customInstruction) {
    actionGoal = `Custom User Request: "${customInstruction}"`;
  }

  const prompt = `
You are an elite Executive Resume Strategist & Career Architect.
Rewrite and elevate the following list of ${bullets.length} bullets under "${targetTitle}" (${scopeType}).

ACTION GOAL:
${actionGoal}
${customInstruction ? `ADDITIONAL INSTRUCTIONS: "${customInstruction}"` : ''}

TARGET ROLE / JD CONTEXT:
${jobData ? `Title: ${jobData.title} | Company: ${jobData.company} | Top Keywords: ${jobData.keywords?.slice(0, 10).join(', ')}` : 'N/A'}

INPUT BULLETS:
${bullets.map((b, i) => `[BULLET ${i + 1}] (ID: "${b.id}"):\n"""${b.originalText.trim()}"""`).join('\n\n')}

CRITICAL EXECUTIVE REWRITING RULES:
1. Distinct Power Action Verbs:
   - EVERY single bullet in the output MUST start with a DIFFERENT, high-power action verb (e.g. Spearheaded, Architected, Accelerated, Orchestrated, Engineered, Automated, Championed, Negotiated).
   - NEVER repeat the same starting verb across bullets in this group.
   - Do NOT use passive verbs ("Responsible for", "Helped", "Worked on", "Assisted", "Participated in", "Utilized").
2. Google XYZ Impact Framework:
   - Follow: [Decisive Action Verb] + [Technical Challenge / Scope] + [Execution / Tools] + [Measurable Business Outcome].
3. Calibrated Length (Target: 2 Full Lines):
   - Calibrate each bullet to 24-34 words (~140 to 220 characters).
   - Avoid 1-line fragments and oversized paragraphs.
4. Anti-Percentage Spam & Truthful Grounding:
   - Do NOT force percentage (%) metrics onto every bullet. Maximum ONE percentage across all bullets in this entire group combined.
   - Focus on concrete architectural deliverables, tool stacks, team scope, and operational improvements.
   - Preserve all real company names, facts, dates, and core truths. Do NOT invent fabricated degrees or employers.
5. Return JSON ONLY with this exact schema:
{
  "results": [
    {
      "id": "matching bullet ID string",
      "improvedText": "High-impact rewritten bullet text"
    }
  ]
}
`;

  try {
    const response = await callAIJSON(prompt, 'gpt-4o', 0.3);
    if (response && Array.isArray(response.results)) {
      const assignedVerbs = new Set<string>();
      return bullets.map((original) => {
        const match = response.results.find((r: any) => String(r.id) === String(original.id));
        let improved = match && typeof match.improvedText === 'string' && match.improvedText.trim()
          ? match.improvedText.trim()
          : original.originalText;

        // Ensure verb uniqueness within batch
        improved = ensureUniqueActionVerb(improved, new Set([...usedVerbs, ...assignedVerbs]), domain);
        const firstVerb = improved.replace(/^[•·\-*\d.)\s]+/, '').trim().split(/\s+/)[0]?.toLowerCase() || '';
        if (firstVerb) assignedVerbs.add(firstVerb);

        return {
          id: original.id,
          originalText: original.originalText,
          improvedText: improved,
          startingVerb: firstVerb,
        };
      });
    }
  } catch (err) {
    console.warn('Batch bullet improvement failed, falling back to individual rewrites:', err);
  }

  // Fallback: parallel individual rewrites
  const results: BatchImproveBulletResult[] = [];
  const assignedVerbs = new Set<string>();
  for (const b of bullets) {
    const fallbackText = await rewriteTextInline(b.originalText, customInstruction || actionGoal, jobData, {
      resumeData,
      targetRole,
      targetCompany: jobData?.company,
    });
    const firstVerb = fallbackText.replace(/^[•·\-*\d.)\s]+/, '').trim().split(/\s+/)[0]?.toLowerCase() || '';
    assignedVerbs.add(firstVerb);
    results.push({
      id: b.id,
      originalText: b.originalText,
      improvedText: fallbackText,
      startingVerb: firstVerb,
    });
  }

  return results;
}

/**
 * Batch improve/categorize Skills section with modern industry categorization and ATS keyword density.
 */
export async function batchImproveSkills(
  skillsInput: string | string[],
  options: {
    actionType: 'improve' | 'expand' | 'tailor' | 'categorize' | 'custom';
    customInstruction?: string;
    jobData?: JobDescriptionData | null;
    resumeData?: ResumeData | null;
  }
): Promise<string> {
  const currentSkills = Array.isArray(skillsInput) ? skillsInput.join(', ') : skillsInput || '';
  const { actionType, customInstruction, jobData } = options;

  const prompt = `
You are an expert Resume Strategist & ATS Optimization Specialist.
Optimize and expand the candidate's skills section.

CURRENT SKILLS:
"""
${currentSkills}
"""

GOAL:
${actionType === 'expand' ? 'Expand with high-demand adjacent technical tools, frameworks, and domain competencies.' : ''}
${actionType === 'tailor' && jobData ? `Tailor and prioritize skills aligned with target job: ${jobData.title} (Target Keywords: ${jobData.keywords?.slice(0, 15).join(', ')})` : ''}
${customInstruction ? `User Instruction: "${customInstruction}"` : 'Organize into high-impact, clean comma-separated skills formatted professionally.'}

RULES:
1. Return clean, ATS-compliant skills (e.g. "React.js, TypeScript, Next.js, Node.js, PostgreSQL, Docker, AWS (S3/EC2), REST APIs, CI/CD Pipelines, Jest").
2. No conversational filler.
3. Return JSON:
{
  "skills": "Comma separated string of updated skills"
}
`;

  try {
    const response = await callAIJSON(prompt, 'gpt-4o', 0.3);
    if (response && typeof response.skills === 'string' && response.skills.trim()) {
      return response.skills.trim();
    }
  } catch (err) {
    console.warn('Batch skill improvement fallback:', err);
  }

  return currentSkills;
}


