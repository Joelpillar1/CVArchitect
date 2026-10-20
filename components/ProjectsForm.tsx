import React, { useState } from 'react';
import { ResumeData, Project } from '../types';
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles, X } from 'lucide-react';
import { enhanceDescription } from './utils/aiEnhancer';
import { parseDescriptionBullets } from '../utils/templateUtils';

interface ProjectsFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function ProjectsForm({ data, onChange }: ProjectsFormProps) {
    const [enhancingId, setEnhancingId] = useState<string | null>(null);

    const handleAdd = () => {
        const newProject: Project = {
            id: Date.now().toString(),
            name: '',
            description: [''],
            technologies: '',
            link: ''
        };
        onChange({ ...data, projects: [newProject, ...(data.projects || [])] });
    };

    const handleRemove = (id: string) => {
        onChange({ ...data, projects: (data.projects || []).filter(p => p.id !== id) });
    };

    const handleChange = (id: string, field: keyof Project, value: string | string[]) => {
        onChange({
            ...data,
            projects: (data.projects || []).map(p =>
                p.id === id ? { ...p, [field]: value } : p
            )
        });
    };

    const getDescBullets = (project: Project): string[] =>
        Array.isArray(project.description)
            ? project.description
            : parseDescriptionBullets(project.description || '');

    const handleBulletChange = (projectId: string, bulletIdx: number, val: string) => {
        const project = (data.projects || []).find(p => p.id === projectId);
        if (!project) return;
        const bullets = [...getDescBullets(project)];
        bullets[bulletIdx] = val;
        handleChange(projectId, 'description', bullets);
    };

    const handleAddBullet = (projectId: string) => {
        const project = (data.projects || []).find(p => p.id === projectId);
        if (!project) return;
        handleChange(projectId, 'description', [...getDescBullets(project), '']);
    };

    const handleRemoveBullet = (projectId: string, bulletIdx: number) => {
        const project = (data.projects || []).find(p => p.id === projectId);
        if (!project) return;
        handleChange(projectId, 'description', getDescBullets(project).filter((_, idx) => idx !== bulletIdx));
    };

    const moveProject = (index: number, direction: 'up' | 'down') => {
        const newProjects = [...(data.projects || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newProjects.length) return;

        [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
        onChange({ ...data, projects: newProjects });
    };

    const normalizeDesc = (desc: unknown): string => {
        if (typeof desc === 'string') return desc;
        if (Array.isArray(desc)) return desc.filter(Boolean).join('\n');
        return '';
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-6">
                {(data.projects || []).map((project, index) => {
                    const descString = normalizeDesc(project.description);
                    const bullets = getDescBullets(project);
                    return (
                        <div
                            key={project.id}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 group hover:border-brand-green/50 transition-all"
                        >
                            {/* Header with controls */}
                            <div className="flex justify-between items-start">
                                <div className="text-sm font-medium text-gray-400">Project {index + 1}</div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => moveProject(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveProject(index, 'down')}
                                        disabled={index === (data.projects?.length || 0) - 1}
                                        className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleRemove(project.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 block">Project Name</label>
                                    <input
                                        type="text"
                                        value={project.name}
                                        onChange={(e) => handleChange(project.id, 'name', e.target.value)}
                                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="E-commerce Platform"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 block">Technologies</label>
                                        <input
                                            type="text"
                                            value={project.technologies || ''}
                                            onChange={(e) => handleChange(project.id, 'technologies', e.target.value)}
                                            className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                            placeholder="React, Node.js, MongoDB"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 block">Link</label>
                                        <input
                                            type="text"
                                            value={project.link || ''}
                                            onChange={(e) => handleChange(project.id, 'link', e.target.value)}
                                            className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                            placeholder="github.com/project"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 block">Date (optional)</label>
                                        <input
                                            type="text"
                                            value={project.date || ''}
                                            onChange={(e) => handleChange(project.id, 'date', e.target.value)}
                                            className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                            placeholder="July 2023"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">Description</label>
                                    {bullets.map((b, bIdx) => (
                                        <div key={bIdx} className="group/bullet relative flex items-center gap-2.5">
                                            <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
                                            <input
                                                type="text"
                                                value={b}
                                                onChange={(e) => handleBulletChange(project.id, bIdx, e.target.value)}
                                                placeholder="Describe features, metrics, and outcomes..."
                                                className="flex-1 min-w-0 px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green outline-none transition-all"
                                            />
                                            <button
                                                onClick={() => handleRemoveBullet(project.id, bIdx)}
                                                className="absolute right-1.5 p-1 text-gray-400 hover:text-red-500 rounded-md bg-white/90 opacity-0 group-hover/bullet:opacity-100 focus:opacity-100 transition-opacity"
                                                title="Remove bullet"
                                            >
                                                <X size={13} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleAddBullet(project.id)}
                                        className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-1 rounded-xl bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 text-brand-dark text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        <Plus size={14} />
                                        <span>Add More</span>
                                    </button>
                                    <div className="flex justify-end pt-1">
                                        <button
                                            onClick={async () => {
                                                if (!descString.trim()) {
                                                    alert('Please write a description first.');
                                                    return;
                                                }
                                                setEnhancingId(project.id);
                                                try {
                                                    const enhanced = await enhanceDescription(descString, 'Project', project.name);
                                                    handleChange(project.id, 'description', parseDescriptionBullets(enhanced));
                                                } catch (error) {
                                                    alert('Failed to enhance. Check your API key.');
                                                    console.error(error);
                                                } finally {
                                                    setEnhancingId(null);
                                                }
                                            }}
                                            disabled={enhancingId === project.id || !descString.trim()}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                            title="Enhance with AI"
                                        >
                                            <Sparkles size={12} className={enhancingId === project.id ? 'animate-spin' : ''} />
                                            {enhancingId === project.id ? 'Enhancing...' : 'Rewrite'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-brand-dark bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 rounded-lg transition-all"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>
        </div>
    );
}
