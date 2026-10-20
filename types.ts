import type { AgentMessage, JobDescriptionData, JobMatchAnalysis } from './types/resumeAgent';

export interface Experience {
  id: string;
  company: string;
  role: string;
  organization?: string; // Alias for company, used by leadership/volunteering/military items
  location?: string;
  roleSummary?: string;
  startDate: string;
  endDate: string;
  description: string | string[]; // Can be string (legacy) or array of bullet points
  projects?: Project[]; // Optional "Key Projects" nested under this experience entry
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
  location?: string; // City, State shown right-aligned on the school line
  gpa?: string;
  relevantCourses?: string | string[];
  description?: string | string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Project {
  id: string;
  name: string;
  role?: string; // Contributor/lead role on the project
  description: string | string[]; // Free text or bullet points (sidebar edits as bullets, like Experience)
  link?: string;
  technologies?: string;
  date?: string; // Display date shown right-aligned on the project line (e.g. "July 2023")
}

export interface AdditionalInfoItem {
  id: string;
  label: string;
  value: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface CourseworkItem {
  id: string;
  courseName: string;
  institution?: string;
  year?: string;
  skills?: string;
  description?: string | string[];
}

export interface ExpertSkillItem {
  id: string;
  category: string;
  skills: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  atHandle?: string;
  address?: string;
  location?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string; // Comma separated for simplicity in editing
  certifications: Certification[]; // Updated to array of objects
  projects?: Project[]; // New field for Projects
  leadership?: Experience[]; // LEadership same structure as Experience
  additionalInfo?: AdditionalInfoItem[]; // New field for custom sections
  keyAchievements?: string | string[]; // Can be string (legacy) or array of achievement bullet points
  jobDescription?: string; // New field for Job Match tab
  referee?: string; // Referee information or "Available upon request"
  language?: string; // Language code (en, es, fr, de, pt, it, zh, ja, ar)
  languages?: LanguageItem[]; // Array of languages for the specific section
  font?: string;
  accentColor?: string; // Customizable accent color for templates
  fontSizes?: {
    header: number;
    jobTitle: number;
    sectionTitle: number;
    body: number;
  };
  headerCase?: 'uppercase' | 'lowercase' | 'capitalize';
  sectionHeaderCase?: 'uppercase' | 'capitalize' | 'titlecase';
  jobTitleCase?: 'uppercase' | 'sentence';
  lineHeight?: number;
  sectionGap?: number;
  headerGap?: number; // Gap between header and body sections
  bulletStyle?: 'disc' | 'check' | 'dash'; // Bullet/checklist marker style for lists
  bulletIndent?: number; // Indentation offset for bullets in pixels (e.g. 0, 8, 16, 24)
  headerItemGap?: number; // Gap between name and contact
  headerContactGap?: number; // Gap between contact and job title
  margins?: {
    horizontal: number;
    vertical: number;
  };
  headerAlignment?: 'left' | 'center' | 'right'; // Alignment for full header / name
  jobTitleAlignment?: 'left' | 'center' | 'right'; // Alignment for professional / job title
  contactAlignment?: 'left' | 'center' | 'right'; // Alignment for contact line / email / phone
  headerOrder?: 'title-first' | 'contact-first'; // Order of job title vs contact line under the name
  bodyHeaderAlignment?: 'left' | 'center' | 'right'; // Alignment for section titles (Experience, Education, etc.)
  sectionHeaderAlignment?: 'left' | 'center' | 'right'; // Alias for section titles
  contentAlignment?: 'left' | 'center' | 'right'; // Alignment for body content (summary, experience, etc.)
  skillsColumnCount?: number; // Number of columns for skills section (2, 3, or 4)
  showContactIcons?: boolean; // Toggle contact icons in header
  sectionOrder?: string[]; // Order of sections
  currentTag?: string; // For tagging saved templates
  resumeTitle?: string; // Human-friendly display title for the resume
  template?: TemplateType; // Selected template
  version_number?: number; // Current version number
  version_name?: string | null; // Optional version name/tag
  pageSize?: 'letter' | 'a4'; // Paper format size
  viewAsPages?: boolean; // Page break view mode
  source?: 'upload' | 'scratch'; // How this resume was created (for analytics behavior)
  hasJobMatchRun?: boolean; // Whether AI job match rewrite has been run
  agentMessages?: AgentMessage[];
  agentJobData?: JobDescriptionData | null;
  agentAnalysis?: JobMatchAnalysis | null;
  agentMemory?: import('./utils/resumeAgentMemory').ResumeAgentMemory;
  // Extended section fields (Phase 1 additive foundation)
  technicalSkills?: string;
  expertSkills?: ExpertSkillItem[] | string;
  coreCompetencies?: string;
  toolsAndTechnologies?: string;
  licenses?: Certification[];
  awards?: string[] | string;
  volunteering?: Experience[];
  involvement?: Experience[];
  memberships?: Certification[];
  publications?: string[] | string;
  conferencesSpeaking?: string[] | string;
  research?: Experience[];
  teaching?: Experience[];
  coursework?: CourseworkItem[] | string;
  thesis?: string;
  academicAchievements?: string[] | string;
  caseStudies?: Project[];
  selectedWork?: Project[];
  patents?: Certification[];
  grants?: Certification[];
  securityClearance?: string;
  military?: Experience[];
  clinicalExperience?: Experience[];
  interests?: string;
  customSections?: Record<string, import('./types/resumeSections').CustomSectionData>;
  sectionVisibility?: Record<string, boolean>;
  sectionTitles?: Record<string, string>;
  /**
   * Section ids the user explicitly added (Add Section modal or a visibility
   * opt-in) — recorded so template switches can keep them after snapping to
   * the new template's default sections, instead of mistaking them for
   * template-owned sections.
   */
  userAddedSections?: string[];
}

export interface SavedTemplate {
  id: string;
  tag: string;
  baseTemplate: TemplateType;
  data: ResumeData;
  createdAt: Date;
}

// Add 'vanguard' and remove the deleted templates for now.
export type TemplateType =
  | 'vanguard'
  | 'elevate'
  | 'prime'
  | 'impact'
  | 'free'
  | 'simplepro'
  | 'dev'
  | 'modern'
  | 'executive'
  | 'classic'
  | 'elite'
  | 'apex'
  | 'wonsulting'
  | 'styled'
  | 'smart'
  | 'elegant'
  | 'minimalist'
  | 'professional'
  | 'times'
  | 'jake'
  | 'scholar'
  | 'gaurav'
  | 'regent'
  | 'twocolumn'
  | 'freshgrad1'
  | 'freshgrad2'
  | 'freshgrad3'
  | 'freshgrad4'
  | 'freshgrad5'
  | 'freshgrad6'
  | 'freshgrad7'
  | 'freshgrad8'
  | 'sage'
  | 'rezi'
  | 'student'
  | 'intern';

export const INITIAL_DATA: ResumeData = {
  fullName: "Alexander Williams",
  jobTitle: "PROFESSIONAL ROLE",
  email: "alexander.williams@example.com",
  phone: "+1 (555) 123-4567",
  atHandle: "",
  linkedin: "linkedin.com/in/alexander-williams",
  github: "",
  portfolio: "",
  location: "City, Country",
  address: "",
  summary: "A brief professional summary highlighting your key strengths, experience, and career objectives. This should be 2-3 sentences that capture your professional identity and value proposition.",
  experience: [
    {
      id: '1',
      company: 'Company Name',
      role: 'Job Title',
      location: 'City, Country',
      startDate: '2020-01',
      endDate: 'Present',
      description: [
        'Key responsibility or achievement',
        'Another important accomplishment',
        'Quantifiable result or impact',
        'Additional contribution or success'
      ]
    }
  ],
  education: [
    {
      id: '1',
      school: 'University Name',
      degree: 'Degree Name, Major',
      year: '2020'
    }
  ],
  skills: "Skill 1, Skill 2, Skill 3, Skill 4, Skill 5, Skill 6",
  certifications: [
    {
      id: '1',
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      date: '2023',
      link: ''
    }
  ],
  projects: [
    {
      id: '1',
      name: 'Project Name',
      description: 'Brief description of the project and your contributions.',
      technologies: 'Tech Stack',
      link: 'github.com/username/project'
    }
  ],
  leadership: [],
  additionalInfo: [],
  keyAchievements: [
    "Major achievement or award",
    "Significant project or milestone",
    "Recognition or accomplishment"
  ],
  jobDescription: "",
  referee: "",
  font: 'Merriweather, serif',
  fontSizes: {
    header: 18,       // Header / Name
    jobTitle: 11,     // Job title
    sectionTitle: 11, // Section title
    body: 8,          // Body text, bullets, company & job title
  },
  lineHeight: 1.5,
  sectionGap: 0.1,
  headerGap: 0.08,
  bulletStyle: 'disc',
  bulletIndent: 0,
  headerItemGap: 0.04,
  headerContactGap: 0.04,
  margins: {
    horizontal: 0.5,
    vertical: 0.5,
  },
  currentTag: '',
  language: 'en',
  accentColor: '#000000',
  headerAlignment: 'center',
  contactAlignment: 'center',
  bodyHeaderAlignment: 'left',
  contentAlignment: 'left',
  skillsColumnCount: 3,
  showContactIcons: true,
  sectionOrder: [
    'summary',         // Professional Summary
    'keyAchievements', // Key Achievements
    'skills',          // Skills
    'experience',      // Experiences
    'education',       // Education
    'certifications',  // Certifications
    // Other sections follow after the core blocks
    'projects'
  ],
  source: 'scratch',
  hasJobMatchRun: false,
};

/**
 * Creates a clean, truthful, empty ResumeData object with zero placeholder/demo text.
 */
export const createEmptyResume = (): ResumeData => ({
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  atHandle: '',
  linkedin: '',
  github: '',
  portfolio: '',
  location: '',
  address: '',
  summary: '',
  experience: [],
  education: [],
  skills: '',
  certifications: [],
  projects: [],
  leadership: [],
  additionalInfo: [],
  keyAchievements: [],
  jobDescription: '',
  referee: '',
  font: 'Merriweather, serif',
  fontSizes: {
    header: 18,
    jobTitle: 11,
    sectionTitle: 11,
    body: 8,
  },
  lineHeight: 1.5,
  sectionGap: 0.1,
  headerGap: 0.08,
  bulletStyle: 'disc',
  bulletIndent: 0,
  headerItemGap: 0.04,
  headerContactGap: 0.04,
  margins: {
    horizontal: 0.5,
    vertical: 0.5,
  },
  currentTag: '',
  language: 'en',
  accentColor: '#000000',
  headerAlignment: 'center',
  contactAlignment: 'center',
  bodyHeaderAlignment: 'left',
  contentAlignment: 'left',
  skillsColumnCount: 3,
  showContactIcons: true,
  sectionOrder: [
    'summary',
    'keyAchievements',
    'skills',
    'experience',
    'education',
    'certifications',
    'projects',
    'additionalInfo',
    'references'
  ],
  source: 'scratch',
  hasJobMatchRun: false,
});

export const EMPTY_RESUME_DATA: ResumeData = createEmptyResume();
export const DEMO_RESUME_DATA: ResumeData = INITIAL_DATA;