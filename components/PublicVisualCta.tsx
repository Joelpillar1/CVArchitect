import React, { useState, useEffect, useRef, useId } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useHydrating } from '../contexts/HydrationContext';

export interface PublicVisualCtaProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  headline: React.ReactNode;
  sub: React.ReactNode;
  ctaLabel: string;
  onCta: () => void;
  secondary?: React.ReactNode;
  score?: number;
  scoreBadge?: string;
  scoreSubtext?: string;
  trustBullets?: string[];
  theme?: 'dark' | 'navy';
}

function formatLineBreaks(content: React.ReactNode): React.ReactNode {
  if (typeof content !== 'string') return content;
  if (!content.includes('\n')) return content;
  const lines = content.split('\n');
  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx < lines.length - 1 && <br className="hidden sm:inline" />}
    </React.Fragment>
  ));
}

/* Animated stat counter that triggers when scrolled into view */
function Counter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const hydrating = useHydrating();
  const prerendering =
    typeof window !== 'undefined' && (window as any).__PRERENDER_HYDRATION__ === true;
  const staticValue = hydrating || prerendering;
  const [display, setDisplay] = useState(() => (staticValue ? value.toFixed(decimals) : '0'));
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    }, { threshold: 0.15 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (staticValue || !hasStarted) return;
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay((value * eased).toFixed(decimals));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasStarted, value, decimals, staticValue]);

  return <span ref={ref}>{`${display}${suffix}`}</span>;
}

