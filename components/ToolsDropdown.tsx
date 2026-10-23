import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FREE_TOOLS = [
    {
        label: 'Action Words for Resume',
        link: '/action-words',
        description: 'High-impact action verbs and examples for your resume.'
    },
    {
        label: 'Resume Match Checker',
        link: '/resume-checker',
        description: 'Scan your resume against any job description.'
    }
];

interface ToolsDropdownProps {
    isMobile?: boolean;
    onClose?: () => void;
}

export default function ToolsDropdown({ isMobile, onClose }: ToolsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        if (path.startsWith('/#')) {
            const currentIsCvArchitect = window.location.pathname === '/cvarchitect';
            const targetBase = currentIsCvArchitect ? '/cvarchitect' : '/';
            navigate(targetBase);
            setTimeout(() => {
                const id = path.substring(2);
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
            navigate(path);
        }
        if (onClose) onClose();
        setIsOpen(false);
    };

    if (isMobile) {
        return (
            <div>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full text-lg font-bold text-brand-dark py-2"
                >
                    Free Tools
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-brand-bg/50 rounded-xl mt-2"
                        >
                            <div className="flex flex-col p-2">
                                {FREE_TOOLS.map((tool, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleNavigation(tool.link)}
                                        className="flex items-center justify-between p-3 text-sm font-bold text-gray-700 hover:text-brand-green text-left rounded-lg transition-colors"
                                    >
                                        <span>{tool.label}</span>
                                        <ArrowRight size={14} className="text-brand-green" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div 
            className="relative group"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors py-2">
                Free Tools
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full w-[360px] pt-4 z-50 pointer-events-auto"
                    >
                        <div className="bg-white rounded-2xl shadow-float border border-brand-border overflow-hidden">
                            <div className="p-2 flex flex-col gap-1">
                                {FREE_TOOLS.map((tool, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleNavigation(tool.link)}
                                        className="p-3.5 rounded-xl hover:bg-brand-secondary transition-all text-left group/item border border-transparent hover:border-brand-border"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-bold text-brand-dark text-sm mb-1 flex items-center justify-between">
                                                <span>{tool.label}</span>
                                                <ArrowRight
                                                    size={14}
                                                    className="text-brand-green opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0"
                                                />
                                            </p>
                                            <p className="text-xs text-gray-500 leading-relaxed font-normal">
                                                {tool.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
