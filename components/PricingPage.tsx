import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import PricingPlans from './PricingPlans';
import SEO from './SEO';

const faqs = [
    {
        q: 'Is everything the agent writes really grounded in my experience?',
        a: 'Yes. Every suggested edit must trace back to a real role, skill, or achievement in your history. Anything that cannot be grounded is blocked — nothing is invented, padded, or hallucinated.',
    },
    {
        q: 'Do I need a paid plan to get started?',
        a: 'No. The Foundation plan is completely free and includes one full AI-tailored resume with a PDF download. Paid plans unlock unlimited tailoring, all 20+ templates, and unlimited PDF & DOCX downloads.',
    },
    {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes. You can cancel your Sprint ($6/week) or Build ($20/month) plan at any time with one click from your account dashboard. You will retain full access until the end of your billing cycle.',
    },
    {
        q: 'What is the Lifetime plan?',
        a: 'The Lifetime plan is a one-time payment of $99 that gives you permanent, unrestricted access to all features, all 20+ templates, unlimited AI tailoring, and unlimited downloads forever with no renewals.',
    },
    {
        q: 'Can I create multiple tailored resumes for different jobs?',
        a: 'Yes. With paid plans, you can create and manage unlimited tailored versions of your resume tailored to different job postings, each with its own real-time ATS match score.',
    },
    {
        q: 'What formats can I export my resume in?',
        a: 'You can export your resume as a pixel-perfect, ATS-compliant PDF, an editable Word document (.DOCX), or plain text (.TXT) ready to paste into online application forms.',
    },
];

export default function PricingPage() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark">
            <SEO
                title="CV Architect Pricing — AI Resume Plans from $6/week"
                description="CV Architect pricing: Foundation free tier with 1 AI resume, Sprint pass from $6/wk, Build at $20/mo, and Lifetime access for $99."
                canonicalPath="/pricing"
            />
            <PublicHeader />

            <main className="flex-1 pt-24 md:pt-32 pb-24">
                {/* HERO / HEADER */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
                    <div className="mb-6 inline-flex items-center gap-2.5 py-1 pl-1 pr-4 sm:pr-5 rounded-full bg-white border border-brand-green/50 shadow-xs">
                        <span className="px-3 py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                            Pricing
                        </span>
                        <span className="text-sm font-semibold text-brand-dark">Simple, flat plans</span>
                    </div>

                    <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mb-5 max-w-3xl mx-auto">
                        Pay when you're ready to apply
                    </h1>
                    <p className="text-base sm:text-lg text-brand-dark/60 leading-relaxed max-w-2xl mx-auto">
                        Start free with one AI-tailored resume. Upgrade for unlimited tailoring, every template, and unlimited exports — cancel anytime.
                    </p>
                </div>

                {/* COMPARISON TABLE */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <PricingPlans onFreeClick={() => navigate('/signup')} compact />
                </div>

                {/* FAQ SECTION */}
                <section className="border-t border-brand-border pt-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-14">
                            <span className="inline-flex items-center gap-2.5 py-1 pl-1 pr-4 sm:pr-5 rounded-full bg-white border border-brand-green/50 shadow-xs mb-4">
                                <span className="px-3 py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                                    FAQ
                                </span>
                                <span className="text-sm font-semibold text-brand-dark">Straight answers</span>
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="border-t border-brand-border">
                            {faqs.map((faq, i) => {
                                const open = openFaq === i;
                                return (
                                    <div key={faq.q} className="border-b border-brand-border">
                                        <button
                                            onClick={() => setOpenFaq(open ? null : i)}
                                            className="w-full flex items-start gap-5 sm:gap-6 py-6 text-left transition-colors"
                                        >
                                            <span className="font-mono text-xs font-semibold text-brand-green shrink-0 pt-1">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span className="flex-1 text-base sm:text-lg font-bold tracking-tight text-brand-dark leading-snug">
                                                {faq.q}
                                            </span>
                                            <Plus
                                                size={18}
                                                className={`mt-1 shrink-0 text-brand-dark/50 transition-transform duration-300 ${
                                                    open ? 'rotate-45 text-brand-dark' : ''
                                                }`}
                                            />
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${
                                                open ? 'max-h-96' : 'max-h-0'
                                            }`}
                                        >
                                            <p className="pb-6 pl-10 sm:pl-12 pr-6 text-sm sm:text-base text-brand-dark/65 leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
