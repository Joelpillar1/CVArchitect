import { z } from 'zod';
import type { ResumeData, Experience as LegacyExperience, Education as LegacyEducation, Project as LegacyProject, Certification as LegacyCertification } from '../types';

/**
 * CVArchitect Agent Structured Data Foundation (Phase 2 Contracts)
 *
 * Implements strict Zod contracts with stable IDs, granular bullet decomposition,
 * provenance-grounded candidate evidence, comprehensive JD requirements, and
 * bidirectional bridges to/from legacy ResumeData.
 */

// ── Helper: Stable ID Generator ──────────────────────────────────────────────
export const generateStableId = (prefix = 'id'): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

// ── 4. ResumeBulletSchema ───────────────────────────────────────────────────
export const BulletMetricSchema = z.object({
  value: z.string().describe('Extracted metric string, e.g. "24%", "$1.2M", "10,000+"'),
  type: z.enum(['percentage', 'currency', 'headcount', 'time', 'volume', 'other']).default('other'),
  isVerified: z.boolean().default(false).describe('Whether this metric traces to a verified evidence source'),
});

export const ResumeBulletSchema = z.object({
  id: z.string().min(1).describe('Stable unique bullet ID'),
  text: z.string().describe('Complete rendered plain text of the bullet point'),
  action: z.string().optional().describe('Strong action verb, e.g. "Architected", "Spearheaded"'),
  responsibility: z.string().optional().describe('Core technical or operational responsibility'),
  skill: z.string().optional().describe('Primary domain skill highlighted'),
  tools: z.array(z.string()).default([]).describe('Tools, frameworks, and technologies leveraged'),
  metric: BulletMetricSchema.nullable().optional().describe('Structured metric component'),
  outcome: z.string().optional().describe('Concrete outcome or measurable business impact'),
  scope: z.string().optional().describe('Team size, traffic volume, geographic scale, or systems context'),
  evidenceReferences: z.array(z.string()).default([]).describe('List of evidence IDs providing strict provenance'),
});

export type BulletMetric = z.infer<typeof BulletMetricSchema>;
export type ResumeBullet = z.infer<typeof ResumeBulletSchema>;

// ── 3. ExperienceSchema ─────────────────────────────────────────────────────
export const ExperienceSchema = z.object({
  id: z.string().min(1).describe('Stable unique experience item ID'),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  roleSummary: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  isCurrent: z.boolean().default(false),
  bullets: z.array(ResumeBulletSchema).default([]),
  skillsUsed: z.array(z.string()).default([]),
  domain: z.string().optional(),
  teamScope: z.string().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

// ── 5. CandidateSchema ──────────────────────────────────────────────────────
export const CandidateSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(1),
  headline: z.string().optional(),
  jobTitle: z.string().default(''),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  website: z.string().optional(),
  atHandle: z.string().optional(),
  summary: z.string().default(''),
  targetRole: z.string().optional(),
  seniorityLevel: z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'staff_principal', 'executive']).optional(),
});

export type Candidate = z.infer<typeof CandidateSchema>;

// ── 6. Skill Schemas & Headings (Two-Stage Extraction) ────────────────────────
export const NormalizedSkillSectionTypeEnum = z.enum([
  'skills',
  'technical_skills',
  'core_competencies',
  'tools_and_technologies',
  'professional_expertise',
  'role_specific_skills',
  'ambiguous',
]);

export type NormalizedSkillSectionType = z.infer<typeof NormalizedSkillSectionTypeEnum>;

export const ExtractedSkillItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  confidence: z.number().min(0).max(1).default(1.0),
  sourceText: z.string().optional(),
});

export type ExtractedSkillItem = z.infer<typeof ExtractedSkillItemSchema>;

export const ExtractedSkillSectionSchema = z.object({
  id: z.string().min(1),
  originalHeading: z.string().min(1),
  normalizedType: NormalizedSkillSectionTypeEnum,
  confidence: z.number().min(0).max(1).default(1.0),
  rawContent: z.string(),
  items: z.array(ExtractedSkillItemSchema).default([]),
});

export type ExtractedSkillSection = z.infer<typeof ExtractedSkillSectionSchema>;

export const SkillExtractionResultSchema = z.object({
  skillSections: z.array(ExtractedSkillSectionSchema).default([]),
  allSkills: z.array(z.string()).default([]),
});

export type SkillExtractionResult = z.infer<typeof SkillExtractionResultSchema>;

export const SkillCategoryEnum = z.enum([
  'technical',
  'core_competency',
  'tool',
  'framework',
  'language',
  'soft_skill',
  'domain_knowledge',
  'leadership',
]);

export const SkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: SkillCategoryEnum.default('technical'),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  yearsOfExperience: z.number().min(0).optional(),
  evidenceIds: z.array(z.string()).default([]),
  isTargetJobMatch: z.boolean().default(false),
});

