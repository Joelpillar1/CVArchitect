import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Copy, Download, Briefcase, Building, FileText, Check, AlertCircle, LayoutTemplate, AlignCenter, Save } from 'lucide-react';
import { ResumeData } from '../types';
import { generateCoverLetter, GeneratedCoverLetter } from '../components/utils/aiEnhancer';
import ModernCoverLetter from '../components/cover-letters/ModernCoverLetter';
import BoldCoverLetter from '../components/cover-letters/BoldCoverLetter';
import StructuredCoverLetter from '../components/cover-letters/StructuredCoverLetter';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { coverLetterService, SavedCoverLetter } from '../services/coverLetterService';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { UserSubscription } from '../types/pricing';
import { saveToStorage, loadFromStorage, debouncedSaveToStorage } from '../utils/statePersistence';
import { createPortal } from 'react-dom';

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
    const [selectedTemplate, setSelectedTemplateState] = useState<'modern' | 'bold' | 'structured'>(() => {
        return loadFromStorage<'modern' | 'bold' | 'structured'>('cover_letter_template', 'modern');
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

    const setSelectedTemplate = useCallback((template: 'modern' | 'bold' | 'structured') => {
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

    useEffect(() => {
        if (initialLetter) {
            // If we have an initial letter, use it (overrides localStorage)
            setStep('result');
            setJobTitle(initialLetter.job_title);
            setCompanyName(initialLetter.company_name);
            setJobDescription(initialLetter.job_description || '');
            setGeneratedLetter(initialLetter.content);
            setEditedText(initialLetter.content.plainText);
            setIsEditing(false);

            if (initialLetter.content.structured && initialLetter.content.structured.skills && initialLetter.content.structured.skills.length > 0) {
                setStructuredEdit(initialLetter.content.structured);
            }
        } else {
            // Only reset if we don't have saved state (first visit)
            // Otherwise, keep the restored state from localStorage
            const hasSavedState = loadFromStorage<GeneratedCoverLetter | null>('cover_letter_generated', null);
            if (!hasSavedState) {
                // First visit - use defaults
                setStep('input');
                setJobTitle(resumeData.jobTitle || '');
                setJobDescription(resumeData.jobDescription || '');
                setCompanyName('');
                setGeneratedLetter(null);
                setSelectedTemplate('modern');
            }
            // If we have saved state, it's already restored in useState initializers
            setError(null);
            setIsEditing(false);
        }
    }, [initialLetter]); // Only depend on initialLetter, not resumeData

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

    const handleCopy = () => {
        if (!generatedLetter) return;
        navigator.clipboard.writeText(generatedLetter.plainText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        if (!generatedLetter) return;

        // Update document title for the PDF filename
        const originalTitle = document.title;
        const fileName = `${resumeData.fullName.replace(/\s+/g, '_')}_Cover_Letter_${jobTitle?.replace(/\s+/g, '_') || 'Application'}`;
        document.title = fileName;

        // Trigger browser print dialog
        setTimeout(() => {
            window.print();
            document.title = originalTitle;
        }, 100);
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

    return (
        <>
            {/* Hidden print element - only visible during print */}
            {/* Simplified structure for single-page cover letter */}
            {generatedLetter && createPortal(
                <div className="hidden print:block absolute top-0 left-0 w-full h-auto bg-white z-[9999] print:w-full print:max-w-[210mm]">
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
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 bg-brand-green/20 text-brand-green rounded-lg flex items-center justify-center shrink-0">
                            <Sparkles size={18} />
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold text-brand-dark truncate">
                            {initialLetter ? 'Edit Cover Letter' : 'AI Cover Letter Generator'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                {step === 'input' && (
                    <div className="max-w-4xl mx-auto p-8">
                        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
                            <p className="text-gray-600 text-sm">
                                Generate a tailored cover letter in seconds. Uses 1 credit.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Briefcase size={14} /> Target Job Title
                                    </label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        placeholder="e.g. Product Manager"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Building size={14} /> Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <FileText size={14} /> Job Description (Recommended)
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    rows={6}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none text-sm"
                                    placeholder="Paste the job requirements here for better tailoring..."
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 text-sm font-bold text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-lg shadow-sm hover:shadow-md transition-all"
                                >
                                    <Sparkles size={16} />
                                    <span className="hidden sm:inline">Generate (1 Credit)</span>
                                    <span className="sm:hidden">Generate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'generating' && (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-100 border-t-brand-green rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-brand-green">
                                <Sparkles size={24} className="animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-brand-dark">Crafting your letter...</h3>
                        <p className="text-gray-500 text-sm">Analyzing your resume against the job description.</p>
                    </div>
                )}

                {step === 'result' && generatedLetter && (
                    <div className="flex flex-col min-h-full">
                        {/* Template Selector Toolbar */}
                        {!isEditing && (
                            <div className="bg-white border-b border-gray-200 p-2 sm:p-4 flex flex-wrap justify-center sticky top-[73px] z-40 shadow-sm gap-2">
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setSelectedTemplate('modern')}
                                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${selectedTemplate === 'modern' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <LayoutTemplate size={14} /> <span className="hidden sm:inline">Modern</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedTemplate('bold')}
                                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${selectedTemplate === 'bold' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <AlignCenter size={14} /> <span className="hidden sm:inline">Bold</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedTemplate('structured')}
                                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${selectedTemplate === 'structured' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FileText size={14} /> <span className="hidden sm:inline">Impact</span>
                                    </button>
                                </div>
                                <div className="hidden sm:block w-px bg-gray-300 mx-2"></div>
                                <button
                                    onClick={() => {
                                        if (selectedTemplate === 'structured' && generatedLetter.structured && generatedLetter.structured.skills && generatedLetter.structured.skills.length > 0) {
                                            setStructuredEdit(generatedLetter.structured);
                                            setEditMode('structured');
                                        } else {
                                            setEditedText(generatedLetter.plainText);
                                            setEditMode('text');
                                        }
                                        setIsEditing(true);
                                    }}
                                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium text-brand-dark hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                                >
                                    <FileText size={14} /> <span className="hidden sm:inline">Edit Text</span>
                                </button>
                            </div>
                        )}

                        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex justify-center bg-gray-100">
                            {isEditing ? (
                                <div className="w-full max-w-4xl bg-white p-4 sm:p-6 rounded-xl shadow-lg min-h-[60vh] flex flex-col">
                                    <h3 className="text-lg font-bold text-brand-dark mb-4">Edit Cover Letter Content</h3>
                                    {editMode === 'structured' ? (
                                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Opening Paragraph</label>
                                                <textarea
                                                    value={structuredEdit.opening}
                                                    onChange={(e) => setStructuredEdit({ ...structuredEdit, opening: e.target.value })}
                                                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none font-sans text-sm leading-relaxed min-h-[120px]"
                                                    placeholder="Opening paragraph..."
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700">Key Skills & Impacts</label>
                                                {structuredEdit.skills.map((skillItem, idx) => (
                                                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                                        <div>
                                                            <input
                                                                value={skillItem.skill}
                                                                onChange={(e) => {
                                                                    const newSkills = [...structuredEdit.skills];
                                                                    newSkills[idx].skill = e.target.value;
                                                                    setStructuredEdit({ ...structuredEdit, skills: newSkills });
                                                                }}
                                                                className="w-full p-2 border border-gray-200 rounded text-sm font-bold text-brand-dark focus:ring-1 focus:ring-brand-green focus:border-transparent outline-none"
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
                                                            className="w-full p-2 border border-gray-200 rounded text-sm text-gray-600 focus:ring-1 focus:ring-brand-green focus:border-transparent outline-none resize-none min-h-[60px]"
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
                                                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none font-sans text-sm leading-relaxed min-h-[120px]"
                                                    placeholder="Closing paragraph..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            className="flex-1 w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none font-mono text-sm leading-relaxed"
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
                                            className="px-6 py-2 text-sm font-bold text-white bg-brand-dark hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="scale-[0.75] sm:scale-[0.85] origin-top shadow-2xl transition-all duration-300 w-full max-w-[210mm]">
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

            {/* Footer */}
            {step === 'result' && !isEditing && (
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 sticky bottom-0 z-50 shadow-lg">
                    {initialLetter ? (
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto sm:mr-auto px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            Close
                        </button>
                    ) : (
                        <button
                            onClick={() => setStep('input')}
                            className="w-full sm:w-auto sm:mr-auto px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            Back
                        </button>
                    )}

                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy Text'}
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
                                    // Call onSave callback to refresh the list
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
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Save size={16} />
                        {initialLetter ? 'Update Saved' : 'Save'}
                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-brand-dark hover:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        <Download size={16} />
                        Print / PDF
                    </button>
                </div>
            )}
        </div>
        </>
    );
}
