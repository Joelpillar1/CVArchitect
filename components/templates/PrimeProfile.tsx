import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, splitSkillsIntoColumns, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';
import { Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { getTranslation, Language } from '../../i18n/translations';

export default function PrimeProfile({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');

    // Gold color extracted from the image style, or user selected color
    const accentColor = data.accentColor || '#000000';

    const skillColumns = splitSkillsIntoColumns(data.skills || '', data.skillsColumnCount || 3);

    const formatMonthYear = (dateString: string | null | undefined) => {
        return formatMonthYearUtil(dateString, 'long');
    };

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
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            {t.professionalSummary}
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <p className="text-justify text-gray-700" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                            {data.summary}
                        </p>
                    </section>
                );

            case 'keyAchievements':
            case 'achievements': {
                const achievements = parseAchievementBullets(data.keyAchievements || '');
                return achievements.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            Key Achievements
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <ul
                            className="list-disc list-outside ml-5 space-y-1 text-gray-700 text-justify"
                            style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <div>
                            {data.experience.map((exp, index) => (
                                <div
                                    key={exp.id}
                                    style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${getSectionGapIn(data)}in` }}
                                >
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-black" style={{ fontSize: '1.1em' }}>{exp.company}{exp.location && <span className="font-normal italic text-gray-600"> • {exp.location}</span>}</div>
                                        <div className="italic text-gray-600" style={{ fontSize: '0.9em' }}>
                                            {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                        </div>
                                    </div>
                                    <div className="italic text-gray-800 mb-2">{exp.role}</div>
                                    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 text-justify">
                                        {descriptionToString(exp.description).split('\n').map((line, i) => (
                                            line.trim() && <li key={i} className="pl-1">{line.replace(/^[•-]\s*/, '')}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'projects':
                return data.projects && data.projects.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            Projects
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <div className="space-y-4">
                            {data.projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-black" style={{ fontSize: '1.1em' }}>
                                            {project.name}
                                            {project.link && (
                                                <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal italic text-gray-600 text-sm hover:underline">
                                                    Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {project.technologies && (
                                        <div className="text-sm text-gray-600 italic mb-1">
                                            {project.technologies}
                                        </div>
                                    )}
                                    <p className="text-gray-700 whitespace-pre-line text-justify">
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <div className={`grid gap-x-8 gap-y-1 text-gray-700 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {skillColumns.map((col, colIndex) => (
                                <ul
                                    key={colIndex}
                                    className={`${BULLET_LIST_CLASS}`}
                                    style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}
                                >
                                    {col.map((skill, i) => (
                                        <li key={i} className="pl-1">{skill}</li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </section>
                );

            case 'education':
                return data.education.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            {t.educationTitle}
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <div className="space-y-4">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-black" style={{ fontSize: '1.1em' }}>{edu.school}</div>
                                        <div className="italic text-gray-600" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.year}</div>
                                    </div>
                                    <div className="italic text-gray-800">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            {t.certifications}
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                            {data.certifications.map((cert) => (
                                <li key={cert.id}>
                                    <span className="font-bold">{cert.name}</span>
                                    {cert.issuer && <span> - {cert.issuer}</span>}
                                    {cert.date && <span className="text-gray-600 text-sm"> ({cert.date})</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                );

            case 'additionalInfo':
                return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            Additional Information
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <div className="space-y-2">
                            {data.additionalInfo.filter(item => item.label.trim() && item.value.trim()).map((item) => (
                                <div key={item.id} className="text-gray-700">
                                    <span className="font-bold">{item.label}:</span>
                                    <span className="ml-2">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'references':
                return data.referee && data.referee.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
                        >
                            References
                        </h2>
                        <div className="mb-2 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                        <div className="text-justify  text-gray-700 whitespace-pre-line">
                            {data.referee}
                        </div>
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="resume-content text-gray-900"
            style={{
                lineHeight: data.lineHeight || 1.7,
                paddingLeft: `${getMarginHorizontalIn(data)}in`,
                paddingRight: `${getMarginHorizontalIn(data)}in`,
                paddingTop: `${getMarginVerticalIn(data)}in`,
                paddingBottom: `${getMarginVerticalIn(data)}in`,
            }}
        >
            {/* Header */}
            <header className={`break-inside-avoid ${data.headerAlignment === 'left' ? 'text-left' : data.headerAlignment === 'right' ? 'text-right' : 'text-center'}`} style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
                <h1
                    className="font-bold text-black"
                    style={{ fontSize: `${fontSizes?.header || 18}pt`, marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1 }}
                >
                    {formatNameDisplay(data.fullName, data.headerCase)}
                </h1>

                {/* Contact Section with Gold Lines */}
                <div
                    className={`flex flex-wrap items-center gap-4 text-gray-600 ${data.headerAlignment === 'left' ? 'justify-start' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-center'}`}
                    style={{
                        fontSize: `${fontSizes?.body || 9.5}pt`,
                        marginBottom: `${getHeaderContactGapIn(data)}in`,
                    }}
                >
                    {(() => {
                        const items: React.ReactNode[] = [];
                        if (data.address) items.push(<span key="address">{formatContactText(data.address)}</span>);
                        if (data.phone) items.push(<span key="phone">{formatContactText(data.phone)}</span>);
                        if (data.email) items.push(
                            <a key="email" href={`mailto:${formatContactText(data.email)}`} className="no-underline" style={{ color: 'inherit' }}>
                                {formatContactText(data.email)}
                            </a>
                        );
                        if (data.linkedin) items.push(
                            <a
                                key="linkedin"
                                href={getLinkedInHref(data.linkedin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline"
                                style={{ color: 'inherit' }}
                            >
                                {formatLinkedInDisplay(data.linkedin)}
                            </a>
                        );
                        return items.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <span className="text-gray-400">|</span>}
                                {item}
                            </React.Fragment>
                        ));
                    })()}
                </div>
                <p
                    className="text-black"
                    style={{ fontSize: `${fontSizes?.jobTitle || 11}pt` }}
                >
                    {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                </p>
            </header>

            {/* Dynamic Sections */}
            {getNormalizedSectionOrder(data.sectionOrder, ['summary', 'achievements', 'experience', 'projects', 'skills', 'education', 'certifications', 'additionalInfo', 'references']).map(id => (
                <React.Fragment key={id}>
                    {renderSection(id)}
                </React.Fragment>
            ))}
        </div>
    );
}
