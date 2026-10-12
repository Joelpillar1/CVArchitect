import React from 'react';

export interface LoaderProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'light' | 'contrast' | 'white';
    className?: string;
    style?: React.CSSProperties;
}

export const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    variant = 'default',
    className = '',
    style,
}) => {
    const sizeClass = {
        xs: 'loader-xs',
        sm: 'loader-sm',
        md: 'loader-md',
        lg: 'loader-lg',
        xl: 'loader-xl',
    }[size];

    const variantClass = {
        default: '',
        light: 'loader-light',
        contrast: 'loader-contrast',
        white: 'loader-white',
    }[variant];

    return (
        <span
            className={`loader ${sizeClass} ${variantClass} ${className}`.trim()}
            style={style}
            aria-label="Loading"
            role="status"
        />
    );
};

export interface LoadingScreenProps {
    message?: string;
    description?: string;
    size?: 'md' | 'lg' | 'xl';
    fullScreen?: boolean;
    className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = 'Preparing your workspace...',
    description = 'Setting up your templates and drafts',
    size = 'lg',
    fullScreen = true,
    className = '',
}) => {
    return (
        <div
            className={`${
                fullScreen ? 'min-h-screen min-h-[100dvh] w-full' : 'w-full py-8 sm:py-12'
            } flex items-center justify-center bg-brand-bg px-4 py-6 sm:px-6 sm:py-10 transition-all ${className}`.trim()}
            role="status"
            aria-live="polite"
        >
            <div className="flex flex-col items-center justify-center text-center max-w-sm w-full mx-auto select-none animate-fadeIn">
                <div className="flex items-center justify-center p-2 mb-1">
                    <Loader size={size} />
                </div>
                {message && (
                    <h2 className="mt-4 text-base sm:text-lg font-bold text-brand-dark tracking-tight">
                        {message}
                    </h2>
                )}
                {description && (
                    <p className="mt-1.5 text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-xs sm:max-w-sm">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Loader;
