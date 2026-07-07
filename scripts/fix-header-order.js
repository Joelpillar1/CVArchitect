/**
 * Standardize header spacing: job title uses headerContactGap before contacts.
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
    if (!content.includes('getHeaderItemGapIn') && !content.includes('headerItemGap')) continue;

    if (!content.includes('getHeaderContactGapIn')) {
        content = content.replace(
            /getHeaderItemGapIn/g,
            (match, offset) => {
                // only add import once at first occurrence in import line
                return match;
            }
        );
        content = content.replace(
            /(getHeaderItemGapIn)(,|\s*} from)/,
            'getHeaderItemGapIn, getHeaderContactGapIn$2'
        );
        if (!content.includes('getHeaderContactGapIn')) {
            content = content.replace(
                'getHeaderItemGapIn, formatNameDisplay',
                'getHeaderItemGapIn, getHeaderContactGapIn, formatNameDisplay'
            );
        }
    }

    // Job title / role lines: use contact gap before contacts
    content = content.replace(
        /(fontSizes\?\.jobTitle[^`]*marginBottom: `\$\{getHeaderItemGapIn\(data\)\}in`)/g,
        (m) => m.replace('getHeaderItemGapIn', 'getHeaderContactGapIn')
    );
    content = content.replace(
        /(fontSizes\?\.body \|\| fontSizes\?\.jobTitle[^`]*marginBottom: `\$\{getHeaderItemGapIn\(data\)\}in`)/g,
        (m) => m.replace('getHeaderItemGapIn', 'getHeaderContactGapIn')
    );
    content = content.replace(
        /marginBottom: headerItemGap \}\}>\s*\n\s*\{data\.jobTitle/g,
        'marginBottom: headerContactGap }}>\n                    {data.jobTitle'
    );

    if (content.includes('const headerItemGap = ')) {
        if (!content.includes('const headerContactGap = ')) {
            content = content.replace(
                /const headerItemGap = `\$\{getHeaderItemGapIn\(data\)\}in`;/,
                `const headerItemGap = \`\${getHeaderItemGapIn(data)}in\`;\n    const headerContactGap = \`\${getHeaderContactGapIn(data)}in\`;`
            );
        }
        content = content.replace(
            /(jobTitle[^}]*marginBottom: )headerItemGap/g,
            '$1headerContactGap'
        );
    }

    fs.writeFileSync(filePath, content);
    console.log('Updated', file);
}

console.log('Done.');
