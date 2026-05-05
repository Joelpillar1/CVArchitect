import { BulletSuggestion, KeywordMatch } from './types';
import { SUGGESTED_BULLETS } from './suggested-bullets';

export class BulletRecommender {
  /**
   * Recommends high-impact bullet points based on the detected role, industry, and missing keywords.
   */
  public static recommend(
    detectedIndustry: string,
    detectedRoles: string[],
    missingKeywords: KeywordMatch[]
  ): BulletSuggestion[] {
    const missingKeys = new Set(missingKeywords.map(kw => kw.job_keyword.toLowerCase()));
    const recommendations: BulletSuggestion[] = [];

    // Normalize industry name (e.g., "Software / Tech" -> "software-tech")
    // We try to match common patterns or IDs
    const normalizedIndustry = detectedIndustry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const normalizedRoles = detectedRoles.map(r => r.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    SUGGESTED_BULLETS.forEach(template => {
      // 1. Determine relevance (Role OR Industry)
      const isIndustryRelevant = template.industry_tags.some(tag => 
        normalizedIndustry.includes(tag) || tag.includes(normalizedIndustry)
      );

      const isRoleRelevant = normalizedRoles.length === 0 || template.role_tags.some(tag => 
        normalizedRoles.some(r => r.includes(tag) || tag.includes(r))
      );

      // We accept if either role or industry matches (Industry is a safe fallback)
      if (isRoleRelevant || isIndustryRelevant) {
        // 2. Check if this bullet addresses any missing keywords
        // We use a looser match to capture variations (e.g. "React" matches "React.js")
        const addressed = template.keywords.filter(kw => {
          const lowerKw = kw.toLowerCase();
          return Array.from(missingKeys).some(mk => mk.includes(lowerKw) || lowerKw.includes(mk));
        });

        if (addressed.length > 0) {
          recommendations.push({
            text: template.text,
            role: template.role_tags[0].replace(/-/g, ' ').toUpperCase(),
            keywords_addressed: addressed
          });
        }
      }
    });

    // 3. Sort by relevance:
    // - Number of keywords addressed (Primary)
    // - Role match (Secondary)
    return recommendations
      .sort((a, b) => b.keywords_addressed.length - a.keywords_addressed.length)
      .slice(0, 3);
  }
}
