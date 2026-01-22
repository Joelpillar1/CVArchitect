import React from 'react';
import { ResumeData } from '../../types';

interface ModernCoverLetterProps {
    data: ResumeData;
    content: string; // The generated cover letter text
    companyName?: string;
    jobTitle?: string;
}

export default function ModernCoverLetter({ data, content, companyName, jobTitle }: ModernCoverLetterProps) {
    // Parse content for date/recipient if possible, or just render it raw if it already contains it.
    // The AI prompt says "Use standard business letter format", so it likely includes Date/Addr.
    // However, for strict styling 'clone', we might want to strip that and render it with our own HTML.

    // For now, let's assume content is just the body paragraphs + closing, 
    // or if it's full letter, we render it preservering whitespace.
    // Ideally we strip the top part if the AI generates it text-based, to use our HTML header.

    // Simple heuristic: If content starts with "Date" or addresses, we might just render it.
    // But to look like the image, the Header (Name/Contact) must be separate.

    return (
        <div className="w-full bg-white text-gray-900 font-sans p-[0.3in] mx-auto relative shadow-sm" style={{ maxWidth: '210mm' }}>
            {/* Header Section */}
            <header className="text-center mb-6">
                <h1 className="text-5xl font-light tracking-wide uppercase mb-2 font-serif text-slate-900 layer-name">
                    {data.fullName}
                </h1>
                <div className="text-sm font-bold tracking-[0.3em] uppercase text-slate-500 mb-4 layer-title">
                    {data.jobTitle}
                </div>

                {/* Small centered divider */}
                <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-4"></div>

                {/* Contact Info */}
                <div className="flex justify-center items-center flex-nowrap gap-x-2 text-sm text-gray-600 font-medium whitespace-nowrap">
                    {data.location || data.address ? (
                        <>
                            <span className="whitespace-nowrap">{data.location || data.address}</span>
                            <span className="mx-1">|</span>
                        </>
                    ) : null}
                    {data.phone && (
                        <>
                            <span className="whitespace-nowrap">{data.phone}</span>
                            <span className="mx-1">|</span>
                        </>
                    )}
                    {data.email && (
                        <>
                            <a href={`mailto:${data.email}`} className="text-gray-600 no-underline whitespace-nowrap">
                                {data.email}
                            </a>
                            {data.linkedin && <span className="mx-1">|</span>}
                        </>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 no-underline whitespace-nowrap">
                            LinkedIn
                        </a>
                    )}
                </div>
            </header>

            {/* Full width separator */}
            <hr className="border-t-2 border-gray-200 mb-8" />

            {/* Content Body */}
            <div className="text-justify leading-relaxed text-sm text-gray-800 font-serif">
                {/* The main content - split into paragraphs */}
                <div className="space-y-4">
                    {content
                        .split(/\n\s*\n/)
                        .map(block => block.split(/\n/).filter(line => line.trim()).join(' '))
                        .filter(p => p.trim())
                        .map((paragraph, idx) => (
                            <p key={idx} className="mb-4 last:mb-0">
                                {paragraph.trim()}
                            </p>
                        ))}
                </div>
            </div>

            {/* Design Element footer if needed? No, image is clean. */}
        </div>
    );
}
