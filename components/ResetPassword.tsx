import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthHeroShowcase from './AuthHeroShowcase';

interface ResetPasswordProps {
    onSuccess: () => void;
}

export default function ResetPassword({ onSuccess }: ResetPasswordProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true);

    useEffect(() => {
        // Check if we have a valid recovery token
        const checkRecoveryToken = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setIsValidToken(true);
                } else {
                    setError('Invalid or expired reset link. Please request a new one.');
                }
            } catch (err) {
                setError('Invalid or expired reset link. Please request a new one.');
            } finally {
                setCheckingToken(false);
            }
        };

        checkRecoveryToken();
    }, []);

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(pwd)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(pwd)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setSuccess(true);

            // Redirect to sign in after 2.5 seconds
            setTimeout(() => {
                onSuccess();
            }, 2500);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
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
                        onClick={onSuccess}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-dark transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <ArrowLeft size={15} />
                        <span>Sign In</span>
                    </button>
                </div>

                {/* Center Form Container */}
                <div className="w-full max-w-[390px] mx-auto my-auto py-8">
                    {checkingToken ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-green border-t-transparent mx-auto mb-4"></div>
                            <p className="text-sm font-medium text-gray-500">Verifying secure reset link...</p>
                        </div>
                    ) : !isValidToken ? (
                        <div className="text-left animate-fadeIn">
                            <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-2">
                                Invalid Reset Link
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
                                {error || 'This password reset link is invalid or has expired. Please request a new one.'}
                            </p>
                            <button
                                onClick={onSuccess}
                                className="w-full bg-brand-green hover:bg-brand-greenHover text-brand-dark py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    ) : success ? (
                        <div className="text-left animate-fadeIn">
                            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-2">
                                Password Updated
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
                                Your password has been successfully reset. Redirecting you to sign in...
                            </p>
                            <button
                                onClick={onSuccess}
                                className="w-full bg-brand-green hover:bg-brand-greenHover text-brand-dark py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                Sign In Now
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* Header */}
                            <div className="mb-7 text-left">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-2">
                                    Reset password
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
                                    Choose a strong, new password for your account
                                </p>
                            </div>

                            {/* Error Banner */}
                            {error && (
                                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-3.5 py-2.5 rounded-xl text-xs text-left animate-fadeIn">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all text-sm text-brand-dark placeholder:text-gray-400"
                                            placeholder="At least 6 characters"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all text-sm text-brand-dark placeholder:text-gray-400"
                                            placeholder="Re-enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                            aria-label="Toggle confirm password visibility"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex gap-1.5">
                                            <div className={`h-1.5 flex-1 rounded-full ${password.length >= 6 ? 'bg-emerald-500' : 'bg-gray-200'} transition-all`}></div>
                                            <div className={`h-1.5 flex-1 rounded-full ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'bg-emerald-500' : 'bg-gray-200'} transition-all`}></div>
                                            <div className={`h-1.5 flex-1 rounded-full ${/[0-9]/.test(password) ? 'bg-emerald-500' : 'bg-gray-200'} transition-all`}></div>
                                            <div className={`h-1.5 flex-1 rounded-full ${password.length >= 10 ? 'bg-emerald-500' : 'bg-gray-200'} transition-all`}></div>
                                        </div>
                                        <p className="text-[11px] text-gray-400">
                                            Include upper, lowercase, and numbers
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 bg-brand-green hover:bg-brand-greenHover active:scale-[0.99] text-brand-dark py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin"></div>
                                            <span>Updating password...</span>
                                        </>
                                    ) : (
                                        <span>Save & Continue</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Switcher to Login */}
                    <p className="text-center text-xs text-gray-600 mt-6">
                        Back to{' '}
                        <button
                            onClick={onSuccess}
                            className="text-brand-dark font-bold hover:underline cursor-pointer ml-1"
                        >
                            Sign In
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


