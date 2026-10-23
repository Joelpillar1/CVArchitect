import React from 'react';
import { ResumeData } from '../../types';
import { GeneratedCoverLetter } from '../utils/aiEnhancer';
import { parseCoverLetterBlocks } from './coverLetterFormatter';
import { Upload, PenTool } from 'lucide-react';

export interface CorporateCoverLetterProps {
    data: ResumeData;
    content: GeneratedCoverLetter | string;
    companyName?: string;
    jobTitle?: string;
    recipientName?: string;
    department?: string;
    companyStreet?: string;
    companyCity?: string;
    signatureUrl?: string | null;
    onUploadSignature?: () => void;
    fontSize?: number;
    lineSpacing?: number;
    spacing?: 'compact' | 'normal' | 'spacious';
    fontFamily?: 'sans' | 'serif' | 'mono' | 'merriweather';
    isStreaming?: boolean;
}

/**
 * Corporate / Business Standard Cover Letter Template
 * Features:
 * - Bold left-aligned candidate header with direct contact stack (using app defaults: Alex Morgan, etc.)
 * - Standalone current date line
 * - Formal recipient block (Contact Person, Department, Company, Address)
 * - Distinct bold subject line ("Application for [Job Title]")
 * - Structured salutation
 * - Crisp, balanced sans-serif narrative paragraphs
 * - Formal "Sincerely," followed by an uploaded or authentic cursive signature and bold printed name
 */
