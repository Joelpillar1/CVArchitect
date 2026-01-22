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
    // Fallback: If structured data is missing/empty, we try to use plain text or just show a warning.
    // Ideally the AI always returns structured data now.
    const { opening, skills, closing } = content.structured;
    const isFallback = !skills || skills.length === 0;

    // Headline skills
    const headlineSkills = data.skills
        ? data.skills.split(',').slice(0, 3).map(s => s.trim())
        : ['Professional', 'Experienced', 'Dedicated'];

    return (
        <div className="w-full bg-white text-gray-900 font-sans p-[0.3in] mx-auto relative shadow-sm flex flex-col" style={{ maxWidth: '210mm' }}>
            {/* Header - Identical to Bold Template */}
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

                {/* Headline Row */}
                <div className="flex justify-center items-center flex-nowrap gap-x-4 text-sm font-bold text-black uppercase tracking-wide whitespace-nowrap">
                    {headlineSkills.map((skill, i) => (
                        <React.Fragment key={i}>
                            <span className="whitespace-nowrap">{skill}</span>
                            {i < headlineSkills.length - 1 && <span>•</span>}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {/* Body */}
            <div className="text-justify leading-relaxed text-sm text-gray-800 font-sans flex-1">
                {/* Main Content */}
                {isFallback ? (
                    <div className="space-y-4">
                        {content.plainText
                            .split(/\n\s*\n/)
                            .map(block => block.split(/\n/).filter(line => line.trim()).join(' '))
                            .filter(p => p.trim())
                            .map((paragraph, idx) => (
                                <p key={idx} className="mb-4 last:mb-0">
                                    {paragraph.trim()}
                                </p>
                            ))}
                    </div>
                ) : (
                    <>
                        <p className="mb-6">
                            {opening}
                        </p>

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

                        <p className="mb-0">
                            {closing}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
