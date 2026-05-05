import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Sparkles, 
    ChevronRight, 
    Copy, 
    Check, 
    ArrowRight, 
    Zap, 
    Users, 
    BarChart, 
    Terminal, 
    Edit3, 
    ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import SEO from './SEO';

const VERB_CATEGORIES = [
    {
        id: 'leadership',
        title: 'Leadership & Management',
        icon: Users,
        verbs: [
            'Spearheaded', 'Orchestrated', 'Directed', 'Guided', 'Mentored', 
            'Cultivated', 'Chaired', 'Facilitated', 'Oversaw', 'Transformed',
            'Advocated', 'Championed', 'Delegated', 'Empowered', 'Mobilized'
        ],
        example: {
            before: 'Managed a team of 10 people.',
            after: '**Spearheaded** a cross-functional team of 10, delivering a **$2M project** 3 weeks ahead of schedule.'
        }
    },
    {
        id: 'technical',
        title: 'Technical & Development',
        icon: Terminal,
        verbs: [
            'Architected', 'Engineered', 'Refactored', 'Automated', 'Deployed',
            'Debugged', 'Optimized', 'Integrated', 'Centralized', 'Modernized',
            'Scripted', 'Virtualized', 'Troubleshot', 'Migrated', 'Programmed'
        ],
        example: {
            before: 'Worked on the backend API.',
            after: '**Architected** a scalable RESTful API handling **50k+ requests/min**, reducing latency by **40%**.'
        }
    },
    {
        id: 'marketing',
        title: 'Marketing & Creative',
        icon: Sparkles,
        verbs: [
            'Generated', 'Conceptualized', 'Designed', 'Launched', 'Branded',
            'Amplified', 'Storyfilled', 'Contented', 'Curated', 'Influenced',
            'Produced', 'Drafted', 'Visualized', 'Promoted', 'Positioned'
        ],
        example: {
            before: 'Did social media posts.',
            after: '**Conceptualized** a viral LinkedIn campaign that **generated 2M+ organic impressions** in 30 days.'
        }
    },
    {
        id: 'finance',
        title: 'Finance & Operations',
        icon: BarChart,
        verbs: [
            'Audited', 'Projected', 'Forecasted', 'Allocated', 'Negotiated',
            'Reconciled', 'Reduced', 'Saved', 'Invested', 'Maximized',
            'Budgeted', 'Quantified', 'Yielded', 'Purchased', 'Contracted'
        ],
        example: {
            before: 'Handled the department budget.',
            after: '**Allocated** a **$15M annual budget**, identifying **$250k in cost savings** through vendor consolidation.'
        }
    },
    {
        id: 'communication',
        title: 'Communication & Support',
        icon: Edit3,
        verbs: [
            'Resolved', 'Clarified', 'Consulted', 'Liaised', 'Mediated',
            'Collaborated', 'Presented', 'Published', 'Authored', 'Persuaded',
            'Acquired', 'Addressed', 'Documented', 'Explained', 'Negotiated'
        ],
        example: {
            before: 'Helped customers with their issues.',
            after: '**Resolved** **200+ high-priority tickets** monthly, maintaining a **98.5% CSAT score**.'
        }
    },
    {
        id: 'analysis',
        title: 'Research & Analysis',
        icon: ShieldCheck,
        verbs: [
            'Analyzed', 'Evaluated', 'Identified', 'Interpreted', 'Simplified',
            'Mapped', 'Validated', 'Verified', 'Assessed', 'Investigated',
            'Synthesized', 'Summarized', 'Examined', 'Extracted', 'Surveyed'
        ],
        example: {
            before: 'Looked at the data to find patterns.',
            after: '**Analyzed** 1TB of user behavioral data to **identify a $50k/month revenue leak** in the checkout flow.'
        }
    }
];

