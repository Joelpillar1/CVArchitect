import React, { useState } from 'react';
import { X, Zap, Download, Check, Sparkles } from 'lucide-react';
import { CreditPack } from '../types/pricing';
import { CREDIT_PACKS, EXPORT_CREDIT_PACKS } from '../utils/pricingConfig';

interface CreditPurchaseModalProps {
    onClose: () => void;
    onPurchase: (pack: CreditPack, type: 'ai' | 'export') => void;
    currentAICredits: number;
    currentExportCredits: number;
}

export default function CreditPurchaseModal({
    onClose,
    onPurchase,
    currentAICredits,
    currentExportCredits,
}: CreditPurchaseModalProps) {
    const [selectedType, setSelectedType] = useState<'ai' | 'export'>('ai');
    const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const packs = selectedType === 'ai' ? CREDIT_PACKS : EXPORT_CREDIT_PACKS;
    const currentCredits = selectedType === 'ai' ? currentAICredits : currentExportCredits;

    const handlePurchase = async () => {
        if (!selectedPack) return;

        setIsPurchasing(true);
        try {
            await onPurchase(selectedPack, selectedType);
            onClose();
        } catch (error) {
            console.error('Purchase failed:', error);
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-brand-dark">Purchase Credits</h2>
                            <p className="text-gray-500 mt-1">Choose a credit pack to continue using premium features</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Current Balance */}
                    <div className="mt-4 flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                            <Zap className="text-purple-600" size={20} />
                            <span className="text-sm font-semibold text-purple-900">
                                {currentAICredits} AI Credits
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                            <Download className="text-green-600" size={20} />
                            <span className="text-sm font-semibold text-green-900">
                                {currentExportCredits} Export Credits
                            </span>
                        </div>
                    </div>
                </div>

                {/* Credit Type Selector */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setSelectedType('ai');
                                setSelectedPack(null);
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${selectedType === 'ai'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Zap size={20} />
                                <span>AI Credits</span>
                            </div>
                            <p className="text-xs mt-1 opacity-80">
                                For AI rewrites, regenerations & more
                            </p>
                        </button>
                        <button
                            onClick={() => {
                                setSelectedType('export');
                                setSelectedPack(null);
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${selectedType === 'export'
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Download size={20} />
                                <span>Export Credits</span>
                            </div>
                            <p className="text-xs mt-1 opacity-80">
                                For PDF exports without watermarks
                            </p>
                        </button>
                    </div>
                </div>

                {/* Credit Packs */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {packs.map((pack) => (
                            <button
                                key={pack.credits}
                                onClick={() => setSelectedPack(pack)}
                                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${selectedPack?.credits === pack.credits
                                        ? selectedType === 'ai'
                                            ? 'border-purple-600 bg-purple-50 shadow-lg'
                                            : 'border-green-600 bg-green-50 shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                            >
                                {/* Selected Indicator */}
                                {selectedPack?.credits === pack.credits && (
                                    <div
                                        className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${selectedType === 'ai' ? 'bg-purple-600' : 'bg-green-600'
                                            }`}
                                    >
                                        <Check className="text-white" size={16} />
                                    </div>
                                )}

                                {/* Savings Badge */}
                                {pack.savings && (
                                    <div className="absolute top-4 left-4 px-2 py-1 bg-brand-green text-brand-dark text-xs font-bold rounded-full">
                                        {pack.savings}
                                    </div>
                                )}

                                {/* Pack Details */}
                                <div className="mt-2">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-4xl font-extrabold text-brand-dark">
                                            {pack.credits}
                                        </span>
                                        <span className="text-gray-500">credits</span>
                                    </div>
                                    <p className="text-sm font-semibold text-brand-dark mb-1">{pack.label}</p>
                                    {pack.description && (
                                        <p className="text-xs text-gray-500 mb-4">{pack.description}</p>
                                    )}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-brand-dark">${pack.price}</span>
                                        <span className="text-sm text-gray-500">
                                            (${(pack.price / pack.credits).toFixed(2)}/credit)
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-2">
                                        {selectedType === 'ai' ? (
                                            <>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Check size={16} className="text-green-600" />
                                                    <span>AI content rewrites</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Check size={16} className="text-green-600" />
                                                    <span>CV regenerations</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Check size={16} className="text-green-600" />
                                                    <span>Cover letter generation</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Check size={16} className="text-green-600" />
                                                    <span>Watermark-free PDFs</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Check size={16} className="text-green-600" />
                                                    <span>High-quality exports</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Check size={16} className="text-green-600" />
                                                    <span>All templates supported</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            {selectedPack ? (
                                <div>
                                    <p className="font-semibold text-brand-dark">
                                        You'll receive {selectedPack.credits} {selectedType === 'ai' ? 'AI' : 'Export'}{' '}
                                        Credits
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Credits never expire and can be used anytime
                                    </p>
                                </div>
                            ) : (
                                <p>Select a credit pack to continue</p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePurchase}
                                disabled={!selectedPack || isPurchasing}
                                className={`px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${selectedType === 'ai'
                                        ? 'bg-purple-600 hover:bg-purple-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {isPurchasing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Purchase {selectedPack ? `$${selectedPack.price}` : 'Credits'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
