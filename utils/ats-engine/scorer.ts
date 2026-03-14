import { KeywordMatch, ScoreBreakdown, ATSEngineResult, KeywordCategory } from './types';

const CATEGORY_WEIGHTS: Record<string, number> = {
  hard_skills: 0.25,
  tools: 0.20,
  industry_terms: 0.15,
  methodologies: 0.15,
  soft_skills: 0.05,
  quantification: 0.10,
  verb_strength: 0.10
};

export const calculateScoreBreakdown = (
  matchedKeywords: KeywordMatch[],
  totalKeywordsByCategory: Record<string, number>,
  recruiterScores: { quantification: number, verb_strength: number }
): ScoreBreakdown => {
  
  const scores: Record<string, number | null> = {
    hard_skills: null,
    tools: null,
    industry_terms: null,
    methodologies: null,
    soft_skills: null,
    quantification: recruiterScores.quantification,
    verb_strength: recruiterScores.verb_strength
  };

  // Group matches by category
  const matchesByCategory: Record<string, number> = {
    hard_skills: 0,
    tools: 0,
    industry_terms: 0,
    methodologies: 0,
    soft_skills: 0,
  };

  matchedKeywords.forEach(match => {
    matchesByCategory[match.category] += match.score;
  });

  // Calculate percentage for each keyword category
  ['hard_skills', 'tools', 'industry_terms', 'methodologies', 'soft_skills'].forEach(cat => {
    const total = totalKeywordsByCategory[cat];
    if (total > 0) {
      scores[cat] = Math.min((matchesByCategory[cat] / total) * 100, 100);
    } else {
      scores[cat] = null;
    }
  });

  // Calculate overall weighted score
  let overall = 0;
  let totalWeight = 0;

  Object.entries(CATEGORY_WEIGHTS).forEach(([cat, weight]) => {
    const score = scores[cat];
    // Quantification and verb_strength always have "weight" because they are always analyzed
    if (cat === 'quantification' || cat === 'verb_strength') {
      overall += (score || 0) * weight;
      totalWeight += weight;
    } else if (totalKeywordsByCategory[cat] > 0 && score !== null) {
      overall += score * weight;
      totalWeight += weight;
    }
  });

  const finalOverall = totalWeight > 0 ? (overall / totalWeight) : 100;

  return {
    hard_skills: scores.hard_skills,
    tools: scores.tools,
    industry_terms: scores.industry_terms,
    methodologies: scores.methodologies,
    soft_skills: scores.soft_skills,
    quantification: scores.quantification,
    verb_strength: scores.verb_strength,
    raw_score: finalOverall,
    overall_score: Math.round(finalOverall)
  };
};

export const generateSuggestions = (
  missingKeywords: KeywordMatch[],
  quantScore: number,
  verbScore: number
): string[] => {
  const suggestions: string[] = [];
  
  if (quantScore < 50) {
    suggestions.push("Recruiters and hiring managers look for quantifiable results. Add more numbers, percentages, or budgets to your bullet points to show your impact.");
  }
  
  if (verbScore < 60) {
    suggestions.push("Start your achievements with strong, results-oriented action verbs (e.g., 'Orchestrated', 'Catalyzed') to convey authority and ownership.");
  }

  // Sort missing by category weight
  const sortedMissing = [...missingKeywords].sort((a, b) => 
    (CATEGORY_WEIGHTS[b.category] || 0) - (CATEGORY_WEIGHTS[a.category] || 0)
  );

  // Group by category for better advice
  const missingByCat: Record<string, string[]> = {};
  sortedMissing.forEach(m => {
    if (!missingByCat[m.category]) missingByCat[m.category] = [];
    missingByCat[m.category].push(m.job_keyword);
  });

  if (missingByCat.hard_skills?.length > 0) {
    suggestions.push(`Bridge the gap in your core competencies by highlighting experiences related to: ${missingByCat.hard_skills.slice(0, 3).join(', ')}.`);
  }
  
  if (missingByCat.methodologies?.length > 0) {
    suggestions.push(`Demonstrate professional maturity by explicitly mentioning your workflow experience (e.g., ${missingByCat.methodologies.slice(0, 2).join(', ')}).`);
  }

  if (missingByCat.tools?.length > 0) {
    suggestions.push(`Ensure your technical stack is up-to-date by adding: ${missingByCat.tools.slice(0, 3).join(', ')}.`);
  }

  return suggestions;
}

