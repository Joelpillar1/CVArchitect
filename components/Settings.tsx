import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, Bell, Shield, Zap, Crown, TrendingUp, Calendar, Download, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';
import { UserSubscription, PlanId } from '../types/pricing';
import { PLANS, CREDIT_PACKS } from '../utils/pricingConfig';
import { profileService } from '../services/profileService';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { saveToStorage, loadFromStorage, debouncedSaveToStorage } from '../utils/statePersistence';

interface SettingsProps {
  userSubscription: UserSubscription;
  onUpgrade: () => void;
  onCancelSubscription?: () => void;
  userProfile?: { full_name: string | null; avatar_url: string | null };
  userEmail?: string;
  onProfileUpdate?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToTerms?: () => void;
}

export const Settings = ({ userSubscription, onUpgrade, onCancelSubscription, userProfile, userEmail, onProfileUpdate, onNavigateToPrivacy, onNavigateToTerms }: SettingsProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  // Restore active tab from localStorage
  const [activeTab, setActiveTabState] = useState<'account' | 'subscription' | 'usage' | 'preferences'>(() => {
    return loadFromStorage<'account' | 'subscription' | 'usage' | 'preferences'>('settings_active_tab', 'account');
  });

  const setActiveTab = useCallback((tab: 'account' | 'subscription' | 'usage' | 'preferences') => {
    setActiveTabState(tab);
    saveToStorage('settings_active_tab', tab);
  }, []);

  // Parse user name from profile or email
  const fullName = userProfile?.full_name || userEmail?.split('@')[0] || 'User';
  const nameParts = fullName.split(' ');
  
  // Restore form fields from localStorage or use defaults
  const [firstName, setFirstNameState] = useState(() => {
    const saved = loadFromStorage<string>('settings_firstName', '');
    return saved || nameParts[0] || 'User';
  });
  const [lastName, setLastNameState] = useState(() => {
    const saved = loadFromStorage<string>('settings_lastName', '');
    return saved || nameParts.slice(1).join(' ') || '';
  });
  const [email, setEmailState] = useState(() => {
    return loadFromStorage<string>('settings_email', userEmail || 'user@example.com');
  });
  const [avatarUrl, setAvatarUrlState] = useState(() => {
    return loadFromStorage<string>('settings_avatarUrl', userProfile?.avatar_url || '');
  });

  // Wrapper functions that persist immediately
  const setFirstName = useCallback((name: string) => {
    setFirstNameState(name);
    debouncedSaveToStorage('settings_firstName', name, 500);
  }, []);

  const setLastName = useCallback((name: string) => {
    setLastNameState(name);
    debouncedSaveToStorage('settings_lastName', name, 500);
  }, []);

  const setEmail = useCallback((email: string) => {
    setEmailState(email);
    debouncedSaveToStorage('settings_email', email, 500);
  }, []);

  const setAvatarUrl = useCallback((url: string) => {
    setAvatarUrlState(url);
    debouncedSaveToStorage('settings_avatarUrl', url, 500);
  }, []);

  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Password change state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);


  // Update form when userProfile changes (but preserve user edits from localStorage)
  useEffect(() => {
    // Only update if we don't have saved values (first load)
    const savedFirstName = loadFromStorage<string>('settings_firstName', '');
    const savedLastName = loadFromStorage<string>('settings_lastName', '');
    const savedEmail = loadFromStorage<string>('settings_email', '');
    const savedAvatarUrl = loadFromStorage<string>('settings_avatarUrl', '');

    // Only update from userProfile if we don't have saved values
    if (userProfile?.full_name && !savedFirstName && !savedLastName) {
      const parts = userProfile.full_name.split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
    }
    if (userProfile?.avatar_url && !savedAvatarUrl) {
      setAvatarUrl(userProfile.avatar_url);
    }
    if (userEmail && !savedEmail) {
      setEmail(userEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, userEmail]); // Only depend on external props, not setters

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    creditAlerts: true,
    marketingEmails: false,
  });

  const plan = PLANS[userSubscription.planId];
  const isSprint = userSubscription.planId === 'week_pass';
  const isMarathon = userSubscription.planId === 'pro_monthly';
  const isFree = userSubscription.planId === 'free';

  const getPlanIcon = () => {
    if (isSprint) return <Zap className="text-brand-dark fill-current" size={24} />;
    if (isMarathon) return <Crown className="text-purple-600 fill-current" size={24} />;
    return <User className="text-gray-600" size={24} />;
  };

  const getPlanColor = () => {
    if (isSprint) return 'from-brand-green to-emerald-500 text-brand-dark';
    if (isMarathon) return 'from-purple-500 to-indigo-600 text-white';
    return 'from-gray-100 to-gray-200 text-gray-800'; // Free plan style
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaveError('');
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const fullNameValue = `${firstName.trim()} ${lastName.trim()}`.trim();

      await profileService.updateProfile(user.id, {
        full_name: fullNameValue || null,
      });

      setSaveSuccess(true);
      onProfileUpdate?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setSaveError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    const parts = (userProfile?.full_name || '').split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || '');
    setEmail(userEmail || '');
    setSaveError('');
    setSaveSuccess(false);
  };

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleChangePassword = async () => {
    if (!user) return;

    setPasswordError('');
    setPasswordSuccess(false);

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);

    try {
      // First, verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordError('Current password is incorrect');
        setIsChangingPassword(false);
        return;
      }

      // If current password is correct, update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    // Clear any previous errors
    setSaveError('');
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      // Delete user data and sign out
      await profileService.deleteUser(user.id);

      // The profileService.deleteUser already calls signOut internally
      // But we'll navigate to home page to ensure clean state
      window.location.href = '/';

    } catch (error: any) {
      console.error('Delete account error:', error);
      setSaveError('Failed to delete account. Please try again or contact support.');
      setIsSaving(false);
    }
  };



  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'usage', label: 'Usage', icon: TrendingUp },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="h-full bg-brand-bg overflow-y-auto">
      <div className="p-8 md:p-12 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-brand-dark tracking-tight mb-2">Settings</h2>
        <p className="text-gray-500 mb-8">Manage your account, subscription, and preferences</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'text-brand-dark border-b-2 border-brand-green'
                : 'text-gray-500 hover:text-brand-dark'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Success/Error Messages */}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <Check size={20} />
                <span>Profile updated successfully!</span>
              </div>
            )}
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                <X size={20} />
                <span>{saveError}</span>
              </div>
            )}

            <div className="bg-white shadow-soft rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-8 border-b border-brand-border">
                <h3 className="text-xl font-bold text-brand-dark">Profile Information</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Update your account's profile information and email address.</p>
              </div>
              <div className="p-8 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border-gray-200 border bg-brand-bg/30 px-4 py-3 text-brand-dark focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border-gray-200 border bg-brand-bg/30 px-4 py-3 text-brand-dark focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-xl border-gray-200 border bg-gray-100 px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
                    title="Email cannot be changed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white shadow-soft rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-8 border-b border-brand-border">
                <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                  <Shield size={20} />
                  Security
                </h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Manage your password and security settings.</p>
              </div>
              <div className="p-8 space-y-4">
                <button 
                  onClick={() => setShowChangePassword(true)}
                  className="w-full md:w-auto bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
                >
                  Change Password
                </button>
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you absolutely sure? This action cannot be undone and will permanently delete your account and all data.')) {
                        handleDeleteAccount();
                      }
                    }}
                    disabled={isSaving}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setPasswordSuccess(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold text-brand-dark mb-2">Change Password</h3>
              <p className="text-sm text-gray-500 mb-6">Enter your current password and choose a new one.</p>

              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                  <Check size={20} />
                  <span>Password changed successfully!</span>
                </div>
              )}

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                  <X size={20} />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border-gray-200 border bg-brand-bg/30 px-4 py-3 pr-12 text-brand-dark focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                      placeholder="Enter current password"
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border-gray-200 border bg-brand-bg/30 px-4 py-3 pr-12 text-brand-dark focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                      placeholder="Enter new password"
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border-gray-200 border bg-brand-bg/30 px-4 py-3 pr-12 text-brand-dark focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                      placeholder="Confirm new password"
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="flex-1 bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Changing...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Change Password
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError('');
                      setPasswordSuccess(false);
                    }}
                    disabled={isChangingPassword}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white shadow-soft rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-8 border-b border-brand-border">
                <h3 className="text-xl font-bold text-brand-dark">Current Plan</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Manage your subscription and billing.</p>
              </div>
              <div className="p-8">
                <div className={`p-6 bg-gradient-to-r ${getPlanColor()} rounded-xl text-white mb-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        {getPlanIcon()}
                      </div>
                      <div>
                        <p className="font-bold text-2xl">{plan?.name || 'Current Plan'}</p>
                        <p className="text-white/80 text-sm">
                          {isFree && 'Free Forever'}
                          {isSprint && '$9 / 7 days'}
                          {isMarathon && '$19 / month'}
                        </p>
                      </div>
                    </div>
                    {!isFree && (
                      <div className="text-right">
                        <p className="text-sm text-white/80">{isSprint ? 'Expires on' : 'Renews on'}</p>
                        <p className="font-semibold">{formatDate(userSubscription.subscriptionEnd)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Credits</p>
                    <p className="text-2xl font-bold text-brand-dark">
                      {(isSprint || isMarathon) ? 'Unlimited' : userSubscription.credits}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Member Since</p>
                    <p className="text-2xl font-bold text-brand-dark">
                      {formatDate(userSubscription.subscriptionStart)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      if (!user) return;
                      try {
                        const sub = await subscriptionService.getSubscription(user.id);
                        if (sub) {
                          // Force refresh subscription in parent component
                          window.location.reload();
                        }
                      } catch (err) {
                        console.error('Error refreshing subscription:', err);
                      }
                    }}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                    title="Refresh subscription status"
                  >
                    Refresh Status
                  </button>
                  
                  {isFree && (
                    <button
                      onClick={onUpgrade}
                      className="bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 text-brand-dark px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg"
                    >
                      Upgrade Plan
                    </button>
                  )}

                  {isSprint && (
                    <button
                      onClick={onUpgrade}
                      className="bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
                    >
                      Extenth Sprint / Upgrade
                    </button>
                  )}

                  {isMarathon && (
                    <>
                      <button
                        onClick={onUpgrade}
                        className="border border-brand-green text-brand-dark px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-green/10 transition-colors"
                      >
                        Change Plan
                      </button>
                      <button
                        onClick={onCancelSubscription}
                        className="border border-red-300 text-red-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Credit Packs removed */}
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div className="bg-white shadow-soft rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-8 border-b border-brand-border">
                <h3 className="text-xl font-bold text-brand-dark">Usage Statistics</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Track your AI feature usage and activity.</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600 font-semibold mb-2">Total AI Actions</p>
                    <p className="text-4xl font-bold text-blue-700">{userSubscription.usageStats?.totalActions || 0}</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600 font-semibold mb-2">Credits Used</p>
                    <p className="text-4xl font-bold text-green-700">
                      {userSubscription.usageStats?.totalCreditsUsed || 0}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <p className="text-sm text-purple-600 font-semibold mb-2">Credits Remaining</p>
                    <p className="text-4xl font-bold text-purple-700">
                      {(isSprint || isMarathon) ? '∞' : userSubscription.credits}
                    </p>
                  </div>
                </div>

                <h4 className="font-bold text-brand-dark mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {userSubscription.usageHistory.slice(0, 10).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-green/20 rounded-lg flex items-center justify-center">
                          <Zap size={18} className="text-brand-green" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark text-sm">{record.action.replace(/_/g, ' ').toUpperCase()}</p>
                          <p className="text-xs text-gray-500">{new Date(record.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">-{record.creditsCost} credit{record.creditsCost !== 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-500">{record.remainingCredits} remaining</p>
                      </div>
                    </div>
                  ))}
                  {userSubscription.usageHistory.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No activity yet. Start using AI features!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="bg-white shadow-soft rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-8 border-b border-brand-border">
                <h3 className="text-xl font-bold text-brand-dark">Notifications</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Manage your notification preferences.</p>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-brand-dark">Email Updates</p>
                    <p className="text-sm text-gray-500">Receive updates about new features and improvements</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, emailUpdates: !notifications.emailUpdates })}
                    className={`w-12 h-6 rounded-full transition-all ${notifications.emailUpdates ? 'bg-brand-green' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notifications.emailUpdates ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-brand-dark">Credit Alerts</p>
                    <p className="text-sm text-gray-500">Get notified when your credits are running low</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, creditAlerts: !notifications.creditAlerts })}
                    className={`w-12 h-6 rounded-full transition-all ${notifications.creditAlerts ? 'bg-brand-green' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notifications.creditAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-brand-dark">Marketing Emails</p>
                    <p className="text-sm text-gray-500">Receive promotional offers and tips</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })}
                    className={`w-12 h-6 rounded-full transition-all ${notifications.marketingEmails ? 'bg-brand-green' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notifications.marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-soft rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-8 border-b border-brand-border">
                <h3 className="text-xl font-bold text-brand-dark">Data & Privacy</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Manage your data and privacy settings.</p>
              </div>
              <div className="p-8 space-y-4">
                <button className="w-full md:w-auto flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                  <Download size={16} />
                  Export My Data
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      handleDeleteAccount();
                    }
                  }}
                  disabled={isSaving}
                  className="w-full md:w-auto flex items-center gap-2 border border-red-300 text-red-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete All My Data
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white shadow-soft rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-8 border-b border-brand-border">
                <h3 className="text-xl font-bold text-brand-dark">Legal</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Review our legal terms and policies.</p>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      if (onNavigateToTerms) {
                        onNavigateToTerms();
                      } else {
                        navigate('/terms');
                      }
                    }}
                    className="text-brand-dark hover:text-brand-green font-medium underline transition-colors"
                  >
                    Terms of Service
                  </button>
                  <button
                    onClick={() => {
                      if (onNavigateToPrivacy) {
                        onNavigateToPrivacy();
                      } else {
                        navigate('/privacy');
                      }
                    }}
                    className="text-brand-dark hover:text-brand-green font-medium underline transition-colors"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};