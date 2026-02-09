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
        achievements: number;
        projects: number;
        certifications: number;
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
    'him', 'his', 'she', 'her', 'hers', 'work', 'job', 'role', 'position', 'experience', 'year',
    'years', 'team', 'company', 'business', 'client', 'clients', 'project', 'projects'
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

function calculateSectionScores(data: ResumeData) {
    // Count skills properly (trim and filter empty entries)
    const skillCount = data.skills
        ? data.skills.split(',').map(s => s.trim()).filter(s => s.length > 0).length
        : 0;

    // Count achievement lines properly (handle both string and array formats)
    let achievementLines = 0;
    if (data.keyAchievements) {
        if (Array.isArray(data.keyAchievements)) {
            achievementLines = data.keyAchievements.filter(line => line.trim().length > 0).length;
        } else if (typeof data.keyAchievements === 'string') {
            achievementLines = data.keyAchievements.split('\n').filter(line => line.trim().length > 0).length;
        }
    }

    return {
        personalInfo: calculatePersonalInfoScore(data),
        summary: data.summary ? Math.min(100, Math.max(0, (data.summary.length / 150) * 100)) : 0, // Aim for ~150 chars min (more achievable)
        experience: calculateExperienceScore(data),
        education: data.education.length > 0 ? 100 : 0,
        skills: skillCount >= 9 ? 100 : Math.min(100, (skillCount / 9) * 100), // 100 points at 9+ skills
        achievements: achievementLines >= 3 ? 100 : Math.min(100, (achievementLines / 3) * 100), // 100 points at 3+ achievements
        projects: data.projects && data.projects.length > 0 ? 100 : 50, // Projects are optional but good
        certifications: data.certifications && data.certifications.length > 0 ? 100 : 50 // Optional
    };
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
        ...data.projects?.map(p => p.description) || []
    ].join(' ').toLowerCase();

    const resultKeywords = {
        actionVerbs: countMatches(resumeText, ACTION_VERBS),
        technicalSkills: countMatches(resumeText, TECHNICAL_KEYWORDS),
        softSkills: countMatches(resumeText, SOFT_SKILLS),
        missingKeywords: [] as string[]
    };

    if (!data.jobDescription || data.jobDescription.trim().length < 50 || !data.hasJobMatchRun) {
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
    // Safety cap to avoid huge denominators
    totalPossibleWeight = Math.max(1, totalPossibleWeight);

    let earnedWeight = 0;
    const missing: string[] = [];

    // Score Critical
    criticalKeywords.forEach(kw => {
        if (resumeText.includes(kw)) {
            earnedWeight += 3;
        } else {
            // Only add to missing list if it's a known skill or very frequent word
            // limiting to top 10 to avoid noise
            if (missing.length < 10) missing.push(kw);
        }
    });

    // Score Bonus
    bonusKeywords.forEach(kw => {
        if (resumeText.includes(kw)) {
            earnedWeight += 1;
        }
    });

    // Normalize to 0-100
    let matchScore = (earnedWeight / totalPossibleWeight) * 100;

    // Base score boost for having 4+ experiences (shows commitment and depth)
    const experienceBoost = data.experience.length >= 4 ? 15 : 0;
    matchScore += experienceBoost;

    // More generous boost curve for better UX (easier to reach 90%+)
    // Using power of 0.6 instead of 0.7 for more aggressive boost
    matchScore = Math.min(98, Math.round(Math.pow(matchScore / 100, 0.6) * 100));

    // When a job description is present, users are explicitly using Job Match.
    // For UX reasons, the score should never look "failing", but it also
    // shouldn't look obviously hard-coded. Keep it dynamic but ensure >= 90.
    if (matchScore < 90) {
        // Map low raw scores into a 90–94 band based on how strong they were.
        const clampedBase = Math.max(0, Math.min(89, matchScore));
        const normalized = clampedBase / 89; // 0–1
        const extra = Math.round(normalized * 4); // 0–4
        matchScore = 90 + extra; // 90–94
    }

    // Final safety cap
    matchScore = Math.min(98, matchScore);

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

    // 2. Verb Variety (Coming from keywords.actionVerbs)
    // We already count total action verbs in analyzeKeywords. 
    // Here we can just store the raw counts.

    const allText = [
        data.summary,
        ...descriptions,
        data.keyAchievements || ''
    ].join(' ').toLowerCase();

    const countQuantifiable = countQuantifiableMetrics(allText);
    const weakWordsCount = countMatches(allText, WEAK_WORDS);

    return {
        avgWordCount: 0, // Less important now
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
    const hasJobDesc = !!(data.jobDescription && data.jobDescription.trim().length > 50 && data.hasJobMatchRun);

    // Core section completion (personal info, summary, experience, education, skills, achievements)
    const hasPersonalInfo =
        !!data.fullName &&
        !!data.email &&
        !!data.phone &&
        !!data.linkedin &&
        !!data.location;
    const hasSummary = !!data.summary && data.summary.trim().length > 0;
    const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
    const hasEducation = Array.isArray(data.education) && data.education.length > 0;
    const hasSkills = !!data.skills && data.skills.split(',').map(s => s.trim()).filter(Boolean).length > 0;
    const hasAchievements =
        !!data.keyAchievements &&
        (
            (Array.isArray(data.keyAchievements) && data.keyAchievements.filter(line => line.trim().length > 0).length > 0) ||
            (typeof data.keyAchievements === 'string' && data.keyAchievements.split('\n').filter(line => line.trim().length > 0).length > 0)
        );
    const hasCoreSectionsComplete =
        hasPersonalInfo && hasSummary && hasExperience && hasEducation && hasSkills && hasAchievements;

    // --- PILLAR SCORES (0-100) ---

    // 1. Structure Score (Checklist)
    const structureScore = calculateCompleteness(sectionScores);

    // 2. Impact Score (Quality of writing) - More generous scoring
    let impactScore = 0;

    // Action Verbs (Target: 10+ for good score, was 15+)
    impactScore += Math.min(35, (keywords.actionVerbs / 10) * 35);

    // Metric Density (Target: 25% of bullets have numbers, was 30%)
    // More achievable target
    impactScore += Math.min(40, (readability.metricDensity / 0.25) * 40);

    // Weak Words (Penalty) - Reduced penalty
    impactScore -= (readability.weakWords * 1.5);

    // Hard Skills Mentioned (Target: 4+, was 5+)
    impactScore += Math.min(25, (keywords.technicalSkills / 4) * 25);

    impactScore = Math.max(0, Math.min(100, impactScore));


    // --- WEIGHTED TOTAL ---
    let totalScore = 0;

    if (hasJobDesc) {
        // With JD: Relevance is King, but structure still matters
        // Relevance: 55% | Impact: 25% | Structure: 20%
        totalScore = (jobMatchScore * 0.55) + (impactScore * 0.25) + (structureScore * 0.20);

        // Whenever a job description is provided (i.e., user is using Job Match),
        // ATS score should never show as "failing", but keep it dynamic.
        if (totalScore < 90) {
            // Map low raw ATS scores into a 90–94 band based on strength.
            const clampedBase = Math.max(0, Math.min(89, totalScore));
            const normalized = clampedBase / 89; // 0–1
            const extra = Math.round(normalized * 4); // 0–4
            totalScore = 90 + extra; // 90–94
        }
    } else {
        // Without JD: Structure is most important for complete resumes
        // Structure: 50% | Impact: 50%
        // This ensures users with complete sections get ~80% score
        totalScore = (structureScore * 0.50) + (impactScore * 0.50);

        // If the user has filled all core sections (personal info, summary, experience,
        // education, skills, achievements), ATS score should feel clearly "passing"
        // for scratch-built resumes.
        if (hasCoreSectionsComplete && totalScore < 80 && data.source !== 'upload') {
            totalScore = 80;
        }

        // For uploaded resumes (no Job Description yet), ATS score should never appear
        // "too high" out of the box. Clamp to a maximum of 70 so users see room to improve.
        if (data.source === 'upload' && !hasJobDesc && totalScore > 70) {
            totalScore = 70;
        }
    }

    // Final rounding and cap
    let atsScore = Math.round(Math.min(98, totalScore));

    // When a job description is present, ensure ATS Score and Job Match are never identical.
    // Nudge ATS by 1 point while keeping it within 90–98.
    if (hasJobDesc && atsScore === jobMatchScore) {
        if (atsScore < 98) {
            atsScore = Math.min(98, atsScore + 1);
        } else {
            atsScore = 97; // if both were 98, drop ATS slightly
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
    const scores = Object.values(sectionScores);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
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
