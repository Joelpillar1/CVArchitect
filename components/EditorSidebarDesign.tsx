import React, { useEffect, useState } from 'react';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Type, Bold, Italic, Underline, Strikethrough,
    MoveHorizontal, MoveVertical, Grid, Layers,
    ChevronDown, ChevronRight, Settings, Sliders, Save, GitBranch
} from 'lucide-react';
import { ResumeData } from '../types';
import VersionHistory from './VersionHistory';

interface EditorSidebarDesignProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onSave?: (data?: ResumeData) => void;
    onSaveAsTemplate?: (data?: ResumeData) => void;
    currentResumeId?: string | null;
}

export default function EditorSidebarDesign({ data, onChange, onSave, onSaveAsTemplate, currentResumeId }: EditorSidebarDesignProps) {
    const [templateName, setTemplateName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showVersionHistory, setShowVersionHistory] = useState(false);

    const handleNestedChange = (parent: keyof ResumeData, child: string, value: any) => {
        onChange({
            ...data,
            [parent]: {
                ...((data[parent] as any) || {}),
                [child]: value
            }
        });
    };

    // Keep local input in sync with the current tag so the name you saved with is always visible
    useEffect(() => {
        if (data.currentTag && data.currentTag !== templateName) {
            setTemplateName(data.currentTag);
        }
    }, [data.currentTag]);

    const handleSaveTemplate = () => {
        setIsSaving(true);

        const finalName = templateName.trim() || data.currentTag || 'Untitled Resume';

        // Create updated data with the template name (or fallback)
        const updatedData = { ...data, currentTag: finalName };

        // Update local state
        onChange(updatedData);

        // Pass the updated data directly to save callback
        if (onSaveAsTemplate) {
            onSaveAsTemplate(updatedData);
        }

        setIsSaving(false);
    };

    const handleSave = () => {
        setIsSaving(true);
        const updatedData = { ...data, currentTag: data.currentTag || templateName.trim() || 'Untitled' };
        onChange(updatedData);
        if (onSave) {
            onSave(updatedData);
        }
        setIsSaving(false);
    };

    return (
        <div className="w-full h-full bg-brand-bg flex flex-col overflow-y-auto">

            {/* Align Section */}
            <div className="p-4 border-b border-brand-border space-y-4">
                <div>
                    <h3 className="text-xs font-bold text-gray-900 mb-3">Header Align</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onChange({ ...data, headerAlignment: 'left' })}
                            className={`p-2 rounded hover:bg-brand-secondary ${data.headerAlignment === 'left' ? 'bg-brand-secondary text-brand-dark' : 'text-gray-400'}`}
                            title="Align Left"
                        >
                            <AlignLeft size={18} />
                        </button>
                        <button
                            onClick={() => onChange({ ...data, headerAlignment: 'center' })}
                            className={`p-2 rounded hover:bg-brand-secondary ${data.headerAlignment === 'center' ? 'bg-brand-secondary text-brand-dark' : 'text-gray-400'}`}
                            title="Align Center"
                        >
                            <AlignCenter size={18} />
                        </button>
                        <button
                            onClick={() => onChange({ ...data, headerAlignment: 'right' })}
                            className={`p-2 rounded hover:bg-brand-secondary ${data.headerAlignment === 'right' ? 'bg-brand-secondary text-brand-dark' : 'text-gray-400'}`}
                            title="Align Right"
                        >
                            <AlignRight size={18} />
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-900 mb-3">Body Align</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onChange({ ...data, bodyHeaderAlignment: 'left' })}
                            className={`p-2 rounded hover:bg-brand-secondary ${data.bodyHeaderAlignment === 'left' ? 'bg-brand-secondary text-brand-dark' : 'text-gray-400'}`}
                            title="Align Left"
                        >
                            <AlignLeft size={18} />
                        </button>
                        <button
                            onClick={() => onChange({ ...data, bodyHeaderAlignment: 'center' })}
                            className={`p-2 rounded hover:bg-brand-secondary ${data.bodyHeaderAlignment === 'center' ? 'bg-brand-secondary text-brand-dark' : 'text-gray-400'}`}
                            title="Align Center"
                        >
                            <AlignCenter size={18} />
                        </button>
                        <button
                            onClick={() => onChange({ ...data, bodyHeaderAlignment: 'right' })}
                            className={`p-2 rounded hover:bg-brand-secondary ${data.bodyHeaderAlignment === 'right' ? 'bg-brand-secondary text-brand-dark' : 'text-gray-400'}`}
                            title="Align Right"
                        >
                            <AlignRight size={18} />
                        </button>
                    </div>
                </div>
                {/* Skills Layout */}
                <div>
                    <h3 className="text-xs font-bold text-gray-900 mb-3">Skills Layout</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onChange({ ...data, skillsColumnCount: 2 })}
                            className={`px-3 py-2 rounded text-xs font-medium border transition-colors ${data.skillsColumnCount === 2
                                ? 'bg-brand-secondary text-brand-dark border-brand-dark/20'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            2 Columns
                        </button>
                        <button
                            onClick={() => onChange({ ...data, skillsColumnCount: 3 })}
                            className={`px-3 py-2 rounded text-xs font-medium border transition-colors ${!data.skillsColumnCount || data.skillsColumnCount === 3
                                ? 'bg-brand-secondary text-brand-dark border-brand-dark/20'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            3 Columns
                        </button>
                    </div>
                </div>
            </div>

            {/* Text Properties */}
            <div className="p-4 border-b border-brand-border">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-900">Text</h3>
                </div>

                <div className="space-y-4">
                    {/* Font Family */}
                    <div className="relative">
                        <select
                            value={data.font || 'Inter, sans-serif'}
                            onChange={(e) => onChange({ ...data, font: e.target.value })}
                            className="w-full p-2.5 bg-brand-secondary border border-brand-border rounded-lg text-sm appearance-none focus:outline-none focus:border-brand-green"
                        >
                            <option value="Inter, sans-serif">Inter</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                            <option value="Open Sans, sans-serif">Open Sans</option>
                            <option value="Lato, sans-serif">Lato</option>
                            <option value="Montserrat, sans-serif">Montserrat</option>
                            <option value="Merriweather, serif">Merriweather</option>
                            <option value="Georgia, serif">Georgia</option>
                            <option value="Times New Roman, Times, serif">Times New Roman</option>
                            <option value="Helvetica, Arial, sans-serif">Helvetica</option>
                            <option value="Verdana, sans-serif">Verdana</option>
                            <option value="Courier New, Courier, monospace">Courier New</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Font Sizes */}
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-700">Font Sizes</label>

                        {/* Header/Name Size */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Header / Name</span>
                                <span className="text-xs text-gray-400">{data.fontSizes?.header || 24}pt</span>
                            </div>
                            <input
                                type="range"
                                min="16"
                                max="36"
                                step="1"
                                value={data.fontSizes?.header || 24}
                                onChange={(e) => handleNestedChange('fontSizes', 'header', parseFloat(e.target.value))}
                                className="w-full accent-brand-green"
                            />
                        </div>

                        {/* Job Title Size */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Professional Title</span>
                                <span className="text-xs text-gray-400">{data.fontSizes?.jobTitle || data.fontSizes?.body || 10}pt</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="24"
                                step="0.5"
                                value={data.fontSizes?.jobTitle || data.fontSizes?.body || 10}
                                onChange={(e) => handleNestedChange('fontSizes', 'jobTitle', parseFloat(e.target.value))}
                                className="w-full accent-brand-green"
                            />
                        </div>

                        {/* Section Title Size */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Section Titles</span>
                                <span className="text-xs text-gray-400">{data.fontSizes?.sectionTitle || 14}pt</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="20"
                                step="0.5"
                                value={data.fontSizes?.sectionTitle || 14}
                                onChange={(e) => handleNestedChange('fontSizes', 'sectionTitle', parseFloat(e.target.value))}
                                className="w-full accent-brand-green"
                            />
                        </div>

                        {/* Body Text Size */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Body Text</span>
                                <span className="text-xs text-gray-400">{data.fontSizes?.body || 10.5}pt</span>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="14"
                                step="0.5"
                                value={data.fontSizes?.body || 10.5}
                                onChange={(e) => handleNestedChange('fontSizes', 'body', parseFloat(e.target.value))}
                                className="w-full accent-brand-green"
                            />
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700">Accent Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={data.accentColor || '#000000'}
                                onChange={(e) => onChange({ ...data, accentColor: e.target.value })}
                                className="w-12 h-10 rounded border border-brand-border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={data.accentColor || '#000000'}
                                onChange={(e) => onChange({ ...data, accentColor: e.target.value })}
                                className="flex-1 p-2.5 bg-brand-secondary border border-brand-border rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-brand-green uppercase"
                                placeholder="#000000"
                            />
                        </div>

                        {/* Quick Color Presets */}
                        <div className="grid grid-cols-5 gap-2 p-2 bg-white border border-brand-border rounded-lg">
                            {['#000000', '#333C4D', '#2563EB', '#7C3AED', '#DB2777', '#DC2626', '#D97706', '#059669', '#0D9488', '#4B5563'].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => onChange({ ...data, accentColor: color })}
                                    className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${data.accentColor === color ? 'border-brand-green ring-2 ring-brand-green/30' : 'border-gray-200'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacing & Sizing */}
            <div className="p-4 border-b border-brand-border">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-900">Spacing & Margins</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Line Height</span>
                            <span className="text-gray-400">{data.lineHeight || 1.4}</span>
                        </label>
                        <input
                            type="range"
                            min="1.0"
                            max="2.0"
                            step="0.1"
                            value={data.lineHeight || 1.4}
                            onChange={(e) => onChange({ ...data, lineHeight: parseFloat(e.target.value) })}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Section Gap</span>
                            <span className="text-gray-400">{data.sectionGap || 0.2}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.05"
                            max="0.5"
                            step="0.01"
                            value={data.sectionGap || 0.2}
                            onChange={(e) => onChange({ ...data, sectionGap: parseFloat(e.target.value) })}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Header Gap</span>
                            <span className="text-gray-400">{data.headerGap || 0.15}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.05"
                            max="0.5"
                            step="0.01"
                            value={data.headerGap || 0.15}
                            onChange={(e) => onChange({ ...data, headerGap: parseFloat(e.target.value) })}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Header Item Gap</span>
                            <span className="text-gray-400">{data.headerItemGap || 0.08}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.02"
                            max="0.3"
                            step="0.01"
                            value={data.headerItemGap || 0.08}
                            onChange={(e) => onChange({ ...data, headerItemGap: parseFloat(e.target.value) })}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Top & Bottom Margins</span>
                            <span className="text-gray-400">{data.margins?.vertical || 0.4}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={data.margins?.vertical || 0.4}
                            onChange={(e) => handleNestedChange('margins', 'vertical', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-700 flex justify-between">
                            <span>Left & Right Margins</span>
                            <span className="text-gray-400">{data.margins?.horizontal || 0.4}in</span>
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={data.margins?.horizontal || 0.4}
                            onChange={(e) => handleNestedChange('margins', 'horizontal', parseFloat(e.target.value))}
                            className="w-full accent-brand-green"
                        />
                    </div>
                </div>
            </div>

            {/* Save & Save as Template */}
            <div className="p-4 border-b border-brand-border">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-900">Save Template</h3>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-gray-700">Template Name</label>
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && templateName.trim()) {
                                    handleSaveTemplate();
                                }
                            }}
                            className="w-full p-2.5 bg-brand-secondary border border-brand-border rounded-lg text-sm focus:outline-none focus:border-brand-green"
                            placeholder="e.g., My Custom Resume"
                        />
                    </div>

                    <div className="space-y-2">
                        {/* Save current template (update or create) */}
                        {onSave && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-green text-brand-dark rounded-lg text-sm font-bold hover:bg-brand-greenHover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            >
                                <Save size={16} />
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        )}

                        {/* Version History Button – only relevant when a resume already exists */}
                        {currentResumeId && (
                            <button
                                onClick={() => setShowVersionHistory(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
                            >
                                <GitBranch size={16} />
                                Version History
                            </button>
                        )}
                    </div>

                    {/* Save As button */}
                    <button
                        onClick={handleSaveTemplate}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-brand-green text-brand-dark rounded-lg text-sm font-semibold hover:bg-brand-green/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save as Template'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                        {currentResumeId ? 'Save changes to current resume or create a new template' : 'Save your current design settings as a custom template'}
                    </p>
                </div>
            </div>

            {/* Version History Modal */}
            {
                showVersionHistory && currentResumeId && (
                    <VersionHistory
                        resumeId={currentResumeId}
                        currentVersion={data.version_number || 1}
                        onRestore={(versionId) => {
                            // Reload the resume after restore
                            if (onSave) {
                                onSave();
                            }
                            setShowVersionHistory(false);
                        }}
                        onClose={() => setShowVersionHistory(false)}
                    />
                )
            }

        </div >
    );
}
