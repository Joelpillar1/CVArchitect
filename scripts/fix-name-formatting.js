/**
 * Apply formatNameDisplay() to all template headers and remove CSS uppercase on names.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '../components/templates');

const files = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(templatesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('fullName')) continue;

    // Add formatNameDisplay to templateUtils import
    if (!content.includes('formatNameDisplay')) {
        content = content.replace(
            /from ['"](\.\.\/)+utils\/templateUtils['"];/,
            (match) => {
                if (match.includes('formatNameDisplay')) return match;
                return match.replace(
                    /(formatContactText|getLinkedInHref|BULLET_LIST_CLASS|sectionMarginBottom|getPagePaddingStyle|getMarginVerticalIn|getMarginHorizontalIn|getHeaderItemGapIn|getHeaderGapIn|getSectionGapIn|getNormalizedSectionOrder|parseAchievementBullets|descriptionToString|parseDescriptionBullets|formatDate|formatMonthYear|splitSkillsIntoColumns),/,
                    '$1, formatNameDisplay,'
                ).replace(
                    /from ['"](\.\.\/)+utils\/templateUtils['"];/,
                    (m) => {
                        if (m.includes('formatNameDisplay')) return m;
                        // fallback: insert before closing brace of import
                        return content.includes('formatContactText')
                            ? m.replace(
                                  "from '../../utils/templateUtils';",
                                  "formatNameDisplay } from '../../utils/templateUtils';"
                              ).replace('{ ', '{ formatNameDisplay, ')
                            : m;
                    }
                );
            }
        );

        // Simpler import fix
        content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('formatNameDisplay')) {
            content = content.replace(
                /import \{([^}]+)\} from ['"](\.\.\/)+utils\/templateUtils['"];/,
                (match, imports) => {
                    if (imports.includes('formatNameDisplay')) return match;
                    return match.replace(imports, `${imports.trimEnd()}, formatNameDisplay`);
                }
            );
        }
    }

    // Replace name display patterns
    content = content.replace(/\{data\.fullName\.toUpperCase\(\)\}/g, '{formatNameDisplay(data.fullName, data.headerCase)}');
    content = content.replace(/\{data\.fullName \|\| '([^']*)'\}/g, "{formatNameDisplay(data.fullName, data.headerCase) || '$1'}");
    content = content.replace(/\{data\.fullName \|\| "([^"]*)"\}/g, '{formatNameDisplay(data.fullName, data.headerCase) || "$1"}');
    content = content.replace(/\{data\.fullName\}/g, '{formatNameDisplay(data.fullName, data.headerCase)}');

    // Remove default uppercase headerCase class — formatting is in JS
    content = content.replace(
        /\$\{data\.headerCase \|\| 'uppercase'\}/g,
        "${data.headerCase === 'uppercase' ? 'uppercase' : data.headerCase === 'lowercase' ? 'lowercase' : ''}"
    );

    // Remove uppercase from h1 classNames near name (common patterns)
    content = content.replace(
        /className="([^"]*)\buppercase\b([^"]*)"\s*\n(\s*)style=\{\{ marginBottom: `\$\{getHeaderItemGapIn\(data\)\}in`/g,
        (m, before, after, indent) => {
            const cleaned = `className="${(before + after).replace(/\s+/g, ' ').trim()}"`;
            return `${cleaned}\n${indent}style={{ marginBottom: \`\${getHeaderItemGapIn(data)}in\``;
        }
    );

    const nameUppercasePatterns = [
        ['className="uppercase tracking-widest text-4xl text-gray-800"', 'className="tracking-widest text-4xl text-gray-800"'],
        ['className="text-4xl font-bold uppercase tracking-tight text-gray-900"', 'className="text-4xl font-bold tracking-tight text-gray-900"'],
        ['className="font-bold uppercase tracking-wide text-gray-900"', 'className="font-bold tracking-wide text-gray-900"'],
        ['className="font-extrabold tracking-tight uppercase"', 'className="font-extrabold tracking-tight"'],
        ['className="font-bold uppercase"', 'className="font-bold"'],
        ['className="font-bold uppercase tracking-widest"', 'className="font-bold tracking-widest"'],
        ['className="uppercase mb-1"', 'className="mb-1"'],
    ];

    for (const [from, to] of nameUppercasePatterns) {
        content = content.replaceAll(from, to);
    }

    fs.writeFileSync(filePath, content);
    console.log('Updated', file);
}

console.log('Done.');
