import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Briefcase,
} from 'lucide-react';
import EditorHeroPreview from './EditorHeroPreview';
import JobsHeroPreview from './JobsHeroPreview';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type NotchTab = 'editor' | 'jobs';

interface TabConfig {
  id: NotchTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { id: 'editor', label: 'Create Resume', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'jobs', label: 'Job Search', icon: <Briefcase className="w-3.5 h-3.5" /> },
];

export default function NotchHeroPreview() {
  const [activeTab, setActiveTab] = useState<NotchTab>('editor');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAction = () => {
    navigate(user ? '/dashboard' : '/signup?redirect=/dashboard');
  };

  return (
    <div className="relative w-full max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-2rem)] xl:max-w-[1460px] 2xl:max-w-[1580px] mx-auto mt-10 md:mt-14 mb-16">
      {/* Top Floating Notch Container */}
      <div className="relative z-20 flex justify-center -mb-5 sm:-mb-6">
        <div className="bg-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-full border border-gray-200/90 flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[95vw] scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-brand-dark font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNotchTab"
                    className="absolute inset-0 bg-brand-green rounded-full"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenic Meadow Frame Container (Flat, No Heavy Shadow) */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 p-4 sm:p-6 md:p-8 lg:p-10 min-h-[500px] sm:min-h-[600px] flex items-center justify-center">
        {/* Scenic Background (Nature meadow with flowers & blue sky) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85')`,
            backgroundColor: '#60A5FA',
          }}
        >
          {/* Subtle atmospheric ambient gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-emerald-600/20" />
        </div>

        {/* Central Window / Card (Equal uniform margins on all sides) */}
        <div className="relative z-10 w-full mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-xl border border-white/90 overflow-hidden"
          >
            {/* Window Content based on selected tab */}
            <div className="relative bg-white min-h-[380px] sm:min-h-[480px]">
              {activeTab === 'editor' && (
                <div className="w-full">
                  <EditorHeroPreview />
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="w-full">
                  <JobsHeroPreview />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
