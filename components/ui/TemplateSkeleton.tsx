import React, { useState, useEffect } from 'react';
import { useHydrating } from '../../contexts/HydrationContext';

/**
 * Realistic Resume Preview Skeleton that mimics an actual A4 resume sheet
 * with headers, sections, bullet points, and skill badges.
 */
export function ResumePreviewSkeleton({
  scale,
  className = '',
}: {
  scale?: number;
  className?: string;
}) {
  const content = (
    <div
      className={`w-[210mm] min-h-[297mm] bg-white p-12 text-left shadow-xs rounded-xs flex flex-col justify-between pointer-events-none select-none ${className}`}
      style={{ boxSizing: 'border-box' }}
      aria-hidden="true"
    >
      <div>
        {/* Header Section */}
        <div className="border-b border-gray-200/80 pb-6 mb-6">
          {/* Candidate Name */}
          <div className="h-9 w-64 rounded-md skeleton-shimmer mb-3" />
          {/* Target Job Title */}
          <div className="h-4.5 w-44 rounded skeleton-shimmer mb-4" />
          {/* Contact Details Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-3 w-36 rounded skeleton-shimmer" />
            <div className="h-3 w-28 rounded skeleton-shimmer" />
            <div className="h-3 w-32 rounded skeleton-shimmer" />
            <div className="h-3 w-24 rounded skeleton-shimmer" />
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-32 rounded skeleton-shimmer" />
            <div className="h-[1.5px] flex-1 bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded skeleton-shimmer" />
            <div className="h-3 w-[94%] rounded skeleton-shimmer" />
            <div className="h-3 w-[78%] rounded skeleton-shimmer" />
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-40 rounded skeleton-shimmer" />
            <div className="h-[1.5px] flex-1 bg-gray-200" />
          </div>

          {/* Job 1 */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <div className="h-3.5 w-52 rounded skeleton-shimmer" />
              <div className="h-3 w-28 rounded skeleton-shimmer" />
            </div>
            <div className="h-3 w-40 rounded skeleton-shimmer mb-2.5 opacity-80" />
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <div className="h-2.5 w-[96%] rounded skeleton-shimmer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <div className="h-2.5 w-[90%] rounded skeleton-shimmer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <div className="h-2.5 w-[82%] rounded skeleton-shimmer" />
              </div>
            </div>
          </div>

          {/* Job 2 */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="h-3.5 w-48 rounded skeleton-shimmer" />
              <div className="h-3 w-28 rounded skeleton-shimmer" />
            </div>
            <div className="h-3 w-36 rounded skeleton-shimmer mb-2.5 opacity-80" />
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <div className="h-2.5 w-[92%] rounded skeleton-shimmer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <div className="h-2.5 w-[85%] rounded skeleton-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-32 rounded skeleton-shimmer" />
            <div className="h-[1.5px] flex-1 bg-gray-200" />
          </div>
          <div className="flex justify-between items-center mb-1">
            <div className="h-3.5 w-60 rounded skeleton-shimmer" />
            <div className="h-3 w-24 rounded skeleton-shimmer" />
          </div>
          <div className="h-3 w-48 rounded skeleton-shimmer opacity-80" />
        </div>

        {/* Skills Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-28 rounded skeleton-shimmer" />
            <div className="h-[1.5px] flex-1 bg-gray-200" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[72, 88, 64, 96, 80, 68, 84, 76, 92].map((width, idx) => (
              <div
                key={idx}
                className="h-6 rounded-md skeleton-shimmer"
                style={{ width: `${width}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer subtle brand mark skeleton */}
      <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
        <div className="h-2 w-28 rounded skeleton-shimmer opacity-60" />
        <div className="h-2 w-16 rounded skeleton-shimmer opacity-60" />
      </div>
    </div>
  );

  if (scale !== undefined) {
    return (
      <div className="w-[210mm] origin-top transform pointer-events-none select-none shadow-xs rounded-xs bg-white" style={{ transform: `scale(${scale})` }}>
        {content}
      </div>
    );
  }

  return content;
}

/**
 * A single template card skeleton matching the exact dashboard card geometry.
 */
export function TemplateCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`group bg-[#EEF1F4] rounded-[24px] border border-gray-200/80 p-3 sm:p-3.5 flex flex-col pointer-events-none select-none ${className}`}
      aria-busy="true"
      aria-label="Loading template"
    >
      {/* Top Card Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        {/* Name / Category Pill */}
        <div className="h-6 w-24 sm:w-28 rounded-full skeleton-shimmer" />
        {/* Action / Badge Circle */}
        <div className="w-6 h-6 rounded-full skeleton-shimmer shrink-0" />
      </div>

      {/* Inner White Preview Canvas */}
      <div className="relative w-full aspect-[4/3] bg-white rounded-xl border border-gray-200/70 overflow-hidden shadow-2xs flex items-center justify-center">
        <div className="absolute inset-0 flex items-start justify-center pt-2 overflow-hidden pointer-events-none select-none">
          <div className="w-[210mm] origin-top transform scale-[0.27] sm:scale-[0.29] pointer-events-none select-none shadow-xs rounded-xs bg-white">
            <ResumePreviewSkeleton />
          </div>
        </div>
      </div>

      {/* Bottom Subtitle Line */}
      <div className="mt-2 px-1 flex items-center justify-between">
        <div className="h-3.5 w-28 rounded skeleton-shimmer" />
        <div className="h-3 w-10 rounded skeleton-shimmer shrink-0 ml-2" />
      </div>
    </div>
  );
}

