import React, { useState } from 'react';
import { Search, ChevronDown, Briefcase, CheckCircle, XCircle, Target, Layers } from 'lucide-react';
import { interviewQuestions } from './questions';

export default function InterviewPrep() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const categories = ['All', ...Array.from(new Set(interviewQuestions.map(q => q.category)))];

    const filteredQuestions = interviewQuestions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (q.role && q.role.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-5xl mx-auto p-6 animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-3xl font-light text-brand-dark mb-2 tracking-tight">Interview Preparation</h1>
                <p className="text-gray-500 font-light">Refine your responses with recruiter-tailored insights and verified frameworks.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search questions or specific roles..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-gray-200 focus:ring-1 focus:ring-brand-green/30 outline-none text-gray-700 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                                    ? 'bg-brand-dark text-white shadow-md shadow-brand-dark/10'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100">
                        No matches found. Try refining your search.
                    </div>
                ) : (
                    filteredQuestions.map(q => (
                        <div key={q.id} className={`bg-white rounded-xl border transition-all duration-300 ${expandedId === q.id ? 'shadow-md border-gray-200 ring-1 ring-gray-50' : 'shadow-sm border-gray-100 hover:border-gray-200'}`}>
                            <button
                                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                                className="w-full text-left px-6 py-5 flex items-start justify-between group"
                            >
                                <div className="flex-1 pr-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-semibold tracking-wide uppercase px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100">
                                            {q.category}
                                        </span>
                                        {q.role && (
                                            <span className="text-xs font-medium px-2 py-1 text-gray-400 flex items-center gap-1">
                                                <Briefcase size={12} /> {q.role}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={`text-lg transition-colors ${expandedId === q.id ? 'font-semibold text-brand-dark' : 'font-medium text-gray-800'}`}>{q.question}</h3>
                                </div>
                                <div className={`mt-1 transform transition-transform duration-300 ${expandedId === q.id ? 'rotate-180 text-brand-dark' : 'text-gray-300 group-hover:text-gray-500'}`}>
                                    <ChevronDown size={20} />
                                </div>
                            </button>

                            {expandedId === q.id && (
                                <div className="px-6 pb-6 pt-2 animate-fadeIn delay-75">
                                    <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Target size={14} className="text-gray-400" /> The Hidden Intent
                                                </h4>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {q.intent}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Layers size={14} className="text-gray-400" /> The Framework
                                                </h4>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {q.framework}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-8 md:pl-8 md:border-l border-gray-100">
                                            <div>
                                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <XCircle size={14} className="text-red-500" /> The Red Flag Answer
                                                </h4>
                                                <div className="pl-4 border-l-2 border-red-200 text-sm text-gray-600 italic">
                                                    "{q.badExample}"
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-brand-green/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <CheckCircle size={14} className="text-brand-green" /> Recruiter-Approved Answer
                                                </h4>
                                                <div className="pl-4 border-l-2 border-brand-green/40 text-sm text-gray-800 font-medium leading-relaxed">
                                                    "{q.goodExample}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
