import type { ResumeData } from '../types';

/**
 * Sample resumes for the role-specific template pages.
 *
 * The gallery uses one persona per template, which is fine on /resume-templates
 * but wrong on a role page: a nursing page must not preview a product manager.
 * These datasets are deliberately small, because the cards render them at
 * roughly one third scale, and they are clearly fictional.
 */

const CONTACT = {
  fullName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '(555) 010-2233',
  linkedin: 'linkedin.com/in/alex-morgan',
};

const NURSE_PREVIEW: ResumeData = {
  ...CONTACT,
  jobTitle: 'REGISTERED NURSE',
  location: 'Portland, OR',
  summary:
    'Registered nurse with 6 years across med-surg and step-down units, coordinating care for up to 6 patients per shift. Epic superuser with a record of reducing catheter-associated infections through nurse-led audits and education.',
  experience: [
    {
      id: '1',
      company: 'Mercy General Hospital',
      role: 'Registered Nurse, Med-Surg',
      location: 'Portland, OR',
      startDate: '2021-03',
      endDate: 'Present',
      description: [
        'Managed care for 6 patients per shift on a 32-bed med-surg unit, including medication administration, wound care, and discharge teaching.',
        'Documented assessments in Epic for 20+ patients per week with 98% chart audit accuracy.',
        'Precepted 4 new graduate nurses and 6 nursing students, running skills checkoffs and shadow shifts.',
      ],
    },
    {
      id: '2',
      company: 'Cedar Ridge Care Center',
      role: 'Registered Nurse',
      location: 'Salem, OR',
      startDate: '2018-06',
      endDate: '2021-02',
      description: [
        'Coordinated daily care for 24 residents in a long-term care setting, working with physicians, pharmacy, and case management.',
        'Reduced catheter-associated UTI rates by 30% over two quarters through a nurse-led audit and education program.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Oregon Health & Science University',
      degree: 'Bachelor of Science in Nursing (BSN)',
      year: '2018',
    },
  ],
  skills:
    'Patient assessment, Medication administration, Care planning, Epic, Cerner, IV therapy, Wound care, Discharge planning, Patient education, Precepting',
  certifications: [
    { id: '1', name: 'Basic Life Support (BLS)', issuer: 'American Heart Association', date: '2025' },
    { id: '2', name: 'Advanced Cardiovascular Life Support (ACLS)', issuer: 'American Heart Association', date: '2025' },
    { id: '3', name: 'Medical-Surgical Nursing Certification (CMSRN)', issuer: 'MSNCB', date: '2023' },
  ],
  keyAchievements: [
    'Led a unit audit that cut catheter-associated UTI rates by 30% over two quarters.',
    'Precepted 10 new nurses and students while maintaining a full patient assignment.',
    'Maintained 98% chart audit accuracy across 20+ weekly Epic assessments.',
  ],
};

const SOFTWARE_ENGINEER_PREVIEW: ResumeData = {
  ...CONTACT,
  jobTitle: 'SOFTWARE ENGINEER',
  location: 'Seattle, WA',
  summary:
    'Software engineer with 5 years building customer-facing web applications in TypeScript and React. Focused on performance, reliable delivery, and systems that other teams can operate without escalation.',
  experience: [
    {
      id: '1',
      company: 'Northwind Labs',
      role: 'Software Engineer',
      location: 'Seattle, WA',
      startDate: '2022-01',
      endDate: 'Present',
      description: [
        'Built and shipped a billing dashboard in React and TypeScript for 40k monthly users, cutting page load from 3.2s to 1.1s.',
        'Migrated a reporting service from a monolith to three services, reducing deploy time from 45 minutes to 8.',
        'Cut cloud spend by $18k per year by right-sizing 12 containers and adding autoscaling.',
      ],
    },
    {
      id: '2',
      company: 'Brightline Apps',
      role: 'Junior Software Engineer',
      location: 'Tacoma, WA',
      startDate: '2020-06',
      endDate: '2021-12',
      description: [
        'Implemented a REST API used by 5 internal teams, with integration tests and on-call runbooks.',
        'Mentored 2 interns and ran weekly code review office hours, reducing review turnaround by 40%.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of Washington',
      degree: 'Bachelor of Science in Computer Science',
      year: '2020',
    },
  ],
  skills:
    'TypeScript, JavaScript, Python, React, Node.js, PostgreSQL, AWS, Docker, CI/CD, GraphQL, Testing, Observability',
  certifications: [
    { id: '1', name: 'AWS Certified Developer, Associate', issuer: 'Amazon Web Services', date: '2024' },
  ],
  projects: [
    {
      id: '1',
      name: 'DevTrack issue tracker',
      role: 'Maintainer',
      description: [
        'Open-source issue tracker built with React, Node.js, PostgreSQL, and Docker.',
        'Used by 3 small teams for sprint planning and release notes.',
      ],
      link: 'github.com/example/devtrack',
    },
  ],
  keyAchievements: [
    'Reduced page load from 3.2s to 1.1s for a 40k-user dashboard.',
    'Cut deploy time from 45 minutes to 8 by splitting a monolith into three services.',
    'Mentored 2 interns and 3 junior engineers through code review and pairing.',
  ],
};

const TEACHER_PREVIEW: ResumeData = {
  ...CONTACT,
  jobTitle: 'ELEMENTARY TEACHER',
  location: 'Minneapolis, MN',
  summary:
    'Elementary teacher with 7 years across third and fourth grade, focused on literacy growth and consistent classroom routines. Experienced with IEP and 504 collaboration, family communication, and data-driven small groups.',
  experience: [
    {
      id: '1',
      company: 'Riverside Elementary',
      role: '3rd Grade Teacher',
      location: 'Minneapolis, MN',
      startDate: '2021-08',
      endDate: 'Present',
      description: [
        'Taught 3rd grade ELA and math to 28 students, designing 12 standards-aligned units per year.',
        'Raised reading proficiency from 54% to 71% over two years, as measured by the district benchmark.',
        'Differentiated instruction for 9 students with IEPs and 6 multilingual learners, coordinating with support staff weekly.',
      ],
    },
    {
      id: '2',
      company: 'Maple Grove School',
      role: '4th Grade Teacher',
      location: 'Maple Grove, MN',
      startDate: '2018-08',
      endDate: '2021-06',
      description: [
        'Led a professional learning community for 6 teachers and rebuilt the writing scope and sequence.',
        'Ran an after-school robotics club for 22 students and secured $3k in grant funding.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of Minnesota',
      degree: 'Bachelor of Science in Elementary Education',
      year: '2018',
    },
  ],
  skills:
    'Lesson planning, Differentiated instruction, Classroom management, IEP and 504 plans, Formative assessment, Data-driven instruction, Parent communication, Google Classroom, Guided reading, Project-based learning',
  certifications: [
    { id: '1', name: 'State Teaching License, K-6', issuer: 'Minnesota Professional Educator Licensing', date: '2024' },
    { id: '2', name: 'Reading Intervention Endorsement', issuer: 'Minnesota Department of Education', date: '2023' },
  ],
  keyAchievements: [
    'Raised reading proficiency from 54% to 71% over two years on the district benchmark.',
    'Rebuilt the writing scope and sequence for a 6-teacher professional learning community.',
    'Secured $3k in grant funding for an after-school robotics club serving 22 students.',
  ],
};

const DATA_ANALYST_PREVIEW: ResumeData = {
  ...CONTACT,
  jobTitle: 'DATA ANALYST',
  location: 'Boston, MA',
  summary:
    'Data analyst with 5 years turning operational data into decisions in ecommerce and financial services. Strong in SQL, Python, and BI dashboard design, with a focus on measurement that non-technical teams can act on.',
  experience: [
    {
      id: '1',
      company: 'Apex Commerce',
      role: 'Data Analyst',
      location: 'Boston, MA',
      startDate: '2022-04',
      endDate: 'Present',
      description: [
        'Built 12 Tableau dashboards for sales and operations, replacing a weekly manual report that took 6 hours.',
        'Wrote SQL against a 4 TB warehouse to identify churn drivers, informing a retention program that reduced cancellations by 8%.',
        'Partnered with marketing to design an A/B test on onboarding, producing a 4.2% lift in activation.',
      ],
    },
    {
      id: '2',
      company: 'MetricStream Solutions',
      role: 'Junior Data Analyst',
      location: 'Cambridge, MA',
      startDate: '2020-07',
      endDate: '2022-03',
      description: [
        'Automated monthly reporting in Python and dbt, cutting preparation time from 3 days to 2 hours.',
        'Documented 40 metrics in a shared dictionary, reducing duplicate definitions across 5 teams.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Boston University',
      degree: 'Bachelor of Science in Statistics',
      year: '2020',
    },
  ],
  skills:
    'SQL, Python, R, Tableau, Power BI, dbt, Excel, A/B testing, Data modeling, Statistics, Data visualization, Stakeholder communication',
  certifications: [
    { id: '1', name: 'Google Data Analytics Professional Certificate', issuer: 'Google', date: '2021' },
    { id: '2', name: 'Tableau Desktop Specialist', issuer: 'Tableau', date: '2023' },
  ],
  projects: [
    {
      id: '1',
      name: 'Subscription churn analysis',
      role: 'Analyst',
      description: [
        'Combined billing and support data in SQL to isolate the three strongest churn signals.',
        'Presented findings to the retention team, which changed the first-renewal outreach sequence.',
      ],
    },
  ],
  keyAchievements: [
    'Reduced cancellations by 8% by identifying churn drivers in a 4 TB warehouse.',
    'Cut monthly reporting time from 3 days to 2 hours with Python and dbt automation.',
    'Produced a 4.2% activation lift through a designed A/B test on onboarding.',
  ],
};

const PROJECT_MANAGER_PREVIEW: ResumeData = {
  ...CONTACT,
  jobTitle: 'PROJECT MANAGER',
  location: 'Phoenix, AZ',
  summary:
    'Project manager with 7 years delivering systems and process rollouts across operations and customer teams. Comfortable owning budget, vendor coordination, and the change management that makes a launch stick.',
  experience: [
    {
      id: '1',
      company: 'Northstar Logistics',
      role: 'Project Manager',
      location: 'Phoenix, AZ',
      startDate: '2021-05',
      endDate: 'Present',
      description: [
        'Delivered a CRM migration for 120 users across 4 departments, on time and $40k under a $300k budget.',
        'Ran two-week sprints for a 9-person product team, improving on-time delivery from 62% to 88% over three quarters.',
        'Managed a 14-vendor rollout across 6 sites, cutting average onboarding time from 10 days to 4.',
      ],
    },
    {
      id: '2',
      company: 'Bluebird Consulting',
      role: 'Associate Project Manager',
      location: 'Tempe, AZ',
      startDate: '2018-09',
      endDate: '2021-04',
      description: [
        'Built a risk register and escalation process for a $1.2M program, resolving 11 blockers before launch.',
        'Led change management for a new workflow, reaching 92% adoption within 60 days.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Arizona State University',
      degree: 'Bachelor of Science in Business Administration',
      year: '2018',
    },
  ],
  skills:
    'Agile, Scrum, Kanban, Jira, Asana, Confluence, Risk management, Stakeholder management, Budgeting, Scope management, Roadmap planning, Change management',
  certifications: [
    { id: '1', name: 'Project Management Professional (PMP)', issuer: 'Project Management Institute', date: '2023' },
    { id: '2', name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', date: '2021' },
  ],
  keyAchievements: [
    'Delivered a 120-user CRM migration $40k under a $300k budget.',
    'Raised on-time delivery from 62% to 88% across three quarters.',
    'Resolved 11 program blockers before they affected a $1.2M launch.',
  ],
};

const CUSTOMER_SERVICE_PREVIEW: ResumeData = {
  ...CONTACT,
  jobTitle: 'CUSTOMER SERVICE SPECIALIST',
  location: 'Portland, OR',
  summary:
    'Customer service specialist with 6 years in high-volume phone, chat, and email support. Known for de-escalating billing disputes, keeping first-contact resolution high, and training new agents on the systems they actually use.',
  experience: [
    {
      id: '1',
      company: 'Clearwater Utilities',
      role: 'Customer Service Specialist',
      location: 'Portland, OR',
      startDate: '2022-02',
      endDate: 'Present',
      description: [
        'Handled 60+ calls per day in a 24/7 support queue, maintaining a 94% customer satisfaction score.',
        'Resolved 45 tickets per day in Zendesk across billing, account access, and service issues.',
        'Reduced average handle time from 11 minutes to 8 while keeping first-contact resolution above 80%.',
      ],
    },
    {
      id: '2',
      company: 'RetailHub',
      role: 'Customer Support Associate',
      location: 'Beaverton, OR',
      startDate: '2019-05',
      endDate: '2022-01',
      description: [
        'De-escalated complex billing disputes and documented outcomes for legal and finance follow-up.',
        'Trained 7 new agents on phone, chat, and refund workflows, cutting ramp time by two weeks.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Portland Community College',
      degree: 'Associate of Arts in Business',
      year: '2019',
    },
  ],
  skills:
    'Customer service, Zendesk, Salesforce, Intercom, Conflict resolution, Escalation handling, Order processing, CRM, Data entry, First-contact resolution, Shift coverage',
  certifications: [
    { id: '1', name: 'Zendesk Support Administrator', issuer: 'Zendesk', date: '2023' },
  ],
  keyAchievements: [
    'Maintained a 94% CSAT score while handling 60+ calls per day.',
    'Reduced average handle time from 11 minutes to 8 without lowering resolution.',
    'Trained 7 new agents, cutting their ramp time by two weeks.',
  ],
};

const ROLE_PREVIEWS: Record<string, ResumeData> = {
  nurse: NURSE_PREVIEW,
  'software-engineer': SOFTWARE_ENGINEER_PREVIEW,
  teacher: TEACHER_PREVIEW,
  'data-analyst': DATA_ANALYST_PREVIEW,
  'project-manager': PROJECT_MANAGER_PREVIEW,
  'customer-service': CUSTOMER_SERVICE_PREVIEW,
};

export function getRolePreviewData(slug: string | undefined): ResumeData | undefined {
  if (!slug) return undefined;
  return ROLE_PREVIEWS[slug];
}

export const ROLE_PREVIEWS_BY_SLUG = ROLE_PREVIEWS;
