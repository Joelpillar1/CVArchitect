'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Copy,
  ClipboardPaste,
  Sparkles,
  Maximize2,
  ArrowUp,
  ChevronRight,
  Check,
  X,
  RotateCw,
} from 'lucide-react';
import { Shimmer } from '../atoms/Shimmer';

export type SelectionMode = 'idle' | 'thinking' | 'streaming' | 'result';

interface SelectionActionsToolbarProps {
  selectedText: string;
  suggestedText?: string | null;
  position: { top: number; left: number } | null;
  activeFormats: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    link: boolean;
  };
  onInlineFormat: (formatType: 'bold' | 'italic' | 'underline' | 'link') => void;
  onCopy: () => void;
  onPaste: () => void;
  onRunAction: (actionName: string, customPrompt?: string) => Promise<void>;
  onKeep: () => void;
  onDiscard: () => void;
  onClose: () => void;
  mode: SelectionMode;
  currentAction: string;
}

const iconProps = {
  className: 'w-3.5 h-3.5 shrink-0',
  'aria-hidden': true,
} as const;

const controlClass =
  'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-bold text-white/90 transition-all hover:bg-white/20 hover:text-white active:scale-[0.96] cursor-pointer select-none whitespace-nowrap bg-white/10 border border-white/10';

const iconButtonClass =
  'flex size-7 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white transition-all active:scale-[0.96] cursor-pointer select-none';

const activeIconButtonClass =
  'flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-green text-brand-dark shadow-2xs font-bold transition-all active:scale-[0.96] cursor-pointer select-none';

const primaryClass =
  'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-brand-green px-3 text-[12px] font-bold text-brand-dark shadow-sm transition-all hover:bg-brand-greenHover active:scale-[0.96] cursor-pointer select-none';

/** Custom Figma-style Tooltip Component with downward arrow pointer */
function Tooltip({
  text,
  children,
  className = '',
  disabled = false,
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`relative group/tooltip flex items-center justify-center ${className}`}>
      {children}
      {!disabled && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-150 ease-out transform scale-95 group-hover/tooltip:scale-100 flex flex-col items-center">
          <div className="bg-[#18181b] text-white text-[11px] font-medium px-2.5 py-1 rounded-xl shadow-xl border border-white/10 whitespace-nowrap leading-tight">
            {text}
          </div>
          <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-[#18181b] -mt-[0.5px]" />
        </div>
      )}
    </div>
  );
}

