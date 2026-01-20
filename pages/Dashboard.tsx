import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, FileText, Settings as SettingsIcon, Home, ChevronRight, ChevronLeft, LogOut, Bookmark } from 'lucide-react';
import { ResumeData, INITIAL_DATA, TemplateType, SavedTemplate } from '../types';
import Editor from '../components/Editor';
import Overview from '../components/Overview';
import Templates from '../components/Templates';
import { Settings } from '../components/Settings';
import MyTemplates from '../components/MyTemplates';
import MyCoverLetters from '../components/MyCoverLetters';
import TemplateOnboardingModal from '../components/TemplateOnboardingModal';
import PaywallModal from '../components/PaywallModal';
import PricingModal from '../components/PricingModal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserSubscription, PlanId } from '../types/pricing';
import { resumeService } from '../services/resumeService';
import { subscriptionService } from '../services/subscriptionService';
import { profileService, UserProfile } from '../services/profileService';
import { SubscriptionManager } from '../utils/subscriptionManager';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Core state needed for routing-based dashboard
    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        try {
            const saved = localStorage.getItem('cv_app_data');
            return saved ? JSON.parse(saved) : INITIAL_DATA;
        } catch {
            return INITIAL_DATA;
        }
    });

    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(() => {
        return (localStorage.getItem('cv_app_template') as TemplateType) || 'vanguard';
    });

    const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
    const [currentResumeId, setCurrentResumeId] = useState<string | null>(() => {
        try {
            return localStorage.getItem('cv_app_resume_id');
        } catch {
            return null;
        }
    });
    const [userSubscription, setUserSubscription] = useState<UserSubscription>({
        userId: user?.id || 'guest',
        planId: 'free',
        credits: 0,
        isActive: true,
        subscriptionStart: new Date(),
        subscriptionEnd: undefined,
        billingCycle: 'monthly',
        usageHistory: [],
    });
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [showOnboardingModal, setShowOnboardingModal] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const isEditorRoute = location.pathname === '/dashboard/editor';

    // Subscription helper for credits & feature checks
    const subscriptionManager = new SubscriptionManager(userSubscription);

    // Load saved resumes from Supabase when user changes
    useEffect(() => {
        const loadResumes = async () => {
            if (!user) {
                setSavedTemplates([]);
                setCurrentResumeId(null);
                return;
            }
            try {
                const rows = await resumeService.getResumes(user.id);
                const templates: SavedTemplate[] = rows
                    .map((r) => {
                        let content: any = r.content;
                        if (typeof content === 'string') {
                            try {
                                content = JSON.parse(content);
                            } catch (e) {
                                console.error(`Failed to parse resume "${r.title}":`, e);
                                return null;
                            }
                        }
                        if (!content || typeof content !== 'object') {
                            console.error(`Invalid resume content for "${r.title}"`);
                            return null;
                        }
                        return {
                            id: r.id,
                            tag: r.title,
                            baseTemplate: (content?.template || 'free') as TemplateType,
                            data: content as ResumeData,
                            createdAt: new Date(r.created_at),
                        };
                    })
                    .filter((t): t is SavedTemplate => t !== null);
                setSavedTemplates(templates);
            } catch (err) {
                console.error('Failed to load resumes:', err);
            }
        };
        loadResumes();
    }, [user]);

    // Load subscription & profile from Supabase when user changes
    useEffect(() => {
        if (!user) {
            // Reset to defaults for guests
            setUserSubscription(prev => ({
                ...prev,
                userId: 'guest',
                planId: 'free',
                credits: 0,
                isActive: true,
                subscriptionStart: new Date(),
                subscriptionEnd: undefined,
                billingCycle: 'monthly',
                usageHistory: [],
                usageStats: undefined,
            }));
            setUserProfile(null);
            return;
        }

        // Subscription
        subscriptionService.getSubscription(user.id).then(sub => {
            if (sub) {
                setUserSubscription(sub);
            } else {
                // No subscription row yet – keep a sensible free default tied to this user
                setUserSubscription({
                    userId: user.id,
                    planId: 'free',
                    credits: 0,
                    isActive: true,
                    subscriptionStart: new Date(),
                    subscriptionEnd: undefined,
                    billingCycle: 'monthly',
                    usageHistory: [],
                });
            }
        }).catch(err => {
            console.error('Failed to load subscription:', err);
        });

        // Profile
        profileService.getProfile(user.id).then(profile => {
            setUserProfile(profile);
        }).catch(err => {
            console.error('Failed to load profile:', err);
        });
    }, [user]);

    // Persist last-opened resume/template locally so reload on /dashboard/editor restores it
    useEffect(() => {
        try {
            localStorage.setItem('cv_app_template', selectedTemplate);
            if (currentResumeId) {
                localStorage.setItem('cv_app_resume_id', currentResumeId);
            } else {
                localStorage.removeItem('cv_app_resume_id');
            }
            localStorage.setItem('cv_app_data', JSON.stringify(resumeData));
        } catch {
            // Ignore storage errors (e.g., private mode)
        }
    }, [selectedTemplate, currentResumeId, resumeData]);

    // Warn before closing the tab/window if there are unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar (hidden on editor route) */}
            {!isEditorRoute && (
            <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-brand-dark text-white transition-all duration-300 flex flex-col`}>
                <div className="p-4 flex items-center justify-between">
                    {!isSidebarCollapsed && <h1 className="text-xl font-bold">CVArchitect</h1>}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-2">
                    <NavItem icon={<Home size={20} />} label="Overview" to="/dashboard" collapsed={isSidebarCollapsed} />
                    <NavItem icon={<Layout size={20} />} label="Templates" to="/dashboard/templates" collapsed={isSidebarCollapsed} />
                        <NavItem icon={<Bookmark size={20} />} label="My Templates" to="/dashboard/my-templates" collapsed={isSidebarCollapsed} />
                        <NavItem icon={<FileText size={20} />} label="Cover Letters" to="/dashboard/cover-letters" collapsed={isSidebarCollapsed} />
                    <NavItem icon={<SettingsIcon size={20} />} label="Settings" to="/dashboard/settings" collapsed={isSidebarCollapsed} />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => {
                            signOut();
                            navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        {!isSidebarCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Routes>
                    {/* Overview (index) */}
                    <Route
                        index
                        element={
                        <Overview
                                onCreateNew={() => {
                                    // starting a fresh resume; clear current id so autosave creates new entry
                                    setCurrentResumeId(null);
                                    navigate('/dashboard/templates');
                                }}
                            savedTemplates={savedTemplates}
                                onLoadTemplate={(template) => {
                                    setResumeData(template.data);
                                    setSelectedTemplate(template.baseTemplate);
                                    setCurrentResumeId(template.id);
                                    setHasUnsavedChanges(false);
                                    navigate('/dashboard/editor');
                                }}
                                onDeleteTemplate={(id) => {
                                    const deleted = savedTemplates.find(t => t.id === id);
                                    setSavedTemplates(prev => prev.filter(t => t.id !== id));
                                    if (user && !id.startsWith('tmp_')) {
                                        resumeService.deleteResume(id)
                                            .then(() => {
                                                showToast('Resume deleted.', 'success');
                                            })
                                            .catch(err => {
                                                console.error('Failed to delete resume from Supabase:', err);
                                                showToast('Failed to delete resume from server. Please try again.', 'error');
                                                // restore if failed
                                                if (deleted) {
                                                    setSavedTemplates(prev => [deleted, ...prev]);
                                                }
                                            });
                                    } else {
                                        showToast('Resume deleted locally.', 'success');
                                    }
                                }}
                            userName={user?.user_metadata?.full_name || user?.email}
                            userSubscription={userSubscription}
                        />
                        }
                    />

                    {/* Templates selection */}
                    <Route
                        path="templates"
                        element={
                        <Templates
                            onSelect={(template) => {
                                setSelectedTemplate(template);
                                    setCurrentResumeId(null);
                                    setShowOnboardingModal(true);
                            }}
                            data={resumeData}
                        />
                        }
                    />

                    {/* Saved templates (My Templates) */}
                    <Route
                        path="my-templates"
                        element={
                        <MyTemplates
                            templates={savedTemplates}
                                onLoadTemplate={(template) => {
                                    setResumeData(template.data);
                                    setSelectedTemplate(template.baseTemplate);
                                    setCurrentResumeId(template.id);
                                    setHasUnsavedChanges(false);
                                    navigate('/dashboard/editor');
                                }}
                                onDeleteTemplate={(id) => {
                                    const deleted = savedTemplates.find(t => t.id === id);
                                    setSavedTemplates(prev => prev.filter(t => t.id !== id));
                                    if (user && !id.startsWith('tmp_')) {
                                        resumeService.deleteResume(id)
                                            .then(() => {
                                                showToast('Resume deleted.', 'success');
                                            })
                                            .catch(err => {
                                                console.error('Failed to delete resume from Supabase:', err);
                                                showToast('Failed to delete resume from server. Please try again.', 'error');
                                                if (deleted) {
                                                    setSavedTemplates(prev => [deleted, ...prev]);
                                                }
                                            });
                                    } else {
                                        showToast('Resume deleted locally.', 'success');
                                    }
                                }}
                            />
                        }
                    />

                    {/* Cover letters list */}
                    <Route
                        path="cover-letters"
                        element={
                            <MyCoverLetters
                                letters={[]}
                                onViewLetter={() => { }}
                                onDeleteLetter={() => { }}
                                onCreateNew={() => navigate('/dashboard/editor')}
                            />
                        }
                    />

                    {/* Editor */}
                    <Route
                        path="editor"
                        element={
                        <Editor
                            data={resumeData}
                                onChange={(newData) => {
                                    setResumeData(newData);
                                    setHasUnsavedChanges(true);
                                }}
                            template={selectedTemplate}
                            onTemplateChange={setSelectedTemplate}
                                onBack={() => {
                                    if (hasUnsavedChanges) {
                                        const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave without saving?');
                                        if (!confirmLeave) return;
                                    }
                                    navigate('/dashboard');
                                }}
                                onAIAction={(action) => {
                                    const check = subscriptionManager.canUseFeature(action);
                                    if (!check.allowed) {
                                        console.log('AI Action blocked:', check.reason);
                                        setShowPaywall(true);
                                        showToast(check.reason || 'You are out of credits. Please upgrade to continue using AI.', 'error');
                                        return false;
                                    }

                                    const previousCredits = subscriptionManager.getCreditBalance();
                                    const result = subscriptionManager.deductCredit(action);

                                    if (!result.success) {
                                        setShowPaywall(true);
                                        showToast('You are out of credits. Please upgrade to continue using AI.', 'error');
                                        return false;
                                    }

                                    const cost = previousCredits - result.remainingCredits;

                                    if (user && cost > 0) {
                                        subscriptionService.performAction(user.id, action, cost)
                                            .then(res => {
                                                if (res.success) {
                                                    setUserSubscription(prev => ({
                                                        ...prev,
                                                        credits: res.newCredits,
                                                        usageHistory: [
                                                            {
                                                                timestamp: new Date(),
                                                                action,
                                                                creditsCost: cost,
                                                                remainingCredits: res.newCredits,
                                                            },
                                                            ...prev.usageHistory,
                                                        ],
                                                        usageStats: prev.usageStats ? {
                                                            totalActions: prev.usageStats.totalActions + 1,
                                                            totalCreditsUsed: prev.usageStats.totalCreditsUsed + cost,
                                                        } : {
                                                            totalActions: 1,
                                                            totalCreditsUsed: cost,
                                                        },
                                                    }));
                                                }
                                            })
                                            .catch(err => {
                                                console.error('Failed to sync credits with server:', err);
                                                showToast('Failed to process credits. Please check your connection.', 'error');
                                            });
                                    } else {
                                        // Guest users or unlimited plans (no cost): just sync local subscription state
                                        setUserSubscription(subscriptionManager.getSubscription());
                                    }

                                    return true;
                                }}
                                onSave={(data?: ResumeData) => {
                                    const raw = data || resumeData;
                                    const toSave: ResumeData = { ...raw, template: selectedTemplate };
                                    const tag = toSave.currentTag || 'Untitled Resume';
                                    const baseTemplate = selectedTemplate;

                                    if (user) {
                                        (async () => {
                                            try {
                                                const existingId = currentResumeId && !currentResumeId.startsWith('tmp_')
                                                    ? currentResumeId
                                                    : null;

                                                if (existingId) {
                                                    // Update existing Supabase resume
                                                    await resumeService.updateResume(existingId, tag, toSave);
                                                    const updated: SavedTemplate = {
                                                        id: existingId,
                                                        tag,
                                                        baseTemplate,
                                                        data: toSave,
                                                        createdAt: new Date(),
                                                    };
                                                    setSavedTemplates(prev => {
                                                        const exists = prev.some(t => t.id === existingId);
                                                        return exists
                                                            ? prev.map(t => (t.id === existingId ? updated : t))
                                                            : [updated, ...prev];
                                                    });
                                                    setCurrentResumeId(existingId);
                                                    showToast(`Resume "${tag}" updated successfully!`, 'success');
                                                } else {
                                                    // Create new Supabase resume
                                                    const newId = await resumeService.createResume(user.id, tag, toSave);
                                                    const newTemplate: SavedTemplate = {
                                                        id: newId,
                                                        tag,
                                                        baseTemplate,
                                                        data: toSave,
                                                        createdAt: new Date(),
                                                    };
                                                    setSavedTemplates(prev => [newTemplate, ...prev]);
                                                    setCurrentResumeId(newId);
                                                    showToast(`Resume "${tag}" saved successfully!`, 'success');
                                                }
                                                setHasUnsavedChanges(false);
                                            } catch (err) {
                                                console.error('Failed to save resume to Supabase:', err);
                                                showToast('Failed to save resume. Please try again.', 'error');
                                            }
                                        })();
                                    } else {
                                        // Guest mode: keep local-only templates
                                        const id = currentResumeId || `tmp_${Date.now()}`;
                                        setSavedTemplates(prev => {
                                            const exists = prev.some(t => t.id === id);
                                            const existing = prev.find(t => t.id === id);
                                            const updated: SavedTemplate = {
                                                id,
                                                tag,
                                                baseTemplate,
                                                data: toSave,
                                                createdAt: exists && existing ? existing.createdAt : new Date(),
                                            };
                                            return exists
                                                ? prev.map(t => (t.id === id ? updated : t))
                                                : [updated, ...prev];
                                        });
                                        setCurrentResumeId(id);
                                        setHasUnsavedChanges(false);
                                        showToast('Resume saved locally.', 'success');
                                    }
                                }}
                                onSaveAsTemplate={(data?: ResumeData) => {
                                    const raw = data || resumeData;
                                    const toSave: ResumeData = { ...raw, template: selectedTemplate };
                                    const tag = toSave.currentTag || 'Untitled Resume';
                                    const baseTemplate = selectedTemplate;

                                    if (user) {
                                        (async () => {
                                            try {
                                                // Prevent duplicate template names for this user
                                                const duplicate = savedTemplates.some(t => t.tag.toLowerCase() === tag.toLowerCase());
                                                if (duplicate) {
                                                    showToast('You already have a template with this name. Please choose a different name.', 'error');
                                                    return;
                                                }

                                                const newId = await resumeService.createResume(user.id, tag, toSave);
                                                const newTemplate: SavedTemplate = {
                                                    id: newId,
                                                    tag,
                                                    baseTemplate,
                                                    data: toSave,
                                                    createdAt: new Date(),
                                                };
                                                setSavedTemplates(prev => [newTemplate, ...prev]);
                                                setCurrentResumeId(newId);
                                                setHasUnsavedChanges(false);
                                                showToast(`Template "${tag}" saved successfully!`, 'success');
                                            } catch (err) {
                                                console.error('Failed to save template to Supabase:', err);
                                                showToast('Failed to save template. Please try again.', 'error');
                                            }
                                        })();
                                    } else {
                                        const id = `tmp_${Date.now()}`;
                                        const newTemplate: SavedTemplate = {
                                            id,
                                            tag,
                                            baseTemplate,
                                            data: toSave,
                                            createdAt: new Date(),
                                        };
                                        setSavedTemplates(prev => [newTemplate, ...prev]);
                                        setCurrentResumeId(id);
                                        setHasUnsavedChanges(false);
                                        showToast(`Template "${tag}" saved locally.`, 'success');
                                    }
                                }}
                                userSubscription={userSubscription}
                                onShowPaywall={() => setShowPaywall(true)}
                            />
                        }
                    />

                    {/* Settings */}
                    <Route
                        path="settings"
                        element={
                        <Settings
                            userSubscription={userSubscription}
                            onUpgrade={() => setShowPricingModal(true)}
                                userProfile={userProfile ? { full_name: userProfile.full_name, avatar_url: userProfile.avatar_url || null } : undefined}
                                userEmail={user?.email || undefined}
                                onProfileUpdate={() => {
                                    if (!user) return;
                                    profileService.getProfile(user.id)
                                        .then(profile => setUserProfile(profile))
                                        .catch(err => console.error('Failed to refresh profile:', err));
                                }}
                            />
                        }
                    />

                    {/* Fallback to overview */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>

            {/* Real paywall + pricing modals */}
                <PaywallModal
                    isOpen={showPaywall}
                    onClose={() => setShowPaywall(false)}
                    onUpgrade={() => {
                        setShowPaywall(false);
                        setShowPricingModal(true);
                    }}
                feature="general"
                    currentPlan={userSubscription.planId}
                />

                <PricingModal
                    isOpen={showPricingModal}
                    onClose={() => setShowPricingModal(false)}
                onSelectPlan={(planId: PlanId) => {
                    // In this dashboard preview, just log the selection.
                    // Full subscription handling lives in the main app flow.
                    console.log('Selected plan from dashboard:', planId);
                    }}
                    currentPlanId={userSubscription.planId}
                />

            {/* Onboarding modal: upload vs start from scratch */}
            <TemplateOnboardingModal
                isOpen={showOnboardingModal}
                onClose={() => setShowOnboardingModal(false)}
                onComplete={(data) => {
                    setShowOnboardingModal(false);

                    let newResumeData: ResumeData = { ...INITIAL_DATA, template: selectedTemplate };

                    if (data.method === 'upload') {
                        // Use parsed data from uploaded resume
                        newResumeData = {
                            ...newResumeData,
                            ...(data.parsedData || {}),
                            jobTitle: (data.parsedData?.jobTitle as string) || data.role || 'Professional Role',
                        };

                        // Ensure experience IDs are present/unique
                        if (newResumeData.experience) {
                            newResumeData.experience = newResumeData.experience.map((exp: any, index: number) => ({
                                ...exp,
                                id: exp.id || `exp_${Date.now()}_${index}`,
                            }));
                        }
                    } else {
                        // Start from scratch with role as job title
                        newResumeData = {
                            ...newResumeData,
                            jobTitle: data.role || 'Professional Role',
                        };
                    }

                    const tag = newResumeData.currentTag || 'Untitled Resume';
                    const baseTemplate = selectedTemplate;

                    if (user) {
                        (async () => {
                            try {
                                const newId = await resumeService.createResume(user.id, tag, newResumeData);
                                const newTemplate: SavedTemplate = {
                                    id: newId,
                                    tag,
                                    baseTemplate,
                                    data: newResumeData,
                                    createdAt: new Date(),
                                };
                                setSavedTemplates(prev => [newTemplate, ...prev]);
                                setCurrentResumeId(newId);
                                setResumeData(newResumeData);
                                setHasUnsavedChanges(false);
                                showToast(`Resume "${tag}" created from ${data.method === 'upload' ? 'upload' : 'scratch'} and saved.`, 'success');
                                navigate('/dashboard/editor');
                            } catch (err) {
                                console.error('Failed to auto-save new resume to Supabase:', err);
                                showToast('Failed to auto-save new resume. You can still edit, but it is not saved yet.', 'error');
                                // Even if Supabase fails, still open editor with local state
                                setResumeData(newResumeData);
                                setHasUnsavedChanges(false);
                                navigate('/dashboard/editor');
                            }
                        })();
                    } else {
                        // Guest mode: create local template only
                        const id = `tmp_${Date.now()}`;
                        const newTemplate: SavedTemplate = {
                            id,
                            tag,
                            baseTemplate,
                            data: newResumeData,
                            createdAt: new Date(),
                        };
                        setSavedTemplates(prev => [newTemplate, ...prev]);
                        setCurrentResumeId(id);
                        setResumeData(newResumeData);
                        setHasUnsavedChanges(false);
                        showToast(`Resume "${tag}" created locally.`, 'success');
                        navigate('/dashboard/editor');
                    }
                }}
            />
        </div>
    );
}

// Navigation Item Component
interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    to: string;
    collapsed: boolean;
}

function NavItem({ icon, label, to, collapsed }: NavItemProps) {
    const navigate = useNavigate();
    const isActive = window.location.pathname === to;

    return (
        <button
            onClick={() => navigate(to)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-green text-brand-dark' : 'hover:bg-white/10'
                }`}
            title={collapsed ? label : undefined}
        >
            {icon}
            {!collapsed && <span className="font-medium">{label}</span>}
        </button>
    );
}
