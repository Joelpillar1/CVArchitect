import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, splitSkillsIntoColumns, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay, isTitleFirst } from '../../utils/templateUtils';

export default function FreeTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');

    const formatMonthYear = (dateString: string | null | undefined) => {
        return formatMonthYearUtil(dateString, 'short');
    };

    // Calculate relative font sizes
    const bodySize = fontSizes?.body || 9.5;
    const smallSize = bodySize * 0.85;

    const columnCount = data.skillsColumnCount || 3;
    const skillColumns = splitSkillsIntoColumns(data.skills || '', columnCount);

    const getSectionHeaderAlignment = () => {
        if (data.bodyHeaderAlignment === 'center') return 'text-center';
        if (data.bodyHeaderAlignment === 'right') return 'text-right';
        return 'text-left';
    };

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            Summary
                        </h2>
                        <p className="text-gray-700 text-justify" style={{ fontSize: `${bodySize}pt` }}>
                            {data.summary}
                        </p>
                    </section>
                );

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-x-4 gap-y-1 ${columnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {skillColumns.map((col, colIndex) => (
                                <ul
                                    key={colIndex}
                                    className={`${BULLET_LIST_CLASS} text-gray-700`}
                                    style={{ fontSize: `${bodySize}pt` }}
                                >
                                    {col.map((skill, i) => (
                                        <li key={i} className="pl-1">{skill}</li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </section>
                );

            case 'keyAchievements':
            case 'achievements':
                return data.keyAchievements && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            Key Achievements
                        </h2>
                        <ul
                            className="list-disc list-outside ml-5 space-y-1 text-gray-700 text-justify"
                            style={{ fontSize: `${bodySize}pt` }}
                        >
                            {parseDescriptionBullets(data.keyAchievements).map((line, i) => (
                                line.trim() && (
                                    <li key={i} className="pl-1">
                                        {line.replace(/^[•-]\s*/, '')}
                                    </li>
                                )
                            ))}
                        </ul>
                    </section>
                );

            case 'experience':
                return data.experience.length > 0 && (
                    <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div>
                            {data.experience.map((exp, index) => (
                                <div
                                    key={exp.id}
                                    className="break-inside-avoid"
                                    style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${getSectionGapIn(data)}in` }}
                                >
                                    <div className="flex justify-between items-baseline mb-2">
                                        <div>
                                            <span className="font-bold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                                {exp.role}, {exp.company}
                                            </span>
                                            {exp.location && (
                                                <span className="text-gray-600 italic" style={{ fontSize: `${smallSize}pt` }}>
                                                    {' '}• {exp.location}
                                                </span>
                                            )}
                                        </div>
                                        <div className="italic text-gray-600" style={{ fontSize: `${smallSize}pt` }}>
                                            {formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}
                                        </div>
                                    </div>
                                    <ul
                                        className="list-disc list-outside ml-5 space-y-1 text-gray-700"
                                        style={{ fontSize: `${bodySize}pt` }}
                                    >
                                        {parseDescriptionBullets(exp.description).map((line, i) => (
                                            line.trim() && (
                                                <li key={i} className="pl-1">
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

            case 'projects':
                return data.projects && data.projects.length > 0 && (
                    <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            Projects
                        </h2>
                        <div className="space-y-5">
                            {data.projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <div>
                                            <span className="font-bold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                                {project.name}
                                                {project.link && (
                                                    <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal italic text-gray-600 text-sm hover:underline">
                                                        Link
                                                    </a>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {project.technologies && (
                                        <div className="text-sm text-gray-600 italic mb-1">
                                            {project.technologies}
                                        </div>
                                    )}
                                    <p className="text-gray-700 whitespace-pre-line" style={{ fontSize: `${bodySize}pt` }}>
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.certifications}
                        </h2>
                        <ul
                            className="list-disc list-outside ml-5 space-y-1 text-gray-700"
                            style={{ fontSize: `${bodySize}pt` }}
                        >
                            {data.certifications.map((cert) => (
                                <li key={cert.id} className="pl-1">
                                    <span className="font-bold">{cert.name}</span>
                                    {cert.issuer && <span> - {cert.issuer}</span>}
                                    {cert.date && <span className="text-gray-600 text-sm"> ({cert.date})</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                );

            case 'education':
                return data.education.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.educationTitle}
                        </h2>
                        <div className="space-y-2">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                            {edu.degree}, {edu.school}
                                        </span>
                                    </div>
                                    <div className="italic text-gray-600" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                                        {edu.year}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'additionalInfo':
                return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            Additional Information
                        </h2>
                        <div className="space-y-2">
                            {data.additionalInfo.filter(item => item.label.trim() && item.value.trim()).map((item) => (
                                <div key={item.id} className="text-gray-700">
                                    <span className="font-bold" style={{ fontSize: `${bodySize}pt` }}>{item.label}:</span>
                                    <span className="ml-2" style={{ fontSize: `${bodySize}pt` }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'references':
                return data.referee && data.referee.trim() && (
                    <section className="break-inside-avoid">
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            References
                        </h2>
                        <p className="italic text-gray-600 whitespace-pre-line" style={{ fontSize: `${bodySize}pt` }}>
                            {data.referee}
                        </p>
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="resume-content text-gray-800"
            style={{
                lineHeight: data.lineHeight || 1.7,
                paddingLeft: `${getMarginHorizontalIn(data)}in`,
                paddingRight: `${getMarginHorizontalIn(data)}in`,
                paddingTop: `${getMarginVerticalIn(data)}in`,
                paddingBottom: `${getMarginVerticalIn(data)}in`,
            }}
        >
            {/* Header */}
            <header className={`break-inside-avoid ${data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left'}`} style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
                <h1
                    className={`font-bold ${data.headerCase === 'uppercase' ? 'uppercase' : data.headerCase === 'lowercase' ? 'lowercase' : ''}`}
                    style={{ fontSize: `${fontSizes?.header || 18}pt`, color: data.accentColor || '#000000', marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1 }}
                >
                    {formatNameDisplay(data.fullName, data.headerCase)}
                </h1>
                {isTitleFirst(data, false) && data.jobTitle && (
                    <div
                        style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: data.accentColor || '#000000' }}
                    >
                        {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                    </div>
                )}
                <div
                    className={`text-gray-700 flex flex-wrap gap-x-4 gap-y-1 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`}
                    style={{ fontSize: `${bodySize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
                >
                    {data.address && <span>{formatContactText(data.address)}</span>}
                    {data.email && (
                        <a href={`mailto:${formatContactText(data.email)}`} style={{ textDecoration: 'none', color: 'inherit' }}>{formatContactText(data.email)}</a>
                    )}
                    {data.phone && <span>{formatContactText(data.phone)}</span>}
                    {data.linkedin && (
                        <a href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{formatLinkedInDisplay(data.linkedin)}</a>
                    )}
                </div>
                {!isTitleFirst(data, false) && data.jobTitle && (
                    <div
                        style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: data.accentColor || '#000000' }}
                    >
                        {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                    </div>
                )}
            </header>

            {/* Dynamic Sections */}
            {
                getNormalizedSectionOrder(data.sectionOrder, ['summary', 'skills', 'achievements', 'experience', 'projects', 'education', 'certifications', 'additionalInfo', 'references']).map(id => (
                    <React.Fragment key={id}>
                        {renderSection(id)}
                    </React.Fragment>
                ))
            }
        </div >
    );
}
