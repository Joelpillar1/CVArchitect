import { ResumeData } from '../../types';

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
    return {
        personalInfo: calculatePersonalInfoScore(data),
        summary: data.summary ? Math.min(100, Math.max(0, (data.summary.length / 200) * 100)) : 0, // Aim for ~200 chars min
        experience: calculateExperienceScore(data),
        education: data.education.length > 0 ? 100 : 0,
        skills: data.skills ? Math.min(100, (data.skills.split(',').length / 6) * 100) : 0, // Aim for 6+ skills
        achievements: data.keyAchievements ? Math.min(100, (data.keyAchievements.split('\n').length / 3) * 100) : 0,
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
    // Base score for having experience 
    let score = 50;

    // Quality checks per role
    const avgDescLength = data.experience.reduce((acc, exp) => acc + (exp.description?.length || 0), 0) / data.experience.length;
    if (avgDescLength > 100) score += 25;
    if (avgDescLength > 200) score += 25;

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
        ...data.experience.map(e => e.description),
        ...data.projects?.map(p => p.description) || []
    ].join(' ').toLowerCase();

    const resultKeywords = {
        actionVerbs: countMatches(resumeText, ACTION_VERBS),
        technicalSkills: countMatches(resumeText, TECHNICAL_KEYWORDS),
        softSkills: countMatches(resumeText, SOFT_SKILLS),
        missingKeywords: [] as string[]
    };

    if (!data.jobDescription || data.jobDescription.trim().length < 50) {
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

    // boost curve for UX (so 50% match feels like a good 75%)
    matchScore = Math.min(99, Math.round(Math.pow(matchScore / 100, 0.7) * 100));

    resultKeywords.missingKeywords = missing;

    return { jobMatchScore: matchScore, keywords: resultKeywords };
}

// ============================================================================
// PILLAR 2: IMPACT (Quality/Readability)
// ============================================================================
function analyzeReadability(data: ResumeData) {
    const descriptions = data.experience.map(e => e.description).filter(Boolean);
    const allResumeText = [data.summary, ...descriptions, data.keyAchievements || ''].join(' ').toLowerCase();

    // 1. Metric Density (Bullets with numbers / Total bullets)
    let totalBullets = 0;
    let numberedBullets = 0;

    data.experience.forEach(exp => {
        const lines = exp.description.split('\n').filter(l => l.trim().length > 5);
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
    const hasJobDesc = data.jobDescription && data.jobDescription.trim().length > 50;

    // --- PILLAR SCORES (0-100) ---

    // 1. Structure Score (Checklist)
    const structureScore = calculateCompleteness(sectionScores);

    // 2. Impact Score (Quality of writing)
    let impactScore = 0;

    // Action Verbs (Target: 15+)
    impactScore += Math.min(30, (keywords.actionVerbs / 15) * 30);

    // Metric Density (Target: 30% of bullets have numbers)
    // readability.metricDensity is 0-1. Target 0.3.
    // Score = (0.15 / 0.30) * 40 = 20 pts
    impactScore += Math.min(40, (readability.metricDensity / 0.3) * 40);

    // Weak Words (Penalty)
    impactScore -= (readability.weakWords * 2);

    // Hard Skills Mentioned (Target: 5+)
    impactScore += Math.min(30, (keywords.technicalSkills / 5) * 30);

    impactScore = Math.max(0, Math.min(100, impactScore));


    // --- WEIGHTED TOTAL ---
    let totalScore = 0;

    if (hasJobDesc) {
        // With JD: Relevance is King
        // Relevance: 50% | Impact: 30% | Structure: 20%
        totalScore = (jobMatchScore * 0.5) + (impactScore * 0.3) + (structureScore * 0.2);
    } else {
        // Without JD: Impact & Structure matter most
        // Impact: 60% | Structure: 40%
        totalScore = (impactScore * 0.6) + (structureScore * 0.4);
    }

    return Math.round(Math.min(99, totalScore));
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

    // Strengths
    if (jobMatchScore > 80) strengths.push('Excellent match with the job description');
    if (readability.metricDensity > 0.3) strengths.push('Strong use of metrics (numbers/%) in experience');
    if (keywords.actionVerbs > 15) strengths.push('Dynamic use of action verbs');
    if (completeness > 90) strengths.push('Resume structure is comprehensive');

    // Improvements
    if (readability.metricDensity < 0.2) improvements.push('Add more numbers! Only ' + Math.round(readability.metricDensity * 100) + '% of your bullets have metrics. Aim for 30%.');
    if (keywords.actionVerbs < 10) improvements.push('Use more diverse action verbs (Spearheaded, Orchestrated, etc.)');

    if (data.jobDescription) {
        if (jobMatchScore < 60) improvements.push('Critical keywords missing. Check the "Relevance" list.');
        if (keywords.missingKeywords.length > 0) {
            improvements.push(`Try to include: ${keywords.missingKeywords.slice(0, 3).join(', ')}`);
        }
    } else {
        improvements.push('Add a Job Description to see your Relevance Score.');
        improvements.push('Tailoring your resume to a job is the #1 way to pass ATS.');
    }

    return { strengths, improvements };
}
