import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicHeader() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleGetStarted = () => {
        if (user) {
            navigate('/');
        } else {
            navigate('/');
        }
    };

    const handleSignIn = () => {
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img src="/images/logo icon.png" alt="CV Architect Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold tracking-tight text-brand-dark">CV Architect</span>
                </button>

                {/* Centered Navigation (Desktop) */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                    {[
                        { label: 'Features', path: '/#features' },
                        { label: 'The Difference', path: '/#the-difference' },
                        { label: 'Pricing', path: '/pricing' },
                        { label: 'Blog', path: '/blog' }
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (item.path.startsWith('/#')) {
                                    navigate('/');
                                    setTimeout(() => {
                                        const id = item.path.substring(2);
                                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }, 100);
                                } else {
                                    navigate(item.path);
                                }
                            }}
                            className="text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full"></span>
                        </button>
                    ))}
                </div>

                {/* Right Side Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                                <User size={16} className="text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {user.user_metadata?.full_name || user.email}
                                </span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGetStarted}
                                className="bg-brand-green hover:opacity-90 text-brand-dark px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm relative overflow-hidden group"
                            >
                                <span className="relative z-10">Go to Dashboard</span>
                                <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSignIn}
                                className="text-sm font-medium text-brand-dark hover:text-brand-green transition-colors"
                            >
                                Sign in
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGetStarted}
                                className="bg-brand-green hover:opacity-90 text-brand-dark px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm relative overflow-hidden group"
                            >
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                            </motion.button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-brand-dark p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-6">
                            {[
                                { label: 'Features', path: '/#features' },
                                { label: 'The Difference', path: '/#the-difference' },
                                { label: 'Pricing', path: '/pricing' },
                                { label: 'Blog', path: '/blog' }
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (item.path.startsWith('/#')) {
                                            navigate('/');
                                            setTimeout(() => {
                                                const id = item.path.substring(2);
                                                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }, 100);
                                        } else {
                                            navigate(item.path);
                                        }
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-lg font-medium text-gray-800 hover:text-brand-green text-left py-2 border-b border-gray-50 last:border-0"
                                >
                                    {item.label}
                                </button>
                            ))}

                            <div className="pt-4 flex flex-col gap-4">
                                {user ? (
                                    <button
                                        onClick={handleGetStarted}
                                        className="w-full bg-brand-green text-brand-dark py-3 rounded-lg font-bold shadow-sm"
                                    >
                                        Go to Dashboard
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSignIn}
                                            className="w-full border border-gray-200 text-brand-dark py-3 rounded-lg font-medium hover:bg-gray-50"
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={handleGetStarted}
                                            className="w-full bg-brand-green text-brand-dark py-3 rounded-lg font-bold shadow-sm hover:opacity-90"
                                        >
                                            Get Started
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
