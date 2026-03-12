import { KeywordMatch, ScoreBreakdown, ATSEngineResult, KeywordCategory } from './types';

const CATEGORY_WEIGHTS: Record<KeywordCategory, number> = {
  hard_skills: 0.30,
  tools: 0.25,
  industry_terms: 0.20,
  methodologies: 0.15,
  soft_skills: 0.10,
};

export const calculateScoreBreakdown = (
  matchedKeywords: KeywordMatch[],
  totalKeywordsByCategory: Record<KeywordCategory, number>
): ScoreBreakdown => {
  
  const scores: Record<KeywordCategory, number | null> = {
    hard_skills: null,
    tools: null,
    industry_terms: null,
    methodologies: null,
    soft_skills: null,
  };

  // Group matches by category
  const matchesByCategory: Record<KeywordCategory, number> = {
    hard_skills: 0,
    tools: 0,
    industry_terms: 0,
    methodologies: 0,
    soft_skills: 0,
  };

  matchedKeywords.forEach(match => {
    matchesByCategory[match.category] += match.score;
  });

  // Calculate percentage for each category
  (Object.keys(scores) as KeywordCategory[]).forEach(cat => {
    const total = totalKeywordsByCategory[cat];
    if (total > 0) {
      scores[cat] = Math.min((matchesByCategory[cat] / total) * 100, 100);
    } else {
      scores[cat] = null; // Return null if no keywords required
    }
  });

  // Calculate overall weighted score
  let overall = 0;
  let totalWeight = 0;

  Object.entries(CATEGORY_WEIGHTS).forEach(([cat, weight]) => {
    const category = cat as KeywordCategory;
    // Only count categories that had requirements in the JD towards the weighted average
    const score = scores[category];
    if (totalKeywordsByCategory[category] > 0 && score !== null) {
      overall += score * weight;
      totalWeight += weight;
    }
  });

  // Re-normalize if some categories were empty
  const finalOverall = totalWeight > 0 ? (overall / totalWeight) : 100;

  return {
    ...scores,
    overall_score: Math.round(finalOverall)
  };
};

export const generateSuggestions = (
  missingKeywords: KeywordMatch[]
): string[] => {
  const suggestions: string[] = [];
  
  // Sort missing by category weight
  const sortedMissing = [...missingKeywords].sort((a, b) => 
    CATEGORY_WEIGHTS[b.category] - CATEGORY_WEIGHTS[a.category]
  );

  // Take the top 5 most important missing keywords
  const topMissing = sortedMissing.slice(0, 5);
  
  if (topMissing.length > 0) {
    suggestions.push(`Add context and achievements around missing hard skills: ${topMissing.filter(m => m.category === 'hard_skills').map(m => m.job_keyword).join(', ')}`);
    suggestions.push(`Ensure the following industry tools are explicitly mentioned: ${topMissing.filter(m => m.category === 'tools').map(m => m.job_keyword).join(', ')}`);
  }

  return suggestions.filter(s => !s.endsWith(': '));
};
