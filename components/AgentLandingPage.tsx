import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, type Variants } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowUp,
  FileCheck,
  X,
  Loader2,
  ShieldCheck,
  Gauge,
  GitBranch,
  Repeat,
  TrendingUp,
  Server,
  PenTool,
  Wallet,
  Users,
  Zap,
  ShoppingCart,
  BarChart3,
  Check,
  Plus
} from 'lucide-react';
import { BorderBeam } from 'border-beam';
import { useAuth } from '../contexts/AuthContext';
import SEO from './SEO';
import PublicFooter from './PublicFooter';
import ResumeAgentPage, { normalizeResumeData } from '../pages/ResumeAgentPage';
import { parseResume } from '../utils/resumeParser';
import { ResumeData, INITIAL_DATA, createEmptyResume } from '../types';
import { PLANS, PAID_PLAN_FEATURES, FOUNDATION_FEATURES, formatPlanPrice } from '../utils/pricingConfig';
import { setPendingCheckoutPlan } from '../utils/pendingCheckout';
import { PlanId } from '../types/pricing';
import { useStreamingPlaceholder } from '../utils/useStreamingPlaceholder';
import { HighlightedText } from './MetricBulletsMarquee';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

/* Animated stat counter — fires once when scrolled into view. */
function Counter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay((value * eased).toFixed(decimals));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* Section label — the mono uppercase eyebrow used across Serro-style sections. */
/* Pill-shaped section badge — a colored chip with a short section name, followed
   by a descriptive phrase, matching the app theme (green chip, white pill, navy
   text). Replaces the old mono SectionLabel eyebrow. */
function SectionBadge({ chip, children }: { chip: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 py-1 pl-1 pr-4 sm:pr-5 rounded-full bg-white border border-brand-green/50 shadow-sm">
      <span className="px-3 py-1 rounded-full bg-brand-green text-brand-dark font-bold text-[11px] sm:text-xs uppercase tracking-wider">
        {chip}
      </span>
      <span className="text-sm font-semibold text-brand-dark">{children}</span>
    </span>
  );
}

/* Two vertical bounding hairlines at the workspace frame's left/right edges
   (1/6 and 5/6 of the viewport). Rendered as the first child of each section so
   they paint ABOVE the section background but BELOW the section content (which
   carries `relative z-10`). */
function VerticalBoundLines() {
  return (
    <div
      className="absolute inset-y-0 left-[calc(100vw/6)] right-[calc(100vw/6)] pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 left-0 w-px bg-brand-border" />
      <div className="absolute inset-y-0 right-0 w-px bg-brand-border" />
    </div>
  );
}

/* Animated progress bar — fills from0% to its target width when scrolled into
   view. Uses framer-motion's useInView + CSS transitions for a smooth ease-out fill. */
function AnimatedProgressBar({ pct, tone = 'bg-brand-green' }: { pct: number; tone?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="w-full bg-brand-border rounded-full overflow-hidden h-2.5">
      <div
        className={`h-full ${tone} rounded-full transition-all duration-[1400ms] ease-out`}
        style={{ width: inView ? `${pct}%` : '0%' }}
      />
    </div>
  );
}

/* Stagger-reveal wrapper for the bento grid cards. Each card fades in and
   slides up with a slight stagger relative to its siblings. */
const bentoCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

/* Small hand-built diagnostic module shown beside each system in the Core
   Features section. Each one is a miniature product UI — hairline box, mono
   labels, one green accent — that illustrates what that system actually does,
   echoing the diagnostic language of the Problem section panels. */
