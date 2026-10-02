import React from 'react';
import { Check } from 'lucide-react';

interface JobRoleItem {
  title: string;
  highlighted?: boolean;
}

const ROW_1: JobRoleItem[] = [
  { title: 'Full Stack Developer', highlighted: true },
  { title: 'Frontend Engineer' },
  { title: 'Product Designer' },
  { title: 'AI Engineer', highlighted: true },
  { title: 'DevOps Engineer' },
  { title: 'Data Engineer' },
  { title: 'Solutions Architect' },
  { title: 'Growth Product Manager', highlighted: true },
  { title: 'Site Reliability Engineer' },
  { title: 'React Specialist' },
];

const ROW_2: JobRoleItem[] = [
  { title: 'Backend Engineer' },
  { title: 'DevOps Engineer' },
  { title: 'Data Scientist', highlighted: true },
  { title: 'Cloud Architect' },
  { title: 'QA Engineer' },
  { title: 'Machine Learning Engineer', highlighted: true },
  { title: 'Engineering Manager' },
  { title: 'Cybersecurity Analyst' },
  { title: 'Technical Program Manager', highlighted: true },
  { title: 'Platform Engineer' },
];

const ROW_3: JobRoleItem[] = [
  { title: 'Mobile Developer' },
  { title: 'Security Engineer' },
  { title: 'UX Researcher' },
  { title: 'ML Engineer' },
  { title: 'iOS Developer', highlighted: true },
  { title: 'Android Engineer' },
  { title: 'Blockchain Developer' },
  { title: 'NLP Specialist', highlighted: true },
  { title: 'Infrastructure Engineer' },
  { title: 'Systems Architect' },
];

function RolePill({ item }: { item: JobRoleItem }) {
  if (item.highlighted) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-brand-dark font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-neutral-200/80 shrink-0 transition-transform duration-200 hover:scale-105 cursor-default">
        <span className="w-4 h-4 rounded-full bg-brand-dark text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Check size={10} strokeWidth={3} />
        </span>
        <span className="whitespace-nowrap tracking-tight">{item.title}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neutral-200/60 text-neutral-600 font-medium text-xs sm:text-sm border border-neutral-300/40 shrink-0 transition-all duration-200 hover:bg-neutral-200/90 hover:text-neutral-800 cursor-default">
      <span className="w-4 h-4 rounded-full bg-neutral-300/80 text-neutral-500 flex items-center justify-center shrink-0">
        <Check size={10} strokeWidth={2.5} />
      </span>
      <span className="whitespace-nowrap tracking-tight">{item.title}</span>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  duration = '40s',
}: {
  items: JobRoleItem[];
  reverse?: boolean;
  duration?: string;
}) {
  const loopItems = [...items, ...items, ...items, ...items];

  return (
    <div className="flex overflow-hidden py-1 select-none">
      <div
        className={`flex items-center gap-2.5 sm:gap-3 shrink-0 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } will-change-transform`}
        style={{ animationDuration: duration }}
      >
        {loopItems.map((item, idx) => (
          <RolePill key={`${item.title}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function JobRolesMarquee({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden py-2 sm:py-4 ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 56px, black calc(100% - 56px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 56px, black calc(100% - 56px), transparent 100%)',
      }}
    >
      <div className="flex flex-col gap-2.5 sm:gap-3.5">
        <MarqueeRow items={ROW_1} reverse={false} duration="42s" />
        <MarqueeRow items={ROW_2} reverse={true} duration="48s" />
        <MarqueeRow items={ROW_3} reverse={false} duration="38s" />
      </div>
    </div>
  );
}
