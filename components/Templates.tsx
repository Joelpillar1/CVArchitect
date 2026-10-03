import React, { useState } from 'react';
import { TemplateType, ResumeData } from '../types';
import {
    ArrowRight,
    Crown,
    Eye,
    X,
    LayoutTemplate,
    Search,
    Lock,
    Unlock,
    Sparkles,
    Check
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
                                        className="group bg-[#EEF1F4] rounded-[24px] border border-gray-200/80 p-3 sm:p-3.5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                                        onClick={() => onSelect(template.id)}
                                    >
                                        {/* Top Card Header */}
                                        <div className="flex items-center justify-between gap-2 mb-2.5">
                                            {/* Category / Name Pill */}
                                            <div className="bg-[#6F7682] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-2xs tracking-tight truncate max-w-[170px]">
                                                {template.name}
                                            </div>

                                            {/* Right Action / Lock Circle (Pro Only) */}
                                            {!isPublic && !isFree && (
                                                <div
                                                    className="w-6 h-6 rounded-full bg-[#6F7682] text-white flex items-center justify-center shadow-2xs shrink-0"
                                                    title="Pro Template"
                                                >
                                                    <Lock size={11} className="stroke-[2.5]" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Inner White Preview Canvas */}
                                        <div className="relative w-full aspect-[4/3] bg-white rounded-xl border border-gray-200/70 overflow-hidden shadow-2xs flex items-center justify-center">
                                            {/* Scaled Resume Preview - Centered */}
                                            <div className="absolute inset-0 flex items-start justify-center pt-2 overflow-hidden pointer-events-none select-none">
                                                <div className="w-[210mm] origin-top transform scale-[0.27] sm:scale-[0.29] pointer-events-none select-none shadow-xs rounded-xs bg-white">
                                                    <ResumePreview data={getPreviewDataForTemplate(template.id)} template={template.id} />
                                                </div>
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/25 backdrop-blur-[2px] p-3">
                                                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-200 flex flex-col gap-1.5 w-full max-w-[170px]">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onSelect(template.id); }}
                                                        className="w-full bg-brand-green hover:bg-brand-greenHover text-brand-dark px-3.5 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs"
                                                    >
                                                        Use Template <ArrowRight size={13} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template.id); }}
                                                        className="w-full bg-white hover:bg-gray-50 text-brand-dark px-3.5 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs"
                                                    >
                                                        <Eye size={13} /> Quick View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Subtitle Line */}
                                        <div className="mt-2 px-1 flex items-center justify-between text-xs text-gray-500">
                                            <span className="font-medium truncate">{template.subtitle}</span>
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 ml-2">
                                                {isFree ? 'Free' : 'Pro'}
                                            </span>
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