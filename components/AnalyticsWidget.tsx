import React, { useMemo, useState } from 'react';
import { ResumeData } from '../types';
import { analyzeResume } from './utils/resumeAnalytics';
import { BarChart3, ChevronDown, ChevronUp, Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface AnalyticsWidgetProps {
    data: ResumeData;
}

export default function AnalyticsWidget({ data }: AnalyticsWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const analytics = useMemo(() => analyzeResume(data), [data]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Work';
    };

    return (
        <div className="border-b border-brand-border">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors"
            >
                <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-brand-green" />
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Resume Analytics</h3>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-4 pt-0 space-y-4 animate-fadeIn">
                    {/* ATS Score */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-brand-green" />
                                <span className="text-xs font-semibold text-gray-700">ATS Score</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getScoreColor(analytics.atsScore)}`}>
                                {getScoreLabel(analytics.atsScore)}
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="text-3xl font-bold text-brand-dark">{analytics.atsScore}</div>
                            <div className="text-lg text-gray-400 mb-0.5">/100</div>
                        </div>
                    </div>

                    {/* Job Match or Completeness */}
                    {data.jobDescription ? (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-700">Job Match</span>
                                <span className="text-xs font-bold text-brand-dark">{analytics.jobMatchScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${analytics.jobMatchScore}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-700">Completeness</span>
                                <span className="text-xs font-bold text-brand-dark">{analytics.completeness}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-brand-green h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${analytics.completeness}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Keywords */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-brand-green" />
                            <span className="text-xs font-semibold text-gray-700">Keywords</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">Action Verbs</span>
                                <span className="font-bold text-brand-dark">{analytics.keywords.actionVerbs}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">Technical Skills</span>
                                <span className="font-bold text-brand-dark">{analytics.keywords.technicalSkills}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">Metrics</span>
                                <span className="font-bold text-brand-dark">{analytics.readability.quantifiableAchievements}</span>
                            </div>
                        </div>
                    </div>

                    {/* Strengths */}
                    {analytics.strengths.length > 0 && (
                        <div className="bg-brand-secondary/50 rounded-lg p-3 border border-brand-green/20">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-brand-green" />
                                <span className="text-xs font-semibold text-brand-dark">Strengths</span>
                            </div>
                            <ul className="space-y-1">
                                {analytics.strengths.slice(0, 3).map((strength, index) => (
                                    <li key={index} className="flex items-start gap-1.5 text-[11px] text-brand-dark/80">
                                        <span className="text-brand-green mt-0.5">✓</span>
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Improvements */}
                    {analytics.improvements.length > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-brand-border">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-semibold text-brand-dark">Top Recommendations</span>
                            </div>
                            <ul className="space-y-1">
                                {analytics.improvements.slice(0, 3).map((improvement, index) => (
                                    <li key={index} className="flex items-start gap-1.5 text-[11px] text-brand-dark/80">
                                        <span className="text-amber-500 mt-0.5">→</span>
                                        <span>{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
