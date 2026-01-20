import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets } from '../../utils/templateUtils';

interface ElegantTemplateProps {
    data: ResumeData;
}

export default function ElegantTemplate({ data }: ElegantTemplateProps) {
    const { fontSizes } = data;
    const accentColor = data.accentColor || '#1a237e'; // Navy blue from image
    const sectionGap = data.sectionGap !== undefined ? `${data.sectionGap}in` : '0.25in';
    const headerGap = data.headerGap !== undefined ? `${data.headerGap}in` : '0.3in';
    const headerItemGap = data.headerItemGap !== undefined ? `${data.headerItemGap}in` : '0.1in';

    const bodyAlignment = data.bodyHeaderAlignment || 'center';

    // Helper for section headers with centered dashed lines
    const SectionHeader = ({ title }: { title: string }) => (
        <div className="flex items-center gap-4 mb-4 mt-0 break-inside-avoid">
            {(bodyAlignment === 'center' || bodyAlignment === 'right') && (
                <div className="flex-1 border-t border-dashed border-gray-400"></div>
            )}
            <h2
                className="uppercase tracking-[0.2em] font-bold font-serif whitespace-nowrap"
                style={{
                    fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                    color: accentColor
                }}
            >
                {title}
            </h2>
            {(bodyAlignment === 'center' || bodyAlignment === 'left') && (
                <div className="flex-1 border-t border-dashed border-gray-400"></div>
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
                        <p className="text-justify leading-relaxed text-gray-700">
                            {data.summary}
                        </p>
                    </section>
                );
            case 'skills':
                return data.skills && (
                    <section key="skills" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Areas of Expertise" />
                        <div className={`grid ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-x-8 gap-y-2`}>
                            {data.skills.split(',').map((skill, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full sticky top-2" style={{ backgroundColor: accentColor }}></span>
                                    <span className="text-gray-700">{skill.trim()}</span>
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
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-gray-800 text-lg">
                                            {exp.role.toUpperCase()}
                                            <span className="font-normal text-gray-600 mx-1">,</span>
                                            <span className="font-normal text-gray-600">{exp.company}</span>
                                            {exp.location && <span className="font-normal text-gray-600"> | {exp.location}</span>}
                                        </div>
                                        <div className="text-gray-600 whitespace-nowrap ml-4">
                                            {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <div className="mt-2">
                                            <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                                {descriptionToString(exp.description).split('\n').map((line, i) => (
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
                                    <div className="flex justify-between text-gray-800">
                                        <div>
                                            <span className="font-bold">{edu.degree}</span>, {edu.school}
                                        </div>
                                        <div className="text-gray-600 italic">{edu.year}</div>
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
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-gray-800 text-lg">
                                            {exp.role.toUpperCase()}
                                            <span className="font-normal text-gray-600 mx-1">,</span>
                                            <span className="font-normal text-gray-600">{exp.company}</span>
                                        </div>
                                        <div className="text-gray-600 whitespace-nowrap ml-4">
                                            {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                        </div>
                                    </div>
                                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                        {descriptionToString(exp.description).split('\n').map((line, i) => (
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
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-800">{cert.name}</span>
                                        <span className="text-gray-600">{cert.date}</span>
                                    </div>
                                    <div className="text-gray-600 text-sm">{cert.issuer}</div>
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
            case 'keyAchievements':
            case 'achievements': {
                const achievements = parseAchievementBullets(data.keyAchievements || '');
                return achievements.length > 0 && (
                    <section key="keyAchievements" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Key Achievements" />
                        <ul className="list-disc ml-5 space-y-1 text-gray-700">
                            {achievements.map((achievement, index) => (
                                achievement.trim() && (
                                    <li key={index} className="pl-1 leading-relaxed">
                                        {achievement.replace(/^[•-]\s*/, '')}
                                    </li>
                                )
                            ))}
                        </ul>
                    </section>
                );
            }
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
            className="w-[210mm] min-h-[297mm] bg-white text-gray-800 relative mx-auto"
            style={{
                fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
                fontSize: `${fontSizes?.body || 10.5}pt`,
                lineHeight: data.lineHeight || 1.5,
                paddingTop: `${data.margins?.vertical || 1.25}in`,
                paddingBottom: `${data.margins?.vertical || 1.25}in`,
                paddingLeft: `${data.margins?.horizontal || 1}in`,
                paddingRight: `${data.margins?.horizontal || 1}in`,
            }}
        >
            {/* Header - Centered by design in this template, but we can respect alignment roughly */}
            <div className={`${textAlignment}`} style={{ marginBottom: headerGap }}>
                <h1
                    className="font-normal text-5xl mb-3"
                    style={{
                        fontSize: `${fontSizes?.header || 36}pt`,
                        color: accentColor,
                        fontFamily: "Inter, sans-serif"
                    }}
                >
                    {data.fullName || "Your Name"}
                </h1>

                <div className="text-gray-600 uppercase tracking-widest text-sm mb-3 font-bold" style={{ fontSize: `${fontSizes?.jobTitle || 11}pt` }}>
                    {data.jobTitle || "PROFESSIONAL TITLE"}
                </div>

                <div className={`flex flex-wrap text-gray-600 text-sm ${flexAlignment}`} style={{ gap: headerItemGap }}>
                    {data.phone && (
                        <>
                            <span>{data.phone}</span>
                            <span className="mx-2">|</span>
                        </>
                    )}
                    {data.email && (
                        <>
                            <a href={`mailto:${data.email}`} className="text-gray-600 no-underline">{data.email}</a>
                            {(data.location || data.linkedin) && <span className="mx-2">|</span>}
                        </>
                    )}
                    {data.location && (
                        <>
                            <span>{data.location}</span>
                            {data.linkedin && <span className="mx-2">|</span>}
                        </>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 no-underline">
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
