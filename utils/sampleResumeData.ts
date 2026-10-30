import { ResumeData, TemplateType } from '../types';

export const SAMPLE_RESUME_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "SENIOR PRODUCT MANAGER",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
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
    referee: "",
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
    headerItemGap: 0.04,
    headerContactGap: 0.04,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
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
    'intern',
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
    // Source arrangement for the Jake template previews: Education → Experience
    // → Projects → Technical Skills. Keeping the order explicit also keeps the
    // summary, achievements, certifications and additional-info sections out of
    // the preview, matching the template's default composition.
    sectionOrder: ['education', 'experience', 'projects', 'skills'],
};

/**
 * Scholar Template preview — the academic CV this template clones: an
 * education-first arrangement (Education → Skills → Projects → Experience →
 * Certifications & Online Courses), labeled skill-category rows, projects with
 * a right-aligned date range over an italic technology line, experience led by
 * the bold *company* name, and platform-first certification rows. Summary,
 * leadership, achievements and additional info are blank so the preview shows
 * exactly the reference's five sections.
 */
export const SCHOLAR_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    github: "github.com/alexanderwilliams",
    portfolio: "",
    location: "Cincinnati, OH",
    address: "",
    summary: "",
    education: [
        {
            id: 'scholar-edu-1',
            school: 'University of Cincinnati',
            degree: 'Master of Engineering in Artificial Intelligence – Dual Degree Program',
            location: 'Cincinnati, OH, USA',
            year: 'Aug. 2026 – Expected Graduation Aug. 2027',
        },
        {
            id: 'scholar-edu-2',
            school: 'Bordeaux Institute of Technology',
            degree: "Master's Degree in Telecommunications – Dual Degree Program",
            location: 'Bordeaux, France',
            year: 'Aug. 2026 – Expected Oct. 2027',
        },
        {
            id: 'scholar-edu-3',
            school: 'Bordeaux Institute of Technology',
            degree: "Bachelor's Degree Equivalent in Telecommunications",
            location: 'Bordeaux, France',
            year: 'Jun. 2026',
        },
    ],
    skills: [
        'Programming: Python, C/C++, Java, MATLAB, SQL',
        'AI/ML: Machine Learning, Deep Learning, Computer Vision, Natural Language Processing, Large Language Models, Reinforcement Learning',
        'Tools & Frameworks: PyTorch, TensorFlow, Hugging Face Transformers, Scikit-Learn, OpenCV, Pandas, NumPy, Git, CUDA',
        'Languages: French (Native), English (Professional Working Proficiency; IELTS 7.0, C1)',
    ].join('\n'),
    projects: [
        {
            id: 'scholar-proj-1',
            name: 'Soccer Coach RAG Assistant',
            date: 'Jul. 2026 – Present',
            technologies: 'Python, RAG, Ollama, ChromaDB, Sentence Transformers',
            description: 'Developed a local bilingual RAG assistant that answers coaching, drills and tactics questions from a curated football knowledge base.\nBuilt a retrieval pipeline with sentence-transformer embeddings stored in ChromaDB and served through an Ollama LLM backend.',
        },
        {
            id: 'scholar-proj-2',
            name: 'Real-Time Obstacle Detection for AR Robot Teleoperation',
            date: 'Feb. 2026 – May 2026',
            technologies: 'Python, YOLOv11, CUDA, Google Colab, Computer Vision',
            description: 'Trained a YOLOv11 detector for dynamic obstacles, sustaining real-time inference on CUDA-accelerated Colab hardware.\nIntegrated detections into an AR teleoperation overlay that warns operators before collisions.',
        },
        {
            id: 'scholar-proj-3',
            name: 'Skin Lesion Classification',
            date: 'Mar. 2026 – Apr. 2026',
            technologies: 'Python, CNN, ResNet18, Transfer Learning, TensorBoard',
            description: 'Fine-tuned a ResNet18 CNN with transfer learning on dermoscopy images, tracking experiments and confusion matrices in TensorBoard.',
        },
        {
            id: 'scholar-proj-4',
            name: 'Speech Enhancement Through Spectral Subtraction',
            date: 'Nov. 2025 – Dec. 2025',
            technologies: 'MATLAB, Digital Signal Processing, Audio Processing',
            description: 'Implemented spectral-subtraction noise reduction in MATLAB and evaluated SNR improvements on recorded speech samples.',
        },
        {
            id: 'scholar-proj-5',
            name: 'Client-Server Messaging Application',
            date: 'Sep. 2025 – Oct. 2025',
            technologies: 'C, TCP/IP, Sockets, Multiplexing',
            description: 'Engineered a concurrent client-server chat in C using TCP sockets and select() multiplexing to serve multiple clients at once.',
        },
        {
            id: 'scholar-proj-6',
            name: 'Reinforcement Learning for Arcade Games',
            date: 'Jan. 2024 – Jun. 2024',
            technologies: 'Python, Reinforcement Learning, Artificial Intelligence',
            description: 'Implemented tabular and deep reinforcement learning agents that learned control policies for Atari-style arcade games.',
        },
    ],
    experience: [
        {
            id: 'scholar-exp-1',
            company: 'Conseil Départemental de la Haute-Vienne',
            role: 'Network Engineering Intern, IT Department',
            location: 'Limoges, France',
            startDate: '2026-05',
            endDate: '2026-08',
            description: [
                'Evaluated and deployed virtualization hypervisors to host segmented lab environments for network services testing.',
                'Supported DHCP service deployment and IP address plan maintenance across departmental subnets.',
            ],
        },
        {
            id: 'scholar-exp-2',
            company: 'Bordeaux INP Football Team',
            role: 'Head Coach',
            location: 'Bordeaux, France',
            startDate: '2025-09',
            endDate: '2026-05',
            description: [
                'Planned and led weekly training sessions and match-day tactics for a 22-player squad in the university league.',
                'Managed player development plans, opponent scouting and fixture logistics across a full competitive season.',
            ],
        },
    ],
    certifications: [
        {
            id: 'scholar-cert-1',
            issuer: 'Hugging Face',
            name: 'The LLM Course – Large Language Models, Transformers, Natural Language Processing',
            date: '',
        },
        {
            id: 'scholar-cert-2',
            issuer: 'Kaggle',
            name: 'Intermediate Machine Learning; Computer Vision; Deep Learning',
            date: '',
        },
    ],
    additionalInfo: [],
    keyAchievements: [],
    leadership: [],
    languages: [],
    coursework: [],
    referee: "",
    jobDescription: "",
    currentTag: '',
    sectionOrder: ['education', 'skills', 'projects', 'experience', 'certifications'],
    sectionTitles: {
        certifications: 'Certifications & Online Courses',
    },
    accentColor: '#1F3864',
    font: 'Merriweather, serif',
    fontSizes: {
        header: 20,
        jobTitle: 11,
        sectionTitle: 11,
        body: 9.5,
    },
    lineHeight: 1.4,
    source: 'scratch',
    hasJobMatchRun: false,
};

