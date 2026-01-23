import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, FileText, Settings as SettingsIcon, Home, ChevronRight, ChevronLeft, LogOut, Bookmark, Menu, X } from 'lucide-react';
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
import CoverLetterPage from './CoverLetterPage';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserSubscription, PlanId } from '../types/pricing';
import { resumeService } from '../services/resumeService';
import { subscriptionService } from '../services/subscriptionService';
import { profileService, UserProfile } from '../services/profileService';
import { coverLetterService, SavedCoverLetter } from '../services/coverLetterService';
import { SubscriptionManager } from '../utils/subscriptionManager';
import { saveToStorage, debouncedSaveToStorage, loadFromStorage } from '../utils/statePersistence';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Core state needed for routing-based dashboard
    // Load from localStorage on mount
    const [resumeData, setResumeDataState] = useState<ResumeData>(() => {
        return loadFromStorage<ResumeData>('cv_app_data', INITIAL_DATA);
    });

    const [selectedTemplate, setSelectedTemplateState] = useState<TemplateType>(() => {
        return loadFromStorage<TemplateType>('cv_app_template', 'vanguard');
    });

    // Wrapper functions that persist immediately
    const setResumeData = useCallback((data: ResumeData | ((prev: ResumeData) => ResumeData)) => {
        setResumeDataState(prev => {
            const newData = typeof data === 'function' ? data(prev) : data;
            // Immediate save for critical state
            debouncedSaveToStorage('cv_app_data', newData, 300);
            return newData;
        });
    }, []);

    const setSelectedTemplate = React.useCallback((template: TemplateType | ((prev: TemplateType) => TemplateType)) => {
        setSelectedTemplateState(prev => {
            const newTemplate = typeof template === 'function' ? template(prev) : template;
            // Immediate save
            saveToStorage('cv_app_template', newTemplate);
            return newTemplate;
        });
    }, []);

    const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
    const [savedCoverLetters, setSavedCoverLetters] = useState<SavedCoverLetter[]>([]);
    const [currentResumeId, setCurrentResumeIdState] = useState<string | null>(() => {
        return loadFromStorage<string | null>('cv_app_resume_id', null);
    });

    // Wrapper for currentResumeId that persists immediately
    const setCurrentResumeId = useCallback((id: string | null) => {
        setCurrentResumeIdState(id);
        if (id) {
            saveToStorage('cv_app_resume_id', id);
        } else {
            localStorage.removeItem('cv_app_resume_id');
        }
    }, []);
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [showOnboardingModal, setShowOnboardingModal] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const isEditorRoute = location.pathname === '/dashboard/editor';

    // Subscription helper for credits & feature checks
    const subscriptionManager = new SubscriptionManager(userSubscription);

    // Track if we've done initial load to prevent overwriting unsaved changes
    const hasLoadedResumesRef = React.useRef<boolean>(false);

    // Load saved resumes from Supabase when user changes
    useEffect(() => {
        const loadResumes = async () => {
            if (!user) {
                setSavedTemplates([]);
                setCurrentResumeId(null);
                hasLoadedResumesRef.current = false;
                return;
            }
            try {
                console.log('Loading resumes for user:', user.id);
                const rows = await resumeService.getResumes(user.id);
                console.log('Fetched resumes from database:', rows.length, rows);
                
                const templates: SavedTemplate[] = rows
                    .map((r) => {
                        try {
                            let content: any = r.content;
                            
                            // Supabase JSONB fields are usually already objects, but handle string case
                            if (typeof content === 'string') {
                                try {
                                    content = JSON.parse(content);
                                } catch (e) {
                                    console.error(`Failed to parse resume "${r.title}":`, e);
                                    return null;
                                }
                            }
                            
                            // Validate content is an object
                            if (!content || typeof content !== 'object' || Array.isArray(content)) {
                                console.error(`Invalid resume content for "${r.title}":`, content);
                                return null;
                            }
                            
                            // Ensure template field exists (fallback to 'free' if missing)
                            const template = content?.template || 'free';
                            
                            return {
                                id: r.id,
                                tag: r.title || 'Untitled Resume',
                                baseTemplate: template as TemplateType,
                                data: content as ResumeData,
                                createdAt: new Date(r.created_at),
                            };
                        } catch (e) {
                            console.error(`Error processing resume "${r.title}":`, e);
                            return null;
                        }
                    })
                    .filter((t): t is SavedTemplate => t !== null);
                
                console.log('Processed templates:', templates.length, templates);
                setSavedTemplates(templates);
                
                // Only restore from database on initial load, not when navigating back to editor
                // This prevents overwriting unsaved changes in localStorage
                const savedResumeId = localStorage.getItem('cv_app_resume_id');
                if (savedResumeId && !savedResumeId.startsWith('tmp_')) {
                    const savedResume = templates.find(t => t.id === savedResumeId);
                    if (savedResume) {
                        // Check if we're currently on the editor route - if so, don't overwrite
                        const isOnEditorRoute = location.pathname === '/dashboard/editor';
                        
                        // Only restore from database if:
                        // 1. This is the first load (hasLoadedResumesRef.current === false)
                        // 2. AND we're NOT on the editor route (user isn't actively editing)
                        // 3. OR the localStorage data matches the database (no unsaved changes)
                        const localData = loadFromStorage<ResumeData>('cv_app_data', null);
                        const dataMatches = localData && JSON.stringify(localData) === JSON.stringify(savedResume.data);
                        const isInitialLoad = !hasLoadedResumesRef.current;
                        
                        if ((isInitialLoad && !isOnEditorRoute) || dataMatches) {
                            console.log('Restoring saved resume from database:', savedResumeId, savedResume);
                            setCurrentResumeId(savedResumeId);
                            setResumeData(savedResume.data);
                            setSelectedTemplate(savedResume.baseTemplate);
                            // Update localStorage with the restored data
                            localStorage.setItem('cv_app_data', JSON.stringify(savedResume.data));
                            localStorage.setItem('cv_app_template', savedResume.baseTemplate);
                        } else {
                            console.log('Skipping database restore - preserving localStorage data (user may have unsaved changes)');
                            // Still update currentResumeId to keep it in sync, but preserve localStorage data
                            setCurrentResumeId(savedResumeId);
                        }
                    } else {
                        console.warn('Saved resume ID not found in loaded templates:', savedResumeId);
                    }
                } else if (templates.length > 0 && !hasLoadedResumesRef.current) {
                    // Only auto-load on initial load, not on every navigation
                    // If no saved resume ID but we have templates, optionally load the most recent one
                    // (commented out - let user choose which to load)
                    // const mostRecent = templates[0];
                    // setCurrentResumeId(mostRecent.id);
                    // setResumeData(mostRecent.data);
                    // setSelectedTemplate(mostRecent.baseTemplate);
                }
                
                // Mark as loaded
                hasLoadedResumesRef.current = true;
            } catch (err) {
                console.error('Failed to load resumes:', err);
                showToast('Failed to load saved resumes. Please refresh the page.', 'error');
            }
        };
        loadResumes();
    }, [user, showToast, location.pathname]);

    // Load saved cover letters from Supabase when user changes
    useEffect(() => {
        const loadCoverLetters = async () => {
            if (!user) {
                setSavedCoverLetters([]);
                return;
            }
            try {
                const letters = await coverLetterService.getCoverLetters(user.id);
                setSavedCoverLetters(letters);
            } catch (err) {
                console.error('Failed to load cover letters:', err);
                // Don't show toast for cover letters - it's not critical
            }
        };
        loadCoverLetters();
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

        let isMounted = true;

        // Subscription
        subscriptionService.getSubscription(user.id).then(sub => {
            if (!isMounted) return; // Component unmounted, ignore result
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
            if (!isMounted) return; // Component unmounted, ignore error
            // Ignore AbortError - it's not a real error
            if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
                console.log('Subscription fetch was aborted');
                return;
            }
            console.error('Failed to load subscription:', err);
        });

        // Profile
        profileService.getProfile(user.id).then(profile => {
            if (!isMounted) return; // Component unmounted, ignore result
            setUserProfile(profile);
        }).catch(err => {
            if (!isMounted) return; // Component unmounted, ignore error
            // Ignore AbortError - it's not a real error
            if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
                console.log('Profile fetch was aborted');
                return;
            }
            console.error('Failed to load profile:', err);
        });

        // Cleanup function to mark component as unmounted
        return () => {
            isMounted = false;
        };
    }, [user]);

    // Handle payment return from Whop
    useEffect(() => {
        if (!user) return;

        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment');
        const planParam = params.get('plan');

        // Track polling state for cleanup
        let isPolling = false;

        if (paymentStatus === 'success') {
            console.log('Payment success detected, starting subscription check for user:', user.id);
            showToast('🎉 Payment successful! Activating your subscription...', 'success');

            // Poll for subscription update (webhook might take a few seconds)
            let attempts = 0;
            const maxAttempts = 15; // Increased to 15 attempts (30 seconds total)
            const pollInterval = 2000; // 2 seconds
            isPolling = true;

            const checkSubscription = async () => {
                if (!isPolling) return false; // Component unmounted, stop polling
                
                attempts++;
                console.log(`Checking subscription (attempt ${attempts}/${maxAttempts})...`);
                
                try {
                    const sub = await subscriptionService.getSubscription(user.id);
                    if (!isPolling) return false; // Component unmounted during fetch
                    
                    console.log('Current subscription:', sub);
                    
                    if (sub && (sub.planId === 'week_pass' || sub.planId === 'pro_monthly')) {
                        // Subscription activated!
                        console.log('Subscription activated! Plan:', sub.planId);
                        setUserSubscription(sub);
                        showToast('✅ Subscription activated! You now have unlimited access.', 'success');
                        
                        // Clean URL
                        window.history.replaceState({}, '', '/dashboard');
                        return true;
                    } else {
                        console.log(`Subscription not yet activated. Current plan: ${sub?.planId || 'none'}, Attempt: ${attempts}/${maxAttempts}`);
                        
                        if (attempts < maxAttempts && isPolling) {
                            // Keep polling
                            setTimeout(checkSubscription, pollInterval);
                            return false;
                        } else {
                            if (!isPolling) return false; // Component unmounted
                            
                            // Timeout - show message with manual refresh option
                            console.warn('Subscription activation timeout after', maxAttempts, 'attempts');
                            
                            // Try one more time after a short delay
                            setTimeout(async () => {
                                if (!isPolling) return; // Component unmounted
                                
                                try {
                                    console.log('Final subscription check after timeout...');
                                    const refreshedSub = await subscriptionService.getSubscription(user.id);
                                    if (!isPolling) return; // Component unmounted during fetch
                                    
                                    console.log('Final subscription result:', refreshedSub);
                                    
                                    if (refreshedSub && (refreshedSub.planId === 'week_pass' || refreshedSub.planId === 'pro_monthly')) {
                                        setUserSubscription(refreshedSub);
                                        showToast('✅ Subscription activated! You now have unlimited access.', 'success');
                                        window.history.replaceState({}, '', '/dashboard');
                                    } else {
                                        // Still not activated - show message to user
                                        showToast(
                                            'Payment received! If your subscription doesn\'t appear, please refresh the page or contact support.',
                                            'info',
                                            10000
                                        );
                                        window.history.replaceState({}, '', '/dashboard');
                                        
                                        // Log for debugging
                                        console.error('Subscription still not activated after timeout. Current subscription:', refreshedSub);
                                        console.error('Expected plan: week_pass or pro_monthly');
                                        console.error('User ID:', user.id);
                                    }
                                } catch (err) {
                                    console.error('Error in final subscription check:', err);
                                    showToast('Payment received! Please refresh the page to see your updated subscription.', 'info');
                                    window.history.replaceState({}, '', '/dashboard');
                                }
                            }, 3000);
                            
                            return false;
                        }
                    }
                } catch (err) {
                    if (!isPolling) return false; // Component unmounted, stop polling
                    
                    // Ignore AbortError - it's not a real error
                    if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
                        console.log('Subscription check was aborted');
                        return false;
                    }
                    
                    console.error('Error checking subscription:', err);
                    if (attempts < maxAttempts && isPolling) {
                        setTimeout(checkSubscription, pollInterval);
                    } else if (isPolling) {
                        showToast('Payment received! Please refresh the page to see your updated subscription.', 'info');
                        window.history.replaceState({}, '', '/dashboard');
                    }
                    return false;
                }
            };

            // Start polling immediately, then every 2 seconds
            checkSubscription();
        } else if (paymentStatus === 'cancelled') {
            showToast('Payment cancelled. You can upgrade anytime from settings.', 'info');
            window.history.replaceState({}, '', '/dashboard');
        }
        
        // Cleanup function to stop polling if component unmounts
        return () => {
            isPolling = false;
        };
    }, [user, showToast]);

    // Restore state from localStorage on mount only
    // This ensures state is preserved when switching tabs
    useEffect(() => {
        // Only restore on initial mount, not on every route change
        // The state is already loaded from localStorage in useState initializers
        // This effect just ensures we sync if localStorage was updated externally
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cv_app_data' && e.newValue) {
                try {
                    const newData = JSON.parse(e.newValue);
                    setResumeDataState(newData);
                } catch (err) {
                    console.error('Failed to parse storage update:', err);
                }
            } else if (e.key === 'cv_app_template' && e.newValue) {
                setSelectedTemplateState(e.newValue as TemplateType);
            } else if (e.key === 'cv_app_resume_id') {
                setCurrentResumeIdState(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []); // Only run on mount

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
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Menu Overlay */}
            {!isEditorRoute && isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (hidden on editor route) */}
            {!isEditorRoute && (
            <aside className={`
                ${isSidebarCollapsed ? 'w-16' : 'w-64'} 
                bg-brand-dark text-white transition-all duration-300 flex flex-col
                fixed md:relative z-50 h-full
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 flex items-center justify-between">
                    {!isSidebarCollapsed && <h1 className="text-xl font-bold">CVArchitect</h1>}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="hidden md:flex p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-2">
                    <NavItem icon={<Home size={20} />} label="Overview" to="/dashboard" collapsed={isSidebarCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem icon={<Layout size={20} />} label="Templates" to="/dashboard/templates" collapsed={isSidebarCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
                        <NavItem icon={<Bookmark size={20} />} label="My Templates" to="/dashboard/my-templates" collapsed={isSidebarCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
                        <NavItem icon={<FileText size={20} />} label="Cover Letters" to="/dashboard/cover-letters" collapsed={isSidebarCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
                    <NavItem icon={<SettingsIcon size={20} />} label="Settings" to="/dashboard/settings" collapsed={isSidebarCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
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
            <main className="flex-1 overflow-auto relative">
                {/* Mobile Menu Button */}
                {!isEditorRoute && (
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-brand-dark text-white rounded-lg shadow-lg hover:bg-brand-dark/90 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                )}
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
                            userName={userProfile?.full_name || user?.email || 'User'}
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
                                letters={savedCoverLetters}
                                onViewLetter={(letter) => {
                                    navigate('/dashboard/cover-letter', { state: { initialLetter: letter } });
                                }}
                                onDeleteLetter={async (id) => {
                                    try {
                                        await coverLetterService.deleteCoverLetter(id);
                                        setSavedCoverLetters(prev => prev.filter(l => l.id !== id));
                                        showToast('Cover letter deleted successfully.', 'success');
                                    } catch (err) {
                                        console.error('Failed to delete cover letter:', err);
                                        showToast('Failed to delete cover letter.', 'error');
                                    }
                                }}
                                onCreateNew={() => {
                                    navigate('/dashboard/cover-letter');
                                }}
                            />
                        }
                    />

                    {/* Cover Letter Generator Page */}
                    <Route
                        path="cover-letter"
                        element={
                            <CoverLetterPage
                                resumeData={resumeData}
                                userSubscription={userSubscription}
                                onSave={() => {
                                    // Reload cover letters after save
                                    if (user) {
                                        coverLetterService.getCoverLetters(user.id)
                                            .then(letters => setSavedCoverLetters(letters))
                                            .catch(err => console.error('Failed to reload cover letters:', err));
                                    }
                                }}
                                onDeductCredit={() => {
                                    const check = subscriptionManager.canUseFeature('cover_letter');
                                    if (!check.allowed) {
                                        setShowPaywall(true);
                                        showToast(check.reason || 'You are out of credits. Please upgrade to continue using AI.', 'error');
                                        return false;
                                    }

                                    const previousCredits = subscriptionManager.getCreditBalance();
                                    const result = subscriptionManager.deductCredit('cover_letter');

                                    if (!result.success) {
                                        setShowPaywall(true);
                                        showToast('You are out of credits. Please upgrade to continue using AI.', 'error');
                                        return false;
                                    }

                                    const cost = previousCredits - result.remainingCredits;

                                    if (user && cost > 0) {
                                        subscriptionService.performAction(user.id, 'cover_letter', cost)
                                            .then(res => {
                                                if (res.success) {
                                                    setUserSubscription(prev => ({
                                                        ...prev,
                                                        credits: res.newCredits,
                                                        usageHistory: [
                                                            {
                                                                timestamp: new Date(),
                                                                action: 'cover_letter',
                                                                creditsCost: cost,
                                                                remainingCredits: res.newCredits,
                                                            },
                                                            ...prev.usageHistory,
                                                        ],
                                                    }));
                                                }
                                            })
                                            .catch(err => {
                                                console.error('Failed to sync credits:', err);
                                            });
                                    } else {
                                        setUserSubscription(subscriptionManager.getSubscription());
                                    }

                                    return true;
                                }}
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
                            onTemplateChange={(template) => {
                                setSelectedTemplate(template);
                                // Immediately persist template to localStorage
                                localStorage.setItem('cv_app_template', template);
                                
                                // Update the resume data's template field
                                const updatedData = { ...resumeData, template };
                                setResumeData(updatedData);
                                
                                // If there's a current resume being edited, update its baseTemplate
                                if (currentResumeId && user) {
                                    // Update the saved template in state and get current resume for DB update
                                    setSavedTemplates(prev => {
                                        const currentResume = prev.find(t => t.id === currentResumeId);
                                        
                                        // Update in database asynchronously (don't block UI)
                                        if (currentResume) {
                                            resumeService.updateResume(
                                                currentResumeId, 
                                                currentResume.tag, 
                                                updatedData
                                            ).catch(err => {
                                                console.error('Failed to update template in database:', err);
                                                // Don't show error to user - it's a background sync
                                            });
                                        }
                                        
                                        return prev.map(t => 
                                            t.id === currentResumeId 
                                                ? { ...t, baseTemplate: template, data: updatedData }
                                                : t
                                        );
                                    });
                                    
                                    // Mark as having unsaved changes to prompt save
                                    setHasUnsavedChanges(true);
                                }
                            }}
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

                                    // Persist and log usage for all plans (even when cost is 0)
                                    if (user) {
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
                onCheckUploadPermission={() => {
                    const check = subscriptionManager.canUseFeature('resume_upload');
                    if (!check.allowed) {
                        setShowPaywall(true);
                        return false;
                    }
                    return true;
                }}
                onComplete={(data) => {
                    setShowOnboardingModal(false);

                    let newResumeData: ResumeData = { ...INITIAL_DATA, template: selectedTemplate };

                    if (data.method === 'upload') {
                        // Check access and deduct credits for resume upload
                        const check = subscriptionManager.canUseFeature('resume_upload');
                        if (!check.allowed) {
                            setShowPaywall(true);
                            return;
                        }

                        // Try to deduct credit if authorized
                        const previousCredits = subscriptionManager.getCreditBalance();
                        const creditResult = subscriptionManager.deductCredit('resume_upload');
                        if (!creditResult.success) {
                            setShowPaywall(true);
                            showToast('Insufficient credits. Resume upload costs 1 credit.', 'error');
                            return;
                        }

                        // Update subscription state
                        setUserSubscription(subscriptionManager.getSubscription());

                        // Persist to backend
                        if (user) {
                            const cost = previousCredits - creditResult.remainingCredits;
                            if (cost > 0) {
                                subscriptionService.deductCredits(user.id, cost)
                                    .catch(err => console.error('Failed to sync credits for upload:', err));
                            }
                        }

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
    onClick?: () => void;
}

function NavItem({ icon, label, to, collapsed, onClick }: NavItemProps) {
    const navigate = useNavigate();
    const isActive = window.location.pathname === to;

    const handleClick = () => {
        navigate(to);
        onClick?.();
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-green text-brand-dark' : 'hover:bg-white/10'
                }`}
            title={collapsed ? label : undefined}
        >
            {icon}
            {!collapsed && <span className="font-medium">{label}</span>}
        </button>
    );
}
