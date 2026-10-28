import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

/** The static shells that every page is served from. */
const SHELLS = ['index.html', path.join('public', '404.html')];

interface AnalyticsScript {
  name: string;
  src: string;
  /** Attributes that must be present verbatim, so a tracking ID cannot drift. */
  attrs: string[];
  /** Set to false when the script intentionally reuses another tracker's website ID. */
  uniqueId?: boolean;
}

const SCRIPTS: AnalyticsScript[] = [
  {
    name: 'DataFast',
    src: 'https://datafa.st/js/script.js',
    attrs: ['data-website-id="dfid_uuo5wQV0LNgIEGIq31PAC"', 'data-domain="cvarchitect.app"'],
  },
  {
    name: 'TrackKit',
    src: 'https://trackkit-self.vercel.app/script.js',
    attrs: ['data-website-id="f7563ccb-892d-496d-97fa-32a92a6e5468"'],
  },
  {
    name: 'TrackKit Replay',
    src: 'https://trackkit-self.vercel.app/recorder.js',
    attrs: ['data-website-id="f7563ccb-892d-496d-97fa-32a92a6e5468"'],
    uniqueId: false,
  },
  {
    name: 'Minilytics',
    src: 'https://minilytics.trackkit.workers.dev/js/script.js',
    attrs: ['data-website-id="356o4a4v4p576t1e"'],
  },
];

function read(file: string): string {
  return readFileSync(path.join(ROOT, file), 'utf8');
}

describe('analytics scripts', () => {
  it('are installed in every static HTML shell', () => {
    for (const file of SHELLS) {
      const html = read(file);
      for (const script of SCRIPTS) {
        expect(html, `${file}: ${script.name} src`).toContain(script.src);
        for (const attr of script.attrs) {
          expect(html, `${file}: ${script.name} ${attr}`).toContain(attr);
        }
      }
    }
  });

  it('load without blocking rendering', () => {
    for (const file of SHELLS) {
      const html = read(file);
      for (const script of SCRIPTS) {
        const at = html.indexOf(script.src);
        const tag = html.slice(Math.max(0, at - 260), at + script.src.length);
        expect(tag, `${file}: ${script.name} defer`).toContain('defer');
      }
    }
  });

  it('appear exactly once per shell, so pageviews are not double counted', () => {
    for (const file of SHELLS) {
      const html = read(file);
      for (const script of SCRIPTS) {
        const matches = html.split(script.src).length - 1;
        expect(matches, `${file}: ${script.name}`).toBe(1);
      }
    }
  });

  it('keep distinct tracker website IDs', () => {
    const ids = SCRIPTS.filter((script) => script.uniqueId !== false).map((script) =>
      script.attrs.find((attr) => attr.startsWith('data-website-id=')),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});
