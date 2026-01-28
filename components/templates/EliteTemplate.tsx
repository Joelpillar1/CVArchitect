import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'short');
};

export default function EliteTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');
    const accentColor = data.accentColor || '#000000'; // Professional blue

    // Helper function to get alignment classes for section headers
    const getSectionHeaderAlignment = () => {
        if (data.bodyHeaderAlignment === 'center') return 'justify-center text-center';
        if (data.bodyHeaderAlignment === 'right') return 'justify-end text-right';
        return 'justify-start text-left';
    };

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 flex items-center gap-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            {t.professionalSummary}
                        </h2>
                        <div
                            className="text-gray-700 leading-relaxed"
                            style={{
                                fontSize: `${fontSizes?.body || 10.5}pt`
                            }}
                        >
                            {data.summary}
                        </div>
                    </section>
                );

            case 'achievements': {
                const achievements = parseAchievementBullets(data.keyAchievements || '');
                return achievements.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-1.5 flex items-center gap-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            KEY ACHIEVEMENTS
                        </h2>
                        <div className="grid grid-cols-1 gap-0.5">
                            {achievements.map((line, i) =>
                                line.trim() && (
                                    <div
                                        key={i}
                                        className="flex gap-2 items-baseline bg-white py-0.5"
                                        style={{
                                            fontSize: `${fontSizes?.body || 10.5}pt`
                                        }}
                                    >
                                        <span className="shrink-0 w-2 inline-block text-left leading-none" style={{ color: accentColor }}>•</span>
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
                            className={`font-bold uppercase tracking-wide mb-3 flex items-center gap-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-2 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {data.skills.split(',').map((skill, i) => (
                                <div
                                    key={i}
                                    className="flex items-baseline gap-2 text-gray-700"
                                    style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}
                                >
                                    <span className="shrink-0 w-2 inline-block text-left leading-none" style={{ color: accentColor }}>•</span>
                                    <span className="font-medium">{skill.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'experience':
                return data.experience.length > 0 && (
                    <section style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 flex items-center gap-2 break-inside-avoid ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div className="space-y-5">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3
                                                className="font-bold"
                                                style={{
                                                    fontSize: `${(fontSizes?.body || 10.5) * 1.1}pt`,
                                                    color: '#111827'
                                                }}
                                            >
                                                {exp.role}
                                            </h3>
                                            <div
                                                className="font-semibold mt-1"
                                                style={{
                                                    fontSize: `${fontSizes?.body || 10.5}pt`,
                                                    color: accentColor
                                                }}
                                            >
                                                {exp.company}
                                                {exp.location && <span className="text-gray-500 font-normal"> • {exp.location}</span>}
                                            </div>
                                        </div>
                                        <div
                                            className="text-gray-600 font-medium text-right ml-4"
                                            style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.9}pt` }}
                                        >
                                            {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                        </div>
                                    </div>
                                    <ul className="space-y-1.5 mt-3">
                                        {descriptionToString(exp.description).split('\n').map((line, i) =>
                                            line.trim() && (
                                                <li
                                                    key={i}
                                                    className="flex gap-2 items-baseline text-gray-700"
                                                    style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                                >
                                                    <span className="shrink-0 w-2 inline-block text-left leading-none" style={{ color: accentColor }}>•</span>
                                                    <span className="flex-1 leading-relaxed">{line.replace(/^[•-]\s*/, '')}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'projects':
                return data.projects && data.projects.length > 0 && (
                    <section style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 flex items-center gap-2 break-inside-avoid ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            PROJECTS
                        </h2>
                        <div className="space-y-5">
                            {data.projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3
                                                className="font-bold"
                                                style={{
                                                    fontSize: `${(fontSizes?.body || 10.5) * 1.1}pt`,
                                                    color: '#111827'
                                                }}
                                            >
                                                {project.name}
                                                {project.link && (
                                                    <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal text-gray-500 text-sm hover:underline">
                                                        Link
                                                    </a>
                                                )}
                                            </h3>
                                            {project.technologies && (
                                                <div
                                                    className="font-semibold mt-1"
                                                    style={{
                                                        fontSize: `${fontSizes?.body || 10.5}pt`,
                                                        color: accentColor
                                                    }}
                                                >
                                                    {project.technologies}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className="text-gray-700 whitespace-pre-line mt-2"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {project.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 flex items-center gap-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            {t.certifications}
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="flex gap-2 items-start">
                                    <span style={{ color: accentColor }}>✓</span>
                                    <div style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}>
                                        <div className="font-bold text-gray-900">{cert.name}</div>
                                        {cert.issuer && (
                                            <div className="text-gray-600 text-sm">{cert.issuer}</div>
                                        )}
                                        {cert.date && (
                                            <div className="text-gray-500 text-xs">{cert.date}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'education':
                return data.education.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.2}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 flex items-center gap-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
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
                                            style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}
                                        >
                                            {edu.school}
                                        </div>
                                    </div>
                                    <div
                                        className="font-semibold text-gray-500"
                                        style={{ fontSize: `${fontSizes?.body || 10}pt` }}
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
                            className={`font-bold uppercase tracking-wide mb-3 flex items-center gap-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
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
                            className={`font-bold uppercase tracking-wide mb-3 flex items-center gap-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
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
            {/* Header Section - Clean and Professional */}
            <header className="break-inside-avoid" style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
                <div className={`border-b-3 pb-4 flex flex-col ${data.headerAlignment === 'center' ? 'items-center text-center' : data.headerAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'}`} style={{ borderBottomWidth: '3px', borderColor: accentColor }}>
                    <h1
                        className="font-bold tracking-tight"
                        style={{
                            fontSize: `${fontSizes?.header || 32}pt`,
                            color: '#1f2937',
                            letterSpacing: '-0.02em',
                            marginBottom: `${data.headerItemGap || 0.08}in`
                        }}
                    >
                        {data.fullName}
                    </h1>
                    <p
                        className="font-semibold"
                        style={{
                            fontSize: `${fontSizes?.jobTitle || 13}pt`,
                            color: accentColor,
                            marginBottom: `${data.headerItemGap || 0.08}in`
                        }}
                    >
                        {data.jobTitle}
                    </p>

                    {/* Contact Bar */}
                <div className={`flex flex-wrap gap-4 text-gray-600 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`} style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.95}pt` }}>
                    {data.email && (
                        <div className="flex items-center gap-1.5">
                            <a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{data.email}</a>
                        </div>
                    )}
                        {data.phone && (
                            <div className="flex items-center gap-1.5">
                                <span>{data.phone}</span>
                            </div>
                        )}

                        {data.address && (
                            <div className="flex items-center gap-1.5">
                                <span>{data.address}</span>
                            </div>
                        )}
                    {data.linkedin && (
                        <div className="flex items-center gap-1.5">
                            <a
                                href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit' }}
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
