import React, { useState } from 'react';
import { TemplateType, ResumeData } from '../types';
import { ArrowRight, Crown, Eye, X, LayoutTemplate } from 'lucide-react';
import ResumePreview from './ResumePreview';
import { FREE_TEMPLATES } from '../utils/pricingConfig';

interface TemplatesProps {
    onSelect: (template: TemplateType) => void;
    data: ResumeData;
}

export default function Templates({ onSelect, data }: TemplatesProps) {
    const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);

    const templates: { id: TemplateType; name: string; description: string; bg: string }[] = [
        {
            id: 'free',
            name: "CareerCraft",
            description: "A simple, clean resume template with bullet-point sections and straightforward formatting. Perfect for getting started.",
            bg: "bg-[#FAFAFA]"
        },
        {
            id: 'simplepro',
            name: "SimplePro",
            description: "A clean two-column resume with orange accent line and professional layout. Perfect for showcasing experience and skills side-by-side.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'vanguard',
            name: "The Vanguard",
            description: "A modern, clean, and highly scannable layout perfect for tech and design roles.",
            bg: "bg-[#F8F8F8]"
        },
        {
            id: 'elevate',
            name: "Elevate Resume",
            description: "A classic, professional layout with centered header and clear hierarchy. Ideal for corporate and academic roles.",
            bg: "bg-[#FDFDFD]"
        },
        {
            id: 'prime',
            name: "Prime Profile",
            description: "An elegant, high-impact design featuring gold accents and a sophisticated centered header.",
            bg: "bg-[#FFFEFA]"
        },
        {
            id: 'impact',
            name: "Impact",
            description: "A bold, modern design with multi-column skills layout and clean professional formatting.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'dev',
            name: "DevPro",
            description: "A modern, ATS-optimized template designed specifically for developers. Features prominent technical skills section and clean code-like aesthetics.",
            bg: "bg-[#F8FAFC]"
        },
        {
            id: 'elite',
            name: "Elite Professional",
            description: "Premium ATS-optimized design for top-tier markets (USA, UK, Australia). Features strategic information hierarchy, high readability, and recruiter-friendly formatting.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'apex',
            name: "Apex Executive",
            description: "Sophisticated two-column layout for senior professionals. Left sidebar showcases contact and skills, while the right column highlights achievements and experience.",
            bg: "bg-[#FAFAFA]"
        },
        {
            id: 'modern',
            name: "Modern Professional",
            description: "A contemporary design with clean lines and modern aesthetics. Perfect for creative professionals and modern industries.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'executive',
            name: "Executive Suite",
            description: "An elegant, executive-level template designed for C-suite and senior leadership positions. Features refined typography and professional layout.",
            bg: "bg-[#FAFAFA]"
        },
        {
            id: 'classic',
            name: "Classic Professional",
            description: "A timeless, traditional resume format that works across all industries. Clean, professional, and universally accepted.",
            bg: "bg-[#F8F8F8]"
        },
        {
            id: 'wonsulting',
            name: "Ivy League",
            description: "A professional, single-column template favored by top recruiters. Clean layout with serif fonts and optimal readability.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'styled',
            name: "Styled Professional",
            description: "A sophisticated, high-end template with distinctive blue section headers and serif typography. Ideal for senior roles.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'smart',
            name: "Smart Professional",
            description: "A clean, academic-style template with dotted separators and clear hierarchy. Perfect for research and traditional industries.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'elegant',
            name: "Elegant Professional",
            description: "A refined template featuring centered dashed headers and a distinctive navy accent bar. Timeless and professional.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'minimalist',
            name: "Minimalist Serif",
            description: "A beautifully simple text-focused template with light background section headers. clean and easy to read.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'professional',
            name: "Professional Clean",
            description: "A clean, single-column template with centered header, underlined section titles, and right-aligned dates. Perfect for academic and traditional professional roles.",
            bg: "bg-[#FFFFFF]"
        },
        {
            id: 'twocolumn',
            name: "Two Column Professional",
            description: "A sophisticated two-column layout with narrow left sidebar for contact, education, and highlights, and wide right column for summary and experience. Clean, minimalist design with subtle accents.",
            bg: "bg-[#FFFFFF]"
        }
    ];

    // Sort templates: free templates first, then pro templates
    const sortedTemplates = [...templates].sort((a, b) => {
        const aIsFree = FREE_TEMPLATES.includes(a.id);
        const bIsFree = FREE_TEMPLATES.includes(b.id);
        if (aIsFree && !bIsFree) return -1;
        if (!aIsFree && bIsFree) return 1;
        return 0; // Maintain original order within each group
    });

    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-brand-bg">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-3">Choose Your Template</h2>
                    <p className="text-gray-500 text-base max-w-xl mx-auto">
                        Professional designs optimized for ATS systems.
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="pb-16">
                    {templates.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                            {sortedTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:border-brand-green hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    {/* Template Preview - Optimized CSS Preview */}
                                    <div className="aspect-[210/297] bg-gray-50 relative overflow-hidden p-4">
                                        {/* Template Style Preview */}
                                        <div className={`w-full h-full ${template.bg} rounded-sm shadow-inner p-3 flex flex-col gap-1.5`}>
                                            {/* Header simulation */}
                                            <div className={`h-8 ${template.id === 'prime' ? 'bg-amber-100' : template.id === 'dev' ? 'bg-blue-50' : 'bg-gray-100'} rounded-sm`}></div>
                                            <div className="h-1 bg-gray-200 w-3/4 rounded-full"></div>

                                            {/* Section 1 */}
                                            <div className="mt-2">
                                                <div className={`h-2 w-16 rounded-sm mb-1 ${template.id === 'simplepro' ? 'bg-orange-400' :
                                                    template.id === 'prime' ? 'bg-amber-500' :
                                                        template.id === 'dev' ? 'bg-blue-500' :
                                                            'bg-gray-700'
                                                    }`}></div>
                                                <div className="space-y-0.5">
                                                    <div className="h-1 bg-gray-300 w-full rounded-full"></div>
                                                    <div className="h-1 bg-gray-300 w-5/6 rounded-full"></div>
                                                    <div className="h-1 bg-gray-300 w-4/5 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Section 2 */}
                                            <div className="mt-2">
                                                <div className={`h-2 w-12 rounded-sm mb-1 ${template.id === 'simplepro' ? 'bg-orange-400' :
                                                    template.id === 'prime' ? 'bg-amber-500' :
                                                        template.id === 'dev' ? 'bg-blue-500' :
                                                            'bg-gray-700'
                                                    }`}></div>
                                                <div className="space-y-0.5">
                                                    <div className="h-1 bg-gray-300 w-full rounded-full"></div>
                                                    <div className="h-1 bg-gray-300 w-11/12 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Section 3 */}
                                            <div className="mt-2">
                                                <div className={`h-2 w-14 rounded-sm mb-1 ${template.id === 'simplepro' ? 'bg-orange-400' :
                                                    template.id === 'prime' ? 'bg-amber-500' :
                                                        template.id === 'dev' ? 'bg-blue-500' :
                                                            'bg-gray-700'
                                                    }`}></div>
                                                <div className="grid grid-cols-2 gap-0.5">
                                                    <div className="h-1 bg-gray-300 rounded-full"></div>
                                                    <div className="h-1 bg-gray-300 rounded-full"></div>
                                                    <div className="h-1 bg-gray-300 rounded-full"></div>
                                                    <div className="h-1 bg-gray-300 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        <div className={`absolute top-2 right-2 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wide ${template.id === 'free' || template.id === 'simplepro' || template.id === 'minimalist' || template.id === 'twocolumn'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-brand-dark text-brand-green'
                                            }`}>
                                            {template.id === 'free' || template.id === 'simplepro' || template.id === 'minimalist' || template.id === 'twocolumn' ? (
                                                <>FREE</>
                                            ) : (
                                                <>
                                                    <Crown size={8} className="fill-brand-green" />
                                                    Pro
                                                </>
                                            )}
                                        </div>

                                        {/* Hover Overlay with Select and Preview buttons */}
                                        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-dark/20 backdrop-blur-[1px]">
                                            <div className="transform scale-90 group-hover:scale-100 transition-transform duration-200 flex flex-col gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onSelect(template.id); }}
                                                    className="bg-brand-green hover:bg-brand-greenHover text-brand-dark px-5 py-2 rounded-lg font-bold shadow-xl transition-all flex items-center justify-center gap-1.5 text-sm"
                                                >
                                                    Select <ArrowRight size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template.id); }}
                                                    className="bg-white/90 hover:bg-white text-brand-dark px-5 py-2 rounded-lg font-bold shadow-xl transition-all flex items-center justify-center gap-1.5 text-sm border border-gray-200"
                                                >
                                                    <Eye size={14} /> Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Template Info */}
                                    <div className="p-3 bg-white border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-brand-dark truncate">{template.name}</h3>
                                    </div>
                                </div>
                            ))}
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
                                {previewTemplate && <ResumePreview data={data} template={previewTemplate} />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}