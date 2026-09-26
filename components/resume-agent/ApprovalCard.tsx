'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Check,
  X,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
 * APPROVAL CARD (human-in-the-loop)
 * One question at a time; elongated pills show progress;
 * the circular arrow up top advances (↑ sends on the last).
 * Choices, paging, and submission are directly controlled.
 * ───────────────────────────────────────────────────────── */

export interface QuestionItem {
  id?: string;
  q: string;
  type?: 'radio' | 'check';
  options: string[];
  requirement?: string;
  reason?: string;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    q: 'How many years of relevant experience do you have with this core stack?',
    type: 'radio',
    options: ['1–2 years (Junior / Mid)', '3–5 years (Mid-Senior)', '6+ years (Lead / Principal)'],
  },
  {
    id: 'q2',
    q: 'Which quantifiable outcomes would you like to highlight in your bullets?',
    type: 'check',
    options: ['Performance / speed improvements', 'Revenue / cost reduction metrics', 'Team leadership & mentoring size'],
  },
  {
    id: 'q3',
    q: 'What is your primary goal for this tailored resume?',
    type: 'radio',
    options: ['Pass strict ATS keyword filters', 'Executive hiring manager impact', 'Career pivot into new industry'],
  },
];

interface ApprovalCardProps {
  questions?: QuestionItem[];
  onSubmitted?: (results: { [questionIndex: number]: { selected: string[]; custom: string } }) => void;
  onAnswerQuestion?: (answerText: string, skip?: boolean) => void;
  onDismiss?: () => void;
  resettable?: boolean;
  theme?: 'dark' | 'light';
}

