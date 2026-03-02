import { ResumeData } from '../types';

export const SAMPLE_RESUME_DATA: ResumeData = {
    fullName: "SARAH JENKINS",
    jobTitle: "SENIOR PRODUCT MANAGER",
    email: "s.jenkins@example.com",
    phone: "+1 (415) 555-0198",
    atHandle: "",
    linkedin: "linkedin.com/in/sjenkins",
    location: "San Francisco, CA",
    address: "",
    summary: "Results-driven Senior Product Manager with 8+ years of experience leading cross-functional teams to deliver scalable enterprise software solutions. Proven track record of increasing user engagement, driving multi-million dollar revenue growth, and launching successful B2B SaaS products from conception through go-to-market. Adept at agile methodologies, user-centered design, and data-driven product strategy.",
    experience: [
        {
            id: '1',
            company: 'TechFlow Solutions',
            role: 'Senior Product Manager',
            location: 'San Francisco, CA',
            startDate: '2021-03',
            endDate: 'Present',
            description: [
                'Spearheaded the development and launch of an AI-powered analytics dashboard, increasing user retention by 35% within the first two quarters.',
                'Led a cross-functional team of 14 engineers, designers, and marketers in an Agile environment to deliver product updates on a bi-weekly cadence.',
                'Grew annual recurring revenue (ARR) for the primary SaaS product line by $4.2M through strategic pricing optimization and feature expansion.',
                'Conducted over 100+ user interviews to identify pain points, resulting in a roadmap pivot that reduced customer churn by 18%.'
            ]
        },
        {
            id: '2',
            company: 'DataStream Inc.',
            role: 'Product Manager',
            location: 'San Jose, CA',
            startDate: '2017-06',
            endDate: '2021-02',
            description: [
                'Managed the end-to-end product lifecycle for a secure data migration tool used by Fortune 500 clients, generating $2.1M in first-year revenue.',
                'Collaborated with sales and customer success teams to create targeted messaging, improving trial-to-paid conversion rates by 22%.',
                'Prioritized the product backlog and authored detailed technical specifications, reducing development time by 15% across sprints.',
                'Implemented rigorous A/B testing protocols for onboarding flows, lifting successful user activations by 40%.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            school: 'University of California, Berkeley',
            degree: 'Master of Business Administration (MBA)',
            year: '2017'
        },
        {
            id: '2',
            school: 'University of Washington',
            degree: 'Bachelor of Science in Computer Science',
            year: '2013'
        }
    ],
    skills: "Product Strategy, Agile / Scrum Methodology, Roadmap Planning, Go-to-Market Strategy, Data Analysis (SQL), A/B Testing, User Research, UI/UX Design Principles, Cross-functional Leadership",
    certifications: [
        {
            id: '1',
            name: 'Certified Scrum Product Owner (CSPO)',
            issuer: 'Scrum Alliance',
            date: '2019',
            link: ''
        },
        {
            id: '2',
            name: 'Pragmatic Certified Product Manager',
            issuer: 'Pragmatic Institute',
            date: '2020',
            link: ''
        }
    ],
    projects: [],
    leadership: [],
    additionalInfo: [],
    keyAchievements: [
        "President's Club Award Winner 2022 & 2023 for consistently exceeding global ARR targets by over 140% during challenging economic downturns, outperforming 50+ sales and product peers across the entire North American division.",
        "Directed the end-to-end launch of 3 major B2B SaaS products, driving widespread enterprise adoption and generating $8.4M in new annual recurring revenue within the first 12 months of release.",
        "Successfully reduced core customer churn by 18% month-over-month by initiating strategic UX roadmap pivots, overhauling the onboarding experience, and personally conducting over 200 targeted user interviews."
    ],
    jobDescription: "",
    referee: "Available upon request",
    font: 'Inter, sans-serif',
    fontSizes: {
        header: 22,
        jobTitle: 12,
        sectionTitle: 14,
        body: 10,
    },
    lineHeight: 1.5,
    sectionGap: 0.18,
    headerGap: 0.20,
    headerItemGap: 0.10,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
    },
    currentTag: 'blog-sample',
    language: 'en',
    accentColor: '#0f172a',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    skillsColumnCount: 3,
    sectionOrder: [
        'summary',
        'skills',
        'achievements',
        'experience',
        'education',
        'certifications'
    ],
    source: 'scratch',
    hasJobMatchRun: false,
};

