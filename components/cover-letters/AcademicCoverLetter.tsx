import React from 'react';
import { ResumeData } from '../../types';
import { GeneratedCoverLetter } from '../utils/aiEnhancer';
import { parseCoverLetterBlocks, RenderCoverLetterBlocks } from './coverLetterFormatter';

export interface AcademicCoverLetterProps {
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
 * Academic / Scholarly Research Cover Letter Template
 * Clones the formal academic and scientific correspondence format:
 * - Bold serif candidate name
 * - Essential contact info stack (Location -> Phone -> Email)
 * - Standalone international date line ("22 July 2026")
 * - Formal institution / company recipient line
 * - Scholarly salutation ("Dear [Mr./Mrs./Ms.] [Hiring Manager's Name],")
 * - Unhurried, elegant academic narrative with balanced paragraph spacing
 * - Formal "Sincerely," with signature gap and signer name on separate lines
 */
export default function AcademicCoverLetter({
    data,
    content,
    companyName,
    jobTitle,
    fontSize,
    lineSpacing,
    spacing = 'normal',
    fontFamily = 'merriweather',
    isStreaming = false
}: AcademicCoverLetterProps) {
    // International academic date format: e.g. "22 July 2026"
    const todayDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
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
                {/* 1. Header: Left-Aligned Candidate Name & Contact Stack */}
                <header className="mb-6">
                    <h1 className="text-[26px] font-bold tracking-tight text-gray-950 mb-2 font-serif">
                        {data.fullName || 'Charles Bloomberg'}
                    </h1>

                    <div className="text-[13px] text-gray-700 space-y-0.5 leading-relaxed font-serif">
                        {(data.location || data.address) && <p>{data.location || data.address}</p>}
                        {data.phone && <p>{data.phone}</p>}
                        {data.email && <p>{data.email}</p>}
                        {data.linkedin && (
                            <p>{data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</p>
                        )}
                        {data.website && <p>{data.website.replace(/^https?:\/\//, '')}</p>}
                    </div>
                </header>

                {/* 2. Standalone Academic Date */}
                <div className="mb-6">
                    <p className="text-[13.5px] text-gray-800 font-serif">{todayDate}</p>
                </div>

                {/* 3. Recipient Institution / Company */}
                <div className="mb-6 text-[13.5px] text-gray-900 font-serif">
                    <p className="font-normal">{companyName || '[Company Name]'}</p>
                </div>

                {/* 4. Scholarly Salutation if body does not already contain one */}
                {!startsWithSalutation && plainText.trim().length > 0 && (
                    <div className="mb-4 text-[13.5px] text-gray-900 font-serif font-normal">
                        <p>Dear [Mr./Mrs./Ms.] [Hiring Manager's Name],</p>
                    </div>
                )}

                {/* 5. Body Content (Scholarly Narrative) */}
                <div
                    className="text-left leading-relaxed text-[13.5px] text-gray-800 space-y-4.5"
                    style={{
                        fontSize: fontSize ? `${fontSize}pt` : undefined,
                        lineHeight: lineSpacing ? `${lineSpacing}` : undefined
                    }}
                >
                    {plainText.trim() ? (
                        hasStructuredSkills ? (
                            /* Seamless academic prose flow */
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
                                    <div className="space-y-4 my-2">
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
