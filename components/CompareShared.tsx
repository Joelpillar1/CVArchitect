import React from 'react';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ComparisonRow } from '../utils/comparisonData';
import { PublicVisualCta } from './PublicVisualCta';

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function CompareBadge({ chip, children }: { chip: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 py-1 pl-1 pr-4 rounded-full bg-white border border-brand-green/50 shadow-sm">
      <span className="px-3 py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
        {chip}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-brand-dark whitespace-nowrap">{children}</span>
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-brand-dark">{title}</h2>
      {description && <p className="text-sm sm:text-base text-brand-dark/60 mt-3 leading-relaxed">{description}</p>}
    </div>
  );
}

/** Semantic table. LLMs and answer engines read real tables far better than divs. */
export function ComparisonTable({ rows, competitorName }: { rows: ComparisonRow[]; competitorName: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <caption className="sr-only">
          {`Feature comparison between Cvarchitect and ${competitorName}`}
        </caption>
        <thead>
          <tr className="border-b border-brand-border">
            <th scope="col" className="w-[26%] py-3 pr-4 text-xs font-bold uppercase tracking-wider text-brand-dark/45">
              Feature
            </th>
            <th scope="col" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-brand-dark">
              Cvarchitect
            </th>
            <th scope="col" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-brand-dark/55">
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-brand-border/70 align-top">
              <th scope="row" className="py-3.5 pr-4 font-semibold text-brand-dark/80">
                {row.label}
              </th>
              <td className={`py-3.5 px-4 ${row.edge === 'us' ? 'bg-brand-green/10' : ''}`}>
                <span className="flex items-start gap-2">
                  <EdgeMark edge={row.edge} side="us" />
                  <span className="text-brand-dark/75">{row.us}</span>
                </span>
              </td>
              <td className={`py-3.5 px-4 ${row.edge === 'them' ? 'bg-brand-dark/[0.045]' : ''}`}>
                <span className="flex items-start gap-2">
                  <EdgeMark edge={row.edge} side="them" />
                  <span className="text-brand-dark/60">{row.them}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EdgeMark({ edge, side }: { edge: ComparisonRow['edge']; side: 'us' | 'them' }) {
  const wins = (edge === 'us' && side === 'us') || (edge === 'them' && side === 'them');
  if (edge === 'tie') {
    return <Minus className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark/25" aria-hidden="true" />;
  }
  if (!wins) {
    return <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-transparent" aria-hidden="true" />;
  }
  return <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark" aria-hidden="true" />;
}

export function BulletList({ items, tone = 'neutral' }: { items: string[]; tone?: 'neutral' | 'positive' }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-dark/70">
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
              tone === 'positive' ? 'bg-brand-green' : 'bg-brand-dark/30'
            }`}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function FaqList({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-brand-border border-y border-brand-border">
      {faqs.map((faq) => (
        <details key={faq.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm sm:text-base font-semibold text-brand-dark marker:hidden">
            {faq.q}
            <span className="mt-0.5 shrink-0 text-brand-dark/35 transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-dark/65">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  headline,
  sub,
  ctaLabel,
  onCta,
  secondary,
  badge = 'Vetted by top tech recruiters',
  matchScore = 96,
}: {
  headline: React.ReactNode;
  sub: React.ReactNode;
  ctaLabel: string;
  onCta: () => void;
  secondary?: React.ReactNode;
  badge?: string;
  targetRole?: string;
  targetCompany?: string;
  matchScore?: number;
}) {
  return (
    <PublicVisualCta
      badge={badge}
      headline={headline}
      sub={sub}
      ctaLabel={ctaLabel}
      onCta={onCta}
      secondary={secondary}
      score={matchScore}
    />
  );
}
