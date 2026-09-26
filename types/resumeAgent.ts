import { ResumeData } from '../types';
import { ResumeOperation } from './resumeOperations';

export interface JobDescriptionData {
  title: string;
  company: string;
  descriptionText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  seniority?: string;
  domain?: string;
  qualifications?: string[];
}

export interface JobMatchAnalysis {
  matchScore: number; // 0 - 100
  categoryScores: {
    experienceMatch: number;
    skillsMatch: number;
    keywordCoverage: number;
    roleAlignment: number;
    atsStructure: number;
  };
  strongMatches: string[];
  gaps: string[];
  topOpportunities: {
    id: string;
    title: string;
    description: string;
    section?: 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'keyAchievements';
  }[];
  scoreBefore?: number;
  scoreAfter?: number;
}

export interface ResumeChange {
  id: string;
  section: 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'keyAchievements';
  itemId?: string; // e.g. experience entry ID or bullet index key
  bulletIndex?: number;
  original: string;
  proposed: string;
  reason: string;
  evidence: string[]; // List of existing facts/citations from user resume
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

export interface MissingEvidenceItem {
  id: string;
  requirement: string; // short topic label, e.g. "SQL", "Team leadership", "Impact metrics"
  reason: string; // grounded context that references the actual resume, e.g. "You led a team at Acme but didn't state its size or the outcome."
  question: string; // the specific question to ask the candidate
  status: 'unanswered' | 'answered' | 'skipped';
  userAnswer?: string;
  // What kind of gap this question probes. Drives how the answer is applied:
  //  - 'missing_skill': a required skill/tool with no evidence → add `skillTag` to skills on answer
  //  - 'quantify':      an achievement that lacks numbers/scale → ask for metrics
  //  - 'scope':         adjacent experience that may satisfy a requirement → confirm depth
  //  - 'clarify':       anything else needing a grounded detail
  category?: 'missing_skill' | 'quantify' | 'scope' | 'clarify';
  skillTag?: string; // clean keyword to append to the skills inventory (missing_skill only)
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: number;
  type:
    | 'text'
    | 'analysis'
    | 'recommendation'
    | 'changes_batch'
    | 'missing_evidence'
    | 'tailored_result'
    | 'loading';
  text?: string;
  analysis?: JobMatchAnalysis;
  recommendation?: {
    title: string;
    description: string;
    actionLabel: string;
    actionType: 'tailor' | 'improve_summary' | 'fix_bullets' | 'check_ats';
  };
  changes?: ResumeChange[];
  missingEvidence?: MissingEvidenceItem;
  operations?: ResumeOperation[];
  suggestions?: string[];
}

