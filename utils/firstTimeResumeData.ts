/**
 * First-time-writer resume builder listicle data.
 *
 * Pricing for competitor picks comes from utils/comparisonData.ts, where every
 * figure is tied to a public pricing page and the COMPARISON_VERIFIED date.
 * The student resume images are existing Cvarchitect assets and are used with
 * descriptive alt text and captions.
 */

export interface FirstTimePick {
  award: string;
  name: string;
  /** Null means Cvarchitect. */
  slug: string | null;
  href: string;
  summary: string;
  bestFor: string;
  whyItWorks: string;
  watchOut: string;
}

export interface FirstResumeSection {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  aspect: string;
  bullets: string[];
}

export interface BulletExample {
  before: string;
  after: string;
  source: string;
}

export interface WeekPlanDay {
  day: string;
  title: string;
  detail: string;
  output: string;
}

export const FIRST_TIME_PICKS: FirstTimePick[] = [
  {
    award: 'Best for the first draft',
    name: 'Cvarchitect',
    slug: null,
    href: '/signup?redirect=/dashboard',
    summary:
      'Start with the material you already have: coursework, part-time jobs, volunteering, projects, and activities. Cvarchitect turns those details into a job-specific first resume, scores the match against the posting, and rewrites weak bullets without inventing experience.',
    bestFor: 'First-time writers who want a guided first draft and a job-specific rewrite',
    whyItWorks:
      'Cvarchitect asks for evidence before it writes. That matters when you have no formal job history, because the hard part is deciding what counts as experience and how to describe it.',
    watchOut:
      'Cvarchitect is our product. The free plan includes one resume analysis, so use it on the job you care about most.',
  },
  {
    award: 'Best for design-led students',
    name: 'Kickresume',
    slug: 'kickresume',
    href: '/compare/kickresume',
    summary:
      'A design-first builder with student-friendly templates, examples, and a matching cover letter builder. The free plan includes four resume templates and four cover letter templates with unlimited downloads, which is useful if you want to test the visual style before paying.',
    bestFor: 'Students and design-led fields where the resume should look distinctive',
    whyItWorks:
      'The template library gives you a finished visual starting point, and the matching cover letter designs make the application feel consistent without extra design work.',
    watchOut:
      'The free template set is small. The full library, AI writing, and the ATS checker require Premium.',
  },
  {
    award: 'Best for step-by-step prompts',
    name: 'Zety',
    slug: 'zety',
    href: '/compare/zety',
    summary:
      'A mature guided editor that walks you through each section and flags content issues with a Resume Check. It is a good fit if you want prompts at every step and a detailed audit before you apply.',
    bestFor: 'Writers who want prompts and a content audit rather than a blank editor',
    whyItWorks:
      'The editor removes the blank-page problem. The Resume Check then gives you a second pass on the content, which is useful when you have never had a recruiter review a resume.',
    watchOut:
      'Free accounts can download TXT only. Pro starts with a $1.95 14-day trial and renews at $25.95 every 4 weeks.',
  },
  {
    award: 'Best for applying to many first jobs',
    name: 'Teal',
    slug: 'teal',
    href: '/compare/teal',
    summary:
      'A job-search workspace that matches keywords, tracks applications, and keeps resume and cover letter versions together. The free plan includes 10 templates, 10 AI credits, and top-5 keyword matching, enough for a small first search.',
    bestFor: 'High-volume first-job and internship searches',
    whyItWorks:
      'You can keep the job post, the tailored resume, the cover letter, and the application status in one place instead of rebuilding the same files for every opening.',
    watchOut:
      'Teal+ is priced weekly or in 30-day and 90-day blocks. Check the total before you start a long search.',
  },
  {
    award: 'Best for browsing examples first',
    name: 'Resume.io',
    slug: 'resume-io',
    href: '/compare/resume-io',
    summary:
      'A large library of job-specific resume examples and a guided editor. Use it to see how a first resume is structured, then decide whether the subscription is worth it for PDF export.',
    bestFor: 'Example-led writers who want to see a finished sample before they start',
    whyItWorks:
      'The examples are the strongest part of the product. They show how real candidates present education, projects, and entry-level work, which can make the first draft less abstract.',
    watchOut:
      'This is an examples pick, not the first-time-writer winner. The free plan allows one resume and one cover letter with TXT downloads only. PDF export starts with a $2.95 7-day trial that renews at $29.95 every 4 weeks.',
  },
];

