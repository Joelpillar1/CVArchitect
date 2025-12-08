import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Check, Loader2, Briefcase, User, ArrowLeft } from 'lucide-react';
import { createPortal } from 'react-dom';
import { parseResume } from '../utils/resumeParser';
import { ResumeData } from '../types';

interface TemplateOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
    onCheckUploadPermission?: () => boolean;
}

type Step = 'selection' | 'upload' | 'details' | 'processing';

export default function TemplateOnboardingModal({ isOpen, onClose, onComplete, onCheckUploadPermission }: TemplateOnboardingModalProps) {
    const [step, setStep] = useState<Step>('selection');
    const [method, setMethod] = useState<'upload' | 'scratch' | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [role, setRole] = useState('');
    const [experience, setExperience] = useState('');
    const [processingStatus, setProcessingStatus] = useState('Preparing your workspace...');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile.type === 'application/pdf' ||
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            setFile(selectedFile);
            setTimeout(() => {
                setStep('details');
            }, 1000);
        } else {
            alert('Please upload a PDF or DOCX file.');
        }
    };

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');
        setProcessingStatus('Extracting text...');

        const startTime = Date.now();
        let parsedData: Partial<ResumeData> = {};

        if (method === 'upload' && file) {
            try {
                // The parser handles both text extraction and AI analysis
                // We can't easily split the status update *inside* the parser without passing a callback
                // But we can simulate it or just show "Analyzing..."
                setProcessingStatus('Analyzing with AI...');
                parsedData = await parseResume(file);

                if (!parsedData.fullName) {
                    alert('Could not extract text from this resume. Please try a different file or enter details manually.');
                }
            } catch (err) {
                console.error("Parsing failed", err);
                alert('Resume parsing failed. Please try again or enter details manually.');
            }
        }

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1500 - elapsedTime);

        setTimeout(() => {
            onComplete({ method, file, role, experience, parsedData });
        }, remainingTime);
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8 md:p-10">

                    {/* Step 1: Selection */}
                    {step === 'selection' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2 text-center">
                                How would you like to start?
                            </h2>
                            <p className="text-gray-500 text-center mb-8">
                                We can extract info from your existing resume or help you build one.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        if (onCheckUploadPermission && !onCheckUploadPermission()) {
                                            return;
                                        }
                                        setMethod('upload');
                                        setStep('upload');
                                    }}
                                    className="group p-6 border-2 border-gray-100 rounded-xl hover:border-brand-green hover:bg-green-50/30 transition-all text-left"
                                >
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-dark mb-1">Upload Resume</h3>
                                    <p className="text-gray-500 text-xs">Auto-fill from PDF/DOCX</p>
                                </button>

                                <button
                                    onClick={() => { setMethod('scratch'); setStep('details'); }}
                                    className="group p-6 border-2 border-gray-100 rounded-xl hover:border-brand-green hover:bg-green-50/30 transition-all text-left"
                                >
                                    <div className="w-12 h-12 bg-brand-green/20 text-brand-green rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-dark mb-1">Create New</h3>
                                    <p className="text-gray-500 text-xs">Start with AI guidance</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Upload */}
                    {step === 'upload' && (
                        <div className="animate-fadeIn text-center">
                            <button
                                onClick={() => setStep('selection')}
                                className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>

                            <h2 className="text-2xl font-bold text-brand-dark mb-6">Upload Resume</h2>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                  border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all
                  ${file ? 'bg-green-50 border-brand-green' : 'border-gray-200 hover:border-brand-green hover:bg-gray-50'}
                `}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.docx"
                                    onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
                                />

                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <Check size={32} className="text-brand-green mb-2" />
                                        <span className="font-medium text-brand-dark">{file.name}</span>
                                        <span className="text-xs text-gray-500 mt-1">Analyzing...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload size={32} className="text-gray-400 mb-2" />
                                        <span className="font-medium text-gray-600">Click to upload PDF/DOCX</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Details */}
                    {step === 'details' && (
                        <div className="animate-fadeIn">
                            <button
                                onClick={() => setStep(method === 'upload' ? 'upload' : 'selection')}
                                className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>

                            <h2 className="text-2xl font-bold text-brand-dark mb-2 text-center">Quick Details</h2>
                            <p className="text-gray-500 text-center mb-6 text-sm">Help us tailor the content for you.</p>

                            <form onSubmit={handleDetailsSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Target Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                            placeholder="e.g. Product Manager"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Experience</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <select
                                            required
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none bg-white appearance-none"
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
                                    className="w-full bg-brand-green hover:opacity-90 text-brand-dark py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all mt-4"
                                >
                                    Start Building
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 4: Processing */}
                    {step === 'processing' && (
                        <div className="text-center animate-fadeIn py-8">
                            <Loader2 size={48} className="animate-spin text-brand-green mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-brand-dark">{processingStatus}</h3>
                        </div>
                    )}

                </div>
            </div>
        </div>,
        document.body
    );
}
