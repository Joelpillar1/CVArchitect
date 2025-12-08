import React, { useState } from 'react';
import { ResumeData, AdditionalInfoItem } from '../types';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface AdditionalInfoFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function AdditionalInfoForm({ data, onChange }: AdditionalInfoFormProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleAdd = () => {
        const newItem: AdditionalInfoItem = {
            id: Date.now().toString(),
            label: '',
            value: ''
        };
        onChange({ ...data, additionalInfo: [...(data.additionalInfo || []), newItem] });
    };

    const handleRemove = (id: string) => {
        onChange({ ...data, additionalInfo: (data.additionalInfo || []).filter(item => item.id !== id) });
    };

    const handleChange = (id: string, field: keyof AdditionalInfoItem, value: string) => {
        onChange({
            ...data,
            additionalInfo: (data.additionalInfo || []).map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        });
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...(data.additionalInfo || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        onChange({ ...data, additionalInfo: newItems });
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newItems = [...(data.additionalInfo || [])];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);

        onChange({ ...data, additionalInfo: newItems });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
                {(data.additionalInfo || []).map((item, index) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 group hover:border-brand-green/50 transition-all ${draggedIndex === index ? 'opacity-50' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start gap-3">
                            <div
                                className="mt-2 cursor-move text-gray-400 hover:text-brand-dark transition-colors"
                                title="Drag to reorder"
                            >
                                <GripVertical size={16} />
                            </div>

                            <div className="flex-1 space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 mb-1 block">Label</label>
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => handleChange(item.id, 'label', e.target.value)}
                                        className="w-full p-2 text-sm font-medium border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. Languages, Tools, Interests"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 mb-1 block">Content</label>
                                    <textarea
                                        value={item.value}
                                        onChange={(e) => handleChange(item.id, 'value', e.target.value)}
                                        rows={2}
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="e.g. English, Spanish..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 text-gray-400 hover:text-brand-dark disabled:opacity-30 transition-colors"
                                    title="Move Up"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove Item"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === (data.additionalInfo || []).length - 1}
                                    className="p-1 text-gray-400 hover:text-brand-dark disabled:opacity-30 transition-colors"
                                    title="Move Down"
                                >
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-lg transition-all shadow-sm hover:shadow-md"
            >
                <Plus size={16} /> Add Information
            </button>
        </div>
    );
}
