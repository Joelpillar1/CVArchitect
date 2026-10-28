import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Award, Target, Layout as LayoutIcon, ChevronDown, ChevronRight, ChevronUp, Plus, Check, Users, Hash, Sparkles, FileText, Info, GripVertical, BarChart3, Lock, Crown, Layers, BookOpen, PanelLeftClose, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { canAccessTemplate, FREE_TEMPLATES } from '../utils/pricingConfig';
import { TEMPLATE_CONFIG, getTemplateCategory } from '../utils/templateConfig';
import { getTemplatePreviewData } from '../utils/sampleResumeData';
import { ResumeSectionType } from '../types/resumeSections';
import { SECTION_REGISTRY, createDefaultSectionOrder, getResolvedSectionOrder, isSectionVisible, hasSectionContent, normalizeSectionType } from '../utils/sectionRegistry';
import { applySectionStarterContent, getCustomStarterContent } from '../utils/sectionStarterContent';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import AchievementsForm from './AchievementsForm';
import CertificationsForm from './CertificationsForm';
import SkillsForm from './SkillsForm';
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
import { TemplateCardPreviewCanvas } from './ui/TemplateSkeleton';
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
    initialView?: 'create' | 'templates' | 'analytics';
}

export default function EditorSidebarLeft({ activeTab, setActiveTab, data, onChange, currentTemplate, onTemplateChange, userSubscription, onAIAction, onShowPaywall, auditResult, onToggleSidebar, initialView = 'create' }: EditorSidebarLeftProps) {
    const [view, setView] = useState<'create' | 'templates' | 'analytics'>(initialView);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [draggedSection, setDraggedSection] = useState<string | null>(null);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const lastUpdateRef = React.useRef<string>('');

    const toggleSection = (sectionId: string) => {
        setActiveTab(activeTab === sectionId ? ('' as EditorTab) : (sectionId as EditorTab));
    };

    /**
     * Eye toggle for a section. Hiding writes an explicit false (the user's
     * decision always wins). Showing writes true and, if the section is not in
     * the current composition yet, appends it so the preview updates
     * immediately. The canonical type is recorded too so aliases and template
     * switches stay consistent.
     */
    const toggleSectionVisibility = (sectionId: string) => {
        if (!sectionId || sectionId === 'personal' || sectionId === 'contact') return;

        const canonical = normalizeSectionType(sectionId) || sectionId;
        // "Visible" here means actually rendered: in the resolved composition
        // and not explicitly hidden. A section that is merely defaultVisible in
        // the registry but absent from the order is still off until the eye is
        // clicked, which appends it.
        const renderedNow =
            getResolvedSectionOrder(data).some(
                (id) => id === sectionId || normalizeSectionType(id) === canonical
            ) && isSectionVisible(data, sectionId);
        const nextVisible = !renderedNow;

        const currentOrder =
            Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0
                ? data.sectionOrder
                : createDefaultSectionOrder();

        const nextVisibility: Record<string, boolean> = {
            ...(data.sectionVisibility || {}),
            [sectionId]: nextVisible,
        };
        if (canonical !== sectionId) nextVisibility[canonical] = nextVisible;

        let nextOrder = currentOrder;
        let nextUserAdded = data.userAddedSections || [];
        if (nextVisible) {
            const inOrder = currentOrder.some(
                (id) => id === sectionId || normalizeSectionType(id) === canonical
            );
            if (!inOrder) nextOrder = [...currentOrder, sectionId];
            nextUserAdded = Array.from(new Set([...nextUserAdded, sectionId, canonical]));
        }

        onChange({
            ...data,
            sectionOrder: nextOrder,
            sectionVisibility: nextVisibility,
            userAddedSections: nextUserAdded,
        });
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
                    content: getCustomStarterContent(customConfig.contentType),
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
                userAddedSections: Array.from(
                    new Set([...(updatedData.userAddedSections || []), customId])
                ),
            };
            onChange(updatedData);
            setActiveTab(customId as EditorTab);
        } else {
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
                // Explicit user addition — kept across template switches.
                userAddedSections: Array.from(
                    new Set([...(updatedData.userAddedSections || []), sectionType])
                ),
            };

            // Populate starter content while the field is empty so the added
            // section renders in the preview immediately (shared with the
            // agent page's add flow — existing content is never overwritten).
            updatedData = applySectionStarterContent(updatedData, sectionType);

            onChange(updatedData);
            setActiveTab(sectionType as EditorTab);
        }
        setIsAddSectionModalOpen(false);
    };

    const standardSections = [
        { id: 'personal', label: 'Personal Information', icon: <User size={18} />, component: <PersonalInfoForm data={data} onChange={onChange} /> },
        { id: 'summary', label: 'Professional Summary', icon: <FileText size={18} />, component: <SummaryForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'experience', label: 'Employment History', icon: <Briefcase size={18} />, component: <ExperienceForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'education', label: 'Education', icon: <GraduationCap size={18} />, component: <EducationForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'projects', label: 'Projects', icon: <Target size={18} />, component: <ProjectsForm data={data} onChange={onChange} /> },
        { id: 'skills', label: 'Skills', icon: <Hash size={18} />, component: <SkillsForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
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

    // Extended sections from SECTION_REGISTRY (coursework, volunteering,
    // publications, languages, awards, research, etc.). A section stays in the
    // list when it is in the composition, was explicitly added, has content, or
    // was explicitly shown. Hidden sections stay listed so the eye can bring
    // them back; only sections the document has never used live behind Add
    // Section.
    const extendedSectionsList: Array<{ id: string; label: string; icon: React.ReactNode; component: React.ReactNode }> = [];
    const currentOrderForList = Array.isArray(data.sectionOrder) ? data.sectionOrder : [];
    const userAddedForList = Array.isArray(data.userAddedSections) ? data.userAddedSections : [];

    Object.entries(SECTION_REGISTRY).forEach(([secKey, def]) => {
        const secId = def.type;
        // Avoid duplicating core standard sections or deprecated expert_skills
        if (secId === 'expert_skills' || standardSections.some(s => s.id === secId || (secId === 'additional_information' && s.id === 'additionalInfo'))) {
            return;
        }

        const inOrder = currentOrderForList.some(
            (id) => id === secId || normalizeSectionType(id) === secId
        );
        const isUserAdded = userAddedForList.some(
            (id) => id === secId || normalizeSectionType(id) === secId
        );
        const explicitlyShown = data.sectionVisibility?.[secId] === true;
        const hasData = hasSectionContent(data, secId);

        if (inOrder || isUserAdded || explicitlyShown || hasData) {
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
    // Include both the exact id and its canonical type so alias-based editor
    // rows (additionalInfo, achievements, references) match an order that uses
    // additional_information / keyAchievements / referee.
    const resolvedSectionIds = React.useMemo(() => {
        const ids = new Set<string>();
        for (const id of getResolvedSectionOrder(data)) {
            ids.add(id);
            const canonical = normalizeSectionType(id);
            if (canonical) ids.add(canonical);
        }
        return ids;
    }, [data]);

    // Helper function to compute full section order consistently.
    // Every section in the editor list is shown, including hidden ones (the eye
    // marks them). The saved order leads; anything missing is appended.
    const computeFullSectionOrder = React.useCallback((sectionOrder: string[] | undefined): string[] => {
        const availableSectionIds = sections
            .filter(s => s.id !== 'personal')
            .map(s => s.id);

        const savedOrder = sectionOrder || [];

        // Filter out ids that are no longer in the editor list.
        const validSavedOrder = savedOrder.filter(id => availableSectionIds.includes(id));

        // Sections that exist but are not in the saved order.
        const missingSections = availableSectionIds.filter(id => !validSavedOrder.includes(id));

        return [...validSavedOrder, ...missingSections];
    }, [sections]);

    // Keep activeTab in sync with visible sections when switching templates
    React.useEffect(() => {
        const allowed = ['personal', ...computeFullSectionOrder(data.sectionOrder)];
        if (activeTab && !allowed.includes(activeTab)) {
            setActiveTab('personal');
        }
    }, [currentTemplate, data.sectionOrder, activeTab, computeFullSectionOrder, setActiveTab]);

    // Sort templates: free templates first, then pro templates
    const sortedTemplates = [...TEMPLATE_CONFIG].sort((a, b) => {
        const aIsFree = FREE_TEMPLATES.includes(a.id);
        const bIsFree = FREE_TEMPLATES.includes(b.id);
        if (aIsFree && !bIsFree) return -1;
        if (!aIsFree && bIsFree) return 1;
        return 0; // Maintain original order within each group
    });

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
                                        type="button"
                                        onClick={() => toggleSection(section.id)}
                                        className={`w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors cursor-pointer select-none ${isActive ? 'bg-brand-secondary' : ''}`}
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
                                            onClick={(e) => e.stopPropagation()}
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
                                const sectionIsVisible = resolvedSectionIds.has(section.id) && isSectionVisible(data, section.id);

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
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => toggleSection(section.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    toggleSection(section.id);
                                                }
                                            }}
                                            className={`w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors cursor-pointer select-none ${isActive ? 'bg-brand-secondary' : ''}`}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3 flex-1">
                                                {/* Drag Handle - Only this handle is draggable */}
                                                <div
                                                    draggable={true}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => e.stopPropagation()}
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
                                                <div className="flex flex-col gap-0.5 -ml-1" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
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
                                                        type="button"
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

                                                <div className="flex-1 text-left flex items-center gap-3 min-w-0">
                                                    <span className={`text-xs font-bold uppercase tracking-wide truncate ${!sectionIsVisible ? 'text-gray-300' : isActive ? 'text-gray-900' : 'text-gray-500'}`}>{section.label}</span>
                                                    {!sectionIsVisible && (
                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-300 shrink-0">Hidden</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSectionVisibility(section.id);
                                                    }}
                                                    title={sectionIsVisible ? 'Hide section from resume' : 'Show section on resume'}
                                                    aria-label={sectionIsVisible ? 'Hide section from resume' : 'Show section on resume'}
                                                    aria-pressed={!sectionIsVisible}
                                                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${sectionIsVisible
                                                        ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                                                        : 'text-gray-300 hover:text-emerald-700 hover:bg-emerald-50'}`}
                                                >
                                                    {sectionIsVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                                                </button>
                                                <div
                                                    className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                                    aria-label={isActive ? "Collapse section" : "Expand section"}
                                                >
                                                    {isActive ? <ChevronDown size={16} /> : <Plus size={16} />}
                                                </div>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div
                                                className="px-4 pt-4 pb-6 animate-fadeIn"
                                                draggable={false}
                                                onDragStart={(e) => e.stopPropagation()}
                                                onClick={(e) => e.stopPropagation()}
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
                    <div className="flex flex-col h-full bg-[#f8fafc] relative">
                        {/* Categories List (Sticky) */}
                        <div className="px-4 py-3 border-b border-brand-border bg-white sticky top-0 z-20 shadow-2xs">
                            <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 -mb-1 items-center">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${selectedCategory === cat
                                            ? 'bg-brand-dark text-white shadow-sm'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Templates Grid with identical card structure to Dashboard Templates */}
                        <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-12">
                            {filteredTemplates.map((template) => {
                                const isFree = FREE_TEMPLATES.includes(template.id);
                                const isAccessible = canAccessTemplate(userSubscription.planId, template.id);
                                const isSelected = currentTemplate === template.id;

                                const handleSelectThisTemplate = () => {
                                    if (!isAccessible) {
                                        onShowPaywall?.('templates');
                                        return;
                                    }
                                    onTemplateChange(template.id);
                                };

                                return (
                                    <div
                                        key={template.id}
                                        className={`group bg-[#EEF1F4] rounded-[24px] border p-3 sm:p-3.5 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col ${
                                            isSelected
                                                ? 'border-brand-green ring-2 ring-brand-green/30 shadow-md bg-[#edf5f0]'
                                                : !isAccessible
                                                ? 'border-gray-200/80 hover:border-amber-300'
                                                : 'border-gray-200/80 hover:border-gray-300'
                                        }`}
                                        onClick={handleSelectThisTemplate}
                                    >
                                        {/* Top Card Header */}
                                        <div className="flex items-center justify-between gap-2 mb-2.5">
                                            {/* Category / Name Pill */}
                                            <div
                                                className={`text-xs font-semibold px-3 py-1 rounded-full shadow-2xs tracking-tight truncate max-w-[140px] sm:max-w-[160px] ${
                                                    isSelected
                                                        ? 'bg-brand-green text-brand-dark font-bold'
                                                        : 'bg-[#6F7682] text-white'
                                                }`}
                                            >
                                                {template.name}
                                            </div>

                                            {/* Right Status / Lock / Check */}
                                            {isSelected ? (
                                                <div
                                                    className="w-6 h-6 rounded-full bg-brand-green text-brand-dark flex items-center justify-center shadow-2xs shrink-0"
                                                    title="Active Template"
                                                >
                                                    <Check size={12} className="stroke-[3]" />
                                                </div>
                                            ) : !isAccessible ? (
                                                <div
                                                    className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xs shrink-0"
                                                    title="Pro Template (Requires Upgrade)"
                                                >
                                                    <Lock size={11} className="stroke-[2.5]" />
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Inner White Preview Canvas with Skeleton fallback */}
                                        <TemplateCardPreviewCanvas
                                            overlay={
                                                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/25 backdrop-blur-[2px] p-2.5">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectThisTemplate();
                                                        }}
                                                        className={`w-full max-w-[140px] px-3 py-1.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer ${
                                                            !isAccessible
                                                                ? 'bg-amber-400 hover:bg-amber-500 text-brand-dark'
                                                                : 'bg-brand-green hover:bg-brand-greenHover text-brand-dark'
                                                        }`}
                                                    >
                                                        {isSelected ? 'Active' : !isAccessible ? (
                                                            <>
                                                                <Lock size={12} /> Unlock Pro
                                                            </>
                                                        ) : (
                                                            <>
                                                                Apply <ArrowRight size={13} />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            }
                                        >
                                            <ResumePreview
                                                data={data?.fullName ? data : getTemplatePreviewData(template.id)}
                                                template={template.id}
                                            />
                                        </TemplateCardPreviewCanvas>

                                        {/* Bottom Subtitle Line */}
                                        <div className="mt-2 px-1 flex items-center justify-between text-xs text-gray-500">
                                            <span className="font-medium truncate text-[11px] sm:text-xs">
                                                {template.subtitle}
                                            </span>
                                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 ml-2">
                                                {isFree ? 'Free' : 'Pro'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
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
