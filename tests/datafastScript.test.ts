import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCRIPT_SRC = 'https://datafa.st/js/script.js';
const WEBSITE_ID = 'dfid_uuo5wQV0LNgIEGIq31PAC';
const DOMAIN = 'cvarchitect.app';

/** The static shells that every page is served from. */
const SHELLS = ['index.html', path.join('public', '404.html')];

function read(file: string): string {
  return readFileSync(path.join(ROOT, file), 'utf8');
}

describe('DataFast analytics', () => {
  it('is installed in every static HTML shell', () => {
    for (const file of SHELLS) {
      const html = read(file);
      expect(html, `${file}: script src`).toContain(SCRIPT_SRC);
      expect(html, `${file}: website id`).toContain(`data-website-id="${WEBSITE_ID}"`);
      expect(html, `${file}: domain`).toContain(`data-domain="${DOMAIN}"`);
    }
  });

  it('loads without blocking rendering', () => {
    for (const file of SHELLS) {
      const html = read(file);
      const tag = html.slice(html.indexOf(SCRIPT_SRC) - 260, html.indexOf(SCRIPT_SRC) + SCRIPT_SRC.length);
      expect(tag, `${file}: defer attribute`).toContain('defer');
    }
  });

  it('is present exactly once per shell, so pageviews are not double counted', () => {
    for (const file of SHELLS) {
      const matches = read(file).split(SCRIPT_SRC).length - 1;
      expect(matches, file).toBe(1);
    }
  });
});
