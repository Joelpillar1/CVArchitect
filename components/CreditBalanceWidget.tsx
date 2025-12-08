import React from 'react';
import { Zap, Download, Plus, TrendingUp } from 'lucide-react';

interface CreditBalanceWidgetProps {
    aiCredits: number;
    exportCredits: number;
    onPurchase: () => void;
    showPurchaseButton?: boolean;
}

export default function CreditBalanceWidget({
    aiCredits,
    exportCredits,
    onPurchase,
    showPurchaseButton = true,
}: CreditBalanceWidgetProps) {
    const isLowOnAICredits = aiCredits < 10;
    const isLowOnExportCredits = exportCredits < 5;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Credit Balance</h3>
                {showPurchaseButton && (
                    <button
                        onClick={onPurchase}
                        className="flex items-center gap-1 px-3 py-1.5 bg-brand-green text-brand-dark rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Plus size={14} />
                        Buy Credits
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {/* AI Credits */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Zap className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-purple-700 font-medium">AI Credits</p>
                            <p className="text-lg font-bold text-purple-900">{aiCredits}</p>
                        </div>
                    </div>
                    {isLowOnAICredits && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                            Low
                        </span>
                    )}
                </div>

                {/* Export Credits */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Download className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-green-700 font-medium">Export Credits</p>
                            <p className="text-lg font-bold text-green-900">{exportCredits}</p>
                        </div>
                    </div>
                    {isLowOnExportCredits && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                            Low
                        </span>
                    )}
                </div>
            </div>

            {/* Low Credit Warning */}
            {(isLowOnAICredits || isLowOnExportCredits) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <TrendingUp className="text-yellow-600 mt-0.5" size={16} />
                        <div>
                            <p className="text-xs font-semibold text-yellow-900">Running Low on Credits</p>
                            <p className="text-xs text-yellow-700 mt-1">
                                Purchase more credits to continue using premium features without interruption.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
