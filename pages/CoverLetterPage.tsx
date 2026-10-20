import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Copy, Download, Briefcase, Building, FileText, Check, AlertCircle, LayoutTemplate, AlignCenter, Save, Loader2, Eye, X } from 'lucide-react';
import { ResumeData } from '../types';
import { generateCoverLetter, GeneratedCoverLetter } from '../components/utils/aiEnhancer';
import ModernCoverLetter from '../components/cover-letters/ModernCoverLetter';
import BoldCoverLetter from '../components/cover-letters/BoldCoverLetter';
import StructuredCoverLetter from '../components/cover-letters/StructuredCoverLetter';
import CoverLetterTemplates from '../components/cover-letters/CoverLetterTemplates';
import CoverLetterPreview from '../components/cover-letters/CoverLetterPreview';
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
import { createPortal } from 'react-dom';
import { Loader } from '../components/ui/Loader';

interface CoverLetterPageProps {
    resumeData: ResumeData;
    userSubscription: UserSubscription;
    onDeductCredit: () => boolean;
    initialLetter?: SavedCoverLetter;
    onSave?: () => void; // Callback after successful save
}

export default function CoverLetterPage({ resumeData, userSubscription, onDeductCredit, initialLetter: propInitialLetter, onSave }: CoverLetterPageProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const subscriptionManager = new SubscriptionManager(userSubscription);
    
    // Get initialLetter from props or route state
    const initialLetter = propInitialLetter || (location.state as any)?.initialLetter;
    const passedTemplate = (location.state as any)?.template as CoverLetterTemplateType | undefined;
    
    // Restore state from localStorage on mount
    const [step, setStepState] = useState<'input' | 'generating' | 'result'>(() => {
        return loadFromStorage<'input' | 'generating' | 'result'>('cover_letter_step', 'input');
    });
    const [jobTitle, setJobTitleState] = useState(() => {
        return loadFromStorage<string>('cover_letter_jobTitle', resumeData.jobTitle || '');
    });
    const [companyName, setCompanyNameState] = useState(() => {
        return loadFromStorage<string>('cover_letter_companyName', '');
    });
    const [jobDescription, setJobDescriptionState] = useState(() => {
        return loadFromStorage<string>('cover_letter_jobDescription', resumeData.jobDescription || '');
    });
    const [generatedLetter, setGeneratedLetterState] = useState<GeneratedCoverLetter | null>(() => {
        const saved = loadFromStorage<GeneratedCoverLetter | null>('cover_letter_generated', null);
        return saved;
    });
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [selectedTemplate, setSelectedTemplateState] = useState<CoverLetterTemplateType>(() => {
        if (passedTemplate) return passedTemplate;
        return loadFromStorage<CoverLetterTemplateType>('cover_letter_template', 'modern');
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedTextState] = useState(() => {
        return loadFromStorage<string>('cover_letter_editedText', '');
    });
    const [editMode, setEditMode] = useState<'text' | 'structured'>('text');
    const [structuredEdit, setStructuredEditState] = useState<{
        opening: string;
        skills: { skill: string; description: string }[];
        closing: string;
    }>(() => {
        return loadFromStorage<{ opening: string; skills: { skill: string; description: string }[]; closing: string }>('cover_letter_structuredEdit', { opening: '', skills: [], closing: '' });
    });

    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    // Wrapper functions that persist immediately
    const setStep = useCallback((newStep: 'input' | 'generating' | 'result') => {
        setStepState(newStep);
        saveToStorage('cover_letter_step', newStep);
    }, []);

    const setJobTitle = useCallback((title: string) => {
        setJobTitleState(title);
        debouncedSaveToStorage('cover_letter_jobTitle', title, 500);
    }, []);

    const setCompanyName = useCallback((name: string) => {
        setCompanyNameState(name);
        debouncedSaveToStorage('cover_letter_companyName', name, 500);
    }, []);

    const setJobDescription = useCallback((desc: string) => {
        setJobDescriptionState(desc);
        debouncedSaveToStorage('cover_letter_jobDescription', desc, 500);
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
        debouncedSaveToStorage('cover_letter_editedText', text, 500);
    }, []);

    const setStructuredEdit = useCallback((edit: { opening: string; skills: { skill: string; description: string }[]; closing: string }) => {
        setStructuredEditState(edit);
        debouncedSaveToStorage('cover_letter_structuredEdit', edit, 500);
    }, []);

    const prefillJob = (location.state as any)?.prefillJob;

    useEffect(() => {
        if (passedTemplate) {
            setSelectedTemplate(passedTemplate);
        }
    }, [passedTemplate, setSelectedTemplate]);

    useEffect(() => {
        if (initialLetter) {
            // If we have an initial letter, use it (overrides localStorage)
            setStep('result');
            setJobTitle(initialLetter.job_title || '');
            setCompanyName(initialLetter.company_name || '');
            setJobDescription(initialLetter.job_description || '');
            setGeneratedLetter(initialLetter.content);
            setEditedText(initialLetter.content.plainText);
            setIsEditing(false);

            if (initialLetter.content.structured && initialLetter.content.structured.skills && initialLetter.content.structured.skills.length > 0) {
                setStructuredEdit(initialLetter.content.structured);
            }
        } else if (prefillJob) {
            // Prefill from the job details passed via router state
            setStep('input');
            setJobTitle(prefillJob.jobTitle || '');
            setCompanyName(prefillJob.companyName || '');
            setJobDescription(prefillJob.jobDescription || '');
            setGeneratedLetter(null);
            setError(null);
            setIsEditing(false);
        } else {
            // Only reset if we don't have saved state (first visit)
            const hasSavedState = loadFromStorage<GeneratedCoverLetter | null>('cover_letter_generated', null);
            if (!hasSavedState) {
                // First visit - use defaults
                setStep('input');
                setJobTitle(resumeData.jobTitle || '');
                setJobDescription(resumeData.jobDescription || '');
                setCompanyName('');
                setGeneratedLetter(null);
                if (!passedTemplate) {
                    setSelectedTemplate('modern');
                }
            }
            setError(null);
            setIsEditing(false);
        }
    }, [initialLetter, prefillJob, passedTemplate, resumeData.jobDescription, resumeData.jobTitle, setCompanyName, setEditedText, setGeneratedLetter, setJobDescription, setJobTitle, setSelectedTemplate, setStep, setStructuredEdit]);

    const handleGenerate = async () => {
        if (!jobTitle.trim() || !companyName.trim()) {
            setError('Please provide at least a Job Title and Company Name');
            return;
        }

        if (!onDeductCredit()) return;

        setError(null);
        setStep('generating');

        try {
            const letter = await generateCoverLetter(
                resumeData,
                jobTitle,
                companyName,
                jobDescription
            );
            setGeneratedLetter(letter);
            setEditedText(letter.plainText);
            setStep('result');
        } catch (err) {
            console.error(err);
            setError('Failed to generate cover letter. Please try again.');
            setStep('input');
        }
    };

    const handleUseSampleDraft = () => {
        if (!jobTitle.trim()) {
            setJobTitle(resumeData.jobTitle || 'Senior Professional');
        }
        if (!companyName.trim()) {
            setCompanyName('Target Company');
        }
        setGeneratedLetter(SAMPLE_COVER_LETTER_DATA);
        setEditedText(SAMPLE_COVER_LETTER_DATA.plainText);
        setStructuredEdit(SAMPLE_COVER_LETTER_DATA.structured);
        setStep('result');
        showToast('Sample template draft loaded. You can now customize it directly.', 'info');
    };

    const handleCopy = () => {
        if (!generatedLetter) return;
        navigator.clipboard.writeText(generatedLetter.plainText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadPDF = async () => {
        if (!generatedLetter) return;
        setIsExporting(true);
        try {
            const letterEl = document.getElementById('cover-letter-rendered-document');
            if (letterEl) {
                const fileName = `${sanitizeFilename(resumeData.fullName, 'Applicant')}_Cover_Letter_${sanitizeFilename(jobTitle || 'Application', 'Role')}.pdf`;
                await exportElementToPdf(letterEl, {
                    filename: fileName,
                    pageSize: 'a4'
                });
            } else {
                await exportCoverLetterToPdf(generatedLetter.plainText, resumeData, jobTitle, companyName);
            }
            showToast('Cover letter downloaded successfully!', 'success');
        } catch (err) {
            console.error('Failed to export cover letter:', err);
            showToast('Failed to download cover letter PDF.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleSaveEdit = () => {
        if (generatedLetter) {
            if (editMode === 'structured') {
                const newPlainText = `${structuredEdit.opening}\n\n${structuredEdit.skills.map(s => `${s.skill}\n${s.description}`).join('\n\n')}\n\n${structuredEdit.closing}`;

                setGeneratedLetter({
                    ...generatedLetter,
                    plainText: newPlainText,
                    structured: {
                        opening: structuredEdit.opening,
                        skills: structuredEdit.skills,
                        closing: structuredEdit.closing
                    }
                });
            } else {
                setGeneratedLetter({
                    ...generatedLetter,
                    plainText: editedText,
                    structured: {
                        ...generatedLetter.structured,
                        skills: []
                    }
                });
            }
            setIsEditing(false);
        }
    };

    const currentTemplateConfig = getCoverLetterTemplateConfig(selectedTemplate);

    return (
        <>
            {/* Hidden print element - only visible during print */}
            {generatedLetter && createPortal(
                <div className="print-root hidden print:block absolute top-0 left-0 w-full h-auto bg-white z-[9999] print:w-full print:max-w-[210mm]">
                    <div className="print-cover-letter" style={{ padding: '0 8mm' }}>
                        {selectedTemplate === 'structured' ? (
                            <StructuredCoverLetter
                                data={resumeData}
                                content={generatedLetter}
                                companyName={companyName}
                                jobTitle={jobTitle}
                            />
                        ) : selectedTemplate === 'bold' ? (
                            <BoldCoverLetter
                                data={resumeData}
                                content={generatedLetter.plainText}
                                companyName={companyName}
                                jobTitle={jobTitle}
                            />
                        ) : (
                            <ModernCoverLetter
                                data={resumeData}
                                content={generatedLetter.plainText}
                                companyName={companyName}
                                jobTitle={jobTitle}
                            />
                        )}
                    </div>
                </div>,
                document.body
            )}

            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xs gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {step === 'result' ? (
                            initialLetter ? (
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0 text-gray-600"
                                    title="Close"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setStep('input')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0 text-gray-600"
                                    title="Back to inputs"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            )
                        ) : (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0 text-gray-600"
                                title="Go back"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        )}

                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 bg-brand-green/20 text-emerald-800 rounded-lg flex items-center justify-center shrink-0">
                                <Sparkles size={17} className="text-emerald-700" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-base sm:text-lg font-bold text-brand-dark truncate leading-tight">
                                    {initialLetter ? 'Edit Cover Letter' : 'Cover Letter Generator'}
                                </h1>
                            </div>
                        </div>

                        {/* Template Selector Button */}
                        {step === 'result' && !isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsTemplateModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-brand-dark bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200 shadow-2xs"
                                title="Change Template"
                            >
                                <LayoutTemplate size={13} className="text-gray-500" />
                                <span>Template: <strong>{currentTemplateConfig.name}</strong></span>
                            </button>
                        )}
                    </div>

                    {/* Top Right Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-2.5 ml-auto flex-wrap">
                        {step === 'result' ? (
                            <>
                                {isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-brand-dark text-xs font-bold rounded-xl transition-all shadow-2xs"
                                    >
                                        <Eye size={14} />
                                        <span>View Preview</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (selectedTemplate === 'structured' && generatedLetter?.structured?.skills?.length) {
                                                setStructuredEdit(generatedLetter.structured);
                                                setEditMode('structured');
                                            } else if (generatedLetter) {
                                                setEditedText(generatedLetter.plainText);
                                                setEditMode('text');
                                            }
                                            setIsEditing(true);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/20 hover:bg-brand-green/30 text-emerald-900 border border-brand-green/30 text-xs font-bold rounded-xl transition-all shadow-2xs active:scale-95"
                                        title="Edit Cover"
                                    >
                                        <FileText size={14} />
                                        <span>Edit Cover</span>
                                    </button>
                                )}

                                {!isEditing && (
                                    <>
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
                                            title="Copy Text"
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
                                        </button>

                                        <button
                                            onClick={async () => {
                                                if (user && generatedLetter) {
                                                    try {
                                                        if (initialLetter) {
                                                            await coverLetterService.updateCoverLetter(initialLetter.id, generatedLetter);
                                                            showToast('Cover letter updated!', 'success');
                                                        } else {
                                                            await coverLetterService.createCoverLetter(
                                                                user.id,
                                                                `${jobTitle} - ${companyName}`,
                                                                generatedLetter,
                                                                { jobTitle, companyName, jobDescription }
                                                            );
                                                            showToast('Cover letter saved successfully!', 'success');
                                                        }
                                                        if (onSave) {
                                                            onSave();
                                                        }
                                                    } catch (error) {
                                                        console.error('Error saving cover letter:', error);
                                                        showToast('Failed to save cover letter.', 'error');
                                                    }
                                                } else {
                                                    showToast('Please sign in to save cover letters.', 'info');
                                                }
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
                                            title="Save Cover Letter"
                                        >
                                            <Save size={14} />
                                            <span className="hidden md:inline">{initialLetter ? 'Update' : 'Save'}</span>
                                        </button>

                                        <button
                                            onClick={handleDownloadPDF}
                                            disabled={isExporting}
                                            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-white bg-brand-dark hover:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed active:scale-95"
                                        >
                                            {isExporting ? <Loader size="xs" variant="light" /> : <Download size={14} />}
                                            <span>{isExporting ? 'Downloading...' : 'Download PDF'}</span>
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsTemplateModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-brand-dark text-xs font-bold rounded-xl transition-all shadow-2xs"
                                title="Switch template"
                            >
                                <LayoutTemplate size={14} />
                                <span>Templates</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {step === 'input' && (
                        <div className="max-w-4xl mx-auto p-4 sm:p-8">
                            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/90 p-6 sm:p-8 space-y-6">
                                {/* Selected Template Showcase Card */}
                                <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-emerald-800 flex items-center justify-center shrink-0">
                                            <LayoutTemplate size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    Active Template
                                                </span>
                                                <span className="text-[10px] font-extrabold uppercase bg-brand-dark text-white px-2 py-0.5 rounded-full shadow-2xs">
                                                    {currentTemplateConfig.name}
                                                </span>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                    {currentTemplateConfig.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                {currentTemplateConfig.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setIsPreviewModalOpen(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all shadow-2xs"
                                        >
                                            <Eye size={13} />
                                            <span>Quick View</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsTemplateModalOpen(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-lg transition-all shadow-2xs"
                                        >
                                            <LayoutTemplate size={13} />
                                            <span>Change</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                            <Briefcase size={14} className="text-gray-400" /> Target Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-sm transition-all"
                                            placeholder="e.g. Senior Product Manager"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                            <Building size={14} className="text-gray-400" /> Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-sm transition-all"
                                            placeholder="e.g. Acme Corp"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                        <FileText size={14} className="text-gray-400" /> Job Description (Recommended)
                                    </label>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        rows={6}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none text-sm leading-relaxed"
                                        placeholder="Paste the job requirements or posting details here to ensure maximum tailoring..."
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm border border-red-200">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleUseSampleDraft}
                                        className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-dashed border-gray-300"
                                    >
                                        Start with Sample Draft (0 Credits)
                                    </button>

                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleGenerate}
                                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
                                        >
                                            <Sparkles size={16} />
                                            <span>Generate with AI (1 Credit)</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4">
                            <Loader size="xl" />
                            <h3 className="text-lg font-bold text-brand-dark">Crafting your cover letter...</h3>
                            <p className="text-gray-500 text-sm">Tailoring your narrative against the company and job description.</p>
                        </div>
                    )}

                    {step === 'result' && generatedLetter && (
                        <div className="flex flex-col min-h-full">
                            <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex justify-center bg-white">
                                {isEditing ? (
                                    <div className="w-full max-w-4xl bg-white p-4 sm:p-6 rounded-2xl shadow-lg min-h-[60vh] flex flex-col">
                                        <h3 className="text-lg font-bold text-brand-dark mb-4">Edit Cover Letter Content</h3>
                                        {editMode === 'structured' ? (
                                            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Opening Paragraph</label>
                                                    <textarea
                                                        value={structuredEdit.opening}
                                                        onChange={(e) => setStructuredEdit({ ...structuredEdit, opening: e.target.value })}
                                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none font-sans text-sm leading-relaxed min-h-[120px]"
                                                        placeholder="Opening paragraph..."
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">Key Skills & Impacts</label>
                                                    {structuredEdit.skills.map((skillItem, idx) => (
                                                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                                                            <div>
                                                                <input
                                                                    value={skillItem.skill}
                                                                    onChange={(e) => {
                                                                        const newSkills = [...structuredEdit.skills];
                                                                        newSkills[idx].skill = e.target.value;
                                                                        setStructuredEdit({ ...structuredEdit, skills: newSkills });
                                                                    }}
                                                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold text-brand-dark focus:ring-1 focus:ring-brand-green focus:border-transparent outline-none"
                                                                    placeholder="Skill Name"
                                                                />
                                                            </div>
                                                            <textarea
                                                                value={skillItem.description}
                                                                onChange={(e) => {
                                                                    const newSkills = [...structuredEdit.skills];
                                                                    newSkills[idx].description = e.target.value;
                                                                    setStructuredEdit({ ...structuredEdit, skills: newSkills });
                                                                }}
                                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-1 focus:ring-brand-green focus:border-transparent outline-none resize-none min-h-[60px]"
                                                                placeholder="Description of how you used this skill..."
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Closing Paragraph</label>
                                                    <textarea
                                                        value={structuredEdit.closing}
                                                        onChange={(e) => setStructuredEdit({ ...structuredEdit, closing: e.target.value })}
                                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none font-sans text-sm leading-relaxed min-h-[120px]"
                                                        placeholder="Closing paragraph..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <textarea
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                                className="flex-1 w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none font-mono text-sm leading-relaxed"
                                                placeholder="Edit your cover letter here..."
                                            />
                                        )}
                                        <div className="flex justify-end gap-3 mt-4">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-6 py-2 text-sm font-bold text-white bg-brand-dark hover:bg-gray-800 rounded-xl transition-colors"
                                            >
                                                Done Editing
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div id="cover-letter-rendered-document" className="w-[210mm] min-h-[297mm] shadow-2xl transition-all duration-300 bg-white origin-top transform scale-[0.75] sm:scale-[0.85] md:scale-[0.92] lg:scale-100">
                                        {selectedTemplate === 'structured' ? (
                                            <StructuredCoverLetter
                                                data={resumeData}
                                                content={generatedLetter}
                                                companyName={companyName}
                                                jobTitle={jobTitle}
                                            />
                                        ) : selectedTemplate === 'bold' ? (
                                            <BoldCoverLetter
                                                data={resumeData}
                                                content={generatedLetter.plainText}
                                                companyName={companyName}
                                                jobTitle={jobTitle}
                                            />
                                        ) : (
                                            <ModernCoverLetter
                                                data={resumeData}
                                                content={generatedLetter.plainText}
                                                companyName={companyName}
                                                jobTitle={jobTitle}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Template Selector Modal - Full Screen with transparent backdrop */}
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
                                onClick={() => setIsTemplateModalOpen(false)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-700 font-bold text-sm"
                                title="Back"
                            >
                                <ArrowLeft size={18} />
                                <span className="hidden sm:inline">Back</span>
                            </button>
                            <div className="h-5 w-[1px] bg-gray-200 hidden sm:block" />
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-brand-dark">Choose Cover Letter Template</h3>
                                <p className="text-xs text-gray-400 hidden sm:block">Pick a format to match your target role and resume</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsTemplateModalOpen(false)}
                            className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
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

            {/* Full Screen Template Quick View with Transparent Backdrop */}
            {isPreviewModalOpen && createPortal(
                <div 
                    className="fixed inset-0 z-[100] w-screen h-screen bg-black/60 backdrop-blur-sm flex flex-col overflow-hidden animate-fadeIn"
                    onClick={() => setIsPreviewModalOpen(false)}
                >
                    {/* Header */}
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
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-bold transition-all bg-brand-green hover:bg-brand-greenHover text-brand-dark text-xs sm:text-sm active:scale-95 shadow-md"
                            >
                                Continue with {currentTemplateConfig.name}
                            </button>
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Transparent Canvas with centered A4 Document */}
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
        </>
    );
}
