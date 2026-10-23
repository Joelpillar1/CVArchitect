import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Sparkles,
    Copy,
    Download,
    Briefcase,
    Building,
    FileText,
    Check,
    AlertCircle,
    LayoutTemplate,
    Save,
    Eye,
    X,
    ChevronDown,
    Plus,
    RotateCcw,
    Type,
    AlignJustify,
    Maximize2,
    ClipboardPaste,
    SlidersHorizontal,
    Edit3,
    CheckCircle2,
    BookOpen,
    PenTool,
    Upload,
    Trash2
} from 'lucide-react';
import { ResumeData } from '../types';
import { generateCoverLetter, GeneratedCoverLetter, CoverLetterOptions } from '../components/utils/aiEnhancer';
import ModernCoverLetter from '../components/cover-letters/ModernCoverLetter';
import BoldCoverLetter from '../components/cover-letters/BoldCoverLetter';
import StructuredCoverLetter from '../components/cover-letters/StructuredCoverLetter';
import ClassicCoverLetter from '../components/cover-letters/ClassicCoverLetter';
import EditorialCoverLetter from '../components/cover-letters/EditorialCoverLetter';
import MinimalCoverLetter from '../components/cover-letters/MinimalCoverLetter';
import AcademicCoverLetter from '../components/cover-letters/AcademicCoverLetter';
import TechnicalCoverLetter from '../components/cover-letters/TechnicalCoverLetter';
import CorporateCoverLetter from '../components/cover-letters/CorporateCoverLetter';
import CoverLetterTemplates from '../components/cover-letters/CoverLetterTemplates';
import CoverLetterPreview from '../components/cover-letters/CoverLetterPreview';
import SignatureModal from '../components/cover-letters/SignatureModal';
import {
    CoverLetterTemplateType,
    COVER_LETTER_TEMPLATES,
    getCoverLetterTemplateConfig,
    SAMPLE_COVER_LETTER_DATA,
    SAMPLE_COVER_LETTER_RESUME
} from '../utils/coverLetterConfig';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { coverLetterService, SavedCoverLetter } from '../services/coverLetterService';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { UserSubscription } from '../types/pricing';
import { saveToStorage, loadFromStorage, debouncedSaveToStorage } from '../utils/statePersistence';
import { exportElementToPdf, exportCoverLetterToPdf, sanitizeFilename } from '../utils/pdfExport';
import { exportCoverLetterToDocx } from '../utils/coverLetterDocxExport';
import { extractTargetJobDetails, extractCompanyFromText, extractTitleFromText, isValidCompanyName } from '../utils/jobDataExtractor';
import { createPortal } from 'react-dom';
import { Loader } from '../components/ui/Loader';

interface CustomDropdownProps<T> {
    icon: React.ElementType;
    value: T;
    options: { value: T; label: string; previewClass?: string }[];
    onChange: (val: T) => void;
    title?: string;
}

const streamCoverLetter = async (
    targetLetter: GeneratedCoverLetter,
    onProgress: (currentLetter: GeneratedCoverLetter) => void,
    cancellationRef: React.MutableRefObject<{ cancelled: boolean }>
): Promise<void> => {
    const rawParagraphs = targetLetter.plainText
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean);

    const structuredOpening = targetLetter.structured?.opening?.trim() || '';
    const structuredSkills = targetLetter.structured?.skills || [];
    const structuredClosing = targetLetter.structured?.closing?.trim() || '';

    const completedParagraphs: string[] = [];

    for (let pIdx = 0; pIdx < rawParagraphs.length; pIdx++) {
        if (cancellationRef.current.cancelled) break;
        const fullPara = rawParagraphs[pIdx];

        const tokens = fullPara.split(/(\s+)/);
        let currentParaText = '';

        for (let tIdx = 0; tIdx < tokens.length; tIdx += 2) {
            if (cancellationRef.current.cancelled) break;
            const chunk = tokens.slice(tIdx, tIdx + 2).join('');
            currentParaText += chunk;

            const currentPlain = [...completedParagraphs, currentParaText].join('\n\n');

            let curOpening = '';
            let curSkills: { skill: string; description: string }[] = [];
            let curClosing = '';

            if (pIdx === 0) {
                curOpening = currentParaText;
            } else if (pIdx < rawParagraphs.length - 1) {
                curOpening = structuredOpening || rawParagraphs[0];
                const skillProgress = Math.min(pIdx - 1, structuredSkills.length - 1);
                curSkills = structuredSkills.slice(0, Math.max(0, skillProgress + 1));
            } else {
                curOpening = structuredOpening || rawParagraphs[0];
                curSkills = structuredSkills;
                curClosing = currentParaText;
            }

            onProgress({
                plainText: currentPlain,
                structured: {
                    opening: curOpening,
                    skills: curSkills,
                    closing: curClosing
                }
            });

            await new Promise((r) => setTimeout(r, 22));
        }

        completedParagraphs.push(fullPara);

        if (pIdx < rawParagraphs.length - 1 && !cancellationRef.current.cancelled) {
            await new Promise((r) => setTimeout(r, 180));
        }
    }
};

function CustomDropdown<T extends string | number>({
    icon: Icon,
    value,
    options,
    onChange,
    title
}: CustomDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 6,
                left: rect.left
            });
        }
    };

    const toggleOpen = () => {
        if (!isOpen) {
            updatePosition();
        }
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (
                buttonRef.current && !buttonRef.current.contains(target) &&
                menuRef.current && !menuRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        }
        function handleScrollOrResize() {
            if (isOpen) {
                updatePosition();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('resize', handleScrollOrResize);
            window.addEventListener('scroll', handleScrollOrResize, true);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleScrollOrResize);
            window.removeEventListener('scroll', handleScrollOrResize, true);
        };
    }, [isOpen]);

    const activeOption = options.find((opt) => opt.value === value) || options[0];

    return (
        <div className="relative inline-block text-left">
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleOpen}
                className={`flex items-center gap-1.5 bg-white border rounded-xl px-2.5 py-1.5 shadow-2xs text-xs font-bold text-brand-dark transition-all cursor-pointer select-none ${
                    isOpen ? 'border-brand-dark ring-2 ring-brand-green/30' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                title={title}
            >
                <Icon size={13} className="text-gray-400 shrink-0" />
                <span className={`truncate max-w-[130px] ${activeOption?.previewClass || ''}`}>
                    {activeOption?.label}
                </span>
                <ChevronDown
                    size={12}
                    className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        left: coords.left,
                        zIndex: 9999
                    }}
                    className="min-w-[175px] bg-white rounded-xl shadow-2xl border border-gray-200/90 py-1 animate-fadeIn"
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={String(option.value)}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                                    isSelected
                                        ? 'bg-brand-green/15 text-brand-dark font-bold'
                                        : 'text-gray-700 hover:bg-gray-100 font-medium'
                                }`}
                            >
                                <span className={option.previewClass || ''}>{option.label}</span>
                                {isSelected && <Check size={13} className="text-brand-dark shrink-0 ml-2" />}
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
}

