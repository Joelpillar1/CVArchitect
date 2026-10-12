import React, { useState } from 'react';
import { ResumeData, Education } from '../types';
import { GraduationCap, Plus, Trash2, ChevronUp, ChevronDown, Sparkles, X } from 'lucide-react';
import { enhanceCoursework } from './utils/aiEnhancer';

interface EducationFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function EducationForm({ data, onChange, onAIAction }: EducationFormProps) {
    const [enhancingId, setEnhancingId] = useState<string | null>(null);

    const getCourseworkBullets = (courses: string | string[] | undefined): string[] => {
        if (Array.isArray(courses)) {
            return courses.length > 0 ? courses : [''];
        }
        if (typeof courses === 'string' && courses.trim()) {
            const lines = courses
                .split('\n')
                .map(line => line.replace(/^[•\-\*]\s*/, '').replace(/^(?:Relevant\s+Coursework|Relevant\s+Courses?):\s*/i, '').trim())
                .filter(Boolean);
            return lines.length > 0 ? lines : [''];
        }
        return [''];
    };

    const handleAdd = () => {
        const newEducation: Education = {
            id: Date.now().toString(),
            school: '',
            degree: '',
            year: '',
            gpa: '',
            relevantCourses: ['']
        };
        onChange({ ...data, education: [newEducation, ...data.education] });
    };

    const handleRemove = (id: string) => {
        onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
    };

    const handleChange = (id: string, field: keyof Education, value: string | string[]) => {
        onChange({
            ...data,
            education: data.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        });
    };

    const handleCourseworkChange = (eduId: string, bulletIndex: number, value: string) => {
        const edu = data.education.find(e => e.id === eduId);
        if (!edu) return;

        const bullets = [...getCourseworkBullets(edu.relevantCourses)];
        bullets[bulletIndex] = value;
        handleChange(eduId, 'relevantCourses', bullets);
    };

    const handleAddCourseworkBullet = (eduId: string) => {
        const edu = data.education.find(e => e.id === eduId);
        if (!edu) return;

        const bullets = getCourseworkBullets(edu.relevantCourses);
        handleChange(eduId, 'relevantCourses', [...bullets, '']);
    };

    const handleRemoveCourseworkBullet = (eduId: string, bulletIndex: number) => {
        const edu = data.education.find(e => e.id === eduId);
        if (!edu) return;

        const bullets = getCourseworkBullets(edu.relevantCourses);
        if (bullets.length <= 1) {
            handleChange(eduId, 'relevantCourses', ['']);
            return;
        }

        const newBullets = bullets.filter((_, index) => index !== bulletIndex);
        handleChange(eduId, 'relevantCourses', newBullets);
    };

    const handleEnhanceCoursework = async (edu: Education) => {
        const bullets = getCourseworkBullets(edu.relevantCourses);
        const hasContent = bullets.some(b => b.trim());

        if (!hasContent) {
            alert('Please add at least one course or note first.');
            return;
        }

        if (onAIAction) {
            const allowed = onAIAction('ai_rewrite');
            if (!allowed) return;
        }

        setEnhancingId(edu.id);
        try {
            const combined = bullets.filter(b => b.trim()).join('\n');
            const enhanced = await enhanceCoursework(combined, edu.degree, edu.school);
            if (enhanced && enhanced.length > 0) {
                handleChange(edu.id, 'relevantCourses', enhanced);
            }
        } catch (error) {
            alert('Failed to enhance coursework. Check your connection or API key.');
            console.error(error);
        } finally {
            setEnhancingId(null);
        }
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 block">
                                        School / University
                                    </label>
                                    <input
                                        type="text"
                                        value={edu.school}
                                        onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
                                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="University Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 block">Degree & Major</label>
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="BSc Computer Science"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 block">
                                        Location (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={edu.location || ''}
                                        onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="City, State"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 block">
                                        Graduation Year
                                    </label>
                                    <input
                                        type="text"
                                        value={edu.year}
                                        onChange={(e) => handleChange(edu.id, 'year', e.target.value)}
                                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="2020"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 block">
                                        GPA (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={edu.gpa || ''}
                                        onChange={(e) => handleChange(edu.id, 'gpa', e.target.value)}
                                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 3.8/4.0, Dean's List"
                                    />
                                </div>
                            </div>

                            {(() => {
                                const bullets = getCourseworkBullets(edu.relevantCourses);
                                return (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-gray-500">
                                                Coursework & Academic Notes
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => handleEnhanceCoursework(edu)}
                                                disabled={enhancingId === edu.id || !bullets.some(b => b.trim())}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                                title="Enhance with AI (1 credit)"
                                            >
                                                <Sparkles size={12} className={enhancingId === edu.id ? 'animate-spin' : ''} />
                                                {enhancingId === edu.id ? 'Enhancing...' : 'Rewrite'}
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {bullets.map((bullet, bulletIndex) => (
                                                <div key={bulletIndex} className="flex items-start gap-2 group/bullet">
                                                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-green mt-2"></div>
                                                    <input
                                                        type="text"
                                                        value={bullet}
                                                        onChange={(e) => handleCourseworkChange(edu.id, bulletIndex, e.target.value)}
                                                        className="flex-1 p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                                        placeholder={`Coursework or academic highlight ${bulletIndex + 1}`}
                                                    />
                                                    {bullets.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveCourseworkBullet(edu.id, bulletIndex)}
                                                            className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/bullet:opacity-100 p-1"
                                                            title="Remove bullet point"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleAddCourseworkBullet(edu.id)}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-brand-dark bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 rounded-lg transition-all"
                                        >
                                            <Plus size={14} /> Add More
                                        </button>
                                    </div>
                                );
                            })()}
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