export type Skill = z.infer<typeof SkillSchema>;

/**
 * Categorized section heading aliases for Two-Stage Skill Extraction
 */
export const GENERAL_SKILLS_HEADINGS = [
  'skills',
  'key skills',
  'core skills',
  'professional skills',
  'relevant skills',
  'key qualifications',
  'skills & competencies',
  'skills and competencies',
  'skills & expertise',
  'skills and expertise',
] as const;

export const CORE_COMPETENCY_HEADINGS = [
  'core competencies',
  'core competency',
  'core competence',
  'key competencies',
  'professional competencies',
  'areas of expertise',
  'area of expertise',
  'areas of specialization',
  'area of specialization',
  'core capabilities',
  'professional expertise',
  'areas of strength',
  'key strengths',
] as const;

export const TECHNICAL_SKILLS_HEADINGS = [
  'technical skills',
  'technical expertise',
  'technical competencies',
  'technical competence',
  'technical proficiencies',
  'technical proficiency',
  'technical knowledge',
  'technology skills',
  'technical toolkit',
  'technical qualifications',
] as const;

export const TOOLS_TECHNOLOGY_HEADINGS = [
  'tools & technologies',
  'tools and technologies',
  'software & tools',
  'software and tools',
  'platforms & tools',
  'platforms and tools',
  'technologies',
  'tech stack',
  'technology stack',
  'technical tools',
  'software skills',
  'frameworks & libraries',
  'languages & frameworks',
  'programming languages',
] as const;

export const ROLE_SPECIFIC_SKILLS_HEADINGS = [
  'design skills',
  'ux/ui skills',
  'ui/ux skills',
  'product design skills',
  'engineering skills',
  'programming skills',
  'data skills',
  'marketing skills',
  'leadership competencies',
  'management skills',
] as const;

export const ALL_SKILL_HEADINGS = [
  ...GENERAL_SKILLS_HEADINGS,
  ...CORE_COMPETENCY_HEADINGS,
  ...TECHNICAL_SKILLS_HEADINGS,
  ...TOOLS_TECHNOLOGY_HEADINGS,
  ...ROLE_SPECIFIC_SKILLS_HEADINGS,
] as const;

export const SKILL_SECTION_SYNONYMS = ALL_SKILL_HEADINGS;

/** Classify a raw heading string into its normalized section type */
export function classifySkillHeading(heading: string): NormalizedSkillSectionType {
  const clean = heading.toLowerCase().trim().replace(/[:\-_|]+$/, '');
  if (TECHNICAL_SKILLS_HEADINGS.some((h) => clean === h || clean.startsWith(h + ':'))) {
    return 'technical_skills';
  }
  if (CORE_COMPETENCY_HEADINGS.some((h) => clean === h || clean.startsWith(h + ':'))) {
    return 'core_competencies';
  }
  if (TOOLS_TECHNOLOGY_HEADINGS.some((h) => clean === h || clean.startsWith(h + ':'))) {
    return 'tools_and_technologies';
  }
  if (ROLE_SPECIFIC_SKILLS_HEADINGS.some((h) => clean === h || clean.startsWith(h + ':'))) {
    return 'role_specific_skills';
  }
  if (GENERAL_SKILLS_HEADINGS.some((h) => clean === h || clean.startsWith(h + ':'))) {
    return 'skills';
  }
  if (isSkillSectionHeader(clean)) {
    return 'skills';
  }
  return 'ambiguous';
}

/** Checks if a section title or header string refers to skills/competencies */
export function isSkillSectionHeader(headerText: string): boolean {
  const clean = headerText.toLowerCase().trim().replace(/[:\-_|]+$/, '');
  return ALL_SKILL_HEADINGS.some(
    (syn) => clean === syn || clean.startsWith(syn + ':') || clean.endsWith(syn)
  );
}

// ── 7. EducationSchema ──────────────────────────────────────────────────────
export const EducationSchema = z.object({
  id: z.string().min(1),
  school: z.string().min(1),
  degree: z.string().min(1),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  year: z.string().default(''),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  relevantCourses: z.string().optional(),
  location: z.string().optional(),
});

export type Education = z.infer<typeof EducationSchema>;

// ── 8. ProjectSchema ────────────────────────────────────────────────────────
export const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().optional(),
  description: z.string().default(''),
  bullets: z.array(ResumeBulletSchema).default([]),
  technologies: z.string().optional(),
  link: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  evidenceReferences: z.array(z.string()).default([]),
});

export type Project = z.infer<typeof ProjectSchema>;

// ── 9. CertificationSchema ──────────────────────────────────────────────────
export const CertificationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().default(''),
  expiryDate: z.string().optional(),
  link: z.string().optional(),
  credentialId: z.string().optional(),
  verificationStatus: z.enum(['verified', 'unverified']).default('unverified'),
});

