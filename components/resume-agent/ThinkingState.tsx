import React, { useMemo } from 'react';
import { ThinkingOrb, type OrbState } from 'thinking-orbs';

export interface ThinkingStateProps {
  variant?: string;
  status?: string;
  isWorking?: boolean;
  jobTitle?: string;
  company?: string;
  customData?: any;
  tasks?: any[];
  onSettled?: () => void;
  className?: string;
  initialExpanded?: boolean;
  size?: 64 | 20;
}

export default function ThinkingState({
  status,
  isWorking = true,
  className = '',
  size = 20,
}: ThinkingStateProps) {
  // Map agent status to ThinkingOrb state
  const orbState: OrbState = useMemo(() => {
    const lower = (status || '').toLowerCase();
    if (lower.includes('analyz') || lower.includes('search') || lower.includes('evaluat')) return 'searching';
    if (lower.includes('tailor') || lower.includes('solv') || lower.includes('optimi')) return 'solving';
    if (lower.includes('writ') || lower.includes('compos') || lower.includes('draft')) return 'composing';
    if (lower.includes('edit') || lower.includes('pars')) return 'working';
    return 'listening';
  }, [status]);

  return (
    <div
      className={`inline-flex flex-row items-center gap-1.5 py-0 px-0 select-none animate-in fade-in duration-150 leading-none ${className}`}
    >
      <div className="shrink-0 flex items-center justify-center -my-0.5">
        <ThinkingOrb state={orbState} size={size} />
      </div>
      <span className="text-[11.5px] font-semibold text-slate-700 tracking-wide leading-none">
        Thinking...
      </span>
    </div>
  );
}
