import { ResumeData } from '../../types';

// Helper function to get description text from either string or array format
function getDescriptionText(description: string | string[]): string {
    if (Array.isArray(description)) {
        return description.join(' ');
    }
    return description || '';
}

export interface AnalyticsResult {
    atsScore: number;
    completeness: number;
    jobMatchScore: number;
    strengths: string[];
    improvements: string[];
    sectionScores: {
        personalInfo: number;
        summary: number;
        experience: number;
        education: number;
        skills: number;
        projects?: number;
        certifications?: number;
    };
    keywords: {
        actionVerbs: number;
        technicalSkills: number;
        softSkills: number;
        missingKeywords: string[];
    };
    readability: {
        avgWordCount: number;
        bulletPoints: number;
        metricDensity: number;
        quantifiableAchievements: number;
        weakWords: number;
    };
}

const STOP_WORDS = [
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what', 'when', 'where', 'how',
    'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
    'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'all', 'any', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'are', 'was',
    'were', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'your', 'ours', 'items',
    'stuff', 'being', 'going', 'would', 'could', 'their', 'they', 'them', 'this', 'that', 'these',
    'those', 'am', 'is', 'be', 'been', 'my', 'me', 'we', 'us', 'our', 'it', 'its', 'you', 'he',
    'him', 'his', 'she', 'her', 'hers', 'work', 'job', 'role', 'roles', 'position', 'positions', 'experience', 'year',
    'years', 'team', 'teams', 'company', 'companies', 'business', 'client', 'clients', 'project', 'projects',
    'candidate', 'candidates', 'applicant', 'applicants', 'opportunity', 'opportunities', 'responsibilities',
    'requirements', 'qualifications', 'duties', 'minimum', 'preferred', 'required', 'ability', 'working',
    'including', 'across', 'within', 'using', 'support', 'ensure', 'provide', 'providing', 'degree',
    'equal', 'employer', 'salary', 'benefits', 'location', 'apply', 'today', 'join'
];

const ACTION_VERBS = [
    'achieved', 'improved', 'trained', 'managed', 'created', 'designed', 'developed',
    'implemented', 'increased', 'decreased', 'reduced', 'led', 'launched', 'established',
    'generated', 'delivered', 'optimized', 'streamlined', 'coordinated', 'executed',
    'spearheaded', 'initiated', 'built', 'enhanced', 'transformed', 'drove', 'accelerated',
    'orchestrated', 'pioneered', 'engineered', 'architected', 'deployed', 'resolved',
    'negotiated', 'mentored', 'supervised', 'directed', 'formulated', 'conceptualized'
];

const TECHNICAL_KEYWORDS = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node', 'sql', 'aws',
    'azure', 'docker', 'kubernetes', 'api', 'database', 'agile', 'scrum', 'git',
    'typescript', 'html', 'css', 'mongodb', 'postgresql', 'redis', 'graphql',
    'rest', 'soap', 'ci/cd', 'jenkins', 'terraform', 'linux', 'unix', 'bash',
    'shell', 'c++', 'c#', '.net', 'django', 'flask', 'spring', 'hibernate',
    'redux', 'mobx', 'next.js', 'nuxt', 'express', 'fastapi', 'pandas', 'numpy',
    'tensorflow', 'pytorch', 'scikit-learn', 'machine learning', 'ai', 'cloud',
    'microservices', 'serverless', 'lambda', 's3', 'ec2', 'gcp', 'firebase'
];

const SOFT_SKILLS = [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'creative', 'organized', 'detail-oriented', 'collaborative', 'adaptable',
    'strategic', 'innovative', 'motivated', 'reliable', 'professional',
    'time management', 'critical thinking', 'emotional intelligence', 'flexibility',
    'interpersonal', 'presentation', 'negotiation', 'conflict resolution'
];

const WEAK_WORDS = [
    'responsible for', 'helped', 'worked on', 'assisted', 'participated in',
    'duties included', 'handled', 'tried', 'attempted'
];