export const STUDENT_RESUME_DATA: ResumeData = {
    fullName: "DAVID CHEN",
    jobTitle: "SOFTWARE ENGINEERING INTERN",
    email: "david.chen@example.edu",
    phone: "+1 (617) 555-0199",
    atHandle: "",
    linkedin: "linkedin.com/in/davidchentech",
    location: "Boston, MA",
    address: "",
    summary: "Motivated Computer Science student with a strong foundation in full-stack web development and scalable algorithms. Proven ability to architect complex technical projects, lead campus-wide engineering initiatives, and collaborate within cross-functional teams to deliver production-ready code. Seeking to leverage academic excellence and hands-on coding experience to contribute meaningfully to dynamic engineering environments.",
    experience: [
        {
            id: '1',
            company: 'Tech Innovators LLC',
            role: 'Software Engineering Intern',
            location: 'Boston, MA',
            startDate: '2025-05',
            endDate: '2025-08',
            description: [
                'Engineered and deployed comprehensive full-stack product features utilizing React, Node.js, and PostgreSQL, proactively optimizing database queries to improve internal dashboard rendering speeds by over 25%.',
                'Collaborated intimately with senior technical staff in an Agile environment to seamlessly refactor legacy authentication modules, significantly reducing code complexity and bolstering system-wide security architectures.',
                'Authored and maintained rigorous unit and integration test suites utilizing Jest and React Testing Library, successfully contributing to a critical 15% increase in overall enterprise test coverage prior to production release.'
            ]
        },
        {
            id: '2',
            company: 'University IT Services',
            role: 'Technical Support Specialist',
            location: 'Boston, MA',
            startDate: '2024-01',
            endDate: '2025-05',
            description: [
                'Diagnosed and resolved complex hardware and software technical issues for an academic community consisting of over 5,000 university students and faculty members, maintaining an exceptional 98% customer satisfaction rating.',
                'Streamlined campus-wide troubleshooting procedures by authoring extremely detailed internal documentation and comprehensive standard operating procedures, cutting average ticket resolution times by approximately 30%.'
            ]
        },
        {
            id: '3',
            company: 'Boston University Department of Computer Science',
            role: 'Undergraduate Teaching Assistant (Data Structures)',
            location: 'Boston, MA',
            startDate: '2023-09',
            endDate: '2023-12',
            description: [
                'Orchestrated bi-weekly laboratory sessions and personalized office hours for a challenging curriculum involving over 80 undergraduate peers, thoroughly explaining advanced topics including graph algorithms and dynamic programming.',
                'Systematically reviewed, vigorously debugged, and comprehensively graded hundreds of complex C++ programming assignments, delivering highly actionable feedback to cultivate foundational software engineering best practices.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            school: 'Boston University',
            degree: 'Bachelor of Science in Computer Science',
            year: 'Expected May 2027',
            gpa: '3.9/4.0'
        },
        {
            id: '2',
            school: 'Lexington High School',
            degree: 'High School Diploma',
            year: '2023'
        }
    ],
    skills: "JavaScript, TypeScript, React, Node.js, Python, Java, SQL, CI/CD, Git",
    certifications: [
        {
            id: '1',
            name: 'AWS Certified Cloud Practitioner',
            issuer: 'Amazon Web Services',
            date: '2025',
            link: ''
        }
    ],
    projects: [
        {
            id: '1',
            name: 'Campus RideShare Application',
            description: 'Architected and deployed a full-stack mobile application using React Native and Firebase to securely connect over 1,500 university students for verified carpooling.\nImplemented real-time geolocation tracking and a secure authentication flow leveraging university email verification, resulting in a 40% reduction in average commute costs.',
            technologies: 'React Native, Node.js, Firebase, Google Maps API',
            link: 'github.com/davidc/campus-rides'
        },
        {
            id: '2',
            name: 'Algorithmic Trading Bot',
            description: 'Developed a high-frequency trading simulation engine in Python that analyzes historical tech stock data using moving average crossover strategies to execute automated trades.\nOptimized data processing pipelines utilizing Pandas and NumPy, reducing backtesting execution time by over 60% compared to previous sequential models.',
            technologies: 'Python, Pandas, NumPy, Alpaca API',
            link: 'github.com/davidc/trade-bot'
        }
    ],
    leadership: [
        {
            id: '1',
            company: 'University Computer Science Society',
            role: 'Vice President of Engineering',
            location: 'Boston, MA',
            startDate: '2024-09',
            endDate: 'Present',
            description: [
                'Organize and lead bi-weekly technical workshops for 200+ active members, focusing on modern web development frameworks and technical interview preparation.',
                'Directed the planning and execution of the annual campus Hackathon, securing $15,000 in corporate sponsorships and managing logistics for 350+ participants.'
            ]
        }
    ],
    additionalInfo: [],
    keyAchievements: [
        "Led the university Hackathon logistics team, managing $15,000 in sponsorships precisely.",
        "Deployed a ride-share app actively used by 1,500+ verified campus students daily.",
        "Optimized Python data aggregation scripts, decreasing runtime efficiency by over 60%."
    ],
    jobDescription: "",
    referee: "Available upon request",
    font: 'Inter, sans-serif',
    fontSizes: {
        header: 22,
        jobTitle: 12,
        sectionTitle: 14,
        body: 10,
    },
    lineHeight: 1.5,
    sectionGap: 0.18,
    headerGap: 0.20,
    headerItemGap: 0.10,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
    },
    currentTag: 'student-blog-sample',
    language: 'en',
    accentColor: '#1e3a8a',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    skillsColumnCount: 3,
    sectionOrder: [
        'summary',
        'education',
        'experience',
        'skills',
        'projects',
        'leadership',
        'certifications'
    ],
    source: 'scratch',
    hasJobMatchRun: false,
};
