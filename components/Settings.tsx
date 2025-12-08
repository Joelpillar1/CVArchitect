import React, { useState, useEffect } from 'react';
import { User, CreditCard, Bell, Shield, Zap, Crown, TrendingUp, Calendar, Download, Trash2, Check, X } from 'lucide-react';
import { UserSubscription, PlanId } from '../types/pricing';
import { PLANS, CREDIT_PACKS } from '../utils/pricingConfig';
import { profileService } from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'subscription' | 'usage' | 'preferences'>('account');

  // Parse user name from profile or email
  const fullName = userProfile?.full_name || userEmail?.split('@')[0] || 'User';
  const nameParts = fullName.split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || 'User');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [email, setEmail] = useState(userEmail || 'user@example.com');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || '');

  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');


  // Update form when userProfile changes
  useEffect(() => {
    if (userProfile?.full_name) {
      const parts = userProfile.full_name.split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
    }
    if (userProfile?.avatar_url) {
      setAvatarUrl(userProfile.avatar_url);
    }
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userProfile, userEmail]);

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    creditAlerts: true,
    marketingEmails: false,
  });

  const plan = PLANS[userSubscription.planId];
  const isPro = userSubscription.planId === 'pro_quarterly';
  const isLifetime = userSubscription.planId === 'lifetime';
  const isFree = userSubscription.planId === 'free';

  const getPlanIcon = () => {
    if (isPro) return <Crown className="text-purple-600 fill-current" size={24} />;
    if (isLifetime) return <Zap className="text-amber-600 fill-current" size={24} />;
    return <TrendingUp className="text-blue-600" size={24} />;
  };

  const getPlanColor = () => {
    if (isPro) return 'from-purple-500 to-purple-600';
    if (isLifetime) return 'from-amber-500 to-orange-500';
    return 'from-blue-500 to-blue-600';
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

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await profileService.deleteUser(user.id);
      // Trigger logout via handleCancelSubscription or similar if passed, 
      // but ideally we should just force logout.
      // Since we don't have a direct onLogout prop here, we can rely on auth context changes 
      // or simple reload if the user is deleted on backend.
      // But typically, we should call a prop to clean up app state.
      // For now, we will call onCancelSubscription which is likely mapped to logout/cleanup 
      // or simply rely on the fact that without a valid user row, subsequent calls fail.

      // Best approach: Reload to clear state/trigger auth check
      window.location.reload();

    } catch (error: any) {
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
    <div className="h-screen bg-brand-bg overflow-y-auto">
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

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                <button className="w-full md:w-auto bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors">
                  Change Password
                </button>
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you absolutely sure? This action cannot be undone and will permanently delete your account and all data.')) {
                        // Perform deletion
                        // Since we need async context, we'll do:
                        handleDeleteAccount();
                      }
                    }}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Account
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
                        <p className="font-bold text-2xl">{plan?.name}</p>
                        <p className="text-white/80 text-sm">
                          {isFree && 'Free Forever'}
                          {isPro && (userSubscription.billingCycle === 'yearly' ? '$144/year' : '$19/mo')}
                          {isLifetime && 'One-time payment of $97'}
                          {!isFree && !isPro && !isLifetime && (userSubscription.billingCycle === 'yearly' ? '$72/year' : '$9/mo')}
                        </p>
                      </div>
                    </div>
                    {!isFree && !isLifetime && (
                      <div className="text-right">
                        <p className="text-sm text-white/80">Renews on</p>
                        <p className="font-semibold">{formatDate(userSubscription.subscriptionEnd)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Credits</p>
                    <p className="text-2xl font-bold text-brand-dark">
                      {isPro ? 'Unlimited' : userSubscription.credits}
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
                  {isFree && (
                    <button
                      onClick={onUpgrade}
                      className="bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 text-brand-dark px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg"
                    >
                      Upgrade to Pro
                    </button>
                  )}
                  {!isFree && !isLifetime && (
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
                  {isLifetime && (
                    <button
                      onClick={onUpgrade}
                      className="bg-brand-dark text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
                    >
                      Buy More Credits
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Credit Packs (for non-Pro users) */}
            {!isPro && (
              <div className="bg-white shadow-soft rounded-2xl border border-brand-border overflow-hidden">
                <div className="p-8 border-b border-brand-border">
                  <h3 className="text-xl font-bold text-brand-dark">Credit Packs</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Purchase additional credits for AI features.</p>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CREDIT_PACKS.map((pack) => (
                      <div key={pack.credits} className="border-2 border-gray-200 rounded-xl p-6 hover:border-brand-green transition-all">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-2">{pack.label}</p>
                          <p className="text-4xl font-bold text-brand-dark mb-2">{pack.credits}</p>
                          <p className="text-sm text-gray-600 mb-4">credits</p>
                          <p className="text-2xl font-bold text-brand-green mb-4">${pack.price}</p>
                          <button className="w-full bg-brand-green text-brand-dark py-2 rounded-lg font-semibold hover:bg-green-600 transition-all">
                            Purchase
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                      {isPro ? '∞' : userSubscription.credits}
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
                <button className="w-full md:w-auto flex items-center gap-2 border border-red-300 text-red-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                  Delete All My Data
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
                    onClick={onNavigateToTerms}
                    className="text-brand-dark hover:text-brand-green font-medium underline transition-colors"
                  >
                    Terms of Service
                  </button>
                  <button
                    onClick={onNavigateToPrivacy}
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