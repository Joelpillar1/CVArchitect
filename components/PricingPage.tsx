import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import PricingPlans from './PricingPlans';
import SEO from './SEO';

export default function PricingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <SEO
                title="CV Architect Pricing — AI Resume Plans from $2.99/week"
                description="Foundation free tier with 1 AI-tailored resume. Sprint $2.99/week, Build $9.99/month, or Blueprint Pass $29 every 3 months. Unlimited AI tailoring, all templates, unlimited downloads."
                canonicalPath="/pricing"
            />
            <PublicHeader />

            <div className="pt-28 pb-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-brand-secondary border border-brand-border text-brand-dark px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                            <Zap size={14} className="text-brand-green fill-brand-green" />
                            Simple, honest pricing
                        </div>
                    </div>
                    <PricingPlans onFreeClick={() => navigate('/signup')} />
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
