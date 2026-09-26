import {
  ExtractedSkillItem,
  ExtractedSkillItemSchema,
  ExtractedSkillSection,
  ExtractedSkillSectionSchema,
  NormalizedSkillSectionType,
  SkillExtractionResult,
  SkillExtractionResultSchema,
  classifySkillHeading,
  isSkillSectionHeader,
  generateStableId,
} from '../types/agentContract';

/**
 * CVArchitect Two-Stage Skill Extraction Service
 *
 * Implements strict, multi-stage skill parsing:
 * 1. Section Boundary Detection (prevents content bleed from Experience/Summary/Education).
 * 2. Section Classification & Heading Preservation.
 * 3. Structured Item Tokenization & Sub-group Category Extraction.
 * 4. Strict Anti-Over-Extraction Validation Gate (rejects sentences, paragraphs, responsibilities).
 * 5. Ambiguity Handling & Multi-Section Identity Preservation.
 */

export interface DetectedDocumentSection {
  id: string;
  originalHeading: string;
  normalizedSectionType: 'skills' | 'experience' | 'education' | 'summary' | 'projects' | 'certifications' | 'other';
  startLine: number;
  endLine: number;
  rawContent: string;
  lines: string[];
}

const COMMON_NON_SKILL_HEADINGS = [
  'experience',
  'work experience',
  'professional experience',
  'employment history',
  'work history',
  'career history',
  'education',
  'academic background',
  'summary',
  'professional summary',
  'executive summary',
  'profile',
  'about me',
  'objective',
  'projects',
  'key projects',
  'certifications',
  'licenses',
  'awards',
  'languages',
  'interests',
  'references',
];

const INVALID_VERB_PATTERNS = [
  /\b(?:led|managed|spearheaded|architected|built|developed|delivered|created|designed|engineered|implemented|oversaw|collaborated|conducted|analyzed|drove|increased|reduced|achieved|coordinated|assisted|responsible for|helped with|worked on)\b/i,
];

export class SkillExtractionService {
  /**
   * Step 1: Detect all section boundaries in raw document text
   */
  public detectDocumentSections(text: string): DetectedDocumentSection[] {
    const rawLines = text.split(/\r?\n/);
    const sections: DetectedDocumentSection[] = [];

    let currentSection: Partial<DetectedDocumentSection> | null = null;
    let currentLines: string[] = [];
    let startLine = 0;

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i].trim();
      if (!line) continue;

      const isHeading = this.isHeadingLine(line);

