import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validateAndActivateLicense } from '../services/whopLicenseService';

interface LicenseActivationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (plan: string) => void;
}

export default function LicenseActivationModal({
    isOpen,
    onClose,
    onSuccess,
}: LicenseActivationModalProps) {
    const { user } = useAuth();
    const [licenseKey, setLicenseKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleActivate = async () => {
        if (!user) {
            setError('You must be logged in to activate a license');
            return;
        }

        if (!licenseKey.trim()) {
            setError('Please enter a license key');
            return;
        }

        // Validate format (Whop license keys start with "mem_")
        if (!licenseKey.trim().startsWith('mem_')) {
            setError('Invalid license key format. License keys should start with "mem_"');
            return;
        }

        setLoading(true);
        setError('');

        const result = await validateAndActivateLicense(
            licenseKey.trim(),
            user.id,
            user.email || ''
        );

        setLoading(false);

        if (result.success && result.plan) {
            onSuccess(result.plan);
            setLicenseKey('');
        } else {
            setError(result.error || 'Failed to activate license');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleActivate();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Activate License Key</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Enter the license key you received after purchasing on Whop.
                    </p>

                    <div>
                        <label
                            htmlFor="license-key"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            License Key
                        </label>
                        <input
                            id="license-key"
                            type="text"
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="mem_ABC123XYZ..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                            Where to find your license key:
                        </p>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>Check your email from Whop</li>
                            <li>
                                Or go to{' '}
                                <a
                                    href="https://whop.com/hub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-blue-600"
                                >
                                    whop.com/hub
                                </a>
                            </li>
                            <li>Click on "CVArchitect"</li>
                            <li>Copy your license key (starts with "mem_")</li>
                        </ol>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleActivate}
                        className="flex-1 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !licenseKey.trim()}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Activating...
                            </span>
                        ) : (
                            'Activate License'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
