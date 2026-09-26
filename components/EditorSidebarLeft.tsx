import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Award, Target, Layout as LayoutIcon, ChevronDown, ChevronRight, ChevronUp, Plus, Check, Users, Hash, Sparkles, FileText, Info, GripVertical, BarChart3, Lock, Crown, Layers, BookOpen, PanelLeftClose } from 'lucide-react';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { canAccessTemplate, FREE_TEMPLATES } from '../utils/pricingConfig';
import { TEMPLATE_CONFIG } from '../utils/templateConfig';
import { ResumeSectionType } from '../types/resumeSections';
import { SECTION_REGISTRY, createDefaultSectionOrder } from '../utils/sectionRegistry';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import AchievementsForm from './AchievementsForm';
import CertificationsForm from './CertificationsForm';
import SkillsForm from './SkillsForm';
import ExpertSkillsForm from './ExpertSkillsForm';
import SummaryForm from './SummaryForm';
import ReferencesForm from './ReferencesForm';
import AdditionalInfoForm from './AdditionalInfoForm';
import ProjectsForm from './ProjectsForm';
import LeadershipForm from './LeadershipForm';
import CustomSectionForm from './CustomSectionForm';
import GenericSectionForm from './GenericSectionForm';
import CourseworkForm from './CourseworkForm';
import AddSectionModal from './resume-agent/AddSectionModal';
import ResumePreview from './ResumePreview';
import AnalyticsDashboard from './AnalyticsDashboard';
import { EditorTab } from './Editor';

interface EditorSidebarLeftProps {
    activeTab: EditorTab;
    setActiveTab: (tab: EditorTab) => void;
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    currentTemplate: TemplateType;
    onTemplateChange: (template: TemplateType) => void;
    userSubscription: UserSubscription;
    onAIAction: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
    onShowPaywall?: (feature: 'templates' | 'job-match' | 'general' | 'credits' | 'export') => void;
    auditResult?: { score: number; keywords: string[]; issues: string[] } | null;
    onToggleSidebar?: () => void;
}

