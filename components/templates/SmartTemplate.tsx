import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatDate as formatDateUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, CONTACT_SEPARATOR, formatJobTitleDisplay} from '../../utils/templateUtils';

interface SmartTemplateProps {
    data: ResumeData;
}

export default function SmartTemplate({ data }: SmartTemplateProps) {
    const { fontSizes } = data;
    const accentColor = data.accentColor || '#000000';
    const sectionGap = `${getSectionGapIn(data)}in`;
    const headerGap = `${getHeaderGapIn(data)}in`;
    const headerItemGap = `${getHeaderItemGapIn(data)}in`;
    const headerContactGap = `${getHeaderContactGapIn(data)}in`;

    const bodyAlignment = data.bodyHeaderAlignment || 'left';

    // Helper for section headers with dotted line
    const SectionHeader = ({ title }: { title: string }) => (
        <div className="flex items-center gap-3 mb-3 mt-0 break-inside-avoid">
            {(bodyAlignment === 'center' || bodyAlignment === 'right') && (
                <div className="flex-1 border-b-[2px] border-dotted border-gray-400 relative top-[1px]"></div>
            )}
            <h2
                className="uppercase tracking-widest font-bold whitespace-nowrap"
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
            case 'skills': {
                if (!data.skills) return null;
                const skillsList = data.skills.split(',').map(s => s.trim()).filter(s => s);
                const columnCount = data.skillsColumnCount === 2 ? 2 : 3;
                const itemsPerColumn = Math.ceil(skillsList.length / columnCount);
                const skillColumns: string[][] = [];
                for (let i = 0; i < columnCount; i++) {
                    skillColumns.push(skillsList.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
                }
                return (
                    <section key="skills" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Areas of Expertise" />
                        <div className={`grid ${columnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-x-6`}>
                            {skillColumns.map((column, colIndex) => (
                                <ul key={colIndex} className="list-disc ml-5 space-y-2 text-gray-800 marker:text-black">
                                    {column.map((skill, index) => (
                                        <li key={index} className="pl-1">
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </section>
                );
            }
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
                                    {/* Line 1: Job Title | Start - End */}
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <div className="font-bold text-black" style={{ fontSize: `${(fontSizes?.body || 9.5) + 0.5}pt` }}>
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
                                            <ul className="list-disc ml-5 space-y-1 text-gray-800 marker:text-black">
                                                {parseDescriptionBullets(exp.description).map((line, i) => (
                                                    line && (
                                                        <li key={i} className="pl-1">{line}</li>
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
                                        <span className="font-bold">{edu.degree}</span>, {edu.school} | <span style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.year}</span>
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
                                        <div className="font-bold text-black" style={{ fontSize: `${(fontSizes?.body || 9.5) + 0.5}pt` }}>
                                            {exp.role} <span className="font-normal mx-1">|</span> <span className="font-normal">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                                        </div>
                                    </div>
                                    <div className="font-bold text-black mb-2" style={{ color: accentColor }}>
                                        {exp.company}, {exp.location}
                                    </div>
                                    <ul className="list-disc ml-5 space-y-1 text-gray-800 marker:text-black">
                                        {parseDescriptionBullets(exp.description).map((line, i) => (
                                            line && (
                                                <li key={i} className="pl-1">{line}</li>
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
            case 'keyAchievements':
            case 'achievements':
                return data.keyAchievements && (
                    <section key="keyAchievements" style={{ marginBottom: sectionGap }}>
                        <SectionHeader title="Key Achievements" />
                        <ul className="list-disc ml-5 space-y-2 text-gray-800 marker:text-black">
                            {parseDescriptionBullets(data.keyAchievements).map((achievement, index) => (
                                achievement && (
                                    <li key={index} className="pl-1">
                                        {achievement}
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
                    className="font-bold text-4xl  text-black"
                    style={{
                        fontSize: `${fontSizes?.header || 18}pt`,
                        color: accentColor,
                        marginBottom: headerItemGap, lineHeight: 1.1,
                    }}
                >
                    {formatNameDisplay(data.fullName, data.headerCase) ||"YOUR NAME"}
                </h1>

                <div className={`flex flex-wrap text-black text-sm border-t-0 pt-0 ${flexAlignment}`} style={{ gap: headerItemGap, marginBottom: headerContactGap }}>
                    {(() => {
                        const items: React.ReactNode[] = [];
                        if (data.location) items.push(<span key="location">{formatContactText(data.location)}</span>);
                        if (data.phone) items.push(<span key="phone">{formatContactText(data.phone)}</span>);
                        if (data.email) items.push(<a key="email" href={`mailto:${formatContactText(data.email)}`} className="text-black no-underline">{formatContactText(data.email)}</a>);
                        if (data.linkedin) items.push(<a key="linkedin" href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" className="text-black no-underline">{formatLinkedInDisplay(data.linkedin)}</a>);
                        return items.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <span className="mx-1">{CONTACT_SEPARATOR}</span>}
                                {item}
                            </React.Fragment>
                        ));
                    })()}
                </div>

                <div className="text-lg" style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: accentColor }}>
                    {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase) ||"Job Title"}
                </div>
            </div>

            {/* Dynamic Content */}
            {uniqueSectionOrder.map(section => renderSection(section))}
        </div>
    );
}
