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

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="w-full h-full bg-white text-gray-900 font-sans p-[0.3in] mx-auto relative shadow-sm" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
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
                <div className="flex justify-center flex-wrap gap-x-3 text-sm text-gray-600 font-medium">
                    {data.location || data.address ? (
                        <>
                            <span>{data.location || data.address}</span>
                            <span>|</span>
                        </>
                    ) : null}
                    {data.phone && (
                        <>
                            <span>{data.phone}</span>
                            <span>|</span>
                        </>
                    )}
                    {data.linkedin && (
                        <>
                            <span>LinkedIn</span>
                            <span>|</span>
                        </>
                    )}
                    {data.email && (
                        <a href={`mailto:${data.email}`} className="text-gray-600 no-underline">
                            {data.email}
                        </a>
                    )}
                </div>
            </header>

            {/* Full width separator */}
            <hr className="border-t-2 border-gray-200 mb-8" />

            {/* Content Body */}
            <div className="text-justify leading-relaxed text-sm text-gray-800 whitespace-pre-wrap font-serif">
                {/* We prepend Date and recipient placeholder if content doesn't seem to have them */}
                <div className="mb-6 font-sans">
                    {today}
                    <br /><br />
                    {companyName && (
                        <>
                            {companyName}<br />
                            Hiring Manager<br />
                            {companyName} Headquarters<br />
                        </>
                    )}
                </div>

                {/* The main content */}
                {content}
            </div>

            {/* Design Element footer if needed? No, image is clean. */}
        </div>
    );
}
