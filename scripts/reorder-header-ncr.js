/**
 * Reorder FreshGrad-style headers: Name → Contact → Role
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const freshGradFiles = [
    'FreshGradTemplate.tsx',
    'FreshGradEngTemplate.tsx',
    'FreshGradMarketingTemplate.tsx',
    'FreshGradFinanceTemplate.tsx',
    'FreshGradCSTemplate.tsx',
    'FreshGradArtsTemplate.tsx',
    'FreshGrad7Template.tsx',
    'StudentTemplate.tsx',
];

const jobTitleBlock = `        {data.jobTitle && (
          <p
            style={{
              fontSize: \`\${fontSizes?.jobTitle || fontSizes?.body || 10}pt\`,
              marginBottom: \`\${getHeaderContactGapIn(data)}in\`,
            }}
          >
            {data.jobTitle}
          </p>
        )}`;

const jobTitleBlockIndented = jobTitleBlock.replace(/^        /gm, '                    ');

for (const file of freshGradFiles) {
    const filePath = path.join(__dirname, '../components/templates', file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove job title block before contact (various indent levels)
    content = content.replace(
        /\s*\{data\.jobTitle && \(\s*<p[\s\S]*?\{data\.jobTitle\}\s*<\/p>\s*\)\}/g,
        ''
    );

    // Add marginBottom to contact container before join line
    content = content.replace(
        /(className="[^"]*text-gray-(?:700|800|900)[^"]*"[\s\S]*?style=\{\{ fontSize: `\$\{smallSize\}pt` \}\})/g,
        '$1, marginBottom: `${getHeaderContactGapIn(data)}in`'
    );
    content = content.replace(
        /style=\{\{ fontSize: `\$\{smallSize\}pt` \}, marginBottom: `\$\{getHeaderContactGapIn\(data\)\}in` \}\}/g,
        'style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}'
    );

    // Insert job title after contact closing div - before </header> or next section
    const contactClosePattern = /(\.join\(' \| '\)\}\s*<\/div>)/;
    if (contactClosePattern.test(content) && !content.includes('{data.jobTitle}')) {
        content = content.replace(
            contactClosePattern,
            `$1\n${file.includes('7') || file.includes('Student') ? jobTitleBlockIndented : jobTitleBlock}`
        );
    }

    fs.writeFileSync(filePath, content);
    console.log('Updated', file);
}
