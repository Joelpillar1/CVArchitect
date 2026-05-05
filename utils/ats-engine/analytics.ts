import { KeywordCategory } from './types';

/**
 * Recruiter-Grade Analytics
 * Focuses on "Hiring Signal" beyond simple keywords.
 */

// Comprehensive Master Verb Dictionary (Recruiter-Grade)
// Grouped conceptually, but flattened into a set for fast lookup
const ACTION_VERBS = new Set([
  // Leadership & Management
  'achieved', 'managed', 'led', 'developed', 'implemented', 'orchestrated', 'spearheaded',
  'governed', 'directed', 'supervised', 'chaired', 'controlled', 'executed', 'formalized', 
  'inspired', 'mentored', 'motivated', 'overhauled', 'piloted', 'prioritized', 'reorganized', 
  'streamlined', 'transformed', 'headed', 'delegated', 'coordinated', 'mentored', 'trained',
  
  // Technical & Creation
  'built', 'engineered', 'programmed', 'architected', 'designed', 'integrated', 'deployed', 
  'debugged', 'refactored', 'validated', 'automated', 'configured', 'installed', 'maintained', 
  'patched', 'upgraded', 'scripted', 'coded', 'solved', 'prototyped', 'launched', 'pioneered',
  'devised', 'established', 'formulated', 'founded', 'instituted', 'introduced', 'invented',
  
  // Results & Performance
  'increased', 'decreased', 'optimized', 'accelerated', 'generated', 'saved', 'clarified', 
  'catalyzed', 'delivered', 'enacted', 'expanded', 'expedited', 'maximized', 'outpaced', 
  'projected', 'reduced', 'surpassed', 'yielded', 'earned', 'captured', 'surged',
  
  // Communication & Collaboration
  'presented', 'authored', 'collaborated', 'negotiated', 'persuaded', 'documented', 'corresponded', 
  'mediated', 'facilitated', 'promoted', 'publicized', 'influenced', 'interfaced', 'liaised', 
  'marketed', 'translated', 'wrote', 'advocated', 'consulted', 'conveyed', 'resolved',
  
  // Analysis & Operations
  'administered', 'analyzed', 'audited', 'calculated', 'deciphered', 'evaluated', 'forecasted', 
  'investigated', 'mapped', 'monitored', 'qualified', 'quantified', 'surveyed', 'tracked',
  'verified', 'simplified', 'distributed', 'processed', 'recorded'
]);

// Variations to stem (e.g., "managing" -> "manage")
const getVerbStem = (word: string): string => {
  if (word.length <= 3) return word;
  
  // Handle common suffixes for action verbs
  let stem = word;
  if (word.endsWith('ing')) stem = word.slice(0, -3);
  else if (word.endsWith('ed')) stem = word.slice(0, -2);
  else if (word.endsWith('es')) stem = word.slice(0, -2);
  else if (word.endsWith('s')) stem = word.slice(0, -1);
  
  // Handle common trailing 'e' removal (e.g. manage -> manag + ing)
  if (stem.endsWith('i')) return stem.slice(0, -1) + 'e';
  
  return stem;
};

// Flattened set of stems for even more robust detection
const ACTION_VERB_STEMS = new Set(Array.from(ACTION_VERBS).map(v => getVerbStem(v)));

// Seniority markers for role-level check
const SENIORITY_TERMS = {
  senior: ['senior', 'sr', 'lead', 'head', 'principal', 'staff', 'director', 'vp', 'chief'],
  junior: ['junior', 'jr', 'entry', 'associate', 'intern', 'trainee', 'apprentice']
};

export interface RecruiterInsights {
  quantification_score: number; // 0-100 based on numeric density
  action_verb_strength: number; // 0-100 based on verb usage
  role_level_match: 'match' | 'mismatch' | 'unclear';
  detected_metrics: string[];
  power_verbs_found: string[];
  length_advice: string;
}

/**
 * Detects metrics and quantification indicators in text
 */
