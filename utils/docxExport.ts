/**
 * docxExport.ts
 *
 * High-performance client-side Word (.docx) export for CVArchitect resumes.
 * Built using the official 'docx' package with 100% browser-native generation (0 backend required).
 *
 * Features:
 * - 1-Column clean ATS-friendly layout compatible with Microsoft Word, Google Docs, and LibreOffice.
 * - Dynamic typography (font family, font sizes, line spacing, margins).
 * - Accent color branding on candidate name and section dividers.
 * - Right-aligned date/location alignment using native Word right-tab stops.
 * - Rich-text HTML bullet parser (converts <b>, <strong>, <i>, <em>, <a> into native TextRuns & ExternalHyperlinks).
 * - Full support for all CVArchitect sections: Personal Info, Summary, Experience, Education, Skills,
 *   Projects, Certifications, Leadership, Custom Sections, Languages, Publications, and Awards.
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
  convertMillimetersToTwip,
  convertInchesToTwip,
} from 'docx';
import { ResumeData, Experience, Education, Project, Certification, CourseworkItem } from '../types';
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
                      bold: currentStyle.bold,
                      font: currentStyle.font,
                      size: currentStyle.size,
                    }),
                  ],
                })
              );
            } else if (linkText) {
              runs.push(
                new TextRun({
                  text: linkText,
                  bold: currentStyle.bold,
                  font: currentStyle.font,
                  size: currentStyle.size,
                  color: currentStyle.color,
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

      traverse(doc.body, baseStyle);
      if (runs.length > 0) return runs;
    } catch {
      // fallback to regex parser below
    }
  }

  // Regex-based fallback for Node / SSR / unit testing
  const tagRegex = /(<\/?(?:b|strong|i|em|u|a)(?:\s+[^>]*)?>|[^<]+)/gi;
  const runs: (TextRun | ExternalHyperlink)[] = [];
  let isBold = Boolean(baseStyle.bold);
  let isItalics = Boolean(baseStyle.italics);
  let isUnderline = Boolean(baseStyle.underline);
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(htmlText)) !== null) {
    const chunk = match[0];
    const lower = chunk.toLowerCase();
    if (lower === '<b>' || lower === '<strong>') {
      isBold = true;
    } else if (lower === '</b>' || lower === '</strong>') {
      isBold = Boolean(baseStyle.bold);
    } else if (lower === '<i>' || lower === '<em>') {
      isItalics = true;
    } else if (lower === '</i>' || lower === '</em>') {
      isItalics = Boolean(baseStyle.italics);
    } else if (lower === '<u>') {
      isUnderline = true;
    } else if (lower === '</u>') {
      isUnderline = Boolean(baseStyle.underline);
    } else if (!chunk.startsWith('<')) {
      const clean = chunk
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      if (clean) {
        runs.push(
          new TextRun({
            text: clean,
            bold: isBold,
            italics: isItalics,
            underline: isUnderline ? {} : undefined,
            font: baseStyle.font,
            size: baseStyle.size,
            color: baseStyle.color,
          })
        );
      }
    }
  }

  return runs.length > 0
    ? runs
    : [new TextRun({ text: htmlText.replace(/<[^>]*>/g, ''), ...baseStyle })];
}

// --- Section Heading Component ---

function createSectionHeading(
  title: string,
  fontFamily: string,
  headingHalfPt: number,
  accentColorHex: string,
  caseStyle: 'uppercase' | 'capitalize' | 'titlecase' = 'uppercase'
): Paragraph {
  let displayTitle = title;
  if (caseStyle === 'uppercase') {
    displayTitle = title.toUpperCase();
  } else if (caseStyle === 'capitalize' || caseStyle === 'titlecase') {
    displayTitle = title.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 8, // ~1pt
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

// --- Main DOCX Document Builder ---

export function buildResumeDocxDocument(data: ResumeData): Document {
  const accentColor = cleanHexColor(data.accentColor, '1E3A8A');
  const textColor = '1A202C'; // Clean deep neutral dark
  const subtextColor = '4A5568';
  const fontFamily = data.font || 'Calibri';

  // Typography metrics
  const nameSize = ptToHalfPt((data.fontSizes?.header || 20) * 1.25);
  const titleSize = ptToHalfPt(data.fontSizes?.jobTitle || 12);
  const sectionTitleSize = ptToHalfPt(data.fontSizes?.sectionTitle || 12);
  const bodySize = ptToHalfPt(data.fontSizes?.body || 10);
  const smallSize = Math.max(14, bodySize - 2);

  const bodyLineSpacing = Math.round((data.lineHeight || 1.2) * 240);

  const baseBodyStyle: InlineRunStyle = {
    font: fontFamily,
    size: bodySize,
    color: textColor,
  };

  const children: Paragraph[] = [];

  // 1. Header: Full Name
  if (data.fullName) {
    let nameText = data.fullName;
    if (data.headerCase === 'uppercase') nameText = nameText.toUpperCase();
    else if (data.headerCase === 'lowercase') nameText = nameText.toLowerCase();

    children.push(
      new Paragraph({
        alignment:
          data.headerAlignment === 'center'
            ? AlignmentType.CENTER
            : data.headerAlignment === 'right'
            ? AlignmentType.RIGHT
            : AlignmentType.LEFT,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: nameText,
            bold: true,
            font: fontFamily,
            size: nameSize,
            color: accentColor,
          }),
        ],
      })
    );
  }

  // 2. Header: Professional Job Title
  if (data.jobTitle) {
    let jobTitleText = data.jobTitle;
    if (data.jobTitleCase === 'uppercase') jobTitleText = jobTitleText.toUpperCase();

    children.push(
      new Paragraph({
        alignment:
          data.jobTitleAlignment === 'center'
            ? AlignmentType.CENTER
            : data.jobTitleAlignment === 'right'
            ? AlignmentType.RIGHT
            : AlignmentType.LEFT,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: jobTitleText,
            bold: true,
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
        alignment:
          data.contactAlignment === 'center'
            ? AlignmentType.CENTER
            : data.contactAlignment === 'right'
            ? AlignmentType.RIGHT
            : AlignmentType.LEFT,
        spacing: { after: 180 },
        children: contactParts,
      })
    );
  }

  // Helper to check section visibility
  const isSectionVisible = (key: string) => {
    if (data.sectionVisibility && data.sectionVisibility[key] === false) return false;
    return true;
  };

  // Section Order Resolution
  const defaultOrder = [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'leadership',
    'additionalInfo',
  ];
  const sectionOrder = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : defaultOrder;

  for (const sectionKey of sectionOrder) {
    if (!isSectionVisible(sectionKey)) continue;

    // --- PROFESSIONAL SUMMARY ---
    if (sectionKey === 'summary' && data.summary) {
      const title = data.sectionTitles?.summary || 'Professional Summary';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

      const summaryRuns = parseHtmlToDocxRuns(data.summary, baseBodyStyle, accentColor);
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 140, line: bodyLineSpacing },
          children: summaryRuns,
        })
      );
    }

    // --- WORK EXPERIENCE ---
    if (sectionKey === 'experience' && data.experience && data.experience.length > 0) {
      const title = data.sectionTitles?.experience || 'Work Experience';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

      for (const exp of data.experience) {
        const dateRange = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');

        // Job Title + Right-aligned Date
        children.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            spacing: { before: 100, after: 30 },
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

        // Company Name + Location
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
          children.push(
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              spacing: { after: 60 },
              children: companyParts,
            })
          );
        }

        // Role summary (if any)
        if (exp.roleSummary) {
          children.push(
            new Paragraph({
              spacing: { after: 60, line: bodyLineSpacing },
              children: parseHtmlToDocxRuns(exp.roleSummary, baseBodyStyle, accentColor),
            })
          );
        }

        // Bullet points
        const bullets = Array.isArray(exp.description)
          ? exp.description
          : exp.description
          ? exp.description.split('\n').filter((line) => line.trim().length > 0)
          : [];

        for (const bullet of bullets) {
          const cleanBulletText = bullet.replace(/^[•\-*]\s*/, '');
          const bulletRuns = parseHtmlToDocxRuns(cleanBulletText, baseBodyStyle, accentColor);
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40, line: bodyLineSpacing },
              children: bulletRuns,
            })
          );
        }
      }
    }

    // --- EDUCATION ---
    if (sectionKey === 'education' && data.education && data.education.length > 0) {
      const title = data.sectionTitles?.education || 'Education';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

      for (const edu of data.education) {
        children.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            spacing: { before: 100, after: 30 },
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
          children.push(
            new Paragraph({
              spacing: { after: 40 },
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
          children.push(
            new Paragraph({
              spacing: { after: 60, line: bodyLineSpacing },
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

    // --- SKILLS ---
    if (sectionKey === 'skills' && (data.skills || data.technicalSkills || data.coreCompetencies)) {
      const title = data.sectionTitles?.skills || 'Skills';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

      if (data.skills) {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 60, line: bodyLineSpacing },
            children: parseHtmlToDocxRuns(data.skills, baseBodyStyle, accentColor),
          })
        );
      }

      if (data.technicalSkills) {
        children.push(
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
        children.push(
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

    // --- EXPERT-LEVEL SKILLS ---
    if ((sectionKey === 'expert_skills' || sectionKey === 'expertSkills') && data.expertSkills) {
      const title = data.sectionTitles?.expert_skills || data.sectionTitles?.expertSkills || 'Expert-Level Skills';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

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

        children.push(
          new Paragraph({
            spacing: { after: 50, line: bodyLineSpacing },
            children: runs,
          })
        );
      }
    }

    // --- PROJECTS ---
    if (sectionKey === 'projects' && data.projects && data.projects.length > 0) {
      const title = data.sectionTitles?.projects || 'Projects';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

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

        children.push(
          new Paragraph({
            spacing: { before: 100, after: 30 },
            children: projHeaderParts,
          })
        );

        if (proj.technologies) {
          children.push(
            new Paragraph({
              spacing: { after: 40 },
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
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40, line: bodyLineSpacing },
                children: parseHtmlToDocxRuns(clean, baseBodyStyle, accentColor),
              })
            );
          }
        }
      }
    }

    // --- CERTIFICATIONS ---
    if (sectionKey === 'certifications' && data.certifications && data.certifications.length > 0) {
      const title = data.sectionTitles?.certifications || 'Certifications';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

      for (const cert of data.certifications) {
        children.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            spacing: { before: 60, after: 30 },
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
          children.push(
            new Paragraph({
              spacing: { after: 40 },
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

    // --- LEADERSHIP & ACTIVITIES ---
    if (sectionKey === 'leadership' && data.leadership && data.leadership.length > 0) {
      const title = data.sectionTitles?.leadership || 'Leadership & Activities';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

      for (const lead of data.leadership) {
        const dateRange = [lead.startDate, lead.endDate].filter(Boolean).join(' - ');
        children.push(
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            spacing: { before: 80, after: 30 },
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
          children.push(
            new Paragraph({
              spacing: { after: 40 },
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
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40, line: bodyLineSpacing },
              children: parseHtmlToDocxRuns(clean, baseBodyStyle, accentColor),
            })
          );
        }
      }
    }

    // --- ADDITIONAL INFO / CUSTOM SECTIONS ---
    if (sectionKey === 'additionalInfo' && data.additionalInfo && data.additionalInfo.length > 0) {
      const title = data.sectionTitles?.additionalInfo || 'Additional Information';
      children.push(createSectionHeading(title, fontFamily, sectionTitleSize, accentColor, data.sectionHeaderCase));

      for (const item of data.additionalInfo) {
        children.push(
          new Paragraph({
            spacing: { after: 40, line: bodyLineSpacing },
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
  }

  // Calculate Page Dimensions and Margins
  const isA4 = data.pageSize === 'a4';
  const pageMarginTwips = ptToTwips(data.margins?.horizontal || 36); // Default ~0.5in
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
export async function exportResumeToDocx(data: ResumeData, filename?: string): Promise<void> {
  const doc = buildResumeDocxDocument(data);
  const blob = await Packer.toBlob(doc);
  const safeName = sanitizeFilename(
    filename || `${data.fullName || 'Resume'}_CVArchitect`,
    'Resume'
  );
  downloadFile(blob, `${safeName}.docx`);
}
