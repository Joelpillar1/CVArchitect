import React from 'react';
import type { CostBar } from '../utils/comparisonDeepData';

function formatUsd(value: number): string {
  const rounded = Math.round(value);
  return `$${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Original, data-driven 12-month cost chart. Static markup with no animation,
 * so it renders identically during prerender and hydration.
 */
export default function CompareCostChart({
  bars,
  caption,
}: {
  bars: CostBar[];
  caption?: string;
}) {
  const max = Math.max(...bars.map((bar) => bar.amount));
  const label = `Bar chart of the cheapest paid cost over 12 months: ${bars
    .map((bar) => `${bar.name} ${formatUsd(bar.amount)}`)
    .join(', ')}.`;

  return (
    <figure className="rounded-2xl border border-brand-border bg-white p-5 sm:p-7">
      <div className="space-y-3.5" role="img" aria-label={label}>
        {bars.map((bar) => {
          const pct = Math.max(5, Math.round((bar.amount / max) * 100));
          return (
            <div key={bar.name} className="grid grid-cols-[104px_1fr_64px] sm:grid-cols-[140px_1fr_80px] items-center gap-3">
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  bar.us ? 'text-brand-dark' : 'text-brand-dark/60'
                }`}
              >
                {bar.name}
              </span>
              <span className="h-5 sm:h-6 overflow-hidden rounded-full bg-brand-bg">
                <span
                  className={`block h-full rounded-full ${bar.us ? 'bg-brand-green' : 'bg-brand-dark/25'}`}
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span
                className={`text-right text-xs sm:text-sm font-bold ${
                  bar.us ? 'text-brand-dark' : 'text-brand-dark/55'
                }`}
              >
                {formatUsd(bar.amount)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
        {bars.map((bar) => (
          <span key={bar.name} className="text-[11px] text-brand-dark/45">
            {`${bar.name}: ${bar.note}`}
          </span>
        ))}
      </div>
      {caption ? (
        <figcaption className="mt-4 border-t border-brand-border pt-4 text-xs leading-relaxed text-brand-dark/50">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
