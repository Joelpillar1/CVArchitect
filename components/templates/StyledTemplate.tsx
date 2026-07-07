import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatDate as formatDateUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, CONTACT_SEPARATOR, formatJobTitleDisplay, isTitleFirst } from '../../utils/templateUtils';

interface StyledTemplateProps {
    data: ResumeData;
}

export default function StyledTemplate({ data }: StyledTemplateProps) {
    const { fontSizes } = data;
  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };
    const accentColor = data.accentColor || '#374151'; // Default to gray-700 if no accent
    const sectionGap = `${getSectionGapIn(data)}in`;
    const headerGap = `${getHeaderGapIn(data)}in`;
    const headerItemGap = `${getHeaderItemGapIn(data)}in`;
    const headerContactGap = `${getHeaderContactGapIn(data)}in`;

    // Helper for section headers
    const SectionHeader = ({ title }: { title: string }) => (
        <div
            className="text-center py-1 mt-0 mb-3 bg-gray-100 break-inside-avoid"
        >
            <h2
                className={`uppercase tracking-widest font-bold ${getSectionHeaderAlignment()}`}
                style={{
                    fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                    color: accentColor
                }}
            >
                {title}
            </h2>
        </div>
    );

    const formatDate = (dateString: string | null | undefined) => {
        return formatDateUtil(dateString);
    };

    const flexAlignment = data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start';
    const textAlignment = data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left';

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return data.summary && (
                    <section key="summary" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Professional Summary" />
                        <p className="text-justify">
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
                        <div>
                            {data.experience.map((exp, index) => (
                                <div
                                    key={exp.id}
                                    className="break-inside-avoid"
                                    style={{ marginBottom: index === data.experience.length - 1 ? 0 : sectionGap }}
                                >
                                    <div className="flex justify-between items-baseline font-bold text-gray-800 mb-1">
                                        <div className="flex-1">
                                            <span>{exp.role}</span>, <span className="italic text-gray-500">{exp.company}{exp.location && ` • ${exp.location}`}</span>
                                        </div>
                                        <div className="text-right whitespace-nowrap bg-white pl-2" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                                            {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                        </div>
                                    </div>
                                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                        {parseDescriptionBullets(exp.description).map((line, i) => (
                                            line.trim() && (
                                                <li key={i} className="pl-1 text-justify">
                                                    {line.replace(/^[•-]\s*/, '')}
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section >
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
                                        <div className="text-right" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.year}</div>
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
                                            <span>{exp.role}</span>, <span className="italic text-gray-500">{exp.company}</span>
                                        </div>
                                        <div className="text-right whitespace-nowrap bg-white pl-2 font-normal text-gray-600" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                                            {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                        </div>
                                    </div>
                                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                        {parseDescriptionBullets(exp.description).map((line, i) => (
                                            line.trim() && (
                                                <li key={i} className="pl-1 text-justify">
                                                    {line.replace(/^[•-]\s*/, '')}
                                                </li>
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
                                    <div style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{cert.date}</div>
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
                        <ul className="list-disc ml-5 space-y-1 text-gray-700">
                            {parseDescriptionBullets(data.keyAchievements).map((line, i) => (
                                line.trim() && (
                                    <li key={i} className="pl-1 text-justify">
                                        {line.replace(/^[\s•\-\*]+/, '')}
                                    </li>
                                )
                            ))}
                        </ul>
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
                                                <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm font-normal text-blue-600 underline">
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

    const uniqueSectionOrder = getNormalizedSectionOrder(sectionOrder, [
        'summary',
        'skills',
        'achievements',
        'experience',
        'leadership',
        'education',
        'certifications',
        'projects',
        'languages'
    ]);

    return (
        <div
            className="w-[210mm] min-h-[297mm] bg-white text-gray-800 mx-auto"
            style={{
                fontFamily: data.font ||"Georgia, 'Times New Roman', Times, serif",
                fontSize: `${fontSizes?.body || 9.5}pt`,
                lineHeight: data.lineHeight || 1.7,
                paddingTop: `${getMarginVerticalIn(data)}in`,
                paddingBottom: `${getMarginVerticalIn(data)}in`,
                paddingLeft: `${getMarginHorizontalIn(data)}in`,
                paddingRight: `${getMarginHorizontalIn(data)}in`,
            }}
        >
            {/* Header */}
            <div className={`${textAlignment}`} style={{ marginBottom: headerGap }}>
                <h1
                    className="text-4xl text-gray-800"
                    style={{ marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1,
                        fontSize: `${fontSizes?.header || 18}pt`,
                        color: accentColor
                    }}
                >
                    {formatNameDisplay(data.fullName, data.headerCase) ||"YOUR NAME"}
                </h1>

                {isTitleFirst(data, false) && data.jobTitle && (
                    <div>
                        <p
                            className="font-bold text-sm"
                            style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: accentColor }}
                        >
                            {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                        </p>
                    </div>
                )}
                <div className={`flex flex-wrap text-gray-600 ${flexAlignment}`} style={{ fontSize: `${fontSizes?.body || 9.5}pt`, gap: headerItemGap, marginBottom: headerContactGap }}>
                    {(() => {
                        const items: React.ReactNode[] = [];

                        if (data.location) {
                            items.push(<span key="location">{formatContactText(data.location)}</span>);
                        }
                        if (data.phone) {
                            items.push(<span key="phone">{formatContactText(data.phone)}</span>);
                        }
                        if (data.email) {
                            items.push(
                                <a key="email" href={`mailto:${formatContactText(data.email)}`}>
                                    {formatContactText(data.email)}
                                </a>
                            );
                        }
                        if (data.linkedin) {
                            items.push(
                                <a
                                    key="linkedin"
                                    href={getLinkedInHref(data.linkedin)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {formatLinkedInDisplay(data.linkedin)}
                                </a>
                            );
                        }

                        return items.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <span>{CONTACT_SEPARATOR}</span>}
                                {item}
                            </React.Fragment>
                        ));
                    })()}
                </div>

                {!isTitleFirst(data, false) && data.jobTitle && (
                    <div>
                        <p
                            className="font-bold text-sm"
                            style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: accentColor }}
                        >
                            {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                        </p>
                    </div>
                )}
            </div>

            {/* Dynamic Content */}
            {uniqueSectionOrder.map(section => renderSection(section))}
        </div>
    );
}