export type Certification = z.infer<typeof CertificationSchema>;

// ── 2. ResumeSectionSchema ──────────────────────────────────────────────────
export const SectionTypeEnum = z.enum([
  'header',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'leadership',
  'languages',
  'keyAchievements',
  'additionalInfo',
  'custom'
]);

export const ResumeSectionSchema = z.object({
  id: z.string().min(1).describe('Stable unique section ID'),
  type: SectionTypeEnum,
  title: z.string().min(1),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  itemIds: z.array(z.string()).default([]),
});

export type ResumeSection = z.infer<typeof ResumeSectionSchema>;

// ── 1. ResumeSchema ─────────────────────────────────────────────────────────
export const LanguageEntrySchema = z.object({
  id: z.string().min(1),
  language: z.string().min(1),
  proficiency: z.string().default(''),
});

export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;

export const AdditionalInfoEntrySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().default(''),
});

export type AdditionalInfoEntry = z.infer<typeof AdditionalInfoEntrySchema>;

export const ResumeSchema = z.object({
  id: z.string().min(1),
  candidate: CandidateSchema,
  sections: z.array(ResumeSectionSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  skillSections: z.array(ExtractedSkillSectionSchema).default([]),
  skillsRaw: z.string().default(''),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  leadership: z.array(ExperienceSchema).default([]),
  keyAchievements: z.array(ResumeBulletSchema).default([]),
  languages: z.array(LanguageEntrySchema).default([]),
  additionalInfo: z.array(AdditionalInfoEntrySchema).default([]),
  targetJobId: z.string().optional(),
  version: z.number().int().default(1),
  createdAt: z.number().default(() => Date.now()),
  updatedAt: z.number().default(() => Date.now()),
});

export type ResumeContract = z.infer<typeof ResumeSchema>;

// ── 11. JobRequirementSchema ────────────────────────────────────────────────
export const JobRequirementCategoryEnum = z.enum([
  'required_skill',
  'preferred_skill',
  'responsibility',
  'experience_years',
  'tool',
  'education',
  'domain_knowledge',
  'soft_skill',
  'cross_functional_collaboration',
  'technical_architecture',
  'leadership_management',
  'certification',
  'hiring_signal'
]);

export const JobRequirementOriginEnum = z.enum([
  'explicit_jd_requirement',
  'inferred_hiring_signal'
]);

export const JobRequirementSchema = z.object({
  id: z.string().min(1),
  category: JobRequirementCategoryEnum,
  text: z.string().min(1),
  importance: z.enum(['must_have', 'should_have', 'nice_to_have']).default('must_have'),
  weight: z.number().min(0).max(1).default(1.0).describe('Relative numerical weight in ATS matching (1.0 = critical, 0.7 = high, 0.4 = low)'),
  origin: JobRequirementOriginEnum.default('explicit_jd_requirement').describe('Distinguishes explicit JD text from inferred signals'),
  keywords: z.array(z.string()).default([]),
  minYears: z.number().optional(),
  acceptableEvidencePatterns: z.array(z.string()).default([]).describe('Types of candidate evidence that demonstrate this requirement'),
  rationale: z.string().optional(),
});

export type JobRequirement = z.infer<typeof JobRequirementSchema>;

// ── 10. JobDescriptionSchema ────────────────────────────────────────────────
export const HiringSignalInsightSchema = z.object({
  signal: z.string().describe('Observed signal from job text, e.g. "Migrating monolith to distributed event streams"'),
  inference: z.string().describe('Strategic inference, e.g. "Team is actively refactoring tech debt and needs Kafka expertise"'),
  strategicAdvice: z.string().describe('Actionable advice for candidate resume positioning'),
});

export type HiringSignalInsight = z.infer<typeof HiringSignalInsightSchema>;

export const JobDescriptionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  remoteStatus: z.enum(['remote', 'hybrid', 'on_site', 'unspecified']).default('unspecified'),
  rawText: z.string().default(''),
  seniority: z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'executive', 'unspecified']).default('unspecified'),
  domain: z.string().optional(),
  requirements: z.array(JobRequirementSchema).default([]),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  experienceRequirements: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  education: z.array(z.string()).default([]),
  domainKnowledge: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  keyPhrases: z.array(z.string()).default([]).describe('Multi-word ATS key phrases'),
  hiringSignals: z.array(z.string()).default([]),
  hiringSignalInsights: z.array(HiringSignalInsightSchema).default([]),
  parsedAt: z.number().default(() => Date.now()),
});

export type JobDescription = z.infer<typeof JobDescriptionSchema>;

// ── 12. CandidateEvidenceSchema (With Strict Provenance) ─────────────────────
export const EvidenceSourceEnum = z.enum([
  'resume',
  'candidate_answer',
  'candidate_edit',
  'explicit_user_input',
  'resume_original',
  'manual_input',
  'document_upload',
  'linkedin_import',
  'verified_achievement'
]);

