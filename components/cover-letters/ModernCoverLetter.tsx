import React from 'react';
import { ResumeData } from '../../types';

interface ModernCoverLetterProps {
    data: ResumeData;
    content: string; // The generated cover letter text
    companyName?: string;
    jobTitle?: string;
}

export default function ModernCoverLetter({ data, content, companyName, jobTitle }: ModernCoverLetterProps) {
    const todayDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div 
            className="w-[210mm] min-h-[297mm] bg-white text-gray-900 font-sans mx-auto relative flex flex-col justify-between box-border p-[24mm_22mm] shadow-xs"
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
                <div className="text-justify leading-relaxed text-[13.5px] text-gray-800 font-serif space-y-4">
                    {content
                        .split(/\n\s*\n/)
                        .map(block => block.split(/\n/).filter(line => line.trim()).join(' '))
                        .filter(p => p.trim())
                        .map((paragraph, idx) => (
                            <p key={idx} className="leading-[1.75]">
                                {paragraph.trim()}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
}
