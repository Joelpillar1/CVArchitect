import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout, FileText, Settings as SettingsIcon, Home, ChevronRight, ChevronLeft, Menu, X, LogOut, Bookmark } from 'lucide-react';
import { ResumeData, INITIAL_DATA, TemplateType, SavedTemplate } from '../types';
import Editor from '../components/Editor';
import Overview from '../components/Overview';
import Templates from '../components/Templates';
import { Settings } from '../components/Settings';
import MyTemplates from '../components/MyTemplates';
import Onboarding from '../components/Onboarding';
import TemplateOnboardingModal from '../components/TemplateOnboardingModal';
import PaywallModal from '../components/PaywallModal';
import PricingModal from '../components/PricingModal';
import { UserSubscription, PlanId } from '../types/pricing';
import { SubscriptionManager, createDefaultSubscription, upgradePlan } from '../utils/subscriptionManager';
import { subscriptionService } from '../services/subscriptionService';
import { canAccessTemplate, PLANS } from '../utils/pricingConfig';
import { auditResume } from '../components/utils/aiEnhancer';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { resumeService } from '../services/resumeService';
import { profileService, UserProfile } from '../services/profileService';
import MyCoverLetters from '../components/MyCoverLetters';
import { coverLetterService, SavedCoverLetter } from '../services/coverLetterService';
import CoverLetterModal from '../components/CoverLetterModal';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // State management
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

    // Subscription State
    const [userSubscription, setUserSubscription] = useState<UserSubscription>(
        createDefaultSubscription('user_' + Date.now())
    );
    const [showPaywall, setShowPaywall] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [paywallFeature, setPaywallFeature] = useState<'templates' | 'job-match' | 'general' | 'credits' | 'export'>('general');

    // TODO: Move all the logic from App.tsx here
    // This is a placeholder - we'll migrate the full logic in the next step

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
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
                    <NavItem icon={<Bookmark size={20} />} label="My Resumes" to="/dashboard/my-resumes" collapsed={isSidebarCollapsed} />
                    <NavItem icon={<FileText size={20} />} label="Editor" to="/dashboard/editor" collapsed={isSidebarCollapsed} />
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

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={
                        <Overview
                            onCreateNew={() => navigate('/dashboard/templates')}
                            savedTemplates={savedTemplates}
                            onLoadTemplate={(template) => console.log('Load:', template)}
                            onDeleteTemplate={(id) => console.log('Delete:', id)}
                            userName={user?.user_metadata?.full_name || user?.email}
                            userSubscription={userSubscription}
                        />
                    } />
                    <Route path="/templates" element={
                        <Templates
                            onSelect={(template) => {
                                setSelectedTemplate(template);
                                navigate('/dashboard/editor');
                            }}
                            data={resumeData}
                        />
                    } />
                    <Route path="/my-resumes" element={
                        <MyTemplates
                            templates={savedTemplates}
                            onLoadTemplate={(template) => console.log('Load:', template)}
                            onDeleteTemplate={(id) => console.log('Delete:', id)}
                        />
                    } />
                    <Route path="/editor" element={
                        <Editor
                            data={resumeData}
                            onChange={setResumeData}
                            template={selectedTemplate}
                            onTemplateChange={setSelectedTemplate}
                            onBack={() => navigate('/dashboard')}
                            onAIAction={() => true}
                            onJobMatchCheck={() => true}
                            onSave={() => console.log('Save')}
                        />
                    } />
                    <Route path="/settings" element={
                        <Settings
                            userSubscription={userSubscription}
                            onUpgrade={() => setShowPricingModal(true)}
                        />
                    } />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>

            {/* Modals */}
            {showPaywall && (
                <PaywallModal
                    isOpen={showPaywall}
                    onClose={() => setShowPaywall(false)}
                    onUpgrade={() => {
                        setShowPaywall(false);
                        setShowPricingModal(true);
                    }}
                    feature={paywallFeature}
                    currentPlan={userSubscription.planId}
                />
            )}

            {showPricingModal && (
                <PricingModal
                    isOpen={showPricingModal}
                    onClose={() => setShowPricingModal(false)}
                    onSelectPlan={(planId, billingCycle) => {
                        // Handle plan selection
                        console.log('Selected plan:', planId, billingCycle);
                    }}
                    currentPlanId={userSubscription.planId}
                />
            )}
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
