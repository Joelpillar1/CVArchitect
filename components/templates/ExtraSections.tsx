import React from 'react';
import { ResumeData } from '../../types';
import {
  getResolvedSectionOrder,
  normalizeSectionType,
  resolveSection,
  ResolvedSection,
} from '../../utils/sectionRegistry';
import {
  parseDescriptionBullets,
  splitSkillsList,
  formatMonthYear as formatMonthYearUtil,
} from '../../utils/templateUtils';
import RichText from '../RichText';

interface ExtraSectionsProps {
  data: ResumeData;
  /** Canonical section types the host template renders natively — never duplicated here. */
  exclude?: string[];
  /** The host template's own section-header renderer, so added sections match its typography. */
  renderHeader: (title: string) => React.ReactNode;
  /** The host template's body text style. */
  bodyStyle?: React.CSSProperties;
  /** Vertical space between sections (the host template's section gap). */
  sectionGap?: string;
  /** Vertical space between entries inside a section. */
  itemGap?: string;
}

const formatMonthYear = (value?: string | null) => formatMonthYearUtil(value ?? '', 'short');

/** Normalize bullet-ish content (string with newlines or array) into clean lines. */
const toLines = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? '')).filter((v) => v.trim());
  }
  if (typeof value === 'string' && value.trim()) {
    return parseDescriptionBullets(value)
      .map((v) => v.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);
  }
  return [];
};

/** Normalize free-text content into a single string. */
const toText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? '')).filter(Boolean).join('\n');
  }
  return '';
};

/**
 * Renders user-added sections that a fixed-layout template does not render
 * natively. Registry-driven templates iterate `getResolvedSectionOrder`
 * themselves; the fixed FreshGrad-family layouts hardcode their sections, so
 * without this block a section added from the sidebar or the hidden-sections
 * notice banner appears in the sidebar but never in the preview.
 *
 * Renders nothing when there are no extra sections, so native layouts are
 * pixel-identical to before.
 */
