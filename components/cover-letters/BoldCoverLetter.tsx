import React from 'react';
import { ResumeData } from '../../types';

interface BoldCoverLetterProps {
    data: ResumeData;
    content: string;
    companyName?: string;
    jobTitle?: string;
}

export default function BoldCoverLetter({ data, content, companyName, jobTitle }: BoldCoverLetterProps) {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Extract top 3 skills for the headline bar
    const skills = data.skills
        ? data.skills.split(',').slice(0, 3).map(s => s.trim())
        : ['Professional', 'Experienced', 'Dedicated'];

    return (
        <div className="w-full h-full bg-white text-gray-900 font-sans p-[0.3in] mx-auto relative shadow-sm" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
            {/* Header Section */}
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold uppercase mb-2 text-black font-sans tracking-wide">
                    {data.fullName}
                </h1>

                <div className="flex justify-center flex-wrap gap-x-1 text-sm text-black mb-4">
                    {data.phone && (
                        <>
                            <span>{data.phone}</span>
                            <span>|</span>
                        </>
                    )}
                    {data.email && (
                        <>
                            <a href={`mailto:${data.email}`} className="text-black no-underline">
                                {data.email}
                            </a>
                            <span>|</span>
                        </>
                    )}
                    {data.location || data.address ? (
                        <span>{data.location || data.address}</span>
                    ) : null}
                </div>

                {/* Thick Bold Line */}
                <div className="w-full h-1.5 bg-black mb-4"></div>

                {/* Headline Row (Skills) */}
                <div className="flex justify-center gap-4 text-sm font-bold text-black uppercase tracking-wide">
                    {skills.map((skill, i) => (
                        <React.Fragment key={i}>
                            <span>{skill}</span>
                            {i < skills.length - 1 && <span>•</span>}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {/* Content Body */}
            <div className="text-justify leading-relaxed text-sm text-gray-800 whitespace-pre-wrap font-sans">
                {/* Date & Recipient */}
                <div className="mb-6">
                    {today}
                    <br /><br />
                    {companyName && (
                        <>
                            {companyName}<br />
                            Department Name<br />
                            {companyName} Address<br />
                            City, State, Zip Code<br />
                        </>
                    )}
                </div>

                {/* Main Content */}
                {content}
            </div>
        </div>
    );
}
