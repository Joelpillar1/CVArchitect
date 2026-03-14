import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Zap, Target, FileSearch, Sparkles, Layout, Trophy, PartyPopper, BarChart2 } from 'lucide-react';
import SEO from './SEO';
import PublicFooter from './PublicFooter';
import PublicHeader from './PublicHeader';

import { ATSEngine } from '../utils/ats-engine/engine';
import taxonomyData from '../Bullets/ats_keyword_dataset_10k_plus.json';
import { ATSEngineResult } from '../utils/ats-engine/types';

const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'to', 'in', 'of', 'on', 'at', 'is', 'are', 'from', 'this', 'that', 'your', 'will', 'have', 'more', 'about', 'they', 'their']);

const LOADING_STEPS = [
    "Analyzing resume structure...",
    "Scanning for industry-specific terminology...",
    "Identifying skill gaps and tool proficiencies...",
    "Calculating ATS compatibility score...",
    "Generating optimization recommendations..."
];

export default function ResumeMatchChecker() {
    const [resume, setResume] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [results, setResults] = useState<ATSEngineResult | null>(null);

    const calculateScore = async () => {
        if (!jobDesc.trim() || !resume.trim()) return;

        setIsLoading(true);
        setResults(null);
        setLoadingStep(0);

        // Simulate AI analysis steps (keeping the visual flair)
        for (let i = 0; i < LOADING_STEPS.length; i++) {
            setLoadingStep(i);
            const delay = 600 + Math.random() * 400;
            
            // Perform actual calculation during one of the steps
            if (i === 2) {
                const engine = new ATSEngine(taxonomyData);
                const result = engine.analyze(jobDesc, resume);
                
                // Keep the simulation running but save the result
                setTimeout(() => {
                    setResults(result);
                }, (LOADING_STEPS.length - i) * 800);
            }
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        setIsLoading(false);

        // Scroll to results
        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="min-h-screen bg-brand-bg font-sans text-brand-dark overflow-x-hidden">
            <SEO 
                title="Free Resume vs Job Description Match Checker (2026) | Beat the ATS"
                description="Scan your resume against any job description to find missing keywords and optimize your ATS score. Use our free AI scanner to increase your interview calls instantly."
                keywords="resume match checker, ats keyword optimizer, job description comparison, free resume scanner, resume keyword gap analysis"
                canonicalPath="/resume-checker"
            />

            <PublicHeader />

            <main className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
                {/* Hero Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-greenHover rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-brand-green/20">
                        <Zap size={12} className="fill-brand-green" />
                        Free SEO Growth Tool
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4 tracking-tight">
                        Resume vs Job Description <br className="hidden md:block" />
                        <span className="text-brand-greenHover">Match Checker</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Stop guessing if your resume will pass the ATS. Compare your resume against any job description and see the exact keywords you're missing.
                    </p>
                </motion.div>

                {/* Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-3"
                    >
                        <label className="text-sm font-bold flex items-center gap-2 text-brand-dark/70">
                            <Target size={16} />
                            Paste Job Description
                        </label>
                        <textarea 
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                            placeholder="Paste the job requirements from LinkedIn, Indeed, etc..."
                            className="w-full h-80 p-5 rounded-2xl border-2 border-brand-border bg-white shadow-soft focus:border-brand-green outline-none transition-all resize-none text-[15px] leading-relaxed"
                        />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-3"
                    >
                        <label className="text-sm font-bold flex items-center gap-2 text-brand-dark/70">
                            <FileSearch size={16} />
                            Paste Your Resume
                        </label>
                        <textarea 
                            value={resume}
                            onChange={(e) => setResume(e.target.value)}
                            placeholder="Paste your current resume text here..."
                            className="w-full h-80 p-5 rounded-2xl border-2 border-brand-border bg-white shadow-soft focus:border-brand-green outline-none transition-all resize-none text-[15px] leading-relaxed"
                        />
                    </motion.div>
                </div>

                {/* Loading State */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl border-2 border-brand-green/30 shadow-float p-8 text-center mb-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 h-1 bg-brand-green transition-all duration-500 shadow-[0_0_15px_rgba(112,224,152,0.8)]" style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}></div>
                            
                            <div className="flex flex-col items-center gap-6 py-6">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
                                    <Sparkles size={32} className="absolute inset-0 m-auto text-brand-green animate-pulse" />
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-brand-dark">AI is analyzing your resume...</h3>
                                    <motion.p 
                                        key={loadingStep}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-brand-greenHover font-medium"
                                    >
                                        {LOADING_STEPS[loadingStep]}
                                    </motion.p>
                                </div>

                                <div className="flex gap-2">
                                    {LOADING_STEPS.map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i <= loadingStep ? 'w-8 bg-brand-green' : 'w-4 bg-gray-100'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Calculate Button */}
                <motion.div 
                    layout
                    className="flex justify-center mt-8"
                >
                    <button 
                        onClick={calculateScore}
                        disabled={!resume || !jobDesc || isLoading}
                        className="group relative px-10 py-5 bg-brand-dark text-white rounded-full font-bold text-lg shadow-float disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {isLoading ? (
                                <>
                                    Analyzing...
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                </>
                            ) : (
                                <>
                                    Check Match Score
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                        {!isLoading && <div className="absolute inset-0 bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                    </button>
                </motion.div>

                {/* Results Section */}
                <AnimatePresence>
                    {results && (
                        <motion.section 
                            id="results-section"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="scroll-mt-24"
                        >
                            <div className="bg-white rounded-3xl border-2 border-brand-border shadow-float p-8 md:p-12">
                                <div className="flex flex-col items-center text-center mb-12">
                                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-green/10 text-brand-greenHover rounded-full text-sm font-bold">
                                            <Target size={14} />
                                            Industry: {results.detected_industry}
                                        </div>
                                        {results.recruiter_insights.role_level_match !== 'unclear' && (
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
                                                results.recruiter_insights.role_level_match === 'match' 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'bg-rose-50 text-rose-600'
                                            }`}>
                                                {results.recruiter_insights.role_level_match === 'match' ? <Check size={14} /> : <X size={14} />}
                                                Level: {results.recruiter_insights.role_level_match.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-bold mb-8">Recruiter Analysis</h2>
                                    
                                    {/* Score Display */}
                                    <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="96"
                                                cy="96"
                                                r="88"
                                                fill="transparent"
                                                stroke="#F3F3F3"
                                                strokeWidth="12"
                                            />
                                            <motion.circle
                                                cx="96"
                                                cy="96"
                                                r="88"
                                                fill="transparent"
                                                stroke={results.score_breakdown.overall_score > 70 ? "#70E098" : results.score_breakdown.overall_score > 40 ? "#FFB800" : "#FF4D4D"}
                                                strokeWidth="12"
                                                strokeDasharray={552.92}
                                                initial={{ strokeDashoffset: 552.92 }}
                                                animate={{ strokeDashoffset: 552.92 - (552.92 * results.score_breakdown.overall_score) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-black text-brand-dark">{results.score_breakdown.overall_score}%</span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Match Score</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 font-medium max-w-md">
                                        {results.score_breakdown.overall_score > 80 ? "Excellent signal! A recruiter would likely move you to the next stage." : 
                                         results.score_breakdown.overall_score > 50 ? "Good potential, but needs more impact metrics and keyword alignment." : 
                                         "Weak hiring signal. Your resume lacks both key terms and quantified results."}
                                    </p>
                                </div>

                                {/* NEW: Recruiter Insights Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                    <div className="bg-brand-dark text-white rounded-2xl p-6 shadow-float relative overflow-hidden group">
                                        <div className="absolute -top-4 -right-4 opacity-10 group-hover:rotate-12 transition-transform">
                                            <BarChart2 size={120} />
                                        </div>
                                        <h3 className="text-brand-green font-bold text-xs uppercase tracking-[0.2em] mb-4">Impact Metrics</h3>
                                        <div className="flex items-end gap-2 mb-4">
                                            <span className="text-4xl font-black">{results.recruiter_insights.quantification_score}%</span>
                                            <span className="text-brand-green/60 text-xs pb-1 font-bold">Quantification</span>
                                        </div>
                                        <p className="text-white/70 text-sm leading-relaxed mb-4">
                                            Recruiters look for data. Your resume has <b>{results.recruiter_insights.detected_metrics.length}</b> distinct data points.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {results.recruiter_insights.detected_metrics.slice(0, 4).map((m, i) => (
                                                <span key={i} className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded-md border border-white/5">{m}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white border-2 border-brand-dark rounded-2xl p-6 shadow-soft relative overflow-hidden group">
                                        <div className="absolute -top-4 -right-4 text-brand-dark/5 group-hover:-rotate-12 transition-transform">
                                            <Zap size={120} />
                                        </div>
                                        <h3 className="text-brand-dark/40 font-bold text-xs uppercase tracking-[0.2em] mb-4">Action Verb Strength</h3>
                                        <div className="flex items-end gap-2 mb-4">
                                            <span className="text-4xl font-black text-brand-dark">{results.recruiter_insights.action_verb_strength}%</span>
                                            <span className="text-gray-400 text-xs pb-1 font-bold">Power Verbs</span>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                            You are using <b>{results.recruiter_insights.power_verbs_found.length}</b> unique high-impact action verbs.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {results.recruiter_insights.power_verbs_found.slice(0, 4).map((v, i) => (
                                                <span key={i} className="text-[10px] font-bold px-2 py-1 bg-brand-bg rounded-md border border-gray-100 uppercase text-brand-dark/60">{v}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Scoring Logic Visual Breakdown */}
                                <div className="bg-brand-bg/50 rounded-2xl border border-brand-border p-6 mb-12">
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={14} className="text-brand-green" />
                                            Match Breakdown by Category
                                        </h3>
                                        <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brand-green"></div> Strong</div>
                                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brand-dark"></div> Meta</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                                        {[
                                            { label: 'Hard Skills', score: results.score_breakdown.hard_skills, weight: '25%', tip: 'Core competency' },
                                            { label: 'Tools', score: results.score_breakdown.tools, weight: '20%', tip: 'Technical stack' },
                                            { label: 'Industry', score: results.score_breakdown.industry_terms, weight: '15%', tip: 'Domain context' },
                                            { label: 'Methods', score: results.score_breakdown.methodologies, weight: '15%', tip: 'Process maturity' },
                                            { label: 'Soft Skills', score: results.score_breakdown.soft_skills, weight: '5%', tip: 'Team culture/ATS' },
                                            { label: 'Impact', score: results.score_breakdown.quantification, weight: '10%', tip: 'Performance data' },
                                            { label: 'Verbs', score: results.score_breakdown.verb_strength, weight: '10%', tip: 'Action/Authority' }
                                        ].map((s, i) => (
                                            <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center group/cat relative">
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/cat:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-float">
                                                    {s.tip} ({s.weight})
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-dark"></div>
                                                </div>
                                                <div className="text-[10px] font-bold text-gray-400 mb-1">{s.label}</div>
                                                <div className={`text-sm font-black ${s.score !== null ? (s.score > 70 ? 'text-brand-green' : 'text-orange-400') : 'text-gray-300'}`}>
                                                    {s.score !== null ? `${Math.round(s.score)}%` : 'N/A'}
                                                </div>
                                                <div className="w-full h-1 bg-gray-50 rounded-full mt-2 overflow-hidden">
                                                    {s.score !== null && (
                                                        <div 
                                                            className={`h-full ${s.score > 70 ? 'bg-brand-green' : (i >= 5 ? 'bg-brand-dark' : 'bg-orange-400')}`} 
                                                            style={{ width: `${s.score}%` }}
                                                        ></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Keywords Found */}
                                    <div>
                                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-brand-greenHover">
                                            <div className="p-1 bg-brand-green/10 rounded-md">
                                                <Check size={18} />
                                            </div>
                                            Keywords Found ({results.matched_keywords.length})
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {results.matched_keywords.map((kw, i) => (
                                                <span 
                                                    key={i} 
                                                    className="px-3 py-1.5 bg-gray-50 border border-brand-border rounded-lg text-sm font-medium text-gray-600 flex items-center gap-1.5 hover:border-brand-green/30 transition-colors"
                                                    title={`Matched as ${kw.match_type}`}
                                                >
                                                    <Check size={14} className={kw.match_type === 'exact' ? 'text-brand-green' : 'text-blue-400'} />
                                                    {kw.job_keyword}
                                                </span>
                                            ))}
                                            {results.matched_keywords.length === 0 && <p className="text-gray-400 text-sm italic">No matching keywords found...</p>}
                                        </div>
                                    </div>

                                    {/* Missing Keywords */}
                                    <div>
                                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-rose-500">
                                            <div className="p-1 bg-rose-50 rounded-md">
                                                <X size={18} />
                                            </div>
                                            Missing Keywords ({results.missing_keywords.length})
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {results.missing_keywords.map((kw, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-lg text-sm font-medium text-rose-600 flex items-center gap-1.5">
                                                    <X size={14} />
                                                    {kw.job_keyword}
                                                </span>
                                            ))}
                                            {results.missing_keywords.length === 0 && <p className="text-gray-400 text-sm italic">No missing keywords! You're fully optimized.</p>}
                                        </div>
                                    </div>
                                </div>

                                 {/* AI Suggestions & Highlighting */}
                                 <div className="mt-12 bg-white rounded-2xl border-2 border-brand-green/10 p-6">
                                     <h3 className="text-sm font-bold text-brand-dark uppercase tracking-widest mb-6 flex items-center gap-2">
                                         <Sparkles size={16} className="text-brand-green" />
                                         Recruiter Insights & Advice
                                     </h3>
                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                         <ul className="space-y-4">
                                             {results.resume_improvement_suggestions.map((s, i) => (
                                                 <li key={i} className={`flex items-start gap-3 text-sm leading-relaxed ${s.includes('Recruiters') || s.includes('numbers') ? 'text-brand-dark font-bold' : 'text-gray-600'}`}>
                                                     <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.includes('Recruiters') || s.includes('numbers') ? 'bg-brand-dark shadow-[0_0_5px_rgba(51,60,77,0.3)]' : 'bg-brand-green'}`}></div>
                                                     {s}
                                                 </li>
                                             ))}
                                             <li className="flex items-start gap-3 text-sm text-gray-500 italic mt-4 pt-4 border-t border-brand-green/10">
                                                 <Sparkles size={14} className="mt-0.5 shrink-0" />
                                                 {results.recruiter_insights.length_advice}
                                             </li>
                                         </ul>

                                         {/* Achievement Highlighter Feed */}
                                         <div className="bg-brand-bg/30 rounded-xl p-5 relative overflow-hidden flex flex-col">
                                             <h4 className="text-[10px] font-black text-brand-dark/30 uppercase tracking-[0.2em] mb-3">Achievement Visualizer</h4>
                                             <div className="bg-white border border-gray-100 rounded-lg p-4 text-[12px] leading-relaxed text-gray-400 h-48 overflow-y-auto shadow-inner font-mono scrollbar-thin">
                                                 {(() => {
                                                     let highlightedText = resume;
                                                     
                                                     // Highlight metrics (Green)
                                                     results.recruiter_insights.detected_metrics.forEach(m => {
                                                         const regex = new RegExp(`\\b${m}\\b`, 'gi');
                                                         highlightedText = highlightedText.replace(regex, `<em style="background: rgba(112,224,152,0.2); color: #3d8c5c; font-weight: 800; font-style: normal; padding: 0 2px; border-radius: 2px;">${m}</em>`);
                                                     });

                                                     // Highlight power verbs (Dark)
                                                     results.recruiter_insights.power_verbs_found.forEach(v => {
                                                         const regex = new RegExp(`\\b${v}\\b`, 'gi');
                                                         highlightedText = highlightedText.replace(regex, `<em style="background: #333c4d; color: white; font-weight: 800; font-style: normal; padding: 0 2px; border-radius: 2px;">${v}</em>`);
                                                     });

                                                     return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
                                                 })()}
                                             </div>
                                             <div className="flex gap-4 mt-3">
                                                 <div className="flex items-center gap-1.5 text-[9px] font-bold text-brand-greenHover uppercase tracking-tighter">
                                                     <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div> Impact Metrics
                                                 </div>
                                                 <div className="flex items-center gap-1.5 text-[9px] font-bold text-brand-dark/60 uppercase tracking-tighter">
                                                     <div className="w-1.5 h-1.5 rounded-full bg-brand-dark"></div> Power Verbs
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </div>

                                {/* Conversion Section */}
                                <div className="mt-16 pt-12 border-t border-brand-border text-center">
                                    {results.score_breakdown.raw_score >= 100 && results.missing_keywords.length === 0 ? (
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-brand-green/5 rounded-2xl p-8 border-2 border-brand-green/30 relative overflow-hidden"
                                        >
                                            <div className="absolute -top-10 -right-10 opacity-10">
                                                <Trophy size={160} />
                                            </div>
                                            <div className="absolute -bottom-10 -left-10 opacity-10">
                                                <PartyPopper size={160} />
                                            </div>

                                            <div className="relative z-10 text-center">
                                                <div className="inline-flex p-4 bg-white rounded-2xl shadow-float mb-6 text-brand-green">
                                                    <Trophy size={40} />
                                                </div>
                                                <p className="text-2xl md:text-3xl font-black text-brand-dark mb-3">
                                                    Perfect 100% Match Found! 🚀
                                                </p>
                                                <p className="text-gray-600 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                                                    Your resume is flawlessly optimized for this role. You are in the top 1% of candidates. Ready to build a professional design that matches this performance?
                                                </p>
                                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                                    <button 
                                                        onClick={() => window.location.href = 'https://CVArchitect.app/signup'}
                                                        className="px-10 py-5 bg-brand-dark text-white hover:bg-black rounded-full font-bold shadow-float transition-all flex items-center gap-2 group"
                                                    >
                                                        Build My Professional Resume
                                                        <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                                    </button>
                                                    <button 
                                                        onClick={() => window.location.href = 'https://CVArchitect.app'}
                                                        className="px-8 py-5 border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white rounded-full font-bold transition-all"
                                                    >
                                                        Visit CVArchitect App
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="bg-brand-bg rounded-2xl p-8 border border-brand-border">
                                            <div className="inline-flex p-3 bg-white rounded-xl shadow-soft mb-6">
                                                <Layout size={32} className="text-brand-green" />
                                            </div>
                                            <p className="text-xl font-bold text-brand-dark mb-2">
                                                Your resume is missing important keywords recruiters look for.
                                            </p>
                                            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                                                Don't manually edit for every job application. Tailor your resume automatically with CVArchitect's AI builder to hit 95%+ match scores instantly.
                                            </p>
                                            <button 
                                                onClick={() => window.location.href = 'https://CVArchitect.app'}
                                                className="px-8 py-4 bg-brand-green hover:bg-brand-greenHover text-brand-dark rounded-full font-bold shadow-soft transition-all flex items-center gap-2 mx-auto"
                                            >
                                                Tailor Your Resume with CVArchitect
                                                <Sparkles size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* High-Conversion SEO Sales Copy */}
                <section className="mt-32 pt-20 border-t border-brand-border">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">
                                Why Your Resume Needs a <span className="text-brand-greenHover">Match Check</span>
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                Most Fortune 500 companies and growing startups use Applicant Tracking Systems (ATS) to filter through thousands of applications. If your resume doesn't have the specific keywords the system is looking for, a human recruiter may never even see it.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-green/10 rounded-2xl w-fit text-brand-greenHover">
                                    <Target size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Beat the ATS Bots</h3>
                                <p className="text-gray-500 text-[15px] leading-relaxed">
                                    Our AI-powered scanner cross-references your resume against our proprietary library of over 3,500+ industry-specific terms. We identify the exact gaps that cause resumes to be rejected by automated filters.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-green/10 rounded-2xl w-fit text-brand-greenHover">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Optimize for 2026 Hiring</h3>
                                <p className="text-gray-500 text-[15px] leading-relaxed">
                                    Modern hiring has changed. Stop guessing which skills to prioritize. Our tool highlights exactly what's missing, from technical tools to functional keywords, giving you a clear roadmap to a 95%+ match score.
                                </p>
                            </div>
                        </div>

                        {/* How to Use Section */}
                        <div className="mb-24">
                            <h3 className="text-2xl font-black text-brand-dark mb-10 text-center">How to Optimize Your Resume for ATS</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { step: '01', title: 'Paste Job Post', desc: 'Copy the full job description from LinkedIn or Indeed.' },
                                    { step: '02', title: 'Upload Resume', desc: 'Paste your current resume text into the checker.' },
                                    { step: '03', title: 'Get Match Score', desc: 'Identify missing keywords and fix them instantly.' }
                                ].map((s, i) => (
                                    <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft relative overflow-hidden group hover:border-brand-green/30 transition-colors">
                                        <div className="text-4xl font-black text-brand-green/5 absolute -top-2 -right-2">{s.step}</div>
                                        <div className="font-bold text-brand-dark mb-2">{s.title}</div>
                                        <p className="text-gray-400 text-sm">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Extended FAQ Section for SEO */}
                        <div className="bg-white rounded-3xl border-2 border-brand-border p-8 md:p-12 mb-24">
                            <h3 className="text-2xl font-black text-brand-dark mb-8 text-center">Frequently Asked Questions</h3>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-brand-dark">How does the Resume Match Checker work?</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Our tool uses advanced natural language processing to extract keywords from a job description and compare them to your resume text. It checks for exact matches, synonyms, and variations across technical skills, soft skills, and industry tools.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-brand-dark">What is a good resume match score?</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Ideally, you should aim for a match score of 80% or higher. This indicates that you have the core competencies required for the role and are likely to pass most automated ATS filters.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-brand-dark">Is this resume checker free to use?</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Yes! CVArchitect offers this match checker as a free tool to help job seekers optimize their resumes. For even better results, you can use our AI Resume Builder to automatically tailor your content for every application.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2 text-brand-dark">Will using keywords guarantee an interview?</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        While keywords help you pass the initial ATS screening, the quality of your content still matters to human recruiters. Ensure your bullet points are achievement-oriented and clearly demonstrate the impact of your skills.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Final Bottom CTA */}
                        <div className="text-center bg-brand-dark rounded-[40px] p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
                                    Tired of Manually <br className="hidden md:block" /> Optimizing Every Resume?
                                </h3>
                                <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                                    Join 10,000+ professionals using CVArchitect to build ATS-optimized resumes that land interview callbacks 3x faster.
                                </p>
                                <button 
                                    onClick={() => window.location.href = 'https://CVArchitect.app/signup'}
                                    className="px-12 py-5 bg-brand-green hover:bg-brand-greenHover text-brand-dark rounded-full font-black text-lg shadow-[0_20px_40px_rgba(112,224,152,0.3)] transition-all hover:scale-105"
                                >
                                    Increase My Match Score Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
