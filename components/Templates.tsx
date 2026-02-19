import React, { useState } from 'react';
import { TemplateType, ResumeData } from '../types';
import {
    ArrowRight,
    Crown,
    Eye,
    X,
    LayoutTemplate,
    Briefcase,
    GraduationCap,
    Code,
    Palette,
    LineChart,
    Building2,
    User,
    Award,
    PenTool,
    BookOpen,
    Landmark,
    Leaf,
    Zap,
    Anchor,
    Feather,
    Gem,
    Megaphone,
    Search
} from 'lucide-react';
import ResumePreview from './ResumePreview';
import { FREE_TEMPLATES } from '../utils/pricingConfig';

interface TemplatesProps {
    onSelect: (template: TemplateType) => void;
    data: ResumeData;
}

export default function Templates({ onSelect, data }: TemplatesProps) {
    const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);

    // Fixed, fully-filled sample resume used for ALL template previews
    const PREVIEW_DATA: ResumeData = {
        fullName: 'Alexander Franklin',
        jobTitle: 'Senior Product Manager',
        email: 'alexander.franklin@example.com',
        phone: '(555) 123-4567',
        atHandle: 'linkedin.com/in/afranklin',
        linkedin: '',
        location: 'San Francisco, CA',
        address: '',
        summary:
            'Dynamic and results-oriented Product Manager with over 7 years of experience driving product strategy and execution in high-growth tech environments. Proven track record of launching user-centric products that generate millions in revenue. Skilled in Agile methodologies, cross-functional leadership, and data-driven decision making. Passionate about leveraging AI to solve complex user problems.',
        experience: [
            {
                id: 'exp1',
                company: 'TechVision Inc.',
                role: 'Senior Product Manager',
                location: 'San Francisco, CA',
                startDate: '2022-03',
                endDate: 'Present',
                roleSummary: '',
                description: [
                    'Spearhead the product roadmap for the company’s flagship AI analytics platform, resulting in a 40% increase in user engagement year-over-year.',
                    'Lead a cross-functional team of 15 engineers, designers, and data scientists to deliver quarterly product releases on time and under budget.',
                    'Implemented a new customer feedback loop that reduced churn by 15% and improved Net Promoter Score (NPS) by 20 points.',
                ],
            },
            {
                id: 'exp2',
                company: 'Innovate Solutions',
                role: 'Product Manager',
                location: 'Austin, TX',
                startDate: '2019-06',
                endDate: '2022-02',
                roleSummary: '',
                description: [
                    'Managed the full product lifecycle for a suite of enterprise SaaS tools, growing annual recurring revenue (ARR) from $2M to $5M.',
                    'Conducted extensive market research and competitor analysis to identify key opportunities for product differentiation and expansion.',
                    'Collaborated with sales and marketing teams to develop effective go-to-market strategies and sales enablement materials.',
                ],
            },
            {
                id: 'exp3',
                company: 'Creative Studio',
                role: 'Associate Product Manager',
                location: 'Austin, TX',
                startDate: '2017-06',
                endDate: '2019-05',
                roleSummary: '',
                description: [
                    'Assisted in the definition and prioritization of product requirements, ensuring alignment with business goals and user needs.',
                    'Coordinated beta testing programs and gathered user feedback to inform product iterations and improvements.',
                ],
            },
        ],
        education: [
            {
                id: 'edu1',
                school: 'University of California, Berkeley',
                degree: 'Master of Business Administration (MBA)',
                year: '2017',
                gpa: '',
                relevantCourses: 'Product Management, Data Analytics, Strategic Marketing',
            },
            {
                id: 'edu2',
                school: 'University of Texas at Austin',
                degree: 'Bachelor of Science in Computer Science',
                year: '2015',
                gpa: '3.8',
                relevantCourses: '',
            },
        ],
        skills: 'Product Strategy, Agile & Scrum, Roadmap Planning, Data Analysis (SQL, Tableau), User Research, A/B Testing, JIRA, Figma, stakeholder Management, Python (Basic)',
        certifications: [
            {
                id: 'cert1',
                name: 'Certified Product Manager (CPM)',
                issuer: 'AIPMM',
                date: '2018'
            }
        ],
        projects: [
            {
                id: 'proj1',
                name: 'AI-Powered Recommendation Engine',
                description: 'Led the development of a recommendation engine that personalized content for users, increasing average session duration by 25%.',
                technologies: 'Python, TensorFlow, AWS',
                link: ''
            }
        ],
        leadership: [],
        additionalInfo: [
            {
                id: 'lang',
                label: 'Languages',
                value: 'English (Native), Spanish (Professional Working Proficiency)'
            }
        ],
        keyAchievements:
            ['Launched a mobile app that achieved 100k+ downloads in the first 3 months.', 'Awarded "Product Manager of the Year" at Innovate Solutions in 2021.'],
        jobDescription: '',
        referee: '',
        font: 'Inter, sans-serif',
        fontSizes: {
            header: 22,
            jobTitle: 11,
            sectionTitle: 12,
            body: 9,
        },
        lineHeight: 1.3,
        sectionGap: 0.15,
        headerGap: 0.15,
        headerItemGap: 0.05,
        margins: {
            horizontal: 0.5,
            vertical: 0.5,
        },
        currentTag: '',
        language: 'en',
        accentColor: '#000000',
        headerAlignment: 'center',
        bodyHeaderAlignment: 'left',
        contentAlignment: 'left',
        skillsColumnCount: 1,
        sectionOrder: [
            'summary',
            'experience',
            'education',
            'skills',
            'projects',
            'certifications',
            'additionalInfo'
        ],
    };

    const templates: { id: TemplateType; name: string; subtitle: string; icon: React.ReactNode; bg: string }[] = [
        {
            id: 'free',
            name: "CareerCraft",
            subtitle: "Entry Level",
            icon: <User className="text-gray-600" size={20} />,
            bg: "bg-[#FAFAFA]"
        },
        {
            id: 'freshgrad1',
            name: "Campus Starter",
            subtitle: "Graduate",
            icon: <GraduationCap className="text-emerald-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'freshgrad2',
            name: "Campus Finance",
            subtitle: "Finance",
            icon: <LineChart className="text-indigo-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'freshgrad3',
            name: "Campus Engineer",
            subtitle: "Engineering",
            icon: <Code className="text-sky-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'freshgrad4',
            name: "Campus Creative",
            subtitle: "Creative",
            icon: <Palette className="text-rose-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'freshgrad5',
            name: "Campus ChemE",
            subtitle: "Chemical Eng",
            icon: <Leaf className="text-lime-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'freshgrad6',
            name: "Campus Strat",
            subtitle: "Marketing",
            icon: <Megaphone className="text-amber-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'simplepro',
            name: "SimplePro",
            subtitle: "Professional",
            icon: <Briefcase className="text-orange-500" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'vanguard',
            name: "The Vanguard",
            subtitle: "Modern Tech",
            icon: <Zap className="text-blue-600" size={20} />,
            bg: "bg-[#F8F8F8]"
        },
        {
            id: 'elevate',
            name: "Elevate",
            subtitle: "Corporate",
            icon: <Building2 className="text-gray-700" size={20} />,
            bg: "bg-[#FDFDFD]"
        },
        {
            id: 'prime',
            name: "Prime Profile",
            subtitle: "Executive",
            icon: <Crown className="text-amber-500" size={20} />,
            bg: "bg-[#FFFEFA]"
        },
        {
            id: 'impact',
            name: "Impact",
            subtitle: "Bold Design",
            icon: <Award className="text-red-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'dev',
            name: "DevPro",
            subtitle: "Developer",
            icon: <Code className="text-slate-700" size={20} />,
            bg: "bg-[#F8FAFC]"
        },
        {
            id: 'elite',
            name: "Elite Pro",
            subtitle: "International",
            icon: <Gem className="text-purple-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'apex',
            name: "Apex Exec",
            subtitle: "Senior Leader",
            icon: <Anchor className="text-navy-600" size={20} />,
            bg: "bg-[#FAFAFA]"
        },
        {
            id: 'modern',
            name: "Modern",
            subtitle: "Contemporary",
            icon: <LayoutTemplate className="text-teal-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'executive',
            name: "Executive",
            subtitle: "C-Suite",
            icon: <Building2 className="text-slate-800" size={20} />,
            bg: "bg-[#FAFAFA]"
        },
        {
            id: 'classic',
            name: "Classic",
            subtitle: "Traditional",
            icon: <BookOpen className="text-gray-600" size={20} />,
            bg: "bg-[#F8F8F8]"
        },
        {
            id: 'wonsulting',
            name: "Ivy League",
            subtitle: "Academic",
            icon: <Landmark className="text-emerald-700" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'styled',
            name: "Styled",
            subtitle: "Sophisticated",
            icon: <PenTool className="text-blue-700" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'smart',
            name: "Smart",
            subtitle: "Research",
            icon: <BookOpen className="text-indigo-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'elegant',
            name: "Elegant",
            subtitle: "Refined",
            icon: <Feather className="text-slate-600" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'minimalist',
            name: "Minimalist",
            subtitle: "Clean",
            icon: <LayoutTemplate className="text-gray-400" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'professional',
            name: "Pro Clean",
            subtitle: "Standard",
            icon: <Briefcase className="text-blue-500" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'sage',
            name: "Sage",
            subtitle: "Expert",
            icon: <Feather className="text-green-700" size={20} />,
            bg: "bg-[#FFFFFF]"
        },
    ];




    // Sort templates: free templates first, then pro templates
    const sortedTemplates = [...templates].sort((a, b) => {
        const aIsFree = FREE_TEMPLATES.includes(a.id);
        const bIsFree = FREE_TEMPLATES.includes(b.id);
        if (aIsFree && !bIsFree) return -1;
        if (!aIsFree && bIsFree) return 1;
        return 0; // Maintain original order within each group
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const getTemplateCategory = (t: typeof templates[0]) => {
        const sub = t.subtitle.toLowerCase();
        // Categorization logic based on subtitles
        if (['entry level', 'graduate', 'finance', 'engineering', 'creative', 'chemical eng', 'marketing'].some(k => sub.includes(k))) return 'Student';
        if (['executive', 'senior leader', 'c-suite'].some(k => sub.includes(k))) return 'Executive';
        if (['modern tech', 'bold design', 'contemporary', 'clean', 'developer', 'modern'].some(k => sub.includes(k))) return 'Modern';
        if (['academic', 'research'].some(k => sub.includes(k))) return 'Academic';
        return 'Professional';
    };

    const categories = ['All', 'Professional', 'Modern', 'Student', 'Executive', 'Academic'];

    const filteredTemplates = sortedTemplates.filter(t => {
        const category = getTemplateCategory(t);
        const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-brand-bg">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-3">Choose Your Template</h2>
                    <p className="text-gray-500 text-base max-w-xl mx-auto">
                        Professional designs optimized for ATS systems.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="max-w-4xl mx-auto mb-12 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search templates (e.g., 'Modern', 'ATS', 'Creative')..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat
                                    ? 'bg-brand-dark text-white shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="pb-16">
                    {filteredTemplates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredTemplates.map((template) => {
                                const isFree = FREE_TEMPLATES.includes(template.id);
                                return (
                                    <div
                                        key={template.id}
                                        className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:border-brand-green hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-[340px]"
                                        onClick={() => onSelect(template.id)}
                                    >
                                        {/* Template Preview Area - Real Render */}
                                        <div className="relative flex-1 bg-gray-100 overflow-hidden w-full">
                                            {/* Scaled Resume Preview - Centered */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210mm] origin-top transform scale-[0.34] pointer-events-none select-none shadow-md">
                                                <ResumePreview data={PREVIEW_DATA} template={template.id} />
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/20 backdrop-blur-[2px]">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200 flex flex-col gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onSelect(template.id); }}
                                                        className="bg-brand-green hover:bg-brand-greenHover text-brand-dark px-5 py-2 rounded-lg font-bold shadow-xl transition-all flex items-center justify-center gap-1.5 text-sm"
                                                    >
                                                        Use Template <ArrowRight size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template.id); }}
                                                        className="bg-white hover:bg-gray-50 text-brand-dark px-5 py-2 rounded-lg font-bold shadow-xl transition-all flex items-center justify-center gap-1.5 text-sm"
                                                    >
                                                        <Eye size={14} /> Quick View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Template Footer Info */}
                                        <div className="h-20 px-4 flex items-center justify-between border-t border-gray-100 bg-white z-20 relative">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                {/* Logo / Icon */}
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                                    {template.icon}
                                                </div>

                                                {/* Text Info */}
                                                <div className="flex flex-col overflow-hidden">
                                                    <h3 className="text-sm font-bold text-gray-900 truncate pr-2">
                                                        {template.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 truncate">
                                                        {template.subtitle}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Badge */}
                                            <div className="shrink-0">
                                                {isFree ? (
                                                    <span className="opacity-0"></span>
                                                ) : (
                                                    <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-gray-200">
                                                        PRO
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-xl border border-dashed border-gray-200">
                            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <LayoutTemplate className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-brand-dark">No Templates Available</h3>
                            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
                                New designs coming soon!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md transition-opacity" onClick={() => setPreviewTemplate(null)} />
                    <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-brand-bg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0 z-10 shadow-sm">
                            <div>
                                <h3 className="text-xl font-bold text-brand-dark">Template Preview</h3>
                                <p className="text-sm text-gray-500 hidden md:block">Full preview of the {sortedTemplates.find(t => t.id === previewTemplate)?.name} template</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                <button
                                    onClick={() => { if (previewTemplate) onSelect(previewTemplate); }}
                                    className="bg-brand-green hover:bg-brand-greenHover text-brand-dark px-6 py-2 rounded-lg font-bold shadow-lg transition-all"
                                >
                                    Use This Template
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-[#525659] flex justify-center relative">
                            <div className="scale-75 md:scale-90 origin-top transition-transform shadow-2xl">
                                {previewTemplate && (
                                    <ResumePreview
                                        data={PREVIEW_DATA}
                                        template={previewTemplate}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}