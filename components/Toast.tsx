import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'error': return <AlertCircle size={20} className="text-red-500" />;
      case 'info': return <Info size={20} className="text-blue-400" />;
      default: return <CheckCircle size={20} className="text-brand-green" />;
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-fadeIn">
      <div className="flex items-center gap-3 bg-brand-dark text-white px-6 py-4 rounded-full shadow-2xl border border-white/10">
        {getIcon()}
        <span className="font-semibold text-sm">{message}</span>
      </div>
    </div>
  );
}
