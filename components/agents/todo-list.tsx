import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown, ListTodo } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ActionSwapRollText } from "../motion/action-swap-roll";
import { AgentDisclosure } from "./agent-disclosure";
import {
  EASE_OUT,
  SPRING_LAYOUT,
  SPRING_SWAP,
} from "../../lib/ease";
import { cn } from "../../lib/utils";

export type TodoItemStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface TodoItem {
  id: string;
  title: ReactNode;
  status?: TodoItemStatus;
  progress?: number;
  detail?: ReactNode;
}

export interface TodoListProps {
  items: TodoItem[];
  title?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapseOnComplete?: boolean;
  maxHeight?: number;
  className?: string;
}

function statusLabel(status: TodoItemStatus) {
  if (status === "in-progress") return "In progress";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
}

function TodoHeaderIcon({ complete }: { complete: boolean }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <span
      aria-hidden="true"
      className="relative grid size-5 shrink-0 place-items-center"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {complete ? (
          <motion.svg
            key="complete"
            viewBox="0 0 24 24"
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : SPRING_SWAP}
            className="absolute size-4.5 overflow-visible text-emerald-500"
          >
            <circle cx="12" cy="12" r="9" fill="currentColor" />
            <motion.path
              d="M7.5 12.25 10.5 15.25 16.75 8.75"
              fill="none"
              stroke="white"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.24, ease: EASE_OUT }
              }
            />
          </motion.svg>
        ) : (
          <motion.span
            key="todo"
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.72 }}
            transition={reduce ? { duration: 0 } : SPRING_SWAP}
            className="absolute grid place-items-center text-muted-foreground"
          >
            <ListTodo className="size-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function TodoStatusIcon({
  status,
  progress,
}: {
  status: TodoItemStatus;
  progress?: number;
}) {
  if (status === "in-progress") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mx-0.5 size-4 shrink-0 animate-spin text-brand-dark overflow-visible"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.2"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeDasharray="20 40"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (status === "completed") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mx-0.5 size-4 shrink-0 overflow-visible text-emerald-600"
      >
        <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7.5 12.25 10.5 15.25 16.75 8.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === "cancelled") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mx-0.5 size-4 shrink-0 overflow-visible text-rose-600 dark:text-rose-400"
      >
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="mx-0.5 size-4 shrink-0 overflow-visible text-gray-400"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TodoList({
  items,
  title = "Thinking Process",
  open,
  defaultOpen = true,
  onOpenChange,
  collapseOnComplete = true,
  maxHeight = 248,
  className,
}: TodoListProps) {
  const reduce = useReducedMotion() ?? false;
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
  const viewportRef = useRef<HTMLDivElement>(null);
  const previousComplete = useRef(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentOpen = open ?? internalOpen;
  const completed = items.filter((item) => item.status === "completed").length;
  const allComplete = items.length > 0 && completed === items.length;
  const itemCount = items.length;

  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );

  useEffect(() => {
    if (previousComplete.current && !allComplete) {
      setOpen(true);
    }
    if (!previousComplete.current && allComplete && collapseOnComplete) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
    previousComplete.current = allComplete;
  }, [allComplete, collapseOnComplete, setOpen]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || itemCount === 0) return;

    const frame = requestAnimationFrame(() => {
      if (viewport.scrollHeight <= viewport.clientHeight) return;
      if (typeof viewport.scrollTo === "function") {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: reduce ? "auto" : "smooth",
        });
      } else {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [itemCount, reduce]);

  return (
    <section
      aria-label="Agent task list"
      className={cn(
        "w-full overflow-hidden rounded-xl border border-brand-border bg-white shadow-xs",
        className,
      )}
    >
      <button
        id={triggerId}
        type="button"
        aria-expanded={currentOpen}
        aria-controls={contentId}
        onClick={() => setOpen(!currentOpen)}
        className="group flex h-9 w-full items-center gap-2 rounded-xl px-3 text-left outline-none transition-colors hover:bg-black/[0.02]"
      >
        <TodoHeaderIcon complete={allComplete} />
        <h4 className="min-w-0 flex-1 truncate text-xs font-semibold text-brand-dark">
          {title}
        </h4>
        <span
          className={cn(
            "shrink-0 text-[11px] font-medium tabular-nums text-muted-foreground",
            allComplete && "text-emerald-600 font-semibold",
          )}
        >
          <span className="sr-only">
            {completed} of {items.length} tasks completed
          </span>
          <span aria-hidden="true" className="inline-flex items-center gap-0.5">
            <ActionSwapRollText value={String(completed)}>
              {completed}
            </ActionSwapRollText>
            <span>/</span>
            <span>{items.length}</span>
          </span>
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: currentOpen ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING_SWAP}
          className="text-muted-foreground/60 transition-colors group-hover:text-brand-dark"
        >
          <ChevronDown className="size-3.5" />
        </motion.span>
      </button>

      <AgentDisclosure
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        open={currentOpen}
      >
        <div
          ref={viewportRef}
          className="scrollbar-hide overflow-y-auto px-2 pb-2"
          style={{ maxHeight }}
        >
          {items.length ? (
            <ol aria-live="polite" className="space-y-0.5">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => {
                  const status = item.status ?? "pending";
                  return (
                    <motion.li
                      layout="position"
                      key={item.id}
                      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -2 }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : {
                              opacity: { duration: 0.18, ease: EASE_OUT },
                              y: SPRING_LAYOUT,
                              layout: SPRING_LAYOUT,
                            }
                      }
                      className="flex min-h-7 items-center gap-2 rounded-lg px-1.5 py-0.5 text-xs"
                    >
                      <TodoStatusIcon status={status} progress={item.progress} />
                      <span className="sr-only">{statusLabel(status)}: </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-xs leading-4",
                          status === "pending" && "text-muted-foreground/70",
                          status === "in-progress" && "text-brand-dark font-medium",
                          status === "completed" && "text-muted-foreground/60 line-through decoration-brand-dark/50",
                          status === "cancelled" && "text-muted-foreground/50",
                        )}
                      >
                        {item.title}
                      </span>
                      {item.detail ? (
                        <span className="shrink-0 text-[10px] text-muted-foreground/55 font-mono">
                          {item.detail}
                        </span>
                      ) : null}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          ) : (
            <p className="px-1.5 py-1 text-xs text-muted-foreground">
              No tasks yet
            </p>
          )}
        </div>
      </AgentDisclosure>
    </section>
  );
}
