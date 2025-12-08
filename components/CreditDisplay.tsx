import React from 'react';
import { Zap, Crown, Sparkles, TrendingUp } from 'lucide-react';
import { UserSubscription } from '../types/pricing';
import { PLANS } from '../utils/pricingConfig';

interface CreditDisplayProps {
    userSubscription: UserSubscription;
    onUpgradeClick?: () => void;
}

export default function CreditDisplay({ userSubscription, onUpgradeClick }: CreditDisplayProps) {
    const plan = PLANS[userSubscription.planId];
    // Check for Pro plans
    const isPro = userSubscription.planId === 'pro_quarterly' || userSubscription.planId === 'pro_monthly' || userSubscription.planId === 'pro_yearly';
    const isLifetime = userSubscription.planId === 'lifetime';
    const isWeekPass = userSubscription.planId === 'week_pass';
    const isFree = userSubscription.planId === 'free';

    // Calculate credit percentage for visual indicator
    const maxCredits = plan?.creditRules.monthlyCredits || plan?.creditRules.lifetimeCredits || plan?.creditRules.startingCredits || 10;
    const creditPercentage = (userSubscription.credits / maxCredits) * 100;

    // Get color based on credit level
    const getColorClass = () => {
        if (isPro) return 'from-purple-500 to-purple-600';
        if (creditPercentage > 50) return 'from-green-500 to-emerald-600';
        if (creditPercentage > 20) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-red-600';
    };

    const getPlanBadge = () => {
        if (isPro) {
            return (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-xs font-bold shadow-lg">
                    <Crown size={14} className="fill-current" />
                    PRO
                </div>
            );
        }
        if (isLifetime) {
            return (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-bold shadow-lg">
                    <Sparkles size={14} className="fill-current" />
                    LIFETIME
                </div>
            );
        }
        if (isWeekPass) {
            return (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-bold shadow-lg">
                    <TrendingUp size={14} />
                    PASS
                </div>
            );
        }
        // Default to FREE only if it's explicitly free or unknown
        return (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold">
                FREE
            </div>
        );
    };

    if (isPro) {
        // Pro users have unlimited credits
        return (
            <div className="flex items-center gap-3">
                {getPlanBadge()}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                    <Zap size={16} className="text-purple-600 fill-current" />
                    <span className="text-sm font-semibold text-purple-700">Unlimited</span>
                </div>
            </div>
        );
    }

    if (isFree) {
        // Free users see upgrade prompt
        return (
            <div className="flex items-center gap-3">
                {getPlanBadge()}
                <button
                    onClick={onUpgradeClick}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 text-brand-dark rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                >
                    <Zap size={14} />
                    Upgrade
                </button>
            </div>
        );
    }

    // Basic and Lifetime users see credit count
    return (
        <div className="flex items-center gap-3">
            {getPlanBadge()}

            <div className="relative group">
                <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${getColorClass()} rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md`}>
                    <Zap size={16} className="text-white fill-current" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-tight">
                            {userSubscription.credits} {isLifetime ? 'Lifetime' : isWeekPass ? 'Weekly' : 'Monthly'}
                        </span>
                        <span className="text-[10px] text-white/80 leading-tight">
                            Credits Left
                        </span>
                    </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-700">Credit Usage</span>
                                <span className="text-xs text-gray-500">{userSubscription.credits} / {maxCredits}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${getColorClass()} transition-all duration-300`}
                                    style={{ width: `${creditPercentage}%` }}
                                />
                            </div>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                            <p className="font-semibold text-gray-700">1 Credit = 1 AI Action:</p>
                            <ul className="space-y-0.5 ml-2">
                                <li>• Full Resume Rewrite</li>
                                <li>• CV Regeneration</li>
                                <li>• Cover Letter</li>
                                <li>• Bullet Optimization</li>
                            </ul>
                        </div>

                        {creditPercentage < 30 && (
                            <button
                                onClick={onUpgradeClick}
                                className="w-full py-2 bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 text-brand-dark rounded-lg text-xs font-bold transition-all"
                            >
                                {isLifetime ? 'Buy More Credits' : 'Upgrade to Pro'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
