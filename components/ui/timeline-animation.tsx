'use client';
import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useHydrating } from '../../contexts/HydrationContext';

interface TimelineContentProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'p' | 'span' | 'article' | 'section' | 'header';
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: Variants;
  children?: React.ReactNode;
}

export function TimelineContent({
  as = 'div',
  animationNum = 0,
  customVariants,
  children,
  className,
  ...props
}: TimelineContentProps) {
  const Component = (motion as any)[as] || motion.div;
  const hydrating = useHydrating();
  const prerendering =
    typeof window !== 'undefined' && (window as any).__PRERENDER_HYDRATION__ === true;

  return (
    <Component
      custom={animationNum}
      initial={hydrating || prerendering ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={customVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}
