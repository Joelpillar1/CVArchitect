import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';

export default function FreeTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');

    const formatMonthYear = (dateString: string | null | undefined) => {
        return formatMonthYearUtil(dateString, 'short');
    };

    // Calculate relative font sizes
    const bodySize = fontSizes?.body || 10.5;
    const smallSize = bodySize * 0.85;

    const getSectionHeaderAlignment = () => {
        if (data.bodyHeaderAlignment === 'center') return 'text-center';
        if (data.bodyHeaderAlignment === 'right') return 'text-right';
        return 'text-left';
    };

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            Summary
                        </h2>
                        <p className="text-gray-700 text-justify leading-relaxed" style={{ fontSize: `${bodySize}pt` }}>
                            {data.summary}
                        </p>
                    </section>
                );

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-x-4 gap-y-1 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {data.skills.split(',').map((skill, i) => (
                                skill.trim() && (
                                    <ul
                                        key={i}
                                        className="list-disc list-outside ml-4 space-y-1 text-gray-700"
                                        style={{ fontSize: `${bodySize}pt` }}
                                    >
                                        <li className="pl-1">
                                            {skill.trim()}
                                        </li>
                                    </ul>
                                )
                            ))}
                        </div>
                    </section>
                );

            case 'achievements':
                return data.keyAchievements && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            Key Achievements
                        </h2>
                        <ul
                            className="list-disc list-outside ml-4 space-y-1 text-gray-700 text-justify"
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
                    <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
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
                                    style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${data.sectionGap || 0.14}in` }}
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
                                        className="list-disc list-outside ml-4 space-y-1 text-gray-700"
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
                    <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.certifications}
                        </h2>
                        <ul
                            className="list-disc list-outside ml-4 space-y-1 text-gray-700"
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
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
                                    <div className="italic text-gray-600" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                                        {edu.year}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'additionalInfo':
                return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
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
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
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
                lineHeight: data.lineHeight || 1.4,
                paddingLeft: `${data.margins?.horizontal || 0.39}in`,
                paddingRight: `${data.margins?.horizontal || 0.39}in`,
                paddingTop: `${data.margins?.vertical || 0.45}in`,
                paddingBottom: `${data.margins?.vertical || 0.45}in`,
            }}
        >
            {/* Header */}
            <header className="break-inside-avoid" style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
                <div className={`${data.headerAlignment === 'center' ? 'flex flex-col items-center text-center' : data.headerAlignment === 'right' ? 'flex flex-col items-end text-right' : 'flex justify-between items-start'}`}>
                    <div className={data.headerAlignment === 'center' || data.headerAlignment === 'right' ? 'text-center' : ''}>
                        <h1
                            className={`font-bold mb-1 ${data.headerCase || 'uppercase'}`}
                            style={{ fontSize: `${fontSizes?.header || 28}pt`, color: data.accentColor || '#000000' }}
                        >
                            {data.fullName}
                        </h1>
                        <div className="text-gray-600" style={{ fontSize: `${fontSizes?.jobTitle || fontSizes?.body || 10}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}>
                            {data.jobTitle}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className={`text-gray-700 ${data.headerAlignment === 'center' ? 'flex flex-wrap justify-center gap-4 mt-3' : data.headerAlignment === 'right' ? 'text-right mt-3' : 'text-right'}`} style={{ fontSize: `${smallSize}pt` }}>
                        {data.email && (
                            <div className={data.headerAlignment === 'center' ? '' : 'mb-1'}>
                                <span className="font-semibold">Email</span> <a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{data.email}</a>
                            </div>
                        )}
                        {data.phone && (
                            <div className={data.headerAlignment === 'center' ? '' : 'mb-1'}>
                                <span className="font-semibold">Phone</span> {data.phone}
                            </div>
                        )}
                        {data.linkedin && (
                            <div className={data.headerAlignment === 'center' ? '' : 'mb-1'}>
                                <span className="font-semibold">LinkedIn</span> <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{data.linkedin.replace(/^https?:\/\//, '')}</a>
                            </div>
                        )}
                        {data.address && (
                            <div className={data.headerAlignment === 'center' ? '' : ''}>
                                <span className="font-semibold">Address</span> {data.address}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Dynamic Sections */}
            {
                (data.sectionOrder || ['summary', 'skills', 'achievements', 'experience', 'projects', 'education', 'certifications', 'additionalInfo', 'references']).map(id => (
                    <React.Fragment key={id}>
                        {renderSection(id)}
                    </React.Fragment>
                ))
            }
        </div >
    );
}