/**
 * Analyst Template preview — a clean Data & BI Analyst resume:
 * centered ALL CAPS name, pipe contact line, Professional Summary with inline
 * bold, labeled Core Skills rows, Professional Experience with nested
 * "Key Projects :-" sub-entries, compact Education rows and Certification rows.
 * Bold phrases in the source are preserved as <strong> inline markup.
 */
export const GAURAV_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    atHandle: "",
    github: "github.com/alexanderwilliams",
    linkedin: "linkedin.com/in/alexander-williams",
    portfolio: "alexanderwilliams.dev",
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
    font: 'Merriweather, serif',
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

/**
 * CareerCraft preview — clean Wisconsin Electrical Engineering student resume:
 * Education with Degree line 1 and School • Location • Date line 2,
 * Experience with Role line 1 and Company on left, Date & Location on right of line 2,
 * Involvement with Role line 1 and School • Club on left, Date on right edge of line 2,
 * Skills with Hardware & EDA, Embedded Systems, and Lab Instrumentation category rows.
 */
export const CAREERCRAFT_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    location: "Madison, WI",
    address: "",
    summary: "",
    education: [
        {
            id: '1',
            degree: 'Bachelor of Science in Electrical Engineering, Focus in Embedded Systems & Circuits',
            school: 'University of Wisconsin–Madison',
            location: 'Madison, WI',
            year: 'Expected May 2026',
            gpa: '3.85/4.0',
        },
        {
            id: '2',
            degree: 'Associate of Science in Engineering Science',
            school: 'Madison College',
            location: 'Madison, WI',
            year: 'August 2023',
        },
    ],
    experience: [
        {
            id: '1',
            role: 'Hardware Engineering Intern',
            company: 'Rockwell Automation',
            location: 'Milwaukee, WI',
            startDate: 'May 2025',
            endDate: 'August 2025',
            description: [
                'Designed and validated 4-layer mixed-signal PCB test fixtures in Altium Designer, reducing bench-testing setup time by 35%',
                'Performed signal integrity and power-rail ripple measurements across prototype microcontroller boards using digital oscilloscopes and spectrum analyzers',
                'Automated regression hardware-in-the-loop (HIL) tests in Python, identifying 12 critical firmware timing faults prior to pilot production release',
            ],
        },
        {
            id: '2',
            role: 'Undergraduate Research Assistant – Power Electronics Lab',
            company: 'WEMPEC Power Electronics Research',
            location: 'Madison, WI',
            startDate: 'September 2024',
            endDate: 'Present',
            description: [
                'Fabricated and tested 48V-to-12V synchronous buck converter prototypes achieving 94.5% peak power conversion efficiency',
                'Modeled dynamic thermal dissipation and transient inductor saturation limits using LTspice and MATLAB/Simulink simulations',
                'Characterized gate driver propagation delays using high-speed oscilloscope probing, informing revised dead-time compensation parameters',
            ],
        },
        {
            id: '3',
            role: 'Electronics Laboratory Technician',
            company: 'UW–Madison Dept. of Electrical & Computer Engineering',
            location: 'Madison, WI',
            startDate: 'January 2024',
            endDate: 'May 2024',
            description: [
                'Maintained and calibrated RF signal generators, digital multimeters, and SMD soldering stations across 120+ student workstations',
                'Assisted student cohorts with SMD rework, schematic verification, and firmware debugging on STM32 ARM Cortex-M development boards',
                'Documented equipment calibration logs and drafted safety procedures adopted as the department standard for lab onboarding',
            ],
        },
    ],
    involvement: [
        {
            id: '1',
            role: 'Electrical Lead & Powertrain Engineer',
            company: 'Wisconsin Formula SAE Racing Team',
            location: 'University of Wisconsin–Madison',
            startDate: 'September 2024',
            endDate: 'Present',
            description: [
                'Directed electrical sub-team of 8 students designing BMS wiring harnesses, low-voltage shutdown circuitry, and motor controller interconnects',
                'Integrated CAN bus telemetry logging module communicating real-time motor temperatures and cell voltages to the driver dashboard display',
                'Reduced wiring harness mass by 18% through routing optimization and selective use of lightweight 20 AWG shielded twisted-pair cabling',
            ],
        },
        {
            id: '2',
            role: 'Vice President & Technical Workshop Coordinator',
            company: 'IEEE Student Branch',
            location: 'University of Wisconsin–Madison',
            startDate: 'October 2023',
            endDate: 'Present',
            description: [
                'Organized hands-on soldering and microcontroller workshops for 90+ engineering undergraduates, teaching schematic capture in KiCad',
                'Spearheaded corporate technical recruitment nights with engineering industry partners, securing $6,000 in annual student project funding',
                'Launched a peer mentorship program pairing 30 first-year EE students with junior and senior mentors for academic and career guidance',
            ],
        },
        {
            id: '3',
            role: 'Associate Member',
            company: 'Capital Management Club',
            location: 'University of Wisconsin–Madison',
            startDate: 'September 2019',
            endDate: 'Present',
            description: [
                'Develop equity research skills through attending training sessions that utilize FactSet software',
                'Learn value and growth-based investing strategies by looking at relevant company multiples',
            ],
        },
        {
            id: '4',
            role: 'Active Member',
            company: 'Badgers with a Heart',
            location: 'University of Wisconsin–Madison',
            startDate: 'October 2018',
            endDate: 'Present',
            description: [
                'Help organize meetings in order to inform members about upcoming events and generate new member ideas for recruitment',
                'Orchestrate events, such as a fundraiser for the Autism Society that raised over $480, to unite the UW community and spread the word about the organization',
            ],
        },
        {
            id: '5',
            role: 'General Member',
            company: 'Madison Business Mentors',
            location: 'University of Wisconsin–Madison',
            startDate: 'September 2018',
            endDate: 'Present',
            description: [
                'Establish connections with graduate students and Madison-area operations technology management professionals as a mentee to receive professional advice and support',
                'Develop understanding of potential careers through presentations and networking events with employers',
            ],
        },
    ],
    skills: "Hardware & EDA Tools: Altium Designer, KiCad, LTspice, EAGLE, MATLAB/Simulink, Cadence Virtuoso\nEmbedded Systems & Firmware: C/C++, Embedded Linux, ARM Cortex-M (STM32), Microchip PIC, I2C, SPI, UART, CAN Bus\nLab Instrumentation: Digital Oscilloscopes, Logic Analyzers, Spectrum Analyzers, SMD Soldering & Rework, Signal Generators",
    certifications: [],
    projects: [],
    additionalInfo: [],
    keyAchievements: [],
    jobDescription: '',
    referee: '',
    font: 'Merriweather, serif',
    fontSizes: {
        header: 18,
        jobTitle: 10.5,
        sectionTitle: 11,
        body: 8.5,
    },
    lineHeight: 1.35,
    sectionGap: 0.16,
    headerGap: 0.05,
    headerItemGap: 0.02,
    headerContactGap: 0.02,
    margins: {
        horizontal: 32 / 96,
        vertical: 30 / 96,
    },
    currentTag: 'careercraft-sample',
    language: 'en',
    accentColor: '#000000',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    sectionOrder: [
        'education',
        'experience',
        'involvement',
        'skills',
    ],
    sectionTitles: {
        education: 'EDUCATION',
        experience: 'EXPERIENCE',
        involvement: 'INVOLVEMENT',
        skills: 'SKILLS',
    },
    source: 'scratch',
    hasJobMatchRun: false,
};

