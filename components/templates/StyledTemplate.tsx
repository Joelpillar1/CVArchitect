import React from 'react';
import { ResumeData } from '../../types';

interface StyledTemplateProps {
    data: ResumeData;
}

export default function StyledTemplate({ data }: StyledTemplateProps) {
    const { fontSizes } = data;
    const accentColor = data.accentColor || '#374151'; // Default to gray-700 if no accent
    const sectionGap = data.sectionGap !== undefined ? `${data.sectionGap}rem` : '1rem';
    const headerGap = data.headerGap !== undefined ? `${data.headerGap}rem` : '1.5rem';
    const headerItemGap = data.headerItemGap !== undefined ? `${data.headerItemGap}rem` : '0.5rem';

    // Helper for section headers
    const SectionHeader = ({ title }: { title: string }) => (
        <div
            className="text-center py-1 mt-0 mb-3 bg-gray-100 break-inside-avoid"
        >
            <h2
                className="uppercase tracking-widest font-bold font-serif"
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
                        <div className={`grid ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-x-4 gap-y-1`}>
                            {data.skills.split(',').map((skill, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span style={{ color: accentColor }} className="text-xs mt-[2px]">✓</span>
                                    <span>{skill.trim()}</span>
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
                                    <div className="flex justify-between items-baseline font-bold text-gray-800 mb-1">
                                        <div className="flex-1">
                                            <span className="italic">{exp.role}</span>, {exp.company}
                                        </div>
                                        <div className="text-right whitespace-nowrap text-sm bg-white pl-2">
                                            {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                        </div>
                                    </div>
                                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim().startsWith('•') || line.trim().startsWith('-') ? (
                                                <li key={i} className="pl-1">{line.replace(/^[•-]\s*/, '')}</li>
                                            ) : line.trim() ? (
                                                <div key={i} className="list-none -ml-5 mb-2 italic text-gray-600 block">
                                                    {line}
                                                </div>
                                            ) : null
                                        ))}
                                    </ul>
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
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-bold">{edu.degree}</span>, {edu.school}
                                        </div>
                                        <div className="text-right">{edu.year}</div>
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
                        <div className="space-y-4">
                            {data.leadership.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline font-bold text-gray-800 mb-1">
                                        <div className="flex-1">
                                            <span className="italic">{exp.role}</span>, {exp.company}
                                        </div>
                                        <div className="text-right whitespace-nowrap text-sm bg-white pl-2">
                                            {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                        </div>
                                    </div>
                                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
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
                        <SectionHeader title="Training & Certifications" />
                        <div className="space-y-1">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="break-inside-avoid flex justify-between">
                                    <div>
                                        <span className="font-bold">{cert.name}</span>, {cert.issuer}
                                    </div>
                                    <div>{cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'achievements': // Mapped to Career Highlights
            case 'keyAchievements':
                return data.keyAchievements && (
                    <section key="achievements" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Career Highlights" />
                        <div className="space-y-2">
                            {data.keyAchievements.split('\n').map((line, i) => {
                                if (!line.trim()) return null;
                                const parts = line.split(':');
                                const title = parts.length > 1 ? parts[0] + ':' : '';
                                const content = parts.length > 1 ? parts.slice(1).join(':') : line;
                                return (
                                    <div key={i} className="text-justify">
                                        {title && <span className="font-bold mr-1">{title}</span>}
                                        <span>{content}</span>
                                    </div>
                                );
                            })}
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
    };

    const sectionOrder = data.sectionOrder || [
        'summary',
        'skills',
        'achievements',
        'experience',
        'leadership',
        'education',
        'certifications',
        'projects',
        'languages'
    ];

    return (
        <div
            className="w-[210mm] min-h-[297mm] bg-white text-gray-800 mx-auto"
            style={{
                fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
                fontSize: `${fontSizes?.body || 10}pt`,
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
                    className="uppercase tracking-widest text-4xl mb-4 text-gray-800"
                    style={{
                        fontSize: `${fontSizes?.header || 28}pt`,
                        color: accentColor
                    }}
                >
                    {data.fullName || "YOUR NAME"}
                </h1>

                <div className={`flex flex-wrap text-gray-600 uppercase tracking-wider text-xs mb-6 ${flexAlignment}`} style={{ gap: headerItemGap }}>
                    {data.location && <span>{data.location}</span>}
                    {data.location && data.phone && <span>|</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.phone && data.email && <span>|</span>}
                    {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
                    {data.email && data.linkedin && <span>|</span>}
                    {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN PROFILE</a>}
                </div>

                <div className="border-t border-b border-gray-400 py-3 mb-6">
                    <p className="uppercase tracking-[0.2em] font-bold text-gray-700 text-sm" style={{ fontSize: `${fontSizes?.jobTitle || 11}pt` }}>
                        {data.jobTitle || "PROFESSIONAL TITLE"}
                    </p>
                </div>
            </div>

            {/* Dynamic Content */}
            {sectionOrder.map(section => renderSection(section))}
        </div>
    );
}
