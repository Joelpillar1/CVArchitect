import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResumeData } from '../types';
import { analyzeResume, AnalyticsResult } from './utils/resumeAnalytics';
import { FileText } from 'lucide-react';

function AnimatedSectionItem({
    section,
    targetScore,
    index,
}: {
    section: string;
    targetScore: number;
    index: number;
}) {
    const [displayVal, setDisplayVal] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const startVal = 0;
        const duration = 900 + index * 60;

        let frameId: number;
        const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            setDisplayVal(Math.round(startVal + (targetScore - startVal) * eased));
            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        };

        const timer = setTimeout(() => {
            frameId = requestAnimationFrame(animate);
        }, index * 40);

        return () => {
            clearTimeout(timer);
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [targetScore, index]);

    const formattedName = section
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();

    const getBarColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]';
        if (score >= 50) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
        if (score > 0) return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
        return 'bg-neutral-200';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.05, duration: 0.35, ease: 'easeOut' }}
            className="space-y-1.5 group/item cursor-default"
        >
            <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-neutral-600 group-hover/item:text-neutral-900 transition-colors">
                    {formattedName}
                </span>
                <span className={`font-bold tabular-nums transition-colors ${
                    targetScore >= 80
                        ? 'text-neutral-900'
                        : targetScore >= 50
                        ? 'text-amber-700 font-extrabold'
                        : targetScore > 0
                        ? 'text-rose-600 font-extrabold'
                        : 'text-neutral-400'
                }`}>
                    {displayVal}%
                </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden relative shadow-2xs">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${targetScore}%` }}
                    transition={{
                        delay: 0.12 + index * 0.06,
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`h-full rounded-full transition-colors duration-300 relative ${getBarColor(targetScore)}`}
                />
            </div>
        </motion.div>
    );
}

interface AnalyticsDashboardProps {
    data: ResumeData;
    isSidebar?: boolean;
    auditResult?: { score: number; keywords: string[]; issues: string[] } | null;
}

