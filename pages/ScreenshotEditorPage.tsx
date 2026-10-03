import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import { ResumeData, INITIAL_DATA, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { loadFromStorage, saveToStorage, debouncedSaveToStorage } from '../utils/statePersistence';
import { useToast } from '../contexts/ToastContext';

export default function ScreenshotEditorPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Default resume data loaded from localStorage if available, or INITIAL_DATA
    const [resumeData, setResumeDataState] = useState<ResumeData>(() => {
        return loadFromStorage<ResumeData>('cv_app_data', INITIAL_DATA);
    });

    // Default template loaded from localStorage or 'vanguard'
    const [selectedTemplate, setSelectedTemplateState] = useState<TemplateType>(() => {
        return loadFromStorage<TemplateType>('cv_app_template', 'vanguard');
    });

    // Full pro subscription so all templates, features, exports, and controls are completely unlocked for screenshots
    const proSubscription: UserSubscription = {
        id: 'screenshot_sub',
        userId: 'screenshot_user',
        planId: 'lifetime',
        status: 'active',
        credits: 999999,
        maxResumes: 999,
        unlimitedTailoring: true,
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3650).toISOString(),
    };

    const setResumeData = useCallback((data: ResumeData | ((prev: ResumeData) => ResumeData)) => {
        setResumeDataState((prev) => {
            const newData = typeof data === 'function' ? data(prev) : data;
            debouncedSaveToStorage('cv_app_data', newData, 300);
            return newData;
        });
    }, []);

    const setSelectedTemplate = useCallback((template: TemplateType | ((prev: TemplateType) => TemplateType)) => {
        setSelectedTemplateState((prev) => {
            const newTemplate = typeof template === 'function' ? template(prev) : template;
            saveToStorage('cv_app_template', newTemplate);
            return newTemplate;
        });
    }, []);

    return (
        <div className="min-h-screen w-full bg-brand-bg text-brand-dark flex flex-col">
            <Editor
                data={resumeData}
                onChange={(newData) => {
                    setResumeData(newData);
                }}
                template={selectedTemplate}
                onTemplateChange={(template) => {
                    setSelectedTemplate(template);
                    localStorage.setItem('cv_app_template', template);
                    const updatedData = { ...resumeData, template };
                    setResumeData(updatedData);
                }}
                onBack={() => {
                    navigate('/');
                }}
                onSave={(data) => {
                    if (data) setResumeData(data);
                    showToast('Resume saved successfully', 'success');
                }}
                onSaveAsTemplate={(data) => {
                    if (data) setResumeData(data);
                    showToast('Saved as template', 'success');
                }}
                userSubscription={proSubscription}
                onAIAction={() => true}
                onShowPaywall={() => {}}
            />
        </div>
    );
}
