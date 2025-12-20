import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

interface ForgotPasswordProps {
    onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            // Import supabase here to avoid circular dependencies
            const { supabase } = await import('../lib/supabase');

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Success State */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="text-3xl font-extrabold text-brand-dark mb-4" style={{ fontFamily: 'Graphik, sans-serif' }}>
                            Check Your Email
                        </h1>

                        <p className="text-gray-600 mb-2">
                            We've sent a password reset link to:
                        </p>
                        <p className="text-brand-dark font-semibold mb-6">
                            {email}
                        </p>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-left">
                            <p className="text-sm text-brand-dark font-semibold">
                                Next steps:
                            </p>
                            <ol className="text-sm text-gray-700 mt-2 space-y-1 list-decimal list-inside">
                                <li>Check your email inbox</li>
                                <li>Click the reset link (valid for 1 hour)</li>
                                <li>Enter your new password</li>
                            </ol>
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                            Didn't receive the email? Check your spam folder or{' '}
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-brand-green hover:text-green-700 font-semibold"
                            >
                                try again
                            </button>
                        </p>

                        <button
                            onClick={onBack}
                            className="w-full py-3 rounded-xl font-semibold bg-brand-green text-brand-dark hover:opacity-90 transition-all shadow-lg"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-brand-dark transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Sign In</span>
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-2" style={{ fontFamily: 'Graphik, sans-serif' }}>
                        Forgot Password?
                    </h1>
                    <p className="text-gray-500">
                        No worries! Enter your email and we'll send you reset instructions.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
                                placeholder="your.email@example.com"
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-green hover:opacity-90 text-brand-dark px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {/* Additional Help */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Remember your password?{' '}
                        <button onClick={onBack} className="text-brand-green hover:text-green-700 font-semibold">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
