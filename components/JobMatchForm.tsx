import React, { useState, useEffect } from 'react';
import { ResumeData } from '../types';
import { UserSubscription } from '../types/pricing';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { Target, FileText, CheckCircle, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { tailorResumeToJob } from './utils/aiEnhancer';
import { analyzeResume } from './utils/resumeAnalytics';

interface JobMatchFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    userSubscription: UserSubscription;
    onAIAction: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function JobMatchForm({ data, onChange, userSubscription, onAIAction }: JobMatchFormProps) {
    const [isRewriting, setIsRewriting] = useState(false);
    const [rewriteError, setRewriteError] = useState<string | null>(null);
    const [rewriteSuccess, setRewriteSuccess] = useState(false);
    const [progressStep, setProgressStep] = useState(0);

    const progressSteps = [
        'Analyzing job description...',
        'Extracting key requirements...',
        'Optimizing your summary...',
        'Enhancing experience bullets...',
        'Tailoring skills section...',
        'Polishing achievements...',
        'Finalizing optimizations...'
    ];

    useEffect(() => {
        if (isRewriting) {
            setProgressStep(0);
            const interval = setInterval(() => {
                setProgressStep(prev => {
                    if (prev < progressSteps.length - 1) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [isRewriting]);

    const handleChange = (field: keyof ResumeData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const handleRewriteResume = async () => {
        // Check subscription and deduct credits
        if (!onAIAction('ai_rewrite')) {
            return;
        }

        if (!data.jobDescription || !data.jobDescription.trim()) {
            setRewriteError('Please paste a job description first');
            return;
        }

        setIsRewriting(true);
        setRewriteError(null);
        setRewriteSuccess(false);

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

            // Update the resume with AI-tailored content
            const updatedData = { ...data, hasJobMatchRun: true };
            updatedData.summary = result.summary;
            updatedData.skills = result.skills;
            updatedData.keyAchievements = result.keyAchievements;

            // Update each experience description
            result.experience.forEach((exp, index) => {
                if (updatedData.experience[index]) {
                    updatedData.experience[index].description = exp.description;
                }
            });

            onChange(updatedData);
            setRewriteSuccess(true);
            setTimeout(() => setRewriteSuccess(false), 5000);
        } catch (error) {
            console.error('Resume rewrite error:', error);
            setRewriteError(error instanceof Error ? error.message : 'Failed to rewrite resume. Please try again.');
        } finally {
            setIsRewriting(false);
            setProgressStep(0);
        }
    };

    // Unified scoring logic
    const analytics = React.useMemo(() => analyzeResume(data), [data]);
    const matchScore = analytics.jobMatchScore;

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex gap-3">
                <Target className="text-brand-green shrink-0 mt-0.5" size={20} />
                <div className="space-y-1">
                    <h4 className="font-semibold text-brand-dark">AI-Powered ATS Optimization</h4>
                    <p className="text-sm text-green-800 leading-relaxed">
                        Paste the job description below. Our AI will analyze it and can completely rewrite your resume to maximize ATS match using powerful action verbs and industry keywords.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-dark flex items-center gap-2">
                    <FileText size={16} className="text-brand-green" />
                    Target Job Description
                </h3>
                <div className="space-y-1">
                    <textarea
                        value={data.jobDescription || ''}
                        onChange={(e) => handleChange('jobDescription', e.target.value)}
                        rows={10}
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                        placeholder="Paste the full job description here..."
                    />
                </div>

                {/* AI Rewrite Button */}
                {data.jobDescription && (
                    <button
                        onClick={handleRewriteResume}
                        disabled={isRewriting}
                        className="w-full bg-brand-green hover:bg-green-700 disabled:bg-gray-400 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                        {isRewriting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Rewriting Your Resume...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                <span>Rewrite My Resume</span>
                            </>
                        )}
                    </button>
                )}

                {/* Progress Indicator */}
                {isRewriting && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <Loader2 size={18} className="animate-spin text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">{progressSteps[progressStep]}</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${((progressStep + 1) / progressSteps.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-blue-700">
                            Step {progressStep + 1} of {progressSteps.length}
                        </p>
                    </div>
                )}

                {/* Success Message */}
                {rewriteSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-3">
                        <CheckCircle size={20} className="shrink-0" />
                        <div>
                            <p className="font-semibold">Resume Successfully Tailored!</p>
                            <p className="text-sm">Your resume has been rewritten with powerful action verbs and ATS-optimized keywords.</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {rewriteError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-3">
                        <AlertCircle size={20} className="shrink-0" />
                        <div>
                            <p className="font-semibold">Error</p>
                            <p className="text-sm">{rewriteError}</p>
                        </div>
                    </div>
                )}
            </div>

            {data.jobDescription && data.hasJobMatchRun && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all">
                    {/* Hero Section: Score */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Job Match Score</h4>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-5xl font-bold tracking-tight ${matchScore >= 80 ? 'text-gray-900' :
                                        matchScore >= 60 ? 'text-gray-900' : 'text-gray-900'
                                    }`}>
                                    {matchScore}
                                </span>
                                <span className="text-2xl text-gray-300 font-light">/100</span>
                            </div>
                            <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${matchScore >= 80 ? 'bg-green-50 text-green-700' :
                                    matchScore >= 60 ? 'bg-yellow-50 text-yellow-700' :
                                        'bg-red-50 text-red-700'
                                }`}>
                                {matchScore >= 80 ? <CheckCircle size={12} /> : matchScore >= 60 ? <AlertCircle size={12} /> : <AlertCircle size={12} />}
                                {matchScore >= 80 ? 'Excellent Match' : matchScore >= 60 ? 'Good Potential' : 'Needs Optimization'}
                            </div>
                        </div>

                        {/* Minimal Ring Chart */}
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full transform -rotate-90">
                                {/* Background Ring */}
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="#F3F4F6"
                                    strokeWidth="6"
                                    fill="none"
                                />
                                {/* Value Ring */}
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke={matchScore >= 80 ? '#10B981' : matchScore >= 60 ? '#F59E0B' : '#EF4444'}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    fill="none"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * matchScore) / 100}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="bg-gray-50/30">
                        {/* Content Quality */}
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={14} className="text-gray-400" />
                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Quality Metrics</h5>
                            </div>

                            <div className="space-y-5">
                                {/* Metric Density */}
                                <div>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-xs text-gray-600 font-medium">Metric Density</span>
                                        <span className="text-xs font-mono text-gray-500">
                                            {Math.round(analytics.readability.metricDensity * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${analytics.readability.metricDensity >= 0.3 ? 'bg-gray-800' : 'bg-gray-400'}`}
                                            style={{ width: `${Math.min(100, analytics.readability.metricDensity * 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Bullets with numbers (target: 30%)</p>
                                </div>

                                {/* Action Verbs */}
                                <div>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-xs text-gray-600 font-medium">Action Verbs</span>
                                        <span className="text-xs font-mono text-gray-500">
                                            {analytics.keywords.actionVerbs}/15
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${analytics.keywords.actionVerbs >= 15 ? 'bg-gray-800' : 'bg-gray-400'}`}
                                            style={{ width: `${Math.min(100, (analytics.keywords.actionVerbs / 15) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
