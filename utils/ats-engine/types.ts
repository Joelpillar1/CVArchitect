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

export interface ScoreBreakdown extends Record<KeywordCategory | string, number | null> {
  hard_skills: number | null;
  tools: number | null;
  industry_terms: number | null;
  methodologies: number | null;
  soft_skills: number | null;
  quantification: number | null;
  verb_strength: number | null;
  raw_score: number;
  overall_score: number;
}

export interface RecruiterInsights {
  quantification_score: number;
  action_verb_strength: number;
  role_level_match: 'match' | 'mismatch' | 'unclear';
  detected_metrics: string[];
  power_verbs_found: string[];
  length_advice: string;
}

export interface ATSEngineResult {
  detected_industry: string;
  detected_roles: string[];
  matched_keywords: KeywordMatch[];
  missing_keywords: KeywordMatch[];
  ignored_keywords: string[];
  score_breakdown: ScoreBreakdown;
  recruiter_insights: RecruiterInsights;
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
