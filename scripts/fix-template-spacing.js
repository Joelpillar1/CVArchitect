import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '../components/templates');

const SPACING_IMPORT =
  "getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS";

function ensureSpacingImports(content, fileName) {
  if (content.includes('getSectionGapIn(') && content.includes("from '../../utils/templateUtils'")) {
    return content.replace(
      /import \{([^}]+)\} from '\.\.\/\.\.\/utils\/templateUtils';/,
      (match, imports) => {
        const parts = imports.split(',').map((s) => s.trim()).filter(Boolean);
        for (const sym of SPACING_IMPORT.split(',').map((s) => s.trim())) {
          if (!parts.includes(sym)) parts.push(sym);
        }
        return `import { ${parts.join(', ')} } from '../../utils/templateUtils';`;
      }
    );
  }

  if (content.includes('getSectionGapIn(')) {
    return content.replace(
      /import React from 'react';\n/,
      "import React from 'react';\nimport { getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS } from '../../utils/templateUtils';\n"
    );
  }

  return content;
}

const replacements = [
  [/data\.sectionGap \|\| 0\.14/g, 'getSectionGapIn(data)'],
  [/data\.sectionGap \|\| 0\.2/g, 'getSectionGapIn(data)'],
  [/data\.sectionGap \?\? 0\.14/g, 'getSectionGapIn(data)'],
  [/data\.headerGap \|\| 0\.15/g, 'getHeaderGapIn(data)'],
  [/data\.headerGap \|\| 0\.12/g, 'getHeaderGapIn(data)'],
  [/data\.headerItemGap \|\| 0\.08/g, 'getHeaderItemGapIn(data)'],
  [/data\.headerItemGap \|\| 0\.06/g, 'getHeaderItemGapIn(data)'],
  [/data\.headerItemGap \|\| 0\.05/g, 'getHeaderItemGapIn(data)'],
  [/data\.margins\?\.horizontal \|\| 0\.39/g, 'getMarginHorizontalIn(data)'],
  [/data\.margins\?\.horizontal \|\| 0\.9/g, 'getMarginHorizontalIn(data)'],
  [/data\.margins\?\.horizontal \|\| 0\.75/g, 'getMarginHorizontalIn(data)'],
  [/data\.margins\?\.horizontal \|\| 0\.8/g, 'getMarginHorizontalIn(data)'],
  [/data\.margins\?\.horizontal \|\| 0\.55/g, 'getMarginHorizontalIn(data)'],
  [/data\.margins\?\.horizontal \|\| 1/g, 'getMarginHorizontalIn(data)'],
  [/data\.margins\?\.horizontal \|\| 0\.5/g, 'getMarginHorizontalIn(data)'],
  [/data\.margins\?\.vertical \|\| 0\.45/g, 'getMarginVerticalIn(data)'],
  [/data\.margins\?\.vertical \|\| 0\.7/g, 'getMarginVerticalIn(data)'],
  [/data\.margins\?\.vertical \|\| 0\.8/g, 'getMarginVerticalIn(data)'],
  [/data\.margins\?\.vertical \|\| 1\.25/g, 'getMarginVerticalIn(data)'],
  [/data\.margins\?\.vertical \|\| 1/g, 'getMarginVerticalIn(data)'],
  [/data\.margins\?\.vertical \|\| 0\.5/g, 'getMarginVerticalIn(data)'],
  [/className="mb-4 break-inside-avoid" style=\{\{ marginBottom: `\$\{getSectionGapIn\(data\)\}in` \}\}/g, 'className="break-inside-avoid" style={sectionMarginBottom(data)}'],
  [/list-disc list-outside ml-4 /g, 'list-disc list-outside ml-5 '],
  [/list-disc ml-4 /g, 'list-disc ml-5 '],
  [/list-disc list-outside ml-6 /g, 'list-disc list-outside ml-5 '],
  [/list-disc ml-6 /g, 'list-disc ml-5 '],
  [/list-disc ml-8 /g, 'list-disc ml-5 '],
];

for (const file of fs.readdirSync(templatesDir).filter((f) => f.endsWith('.tsx'))) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  content = ensureSpacingImports(content, file);

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', file);
  }
}

console.log('Done');
