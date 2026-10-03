/**
 * docxExport.ts
 *
 * High-performance client-side Word (.docx) export for CVArchitect resumes.
 * Built using the official 'docx' package with 100% browser-native generation (0 backend required).
 *
 * Features:
 * - Full template fidelity matching the exact exported template selected by the user:
 *   - The Vanguard, Elevate, Prime, Impact, DevPro, Apex/Elite, Modern, Classic, Two-Column,
 *     Harvard/Rezi, Times Classic, Sage, Styled, Elegant, SimplePro, Student, FreshGrad 1-8, etc.
 * - Dynamic typography matching template identity (Font family, font sizes, line spacing, margins).
 * - Distinct section heading styles (Solid accent line, Left-border bar, Block badge prefix, No-border modern, Harvard rules).
 * - True Two-Column Table layout for 'twocolumn' template (Left sidebar 32%, Right main 68%).
 * - Template-aware header alignments (Centered Harvard/Times/Academic vs. Left Modern/Dev/Exec).
 * - Right-aligned date/location alignment using native Word right-tab stops.
 * - Rich-text HTML parser (converts <b>, <strong>, <i>, <em>, <a> into native TextRuns & ExternalHyperlinks).
 * - Full support for all CVArchitect sections: Personal Info, Summary, Experience, Education, Skills,
 *   Expert Skills, Technical Skills, Core Competencies, Projects, Certifications, Leadership,
 *   Volunteering, Coursework, Publications, Awards, Languages, Additional Info, and Custom Sections.
 * - Instant memory-safe browser download.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  HeadingLevel,
  BorderStyle,
  AlignmentType,
  TabStopType,
  TabStopPosition,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertMillimetersToTwip,
  convertInchesToTwip,
} from 'docx';
import {
  ResumeData,
  TemplateType,
  Experience,
  Education,
  Project,
  Certification,
  LanguageItem,
  AdditionalInfoItem,
  CourseworkItem,
} from '../types';
import { downloadFile, sanitizeFilename } from './pdfExport';
import { parseExpertSkillItems } from './templateUtils';

// --- Color & Unit Helpers ---

function cleanHexColor(colorStr?: string, fallback = '1E3A8A'): string {
  if (!colorStr) return fallback;
  const trimmed = colorStr.trim().replace(/^#/, '');
  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  if (/^[0-9A-Fa-f]{3}$/.test(trimmed)) {
    return trimmed
      .split('')
      .map((c) => c + c)
      .join('')
      .toUpperCase();
  }
  return fallback;
}

/** Convert pt font size to docx half-points (docx uses half-points: 10pt = 20). */
function ptToHalfPt(pt: number): number {
  return Math.max(12, Math.round(pt * 2));
}

/** Convert pt spacing to twips (1pt = 20 twips). */
function ptToTwips(pt: number): number {
  return Math.round(pt * 20);
}

/** Safe URL validation for Word hyperlinks */
function toSafeLink(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.includes('@') && !trimmed.includes('/')) return `mailto:${trimmed}`;
  return `https://${trimmed}`;
}

// --- Rich-Text / HTML to DOCX Inline Elements Parser ---

interface InlineRunStyle {
  bold?: boolean;
  italics?: boolean;
  underline?: {};
  font?: string;
  size?: number;
  color?: string;
}

/**
 * Parses simple HTML strings (e.g. from rich text editors containing <b>, <strong>, <i>, <em>, <a>)
 * into an array of Word TextRun and ExternalHyperlink elements.
 */