export function analyzeResume(data: ResumeData): AnalyticsResult {
    const sectionScores = calculateSectionScores(data);
    const readability = analyzeReadability(data);

    // Pillar 1: Relevance (Job Match)
    const { jobMatchScore, keywords } = calculateRelevance(data);

    // Pillar 2: Impact (Quality)
    // We derive 'impactScore' inside calculateATSScore using readability & keywords data

    // Pillar 3: Structure (Completeness)
    const completeness = calculateCompleteness(sectionScores);

    const atsScore = calculateATSScore(sectionScores, keywords, readability, jobMatchScore, data);

    const { strengths, improvements } = generateRecommendations(
        data,
        sectionScores,
        keywords,
        readability,
        atsScore,
        jobMatchScore,
        completeness
    );

    return {
        atsScore,
        completeness,
        jobMatchScore,
        strengths,
        improvements,
        sectionScores,
        keywords,
        readability
    };
}

function calculateSectionScores(data: ResumeData): AnalyticsResult['sectionScores'] {
    // Count skills properly (trim and filter empty entries)
    const skillCount = data.skills
        ? data.skills.split(',').map(s => s.trim()).filter(s => s.length > 0).length
        : 0;

    const scores: AnalyticsResult['sectionScores'] = {
        personalInfo: calculatePersonalInfoScore(data),
        summary: data.summary ? Math.min(100, Math.max(0, (data.summary.length / 150) * 100)) : 0, // Aim for ~150 chars min (more achievable)
        experience: calculateExperienceScore(data),
        education: data.education && data.education.length > 0 ? 100 : 0,
        skills: skillCount >= 9 ? 100 : Math.min(100, (skillCount / 9) * 100), // 100 points at 9+ skills
    };

    // Only include optional sections if user has added items for them
    if (Array.isArray(data.projects) && data.projects.length > 0) {
        scores.projects = calculateProjectsScore(data);
    }

    if (Array.isArray(data.certifications) && data.certifications.length > 0) {
        scores.certifications = calculateCertificationsScore(data);
    }

    return scores;
}

function calculateProjectsScore(data: ResumeData): number {
    if (!data.projects || data.projects.length === 0) return 0;

    let score = 60; // Base score for having projects
    if (data.projects.length >= 2) score += 20;
    else if (data.projects.length >= 1) score += 10;

    const hasDetailedDesc = data.projects.some(p => {
        const descText = getDescriptionText(p.description);
        return descText.length > 50;
    });
    if (hasDetailedDesc) score += 15;

    const hasTechOrLink = data.projects.some(p => (p.technologies && p.technologies.trim().length > 0) || (p.link && p.link.trim().length > 0));
    if (hasTechOrLink) score += 15;

    return Math.min(100, score);
}

function calculateCertificationsScore(data: ResumeData): number {
    if (!data.certifications || data.certifications.length === 0) return 0;

    let score = 70; // Base score for having certifications
    if (data.certifications.length >= 2) score += 20;
    const hasIssuer = data.certifications.some(c => c.issuer && c.issuer.trim().length > 0);
    if (hasIssuer) score += 10;

    return Math.min(100, score);
}

function calculatePersonalInfoScore(data: ResumeData): number {
    let score = 0;
    if (data.fullName) score += 20;
    if (data.email) score += 20;
    if (data.phone) score += 20;
    if (data.linkedin) score += 20;
    if (data.location) score += 20;
    return score;
}

function calculateExperienceScore(data: ResumeData): number {
    if (data.experience.length === 0) return 0;

    // Give high score for 4+ experiences
    let score = 0;

    if (data.experience.length >= 4) {
        score = 70; // Strong base for 4+ experiences
    } else if (data.experience.length >= 2) {
        score = 50;
    } else {
        score = 30;
    }

    // Quality checks - reward good descriptions
    const avgDescLength = data.experience.reduce((acc, exp) => {
        const descText = getDescriptionText(exp.description);
        return acc + descText.length;
    }, 0) / data.experience.length;

    if (avgDescLength > 80) score += 15;  // Decent descriptions
    if (avgDescLength > 150) score += 15; // Good descriptions

    return Math.min(100, score);
}

