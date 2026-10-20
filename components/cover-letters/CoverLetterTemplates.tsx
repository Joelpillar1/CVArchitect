import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    ArrowRight,
    Eye,
    X,
    LayoutTemplate,
    Search,
    Check
} from 'lucide-react';
import {
    CoverLetterTemplateType,
    CoverLetterTemplateConfig,
    COVER_LETTER_TEMPLATES
} from '../../utils/coverLetterConfig';
import CoverLetterPreview from './CoverLetterPreview';

interface CoverLetterTemplatesProps {
    onSelectTemplate: (templateId: CoverLetterTemplateType) => void;
    selectedTemplateId?: CoverLetterTemplateType;
    isPublic?: boolean;
}

export default function CoverLetterTemplates({
    onSelectTemplate,
    selectedTemplateId,
    isPublic = false
}: CoverLetterTemplatesProps) {
    const [previewTemplate, setPreviewTemplate] = useState<CoverLetterTemplateType | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPreviewTemplate(null);
            }
        };
        if (previewTemplate) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [previewTemplate]);

    const categories = ['All', 'Modern', 'Professional', 'Executive'];

    const filteredTemplates = COVER_LETTER_TEMPLATES.filter(t => {
        const matchesSearch =
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;
        if (selectedCategory === 'All') return true;
        return t.category === selectedCategory;
    });

    const activePreviewConfig = COVER_LETTER_TEMPLATES.find(t => t.id === previewTemplate);

    return (
        <div className="w-full">
            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                                selectedCategory === cat
                                    ? 'bg-brand-dark text-white shadow-xs'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Compact Search Bar */}
                <div className="relative w-full sm:w-64 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-gray-200 bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all shadow-2xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="pb-8">
                {filteredTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTemplates.map((template) => {
                            const isSelected = selectedTemplateId === template.id;
                            return (
                                <div
                                    key={template.id}
                                    className={`group bg-[#EEF1F4] rounded-[24px] border p-3 sm:p-3.5 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col ${
                                        isSelected
                                            ? 'border-brand-green ring-2 ring-brand-green/30 shadow-md'
                                            : 'border-gray-200/80 hover:border-gray-300'
                                    }`}
                                    onClick={() => onSelectTemplate(template.id)}
                                >
                                    {/* Top Card Header */}
                                    <div className="flex items-center justify-between gap-2 mb-2.5">
                                        <div className="bg-[#6F7682] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-2xs tracking-tight truncate max-w-[170px]">
                                            {template.name}
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {isSelected && (
                                                <span className="flex items-center gap-1 bg-brand-green/20 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                                    <Check size={11} className="stroke-[3]" /> Active
                                                </span>
                                            )}
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 px-1">
                                                {template.isFree ? 'Free' : 'Pro'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Preview Canvas - Styled as Portrait A4 sheet viewport */}
                                    <div className="relative w-full aspect-[1/1.25] bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-2xs flex items-start justify-center pt-2">
                                        <div className="w-[210mm] origin-top transform scale-[0.32] sm:scale-[0.34] pointer-events-none select-none shadow-xs rounded-xs bg-white">
                                            <CoverLetterPreview template={template.id} />
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/25 backdrop-blur-[2px] p-3">
                                            <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-200 flex flex-col gap-2 w-full max-w-[170px]">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectTemplate(template.id);
                                                    }}
                                                    className="w-full px-3.5 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs bg-brand-green hover:bg-brand-greenHover text-brand-dark"
                                                >
                                                    Use Template <ArrowRight size={13} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewTemplate(template.id);
                                                    }}
                                                    className="w-full bg-white hover:bg-gray-50 text-brand-dark px-3.5 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs"
                                                >
                                                    <Eye size={13} /> Quick View
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Subtitle Line */}
                                    <div className="mt-2.5 px-1 flex items-center justify-between text-xs text-gray-500">
                                        <span className="font-medium truncate">{template.subtitle}</span>
                                        <span className="text-[11px] font-semibold text-gray-400 shrink-0 ml-2">
                                            {template.category}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-xl border border-dashed border-gray-200 max-w-xl mx-auto">
                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <LayoutTemplate className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-brand-dark">No Templates Match Your Search</h3>
                        <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
                            Try adjusting your search query or switching categories.
                        </p>
                    </div>
                )}
            </div>

            {/* Full Screen Quick View Preview with Transparent Backdrop */}
            {previewTemplate && activePreviewConfig && createPortal(
                <div 
                    className="fixed inset-0 z-[100] w-screen h-screen bg-black/60 backdrop-blur-sm flex flex-col overflow-hidden animate-fadeIn"
                    onClick={() => setPreviewTemplate(null)}
                >
                    {/* Header */}
                    <div 
                        className="flex items-center justify-between px-6 py-4 bg-transparent shrink-0 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-sm">
                                {activePreviewConfig.name} Template Preview
                            </h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                title="Close (Esc)"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    onSelectTemplate(previewTemplate);
                                    setPreviewTemplate(null);
                                }}
                                className="px-6 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 bg-brand-green hover:bg-brand-greenHover text-brand-dark text-xs sm:text-sm active:scale-95"
                            >
                                Use This Template <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Transparent Canvas with centered A4 Document */}
                    <div 
                        className="flex-1 overflow-y-auto flex justify-center items-start py-8 px-4 bg-transparent cursor-pointer"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setPreviewTemplate(null);
                            }
                        }}
                    >
                        <div 
                            className="shadow-2xl rounded-xs bg-white overflow-hidden origin-top my-2 cursor-default ring-1 ring-black/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CoverLetterPreview template={previewTemplate} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
