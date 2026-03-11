import React, { useState } from 'react';
import { ArrowRight, Check, Star, X, Menu, FileText, Sparkles, Download, NotebookPen, LayoutTemplate, Zap, Shield, MousePointer2, User, MessageCircle, Repeat2, Heart, Share, BadgeCheck, BarChart2, Bookmark, Upload, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';
import PublicFooter from './PublicFooter';

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

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pricingFeatures = [
    "Unlimited resume uploads & analyses",
    "Unlimited AI rewrites & bullet optimizations",
    "Unlimited Job Match reports",
    "Unlimited cover letter generation",
    "Access to every premium template",
    "Up to 10-page resumes",
    "Priority processing & unlimited versions",
  ];

  // Navigation handlers
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };


  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-green-200 overflow-x-hidden">
      <SEO
        title="CV Architect — AI Resume Builder | Beat ATS & Land Interviews 3x Faster"
        description="Stop getting rejected by ATS robots. CV Architect uses advanced AI to rewrite your resume, optimize for ATS scanners, and help you land interviews 3x faster. Professional resume templates, AI cover letters, and job match scoring."
        canonicalPath="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Can CV Architect prevent my resume from being rejected by ATS?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! CV Architect uses AI to optimize your resume format, keywords, and structure specifically for Applicant Tracking Systems. Our resumes have a 98% ATS pass rate."
                }
              },
              {
                "@type": "Question",
                "name": "How much does CV Architect cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "CV Architect offers a 7-day Career Sprint for $9 (one-time payment) and a monthly Career Marathon plan for $19/month. There's also a guest tier with basic features and 10 AI credits."
                }
              },
              {
                "@type": "Question",
                "name": "Can I create unlimited resume versions for different jobs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! With a paid plan, you can create unlimited versions of your resume, each tailored to different job descriptions using our AI-powered Job Match feature."
                }
              },
              {
                "@type": "Question",
                "name": "Does CV Architect offer a resume builder?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! CV Architect offers guest access with 1 resume project, access to basic templates, and 10 complimentary AI credits to test the builder before committing to a paid plan."
                }
              }
            ]
          }
        ]}
      />

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
            {[
              { label: 'Features', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
              { label: 'The Difference', action: () => document.getElementById('the-difference')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
              { label: 'Pricing', action: () => navigate('/pricing') },
              { label: 'Blog', action: () => navigate('/blog') }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
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
                  { label: 'Features', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
                  { label: 'The Difference', action: () => document.getElementById('the-difference')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
                  { label: 'Pricing', action: () => navigate('/pricing') },
                  { label: 'Blog', action: () => navigate('/blog') }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      item.action();
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

      {/* Hero Section */}
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="relative pt-32 pb-10 px-6 text-center max-w-7xl mx-auto flex flex-col items-center overflow-visible"
      >
        {/* Background Mesh Glows */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-[120px] pointer-events-none"></div>



        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-[52px] font-extrabold tracking-tight mb-6 leading-tight text-brand-dark max-w-4xl mx-auto"
          style={{ fontFamily: 'Graphik, sans-serif' }}
        >
          <span className="block mb-2">Turn any job description into a</span>
          <span className="block"><span className="text-brand-green">
            tailored resume
          </span> in seconds</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-xl text-gray-600 font-medium mb-6 max-w-2xl mx-auto leading-relaxed"
        >
          Upload your resume. Paste the job description. CVArchitect optimizes your resume automatically.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-brand-green hover:opacity-90 text-brand-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all relative overflow-hidden group mb-6"
          >
            <span className="relative z-10">{user ? 'Go to Dashboard' : 'Try it for free'}</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </motion.button>

          {/* Trust Marker */}
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-green flex items-center justify-center text-[10px] font-bold text-brand-dark">
                +1k
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-brand-green text-brand-green" />
                ))}
              </div>
              <p className="text-xs font-medium">Join 1,000+ job seekers</p>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Section 2: Editor Preview & Value Prop */}
      <section id="features" className="pt-0 pb-16 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Top: Interactive Editor Demo (YouTube video) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-12 relative"
          >
            {/* Video embed - visible on all devices */}
            <div className="relative w-full max-w-5xl mx-auto aspect-video overflow-hidden rounded-xl bg-black border-2 md:border-4 border-brand-dark">
              <iframe
                src="https://www.youtube.com/embed/5ul_UqO1T7g"
                loading="lazy"
                title="CV Architect Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                frameBorder="0"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            </div>



          </motion.div>

          {/* Social Proof Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mt-20 mb-12"
          >
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Featured on & Loved by</p>
            <div className="flex flex-row flex-wrap justify-center items-center gap-6 md:gap-8 opacity-90 hover:opacity-100 transition-opacity duration-300">
              <a href="https://www.producthunt.com/products/cv-architect/launches/cv-architect?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-cv-architect" target="_blank" rel="noopener noreferrer" className="transition-transform hover:-translate-y-1 duration-300">
                <img alt="Product Hunt" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1077802&theme=neutral&t=1773159577905" className="h-[46px] w-auto drop-shadow-sm transition-all duration-300" />
              </a>

              <a href="https://vcodinglist.com/products/cv-architect" target="_blank" rel="noopener" className="transition-transform hover:-translate-y-1 duration-300">
                <img src="https://vcodinglist.com/badges/featured-light.svg" alt="Featured on VcodingList" className="h-[46px] w-auto drop-shadow-sm transition-all duration-300" />
              </a>
            </div>
          </motion.div>

          {/* Bottom Content: Text + Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
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
                alt="Stack of resumes rejected by ATS - CV Architect solves this"
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
              alt="75 percent of resumes rejected by ATS systems before human review"
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
            <motion.p variants={fadeInUp} className="text-lg text-gray-500 mb-6 leading-relaxed max-w-md">
              75% of resumes are rejected by ATS filters before a recruiter ever looks
            </motion.p>

            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-brand-green hover:opacity-90 text-brand-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Try it for free</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* The Difference Section */}
      <section id="the-difference" className="py-16 px-6 bg-white">
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
                  alt="Example of a poorly formatted resume that fails ATS screening"
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
                  alt="ATS-optimized resume created with CV Architect AI builder"
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
              onClick={handleGetStarted}
              className="bg-brand-green hover:opacity-90 text-brand-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all hidden md:block relative overflow-hidden group"
            >
              <span className="relative z-10">Try it for free</span>
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
                title: "Upload Your Resume",
                desc: "Simplely upload your existing resume to proceed or start from scratch. No technical jargon.",
                step: "Step 1",
                rotate: "-2"
              },
              {
                icon: Sparkles,
                title: "Paste Job Description",
                desc: "Clean formatting, real keywords, perfect structure. Built to pass automated filters.",
                step: "Step 2",
                rotate: "2"
              },
              {
                icon: Download,
                title: "Download & Apply",
                desc: "Get a resume that actually gets read. Ready in minutes, not hours. ATS-Optimized.",
                step: "Step 3",
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
                alt="Job seekers landing interviews with ATS-optimized resumes"
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
                onClick={handleGetStarted}
                className="bg-brand-green hover:opacity-90 text-brand-dark px-12 py-5 rounded-full font-bold text-xl shadow-2xl transition-all mt-4 relative overflow-hidden group"
              >
                <span className="relative z-10">Try it for free</span>
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
                alt="CV Architect resume passing ATS with 98 percent compatibility score"
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
              alt="CV Architect user testimonials and reviews"
              loading="lazy"
              className="w-full max-w-3xl mx-auto h-auto object-contain"
            />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-brand-dark px-6" style={{ fontFamily: 'Graphik, sans-serif' }}
          >
            Built On <span className="text-brand-green">Results</span>, Not Promises.
          </motion.h2>

          {/* Testimonial Cards - Infinite Scrolling Marquee */}
          <div className="flex flex-col gap-6 relative w-full overflow-hidden">
            <style>{`
              @keyframes customMarquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              @keyframes customMarqueeReverse {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0%); }
              }
              .animate-marquee-left {
                animation: customMarquee 50s linear infinite;
              }
              .animate-marquee-right {
                animation: customMarqueeReverse 50s linear infinite;
              }
            `}</style>
            {/* Top Row Marquee */}
            <div className="flex w-full group">
              <div className="flex animate-marquee-left group-hover:[animation-play-state:paused] min-w-max pb-2">
                {[...Array(6)].map((_, arrayIndex) => (
                  <React.Fragment key={arrayIndex}>
                    {[
                      {
                        name: "Sarah Mitchell",
                        handle: "sarah_m_tech",
                        date: "12m",
                        avatar: "/images/testimonials/sarah-mitchell.jpg",
                        quote: "I applied to 15 roles with my old resume, zero responses.\n\nAfter rebuilding with CV Architect and tailoring for each posting, I booked 3 interviews in the first week and accepted an offer in 10 days.",
                        views: "1.2K", replies: "3", retweets: "5", likes: "48", verified: true, theme: "light"
                      },
                      {
                        name: "Michael Torres",
                        handle: "mike_torres_dev",
                        date: "2h",
                        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                        quote: "The Job Matching Feature on CVArchitect is literally a cheat code.\n\nI pasted my dream job's description against my standard resume and hit a 96% match score. Got an interview request in under 48 hours.",
                        views: "2.8K", replies: "7", retweets: "12", likes: "156", verified: false, theme: "light"
                      },
                      {
                        name: "Priya Reddy",
                        handle: "priyareddy_ux",
                        date: "6h",
                        avatar: "/images/testimonials/priya-reddy.jpg",
                        quote: "Every other builder made my resume look like a template.\n\nCV Architect gave me a layout that feels premium and still parses perfectly through ATS.\n\nMy Dribbble portfolio gets more clicks now.",
                        views: "840", replies: "0", retweets: "2", likes: "32", verified: true, theme: "light"
                      },
                      {
                        name: "Elena García",
                        handle: "elena_hrbp",
                        date: "10h",
                        avatar: "/images/testimonials/elena-garcia.jpg",
                        quote: "As someone who reads resumes all day, I can tell when a candidate used CV Architect.\n\nThe structure is clean, the bullets are outcome-driven, and the key details are impossible to miss.",
                        views: "620", replies: "4", retweets: "8", likes: "41", verified: false, theme: "light"
                      }
                    ].map((t, idx) => (
                      <div key={`top-${arrayIndex}-${idx}`} className={`rounded-2xl p-4 pb-3 border shadow-sm mx-3 min-w-[350px] max-w-[400px] whitespace-normal flex flex-col items-start text-left cursor-default transition-colors ${t.theme === 'dark' ? 'bg-black border-zinc-800 hover:bg-zinc-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <div className="flex gap-3 w-full">
                          <img src={t.avatar} alt={t.name} loading="lazy" className="w-10 h-10 rounded-full object-cover shrink-0" />
                          <div className="flex flex-col flex-1 w-full">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-1 text-[15px]">
                                <span className={`font-bold ${t.theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>{t.name}</span>
                                {t.verified && <BadgeCheck size={16} className="text-blue-500" fill="currentColor" stroke={t.theme === 'dark' ? 'black' : 'white'} />}
                                <span className="text-gray-500">@{t.handle}</span>
                                <span className="text-gray-500">·</span>
                                <span className="text-gray-500 hover:underline cursor-pointer">{t.date}</span>
                              </div>
                              <MoreHorizontal size={18} className="text-gray-500 cursor-pointer" />
                            </div>
                            <div className={`text-[15px] mt-0.5 leading-snug whitespace-pre-wrap ${t.theme === 'dark' ? 'text-zinc-100' : 'text-gray-800'}`}>
                              {t.quote}
                            </div>
                            <div className="flex items-center justify-between mt-3 text-gray-500 w-full pr-2">
                              <div className="flex gap-1.5 items-center hover:text-blue-500 transition-colors cursor-pointer"><MessageCircle size={18} /><span>{t.replies}</span></div>
                              <div className="flex gap-1.5 items-center hover:text-green-500 transition-colors cursor-pointer"><Repeat2 size={18} /><span>{t.retweets}</span></div>
                              <div className="flex gap-1.5 items-center hover:text-red-500 transition-colors cursor-pointer"><Heart size={18} /><span>{t.likes}</span></div>
                              <div className="flex gap-1.5 items-center hover:text-blue-500 transition-colors cursor-pointer"><BarChart2 size={18} /><span>{t.views}</span></div>
                              <div className="flex gap-3 items-center">
                                <div className="hover:text-blue-500 transition-colors cursor-pointer"><Bookmark size={18} /></div>
                                <div className="hover:text-blue-500 transition-colors cursor-pointer"><Upload size={18} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Bottom Row Marquee */}
            <div className="flex w-full group">
              <div className="flex animate-marquee-right group-hover:[animation-play-state:paused] min-w-max pb-2">
                {[...Array(6)].map((_, arrayIndex) => (
                  <React.Fragment key={arrayIndex}>
                    {[
                      {
                        name: "James Chen",
                        handle: "jchen_codes",
                        date: "31m",
                        avatar: "/images/testimonials/james-chen.jpg",
                        quote: "The AI rewrite feature turned vague bullets into concrete impact.\n\nMy resume finally read like the work I actually do.\n\nRecruiters started commenting on specific projects instead of sending generic rejections.",
                        views: "3.4K", replies: "9", retweets: "21", likes: "189", verified: true, theme: "light"
                      },
                      {
                        name: "Marcus Johnson",
                        handle: "marcus_sales",
                        date: "3h",
                        avatar: "/images/testimonials/marcus-johnson.jpg",
                        quote: "The Job Match score took the guesswork out of tailoring.\n\nI went from sending out 40 generic resumes a month to 8 targeted applications with 5 turning into pipeline conversations.",
                        views: "1.5K", replies: "5", retweets: "15", likes: "76", verified: false, theme: "light"
                      },
                      {
                        name: "Aisha Patel",
                        handle: "aishadesigns",
                        date: "7h",
                        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                        quote: "I used to spend hours tweaking my resume for every single application.\n\nWith CVArchitect, I can generate a perfectly tailored, ATS-friendly version in literally seconds.\n\nIt's a game changer.",
                        views: "450", replies: "1", retweets: "0", likes: "18", verified: false, theme: "light"
                      },
                      {
                        name: "David Kim",
                        handle: "david_data",
                        date: "23h",
                        avatar: "/images/testimonials/david-kim.jpg",
                        quote: "I had internships but no \"brand name\" experience.\n\nThe AI suggestions helped me frame school projects and part-time work as real impact.\n\nI landed my first full-time analyst role in 3 weeks.",
                        views: "2.1K", replies: "6", retweets: "4", likes: "92", verified: true, theme: "light"
                      }
                    ].map((t, idx) => (
                      <div key={`bottom-${arrayIndex}-${idx}`} className={`rounded-2xl p-4 pb-3 border shadow-sm mx-3 min-w-[350px] max-w-[400px] whitespace-normal flex flex-col items-start text-left cursor-default transition-colors ${t.theme === 'dark' ? 'bg-black border-zinc-800 hover:bg-zinc-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <div className="flex gap-3 w-full">
                          <img src={t.avatar} alt={t.name} loading="lazy" className="w-10 h-10 rounded-full object-cover shrink-0" />
                          <div className="flex flex-col flex-1 w-full">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-1 text-[15px]">
                                <span className={`font-bold ${t.theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>{t.name}</span>
                                {t.verified && <BadgeCheck size={16} className="text-blue-500" fill="currentColor" stroke={t.theme === 'dark' ? 'black' : 'white'} />}
                                <span className="text-gray-500">@{t.handle}</span>
                                <span className="text-gray-500">·</span>
                                <span className="text-gray-500 hover:underline cursor-pointer">{t.date}</span>
                              </div>
                              <MoreHorizontal size={18} className="text-gray-500 cursor-pointer" />
                            </div>
                            <div className={`text-[15px] mt-0.5 leading-snug whitespace-pre-wrap ${t.theme === 'dark' ? 'text-zinc-100' : 'text-gray-800'}`}>
                              {t.quote}
                            </div>
                            <div className="flex items-center justify-between mt-3 text-gray-500 w-full pr-2">
                              <div className="flex gap-1.5 items-center hover:text-blue-500 transition-colors cursor-pointer"><MessageCircle size={18} /><span>{t.replies}</span></div>
                              <div className="flex gap-1.5 items-center hover:text-green-500 transition-colors cursor-pointer"><Repeat2 size={18} /><span>{t.retweets}</span></div>
                              <div className="flex gap-1.5 items-center hover:text-red-500 transition-colors cursor-pointer"><Heart size={18} /><span>{t.likes}</span></div>
                              <div className="flex gap-1.5 items-center hover:text-blue-500 transition-colors cursor-pointer"><BarChart2 size={18} /><span>{t.views}</span></div>
                              <div className="flex gap-3 items-center">
                                <div className="hover:text-blue-500 transition-colors cursor-pointer"><Bookmark size={18} /></div>
                                <div className="hover:text-blue-500 transition-colors cursor-pointer"><Upload size={18} /></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-brand-dark" style={{ fontFamily: 'Graphik, sans-serif' }}>
              The "Get Hired" Pricing Model
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Most users find a job in less than 7 days. Why pay for a monthly subscription you don't need?
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-4xl mx-auto"
          >
            {/* SPRINT PLAN (Focus) */}
            <motion.div
              variants={fadeInUp}
              className="relative bg-white border-2 border-brand-green rounded-3xl p-8 md:p-10 shadow-2xl shadow-brand-green/10 max-w-sm w-full mx-auto flex flex-col"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark whitespace-nowrap">The Career Sprint</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-green text-brand-dark text-[10px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                    Most popular
                  </span>
                </div>
                <p className="text-sm text-gray-500">Best for focused 7-day job search sprints.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-6xl font-extrabold text-brand-dark">$9</span>
                  <span className="text-gray-500 font-medium">/ 7 days</span>
                </div>
                <p className="text-sm text-brand-green font-semibold mt-3">
                  One-time payment, no auto-renew.
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {pricingFeatures.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check size={16} className="text-brand-green mt-0.5" />
                    <span className={i === 0 ? 'font-semibold' : ''}>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetStarted}
                  className="w-full py-4 rounded-full bg-brand-green hover:opacity-90 text-brand-dark text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Start 7-day access
                </motion.button>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Shield size={14} className="text-brand-green" />
                  <p>Backed by a 7-day money-back guarantee.</p>
                </div>
              </div>
            </motion.div>

            {/* MARATHON PLAN */}
            <motion.div
              variants={fadeInUp}
              className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 mt-4 md:mt-0 max-w-sm w-full mx-auto flex flex-col"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark whitespace-nowrap">The Career Marathon</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-green text-brand-dark text-[10px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                    Best deal
                  </span>
                </div>
                <p className="text-sm text-gray-500">Best for ongoing applications and long-term career moves.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-brand-dark">$19</span>
                  <span className="text-gray-500 font-medium">/ month</span>
                </div>
                <p className="text-sm text-gray-500 font-medium mt-3">Recurring subscription. Cancel anytime.</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <ul className="space-y-3">
                  {pricingFeatures.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <Check size={16} className="text-brand-green mt-0.5" />
                      <span className={i === 0 ? 'font-semibold' : ''}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetStarted}
                  className="w-full py-4 rounded-full bg-brand-green hover:opacity-90 text-brand-dark text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Start monthly access
                </motion.button>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Shield size={14} className="text-brand-green" />
                  <p>Cancel anytime. Your changes are always saved.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Guest Tier Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 text-lg">
              Not ready to commit?{' '}
              <button
                onClick={handleGetStarted}
                className="text-brand-dark font-bold underline decoration-2 underline-offset-4 hover:text-brand-green transition-colors"
              >
                Start with Guest Access
              </button>
            </p>
            <p className="text-sm text-gray-400 mt-2 max-w-lg mx-auto">
              Includes 1 resume project, access to basic templates, and 10 complimentary AI credits to test the builder.
            </p>
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

      <PublicFooter />

    </div>
  );
}
