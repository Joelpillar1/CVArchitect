/**
 * coverLetterDocxExport.ts
 * High-performance client-side Word (.docx) export for Cvarchitect cover letters.
 * Generates pixel-perfect, ATS-compliant editable Microsoft Word (.docx) documents
 * mirroring the selected template design (Modern, Classic, Editorial, Minimal, Academic, Technical, Bold, Impact).
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  convertMillimetersToTwip,
} from 'docx';
import { ResumeData } from '../types';
import { CoverLetterTemplateType } from './coverLetterConfig';
import { GeneratedCoverLetter } from '../components/utils/aiEnhancer';
import { parseCoverLetterBlocks, CoverLetterBlock } from '../components/cover-letters/coverLetterFormatter';
import { downloadFile, sanitizeFilename } from './pdfExport';

export interface CoverLetterDocxOptions {
  content: GeneratedCoverLetter | string;
  resumeData: ResumeData;
  companyName?: string;
  jobTitle?: string;
  template?: CoverLetterTemplateType;
  fontFamily?: 'sans' | 'serif' | 'mono' | 'merriweather' | string;
  fontSize?: number;
  lineSpacing?: number;
  spacing?: 'compact' | 'normal' | 'spacious';
  filename?: string;
}

/** Helper to clean font name for Microsoft Word */
function resolveDocxFont(fontFamily?: string, template?: CoverLetterTemplateType): string {
  if (fontFamily === 'merriweather') return 'Georgia';
  if (fontFamily === 'serif') return 'Times New Roman';
  if (fontFamily === 'mono') return 'Consolas';
  if (fontFamily === 'sans') return 'Calibri';

  // Template-based font fallback
  if (template === 'editorial' || template === 'academic' || template === 'classic' || template === 'modern') {
    return 'Georgia';
  }
  return 'Calibri';
}

/** Formats today's date cleanly, e.g. "21 October 2026" */
function getFormattedDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Builds a structured docx Document for a cover letter.
 */
