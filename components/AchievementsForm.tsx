import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Sparkles, Plus, X } from 'lucide-react';
import { generateAchievements } from './utils/aiEnhancer';
import { parseAchievementBullets } from '../utils/templateUtils';

interface AchievementsFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function AchievementsForm({ data, onChange, onAIAction }: AchievementsFormProps) {
    const [isEnhancingAchievements, setIsEnhancingAchievements] = useState(false);

    // Helper function to ensure achievements is always an array
    const getAchievementsArray = (achievements?: string | string[]): string[] => {
        if (!achievements) return ['', '', '']; // Default 3 empty achievements
        if (Array.isArray(achievements)) {
            // Return a new copy of the array to avoid mutation
            return [...achievements];
        }
        if (achievements && achievements.trim()) {
            // Use shared parser so we correctly handle both newline and "•" separated bullets
            const bullets = parseAchievementBullets(achievements);
            if (bullets.length > 0) return bullets;
        }
        return ['', '', '']; // Default 3 empty achievements
    };

    const handleChange = (field: keyof ResumeData, value: string | string[]) => {
        onChange({ ...data, [field]: value });
    };

    const handleAchievementChange = (index: number, value: string) => {
        const achievements = getAchievementsArray(data.keyAchievements);
        // Create a new array with the updated value
        const newAchievements = [...achievements];
        newAchievements[index] = value;
        handleChange('keyAchievements', newAchievements);
    };

    const handleAddAchievement = () => {
        const achievements = getAchievementsArray(data.keyAchievements);
        // Create a new array with an additional empty achievement
        handleChange('keyAchievements', [...achievements, '']);
    };

    const handleRemoveAchievement = (index: number) => {
        const achievements = getAchievementsArray(data.keyAchievements);
        if (achievements.length <= 1) return; // Keep at least one achievement

        // Create a new array without the removed achievement
        const newAchievements = achievements.filter((_, i) => i !== index);
        handleChange('keyAchievements', newAchievements);
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
            // Get description text (handle both string and array)
            const descText = Array.isArray(recentExp.description)
                ? recentExp.description.join(' ')
                : recentExp.description;

            const context = `${recentExp.company || ''} - ${descText}`;
            const enhanced = await generateAchievements(
                recentExp.role || 'Professional',
                context
            );

            // Split enhanced achievements into array
            const enhancedArray = enhanced.split('\n')
                .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
                .filter(line => line);

            handleChange('keyAchievements', enhancedArray);
        } catch (error) {
            alert('Failed to generate achievements. Check your API key.');
            console.error(error);
        } finally {
            setIsEnhancingAchievements(false);
        }
    };

    // Use useMemo to recalculate achievements when data changes
    const achievements = React.useMemo(() => {
        return getAchievementsArray(data.keyAchievements);
    }, [data.keyAchievements]);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-500">Key Achievements</label>
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

                <div className="space-y-2">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2 group/achievement">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-green mt-2"></div>
                            <input
                                type="text"
                                value={achievement}
                                onChange={(e) => handleAchievementChange(index, e.target.value)}
                                className="flex-1 p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                placeholder={`Achievement ${index + 1}`}
                            />
                            {achievements.length > 1 && (
                                <button
                                    onClick={() => handleRemoveAchievement(index)}
                                    className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/achievement:opacity-100 p-1"
                                    title="Remove achievement"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddAchievement}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-brand-dark bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 rounded-lg transition-all"
                >
                    <Plus size={14} /> Add More
                </button>

                <p className="text-[10px] text-gray-400 italic mt-2">
                    Highlight your most significant accomplishments and career milestones.
                </p>
            </div>
        </div>
    );
}
