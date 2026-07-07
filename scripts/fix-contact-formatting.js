import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '../components/templates');

const CONTACT_SYMBOLS = ['formatContactText', 'formatLinkedInDisplay', 'getLinkedInHref'];

function ensureContactImports(content) {
  if (!content.match(/formatContactText|formatLinkedInDisplay|getLinkedInHref/)) {
    return content;
  }

  const importMatch = content.match(/import \{([^}]+)\} from '\.\.\/\.\.\/utils\/templateUtils';/);
  if (importMatch) {
    const parts = importMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
    for (const sym of CONTACT_SYMBOLS) {
      if (!parts.includes(sym)) parts.push(sym);
    }
    return content.replace(
      importMatch[0],
      `import { ${parts.join(', ')} } from '../../utils/templateUtils';`
    );
  }

  return content.replace(
    /import React from 'react';\n/,
    `import React from 'react';\nimport { ${CONTACT_SYMBOLS.join(', ')} } from '../../utils/templateUtils';\n`
  );
}

const replacements = [
  [
    /data\.linkedin\.startsWith\('http'\) \? data\.linkedin : `https:\/\/\$\{data\.linkedin\}`/g,
    'getLinkedInHref(data.linkedin)',
  ],
  [
    /data\.linkedin && typeof data\.linkedin === 'string' && data\.linkedin\.startsWith\('http'\) \? data\.linkedin : `https:\/\/\$\{data\.linkedin \|\| ''\}`/g,
    'getLinkedInHref(data.linkedin)',
  ],
  [
    /\{data\.linkedin\.replace\(\/\^https\?:\\\/\\\/\(www\\.\)\?\/, ''\)\}/g,
    '{formatLinkedInDisplay(data.linkedin)}',
  ],
  [
    /\{data\.linkedin\.replace\(\/\^https\?:\\\/\\\/.+?\)\}/g,
    '{formatLinkedInDisplay(data.linkedin)}',
  ],
  [
    /data\.linkedin \? data\.linkedin\.replace\(\/https\?:\\\/\\\/\(www\\.\)\?\/, ''\) : undefined/g,
    'formatLinkedInDisplay(data.linkedin) || undefined',
  ],
  [/\{data\.phone\}/g, '{formatContactText(data.phone)}'],
  [/\{data\.email\}/g, '{formatContactText(data.email)}'],
  [/\{data\.location\}/g, '{formatContactText(data.location)}'],
  [/\{data\.address\}/g, '{formatContactText(data.address)}'],
  // Tighter name → title: drop extra Tailwind gap under the name
  [/className="([^"]*)\bmb-2\b([^"]*)"([^>]*>\s*\{data\.fullName)/g, 'className="$1$2"$3'],
  [/className="([^"]*)\bmb-3\b([^"]*)"([^>]*>\s*\{data\.fullName)/g, 'className="$1$2"$3'],
  [/className=\{`([^`]*)\bmb-2\b([^`]*)`\}([^>]*>\s*\{data\.fullName)/g, 'className={`$1$2`}$3'],
  [/className=\{`([^`]*)\bmb-3\b([^`]*)`\}([^>]*>\s*\{data\.fullName)/g, 'className={`$1$2`}$3'],
];

for (const file of fs.readdirSync(templatesDir).filter((f) => f.endsWith('.tsx'))) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  content = ensureContactImports(content);

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', file);
  }
}

console.log('Done');
