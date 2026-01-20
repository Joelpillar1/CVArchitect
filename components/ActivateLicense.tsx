import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Key, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LicenseActivationModal from './LicenseActivationModal';
import { useToast } from '../contexts/ToastContext';

export default function ActivateLicense() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [showLicenseModal, setShowLicenseModal] = useState(false);

    useEffect(() => {
        // Auto-open license modal after a short delay
        const timer = setTimeout(() => {
            setShowLicenseModal(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleSuccess = (plan: string) => {
        setShowLicenseModal(false);
        showToast(
            `🎉 License activated! You now have ${plan === 'week_pass' ? 'Career Sprint' : 'Career Marathon'} access!`,
            'success'
        );
        // Redirect to dashboard
        navigate('/dashboard');
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-green/5 via-white to-brand-secondary/5 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle size={48} className="text-green-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Payment Successful! 🎉
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-8">
                        Thank you for your purchase! Your license key has been sent to your email.
                    </p>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
                        <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Key size={20} />
                            How to Activate Your License
                        </h2>
                        <ol className="space-y-2 text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="font-bold min-w-[1.5rem]">1.</span>
                                <span>Check your email for your license key (starts with "mem_")</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold min-w-[1.5rem]">2.</span>
                                <span>Copy the license key</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="font-bold min-w-[1.5rem]">3.</span>
                                <span>Click "Activate License" below and paste your key</span>
                            </li>
                        </ol>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setShowLicenseModal(true)}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-green text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Key size={20} />
                            Activate License Now
                        </button>

                        <button
                            onClick={handleSkip}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                        >
                            I'll Activate Later
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Help Text */}
                    <p className="text-sm text-gray-500 mt-6">
                        Can't find your license key?{' '}
                        <a
                            href="https://whop.com/hub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-green hover:underline font-semibold"
                        >
                            Check your Whop Hub
                        </a>
                    </p>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Need help?{' '}
                        <a href="/contact" className="text-brand-green hover:underline font-semibold">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>

            {/* License Activation Modal */}
            <LicenseActivationModal
                isOpen={showLicenseModal}
                onClose={() => setShowLicenseModal(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
