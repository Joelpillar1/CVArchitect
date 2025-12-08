import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIEnhanceButtonProps {
    onEnhance: () => Promise<void>;
    label?: string;
    size?: 'sm' | 'md';
    className?: string;
}

export default function AIEnhanceButton({
    onEnhance,
    label = 'Enhance with AI',
    size = 'sm',
    className = ''
}: AIEnhanceButtonProps) {
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleClick = async () => {
        setIsEnhancing(true);
        try {
            await onEnhance();
        } catch (error) {
            console.error('Enhancement failed:', error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const sizeClasses = size === 'sm'
        ? 'px-2 py-1 text-xs'
        : 'px-3 py-2 text-sm';

    return (
        <button
            onClick={handleClick}
            disabled={isEnhancing}
            className={`
        inline-flex items-center gap-1.5 rounded-lg font-medium
        bg-brand-green text-brand-dark
        hover:bg-brand-greenHover
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 shadow-sm hover:shadow-md
        ${sizeClasses} ${className}
      `}
            title="Use AI to enhance this content"
        >
            {isEnhancing ? (
                <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Enhancing...</span>
                </>
            ) : (
                <>
                    <Sparkles size={14} />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}
