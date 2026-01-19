export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  roleSummary?: string;
  startDate: string;
  endDate: string;
  description: string | string[]; // Can be string (legacy) or array of bullet points
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
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
  description: string;
  link?: string;
  technologies?: string;
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

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  linkedin?: string;
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
  sectionHeaderCase?: 'uppercase' | 'lowercase' | 'capitalize';
  lineHeight?: number;
  sectionGap?: number;
  headerGap?: number; // Gap between header and body sections
  headerItemGap?: number; // Gap between header items (name, title, contact)
  margins?: {
    horizontal: number;
    vertical: number;
  };
  headerAlignment?: 'left' | 'center' | 'right'; // Alignment for name, title, and contact info
  bodyHeaderAlignment?: 'left' | 'center' | 'right'; // Alignment for section titles (Experience, Education, etc.)
  contentAlignment?: 'left' | 'center' | 'right'; // Alignment for body content (summary, experience, etc.)
  skillsColumnCount?: number; // Number of columns for skills section (2 or 3)
  sectionOrder?: string[]; // Order of sections
  currentTag?: string; // For tagging saved templates
  template?: TemplateType; // Selected template
  version_number?: number; // Current version number
  version_name?: string | null; // Optional version name/tag
}

export interface SavedTemplate {
  id: string;
  tag: string;
  baseTemplate: TemplateType;
  data: ResumeData;
  createdAt: Date;
}

// Add 'vanguard' and remove the deleted templates for now.
export type TemplateType = 'vanguard' | 'elevate' | 'prime' | 'impact' | 'free' | 'simplepro' | 'dev' | 'modern' | 'executive' | 'classic' | 'elite' | 'apex' | 'wonsulting' | 'styled' | 'smart' | 'elegant' | 'minimalist';

export const INITIAL_DATA: ResumeData = {
  fullName: "YOUR NAME",
  jobTitle: "PROFESSIONAL ROLE",
  email: "your.email@example.com",
  phone: "+1 (555) 123-4567",
  atHandle: "",
  linkedin: "linkedin.com/in/yourprofile",
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
  additionalInfo: [
    {
      id: '1',
      label: 'Languages',
      value: 'English (Native), Spanish (Fluent)'
    },
    {
      id: '2',
      label: 'Interests',
      value: 'Open Source Contributing, Tech Blogging, Hiking'
    }
  ],
  keyAchievements: [
    "Major achievement or award",
    "Significant project or milestone",
    "Recognition or accomplishment"
  ],
  jobDescription: "",
  referee: "Available upon request",
  font: 'Helvetica, Arial, sans-serif',
  fontSizes: {
    header: 36,
    jobTitle: 14,
    sectionTitle: 12,
    body: 10.5,
  },
  lineHeight: 1.4,
  sectionGap: 0.14,
  headerGap: 0.15,
  headerItemGap: 0.08,
  margins: {
    horizontal: 0.4,
    vertical: 0.4,
  },
  currentTag: '',
  language: 'en',
  accentColor: '#000000',
  headerAlignment: 'left',
  bodyHeaderAlignment: 'left',
  contentAlignment: 'left',
  skillsColumnCount: 3,
  sectionOrder: [
    'summary',
    'keyAchievements',
    'experience',
    'education',
    'projects',
    'skills',
    'certifications',
    'additionalInfo',
    'references'
  ],
};