export function SelectionActionsToolbar({
  selectedText,
  suggestedText,
  position,
  activeFormats,
  onInlineFormat,
  onCopy,
  onPaste,
  onRunAction,
  onKeep,
  onDiscard,
  onClose,
  mode,
  currentAction,
}: SelectionActionsToolbarProps) {
  const [prompt, setPrompt] = useState('');
  const [expanded, setExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousModeRef = useRef<SelectionMode>('idle');
  const lastWidthRef = useRef(0);
  const widthAnimationRef = useRef<Animation | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();

    const ro = new ResizeObserver(() => {
      updateDimensions();
    });
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [mode, expanded]);

  /* Intrinsic width handles smooth transition when content changes
   * between idle, loading, expanded and confirmation. */
  useLayoutEffect(() => {
    const bar = barRef.current;
    const content = contentRef.current;
    if (!bar || !content) return;

    const nextWidth = Math.ceil(content.getBoundingClientRect().width) + 12;
    const previousWidth =
      lastWidthRef.current || Math.ceil(bar.getBoundingClientRect().width);

    if (
      previousModeRef.current !== mode &&
      Math.abs(nextWidth - previousWidth) > 1
    ) {
      widthAnimationRef.current?.cancel();
      const animation = bar.animate(
        [
          { width: `${previousWidth}px` },
          { width: `${nextWidth}px` },
        ],
        {
          duration: 260,
          easing: 'cubic-bezier(0.23,1,0.32,1)',
        }
      );
      widthAnimationRef.current = animation;
      animation.onfinish = () => {
        lastWidthRef.current = nextWidth;
        widthAnimationRef.current = null;
      };
    } else {
      lastWidthRef.current = nextWidth;
    }

    previousModeRef.current = mode;
  }, [mode, expanded]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(() => {
      if (widthAnimationRef.current?.playState === 'running') return;
      lastWidthRef.current =
        Math.ceil(content.getBoundingClientRect().width) + 12;
    });
    observer.observe(content);
    return () => {
      observer.disconnect();
      widthAnimationRef.current?.cancel();
    };
  }, []);

  const handleActionClick = (actionName: string) => {
    onRunAction(actionName);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;
    onRunAction('custom', cleanPrompt);
  };

  const busy = mode === 'thinking' || mode === 'streaming';

  const getBusyLabel = (act: string) => {
    switch (act) {
      case 'Improve':
        return 'Improving';
      case 'Expand':
        return 'Expanding';
      default:
        return prompt.trim() ? `Asking Agent "${prompt.trim().slice(0, 15)}..."` : 'Rewriting';
    }
  };

  if (!position) return null;

  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

  const measuredHeight = dimensions.height || (mode === 'result' ? 440 : 42);
  const measuredWidth = dimensions.width || (mode === 'result' ? 420 : 320);

  // Clamp within viewport boundaries so card is never cut off at bottom/top/left/right
  const minTop = 64;
  const maxTop = Math.max(minTop, viewportHeight - measuredHeight - 16);
  const finalTop = Math.min(Math.max(position.top, minTop), maxTop);

  const minLeft = 16;
  const maxLeft = Math.max(minLeft, viewportWidth - measuredWidth - 16);
  const finalLeft = Math.min(Math.max(position.left, minLeft), maxLeft);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: `${finalTop}px`,
        left: `${finalLeft}px`,
        zIndex: 100,
        pointerEvents: 'auto',
      }}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('input') || target.closest('form'))) {
          e.stopPropagation();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* ─────────────────────────────────────────────────────────
       * FLOATING TOOLBAR BAR (App Dark Theme)
       * ───────────────────────────────────────────────────────── */}
      <div
        ref={barRef}
        className="flex min-h-[38px] w-fit max-w-[calc(100vw-32px)] items-center justify-center gap-1.5 overflow-visible rounded-full bg-brand-dark/95 backdrop-blur-xl px-2.5 py-1 font-sans text-white border border-white/15 shadow-[0_16px_40px_rgba(51,60,77,0.35)] animate-pop-in"
      >
        <div
          ref={contentRef}
          className="flex w-fit shrink-0 items-center justify-center gap-1"
        >
          {/* 1. BUSY / THINKING / STREAMING STATE */}
          {busy && (
            <span className="inline-flex h-7 items-center gap-2 whitespace-nowrap px-3 text-[12px] font-medium text-white/80">
              <span
                className="size-3.5 shrink-0 rounded-full border-2 border-white/20 border-t-brand-green"
                style={{ animation: 'spin 700ms linear infinite' }}
              />
              {mode === 'thinking' ? (
                <Shimmer className="text-[12px] font-medium text-white">
                  {getBusyLabel(currentAction)}…
                </Shimmer>
              ) : (
                <span className="text-white">{getBusyLabel(currentAction)}…</span>
              )}
            </span>
          )}

          {/* 2. RESULT BAR SHORTCUTS (Apply / Discard / Try Again) */}
          {mode === 'result' && (
            <>
              <Tooltip text="Apply changes to resume">
                <button
                  type="button"
                  onClick={onKeep}
                  className={primaryClass}
                >
                  <Check {...iconProps} className="w-3.5 h-3.5 text-brand-dark stroke-[2.4]" />
                  Apply Change
                </button>
              </Tooltip>

              <Tooltip text="Discard suggestion">
                <button
                  type="button"
                  onClick={onDiscard}
                  className={controlClass}
                >
                  <X {...iconProps} className="w-3.5 h-3.5 text-white/80 stroke-[2]" />
                  Discard
                </button>
              </Tooltip>

              <span className="mx-0.5 h-3.5 w-px bg-white/15" />

              <Tooltip text="Regenerate suggestion">
                <button
                  type="button"
                  aria-label="Try again"
                  onClick={() => onRunAction(currentAction || 'Improve', prompt)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/20 hover:text-white active:scale-[0.96] cursor-pointer"
                >
                  <RotateCw {...iconProps} className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </>
          )}

          {/* 3. IDLE STATE: Formats + Ask Agent Input + Expandable Actions */}
          {mode === 'idle' && (
            <>
              {/* Rich-Text Formats: Bold, Italic, Underline, Link, Copy, Paste */}
              <div className="flex items-center gap-0.5">
                {/* Bold */}
                <Tooltip text={activeFormats.bold ? 'Remove Bold' : 'Bold'}>
                  <button
                    type="button"
                    onClick={() => onInlineFormat('bold')}
                    className={activeFormats.bold ? activeIconButtonClass : iconButtonClass}
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>

                {/* Italic */}
                <Tooltip text={activeFormats.italic ? 'Remove Italic' : 'Italic'}>
                  <button
                    type="button"
                    onClick={() => onInlineFormat('italic')}
                    className={activeFormats.italic ? activeIconButtonClass : iconButtonClass}
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>

                {/* Underline */}
                <Tooltip text={activeFormats.underline ? 'Remove Underline' : 'Underline'}>
                  <button
                    type="button"
                    onClick={() => onInlineFormat('underline')}
                    className={activeFormats.underline ? activeIconButtonClass : iconButtonClass}
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>

                {/* Link */}
                <Tooltip text={activeFormats.link ? 'Remove Link' : 'Add Link'}>
                  <button
                    type="button"
                    onClick={() => onInlineFormat('link')}
                    className={activeFormats.link ? activeIconButtonClass : iconButtonClass}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>

                <span className="mx-0.5 h-3.5 w-px bg-white/15" />

                {/* Copy */}
                <Tooltip text="Copy text">
                  <button
                    type="button"
                    onClick={onCopy}
                    className={iconButtonClass}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>

                {/* Paste */}
                <Tooltip text="Paste over selection">
                  <button
                    type="button"
                    onClick={onPaste}
                    className={iconButtonClass}
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>

                <span className="mx-1 h-3.5 w-px bg-white/15" />
              </div>

              {/* "Ask Agent" Form with Explicit Send Button */}
              <form
                onSubmit={handlePromptSubmit}
                className="flex items-center bg-white/10 hover:bg-white/15 border border-white/15 focus-within:border-brand-green rounded-full px-1.5 h-7 transition-colors"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  aria-label="Ask Agent"
                  placeholder="Ask Agent..."
                  className="h-full w-28 md:w-36 bg-transparent px-1.5 text-[12px] text-white placeholder:text-white/40 focus:outline-none font-medium cursor-text select-text"
                />
                <Tooltip text="Send instruction">
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-green hover:bg-brand-greenHover text-brand-dark font-bold text-[11px] transition-all disabled:opacity-35 disabled:hover:bg-brand-green cursor-pointer shrink-0 ml-0.5 active:scale-[0.94]"
                  >
                    <span>Send</span>
                    <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </Tooltip>
              </form>

              <span className="mx-0.5 h-3.5 w-px bg-white/15" />

              {/* Expandable Quick Actions: Improve, Expand (revealed on Chevron Arrow click) */}
              <div
                className="flex min-w-0 items-center gap-1 overflow-hidden transition-[max-width,opacity,margin] duration-300"
                style={{
                  maxWidth: expanded ? 220 : 0,
                  opacity: expanded ? 1 : 0,
                  marginLeft: expanded ? 2 : 0,
                  marginRight: expanded ? 2 : 0,
                  transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                {/* Improve */}
                <Tooltip text="Rewrite & improve impact">
                  <button
                    type="button"
                    onClick={() => handleActionClick('Improve')}
                    className={controlClass}
                  >
                    <Sparkles {...iconProps} className="w-3.5 h-3.5 text-brand-green" />
                    Improve
                  </button>
                </Tooltip>

                {/* Expand */}
                <Tooltip text="Expand with more detail">
                  <button
                    type="button"
                    onClick={() => handleActionClick('Expand')}
                    className={controlClass}
                  >
                    <Maximize2 {...iconProps} className="w-3.5 h-3.5 text-white/80" />
                    Expand
                  </button>
                </Tooltip>
              </div>

              {/* Chevron Arrow Toggle */}
              <Tooltip text={expanded ? 'Hide quick actions' : 'Quick actions'}>
                <button
                  type="button"
                  aria-label={expanded ? 'Hide quick actions' : 'Show quick actions'}
                  aria-expanded={expanded}
                  onClick={() => setExpanded((value) => !value)}
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/20 hover:text-white active:scale-[0.96] cursor-pointer ${
                    expanded ? 'bg-white/20 text-brand-green' : ''
                  }`}
                >
                  <span
                    className="flex transition-transform duration-300"
                    style={{
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
                    }}
                  >
                    <ChevronRight {...iconProps} className="w-3.5 h-3.5" />
                  </span>
                </button>
              </Tooltip>

              {/* Close/Dismiss Button */}
              <Tooltip text="Close">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/20 hover:text-white transition-colors cursor-pointer ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
       * SIDE-BY-SIDE / BEFORE & AFTER COMPARISON PERMISSION CARD (App Dark Theme)
       * ───────────────────────────────────────────────────────── */}
      {mode === 'result' && (
        <div className="mt-2 w-[420px] max-w-[calc(100vw-32px)] max-h-[min(540px,calc(100vh-110px))] flex flex-col rounded-2xl bg-brand-dark/95 backdrop-blur-xl border border-white/15 p-4 shadow-[0_16px_40px_rgba(51,60,77,0.35)] text-xs text-white/90 animate-pop-in">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 shrink-0">
            <span className="font-bold text-[13px] text-white">Compare & Review Changes</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30">
              {currentAction === 'Expand' ? 'Expand' : currentAction === 'Improve' ? 'Improve' : 'Custom Edit'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1 custom-scrollbar">
            {/* Original Text (Before) */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                Original (Current)
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs leading-relaxed max-h-28 overflow-y-auto select-text">
                {selectedText}
              </div>
            </div>

            {/* Suggested Text (After) */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-green mb-1">
                Suggested by Agent
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-brand-green/40 text-white text-xs leading-relaxed max-h-36 overflow-y-auto select-text font-normal">
                {suggestedText || 'Generating suggestion...'}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => onRunAction(currentAction || 'Improve', prompt)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDiscard}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={onKeep}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-green hover:bg-brand-greenHover text-brand-dark transition-all shadow-sm active:scale-[0.96] cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Apply to Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
