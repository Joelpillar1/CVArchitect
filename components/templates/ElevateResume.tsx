import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, parseAchievementBullets, formatMonthYear as formatMonthYearUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';
import { Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { getTranslation, Language } from '../../i18n/translations';

export default function ElevateResume({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');

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
                // Note: ElevateResume didn't have a summary section in the previous code, 
                // but it's good practice to include it if data exists, or maybe it was missed.
                // Looking at the file, I don't see a summary section. I will add it.
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            {t.professionalSummary}
                        </h2>
                        <p className="text-justify  text-gray-900">{data.summary}</p>
                    </section>
                );

            case 'education':
                return data.education.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            {t.educationTitle}
                        </h2>
                        <div className="space-y-4">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-base">{edu.school}</div>
                                        <div className="font-bold text-sm text-gray-700"></div>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <div className="italic text-gray-800">{edu.degree}</div>
                                        <div className="italic text-gray-600" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.year}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'keyAchievements':
            case 'achievements': {
                const achievements = parseAchievementBullets(data.keyAchievements || '');
                return achievements.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            Key Achievements
                        </h2>
                        <ul
                            className="list-disc list-outside ml-5 space-y-1 text-justify text-gray-700"
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
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div>
                            {data.experience.map((exp, index) => {
                                const bullets = parseDescriptionBullets(exp.description);
                                return (
                                    <div
                                        key={exp.id}
                                        style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${getSectionGapIn(data)}in` }}
                                    >
                                        <div className="flex justify-between items-baseline mb-1">
                                            <div className="font-bold" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                                                {exp.company}{exp.location && <span className="font-normal italic text-gray-600"> • {exp.location}</span>}
                                            </div>
                                            <div className="italic text-gray-600" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                                                {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <div className="italic text-gray-800" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{exp.role}</div>
                                        </div>
                                        <ul className="list-disc list-outside ml-5 space-y-1 text-justify" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                                            {bullets.map((line, i) => (
                                                <li key={i} className="pl-1">{line.replace(/^[•-]\s*/, '')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );

            case 'projects':
                return data.projects && data.projects.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {data.projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-base">
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
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-x-8 gap-y-1 text-gray-700 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {data.skills.split(',').map((skill, i) => (
                                <div key={i} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{skill.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            {t.certifications}
                        </h2>
                        <ul className="list-disc list-outside ml-5 space-y-1">
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
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            Additional Information
                        </h2>
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
                    <section className="break-inside-avoid">
                        <h2
                            className={`section-header font-bold uppercase tracking-widest border-b leading-tight mb-4 pb-0.5 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                borderColor: data.accentColor || '#000000',
                                color: data.accentColor || '#000000',
                            }}
                        >
                            References
                        </h2>
                        <p className="italic text-gray-600 whitespace-pre-line">{data.referee}</p>
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
                    className="font-bold"
                    style={{
                        fontSize: `${fontSizes?.header || 18}pt`,
                        color: data.accentColor || '#000000',
                        marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1
                    }}
                >
                    {formatNameDisplay(data.fullName, data.headerCase)}
                </h1>
                {/* Contact Icons */}
                <div className={`flex flex-wrap items-center gap-4 text-xs text-gray-600 ${data.headerAlignment === 'left' ? 'justify-start' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-center'}`} style={{ marginBottom: `${getHeaderContactGapIn(data)}in` }}>
                    {data.address && (
                        <div className="flex items-center gap-1">
                            <MapPin size={10} color={data.accentColor || '#000000'} />
                            <span>{formatContactText(data.address)}</span>
                        </div>
                    )}
                    {data.phone && (
                        <div className="flex items-center gap-1">
                            <Phone size={10} color={data.accentColor || '#000000'} />
                            <span>{formatContactText(data.phone)}</span>
                        </div>
                    )}
                    {data.email && (
                        <div className="flex items-center gap-1">
                            <Mail size={10} color={data.accentColor || '#000000'} />
                            <a href={`mailto:${formatContactText(data.email)}`} className="no-underline" style={{ color: 'inherit' }}>
                                {formatContactText(data.email)}
                            </a>
                        </div>
                    )}
                    {data.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin size={10} color={data.accentColor || '#000000'} />
                            <a
                                href={getLinkedInHref(data.linkedin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline"
                                style={{ color: 'inherit' }}
                            >
                                {formatLinkedInDisplay(data.linkedin)}
                            </a>
                        </div>
                    )}
                    {data.atHandle && (
                        <div className="flex items-center gap-1">
                            <Send size={10} color={data.accentColor || '#000000'} />
                            <span>{data.atHandle}</span>
                        </div>
                    )}
                </div>
                {data.jobTitle && (
                    <p
                        className="font-semibold"
                        style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: data.accentColor || '#000000' }}
                    >
                        {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                    </p>
                )}
            </header>

            {/* Dynamic Sections */}
            {getNormalizedSectionOrder(data.sectionOrder, ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'achievements', 'additionalInfo', 'references']).map(id => (
                <React.Fragment key={id}>
                    {renderSection(id)}
                </React.Fragment>
            ))}
        </div>
    );
}
