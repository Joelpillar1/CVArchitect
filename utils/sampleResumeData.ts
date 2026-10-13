import { ResumeData, TemplateType } from '../types';

export const SAMPLE_RESUME_DATA: ResumeData = {
    fullName: "SARAH JENKINS",
    jobTitle: "SENIOR PRODUCT MANAGER",
    email: "s.jenkins@example.com",
    phone: "+1 (415) 555-0198",
    atHandle: "",
    linkedin: "linkedin.com/in/sjenkins",
    location: "San Francisco, CA",
    address: "",
    summary: "Senior Product Manager specializing in enterprise SaaS platforms and scalable product architecture, with 8+ years leading cross-functional teams from conception through go-to-market. Demonstrated success increasing user engagement, driving multi-million dollar revenue growth, and orchestrating high-velocity agile delivery.",
    experience: [
        {
            id: '1',
            company: 'TechFlow Solutions',
            role: 'Senior Product Manager',
            location: 'San Francisco, CA',
            startDate: '2021-03',
            endDate: 'Present',
            description: [
                'Spearheaded the design and deployment of an enterprise AI-powered analytics dashboard, increasing quarterly user retention by 35% and cutting report generation latency by 4.2x across 12,000 active daily users.',
                'Directed a cross-functional agile squad of 14 senior engineers and product designers, establishing continuous delivery pipelines to roll out mission-critical platform enhancements on a bi-weekly release cadence.',
                'Accelerated annual recurring revenue (ARR) for the primary enterprise SaaS suite by $4.2M through multi-tier pricing restructuring, automated upsell flows, and strategic enterprise API integrations.',
                'Conducted over 120 qualitative customer interviews and quantitative telemetry cohort analyses, championing roadmap enhancements that reduced enterprise account logo churn from 4.8% to 1.6% YoY.'
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
                'Orchestrated the end-to-end product architecture and migration roadmap for a secure data pipeline tool serving Fortune 500 clients, generating $2.1M in first-year ARR with zero data compliance breaches.',
                'Partnered with enterprise sales and customer engineering to architect bespoke demonstration sandboxes, lifting enterprise prospective contract conversion rates from 22% to 41% across Global 2000 prospects.',
                'Authored comprehensive technical requirements and sprint epics for automated schema migration tools, reducing average customer engineering turnaround times by 28% across 14 consecutive agile sprint cycles.',
                'Designed and executed multi-variate A/B onboarding experiments across 85,000 trial accounts, boosting 14-day product activation rates by 42% and generating over $680K in self-serve expansion pipeline.'
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
        header: 18,
        jobTitle: 11,
        sectionTitle: 11,
        body: 8,
    },
    lineHeight: 1.5,
    sectionGap: 0.1,
    headerGap: 0.08,
    headerItemGap: 0.04,
    headerContactGap: 0.04,
    margins: {
        horizontal: 25 / 96,
        vertical: 25 / 96,
    },
    currentTag: 'blog-sample',
    language: 'en',
    accentColor: '#000000',
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

/** Polished resume content for template gallery thumbnails and quick-view modals */
export const TEMPLATE_GALLERY_PREVIEW_DATA: ResumeData = {
    ...SAMPLE_RESUME_DATA,
    currentTag: '',
    projects: [
        {
            id: '1',
            name: 'Customer Insights Platform',
            description: 'Led cross-functional delivery of an analytics platform adopted by 12 enterprise clients within six months of launch.',
            technologies: 'React, Node.js, PostgreSQL, Tableau',
            link: 'github.com/sjenkins/insights'
        }
    ],
    leadership: [
        {
            id: '1',
            company: 'Product Management Association',
            role: 'Chapter President',
            location: 'San Francisco, CA',
            startDate: '2022-01',
            endDate: 'Present',
            description: [
                'Organized monthly workshops for 150+ product professionals on roadmap planning and stakeholder management.',
                'Secured $8,000 in sponsorships for the annual product leadership summit.'
            ]
        }
    ],
    additionalInfo: [
        {
            id: '1',
            label: 'Languages',
            value: 'English (Native), French (Professional)'
        }
    ],
    sectionOrder: [
        'summary',
        'skills',
        'achievements',
        'experience',
        'leadership',
        'projects',
        'education',
        'certifications',
        'additionalInfo'
    ],
};

const STUDENT_TEMPLATE_IDS: TemplateType[] = [
    'student',
    'free',
    'freshgrad1',
    'freshgrad2',
    'freshgrad3',
    'freshgrad4',
    'freshgrad5',
    'freshgrad6',
    'freshgrad7',
    'freshgrad8',
];

/**
 * Jake Template preview — the gallery resume plus the entries from the source
 * Jake Ryan resume this template clones: a third experience (IT Support
 * Specialist @ Southwestern University) and two more projects (Gitytics,
 * Simple Paintball) with three bullets each. Leadership is not part of the
 * source document, so it is dropped here (the template also hides it by
 * default for any data).
 */
export const JAKE_TEMPLATE_PREVIEW_DATA: ResumeData = {
    ...TEMPLATE_GALLERY_PREVIEW_DATA,
    experience: [
        ...TEMPLATE_GALLERY_PREVIEW_DATA.experience,
        {
            id: 'jake-exp-1',
            company: 'Southwestern University',
            role: 'Information Technology Support Specialist',
            location: 'Georgetown, TX',
            startDate: '2018-09',
            endDate: 'Present',
            description: [
                'Communicated with clients on-site and remotely to efficiently and thoroughly resolve 10+ computer software and hardware related issues per day.',
                'Led multiple workshops and presentations for groups of 30+ students and faculty on new and existing software.',
                'Maintained 5+ Windows and Linux systems through Debian-based package management.',
            ]
        }
    ],
    projects: [
        ...TEMPLATE_GALLERY_PREVIEW_DATA.projects,
        {
            id: 'jake-proj-1',
            name: 'Gitytics',
            description: 'Developed a full-stack web application using Flask and Plotly.js to visualize Austin, TX real-estate data.\nDeployed website on AWS EC2 and managed full stack through Linux terminal.\nCreated database architecture to efficiently retrieve and join data from 300,000+ census entries.',
            technologies: 'Python, Flask, PostgreSQL, Docker, Plotly.js',
            date: 'July 2023',
        },
        {
            id: 'jake-proj-2',
            name: 'Simple Paintball',
            description: 'Deployed website on shared Linux web server and managed all files through FTP protocol.\nDesigned database architecture using MySQL to efficiently store and retrieve user data.\nEngineered front-end with HTML, CSS, and Bootstrap based on wireframe mockups.',
            technologies: 'HTML, CSS, Bootstrap, PHP, MySQL',
            date: 'Nov. 2021',
        },
    ],
    leadership: [],
    sectionOrder: TEMPLATE_GALLERY_PREVIEW_DATA.sectionOrder.filter((s) => s !== 'leadership'),
};

/**
 * Analyst Template preview — a clean Data & BI Analyst resume:
 * centered ALL CAPS name, pipe contact line, Professional Summary with inline
 * bold, labeled Core Skills rows, Professional Experience with nested
 * "Key Projects :-" sub-entries, compact Education rows and Certification rows.
 * Bold phrases in the source are preserved as <strong> inline markup.
 */
export const GAURAV_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alex Rivera",
    jobTitle: "",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 432-8910",
    atHandle: "",
    github: "github.com/alexrivera-data",
    linkedin: "linkedin.com/in/alex-rivera-data",
    portfolio: "alexrivera.dev",
    location: "",
    address: "",
    summary: "Data Analyst with 4+ years of experience turning complex, multi-source datasets into <strong>decision-ready business insights</strong> using <strong>SQL, Python, Power BI, and Tableau</strong>. Experienced in analyzing <strong>customer records, e-commerce transactions, financial portfolios, and supply chain operations</strong> to uncover performance trends, unit economics, and growth opportunities. Skilled in <strong>KPI design, cohort & root-cause analysis, ETL automation, and cloud data warehouses</strong>, with hands-on experience deploying <strong>AI-assisted analytical workflows</strong> that accelerate reporting delivery and data quality.",
    experience: [
        {
            id: 'analyst-exp-1',
            company: 'Apex Commerce Global',
            role: 'Senior Data Analyst',
            location: 'New York, NY',
            startDate: '2023-08',
            endDate: 'Present',
            description: [
                'Delivered <strong>SQL, Power BI, and Python</strong> analytics across multi-source enterprise datasets, producing actionable executive reports that contributed to a <strong>28% increase</strong> in operational efficiency and retention.',
                'Engineered and maintained a <strong>Python/PySpark ETL pipeline</strong> on <strong>Snowflake and AWS</strong>, integrating <strong>12+ source systems</strong> and reducing query latency by <strong>65%</strong>, while saving over <strong>14 hours/week</strong> of manual data reconciliation.',
                'Strengthened <strong>transaction anomaly detection</strong> by transforming raw streaming events into real-time KPI monitors, contributing to a <strong>75% reduction</strong> in manual audit cycles.',
                'Conducted <strong>cohort analysis, customer lifetime value (LTV) modeling, and churn diagnostics</strong>, enabling stakeholders to proactively address key revenue risk drivers.',
                'Designed an <strong>automated data-cleansing workflow (Python + LLM APIs)</strong> that standardized product master data into structured schemas, drastically improving downstream data integrity.',
            ],
            projects: [
                {
                    id: 'analyst-exp-1-p1',
                    name: 'Automated Revenue & Churn Intelligence Engine',
                    technologies: 'Python, SQL, Snowflake, Power BI, FastAPI',
                    link: 'github.com/alexrivera-data/revenue-intelligence',
                    description: 'Built an automated reporting engine connecting SQL data warehouses to live business dashboards, enabling automated metric anomaly alerts and natural-language query exploration.\nDesigned a metadata schema layer for automated SQL generation, reducing ad hoc analysis turnaround by <strong>70%</strong>.\nStructured the complete analytics pipeline from raw ingestion to automated executive briefings.',
                },
                {
                    id: 'analyst-exp-1-p2',
                    name: 'Enterprise Financial KPI & Cash Flow Dashboard',
                    technologies: 'Power BI, DAX, PostgreSQL',
                    link: 'github.com/alexrivera-data/financial-kpi-dashboard',
                    description: 'Built an interactive Power BI dashboard analyzing <strong>$25M+</strong> in operational expenditures, payroll, and departmental budgets.\nEngineered variance waterfalls, spend category forecasts, and executive drill-down views for quarterly financial planning.',
                },
            ],
        },
        {
            id: 'analyst-exp-2',
            company: 'MetricStream Solutions',
            role: 'Data Analyst',
            location: 'Boston, MA',
            startDate: '2021-06',
            endDate: '2023-07',
            description: [
                'Built cross-functional Power BI and Tableau dashboards tracking engagement and revenue metrics for <strong>250K+ active users</strong>, directly informing product and marketing roadmaps.',
                'Architected robust <strong>Python/SQL ETL workflows</strong> consolidating marketing attribution data across ad networks, eliminating duplicate records and ensuring 99.8% reporting accuracy.',
            ],
            projects: [
                {
                    id: 'analyst-exp-2-p1',
                    name: 'Multi-Touch Marketing Attribution Model',
                    technologies: 'Python, Pandas, NumPy, Tableau, SQL',
                    link: 'github.com/alexrivera-data/attribution-analysis',
                    description: 'Transformed raw multi-channel campaign clickstreams into clean attribution datasets; engineered CAC, ROAS, and conversion funnel KPIs to optimize ad spend across channels.\nIdentified top-performing regional segments and advised marketing leadership on reallocation that lifted conversion rates by <strong>22%</strong>.',
                },
            ],
        },
        {
            id: 'analyst-exp-3',
            company: 'Beacon Financial Group',
            role: 'Junior Analytics Specialist',
            location: 'Boston, MA',
            startDate: '2019-09',
            endDate: '2021-05',
            description: [
                'Automated weekly operational reporting in SQL and Excel, auditing portfolio metrics, client statements, and regulatory compliance records with 99.9% accuracy.',
            ],
        },
    ],
    education: [
        {
            id: 'analyst-edu-1',
            school: 'Boston University',
            degree: 'M.S. in Data Analytics',
            year: '2021',
            gpa: 'GPA: 3.8 / 4.0',
        },
        {
            id: 'analyst-edu-2',
            school: 'University of Massachusetts Amherst',
            degree: 'B.S. in Mathematics & Statistics',
            year: '2019',
            gpa: 'GPA: 3.7 / 4.0',
        },
    ],
    skills: "Languages & Querying: SQL, Python, PySpark, PostgreSQL, MySQL, Snowflake, T-SQL\nBI & Visualization: Power BI, DAX, Tableau, Looker, Advanced Excel, Google Sheets\nData Analysis: Exploratory Data Analysis (EDA), KPI Design, Cohort Analysis, A/B Testing, Trend Analysis, Root-Cause Analysis\nCloud & Data Engineering: AWS, Azure Data Factory, Snowflake, dbt, Apache Airflow, ETL Pipelines\nAI & Automation: OpenAI APIs, Prompt Engineering, Automation Scripts, Data Quality Validation\nLibraries: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn",
    certifications: [
        {
            id: 'analyst-cert-1',
            name: 'Microsoft Certified: Power BI Data Analyst Associate',
            issuer: 'Microsoft',
            date: '2023',
            link: '',
        },
        {
            id: 'analyst-cert-2',
            name: 'AWS Certified Data Analytics – Specialty',
            issuer: 'Amazon Web Services',
            date: '2022',
            link: '',
        },
    ],
    projects: [],
    leadership: [],
    additionalInfo: [],
    keyAchievements: [],
    jobDescription: "",
    referee: '',
    font: 'Times New Roman',
    fontSizes: {
        header: 22,
        jobTitle: 11,
        sectionTitle: 11,
        body: 9.5,
    },
    lineHeight: 1.35,
    sectionGap: 0.1,
    headerGap: 0.12,
    headerItemGap: 0.04,
    headerContactGap: 0.04,
    margins: {
        horizontal: 0.6,
        vertical: 0.5,
    },
    currentTag: '',
    language: 'en',
    accentColor: '#000000',
    headerAlignment: 'center',
    headerCase: 'uppercase',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    skillsColumnCount: 3,
    // Headers render exactly as authored: the source mixes ALL CAPS section
    // titles with a Title Case "Certification", so no casing is forced.
    sectionTitles: {
        summary: 'PROFESSIONAL SUMMARY',
        skills: 'CORE SKILLS',
        experience: 'PROFESSIONAL EXPERIENCE',
        education: 'EDUCATION',
        certifications: 'Certification',
    },
    sectionOrder: [
        'summary',
        'skills',
        'experience',
        'education',
        'certifications',
    ],
    source: 'scratch',
    hasJobMatchRun: false,
};

export function getTemplatePreviewData(templateId: TemplateType): ResumeData {
    if (templateId === 'rezi') {
        return { ...HARVARD_RESUME_DATA, currentTag: '' };
    }
    if (templateId === 'jake') {
        return { ...JAKE_TEMPLATE_PREVIEW_DATA };
    }
    if (templateId === 'gaurav') {
        return { ...GAURAV_TEMPLATE_PREVIEW_DATA };
    }
    if (STUDENT_TEMPLATE_IDS.includes(templateId)) {
        return { ...STUDENT_RESUME_DATA, currentTag: '' };
    }
    return { ...TEMPLATE_GALLERY_PREVIEW_DATA };
};

export const STUDENT_RESUME_DATA: ResumeData = {
    fullName: "DAVID CHEN",
    jobTitle: "",
    email: "david.chen@example.edu",
    phone: "+1 (617) 555-0199",
    atHandle: "",
    linkedin: "linkedin.com/in/davidchentech",
    location: "Boston, MA",
    address: "",
    summary: "Computer Science student specializing in full-stack web development and scalable algorithms. Demonstrated ability to architect technical projects, lead engineering initiatives, and collaborate within cross-functional teams to deliver production-ready code.",
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
        header: 18,
        jobTitle: 11,
        sectionTitle: 11,
        body: 9,
    },
    lineHeight: 1.5,
    sectionGap: 0.18,
    headerGap: 0.08,
    headerItemGap: 0.04,
    headerContactGap: 0.04,
    margins: {
        horizontal: 25 / 96,
        vertical: 25 / 96,
    },
    currentTag: 'student-blog-sample',
    language: 'en',
    accentColor: '#000000',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    skillsColumnCount: 3,
    sectionOrder: [
        'education',
        'experience',
        'projects',
        'skills',
        'leadership',
        'certifications',
        'summary'
    ],
    source: 'scratch',
    hasJobMatchRun: false,
};

export const HARVARD_RESUME_DATA: ResumeData = {
    fullName: "ALEXANDER WRIGHT",
    jobTitle: "STRATEGIC FINANCE & PRIVATE EQUITY ANALYST",
    email: "a.wright@alumni.harvard.edu",
    phone: "+1 (617) 555-0142",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-wright",
    location: "Boston, MA",
    address: "Boston, MA 02138",
    summary: "Strategic Finance and Private Equity Analyst with expertise in LBO modeling, transaction diligence, and cross-border M&A valuation. Demonstrated track record stress-testing $450M+ in aggregate middle-market deal volume across enterprise technology and healthcare software verticals.",
    education: [
        {
            id: '1',
            school: 'Harvard University',
            degree: 'A.B. in Economics, Secondary in Computer Science. Magna Cum Laude, GPA: 3.92 / 4.00',
            location: 'Cambridge, MA',
            year: 'May 2023',
            relevantCourses: [
                'Thesis: Private Credit Spreads and Capital Structure Optimization in Middle-Market Leveraged Buyouts',
                'Honors & Awards: Phi Beta Kappa, John Harvard Scholar (top 5% of class), Detur Book Prize Winner'
            ],
        },
        {
            id: '2',
            school: 'The London School of Economics and Political Science',
            degree: 'General Course in International Finance & Econometrics (First Class Honours)',
            location: 'London, UK',
            year: '2021 – 2022',
        },
    ],
    experience: [
        {
            id: '1',
            company: 'Bain Capital Private Equity',
            role: 'Private Equity Analyst (Technology & Healthcare Verticals)',
            location: 'Boston, MA',
            startDate: '2023-07',
            endDate: 'Present',
            description: [
                'Built dynamic three-statement operating models and leveraged buyout (LBO) frameworks for 6 platform targets, evaluating capital structure returns and debt repayment schedules across downside cases.',
                'Led commercial due diligence and operational value-creation workstreams for a $380M enterprise SaaS carve-out, analyzing customer retention cohorts and pricing power to identify $18M in margin upside.',
                'Authored comprehensive 40-page investment committee memorandums and presented thesis points directly to managing directors, supporting successful capital deployment for 2 completed platform buyouts.',
                'Partnered with portfolio company executive teams to institute automated working-capital optimization dashboards, releasing $12.4M in idle balance-sheet cash to accelerate strategic M&A integration.'
            ],
        },
        {
            id: '2',
            company: 'Goldman Sachs',
            role: 'Investment Banking Summer Analyst (Technology, Media & Telecom)',
            location: 'New York, NY',
            startDate: '2022-06',
            endDate: '2022-08',
            description: [
                'Engineered detailed discounted cash flow (DCF), trading comparables, and precedent transaction valuation frameworks for technology M&A mandates exceeding $2.4B in aggregate enterprise consideration.',
                'Developed dynamic debt-capacity and credit-amortization schedules in Excel, reducing pitchbook compilation turnaround times by 35% across the technology, media, and telecom coverage division.',
                'Conducted extensive target screening across 65 prospective software targets in North America, analyzing ARR growth velocity, gross margins, and customer acquisition payback to advise senior bankers.',
                'Managed virtual data room (VDR) logistics and confirmatory diligence requests across legal, accounting, and tax advisory teams during intensive execution for a $720M cross-border corporate divestiture.'
            ],
        },
    ],
    leadership: [
        {
            id: '1',
            company: 'Harvard Financial Analysts Club',
            role: 'Portfolio Director & Head of Quantitative Research',
            location: 'Cambridge, MA',
            startDate: '2021-09',
            endDate: '2023-05',
            description: [
                'Directed a 35-analyst quantitative research cohort managing a $120K student-run endowment portfolio, outperforming benchmark S&P 500 returns by 480 basis points over a trailing 24-month horizon.',
                'Designed and taught weekly modeling workshops on three-statement accounting, LBO mechanics, and corporate valuation for 120+ undergraduate candidates preparing for top-tier Wall Street recruitment.'
            ],
        },
    ],
    skills: "Financial Modeling: Advanced LBO Modeling, Three-Statement Projections, DCF Valuation, M&A Consequence Analysis, Sensitivity Tables\nAnalytical Software: Capital IQ, FactSet, Bloomberg Terminal, Advanced Excel (VBA), PitchBook, Python (Pandas), SQL\nDomain Expertise: Leveraged Buyouts, Commercial Diligence, Capital Structure Optimization, Unit Economics Diagnostics\nCertifications & Honors: Wall Street Prep Certified in Financial Modeling, Series 79 & 63 Exam Ready, CFA Level 1 Candidate",
    projects: [],
    certifications: [],
    additionalInfo: [],
    keyAchievements: [],
    jobDescription: '',
    referee: '',
    font: 'Merriweather, serif',
    fontSizes: {
        header: 18,
        jobTitle: 11,
        sectionTitle: 11,
        body: 9,
    },
    lineHeight: 1.4,
    sectionGap: 0.16,
    headerGap: 0.08,
    headerItemGap: 0.04,
    headerContactGap: 0.04,
    margins: {
        horizontal: 25 / 96,
        vertical: 25 / 96,
    },
    currentTag: 'harvard-sample',
    language: 'en',
    accentColor: '#2e3d50',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    sectionOrder: [
        'education',
        'experience',
        'leadership',
        'skills',
    ],
    sectionTitles: {
        leadership: 'Leadership & Activities',
        skills: 'Skills & Interests',
    },
    source: 'scratch',
    hasJobMatchRun: false,
};
