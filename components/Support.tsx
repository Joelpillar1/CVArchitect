import React, { useState, useEffect } from 'react';
import {
    Search,
    ChevronDown,
    ChevronUp,
    Mail,
    MessageSquare,
    FileText,
    CreditCard,
    Shield,
    Zap,
    BookOpen,
    CheckCircle,
    ArrowRight,
    ExternalLink,
    HelpCircle,
    Download,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';
import { Link } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FAQ {
    id: string;
    question: string;
    answer: React.ReactNode;
    category: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
    { id: 'all', label: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'export', label: 'Export & Download', icon: Download },
    { id: 'ai-features', label: 'AI Features', icon: Zap },
];

const FAQS: FAQ[] = [
    // Getting Started
    {
        id: 'gs-1',
        category: 'getting-started',
        question: 'How do I get started with CV Architect?',
        answer: (
            <p>
                Sign up for a free account at{' '}
                <Link to="/signup" className="text-brand-green font-semibold hover:underline">
                    cvarchitect.app/signup
                </Link>
                . Once registered, you'll receive a few free AI credits to explore all features — no credit card required. Choose a template, fill in your information, and let our AI optimise your resume for any job.
            </p>
        ),
    },
    {
        id: 'gs-2',
        category: 'getting-started',
        question: 'What is included in the free plan?',
        answer: (
            <p>
                Every new account receives free AI credits that unlock the core AI rewriting and ATS analysis features. Free users can also create and save resumes using any template, export to PDF, and access the Job Match tool. Once credits are used, you can purchase additional credits or upgrade to a paid plan for unlimited access.
            </p>
        ),
    },
    {
        id: 'gs-3',
        category: 'getting-started',
        question: 'Do I need to install anything?',
        answer: (
            <p>
                No installation required. CV Architect is a fully web-based platform — simply open your browser and start building. We also offer a Chrome Extension that lets you import job descriptions directly from LinkedIn and other job boards with one click.
            </p>
        ),
    },
    // Resume Builder
    {
        id: 'rb-1',
        category: 'resume-builder',
        question: 'How many resume templates are available?',
        answer: (
            <p>
                CV Architect offers a growing library of professionally designed templates across several styles — modern, classic, minimal, and creative. All templates are ATS-friendly and fully customisable with your preferred fonts, colours, and layouts.
            </p>
        ),
    },
    {
        id: 'rb-2',
        category: 'resume-builder',
        question: 'Can I have multiple resumes for different jobs?',
        answer: (
            <p>
                Yes! You can create and save as many resumes as you need. We recommend tailoring a separate version for each role you apply to — our AI Job Match feature makes this fast and easy by adapting your content to a specific job description.
            </p>
        ),
    },
    {
        id: 'rb-3',
        category: 'resume-builder',
        question: 'What is ATS and why does it matter?',
        answer: (
            <>
                <p className="mb-2">
                    ATS (Applicant Tracking System) is software used by recruiters to automatically screen resumes before a human ever sees them. Resumes not optimised for ATS are often rejected instantly — even highly qualified candidates.
                </p>
                <p>
                    CV Architect analyses your resume against the job description and gives you an ATS score with actionable suggestions for keyword improvements, formatting fixes, and section enhancements.
                </p>
            </>
        ),
    },
    {
        id: 'rb-4',
        category: 'resume-builder',
        question: 'How do I import my existing resume?',
        answer: (
            <p>
                You can upload a PDF or Word document and our OCR-powered parser will extract your information automatically, saving you hours of manual data entry. You can then edit and optimise each section using our AI tools.
            </p>
        ),
    },
    // AI Features
    {
        id: 'ai-1',
        category: 'ai-features',
        question: 'How does the AI rewriting feature work?',
        answer: (
            <p>
                Our AI (powered by Google Generative AI) reads your current resume content and the target job description, then rewrites your bullet points to be achievement-focused, keyword-rich, and ATS-optimised — all while keeping your voice. You approve every change before it's applied.
            </p>
        ),
    },
    {
        id: 'ai-2',
        category: 'ai-features',
        question: 'Is my resume data used to train AI models?',
        answer: (
            <p>
                No. Your resume content and job descriptions are processed solely to generate your optimised output. We do not use your data to train AI models, and we do not share it with third parties for marketing purposes. See our{' '}
                <Link to="/privacy" className="text-brand-green font-semibold hover:underline">
                    Privacy Policy
                </Link>{' '}
                for full details.
            </p>
        ),
    },
    {
        id: 'ai-3',
        category: 'ai-features',
        question: 'What are AI credits and how do I get more?',
        answer: (
            <p>
                Each AI operation (rewriting a section, generating a cover letter, running an ATS check) consumes a small number of credits. You start with free credits, and you can purchase more at any time from your dashboard or upgrade to a plan with a monthly credit allowance. Credits never expire.
            </p>
        ),
    },
    // Billing
    {
        id: 'billing-1',
        category: 'billing',
        question: 'What payment methods do you accept?',
        answer: (
            <p>
                We accept all major credit and debit cards (Visa, Mastercard, American Express) as well as Apple Pay and Google Pay. All payments are processed securely through Stripe — we never store your payment details.
            </p>
        ),
    },
    {
        id: 'billing-2',
        category: 'billing',
        question: 'Can I cancel my subscription at any time?',
        answer: (
            <p>
                Yes. You can cancel your subscription at any time from your account settings — no questions asked. You'll continue to have access to your plan features until the end of your current billing period.
            </p>
        ),
    },
    {
        id: 'billing-3',
        category: 'billing',
        question: 'Do you offer refunds?',
        answer: (
            <p>
                Yes. Please see our{' '}
                <Link to="/refund-policy" className="text-brand-green font-semibold hover:underline">
                    Refund Policy
                </Link>{' '}
                for full details. In general, we offer a 7-day refund on subscription purchases if you have not used the AI features extensively. Credit purchases are non-refundable once used.
            </p>
        ),
    },
    {
        id: 'billing-4',
        category: 'billing',
        question: 'Is my payment information secure?',
        answer: (
            <p>
                Absolutely. All payments are processed by Stripe, a PCI-DSS Level 1 certified payment processor. CV Architect never stores your card details on our servers.
            </p>
        ),
    },
    // Account
    {
        id: 'acc-1',
        category: 'account',
        question: 'How do I reset my password?',
        answer: (
            <p>
                Visit{' '}
                <Link to="/forgot-password" className="text-brand-green font-semibold hover:underline">
                    cvarchitect.app/forgot-password
                </Link>{' '}
                and enter your email address. You'll receive a secure password reset link within a few minutes. If you don't see the email, please check your spam folder.
            </p>
        ),
    },
    {
        id: 'acc-2',
        category: 'account',
        question: 'How do I delete my account?',
        answer: (
            <p>
                You can permanently delete your account and all associated data from <strong>Dashboard → Settings → Account → Delete Account</strong>. This action is irreversible. If you'd like help before deleting, please{' '}
                <Link to="/contact" className="text-brand-green font-semibold hover:underline">
                    contact our support team
                </Link>
                .
            </p>
        ),
    },
    {
        id: 'acc-3',
        category: 'account',
        question: 'Can I change the email address on my account?',
        answer: (
            <p>
                Yes. Go to <strong>Dashboard → Settings → Account</strong> to update your email address. A confirmation link will be sent to your new address before the change is applied.
            </p>
        ),
    },
    // Export
    {
        id: 'exp-1',
        category: 'export',
        question: 'What formats can I export my resume in?',
        answer: (
            <p>
                CV Architect exports your resume as a high-quality <strong>PDF</strong> with pixel-perfect formatting. We use a print-optimised renderer to ensure your resume looks exactly right for recruiters and ATS systems.
            </p>
        ),
    },
    {
        id: 'exp-2',
        category: 'export',
        question: 'My PDF looks different from the preview — how do I fix this?',
        answer: (
            <>
                <p className="mb-2">
                    This is usually caused by a font not loading before the PDF is generated. Try the following steps:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Wait a few seconds after all fonts load, then download again.</li>
                    <li>Try a different browser (Chrome is recommended).</li>
                    <li>Disable browser extensions that may interfere with rendering.</li>
                </ol>
                <p className="mt-2">
                    If the issue persists, please{' '}
                    <Link to="/contact" className="text-brand-green font-semibold hover:underline">
                        contact support
                    </Link>{' '}
                    with a screenshot.
                </p>
            </>
        ),
    },
    {
        id: 'exp-3',
        category: 'export',
        question: 'Is there a download limit?',
        answer: (
            <p>
                No. You can download your resume as many times as you like, on any plan. Downloads do not consume AI credits.
            </p>
        ),
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-brand-green shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
        >
            <button
                id={`faq-btn-${faq.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.id}`}
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-brand-dark pr-4">{faq.question}</span>
                <span className={`shrink-0 transition-transform duration-200 ${isOpen ? 'text-brand-green' : 'text-gray-400'}`}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
            </button>

            <div
                id={`faq-panel-${faq.id}`}
                role="region"
                aria-labelledby={`faq-btn-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100"
                    style={{ paddingTop: '1.25rem' }}>
                    {faq.answer}
                </div>
            </div>
        </div>
    );
}

function StatusBadge() {
    return (
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-full px-4 py-2 text-sm font-medium">
            <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            All systems operational
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Support() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openFAQ, setOpenFAQ] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Filter FAQs
    const filteredFAQs = FAQS.filter((faq) => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch =
            searchQuery.trim() === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleToggle = (id: string) => {
        setOpenFAQ((prev) => (prev === id ? null : id));
    };

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Support Center — CV Architect"
                description="Find answers to common questions about CV Architect's AI resume builder, billing, account management, and more. Contact our support team for personalised help."
                canonicalPath="/support"
            />
            <PublicHeader />

            {/* ─── Hero ─────────────────────────────────────── */}
            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-brand-bg to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <StatusBadge />

                    <h1
                        className="mt-6 text-4xl md:text-5xl font-extrabold text-brand-dark mb-4 leading-tight"
                        style={{ fontFamily: 'Graphik, sans-serif' }}
                    >
                        How can we help?
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                        Search our knowledge base or browse by topic. Can't find your answer? Our team is here for you.
                    </p>

                    {/* Search bar */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            id="support-search"
                            type="search"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setActiveCategory('all');
                                setOpenFAQ(null);
                            }}
                            placeholder="Search questions…"
                            className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-brand-green outline-none text-base shadow-sm transition-all bg-white"
                        />
                    </div>
                </div>
            </section>

            <main className="max-w-5xl mx-auto px-6 pb-24">

                {/* ─── Quick Links ───────────────────────────── */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                    {[
                        {
                            icon: Mail,
                            title: 'Email Support',
                            desc: 'Replies within 24 hours',
                            href: 'mailto:support@cvarchitect.app',
                            external: true,
                            cta: 'support@cvarchitect.app',
                        },
                        {
                            icon: MessageSquare,
                            title: 'Live Chat',
                            desc: 'Mon – Fri, 9 AM – 6 PM EST',
                            href: '/contact',
                            external: false,
                            cta: 'Start a chat',
                        },
                        {
                            icon: BookOpen,
                            title: 'Blog & Guides',
                            desc: 'Tips, tutorials & career advice',
                            href: '/blog',
                            external: false,
                            cta: 'Visit the blog',
                        },
                    ].map(({ icon: Icon, title, desc, href, external, cta }) => (
                        <a
                            key={title}
                            href={href}
                            target={external ? '_blank' : undefined}
                            rel={external ? 'noopener noreferrer' : undefined}
                            className="group flex flex-col gap-3 bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-brand-green hover:shadow-lg transition-all"
                        >
                            <div className="w-11 h-11 bg-brand-green/10 rounded-xl flex items-center justify-center">
                                <Icon className="text-brand-green" size={22} />
                            </div>
                            <div>
                                <h2 className="font-bold text-brand-dark">{title}</h2>
                                <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                            </div>
                            <span className="mt-auto text-sm font-semibold text-brand-green flex items-center gap-1 group-hover:gap-2 transition-all">
                                {cta}
                                {external ? <ExternalLink size={13} /> : <ArrowRight size={13} />}
                            </span>
                        </a>
                    ))}
                </section>

                {/* ─── Category Filters ──────────────────────── */}
                {searchQuery.trim() === '' && (
                    <section className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    id={`cat-btn-${id}`}
                                    onClick={() => {
                                        setActiveCategory(id);
                                        setOpenFAQ(null);
                                    }}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeCategory === id
                                            ? 'bg-brand-green text-brand-dark border-brand-green shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green hover:text-brand-dark'
                                        }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── FAQ List ──────────────────────────────── */}
                <section aria-label="Frequently asked questions">
                    {searchQuery.trim() !== '' && (
                        <p className="text-sm text-gray-500 mb-4">
                            {filteredFAQs.length === 0
                                ? 'No results found.'
                                : `${filteredFAQs.length} result${filteredFAQs.length > 1 ? 's' : ''} for "${searchQuery}"`}
                        </p>
                    )}

                    {filteredFAQs.length === 0 ? (
                        <div className="text-center py-16">
                            <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
                            <h3 className="text-lg font-semibold text-brand-dark mb-2">No results found</h3>
                            <p className="text-gray-500 mb-6">
                                Try a different search term, or contact our support team directly.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 bg-brand-green text-brand-dark px-6 py-3 rounded-full font-bold hover:opacity-90 transition-all"
                            >
                                <Mail size={16} />
                                Contact Support
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredFAQs.map((faq) => (
                                <FAQItem
                                    key={faq.id}
                                    faq={faq}
                                    isOpen={openFAQ === faq.id}
                                    onToggle={() => handleToggle(faq.id)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* ─── Still Need Help CTA ───────────────────── */}
                {filteredFAQs.length > 0 && (
                    <section className="mt-16 bg-gradient-to-br from-brand-dark to-gray-700 rounded-3xl p-10 text-center text-white">
                        <div className="w-14 h-14 bg-brand-green/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <RefreshCw className="text-brand-green" size={28} />
                        </div>
                        <h2 className="text-2xl font-extrabold mb-3" style={{ fontFamily: 'Graphik, sans-serif' }}>
                            Still need help?
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-md mx-auto">
                            Our support team is happy to help. We typically respond within 24 hours on business days.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-brand-green text-brand-dark px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition-all shadow-lg"
                            >
                                <Mail size={18} />
                                Contact Support
                            </Link>
                            <a
                                href="mailto:support@cvarchitect.app"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/20 transition-all border border-white/20"
                            >
                                <ExternalLink size={18} />
                                support@cvarchitect.app
                            </a>
                        </div>
                    </section>
                )}

                {/* ─── Trust Row ─────────────────────────────── */}
                <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    {[
                        { icon: CheckCircle, label: '24-hour response time', sub: 'On all support requests' },
                        { icon: Shield, label: 'Your data is safe', sub: 'AES-256 encryption at rest' },
                        { icon: MessageSquare, label: 'Real human support', sub: 'No bots, just people' },
                    ].map(({ icon: Icon, label, sub }) => (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                                <Icon className="text-brand-green" size={20} />
                            </div>
                            <p className="font-semibold text-brand-dark text-sm">{label}</p>
                            <p className="text-xs text-gray-500">{sub}</p>
                        </div>
                    ))}
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
