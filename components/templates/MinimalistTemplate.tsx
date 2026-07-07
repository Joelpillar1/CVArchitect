import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatDate as formatDateUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, splitSkillsIntoColumns, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, CONTACT_SEPARATOR, formatJobTitleDisplay} from '../../utils/templateUtils';

interface MinimalistTemplateProps {
    data: ResumeData;
}

export default function MinimalistTemplate({ data }: MinimalistTemplateProps) {
    const { fontSizes } = data;
    const accentColor = data.accentColor || '#000000';
    const sectionGap = `${getSectionGapIn(data)}in`;
    const headerGap = `${getHeaderGapIn(data)}in`;
    const headerItemGap = `${getHeaderItemGapIn(data)}in`;
    const headerContactGap = `${getHeaderContactGapIn(data)}in`;
    const skillColumns = splitSkillsIntoColumns(data.skills || '', data.skillsColumnCount || 3);

    // Helper for section headers with background
    const SectionHeader = ({ title }: { title: string }) => (
        <div className={`bg-[#F4F7FA] ${bodyAlignmentClass} py-1.5 mb-4 px-4 -mx-4 rounded-sm`}>
            <h2
                className="uppercase tracking-[0.15em] font-normal text-sm"
                style={{
                    color: accentColor,
                    fontSize: `${fontSizes?.sectionTitle || 11}pt`
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

    // Body alignment (section headers and content where applicable)
    const bodyAlignmentClass = data.bodyHeaderAlignment === 'center' ? 'text-center' : data.bodyHeaderAlignment === 'right' ? 'text-right' : 'text-left';
    const bodyFlexAlignment = data.bodyHeaderAlignment === 'center' ? 'justify-center' : data.bodyHeaderAlignment === 'right' ? 'justify-end' : 'justify-start';

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return data.summary && (
                    <section key="summary" style={{ marginBottom: sectionGap }}>
                        <p className={`max-w-4xl mx-auto ${textAlignment}`}>
                            {data.summary}
                        </p>
                    </section>
                );
            case 'skills':
                return data.skills && (
                    <section key="skills" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Areas of Expertise" />
                        <div className={`grid ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-x-4 gap-y-2 ${bodyAlignmentClass}`}>
                            {skillColumns.map((col, colIndex) => (
                                <ul key={colIndex} className={`${BULLET_LIST_CLASS} text-black`}>
                                    {col.map((skill, i) => (
                                        <li key={i} className="pl-2">{skill}</li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </section>
                );
            case 'experience':
                return data.experience && data.experience.length > 0 && (
                    <section key="experience" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Professional Experience" />
                        <div>
                            {data.experience.map((exp, index) => {
                                const bullets = parseDescriptionBullets(exp.description);
                                return (
                                    <div
                                        key={exp.id}
                                        className="break-inside-avoid"
                                        style={{ marginBottom: index === data.experience.length - 1 ? 0 : sectionGap }}
                                    >
                                        <div className="flex justify-between items-baseline mb-2 font-bold text-black tracking-wide">
                                            <div className="text-base">
                                                {exp.role} <span className="mx-1">{CONTACT_SEPARATOR}</span> {exp.company}
                                            </div>
                                            <div className="whitespace-nowrap">
                                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                            </div>
                                        </div>

                                        {bullets.length > 0 && (
                                            <ul className="list-disc ml-5 space-y-1.5 text-black">
                                                {bullets.map((line, i) =>
                                                    line.trim() && (
                                                        <li key={i} className="pl-2">
                                                            {line.replace(/^[•-]\s*/, '')}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
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
                        <div className="space-y-6">
                            {data.leadership.map((exp) => {
                                const bullets = parseDescriptionBullets(exp.description);
                                return (
                                    <div key={exp.id} className="break-inside-avoid">
                                        <div className="flex justify-between items-baseline mb-2 font-bold text-black tracking-wide">
                                            <div className="text-base">
                                                {exp.role} <span className="mx-1">{CONTACT_SEPARATOR}</span> {exp.company}
                                            </div>
                                            <div className="whitespace-nowrap">
                                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                            </div>
                                        </div>

                                        {bullets.length > 0 && (
                                            <ul className="list-disc ml-5 space-y-1.5 text-black">
                                                {bullets.map((line, i) =>
                                                    line.trim() && (
                                                        <li key={i} className="pl-2">
                                                            {line.replace(/^[•-]\s*/, '')}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
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
                                    <span className="mx-0.5">{CONTACT_SEPARATOR}</span>
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
            case 'achievements': {
                const achievements = parseAchievementBullets(data.keyAchievements || '');
                return achievements.length > 0 && (
                    <section key="keyAchievements" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Key Achievements" />
                        <ul className="list-disc ml-5 space-y-2 text-black">
                            {achievements.map((achievement, index) => (
                                achievement.trim() && (
                                    <li key={index} className="pl-2">
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

    const uniqueSectionOrder = getNormalizedSectionOrder(sectionOrder, [
        'summary',
        'skills',
        'experience',
        'leadership',
        'education',
        'certifications',
        'projects',
        'languages'
    ]);

    return (
        <div
            className="w-[210mm] min-h-[297mm] bg-white text-gray-900 mx-auto"
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
                    className="font-normal text-5xl text-black"
                    style={{
                        fontSize: `${fontSizes?.header || 18}pt`,
                        color: accentColor,
                        marginBottom: headerItemGap, lineHeight: 1.1,
                    }}
                >
                    {formatNameDisplay(data.fullName, data.headerCase) ||"YOUR NAME"}
                </h1>

                <div className={`flex flex-wrap text-black italic ${flexAlignment}`} style={{ fontSize: `${fontSizes?.body || 9.5}pt`, gap: headerItemGap, marginBottom: headerContactGap }}>
                    {data.location && (
                        <>
                            <span>{formatContactText(data.location)}</span>
                            <span className="mx-0.5">{CONTACT_SEPARATOR}</span>
                        </>
                    )}
                    {data.email && (
                        <>
                            <a href={`mailto:${formatContactText(data.email)}`} className="text-black no-underline">{formatContactText(data.email)}</a>
                            {(data.phone || data.linkedin) && <span className="mx-0.5">{CONTACT_SEPARATOR}</span>}
                        </>
                    )}
                    {data.phone && (
                        <>
                            <span>{formatContactText(data.phone)}</span>
                            {data.linkedin && <span className="mx-0.5">{CONTACT_SEPARATOR}</span>}
                        </>
                    )}
                    {data.linkedin && (
                        <a href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" className="text-black underline">
                            {formatLinkedInDisplay(data.linkedin)}
                        </a>
                    )}
                </div>

                <div className="text-sm" style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: accentColor }}>
                    {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase) ||"JOB TITLE"}
                </div>
            </div>

            {/* Dynamic Content */}
            {uniqueSectionOrder.map(section => renderSection(section))}
        </div>
    );
}
