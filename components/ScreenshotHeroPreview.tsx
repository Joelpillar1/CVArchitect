import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from './Editor';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { useToast } from '../contexts/ToastContext';
import { JPN_SARAH_JENKINS_DATA } from '../pages/ScreenshotEditorPage';

const DESKTOP_BASE_WIDTH = 1728;
const DESKTOP_BASE_HEIGHT = 920;

export default function ScreenshotHeroPreview() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.8);

  // Load Sarah Jenkins JPN Resume data directly (matching /screenshot)
  const [resumeData, setResumeDataState] = useState<ResumeData>(JPN_SARAH_JENKINS_DATA);
  const [selectedTemplate, setSelectedTemplateState] = useState<TemplateType>('apex');

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      if (!containerRef.current) return;
      const currentWidth = containerRef.current.clientWidth;
      if (currentWidth > 0) {
        setScale(currentWidth / DESKTOP_BASE_WIDTH);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const proSubscription: UserSubscription = {
    id: 'screenshot_sub',
    userId: 'screenshot_user',
    planId: 'lifetime',
    status: 'active',
    credits: 999999,
    maxResumes: 999,
    unlimitedTailoring: true,
    currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3650).toISOString(),
  };

  const setResumeData = useCallback((data: ResumeData | ((prev: ResumeData) => ResumeData)) => {
    setResumeDataState((prev) => {
      return typeof data === 'function' ? data(prev) : data;
    });
  }, []);

  const setSelectedTemplate = useCallback((template: TemplateType | ((prev: TemplateType) => TemplateType)) => {
    setSelectedTemplateState((prev) => {
      return typeof template === 'function' ? template(prev) : template;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-hidden bg-brand-bg text-brand-dark select-none pointer-events-none cursor-default"
      style={{ height: `${DESKTOP_BASE_HEIGHT * scale}px` }}
    >
      <div
        className="origin-top-left absolute top-0 left-0 pointer-events-none"
        style={{
          width: `${DESKTOP_BASE_WIDTH}px`,
          height: `${DESKTOP_BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
        }}
      >
        <Editor
          data={resumeData}
          onChange={() => {}}
          template={selectedTemplate}
          onTemplateChange={() => {}}
          onBack={() => {}}
          onSave={() => {}}
          onSaveAsTemplate={() => {}}
          userSubscription={proSubscription}
          onAIAction={() => false}
          onShowPaywall={() => {}}
          embedded={true}
          leftSidebarWidthClass="w-80"
          rightSidebarWidthClass="w-96"
        />
      </div>
    </div>
  );
}
