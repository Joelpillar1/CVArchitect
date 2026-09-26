import React, { useState, useRef, useEffect } from 'react';
import {
    Upload,
    FileText,
    X,
    Loader2,
    Briefcase,
    User,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    RefreshCw
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { parseResume } from '../utils/resumeParser';
import { ResumeData } from '../types';

interface TemplateOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
    onCheckUploadPermission?: () => boolean;
}

type Step = 'selection' | 'details' | 'processing';

const UPLOAD_STAGES = [
    { title: 'Reading document', detail: 'Verifying file integrity and format' },
    { title: 'Extracting text & structure', detail: 'Parsing contact details, work history, and education' },
    { title: 'AI smart analysis', detail: 'Categorizing skills, achievements, and impact metrics' },
    { title: 'Finalizing template setup', detail: 'Structuring content into your selected design' },
];

function formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function TemplateOnboardingModal({
    isOpen,
    onClose,
    onComplete,
    onCheckUploadPermission
}: TemplateOnboardingModalProps) {
    const [step, setStep] = useState<Step>('selection');
    const [method, setMethod] = useState<'upload' | 'scratch' | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [role, setRole] = useState('');
    const [experience, setExperience] = useState('');
    const [progress, setProgress] = useState(0);
    const [activeStage, setActiveStage] = useState(0);
    const [processingStatus, setProcessingStatus] = useState('Preparing your workspace...');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Reset state when modal closes or opens
    useEffect(() => {
        if (!isOpen) {
            setStep('selection');
            setMethod(null);
            setFile(null);
            setRole('');
            setExperience('');
            setProgress(0);
            setActiveStage(0);
            setIsError(false);
            setErrorMessage(null);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const startProcessingUpload = async (selectedFile: File) => {
        setMethod('upload');
        setFile(selectedFile);
        setStep('processing');
        setIsError(false);
        setErrorMessage(null);
        setActiveStage(0);
        setProgress(15);
        setProcessingStatus('Uploading document...');

        const startTime = Date.now();

        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        let currentProg = 15;
        progressIntervalRef.current = setInterval(() => {
            if (currentProg < 35) {
                currentProg += 4;
                setProgress(currentProg);
                setActiveStage(0);
            } else if (currentProg < 68) {
                currentProg += 2;
                setProgress(currentProg);
                setActiveStage(1);
            } else if (currentProg < 88) {
                currentProg += 1;
                setProgress(currentProg);
                setActiveStage(2);
            }
        }, 220);

        try {
            const parsedData = await parseResume(selectedFile, (parserProgress) => {
                if (parserProgress >= 75) {
                    setActiveStage(2);
                    setProcessingStatus('Analyzing experience & skills with AI...');
                }
                if (parserProgress > currentProg) {
                    currentProg = Math.min(parserProgress, 92);
                    setProgress(currentProg);
                }
            });

            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }

            setActiveStage(3);
            setProgress(100);
            setProcessingStatus('Finalizing template...');

            const extractedTitle =
                (parsedData.jobTitle as string) ||
                (parsedData.experience && parsedData.experience[0]?.title) ||
                '';

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 1000 - elapsedTime);

            setTimeout(() => {
                onComplete({
                    method: 'upload',
                    file: selectedFile,
                    role: extractedTitle,
                    experience: '',
                    parsedData
                });
            }, remainingTime);
        } catch (err: any) {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            console.error('Resume parsing failed:', err);
            setIsError(true);
            setErrorMessage(
                err?.message || 'Could not extract text from this resume. Please try a different file or enter details manually.'
            );
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
        const isDocx =
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            selectedFile.name.toLowerCase().endsWith('.docx');
        const isImage = selectedFile.type.startsWith('image/');

        if (isPdf || isDocx || isImage) {
            startProcessingUpload(selectedFile);
        } else {
            setIsError(true);
            setStep('processing');
            setErrorMessage('Please upload a valid PDF or DOCX file.');
        }
    };

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');
        setIsError(false);
        setErrorMessage(null);
        setProcessingStatus('Preparing your template workspace...');
        setProgress(40);
        setActiveStage(0);

        const startTime = Date.now();

        // Smooth progress for scratch
        let currentProg = 40;
        const scratchInterval = setInterval(() => {
            currentProg += 15;
            setProgress(Math.min(currentProg, 90));
            if (currentProg > 60) setActiveStage(1);
            if (currentProg > 80) setActiveStage(2);
        }, 150);

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 900 - elapsedTime);

        setTimeout(() => {
            clearInterval(scratchInterval);
            setProgress(100);
            setActiveStage(3);
            setTimeout(() => {
                onComplete({
                    method: 'scratch',
                    file: null,
                    role,
                    experience,
                    parsedData: {}
                });
            }, 300);
        }, remainingTime);
    };

    const getFileBadge = () => {
        if (!file) return null;
        const name = file.name.toLowerCase();
        if (name.endsWith('.pdf')) return { text: 'PDF', color: 'bg-red-50 text-red-600 border-red-200' };
        if (name.endsWith('.docx') || name.endsWith('.doc')) return { text: 'DOCX', color: 'bg-blue-50 text-blue-600 border-blue-200' };
        return { text: 'DOC', color: 'bg-gray-50 text-gray-600 border-gray-200' };
    };

    const fileBadge = getFileBadge();

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scaleIn relative border border-gray-100">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="p-6 md:p-8">

                    {/* Step 1: Selection */}
                    {step === 'selection' && (
                        <div className="animate-fadeIn">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green mb-3">
                                    <Sparkles size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-brand-dark mb-1">
                                    How would you like to start?
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Import an existing resume or build a new one with AI assistance.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onCheckUploadPermission && !onCheckUploadPermission()) {
                                            return;
                                        }
                                        fileInputRef.current?.click();
                                    }}
                                    className="group p-5 border-2 border-gray-100 rounded-xl hover:border-brand-green hover:bg-green-50/20 transition-all text-left flex flex-col justify-between h-[160px] shadow-sm hover:shadow-md"
                                >
                                    <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-brand-dark mb-0.5 flex items-center gap-1.5">
                                            Upload Resume
                                        </h3>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            Auto-extract text, skills & experience from PDF or DOCX
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMethod('scratch');
                                        setStep('details');
                                    }}
                                    className="group p-5 border-2 border-gray-100 rounded-xl hover:border-brand-green hover:bg-green-50/20 transition-all text-left flex flex-col justify-between h-[160px] shadow-sm hover:shadow-md"
                                >
                                    <div className="w-11 h-11 bg-brand-green/15 text-brand-dark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText size={22} className="text-brand-green" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-brand-dark mb-0.5">
                                            Create New
                                        </h3>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            Start with a clean slate and custom AI guidance
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details (Only for Create New / Scratch) */}
                    {step === 'details' && (
                        <div className="animate-fadeIn">
                            <button
                                type="button"
                                onClick={() => setStep('selection')}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-dark mb-4 transition-colors"
                            >
                                <ArrowLeft size={14} /> Back to options
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-brand-dark mb-1">Quick Details</h2>
                                <p className="text-gray-500 text-sm">Help us tailor the starter content for your role.</p>
                            </div>

                            <form onSubmit={handleDetailsSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                                        Target Role
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none text-sm text-gray-900 transition-all"
                                            placeholder="e.g. Product Manager"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                                        Experience Level
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <select
                                            required
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-white appearance-none text-sm text-gray-900 transition-all cursor-pointer"
                                        >
                                            <option value="" disabled>Select Level</option>
                                            <option value="entry">Entry Level (0-2 years)</option>
                                            <option value="mid">Mid Level (3-5 years)</option>
                                            <option value="senior">Senior Level (5-8 years)</option>
                                            <option value="executive">Executive (8+ years)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-brand-green hover:bg-brand-greenHover text-brand-dark py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all mt-2 text-sm"
                                >
                                    Start Building
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Processing & Upload Progress */}
                    {step === 'processing' && (
                        <div className="animate-fadeIn py-2">
                            {isError ? (
                                <div className="text-center py-4 space-y-4">
                                    <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
                                        <AlertCircle size={30} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-dark mb-1">Upload Incomplete</h3>
                                        <p className="text-gray-600 text-sm max-w-sm mx-auto">
                                            {errorMessage || 'Something went wrong while parsing the file.'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsError(false);
                                                setErrorMessage(null);
                                                fileInputRef.current?.click();
                                            }}
                                            className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenHover text-brand-dark px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                                        >
                                            <RefreshCw size={16} /> Choose Another File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsError(false);
                                                setErrorMessage(null);
                                                setStep('selection');
                                            }}
                                            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold text-sm transition-colors"
                                        >
                                            Back to Options
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Uploading Header */}
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-green/15 text-brand-dark mb-3 relative">
                                            <Upload size={22} className="text-brand-green" />
                                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-dark mb-1">
                                            {method === 'upload' ? 'Importing Your Resume' : 'Preparing Your Resume'}
                                        </h3>
                                        <p className="text-gray-500 text-xs">
                                            {processingStatus}
                                        </p>
                                    </div>

                                    {/* File Card Preview if uploaded */}
                                    {file && (
                                        <div className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                                                    <FileText size={18} className="text-gray-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-brand-dark truncate max-w-[240px] sm:max-w-[300px]">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            {fileBadge && (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${fileBadge.color}`}>
                                                    {fileBadge.text}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Progress Bar with Percentage */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-semibold">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="text-brand-dark font-mono">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-brand-green h-full rounded-full transition-all duration-300 ease-out relative"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stages list */}
                                    {method === 'upload' && (
                                        <div className="space-y-2.5 pt-1">
                                            {UPLOAD_STAGES.map((stage, idx) => {
                                                const isCompleted = idx < activeStage || progress === 100;
                                                const isCurrent = idx === activeStage && progress < 100;

                                                return (
                                                    <div
                                                        key={stage.title}
                                                        className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                                                            isCurrent ? 'bg-brand-green/5' : ''
                                                        }`}
                                                    >
                                                        <div className="mt-0.5 shrink-0">
                                                            {isCompleted ? (
                                                                <CheckCircle2 size={16} className="text-brand-green fill-brand-green/20" />
                                                            ) : isCurrent ? (
                                                                <Loader2 size={16} className="text-brand-green animate-spin" />
                                                            ) : (
                                                                <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p
                                                                className={`text-xs leading-tight ${
                                                                    isCurrent
                                                                        ? 'font-bold text-brand-dark'
                                                                        : isCompleted
                                                                        ? 'font-medium text-gray-700'
                                                                        : 'text-gray-400'
                                                                }`}
                                                            >
                                                                {stage.title}
                                                            </p>
                                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                                {stage.detail}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleFileSelect(e.target.files[0]);
                                // Clear input value so same file can be re-selected if needed
                                e.target.value = '';
                            }
                        }}
                    />

                </div>
            </div>
        </div>,
        document.body
    );
}

