import { ResumeData } from '../types';
import { loadFromStorage } from './statePersistence';

export interface ExtractedJobDetails {
    company: string;
    title: string;
    description: string;
    highlightPosition?: string;
    highlightEducation?: string;
    highlightSkills: string[];
}

const INVALID_COMPANY_WORDS = new Set([
    // Pronouns & Articles
    'the', 'a', 'an', 'our', 'this', 'that', 'we', 'us', 'you', 'your', 'who', 'what', 'where', 'when', 'why', 'how',
    // Generic company placeholders
    'company', 'the company', 'our company', 'a company', 'target company', 'target employer', 'hiring company', 'company name',
    'client', 'our client', 'confidential', 'confidential company', 'stealth', 'stealth startup', 'startup',
    'hiring team', 'recruiting team', 'talent team', 'recruiter', 'hr', 'human resources', 'your company',
    // Job structure & sections
    'team', 'our team', 'the team', 'work', 'job', 'role', 'the role', 'the job', 'this role', 'this job', 'this position',
    'position', 'the position', 'opportunity', 'this opportunity', 'career', 'careers',
    'culture', 'our culture', 'mission', 'our mission', 'values', 'our values', 'overview', 'summary',
    'responsibilities', 'qualifications', 'requirements', 'skills', 'experience', 'benefits', 'compensation', 'salary',
    'who you are', 'what you will do', "what you'll do", 'what we offer', 'how to apply',
    // Locations & Work arrangements
    'remote', 'hybrid', 'onsite', 'full-time', 'fulltime', 'part-time', 'parttime', 'contract', 'temporary', 'internship',
    'flexible', 'global', 'worldwide', 'international', 'nationwide', 'local',
    'united states', 'usa', 'us', 'uk', 'canada', 'europe', 'asia', 'north america',
    // Common dictionary & coding keywords that can falsely appear after prepositions
    'float', 'double', 'int', 'char', 'string', 'boolean', 'array', 'object', 'null', 'undefined', 'void',
    'fast', 'scale', 'grow', 'lead', 'build', 'create', 'help', 'join', 'workplace', 'headquarters',
    'home', 'office', 'desk', 'people', 'person', 'candidate', 'applicant', 'employee',
    'equal opportunity', 'equal opportunity employer', 'eeo', 'diversity', 'inclusion'
]);

const GENERIC_TITLES = new Set([
    'target role',
    'target position',
    'job title',
    'untitled role',
    'professional'
]);

/**
 * Validates whether an extracted string is a plausible company name.
 */
