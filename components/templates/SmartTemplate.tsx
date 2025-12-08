import React from 'react';
import { ResumeData } from '../../types';

interface SmartTemplateProps {
    data: ResumeData;
}

export default function SmartTemplate({ data }: SmartTemplateProps) {
    const { fontSizes } = data;
    const accentColor = data.accentColor || '#000000';
    const sectionGap = data.sectionGap !== undefined ? `${data.sectionGap}in` : '0.25in';
    const headerGap = data.headerGap !== undefined ? `${data.headerGap}in` : '0.3in';
    const headerItemGap = data.headerItemGap !== undefined ? `${data.headerItemGap}in` : '0.1in';

    const bodyAlignment = data.bodyHeaderAlignment || 'left';

    // Helper for section headers with dotted line
    const SectionHeader = ({ title }: { title: string }) => (
        <div className="flex items-center gap-3 mb-3 mt-0 break-inside-avoid">
            {(bodyAlignment === 'center' || bodyAlignment === 'right') && (
                <div className="flex-1 border-b-[2px] border-dotted border-gray-400 relative top-[1px]"></div>
            )}
            <h2
                className="uppercase tracking-widest font-bold font-serif whitespace-nowrap"
                style={{
                    fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                    color: accentColor
                }}
            >
                {title}
            </h2>
            {(bodyAlignment === 'center' || bodyAlignment === 'left') && (
                <div className="flex-1 border-b-[2px] border-dotted border-gray-400 relative top-[1px]"></div>
            )}
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


    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return data.summary && (
                    <section key="summary" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Professional Summary" />
                        <p className="text-justify leading-relaxed">
                            {data.summary}
                        </p>
                    </section>
                );
            case 'skills':
                return data.skills && (
                    <section key="skills" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Areas of Expertise" />
                        <div className={`grid ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-x-2 gap-y-1`}>
                            {data.skills.split(',').map((skill, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    <span style={{ color: accentColor }} className="text-[10px] leading-none">•</span>
                                    <span className="truncate">{skill.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'experience':
                return data.experience && data.experience.length > 0 && (
                    <section key="experience" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Professional Experience" />
                        <div className="space-y-6">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    {/* Line 1: Job Title | Start - End */}
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <div className="font-bold text-black" style={{ fontSize: `${(fontSizes?.body || 10.5) + 0.5}pt` }}>
                                            {exp.role} <span className="font-normal mx-1">|</span> <span className="font-normal">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                                        </div>
                                    </div>

                                    {/* Line 2: Company Name, City */}
                                    <div className="font-bold text-black mb-2" style={{ color: accentColor }}>
                                        {exp.company}, {exp.location}
                                    </div>

                                    {/* Description */}
                                    {exp.description && (
                                        <div className="pl-2">
                                            <ul className="list-disc ml-4 space-y-1 text-gray-800 marker:text-black">
                                                {exp.description.split('\n').map((line, i) => (
                                                    line.trim() && (
                                                        <li key={i} className="pl-1">{line.replace(/^[•-]\s*/, '')}</li>
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
                        <div className="space-y-2">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid">
                                    <div className="text-black">
                                        <span className="font-bold">{edu.degree}</span>, {edu.school} | {edu.year}
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
                        <div className="space-y-6">
                            {data.leadership.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <div className="font-bold text-black" style={{ fontSize: `${(fontSizes?.body || 10.5) + 0.5}pt` }}>
                                            {exp.role} <span className="font-normal mx-1">|</span> <span className="font-normal">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                                        </div>
                                    </div>
                                    <div className="font-bold text-black mb-2" style={{ color: accentColor }}>
                                        {exp.company}, {exp.location}
                                    </div>
                                    <ul className="list-disc ml-6 space-y-1 text-gray-800 marker:text-black">
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() && (
                                                <li key={i} className="pl-1">{line.replace(/^[•-]\s*/, '')}</li>
                                            )
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section key="certifications" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Certifications" />
                        <div className="space-y-1">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="break-inside-avoid">
                                    <div>
                                        <span className="font-bold">{cert.name}</span>, {cert.issuer} | {cert.date}
                                    </div>
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
                                            <span className="font-bold" style={{ color: accentColor }}>{project.name}</span>
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
            case 'keyAchievements':
            case 'achievements':
                return data.keyAchievements && (
                    <section key="keyAchievements" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Key Achievements" />
                        <ul className="list-disc ml-6 space-y-2 text-gray-800 marker:text-black">
                            {data.keyAchievements.split('\n').map((achievement, index) => (
                                achievement.trim() && (
                                    <li key={index} className="pl-1 leading-relaxed">
                                        {achievement.replace(/^[•-]\s*/, '')}
                                    </li>
                                )
                            ))}
                        </ul>
                    </section>
                );
            case 'languages':
                return data.languages && data.languages.length > 0 && (
                    <section key="languages" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Languages" />
                        <div className="flex flex-wrap gap-4">
                            {data.languages.map((lang) => (
                                <div key={lang.id} className="flex items-center gap-2">
                                    <span className="font-bold">{lang.language}</span>
                                    <span className="text-gray-600">({lang.proficiency})</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            default:
                return null;
        }
    }

    const sectionOrder = data.sectionOrder || [
        'summary',
        'keyAchievements',
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
            className="w-[210mm] min-h-[297mm] bg-white text-gray-800 mx-auto"
            style={{
                fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
                fontSize: `${fontSizes?.body || 10.5}pt`,
                lineHeight: data.lineHeight || 1.4,
                paddingTop: `${data.margins?.vertical || 0.8}in`,
                paddingBottom: `${data.margins?.vertical || 0.8}in`,
                paddingLeft: `${data.margins?.horizontal || 0.8}in`,
                paddingRight: `${data.margins?.horizontal || 0.8}in`,
            }}
        >
            {/* Header */}
            <div className={`${textAlignment}`} style={{ marginBottom: headerGap }}>
                <h1
                    className="font-bold text-4xl mb-2 text-black"
                    style={{
                        fontSize: `${fontSizes?.header || 32}pt`,
                        color: accentColor
                    }}
                >
                    {data.fullName || "YOUR NAME"}
                </h1>

                <div className="text-gray-500 text-lg mb-3 font-serif" style={{ fontSize: `${fontSizes?.jobTitle || 12}pt` }}>
                    {data.jobTitle || "Professional Title"}
                </div>

                <div className={`flex flex-wrap text-black text-sm border-t-0 pt-0 ${flexAlignment}`} style={{ gap: headerItemGap }}>
                    {/* Phone | City, ST | Email | LinkedIn */}
                    {data.phone && (
                        <>
                            <span>{data.phone}</span>
                            <span className="mx-1">|</span>
                        </>
                    )}
                    {data.location && (
                        <>
                            <span>{data.location}</span>
                            <span className="mx-1">|</span>
                        </>
                    )}
                    {data.email && (
                        <>
                            <a href={`mailto:${data.email}`} className="text-black no-underline">{data.email}</a>
                            {data.linkedin && <span className="mx-1">|</span>}
                        </>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-black no-underline">
                            {data.linkedin.replace(/^https?:\/\//, '')}
                        </a>
                    )}
                </div>
            </div>

            {/* Dynamic Content */}
            {uniqueSectionOrder.map(section => renderSection(section))}
        </div>
    );
}
