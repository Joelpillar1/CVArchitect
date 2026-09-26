import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Loader2, Sparkles } from 'lucide-react';
import { parseResume } from '../../utils/resumeParser';
import { ResumeData, INITIAL_DATA, createEmptyResume } from '../../types';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResumeLoaded: (data: ResumeData, title?: string) => void;
  autoProcessFile?: File | null;
}

export default function ResumeUploadModal({ isOpen, onClose, onResumeLoaded, autoProcessFile }: ResumeUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && autoProcessFile) {
      processFile(autoProcessFile);
    }
  }, [isOpen, autoProcessFile]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setErrorMsg(null);
    setProgress(20);

    try {
      const parsedPartial = await parseResume(file, (prog) => setProgress(prog));
      setProgress(100);

      const mergedData: ResumeData = {
        ...createEmptyResume(),
        ...parsedPartial,
        fullName: parsedPartial.fullName || '',
        jobTitle: parsedPartial.jobTitle || '',
        summary: parsedPartial.summary || '',
        experience: Array.isArray(parsedPartial.experience) ? parsedPartial.experience : [],
        skills: parsedPartial.skills || '',
        education: Array.isArray(parsedPartial.education) ? parsedPartial.education : [],
      };

      const rawFileName = file.name ? file.name.replace(/\.[^/.]+$/, '').trim() : '';
      const uploadedTitle = rawFileName || (mergedData.fullName ? `${mergedData.fullName}'s Resume` : 'Uploaded Resume');

      setTimeout(() => {
        setIsUploading(false);
        onResumeLoaded(mergedData, uploadedTitle);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Error parsing uploaded resume:', err);
      setIsUploading(false);
      setErrorMsg(err.message || 'Failed to extract text from file. Try uploading another PDF or DOCX.');
    }
  };

  const handleUseSample = () => {
    onResumeLoaded(INITIAL_DATA);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Upload Your Resume</h3>
          <p className="text-xs text-slate-500 mt-1">Upload PDF or Word document to get started</p>
        </div>

        {isUploading ? (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Parsing Resume Data...</p>
              <p className="text-xs text-slate-500 mt-1">Extracting text & formatting structure ({progress}%)</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-emerald-500 bg-gray-50 hover:bg-emerald-50/40 rounded-xl p-6 text-center cursor-pointer transition-all group"
            >
              <FileText className="w-10 h-10 text-gray-400 group-hover:text-emerald-600 mx-auto mb-2 transition-colors" />
              <p className="text-sm font-semibold text-slate-800">Click to select PDF or DOCX</p>
              <p className="text-xs text-gray-400 mt-1">Drag and drop file here</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-xs text-gray-400 uppercase font-medium">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              onClick={handleUseSample}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Use Sample Product Designer Resume</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
