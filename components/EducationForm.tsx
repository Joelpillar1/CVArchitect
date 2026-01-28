import React, { useState } from 'react';
import { ResumeData, Education } from '../types';
import { GraduationCap, Plus, Trash2, Calendar, Building, ChevronUp, ChevronDown } from 'lucide-react';

interface EducationFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
    const handleAdd = () => {
        const newEducation: Education = {
            id: Date.now().toString(),
            school: '',
            degree: '',
            year: '',
            gpa: '',
            relevantCourses: ''
        };
        onChange({ ...data, education: [newEducation, ...data.education] });
    };

    const handleRemove = (id: string) => {
        onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
    };

    const handleChange = (id: string, field: keyof Education, value: string) => {
        onChange({
            ...data,
            education: data.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        });
    };

    const moveEducation = (index: number, direction: 'up' | 'down') => {
        const newEducation = [...data.education];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newEducation.length) return;

        [newEducation[index], newEducation[targetIndex]] = [newEducation[targetIndex], newEducation[index]];
        onChange({ ...data, education: newEducation });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="space-y-6">
                <div className="space-y-6">
                    {data.education.map((edu, index) => (
                        <div key={edu.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 group hover:border-brand-green/50 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="text-sm font-medium text-gray-400">Education {index + 1}</div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => moveEducation(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Move up"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveEducation(index, 'down')}
                                        disabled={index === data.education.length - 1}
                                        className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Move down"
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleRemove(edu.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-1"
                                        title="Remove education"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Building size={12} /> School / University
                                    </label>
                                    <input
                                        type="text"
                                        value={edu.school}
                                        onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="University Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Degree & Major</label>
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="BSc Computer Science"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Calendar size={12} /> Graduation Year
                                    </label>
                                    <input
                                        type="text"
                                        value={edu.year}
                                        onChange={(e) => handleChange(edu.id, 'year', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="2020"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">
                                        GPA (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={edu.gpa || ''}
                                        onChange={(e) => handleChange(edu.id, 'gpa', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 3.8/4.0, Dean's List"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">
                                    Relevant Courses (optional)
                                </label>
                                <textarea
                                    value={edu.relevantCourses || ''}
                                    onChange={(e) => handleChange(edu.id, 'relevantCourses', e.target.value)}
                                    className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all min-h-[60px]"
                                    placeholder="List key courses separated by commas, e.g. Data Structures, Algorithms, Operating Systems"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-brand-dark bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 rounded-lg transition-all"
                >
                    <Plus size={16} /> Add Education
                </button>
            </div>
        </div>
    );
}
