import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Clock,
  X,
  ScanSearch,
  Columns3,
  Target,
  Quote,
  MailX
} from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

const bentoCardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.09,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

/* ─── Section furniture: same badge + frame hairlines used by every other
   landing section, so this block sits inside the page's grid, not beside it. ─── */

function SectionBadge({ chip, children }: { chip: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 py-1 pl-1 pr-3.5 sm:pr-4 rounded-full bg-white border border-brand-green/50 shadow-sm max-w-full">
      <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap shrink-0">
        {chip}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-brand-dark whitespace-nowrap truncate">{children}</span>
    </span>
  );
}

function VerticalBoundLines() {
  return (
    <div
      className="absolute inset-y-0 left-3 right-3 sm:left-6 sm:right-6 md:left-[calc(100vw/6)] md:right-[calc(100vw/6)] pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-0 w-px bg-brand-border" />
      <div className="absolute inset-y-0 right-0 w-px bg-brand-border" />
    </div>
  );
}

/* Grey card (site radius + hairline), white chip, white "product UI" panel. */
const CHIP =
  'inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-dark/75 bg-white border border-brand-border px-2.5 py-1 rounded-lg';
const PANEL =
  'h-[150px] rounded-xl bg-white border border-brand-border p-3.5 flex flex-col justify-between shadow-[0_10px_30px_-16px_rgba(51,60,77,0.28)]';

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
    <div className={PANEL}>
      {/* Top status bar */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-green" />
          <span className="font-mono text-[11px] text-brand-dark/70">Workday Parser Engine</span>
        </div>
        <span className="text-[11px] font-mono text-rose-500/90 font-medium">
          {showResult ? 'Match: 52% (Min: 75%)' : 'Taxonomy check in progress'}
        </span>
      </div>

      {/* Stable middle body with smooth in-place transition */}
      <div className="h-[56px] flex items-center">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full font-mono text-xs text-brand-dark/70 flex items-center"
            >
              <span className="text-brand-greenHover mr-2 font-bold">&gt;</span>
              <span className="truncate">{displayedText}</span>
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-brand-dark/30 align-middle" />
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
                <span className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md text-rose-500">
                  × "Design Systems"
                </span>
                <span className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md text-rose-500">
                  × "Interactive Prototyping"
                </span>
                <span className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md text-rose-500">
                  × "A/B Testing"
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom verdict bar */}
      <div className="pt-2 border-t border-brand-border flex items-center justify-between text-[11px] font-mono text-brand-dark/45">
        <span>ATS Verdict:</span>
        <span className="text-rose-500/90 font-medium">
          {showResult ? '[Auto-archived before recruiter review]' : '[Scanning taxonomy...]'}
        </span>
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
    <div className={PANEL}>
      <div className="flex items-center justify-between text-[11px] font-mono text-brand-dark/50 pb-1.5 border-b border-brand-border">
        <span>{current.role}</span>
        <span className="text-rose-500/90 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" /> 6s scan failure
        </span>
      </div>

      <div className="h-[52px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-xs sm:text-[13px] text-brand-dark/60 line-through decoration-brand-dark/30 font-normal leading-snug line-clamp-2"
          >
            {current.text}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="pt-1.5 border-t border-brand-border flex items-center text-[11px] text-brand-dark/50 truncate">
        <span className="truncate">× {current.reason}</span>
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
    <div className={PANEL}>
      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-brand-border">
        <span className="font-semibold text-brand-dark truncate text-xs">{item.company}</span>
        <span className="text-[11px] font-medium text-rose-500 font-mono bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md">
          {item.score}
        </span>
      </div>

      <div className="space-y-2 py-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-brand-dark/55">
          <span>ATS Passing Cutoff: 75%</span>
          <span className="text-rose-500/80">{item.score}</span>
        </div>
        <div className="w-full bg-brand-bg h-1.5 rounded-full overflow-hidden ring-1 ring-brand-border">
          <div className="h-full bg-rose-400 rounded-full" style={{ width: item.score }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-brand-dark/45 pt-1.5 border-t border-brand-border">
        <span>Applicant Queue:</span>
        <span className="text-brand-dark/70 font-medium">{item.rank}</span>
      </div>
    </div>
  );
}