export default function EditorSidebarLeft({ activeTab, setActiveTab, data, onChange, currentTemplate, onTemplateChange, userSubscription, onAIAction, onShowPaywall, auditResult, onToggleSidebar }: EditorSidebarLeftProps) {
    const [view, setView] = useState<'create' | 'templates' | 'analytics'>('create');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [draggedSection, setDraggedSection] = useState<string | null>(null);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const lastUpdateRef = React.useRef<string>('');

    const toggleSection = (sectionId: string) => {
        setActiveTab(activeTab === sectionId ? ('' as EditorTab) : (sectionId as EditorTab));
    };

    const handleAddSection = (
        sectionType: ResumeSectionType,
        customConfig?: { title: string; contentType: 'text' | 'bullets' | 'key_value' }
    ) => {
        let updatedData: ResumeData = { ...data };

        if (sectionType === 'custom' && customConfig) {
            const customId = `custom_${Date.now()}`;
            const newCustomSections = {
                ...(updatedData.customSections || {}),
                [customId]: {
                    id: customId,
                    title: customConfig.title,
                    contentType: customConfig.contentType,
                    content:
                        customConfig.contentType === 'bullets'
                            ? ['Key achievement or highlight in this custom section', 'Additional project milestone or accomplishment']
                            : customConfig.contentType === 'key_value'
                            ? [{ id: '1', label: 'Item', value: 'Details' }]
                            : 'Add descriptive overview or notes for this section.',
                },
            };

            const newSectionOrder = Array.isArray(updatedData.sectionOrder)
                ? [...updatedData.sectionOrder, customId]
                : [...createDefaultSectionOrder(), customId];

            const newVisibility = {
                ...(updatedData.sectionVisibility || {}),
                [customId]: true,
            };

            updatedData = {
                ...updatedData,
                customSections: newCustomSections,
                sectionOrder: newSectionOrder,
                sectionVisibility: newVisibility,
            };
            onChange(updatedData);
            setActiveTab(customId as EditorTab);
        } else {
            const def = SECTION_REGISTRY[sectionType];
            const newVisibility = {
                ...(updatedData.sectionVisibility || {}),
                [sectionType]: true,
            };

            const currentOrder =
                Array.isArray(updatedData.sectionOrder) && updatedData.sectionOrder.length > 0
                    ? updatedData.sectionOrder
                    : createDefaultSectionOrder();

            const newSectionOrder = currentOrder.includes(sectionType)
                ? currentOrder
                : [...currentOrder, sectionType];

            updatedData = {
                ...updatedData,
                sectionVisibility: newVisibility,
                sectionOrder: newSectionOrder,
            };

            // Populate starter content if empty so it renders immediately
            if (def) {
                const field = def.dataField as keyof ResumeData;
                const currentVal = updatedData[field];
                const hasContent = Array.isArray(currentVal)
                    ? currentVal.length > 0
                    : typeof currentVal === 'string'
                    ? currentVal.trim().length > 0
                    : Boolean(currentVal);

                if (!hasContent) {
                    switch (def.rendererKind) {
                        case 'experience':
                            (updatedData as any)[field] = [
                                {
                                    id: Date.now().toString(),
                                    role: `${def.defaultTitle} Lead / Member`,
                                    company: 'Organization / Institution',
                                    startDate: '2023',
                                    endDate: 'Present',
                                    description: '• Led key initiatives and collaborated with cross-functional partners\n• Achieved quantifiable results and streamlined operational workflow',
                                },
                            ];
                            break;
                        case 'projects':
                            (updatedData as any)[field] = [
                                {
                                    id: Date.now().toString(),
                                    name: `${def.defaultTitle} Highlight`,
                                    technologies: 'React, TypeScript, Tailwind CSS',
                                    link: '',
                                    description: '• Designed and built high-impact features improving user engagement\n• Implemented automated workflows and delivered scalable architecture',
                                },
                            ];
                            break;
                        case 'certifications':
                            (updatedData as any)[field] = [
                                {
                                    id: Date.now().toString(),
                                    name: `${def.defaultTitle} Credential`,
                                    issuer: 'Accrediting Organization',
                                    date: '2024',
                                },
                            ];
                            break;
                        case 'languages':
                            (updatedData as any)[field] = [
                                { id: '1', language: 'English', proficiency: 'Native / Bilingual' },
                                { id: '2', language: 'Spanish', proficiency: 'Professional Working' },
                            ];
                            break;
                        case 'skills':
                            (updatedData as any)[field] =
                                'JavaScript, TypeScript, React, Node.js, Python, Git, Problem Solving, Team Leadership';
                            break;
                        case 'expert_skills':
                            (updatedData as any)[field] = [
                                { id: '1', category: 'Leadership', skills: 'Speaking, Fundraising, Product Development, Communication, Partnerships, International Marketing' },
                                { id: '2', category: 'Front End', skills: 'HTML, CSS, Bootstrap, Webflow | Design: Photoshop, Illustrator, Sketch' },
                                { id: '3', category: 'Fields of Interest', skills: 'Early-Stage Fundraising, Global Entrepreneurship, Web Design, Growth' },
                            ];
                            break;
                        case 'bullets':
                            (updatedData as any)[field] =
                                '• Key milestone or contribution delivering measurable impact\n• Published research or presentation delivered to target audience';
                            break;
                        case 'key_value':
                            (updatedData as any)[field] = [
                                { id: '1', label: 'Availability', value: 'Immediate' },
                                { id: '2', label: 'Work Authorization', value: 'Authorized to work' },
                            ];
                            break;
                        case 'coursework':
                            (updatedData as any)[field] = [
                                {
                                    id: Date.now().toString(),
                                    courseName: 'Computer Science',
                                    institution: 'BUK',
                                    year: '2026',
                                    skills: 'Excel, Work, Spreadsheet',
                                    description: [
                                        'Expert in translating complex blockchain protocols into intuitive user experiences. Deeply rooted in the Solana ecosystem with a focus on liquid staking, gamified finance (GameFi), and scalable design systems.',
                                        'Expert in translating complex blockchain protocols into intuitive user experiences. Deeply rooted in the Solana ecosystem with a focus on liquid staking, gamified finance (GameFi), and scalable design systems.',
                                    ],
                                },
                            ];
                            break;
                        case 'text':
                            (updatedData as any)[field] =
                                'Accomplished professional with a track record of delivering impactful results and driving innovation.';
                            break;
                    }
                }
            }

            onChange(updatedData);
            setActiveTab(sectionType as EditorTab);
        }
        setIsAddSectionModalOpen(false);
    };

    const standardSections = [
        { id: 'personal', label: 'Personal Information', icon: <User size={18} />, component: <PersonalInfoForm data={data} onChange={onChange} /> },
        { id: 'summary', label: 'Professional Summary', icon: <FileText size={18} />, component: <SummaryForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'experience', label: 'Employment History', icon: <Briefcase size={18} />, component: <ExperienceForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'education', label: 'Education', icon: <GraduationCap size={18} />, component: <EducationForm data={data} onChange={onChange} /> },
        { id: 'projects', label: 'Projects', icon: <Target size={18} />, component: <ProjectsForm data={data} onChange={onChange} /> },
        { id: 'skills', label: 'Skills', icon: <Hash size={18} />, component: <SkillsForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'expert_skills', label: 'Expert-Level Skills', icon: <Sparkles size={18} />, component: <ExpertSkillsForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'certifications', label: 'Certifications', icon: <Award size={18} />, component: <CertificationsForm data={data} onChange={onChange} /> },
        { id: 'achievements', label: 'Achievements', icon: <Award size={18} />, component: <AchievementsForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'additionalInfo', label: 'Additional Information', icon: <Info size={18} />, component: <AdditionalInfoForm data={data} onChange={onChange} /> },
        { id: 'leadership', label: 'Leadership', icon: <Users size={18} />, component: <LeadershipForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'references', label: 'References', icon: <Users size={18} />, component: <ReferencesForm data={data} onChange={onChange} /> },
    ];

    const customSectionsList = Object.entries(data.customSections || {}).map(([customId, customSec]) => ({
        id: customId,
        label: customSec.title || 'Custom Section',
        icon: <Layers size={18} />,
        component: <CustomSectionForm customId={customId} data={data} onChange={onChange} />,
    }));

    // Extended sections from SECTION_REGISTRY (coursework, volunteering, publications, languages, awards, research, etc.)
    const extendedSectionsList: Array<{ id: string; label: string; icon: React.ReactNode; component: React.ReactNode }> = [];
    Object.entries(SECTION_REGISTRY).forEach(([secKey, def]) => {
        const secId = def.type;
        // Avoid duplicating core standard sections
        if (standardSections.some(s => s.id === secId || (secId === 'additional_information' && s.id === 'additionalInfo'))) {
            return;
        }
        const isVisible = Boolean(data.sectionVisibility?.[secId] || (Array.isArray(data.sectionOrder) && data.sectionOrder.includes(secId)));
        const val = (data as any)[def.dataField];
        const hasData = Array.isArray(val)
            ? val.length > 0
            : typeof val === 'string'
            ? val.trim().length > 0
            : Boolean(val);

        if (isVisible || hasData) {
            const sectionIcon = secId === 'coursework' ? <BookOpen size={18} /> : <FileText size={18} />;
            extendedSectionsList.push({
                id: secId,
                label: (data.sectionTitles && data.sectionTitles[secId]) || def.defaultTitle,
                icon: sectionIcon,
                component: (
                    <GenericSectionForm
                        sectionType={secId}
                        definition={def}
                        data={data}
                        onChange={onChange}
                        onAIAction={onAIAction}
                    />
                ),
            });
        }
    });

    const sections = [...standardSections, ...customSectionsList, ...extendedSectionsList];

    // Helper function to compute full section order consistently
    // This ensures all sections are included, even if not in saved order
    // Validates section IDs and filters out any invalid ones
    const computeFullSectionOrder = React.useCallback((sectionOrder: string[] | undefined): string[] => {
        const availableSectionIds = sections
            .filter(s => s.id !== 'personal')
            .map(s => s.id);

        const savedOrder = sectionOrder || [];

        // Filter out invalid section IDs (defensive programming)
        const validSavedOrder = savedOrder.filter(id => availableSectionIds.includes(id));

        // Find sections that exist but aren't in saved order
        const missingSections = availableSectionIds.filter(id => !validSavedOrder.includes(id));

        // Return: valid saved order + missing sections appended
        return [...validSavedOrder, ...missingSections];
    }, [sections]);

    // Sort templates: free templates first, then pro templates
    const sortedTemplates = [...TEMPLATE_CONFIG].sort((a, b) => {
        const aIsFree = FREE_TEMPLATES.includes(a.id);
        const bIsFree = FREE_TEMPLATES.includes(b.id);
        if (aIsFree && !bIsFree) return -1;
        if (!aIsFree && bIsFree) return 1;
        return 0; // Maintain original order within each group
    });

    const getTemplateCategory = (t: typeof TEMPLATE_CONFIG[0]) => {
        const sub = t.subtitle.toLowerCase();
        // Categorization logic based on subtitles
        if (['entry level', 'graduate', 'finance', 'engineering', 'creative', 'chemical eng', 'marketing', 'leadership'].some(k => sub.includes(k))) return 'Student';
        if (['executive', 'senior leader', 'c-suite'].some(k => sub.includes(k))) return 'Executive';
        if (['modern tech', 'bold design', 'contemporary', 'clean', 'developer', 'modern'].some(k => sub.includes(k))) return 'Modern';
        if (['academic', 'research'].some(k => sub.includes(k))) return 'Academic';
        return 'Professional';
    };

    const categories = ['All', 'Professional', 'Modern', 'Student', 'Executive', 'Academic', 'Free', 'Pro'];

    const filteredTemplates = sortedTemplates.filter(t => {
        const isFree = FREE_TEMPLATES.includes(t.id);
        if (selectedCategory === 'Free') return isFree;
        if (selectedCategory === 'Pro') return !isFree;

        const category = getTemplateCategory(t);
        return selectedCategory === 'All' || category === selectedCategory;
    });

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Create / Templates / Analytics Toggle */}
            <div className="p-3 sm:p-4 border-b border-brand-border flex items-center gap-1.5">
                <div className="grid grid-cols-3 bg-brand-secondary p-1 rounded-lg gap-1 flex-1">
                    <button
                        onClick={() => setView('create')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${view === 'create' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Create
                    </button>
                    <button
                        onClick={() => setView('templates')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${view === 'templates' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Templates
                    </button>
                    <button
                        onClick={() => setView('analytics')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${view === 'analytics' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <BarChart3 size={14} />
                        Analytics
                    </button>
                </div>

                {onToggleSidebar && (
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        title="Hide Left Sidebar"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 hidden md:flex items-center justify-center"
                    >
                        <PanelLeftClose size={16} />
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {view === 'create' && (
                    // Accordion Sections
                    <div>
                        {/* Personal Info (Fixed) */}
                        {sections.filter(s => s.id === 'personal').map(section => {
                            const isActive = activeTab === section.id;
                            return (
                                <div key={section.id} className="border-b border-brand-border">
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className={`w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors ${isActive ? 'bg-brand-secondary' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{section.label}</span>
                                        </div>
                                        {isActive ? <ChevronDown size={16} className="text-gray-400" /> : <Plus size={16} className="text-gray-400" />}
                                    </button>
                                    {isActive && (
                                        <div
                                            className="px-4 pt-4 pb-6 animate-fadeIn"
                                            draggable={false}
                                            onDragStart={(e) => e.stopPropagation()}
                                        >
                                            {section.component}
                                        </div>
                                    )}
                                </div>
                            );
                        })}


                        {/* Draggable Sections */}
                        {(() => {
                            // Compute current full order for display (always from latest data)
                            const fullOrder = computeFullSectionOrder(data.sectionOrder);

                            // Move section up or down (for arrow buttons)
                            const moveSection = (sectionId: string, direction: 'up' | 'down') => {
                                const currentFullOrder = computeFullSectionOrder(data.sectionOrder);

                                const currentIdx = currentFullOrder.indexOf(sectionId);
                                if (currentIdx === -1) {
                                    console.warn(`Section ${sectionId} not found in order`);
                                    return;
                                }

                                const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
                                if (targetIdx < 0 || targetIdx >= currentFullOrder.length) {
                                    return; // Already at boundary
                                }

                                // Create new order by swapping adjacent items
                                const newOrder = [...currentFullOrder];
                                [newOrder[currentIdx], newOrder[targetIdx]] = [newOrder[targetIdx], newOrder[currentIdx]];

                                // Update state immediately - this will trigger re-render and preview update
                                onChange({ ...data, sectionOrder: newOrder });
                            };

                            return fullOrder.map((sectionId, index) => {
                                const section = sections.find(s => s.id === sectionId);
                                if (!section) return null;

                                const isActive = activeTab === section.id;
                                const isDragging = draggedSection === section.id;
                                const canMoveUp = index > 0;
                                const canMoveDown = index < fullOrder.length - 1;

                                return (
                                    <div
                                        key={section.id}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            if (!draggedSection || draggedSection === section.id) return;

                                            const currentFullOrder = computeFullSectionOrder(data.sectionOrder);
                                            const draggedIdx = currentFullOrder.indexOf(draggedSection);
                                            const targetIdx = currentFullOrder.indexOf(section.id);

                                            if (draggedIdx === -1 || targetIdx === -1) return;

                                            const newOrder = [...currentFullOrder];
                                            newOrder.splice(draggedIdx, 1);
                                            newOrder.splice(targetIdx, 0, draggedSection);

                                            const orderKey = newOrder.join(',');
                                            if (lastUpdateRef.current === orderKey) return;
                                            lastUpdateRef.current = orderKey;

                                            onChange({ ...data, sectionOrder: newOrder });
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setDraggedSection(null);
                                            lastUpdateRef.current = '';
                                        }}
                                        className={`border-b border-brand-border transition-all ${isDragging ? 'opacity-40 bg-gray-50 ring-1 ring-brand-green/30' : ''}`}
                                    >
                                        <div className={`w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors ${isActive ? 'bg-brand-secondary' : ''}`}>
                                            <div className="flex items-center gap-2 sm:gap-3 flex-1">
                                                {/* Drag Handle - Only this handle is draggable */}
                                                <div
                                                    draggable={true}
                                                    onDragStart={(e) => {
                                                        e.stopPropagation();
                                                        setDraggedSection(section.id);
                                                        e.dataTransfer.effectAllowed = 'move';
                                                        e.dataTransfer.setData('text/plain', section.id);
                                                    }}
                                                    onDragEnd={() => {
                                                        setDraggedSection(null);
                                                        lastUpdateRef.current = '';
                                                    }}
                                                    className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 p-1 -ml-1 rounded hover:bg-gray-200/50 transition-colors touch-none"
                                                    title="Drag to reorder section"
                                                >
                                                    <GripVertical size={14} />
                                                </div>

                                                {/* Move Buttons (arrows) for reordering */}
                                                <div className="flex flex-col gap-0.5 -ml-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            moveSection(section.id, 'up');
                                                        }}
                                                        disabled={!canMoveUp}
                                                        className={`p-1 rounded transition-colors ${canMoveUp
                                                            ? 'text-gray-400 active:text-brand-green active:bg-brand-secondary'
                                                            : 'text-gray-200 cursor-not-allowed'
                                                            }`}
                                                        aria-label="Move section up"
                                                    >
                                                        <ChevronUp size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            moveSection(section.id, 'down');
                                                        }}
                                                        disabled={!canMoveDown}
                                                        className={`p-1 rounded transition-colors ${canMoveDown
                                                            ? 'text-gray-400 active:text-brand-green active:bg-brand-secondary'
                                                            : 'text-gray-200 cursor-not-allowed'
                                                            }`}
                                                        aria-label="Move section down"
                                                    >
                                                        <ChevronDown size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => toggleSection(section.id)}
                                                    className="flex-1 text-left flex items-center gap-3"
                                                >
                                                    <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{section.label}</span>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => toggleSection(section.id)}
                                                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                                aria-label={isActive ? "Collapse section" : "Expand section"}
                                            >
                                                {isActive ? <ChevronDown size={16} /> : <Plus size={16} />}
                                            </button>
                                        </div>
                                        {isActive && (
                                            <div
                                                className="px-4 pt-4 pb-6 animate-fadeIn"
                                                draggable={false}
                                                onDragStart={(e) => e.stopPropagation()}
                                            >
                                                {section.component}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        })()}

                        {/* Add Section Button - Always Last in Scrollable Section List */}
                        <div className="p-4 pt-3 pb-8">
                            <button
                                type="button"
                                onClick={() => setIsAddSectionModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-neutral-200 hover:border-brand-green/80 bg-neutral-50/60 hover:bg-emerald-50/40 text-neutral-600 hover:text-emerald-800 text-xs font-bold transition-all duration-200 group cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                                <div className="w-5 h-5 rounded-full bg-neutral-200/80 group-hover:bg-brand-green/20 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
                                    <Plus size={13} className="text-neutral-600 group-hover:text-emerald-800" />
                                </div>
                                <span>Add Section</span>
                            </button>
                        </div>
                    </div>
                )}

                {view === 'templates' && (
                    <div className="flex flex-col h-full bg-brand-bg relative">
                        {/* Categories List (Sticky) */}
                        <div className="px-4 py-3 border-b border-brand-border bg-white sticky top-0 z-20">
                            <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 -mb-1 items-center">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${selectedCategory === cat
                                            ? 'bg-brand-dark text-white shadow-sm'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Templates Grid */}
                        <div className="p-4 grid grid-cols-2 gap-3 pb-8">
                            {filteredTemplates.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        onTemplateChange(t.id);
                                    }}
                                    className={`group flex flex-col items-center bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden text-left ${currentTemplate === t.id
                                        ? 'border-brand-green ring-1 ring-brand-green/20'
                                        : 'border-gray-200 hover:border-brand-green/50 hover:shadow-md'
                                        }`}
                                >
                                    {/* Template Preview Area */}
                                    <div className="relative w-full h-40 bg-gray-50 overflow-hidden border-b border-gray-100">
                                        <div className="absolute inset-x-0 top-0 flex justify-center py-2">
                                            <div className="origin-top transform scale-[0.14] pointer-events-none select-none">
                                                <ResumePreview data={data} template={t.id} />
                                            </div>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent pt-8 pb-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-bold text-white text-center block">Use Template</span>
                                        </div>

                                        {/* Active Indicator */}
                                        {currentTemplate === t.id && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-brand-green rounded-full flex items-center justify-center shadow-md z-10">
                                                <Check size={10} className="text-white" />
                                            </div>
                                        )}

                                        {/* Status Indicator */}
                                        {FREE_TEMPLATES.includes(t.id) ? (
                                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-brand-green/90 rounded text-[9px] font-bold tracking-wider text-white flex items-center shadow-sm z-10">
                                                FREE
                                            </div>
                                        ) : !canAccessTemplate(userSubscription.planId, t.id) && (
                                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-brand-green/90 rounded text-[9px] font-bold tracking-wider text-white flex items-center gap-1 shadow-sm z-10">
                                                <Crown size={9} className="text-[#1a1a2e] fill-current" /> PRO
                                            </div>
                                        )}
                                    </div>

                                    {/* Template Footer Info (Smaller Card version) */}
                                    <div className="w-full p-2.5 flex items-center gap-2 bg-white z-20">
                                        <div className="w-7 h-7 rounded bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                            {React.cloneElement(t.icon as React.ReactElement, { size: 14 })}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <h3 className="text-[11px] font-bold text-gray-900 truncate tracking-tight leading-none mb-0.5">
                                                {t.name}
                                            </h3>
                                            <span className="text-[9px] text-gray-500 truncate mt-0.5 leading-none">
                                                {t.subtitle}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'analytics' && (
                    <AnalyticsDashboard data={data} isSidebar={true} auditResult={auditResult} />
                )}
            </div>

            {/* Add Section / Custom Section Modal */}
            <AddSectionModal
                isOpen={isAddSectionModalOpen}
                onClose={() => setIsAddSectionModalOpen(false)}
                data={data}
                onAddSection={handleAddSection}
            />
        </div>
    );
}
