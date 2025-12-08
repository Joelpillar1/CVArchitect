import React from 'react';
import { Download, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import { BillingHistoryItem } from '../services/subscriptionService';

interface BillingHistoryProps {
    history: BillingHistoryItem[];
}

export default function BillingHistory({ history }: BillingHistoryProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'succeeded':
                return <CheckCircle className="text-green-600" size={20} />;
            case 'failed':
                return <XCircle className="text-red-600" size={20} />;
            case 'pending':
                return <Clock className="text-yellow-600" size={20} />;
            case 'refunded':
                return <CheckCircle className="text-blue-600" size={20} />;
            default:
                return <Clock className="text-gray-400" size={20} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'succeeded':
                return 'Paid';
            case 'failed':
                return 'Failed';
            case 'pending':
                return 'Pending';
            case 'refunded':
                return 'Refunded';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'succeeded':
                return 'text-green-700 bg-green-50';
            case 'failed':
                return 'text-red-700 bg-red-50';
            case 'pending':
                return 'text-yellow-700 bg-yellow-50';
            case 'refunded':
                return 'text-blue-700 bg-blue-50';
            default:
                return 'text-gray-700 bg-gray-50';
        }
    };

    if (history.length === 0) {
        return (
            <div className="text-center py-12">
                <CreditCard className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No billing history yet</p>
                <p className="text-sm text-gray-400 mt-1">Your payment history will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {history.map((item) => (
                <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-brand-green transition-colors"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">{getStatusIcon(item.status)}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-brand-dark">
                                        {item.description || 'Payment'}
                                    </p>
                                    <span
                                        className={`px-2 py-0.5 text-xs font-semibold rounded ${getStatusColor(
                                            item.status
                                        )}`}
                                    >
                                        {getStatusText(item.status)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
                                {item.payment_method_brand && item.payment_method_last4 && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {item.payment_method_brand} •••• {item.payment_method_last4}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-lg font-bold text-brand-dark">
                                {formatAmount(item.amount, item.currency)}
                            </p>
                            {item.invoice_url && (
                                <a
                                    href={item.invoice_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-brand-green hover:text-green-700 font-semibold flex items-center gap-1 justify-end mt-1"
                                >
                                    <Download size={12} />
                                    Invoice
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
