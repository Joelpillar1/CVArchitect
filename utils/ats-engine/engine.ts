import { ATSEngineResult, TaxonomyIndustry, KeywordMatch, MatchType, KeywordCategory, ScoreBreakdown } from './types';
import { prepareForMatching } from './normalizer';
import { matchKeywordWithTaxonomy, findPhraseInText } from './matcher';
import { calculateScoreBreakdown, generateSuggestions } from './scorer';
import { analyzeMetrics, analyzeActionVerbs, checkRoleLevelMatch, getLengthAdvice } from './analytics';
import { BulletRecommender } from './bullet-recommender';

const GENERIC_TOKENS = new Set([
  'team', 'leader', 'results', 'managed', 'led', 'expert', 'professional', 
  'experienced', 'qualified', 'success', 'impact', 'support', 'worked',
  'client', 'stakeholder', 'manager', 'building', 'driving'
]);

import { TaxonomyFlattener } from './taxonomy-flattener';

export class ATSEngine {
  private taxonomy: any;
  private flattener: TaxonomyFlattener;

  constructor(taxonomy: any) {
    this.taxonomy = taxonomy;
    this.flattener = new TaxonomyFlattener(taxonomy);
  }

  public analyze(jdText: string, resumeText: string): ATSEngineResult {
    const jdNormalized = prepareForMatching(jdText);
    
    // 1. Detect Industry and Roles (Keep for context/suggestions)
    const { industry, roles } = this.detectIndustryAndRoles(jdNormalized);

    // 2. Load relevant keywords UNIVERSALLY (Recruiter Brain)
    const requiredKeywords = this.extractRequiredKeywordsUniversal(jdNormalized);

    // 3. Match keywords
    const matched: KeywordMatch[] = [];
    const missing: KeywordMatch[] = [];
    
    // Safety sets for UI deduplication (Case-insensitive)
    const seenMatched = new Set<string>();
    const seenMissing = new Set<string>();

    const synonyms = this.taxonomy.ats_synonyms || this.taxonomy.global?.ats_synonyms || {};
    const clusters = this.taxonomy.skill_clusters || this.taxonomy.global?.skill_clusters || {};
    
    // Internal list for accurate category scoring (allows duplicates across categories)
    const matchesForScoring: KeywordMatch[] = [];

    requiredKeywords.forEach(kw => {
      const matchKey = kw.text.toLowerCase().trim();
      
      const match = matchKeywordWithTaxonomy(
        kw.text,
        resumeText,
        kw.category,
        synonyms,
        clusters
      );

      if (match) {
        matchesForScoring.push(match);
        if (!seenMatched.has(matchKey)) {
          matched.push(match);
          seenMatched.add(matchKey);
          // If we previously thought it was missing (different category order), remove from missing
          seenMissing.add(matchKey); 
        }
      } else {
        // Only mark as missing if we haven't seen it as matched OR missing yet
        if (!seenMissing.has(matchKey) && !seenMatched.has(matchKey)) {
          missing.push({
            job_keyword: kw.text,
            matched_as: '',
            match_type: 'missing',
            category: kw.category,
            score: 0
          });
          seenMissing.add(matchKey);
        }
      }
    });

    // 4. Recruiter Analytics
    const metrics = analyzeMetrics(resumeText);
    const verbs = analyzeActionVerbs(resumeText);
    const levelMatch = checkRoleLevelMatch(resumeText, jdText);
    const lengthAdvice = getLengthAdvice(resumeText);

    // 5. Calculate Scores (Scoring remains category-aware)
    const totalByCategory: Record<string, number> = {
      hard_skills: requiredKeywords.filter(k => k.category === 'hard_skills').length,
      tools: requiredKeywords.filter(k => k.category === 'tools').length,
      industry_terms: requiredKeywords.filter(k => k.category === 'industry_terms').length,
      methodologies: requiredKeywords.filter(k => k.category === 'methodologies').length,
      soft_skills: requiredKeywords.filter(k => k.category === 'soft_skills').length,
    };

    const recruiterScores = {
      quantification: metrics.score,
      verb_strength: verbs.score
    };

    const scoreBreakdown = calculateScoreBreakdown(matchesForScoring, totalByCategory, recruiterScores);

    return {
      detected_industry: industry?.industry_name || 'General / Cross-Industry',
      detected_roles: roles.map(r => r.role_name),
      matched_keywords: matched,
      missing_keywords: missing,
      ignored_keywords: [],
      score_breakdown: scoreBreakdown,
      recruiter_insights: {
        quantification_score: metrics.score,
        action_verb_strength: verbs.score,
        role_level_match: levelMatch,
        detected_metrics: metrics.found,
        power_verbs_found: verbs.found,
        length_advice: lengthAdvice
      },
      resume_improvement_suggestions: generateSuggestions(missing, metrics.score, verbs.score),
      bullet_suggestions: BulletRecommender.recommend(industry?.industry_name || 'General', roles.map(r => r.role_name), missing)
    };
  }

