import React from 'react';
import { ResumeData } from '../../types';
import { MapPin, Phone, Mail, Linkedin, Send } from 'lucide-react';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getItemGapIn, getMarginHorizontalIn, getMarginVerticalIn, formatContactText, formatLocationDisplay, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay, formatSectionTitle, splitSkillsList, CONTACT_SEPARATOR, renderExpertSkillsBlockHelper } from '../../utils/templateUtils';
import RichText from '../RichText';

interface FreshGradMarketingTemplateProps {
  data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

const FreshGradMarketingTemplate: React.FC<FreshGradMarketingTemplateProps> = ({ data }) => {
  const { fontSizes } = data;
  const getSectionHeaderAlignment = () => {
    const align = data.bodyHeaderAlignment || data.sectionHeaderAlignment || 'left';
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };
  const bodySize = fontSizes?.body || 9.5;
  const bodyStyle = {
    fontSize: `${bodySize}pt`,
    lineHeight: data.lineHeight || 1.5,
  };

  const sectionGap = `${getSectionGapIn(data)}in`;

  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full mb-2 ${getSectionHeaderAlignment()}`}>
      <h2
        className={`section-header font-bold tracking-[0.14em] text-xs leading-normal ${getSectionHeaderAlignment()}`}
        style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, color: data.accentColor || "#000000", marginBottom: '3px' }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase)}
      </h2>
      <div
        className="section-divider"
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: data.accentColor || "#000000",
          marginTop: '3px',
          marginBottom: '4px',
        }}
      />
    </div>
  );

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.5,
        fontSize: `${bodySize}pt`,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
        fontFamily: data.font || "Times New Roman, serif",
      }}
    >
      {/* Header */}
      <header className="break-inside-avoid" style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
        <h1
          className={`font-semibold ${
            data.headerAlignment === 'left' ? 'text-left' :
            data.headerAlignment === 'right' ? 'text-right' :
            'text-center'
          }`}
          style={{
            marginBottom: `${getHeaderItemGapIn(data)}in`,
            lineHeight: 1.15,
            fontSize: `${fontSizes?.header || 18}pt`,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase) || 'First Last'} />
        </h1>
        {(() => {
          const showIcons = data.showContactIcons ?? true;
          const items: React.ReactNode[] = [];
          const loc = data.location || data.address;
          if (loc) items.push(
            <span key="loc" className="inline-flex items-center gap-1">
              {showIcons && <MapPin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <span data-path="location"><RichText text={formatLocationDisplay(loc)} /></span>
            </span>
          );
          if (data.email) items.push(
            <span key="email" className="inline-flex items-center gap-1">
              {showIcons && <Mail size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <a data-path="email" href={`mailto:${formatContactText(data.email)}`} className="text-inherit no-underline">
                <RichText text={formatContactText(data.email)} />
              </a>
            </span>
          );
          if (data.phone) items.push(
            <span key="phone" className="inline-flex items-center gap-1">
              {showIcons && <Phone size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <span data-path="phone"><RichText text={formatContactText(data.phone)} /></span>
            </span>
          );
          if (data.linkedin) items.push(
            <span key="li" className="inline-flex items-center gap-1">
              {showIcons && <Linkedin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <a data-path="linkedin" href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" className="text-inherit no-underline">
                <RichText text={formatLinkedInDisplay(data.linkedin)} />
              </a>
            </span>
          );
          if (data.atHandle) items.push(
            <span key="at" className="inline-flex items-center gap-1">
              {showIcons && <Send size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <span data-path="atHandle"><RichText text={data.atHandle} /></span>
            </span>
          );
          if (items.length === 0) return null;

          return (
            <div
              className={`text-gray-900 flex flex-wrap ${showIcons ? 'gap-x-3 gap-y-1' : 'gap-x-1.5 gap-y-1'} ${
                data.contactAlignment === 'left' ? 'justify-start text-left' :
                data.contactAlignment === 'right' ? 'justify-end text-right' :
                data.contactAlignment === 'center' ? 'justify-center text-center' :
                data.headerAlignment === 'left' ? 'justify-start text-left' :
                data.headerAlignment === 'right' ? 'justify-end text-right' :
                'justify-center text-center'
              }`}
              style={{ ...bodyStyle, marginBottom: `${getHeaderContactGapIn(data)}in` }}
            >
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {!showIcons && index > 0 && <span className="mx-1 select-none text-gray-400">{CONTACT_SEPARATOR}</span>}
                  {item}
                </React.Fragment>
              ))}
            </div>
          );
        })()}
        {data.jobTitle && (
          <p
            className={
              data.jobTitleAlignment === 'left' ? 'text-left' :
              data.jobTitleAlignment === 'right' ? 'text-right' :
              data.jobTitleAlignment === 'center' ? 'text-center' :
              data.headerAlignment === 'left' ? 'text-left' :
              data.headerAlignment === 'right' ? 'text-right' :
              'text-center'
            }
            style={{
              fontSize: `${fontSizes?.jobTitle || 11}pt`,
              color: data.accentColor || '#000000',
              lineHeight: 1.25,
            }}
          >
            <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
          </p>
        )}
      </header>

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section
          className="break-inside-avoid"
          style={{ marginBottom: sectionGap }}
        >
          {renderSectionHeader('Education')}
          <div className="flex flex-col" style={{ gap: `${Math.max(0.14, getSectionGapIn(data))}in` }}>
            {data.education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid" style={bodyStyle}>
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-gray-900">
                    <RichText text={edu.school || 'Institution Name'} />
                  </div>
                  <div className="text-gray-900">
                    <RichText text={edu.year || 'Grad Year'} />
                  </div>
                </div>
                {edu.degree && (
                  <div className="italic text-gray-900">
                    <RichText text={edu.degree ?? ''} />
                  </div>
                )}
                {edu.gpa && edu.gpa.trim() && (
                  <div className="text-gray-900">
                    <RichText text={edu.gpa} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROFESSIONAL EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section
          className="break-inside-avoid"
          style={{ marginBottom: sectionGap }}
        >
          {renderSectionHeader('Professional Experience')}

          <div className="flex flex-col" style={{ gap: `${getItemGapIn(data)}in` }}>
            {data.experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid" style={bodyStyle}>
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-gray-900">
                    <RichText text={exp.company || 'Company Name'} />
                  </div>
                  <div className="text-gray-900">
                    <RichText text={formatMonthYear(exp.startDate)} /> – <RichText text={formatMonthYear(exp.endDate)} />
                  </div>
                </div>
                {exp.role && (
                  <div className="italic text-gray-900">
                    <RichText text={exp.role || 'Job Title'} />
                  </div>
                )}
                {exp.location && (
                  <div className="text-gray-900">
                    <RichText text={exp.location || 'City, State'} />
                  </div>
                )}
                {exp.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={bodyStyle}
                  >
                    {parseDescriptionBullets(exp.description).map((line, i) => (
                      <li key={i}><RichText text={line.replace(/^[•-]\s*/, '')} /></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LEADERSHIP */}
      {data.leadership && data.leadership.length > 0 && (
        <section
          className="break-inside-avoid"
          style={{ marginBottom: sectionGap }}
        >
          {renderSectionHeader('Leadership')}

          <div className="flex flex-col" style={{ gap: `${getItemGapIn(data)}in` }}>
            {data.leadership.map((lead) => (
              <div key={lead.id} className="break-inside-avoid" style={bodyStyle}>
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-gray-900">
                    <RichText text={lead.company || 'Organization Name'} />
                  </div>
                  <div className="text-gray-900">
                    <RichText text={formatMonthYear(lead.startDate)} /> – <RichText text={formatMonthYear(lead.endDate)} />
                  </div>
                </div>
                {lead.role && (
                  <div className="italic text-gray-900">
                    <RichText text={lead.role || 'Position Title'} />
                  </div>
                )}
                {lead.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={bodyStyle}
                  >
                    {parseDescriptionBullets(lead.description).map((line, i) => (
                      <li key={i}><RichText text={line.replace(/^[•-]\s*/, '')} /></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERT-LEVEL SKILLS */}
      {data.expertSkills && (
        renderExpertSkillsBlockHelper({
          data,
          title: (data.sectionTitles && data.sectionTitles['expert_skills']) || 'Expert-Level Skills',
          items: data.expertSkills,
          basePath: 'expertSkills',
          renderSectionHeader,
          bodyStyle,
        })
      )}

      {/* ADDITIONAL INFORMATION */}
      {(data.skills || (data.additionalInfo && data.additionalInfo.length > 0)) && (
        <section className="break-inside-avoid" style={{ marginBottom: sectionGap }}>
          {renderSectionHeader('Additional Information')}

          {data.skills && (() => {
            const skillsList = splitSkillsList(data.skills);
            if (skillsList.length === 0) return null;
            const columnCount = data.skillsColumnCount === 2 ? 2 : (data.skillsColumnCount === 4 ? 4 : 3);
            return (
              <ul
                data-skills-grid
                className={`list-none pl-2.5 grid gap-x-8 gap-y-1 text-gray-900 mb-2 ${columnCount === 2 ? 'grid-cols-2' : (columnCount === 4 ? 'grid-cols-4' : 'grid-cols-3')}`}
                style={bodyStyle}
              >
                {skillsList.map((skill, i) => (
                  <li key={`skill-${i}`} data-skill-cell className="flex items-baseline gap-1.5 min-w-0">
                    <span data-bullet aria-hidden="true" className="shrink-0 select-none pointer-events-none leading-none">•</span>
                    <span className="flex-1" style={{ lineHeight: 'inherit' }}><RichText text={skill} /></span>
                  </li>
                ))}
              </ul>
            );
          })()}
          {data.additionalInfo && data.additionalInfo.length > 0 && (
            <ul
              className="list-disc list-outside ml-5 space-y-1 text-gray-900"
              style={bodyStyle}
            >
              {data.additionalInfo
                .filter((item) => item.label.trim() || item.value.trim())
                .map((item) => (
                  <li key={item.id}>
                    {item.label && (
                      <span className="font-semibold">
                        <RichText text={item.label} />
                      </span>
                    )}
                    {item.value && (
                      <>
                        {item.label && <span>: </span>}
                        <span><RichText text={item.value} /></span>
                      </>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

      {/* REFERENCES */}
      {data.referee && data.referee.trim() && (
        <section className="break-inside-avoid" style={{ marginBottom: sectionGap }}>
          {renderSectionHeader('References')}
          <p className="italic text-gray-800 whitespace-pre-line" style={bodyStyle}>
            <RichText text={data.referee ?? ''} />
          </p>
        </section>
      )}
    </div>
  );
};

export default FreshGradMarketingTemplate;

