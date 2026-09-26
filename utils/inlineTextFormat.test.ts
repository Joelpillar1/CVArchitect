import { describe, it, expect } from 'vitest';
import { INITIAL_DATA, type ResumeData } from '../types';
import { isStructuralText, findBestTextMatch, toggleInlineTag, isTextFormatted, stripInlineTags, applyPlainEdit, replaceSelectedText, setTextAtPath, buildTextCandidates } from './inlineTextFormat';
import { parseDescriptionBullets } from './templateUtils';

function fixture(): ResumeData {
  return {
    ...INITIAL_DATA,
    fullName: 'Ada Lovelace',
    jobTitle: 'Backend Engineer',
    summary: 'Engineer who ships reliable services.',
    skills: 'Python, SQL, Kubernetes',
    experience: [
      {
        id: 'e1',
        company: 'Acme',
        role: 'Senior Engineer',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: 'Present',
        description: ['Led the platform migration', 'Cut infra costs 20% in 2020'],
      },
    ],
    leadership: [],
    education: [{ id: 'ed1', school: 'MIT', degree: 'BS CS', year: '2019' }],
    certifications: [],
    projects: [{ id: 'p1', name: 'Widgetizer', description: 'A CLI tool', technologies: 'Rust' }],
    keyAchievements: ['Won an internal hackathon'],
    additionalInfo: [],
  };
}

describe('isStructuralText', () => {
  const data = fixture();

  it('flags rendered dates (e.g. "Jan 2020" from "2020-01")', () => {
    expect(isStructuralText('Jan 2020', data)).toBe(true);
  });

  it('flags the "Present" end date', () => {
    expect(isStructuralText('Present', data)).toBe(true);
  });

  it('flags experience headers: role, company, location', () => {
    expect(isStructuralText('Senior Engineer', data)).toBe(true);
    expect(isStructuralText('Acme', data)).toBe(true);
    expect(isStructuralText('San Francisco, CA', data)).toBe(true);
  });

  it('does not flag body text (summary, bullets, achievements, project descriptions)', () => {
    expect(isStructuralText('Engineer who ships reliable services.', data)).toBe(false);
    expect(isStructuralText('Led the platform migration', data)).toBe(false);
    expect(isStructuralText('Won an internal hackathon', data)).toBe(false);
    expect(isStructuralText('A CLI tool', data)).toBe(false);
  });

  it('does not flag arbitrary text', () => {
    expect(isStructuralText('completely unrelated words', data)).toBe(false);
  });

  it('does not flag skill chips (skills are body text)', () => {
    expect(isStructuralText('SQL', data)).toBe(false);
    expect(isStructuralText('Python', data)).toBe(false);
  });
});

describe('skills are body text (toolbar actions work on skills)', () => {
  const data = fixture();

  it('matches a selected skill chip as body text', () => {
    expect(findBestTextMatch('SQL', data, 'SQL', { bodyTextOnly: true })).not.toBeNull();
  });

  it('toggles bold on a skill inside the stored comma-separated string', () => {
    const next = toggleInlineTag(data, 'SQL', 'strong', 'SQL', { bodyTextOnly: true });
    expect(next.skills).toBe('Python, <strong>SQL</strong>, Kubernetes');
    expect(isTextFormatted('SQL', next, 'strong', 'SQL', { bodyTextOnly: true })).toBe(true);
  });
});