export const INTERN_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    location: "Madison, WI",
    address: "",
    summary: "Computer Science & Engineering student at UW–Madison with hands-on experience in embedded C/C++, Python automation, and full-stack software development. Proven track record validating network infrastructure and building real-time IoT systems, seeking a Summer 2026 Engineering Internship.",
    experience: [
        {
            id: '1',
            role: 'Network Systems & Automation Engineering Intern',
            company: 'Epic Systems',
            location: 'Verona, WI',
            startDate: 'May 2025',
            endDate: 'August 2025',
            description: [
                'Engineered automated Python telemetry pipelines to monitor IP management tables across 14 enterprise data center clusters, reducing network provisioning latency by 32%.',
                'Configured dynamic subnet routing tables and DNS failover rules, ensuring 99.99% network uptime for hospital clinical database replicas.',
                'Collaborated with network infrastructure engineers to validate IPv4-to-IPv6 transition scripts across 2,400 active client endpoints.',
            ],
        },
        {
            id: '2',
            role: 'Software Development & Lab Assistant',
            company: 'UW–Madison Division of Information Technology (DoIT)',
            location: 'Madison, WI',
            startDate: 'September 2024',
            endDate: 'Present',
            description: [
                'Developed and maintained full-stack internal web tools using React, TypeScript, and Node.js for campus IT asset inventory across 40+ engineering labs.',
                'Resolved 180+ tier-2 network connectivity tickets involving VLAN tagging, static IP assignment, and secure 802.1X authentication.',
            ],
        },
        {
            id: '3',
            role: 'STEM Robotics Outreach Coordinator',
            company: 'Wisconsin Engineering Student Council',
            location: 'Madison, WI',
            startDate: 'September 2023',
            endDate: 'May 2024',
            description: [
                'Mentored 80+ high school students during annual Engineering Expo workshops, teaching microcontroller programming and sensor integration.',
                'Designed autonomous line-following obstacle courses and drafted starter firmware libraries in C++ for student competition kits.',
            ],
        },
    ],
    projects: [
        {
            id: '1',
            name: 'Autonomous Mobile Robot with LiDAR Navigation',
            description: [
                'Architected a dual-wheel differential drive robot utilizing STM32 ARM Cortex-M4 microcontroller running FreeRTOS for multi-task motor control.',
                'Integrated 2D LiDAR scanner and wheel quadrature encoders over UART and SPI for real-time obstacle avoidance and indoor 2D SLAM mapping.',
                'Implemented PID velocity control loops achieving sub-2 cm positional repeatability during path-following routines in ROS2.',
                'Designed custom 4-layer power distribution PCB in Altium Designer with onboard 5V/3.3V buck regulators and low-noise sensor signal routing.',
                'Published open-source telemetry dashboard in React and WebSockets displaying live battery status, encoder counts, and LiDAR point clouds.',
            ].join('\n'),
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Bachelor of Science in Computer Engineering & Computer Sciences',
            school: 'University of Wisconsin–Madison',
            location: 'Madison, WI',
            year: 'Expected May 2026',
            gpa: '3.88 / 4.0',
            relevantCourses: "Dean's Honor List (4 semesters)",
        },
    ],
    coursework: [
        {
            id: '1',
            courseName: 'Data Structures & Algorithms, Operating Systems, Computer Architecture',
            institution: 'University of Wisconsin–Madison',
            year: '2024 – 2025',
            skills: 'Computer Systems Track',
            description: [
                'Microprocessor Systems & Interfacing, Embedded Software Design, Database Systems',
            ],
        },
    ],
    skills: "Languages: C/C++, Python, Java, JavaScript/TypeScript, SQL, Verilog, HTML/CSS\nTools & Platforms: Git, Linux, Docker, ROS2, FreeRTOS, Altium Designer, KiCad, MATLAB\nHardware & Protocols: ARM Cortex-M, STM32, Arduino, ESP32, Oscilloscopes, Logic Analyzers, UART, SPI, I2C, CAN Bus",
    leadership: [],
    certifications: [],
    additionalInfo: [],
    keyAchievements: [],
    jobDescription: '',
    referee: '',
    font: 'Merriweather, serif',
    fontSizes: {
        header: 18,
        jobTitle: 10.5,
        sectionTitle: 11,
        body: 8.5,
    },
    lineHeight: 1.34,
    sectionGap: 0.14,
    headerGap: 0.05,
    headerItemGap: 0.02,
    headerContactGap: 0.02,
    margins: {
        horizontal: 32 / 96,
        vertical: 28 / 96,
    },
    showContactIcons: true,
    currentTag: 'intern-sample',
    language: 'en',
    accentColor: '#000000',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    sectionOrder: [
        'summary',
        'experience',
        'projects',
        'education',
        'coursework',
        'skills',
    ],
    sectionTitles: {
        summary: 'SUMMARY',
        experience: 'EXPERIENCE',
        projects: 'PROJECTS',
        education: 'EDUCATION',
        coursework: 'COURSEWORK',
        skills: 'SKILLS',
    },
    source: 'scratch',
    hasJobMatchRun: false,
};

/**
 * Minimalist template preview — Boston University EE student resume using
 * David Chen's name/contacts but with unique content distinct from the
 * CareerCraft (FreeTemplate) and Intern preview datasets.
 */
