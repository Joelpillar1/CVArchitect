import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AuthHeroShowcaseProps {
  headlineTop?: string;
  headlineBottom?: string;
}

/* Animated stat counter that runs immediately on mount */
function Counter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
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
  }, [value, decimals]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export default function AuthHeroShowcase({
  headlineTop = 'Build Resumes That',
  headlineBottom = 'Actually Get Read',
}: AuthHeroShowcaseProps) {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full min-h-screen bg-brand-dark p-10 xl:p-14 relative overflow-hidden select-none">
      {/* Ambient colour blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] bg-brand-green/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[400px] h-[400px] bg-brand-green/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* ─── Centre: Resume Sheets + ATS Score ─── */}
      <div className="relative z-10 flex-1 flex items-center justify-center mt-4 mb-6">
        {/* Resume composition container */}
        <div className="relative w-full max-w-[580px] xl:max-w-[640px] h-[480px] xl:h-[560px]">

          {/* Back sheet — Student resume, peeking out on the left */}
          <div
            className="absolute left-0 top-6 w-[52%] h-[460px] xl:h-[530px] rounded-2xl overflow-hidden rotate-[-4deg] shadow-2xl shadow-black/30"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 88%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 88%)',
            }}
          >
            <img
              src="/images/Student/Reume Sample 0.png"
              alt="Student resume template"
              className="w-full h-full object-cover object-top opacity-75"
            />
          </div>

          {/* Front sheet — Professional resume, prominent */}
          <div
            className="absolute right-0 top-0 w-[64%] h-[480px] xl:h-[550px] rounded-2xl overflow-hidden rotate-[2deg] shadow-2xl shadow-black/40"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 92%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 92%)',
            }}
          >
            <img
              src="/images/Resume Tutorial/Reume Sample.png"
              alt="Professional resume template"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* ─── ATS Score Card — floating over the sheets with active animations ─── */}
          <motion.div
            initial={{ opacity: 0, x: '-50%', y: 16, scale: 0.95 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -bottom-2 left-1/2 z-30 w-[280px] xl:w-[300px] bg-white rounded-2xl p-5 text-center shadow-xl shadow-black/15"
          >
            {/* Score & Counter */}
            <div className="flex flex-col items-center justify-center text-center">
              <span className="font-sans font-black text-[54px] xl:text-[62px] text-brand-dark tracking-tight leading-none">
                <Counter value={96} />
              </span>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-1"
              >
                <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-200/50 inline-block">
                  Excellent
                </span>
              </motion.div>
              <span className="text-xs text-brand-dark/50 font-medium mt-1.5">
                Target Job Match • Base ATS: <span className="text-brand-dark/80 font-semibold">94%</span>
              </span>
            </div>

            {/* Straight Horizontal Gradient Gauge */}
            <div className="space-y-1.5 px-0.5 mt-3.5">
              <div className="relative w-full">
                <svg className="w-full h-6 overflow-visible" viewBox="0 0 240 18">
                  <defs>
                    <linearGradient id="authHeroGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F43F5E" />
                      <stop offset="30%" stopColor="#FB923C" />
                      <stop offset="60%" stopColor="#FBBF24" />
                      <stop offset="85%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <clipPath id="authHeroGaugeClip">
                      <motion.rect 
                        x="0" 
                        y="2" 
                        height="14" 
                        rx="7" 
                        initial={{ width: 0 }}
                        animate={{ width: (96 / 100) * 240 }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </clipPath>
                  </defs>

                  {/* Background Track */}
                  <rect x="0" y="2" width="240" height="14" rx="7" fill="#F1F5F9" />

                  {/* Active Gradient Fill */}
                  <rect 
                    x="0" 
                    y="2" 
                    width="240" 
                    height="14" 
                    rx="7" 
                    fill="url(#authHeroGaugeGradient)" 
                    clipPath="url(#authHeroGaugeClip)" 
                  />

                  {/* Dynamic Indicator Thumb */}
                  <motion.circle
                    cy="9"
                    r="8"
                    fill="#FFFFFF"
                    stroke="#1E293B"
                    strokeWidth="3"
                    className="filter drop-shadow-md"
                    initial={{ cx: 8 }}
                    animate={{ cx: (96 / 100) * 240 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </div>

              {/* 0 and 100 Baseline markers */}
              <div className="flex justify-between items-center text-[10px] font-semibold text-brand-dark/40 tabular-nums px-1 select-none">
                <span>0</span>
                <span>100</span>
              </div>
            </div>

            {/* 3 Spectrum Equalizer Towers */}
            <div className="grid grid-cols-3 gap-2 pt-2 mt-1">
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
                  className="bg-neutral-50 rounded-xl border border-neutral-100 p-2 flex flex-col items-center gap-1.5"
                >
                  <div className="flex flex-col-reverse gap-1 h-14 w-full px-0.5">
                    {Array.from({ length: 8 }).map((_, bIdx) => {
                      const isLit = bIdx < col.litCount;
                      return (
                        <motion.div
                          key={bIdx}
                          initial={{ scaleY: 0, opacity: 0.2 }}
                          animate={{ scaleY: 1, opacity: 1 }}
                          transition={{
                            delay: isLit ? 0.2 + cIdx * 0.15 + bIdx * 0.05 : 0,
                            duration: 0.35,
                            ease: 'easeOut'
                          }}
                          style={{ transformOrigin: 'bottom' }}
                          className={`h-1 w-full rounded-sm transition-colors ${
                            isLit ? col.color : 'bg-neutral-200/60'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700 truncate w-full text-center">
                    {col.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Bottom: Worthy Value Proposition ─── */}
      <div className="relative z-10 text-center max-w-[520px] mx-auto mt-4 mb-2">
        <h3 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Engineered to place you in the <span className="text-brand-green">top 1%</span> of every shortlist.
        </h3>

        <p className="mt-2.5 text-sm xl:text-base text-gray-300/80 font-normal leading-relaxed">
          Real-time ATS benchmarking, high-impact action verbs, and recruiter-approved formatting that turn cold applications into executive interviews.
        </p>
      </div>
    </div>
  );
}
