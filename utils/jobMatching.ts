import { Job } from '../types/job';
import { ResumeData } from '../types';

const SAVED_JOBS_STORAGE_KEY = 'cv_saved_job_ids';

/**
 * Get all bookmarked job IDs from local storage
 */
export function getSavedJobIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_JOBS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read saved jobs:', err);
    return [];
  }
}

/**
 * Toggle bookmark for a job ID
 */
export function toggleSaveJob(jobId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = getSavedJobIds();
    const index = saved.indexOf(jobId);
    let updated: string[];
    let isSavedNow: boolean;

    if (index >= 0) {
      updated = saved.filter(id => id !== jobId);
      isSavedNow = false;
    } else {
      updated = [...saved, jobId];
      isSavedNow = true;
    }

    localStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(updated));
    return isSavedNow;
  } catch (err) {
    console.error('Failed to toggle save job:', err);
    return false;
  }
}

/**
 * Check if a job is saved
 */
export function isJobSaved(jobId: string): boolean {
  const saved = getSavedJobIds();
  return saved.includes(jobId);
}

/**
 * Calculate dynamic resume match score for a given job
 * Returns a number between 40 and 99
 */
export function calculateJobMatchScore(job: Job, resumeData?: ResumeData | null): {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
} {
  if (!resumeData) {
    // Return baseline if no resume provided
    return {
      score: 72,
      matchedSkills: job.skills.slice(0, 2),
      missingSkills: job.skills.slice(2),
    };
  }

  // Extract all text tokens from resume
  const resumeSkillsRaw = [
    resumeData.skills || '',
    resumeData.technicalSkills || '',
    resumeData.toolsAndTechnologies || '',
    resumeData.coreCompetencies || ''
  ].join(', ').toLowerCase();

  const resumeSkillsList = resumeSkillsRaw
    .split(/[,;\n•|]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const resumeTitle = (resumeData.jobTitle || '').toLowerCase();
  const resumeSummary = (resumeData.summary || '').toLowerCase();
  const experienceText = (resumeData.experience || [])
    .map(e => `${e.role} ${e.company} ${Array.isArray(e.description) ? e.description.join(' ') : e.description}`)
    .join(' ')
    .toLowerCase();

  const fullResumeBlob = `${resumeSkillsRaw} ${resumeTitle} ${resumeSummary} ${experienceText}`;

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  job.skills.forEach(skill => {
    const sLower = skill.toLowerCase();
    const isDirectMatch = resumeSkillsList.some(rs => rs.includes(sLower) || sLower.includes(rs));
    const isInBlob = fullResumeBlob.includes(sLower);

    if (isDirectMatch || isInBlob) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate score components
  const skillMatchRatio = job.skills.length > 0 
    ? matchedSkills.length / job.skills.length 
    : 0.5;

  // Title similarity bonus
  let titleBonus = 0;
  const jobTitleWords = job.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const matchedTitleWords = jobTitleWords.filter(w => resumeTitle.includes(w) || experienceText.includes(w));
  if (jobTitleWords.length > 0) {
    titleBonus = (matchedTitleWords.length / jobTitleWords.length) * 20;
  }

  // Calculate percentage: base (40) + skill component (up to 40) + title bonus (up to 20)
  let calculatedScore = Math.round(40 + (skillMatchRatio * 40) + titleBonus);

  // Clamp between 45% and 98%
  calculatedScore = Math.max(45, Math.min(98, calculatedScore));

  return {
    score: calculatedScore,
    matchedSkills,
    missingSkills
  };
}

/**
 * Format salary for display
 *
 * Accepts a nullable salary: company career pages frequently publish no pay at all
 * (Greenhouse and Lever expose none), and showing "$0 - $0" would be worse than saying so.
 */
export function formatSalary(salary?: Job['salary'] | null): string {
  if (!salary || (!salary.min && !salary.max)) {
    return 'Salary not disclosed';
  }

  const formatNum = (n: number) => {
    if (n >= 1000) {
      return `${Math.round(n / 1000)}k`;
    }
    return n.toLocaleString();
  };

  const periodSuffix = salary.period === 'yearly' ? '/yr' : salary.period === 'monthly' ? '/mo' : '/hr';

  // A single-ended range is common in ATS pay data; render it as "from"/"up to" rather than
  // duplicating the one known number.
  if (!salary.min || salary.min === salary.max) {
    const only = salary.max || salary.min;
    return `${salary.currency}${formatNum(only)}${periodSuffix}`;
  }
  if (!salary.max) {
    return `${salary.currency}${formatNum(salary.min)}+${periodSuffix}`;
  }

  return `${salary.currency}${formatNum(salary.min)} - ${salary.currency}${formatNum(salary.max)}${periodSuffix}`;
}

/**
 * Dynamically humanize a posting's publication date, e.g. "Just now", "2 hours ago", "3 days ago".
 *
 * Computed at render time against the current clock so that as days pass,
 * the displayed relative time updates naturally and never remains static.
 */
export function formatPostedDate(postedAt?: string | null, now: Date = new Date()): string {
  if (!postedAt) return 'Recently posted';

  // Handle legacy relative strings if accidentally passed
  const lower = postedAt.trim().toLowerCase();
  if (lower === 'today' || lower === 'just now') {
    return 'Today';
  }

  const posted = new Date(postedAt);
  if (Number.isNaN(posted.getTime())) {
    return postedAt;
  }

  const diffMs = now.getTime() - posted.getTime();

  // If clock skew or posted in the last 2 minutes
  if (diffMs <= 120_000) {
    return 'Just now';
  }

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return '1 day ago';
  }
  if (days < 7) {
    return `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);
  if (days < 30) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}