function SystemModule({ module }: { module: string }) {
  if (module === 'engine') {
    return (
      <div className="w-full bg-brand-bg border border-brand-border">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-brand-border">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/85">Evidence trace</span>
          <span className="font-mono text-xs uppercase tracking-widest text-brand-green">Verified</span>
        </div>
        <div className="p-4 flex flex-col gap-2.5">
          {[
            { label: 'Figma', src: 'Product Designer, Acme' },
            { label: 'Design systems', src: 'JD requirement #3' },
            { label: '18% activation lift', src: 'Bullet rewrite' },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2 font-mono text-xs text-brand-dark/85">
              <FileCheck size={13} className="text-brand-green shrink-0" />
              {row.label}
              <span className="ml-auto text-[11px] text-brand-dark/60">{row.src}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (module === 'loop') {
    return (
      <div className="w-full bg-brand-bg border border-brand-border p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/85">Tailoring loop</span>
          <Repeat size={15} className="text-brand-green" />
        </div>
        <div className="flex items-center gap-2">
          <span className="flex-1 text-center border border-brand-border bg-white px-2 py-2 font-mono text-xs uppercase tracking-widest text-brand-dark/85">JD in</span>
          <ArrowRight size={13} className="text-brand-green shrink-0" />
          <span className="flex-1 text-center border border-brand-border bg-white px-2 py-2 font-mono text-xs uppercase tracking-widest text-brand-dark/85">Tailored</span>
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-brand-dark/65">Re-run per posting</p>
      </div>
    );
  }
  if (module === 'controls') {
    return (
      <div className="w-full bg-brand-bg border border-brand-border p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/85">Grounding threshold</span>
          <span className="font-mono text-xs font-semibold text-brand-dark/85">95%</span>
        </div>
        <div className="relative h-1.5 bg-brand-border">
          <div className="absolute inset-y-0 left-0 w-[95%] bg-brand-green" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[95%] w-[3px] h-3 bg-brand-dark -translate-x-1/2" />
        </div>
        <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-brand-dark/65">
          <ShieldCheck size={13} className="text-brand-green shrink-0" /> Below threshold → blocked
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-brand-bg border border-brand-border p-4">
      <div className="flex items-end justify-between mb-3">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/85 pb-1">ATS match</span>
        <span className="text-4xl font-bold tracking-[-0.03em] text-brand-dark leading-none">88%</span>
      </div>
      <div className="h-1.5 bg-brand-border">
        <div className="h-full w-[88%] bg-brand-green" />
      </div>
      <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-brand-dark/65">
        <Gauge size={13} className="text-brand-green shrink-0" /> Workday · Taleo · Lever · Greenhouse
      </div>
    </div>
  );
}

export default function AgentLandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for hero interactive prompt box
  const [promptInput, setPromptInput] = useState('');
  const streamingPlaceholder = useStreamingPlaceholder();

  // Direct resume upload (native file picker, no modal)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stagedResume, setStagedResume] = useState<{ data: ResumeData; fileName: string } | null>(null);

  // Persona tabs (Serro-style 01/02/03/04)
  const [activePersona, setActivePersona] = useState(0);

  // FAQ accordion — first question open by default
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // The embedded /resume-agent iframe bootstraps the moment it mounts and would
  // consume any one-shot handoff keys left over from a previous session (auto-firing
  // an agent analysis). Clear them on mount so the hero preview stays inert until the
  // visitor actually uses the hero input card.
  useEffect(() => {
    try {
      localStorage.removeItem('cv_architect_agent_handoff');
      localStorage.removeItem('cv_architect_initial_prompt');
    } catch (err) {
      console.warn('LocalStorage cleanup error:', err);
    }
  }, []);

  // Stage the typed request + attached resume for the agent, then navigate in.
  // We set a one-shot `handoff` flag the agent page reads on entry so it knows to
  // render the extracted resume and auto-process the request (see ResumeAgentPage).
  const stageHandoffAndGo = (text: string) => {
    try {
      if (text.trim()) {
        localStorage.setItem('cv_architect_initial_prompt', text.trim());
      } else {
        localStorage.removeItem('cv_architect_initial_prompt');
      }

      if (stagedResume) {
        // Fresh upload: carry it in and mark the handoff as an upload so the agent
        // keeps it as the working document instead of loading the saved resume.
        const cleanTitle = stagedResume.fileName ? stagedResume.fileName.replace(/\.[^/.]+$/, '').trim() : '';
        localStorage.setItem('cv_architect_agent_resume_data', JSON.stringify(stagedResume.data));
        if (cleanTitle) {
          localStorage.setItem('cv_architect_agent_resume_title', cleanTitle);
        }
        localStorage.setItem('cv_architect_agent_handoff', 'upload');
      } else {
        // No upload: clear any stale staged resume; the agent loads the saved one.
        localStorage.removeItem('cv_architect_agent_resume_data');
        localStorage.removeItem('cv_architect_agent_resume_title');
        localStorage.setItem('cv_architect_agent_handoff', 'prompt');
      }
    } catch (err) {
      console.warn('LocalStorage write error:', err);
    }

    if (user) {
      navigate('/resume-agent');
    } else {
      navigate('/signup?redirect=/resume-agent');
    }
  };

  const handleLaunchAgent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() && !stagedResume) return;
    stageHandoffAndGo(promptInput);
  };

  const scrollToHowItWorks = () => {
    document.getElementById('howitworks')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Plan CTA — the free plan routes to signup/dashboard; paid plans persist the
  // pending checkout plan and route to signup, which resumes the Dodo checkout.
  const handlePlanClick = (planId: string) => {
    if (planId === 'free') {
      navigate(user ? '/dashboard' : '/signup');
      return;
    }
    setPendingCheckoutPlan(planId as PlanId);
    navigate(`/signup?plan=${planId}`);
  };

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so choosing the same file again still fires onChange
    e.target.value = '';
    if (!file) return;

    // Parsing requires an authenticated session (ai-generate rejects anonymous calls).
    // Route signed-out visitors to sign up first, preserving their typed prompt.
    if (!user) {
      stageHandoffAndGo(promptInput);
      return;
    }

    setUploadError(null);
    setStagedResume(null);
    setIsParsingResume(true);

    const startedAt = performance.now();
    try {
      const parsedPartial = await parseResume(file);
      const elapsedMs = Math.round(performance.now() - startedAt);
      console.log(`[resume-parse] TOTAL "${file.name}" → ${elapsedMs}ms (${(elapsedMs / 1000).toFixed(1)}s)`);
      const mergedData: ResumeData = normalizeResumeData(parsedPartial);
      // Attach the resume and stay on the page — the user still needs to type instructions
      setStagedResume({ data: mergedData, fileName: file.name });
      setIsParsingResume(false);
    } catch (err: any) {
      console.error('Error parsing uploaded resume:', err);
      setIsParsingResume(false);
      setUploadError(err?.message || 'Could not read that file. Try another PDF or DOCX.');
    }
  };

  const handleTriggerUpload = () => {
    // Resume parsing runs through the authenticated ai-generate function, so signed-out
    // visitors are routed to sign up first (their typed prompt is carried along) rather
    // than opening a picker only to have the parse rejected.
    if (!user) {
      stageHandoffAndGo(promptInput);
      return;
    }
    fileInputRef.current?.click();
  };

  const personas = [
    {
      num: '01',
      name: 'Recent Grad',
      title: 'Turn potential into proof',
      desc: 'Coursework, internships, and projects become interview-ready bullets. The agent frames limited experience honestly and powerfully — no fluff, no filler.',
      evidence: 'Grounded in: 6 projects · 2 internships · 1 thesis',
      workflow: [
        { tag: 'Frame', text: 'Coursework and internships become interview-ready bullets — no fluff, no filler.' },
        { tag: 'Ground', text: 'Every claim traces to a project, a grade, or a task you actually completed.' },
        { tag: 'Output', text: 'A first-job resume that survives entry-level ATS screening.' },
      ],
    },
    {
      num: '02',
      name: 'Career Switcher',
      title: 'Reframe what you already know',
      desc: 'Transferable skills get re-framed against a new field without fabricating titles. The agent bridges the gap with grounded evidence from adjacent roles.',
      evidence: 'Grounded in: 4 adjacent roles · 9 transferable skills',
      workflow: [
        { tag: 'Frame', text: 'Transferable skills are re-framed against the new field — without fabricating titles.' },
        { tag: 'Ground', text: 'The bridge is built on grounded evidence from your adjacent roles.' },
        { tag: 'Output', text: 'A resume that reads native to the new industry, not like a transplant.' },
      ],
    },
    {
      num: '03',
      name: 'Senior Professional',
      title: 'Quantify impact, cut the noise',
      desc: 'Years of accumulated bullets get stripped into an achievement-led story. Sharp, metric-first writing that survives senior-level screening.',
      evidence: 'Grounded in: 12 years · 41 quantified bullets',
      workflow: [
        { tag: 'Frame', text: 'Years of bullets are stripped into an achievement-led story.' },
        { tag: 'Ground', text: 'Metric-first writing grounded in your actual numbers — never padded.' },
        { tag: 'Output', text: 'Sharp copy that survives senior-level screening.' },
      ],
    },
    {
      num: '04',
      name: 'Executive',
      title: 'Narrate leadership scope',
      desc: 'Team size, P&L, board visibility, and strategic wins positioned for the top of the funnel. A narrative that reads like the hire you are.',
      evidence: 'Grounded in: P&L ownership · 3 board reports · 40+ reports',
      workflow: [
        { tag: 'Frame', text: 'Team size, P&L, and board visibility are positioned at the top of the funnel.' },
        { tag: 'Ground', text: 'Strategic wins trace to real outcomes you owned.' },
        { tag: 'Output', text: 'A narrative that reads like the hire you are.' },
      ],
    },
  ];

  const faqs = [
    {
      q: 'Is everything the agent writes really grounded?',
      a: 'Yes. Every suggested edit must trace back to a real role, skill, or number in your history. Anything that cannot be grounded is blocked — nothing is invented, padded, or hallucinated.',
    },
    {
      q: 'Do I need a paid plan to use the Resume Agent?',
      a: 'No. The Foundation plan includes one free AI-tailored resume with a full download. Paid plans unlock unlimited tailoring, every template, and unlimited exports.',
    },
    {
      q: 'Which resume templates can the agent work with?',
      a: 'The agent works from the resume you upload and can output it in any template in the workspace — including the ATS-tuned templates in the marquee above.',
    },
    {
      q: 'What file formats can I upload?',
      a: 'PDF and DOCX. Your career history is read and structured in seconds, and every edit is grounded in what was actually in the file you uploaded.',
    },
    {
      q: 'Can I keep multiple tailored versions?',
      a: 'Yes. Paid plans support multiple versions, so you can keep one grounded source of truth and spin tailored variants for each job without drift.',
    },
    {
      q: 'What happens to my data?',
      a: 'Your resume powers your tailoring only. Nothing is shared, nothing is trained on, and you stay in control of every edit before you export.',
    },
  ];

  const howItWorks = [
    {
      num: '01',
      title: 'Connect your resume',
      desc: 'Upload a PDF or DOCX. Your full career history — roles, bullet points, skills, education — is read and structured in seconds.',
    },
    {
      num: '02',
      title: 'It finds the gap',
      desc: 'Paste any job description. The agent extracts the exact requirements, keywords, and screening criteria recruiters actually use.',
    },
    {
      num: '03',
      title: 'Every bullet gets grounded',
      desc: 'Suggested edits are verified against your real history. The agent only rephrases what you have truly done — zero hallucinated roles or skills.',
    },
    {
      num: '04',
      title: 'Ask, tailor, apply',
      desc: 'Generate a tailored resume, watch the ATS match score update in real time, and export a polished PDF ready to submit.',
    },
  ];

  const coreSystems = [
    {
      num: '01',
      module: 'engine',
      title: 'Grounded Evidence Engine',
      desc: 'Every rewritten bullet traces back to a real role in your history. Nothing is invented, nothing is padded.',
    },
    {
      num: '02',
      module: 'loop',
      title: 'JD Tailoring Loop',
      desc: 'Each posting gets its own pass: keywords, seniority signals, and achievement framing mapped onto your real experience.',
    },
    {
      num: '03',
      module: 'controls',
      title: 'Zero-Hallucination Controls',
      desc: 'A strict confidence threshold blocks any suggestion that cannot be grounded. Quality over keyword volume.',
    },
    {
      num: '04',
      module: 'analytics',
      title: 'ATS Match Analytics',
      desc: 'Score your resume against Workday, Taleo, Lever, and Greenhouse parsing rules before you hit submit.',
    },
  ];

  // Problem section — serro-style composition. Four large cards in a 2×2
  // grid; each carries a number, an uppercase label, a headline, and a
  // floating diagnostic panel that overlaps the card edge asymmetrically
  // (the panel reads as a piece of a resume-analysis UI for that problem).
  const problems = [
    {
      num: '01/',
      label: 'The skills problem',
      headline: "You're not showing\nthe skills employers\nare looking for.",
      panel: 'skills',
    },
    {
      num: '02/',
      label: 'The impact problem',
      headline: 'Your experience\ndescribes work.\nNot results.',
      panel: 'impact',
    },
    {
      num: '03/',
      label: 'The job match problem',
      headline: "Your resume\ndoesn't match\nthe job.",
      panel: 'match',
    },
    {
      num: '04/',
      label: 'The positioning problem',
      headline: 'Good experience\ncan still be\npoorly presented.',
      panel: 'readiness',
    },
  ];

  const groundedExamples = [
    {
      icon: TrendingUp,
      title: 'Email growth',
      desc: 'Increased email newsletter subscriptions by 4,500 in 3 months through targeted campaigns and A/B testing.',
    },
    {
      icon: GitBranch,
      title: 'Product delivery',
      desc: 'Managed a product backlog of 200+ tasks, coordinating with 5 engineers to release 3 major features on schedule.',
    },
    {
      icon: Server,
      title: 'Backend reliability',
      desc: 'Developed 3 backend services handling 50,000+ requests per day with 99.9% uptime.',
    },
    {
      icon: PenTool,
      title: 'Design output',
      desc: 'Designed and delivered 45 pages of web and app interfaces in 10 weeks, ensuring brand consistency.',
    },
    {
      icon: Wallet,
      title: 'Budget control',
      desc: 'Managed a marketing budget of $75,000, achieving a 12% reduction in costs while maximizing ROI.',
    },
    {
      icon: Users,
      title: 'User research',
      desc: 'Conducted user testing with 60 participants, reducing onboarding time by 20% with actionable insights.',
    },
    {
      icon: Zap,
      title: 'Performance',
      desc: 'Optimized query performance, cutting API response time from 1.8s to 0.4s across 50 endpoints.',
    },
    {
      icon: ShoppingCart,
      title: 'Conversion',
      desc: 'Redesigned the checkout flow, reducing cart abandonment by 18%.',
    },
    {
      icon: BarChart3,
      title: 'Organic reach',
      desc: 'Implemented SEO across 15 pages, growing organic traffic by 18,000 visitors in 4 months.',
    },
  ];

  const marqueeWords = ['Tailor', 'Ground', 'Score', 'Export', 'Apply', 'Interview'];

  // Resume template screenshots from /public/images/Agent Resume — the same
  // templates offered in the Resume Agent workspace.
  const templateImages = [
    '/images/Agent Resume/Template.png',
    '/images/Agent Resume/Template-1.png',
    '/images/Agent Resume/Template-2.png',
    '/images/Agent Resume/Template-3.png',
  ];

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-green selection:text-brand-dark overflow-x-hidden">
      <SEO
        title="CVArchitect AI Resume Agent — Turn Job Postings into Precision AI Resumes"
        description="Autonomous AI Agent middleware for job seekers. Analyze job descriptions, bridge skill gaps with grounded evidence, and optimize ATS scores automatically."
        canonicalPath="/agent"
      />

      {/* NAV — logo, centered links, dark Launch Agent CTA */}
      <header className="sticky top-0 z-40 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center p-1 shadow-sm">
              <img src="/images/logo icon.png" alt="CVArchitect Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-brand-dark">CVArchitect</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={scrollToHowItWorks} className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark transition-colors">How it works</button>
            <button onClick={() => navigate('/blog')} className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark transition-colors">Resources</button>
            <a href="#usecases" className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark transition-colors">Use case</a>
            <a href="#features" className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark transition-colors">Pricing</a>
          </nav>

          <button
            onClick={() => stageHandoffAndGo('')}
            className="px-4 py-2 rounded-xl bg-brand-dark hover:bg-brand-dark/90 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <span>Launch Agent</span>
            <ArrowRight className="w-4 h-4 text-brand-green" />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* HERO — badge, oversized headline, input card, product preview over colorful backdrop */}
        <section className="relative pt-12 md:pt-16 overflow-hidden bg-brand-bg">
          {/* Vertical layout grid lines (hero) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(51, 60, 77, 0.05) 1px, transparent 1px)',
              backgroundSize: 'calc(100% / 6) 100%',
            }}
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center"
            >
              {/* Announcement badge */}
              <motion.div variants={fadeInUp} className="mb-8">
                <span className="inline-flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full bg-brand-secondary border border-brand-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  <span className="text-xs sm:text-[13px] font-medium text-brand-dark/80">Introducing Resume Agent 1.0</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-dark/40" />
                </span>
              </motion.div>

              {/* Main Headline — oversized display type, green underline on "any job" */}
              <motion.h1
                variants={fadeInUp}
                className="text-[clamp(1.85rem,4.4vw,4rem)] font-bold tracking-[-0.03em] leading-[0.95] text-brand-dark mb-7 max-w-4xl"
              >
                Tailor your resume
                <br />
                <span className="whitespace-nowrap">
                  to{' '}
                  <span className="underline decoration-brand-green decoration-[6px] underline-offset-[10px]">any job</span> in seconds
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-brand-dark/60 max-w-2xl mx-auto leading-relaxed mb-10 text-balance"
              >
                Every job asks for something different. Resume Agent adapts your resume without inventing experience or stuffing keywords.
              </motion.p>

              {/* Interactive prompt card */}
              <motion.div variants={fadeInUp} className="w-full max-w-2xl mx-auto">
                <BorderBeam size="md" theme="light" borderRadius={16} strength={0.75} className="rounded-2xl shadow-float focus-within:ring-4 focus-within:ring-brand-green/10">
                <form
                  onSubmit={handleLaunchAgent}
                  className="bg-brand-surface rounded-2xl border border-brand-border p-3 sm:p-4 relative transition-all"
                >
                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (promptInput.trim() || stagedResume) {
                          handleLaunchAgent();
                        }
                      }
                    }}
                    placeholder={streamingPlaceholder}
                    className="w-full bg-transparent text-brand-dark text-sm sm:text-base placeholder-brand-dark/40 resize-none outline-none min-h-[56px] font-sans p-1 leading-relaxed"
                    rows={2}
                  />

                  {/* Bottom action bar */}
                  <div className="mt-1 pt-2.5 border-t border-brand-border/70 flex items-center justify-between gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleResumeFileChange}
                      className="hidden"
                    />
                    {stagedResume ? (
                      <div className="inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-lg text-xs font-medium bg-brand-green/10 text-brand-dark border border-brand-green/30 max-w-[70%]">
                        <FileCheck className="w-4 h-4 text-brand-green shrink-0" />
                        <span className="truncate">{stagedResume.fileName}</span>
                        <button
                          type="button"
                          onClick={() => { setStagedResume(null); setUploadError(null); }}
                          aria-label="Remove attached resume"
                          className="p-0.5 rounded-md text-brand-dark/50 hover:text-brand-dark hover:bg-brand-dark/5 transition-colors shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleTriggerUpload}
                        disabled={isParsingResume}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-brand-dark/70 hover:text-brand-dark hover:bg-brand-secondary transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                      >
                        {isParsingResume ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Reading resume…</span>
                          </>
                        ) : (
                          <>
                            <ArrowUp className="w-4 h-4" />
                            <span>Upload Resume</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!promptInput.trim() && !stagedResume}
                      aria-label="Send"
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all ${
                        !promptInput.trim() && !stagedResume
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300/40'
                          : 'bg-brand-dark hover:bg-brand-dark/90 text-white cursor-pointer'
                      }`}
                    >
                      <ArrowUp className={`w-4.5 h-4.5 ${!promptInput.trim() && !stagedResume ? 'text-gray-400' : 'text-brand-green'}`} />
                    </button>
                  </div>

                  {uploadError && (
                    <p className="mt-2 px-2 text-xs text-red-600 text-left">
                      {uploadError}
                    </p>
                  )}
                </form>
                </BorderBeam>
              </motion.div>
            </motion.div>
          </div>

          {/* Product preview — framed live workspace spanning the hero grid lines.
              Width is 2/3 of the viewport, so the frame's left/right edges land
              exactly on the page's 1/6 and 5/6 vertical grid lines. */}
          <div className="relative mt-16 md:mt-24 z-10">
            {/* Top full-width horizontal line — same as the bottom one, resting on the
                frame's top edge. No squares: no vertical bounding lines pass through
                the hero, so there is no cross path here. */}
            <div className="h-px w-full bg-brand-border" />
            <div className="relative rounded-none overflow-hidden bg-white border border-brand-border/80 w-[calc(100vw*(2/3))] mx-auto">
              {/* Top accent hairline */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-green/80 to-transparent" />

              {user ? (
                <div className="h-[560px] sm:h-[620px] overflow-hidden bg-white">
                  {/* The REAL /resume-agent workspace, rendered inline — every
                      function (toolbar, chat, redline review, inline rewrite,
                      save/export) behaves exactly as it does on the route. */}
                  <ResumeAgentPage embedded />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src="/images/agent-app-preview.png"
                    alt="CV Architect Resume Agent — tailored resume preview with AI chat sidebar"
                    className="w-full h-auto block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/45 via-transparent to-transparent flex items-end justify-center pb-6 pointer-events-none">
                    <button
                      onClick={() => navigate('/signup?redirect=/resume-agent')}
                      className="pointer-events-auto inline-flex items-center gap-2 pl-5 pr-4 py-2.5 rounded-full bg-white hover:bg-brand-secondary text-brand-dark text-sm font-bold border border-brand-border shadow-[0_12px_32px_-10px_rgba(51,60,77,0.35)] transition-all"
                    >
                      Sign in to try it live
                      <ArrowRight className="w-4 h-4 text-brand-green" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom full-width horizontal line */}
            <div className="h-px w-full bg-brand-border" />
          </div>
        </section>

        {/* Content column — wraps every section after the hero. Each section renders
            its own pair of vertical hairlines (at the frame's left/right edges, 1/6
            and 5/6 of the viewport) as its first child, so the lines paint under the
            section content but above the section background. */}
        <div className="relative">

        {/* GROUNDED EXAMPLES — 3×3 grid of metric-driven examples. No background of
            its own: the page's global background shows through, and each card is
            separated by 1px hairlines (border-based, so cards stay transparent).
            The bottom horizontal line sits flush at the section edge, so the vertical
            bounding lines stop exactly on it. */}
        <section className="relative pt-16 md:pt-24 overflow-hidden">
          <VerticalBoundLines />

          {/* Heading — top-left, padded to the content column */}
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8 mb-10 lg:mb-12">
            <SectionBadge chip="Grounded examples">Real metrics, zero invention</SectionBadge>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mt-4 text-balance">
              Every rewrite lands on real numbers
            </h2>
            <p className="text-base text-brand-dark/60 mt-4 max-w-2xl">
              The agent rephrases only what you have truly done — here's what grounded, metric-first bullets look like.
            </p>
          </div>

          {/* 3×3 grid — transparent cells separated by 1px hairline borders. The
              cells carry no background (the page's global background shows through)
              and draw border-based dividers via responsive nth-child rules: a right
              border on every cell except the last column and a bottom border on every
              cell except the last row, so only the 1px hairlines between cards remain
              with no outer frame around the grid. The grid is sized to the same
              calc(100vw/6) insets the VerticalBoundLines use (100% - 2 * 100vw/6,
              centered), so its edges — and therefore every horizontal divider —              meet the vertical bounding lines exactly instead of overflowing them.
              A top border on the container draws the horizontal line across the top
              of the first row of cells. */}
          <div className="relative z-10 w-[calc(100%-100vw/3)] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-brand-border">
            {groundedExamples.map((ex) => (
              <div
                key={ex.title}
                className="group p-6 sm:p-8 lg:p-9 flex flex-col cursor-default transition-colors duration-300 border-brand-border hover:bg-white hover:border-brand-green/40 [&:not(:last-child)]:border-b sm:[&:nth-child(-n+7)]:border-b sm:[&:nth-child(8)]:border-b-0 sm:[&:nth-child(odd):nth-child(-n+7)]:border-r lg:[&:nth-child(-n+6)]:border-b lg:[&:nth-child(n+7)]:border-b-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-child(3n):nth-child(-n+6)]:border-r-0"
              >
                <ex.icon className="w-7 h-7 text-brand-dark/60 mb-5 group-hover:text-brand-green group-hover:scale-110 transition-all duration-300" />
                <h3 className="text-sm font-bold tracking-tight text-brand-dark mb-2 group-hover:text-brand-green transition-colors duration-300">{ex.title}</h3>
                <p className="text-sm text-brand-dark/60 leading-relaxed group-hover:text-brand-dark/80 transition-colors duration-300">
                  <HighlightedText text={ex.desc} />
                </p>
              </div>
            ))}
            </div>
          </div>

          {/* Bottom full-width line — flush with the section's bottom edge, so the
              vertical bounding lines stop exactly on it instead of running past. */}
          <div className="h-px w-full bg-brand-border" />
        </section>

        {/* THE PROBLEM — dark section recreating the reference layout: a
            large two-column header, then exactly four large cards in a 2×2
            grid. Each card: large number, uppercase label, headline, and a
            floating diagnostic panel overlapping the card edge asymmetrically. */}
        <section className="relative py-24 md:py-36 bg-brand-dark text-white overflow-hidden border-t border-brand-dark/20">
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header — left heading, right subtitle (reference layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16 lg:mb-20">
              <div className="lg:col-span-8">
                <SectionBadge chip="The problem">Why great candidates get skipped</SectionBadge>
                <h2 className="text-[clamp(2.6rem,6vw,5rem)] font-bold tracking-[-0.03em] leading-[0.95] text-white mt-5 text-balance">
                  The small mistakes
                  <br />
                  that cost you
                  <br />
                  the interview.
                </h2>
              </div>
              <div className="lg:col-span-4 lg:pb-4">
                <p className="text-base text-white/60 leading-relaxed">
                  Your experience may be strong, but the way it's presented can make the difference between getting noticed and getting ignored.
                </p>
              </div>
            </div>

            {/* No squares on this hairline — the dark problem section has no
                vertical bounding lines, so there is no cross path here. */}
            <div className="h-px w-full bg-white/10 mb-12 lg:mb-14" />

            {/* 2×2 grid — four large problem cards (reference composition).
                Each card: large section number, small uppercase label, large
                headline, and a floating diagnostic panel that overlaps the card
                edge asymmetrically. Panels differ per card — skills analysis,
                bullet diagnosis, job-match comparison, readiness scores — and
                sit at different offsets so no two cards are internally identical. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-16 lg:gap-y-20">
              {problems.map((p) => (
                <div
                  key={p.num}
                  className="relative rounded-none bg-white/5 border border-white/10 overflow-visible"
                >

                  {/* Text block — number, label, headline. Sits beside the
                      floating panel on desktop (lg), stacked below it on
                      smaller screens where the panel is too wide to share a row. */}
                  <div className="relative z-10 px-8 sm:px-10 pb-10 sm:pb-12 pt-72 sm:pt-80 lg:pt-10 lg:pl-72 lg:pr-6">
                    <span className="block font-mono text-xs uppercase tracking-[0.2em] text-white/40">{p.label}</span>
                    <h3 className="mt-6 text-[clamp(1.5rem,2.2vw,2rem)] font-bold tracking-[-0.03em] leading-[1.05] text-white whitespace-pre-line">
                      {p.headline}
                    </h3>
                  </div>

                  {/* Floating diagnostic panel — anchored to the top-left corner,
                      overlapping the card edges like a floating window */}
                  <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-60 sm:w-72 rounded-none bg-brand-dark border border-white/15 p-4 sm:p-5">
                    {p.panel === 'skills' && (
                      <>
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Skills analysis</span>
                          <span className="text-[10px] font-bold text-red-400">Low match</span>
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-brand-green mb-2">✓ Present</p>
                        <div className="space-y-2">
                          {['Product Strategy', 'Figma', 'User Research'].map((s) => (
                            <div key={s} className="flex items-center justify-between gap-3 text-sm text-white/85">
                              <span>{s}</span>
                              <span className="text-brand-green text-xs">✓</span>
                            </div>
                          ))}
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-red-400 mt-4 mb-2">× Missing</p>
                        <div className="space-y-2">
                          {['Design Systems', 'Prototyping', 'Stakeholder Management'].map((s) => (
                            <div key={s} className="flex items-center justify-between gap-3 text-sm text-white/60">
                              <span>{s}</span>
                              <span className="text-red-400 text-xs">×</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {p.panel === 'impact' && (
                      <>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-3.5">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5">Diagnosed bullet</p>
                          <p className="text-sm text-white/70 leading-snug">"Designed mobile app screens."</p>
                          <div className="mt-2.5 space-y-1">
                            {['Measurable impact', 'Quantifiable results', 'Business outcome'].map((m) => (
                              <div key={m} className="flex items-center gap-2 text-[11px] text-red-400">
                                <span>×</span>
                                <span>{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-center py-2 text-white/40 text-xs">↓</div>
                        <div className="rounded-lg bg-brand-green/10 border border-brand-green/30 p-3.5">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-brand-green mb-1.5">Rewritten</p>
                          <p className="text-sm text-white/90 leading-snug">"Managed a marketing budget of $75,000, achieving a 12% reduction in costs while maximizing ROI."</p>
                        </div>
                      </>
                    )}
                    {p.panel === 'match' && (
                      <>
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Job requirements</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: 'Product Design', ok: true },
                            { label: 'User Research', ok: true },
                            { label: 'Design Systems', ok: false },
                            { label: 'Prototyping', ok: false },
                            { label: 'SaaS Experience', ok: false },
                          ].map((r) => (
                            <div key={r.label} className="flex items-center justify-between gap-3 text-sm">
                              <span className={r.ok ? 'text-white/85' : 'text-white/55'}>{r.label}</span>
                              <span className={r.ok ? 'text-brand-green text-xs' : 'text-red-400 text-xs'}>{r.ok ? '✓' : '×'}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-end justify-between">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Resume match</span>
                          <span className="text-2xl font-bold tracking-tight text-red-400 leading-none">62%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2.5">
                          <div className="h-full w-[62%] bg-red-400/80 rounded-full" />
                        </div>
                      </>
                    )}
                    {p.panel === 'readiness' && (
                      <>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4">Resume readiness</p>
                        <div className="space-y-3.5">
                          {[
                            { label: 'Resume Clarity', pct: 58, tone: 'bg-white/60' },
                            { label: 'Impact', pct: 42, tone: 'bg-red-400/80' },
                            { label: 'Keyword Match', pct: 64, tone: 'bg-brand-green' },
                            { label: 'ATS Readiness', pct: 71, tone: 'bg-white/60' },
                          ].map((b) => (
                            <div key={b.label}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-white/70">{b.label}</span>
                                <span className="text-xs font-mono text-white/50">{b.pct}%</span>
                              </div>
                              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full ${b.tone} rounded-full`} style={{ width: `${b.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — 4-column numbered grid with 1px dividers */}
        <section id="howitworks" className="relative py-24 md:py-36 bg-brand-bg border-t border-brand-border">
          <VerticalBoundLines />
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <SectionBadge chip="How it works">From resume to tailored in minutes</SectionBadge>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mt-5 text-balance">
                Connect your resume. The agent does the rest.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-border border border-brand-border">
              {howItWorks.map((step) => (
                <div
                  key={step.num}
                  className="p-8 sm:p-10 lg:p-12 bg-white"
                >
                  <span className="block font-mono text-sm font-semibold text-brand-dark/35 mb-10">{step.num}</span>
                  <h3 className="text-2xl font-bold tracking-tight text-brand-dark mb-3">{step.title}</h3>
                  <p className="text-sm text-brand-dark/65 leading-relaxed">{step.desc}</p>
                </div>
              ))}
              </div>
          </div>
        </section>

        {/* RESUME TEMPLATE — the exact resume template used in the
            /resume-agent workspace (Vanguard, the agent's default template),
            rendered from the same data the agent starts with. */}
        <section id="template" className="relative py-24 md:py-36 bg-brand-bg border-t border-brand-border">
          <VerticalBoundLines />
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <SectionBadge chip="Your template">The template the agent works from</SectionBadge>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mt-5 text-balance">
                One clean resume. Tailored for every job.
              </h2>
              <p className="text-base text-brand-dark/60 mt-5">
                The resume templates you'll find in the Resume Agent workspace — each one ATS-tuned and ready to tailor.
              </p>
            </div>

            {/* Template marquee — resume templates scrolling infinitely */}
            <div className="relative w-full overflow-hidden">
              {/* Edge fades */}
              <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-brand-bg via-brand-bg/80 to-transparent z-10 pointer-events-none" />

              <div className="flex animate-marquee w-max hover:[animation-play-state:paused]">
                {[0, 1].map((dup) => (
                  <div key={dup} className="flex shrink-0">
                    {templateImages.map((src, i) => (
                      <div key={`${dup}-${i}`} className="w-[260px] sm:w-[320px] shrink-0 mx-3">
                        <img
                          src={src}
                          alt={`CVArchitect resume template ${i + 1}`}
                          className="w-full h-auto rounded-lg border border-brand-border bg-white shadow-lg"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES — bento grid of the four systems */}
        <section id="features" className="relative py-24 md:py-36 bg-brand-bg border-t border-brand-border">
          <VerticalBoundLines />
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16 lg:mb-20">
              <SectionBadge chip="Core features">The four systems in action</SectionBadge>
              <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mt-5 text-balance">
                The four systems behind every tailored resume
              </h2>
              <p className="text-base text-brand-dark/60 mt-5 max-w-2xl mx-auto">
                Memory holds the facts. Loops drive the tailoring. Controls stop hallucination. Analytics show your match.
              </p>
            </div>

            {/* Bento grid
                Row 1: Grounded Evidence Engine — full width (copy left, module right)
                Row 2: JD Tailoring Loop (1 col) + Zero-Hallucination Controls (2 cols)
                Row 3: ATS Match Analytics — full width (copy left, module right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* ─── Row 1: Grounded Evidence Engine — full width ─── */}
              <motion.div
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={bentoCardVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="lg:col-span-3 bg-white rounded-2xl border border-brand-border overflow-hidden cursor-default"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left: copy */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <span className="block font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/45 font-semibold mb-4">01 — Engine</span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark mb-4">
                      Grounded <em className="not-italic text-brand-green">Evidence</em> Engine
                    </h3>
                    <p className="text-sm sm:text-base text-brand-dark/60 leading-relaxed max-w-md">
                      Every rewritten bullet traces back to a real role in your history. Nothing is invented, nothing is padded. The agent builds a verified evidence trace before touching a single word.
                    </p>
                  </div>
                  {/* Right: diagnostic module — evidence trace */}
                  <div className="bg-brand-bg border-t md:border-t-0 md:border-l border-brand-border p-6 sm:p-8 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/70">Evidence trace</span>
                        <span className="font-mono text-xs uppercase tracking-widest text-brand-green font-semibold">Verified</span>
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                        {[
                          { label: 'Product Designer, Acme', src: 'Figma' },
                          { label: 'JD requirement #3', src: 'Design systems' },
                          { label: 'Bullet rewrite', src: '18% activation lift' },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center gap-2.5">
                            <FileCheck size={14} className="text-brand-green shrink-0" />
                            <span className="text-sm text-brand-dark/80 flex-1 truncate">{row.label}</span>
                            <span className="text-xs text-brand-dark/45 font-mono shrink-0">{row.src}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ─── Row 2 Left: JD Tailoring Loop ─── */}
              <motion.div
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={bentoCardVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="lg:col-span-1 bg-white rounded-2xl border border-brand-border overflow-hidden flex flex-col min-h-[340px] cursor-default"
              >
                <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="block font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/45 font-semibold mb-4">02 — Loop</span>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-dark mb-3">JD Tailoring Loop</h3>
                    <p className="text-sm text-brand-dark/60 leading-relaxed">
                      Each posting gets its own pass: keywords, seniority signals, and achievement framing mapped onto your real experience.
                    </p>
                  </div>
                </div>
                {/* Bottom: flow diagram on brand-bg */}
                <div className="bg-brand-bg border-t border-brand-border p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-center border border-brand-border bg-white px-3 py-3 rounded-lg">
                      <span className="block text-xs font-mono uppercase tracking-widest text-brand-dark/70">JD in</span>
                    </div>
                    <ArrowRight size={16} className="text-brand-green shrink-0" />
                    <div className="flex-1 text-center border border-brand-green/30 bg-brand-green/5 px-3 py-3 rounded-lg">
                      <span className="block text-xs font-mono uppercase tracking-widest text-brand-green font-semibold">Tailored</span>
                    </div>
                  </div>
                  <p className="text-xs font-mono uppercase tracking-widest text-brand-dark/45 text-center mt-3">Re-run per posting</p>
                </div>
              </motion.div>

              {/* ─── Row 2 Right: Zero-Hallucination Controls ─── */}
              <motion.div
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={bentoCardVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="lg:col-span-2 bg-white rounded-2xl border border-brand-border overflow-hidden flex flex-col cursor-default"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 flex-1">
                  {/* Left: copy */}
                  <div className="p-8 sm:p-10 flex flex-col justify-center">
                    <span className="block font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/45 font-semibold mb-4">03 — Controls</span>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-dark mb-3">
                      Zero-Hallucination <em className="not-italic text-brand-green">Controls</em>
                    </h3>
                    <p className="text-sm text-brand-dark/60 leading-relaxed">
                      A strict confidence threshold blocks any suggestion that cannot be grounded. <span className="font-semibold text-brand-dark">Quality over keyword volume.</span>
                    </p>
                  </div>
                  {/* Right: grounding threshold module — fills full height */}
                  <div className="bg-brand-bg border-t sm:border-t-0 sm:border-l border-brand-border p-8 sm:p-10 flex flex-col justify-between gap-6">
                    {/* Threshold bar */}
                    <div className="bg-white rounded-xl border border-brand-border p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/70">Grounding threshold</span>
                        <span className="text-3xl font-bold tracking-[-0.03em] text-brand-dark">95%</span>
                      </div>
                      <AnimatedProgressBar pct={95} />
                    </div>
                    {/* Blocked indicator */}
                    <div className="bg-white rounded-xl border border-brand-border p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck size={18} className="text-brand-green shrink-0" />
                        <span className="text-sm font-semibold text-brand-dark">Below threshold → blocked</span>
                      </div>
                      <div className="space-y-2.5">
                        {[{ status: 'ok', text: 'Rewrote bullet with verified metrics' }, { status: 'ok', text: 'Added keyword from JD #2' }, { status: 'blocked', text: 'Invented skill not in history' }].map((item) => (
                          <div key={item.text} className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${item.status === 'ok' ? 'bg-brand-green/15 text-brand-green' : 'bg-red-50 text-red-500'}`}>
                              {item.status === 'ok' ? '✓' : '×'}
                            </span>
                            <span className={`text-xs leading-snug ${item.status === 'ok' ? 'text-brand-dark/65' : 'text-red-400 line-through'}`}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ─── Row 3: ATS Match Analytics — full width ─── */}
              <motion.div
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={bentoCardVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="lg:col-span-3 bg-white rounded-2xl border border-brand-border overflow-hidden cursor-default"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left: copy */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <span className="block font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/45 font-semibold mb-4">04 — Analytics</span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark mb-4">
                      ATS Match <em className="not-italic text-brand-green">Analytics</em>
                    </h3>
                    <p className="text-sm sm:text-base text-brand-dark/60 leading-relaxed max-w-md mb-8">
                      Score your resume against Workday, Taleo, Lever, and Greenhouse parsing rules before you hit submit. Watch the match score update in real time as you tailor.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {['Workday', 'Taleo', 'Lever', 'Greenhouse'].map((ats) => (
                        <span key={ats} className="inline-flex items-center gap-1.5 bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5">
                          <Gauge size={12} className="text-brand-green" />
                          <span className="text-xs font-medium text-brand-dark/70">{ats}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Right: score dashboard module */}
                  <div className="bg-brand-bg border-t md:border-t-0 md:border-l border-brand-border p-8 sm:p-10 lg:p-12 flex items-center justify-center">
                    <div className="w-full max-w-xs space-y-5">
                      {/* Overall score */}
                      <div className="bg-white rounded-xl border border-brand-border p-5 text-center">
                        <span className="block font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/50 mb-2">ATS Match</span>
                        <span className="block text-5xl font-bold tracking-[-0.03em] text-brand-dark leading-none">88%</span>
                        <div className="mt-3">
                          <AnimatedProgressBar pct={88} />
                        </div>
                      </div>
                      {/* Breakdown bars */}
                      <div className="bg-white rounded-xl border border-brand-border p-4 space-y-3">
                        {[
                          { label: 'Skills match', pct: 92, tone: 'bg-brand-green' },
                          { label: 'Experience fit', pct: 85, tone: 'bg-brand-green/70' },
                          { label: 'Keyword coverage', pct: 78, tone: 'bg-brand-dark/60' },
                        ].map((bar) => (
                          <div key={bar.label}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs text-brand-dark/60">{bar.label}</span>
                              <span className="text-xs font-mono text-brand-dark/45">{bar.pct}%</span>
                            </div>
                            <AnimatedProgressBar pct={bar.pct} tone={bar.tone} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP — full-bleed horizontal scrolling; the vertical bounding
            lines deliberately do NOT run through it (exempted as the horizontal
            scrolling element). They resume in the dark sections below. */}
        <div className="bg-brand-dark py-7 overflow-hidden border-y border-brand-dark/20 select-none">
          <div className="flex whitespace-nowrap animate-marquee w-max">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center">
                {marqueeWords.map((w) => (
                  <span key={`${dup}-${w}`} className="flex items-center">
                    <span className="px-10 text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.03em] leading-none text-white/90">
                      {w}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green shrink-0" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* REAL RESULTS — dark section with animated counters; no vertical bounding
            lines here — they stop above this section. */}
        <section className="relative py-24 md:py-40 bg-brand-dark text-white overflow-hidden">
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-20">
              <div className="lg:col-span-8">
                <SectionBadge chip="Real results">Score-backed from day one</SectionBadge>
                <h2 className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-[-0.03em] leading-[0.95] text-white mt-5">
                  Results on day one
                </h2>
              </div>
              <div className="lg:col-span-4 lg:pb-4">
                <p className="text-base text-white/60 leading-relaxed">
                  No setup, no learning curve. Upload, paste a job, and get a score-backed tailored resume before your coffee goes cold.
                </p>
              </div>
            </div>

            {/* Hairline — no squares: the dark real-results section has no
                vertical bounding lines, so there is no cross path here. */}
            <div className="h-px w-full bg-white/10 mb-14" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                { value: 2.4, decimals: 1, suffix: '×', label: 'more interviews' },
                { value: 10, decimals: 0, suffix: ' min', label: 'per tailored resume' },
                { value: 88, decimals: 0, suffix: '%', label: 'avg. ATS match' },
              ].map((stat, i) => (
                <div key={stat.label} className={`${i > 0 ? 'sm:border-l sm:border-white/10 sm:pl-10' : ''}`}>
                  <span className="block text-[clamp(3.5rem,7vw,6rem)] font-bold tracking-[-0.03em] leading-none text-white">
                    <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </span>
                  <span className="mt-4 block text-sm font-mono uppercase tracking-[0.2em] text-white/50">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-20">
              <button
                onClick={() => stageHandoffAndGo('')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-green hover:bg-brand-greenHover text-brand-dark font-extrabold text-sm shadow-xl transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Launch the Agent
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* PERSONAS — Serro-style 01/02/03/04 tabs + use cases */}
        <section id="usecases" className="relative py-24 md:py-36 bg-brand-bg border-t border-brand-border">
          <VerticalBoundLines />
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
              <div className="lg:col-span-5">
                <SectionBadge chip="Cases">Workflows for every stage</SectionBadge>
                <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mt-5">
                  Built for every job seeker
                </h2>
              </div>
              <div className="lg:col-span-7 flex items-end">
                <p className="text-base text-brand-dark/60 max-w-xl">
                  Whatever stage you're at, the agent knows how to frame your real history against the role — honestly, and powerfully.
                </p>
              </div>
            </div>

            {/* Tabs — 2×2 on mobile, 4 across on desktop; hairline dividers via gap-px */}
            <div className="border-t border-brand-border" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-brand-border">
              {personas.map((p, i) => (
                <button
                  key={p.num}
                  onClick={() => setActivePersona(i)}
                  className={`text-left p-6 sm:p-8 transition-colors duration-300 ${
                    activePersona === i
                      ? 'bg-brand-dark text-white'
                      : 'bg-transparent text-brand-dark hover:bg-brand-secondary'
                  }`}
                >
                  <span className={`block font-mono text-sm font-semibold mb-8 ${activePersona === i ? 'text-brand-green' : 'text-brand-dark/35'}`}>
                    {p.num}
                  </span>
                  <span className={`block font-mono text-xs uppercase tracking-[0.2em] mb-2 ${activePersona === i ? 'text-white/60' : 'text-brand-dark/50'}`}>
                    {p.name}
                  </span>
                  <span className={`block text-lg font-bold tracking-tight ${activePersona === i ? 'text-white' : 'text-brand-dark'}`}>
                    {p.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Active persona content — profile left, workflow panel right. Keyed by
                the active persona so the switch fades in fresh content. */}
            <motion.div
              key={activePersona}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
            >
              {/* Left — persona profile */}
              <div className="lg:col-span-5">
                <span className="font-mono text-sm font-semibold text-brand-green">{personas[activePersona].num}/</span>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-dark/50 mt-4">{personas[activePersona].name}</p>
                <h3 className="text-[clamp(1.8rem,3vw,2.6rem)] font-bold tracking-tight text-brand-dark mt-2">
                  {personas[activePersona].title}
                </h3>
                <p className="text-base sm:text-lg text-brand-dark/70 leading-relaxed mt-5 max-w-md">
                  {personas[activePersona].desc}
                </p>
                <p className="mt-7 font-mono text-[11px] uppercase tracking-widest text-brand-dark/45">
                  {personas[activePersona].evidence}
                </p>
              </div>

              {/* Right — workflow panel */}
              <div className="lg:col-span-7">
                <div className="border border-brand-border bg-white">
                  <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-brand-border">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-dark/50">Workflow</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-green">Per persona</span>
                  </div>
                  <div className="divide-y divide-brand-border">
                    {personas[activePersona].workflow.map((row) => (
                      <div key={row.tag} className="flex items-start gap-4 px-5 sm:px-7 py-4">
                        <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-widest text-brand-dark/40 pt-0.5">{row.tag}</span>
                        <p className="text-sm text-brand-dark/85 leading-relaxed flex-1">{row.text}</p>
                        <FileCheck size={14} className="text-brand-green mt-0.5 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PRICING — flat plans from the shared pricing config, styled to the
            page (closed hairline grid; Build highlighted dark). */}
        <section id="pricing" className="relative py-24 md:py-36 bg-brand-bg border-t border-brand-border">
          <VerticalBoundLines />
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header — left headline, right supporting line */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16 lg:mb-20">
              <div className="lg:col-span-5">
                <SectionBadge chip="Pricing">Simple, flat plans</SectionBadge>
                <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mt-5">
                  Pay when you're ready to apply
                </h2>
              </div>
              <div className="lg:col-span-7 lg:pb-1">
                <p className="text-base text-brand-dark/60 leading-relaxed max-w-xl">
                  Start free with one AI-tailored resume. Upgrade for unlimited tailoring, every template, and unlimited exports — cancel anytime.
                </p>
              </div>
            </div>

            {/* Plan cards — 4 cells in a closed hairline frame */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-border border border-brand-border">
              {(['free', 'sprint', 'build', 'blueprint'] as const).map((planId) => {
                const plan = PLANS[planId];
                const { amount, period } = formatPlanPrice(plan);
                const isDark = planId === 'build';
                const features = planId === 'free' ? FOUNDATION_FEATURES : PAID_PLAN_FEATURES;
                return (
                  <div
                    key={planId}
                    className={`flex flex-col p-7 sm:p-8 ${isDark ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark'}`}
                  >
                    <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-brand-green' : 'text-brand-dark/45'}`}>
                      {plan.tagline}
                    </p>
                    <h3 className={`text-xl font-bold tracking-tight mt-3 ${isDark ? 'text-white' : 'text-brand-dark'}`}>
                      {plan.name}
                    </h3>
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className={`text-4xl font-extrabold tracking-[-0.03em] leading-none ${isDark ? 'text-white' : 'text-brand-dark'}`}>
                        {amount}
                      </span>
                      <span className={`text-sm ${isDark ? 'text-white/50' : 'text-brand-dark/50'}`}>{period}</span>
                    </div>
                    <p className={`text-xs mt-2 ${isDark ? 'text-white/45' : 'text-brand-dark/45'}`}>{plan.renewalNote}</p>

                    <ul className="mt-6 space-y-2.5 flex-1">
                      {features.map((feature) => (
                        <li key={feature} className={`flex items-start gap-2 text-sm ${isDark ? 'text-white/75' : 'text-brand-dark/70'}`}>
                          <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {planId === 'build' && (
                        <li className={`flex items-start gap-2 text-sm font-medium ${isDark ? 'text-white' : 'text-brand-dark'}`}>
                          <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                          <span>Cheaper than 4 weeks of Sprint</span>
                        </li>
                      )}
                    </ul>

                    <button
                      onClick={() => handlePlanClick(planId)}
                      className={`mt-8 w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                        isDark
                          ? 'bg-brand-green hover:bg-brand-greenHover text-brand-dark'
                          : 'bg-brand-dark hover:bg-brand-dark/90 text-white'
                      }`}
                    >
                      {plan.ctaLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ — accordion with hairline rows */}
        <section id="faq" className="relative py-24 md:py-36 bg-brand-bg border-t border-brand-border">
          <VerticalBoundLines />
          <div className="relative z-10 w-full max-w-[min(80rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16 lg:mb-20">
              <div className="lg:col-span-5">
                <SectionBadge chip="FAQ">Straight answers</SectionBadge>
                <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-[-0.03em] leading-[1.02] text-brand-dark mt-5">
                  Questions, answered
                </h2>
              </div>
              <div className="lg:col-span-7 lg:pb-1">
                <p className="text-base text-brand-dark/60 leading-relaxed max-w-xl">
                  Everything you'd want to know before you hand your resume to an agent.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-border">
              {faqs.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={faq.q} className="border-b border-brand-border">
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-start gap-5 sm:gap-6 py-6 text-left"
                    >
                      <span className="font-mono text-xs font-semibold text-brand-green shrink-0 pt-1">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-lg font-bold tracking-tight text-brand-dark leading-snug">
                        {faq.q}
                      </span>
                      <Plus
                        size={18}
                        className={`mt-1 shrink-0 text-brand-dark/50 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
                      <p className="pb-6 pl-12 sm:pl-14 pr-10 text-sm text-brand-dark/65 leading-relaxed max-w-2xl">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA — dark, two-column layout: headline left, prompt card right; no vertical bounding lines
            here — they stop above this section. */}
        <section className="relative py-24 md:py-40 bg-brand-dark text-white overflow-hidden border-t border-brand-dark/20">
          <div className="absolute inset-0 bg-[radial-gradient(#70E098_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.07] pointer-events-none" />
          <div className="relative z-10 w-full max-w-[min(72rem,calc(100vw*(2/3)))] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left — headline + subtitle */}
              <div className="text-left">
                <h2 className="text-[clamp(1.6rem,3.5vw,2.8rem)] font-bold tracking-[-0.03em] leading-[1.02] text-white text-balance">
                  Tailor your resume
                  <br />
                  to any job?
                </h2>
                <p className="text-base sm:text-lg text-white/50 mt-5">
                  Get a grounded, ATS-optimized resume in seconds.
                </p>
              </div>

              {/* Right — prompt card (mirrors the hero input) */}
              <BorderBeam size="md" theme="dark" borderRadius={16} strength={0.75} className="rounded-2xl focus-within:ring-4 focus-within:ring-brand-green/10">
              <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 sm:p-6">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (promptInput.trim() || stagedResume) {
                        stageHandoffAndGo(promptInput);
                      }
                    }
                  }}
                  placeholder="Tailor your resume to a job description..."
                  className="w-full bg-transparent text-white text-sm placeholder-white/35 resize-none outline-none min-h-[56px] font-sans p-1 leading-relaxed"
                  rows={2}
                />
                <div className="mt-1 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleResumeFileChange}
                    className="hidden"
                  />
                  {stagedResume ? (
                    <div className="inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-lg text-xs font-medium bg-brand-green/15 text-white border border-brand-green/30 max-w-[60%]">
                      <FileCheck className="w-4 h-4 text-brand-green shrink-0" />
                      <span className="truncate">{stagedResume.fileName}</span>
                      <button
                        type="button"
                        onClick={() => { setStagedResume(null); setUploadError(null); }}
                        aria-label="Remove attached resume"
                        className="p-0.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      disabled={isParsingResume}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {isParsingResume ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => stageHandoffAndGo(promptInput)}
                    disabled={!promptInput.trim() && !stagedResume}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      !promptInput.trim() && !stagedResume
                        ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                        : 'bg-brand-green hover:bg-brand-greenHover text-brand-dark shadow-lg'
                    }`}
                  >
                    <span>Tailor Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              </BorderBeam>
            </div>
          </div>
        </section>
        </div>
      </main>

      {/* Standard Public Footer */}
      <PublicFooter />
    </div>
  );
}