export default function ApprovalCard({
  questions = DEFAULT_QUESTIONS,
  onSubmitted,
  onAnswerQuestion,
  onDismiss,
  resettable = true,
  theme = 'dark',
}: ApprovalCardProps) {
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [custom, setCustom] = useState<Record<number, string>>({});
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(true);

  const activeQuestions = questions.length > 0 ? questions : DEFAULT_QUESTIONS;
  const currentQuestion = activeQuestions[qi] || activeQuestions[0];
  const questionType = currentQuestion.type || 'radio';
  const isLast = qi === activeQuestions.length - 1;
  const selectedIndices = answers[qi] ?? [];
  const hasAnswer = selectedIndices.length > 0 || Boolean(custom[qi]?.trim());

  const toggleOption = (index: number) => {
    setAnswers((current) => {
      const picked = current[qi] ?? [];
      const next =
        questionType === 'radio'
          ? [index]
          : picked.includes(index)
            ? picked.filter((item) => item !== index)
            : [...picked, index];
      return { ...current, [qi]: next };
    });

    if (questionType === 'radio') {
      setCustom((current) => ({ ...current, [qi]: '' }));
      // single-choice auto-advances
      window.setTimeout(() => {
        if (qi === activeQuestions.length - 1) {
          handleFinalSubmit({ ...answers, [qi]: [index] }, { ...custom, [qi]: '' });
        } else {
          setQi((current) => Math.min(activeQuestions.length - 1, current + 1));
        }
      }, 480);
    }
  };

  const handleFinalSubmit = (
    currentAnswers: Record<number, number[]>,
    currentCustom: Record<number, string>
  ) => {
    setSent(true);
    const results: { [key: number]: { selected: string[]; custom: string } } = {};
    activeQuestions.forEach((q, idx) => {
      const pickedIdxs = currentAnswers[idx] || [];
      const selectedLabels = pickedIdxs.map((i) => q.options[i]).filter(Boolean);
      results[idx] = {
        selected: selectedLabels,
        custom: currentCustom[idx] || '',
      };
    });

    onSubmitted?.(results);

    // Call single answer handler if integrated with AgentPanel
    if (onAnswerQuestion) {
      const formattedAnswers = Object.entries(results)
        .map(([idx, val]) => {
          const qText = activeQuestions[Number(idx)]?.q;
          const ans = [...val.selected, val.custom].filter(Boolean).join(', ');
          return `${qText}: ${ans}`;
        })
        .join(' | ');
      onAnswerQuestion(formattedAnswers);
    }
  };

  const handleReset = () => {
    setQi(0);
    setAnswers({});
    setCustom({});
    setSent(false);
    setOpen(true);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-[12.5px] font-medium text-white shadow-md hover:bg-slate-800 transition-colors cursor-pointer"
      >
        Open Agent Questions
      </button>
    );
  }

  // Once answered, the whole card fires off into a confirmation badge.
  if (sent) {
    return (
      <div
        className="flex w-full max-w-sm items-center gap-3 animate-pop-in"
      >
        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-[12.5px] font-medium text-white shadow-lg">
          <span className="flex size-4.5 items-center justify-center rounded-full bg-brand-green text-brand-dark">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
          <span className="text-brand-green font-semibold">Answers sent to Agent</span>
        </span>
        {resettable && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[12px] font-medium text-slate-400 transition-colors duration-150 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Start over</span>
          </button>
        )}
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className="flex min-h-[196px] w-full max-w-sm flex-col items-stretch">
      <div
        className={`w-full self-start overflow-hidden rounded-xl border shadow-2xl transition-all duration-200 ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}
      >
        <div key={qi} className="p-4 animate-pop-in">
          {/* Header Row: Question + Dismiss */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              {currentQuestion.requirement && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-green" />
                  {currentQuestion.requirement}
                </span>
              )}
              <span className="text-[13px] font-bold leading-snug">
                {currentQuestion.q}
              </span>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => {
                setOpen(false);
                onDismiss?.();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Context Reason if provided */}
          {currentQuestion.reason && (
            <p className="mt-1 text-[11px] text-slate-400 italic">
              {currentQuestion.reason}
            </p>
          )}

          {/* Options List */}
          <div className="mt-3 flex flex-col gap-1.5">
            {currentQuestion.options.map((option, i) => {
              const on = selectedIndices.includes(i);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleOption(i)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors duration-150 cursor-pointer border ${
                    on
                      ? 'bg-slate-800 border-brand-green/50 text-white shadow-xs'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center transition-all duration-150 ${
                      questionType === 'radio' ? 'rounded-full' : 'rounded-[4px]'
                    } ${
                      on
                        ? 'bg-brand-green text-brand-dark border border-brand-green'
                        : 'border border-slate-600 bg-slate-800 text-transparent'
                    }`}
                  >
                    {questionType === 'radio' ? (
                      <span
                        className="size-1.5 rounded-full bg-brand-dark transition-transform duration-150"
                        style={{ transform: on ? 'scale(1)' : 'scale(0)' }}
                      />
                    ) : (
                      <Check className="w-3 h-3 stroke-[3]" />
                    )}
                  </span>
                  <span className={`text-[12.5px] leading-snug ${on ? 'font-semibold text-white' : 'font-normal text-slate-300'}`}>
                    {option}
                  </span>
                </button>
              );
            })}

            {/* Custom Write-in Field */}
            <div className="mt-0.5 flex items-center gap-2 rounded-lg bg-slate-800/60 border border-slate-700/80 focus-within:border-brand-green/70 px-2.5 py-1.5 transition-colors">
              <input
                value={custom[qi] ?? ''}
                onChange={(event) => {
                  setCustom((cur) => ({ ...cur, [qi]: event.target.value }));
                  if (questionType === 'radio') {
                    setAnswers((cur) => ({ ...cur, [qi]: [] }));
                  }
                }}
                placeholder="Type custom answer…"
                aria-label="Custom answer"
                className="min-w-0 flex-1 bg-transparent text-[12.5px] text-white outline-none placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Footer: Pager navigation + Send arrow button */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              type="button"
              aria-label="Previous"
              disabled={qi === 0 || sent}
              onClick={() => setQi((current) => Math.max(0, current - 1))}
              className="flex size-6 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Ring / Dot Indicators */}
            <div className="flex items-center gap-1.5">
              {activeQuestions.map((_, i) => {
                const isCurrent = i === qi && !sent;
                const isPast = sent || i < qi;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to question ${i + 1}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    disabled={sent}
                    onClick={() => setQi(i)}
                    className="transition-all duration-200 cursor-pointer disabled:cursor-default"
                    style={{
                      width: isCurrent ? 14 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: isCurrent
                        ? '#70E098'
                        : isPast
                          ? '#94A3B8'
                          : '#475569',
                    }}
                  />
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              aria-label="Next"
              disabled={isLast || sent}
              onClick={() => setQi((current) => Math.min(activeQuestions.length - 1, current + 1))}
              className="flex size-6 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action / Send Arrow Button */}
          {!sent && (
            <button
              type="button"
              aria-label={isLast ? 'Send answers' : 'Next question'}
              disabled={!hasAnswer}
              onClick={() => {
                if (isLast) {
                  handleFinalSubmit(answers, custom);
                } else {
                  setQi((current) => current + 1);
                }
              }}
              className={`flex size-7 items-center justify-center rounded-lg transition-all duration-150 cursor-pointer ${
                hasAnswer
                  ? 'bg-brand-green hover:bg-brand-greenHover text-brand-dark font-bold shadow-sm active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
              title={isLast ? 'Submit answers to agent' : 'Next question'}
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