// ============================================================================
// PILLAR 1: RELEVANCE (Job Match)
// ============================================================================
function calculateRelevance(data: ResumeData) {
    const resumeText = [
        data.summary,
        data.skills,
        data.keyAchievements || '',
        ...data.experience.map(e => getDescriptionText(e.description)),
        ...data.projects?.map(p => getDescriptionText(p.description)) || []
    ].join(' ').toLowerCase();

    const resultKeywords = {
        actionVerbs: countMatches(resumeText, ACTION_VERBS),
        technicalSkills: countMatches(resumeText, TECHNICAL_KEYWORDS),
        softSkills: countMatches(resumeText, SOFT_SKILLS),
        missingKeywords: [] as string[]
    };

    if (!data.jobDescription || data.jobDescription.trim().length < 25) {
        return { jobMatchScore: 0, keywords: resultKeywords };
    }

    // 1. Analyze JD Frequency
    const jobDesc = data.jobDescription.toLowerCase();
    const words = jobDesc.match(/[a-z]{3,}/g) || [];
    const frequency: { [key: string]: number } = {};

    words.forEach(w => {
        if (!STOP_WORDS.includes(w)) {
            frequency[w] = (frequency[w] || 0) + 1;
        }
    });

    // 2. Identify Critical vs Bonus Keywords
    // Critical: Appeared >= 3 times OR is a known technical/soft skill
    // Bonus: Appeared 2 times
    const criticalKeywords: string[] = [];
    const bonusKeywords: string[] = [];

    Object.entries(frequency).forEach(([word, count]) => {
        const isKnownSkill = TECHNICAL_KEYWORDS.includes(word) || SOFT_SKILLS.includes(word);
        if (count >= 3 || isKnownSkill) {
            criticalKeywords.push(word);
        } else if (count >= 2) {
            bonusKeywords.push(word);
        }
    });

    // 3. Calculate Score
    let totalPossibleWeight = (criticalKeywords.length * 3) + (bonusKeywords.length * 1);
    totalPossibleWeight = Math.max(1, totalPossibleWeight);

    let earnedWeight = 0;
    const missing: string[] = [];

    // Score Critical
    criticalKeywords.forEach(kw => {
        if (resumeText.includes(kw)) {
            earnedWeight += 3;
        } else {
            if (missing.length < 10) missing.push(kw);
        }
    });

    // Score Bonus
    bonusKeywords.forEach(kw => {
        if (resumeText.includes(kw)) {
            earnedWeight += 1;
        }
    });

    // Coverage ratio: 0.0 (no overlap) to 1.0 (strong overlap >= 50% of JD terms)
    const coverageRatio = Math.min(1, Math.max(0, earnedWeight / Math.max(1, totalPossibleWeight * 0.50)));

    // Progressively scales from 55% baseline (initial JD paste) up to 96% as sections are updated
    let matchScore = Math.round(55 + (coverageRatio * 41));

    if (data.hasJobMatchRun) {
        // When AI full-tailoring is completed, ensure 94-98% top band
        matchScore = Math.min(98, Math.max(94, matchScore + 3));
    }

    resultKeywords.missingKeywords = missing;

    return { jobMatchScore: matchScore, keywords: resultKeywords };
}

