export type WorkplaceType = 'Remote' | 'Hybrid' | 'On-site';
export type JobType = 'Full-time' | 'FullTime' | 'Part-time' | 'Contract' | 'Internship';
export type ExperienceLevel = 'Entry Level' | 'Junior Level' | 'Mid Level' | 'Senior' | 'Senior Level' | 'Lead / Staff' | 'Executive';
export type Department =
  | 'Engineering'
  | 'Design'
  | 'Design & UX'
  | 'Product'
  | 'AI & Data'
  | 'Marketing'
  | 'Sales'
  | 'Sales & Growth'
  | 'Finance'
  | 'Operations'
  | 'Legal'
  | 'HR'
  /** Catch-all for real postings whose department matches no known bucket. Preferred over
   *  forcing unrelated roles (legal, facilities, teaching) into a misleading category. */
  | 'Other';

export interface SalaryInfo {
  min: number;
  max: number;
  currency: string; // e.g. '$'
  period: 'yearly' | 'monthly' | 'hourly';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  companyColor?: string;
  location: string;
  /** Null when the source discloses nothing — most company career pages do not. */
  workplaceType?: WorkplaceType | null;
  jobType?: JobType | null;
  /** Inferred from the title, or null when the title carries no seniority signal. */
  experienceLevel?: ExperienceLevel | null;
  department: Department;
  /** Null when the employer does not publish pay (common outside US job boards). */
  salary?: SalaryInfo | null;
  /** Human-readable pay text when a structured range is unavailable. */
  salarySummary?: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  postedDate: string; // e.g., '1 day ago', '3 days ago'
  isActive?: boolean; // Whether the job listing is currently active (admin field)
  featured?: boolean;
  urgent?: boolean;
  applicantsCount?: number;
  applyUrl?: string;
  /** Direct link to the company's official website / careers page. */
  companyWebsiteUrl?: string;

  // ---- Provenance for jobs pulled live from a company's own career page ----
  /** Which applicant-tracking system the posting was read from. */
  sourceProvider?: 'greenhouse' | 'lever' | 'ashby' | 'html' | 'manual';
  /** The employer's own careers page / posting URL. */
  sourceUrl?: string;
  /** ISO timestamp the posting was first published by the employer. */
  postedAt?: string | null;
  /** ISO timestamp this feed first observed the posting. */
  firstSeenAt?: string | null;
}

export interface JobFilterState {
  search: string;
  company?: string; // 'all' | company name
  workplaceType: string; // 'all' | WorkplaceType
  jobType: string; // 'all' | JobType
  experienceLevel: string; // 'all' | ExperienceLevel
  department: string; // 'all' | Department
  minSalary: number;
  sortBy: 'recent' | 'salary_high' | 'match_score' | 'featured';
  onlySaved: boolean;
}
