import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Award, Target, Layout as LayoutIcon, ChevronDown, ChevronRight, Plus, Check, Users, Hash, FileText, Info, GripVertical, BarChart3, Lock, Crown } from 'lucide-react';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { canAccessTemplate } from '../utils/pricingConfig';
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
}

export default function EditorSidebarLeft({ activeTab, setActiveTab, data, onChange, currentTemplate, onTemplateChange, userSubscription, onAIAction, onShowPaywall, auditResult }: EditorSidebarLeftProps) {
    const [view, setView] = useState<'create' | 'templates' | 'analytics'>('create');
    const [draggedSection, setDraggedSection] = useState<string | null>(null);

    const sections = [
        { id: 'personal', label: 'Personal Information', icon: <User size={18} />, component: <PersonalInfoForm data={data} onChange={onChange} /> },
        { id: 'summary', label: 'Professional Summary', icon: <FileText size={18} />, component: <SummaryForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'experience', label: 'Employment History', icon: <Briefcase size={18} />, component: <ExperienceForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'education', label: 'Education', icon: <GraduationCap size={18} />, component: <EducationForm data={data} onChange={onChange} /> },
        { id: 'projects', label: 'Projects', icon: <Target size={18} />, component: <ProjectsForm data={data} onChange={onChange} /> },
        { id: 'skills', label: 'Skills', icon: <Hash size={18} />, component: <SkillsForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'certifications', label: 'Certifications', icon: <Award size={18} />, component: <CertificationsForm data={data} onChange={onChange} /> },
        { id: 'achievements', label: 'Achievements', icon: <Award size={18} />, component: <AchievementsForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'additionalInfo', label: 'Additional Information', icon: <Info size={18} />, component: <AdditionalInfoForm data={data} onChange={onChange} /> },
        { id: 'leadership', label: 'Leadership', icon: <Users size={18} />, component: <LeadershipForm data={data} onChange={onChange} onAIAction={onAIAction} /> },
        { id: 'references', label: 'References', icon: <Users size={18} />, component: <ReferencesForm data={data} onChange={onChange} /> },
    ];

    const templates: { id: TemplateType; name: string; color: string }[] = [
        { id: 'free', name: 'Free', color: 'bg-gray-500' },
        { id: 'simplepro', name: 'Simple Pro', color: 'bg-indigo-500' },
        { id: 'minimalist', name: 'Minimalist', color: 'bg-gray-100' },
        { id: 'vanguard', name: 'Vanguard', color: 'bg-blue-500' },
        { id: 'elevate', name: 'Elevate', color: 'bg-purple-500' },
        { id: 'prime', name: 'Prime', color: 'bg-amber-500' },
        { id: 'impact', name: 'Impact', color: 'bg-emerald-500' },
        { id: 'dev', name: 'Dev', color: 'bg-cyan-500' },
        { id: 'elite', name: 'Elite', color: 'bg-rose-500' },
        { id: 'apex', name: 'Apex', color: 'bg-orange-500' },
        { id: 'modern', name: 'Modern', color: 'bg-teal-500' },
        { id: 'executive', name: 'Executive', color: 'bg-slate-800' },
        { id: 'classic', name: 'Classic', color: 'bg-stone-600' },
        { id: 'wonsulting', name: 'Ivy League', color: 'bg-slate-900' },
        { id: 'styled', name: 'Styled Professional', color: 'bg-blue-100' },
        { id: 'smart', name: 'Smart', color: 'bg-gray-200' },
        { id: 'elegant', name: 'Elegant', color: 'bg-indigo-900' },
    ];

    return (
        <div className="flex flex-col h-full bg-brand-bg">
            {/* Create / Templates / Analytics Toggle */}
            <div className="p-4 border-b border-brand-border">
                <div className="grid grid-cols-3 bg-brand-secondary p-1 rounded-lg gap-1">
                    <button
                        onClick={() => setView('create')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-all ${view === 'create' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Create
                    </button>
                    <button
                        onClick={() => setView('templates')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-all ${view === 'templates' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Templates
                    </button>
                    <button
                        onClick={() => setView('analytics')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1 ${view === 'analytics' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <BarChart3 size={14} />
                        Analytics
                    </button>
                </div>
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
                                        onClick={() => setActiveTab(section.id as EditorTab)}
                                        className={`w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors ${isActive ? 'bg-brand-secondary' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{section.label}</span>
                                        </div>
                                        {isActive ? <ChevronDown size={16} className="text-gray-400" /> : <Plus size={16} className="text-gray-400" />}
                                    </button>
                                    {isActive && <div className="p-4 pt-0 animate-fadeIn">{section.component}</div>}
                                </div>
                            );
                        })}


                        {/* Draggable Sections */}
                        {(() => {
                            // Ensure all available sections are shown, even if not in the saved order
                            const savedOrder = data.sectionOrder || [];
                            const availableSections = sections.filter(s => s.id !== 'personal');
                            const missingSections = availableSections
                                .map(s => s.id)
                                .filter(id => !savedOrder.includes(id));

                            const fullOrder = [...savedOrder, ...missingSections];

                            return fullOrder.map((sectionId) => {
                                const section = sections.find(s => s.id === sectionId);
                                if (!section) return null;

                                const isActive = activeTab === section.id;
                                const isDragging = draggedSection === section.id;

                                return (
                                    <div
                                        key={section.id}
                                        draggable
                                        onDragStart={() => setDraggedSection(section.id)}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            if (!draggedSection || draggedSection === section.id) return;

                                            // Use fullOrder here because it includes sections that might be missing from saved data
                                            const currentOrder = [...fullOrder];
                                            const draggedIdx = currentOrder.indexOf(draggedSection);
                                            const targetIdx = currentOrder.indexOf(section.id);

                                            if (draggedIdx === -1 || targetIdx === -1) return;

                                            const newOrder = [...currentOrder];
                                            newOrder.splice(draggedIdx, 1);
                                            newOrder.splice(targetIdx, 0, draggedSection);
                                            onChange({ ...data, sectionOrder: newOrder });
                                        }}
                                        onDragEnd={() => setDraggedSection(null)}
                                        className={`border-b border-brand-border transition-all ${isDragging ? 'opacity-50' : ''}`}
                                    >
                                        <div className={`w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors ${isActive ? 'bg-brand-secondary' : ''}`}>
                                            <div className="flex items-center gap-3 flex-1">
                                                <div
                                                    className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1 -ml-2"
                                                    onMouseDown={(e) => e.stopPropagation()} // Prevent accordion toggle when grabbing handle
                                                >
                                                    <GripVertical size={14} />
                                                </div>
                                                <button
                                                    onClick={() => setActiveTab(section.id as EditorTab)}
                                                    className="flex-1 text-left flex items-center gap-3"
                                                >
                                                    <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{section.label}</span>
                                                </button>
                                            </div>
                                            <button onClick={() => setActiveTab(section.id as EditorTab)}>
                                                {isActive ? <ChevronDown size={16} className="text-gray-400" /> : <Plus size={16} className="text-gray-400" />}
                                            </button>
                                        </div>
                                        {isActive && <div className="p-4 pt-0 animate-fadeIn">{section.component}</div>}
                                    </div>
                                );
                            })
                        })()}
                    </div>
                )}

                {view === 'templates' && (
                    // Templates Grid
                    <div className="p-4 grid grid-cols-2 gap-3">
                        {templates.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    onTemplateChange(t.id);
                                }}
                                className={`group relative aspect-[210/297] rounded-lg border-2 transition-all overflow-hidden ${currentTemplate === t.id
                                    ? 'border-brand-green ring-2 ring-brand-green/20'
                                    : 'border-brand-border hover:border-brand-green/50'
                                    }`}
                            >
                                {/* Actual Template Preview */}
                                <div className="absolute inset-0 bg-gray-50 overflow-hidden">
                                    <div className="absolute inset-0 flex items-start justify-center">
                                        <div className="origin-top transform scale-[0.15] pointer-events-none select-none">
                                            <ResumePreview data={data} template={t.id} />
                                        </div>
                                    </div>
                                </div>

                                {/* Template Name Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold text-white text-center block">{t.name}</span>
                                </div>

                                {/* Active Indicator */}
                                {currentTemplate === t.id && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-brand-green rounded-full flex items-center justify-center shadow-lg z-10">
                                        <Check size={12} className="text-white" />
                                    </div>
                                )}

                                {/* Premium Indicator */}
                                {!canAccessTemplate(userSubscription.planId, t.id) && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-brand-dark/90 rounded-full flex items-center justify-center shadow-lg z-10 border border-white/20">
                                        <Crown size={12} className="text-amber-400 fill-current" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {view === 'analytics' && (
                    <AnalyticsDashboard data={data} isSidebar={true} auditResult={auditResult} />
                )}
            </div>
        </div>
    );
}
