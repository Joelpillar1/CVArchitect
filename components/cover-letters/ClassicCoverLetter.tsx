import React from 'react';
import { ResumeData } from '../../types';
import { GeneratedCoverLetter } from '../utils/aiEnhancer';
import { parseCoverLetterBlocks, RenderCoverLetterBlocks } from './coverLetterFormatter';

export interface ClassicCoverLetterProps {
    data: ResumeData;
    content: GeneratedCoverLetter | string;
    companyName?: string;
    jobTitle?: string;
    signatureUrl?: string | null;
    onUploadSignature?: () => void;
    fontSize?: number;
    lineSpacing?: number;
    spacing?: 'compact' | 'normal' | 'spacious';
    fontFamily?: 'sans' | 'serif' | 'mono' | 'merriweather';
    isStreaming?: boolean;
}

export default function ClassicCoverLetter({
    data,
    content,
    companyName,
    jobTitle,
    signatureUrl,
    onUploadSignature,
    fontSize,
    lineSpacing,
    spacing = 'normal',
    fontFamily = 'merriweather',
    isStreaming = false
}: ClassicCoverLetterProps) {
    // Format date in classic British/International style matching sample (e.g. "22 July 2026")
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
            ? 'p-[16mm_18mm]'
            : spacing === 'spacious'
            ? 'p-[26mm_26mm]'
            : 'p-[22mm_22mm]';

    const fontClass =
        fontFamily === 'merriweather' || fontFamily === 'serif'
            ? 'font-serif'
            : fontFamily === 'mono'
            ? 'font-mono'
            : 'font-sans';

    const fullBlocks = parseCoverLetterBlocks(plainText, data.fullName);
    const openingBlocks = structured?.opening ? parseCoverLetterBlocks(structured.opening, data.fullName) : [];
    const closingBlocks = structured?.closing ? parseCoverLetterBlocks(structured.closing, data.fullName) : [];

    return (
        <div
            className={`w-[210mm] min-h-[297mm] bg-white text-gray-900 ${fontClass} mx-auto relative flex flex-col justify-between box-border ${paddingClass} shadow-xs text-left`}
            style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
            <div>
                {/* 1. Header: Left-Aligned Candidate Info */}
                <header className="mb-6">
                    <div data-resume-name className="text-2xl font-bold tracking-tight text-gray-950 mb-2 font-serif">
                        {data.fullName}
                    </div>

                    <div className="text-xs text-gray-700 space-y-0.5 leading-relaxed font-serif">
                        {(data.location || data.address) && <p>{data.location || data.address}</p>}
                        {data.phone && <p>{data.phone}</p>}
                        {data.email && <p>{data.email}</p>}
                        {data.linkedin && (
                            <p>{data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</p>
                        )}
                        {data.website && <p>{data.website.replace(/^https?:\/\//, '')}</p>}
                    </div>
                </header>

                {/* 2. Date */}
                <div className="mb-6">
                    <p className="text-xs text-gray-800 font-serif">{todayDate}</p>
                </div>

                {/* 3. Recipient Info */}
                <div className="mb-6 text-xs text-gray-900 font-serif space-y-0.5">
                    <p className="font-semibold">{companyName || '[Company Name]'}</p>
                    {jobTitle && <p className="text-gray-600">{jobTitle}</p>}
                </div>

                {/* 4. Body Content */}
                <div
                    className="text-left leading-relaxed text-[13.5px] text-gray-800 space-y-4"
                    style={{
                        fontSize: fontSize ? `${fontSize}pt` : undefined,
                        lineHeight: lineSpacing ? `${lineSpacing}` : undefined
                    }}
                >
                    {plainText.trim() ? (
                        hasStructuredSkills ? (
                            /* Structured narrative with highlighted achievement bullet points */
                            <>
                                {openingBlocks.length > 0 && (
                                    <RenderCoverLetterBlocks
                                        blocks={openingBlocks}
                                        lineSpacing={lineSpacing}
                                        isStreaming={isStreaming && (!structured?.skills || structured.skills.length === 0)}
                                        serifName={true}
                                        signatureUrl={signatureUrl}
                                        onUploadSignature={onUploadSignature}
                                    />
                                )}

                                {structured?.skills && structured.skills.length > 0 && (
                                    <div className="space-y-2 my-3 pl-1">
                                        <p className="text-xs font-semibold text-gray-700 italic">
                                            Key areas of alignment and proven success:
                                        </p>
                                        <ul className="space-y-1.5 pl-4 list-disc text-gray-800 text-[13px]">
                                            {structured.skills.map((item, idx) => (
                                                <li key={idx} className="leading-relaxed">
                                                    <span className="font-semibold text-gray-950">{`${item.skill}:`}</span>{' '}
                                                    <span>{item.description}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {closingBlocks.length > 0 && (
                                    <RenderCoverLetterBlocks
                                        blocks={closingBlocks}
                                        lineSpacing={lineSpacing}
                                        isStreaming={isStreaming}
                                        serifName={true}
                                        signatureUrl={signatureUrl}
                                        onUploadSignature={onUploadSignature}
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
                                signatureUrl={signatureUrl}
                                onUploadSignature={onUploadSignature}
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
