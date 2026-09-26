import { describe, it, expect, vi } from 'vitest';

(globalThis as any).DOMMatrix = class DOMMatrix {};

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(),
}));

import { isSectionHeader } from '../utils/resumeParser';
import { normalizeResumeData } from '../pages/ResumeAgentPage';
import { resolveSection, hasSectionContent } from '../utils/sectionRegistry';

describe('Resume Import & Section Parsing', () => {
  describe('isSectionHeader Detection', () => {
    it('detects Career Highlights and variants as valid section headers', () => {
      expect(isSectionHeader('Career Highlights')).toBe(true);
      expect(isSectionHeader('CAREER HIGHLIGHTS')).toBe(true);
      expect(isSectionHeader('Career Highlight')).toBe(true);
      expect(isSectionHeader('Key Highlights')).toBe(true);
      expect(isSectionHeader('Professional Highlights')).toBe(true);
      expect(isSectionHeader('Key Achievements')).toBe(true);
      expect(isSectionHeader('Accomplishments')).toBe(true);
      expect(isSectionHeader('Major Accomplishments')).toBe(true);
      expect(isSectionHeader('Selected Achievements')).toBe(true);
      expect(isSectionHeader('Milestones')).toBe(true);
    });

    it('detects standard sections as valid section headers', () => {
      expect(isSectionHeader('Experience')).toBe(true);
      expect(isSectionHeader('Work Experience')).toBe(true);
      expect(isSectionHeader('Professional Experience')).toBe(true);
      expect(isSectionHeader('Education')).toBe(true);
      expect(isSectionHeader('Certifications')).toBe(true);
      expect(isSectionHeader('Skills')).toBe(true);
      expect(isSectionHeader('Projects')).toBe(true);
      expect(isSectionHeader('Leadership')).toBe(true);
      expect(isSectionHeader('Languages')).toBe(true);
    });
  });

  describe('normalizeResumeData Section & Highlight Handling', () => {
    it('maps careerHighlights to keyAchievements and preserves Career Highlights title', () => {
      const raw = {
        fullName: 'Jane Doe',
        jobTitle: 'Senior Product Lead',
        careerHighlights: [
          'Spearheaded 0-to-1 launch of mobile platform scaling to 2M users',
          'Increased annual recurring revenue by 45% through pricing optimization',
        ],
        experience: [
          {
            role: 'Product Manager',
            company: 'TechCorp',
            startDate: '2021',
            endDate: 'Present',
            description: '• Drove roadmap strategy\n• Managed cross-functional squad of 12 engineers',
          },
        ],
      };

      const normalized = normalizeResumeData(raw);

      expect(normalized.keyAchievements).toBeDefined();
      expect(Array.isArray(normalized.keyAchievements)).toBe(true);
      expect(normalized.keyAchievements).toEqual([
        'Spearheaded 0-to-1 launch of mobile platform scaling to 2M users.',
        'Increased annual recurring revenue by 45% through pricing optimization.',
      ]);
      expect(normalized.sectionTitles?.achievements).toBe('Career Highlights');

      const resolved = resolveSection(normalized, 'achievements');
      expect(resolved).not.toBeNull();
      expect(resolved?.hasContent).toBe(true);
      expect(resolved?.title).toBe('Career Highlights');
    });

    it('extracts trapped Career Highlights from additionalInfo into keyAchievements', () => {
      const raw = {
        fullName: 'Alex Smith',
        additionalInfo: [
          {
            label: 'Career Highlights',
            value: '• Reduced operational cloud costs by $400k annually\n• Built automated CI/CD pipeline cutting deployment times by 70%',
          },
          {
            label: 'Interests',
            value: 'Open source development, marathon running',
          },
        ],
      };

      const normalized = normalizeResumeData(raw);

      expect(normalized.keyAchievements).toBeDefined();
      expect(typeof normalized.keyAchievements === 'string').toBe(true);
      expect(normalized.keyAchievements).toContain('Reduced operational cloud costs by $400k annually.');
      expect(normalized.keyAchievements).toContain('cutting deployment times by 70%.');

      // Career Highlights should be removed from additionalInfo, leaving Interests
      expect(normalized.additionalInfo?.length).toBe(1);
      expect(normalized.additionalInfo?.[0].label).toBe('Interests');

      expect(hasSectionContent(normalized, 'achievements')).toBe(true);
    });

    it('ensures all extracted bullet points end with a full-stop', () => {
      const raw = {
        fullName: 'John Doe',
        experience: [
          {
            role: 'Software Engineer',
            company: 'Acme Inc',
            startDate: '2020',
            endDate: '2023',
            description: '• Architected resilient backend services\n• Optimized SQL query performance by 40%',
          },
        ],
        projects: [
          {
            name: 'Analytics Dashboard',
            description: '• Visualized real-time telemetry metrics',
          },
        ],
        keyAchievements: [
          'Awarded Developer of the Year in 2022',
          'Published 3 high-impact technical whitepapers',
        ],
      };

      const normalized = normalizeResumeData(raw);

      expect(normalized.experience[0].description).toBe(
        '• Architected resilient backend services.\n• Optimized SQL query performance by 40%.'
      );
      expect(normalized.projects[0].description).toBe(
        '• Visualized real-time telemetry metrics.'
      );
      expect(normalized.keyAchievements).toEqual([
        'Awarded Developer of the Year in 2022.',
        'Published 3 high-impact technical whitepapers.',
      ]);
    });
  });
});