export const EvidenceStatusEnum = z.enum([
  'verified',
  'inferred',
  'unverified',
  'rejected'
]);

export const CandidateEvidenceSchema = z.object({
  id: z.string().min(1).describe('Stable unique evidence ID'),
  candidateId: z.string().optional(),
  claim: z.string().min(1).describe('Factual candidate statement, e.g. "Improved activation by 24%"'),
  context: z.string().optional().describe('Context/scope, e.g. "Onboarding funnel rewrite at Acme"'),
  topic: z.string().default('General').describe('Short topic label, e.g. "Activation Lift"'),
  sourceType: EvidenceSourceEnum.default('resume').describe('Strict provenance source — AI cannot hallucinate a verified source'),
  source: EvidenceSourceEnum.optional().describe('Alias for sourceType for backward compatibility'),
  sourceId: z.string().min(1).describe('ID of the source question, document, or original bullet'),
  relatedResumeItemId: z.string().optional().describe('ID of related experience, project, education or skill item'),
  confidence: z.number().min(0).max(1).default(1.0).describe('Confidence score (1.0 for candidate explicit input/resume)'),
  status: EvidenceStatusEnum.default('verified').describe('Verification status'),
  metrics: z.array(z.object({
    value: z.string(),
    unit: z.string().optional(),
    category: z.string().optional()
  })).default([]),
  skills: z.array(z.string()).default([]).describe('Skills or tools evidenced by this claim'),
  verifiedAt: z.number().default(() => Date.now()),
  notes: z.string().optional(),
});

export type CandidateEvidence = z.infer<typeof CandidateEvidenceSchema>;

// ── 13. Evidence Match & Matrix Schemas (Phase 5) ───────────────────────────
export const EvidenceStrengthEnum = z.enum([
  'strong',
  'moderate',
  'weak',
  'missing'
]);

export const EvidenceActionEnum = z.enum([
  'keep',
  'emphasize',
  'rewrite',
  'ask_question',
  'do_not_claim'
]);

export const MatchedEvidenceSnippetSchema = z.object({
  evidenceId: z.string().min(1),
  claim: z.string().min(1),
  sourceType: EvidenceSourceEnum,
  sourceId: z.string(),
  relatedResumeItemId: z.string().optional(),
  relevanceScore: z.number().min(0).max(1),
  metrics: z.array(z.object({
    value: z.string(),
    unit: z.string().optional(),
    category: z.string().optional()
  })).default([]),
});

export const EvidenceMatchItemSchema = z.object({
  requirementId: z.string().min(1),
  requirementText: z.string().min(1),
  requirementCategory: JobRequirementCategoryEnum,
  importance: z.enum(['must_have', 'should_have', 'nice_to_have']),
  weight: z.number().min(0).max(1).default(1.0),
  strength: EvidenceStrengthEnum,
  recommendedAction: EvidenceActionEnum,
  matchedEvidence: z.array(MatchedEvidenceSnippetSchema).default([]),
  evidenceSnippet: z.string().nullable().optional(),
  score: z.number().min(0).max(100),
  gapAnalysis: z.string().min(1),
  actionRationale: z.string().min(1),
});

export type EvidenceStrength = z.infer<typeof EvidenceStrengthEnum>;
export type EvidenceAction = z.infer<typeof EvidenceActionEnum>;
export type MatchedEvidenceSnippet = z.infer<typeof MatchedEvidenceSnippetSchema>;
export type EvidenceMatchItem = z.infer<typeof EvidenceMatchItemSchema>;

export const EvidenceMatrixSchema = z.object({
  id: z.string().min(1),
  jobId: z.string().optional(),
  jobTitle: z.string().default('Target Role'),
  candidateId: z.string().default('default_candidate'),
  overallMatchScore: z.number().min(0).max(100),
  coverageBreakdown: z.object({
    strongCount: z.number().int().min(0),
    moderateCount: z.number().int().min(0),
    weakCount: z.number().int().min(0),
    missingCount: z.number().int().min(0),
    totalRequirements: z.number().int().min(0),
  }),
  items: z.array(EvidenceMatchItemSchema).default([]),
  missingCriticalGaps: z.array(z.string()).default([]),
  keyStrengths: z.array(z.string()).default([]),
  recommendedQuestions: z.array(z.string()).default([]),
  generatedAt: z.number().default(() => Date.now()),
});

export type EvidenceMatrix = z.infer<typeof EvidenceMatrixSchema>;

export const EvidenceMatchSchema = z.object({
  id: z.string().min(1),
  requirementId: z.string().min(1),
  evidenceId: z.string().min(1),
  matchType: z.enum(['exact', 'partial', 'adjacent', 'missing']),
  confidenceScore: z.number().min(0).max(1),
  reasoning: z.string().min(1),
  suggestedPlacement: z.object({
    section: z.string(),
    itemId: z.string().optional(),
    bulletId: z.string().optional()
  }).optional(),
});

