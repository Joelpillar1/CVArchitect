import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Target, FileSearch, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FREE_TOOLS = [
    {
        label: 'Action Words for Resume',
        link: '/action-words',
        description: 'High-impact action verbs and examples for your resume.',
        icon: Sparkles
    },
    {
        label: 'Resume Match Checker',
        link: '/resume-checker',
        description: 'Scan your resume against any job description.',
        icon: Target
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
            navigate('/');
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
                                        className="flex items-center gap-3 p-3 text-sm font-bold text-gray-700 hover:text-brand-green text-left"
                                    >
                                        <tool.icon size={16} className="text-brand-green" />
                                        {tool.label}
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
                        className="absolute left-1/2 -translate-x-1/2 top-full w-[480px] pt-4 z-50 pointer-events-auto"
                    >
                        <div className="bg-white rounded-2xl shadow-float border border-brand-border overflow-hidden">
                            <div className="grid grid-cols-2 p-4 gap-2 bg-slate-50/50">
                                {FREE_TOOLS.map((tool, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleNavigation(tool.link)}
                                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-all text-left group/item border border-transparent hover:border-brand-border hover:shadow-sm"
                                    >
                                        <div className="p-2.5 bg-white rounded-lg border border-brand-border text-brand-green group-hover/item:scale-110 transition-transform shadow-sm">
                                            <tool.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-dark text-sm mb-1">{tool.label}</p>
                                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium line-clamp-2">{tool.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="px-6 py-4 bg-white border-t border-brand-border flex items-center justify-between">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Free Career Resources</p>
                                <button 
                                    onClick={() => handleNavigation('/blog')}
                                    className="text-xs font-bold text-brand-green hover:text-brand-greenHover flex items-center gap-1.5 transition-all"
                                >
                                    View all resources
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