// ============================================================================
// PILLAR 2: IMPACT (Quality/Readability)
// ============================================================================
function analyzeReadability(data: ResumeData) {
    const descriptions = data.experience.map(e => getDescriptionText(e.description)).filter(Boolean);
    const allResumeText = [data.summary, ...descriptions, data.keyAchievements || ''].join(' ').toLowerCase();

    // 1. Metric Density (Bullets with numbers / Total bullets)
    let totalBullets = 0;
    let numberedBullets = 0;

    data.experience.forEach(exp => {
        // Handle both array and string formats
        let lines: string[] = [];
        if (Array.isArray(exp.description)) {
            lines = exp.description.filter(l => l.trim().length > 5);
        } else if (exp.description) {
            lines = exp.description.split('\n').filter(l => l.trim().length > 5);
        }

        totalBullets += lines.length;
        lines.forEach(line => {
            if (/\d/.test(line)) numberedBullets++;
        });
    });

    // Avoid div by zero
    totalBullets = Math.max(1, totalBullets);

    const allText = [
        data.summary,
        ...descriptions,
        data.keyAchievements || ''
    ].join(' ').toLowerCase();

    const countQuantifiable = countQuantifiableMetrics(allText);
    const weakWordsCount = countMatches(allText, WEAK_WORDS);

    return {
        avgWordCount: 0,
        bulletPoints: totalBullets,
        metricDensity: numberedBullets / totalBullets, // 0.0 to 1.0
        quantifiableAchievements: countQuantifiable,
        weakWords: weakWordsCount
    };
}

// ============================================================================
// MAIN SCORING ALGORITHM
// ============================================================================
function calculateATSScore(
    sectionScores: AnalyticsResult['sectionScores'],
    keywords: AnalyticsResult['keywords'],
    readability: AnalyticsResult['readability'],
    jobMatchScore: number,
    data: ResumeData
): number {
    const hasJobDesc = !!(data.jobDescription && data.jobDescription.trim().length > 25);

    // Core section completion — Achievements deliberately excluded (optional section).
    const hasPersonalInfo =
        !!data.fullName &&
        !!data.email &&
        !!data.phone &&
        !!data.linkedin &&
        !!data.location;
    const hasSummary = !!data.summary && data.summary.trim().length > 0;
    const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
    const hasEducation = Array.isArray(data.education) && data.education.length > 0;
    const hasSkills = !!data.skills && data.skills.split(',').map(s => s.trim()).filter(Boolean).length >= 3;
    const hasCoreSectionsComplete =
        hasPersonalInfo && hasSummary && hasExperience && hasEducation && hasSkills;

    // --- STRUCTURE SCORE ---
    // Core required sections carry full weight (5×). Optional sections (projects, certifications)
    // carry 1× bonus weight only when present, so absent optional sections never penalise the score.
    const REQUIRED_WEIGHT = 5;  // personalInfo, summary, experience, education, skills
    const OPTIONAL_WEIGHT = 1;  // projects, certifications (bonus when added)

    let totalWeight = 0;
    let weightedSum = 0;

    const coreKeys: (keyof typeof sectionScores)[] = ['personalInfo', 'summary', 'experience', 'education', 'skills'];
    for (const key of coreKeys) {
        if (typeof sectionScores[key] === 'number') {
            weightedSum += sectionScores[key]! * REQUIRED_WEIGHT;
            totalWeight += REQUIRED_WEIGHT;
        }
    }

    if (typeof sectionScores.projects === 'number') {
        weightedSum += sectionScores.projects * OPTIONAL_WEIGHT;
        totalWeight += OPTIONAL_WEIGHT;
    }

    if (typeof sectionScores.certifications === 'number') {
        weightedSum += sectionScores.certifications * OPTIONAL_WEIGHT;
        totalWeight += OPTIONAL_WEIGHT;
    }

    const structureScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    // --- IMPACT SCORE (Quality of writing) ---
    let impactScore = 0;

    // Action Verbs (Target: 10+ for full score)
    impactScore += Math.min(35, (keywords.actionVerbs / 10) * 35);

    // Metric Density (Target: 25% of bullets have numbers)
    impactScore += Math.min(40, (readability.metricDensity / 0.25) * 40);

    // Weak Words (Penalty)
    impactScore -= (readability.weakWords * 1.5);

    // Hard Skills Mentioned (Target: 4+)
    impactScore += Math.min(25, (keywords.technicalSkills / 4) * 25);

    impactScore = Math.max(0, Math.min(100, impactScore));

    // --- WEIGHTED TOTAL ---
    let totalScore = 0;

    if (hasJobDesc) {
        // With JD: Balanced weighting of relevance (50%), impact (25%), and structure (25%)
        // Score rises progressively as sections are updated with JD keywords and metrics
        totalScore = (jobMatchScore * 0.50) + (impactScore * 0.25) + (structureScore * 0.25);
    } else {
        // Without JD: Structure 55% | Impact 45%
        totalScore = (structureScore * 0.55) + (impactScore * 0.45);

        if (hasCoreSectionsComplete) {
            const structureBonus = Math.round((structureScore / 100) * 5); // 0–5 bonus points
            totalScore = Math.max(90 + structureBonus, totalScore);
        }
    }

    // Final rounding and cap
    let atsScore = Math.round(Math.min(98, totalScore));

    // When a JD is present, ensure ATS Score and Job Match are never identical.
    if (hasJobDesc && atsScore === jobMatchScore) {
        if (atsScore < 98) {
            atsScore = Math.min(98, atsScore + 1);
        } else {
            atsScore = 97;
        }
    }

    return atsScore;
}

