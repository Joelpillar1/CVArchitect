import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PublicFooter() {
    const navigate = useNavigate();

    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img src="/images/logo icon.png" alt="CV Architect Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold tracking-tight text-brand-dark">CV Architect</span>
                </button>
                <div className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} CV Architect. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <button onClick={() => navigate('/privacy')} className="text-gray-500 hover:text-brand-dark text-sm transition-colors">
                        Privacy Policy
                    </button>
                    <button onClick={() => navigate('/terms')} className="text-gray-500 hover:text-brand-dark text-sm transition-colors">
                        Terms of Service
                    </button>
                    <button onClick={() => navigate('/refund-policy')} className="text-gray-500 hover:text-brand-dark text-sm transition-colors">
                        Refund Policy
                    </button>
                    <button onClick={() => navigate('/contact')} className="text-gray-500 hover:text-brand-dark text-sm transition-colors">
                        Contact
                    </button>
                </div>
            </div>
        </footer>
    );
}
