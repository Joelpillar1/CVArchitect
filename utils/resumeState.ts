import { ResumeData, Experience, Education, Project, Certification } from '../types';

export type ContentState = 'EMPTY' | 'PARTIAL' | 'COMPLETE';

export type UploadState = 'NONE' | 'PENDING_ANALYSIS' | 'ANALYZED';

export type ResumeState =
  | 'EMPTY'
  | 'PARTIAL'
  | 'COMPLETE'
  | 'UPLOADED_PENDING_ANALYSIS'
  | 'ANALYZED';

export interface SectionStatus {
  status: 'empty' | 'partial' | 'complete';
  count?: number;
  populatedFields?: number;
}

export interface ResumeStateAnalysis {
  /**
   * Primary content completeness state.
   */
  contentState: ContentState;

  /**
   * Dedicated upload state.
   */
  uploadState: UploadState;

  /**
   * Derived combined state for backward compatibility.
   */
  state: ResumeState;

  /**
   * True if there is at least one meaningful, non-placeholder piece of content.
   */
  hasMeaningfulContent: boolean;

  /**
   * True if the data matches known demo fixtures (e.g. "YOUR NAME", "Alex Morgan", Acme Corp).
   */
  isDemoData: boolean;

  /**
   * Upload metadata when available.
   */
  upload: {
    exists: boolean;
    justUploaded: boolean;
    status: 'none' | 'pending' | 'analyzed';
    filename: string | null;
  };

  /**
   * Granular status of each resume section.
   */
  sections: {
    contact: SectionStatus;
    summary: SectionStatus;
    experience: SectionStatus;
    education: SectionStatus;
    skills: SectionStatus;
    projects: SectionStatus;
    certifications: SectionStatus;
  };

  /**
   * Numerical counts of meaningful entries.
   */
  stats: {
    experienceCount: number;
    educationCount: number;
    skillsCount: number;
    projectCount: number;
    certificationCount: number;
    hasSummary: boolean;
  };

  /**
   * Identifies sections that are missing or weak to give the agent immediate focus.
   */
  missingOrWeakSections: string[];
}

export interface AnalyzeResumeOptions {
  justUploaded?: boolean;
  uploadStatus?: 'pending' | 'analyzed' | null;
  filename?: string | null;
  isDemoData?: boolean;
}

// ── Known Placeholder Signatures ──────────────────────────────────────────────

const KNOWN_PLACEHOLDER_STRINGS = new Set([
  'your name',
  'professional role',
  'your.email@example.com',
  '+1 (555) 123-4567',
  'linkedin.com/in/yourprofile',
  'city, country',
  'company name',
  'job title',
  'university name',
  'degree name, major',
  'available upon request',
  'alex morgan',
  'senior software engineer',
  'alex.morgan@example.com',
  'san francisco, ca',
  'acme corp',
]);

/**
 * Checks if a string contains substantive user content rather than whitespace or known placeholders.
 */
export function isMeaningfulString(value?: string | null): boolean {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (KNOWN_PLACEHOLDER_STRINGS.has(trimmed.toLowerCase())) return false;
  // Filter default generic summary text
  if (trimmed.startsWith('A brief professional summary highlighting your key strengths')) return false;
  return true;
}

/**
 * Parses and returns meaningful skills, ignoring placeholder items like "Skill 1", "Skill 2".
 */
export function parseMeaningfulSkills(skillsRaw?: string | null): string[] {
  if (!skillsRaw || typeof skillsRaw !== 'string') return [];
  return skillsRaw
    .split(/[,|\n•]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^skill\s*\d+$/i.test(s) && !KNOWN_PLACEHOLDER_STRINGS.has(s.toLowerCase()));
}

/**
 * Evaluates whether an experience entry has meaningful content.
 */
