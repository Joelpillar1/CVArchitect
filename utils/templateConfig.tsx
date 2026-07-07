import React from 'react';
import {
    LayoutTemplate,
    Briefcase,
    GraduationCap,
    Code,
    Palette,
    LineChart,
    Building2,
    User,
    Award,
    PenTool,
    BookOpen,
    Landmark,
    Leaf,
    Zap,
    Anchor,
    Feather,
    Gem,
    Megaphone,
    Crown
} from 'lucide-react';
import { TemplateType } from '../types';

/** Legacy FreshGrad IDs mapped to the two consolidated layouts */
export const FRESHGRAD_ACADEMIC_IDS: TemplateType[] = [
    'freshgrad1',
    'freshgrad2',
    'freshgrad4',
    'freshgrad5',
    'freshgrad6',
];

export const FRESHGRAD_MODERN_IDS: TemplateType[] = [
    'freshgrad3',
    'freshgrad7',
    'freshgrad8',
];

export const FRESHGRAD_GALLERY_IDS: TemplateType[] = ['freshgrad1', 'freshgrad8'];

export function isFreshGradTemplate(id: TemplateType): boolean {
    return FRESHGRAD_ACADEMIC_IDS.includes(id) || FRESHGRAD_MODERN_IDS.includes(id);
}

export function isFreshGradAcademic(id: TemplateType): boolean {
    return FRESHGRAD_ACADEMIC_IDS.includes(id);
}

export const TEMPLATE_CONFIG: { id: TemplateType; name: string; subtitle: string; icon: React.ReactNode; bg: string }[] = [
    {
        id: 'student',
        name: "Student Profile",
        subtitle: "Student",
        icon: <BookOpen className="text-blue-500" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'free',
        name: "CareerCraft",
        subtitle: "Entry Level",
        icon: <User className="text-gray-600" size={20} />,
        bg: "bg-[#FAFAFA]"
    },
    {
        id: 'freshgrad1',
        name: "Campus Classic",
        subtitle: "Academic",
        icon: <GraduationCap className="text-emerald-600" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'freshgrad8',
        name: "Campus Modern",
        subtitle: "Graduate",
        icon: <Briefcase className="text-indigo-700" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'simplepro',
        name: "SimplePro",
        subtitle: "Professional",
        icon: <Briefcase className="text-orange-500" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'vanguard',
        name: "The Vanguard",
        subtitle: "Modern Tech",
        icon: <Zap className="text-blue-600" size={20} />,
        bg: "bg-[#F8F8F8]"
    },
    {
        id: 'elevate',
        name: "Elevate",
        subtitle: "Corporate",
        icon: <Building2 className="text-gray-700" size={20} />,
        bg: "bg-[#FDFDFD]"
    },
    {
        id: 'prime',
        name: "Prime Profile",
        subtitle: "Executive",
        icon: <Crown className="text-amber-500" size={20} />,
        bg: "bg-[#FFFEFA]"
    },
    {
        id: 'impact',
        name: "Impact",
        subtitle: "Compact",
        icon: <Award className="text-red-600" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'dev',
        name: "DevPro",
        subtitle: "Developer",
        icon: <Code className="text-slate-700" size={20} />,
        bg: "bg-[#F8FAFC]"
    },
    {
        id: 'elite',
        name: "Elite Pro",
        subtitle: "International",
        icon: <Gem className="text-purple-600" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'apex',
        name: "Apex Exec",
        subtitle: "Senior Leader",
        icon: <Anchor className="text-navy-600" size={20} />,
        bg: "bg-[#FAFAFA]"
    },
    {
        id: 'modern',
        name: "Modern",
        subtitle: "Contemporary",
        icon: <LayoutTemplate className="text-teal-600" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'executive',
        name: "Executive",
        subtitle: "C-Suite",
        icon: <Building2 className="text-slate-800" size={20} />,
        bg: "bg-[#FAFAFA]"
    },
    {
        id: 'classic',
        name: "Classic",
        subtitle: "Traditional",
        icon: <BookOpen className="text-gray-600" size={20} />,
        bg: "bg-[#F8F8F8]"
    },
    {
        id: 'wonsulting',
        name: "Ivy League",
        subtitle: "Academic",
        icon: <Landmark className="text-emerald-700" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'styled',
        name: "Styled",
        subtitle: "Sophisticated",
        icon: <PenTool className="text-blue-700" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'smart',
        name: "Smart",
        subtitle: "Research",
        icon: <BookOpen className="text-indigo-600" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'elegant',
        name: "Elegant",
        subtitle: "Refined",
        icon: <Feather className="text-slate-600" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'minimalist',
        name: "Minimalist",
        subtitle: "Clean",
        icon: <LayoutTemplate className="text-gray-400" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'twocolumn',
        name: "Two Column Pro",
        subtitle: "Sidebar",
        icon: <LayoutTemplate className="text-slate-600" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'professional',
        name: "Pro Clean",
        subtitle: "Standard",
        icon: <Briefcase className="text-blue-500" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'sage',
        name: "Sage",
        subtitle: "Expert",
        icon: <Feather className="text-green-700" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
    {
        id: 'rezi',
        name: "CVArchitect Pro",
        subtitle: "ATS Serif",
        icon: <BookOpen className="text-teal-600" size={20} />,
        bg: "bg-[#FFFFFF]"
    },
];

export const getTemplateMetadata = (id: TemplateType) => {
    return TEMPLATE_CONFIG.find(t => t.id === id) || TEMPLATE_CONFIG[0];
};