export type EvidenceMatch = z.infer<typeof EvidenceMatchSchema>;

// ── 14. Personalized Question Engine Schemas (Phase 6) ──────────────────────
export const QuestionPriorityEnum = z.enum([
  'critical',
  'high',
  'medium',
  'low'
]);

export const QuestionCategoryEnum = z.enum([
  'missing_metric',
  'missing_outcome',
  'missing_skill',
  'missing_leadership',
  'unclear_responsibility',
  'seniority_gap',
  'quantify',
  'scope',
  'clarify',
  'verify_claim'
]);

export const QuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1).describe('The personalized, targeted question string'),
  reason: z.string().min(1).describe('Explicit reason tying resume context to job requirement'),
  relatedRequirement: z.string().optional().describe('Text of the target job requirement'),
  targetRequirementId: z.string().optional().describe('ID of the target job requirement'),
  relatedResumeItem: z.string().optional().describe('Company or role context from candidate resume'),
  targetSectionId: z.string().optional(),
  targetBulletId: z.string().optional(),
  expectedEvidence: z.string().optional().describe('What factual claim, metric, or scope would satisfy this requirement'),
  priority: QuestionPriorityEnum.default('high'),
  category: QuestionCategoryEnum.default('clarify'),
  suggestedFactTopic: z.string().optional(),
  skillTag: z.string().optional(),
  status: z.enum(['unanswered', 'answered', 'skipped']).default('unanswered'),
  answerText: z.string().optional(),
  answerEvidenceId: z.string().optional(),
  generatedEvidenceIds: z.array(z.string()).default([]),
  createdAt: z.number().default(() => Date.now()),
  answeredAt: z.number().optional(),
});

export type QuestionPriority = z.infer<typeof QuestionPriorityEnum>;
export type QuestionCategory = z.infer<typeof QuestionCategoryEnum>;
export type PersonalizedQuestion = z.infer<typeof QuestionSchema>;

// ── 15. Enhanced ResumeOperationSchema ──────────────────────────────────────
export const SCALAR_FIELDS = [
  'fullName',
  'jobTitle',
  'email',
  'phone',
  'linkedin',
  'atHandle',
  'address',
  'location',
  'summary',
  'referee',
] as const;

export const ARRAY_SECTIONS = [
  'experience',
  'education',
  'certifications',
  'projects',
  'leadership',
  'additionalInfo',
  'languages',
] as const;

export const BULLET_SECTIONS = ['experience', 'leadership', 'keyAchievements'] as const;

const opEnvelope = {
  operationId: z.string().min(1),
  agentRunId: z.string().min(1),
  reason: z.string(),
  evidence: z.array(z.string()),
  evidenceIds: z.array(z.string()).optional().describe('Direct provenance links to CandidateEvidence IDs'),
};

const fieldsRecord = z.record(z.string(), z.string());

