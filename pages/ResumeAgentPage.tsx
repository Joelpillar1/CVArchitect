import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ResumeData, TemplateType, INITIAL_DATA, createEmptyResume } from '../types';
import {
  JobDescriptionData,
  JobMatchAnalysis,
  ResumeChange,
  MissingEvidenceItem,
  AgentMessage
} from '../types/resumeAgent';
import {
  parseJobDescription,
  analyzeJobMatch,
  generateTailoredChanges,
  detectMissingEvidence
} from '../services/resumeAgentService';
import { runAgent, type AgentHistoryTurn } from '../services/agentClient';
import { applyOperation, OperationError } from '../utils/resumeOperations';
import { type ResumeOperation } from '../types/resumeOperations';
import { type ResumeSectionType } from '../types/resumeSections';
import { SECTION_REGISTRY, createDefaultSectionOrder } from '../utils/sectionRegistry';
import { stripMarkdown, formatAllResumeBullets } from '../utils/templateUtils';
import { loadFacts, saveFact, factsForRun, loadFactsFromBackend, type CandidateFact } from '../services/candidateProfile';
import { resumeService, cleanSerializableObject, type SavedResume } from '../services/resumeService';
import { generatePDF, printResumeToPdf, exportResumeToPlainText, exportResumeToDocx } from '../components/utils/pdfGenerator';
import ResumeAgentHeader from '../components/resume-agent/ResumeAgentHeader';
import ResumeWorkspace from '../components/resume-agent/ResumeWorkspace';
import PrintPortal from '../components/PrintPortal';
import AgentPanel from '../components/resume-agent/AgentPanel';
import AgentSidebar from '../components/resume-agent/AgentSidebar';
import JobContextDrawer from '../components/resume-agent/JobContextDrawer';
import { parseResume } from '../utils/resumeParser';
import {
  getResumeAgentMemory,
  saveResumeAgentMemory,
  duplicateResumeAgentMemory,
  removeResumeAgentMemory,
} from '../services/resumeMemoryService';
import {
  ResumeAgentMemory,
  createEmptyResumeMemory,
  recordMemoryDecision,
} from '../utils/resumeAgentMemory';
import { Layout, MessageSquare, Briefcase, Download, Save, Undo, Sparkles, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { findBestTextMatch, setTextAtPath, stripInlineTags } from '../utils/inlineTextFormat';

import {
  getAgentDataKey,
  getAgentTitleKey,
  getAgentTemplateKey,
  getAgentResumeIdKey,
  getAgentHistoryKey,
} from '../utils/agentStorageKeys';

// Short random id for chat messages
const genId = () => Math.random().toString(36).substring(2, 9);

// Helpers for per-resume, per-user local storage history
const saveLocalResumeHistory = (
  resumeId: string | null,
  userId: string | null | undefined,
  history: {
    messages: AgentMessage[];
    jobData?: JobDescriptionData | null;
    analysis?: JobMatchAnalysis | null;
  }
) => {
  try {
    const key = getAgentHistoryKey(resumeId, userId);
    const cleanMessages = history.messages.filter((m) => m.type !== 'loading');
    localStorage.setItem(
      key,
      JSON.stringify({
        messages: cleanMessages,
        jobData: history.jobData || null,
        analysis: history.analysis || null,
      })
    );
  } catch (e) {
    console.warn('Failed to save local agent history:', e);
  }
};

const loadLocalResumeHistory = (
  resumeId?: string | null,
  userId?: string | null
): {
  messages?: AgentMessage[];
  jobData?: JobDescriptionData | null;
  analysis?: JobMatchAnalysis | null;
} | null => {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Direct scoped key
    const directKey = getAgentHistoryKey(resumeId || 'draft', userId);
    let raw = localStorage.getItem(directKey);

    // 2. If not found and userId is provided, try fallback keys
    if (!raw && userId) {
      const anonKey = getAgentHistoryKey(resumeId || 'draft', null);
      raw = localStorage.getItem(anonKey);
    }

    // 3. If still not found and resumeId is provided, search all keys ending with `_history_${resumeId}`
    if (!raw && resumeId && resumeId !== 'draft') {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.endsWith(`_history_${resumeId}`)) {
          raw = localStorage.getItem(k);
          if (raw) break;
        }
      }
    }

    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load local agent history:', e);
  }
  return null;
};

// Snapshot helper to compare working document state with last saved baseline
const computeResumeSnapshot = (data: ResumeData, title: string, tmpl: TemplateType): string => {
  const { agentMessages, agentJobData, agentAnalysis, agentMemory, ...coreData } = data;
  return JSON.stringify({
    ...coreData,
    title: title || '',
    template: tmpl || data.template || 'classic',
  });
};

export const normalizeResumeData = (raw: any): ResumeData => {
  if (!raw || typeof raw !== 'object') {
    return createEmptyResume();
  }
  const inner = raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)
    ? raw.data
    : raw.resume && typeof raw.resume === 'object' && !Array.isArray(raw.resume)
    ? raw.resume
    : raw;

  const empty = createEmptyResume();

  // Comprehensive extraction for Career Highlights / Key Achievements
  let achievementsValue =
    inner.keyAchievements !== undefined && inner.keyAchievements !== null && (Array.isArray(inner.keyAchievements) ? inner.keyAchievements.length > 0 : String(inner.keyAchievements).trim().length > 0)
      ? inner.keyAchievements
      : (inner.careerHighlights || inner.careerHighlight || inner.highlights || inner.keyHighlights || inner.professionalHighlights || inner.coreHighlights || inner.achievements || inner.accomplishments || inner.keyAccomplishments || inner.majorAccomplishments || inner.notableAchievements || inner.selectedAchievements || inner.milestones || inner.executiveHighlights || []);

  let addlInfo = Array.isArray(inner.additionalInfo) ? [...inner.additionalInfo] : [];

  // Check if Career Highlights / Key Achievements are in additionalInfo
  if (Array.isArray(addlInfo)) {
    const highlightIdx = addlInfo.findIndex((info: any) => {
      if (!info || typeof info.label !== 'string') return false;
      const label = info.label.toLowerCase().trim();
      return /^(career\s*highlights?|key\s*highlights?|professional\s*highlights?|core\s*highlights?|highlights?|key\s*achievements?|achievements?|accomplishments?|key\s*accomplishments?|major\s*accomplishments?|notable\s*achievements?|selected\s*achievements?|executive\s*highlights?|milestones?)$/i.test(label);
    });

    if (highlightIdx !== -1) {
      const item = addlInfo[highlightIdx];
      if (
        !achievementsValue ||
        (Array.isArray(achievementsValue) && achievementsValue.length === 0) ||
        (typeof achievementsValue === 'string' && !achievementsValue.trim())
      ) {
        achievementsValue = item.value;
      }
      addlInfo.splice(highlightIdx, 1);
    }
  }

  // Preserve section titles (especially if original resume had Career Highlights)
  const mergedSectionTitles = { ...(empty.sectionTitles || {}), ...(inner.sectionTitles || {}) };
  if (
    !mergedSectionTitles.achievements &&
    (inner.careerHighlights || inner.careerHighlight || (typeof inner.jobTitle === 'string' && /career\s*highlight/i.test(inner.jobTitle)))
  ) {
    mergedSectionTitles.achievements = 'Career Highlights';
  }

  return formatAllResumeBullets({
    ...empty,
    ...inner,
    fullName: typeof inner.fullName === 'string' ? inner.fullName.trim() : (inner.fullName !== undefined ? inner.fullName : ''),
    jobTitle: typeof inner.jobTitle === 'string' ? inner.jobTitle : (inner.jobTitle !== undefined ? inner.jobTitle : ''),
    email: typeof inner.email === 'string' ? inner.email : (inner.email !== undefined ? inner.email : ''),
    phone: typeof inner.phone === 'string' ? inner.phone : (inner.phone !== undefined ? inner.phone : ''),
    linkedin: typeof inner.linkedin === 'string' ? inner.linkedin : (inner.linkedin !== undefined ? inner.linkedin : ''),
    location: typeof inner.location === 'string' ? inner.location : (typeof inner.address === 'string' ? inner.address : (inner.location !== undefined ? inner.location : '')),
    summary: typeof inner.summary === 'string' ? inner.summary : (inner.summary !== undefined ? inner.summary : ''),
    skills: typeof inner.skills === 'string' ? inner.skills : (Array.isArray(inner.skills) ? inner.skills.join(', ') : (inner.skills !== undefined ? inner.skills : '')),
    experience: Array.isArray(inner.experience) ? inner.experience : [],
    education: Array.isArray(inner.education) ? inner.education : [],
    certifications: Array.isArray(inner.certifications) ? inner.certifications : [],
    projects: Array.isArray(inner.projects) ? inner.projects : [],
    leadership: Array.isArray(inner.leadership) ? inner.leadership : [],
    awards: inner.awards || '',
    publications: inner.publications || '',
    coursework: Array.isArray(inner.coursework) ? inner.coursework : [],
    additionalInfo: addlInfo,
    keyAchievements: achievementsValue,
    referee: typeof inner.referee === 'string' ? inner.referee : '',
    sectionTitles: Object.keys(mergedSectionTitles).length > 0 ? mergedSectionTitles : undefined,
    sectionOrder: Array.isArray(inner.sectionOrder) && inner.sectionOrder.length > 0 ? inner.sectionOrder : empty.sectionOrder,
  });
};

export const isResumePopulated = (data: ResumeData | null | undefined): boolean => {
  if (!data) return false;
  const hasName = Boolean(data.fullName?.trim() && data.fullName !== 'YOUR NAME');
  const hasExp = Array.isArray(data.experience) && data.experience.length > 0 && data.experience.some(e => Boolean(e.company?.trim() || e.role?.trim()));
  const hasSummary = Boolean(data.summary?.trim() && !data.summary.startsWith('A brief professional summary'));
  const hasSkills = Boolean(data.skills?.trim() && data.skills !== 'Skill 1, Skill 2, Skill 3, Skill 4, Skill 5, Skill 6');
  return hasName || hasExp || hasSummary || hasSkills;
};

