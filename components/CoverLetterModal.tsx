import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Download, Briefcase, Building, FileText, Check, AlertCircle, LayoutTemplate, AlignCenter, Save } from 'lucide-react';
import { ResumeData } from '../types';
import { generateCoverLetter, GeneratedCoverLetter } from './utils/aiEnhancer';
import ModernCoverLetter from './cover-letters/ModernCoverLetter';
import BoldCoverLetter from './cover-letters/BoldCoverLetter';
import StructuredCoverLetter from './cover-letters/StructuredCoverLetter';
import { createRoot } from 'react-dom/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { coverLetterService, SavedCoverLetter } from '../services/coverLetterService';

interface CoverLetterModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeData: ResumeData;
    onDeductCredit: () => boolean;
    onDownload: (content: string) => void;
    initialLetter?: SavedCoverLetter;
}

export default function CoverLetterModal({ isOpen, onClose, resumeData, onDeductCredit, onDownload, initialLetter }: CoverLetterModalProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
    const [jobTitle, setJobTitle] = useState(resumeData.jobTitle || '');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState(resumeData.jobDescription || '');
    const [generatedLetter, setGeneratedLetter] = useState<GeneratedCoverLetter | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'bold' | 'structured'>('modern');
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState('');
    const [editMode, setEditMode] = useState<'text' | 'structured'>('text');
    const [structuredEdit, setStructuredEdit] = useState<{
        opening: string;
        skills: { skill: string; description: string }[];
        closing: string;
    }>({ opening: '', skills: [], closing: '' });

    useEffect(() => {
        if (isOpen) {
            if (initialLetter) {
                setStep('result');
                setJobTitle(initialLetter.job_title);
                setCompanyName(initialLetter.company_name);
                setJobDescription(initialLetter.job_description || ''); // Changed from metadata.jobDescription to job_description
                setGeneratedLetter(initialLetter.content);
                setEditedText(initialLetter.content.plainText);
                setIsEditing(false);

                // Load structured data if available
                if (initialLetter.content.structured && initialLetter.content.structured.skills && initialLetter.content.structured.skills.length > 0) {
                    setStructuredEdit(initialLetter.content.structured);
                    // Optional: If you want to auto-select structured template:
                    // setSelectedTemplate('structured');
                }
            } else {
                setStep('input');
                setJobTitle(resumeData.jobTitle || '');
                setJobDescription(resumeData.jobDescription || '');
                setCompanyName('');
                setGeneratedLetter(null);
                setError(null);
                setSelectedTemplate('modern');
                setIsEditing(false);
            }
        }
    }, [isOpen, resumeData, initialLetter]);

    if (!isOpen) return null;

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

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Cover Letter</title>');
            printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
            // Set margins to 0.1in as requested
            printWindow.document.write('<style>@page { margin: 0.1in; } body { margin: 0; padding: 0; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<div id="print-root"></div>');
            printWindow.document.write('</body></html>');

            const root = createRoot(printWindow.document.getElementById('print-root')!);

            if (selectedTemplate === 'structured') {
                root.render(
                    <StructuredCoverLetter
                        data={resumeData}
                        content={generatedLetter}
                        companyName={companyName}
                        jobTitle={jobTitle}
                    />
                );
            } else {
                const TemplateComponent = selectedTemplate === 'bold' ? BoldCoverLetter : ModernCoverLetter;
                root.render(
                    <TemplateComponent
                        data={resumeData}
                        content={generatedLetter.plainText}
                        companyName={companyName}
                        jobTitle={jobTitle}
                    />
                );
            }

            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 1000);
        }
    };

    const handleSaveEdit = () => {
        if (generatedLetter) {
            if (editMode === 'structured') {
                // Reconstruct plainText to keep it loosely in sync, though structured view uses the structured object
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
                    // Clear structured skills to force fallback mode since we can't easily parse active edits back to structured
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4 scale-in-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleIn flex flex-col max-h-[95vh] slide-in-bottom">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-green/20 text-brand-green rounded-lg flex items-center justify-center">
                            <Sparkles size={18} />
                        </div>
                        <h2 className="text-xl font-bold text-brand-dark">
                            {initialLetter ? 'Edit Cover Letter' : 'AI Cover Letter Generator'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-gray-100">

                    {step === 'input' && (
                        <div className="p-8 max-w-2xl mx-auto bg-white min-h-full">
                            <div className="space-y-6 animate-fadeIn">
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
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="flex flex-col items-center justify-center py-12 animate-fadeIn space-y-4 h-full bg-white">
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
                        <div className="flex flex-col h-full">
                            {/* Template Selector Tool bar */}
                            {!isEditing && (
                                <div className="bg-white border-b border-gray-200 p-2 flex justify-center sticky top-0 z-10 shadow-sm gap-2">
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setSelectedTemplate('modern')}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedTemplate === 'modern' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            <LayoutTemplate size={14} /> Modern
                                        </button>
                                        <button
                                            onClick={() => setSelectedTemplate('bold')}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedTemplate === 'bold' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            <AlignCenter size={14} /> Bold
                                        </button>
                                        <button
                                            onClick={() => setSelectedTemplate('structured')}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedTemplate === 'structured' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            <FileText size={14} /> Impact
                                        </button>
                                    </div>
                                    <div className="w-px bg-gray-300 mx-2"></div>
                                    <button
                                        onClick={() => {
                                            // Initialize editing based on current template
                                            if (selectedTemplate === 'structured' && generatedLetter.structured && generatedLetter.structured.skills && generatedLetter.structured.skills.length > 0) {
                                                setStructuredEdit(generatedLetter.structured);
                                                setEditMode('structured');
                                            } else {
                                                setEditedText(generatedLetter.plainText);
                                                setEditMode('text');
                                            }
                                            setIsEditing(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-brand-dark hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                                    >
                                        <FileText size={14} /> Edit Text
                                    </button>
                                </div>
                            )}

                            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-100">
                                {isEditing ? (
                                    <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg h-full flex flex-col min-h-[60vh]">
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
                                    <div className="scale-[0.8] origin-top shadow-2xl transition-all duration-300">
                                        {/* Preview Render */}
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
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0 relative z-10">
                    {step === 'input' && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-lg shadow-sm hover:shadow-md transition-all active:transform active:scale-95"
                            >
                                <Sparkles size={16} />
                                Generate (1 Credit)
                            </button>
                        </>
                    )}

                    {step === 'result' && !isEditing && (
                        <>
                            {initialLetter ? (
                                <button
                                    onClick={onClose}
                                    className="mr-auto px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    Close
                                </button>
                            ) : (
                                <button
                                    onClick={() => setStep('input')}
                                    className="mr-auto px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    Back
                                </button>
                            )}

                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                                        } catch (error) {
                                            console.error(error);
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
