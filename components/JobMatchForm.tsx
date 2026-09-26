import React, { useState, useEffect, useMemo } from 'react';
import { ResumeData } from '../types';
import { UserSubscription } from '../types/pricing';
import { Loader2 } from 'lucide-react';
import { tailorResumeToJob } from './utils/aiEnhancer';
import { analyzeResume } from './utils/resumeAnalytics';

interface JobMatchFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    userSubscription?: UserSubscription;
    onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function JobMatchForm({ data, onChange, onAIAction }: JobMatchFormProps) {
    const [isRewriting, setIsRewriting] = useState(false);
    const [rewriteError, setRewriteError] = useState<string | null>(null);
    const [rewriteSuccess, setRewriteSuccess] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
    const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());

    const progressSteps = [
        'Analyzing job requirements...',
        'Extracting target keywords...',
        'Tailoring summary & skills...',
        'Optimizing bullet points...',
        'Finalizing resume...'
    ];

    useEffect(() => {
        if (isRewriting) {
            setProgressStep(0);
            const interval = setInterval(() => {
                setProgressStep(prev => {
                    if (prev < progressSteps.length - 1) return prev + 1;
                    return prev;
                });
            }, 1800);
            return () => clearInterval(interval);
        }
    }, [isRewriting]);

    const handlePasteClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
                onChange({ ...data, jobDescription: text.trim(), hasJobMatchRun: false });
            }
        } catch (_) {
            // Fallback
        }
    };

    const handleClearJob = () => {
        onChange({ ...data, jobDescription: '', hasJobMatchRun: false });
        setRewriteError(null);
        setRewriteSuccess(false);
        setAddedKeywords(new Set());
    };

    const handleRewriteResume = async () => {
        if (onAIAction && !onAIAction('ai_rewrite')) {
            return;
        }

        if (!data.jobDescription || !data.jobDescription.trim()) {
            setRewriteError('Paste a job description first.');
            return;
        }

        setIsRewriting(true);
        setRewriteError(null);

        try {
            const result = await tailorResumeToJob(
                {
                    fullName: data.fullName,
                    jobTitle: data.jobTitle,
                    summary: data.summary,
                    experience: data.experience,
                    skills: data.skills,
                    keyAchievements: data.keyAchievements || '',
                },
                data.jobDescription
            );

            const updatedData = { ...data, hasJobMatchRun: true };
            updatedData.summary = result.summary;
            updatedData.skills = result.skills;
            updatedData.keyAchievements = result.keyAchievements;

            result.experience.forEach((exp, index) => {
                if (updatedData.experience[index]) {
                    updatedData.experience[index].description = exp.description;
                }
            });

            onChange(updatedData);
            setRewriteSuccess(true);
            try { sessionStorage.removeItem('cvarchitect_job_from_extension'); } catch (_) { }
            setTimeout(() => setRewriteSuccess(false), 3500);
        } catch (error) {
            console.error('Resume rewrite error:', error);
            setRewriteError(error instanceof Error ? error.message : 'Could not tailor resume. Please try again.');
        } finally {
            setIsRewriting(false);
            setProgressStep(0);
        }
    };

    // Quick add missing keyword to skills
    const handleAddKeyword = (keyword: string) => {
        const existingSkills = (data.skills || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        if (!existingSkills.some(s => s.toLowerCase() === keyword.toLowerCase())) {
            const updatedSkills = existingSkills.length > 0
                ? `${data.skills.trim()}, ${keyword}`
                : keyword;
            onChange({ ...data, skills: updatedSkills });
        }

        setAddedKeywords(prev => new Set(prev).add(keyword.toLowerCase()));
    };

    // Analytics computation
    const analytics = useMemo(() => analyzeResume(data), [data]);
    const hasJob = Boolean(data.jobDescription && data.jobDescription.trim().length > 25);
    const wordCount = data.jobDescription ? data.jobDescription.trim().split(/\s+/).filter(Boolean).length : 0;
    const missingKeywords = analytics.keywords.missingKeywords || [];

    return (
        <div className="space-y-3.5 text-neutral-800 select-none animate-fadeIn">
            {/* Target Job Input & Action */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-800">
                        Target Job Description
                    </span>
                    {wordCount > 0 ? (
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                                {wordCount} words
                            </span>
                            <button
                                type="button"
                                onClick={handleClearJob}
                                className="text-[10px] text-neutral-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handlePasteClipboard}
                            className="text-[11px] font-semibold text-neutral-900 hover:text-black hover:underline cursor-pointer"
                        >
                            Paste
                        </button>
                    )}
                </div>

                <textarea
                    value={data.jobDescription || ''}
                    onChange={(e) => onChange({ ...data, jobDescription: e.target.value, hasJobMatchRun: false })}
                    rows={6}
                    className="w-full p-2.5 text-xs bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white border border-neutral-200/70 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/40 rounded-xl outline-none transition-all resize-none leading-relaxed text-neutral-800 placeholder:text-neutral-400"
                    placeholder="Paste job description to scan match..."
                />

                {/* Tailor Button */}
                {hasJob && (
                    <button
                        type="button"
                        onClick={handleRewriteResume}
                        disabled={isRewriting}
                        className="w-full bg-neutral-900 hover:bg-black text-white py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                    >
                        {isRewriting ? (
                            <>
                                <Loader2 size={13} className="animate-spin text-white" />
                                <span>{progressSteps[progressStep]}</span>
                            </>
                        ) : (
                            <span>Tailor Resume to Job</span>
                        )}
                    </button>
                )}

                {/* Progress Bar during Rewrite */}
                {isRewriting && (
                    <div className="w-full bg-neutral-100 rounded-full h-1 overflow-hidden">
                        <div
                            className="bg-neutral-900 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${((progressStep + 1) / progressSteps.length) * 100}%` }}
                        />
                    </div>
                )}

                {/* Notifications */}
                {rewriteSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium animate-fadeIn text-center">
                        Resume tailored to job description!
                    </div>
                )}

                {rewriteError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-medium animate-fadeIn text-center">
                        {rewriteError}
                    </div>
                )}
            </div>

            {/* Recommended Skills (Dynamic when Job is Entered) */}
            {hasJob && missingKeywords.length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-800">
                            Recommended Keywords
                        </span>
                        <span className="text-[10px] text-neutral-400">
                            Click to add
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                        {missingKeywords.slice(0, 10).map((keyword) => {
                            const isAdded = addedKeywords.has(keyword.toLowerCase());
                            return (
                                <button
                                    key={keyword}
                                    type="button"
                                    onClick={() => handleAddKeyword(keyword)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all inline-flex items-center gap-1 cursor-pointer ${
                                        isAdded
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200/70 hover:border-neutral-300'
                                    }`}
                                    title={`Add "${keyword}" to skills`}
                                >
                                    {isAdded ? `✓ ${keyword}` : `+ ${keyword}`}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
