import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'short');
};

export default function ApexTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');
    const accentColor = data.accentColor || '#000000'; // Slate dark

    const getSectionHeaderAlignment = () => {
        if (data.bodyHeaderAlignment === 'center') return 'text-center';
        if (data.bodyHeaderAlignment === 'right') return 'text-right';
        return 'text-left';
    };

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-300 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            {t.professionalSummary}
                        </h2>
                        <p
                            className="text-gray-700 leading-relaxed text-justify"
                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                        >
                            {data.summary}
                        </p>
                    </section>
                );

            case 'achievements': {
                const achievements = parseAchievementBullets(data.keyAchievements || '');
                return achievements.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-300 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            KEY ACHIEVEMENTS
                        </h2>
                        <div className="space-y-2">
                            {achievements.map((line, i) =>
                                line.trim() && (
                                    <div
                                        key={i}
                                        className="flex gap-2 items-baseline"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        <span className="font-bold shrink-0 w-2 text-[9px] leading-none inline-block" style={{ color: accentColor }}>•</span>
                                        <span className="text-gray-700 flex-1 leading-relaxed">{line.replace(/^[•-]\s*/, '')}</span>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                );
            }

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-300 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-x-4 gap-y-2 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {data.skills.split(',').map((skill, i) => (
                                <div
                                    key={i}
                                    className="flex items-baseline gap-2"
                                    style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}
                                >
                                    <span className="font-bold shrink-0 w-2 text-[9px] leading-none inline-block" style={{ color: accentColor }}>•</span>
                                    <span className="text-gray-700 font-medium">{skill.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'experience':
                return data.experience.length > 0 && (
                    <section style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-300 break-inside-avoid ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div className="space-y-5">
                            {data.experience.map((exp) => {
                                const desc = descriptionToString(exp.description);
                                return (
                                    <div key={exp.id} className="break-inside-avoid">
                                        <div className="mb-2">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3
                                                    className="font-bold"
                                                    style={{
                                                        fontSize: `${(fontSizes?.body || 10.5) * 1.15}pt`,
                                                        color: accentColor
                                                    }}
                                                >
                                                    {exp.role}
                                                </h3>
                                                <span
                                                    className="text-gray-500 font-medium"
                                                    style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.85}pt` }}
                                                >
                                                    {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                                </span>
                                            </div>
                                            <div
                                                className="font-semibold text-gray-600"
                                                style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}
                                            >
                                                {exp.company}
                                                {exp.location && <span className="text-gray-400 font-normal"> | {exp.location}</span>}
                                            </div>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {desc.split('\n').map((line, i) =>
                                                line.trim() && (
                                                    <li
                                                        key={i}
                                                        className="flex gap-2 items-baseline text-gray-700"
                                                        style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}
                                                    >
                                                        <span className="font-bold shrink-0 w-2 text-[9px] leading-none inline-block" style={{ color: accentColor }}>•</span>
                                                        <span className="flex-1 leading-relaxed">{line.replace(/^[•-]\s*/, '')}</span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );

            case 'projects':
                return data.projects && data.projects.length > 0 && (
                    <section style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-300 break-inside-avoid ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            PROJECTS
                        </h2>
                        <div className="space-y-5">
                            {data.projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div className="mb-2">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3
                                                className="font-bold"
                                                style={{
                                                    fontSize: `${(fontSizes?.body || 10.5) * 1.15}pt`,
                                                    color: accentColor
                                                }}
                                            >
                                                {project.name}
                                                {project.link && (
                                                    <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal text-gray-500 text-sm hover:underline">
                                                        Link
                                                    </a>
                                                )}
                                            </h3>
                                        </div>
                                        {project.technologies && (
                                            <div
                                                className="font-semibold text-gray-600"
                                                style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}
                                            >
                                                {project.technologies}
                                            </div>
                                        )}
                                    </div>
                                    <p
                                        className="text-gray-700 whitespace-pre-line"
                                        style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}
                                    >
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-300 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            {t.certifications}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.certifications.map((cert) => (
                                <div key={cert.id}>
                                    <div
                                        className="font-bold text-gray-900"
                                        style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}
                                    >
                                        {cert.name}
                                    </div>
                                    {cert.issuer && (
                                        <div
                                            className="text-gray-600 mt-0.5"
                                            style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.85}pt` }}
                                        >
                                            {cert.issuer}
                                        </div>
                                    )}
                                    {cert.date && (
                                        <div
                                            className="text-gray-500 text-xs mt-0.5"
                                            style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.8}pt` }}
                                        >
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-300 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            {t.educationTitle}
                        </h2>
                        <div className="space-y-3">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <div
                                            className="font-bold text-gray-900"
                                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                        >
                                            {edu.degree}
                                        </div>
                                        <div
                                            className="text-gray-600 mt-0.5"
                                            style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.9}pt` }}
                                        >
                                            {edu.school}
                                        </div>
                                    </div>
                                    <div
                                        className="font-semibold text-gray-500"
                                        style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.85}pt` }}
                                    >
                                        {edu.year}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'additionalInfo':
                return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-300 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            ADDITIONAL INFORMATION
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
                            className={`font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-300 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor
                            }}
                        >
                            REFERENCES
                        </h2>
                        <p
                            className="text-gray-700 italic whitespace-pre-line"
                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                        >
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
            className="resume-content text-gray-900 bg-white"
            style={{
                lineHeight: data.lineHeight || 1.5,
                paddingLeft: `${data.margins?.horizontal || 0.5}in`,
                paddingRight: `${data.margins?.horizontal || 0.5}in`,
                paddingTop: `${data.margins?.vertical || 0.5}in`,
                paddingBottom: `${data.margins?.vertical || 0.5}in`,
            }}
        >
            {/* Header Section */}
            <header className="break-inside-avoid" style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
                <div className={`border-b-2 border-gray-300 pb-4 flex flex-col ${data.headerAlignment === 'center' ? 'items-center text-center' : data.headerAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
                    <h1
                        className="font-bold leading-tight"
                        style={{
                            fontSize: `${fontSizes?.header || 32}pt`,
                            color: accentColor,
                            letterSpacing: '-0.01em',
                            marginBottom: `${data.headerItemGap || 0.08}in`
                        }}
                    >
                        {data.fullName}
                    </h1>
                    <div
                        className="font-semibold tracking-wider"
                        style={{
                            fontSize: `${fontSizes?.jobTitle || fontSizes?.body || 10}pt`,
                            color: '#64748b',
                            letterSpacing: '0.1em',
                            marginBottom: `${data.headerItemGap || 0.08}in`
                        }}
                    >
                        {data.jobTitle}
                    </div>

                    {/* Contact Bar */}
                    <div className={`flex flex-wrap gap-x-6 gap-y-2 text-gray-600 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`} style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.9}pt` }}>
                        {data.email && (
                            <div className="flex items-center gap-2">
                                <a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{data.email}</a>
                            </div>
                        )}
                        {data.phone && (
                            <div className="flex items-center gap-2">
                                <span>{data.phone}</span>
                            </div>
                        )}

                        {data.address && (
                            <div className="flex items-center gap-2">
                                <span>{data.address}</span>
                            </div>
                        )}
                        {data.linkedin && (
                            <div className="flex items-center gap-2">
                                <a
                                    href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                    className="text-sm"
                                >
                                    {data.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Dynamic Sections */}
            {(data.sectionOrder || ['summary', 'achievements', 'skills', 'experience', 'projects', 'certifications', 'education', 'additionalInfo', 'references']).map(id => (
                <React.Fragment key={id}>
                    {renderSection(id)}
                </React.Fragment>
            ))}
        </div>
    );
}