interface CoverLetterPageProps {
    resumeData: ResumeData;
    userSubscription: UserSubscription;
    onDeductCredit: () => boolean;
    initialLetter?: SavedCoverLetter;
    onSave?: () => void;
}

export default function CoverLetterPage({
    resumeData,
    userSubscription,
    onDeductCredit,
    initialLetter: propInitialLetter,
    onSave
}: CoverLetterPageProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const subscriptionManager = new SubscriptionManager(userSubscription);

    // Route state payload & Resume defaults
    const locationState = location.state as any;
    const initialLetter = propInitialLetter || locationState?.initialLetter;
    const passedTemplate = locationState?.template as CoverLetterTemplateType | undefined;
    const prefillJob = locationState?.prefillJob;
    const fromResume = Boolean(locationState?.fromResume);

    // Automatically extract target company, title, JD and highlights from resumeData
    const resumeJobDetails = useMemo(() => extractTargetJobDetails(resumeData), [resumeData]);

    const initialCompany = useMemo(() => {
        if (initialLetter?.company_name && isValidCompanyName(initialLetter.company_name)) return initialLetter.company_name;
        if (locationState?.companyName && isValidCompanyName(locationState.companyName)) return locationState.companyName;
        if (prefillJob?.companyName && isValidCompanyName(prefillJob.companyName)) return prefillJob.companyName;
        if (fromResume && resumeJobDetails.company && isValidCompanyName(resumeJobDetails.company)) return resumeJobDetails.company;
        const stored = loadFromStorage<string>('cover_letter_companyName', '');
        if (isValidCompanyName(stored)) return stored;
        return (resumeJobDetails.company && isValidCompanyName(resumeJobDetails.company)) ? resumeJobDetails.company : '';
    }, [initialLetter, locationState, prefillJob, fromResume, resumeJobDetails]);

    const initialTitle = useMemo(() => {
        if (initialLetter?.job_title) return initialLetter.job_title;
        if (locationState?.jobTitle) return locationState.jobTitle;
        if (prefillJob?.jobTitle) return prefillJob.jobTitle;
        if (fromResume && resumeJobDetails.title) return resumeJobDetails.title;
        const stored = loadFromStorage<string>('cover_letter_jobTitle', '');
        return stored || resumeJobDetails.title || resumeData.jobTitle || '';
    }, [initialLetter, locationState, prefillJob, fromResume, resumeJobDetails, resumeData.jobTitle]);

    const initialDescription = useMemo(() => {
        if (initialLetter?.job_description) return initialLetter.job_description;
        if (locationState?.jobDescription) return locationState.jobDescription;
        if (prefillJob?.jobDescription) return prefillJob.jobDescription;
        if (fromResume && resumeJobDetails.description) return resumeJobDetails.description;
        const stored = loadFromStorage<string>('cover_letter_jobDescription', '');
        return stored || resumeJobDetails.description || '';
    }, [initialLetter, locationState, prefillJob, fromResume, resumeJobDetails]);

    // Core letter inputs
    const [jobTitle, setJobTitleState] = useState<string>(() => initialTitle);
    const [companyName, setCompanyNameState] = useState<string>(() => initialCompany);
    const [jobDescription, setJobDescriptionState] = useState<string>(() => initialDescription);

    // Generated Letter & Edit State
    const [generatedLetter, setGeneratedLetterState] = useState<GeneratedCoverLetter | null>(() => {
        return loadFromStorage<GeneratedCoverLetter | null>('cover_letter_generated', null);
    });
    const [editedText, setEditedTextState] = useState(() => {
        return loadFromStorage<string>('cover_letter_editedText', '');
    });
    const [structuredEdit, setStructuredEditState] = useState<{
        opening: string;
        skills: { skill: string; description: string }[];
        closing: string;
    }>(() => {
        return loadFromStorage('cover_letter_structuredEdit', { opening: '', skills: [], closing: '' });
    });

    // Formatting & Typography Toolbar Controls
    const [fontSize, setFontSizeState] = useState<number>(() => {
        return loadFromStorage<number>('cover_letter_fontSize', 12);
    });
    const [lineSpacing, setLineSpacingState] = useState<number>(() => {
        return loadFromStorage<number>('cover_letter_lineSpacing', 1.5);
    });
    const [spacing, setSpacingState] = useState<'compact' | 'normal' | 'spacious'>(() => {
        return loadFromStorage<'compact' | 'normal' | 'spacious'>('cover_letter_spacing', 'normal');
    });
    const [fontFamily, setFontFamilyState] = useState<'merriweather' | 'sans' | 'mono' | 'serif'>(() => {
        return loadFromStorage<'merriweather' | 'sans' | 'mono' | 'serif'>('cover_letter_fontFamily', 'merriweather');
    });
    const [viewAsPages, setViewAsPages] = useState<boolean>(true);
    const [zoomScale, setZoomScale] = useState<number>(1);

    // Template selection
    const [selectedTemplate, setSelectedTemplateState] = useState<CoverLetterTemplateType>(() => {
        if (passedTemplate) return passedTemplate;
        return loadFromStorage<CoverLetterTemplateType>('cover_letter_template', 'classic');
    });

    // AI Highlights controls
    const [highlightPosition, setHighlightPosition] = useState<string>(() => {
        const stored = loadFromStorage<string>('cover_letter_highlightPosition', '');
        return locationState?.highlightPosition || stored || resumeJobDetails.highlightPosition || '';
    });

    const [highlightEducation, setHighlightEducation] = useState<string>(() => {
        const stored = loadFromStorage<string>('cover_letter_highlightEducation', '');
        return locationState?.highlightEducation || stored || resumeJobDetails.highlightEducation || '';
    });

    const [highlightSkills, setHighlightSkills] = useState<string[]>(() => {
        if (locationState?.highlightSkills && Array.isArray(locationState.highlightSkills) && locationState.highlightSkills.length > 0) {
            return locationState.highlightSkills;
        }
        if (resumeJobDetails.highlightSkills.length > 0) {
            return resumeJobDetails.highlightSkills;
        }
        if (resumeData.skills) {
            return resumeData.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
        }
        return ['Data Analysis', 'Project Leadership', 'Cross-Functional Collaboration'];
    });
    const [skillInputValue, setSkillInputValue] = useState('');
    const [tone, setTone] = useState<'Confident' | 'Direct' | 'Enthusiastic'>('Confident');

    // UI state
    const [isGenerating, setIsGenerating] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState<GeneratedCoverLetter | null>(null);
    const streamCancellationRef = useRef<{ cancelled: boolean }>({ cancelled: false });
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingDocx, setIsExportingDocx] = useState(false);
    const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
    const downloadMenuRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('preview');

    // Signature upload state
    const [signatureUrl, setSignatureUrlState] = useState<string | null>(() => {
        return loadFromStorage<string | null>('cover_letter_signature', null);
    });
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const signatureFileInputRef = useRef<HTMLInputElement>(null);

    const setSignatureUrl = useCallback((url: string | null) => {
        setSignatureUrlState(url);
        if (url) {
            saveToStorage('cover_letter_signature', url);
        } else {
            localStorage.removeItem('cover_letter_signature');
        }
    }, []);

    const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file (PNG, JPG, SVG, WebP)', 'error');
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            showToast('Signature image must be under 3MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setSignatureUrl(result);
            showToast('Signature updated successfully!', 'success');
            setIsSignatureModalOpen(false);
        };
        reader.onerror = () => {
            showToast('Failed to read image file', 'error');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
                setIsDownloadMenuOpen(false);
            }
        };
        if (isDownloadMenuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            return () => document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [isDownloadMenuOpen]);

    // Persistent setters
    const setJobTitle = useCallback((title: string) => {
        setJobTitleState(title);
        debouncedSaveToStorage('cover_letter_jobTitle', title, 400);
    }, []);

    const setCompanyName = useCallback((name: string) => {
        setCompanyNameState(name);
        debouncedSaveToStorage('cover_letter_companyName', name, 400);
    }, []);

    const setJobDescription = useCallback((desc: string) => {
        setJobDescriptionState(desc);
        debouncedSaveToStorage('cover_letter_jobDescription', desc, 400);
    }, []);

    const setGeneratedLetter = useCallback((letter: GeneratedCoverLetter | null) => {
        setGeneratedLetterState(letter);
        if (letter) {
            saveToStorage('cover_letter_generated', letter);
        } else {
            localStorage.removeItem('cover_letter_generated');
        }
    }, []);

    const setSelectedTemplate = useCallback((template: CoverLetterTemplateType) => {
        setSelectedTemplateState(template);
        saveToStorage('cover_letter_template', template);
    }, []);

    const setEditedText = useCallback((text: string) => {
        setEditedTextState(text);
        debouncedSaveToStorage('cover_letter_editedText', text, 400);
    }, []);

    const setStructuredEdit = useCallback((edit: { opening: string; skills: { skill: string; description: string }[]; closing: string }) => {
        setStructuredEditState(edit);
        debouncedSaveToStorage('cover_letter_structuredEdit', edit, 400);
    }, []);

    const setFontSize = useCallback((size: number) => {
        setFontSizeState(size);
        saveToStorage('cover_letter_fontSize', size);
    }, []);

    const setLineSpacing = useCallback((spacingVal: number) => {
        setLineSpacingState(spacingVal);
        saveToStorage('cover_letter_lineSpacing', spacingVal);
    }, []);

    const setSpacing = useCallback((val: 'compact' | 'normal' | 'spacious') => {
        setSpacingState(val);
        saveToStorage('cover_letter_spacing', val);
    }, []);

    const setFontFamily = useCallback((val: 'merriweather' | 'sans' | 'mono' | 'serif') => {
        setFontFamilyState(val);
        saveToStorage('cover_letter_fontFamily', val);
    }, []);

    // Initial setup from router or storage
    useEffect(() => {
        if (passedTemplate) {
            setSelectedTemplate(passedTemplate);
        }
    }, [passedTemplate, setSelectedTemplate]);

    useEffect(() => {
        if (initialLetter) {
            setJobTitle(initialLetter.job_title || '');
            setCompanyName(initialLetter.company_name || '');
            setJobDescription(initialLetter.job_description || '');
            setGeneratedLetter(initialLetter.content);
            setEditedText(initialLetter.content.plainText);

            if (initialLetter.content.structured && initialLetter.content.structured.skills?.length > 0) {
                setStructuredEdit(initialLetter.content.structured);
            }
        } else if (fromResume || locationState?.companyName || locationState?.jobDescription || prefillJob) {
            const targetCompany = locationState?.companyName || prefillJob?.companyName || (fromResume ? resumeJobDetails.company : '');
            const targetTitle = locationState?.jobTitle || prefillJob?.jobTitle || (fromResume ? (resumeJobDetails.title || resumeData.jobTitle) : '');
            const targetJd = locationState?.jobDescription || prefillJob?.jobDescription || (fromResume ? resumeJobDetails.description : '');

            if (targetCompany && isValidCompanyName(targetCompany)) setCompanyName(targetCompany);
            if (targetTitle) setJobTitle(targetTitle);
            if (targetJd) setJobDescription(targetJd);

            if (locationState?.highlightPosition) {
                setHighlightPosition(locationState.highlightPosition);
                debouncedSaveToStorage('cover_letter_highlightPosition', locationState.highlightPosition, 400);
            } else if (fromResume && resumeJobDetails.highlightPosition) {
                setHighlightPosition(resumeJobDetails.highlightPosition);
            }

            if (locationState?.highlightEducation) {
                setHighlightEducation(locationState.highlightEducation);
                debouncedSaveToStorage('cover_letter_highlightEducation', locationState.highlightEducation, 400);
            } else if (fromResume && resumeJobDetails.highlightEducation) {
                setHighlightEducation(resumeJobDetails.highlightEducation);
            }

            if (locationState?.highlightSkills && Array.isArray(locationState.highlightSkills) && locationState.highlightSkills.length > 0) {
                setHighlightSkills(locationState.highlightSkills);
            } else if (fromResume && resumeJobDetails.highlightSkills.length > 0) {
                setHighlightSkills(resumeJobDetails.highlightSkills);
            }

            // If navigating from resume editor with a target company, and current generated letter was for a DIFFERENT company,
            // reset generatedLetter so active preview immediately reflects the new target company and title
            if (fromResume && targetCompany && generatedLetter) {
                const plain = generatedLetter.plainText.toLowerCase();
                if (!plain.includes(targetCompany.toLowerCase())) {
                    setGeneratedLetter(null);
                    setEditedText('');
                }
            }
        }
    }, [initialLetter, prefillJob, locationState, fromResume, resumeJobDetails, resumeData.jobTitle, setCompanyName, setEditedText, setGeneratedLetter, setJobDescription, setJobTitle, setStructuredEdit]);

    // Active draft computation (guarantees the document is always populated with high aesthetic quality)
    const activeDraftLetter = useMemo<GeneratedCoverLetter>(() => {
        if (generatedLetter) return generatedLetter;

        const candidateName = resumeData.fullName || 'Alex Morgan';
        const targetTitle = jobTitle.trim() || resumeData.jobTitle || 'Senior Product Manager';
        const targetCompany = companyName.trim() || 'Acme Corp';

        const customizedText = SAMPLE_COVER_LETTER_DATA.plainText
            .replace(/Alex Morgan/g, candidateName)
            .replace(/Senior Product Manager/g, targetTitle)
            .replace(/your company/g, targetCompany);

        return {
            plainText: customizedText,
            structured: {
                opening: SAMPLE_COVER_LETTER_DATA.structured.opening
                    .replace(/Senior Product Manager/g, targetTitle)
                    .replace(/your company/g, targetCompany),
                skills: SAMPLE_COVER_LETTER_DATA.structured.skills,
                closing: SAMPLE_COVER_LETTER_DATA.structured.closing
                    .replace(/Alex Morgan/g, candidateName)
            }
        };
    }, [generatedLetter, resumeData.fullName, resumeData.jobTitle, jobTitle, companyName]);

    // Active displayed content (supports live streaming directly onto the document sheet)
    const displayContent = (isStreaming && streamingContent !== null)
        ? streamingContent
        : (generatedLetter || activeDraftLetter);
    const currentTemplateConfig = getCoverLetterTemplateConfig(selectedTemplate);

    // List of candidate positions for highlight dropdown
    const candidatePositions = useMemo(() => {
        if (!resumeData.experience || resumeData.experience.length === 0) return [];
        return resumeData.experience
            .map(exp => {
                const role = exp.role || exp.position || '';
                const comp = exp.company || '';
                return role && comp ? `${role} at ${comp}` : role || comp;
            })
            .filter(Boolean);
    }, [resumeData.experience]);

    // List of candidate education degrees for highlight dropdown
    const candidateEducation = useMemo(() => {
        if (!resumeData.education || resumeData.education.length === 0) return [];
        return resumeData.education
            .map(edu => {
                const deg = edu.degree || '';
                const inst = edu.institution || edu.school || '';
                return deg && inst ? `${deg} (${inst})` : deg || inst;
            })
            .filter(Boolean);
    }, [resumeData.education]);

    // List of available skills from resume
    const availableResumeSkills = useMemo(() => {
        if (!resumeData.skills) return [];
        return resumeData.skills
            .split(',')
            .map(s => s.trim())
            .filter(s => Boolean(s) && !highlightSkills.includes(s))
            .slice(0, 8);
    }, [resumeData.skills, highlightSkills]);

    // Typography and layout dropdown options
    const fontOptions = useMemo(() => [
        { value: 'merriweather' as const, label: 'Merriweather (Serif)', previewClass: 'font-serif' },
        { value: 'sans' as const, label: 'Inter (Sans)', previewClass: 'font-sans' },
        { value: 'mono' as const, label: 'Mono (Tech)', previewClass: 'font-mono' }
    ], []);

    const lineSpacingOptions = useMemo(() => [
        { value: 1.3, label: '1.3 Tight' },
        { value: 1.5, label: '1.5 Normal' },
        { value: 1.75, label: '1.75 Relaxed' }
    ], []);

    const spacingOptions = useMemo(() => [
        { value: 'compact' as const, label: 'Compact Margins' },
        { value: 'normal' as const, label: 'Normal Margins' },
        { value: 'spacious' as const, label: 'Spacious Margins' }
    ], []);

    const normalizedFontFamily: 'merriweather' | 'sans' | 'mono' = (fontFamily === 'serif' || fontFamily === 'merriweather') ? 'merriweather' : fontFamily;

    const handleSkipStreaming = useCallback(() => {
        streamCancellationRef.current.cancelled = true;
    }, []);

    // AI Generation handler
    const handleGenerate = async () => {
        if (!jobTitle.trim() || !companyName.trim()) {
            setError('Please provide at least a Company Name and Job Title to tailor your cover letter.');
            return;
        }

        if (!onDeductCredit()) return;

        setError(null);
        setIsGenerating(true);
        setIsStreaming(true);
        streamCancellationRef.current = { cancelled: false };

        // Ensure user is in Page View to watch the live paragraph streaming
        setViewAsPages(true);
        setActiveMobileTab('preview');

        // Initialize with empty document body so live streaming begins fresh
        setStreamingContent({
            plainText: '',
            structured: { opening: '', skills: [], closing: '' }
        });

        try {
            const options: CoverLetterOptions = {
                highlightPosition: highlightPosition?.trim() || undefined,
                highlightEducation: highlightEducation?.trim() || undefined,
                highlightSkills: highlightSkills.length > 0 ? highlightSkills : undefined,
                tone: tone
            };

            const letter = await generateCoverLetter(
                resumeData,
                jobTitle,
                companyName,
                jobDescription,
                options
            );

            // Stream paragraph by paragraph onto the document sheet in real-time
            await streamCoverLetter(
                letter,
                (progress) => {
                    setStreamingContent(progress);
                },
                streamCancellationRef
            );

            // Finalize and persist completed letter
            setGeneratedLetter(letter);
            setEditedText(letter.plainText);
            if (letter.structured && letter.structured.skills && letter.structured.skills.length > 0) {
                setStructuredEdit(letter.structured);
            }
            showToast('Tailored cover letter generated successfully!', 'success');
        } catch (err: any) {
            console.error('Generation error:', err);
            setError(err?.message || 'Failed to generate cover letter. Please try again.');
            showToast('Failed to generate cover letter.', 'error');
        } finally {
            setStreamingContent(null);
            setIsStreaming(false);
            setIsGenerating(false);
        }
    };

    const handleUseSampleDraft = () => {
        const title = jobTitle.trim() || resumeData.jobTitle || 'Senior Product Manager';
        const company = companyName.trim() || 'Acme Corp';
        setJobTitle(title);
        setCompanyName(company);

        const candidateName = resumeData.fullName || 'Alex Morgan';
        const customizedText = SAMPLE_COVER_LETTER_DATA.plainText
            .replace(/Alex Morgan/g, candidateName)
            .replace(/Senior Product Manager/g, title)
            .replace(/your company/g, company);

        const draft: GeneratedCoverLetter = {
            plainText: customizedText,
            structured: {
                opening: SAMPLE_COVER_LETTER_DATA.structured.opening
                    .replace(/Senior Product Manager/g, title)
                    .replace(/your company/g, company),
                skills: SAMPLE_COVER_LETTER_DATA.structured.skills,
                closing: SAMPLE_COVER_LETTER_DATA.structured.closing
                    .replace(/Alex Morgan/g, candidateName)
            }
        };

        setGeneratedLetter(draft);
        setEditedText(customizedText);
        setStructuredEdit(draft.structured);
        showToast('Sample template draft loaded. You can now customize or edit it directly.', 'info');
    };

    const handleCopy = () => {
        const textToCopy = displayContent.plainText;
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        showToast('Cover letter text copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadPDF = async () => {
        setIsExporting(true);
        setIsDownloadMenuOpen(false);
        try {
            const letterEl = document.getElementById('cover-letter-rendered-document');
            if (letterEl) {
                const fileName = `${sanitizeFilename(resumeData.fullName, 'Applicant')}_Cover_Letter_${sanitizeFilename(jobTitle || 'Role', 'Application')}.pdf`;
                await exportElementToPdf(letterEl, {
                    filename: fileName,
                    pageSize: 'a4'
                });
            } else {
                await exportCoverLetterToPdf(displayContent.plainText, resumeData, jobTitle, companyName);
            }
            showToast('Cover letter PDF downloaded successfully!', 'success');
        } catch (err) {
            console.error('Failed to export cover letter:', err);
            showToast('Failed to download cover letter PDF.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadDocx = async () => {
        setIsExportingDocx(true);
        setIsDownloadMenuOpen(false);
        try {
            await exportCoverLetterToDocx({
                content: displayContent,
                resumeData,
                companyName,
                jobTitle,
                template: selectedTemplate,
                fontFamily,
                fontSize,
                lineSpacing,
                spacing,
            });
            showToast('Cover letter Word document (.docx) downloaded successfully!', 'success');
        } catch (err) {
            console.error('Failed to export cover letter to Word:', err);
            showToast('Failed to download cover letter as Word document.', 'error');
        } finally {
            setIsExportingDocx(false);
        }
    };

    const handleSaveCoverLetter = async () => {
        if (!user) {
            showToast('Please sign in to save cover letters.', 'info');
            return;
        }

        setIsSaving(true);
        try {
            const letterToSave = displayContent;
            if (initialLetter) {
                await coverLetterService.updateCoverLetter(initialLetter.id, letterToSave);
                showToast('Cover letter updated!', 'success');
            } else {
                await coverLetterService.createCoverLetter(
                    user.id,
                    `${jobTitle || 'Role'} — ${companyName || 'Application'}`,
                    letterToSave,
                    { jobTitle, companyName, jobDescription }
                );
                showToast('Cover letter saved to your library!', 'success');
            }
            if (onSave) {
                onSave();
            }
        } catch (error) {
            console.error('Error saving cover letter:', error);
            showToast('Failed to save cover letter.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
                const cleanText = text.trim();
                setJobDescription(cleanText);
                const detectedComp = extractCompanyFromText(cleanText);
                if (detectedComp && (!companyName || companyName.trim() === 'Hiring Team')) {
                    setCompanyName(detectedComp);
                }
                const detectedTitle = extractTitleFromText(cleanText);
                if (detectedTitle && (!jobTitle || jobTitle.trim() === 'Professional')) {
                    setJobTitle(detectedTitle);
                }
                showToast(
                    detectedComp ? `Pasted JD & detected ${detectedComp}!` : 'Job description pasted from clipboard!',
                    'success'
                );
            }
        } catch {
            showToast('Unable to read clipboard. Please paste manually.', 'info');
        }
    };

    const handleAutoDetectJobDetails = (textToAnalyze?: string) => {
        const text = textToAnalyze || jobDescription;
        if (!text || !text.trim()) {
            showToast('Please provide a job description first.', 'info');
            return;
        }
        const detectedComp = extractCompanyFromText(text);
        const detectedTitle = extractTitleFromText(text);
        let updated = false;
        if (detectedComp) {
            setCompanyName(detectedComp);
            updated = true;
        }
        if (detectedTitle) {
            setJobTitle(detectedTitle);
            updated = true;
        }
        if (updated) {
            showToast(`Detected: ${detectedComp || ''} ${detectedTitle ? `(${detectedTitle})` : ''}`, 'success');
        } else {
            showToast('Could not automatically identify company from this text. You can type it directly above.', 'info');
        }
    };

    const handleAddSkill = (skillToAdd?: string) => {
        const val = (skillToAdd || skillInputValue).trim();
        if (val && !highlightSkills.includes(val)) {
            setHighlightSkills([...highlightSkills, val]);
            if (!skillToAdd) setSkillInputValue('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setHighlightSkills(highlightSkills.filter(s => s !== skillToRemove));
    };

    // Save inline edit into generated letter state
    const handleUpdateInlineText = (newText: string) => {
        setEditedText(newText);
        setGeneratedLetter({
            plainText: newText,
            structured: {
                opening: newText.split('\n\n')[0] || '',
                skills: generatedLetter?.structured?.skills || [],
                closing: newText.split('\n\n').slice(-1)[0] || ''
            }
        });
    };

    return (
        <>
            {/* Hidden Print Element for Crisp Print/Vector Output */}
            {createPortal(
                <div className="print-root hidden print:block absolute top-0 left-0 w-full h-auto bg-white z-[9999] print:w-full print:max-w-[210mm]">
                    <div className="print-cover-letter" style={{ padding: '0 8mm' }}>
                        {selectedTemplate === 'corporate' ? (
                            <CorporateCoverLetter
                                data={resumeData}
                                content={displayContent}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                signatureUrl={signatureUrl}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        ) : selectedTemplate === 'technical' ? (
                            <TechnicalCoverLetter
                                data={resumeData}
                                content={displayContent}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        ) : selectedTemplate === 'academic' ? (
                            <AcademicCoverLetter
                                data={resumeData}
                                content={displayContent}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        ) : selectedTemplate === 'minimal' ? (
                            <MinimalCoverLetter
                                data={resumeData}
                                content={displayContent}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        ) : selectedTemplate === 'editorial' ? (
                            <EditorialCoverLetter
                                data={resumeData}
                                content={displayContent}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        ) : selectedTemplate === 'classic' ? (
                            <ClassicCoverLetter
                                data={resumeData}
                                content={displayContent}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                signatureUrl={signatureUrl}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        ) : selectedTemplate === 'structured' ? (
                            <StructuredCoverLetter
                                data={resumeData}
                                content={displayContent}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        ) : selectedTemplate === 'bold' ? (
                            <BoldCoverLetter
                                data={resumeData}
                                content={displayContent.plainText}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        ) : (
                            <ModernCoverLetter
                                data={resumeData}
                                content={displayContent.plainText}
                                companyName={companyName}
                                jobTitle={jobTitle}
                                fontSize={fontSize}
                                lineSpacing={lineSpacing}
                                spacing={spacing}
                                fontFamily={fontFamily}
                            />
                        )}
                    </div>
                </div>,
                document.body
            )}

            <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
                {/* 1. TOP HEADER BAR */}
                <header className="h-14 sm:h-16 bg-white border-b border-gray-200/90 px-3 sm:px-6 flex items-center justify-between shrink-0 z-40 shadow-2xs">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-brand-dark shrink-0"
                            title="Back"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-base font-bold text-brand-dark truncate leading-tight">
                                {initialLetter ? 'Edit Cover Letter' : 'Cover Letter Editor'}
                            </h1>
                        </div>
                    </div>

                    {/* Mobile View Switcher */}
                    <div className="flex lg:hidden items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => setActiveMobileTab('editor')}
                            className={`px-3 py-1 rounded-lg transition-all ${activeMobileTab === 'editor' ? 'bg-white text-brand-dark shadow-xs font-bold' : 'text-gray-600'}`}
                        >
                            AI Writer
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveMobileTab('preview')}
                            className={`px-3 py-1 rounded-lg transition-all ${activeMobileTab === 'preview' ? 'bg-white text-brand-dark shadow-xs font-bold' : 'text-gray-600'}`}
                        >
                            Preview
                        </button>
                    </div>

                    {/* Top Right Action Buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-dark bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-2xs"
                            title="Copy Text"
                        >
                            {copied ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveCoverLetter}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-dark bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-2xs disabled:opacity-60"
                            title="Save Cover Letter"
                        >
                            {isSaving ? <Loader size="xs" /> : <Save size={14} className="text-gray-600" />}
                            <span className="hidden sm:inline">{initialLetter ? 'Update' : 'Save'}</span>
                        </button>

                        {/* Download Split Button with DOCX/PDF Dropdown */}
                        <div className="relative" ref={downloadMenuRef}>
                            <div className="inline-flex items-center rounded-xl shadow-xs overflow-hidden bg-brand-green">
                                <button
                                    type="button"
                                    onClick={handleDownloadPDF}
                                    disabled={isExporting || isExportingDocx}
                                    className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-brand-dark bg-brand-green hover:bg-brand-greenHover transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                                    title="Download Cover Letter"
                                >
                                    {isExporting || isExportingDocx ? <Loader size="xs" /> : <Download size={14} />}
                                    <span>{isExporting ? 'Downloading...' : isExportingDocx ? 'Exporting...' : 'Download'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                                    disabled={isExporting || isExportingDocx}
                                    className="px-2 py-1.5 bg-brand-green hover:bg-brand-greenHover border-l border-brand-dark/15 text-brand-dark transition-colors cursor-pointer flex items-center justify-center disabled:opacity-75"
                                    title="Download Options (.pdf, .docx)"
                                    aria-expanded={isDownloadMenuOpen}
                                >
                                    <ChevronDown size={13} className={`transition-transform duration-200 ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* Dropdown Menu */}
                            {isDownloadMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/90 p-1.5 z-50 animate-pop-in">
                                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Download Format
                                    </div>

                                    {/* 1. PDF Download */}
                                    <button
                                        type="button"
                                        onClick={handleDownloadPDF}
                                        disabled={isExporting || isExportingDocx}
                                        className="w-full flex items-start gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 mt-0.5 group-hover:scale-105 transition-transform">
                                            <Download size={15} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-brand-dark flex items-center justify-between">
                                                <span>Download PDF</span>
                                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">.PDF</span>
                                            </div>
                                            <div className="text-[11px] text-gray-500 font-normal">Pixel-perfect ATS print document</div>
                                        </div>
                                    </button>

                                    {/* 2. DOCX Download */}
                                    <button
                                        type="button"
                                        onClick={handleDownloadDocx}
                                        disabled={isExporting || isExportingDocx}
                                        className="w-full flex items-start gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-800 mt-0.5 group-hover:scale-105 transition-transform">
                                            <FileText size={15} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-brand-dark flex items-center justify-between">
                                                <span>Download DOCX</span>
                                                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">.DOCX</span>
                                            </div>
                                            <div className="text-[11px] text-gray-500 font-normal">Fully editable Microsoft Word document</div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* 2. MAIN WORKSPACE: STUDIO CANVAS + AI WRITER SIDEBAR */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* LEFT / CENTER: DOCUMENT PREVIEW & CONTROLS CANVAS */}
                    <main
                        className={`flex-1 flex flex-col bg-[#f4f6f8] overflow-hidden relative transition-all ${activeMobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}
                    >
                        {/* Floating Top Document Controls Bar */}
                        <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between gap-3 overflow-visible shadow-2xs z-20">
                            {/* Controls: Template Selector, Font Size, Line Spacing, Margin/Padding, Font Family */}
                            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
                                {/* Template Selector Button */}
                                <button
                                    type="button"
                                    onClick={() => setIsTemplateModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-dark bg-white hover:bg-gray-50 border border-gray-200 transition-all shadow-2xs cursor-pointer shrink-0"
                                    title="Change Template"
                                >
                                    <LayoutTemplate size={13} className="text-brand-dark" />
                                    <span>Template: <strong>{currentTemplateConfig.name}</strong></span>
                                    <ChevronDown size={13} className="text-gray-400" />
                                </button>

                                <div className="h-5 w-[1px] bg-gray-200 hidden sm:block" />

                                {/* Font Family Custom Dropdown */}
                                <CustomDropdown
                                    icon={Type}
                                    value={normalizedFontFamily}
                                    options={fontOptions}
                                    onChange={(val) => setFontFamily(val)}
                                    title="Font Family"
                                />

                                {/* Font Size: - 12 + */}
                                <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 shadow-2xs">
                                    <button
                                        type="button"
                                        onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                                        className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-gray-100 rounded-lg transition-all font-bold text-sm cursor-pointer"
                                        title="Decrease Font Size"
                                    >
                                        -
                                    </button>
                                    <span className="px-2 text-xs font-bold text-brand-dark min-w-[28px] text-center select-none">
                                        {fontSize}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setFontSize(Math.min(16, fontSize + 1))}
                                        className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-gray-100 rounded-lg transition-all font-bold text-sm cursor-pointer"
                                        title="Increase Font Size"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Line Spacing Custom Dropdown */}
                                <CustomDropdown
                                    icon={AlignJustify}
                                    value={lineSpacing}
                                    options={lineSpacingOptions}
                                    onChange={(val) => setLineSpacing(val)}
                                    title="Line Spacing"
                                />

                                {/* Margins / Spacing Custom Dropdown */}
                                <CustomDropdown
                                    icon={Maximize2}
                                    value={spacing}
                                    options={spacingOptions}
                                    onChange={(val) => setSpacing(val)}
                                    title="Page Margins"
                                />

                                <div className="h-5 w-[1px] bg-gray-200 hidden sm:block" />

                                {/* Signature Upload Button */}
                                <button
                                    type="button"
                                    onClick={() => setIsSignatureModalOpen(true)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer select-none ${
                                        signatureUrl
                                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                                    title="Upload or manage your handwritten signature"
                                >
                                    <PenTool size={13} className={signatureUrl ? 'text-emerald-700' : 'text-gray-400'} />
                                    <span className="truncate max-w-[120px]">{signatureUrl ? 'Signature Active' : 'Add Signature'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Document Scroll Canvas */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 flex justify-center items-start relative">
                            {/* Centered Realistic Document Sheet */}
                            <div className="w-full flex flex-col items-center pb-16">
                                {viewAsPages ? (
                                    /* 1. Realistic A4 Document Page Preview */
                                    <div className="relative group">
                                        <div
                                            id="cover-letter-rendered-document"
                                            className="w-[210mm] min-h-[297mm] bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12),0_0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-2xl rounded-xs ring-1 ring-black/5 origin-top transition-transform duration-200 transform scale-[0.62] sm:scale-[0.78] md:scale-[0.88] lg:scale-[0.95] xl:scale-100 my-2"
                                        >
                                            {selectedTemplate === 'corporate' ? (
                                                <CorporateCoverLetter
                                                    data={resumeData}
                                                    content={displayContent}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    signatureUrl={signatureUrl}
                                                    onUploadSignature={() => setIsSignatureModalOpen(true)}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            ) : selectedTemplate === 'technical' ? (
                                                <TechnicalCoverLetter
                                                    data={resumeData}
                                                    content={displayContent}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            ) : selectedTemplate === 'academic' ? (
                                                <AcademicCoverLetter
                                                    data={resumeData}
                                                    content={displayContent}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            ) : selectedTemplate === 'minimal' ? (
                                                <MinimalCoverLetter
                                                    data={resumeData}
                                                    content={displayContent}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            ) : selectedTemplate === 'editorial' ? (
                                                <EditorialCoverLetter
                                                    data={resumeData}
                                                    content={displayContent}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            ) : selectedTemplate === 'classic' ? (
                                                <ClassicCoverLetter
                                                    data={resumeData}
                                                    content={displayContent}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    signatureUrl={signatureUrl}
                                                    onUploadSignature={() => setIsSignatureModalOpen(true)}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            ) : selectedTemplate === 'structured' ? (
                                                <StructuredCoverLetter
                                                    data={resumeData}
                                                    content={displayContent}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            ) : selectedTemplate === 'bold' ? (
                                                <BoldCoverLetter
                                                    data={resumeData}
                                                    content={displayContent.plainText}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            ) : (
                                                <ModernCoverLetter
                                                    data={resumeData}
                                                    content={displayContent.plainText}
                                                    companyName={companyName}
                                                    jobTitle={jobTitle}
                                                    fontSize={fontSize}
                                                    lineSpacing={lineSpacing}
                                                    spacing={spacing}
                                                    fontFamily={fontFamily}
                                                    isStreaming={isStreaming}
                                                />
                                            )}
                                        </div>

                                        {/* Floating Quick Action overlay to edit content */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => setViewAsPages(false)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/90 text-white rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg hover:bg-black transition-all"
                                            >
                                                <Edit3 size={12} />
                                                <span>Edit Text Directly</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* 2. Direct Content Editor Mode */
                                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200/90 p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900">Direct Content Editor</h3>
                                                <p className="text-xs text-gray-500">Edit the text directly. Changes synchronize live to the document page.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setViewAsPages(true)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-xl text-xs font-semibold transition-all border border-gray-200 cursor-pointer shadow-2xs"
                                            >
                                                <Eye size={13} className="text-gray-500" />
                                                <span>Return to Page View</span>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Cover Letter Body
                                            </label>
                                            <textarea
                                                value={displayContent.plainText}
                                                onChange={(e) => handleUpdateInlineText(e.target.value)}
                                                rows={18}
                                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none font-serif text-sm leading-relaxed text-brand-dark bg-slate-50/50"
                                                placeholder="Write or edit your cover letter paragraphs..."
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                            <button
                                                type="button"
                                                onClick={() => setViewAsPages(true)}
                                                className="px-5 py-2 text-xs font-bold text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-xl transition-all shadow-xs"
                                            >
                                                Done & View Page
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    {/* RIGHT: AI COVER LETTER WRITER SIDEBAR */}
                    <aside
                        className={`w-full lg:w-[410px] xl:w-[440px] shrink-0 bg-white border-l border-gray-200/90 flex flex-col h-full z-30 transition-all ${activeMobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}
                    >
                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            {/* Validation Error Banner */}
                            {error && (
                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* COMPANY NAME */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                                    <Building size={13} className="text-gray-400" />
                                    <span>Company Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Google"
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-sm text-brand-dark placeholder-gray-400 font-medium transition-all shadow-2xs hover:border-gray-300"
                                />
                            </div>

                            {/* POSITION/TITLE */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                                    <Briefcase size={13} className="text-gray-400" />
                                    <span>Position/Title</span>
                                </label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="e.g. Data Analyst"
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-sm text-brand-dark placeholder-gray-400 font-medium transition-all shadow-2xs hover:border-gray-300"
                                />
                            </div>

                            {/* JOB DESCRIPTION (PASTE JD) */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-extrabold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                                        <FileText size={13} className="text-gray-400" />
                                        <span>Job Description</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {jobDescription && (
                                            <button
                                                type="button"
                                                onClick={() => handleAutoDetectJobDetails()}
                                                className="text-[11px] font-bold text-gray-500 hover:text-brand-dark flex items-center gap-1 transition-colors cursor-pointer"
                                                title="Detect company name and title from this JD"
                                            >
                                                <Sparkles size={11} className="text-emerald-700" />
                                                <span>Detect</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handlePasteFromClipboard}
                                            className="text-[11px] font-bold text-emerald-800 hover:text-brand-dark flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <ClipboardPaste size={12} />
                                            <span>Paste JD</span>
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setJobDescription(val);
                                        if ((!companyName || companyName.trim() === 'Hiring Team') && val.trim().length > 30) {
                                            const detectedComp = extractCompanyFromText(val);
                                            if (detectedComp) setCompanyName(detectedComp);
                                        }
                                        if ((!jobTitle || jobTitle.trim() === 'Professional') && val.trim().length > 30) {
                                            const detectedTitle = extractTitleFromText(val);
                                            if (detectedTitle) setJobTitle(detectedTitle);
                                        }
                                    }}
                                    rows={5}
                                    placeholder="Paste the target job posting or requirements here. The AI will extract core keywords and tailor your narrative..."
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-xs leading-relaxed text-brand-dark placeholder-gray-400 resize-none transition-all shadow-2xs hover:border-gray-300"
                                />
                                {jobDescription && (
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 px-1">
                                        <span>{jobDescription.length} characters</span>
                                        <button
                                            type="button"
                                            onClick={() => setJobDescription('')}
                                            className="hover:text-red-500 font-medium"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* POSITION HIGHLIGHT (user types themselves with hint) */}
                            <div className="space-y-1.5 pt-1 border-t border-gray-100">
                                <label className="text-xs font-extrabold text-brand-dark uppercase tracking-wider flex items-center justify-between">
                                    <span>Position Highlight</span>
                                    <span className="text-[10px] text-gray-400 font-normal lowercase">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={highlightPosition}
                                    onChange={(e) => setHighlightPosition(e.target.value)}
                                    placeholder="e.g. Marketing Analyst at Kaplan"
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-xs text-brand-dark placeholder-gray-400 font-medium transition-all shadow-2xs hover:border-gray-300"
                                />
                                <p className="text-[11px] text-gray-500 leading-tight">
                                    Type a specific role, past project, or achievement you want emphasized in the letter.
                                </p>
                            </div>

                            {/* EDUCATION HIGHLIGHT (user types themselves with hint) */}
                            <div className="space-y-1.5 pt-1 border-t border-gray-100">
                                <label className="text-xs font-extrabold text-brand-dark uppercase tracking-wider flex items-center justify-between">
                                    <span>Education Highlight</span>
                                    <span className="text-[10px] text-gray-400 font-normal lowercase">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={highlightEducation}
                                    onChange={(e) => setHighlightEducation(e.target.value)}
                                    placeholder="e.g. B.S. in Economics from University of Wisconsin"
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-xs text-brand-dark placeholder-gray-400 font-medium transition-all shadow-2xs hover:border-gray-300"
                                />
                                <p className="text-[11px] text-gray-500 leading-tight">
                                    Type your degree, major, academic credential, or university to weave into the narrative.
                                </p>
                            </div>

                            {/* SKILLS HIGHLIGHT (chips + input) */}
                            <div className="space-y-2 pt-1 border-t border-gray-100">
                                <span className="text-xs font-extrabold text-brand-dark uppercase tracking-wider block">
                                    Skills Highlight
                                </span>

                                {/* Active Skill Chips */}
                                <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                                    {highlightSkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-dark text-white rounded-full text-xs font-bold shadow-2xs animate-fadeIn"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="hover:bg-gray-700 rounded-full p-0.5 transition-colors"
                                                title="Remove skill"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* Add Skill Input */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={skillInputValue}
                                        onChange={(e) => setSkillInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                        placeholder="Enter skill and press enter..."
                                        className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-brand-dark focus:ring-2 focus:ring-brand-green outline-none shadow-2xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddSkill()}
                                        className="px-3.5 py-2 bg-brand-green hover:bg-brand-greenHover text-brand-dark rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer active:scale-95"
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* Suggested Skills from Resume */}
                                {availableResumeSkills.length > 0 && (
                                    <div className="pt-1">
                                        <span className="text-[10px] text-gray-400 block mb-1">From your resume:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {availableResumeSkills.map((sk, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleAddSkill(sk)}
                                                    className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 hover:bg-brand-green/20 hover:text-brand-dark text-gray-700 rounded-md transition-colors"
                                                >
                                                    + {sk}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TONE SELECTION */}
                            <div className="space-y-1.5 pt-1 border-t border-gray-100">
                                <span className="text-xs font-extrabold text-brand-dark uppercase tracking-wider block">
                                    Tone & Style
                                </span>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {(['Confident', 'Direct', 'Enthusiastic'] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTone(t)}
                                            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center border ${tone === t ? 'bg-brand-dark text-white border-brand-dark shadow-2xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SIGNATURE UPLOAD & CUSTOMIZATION */}
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                                        <PenTool size={13} className="text-emerald-700" />
                                        <span>Signature</span>
                                    </span>
                                    {signatureUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setSignatureUrl(null)}
                                            className="text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {signatureUrl ? (
                                    <div
                                        onClick={() => setIsSignatureModalOpen(true)}
                                        className="p-3 bg-white border border-emerald-300 rounded-xl hover:border-emerald-400 cursor-pointer transition-all flex items-center justify-between shadow-2xs group"
                                        title="Click to edit or change your signature"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-10 max-w-[130px] flex items-center justify-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                                                <img
                                                    src={signatureUrl}
                                                    alt="Signature"
                                                    className="max-h-8 max-w-full object-contain"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-brand-dark truncate">Signature Active</p>
                                                <p className="text-[10px] text-gray-500">Click to change</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-700 group-hover:underline">Edit</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsSignatureModalOpen(true)}
                                        className="w-full py-2.5 px-3 bg-white border border-dashed border-gray-300 hover:border-brand-dark hover:bg-gray-50/80 rounded-xl text-xs font-bold text-brand-dark flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                                    >
                                        <Upload size={14} className="text-gray-500" />
                                        <span>Upload or Draw Signature</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Footer: Primary Action Button */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-2 shrink-0">
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full py-3 px-4 bg-brand-green hover:bg-brand-greenHover text-brand-dark font-extrabold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader size="xs" />
                                        <span>Generating Cover Letter...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        <span>{generatedLetter ? 'Regenerate Cover Letter' : 'Generate Cover Letter'}</span>
                                        <span className="text-[11px] opacity-80 font-normal ml-1">(1 Credit)</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleUseSampleDraft}
                                className="w-full py-1.5 text-center text-xs font-semibold text-gray-500 hover:text-brand-dark transition-colors"
                            >
                                Start with Sample Draft (0 Credits)
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Template Selector Modal - Full Screen Portal */}
            {isTemplateModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-[100] w-screen h-screen bg-black/60 backdrop-blur-sm flex flex-col overflow-hidden animate-fadeIn"
                    onClick={() => setIsTemplateModalOpen(false)}
                >
                    <div
                        className="flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shrink-0 z-10 shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsTemplateModalOpen(false)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-700 font-bold text-sm"
                                title="Back"
                            >
                                <ArrowLeft size={18} />
                                <span className="hidden sm:inline">Back</span>
                            </button>
                            <div className="h-5 w-[1px] bg-gray-200 hidden sm:block" />
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">Choose Cover Letter Template</h3>
                                <p className="text-xs text-gray-400 hidden sm:block">Pick a format to match your target role and resume</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsTemplateModalOpen(false)}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            title="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsTemplateModalOpen(false);
                            }
                        }}
                    >
                        <div
                            className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl ring-1 ring-black/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CoverLetterTemplates
                                selectedTemplateId={selectedTemplate}
                                onSelectTemplate={(tmplId) => {
                                    setSelectedTemplate(tmplId);
                                    setIsTemplateModalOpen(false);
                                    showToast(`Template changed to ${getCoverLetterTemplateConfig(tmplId).name}`, 'success');
                                }}
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Quick Template View Modal */}
            {isPreviewModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-[100] w-screen h-screen bg-black/60 backdrop-blur-sm flex flex-col overflow-hidden animate-fadeIn"
                    onClick={() => setIsPreviewModalOpen(false)}
                >
                    <div
                        className="flex items-center justify-between px-6 py-4 bg-transparent shrink-0 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-sm">
                                {currentTemplateConfig.name} Template Preview
                            </h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-bold transition-all bg-brand-green hover:bg-brand-greenHover text-brand-dark text-xs sm:text-sm active:scale-95 shadow-md"
                            >
                                Continue with {currentTemplateConfig.name}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto flex justify-center items-start py-8 px-4 bg-transparent cursor-pointer"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsPreviewModalOpen(false);
                            }
                        }}
                    >
                        <div
                            className="shadow-2xl rounded-xs bg-white overflow-hidden origin-top my-2 cursor-default ring-1 ring-black/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CoverLetterPreview
                                template={selectedTemplate}
                                data={resumeData}
                                jobTitle={jobTitle || resumeData.jobTitle}
                                companyName={companyName || 'Target Company'}
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Signature Upload & Draw Modal */}
            <SignatureModal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                currentSignatureUrl={signatureUrl}
                onSaveSignature={(newUrl) => {
                    setSignatureUrl(newUrl);
                    showToast(
                        newUrl ? 'Signature updated successfully!' : 'Signature reset to default',
                        'success'
                    );
                }}
                candidateName={resumeData.fullName || 'Alex Morgan'}
            />
        </>
    );
}
