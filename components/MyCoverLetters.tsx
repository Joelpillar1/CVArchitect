import React, { useState } from 'react';
import { SavedCoverLetter } from '../services/coverLetterService';
import { ArrowRight, FileText, Plus, Trash2, AlertTriangle, LayoutTemplate, Sparkles } from 'lucide-react';
import CoverLetterTemplates from './cover-letters/CoverLetterTemplates';
import { CoverLetterTemplateType } from '../utils/coverLetterConfig';

interface MyCoverLettersProps {
    letters: SavedCoverLetter[];
    onViewLetter: (letter: SavedCoverLetter) => void;
    onDeleteLetter: (id: string) => void;
    onCreateNew: () => void;
    onSelectTemplate?: (templateId: CoverLetterTemplateType) => void;
    isLoading?: boolean;
    initialTab?: 'templates' | 'letters';
}

export default function MyCoverLetters({
    letters,
    onViewLetter,
    onDeleteLetter,
    onCreateNew,
    onSelectTemplate,
    isLoading = false,
    initialTab
}: MyCoverLettersProps) {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    // If user has no letters, show templates by default so they can pick one immediately
    const [activeTab, setActiveTab] = useState<'templates' | 'letters'>(() => {
        if (initialTab) return initialTab;
        return letters.length === 0 ? 'templates' : 'letters';
    });

    const handleDelete = () => {
        if (confirmDeleteId) {
            onDeleteLetter(confirmDeleteId);
            setConfirmDeleteId(null);
        }
    };

    const handleSelectTemplate = (templateId: CoverLetterTemplateType) => {
        if (onSelectTemplate) {
            onSelectTemplate(templateId);
        } else {
            onCreateNew();
        }
    };

    const letterToDelete = letters.find(l => l.id === confirmDeleteId);

    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-brand-bg">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-2">
                            Cover Letters & Templates
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base font-light max-w-2xl">
                            Explore ATS-optimized templates, preview styles, and generate personalized cover letters in seconds.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={onCreateNew}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-green text-brand-dark font-bold text-xs uppercase tracking-wide rounded-xl hover:bg-brand-greenHover transition-all shadow-xs active:scale-95"
                        >
                            <Plus size={16} />
                            <span>Create Cover Letter</span>
                        </button>
                    </div>
                </div>

                {/* Tab Navigation Pill Bar */}
                <div className="flex items-center justify-between border-b border-gray-200/80 pb-4 mb-8">
                    <div className="flex items-center gap-2 bg-gray-200/60 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                                activeTab === 'templates'
                                    ? 'bg-white text-brand-dark shadow-xs'
                                    : 'text-gray-600 hover:text-brand-dark'
                            }`}
                        >
                            <LayoutTemplate size={15} />
                            <span>Templates</span>
                            <span className="bg-brand-green/20 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                                3 Available
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('letters')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                                activeTab === 'letters'
                                    ? 'bg-white text-brand-dark shadow-xs'
                                    : 'text-gray-600 hover:text-brand-dark'
                            }`}
                        >
                            <FileText size={15} />
                            <span>My Letters</span>
                            <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                {letters.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'templates' ? (
                    <div className="animate-fadeIn">
                        <CoverLetterTemplates onSelectTemplate={handleSelectTemplate} />
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 flex flex-col pointer-events-none select-none">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-lg skeleton-shimmer" />
                                            <div className="w-16 h-5 rounded-full skeleton-shimmer" />
                                        </div>
                                        <div className="h-5 w-40 rounded skeleton-shimmer mb-2" />
                                        <div className="h-4 w-28 rounded skeleton-shimmer mb-4" />
                                        <div className="space-y-2 mb-6">
                                            <div className="h-3 w-full rounded skeleton-shimmer" />
                                            <div className="h-3 w-11/12 rounded skeleton-shimmer" />
                                            <div className="h-3 w-3/4 rounded skeleton-shimmer" />
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <div className="h-4 w-20 rounded skeleton-shimmer" />
                                            <div className="h-4 w-16 rounded skeleton-shimmer" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : letters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                                {letters.map((letter) => (
                                    <div
                                        key={letter.id}
                                        className="group relative bg-white rounded-2xl shadow-xs border border-gray-200 hover:border-brand-green hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                                        onClick={() => onViewLetter(letter)}
                                    >
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="bg-gray-100 text-gray-500 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                                                    {new Date(letter.updated_at).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-brand-dark mb-1 line-clamp-1">
                                                {letter.title || 'Untitled Letter'}
                                            </h3>
                                            <div className="space-y-0.5 mb-4">
                                                <p className="text-sm text-gray-600 font-medium">{letter.job_title || 'General Role'}</p>
                                                <p className="text-xs text-gray-400">{letter.company_name || 'Various Companies'}</p>
                                            </div>

                                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                                                {letter.content.plainText}
                                            </p>
                                        </div>

                                        {/* Actions Footer */}
                                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmDeleteId(letter.id);
                                                }}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                                                title="Delete Letter"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewLetter(letter);
                                                }}
                                                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-brand-dark transition-colors"
                                            >
                                                View & Edit <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto">
                                <div className="w-14 h-14 mx-auto bg-brand-green/10 rounded-2xl flex items-center justify-center mb-4 text-brand-green">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark">No Saved Cover Letters Yet</h3>
                                <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto mb-6">
                                    Choose from our ATS-optimized cover letter templates to generate your first tailored letter.
                                </p>
                                <button
                                    onClick={() => setActiveTab('templates')}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-green hover:bg-brand-greenHover text-brand-dark font-bold text-xs uppercase tracking-wide rounded-xl transition-all shadow-md active:scale-95"
                                >
                                    <LayoutTemplate size={16} />
                                    Choose a Template
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation Delete Modal */}
            {confirmDeleteId && letterToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-xs" onClick={() => setConfirmDeleteId(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-scaleIn">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-brand-dark">Delete Cover Letter</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Are you sure you want to delete "{letterToDelete.title}"? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 rounded-lg font-semibold text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg font-semibold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