      if (isHeading) {
        // Save previous section if exists
        if (currentSection && currentLines.length > 0) {
          sections.push({
            id: currentSection.id || generateStableId('sec'),
            originalHeading: currentSection.originalHeading || 'Section',
            normalizedSectionType: currentSection.normalizedSectionType || 'other',
            startLine,
            endLine: i - 1,
            rawContent: currentLines.join('\n').trim(),
            lines: [...currentLines],
          });
        }

        // Start new section
        const normType = this.normalizeHeadingType(line);
        currentSection = {
          id: generateStableId('sec'),
          originalHeading: line.replace(/[:\-_|]+$/, '').trim(),
          normalizedSectionType: normType,
        };
        startLine = i;
        currentLines = [];
      } else {
        if (!currentSection) {
          currentSection = {
            id: generateStableId('sec'),
            originalHeading: 'Header',
            normalizedSectionType: 'summary',
          };
          startLine = i;
        }
        currentLines.push(line);
      }
    }

    if (currentSection && currentLines.length > 0) {
      sections.push({
        id: currentSection.id || generateStableId('sec'),
        originalHeading: currentSection.originalHeading || 'Section',
        normalizedSectionType: currentSection.normalizedSectionType || 'other',
        startLine,
        endLine: rawLines.length - 1,
        rawContent: currentLines.join('\n').trim(),
        lines: [...currentLines],
      });
    }

    return sections;
  }

  /**
   * Step 2, 3, 4, 5, 6, 7 & 8: Complete Two-Stage Skill Extraction Pipeline
   */
  public extractSkills(text: string): SkillExtractionResult {
    const sections = this.detectDocumentSections(text);
    const skillSections: ExtractedSkillSection[] = [];
    const allSkillsSet = new Set<string>();

    for (const sec of sections) {
      const isSkillSec = sec.normalizedSectionType === 'skills' || isSkillSectionHeader(sec.originalHeading);

      if (!isSkillSec) {
        // Step 4: Do NOT scrape skills from unrelated sections (Experience, Summary, Education, Projects)
        continue;
      }

      const normalizedType = classifySkillHeading(sec.originalHeading);
      const { items, confidence } = this.extractSkillItemsFromContent(sec.lines, normalizedType);

      if (items.length > 0) {
        const secRecord: ExtractedSkillSection = ExtractedSkillSectionSchema.parse({
          id: sec.id,
          originalHeading: sec.originalHeading,
          normalizedType,
          confidence,
          rawContent: sec.rawContent,
          items,
        });

        skillSections.push(secRecord);
        for (const it of items) {
          allSkillsSet.add(it.name);
        }
      } else if (normalizedType !== 'ambiguous') {
        // If heading looked skill-like but content contained 0 valid items (e.g. narrative paragraph), mark ambiguous
        skillSections.push(
          ExtractedSkillSectionSchema.parse({
            id: sec.id,
            originalHeading: sec.originalHeading,
            normalizedType: 'ambiguous',
            confidence: 0.5,
            rawContent: sec.rawContent,
            items: [],
          })
        );
      }
    }

    return SkillExtractionResultSchema.parse({
      skillSections,
      allSkills: Array.from(allSkillsSet),
    });
  }

  /**
   * Step 3: Extract individual skill entities from content lines
   */
  public extractSkillItemsFromContent(
    lines: string[],
    sectionType: NormalizedSkillSectionType
  ): { items: ExtractedSkillItem[]; confidence: number } {
    const rawTokens: Array<{ text: string; category?: string }> = [];
    let currentCategory: string | undefined = undefined;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Check for Grouped Category Sub-Header (e.g. "DESIGN:", "FRONTEND:", "LANGUAGES & TOOLS:")
      const categoryMatch = line.match(/^([A-Za-z\s&/]{2,30}):\s*(.*)$/);
      if (categoryMatch) {
        currentCategory = categoryMatch[1].trim();
        const inlineContent = categoryMatch[2].trim();
        if (inlineContent) {
          const splitItems = this.splitLineIntoTokens(inlineContent);
          for (const item of splitItems) {
            rawTokens.push({ text: item, category: currentCategory });
          }
        }
        continue;
      }

      // Tokenize bulleted, pipe-separated, or comma-separated lines
      const splitItems = this.splitLineIntoTokens(line);
      for (const item of splitItems) {
        rawTokens.push({ text: item, category: currentCategory });
      }
    }

    const validatedItems: ExtractedSkillItem[] = [];
    let rejectedCount = 0;

    for (const token of rawTokens) {
      const validatedName = this.validateAndCleanSkill(token.text);
      if (validatedName) {
        // Prevent duplicate items within same section
        if (!validatedItems.some((v) => v.name.toLowerCase() === validatedName.toLowerCase())) {
          validatedItems.push(
            ExtractedSkillItemSchema.parse({
              id: generateStableId('sk_item'),
              name: validatedName,
              category: token.category,
              confidence: 1.0,
              sourceText: token.text,
            })
          );
        }
      } else {
        rejectedCount++;
      }
    }

    // Step 7: Calculate confidence. If many items were rejected sentences, mark ambiguous
    const total = validatedItems.length + rejectedCount;
    const confidence = total === 0 ? 0 : Math.max(0.2, Math.min(1.0, validatedItems.length / total));

    return { items: validatedItems, confidence };
  }

  /**
   * Split a single line by bullets, commas, pipes, middle-dots, or slashes
   */
  public splitLineIntoTokens(line: string): string[] {
    // 1. If line starts with a bullet symbol, strip it
    const clean = line.replace(/^[\s•·\-\*▪▫–]+\s*/, '').trim();
    if (!clean) return [];

    // 2. Split by inline bullets (e.g. "• Web3 • DeFi • Crypto-ecosystems")
    if (/[•·▪▫]/.test(clean)) {
      return clean
        .split(/[•·▪▫]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // 3. Split by pipe (e.g. "Figma | Sketch | React")
    if (clean.includes('|')) {
      return clean
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // 4. Split by comma or semicolon (e.g. "Figma, React, TypeScript")
    if (clean.includes(',') || clean.includes(';')) {
      return clean
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // 5. Single item per line
    return [clean];
  }

  /**
   * Step 4 & 5: Strict validation gate for individual skill items
   */
  public validateAndCleanSkill(rawText: string): string | null {
    if (!rawText) return null;

    let clean = rawText
      .replace(/^[\s•·\-\*▪▫–:;]+/, '')
      .replace(/[\s:;]+$/, '')
      .replace(/\s+/g, ' ')
      .trim();

    // 1. Length & Word Count Constraints
    if (clean.length < 2 || clean.length > 55) {
      return null;
    }

    const words = clean.split(/\s+/);
    if (words.length > 6) {
      // Sentences / paragraphs have > 6 words
      return null;
    }

    // 2. Reject full sentences with period/punctuation endings
    if (/[.!?]$/.test(clean) && words.length >= 4) {
      return null;
    }

    // 3. Reject action verbs & responsibility phrases (e.g. "Led team...", "Responsible for...")
    if (INVALID_VERB_PATTERNS.some((pat) => pat.test(clean))) {
      return null;
    }

    // 4. Reject dates, years, or date ranges (e.g. "2021 - Present", "Jan 2020")
    if (/\b(?:19\d{2}|20\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present)\b/i.test(clean) && /\d/.test(clean)) {
      return null;
    }

    // 5. Reject email, URL, phone
    if (/@|\.com\b|\.org\b|http|\+?\d{3}-\d{3}/i.test(clean)) {
      return null;
    }

    // 6. Reject generic filler statements
    if (/^(?:various|multiple|other|etc|n\/a|none|skills include|proficient in|experienced in)$/i.test(clean)) {
      return null;
    }

    return clean;
  }

  private isHeadingLine(line: string): boolean {
    const clean = line.toLowerCase().trim().replace(/[:\-_|]+$/, '');
    if (isSkillSectionHeader(clean)) return true;
    if (COMMON_NON_SKILL_HEADINGS.some((h) => clean === h || clean.startsWith(h + ':'))) return true;

    // Check uppercase short lines (e.g. "TECHNICAL SKILLS", "EXPERIENCE")
    if (line === line.toUpperCase() && line.length < 35 && line.length > 3) {
      return (
        isSkillSectionHeader(clean) ||
        COMMON_NON_SKILL_HEADINGS.some((h) => clean.includes(h))
      );
    }

    return false;
  }

  private normalizeHeadingType(
    heading: string
  ): 'skills' | 'experience' | 'education' | 'summary' | 'projects' | 'certifications' | 'other' {
    const clean = heading.toLowerCase().trim().replace(/[:\-_|]+$/, '');
    if (isSkillSectionHeader(clean)) return 'skills';
    if (/experience|employment|work history|career/i.test(clean)) return 'experience';
    if (/education|academic|degree|university/i.test(clean)) return 'education';
    if (/summary|profile|about me|objective/i.test(clean)) return 'summary';
    if (/project/i.test(clean)) return 'projects';
    if (/certification|license|certificate/i.test(clean)) return 'certifications';
    return 'other';
  }
}

// Global Singleton Instance
let defaultSkillExtractor: SkillExtractionService | null = null;
export function getSkillExtractionService(): SkillExtractionService {
  if (!defaultSkillExtractor) {
    defaultSkillExtractor = new SkillExtractionService();
  }
  return defaultSkillExtractor;
}