export function PublicVisualCta({
  badge = 'Vetted by top tech recruiters',
  badgeIcon = <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />,
  headline,
  sub,
  ctaLabel,
  onCta,
  secondary,
  score = 96,
  scoreBadge = 'Excellent',
  scoreSubtext = 'Target Job Match • Base ATS: 94%',
  trustBullets = ['No credit card required', '3 free exports', 'Instant setup in 90 seconds']
}: PublicVisualCtaProps) {
  const hydrating = useHydrating();
  const uniqueId = useId().replace(/[:]/g, '');
  const gradientId = `publicHeroGaugeGradient-${uniqueId}`;
  const clipId = `publicHeroGaugeClip-${uniqueId}`;

  return (
    <section aria-label="Get started" className="relative py-10 sm:py-12 lg:py-14 bg-brand-dark text-white overflow-hidden border-t border-white/10 select-none">
      {/* Ambient colour blobs */}
      <div className="absolute top-[-100px] right-[-60px] w-[420px] h-[420px] bg-brand-green/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-40px] w-[340px] h-[340px] bg-brand-green/8 rounded-full blur-[110px] pointer-events-none" />

      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Headings (2 lines), Subtext (2 lines), Buttons, and Trust Badges */}
          <div className="lg:col-span-7 xl:col-span-7 text-left">
            {badge && (
              <motion.div
                initial={hydrating ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90 mb-4 shadow-sm"
              >
                {badgeIcon}
                <span>{badge}</span>
              </motion.div>
            )}

            <motion.h2
              initial={hydrating ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[clamp(1.75rem,2.8vw,2.45rem)] font-extrabold tracking-[-0.03em] leading-[1.15] text-white max-w-xl"
            >
              {formatLineBreaks(headline)}
            </motion.h2>

            <motion.p
              initial={hydrating ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-white/70 mt-3.5 max-w-xl leading-relaxed"
            >
              {formatLineBreaks(sub)}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={hydrating ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCta}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand-green px-6 py-3 text-sm sm:text-base font-bold text-brand-dark shadow-[0_10px_20px_rgba(112,224,152,0.22)] transition-all hover:bg-brand-greenHover cursor-pointer"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </motion.button>

              {secondary}
            </motion.div>

            {/* Micro trust indicators */}
            {trustBullets && trustBullets.length > 0 && (
              <motion.div
                initial={hydrating ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/50 font-medium"
              >
                {trustBullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN: Resume Showcase - Natural Width, Uncropped Sides, Compact Height */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] xl:max-w-[500px] h-[330px] sm:h-[360px] xl:h-[380px] flex items-center justify-center">

              {/* Back sheet — Student resume, peeking out on the left (uncropped sides) */}
              <div
                className="absolute left-1 sm:left-2 top-3 w-[215px] sm:w-[245px] xl:w-[265px] h-[280px] sm:h-[305px] xl:h-[330px] bg-white rounded-xl overflow-hidden rotate-[-4deg] shadow-xl shadow-black/35 border border-white/20"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 92%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 92%)',
                }}
              >
                <img
                  src="/images/Student/Reume Sample 0.png"
                  alt="Student resume template"
                  className="w-full h-auto block select-none opacity-80"
                />
              </div>

              {/* Front sheet — Professional resume, prominent (uncropped sides) */}
              <div
                className="absolute right-1 sm:right-2 top-0 w-[245px] sm:w-[275px] xl:w-[295px] h-[295px] sm:h-[320px] xl:h-[350px] bg-white rounded-xl overflow-hidden rotate-[2deg] shadow-2xl shadow-black/45 border border-white/25"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 95%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 95%)',
                }}
              >
                <img
                  src="/images/Resume Tutorial/Reume Sample.png"
                  alt="Professional resume template"
                  className="w-full h-auto block select-none"
                />
              </div>

              {/* ─── ATS Score Card — sleek, compact floating card ─── */}
              <motion.div
                initial={hydrating ? false : { opacity: 0, x: '-50%', y: 16, scale: 0.95 }}
                whileInView={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute -bottom-2.5 left-1/2 z-30 w-[240px] sm:w-[255px] xl:w-[268px] bg-white rounded-2xl p-3.5 sm:p-4 text-center shadow-xl shadow-black/25 border border-slate-100"
              >
                {/* Score & Counter */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="font-sans font-black text-[42px] sm:text-[46px] xl:text-[50px] text-brand-dark tracking-tight leading-none">
                    <Counter value={score} />
                  </span>
                  <motion.div 
                    initial={hydrating ? false : { scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-1"
                  >
                    <span className="text-[11px] sm:text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50 inline-block">
                      {scoreBadge}
                    </span>
                  </motion.div>
                  <span className="text-[10px] sm:text-[11px] text-brand-dark/50 font-medium mt-1">
                    {scoreSubtext}
                  </span>
                </div>

                {/* Straight Horizontal Gradient Gauge */}
                <div className="space-y-1 px-0.5 mt-2.5">
                  <div className="relative w-full">
                    <svg className="w-full h-5 overflow-visible" viewBox="0 0 240 16">
                      <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F43F5E" />
                          <stop offset="30%" stopColor="#FB923C" />
                          <stop offset="60%" stopColor="#FBBF24" />
                          <stop offset="85%" stopColor="#34D399" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                        <clipPath id={clipId}>
                          <motion.rect 
                            x="0" 
                            y="2" 
                            height="12" 
                            rx="6" 
                            initial={hydrating ? false : { width: 0 }}
                            whileInView={{ width: (score / 100) * 240 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </clipPath>
                      </defs>

                      {/* Background Track */}
                      <rect x="0" y="2" width="240" height="12" rx="6" fill="#F1F5F9" />

                      {/* Active Gradient Fill */}
                      <rect 
                        x="0" 
                        y="2" 
                        width="240" 
                        height="12" 
                        rx="6" 
                        fill={`url(#${gradientId})`} 
                        clipPath={`url(#${clipId})`} 
                      />

                      {/* Dynamic Indicator Thumb */}
                      <motion.circle
                        cy="8"
                        r="6.5"
                        fill="#FFFFFF"
                        stroke="#1E293B"
                        strokeWidth="2.5"
                        className="filter drop-shadow-md"
                        initial={hydrating ? false : { cx: 8 }}
                        whileInView={{ cx: (score / 100) * 240 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </svg>
                  </div>

                  {/* 0 and 100 Baseline markers */}
                  <div className="flex justify-between items-center text-[9px] font-semibold text-brand-dark/40 tabular-nums px-1 select-none">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>

                {/* 3 Spectrum Equalizer Towers: Relevance, Verbs, Impact */}
                <div className="grid grid-cols-3 gap-1.5 pt-1.5 mt-0.5">
                  {[
                    { 
                      label: 'Relevance', 
                      litCount: 7, 
                      color: 'bg-emerald-500' 
                    },
                    { 
                      label: 'Verbs', 
                      litCount: 7, 
                      color: 'bg-teal-500' 
                    },
                    { 
                      label: 'Impact', 
                      litCount: 8, 
                      color: 'bg-blue-500' 
                    },
                  ].map((col, cIdx) => (
                    <div 
                      key={cIdx} 
                      className="bg-neutral-50 rounded-lg border border-neutral-100 p-1.5 flex flex-col items-center gap-1"
                    >
                      <div className="flex flex-col-reverse gap-0.5 h-10 sm:h-11 w-full px-0.5">
                        {Array.from({ length: 8 }).map((_, bIdx) => {
                          const isLit = bIdx < col.litCount;
                          return (
                            <motion.div
                              key={bIdx}
                              initial={{ scaleY: 0, opacity: 0.2 }}
                              whileInView={{ scaleY: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                delay: isLit ? 0.2 + cIdx * 0.15 + bIdx * 0.05 : 0,
                                duration: 0.35,
                                ease: 'easeOut'
                              }}
                              style={{ transformOrigin: 'bottom' }}
                              className={`h-1 w-full rounded-xs transition-colors ${
                                isLit ? col.color : 'bg-neutral-200/60'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[9px] font-bold text-neutral-700 truncate w-full text-center">
                        {col.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
