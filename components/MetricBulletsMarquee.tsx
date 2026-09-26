import React from 'react';
import { BadgeCheck } from 'lucide-react';

export const MARKEE_BULLETS_1 = [
  "Launched 5 social media campaigns, reaching 150,000 total impressions and generating 3,200 new leads.",
  "Increased email newsletter subscriptions by 4,500 in 3 months through targeted campaigns and A/B testing.",
  "Managed product backlog of 200+ tasks, coordinating with 5 engineers to release 3 major features on schedule.",
  "Developed 3 backend services handling 50,000+ requests per day with 99.9% uptime.",
  "Designed and delivered 45 pages of web and app interfaces in 10 weeks, ensuring brand consistency.",
  "Managed a marketing budget of $75,000, achieving a 12% reduction in costs while maximizing ROI."
];

export const MARKEE_BULLETS_2 = [
  "Conducted user testing sessions with 60 participants, producing actionable insights that reduced onboarding time by 20%.",
  "Optimized query performance, reducing API response time from 1.8s to 0.4s across 50 endpoints.",
  "Redesigned checkout flow for web app, reducing cart abandonment by 18%.",
  "Implemented SEO strategy for 15 pages, increasing organic traffic by 18,000 visitors in 4 months.",
  "Built automated testing framework reducing regression testing time by 70% for 12 modules.",
  "Led UI/UX design for mobile app used by 25,000+ users, improving task completion time by 15%."
];

// Re-writing highlightMetrics with a more reliable approach
export const HighlightedText = ({ text }: { text: string }) => {
  // Use non-capturing groups (?:...) for sub-patterns to avoid duplicate entries in the split array
  const greenPattern = /\d+(?:,\d{3})*(?:\.\d+)?%|\d+(?:,\d{3})*(?:\.\d+)?\s*(?:leads|impressions|visitors|views|reduction|growth|increase|decrease)/gi;
  const darkPattern = /\$?\d+(?:,\d{3})*(?:\.\d+)?(?!\s%(?:leads|impressions|visitors|views))|\d+\+?\s*(?:tasks|engineers|features|articles|months|years|units|users|participants|requests|endpoints|modules)/gi;

  // Combine with a single outer capturing group for the split
  const combinedPattern = new RegExp(`(${greenPattern.source}|${darkPattern.source})`, 'gi');
  const parts = text.split(combinedPattern);

  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;

        // Test against the source patterns without global flags for precision
        if (new RegExp(`^${greenPattern.source}$`, 'i').test(part)) {
          return <span key={i} className="text-[#5CD685] font-extrabold">{part}</span>;
        }
        if (new RegExp(`^${darkPattern.source}$`, 'i').test(part)) {
          return <span key={i} className="text-brand-dark font-extrabold">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
      <BadgeCheck size={16} className="text-[#5CD685] fill-[#5CD685]/10 inline-block ml-1 align-text-bottom shrink-0" />
    </span>
  );
};

interface MetricBulletsMarqueeProps {
  /** Tailwind gradient classes for the left/right fade masks, default matches white page backgrounds. */
  fadeClass?: string;
  /** Direction of the scroll. Defaults to reverse (moves right), matching the landing page. */
  reverse?: boolean;
  /** Optional className for each bullet card (e.g. custom width/border). */
  cardClassName?: string;
}

/**
 * Infinite horizontal marquee of metric-driven achievement bullet cards.
 * Used on the landing page (under the editor frame) and the /agent page
 * (under the live workspace frame).
 */
export default function MetricBulletsMarquee({
  fadeClass = 'from-white via-white/80 to-transparent',
  reverse = true,
  cardClassName = '',
}: MetricBulletsMarqueeProps) {
  const bullets = [...MARKEE_BULLETS_1, ...MARKEE_BULLETS_2, ...MARKEE_BULLETS_1, ...MARKEE_BULLETS_2];

  return (
    <div className="relative w-full overflow-hidden py-4">
      <div className={`absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r ${fadeClass} z-10 pointer-events-none`}></div>
      <div className={`absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l ${fadeClass} z-10 pointer-events-none`}></div>

      <div className={`flex ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} whitespace-nowrap will-change-transform`}>
        {bullets.map((bullet, idx) => (
          <div
            key={idx}
            className={`flex-shrink-0 mx-2 px-4 py-3 bg-white border-[3px] border-brand-dark rounded-[20px] shadow-soft hover:shadow-float transition-all duration-300 cursor-default group relative w-[260px] md:w-[320px] ${cardClassName}`}
          >
            <p className="text-gray-700 font-medium whitespace-normal text-xs md:text-sm leading-relaxed">
              <HighlightedText text={bullet} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
