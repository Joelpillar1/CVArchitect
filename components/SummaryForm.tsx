import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Sparkles } from 'lucide-react';
import { enhanceSummary } from './utils/aiEnhancer';

interface SummaryFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function SummaryForm({ data, onChange, onAIAction }: SummaryFormProps) {
    const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);

    const handleChange = (value: string) => {
        onChange({ ...data, summary: value });
    };

    const handleEnhanceSummary = async () => {
        if (!data.summary.trim()) {
            alert('Please write a summary first before enhancing it.');
            return;
        }

        // Check/deduct credits
        if (onAIAction) {
            const allowed = onAIAction('ai_rewrite');
            if (!allowed) return;
        }

        setIsEnhancingSummary(true);
        try {
            const enhanced = await enhanceSummary(
                data.summary,
                data.jobTitle || 'Professional'
            );
            handleChange(enhanced);
        } catch (error) {
            alert('Failed to enhance summary. Please check your API key configuration.');
            console.error(error);
        } finally {
            setIsEnhancingSummary(false);
        }
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="space-y-2">
                <textarea
                    value={data.summary}
                    onChange={(e) => handleChange(e.target.value)}
                    rows={8}
                    className="w-full p-3 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                    placeholder="Write a compelling summary of your professional background..."
                />

                <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 italic">
                        Tip: Keep it concise and focused on your key value proposition.
                    </p>
                    <button
                        onClick={handleEnhanceSummary}
                        disabled={isEnhancingSummary || !data.summary.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        title="Enhance with AI (3 credits)"
                    >
                        <Sparkles size={12} className={isEnhancingSummary ? 'animate-spin' : ''} />
                        {isEnhancingSummary ? 'Enhancing...' : 'Rewrite'}
                    </button>
                </div>
            </div>
        </div>
    );
}