interface ProblemSectionProps {
  onExploreSolutions?: () => void;
}

interface ProblemCard {
  index: string;
  label: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  widget: React.ReactNode;
  wide?: boolean;
}

const CARDS: ProblemCard[] = [
  {
    index: '02',
    label: 'THE 6-SECOND SCAN',
    title: 'Duties describe work. Not results.',
    body: 'Recruiters scan in six seconds. Bullets without metrics get ignored.',
    icon: <Clock className="w-3.5 h-3.5 text-brand-green" />,
    widget: <WeakBulletsChangingWidget />,
  },
  {
    index: '03',
    label: 'OCR PARSER TRAP',
    title: 'Fancy templates choke parsers.',
    body: 'Columns, tables, and icons scramble into unreadable plain text.',
    icon: <Columns3 className="w-3.5 h-3.5 text-brand-green" />,
    widget: (
      <div className={PANEL}>
        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-brand-border">
          <span className="font-mono text-brand-dark/70 text-[11px]">canva-resume.pdf</span>
          <span className="text-[10px] font-medium text-rose-500 font-mono bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md">
            Scramble Alert
          </span>
        </div>

        <div className="space-y-1.5 py-1">
          <div className="w-full bg-brand-bg h-1.5 rounded-full overflow-hidden ring-1 ring-brand-border">
            <motion.div
              animate={{ width: ['30%', '70%', '30%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="h-full bg-rose-400 rounded-full"
            />
          </div>

          <div className="space-y-1 text-[11px] text-brand-dark/60 font-medium">
            <div className="flex items-center gap-1.5">
              <X className="w-3 h-3 text-rose-500 shrink-0" />
              <span className="truncate">Multi-column layout merged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <X className="w-3 h-3 text-rose-500 shrink-0" />
              <span className="truncate">Non-standard header unmapped</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-brand-dark/45 pt-1.5 border-t border-brand-border">
          <span>OCR Status:</span>
          <span className="text-rose-500/90 font-medium">Format errors</span>
        </div>
      </div>
    ),
  },
  {
    index: '04',
    label: 'ROLE CALIBRATION',
    title: 'One resume sent to 50 jobs.',
    body: 'Generic submissions score below 60% on role-specific requirements.',
    icon: <Target className="w-3.5 h-3.5 text-brand-green" />,
    widget: <GenericResumeMismatchWidget />,
  },
  {
    index: '05',
    label: 'BUZZWORD FATIGUE',
    title: 'Vague adjectives fool no one.',
    body: 'Claims like "hardworking team player" blend into hundreds of applicants.',
    icon: <Quote className="w-3.5 h-3.5 text-brand-green" />,
    wide: true,
    widget: (
      <div className="h-[150px] rounded-xl bg-white border border-brand-border p-3 flex gap-2 shadow-[0_10px_30px_-16px_rgba(51,60,77,0.28)]">
        <div className="flex-1 min-w-0 rounded-lg bg-brand-bg border border-brand-border p-2.5 flex flex-col justify-center gap-1">
          <p className="text-[11px] text-brand-dark/60 font-mono line-through decoration-brand-dark/30 leading-snug">
            “Passionate, results-driven self-starter”
          </p>
          <p className="text-[10px] text-rose-500">× Zero commercial evidence</p>
        </div>

        <div className="flex-1 min-w-0 rounded-lg bg-brand-bg border border-brand-border p-2.5 flex flex-col justify-center gap-1">
          <p className="text-[11px] text-brand-dark/60 font-mono line-through decoration-brand-dark/30 leading-snug">
            “Hardworking leader with great communication”
          </p>
          <p className="text-[10px] text-rose-500">× Ignored by hiring managers</p>
        </div>
      </div>
    ),
  },
  {
    index: '06',
    label: 'THE SILENT REJECTION',
    title: 'Hours spent applying. Silence in return.',
    body: 'Qualified candidates get ghosted because their experience is poorly structured for modern hiring software and six-second recruiter glances.',
    icon: <MailX className="w-3.5 h-3.5 text-brand-green" />,
    wide: true,
    widget: (
      <div className="h-[150px] rounded-xl bg-white border border-brand-border p-3 flex items-center gap-4 shadow-[0_10px_30px_-16px_rgba(51,60,77,0.28)]">
        <img
          src="/images/Section 3 illustration.png"
          alt="Resumes rejected by ATS filters before review"
          className="h-full w-auto max-w-[38%] object-contain rounded-lg"
          loading="lazy"
        />
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="px-2.5 py-1 rounded-lg bg-brand-bg border border-brand-border text-[11px] font-mono text-brand-dark/70 leading-snug">
            × 75% dropped before review
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-brand-bg border border-brand-border text-[11px] font-mono text-brand-dark/70 leading-snug">
            × 80% lost in 6-second skim
          </span>
        </div>
      </div>
    ),
  },
];

export default function ProblemSection({ onExploreSolutions: _onExploreSolutions }: ProblemSectionProps) {
  return (
    <section
      id="the-problem"
      className="relative py-24 md:py-36 bg-white border-t border-brand-border overflow-hidden"
    >
      <VerticalBoundLines />

      <div className="relative z-10 w-full max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header - same badge + centered display type as the rest of the page */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="text-center mb-14 lg:mb-20"
        >
          <SectionBadge chip="The Problem">Why great candidates get skipped</SectionBadge>
          <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mt-5 text-balance">
            The small mistakes that <em className="not-italic text-brand-green">cost you the interview</em>.
          </h2>
          <p className="text-base text-brand-dark/60 mt-5 max-w-2xl mx-auto">
            75% of resumes are rejected by ATS filters before a recruiter ever looks. Here is exactly where traditional resumes fail.
          </p>
        </motion.div>

        {/* ─── Featured: the live parser console on a dark stage ─── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
          className="mb-4 sm:mb-5"
        >
          <div className="relative rounded-2xl bg-brand-dark text-white border border-brand-dark/20 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: the claim */}
              <div className="p-7 sm:p-10 flex flex-col justify-center">
                <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-green bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  <ScanSearch className="w-3.5 h-3.5" /> 01 · ATS KEYWORD FILTER
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-5 leading-[1.1]">
                  <span className="text-brand-green">75%</span> of resumes never reach a human.
                </h3>
                <p className="text-sm sm:text-base text-white/65 mt-4 leading-relaxed max-w-md">
                  Applicant tracking systems scan for exact phrasing. A missing synonym triggers automatic disqualification.
                </p>
              </div>

              {/* Right: live parser readout */}
              <div className="p-6 sm:p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/10">
                <div className="w-full max-w-[400px]">
                  <AtsTypingSimulation />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Five supporting failure modes: 3 across, then 2 wide ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 items-stretch">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.index}
              custom={i + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={bentoCardVariants}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              className={`h-full ${card.wide ? 'lg:col-span-3' : 'lg:col-span-2'} ${i === CARDS.length - 1 ? 'md:col-span-2 lg:col-span-3' : ''}`}
            >
              <div className="h-full rounded-xl bg-brand-secondary border border-brand-border overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col">
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <span className={CHIP}>
                    {card.icon}
                    {card.index} · {card.label}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-dark mt-4 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-brand-dark/60 mt-2.5 leading-relaxed">
                    {card.body}
                  </p>
                  <div className="mt-auto pt-5">
                    {card.widget}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
