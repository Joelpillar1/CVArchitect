import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "../../lib/ease";
import { cn } from "../../lib/utils";

export interface AgentDisclosureProps {
  id?: string;
  role?: string;
  "aria-labelledby"?: string;
  open: boolean;
  openHeight?: number;
  children: React.ReactNode;
  className?: string;
}

export function AgentDisclosure({
  id,
  role = "region",
  "aria-labelledby": ariaLabelledby,
  open,
  children,
  className,
}: AgentDisclosureProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          role={role}
          aria-labelledby={ariaLabelledby}
          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={
            reduce
              ? { duration: 0.15 }
              : { duration: 0.28, ease: EASE_OUT }
          }
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
