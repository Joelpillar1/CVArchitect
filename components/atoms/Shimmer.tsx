import React from 'react';

interface ShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export function Shimmer({ children, className = '' }: ShimmerProps) {
  return (
    <span className={`inline-block text-slate-200 animate-pulse ${className}`}>
      {children}
    </span>
  );
}
