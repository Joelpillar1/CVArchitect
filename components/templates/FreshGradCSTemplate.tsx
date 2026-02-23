import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';

interface FreshGradCSTemplateProps {
  data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

const FreshGradCSTemplate: React.FC<FreshGradCSTemplateProps> = ({ data }) => {
  const { fontSizes } = data;
  const bodySize = fontSizes?.body || 10.5;
  const smallSize = bodySize * 0.85;

  const sectionGap = data.sectionGap || 0.18;

  const renderSectionHeader = (title: string) => (
    <h2
      className="uppercase font-bold tracking-[0.14em] text-xs border-b border-black pb-1 mb-2"
      style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
    >
      {title}
    </h2>
  );

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.25,
        paddingLeft: `${data.margins?.horizontal || 0.75}in`,
        paddingRight: `${data.margins?.horizontal || 0.75}in`,
        paddingTop: `${data.margins?.vertical || 0.7}in`,
        paddingBottom: `${data.margins?.vertical || 0.7}in`,
        fontFamily: data.font || "Times New Roman, serif",
      }}
    >
      {/* Header */}
      <header className="text-center mb-4">
        <h1
          className="font-bold"
          style={{
            fontSize: `${fontSizes?.header || 24}pt`,
          }}
        >
          {data.fullName || 'Name'}
        </h1>
        <div
          className="mt-1 text-gray-900"
          style={{ fontSize: `${smallSize}pt` }}
        >
          {[
            data.location || data.address,
            data.email,
            data.phone,
            data.linkedin ? data.linkedin.replace(/https?:\/\/(www\.)?/, '') : undefined,
          ]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </header>

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Education')}

          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div
                    className="font-semibold text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.school || 'Tufts University, Medford, MA'}
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {edu.year || (index === 0 ? 'May 20xx' : '')}
                  </div>
                </div>
                <div
                  className="italic text-gray-900"
                  style={{ fontSize: `${bodySize}pt` }}
                >
                  {edu.degree ||
                    'Bachelor of Science in Computer Science, Minor Music Engineering'}
                </div>
                {index === 0 && (
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.gpa && edu.gpa.trim()
                      ? edu.gpa
                      : 'GPA 3.53, Dean\'s List'}
                  </div>
                )}
                {/* Relevant Courses for any education item that has it filled */}
                {edu.relevantCourses && edu.relevantCourses.trim() && (
                  <div
                    className="mt-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold italic">
                      Relevant Courses:
                    </span>{' '}
                    {edu.relevantCourses}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TECHNICAL SKILLS */}
      {data.skills && data.skills.trim() && (
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Technical Skills')}
          <div
            className="space-y-1 text-gray-900"
            style={{ fontSize: `${bodySize}pt` }}
          >
            <div>
              <span className="font-semibold italic">Software/Tools: </span>
              {data.skills}
            </div>
            {data.additionalInfo
              ?.filter(
                (item) =>
                  item.label.toLowerCase().includes('programming') &&
                  item.value.trim(),
              )
              .map((item) => (
                <div key={item.id}>
                  <span className="font-semibold italic">
                    {item.label}:
                  </span>{' '}
                  {item.value}
                </div>
              ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Projects')}

          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold italic">
                      {project.name}
                    </span>
                    {project.technologies && (
                      <span>, {project.technologies}</span>
                    )}
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {/* Date placeholder */}
                    {project.link || ''}
                  </div>
                </div>

                {project.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {parseDescriptionBullets(project.description).map(
                      (line, i) =>
                        line.trim() && (
                          <li key={i}>
                            {line.replace(/^[•-]\s*/, '')}
                          </li>
                        ),
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Experience')}

          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold">
                      {exp.company}
                    </span>
                    {exp.location && `, ${exp.location}`}
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {formatMonthYear(exp.startDate)} –{' '}
                    {formatMonthYear(exp.endDate)}
                  </div>
                </div>
                {exp.role && (
                  <div
                    className="italic text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {exp.role}
                  </div>
                )}
                {exp.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {parseDescriptionBullets(exp.description).map(
                      (line, i) =>
                        line.trim() && (
                          <li key={i}>
                            {line.replace(/^[•-]\s*/, '')}
                          </li>
                        ),
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ATHLETICS */}
      {data.leadership && data.leadership.length > 0 && (
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Athletics')}

          <div className="space-y-3">
            {data.leadership.map((role) => (
              <div key={role.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold">
                      {role.company}
                    </span>
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {formatMonthYear(role.startDate)} –{' '}
                    {formatMonthYear(role.endDate)}
                  </div>
                </div>
                {role.role && (
                  <div
                    className="italic text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {role.role}
                  </div>
                )}
                {role.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {parseDescriptionBullets(role.description).map(
                      (line, i) =>
                        line.trim() && (
                          <li key={i}>
                            {line.replace(/^[•-]\s*/, '')}
                          </li>
                        ),
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACTIVITIES */}
      {data.additionalInfo && data.additionalInfo.length > 0 && (
        <section className="break-inside-avoid">
          {renderSectionHeader('Activities')}

          <div
            className="space-y-1 text-gray-900"
            style={{ fontSize: `${bodySize}pt` }}
          >
            {data.additionalInfo
              .filter((item) => item.label.trim() && item.value.trim())
              .map((item) => (
                <div key={item.id}>
                  <span className="font-semibold italic">
                    {item.label}
                  </span>
                  {item.value && <span>, {item.value}</span>}
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FreshGradCSTemplate;