export const FIRST_RESUME_SECTIONS: FirstResumeSection[] = [
  {
    id: 'contact',
    title: 'Contact block',
    description:
      'Your contact block is not the place for a full mailing address or an old email address. Make it easy for a recruiter to reply and find your work.',
    image: '/images/Student/Contact.png',
    imageAlt: 'Example resume contact block with a name, city, phone number, and professional email address',
    imageCaption:
      'A clean contact block: name, city, phone number, and one professional email address.',
    aspect: '1460 / 175',
    bullets: [
      'Use a phone number you answer and a professional email address.',
      'Add LinkedIn or a portfolio only if the link is current and relevant.',
      'Skip the full street address. City and region are enough for most applications.',
    ],
  },
  {
    id: 'education',
    title: 'Education',
    description:
      'If you are a student or a recent graduate, education can lead the resume. It gives the reader the context for your projects and coursework.',
    image: '/images/Student/Education.png',
    imageAlt: 'Example resume education section with degree names, school names, graduation years, and relevant coursework',
    imageCaption:
      'Education can lead a first resume. Include the degree, school, graduation date, and coursework that matches the job.',
    aspect: '3955 / 765',
    bullets: [
      'Include the degree, school, graduation date, and relevant coursework.',
      'Add GPA only if it is strong or the job post asks for it.',
      'List awards, scholarships, or academic honors only when they are meaningful.',
    ],
  },
  {
    id: 'experience',
    title: 'Experience from any paid work',
    description:
      'Part-time jobs, seasonal work, retail, food service, delivery, and tutoring all count. The goal is not to make the job sound impressive. The goal is to show how you worked.',
    image: '/images/Student/Experience.png',
    imageAlt: 'Example resume experience section with a writer role, recreation assistant role, and retail team member role',
    imageCaption:
      'Unrelated jobs still show reliability, customer service, training, and time management.',
    aspect: '3955 / 1580',
    bullets: [
      'Use the job title, employer, location, dates, and two or three bullets.',
      'Focus on transferable work: customers, deadlines, cash handling, training, and reliability.',
      'Name the tools or systems you used if they are relevant to the target job.',
    ],
  },
  {
    id: 'projects',
    title: 'Projects and coursework',
    description:
      'A class project can be stronger than a generic job description because it shows what you built, the tools you used, and the result. Treat it like experience.',
    image: '/images/Student/Project.png',
    imageAlt: 'Example resume projects section with a named project, project description, and three achievement bullets',
    imageCaption:
      'A project entry can carry a first resume when the work is specific and the result is clear.',
    aspect: '3955 / 535',
    bullets: [
      'Use one to three class, personal, or freelance projects.',
      'Name the project, the tools, and the outcome.',
      'Link to a live demo, GitHub repository, or portfolio when you have one.',
    ],
  },
  {
    id: 'leadership',
    title: 'Leadership and activities',
    description:
      'Clubs, sports, volunteering, student government, and community work show initiative. They are especially useful when paid experience is thin.',
    image: '/images/Student/LEADERSHIP.png',
    imageAlt: 'Example resume leadership section with role titles, organization names, dates, and achievement bullets',
    imageCaption:
      'Leadership does not need a formal title. It needs a role, an action, and a result.',
    aspect: '1460 / 670',
    bullets: [
      'Include the role, organization, dates, and one measurable result.',
      'Keep the section short if it is not relevant to the target job.',
      'Use the same bullet style you use in the experience section.',
    ],
  },
  {
    id: 'skills',
    title: 'Skills',
    description:
      'A first resume should show both technical and human skills. The strongest list is short, specific, and easy to defend in an interview.',
    image: '/images/Student/Skills.png',
    imageAlt: 'Example resume skills section grouped into software proficiency, other skills, and creative and technical skills',
    imageCaption:
      'Group skills so a recruiter can scan them. Only list tools you can discuss in an interview.',
    aspect: '3955 / 635',
    bullets: [
      'Split technical skills and human skills when the list is long.',
      'Mirror the job post language when it is honest.',
      'Remove generic phrases such as hardworking or team player unless you prove them elsewhere.',
    ],
  },
];

