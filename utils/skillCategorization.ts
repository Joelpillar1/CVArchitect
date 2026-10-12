import { splitSkillsList } from './templateUtils';

export interface SkillCategoryRow {
  id: string;
  category: string;
  skills: string;
}

/**
 * Heuristic buckets used to auto-categorize a plain comma-separated skills
 * list into "Category: skills" rows (Languages, Frameworks, Tools, …).
 * Shared by the skills editor and template renderers so what the user sees in
 * the editor matches what the resume renders.
 */
export const KNOWN_SKILL_CATEGORIES = [
  {
    category: 'Strategy & Product',
    test: (s: string) =>
      /(product strategy|product management|roadmap|go-to-market|gtm|feature prioritization|product lifecycle|okrs?|kpis?|growth strategy|business development)/i.test(s),
  },
  {
    category: 'Methodologies',
    test: (s: string) =>
      /(agile|scrum|kanban|sprint|lean|waterfall|ci\/cd|continuous integration|continuous deployment|tdd|test-driven|devops)/i.test(s),
  },
  {
    category: 'Data & Analytics',
    test: (s: string) =>
      /(data analysis|sql|a\/b test|experimentation|analytics|metrics|business intelligence|tableau|power bi|mixpanel|amplitude)/i.test(s),
  },
  {
    category: 'Design & UX',
    test: (s: string) =>
      /(ui\/ux|ux\/ui|design principles|user research|wirefram|prototyp|figma|usability|design thinking|information architecture)/i.test(s),
  },
  {
    category: 'Leadership',
    test: (s: string) =>
      /(cross-functional leadership|leadership|team management|stakeholder management|mentoring|strategic planning|people management)/i.test(s),
  },
  {
    category: 'Languages',
    test: (s: string) =>
      /^(javascript|typescript|python|java|c\+\+|c#|c|sql|go|golang|rust|ruby|php|swift|kotlin|r|scala|dart|html|html5|css|css3|sass|scss|bash|shell|powershell|perl|matlab|english|spanish|french|german)$/i.test(s),
  },
  {
    category: 'Frameworks',
    test: (s: string) =>
      /^(react|react\.js|react native|angular|angularjs|vue|vue\.js|node\.js|node|express|express\.js|spring|spring boot|django|flask|fastapi|next\.js|nuxt\.js|svelte|asp\.net|laravel|ruby on rails|rails|tailwind|tailwind css|bootstrap|jquery)$/i.test(s),
  },
  {
    category: 'Cloud & Infrastructure',
    test: (s: string) =>
      /^(google cloud platform|gcp|aws|amazon web services|azure|microsoft azure|firebase|docker swarm|terraform|cloud computing|cloudflare|heroku|digitalocean|openstack|ansible)$/i.test(s),
  },
  {
    category: 'Tools',
    test: (s: string) =>
      /^(git|docker|jenkins|kubernetes|k8s|webpack|babel|vite|npm|yarn|pnpm|jira|confluence|postman|insomnia|github|gitlab|bitbucket|vs code|visual studio|figma)$/i.test(s),
  },
];

/**
 * Split a raw skills string into category rows:
 * - Lines already labeled ("Languages: Java, …") are kept as rows as-is.
 * - A plain comma-separated list is bucketed via KNOWN_SKILL_CATEGORIES;
 *   leftovers land in "Key Competencies" (or an unlabeled row when nothing
 *   matched at all).
 */
export function parseSkillCategories(raw: string | null | undefined): SkillCategoryRow[] {
  if (!raw || !raw.trim()) return [];

  const lines = raw
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const hasColons = lines.some((l) => l.includes(':'));

  if (hasColons) {
    return lines.map((line, idx) => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        return {
          id: `item-${idx + 1}`,
          category: line.slice(0, colonIdx).trim(),
          skills: line.slice(colonIdx + 1).trim(),
        };
      }
      return { id: `item-${idx + 1}`, category: '', skills: line };
    });
  }

  const skillsList = splitSkillsList(raw);
  if (skillsList.length === 0) return [];

  const buckets: { [cat: string]: string[] } = {};
  const unassigned: string[] = [];

  for (const skill of skillsList) {
    const trimmed = skill.trim();
    if (!trimmed) continue;
    let matched = false;
    for (const cat of KNOWN_SKILL_CATEGORIES) {
      if (cat.test(trimmed.toLowerCase())) {
        if (!buckets[cat.category]) buckets[cat.category] = [];
        buckets[cat.category].push(trimmed);
        matched = true;
        break;
      }
    }
    if (!matched) {
      unassigned.push(trimmed);
    }
  }

  const result: SkillCategoryRow[] = [];
  let counter = 1;
  for (const cat of KNOWN_SKILL_CATEGORIES) {
    if (buckets[cat.category] && buckets[cat.category].length > 0) {
      result.push({
        id: `item-${counter++}`,
        category: cat.category,
        skills: buckets[cat.category].join(', '),
      });
    }
  }

  if (unassigned.length > 0) {
    result.push({
      id: `item-${counter++}`,
      category: result.length > 0 ? 'Key Competencies' : '',
      skills: unassigned.join(', '),
    });
  }

  return result;
}
