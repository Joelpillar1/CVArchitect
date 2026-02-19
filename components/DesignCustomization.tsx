import React, { useState } from 'react';
import { ResumeData, TemplateType } from '../types';
import { Layout, Type, Palette, AlignJustify, Move, Save, AlignLeft, AlignCenter, AlignRight, X, Check } from 'lucide-react';
import { FREE_TEMPLATES } from '../utils/pricingConfig';

interface DesignCustomizationProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    currentTemplate: TemplateType;
    onTemplateChange: (template: TemplateType) => void;
    onSaveAsTemplate: () => void;
}

export default function DesignCustomization({
    data,
    onChange,
    currentTemplate,
    onTemplateChange,
    onSaveAsTemplate
}: DesignCustomizationProps) {
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [templateName, setTemplateName] = useState('');

    const handleChange = (field: keyof ResumeData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleNestedChange = (parent: keyof ResumeData, child: string, value: number) => {
        onChange({
            ...data,
            [parent]: {
                ...(data[parent] as any),
                [child]: value
            }
        });
    };

    const handleSaveTemplate = () => {
        if (templateName.trim()) {
            // Update the currentTag in data before saving
            onChange({ ...data, currentTag: templateName.trim() });
            // Small delay to ensure state is updated
            setTimeout(() => {
                onSaveAsTemplate();
                setShowSaveDialog(false);
                setTemplateName('');
            }, 100);
        }
    };

    const fonts = [
        'Helvetica, Arial, sans-serif',
        'Times New Roman, Times, serif',
        'Georgia, serif',
        'Courier New, Courier, monospace',
        'Verdana, sans-serif',
        'Roboto, sans-serif',
        'Open Sans, sans-serif',
        'Lato, sans-serif',
        'Montserrat, sans-serif'
    ];

    const colors = [
        '#000000', // Black
        '#333C4D', // Brand Dark
        '#2563EB', // Blue
        '#7C3AED', // Purple
        '#DB2777', // Pink
        '#DC2626', // Red
        '#D97706', // Amber
        '#059669', // Emerald
        '#0D9488', // Teal
        '#4B5563', // Gray
    ];

    const templates: { id: TemplateType; name: string }[] = [
        { id: 'vanguard', name: 'The Vanguard' },
        { id: 'elevate', name: 'Elevate Resume' },
        { id: 'prime', name: 'Prime Profile' },
        { id: 'impact', name: 'Impact' },
        { id: 'free', name: 'CareerCraft' },
        { id: 'simplepro', name: 'SimplePro' },
        { id: 'dev', name: 'DevPro' },
        { id: 'modern', name: 'Modern' },
        { id: 'executive', name: 'Executive' },
        { id: 'classic', name: 'Classic' },
        { id: 'elite', name: 'Elite Professional' },
        { id: 'apex', name: 'Apex Executive' },
        { id: 'wonsulting', name: 'Ivy League' },
        { id: 'styled', name: 'Styled Professional' },
        { id: 'smart', name: 'Smart Professional' },
        { id: 'elegant', name: 'Elegant Professional' },
        { id: 'minimalist', name: 'Minimalist Serif' },
        { id: 'professional', name: 'Professional Clean' },
        { id: 'twocolumn', name: 'Two Column Professional' },
        { id: 'sage', name: 'Sage' }
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
        <div className="space-y-8 animate-fadeIn">
            {/* Template Selection */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-dark flex items-center gap-2">
                    <Layout size={20} className="text-brand-green" />
                    Template
                </h3>
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Select Template</label>
                    <select
                        value={currentTemplate}
                        onChange={(e) => onTemplateChange(e.target.value as TemplateType)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all text-sm"
                    >
                        {sortedTemplates.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => setShowSaveDialog(true)}
                    className="w-full flex items-center justify-center gap-2 bg-brand-dark text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    <Save size={16} /> Save as New Template
                </button>
            </div>

            {/* Typography */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-dark flex items-center gap-2">
                    <Type size={20} className="text-brand-green" />
                    Typography
                </h3>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Font Family</label>
                    <select
                        value={data.font}
                        onChange={(e) => handleChange('font', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all text-sm"
                    >
                        {fonts.map(font => (
                            <option key={font} value={font} style={{ fontFamily: font }}>
                                {font.split(',')[0]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Base Font Size</label>
                        <input
                            type="range"
                            min="8"
                            max="14"
                            step="0.5"
                            value={data.fontSizes?.body || 10.5}
                            onChange={(e) => handleNestedChange('fontSizes', 'body', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                        <div className="text-right text-xs text-gray-400">{data.fontSizes?.body}pt</div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Line Height</label>
                        <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.1"
                            value={data.lineHeight || 1.4}
                            onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                        <div className="text-right text-xs text-gray-400">{data.lineHeight}</div>
                    </div>
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-dark flex items-center gap-2">
                    <Palette size={20} className="text-brand-green" />
                    Accent Color
                </h3>
                <div className="flex flex-wrap gap-3">
                    {colors.map(color => (
                        <button
                            key={color}
                            onClick={() => handleChange('accentColor', color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${data.accentColor === color ? 'border-brand-dark scale-110 shadow-md' : 'border-transparent hover:scale-105'
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                    <input
                        type="color"
                        value={data.accentColor || '#000000'}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-none p-0"
                        title="Custom Color"
                    />
                </div>
            </div>

            {/* Header Alignment */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-dark flex items-center gap-2">
                    <AlignJustify size={20} className="text-brand-green" />
                    Header Alignment
                </h3>
                <p className="text-sm text-gray-500">
                    Align name, professional title, and contact information
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleChange('headerAlignment', 'left')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${data.headerAlignment === 'left' || !data.headerAlignment
                            ? 'border-brand-green bg-brand-green/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <AlignLeft size={24} className={data.headerAlignment === 'left' || !data.headerAlignment ? 'text-brand-green' : 'text-gray-400'} />
                        <span className={`text-sm font-medium ${data.headerAlignment === 'left' || !data.headerAlignment ? 'text-brand-green' : 'text-gray-600'}`}>
                            Left
                        </span>
                    </button>
                    <button
                        onClick={() => handleChange('headerAlignment', 'center')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${data.headerAlignment === 'center'
                            ? 'border-brand-green bg-brand-green/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <AlignCenter size={24} className={data.headerAlignment === 'center' ? 'text-brand-green' : 'text-gray-400'} />
                        <span className={`text-sm font-medium ${data.headerAlignment === 'center' ? 'text-brand-green' : 'text-gray-600'}`}>
                            Center
                        </span>
                    </button>
                    <button
                        onClick={() => handleChange('headerAlignment', 'right')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${data.headerAlignment === 'right'
                            ? 'border-brand-green bg-brand-green/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <AlignRight size={24} className={data.headerAlignment === 'right' ? 'text-brand-green' : 'text-gray-400'} />
                        <span className={`text-sm font-medium ${data.headerAlignment === 'right' ? 'text-brand-green' : 'text-gray-600'}`}>
                            Right
                        </span>
                    </button>
                </div>
            </div>

            {/* Content Alignment */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-dark flex items-center gap-2">
                    <AlignJustify size={20} className="text-brand-green" />
                    Content Alignment
                </h3>
                <p className="text-sm text-gray-500">
                    Align summary, experience, achievements, and other body content
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleChange('contentAlignment', 'left')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${data.contentAlignment === 'left' || !data.contentAlignment
                            ? 'border-brand-green bg-brand-green/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <AlignLeft size={24} className={data.contentAlignment === 'left' || !data.contentAlignment ? 'text-brand-green' : 'text-gray-400'} />
                        <span className={`text-sm font-medium ${data.contentAlignment === 'left' || !data.contentAlignment ? 'text-brand-green' : 'text-gray-600'}`}>
                            Left
                        </span>
                    </button>
                    <button
                        onClick={() => handleChange('contentAlignment', 'center')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${data.contentAlignment === 'center'
                            ? 'border-brand-green bg-brand-green/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <AlignCenter size={24} className={data.contentAlignment === 'center' ? 'text-brand-green' : 'text-gray-400'} />
                        <span className={`text-sm font-medium ${data.contentAlignment === 'center' ? 'text-brand-green' : 'text-gray-600'}`}>
                            Center
                        </span>
                    </button>
                    <button
                        onClick={() => handleChange('contentAlignment', 'right')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${data.contentAlignment === 'right'
                            ? 'border-brand-green bg-brand-green/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <AlignRight size={24} className={data.contentAlignment === 'right' ? 'text-brand-green' : 'text-gray-400'} />
                        <span className={`text-sm font-medium ${data.contentAlignment === 'right' ? 'text-brand-green' : 'text-gray-600'}`}>
                            Right
                        </span>
                    </button>
                </div>
            </div>

            {/* Spacing & Margins */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-dark flex items-center gap-2">
                    <Move size={20} className="text-brand-green" />
                    Spacing & Margins
                </h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Section Gap</span>
                            <span className="text-gray-400 text-xs">{data.sectionGap}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.05"
                            max="0.5"
                            step="0.01"
                            value={data.sectionGap || 0.14}
                            onChange={(e) => handleChange('sectionGap', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Header Gap</span>
                            <span className="text-gray-400 text-xs">{data.headerGap}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.05"
                            max="0.5"
                            step="0.01"
                            value={data.headerGap || 0.15}
                            onChange={(e) => handleChange('headerGap', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Header Item Gap</span>
                            <span className="text-gray-400 text-xs">{data.headerItemGap}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.02"
                            max="0.3"
                            step="0.01"
                            value={data.headerItemGap || 0.08}
                            onChange={(e) => handleChange('headerItemGap', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Top & Bottom Margins</span>
                            <span className="text-gray-400 text-xs">{data.margins?.vertical}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.2"
                            max="1"
                            step="0.05"
                            value={data.margins?.vertical || 0.45}
                            onChange={(e) => handleNestedChange('margins', 'vertical', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Left & Right Margins</span>
                            <span className="text-gray-400 text-xs">{data.margins?.horizontal}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.2"
                            max="1"
                            step="0.05"
                            value={data.margins?.horizontal || 0.39}
                            onChange={(e) => handleNestedChange('margins', 'horizontal', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                    </div>
                </div>
            </div>

            {/* Save Template Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-brand-dark">Save Template</h3>
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setTemplateName('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            Give your template a memorable name to easily find it later.
                        </p>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Template Name</label>
                            <input
                                type="text"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && templateName.trim()) {
                                        handleSaveTemplate();
                                    }
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                placeholder="e.g., Software Engineer Resume"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setTemplateName('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTemplate}
                                disabled={!templateName.trim()}
                                className="flex-1 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-greenHover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Check size={16} />
                                Save Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
