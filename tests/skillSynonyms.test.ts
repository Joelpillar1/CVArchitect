import { describe, it, expect } from 'vitest';
import { isSkillSectionHeader, SKILL_SECTION_SYNONYMS } from '../types/agentContract';
import { isSectionHeader } from '../utils/resumeParser';

describe('Skill Synonyms & Section Recognition', () => {
  it('recognizes diverse variations of skill synonyms as skill section headers', () => {
    const testHeaders = [
      'Core Competencies',
      'core competence',
      'Technical Competencies',
      'Areas of Expertise',
      'Area of Expertise:',
      'Key Skills',
      'Technical Skills -',
      'Tools & Technologies',
      'Tools and Frameworks',
      'Proficiencies',
      'Technical Stack',
      'Tech Stack:',
      'Key Strengths',
      'Domain Expertise',
      'Core Capabilities',
      'Specializations',
      'Qualifications & Skills',
    ];

    for (const header of testHeaders) {
      expect(isSkillSectionHeader(header)).toBe(true);
      expect(isSectionHeader(header)).toBe(true);
    }
  });

  it('does not falsely classify experience or education headers as skills', () => {
    expect(isSkillSectionHeader('Work Experience')).toBe(false);
    expect(isSkillSectionHeader('Education')).toBe(false);
    expect(isSkillSectionHeader('Executive Summary')).toBe(false);
    expect(isSkillSectionHeader('Certifications')).toBe(false);
  });
});
