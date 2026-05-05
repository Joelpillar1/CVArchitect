import { KeywordCategory } from './types';

export interface FlattenedKeyword {
  text: string;
  categories: Set<KeywordCategory>;
  priority: number; // Highest priority assigned to this keyword
}

export class TaxonomyFlattener {
  private keywordMap: Map<string, FlattenedKeyword> = new Map();
  private industrySignatures: Map<string, { id: string, name: string, keywords: Set<string> }> = new Map();

  constructor(taxonomy: any) {
    this.flatten(taxonomy);
  }

  private addKeyword(text: string, category: KeywordCategory, priority: number, industryId?: string) {
    if (!text || text.length < 2) return;
    const lower = text.toLowerCase();
    
    // 1. Add/Update global keyword map
    const existing = this.keywordMap.get(lower);
    if (existing) {
        existing.categories.add(category);
        existing.priority = Math.max(existing.priority, priority);
    } else {
        this.keywordMap.set(lower, { 
            text, 
            categories: new Set([category]), 
            priority 
        });
    }

    // 2. Add to industry signature for classification
    if (industryId) {
        if (!this.industrySignatures.has(industryId)) {
            this.industrySignatures.set(industryId, { id: industryId, name: '', keywords: new Set() });
        }
        this.industrySignatures.get(industryId)?.keywords.add(lower);
    }
  }

  private flatten(taxonomy: any) {
    // 1. Process Global Terms
    const globals = taxonomy.global || {};
    globals.tools?.forEach((k: string) => this.addKeyword(k, 'tools', 2));
    globals.soft_skills?.forEach((k: string) => this.addKeyword(k, 'soft_skills', 1));

    // 2. Process Industries
    const industries = taxonomy.industries || [];
    industries.forEach((ind: any) => {
      const indId = ind.industry_id;
      if (this.industrySignatures.has(indId)) {
        const sig = this.industrySignatures.get(indId)!;
        sig.name = ind.industry_name;
      } else {
        this.industrySignatures.set(indId, { id: indId, name: ind.industry_name, keywords: new Set() });
      }

      ind.core_keywords?.forEach((k: string) => this.addKeyword(k, 'industry_terms', 2, indId));
      ind.tool_detection?.forEach((k: string) => this.addKeyword(k, 'tools', 2, indId));

      // 3. Process Roles within Industries
      ind.roles?.forEach((role: any) => {
        // Role names are massive signals for industry
        this.addKeyword(role.role_name, 'hard_skills', 3, indId);
        
        role.keywords?.forEach((k: string) => this.addKeyword(k, 'hard_skills', 3, indId));
        role.tools?.forEach((k: string) => this.addKeyword(k, 'tools', 2, indId));
        role.soft_skills?.forEach((k: string) => this.addKeyword(k, 'soft_skills', 1, indId));

        if (role.skill_clusters) {
            role.skill_clusters.domain?.forEach((k: string) => this.addKeyword(k, 'hard_skills', 3, indId));
            role.skill_clusters.execution?.forEach((k: string) => this.addKeyword(k, 'methodologies', 2, indId));
            role.skill_clusters.business?.forEach((k: string) => this.addKeyword(k, 'methodologies', 2, indId));
            role.skill_clusters.tools?.forEach((k: string) => this.addKeyword(k, 'tools', 2, indId));
        }
      });
    });
  }

  public getMap(): Map<string, FlattenedKeyword> {
    return this.keywordMap;
  }

  public getIndustrySignatures() {
    return Array.from(this.industrySignatures.values());
  }

  public getAllKeywords(): FlattenedKeyword[] {
    return Array.from(this.keywordMap.values());
  }
}
