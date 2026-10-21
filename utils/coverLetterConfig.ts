import { ResumeData } from '../types';
import { GeneratedCoverLetter } from '../components/utils/aiEnhancer';

export type CoverLetterTemplateType = 'classic' | 'editorial' | 'minimal' | 'academic' | 'technical' | 'modern' | 'bold' | 'structured';

export interface CoverLetterTemplateConfig {
    id: CoverLetterTemplateType;
    name: string;
    subtitle: string;
    category: 'Modern' | 'Professional' | 'Executive';
    isFree: boolean;
    description: string;
    tags: string[];
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplateConfig[] = [
    {
        id: 'technical',
        name: 'Technical',
        subtitle: 'NASA & engineering format with bold organization recipient',
        category: 'Professional',
        isFree: false,
        description: 'Optimized for aerospace, robotics, software systems, and deep-tech roles: bold left-aligned candidate header, prominent organization identifier, deep technical project narratives, and clean executive signature spacing.',
        tags: ['Engineering', 'Aerospace', 'NASA', 'STEM', 'ATS-Friendly']
    },
    {
        id: 'academic',
        name: 'Academic',
        subtitle: 'Traditional scholarly format with standalone date & formal address',
        category: 'Professional',
        isFree: false,
        description: 'Faithfully tailored for academia, fellowships, research laboratories, and scholarly appointments: prominent candidate header, standalone international date, formal institutional recipient line, and unhurried intellectual prose.',
        tags: ['Academic', 'Research', 'Higher Ed', 'Fellowship', 'ATS-Friendly']
    },
    {
        id: 'minimal',
        name: 'Clean Minimal',
        subtitle: 'Streamlined narrative format with essential contact block',
        category: 'Professional',
        isFree: false,
        description: 'A pure, distraction-free traditional format with streamlined contact essentials (location, phone, email) without header dates, fluid prose paragraphs, and generous executive signature spacing.',
        tags: ['Minimal', 'Streamlined', 'Engineering', 'Tech', 'ATS-Friendly']
    },
    {
        id: 'editorial',
        name: 'Editorial',
        subtitle: 'Left-aligned executive layout with inline date & generous margins',
        category: 'Professional',
        isFree: false,
        description: 'Faithfully modeled after premier banking and executive correspondence: bold serif candidate header, date embedded directly in the contact block, unbulleted achievement highlights, and classic signature spacing.',
        tags: ['Editorial', 'Executive', 'Banking', 'Corporate', 'ATS-Friendly']
    },
    {
        id: 'classic',
        name: 'Classic',
        subtitle: 'Traditional left-aligned format with classic editorial typography',
        category: 'Professional',
        isFree: false,
        description: 'An understated, timeless traditional layout featuring clean left alignment, formal address hierarchy, and elegant serif typography. Perfect for academia, law, education, finance, and corporate roles.',
        tags: ['Classic', 'Left-Aligned', 'Editorial', 'Academic', 'ATS-Friendly']
    },
    {
        id: 'modern',
        name: 'Modern',
        subtitle: 'Clean serif typography with centered header & dividers',
        category: 'Modern',
        isFree: false,
        description: 'A classic, elegant design with centered typography, delicate dividing rules, and balanced spacing. Ideal for corporate, academic, and creative roles.',
        tags: ['Serif', 'Clean', 'Centered', 'ATS-Friendly']
    },
    {
        id: 'bold',
        name: 'Bold',
        subtitle: 'High-contrast header with featured competency bar',
        category: 'Professional',
        isFree: false,
        description: 'A punchy, modern design featuring prominent bold headers, clean dividers, and a top-line core skill highlight banner.',
        tags: ['High Contrast', 'Skills Bar', 'Minimalist', 'Tech']
    },
    {
        id: 'structured',
        name: 'Impact',
        subtitle: 'Evidence-driven layout with highlighted competencies',
        category: 'Executive',
        isFree: false,
        description: 'Designed to capture attention with a structured two-column impact section featuring checkmarked accomplishments and clear opening/closing narrative.',
        tags: ['Evidence-Based', 'Key Highlights', 'Executive', 'Results-Driven']
    }
];

export const SAMPLE_COVER_LETTER_RESUME: ResumeData = {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Product Manager',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    portfolio: 'alexmorgan.dev',
    summary: 'Results-driven Senior Product Manager with 7+ years of experience leading cross-functional teams and launching SaaS products with multi-million dollar revenue impact.',
    skills: 'Product Strategy, Data Analytics, Cross-functional Leadership, Agile & Scrum, User Research, SaaS Growth',
    experience: [
        {
            id: 'exp-1',
            company: 'TechFlow Systems',
            role: 'Senior Product Manager',
            startDate: '2021',
            endDate: 'Present',
            description: 'Led core product squad of 14 engineers, designers, and marketers.'
        }
    ],
    education: [
        {
            id: 'edu-1',
            school: 'University of California, Berkeley',
            degree: 'B.S. in Computer Science & Business',
            year: '2018'
        }
    ],
    projects: [],
    certifications: []
};

export const SAMPLE_COVER_LETTER_DATA: GeneratedCoverLetter = {
    plainText: `Dear Hiring Team,

I am writing to express my enthusiastic interest in the Senior Product Manager position at your company. With over seven years of hands-on experience scaling enterprise SaaS products, architecting data-driven roadmaps, and leading high-velocity product squads, I have developed a strong track record of turning ambiguous user problems into profitable, high-retention solutions.

In my recent work, I spearheaded the comprehensive redesign of our core analytics engine. By closely partnering with key enterprise accounts and engineering leads, we reduced user onboarding friction by 32% and unlocked $3.4M in annualized expansion revenue within twelve months. I pride myself on establishing transparent communication across engineering, design, and executive stakeholders while keeping user outcomes at the center of every sprint.

Your organization's dedication to building thoughtful, scalable tools strongly resonates with my personal product philosophy. I would welcome the opportunity to discuss how my background in product strategy, quantitative optimization, and collaborative execution can support your team's upcoming growth objectives.

Thank you very much for your time and consideration. I look forward to the opportunity to connect.

Sincerely,

Alex Morgan`,
    structured: {
        opening: `Dear Hiring Team,

I am writing to express my enthusiastic interest in the Senior Product Manager position at your company. With over seven years of hands-on experience scaling enterprise SaaS products, architecting data-driven roadmaps, and leading high-velocity product squads, I have developed a strong track record of turning ambiguous user problems into profitable, high-retention solutions.`,
        skills: [
            {
                skill: 'Product Strategy & Vision',
                description: 'Defined multi-quarter roadmaps aligned with corporate revenue targets, delivering 3 major feature releases ahead of schedule.'
            },
            {
                skill: 'Data-Driven Growth',
                description: 'Implemented rigorous telemetry and telemetry-backed A/B testing that increased platform onboarding conversion by 32%.'
            },
            {
                skill: 'Cross-Functional Leadership',
                description: 'Directed cross-functional pods of 14 engineers, UX designers, and marketers while maintaining a 94% sprint predictability rate.'
            }
        ],
        closing: `Your organization's dedication to building thoughtful, scalable tools strongly resonates with my personal product philosophy. I would welcome the opportunity to discuss how my background in product strategy, quantitative optimization, and collaborative execution can support your team's upcoming growth objectives.

Thank you very much for your time and consideration. I look forward to the opportunity to connect.

Sincerely,
Alex Morgan`
    }
};

export function getCoverLetterTemplateConfig(id: CoverLetterTemplateType): CoverLetterTemplateConfig {
    return COVER_LETTER_TEMPLATES.find(t => t.id === id) || COVER_LETTER_TEMPLATES[0];
}
