import { ATSEngineResult, TaxonomyIndustry, KeywordMatch, MatchType, KeywordCategory, ScoreBreakdown } from './types';
import { prepareForMatching } from './normalizer';
import { matchKeywordWithTaxonomy, findPhraseInText } from './matcher';
import { calculateScoreBreakdown, generateSuggestions } from './scorer';

const GENERIC_TOKENS = new Set([
  'team', 'leader', 'results', 'managed', 'led', 'expert', 'professional', 
  'experienced', 'qualified', 'success', 'impact', 'support', 'worked',
  'client', 'stakeholder', 'manager', 'building', 'driving'
]);

export class ATSEngine {
  private taxonomy: any;

  constructor(taxonomy: any) {
    this.taxonomy = taxonomy;
  }

  public analyze(jdText: string, resumeText: string): ATSEngineResult {
    // 1. Detect Industry and Roles
    // We detect based on raw JD but normalized for case/hyphen
    const jdNormalized = prepareForMatching(jdText);
    const { industry, roles } = this.detectIndustryAndRoles(jdNormalized);

    // 2. Load relevant keywords from detected industry and roles
    const requiredKeywords = this.extractRequiredKeywords(jdNormalized, industry, roles);

    // 3. Match keywords
    const matched: KeywordMatch[] = [];
    const missing: KeywordMatch[] = [];

    const synonyms = this.taxonomy.ats_synonyms || this.taxonomy.global?.ats_synonyms || {};
    const clusters = this.taxonomy.skill_clusters || this.taxonomy.global?.skill_clusters || {};
    
    requiredKeywords.forEach(kw => {
      const match = matchKeywordWithTaxonomy(
        kw.text,
        resumeText,
        kw.category,
        synonyms,
        clusters
      );

      if (match) {
        matched.push(match);
      } else {
        missing.push({
          job_keyword: kw.text,
          matched_as: '',
          match_type: 'missing',
          category: kw.category,
          score: 0
        });
      }
    });

    // 4. Calculate Scores
    const totalByCategory: Record<KeywordCategory, number> = {
      hard_skills: requiredKeywords.filter(k => k.category === 'hard_skills').length,
      tools: requiredKeywords.filter(k => k.category === 'tools').length,
      industry_terms: requiredKeywords.filter(k => k.category === 'industry_terms').length,
      methodologies: requiredKeywords.filter(k => k.category === 'methodologies').length,
      soft_skills: requiredKeywords.filter(k => k.category === 'soft_skills').length,
    };

    const scoreBreakdown = calculateScoreBreakdown(matched, totalByCategory);

    return {
      detected_industry: industry?.industry_name || 'Unknown',
      detected_roles: roles.map(r => r.role_name),
      matched_keywords: matched,
      missing_keywords: missing,
      ignored_keywords: [],
      score_breakdown: scoreBreakdown,
      resume_improvement_suggestions: generateSuggestions(missing)
    };
  }

  private detectIndustryAndRoles(jdNormalized: string): { industry: any, roles: any[] } {
    const industries = this.taxonomy.industries || [];
    const detectedRoles: any[] = [];
    let detectedIndustry = null;

    // 1. Try Role-First Detection (High Precision)
    for (const ind of industries) {
      // Don't match "Cross-Industry" roles in the first pass as they are too generic
      if (ind.industry_id === 'cross-industry') continue; 
      
      const roles = ind.roles || [];
      for (const role of roles) {
        if (findPhraseInText(role.role_name, jdNormalized)) {
          detectedRoles.push(role);
          if (!detectedIndustry) {
            detectedIndustry = ind;
          }
        }
      }
    }

    // 2. Fallback to Keyword-based Industry Detection (Lower Precision)
    if (!detectedIndustry) {
      let maxScore = -1;
      industries.forEach((ind: any) => {
        if (ind.industry_id === 'cross-industry') return;

        let score = 0;
        ind.core_keywords.forEach((kw: string) => {
          if (findPhraseInText(kw, jdNormalized)) {
            // Multi-word phrases are stronger signals
            score += kw.includes(' ') ? 2 : 1;
          }
        });

        // Slight penalty for Software/Tech to prevent it from capturing ambiguous JDs 
        // that share common business/tech terms.
        const finalScore = ind.industry_id === 'software-tech' ? score * 0.8 : score;
        
        if (finalScore > maxScore && finalScore > 0) {
          maxScore = finalScore;
          detectedIndustry = ind;
        }
      });
    }

    // 3. Final Fallback to Cross-Industry
    if (!detectedIndustry) {
      detectedIndustry = industries.find((ind: any) => ind.industry_id === 'cross-industry') || null;
    }

    return { industry: detectedIndustry, roles: detectedRoles };
  }

  private extractRequiredKeywords(jdNormalized: string, industry: any, roles: any[]): { text: string, category: KeywordCategory }[] {
    const keywords: { text: string, category: KeywordCategory }[] = [];
    const seen = new Set<string>();

    const add = (text: string, category: KeywordCategory) => {
      if (!text) return;
      const normalized = text.toLowerCase();
      
      if (GENERIC_TOKENS.has(normalized) && !text.includes(' ')) {
        return;
      }

      if (!seen.has(normalized)) {
        if (findPhraseInText(text, jdNormalized)) {
          keywords.push({ text, category });
          seen.add(normalized);
        }
      }
    };

    // 1. Add industry/role keywords
    if (industry) {
      industry.core_keywords?.forEach((k: string) => add(k, 'industry_terms'));
      industry.tool_detection?.forEach((k: string) => add(k, 'tools'));
    }

    roles.forEach(role => {
      role.keywords?.forEach((k: string) => add(k, 'hard_skills'));
      role.tools?.forEach((k: string) => add(k, 'tools'));
      role.soft_skills?.forEach((k: string) => add(k, 'soft_skills'));
    });

    // 2. Add global terms (if found in JD)
    const globals = this.taxonomy.global || {};
    globals.soft_skills?.forEach((k: string) => add(k, 'soft_skills'));
    globals.tools?.forEach((k: string) => add(k, 'tools'));

    // Handle unconventional structures
    if (this.taxonomy.global_soft_skills) {
      this.taxonomy.global_soft_skills.forEach((k: string) => add(k, 'soft_skills'));
    }

    return keywords;
  }
}
