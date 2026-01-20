import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, FileText, Settings as SettingsIcon, Home, ChevronRight, ChevronLeft, Menu, X, LogOut, Bookmark } from 'lucide-react';
import { ResumeData, INITIAL_DATA, TemplateType, SavedTemplate } from './types';
import Editor from './components/Editor';
import Overview from './components/Overview';
import Templates from './components/Templates';
import { Settings } from './components/Settings';
import LandingPage from './components/LandingPage';
import MyTemplates from './components/MyTemplates';
import Toast from './components/Toast';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import RefundPolicy from './components/RefundPolicy';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Onboarding from './components/Onboarding';
import TemplateOnboardingModal from './components/TemplateOnboardingModal';
import PaywallModal from './components/PaywallModal';
import PricingModal from './components/PricingModal';
import PricingPage from './components/PricingPage';
import { UserSubscription, PlanId } from './types/pricing';
import { SubscriptionManager, createDefaultSubscription, upgradePlan } from './utils/subscriptionManager';
import { subscriptionService } from './services/subscriptionService';
import { canAccessTemplate, PLANS } from './utils/pricingConfig';
import { auditResume } from './components/utils/aiEnhancer';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import { resumeService } from './services/resumeService';
import { profileService, UserProfile } from './services/profileService';
import MyCoverLetters from './components/MyCoverLetters';
import { coverLetterService, SavedCoverLetter } from './services/coverLetterService';
import CoverLetterModal from './components/CoverLetterModal';

export enum View {
  LANDING = 'LANDING',
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  ONBOARDING = 'ONBOARDING',
  OVERVIEW = 'OVERVIEW',
  TEMPLATES = 'TEMPLATES',
  MY_TEMPLATES = 'MY_TEMPLATES',
  MY_COVER_LETTERS = 'MY_COVER_LETTERS',
  EDITOR = 'EDITOR',
  SETTINGS = 'SETTINGS',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  CONTACT = 'CONTACT',
  REFUND_POLICY = 'REFUND_POLICY',
}

// Helper functions to map between View enum and URL paths
function viewToPath(view: View): string {
  const pathMap: Record<View, string> = {
    [View.LANDING]: '/',
    [View.SIGN_IN]: '/login',
    [View.SIGN_UP]: '/signup',
    [View.FORGOT_PASSWORD]: '/forgot-password',
    [View.RESET_PASSWORD]: '/reset-password',
    [View.ONBOARDING]: '/dashboard/onboarding',
    [View.OVERVIEW]: '/dashboard',
    [View.TEMPLATES]: '/dashboard/templates',
    [View.MY_TEMPLATES]: '/dashboard/my-templates',
    [View.MY_COVER_LETTERS]: '/dashboard/cover-letters',
    [View.EDITOR]: '/dashboard/editor',
    [View.SETTINGS]: '/dashboard/settings',
    [View.PRIVACY]: '/privacy',
    [View.TERMS]: '/terms',
    [View.CONTACT]: '/contact',
    [View.REFUND_POLICY]: '/refund-policy',
  };
  return pathMap[view] || '/dashboard';
}

function pathToView(pathname: string): View {
  // Remove trailing slash
  const path = pathname.replace(/\/$/, '') || '/';

  const viewMap: Record<string, View> = {
    '/': View.LANDING,
    '/login': View.SIGN_IN,
    '/signup': View.SIGN_UP,
    '/forgot-password': View.FORGOT_PASSWORD,
    '/reset-password': View.RESET_PASSWORD,
    '/dashboard': View.OVERVIEW,
    '/dashboard/onboarding': View.ONBOARDING,
    '/dashboard/templates': View.TEMPLATES,
    '/dashboard/my-templates': View.MY_TEMPLATES,
    '/dashboard/cover-letters': View.MY_COVER_LETTERS,
    '/dashboard/editor': View.EDITOR,
    '/dashboard/settings': View.SETTINGS,
    '/privacy': View.PRIVACY,
    '/terms': View.TERMS,
    '/contact': View.CONTACT,
    '/refund-policy': View.REFUND_POLICY,
  };

  return viewMap[path] || View.OVERVIEW;
}

// AppWrapper removed as Toast is now handled by Context
const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
  </>
);

