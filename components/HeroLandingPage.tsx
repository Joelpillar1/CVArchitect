import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Target, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function HeroLandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-brand-green selection:text-brand-dark overflow-x-hidden font-sans">
      <SEO 
        title="AI Resume Optimization & Job Matching System | CV Architect"
        description="Create an ATS-proof resume with CV Architect AI. Instant job description matching, precision rewriting, and modern designer templates."
        canonicalPath="/landingpage"
      />
      
      <PublicHeader />

      {/* Hero Section */}
      <main className="flex-1 relative pt-20 pb-20 md:pt-28 md:pb-28 flex items-center justify-center bg-white">
        {/* Crisp Light Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Main Hero Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-8"
            >
              Design and Implementation of an{' '}
              <span className="text-brand-blue font-black">
                AI-Powered Resume Optimization
              </span>{' '}
              and Job Matching System
            </motion.h1>

            {/* Clear, Action-Oriented Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
            >
              Automatically optimize your resume to pass ATS scanners, align your skills with job postings, and land more interviews with intelligent AI assistance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={handleCTA}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 text-base cursor-pointer"
              >
                <span>{user ? 'Go to Dashboard' : 'Build Your Resume Free'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/resume-checker')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-300 hover:border-slate-400 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Check Job Match Score</span>
              </button>
            </motion.div>

            {/* Feature Highlights Grid */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
            >
              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md hover:border-emerald-400 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">Smart Rewriter</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enhance bullet points with action verbs and measurable metrics in one click.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md hover:border-emerald-400 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">ATS Matcher</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Compare your resume against any job posting to fill key skill gaps.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md hover:border-emerald-400 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">30+ Templates</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Professional, ATS-formatted resume layouts designed for recruiters.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md hover:border-emerald-400 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-1">Cover Letters</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Generate tailored application letters matched directly to your experience.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
