import React, { useMemo } from 'react';
import { ResumeData } from '../types';
import { analyzeResume, AnalyticsResult } from './utils/resumeAnalytics';
import {
    TrendingUp,
    CheckCircle,
    AlertCircle,
    BarChart3,
    Target,
    Zap,
    Award,
    FileText,
    Briefcase
} from 'lucide-react';

interface AnalyticsDashboardProps {
    data: ResumeData;
    isSidebar?: boolean;
    auditResult?: { score: number; keywords: string[]; issues: string[] } | null;
}

export default function AnalyticsDashboard({ data, isSidebar = false, auditResult }: AnalyticsDashboardProps) {
    const analytics: AnalyticsResult = useMemo(() => {
        const local = analyzeResume(data);
        if (auditResult) {
            return {
                ...local,
                // Do not override scores with auditResult to ensure real-time updates
                // atsScore: auditResult.score, 
                // jobMatchScore: auditResult.score,
                keywords: {
                    ...local.keywords,
                    missingKeywords: [...new Set([...local.keywords.missingKeywords, ...auditResult.keywords])].slice(0, 10)
                },
                improvements: [
                    ...auditResult.issues.map(issue => `[AI Audit] ${issue}`),
                    ...local.improvements
                ]
            };
        }
        return local;
    }, [data, auditResult]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Work';
    };

    return (
        <div className={`${isSidebar ? 'p-4 space-y-4' : 'p-6 space-y-6'} h-full overflow-y-auto bg-brand-bg`}>
            {/* Header */}
            <div>
                <h2 className={`${isSidebar ? 'text-xl' : 'text-2xl'} font-bold text-brand-dark mb-2`}>Resume Analytics</h2>
                <p className="text-gray-500 text-sm">
                    Insights and recommendations to optimize your resume for ATS systems and recruiters
                </p>
            </div>

            {/* Main Scores */}
            <div className={`grid grid-cols-1 ${isSidebar ? 'gap-3' : 'md:grid-cols-2 gap-4'}`}>
                {/* ATS Score */}
                <div className={`bg-white rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-gray-200 shadow-sm`}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0">
                                <Target className="w-5 h-5 text-brand-green" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-brand-dark leading-tight">ATS Score</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Applicant Tracking System</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className={`${isSidebar ? 'text-4xl' : 'text-5xl'} font-bold text-brand-dark leading-none`}>{analytics.atsScore}</div>
                        <div className={`${isSidebar ? 'text-lg' : 'text-xl'} text-gray-400 mb-1 leading-none`}>/100</div>
                    </div>
                    <div className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(analytics.atsScore)}`}>
                        {getScoreLabel(analytics.atsScore)}
                    </div>
                </div>

                {/* Job Match or Completeness */}
                {data.jobDescription ? (
                    <div className={`bg-white rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-gray-200 shadow-sm`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-brand-dark leading-tight">Job Match</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Relevance to Job Description</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className={`${isSidebar ? 'text-4xl' : 'text-5xl'} font-bold text-brand-dark leading-none`}>{analytics.jobMatchScore}</div>
                            <div className={`${isSidebar ? 'text-lg' : 'text-xl'} text-gray-400 mb-1 leading-none`}>%</div>
                        </div>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${analytics.jobMatchScore}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className={`bg-white rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-gray-200 shadow-sm`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-brand-dark leading-tight">Completeness</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Overall profile strength</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className={`${isSidebar ? 'text-4xl' : 'text-5xl'} font-bold text-brand-dark leading-none`}>{analytics.completeness}</div>
                            <div className={`${isSidebar ? 'text-lg' : 'text-xl'} text-gray-400 mb-1 leading-none`}>%</div>
                        </div>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-brand-green h-2 rounded-full transition-all duration-500"
                                style={{ width: `${analytics.completeness}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Section Scores */}
            <div className={`bg-white rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-gray-200 shadow-sm`}>
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-brand-dark" />
                    <h3 className="font-bold text-brand-dark">Section Analysis</h3>
                </div>
                <div className="space-y-4">
                    {Object.entries(analytics.sectionScores).map(([section, score]) => (
                        <div key={section}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                    {section.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-sm font-bold text-brand-dark">{Math.round(score)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Keywords & Readability */}
            <div className={`grid grid-cols-1 ${isSidebar ? 'gap-3' : 'md:grid-cols-2 gap-4'}`}>
                {/* Keywords */}
                <div className={`bg-white rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-gray-200 shadow-sm`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-brand-dark" />
                        <h3 className="font-bold text-brand-dark">Keyword Analysis</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-600 flex-1 min-w-0">Action Verbs</span>
                            <span className="text-lg font-bold text-brand-dark shrink-0">{analytics.keywords.actionVerbs}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-600 flex-1 min-w-0">Technical Skills</span>
                            <span className="text-lg font-bold text-brand-dark shrink-0">{analytics.keywords.technicalSkills}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-600 flex-1 min-w-0">Soft Skills</span>
                            <span className="text-lg font-bold text-brand-dark shrink-0">{analytics.keywords.softSkills}</span>
                        </div>
                    </div>
                </div>

                {/* Readability */}
                <div className={`bg-white rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-gray-200 shadow-sm`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-brand-dark" />
                        <h3 className="font-bold text-brand-dark">Readability</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-600 flex-1 min-w-0">Avg. Words/Description</span>
                            <span className="text-lg font-bold text-brand-dark shrink-0">{analytics.readability.avgWordCount}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-600 flex-1 min-w-0">Bullet Points</span>
                            <span className="text-lg font-bold text-brand-dark shrink-0">{analytics.readability.bulletPoints}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-600 flex-1 min-w-0">Quantifiable Metrics</span>
                            <span className="text-lg font-bold text-brand-dark shrink-0">{analytics.readability.quantifiableAchievements}</span>
                        </div>
                        {analytics.readability.weakWords > 0 && (
                            <div className="flex justify-between items-center gap-4 pt-2 border-t border-gray-100">
                                <span className="text-sm text-red-500 font-medium flex-1 min-w-0">Weak Words Found</span>
                                <span className="text-lg font-bold text-red-500 shrink-0">{analytics.readability.weakWords}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Strengths */}
            {analytics.strengths.length > 0 && (
                <div className={`bg-brand-secondary/50 rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-brand-green/20`}>
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-brand-green" />
                        <h3 className="font-bold text-brand-dark">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                        {analytics.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-brand-dark/80">
                                <span className="text-brand-green mt-0.5">✓</span>
                                {strength}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Improvements */}
            {analytics.improvements.length > 0 && (
                <div className={`bg-white rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-brand-border shadow-sm`}>
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-brand-dark">Recommendations</h3>
                    </div>
                    <ul className="space-y-2">
                        {analytics.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-brand-dark/80">
                                <span className="text-amber-500 mt-0.5">→</span>
                                {improvement}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Tips */}
            <div className={`bg-brand-dark text-white rounded-xl ${isSidebar ? 'p-4' : 'p-6'} border border-brand-dark shadow-sm`}>
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-brand-green" />
                    <h3 className="font-bold text-white">Pro Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-brand-green mt-0.5">•</span>
                        Use numbers and percentages to quantify your achievements (e.g., "Increased sales by 25%")
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-brand-green mt-0.5">•</span>
                        Start bullet points with strong action verbs (achieved, managed, developed, led)
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-brand-green mt-0.5">•</span>
                        Keep descriptions concise - aim for 2-4 bullet points per role
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-brand-green mt-0.5">•</span>
                        Tailor your resume to match job descriptions using relevant keywords
                    </li>
                </ul>
            </div>
        </div>
    );
}