const ExtraSections: React.FC<ExtraSectionsProps> = ({
  data,
  exclude = [],
  renderHeader,
  bodyStyle,
  sectionGap = '0.2in',
  itemGap = '0.08in',
}) => {
  const excluded = new Set(exclude.map((id) => normalizeSectionType(id) || id));

  const sections = getResolvedSectionOrder(data)
    .filter((id) => {
      const type = normalizeSectionType(id) || id;
      if (type === 'contact' || type === 'expert_skills') return false;
      return !excluded.has(type);
    })
    .map((id) => resolveSection(data, id))
    .filter((s): s is ResolvedSection => Boolean(s && s.visible && s.hasContent));

  if (sections.length === 0) return null;

  const listStyle: React.CSSProperties = { ...bodyStyle };

  const renderBullets = (lines: string[]) => (
    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-900" style={listStyle}>
      {lines.map((line, i) => (
        <li key={i}>
          <RichText text={line} />
        </li>
      ))}
    </ul>
  );

  const renderKeyValue = (items: Array<{ label?: string; value?: string }>) => (
    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-900" style={listStyle}>
      {items
        .filter((item) => (item.label || '').trim() && (item.value || '').trim())
        .map((item, i) => (
          <li key={i}>
            <span className="font-semibold italic">
              <RichText text={item.label ?? ''} />:
            </span>{' '}
            <span>
              <RichText text={item.value ?? ''} />
            </span>
          </li>
        ))}
    </ul>
  );

  const renderExperienceEntries = (items: Array<Record<string, any>>) => (
    <div className="flex flex-col" style={{ gap: itemGap }}>
      {items.map((item, i) => {
        const dates = [formatMonthYear(item.startDate), formatMonthYear(item.endDate)].filter(Boolean).join(' – ');
        const lines = toLines(item.description);
        return (
          <div key={item.id ?? i} className="break-inside-avoid" style={bodyStyle}>
            {(item.company || item.organization || item.location || dates) && (
              <div className="flex justify-between items-baseline mb-0.5">
                <div className="text-gray-900">
                  {(item.company || item.organization) && (
                    <span className="font-semibold">
                      <RichText text={item.company || item.organization} />
                    </span>
                  )}
                  {item.location && <RichText text={`, ${item.location}`} />}
                </div>
                {dates && (
                  <div className="text-gray-900">
                    <RichText text={dates} />
                  </div>
                )}
              </div>
            )}
            {(item.role || item.title) && (
              <div className="italic text-gray-900 mb-0.5">
                <RichText text={item.role || item.title} />
              </div>
            )}
            {lines.length > 0 && renderBullets(lines)}
          </div>
        );
      })}
    </div>
  );

  const renderBody = (section: ResolvedSection): React.ReactNode => {
    const content = section.content;

    switch (section.rendererKind) {
      case 'text': {
        const text = toText(content);
        if (!text.trim()) return null;
        return (
          <p className="text-gray-900 whitespace-pre-line" style={bodyStyle}>
            <RichText text={text} />
          </p>
        );
      }

      case 'bullets': {
        const lines = toLines(content);
        if (lines.length === 0) return null;
        return renderBullets(lines);
      }

      case 'experience': {
        const items = Array.isArray(content) ? (content as Array<Record<string, any>>) : [];
        if (items.length === 0) return null;
        return renderExperienceEntries(items);
      }

      case 'education': {
        const items = Array.isArray(content) ? (content as Array<Record<string, any>>) : [];
        if (items.length === 0) return null;
        return (
          <div className="flex flex-col" style={{ gap: itemGap }}>
            {items.map((edu, i) => (
              <div key={edu.id ?? i} className="break-inside-avoid" style={bodyStyle}>
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-gray-900">
                    <RichText text={edu.school ?? ''} />
                  </div>
                  <div className="text-gray-900">
                    <RichText text={edu.year ?? ''} />
                  </div>
                </div>
                {edu.degree && (
                  <div className="italic text-gray-900">
                    <RichText text={edu.degree} />
                  </div>
                )}
                {edu.gpa && (
                  <div className="text-gray-900">
                    <RichText text={edu.gpa} />
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'skills': {
        const skillsList = splitSkillsList(toText(content));
        if (skillsList.length === 0) return null;
        const columnCount = data.skillsColumnCount === 2 ? 2 : data.skillsColumnCount === 4 ? 4 : 3;
        return (
          <ul
            className={`list-none pl-2.5 grid gap-x-8 gap-y-1 text-gray-900 ${
              columnCount === 2 ? 'grid-cols-2' : columnCount === 4 ? 'grid-cols-4' : 'grid-cols-3'
            }`}
            style={listStyle}
          >
            {skillsList.map((skill, i) => (
              <li key={`skill-${i}`} className="flex items-baseline gap-1.5 min-w-0">
                <span aria-hidden="true" className="shrink-0 select-none pointer-events-none leading-none">
                  •
                </span>
                <span className="flex-1" style={{ lineHeight: 'inherit' }}>
                  <RichText text={skill} />
                </span>
              </li>
            ))}
          </ul>
        );
      }

      case 'projects': {
        const items = Array.isArray(content) ? (content as Array<Record<string, any>>) : [];
        if (items.length === 0) return null;
        return (
          <div className="flex flex-col" style={{ gap: itemGap }}>
            {items.map((proj, i) => {
              const description = toText(proj.description);
              return (
                <div key={proj.id ?? i} className="break-inside-avoid" style={bodyStyle}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-semibold text-gray-900">
                      <RichText text={proj.name ?? ''} />
                    </div>
                    <div className="text-gray-900">
                      <RichText text={proj.date ?? ''} />
                    </div>
                  </div>
                  {proj.technologies && (
                    <div className="italic text-gray-900">
                      <RichText text={proj.technologies} />
                    </div>
                  )}
                  {description.trim() && (
                    <p className="text-gray-900 whitespace-pre-line">
                      <RichText text={description} />
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case 'certifications': {
        const items = Array.isArray(content) ? (content as Array<Record<string, any>>) : [];
        if (items.length === 0) return null;
        return (
          <div className="flex flex-col" style={{ gap: itemGap }}>
            {items.map((cert, i) => (
              <div key={cert.id ?? i} className="break-inside-avoid" style={bodyStyle}>
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-gray-900">
                    <RichText text={cert.name ?? ''} />
                  </div>
                  <div className="text-gray-900">
                    <RichText text={cert.date ?? ''} />
                  </div>
                </div>
                {cert.issuer && (
                  <div className="italic text-gray-900">
                    <RichText text={cert.issuer} />
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'languages': {
        const items = Array.isArray(content) ? (content as Array<Record<string, any>>) : [];
        if (items.length === 0) return null;
        return (
          <div className="text-gray-900" style={bodyStyle}>
            {items.map((lang, i) => (
              <React.Fragment key={lang.id ?? i}>
                {i > 0 && <span className="mx-1 select-none text-gray-400">•</span>}
                <span>
                  <RichText text={lang.language ?? ''} />
                  {lang.proficiency ? <span className="italic"> ({lang.proficiency})</span> : null}
                </span>
              </React.Fragment>
            ))}
          </div>
        );
      }

      case 'coursework': {
        const lines = toLines(content);
        if (lines.length === 0) return null;
        return renderBullets(lines);
      }

      case 'key_value': {
        const items = Array.isArray(content) ? (content as Array<{ label?: string; value?: string }>) : [];
        if (items.length === 0) return null;
        return renderKeyValue(items);
      }

      case 'custom': {
        const custom = content as
          | { title?: string; contentType?: 'text' | 'bullets' | 'key_value'; content?: unknown }
          | undefined;
        if (!custom) return null;
        if (custom.contentType === 'bullets') {
          const lines = toLines(custom.content);
          return lines.length > 0 ? renderBullets(lines) : null;
        }
        if (custom.contentType === 'key_value') {
          const items = Array.isArray(custom.content)
            ? (custom.content as Array<{ label?: string; value?: string }>)
            : [];
          return items.length > 0 ? renderKeyValue(items) : null;
        }
        const text = toText(custom.content);
        return text.trim() ? (
          <p className="text-gray-900 whitespace-pre-line" style={bodyStyle}>
            <RichText text={text} />
          </p>
        ) : null;
      }

      default:
        return null;
    }
  };

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="break-inside-avoid" style={{ marginBottom: sectionGap }}>
          {renderHeader(section.title)}
          {renderBody(section)}
        </section>
      ))}
    </>
  );
};

export default ExtraSections;
