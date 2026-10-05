'use client';
import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

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

  return (
    <Component
      custom={animationNum}
      initial="hidden"
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