export const MINIMALIST_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    location: "Boston, MA",
    address: "",
    summary: "",
    education: [
        {
            id: '1',
            degree: 'Bachelor of Science in Electrical Engineering',
            school: 'Boston University',
            location: 'Boston, MA',
            year: 'Expected May 2027',
            gpa: '3.9/4.0',
        },
    ],
    experience: [
        {
            id: '1',
            role: 'Embedded Systems Engineering Intern',
            company: 'Texas Instruments',
            location: 'Dallas, TX',
            startDate: 'May 2026',
            endDate: 'August 2026',
            description: [
                'Developed low-power firmware for Bluetooth Low Energy (BLE) sensor modules on the CC2652R microcontroller, reducing average current draw by 28% through optimized sleep-cycle scheduling.',
                'Created automated Python-based regression test suites validating I2C/SPI communication protocols across 8 development board variants, cutting QA turnaround by 40%.',
                'Authored technical reference documentation for peripheral register configurations adopted by the downstream SDK team for 3 production-ready driver libraries.',
            ],
        },
        {
            id: '2',
            role: 'Hardware Lab Research Assistant – RF & Microwave Systems',
            company: 'Boston University Photonics Center',
            location: 'Boston, MA',
            startDate: 'September 2025',
            endDate: 'Present',
            description: [
                'Designed and fabricated 2.4 GHz planar patch antenna prototypes in HFSS, achieving return loss below −18 dB across the target ISM band.',
                'Conducted vector network analyzer (VNA) S-parameter measurements and de-embedding calibrations for multi-port RF filter characterization.',
                'Co-authored a peer-reviewed conference paper on compact antenna miniaturization techniques presented at IEEE AP-S 2026.',
            ],
        },
        {
            id: '3',
            role: 'Undergraduate Teaching Assistant – Digital Logic Design',
            company: 'Boston University Dept. of Electrical & Computer Engineering',
            location: 'Boston, MA',
            startDate: 'January 2025',
            endDate: 'May 2025',
            description: [
                'Led weekly recitation sections for 60+ students covering combinational and sequential logic, finite state machines, and Verilog HDL synthesis.',
                'Graded lab assignments involving Xilinx FPGA board bring-up, timing constraint analysis, and testbench simulation in ModelSim.',
            ],
        },
    ],
    projects: [
        {
            id: '1',
            name: 'IoT Environmental Monitoring Mesh Network',
            description: [
                'Architected a wireless mesh sensor network using ESP32 microcontrollers and LoRa transceivers for distributed temperature, humidity, and air quality monitoring across a 500-meter campus deployment.',
                'Implemented MQTT publish/subscribe data pipeline streaming 200+ sensor readings per minute to an InfluxDB time-series database with Grafana dashboard visualization.',
                'Designed custom 2-layer PCBs in KiCad integrating LiPo battery management, voltage regulation, and reverse-polarity protection circuitry.',
            ].join('\n'),
            technologies: 'ESP32, LoRa, MQTT, KiCad, InfluxDB, Grafana, C/C++',
            link: 'github.com/davidchen/iot-mesh',
        },
        {
            id: '2',
            name: 'RISC-V Soft-Core Processor on FPGA',
            description: [
                'Implemented a 5-stage pipelined RV32I RISC-V processor in SystemVerilog on a Xilinx Artix-7 FPGA, supporting 37 base integer instructions.',
                'Integrated hazard detection, data forwarding, and branch prediction logic achieving 1.2 CPI on the Dhrystone benchmark suite.',
                'Built a custom UART bootloader enabling program upload and real-time register inspection via serial terminal interface.',
            ].join('\n'),
            technologies: 'SystemVerilog, Xilinx Vivado, ModelSim, RISC-V ISA, UART',
            link: 'github.com/davidchen/riscv-core',
        },
    ],
    leadership: [
        {
            id: '1',
            role: 'Project Lead – BU Autonomous Drone Team',
            company: 'BU Unmanned Aerial Systems Club',
            location: 'Boston, MA',
            startDate: 'September 2025',
            endDate: 'Present',
            description: [
                'Directed a 6-person electrical sub-team designing power distribution boards, ESC interfaces, and GPS/IMU sensor integration for a competition quadcopter.',
                'Implemented PID flight stabilization algorithms on an STM32F4 flight controller achieving stable hover within ±5 cm positional accuracy.',
            ],
        },
        {
            id: '2',
            role: 'Treasurer & Workshop Lead',
            company: 'BU IEEE Student Branch',
            location: 'Boston, MA',
            startDate: 'September 2024',
            endDate: 'Present',
            description: [
                'Managed $12,000 annual club budget, allocating funds across 4 student project teams and 6 professional development events.',
                'Organized bi-weekly hands-on workshops on PCB design, 3D printing, and Arduino/Raspberry Pi prototyping for 100+ undergraduate members.',
            ],
        },
    ],
    skills: "Hardware & EDA Tools: Altium Designer, KiCad, Ansys HFSS, LTspice, Xilinx Vivado, MATLAB/Simulink\nEmbedded Systems & Firmware: C/C++, Python, ARM Cortex-M (STM32), ESP32, FreeRTOS, I2C, SPI, UART, CAN Bus, BLE\nLab Instrumentation: Vector Network Analyzers, Digital Oscilloscopes, Spectrum Analyzers, Logic Analyzers, SMD Soldering & Rework\nSoftware & Protocols: SystemVerilog, Linux, Git, InfluxDB, MQTT, LoRaWAN, Docker",
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
    lineHeight: 1.35,
    sectionGap: 0.11,
    headerGap: 0.05,
    headerItemGap: 0.02,
    headerContactGap: 0.02,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
    },
    currentTag: 'minimalist-sample',
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
        'leadership',
        'skills',
    ],
    sectionTitles: {
        skills: 'Technical Skills',
    },
    source: 'scratch',
    hasJobMatchRun: false,
};

