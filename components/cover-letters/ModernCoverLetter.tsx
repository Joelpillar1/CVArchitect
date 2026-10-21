import React from 'react';
import { ResumeData } from '../../types';
import { parseCoverLetterBlocks, RenderCoverLetterBlocks } from './coverLetterFormatter';

interface ModernCoverLetterProps {
    data: ResumeData;
    content: string; // The generated cover letter text
    companyName?: string;
    jobTitle?: string;
    fontSize?: number;
    lineSpacing?: number;
    spacing?: 'compact' | 'normal' | 'spacious';
    fontFamily?: 'sans' | 'serif' | 'mono' | 'merriweather';
    isStreaming?: boolean;
}

export default function ModernCoverLetter({
    data,
    content,
    companyName,
    jobTitle,
    fontSize,
    lineSpacing,
    spacing = 'normal',
    fontFamily = 'merriweather',
    isStreaming = false
}: ModernCoverLetterProps) {
    const todayDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const blocks = parseCoverLetterBlocks(content, data.fullName);

    const paddingClass = spacing === 'compact' ? 'p-[16mm_16mm]' : spacing === 'spacious' ? 'p-[28mm_24mm]' : 'p-[24mm_22mm]';
    const fontClass = (fontFamily === 'merriweather' || fontFamily === 'serif') ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans';

    return (
        <div 
            className={`w-[210mm] min-h-[297mm] bg-white text-gray-900 font-sans mx-auto relative flex flex-col justify-between box-border ${paddingClass} shadow-xs`}
            style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
            <div>
                {/* Header Section */}
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-light tracking-wider uppercase mb-1.5 font-serif text-slate-900 layer-name">
                        {data.fullName}
                    </h1>
                    <div className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 mb-3 layer-title">
                        {data.jobTitle || jobTitle || 'Professional Application'}
                    </div>

                    {/* Centered Divider */}
                    <div className="w-20 h-[1.5px] bg-gray-400 mx-auto mb-3"></div>

                    {/* Contact Info */}
                    <div className="flex justify-center items-center flex-wrap gap-x-2.5 text-xs text-gray-600 font-normal">
                        {(data.location || data.address) && (
                            <>
                                <span>{data.location || data.address}</span>
                                <span className="text-gray-300">|</span>
                            </>
                        )}
                        {data.phone && (
                            <>
                                <span>{data.phone}</span>
                                <span className="text-gray-300">|</span>
                            </>
                        )}
                        {data.email && (
                            <>
                                <a href={`mailto:${data.email}`} className="text-gray-600 no-underline">
                                    {data.email}
                                </a>
                                {data.linkedin && <span className="text-gray-300">|</span>}
                            </>
                        )}
                        {data.linkedin && (
                            <span className="text-gray-600">LinkedIn</span>
                        )}
                    </div>
                </header>

                {/* Full Width Separator */}
                <hr className="border-t border-gray-200 mb-6" />

                {/* Date & Recipient Details */}
                <div className="text-xs text-gray-600 mb-6 space-y-1">
                    <p className="font-serif italic text-gray-700">{todayDate}</p>
                    <p className="font-bold text-gray-900 font-sans mt-2">{companyName || 'Hiring Team'}</p>
                    <p className="text-gray-500 font-sans">{jobTitle ? `Application for ${jobTitle}` : 'Employment Application'}</p>
                </div>

                {/* Content Body */}
                <div 
                    className={`text-justify leading-relaxed text-[13.5px] text-gray-800 ${fontClass} space-y-4`}
                    style={{
                        fontSize: fontSize ? `${fontSize}pt` : undefined,
                        lineHeight: lineSpacing ? `${lineSpacing}` : undefined
                    }}
                >
                    {content.trim() ? (
                        <RenderCoverLetterBlocks
                            blocks={blocks}
                            lineSpacing={lineSpacing}
                            isStreaming={isStreaming}
                            serifName={fontFamily === 'serif' || fontFamily === 'merriweather'}
                        />
                    ) : isStreaming ? (
                        <div className="space-y-3.5 py-3 animate-pulse">
                            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50/90 px-3.5 py-2 rounded-lg border border-slate-200/80 mb-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                                <span>Tailoring your experience for {companyName || 'this role'}...</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-sm w-11/12"></div>
                            <div className="h-3 bg-slate-100 rounded-sm w-full"></div>
                            <div className="h-3 bg-slate-100 rounded-sm w-4/5"></div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
