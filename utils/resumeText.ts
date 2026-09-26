import type { ResumeData } from '../types';
import { parseDescriptionBullets, parseAchievementBullets } from './templateUtils';

/**
 * Flatten a ResumeData object into plain text for keyword / ATS matching.
 *
 * Pure and dependency-light so it runs identically in the browser and in the
 * Node serverless agent. This is NOT a renderer — it exists only to feed text
 * matchers (ATSEngine) the same words a recruiter/parser would see, with no
 * styling, ids, or layout metadata. Placeholder INITIAL_DATA-style values are
 * left as-is; the caller decides what to analyze.
 */
export function serializeResumeToText(resume: ResumeData): string {
  const lines: string[] = [];
  const push = (v?: string | null) => {
    const t = (v ?? '').trim();
    if (t) lines.push(t);
  };

  // Header / identity
  push(resume.fullName);
  push(resume.jobTitle);

  // Summary
  push(resume.summary);

  // Skills (already a comma string)
  push(resume.skills);

  // Experience + Leadership (same shape)
  const roles = [...(resume.experience ?? []), ...(resume.leadership ?? [])];
  for (const role of roles) {
    push([role.role, role.company].filter(Boolean).join(' — '));
    push(role.roleSummary);
    for (const bullet of parseDescriptionBullets(role.description)) push(bullet);
  }

  // Key achievements
  for (const a of parseAchievementBullets(resume.keyAchievements ?? [])) push(a);

  // Projects
  for (const p of resume.projects ?? []) {
    push(p.name);
    push(p.description);
    push(p.technologies);
  }

  // Education
  for (const e of resume.education ?? []) {
    push([e.degree, e.school, e.relevantCourses].filter(Boolean).join(' — '));
  }

  // Certifications
  for (const c of resume.certifications ?? []) {
    push([c.name, c.issuer].filter(Boolean).join(' — '));
  }

  // Languages
  for (const l of resume.languages ?? []) {
    push([l.language, l.proficiency].filter(Boolean).join(' — '));
  }

  // Additional custom sections
  for (const info of resume.additionalInfo ?? []) {
    push([info.label, info.value].filter(Boolean).join(': '));
  }

  return lines.join('\n');
}
