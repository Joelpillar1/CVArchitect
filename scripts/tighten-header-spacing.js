import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../components/templates');

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'))) {
    const filePath = path.join(dir, file);
    let c = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (c.includes('getHeaderItemGapIn') && !c.includes('lineHeight: 1.1') && c.includes('formatNameDisplay')) {
        c = c.replace(
            /(marginBottom: `\$\{getHeaderItemGapIn\(data\)\}in`)(?!,\s*\n\s*lineHeight)/g,
            '$1, lineHeight: 1.1'
        );
        c = c.replace(
            /(marginBottom: headerItemGap)(?!,\s*\n\s*lineHeight)/g,
            '$1, lineHeight: 1.1'
        );
        changed = true;
    }

    if (c.includes('formatContactText') && (c.includes('>|</span>') || c.includes('>•</span>') || c.includes('>|</span>'))) {
        c = c.replace(/<span className="mx-1">\|<\/span>/g, '<span className="mx-1">{CONTACT_SEPARATOR}</span>');
        c = c.replace(/<span className="mx-2">\|<\/span>/g, '<span className="mx-0.5">{CONTACT_SEPARATOR}</span>');
        c = c.replace(/<span>\|<\/span>/g, '<span>{CONTACT_SEPARATOR}</span>');
        c = c.replace(/<span className="mx-1">•<\/span>/g, '<span className="mx-1">{CONTACT_SEPARATOR}</span>');
        c = c.replace(/<span className="mx-2">•<\/span>/g, '<span className="mx-0.5">{CONTACT_SEPARATOR}</span>');
        c = c.replace(/<span className="text-gray-300 mx-1">\|<\/span>/g, '<span className="text-gray-400 mx-0.5">{CONTACT_SEPARATOR}</span>');
        changed = true;
    }

    if (c.includes('{CONTACT_SEPARATOR}') && !c.includes('CONTACT_SEPARATOR')) {
        c = c.replace(
            /from '\.\.\/\.\.\/utils\/templateUtils';/,
            (m) => {
                if (c.includes('CONTACT_SEPARATOR')) return m;
                return m.replace("templateUtils';", "templateUtils';\n// CONTACT_SEPARATOR imported below");
            }
        );
        c = c.replace(
            /(formatNameDisplay|getLinkedInHref|formatContactText)(,|\s*} from '\.\.\/\.\.\/utils\/templateUtils')/,
            (match, imp, suffix) => {
                if (c.includes('CONTACT_SEPARATOR,')) return match;
                if (suffix === ',') return `${imp}, CONTACT_SEPARATOR,`;
                return match.replace("} from '../../utils/templateUtils'", ', CONTACT_SEPARATOR } from \'../../utils/templateUtils\'');
            }
        );
        // Fix import block style
        c = c.replace(
            /import \{([^}]+)\} from '\.\.\/\.\.\/utils\/templateUtils';/,
            (full, imports) => {
                if (imports.includes('CONTACT_SEPARATOR')) return full;
                return `import {${imports.trimEnd()}, CONTACT_SEPARATOR} from '../../utils/templateUtils';`;
            }
        );
        changed = true;
    }

    // Remove duplicate header tailwind padding
    c = c.replace(/<header className="text-center mb-4"/g, '<header className="text-center"');
    c = c.replace(/<header className="text-center mb-6"/g, '<header className="text-center"');

    if (changed) {
        fs.writeFileSync(filePath, c);
        console.log('Updated', file);
    }
}
