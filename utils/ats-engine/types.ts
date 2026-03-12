export type MatchType = 'exact' | 'normalized' | 'synonym' | 'semantic' | 'missing';

export interface KeywordMatch {
  job_keyword: string;
  matched_as: string;
  match_type: MatchType;
  category: KeywordCategory;
  score: number;
}

export type KeywordCategory = 
  | 'hard_skills' 
  | 'tools' 
  | 'industry_terms' 
  | 'methodologies' 
  | 'soft_skills';

export interface ScoreBreakdown {
  hard_skills: number | null;
  tools: number | null;
  industry_terms: number | null;
  methodologies: number | null;
  soft_skills: number | null;
  overall_score: number;
}

export interface ATSEngineResult {
  detected_industry: string;
  detected_roles: string[];
  matched_keywords: KeywordMatch[];
  missing_keywords: KeywordMatch[];
  ignored_keywords: string[];
  score_breakdown: ScoreBreakdown;
  resume_improvement_suggestions: string[];
}

export interface TaxonomyRole {
  role_id: string;
  role_name: string;
  hard_skills: string[];
  tools: string[];
  methodologies: string[];
  certifications: string[];
  domain_terms: string[];
  soft_skills: string[];
  buzzwords: string[];
  synonyms: Record<string, string[]>;
  semantic_clusters: string[][];
}

export interface TaxonomyIndustry {
  industry_id: string;
  industry_name: string;
  roles: TaxonomyRole[];
}