export function isMeaningfulExperience(exp?: Experience | null): boolean {
  if (!exp || typeof exp !== 'object') return false;
  const hasCompany = isMeaningfulString(exp.company);
  const hasRole = isMeaningfulString(exp.role);
  
  let hasBullets = false;
  if (Array.isArray(exp.description)) {
    hasBullets = exp.description.some(
      (b) =>
        isMeaningfulString(b) &&
        !b.toLowerCase().includes('key responsibility') &&
        !b.toLowerCase().includes('important accomplishment') &&
        !b.toLowerCase().includes('quantifiable result')
    );
  } else if (typeof exp.description === 'string') {
    hasBullets = isMeaningfulString(exp.description);
  }

  return (hasCompany && hasRole) || (hasCompany && hasBullets) || (hasRole && hasBullets);
}

/**
 * Evaluates whether an education entry has meaningful content.
 */
export function isMeaningfulEducation(edu?: Education | null): boolean {
  if (!edu || typeof edu !== 'object') return false;
  const hasSchool = isMeaningfulString(edu.school);
  const hasDegree = isMeaningfulString(edu.degree);
  return hasSchool || hasDegree;
}

/**
 * Evaluates whether a project entry has meaningful content.
 */
export function isMeaningfulProject(proj?: Project | null): boolean {
  if (!proj || typeof proj !== 'object') return false;
  const hasName = isMeaningfulString(proj.name);
  const hasDesc = isMeaningfulString(proj.description) && !proj.description.toLowerCase().includes('brief description of the project');
  return hasName || hasDesc;
}

/**
 * Evaluates whether a certification entry has meaningful content.
 */
export function isMeaningfulCertification(cert?: Certification | null): boolean {
  if (!cert || typeof cert !== 'object') return false;
  const hasName = isMeaningfulString(cert.name) && cert.name.toLowerCase() !== 'certification name';
  const hasIssuer = isMeaningfulString(cert.issuer) && cert.issuer.toLowerCase() !== 'issuing organization';
  return hasName || hasIssuer;
}

/**
 * Identifies if a resume matches the static default demo fixtures ("YOUR NAME" or "Alex Morgan" default template).
 */
export function isKnownDemoData(resume: ResumeData): boolean {
  if (!resume) return false;
  const lowerName = (resume.fullName || '').trim().toLowerCase();
  const lowerCompany = Array.isArray(resume.experience) && resume.experience[0]?.company ? resume.experience[0].company.toLowerCase() : '';

  if (lowerName === 'your name' || (lowerName === 'alex morgan' && lowerCompany === 'acme corp')) {
    return true;
  }
  return false;
}

// ── State Analysis ────────────────────────────────────────────────────────────

/**
 * Deterministically analyzes the content completeness and upload state of a ResumeData object.
 */