export default function ActionVerbs() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedVerb, setCopiedVerb] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('All');

    const handleCopy = (verb: string) => {
        navigator.clipboard.writeText(verb);
        setCopiedVerb(verb);
        setTimeout(() => setCopiedVerb(null), 2000);
    };

    const allVerbs = VERB_CATEGORIES.flatMap(cat => cat.verbs.map(v => ({ verb: v, catId: cat.id, catTitle: cat.title })));
    
    const filteredVerbs = allVerbs.filter(v => 
        (activeTab === 'All' || v.catTitle === activeTab) &&
        v.verb.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = ['All', ...VERB_CATEGORIES.map(c => c.title)];

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const highlightText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\$\d+(?:,\d{3})*(?:\.\d+)?(?:[kMB])?|\d+%|\d+\s*(?:requests|impressions|requests\/min|requests\/sec|tickets))/gi);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={i} className="font-bold text-brand-dark">{part.slice(2, -2)}</span>;
            }
            if (part.match(/(\$\d+|\d+%|\d+\s*(?:requests|impressions|tickets))/i)) {
                return <span key={i} className="text-brand-green font-extrabold">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <SEO 
                title="150+ Action Verbs for Resume: The Ultimate Action Words Guide | CV Architect"
                description="Power up your resume with 150+ recruiter-approved action verbs for resume. Find the perfect action words to show impact, beat ATS, and land more interviews."
                canonicalPath="/action-words"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "headline": "150+ Action Verbs for Resume: The Ultimate Action Words Guide",
                    "description": "Comprehensive list of action verbs and action words for resumes to increase hiring chances.",
                    "keywords": "action verbs for resume, action verbs, action words"
                }}
            />
            <PublicHeader />

            {/* Hero Section */}
            <header className="pt-32 pb-16 px-6 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-widest mb-4">
                            Resume Power Words
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-tight mb-6" style={{ fontFamily: 'Graphik, sans-serif' }}>
                            150+ <span className="text-brand-green">Action Words</span> for Resume
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
                            Stop using "Responsible for." Use high-impact <strong>action words</strong> to transform your resume from a list of duties into a portfolio of achievements.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-xl mx-auto"
                    >
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Find the perfect action verb (e.g. 'Managed', 'Built')..."
                            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-float focus:outline-none focus:border-brand-green transition-all text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="sticky top-20 bg-white/80 backdrop-blur-md z-40 border-b border-slate-100 py-4 px-6 overflow-x-auto">
                <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 md:gap-4 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                activeTab === cat 
                                ? 'bg-brand-dark text-white shadow-lg' 
                                : 'bg-slate-100 text-gray-500 hover:bg-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: Verb Grid */}
            <main className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredVerbs.map((item, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={`${item.verb}-${idx}`}
                                className="group relative bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-xl hover:border-brand-green/30 transition-all cursor-pointer"
                                onClick={() => handleCopy(item.verb)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-brand-dark group-hover:text-brand-green transition-colors">{item.verb}</span>
                                    {copiedVerb === item.verb ? (
                                        <Check size={14} className="text-brand-green animate-bounce" />
                                    ) : (
                                        <Copy size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                                <div className="mt-2 text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                                    {item.catId}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredVerbs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No action verbs found for "{searchQuery}"</p>
                        <button onClick={() => setSearchQuery('')} className="mt-4 text-brand-green font-bold hover:underline">Clear search</button>
                    </div>
                )}
            </main>

            {/* Educational Section: How to use them */}
            <section className="bg-slate-50 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">How to Use Action Words Effectively</h2>
                        <p className="text-gray-500 text-lg">Replacing weak verbs with strong action verbs is the fastest way to improve your resume's impact.</p>
                    </div>

                    <div className="space-y-12">
                        {VERB_CATEGORIES.map((cat, idx) => (
                            <motion.div 
                                key={cat.id}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-brand-green/10 rounded-2xl text-brand-green">
                                        <cat.icon size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-dark">{cat.title}</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Common Weak Phrases</p>
                                        <p className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 italic flex items-center gap-3">
                                            <span className="text-lg">❌</span> {cat.example.before}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-right">The "Action Word" Upgrade</p>
                                        <p className="p-4 bg-brand-green/5 border border-brand-green/20 rounded-xl text-brand-dark font-medium flex items-start gap-3">
                                            <span className="text-lg">✅</span> 
                                            <span>{highlightText(cat.example.after)}</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEO Keywords Block (Hidden or subtle) */}
            <section className="py-12 px-6 bg-white border-t border-slate-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-brand-dark mb-6">Why Action Verbs Matter in 2026</h2>
                    <div className="prose prose-slate max-w-none text-gray-600 space-y-4">
                        <p>
                            Using high-impact <strong>action verbs for resume</strong> is no longer just a "nice-to-have" strategy. In the modern job market, both human recruiters and AI-driven ATS (Applicant Tracking Systems) look for specific markers of success. 
                        </p>
                        <p>
                            Strong <strong>action verbs</strong> signify ownership. When you use words like "Orchestrated" or "Architected," you are demonstrating a level of agency that "Worked on" simply cannot convey. These <strong>action words</strong> are the building blocks of a high-performance resume.
                        </p>
                        <p>
                            At CV Architect, we've analyzed thousands of successful resumes to identify which <strong>action words for resume</strong> generate the highest response rates. Our database is curated to help you stand out in competitive fields like Tech, Finance, and Marketing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 bg-brand-dark text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>
                
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Ready to Build Your Impact?</h2>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                        Don't just list your action verbs. Use them in our AI-powered builder to create a resume that lands interviews.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto bg-brand-green text-brand-dark px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-brand-green/20"
                        >
                            Start Building Now — It's Free
                        </button>
                        <button 
                            onClick={() => navigate('/resume-checker')}
                            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all"
                        >
                            Check My Resume
                        </button>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
