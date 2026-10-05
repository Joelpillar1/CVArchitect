import React, { useState, useRef, useEffect } from 'react';
import Editor from './Editor';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { JPN_SARAH_JENKINS_DATA } from '../pages/ScreenshotEditorPage';
import { BorderBeam } from 'border-beam';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronLeft,
  Pencil,
  Save,
  Download,
  ChevronDown,
  MessageSquare,
  FileText,
  History,
  Trash2,
  Sparkles,
  Target,
  Zap,
  Plus,
  ArrowUp,
  Edit3,
  Monitor,
} from 'lucide-react';

const DESKTOP_BASE_WIDTH = 1728;
const DESKTOP_BASE_HEIGHT = 920;

const STREAMING_PLACEHOLDERS = [
  'Paste a job description to scan ATS compatibility...',
  'Paste Senior Product Designer requirements at Stripe...',
  'Paste requirements to reveal missing keywords & skills...',
  'Paste job description to tailor Google XYZ impact bullets...',
];

export default function EditorHeroPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.8);

  // State for mobile interactive chat
  const [inputText, setInputText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [streamingPlaceholder, setStreamingPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Sarah Jenkins JPN Resume data directly
  const [resumeData] = useState<ResumeData>(JPN_SARAH_JENKINS_DATA);
  const [selectedTemplate] = useState<TemplateType>('apex');

  // Typewriter effect for streaming placeholder
  useEffect(() => {
    const currentTarget = STREAMING_PLACEHOLDERS[placeholderIndex];
    let timer: number;

    if (!isDeleting && streamingPlaceholder.length < currentTarget.length) {
      timer = window.setTimeout(() => {
        setStreamingPlaceholder(currentTarget.slice(0, streamingPlaceholder.length + 1));
      }, 40);
    } else if (!isDeleting && streamingPlaceholder.length === currentTarget.length) {
      timer = window.setTimeout(() => {
        setIsDeleting(true);
      }, 2400);
    } else if (isDeleting && streamingPlaceholder.length > 0) {
      timer = window.setTimeout(() => {
        setStreamingPlaceholder(currentTarget.slice(0, streamingPlaceholder.length - 1));
      }, 20);
    } else if (isDeleting && streamingPlaceholder.length === 0) {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % STREAMING_PLACEHOLDERS.length);
    }

    return () => clearTimeout(timer);
  }, [streamingPlaceholder, isDeleting, placeholderIndex]);

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

  const handleAction = () => {
    navigate(user ? '/dashboard' : '/signup?redirect=/dashboard');
  };

  const proSubscription: UserSubscription = {
    id: 'hero_preview_sub',
    userId: 'hero_preview_user',
    planId: 'lifetime',
    status: 'active',
    credits: 999999,
    maxResumes: 999,
    unlimitedTailoring: true,
    currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3650).toISOString(),
  };

  return (
    <div className="w-full relative overflow-hidden bg-white text-neutral-900 select-none">
      {/* ─── Mobile View (< md): Real App Component Structure from EditorSidebarRight ─── */}
      <div className="block md:hidden bg-white font-sans text-left">
        {/* 1. Top Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-neutral-200/80 bg-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAction}
              className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              <ChevronLeft size={19} className="stroke-[2.5]" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-neutral-900 tracking-tight">JPN Resume</span>
              <Pencil size={13} className="text-neutral-400 stroke-[2]" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAction}
              className="p-1.5 rounded-xl border border-neutral-200 text-neutral-600 bg-white shadow-2xs hover:bg-neutral-50"
            >
              <Save size={15} />
            </button>
            <button
              type="button"
              onClick={handleAction}
              className="flex items-center bg-brand-green hover:bg-brand-greenHover text-brand-dark rounded-xl px-2.5 py-1.5 font-bold text-xs shadow-2xs transition-colors"
            >
              <Download size={14} className="stroke-[2.5]" />
              <div className="w-[1px] h-3.5 bg-brand-dark/20 mx-1.5" />
              <ChevronDown size={13} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 2. Sub-Navigation Tabs */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-200/80 bg-white text-xs">
          <div className="flex items-center gap-1">
            <div className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white shadow-2xs flex items-center gap-1.5 font-bold text-neutral-900">
              <MessageSquare size={13} className="text-neutral-800" />
              <span>CHAT</span>
            </div>

            <div className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium text-neutral-500 hover:text-neutral-800">
              <FileText size={13} className="text-neutral-400" />
              <span>CONTEXT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium text-neutral-500 hover:text-neutral-800">
              <History size={13} className="text-neutral-400" />
              <span>HISTORY</span>
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-medium"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        </div>

        {/* 3. Messages / Instruction Body */}
        <div className="p-3.5 space-y-3 bg-[#FAFBFB]">
          {/* Welcome Instruction Card (matching EditorSidebarRight) */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="border-b border-neutral-100 pb-3">
              <h4 className="font-bold text-xs text-neutral-900 leading-tight">
                Paste a Job Description to Begin
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                Paste any job posting or requirements into the chat to scan ATS compatibility, reveal keyword gaps, and tailor your resume.
              </p>
            </div>

            {/* Core Features */}
            <div className="space-y-2 pt-0.5">
              <div className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>CORE FEATURES</span>
              </div>
              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    <Target className="w-3 h-3" />
                  </span>
                  <span className="text-[11px]">
                    <strong className="text-neutral-900">ATS Keyword Gap Analysis:</strong> Real-time scan comparing your profile to target job postings.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    <Zap className="w-3 h-3" />
                  </span>
                  <span className="text-[11px]">
                    <strong className="text-neutral-900">Google XYZ Impact Bullets:</strong> Proven formula transforming tasks into quantifiable achievements.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-purple-100">
                    <Sparkles className="w-3 h-3" />
                  </span>
                  <span className="text-[11px]">
                    <strong className="text-neutral-900">1-Click AI Tailor & Sync:</strong> Instant section-by-section alignment with live preview.
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Profile Summary Snippet */}
            <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Profile: <strong className="text-neutral-800">Sarah Jenkins</strong></span>
              <span>3 roles • 9 skills</span>
            </div>
          </div>

          {/* 4. Chat Input Box with BorderBeam (extracted directly from EditorSidebarRight) */}
          <div className="relative">
            <BorderBeam
              size="md"
              theme="light"
              borderRadius={16}
              strength={0.75}
              duration={4}
              className="rounded-2xl shadow-2xs outline-none"
            >
              <div className="relative border border-neutral-200 rounded-2xl p-2.5 bg-white transition-colors focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200/40 outline-none overflow-hidden">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={streamingPlaceholder || 'Paste job description...'}
                  rows={2}
                  className="w-full px-2 py-1 text-xs text-neutral-900 placeholder:text-neutral-400 border-none outline-none focus:outline-none focus:ring-0 resize-none bg-transparent min-w-0 break-words relative z-10 custom-scrollbar transition-all duration-150"
                />

                <div className="flex items-center justify-between pt-1 relative z-10 border-t border-neutral-100 mt-1">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAction}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      inputText.trim()
                        ? 'bg-brand-green hover:bg-brand-greenHover text-brand-dark cursor-pointer shadow-xs border border-brand-green/60'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200/50'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </BorderBeam>
          </div>
        </div>

        {/* 5. Bottom App Tab Navigation Bar */}
        <div className="grid grid-cols-3 border-t border-neutral-200/80 bg-white py-2 px-4 text-center">
          <button
            type="button"
            onClick={handleAction}
            className="flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-700"
          >
            <Edit3 size={17} />
            <span className="text-[10px] font-medium">Editor</span>
          </button>

          <button
            type="button"
            onClick={handleAction}
            className="flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-700"
          >
            <Monitor size={17} />
            <span className="text-[10px] font-medium">Preview</span>
          </button>

          <button
            type="button"
            onClick={handleAction}
            className="flex flex-col items-center gap-1 text-emerald-600 font-bold"
          >
            <Target size={17} />
            <span className="text-[10px]">Job Match</span>
          </button>
        </div>
      </div>

      {/* ─── Desktop View (>= md): Full Desktop Editor Scale ─── */}
      <div
        ref={containerRef}
        className="hidden md:block w-full relative overflow-hidden pointer-events-none cursor-default bg-brand-bg"
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
    </div>
  );
}
