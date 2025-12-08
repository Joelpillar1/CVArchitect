import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, Check, Briefcase, User, ArrowLeft, Loader2 } from 'lucide-react';

interface OnboardingProps {
    onComplete: (data: any) => void;
}

type Step = 'selection' | 'upload' | 'details' | 'processing';

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState<Step>('selection');
    const [method, setMethod] = useState<'upload' | 'scratch' | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [role, setRole] = useState('');
    const [experience, setExperience] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle Drag & Drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        // Validate file type (PDF, DOCX)
        if (selectedFile.type === 'application/pdf' ||
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            setFile(selectedFile);
            // Simulate processing delay then move to next step
            setTimeout(() => {
                setStep('details');
            }, 1500);
        } else {
            alert('Please upload a PDF or DOCX file.');
        }
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');

        // Simulate AI analysis/setup
        setTimeout(() => {
            onComplete({
                method,
                file,
                role,
                experience
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-2xl">

                {/* Progress Indicator */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${step === 'selection' ? 'text-brand-green' : 'text-brand-dark'}`}>Start</span>
                        <span className={`text-sm font-bold ${step === 'upload' || step === 'details' ? 'text-brand-green' : 'text-gray-300'}`}>Details</span>
                        <span className={`text-sm font-bold ${step === 'processing' ? 'text-brand-green' : 'text-gray-300'}`}>Ready</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-green transition-all duration-500 ease-out"
                            style={{
                                width: step === 'selection' ? '33%' :
                                    step === 'upload' ? '50%' :
                                        step === 'details' ? '66%' : '100%'
                            }}
                        />
                    </div>
                </div>

                {/* Step 1: Selection */}
                {step === 'selection' && (
                    <div className="animate-fadeIn">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4 text-center" style={{ fontFamily: 'Graphik, sans-serif' }}>
                            How would you like to start?
                        </h1>
                        <p className="text-gray-500 text-center mb-10">
                            Choose the best way to build your ATS-optimized resume.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Option: Upload */}
                            <button
                                onClick={() => { setMethod('upload'); setStep('upload'); }}
                                className="group relative p-8 border-2 border-gray-200 rounded-2xl hover:border-brand-green hover:bg-green-50/30 transition-all text-left"
                            >
                                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Upload size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-2">Upload Resume</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    We'll extract your info and reformat it into an ATS-friendly template.
                                </p>
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-brand-green">
                                    <ArrowRight size={24} />
                                </div>
                            </button>

                            {/* Option: Scratch */}
                            <button
                                onClick={() => { setMethod('scratch'); setStep('details'); }}
                                className="group relative p-8 border-2 border-gray-200 rounded-2xl hover:border-brand-green hover:bg-green-50/30 transition-all text-left"
                            >
                                <div className="w-14 h-14 bg-brand-green/20 text-brand-green rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <FileText size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-2">Create New</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Start from scratch with our step-by-step builder and AI suggestions.
                                </p>
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-brand-green">
                                    <ArrowRight size={24} />
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Upload */}
                {step === 'upload' && (
                    <div className="animate-fadeIn">
                        <button
                            onClick={() => setStep('selection')}
                            className="flex items-center gap-2 text-gray-500 hover:text-brand-dark mb-6 transition-colors"
                        >
                            <ArrowLeft size={18} /> Back
                        </button>

                        <h1 className="text-3xl font-extrabold text-brand-dark mb-4 text-center">
                            Upload your resume
                        </h1>
                        <p className="text-gray-500 text-center mb-10">
                            Supported formats: PDF, DOCX (Max 5MB)
                        </p>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                ${isDragging ? 'border-brand-green bg-green-50' : 'border-gray-200 hover:border-brand-green hover:bg-gray-50'}
                ${file ? 'bg-green-50 border-brand-green' : ''}
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
                                <div className="flex flex-col items-center animate-fadeIn">
                                    <div className="w-16 h-16 bg-green-100 text-brand-green rounded-full flex items-center justify-center mb-4">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-1">{file.name}</h3>
                                    <p className="text-gray-500 text-sm mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <div className="flex items-center gap-2 text-brand-green font-medium">
                                        <Loader2 size={18} className="animate-spin" />
                                        Analyzing content...
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-2">Click to upload or drag and drop</h3>
                                    <p className="text-gray-400 text-sm">PDF or DOCX (Max 5MB)</p>
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
                            className="flex items-center gap-2 text-gray-500 hover:text-brand-dark mb-6 transition-colors"
                        >
                            <ArrowLeft size={18} /> Back
                        </button>

                        <h1 className="text-3xl font-extrabold text-brand-dark mb-4 text-center">
                            Tell us about your goal
                        </h1>
                        <p className="text-gray-500 text-center mb-10">
                            We'll tailor the AI suggestions based on your target role.
                        </p>

                        <form onSubmit={handleDetailsSubmit} className="space-y-6 max-w-md mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-brand-dark mb-2">Target Job Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        required
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. Product Designer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-dark mb-2">Experience Level</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <select
                                        required
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all appearance-none bg-white"
                                    >
                                        <option value="" disabled>Select your experience</option>
                                        <option value="intern">Intern / Student</option>
                                        <option value="entry">Entry Level (0-2 years)</option>
                                        <option value="mid">Mid Level (3-5 years)</option>
                                        <option value="senior">Senior Level (5-8 years)</option>
                                        <option value="executive">Executive (8+ years)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-green hover:opacity-90 text-brand-dark px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mt-8"
                            >
                                Continue to Dashboard
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 4: Processing */}
                {step === 'processing' && (
                    <div className="text-center animate-fadeIn py-12">
                        <div className="w-20 h-20 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                            <Loader2 size={40} className="animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-dark mb-2">Setting up your workspace...</h2>
                        <p className="text-gray-500">
                            {method === 'upload' ? 'Parsing your resume and optimizing for ATS...' : 'Preparing ATS-friendly templates for you...'}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