export default function AnalyticsDashboard({ data, isSidebar = false }: AnalyticsDashboardProps) {
    const analytics: AnalyticsResult = useMemo(() => {
        return analyzeResume(data);
    }, [data]);

    const hasJob = Boolean(data.jobDescription && data.jobDescription.trim().length > 25);
    const matchScore = hasJob ? analytics.jobMatchScore : analytics.atsScore;

    // Smooth on-load animation
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const startValue = 0;
        const targetValue = matchScore;
        const duration = 1200; // ms

        let animationFrameId: number;

        const easeOutQuart = (t: number): number => {
            return 1 - Math.pow(1 - t, 4);
        };

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);

            const current = Math.round(startValue + (targetValue - startValue) * easedProgress);
            setDisplayScore(current);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [matchScore]);

    const getScoreDetails = (score: number) => {
        if (score >= 85) return { label: 'Excellent', fill: '#059669', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' };
        if (score >= 70) return { label: 'Strong Match', fill: '#0d9488', badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/60' };
        if (score >= 50) return { label: 'Good Match', fill: '#d97706', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60' };
        return { label: 'Needs Optimization', fill: '#e11d48', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/60' };
    };

    const scoreDetails = getScoreDetails(matchScore);
    const animProgress = matchScore > 0 ? displayScore / matchScore : 1;

    // ATS Checklist items
    const hasContact = Boolean(data.fullName && data.email);
    const hasExperience = data.experience.length >= 2;
    const hasGoodMetrics = analytics.readability.metricDensity >= 0.15;
    const hasGoodVerbs = analytics.keywords.actionVerbs >= 8;

    return (
        <div className={`${isSidebar ? 'p-3.5 space-y-3.5' : 'p-6 space-y-4'} h-full overflow-y-auto bg-white select-none animate-fadeIn custom-scrollbar`}>
            {/* 1. HERO SCORECARD: STRAIGHT GRADIENT GAUGE + SPECTRUM EQUALIZER TOWERS */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                {/* Center Score & Status */}
                <div className="flex flex-col items-center justify-center text-center pt-1">
                    <span className="font-sans font-black text-5xl text-neutral-900 tracking-tight leading-none">
                        {displayScore}
                    </span>
                    <div className="mt-2">
                        <span className="text-xs font-bold text-teal-600">
                            {scoreDetails.label}
                        </span>
                    </div>
                    {hasJob && (
                        <span className="text-[10px] text-neutral-400 font-medium mt-1">
                            Target Job Match • Base ATS: <span className="text-neutral-600 font-semibold">{analytics.atsScore}%</span>
                        </span>
                    )}
                </div>

                {/* Straight Horizontal Gradient Gauge */}
                <div className="space-y-1.5 px-0.5">
                    <div className="relative w-full">
                        <svg className="w-full h-6 overflow-visible" viewBox="0 0 240 18">
                            <defs>
                                <linearGradient id="analyticsStraightGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#F43F5E" />
                                    <stop offset="30%" stopColor="#FB923C" />
                                    <stop offset="60%" stopColor="#FBBF24" />
                                    <stop offset="85%" stopColor="#34D399" />
                                    <stop offset="100%" stopColor="#10B981" />
                                </linearGradient>
                                <clipPath id="analyticsGaugeClip">
                                    <rect x="0" y="2" width={(displayScore / 100) * 240} height="14" rx="7" />
                                </clipPath>
                            </defs>

                            {/* Background Track */}
                            <rect x="0" y="2" width="240" height="14" rx="7" fill="#F1F5F9" />

                            {/* Active Gradient Fill */}
                            <rect 
                                x="0" 
                                y="2" 
                                width="240" 
                                height="14" 
                                rx="7" 
                                fill="url(#analyticsStraightGaugeGradient)" 
                                clipPath="url(#analyticsGaugeClip)" 
                                className="transition-all duration-150 ease-out"
                            />

                            {/* Dynamic Indicator Thumb */}
                            <circle
                                cx={Math.max(7, Math.min(233, (displayScore / 100) * 240))}
                                cy="9"
                                r="8"
                                fill="#FFFFFF"
                                stroke="#1E293B"
                                strokeWidth="3"
                                className="filter drop-shadow-md transition-all duration-150 ease-out"
                            />
                        </svg>
                    </div>

                    {/* 0 and 100 Baseline markers */}
                    <div className="flex justify-between items-center text-[11px] font-sans font-semibold text-neutral-400 tabular-nums px-1 select-none tracking-tight">
                        <span>0</span>
                        <span>100</span>
                    </div>
                </div>

                {/* 3 Spectrum Equalizer Towers */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                    {[
                        { 
                            label: 'Relevance', 
                            score: matchScore * animProgress, 
                            color: 'bg-emerald-500' 
                        },
                        { 
                            label: 'Verbs', 
                            score: Math.min(100, (analytics.keywords.actionVerbs / 15) * 100) * animProgress, 
                            color: 'bg-teal-500' 
                        },
                        { 
                            label: 'Impact', 
                            score: Math.min(100, Math.round(analytics.readability.metricDensity * 100 * 2.5)) * animProgress, 
                            color: 'bg-blue-500' 
                        },
                    ].map((col, cIdx) => (
                        <div 
                            key={cIdx} 
                            className="bg-neutral-50/90 rounded-2xl border border-neutral-100 p-2.5 flex flex-col items-center gap-2 hover:bg-neutral-50 transition-colors"
                        >
                            <div className="flex flex-col-reverse gap-1 h-20 w-full px-1.5">
                                {Array.from({ length: 8 }).map((_, bIdx) => {
                                    const isLit = (bIdx + 1) / 8 <= col.score / 100;
                                    return (
                                        <div
                                            key={bIdx}
                                            className={`h-1.5 w-full rounded-sm transition-all duration-300 ${
                                                isLit ? `${col.color} shadow-2xs` : 'bg-neutral-200/50'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-[11px] font-bold text-neutral-600 truncate w-full text-center">
                                {col.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. SECTION ANALYTICS */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-neutral-100/80 text-neutral-700">
                        <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-800">
                        Section Analysis
                    </span>
                </div>
                <div className="space-y-3">
                    {Object.entries(analytics.sectionScores).map(([section, score], idx) => (
                        <AnimatedSectionItem
                            key={section}
                            section={section}
                            targetScore={score}
                            index={idx}
                        />
                    ))}
                </div>
            </div>

            {/* 3. READINESS CHECKLIST */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    Readiness Checklist
                </span>
                <div className="divide-y divide-neutral-100 text-[11px]">
                    <div className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasContact ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            <span className="text-neutral-700 font-medium">Contact & Personal Info</span>
                        </div>
                        <span className={`text-[10px] font-medium ${hasContact ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {hasContact ? 'Complete' : 'Incomplete'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasExperience ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            <span className="text-neutral-700 font-medium">Work Experience</span>
                        </div>
                        <span className={`text-[10px] font-medium ${hasExperience ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {hasExperience ? `${data.experience.length} roles` : 'Add roles'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasGoodMetrics ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            <span className="text-neutral-700 font-medium">Quantified Metrics</span>
                        </div>
                        <span className={`text-[10px] font-medium ${hasGoodMetrics ? 'text-emerald-600' : 'text-neutral-400'}`}>
                            {hasGoodMetrics ? 'Good' : 'Add numbers'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasGoodVerbs ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            <span className="text-neutral-700 font-medium">Action Verbs</span>
                        </div>
                        <span className={`text-[10px] font-medium ${hasGoodVerbs ? 'text-emerald-600' : 'text-neutral-400'}`}>
                            {hasGoodVerbs ? 'Strong' : 'Add verbs'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