export const CLASSIC_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+64 21 555 0192",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    location: "Auckland, New Zealand",
    address: "",
    summary: "Chartered Mechanical and Systems Engineer with 8+ years of experience leading complex infrastructure, automated manufacturing, and renewable energy capital projects across New Zealand and the Asia-Pacific region. Proven expertise in FEA simulation, thermodynamics, asset lifecycle optimization, and cross-functional project management delivering high-reliability systems on schedule and within budget.",
    experience: [
        {
            id: '1',
            role: 'Lead Mechanical Systems Engineer',
            company: 'Beca Engineering',
            location: 'Auckland, New Zealand',
            startDate: 'June 2021',
            endDate: 'Present',
            description: [
                'Spearheaded end-to-end mechanical systems engineering for $42M commercial and municipal water treatment infrastructure projects across the North Island.',
                'Conducted advanced finite element analysis (FEA) and computational fluid dynamics (CFD) simulations in ANSYS, reducing structural mass by 18% while ensuring full AS/NZS 1170 seismic compliance.',
                'Directed a multidisciplinary engineering team of 12 specialists delivering BIM/Revit coordinated models, decreasing on-site fabrication conflicts and contractor RFIs by 34%.',
                'Implemented condition-based asset monitoring and vibrational telemetry systems that extended mean time between failures (MTBF) by 26% across 8 critical pumping facilities.',
                'Negotiated and managed technical delivery agreements with regional councils, regulatory bodies, and international equipment manufacturers to maintain ISO 9001 quality compliance.',
            ],
        },
        {
            id: '2',
            role: 'Senior Project Engineer',
            company: 'Meridian Energy Limited',
            location: 'Wellington, New Zealand',
            startDate: 'July 2018',
            endDate: 'May 2021',
            description: [
                'Managed capital project delivery for hydro and wind turbine retrofits, overseeing engineering budgets totaling $18M across the South and North Islands.',
                'Streamlined preventative maintenance schedules and mechanical overhaul protocols, achieving a 15% increase in turbine operational availability during peak winter generation.',
                'Authored comprehensive technical specifications, HAZOP risk assessments, and commissioning test plans approved by Engineering New Zealand standards.',
                'Led root-cause failure analysis (RCFA) for high-pressure hydraulic governors, mitigating unexpected downtime risks and saving over $480K in annual repair expenditure.',
            ],
        },
        {
            id: '3',
            role: 'Mechanical Design Engineer',
            company: 'Fisher & Paykel Appliances',
            location: 'Auckland, New Zealand',
            startDate: 'February 2016',
            endDate: 'June 2018',
            description: [
                'Designed precision injection-molded components and sheet metal assemblies in SolidWorks and PTC Creo for next-generation consumer appliances.',
                'Collaborated with prototyping and toolmaking teams to execute rapid DFM/DFA design iterations, shortening product development cycle times from 14 to 9 months.',
                'Performed mechanical tolerance stack-up analyses and thermal dissipation testing, improving product lifecycle endurance by 22% in accelerated life testing (ALT).',
                'Supported supplier qualification audits across Australasia, ensuring adherence to environmental regulations and quality standards.',
            ],
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Master of Engineering (Mechanical)',
            school: 'University of Auckland',
            year: '2016',
        },
        {
            id: '2',
            degree: 'Bachelor of Engineering (Honours) in Mechanical Engineering',
            school: 'University of Canterbury',
            year: '2014',
        },
    ],
    certifications: [
        {
            id: '1',
            name: 'Chartered Professional Engineer (CPEng) – Mechanical',
            issuer: 'Engineering New Zealand',
            date: '2020',
        },
        {
            id: '2',
            name: 'Project Management Professional (PMP)',
            issuer: 'Project Management Institute (PMI)',
            date: '2019',
        },
        {
            id: '3',
            name: 'Certified SolidWorks Professional (CSWP) & FEA Specialist',
            issuer: 'Dassault Systèmes',
            date: '2017',
        },
    ],
    skills: "Technical Skills: CAD/CAM (SolidWorks, Creo, AutoCAD), FEA & CFD (ANSYS, COMSOL), MATLAB, Python for Engineering, Thermodynamics, DFM/DFA\nSoftware & Standards: Revit MEP, MS Project, Jira, AS/NZS Standards, ISO 9001/14001, HAZOP, GD&T, Root Cause Analysis (RCFA)",
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
        body: 9,
    },
    lineHeight: 1.4,
    sectionGap: 0.14,
    headerGap: 0.05,
    headerItemGap: 0.02,
    headerContactGap: 0.02,
    margins: {
        horizontal: 32 / 96,
        vertical: 32 / 96,
    },
    currentTag: 'classic-sample',
    language: 'en',
    accentColor: '#000000',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    sectionHeaderCase: 'uppercase',
    sectionOrder: [
        'summary',
        'experience',
        'education',
        'certifications',
        'skills',
    ],
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Skills',
    },
    source: 'scratch',
    hasJobMatchRun: false,
};

export const FINANCE_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    location: "United States",
    address: "",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    github: "",
    portfolio: "",
    summary: "Senior Finance Professional with 8+ years of experience leading corporate financial planning & analysis (FP&A), capital allocation, and valuation modeling across high-profile financial institutions. Proven track record driving multi-million dollar margin expansion, architecting automated reporting frameworks, and delivering strategic financial insight to executive leadership.",
    experience: [
        {
            id: 'exp-fin-1',
            role: 'Senior Finance Manager',
            company: 'J.P. Morgan',
            startDate: 'June 2021',
            endDate: 'Present',
            location: 'United States',
            description: [
                'Directed annual multi-entity operating budgets exceeding $450M, collaborating with department heads to implement dynamic rolling forecasts that reduced expense variances by 14%.',
                'Partnered with executive leadership to model strategic capital allocation initiatives, evaluating ROI on 12 enterprise acquisitions that contributed to an 18% YoY revenue increase.',
                'Architected automated financial dashboards and monthly performance decks, accelerating the quarterly board review cycle by five days while enhancing cash flow predictability.'
            ]
        },
        {
            id: 'exp-fin-2',
            role: 'Investment Banking Analyst',
            company: 'Goldman Sachs',
            startDate: 'June 2020',
            endDate: 'June 2021',
            location: 'United States',
            description: [
                'Constructed comprehensive three-statement operating models, DCF valuations, and leveraged buyout (LBO) analyses to support advisory mandates across $1.8B in M&A transactions.',
                'Drafted pitch books, confidential information memorandums (CIMs), and executive summary presentations delivered directly to C-level management during strategic financing rounds.',
                'Performed detailed comparable company (Comps) and precedent transaction benchmarking across 40+ public entities to establish robust enterprise valuation multiples.'
            ]
        },
        {
            id: 'exp-fin-3',
            role: 'Corporate Finance & Strategy Associate',
            company: 'Morgan Stanley',
            startDate: 'June 2019',
            endDate: 'June 2020',
            location: 'United States',
            description: [
                'Conducted commercial profitability analyses and customer margin evaluations that uncovered $16M in cost inefficiencies and directly supported product pricing restructuring.',
                'Engineered quantitative sensitivity models to evaluate debt recapitalization structures, optimizing corporate interest coverage ratios and preserving investment-grade credit ratings.',
                'Automated recurring variance reporting across 15 business divisions using SQL and advanced Excel macros, cutting weekly analytical cycle times by 35% for regional controllers.'
            ]
        },
        {
            id: 'exp-fin-4',
            role: 'Treasury & Financial Operations Analyst',
            company: 'BlackRock',
            startDate: 'June 2018',
            endDate: 'June 2019',
            location: 'United States',
            description: [
                'Monitored daily global liquidity positions across $2.5B in institutional asset pools, optimizing short-term commercial paper yields while maintaining 100% regulatory reserve compliance.',
                'Formulated interest rate and foreign exchange (FX) hedging models that protected international portfolio cash flows against currency volatility, minimizing downside risk by 22%.',
                'Spearheaded the integration of an enterprise treasury management system (TMS), streamlining wire settlements, intercompany reconciliations, and cash forecasting precision.'
            ]
        }
    ],
    education: [
        {
            id: 'edu-fin-1',
            school: 'University of Pennsylvania',
            degree: 'Bachelor of Science in Economics, Concentration in Finance',
            location: 'United States',
            year: '2018'
        }
    ],
    skills: "Financial Analysis & Modeling: Financial Planning & Analysis (FP&A), DCF Valuation, LBO Modeling, Budgeting & Forecasting, Capital Allocation, M&A Due Diligence, Variance Analysis, Working Capital Optimization\nTechnical & Analytical Tools: Bloomberg Terminal, FactSet, Capital IQ, Advanced Excel (VBA/Macros), SQL, Tableau, Power BI, Hyperion / Oracle EPM, ERP Systems (SAP, NetSuite)",
    certifications: [],
    projects: [],
    leadership: [],
    additionalInfo: [],
    keyAchievements: [],
    font: 'Merriweather, Georgia, serif',
    fontSizes: {
        header: 22,
        jobTitle: 10,
        sectionTitle: 11,
        body: 9,
    },
    lineHeight: 1.45,
    sectionGap: 0.16,
    headerGap: 0.12,
    headerItemGap: 0.04,
    headerContactGap: 0.04,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
    },
    currentTag: 'finance-sample',
    template: 'modern',
    language: 'en',
    accentColor: '#1a1a1a',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    sectionHeaderCase: 'uppercase',
    sectionOrder: [
        'summary',
        'experience',
        'education',
        'skills'
    ],
    sectionTitles: {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills'
    },
    source: 'scratch',
    hasJobMatchRun: false,
};

