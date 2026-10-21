import React from 'react';
import { ResumeData } from '../../types';
import { GeneratedCoverLetter } from '../utils/aiEnhancer';
import { Check } from 'lucide-react';
import { parseCoverLetterBlocks, RenderCoverLetterBlocks } from './coverLetterFormatter';

interface StructuredCoverLetterProps {
    data: ResumeData;
    content: GeneratedCoverLetter; // Expects the full structured object
    companyName?: string;
    jobTitle?: string;
    fontSize?: number;
    lineSpacing?: number;
    spacing?: 'compact' | 'normal' | 'spacious';
    fontFamily?: 'sans' | 'serif' | 'mono' | 'merriweather';
    isStreaming?: boolean;
}

export default function StructuredCoverLetter({
    data,
    content,
    companyName,
    jobTitle,
    fontSize,
    lineSpacing,
    spacing = 'normal',
    fontFamily = 'merriweather',
    isStreaming = false
}: StructuredCoverLetterProps) {
    const { opening, skills, closing } = content.structured || { opening: '', skills: [], closing: '' };
    const isFallback = !skills || skills.length === 0;

    const fallbackBlocks = parseCoverLetterBlocks(content.plainText, data.fullName);
    const openingBlocks = opening ? parseCoverLetterBlocks(opening, data.fullName) : [];
    const closingBlocks = closing ? parseCoverLetterBlocks(closing, data.fullName) : [];

    const headlineSkills = data.skills
        ? data.skills.split(',').slice(0, 3).map(s => s.trim())
        : ['Professional', 'Experienced', 'Dedicated'];

    const todayDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const paddingClass = spacing === 'compact' ? 'p-[16mm_16mm]' : spacing === 'spacious' ? 'p-[28mm_24mm]' : 'p-[24mm_22mm]';
    const fontClass = (fontFamily === 'merriweather' || fontFamily === 'serif') ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans';

    return (
        <div 
            className={`w-[210mm] min-h-[297mm] bg-white text-gray-900 ${fontClass} mx-auto relative flex flex-col justify-between box-border ${paddingClass} shadow-xs`}
            style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
            <div>
                {/* Header */}
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold uppercase mb-2 text-black font-sans tracking-wider">
                        {data.fullName}
                    </h1>

                    <div className="flex justify-center items-center flex-wrap gap-x-3 text-xs text-gray-700 mb-3.5">
                        {data.phone && <span>{data.phone}</span>}
                        {data.email && (
                            <>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-700">{data.email}</span>
                            </>
                        )}
                        {data.linkedin && (
                            <>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-700">LinkedIn</span>
                            </>
                        )}
                        {(data.location || data.address) && (
                            <>
                                <span className="text-gray-300">•</span>
                                <span>{data.location || data.address}</span>
                            </>
                        )}
                    </div>

                    <div className="w-full h-1 bg-black mb-3.5"></div>

                    <div className="flex justify-center items-center flex-wrap gap-x-4 text-xs font-bold text-black uppercase tracking-wider">
                        {headlineSkills.map((skill, i) => (
                            <React.Fragment key={i}>
                                <span>{skill}</span>
                                {i < headlineSkills.length - 1 && <span className="text-gray-400">•</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </header>

                {/* Date & Recipient Details */}
                <div className="text-xs text-gray-600 mb-5 space-y-1">
                    <p className="font-medium text-gray-800">{todayDate}</p>
                    <p className="font-bold text-gray-900 mt-2">{companyName || 'Hiring Team'}</p>
                    <p className="text-gray-500">{jobTitle ? `Application for ${jobTitle}` : 'Employment Application'}</p>
                </div>

                {/* Body */}
                <div 
                    className={`text-left text-[13.5px] text-gray-800 ${fontClass}`}
                    style={{
                        fontSize: fontSize ? `${fontSize}pt` : undefined,
                        lineHeight: lineSpacing ? `${lineSpacing}` : undefined
                    }}
                >
                    {(!content.plainText?.trim() && !opening?.trim() && isStreaming) ? (
                        <div className="space-y-3.5 py-3 animate-pulse">
                            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50/90 px-3.5 py-2 rounded-lg border border-slate-200/80 mb-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                                <span>Tailoring your experience for {companyName || 'this role'}...</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-sm w-11/12"></div>
                            <div className="h-3 bg-slate-100 rounded-sm w-full"></div>
                            <div className="h-3 bg-slate-100 rounded-sm w-4/5"></div>
                        </div>
                    ) : isFallback ? (
                        <div className="space-y-4">
                            <RenderCoverLetterBlocks
                                blocks={fallbackBlocks}
                                lineSpacing={lineSpacing}
                                isStreaming={isStreaming}
                                serifName={fontFamily === 'serif' || fontFamily === 'merriweather'}
                            />
                        </div>
                    ) : (
                        <>
                            {openingBlocks.length > 0 && (
                                <div className="mb-4 space-y-4">
                                    <RenderCoverLetterBlocks
                                        blocks={openingBlocks}
                                        lineSpacing={lineSpacing}
                                        isStreaming={isStreaming && (!skills || skills.length === 0)}
                                        serifName={fontFamily === 'serif' || fontFamily === 'merriweather'}
                                    />
                                </div>
                            )}

                            {/* Skills Grid */}
                            {skills && skills.length > 0 && (
                                <div className="mb-4 space-y-2.5 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 animate-fadeIn">
                                    {skills.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <div className="w-36 flex-shrink-0 font-bold text-black text-xs uppercase tracking-wide pt-0.5">
                                                {item.skill}
                                            </div>
                                            <div className="flex-1 flex gap-2 items-start text-xs leading-relaxed text-gray-700">
                                                <Check size={14} className="mt-0.5 text-emerald-600 flex-shrink-0" />
                                                <span>{item.description}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {closingBlocks.length > 0 && (
                                <div className="space-y-4">
                                    <RenderCoverLetterBlocks
                                        blocks={closingBlocks}
                                        lineSpacing={lineSpacing}
                                        isStreaming={isStreaming}
                                        serifName={fontFamily === 'serif' || fontFamily === 'merriweather'}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
