import { ResumeData } from '../types';
import { ResumeStateAnalysis } from './resumeState';
import { JobDescriptionData } from '../types/resumeAgent';

export interface ResumeQualityScore {
  completeness: number;
  clarity: number;
  impact: number;
  evidence: number;
  atsAlignment: number;
  overallScore: number;
}

export interface ResumePriorityAction {
  id: string;
  section: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  action: 'ADD_SUMMARY' | 'REWRITE_BULLETS' | 'EXPAND_SKILLS' | 'ADD_EDUCATION' | 'QUANTIFY_SCOPE';
  description: string;
}

/**
 * Deterministically computes structured resume quality scores across key dimensions.
 */
export function assessResumeQuality(resume: ResumeData, jobData?: JobDescriptionData | null): ResumeQualityScore {
  let completeness = 0;
  let clarity = 50;
  let impact = 40;
  let evidence = 40;
  let atsAlignment = 50;

  // 1. Completeness Score (0 - 100)
  if (resume.fullName && resume.fullName.trim().length > 0) completeness += 15;
  if (resume.email || resume.phone) completeness += 15;
  if (resume.summary && resume.summary.trim().length > 40) completeness += 20;
  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    completeness += 30;
  }
  if (Array.isArray(resume.education) && resume.education.length > 0) completeness += 10;
  if (resume.skills && resume.skills.trim().length > 0) completeness += 10;

  completeness = Math.min(100, completeness);

  // 2. Impact & Evidence Scoring (Detect action verbs, metrics, numbers)
  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    let hasNumbers = false;
    let hasStrongVerbs = false;
    const strongVerbRegex = /\b(spearheaded|architected|engineered|orchestrated|delivered|scaled|designed|built|led|optimized)\b/i;
    const numberRegex = /\b(\d+(\.\d+)?(%|\+|k|m|x)?|\$\d+)\b/i;

    for (const exp of resume.experience) {
      const desc = (exp as { description?: string | string[] }).description;
      const descText = Array.isArray(desc) ? desc.join(' ') : (desc || '');
      if (descText) {
        if (numberRegex.test(descText)) hasNumbers = true;
        if (strongVerbRegex.test(descText)) hasStrongVerbs = true;
      }
    }

    if (hasNumbers) {
      impact += 30;
      evidence += 35;
    }
    if (hasStrongVerbs) {
      clarity += 25;
      impact += 20;
    }
  }

  // 3. ATS Alignment Scoring
  if (jobData?.descriptionText) {
    const jdKeywords = (jobData.requiredSkills || []).map((s) => s.toLowerCase());
    const resumeText = JSON.stringify(resume).toLowerCase();
    if (jdKeywords.length > 0) {
      const matched = jdKeywords.filter((kw) => resumeText.includes(kw));
      const matchRatio = matched.length / jdKeywords.length;
      atsAlignment = Math.round(matchRatio * 100);
    }
  } else {
    atsAlignment = Math.min(100, Math.round((completeness + clarity) / 2));
  }

  const overallScore = Math.round(
    completeness * 0.25 + clarity * 0.2 + impact * 0.25 + evidence * 0.15 + atsAlignment * 0.15
  );

  return {
    completeness,
    clarity: Math.min(100, clarity),
    impact: Math.min(100, impact),
    evidence: Math.min(100, evidence),
    atsAlignment: Math.min(100, atsAlignment),
    overallScore,
  };
}

/**
 * Deterministically determines top bounded priorities for resume improvement (maximum 3-5 actions).
 */
export function getResumePriorities(
  resume: ResumeData,
  analysis: ResumeStateAnalysis,
  jobData?: JobDescriptionData | null
): ResumePriorityAction[] {
  const priorities: ResumePriorityAction[] = [];

  // Priority 1: Missing Summary (if experience already exists)
  if (!analysis.stats.hasSummary && analysis.stats.experienceCount > 0) {
    priorities.push({
      id: 'priority_summary',
      section: 'summary',
      priority: 'CRITICAL',
      action: 'ADD_SUMMARY',
      description: 'Generate a focused professional summary positioning your core expertise.',
    });
  }

  // Priority 2: Weak/Unquantified Experience Bullets
  if (analysis.stats.experienceCount > 0) {
    const experiencesWithoutMetrics = (resume.experience || []).filter((exp) => {
      const desc = (exp as { description?: string | string[] }).description;
      const descText = Array.isArray(desc) ? desc.join(' ') : (desc || '');
      return !descText || !/\b(\d+(\.\d+)?(%|\+|k|m|x)?|\$\d+)\b/i.test(descText);
    });

    if (experiencesWithoutMetrics.length > 0) {
      priorities.push({
        id: 'priority_metrics',
        section: 'experience',
        priority: 'HIGH',
        action: 'QUANTIFY_SCOPE',
        description: 'Strengthen experience bullets with scope, volume, and concrete delivery outcomes.',
      });
    }
  }

  // Priority 3: Skills Alignment
  if (analysis.stats.skillsCount === 0 || (jobData && analysis.stats.skillsCount < 6)) {
    priorities.push({
      id: 'priority_skills',
      section: 'skills',
      priority: 'HIGH',
      action: 'EXPAND_SKILLS',
      description: 'Add relevant hard skills and tools aligned with your target seniority.',
    });
  }

  // Priority 4: Missing Education
  if (analysis.stats.educationCount === 0) {
    priorities.push({
      id: 'priority_education',
      section: 'education',
      priority: 'MEDIUM',
      action: 'ADD_EDUCATION',
      description: 'Include your highest degree or technical credentials.',
    });
  }

  // Bound to maximum 3-5 high impact actions
  return priorities.slice(0, 4);
}