export const DEV_TEMPLATE_PREVIEW_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    location: "United States",
    address: "",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    github: "",
    portfolio: "",
    summary: "Software Developer with 4+ years of experience designing, building, and shipping scalable web applications and cloud-native services across the full stack. Proven record delivering production features in TypeScript, React, Go, and Node.js on AWS that serve hundreds of thousands of users while improving performance and reliability. Comfortable owning projects end to end, from architecture and implementation through automated testing, deployment, and mentorship of junior engineers.",
    education: [
        {
            id: 'edu-dev-1',
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science in Computer Science',
            location: 'United States',
            year: '2022',
            gpa: '3.7/4.0'
        }
    ],
    experience: [
        {
            id: 'exp-dev-1',
            role: 'Senior Software Developer',
            company: 'Stripe',
            startDate: 'June 2023',
            endDate: 'Present',
            location: 'United States',
            description: [
                'Architected and maintain Go microservices that process over four million payment API requests daily, cutting median response latency by 38% through query optimization, connection pooling, and Redis-backed caching of frequently accessed account data.',
                'Led the decomposition of a monolithic billing workflow into event-driven services on AWS using SQS and DynamoDB, reducing failed transaction retries by 22% and enabling horizontal scaling during month-end volume peaks.',
                'Introduced end-to-end tracing and service-level dashboards with OpenTelemetry and Grafana, shrinking mean time to detect production regressions from 45 minutes to under 10 minutes across six owned services.'
            ]
        },
        {
            id: 'exp-dev-2',
            role: 'Full-Stack Developer',
            company: 'Cloudflare',
            startDate: 'July 2022',
            endDate: 'May 2023',
            location: 'United States',
            description: [
                'Built customer-facing analytics features with React, TypeScript, and GraphQL, transforming high-volume network data into interactive dashboards that three enterprise clients cited during renewals worth more than $600K annually.',
                'Designed and documented a versioned REST and GraphQL API layer consumed by twelve web and mobile products, adding automated contract tests that eliminated a recurring class of cross-team integration regressions.',
                'Raised frontend test coverage from 31% to 86% by introducing component-driven development with Storybook and Jest, cutting QA-reported UI defects roughly in half over two release cycles.'
            ]
        },
        {
            id: 'exp-dev-3',
            role: 'Software Engineering Intern',
            company: 'Datadog',
            startDate: 'May 2021',
            endDate: 'August 2021',
            location: 'United States',
            description: [
                'Developed internal Python and Django tooling that automated weekly release-note compilation from merged pull requests, saving the operations team roughly six hours of manual work every week.',
                'Refactored legacy jQuery dashboard modules into reusable React components alongside senior engineers, improving load performance by 24% on the highest-traffic product marketing pages.'
            ]
        },
        {
            id: 'exp-dev-4',
            role: 'Web Developer (Campus)',
            company: 'UC Berkeley Web Services',
            startDate: 'September 2020',
            endDate: 'June 2021',
            location: 'United States',
            description: [
                'Maintained fifteen departmental WordPress and Node.js websites, implementing accessible page templates and performance budgets that lifted average Lighthouse scores from the low 60s to above 90.',
                'Automated backups and staging deployments with GitHub Actions and Docker, reducing manual deployment errors and rollback time during content launches across academic departments.'
            ]
        }
    ],
    projects: [
        {
            id: 'proj-dev-1',
            name: 'DevTrack: Open-Source Issue Tracker',
            technologies: 'React, Node.js, PostgreSQL, Docker',
            description: [
                'Built and maintain a full-stack issue tracker with offline-first synchronization used by more than 2,400 GitHub users, featuring keyboard-first workflows designed for rapid triage of large backlogs.',
                'Ship every release through a GitHub Actions pipeline with 92% unit and integration coverage, Docker Compose environments, and curated good-first-issue labels that onboarded 30+ external contributors.'
            ]
        },
        {
            id: 'proj-dev-2',
            name: 'Streamline CLI',
            technologies: 'Go, Cobra, SQLite, GitHub Actions',
            description: [
                'Wrote a cross-platform Go command-line tool that generates and audits CI/CD pipelines for popular frameworks, turning hours of hand-written configuration into a reproducible one-minute scaffold.',
                'Adopted by four university project teams to standardize linting, testing, and release automation, with documentation and plugin support maintained alongside the open-source community.'
            ]
        }
    ],
    involvement: [
        {
            id: 'inv-dev-1',
            company: 'UC Berkeley Computer Science Club',
            role: 'Vice President',
            location: 'United States',
            startDate: 'September 2021',
            endDate: 'June 2022',
            description: [
                'Organized weekly hack nights and workshop series attended by more than 120 students each semester, coordinating guest engineers from Bay Area platform and infrastructure teams.',
                'Grew active membership from 40 to 160 students by launching a peer-mentorship track that paired first-time contributors with experienced open-source maintainers.'
            ]
        },
        {
            id: 'inv-dev-2',
            company: 'Open Source Mentoring Collective',
            role: 'Mentor',
            location: 'United States',
            startDate: 'January 2022',
            endDate: 'Present',
            description: [
                'Mentor early-career developers weekly on JavaScript, Go, and system-design fundamentals, guiding fifteen mentees through their first merged pull requests and portfolio projects.',
                'Review community contributions and maintain style-guide documentation that reduced first-time review cycles from five rounds to two on average.'
            ]
        }
    ],
    skills: "Languages: TypeScript, JavaScript, Go, Python, SQL\nFrameworks: React, Next.js, Node.js, Express, GraphQL\nCloud & DevOps: AWS (Lambda, EC2, S3), Docker, Kubernetes, Terraform, GitHub Actions, Redis, PostgreSQL",
    certifications: [],
    leadership: [],
    additionalInfo: [],
    keyAchievements: [],
    font: 'Merriweather, Georgia, serif',
    fontSizes: {
        header: 22,
        jobTitle: 10,
        sectionTitle: 11,
        body: 9,
    },
    lineHeight: 1.45,
    sectionGap: 0.16,
    headerGap: 0.12,
    headerItemGap: 0.04,
    headerContactGap: 0.04,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
    },
    currentTag: 'dev-sample',
    template: 'dev',
    language: 'en',
    accentColor: '#1a1a1a',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    sectionHeaderCase: 'uppercase',
    sectionOrder: [
        'summary',
        'education',
        'experience',
        'projects',
        'involvement',
        'skills'
    ],
    sectionTitles: {
        summary: 'Professional Summary',
        education: 'Education',
        experience: 'Work Experience',
        projects: 'Projects/Open-Source',
        involvement: 'Involvement',
        skills: 'Skills'
    },
    source: 'scratch',
    hasJobMatchRun: false,
};

