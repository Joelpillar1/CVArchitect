import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Clock,
  X
} from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const bentoCardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

/* ─── Card 1: Typing Animation for ATS Parser Drop (Locked Height, Zero Shift) ─── */
const SCANNER_PROMPTS = [
  'Scanning resume against 18 required competencies...',
  'Checking exact taxonomy against Workday parser rules...',
  'Verifying domain keywords for Senior Designer role...',
];

function AtsTypingSimulation() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const target = SCANNER_PROMPTS[promptIdx];

    if (isTyping) {
      if (displayedText.length < target.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(target.slice(0, displayedText.length + 1));
        }, 34);
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setShowResult(true);
        }, 250);
      }
    } else {
      timeoutId = setTimeout(() => {
        setShowResult(false);
        setDisplayedText('');
        setIsTyping(true);
        setPromptIdx((prev) => (prev + 1) % SCANNER_PROMPTS.length);
      }, 3400);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isTyping, promptIdx]);

  return (
    <div className="w-full mt-auto pt-4">
      {/* Fixed height container (140px) so Card 1 never expands or pushes other cards */}
      <div className="h-[140px] rounded-xl bg-[#151C28] border border-white/10 p-3.5 flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Top status bar */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-green/80" />
            <span className="font-mono text-[11px] text-white/60">Workday Parser Engine</span>
          </div>
          <span className="text-[11px] font-mono text-rose-300/80 font-medium">
            {showResult ? 'Match: 52% (Min: 75%)' : 'Taxonomy check in progress'}
          </span>
        </div>

        {/* Stable middle body with smooth in-place transition */}
        <div className="h-[52px] flex items-center">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full font-mono text-xs text-white/70 flex items-center"
              >
                <span className="text-brand-green mr-2 font-bold">&gt;</span>
                <span className="truncate">{displayedText}</span>
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-white/40 align-middle" />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full space-y-1.5"
              >
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-rose-300/90">
                    × "Design Systems"
                  </span>
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-rose-300/90">
                    × "Interactive Prototyping"
                  </span>
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-rose-300/90">
                    × "A/B Testing"
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom verdict bar */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
          <span>ATS Verdict:</span>
          <span className="text-rose-300/80 font-medium">
            {showResult ? '[Auto-archived before recruiter review]' : '[Scanning taxonomy...]'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Card 2: Changing Bullets for 6-Second Glance (Locked Height, Muted Tones) ─── */
const WEAK_BULLETS = [
  {
    role: 'Marketing',
    text: '“Responsible for managing marketing campaigns and social media.”',
    reason: 'Zero measurable metrics or business scale',
  },
  {
    role: 'Software Engineer',
    text: '“Helped engineering team with backend bug fixes and API tasks.”',
    reason: 'Passive language, no commercial throughput proof',
  },
  {
    role: 'Product Design',
    text: '“Designed mobile app screens and assisted with user feedback.”',
    reason: 'Routine task description, recruiter skips in 6 seconds',
  },
];

function WeakBulletsChangingWidget() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % WEAK_BULLETS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const current = WEAK_BULLETS[idx];

  return (
    <div className="w-full mt-auto pt-4">
      {/* Locked height container (140px) */}
      <div className="h-[140px] rounded-xl bg-[#151C28] border border-white/10 p-3.5 flex flex-col justify-between shadow-inner">
        <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pb-1.5 border-b border-white/10">
          <span>{current.role}</span>
          <span className="text-rose-300/80 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> 6s scan failure
          </span>
        </div>

        <div className="h-[48px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-xs sm:text-[13px] text-white/50 line-through decoration-white/30 font-normal leading-snug line-clamp-2"
            >
              {current.text}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="pt-1.5 border-t border-white/10 flex items-center text-[11px] text-white/40 truncate">
          <span className="truncate">× {current.reason}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Card 4: Changing Role Mismatch for Generic Resume (Locked Height) ─── */
const GENERIC_FAILS = [
  { company: 'Stripe PM Posting', score: '54%', rank: 'Rank #124 of 145' },
  { company: 'Google Software Eng', score: '48%', rank: 'Rank #189 of 210' },
  { company: 'Linear Product Design', score: '52%', rank: 'Rank #96 of 115' },
];

function GenericResumeMismatchWidget() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % GENERIC_FAILS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const item = GENERIC_FAILS[idx];

  return (
    <div className="w-full mt-auto pt-4">
      {/* Locked height container (140px) */}
      <div className="h-[140px] rounded-xl bg-[#151C28] border border-white/10 p-3.5 flex flex-col justify-between shadow-inner">
        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
          <span className="font-semibold text-white/80 truncate text-xs">{item.company}</span>
          <span className="text-[11px] font-medium text-rose-300/80 font-mono bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md">
            {item.score}
          </span>
        </div>

        <div className="space-y-2 py-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span>ATS Passing Cutoff: 75%</span>
            <span className="text-rose-300/70">{item.score}</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-rose-400/50 rounded-full" style={{ width: item.score }} />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-1.5 border-t border-white/10">
          <span>Applicant Queue:</span>
          <span className="text-white/60 font-medium">{item.rank}</span>
        </div>
      </div>
    </div>
  );
}

interface ProblemSectionProps {
  onExploreSolutions?: () => void;
}

export default function ProblemSection({ onExploreSolutions: _onExploreSolutions }: ProblemSectionProps) {
  return (
    <section 
      id="the-problem" 
      className="relative py-20 md:py-28 bg-[#1A2230] text-white overflow-hidden border-t border-brand-dark/30"
    >
      {/* Ambient background glows using app theme tones */}
      <div 
        className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 w-full max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Focused entirely on THE PROBLEM */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 py-1 pl-1 pr-3.5 rounded-full bg-white/10 border border-brand-green/40 shadow-sm backdrop-blur-md mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-green text-brand-dark font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              The Problem
            </span>
            <span className="text-xs sm:text-sm font-semibold text-white/90">
              Why great candidates get skipped
            </span>
          </span>
          <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.05] text-white">
            The small mistakes that cost you the interview.
          </h2>
          <p className="text-sm sm:text-base text-white/60 mt-3 leading-relaxed">
            75% of resumes are rejected by ATS filters before a recruiter ever looks. Here is exactly where traditional resumes fail.
          </p>
        </motion.div>

        {/* ─── 6-CARD BENTO GRID (2-1-1 TOP / 1-1-2 BOTTOM) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">

          {/* ════ CARD 01: The Keyword Synonym Disconnect (Wide: col-span-2) ════ */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={bentoCardVariants}
            className="lg:col-span-2 h-full min-h-[340px] rounded-2xl bg-[#212B3B] border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all"
          >
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                01 · ATS KEYWORD FILTER
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2 leading-tight">
                75% of resumes never reach a human.
              </h3>
              <p className="text-xs sm:text-sm text-white/65 mt-1.5 leading-relaxed">
                Applicant tracking systems scan for exact phrasing. A missing synonym triggers automatic disqualification.
              </p>
            </div>

            {/* Interactive ATS Typing Scanner (Height-locked) */}
            <AtsTypingSimulation />
          </motion.div>

          {/* ════ CARD 02: Duties describe tasks. Not results. (1 col) ════ */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={bentoCardVariants}
            className="lg:col-span-1 h-full min-h-[340px] rounded-2xl bg-[#212B3B] border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all"
          >
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                02 · THE 6-SECOND SCAN
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2 leading-tight">
                Duties describe work. Not results.
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1 leading-snug">
                Recruiters scan in six seconds. Bullets without metrics get ignored.
              </p>
            </div>

            {/* Weak Bullets Changing Animation (Height-locked) */}
            <WeakBulletsChangingWidget />
          </motion.div>

          {/* ════ CARD 03: Formatting collapse / OCR corruption (1 col) ════ */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={bentoCardVariants}
            className="lg:col-span-1 h-full min-h-[340px] rounded-2xl bg-[#212B3B] border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all"
          >
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                03 · OCR PARSER TRAP
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2 leading-tight">
                Fancy templates choke parsers.
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1 leading-snug">
                Columns, tables, and icons scramble into unreadable plain text.
              </p>
            </div>

            {/* Parser Corruption Audit Widget (Height-locked to 140px) */}
            <div className="w-full mt-auto pt-4">
              <div className="h-[140px] rounded-xl bg-[#151C28] border border-white/10 p-3.5 flex flex-col justify-between shadow-inner">
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                  <span className="font-mono text-white/60 text-[11px]">canva-resume.pdf</span>
                  <span className="text-[10px] font-medium text-rose-300/80 font-mono bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md">
                    Scramble Alert
                  </span>
                </div>

                <div className="space-y-1.5 py-1">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['30%', '70%', '30%'] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      className="h-full bg-rose-400/50 rounded-full"
                    />
                  </div>

                  <div className="space-y-1 text-[11px] text-white/60 font-medium">
                    <div className="flex items-center gap-1.5">
                      <X className="w-3 h-3 text-rose-300/70 shrink-0" />
                      <span className="truncate">Multi-column layout merged</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <X className="w-3 h-3 text-rose-300/70 shrink-0" />
                      <span className="truncate">Non-standard header unmapped</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-1.5 border-t border-white/10">
                  <span>OCR Status:</span>
                  <span className="text-rose-300/80 font-medium">Format errors</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ════ CARD 04: The Generic One-Size-Fits-All Penalty (1 col) ════ */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={bentoCardVariants}
            className="lg:col-span-1 h-full min-h-[340px] rounded-2xl bg-[#212B3B] border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all"
          >
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                04 · ROLE CALIBRATION
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2 leading-tight">
                One resume sent to 50 jobs.
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1 leading-snug">
                Generic submissions score below 60% on role-specific requirements.
              </p>
            </div>

            {/* Changing Generic Mismatch Widget (Height-locked) */}
            <GenericResumeMismatchWidget />
          </motion.div>

          {/* ════ CARD 05: Vague Adjectives & Buzzword Fatigue (1 col) ════ */}
          <motion.div
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={bentoCardVariants}
            className="lg:col-span-1 h-full min-h-[340px] rounded-2xl bg-[#212B3B] border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all"
          >
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                05 · BUZZWORD FATIGUE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2 leading-tight">
                Vague adjectives fool no one.
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1 leading-snug">
                Claims like "hardworking team player" blend into hundreds of applicants.
              </p>
            </div>

            {/* Empty Buzzwords Callout (Height-locked to 140px) */}
            <div className="w-full mt-auto pt-4">
              <div className="h-[140px] rounded-xl bg-[#151C28] border border-white/10 p-3 flex flex-col justify-between shadow-inner">
                <div className="rounded-lg bg-white/5 border border-white/10 p-2 space-y-0.5">
                  <p className="text-[11px] text-white/50 font-mono line-through decoration-white/30 truncate">
                    “Passionate, results-driven self-starter”
                  </p>
                  <p className="text-[10px] text-rose-300/70">× Zero commercial evidence</p>
                </div>

                <div className="rounded-lg bg-white/5 border border-white/10 p-2 space-y-0.5">
                  <p className="text-[11px] text-white/50 font-mono line-through decoration-white/30 truncate">
                    “Hardworking leader with great communication”
                  </p>
                  <p className="text-[10px] text-rose-300/70">× Ignored by hiring managers</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ════ CARD 06: The Rejection Cycle with Illustration (Wide: col-span-2) ════ */}
          <motion.div
            custom={5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={bentoCardVariants}
            className="lg:col-span-2 h-full min-h-[340px] rounded-2xl bg-[#212B3B] border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden transition-all"
          >
            <div className="flex-1 space-y-2.5 z-10">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                06 · THE SILENT REJECTION
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Hours spent applying. Silence in return.
              </h3>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                Qualified candidates get ghosted because their experience is poorly structured for modern hiring software and six-second recruiter glances.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-white/70">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  × 75% dropped before review
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  × 80% lost in 6-second skim
                </span>
              </div>
            </div>

            {/* Real Illustration from Workspace Files */}
            <div className="w-full md:w-56 shrink-0 relative z-10 flex justify-center">
              <div className="relative rounded-xl bg-[#151C28] border border-white/15 p-2 shadow-2xl overflow-hidden max-w-[210px]">
                <img 
                  src="/images/Section 3 illustration.png" 
                  alt="Resumes rejected by ATS filters before review" 
                  className="w-full h-auto object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
