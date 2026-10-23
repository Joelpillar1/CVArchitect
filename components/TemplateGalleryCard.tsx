import React, { useEffect, useMemo, useRef, useState } from 'react';
import ResumePreview from './ResumePreview';
import { TemplateCardPreviewCanvas } from './ui/TemplateSkeleton';
import { TEMPLATE_CONFIG, getTemplateCategory } from '../utils/templateConfig';
import { getTemplatePreviewData } from '../utils/sampleResumeData';
import { useHydrating } from '../contexts/HydrationContext';
import type { ResumeData } from '../types';

export type TemplateItem = (typeof TEMPLATE_CONFIG)[number];

/**
 * Shared gallery card for /resume-templates and the role-specific template
 * pages. The preview mounts only once the card approaches the viewport, which
 * keeps a 40-card gallery from rendering 40 full resumes on first paint.
 */
type TemplateGalleryCardProps = {
  template: TemplateItem;
  index: number;
  onUse: () => void;
  anchorId?: string;
  /** Role-specific sample content for role landing pages. */
  rolePreview?: ResumeData;
};

export const TemplateGalleryCard: React.FC<TemplateGalleryCardProps> = ({
  template,
  index,
  onUse,
  anchorId,
  rolePreview,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hydrating = useHydrating();
  const prerendering =
    typeof window !== 'undefined' && (window as any).__PRERENDER_HYDRATION__ === true;
  const [visible, setVisible] = useState(hydrating || prerendering);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    // Fallback so previews always mount, even if the observer never reports.
    const fallback = window.setTimeout(() => setVisible(true), 1500 + index * 60);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [visible, index]);

  const previewData = useMemo(() => {
    if (rolePreview) {
      return { ...rolePreview, font: 'Merriweather, serif' };
    }
    return { ...getTemplatePreviewData(template.id), font: 'Merriweather, serif' };
  }, [template.id, rolePreview]);

  return (
    <div
      id={anchorId}
      ref={ref}
      className="group flex flex-col rounded-xl border border-brand-border bg-white p-3 transition-shadow hover:shadow-md cursor-pointer scroll-mt-28"
      onClick={onUse}
    >
      <div className="relative overflow-hidden rounded-lg">
        {visible ? (
          <TemplateCardPreviewCanvas scaleClass="scale-[0.47] sm:scale-[0.32] lg:scale-[0.34] xl:scale-[0.40]">
            <ResumePreview data={previewData} template={template.id} editable={false} />
          </TemplateCardPreviewCanvas>
        ) : (
          <div className="aspect-[4/3] w-full rounded-lg bg-brand-secondary" />
        )}

        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-brand-dark/0 p-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:bg-brand-dark/25 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUse();
            }}
            className="w-full rounded-lg bg-brand-green px-3 py-2 text-xs font-bold text-brand-dark shadow-lg transition-colors hover:bg-brand-greenHover cursor-pointer"
          >
            Use this template
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-brand-dark">{template.name}</h3>
          <p className="mt-0.5 truncate text-[11px] text-brand-dark/45">{getTemplateCategory(template)}</p>
        </div>
      </div>
    </div>
  );
};
