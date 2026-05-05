import { prepareForMatching, singularize } from './normalizer';
import { KeywordMatch, MatchType, KeywordCategory } from './types';

/**
 * Escapes special characters for use in a Regular Expression
 */
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Checks if a specific phrase or keyword exists in the normalized text.
 * Now handles simple plural/singular variations as well.
 */
export const findPhraseInText = (phrase: string, text: string): MatchType | null => {
  const normalizedPhrase = prepareForMatching(phrase);
  const normalizedText = prepareForMatching(text);

  // 1. Exact/Normalized Match
  const exactRegex = new RegExp(`\\b${escapeRegExp(normalizedPhrase)}\\b`, 'i');
  if (exactRegex.test(normalizedText)) {
    return 'normalized';
  }

  // 2. Singular/Plural Match fallback
  const words = normalizedPhrase.split(' ');
  const singularPhrase = words.map(w => singularize(w)).join(' ');
  
  // Try singular version
  const singularRegex = new RegExp(`\\b${escapeRegExp(singularPhrase)}\\b`, 'i');
  if (singularRegex.test(normalizedText)) {
    return 'normalized';
  }

  // Try common pluralizations if singular didn't match
  if (words.length === 1) {
    const word = words[0];
    const pluralPatterns = [
        `${word}s`,
        `${word}es`,
        word.endsWith('y') ? `${word.slice(0, -1)}ies` : null
    ].filter(Boolean);

    for (const plural of pluralPatterns) {
        const pluralRegex = new RegExp(`\\b${escapeRegExp(plural!)}\\b`, 'i');
        if (pluralRegex.test(normalizedText)) {
            return 'normalized';
        }
    }
  }

  return null;
};

/**
 * Higher-order matching logic that handles synonyms and semantic clusters
 */
export const matchKeywordWithTaxonomy = (
  keyword: string,
  resumeText: string,
  category: KeywordCategory,
  synonyms?: Record<string, string[]>,
  semanticClusters?: string[][]
): KeywordMatch | null => {
  
  // Try direct match
  const directMatch = findPhraseInText(keyword, resumeText);
  if (directMatch) {
    return {
      job_keyword: keyword,
      matched_as: keyword,
      match_type: directMatch,
      category,
      score: 1.0
    };
  }

  // Try Synonym match
  if (synonyms) {
    for (const [canonical, variants] of Object.entries(synonyms)) {
      const allVariants = [canonical, ...variants];
      const isPartOfThisSynonymGroup = allVariants.some(v => v.toLowerCase() === keyword.toLowerCase());
      
      if (isPartOfThisSynonymGroup) {
        for (const variant of allVariants) {
          if (findPhraseInText(variant, resumeText)) {
            return {
              job_keyword: keyword,
              matched_as: variant,
              match_type: 'synonym',
              category,
              score: 0.9
            };
          }
        }
      }
    }
  }

  // Try Semantic Cluster match
  if (semanticClusters) {
    // semanticClusters is expected to be an array of arrays (e.g. from JSON)
    // The current logic expects string[][].
    const clusters = Array.isArray(semanticClusters) ? semanticClusters : Object.values(semanticClusters);
    
    for (const cluster of clusters as string[][]) {
      if (cluster.some(term => term.toLowerCase() === keyword.toLowerCase())) {
        for (const term of cluster) {
          if (findPhraseInText(term, resumeText)) {
            return {
              job_keyword: keyword,
              matched_as: term,
              match_type: 'semantic',
              category,
              score: 0.8
            };
          }
        }
      }
    }
  }

  return null;
};