function countMatches(text: string, keywords: string[]): number {
    return keywords.filter(keyword => text.includes(keyword)).length;
}

function countQuantifiableMetrics(text: string): number {
    const patterns = [
        /\d+%/g, /\$\d+/g, /\d+\+/g, /\d+ (years?|months?)/gi,
        /\d+ (people|users|clients)/gi
    ];
    let count = 0;
    patterns.forEach(p => {
        const matches = text.match(p);
        if (matches) count += matches.length;
    });
    return count;
}

function calculateCompleteness(sectionScores: AnalyticsResult['sectionScores']): number {
    const REQUIRED_WEIGHT = 5;
    const OPTIONAL_WEIGHT = 1;

    let totalWeight = 0;
    let weightedSum = 0;

    const coreKeys: (keyof typeof sectionScores)[] = ['personalInfo', 'summary', 'experience', 'education', 'skills'];
    for (const key of coreKeys) {
        if (typeof sectionScores[key] === 'number') {
            weightedSum += sectionScores[key]! * REQUIRED_WEIGHT;
            totalWeight += REQUIRED_WEIGHT;
        }
    }

    if (typeof sectionScores.projects === 'number') {
        weightedSum += sectionScores.projects * OPTIONAL_WEIGHT;
        totalWeight += OPTIONAL_WEIGHT;
    }

    if (typeof sectionScores.certifications === 'number') {
        weightedSum += sectionScores.certifications * OPTIONAL_WEIGHT;
        totalWeight += OPTIONAL_WEIGHT;
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

function generateRecommendations(
    data: ResumeData,
    sectionScores: AnalyticsResult['sectionScores'],
    keywords: AnalyticsResult['keywords'],
    readability: AnalyticsResult['readability'],
    atsScore: number,
    jobMatchScore: number,
    completeness: number
): { strengths: string[]; improvements: string[] } {
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Strengths - Updated thresholds
    if (jobMatchScore > 85) strengths.push('Excellent match with the job description');
    if (readability.metricDensity > 0.25) strengths.push('Strong use of metrics (numbers/%) in experience');
    if (keywords.actionVerbs > 10) strengths.push('Dynamic use of action verbs');
    if (completeness > 85) strengths.push('Resume structure is comprehensive');
    if (data.experience.length >= 4) strengths.push('Strong work history with 4+ experiences');

    // Improvements - Updated thresholds
    if (readability.metricDensity < 0.15) improvements.push('Add more numbers! Only ' + Math.round(readability.metricDensity * 100) + '% of your bullets have metrics. Aim for 25%.');
    if (keywords.actionVerbs < 8) improvements.push('Use more diverse action verbs (Spearheaded, Orchestrated, etc.)');

    if (data.jobDescription) {
        if (jobMatchScore < 70) improvements.push('Critical keywords missing. Check the "Relevance" list.');
        if (keywords.missingKeywords.length > 0) {
            improvements.push(`Try to include: ${keywords.missingKeywords.slice(0, 3).join(', ')}`);
        }
    } else {
        improvements.push('Add a Job Description to see your Relevance Score.');
        improvements.push('Tailoring your resume to a job is the #1 way to pass ATS.');
    }

    return { strengths, improvements };
}
