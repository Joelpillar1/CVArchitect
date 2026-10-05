import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { loadFromStorage } from '../utils/statePersistence';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import {
    Sparkles,
    MessageSquare,
    FileText,
    Plus,
    ArrowUp,
    ArrowRight,
    Trash2,
    Check,
    Copy,
    CheckCircle2,
    RefreshCw,
    Loader2,
    Building2,
    AlertCircle,
    Zap,
    Target,
    History,
    Clock,
    RotateCcw,
    Bookmark,
    ChevronRight
} from 'lucide-react';
import { BorderBeam } from 'border-beam';
import { useStreamingPlaceholder } from '../utils/useStreamingPlaceholder';
import { analyzeResume, AnalyticsResult } from './utils/resumeAnalytics';
import { tailorResumeToJob } from './utils/aiEnhancer';
import { callAIText, callAIJSON } from '../services/aiService';
import { parseJobDescription, analyzeJobMatch } from '../services/resumeAgentService';
import { JobDescriptionData, JobMatchAnalysis } from '../types/resumeAgent';
import { ensureAllBulletsHaveUniqueVerbs, getUsedStartingVerbs, detectActionVerbDomain } from '../utils/actionVerbs';
import { versionService, ResumeVersion } from '../services/versionService';

interface EditorSidebarRightProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onSave?: () => void;
    onSaveAsTemplate?: () => void;
    currentResumeId?: string | null;
    currentTemplate?: TemplateType;
    userSubscription: UserSubscription;
    onAIAction: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
    embedded?: boolean;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'agent';
    timestamp: number;
    type: 'welcome' | 'text' | 'job_analysis' | 'tailored_success' | 'proposal';
    text?: string;
    analysis?: {
        jobTitle?: string;
        company?: string;
        matchScore: number;
        atsScore?: number;
        categoryScores?: {
            experienceMatch?: number;
            skillsMatch?: number;
            keywordCoverage?: number;
            roleAlignment?: number;
            atsStructure?: number;
        };
        strategy?: {
            titleAndSummaryKeywords: string[];
            experienceKeywords: string[];
            coreCompetencies: string[];
        };
        strengths?: string[];
        gaps?: string[];
        jobData?: JobDescriptionData;
    };
    proposal?: {
        section: 'title' | 'summary' | 'title_and_summary' | 'keyAchievements' | 'experience' | 'projects' | 'leadership' | 'additionalInfo' | 'skills';
        title: string;
        original?: string;
        proposed: string;
        proposedTitle?: string;
        proposedSummary?: string;
        proposedSkills?: string;
        proposedExperience?: { role: string; company: string; description: string }[];
        experienceIndex?: number;
        projectIndex?: number;
        leadershipIndex?: number;
        additionalInfoIndex?: number;
        jobData?: JobDescriptionData;
        applied?: boolean;
        skipped?: boolean;
        mode?: 'append' | 'replace';
    };
    actionPrompt?: {
        label: string;
        stepDescription?: string;
        onClickType: 'tailor_title_summary' | 'tailor_achievements' | 'tailor_experience' | 'tailor_projects' | 'tailor_leadership' | 'tailor_additional_info' | 'harmonize_skills';
        expIndex?: number;
        projIndex?: number;
        leadIndex?: number;
        infoIndex?: number;
        jobData?: JobDescriptionData;
    };
    suggestions?: string[];
    isStreaming?: boolean;
}

/** Lightweight Markdown renderer for structured AI chat output */
function FormattedMarkdown({ content, className = '' }: { content: string; className?: string }) {
    if (!content) return null;

    const renderInline = (text: string) => {
        const cleanText = text.replace(/✨/g, '').trimStart();
        const parts: React.ReactNode[] = [];
        const regex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
        let match: RegExpExecArray | null;
        let lastIndex = 0;
        let keyIdx = 0;

        while ((match = regex.exec(cleanText)) !== null) {
            if (match.index > lastIndex) {
                parts.push(cleanText.substring(lastIndex, match.index));
            }
            const raw = match[0];
            if ((raw.startsWith('**') && raw.endsWith('**')) || (raw.startsWith('__') && raw.endsWith('__'))) {
                parts.push(
                    <strong key={keyIdx++} className="font-semibold text-neutral-900">
                        {raw.slice(2, -2)}
                    </strong>
                );
            } else if ((raw.startsWith('*') && raw.endsWith('*')) || (raw.startsWith('_') && raw.endsWith('_'))) {
                parts.push(
                    <em key={keyIdx++} className="italic text-neutral-800">
                        {raw.slice(1, -1)}
                    </em>
                );
            } else if (raw.startsWith('`') && raw.endsWith('`')) {
                parts.push(
                    <code key={keyIdx++} className="bg-neutral-100 px-1 py-0.5 rounded text-[11px] font-mono text-emerald-800 border border-neutral-200">
                        {raw.slice(1, -1)}
                    </code>
                );
            }
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < cleanText.length) {
            parts.push(cleanText.substring(lastIndex));
        }
        return parts;
    };

    const lines = content.split('\n');
    return (
        <div className={`space-y-1.5 text-xs text-neutral-700 leading-relaxed break-words ${className}`}>
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-1" />;
                if (trimmed.startsWith('# ')) {
                    return <h3 key={i} className="font-bold text-sm text-neutral-900 mt-2">{renderInline(trimmed.slice(2))}</h3>;
                }
                if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
                    return <h4 key={i} className="font-bold text-xs text-neutral-900 mt-1.5">{renderInline(trimmed.replace(/^#+\s/, ''))}</h4>;
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
                    return (
                        <div key={i} className="flex items-start gap-1.5 pl-1">
                            <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                            <span>{renderInline(trimmed.replace(/^[-•*]\s/, ''))}</span>
                        </div>
                    );
                }
                const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
                if (numMatch) {
                    return (
                        <div key={i} className="flex items-start gap-1.5 pl-1">
                            <span className="text-emerald-600 font-bold shrink-0 text-[11px]">{numMatch[1]}.</span>
                            <span>{renderInline(numMatch[2])}</span>
                        </div>
                    );
                }
                return <p key={i}>{renderInline(trimmed)}</p>;
            })}
        </div>
    );
}

