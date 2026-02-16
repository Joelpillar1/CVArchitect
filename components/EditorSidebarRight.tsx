import React, { useState } from 'react';
import { ResumeData } from '../types';
import { UserSubscription } from '../types/pricing';
import { loadFromStorage } from '../utils/statePersistence';
import EditorSidebarDesign from './EditorSidebarDesign';
import JobMatchForm from './JobMatchForm';
import { Palette, Target } from 'lucide-react';

interface EditorSidebarRightProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
    onSave?: () => void;
    onSaveAsTemplate?: () => void;
    currentResumeId?: string | null;
    userSubscription: UserSubscription;
    onAIAction: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function EditorSidebarRight({ data, onChange, onSave, onSaveAsTemplate, currentResumeId, userSubscription, onAIAction }: EditorSidebarRightProps) {
    const [activeTab, setActiveTab] = useState<'design' | 'job-match'>(() => {
        const openJobMatch = loadFromStorage<boolean>('editor_openJobMatchTab', false);
        if (openJobMatch) {
            try { localStorage.removeItem('editor_openJobMatchTab'); } catch (_) {}
            return 'job-match';
        }
        return 'design';
    });

    return (
        <div className="w-full bg-brand-bg border-l border-brand-border flex flex-col h-full overflow-hidden shrink-0 animate-fadeIn">
            {/* Tabs */}
            <div className="p-4 border-b border-brand-border">
                <div className="flex bg-brand-secondary p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'design'
                            ? 'bg-white shadow-sm text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Palette size={14} />
                        Design
                    </button>
                    <button
                        onClick={() => setActiveTab('job-match')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'job-match'
                            ? 'bg-white shadow-sm text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Target size={14} />
                        Job Match
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'design' ? (
                    <EditorSidebarDesign
                        data={data}
                        onChange={onChange}
                        onSave={onSave}
                        onSaveAsTemplate={onSaveAsTemplate}
                        currentResumeId={currentResumeId}
                    />
                ) : (
                    <div className="h-full overflow-y-auto p-4">
                        <JobMatchForm data={data} onChange={onChange} userSubscription={userSubscription} onAIAction={onAIAction} />
                    </div>
                )}
            </div>
        </div>
    );
}
