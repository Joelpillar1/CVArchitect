import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';
import { formatDate, parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, CONTACT_SEPARATOR, formatJobTitleDisplay, isTitleFirst } from '../../utils/templateUtils';

export default function ImpactTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');

    const formatMonthYear = (dateString: string | null | undefined) => {
        return formatMonthYearUtil(dateString, 'long');
    };



    // Calculate relative font sizes based on body size
    const bodySize = fontSizes?.body || 9.5;
    const smallSize = bodySize * 0.85;
    const mediumSize = bodySize * 0.95;
    const largeSize = bodySize * 1.05;
    const sectionGap = getSectionGapIn(data, 'compact');

    const getSectionHeaderAlignment = () => {
        if (data.bodyHeaderAlignment === 'center') return 'text-center';
        if (data.bodyHeaderAlignment === 'right') return 'text-right';
        return 'text-left';
    };

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
                        <h2
                            className={`font-bold tracking-wide mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.professionalSummary}
                        </h2>
                        <p className="text-justify  text-gray-700" style={{ fontSize: `${bodySize}pt` }}>
                            {data.summary}
                        </p>
                    </section>
                );

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {data.skills.split(',').map((skill, i) =>
                                skill.trim() ? (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 rounded-sm font-medium border"
                                        style={{
                                            fontSize: `${bodySize * 0.9}pt`,
                                            borderColor: data.accentColor || '#000000',
                                            color: data.accentColor || '#000000',
                                            backgroundColor: `${data.accentColor || '#000000'}08`,
                                        }}
                                    >
                                        {skill.trim()}
                                    </span>
                                ) : null
                            )}
                        </div>
                    </section>
                );

            case 'keyAchievements':
            case 'achievements': {
                const achievements = parseAchievementBullets(data.keyAchievements || '');
                return achievements.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 ${getSectionHeaderAlignment()}`}
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
                            {achievements.map((line, i) => (
                                line.trim() && (
                                    <li key={i} className="pl-1">
                                        {line.replace(/^[•-]\s*/, '')}
                                    </li>
                                )
                            ))}
                        </ul>
                    </section>
                );
            }

            case 'experience':
                return data.experience.length > 0 && (
                    <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 ${getSectionHeaderAlignment()}`}
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
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-black" style={{ fontSize: `${largeSize}pt` }}>
                                            {exp.company}
                                        </h3>
                                        <div className="italic text-gray-600 text-right" style={{ fontSize: `${mediumSize}pt` }}>
                                            {exp.location && <span>{exp.location}</span>}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <div className="italic text-gray-700" style={{ fontSize: `${bodySize}pt` }}>
                                            {exp.role}
                                        </div>
                                        <div className="italic text-gray-600" style={{ fontSize: `${mediumSize}pt` }}>
                                            {formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}
                                        </div>
                                    </div>
                                    {exp.roleSummary && (
                                        <p className="italic text-gray-600 mb-2" style={{ fontSize: `${mediumSize}pt` }}>
                                            {exp.roleSummary}
                                        </p>
                                    )}
                                    <ul
                                        className="list-disc list-outside ml-5 space-y-1 text-gray-700"
                                        style={{ fontSize: `${bodySize}pt` }}
                                    >
                                        {descriptionToString(exp.description).split('\n').map((line, i) => (
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
                            className={`font-bold uppercase tracking-wide mb-4 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {data.projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-black" style={{ fontSize: `${largeSize}pt` }}>
                                            {project.name}
                                        </h3>
                                        {project.link && (
                                            <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="italic text-gray-600 text-right hover:underline" style={{ fontSize: `${mediumSize}pt` }}>
                                                Link
                                            </a>
                                        )}
                                    </div>
                                    {project.technologies && (
                                        <div className="italic text-gray-600 mb-2" style={{ fontSize: `${mediumSize}pt` }}>
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.certifications}
                        </h2>
                        <div className="space-y-2">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-black" style={{ fontSize: `${bodySize}pt` }}>
                                            {cert.name}
                                        </span>
                                        {cert.issuer && (
                                            <>
                                                <span className="text-gray-600 mx-2">|</span>
                                                <span className="italic text-gray-700" style={{ fontSize: `${bodySize}pt` }}>
                                                    {cert.issuer}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {cert.date && (
                                        <div className="italic text-gray-600" style={{ fontSize: `${mediumSize}pt` }}>
                                            {cert.date}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'education':
                return data.education.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 ${getSectionHeaderAlignment()}`}
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
                                        <span className="font-bold text-black" style={{ fontSize: `${bodySize}pt` }}>
                                            {edu.school}
                                        </span>
                                        <span className="text-gray-600 mx-2">|</span>
                                        <span className="italic text-gray-700" style={{ fontSize: `${bodySize}pt` }}>
                                            {edu.degree}
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 ${getSectionHeaderAlignment()}`}
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
                            className={`font-bold uppercase tracking-wide mb-3 ${getSectionHeaderAlignment()}`}
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
            className="resume-content text-gray-800 relative"
            style={{
                lineHeight: data.lineHeight || 1.7,
                ...getPagePaddingStyle(data, 'compact'),
            }}
        >
            {/* Header */}
            <header className="break-inside-avoid" style={{ marginBottom: `${getHeaderGapIn(data, 'compact')}in` }}>
                <div className={`flex flex-col ${data.headerAlignment === 'center' ? 'items-center text-center' : data.headerAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
                    <h1
                        className={`font-bold ${data.headerCase === 'uppercase' ? 'uppercase' : data.headerCase === 'lowercase' ? 'lowercase' : ''}`}
                        style={{ fontSize: `${fontSizes?.header || 18}pt`, color: data.accentColor || '#000000', marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1 }}
                    >
                        {formatNameDisplay(data.fullName, data.headerCase)}
                    </h1>

                {isTitleFirst(data, false) && (
                    <div
                        className={`font-semibold ${data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left'}`}
                        style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: data.accentColor || '#000000', marginBottom: `${getHeaderContactGapIn(data)}in` }}
                    >
                        {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                    </div>
                )}
                {/* Contact Info */}
                <div className={`text-gray-600 flex flex-wrap gap-2 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`} style={{ fontSize: `${bodySize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}>
                    {(() => {
                        const items: React.ReactNode[] = [];
                        if (data.address) items.push(<span key="address">{formatContactText(data.address)}</span>);
                        if (data.phone) items.push(<span key="phone">{formatContactText(data.phone)}</span>);
                        if (data.email) items.push(<a key="email" href={`mailto:${formatContactText(data.email)}`} style={{ textDecoration: 'none', color: 'inherit' }}>{formatContactText(data.email)}</a>);
                        if (data.linkedin) items.push(<a key="linkedin" href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{formatLinkedInDisplay(data.linkedin)}</a>);
                        return items.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <span>{CONTACT_SEPARATOR}</span>}
                                {item}
                            </React.Fragment>
                        ));
                    })()}
                </div>
                {!isTitleFirst(data, false) && (
                    <>
                        <div
                            className="h-px w-full"
                            style={{ backgroundColor: data.accentColor || '#000000', opacity: 0.25 }}
                        />
                        <div
                            className={`font-semibold ${data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left'}`}
                            style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: data.accentColor || '#000000' }}
                        >
                            {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                        </div>
                    </>
                )}
                </div>
            </header>

            {/* Dynamic Sections */}
            {getNormalizedSectionOrder(data.sectionOrder, ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements', 'additionalInfo', 'references']).map(id => (
                <React.Fragment key={id}>
                    {renderSection(id)}
                </React.Fragment>
            ))}
        </div>
    );
}
