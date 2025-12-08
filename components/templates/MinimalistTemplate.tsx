import React from 'react';
import { ResumeData } from '../../types';

interface MinimalistTemplateProps {
    data: ResumeData;
}

export default function MinimalistTemplate({ data }: MinimalistTemplateProps) {
    const { fontSizes } = data;
    const accentColor = data.accentColor || '#000000';
    const sectionGap = data.sectionGap !== undefined ? `${data.sectionGap}rem` : '1.5rem';
    const headerGap = data.headerGap !== undefined ? `${data.headerGap}rem` : '2.5rem';
    const headerItemGap = data.headerItemGap !== undefined ? `${data.headerItemGap}rem` : '0.25rem';

    // Helper for section headers with background
    const SectionHeader = ({ title }: { title: string }) => (
        <div className={`bg-[#F4F7FA] ${bodyAlignmentClass} py-1 mt-0 mb-4 break-inside-avoid px-4`}>
            <h2
                className="uppercase tracking-[0.15em] font-normal font-serif"
                style={{
                    fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                    color: accentColor
                }}
            >
                {title}
            </h2>
        </div>
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        if (dateString.toLowerCase() === 'present') return "Present";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const flexAlignment = data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start';
    const textAlignment = data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left';

    // Body alignment (section headers and content where applicable)
    const bodyAlignmentClass = data.bodyHeaderAlignment === 'center' ? 'text-center' : data.bodyHeaderAlignment === 'right' ? 'text-right' : 'text-left';
    const bodyFlexAlignment = data.bodyHeaderAlignment === 'center' ? 'justify-center' : data.bodyHeaderAlignment === 'right' ? 'justify-end' : 'justify-start';

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return data.summary && (
                    <section key="summary" style={{ marginBottom: sectionGap }}>
                        <p className={`leading-relaxed max-w-4xl mx-auto ${textAlignment}`}>
                            {data.summary}
                        </p>
                    </section>
                );
            case 'skills':
                return data.skills && (
                    <section key="skills" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Areas of Expertise" />
                        <div className={`grid ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-x-4 gap-y-2 ${bodyAlignmentClass}`}>
                            {data.skills.split(',').map((skill, index) => (
                                <div key={index} className="text-black">
                                    {skill.trim()}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'experience':
                return data.experience && data.experience.length > 0 && (
                    <section key="experience" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Professional Experience" />
                        <div className="space-y-8">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-2 font-bold text-black tracking-wide">
                                        <div className="text-base">
                                            {exp.role} <span className="mx-1">|</span> {exp.company}
                                        </div>
                                        <div className="whitespace-nowrap font-serif">
                                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <div className="mt-1">
                                            <div className="mb-2 text-justify">
                                                {exp.description.split('\n').filter(l => !l.trim().startsWith('•') && !l.trim().startsWith('-') && l.trim()).join(' ')}
                                            </div>

                                            <ul className="list-disc ml-8 space-y-1 text-black">
                                                {exp.description.split('\n').map((line, i) => (
                                                    (line.trim().startsWith('•') || line.trim().startsWith('-')) && (
                                                        <li key={i} className="pl-2">{line.replace(/^[•-]\s*/, '')}</li>
                                                    )
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'education':
                return data.education && data.education.length > 0 && (
                    <section key="education" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Education" />
                        <div className="space-y-2 mt-4">
                            {data.education.map((edu) => (
                                <div key={edu.id} className={`break-inside-avoid ${bodyAlignmentClass}`}>
                                    <div className="font-bold tracking-wide text-black inline-block">
                                        {edu.degree}, {edu.school}
                                    </div>
                                    <span className="mx-2 text-gray-400">|</span>
                                    <div className="inline-block">
                                        City, ST
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'leadership':
                return data.leadership && data.leadership.length > 0 && (
                    <section key="leadership" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Leadership Experience" />
                        <div className="space-y-8">
                            {data.leadership.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-2 font-bold text-black tracking-wide">
                                        <div className="text-base">
                                            {exp.role} <span className="mx-1">|</span> {exp.company}
                                        </div>
                                        <div className="whitespace-nowrap font-serif">
                                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <div className="mt-1">
                                            <ul className="list-disc ml-8 space-y-1 text-black">
                                                {exp.description.split('\n').map((line, i) => (
                                                    line.trim() && (
                                                        <li key={i} className="pl-2">{line.replace(/^[•-]\s*/, '')}</li>
                                                    )
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section key="certifications" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Certifications" />
                        <div className={`space-y-1 ${bodyAlignmentClass}`}>
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="break-inside-avoid">
                                    <span className="font-bold">{cert.name}</span>
                                    <span className="mx-2">|</span>
                                    <span>{cert.issuer}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'projects':
                return data.projects && data.projects.length > 0 && (
                    <section key="projects" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Projects" />
                        <div className="space-y-4">
                            {data.projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline font-bold text-gray-800 mb-1">
                                        <div className="flex-1">
                                            <span className="italic">{project.name}</span>
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm font-normal text-blue-600 underline">
                                                    Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'languages':
                return data.languages && data.languages.length > 0 && (
                    <section key="languages" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Languages" />
                        <div className="flex justify-center flex-wrap gap-4">
                            {data.languages.map((lang) => (
                                <div key={lang.id} className="flex items-center gap-2">
                                    <span className="font-bold">{lang.language}</span>
                                    <span className="text-gray-600">({lang.proficiency})</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'keyAchievements':
            case 'achievements':
                return data.keyAchievements && (
                    <section key="keyAchievements" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Key Achievements" />
                        <ul className="list-disc ml-8 space-y-2 text-black">
                            {data.keyAchievements.split('\n').map((achievement, index) => (
                                achievement.trim() && (
                                    <li key={index} className="pl-2 leading-relaxed">
                                        {achievement.replace(/^[•-]\s*/, '')}
                                    </li>
                                )
                            ))}
                        </ul>
                    </section>
                );
            default:
                return null;
        }
    }

    const sectionOrder = data.sectionOrder || [
        'summary',
        'skills',
        'experience',
        'leadership',
        'education',
        'certifications',
        'projects',
        'languages'
    ];

    // Deduplicate and normalize section order handling aliases
    const uniqueSectionOrder = Array.from(new Set(sectionOrder.map(s =>
        s === 'achievements' ? 'keyAchievements' : s
    )));

    return (
        <div
            className="w-[210mm] min-h-[297mm] bg-white text-gray-900 mx-auto"
            style={{
                fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
                fontSize: `${fontSizes?.body || 10.5}pt`,
                lineHeight: data.lineHeight || 1.6,
                paddingTop: `${data.margins?.vertical || 1}in`,
                paddingBottom: `${data.margins?.vertical || 1}in`,
                paddingLeft: `${data.margins?.horizontal || 1}in`,
                paddingRight: `${data.margins?.horizontal || 1}in`,
            }}
        >
            {/* Header */}
            <div className={`${textAlignment}`} style={{ marginBottom: headerGap }}>
                <h1
                    className="font-normal text-5xl mb-4 text-black"
                    style={{
                        fontSize: `${fontSizes?.header || 38}pt`,
                        fontFamily: "Georgia, serif",
                        color: accentColor
                    }}
                >
                    {data.fullName || "YOUR NAME"}
                </h1>

                <div className="text-black uppercase tracking-[0.2em] text-sm mb-6 font-sans" style={{ fontSize: `${fontSizes?.jobTitle || 11}pt` }}>
                    {data.jobTitle || "PROFESSIONAL TITLE"}
                </div>

                <div className={`flex flex-wrap text-black text-sm font-serif italic ${flexAlignment}`} style={{ gap: headerItemGap }}>
                    {data.location && (
                        <>
                            <span>{data.location}</span>
                            <span className="mx-2">|</span>
                        </>
                    )}
                    {data.email && (
                        <>
                            <a href={`mailto:${data.email}`} className="text-black no-underline">{data.email}</a>
                            {(data.phone || data.linkedin) && <span className="mx-2">|</span>}
                        </>
                    )}
                    {data.phone && (
                        <>
                            <span>{data.phone}</span>
                            {data.linkedin && <span className="mx-2">|</span>}
                        </>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-black underline">
                            LinkedIn
                        </a>
                    )}
                </div>
            </div>

            {/* Dynamic Content */}
            {uniqueSectionOrder.map(section => renderSection(section))}
        </div>
    );
}
