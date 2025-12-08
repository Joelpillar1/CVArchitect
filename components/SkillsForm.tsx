import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Sparkles } from 'lucide-react';

interface SkillsFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

import { useToast } from '../contexts/ToastContext';

export default function SkillsForm({ data, onChange, onAIAction }: SkillsFormProps) {
    const [isEnhancingSkills, setIsEnhancingSkills] = useState(false);
    const { showToast } = useToast();

    const handleEnhanceSkills = async () => {
        if (!data.skills.trim()) {
            showToast('Please add some skills first before enhancing.', 'info');
            return;
        }

        // Check/deduct credits
        if (onAIAction) {
            const allowed = onAIAction('ai_rewrite');
            if (!allowed) return;
        }

        setIsEnhancingSkills(true);
        try {
            // Dynamically import to separate AI logic
            const { enhanceSkills } = await import('./utils/aiEnhancer');
            const enhanced = await enhanceSkills(data.skills, data.jobTitle || 'Professional');
            onChange({ ...data, skills: enhanced });
            showToast('Skills enhanced successfully!', 'success');
        } catch (error) {
            showToast('Failed to enhance skills. Please check your API key configuration.', 'error');
            console.error(error);
        } finally {
            setIsEnhancingSkills(false);
        }
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Skills List (Comma separated)</label>
                <textarea
                    value={data.skills}
                    onChange={(e) => onChange({ ...data, skills: e.target.value })}
                    rows={6}
                    className="w-full p-3 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                    placeholder="React, TypeScript, Node.js, Python, AWS..."
                />

                <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 italic">
                        Tip: List your most relevant skills first.
                    </p>
                    <button
                        onClick={handleEnhanceSkills}
                        disabled={isEnhancingSkills || !data.skills.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        title="Enhance with AI (1 credit)"
                    >
                        <Sparkles size={12} className={isEnhancingSkills ? 'animate-spin' : ''} />
                        {isEnhancingSkills ? 'Enhancing...' : 'Enhance'}
                    </button>
                </div>
            </div>
        </div>
    );
}
