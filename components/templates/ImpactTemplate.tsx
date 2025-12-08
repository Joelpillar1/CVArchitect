import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';
import { formatDate, parseDescriptionBullets } from '../../utils/templateUtils';

export default function ImpactTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');

    const formatMonthYear = (dateString: string) => {
        if (!dateString || dateString.toLowerCase() === 'present') {
            return 'Present';
        }
        try {
            const [year, month] = dateString.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };



    // Calculate relative font sizes based on body size
    const bodySize = fontSizes?.body || 10.5;
    const smallSize = bodySize * 0.85; // For contact info and dates
    const mediumSize = bodySize * 0.95; // For role summary and smaller text
    const largeSize = bodySize * 1.05; // For company names

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
                            className={`font-bold tracking-wide mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.professionalSummary}
                        </h2>
                        <p className="text-justify leading-relaxed text-gray-700" style={{ fontSize: `${bodySize}pt` }}>
                            {data.summary}
                        </p>
                    </section>
                );

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-x-4 gap-y-1 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {data.skills.split(',').map((skill, i) => (
                                <div key={i} className="text-gray-700 flex items-start" style={{ fontSize: `${mediumSize}pt` }}>
                                    <span className="mr-2">•</span>
                                    <span>{skill.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'achievements':
                return data.keyAchievements && data.keyAchievements.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            Key Achievements
                        </h2>
                        <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                            {data.keyAchievements.split('\n').map((line, i) => (
                                line.trim() && (
                                    <li key={i} style={{ fontSize: `${bodySize}pt` }}>{line.replace(/^[•-]\s*/, '')}</li>
                                )
                            ))}
                        </ul>
                    </section>
                );

            case 'experience':
                return data.experience.length > 0 && (
                    <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                                color: data.accentColor || '#000000'
                            }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
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
                                    <ul className="list-none space-y-1 ml-0">
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() && (
                                                <li key={i} className="text-gray-700 flex items-start" style={{ fontSize: `${mediumSize}pt` }}>
                                                    <span className="mr-2">•</span>
                                                    <span>{line.replace(/^[•-]\s*/, '')}</span>
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
                            className={`font-bold uppercase tracking-wide mb-4 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 ${getSectionHeaderAlignment()}`}
                            style={{
                                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 ${getSectionHeaderAlignment()}`}
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
                                        <span className="font-bold text-black" style={{ fontSize: `${bodySize}pt` }}>
                                            {edu.school}
                                        </span>
                                        <span className="text-gray-600 mx-2">|</span>
                                        <span className="italic text-gray-700" style={{ fontSize: `${bodySize}pt` }}>
                                            {edu.degree}
                                        </span>
                                    </div>
                                    <div className="italic text-gray-600" style={{ fontSize: `${mediumSize}pt` }}>
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
                            className={`font-bold uppercase tracking-wide mb-3 ${getSectionHeaderAlignment()}`}
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
                            className={`font-bold uppercase tracking-wide mb-3 ${getSectionHeaderAlignment()}`}
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
                <div className={`flex flex-col mb-2 ${data.headerAlignment === 'center' ? 'items-center text-center' : data.headerAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
                    <h1
                        className={`font-bold tracking-tight ${data.headerCase || 'uppercase'}`}
                        style={{ fontSize: `${fontSizes?.header || 32}pt`, color: data.accentColor || '#000000', marginBottom: `${data.headerItemGap || 0.05}in` }}
                    >
                        {data.fullName}
                    </h1>
                    <div
                        className="text-gray-500 uppercase tracking-widest"
                        style={{ fontSize: `${fontSizes?.jobTitle || 14}pt`, letterSpacing: '0.2em', marginBottom: `${data.headerItemGap || 0.08}in` }}
                    >
                        {data.jobTitle}
                    </div>
                </div>

                {/* Contact Info */}
                <div className={`text-gray-600 flex flex-wrap gap-2 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`} style={{ fontSize: `${smallSize}pt` }}>
                    {data.phone && <span>{data.phone}</span>}
                    {data.phone && (data.email || data.address || data.linkedin) && <span>|</span>}
                    {data.email && <a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{data.email}</a>}
                    {data.email && (data.address || data.linkedin) && <span>|</span>}
                    {data.address && <span>{data.address}</span>}
                    {data.address && data.linkedin && <span>|</span>}
                    {data.linkedin && <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{data.linkedin.replace(/^https?:\/\//, '')}</a>}
                </div>
            </header>

            {/* Dynamic Sections */}
            {(data.sectionOrder || ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements', 'additionalInfo', 'references']).map(id => (
                <React.Fragment key={id}>
                    {renderSection(id)}
                </React.Fragment>
            ))}
        </div>
    );
}