export function buildCoverLetterDocxDocument(options: CoverLetterDocxOptions): Document {
  const {
    content,
    resumeData,
    companyName = '',
    jobTitle = '',
    template = 'technical',
    fontFamily = 'merriweather',
    fontSize = 11,
    lineSpacing = 1.35,
    spacing = 'normal',
  } = options;

  const font = resolveDocxFont(fontFamily, template);
  const baseSizeHalfPoints = Math.round(fontSize * 2); // docx uses half-points: 11pt = 22
  const lineSpacingTwips = Math.round(lineSpacing * 240); // 240 = 1.0 line spacing

  // Margin calculation
  const marginInches = spacing === 'compact' ? 0.7 : spacing === 'spacious' ? 1.0 : 0.85;
  const marginTwips = convertInchesToTwip(marginInches);

  // Extract plain text and structured content
  const plainText = typeof content === 'string' ? content : content?.plainText || '';
  const structured = typeof content === 'object' && content !== null ? content.structured : undefined;
  const hasStructuredSkills = Boolean(structured && Array.isArray(structured.skills) && structured.skills.length > 0);

  const isCentered = template === 'modern';
  const isTechnical = template === 'technical';
  const isAcademic = template === 'academic';
  const isEditorial = template === 'editorial';
  const isBold = template === 'bold';
  const isCorporate = template === 'corporate';

  const children: Paragraph[] = [];

  // ==========================================
  // 1. CANDIDATE HEADER
  // ==========================================
  const candidateName = resumeData.fullName || 'Alex Morgan';
  const candidateRole = resumeData.jobTitle || jobTitle || '';

  // Name paragraph
  children.push(
    new Paragraph({
      alignment: isCentered ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: candidateRole && !isCorporate ? 40 : 100 },
      children: [
        new TextRun({
          text: candidateName,
          bold: true,
          size: isBold ? 40 : isTechnical ? 36 : isCorporate ? 30 : 32, // 15 - 20pt
          font,
          color: '111827',
        }),
      ],
    })
  );

  // Job title subtitle (if present, except in standard corporate where it is in the subject line)
  if (candidateRole && (isCentered || isBold || isTechnical)) {
    children.push(
      new Paragraph({
        alignment: isCentered ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: candidateRole.toUpperCase(),
            bold: true,
            size: 20, // 10pt
            font,
            color: '4B5563',
          }),
        ],
      })
    );
  }

  // Contact Information
  const contactParts: string[] = [];
  const loc = resumeData.location || resumeData.address;
  if (loc) contactParts.push(loc);
  if (resumeData.phone) contactParts.push(resumeData.phone);
  if (resumeData.email) contactParts.push(resumeData.email);
  if (resumeData.linkedin) {
    contactParts.push(resumeData.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/'));
  }
  const web = resumeData.portfolio || (resumeData as any).website;
  if (web) {
    contactParts.push(web.replace(/^https?:\/\//, ''));
  }

  if (isCentered) {
    // Single line centered with bullets
    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: contactParts.join('  •  '),
              size: 19,
              font,
              color: '4B5563',
            }),
          ],
        })
      );
    }
    // Subtle horizontal divider line
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 4,
            color: 'E5E7EB',
          },
        },
      })
    );
  } else if (isEditorial || isTechnical || isAcademic || isCorporate) {
    // Stacked clean contact lines
    contactParts.forEach((part, idx) => {
      const isLast = idx === contactParts.length - 1;
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: isLast ? 240 : 40 },
          children: [
            new TextRun({
              text: part,
              size: 20,
              font,
              color: '374151',
            }),
          ],
        })
      );
    });
  } else {
    // Inline pipe-delimited contact line
    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: contactParts.join('  |  '),
              size: 20,
              font,
              color: '4B5563',
            }),
          ],
        })
      );
    }
  }

  // ==========================================
  // 2. DATE & RECIPIENT BLOCK
  // ==========================================
  const formattedDate = getFormattedDate();

  // For Academic & Corporate: Standalone Date first
  if (isAcademic || isCorporate) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: formattedDate,
            size: baseSizeHalfPoints,
            font,
            color: '1F2937',
          }),
        ],
      })
    );
  }

  // Recipient block
  if (companyName || jobTitle || isCorporate) {
    const recipientLines: { text: string; bold?: boolean; color?: string }[] = [];
    if (isCorporate) {
      recipientLines.push({
        text: 'Hiring Team',
        bold: true,
        color: '111827',
      });
      recipientLines.push({
        text: companyName || 'Acme Corp',
        color: '374151',
      });
    } else {
      if (companyName) {
        recipientLines.push({
          text: companyName,
          bold: isTechnical || isBold,
          color: isTechnical ? '030712' : '1F2937',
        });
      }
      if (jobTitle) {
        recipientLines.push({
          text: jobTitle,
          color: '4B5563',
        });
      }
    }

    recipientLines.forEach((line, idx) => {
      const isLast = idx === recipientLines.length - 1;
      children.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: isLast ? (isAcademic || isCorporate ? 240 : 160) : 40 },
          children: [
            new TextRun({
              text: line.text,
              bold: line.bold,
              size: baseSizeHalfPoints,
              font,
              color: line.color || '1F2937',
            }),
          ],
        })
      );
    });
  }

  // For Non-Academic, Non-Corporate templates: Date after recipient
  if (!isAcademic && !isEditorial && !isCorporate) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: formattedDate,
            size: baseSizeHalfPoints,
            font,
            color: '4B5563',
          }),
        ],
      })
    );
  }

  // For Corporate: Bold Subject line
  if (isCorporate) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 100, after: 180 },
        children: [
          new TextRun({
            text: `Application for ${jobTitle || 'Marketing Manager'}`,
            bold: true,
            size: Math.round(baseSizeHalfPoints * 1.15),
            font,
            color: '111827',
          }),
        ],
      })
    );
  }

  // ==========================================
  // 3. BODY PROSE & STRUCTURED BLOCKS
  // ==========================================
  // Check if letter already starts with a formal salutation
  const startsWithSalutation = /^(Dear|To|Greetings|Attention)\b/i.test(plainText.trim());

  if (!startsWithSalutation && plainText.trim().length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200, line: lineSpacingTwips },
        children: [
          new TextRun({
            text: isCorporate ? 'Dear Ms. Doe,' : 'Dear Hiring Team,',
            size: baseSizeHalfPoints,
            font,
            color: '1F2937',
          }),
        ],
      })
    );
  }

  const renderBlocksToDocx = (blocks: CoverLetterBlock[]) => {
    blocks.forEach((block) => {
      if (block.type === 'paragraph') {
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 220, // ~11pt spacing after paragraphs
              line: lineSpacingTwips,
            },
            children: [
              new TextRun({
                text: block.text,
                size: baseSizeHalfPoints,
                font,
                color: '1F2937',
              }),
            ],
          })
        );
      } else if (block.type === 'signoff') {
        // Sign-off greeting: "Sincerely,"
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: {
              before: 120,
              after: 360, // 18pt generous signature spacing
              line: lineSpacingTwips,
            },
            children: [
              new TextRun({
                text: block.greeting,
                size: baseSizeHalfPoints,
                font,
                color: '1F2937',
              }),
            ],
          })
        );

        // Signer candidate name on separate line
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 60,
              line: lineSpacingTwips,
            },
            children: [
              new TextRun({
                text: block.name || candidateName,
                bold: true,
                size: baseSizeHalfPoints,
                font,
                color: '111827',
              }),
            ],
          })
        );
      }
    });
  };

  if (hasStructuredSkills && structured) {
    // 1. Structured Opening
    if (structured.opening) {
      const openingBlocks = parseCoverLetterBlocks(structured.opening, candidateName);
      renderBlocksToDocx(openingBlocks);
    }

    // 2. Key Highlight Bullet Points / Competencies
    if (Array.isArray(structured.skills) && structured.skills.length > 0) {
      structured.skills.forEach((item) => {
        children.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            bullet: { level: 0 },
            spacing: { after: 140, line: lineSpacingTwips },
            children: [
              new TextRun({
                text: `${item.skill}: `,
                bold: true,
                size: baseSizeHalfPoints,
                font,
                color: '111827',
              }),
              new TextRun({
                text: item.description,
                size: baseSizeHalfPoints,
                font,
                color: '1F2937',
              }),
            ],
          })
        );
      });
      // Small breather after list
      children.push(new Paragraph({ spacing: { after: 120 } }));
    }

    // 3. Structured Closing
    if (structured.closing) {
      const closingBlocks = parseCoverLetterBlocks(structured.closing, candidateName);
      renderBlocksToDocx(closingBlocks);
    }
  } else {
    // Standard Prose Narrative
    const blocks = parseCoverLetterBlocks(plainText, candidateName);
    renderBlocksToDocx(blocks);
  }

  // Return the configured docx Document
  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font,
            size: baseSizeHalfPoints,
            color: '1F2937',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertMillimetersToTwip(210), // A4
              height: convertMillimetersToTwip(297),
            },
            margin: {
              top: marginTwips,
              bottom: marginTwips,
              left: marginTwips,
              right: marginTwips,
            },
          },
        },
        children: children.length > 0 ? children : [new Paragraph({ text: 'Cover Letter' })],
      },
    ],
  });
}

/**
 * High-level function to export and download a cover letter as an editable .docx file.
 */
export async function exportCoverLetterToDocx(options: CoverLetterDocxOptions): Promise<void> {
  const doc = buildCoverLetterDocxDocument(options);
  const blob = await Packer.toBlob(doc);
  const candidateName = sanitizeFilename(options.resumeData?.fullName || 'Applicant', 'Applicant');
  const roleName = sanitizeFilename(options.jobTitle || 'Role', 'Application');
  const defaultBase = `${candidateName}_Cover_Letter_${roleName}`;
  const safeName = sanitizeFilename(options.filename || defaultBase, 'Cover_Letter');
  downloadFile(blob, `${safeName}.docx`);
}