describe('selection toolbar gating (mirrors ResumeWorkspace checks)', () => {
  const data = fixture();

  it('suppresses the toolbar for a date even when the same text appears in a bullet', () => {
    // The date element renders as "Jan 2020"; a bullet also mentions "2020".
    const context = 'Jan 2020';
    expect(isStructuralText(context, data)).toBe(true);
    // Without the structural check, text matching alone would have leaked:
    expect(findBestTextMatch('2020', data, context, { bodyTextOnly: true })).not.toBeNull();
  });

  it('suppresses the toolbar for a role even when it appears in the summary', () => {
    const context = 'Senior Engineer';
    expect(isStructuralText(context, data)).toBe(true);
  });

  it('responds to a full bullet selection', () => {
    const context = 'Led the platform migration';
    expect(isStructuralText(context, data)).toBe(false);
    expect(findBestTextMatch(context, data, undefined, { bodyTextOnly: true })).not.toBeNull();
  });

  it('responds to a word selected inside a bullet', () => {
    const context = 'Led the platform migration';
    expect(findBestTextMatch('migration', data, context, { bodyTextOnly: true })).not.toBeNull();
  });

  it('preserves inline tags outside the edited region (applyPlainEdit)', () => {
    expect(applyPlainEdit('<strong>Led</strong> the launch', 'Led the launch', 'Led the release')).toBe(
      '<strong>Led</strong> the release',
    );
  });

  it('drops a tag that wrapped the edited region itself', () => {
    expect(applyPlainEdit('<strong>Led</strong> the launch', 'Led the launch', 'Directed the launch')).toBe(
      'Directed the launch',
    );
  });

  it('keeps plain strings and identity edits intact', () => {
    expect(applyPlainEdit('Python, SQL', 'Python, SQL', 'Python, Pyscript')).toBe('Python, Pyscript');
    expect(applyPlainEdit('same text', 'same text', 'same text')).toBe('same text');
    expect(stripInlineTags('<em>a</em> b')).toBe('a b');
  });

  it('suppresses the toolbar for a combined header line (role + company + dates)', () => {
    // Templates that render the whole entry header in one element produce a
    // context that is not a single field, so neither the structural match nor
    // the body-text match fires.
    const context = 'Senior Engineer - Acme, San Francisco  Jan 2020 - Present';
    expect(isStructuralText(context, data)).toBe(false);
    expect(findBestTextMatch(context, data, undefined, { bodyTextOnly: true })).toBeNull();
  });
});

describe('tagged fields (after Bold/Italic/Link was applied)', () => {
  const data: ResumeData = {
    ...fixture(),
    summary: 'A brief <strong>professional summary</strong> highlighting your key strengths.',
  };

  it('matches a plain word selected after a tag (context = whole tagged field)', () => {
    const m = findBestTextMatch('highlighting', data, 'A brief professional summary highlighting your key strengths.', {
      bodyTextOnly: true,
    });
    expect(m).not.toBeNull();
    expect(m?.path).toBe('summary');
  });

  it('passes the context check the workspace runs (full plain field text vs tagged stored)', () => {
    const context = 'A brief professional summary highlighting your key strengths.';
    expect(findBestTextMatch(context, data, undefined, { bodyTextOnly: true })).not.toBeNull();
  });

  it('matches a selection that crosses a tag boundary and maps raw offsets', () => {
    const m = findBestTextMatch('summary highlighting', data, 'A brief professional summary highlighting your key strengths.', {
      bodyTextOnly: true,
    });
    expect(m).not.toBeNull();
    expect(m?.via).toBe('stored');
    // The raw span must include the closing tag that sits between the two words.
    expect(m?.span).toBe('summary</strong> highlighting');
  });

  it('bolds a plain word after a tag without disturbing the existing tag', () => {
    const next = toggleInlineTag(data, 'highlighting', 'strong', 'A brief professional summary highlighting your key strengths.', {
      bodyTextOnly: true,
    });
    expect(next.summary).toBe('A brief <strong>professional summary</strong> <strong>highlighting</strong> your key strengths.');
  });

  it('bolds a selection that crosses a tag boundary, preserving the inner tag', () => {
    const next = toggleInlineTag(data, 'summary highlighting', 'em', 'A brief professional summary highlighting your key strengths.', {
      bodyTextOnly: true,
    });
    // The raw span includes the closing </strong> that sits between the words, so
    // the <em> wraps it — the browser resolves the crossed nesting and the
    // original strong on "summary" survives.
    expect(next.summary).toBe('A brief <strong>professional <em>summary</strong> highlighting</em> your key strengths.');
  });
});

