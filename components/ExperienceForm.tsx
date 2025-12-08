import React, { useState } from 'react';
import { ResumeData, Experience } from '../types';
import { Plus, Trash2, Calendar, MapPin, Building, GripVertical, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { enhanceDescription } from './utils/aiEnhancer';

interface ExperienceFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function ExperienceForm({ data, onChange, onAIAction }: ExperienceFormProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [enhancingId, setEnhancingId] = useState<string | null>(null);

    // ... (rest of methods)

    const handleAdd = () => {
        // ...
        const newExperience: Experience = {
            id: Date.now().toString(),
            company: '',
            role: '',
            location: '',
            startDate: '',
            endDate: '',
            description: ''
        };
        onChange({ ...data, experience: [...data.experience, newExperience] });
    };

    const handleRemove = (id: string) => {
        onChange({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
    };

    const handleChange = (id: string, field: keyof Experience, value: string) => {
        onChange({
            ...data,
            experience: data.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        });
    };

    // ... (rest of simple handlers)

    // Helper to keep code concise
    const handleEnhanceDescription = async (exp: Experience) => {
        if (!exp.description.trim()) {
            alert('Please write a description first.');
            return;
        }

        // Check/deduct credits
        if (onAIAction) {
            const allowed = onAIAction('ai_rewrite');
            if (!allowed) return;
        }

        setEnhancingId(exp.id);
        try {
            const index = data.experience.findIndex(e => e.id === exp.id);
            const enhanced = await enhanceDescription(
                exp.description,
                exp.role || 'Professional',
                exp.company || 'Company',
                {
                    index: index !== -1 ? index : 0,
                    totalCount: data.experience.length
                }
            );
            handleChange(exp.id, 'description', enhanced);
        } catch (error) {
            alert('Failed to enhance. Check your API key.');
            console.error(error);
        } finally {
            setEnhancingId(null);
        }
    };

    // ... rest of component until rendering ...
    // Inside render loop:


    const handleCurrentPositionToggle = (id: string, isChecked: boolean) => {
        onChange({
            ...data,
            experience: data.experience.map(exp =>
                exp.id === id ? { ...exp, endDate: isChecked ? 'Present' : '' } : exp
            )
        });
    };

    const moveExperience = (index: number, direction: 'up' | 'down') => {
        const newExperience = [...data.experience];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newExperience.length) return;

        [newExperience[index], newExperience[targetIndex]] = [newExperience[targetIndex], newExperience[index]];
        onChange({ ...data, experience: newExperience });
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newExperience = [...data.experience];
        const draggedItem = newExperience[draggedIndex];
        newExperience.splice(draggedIndex, 1);
        newExperience.splice(index, 0, draggedItem);

        onChange({ ...data, experience: newExperience });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const formatDateForInput = (dateStr: string): string => {
        if (!dateStr || dateStr.toLowerCase() === 'present') return '';
        if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;
        return dateStr;
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-6">
                {data.experience.map((exp, index) => {
                    const isCurrentPosition = exp.endDate?.toLowerCase() === 'present';

                    return (
                        <div
                            key={exp.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 group hover:border-brand-green/50 transition-all ${draggedIndex === index ? 'opacity-50' : ''
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-brand-green transition-colors">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="text-sm font-medium text-gray-400">Position {index + 1}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => moveExperience(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Move up"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveExperience(index, 'down')}
                                        disabled={index === data.experience.length - 1}
                                        className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Move down"
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleRemove(exp.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-1"
                                        title="Remove position"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Job Title</label>
                                    <input
                                        type="text"
                                        value={exp.role}
                                        onChange={(e) => handleChange(exp.id, 'role', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="Senior Developer"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Building size={12} /> Company
                                    </label>
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="Tech Corp Inc."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <MapPin size={12} /> Location
                                    </label>
                                    <input
                                        type="text"
                                        value={exp.location || ''}
                                        onChange={(e) => handleChange(exp.id, 'location', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Calendar size={12} /> Start Date
                                    </label>
                                    <input
                                        type="month"
                                        value={formatDateForInput(exp.startDate)}
                                        onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                    />
                                    <label className="flex items-center gap-1.5 cursor-pointer pt-1">
                                        <input
                                            type="checkbox"
                                            checked={isCurrentPosition}
                                            onChange={(e) => handleCurrentPositionToggle(exp.id, e.target.checked)}
                                            className="w-3.5 h-3.5 text-brand-green border-gray-300 rounded focus:ring-brand-green accent-brand-green cursor-pointer"
                                        />
                                        <span className="text-xs font-medium text-gray-600">I currently work here</span>
                                    </label>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Calendar size={12} /> End Date
                                    </label>
                                    <input
                                        type="month"
                                        value={formatDateForInput(exp.endDate)}
                                        onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                                        disabled={isCurrentPosition}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder={isCurrentPosition ? 'Present' : ''}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Description & Achievements</label>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                                    rows={4}
                                    className="w-full p-3 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                                    placeholder="• Led a team of 5 developers...&#10;• Increased performance by 20%...&#10;• Implemented new features..."
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleEnhanceDescription(exp)}
                                        disabled={enhancingId === exp.id || !exp.description.trim()}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                        title="Enhance with AI (3 credits)"
                                    >
                                        <Sparkles size={12} className={enhancingId === exp.id ? 'animate-spin' : ''} />
                                        {enhancingId === exp.id ? 'Enhancing...' : 'Rewrite'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-brand-dark bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 rounded-lg transition-all"
                >
                    <Plus size={16} /> Add Position
                </button>
            </div>
        </div>
    );
}
