import React, { useState } from 'react';
import { TemplateType, ResumeData } from '../types';
import {
    ArrowRight,
    Crown,
    Eye,
    X,
    LayoutTemplate,
    Search
} from 'lucide-react';
import ResumePreview from './ResumePreview';
import { FREE_TEMPLATES } from '../utils/pricingConfig';
import { getTemplatePreviewData } from '../utils/sampleResumeData';
import { TEMPLATE_CONFIG } from '../utils/templateConfig';

interface TemplatesProps {
    onSelect: (template: TemplateType) => void;
    data: ResumeData;
    isPublic?: boolean;
}

export default function Templates({ onSelect, data, isPublic }: TemplatesProps) {
    const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);

    const templates = TEMPLATE_CONFIG;

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
        if (['entry level', 'graduate', 'finance', 'engineering', 'creative', 'chemical eng', 'marketing', 'leadership', 'student'].some(k => sub.includes(k))) return 'Student';
        if (['executive', 'senior leader', 'c-suite'].some(k => sub.includes(k))) return 'Executive';
        if (['modern tech', 'bold design', 'contemporary', 'clean', 'developer', 'modern'].some(k => sub.includes(k))) return 'Modern';
        if (['academic', 'research'].some(k => sub.includes(k))) return 'Academic';
        return 'Professional';
    };

    const categories = ['All', 'Professional', 'Modern', 'Student', 'Executive', 'Academic', 'Free', 'Pro'].filter(cat => {
        if (isPublic && (cat === 'Free' || cat === 'Pro')) return false;
        return true;
    });

    const getPreviewDataForTemplate = (templateId: TemplateType): ResumeData => {
        return getTemplatePreviewData(templateId);
    };

    const filteredTemplates = sortedTemplates.filter(t => {
        const isTemplateFree = FREE_TEMPLATES.includes(t.id);
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedCategory === 'Free') return isTemplateFree;
        if (selectedCategory === 'Pro') return !isTemplateFree;

        const category = getTemplateCategory(t);
        return selectedCategory === 'All' || category === selectedCategory;
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
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210mm] origin-top transform scale-[0.34] pointer-events-none select-none">
                                                <ResumePreview data={getPreviewDataForTemplate(template.id)} template={template.id} />
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
                                            {!isPublic && (
                                                <div className="shrink-0">
                                                    {isFree ? (
                                                        <div className="bg-brand-green/10 text-brand-green px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-brand-green/20">
                                                            FREE
                                                        </div>
                                                    ) : (
                                                        <div className="bg-brand-green/90 text-white px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                                                            <Crown size={10} className="text-[#1a1a2e] fill-current" /> PRO
                                                        </div>
                                                    )}
                                                </div>
                                            )}
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
                            <div className="scale-75 md:scale-90 origin-top transition-transform">
                                {previewTemplate && (
                                    <ResumePreview
                                        data={getPreviewDataForTemplate(previewTemplate)}
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