const getInitialStoredData = (): {
  data: ResumeData;
  title: string;
  template: TemplateType;
  resumeId: string | null;
  userId: string | null;
  history: {
    messages?: AgentMessage[];
    jobData?: JobDescriptionData | null;
    analysis?: JobMatchAnalysis | null;
  } | null;
} => {
  if (typeof window === 'undefined') {
    return { data: INITIAL_DATA, title: 'Untitled Resume', template: 'classic', resumeId: null, userId: null, history: null };
  }
  try {
    let foundData: ResumeData | null = null;
    let foundTitle: string | null = null;
    let foundTemplate: TemplateType | null = null;
    let foundResumeId: string | null = null;
    let foundUserId: string | null = null;

    // 1. Check handoff signal if present
    const handoff = localStorage.getItem('cv_architect_agent_handoff');
    if (handoff === 'upload') {
      const uploadData = localStorage.getItem('cv_architect_agent_resume_data');
      if (uploadData) {
        try { foundData = JSON.parse(uploadData); } catch (e) {}
      }
      foundTitle = localStorage.getItem('cv_architect_agent_resume_title');
      foundTemplate = (localStorage.getItem('cv_architect_agent_template') as TemplateType) || null;
    }

    // 2. Check user-scoped or anon agent keys in localStorage
    if (!foundData) {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('cv_agent_') && k.endsWith('_resume_data')) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const p = JSON.parse(raw);
              if (p && typeof p === 'object' && isResumePopulated(p)) {
                foundData = p;
                const userIdPart = k.replace('cv_agent_', '').replace('_resume_data', '');
                foundUserId = userIdPart === 'anon' ? null : userIdPart;
                foundTitle = localStorage.getItem(`cv_agent_${userIdPart}_resume_title`);
                foundTemplate = (localStorage.getItem(`cv_agent_${userIdPart}_template`) as TemplateType) || null;
                foundResumeId = localStorage.getItem(`cv_agent_${userIdPart}_resume_id`);
                break;
              }
            } catch (e) {}
          }
        }
      }
    }

    // 3. Fallback: cv_architect_agent_resume_data
    if (!foundData) {
      const rawLegacy = localStorage.getItem('cv_architect_agent_resume_data');
      if (rawLegacy) {
        try { foundData = JSON.parse(rawLegacy); } catch (e) {}
        foundTitle = localStorage.getItem('cv_architect_agent_resume_title') || foundTitle;
        foundTemplate = (localStorage.getItem('cv_architect_agent_template') as TemplateType) || foundTemplate;
      }
    }

    // 4. Fallback: cv_app_data (from Dashboard / Resume Builder)
    if (!foundData) {
      const rawApp = localStorage.getItem('cv_app_data');
      if (rawApp) {
        try { foundData = JSON.parse(rawApp); } catch (e) {}
        foundTemplate = (localStorage.getItem('cv_app_template') as TemplateType) || foundTemplate;
        foundResumeId = localStorage.getItem('cv_app_resume_id') || foundResumeId;
      }
    }

    const resolvedData = foundData ? normalizeResumeData(foundData) : INITIAL_DATA;
    const resolvedTitle = foundTitle || (resolvedData.fullName ? `${resolvedData.fullName}'s Resume` : 'Untitled Resume');
    const resolvedTemplate = foundTemplate || resolvedData.template || 'classic';
    const resolvedResumeId = foundResumeId || null;

    let foundHistory: {
      messages?: AgentMessage[];
      jobData?: JobDescriptionData | null;
      analysis?: JobMatchAnalysis | null;
    } | null = null;

    if (resolvedResumeId || foundUserId !== undefined) {
      foundHistory = loadLocalResumeHistory(resolvedResumeId, foundUserId);
    }
    if (!foundHistory && resolvedData && Array.isArray(resolvedData.agentMessages) && resolvedData.agentMessages.length > 0) {
      foundHistory = {
        messages: resolvedData.agentMessages,
        jobData: resolvedData.agentJobData || null,
        analysis: resolvedData.agentAnalysis || null,
      };
    }

    return {
      data: resolvedData,
      title: resolvedTitle,
      template: resolvedTemplate,
      resumeId: resolvedResumeId,
      userId: foundUserId,
      history: foundHistory,
    };
  } catch (e) {
    console.warn('Error reading initial resume state from localStorage:', e);
  }

  return { data: INITIAL_DATA, title: 'Untitled Resume', template: 'classic', resumeId: null, userId: null, history: null };
};

interface ResumeAgentPageProps {
  /** Render inside a fixed-height container (e.g. the /agent landing hero embed)
   *  instead of a full-screen page. Keeps every function identical to the real
   *  route — only the root height changes. */
  embedded?: boolean;
}

const initialStored = getInitialStoredData();

