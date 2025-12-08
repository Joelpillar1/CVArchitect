import React from 'react';
import { Zap, FileText, Download, Target, TrendingUp } from 'lucide-react';

interface UsageDashboardProps {
    usage: Record<string, number>;
    limits: Record<string, number>;
}

export default function UsageDashboard({ usage, limits }: UsageDashboardProps) {
    const features = [
        {
            key: 'ai_rewrite',
            name: 'AI Rewrites',
            icon: Zap,
            color: 'purple',
        },
        {
            key: 'cv_regeneration',
            name: 'CV Regenerations',
            icon: FileText,
            color: 'blue',
        },
        {
            key: 'export_pdf',
            name: 'PDF Exports',
            icon: Download,
            color: 'green',
        },
        {
            key: 'job_match',
            name: 'Job Matches',
            icon: Target,
            color: 'orange',
        },
    ];

    const getUsagePercentage = (feature: string) => {
        const used = usage[feature] || 0;
        const limit = limits[feature] || 0;
        if (limit === 0) return 0;
        return Math.min((used / limit) * 100, 100);
    };

    const getColorClasses = (color: string, percentage: number) => {
        const isNearLimit = percentage >= 80;
        const baseColors = {
            purple: isNearLimit ? 'bg-red-500' : 'bg-purple-500',
            blue: isNearLimit ? 'bg-red-500' : 'bg-blue-500',
            green: isNearLimit ? 'bg-red-500' : 'bg-green-500',
            orange: isNearLimit ? 'bg-red-500' : 'bg-orange-500',
        };
        return baseColors[color as keyof typeof baseColors] || 'bg-gray-500';
    };

    const getBgColorClasses = (color: string) => {
        const colors = {
            purple: 'bg-purple-50',
            blue: 'bg-blue-50',
            green: 'bg-green-50',
            orange: 'bg-orange-50',
        };
        return colors[color as keyof typeof colors] || 'bg-gray-50';
    };

    const getIconColorClasses = (color: string) => {
        const colors = {
            purple: 'text-purple-600',
            blue: 'text-blue-600',
            green: 'text-green-600',
            orange: 'text-orange-600',
        };
        return colors[color as keyof typeof colors] || 'text-gray-600';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => {
                const used = usage[feature.key] || 0;
                const limit = limits[feature.key] || 0;
                const percentage = getUsagePercentage(feature.key);
                const Icon = feature.icon;
                const isUnlimited = limit === -1;

                return (
                    <div
                        key={feature.key}
                        className="border border-gray-200 rounded-xl p-4 hover:border-brand-green transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 ${getBgColorClasses(
                                        feature.color
                                    )} rounded-lg flex items-center justify-center`}
                                >
                                    <Icon className={getIconColorClasses(feature.color)} size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-brand-dark">{feature.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {isUnlimited ? (
                                            <span className="text-brand-green font-semibold">Unlimited</span>
                                        ) : (
                                            <>
                                                {used} / {limit} used
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {!isUnlimited && percentage >= 80 && (
                                <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">
                                    {percentage >= 100 ? 'Limit Reached' : 'Near Limit'}
                                </span>
                            )}
                        </div>

                        {!isUnlimited && (
                            <div className="space-y-1">
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full ${getColorClasses(
                                            feature.color,
                                            percentage
                                        )} transition-all duration-300`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 text-right">{percentage.toFixed(0)}% used</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
