import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const BANNER_STORAGE_KEY = 'cv_ai_maintenance_banner_dismissed';

export default function GlobalHeaderBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(BANNER_STORAGE_KEY);
      if (dismissed === 'true') {
        setIsVisible(false);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(BANNER_STORAGE_KEY, 'true');
    } catch (e) {
      // Ignore storage errors
    }
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-[100] bg-amber-500 text-amber-950 border-b border-amber-600/40 px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0 bg-amber-950/15 text-amber-950 px-2.5 py-0.5 rounded text-xs font-bold tracking-wide uppercase">
            <AlertTriangle size={13} className="shrink-0 text-amber-950" />
            <span>Notice</span>
          </div>

          <p className="font-medium truncate sm:whitespace-normal text-amber-950">
            <span className="font-bold">AI features are temporarily undergoing upgrades.</span>{' '}
            Manual resume editing, design customization, and PDF downloads remain 100% active and free to use.
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 rounded text-amber-950/70 hover:text-amber-950 hover:bg-amber-950/10 transition-colors shrink-0"
          title="Dismiss notice"
          aria-label="Dismiss notice"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
