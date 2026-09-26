import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import { ResumeData, TemplateType } from '../types';
import { getPageSizeConfig } from '../utils/pageSizeConfig';
import { getMarginVerticalIn, readSkillsGrid, placeCaretInSkillCell, appendEmptySkillCell } from '../utils/templateUtils';
import VanguardTemplate from './templates/VanguardTemplate';
import ElevateResume from './templates/ElevateResume';
import PrimeProfile from './templates/PrimeProfile';
import ImpactTemplate from './templates/ImpactTemplate';
import FreeTemplate from './templates/FreeTemplate';
import SimpleProTemplate from './templates/SimpleProTemplate';
import DevTemplate from './templates/DevTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ApexTemplate from './templates/ApexTemplate';
import WonsultingTemplate from './templates/WonsultingTemplate';
import StyledTemplate from './templates/StyledTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import TimesTemplate from './templates/TimesTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import FreshGradTemplate from './templates/FreshGradTemplate';
import FreshGrad8Template from './templates/FreshGrad8Template';
import SageTemplate from './templates/SageTemplate';
import ReziTemplate from './templates/ReziTemplate';
import StudentTemplate from './templates/StudentTemplate';

// The sheets' content is injected via dangerouslySetInnerHTML. React diffs that
// prop by OBJECT IDENTITY, so passing a fresh `{ __html }` literal on every
// render would re-set innerHTML (from stale pagesHtml) and destroy any in-flight
// DOM edits — text the user typed but the debounced write-back hasn't committed
// yet. Memoizing the object per htmlString means a re-render that doesn't change
// the pages leaves the DOM (and the user's caret/keystrokes) completely alone.
function PageSheetContent({ html }: { html: string }) {
  const htmlProp = useMemo(() => ({ __html: html }), [html]);
  return <div dangerouslySetInnerHTML={htmlProp} className="w-full h-full" />;
}

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
  onChangeData?: (newData: ResumeData) => void;
  /**
   * When true the page sheets are contentEditable and blur writes the DOM's
   * summary/skills back into `data`. Defaults to true to preserve the classic
   * editor's behavior; the agent workspace opts out and passes onDomBlur.
   */
  editable?: boolean;
  /**
   * When provided (and editable), blur hands the edited sheet element to the
   * caller instead of running ResumePreview's own summary/skills-only write-back.
   * Used by the resume agent workspace to sync every edited field back into
   * ResumeData in place (no modal).
   */
  onDomBlur?: (sheet: HTMLElement) => void;
  /** Fires on contentEditable input so the caller can debounce a live write-back. */
  onDomInput?: (sheet: HTMLElement) => void;
  /**
   * When true (agent workspace), the page slicer keeps the CURRENT sheet DOM
   * untouched and stashes the freshly sliced pages instead of re-injecting
   * them. Re-injection resumes once the flag flips back to false (blur, or
   * right after a live write-back commits). Without this, the re-inject that
   * follows every data change wipes any keystrokes that landed between the last
   * write-back and the re-render — the debounced write-back then reads the
   * re-injected DOM, so the lost text never comes back.
   */
  editHold?: boolean;
  /**
   * Fired synchronously (layout phase) right after the page sheets were
   * re-injected from the freshly sliced pages. The agent workspace uses it to
   * rebuild its DOM→field map against the NEW sheet nodes in the same commit,
   * so a write-back can never read detached nodes. Without this the map goes
   * stale on every re-inject (the `data`/`template` effect does not re-run for
   * editHold-only re-slices) and typed text silently stops persisting.
   */
  onSheetsReinjected?: () => void;
  /**
   * Called when Enter is pressed inside a non-skills bullet <li>. The workspace
   * handles the actual data split (splicing the description array) so the
   * re-render produces two <li> elements with correct bullet markers.
   */
  onBulletEnter?: (sheet: HTMLElement) => void;
  /**
   * Called when Backspace is pressed at the start of a non-skills bullet <li>.
   * The workspace merges or deletes the bullet in ResumeData.
   */
  /**
   * Called when Enter or Tab is pressed inside a skills grid <li>.
   */
  onSkillEnter?: (sheet: HTMLElement, cell: HTMLElement, dir?: 1 | -1) => void;
  /**
   * Called when Backspace is pressed inside an empty skills grid <li>.
   */
  onSkillBackspace?: (sheet: HTMLElement, cell: HTMLElement) => void;
}

// The next cell in row-major order (direction 1) or the previous one (-1), or
// null at the grid's edges.
const nextSkillCell = (current: HTMLElement, direction: 1 | -1): HTMLElement | null => {
  const grid = current.closest('[data-skills-grid]');
  if (!grid) return null;
  const cells = Array.from(grid.querySelectorAll<HTMLElement>('li[data-skill-cell]'));
  const idx = cells.indexOf(current);
  if (direction === 1) return cells[idx + 1] ?? null;
  return idx > 0 ? cells[idx - 1] : null;
};