export const StructuredResumeOperationSchema = z.discriminatedUnion('operation', [
  z.object({
    operation: z.literal('replace_bullet'),
    targetId: z.string().min(1).describe('ID of the target bullet to replace'),
    newContent: z.string().min(1).describe('New bullet plain text content'),
    reason: z.string().min(1).describe('Rationale for strengthening the bullet'),
    evidenceIds: z.array(z.string()).default([]),
  }),
  z.object({
    operation: z.literal('add_bullet'),
    targetId: z.string().min(1).describe('ID of the target experience/leadership item or bullet to insert after'),
    newContent: z.string().min(1).describe('New bullet plain text content'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
    bulletIndex: z.number().int().optional(),
  }),
  z.object({
    operation: z.literal('remove_bullet'),
    targetId: z.string().min(1).describe('ID of the target bullet to remove'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
  z.object({
    operation: z.literal('replace_summary'),
    targetId: z.string().default('summary').describe('Target summary field ID'),
    newContent: z.string().min(1).describe('New professional summary text'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
  z.object({
    operation: z.literal('add_skill'),
    targetId: z.string().default('skills').describe('Target skills section'),
    newContent: z.string().min(1).describe('Skill name to add'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
    category: SkillCategoryEnum.optional(),
  }),
  z.object({
    operation: z.literal('remove_skill'),
    targetId: z.string().min(1).describe('Skill ID or skill name to remove'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
  z.object({
    operation: z.literal('reorder_skills'),
    targetId: z.string().default('skills'),
    newContent: z.array(z.string()).describe('Array of skill names or IDs in new desired order'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
  z.object({
    operation: z.literal('reorder_experience'),
    targetId: z.string().default('experience'),
    newContent: z.array(z.string()).describe('Array of experience item IDs in new order'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
  z.object({
    operation: z.literal('reorder_section'),
    targetId: z.string().default('sections'),
    newContent: z.array(z.string()).describe('Array of section IDs in desired order'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
  z.object({
    operation: z.literal('update_project'),
    targetId: z.string().min(1).describe('ID of the project item to update'),
    newContent: z.record(z.string(), z.any()).describe('Updated project fields (name, description, technologies, link)'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
  z.object({
    operation: z.literal('update_education'),
    targetId: z.string().min(1).describe('ID of the education item to update'),
    newContent: z.record(z.string(), z.any()).describe('Updated education fields (school, degree, year, gpa, relevantCourses)'),
    reason: z.string().min(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
]);

export type StructuredResumeOperation = z.infer<typeof StructuredResumeOperationSchema>;

export const ResumeOperationSchema = z.discriminatedUnion('op', [
  z.object({ ...opEnvelope, op: z.literal('set_field'), field: z.enum(SCALAR_FIELDS), value: z.string() }),
  z.object({
    ...opEnvelope,
    op: z.literal('replace_bullet'),
    section: z.enum(BULLET_SECTIONS),
    itemId: z.string().optional(),
    bulletId: z.string().optional(),
    bulletIndex: z.number().int(),
    value: z.string(),
  }),
  z.object({
    ...opEnvelope,
    op: z.literal('insert_bullet'),
    section: z.enum(BULLET_SECTIONS),
    itemId: z.string().optional(),
    bulletId: z.string().optional(),
    bulletIndex: z.number().int(),
    value: z.string(),
  }),
  z.object({
    ...opEnvelope,
    op: z.literal('delete_bullet'),
    section: z.enum(BULLET_SECTIONS),
    itemId: z.string().optional(),
    bulletId: z.string().optional(),
    bulletIndex: z.number().int(),
  }),
  z.object({
    ...opEnvelope,
    op: z.literal('update_item'),
    section: z.enum(ARRAY_SECTIONS),
    itemId: z.string(),
    fields: fieldsRecord,
  }),
  z.object({
    ...opEnvelope,
    op: z.literal('insert_item'),
    section: z.enum(ARRAY_SECTIONS),
    item: fieldsRecord,
  }),
  z.object({
    ...opEnvelope,
    op: z.literal('delete_item'),
    section: z.enum(ARRAY_SECTIONS),
    itemId: z.string(),
  }),
  z.object({ ...opEnvelope, op: z.literal('add_skill'), value: z.string() }),
  z.object({ ...opEnvelope, op: z.literal('remove_skill'), value: z.string() }),
  z.object({ ...opEnvelope, op: z.literal('set_skills'), value: z.string() }),
  z.object({ ...opEnvelope, op: z.literal('reorder_sections'), order: z.array(z.string()) }),
]);

export type ResumeOperation = z.infer<typeof ResumeOperationSchema>;

// ── 16. Evaluation & Critic Schemas (Phase 10) ──────────────────────────────
export const CriticSeverityEnum = z.enum(['critical', 'high', 'medium', 'low']);

export const CriticCategoryEnum = z.enum([
  'fabricated_metric',
  'unsupported_claim',
  'unsupported_skill',
  'missing_critical_requirement',
  'generic_language',
  'keyword_stuffing',
  'repetitive_wording',
  'weak_bullet',
  'irrelevant_experience',
  'seniority_mismatch',
  'ats_risk',
  'awkward_writing',
  'lost_evidence'
]);

export const CriticFindingSchema = z.object({
  id: z.string().min(1),
  severity: CriticSeverityEnum,
  category: CriticCategoryEnum,
  affectedResumeItem: z.string().min(1),
  problem: z.string().min(1),
  recommendedFix: z.string().min(1),
  evidenceRequired: z.union([z.boolean(), z.string()]).default(false),
  proposedCorrection: StructuredResumeOperationSchema.optional(),
  isResolved: z.boolean().default(false),
});

export type CriticSeverity = z.infer<typeof CriticSeverityEnum>;
export type CriticCategory = z.infer<typeof CriticCategoryEnum>;
export type CriticFinding = z.infer<typeof CriticFindingSchema>;

export const EvaluationDimensionsSchema = z.object({
  jobAlignment: z.number().min(0).max(100),
  requirementCoverage: z.number().min(0).max(100),
  skillAlignment: z.number().min(0).max(100),
  keywordRelevance: z.number().min(0).max(100),
  evidenceStrength: z.number().min(0).max(100),
  achievementQuality: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  atsCompatibility: z.number().min(0).max(100),
  seniorityAlignment: z.number().min(0).max(100),
  recruiterReadability: z.number().min(0).max(100),
  factualAccuracy: z.number().min(0).max(100),
});

export const EvaluationSchema = z.object({
  id: z.string().min(1),
  jobId: z.string().optional(),
  overallScore: z.number().min(0).max(100),
  dimensions: EvaluationDimensionsSchema,
  findings: z.array(CriticFindingSchema).default([]),
  passedQualityThreshold: z.boolean().default(false),
  strengths: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  revisionIteration: z.number().int().default(0),
  evaluatorVersion: z.string().default('v3-critic'),
  evaluatedAt: z.number().default(() => Date.now()),
});

export type EvaluationDimensions = z.infer<typeof EvaluationDimensionsSchema>;
export type Evaluation = z.infer<typeof EvaluationSchema>;

// ── Bidirectional Converters (Legacy ResumeData <-> Structured Contract) ────

/** Decompose a single plain text bullet into structured components */
export function parseBulletToStructured(text: string, id?: string): ResumeBullet {
  const clean = text.trim();
  const words = clean.split(/\s+/);
  const action = words.length > 0 && /^[A-Z][a-z]+ed\b|^[A-Z][a-z]+ing\b|^[A-Z][a-z]+\b/.test(words[0]) ? words[0] : undefined;

  // Extract metrics if present
  let metric: BulletMetric | null = null;
  const metricMatch = clean.match(/(\d+[\d,]*(?:\.\d+)?%|\$\d+[\d,]*(?:\.\d+)?(?:[kKmMbB])?|\d+[\d,]*(?:\.\d+)?\s*(?:users|clients|engineers|people|team members|hours|days|weeks|x|X))/i);
  if (metricMatch) {
    const rawVal = metricMatch[0];
    let type: BulletMetric['type'] = 'other';
    if (rawVal.includes('%')) type = 'percentage';
    else if (rawVal.includes('$')) type = 'currency';
    else if (/users|clients|volume/i.test(rawVal)) type = 'volume';
    else if (/team|engineers|people/i.test(rawVal)) type = 'headcount';
    else if (/hours|days|weeks/i.test(rawVal)) type = 'time';

    metric = {
      value: rawVal,
      type,
      isVerified: false,
    };
  }

  return {
    id: id || generateStableId('bullet'),
    text: clean,
    action,
    metric,
    tools: [],
    evidenceReferences: [],
  };
}

/** Convert legacy ResumeData into a fully-structured, stable-ID ResumeContract */
export function resumeDataToStructured(data: ResumeData): ResumeContract {
  const candidate: Candidate = {
    id: generateStableId('cand'),
    fullName: data.fullName || 'Candidate',
    jobTitle: data.jobTitle || '',
    email: data.email || '',
    phone: data.phone || '',
    location: data.location || '',
    address: data.address || '',
    linkedin: data.linkedin || '',
    atHandle: data.atHandle || '',
    summary: data.summary || '',
  };

  const experience: Experience[] = (data.experience || []).map((exp, idx) => {
    const rawBullets = Array.isArray(exp.description) ? exp.description : [exp.description || ''];
    const bullets = rawBullets
      .filter((b) => b && b.trim().length > 0)
      .map((b, bIdx) => parseBulletToStructured(b, `bullet_${exp.id || idx}_${bIdx}`));

    return {
      id: exp.id || `exp_${idx + 1}`,
      company: exp.company || 'Company',
      role: exp.role || 'Role',
      location: exp.location,
      roleSummary: exp.roleSummary,
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: exp.endDate?.toLowerCase() === 'present',
      bullets,
      skillsUsed: [],
    };
  });

  const education: Education[] = (data.education || []).map((edu, idx) => ({
    id: edu.id || `edu_${idx + 1}`,
    school: edu.school || 'School',
    degree: edu.degree || 'Degree',
    year: edu.year || '',
    gpa: edu.gpa,
    relevantCourses: edu.relevantCourses,
  }));

  // Parse comma-separated skills list
  const skillsList = (data.skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const skills: Skill[] = skillsList.map((skillName, idx) => ({
    id: `skill_${idx + 1}`,
    name: skillName,
    category: 'technical',
    evidenceIds: [],
    isTargetJobMatch: false,
  }));

  const projects: Project[] = (data.projects || []).map((proj, idx) => ({
    id: proj.id || `proj_${idx + 1}`,
    name: proj.name || 'Project',
    description: proj.description || '',
    bullets: [],
    technologies: proj.technologies,
    link: proj.link,
    evidenceReferences: [],
  }));

  const certifications: Certification[] = (data.certifications || []).map((cert, idx) => ({
    id: cert.id || `cert_${idx + 1}`,
    name: cert.name || 'Certification',
    issuer: cert.issuer || 'Issuer',
    date: cert.date || '',
    link: cert.link,
    verificationStatus: 'unverified',
  }));

  const leadership: Experience[] = (data.leadership || []).map((lead, idx) => {
    const rawBullets = Array.isArray(lead.description) ? lead.description : [lead.description || ''];
    const bullets = rawBullets
      .filter((b) => b && b.trim().length > 0)
      .map((b, bIdx) => parseBulletToStructured(b, `lead_bullet_${lead.id || idx}_${bIdx}`));

    return {
      id: lead.id || `lead_${idx + 1}`,
      company: lead.company || 'Organization',
      role: lead.role || 'Role',
      location: lead.location,
      startDate: lead.startDate || '',
      endDate: lead.endDate || '',
      isCurrent: lead.endDate?.toLowerCase() === 'present',
      bullets,
      skillsUsed: [],
    };
  });

  const rawKeyAchievements = Array.isArray(data.keyAchievements)
    ? data.keyAchievements
    : [data.keyAchievements || ''];
  const keyAchievements: ResumeBullet[] = rawKeyAchievements
    .filter((a) => a && a.trim().length > 0)
    .map((a, idx) => parseBulletToStructured(a, `achieve_${idx + 1}`));

  const languages: LanguageEntry[] = (data.languages || []).map((l, idx) => ({
    id: l.id || `lang_${idx + 1}`,
    language: l.language || '',
    proficiency: l.proficiency || '',
  }));

  const additionalInfo: AdditionalInfoEntry[] = (data.additionalInfo || []).map((a, idx) => ({
    id: a.id || `add_${idx + 1}`,
    label: a.label || '',
    value: a.value || '',
  }));

  const sections: ResumeSection[] = [
    { id: 'sec_summary', type: 'summary', title: 'Professional Summary', order: 0, isVisible: !!data.summary, itemIds: [] },
    { id: 'sec_experience', type: 'experience', title: 'Work Experience', order: 1, isVisible: experience.length > 0, itemIds: experience.map((e) => e.id) },
    { id: 'sec_skills', type: 'skills', title: 'Skills', order: 2, isVisible: skills.length > 0, itemIds: skills.map((s) => s.id) },
    { id: 'sec_education', type: 'education', title: 'Education', order: 3, isVisible: education.length > 0, itemIds: education.map((e) => e.id) },
    { id: 'sec_projects', type: 'projects', title: 'Projects', order: 4, isVisible: projects.length > 0, itemIds: projects.map((p) => p.id) },
    { id: 'sec_certifications', type: 'certifications', title: 'Certifications', order: 5, isVisible: certifications.length > 0, itemIds: certifications.map((c) => c.id) },
  ];

  return {
    id: generateStableId('resume'),
    candidate,
    sections,
    experience,
    education,
    skills,
    skillSections: [],
    skillsRaw: data.skills || '',
    projects,
    certifications,
    leadership,
    keyAchievements,
    languages,
    additionalInfo,
    version: data.version_number || 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/** Convert structured contract back to renderable ResumeData */
export function structuredToResumeData(
  contract: ResumeContract,
  baseData?: Partial<ResumeData>
): ResumeData {
  const legacyExperience: LegacyExperience[] = contract.experience.map((exp) => ({
    id: exp.id,
    company: exp.company,
    role: exp.role,
    location: exp.location,
    roleSummary: exp.roleSummary,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.bullets.map((b) => b.text),
  }));

  const legacyEducation: LegacyEducation[] = contract.education.map((edu) => ({
    id: edu.id,
    school: edu.school,
    degree: edu.degree,
    year: edu.year,
    gpa: edu.gpa,
    relevantCourses: edu.relevantCourses,
  }));

  const legacyProjects: LegacyProject[] = contract.projects.map((proj) => ({
    id: proj.id,
    name: proj.name,
    description: proj.description,
    technologies: proj.technologies,
    link: proj.link,
  }));

  const legacyCertifications: LegacyCertification[] = contract.certifications.map((cert) => ({
    id: cert.id,
    name: cert.name,
    issuer: cert.issuer,
    date: cert.date,
    link: cert.link,
  }));

  const legacyLeadership: LegacyExperience[] = contract.leadership.map((lead) => ({
    id: lead.id,
    company: lead.company,
    role: lead.role,
    location: lead.location,
    startDate: lead.startDate,
    endDate: lead.endDate,
    description: lead.bullets.map((b) => b.text),
  }));

  const skillsString = contract.skillsRaw || contract.skills.map((s) => s.name).join(', ');

  return {
    fullName: contract.candidate.fullName,
    jobTitle: contract.candidate.jobTitle,
    email: contract.candidate.email,
    phone: contract.candidate.phone,
    linkedin: contract.candidate.linkedin,
    atHandle: contract.candidate.atHandle,
    address: contract.candidate.address,
    location: contract.candidate.location,
    summary: contract.candidate.summary,
    experience: legacyExperience,
    education: legacyEducation,
    skills: skillsString,
    certifications: legacyCertifications,
    projects: legacyProjects,
    leadership: legacyLeadership,
    keyAchievements: contract.keyAchievements.map((k) => k.text),
    languages: contract.languages,
    additionalInfo: contract.additionalInfo,
    sectionOrder: contract.sections.map((s) => s.type),
    ...baseData,
  };
}
