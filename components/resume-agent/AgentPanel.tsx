import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MessageSquare,
  FileText,
  Building2,
  Check,
  X,
  Plus,
  ArrowUp,
  Square,
  Pencil,
  HelpCircle,
  SkipForward,
  CheckCircle2,
  CornerDownLeft,
  Trash2
} from 'lucide-react';
import {
  AgentMessage,
  JobDescriptionData,
  JobMatchAnalysis,
  ResumeChange,
  MissingEvidenceItem
} from '../../types/resumeAgent';
import { BorderBeam } from 'border-beam';
import { useStreamingPlaceholder } from '../../utils/useStreamingPlaceholder';
import { loadFromStorage } from '../../utils/statePersistence';
import { TodoList, TodoItem } from '../agents/todo-list';
import ApprovalCard, { QuestionItem } from './ApprovalCard';
import ThinkingState from './ThinkingState';

interface AgentPanelProps {
  status: string;
  hasResumeLoaded: boolean;
  jobData: JobDescriptionData | null;
  analysis: JobMatchAnalysis | null;
  messages: AgentMessage[];
  pendingChanges: ResumeChange[];
  activeQuestion: MissingEvidenceItem | null;
  questionsRemaining?: number;
  progressTasks?: TodoItem[];
  onAnalyzeJobText: (text: string) => void;
  onUploadJobFile: () => void;
  onTailorResume: () => void;
  onAcceptChange: (id: string) => void;
  onRejectChange: (id: string) => void;
  onAcceptAllChanges: () => void;
  onAnswerQuestion: (answer: string, skip?: boolean) => void;
  onSendMessage: (text: string) => void;
  onClearChat?: () => void;
  isAgentRunning?: boolean;
  onStopAgent?: () => void;
  onOpenUploadResumeModal: () => void;
  onExportPDF: () => void;
}

/** Animated three-dot "assistant is thinking" indicator (ChatGPT-style). */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" role="status" aria-label="Assistant is thinking">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}

/** Lightweight Markdown renderer for structured AI chat output. */
function FormattedMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const renderInline = (text: string) => {
    const cleanText = text.replace(/✨/g, '').trimStart();
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;
    let keyIdx = 0;

    while ((match = regex.exec(cleanText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanText.substring(lastIndex, match.index));
      }
      const raw = match[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-brand-dark">
            {raw.slice(2, -2)}
          </strong>
        );
      } else if (raw.startsWith('`') && raw.endsWith('`')) {
        parts.push(
          <code key={keyIdx++} className="bg-brand-secondary/80 px-1.5 py-0.5 rounded text-[11px] font-mono text-emerald-800 border border-brand-border">
            {raw.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < cleanText.length) {
      parts.push(cleanText.substring(lastIndex));
    }

    return parts.length > 0 ? parts : cleanText;
  };

  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-xs text-brand-dark uppercase tracking-wider mt-2.5 mb-1 border-b border-brand-border/60 pb-1">
              {renderInline(trimmed.slice(4))}
            </h4>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-extrabold text-xs text-brand-dark mt-2.5 mb-1">
              {renderInline(trimmed.slice(3))}
            </h3>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 text-xs pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-dark/40 mt-1.5 shrink-0" />
              <div className="flex-1">{renderInline(trimmed.slice(2))}</div>
            </div>
          );
        }

        return <p key={idx}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