export default function App() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<View>(() => {
    const saved = localStorage.getItem('cv_app_view');
    // Validation to ensure saved view is valid and NOT an auth/landing page (since those are now routes)
    if (saved && Object.values(View).includes(saved as View)) {
      if (saved === View.LANDING ||
        saved === View.SIGN_IN ||
        saved === View.SIGN_UP ||
        saved === View.FORGOT_PASSWORD ||
        saved === View.RESET_PASSWORD ||
        saved === View.ONBOARDING) { // Depending on if onboarding is internal or not
        return View.OVERVIEW;
      }
      return saved as View;
    }
    // Default to OVERVIEW
    return View.OVERVIEW;
  });

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
    return localStorage.getItem('cv_app_resume_id') || null;
  });

  const [savedCoverLetters, setSavedCoverLetters] = useState<SavedCoverLetter[]>([]);
  const [editingCoverLetter, setEditingCoverLetter] = useState<SavedCoverLetter | undefined>(undefined);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [auditResult, setAuditResult] = useState<{ score: number; keywords: string[]; issues: string[] } | null>(null);
  const [savedResumes, setSavedResumes] = useState<SavedTemplate[]>([]);

  // Subscription State - New Comprehensive System
  const [userSubscription, setUserSubscription] = useState<UserSubscription>(
    createDefaultSubscription('user_' + Date.now())
  );
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<'templates' | 'job-match' | 'general' | 'credits' | 'export'>('general');

  // Load user subscription
  useEffect(() => {
    if (user) {
      // Fetch subscription from Supabase
      import('./services/subscriptionService').then(({ subscriptionService }) => {
        subscriptionService.getSubscription(user.id)
          .then((sub) => {
            if (sub) {
              // The service now maps this correctly to UserSubscription
              setUserSubscription(sub);
            } else {
              // No subscription found? Create default connected to this user ID
              setUserSubscription(createDefaultSubscription(user.id));
            }
          }).catch(err => {
            console.error('Failed to load subscription:', err);
            // On error, use default subscription
            setUserSubscription(createDefaultSubscription(user.id));
          });
      });
    } else {
      // Reset if logged out
      setUserSubscription(createDefaultSubscription('guest'));
    }
  }, [user]);

  // Handle payment return from Whop
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');

    if (paymentStatus === 'success') {
      showToast('🎉 Payment successful! Your subscription is activating...', 'success');

      // Refresh user subscription data
      if (user) {
        import('./services/subscriptionService').then(({ subscriptionService }) => {
          subscriptionService.getSubscription(user.id)
            .then((sub) => {
              if (sub) {
                setUserSubscription(sub);
                showToast('✅ Subscription activated! You now have unlimited access.', 'success');
              }
            })
            .catch(err => console.error('Failed to refresh subscription:', err));
        });
      }

      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      showToast('Payment cancelled. You can upgrade anytime from settings.', 'info');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, showToast]);

  // Load saved resumes from Supabase
  useEffect(() => {
    if (user) {
      resumeService.getResumes(user.id).then((resumes) => {
        // Convert database resumes to SavedTemplate format
        const templates: SavedTemplate[] = resumes
          .map((resume) => {
            // Parse content if it's a string
            let content = resume.content;
            if (typeof content === 'string') {
              try {
                content = JSON.parse(content);
              } catch (e) {
                console.error(`Failed to parse resume "${resume.title}":`, e);
                // Skip this resume if it's corrupted
                return null;
              }
            }

            // Validate content is an object
            if (!content || typeof content !== 'object') {
              console.error(`Invalid resume content for "${resume.title}"`);
              return null;
            }

            return {
              id: resume.id,
              tag: resume.title,
              baseTemplate: (content?.template || 'free') as TemplateType,
              data: content,
              createdAt: new Date(resume.created_at),
            };
          })
          .filter((t): t is SavedTemplate => t !== null); // Remove null entries

        setSavedResumes(templates);
        console.log('Loaded resumes:', templates.length);
      }).catch(err => console.error('Failed to load resumes:', err));
    } else {
      setSavedResumes([]);
    }
  }, [user]);

  // Redirect unauthenticated users to landing page (only after auth check completes)
  useEffect(() => {
    if (!authLoading && !user) {
      // Only redirect to landing if not already on a public page
      if (
        currentView !== View.LANDING &&
        currentView !== View.SIGN_IN &&
        currentView !== View.SIGN_UP &&
        currentView !== View.FORGOT_PASSWORD &&
        currentView !== View.RESET_PASSWORD &&
        currentView !== View.PRIVACY &&
        currentView !== View.TERMS &&
        currentView !== View.CONTACT &&
        currentView !== View.REFUND_POLICY
      ) {
        setCurrentView(View.LANDING);
      }
    }
  }, [authLoading, user, currentView]);

  // Redirect authenticated users from auth pages to dashboard
  useEffect(() => {
    if (user) {
      // If user is logged in and on landing/auth pages, redirect to dashboard.
      // NOTE: We do NOT redirect from legal pages (PRIVACY, TERMS, CONTACT) so users can read them.
      if (
        currentView === View.LANDING ||
        currentView === View.SIGN_IN ||
        currentView === View.SIGN_UP ||
        currentView === View.FORGOT_PASSWORD ||
        currentView === View.RESET_PASSWORD
      ) {
        setCurrentView(View.OVERVIEW);
      }
    }
  }, [user, currentView]);

  // Load user resumes
  useEffect(() => {
    if (user) {
      resumeService.getResumes(user.id).then(resumes => {
        const templates: SavedTemplate[] = resumes.map(r => ({
          id: r.id,
          tag: r.title,
          baseTemplate: r.content.template || 'vanguard',
          data: r.content,
          createdAt: new Date(r.created_at)
        }));
        setSavedTemplates(templates);
      }).catch(err => console.error('Failed to load resumes:', err));

      // Load cover letters
      coverLetterService.getCoverLetters(user.id).then(letters => {
        setSavedCoverLetters(letters);
      }).catch(err => console.error('Failed to load cover letters:', err));

      // Load profile
      profileService.getProfile(user.id).then(profile => {
        setUserProfile(profile);
      }).catch(err => console.error('Failed to load profile:', err));

    } else {
      setSavedTemplates([]);
      setSavedCoverLetters([]);
      setUserProfile(null);
    }
  }, [user]);


  // Load user profile
  useEffect(() => {
    if (user) {
      profileService.getProfile(user.id)
        .then(profile => setUserProfile(profile))
        .catch(err => console.error('Failed to load profile:', err));
    } else {
      setUserProfile(null);
    }
  }, [user]);

  // Refresh profile data
  const handleRefreshProfile = async () => {
    if (user) {
      try {
        const profile = await profileService.getProfile(user.id);
        setUserProfile(profile);
      } catch (err) {
        console.error('Failed to refresh profile:', err);
      }
    }
  };

  // State Persistence & Unsaved Changes Warning
  useEffect(() => {
    localStorage.setItem('cv_app_view', currentView);
    localStorage.setItem('cv_app_template', selectedTemplate);
    if (currentResumeId) localStorage.setItem('cv_app_resume_id', currentResumeId);
    else localStorage.removeItem('cv_app_resume_id');
    localStorage.setItem('cv_app_data', JSON.stringify(resumeData));
  }, [currentView, selectedTemplate, currentResumeId, resumeData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && currentView === View.EDITOR) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, currentView]);

  // Create subscription manager instance
  const subscriptionManager = new SubscriptionManager(userSubscription);

  const handleTemplateSelect = (template: TemplateType) => {
    if (!subscriptionManager.canAccessTemplate(template)) {
      setPaywallFeature('templates');
      setShowPaywall(true);
      return;
    }

    setSelectedTemplate(template);
    setCurrentResumeId(null); // Clear resume ID for new resume
    setShowOnboardingModal(true);
  };

  const handleJobMatchCheck = (): boolean => {
    const check = subscriptionManager.canUseFeature('job_match');
    if (!check.allowed) {
      setPaywallFeature('job-match');
      setShowPaywall(true);
      return false;
    }
    return true;
  };

  const handleAIAction = (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization'): boolean => {
    const check = subscriptionManager.canUseFeature(action);
    if (!check.allowed) {
      console.log('AI Action blocked:', check.reason);
      setPaywallFeature('credits');
      setShowPaywall(true);
      showToast(check.reason || "You are out of credits. Please upgrade or top up.", "error");
      return false;
    }

    // Get cost before deducting for display/logic
    // (We could improve this by exposing getCost from manager)
    // For now, let's just proceed. The manager will deduct and return new state.

    // HOWEVER, for real-time persistence with usage logs, we should use the service.
    // The manager updates local state synchronousy, which is good for UI.
    // But we need to use the service RPC to handle the actual DB transaction properly.

    const previousCredits = subscriptionManager.getCreditBalance();
    const result = subscriptionManager.deductCredit(action); // Updates local in-memory

    if (!result.success) {
      setPaywallFeature('credits');
      setShowPaywall(true);
      return false;
    }

    const cost = previousCredits - result.remainingCredits;

    // Use RPC to persist and log (log even when cost is 0 to track usage)
    if (user) {
      subscriptionService.performAction(user.id, action, cost)
        .then(res => {
          if (res.success) {
            // Since we're tracking a new log, let's append it to our local state so the UI updates instantly
            // without needing a full refetch
            setUserSubscription(prev => ({
              ...prev,
              credits: res.newCredits,
              usageHistory: [
                {
                  timestamp: new Date(),
                  action: action,
                  creditsCost: cost,
                  remainingCredits: res.newCredits
                },
                ...prev.usageHistory
              ],
              usageStats: prev.usageStats ? {
                totalActions: prev.usageStats.totalActions + 1,
                totalCreditsUsed: prev.usageStats.totalCreditsUsed + cost
              } : {
                totalActions: 1,
                totalCreditsUsed: cost
              }
            }));
          }
        })
        .catch(err => {
          console.error('Failed to sync credits with server:', err);
          // Optional: Revert local state if critical
          // setUserSubscription(prev => ({ ...prev, credits: previousCredits }));
          showToast('Failed to process credits. Please check connection.', 'error');
        });
    } else {
      // Guest users: just update local state
      setUserSubscription(subscriptionManager.getSubscription());
    }

    return true;
  };

  const handleSelectPlan = async (planId: PlanId, billingCycle?: 'monthly' | 'yearly' | 'lifetime') => {
    if (!user) {
      showToast('Please sign in to upgrade your plan', 'error');
      return;
    }

    try {
      // Get the selected plan details
      const selectedPlan = PLANS[planId];
      if (!selectedPlan) {
        showToast('Invalid plan selected', 'error');
        return;
      }

      // Calculate credits based on plan
      let credits = selectedPlan.creditRules.startingCredits;
      if (billingCycle === 'yearly' && selectedPlan.creditRules.lifetimeCredits) {
        credits = selectedPlan.creditRules.lifetimeCredits;
      } else if (selectedPlan.creditRules.monthlyCredits) {
        credits = selectedPlan.creditRules.monthlyCredits;
      }

      // Calculate subscription dates
      const subscriptionStart = new Date();
      let subscriptionEnd: Date | undefined;

      subscriptionEnd = new Date();
      if (billingCycle === 'yearly') {
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
      } else if (billingCycle === 'monthly') {
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      } else {
        // Week pass
        subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);
      }

      // Update Supabase database
      const { subscriptionService } = await import('./services/subscriptionService');
      await subscriptionService.updateSubscription(user.id, {
        plan_id: planId,
        credits: credits,
        billing_cycle: billingCycle,
        subscription_start: subscriptionStart.toISOString(),
        subscription_end: subscriptionEnd?.toISOString(),
        is_active: true,
      } as any);

      // Update local state
      setUserSubscription({
        userId: user.id,
        planId: planId,
        credits: credits,
        billingCycle: billingCycle,
        subscriptionStart: subscriptionStart,
        subscriptionEnd: subscriptionEnd,
        isActive: true,
        usageHistory: userSubscription.usageHistory || [],
      });

      // Close modals
      setShowPricingModal(false);
      setShowPaywall(false);

      // Show success message
      showToast(`Successfully upgraded to ${selectedPlan.name}!`, 'success');

    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      showToast('Failed to upgrade plan. Please try again.', 'error');
    }
  };

  const handleUpgrade = () => {
    setShowPaywall(false);
    setShowPricingModal(true);
  };



  // Helper to generate random audit data
  const generateAudit = (role: string) => {
    const scores = [65, 72, 58, 81, 45];
    const randomScore = scores[Math.floor(Math.random() * scores.length)];

    const possibleKeywords = ["Leadership", "Strategic Planning", "Python", "Agile", "Project Management", "Data Analysis", "React", "Communication"];
    const randomKeywords = possibleKeywords.sort(() => 0.5 - Math.random()).slice(0, 3);

    const possibleIssues = [
      "Summary section needs better structure",
      "Inconsistent date formatting found",
      "Bullet points are too lengthy",
      "Action verbs are missing in experience",
      "Contact information is incomplete"
    ];
    const randomIssue = possibleIssues[Math.floor(Math.random() * possibleIssues.length)];

    return {
      score: randomScore,
      keywords: randomKeywords,
      issues: [randomIssue]
    };
  };



  const handleGetStarted = () => {
    if (user) {
      setCurrentView(View.OVERVIEW);
    } else {
      setCurrentView(View.SIGN_IN);
    }
  };

  const handleSignIn = (email: string, password: string) => {
    // In a real app, this would authenticate with a backend
    console.log('Sign in:', email, password);
    setCurrentView(View.OVERVIEW);
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // In a real app, this would create an account with a backend
    console.log('Sign up:', name, email, password);
    setCurrentView(View.ONBOARDING);
  };

  const handleGoogleAuth = () => {
    // In a real app, this would initiate Google OAuth flow
    console.log('Google authentication initiated');
    setCurrentView(View.OVERVIEW);
  };

  const handleLogout = async () => {
    try {
      // Optimistic UI update: reset state immediately
      setCurrentView(View.LANDING);
      setUserProfile(null);
      setSavedTemplates([]);

      // Clear storage
      localStorage.removeItem('cv_app_view');
      localStorage.removeItem('cv_app_data');
      localStorage.removeItem('cv_app_template');
      localStorage.removeItem('cv_app_resume_id');

      showToast('Logged out successfully');

      // Sign out from backend in background
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend fails, we have visually logged them out
    }
  };

  // Save (update existing resume)
  const handleSave = async (dataToSave?: ResumeData) => {
    const finalData = dataToSave || resumeData;
    finalData.template = selectedTemplate;

    if (!currentResumeId) {
      // If no current resume ID, treat as Save As
      return handleSaveAs(dataToSave);
    }

    if (user && !currentResumeId.startsWith('saved_')) {
      try {
        await resumeService.updateResume(
          currentResumeId,
          finalData.currentTag || 'Untitled',
          finalData
        );

        // Update local state
        setSavedResumes(prev =>
          prev.map(t =>
            t.id === currentResumeId
              ? { ...t, data: finalData, tag: finalData.currentTag || t.tag }
              : t
          )
        );
        setHasUnsavedChanges(false);
        showToast(`Resume "${finalData.currentTag || 'Untitled'}" updated successfully!`, 'success');
      } catch (error) {
        console.error('Error updating resume:', error);
        showToast('Failed to update resume.', 'error');
      }
    } else {
      // Local update
      setSavedResumes(prev =>
        prev.map(t =>
          t.id === currentResumeId
            ? { ...t, data: { ...finalData }, tag: finalData.currentTag || t.tag }
            : t
        )
      );
      setHasUnsavedChanges(false);
      showToast('Resume updated locally!', 'success');
    }
  };

  // Save As (create new resume)
  const handleSaveAs = async (dataToSave?: ResumeData) => {
    const finalData = dataToSave || resumeData;
    finalData.template = selectedTemplate;

    if (user) {
      try {
        const resumeId = await resumeService.createResume(
          user.id,
          finalData.currentTag || 'Untitled',
          finalData
        );

        const newSavedTemplate: SavedTemplate = {
          id: resumeId,
          tag: finalData.currentTag || 'Untitled',
          baseTemplate: selectedTemplate,
          data: finalData,
          createdAt: new Date(),
        };

        setSavedResumes(prev => [newSavedTemplate, ...prev]);
        setCurrentResumeId(resumeId);
        setHasUnsavedChanges(false);
        showToast(`Resume "${finalData.currentTag || 'Untitled'}" saved successfully!`, 'success');
      } catch (error) {
        console.error('Error saving resume:', error);
        showToast('Failed to save resume.', 'error');
      }
    } else {
      // Local save fallback
      const newId = `saved_${Date.now()}`;
      const newSavedTemplate: SavedTemplate = {
        id: newId,
        tag: finalData.currentTag || 'Untitled',
        baseTemplate: selectedTemplate,
        data: { ...finalData },
        createdAt: new Date(),
      };
      setSavedResumes(prev => [newSavedTemplate, ...prev]);
      setCurrentResumeId(newId);
      showToast(`Template "${newSavedTemplate.tag}" saved locally!`, 'success');
    }
  };

  // Keep old function name for backward compatibility
  const handleSaveAsTemplate = handleSaveAs;


  const handleLoadSavedTemplate = (savedTemplate: SavedTemplate) => {
    setResumeData(savedTemplate.data);
    setSelectedTemplate(savedTemplate.baseTemplate);
    setCurrentResumeId(savedTemplate.id);
    setSelectedTemplate(savedTemplate.baseTemplate);
    setCurrentResumeId(savedTemplate.id);
    setCurrentView(View.EDITOR);
    setHasUnsavedChanges(false);
  };

  const handleDeleteSavedTemplate = async (id: string) => {
    // Optimistic UI update: Remove from UI immediately
    const templateToDelete = savedResumes.find(t => t.id === id);
    setSavedResumes(prev => prev.filter(t => t.id !== id));
    showToast("Resume deleted.", 'success');

    // Handle database deletion in the background
    if (user && !id.startsWith('saved_')) {
      try {
        await resumeService.deleteResume(id);
        // Successfully deleted from database - no need to update UI again
      } catch (error) {
        console.error('Error deleting resume:', error);
        // Restore the template if database deletion failed
        if (templateToDelete) {
          setSavedResumes(prev => [...prev, templateToDelete].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        }
        showToast('Failed to delete resume from server. Template restored.', 'error');
      }
    }
    // For local templates (id.startsWith('saved_')), no database operation needed
  };

  const renderContent = () => {
    switch (currentView) {
      case View.LANDING:
        return (
          <LandingPage
            onGetStarted={handleGetStarted}
            onSignIn={() => setCurrentView(View.SIGN_IN)}
            onNavigateToPrivacy={() => navigate('/privacy')}
            onNavigateToTerms={() => navigate('/terms')}
            onNavigateToContact={() => navigate('/contact')}
            onNavigateToRefund={() => navigate('/refund-policy')}
          />
        );
      case View.SIGN_IN:
        return (
          <SignIn
            onBack={() => setCurrentView(View.LANDING)}
            onSignUp={() => setCurrentView(View.SIGN_UP)}
            onSuccess={() => setCurrentView(View.OVERVIEW)}
            onForgotPassword={() => setCurrentView(View.FORGOT_PASSWORD)}
          />
        );
      case View.SIGN_UP:
        return (
          <SignUp
            onBack={() => setCurrentView(View.LANDING)}
            onSignIn={() => setCurrentView(View.SIGN_IN)}
          />
        );
      case View.FORGOT_PASSWORD:
        return (
          <ForgotPassword
            onBack={() => setCurrentView(View.SIGN_IN)}
          />
        );
      case View.RESET_PASSWORD:
        return (
          <ResetPassword
            onSuccess={() => setCurrentView(View.SIGN_IN)}
          />
        );
      case View.ONBOARDING:
        return (
          <Onboarding
            onComplete={(data) => {
              console.log('Onboarding complete:', data);

              let newResumeData = { ...INITIAL_DATA };

              if (data.method === 'upload') {
                // Simulate parsed data from uploaded resume
                newResumeData = {
                  ...newResumeData,
                  fullName: "Alex Morgan", // Simulated parsed name
                  email: "alex.morgan@example.com",
                  jobTitle: "Senior Product Designer",
                  summary: "Experienced Product Designer with a track record of creating user-centric digital products. Skilled in UI/UX design, prototyping, and design systems. Passionate about solving complex problems through elegant design solutions.",
                  experience: [
                    {
                      id: "exp_1",
                      company: "TechFlow Solutions",
                      role: "Senior Product Designer",
                      startDate: "2021-01",
                      endDate: "Present",
                      description: [
                        "Leading the design of the core product suite",
                        "Improved user engagement by 40% through a complete redesign of the dashboard",
                        "Mentoring junior designers and establishing design best practices",
                        "Collaborating with product and engineering teams to deliver user-centric solutions",
                        "Conducting user research and usability testing to validate design decisions"
                      ],
                      location: "San Francisco, CA"
                    },
                    {
                      id: "exp_2",
                      company: "Creative Pulse",
                      role: "UI/UX Designer",
                      startDate: "2018-06",
                      endDate: "2021-01",
                      description: [
                        "Collaborated with cross-functional teams to deliver high-quality web and mobile applications",
                        "Conducted user research and usability testing to inform design decisions",
                        "Created wireframes, prototypes, and high-fidelity designs",
                        "Established and maintained design system documentation"
                      ],
                      location: "New York, NY"
                    }
                  ],
                  skills: "Figma, Sketch, Adobe XD, Prototyping, User Research, Design Systems, HTML/CSS"
                };
                showToast("Resume uploaded and analyzed successfully!");
              } else {
                // Initialize for "Create New" flow
                newResumeData = {
                  ...newResumeData,
                  jobTitle: data.role || "Professional Role",
                };
                showToast("Workspace ready! Let's build your resume.");
              }

              setResumeData(newResumeData);
              setShowWelcomeModal(true); // Trigger the welcome modal
              setCurrentView(View.EDITOR);
              setHasUnsavedChanges(false); // New data just created/loaded
            }}
          />
        );
      case View.OVERVIEW:
        return (
          <Overview
            onCreateNew={() => setCurrentView(View.TEMPLATES)}
            savedTemplates={savedTemplates}
            onLoadTemplate={handleLoadSavedTemplate}
            onDeleteTemplate={handleDeleteSavedTemplate}
            userName={userProfile?.full_name || user?.email?.split('@')[0]}
            userSubscription={userSubscription}
          />
        );
      case View.TEMPLATES:
        return <Templates onSelect={handleTemplateSelect} data={resumeData} />;
      case View.MY_TEMPLATES:
        return <MyTemplates templates={savedResumes} onLoadTemplate={handleLoadSavedTemplate} onDeleteTemplate={handleDeleteSavedTemplate} />;
      case View.MY_COVER_LETTERS:
        return (
          <MyCoverLetters
            letters={savedCoverLetters}
            onViewLetter={(letter) => {
              setEditingCoverLetter(letter);
              setShowCoverLetterModal(true);
            }}
            onDeleteLetter={async (id) => {
              try {
                await coverLetterService.deleteCoverLetter(id);
                setSavedCoverLetters(prev => prev.filter(l => l.id !== id));
                showToast("Cover letter deleted.", 'success');
              } catch (e) {
                console.error(e);
                showToast("Failed to delete cover letter.", 'error');
              }
            }}
            onCreateNew={() => {
              // Go to Templates so user can choose a resume template before generating a cover letter
              setCurrentView(View.TEMPLATES);
            }}
          />
        );
      case View.EDITOR:
        return (
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
                if (window.confirm('You have unsaved changes. Are you sure you want to leave without saving?')) {
                  setHasUnsavedChanges(false);
                  setCurrentView(View.TEMPLATES);
                }
              } else {
                setCurrentView(View.TEMPLATES);
              }
            }}
            onSave={handleSave}
            onSaveAsTemplate={handleSaveAs}
            currentResumeId={currentResumeId}
            showWelcomeModal={showWelcomeModal}
            onCloseWelcomeModal={() => setShowWelcomeModal(false)}
            auditResult={auditResult}
            userSubscription={userSubscription}
            onAIAction={handleAIAction}
            onShowPaywall={(feature) => {
              setPaywallFeature(feature);
              setShowPaywall(true);
            }}
          />
        );
      case View.SETTINGS:
        return (
          <Settings
            userSubscription={userSubscription}
            userProfile={userProfile}
            userEmail={user?.email}
            onProfileUpdate={handleRefreshProfile}
            onUpgrade={() => {
              setShowPricingModal(true);
            }}
            onCancelSubscription={() => {
              // Handle subscription cancellation
              if (confirm('Are you sure you want to cancel your subscription?')) {
                showToast('Subscription cancelled. You will retain access until the end of your billing period.', 'info');
              }
            }}
            onNavigateToPrivacy={() => navigate('/privacy')}
            onNavigateToTerms={() => navigate('/terms')}
          />
        );
      case View.PRIVACY:
        return <PrivacyPolicy onBack={() => setCurrentView(user ? View.OVERVIEW : View.LANDING)} />;
      case View.TERMS:
        return <TermsOfService onBack={() => setCurrentView(user ? View.OVERVIEW : View.LANDING)} />;
      case View.CONTACT:
        return <Contact onBack={() => setCurrentView(View.LANDING)} />;
      case View.REFUND_POLICY:
        return <RefundPolicy onBack={() => setCurrentView(user ? View.OVERVIEW : View.LANDING)} />;
      default:
        return (
          <LandingPage
            onGetStarted={handleGetStarted}
            onSignIn={() => setCurrentView(View.SIGN_IN)}
            onNavigateToPrivacy={() => navigate('/privacy')}
            onNavigateToTerms={() => navigate('/terms')}
            onNavigateToContact={() => navigate('/contact')}
            onNavigateToRefund={() => navigate('/refund-policy')}
          />
        );
    }
  };

  const wrapperProps = {
    // Removed toast props
  };

  // React Router Hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Standalone Route Handling
  if (location.pathname === '/privacy') {
    return (
      <AppWrapper {...wrapperProps}>
        <div className="min-h-screen w-full bg-brand-bg">
          <PrivacyPolicy onBack={() => navigate('/')} />
        </div>
      </AppWrapper>
    );
  }

  if (location.pathname === '/terms') {
    return (
      <AppWrapper {...wrapperProps}>
        <div className="min-h-screen w-full bg-brand-bg">
          <TermsOfService onBack={() => navigate('/')} />
        </div>
      </AppWrapper>
    );
  }

  if (location.pathname === '/contact') {
    return (
      <AppWrapper {...wrapperProps}>
        <div className="min-h-screen w-full bg-brand-bg">
          <Contact onBack={() => navigate('/')} />
        </div>
      </AppWrapper>
    );
  }

  if (location.pathname === '/refund-policy') {
    return (
      <AppWrapper {...wrapperProps}>
        <div className="min-h-screen w-full bg-brand-bg">
          <RefundPolicy onBack={() => navigate('/')} />
        </div>
      </AppWrapper>
    );
  }

  if (location.pathname === '/pricing') {
    return (
      <AppWrapper {...wrapperProps}>
        <div className="min-h-screen w-full bg-brand-bg">
          <PricingPage />
        </div>
      </AppWrapper>
    );
  }

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-green mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Standalone pages (no dashboard layout) - Legacy View Handling
  if (
    currentView === View.LANDING ||
    currentView === View.SIGN_IN ||
    currentView === View.SIGN_UP ||
    currentView === View.FORGOT_PASSWORD ||
    currentView === View.RESET_PASSWORD ||
    currentView === View.ONBOARDING
  ) {
    return <AppWrapper {...wrapperProps}><div className="min-h-screen w-full bg-brand-bg">{renderContent()}</div></AppWrapper>;
  }

  if (currentView === View.EDITOR) {
    return (
      <AppWrapper {...wrapperProps}>
        <div className="h-screen w-screen overflow-hidden bg-brand-bg font-sans text-brand-dark">
          {renderContent()}
        </div>
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onUpgrade={handleUpgrade}
          feature={paywallFeature}
          currentPlan={userSubscription.planId}
        />
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          onSelectPlan={handleSelectPlan}
          currentPlanId={userSubscription.planId}
        />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper {...wrapperProps}>
      <div className="flex h-screen w-screen overflow-hidden bg-brand-bg font-sans text-brand-dark">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        <aside className={`
          fixed md:relative z-50 h-full bg-brand-bg border-r border-brand-border transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full md:translate-x-0'}
          ${isSidebarCollapsed ? 'md:w-20' : 'md:w-72'}
          no-print flex flex-col
        `}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex absolute -right-3 top-10 bg-white border border-brand-border p-1.5 rounded-full shadow-sharp text-gray-400 hover:text-brand-green hover:border-brand-green transition-all duration-300 z-50"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <div className={`p-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <img src="/images/logo icon.png" alt="CV Architect" className="w-8 h-8 rounded-lg shadow-lg shadow-brand-dark/20 shrink-0" />
              <h1 className={`text-lg font-bold tracking-tight text-brand-dark whitespace-nowrap transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                CV Architect
              </h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1 rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
          </div>
          <nav className="px-3 space-y-2 flex-1 mt-4">
            <SidebarItem
              icon={<Home size={20} />}
              label="Overview"
              active={currentView === View.OVERVIEW}
              collapsed={isSidebarCollapsed}
              onClick={() => { setCurrentView(View.OVERVIEW); setIsMobileMenuOpen(false); }}
            />
            <SidebarItem
              icon={<Layout size={20} />}
              label="Templates"
              active={currentView === View.TEMPLATES}
              collapsed={isSidebarCollapsed}
              onClick={() => { setCurrentView(View.TEMPLATES); setIsMobileMenuOpen(false); }}
            />
            <SidebarItem
              icon={<Bookmark size={20} />}
              label="My Templates"
              active={currentView === View.MY_TEMPLATES}
              collapsed={isSidebarCollapsed}
              onClick={() => { setCurrentView(View.MY_TEMPLATES); setIsMobileMenuOpen(false); }}
            />
            <SidebarItem
              icon={<FileText size={20} />}
              label="Cover Letters"
              active={currentView === View.MY_COVER_LETTERS}
              collapsed={isSidebarCollapsed}
              onClick={() => { setCurrentView(View.MY_COVER_LETTERS); setIsMobileMenuOpen(false); }}
            />
            <SidebarItem
              icon={<SettingsIcon size={20} />}
              label="Settings"
              active={currentView === View.SETTINGS}
              collapsed={isSidebarCollapsed}
              onClick={() => { setCurrentView(View.SETTINGS); setIsMobileMenuOpen(false); }}
            />
          </nav>
          <div className="p-4 border-t border-brand-border bg-brand-secondary/30">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'flex-col space-y-3' : 'justify-between'}`}>
              <div className={`flex items-center gap-3 w-full ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-brand-dark text-brand-green flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  {userProfile?.full_name
                    ? userProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : user?.email?.slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div className={`flex-1 min-w-0 ${isSidebarCollapsed ? 'hidden' : ''}`}>
                  <p className="text-sm font-semibold text-brand-dark truncate">
                    {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userSubscription.planId === 'week_pass'
                      ? 'Career Sprint'
                      : userSubscription.planId === 'pro_monthly'
                        ? 'Career Marathon'
                        : userSubscription.planId === 'free'
                          ? 'Free Guest'
                          : 'Free Plan'}
                  </p>
                </div>
              </div>
              <button onClick={handleLogout} title="Logout" className={`flex items-center gap-2 p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-semibold ${isSidebarCollapsed ? 'w-full justify-center' : ''}`}>
                <LogOut size={16} />
                <span className={isSidebarCollapsed ? 'hidden' : ''}>Logout</span>
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 flex flex-col h-full w-full relative overflow-hidden bg-brand-bg transition-all duration-500">
          <header className="h-20 flex items-center justify-between px-8 no-print shrink-0 bg-brand-bg/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-brand-dark hover:bg-gray-100 rounded-md" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
              <div className="flex items-center text-sm text-gray-400">
                <span className="hover:text-brand-dark cursor-pointer transition-colors" onClick={() => setCurrentView(View.OVERVIEW)}>Home</span>
                <ChevronRight size={14} className="mx-2" />
                <span className="font-medium text-brand-dark capitalize">{currentView.toLowerCase().replace('_', ' ')}</span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-hidden relative">{renderContent()}</div>
        </main>
      </div>

      <TemplateOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onCheckUploadPermission={() => {
          const check = subscriptionManager.canUseFeature('resume_upload');
          if (!check.allowed) {
            setPaywallFeature('general');
            setShowPaywall(true);
            return false;
          }
          return true;
        }}
        onComplete={(data) => {
          console.log('Modal Onboarding complete:', data);
          setShowOnboardingModal(false);

          let newResumeData = { ...INITIAL_DATA };

          if (data.method === 'upload') {
            // Check access and deduct credits for resume upload
            const check = subscriptionManager.canUseFeature('resume_upload');
            if (!check.allowed) {
              setPaywallFeature('general'); // Or 'credits' for specific message?
              setShowPaywall(true);
              // Don't proceed to Editor if not allowed
              return;
            }

            // Try to deduct credit if authorized
            const previousCredits = subscriptionManager.getCreditBalance();
            const creditResult = subscriptionManager.deductCredit('resume_upload');
            if (!creditResult.success) {
              setPaywallFeature('credits');
              setShowPaywall(true);
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

            // Use parsed data from the uploaded resume
            newResumeData = {
              ...newResumeData,
              ...data.parsedData,
              // Ensure we keep the job title if it was parsed, otherwise fallback or use what was entered (if any)
              jobTitle: data.parsedData.jobTitle || data.role || "Professional Role",
            };

            // If experience was parsed, ensure IDs are unique
            if (newResumeData.experience) {
              newResumeData.experience = newResumeData.experience.map((exp: any, index: number) => ({
                ...exp,
                id: `exp_${Date.now()}_${index}`
              }));
            }

            showToast("Resume uploaded and analyzed successfully!");
            setResumeData(newResumeData); // Set resume data here for upload path

            // Trigger real AI Audit
            auditResume(newResumeData, data.role || "General").then(result => {
              setAuditResult(result);
            });

            // Auto-save the uploaded resume immediately
            handleSaveAs(newResumeData);

            setCurrentView(View.EDITOR);
          } else {
            // Scratch
            setResumeData({ ...INITIAL_DATA, jobTitle: data.role || "Professional Role" });
            setAuditResult(null);
            setCurrentView(View.EDITOR);
          }
        }}
      />
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={handleUpgrade}
        feature={paywallFeature}
        currentPlan={userSubscription.planId}
      />
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onSelectPlan={handleSelectPlan}
        currentPlanId={userSubscription.planId}
      />
      <CoverLetterModal
        isOpen={showCoverLetterModal}
        onClose={() => {
          setShowCoverLetterModal(false);
          setEditingCoverLetter(undefined);
        }}
        resumeData={resumeData}
        initialLetter={editingCoverLetter}
        onDeductCredit={() => {
          const result = subscriptionManager.deductCredit('cover_letter');
          if (result.success) {
            if (user) subscriptionService.deductCredits(user.id, 1).catch(console.error);
            setUserSubscription(subscriptionManager.getSubscription());
            return true;
          } else {
            setPaywallFeature('cover_letter');
            setShowPaywall(true);
            return false;
          }
        }}
        onDownload={() => { }}
      />
    </AppWrapper>
  );
}

const SidebarItem = ({ icon, label, active, collapsed, onClick }: { icon: React.ReactNode, label: string, active: boolean, collapsed: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group font-medium text-sm relative
      ${active ? 'bg-white text-brand-dark shadow-soft' : 'text-gray-500 hover:bg-white/50 hover:text-brand-dark'}
      ${collapsed ? 'justify-center' : ''}
    `}
  >
    {React.cloneElement(icon as React.ReactElement<any>, {
      className: `transition-colors duration-300 shrink-0 ${active ? 'text-brand-green' : 'text-gray-400 group-hover:text-brand-dark'}`
    })}
    <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
      {label}
    </span>
    {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_8px_rgba(112,224,152,0.6)]" />}
    {active && collapsed && <div className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_8px_rgba(112,224,152,0.6)]" />}
  </button>
);