export function analyzeResumeState(
  resume: ResumeData | null | undefined,
  options?: AnalyzeResumeOptions
): ResumeStateAnalysis {
  if (!resume) {
    return {
      contentState: 'EMPTY',
      uploadState: options?.uploadStatus === 'pending' ? 'PENDING_ANALYSIS' : 'NONE',
      state: options?.uploadStatus === 'pending' ? 'UPLOADED_PENDING_ANALYSIS' : 'EMPTY',
      hasMeaningfulContent: false,
      isDemoData: false,
      upload: {
        exists: Boolean(options?.filename),
        justUploaded: Boolean(options?.justUploaded),
        status: options?.uploadStatus || 'none',
        filename: options?.filename || null,
      },
      sections: {
        contact: { status: 'empty', populatedFields: 0 },
        summary: { status: 'empty' },
        experience: { status: 'empty', count: 0 },
        education: { status: 'empty', count: 0 },
        skills: { status: 'empty', count: 0 },
        projects: { status: 'empty', count: 0 },
        certifications: { status: 'empty', count: 0 },
      },
      stats: {
        experienceCount: 0,
        educationCount: 0,
        skillsCount: 0,
        projectCount: 0,
        certificationCount: 0,
        hasSummary: false,
      },
      missingOrWeakSections: ['contact', 'summary', 'experience', 'skills', 'education'],
    };
  }

  const isDemo = options?.isDemoData ?? isKnownDemoData(resume);

  // 1. Evaluate Contact Info
  let contactPopulated = 0;
  if (isMeaningfulString(resume.fullName)) contactPopulated++;
  if (isMeaningfulString(resume.jobTitle)) contactPopulated++;
  if (isMeaningfulString(resume.email)) contactPopulated++;
  if (isMeaningfulString(resume.phone)) contactPopulated++;
  if (isMeaningfulString(resume.location) || isMeaningfulString(resume.address)) contactPopulated++;
  if (isMeaningfulString(resume.linkedin) || isMeaningfulString(resume.atHandle)) contactPopulated++;

  const contactStatus: SectionStatus['status'] =
    contactPopulated >= 3 && isMeaningfulString(resume.fullName)
      ? 'complete'
      : contactPopulated >= 1
      ? 'partial'
      : 'empty';

  // 2. Evaluate Summary
  const hasSummary = isMeaningfulString(resume.summary);
  const summaryStatus: SectionStatus['status'] = !hasSummary
    ? 'empty'
    : (resume.summary?.trim().length || 0) >= 60
    ? 'complete'
    : 'partial';

  // 3. Evaluate Experience
  const meaningfulExpList = Array.isArray(resume.experience)
    ? resume.experience.filter(isMeaningfulExperience)
    : [];
  const experienceCount = meaningfulExpList.length;
  const experienceStatus: SectionStatus['status'] =
    experienceCount >= 2 ? 'complete' : experienceCount === 1 ? 'partial' : 'empty';

  // 4. Evaluate Education
  const meaningfulEduList = Array.isArray(resume.education)
    ? resume.education.filter(isMeaningfulEducation)
    : [];
  const educationCount = meaningfulEduList.length;
  const educationStatus: SectionStatus['status'] = educationCount >= 1 ? 'complete' : 'empty';

  // 5. Evaluate Skills
  const meaningfulSkills = parseMeaningfulSkills(resume.skills);
  const skillsCount = meaningfulSkills.length;
  const skillsStatus: SectionStatus['status'] =
    skillsCount >= 5 ? 'complete' : skillsCount >= 1 ? 'partial' : 'empty';

  // 6. Evaluate Projects
  const meaningfulProjects = Array.isArray(resume.projects)
    ? resume.projects.filter(isMeaningfulProject)
    : [];
  const projectCount = meaningfulProjects.length;
  const projectStatus: SectionStatus['status'] = projectCount >= 1 ? 'complete' : 'empty';

  // 7. Evaluate Certifications
  const meaningfulCerts = Array.isArray(resume.certifications)
    ? resume.certifications.filter(isMeaningfulCertification)
    : [];
  const certificationCount = meaningfulCerts.length;
  const certificationStatus: SectionStatus['status'] = certificationCount >= 1 ? 'complete' : 'empty';

  // ── Determine Overall Content Completeness ──────────────────────────────────
  const hasAnyMeaningful =
    !isDemo &&
    (contactPopulated > 0 ||
      hasSummary ||
      experienceCount > 0 ||
      educationCount > 0 ||
      skillsCount > 0 ||
      projectCount > 0 ||
      certificationCount > 0);

  let contentState: ContentState = 'EMPTY';

  if (!hasAnyMeaningful) {
    contentState = 'EMPTY';
  } else {
    // Complete Criteria:
    // 1. Identity is populated (at least name + job title or contact)
    // 2. Experience is in place (or project background + skills)
    // 3. Skills are in place OR summary is well-articulated
    const isIdentitySolid = isMeaningfulString(resume.fullName) && contactPopulated >= 2;
    const isBackgroundSolid = experienceStatus === 'complete' || (experienceStatus === 'partial' && educationStatus === 'complete');
    const isCompetencySolid = skillsStatus !== 'empty' || summaryStatus === 'complete';

    if (isIdentitySolid && isBackgroundSolid && isCompetencySolid) {
      contentState = 'COMPLETE';
    } else {
      contentState = 'PARTIAL';
    }
  }

  // ── Determine Upload State ──────────────────────────────────────────────────
  let uploadState: UploadState = 'NONE';
  if (options?.uploadStatus === 'pending') {
    uploadState = 'PENDING_ANALYSIS';
  } else if (options?.uploadStatus === 'analyzed' || (options?.justUploaded && hasAnyMeaningful)) {
    uploadState = 'ANALYZED';
  }

  // ── Derive Combined Resume State ────────────────────────────────────────────
  let state: ResumeState = contentState;
  if (uploadState === 'PENDING_ANALYSIS') {
    state = 'UPLOADED_PENDING_ANALYSIS';
  } else if (uploadState === 'ANALYZED' && options?.justUploaded) {
    state = 'ANALYZED';
  }

  // ── Missing or Weak Sections ────────────────────────────────────────────────
  const missingOrWeakSections: string[] = [];
  if (contactStatus !== 'complete') missingOrWeakSections.push('contact');
  if (summaryStatus !== 'complete') missingOrWeakSections.push('summary');
  if (experienceStatus !== 'complete') missingOrWeakSections.push('experience');
  if (skillsStatus !== 'complete') missingOrWeakSections.push('skills');
  if (educationStatus !== 'complete') missingOrWeakSections.push('education');
  if (projectStatus === 'empty') missingOrWeakSections.push('projects');

  return {
    contentState,
    uploadState,
    state,
    hasMeaningfulContent: hasAnyMeaningful,
    isDemoData: isDemo,
    upload: {
      exists: Boolean(options?.filename) || uploadState !== 'NONE',
      justUploaded: Boolean(options?.justUploaded),
      status: uploadState === 'PENDING_ANALYSIS' ? 'pending' : uploadState === 'ANALYZED' ? 'analyzed' : 'none',
      filename: options?.filename || null,
    },
    sections: {
      contact: { status: contactStatus, populatedFields: contactPopulated },
      summary: { status: summaryStatus },
      experience: { status: experienceStatus, count: experienceCount },
      education: { status: educationStatus, count: educationCount },
      skills: { status: skillsStatus, count: skillsCount },
      projects: { status: projectStatus, count: projectCount },
      certifications: { status: certificationStatus, count: certificationCount },
    },
    stats: {
      experienceCount,
      educationCount,
      skillsCount,
      projectCount,
      certificationCount,
      hasSummary,
    },
    missingOrWeakSections,
  };
}

// ── Compact AI Context Builder ────────────────────────────────────────────────

export interface ResumeAIContext {
  contentState: ContentState;
  upload: {
    exists: boolean;
    justUploaded: boolean;
    status: 'none' | 'pending' | 'analyzed';
    filename: string | null;
  };
  stats: {
    experienceCount: number;
    educationCount: number;
    skillsCount: number;
    projectCount: number;
    hasSummary: boolean;
  };
  missingOrWeakSections: string[];
  isDemoData: boolean;
}

/**
 * Builds a compact, deterministic situational awareness context payload for the agent.
 */
export function buildResumeContext(
  _resume: ResumeData | null | undefined,
  analysis: ResumeStateAnalysis
): ResumeAIContext {
  return {
    contentState: analysis.contentState,
    upload: analysis.upload,
    stats: {
      experienceCount: analysis.stats.experienceCount,
      educationCount: analysis.stats.educationCount,
      skillsCount: analysis.stats.skillsCount,
      projectCount: analysis.stats.projectCount,
      hasSummary: analysis.stats.hasSummary,
    },
    missingOrWeakSections: analysis.missingOrWeakSections,
    isDemoData: analysis.isDemoData,
  };
}