/**
 * Grid of template skeleton cards for loading states.
 */
export function TemplateGridSkeleton({
  count = 8,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <TemplateCardSkeleton key={idx} />
      ))}
    </div>
  );
}

/**
 * Smooth transition wrapper for the inner preview canvas of live template cards.
 * Renders the realistic ResumePreviewSkeleton initially and gracefully fades in
 * the rendered ResumePreview once the browser has mounted it.
 */
export function TemplateCardPreviewCanvas({
  children,
  overlay,
  scaleClass = 'scale-[0.27] sm:scale-[0.29]',
}: {
  children: React.ReactNode;
  overlay?: React.ReactNode;
  scaleClass?: string;
}) {
  const hydrating = useHydrating();
  // Prerendered HTML already contains the live preview, so hydration must start
  // there too instead of flashing the skeleton back in.
  const prerendering =
    typeof window !== 'undefined' && (window as any).__PRERENDER_HYDRATION__ === true;
  const [isRendered, setIsRendered] = useState(hydrating || prerendering);

  useEffect(() => {
    if (isRendered) return;
    // Reveal real template preview on next render frame to eliminate blank flashes
    const timer = requestAnimationFrame(() => {
      setIsRendered(true);
    });
    return () => cancelAnimationFrame(timer);
  }, [isRendered]);

  return (
    <div data-resume-preview className="relative w-full aspect-[4/3] bg-white rounded-xl border border-gray-200/70 overflow-hidden shadow-2xs flex items-center justify-center">
      {/* Background / Initial Skeleton */}
      <div
        className={`absolute inset-0 flex items-start justify-center pt-2 overflow-hidden pointer-events-none select-none transition-opacity duration-300 ${
          isRendered ? 'opacity-0 pointer-events-none' : 'opacity-100 z-0'
        }`}
      >
        <div className={`w-[210mm] origin-top transform ${scaleClass} pointer-events-none select-none shadow-xs rounded-xs bg-white`}>
          <ResumePreviewSkeleton />
        </div>
      </div>

      {/* Live Scaled Resume Preview */}
      <div
        className={`absolute inset-0 flex items-start justify-center pt-2 overflow-hidden pointer-events-none select-none transition-opacity duration-300 ${
          isRendered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={`w-[210mm] origin-top transform ${scaleClass} pointer-events-none select-none shadow-xs rounded-xs bg-white`}>
          {children}
        </div>
      </div>

      {/* Optional Hover Overlay */}
      {overlay}
    </div>
  );
}

/**
 * Full page / modal skeleton for Quick View or full screen previews.
 */
export function ResumeModalSkeleton() {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white rounded-lg shadow-2xl p-12 select-none animate-fadeIn">
      <ResumePreviewSkeleton />
    </div>
  );
}
