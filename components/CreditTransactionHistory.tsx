import React from 'react';
import { Zap, Download, Plus, Minus, Clock } from 'lucide-react';

export interface CreditTransaction {
    id: string;
    type: 'purchase' | 'usage' | 'refund' | 'bonus';
    creditType: 'ai' | 'export';
    amount: number;
    description: string;
    timestamp: string;
    balance_after: number;
}

interface CreditTransactionHistoryProps {
    transactions: CreditTransaction[];
}

export default function CreditTransactionHistory({ transactions }: CreditTransactionHistoryProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const getIcon = (transaction: CreditTransaction) => {
        if (transaction.type === 'purchase' || transaction.type === 'bonus') {
            return <Plus className="text-green-600" size={16} />;
        }
        return <Minus className="text-red-600" size={16} />;
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'purchase':
                return 'text-green-700 bg-green-50';
            case 'usage':
                return 'text-red-700 bg-red-50';
            case 'refund':
                return 'text-blue-700 bg-blue-50';
            case 'bonus':
                return 'text-purple-700 bg-purple-50';
            default:
                return 'text-gray-700 bg-gray-50';
        }
    };

    const getCreditTypeIcon = (creditType: 'ai' | 'export') => {
        return creditType === 'ai' ? (
            <Zap className="text-purple-600" size={14} />
        ) : (
            <Download className="text-green-600" size={14} />
        );
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No credit transactions yet</p>
                <p className="text-sm text-gray-400 mt-1">Your credit history will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {transactions.map((transaction) => (
                <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-brand-green transition-colors"
                >
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getIcon(transaction)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-brand-dark text-sm">{transaction.description}</p>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getTypeColor(transaction.type)}`}>
                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </span>
                                <div className="flex items-center gap-1">
                                    {getCreditTypeIcon(transaction.creditType)}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p
                            className={`text-lg font-bold ${transaction.type === 'purchase' || transaction.type === 'bonus' || transaction.type === 'refund'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                        >
                            {transaction.type === 'purchase' || transaction.type === 'bonus' || transaction.type === 'refund' ? '+' : '-'}
                            {Math.abs(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">Balance: {transaction.balance_after}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
