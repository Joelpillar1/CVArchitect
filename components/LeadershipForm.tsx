import React, { useState } from 'react';
import { ResumeData, Experience } from '../types';
import { Plus, Trash2, Calendar, MapPin, Building, GripVertical, ChevronUp, ChevronDown, Sparkles, Users } from 'lucide-react';
import { enhanceDescription } from './utils/aiEnhancer';

interface LeadershipFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function LeadershipForm({ data, onChange, onAIAction }: LeadershipFormProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [enhancingId, setEnhancingId] = useState<string | null>(null);

    // Initialize if undefined
    const leadership = data.leadership || [];

    const handleAdd = () => {
        const newEntry: Experience = {
            id: Date.now().toString(),
            company: '', // Using company field for Organization
            role: '',    // Using role for Role
            location: '',
            startDate: '',
            endDate: '',
            description: ''
        };
        onChange({ ...data, leadership: [...leadership, newEntry] });
    };

    const handleRemove = (id: string) => {
        onChange({ ...data, leadership: leadership.filter(item => item.id !== id) });
    };

    const handleChange = (id: string, field: keyof Experience, value: string) => {
        onChange({
            ...data,
            leadership: leadership.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        });
    };

    const handleEnhanceDescription = async (item: Experience) => {
        if (!item.description.trim()) {
            alert('Please write a description first.');
            return;
        }

        if (onAIAction) {
            const allowed = onAIAction('ai_rewrite');
            if (!allowed) return;
        }

        setEnhancingId(item.id);
        try {
            const enhanced = await enhanceDescription(
                item.description,
                item.role || 'Leader',
                item.company || 'Organization'
            );
            handleChange(item.id, 'description', enhanced);
        } catch (error) {
            alert('Failed to enhance. Check your API key.');
            console.error(error);
        } finally {
            setEnhancingId(null);
        }
    };

    const handleCurrentPositionToggle = (id: string, isChecked: boolean) => {
        onChange({
            ...data,
            leadership: leadership.map(item =>
                item.id === id ? { ...item, endDate: isChecked ? 'Present' : '' } : item
            )
        });
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newLeadership = [...leadership];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newLeadership.length) return;

        [newLeadership[index], newLeadership[targetIndex]] = [newLeadership[targetIndex], newLeadership[index]];
        onChange({ ...data, leadership: newLeadership });
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newLeadership = [...leadership];
        const draggedItem = newLeadership[draggedIndex];
        newLeadership.splice(draggedIndex, 1);
        newLeadership.splice(index, 0, draggedItem);

        onChange({ ...data, leadership: newLeadership });
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
            {leadership.length === 0 && (
                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <p className="text-sm text-gray-500 mb-4">Add your leadership roles, volunteering, or community involvement.</p>
                </div>
            )}

            <div className="space-y-6">
                {leadership.map((item, index) => {
                    const isCurrentPosition = item.endDate?.toLowerCase() === 'present';

                    return (
                        <div
                            key={item.id}
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
                                    <div className="text-sm font-medium text-gray-400">Activity {index + 1}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Move up"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === leadership.length - 1}
                                        className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Move down"
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-1"
                                        title="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Building size={12} /> Organization
                                    </label>
                                    <input
                                        type="text"
                                        value={item.company}
                                        onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="Organization Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Role / Title</label>
                                    <input
                                        type="text"
                                        value={item.role}
                                        onChange={(e) => handleChange(item.id, 'role', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="Board Member, Volunteer, President..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <MapPin size={12} /> Location
                                    </label>
                                    <input
                                        type="text"
                                        value={item.location || ''}
                                        onChange={(e) => handleChange(item.id, 'location', e.target.value)}
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
                                        value={formatDateForInput(item.startDate)}
                                        onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                    />
                                    <label className="flex items-center gap-1.5 cursor-pointer pt-1">
                                        <input
                                            type="checkbox"
                                            checked={isCurrentPosition}
                                            onChange={(e) => handleCurrentPositionToggle(item.id, e.target.checked)}
                                            className="w-3.5 h-3.5 text-brand-green border-gray-300 rounded focus:ring-brand-green accent-brand-green cursor-pointer"
                                        />
                                        <span className="text-xs font-medium text-gray-600">Ongoing</span>
                                    </label>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Calendar size={12} /> End Date
                                    </label>
                                    <input
                                        type="month"
                                        value={formatDateForInput(item.endDate)}
                                        onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                                        disabled={isCurrentPosition}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder={isCurrentPosition ? 'Present' : ''}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Description</label>
                                <textarea
                                    value={item.description}
                                    onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full p-3 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                                    placeholder="Briefly describe your responsibilities and impact..."
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleEnhanceDescription(item)}
                                        disabled={enhancingId === item.id || !item.description.trim()}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                        title="Enhance with AI (3 credits)"
                                    >
                                        <Sparkles size={12} className={enhancingId === item.id ? 'animate-spin' : ''} />
                                        {enhancingId === item.id ? 'Enhancing...' : 'Rewrite'}
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