export default function ResumePreview({ data, template, onChangeData, editable = true, onDomBlur, onDomInput, editHold = false, onSheetsReinjected, onBulletEnter, onBulletBackspace, onSkillEnter, onSkillBackspace }: ResumePreviewProps) {
  // Helper to format skills from all-caps to title case (except acronyms)
  const formatSkillCase = (skill: string): string => {
    const trimmed = skill.trim();
    if (!trimmed) return '';
    const acronyms = new Set([
      'HTML', 'CSS', 'JS', 'UI', 'UX', 'AI', 'ML', 'SQL', 'REST', 'API', 'AWS', 
      'GCP', 'SEO', 'QA', 'CI', 'CD', 'SDK', 'JSON', 'XML', 'GIT', 'HTML5', 
      'CSS3', 'SASS', 'PHP', 'VPS', 'CMS', 'RESTFUL', 'IP', 'DNS'
    ]);
    
    return trimmed
      .split(/(\s+|-|\/|\.)/)
      .map(word => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return word;
        
        // If it's a known acronym (case-insensitive), render it in uppercase
        if (acronyms.has(trimmedWord.toUpperCase())) {
          return trimmedWord.toUpperCase();
        }
        
        // If the word is entirely uppercase and has length > 1, title-case it
        if (trimmedWord === trimmedWord.toUpperCase() && trimmedWord.length > 1) {
          return trimmedWord.charAt(0) + trimmedWord.slice(1).toLowerCase();
        }
        return word;
      })
      .join('');
  };

  const formattedSkills = data.skills
    ? data.skills.split(',').map(s => formatSkillCase(s)).join(', ')
    : '';

  const dataToRender = { ...data, skills: formattedSkills };

  // Centralized Physical Page Size Configuration (A4, Letter, Legal)
  const pageSizeConfig = getPageSizeConfig(dataToRender.pageSize);
  const { widthCss, heightCss, heightMm, id: pageSizeId } = pageSizeConfig;

  const isViewAsPages = dataToRender.viewAsPages ?? true;

  // Vertical page margin in CSS px — drives the sheet's top/bottom padding so
  // content always stops at the same distance from the page edge (like Word's
  // page margins) and never creeps to the bottom before paginating.
  const vMarginPx = Math.max(16, Math.round(getMarginVerticalIn(dataToRender) * 96));

  // Dynamic Font Application. `whiteSpace: pre-line` makes the sheet render the
  // \n the write-back stores for Enter presses and multi-line pastes as REAL line
  // breaks in every template — without it, a raw newline collapses to a space and
  // pressing Enter appears to do nothing. It only changes rendering for text that
  // actually contains \n (normal whitespace collapsing is untouched), so it never
  // disturbs templates that rely on default spacing.
  const containerStyle = {
    fontFamily: data.font || 'Inter, sans-serif',
    fontSize: `${data.fontSizes?.body || 9.5}pt`,
    lineHeight: data.lineHeight || 1.5,
    whiteSpace: 'pre-line' as const,
  };

  const measureRef = useRef<HTMLDivElement>(null);
  const [pagesHtml, setPagesHtml] = useState<string[]>([]);
  // Pages computed while the edit hold was on — applied on the next pass once
  // the hold is released, so the sheets are never rebuilt mid-keystroke.
  const pendingPagesRef = useRef<string[] | null>(null);

  useLayoutEffect(() => {
    if (!measureRef.current) return;

    const root = (measureRef.current.firstElementChild || measureRef.current) as HTMLElement;
    if (!root) return;

    // Tag structural elements in measureRef with data-path attributes before slicing (only if not already tagged by templates)
    try {
      const header = root.querySelector('header') || root.firstElementChild;
      if (header) {
        const h1 = header.querySelector('h1, .name-title');
        if (h1 && !h1.getAttribute('data-path')) h1.setAttribute('data-path', 'fullName');
        const jobP = header.querySelector('p, .job-title');
        if (jobP && !jobP.getAttribute('data-path')) jobP.setAttribute('data-path', 'jobTitle');
      }

      const allSecs = Array.from(root.querySelectorAll('section')) as HTMLElement[];
      allSecs.forEach((sec) => {
        const title = sec.querySelector('h1, h2, h3, h4')?.textContent?.toLowerCase() || '';
        if (title.includes('summary') || title.includes('profile') || title.includes('about')) {
          const p = sec.querySelector('p');
          if (p && !p.getAttribute('data-path')) p.setAttribute('data-path', 'summary');
        } else if (title.includes('achievement') || title.includes('accomplishment')) {
          const lis = Array.from(sec.querySelectorAll('ul li, ol li')) as HTMLElement[];
          lis.forEach((li, j) => {
            if (!li.getAttribute('data-path')) li.setAttribute('data-path', `keyAchievements.${j}`);
          });
        } else if (!title.includes('skill')) {
          let key: string | null = null;
          if (title.includes('project') || title.includes('portfolio') || title.includes('case stud') || title.includes('selected work')) {
            key = 'projects';
          } else if (title.includes('leadership') || title.includes('organization') || title.includes('activity')) {
            key = 'leadership';
          } else if (title.includes('volunteer')) {
            key = 'volunteering';
          } else if (title.includes('publication')) {
            key = 'publications';
          } else if (title.includes('award') || title.includes('honor')) {
            key = 'awards';
          } else if (title.includes('conference') || title.includes('speaking')) {
            key = 'conferencesSpeaking';
          } else if (title.includes('experience') || title.includes('employment') || title.includes('work') || title.includes('career') || title.includes('history')) {
            key = 'experience';
          }

          if (key) {
            const subHeader = sec.querySelector('.section-header') || sec.querySelector('h1, h2, h3, h4');
            let items = Array.from(sec.children).filter((c) => c !== subHeader && !c.contains(subHeader as Node)) as HTMLElement[];
            if (items.length === 1 && items[0].tagName.toLowerCase() === 'div' && !items[0].className.includes('grid')) {
              const inner = Array.from(items[0].children) as HTMLElement[];
              if (inner.length > 0) items = inner;
            }

            items.forEach((item, itemIdx) => {
              const lis = Array.from(item.querySelectorAll('ul li, ol li')) as HTMLElement[];
              lis.forEach((li, j) => {
                if (!li.getAttribute('data-path')) {
                  li.setAttribute('data-path', `${key}.${itemIdx}.description.${j}`);
                }
              });
            });
          }
        }
      });
    } catch (e) {
      // ignore tagging errors
    }

    // Helper functions to get accurate margins and outer heights of elements
    const getVerticalMargin = (el: HTMLElement | null): number => {
      if (!el) return 0;
      try {
        const style = window.getComputedStyle(el);
        const mt = parseFloat(style.marginTop) || 0;
        const mb = parseFloat(style.marginBottom) || 0;
        return mt + mb;
      } catch (e) {
        return 0;
      }
    };

    const getOuterHeight = (el: HTMLElement | null): number => {
      if (!el) return 0;
      try {
        const style = window.getComputedStyle(el);
        const mt = parseFloat(style.marginTop) || 0;
        const mb = parseFloat(style.marginBottom) || 0;
        return (el.offsetHeight || 0) + mt + mb;
      } catch (e) {
        return el.offsetHeight || 0;
      }
    };

    // Convert page dimensions and margins to exact CSS pixels at 96 DPI
    const pageHeightPx = (heightMm / 25.4) * 96;
    // Top + bottom page padding applied on the sheet container — mirrors the
    // vertical page margin (default 0.5in) so content stops with proper spacing
    // at the bottom (and top) before the next block moves to the next page.
    const PAGE_VERTICAL_PAD = vMarginPx;
    const vertPaddingPx = PAGE_VERTICAL_PAD * 2; // Top + Bottom padding
    // Safety buffer (25px) to prevent sub-pixel font measurement overflow slicing
    const maxPageContentPx = Math.max(200, pageHeightPx - vertPaddingPx - 25);

    interface AtomicBlock {
      sectionClass: string;
      sectionStyle: string;
      sectionKey: string;
      entryKey?: string;
      entryClass?: string;
      entryStyle?: string;
      entryHeaderHtml?: string;
      ulClass?: string;
      ulStyle?: string;
      html: string;
      height: number;
      isBullet?: boolean;
      isHeader?: boolean;
    }

    const blocks: AtomicBlock[] = [];
    const headerEl = root.querySelector('header') || root.firstElementChild;
    const isHeaderFirstChild = headerEl === root.firstElementChild;

    const sections = Array.from(root.querySelectorAll('section')) as HTMLElement[];
    const topChildren = Array.from(root.children) as HTMLElement[];

    // Some templates (e.g. Sage) mix <section> and <div> section wrappers. When any
    // <section> exists the slicer uses its section branch, which would silently drop
    // the <div>-wrapped sections. Fold section-like top-level <div>s (a heading or a
    // list, not a header block or a container of real sections) into the set.
    const sectionDivs = topChildren.filter((child): child is HTMLElement => {
      if (sections.includes(child)) return false;
      if (child.tagName.toLowerCase() === 'header') return false;
      if (child.querySelector('h1')) return false; // header-like (the name)
      if (child.querySelector('section')) return false; // container of real sections
      return !!child.querySelector('h2, h3, h4') || !!child.querySelector('ul, ol');
    });
    const allSections = Array.from(new Set([...sections, ...sectionDivs])).sort((a, b) => {
      const position = a.compareDocumentPosition(b);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    if (allSections.length > 0) {
      // 1. Process Header / Non-section top children
      topChildren.forEach((child) => {
        if (child.tagName.toLowerCase() === 'header' || (isHeaderFirstChild && child === headerEl)) {
          blocks.push({
            sectionClass: '',
            sectionStyle: '',
            sectionKey: '',
            html: child.outerHTML,
            height: getOuterHeight(child) || 120,
            isHeader: true,
          });
        }
      });

      // 2. Process Sections with Bullet-Level Granularity (Natural Flow)
      allSections.forEach((sec, secIndex) => {
        const secClass = sec.className;
        const secStyle = sec.getAttribute('style') || '';
        const secKey = `sec-${secIndex}`;

        const subHeader = sec.querySelector('.section-header') || sec.querySelector('h1, h2, h3, h4');
        const children = Array.from(sec.children) as HTMLElement[];
        const headerElement = subHeader ? children.find((c) => c === subHeader || c.contains(subHeader)) : null;
        let items = children.filter((c) => c !== headerElement);

        const isSkillsSection = sec.className.includes('skills') || (subHeader && subHeader.textContent?.toLowerCase().includes('skills'));

        // If items are wrapped in a single container div, unpack it (but not if it's the skills section or layout grid)
        if (
          items.length === 1 &&
          items[0].tagName.toLowerCase() === 'div' &&
          !isSkillsSection &&
          !items[0].className.includes('grid')
        ) {
          const innerChildren = Array.from(items[0].children) as HTMLElement[];
          if (innerChildren.length > 0) {
            items = innerChildren;
          }
        }

        if (headerElement && items.length > 0) {
          let isFirstItemInSection = true;

          items.forEach((item, itemIdx) => {
            const ul = item.querySelector('ul, ol');
            const nonUlChildren = ul ? (Array.from(item.children).filter((c) => c !== ul) as HTMLElement[]) : [];
            const bullets = ul ? (Array.from(ul.children) as HTMLElement[]) : [];

            if (nonUlChildren.length > 0 && bullets.length > 0) {
              const itemClass = item.className;
              const itemStyle = item.getAttribute('style') || '';
              const ulClass = ul.className;
              const ulStyle = ul.getAttribute('style') || '';
              const entryKey = `${secKey}-item-${itemIdx}`;

              const combinedHeaderHtml = nonUlChildren.map((c) => c.outerHTML).join('');
              const totalHeaderHeight = nonUlChildren.reduce((sum, c) => sum + (getOuterHeight(c) || 0), 0);

              const entryHeaderHtml = isFirstItemInSection
                ? headerElement.outerHTML + combinedHeaderHtml
                : combinedHeaderHtml;

              const secMargin = getVerticalMargin(sec);
              const entryMargin = getVerticalMargin(item);

              bullets.forEach((bullet, b) => {
                const isFirstBulletInEntry = b === 0;
                const bulletHeight = getOuterHeight(bullet) || 25;
                const totalHeight = isFirstBulletInEntry
                  ? (isFirstItemInSection ? getOuterHeight(headerElement) + secMargin : 0) +
                    totalHeaderHeight +
                    entryMargin +
                    bulletHeight
                  : bulletHeight;

                blocks.push({
                  sectionClass: secClass,
                  sectionStyle: secStyle,
                  sectionKey: secKey,
                  entryKey: entryKey,
                  entryClass: itemClass,
                  entryStyle: itemStyle,
                  entryHeaderHtml: isFirstBulletInEntry ? entryHeaderHtml : undefined,
                  ulClass: ulClass,
                  ulStyle: ulStyle,
                  html: bullet.outerHTML,
                  height: totalHeight,
                  isBullet: true,
                });
              });

              isFirstItemInSection = false;
            } else {
              // Non-bullet entry
              const itemHtml = item.outerHTML;
              const combinedHtml = isFirstItemInSection ? headerElement.outerHTML + itemHtml : itemHtml;
              const secMargin = getVerticalMargin(sec);
              const combinedHeight = isFirstItemInSection
                ? getOuterHeight(headerElement) + getOuterHeight(item) + secMargin
                : getOuterHeight(item);

              blocks.push({
                sectionClass: secClass,
                sectionStyle: secStyle,
                sectionKey: secKey,
                html: combinedHtml,
                height: combinedHeight,
                isBullet: false,
              });

              isFirstItemInSection = false;
            }
          });
        } else {
          // Single atomic section (Summary, Skills, etc.)
          blocks.push({
            sectionClass: '',
            sectionStyle: '',
            sectionKey: '',
            html: sec.outerHTML,
            height: getOuterHeight(sec) || 60,
            isBullet: false,
          });
        }
      });
    } else {
      // Fallback for custom layouts
      topChildren.forEach((child) => {
        blocks.push({
          sectionClass: '',
          sectionStyle: '',
          sectionKey: '',
          html: child.outerHTML,
          height: getOuterHeight(child) || 60,
          isBullet: false,
        });
      });
    }

    // Bucket blocks into pages
    interface PageBucket {
      blocks: AtomicBlock[];
    }

    const pages: PageBucket[] = [{ blocks: [] }];
    let currentPageIndex = 0;
    let currentHeight = 0;

    blocks.forEach((block) => {
      const isNewEntry = !!block.entryHeaderHtml;
      // If adding this block exceeds page height, or if this block starts a new entry (role/company)
      // and remaining height is too tight (< 20px safety buffer), move cleanly to next page so
      // job titles are never chopped or orphaned at the bottom margin.
      const shouldBreak = currentHeight > 0 && (
        currentHeight + block.height > maxPageContentPx ||
        (isNewEntry && currentHeight + block.height > maxPageContentPx - 20)
      );

      if (shouldBreak && currentPageIndex < 4) {
        currentPageIndex++;
        pages[currentPageIndex] = { blocks: [block] };
        currentHeight = block.height;
      } else {
        pages[currentPageIndex].blocks.push(block);
        currentHeight += block.height;
      }
    });

    const rootClass = root.className;
    // Strip vertical padding from the template root style — the page sheet container
    // applies its own top/bottom padding (the vertical page margin) so we keep only
    // horizontal padding + other props. Handles both the longhand paddings and the
    // shorthand `padding: X` the browser may serialize (e.g. "padding: 0.5in"),
    // which otherwise survives and double-pads the bottom past the page limit.
    const rawRootStyle = root.getAttribute('style') || '';
    const rootStyle = (() => {
      let s = rawRootStyle;
      const shorthand = s.match(/padding\s*:\s*([^;]+);?/i);
      if (shorthand) {
        const parts = shorthand[1].trim().split(/\s+/).map(v => v.trim()).filter(Boolean);
        let left = '';
        let right = '';
        if (parts.length === 1) { left = right = parts[0]; }
        else if (parts.length === 2) { left = right = parts[1]; }
        else if (parts.length === 3) { left = right = parts[1]; }
        else if (parts.length === 4) { right = parts[1]; left = parts[3]; }
        if (left && right) {
          s = s.replace(shorthand[0], `padding-left: ${left}; padding-right: ${right};`);
        }
      }
      return s
        .replace(/padding-top\s*:[^;]+;?/gi, '')
        .replace(/paddingTop\s*:[^;]+;?/gi, '')
        .replace(/padding-bottom\s*:[^;]+;?/gi, '')
        .replace(/paddingBottom\s*:[^;]+;?/gi, '');
    })();

    // Reconstruct DOM for each page sheet while preserving section and list wrappers
    const formattedPages = pages.map((page) => {
      let contentHtml = '';
      let activeSecClass: string | null = null;
      let activeSecStyle: string | null = null;
      let activeSecKey: string | null = null;
      let activeSecBlocks: string[] = [];

      const flushSection = () => {
        if (activeSecBlocks.length > 0) {
          if (activeSecClass !== null) {
            contentHtml += `<section class="${activeSecClass}" style="${activeSecStyle}">${activeSecBlocks.join('')}</section>`;
          } else {
            contentHtml += activeSecBlocks.join('');
          }
          activeSecBlocks = [];
        }
      };

      let activeEntryKey: string | null = null;
      let activeEntryClass: string | null = null;
      let activeEntryStyle: string | null = null;
      let activeEntryHeaderHtml: string | null = null;
      let activeUlClass: string | null = null;
      let activeUlStyle: string | null = null;
      let activeBulletBlocks: string[] = [];

      const flushEntryBullets = () => {
        if (activeBulletBlocks.length > 0) {
          const headerHtml = activeEntryHeaderHtml || '';
          const ulHtml = `<ul class="${activeUlClass || ''}" style="${activeUlStyle || ''}">${activeBulletBlocks.join('')}</ul>`;
          const entryHtml = `<div class="${activeEntryClass || ''}" style="${activeEntryStyle || ''}">${headerHtml}${ulHtml}</div>`;
          activeSecBlocks.push(entryHtml);
          activeBulletBlocks = [];
          activeEntryHeaderHtml = null;
          activeEntryKey = null;
        }
      };

      page.blocks.forEach((blk) => {
        if (blk.isBullet) {
          if (blk.sectionKey !== '' && blk.sectionKey === activeSecKey && blk.entryKey && blk.entryKey === activeEntryKey) {
            activeBulletBlocks.push(blk.html);
          } else {
            flushEntryBullets();
            if (blk.sectionKey !== activeSecKey) {
              flushSection();
              activeSecClass = blk.sectionClass;
              activeSecStyle = blk.sectionStyle;
              activeSecKey = blk.sectionKey;
            }
            activeEntryKey = blk.entryKey || null;
            activeEntryClass = blk.entryClass || '';
            activeEntryStyle = blk.entryStyle || '';
            activeEntryHeaderHtml = blk.entryHeaderHtml || '';
            activeUlClass = blk.ulClass || '';
            activeUlStyle = blk.ulStyle || '';
            activeBulletBlocks.push(blk.html);
          }
        } else {
          flushEntryBullets();

          if (blk.sectionKey !== '') {
            if (blk.sectionKey === activeSecKey) {
              activeSecBlocks.push(blk.html);
            } else {
              flushSection();
              activeSecClass = blk.sectionClass;
              activeSecStyle = blk.sectionStyle;
              activeSecKey = blk.sectionKey;
              activeSecBlocks.push(blk.html);
            }
          } else {
            flushSection();
            activeSecClass = null;
            activeSecStyle = null;
            activeSecKey = null;
            contentHtml += blk.html;
          }
        }
      });

      flushEntryBullets();
      flushSection();

      return `<div class="${rootClass}" style="${rootStyle}">${contentHtml}</div>`;
    });

    // Never rebuild the sheets out from under a user who is mid-edit: while the
    // edit hold is on, stash the freshly sliced pages and leave the DOM alone.
    // The sheets are re-injected on the next pass with the hold released (blur,
    // or right after a live write-back commits), by which time the write-back
    // has captured every keystroke.
    if (editHold) {
      pendingPagesRef.current = formattedPages;
      return;
    }
    pendingPagesRef.current = null;
    setPagesHtml(formattedPages);
  }, [data, template, pageSizeId, heightMm, editHold]);

  // The sheets were just re-injected (or initially built) from `pagesHtml` —
  // tell the caller synchronously, in this same layout pass, so it can rebuild
  // its DOM→field map against the nodes the user will actually see and type
  // into. Runs after the innerHTML commit, before paint.
  useLayoutEffect(() => {
    onSheetsReinjected?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesHtml]);

  // Intercept Enter/Tab while the caret is inside a skills-grid cell so the
  // skills section behaves like a Word table (next cell horizontally, wrapping
  // rows) instead of inserting stray newlines inside a single bullet.
  const handleSheetKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!editable) return;
    if (e.isComposing) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const node = sel.anchorNode;
    if (!node) return;
    const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    const cell = (el as HTMLElement | null)?.closest?.('li[data-skill-cell]') as HTMLElement | null;

    // Skills grid: Word-table navigation (next cell, wrap rows, append at the end).
    if (cell && ((e.key === 'Enter' && !e.shiftKey) || e.key === 'Tab')) {
      e.preventDefault();
      const dir = e.key === 'Tab' && e.shiftKey ? -1 : 1;
      if (onSkillEnter) {
        onSkillEnter(e.currentTarget, cell, dir);
        return;
      }
      const next = nextSkillCell(cell, dir);
      if (next) {
        placeCaretInSkillCell(next, true);
        return;
      }
      if (dir === 1) {
        const sheetEl = e.currentTarget;
        if (onDomInput) {
          sheetEl.dispatchEvent(new CustomEvent('skills-append-flush', { bubbles: true }));
        }
        setTimeout(() => {
          if (!sheetEl.isConnected) return;
          const grid = sheetEl.querySelector('[data-skills-grid]');
          if (grid) {
            const newCell = appendEmptySkillCell(grid as HTMLElement);
            placeCaretInSkillCell(newCell, true);
          }
        }, 0);
        return;
      }
      return;
    }

    // Skills grid Backspace: delete empty cell and return to previous skill cell
    if (cell && e.key === 'Backspace' && !e.shiftKey) {
      const cellTextEl = (cell.querySelector('.flex-1') || cell) as HTMLElement;
      const rawContent = (cellTextEl.textContent || '').replace(/\u00A0/g, '').trim();

      if (rawContent === '') {
        if (onSkillBackspace) {
          e.preventDefault();
          onSkillBackspace(e.currentTarget, cell);
          return;
        }
        const prev = nextSkillCell(cell, -1);
        if (prev) {
          e.preventDefault();
          cell.remove();
          placeCaretInSkillCell(prev, false);
          if (onDomInput) {
            e.currentTarget.dispatchEvent(new InputEvent('input', { bubbles: true }));
          }
          return;
        }
      }
    }

    // Bullet-list Enter / Backspace:
    if (e.key === 'Enter' && !e.shiftKey) {
      const anchorEl = (el as HTMLElement | null);
      const bulletLi = anchorEl?.closest?.('li:not([data-skill-cell])') as HTMLElement | null;
      if (bulletLi) {
        const parentList = bulletLi.closest('ul, ol') as HTMLElement | null;
        if (parentList && !parentList.hasAttribute('data-skills-grid') && onBulletEnter) {
          e.preventDefault();
          onBulletEnter(e.currentTarget);
          return;
        }
      }
    }

    if (e.key === 'Backspace') {
      const anchorEl = (el as HTMLElement | null);
      const bulletLi = anchorEl?.closest?.('li:not([data-skill-cell])') as HTMLElement | null;
      if (bulletLi) {
        const parentList = bulletLi.closest('ul, ol') as HTMLElement | null;
        if (parentList && !parentList.hasAttribute('data-skills-grid') && onBulletBackspace) {
          // Check if selection is collapsed and caret is at offset 0 of bulletLi
          if (sel.isCollapsed) {
            const walker = document.createTreeWalker(bulletLi, NodeFilter.SHOW_TEXT);
            let offsetInLi = 0;
            let foundAnchor = false;
            while (walker.nextNode()) {
              const t = walker.currentNode as Text;
              if (t.parentElement?.hasAttribute('data-bullet')) continue;
              if (t === sel.anchorNode) {
                offsetInLi += sel.anchorOffset;
                foundAnchor = true;
                break;
              }
              offsetInLi += t.data.length;
            }
            if (foundAnchor && offsetInLi === 0) {
              e.preventDefault();
              onBulletBackspace(e.currentTarget);
              return;
            }
          }
        }
      }
    }

    // Word-style line break: pressing Enter anywhere else inserts a <br> (which
    // moves the caret to the next line immediately in the editor) instead of the
    // browser's <div> wrapper soup. The write-back converts the <br> to a \n,
    // which the sheet's white-space: pre-line renders as a line break again
    // after the re-render — so Enter always visibly moves to the next line.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const br = document.createElement('br');
      range.insertNode(br);
      const after = document.createRange();
      after.setStartAfter(br);
      after.collapse(true);
      sel.removeAllRanges();
      sel.addRange(after);
      e.currentTarget.dispatchEvent(
        new InputEvent('input', { bubbles: true, inputType: 'insertLineBreak', data: '\n' }),
      );
    }
  };

  // Microsoft-Word-style paste: insert the clipboard as PLAIN TEXT at the
  // caret (replacing any selection), instead of letting the browser inject its
  // rich-HTML paste (spans, fonts, divs) into the resume sheet. The pasted text
  // keeps its line breaks (\n), which the write-back preserves and templates
  // render as line breaks / spaces — so "line one\nline two" never becomes
  // "line oneline two".
  const handleSheetPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!editable) return;
    e.preventDefault();
    const raw = e.clipboardData ? e.clipboardData.getData('text/plain') : '';
    if (!raw) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    // Skill cells are single-line inventory entries: collapse pasted line
    // breaks to spaces so a multi-line paste can't inject \n into one cell.
    const anchorEl = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? (range.startContainer as HTMLElement)
      : (range.startContainer as Text).parentElement;
    const inSkillCell = !!anchorEl?.closest?.('li[data-skill-cell]');
    const clean = (inSkillCell ? raw.replace(/\r\n?/g, '\n').replace(/\n+/g, ' ') : raw.replace(/\r\n?/g, '\n'))
      // Strip control characters a rich paste can smuggle in (they render as
      // invisible junk and corrupt the stored text).
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    if (!clean) return;

    range.deleteContents();
    const node = document.createTextNode(clean);
    range.insertNode(node);
    // Caret goes right after the pasted text, like Word.
    const after = document.createRange();
    after.setStartAfter(node);
    after.collapse(true);
    sel.removeAllRanges();
    sel.addRange(after);

    // Let the debounced live write-back commit the paste (same path as typing).
    e.currentTarget.dispatchEvent(
      new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste', data: clean }),
    );
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!editable) return;
    if (onDomBlur) {
      onDomBlur(e.currentTarget);
      return;
    }
    if (!onChangeData) return;
    const container = e.currentTarget as HTMLElement;
    const next = { ...data };

    // Extract summary
    const summaryHeader = Array.from(container.querySelectorAll<HTMLElement>('h2, h3')).find(
      (el) => el.textContent?.toLowerCase().includes('summary')
    );
    if (summaryHeader) {
      const summaryParent = summaryHeader.closest('section') || summaryHeader.parentElement;
      const p = summaryParent?.querySelector('p');
      if (p && p.textContent) next.summary = p.textContent.trim();
    }

    // Extract skills — templates with a row-major skills grid are read cell by
    // cell in DOM order (inline tags preserved, new cells included). Other
    // templates fall back to the li texts inside the skills section.
    const gridSkills = readSkillsGrid(container);
    if (gridSkills !== null) {
      next.skills = gridSkills;
    } else {
      const skillsHeader = Array.from(container.querySelectorAll<HTMLElement>('h2, h3')).find(
        (el) => el.textContent?.toLowerCase().includes('skill')
      );
      if (skillsHeader) {
        const skillsParent = skillsHeader.closest('section') || skillsHeader.parentElement;
        const liElements = Array.from(skillsParent?.querySelectorAll('li') || []);
        if (liElements.length > 0) {
          next.skills = liElements.map((li) => li.textContent?.trim()).filter(Boolean).join(', ');
        }
      }
    }

    onChangeData(next);
  };

  const renderTemplate = (renderData: ResumeData = dataToRender) => {
    try {
      switch (template) {
        case 'vanguard': return <VanguardTemplate data={renderData} />;
        case 'elevate': return <ElevateResume data={renderData} />;
        case 'prime': return <PrimeProfile data={renderData} />;
        case 'impact': return <ImpactTemplate data={renderData} />;
        case 'free': return <FreeTemplate data={renderData} />;
        case 'simplepro': return <SimpleProTemplate data={renderData} />;
        case 'dev': return <DevTemplate data={renderData} />;
        case 'modern': return <ModernTemplate data={renderData} />;
        case 'executive': return <ExecutiveTemplate data={renderData} />;
        case 'classic': return <ClassicTemplate data={renderData} />;
        case 'elite':
        case 'apex': return <ApexTemplate data={renderData} />;
        case 'wonsulting': return <WonsultingTemplate data={renderData} />;
        case 'styled': return <StyledTemplate data={renderData} />;
        case 'smart':
        case 'elegant': return <ElegantTemplate data={renderData} />;
        case 'minimalist': return <MinimalistTemplate data={renderData} />;
        case 'professional': return <ProfessionalTemplate data={renderData} />;
        case 'times': return <TimesTemplate data={renderData} />;
        case 'twocolumn': return <TwoColumnTemplate data={renderData} />;
        case 'freshgrad1':
        case 'freshgrad2':
        case 'freshgrad4':
        case 'freshgrad5':
        case 'freshgrad6':
          return <FreshGradTemplate data={renderData} />;
        case 'freshgrad3':
        case 'freshgrad7':
        case 'freshgrad8':
          return <FreshGrad8Template data={renderData} />;
        case 'sage': return <SageTemplate data={renderData} />;
        case 'rezi': return <ReziTemplate data={renderData} />;
        case 'student': return <StudentTemplate data={renderData} />;
        default: return <VanguardTemplate data={renderData} />;
      }
    } catch (e) {
      console.error("Template rendering error:", e);
      return <div className="text-red-500 p-4">Error loading template. Please refresh.</div>;
    }
  };

  // Determine active pages HTML list
  const activePages = isViewAsPages && pagesHtml.length > 0 ? pagesHtml : [];

  return (
    <div
      className="resume-preview-root w-full flex flex-col items-center relative print:pb-0"
      data-bullet-style={data.bulletStyle || 'disc'}
      data-bullet-indent={data.bulletIndent ?? 0}
      style={{
        '--resume-line-height': (data.lineHeight || 1.5).toString(),
        '--resume-bullet-indent': `${data.bulletIndent ?? 0}px`,
      } as React.CSSProperties}
    >
      {/* Offscreen Measurement Container */}
      <div
        ref={measureRef}
        className="absolute top-0 left-0 opacity-0 pointer-events-none -z-50"
        style={{
          ...containerStyle,
          width: widthCss,
          '--resume-bullet-indent': `${data.bulletIndent ?? 0}px`,
        } as React.CSSProperties}
      >
        {renderTemplate()}
      </div>

      {/* Multi-Page Sheets View: Physical Pages with Fixed Dimensions & Workspace Gaps */}
      {activePages.length > 0 ? (
        <div className="flex flex-col items-center w-full space-y-8">
          {activePages.map((htmlString, index) => (
            <div
              key={index}
              contentEditable={editable}
              suppressContentEditableWarning={true}
              onBlur={handleBlur}
              onInput={onDomInput ? (e) => onDomInput(e.currentTarget) : undefined}
              onKeyDown={handleSheetKeyDown}
              onPaste={handleSheetPaste}
              className="resume-page-sheet resume-page bg-white mx-auto relative print:border-0 print:shadow-none print:m-0 outline-none select-text cursor-text"
              style={{
                ...containerStyle,
                width: widthCss,
                height: heightCss,
                minHeight: heightCss,
                maxHeight: heightCss,
                boxSizing: 'border-box',
                overflow: 'hidden',
                paddingTop: `${vMarginPx}px`,
                paddingBottom: `${vMarginPx}px`,
                '--resume-bullet-indent': `${data.bulletIndent ?? 0}px`,
              } as React.CSSProperties}
              title="Click any text directly to type and edit on the page"
            >
              <PageSheetContent html={htmlString} />

              {/* Page Number Badge */}
              <div
                contentEditable={false}
                className="absolute bottom-3 right-4 text-[10px] font-bold text-gray-400 pointer-events-none select-none print:hidden bg-white/80 px-2 py-0.5 rounded"
              >
                Page {index + 1} of {activePages.length}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Single Page Physical Sheet View */
        <div
          contentEditable={editable}
          suppressContentEditableWarning={true}
          onBlur={handleBlur}
          onInput={onDomInput ? (e) => onDomInput(e.currentTarget) : undefined}
          onKeyDown={handleSheetKeyDown}
          onPaste={handleSheetPaste}
          className="resume-page-sheet resume-page bg-white mx-auto relative print:border-0 print:shadow-none print:m-0 outline-none select-text cursor-text"
          style={{
            ...containerStyle,
            width: widthCss,
            height: heightCss,
            minHeight: heightCss,
            maxHeight: heightCss,
            boxSizing: 'border-box',
            overflow: 'hidden',
            paddingTop: `${vMarginPx}px`,
            paddingBottom: `${vMarginPx}px`,
            '--resume-bullet-indent': `${data.bulletIndent ?? 0}px`,
          } as React.CSSProperties}
          title="Click any text directly to type and edit on the page"
        >
          {renderTemplate()}
        </div>
      )}
    </div>
  );
}