export const FIRST_RESUME_BULLET_EXAMPLES: BulletExample[] = [
  {
    before: 'Responsible for social media for a campus club.',
    after:
      'Created 12 posts for a campus club and grew Instagram followers from 180 to 420 in eight weeks.',
    source: 'Club leadership',
  },
  {
    before: 'Worked as a cashier.',
    after:
      'Processed 80+ transactions per shift, balanced a $2,000 register, and trained two new hires.',
    source: 'Part-time retail',
  },
  {
    before: 'Helped with a charity event.',
    after:
      'Coordinated check-in for a 200-person charity event with four volunteers and cut average wait time by 15 minutes.',
    source: 'Volunteering',
  },
  {
    before: 'Did a marketing class project.',
    after:
      'Built a five-page marketing plan for a local bakery and presented it to 30 classmates and two business owners.',
    source: 'Coursework',
  },
  {
    before: 'Managed a student club.',
    after:
      'Recruited 18 members, ran weekly meetings, and increased event attendance by 40% in one semester.',
    source: 'Student club',
  },
  {
    before: 'Good at Excel.',
    after:
      'Built a 12-month budget model in Excel and tracked $25,000 in club spending with zero reconciliation errors.',
    source: 'Skills or project',
  },
  {
    before: 'Babysat for family.',
    after:
      'Managed schedules, meals, and school pickups for three children while completing a full course load.',
    source: 'Caregiving',
  },
  {
    before: 'Delivered food.',
    after:
      'Completed 20+ deliveries per week with a 98% on-time rate and a 4.9 customer rating.',
    source: 'Gig work',
  },
];

export const FIRST_RESUME_CHECKLIST = [
  'Keep it to one page unless the job post asks for more.',
  'Include your name, phone number, email, city, and one professional link.',
  'Use standard headings: Education, Experience, Projects, and Skills.',
  'Put the most relevant section first. Students can lead with education.',
  'Use reverse chronological order inside each section.',
  'Avoid tables, text boxes, and images in the core text.',
  'Check that the exported PDF has selectable text.',
  'Use keywords from the job post only when they are true.',
  'Start every bullet with an action verb.',
  'Add a number, tool, or concrete result wherever possible.',
  'Remove placeholder phrases and empty template text.',
  'Proofread the dates, punctuation, and file name before you apply.',
];

export const FIRST_RESUME_MISTAKES = [
  {
    mistake: 'Opening with a long summary about being hardworking.',
    fix: 'Use the top third of the page for contact details, education, and your strongest evidence. Keep a summary short or skip it.',
  },
  {
    mistake: 'Listing duties instead of results.',
    fix: 'Turn each duty into action plus result. "Handled returns" becomes "Resolved 30+ returns per shift and tracked refunds in the register system."',
  },
  {
    mistake: 'Using a decorative template that breaks parsing.',
    fix: 'Choose a single-column layout with standard headings. Test the PDF by selecting and copying the text.',
  },
  {
    mistake: 'Hiding education at the bottom for a student.',
    fix: 'Lead with education when you are still in school or recently graduated. Move it down only when work experience is stronger.',
  },
  {
    mistake: 'Adding a photo for a US or Canada application.',
    fix: 'Leave the photo off unless the employer or country specifically asks for one.',
  },
  {
    mistake: 'Copying the job post word for word.',
    fix: 'Use the same terms where they are true, then add your own evidence. Recruiters can spot a pasted description.',
  },
  {
    mistake: 'Sending the same resume to every job.',
    fix: 'Change the order of sections, the skills list, and two or three bullets for each role. Keep a master version.',
  },
  {
    mistake: 'Paying before checking the free export.',
    fix: 'Confirm the free plan allows the file type you need. Some free plans export TXT only or add a trial that renews.',
  },
];

