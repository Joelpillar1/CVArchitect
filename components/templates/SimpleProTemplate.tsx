import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';

export default function SimpleProTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');

    const formatMonthYear = (dateString: string | null | undefined) => {
        return formatMonthYearUtil(dateString, 'long');
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
                            className={`font-bold uppercase mb-2 ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000', }}
                        >
                            {t.professionalSummary}
                        </h2>
                        <p className="text-gray-600 text-justify" style={{ fontSize: `${smallSize}pt`, lineHeight: '1.5' }}>
                            {data.summary}
                        </p>
                    </section>
                );

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 pb-1 border-b-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000',
                                borderColor: data.accentColor || '#000000',
                            }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-2 text-gray-700 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} style={{ fontSize: `${smallSize}pt` }}>
                            {data.skills.split(',').map((skill, i) => (
                                <div key={i} className="bg-gray-100 px-2 py-1 rounded text-center">
                                    {skill.trim()}
                                </div>
                            ))}
                        </div>
                    </section >
                );

            case 'experience':
                return data.experience.length > 0 && (
                    <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 pb-1 border-b-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000',
                                borderColor: data.accentColor || '#000000',
                            }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                            {exp.company}
                                        </h3>
                                        <div className="italic text-gray-600" style={{ fontSize: `${smallSize}pt` }}>
                                            {formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}
                                        </div>
                                    </div>
                                    <div className="italic text-gray-700 mb-2" style={{ fontSize: `${smallSize}pt` }}>
                                        {exp.role}
                                        {exp.location && (
                                            <span className="text-gray-600">
                                                {' '}• {exp.location}
                                            </span>
                                        )}
                                    </div>
                                    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700" style={{ fontSize: `${smallSize}pt` }}>
                                        {parseDescriptionBullets(exp.description).map((line, i) =>
                                            line.trim() && (
                                                <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
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
                    <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 pb-1 border-b-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000',
                                borderColor: data.accentColor || '#000000',
                            }}
                        >
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {data.projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                            {project.name}
                                            {project.link && (
                                                <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal italic text-gray-600 text-sm hover:underline">
                                                    Link
                                                </a>
                                            )}
                                        </h3>
                                    </div>
                                    {project.technologies && (
                                        <div className="text-sm text-gray-600 italic mb-1">
                                            {project.technologies}
                                        </div>
                                    )}
                                    <p className="text-gray-700 whitespace-pre-line" style={{ fontSize: `${smallSize}pt` }}>
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'achievements':
                return data.keyAchievements && (
                    <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 pb-1 border-b-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000',
                                borderColor: data.accentColor || '#000000',
                            }}
                        >
                            Key Achievements
                        </h2>
                        <ul
                            className="list-disc list-outside ml-5 space-y-1 text-gray-700"
                            style={{ fontSize: `${smallSize}pt` }}
                        >
                            {parseDescriptionBullets(data.keyAchievements).map((achievement, i) =>
                                achievement.trim() && (
                                    <li key={i}>{achievement.replace(/^[•-]\s*/, '')}</li>
                                )
                            )}
                        </ul>
                    </section >
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 pb-1 border-b-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000',
                                borderColor: data.accentColor || '#000000',
                            }}
                        >
                            {t.certifications}
                        </h2>
                        <div className="space-y-3">
                            {data.certifications.map((cert) => (
                                <div key={cert.id}>
                                    <div className="font-bold text-gray-900" style={{ fontSize: `${smallSize}pt` }}>
                                        {cert.name}
                                    </div>
                                    {cert.issuer && (
                                        <div className="italic text-gray-700" style={{ fontSize: `${smallSize}pt` }}>
                                            {cert.issuer}
                                        </div>
                                    )}
                                    {cert.date && (
                                        <div className="text-gray-600" style={{ fontSize: `${smallSize}pt` }}>
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 pb-1 border-b-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000',
                                borderColor: data.accentColor || '#000000',
                            }}
                        >
                            {t.educationTitle}
                        </h2>
                        <div className="space-y-3">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <div className="font-bold text-gray-900" style={{ fontSize: `${smallSize}pt` }}>
                                            {edu.school}
                                        </div>
                                        <div className="italic text-gray-700" style={{ fontSize: `${smallSize}pt` }}>
                                            {edu.degree}
                                        </div>
                                    </div>
                                    <div className="text-gray-600" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                                        {edu.year}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section >
                );

            case 'additionalInfo':
                return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 pb-1 border-b-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000',
                                borderColor: data.accentColor || '#000000',
                            }}
                        >
                            Additional Information
                        </h2>
                        <div className="space-y-2">
                            {data.additionalInfo.filter(item => item.label.trim() && item.value.trim()).map((item) => (
                                <div key={item.id} className="text-gray-700" style={{ fontSize: `${smallSize}pt` }}>
                                    <span className="font-bold">{item.label}:</span>
                                    <span className="ml-2">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'references':
                return data.referee && data.referee.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase mb-3 pb-1 border-b-2 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000',
                                borderColor: data.accentColor || '#000000',
                            }}
                        >
                            References
                        </h2>
                        <div className="text-gray-700" style={{ fontSize: `${smallSize}pt`, lineHeight: '1.6' }}>
                            {data.referee}
                        </div>
                    </section >
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
            <header className={`break-inside-avoid ${data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left'}`} style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
                <h1
                    className="font-bold uppercase"
                    style={{ fontSize: `${fontSizes?.header || 36}pt`, color: data.accentColor || '#000000', marginBottom: `${data.headerItemGap || 0.08}in` }}
                >
                    {data.fullName}
                </h1>
                <div className="text-gray-900 font-semibold" style={{ fontSize: `${fontSizes?.jobTitle || fontSizes?.body || 10}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}>
                    {data.jobTitle}
                </div>

                {/* Contact Info */}
                <div className={`flex gap-6 text-gray-700 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`} style={{ fontSize: `${smallSize}pt` }}>
                    {data.email && (
                        <div>
                            <a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{data.email}</a>
                        </div>
                    )}
                    {data.phone && <div>{data.phone}</div>}
                    {data.address && <div>{data.address}</div>}
                    {data.linkedin && (
                        <div>
                            <a
                                href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {data.linkedin.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                </div>
            </header>

            {/* Single Column Layout */}
            <div className="space-y-6">
                {/* Dynamic Sections */}
                {(data.sectionOrder || ['summary', 'skills', 'experience', 'projects', 'achievements', 'certifications', 'education', 'additionalInfo', 'references']).map(id => (
                    <React.Fragment key={id}>
                        {renderSection(id)}
                    </React.Fragment>
                ))}
            </div>
        </div >
    );
}