/** Structured Operation Card for live agent edits */
function OperationCard({ op }: { op: ResumeOperation; key?: string }) {
  const getOpBadge = () => {
    switch (op.op) {
      case 'replace_bullet':
        return { label: 'Replace Bullet', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'insert_bullet':
        return { label: 'Insert Bullet', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'delete_bullet':
        return { label: 'Delete Bullet', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'set_field':
        return { label: `Set ${op.field}`, color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'add_skill':
        return { label: 'Add Skill', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'remove_skill':
        return { label: 'Remove Skill', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'set_skills':
        return { label: 'Set Skills', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      default:
        return { label: op.op, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const badge = getOpBadge();

  return (
    <div className="bg-white rounded-lg border border-brand-border p-3 shadow-2xs space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border ${badge.color}`}>
          {badge.label}
        </span>
        {'section' in op && op.section && (
          <span className="text-[10px] uppercase font-bold text-brand-dark/50 bg-brand-secondary px-2 py-0.5 rounded">
            {op.section}
          </span>
        )}
      </div>

      {'value' in op && op.value && (
        <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-md text-emerald-950 font-medium">
          {op.value}
        </div>
      )}

      {op.reason && (
        <p className="text-[11px] text-brand-dark/80 italic">
          {op.reason}
        </p>
      )}

      {op.evidence && op.evidence.length > 0 && (
        <div className="text-[10px] text-brand-dark/60 font-mono bg-brand-secondary/50 p-1.5 rounded flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="truncate">Grounded in: "{op.evidence[0]}"</span>
        </div>
      )}
    </div>
  );
}

/** Agent Approval / Question Card (human-in-the-loop) */
function AgentQuestionCard({
  item,
  onAnswerQuestion,
}: {
  item: MissingEvidenceItem;
  isActive: boolean;
  onAnswerQuestion: (answer: string, skip?: boolean) => void;
}) {
  const options = (() => {
    if (item.category === 'missing_skill') {
      return [
        `Yes, I have hands-on experience with ${item.requirement}`,
        'Basic familiarity / working knowledge',
        'No direct experience (highlight adjacent tools)',
      ];
    }
    if (item.category === 'quantify') {
      return [
        '15% – 30% performance / metric improvement',
        '30%+ cost reduction / revenue growth',
        'Scaled to hundreds of users / transactions',
      ];
    }
    if (item.category === 'scope') {
      return [
        'Led end-to-end strategy & execution',
        'Core individual contributor across team',
        'Coordinated cross-functional stakeholders',
      ];
    }
    return [
      'Yes, strongly emphasize this in my experience',
      'Mention briefly as supporting work',
      'Skip this topic',
    ];
  })();

  const questionItem: QuestionItem = {
    id: item.id,
    q: item.question,
    type: 'radio',
    options,
    requirement: item.requirement,
    reason: item.reason,
  };

  return (
    <div className="my-2">
      <ApprovalCard
        questions={[questionItem]}
        onSubmitted={(results) => {
          const res = results[0];
          const answerText = (res?.selected && res.selected.length > 0)
            ? res.selected[0]
            : res?.custom || '';
          onAnswerQuestion(answerText);
        }}
        onAnswerQuestion={(ans) => onAnswerQuestion(ans)}
        theme="dark"
      />
    </div>
  );
}

export default function AgentPanel({
  status,
  hasResumeLoaded,
  jobData,
  analysis,
  messages,
  pendingChanges,
  activeQuestion,
  questionsRemaining = 0,
  progressTasks,
  onAnalyzeJobText,
  onUploadJobFile,
  onTailorResume,
  onAnswerQuestion,
  onSendMessage,
  onClearChat,
  isAgentRunning = false,
  onStopAgent,
  onOpenUploadResumeModal,
  onExportPDF,
}: AgentPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'context'>('chat');
  const [inputText, setInputText] = useState('');
  const [internalTasks, setInternalTasks] = useState<TodoItem[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const streamingPlaceholder = useStreamingPlaceholder();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prefill pending chat prompt if loaded from Job Board
  useEffect(() => {
    const storedPrompt = loadFromStorage<string | null>('cv_pending_chat_prompt', null);
    if (storedPrompt && typeof storedPrompt === 'string' && storedPrompt.trim()) {
      setActiveTab('chat');
      setInputText(storedPrompt.trim());
      try {
        localStorage.removeItem('cv_pending_chat_prompt');
      } catch (_) {}

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, []);

  // Synchronize dynamic thinking tasks based on active agent status
  useEffect(() => {
    if (progressTasks && progressTasks.length > 0) {
      setInternalTasks(progressTasks);
      return;
    }

    if (isAgentRunning || (status && status !== 'Ready')) {
      const lower = (status || '').toLowerCase();
      if (lower.includes('analyzing') || lower.includes('parsing')) {
        setInternalTasks([
          { id: 't1', title: 'Extracting candidate experience & skills', status: 'completed' },
          { id: 't2', title: 'Parsing job description requirements & tools', status: 'in-progress' },
          { id: 't3', title: 'Mapping evidence & computing ATS fit', status: 'pending' },
        ]);
      } else if (lower.includes('tailoring') || lower.includes('editing')) {
        setInternalTasks([
          { id: 't1', title: 'Extracted job requirements & target skills', status: 'completed' },
          { id: 't2', title: 'Mapped candidate evidence matrix', status: 'completed' },
          { id: 't3', title: 'Constructing high-impact bullet improvements', status: 'in-progress' },
          { id: 't4', title: 'Validating metric truthfulness & grounding', status: 'pending' },
          { id: 't5', title: 'Running ATS & recruiter diagnostic check', status: 'pending' },
        ]);
      } else if (lower.includes('reviewing') || lower.includes('evaluating')) {
        setInternalTasks([
          { id: 't1', title: 'Extracted job requirements & target skills', status: 'completed' },
          { id: 't2', title: 'Mapped candidate evidence matrix', status: 'completed' },
          { id: 't3', title: 'Constructed high-impact bullet improvements', status: 'completed' },
          { id: 't4', title: 'Validated metric truthfulness & grounding', status: 'completed' },
          { id: 't5', title: 'Ran ATS & recruiter diagnostic check', status: 'completed' },
        ]);
      } else {
        setInternalTasks([
          { id: 't1', title: 'Reading resume & job context', status: 'completed' },
          { id: 't2', title: 'Formulating grounded strategy', status: 'in-progress' },
          { id: 't3', title: 'Executing structured operations', status: 'pending' },
        ]);
      }
    } else {
      setInternalTasks((prev) =>
        prev.length > 0 ? prev.map((t) => ({ ...t, status: 'completed' as const })) : []
      );
    }
  }, [isAgentRunning, status, progressTasks]);

  useEffect(() => {
    if (chatScrollRef.current && activeTab === 'chat') {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, pendingChanges, status, activeTab]);

  // Dynamically adjust input box height when typing or pasting long texts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 40), 160);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputText]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // While a run is streaming, the primary button is Stop — don't also submit.
    if (isAgentRunning) {
      onStopAgent?.();
      return;
    }
    const clean = inputText.trim();
    if (!clean) return;

    if (activeQuestion) {
      // Mid-questioning: the reply is the answer to the active clarifying question.
      onAnswerQuestion(clean);
    } else if (!jobData && (clean.length > 100 || clean.toLowerCase().includes('responsibilities') || clean.toLowerCase().includes('requirements'))) {
      onAnalyzeJobText(clean);
    } else {
      onSendMessage(clean);
    }
    setInputText('');

    // Instantly scroll to bottom of chat feed so user sees their message on screen immediately
    requestAnimationFrame(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!jobData && suggestion.includes('Paste a job description')) {
      setInputText('');
    } else {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="flex flex-col bg-white h-full border-l border-brand-border select-text overflow-hidden text-brand-dark">
      <div className="h-12 border-b border-brand-border bg-brand-secondary/60 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-brand-dark shadow-xs border border-brand-border'
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-dark" />
            <span className="uppercase tracking-wider text-[11px]">Chat</span>
            {pendingChanges.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('context')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'context'
                ? 'bg-white text-brand-dark shadow-xs border border-brand-border'
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-brand-dark" />
            <span className="uppercase tracking-wider text-[11px]">Context</span>
            {jobData && <span className="text-[10px] text-emerald-600 font-extrabold">✓</span>}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onClearChat && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              title="Clear chat history"
              className="p-1.5 rounded-lg text-brand-dark/50 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-[11px] font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Clear Chat Alert Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="bg-white/95 rounded-[16px] border border-black/5 p-5 max-w-sm w-full shadow-2xl shadow-black/10 space-y-4 animate-in zoom-in-95 duration-200 text-left backdrop-blur-xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-[12px] bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-700 shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 pt-0.5">
                <h3 id="clear-dialog-title" className="text-[14px] font-semibold text-neutral-900 tracking-tight">
                  Clear conversation?
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  This will clear your current conversation and reset any staged suggestion cards. Your resume document will remain untouched.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 rounded-[10px] border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100/80 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowClearConfirm(false);
                  onClearChat?.();
                }}
                className="px-3.5 py-1.5 rounded-[10px] bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs leading-relaxed">
            {messages
              .filter((msg) => {
                const isWelcomeMessage =
                  msg.id.startsWith('welcome') ||
                  msg.id.startsWith('msg_welcome') ||
                  msg.id.includes('welcome') ||
                  (typeof msg.text === 'string' && msg.text.includes('Hello! I am your AI Resume Agent'));

                const hasActiveWork =
                  isAgentRunning ||
                  (status && status !== 'Ready') ||
                  !!jobData ||
                  !!analysis ||
                  pendingChanges.length > 0 ||
                  !!activeQuestion ||
                  messages.some(
                    (m) =>
                      m.id !== msg.id &&
                      (m.sender === 'user' ||
                        m.type === 'analysis' ||
                        m.type === 'missing_evidence' ||
                        (m.type === 'text' && !m.id.includes('welcome') && !m.id.startsWith('loading_') && m.text !== msg.text))
                  );

                if (
                  (msg.type === 'loading' && !isAgentRunning && (!status || status === 'Ready')) ||
                  (msg.type === 'text' && msg.text && msg.text.includes('Processing "') && !isAgentRunning)
                ) {
                  return false;
                }
                return true;
              })
              .map((msg) => {
                const isUser = msg.sender === 'user';

              if (msg.type === 'loading') {
                return (
                  <div key={msg.id} className="py-0.5">
                    <div className="flex justify-start">
                      <div className="inline-flex items-center rounded-md px-2.5 py-1 bg-brand-secondary text-brand-dark border border-brand-border font-normal shadow-2xs">
                        <ThinkingState
                          status={status}
                          isWorking={true}
                          jobTitle={jobData?.title}
                          company={jobData?.company}
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'text') {
                const isStreamingBubble =
                  !isUser && isAgentRunning && msg.id === messages[messages.length - 1]?.id;
                const isEditing = isStreamingBubble && /editing/i.test(status);
                const showThinking = isStreamingBubble && !msg.text?.trim();
                return (
                  <div key={msg.id} className="space-y-2">
                    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[90%] min-w-0 break-words ${
                          showThinking
                            ? 'inline-flex items-center rounded-md px-2.5 py-1 bg-brand-secondary text-brand-dark border border-brand-border font-normal shadow-2xs'
                            : 'rounded-xl px-3.5 py-2 text-xs leading-relaxed ' +
                              (isUser
                                ? 'bg-brand-dark text-white rounded-br-xs font-medium'
                                : 'bg-brand-secondary text-brand-dark rounded-bl-xs border border-brand-border font-normal')
                        }`}
                      >
                        {isEditing && (
                          <div className="mb-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-green/20 border border-brand-green/40 text-emerald-800 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                              <Pencil className="w-2.5 h-2.5" />
                              <span>Editing resume</span>
                            </span>
                          </div>
                        )}
                        {showThinking ? (
                          <ThinkingState
                            status={status}
                            isWorking={isAgentRunning || (Boolean(status) && status !== 'Ready')}
                            jobTitle={jobData?.title}
                            company={jobData?.company}
                          />
                        ) : (
                          <>
                            {isUser ? (
                              msg.text
                            ) : (
                              <FormattedMarkdown content={msg.text || ''} />
                            )}
                            {isStreamingBubble && (
                              <span className="ml-0.5 inline-block w-1.5 h-3 -mb-0.5 rounded-sm bg-brand-dark/50 animate-pulse align-middle" />
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Rendered Live Operation Cards */}
                    {msg.operations && msg.operations.length > 0 && (
                      <div className="pl-2 space-y-2 max-w-[88%]">
                        <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider pt-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Applied Resume Edits ({msg.operations.length})</span>
                        </div>
                        {msg.operations.map((op) => (
                          <OperationCard key={op.operationId} op={op} />
                        ))}
                      </div>
                    )}

                    {/* Suggestion Chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && !isAgentRunning && (
                      <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(sug)}
                            className="px-2.5 py-1 bg-white hover:bg-brand-secondary border border-brand-border hover:border-brand-dark/40 rounded-md text-[11px] font-semibold text-brand-dark transition-all shadow-2xs"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (msg.type === 'analysis' && msg.analysis && jobData) {
                const a = msg.analysis;
                return (
                  <div key={msg.id} className="bg-brand-secondary/70 rounded-xl border border-brand-border p-3.5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-brand-dark/50">Match Evaluation</span>
                        <h4 className="font-bold text-sm text-brand-dark">{jobData.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-emerald-600 leading-none">{a.matchScore}%</div>
                        <span className="text-[10px] font-semibold text-brand-dark/50">Score</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-brand-dark">
                        <span>Experience Alignment</span>
                        <span className="font-bold">{a.categoryScores.experienceMatch}%</span>
                      </div>
                      <div className="flex justify-between text-brand-dark">
                        <span>Skills Match</span>
                        <span className="font-bold">{a.categoryScores.skillsMatch}%</span>
                      </div>
                      <div className="flex justify-between text-brand-dark">
                        <span>Keyword Coverage</span>
                        <span className="font-bold">{a.categoryScores.keywordCoverage}%</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <p className="text-[11px] font-medium text-brand-dark mb-2">
                        I found <strong>{a.gaps.length} key areas</strong> to strengthen your resume:
                      </p>
                      <ul className="space-y-1 text-[11px] text-brand-dark/80 list-disc pl-4">
                        {a.gaps.map((gap, i) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={onTailorResume}
                      className="w-full py-2 bg-brand-green hover:bg-brand-greenHover text-brand-dark font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-dark" />
                      <span>Tailor My Resume Now</span>
                    </button>
                  </div>
                );
              }

              if (msg.type === 'loading') {
                return (
                  <div key={msg.id} className="flex items-center gap-2 text-xs font-medium text-brand-dark/70 p-2">
                    <div className="w-3.5 h-3.5 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing & tailoring bullet points...</span>
                  </div>
                );
              }

              if (msg.type === 'missing_evidence' && msg.missingEvidence) {
                const q = msg.missingEvidence;
                const isActive = activeQuestion?.id === q.id;
                return (
                  <AgentQuestionCard
                    key={msg.id}
                    item={q}
                    isActive={isActive}
                    onAnswerQuestion={onAnswerQuestion}
                  />
                );
              }

              return null;
            })}

          </div>

          {/* Question Action Bar above Input */}
          {activeQuestion && (
            <div className="px-3 py-2 bg-brand-secondary/80 border-t border-brand-border shrink-0 min-w-0 overflow-hidden">
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span>Answering{questionsRemaining > 0 ? ` · ${questionsRemaining} more after this` : ' · last question'}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto scrollbar-hide">
                <button
                  type="button"
                  onClick={() => onAnswerQuestion('', true)}
                  className="px-2.5 py-1 bg-white border border-brand-border hover:border-gray-300 rounded-lg text-xs font-semibold text-brand-dark transition-colors shadow-2xs shrink-0 whitespace-nowrap cursor-pointer"
                >
                  Skip this question
                </button>
              </div>
            </div>
          )}

          {/* Natural Chat Input Box with BorderBeam */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-brand-border shrink-0 min-w-0 outline-none focus:outline-none focus-within:outline-none">
            <BorderBeam
              size={isAgentRunning ? 'pulse-inner' : 'md'}
              theme="light"
              borderRadius={12}
              strength={isAgentRunning ? 0.95 : 0.75}
              duration={isAgentRunning ? 1.4 : undefined}
              className="rounded-xl shadow-2xs outline-none focus:outline-none focus-within:outline-none"
            >
              <div className="relative border border-brand-border rounded-xl p-2 bg-white transition-colors focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20 outline-none focus:outline-none focus-within:outline-none overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!isAgentRunning && inputText.trim()) handleSend();
                    }
                  }}
                  placeholder={activeQuestion ? 'Type your answer…' : (jobData ? 'Write a reply...' : streamingPlaceholder)}
                  rows={2}
                  className="w-full px-2 py-1 text-xs text-brand-dark placeholder-brand-dark/40 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 resize-none bg-transparent min-w-0 break-words relative z-10 custom-scrollbar transition-all duration-150"
                />

                <div className="flex items-center justify-between pt-1 relative z-10 border-t border-brand-border/30 mt-1">
                  <button
                    type="button"
                    onClick={onOpenUploadResumeModal}
                    className="p-1.5 rounded-full text-brand-dark/50 hover:text-brand-dark hover:bg-brand-secondary transition-colors"
                    title="Upload Resume or Job file"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {isAgentRunning ? (
                    <button
                      type="button"
                      onClick={() => onStopAgent?.()}
                      title="Stop the agent"
                      className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shrink-0"
                    >
                      <Square className="w-3.5 h-3.5" fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        !inputText.trim()
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300/40'
                          : 'bg-brand-dark hover:bg-slate-800 text-white cursor-pointer'
                      }`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </BorderBeam>
          </form>
        </div>
      ) : (
        /* CONTEXT TAB VIEW */
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-brand-secondary/40 text-xs">
          {jobData ? (
            <>
              <div className="bg-white border border-brand-border rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-dark/50">Target Role</span>
                <h3 className="font-bold text-sm text-brand-dark">{jobData.title}</h3>
                <div className="flex items-center gap-2 text-brand-dark/80 font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-brand-dark/50" />
                  <span>{jobData.company}</span>
                </div>
              </div>

              <div className="bg-white border border-brand-border rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-brand-dark uppercase text-[11px] tracking-wider">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {jobData.requiredSkills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 bg-brand-secondary text-brand-dark font-medium rounded-md text-xs border border-brand-border">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-brand-border rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-brand-dark uppercase text-[11px] tracking-wider">ATS Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {jobData.keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-brand-green/20 text-brand-dark font-medium rounded-md text-xs border border-brand-green/30">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-brand-border rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-brand-dark uppercase text-[11px] tracking-wider">Original Job Description</h4>
                <p className="text-brand-dark/80 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {jobData.descriptionText}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 space-y-3">
              <FileText className="w-10 h-10 text-brand-dark/30 mx-auto" />
              <p className="font-semibold text-brand-dark">No Job Context Available</p>
              <p className="text-brand-dark/50 text-xs">Paste a job description in the Chat tab to view target requirements here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