export function parseHtmlToDocxRuns(
  htmlText: string,
  baseStyle: InlineRunStyle = {},
  accentColorHex = '000000'
): (TextRun | ExternalHyperlink)[] {
  if (!htmlText) return [];

  // If no HTML tags present, return standard text run directly
  if (!/<[a-z][\s\S]*>/i.test(htmlText)) {
    return [
      new TextRun({
        text: htmlText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        bold: baseStyle.bold,
        italics: baseStyle.italics,
        underline: baseStyle.underline,
        font: baseStyle.font,
        size: baseStyle.size,
        color: baseStyle.color,
      }),
    ];
  }

  // Parse HTML using DOMParser in browser / jsdom
  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<body>${htmlText}</body>`, 'text/html');
      const runs: (TextRun | ExternalHyperlink)[] = [];

      const traverse = (node: Node, currentStyle: InlineRunStyle) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = (node.textContent || '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
          if (text) {
            runs.push(
              new TextRun({
                text,
                bold: currentStyle.bold,
                italics: currentStyle.italics,
                underline: currentStyle.underline,
                font: currentStyle.font,
                size: currentStyle.size,
                color: currentStyle.color,
              })
            );
          }
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tag = el.tagName.toUpperCase();

          if (tag === 'A') {
            const href = toSafeLink(el.getAttribute('href') || el.textContent || '');
            const linkText = el.textContent || href || '';
            if (href) {
              runs.push(
                new ExternalHyperlink({
                  link: href,
                  children: [
                    new TextRun({
                      text: linkText,
                      underline: {},
                      color: accentColorHex,
                      font: currentStyle.font,
                      size: currentStyle.size,
                    }),
                  ],
                })
              );
            }
            return;
          }

          const nextStyle: InlineRunStyle = { ...currentStyle };
          if (tag === 'B' || tag === 'STRONG') nextStyle.bold = true;
          if (tag === 'I' || tag === 'EM') nextStyle.italics = true;
          if (tag === 'U') nextStyle.underline = {};

          for (let i = 0; i < el.childNodes.length; i++) {
            traverse(el.childNodes[i], nextStyle);
          }
        }
      };

      for (let i = 0; i < doc.body.childNodes.length; i++) {
        traverse(doc.body.childNodes[i], baseStyle);
      }

      if (runs.length > 0) return runs;
    } catch {
      // Fall through to regex stripper on parser failure
    }
  }

  // Fallback: Strip HTML tags
  const plain = htmlText.replace(/<[^>]+>/g, '');
  return [
    new TextRun({
      text: plain,
      bold: baseStyle.bold,
      italics: baseStyle.italics,
      underline: baseStyle.underline,
      font: baseStyle.font,
      size: baseStyle.size,
      color: baseStyle.color,
    }),
  ];
}

// --- Template Profile Definition ---

type HeadingDividerStyle =
  | 'accent_line' // Solid 1pt accent color bottom border (Vanguard, Styled, Classic)
  | 'gray_line' // Subtle gray bottom border (Elevate, Free)
  | 'thick_line' // 1.5pt solid line (Classic, Styled)
  | 'left_bar' // Thick colored left bar border, no bottom line (Executive, Apex, Elite)
  | 'prefix_block' // Square/pipe colored prefix symbol '▎ ', no underline (DevPro)
  | 'no_border' // Clean open heading without underline (Modern, Minimalist)
  | 'harvard_rule'; // Dark/Black formal rule (Rezi, Times, Sage)

interface TemplateProfile {
  defaultFont: string;
  defaultAccent: string;
  headingStyle: HeadingDividerStyle;
  defaultHeaderAlign: 'center' | 'left' | 'right';
  defaultSectionOrder: string[];
  isTwoColumn?: boolean;
}

const TEMPLATE_PROFILES: Record<string, TemplateProfile> = {
  vanguard: {
    defaultFont: 'Calibri',
    defaultAccent: '2563EB',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  modern: {
    defaultFont: 'Arial',
    defaultAccent: '0D9488',
    headingStyle: 'no_border',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  minimalist: {
    defaultFont: 'Arial',
    defaultAccent: '111827',
    headingStyle: 'no_border',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  times: {
    defaultFont: 'Times New Roman',
    defaultAccent: '111827',
    headingStyle: 'harvard_rule',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'leadership', 'additionalInfo'],
  },
  rezi: {
    defaultFont: 'Garamond',
    defaultAccent: '2E3D50',
    headingStyle: 'harvard_rule',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'education', 'coursework', 'experience', 'projects', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  dev: {
    defaultFont: 'Consolas',
    defaultAccent: '0F172A',
    headingStyle: 'prefix_block',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'skills', 'expert_skills', 'experience', 'projects', 'education', 'certifications', 'leadership', 'additionalInfo'],
  },
  executive: {
    defaultFont: 'Calibri',
    defaultAccent: '1E3A8A',
    headingStyle: 'left_bar',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  apex: {
    defaultFont: 'Calibri',
    defaultAccent: '1E3A8A',
    headingStyle: 'left_bar',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  elite: {
    defaultFont: 'Calibri',
    defaultAccent: '1E3A8A',
    headingStyle: 'left_bar',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  twocolumn: {
    defaultFont: 'Calibri',
    defaultAccent: '1E3A5F',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
    isTwoColumn: true,
  },
  elevate: {
    defaultFont: 'Calibri',
    defaultAccent: '374151',
    headingStyle: 'gray_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  prime: {
    defaultFont: 'Georgia',
    defaultAccent: 'D97706',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  impact: {
    defaultFont: 'Calibri',
    defaultAccent: 'DC2626',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'leadership', 'additionalInfo'],
  },
  classic: {
    defaultFont: 'Calibri',
    defaultAccent: '1F2937',
    headingStyle: 'gray_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'leadership', 'additionalInfo'],
  },
  wonsulting: {
    defaultFont: 'Garamond',
    defaultAccent: '047857',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  styled: {
    defaultFont: 'Calibri',
    defaultAccent: '1D4ED8',
    headingStyle: 'thick_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  elegant: {
    defaultFont: 'Calibri',
    defaultAccent: '475569',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'leadership', 'additionalInfo'],
  },
  smart: {
    defaultFont: 'Calibri',
    defaultAccent: '475569',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'leadership', 'additionalInfo'],
  },
  simplepro: {
    defaultFont: 'Calibri',
    defaultAccent: 'F97316',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'leadership', 'additionalInfo'],
  },
  professional: {
    defaultFont: 'Calibri',
    defaultAccent: '2563EB',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  free: {
    defaultFont: 'Calibri',
    defaultAccent: '4B5563',
    headingStyle: 'gray_line',
    defaultHeaderAlign: 'left',
    defaultSectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'leadership', 'additionalInfo'],
  },
  sage: {
    defaultFont: 'Calibri',
    defaultAccent: '2C4770',
    headingStyle: 'harvard_rule',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'leadership', 'additionalInfo'],
  },
  student: {
    defaultFont: 'Garamond',
    defaultAccent: '3B82F6',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'education', 'coursework', 'projects', 'experience', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  freshgrad1: {
    defaultFont: 'Garamond',
    defaultAccent: '059669',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'education', 'coursework', 'experience', 'projects', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
  freshgrad8: {
    defaultFont: 'Calibri',
    defaultAccent: '4338CA',
    headingStyle: 'accent_line',
    defaultHeaderAlign: 'center',
    defaultSectionOrder: ['summary', 'education', 'coursework', 'experience', 'projects', 'skills', 'certifications', 'leadership', 'additionalInfo'],
  },
};

function getTemplateProfile(templateId?: TemplateType): TemplateProfile {
  if (templateId && TEMPLATE_PROFILES[templateId]) {
    return TEMPLATE_PROFILES[templateId];
  }
  // If template is freshgrad2-7, return freshgrad profile
  if (templateId && templateId.startsWith('freshgrad')) {
    return TEMPLATE_PROFILES.freshgrad1;
  }
  return TEMPLATE_PROFILES.vanguard;
}

// --- Section Heading Component ---

function createSectionHeading(
  title: string,
  fontFamily: string,
  headingHalfPt: number,
  accentColorHex: string,
  headingStyle: HeadingDividerStyle,
  caseStyle: 'uppercase' | 'capitalize' | 'titlecase' = 'uppercase',
  align: AlignmentType = AlignmentType.LEFT
): Paragraph {
  let displayTitle = title;
  if (caseStyle === 'uppercase') {
    displayTitle = title.toUpperCase();
  } else if (caseStyle === 'capitalize' || caseStyle === 'titlecase') {
    displayTitle = title.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // 1. Left Bar Header (Executive / Apex / Elite)
  if (headingStyle === 'left_bar') {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      alignment: align,
      spacing: { before: 200, after: 80 },
      border: {
        left: {
          style: BorderStyle.SINGLE,
          size: 24, // ~3pt solid bar
          color: accentColorHex,
          space: 6,
        },
      },
      children: [
        new TextRun({
          text: `  ${displayTitle}`,
          bold: true,
          font: fontFamily,
          size: headingHalfPt,
          color: '111827',
        }),
      ],
    });
  }

  // 2. Prefix Block Header (DevPro)
  if (headingStyle === 'prefix_block') {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      alignment: align,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: '▎ ',
          bold: true,
          font: fontFamily,
          size: headingHalfPt,
          color: accentColorHex,
        }),
        new TextRun({
          text: displayTitle,
          bold: true,
          font: fontFamily,
          size: headingHalfPt,
          color: '111827',
        }),
      ],
    });
  }

  // 3. No Border Header (Modern / Minimalist)
  if (headingStyle === 'no_border') {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      alignment: align,
      spacing: { before: 220, after: 80 },
      children: [
        new TextRun({
          text: displayTitle,
          bold: true,
          font: fontFamily,
          size: headingHalfPt,
          color: accentColorHex,
        }),
      ],
    });
  }

  // 4. Harvard / Black Rule (Rezi / Times / Sage)
  if (headingStyle === 'harvard_rule') {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      alignment: align,
      spacing: { before: 200, after: 70 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 8, // 1pt solid line
          color: '111827',
        },
      },
      children: [
        new TextRun({
          text: displayTitle,
          bold: true,
          font: fontFamily,
          size: headingHalfPt,
          color: accentColorHex !== '000000' && accentColorHex !== '111827' ? accentColorHex : '111827',
        }),
      ],
    });
  }

  // 5. Subtle Gray Line (Elevate / Classic / Free)
  if (headingStyle === 'gray_line') {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      alignment: align,
      spacing: { before: 200, after: 70 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 8,
          color: '9CA3AF',
        },
      },
      children: [
        new TextRun({
          text: displayTitle,
          bold: true,
          font: fontFamily,
          size: headingHalfPt,
          color: accentColorHex,
        }),
      ],
    });
  }

  // 6. Default Accent Color Line (Vanguard, Styled, Impact, SimplePro, Academic)
  const lineSize = headingStyle === 'thick_line' ? 12 : 8;
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: align,
    spacing: { before: 220, after: 80 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: lineSize,
        color: accentColorHex,
      },
    },
    children: [
      new TextRun({
        text: displayTitle,
        bold: true,
        font: fontFamily,
        size: headingHalfPt,
        color: accentColorHex,
      }),
    ],
  });
}

// --- Section Body Generators ---

function generateSectionParagraphs(
  sectionKey: string,
  data: ResumeData,
  fontFamily: string,
  bodySize: number,
  smallSize: number,
  sectionTitleSize: number,
  textColor: string,
  subtextColor: string,
  accentColor: string,
  bodyLineSpacing: number,
  baseBodyStyle: InlineRunStyle,
  headingStyle: HeadingDividerStyle
): Paragraph[] {
  const paras: Paragraph[] = [];

  // Helper to check section visibility
  if (data.sectionVisibility && data.sectionVisibility[sectionKey] === false) {
    return paras;
  }

  // Helper for section heading alignment
  const align =
    data.bodyHeaderAlignment === 'center' || data.sectionHeaderAlignment === 'center'
      ? AlignmentType.CENTER
      : data.bodyHeaderAlignment === 'right' || data.sectionHeaderAlignment === 'right'
      ? AlignmentType.RIGHT
      : AlignmentType.LEFT;

  // 1. PROFESSIONAL SUMMARY
  if (sectionKey === 'summary' && data.summary && data.summary.trim()) {
    const title = data.sectionTitles?.summary || 'Professional Summary';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    const summaryRuns = parseHtmlToDocxRuns(data.summary, baseBodyStyle, accentColor);
    paras.push(
      new Paragraph({
        spacing: { before: 40, after: 120, line: bodyLineSpacing },
        children: summaryRuns,
      })
    );
  }

  // 2. WORK EXPERIENCE
  if (sectionKey === 'experience' && data.experience && data.experience.length > 0) {
    const title = data.sectionTitles?.experience || 'Work Experience';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    for (const exp of data.experience) {
      const dateRange = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');

      // Role + Date
      paras.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              font: fontFamily,
              size: bodySize + 1,
              color: textColor,
            }),
            ...(dateRange
              ? [
                  new TextRun({
                    text: `\t${dateRange}`,
                    bold: true,
                    font: fontFamily,
                    size: smallSize,
                    color: subtextColor,
                  }),
                ]
              : []),
          ],
        })
      );

      // Company + Location
      const companyParts: TextRun[] = [];
      if (exp.company) {
        companyParts.push(
          new TextRun({
            text: exp.company,
            italics: true,
            font: fontFamily,
            size: bodySize,
            color: accentColor,
          })
        );
      }
      if (exp.location) {
        companyParts.push(
          new TextRun({
            text: `\t${exp.location}`,
            italics: true,
            font: fontFamily,
            size: smallSize,
            color: subtextColor,
          })
        );
      }

      if (companyParts.length > 0) {
        paras.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            spacing: { after: 40 },
            children: companyParts,
          })
        );
      }

      if (exp.roleSummary) {
        paras.push(
          new Paragraph({
            spacing: { after: 40, line: bodyLineSpacing },
            children: parseHtmlToDocxRuns(exp.roleSummary, baseBodyStyle, accentColor),
          })
        );
      }

      const bullets = Array.isArray(exp.description)
        ? exp.description
        : exp.description
        ? exp.description.split('\n').filter((l) => l.trim().length > 0)
        : [];

      for (const bullet of bullets) {
        const clean = bullet.replace(/^[•\-*]\s*/, '');
        paras.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30, line: bodyLineSpacing },
            children: parseHtmlToDocxRuns(clean, baseBodyStyle, accentColor),
          })
        );
      }
    }
  }

  // 3. EDUCATION
  if (sectionKey === 'education' && data.education && data.education.length > 0) {
    const title = data.sectionTitles?.education || 'Education';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    for (const edu of data.education) {
      paras.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: edu.degree,
              bold: true,
              font: fontFamily,
              size: bodySize + 1,
              color: textColor,
            }),
            ...(edu.year
              ? [
                  new TextRun({
                    text: `\t${edu.year}`,
                    bold: true,
                    font: fontFamily,
                    size: smallSize,
                    color: subtextColor,
                  }),
                ]
              : []),
          ],
        })
      );

      if (edu.school) {
        paras.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: edu.school,
                italics: true,
                font: fontFamily,
                size: bodySize,
                color: accentColor,
              }),
              ...(edu.gpa
                ? [
                    new TextRun({
                      text: `  |  GPA: ${edu.gpa}`,
                      font: fontFamily,
                      size: smallSize,
                      color: subtextColor,
                    }),
                  ]
                : []),
            ],
          })
        );
      }

      if (edu.relevantCourses) {
        paras.push(
          new Paragraph({
            spacing: { after: 40, line: bodyLineSpacing },
            children: [
              new TextRun({
                text: 'Relevant Coursework: ',
                bold: true,
                font: fontFamily,
                size: smallSize,
                color: textColor,
              }),
              new TextRun({
                text: edu.relevantCourses,
                font: fontFamily,
                size: smallSize,
                color: subtextColor,
              }),
            ],
          })
        );
      }
    }
  }

  // 4. SKILLS
  if (sectionKey === 'skills' && (data.skills || data.technicalSkills || data.coreCompetencies)) {
    const title = data.sectionTitles?.skills || 'Skills';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    if (data.skills) {
      paras.push(
        new Paragraph({
          spacing: { before: 40, after: 50, line: bodyLineSpacing },
          children: parseHtmlToDocxRuns(data.skills, baseBodyStyle, accentColor),
        })
      );
    }

    if (data.technicalSkills) {
      paras.push(
        new Paragraph({
          spacing: { after: 40, line: bodyLineSpacing },
          children: [
            new TextRun({ text: 'Technical Skills: ', bold: true, font: fontFamily, size: bodySize, color: textColor }),
            new TextRun({ text: data.technicalSkills, font: fontFamily, size: bodySize, color: textColor }),
          ],
        })
      );
    }

    if (data.coreCompetencies) {
      paras.push(
        new Paragraph({
          spacing: { after: 40, line: bodyLineSpacing },
          children: [
            new TextRun({ text: 'Core Competencies: ', bold: true, font: fontFamily, size: bodySize, color: textColor }),
            new TextRun({ text: data.coreCompetencies, font: fontFamily, size: bodySize, color: textColor }),
          ],
        })
      );
    }
  }

  // 5. EXPERT SKILLS
  if ((sectionKey === 'expert_skills' || sectionKey === 'expertSkills') && data.expertSkills) {
    const title = data.sectionTitles?.expert_skills || data.sectionTitles?.expertSkills || 'Expert-Level Skills';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    const expertItems = parseExpertSkillItems(data.expertSkills);
    for (const item of expertItems) {
      if (!item.category && !item.skills) continue;
      const runs: (TextRun | ExternalHyperlink)[] = [];
      if (item.category) {
        runs.push(
          new TextRun({
            text: `${item.category}: `,
            bold: true,
            font: fontFamily,
            size: bodySize,
            color: textColor,
          })
        );
      }
      if (item.skills) {
        runs.push(...parseHtmlToDocxRuns(item.skills, baseBodyStyle, accentColor));
      }

      paras.push(
        new Paragraph({
          spacing: { after: 40, line: bodyLineSpacing },
          children: runs,
        })
      );
    }
  }

  // 6. PROJECTS
  if (sectionKey === 'projects' && data.projects && data.projects.length > 0) {
    const title = data.sectionTitles?.projects || 'Projects';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    for (const proj of data.projects) {
      const projHeaderParts: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: proj.name,
          bold: true,
          font: fontFamily,
          size: bodySize + 1,
          color: textColor,
        }),
      ];

      if (proj.link) {
        const safeLink = toSafeLink(proj.link);
        if (safeLink) {
          projHeaderParts.push(
            new TextRun({ text: '  [', font: fontFamily, size: smallSize, color: 'A0AEC0' }),
            new ExternalHyperlink({
              link: safeLink,
              children: [
                new TextRun({
                  text: proj.link,
                  underline: {},
                  color: accentColor,
                  font: fontFamily,
                  size: smallSize,
                }),
              ],
            }),
            new TextRun({ text: ']', font: fontFamily, size: smallSize, color: 'A0AEC0' })
          );
        }
      }

      paras.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: projHeaderParts,
        })
      );

      if (proj.technologies) {
        paras.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: `Technologies: ${proj.technologies}`,
                italics: true,
                font: fontFamily,
                size: smallSize,
                color: subtextColor,
              }),
            ],
          })
        );
      }

      if (proj.description) {
        const bullets = proj.description.split('\n').filter((l) => l.trim().length > 0);
        for (const b of bullets) {
          const clean = b.replace(/^[•\-*]\s*/, '');
          paras.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30, line: bodyLineSpacing },
              children: parseHtmlToDocxRuns(clean, baseBodyStyle, accentColor),
            })
          );
        }
      }
    }
  }

  // 7. CERTIFICATIONS
  if (sectionKey === 'certifications' && data.certifications && data.certifications.length > 0) {
    const title = data.sectionTitles?.certifications || 'Certifications';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    for (const cert of data.certifications) {
      paras.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 50, after: 20 },
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              font: fontFamily,
              size: bodySize,
              color: textColor,
            }),
            ...(cert.date
              ? [
                  new TextRun({
                    text: `\t${cert.date}`,
                    font: fontFamily,
                    size: smallSize,
                    color: subtextColor,
                  }),
                ]
              : []),
          ],
        })
      );

      if (cert.issuer) {
        paras.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: cert.issuer,
                italics: true,
                font: fontFamily,
                size: smallSize,
                color: accentColor,
              }),
            ],
          })
        );
      }
    }
  }

  // 8. LEADERSHIP & ACTIVITIES
  if (sectionKey === 'leadership' && data.leadership && data.leadership.length > 0) {
    const title = data.sectionTitles?.leadership || 'Leadership & Activities';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    for (const lead of data.leadership) {
      const dateRange = [lead.startDate, lead.endDate].filter(Boolean).join(' - ');
      paras.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 70, after: 20 },
          children: [
            new TextRun({
              text: lead.role,
              bold: true,
              font: fontFamily,
              size: bodySize + 1,
              color: textColor,
            }),
            ...(dateRange
              ? [
                  new TextRun({
                    text: `\t${dateRange}`,
                    bold: true,
                    font: fontFamily,
                    size: smallSize,
                    color: subtextColor,
                  }),
                ]
              : []),
          ],
        })
      );

      if (lead.company) {
        paras.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: lead.company,
                italics: true,
                font: fontFamily,
                size: bodySize,
                color: accentColor,
              }),
            ],
          })
        );
      }

      const bullets = Array.isArray(lead.description)
        ? lead.description
        : lead.description
        ? lead.description.split('\n').filter((l) => l.trim().length > 0)
        : [];

      for (const b of bullets) {
        const clean = b.replace(/^[•\-*]\s*/, '');
        paras.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30, line: bodyLineSpacing },
            children: parseHtmlToDocxRuns(clean, baseBodyStyle, accentColor),
          })
        );
      }
    }
  }

  // 9. VOLUNTEERING
  if (sectionKey === 'volunteering' && data.volunteering && data.volunteering.length > 0) {
    const title = data.sectionTitles?.volunteering || 'Volunteering';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    for (const vol of data.volunteering) {
      const dateRange = [vol.startDate, vol.endDate].filter(Boolean).join(' - ');
      paras.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: vol.role,
              bold: true,
              font: fontFamily,
              size: bodySize,
              color: textColor,
            }),
            ...(dateRange
              ? [
                  new TextRun({
                    text: `\t${dateRange}`,
                    bold: true,
                    font: fontFamily,
                    size: smallSize,
                    color: subtextColor,
                  }),
                ]
              : []),
          ],
        })
      );

      if (vol.company) {
        paras.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: vol.company,
                italics: true,
                font: fontFamily,
                size: smallSize,
                color: accentColor,
              }),
            ],
          })
        );
      }
    }
  }

  // 10. LANGUAGES
  if (sectionKey === 'languages' && data.languages && data.languages.length > 0) {
    const title = data.sectionTitles?.languages || 'Languages';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    const langStrs = (data.languages as (LanguageItem | string)[]).map((l) =>
      typeof l === 'string' ? l : `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`
    );
    paras.push(
      new Paragraph({
        spacing: { after: 40, line: bodyLineSpacing },
        children: [new TextRun({ text: langStrs.join('  •  '), font: fontFamily, size: bodySize, color: textColor })],
      })
    );
  }

  // 11. AWARDS & PUBLICATIONS
  if (sectionKey === 'awards' && data.awards) {
    const title = data.sectionTitles?.awards || 'Awards & Honors';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    const awardsList = Array.isArray(data.awards) ? data.awards : [data.awards];
    for (const award of awardsList) {
      paras.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30, line: bodyLineSpacing },
          children: parseHtmlToDocxRuns(award, baseBodyStyle, accentColor),
        })
      );
    }
  }

  if (sectionKey === 'publications' && data.publications) {
    const title = data.sectionTitles?.publications || 'Publications';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    const pubsList = Array.isArray(data.publications) ? data.publications : [data.publications];
    for (const pub of pubsList) {
      paras.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30, line: bodyLineSpacing },
          children: parseHtmlToDocxRuns(pub, baseBodyStyle, accentColor),
        })
      );
    }
  }

  // 12. COURSEWORK
  if (sectionKey === 'coursework' && data.coursework) {
    const title = data.sectionTitles?.coursework || 'Relevant Coursework';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    if (typeof data.coursework === 'string') {
      paras.push(
        new Paragraph({
          spacing: { after: 40, line: bodyLineSpacing },
          children: parseHtmlToDocxRuns(data.coursework, baseBodyStyle, accentColor),
        })
      );
    } else if (Array.isArray(data.coursework)) {
      for (const item of data.coursework as CourseworkItem[]) {
        paras.push(
          new Paragraph({
            spacing: { after: 30, line: bodyLineSpacing },
            children: [
              new TextRun({ text: `${item.category}: `, bold: true, font: fontFamily, size: bodySize, color: textColor }),
              new TextRun({ text: Array.isArray(item.courses) ? item.courses.join(', ') : String(item.courses || ''), font: fontFamily, size: bodySize, color: textColor }),
            ],
          })
        );
      }
    }
  }

  // 13. ADDITIONAL INFO / CUSTOM SECTIONS
  if (sectionKey === 'additionalInfo' && data.additionalInfo && data.additionalInfo.length > 0) {
    const title = data.sectionTitles?.additionalInfo || 'Additional Information';
    paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

    for (const item of data.additionalInfo as AdditionalInfoItem[]) {
      paras.push(
        new Paragraph({
          spacing: { after: 30, line: bodyLineSpacing },
          children: [
            new TextRun({
              text: `${item.label}: `,
              bold: true,
              font: fontFamily,
              size: bodySize,
              color: textColor,
            }),
            new TextRun({
              text: item.value,
              font: fontFamily,
              size: bodySize,
              color: textColor,
            }),
          ],
        })
      );
    }
  }

  // Dynamic Custom Sections
  if (data.customSections && data.customSections[sectionKey]) {
    const custom = data.customSections[sectionKey];
    if (custom.visible !== false) {
      const title = data.sectionTitles?.[sectionKey] || custom.title || sectionKey;
      paras.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, headingStyle, data.sectionHeaderCase, align));

      if (custom.items && custom.items.length > 0) {
        for (const it of custom.items) {
          const dateRange = [it.startDate, it.endDate].filter(Boolean).join(' - ');
          if (it.title || dateRange) {
            paras.push(
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                spacing: { before: 60, after: 20 },
                children: [
                  ...(it.title
                    ? [
                        new TextRun({
                          text: it.title,
                          bold: true,
                          font: fontFamily,
                          size: bodySize,
                          color: textColor,
                        }),
                      ]
                    : []),
                  ...(dateRange
                    ? [
                        new TextRun({
                          text: `\t${dateRange}`,
                          font: fontFamily,
                          size: smallSize,
                          color: subtextColor,
                        }),
                      ]
                    : []),
                ],
              })
            );
          }

          if (it.subtitle) {
            paras.push(
              new Paragraph({
                spacing: { after: 20 },
                children: [
                  new TextRun({
                    text: it.subtitle,
                    italics: true,
                    font: fontFamily,
                    size: smallSize,
                    color: accentColor,
                  }),
                ],
              })
            );
          }

          if (it.description) {
            const bullets = it.description.split('\n').filter((l) => l.trim().length > 0);
            for (const b of bullets) {
              const clean = b.replace(/^[•\-*]\s*/, '');
              paras.push(
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 30, line: bodyLineSpacing },
                  children: parseHtmlToDocxRuns(clean, baseBodyStyle, accentColor),
                })
              );
            }
          }
        }
      }
    }
  }

  return paras;
}

// --- Main DOCX Document Builder ---

export function buildResumeDocxDocument(data: ResumeData, templateOverride?: TemplateType): Document {
  const resolvedTemplate: TemplateType = templateOverride || data.template || 'vanguard';
  const profile = getTemplateProfile(resolvedTemplate);

  const accentColor = cleanHexColor(data.accentColor || profile.defaultAccent, profile.defaultAccent);
  const textColor = '1A202C'; // Clean deep neutral dark
  const subtextColor = '4A5568';
  const fontFamily = data.font || profile.defaultFont;

  // Typography metrics
  const nameSize = ptToHalfPt((data.fontSizes?.header || 20) * 1.25);
  const titleSize = ptToHalfPt(data.fontSizes?.jobTitle || 12);
  const sectionTitleSize = ptToHalfPt(data.fontSizes?.sectionTitle || 11);
  const bodySize = ptToHalfPt(data.fontSizes?.body || 9.5);
  const smallSize = Math.max(14, bodySize - 2);

  const bodyLineSpacing = Math.round((data.lineHeight || 1.3) * 240);

  const baseBodyStyle: InlineRunStyle = {
    font: fontFamily,
    size: bodySize,
    color: textColor,
  };

  const headerAlign =
    data.headerAlignment === 'center'
      ? AlignmentType.CENTER
      : data.headerAlignment === 'right'
      ? AlignmentType.RIGHT
      : data.headerAlignment === 'left'
      ? AlignmentType.LEFT
      : profile.defaultHeaderAlign === 'center'
      ? AlignmentType.CENTER
      : profile.defaultHeaderAlign === 'right'
      ? AlignmentType.RIGHT
      : AlignmentType.LEFT;

  const jobTitleAlign =
    data.jobTitleAlignment === 'center'
      ? AlignmentType.CENTER
      : data.jobTitleAlignment === 'right'
      ? AlignmentType.RIGHT
      : data.jobTitleAlignment === 'left'
      ? AlignmentType.LEFT
      : headerAlign;

  const contactAlign =
    data.contactAlignment === 'center'
      ? AlignmentType.CENTER
      : data.contactAlignment === 'right'
      ? AlignmentType.RIGHT
      : data.contactAlignment === 'left'
      ? AlignmentType.LEFT
      : headerAlign;

  const children: (Paragraph | Table)[] = [];

  // 1. Header: Full Name
  if (data.fullName) {
    let nameText = data.fullName;
    if (data.headerCase === 'uppercase' || (resolvedTemplate === 'rezi' && data.headerCase !== 'capitalize')) {
      nameText = nameText.toUpperCase();
    } else if (data.headerCase === 'lowercase') {
      nameText = nameText.toLowerCase();
    }

    children.push(
      new Paragraph({
        alignment: headerAlign,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: nameText,
            bold: true,
            font: fontFamily,
            size: nameSize,
            color: resolvedTemplate === 'times' || resolvedTemplate === 'rezi' ? '111827' : accentColor,
          }),
        ],
      })
    );
  }

  // 2. Header: Professional Job Title (if Title is before contact)
  if (data.jobTitle) {
    let jobTitleText = data.jobTitle;
    if (data.jobTitleCase === 'uppercase') jobTitleText = jobTitleText.toUpperCase();

    children.push(
      new Paragraph({
        alignment: jobTitleAlign,
        spacing: { after: 50 },
        children: [
          new TextRun({
            text: jobTitleText,
            bold: true,
            italics: resolvedTemplate === 'times',
            font: fontFamily,
            size: titleSize,
            color: subtextColor,
          }),
        ],
      })
    );
  }

  // 3. Header: Contact Details Row
  const contactParts: (TextRun | ExternalHyperlink)[] = [];
  const addSeparator = () => {
    if (contactParts.length > 0) {
      contactParts.push(
        new TextRun({
          text: '  |  ',
          color: 'A0AEC0',
          font: fontFamily,
          size: smallSize,
        })
      );
    }
  };

  if (data.email) {
    const mailto = toSafeLink(data.email);
    if (mailto) {
      addSeparator();
      contactParts.push(
        new ExternalHyperlink({
          link: mailto,
          children: [
            new TextRun({
              text: data.email,
              underline: {},
              color: accentColor,
              font: fontFamily,
              size: smallSize,
            }),
          ],
        })
      );
    }
  }

  if (data.phone) {
    addSeparator();
    contactParts.push(
      new TextRun({
        text: data.phone,
        font: fontFamily,
        size: smallSize,
        color: textColor,
      })
    );
  }

  const locationStr = data.location || data.address;
  if (locationStr) {
    addSeparator();
    contactParts.push(
      new TextRun({
        text: locationStr,
        font: fontFamily,
        size: smallSize,
        color: textColor,
      })
    );
  }

  if (data.linkedin) {
    const linkedInUrl = toSafeLink(data.linkedin);
    if (linkedInUrl) {
      addSeparator();
      const label = data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, 'linkedin.com/in/');
      contactParts.push(
        new ExternalHyperlink({
          link: linkedInUrl,
          children: [
            new TextRun({
              text: label,
              underline: {},
              color: accentColor,
              font: fontFamily,
              size: smallSize,
            }),
          ],
        })
      );
    }
  }

  if (data.atHandle) {
    const handleUrl = toSafeLink(data.atHandle);
    if (handleUrl) {
      addSeparator();
      contactParts.push(
        new ExternalHyperlink({
          link: handleUrl,
          children: [
            new TextRun({
              text: data.atHandle,
              underline: {},
              color: accentColor,
              font: fontFamily,
              size: smallSize,
            }),
          ],
        })
      );
    }
  }

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: contactAlign,
        spacing: { after: 120 },
        border:
          resolvedTemplate === 'rezi'
            ? {
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 8,
                  color: '111827',
                },
              }
            : undefined,
        children: contactParts,
      })
    );
  }

  // Section Order Resolution
  const sectionOrder =
    data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : profile.defaultSectionOrder;

  // Check for Two-Column Layout (TwoColumnTemplate)
  if (profile.isTwoColumn) {
    const sidebarKeys = new Set(['skills', 'expert_skills', 'expertSkills', 'education', 'certifications', 'languages', 'additionalInfo']);
    const sidebarParagraphs: Paragraph[] = [];
    const mainParagraphs: Paragraph[] = [];

    for (const sectionKey of sectionOrder) {
      const sectionParas = generateSectionParagraphs(
        sectionKey,
        data,
        fontFamily,
        bodySize,
        smallSize,
        sectionTitleSize,
        textColor,
        subtextColor,
        accentColor,
        bodyLineSpacing,
        baseBodyStyle,
        profile.headingStyle
      );

      if (sidebarKeys.has(sectionKey)) {
        sidebarParagraphs.push(...sectionParas);
      } else {
        mainParagraphs.push(...sectionParas);
      }
    }

    const twoColTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              },
              margins: { right: 140 },
              children: sidebarParagraphs.length > 0 ? sidebarParagraphs : [new Paragraph({})],
            }),
            new TableCell({
              width: { size: 68, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
                right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              },
              margins: { left: 140 },
              children: mainParagraphs.length > 0 ? mainParagraphs : [new Paragraph({})],
            }),
          ],
        }),
      ],
    });

    children.push(twoColTable);
  } else {
    // Standard Single-Column Layout
    for (const sectionKey of sectionOrder) {
      const sectionParas = generateSectionParagraphs(
        sectionKey,
        data,
        fontFamily,
        bodySize,
        smallSize,
        sectionTitleSize,
        textColor,
        subtextColor,
        accentColor,
        bodyLineSpacing,
        baseBodyStyle,
        profile.headingStyle
      );
      children.push(...sectionParas);
    }
  }

  // Calculate Page Dimensions and Margins
  const isA4 = data.pageSize === 'a4';
  const pageMarginTwips = ptToTwips(data.margins?.horizontal || 36);
  const pageMarginVTwips = ptToTwips(data.margins?.vertical || 36);

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: fontFamily,
            size: bodySize,
            color: textColor,
          },
          paragraph: {
            spacing: { line: bodyLineSpacing },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: isA4
              ? {
                  width: convertMillimetersToTwip(210),
                  height: convertMillimetersToTwip(297),
                }
              : {
                  width: convertInchesToTwip(8.5),
                  height: convertInchesToTwip(11),
                },
            margin: {
              top: pageMarginVTwips,
              bottom: pageMarginVTwips,
              left: pageMarginTwips,
              right: pageMarginTwips,
            },
          },
        },
        children: children.length > 0 ? children : [new Paragraph({ text: 'Resume' })],
      },
    ],
  });
}

/**
 * High-level function to export and download ResumeData as a .docx file.
 */
export async function exportResumeToDocx(
  data: ResumeData,
  filename?: string,
  templateOverride?: TemplateType
): Promise<void> {
  const doc = buildResumeDocxDocument(data, templateOverride);
  const blob = await Packer.toBlob(doc);
  const safeName = sanitizeFilename(
    filename || `${data.fullName || 'Resume'}_CVArchitect`,
    'Resume'
  );
  downloadFile(blob, `${safeName}.docx`);
}
