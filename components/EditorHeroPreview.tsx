import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from './Editor';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { TEMPLATE_GALLERY_PREVIEW_DATA } from '../utils/sampleResumeData';
import { useAuth } from '../contexts/AuthContext';

/**
 * Live clone of the /dashboard/editor workspace, rendered in the /agent hero.
 *
 * The real Editor lays its three panes out for a wide desktop window, so dropping
 * it straight into the hero frame (2/3 of the viewport) would squeeze the resume
 * canvas to a sliver. Instead the Editor is rendered at a fixed logical desktop
 * size and the whole thing is scaled down to whatever width the frame has — the
 * same trick the static hero screenshot used, but live and interactive.
 */
const PREVIEW_VIEWPORT_WIDTH = 1728;
const PREVIEW_VIEWPORT_HEIGHT = 1000;

/** Visitor-facing preview subscription. Deliberately the free plan against a
 *  paid template, so every export affordance in the chrome routes to signup
 *  rather than firing a real download of the demo document. */
const PREVIEW_SUBSCRIPTION: UserSubscription = {
  userId: 'preview',
  planId: 'free',
  credits: 1,
  isActive: true,
  usageHistory: [],
};

export default function EditorHeroPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Demo document state — edits stay in memory, nothing is persisted.
  const [data, setData] = useState<ResumeData>(() => ({ ...TEMPLATE_GALLERY_PREVIEW_DATA }));
  const [template, setTemplate] = useState<TemplateType>('vanguard');

  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  // Track the frame's width so the preview always fills it edge to edge.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Never upscale past 1:1 — a blurry blown-up editor reads worse than a
    // smaller, crisp one on ultra-wide displays.
    const measure = () =>
      setScale(Math.min(1, host.clientWidth / PREVIEW_VIEWPORT_WIDTH));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  // Every write action in the preview funnels to the signup flow — the demo
  // document belongs to nobody, so there is nothing to save or export.
  const handleExitToSignup = () => {
    navigate(user ? '/dashboard/editor' : '/signup?redirect=/dashboard/editor');
  };

  return (
    <div
      ref={hostRef}
      className="relative w-full overflow-hidden bg-white"
      style={{ height: PREVIEW_VIEWPORT_HEIGHT * scale }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: PREVIEW_VIEWPORT_WIDTH,
          height: PREVIEW_VIEWPORT_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <Editor
          embedded
          data={data}
          onChange={setData}
          template={template}
          onTemplateChange={setTemplate}
          onBack={handleExitToSignup}
          onSave={handleExitToSignup}
          onSaveAsTemplate={handleExitToSignup}
          currentResumeId={null}
          userSubscription={PREVIEW_SUBSCRIPTION}
          onAIAction={() => {
            handleExitToSignup();
            return false;
          }}
          onShowPaywall={handleExitToSignup}
        />
      </div>
    </div>
  );
}
