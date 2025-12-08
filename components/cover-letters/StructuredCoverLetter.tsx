import React from 'react';
import { ResumeData } from '../../types';
import { GeneratedCoverLetter } from '../../utils/aiEnhancer';
import { Check } from 'lucide-react';

interface StructuredCoverLetterProps {
    data: ResumeData;
    content: GeneratedCoverLetter; // Expects the full structured object
    companyName?: string;
    jobTitle?: string;
}

export default function StructuredCoverLetter({ data, content, companyName, jobTitle }: StructuredCoverLetterProps) {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Fallback: If structured data is missing/empty, we try to use plain text or just show a warning.
    // Ideally the AI always returns structured data now.
    const { opening, skills, closing } = content.structured;
    const isFallback = !skills || skills.length === 0;

    // Headline skills
    const headlineSkills = data.skills
        ? data.skills.split(',').slice(0, 3).map(s => s.trim())
        : ['Professional', 'Experienced', 'Dedicated'];

    return (
        <div className="w-full h-full bg-white text-gray-900 font-sans p-[0.3in] mx-auto relative shadow-sm flex flex-col" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
            {/* Header - Identical to Bold Template */}
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
                        <>
                            <span>|</span>
                            <span>{data.location || data.address}</span>
                        </>
                    ) : null}
                </div>

                {/* Thick Bold Line */}
                <div className="w-full h-1.5 bg-black mb-4"></div>

                {/* Headline Row */}
                <div className="flex justify-center gap-4 text-sm font-bold text-black uppercase tracking-wide">
                    {headlineSkills.map((skill, i) => (
                        <React.Fragment key={i}>
                            <span>{skill}</span>
                            {i < headlineSkills.length - 1 && <span>•</span>}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {/* Body */}
            <div className="text-justify leading-relaxed text-sm text-gray-800 font-sans flex-1">
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
                    <br />
                    Dear Hiring Manager,
                </div>

                {/* Main Content */}
                {isFallback ? (
                    <div className="whitespace-pre-wrap">{content.plainText}</div>
                ) : (
                    <>
                        <div className="mb-6 whitespace-pre-wrap">
                            {opening}
                        </div>

                        {/* Skills Grid */}
                        <div className="mb-8 space-y-4">
                            {skills.map((item, idx) => (
                                <div key={idx} className="flex gap-6 items-start">
                                    <div className="w-32 flex-shrink-0 font-bold text-black text-right pt-0.5">
                                        {item.skill}
                                    </div>
                                    <div className="flex-1 flex gap-2 items-start">
                                        <Check size={14} className="mt-1 text-black flex-shrink-0" />
                                        <span className="text-gray-700">{item.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="whitespace-pre-wrap">
                            {closing}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
