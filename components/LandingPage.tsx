import React, { useState } from 'react';
import { ArrowRight, Check, Star, X, Menu, FileText, Sparkles, Download, NotebookPen, LayoutTemplate, Zap, Shield, MousePointer2, User } from 'lucide-react';
import { View } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToContact?: () => void;
}

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

const float = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function LandingPage({ onGetStarted, onSignIn, onNavigateToPrivacy, onNavigateToTerms, onNavigateToContact }: LandingPageProps) {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-green-200 overflow-x-hidden">

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo icon.png" alt="CV Architect Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-brand-dark">CV Architect</span>
          </div>

          {/* Centered Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {['Features', 'The Difference', 'Pricing'].map((item, idx) => (
              <button
                key={idx}
                onClick={() => document.getElementById(item.toLowerCase().replace(' ', '-'))?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors relative group"
              >
                {item}
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
                  onClick={onGetStarted}
                  className="bg-brand-green hover:opacity-90 text-brand-dark px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm relative overflow-hidden group"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                </motion.button>
              </>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="text-sm font-medium text-brand-dark hover:text-brand-green transition-colors"
                >
                  Sign in
                </button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
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
                {['Features', 'The Difference', 'Pricing'].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      document.getElementById(item.toLowerCase().replace(' ', '-'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium text-gray-800 hover:text-brand-green text-left py-2 border-b border-gray-50 last:border-0"
                  >
                    {item}
                  </button>
                ))}

                <div className="pt-4 flex flex-col gap-4">
                  {user ? (
                    <button
                      onClick={onGetStarted}
                      className="w-full bg-brand-green text-brand-dark py-3 rounded-lg font-bold shadow-sm"
                    >
                      Go to Dashboard
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={onSignIn}
                        className="w-full border border-gray-200 text-brand-dark py-3 rounded-lg font-medium hover:bg-gray-50"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={onGetStarted}
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

      {/* Hero Section */}
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto"
      >
        {/* Hero Image */}
        <motion.div
          variants={fadeInUp}
          className="mx-auto mb-12 w-full max-w-4xl"
        >
          <div>
            {/* Mobile Image */}
            <img
              src="/images/Illustration Mobile.png"
              alt="Resume rejection chaos"
              className="w-full h-auto object-contain mx-auto md:hidden"
            />
            {/* Desktop Image */}
            <img
              src="/images/Illustration Desktop.png"
              alt="Resume rejection chaos"
              className="w-full h-auto object-contain mx-auto hidden md:block drop-shadow-2xl"
            />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-[52px] font-extrabold tracking-tight mb-8 leading-tight text-brand-dark max-w-5xl mx-auto"
          style={{ fontFamily: 'Graphik, sans-serif' }}
        >
          <span className="block mb-2">Getting <span className="text-brand-green inline-block relative">
            "Unfortunate"
            <svg className="absolute w-full h-2 bottom-0 left-0 text-brand-green/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span> Message?</span>
          <span className="block">Your Next Resume Should <span className="text-brand-green">Hit Different.</span></span>
        </motion.h1>

        <motion.div variants={fadeInUp}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.95 }}
            onClick={user ? onGetStarted : onGetStarted}
            className="bg-brand-green hover:opacity-90 text-brand-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">{user ? 'Go to Dashboard' : 'Build My Resume'}</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Section 2: Editor Preview & Value Prop */}
      <section id="features" className="py-16 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Top Image: Editor UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-12 relative"
          >
            <div className="relative group perspective-1000">
              <img
                src="/images/new section 2.png"
                alt="CV Architect Editor Interface"
                loading="lazy"
                className="w-full h-auto rounded-lg shadow-2xl border border-gray-100 transform transition-transform duration-700 hover:scale-[1.01]"
              />
              {/* Optional: Glossy reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg"></div>
            </div>

            {/* Green Banner Overlay */}
            <motion.div
              initial={{ x: -50, opacity: 0, rotate: 0 }}
              whileInView={{ x: "-50%", opacity: 1, rotate: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -bottom-6 left-1/2 w-[110%] md:w-3/4 bg-brand-green py-4 px-8 shadow-lg flex items-center justify-center z-10"
            >
              <p className="text-brand-dark font-bold text-lg md:text-xl text-center">
                Click Build My Resume To See How CV Architect Is Different
              </p>
            </motion.div>
          </motion.div>

          {/* Bottom Content: Text + Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-left space-y-6"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-brand-dark leading-tight" style={{ fontFamily: 'Graphik, sans-serif' }}>
                <span className="block">You're Not Getting</span>
                <span className="block">Rejected. Your</span>
                <span className="block">Resume Is.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 font-medium leading-relaxed">
                Most people lose opportunities not because they're unqualified, but because their resumes never reach a human.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-gray-500 leading-relaxed">
                We built an ATS-ready resume builder that maps your skills and achievements into a format recruiters actually see and remember.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="/images/Section 2 illustration 2.png"
                alt="Pile of resumes"
                loading="lazy"
                className="w-full h-auto object-contain transform md:translate-x-12"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: The Problem */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 md:order-1"
          >
            <img
              src="/images/Section 3 illustration.png"
              alt="Resumes rejected by ATS"
              loading="lazy"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative order-1 md:order-2"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-[44px] font-extrabold text-brand-dark leading-tight mb-6" style={{ fontFamily: 'Graphik, sans-serif' }}>
              <span className="block">You've Done The Work</span>
              <span className="block">But Your Resume</span>
              <span className="block">Never Gets Seen.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 font-medium mb-4 leading-relaxed">
              You spend hours perfecting your resume. You hit 'Apply'. Silence.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-lg text-gray-500 mb-10 leading-relaxed max-w-md">
              75% of resumes are rejected by ATS filters before a recruiter ever looks
            </motion.p>

            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="bg-brand-green hover:opacity-90 text-brand-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Build My Resume</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* The Difference Section */}
      <section id="difference" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-left mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand-dark" style={{ fontFamily: 'Graphik, sans-serif' }}>
              The Difference
            </h2>
            <p className="text-xl text-gray-500">
              See what separates rejected resumes from interview-winners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Column 1: Your Old Resume */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              {/* Image Container */}
              <div className="relative bg-brand-dark p-4 pb-0 rounded-t-lg shadow-2xl mb-8 group">
                <img
                  src="/images/Section 4 illustration - Your Old Resume.png"
                  alt="Old Resume Example"
                  loading="lazy"
                  className="w-full h-auto rounded-t-sm opacity-90 transition-opacity group-hover:opacity-60"
                />
                {/* X overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="text-red-500 w-32 h-32" strokeWidth={4} />
                </div>

                {/* Banner */}
                <div className="absolute -bottom-5 -left-4 bg-brand-green py-3 px-8 transform -rotate-2 shadow-lg z-10">
                  <span className="text-brand-dark font-bold text-lg">Your Old Resume</span>
                </div>
              </div>

              {/* Text Content */}
              <div className="mt-8 space-y-8 px-2">
                <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true }}>
                  <h4 className="text-red-500 font-bold text-xl mb-4">Formatting Issues</h4>
                  <ul className="space-y-3">
                    {[
                      "Messy Formatting Confuses ATS Systems",
                      "Poor Structure Hides Your Best Achievements"
                    ].map((text, i) => (
                      <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3 text-brand-dark font-medium text-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2.5 shrink-0" />
                        {text}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true }}>
                  <h4 className="text-red-500 font-bold text-xl mb-4">Content Problems</h4>
                  <ul className="space-y-3">
                    {[
                      "Missing Keywords Recruiters Search For",
                      "Generic Language That Doesn't Stand Out"
                    ].map((text, i) => (
                      <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3 text-brand-dark font-medium text-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2.5 shrink-0" />
                        {text}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>

            {/* Column 2: ATS Optimized */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              {/* Image Container */}
              <div className="relative bg-brand-dark p-4 pb-0 rounded-t-lg shadow-2xl mb-8 hover:transform hover:-translate-y-2 transition-transform duration-300">
                <img
                  src="/images/Section 4 illustration - ATS Optimized.png"
                  alt="ATS Optimized Resume Example"
                  loading="lazy"
                  className="w-full h-auto rounded-t-sm"
                />

                {/* Top Right Banner */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-4 -right-4 bg-brand-green py-2 px-6 transform rotate-2 shadow-lg z-10"
                >
                  <span className="text-brand-dark font-bold">98% Pass Rate</span>
                </motion.div>
                {/* Bottom Left Banner */}
                <div className="absolute -bottom-5 -left-4 bg-brand-green py-3 px-8 transform -rotate-2 shadow-lg z-10">
                  <span className="text-brand-dark font-bold text-lg">ATS-Optimized</span>
                </div>
              </div>

              {/* Text Content */}
              <div className="mt-8 space-y-8 px-2">
                <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true }}>
                  <h4 className="text-brand-green font-bold text-xl mb-4">Formatting Excellence</h4>
                  <ul className="space-y-3">
                    {[
                      "Clean Format ATS Can Read Perfectly",
                      "Strategic Layout Highlights Your Wins"
                    ].map((text, i) => (
                      <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3 text-brand-dark font-medium text-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2.5 shrink-0" />
                        {text}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true }}>
                  <h4 className="text-brand-green font-bold text-xl mb-4">Content Optimization</h4>
                  <ul className="space-y-3">
                    {[
                      "Keyword-Rich Content That Gets Found",
                      "Compelling Copy That Demands Attention"
                    ].map((text, i) => (
                      <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3 text-brand-dark font-medium text-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2.5 shrink-0" />
                        {text}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5: How It Works */}
      <section id="how-it-works" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-3xl"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand-dark leading-tight" style={{ fontFamily: 'Graphik, sans-serif' }}>
                <span className="block">Here's How We Make Your</span>
                <span className="block">Resume Unstoppable.</span>
              </h2>
              <p className="text-xl text-gray-500">
                Three simple steps between you and your next opportunity.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="bg-brand-green hover:opacity-90 text-brand-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all hidden md:block relative overflow-hidden group"
            >
              <span className="relative z-10">Build My Resume</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </motion.button>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: FileText,
                title: "Insert Your Details",
                desc: "Simple guided requirement about your experience and skills. No technical jargon.",
                step: "Step One",
                rotate: "-2"
              },
              {
                icon: Sparkles,
                title: "Paste Job Description",
                desc: "Clean formatting, real keywords, perfect structure. Built to pass automated filters.",
                step: "Step Two",
                rotate: "2"
              },
              {
                icon: Download,
                title: "Download & Apply",
                desc: "Get a resume that actually gets read. Ready in minutes, not hours. ATS-Optimized.",
                step: "Step Three",
                rotate: "2"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className={`relative bg-white border border-gray-200 p-10 pt-16 rounded-sm shadow-sm hover:shadow-xl transition-all ${idx === 1 ? 'mt-8 md:mt-0' : ''}`}
              >
                {/* Step Badge - Position alternates or manual */}
                <div className={`absolute ${idx === 1 ? '-top-5' : '-bottom-5'} left-1/2 transform -translate-x-1/2 bg-brand-green py-2 px-8 ${idx === 1 ? 'rotate-2' : '-rotate-2'} shadow-md z-10`}>
                  <span className="text-brand-dark font-bold text-lg">{item.step}</span>
                </div>

                <div className="w-16 h-16 border border-gray-300 rounded-sm flex items-center justify-center mb-8 text-gray-600">
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4" style={{ fontFamily: 'Graphik, sans-serif' }}>{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 6: Here's What We're Giving You */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand-dark" style={{ fontFamily: 'Graphik, sans-serif' }}>
              Here's What We're Giving You
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl">
              Clarity creates opportunity. Every line, every word, rewritten to speak the language hiring systems understand.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Feature Lists */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-12"
            >
              {/* Design Excellence */}
              <motion.div variants={fadeInUp}>
                <motion.div whileHover={{ skewX: 0 }} className="bg-brand-green py-3 px-8 transform -skew-x-12 inline-block mb-6 shadow-sm cursor-default">
                  <h3 className="text-brand-dark font-bold text-xl transform skew-x-12">Design Excellence</h3>
                </motion.div>
                <ul className="space-y-4">
                  {[
                    "Clean, Single-Font Layout With Clear Hierarchy",
                    "ATS-Friendly Formatting (No Graphics Or Complex Tables)",
                    "Logical Section Order That ATS Systems Expect"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2.5 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Content Optimization */}
              <motion.div variants={fadeInUp}>
                <motion.div whileHover={{ skewX: 0 }} className="bg-brand-green py-3 px-8 transform -skew-x-12 inline-block mb-6 shadow-sm cursor-default">
                  <h3 className="text-brand-dark font-bold text-xl transform skew-x-12">Content Optimization</h3>
                </motion.div>
                <ul className="space-y-4">
                  {[
                    "Keyword-Rich Content Matching Job Descriptions",
                    "Quantified Achievements With Impact Metrics"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2.5 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Right: Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
              <img
                src="/images/Section 6 illustration.png"
                alt="Success outcomes illustration"
                loading="lazy"
                className="w-full h-auto object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-brand-dark leading-tight" style={{ fontFamily: 'Graphik, sans-serif' }}>
                A Month From Now, You Could Be <span className="text-brand-green">Starting A New Job</span> — Or Still Wondering Why <span className="text-brand-green">You Never Hear Back.</span>
              </motion.h2>

              <motion.div variants={fadeInUp} className="relative inline-block">
                <div className="bg-brand-green py-3 px-8 transform -skew-x-6 inline-block shadow-md">
                  <p className="text-brand-dark font-bold text-xl transform skew-x-6">
                    The Only Difference?<br />
                    The Resume You Build Today.
                  </p>
                </div>
              </motion.div>

              <motion.button
                variants={fadeInUp}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="bg-brand-green hover:opacity-90 text-brand-dark px-12 py-5 rounded-full font-bold text-xl shadow-2xl transition-all mt-8 relative overflow-hidden group"
              >
                <span className="relative z-10">Build My Resume</span>
                <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </motion.button>
            </motion.div>

            {/* Right: Resume Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="/images/Section  7  illustration.png"
                alt="Resume preview with 98% pass rate"
                loading="lazy"
                className="w-full h-auto object-contain rounded-lg shadow-2xl"
              />
              {/* 98% Pass Rate Badge */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute -top-4 -right-4 bg-brand-green py-3 px-8 shadow-lg z-10 rounded-full w-24 h-24 flex items-center justify-center"
              >
                <span className="text-brand-dark font-bold text-lg text-center leading-tight">98%<br />Pass Rate</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 8: Testimonials */}
      <section className="py-16 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Decorative Profile Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative mb-16"
          >
            <img
              src="/images/Section 8 illustration.png"
              alt="User testimonials"
              loading="lazy"
              className="w-full max-w-3xl mx-auto h-auto object-contain"
            />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-brand-dark" style={{ fontFamily: 'Graphik, sans-serif' }}
          >
            Built On <span className="text-brand-green">Results</span>, Not Promises.
          </motion.h2>

          {/* Testimonial Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                name: "Sarah Mitchell", role: "Marketing Manager", initials: "SM",
                quote: "I applied to 15 jobs with my old resume—zero responses. Used CV Architect, tailored it for each role, and got 3 interviews in the first week. The ATS optimization actually works."
              },
              {
                name: "James Chen", role: "Software Engineer", initials: "JC",
                quote: "The AI rewrite feature saved me hours. It took my generic bullet points and turned them into achievement-focused statements that actually got me past the screening stage."
              },
              {
                name: "Priya Reddy", role: "Product Designer", initials: "PR",
                quote: "Finally, a resume builder that doesn't look like everyone else's. The templates are clean, professional, and actually parse correctly through ATS systems. Worth every penny."
              },
              {
                name: "Marcus Johnson", role: "Sales Director", initials: "MJ",
                quote: "Landed my dream job 2 months after using this. The job match feature showed me exactly what keywords to include. No more guessing—just results."
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-brand-dark rounded-2xl p-6 text-white shadow-lg border border-gray-700 hover:border-brand-green transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center text-brand-dark font-bold text-lg">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "{t.quote}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand-dark" style={{ fontFamily: 'Graphik, sans-serif' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-500">
              Choose the plan that fits your career goals
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {/* Free Plan */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-600">Free Guest</h3>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-brand-dark">$0</span>
                <span className="text-gray-500 text-base">/forever</span>
              </div>
              <p className="text-xs text-gray-400 mb-6 min-h-[1.25rem]"></p>

              <ul className="space-y-3 text-left text-gray-600 mb-8 flex-1">
                {[
                  "3 Trial AI Credits",
                  "Clean PDF (No Watermark)",
                  "1 Basic Template",
                  "1 Job Match Analysis"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-gray-400 mt-1 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-brand-dark hover:bg-gray-200 transition-colors text-sm relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 h-full w-full bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </motion.button>
            </motion.div>

            {/* Week Pass Plan */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-600">Week Pass</h3>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-brand-dark">$9</span>
                <span className="text-gray-500 text-base">/7 days</span>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-medium">One-time payment</p>

              <ul className="space-y-3 text-left text-gray-600 mb-8 flex-1">
                {[
                  "Unlimited AI (Cap: 75)",
                  "10 AI Cover Letters",
                  "All Premium Templates",
                  "Clean PDF Exports"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-gray-400 mt-1 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-brand-dark hover:bg-gray-200 transition-colors text-sm relative overflow-hidden group"
              >
                <span className="relative z-10">Get Week Pass</span>
                <div className="absolute inset-0 h-full w-full bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </motion.button>
            </motion.div>

            {/* Pro Plan - Featured */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-xl border-2 border-brand-green flex flex-col relative transform md:scale-105"
            >
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green py-1.5 px-4 rounded-full shadow-lg z-10">
                <span className="text-brand-dark font-bold text-xs">MOST POPULAR</span>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-600 mt-2">Pro Quarterly</h3>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-brand-dark">$9.60</span>
                <span className="text-gray-500 text-base">/month</span>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-medium">Billed $29 every 3 months</p>

              <ul className="space-y-3 text-left text-gray-600 mb-8 flex-1">
                {[
                  "Unlimited AI (Cap: 300/mo)",
                  "50 AI Cover Letters/mo",
                  "All Premium Templates",
                  "Priority Processing",
                  "Clean PDF Exports"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-brand-green mt-1 shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl font-semibold bg-brand-green text-brand-dark hover:opacity-90 transition-colors shadow-lg text-sm relative overflow-hidden group"
              >
                <span className="relative z-10">Start Pro</span>
                <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </motion.button>
            </motion.div>

            {/* Lifetime Plan */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-600">Lifetime</h3>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-brand-dark">$69</span>
                <span className="text-gray-500 text-base block mt-1">one-time</span>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-medium">Pay once, use forever</p>

              <ul className="space-y-3 text-left text-gray-600 mb-8 flex-1">
                {[
                  "All Pro Features",
                  "Unlimited AI (Cap: 100/mo)",
                  "50 AI Cover Letters/mo",
                  "Future Updates Included"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-gray-400 mt-1 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-brand-dark hover:bg-gray-200 transition-colors text-sm relative overflow-hidden group"
              >
                <span className="relative z-10">Get Lifetime Access</span>
                <div className="absolute inset-0 h-full w-full bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 leading-tight" style={{ fontFamily: 'Graphik, sans-serif' }}>
                The Answer Is{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">YES!</span>
                  <div className="absolute inset-0 bg-brand-green transform -skew-x-12 -rotate-2"></div>
                </span>
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed">
                Can my resume be clean, simple, and optimized, yet still feel powerful?
              </p>
              <p className="text-xl text-gray-500 leading-relaxed mt-2">
                With CV Architect, the answer is always YES.
              </p>
            </motion.div>

            {/* Right: Questions */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {[
                "Can I Prevent My Resume From Being Rejected By ATS?",
                "Can I Link Up Notes From Google Docs Or Notion?",
                "Can I See My Entire Resume On A Single Screen?",
                "Can I Create Unlimited Versions For Different Jobs?"
              ].map((q, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="flex items-start gap-3">
                  <div className="bg-brand-dark rounded-full p-1 mt-1 shrink-0">
                    <Check size={14} className="text-brand-green" />
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-700 text-lg font-medium">{q}</span>
                    <div className="bg-brand-green py-0.5 px-3 transform -skew-x-6 inline-block rounded-sm">
                      <span className="text-brand-dark font-bold text-xs transform skew-x-6 inline-block">YES!</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/images/logo icon.png" alt="CV Architect Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-brand-dark">CV Architect</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CV Architect. All rights reserved.
          </div>
          <div className="flex gap-6">
            <button onClick={onNavigateToPrivacy} className="text-gray-500 hover:text-brand-dark text-sm">Privacy Policy</button>
            <button onClick={onNavigateToTerms} className="text-gray-500 hover:text-brand-dark text-sm">Terms of Service</button>
            <button onClick={onNavigateToContact} className="text-gray-500 hover:text-brand-dark text-sm">Contact</button>
          </div>
        </div>
      </footer>

    </div>
  );
}