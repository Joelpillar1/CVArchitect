import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPRING_SWAP } from "../../lib/ease";

export interface ActionSwapRollTextProps {
  value: string | number;
  children: React.ReactNode;
  className?: string;
}

export function ActionSwapRollText({
  value,
  children,
  className,
}: ActionSwapRollTextProps) {
  return (
    <span className="relative inline-flex overflow-hidden tabular-nums align-baseline">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={String(value)}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={SPRING_SWAP}
          className={className}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
