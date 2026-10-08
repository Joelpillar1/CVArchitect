import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import AuthHeroShowcase from './AuthHeroShowcase';

export default function ForgotPassword() {
    const navigate = useNavigate();
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
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

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white font-sans selection:bg-brand-green/30">
            {/* Left Column: Form (Full Height) */}
            <div className="lg:col-span-6 xl:col-span-5 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white z-10">
                {/* Top Bar: Brand & Back link */}
                <div className="flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5 group">
                        <img
                            src="/images/logo icon.png"
                            alt="CVArchitect"
                            className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                        <span className="font-bold text-xl tracking-tight text-brand-dark">
                            CVArchitect
                        </span>
                    </a>

                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-dark transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <ArrowLeft size={15} />
                        <span>Back to Log In</span>
                    </button>
                </div>

                {/* Center Form Container */}
                <div className="w-full max-w-[390px] mx-auto my-auto py-8">
                    {success ? (
                        <div className="text-left animate-fadeIn">
                            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-2">
                                Check your email
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                                We&apos;ve sent a password reset link to:
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-brand-dark mb-6 bg-brand-bg px-3.5 py-2.5 rounded-xl border border-gray-200">
                                {email}
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-brand-green hover:bg-brand-greenHover text-brand-dark py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>Return to Log In</span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-7 text-left">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-2">
                                    Reset password
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
                                    Enter your account email and we&apos;ll send you a secure link to reset your password
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-3.5 py-2.5 rounded-xl text-xs text-left animate-fadeIn">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all text-sm text-brand-dark placeholder:text-gray-400"
                                            placeholder="Enter your registered email"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 bg-brand-green hover:bg-brand-greenHover active:scale-[0.99] text-brand-dark py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>{loading ? 'Sending link...' : 'Send reset link'}</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Switcher to Login */}
                    <p className="text-center text-xs text-gray-600 mt-6">
                        Remember your password?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-brand-dark font-bold hover:underline cursor-pointer ml-1"
                        >
                            Log in
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center text-[11px] text-gray-400 pt-4 border-t border-gray-100">
                    <span>© {new Date().getFullYear()} CVArchitect</span>
                </div>
            </div>

            {/* Right Column: Hero Showcase (Full Height) */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full min-h-screen sticky top-0">
                <AuthHeroShowcase headlineTop="Simple & Powerful" headlineBottom="Secure & Protected" />
            </div>
        </div>
    );
}