export default function ResumeAgentPage({ embedded = false }: ResumeAgentPageProps) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { showToast } = useToast();

  // Core State — synchronously hydrated from local cache, refreshed per-user inside auth bootstrap effect
  const [resumeData, setResumeData] = useState<ResumeData>(() => initialStored.data);
  const [resumeTitle, setResumeTitle] = useState<string>(() => initialStored.title);
  const [template, setTemplate] = useState<TemplateType>(() => initialStored.template);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(() => initialStored.resumeId);
  // Saved resumes listed in the left sidebar (from saved_resumes table).
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Synchronous state refs to prevent race conditions during saves and debounced typing
  const resumeDataRef = useRef<ResumeData>(resumeData);
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  const resumeTitleRef = useRef<string>(resumeTitle);
  useEffect(() => {
    resumeTitleRef.current = resumeTitle;
  }, [resumeTitle]);

  const templateRef = useRef<TemplateType>(template);
  useEffect(() => {
    templateRef.current = template;
  }, [template]);

  // Unsaved Changes & Navigation Interception State
  const hasBootstrappedRef = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUnsavedChangesRef = useRef(false);
  const lastSavedSnapshotRef = useRef<string>('');
  const isNavigatingAllowedRef = useRef(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    type: 'reload' | 'back_forward' | 'dashboard' | 'switch_resume' | 'new_resume';
    action: () => void;
    customTitle?: string;
  } | null>(null);

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  // Keep unsaved changes state in sync with working resume document
  useEffect(() => {
    if (!hasBootstrappedRef.current || !lastSavedSnapshotRef.current) return;
    const currentSnapshot = computeResumeSnapshot(resumeData, resumeTitle, template);
    const isDirty = currentSnapshot !== lastSavedSnapshotRef.current;
    setHasUnsavedChanges(isDirty);
    hasUnsavedChangesRef.current = isDirty;
  }, [resumeData, resumeTitle, template]);

  // Prevent loss of unsaved edits on browser reload or tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Push history guard state whenever unsaved changes become true so browser Back/Forward can be caught
  useEffect(() => {
    if (embedded) return;
    if (hasUnsavedChanges) {
      window.history.pushState({ resumeAgentGuard: true }, '', window.location.href);
    }
  }, [hasUnsavedChanges, embedded]);

  // Intercept browser Back and Forward history navigation without native alerts
  useEffect(() => {
    if (embedded) return;
    // Initial guard entry
    window.history.pushState({ resumeAgentGuard: true }, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      if (isNavigatingAllowedRef.current) return;

      if (hasUnsavedChangesRef.current) {
        // Re-push history entry immediately to prevent page unload
        window.history.pushState({ resumeAgentGuard: true }, '', window.location.href);
        setPendingNavigation({
          type: 'back_forward',
          action: () => {
            isNavigatingAllowedRef.current = true;
            setHasUnsavedChanges(false);
            hasUnsavedChangesRef.current = false;
            if (window.history.length > 2) {
              window.history.go(-2);
            } else {
              navigate('/dashboard');
            }
          },
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [embedded, navigate]);

  // Job & Analysis State
  const [jobData, setJobData] = useState<JobDescriptionData | null>(() => initialStored.history?.jobData || null);
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(() => initialStored.history?.analysis || null);
  const [pendingChanges, setPendingChanges] = useState<ResumeChange[]>([]);
  const [acceptedHistory, setAcceptedHistory] = useState<{ change: ResumeChange; prevData: ResumeData }[]>([]);

  // Clarifying-question flow (derived from JD requirements missing from the resume)
  const [activeQuestion, setActiveQuestion] = useState<MissingEvidenceItem | null>(null);
  const [questionQueue, setQuestionQueue] = useState<MissingEvidenceItem[]>([]);
  const [collectedAnswers, setCollectedAnswers] = useState<{ requirement: string; answer: string }[]>([]);

  // Status & UI State
  const [status, setStatus] = useState<string>('Ready');
  const [messages, setMessages] = useState<AgentMessage[]>(() => {
    if (initialStored.history?.messages && initialStored.history.messages.length > 0) {
      return initialStored.history.messages;
    }
    return [
      {
        id: 'welcome_msg',
        sender: 'agent',
        timestamp: Date.now(),
        type: 'text',
        text: 'Hello! I am your AI Resume Agent. Paste a job description for a role you are targeting so we can analyze your fit, identify missing keywords, and tailor your resume.',
      },
    ];
  });

  // Tracks the resume ID & user ID that messages currently in state are verified to belong to
  const historyHydratedForRef = useRef<{ resumeId: string | null; userId: string | null } | null>(
    initialStored.history?.messages && initialStored.history.messages.length > 0
      ? { resumeId: initialStored.resumeId, userId: initialStored.userId }
      : null
  );

  const messagesRef = useRef<AgentMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const jobDataRef = useRef<JobDescriptionData | null>(jobData);
  useEffect(() => {
    jobDataRef.current = jobData;
  }, [jobData]);

  const analysisRef = useRef<JobMatchAnalysis | null>(analysis);
  useEffect(() => {
    analysisRef.current = analysis;
  }, [analysis]);

  const [activeMobileTab, setActiveMobileTab] = useState<'resume' | 'agent' | 'job'>('resume');
  const [isJobContextOpen, setIsJobContextOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeletingResume, setIsDeletingResume] = useState(false);

  // Synchronous mirror of savedResumeId, so the manual Save never sees a stale null
  // (which would create a duplicate row in the resumes table / "My Templates").
  // Persisted across reloads.
  const savedResumeIdRef = useRef<string | null>(savedResumeId);
  useEffect(() => {
    savedResumeIdRef.current = savedResumeId;
  }, [savedResumeId]);

  // Resume-Scoped Conversational Memory state
  const [resumeMemory, setResumeMemory] = useState<ResumeAgentMemory>(() =>
    createEmptyResumeMemory(savedResumeId || 'draft')
  );
  const resumeMemoryRef = useRef<ResumeAgentMemory>(resumeMemory);
  useEffect(() => {
    resumeMemoryRef.current = resumeMemory;
  }, [resumeMemory]);

  // Candidate Facts memory synchronized with Supabase profiles
  const candidateFactsRef = useRef<CandidateFact[]>(loadFacts(user?.id));
  useEffect(() => {
    if (user?.id) {
      loadFactsFromBackend(user.id).then((facts) => {
        candidateFactsRef.current = facts;
      });
    }
  }, [user?.id]);

  // Upload Lifecycle metadata for agent situational awareness
  const uploadLifecycleRef = useRef<{
    justUploaded: boolean;
    filename?: string;
    uploadStatus: 'pending' | 'analyzed' | null;
  }>({
    justUploaded: false,
    uploadStatus: null,
  });

  // Serializes Supabase writes: only one insert/update in flight at a time.
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const setCurrentResumeId = (id: string | null) => {
    savedResumeIdRef.current = id;
    setSavedResumeId(id);
    const resumeIdKey = getAgentResumeIdKey(user?.id);
    if (id) {
      localStorage.setItem(resumeIdKey, id);
    } else {
      localStorage.removeItem(resumeIdKey);
    }
  };

  // Refresh the sidebar's saved-resume list from Supabase.
  const refreshSavedResumes = useCallback(async () => {
    if (!user?.id) return;
    try {
      setSavedResumes(await resumeService.getResumes(user.id));
    } catch (e) {
      console.warn('Could not refresh resume list:', e);
    }
  }, [user?.id]);

  // Resolve and load history for a specific resume from LocalStorage cache or Supabase resume content
  const resolveAndSetResumeHistory = useCallback(
    (targetResumeId: string | null, targetContent?: ResumeData | null, targetUserId?: string | null) => {
      const activeUserId = targetUserId !== undefined ? targetUserId : user?.id;

      const isRealHistory = (msgs?: AgentMessage[] | null) => {
        if (!msgs || !Array.isArray(msgs) || msgs.length === 0) return false;
        if (msgs.length === 1 && (msgs[0].id.startsWith('welcome_msg') || ms[0].id === 'welcome_msg')) {
          return false;
        }
        return true;
      };

      // 1. Check local storage history specifically for this resume ID
      const localHistory = loadLocalResumeHistory(targetResumeId, activeUserId);
      if (localHistory && isRealHistory(localHistory.messages)) {
        setMessages(localHistory.messages!);
        setJobData(localHistory.jobData || null);
        setAnalysis(localHistory.analysis || null);
        historyHydratedForRef.current = { resumeId: targetResumeId, userId: activeUserId || null };
        return;
      }

      // 2. Check Supabase saved content specifically for this resume
      if (
        targetContent &&
        isRealHistory(targetContent.agentMessages)
      ) {
        setMessages(targetContent.agentMessages!);
        setJobData(targetContent.agentJobData || null);
        setAnalysis(targetContent.agentAnalysis || null);
        saveLocalResumeHistory(targetResumeId, activeUserId, {
          messages: targetContent.agentMessages!,
          jobData: targetContent.agentJobData || null,
          analysis: targetContent.agentAnalysis || null,
        });
        historyHydratedForRef.current = { resumeId: targetResumeId, userId: activeUserId || null };
        return;
      }

      // 3. Fallback: if localHistory had at least something (even welcome message), use it
      if (localHistory && Array.isArray(localHistory.messages) && localHistory.messages.length > 0) {
        setMessages(localHistory.messages);
        setJobData(localHistory.jobData || null);
        setAnalysis(localHistory.analysis || null);
        historyHydratedForRef.current = { resumeId: targetResumeId, userId: activeUserId || null };
        return;
      }

      // 4. Load resume-scoped memory
      getResumeAgentMemory(targetResumeId, activeUserId).then((mem) => {
        setResumeMemory(mem);
        resumeMemoryRef.current = mem;
      });

      // 5. Default fresh welcome message for this specific resume
      const defaultMsg: AgentMessage[] = [
        {
          id: 'welcome_msg_' + Date.now(),
          sender: 'agent',
          timestamp: Date.now(),
          type: 'text',
          text:
            'Hello! I am your AI Resume Agent. Paste a job description for a role you are targeting so we can analyze your fit, identify missing keywords, and tailor your resume.',
        },
      ];
      setMessages(defaultMsg);
      setJobData(null);
      setAnalysis(null);
      historyHydratedForRef.current = { resumeId: targetResumeId, userId: activeUserId || null };
    },
    [user?.id]
  );

  // Auto-sync local storage history per resume ID whenever messages/jobData/analysis updates
  useEffect(() => {
    if (!hasBootstrappedRef.current) return;
    const currentUserId = user?.id || null;
    const hydrated = historyHydratedForRef.current;
    if (!hydrated) return;

    // Safety guard against cross-document leakage:
    // Only auto-sync if messages in state belong to the active savedResumeId & currentUserId
    if (hydrated.resumeId !== savedResumeId || hydrated.userId !== currentUserId) {
      return;
    }

    const cleanMsgs = messages.filter((m) => m.type !== 'loading');
    if (cleanMsgs.length > 0) {
      saveLocalResumeHistory(savedResumeId, currentUserId, {
        messages: cleanMsgs,
        jobData,
        analysis,
      });
    }
  }, [messages, jobData, analysis, savedResumeId, user?.id]);

  // Mutex lock to prevent overlapping or looping saves
  const isPerformingRealSaveRef = useRef(false);

  // Auto-sync working document to local storage cache & Supabase database so reloads and tab switches never lose progress
  useEffect(() => {
    if (!hasBootstrappedRef.current) return;
    const timer = setTimeout(() => {
      try {
        const dataKey = getAgentDataKey(user?.id);
        const titleKey = getAgentTitleKey(user?.id);
        const templateKey = getAgentTemplateKey(user?.id);
        const resumeIdKey = getAgentResumeIdKey(user?.id);

        localStorage.setItem(dataKey, JSON.stringify(resumeData));
        localStorage.setItem(titleKey, resumeTitle);
        localStorage.setItem(templateKey, template);
        if (savedResumeId) {
          localStorage.setItem(resumeIdKey, savedResumeId);
        } else {
          localStorage.removeItem(resumeIdKey);
        }

        // Keep cv_app_* in sync for seamless transitions between dashboard and agent
        localStorage.setItem('cv_app_data', JSON.stringify(resumeData));
        localStorage.setItem('cv_app_template', template);
        if (savedResumeId) {
          localStorage.setItem('cv_app_resume_id', savedResumeId);
        }
      } catch (e) {
        console.warn('Auto-sync to localStorage failed:', e);
      }

      // Background cloud sync to Supabase database ONLY if data actually changed
      if (user?.id && isResumePopulated(resumeData) && !isPerformingRealSaveRef.current) {
        const currentSnap = computeResumeSnapshot(resumeData, resumeTitle, template);
        if (currentSnap !== lastSavedSnapshotRef.current) {
          performRealSave(resumeData, resumeTitle, template, true).catch((err) => {
            console.warn('Background database auto-sync failed:', err);
          });
        }
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [resumeData, resumeTitle, template, savedResumeId, user?.id]);

  // Real persistence engine (LocalStorage + Supabase database)
  const performRealSave = async (
    dataToSave?: ResumeData,
    titleToSave?: string,
    selectedTemplate?: TemplateType,
    isBackground = false
  ) => {
    if (isPerformingRealSaveRef.current) return;

    // ── Step 1: Synchronously flush any pending debounced in-sheet typing ──
    // Multiple fallback layers to ensure we ALWAYS save the latest DOM edits.
    let flushedData: ResumeData | null = null;

    if (!dataToSave && !isBackground) {
      if (typeof window !== 'undefined') {
        const detailObj: { latestData?: ResumeData } = {};
        window.dispatchEvent(new CustomEvent('cv_architect_flush_input', { detail: detailObj }));
        if (detailObj.latestData) {
          flushedData = detailObj.latestData;
        }
      }

      if (
        typeof document !== 'undefined' && document.activeElement && (document.activeElement as HTMLElement).blur
      ) {
        (document.activeElement as HTMLElement).blur();
      }
    }

    let domFallbackData: ResumeData | null = null;
    try {
      const paper = document.querySelector('[data-resume-paper]') as HTMLElement | null;
      if (paper && typeof window !== 'undefined' && !dataToSave && !isBackground) {
        let base = resumeDataRef.current;
        let changed = false;
        const allNodes = Array.from(paper.querySelectorAll('[contenteditable="true"]')) as HTMLElement[];
        for (const el of allNodes) {
          const domText = (el.textContent || '').trim();
          if (!domText || domText.length < 2) continue;
          const cleanDomText = domText.replace(/^[•·\-*\s]+/, '').trim();
          if (!cleanDomText) continue;
          const match = findBestTextMatch(cleanDomText, base, cleanDomText, {});
          if (!match) continue;
          const storedPlain = stripInlineTags(match.stored).trim();
          if (storedPlain !== cleanDomText) {
            base = setTextAtPath(base, match.path, () => cleanDomText);
            changed = true;
          }
        }
        if (changed) {
          domFallbackData = base;
        }
      }
    } catch (e) {
      console.warn('[performRealSave] Direct DOM read fallback skipped:', e);
    }

    const currentData = dataToSave ?? flushedData ?? domFallbackData ?? resumeDataRef.current;
    const currentTitle =
      titleToSave?.trim() ||
      resumeTitleRef.current?.trim() ||
      currentData.resumeTitle?.trim() ||
      currentData.currentTag?.trim() ||
      (currentData.fullName?.trim() ? `${currentData.fullName.trim()}'s Resume` : 'Untitled Resume');
    const currentTemplate = selectedTemplate ?? templateRef.current ?? 'classic';

    const cleanMsgs = messages.filter((m) => m.type !== 'loading');
    const rawDataToSave: ResumeData = {
      ...currentData,
      template: currentTemplate,
      resumeTitle: currentTitle,
      currentTag: currentTitle,
      agentMessages: cleanMsgs,
      agentJobData: jobData,
      agentAnalysis: analysis,
      agentMemory: resumeMemoryRef.current,
    };

    // Sanitize payload to clean JSON object for Supabase JSONB column (safely strips circular refs & DOM nodes)
    const fullDataToSave: ResumeData = cleanSerializableObject(rawDataToSave);
    const newSnapshot = computeResumeSnapshot(fullDataToSave, currentTitle, currentTemplate);

    // If nothing changed and this document was already created in DB, avoid redundant writes
    if (newSnapshot === lastSavedSnapshotRef.current && savedResumeIdRef.current) {
      if (!isBackground) {
        setSaveStatus('saved');
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => setSaveStatus('idle'), 1500);
      }
      return;
    }

    isPerformingRealSaveRef.current = true;
    if (!isBackground) {
      setIsSaving(true);
      setSaveStatus('saving');
    }

    try {
      // 1. Immediately save locally to user-scoped LocalStorage
      try {
        const dataKey = getAgentDataKey(user?.id);
        const titleKey = getAgentTitleKey(user?.id);
        const templateKey = getAgentTemplateKey(user?.id);
        const resumeIdKey = getAgentResumeIdKey(user?.id);

        localStorage.setItem(dataKey, JSON.stringify(fullDataToSave));
        localStorage.setItem(titleKey, currentTitle);
        localStorage.setItem(templateKey, currentTemplate);
        if (savedResumeIdRef.current) {
          localStorage.setItem(resumeIdKey, savedResumeIdRef.current);
        }
        saveLocalResumeHistory(savedResumeIdRef.current, user?.id, {
          messages: cleanMsgs,
          jobData,
          analysis,
        });
        void saveResumeAgentMemory(savedResumeIdRef.current, resumeMemoryRef.current, user?.id);
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      // 2. Save/Update to Supabase backend if user logged in.
      if (user?.id) {
        let resumeId = savedResumeIdRef.current;
        let didUpdate = false;
        if (resumeId && !resumeId.startsWith('tmp_') && resumeId !== 'draft' && !resumeId.startsWith('saved_')) {
          try {
            didUpdate = await resumeService.updateResume(resumeId, currentTitle, fullDataToSave);
          } catch (updateErr) {
            console.warn('Supabase update failed, falling back to create:', updateErr);
            didUpdate = false;
          }
        }
        if (!didUpdate) {
          const newId = await resumeService.saveResume(user.id, currentTitle, fullDataToSave);
          setCurrentResumeId(newId);
          savedResumeIdRef.current = newId;
          saveLocalResumeHistory(newId, user.id, {
            messages: cleanMsgs,
            jobData,
            analysis,
          });
          historyHydratedForRef.current = { resumeId: newId, userId: user.id };
          await refreshSavedResumes();
        }
      }

      // 3. Mark snapshot and transition status cleanly
      lastSavedSnapshotRef.current = newSnapshot;
      setHasUnsavedChanges(false);
      hasUnsavedChangesRef.current = false;

      if (!isBackground) {
        setSaveStatus('saved');
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          setSaveStatus('idle');
          setIsSaving(false);
        }, 1500);
      } else {
        setIsSaving(false);
      }
    } catch (e) {
      console.error('Supabase save error:', e);
      if (!isBackground) {
        setSaveStatus('idle');
        setIsSaving(false);
      }
      throw e;
    } finally {
      isPerformingRealSaveRef.current = false;
    }
  };

  const [undoStack, setUndoStack] = useState<ResumeData[]>([]);
  const [redoStack, setRedoStack] = useState<ResumeData[]>([]);

  const [zoom, setZoom] = useState<number>(embedded ? 0.9 : 1.2);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(embedded ? 0.9 : 1.2);

  // Live agent run state: an in-flight streaming run can be cancelled (Stop button),
  // and the whole run is undoable as one step via the pre-run baseline snapshot.
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const agentAbortRef = useRef<AbortController | null>(null);
  const lastAgentRunBaselineRef = useRef<ResumeData | null>(null);

  // Manual-save only: edits update the working document and undo history in
  // memory; nothing is persisted until the user presses the Save button.
  const handleUpdateResumeData = (newData: ResumeData) => {
    // Capture the CURRENT data BEFORE updating the ref — React state updater
    // callbacks run lazily, so reading resumeDataRef.current inside the callback
    // would see the already-updated value (newData), breaking undo.
    const previousData = resumeDataRef.current;
    setUndoStack((prev) => [...prev.slice(-30), previousData]);
    setRedoStack([]);
    resumeDataRef.current = newData;
    setResumeData(newData);
    setHasUnsavedChanges(true);
    hasUnsavedChangesRef.current = true;
  };

  const handleUpdateTitle = (newTitle: string) => {
    resumeTitleRef.current = newTitle;
    setResumeTitle(newTitle);
    setHasUnsavedChanges(true);
    hasUnsavedChangesRef.current = true;
    if (savedResumeId) {
      setSavedResumes((prev) =>
        prev.map((r) => (r.id === savedResumeId ? { ...r, title: newTitle } : r))
      );
    }
  };

  const handleChangeTemplate = (newTemplate: TemplateType) => {
    templateRef.current = newTemplate;
    setTemplate(newTemplate);
    const updatedData = { ...resumeDataRef.current, template: newTemplate };
    resumeDataRef.current = updatedData;
    setResumeData(updatedData);
    setHasUnsavedChanges(true);
    hasUnsavedChangesRef.current = true;
  };

  const handleReload = () => {
    if (hasUnsavedChangesRef.current) {
      setPendingNavigation({
        type: 'reload',
        action: () => {
          isNavigatingAllowedRef.current = true;
          setHasUnsavedChanges(false);
          hasUnsavedChangesRef.current = false;
          window.location.reload();
        },
      });
    } else {
      window.location.reload();
    }
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);

    setRedoStack((prev) => [resumeData, ...prev]);
    setUndoStack(newUndo);
    setResumeData(previous);
  }, [undoStack, resumeData]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    const newRedo = redoStack.slice(1);

    setUndoStack((prev) => [...prev, resumeData]);
    setRedoStack(newRedo);
    setResumeData(next);
  }, [redoStack, resumeData]);

  // Global Keyboard Shortcuts (Undo/Redo & Intercept Reload/Navigation with Unsaved Edits)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // 1. Intercept Reload Shortcuts (F5, Ctrl+R, Cmd+R) when unsaved changes exist
      if ((e.key === 'F5' || (isCmdOrCtrl && e.key.toLowerCase() === 'r')) && hasUnsavedChangesRef.current) {
        e.preventDefault();
        setPendingNavigation({
          type: 'reload',
          action: () => {
            isNavigatingAllowedRef.current = true;
            window.location.reload();
          },
        });
        return;
      }

      // 2. Intercept History Navigation Shortcuts (Alt+Left / Alt+Right or Cmd+[ / Cmd+])
      if (
        ((e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
          (isMac && e.metaKey && (e.key === '[' || e.key === ']'))) &&
        hasUnsavedChangesRef.current
      ) {
        e.preventDefault();
        const isBack = e.key === 'ArrowLeft' || e.key === '[';
        setPendingNavigation({
          type: 'back_forward',
          action: () => {
            isNavigatingAllowedRef.current = true;
            if (isBack) {
              window.history.back();
            } else {
              window.history.forward();
            }
          },
        });
        return;
      }

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const lastLoadedUserIdRef = useRef<string | null | undefined>(undefined);

  // Initial load / handoff from the landing page.
  // Strictly isolated by authenticated user ID to eliminate cross-account leakage.
  useEffect(() => {
    if (loading) return;

    const currentUserId = user?.id || null;
    if (hasBootstrappedRef.current && lastLoadedUserIdRef.current === currentUserId) {
      return;
    }

    hasBootstrappedRef.current = true;
    lastLoadedUserIdRef.current = currentUserId;

    // Load candidate fact memory for this user (survives across sessions via localStorage).
    candidateFactsRef.current = loadFacts(currentUserId);

    // Read and consume the one-shot handoff signals.
    const handoff = localStorage.getItem('cv_architect_agent_handoff'); // 'upload' | 'prompt' | null
    const isUploadHandoff = handoff === 'upload';
    const initialPrompt = localStorage.getItem('cv_architect_initial_prompt') || '';
    localStorage.removeItem('cv_architect_agent_handoff');
    localStorage.removeItem('cv_architect_initial_prompt');

    const dataKey = getAgentDataKey(currentUserId);
    const titleKey = getAgentTitleKey(currentUserId);
    const templateKey = getAgentTemplateKey(currentUserId);
    const resumeIdKey = getAgentResumeIdKey(currentUserId);

    let workingData: ResumeData = resumeDataRef.current || INITIAL_DATA;
    let cachedTitle: string | null = resumeTitleRef.current || null;
    let cachedTemplate: string | null = templateRef.current || null;
    let cachedResumeId: string | null = savedResumeIdRef.current || null;

    try {
      const cachedDataRaw = localStorage.getItem(dataKey);
      if (cachedDataRaw) {
        workingData = JSON.parse(cachedDataRaw);
      } else if (!workingData || !workingData.fullName || workingData.fullName === 'YOUR NAME') {
        const anonDataRaw = localStorage.getItem(getAgentDataKey(null));
        const appDataRaw = localStorage.getItem('cv_app_data');
        const legacyDataRaw = localStorage.getItem('cv_architect_agent_resume_data');
        const raw = anonDataRaw || appDataRaw || legacyDataRaw;
        if (raw) {
          try {
            const p = JSON.parse(raw);
            if (p && typeof p === 'object') workingData = { ...INITIAL_DATA, ...p };
          } catch (e) {}
        }
      }
      cachedTitle = localStorage.getItem(titleKey) || cachedTitle || localStorage.getItem('cv_architect_agent_resume_title') || 'Untitled Resume';
      cachedTemplate = localStorage.getItem(templateKey) || cachedTemplate || (localStorage.getItem('cv_app_template') as TemplateType) || workingData.template || 'classic';
      cachedResumeId = localStorage.getItem(resumeIdKey) || cachedResumeId || localStorage.getItem('cv_app_resume_id') || null;
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }

    (async () => {
      let resolvedTitle = cachedTitle || 'Untitled Resume';
      let resolvedTemplate: TemplateType = (cachedTemplate as TemplateType) || workingData.template || 'classic';

      if (isUploadHandoff) {
        const uploadCachedData =
          localStorage.getItem('cv_architect_agent_resume_data') ||
          localStorage.getItem(dataKey);
        const uploadCachedTitle =
          localStorage.getItem('cv_architect_agent_resume_title') || cachedTitle;
        if (uploadCachedData) {
          try {
            workingData = JSON.parse(uploadCachedData);
          } catch (e) {}
        }
        if (uploadCachedTitle) {
          resolvedTitle = uploadCachedTitle;
        }
        uploadLifecycleRef.current = {
          justUploaded: true,
          filename: resolvedTitle || 'uploaded_resume.pdf',
          uploadStatus: 'analyzed',
        };
        // Clean legacy handoff cache
        localStorage.removeItem('cv_architect_agent_resume_data');
        localStorage.removeItem('cv_architect_agent_resume_title');
        localStorage.removeItem('cv_architect_agent_template');

        setCurrentResumeId(null);
        setResumeData(workingData);
        resumeDataRef.current = workingData;
        setResumeTitle(resolvedTitle);
        resumeTitleRef.current = resolvedTitle;
        setTemplate(resolvedTemplate);
        templateRef.current = resolvedTemplate;

        if (currentUserId) {
          await performRealSave(workingData, resolvedTitle, resolvedTemplate);
          await refreshSavedResumes();
        }
        resolveAndSetResumeHistory(null, workingData, currentUserId);
      } else if (currentUserId) {
        try {
          const userResumes = await resumeService.getResumes(currentUserId);
          setSavedResumes(userResumes);

          let target: SavedResume | undefined;
          if (cachedResumeId) {
            target = userResumes.find((r) => r.id === cachedResumeId);
          }
          if (!target && userResumes.length > 0) {
            const appResumeId = localStorage.getItem('cv_app_resume_id');
            if (appResumeId) {
              target = userResumes.find((r) => r.id === appResumeId);
            }
          }
          if (!target && userResumes.length > 0) {
            target = userResumes[0];
          }

          if (target) {
            setCurrentResumeId(target.id);
            let targetContent: any = target.content;
            if (typeof targetContent === 'string' && targetContent.trim().startsWith('{')) {
              try {
                targetContent = JSON.parse(targetContent);
              } catch (err) {}
            }

            const supabaseData = normalizeResumeData(targetContent);
            if (targetContent?.template) {
              resolvedTemplate = targetContent.template;
            }

            const lsIsPopulated = isResumePopulated(workingData);
            const sbIsPopulated = isResumePopulated(supabaseData);

            if (sbIsPopulated && !lsIsPopulated) {
              workingData = supabaseData;
            } else if (lsIsPopulated && !sbIsPopulated) {
              void performRealSave(workingData, cachedTitle || target.title || 'Untitled Resume', resolvedTemplate);
            } else if (lsIsPopulated && sbIsPopulated) {
              workingData = {
                ...supabaseData,
                ...workingData,
              };
              void performRealSave(workingData, cachedTitle || target.title || 'Untitled Resume', resolvedTemplate);
            } else {
              workingData = supabaseData;
            }

            if (target.title && !cachedTitle) {
              resolvedTitle = target.title;
            }

            setResumeData(workingData);
            resumeDataRef.current = workingData;
            setResumeTitle(resolvedTitle);
            resumeTitleRef.current = resolvedTitle;
            setTemplate(resolvedTemplate);
            templateRef.current = resolvedTemplate;

            try {
              localStorage.setItem(dataKey, JSON.stringify(workingData));
              localStorage.setItem(titleKey, resolvedTitle);
              localStorage.setItem(templateKey, resolvedTemplate);
              localStorage.setItem(resumeIdKey, target.id);
            } catch (e) {}

            resolveAndSetResumeHistory(target.id, targetContent, currentUserId);
          } else {
            // New or empty user account: keep current workingData
            setCurrentResumeId(null);
            setResumeData(workingData);
            resumeDataRef.current = workingData;
            setResumeTitle(resolvedTitle);
            resumeTitleRef.current = resolvedTitle;
            setTemplate(resolvedTemplate);
            templateRef.current = resolvedTemplate;

            try {
              localStorage.setItem(dataKey, JSON.stringify(workingData));
              localStorage.setItem(titleKey, resolvedTitle);
              localStorage.setItem(templateKey, resolvedTemplate);
            } catch (e) {}

            resolveAndSetResumeHistory(null, workingData, currentUserId);
          }
        } catch (e) {
          console.warn('Could not fetch existing user resume:', e);
          // Always hydrate state from localStorage cache so the page never
          // falls back to blank when the network is slow or fails.
          setResumeData(workingData);
          resumeDataRef.current = workingData;
          setResumeTitle(resolvedTitle);
          resumeTitleRef.current = resolvedTitle;
          setTemplate(resolvedTemplate);
          templateRef.current = resolvedTemplate;
          resolveAndSetResumeHistory(cachedResumeId, workingData, currentUserId);
        }
      } else {
        // Logged out / Anon session
        setSavedResumes([]);
        setCurrentResumeId(null);
        setResumeData(workingData);
        resumeDataRef.current = workingData;
        setResumeTitle(resolvedTitle);
        resumeTitleRef.current = resolvedTitle;
        setTemplate(resolvedTemplate);
        templateRef.current = resolvedTemplate;

        resolveAndSetResumeHistory(null, workingData, null);
      }

      // Establish baseline snapshot
      lastSavedSnapshotRef.current = computeResumeSnapshot(
        workingData,
        resolvedTitle,
        resolvedTemplate
      );
      setHasUnsavedChanges(false);
      hasUnsavedChangesRef.current = false;

      // Auto-process the request the user typed on the landing page, against the resume
      if (initialPrompt.trim()) {
        processInitialRequest(initialPrompt.trim(), workingData);
      }
    })();
  }, [user?.id, loading]);

  // Manual-save only: renaming the resume or switching templates no longer
  // auto-persists — the Save button is the single point of persistence.

  // Handler: Analyze Job Description
  // `resumeOverride` lets the initial-prompt handoff analyze against the freshly loaded
  // resume before React state has flushed.
  const handleAnalyzeJobText = async (text: string, resumeOverride?: ResumeData) => {
    const resume = resumeOverride ?? resumeData;
    const userMsgId = genId();
    const loadingId = 'loading_jd_' + Date.now();

    // Immediately post the user's input and active ThinkingOrb loading state into the chat stream
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      const newMessages = [...prev];
      if (!last || last.sender !== 'user' || last.text !== text) {
        newMessages.push({ id: userMsgId, sender: 'user', timestamp: Date.now(), type: 'text', text });
      }
      newMessages.push({ id: loadingId, sender: 'agent', timestamp: Date.now(), type: 'loading' });
      return newMessages;
    });

    setIsAgentRunning(true);
    setStatus('Analyzing Job Description...');
    try {
      const parsedJd = await parseJobDescription(text);
      setJobData(parsedJd);

      setStatus('Evaluating Match...');
      const matchEval = await analyzeJobMatch(resume, parsedJd);
      setAnalysis(matchEval);

      // Append Analysis Card to message feed and clean up loading indicator
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: genId(),
          sender: 'agent',
          timestamp: Date.now(),
          type: 'analysis',
          analysis: matchEval,
        },
      ]);
      setIsAgentRunning(false);

      // Detect requirements the resume can't yet evidence, and ask about them one by
      // one before tailoring. If nothing is missing, tailor straight away.
      const missingItems = await detectMissingEvidence(resume, parsedJd);
      beginQuestioning(missingItems, parsedJd, resume);
    } catch (err: any) {
      console.error('Job analysis failed:', err);
      setIsAgentRunning(false);
      setStatus('Error');
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
    }
  };

  // Push the request the user typed on the landing page into the chat, then analyze it
  // as the target role. `resumeForAnalysis` is the resume resolved during bootstrap.
  const processInitialRequest = (text: string, resumeForAnalysis: ResumeData) => {
    setMessages((prev) => [
      ...prev,
      { id: genId(), sender: 'user', timestamp: Date.now(), type: 'text', text },
    ]);
    handleAnalyzeJobText(text, resumeForAnalysis);
  };

  // Build a question card message for a missing-evidence item
  const buildQuestionMessage = (q: MissingEvidenceItem): AgentMessage => ({
    id: genId(),
    sender: 'agent',
    timestamp: Date.now(),
    type: 'missing_evidence',
    missingEvidence: q,
  });

  // Kick off the sequential clarifying-question flow (or tailor immediately if none).
  const beginQuestioning = (items: MissingEvidenceItem[], job: JobDescriptionData, resume: ResumeData) => {
    setCollectedAnswers([]);

    if (!items || items.length === 0) {
      setActiveQuestion(null);
      setQuestionQueue([]);
      runTailoring(job, resume, []);
      return;
    }

    const [first, ...rest] = items;
    setQuestionQueue(rest);
    setActiveQuestion(first);
    setStatus('Gathering a few details...');
    setMessages((prev) => [
      ...prev,
      {
        id: genId(),
        sender: 'agent',
        timestamp: Date.now(),
        type: 'text',
        text: `Before I tailor your resume, I have ${items.length} quick question${items.length > 1 ? 's' : ''} so every edit stays truthful to your real experience.`,
      },
      buildQuestionMessage(first),
    ]);
  };

  // Handler: answer (or skip) the active clarifying question, then advance the queue.
  const handleAnswerQuestion = (answer: string, skip = false) => {
    const q = activeQuestion;
    if (!q) return;

    const trimmed = answer.trim();
    const isSkip = skip || !trimmed;

    // Echo the user's reply into the chat
    setMessages((prev) => [
      ...prev,
      {
        id: genId(),
        sender: 'user',
        timestamp: Date.now(),
        type: 'text',
        text: isSkip ? `Skip — nothing to add on ${q.requirement}.` : trimmed,
      },
    ]);

    // Record grounded evidence for the tailoring step.
    const nextAnswers = isSkip
      ? collectedAnswers
      : [...collectedAnswers, { requirement: q.requirement, answer: trimmed }];
    if (!isSkip) {
      setCollectedAnswers(nextAnswers);

      // Only a confirmed *missing skill* should be added to the skills inventory.
      // Answers to quantify/scope/clarify questions are context for the rewrite,
      // not new skills — appending them would pollute the skills list.
      if (q.category === 'missing_skill') {
        const tag = (q.skillTag || q.requirement).trim();
        if (tag) {
          setResumeData((prev) => {
            const existing = prev.skills || '';
            const already = existing
              .toLowerCase()
              .split(',')
              .map((s) => s.trim())
              .includes(tag.toLowerCase());
            if (already) return prev;
            return { ...prev, skills: existing ? `${existing}, ${tag}` : tag };
          });
        }
      }
    }

    // Advance to the next question, or finish and tailor.
    const [next, ...rest] = questionQueue;
    if (next) {
      setActiveQuestion(next);
      setQuestionQueue(rest);
      setMessages((prev) => [...prev, buildQuestionMessage(next)]);
    } else {
      setActiveQuestion(null);
      setQuestionQueue([]);
      runTailoring(jobData, resumeData, nextAnswers);
    }
  };

  // Handler: Tailor Resume — generate grounded changes and stage them for review.
  const runTailoring = async (
    job: JobDescriptionData | null,
    resume: ResumeData,
    answers: { requirement: string; answer: string }[]
  ) => {
    if (!job) return;

    setIsAgentRunning(true);
    setStatus(`Tailoring for ${job.title}...`);
    const loadingId = 'loading_' + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: loadingId, sender: 'agent', timestamp: Date.now(), type: 'loading' },
    ]);

    try {
      const extraContext = answers.length
        ? answers.map((a) => `${a.requirement}: ${a.answer}`).join('\n')
        : undefined;
      const proposedChanges = await generateTailoredChanges(resume, job, extraContext);
      setPendingChanges(proposedChanges);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: genId(),
          sender: 'agent',
          timestamp: Date.now(),
          type: 'text',
          text: `**Step 1: Tailored Executive Summary & Key Highlights**\n\nI've tailored your Professional Summary first to position you directly for **${job.title} at ${job.company}**, followed by targeted experience bullets. Review and approve the edits directly on your resume.`,
        },
      ]);

      setIsAgentRunning(false);
      setStatus('Reviewing Changes');
    } catch (err) {
      console.error('Tailoring failed:', err);
      setIsAgentRunning(false);
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      setStatus('Ready');
    }
  };

  // Manual trigger from the "Tailor My Resume" button / suggestions.
  const handleTailorResume = () => {
    runTailoring(jobData, resumeData, collectedAnswers);
  };

  // Handler: Accept Single Change
  const handleAcceptChange = (changeId: string) => {
    const target = pendingChanges.find((c) => c.id === changeId);
    if (!target) return;

    // Save previous state for undo
    setAcceptedHistory((prev) => [{ change: target, prevData: { ...resumeData } }, ...prev]);

    // Apply change to structured resume model
    setResumeData((prevData) => {
      const updated = { ...prevData };

      if (target.section === 'summary') {
        updated.summary = target.proposed;
      } else if (target.section === 'skills') {
        updated.skills = target.proposed;
      } else if (target.section === 'keyAchievements') {
        if (Array.isArray(updated.keyAchievements)) {
          const arr = [...updated.keyAchievements];
          if (typeof target.bulletIndex === 'number' && arr[target.bulletIndex] !== undefined) {
            arr[target.bulletIndex] = target.proposed;
          } else if (target.original && arr.includes(target.original)) {
            arr[arr.indexOf(target.original)] = target.proposed;
          } else {
            arr.push(target.proposed);
          }
          updated.keyAchievements = arr;
        } else {
          updated.keyAchievements = target.proposed;
        }
      } else if (target.section === 'experience' && target.itemId) {
        updated.experience = updated.experience.map((exp) => {
          if (exp.id === target.itemId) {
            let descArr = Array.isArray(exp.description) ? [...exp.description] : [exp.description];
            if (typeof target.bulletIndex === 'number' && descArr[target.bulletIndex] !== undefined) {
              descArr[target.bulletIndex] = target.proposed;
            } else if (descArr.length > 0) {
              descArr[0] = target.proposed;
            }
            return { ...exp, description: descArr };
          }
          return exp;
        });
      }

      return updated;
    });

    // Remove from pending
    setPendingChanges((prev) => prev.filter((c) => c.id !== changeId));
  };

  // Handler: Reject Single Change
  const handleRejectChange = (changeId: string) => {
    setPendingChanges((prev) => prev.filter((c) => c.id !== changeId));
  };

  // Handler: Accept All Changes
  const handleAcceptAllChanges = () => {
    pendingChanges.forEach((chg) => handleAcceptChange(chg.id));
  };



  function getOriginalTextForOp(resume: ResumeData, op: ResumeOperation): string {
    switch (op.op) {
      case 'set_field':
        return (resume as any)[op.field] || '';
      case 'replace_bullet':
      case 'delete_bullet': {
        if (op.section === 'keyAchievements') {
          const list = Array.isArray(resume.keyAchievements) ? resume.keyAchievements : [resume.keyAchievements || ''];
          return (typeof op.bulletIndex === 'number' && list[op.bulletIndex]) ? list[op.bulletIndex] : '';
        }
        const arr = op.section === 'experience' ? resume.experience : (op.section === 'leadership' ? resume.leadership : []);
        const item = (arr ?? []).find((e) => e.id === op.itemId);
        if (!item) return '';
        const desc = Array.isArray(item.description) ? item.description : [item.description || ''];
        return (typeof op.bulletIndex === 'number' && desc[op.bulletIndex]) ? desc[op.bulletIndex] : '';
      }
      case 'insert_bullet':
        return '';
      case 'add_skill':
      case 'set_skills':
      case 'remove_skill':
        return resume.skills || '';
      case 'update_item': {
        const arr = (resume as any)[op.section] || [];
        const item = arr.find((i: any) => i.id === op.itemId);
        if (!item) return '';
        return Object.keys(op.fields).map((k) => `${k}: ${item[k] || ''}`).join(', ');
      }
      case 'insert_item':
        return '';
      case 'delete_item': {
        const arr = (resume as any)[op.section] || [];
        const item = arr.find((i: any) => i.id === op.itemId);
        if (!item) return '';
        return item.role || item.company || item.school || item.name || 'Item';
      }
      case 'reorder_sections':
        return (resume.sectionOrder || []).join(', ');
      case 'show_section':
        return (resume.sectionVisibility && resume.sectionVisibility[op.section] === false) ? 'Hidden' : 'Not visible';
      case 'hide_section':
        return 'Visible';
      case 'rename_section':
        return (resume.sectionTitles && resume.sectionTitles[op.section]) || op.section;
    }
  }

  function getProposedTextForOp(op: ResumeOperation): string {
    switch (op.op) {
      case 'set_field':
      case 'replace_bullet':
      case 'insert_bullet':
      case 'add_skill':
      case 'set_skills':
      case 'remove_skill':
        return stripMarkdown(op.value || '');
      case 'delete_bullet':
        return '（Bullet removed）';
      case 'delete_item':
        return '（Item removed）';
      case 'update_item':
        return Object.entries(op.fields).map(([k, v]) => `${k}: ${stripMarkdown(v)}`).join(', ');
      case 'insert_item':
        return Object.entries(op.item).map(([k, v]) => `${k}: ${stripMarkdown(v)}`).join(', ');
      case 'reorder_sections':
        return op.order.join(', ');
      case 'show_section':
        return op.value ? `Show section "${op.section}" with content: ${stripMarkdown(op.value)}` : `Show section "${op.section}"`;
      case 'hide_section':
        return `Hide section "${op.section}"`;
      case 'rename_section':
        return `Rename to "${stripMarkdown(op.title)}"`;
    }
  }

  function operationToResumeChange(op: ResumeOperation, currentResume: ResumeData): ResumeChange {
    let section: ResumeChange['section'] = 'experience';
    if (op.op === 'set_field') {
      section = op.field === 'summary' ? 'summary' : 'summary';
    } else if (op.op === 'add_skill' || op.op === 'remove_skill' || op.op === 'set_skills') {
      section = 'skills';
    } else if ('section' in op && op.section) {
      section = op.section as any;
    }

    const itemId = 'itemId' in op ? op.itemId : undefined;
    const bulletIndex = 'bulletIndex' in op ? op.bulletIndex : undefined;

    return {
      id: op.operationId || genId(),
      section,
      itemId,
      bulletIndex,
      original: stripMarkdown(getOriginalTextForOp(currentResume, op)),
      proposed: getProposedTextForOp(op),
      reason: op.reason || 'Proposed AI Optimization',
      evidence: op.evidence || [],
      status: 'pending',
      timestamp: Date.now(),
    };
  }

  // Handler: Conversational Prompt Message — streamed from the server-side agent.
  // Chat text streams into the agent bubble; proposed operations stage as pending
  // review cards in chat + redline workspace so the user accepts/rejects before applying.
  const handleSendMessage = async (text: string) => {
    // If we're mid-questioning (legacy JD flow), treat the reply as the answer.
    if (activeQuestion) {
      handleAnswerQuestion(text);
      return;
    }
    if (isAgentRunning) return;

    const userMsgId = genId();
    const agentMsgId = genId();

    // Build replay history from prior text turns BEFORE we append the new pair (the
    // closure's `messages` still reflects the pre-update array). This gives the agent
    // conversation memory and lets it resume after a clarifying question.
    const history: AgentHistoryTurn[] = messages
      .filter((m) => m.type === 'text' && (m.text || '').trim())
      .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text as string }));

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', timestamp: Date.now(), type: 'text', text },
      { id: agentMsgId, sender: 'agent', timestamp: Date.now(), type: 'text', text: '' },
    ]);

    // Run-scoped state (closure-local so concurrent runs can't collide).
    const baseline = resumeData;
    let working = resumeData;
    let appliedAny = false;
    let streamedText = false;
    const seenOps = new Set<string>();

    const controller = new AbortController();
    agentAbortRef.current = controller;
    setIsAgentRunning(true);
    setStatus('Thinking...');

    const uploadMeta = { ...uploadLifecycleRef.current };
    // Consume recency flag so future conversation turns are not treated as just-uploaded
    uploadLifecycleRef.current.justUploaded = false;

    await runAgent({
      resumeId: savedResumeIdRef.current || 'draft',
      message: text,
      resume: resumeData,
      jobData,
      history,
      profileFacts: factsForRun(candidateFactsRef.current),
      memory: resumeMemoryRef.current,
      signal: controller.signal,
      justUploaded: uploadMeta.justUploaded,
      filename: uploadMeta.filename,
      uploadStatus: uploadMeta.uploadStatus,
      onMemoryUpdated: (updatedMem) => {
        setResumeMemory(updatedMem);
        resumeMemoryRef.current = updatedMem;
        void saveResumeAgentMemory(savedResumeIdRef.current, updatedMem, user?.id);
      },
      onDecisionRecorded: ({ decision, category }) => {
        const updated = recordMemoryDecision(resumeMemoryRef.current, {
          decision,
          category: (category as any) || 'general',
        });
        setResumeMemory(updated);
        resumeMemoryRef.current = updated;
        void saveResumeAgentMemory(savedResumeIdRef.current, updated, user?.id);
      },
      onChatDelta: (delta) => {
        streamedText = true;
        setStatus('Writing...');
        setMessages((prev) =>
          prev.map((m) => (m.id === agentMsgId ? { ...m, text: (m.text || '') + delta } : m))
        );
      },
      onOperation: (op) => {
        // Idempotency: ignore duplicate/reconnect frames for an op we already applied.
        if (seenOps.has(op.operationId)) return;
        seenOps.add(op.operationId);

        let next: ResumeData;
        try {
          next = applyOperation(working, op);
        } catch (err) {
          console.warn('Failed to apply agent operation:', err instanceof OperationError ? err.message : err);
          return;
        }

        // Take the single pre-run undo snapshot the first time an op actually lands.
        if (!appliedAny) {
          appliedAny = true;
          lastAgentRunBaselineRef.current = baseline;
          setUndoStack((prev) => [...prev.slice(-30), baseline]);
          setRedoStack([]);
          setStatus('Editing your resume...');
        }                working = next;
                resumeDataRef.current = next;
                setResumeData(next);
                setPendingChanges([]);

        // Attach structured operation card to the live agent message feed
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentMsgId
              ? { ...m, operations: [...(m.operations || []), op] }
              : m
          )
        );
      },
      onAwaitingInput: ({ question }) => {
        setStatus('Waiting for your input');
        setMessages((prev) =>
          prev.map((m) => (m.id === agentMsgId ? { ...m, text: (m.text || '') + `\n\n${question}` } : m))
        );
      },
      onFactRecorded: ({ topic, value }) => {
        // Persist the fact the agent captured so it's remembered across sessions and
        // available to future runs as grounding evidence.
        candidateFactsRef.current = saveFact(user?.id, { topic, value, source: 'user' });
      },
      onError: (message) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === agentMsgId && !m.text?.trim() && (!m.operations || m.operations.length === 0)) {
              let cleanMessage = message;

              const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
              const isNetworkError =
                isOffline ||
                /network|failed to fetch|fetch failed|load failed|connection|abort|econnrefused|etimedout|offline/i.test(message);

              if (isNetworkError) {
                cleanMessage = 'Network connection issue. Please check your internet connection and try sending your request again.';
              } else if (/invalid or expired session|unauthenticated|unauthorized|jwt|401/i.test(message)) {
                cleanMessage = isOffline
                  ? 'Network connection issue. Please check your internet connection and try sending your request again.'
                  : 'Your session has expired. Please sign in again to continue with the AI agent.';
              } else if (/rate_limit|429|high traffic|high demand/i.test(message)) {
                cleanMessage = 'The AI agent is currently receiving high demand. Please wait a moment and try asking again.';
              } else if (/gpt-|openai|model|500|502|503|504|server_error|invalid_request|schema|unsupported value/i.test(message)) {
                cleanMessage = 'I encountered a temporary service hiccup while processing your request. Please try asking again.';
              }

              return { ...m, text: `⚠️ ${cleanMessage}` };
            }
            return m;
          })
        );
      },
      onDone: () => {
        setIsAgentRunning(false);
        agentAbortRef.current = null;
        setStatus('Ready');

        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === agentMsgId) {
              const textVal = (m.text || '').trim();
              const hasOps = m.operations && m.operations.length > 0;
              return {
                ...m,
                text: !textVal && !hasOps ? 'I wasn’t able to make changes for that request. Try rephrasing what you’d like to improve.' : m.text,
              };
            }
            return m;
          })
        );
      },
    });
  };

  // Handler: Stop the in-flight agent run (aborts the stream; edits so far are kept).
  const handleStopAgent = () => {
    agentAbortRef.current?.abort();
    agentAbortRef.current = null;
    setIsAgentRunning(false);
    setStatus('Stopped');
  };

  // Save Resume to Database — the SINGLE point of persistence (autosave removed).
  // Refreshes the local cache alongside the database so a reload restores exactly
  // what was saved, and drives the toolbar's "Saving… / Saved" indicator.
  const handleSave = async (dataOverride?: ResumeData) => {
    try {
      await performRealSave(dataOverride);
      if (user?.id) {
        showToast('Resume saved successfully!', 'success');
      } else {
        showToast('Resume saved locally! Sign in to sync with your account.', 'info');
      }
    } catch (e: any) {
      console.error('Error saving resume:', e);
      setSaveStatus('idle');
      showToast('Failed to save resume: ' + (e.message || 'Unknown error'), 'error');
    }
  };

  // ── Sidebar: document switching / management ──────────────────────────────────

  const executeLoadResume = (resume: SavedResume) => {
    let rawContent: any = resume.content;
    if (typeof rawContent === 'string' && rawContent.trim().startsWith('{')) {
      try {
        rawContent = JSON.parse(rawContent);
      } catch (err) {}
    }

    const content = normalizeResumeData(rawContent);
    const nextTitle = resume.title || (content.fullName ? `${content.fullName}'s Resume` : 'Untitled Resume');
    const nextTemplate = (rawContent?.template as TemplateType) || (content.template as TemplateType) || templateRef.current || 'classic';

    setResumeData(content);
    resumeDataRef.current = content;
    setTemplate(nextTemplate);
    templateRef.current = nextTemplate;
    setResumeTitle(nextTitle);
    resumeTitleRef.current = nextTitle;
    setCurrentResumeId(resume.id);
    setUndoStack([]);
    setRedoStack([]);
    setPendingChanges([]);
    lastAgentRunBaselineRef.current = null;

    try {
      localStorage.setItem(getAgentDataKey(user?.id), JSON.stringify(content));
      localStorage.setItem(getAgentTitleKey(user?.id), nextTitle);
      localStorage.setItem(getAgentTemplateKey(user?.id), nextTemplate);
      localStorage.setItem(getAgentResumeIdKey(user?.id), resume.id);
      localStorage.setItem('cv_app_data', JSON.stringify(content));
      localStorage.setItem('cv_app_template', nextTemplate);
      localStorage.setItem('cv_app_resume_id', resume.id);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    lastSavedSnapshotRef.current = computeResumeSnapshot(content, nextTitle, nextTemplate);
    setHasUnsavedChanges(false);
    hasUnsavedChangesRef.current = false;

    historyHydratedForRef.current = null;
    resolveAndSetResumeHistory(resume.id, content, user?.id);
  };

  // Load a saved resume from the sidebar into the workspace (as the working doc).
  const handleLoadResumeFromSidebar = (resume: SavedResume) => {
    if (hasUnsavedChangesRef.current) {
      setPendingNavigation({
        type: 'switch_resume',
        action: () => executeLoadResume(resume),
        customTitle: resume.title || 'Untitled Resume',
      });
      return;
    }
    executeLoadResume(resume);
  };

  // Rename a saved resume from the sidebar menu.
  const handleRenameResumeFromSidebar = async (id: string, label: string) => {
    const target = savedResumes.find((r) => r.id === id);
    if (!target) return;
    const content =
      typeof target.content === 'object' && target.content
        ? (target.content as ResumeData)
        : resumeDataRef.current;
    await resumeService.updateResume(id, label, content);
    setSavedResumes((prev) => prev.map((r) => (r.id === id ? { ...r, title: label } : r)));
    if (savedResumeId === id) {
      resumeTitleRef.current = label;
      setResumeTitle(label);
    }
  };

  // Duplicate a saved resume from the sidebar menu (fresh independent copy)
  const handleDuplicateResumeFromSidebar = async (id: string) => {
    const target = savedResumes.find((r) => r.id === id);
    if (!target) return;
    try {
      const parsedContent: ResumeData =
        typeof target.content === 'object' && target.content
          ? JSON.parse(JSON.stringify(target.content))
          : typeof target.content === 'string'
          ? JSON.parse(target.content)
          : { ...INITIAL_DATA };

      const duplicateTitle = `${target.title || 'Resume'} (Copy)`;
      const duplicatedData: ResumeData = {
        ...parsedContent,
        resumeTitle: duplicateTitle,
        currentTag: duplicateTitle,
        agentMessages: [],
        agentJobData: null,
        agentAnalysis: null,
        jobDescription: '',
        hasJobMatchRun: false,
      };

      if (user?.id) {
        await resumeService.saveResume(user.id, duplicateTitle, duplicatedData);
        await refreshSavedResumes();
        setToast({ message: `"${duplicateTitle}" created successfully.`, type: 'success' });
      }
    } catch (e) {
      console.error('Error duplicating resume from sidebar:', e);
      setToast({ message: 'Failed to duplicate resume.', type: 'error' });
    }
  };

  // Delete a saved resume from the sidebar menu (opens custom alert modal).
  const handleDeleteResumeFromSidebar = (id: string) => {
    const target = savedResumes.find((r) => r.id === id);
    if (!target) return;
    setResumeToDelete({ id, title: target.title || 'Untitled resume' });
  };

  // Perform actual deletion when confirmed in the custom alert modal.
  const handleConfirmDeleteResume = async () => {
    if (!resumeToDelete) return;
    const { id } = resumeToDelete;
    setIsDeletingResume(true);
    try {
      await resumeService.deleteResume(id);
      removeResumeAgentMemory(id, user?.id);
      try {
        localStorage.removeItem(getAgentHistoryKey(id, user?.id));
      } catch (e) {
        /* ignore */
      }
      setSavedResumes((prev) => prev.filter((r) => r.id !== id));
      if (savedResumeId === id) {
        // The working document stays open as an unsaved copy.
        setCurrentResumeId(null);
        resolveAndSetResumeHistory(null, null, user?.id);
      }
      setResumeToDelete(null);
    } catch (e) {
      console.error('Error deleting resume:', e);
    } finally {
      setIsDeletingResume(false);
    }
  };

  const executeNewResume = () => {
    setResumeData(INITIAL_DATA);
    resumeDataRef.current = INITIAL_DATA;
    setResumeTitle('Untitled Resume');
    resumeTitleRef.current = 'Untitled Resume';
    setTemplate('classic');
    templateRef.current = 'classic';
    setCurrentResumeId(null);
    const freshMem = createEmptyResumeMemory('draft');
    setResumeMemory(freshMem);
    resumeMemoryRef.current = freshMem;
    setUndoStack([]);
    setRedoStack([]);
    setPendingChanges([]);
    setAnalysis(null);
    setJobData(null);
    lastAgentRunBaselineRef.current = null;
    lastSavedSnapshotRef.current = computeResumeSnapshot(INITIAL_DATA, 'Untitled Resume', 'classic');
    setHasUnsavedChanges(false);
    hasUnsavedChangesRef.current = false;
    try {
      localStorage.removeItem(getAgentDataKey(user?.id));
      localStorage.removeItem(getAgentTitleKey(user?.id));
      localStorage.removeItem(getAgentTemplateKey(user?.id));
      localStorage.removeItem(getAgentHistoryKey('draft', user?.id));
      localStorage.removeItem(getAgentResumeIdKey(user?.id));
    } catch (e) {
      /* ignore */
    }
    historyHydratedForRef.current = null;
    resolveAndSetResumeHistory(null, null, user?.id);
  };

  // Start a blank working document.
  const handleNewResumeFromSidebar = () => {
    if (hasUnsavedChangesRef.current) {
      setPendingNavigation({
        type: 'new_resume',
        action: () => executeNewResume(),
      });
      return;
    }
    executeNewResume();
  };

  // Export PDF (Direct download via high-DPI client canvas)
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const activeData = resumeDataRef.current || resumeData;
      const activeTemplate = templateRef.current || template;
      const activeTitle = (resumeTitleRef.current || resumeTitle || activeData.fullName || 'Resume').trim();
      await generatePDF(activeData, activeTemplate, activeTitle);
      showToast('Resume downloaded successfully!', 'success');
    } catch (e: any) {
      console.error('Export error:', e);
      showToast(e?.message || 'Failed to export PDF. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Print / Native Vector PDF
  const handlePrintPDF = () => {
    try {
      printResumeToPdf();
    } catch (e: any) {
      console.error('Print error:', e);
      showToast('Failed to open print preview.', 'error');
    }
  };

  // Export Word (.docx)
  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      const activeData = resumeDataRef.current || resumeData;
      const activeTitle = (resumeTitleRef.current || resumeTitle || activeData.fullName || 'Resume').trim();
      await exportResumeToDocx(activeData, activeTitle);
      showToast('Resume downloaded as Word (.docx) successfully!', 'success');
    } catch (e: any) {
      console.error('DOCX export error:', e);
      showToast(e?.message || 'Failed to export Word document. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Plain Text / Markdown
  const handleExportText = (format: 'text' | 'markdown') => {
    try {
      const activeData = resumeDataRef.current || resumeData;
      const activeTitle = (resumeTitleRef.current || resumeTitle || activeData.fullName || 'Resume').trim();
      exportResumeToPlainText(activeData, format, activeTitle);
      showToast(`Exported resume as ${format === 'markdown' ? 'Markdown' : 'Plain Text'}!`, 'success');
    } catch (e: any) {
      console.error('Text export error:', e);
      showToast('Failed to export text.', 'error');
    }
  };

  // Handler: Undo Last Agent Run — restore the snapshot captured before the run's first
  // operation, reverting the whole run's edits as a single step (itself undoable).
  const handleUndoLastAgentRun = () => {
    const baseline = lastAgentRunBaselineRef.current;
    if (!baseline) {
      showToast('No agent run to undo yet.', 'info');
      return;
    }
    handleUpdateResumeData(baseline);
    lastAgentRunBaselineRef.current = null;
    setMessages((prev) => [
      ...prev,
      {
        id: genId(),
        sender: 'agent',
        timestamp: Date.now(),
        type: 'text',
        text: '↩️ Reverted all changes from the last agent run.',
      },
    ]);
  };

  const handleUploadResumeFile = async (file: File) => {
    setIsAgentRunning(true);
    setStatus(`Extracting text from "${file.name}"...`);
    uploadLifecycleRef.current = {
      justUploaded: true,
      filename: file.name,
      uploadStatus: 'pending',
    };

    // Show interactive thinking state in the agent chat panel
    const loadingId = 'loading_upload_' + Date.now();
    setMessages((prev) => [
      ...prev.filter(
        (m) =>
          !m.id.startsWith('msg_welcome') &&
          !m.id.startsWith('loading_') &&
          !(m.type === 'text' && m.text && m.text.includes('Processing "'))
      ),
      {
        id: loadingId,
        sender: 'agent',
        timestamp: Date.now(),
        type: 'loading',
      },
    ]);

    try {
      const parsedPartial = await parseResume(file, (progress) => {
        let stepText = '';
        if (progress <= 30) {
          stepText = `📄 Reading and extracting text (${progress}%)...`;
        } else if (progress <= 60) {
          stepText = `🔍 OCR text extraction & cleaning (${progress}%)...`;
        } else if (progress <= 90) {
          stepText = `🤖 Structuring resume content with AI (${progress}%)...`;
        } else {
          stepText = `📊 Analyzing resume background and experience (${progress}%)...`;
        }
        setStatus(stepText);
      });

      const mergedData = normalizeResumeData({
        ...parsedPartial,
        fullName: parsedPartial.fullName || '',
        jobTitle: parsedPartial.jobTitle || '',
        summary: parsedPartial.summary || '',
        experience: Array.isArray(parsedPartial.experience) ? parsedPartial.experience : [],
        skills: parsedPartial.skills || '',
        education: Array.isArray(parsedPartial.education) ? parsedPartial.education : [],
      });

      const expCount = mergedData.experience?.length || 0;
      const skillsArray = typeof mergedData.skills === 'string'
        ? mergedData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : Array.isArray(mergedData.skills)
        ? (mergedData.skills as string[])
        : [];

      uploadLifecycleRef.current = {
        justUploaded: true,
        filename: file.name,
        uploadStatus: 'analyzed',
      };

      setCurrentResumeId(null);
      setResumeData(mergedData);
      resumeDataRef.current = mergedData;
      const rawFileName = file.name ? file.name.replace(/\.[^/.]+$/, '').trim() : '';
      const uploadedTitle = rawFileName || (mergedData.fullName ? `${mergedData.fullName}'s Resume` : 'Uploaded Resume');
      setResumeTitle(uploadedTitle);
      resumeTitleRef.current = uploadedTitle;
      setUndoStack([]);
      setRedoStack([]);

      lastSavedSnapshotRef.current = '';

      try {
        localStorage.setItem(getAgentDataKey(user?.id), JSON.stringify(mergedData));
        localStorage.setItem(getAgentTitleKey(user?.id), uploadedTitle);
        localStorage.setItem(getAgentTemplateKey(user?.id), templateRef.current);
        localStorage.setItem('cv_app_data', JSON.stringify(mergedData));
        localStorage.setItem('cv_app_template', templateRef.current);
        localStorage.removeItem(getAgentResumeIdKey(user?.id));
        localStorage.removeItem('cv_app_resume_id');
      } catch (e) {}

      if (user?.id) {
        performRealSave(mergedData, uploadedTitle, templateRef.current, true).then(() => {
          refreshSavedResumes();
        }).catch((err) => console.warn('Background save of uploaded resume failed:', err));
      }

      // Generate structured resume analysis summary
      const candidateName = mergedData.fullName || 'Candidate';
      const roleTitle = mergedData.jobTitle || 'Professional';
      const summaryText =
        `## 📄 Resume Parsed & Analyzed: **${file.name}**\n\n` +
        `I have successfully extracted and structured your resume for **${candidateName}** (${roleTitle}).\n\n` +
        `### 🔍 Summary of Extracted Profile:\n` +
        `- **Roles / Experience**: ${expCount} position${expCount === 1 ? '' : 's'} identified\n` +
        `- **Core Skills**: ${skillsArray.length > 0 ? skillsArray.slice(0, 8).join(', ') + (skillsArray.length > 8 ? '…' : '') : 'None specified yet'}\n` +
        `- **Education**: ${mergedData.education?.length || 0} entry${(mergedData.education?.length || 0) === 1 ? '' : 'ies'}\n\n` +
        `### 🚀 Next Steps:\n` +
        `Paste a target job description in the chat or context panel to run a full ATS match analysis and generate tailored, high-impact improvements.`;

      setJobData(null);
      setAnalysis(null);
      historyHydratedForRef.current = { resumeId: null, userId: user?.id || null };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId && !m.id.startsWith('msg_welcome')),
        {
          id: genId(),
          sender: 'agent',
          timestamp: Date.now(),
          type: 'text',
          text: summaryText,
          suggestions: [
            '🎯 Paste a job description to tailor',
            '⚡ Strengthen impact & metrics in bullets',
            '✨ Polish professional summary',
          ],
        },
      ]);
    } catch (err: any) {
      console.error('Error parsing uploaded resume:', err);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: genId(),
          sender: 'agent',
          timestamp: Date.now(),
          type: 'text',
          text: `⚠️ Could not parse "${file.name}": ${err?.message || 'Unsupported format'}. Please try pasting text directly or use a PDF file.`,
        },
      ]);
    } finally {
      setIsAgentRunning(false);
      setStatus('Ready');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Lock body overflow while the resume agent page is mounted to eliminate any page-level side scrollbar
  useEffect(() => {
    if (!embedded) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [embedded]);

  // Handler: Clear Chat History - strictly clears conversation UI state without touching the working resume
  const handleClearChat = () => {
    // 1. Abort any active in-flight agent streaming run
    if (agentAbortRef.current) {
      agentAbortRef.current.abort();
      agentAbortRef.current = null;
    }
    setIsAgentRunning(false);

    // 2. Reset conversation messages to initial welcome state
    const welcomeMsg: AgentMessage = {
      id: 'msg_welcome_' + Date.now(),
      sender: 'agent',
      timestamp: Date.now(),
      type: 'text',
      text: 'Chat cleared. What role would you like to target, or what would you like me to improve on your resume?',
    };
    setMessages([welcomeMsg]);

    // 3. Clear transient review cards & question prompts (resumeData is completely preserved)
    setPendingChanges([]);
    setActiveQuestion(null);
    setQuestionQueue([]);
    setStatus('Ready');

    // 4. Update local history storage cleanly
    try {
      saveLocalResumeHistory(savedResumeIdRef.current, user?.id, {
        messages: [welcomeMsg],
        jobData,
        analysis,
      });
    } catch (e) {
      console.warn('Failed to update local chat history on clear:', e);
    }
  };

  // Handler: Direct Add Section from Canvas Trigger
  const handleAddSection = (
    sectionType: ResumeSectionType,
    customConfig?: { title: string; contentType: 'text' | 'bullets' | 'key_value' }
  ) => {
    let updatedData: ResumeData = { ...resumeData };
    let sectionDisplayName = '';

    if (sectionType === 'custom' && customConfig) {
      const customId = `custom_${Date.now()}`;
      const newCustomSections = {
        ...(updatedData.customSections || {}),
        [customId]: {
          id: customId,
          title: customConfig.title,
          contentType: customConfig.contentType,
          content:
            customConfig.contentType === 'bullets'
              ? ['Key achievement or highlight in this custom section', 'Additional project milestone or accomplishment']
              : customConfig.contentType === 'key_value'
              ? [{ id: '1', label: 'Item', value: 'Details' }]
              : 'Add descriptive overview or notes for this section.',
        },
      };

      const newSectionOrder = Array.isArray(updatedData.sectionOrder)
        ? [...updatedData.sectionOrder, customId]
        : [...createDefaultSectionOrder(), customId];

      const newVisibility = {
        ...(updatedData.sectionVisibility || {}),
        [customId]: true,
      };

      updatedData = {
        ...updatedData,
        customSections: newCustomSections,
        sectionOrder: newSectionOrder,
        sectionVisibility: newVisibility,
      };
      sectionDisplayName = customConfig.title;
    } else {
      const def = SECTION_REGISTRY[sectionType];
      sectionDisplayName = def ? def.defaultTitle : sectionType;

      const newVisibility = {
        ...(updatedData.sectionVisibility || {}),
        [sectionType]: true,
      };

      const currentOrder =
        Array.isArray(updatedData.sectionOrder) && updatedData.sectionOrder.length > 0
          ? updatedData.sectionOrder
          : createDefaultSectionOrder();

      const newSectionOrder = currentOrder.includes(sectionType)
        ? currentOrder
        : [...currentOrder, sectionType];

      updatedData = {
        ...updatedData,
        sectionVisibility: newVisibility,
        sectionOrder: newSectionOrder,
      };

      // Populate starter content if the field is empty so it renders immediately
      const field = def.dataField as keyof ResumeData;
      const currentVal = updatedData[field];
      const hasContent = Array.isArray(currentVal)
        ? currentVal.length > 0
        : typeof currentVal === 'string'
        ? currentVal.trim().length > 0
        : Boolean(currentVal);

      if (!hasContent) {
        switch (def.rendererKind) {
          case 'experience':
            (updatedData as any)[field] = [
              {
                id: Date.now().toString(),
                role: `${def.defaultTitle} Lead / Member`,
                company: 'Organization / Institution',
                startDate: '2023',
                endDate: 'Present',
                description: '• Led key initiatives and collaborated with cross-functional partners\n• Achieved quantifiable results and streamlined operational workflow',
              },
            ];
            break;

          case 'projects':
            (updatedData as any)[field] = [
              {
                id: Date.now().toString(),
                name: `${def.defaultTitle} Highlight`,
                technologies: 'React, TypeScript, Tailwind CSS',
                link: '',
                description: '• Designed and built high-impact features improving user engagement\n• Implemented automated workflows and delivered scalable architecture',
              },
            ];
            break;

          case 'certifications':
            (updatedData as any)[field] = [
              {
                id: Date.now().toString(),
                name: `${def.defaultTitle} Credential`,
                issuer: 'Accrediting Organization',
                date: '2024',
              },
            ];
            break;

          case 'languages':
            (updatedData as any)[field] = [
              { id: '1', language: 'English', proficiency: 'Native / Bilingual' },
              { id: '2', language: 'Spanish', proficiency: 'Professional Working' },
            ];
            break;

          case 'skills':
            (updatedData as any)[field] =
              'JavaScript, TypeScript, React, Node.js, Python, Git, Problem Solving, Team Leadership';
            break;

          case 'bullets':
            (updatedData as any)[field] =
              '• Key milestone or contribution delivering measurable impact\n• Published research or presentation delivered to target audience';
            break;

          case 'key_value':
            (updatedData as any)[field] = [
              { id: '1', label: 'Availability', value: 'Immediate' },
              { id: '2', label: 'Work Authorization', value: 'Authorized to work' },
            ];
            break;

          case 'text':
            if (sectionType === 'references') {
              (updatedData as any)[field] = 'Available upon request.';
            } else if (sectionType === 'interests') {
              (updatedData as any)[field] =
                'Open source development, competitive chess, distance running, technology podcasts.';
            } else if (sectionType === 'coursework') {
              (updatedData as any)[field] =
                'Data Structures & Algorithms, Distributed Systems, Database Management, Machine Learning.';
            } else if (sectionType === 'thesis') {
              (updatedData as any)[field] =
                'Optimizing Distributed Consensus in High-Throughput Edge Computing Architectures.';
            } else if (sectionType === 'security_clearance') {
              (updatedData as any)[field] = 'Active Top Secret / SCI Security Clearance.';
            } else {
              (updatedData as any)[field] =
                'Accomplished professional with a track record of delivering impactful results and driving innovation.';
            }
            break;
        }
      }
    }

    // Push to working document & undo stack
    handleUpdateResumeData(updatedData);

    // Notify Agent Chat so agent has immediate recognition
    const notifyMsg: AgentMessage = {
      id: 'msg_added_section_' + Date.now(),
      sender: 'agent',
      timestamp: Date.now(),
      type: 'text',
      text: `Added the **${sectionDisplayName}** section to your resume. What content would you like me to write or tailor for it?`,
    };

    setMessages((prev) => [...prev, notifyMsg]);
  };

  // Handler: Reorder Sections
  const handleReorderSections = (newOrder: string[]) => {
    const updatedData: ResumeData = {
      ...resumeData,
      sectionOrder: newOrder,
    };
    handleUpdateResumeData(updatedData);
  };

  // Handler: Toggle Section Visibility (Hide/Show)
  const handleToggleSectionVisibility = (sectionId: string, visible: boolean) => {
    const updatedData = applyOperation(resumeData, {
      op: visible ? 'show_section' : 'hide_section',
      section: sectionId,
      operationId: 'manual_' + Date.now(),
      agentRunId: 'manual',
      reason: 'Manual visibility toggle',
      evidence: [],
    });
    handleUpdateResumeData(updatedData);
  };

  return (
    <div className={`flex flex-col ${embedded ? 'h-full' : 'fixed inset-0 w-full h-full overflow-hidden z-0'} bg-brand-bg font-sans select-none`}>
      {/* Navigation Header */}
      <ResumeAgentHeader
        resumeTitle={resumeTitle}
        onUpdateTitle={handleUpdateTitle}
        jobMatch={analysis}
        hasJobDescription={!!jobData}
        onOpenJobContext={() => setIsJobContextOpen(true)}
        onOpenJobInput={() => setActiveMobileTab('agent')}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onPrintPDF={handlePrintPDF}
        onExportDocx={handleExportDocx}
        onExportText={handleExportText}
        template={template}
        onChangeTemplate={handleChangeTemplate}
        onUndoLastAgentRun={handleUndoLastAgentRun}
        isSaving={isSaving}
        isExporting={isExporting}
        saveStatus={saveStatus}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onOpenFullscreen={() => setIsFullscreen(true)}
        onNavigateDashboard={() => {
          if (hasUnsavedChangesRef.current) {
            setPendingNavigation({
              type: 'dashboard',
              action: () => {
                isNavigatingAllowedRef.current = true;
                navigate('/dashboard');
              },
            });
          } else {
            navigate('/dashboard');
          }
        }}
      />

      {/* Main Desktop Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Resource Sidebar (desktop only; hidden when embedded) */}
        {!embedded && (
          <div className="hidden lg:block shrink-0 h-full">
            <AgentSidebar
              resumes={savedResumes}
              activeResumeId={savedResumeId}
              activeResumeTitle={resumeTitle}
              collapsed={isSidebarCollapsed}
              onToggleCollapsed={() => setIsSidebarCollapsed((v) => !v)}
              onLoadResume={handleLoadResumeFromSidebar}
              onRenameResume={handleRenameResumeFromSidebar}
              onDuplicateResume={handleDuplicateResumeFromSidebar}
              onDeleteResume={handleDeleteResumeFromSidebar}
              onNewResume={handleNewResumeFromSidebar}
            />
          </div>
        )}

        {/* Left Panel: Resume Workspace (flexible width) */}
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <ResumeWorkspace
            data={resumeData}
            onChangeData={handleUpdateResumeData}
            pendingChanges={pendingChanges}
            onSelectSectionForReview={(section) => { }}
            onAcceptChange={handleAcceptChange}
            onRejectChange={handleRejectChange}
            onAcceptAllChanges={handleAcceptAllChanges}
            template={template}
            onChangeTemplate={handleChangeTemplate}
            jobData={jobData}
            saveStatus={saveStatus}
            onSave={handleSave}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            embedded={embedded}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            isFullscreen={isFullscreen}
            onToggleFullscreen={setIsFullscreen}
            onAddSection={handleAddSection}
            onReorderSections={handleReorderSections}
            onToggleSectionVisibility={handleToggleSectionVisibility}
          />
        </div>

        {/* Right Panel: Chatting Agent Panel (Standard width) */}
        <div style={{ width: '380px' }} className="w-[380px] shrink-0 h-full overflow-hidden min-w-0 flex flex-col border-l border-brand-border bg-white">
          <AgentPanel
            status={status}
            hasResumeLoaded={true}
            jobData={jobData}
            analysis={analysis}
            messages={messages}
            pendingChanges={pendingChanges}
            activeQuestion={activeQuestion}
            questionsRemaining={questionQueue.length}
            onAnalyzeJobText={handleAnalyzeJobText}
            onUploadJobFile={() => showToast('Please paste the job description text into the analysis box.', 'info')}
            onTailorResume={handleTailorResume}
            onAcceptChange={handleAcceptChange}
            onRejectChange={handleRejectChange}
            onAcceptAllChanges={handleAcceptAllChanges}
            onAnswerQuestion={handleAnswerQuestion}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isAgentRunning={isAgentRunning}
            onStopAgent={handleStopAgent}
            onOpenUploadResumeModal={() => fileInputRef.current?.click()}
            onExportPDF={handleExportPDF}
          />
        </div>
      </div>

      {/* Slide-over Job Context Drawer */}
      <JobContextDrawer
        isOpen={isJobContextOpen}
        onClose={() => setIsJobContextOpen(false)}
        jobData={jobData}
        analysis={analysis}
      />

      {/* Custom Delete Confirmation Modal */}
      {resumeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => !isDeletingResume && setResumeToDelete(null)}
        >
          <div
            className="bg-white/95 rounded-[16px] border border-black/5 p-5 max-w-sm w-full shadow-2xl shadow-black/10 space-y-4 animate-in zoom-in-95 duration-200 text-left backdrop-blur-xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-resume-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-[12px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 pt-0.5 min-w-0">
                <h3 id="delete-resume-dialog-title" className="text-[14px] font-semibold text-neutral-900 tracking-tight">
                  Delete resume?
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal break-words">
                  Are you sure you want to permanently delete <span className="font-semibold text-neutral-800">"{resumeToDelete.title}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-100/80">
              <button
                type="button"
                disabled={isDeletingResume}
                onClick={() => setResumeToDelete(null)}
                className="px-3.5 py-1.5 rounded-[10px] border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100/80 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingResume}
                onClick={handleConfirmDeleteResume}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {isDeletingResume ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Resume</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Unsaved Changes Alert Modal */}
      {pendingNavigation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPendingNavigation(null)}
        >
          <div
            className="bg-white/95 rounded-[16px] border border-black/5 p-5 max-w-sm w-full shadow-2xl shadow-black/10 space-y-4 animate-in zoom-in-95 duration-200 text-left backdrop-blur-xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="unsaved-changes-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-[12px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1 pt-0.5 min-w-0">
                <h3 id="unsaved-changes-dialog-title" className="text-[14px] font-semibold text-neutral-900 tracking-tight">
                  Unsaved changes?
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal break-words">
                  You have unsaved changes in <span className="font-semibold text-neutral-800">"{resumeTitle || 'Untitled'}"</span>. If you {pendingNavigation.type === 'reload' ? 'reload the page' : pendingNavigation.type === 'switch_resume' ? `switch to "${pendingNavigation.customTitle || 'another resume'}"` : pendingNavigation.type === 'new_resume' ? 'create a new resume' : 'leave or navigate away'}, your recent edits will be lost.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-100/80">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  const action = pendingNavigation.action;
                  setHasUnsavedChanges(false);
                  hasUnsavedChangesRef.current = false;
                  setPendingNavigation(null);
                  action();
                }}
                className="px-3.5 py-1.5 rounded-[10px] border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100/80 transition-all cursor-pointer disabled:opacity-50"
              >
                Leave
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    await performRealSave(resumeData, resumeTitle, template);
                    setHasUnsavedChanges(false);
                    hasUnsavedChangesRef.current = false;
                    const action = pendingNavigation.action;
                    setPendingNavigation(null);
                    action();
                  } catch (err) {
                    console.error('Failed to save before navigating:', err);
                    showToast('Could not save resume. Please try again.', 'error');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] bg-brand-green hover:bg-brand-greenHover text-brand-dark text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleUploadResumeFile(file);
          }
        }}
        className="hidden"
      />

      <PrintPortal
        data={resumeDataRef.current || resumeData}
        template={template}
      />
    </div>
  );
}