export default function CorporateCoverLetter({
    data,
    content,
    companyName,
    jobTitle,
    recipientName,
    department,
    companyStreet,
    companyCity,
    signatureUrl,
    onUploadSignature,
    fontSize,
    lineSpacing,
    spacing = 'normal',
    fontFamily = 'sans',
    isStreaming = false
}: CorporateCoverLetterProps) {
    // Current date in clean international style (e.g. "22 October 2026")
    const displayDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const plainText = typeof content === 'string' ? content : content?.plainText || '';
    const structured = typeof content === 'object' && content !== null ? content.structured : undefined;
    const hasStructuredSkills = structured && Array.isArray(structured.skills) && structured.skills.length > 0;

    const paddingClass =
        spacing === 'compact'
            ? 'p-[18mm_20mm]'
            : spacing === 'spacious'
            ? 'p-[28mm_28mm]'
            : 'p-[24mm_24mm]';

    const fontClass =
        fontFamily === 'serif' || fontFamily === 'merriweather'
            ? 'font-serif'
            : fontFamily === 'mono'
            ? 'font-mono'
            : 'font-sans';

    // Resolved candidate name & contact info using app defaults (Alex Morgan)
    const candidateName = data.fullName || 'Alex Morgan';

    // Parse sender address into clean lines
    const senderAddressLines: string[] = React.useMemo(() => {
        const lines: string[] = [];
        if (data.address) {
            data.address.split('\n').forEach((l) => {
                const trimmed = l.trim();
                if (trimmed) lines.push(trimmed);
            });
        }
        if (data.location && !lines.includes(data.location.trim())) {
            lines.push(data.location.trim());
        }
        if (lines.length === 0) {
            lines.push('San Francisco, CA');
        }
        return lines;
    }, [data.address, data.location]);

    const senderEmail = data.email || 'alex.morgan@example.com';
    const senderPhone = data.phone || '+1 (555) 234-5678';

    // Resolved recipient data using app defaults (Acme Corp / Hiring Team)
    const activeCompanyName = companyName || 'Acme Corp';
    const resolvedRecipientName = recipientName || 'Hiring Team';
    const resolvedDepartment = department || '';
    const resolvedStreet = companyStreet || '';
    const resolvedCity = companyCity || '';

    // Resolved subject line
    const resolvedJobTitle = jobTitle || data.jobTitle || 'Senior Product Manager';
    const defaultSubject = `Application for ${resolvedJobTitle}`;

    // Detect if plainText contains an embedded subject line like "Application for..." or "Subject:..."
    const subjectMatch = plainText.match(/^(?:Subject\s*:\s*|Application\s+for\s+|RE\s*:\s*)([^\n]+)\n*/i);
    const cleanSubject = subjectMatch
        ? `Application for ${subjectMatch[1].trim()}`
        : defaultSubject;

    // Remove the explicit subject header from the text if present to avoid duplication
    const bodyWithoutSubject = subjectMatch
        ? plainText.replace(subjectMatch[0], '').trimStart()
        : plainText;

    // Check if the body begins with a salutation/greeting
    const salutationMatch = bodyWithoutSubject.match(/^(Dear\s+[^,:\n]+[,:]?)\s*\n*/i);
    const hasSalutationInBody = Boolean(salutationMatch);

    // If body does not have a greeting, determine the formal salutation
    const resolvedSalutation = React.useMemo(() => {
        if (hasSalutationInBody) return null;
        if (resolvedRecipientName && /^ms\.\s+/i.test(resolvedRecipientName)) {
            const parts = resolvedRecipientName.split(' ');
            return `Dear ${parts[0]} ${parts[parts.length - 1]},`;
        }
        if (resolvedRecipientName && /^mr\.\s+/i.test(resolvedRecipientName)) {
            const parts = resolvedRecipientName.split(' ');
            return `Dear ${parts[0]} ${parts[parts.length - 1]},`;
        }
        return `Dear ${resolvedRecipientName},`;
    }, [hasSalutationInBody, resolvedRecipientName]);

    // Parse body text into structured blocks
    const fullBlocks = parseCoverLetterBlocks(bodyWithoutSubject, candidateName);
    const openingBlocks = structured?.opening
        ? parseCoverLetterBlocks(structured.opening, candidateName)
        : [];
    const closingBlocks = structured?.closing
        ? parseCoverLetterBlocks(structured.closing, candidateName)
        : [];

    const hasSignoffBlock = fullBlocks.some((b) => b.type === 'signoff');

    return (
        <div
            className={`w-[210mm] min-h-[297mm] bg-white text-gray-900 ${fontClass} mx-auto relative flex flex-col justify-between box-border ${paddingClass} shadow-xs text-left`}
            style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
            <div>
                {/* 1. Sender Header (Top Left) */}
                <header className="mb-7">
                    <div
                        data-resume-name
                        className="text-[15.5px] font-bold tracking-tight text-gray-950 mb-1"
                    >
                        {candidateName}
                    </div>

                    <div className="text-[13px] text-gray-800 space-y-0.5 leading-normal">
                        {senderAddressLines.map((line, idx) => (
                            <p key={idx}>{line}</p>
                        ))}
                        {senderEmail && <p>{senderEmail}</p>}
                        {senderPhone && <p>{senderPhone}</p>}
                        {data.linkedin && (
                            <p>
                                {data.linkedin.replace(
                                    /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                                    'linkedin.com/in/'
                                )}
                            </p>
                        )}
                        {data.website && (
                            <p>{data.website.replace(/^https?:\/\//, '')}</p>
                        )}
                    </div>
                </header>

                {/* 2. Standalone Date */}
                <div className="mb-7">
                    <p className="text-[13px] text-gray-800">{displayDate}</p>
                </div>

                {/* 3. Recipient Information Block */}
                <div className="mb-7 text-[13px] text-gray-800 space-y-0.5">
                    {resolvedRecipientName && (
                        <p className="font-bold text-gray-950">{resolvedRecipientName}</p>
                    )}
                    {resolvedDepartment && <p>{resolvedDepartment}</p>}
                    <p>{activeCompanyName}</p>
                    {resolvedStreet && <p>{resolvedStreet}</p>}
                    {resolvedCity && <p>{resolvedCity}</p>}
                </div>

                {/* 4. Subject Line / Reference Line */}
                <div className="mb-5">
                    <p className="text-[14px] sm:text-[14.5px] font-bold text-gray-950 tracking-tight leading-snug">
                        {cleanSubject}
                    </p>
                </div>

                {/* 5. Salutation (rendered if not already included in body paragraphs) */}
                {resolvedSalutation && (
                    <div className="mb-4 text-[13.5px] text-gray-800 leading-normal">
                        <p>{resolvedSalutation}</p>
                    </div>
                )}

                {/* 6. Body Content */}
                <div
                    className="text-left leading-[1.68] text-[13.5px] text-gray-800 space-y-4"
                    style={{
                        fontSize: fontSize ? `${fontSize}pt` : undefined,
                        lineHeight: lineSpacing ? `${lineSpacing}` : undefined
                    }}
                >
                    {bodyWithoutSubject.trim() ? (
                        hasStructuredSkills ? (
                            <>
                                {openingBlocks.length > 0 &&
                                    renderBlocks(openingBlocks, candidateName, isStreaming, signatureUrl, onUploadSignature)}

                                {structured?.skills && structured.skills.length > 0 && (
                                    <div className="space-y-2 my-3 pl-1">
                                        <p className="text-xs font-semibold text-gray-700">
                                            Key qualifications and demonstrated achievements:
                                        </p>
                                        <ul className="space-y-1.5 pl-4 list-disc text-gray-800 text-[13px]">
                                            {structured.skills.map((item, idx) => (
                                                <li key={idx} className="leading-relaxed">
                                                    <span className="font-semibold text-gray-950">
                                                        {`${item.skill}:`}
                                                    </span>{' '}
                                                    <span>{item.description}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {closingBlocks.length > 0 &&
                                    renderBlocks(closingBlocks, candidateName, isStreaming, signatureUrl, onUploadSignature)}
                            </>
                        ) : (
                            renderBlocks(fullBlocks, candidateName, isStreaming, signatureUrl, onUploadSignature)
                        )
                    ) : (
                        <p className="text-gray-400 italic">No content generated yet.</p>
                    )}

                    {/* Fallback Sign-off if text did not have an explicit signoff block */}
                    {!hasSignoffBlock && !isStreaming && bodyWithoutSubject.trim() && (
                        <div className="pt-4 space-y-2">
                            <p className="leading-tight text-gray-800 text-[13.5px]">Sincerely,</p>
                            <SignatureBlock
                                name={candidateName}
                                signatureUrl={signatureUrl}
                                onUploadSignature={onUploadSignature}
                            />
                            <p className="font-bold text-gray-950 text-[13.5px] tracking-tight">
                                {candidateName}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Signature Block: Renders uploaded signature image OR fluid handwritten cursive font
 */
function SignatureBlock({
    name,
    signatureUrl,
    onUploadSignature
}: {
    name: string;
    signatureUrl?: string | null;
    onUploadSignature?: () => void;
}) {
    return (
        <div
            className={`group/sig relative inline-block py-2 -my-1 rounded-lg transition-all ${
                onUploadSignature ? 'cursor-pointer hover:bg-gray-50/80 pr-2' : ''
            }`}
            onClick={onUploadSignature}
            title={onUploadSignature ? 'Click to upload or change signature' : undefined}
        >
            {signatureUrl ? (
                <div className="flex items-center">
                    <img
                        src={signatureUrl}
                        alt="Signature"
                        className="max-h-12 max-w-[200px] object-contain select-none"
                    />
                </div>
            ) : (
                <div
                    className="font-signature text-[34px] sm:text-[38px] select-none -rotate-1 origin-left leading-none tracking-wide text-[#1b365d]"
                    style={{
                        fontFamily: "'Alex Brush', 'Dancing Script', 'Caveat', 'Brush Script MT', cursive",
                        color: '#1b365d' // High-end fountain pen ink navy blue
                    }}
                >
                    {name || 'Alex Morgan'}
                </div>
            )}

            {/* Subtle hover badge when in interactive editor */}
            {onUploadSignature && (
                <div className="absolute -top-2 -right-2 opacity-0 group-hover/sig:opacity-100 transition-opacity bg-brand-dark text-white rounded-full p-1 shadow-sm text-[10px] pointer-events-none flex items-center gap-1 px-1.5">
                    <PenTool size={10} />
                    <span>Upload</span>
                </div>
            )}
        </div>
    );
}

/**
 * Helper to render paragraphs and signature sign-offs
 */
function renderBlocks(
    blocks: ReturnType<typeof parseCoverLetterBlocks>,
    defaultSigner: string,
    isStreaming: boolean,
    signatureUrl?: string | null,
    onUploadSignature?: () => void
) {
    return (
        <>
            {blocks.map((block, idx) => {
                const isLast = idx === blocks.length - 1;

                if (block.type === 'signoff') {
                    const signer = block.name || defaultSigner;
                    return (
                        <div key={`signoff-${idx}`} className="pt-4 space-y-2">
                            <p className="leading-tight text-gray-800 text-[13.5px]">
                                {block.greeting}
                            </p>

                            <SignatureBlock
                                name={signer}
                                signatureUrl={signatureUrl}
                                onUploadSignature={onUploadSignature}
                            />

                            <p className="font-bold text-gray-950 text-[13.5px] tracking-tight">
                                {signer}
                                {isStreaming && isLast && (
                                    <span className="inline-block w-1.5 h-4 ml-1.5 bg-emerald-600 animate-pulse align-middle" />
                                )}
                            </p>
                        </div>
                    );
                }

                return (
                    <p key={`p-${idx}`} className="leading-[1.68] whitespace-pre-line text-gray-800">
                        {block.text}
                        {isStreaming && isLast && (
                            <span className="inline-block w-1.5 h-4 ml-1.5 bg-emerald-600 animate-pulse align-middle" />
                        )}
                    </p>
                );
            })}
        </>
    );
}