  private extractRequiredKeywordsUniversal(jdNormalized: string): { text: string, category: KeywordCategory }[] {
    const allKeywords = this.flattener.getAllKeywords();
    const found: { text: string, categories: Set<KeywordCategory>, priority: number }[] = [];
    const seen = new Set<string>();

    allKeywords.forEach(kw => {
      const lower = kw.text.toLowerCase();
      if (seen.has(lower)) return;
      
      if (GENERIC_TOKENS.has(lower) && !kw.text.includes(' ')) return;

      if (findPhraseInText(kw.text, jdNormalized)) {
        found.push({ text: kw.text, categories: kw.categories, priority: kw.priority });
        seen.add(lower);
      }
    });

    // Recruiter Logic: Limit to the most critical requirements per category
    const limits: Record<KeywordCategory, number> = {
      hard_skills: 10,
      tools: 8,
      industry_terms: 5,
      methodologies: 5,
      soft_skills: 5
    };

    const countByCategory: Record<KeywordCategory, number> = {
      hard_skills: 0,
      tools: 0,
      industry_terms: 0,
      methodologies: 0,
      soft_skills: 0
    };

    const filtered: { text: string, category: KeywordCategory }[] = [];
    const usedForCategorization = new Set<string>();

    // Sort found keywords by priority and length
    const sortedFound = found.sort((a, b) => b.priority - a.priority || b.text.length - a.text.length);

    // Distribute keywords across categories they belong to
    sortedFound.forEach(item => {
      item.categories.forEach(cat => {
        if (countByCategory[cat] < limits[cat]) {
          filtered.push({ text: item.text, category: cat });
          countByCategory[cat]++;
          usedForCategorization.add(item.text);
        }
      });
    });

    return filtered;
  }

  private detectIndustryAndRoles(jdNormalized: string): { industry: any, roles: any[] } {
    const signatures = this.flattener.getIndustrySignatures();
    const industryScores = new Map<string, number>();
    const detectedRoles: any[] = [];

    // 1. Role-First Pass (Massive Signal)
    const industries = this.taxonomy.industries || [];
    industries.forEach((ind: any) => {
      const roles = ind.roles || [];
      roles.forEach((role: any) => {
        if (findPhraseInText(role.role_name, jdNormalized)) {
          detectedRoles.push(role);
          // Massive score boost for industry if role title matches (50 pts = absolute winner)
          const current = industryScores.get(ind.industry_id) || 0;
          industryScores.set(ind.industry_id, current + 50);
        }
      });
    });

    // 2. Keyword Heatmap Pass (Domain Context)
    signatures.forEach(sig => {
      if (sig.id === 'cross-industry') return;
      
      let score = industryScores.get(sig.id) || 0;
      sig.keywords.forEach(kw => {
        if (findPhraseInText(kw, jdNormalized)) {
          // Multi-word domain phrases (like "Clinical Trials") are 5x stronger than single words
          score += kw.includes(' ') ? 5 : 1;
        }
      });
      industryScores.set(sig.id, score);
    });

    // 3. Analyze winners
    let bestIndustryId = 'cross-industry';
    let maxScore = 1; // Lower threshold (Recruiter intuition: even 1-2 keywords are a signal)

    industryScores.forEach((score, id) => {
      if (score > maxScore) {
        maxScore = score;
        bestIndustryId = id;
      }
    });

    // Find the object or fallback
    let detectedIndustryObj = industries.find((ind: any) => ind.industry_id === bestIndustryId);
    
    // Safety check: if we couldn't find the specific industry object, default to cross-industry
    if (!detectedIndustryObj) {
      detectedIndustryObj = industries.find((ind: any) => ind.industry_id === 'cross-industry');
    }

    // Final safety: if no object at all found in taxonomy, return a virtual one to prevent "Unknown"
    if (!detectedIndustryObj) {
      detectedIndustryObj = { industry_id: 'cross-industry', industry_name: 'General / Cross-Industry' };
    }

    return { industry: detectedIndustryObj, roles: detectedRoles };
  }
}
