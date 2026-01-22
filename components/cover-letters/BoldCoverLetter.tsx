import React from 'react';
import { ResumeData } from '../../types';

interface BoldCoverLetterProps {
    data: ResumeData;
    content: string;
    companyName?: string;
    jobTitle?: string;
}

export default function BoldCoverLetter({ data, content, companyName, jobTitle }: BoldCoverLetterProps) {
    // Extract top 3 skills for the headline bar
    const skills = data.skills
        ? data.skills.split(',').slice(0, 3).map(s => s.trim())
        : ['Professional', 'Experienced', 'Dedicated'];

    return (
        <div className="w-full bg-white text-gray-900 font-sans p-[0.3in] mx-auto relative shadow-sm" style={{ maxWidth: '210mm' }}>
            {/* Header Section */}
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold uppercase mb-2 text-black font-sans tracking-wide">
                    {data.fullName}
                </h1>

                <div className="flex justify-center items-center flex-nowrap gap-x-2 text-sm text-black mb-4 whitespace-nowrap">
                    {data.phone && (
                        <>
                            <span className="whitespace-nowrap">{data.phone}</span>
                            <span className="mx-1">|</span>
                        </>
                    )}
                    {data.email && (
                        <>
                            <a href={`mailto:${data.email}`} className="text-black no-underline whitespace-nowrap">
                                {data.email}
                            </a>
                            {(data.linkedin || data.location || data.address) && <span className="mx-1">|</span>}
                        </>
                    )}
                    {data.linkedin && (
                        <>
                            <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-black no-underline whitespace-nowrap">
                                LinkedIn
                            </a>
                            {(data.location || data.address) && <span className="mx-1">|</span>}
                        </>
                    )}
                    {data.location || data.address ? (
                        <span className="whitespace-nowrap">{data.location || data.address}</span>
                    ) : null}
                </div>

                {/* Thick Bold Line */}
                <div className="w-full h-1.5 bg-black mb-4"></div>

                {/* Headline Row (Skills) */}
                <div className="flex justify-center items-center flex-nowrap gap-x-4 text-sm font-bold text-black uppercase tracking-wide whitespace-nowrap">
                    {skills.map((skill, i) => (
                        <React.Fragment key={i}>
                            <span className="whitespace-nowrap">{skill}</span>
                            {i < skills.length - 1 && <span>•</span>}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {/* Content Body */}
            <div className="text-justify leading-relaxed text-sm text-gray-800 font-sans">
                {/* Main Content - split into paragraphs */}
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
        </div>
    );
}