describe('repeated spans (the same words appearing twice in one field)', () => {
  // "Led projects and " precedes the SECOND "led" (it starts at offset 17).
  const data: ResumeData = {
    ...fixture(),
    summary: 'Led projects and led teams to ship software.',
  };
  const context = 'Led projects and led teams to ship software.';

  it('matches the FIRST occurrence by default (no selection offset)', () => {
    const m = findBestTextMatch('Led', data, context, { bodyTextOnly: true });
    expect(m?.span).toBe('Led');
    expect(m?.start).toBe(0);
  });

  it('matches the SECOND occurrence when the DOM selection offset points there', () => {
    const m = findBestTextMatch('led', data, context, { bodyTextOnly: true, selectionOffset: 17 });
    expect(m?.span).toBe('led');
    expect(m?.start).toBe(17);
  });

  it('bolds only the selected (second) occurrence', () => {
    const next = toggleInlineTag(data, 'led', 'strong', context, { bodyTextOnly: true, selectionOffset: 17 });
    expect(next.summary).toBe('Led projects and <strong>led</strong> teams to ship software.');
  });

  it('replaces only the selected (second) occurrence on paste', () => {
    const next = replaceSelectedText(data, 'led', 'mentored', context, { bodyTextOnly: true, selectionOffset: 17 });
    expect(next.summary).toBe('Led projects and mentored teams to ship software.');
  });
});

describe('format state is positional (per occurrence, like Word)', () => {
  it('reports the first of two bolded words as formatted, the second as not', () => {
    const data: ResumeData = {
      ...fixture(),
      summary: '<strong>Led</strong> projects and led teams to ship software.',
    };
    const context = 'Led projects and led teams to ship software.';
    // First "Led" is bolded.
    expect(isTextFormatted('Led', data, 'strong', context, { bodyTextOnly: true, selectionOffset: 0 })).toBe(true);
    // Second "led" is plain — Bold must offer to ADD bold, not remove it.
    expect(isTextFormatted('led', data, 'strong', context, { bodyTextOnly: true, selectionOffset: 17 })).toBe(false);
  });

  it('removes bold from only the second of two bolded words', () => {
    const data: ResumeData = {
      ...fixture(),
      summary: '<strong>Led</strong> projects and <strong>led</strong> teams to ship software.',
    };
    const context = 'Led projects and led teams to ship software.';
    const next = toggleInlineTag(data, 'led', 'strong', context, { bodyTextOnly: true, selectionOffset: 17 });
    expect(next.summary).toBe('<strong>Led</strong> projects and led teams to ship software.');
  });
});

describe('line breaks from Enter / multi-line paste', () => {
  it('applyPlainEdit keeps a newline introduced mid-field', () => {
    expect(applyPlainEdit('Led the migration', 'Led the migration', 'Led the\nmigration')).toBe('Led the\nmigration');
  });

  it('applyPlainEdit preserves tags outside a region that gained a newline', () => {
    expect(applyPlainEdit('<strong>Led</strong> the migration', 'Led the migration', 'Led the\nmigration')).toBe(
      '<strong>Led</strong> the\nmigration',
    );
  });
});