/** Generate a unique and stable storage key for each resume's chat history */
function getResumeChatStorageKey(resumeId?: string | null, resumeData?: ResumeData): string {
    if (resumeId && typeof resumeId === 'string' && resumeId.trim()) {
        return `cv_chat_msgs_${resumeId.trim()}`;
    }
    const dataId = (resumeData as any)?.id;
    if (dataId && typeof dataId === 'string' && dataId.trim()) {
        return `cv_chat_msgs_${dataId.trim()}`;
    }
    const tag = (resumeData?.currentTag || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const name = (resumeData?.fullName || 'untitled').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const email = (resumeData?.email || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const firstExpRole = (resumeData?.experience && resumeData.experience[0]?.role || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const firstExpCo = (resumeData?.experience && resumeData.experience[0]?.company || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Stable identifier per resume so title edits during tailoring do NOT break or bleed key
    const fingerprint = `${name}_${email}_${tag}_${firstExpRole}_${firstExpCo}`.replace(/^_+|_+$/g, '') || 'default_draft';
    return `cv_chat_msgs_draft_${fingerprint}`;
}

export default function EditorSidebarRight({
    data,
    onChange,
    onSave,
    onAIAction,
    currentResumeId,
    userSubscription,
    embedded = false
}: EditorSidebarRightProps) {
    const isEmbeddedPreview = Boolean(embedded || userSubscription?.userId === 'preview');
    const broadcastHighlight = (path: string, action: 'highlight' | 'applied' | 'clear' = 'highlight', duration?: number) => {
        if (typeof window !== 'undefined' && path) {
            window.dispatchEvent(
                new CustomEvent('cv_agent_highlight', {
                    detail: { path, action, duration }
                })
            );
        }
    };

    const getProposalTargetDataPath = (proposal?: NonNullable<ChatMessage['proposal']> | null): string => {
        if (!proposal) return '';
        if (proposal.section === 'title_and_summary') return 'summary';
        if (proposal.section === 'summary') return 'summary';
        if (proposal.section === 'title') return 'jobTitle';
        if (proposal.section === 'skills') return 'skills';
        if (proposal.section === 'keyAchievements') return 'keyAchievements';
        if (proposal.section === 'experience') {
            return `experience.${proposal.experienceIndex ?? 0}`;
        }
        if (proposal.section === 'projects') {
            return `projects.${proposal.projectIndex ?? 0}`;
        }
        if (proposal.section === 'leadership') {
            return `leadership.${proposal.leadershipIndex ?? 0}`;
        }
        if (proposal.section === 'additionalInfo') {
            return `additionalInfo.${proposal.additionalInfoIndex ?? 0}`;
        }
        return '';
    };

    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'chat' | 'context' | 'history'>('chat');
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('Architecting role alignment...');
    const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Version history states
    const [sidebarVersions, setSidebarVersions] = useState<ResumeVersion[]>([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [snapshotName, setSnapshotName] = useState('');
    const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
    const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

    // Detect pending chat prompt from navigation state or localStorage and prefill chat input
    useEffect(() => {
        const statePrompt = (location.state as any)?.pendingChatPrompt;
        const storedPrompt = loadFromStorage<string | null>('cv_pending_chat_prompt', null);
        const promptToSet = statePrompt || storedPrompt;

        if (promptToSet && typeof promptToSet === 'string' && promptToSet.trim()) {
            setActiveTab('chat');
            setInputText(promptToSet.trim());
            try {
                localStorage.removeItem('cv_pending_chat_prompt');
            } catch (_) {}

            // Automatically focus and auto-expand the textarea
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.style.height = 'auto';
                    const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 38), 160);
                    textareaRef.current.style.height = `${newHeight}px`;
                }
            }, 100);
        }
    }, [location.state]);

    const effectiveResumeId = currentResumeId || (data as any)?.id || 'current_draft';

    const loadSidebarVersions = useCallback(async () => {
        setIsLoadingVersions(true);
        try {
            const list = await versionService.getVersions(effectiveResumeId);
            setSidebarVersions(list);
        } catch (e) {
            console.error('Failed to load resume versions:', e);
        } finally {
            setIsLoadingVersions(false);
        }
    }, [effectiveResumeId]);

    useEffect(() => {
        if (activeTab === 'history') {
            loadSidebarVersions();
        }
    }, [activeTab, loadSidebarVersions]);

    const handleCreateSidebarSnapshot = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const name = snapshotName.trim() || `Milestone (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
        setIsCreatingSnapshot(true);
        try {
            await versionService.createVersion(effectiveResumeId, data, name, 'Manual checkpoint');
            setSnapshotName('');
            await loadSidebarVersions();
        } catch (err) {
            console.error('Failed to create snapshot:', err);
        } finally {
            setIsCreatingSnapshot(false);
        }
    };

    const handleRestoreSidebarVersion = async (version: ResumeVersion) => {
        const confirmRestore = window.confirm(
            `Restore "${version.version_name || `Version ${version.version_number}`}"? Any unsaved edits since this version will be replaced.`
        );
        if (!confirmRestore) return;

        setRestoringVersionId(version.id);
        try {
            onChange(version.content);
            if (onSave) {
                onSave();
            }
        } catch (err) {
            console.error('Failed to restore version:', err);
        } finally {
            setRestoringVersionId(null);
        }
    };

    const handleDeleteSidebarVersion = async (versionId: string, versionName: string) => {
        const confirmDelete = window.confirm(`Delete snapshot "${versionName}"?`);
        if (!confirmDelete) return;

        try {
            await versionService.deleteVersion(effectiveResumeId, versionId);
            setSidebarVersions(prev => prev.filter(v => v.id !== versionId));
        } catch (err) {
            console.error('Failed to delete version:', err);
        }
    };

    const formatTimestamp = (iso: string) => {
        try {
            const date = new Date(iso);
            return {
                relative: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
            };
        } catch {
            return { relative: 'Recently', time: '' };
        }
    };

    const streamingPlaceholder = useStreamingPlaceholder([
        "Paste job description here to scan match...",
        "Paste target job requirements to tailor...",
        "Paste a job posting to optimize your resume...",
        "Ask anything or paste a job description...",
        "Paste job description to find keyword gaps..."
    ]);

    const chatScrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Build initial welcome message instructing users to paste a job description
    const initialWelcomeMessage: ChatMessage = useMemo(() => {
        return {
            id: 'welcome-1',
            sender: 'agent',
            timestamp: Date.now(),
            type: 'welcome'
        };
    }, []);

    // Active resume-specific storage key
    const currentStorageKey = useMemo(() => {
        return getResumeChatStorageKey(currentResumeId, data);
    }, [currentResumeId, data?.currentTag, data?.fullName, data?.email, data?.experience?.[0]?.role, data?.experience?.[0]?.company]);

    // Load messages isolated strictly for the current resume
    const loadMessagesForCurrentResume = useCallback((): ChatMessage[] => {
        // 1. Try reading from data.agentMessages if present on this specific resume
        if (data?.agentMessages && Array.isArray(data.agentMessages) && data.agentMessages.length > 0) {
            return data.agentMessages as unknown as ChatMessage[];
        }

        // 2. Try reading from localStorage for this specific resume key
        try {
            const saved = localStorage.getItem(currentStorageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed as ChatMessage[];
                }
            }
        } catch (e) {
            console.error('Failed to load chat messages for resume:', e);
        }

        // 3. Fallback to fresh clean welcome message (NO bleed from other resumes)
        return [initialWelcomeMessage];
    }, [currentStorageKey, data?.agentMessages, initialWelcomeMessage]);

    const [messages, setMessages] = useState<ChatMessage[]>(loadMessagesForCurrentResume);

    // Keep track of current key to detect resume switches and prevent bleeding
    const activeKeyRef = useRef(currentStorageKey);

    useEffect(() => {
        if (activeKeyRef.current !== currentStorageKey) {
            activeKeyRef.current = currentStorageKey;
            setMessages(loadMessagesForCurrentResume());
        }
    }, [currentStorageKey, loadMessagesForCurrentResume]);

    // Persist messages whenever they change under the isolated resume key and sync to resume data
    useEffect(() => {
        if (!messages || messages.length === 0) return;
        try {
            localStorage.setItem(currentStorageKey, JSON.stringify(messages));
        } catch (e) {
            console.error('Failed to save chat messages to localStorage:', e);
        }
        // Sync completed messages into resume data so Supabase saves chat history
        const hasStreaming = messages.some(m => m.isStreaming);
        if (!hasStreaming && !isProcessing) {
            const currentSavedMsgs = data?.agentMessages || [];
            if (JSON.stringify(currentSavedMsgs) !== JSON.stringify(messages)) {
                onChange({ ...data, agentMessages: messages as any });
            }
        }
    }, [messages, currentStorageKey, isProcessing, data]);

    // Keep scroll anchored to bottom
    useEffect(() => {
        if (chatScrollRef.current && activeTab === 'chat') {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages, isProcessing, activeTab]);

    // Auto-adjust textarea height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 38), 140);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [inputText]);

    // Process and deeply analyze Job Description
    const handleProcessJobDescription = async (jobText: string) => {
        const cleanJobText = jobText.trim();
        if (!cleanJobText) return;

        // Auto-save a safety checkpoint before tailoring
        const effectiveId = currentResumeId || (data as any)?.id || 'current_draft';
        if (!isEmbeddedPreview) {
            versionService.createVersion(
                effectiveId,
                data,
                `Auto-snapshot Before Tailoring (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
                'Automatic restore point before AI job tailoring'
            ).catch(e => console.warn('Auto-snapshot error:', e));
        }

        // Update resume data job description
        const updatedData = { ...data, jobDescription: cleanJobText, hasJobMatchRun: false };
        onChange(updatedData);

        setProcessingStatus('Extracting target competencies & recruiter signals...');
        setIsProcessing(true);
        const analyzingMsgId = `analyzing-${Date.now()}`;
        setMessages(prev => [
            ...prev,
            {
                id: analyzingMsgId,
                sender: 'agent',
                timestamp: Date.now(),
                type: 'text',
                text: 'Analyzing Job Description against your resume and architecting your step-by-step tailoring strategy...'
            }
        ]);

        if (isEmbeddedPreview) {
            setTimeout(() => {
                const firstLine = cleanJobText.split('\n')[0].replace(/^#+\s*|^job\s*title:\s*/i, '').trim();
                const inferredTitle = firstLine.length > 3 && firstLine.length < 50 ? firstLine : 'Senior Product Manager';
                const mockJob: JobDescriptionData = {
                    title: inferredTitle,
                    company: 'Target Employer',
                    keywords: ['Product Strategy', 'Go-to-Market', 'Agile / Scrum', 'Roadmap Planning', 'User Research', 'Data Analysis', 'Enterprise SaaS', 'A/B Testing'],
                    requiredSkills: ['Product Strategy', 'Cross-functional Leadership', 'Agile Methodologies', 'Data-driven Decision Making', 'SQL', 'A/B Testing'],
                    rawText: cleanJobText
                };

                const analysisMsg: ChatMessage = {
                    id: `msg-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'job_analysis',
                    analysis: {
                        jobTitle: inferredTitle,
                        company: 'Target Employer',
                        matchScore: 76,
                        atsScore: 88,
                        categoryScores: {
                            experienceMatch: 80,
                            skillsMatch: 75,
                            keywordCoverage: 76,
                            roleAlignment: 82,
                            atsStructure: 95
                        },
                        strategy: {
                            titleAndSummaryKeywords: ['Product Strategy', 'Enterprise SaaS', 'Go-to-Market'],
                            experienceKeywords: ['Cross-functional Leadership', 'Agile / Scrum', 'Revenue Growth', 'User Churn'],
                            coreCompetencies: ['Roadmap Planning', 'Data Analysis (SQL)', 'A/B Testing']
                        },
                        strengths: ['Strong 8+ years foundational experience', 'Quantified revenue and metric outcomes in past roles'],
                        gaps: ['Job title alignment in executive summary', 'Keyword integration in secondary experience bullets'],
                        jobData: mockJob
                    }
                };

                setMessages(prev => prev.filter(m => m.id !== analyzingMsgId).concat(analysisMsg));
                setIsProcessing(false);
            }, 600);
            return;
        }

        try {
            // 1. Deep parse Job Description using AI
            const parsedJob = await parseJobDescription(cleanJobText);

            // 2. Perform deep match evaluation
            const matchAnalysis = await analyzeJobMatch(updatedData, parsedJob);

            // 3. Stopwords filter for clean keyword presentation
            const stopwords = new Set([
                'and', 'the', 'for', 'with', 'in', 'of', 'to', 'a', 'an', 'including', 'new',
                'every', 'remote', 'people', 'hiring', 'work', 'job', 'team', 'candidate', 'role',
                'opportunity', 'experience', 'years', 'skills', 'responsibilities', 'join', 'company'
            ]);

            // Helper to sanitize and condense keywords into concise badges
            const cleanKeywordTag = (text: string): string => {
                if (!text) return '';
                let clean = text.trim()
                    .replace(/^(experience (with|in|designing|building|developing|working)|ability to|proven track record (of|in)|understanding of|knowledge of|strong|robust|sharp|effective|proficient in|hands-on)\s+/i, '')
                    .replace(/[,;].*$/, '')
                    .trim();
                if (clean.length > 22) {
                    clean = clean.slice(0, 20).trim() + '…';
                }
                return clean.replace(/\b\w/g, c => c.toUpperCase());
            };

            const cleanKeywords = (parsedJob.keywords || [])
                .map(k => cleanKeywordTag(k))
                .filter(k => k.length > 2 && !stopwords.has(k.toLowerCase()));

            const cleanSkills = (parsedJob.requiredSkills || [])
                .map(s => cleanKeywordTag(s))
                .filter(s => s.length > 2 && !stopwords.has(s.toLowerCase()));

            // Strategic distribution of keywords:
            const titleAndSummaryKeywords = Array.from(new Set([
                cleanKeywordTag(parsedJob.title),
                parsedJob.domain ? cleanKeywordTag(parsedJob.domain) : '',
                ...cleanKeywords.slice(0, 3)
            ].filter(Boolean))).slice(0, 4);

            const experienceKeywords = Array.from(new Set(cleanKeywords.slice(2, 7))).filter(Boolean);
            const coreCompetencies = Array.from(new Set(cleanSkills.slice(0, 5))).filter(Boolean);

            const analysisMsg: ChatMessage = {
                id: `msg-${Date.now()}`,
                sender: 'agent',
                timestamp: Date.now(),
                type: 'job_analysis',
                analysis: {
                    jobTitle: parsedJob.title,
                    company: parsedJob.company,
                    matchScore: matchAnalysis.matchScore,
                    atsScore: matchAnalysis.categoryScores?.atsStructure || 92,
                    categoryScores: matchAnalysis.categoryScores,
                    strategy: {
                        titleAndSummaryKeywords,
                        experienceKeywords: experienceKeywords.length > 0 ? experienceKeywords : cleanKeywords.slice(0, 4),
                        coreCompetencies: coreCompetencies.length > 0 ? coreCompetencies : ['Core domain skills']
                    },
                    strengths: matchAnalysis.strongMatches || ['Relevant work history', 'Core foundational skills'],
                    gaps: matchAnalysis.gaps || ['Target role title alignment', 'Quantified domain outcomes'],
                    jobData: parsedJob
                }
            };

            setMessages(prev => prev.filter(m => m.id !== analyzingMsgId).concat(analysisMsg));
        } catch (err: any) {
            console.error('Job processing failed, using fallback analysis:', err);
            const analytics: AnalyticsResult = analyzeResume(updatedData);
            const fallbackMsg: ChatMessage = {
                id: `msg-${Date.now()}`,
                sender: 'agent',
                timestamp: Date.now(),
                type: 'job_analysis',
                analysis: {
                    jobTitle: 'Target Role',
                    company: 'Target Employer',
                    matchScore: analytics.jobMatchScore || 75,
                    atsScore: analytics.atsScore || 85,
                    categoryScores: {
                        experienceMatch: 75,
                        skillsMatch: 70,
                        keywordCoverage: 72,
                        roleAlignment: 78,
                        atsStructure: 90
                    },
                    strategy: {
                        titleAndSummaryKeywords: ['Target Role Alignment', 'Executive Narrative'],
                        experienceKeywords: ['Domain Tools', 'Quantified Outcomes', 'Leadership Scope'],
                        coreCompetencies: ['Core Domain Skills']
                    },
                    strengths: ['Foundational professional background'],
                    gaps: ['Keyword integration in bullet points', 'Professional title alignment']
                },
                suggestions: [
                    'Step 1: Align Title & Summary',
                    'Step 2: Tailor Experience Bullets',
                    'Tailor Entire Resume'
                ]
            };
            setMessages(prev => prev.filter(m => m.id !== analyzingMsgId).concat(fallbackMsg));
        } finally {
            setIsProcessing(false);
        }
    };

    // Step 1: Align Professional Title & Summary
    const handleAlignTitleAndSummary = async (job?: JobDescriptionData) => {
        if (!isEmbeddedPreview && onAIAction && !onAIAction('ai_rewrite')) return;
        const targetJobTitle = job?.title || data.jobTitle || 'Senior Product Manager';
        const targetCompany = job?.company || 'Target Company';
        const targetKeywords = job?.keywords?.slice(0, 6).join(', ') || '';

        setProcessingStatus('Synthesizing executive positioning & narrative...');
        setIsProcessing(true);

        if (isEmbeddedPreview) {
            setTimeout(() => {
                const proposedSummary = `Results-driven Senior Product Leader with 8+ years of experience leading cross-functional engineering and design teams to deliver scalable enterprise software solutions. Proven track record of increasing user engagement, driving multi-million dollar revenue growth, and launching successful B2B SaaS products from conception through go-to-market. Adept at agile methodologies, user-centered design, and data-driven product strategy.`;
                setMessages(prev => [
                    ...prev,
                    {
                        id: `proposal-${Date.now()}`,
                        sender: 'agent',
                        timestamp: Date.now(),
                        type: 'proposal',
                        proposal: {
                            section: 'title_and_summary',
                            title: 'Step 1: Strategic Title & Summary Alignment',
                            proposedTitle: targetJobTitle,
                            proposedSummary,
                            proposed: `**Target Professional Title:**\n${targetJobTitle}\n\n**Executive Summary:**\n${proposedSummary}`,
                            jobData: job
                        },
                        text: `Here is your **Step 1 Strategy**: Aligned your professional title and executive summary for **${targetJobTitle}**:`
                    }
                ]);
                setIsProcessing(false);
            }, 350);
            return;
        }

        try {
            const prompt = `You are an elite Executive Resume Strategist.
Your goal is to strategically align the candidate's Professional Job Title and Executive Summary for the target role: "${targetJobTitle}".
Target Keywords to naturally integrate into the summary: ${targetKeywords}

Candidate Current Title: "${data.jobTitle || 'Professional'}"
Candidate Current Summary: "${data.summary || 'Experienced professional with a strong track record of success.'}"
Candidate Experience Context: ${data.experience.map(e => `${e.role} at ${e.company}`).join('; ')}

CRITICAL RULES:
1. STRICT BAN ON CLICHÉ OPENERS: NEVER start the summary with "Dynamic", "Results-driven", "Results-oriented", "Seasoned", "Passionate", "Dedicated", "Motivated", "Hardworking", "Self-starter", "Proven track record", "Adept at", or "Accomplished".
2. DYNAMIC & AUTHORITATIVE OPENING: Open naturally with the candidate's professional title and core functional specialization (e.g., "${targetJobTitle} specializing in...", "${targetJobTitle} with extensive experience in...").
3. NEVER MENTION THE TARGET COMPANY AS A PAST EMPLOYER: Do NOT claim the candidate worked at "${targetCompany}" or mention "${targetCompany}" as a prior employer/client. The candidate is applying to this company!
4. NEVER FABRICATE NICHE SECTORS: Do NOT invent past experience in specific niche domains (e.g., "FinCrime", "defense avionics") unless supported by the candidate's real experience. Focus on transferable functional skills.

Return strictly valid JSON with this exact shape:
{
  "proposedTitle": "Strategic target job title (e.g. ${targetJobTitle})",
  "proposedSummary": "High-impact 2-3 sentence executive summary that naturally weaves target keywords into the candidate's real background without generic buzzwords or inventing facts."
}`;

            const res = await callAIJSON(prompt, 'gpt-4o', 0.3);
            const proposedTitle = res.proposedTitle || targetJobTitle;
            const proposedSummary = res.proposedSummary || data.summary;

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'title_and_summary',
                        title: 'Step 1: Strategic Title & Summary Alignment',
                        proposedTitle,
                        proposedSummary,
                        proposed: `**Target Professional Title:**\n${proposedTitle}\n\n**Executive Summary:**\n${proposedSummary}`,
                        jobData: job
                    },
                    text: `Here is your **Step 1 Strategy**: Aligned your professional title and executive summary for **${targetJobTitle}**:`
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: 'Could not generate Title & Summary alignment right now. Please try again.'
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Step: Tailor Key Achievements & Career Highlights
    const handleTailorAchievements = async (job?: JobDescriptionData) => {
        if (!isEmbeddedPreview && onAIAction && !onAIAction('bullet_optimization')) return;
        setProcessingStatus('Aligning flagship achievements with target role outcomes...');
        setIsProcessing(true);
        const targetJobTitle = job?.title || data.jobTitle || 'Target Role';
        const targetCompany = job?.company || 'Target Company';
        const keywords = job?.keywords?.slice(0, 10).join(', ') || '';
        const currentAchievements = Array.isArray(data.keyAchievements)
            ? data.keyAchievements.join('\n')
            : (data.keyAchievements || 'Spearheaded strategic deliverables, scaled operations, and generated business impact.');
        const usedVerbs = getUsedStartingVerbs(data);
        const forbiddenVerbsList = Array.from(usedVerbs).slice(0, 15).join(', ');

        if (isEmbeddedPreview) {
            setTimeout(() => {
                const cleanBullets = `• Spearheaded the end-to-end launch of 3 major B2B SaaS products, driving widespread enterprise adoption and generating $8.4M in new annual recurring revenue within the first 12 months of release.
• Directed user-centric product discovery across 200+ targeted user interviews, executing strategic UX roadmap pivots that reduced trial-to-paid friction by 28%.
• Awarded President's Club Award 2022 & 2023 for consistently exceeding global ARR targets by over 140% during challenging market conditions.`;

                setMessages(prev => [
                    ...prev,
                    {
                        id: `proposal-${Date.now()}`,
                        sender: 'agent',
                        timestamp: Date.now(),
                        type: 'proposal',
                        proposal: {
                            section: 'keyAchievements',
                            title: 'Key Achievements & Career Highlights',
                            proposed: cleanBullets,
                            proposedSummary: cleanBullets,
                            jobData: job
                        },
                        text: `Here is your **Key Achievements Strategy**: Elevated your career highlights to match **${targetJobTitle}** with Google XYZ impact bullets:`
                    }
                ]);
                setIsProcessing(false);
            }, 350);
            return;
        }

        try {
            const prompt = `You are an elite Executive Resume Strategist & Recruiter.
Elevate and tailor the candidate's Key Achievements / Flagship Career Highlights for this target role:
Target Job: "${targetJobTitle} at ${targetCompany}"
Target Keywords to naturally integrate: ${keywords}

Candidate's Current Key Achievements:
${currentAchievements}

CRITICAL RULES:
1. Generate 3 to 4 flagship achievement bullet points.
2. Every bullet MUST follow Google XYZ format: [Decisive Action Verb] + [Technical Challenge / Scope] + [Method / Tools / Execution] + [Measurable Business Outcome].
3. STRICT ZERO-DUPLICATE STARTING VERBS: Every bullet MUST open with a COMPLETELY UNIQUE power action verb.
4. FORBIDDEN STARTING VERBS: Avoid reusing [${forbiddenVerbsList || 'None'}].
5. MANDATORY METRIC PRESERVATION & % CAPPING: If candidate text has authentic numbers (dollars, team sizes, user counts, latency stats), PRESERVE them. If the original text has multiple percentages (%), LIMIT them to at most 1 percentage across all achievements, reframing other bullets into concrete technical architecture, revenue, or scope impact.
6. Calibrate each bullet to 2 full lines (24-34 words / 150-220 characters).
7. NO % SPAM: Do NOT invent fake percentages or repeat % across every bullet. Focus on technical architecture, system throughput, deliverables, scale, and business outcomes.
8. Strictly truthful: weave target keywords (${keywords}) into their REAL accomplishments.
9. Format each bullet starting with '• '. Output ONLY the bullet points, nothing else.`;

            const res = await callAIText(prompt);
            const domain = detectActionVerbDomain(`${targetJobTitle} ${keywords}`);
            const cleanBullets = ensureAllBulletsHaveUniqueVerbs(res.trim(), usedVerbs, domain);

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'keyAchievements',
                        title: 'Key Achievements & Career Highlights',
                        proposed: cleanBullets,
                        proposedSummary: cleanBullets,
                        jobData: job
                    },
                    text: `Here is your **Key Achievements Strategy**: Elevated your career highlights to match **${targetJobTitle}** with Google XYZ impact bullets:`
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: 'Could not tailor Key Achievements right now. Please try again.'
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Step: Tailor Experience Bullets Role-by-Role (one by one)
    const handleTailorExperience = async (job?: JobDescriptionData, expIndex = 0) => {
        if (!isEmbeddedPreview && onAIAction && !onAIAction('bullet_optimization')) return;
        if (!data.experience || data.experience.length === 0) {
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: 'Please add at least one work experience entry first in the editor before tailoring.'
                }
            ]);
            return;
        }

        const totalExp = data.experience.length;
        if (expIndex >= totalExp) {
            const nextStep = getNextStepPrompt('experience', expIndex - 1, job);
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        }

        const currentExp = data.experience[expIndex];
        setProcessingStatus(`Engineering Google XYZ impact bullets for ${currentExp?.role || 'role'}...`);
        setIsProcessing(true);
        const targetJobTitle = job?.title || data.jobTitle || 'Target Role';
        const targetCompany = job?.company || 'Target Employer';
        const keywords = job?.keywords?.slice(0, 10).join(', ') || '';
        const usedVerbs = getUsedStartingVerbs(data);
        const forbiddenVerbsList = Array.from(usedVerbs).slice(0, 15).join(', ');

        if (isEmbeddedPreview) {
            setTimeout(() => {
                const cleanBullets = `• Spearheaded the development and launch of an AI-powered analytics dashboard, increasing user retention by 35% within the first two quarters.
• Led a cross-functional team of 14 engineers, designers, and marketers in an Agile environment to deliver product updates on a bi-weekly cadence.
• Grew annual recurring revenue (ARR) for the primary SaaS product line by $4.2M through strategic pricing optimization and feature expansion.
• Conducted over 100+ user interviews to identify pain points, resulting in a roadmap pivot that reduced customer churn by 18%.`;
                const previewText = `**${currentExp.role || 'Role'} at ${currentExp.company || 'Company'}**:\n${cleanBullets}`;

                setMessages(prev => [
                    ...prev,
                    {
                        id: `proposal-${Date.now()}`,
                        sender: 'agent',
                        timestamp: Date.now(),
                        type: 'proposal',
                        proposal: {
                            section: 'experience',
                            experienceIndex: expIndex,
                            title: `Experience ${expIndex + 1} of ${totalExp} — ${currentExp.role || 'Role'} at ${currentExp.company || 'Company'}`,
                            proposed: previewText,
                            proposedTitle: currentExp.role,
                            proposedSummary: cleanBullets,
                            jobData: job
                        },
                        text: `Here is your **Experience Strategy (Role ${expIndex + 1} of ${totalExp})** for **${currentExp.role || 'Role'} at ${currentExp.company || 'Company'}**:\n\nRewrote accomplishments into Google XYZ impact bullets embedding target keywords:`
                    }
                ]);
                setIsProcessing(false);
            }, 350);
            return;
        }

        try {
            const prompt = `You are an elite Executive Resume Strategist & Recruiter.
Tailor and elevate the candidate's work experience bullet points for this specific role:
Role: "${currentExp.role || 'Position'}" at "${currentExp.company || 'Company'}"
Target Job: "${targetJobTitle} at ${targetCompany}"
Target Keywords to naturally integrate: ${keywords}

Candidate's Current Bullets for this role:
${currentExp.description || 'Led key initiatives, managed daily operations, and contributed to team deliverables.'}

CRITICAL RULES:
1. Generate 3 to 4 impactful bullet points.
2. Every bullet MUST follow Google XYZ format: [Decisive Action Verb] + [Technical Challenge / Scope] + [Method / Tools / Execution] + [Measurable Business Outcome].
3. STRICT ZERO-DUPLICATE STARTING VERBS (MANDATORY): Every bullet point MUST open with a COMPLETELY UNIQUE, distinct power action verb (e.g. Spearheaded, Engineered, Orchestrated, Accelerated, Architected, Automated). ONE VERB MUST NEVER APPEAR TWICE across any bullets.
4. FORBIDDEN STARTING VERBS (Already used on other roles): Avoid reusing any of these starting verbs: [${forbiddenVerbsList || 'None'}].
5. MANDATORY METRIC PRESERVATION & % CAPPING (MAX 1-2 % PER ROLE): If the candidate's original bullets contain verified numbers (dollars $, team sizes, user counts, latency stats), PRESERVE and strategically retain those exact numbers. If the original resume has lots of percentages (%), STRICTLY LIMIT them: keep at most 1 to 2 most impressive percentages across this entire role, and reframe any other percentage bullets into concrete non-percentage metrics (e.g., team scale, project deliverables, latency/timeframe reductions from X to Y).
6. Calibrate each bullet to 2 full lines (24-34 words / 150-220 characters).
7. NO % SPAM & STRICT METRIC LIMITS: Do NOT output percentages on every bullet. At most 1-2 percentages per role. Express impact through technical architecture, deliverables, scope, user scale, latency, and business outcomes.
8. Strictly truthful: weave target keywords (${keywords}) into their REAL accomplishments; do NOT fabricate fake companies or impossible claims.
9. Format each bullet starting with '• '. Output ONLY the bullet points, nothing else.`;

            const res = await callAIText(prompt);
            const domain = detectActionVerbDomain(`${currentExp.role} ${currentExp.company} ${keywords}`);
            const cleanBullets = ensureAllBulletsHaveUniqueVerbs(res.trim(), usedVerbs, domain);
            const previewText = `**${currentExp.role || 'Role'} at ${currentExp.company || 'Company'}**:\n${cleanBullets}`;

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'experience',
                        experienceIndex: expIndex,
                        title: `Experience ${expIndex + 1} of ${totalExp} — ${currentExp.role || 'Role'} at ${currentExp.company || 'Company'}`,
                        proposed: previewText,
                        proposedTitle: currentExp.role,
                        proposedSummary: cleanBullets,
                        jobData: job
                    },
                    text: `Here is your **Experience Strategy (Role ${expIndex + 1} of ${totalExp})** for **${currentExp.role || 'Role'} at ${currentExp.company || 'Company'}**:\n\nRewrote accomplishments into Google XYZ impact bullets embedding target keywords:`
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Could not tailor bullets for ${currentExp.role || 'this role'} right now. Please try again.`
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Step: Tailor Projects Project-by-Project
    const handleTailorProjects = async (job?: JobDescriptionData, projIndex = 0) => {
        if (onAIAction && !onAIAction('bullet_optimization')) return;
        if (!data.projects || data.projects.length === 0) return;

        const totalProjects = data.projects.length;
        if (projIndex >= totalProjects) {
            const nextStep = getNextStepPrompt('projects', projIndex - 1, job);
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        }

        const currentProj = data.projects[projIndex];
        setProcessingStatus(`Tailoring tech stack & architecture outcomes for ${currentProj?.name || 'project'}...`);
        setIsProcessing(true);
        const targetJobTitle = job?.title || data.jobTitle || 'Target Role';
        const targetCompany = job?.company || 'Target Employer';
        const keywords = job?.keywords?.slice(0, 10).join(', ') || '';
        const usedVerbs = getUsedStartingVerbs(data);
        const forbiddenVerbsList = Array.from(usedVerbs).slice(0, 15).join(', ');

        try {
            const prompt = `You are an elite Executive Technical Resume Strategist.
Tailor and elevate the candidate's Project bullet points:
Project Name: "${currentProj.name || 'Project'}" (Role: ${currentProj.role || 'Contributor'}, Tech Stack: ${currentProj.technologies || 'Various'})
Target Job: "${targetJobTitle} at ${targetCompany}"
Target Keywords to naturally integrate: ${keywords}

Candidate's Current Project Description:
${currentProj.description || 'Built and deployed project features and core architecture.'}

CRITICAL RULES:
1. Generate 2 to 3 impactful bullet points.
2. Follow Google XYZ format: [Action Verb] + [Technical Scope & Architecture] + [Tools / Stack: ${currentProj.technologies || keywords}] + [Outcome / Performance].
3. STRICT ZERO-DUPLICATE STARTING VERBS: Unique verbs for each bullet. Avoid [${forbiddenVerbsList || 'None'}].
4. MANDATORY METRIC PRESERVATION & % CAPPING: Retain real numbers, user scale, latency, throughput, and performance figures. Limit percentages to at most 1 per project, focusing on architecture and technical deliverables.
5. Calibrate each bullet to 2 full lines (24-34 words / 150-220 characters).
6. NO % SPAM: Focus on tech stack, architecture, throughput, reliability, and deliverables without fabricating fake percentages or repeating % on every line.
7. Format each bullet starting with '• '. Output ONLY the bullet points, nothing else.`;

            const res = await callAIText(prompt);
            const domain = detectActionVerbDomain(`${currentProj.name} ${currentProj.technologies || ''} ${keywords}`);
            const cleanBullets = ensureAllBulletsHaveUniqueVerbs(res.trim(), usedVerbs, domain);
            const previewText = `**${currentProj.name || 'Project'}**:\n${cleanBullets}`;

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'projects',
                        projectIndex: projIndex,
                        title: `Project ${projIndex + 1} of ${totalProjects} — ${currentProj.name || 'Project'}`,
                        proposed: previewText,
                        proposedSummary: cleanBullets,
                        jobData: job
                    },
                    text: `Here is your **Projects Strategy (Project ${projIndex + 1} of ${totalProjects})** for **${currentProj.name || 'Project'}**:\n\nTailored tech stack and architecture bullets:`
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Could not tailor project ${currentProj.name || 'details'} right now. Please try again.`
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Step: Tailor Leadership Role-by-Role
    const handleTailorLeadership = async (job?: JobDescriptionData, leadIndex = 0) => {
        if (onAIAction && !onAIAction('bullet_optimization')) return;
        if (!data.leadership || data.leadership.length === 0) return;

        const totalLeadership = data.leadership.length;
        if (leadIndex >= totalLeadership) {
            const nextStep = getNextStepPrompt('leadership', leadIndex - 1, job);
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        }

        const currentLead = data.leadership[leadIndex];
        setProcessingStatus(`Elevating governance, mentoring & leadership for ${currentLead?.role || 'role'}...`);
        setIsProcessing(true);
        const targetJobTitle = job?.title || data.jobTitle || 'Target Role';
        const targetCompany = job?.company || 'Target Employer';
        const keywords = job?.keywords?.slice(0, 10).join(', ') || '';
        const usedVerbs = getUsedStartingVerbs(data);
        const forbiddenVerbsList = Array.from(usedVerbs).slice(0, 15).join(', ');

        try {
            const prompt = `You are an elite Executive Leadership Resume Strategist.
Tailor and elevate the candidate's Leadership & Governance bullet points:
Organization: "${currentLead.organization || currentLead.company || 'Organization'}" (Role: "${currentLead.role || 'Leader'}")
Target Job: "${targetJobTitle} at ${targetCompany}"
Target Keywords: ${keywords}

Current Leadership Description:
${currentLead.description || 'Led team initiatives, organized programs, and mentored members.'}

CRITICAL RULES:
1. Generate 2 to 3 leadership bullets emphasizing team scale, mentorship, governance, and organizational impact.
2. Follow Google XYZ format: [Action Verb] + [Leadership Scope] + [Initiative / Execution] + [Organizational Outcome].
3. STRICT ZERO-DUPLICATE STARTING VERBS. Avoid [${forbiddenVerbsList || 'None'}].
4. MANDATORY METRIC PRESERVATION & % CAPPING: Retain all team sizes, budgets, and organizational numbers. Avoid percentage spam (max 1 % across leadership); focus on headcount, budgets, and governance scope.
5. Calibrate each bullet to 2 full lines (24-34 words / 150-220 characters).
6. NO % SPAM: Retain genuine numbers, do not fabricate fake percentages.
7. Format starting with '• '. Output ONLY bullets.`;

            const res = await callAIText(prompt);
            const domain = detectActionVerbDomain(`Leadership ${currentLead.role} ${currentLead.organization || ''}`);
            const cleanBullets = ensureAllBulletsHaveUniqueVerbs(res.trim(), usedVerbs, domain);
            const previewText = `**${currentLead.role || 'Role'} at ${currentLead.organization || currentLead.company || 'Organization'}**:\n${cleanBullets}`;

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'leadership',
                        leadershipIndex: leadIndex,
                        title: `Leadership ${leadIndex + 1} of ${totalLeadership} — ${currentLead.role || 'Role'} at ${currentLead.organization || currentLead.company || 'Organization'}`,
                        proposed: previewText,
                        proposedSummary: cleanBullets,
                        jobData: job
                    },
                    text: `Here is your **Leadership Strategy (Role ${leadIndex + 1} of ${totalLeadership})** for **${currentLead.role}**:`
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Could not tailor leadership role right now. Please try again.`
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Step: Tailor Additional / Custom Sections Entry-by-Entry
    const handleTailorAdditionalInfo = async (job?: JobDescriptionData, infoIndex = 0) => {
        if (onAIAction && !onAIAction('ai_rewrite')) return;
        if (!data.additionalInfo || data.additionalInfo.length === 0) return;

        const populatedInfo = data.additionalInfo.filter(item => item && (item.label?.trim() || item.value?.trim()));
        const totalInfo = populatedInfo.length;
        if (infoIndex >= totalInfo) {
            const nextStep = getNextStepPrompt('additionalInfo', infoIndex - 1, job);
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        }

        const currentItem = populatedInfo[infoIndex];
        setProcessingStatus(`Aligning ${currentItem?.label || 'section'} details with target role context...`);
        setIsProcessing(true);
        const targetJobTitle = job?.title || data.jobTitle || 'Target Role';
        const targetCompany = job?.company || 'Target Employer';
        const keywords = job?.keywords?.slice(0, 10).join(', ') || '';
        const usedVerbs = getUsedStartingVerbs(data);
        const forbiddenVerbsList = Array.from(usedVerbs).slice(0, 15).join(', ');

        try {
            const prompt = `You are an elite Executive Resume Strategist.
Tailor and elevate the candidate's custom section "${currentItem.label || 'Additional Section'}":
Target Job: "${targetJobTitle} at ${targetCompany}"
Target Keywords to naturally integrate where relevant: ${keywords}

Current Section Content:
${currentItem.value || ''}

CRITICAL RULES:
1. Retain the candidate's authentic information and MANDATORY METRIC PRESERVATION: Preserve all real numbers, dates, volumes, dollar amounts, and credentials present in the candidate's text.
2. If the content is formatted as bullet points or a list, ensure each bullet starts with a unique power action verb without reusing: [${forbiddenVerbsList || 'None'}].
3. Calibrate wording to be punchy, professional, and aligned with ${targetJobTitle}.
4. NO % SPAM: Do not fabricate artificial metrics.
5. Return ONLY the enhanced content without markdown code blocks.`;

            const res = await callAIText(prompt);
            const cleanContent = res.trim();
            const previewText = `**${currentItem.label || 'Section'}**:\n${cleanContent}`;

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'additionalInfo',
                        additionalInfoIndex: data.additionalInfo!.findIndex(item => item.id === currentItem.id),
                        title: `${currentItem.label || 'Section'} (Item ${infoIndex + 1} of ${totalInfo})`,
                        proposed: previewText,
                        proposedSummary: cleanContent,
                        jobData: job
                    },
                    text: `Here is your **${currentItem.label || 'Section'} Strategy (Item ${infoIndex + 1} of ${totalInfo})** aligned for **${targetJobTitle}**:`
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Could not tailor ${currentItem.label || 'this section'} right now. Please try again.`
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Step: Harmonize Skills & Domain Competencies
    const handleHarmonizeSkills = async (job?: JobDescriptionData) => {
        if (!isEmbeddedPreview && onAIAction && !onAIAction('ai_rewrite')) return;
        setProcessingStatus('Mapping core competencies against ATS keyword taxonomy...');
        setIsProcessing(true);
        const targetJobTitle = job?.title || data.jobTitle || 'Target Role';
        const targetSkills = job?.requiredSkills?.slice(0, 10).join(', ') || '';

        if (isEmbeddedPreview) {
            setTimeout(() => {
                const cleanSkills = `Product Strategy, Go-to-Market Strategy, Agile / Scrum Methodology, Roadmap Planning, Data Analysis (SQL), User Research, A/B Testing, Cross-functional Leadership, UI/UX Design Principles, Enterprise SaaS`;
                setMessages(prev => [
                    ...prev,
                    {
                        id: `proposal-${Date.now()}`,
                        sender: 'agent',
                        timestamp: Date.now(),
                        type: 'proposal',
                        proposal: {
                            section: 'skills',
                            title: 'Harmonized Core Skills & ATS Competencies',
                            proposedSkills: cleanSkills,
                            proposed: cleanSkills,
                            jobData: job
                        },
                        text: `Here is your **Skills Strategy**: Harmonized your skills list to match the target job priorities for **${targetJobTitle}**:`
                    }
                ]);
                setIsProcessing(false);
            }, 350);
            return;
        }

        try {
            const prompt = `You are an elite ATS and Resume Strategist.
Harmonize, filter, and organize the candidate's core technical skills to strongly align with the target role "${targetJobTitle}".
Candidate current skills: "${data.skills || ''}"
Target role required skills: "${targetSkills}"

RULES:
1. Retain genuine candidate skills and align terminology with target industry standards.
2. Remove generic buzzwords, stop words, and conversational words (e.g. no "people", "including", "new", "every").
3. Return ONLY a clean, comma-separated list of top 8-12 concise skills/tools (e.g. "React.js, TypeScript, Next.js, Node.js, GraphQL, REST APIs, TailwindCSS, Jest, CI/CD, AWS") without quotes or markdown.`;

            const res = await callAIText(prompt);
            const cleanSkills = res.trim().replace(/^["']|["']$/g, '');

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'skills',
                        title: 'Harmonized Core Skills & ATS Competencies',
                        proposedSkills: cleanSkills,
                        proposed: cleanSkills,
                        jobData: job
                    },
                    text: `Here is your **Skills Strategy**: Harmonized your skills list to match the target job priorities for **${targetJobTitle}**:`
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: 'Could not harmonize skills right now. Please try again.'
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Run 1-Click full AI tailoring
    const handleTailorResume = async () => {
        if (!isEmbeddedPreview && onAIAction && !onAIAction('ai_rewrite')) {
            return;
        }

        if (!data.jobDescription || !data.jobDescription.trim()) {
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: 'Please provide a job description first so I know what role to tailor your resume for.'
                }
            ]);
            return;
        }

        setProcessingStatus('Executing full resume architecture & ATS optimization...');
        setIsProcessing(true);
        const loadingMsgId = `loading-${Date.now()}`;
        setMessages(prev => [
            ...prev,
            {
                id: loadingMsgId,
                sender: 'agent',
                timestamp: Date.now(),
                type: 'text',
                text: 'Executing full resume tailoring across all active sections...'
            }
        ]);

        if (isEmbeddedPreview) {
            setTimeout(() => {
                const tailoredData = { ...data, hasJobMatchRun: true };
                tailoredData.jobTitle = 'Senior Product Manager';
                tailoredData.summary = `Results-driven Senior Product Manager with 8+ years of experience leading cross-functional teams to deliver scalable enterprise software solutions. Proven track record of increasing user engagement, driving multi-million dollar revenue growth, and launching successful B2B SaaS products from conception through go-to-market. Adept at agile methodologies, user-centered design, and data-driven product strategy.`;
                tailoredData.skills = `Product Strategy, Agile / Scrum Methodology, Roadmap Planning, Go-to-Market Strategy, Data Analysis (SQL), A/B Testing, User Research, UI/UX Design Principles, Cross-functional Leadership`;
                tailoredData.keyAchievements = [
                    `President's Club Award Winner 2022 & 2023 for consistently exceeding global ARR targets by over 140% during challenging economic downturns, outperforming 50+ sales and product peers across the entire North American division.`,
                    `Directed the end-to-end launch of 3 major B2B SaaS products, driving widespread enterprise adoption and generating $8.4M in new annual recurring revenue within the first 12 months of release.`,
                    `Successfully reduced core customer churn by 18% month-over-month by initiating strategic UX roadmap pivots, overhauling the onboarding experience, and personally conducting over 200 targeted user interviews.`
                ];
                if (tailoredData.experience[0]) {
                    tailoredData.experience[0].description = `• Spearheaded the development and launch of an AI-powered analytics dashboard, increasing user retention by 35% within the first two quarters.
• Led a cross-functional team of 14 engineers, designers, and marketers in an Agile environment to deliver product updates on a bi-weekly cadence.
• Grew annual recurring revenue (ARR) for the primary SaaS product line by $4.2M through strategic pricing optimization and feature expansion.
• Conducted over 100+ user interviews to identify pain points, resulting in a roadmap pivot that reduced customer churn by 18%.`;
                }
                onChange(tailoredData);

                setMessages(prev => prev.filter(m => m.id !== loadingMsgId).concat({
                    id: `success-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'tailored_success',
                    text: 'Successfully tailored your entire resume! Aligned your professional summary, tailored work experience bullets with embedded keywords and Google XYZ impact metrics, and harmonized core competencies for ATS pass rates.',
                    suggestions: [
                        'Step 1: Align Title & Summary',
                        'Step 2: Tailor Experience Bullets',
                        'Test ATS scan score'
                    ]
                }));
                setIsProcessing(false);
            }, 600);
            return;
        }

        try {
            const result = await tailorResumeToJob(
                data,
                data.jobDescription || ''
            );

            const tailoredData = { ...data, hasJobMatchRun: true };
            tailoredData.summary = result.summary;
            tailoredData.skills = result.skills;
            tailoredData.keyAchievements = result.keyAchievements;

            result.experience.forEach((exp, index) => {
                if (tailoredData.experience[index]) {
                    tailoredData.experience[index].description = exp.description;
                }
            });

            if (result.projects && tailoredData.projects) {
                result.projects.forEach((proj, index) => {
                    if (tailoredData.projects && tailoredData.projects[index]) {
                        tailoredData.projects[index].description = proj.description;
                    }
                });
            }

            if (result.leadership && tailoredData.leadership) {
                result.leadership.forEach((lead, index) => {
                    if (tailoredData.leadership && tailoredData.leadership[index]) {
                        tailoredData.leadership[index].description = lead.description;
                    }
                });
            }

            if (result.additionalInfo && tailoredData.additionalInfo) {
                tailoredData.additionalInfo = result.additionalInfo;
            }

            onChange(tailoredData);

            // Replace loading message with success message
            setMessages(prev => prev.filter(m => m.id !== loadingMsgId).concat({
                id: `success-${Date.now()}`,
                sender: 'agent',
                timestamp: Date.now(),
                type: 'tailored_success',
                text: 'Successfully tailored your entire resume! Aligned your professional summary, tailored work experience bullets with embedded keywords and Google XYZ impact metrics, and harmonized core competencies for ATS pass rates.',
                suggestions: [
                    'Step 1: Align Title & Summary',
                    'Step 2: Tailor Experience Bullets',
                    'Test ATS scan score'
                ]
            }));
        } catch (err: any) {
            setMessages(prev => prev.filter(m => m.id !== loadingMsgId).concat({
                id: `err-${Date.now()}`,
                sender: 'agent',
                timestamp: Date.now(),
                type: 'text',
                text: `Could not tailor resume: ${err.message || 'Unknown error'}. Please try again.`
            }));
        } finally {
            setIsProcessing(false);
        }
    };

    // Optimize summary standalone
    const handlePolishSummary = async () => {
        if (!isEmbeddedPreview && onAIAction && !onAIAction('ai_rewrite')) return;

        setProcessingStatus('Synthesizing executive summary narrative...');
        setIsProcessing(true);

        if (isEmbeddedPreview) {
            setTimeout(() => {
                const cleanText = `Senior Product Leader specializing in enterprise software architecture and user-centered platform delivery, with 8+ years leading cross-functional engineering and design teams. Demonstrated success driving scalable revenue growth, architecting high-impact product roadmaps, and executing data-driven go-to-market strategies.`;
                setMessages(prev => [
                    ...prev,
                    {
                        id: `proposal-${Date.now()}`,
                        sender: 'agent',
                        timestamp: Date.now(),
                        type: 'proposal',
                        proposal: {
                            section: 'summary',
                            title: 'Executive Professional Summary',
                            original: data.summary,
                            proposed: cleanText
                        },
                        text: 'Here is a polished executive summary crafted for your profile:'
                    }
                ]);
                setIsProcessing(false);
            }, 350);
            return;
        }

        try {
            const prompt = `You are an elite executive resume strategist. Enhance the following resume summary to be punchy, authoritative, and high-impact.

Current Summary: "${data.summary || 'Experienced professional with a strong track record of success.'}"
Target Role: "${data.jobTitle || 'Professional'}"

CRITICAL RULES:
- STRICT BAN ON CLICHÉ OPENERS: NEVER start with "Dynamic", "Results-driven", "Results-oriented", "Seasoned", "Passionate", "Dedicated", "Motivated", "Hardworking", "Self-starter", "Proven track record", "Adept at", or "Accomplished".
- OPEN DYNAMICALLY & PROFESSIONALLY: Open naturally with the candidate's professional title and functional specialization (e.g., "${data.jobTitle || 'Professional'} specializing in...", "${data.jobTitle || 'Professional'} with deep background in...").
- Keep it 2-3 concise, high-impact sentences. Ground in truthful accomplishments without inventing fake numbers or claiming ungrounded past employers.

Return ONLY the polished 2-3 sentence summary paragraph without quotes.`;

            const polished = await callAIText(prompt);
            const cleanText = polished.trim().replace(/^["']|["']$/g, '');

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'summary',
                        title: 'Executive Professional Summary',
                        original: data.summary,
                        proposed: cleanText
                    },
                    text: 'Here is a polished executive summary crafted for your profile:'
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: 'Could not generate summary update. Please try again.'
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Strengthen bullet points standalone
    const handleStrengthenBullets = async () => {
        if (!isEmbeddedPreview && onAIAction && !onAIAction('bullet_optimization')) return;

        if (data.experience.length === 0) {
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: 'Please add at least one work experience entry first in the Editor tab.'
                }
            ]);
            return;
        }

        const latestExp = data.experience[0];
        setProcessingStatus(`Engineering Google XYZ impact bullets for ${latestExp?.role || 'role'}...`);
        setIsProcessing(true);
        const usedVerbs = getUsedStartingVerbs(data);

        if (isEmbeddedPreview) {
            setTimeout(() => {
                const cleanBullets = `• Spearheaded the development and launch of an AI-powered analytics dashboard, increasing user retention by 35% within the first two quarters.
• Led a cross-functional team of 14 engineers, designers, and marketers in an Agile environment to deliver product updates on a bi-weekly cadence.
• Grew annual recurring revenue (ARR) for the primary SaaS product line by $4.2M through strategic pricing optimization and feature expansion.`;
                setMessages(prev => [
                    ...prev,
                    {
                        id: `proposal-${Date.now()}`,
                        sender: 'agent',
                        timestamp: Date.now(),
                        type: 'proposal',
                        proposal: {
                            section: 'experience',
                            title: `Impact Bullets for ${latestExp.role}`,
                            original: latestExp.description,
                            proposed: cleanBullets
                        },
                        text: `I've rewritten your bullet points for **${latestExp.role}** with strong action verbs and quantified impact:`
                    }
                ]);
                setIsProcessing(false);
            }, 350);
            return;
        }

        try {
            const prompt = `You are a Fortune 500 recruiter. Rewrite the following bullet points for the position "${latestExp.role}" at "${latestExp.company}".
Make each bullet start with a strong action verb (e.g. Orchestrated, Engineered, Scaled, Spearheaded) and calibrate to 2 full lines (24-34 words) with Google XYZ impact.

STRICT ZERO-DUPLICATE VERB MANDATE:
- Every bullet point MUST start with a COMPLETELY UNIQUE power action verb.
- ONE VERB SHOULD NEVER APPEAR TWICE across any bullets.
- Never use similar verb roots or repeat the same verb.

MANDATORY CANDIDATE METRIC PRESERVATION & % CAPPING:
- If original bullets contain real numbers, dollars ($), team sizes, user counts, or performance stats, you MUST PRESERVE and strategically retain those verified metrics.
- If the original resume has multiple percentages (%), STRICTLY LIMIT THEM: Keep at most 1-2 most impressive percentages across the entire role, and reframe any other percentage bullets into concrete non-percentage metrics (e.g. team headcount, system throughput, or timeframe improvements from X to Y).

NO % SPAM & REALISTIC SCOPE MANDATE:
- Do NOT output percentages on every bullet. Keep authentic numbers provided by the candidate.
- Focus impact on technical architecture, system throughput, team/project scope, tool integrations, and operational deliverables.

Original bullets:
${latestExp.description || 'Responsible for day-to-day operations and team leadership.'}

Return 3-4 bullet points starting with '• '. Output ONLY the bullet points.`;

            const enhanced = await callAIText(prompt);
            const domain = detectActionVerbDomain(`${latestExp.role} ${latestExp.company}`);
            const cleanBullets = ensureAllBulletsHaveUniqueVerbs(enhanced.trim(), usedVerbs, domain);

            setMessages(prev => [
                ...prev,
                {
                    id: `proposal-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'proposal',
                    proposal: {
                        section: 'experience',
                        title: `Impact Bullets for ${latestExp.role}`,
                        original: latestExp.description,
                        proposed: cleanBullets
                    },
                    text: `I've rewritten your bullet points for **${latestExp.role}** with strong action verbs and quantified impact:`
                }
            ]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: 'Could not optimize bullets right now. Please try again.'
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Determine the next step in the dynamic tailoring sequence
    const getNextStepPrompt = (
        currentSection: string,
        currentIndex: number | undefined,
        job?: JobDescriptionData
    ): { text: string; actionPrompt?: ChatMessage['actionPrompt'] } => {
        const hasAchievements = Boolean(
            (Array.isArray(data.keyAchievements) && data.keyAchievements.length > 0) ||
            (typeof data.keyAchievements === 'string' && data.keyAchievements.trim().length > 0)
        );
        const hasExp = data.experience && data.experience.length > 0;
        const hasProj = data.projects && data.projects.length > 0;
        const hasLead = data.leadership && data.leadership.length > 0;
        const populatedInfo = (data.additionalInfo || []).filter(item => item && (item.label?.trim() || item.value?.trim()));
        const hasInfo = populatedInfo.length > 0;

        if (currentSection === 'title_and_summary' || currentSection === 'title' || currentSection === 'summary') {
            if (hasAchievements) {
                return {
                    text: `Successfully applied your **Strategic Title & Executive Summary**.\n\nWould you like to proceed to **Elevate Key Achievements** for ${job?.title || 'the target role'}?`,
                    actionPrompt: {
                        label: 'Elevate Key Achievements',
                        stepDescription: 'Tailor Flagship Career Highlights',
                        onClickType: 'tailor_achievements',
                        jobData: job
                    }
                };
            }
            if (hasExp) {
                const firstRole = data.experience[0].role || 'First Role';
                return {
                    text: `Successfully applied your **Strategic Title & Executive Summary**.\n\nWould you like to proceed to **Tailor Experience Bullets** starting with your first role (**${firstRole}**, Role 1 of ${data.experience.length})?`,
                    actionPrompt: {
                        label: `Tailor Role 1: ${firstRole}`,
                        stepDescription: `Tailor Experience (1 of ${data.experience.length})`,
                        onClickType: 'tailor_experience',
                        expIndex: 0,
                        jobData: job
                    }
                };
            }
            if (hasProj) {
                const firstProj = data.projects![0].name || 'Project 1';
                return {
                    text: `Successfully applied your **Strategic Title & Executive Summary**.\n\nWould you like to proceed to **Tailor Projects** starting with **${firstProj}**?`,
                    actionPrompt: {
                        label: `Tailor Project 1: ${firstProj}`,
                        stepDescription: `Tailor Projects (1 of ${data.projects!.length})`,
                        onClickType: 'tailor_projects',
                        projIndex: 0,
                        jobData: job
                    }
                };
            }
            if (hasLead) {
                const firstLead = data.leadership![0].role || 'Leadership 1';
                return {
                    text: `Successfully applied your **Strategic Title & Executive Summary**.\n\nWould you like to proceed to **Tailor Leadership** starting with **${firstLead}**?`,
                    actionPrompt: {
                        label: `Tailor Leadership 1: ${firstLead}`,
                        stepDescription: `Tailor Leadership (1 of ${data.leadership!.length})`,
                        onClickType: 'tailor_leadership',
                        leadIndex: 0,
                        jobData: job
                    }
                };
            }
            if (hasInfo) {
                const firstItem = populatedInfo[0];
                return {
                    text: `Successfully applied your **Strategic Title & Executive Summary**.\n\nWould you like to proceed to **Elevate ${firstItem.label || 'Additional Section'}**?`,
                    actionPrompt: {
                        label: `Elevate ${firstItem.label || 'Custom Section'}`,
                        stepDescription: `Tailor ${firstItem.label || 'Section'}`,
                        onClickType: 'tailor_additional_info',
                        infoIndex: 0,
                        jobData: job
                    }
                };
            }
            return {
                text: `Successfully applied your **Strategic Title & Executive Summary**.\n\nWould you like to proceed to **Harmonize Core Skills**?`,
                actionPrompt: {
                    label: 'Harmonize Core Skills',
                    stepDescription: 'Align Skills with JD',
                    onClickType: 'harmonize_skills',
                    jobData: job
                }
            };
        }

        if (currentSection === 'keyAchievements') {
            if (hasExp) {
                const firstRole = data.experience[0].role || 'First Role';
                return {
                    text: `Successfully applied your tailored **Key Achievements**.\n\nWould you like to proceed to **Tailor Experience Bullets** starting with your first role (**${firstRole}**, Role 1 of ${data.experience.length})?`,
                    actionPrompt: {
                        label: `Tailor Role 1: ${firstRole}`,
                        stepDescription: `Tailor Experience (1 of ${data.experience.length})`,
                        onClickType: 'tailor_experience',
                        expIndex: 0,
                        jobData: job
                    }
                };
            }
            if (hasProj) {
                const firstProj = data.projects![0].name || 'Project 1';
                return {
                    text: `Successfully applied your tailored **Key Achievements**.\n\nWould you like to proceed to **Tailor Projects** starting with **${firstProj}**?`,
                    actionPrompt: {
                        label: `Tailor Project 1: ${firstProj}`,
                        stepDescription: `Tailor Projects (1 of ${data.projects!.length})`,
                        onClickType: 'tailor_projects',
                        projIndex: 0,
                        jobData: job
                    }
                };
            }
            if (hasLead) {
                const firstLead = data.leadership![0].role || 'Leadership 1';
                return {
                    text: `Successfully applied your tailored **Key Achievements**.\n\nWould you like to proceed to **Tailor Leadership** starting with **${firstLead}**?`,
                    actionPrompt: {
                        label: `Tailor Leadership 1: ${firstLead}`,
                        stepDescription: `Tailor Leadership (1 of ${data.leadership!.length})`,
                        onClickType: 'tailor_leadership',
                        leadIndex: 0,
                        jobData: job
                    }
                };
            }
            if (hasInfo) {
                const firstItem = populatedInfo[0];
                return {
                    text: `Successfully applied your tailored **Key Achievements**.\n\nWould you like to proceed to **Elevate ${firstItem.label || 'Additional Section'}**?`,
                    actionPrompt: {
                        label: `Elevate ${firstItem.label || 'Custom Section'}`,
                        stepDescription: `Tailor ${firstItem.label || 'Section'}`,
                        onClickType: 'tailor_additional_info',
                        infoIndex: 0,
                        jobData: job
                    }
                };
            }
            return {
                text: `Successfully applied your tailored **Key Achievements**.\n\nWould you like to proceed to **Harmonize Core Skills**?`,
                actionPrompt: {
                    label: 'Harmonize Core Skills',
                    stepDescription: 'Align Skills with JD',
                    onClickType: 'harmonize_skills',
                    jobData: job
                }
            };
        }

        if (currentSection === 'experience') {
            const expIdx = currentIndex ?? 0;
            const totalExp = data.experience.length;
            const nextIndex = expIdx + 1;
            const currentExp = data.experience[expIdx];

            if (nextIndex < totalExp) {
                const nextExp = data.experience[nextIndex];
                return {
                    text: `Successfully applied tailored bullets for **${currentExp?.role || 'Role'} at ${currentExp?.company || 'Company'}**.\n\nWould you like to proceed to tailor your next role (**${nextExp.role} at ${nextExp.company}**, Role ${nextIndex + 1} of ${totalExp})?`,
                    actionPrompt: {
                        label: `Tailor Role ${nextIndex + 1}: ${nextExp.role}`,
                        stepDescription: `Tailor Experience (${nextIndex + 1} of ${totalExp})`,
                        onClickType: 'tailor_experience',
                        expIndex: nextIndex,
                        jobData: job
                    }
                };
            } else {
                // All experience roles tailored!
                if (hasProj) {
                    const firstProj = data.projects![0].name || 'Project 1';
                    return {
                        text: `All **${totalExp} work experiences** have been tailored with Google XYZ impact bullets.\n\nWould you like to proceed to **Tailor Projects** starting with **${firstProj}** (Project 1 of ${data.projects!.length})?`,
                        actionPrompt: {
                            label: `Tailor Project 1: ${firstProj}`,
                            stepDescription: `Tailor Projects (1 of ${data.projects!.length})`,
                            onClickType: 'tailor_projects',
                            projIndex: 0,
                            jobData: job
                        }
                    };
                }
                if (hasLead) {
                    const firstLead = data.leadership![0].role || 'Leadership 1';
                    return {
                        text: `All **${totalExp} work experiences** have been tailored with Google XYZ impact bullets.\n\nWould you like to proceed to **Tailor Leadership** starting with **${firstLead}** (Leadership 1 of ${data.leadership!.length})?`,
                        actionPrompt: {
                            label: `Tailor Leadership 1: ${firstLead}`,
                            stepDescription: `Tailor Leadership (1 of ${data.leadership!.length})`,
                            onClickType: 'tailor_leadership',
                            leadIndex: 0,
                            jobData: job
                        }
                    };
                }
                if (hasInfo) {
                    const firstItem = populatedInfo[0];
                    return {
                        text: `All **${totalExp} work experiences** have been tailored with Google XYZ impact bullets.\n\nWould you like to proceed to **Elevate ${firstItem.label || 'Additional Section'}**?`,
                        actionPrompt: {
                            label: `Elevate ${firstItem.label || 'Custom Section'}`,
                            stepDescription: `Tailor ${firstItem.label || 'Section'}`,
                            onClickType: 'tailor_additional_info',
                            infoIndex: 0,
                            jobData: job
                        }
                    };
                }
                return {
                    text: `All **${totalExp} work experiences** have been tailored with Google XYZ impact bullets and target keywords.\n\nWould you like to proceed to **Harmonize Core Skills** to align your domain competencies for ATS algorithms?`,
                    actionPrompt: {
                        label: 'Proceed to Core Skills',
                        stepDescription: 'Harmonize Skills & Keywords',
                        onClickType: 'harmonize_skills',
                        jobData: job
                    }
                };
            }
        }

        if (currentSection === 'projects') {
            const projIdx = currentIndex ?? 0;
            const totalProjects = data.projects?.length || 0;
            const nextIndex = projIdx + 1;
            const currentProj = data.projects?.[projIdx];

            if (nextIndex < totalProjects) {
                const nextProj = data.projects![nextIndex];
                return {
                    text: `Successfully applied tailored bullets for **${currentProj?.name || 'Project'}**.\n\nWould you like to tailor your next project (**${nextProj.name}**, Project ${nextIndex + 1} of ${totalProjects})?`,
                    actionPrompt: {
                        label: `Tailor Project ${nextIndex + 1}: ${nextProj.name}`,
                        stepDescription: `Tailor Projects (${nextIndex + 1} of ${totalProjects})`,
                        onClickType: 'tailor_projects',
                        projIndex: nextIndex,
                        jobData: job
                    }
                };
            } else {
                if (hasLead) {
                    const firstLead = data.leadership![0].role || 'Leadership 1';
                    return {
                        text: `All **${totalProjects} projects** have been tailored.\n\nWould you like to proceed to **Tailor Leadership** starting with **${firstLead}**?`,
                        actionPrompt: {
                            label: `Tailor Leadership 1: ${firstLead}`,
                            stepDescription: `Tailor Leadership (1 of ${data.leadership!.length})`,
                            onClickType: 'tailor_leadership',
                            leadIndex: 0,
                            jobData: job
                        }
                    };
                }
                if (hasInfo) {
                    const firstItem = populatedInfo[0];
                    return {
                        text: `All **${totalProjects} projects** have been tailored.\n\nWould you like to proceed to **Elevate ${firstItem.label || 'Additional Section'}**?`,
                        actionPrompt: {
                            label: `Elevate ${firstItem.label || 'Custom Section'}`,
                            stepDescription: `Tailor ${firstItem.label || 'Section'}`,
                            onClickType: 'tailor_additional_info',
                            infoIndex: 0,
                            jobData: job
                        }
                    };
                }
                return {
                    text: `All **${totalProjects} projects** have been tailored with tech stack and architecture outcomes.\n\nWould you like to proceed to **Harmonize Core Skills**?`,
                    actionPrompt: {
                        label: 'Proceed to Core Skills',
                        stepDescription: 'Harmonize Skills & Keywords',
                        onClickType: 'harmonize_skills',
                        jobData: job
                    }
                };
            }
        }

        if (currentSection === 'leadership') {
            const leadIdx = currentIndex ?? 0;
            const totalLeadership = data.leadership?.length || 0;
            const nextIndex = leadIdx + 1;
            const currentLead = data.leadership?.[leadIdx];

            if (nextIndex < totalLeadership) {
                const nextLead = data.leadership![nextIndex];
                return {
                    text: `Successfully applied tailored bullets for **${currentLead?.role || 'Leadership'}**.\n\nWould you like to tailor your next leadership role (**${nextLead.role}**, Leadership ${nextIndex + 1} of ${totalLeadership})?`,
                    actionPrompt: {
                        label: `Tailor Leadership ${nextIndex + 1}: ${nextLead.role}`,
                        stepDescription: `Tailor Leadership (${nextIndex + 1} of ${totalLeadership})`,
                        onClickType: 'tailor_leadership',
                        leadIndex: nextIndex,
                        jobData: job
                    }
                };
            } else {
                if (hasInfo) {
                    const firstItem = populatedInfo[0];
                    return {
                        text: `All **${totalLeadership} leadership experiences** have been tailored.\n\nWould you like to proceed to **Elevate ${firstItem.label || 'Additional Section'}**?`,
                        actionPrompt: {
                            label: `Elevate ${firstItem.label || 'Custom Section'}`,
                            stepDescription: `Tailor ${firstItem.label || 'Section'}`,
                            onClickType: 'tailor_additional_info',
                            infoIndex: 0,
                            jobData: job
                        }
                    };
                }
                return {
                    text: `All **${totalLeadership} leadership experiences** have been tailored.\n\nWould you like to proceed to **Harmonize Core Skills**?`,
                    actionPrompt: {
                        label: 'Proceed to Core Skills',
                        stepDescription: 'Harmonize Skills & Keywords',
                        onClickType: 'harmonize_skills',
                        jobData: job
                    }
                };
            }
        }

        if (currentSection === 'additionalInfo') {
            const infoIdx = currentIndex ?? 0;
            const totalInfo = populatedInfo.length;
            const nextIndex = infoIdx + 1;
            const currentInfo = populatedInfo[infoIdx];

            if (nextIndex < totalInfo) {
                const nextInfo = populatedInfo[nextIndex];
                return {
                    text: `Successfully applied tailored details for **${currentInfo?.label || 'Custom Section'}**.\n\nWould you like to tailor your next section (**${nextInfo.label || 'Custom Section'}**, ${nextIndex + 1} of ${totalInfo})?`,
                    actionPrompt: {
                        label: `Elevate ${nextInfo.label || 'Custom Section'}`,
                        stepDescription: `Tailor ${nextInfo.label || 'Section'} (${nextIndex + 1} of ${totalInfo})`,
                        onClickType: 'tailor_additional_info',
                        infoIndex: nextIndex,
                        jobData: job
                    }
                };
            } else {
                return {
                    text: `All custom sections have been tailored.\n\nWould you like to proceed to **Harmonize Core Skills**?`,
                    actionPrompt: {
                        label: 'Proceed to Core Skills',
                        stepDescription: 'Harmonize Skills & Keywords',
                        onClickType: 'harmonize_skills',
                        jobData: job
                    }
                };
            }
        }

        return {
            text: `**All Step-by-Step Tailoring Actions Complete!**\n\nYour resume is now fully aligned with the target role and optimized for ATS algorithms and executive recruiters.`
        };
    };

    // Apply proposal to resume data
    const handleApplyProposal = (msgId: string, proposal: NonNullable<ChatMessage['proposal']>) => {
        const job = proposal.jobData;
        const targetPath = getProposalTargetDataPath(proposal);
        if (targetPath) {
            broadcastHighlight(targetPath, 'applied');
        }

        if (proposal.section === 'title_and_summary') {
            onChange({
                ...data,
                jobTitle: proposal.proposedTitle || data.jobTitle,
                summary: proposal.proposedSummary || data.summary
            });
            const nextStep = getNextStepPrompt('title_and_summary', undefined, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, applied: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        } else if (proposal.section === 'title' && proposal.proposedTitle) {
            onChange({ ...data, jobTitle: proposal.proposedTitle });
        } else if (proposal.section === 'summary') {
            onChange({ ...data, summary: proposal.proposedSummary || proposal.proposed });
        } else if (proposal.section === 'keyAchievements') {
            const raw = proposal.proposedSummary || proposal.proposed;
            const bullets = raw.split('\n').map(b => b.trim()).filter(Boolean);
            onChange({
                ...data,
                keyAchievements: Array.isArray(data.keyAchievements) ? bullets : bullets.join('\n')
            });
            const nextStep = getNextStepPrompt('keyAchievements', undefined, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, applied: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        } else if (proposal.section === 'skills') {
            const newSkills = proposal.proposedSkills || proposal.proposed;
            onChange({ ...data, skills: newSkills });
            setMessages(prev =>
                prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, applied: true } } : m)
            );
            if (job) {
                setMessages(prev => [
                    ...prev,
                    {
                        id: `complete-step-${Date.now()}`,
                        sender: 'agent',
                        timestamp: Date.now(),
                        type: 'text',
                        text: `**All Step-by-Step Tailoring Actions Complete!**\n\nYour resume is now fully aligned with the target role and optimized for ATS algorithms and executive recruiters.`
                    }
                ]);
            }
            return;
        } else if (proposal.section === 'experience') {
            const expIdx = proposal.experienceIndex ?? 0;
            const updated = [...data.experience];
            const rawContent = proposal.proposedSummary || proposal.proposed.replace(/^\*\*[^*]+\*\*:\s*/i, '').trim();

            if (updated[expIdx]) {
                if (proposal.mode === 'append') {
                    const existing = (updated[expIdx].description || '').trim();
                    const newDescription = existing ? `${existing}\n${rawContent}` : rawContent;
                    updated[expIdx] = { ...updated[expIdx], description: newDescription };
                } else {
                    updated[expIdx] = { ...updated[expIdx], description: rawContent };
                }
                onChange({ ...data, experience: updated });
            }

            if (job) {
                const nextStep = getNextStepPrompt('experience', expIdx, job);
                setMessages(prev => [
                    ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, applied: true } } : m),
                    {
                        id: `next-step-${Date.now()}`,
                        sender: 'agent',
                        timestamp: Date.now(),
                        type: 'text',
                        text: nextStep.text,
                        actionPrompt: nextStep.actionPrompt
                    }
                ]);
            } else {
                setMessages(prev =>
                    prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, applied: true } } : m)
                );
            }
            return;
        } else if (proposal.section === 'projects') {
            const projIdx = proposal.projectIndex ?? 0;
            if (data.projects && data.projects[projIdx]) {
                const updatedProjects = [...data.projects];
                const bulletsOnly = proposal.proposedSummary || proposal.proposed.replace(/^\*\*[^*]+\*\*:\s*/i, '').trim();
                updatedProjects[projIdx] = { ...updatedProjects[projIdx], description: bulletsOnly };
                onChange({ ...data, projects: updatedProjects });
            }

            const nextStep = getNextStepPrompt('projects', projIdx, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, applied: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        } else if (proposal.section === 'leadership') {
            const leadIdx = proposal.leadershipIndex ?? 0;
            if (data.leadership && data.leadership[leadIdx]) {
                const updatedLeadership = [...data.leadership];
                const bulletsOnly = proposal.proposedSummary || proposal.proposed.replace(/^\*\*[^*]+\*\*:\s*/i, '').trim();
                updatedLeadership[leadIdx] = { ...updatedLeadership[leadIdx], description: bulletsOnly };
                onChange({ ...data, leadership: updatedLeadership });
            }

            const nextStep = getNextStepPrompt('leadership', leadIdx, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, applied: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        } else if (proposal.section === 'additionalInfo') {
            const infoIdx = proposal.additionalInfoIndex ?? 0;
            if (data.additionalInfo && data.additionalInfo[infoIdx]) {
                const updatedInfo = [...data.additionalInfo];
                const contentOnly = proposal.proposedSummary || proposal.proposed.replace(/^\*\*[^*]+\*\*:\s*/i, '').trim();
                updatedInfo[infoIdx] = { ...updatedInfo[infoIdx], value: contentOnly };
                onChange({ ...data, additionalInfo: updatedInfo });
            }

            const nextStep = getNextStepPrompt('additionalInfo', infoIdx, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, applied: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: nextStep.text,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
            return;
        }

        setMessages(prev =>
            prev.map(m =>
                m.id === msgId && m.proposal
                    ? { ...m, proposal: { ...m.proposal, applied: true } }
                    : m
            )
        );
    };

    // Skip current proposal without modifying the resume, and proceed to next step
    const handleSkipProposal = (msgId: string, proposal: NonNullable<ChatMessage['proposal']>) => {
        const job = proposal.jobData;

        // Mark current proposal as skipped
        setMessages(prev =>
            prev.map(m =>
                m.id === msgId && m.proposal
                    ? { ...m, proposal: { ...m.proposal, skipped: true } }
                    : m
            )
        );

        if (proposal.section === 'title_and_summary') {
            const nextStep = getNextStepPrompt('title_and_summary', undefined, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, skipped: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Kept your original Title & Summary.\n\n${nextStep.text}`,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
        } else if (proposal.section === 'keyAchievements') {
            const nextStep = getNextStepPrompt('keyAchievements', undefined, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, skipped: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Kept your original Key Achievements.\n\n${nextStep.text}`,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
        } else if (proposal.section === 'experience') {
            const expIdx = proposal.experienceIndex ?? 0;
            const nextStep = getNextStepPrompt('experience', expIdx, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, skipped: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Kept your original Experience bullets for this role.\n\n${nextStep.text}`,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
        } else if (proposal.section === 'projects') {
            const projIdx = proposal.projectIndex ?? 0;
            const nextStep = getNextStepPrompt('projects', projIdx, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, skipped: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Kept your original Projects content.\n\n${nextStep.text}`,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
        } else if (proposal.section === 'leadership') {
            const leadIdx = proposal.leadershipIndex ?? 0;
            const nextStep = getNextStepPrompt('leadership', leadIdx, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, skipped: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Kept your original Leadership content.\n\n${nextStep.text}`,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
        } else if (proposal.section === 'additionalInfo') {
            const infoIdx = proposal.additionalInfoIndex ?? 0;
            const nextStep = getNextStepPrompt('additionalInfo', infoIdx, job);
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, skipped: true } } : m),
                {
                    id: `next-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Kept your original Section content.\n\n${nextStep.text}`,
                    actionPrompt: nextStep.actionPrompt
                }
            ]);
        } else if (proposal.section === 'skills') {
            setMessages(prev => [
                ...prev.map(m => m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, skipped: true } } : m),
                {
                    id: `complete-step-${Date.now()}`,
                    sender: 'agent',
                    timestamp: Date.now(),
                    type: 'text',
                    text: `Kept your original Core Skills.\n\n**All Step-by-Step Tailoring Actions Complete!**`
                }
            ]);
        }
    };

    // Regenerate proposal with a fresh take
    const handleRegenerateProposal = (proposal: NonNullable<ChatMessage['proposal']>) => {
        const job = proposal.jobData;
        if (proposal.section === 'title_and_summary' || proposal.section === 'title' || proposal.section === 'summary') {
            handleAlignTitleAndSummary(job);
        } else if (proposal.section === 'keyAchievements') {
            handleTailorAchievements(job);
        } else if (proposal.section === 'experience') {
            handleTailorExperience(job, proposal.experienceIndex ?? 0);
        } else if (proposal.section === 'projects') {
            handleTailorProjects(job, proposal.projectIndex ?? 0);
        } else if (proposal.section === 'leadership') {
            handleTailorLeadership(job, proposal.leadershipIndex ?? 0);
        } else if (proposal.section === 'additionalInfo') {
            handleTailorAdditionalInfo(job, proposal.additionalInfoIndex ?? 0);
        } else if (proposal.section === 'skills') {
            handleHarmonizeSkills(job);
        }
    };

    // Stream an assistant reply token-by-token for a smooth streaming experience
    const streamAssistantMessage = (
        messageTemplate: Omit<ChatMessage, 'text'>,
        fullText: string,
        onDone?: () => void
    ) => {
        const msgId = messageTemplate.id || `agent-${Date.now()}`;
        const initialMsg: ChatMessage = {
            ...messageTemplate,
            id: msgId,
            sender: 'agent',
            timestamp: Date.now(),
            text: '',
            isStreaming: Boolean(fullText && fullText.trim().length > 0)
        };

        setMessages(prev => [...prev, initialMsg]);
        setIsProcessing(false);

        if (!fullText) {
            if (messageTemplate.type === 'proposal' && (messageTemplate as any).proposal) {
                const targetPath = getProposalTargetDataPath((messageTemplate as any).proposal);
                if (targetPath) broadcastHighlight(targetPath, 'highlight', 4000);
            }
            onDone?.();
            return;
        }

        // Split text into chunks for realistic streaming typing speed
        const tokens = fullText.split(/(\s+)/);
        let currentIndex = 0;
        let accumulated = '';

        const interval = setInterval(() => {
            if (currentIndex >= tokens.length) {
                clearInterval(interval);
                setMessages(prev =>
                    prev.map(m => (m.id === msgId ? { ...m, text: fullText, isStreaming: false } : m))
                );
                if (messageTemplate.type === 'proposal' && (messageTemplate as any).proposal) {
                    const targetPath = getProposalTargetDataPath((messageTemplate as any).proposal);
                    if (targetPath) broadcastHighlight(targetPath, 'highlight', 4000);
                }
                onDone?.();
                return;
            }

            accumulated += tokens[currentIndex];
            currentIndex++;

            setMessages(prev =>
                prev.map(m => (m.id === msgId ? { ...m, text: accumulated, isStreaming: true } : m))
            );
        }, 16);
    };

    // Handle user sending text
    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const clean = inputText.trim();
        if (!clean || isProcessing) return;

        setInputText('');

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            timestamp: Date.now(),
            type: 'text',
            text: clean
        };

        setMessages(prev => [...prev, userMsg]);

        // Check if message is a job description (long text or keywords)
        const isJobDesc = clean.length > 100 ||
            clean.toLowerCase().includes('responsibilities') ||
            clean.toLowerCase().includes('qualifications') ||
            clean.toLowerCase().includes('requirements') ||
            clean.toLowerCase().includes('we are looking for') ||
            clean.toLowerCase().includes('job description');

        if (isJobDesc) {
            setIsProcessing(true);
            setTimeout(async () => {
                await handleProcessJobDescription(clean);
                setIsProcessing(false);
            }, 600);
            return;
        }

        // Preview Mode Simulated Conversational Response (Zero API Credits)
        if (isEmbeddedPreview) {
            setProcessingStatus('Reviewing resume architecture & formulating response...');
            setIsProcessing(true);
            setTimeout(() => {
                const lower = clean.toLowerCase();

                // 1. Conversational Repair / "Where is it" / "I can't see it" / "Where are the skills"
                if (
                    lower.includes("can't see") ||
                    lower.includes("cant see") ||
                    lower.includes("where is") ||
                    lower.includes("where are") ||
                    lower.includes("dont see") ||
                    lower.includes("don't see") ||
                    lower.includes("show me") ||
                    lower.includes("what are the skills") ||
                    lower.includes("what are they")
                ) {
                    const proposedSkills = 'Product Strategy, Enterprise SaaS, AI/ML Product Discovery, Agile & Scrum, Roadmap Planning, Go-to-Market (GTM), Data Analysis (SQL), A/B Testing, User Experience (UX), Cross-Functional Leadership, Cloud Infrastructure, Systems Architecture';
                    streamAssistantMessage(
                        {
                            id: `proposal-${Date.now()}`,
                            type: 'proposal',
                            proposal: {
                                section: 'skills',
                                title: 'Core Skills (12 Skills — 4-Row Layout)',
                                proposed: proposedSkills,
                                proposedSkills: proposedSkills,
                                applied: false
                            }
                        },
                        'Here is your curated set of 12 Core Skills optimized for a 4-row layout:'
                    );
                    return;
                }

                // 1. Greetings / Introduction / How does it work
                if (/^(hi|hello|hey|greetings|hola|good\s*(morning|afternoon|evening)|who are you|what can you do|help|how does this work)/i.test(lower)) {
                    streamAssistantMessage(
                        { id: `agent-${Date.now()}`, type: 'text' },
                        `Welcome to the **CVArchitect Live AI Preview**! I am your Executive Resume Architect.\n\nHere is what you can test right now in this interactive preview:\n1. **Paste any Job Description** into the chat below to trigger real-time ATS match scoring and keyword gap analysis.\n2. Ask me to **strengthen bullets**, **harmonize skills**, or **align your summary**.\n3. Click **1-Click AI Tailor** above or step through each role to see instant Google XYZ transformations!`
                    );
                    return;
                }

                // 2. Section guidance ("how to add section", "add certification", "add project", etc.)
                if (lower.includes('add section') || lower.includes('how do i add') || lower.includes('add certification') || lower.includes('add custom section') || lower.includes('add publication') || lower.includes('add volunteer')) {
                    streamAssistantMessage(
                        { id: `agent-${Date.now()}`, type: 'text' },
                        `To add a new section in CVArchitect:\n\n1. In the **Left Editor Sidebar** (or via the **+ Add Section** button at the bottom of the live resume canvas), click **+ Add Section**.\n2. Select your desired section (*Key Achievements, Projects, Leadership, Certifications, Publications, Languages, Coursework, Awards, Volunteer*) or choose *Custom Section*.\n3. Once added, you can edit the text directly or ask me to draft tailored Google XYZ impact bullets for you!`
                    );
                    return;
                }

                // 3. Bullets / Experience enhancement requests
                if (lower.includes('bullet') || lower.includes('experience') || lower.includes('metric') || lower.includes('achievement') || lower.includes('quantif') || lower.includes('role')) {
                    const proposedBullet = '• Spearheaded cross-functional go-to-market architecture across 14 engineers and designers, accelerating enterprise product release velocity by 35% while maintaining 99.9% uptime.';
                    streamAssistantMessage(
                        {
                            id: `proposal-${Date.now()}`,
                            type: 'proposal',
                            proposal: {
                                section: 'experience',
                                experienceIndex: 0,
                                title: 'Tailored Bullet for Senior Product Manager at TechFlow Solutions',
                                proposed: proposedBullet,
                                applied: false
                            }
                        },
                        `I have architected a high-impact **Google XYZ standard bullet** for your **Senior Product Manager** role at **TechFlow Solutions**:`
                    );
                    return;
                }

                // 4. Summary / Headline / Title requests
                if (lower.includes('summary') || lower.includes('title') || lower.includes('headline') || lower.includes('about') || lower.includes('profile')) {
                    const proposedTitle = 'Principal Product Manager | AI & Enterprise Platforms';
                    const proposedSummary = 'Strategic Product Leader with 8+ years architecting enterprise SaaS platforms and AI-driven workflow engines. Proven track record scaling ARR from $4.2M to $8.4M, leading 14-engineer agile squads, and delivering human-centered digital experiences across global Fortune 500 accounts.';
                    streamAssistantMessage(
                        {
                            id: `proposal-${Date.now()}`,
                            type: 'proposal',
                            proposal: {
                                section: 'title_and_summary',
                                title: 'Align Title & Professional Summary',
                                proposed: `${proposedTitle}\n\n${proposedSummary}`,
                                proposedTitle,
                                proposedSummary,
                                applied: false
                            }
                        },
                        `I have prepared an executive-level **Title & Summary alignment** tailored for top-tier enterprise product leadership roles:`
                    );
                    return;
                }

                // 5. Skills requests
                if (lower.includes('skill') || lower.includes('keyword') || lower.includes('technolog') || lower.includes('stack') || lower.includes('harmoniz') || lower.includes('4 row') || lower.includes('12')) {
                    const proposedSkills = 'Product Strategy, Enterprise SaaS, AI/ML Product Discovery, Agile & Scrum, Roadmap Planning, Go-to-Market (GTM), Data Analysis (SQL), A/B Testing, User Experience (UX), Cross-Functional Leadership, Cloud Infrastructure, Systems Architecture';
                    streamAssistantMessage(
                        {
                            id: `proposal-${Date.now()}`,
                            type: 'proposal',
                            proposal: {
                                section: 'skills',
                                title: 'Core Skills (12 Skills — 4-Row Layout)',
                                proposed: proposedSkills,
                                proposedSkills: proposedSkills,
                                applied: false
                            }
                        },
                        'I have curated 12 high-impact **Core Skills** aligned for a 4-row layout and ATS keyword matching:'
                    );
                    return;
                }

                // 6. Pricing / Export / Save
                if (lower.includes('price') || lower.includes('cost') || lower.includes('buy') || lower.includes('save') || lower.includes('export') || lower.includes('download') || lower.includes('pdf') || lower.includes('word') || lower.includes('docx')) {
                    streamAssistantMessage(
                        { id: `agent-${Date.now()}`, type: 'text' },
                        `In this live interactive preview, you have full access to explore the AI Resume Architect with zero credit usage! When you're ready to create your own personalized resume, export to PDF/DOCX, or unlock unlimited tailoring, click **Save** or **Download** in the top bar.`
                    );
                    return;
                }

                // 7. Off-topic queries (weather, recipes, general non-resume trivia)
                if (lower.includes('weather') || lower.includes('recipe') || lower.includes('poem') || lower.includes('joke') || lower.includes('song') || lower.includes('capital of') || lower.includes('president')) {
                    streamAssistantMessage(
                        { id: `agent-${Date.now()}`, type: 'text' },
                        `I specialize exclusively in resume architecture, ATS optimization, and career strategy—how can I assist with your resume or target job search today?`
                    );
                    return;
                }

                // 8. Default contextual response
                streamAssistantMessage(
                    { id: `agent-${Date.now()}`, type: 'text' },
                    `I have analyzed "${clean}" against Sarah Jenkins's executive profile. In this preview mode, you can paste any target job description below or try asking me to **strengthen bullets**, **update summary**, or **harmonize skills**!`
                );
            }, 400);
            return;
        }

        // Context-aware Conversational & Action Handling
        setProcessingStatus('Reviewing resume architecture & formulating response...');
        setIsProcessing(true);
        try {
            const recentHistory = messages
                .filter(m => (m.type === 'text' || m.type === 'proposal') && (m.text || m.proposal?.proposed))
                .slice(-6)
                .map(m => {
                    const content = m.type === 'proposal' && m.proposal
                        ? `${m.text || ''}\n[PROPOSED ${m.proposal.title}]:\n${m.proposal.proposed}`
                        : m.text || '';
                    return `${m.sender === 'user' ? 'User' : 'Assistant'}: ${content}`;
                })
                .join('\n\n');

            const resumeContext = `
Candidate Name: ${data.fullName || 'User'}
Current Job Title: ${data.jobTitle || 'Professional'}
Professional Summary: ${data.summary || 'None'}
Core Skills: ${data.skills || 'None'}
Work Experience (${data.experience.length} roles):
${data.experience.map((e, idx) => `[Role Index ${idx}] "${e.role || 'Role'}" at "${e.company || 'Company'}" (${e.startDate || ''} - ${e.endDate || ''}):
${e.description || 'No bullets'}`).join('\n\n')}
${data.jobDescription ? `Target Job Description:\n${data.jobDescription.slice(0, 600)}...` : ''}`;

            const prompt = `You are CVArchitect AI, an elite Senior Executive Recruiter and Talent Strategist with 15+ years of experience hiring for top tech, fintech, finance, and enterprise companies.
You evaluate resumes through the eyes of hiring managers and modern ATS algorithms (Workday, Greenhouse, Lever).

CONVERSATION HISTORY:
${recentHistory || 'No prior conversation turns.'}

CANONICAL RESUME CONTEXT:
${resumeContext}

LATEST USER MESSAGE: "${clean}"

INTENT CLASSIFICATION & RECRUITER PROTOCOL (CRITICAL):
Identify the user's intent and strictly follow the corresponding protocol:

SENIORITY-AWARE EXECUTIVE CALIBRATION (CRITICAL):
- Dynamically detect the candidate's seniority from their title and context:
  * C-SUITE / CEO / FOUNDER / VP / MANAGING DIRECTOR / EXECUTIVE:
    - Language MUST strictly center on Enterprise P&L, Commercial & Revenue Scale ($M/$B), Board & Investor Governance, Organizational Headcount Scale (hundreds to thousands of employees), Global Market Expansion, Capital Allocation, M&A / Ecosystem Strategy, and Transformative Market Leadership.
    - NEVER generate tactical task-level bullets (e.g. "managed tasks", "wrote Jira tickets", "attended meetings").
    - Summary MUST open with an authoritative executive mandate (e.g., "Chief Executive Officer with 18+ years scaling high-growth technology enterprises, expanding ARR from $50M to $600M+, and governing a 2,500+ global workforce across North America, EMEA, and APAC.").
  * STAFF / PRINCIPAL / DIRECTOR / LEAD:
    - Focus on strategic systems architecture, cross-functional organizational leadership, multi-team roadmap ownership, technical vision, and quantifiable business outcomes.
  * SENIOR / MID / EARLY CAREER:
    - Calibrate to their authentic scope with high-impact Google XYZ execution, velocity, and measurable deliverables.

1. GENERAL RECRUITER CONVERSATION / GREETINGS / CAREER ADVICE / OFF-TOPIC:
   - User says "hi", "hello", asks general career questions, asks ATS formatting questions (e.g., "is 1 page better?", "how long should my resume be?"), or casual discussion.
   - Behavior: Respond conversationally as a top-tier executive recruiter. Be warm, direct, insightful, and concise. Offer clear guidance or suggest 2-3 strategic ways you can help.
   - Action: Set "action": { "type": "none" }.
   - "replyText": Your complete conversational response in markdown. Do NOT force an edit card!

2. RESUME AUDIT / 6-SECOND SCAN / "HOW CAN I IMPROVE THIS?":
   - User asks "how can i improve this resume?", "what is wrong with my CV?", "audit my resume", "review my resume", or asks for overall critique.
   - Behavior: Perform an authentic 6-second recruiter scan. Provide a sharp, honest, professional critique broken into 3 clear pillars:
     1. **Top-of-Fold Hook (Title & Summary)**: Evaluate whether the opening value proposition hooks a hiring manager in 6 seconds.
     2. **Impact & Metric Density (Work Experience)**: Evaluate whether bullets use the Google XYZ formula (Action + Context/Scale + Quantified Outcome) or read like passive task lists.
     3. **ATS & Competency Alignment (Skills & Structure)**: Evaluate whether technical and domain keywords are scannable and aligned.
     End with an engaging question asking which area they would like to tackle first.
   - Action: Set "action": { "type": "none" }.
   - "replyText": Your complete audit and critique formatted in clean markdown. Do NOT force an edit card!

3. METRIC DISCOVERY / RECRUITER INTERVIEW & COACHING STANDARDS:
   - User wants to strengthen a bullet or role, or asks how to add metrics/impact.
   - METRIC DIVERSITY & ANTI-% SPAM RULES (ABSOLUTE MANDATE):
     * NEVER tell candidates to just spam percentages (%) on every bullet point.
     * STRICT LIMIT: At most ONE percentage (%) per role. The vast majority of bullets must use diverse real-world metrics:
       - Dollar amounts & budgets (e.g., "$75,000 marketing budget", "$1.8M ARR pipeline", "$350k cost reduction")
       - Volume & scale (e.g., "4,500 new newsletter subscribers", "50,000+ daily transactions", "120k monthly active users")
       - Team & operational scope (e.g., "14-engineer agile squad", "across 8 enterprise client accounts")
       - Timeframes & latency (e.g., "delivered in 3 months", "reduced deployment cycle from 2 weeks to 3 days", "cut latency from 450ms to 95ms")
   - TOP-NOTCH EXECUTIVE EXAMPLES (NEVER USE WEAK JUNIOR SAMPLES):
     * When giving examples or coaching in chat, NEVER use lazy placeholders like "increased retention by 15%".
     * ALWAYS showcase elite, high-caliber Google XYZ examples such as:
       - "Managed a marketing budget of $75,000, achieving a 12% reduction in customer acquisition cost while scaling organic leads by 3,200/month."
       - "Increased email newsletter subscriptions by 4,500 in 3 months through targeted landing page optimizations and multi-variant A/B testing."
       - "Architected scalable microservices handling 2.4M daily requests, cutting server latency from 380ms to 65ms across 12 distributed regions."
       - "Spearheaded fintech checkout redesign across 6 design sprints, cutting drop-offs and processing $4.8M in monthly transaction volume."
   - Action: Set "action": { "type": "none" }.
   - "replyText": Your concise discovery question or coaching in markdown.

4. CONCRETE RESUME MUTATION / SECTION REWRITE / PROPOSAL:
   - User EXPLICITLY requests to rewrite, update, add, delete, or tailor a specific section/bullet/skill/title (e.g. "rewrite my summary", "change my title to Senior Product Designer", "add TypeScript to skills", "add this bullet to my Google role", "give me 12 skills for a 4-row layout", "tailor for this job").
   - Behavior:
     * Set "action.type" to the appropriate mutation ("update_summary", "update_title", "set_skills", "add_skill", "remove_skill", "replace_bullets", "add_bullet", "update_achievements").
     * Populate the action payload with top-tier, calibrated content:
       - Bullets: Google XYZ format, strictly 2 full lines (24-34 words / 150-220 chars), strong unique action verbs, max 1 percentage per role, enriched with real scale/dollars/volume/timeframes.
       - Summary: 2-3 authoritative sentences, dynamic opener (NO cliché buzzwords like "Results-driven", "Dynamic", "Passionate", "Self-starter").
       - Skills: High-value keywords, exact count if requested.
     * "replyText": A concise 1-2 sentence recruiter rationale explaining WHY this change strengthens their candidacy (e.g., "I've harmonized your core skills to match the target ATS keyword taxonomy:"). CRITICAL: NEVER list or repeat the raw skills, bullet items, summary text, or achievements inside replyText, as the UI automatically displays the interactive proposal card directly beneath your message.

5. CONVERSATIONAL REPAIR / "WHERE IS IT?":
   - If the user says "i cant see it", "where are the skills", "where did it go", "show me":
   - Inspect conversation history, re-generate the action payload for that item, and introduce it in 1 sentence.

Return strictly valid JSON with this shape:
{
  "replyText": "Your markdown response (for advice/critique/chat) OR 1-2 sentence recruiter rationale (if proposing an action).",
  "action": {
    "type": "none" | "set_skills" | "add_skill" | "remove_skill" | "replace_bullets" | "add_bullet" | "update_summary" | "update_title" | "update_achievements",
    "experienceIndex": 0,
    "bulletText": "• Engineered modular payment gateway integrating Stripe and GraphQL, cutting transaction latency from 450ms to 95ms and processing 50K daily checkouts.",
    "summaryText": "Senior Product Designer with deep expertise in fintech workflows and complex multi-step checkout architecture...",
    "skill": "React.js",
    "skills": "Product Strategy, Enterprise SaaS, AI/ML Discovery, Agile & Scrum, Roadmap Planning, Go-to-Market, SQL, A/B Testing, User Experience, Cross-Functional Leadership, Cloud Infrastructure, Systems Architecture",
    "achievementsText": "• Spearheaded end-to-end launch of 3 B2B SaaS products, generating $1.4M in new ARR across 12 enterprise accounts in the first 6 months...",
    "title": "Senior Product Designer"
  }
}
`;

            const res = await callAIJSON(prompt, 'gpt-4o', 0.3);
            let replyText = (res.replyText || 'I have reviewed your request.').trim();
            const action = res.action;

            // Strip any accidental full-text duplication or quotation from replyText if an action is present
            if (action && action.type !== 'none') {
                const quoteMatch = replyText.match(/^(.*?):\s*"[\s\S]*"$/);
                if (quoteMatch && quoteMatch[1]) {
                    replyText = `${quoteMatch[1].trim()}:`;
                }
                if (replyText.includes('\n•') || replyText.includes('\n-') || replyText.includes('\n*') || replyText.includes('\n1.')) {
                    const firstLine = replyText.split('\n')[0].trim();
                    if (firstLine) {
                        replyText = firstLine.endsWith(':') ? firstLine : `${firstLine}:`;
                    }
                }
            }

            if (action && action.type === 'set_skills') {
                const rawSkills = action.skills || action.skill || '';
                const skillsList = Array.isArray(rawSkills)
                    ? rawSkills.join(', ')
                    : String(rawSkills).replace(/\n/g, ', ').split(',').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).join(', ');
                const skillCount = skillsList.split(',').filter(Boolean).length;

                streamAssistantMessage(
                    {
                        id: `proposal-${Date.now()}`,
                        type: 'proposal',
                        proposal: {
                            section: 'skills',
                            title: `Core Skills Update (${skillCount} Skills)`,
                            proposed: skillsList,
                            proposedSkills: skillsList,
                            applied: false
                        }
                    },
                    replyText || `Here is your updated set of ${skillCount} Core Skills:`
                );
            } else if (action && action.type === 'add_skill' && action.skill) {
                const newSkill = action.skill.trim();
                const currentSkills = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean);
                if (!currentSkills.some(s => s.toLowerCase() === newSkill.toLowerCase())) {
                    currentSkills.push(newSkill);
                    const updatedSkillsStr = currentSkills.join(', ');
                    streamAssistantMessage(
                        {
                            id: `proposal-${Date.now()}`,
                            type: 'proposal',
                            proposal: {
                                section: 'skills',
                                title: `Add Skill: ${newSkill}`,
                                proposed: updatedSkillsStr,
                                proposedSkills: updatedSkillsStr,
                                applied: false
                            }
                        },
                        replyText
                    );
                } else {
                    streamAssistantMessage(
                        { id: `agent-${Date.now()}`, type: 'text' },
                        `The skill "${newSkill}" is already in your skills list.`
                    );
                }
            } else if (action && action.type === 'remove_skill' && (action.skill || action.skills)) {
                const toRemove = (action.skill || action.skills || '').toLowerCase().trim();
                const currentSkills = (data.skills || '').split(',').map(s => s.trim()).filter(Boolean);
                const filtered = currentSkills.filter(s => s.toLowerCase() !== toRemove);
                const updatedSkillsStr = filtered.join(', ');
                streamAssistantMessage(
                    {
                        id: `proposal-${Date.now()}`,
                        type: 'proposal',
                        proposal: {
                            section: 'skills',
                            title: `Remove Skill: ${action.skill || action.skills}`,
                            proposed: updatedSkillsStr,
                            proposedSkills: updatedSkillsStr,
                            applied: false
                        }
                    },
                    replyText
                );
            } else if (action && action.type === 'replace_bullets' && action.bulletText) {
                const expIdx = Math.max(0, Math.min(data.experience.length - 1, action.experienceIndex ?? 0));
                const targetExp = data.experience[expIdx];
                const domain = detectActionVerbDomain(`${targetExp?.role || ''} ${targetExp?.company || ''}`);
                const usedVerbs = getUsedStartingVerbs(data);
                const uniqueBullets = ensureAllBulletsHaveUniqueVerbs(action.bulletText.trim(), usedVerbs, domain);

                streamAssistantMessage(
                    {
                        id: `proposal-${Date.now()}`,
                        type: 'proposal',
                        proposal: {
                            section: 'experience',
                            experienceIndex: expIdx,
                            title: `Experience Bullets for ${targetExp?.role || 'Role'} at ${targetExp?.company || 'Company'}`,
                            proposed: uniqueBullets,
                            proposedSummary: uniqueBullets,
                            mode: 'replace',
                            applied: false
                        }
                    },
                    replyText
                );
            } else if (action && action.type === 'add_bullet' && typeof action.experienceIndex === 'number' && action.bulletText) {
                const expIdx = Math.max(0, Math.min(data.experience.length - 1, action.experienceIndex));
                const targetExp = data.experience[expIdx];
                let bullet = action.bulletText.trim();
                if (!bullet.startsWith('•')) bullet = `• ${bullet}`;
                if (!bullet.endsWith('.')) bullet = `${bullet}.`;

                const domain = detectActionVerbDomain(`${targetExp?.role || ''} ${targetExp?.company || ''}`);
                const usedVerbs = getUsedStartingVerbs(data);
                const uniqueBullet = ensureAllBulletsHaveUniqueVerbs(bullet, usedVerbs, domain);

                streamAssistantMessage(
                    {
                        id: `proposal-${Date.now()}`,
                        type: 'proposal',
                        proposal: {
                            section: 'experience',
                            experienceIndex: expIdx,
                            title: `Proposed Bullet for ${targetExp?.role || 'Role'} at ${targetExp?.company || 'Company'}`,
                            proposed: uniqueBullet,
                            mode: 'append',
                            applied: false
                        }
                    },
                    replyText
                );
            } else if (action && action.type === 'update_summary' && action.summaryText) {
                const cleanSummary = action.summaryText.trim();
                streamAssistantMessage(
                    {
                        id: `proposal-${Date.now()}`,
                        type: 'proposal',
                        proposal: {
                            section: 'summary',
                            title: 'Professional Summary Update',
                            proposed: cleanSummary,
                            proposedSummary: cleanSummary,
                            applied: false
                        }
                    },
                    replyText
                );
            } else if (action && action.type === 'update_achievements' && action.achievementsText) {
                const cleanAchievements = action.achievementsText.trim();
                streamAssistantMessage(
                    {
                        id: `proposal-${Date.now()}`,
                        type: 'proposal',
                        proposal: {
                            section: 'keyAchievements',
                            title: 'Key Achievements Update',
                            proposed: cleanAchievements,
                            proposedSummary: cleanAchievements,
                            applied: false
                        }
                    },
                    replyText
                );
            } else if (action && action.type === 'update_title' && action.title) {
                const newTitle = action.title.trim();
                streamAssistantMessage(
                    {
                        id: `proposal-${Date.now()}`,
                        type: 'proposal',
                        proposal: {
                            section: 'title',
                            title: 'Job Title Alignment',
                            proposed: newTitle,
                            proposedTitle: newTitle,
                            applied: false
                        }
                    },
                    replyText
                );
            } else {
                // Natural conversational recruiter response (no proposal card)
                streamAssistantMessage(
                    { id: `agent-${Date.now()}`, type: 'text' },
                    replyText
                );
            }
        } catch (err: any) {
            console.error('Chat handling error:', err);
            streamAssistantMessage(
                { id: `agent-${Date.now()}`, type: 'text' },
                'I can help you tailor your resume, add new bullet points, or optimize for ATS systems. What would you like to update next?'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClearChat = () => {
        try {
            localStorage.removeItem(currentStorageKey);
        } catch (_) {}
        setMessages([initialWelcomeMessage]);
        if (data.agentMessages && data.agentMessages.length > 0) {
            onChange({ ...data, agentMessages: [] });
        }
    };

    const handlePasteClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
                setInputText(text.trim());
            }
        } catch (_) {
            // Fallback
        }
    };

    // Skills breakdown for welcome card
    const skillsList = useMemo(() => {
        return (data.skills || '').split(',').map(s => s.trim()).filter(Boolean);
    }, [data.skills]);

    return (
        <div className="flex flex-col bg-white h-full w-full border-l border-neutral-200/80 select-text overflow-hidden text-neutral-800">
            {/* Top Tab Bar: CHAT | CONTEXT | HISTORY | Clear */}
            <div className="h-12 border-b border-neutral-200/80 bg-white px-3 flex items-center justify-between shrink-0 select-none w-full">
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setActiveTab('chat')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'chat'
                                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                                : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                    >
                        <MessageSquare className="w-3.5 h-3.5 text-neutral-700" />
                        <span className="uppercase tracking-wider text-[11px]">Chat</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('context')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'context'
                                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                                : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5 text-neutral-700" />
                        <span className="uppercase tracking-wider text-[11px]">Context</span>
                        {data.jobDescription && data.jobDescription.trim().length > 25 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'history'
                                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                                : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                    >
                        <History className="w-3.5 h-3.5 text-neutral-700" />
                        <span className="uppercase tracking-wider text-[11px]">History</span>
                    </button>
                </div>

                {activeTab === 'chat' && (
                    <button
                        type="button"
                        onClick={handleClearChat}
                        title="Clear chat history"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                    </button>
                )}
            </div>

            {/* CHAT TAB VIEW */}
            {activeTab === 'chat' ? (
                <div className="flex-1 flex flex-col min-h-0 bg-white w-full">
                    {/* Messages Scroll Area */}
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar">
                        {messages.map((msg) => {
                            if (msg.sender === 'user') {
                                return (
                                    <div key={msg.id} className="flex justify-end pl-6 animate-fadeIn">
                                        <div className="bg-brand-green text-brand-dark font-medium rounded-2xl rounded-tr-xs px-3.5 py-2.5 text-xs leading-relaxed max-w-full shadow-2xs border border-brand-green/60">
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            }

                            // Welcome Card (Instructing users to paste job description)
                            if (msg.type === 'welcome') {
                                return (
                                    <div key={msg.id} className="space-y-3 animate-fadeIn">
                                        {/* Structured Instruction Card */}
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
                                                    Core Features
                                                </div>
                                                <div className="space-y-2 text-xs text-neutral-600">
                                                    <div className="flex items-start gap-2">
                                                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                                            <Target className="w-3 h-3" />
                                                        </span>
                                                        <span><strong>ATS Keyword Gap Analysis:</strong> Real-time scan comparing your profile to target job postings.</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                                            <Zap className="w-3 h-3" />
                                                        </span>
                                                        <span><strong>Google XYZ Impact Bullets:</strong> Proven formula transforming tasks into quantifiable achievements.</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                                            <Sparkles className="w-3 h-3" />
                                                        </span>
                                                        <span><strong>1-Click AI Tailor & Sync:</strong> Instant section-by-section alignment with live preview.</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Candidate Profile Summary Snippet */}
                                            <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                                                <span>Profile: <strong>{data.fullName || 'Candidate'}</strong></span>
                                                <span>{data.experience.length} roles • {(data.skills || '').split(',').filter(Boolean).length} skills</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // Job Analysis Card
                            if (msg.type === 'job_analysis' && msg.analysis) {
                                const a = msg.analysis;
                                const strat = a.strategy;
                                return (
                                    <div key={msg.id} className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs space-y-4 animate-fadeIn">
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-100">
                                            <div className="space-y-0.5 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Target Role</span>
                                                    {a.company && (
                                                        <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md truncate max-w-[160px]">
                                                            {a.company}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-sm text-neutral-900 tracking-tight truncate">
                                                    {a.jobTitle || 'Target Role'}
                                                </h4>
                                            </div>
                                        </div>

                                        {/* Strategic Keywords Area */}
                                        {strat && (() => {
                                            const rawKeywords = [
                                                ...(strat.titleAndSummaryKeywords || []),
                                                ...(strat.experienceKeywords || []),
                                                ...(strat.coreCompetencies || [])
                                            ];
                                            const seen = new Set<string>();
                                            const allKeywords: string[] = [];
                                            for (const kw of rawKeywords) {
                                                const trimmed = typeof kw === 'string' ? kw.trim() : '';
                                                if (trimmed) {
                                                    const lower = trimmed.toLowerCase();
                                                    if (!seen.has(lower)) {
                                                        seen.add(lower);
                                                        allKeywords.push(trimmed);
                                                    }
                                                }
                                            }

                                            if (allKeywords.length === 0) return null;

                                            return (
                                                <div className="space-y-2.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                                                            Target Keywords
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400">Extracted from Job Description</span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5">
                                                        {allKeywords.map((kw, idx) => (
                                                            <span
                                                                key={`${kw}-${idx}`}
                                                                className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-100/80 text-neutral-800 border border-neutral-200/60 hover:bg-neutral-100 transition-colors"
                                                            >
                                                                {kw}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Step-by-Step Action Plan based on Sections in Resume */}
                                        {(() => {
                                            const steps: Array<{
                                                num: number;
                                                title: string;
                                                desc: string;
                                                onClick: () => void;
                                            }> = [];
                                            let stepNum = 1;

                                            // 1. Title & Summary
                                            steps.push({
                                                num: stepNum++,
                                                title: 'Align Title & Summary',
                                                desc: 'Mirror target role title and lead with executive narrative',
                                                targetPath: 'summary',
                                                onClick: () => handleAlignTitleAndSummary(a.jobData)
                                            });

                                            // 2. Key Achievements / Career Highlights (if present)
                                            const hasAchievements = Boolean(
                                                (Array.isArray(data.keyAchievements) && data.keyAchievements.length > 0) ||
                                                (typeof data.keyAchievements === 'string' && data.keyAchievements.trim().length > 0)
                                            );
                                            if (hasAchievements) {
                                                steps.push({
                                                    num: stepNum++,
                                                    title: 'Elevate Key Achievements',
                                                    desc: 'Align flagship career highlights with target role outcomes',
                                                    targetPath: 'keyAchievements',
                                                onClick: () => handleTailorAchievements(a.jobData)
                                                });
                                            }

                                            // 3. Work Experience (if present)
                                            if (data.experience && data.experience.length > 0) {
                                                steps.push({
                                                    num: stepNum++,
                                                    title: `Tailor Experience Bullets (${data.experience.length} ${data.experience.length === 1 ? 'role' : 'roles'})`,
                                                    desc: 'Weave JD keywords into real achievements (Google XYZ format)',
                                                    targetPath: 'experience.0',
                                                onClick: () => handleTailorExperience(a.jobData, 0)
                                                });
                                            }

                                            // 4. Projects (if present)
                                            if (data.projects && data.projects.length > 0) {
                                                steps.push({
                                                    num: stepNum++,
                                                    title: `Tailor Projects (${data.projects.length} ${data.projects.length === 1 ? 'project' : 'projects'})`,
                                                    desc: 'Highlight tech stack and architecture outcomes for target JD',
                                                    targetPath: 'projects.0',
                                                    onClick: () => handleTailorProjects(a.jobData, 0)
                                                });
                                            }

                                            // 5. Leadership (if present)
                                            if (data.leadership && data.leadership.length > 0) {
                                                steps.push({
                                                    num: stepNum++,
                                                    title: `Elevate Leadership (${data.leadership.length} ${data.leadership.length === 1 ? 'role' : 'roles'})`,
                                                    desc: 'Emphasize governance, mentoring, and team leadership',
                                                    targetPath: 'leadership.0',
                                                    onClick: () => handleTailorLeadership(a.jobData, 0)
                                                });
                                            }

                                            // 6. Additional / Custom Sections (if present)
                                            const populatedInfo = (data.additionalInfo || []).filter(item => item && (item.label?.trim() || item.value?.trim()));
                                            populatedInfo.forEach((item, idx) => {
                                                steps.push({
                                                    num: stepNum++,
                                                    title: `Elevate ${item.label || 'Custom Section'}`,
                                                    desc: `Align ${item.label?.toLowerCase() || 'section'} details with target role context`,
                                                    targetPath: `additionalInfo.${idx}`,
                                                    onClick: () => handleTailorAdditionalInfo(a.jobData, idx)
                                                });
                                            });

                                            // 7. Core Skills
                                            steps.push({
                                                num: stepNum++,
                                                title: 'Harmonize Core Skills',
                                                desc: 'Align competencies with target job requirements',
                                                targetPath: 'skills',
                                                onClick: () => handleHarmonizeSkills(a.jobData)
                                            });

                                            return (
                                                <div className="space-y-2.5 pt-2 border-t border-neutral-100">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                                                            Optimize for this role:
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400">{steps.length} sections</span>
                                                    </div>

                                                    <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200/80 bg-neutral-50/40 overflow-hidden">
                                                        {steps.map((st) => (
                                                            <button
                                                                key={st.num}
                                                                type="button"
                                                                onClick={st.onClick}
                                                                onMouseEnter={() => {
                                                                    const path = (st as any).targetPath;
                                                                    if (path) broadcastHighlight(path, 'highlight');
                                                                }}
                                                                onMouseLeave={() => {
                                                                    broadcastHighlight('', 'clear');
                                                                }}
                                                                disabled={isProcessing}
                                                                className="w-full px-3.5 py-2.5 text-left transition-colors flex items-center justify-between group hover:bg-white cursor-pointer bg-transparent"
                                                            >
                                                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                                    <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-emerald-600 transition-colors w-4 text-center">
                                                                        {st.num}
                                                                    </span>
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-medium text-neutral-800 group-hover:text-neutral-900 transition-colors truncate">
                                                                            {st.title}
                                                                        </p>
                                                                        <p className="text-[11px] text-neutral-400 truncate">{st.desc}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-medium text-emerald-600 shrink-0">
                                                                    <span>Optimize</span>
                                                                    <ChevronRight className="w-3 h-3" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Start Optimizing from Step 1 */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAlignTitleAndSummary(a.jobData)}
                                                        disabled={isProcessing}
                                                        className="w-full py-2.5 bg-brand-green hover:bg-brand-greenHover active:scale-[0.99] text-brand-dark font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-xs hover:shadow-sm border border-brand-green/60 cursor-pointer mt-2 disabled:opacity-50"
                                                    >
                                                        <span>Start Optimizing...</span>
                                                    </button>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                );
                            }

                            // Proposal Card (Summary or Bullets)
                            if (msg.type === 'proposal' && msg.proposal) {
                                const prop = msg.proposal;
                                return (
                                    <div key={msg.id} className="space-y-2.5 animate-fadeIn">
                                        {msg.text && (
                                            <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                                                <FormattedMarkdown content={msg.text} />
                                            </div>
                                        )}

                                        {!msg.isStreaming && (
                                    <div

                                        onMouseEnter={() => {
                                            const targetPath = getProposalTargetDataPath(prop);
                                            if (targetPath) broadcastHighlight(targetPath, 'highlight');
                                        }}
                                        onMouseLeave={() => {
                                            broadcastHighlight('', 'clear');
                                        }}
                                        className="bg-white rounded-2xl border border-neutral-200/80 hover:border-emerald-300/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs space-y-3 animate-fadeIn transition-all"
                                    >





                                        

                                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                                            <span className="text-xs font-bold text-neutral-900">{prop.title}</span>
                                            {prop.applied ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200/70">
                                                    <Check className="w-3 h-3 text-neutral-500" />
                                                    <span>Applied</span>
                                                </span>
                                            ) : prop.skipped ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200/70">
                                                    <span>Skipped</span>
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 text-xs text-neutral-800 leading-relaxed">
                                            <FormattedMarkdown content={prop.proposed} />
                                        </div>

                                        {!prop.applied && !prop.skipped && (
                                            <div className="space-y-2 pt-0.5">
                                                {/* Primary CTA */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleApplyProposal(msg.id, prop)}
                                                    disabled={isProcessing}
                                                    className="w-full py-2.5 bg-brand-green hover:bg-brand-greenHover active:scale-[0.99] text-brand-dark font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-brand-green/60 shadow-xs disabled:opacity-50"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span>Apply to Resume</span>
                                                </button>

                                                {/* Secondary Actions: Regenerate & Skip */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRegenerateProposal(prop)}
                                                        disabled={isProcessing}
                                                        className="w-full py-2 px-2.5 bg-white hover:bg-neutral-50 active:scale-[0.99] text-neutral-700 hover:text-neutral-900 border border-neutral-200/80 hover:border-neutral-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                                                    >
                                                        <RefreshCw className="w-3 h-3 text-neutral-500" />
                                                        <span>Regenerate</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSkipProposal(msg.id, prop)}
                                                        disabled={isProcessing}
                                                        className="w-full py-2 px-2.5 bg-white hover:bg-neutral-50 active:scale-[0.99] text-neutral-600 hover:text-neutral-800 border border-neutral-200/80 hover:border-neutral-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                                                    >
                                                        <span>Skip Step</span>
                                                        <ArrowRight className="w-3 h-3 text-neutral-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Standard Text Response
                            return (
                                <div key={msg.id} className="space-y-2 animate-fadeIn">
                                    <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                                        <FormattedMarkdown content={msg.text || ''} />

                                        {!msg.isStreaming && msg.actionPrompt && (
                                            <div className="pt-2.5 border-t border-neutral-100 mt-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (msg.actionPrompt?.onClickType === 'tailor_experience') {
                                                             handleTailorExperience(msg.actionPrompt.jobData, msg.actionPrompt.expIndex ?? 0);
                                                        } else if (msg.actionPrompt?.onClickType === 'tailor_achievements') {
                                                            handleTailorAchievements(msg.actionPrompt.jobData);
                                                        } else if (msg.actionPrompt?.onClickType === 'tailor_projects') {
                                                            handleTailorProjects(msg.actionPrompt.jobData, msg.actionPrompt.projIndex ?? 0);
                                                        } else if (msg.actionPrompt?.onClickType === 'tailor_leadership') {
                                                            handleTailorLeadership(msg.actionPrompt.jobData, msg.actionPrompt.leadIndex ?? 0);
                                                        } else if (msg.actionPrompt?.onClickType === 'tailor_additional_info') {
                                                            handleTailorAdditionalInfo(msg.actionPrompt.jobData, msg.actionPrompt.infoIndex ?? 0);
                                                        } else if (msg.actionPrompt?.onClickType === 'harmonize_skills') {
                                                            handleHarmonizeSkills(msg.actionPrompt.jobData);
                                                        } else if (msg.actionPrompt?.onClickType === 'tailor_title_summary') {
                                                            handleAlignTitleAndSummary(msg.actionPrompt.jobData);
                                                        }
                                                    }}
                                                    disabled={isProcessing}
                                                    className="w-full h-10 px-3.5 bg-brand-dark hover:bg-brand-dark/90 text-white font-medium text-xs rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-[0.99] select-none group"
                                                >
                                                    <span className="truncate pr-2 font-medium">{msg.actionPrompt.label}</span>
                                                    <span className="shrink-0 text-white/80 group-hover:text-white font-semibold text-xs flex items-center gap-1 transition-colors">
                                                        Proceed <ArrowRight className="w-3.5 h-3.5" />
                                                    </span>
                                                </button>
                                            </div>
                                        )}

                                        {!msg.isStreaming && msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="pt-2 border-t border-neutral-100 mt-2 flex flex-wrap gap-1.5 animate-fadeIn">
                                                {msg.suggestions.map((sug, sIdx) => (
                                                    <button
                                                        key={sIdx}
                                                        type="button"
                                                        onClick={() => {
                                                            setInputText(sug);
                                                        }}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 font-medium transition-colors cursor-pointer"
                                                    >
                                                        {sug}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {isProcessing && (
                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 p-2.5 bg-neutral-50/90 rounded-xl border border-neutral-200/70 animate-pulse">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-800 shrink-0" />
                                <span className="truncate">{processingStatus || 'Architecting role alignment...'}</span>
                            </div>
                        )}
                    </div>

                    {/* Chat Input Box with BorderBeam */}
                    <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-neutral-200/80 shrink-0 min-w-0 outline-none">
                        <BorderBeam
                            size={isProcessing ? 'pulse-inner' : 'md'}
                            theme="light"
                            borderRadius={12}
                            strength={isProcessing ? 0.95 : 0.75}
                            duration={isProcessing ? 1.4 : undefined}
                            className="rounded-xl shadow-2xs outline-none"
                        >
                            <div className="relative border border-neutral-200 rounded-xl p-2 bg-white transition-colors focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200/40 outline-none overflow-hidden">
                                <textarea
                                    ref={textareaRef}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            if (!isProcessing && inputText.trim()) handleSend();
                                        }
                                    }}
                                    placeholder={streamingPlaceholder}
                                    rows={2}
                                    className="w-full px-2 py-1 text-xs text-neutral-900 placeholder:text-neutral-400 border-none outline-none focus:outline-none focus:ring-0 resize-none bg-transparent min-w-0 break-words relative z-10 custom-scrollbar transition-all duration-150"
                                />

                                <div className="flex items-center justify-between pt-1 relative z-10 border-t border-neutral-100 mt-1">
                                    <button
                                        type="button"
                                        onClick={handlePasteClipboard}
                                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                                        title="Paste from clipboard"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={!inputText.trim() || isProcessing}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                            !inputText.trim() || isProcessing
                                                ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed border border-neutral-200/50'
                                                : 'bg-brand-green hover:bg-brand-greenHover text-brand-dark cursor-pointer shadow-xs border border-brand-green/60'
                                        }`}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </BorderBeam>
                    </form>
                </div>
            ) : activeTab === 'context' ? (
                /* CONTEXT TAB VIEW */
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white text-xs w-full">
                    {data.jobDescription && data.jobDescription.trim().length > 25 ? (
                        <>
                            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.03)] w-full">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Target Role</span>
                                <h3 className="font-bold text-sm text-neutral-900">
                                    {data.jobTitle || 'Target Position'}
                                </h3>
                            </div>

                            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.03)] w-full">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Target Job Description</span>
                                    <button
                                        type="button"
                                        onClick={() => onChange({ ...data, jobDescription: '', hasJobMatchRun: false })}
                                        className="text-[10px] font-medium text-rose-600 hover:underline cursor-pointer"
                                    >
                                        Clear Job
                                    </button>
                                </div>
                                <p className="text-neutral-700 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 custom-scrollbar">
                                    {data.jobDescription}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleAlignTitleAndSummary()}
                                disabled={isProcessing}
                                className="w-full py-3 bg-brand-green hover:bg-brand-greenHover active:scale-[0.98] text-brand-dark font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-xs hover:shadow-sm border border-brand-green/60 cursor-pointer mt-2 disabled:opacity-50"
                            >
                                <span>Start Optimizing...</span>
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-16 space-y-3 w-full">
                            <FileText className="w-10 h-10 text-neutral-300 mx-auto" />
                            <p className="font-bold text-sm text-neutral-800">No Job Context Available</p>
                            <p className="text-neutral-500 text-xs max-w-xs mx-auto leading-relaxed">
                                Paste a job description in the Chat tab or click below to provide target job requirements.
                            </p>
                            <button
                                type="button"
                                onClick={handlePasteClipboard}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 shadow-2xs transition-all cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Paste from Clipboard</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* HISTORY TAB VIEW */
                <div className="flex-1 flex flex-col min-h-0 bg-white text-xs w-full">
                    {/* Create Snapshot Form */}
                    <div className="p-3 border-b border-neutral-100 bg-neutral-50/50 shrink-0 w-full">
                        <form onSubmit={handleCreateSidebarSnapshot} className="flex gap-1.5 w-full">
                            <input
                                type="text"
                                value={snapshotName}
                                onChange={(e) => setSnapshotName(e.target.value)}
                                placeholder="Name this milestone..."
                                className="flex-1 px-2.5 py-1.5 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-hidden focus:border-brand-green"
                            />
                            <button
                                type="submit"
                                disabled={isCreatingSnapshot}
                                className="px-3 py-1.5 bg-brand-dark hover:bg-brand-dark/90 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{isCreatingSnapshot ? 'Saving...' : 'Save'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Snapshots List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar w-full">
                        {isLoadingVersions ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-neutral-400">
                                <Clock className="w-5 h-5 animate-spin text-brand-green" />
                                <span className="text-xs font-medium">Loading snapshots...</span>
                            </div>
                        ) : sidebarVersions.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-neutral-400">
                                <div className="w-9 h-9 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                                    <Bookmark className="w-4 h-4" />
                                </div>
                                <h4 className="text-xs font-bold text-neutral-700">No snapshots yet</h4>
                                <p className="text-[11px] text-neutral-500 max-w-[210px] leading-relaxed">
                                    Save a milestone above or run AI tailoring to automatically record restore points.
                                </p>
                            </div>
                        ) : (
                            sidebarVersions.map((ver, idx) => {
                                const { relative, time } = formatTimestamp(ver.created_at);
                                const isLatest = idx === 0;

                                return (
                                    <div
                                        key={ver.id}
                                        className="p-3 rounded-xl border border-neutral-200/80 bg-white hover:border-brand-green/50 transition-all space-y-2 shadow-2xs group"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="font-bold text-xs text-neutral-900 truncate">
                                                        {ver.version_name || `Version ${ver.version_number}`}
                                                    </span>
                                                    {isLatest && (
                                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                                                    <Clock className="w-3 h-3 shrink-0" />
                                                    <span>{relative} • {time}</span>
                                                </div>
                                                {ver.change_summary && (
                                                    <p className="text-[10px] text-neutral-500 line-clamp-1 italic">
                                                        {ver.change_summary}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRestoreSidebarVersion(ver)}
                                                    disabled={restoringVersionId === ver.id}
                                                    className="px-2 py-1 rounded-lg bg-neutral-100 hover:bg-brand-dark hover:text-white text-neutral-700 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                                    title="Restore this version"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                    <span>Restore</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSidebarVersion(ver.id, ver.version_name || `Version ${ver.version_number}`)}
                                                    className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title="Delete snapshot"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
