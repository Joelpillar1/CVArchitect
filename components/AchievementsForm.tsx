import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Sparkles } from 'lucide-react';
import { generateAchievements } from './utils/aiEnhancer';

interface AchievementsFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function AchievementsForm({ data, onChange, onAIAction }: AchievementsFormProps) {
    const [isEnhancingAchievements, setIsEnhancingAchievements] = useState(false);

    const handleChange = (field: keyof ResumeData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const handleEnhanceAchievements = async () => {
        // Get the most recent experience for context
        const recentExp = data.experience[0];
        if (!recentExp || !recentExp.description) {
            alert('Please add at least one work experience with a description first.');
            return;
        }

        // Check/deduct credits
        if (onAIAction) {
            const allowed = onAIAction('ai_rewrite');
            if (!allowed) return;
        }

        setIsEnhancingAchievements(true);
        try {
            const context = `${recentExp.company || ''} - ${recentExp.description}`;
            const enhanced = await generateAchievements(
                recentExp.role || 'Professional',
                context
            );
            handleChange('keyAchievements', enhanced);
        } catch (error) {
            alert('Failed to generate achievements. Check your API key.');
            console.error(error);
        } finally {
            setIsEnhancingAchievements(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
                <textarea
                    value={data.keyAchievements || ''}
                    onChange={(e) => handleChange('keyAchievements', e.target.value)}
                    rows={6}
                    className="w-full p-3 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                    placeholder="• Increased revenue by 30%...&#10;• Led a team of 10 engineers...&#10;• Reduced costs by $50K..."
                />

                <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 italic">
                        Use bullet points for clarity.
                    </p>
                    <button
                        onClick={handleEnhanceAchievements}
                        disabled={isEnhancingAchievements || !data.experience[0]?.description}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        title="Generate with AI (3 credits)"
                    >
                        <Sparkles size={12} className={isEnhancingAchievements ? 'animate-spin' : ''} />
                        {isEnhancingAchievements ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
}
