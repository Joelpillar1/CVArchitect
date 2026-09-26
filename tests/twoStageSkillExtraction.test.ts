import { describe, it, expect } from 'vitest';
import { getSkillExtractionService, SkillExtractionService } from '../services/skillExtractionService';
import { classifySkillHeading } from '../types/agentContract';

describe('Two-Stage Skill Extraction Engine', () => {
  const extractor = getSkillExtractionService();

  // Test 1: Test resumes with "Skills"
  it('1. Extracts cleanly from general "Skills" heading', () => {
    const text = `
John Doe
Product Manager

SKILLS
Product Strategy, User Research, Agile, Roadmap Planning, Figma

EXPERIENCE
Company XYZ - 2020 to Present
• Led product team
`;
    const result = extractor.extractSkills(text);
    expect(result.skillSections.length).toBe(1);
    expect(result.skillSections[0].originalHeading).toBe('SKILLS');
    expect(result.skillSections[0].normalizedType).toBe('skills');
    expect(result.allSkills).toContain('Product Strategy');
    expect(result.allSkills).toContain('User Research');
    expect(result.allSkills).toContain('Agile');
    expect(result.allSkills).toContain('Roadmap Planning');
    expect(result.allSkills).toContain('Figma');
    expect(result.allSkills).not.toContain('Led product team');
  });

  // Test 2: Test "Technical Skills" (matching user's provided screenshot)
  it('2. Extracts discrete items from multi-column bulleted "TECHNICAL SKILLS"', () => {
    const text = `
TECHNICAL SKILLS
• Web3 • DeFi • Crypto-ecosystems
• Crypto-to-fiat platforms • Nft marketplaces • Dex overhauls
• Blockchain protocols • User experiences • Solana ecosystem
• Liquid staking • Gamified finance • GameFi
• Scalable design systems • Usability testing • Wallet integrations
• Transaction signing flows • Web3 onboarding experiences • Real-world assets
• On-chain liquidity • User-centric interfaces • Personas
• Journey maps • Real-time price feeds • Order book visualizations
• Design systems

EXPERIENCE
Senior Designer at Web3 Lab
`;
    const result = extractor.extractSkills(text);
    expect(result.skillSections.length).toBe(1);
    expect(result.skillSections[0].originalHeading).toBe('TECHNICAL SKILLS');
    expect(result.skillSections[0].normalizedType).toBe('technical_skills');
    expect(result.allSkills).toContain('Web3');
    expect(result.allSkills).toContain('DeFi');
    expect(result.allSkills).toContain('Solana ecosystem');
    expect(result.allSkills).toContain('Liquid staking');
    expect(result.allSkills).toContain('GameFi');
    expect(result.allSkills).toContain('Wallet integrations');
    expect(result.allSkills).toContain('Crypto-to-fiat platforms');
    expect(result.allSkills).toContain('Order book visualizations');
    expect(result.allSkills.length).toBeGreaterThanOrEqual(20);
  });

  // Test 3: Test "Core Competencies"
  it('3. Extracts cleanly from "Core Competencies"', () => {
    const text = `
CORE COMPETENCIES
- Stakeholder Management
- Go-to-Market Strategy
- Cross-Functional Leadership
- OKR Setting
`;
    const result = extractor.extractSkills(text);
    expect(result.skillSections.length).toBe(1);
    expect(result.skillSections[0].normalizedType).toBe('core_competencies');
    expect(result.allSkills).toEqual([
      'Stakeholder Management',
      'Go-to-Market Strategy',
      'Cross-Functional Leadership',
      'OKR Setting',
    ]);
  });

  // Test 4: Test "Areas of Expertise"
  it('4. Classifies and extracts from "Areas of Expertise"', () => {
    const text = `
AREAS OF EXPERTISE
Cloud Architecture | Distributed Systems | Kubernetes | Terraform | CI/CD
`;
    const result = extractor.extractSkills(text);
    expect(result.skillSections.length).toBe(1);
    expect(result.skillSections[0].normalizedType).toBe('core_competencies');
    expect(result.allSkills).toContain('Cloud Architecture');
    expect(result.allSkills).toContain('Distributed Systems');
    expect(result.allSkills).toContain('Kubernetes');
    expect(result.allSkills).toContain('Terraform');
    expect(result.allSkills).toContain('CI/CD');
  });

  // Test 5: Test grouped skills with categories
  it('5. Extracts grouped skills with categories preserved', () => {
    const text = `
TECHNICAL TOOLKIT
DESIGN: Figma, FigJam, Sketch
ENGINEERING: TypeScript, Node.js, Next.js
DATABASES: PostgreSQL, Redis
`;
    const result = extractor.extractSkills(text);
    expect(result.skillSections.length).toBe(1);
    const items = result.skillSections[0].items;

    const figma = items.find((i) => i.name === 'Figma');
    expect(figma?.category).toBe('DESIGN');

    const ts = items.find((i) => i.name === 'TypeScript');
    expect(ts?.category).toBe('ENGINEERING');

    const pg = items.find((i) => i.name === 'PostgreSQL');
    expect(pg?.category).toBe('DATABASES');
  });

  // Test 6: Test comma-separated skills
  it('6. Tokenizes comma-separated skill lists into individual entities', () => {
    const text = `
KEY SKILLS
React, Redux Toolkit, Tailwind CSS, GraphQL, Jest, Docker
`;
    const result = extractor.extractSkills(text);
    expect(result.allSkills).toEqual([
      'React',
      'Redux Toolkit',
      'Tailwind CSS',
      'GraphQL',
      'Jest',
      'Docker',
    ]);
  });

  // Test 7: Test bullet-separated skills
  it('7. Handles diverse bullet styles (•, ·, -, *, ▪, ▫)', () => {
    const text = `
SKILLS & PROFICIENCIES
• Python
· PyTorch
- NumPy
* Pandas
▪ Scikit-learn
▫ FastHTML
`;
    const result = extractor.extractSkills(text);
    expect(result.allSkills).toEqual([
      'Python',
      'PyTorch',
      'NumPy',
      'Pandas',
      'Scikit-learn',
      'FastHTML',
    ]);
  });

  // Test 8: Test paragraphs under a skill-related heading (Must NOT extract as skills)
  it('8. Rejects narrative paragraphs under skill headings and prevents over-extraction', () => {
    const text = `
AREAS OF EXPERTISE
Experienced product designer with strong knowledge of user-centered design and collaboration across diverse multi-disciplinary squads.
Led a team of designers to improve the product conversion by 35% across all checkout funnels.

TECHNICAL SKILLS
Figma, FigJam, HTML, CSS
`;
    const result = extractor.extractSkills(text);
    // The narrative paragraph under "AREAS OF EXPERTISE" should be rejected or marked ambiguous
    expect(result.allSkills).not.toContain(
      'Experienced product designer with strong knowledge of user-centered design and collaboration across diverse multi-disciplinary squads.'
    );
    expect(result.allSkills).not.toContain(
      'Led a team of designers to improve the product conversion by 35% across all checkout funnels.'
    );
    // Only real skills from TECHNICAL SKILLS should be present
    expect(result.allSkills).toContain('Figma');
    expect(result.allSkills).toContain('FigJam');
    expect(result.allSkills).toContain('HTML');
    expect(result.allSkills).toContain('CSS');
  });

  // Test 9: Test ambiguous headings
  it('9. Correctly flags ambiguous headings without corrupting skill lists', () => {
    const text = `
AREAS OF SPECIALIZATION
Responsible for delivering end-to-end enterprise solutions for banking clients worldwide since 2018.
`;
    const result = extractor.extractSkills(text);
    expect(result.allSkills.length).toBe(0);
    const ambig = result.skillSections.find((s) => s.normalizedType === 'ambiguous');
    expect(ambig).toBeDefined();
  });

  // Test 10: Verify unrelated sections are never scraped into skills
  it('10. Never scrapes Experience, Summary, Education, or Projects into skills', () => {
    const text = `
SUMMARY
Senior Full Stack Engineer with 8 years of experience building web applications.

WORK EXPERIENCE
Lead Software Engineer | Acme Corp (2020 - Present)
• Built scalable microservices architecture using Go and Kafka.
• Managed a squad of 6 frontend developers.
• Increased system uptime by 99.99%.

EDUCATION
Bachelor of Science in Computer Science, Stanford University (2016)

PROJECTS
OpenSource Analytics: High-throughput telemetry pipeline.

TECHNICAL SKILLS
Go, Kafka, Docker, Kubernetes, AWS
`;
    const result = extractor.extractSkills(text);
    expect(result.allSkills).toEqual(['Go', 'Kafka', 'Docker', 'Kubernetes', 'AWS']);
    expect(result.allSkills).not.toContain('Lead Software Engineer');
    expect(result.allSkills).not.toContain('Acme Corp');
    expect(result.allSkills).not.toContain('Stanford University');
    expect(result.allSkills).not.toContain('Increased system uptime by 99.99%');
  });

  // Preservation of multiple distinct skill sections
  it('11. Preserves multiple distinct skill sections without loss of identity', () => {
    const text = `
CORE COMPETENCIES
• Product Strategy
• Stakeholder Management

TECHNICAL SKILLS
• Figma
• SQL
• Python
`;
    const result = extractor.extractSkills(text);
    expect(result.skillSections.length).toBe(2);

    expect(result.skillSections[0].originalHeading).toBe('CORE COMPETENCIES');
    expect(result.skillSections[0].normalizedType).toBe('core_competencies');
    expect(result.skillSections[0].items.map((i) => i.name)).toEqual([
      'Product Strategy',
      'Stakeholder Management',
    ]);

    expect(result.skillSections[1].originalHeading).toBe('TECHNICAL SKILLS');
    expect(result.skillSections[1].normalizedType).toBe('technical_skills');
    expect(result.skillSections[1].items.map((i) => i.name)).toEqual([
      'Figma',
      'SQL',
      'Python',
    ]);

    expect(result.allSkills).toEqual([
      'Product Strategy',
      'Stakeholder Management',
      'Figma',
      'SQL',
      'Python',
    ]);
  });
});
