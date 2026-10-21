import React from 'react';
import { ResumeData } from '../../types';
import { GeneratedCoverLetter } from '../utils/aiEnhancer';
import { parseCoverLetterBlocks, RenderCoverLetterBlocks } from './coverLetterFormatter';

export interface EditorialCoverLetterProps {
    data: ResumeData;
    content: GeneratedCoverLetter | string;
    companyName?: string;
    jobTitle?: string;
    fontSize?: number;
    lineSpacing?: number;
    spacing?: 'compact' | 'normal' | 'spacious';
    fontFamily?: 'sans' | 'serif' | 'mono' | 'merriweather';
    isStreaming?: boolean;
}

/**
 * Editorial / Traditional Cover Letter Template
 * Clones the executive, left-aligned, literary layout:
 * - Bold serif candidate name
 * - Integrated contact block with inline date (e.g., "June 18, 2021")
 * - Left-aligned company recipient header
 * - Editorial paragraph styling with generous line breaks
 * - Clean achievement highlight spacing without intrusive bullet symbols
 * - Formal "Sincerely," with signature spacing and candidate name on separate lines
 */
export default function EditorialCoverLetter({
    data,
    content,
    companyName,
    jobTitle,
    fontSize,
    lineSpacing,
    spacing = 'normal',
    fontFamily = 'merriweather',
    isStreaming = false
}: EditorialCoverLetterProps) {
    // Format date matching executive US format: Month D, YYYY (e.g. "June 18, 2021")
    const todayDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const plainText = typeof content === 'string' ? content : content?.plainText || '';
    const structured = typeof content === 'object' && content !== null ? content.structured : undefined;
    const hasStructuredSkills = structured && Array.isArray(structured.skills) && structured.skills.length > 0;

    const paddingClass =
        spacing === 'compact'
            ? 'p-[18mm_18mm]'
            : spacing === 'spacious'
            ? 'p-[28mm_28mm]'
            : 'p-[24mm_24mm]';

    const fontClass =
        fontFamily === 'sans'
            ? 'font-sans'
            : fontFamily === 'mono'
            ? 'font-mono'
            : 'font-serif';

    const fullBlocks = parseCoverLetterBlocks(plainText, data.fullName);
    const openingBlocks = structured?.opening ? parseCoverLetterBlocks(structured.opening, data.fullName) : [];
    const closingBlocks = structured?.closing ? parseCoverLetterBlocks(structured.closing, data.fullName) : [];

    // Check if the letter body already starts with a greeting/salutation
    const startsWithSalutation = /^(Dear|To|Greetings|Attention)\b/i.test(plainText.trim());

    return (
        <div
            className={`w-[210mm] min-h-[297mm] bg-white text-gray-900 ${fontClass} mx-auto relative flex flex-col justify-between box-border ${paddingClass} shadow-xs text-left`}
            style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
            <div>
                {/* 1. Header: Left-Aligned Candidate Name */}
                <header className="mb-6">
                    <h1 className="text-[26px] font-bold tracking-tight text-gray-950 mb-2 font-serif">
                        {data.fullName || 'Charles Bloomberg'}
                    </h1>

                    {/* Integrated Contact Block (Location -> Date -> Email -> Links) */}
                    <div className="text-[13px] text-gray-700 space-y-0.5 leading-relaxed font-serif">
                        {(data.location || data.address) && <p>{data.location || data.address}</p>}
                        <p>{todayDate}</p>
                        {data.email && <p>{data.email}</p>}
                        {data.phone && <p>{data.phone}</p>}
                        {data.linkedin && (
                            <p>{data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</p>
                        )}
                        {data.website && <p>{data.website.replace(/^https?:\/\//, '')}</p>}
                    </div>
                </header>

                {/* 2. Recipient Company Block */}
                <div className="mb-6 text-[13px] text-gray-900 font-serif">
                    <p className="font-medium">{companyName || 'Company A'}</p>
                    {jobTitle && <p className="text-gray-600 text-xs mt-0.5">{jobTitle}</p>}
                </div>

                {/* 3. Salutation if body does not already contain one */}
                {!startsWithSalutation && plainText.trim().length > 0 && (
                    <div className="mb-4 text-[13.5px] text-gray-900 font-serif font-medium">
                        <p>Dear Hiring team</p>
                    </div>
                )}

                {/* 4. Body Content */}
                <div
                    className="text-left leading-relaxed text-[13.5px] text-gray-800 space-y-4.5"
                    style={{
                        fontSize: fontSize ? `${fontSize}pt` : undefined,
                        lineHeight: lineSpacing ? `${lineSpacing}` : undefined
                    }}
                >
                    {plainText.trim() ? (
                        hasStructuredSkills ? (
                            /* Structured narrative with literary unbulleted spaced achievements */
                            <>
                                {openingBlocks.length > 0 && (
                                    <RenderCoverLetterBlocks
                                        blocks={openingBlocks}
                                        lineSpacing={lineSpacing}
                                        isStreaming={isStreaming && (!structured?.skills || structured.skills.length === 0)}
                                        serifName={true}
                                    />
                                )}

                                {structured?.skills && structured.skills.length > 0 && (
                                    <div className="space-y-3.5 my-4">
                                        {structured.skills.map((item, idx) => (
                                            <p key={idx} className="leading-relaxed text-[13.5px] text-gray-800">
                                                {item.description || item.skill}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {closingBlocks.length > 0 && (
                                    <RenderCoverLetterBlocks
                                        blocks={closingBlocks}
                                        lineSpacing={lineSpacing}
                                        isStreaming={isStreaming}
                                        serifName={true}
                                    />
                                )}
                            </>
                        ) : (
                            /* Standard full text paragraphs */
                            <RenderCoverLetterBlocks
                                blocks={fullBlocks}
                                lineSpacing={lineSpacing}
                                isStreaming={isStreaming}
                                serifName={true}
                            />
                        )
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