export function getTemplatePreviewData(templateId: TemplateType): ResumeData {
    let base: ResumeData;
    if (templateId === 'classic') {
        base = { ...CLASSIC_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'modern') {
        base = { ...FINANCE_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'dev') {
        base = { ...DEV_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'intern') {
        base = { ...INTERN_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'minimalist') {
        base = { ...MINIMALIST_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'free') {
        base = { ...CAREERCRAFT_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'rezi') {
        base = { ...HARVARD_RESUME_DATA, currentTag: '' };
    } else if (templateId === 'jake') {
        base = { ...JAKE_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'scholar') {
        base = { ...SCHOLAR_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'gaurav') {
        base = { ...GAURAV_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'freshgrad8') {
        base = { ...FRESHGRAD8_TEMPLATE_PREVIEW_DATA };
    } else if (templateId === 'impact') {
        base = { ...CREATIVE_TEMPLATE_PREVIEW_DATA };
    } else if (STUDENT_TEMPLATE_IDS.includes(templateId)) {
        base = { ...STUDENT_RESUME_DATA, currentTag: '' };
    } else {
        base = { ...TEMPLATE_GALLERY_PREVIEW_DATA };
    }
    return {
        ...base,
        font: 'Merriweather, serif',
    };
};

export const STUDENT_RESUME_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    location: "Boston, MA",
    address: "",
    summary: "",
    education: [
        {
            id: '1',
            school: 'Boston University',
            degree: 'Bachelor of Science in Electrical Engineering',
            year: 'Expected May 2027',
            gpa: '3.9/4.0'
        }
    ],
    experience: [
        {
            id: '1',
            company: 'Analog Devices, Inc.',
            role: 'Hardware Engineering Intern',
            location: 'Wilmington, MA',
            startDate: '2025-05',
            endDate: '2025-08',
            description: [
                'Designed and tested 4-layer mixed-signal evaluation boards in Altium Designer, validating low-noise analog signal conditioning paths.',
                'Executed automated signal integrity and power-rail transient ripple measurements using high-bandwidth digital oscilloscopes.'
            ]
        },
        {
            id: '2',
            company: 'Boston University Department of Electrical & Computer Engineering',
            role: 'Undergraduate Teaching Assistant (Circuits & Electronics)',
            location: 'Boston, MA',
            startDate: '2023-09',
            endDate: '2023-12',
            description: [
                'Facilitated weekly hardware lab sessions for 75+ students on AC/DC circuit analysis, op-amp filters, and oscilloscope diagnostics.',
                'Guided students in schematic capture, SPICE simulation, and hands-on SMD soldering and PCB rework techniques.'
            ]
        }
    ],
    projects: [
        {
            id: '1',
            name: 'Autonomous Mobile Robot with LiDAR Navigation',
            description: 'Engineered motor drive circuitry and sensor interface boards with STM32 ARM Cortex-M4 microcontroller running FreeRTOS.\nIntegrated 2D LiDAR scanner and wheel encoders over UART and SPI for real-time obstacle avoidance and indoor SLAM mapping.',
            technologies: 'C/C++, STM32, FreeRTOS, Altium Designer, SPI, UART, PWM',
            link: 'github.com/davidc/robot-navigation'
        },
        {
            id: '2',
            name: 'FPGA Real-Time Audio Filter Engine',
            description: 'Implemented 8-band configurable FIR digital audio equalizer in Verilog HDL on Xilinx Artix-7 FPGA.\nInterfaced 24-bit I2S audio codec running at 48 kHz sampling frequency, achieving sub-millisecond audio processing latency.',
            technologies: 'Verilog, ModelSim, Xilinx Vivado, I2S, MATLAB/Simulink',
            link: 'github.com/davidc/fpga-dsp-filter'
        }
    ],
    leadership: [
        {
            id: '1',
            company: 'IEEE Student Branch & BU Robotics Team',
            role: 'Vice President of Technical Operations',
            location: 'Boston, MA',
            startDate: '2024-09',
            endDate: 'Present',
            description: [
                'Organized hands-on microelectronics and soldering bootcamps for 150+ undergraduate engineering students.',
                'Led electrical telemetry hardware design for the university autonomous combat robot team, placing 2nd in regional competition.'
            ]
        }
    ],
    skills: "Hardware & EDA Tools: Altium Designer, KiCad, LTspice, Verilog/FPGA, MATLAB/Simulink, Cadence Virtuoso\nEmbedded Systems: C/C++, Embedded Linux, ARM Cortex-M (STM32), FreeRTOS, I2C, SPI, UART, CAN Bus\nLab Instrumentation: Digital Oscilloscopes, Logic Analyzers, Spectrum Analyzers, Signal Generators, SMD Soldering\nInterests: Autonomous Robotics, Digital Signal Processing, Power Electronics, Formula Hybrid",
    certifications: [],
    additionalInfo: [],
    keyAchievements: [],
    jobDescription: "",
    referee: "",
    font: 'Merriweather, serif',
    fontSizes: {
        header: 18,
        jobTitle: 11,
        sectionTitle: 11,
        body: 9,
    },
    lineHeight: 1.35,
    sectionGap: 0.11,
    headerGap: 0.05,
    headerItemGap: 0.02,
    headerContactGap: 0.02,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
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
        'leadership',
        'skills'
    ],
    sectionTitles: {
        skills: 'Skills & Interests',
    },
    source: 'scratch',
    hasJobMatchRun: false,
};

/**
 * Campus Modern (freshgrad8) preview — the shared student resume, but the
 * Leadership section is swapped for Relevant Coursework (this template hides
 * Leadership by default and surfaces coursework instead).
 */
export const FRESHGRAD8_TEMPLATE_PREVIEW_DATA: ResumeData = {
    ...STUDENT_RESUME_DATA,
    leadership: [],
    coursework: [
        {
            id: 'fg8-cw-1',
            courseName: 'Advanced Digital Signal Processing',
            institution: 'Boston University',
            year: 'Fall 2025',
            skills: 'MATLAB, Verilog, FIR/IIR Filter Design',
            description: 'Designed and simulated multi-rate FIR/IIR filter banks in MATLAB and Verilog, validating real-time audio processing on FPGA hardware.',
        },
        {
            id: 'fg8-cw-2',
            courseName: 'Embedded Systems Design',
            institution: 'Boston University',
            year: 'Spring 2025',
            skills: 'C/C++, STM32, FreeRTOS, SPI/I2C',
            description: 'Built interrupt-driven embedded firmware on ARM Cortex-M microcontrollers, integrating sensor interfaces over SPI and I2C.',
        },
        {
            id: 'fg8-cw-3',
            courseName: 'VLSI Circuit Design',
            institution: 'Boston University',
            year: 'Fall 2024',
            skills: 'Cadence Virtuoso, SPICE, CMOS Layout',
            description: 'Simulated CMOS digital and analog building blocks and completed full-custom layout of a low-noise amplifier in Cadence.',
        },
    ],
    sectionOrder: [
        'education',
        'experience',
        'projects',
        'coursework',
        'skills'
    ],
};

/**
 * Creative (impact) preview — mirrors the reference layout: a serif resume whose
 * sections run Summary → Experience → Projects → Skills. Skills are written as
 * plain "Category: ..." paragraphs (the template renders them that way), and the
 * projects pair a bold name with a plain subtitle line. The remaining sections
 * (education, certifications, leadership, achievements, additional info,
 * references) are blanked so they don't get auto-appended after the four
 * reference sections — see getResolvedSectionOrder, which appends any populated
 * section missing from sectionOrder.
 */
export const CREATIVE_TEMPLATE_PREVIEW_DATA: ResumeData = {
    ...TEMPLATE_GALLERY_PREVIEW_DATA,
    fullName: 'Alexander Williams',
    jobTitle: 'Creative Producer & Director',
    email: 'alexander.williams@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/alexander-williams',
    location: 'San Francisco, CA',
    summary:
        'Creative producer and director specializing in brand films, documentary shorts, and original programming, with 8+ years leading concepts from pitch through post-production. Known for pairing cinematic storytelling with disciplined production schedules, delivering campaigns that have reached millions across broadcast, social, and streaming platforms.',
    experience: [
        {
            id: 'cr-exp-1',
            role: 'Creative Producer',
            company: 'Meridian Studios',
            location: 'San Francisco, CA',
            startDate: '2021-03',
            endDate: 'Present',
            description: [
                'Produce brand films and commercial campaigns end to end, owning creative direction, crewing, and budgets across 20+ productions per year for enterprise and agency clients.',
                'Build and lead cross-functional crews of directors, editors, and sound designers, holding delivery timelines steady while protecting the cinematic quality of every final cut.',
                'Grow retained accounts by expanding into original programming, lifting average project value 38% over two seasons.',
            ],
        },
        {
            id: 'cr-exp-2',
            role: 'Producer & Director',
            company: 'Northlight Collective',
            location: 'San Francisco, CA',
            startDate: '2019-06',
            endDate: '2021-02',
            description: [
                'Directed documentary shorts and social series, running pre-production, casting, and on-set direction for lean two-camera crews.',
                'Built post-production workflows in Premiere Pro and Resolve that cut average turnaround from three weeks to eight days.',
            ],
        },
    ],
    projects: [
        {
            id: 'cr-p-1',
            name: 'Harbor Lights',
            technologies: 'Short Film',
            description: 'Directed and edited a 14-minute documentary short on night-shift harbor workers, selected for two regional film festivals.\nShot over six weeks on a micro-budget, handling color and sound mix in-house to keep the edit on schedule.',
        },
        {
            id: 'cr-p-2',
            name: 'City of Sound',
            technologies: 'Documentary Series',
            description: 'Series producer for a six-part series profiling local musicians, coordinating field crews across three cities.',
        },
        {
            id: 'cr-p-3',
            name: 'Nightshift',
            technologies: 'Brand Campaign',
            description: 'Directed a national brand campaign spanning broadcast, social, and in-store placements, reaching an audience of 12M.',
        },
    ],
    skills:
        'Video production, from start to finish.\nPost: Expert in Final Cut Pro, Premiere Pro, DaVinci Resolve, and After Effects. Experienced in media management, compression, and delivery workflows.\nPre-Production: Content development, collaborative scriptwriting and storyboarding, production timelines, and production management.\nProduction: Camera operation on cinema and mirrorless platforms, sound and lighting, direction, and crew management.',
    education: [],
    certifications: [],
    leadership: [],
    keyAchievements: [],
    additionalInfo: [],
    referee: '',
    sectionOrder: ['summary', 'experience', 'projects', 'skills'],
};

export const HARVARD_RESUME_DATA: ResumeData = {
    fullName: "Alexander Williams",
    jobTitle: "STRATEGIC FINANCE & PRIVATE EQUITY ANALYST",
    email: "alexander.williams@example.com",
    phone: "+1 (555) 123-4567",
    atHandle: "",
    linkedin: "linkedin.com/in/alexander-williams",
    location: "Boston, MA",
    address: "Boston, MA 02138",
    summary: "",
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
                'Built dynamic three-statement operating models and leveraged buyout (LBO) frameworks for 6 platform targets, evaluating capital structure returns.',
                'Led commercial due diligence and operational value-creation workstreams for a $380M enterprise SaaS carve-out, identifying $18M in margin upside.',
                'Authored comprehensive 40-page investment committee memorandums and presented thesis points directly to managing directors for 2 platform buyouts.'
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
                'Engineered detailed discounted cash flow (DCF), trading comparables, and precedent transaction valuation frameworks for technology M&A mandates.',
                'Developed dynamic debt-capacity and credit-amortization schedules in Excel, reducing pitchbook compilation turnaround times by 35%.',
                'Conducted extensive target screening across 65 prospective software targets in North America, analyzing ARR growth velocity and gross margins.'
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
                'Directed a 35-analyst quantitative research cohort managing a $120K student-run endowment portfolio, outperforming benchmark S&P 500 returns by 480 bps.',
                'Designed and taught weekly modeling workshops on three-statement accounting, LBO mechanics, and valuation for 120+ undergraduate candidates.'
            ],
        },
    ],
    skills: "Financial Modeling: Advanced LBO Modeling, Three-Statement Projections, DCF Valuation, M&A Consequence Analysis\nAnalytical Software: Capital IQ, FactSet, Bloomberg Terminal, Advanced Excel (VBA), PitchBook, Python, SQL\nDomain Expertise: Leveraged Buyouts, Commercial Diligence, Capital Structure Optimization, Unit Economics Diagnostics\nCertifications & Honors: Wall Street Prep Certified in Financial Modeling, Series 79 & 63 Exam Ready, CFA Level 1 Candidate",
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
    lineHeight: 1.35,
    sectionGap: 0.12,
    headerGap: 0.05,
    headerItemGap: 0.02,
    headerContactGap: 0.02,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
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