export const FIRST_RESUME_WEEK_PLAN: WeekPlanDay[] = [
  {
    day: 'Day 1',
    title: 'Collect evidence',
    detail:
      'List every course project, part-time job, volunteer role, club, competition, certification, and side project. Write one sentence about what you did and one result for each.',
    output: 'A raw evidence list with at least 10 items.',
  },
  {
    day: 'Day 2',
    title: 'Pick 10 job posts',
    detail:
      'Choose roles you would actually apply to. Pull the repeated skills, tools, and phrases from the posts. Mark the terms you can honestly support.',
    output: 'A keyword shortlist and three target roles.',
  },
  {
    day: 'Day 3',
    title: 'Build the first draft',
    detail:
      'Create the contact block, education, experience, projects, and skills sections. Use a simple layout and leave the summary until the end.',
    output: 'A complete one-page draft with no empty sections.',
  },
  {
    day: 'Day 4',
    title: 'Rewrite the bullets',
    detail:
      'Use action verb plus what you did plus result. Replace duties with outcomes, numbers, tools, and scope. Cut any bullet that does not help the target role.',
    output: 'Two or three strong bullets for every entry.',
  },
  {
    day: 'Day 5',
    title: 'Trim and format',
    detail:
      'Remove repeated skills, old coursework, and anything that does not support the target job. Check spacing, dates, headings, and one-page length.',
    output: 'A clean one-page resume that is easy to scan.',
  },
  {
    day: 'Day 6',
    title: 'Run the ATS check',
    detail:
      'Score the resume against one job post. Fix missing keywords, unclear headings, and formatting issues. Do not add a skill you cannot discuss.',
    output: 'A tailored version with a cleaner match score.',
  },
  {
    day: 'Day 7',
    title: 'Proofread and apply',
    detail:
      'Read the resume aloud, check the file name, export a PDF, and submit. Save the exact version you sent so you can reuse it later.',
    output: 'One application sent with a tracked file name.',
  },
];

export const FIRST_TIME_FAQS = [
  {
    q: 'What is the best resume builder for first-time writers in 2026?',
    a: 'Cvarchitect is the strongest pick when you want a guided first draft that turns coursework, part-time jobs, projects, and volunteering into a job-specific resume. Kickresume is best for design-led students, Zety for step-by-step prompts, Teal for applying to many roles, and Resume.io for browsing examples before you start.',
  },
  {
    q: 'Can I write a resume with no work experience?',
    a: 'Yes. A first resume can lead with education, coursework, projects, volunteering, clubs, competitions, certifications, and caregiving. The key is to describe what you did, the tools you used, and the result. Unpaid work still counts if it shows relevant skills.',
  },
  {
    q: 'Should a first resume be one page?',
    a: 'Yes, one page is the right default for a student, recent graduate, or first-time applicant. A second page is only justified when you have several relevant internships, publications, or projects. Recruiters spend a short time on the first pass, so make the most relevant evidence easy to find.',
  },
  {
    q: 'What order should a first resume use?',
    a: 'Students and recent graduates should usually put education first, then experience, projects, skills, and leadership. If you have a strong internship or part-time job that matches the target role, move experience above education. The most relevant evidence should appear in the top half of the page.',
  },
  {
    q: 'Do I need a summary on my first resume?',
    a: 'A summary is optional. If you use one, keep it to two or three lines and make it specific to the role. A generic statement about being hardworking adds little. A line such as "Marketing graduate with a social media campaign project and two years of retail customer service" gives the reader context.',
  },
  {
    q: 'How do I list coursework and projects?',
    a: 'Create a Projects section and treat each project like a short experience entry. Include the project name, the tools, the dates, and two or three bullets with a result. If the project was part of a course, say so. Link to a live demo, repository, or portfolio when you have one.',
  },
  {
    q: 'What if my only experience is a part-time job?',
    a: 'That still counts. A part-time job shows reliability, customer service, cash handling, training, and time management. Use the job title, employer, dates, and two or three bullets that describe the scope and result. Do not apologize for the job. Translate it into transferable evidence.',
  },
  {
    q: 'Do first-time resumes need to pass ATS?',
    a: 'Many applications are screened by an applicant tracking system, so a clean, parsable layout matters. Use standard headings, one column, selectable text, and the job post language where it is honest. An ATS score is a guide, not a guarantee, and a human still decides whether to interview you.',
  },
  {
    q: 'Is a free plan enough to write a first resume?',
    a: 'It can be, but check the export. Some free plans limit downloads to TXT or add a watermark. Cvarchitect includes one resume analysis, 10 AI rewrites, and 3 PDF exports on the free plan. Kickresume allows unlimited downloads with four free templates. Zety and Resume.io limit free downloads to TXT.',
  },
  {
    q: 'Should I use a template or start from scratch?',
    a: 'Start with a simple template if you are unsure about structure, then edit the content until it sounds like you. A template helps with spacing and section order. It should not replace the work of choosing evidence, writing bullets, and tailoring the resume to the job.',
  },
  {
    q: 'How do I explain a gap or no experience?',
    a: 'Do not over-explain in the resume. Use the space for projects, coursework, volunteering, caregiving, or freelance work that shows relevant skills. In the cover letter or interview, give a short, direct explanation and move quickly to what you can do now. A gap is not a reason to leave the page empty.',
  },
];
