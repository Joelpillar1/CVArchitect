import React, { useState } from 'react';
import { ResumeData, Project } from '../types';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Link, Code, Sparkles } from 'lucide-react';
import { enhanceDescription } from './utils/aiEnhancer';

interface ProjectsFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function ProjectsForm({ data, onChange }: ProjectsFormProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [enhancingId, setEnhancingId] = useState<string | null>(null);

    const handleAdd = () => {
        const newProject: Project = {
            id: Date.now().toString(),
            name: '',
            description: '',
            technologies: '',
            link: ''
        };
        onChange({ ...data, projects: [newProject, ...(data.projects || [])] });
    };

    const handleRemove = (id: string) => {
        onChange({ ...data, projects: (data.projects || []).filter(p => p.id !== id) });
    };

    const handleChange = (id: string, field: keyof Project, value: string) => {
        onChange({
            ...data,
            projects: (data.projects || []).map(p =>
                p.id === id ? { ...p, [field]: value } : p
            )
        });
    };

    const moveProject = (index: number, direction: 'up' | 'down') => {
        const newProjects = [...(data.projects || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newProjects.length) return;

        [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
        onChange({ ...data, projects: newProjects });
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newProjects = [...(data.projects || [])];
        const draggedItem = newProjects[draggedIndex];
        newProjects.splice(draggedIndex, 1);
        newProjects.splice(index, 0, draggedItem);

        onChange({ ...data, projects: newProjects });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-6">
                {(data.projects || []).map((project, index) => (
                    <div
                        key={project.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 group hover:border-brand-green/50 transition-all ${draggedIndex === index ? 'opacity-50' : ''}`}
                    >
                        {/* Header with controls */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-brand-green transition-colors">
                                    <GripVertical size={20} />
                                </div>
                                <div className="text-sm font-medium text-gray-400">Project {index + 1}</div>
                            </div>
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
                                <label className="text-xs font-medium text-gray-500">Project Name</label>
                                <input
                                    type="text"
                                    value={project.name}
                                    onChange={(e) => handleChange(project.id, 'name', e.target.value)}
                                    className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                    placeholder="E-commerce Platform"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Code size={12} /> Technologies</label>
                                    <input
                                        type="text"
                                        value={project.technologies || ''}
                                        onChange={(e) => handleChange(project.id, 'technologies', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Link size={12} /> Link</label>
                                    <input
                                        type="text"
                                        value={project.link || ''}
                                        onChange={(e) => handleChange(project.id, 'link', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="github.com/project"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Description</label>
                                <textarea
                                    value={project.description}
                                    onChange={(e) => handleChange(project.id, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full p-3 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                                    placeholder="Describe the project and your role..."
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={async () => {
                                            if (!project.description.trim()) {
                                                alert('Please write a description first.');
                                                return;
                                            }
                                            setEnhancingId(project.id);
                                            try {
                                                const enhanced = await enhanceDescription(project.description, 'Project', project.name);
                                                handleChange(project.id, 'description', enhanced);
                                            } catch (error) {
                                                alert('Failed to enhance. Check your API key.');
                                                console.error(error);
                                            } finally {
                                                setEnhancingId(null);
                                            }
                                        }}
                                        disabled={enhancingId === project.id || !project.description.trim()}
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
                ))}

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