export const analyzeMetrics = (text: string): { score: number, found: string[] } => {
  // Matches percentages, currency, and large numbers (e.g. 10+, 50,000, $1M, 20%)
  // We use (\b|\$) to handle both currency and generic numbers safely.
  const metricRegex = /(?:\$?\d+(?:,\d{3})*(?:\.\d+)?%?|\d{1,3}\+)[kmb]?/gi;
  const matches = text.match(metricRegex) || [];
  
  // Filter out:
  // 1. Common years (1900-2099)
  // 2. Single digit numbers or fragments that aren't meaningful
  const filteredMatches = matches.filter(m => {
    // Basic cleanup - remove currency symbol for year check
    const cleanNum = m.replace(/[$,%]/g, '');
    const isYear = /^(19|20)\d{2}$/.test(cleanNum);
    const isSmallNumber = cleanNum.length < 2 && !m.includes('+');
    const isFragment = /^[0,]+$/.test(cleanNum); // Filters "000" or just commas
    
    return !isYear && !isSmallNumber && !isFragment;
  });

  // Recruiter rule of thumb: At least 3-5 quantified achievements for a strong resume
  const uniqueMatches = Array.from(new Set(filteredMatches.map(m => m.toLowerCase())));
  const score = Math.min((uniqueMatches.length / 5) * 100, 100);
  
  return {
    score: Math.round(score),
    found: uniqueMatches
  };
};

export const analyzeActionVerbs = (text: string): { score: number, found: string[] } => {
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const foundSet = new Set<string>();

  words.forEach(word => {
    // Direct match check
    if (ACTION_VERBS.has(word)) {
      foundSet.add(word);
      return;
    }
    
    // Stemmed match check
    const stem = getVerbStem(word);
    if (ACTION_VERB_STEMS.has(stem)) {
      // Find the original "canonical" verb from the dictionary that matches this stem
      const canonical = Array.from(ACTION_VERBS).find(v => getVerbStem(v) === stem);
      if (canonical) foundSet.add(canonical);
    }
  });
  
  const uniqueVerbs = Array.from(foundSet);
  // Recruiter rule: A strong resume should have at least 10-12 unique high-impact verbs
  const score = Math.min((uniqueVerbs.length / 10) * 100, 100);
  
  return {
    score: Math.round(score),
    found: uniqueVerbs
  };
};

/**
 * Checks if the resume's seniority matches the job description's tone
 */
export const checkRoleLevelMatch = (resumeText: string, jdText: string): 'match' | 'mismatch' | 'unclear' => {
  const rText = resumeText.toLowerCase();
  const jText = jdText.toLowerCase();

  const isSeniorJD = SENIORITY_TERMS.senior.some(term => new RegExp(`\\b${term}\\b`, 'i').test(jText));
  const isJuniorJD = SENIORITY_TERMS.junior.some(term => new RegExp(`\\b${term}\\b`, 'i').test(jText));

  const hasSeniorResume = SENIORITY_TERMS.senior.some(term => new RegExp(`\\b${term}\\b`, 'i').test(rText));
  const hasJuniorResume = SENIORITY_TERMS.junior.some(term => new RegExp(`\\b${term}\\b`, 'i').test(rText));

  if (isSeniorJD && !hasSeniorResume && hasJuniorResume) return 'mismatch';
  if (isJuniorJD && hasSeniorResume) return 'mismatch';
  if ((isSeniorJD && hasSeniorResume) || (isJuniorJD && !hasSeniorResume)) return 'match';

  return 'unclear';
};

/**
 * Provides advice based on resume length
 */
export const getLengthAdvice = (text: string): string => {
  const wordCount = text.split(/\W+/).length;
  if (wordCount < 150) return "Your resume is very brief. Recruiters need more detail to assess your impact.";
  if (wordCount > 1000) return "Your resume is quite long. Consider condensing it to 1-2 pages for maximum impact.";
  return "Great resume length. It's concise yet detailed.";
};
