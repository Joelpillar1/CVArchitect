/**
 * Normalization utilities for the ATS Engine.
 * Handles cleaning, acronym expansion, and phrase preservation.
 */

export const normalizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Replace punctuation with space, but keep periods within acronyms (handled later if needed)
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ') 
    .replace(/\s{2,}/g, ' '); // Collapse multiple spaces
};

/**
 * Normalizes hyphens to spaces to ensure "cross-functional" matches "cross functional"
 */
export const normalizeHyphens = (text: string): string => {
  return text.replace(/-/g, ' ');
};

/**
 * Handles common acronym expansions
 */
const ACRONYMS: Record<string, string> = {
  'ai': 'artificial intelligence',
  'ml': 'machine learning',
  'ux': 'user experience',
  'ui': 'user interface',
  'ats': 'applicant tracking system',
  'saas': 'software as a service',
  'b2b': 'business to business',
  'b2c': 'business to consumer',
  'api': 'application programming interface',
  'kpi': 'key performance indicator',
  'roi': 'return on investment',
  'aws': 'amazon web services',
  'gcp': 'google cloud platform',
  'azure': 'microsoft azure',
  'ci': 'continuous integration',
  'cd': 'continuous deployment',
  'crm': 'customer relationship management',
  'erp': 'enterprise resource planning',
  'sql': 'structured query language',
  'rest': 'representational state transfer',
  'pmo': 'project management office',
  'hr': 'human resources',
};

export const expandAcronyms = (text: string): string => {
  let expanded = text.toLowerCase();
  Object.entries(ACRONYMS).forEach(([acronym, full]) => {
    // Escape and use word boundary
    const regex = new RegExp(`\\b${acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    // We keep both the acronym and full text to maximize match probability
    expanded = expanded.replace(regex, `${acronym} ${full}`);
  });
  return expanded;
};

/**
 * Simple plural to singular normalization (basic)
 */
export const singularize = (word: string): string => {
  if (!word) return '';
  const lower = word.toLowerCase();
  if (lower.endsWith('ies')) return lower.slice(0, -3) + 'y';
  if (lower.endsWith('es') && !lower.endsWith('ses')) return lower.slice(0, -2);
  if (lower.endsWith('s') && !lower.endsWith('ss')) return lower.slice(0, -1);
  return lower;
};

/**
 * Prepares a text for phrase matching by applying all normalizations
 */
export const prepareForMatching = (text: string): string => {
  let processed = normalizeText(text);
  processed = normalizeHyphens(processed);
  processed = expandAcronyms(processed);
  return processed;
};
