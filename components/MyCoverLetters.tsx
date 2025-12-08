import React, { useState } from 'react';
import { SavedCoverLetter } from '../services/coverLetterService';
import { ArrowRight, FileText, Plus, Trash2, AlertTriangle, Eye, Copy, Download } from 'lucide-react';

interface MyCoverLettersProps {
    letters: SavedCoverLetter[];
    onViewLetter: (letter: SavedCoverLetter) => void;
    onDeleteLetter: (id: string) => void;
    onCreateNew: () => void;
}

export default function MyCoverLetters({ letters, onViewLetter, onDeleteLetter, onCreateNew }: MyCoverLettersProps) {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleDelete = () => {
        if (confirmDeleteId) {
            onDeleteLetter(confirmDeleteId);
            setConfirmDeleteId(null);
        }
    };

    const letterToDelete = letters.find(l => l.id === confirmDeleteId);

    return (
        <div className="p-8 md:p-12 h-full overflow-y-auto bg-brand-bg">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-bold text-brand-dark tracking-tight mb-3">My Cover Letters</h2>
                        <p className="text-gray-500 text-lg font-light">
                            Manage your AI-generated cover letters tailored for specific roles.
                        </p>
                    </div>
                    <button
                        onClick={onCreateNew}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-green text-brand-dark font-bold rounded-xl hover:bg-brand-greenHover shadow-gray-200 hover:shadow-brand-green/20 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} />
                        Create New Letter
                    </button>
                </div>

                <div>
                    {letters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                            {letters.map((letter) => (
                                <div
                                    key={letter.id}
                                    className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:border-brand-green hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                                    onClick={() => onViewLetter(letter)}
                                >
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center text-brand-green">
                                                <FileText size={20} />
                                            </div>
                                            <div className="bg-gray-100 text-gray-500 text-[10px] uppercase font-bold px-2 py-1 rounded-full">
                                                {new Date(letter.updated_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-brand-dark mb-1 line-clamp-1">{letter.title || 'Untitled Letter'}</h3>
                                        <div className="space-y-1 mb-4">
                                            <p className="text-sm text-gray-500 font-medium">{letter.job_title || 'General Role'}</p>
                                            <p className="text-xs text-gray-400">{letter.company_name || 'Various Companies'}</p>
                                        </div>

                                        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                                            {letter.content.plainText}
                                        </p>
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(letter.id); }}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                            title="Delete Letter"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); onViewLetter(letter); }}
                                            className="flex items-center gap-1.5 text-sm font-bold text-brand-green hover:text-brand-dark transition-colors"
                                        >
                                            View & Edit <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 mx-auto bg-brand-secondary rounded-full flex items-center justify-center mb-6">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark">No Cover Letters Yet</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto mb-6">
                                Generate tailored cover letters for your job applications in seconds using AI.
                            </p>
                            <button
                                onClick={onCreateNew}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
                            >
                                <Plus size={18} />
                                Create Your First Letter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmDeleteId && letterToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fadeIn">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-brand-dark">Delete Cover Letter</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Are you sure you want to delete "{letterToDelete.title}"? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg font-semibold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
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
