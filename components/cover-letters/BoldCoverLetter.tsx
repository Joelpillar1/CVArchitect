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
                    <h1 className="text-3xl font-extrabold uppercase mb-2 text-black font-sans tracking-wider">
                        {data.fullName}
                    </h1>

                    <div className="flex justify-center items-center flex-wrap gap-x-3 text-xs text-gray-700 mb-3.5">
                        {data.phone && (
                            <span>{data.phone}</span>
                        )}
                        {data.email && (
                            <>
                                <span className="text-gray-300">•</span>
                                <a href={`mailto:${data.email}`} className="text-gray-700 no-underline">
                                    {data.email}
                                </a>
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

                    {/* Thick Bold Line */}
                    <div className="w-full h-1 bg-black mb-3.5"></div>

                    {/* Headline Row (Skills) */}
                    <div className="flex justify-center items-center flex-wrap gap-x-4 text-xs font-bold text-black uppercase tracking-wider">
                        {skills.map((skill, i) => (
                            <React.Fragment key={i}>
                                <span>{skill}</span>
                                {i < skills.length - 1 && <span className="text-gray-400">•</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </header>

                {/* Date & Recipient Details */}
                <div className="text-xs text-gray-600 mb-6 space-y-1">
                    <p className="font-medium text-gray-800">{todayDate}</p>
                    <p className="font-bold text-gray-900 mt-2">{companyName || 'Hiring Team'}</p>
                    <p className="text-gray-500">{jobTitle ? `Application for ${jobTitle}` : 'Employment Application'}</p>
                </div>

                {/* Content Body */}
                <div className="text-justify leading-relaxed text-[13.5px] text-gray-800 font-sans space-y-4">
                    {content
                        .split(/\n\s*\n/)
                        .map(block => block.split(/\n/).filter(line => line.trim()).join(' '))
                        .filter(p => p.trim())
                        .map((paragraph, idx) => (
                            <p key={idx} className="leading-[1.7] text-justify">
                                {paragraph.trim()}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
}
