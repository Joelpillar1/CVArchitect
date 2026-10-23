import type { TemplateType } from '../types';

/**
 * Role-specific template landing pages.
 *
 * One source of truth for content, metadata, and template picks. The route
 * manifest, sitemap, and React page all read from here, so adding a role means
 * editing one file instead of four.
 *
 * Content rules:
 *   - No template counts anywhere.
 *   - Example bullets use bracketed placeholders, never invented results.
 *   - No em-dashes.
 */

export const ROLE_LAST_UPDATED = '2026-10-21';
export const ROLE_LAST_UPDATED_LABEL = 'October 2026';

export interface RoleTemplateGuide {
  slug: string;
  role: string;
  /** Used in phrases like "nursing resumes" and "Build my nursing resume". */
  resumeLabel: string;
  metaTitle: string;
  metaDescription: string;
  /** Two lines. The second line renders with the brand underline. */
  h1: [string, string];
  intro: string;
  /** One sentence, used on related-role cards. */
  summary: string;
  lookFor: string[];
  templatePicks: Array<{ id: TemplateType; reason: string }>;
  bullets: string[];
  keywords: string[];
  mistakes: Array<{ title: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
  related: string[];
}

export const ROLE_GUIDES: RoleTemplateGuide[] = [
  {
    slug: 'nurse',
    role: 'Nurse',
    resumeLabel: 'nursing',
    metaTitle: 'Nursing Resume Template (ATS-Friendly, 2026) | Cvarchitect',
    metaDescription:
      'An ATS-friendly nursing resume template, plus the clinical experience, licenses, and keywords hiring managers scan for. Start free and export a PDF.',
    h1: ['Nursing resume template', 'that gets interviews'],
    intro:
      'Nursing hiring runs on credentials and evidence. A recruiter or unit manager scanning a stack of applications is looking for three things in the first few seconds: an active license, the clinical settings you have worked in, and whether your experience matches the unit. A layout that hides any of those behind columns or icons costs you the interview before your experience is read.',
    summary: 'Clinical settings, licensure, and patient outcomes in a layout a hospital parser can read.',
    lookFor: [
      'Licensure and current certifications near the top: RN or LPN, BLS, ACLS, PALS, and any specialty certification.',
      'The clinical setting and patient population for each role, such as med-surg, ICU, emergency, pediatrics, or long-term care.',
      'EHR systems by name, including Epic, Cerner, Meditech, and PointClickCare, because hospitals screen for them directly.',
      'Measurable outcomes: patient load, chart audit accuracy, readmission or infection reduction, precepting, and discharge coordination.',
    ],
    templatePicks: [
      {
        id: 'jake',
        reason: 'The safest choice for hospital portals. Single column, standard headings, and no text boxes for the parser to lose.',
      },
      {
        id: 'simplepro',
        reason: 'Keeps a long clinical history readable without crowding the license and certification block at the top.',
      },
      {
        id: 'classic',
        reason: 'A traditional layout for experienced nurses applying to hospitals and clinics that still expect a formal format.',
      },
    ],
    bullets: [
      'Managed care for [6] patients per shift on a [32]-bed med-surg unit, including medication administration, wound care, and discharge teaching.',
      'Documented assessments in Epic for [20]+ patients per week with [98]% chart audit accuracy.',
      'Precepted [4] new graduate nurses and [6] nursing students, running skills checkoffs and shadow shifts.',
      'Reduced [catheter-associated UTI] rates on the unit by [30]% over [two] quarters through a nurse-led audit and education program.',
      'Coordinated with physicians, pharmacy, and case management to move [12] discharges per week before [1 pm].',
    ],
    keywords: [
      'patient assessment',
      'medication administration',
      'care planning',
      'Epic',
      'Cerner',
      'HIPAA',
      'BLS',
      'ACLS',
      'triage',
      'IV therapy',
      'wound care',
      'discharge planning',
      'patient education',
      'precepting',
    ],
    mistakes: [
      {
        title: 'Listing duties instead of patient outcomes',
        body: 'Every unit already knows what a nurse does. Show the patient load, the setting, and the result. "Managed 6 patients on a 32-bed med-surg unit" tells a manager more than "provided patient care."',
      },
      {
        title: 'Burying the license below the fold',
        body: 'Licensure is the first screen. Put the credential, state, and current certifications above the experience section, not in a separate block at the bottom of page two.',
      },
      {
        title: 'Using a two-column layout for a hospital portal',
        body: 'Some clinical systems still flatten columns into the wrong order. A single-column layout keeps the license, dates, and employer names in the sequence the parser expects.',
      },
    ],
    faqs: [
      {
        q: 'Should a nursing resume be one page?',
        a: 'New graduates should stay on one page. Experienced nurses can use two pages when the second page holds distinct clinical settings, certifications, and leadership work. Padding a short history onto two pages hurts more than it helps.',
      },
      {
        q: 'Do I need to list my license number?',
        a: 'List the license type and state, which is what most screens check. The number itself is optional and is better left off copies you share publicly. Be ready to provide it during credentialing.',
      },
      {
        q: 'Which certifications belong on a nursing resume?',
        a: 'Include current BLS, ACLS, and PALS if the role requires them, plus specialty certifications such as CCRN or CMSRN. Put current certifications near the top and include the expiration or renewal year.',
      },
      {
        q: 'Can I use the same nursing resume for every unit?',
        a: 'Keep one master resume, then reorder the clinical experience and keywords for each setting. An ICU role and a long-term care role should not lead with the same three bullets.',
      },
    ],
    related: ['teacher', 'customer-service', 'project-manager'],
  },
  {
    slug: 'software-engineer',
    role: 'Software engineer',
    resumeLabel: 'software engineer',
    metaTitle: 'Software Engineer Resume Template (ATS-Friendly, 2026) | Cvarchitect',
    metaDescription:
      'An ATS-friendly software engineer resume template with scope, stack, and impact examples. Start free, tailor to the job post, and export a PDF.',
    h1: ['Software engineer resume', 'that passes the screen'],
    intro:
      'Engineering resumes get filtered twice: once by an applicant tracking system looking for language overlap with the job description, and once by an engineer who has thirty seconds and a bias toward evidence. The fastest way to lose either reader is a skills cloud with no context and bullets that describe tickets instead of systems.',
    summary: 'Stack, scope, and shipped systems written for both the parser and the engineer reading it.',
    lookFor: [
      'Languages and frameworks tied to something you built, not a logo wall with no context.',
      'Scope and scale: users, requests per second, data volume, latency, uptime, and team size.',
      'Ownership beyond tickets: design, migration, on-call, code review, and mentoring.',
      'Reproducible proof such as a GitHub profile, portfolio, or published package that is actually current.',
    ],
    templatePicks: [
      {
        id: 'dev',
        reason: 'Built for engineering resumes: a project and stack section that stays readable without turning into a two-column grid.',
      },
      {
        id: 'vanguard',
        reason: 'A modern tech layout that still keeps headings and dates in a single parseable order.',
      },
      {
        id: 'jake',
        reason: 'The conservative option for large company portals. Plain text, standard sections, no parsing surprises.',
      },
    ],
    bullets: [
      'Built and shipped [feature] in [React and TypeScript] for [40k] monthly users, cutting [page load] from [3.2s] to [1.1s].',
      'Migrated [service] from a [monolith] to [three] services, reducing deploy time from [45] minutes to [8].',
      'Cut [cloud spend] by [$18k] per year by right-sizing [12] containers and adding autoscaling.',
      'Led design review for a [payments] API used by [5] internal teams, holding [99.95]% uptime over [12] months.',
      'Mentored [3] junior engineers and ran weekly code review office hours, reducing review turnaround by [40]%.',
    ],
    keywords: [
      'TypeScript',
      'JavaScript',
      'Python',
      'React',
      'Node.js',
      'SQL',
      'AWS',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'REST',
      'GraphQL',
      'testing',
      'observability',
      'system design',
    ],
    mistakes: [
      {
        title: 'A skills list with no evidence',
        body: 'Twenty logos tell a reviewer nothing about depth. Keep the list to the tools you can discuss, and make sure each important one appears inside a bullet that shows what you built with it.',
      },
      {
        title: 'Bullets that describe responsibilities',
        body: '"Responsible for the payments service" is a job description. State what shipped, the scale it ran at, and the measurable change. If you do not have a metric, use scope instead.',
      },
      {
        title: 'Hiding the stack in a graphic',
        body: 'Icon rows and rating bars are invisible to many parsers and unreadable to a skim. Write the technology names as text in the skills section and in the bullets.',
      },
    ],
    faqs: [
      {
        q: 'How long should a software engineer resume be?',
        a: 'One page is enough under about ten years of experience. Senior and staff engineers can use two pages when the second page carries distinct systems, migrations, or leadership work rather than repeated responsibilities.',
      },
      {
        q: 'Should I include a GitHub link?',
        a: 'Yes, if the profile is active and relevant. Pin three or four repositories with a clear README instead of linking an empty account. A stale profile is worse than no link.',
      },
      {
        q: 'Do side projects belong on a software engineering resume?',
        a: 'They help early-career engineers and career changers. Include one or two projects that show the stack, the problem, and an outcome. Once you have shipped production work, projects should support the experience rather than replace it.',
      },
      {
        q: 'How do I show impact without metrics?',
        a: 'Use scope: the number of teams or users affected, the systems touched, the frequency of the work, and the before and after state. Scope is evidence even when a clean percentage is not available.',
      },
    ],
    related: ['data-analyst', 'project-manager', 'nurse'],
  },
  {
    slug: 'teacher',
    role: 'Teacher',
    resumeLabel: 'teaching',
    metaTitle: 'Teacher Resume Template (ATS-Friendly, 2026) | Cvarchitect',
    metaDescription:
      'A teacher resume template built for district portals, with certification, grade level, and student growth examples. Start free and export a PDF.',
    h1: ['Teacher resume template', 'that gets read'],
    intro:
      'Teaching resumes are read by people who know the job: principals, department heads, and HR staff who have seen hundreds of applications. They are checking for certification, grade levels and subjects, classroom management evidence, and whether your instruction produced measurable growth. Generic statements about being passionate about education do not survive that scan.',
    summary: 'Certification, grade bands, and student growth arranged for district hiring committees.',
    lookFor: [
      'State certification, endorsements, grade levels, and subject areas, stated plainly near the top.',
      'Curriculum and assessment work: unit design, differentiation, IEP and 504 collaboration, and formative assessment.',
      'Student growth data such as benchmark gains, proficiency rates, and intervention results.',
      'School context that matters to the role: grade band, class size, demographics, and co-teaching or specialist support.',
    ],
    templatePicks: [
      {
        id: 'elegant',
        reason: 'A calm, readable layout that gives certification and grade bands room without looking like a corporate resume.',
      },
      {
        id: 'simplepro',
        reason: 'Keeps long district applications to a clean two-page structure without decorative elements that parse badly.',
      },
      {
        id: 'classic',
        reason: 'A formal option for districts and private schools that still expect a traditional teaching resume.',
      },
    ],
    bullets: [
      'Taught [7th grade] [ELA] to [five] sections of [28] students, designing [12] standards-aligned units per year.',
      'Raised [reading proficiency] from [54]% to [71]% over [two] years, as measured by the [district benchmark].',
      'Differentiated instruction for [9] students with IEPs and [6] multilingual learners, coordinating with support staff weekly.',
      'Led a [professional learning community] for [6] teachers and rebuilt the [writing] scope and sequence.',
      'Ran an [after-school] [robotics] club for [22] students and secured [$3k] in grant funding.',
    ],
    keywords: [
      'lesson planning',
      'curriculum development',
      'differentiated instruction',
      'classroom management',
      'IEP',
      '504',
      'formative assessment',
      'data-driven instruction',
      'parent communication',
      'Google Classroom',
      'Canvas',
      'state certification',
    ],
    mistakes: [
      {
        title: 'Leading with a philosophy statement',
        body: 'A short summary is useful. A full paragraph about believing every child can learn is not, especially when it pushes certification and grade level below the first screen. Put the credentials first.',
      },
      {
        title: 'Omitting student growth data',
        body: 'Districts want evidence that instruction changed something. Include a benchmark gain, proficiency shift, or intervention result, and name the measure so the claim is checkable.',
      },
      {
        title: 'Using a decorative template',
        body: 'Some district systems still flatten columns and drop text from graphics. A single-column layout with standard headings keeps certification, dates, and school names in the right order.',
      },
    ],
    faqs: [
      {
        q: 'Should a teacher resume include a philosophy statement?',
        a: 'A two-line summary is enough. A full teaching philosophy belongs in a cover letter or portfolio, where a committee expects to read it. Keep the resume focused on certification, grade levels, and evidence.',
      },
      {
        q: 'How do I list teaching certifications?',
        a: 'List the certificate name, the state, the grade bands, and the subject endorsements, with the expiration or renewal year. Put current certification above the experience section.',
      },
      {
        q: 'What if I am a student teacher?',
        a: 'Lead with the clinical placement, the grade level, the units you taught, and feedback from your supervising teacher. Treat it as real experience, because district screens do.',
      },
      {
        q: 'Do I need a teaching portfolio?',
        a: 'A link helps when it is current and easy to scan. Keep the resume self-contained anyway, since many committees review the document before they open a portfolio.',
      },
    ],
    related: ['nurse', 'customer-service', 'project-manager'],
  },
  {
    slug: 'data-analyst',
    role: 'Data analyst',
    resumeLabel: 'data analyst',
    metaTitle: 'Data Analyst Resume Template (ATS-Friendly, 2026) | Cvarchitect',
    metaDescription:
      'A data analyst resume template with SQL, BI, and business impact examples. ATS-friendly, free to start, and tailored to the job post.',
    h1: ['Data analyst resume', 'that proves impact'],
    intro:
      'Analyst resumes are judged on two things: whether you can use the tools the team uses, and whether you can turn an analysis into a decision. A list of libraries is not evidence. Hiring managers look for the question you answered, the data you handled, and what changed because of the answer.',
    summary: 'Tools, methods, and business decisions instead of a list of libraries.',
    lookFor: [
      'SQL depth and data modeling, not just the word SQL in a skills list.',
      'BI tools by name: Tableau, Power BI, and Looker, with the audience each dashboard served.',
      'Python or R for analysis, including the libraries that matter for the role.',
      'A business outcome tied to the work: revenue, cost, churn, conversion, or time saved.',
    ],
    templatePicks: [
      {
        id: 'gaurav',
        reason: 'An analyst-focused layout with room for tools and selected projects without turning into a wall of text.',
      },
      {
        id: 'jake',
        reason: 'The most parser-safe option for large company portals and staffing agencies.',
      },
      {
        id: 'minimalist',
        reason: 'A clean single-column resume for analysts who need to fit tools, projects, and outcomes on one page.',
      },
    ],
    bullets: [
      'Built [12] Tableau dashboards for [sales and operations], replacing a [weekly] manual report that took [6] hours.',
      'Wrote SQL against a [4 TB] warehouse to identify [churn] drivers, informing a retention program that reduced cancellations by [8]%.',
      'Automated [monthly] reporting in [Python and dbt], cutting preparation time from [3] days to [2] hours.',
      'Partnered with [marketing] to design an A/B test on [onboarding], producing a [4.2]% lift in activation.',
      'Documented [40] metrics in a shared dictionary, reducing duplicate definitions across [5] teams.',
    ],
    keywords: [
      'SQL',
      'Python',
      'R',
      'Tableau',
      'Power BI',
      'Looker',
      'dbt',
      'Excel',
      'A/B testing',
      'data modeling',
      'ETL',
      'statistics',
      'data visualization',
      'stakeholder communication',
    ],
    mistakes: [
      {
        title: 'Tool lists with no project context',
        body: 'A row of logos says you have opened the software. A bullet that names the tool, the data, and the decision says you can use it. Show both, with the evidence in the bullet.',
      },
      {
        title: 'Dashboards with no audience',
        body: 'A dashboard is not an outcome. Name who used it and what they changed. "Weekly churn dashboard for the retention team" is stronger than "created dashboards."',
      },
      {
        title: 'Metrics that do not connect to the business',
        body: 'Model accuracy is useful, but hiring managers outside the data team need the decision it supported. Pair the technical result with the revenue, cost, or time it affected.',
      },
    ],
    faqs: [
      {
        q: 'Do I need a portfolio for a data analyst role?',
        a: 'Not required, but two or three short project writeups help. For each one, state the question, the data, the method, and the result. A notebook with no explanation is less useful than a one-page summary.',
      },
      {
        q: 'Which tools should I list first?',
        a: 'List the tools named in the job post first, then your strongest ones. Do not list a tool you cannot discuss in an interview, because the skills section is often used as an interview checklist.',
      },
      {
        q: 'How technical should a data analyst resume be?',
        a: 'Technical enough to show method, concise enough for a business reader. Name the tool and the technique, then spend the rest of the bullet on the decision it supported.',
      },
      {
        q: 'Can I break into data analysis without a degree?',
        a: 'Yes, but the resume has to carry the proof. Emphasize SQL, shipped analysis, and transferable domain knowledge. A certificate helps at the margin; a project with a real question and result helps more.',
      },
    ],
    related: ['software-engineer', 'project-manager', 'customer-service'],
  },
  {
    slug: 'project-manager',
    role: 'Project manager',
    resumeLabel: 'project manager',
    metaTitle: 'Project Manager Resume Template (ATS-Friendly, 2026) | Cvarchitect',
    metaDescription:
      'A project manager resume template focused on scope, budget, and delivery. ATS-friendly, free to start, with example bullets and FAQs.',
    h1: ['Project manager resume', 'that shows scope'],
    intro:
      'Project management resumes are easy to inflate and hard to prove. Anyone can claim to be organized. Hiring managers look for scope, budget, team size, methodology, and the specific outcome you delivered. The strongest resumes read like a short portfolio of projects, not a list of responsibilities.',
    summary: 'Budget, team size, and delivery outcomes instead of a list of methodologies.',
    lookFor: [
      'Scope for each project: budget, team size, timeline, and the number of stakeholders or sites.',
      'Methodology and tools: Agile, Scrum, Kanban, waterfall, hybrid, Jira, Asana, and Confluence.',
      'Delivery evidence: on-time completion, budget variance, adoption, and risks resolved before they landed.',
      'Cross-functional leadership across engineering, design, sales, vendors, and executive sponsors.',
    ],
    templatePicks: [
      {
        id: 'elevate',
        reason: 'A corporate layout that gives project scope and outcomes room without burying them under responsibilities.',
      },
      {
        id: 'apex',
        reason: 'A senior-leader format for program managers with multiple workstreams and large budgets.',
      },
      {
        id: 'simplepro',
        reason: 'A clean, parser-safe option for applications that go through a large company portal.',
      },
    ],
    bullets: [
      'Delivered a [CRM migration] for [120] users across [4] departments, on time and [$40k] under a [$300k] budget.',
      'Ran [two-week] sprints for a [9]-person product team, improving on-time delivery from [62]% to [88]% over [three] quarters.',
      'Managed a [14]-vendor rollout across [6] sites, cutting average onboarding time from [10] days to [4].',
      'Built a risk register and escalation process for a [$1.2M] program, resolving [11] blockers before they affected the launch.',
      'Led change management for a [new workflow], reaching [92]% adoption within [60] days.',
    ],
    keywords: [
      'Agile',
      'Scrum',
      'Kanban',
      'Jira',
      'Asana',
      'Confluence',
      'risk management',
      'stakeholder management',
      'budget',
      'scope',
      'roadmap',
      'cross-functional',
      'change management',
    ],
    mistakes: [
      {
        title: 'Listing methodologies without application',
        body: 'Saying you are Agile tells a hiring manager very little. Name the framework, the team cadence, and the delivery result. The same goes for tools: show what the tool was used to manage.',
      },
      {
        title: 'Omitting budget and team size',
        body: 'Scope is the fastest way to signal seniority. A project without a budget, team size, or timeline reads like a task list. Add the numbers you can defend, even if they are approximate.',
      },
      {
        title: 'Describing ceremonies instead of outcomes',
        body: 'Standups, sprint planning, and retrospectives are the job, not the achievement. Keep the ceremony reference short and spend the bullet on what shipped or what changed.',
      },
    ],
    faqs: [
      {
        q: 'Should a project manager resume be one page?',
        a: 'One page works for early-career project managers and coordinators. Two pages are reasonable for senior PMs and program managers with multiple large programs, especially when the second page carries distinct scope and outcomes.',
      },
      {
        q: 'Do I need a PMP certification?',
        a: 'Not for every role. If you have it, list it with the year. If you do not, show equivalent scope: budget owned, team size, and delivery record. Some employers filter for PMP, so check the job post before you apply.',
      },
      {
        q: 'How do I show Agile experience?',
        a: 'Name the framework, the team size, and the cadence, then add the delivery result. "Ran two-week sprints for a nine-person team and raised on-time delivery from 62% to 88%" is stronger than "Agile practitioner."',
      },
      {
        q: 'What if my projects are internal?',
        a: 'Internal projects count. Describe the users, the budget, the systems, and the change instead of client names. If the work was confidential, use a category such as "a top-five retail client" rather than the name.',
      },
    ],
    related: ['data-analyst', 'software-engineer', 'customer-service'],
  },
  {
    slug: 'customer-service',
    role: 'Customer service',
    resumeLabel: 'customer service',
    metaTitle: 'Customer Service Resume Template (ATS-Friendly, 2026) | Cvarchitect',
    metaDescription:
      'A customer service resume template with volume, systems, and resolution metrics. ATS-friendly, free to start, and ready to export as a PDF.',
    h1: ['Customer service resume', 'that gets the call'],
    intro:
      'Customer service hiring is high volume, so the first filter is often a keyword match and the second is a quick read for reliability and judgment. A resume that lists customer service as a skill without evidence looks the same as every other application. Specific numbers, systems, and escalation experience are what make it readable.',
    summary: 'Volume, systems, and resolution metrics for high-volume support hiring.',
    lookFor: [
      'Volume and channel: calls, tickets, or chats per day, plus the queue size and shift pattern.',
      'Systems by name: Zendesk, Salesforce, HubSpot, Intercom, and Freshdesk.',
      'Resolution and quality metrics such as CSAT, first-contact resolution, handle time, and escalation rate.',
      'Reliability and range: attendance, shift coverage, training, and mentoring new agents.',
    ],
    templatePicks: [
      {
        id: 'free',
        reason: 'An entry-level layout that puts availability, systems, and metrics where a high-volume recruiter will see them.',
      },
      {
        id: 'professional',
        reason: 'A clean standard format for support roles that require a formal resume and a quick keyword scan.',
      },
      {
        id: 'simplepro',
        reason: 'A parser-safe option for large contact centers and staffing agencies that screen through a portal.',
      },
    ],
    bullets: [
      'Handled [60]+ calls per day in a [24/7] support queue, maintaining a [94]% customer satisfaction score.',
      'Resolved [45] tickets per day in Zendesk across billing, account access, and technical issues.',
      'Reduced average handle time from [11] minutes to [8] while keeping first-contact resolution above [80]%.',
      'De-escalated [complex] billing disputes and documented outcomes for [legal and finance] follow-up.',
      'Trained [7] new agents on phone, chat, and refund workflows, cutting their ramp time by [two] weeks.',
    ],
    keywords: [
      'customer service',
      'Zendesk',
      'Salesforce',
      'Intercom',
      'conflict resolution',
      'escalation',
      'CSAT',
      'first contact resolution',
      'order processing',
      'CRM',
      'data entry',
      'shift coverage',
    ],
    mistakes: [
      {
        title: 'Relying on "people person"',
        body: 'Every applicant says they like helping people. A number does more: calls per day, CSAT, first-contact resolution, or a specific escalation you handled. Replace the trait with evidence.',
      },
      {
        title: 'Listing tools you have not used',
        body: 'Support screens often ask about a specific system in the interview. List the ones you can operate, and describe the channel and volume you handled in each.',
      },
      {
        title: 'Leaving out availability',
        body: 'High-volume employers screen for shift coverage. If the role is evenings, weekends, or rotating, state your availability in the header or summary instead of making the recruiter ask.',
      },
    ],
    faqs: [
      {
        q: 'Do I need a degree for a customer service job?',
        a: 'Usually not. Employers screen for reliability, communication, and system experience. A degree helps for some corporate or specialized support roles, but it is rarely the deciding factor for front-line support.',
      },
      {
        q: 'What metrics should I include?',
        a: 'CSAT, tickets or calls per day, first-contact resolution, and handle time are the standard four. Include the ones you actually know. If you do not have them, use volume, channels, and systems instead of guessing.',
      },
      {
        q: 'How do I show experience without formal metrics?',
        a: 'Describe the volume, the channels, the systems, and one difficult case you resolved. A concrete story about a billing dispute or an escalation is stronger than an adjective.',
      },
      {
        q: 'Should I include my availability?',
        a: 'If the role is shift-based, yes. Put it in the header or the first line of the summary. It answers a screening question before the recruiter has to ask and signals that you read the posting.',
      },
    ],
    related: ['nurse', 'teacher', 'data-analyst'],
  },
];

export function getRoleGuide(slug: string | undefined): RoleTemplateGuide | undefined {
  if (!slug) return undefined;
  return ROLE_GUIDES.find((guide) => guide.slug === slug);
}

export function getRelatedRoleGuides(guide: RoleTemplateGuide): RoleTemplateGuide[] {
  return guide.related
    .map((slug) => getRoleGuide(slug))
    .filter((item): item is RoleTemplateGuide => Boolean(item));
}