describe('legacy string descriptions (newline-separated bullets)', () => {
  function stringFixture(): ResumeData {
    return {
      ...fixture(),
      experience: [
        {
          ...fixture().experience[0],
          // Legacy format: one newline-separated string, NOT an array.
          description: 'Led the platform migration\nCut infra costs 20% in 2020',
        },
      ],
      keyAchievements: 'Won an internal hackathon\nShipped the Q3 release',
    };
  }

  it('buildTextCandidates emits ONE candidate per line with the correct index (not .0 for every bullet)', () => {
    const data = stringFixture();
    const cands = buildTextCandidates(data);
    const desc = cands.filter((c) => c.path.startsWith('experience.0.description.'));
    expect(desc.map((c) => c.path)).toEqual(['experience.0.description.0', 'experience.0.description.1']);
    expect(desc.map((c) => c.stored)).toEqual(['Led the platform migration', 'Cut infra costs 20% in 2020']);
  });

  it('keyAchievements string also emits per-line candidates', () => {
    const cands = buildTextCandidates(stringFixture());
    const ka = cands.filter((c) => c.path.startsWith('keyAchievements.'));
    expect(ka.map((c) => c.path)).toEqual(['keyAchievements.0', 'keyAchievements.1']);
  });

  it('findBestTextMatch maps a second-line bullet to its exact line', () => {
    const data = stringFixture();
    const m = findBestTextMatch('Cut infra costs', data, 'Cut infra costs 20% in 2020', { bodyTextOnly: true });
    expect(m).not.toBeNull();
    expect(m?.path).toBe('experience.0.description.1');
  });

  it('setTextAtPath upgrades a legacy string field to an array when writing a line (no TypeError)', () => {
    const data = stringFixture();
    const next = setTextAtPath(data, 'experience.0.description.1', (old) => old + ' (Q1)');
    const desc = next.experience[0].description;
    expect(Array.isArray(desc)).toBe(true);
    expect(desc).toEqual(['Led the platform migration', 'Cut infra costs 20% in 2020 (Q1)']);
  });

  it('setTextAtPath leaves non-numeric (string) paths untouched', () => {
    const data = stringFixture();
    const next = setTextAtPath(data, 'summary', (old) => old + '!');
    expect(typeof next.experience[0].description).toBe('string');
    expect(next.summary).toBe('Engineer who ships reliable services.!');
  });

  it('parseDescriptionBullets strips bullet markers from array elements (parity with strings)', () => {
    expect(parseDescriptionBullets(['• Led the migration', '- Cut costs', 'Plain line'])).toEqual([
      'Led the migration',
      'Cut costs',
      'Plain line',
    ]);
    expect(parseDescriptionBullets('Led the migration\n• Cut costs')).toEqual(['Led the migration', 'Cut costs']);
  });

  it('toggleInlineTag on a second-line bullet of a string field edits only that line', () => {
    const data = stringFixture();
    const next = toggleInlineTag(data, 'Cut infra costs', 'strong', 'Cut infra costs 20% in 2020', {
      bodyTextOnly: true,
    });
    expect(Array.isArray(next.experience[0].description)).toBe(true);
    expect(next.experience[0].description).toEqual([
      'Led the platform migration',
      '<strong>Cut infra costs</strong> 20% in 2020',
    ]);
  });

  it('replaceSelectedText modifies ONLY the targeted bullet and does not merge other bullets', () => {
    const data = fixture();
    // Initially has 2 bullets: ['Led the platform migration', 'Cut infra costs 20% in 2020']
    const origBullet = 'Led the platform migration';
    const rewrittenBullet = 'Spearheaded comprehensive cloud infrastructure platform migration to Kubernetes, elevating system reliability to 99.99%.';
    
    const updated = replaceSelectedText(
      data,
      origBullet,
      rewrittenBullet,
      origBullet,
      { bodyTextOnly: true }
    );

    expect(Array.isArray(updated.experience[0].description)).toBe(true);
    const bullets = updated.experience[0].description as string[];
    expect(bullets.length).toBe(2);
    expect(bullets[0]).toBe(rewrittenBullet);
    expect(bullets[1]).toBe('Cut infra costs 20% in 2020');
  });

  it('replaceSelectedText on a bullet in bullet-symbol-delimited string modifies only that bullet and preserves separate bullets', () => {
    const data: ResumeData = {
      ...fixture(),
      experience: [
        {
          ...fixture().experience[0],
          description: '• Spearheaded API redesign • Decreased memory consumption by 35% • Mentored 4 engineers',
        },
      ],
    };

    const origBullet = 'Decreased memory consumption by 35%';
    const expandedBullet = 'Decreased production server memory consumption by 35% by implementing efficient LRU caching and garbage collection profiling.';

    const updated = replaceSelectedText(
      data,
      origBullet,
      expandedBullet,
      origBullet,
      { bodyTextOnly: true }
    );

    expect(Array.isArray(updated.experience[0].description)).toBe(true);
    const bullets = updated.experience[0].description as string[];
    expect(bullets.length).toBe(3);
    expect(bullets[0]).toBe('Spearheaded API redesign');
    expect(bullets[1]).toBe(expandedBullet);
    expect(bullets[2]).toBe('Mentored 4 engineers');
  });
});

