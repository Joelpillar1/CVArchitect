import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';
import { getTranslation, Language } from '../../i18n/translations';

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'short');
};

export default function DevTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');
    const accentColor = data.accentColor || '#000000';

    const getSectionHeaderAlignment = () => {
        if (data.bodyHeaderAlignment === 'center') return 'text-center';
        if (data.bodyHeaderAlignment === 'right') return 'text-right';
        return 'text-left';
    }; // Blue default for tech

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className="font-bold uppercase mb-2 flex items-center gap-2"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            {t.professionalSummary}
                        </h2>
                        <p
                            className="text-gray-700  text-justify"
                            style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}
                        >
                            {data.summary}
                        </p>
                    </section>
                );

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className="font-bold uppercase mb-2 flex items-center gap-2"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-2 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {data.skills.split(',').map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded text-gray-700 font-medium border"
                                    style={{
                                        fontSize: `${(fontSizes?.body || 9.5) * 0.9}pt`,
                                        borderColor: accentColor,
                                        backgroundColor: `${accentColor}10`
                                    }}
                                >
                                    {skill.trim()}
                                </span>
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
                            className="font-bold uppercase mb-2 flex items-center gap-2"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            Key Achievements
                        </h2>
                        <ul
                            className="list-none space-y-1 text-gray-700"
                            style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}
                        >
                            {achievements.map((line, i) =>
                                line.trim() && (
                                    <li key={i} className="flex gap-2 text-justify">
                                        <span style={{ color: accentColor }}>▸</span>
                                        <span className="flex-1">{line.replace(/^[•-]\s*/, '')}</span>
                                    </li>
                                )
                            )}
                        </ul>
                    </section>
                );
            }

            case 'experience':
                return data.experience.length > 0 && (
                    <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className="font-bold uppercase mb-3 flex items-center gap-2 break-inside-avoid"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            {t.experienceTitle}
                        </h2>
                        <div>
                            {data.experience.map((exp, index) => (
                                <div
                                    key={exp.id}
                                    style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${getSectionGapIn(data)}in` }}
                                >
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3
                                            className="font-bold"
                                            style={{
                                                fontSize: `${fontSizes?.body || 9.5}pt`,
                                                color: accentColor
                                            }}
                                        >
                                            {exp.role}
                                        </h3>
                                        <span
                                            className="text-gray-600 italic"
                                            style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.85}pt` }}
                                        >
                                            {formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}
                                        </span>
                                    </div>
                                    <div
                                        className="font-semibold text-gray-700 mb-2"
                                        style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}
                                    >
                                        {exp.company}
                                        {exp.location && <span className="text-gray-500 font-normal"> • {exp.location}</span>}
                                    </div>
                                    <ul
                                        className="list-none space-y-1 text-gray-700"
                                        style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}
                                    >
                                        {descriptionToString(exp.description).split('\n').map((line, i) =>
                                            line.trim() && (
                                                <li key={i} className="flex gap-2 text-justify">
                                                    <span style={{ color: accentColor }}>▸</span>
                                                    <span className="flex-1">{line.replace(/^[•-]\s*/, '')}</span>
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
                    <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className="font-bold uppercase mb-3 flex items-center gap-2 break-inside-avoid"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            Projects
                        </h2>
                        <div className="space-y-3">
                            {data.projects.map((project) => {
                                const bullets = parseDescriptionBullets(project.description || '');
                                const techList = project.technologies
                                    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                                    : [];
                                return (
                                    <div
                                        key={project.id}
                                        className="break-inside-avoid rounded border p-3"
                                        style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}06` }}
                                    >
                                        <div className="flex justify-between items-baseline gap-2 mb-1">
                                            <h3
                                                className="font-bold"
                                                style={{
                                                    fontSize: `${fontSizes?.body || 9.5}pt`,
                                                    color: accentColor
                                                }}
                                            >
                                                {project.name}
                                            </h3>
                                            {project.link && (
                                                <a
                                                    href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 font-medium italic text-gray-600 hover:underline"
                                                    style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.85}pt` }}
                                                >
                                                    View →
                                                </a>
                                            )}
                                        </div>
                                        {techList.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {techList.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 rounded font-medium border"
                                                        style={{
                                                            fontSize: `${(fontSizes?.body || 9.5) * 0.8}pt`,
                                                            borderColor: accentColor,
                                                            backgroundColor: `${accentColor}12`,
                                                            color: accentColor,
                                                        }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {bullets.length > 0 ? (
                                            <ul className="list-disc ml-5 space-y-0.5 text-gray-700" style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}>
                                                {bullets.map((line, i) =>
                                                    line.trim() ? <li key={i}>{line.replace(/^[•-]\s*/, '')}</li> : null
                                                )}
                                            </ul>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className="font-bold uppercase mb-2 flex items-center gap-2"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            {t.certifications}
                        </h2>
                        <div
                            className="text-gray-700 space-y-1"
                            style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}
                        >
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="flex gap-2">
                                    <span style={{ color: accentColor }}>▸</span>
                                    <span>
                                        <span className="font-bold">{cert.name}</span>
                                        {cert.issuer && <span> - {cert.issuer}</span>}
                                        {cert.date && <span className="text-gray-500 text-sm"> ({cert.date})</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'education':
                return data.education.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        <h2
                            className="font-bold uppercase mb-2 flex items-center gap-2"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            {t.educationTitle}
                        </h2>
                        <div className="space-y-2">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <span
                                            className="font-bold text-gray-900"
                                            style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}
                                        >
                                            {edu.degree}
                                        </span>
                                        <span
                                            className="text-gray-600"
                                            style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}
                                        >
                                            {edu.year}
                                        </span>
                                    </div>
                                    <div
                                        className="text-gray-700"
                                        style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.9}pt` }}
                                    >
                                        {edu.school}
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
                            className="font-bold uppercase mb-2 flex items-center gap-2"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            Additional Information
                        </h2>
                        <div className="space-y-2">
                            {data.additionalInfo.filter(item => item.label.trim() && item.value.trim()).map((item) => (
                                <div
                                    key={item.id}
                                    className="text-gray-700"
                                    style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}
                                >
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
                            className="font-bold uppercase mb-2 flex items-center gap-2"
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                                color: accentColor,
                                letterSpacing: '0.05em'
                            }}
                        >
                            <span className="w-1 h-4 rounded" style={{ backgroundColor: accentColor }}></span>
                            References
                        </h2>
                        <div
                            className="text-gray-700"
                            style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}
                        >
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
            {/* Header Section */}
            <header className="break-inside-avoid" style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
                <div className={`flex mb-2 ${data.headerAlignment === 'center' ? 'flex-col items-center text-center' : data.headerAlignment === 'right' ? 'flex-col items-end text-right' : 'items-start justify-between'}`}>
                    <div className="flex-1">
                        <h1
                            className="font-bold"
                            style={{
                                fontSize: `${fontSizes?.header || 18}pt`,
                                color: accentColor,
                                marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1
                            }}
                        >
                            {formatNameDisplay(data.fullName, data.headerCase)}
                        </h1>
                    </div>
                </div>

                {/* Contact Info - Single Line */}
                <div className={`flex flex-wrap items-center gap-4 text-gray-600 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`} style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.9}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}>
                    {data.address && data.address.trim() && (
                        <div className="flex items-center gap-2">
                            <MapPin size={12} style={{ color: accentColor }} />
                            <span>{formatContactText(data.address)}</span>
                        </div>
                    )}
                    {data.email && data.email.trim() && (
                        <div className="flex items-center gap-2">
                            <Mail size={12} style={{ color: accentColor }} />
                            <a href={`mailto:${formatContactText(data.email)}`} style={{ textDecoration: 'none', color: 'inherit' }}>{formatContactText(data.email)}</a>
                        </div>
                    )}
                    {data.phone && data.phone.trim() && (
                        <div className="flex items-center gap-2">
                            <Phone size={12} style={{ color: accentColor }} />
                            <span>{formatContactText(data.phone)}</span>
                        </div>
                    )}
                    {data.linkedin && data.linkedin.trim() && (
                        <div className="flex items-center gap-2">
                            <Linkedin size={12} style={{ color: accentColor }} />
                            <a
                                href={getLinkedInHref(data.linkedin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {formatLinkedInDisplay(data.linkedin)}
                            </a>
                        </div>
                    )}
                </div>

                <p
                    className={`font-semibold ${data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left'}`}
                    style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: accentColor }}
                >
                    {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
                </p>
            </header>

            {/* Dynamic Sections */}
            {getNormalizedSectionOrder(data.sectionOrder, ['summary', 'skills', 'achievements', 'experience', 'projects', 'certifications', 'education', 'additionalInfo', 'references']).map(id => (
                <React.Fragment key={id}>
                    {renderSection(id)}
                </React.Fragment>
            ))}
        </div>
    );
}
