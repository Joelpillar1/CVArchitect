'use client';

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from './card';
import { TimelineContent } from './timeline-animation';
import { VerticalCutReveal } from './vertical-cut-reveal';
import { cn } from '../../lib/utils';
import { Sparkles, CheckCheck, FileText, Layers, ShieldCheck, Infinity as InfinityIcon, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderBeam } from 'border-beam';
import { PlanId } from '../../types/pricing';

interface PricingPlanData {
  id: PlanId;
  name: string;
  tagline: string;
  description: string;
  price: number;
  period: string;
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'primary';
  popular?: boolean;
  features: { text: string; icon: React.ReactNode }[];
  includes: string[];
}

const cvPlans: PricingPlanData[] = [
  {
    id: 'free',
    name: 'Foundation',
    tagline: '',
    description: 'Start free with one complete AI-tailored resume on base ATS templates.',
    price: 0,
    period: 'forever',
    buttonText: 'Get started free',
    buttonVariant: 'outline',
    features: [
      { text: '1 Resume', icon: <Sparkles size={18} /> },
      { text: 'Base ATS Templates.', icon: <Layers size={18} /> },
      { text: '1 Full PDF Export', icon: <FileText size={18} /> },
    ],
    includes: [
      'Included in Free:',
      'AI tailoring session',
      'Grounded Evidence Verification',
      'Keyword match & ATS scoring',
      'Interactive drag & drop editor',
      'No credit card required',
    ],
  },
  {
    id: 'build',
    name: 'Build',
    tagline: '',
    description: 'Unlimited AI tailoring, every template, and unlimited downloads. Cancel anytime.',
    price: 10,
    period: 'month',
    buttonText: 'Get started with Build',
    buttonVariant: 'primary',
    features: [
      { text: 'Unlimited AI Tailored Resumes', icon: <Sparkles size={18} /> },
      { text: 'All ATS Resume Templates', icon: <Layers size={18} /> },
      { text: 'Unlimited PDF, DOCX & TXT Exports', icon: <FileText size={18} /> },
    ],
    includes: [
      'Everything in Foundation, plus:',
      'Unlimited AI tailoring & rewrites*',
      'All premium ATS templates',
      'Cover Letter Builder & Interview Prep',
      'Saved resume versions for every job',
      'Job Search Feed & 1-Click Tailor',
      'Renews monthly at $10. Cancel anytime.',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    tagline: '',
    description: 'Unlimited AI tailoring forever with zero recurring subscriptions.',
    price: 99,
    period: 'one-time',
    buttonText: 'Get Lifetime Access',
    buttonVariant: 'outline',
    features: [
      { text: 'Permanent Unlimited AI Tailoring', icon: <InfinityIcon size={18} /> },
      { text: 'All Present & Future Templates', icon: <Layers size={18} /> },
      { text: 'Lifetime PDF & Word Exports', icon: <FileText size={18} /> },
    ],
    includes: [
      'Everything in Build, plus:',
      'One-time payment of $99 — no renewals',
      'Permanent access to all future models',
      'Unlimited saved versions forever',
      'Priority AI Agent processing',
      'Dedicated support assistance',
    ],
  },
];

interface PricingSectionProps {
  onSelectPlan?: (planId: PlanId) => void;
  loadingPlanId?: PlanId | null;
  currentPlanId?: string;
  isPaidSubscriber?: boolean;
  compact?: boolean;
  showLifetime?: boolean;
  className?: string;
}

function normalizeCurrentPlanId(id?: string): string {
  if (!id) return 'free';
  if (id === 'week_pass' || id === 'sprint' || id === 'pro_monthly' || id === 'blueprint') return 'build';
  return id;
}

export default function PricingSection({
  onSelectPlan,
  loadingPlanId = null,
  currentPlanId = 'free',
  isPaidSubscriber = false,
  compact = false,
  showLifetime = false,
  className,
}: PricingSectionProps) {
  const pricingRef = useRef<HTMLDivElement>(null);
  const displayedPlans = showLifetime ? cvPlans : cvPlans.filter((p) => p.id !== 'lifetime');
  const normalizedCurrentPlan = normalizeCurrentPlanId(currentPlanId);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.15,
        duration: 0.45,
        ease: 'easeOut',
      },
    }),
    hidden: {
      filter: 'blur(6px)',
      y: -15,
      opacity: 0,
    },
  };

  return (
    <div className={cn('w-full relative', className)} ref={pricingRef}>
      {!compact && (
        <article className="text-center mb-10 md:mb-14 space-y-3 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 py-1 pl-1 pr-4 rounded-full bg-white border border-brand-green/50 mb-1">
            <span className="px-3 py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[11px] uppercase tracking-wider">
              Pricing
            </span>
            <span className="text-xs sm:text-sm font-semibold text-brand-dark">Simple, transparent plans</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-dark leading-tight">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.08}
              staggerFrom="first"
              containerClassName="justify-center"
            >
              Pay when you're ready to apply
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-base sm:text-lg text-brand-dark/70 max-w-2xl mx-auto leading-relaxed"
          >
            Start free with one AI-tailored resume. Upgrade for unlimited tailoring, every template, and unlimited exports. Cancel anytime.
          </TimelineContent>
        </article>
      )}

      {/* Plan Cards Grid */}
      <div
        className={cn(
          'grid gap-6 py-2 mx-auto items-stretch',
          showLifetime
            ? 'grid-cols-1 md:grid-cols-3 max-w-5xl'
            : 'grid-cols-1 md:grid-cols-2 max-w-2xl'
        )}
      >
        {displayedPlans.map((plan, index) => {
          const isCurrent = normalizedCurrentPlan === plan.id;
          const isLoading = loadingPlanId === plan.id;
          const isDark = plan.id === 'build';

          const cardContent = (
            <Card
              className={cn(
                'relative rounded-xl border transition-all flex flex-col w-full h-full overflow-hidden',
                isDark
                  ? 'bg-brand-dark text-white border-white/10'
                  : 'bg-white text-brand-dark border-brand-border hover:border-brand-dark/30'
              )}
            >
              <CardHeader className="text-left pb-4 relative">
                {isCurrent && (
                  <span className={cn(
                    'absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider',
                    isDark
                      ? 'bg-brand-green/20 text-brand-green border border-brand-green/40'
                      : 'bg-brand-dark/10 text-brand-dark border border-brand-dark/20'
                  )}>
                    Current plan
                  </span>
                )}

                {plan.tagline && (
                  <span className={cn(
                    'text-[11px] font-bold uppercase tracking-wider',
                    isDark ? 'text-brand-green' : 'text-brand-dark/60'
                  )}>
                    {plan.tagline}
                  </span>
                )}
                <h3 className={cn(
                  'text-2xl sm:text-3xl font-bold mb-2',
                  plan.tagline ? 'mt-1' : 'mt-0',
                  isDark ? 'text-white' : 'text-brand-dark'
                )}>
                  {plan.name}
                </h3>
                <p className={cn(
                  'text-xs sm:text-sm mb-4 min-h-[40px] leading-relaxed',
                  isDark ? 'text-white/70' : 'text-brand-dark/70'
                )}>
                  {plan.description}
                </p>

                <div className="flex items-baseline pt-2">
                  <span className={cn(
                    'text-4xl sm:text-5xl font-extrabold tracking-tight',
                    isDark ? 'text-white' : 'text-brand-dark'
                  )}>
                    ${plan.price}
                  </span>
                  <span className={cn(
                    'font-semibold text-xs sm:text-sm ml-1.5',
                    isDark ? 'text-white/60' : 'text-brand-dark/60'
                  )}>
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex flex-col flex-1">
                {/* Action Button */}
                <button
                  onClick={() => onSelectPlan?.(plan.id)}
                  disabled={isLoading || isCurrent}
                  className={cn(
                    'w-full mb-6 py-3 px-4 text-sm sm:text-base font-extrabold rounded-xl transition-all flex items-center justify-center gap-2',
                    isCurrent
                      ? isDark
                        ? 'bg-white/10 text-white/50 cursor-default border border-white/10'
                        : 'bg-brand-secondary/80 text-brand-dark/50 cursor-default border border-brand-border'
                      : isDark
                        ? 'bg-brand-green hover:bg-brand-greenHover text-brand-dark cursor-pointer active:scale-[0.99]'
                        : 'bg-brand-dark hover:bg-brand-dark/90 text-white cursor-pointer active:scale-[0.99]'
                  )}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCheck size={16} className={isDark ? 'text-brand-green' : 'text-brand-dark'} />
                      Current Plan
                    </span>
                  ) : (
                    <>
                      <span>{plan.buttonText}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Highlights */}
                <div className={cn(
                  'space-y-3 mb-6 pb-6 border-b',
                  isDark ? 'border-white/10' : 'border-brand-border/80'
                )}>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5">
                      <div className={cn(
                        'p-1.5 rounded-lg shrink-0',
                        isDark ? 'bg-white/10 text-brand-green' : 'bg-brand-secondary text-brand-dark'
                      )}>
                        {feature.icon}
                      </div>
                      <span className={cn(
                        'text-xs sm:text-sm font-semibold',
                        isDark ? 'text-white' : 'text-brand-dark'
                      )}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 flex-1">
                  <h4 className={cn(
                    'font-bold text-xs uppercase tracking-wider',
                    isDark ? 'text-white/60' : 'text-brand-dark/70'
                  )}>
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2.5">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className={cn(
                          'h-5 w-5 rounded-full grid place-content-center mt-0.5 mr-2.5 shrink-0 border',
                          isDark
                            ? 'bg-brand-green/20 border-brand-green/40 text-brand-green'
                            : 'bg-brand-green/20 border-brand-green/40 text-brand-dark'
                        )}>
                          <CheckCheck className="h-3 w-3" strokeWidth={2.5} />
                        </span>
                        <span className={cn(
                          'text-xs sm:text-sm font-medium',
                          isDark ? 'text-white/90' : 'text-brand-dark/80'
                        )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );

          return (
            <TimelineContent
              key={plan.name}
              as="div"
              animationNum={1 + index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
              className="flex"
            >
              {isDark ? (
                <BorderBeam
                  size="md"
                  theme="dark"
                  borderRadius={12}
                  strength={0.75}
                  duration={4}
                  className="rounded-xl w-full flex flex-col flex-1"
                >
                  {cardContent}
                </BorderBeam>
              ) : (
                cardContent
              )}
            </TimelineContent>
          );
        })}
      </div>
    </div>
  );
}