export function isValidCompanyName(candidate?: string): boolean {
    if (!candidate || typeof candidate !== 'string') return false;
    const clean = candidate.trim().replace(/^['"`“]|['"`”]$/g, '').replace(/[.,;:]$/, '');
    if (clean.length < 2 || clean.length > 55) return false;

    const lower = clean.toLowerCase();
    if (INVALID_COMPANY_WORDS.has(lower)) return false;

    // Check if it starts with section phrases like "about the role", "our team"
    if (/^(?:about\s+(?:the\s+|our\s+|this\s+|a\s+|an\s+)?|(?:the|our|this|a|an)\s+)(role|job|position|team|company|culture|opportunity|mission|program|organization|us)\b/i.test(lower)) {
        return false;
    }

    // Must not be all digits or purely special characters
    if (/^[^a-zA-Z]+$/.test(clean)) return false;

    // Must not be a URL
    if (/^https?:|www\.|\.com\/|\.org\//i.test(clean)) return false;

    return true;
}

/**
 * Clean and format an extracted company candidate.
 */
function sanitizeCompanyName(raw: string): string {
    let clean = raw.trim()
        .replace(/^['"`“]|['"`”]$/g, '')
        .replace(/[.,;:\-–|!]+$/, '')
        .trim();

    // Strip common trailing noise like " - Remote", " (Remote)", " (NYC)"
    clean = clean.replace(/\s*[-–|(]\s*(?:remote|hybrid|onsite|full[- ]time|part[- ]time|contract|us|usa|uk)[)]?/i, '').trim();

    return clean;
}

/**
 * Extracts clean company name from job description text using high-precision heuristic patterns.
 */
export function extractCompanyFromText(text?: string): string {
    if (!text || typeof text !== 'string') return '';
    const clean = text.trim();
    if (!clean) return '';

    // 1. Explicit labels (Highest accuracy):
    // e.g. "Company: Netflix", "Employer: Acme Corp", "Organization: Stripe", "Hiring Organization: Vercel"
    const explicitLabelMatch = clean.match(/(?:^|\n)\s*(?:Company(?:\s*Name)?|Employer|Hiring\s*Organization|Organization|Organization\s*Name|Client|Firm|Business|About\s+the\s+Company)\s*[:\-–]\s*([^\n\r,;|]+)/i);
    if (explicitLabelMatch && explicitLabelMatch[1]) {
        const candidate = sanitizeCompanyName(explicitLabelMatch[1]);
        if (isValidCompanyName(candidate)) {
            return candidate;
        }
    }

    // 2. ATS Platform Job Board URLs (Greenhouse, Lever, Ashby, Workable)
    // e.g. boards.greenhouse.io/figma, jobs.lever.co/stripe, jobs.ashbyhq.com/linear
    const atsMatch = clean.match(/(?:boards\.greenhouse\.io|jobs\.lever\.co|jobs\.ashbyhq\.com|apply\.workable\.com|jobs\.jobvite\.com)\/([a-zA-Z0-9_-]+)/i);
    if (atsMatch && atsMatch[1]) {
        const slug = atsMatch[1].replace(/[-_]+/g, ' ').trim();
        // Capitalize words
        const formatted = slug.replace(/\b\w/g, c => c.toUpperCase());
        if (isValidCompanyName(formatted)) {
            return formatted;
        }
    }

    // 3. Official Company Email Domain (e.g. careers@stripe.com, jobs@linear.app)
    const emailMatch = clean.match(/\b[A-Za-z0-9._%+-]+@(?!gmail|yahoo|hotmail|outlook|icloud|proton|aol|mail)([A-Za-z0-9-]+)\.[a-zA-Z]{2,}\b/i);
    if (emailMatch && emailMatch[1]) {
        const domainSlug = emailMatch[1].replace(/[-_]+/g, ' ').trim();
        const formatted = domainSlug.replace(/\b\w/g, c => c.toUpperCase());
        if (isValidCompanyName(formatted) && formatted.length >= 3) {
            return formatted;
        }
    }

    // 4. Headline patterns in first 4 lines:
    // "Senior Product Designer at Stripe" or "Software Engineer @ Datadog"
    const firstLines = clean.split('\n').slice(0, 4);
    for (const line of firstLines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Pattern: "[Role] at [Company]"
        const atMatch = trimmedLine.match(/\b(?:at|@)\s+([A-Z0-9][A-Za-z0-9&.,' ]{1,45}?)(?:\s*[-–|(]|\s+(?:in|located|is|team|for|\.)|\s*$)/);
        if (atMatch && atMatch[1]) {
            const candidate = sanitizeCompanyName(atMatch[1]);
            if (isValidCompanyName(candidate)) {
                return candidate;
            }
        }

        // Pattern: "[Company] - [Role]" or "[Company] | [Role]"
        const splitMatch = trimmedLine.match(/^([A-Z0-9][A-Za-z0-9&.,' ]{1,40}?)\s*[-–|:]\s*(?:Senior|Lead|Staff|Principal|Head|Director|Associate|Junior)?\s*[A-Za-z\s/]+/);
        if (splitMatch && splitMatch[1]) {
            const candidate = sanitizeCompanyName(splitMatch[1]);
            if (isValidCompanyName(candidate)) {
                return candidate;
            }
        }
    }

    // 5. Intro / Mission patterns:
    // "About [Company]" (e.g. "About Figma:", "About Stripe", "About Linear")
    const aboutMatch = clean.match(/(?:^|\n)\s*About\s+([A-Z0-9][A-Za-z0-9&.,' ]{1,45}?)(?:\s*[:\-–]|\s+(?:is\s+(?:a|an|the|building|transforming|creating|on)|we\s+(?:are|believe|build)|was\s+founded|offers))/m);
    if (aboutMatch && aboutMatch[1]) {
        const candidate = sanitizeCompanyName(aboutMatch[1]);
        if (isValidCompanyName(candidate)) {
            return candidate;
        }
    }

    // "At [Company], we..." or "At [Company], our mission is..."
    const atWeMatch = clean.match(/(?:^|\n)\s*At\s+([A-Z0-9][A-Za-z0-9&.,' ]{1,45}?),\s*(?:we\s+(?:are|believe|build|deliver|create|work)|our\s+mission)/m);
    if (atWeMatch && atWeMatch[1]) {
        const candidate = sanitizeCompanyName(atWeMatch[1]);
        if (isValidCompanyName(candidate)) {
            return candidate;
        }
    }

    // "[Company] is looking for / is hiring / is seeking"
    const isHiringMatch = clean.match(/(?:^|\n)\s*([A-Z0-9][A-Za-z0-9&.,' ]{1,45}?)\s+(?:is\s+(?:looking\s+for|hiring|seeking)|seeks)\s+(?:a|an|the|our)\s+/m);
    if (isHiringMatch && isHiringMatch[1]) {
        const candidate = sanitizeCompanyName(isHiringMatch[1]);
        if (isValidCompanyName(candidate)) {
            return candidate;
        }
    }

    // "Join [Company] as..." or "Welcome to [Company]..."
    const joinMatch = clean.match(/(?:^|\n)\s*(?:Join|Welcome\s+to)\s+([A-Z0-9][A-Za-z0-9&.,' ]{1,45}?)(?:\s*[:\-–!.]|\s+(?:as\s+(?:a|an|our)|to\s+help|and\s+help|team))/m);
    if (joinMatch && joinMatch[1]) {
        const candidate = sanitizeCompanyName(joinMatch[1]);
        if (isValidCompanyName(candidate)) {
            return candidate;
        }
    }

    return '';
}

/**
 * Extracts clean job title from job description text.
 */
export function extractTitleFromText(text?: string): string {
    if (!text || typeof text !== 'string') return '';
    const clean = text.trim();
    if (!clean) return '';

    // 1. Explicit labels: "Job Title: Senior Software Engineer", "Role: Product Manager"
    const explicitMatch = clean.match(/(?:^|\n)\s*(?:Job\s*Title|Position(?:\s*Title)?|Role|Target\s*Role)\s*[:\-–]\s*([^\n\r,;|]+)/i);
    if (explicitMatch && explicitMatch[1]) {
        const candidate = explicitMatch[1].trim().replace(/^['"]|['"]$/g, '');
        if (candidate.length >= 3 && candidate.length <= 80 && !GENERIC_TITLES.has(candidate.toLowerCase())) {
            return candidate;
        }
    }

    // 2. First line if short (< 70 chars) and looks like a title
    const firstLine = clean.split('\n')[0]?.trim().replace(/^#+\s*/, '') || '';
    if (firstLine.length >= 4 && firstLine.length <= 70) {
        // Strip leading "Job Opportunity:" or "Hiring:"
        const stripped = firstLine.replace(/^(?:job\s*(?:opening|posting|opportunity)?|hiring|opportunity|we're\s*hiring|seeking)\s*[:\-–]\s*/i, '').trim();
        // Remove trailing company suffix like " - Acme Corp" or " at Acme"
        const withoutCompany = stripped.replace(/\s+(?:[-–|]|at|@)\s+[A-Za-z0-9&.,' ]+$/, '').trim();
        if (withoutCompany.length >= 3 && !/https?:|www\.|\.com|salary|description|requirements|overview/i.test(withoutCompany)) {
            return withoutCompany;
        }
    }

    return '';
}

/**
 * Extracts comprehensive job details and candidate highlights from ResumeData
 * for automatic pre-population into the Cover Letter Editor.
 */
export function extractTargetJobDetails(data?: ResumeData | null): ExtractedJobDetails {
    if (!data) {
        const storedCompany = loadFromStorage<string>('cover_letter_companyName', '');
        return {
            company: isValidCompanyName(storedCompany) ? storedCompany : '',
            title: loadFromStorage<string>('cover_letter_jobTitle', ''),
            description: loadFromStorage<string>('cover_letter_jobDescription', ''),
            highlightSkills: []
        };
    }

    const jdText = (data.jobDescription || data.agentJobData?.descriptionText || '').trim();

    // 1. Company name resolution
    let resolvedCompany = '';
    const agentCompany = data.agentJobData?.company?.trim();
    if (agentCompany && isValidCompanyName(agentCompany)) {
        resolvedCompany = agentCompany;
    }
    if (!resolvedCompany && jdText) {
        resolvedCompany = extractCompanyFromText(jdText);
    }
    if (!resolvedCompany) {
        const stored = loadFromStorage<string>('cover_letter_companyName', '');
        if (isValidCompanyName(stored)) {
            resolvedCompany = stored;
        }
    }

    // 2. Job title resolution
    let resolvedTitle = '';
    const agentTitle = data.agentJobData?.title?.trim();
    if (agentTitle && !GENERIC_TITLES.has(agentTitle.toLowerCase())) {
        resolvedTitle = agentTitle;
    }
    if (!resolvedTitle && jdText) {
        resolvedTitle = extractTitleFromText(jdText);
    }
    if (!resolvedTitle && data.jobTitle?.trim() && !GENERIC_TITLES.has(data.jobTitle.trim().toLowerCase())) {
        resolvedTitle = data.jobTitle.trim();
    }
    if (!resolvedTitle) {
        resolvedTitle = loadFromStorage<string>('cover_letter_jobTitle', '');
    }

    // 3. Job description resolution
    let resolvedDescription = jdText;
    if (!resolvedDescription) {
        resolvedDescription = loadFromStorage<string>('cover_letter_jobDescription', '');
    }

    // 4. Highlight Position: Most recent / prominent position from resume
    let highlightPosition: string | undefined = undefined;
    if (Array.isArray(data.experience) && data.experience.length > 0) {
        const topExp = data.experience[0];
        const role = topExp.role || (topExp as any).position || '';
        const comp = topExp.company || (topExp as any).organization || '';
        if (role && comp) {
            highlightPosition = `${role} at ${comp}`;
        } else if (role || comp) {
            highlightPosition = role || comp;
        }
    }

    // 5. Highlight Education: Top credential from resume
    let highlightEducation: string | undefined = undefined;
    if (Array.isArray(data.education) && data.education.length > 0) {
        const topEdu = data.education[0];
        const deg = topEdu.degree || '';
        const sch = topEdu.school || '';
        if (deg && sch) {
            highlightEducation = `${deg} from ${sch}`;
        } else if (deg || sch) {
            highlightEducation = deg || sch;
        }
    }

    // 6. Highlight Skills: Extract top 3-4 skills from candidate's resume
    const highlightSkills: string[] = [];
    if (data.skills && typeof data.skills === 'string') {
        const rawSkills = data.skills
            .split(/[,;\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 1 && s.length < 35);
        highlightSkills.push(...rawSkills.slice(0, 4));
    }

    return {
        company: resolvedCompany,
        title: resolvedTitle,
        description: resolvedDescription,
        highlightPosition,
        highlightEducation,
        highlightSkills
    };
}
