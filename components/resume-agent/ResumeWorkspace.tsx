import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Sparkles, Plus, ArrowUpDown, Layout, Wand2, Edit3, Check, X, Send, Loader2, Bold, Italic, Underline, Link2, Copy, ClipboardPaste } from 'lucide-react';
import { ResumeData, TemplateType } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { ResumeChange, JobDescriptionData } from '../../types/resumeAgent';
import ResumePreview from '../ResumePreview';
import {
  findBestTextMatch,
  toggleInlineTag,
  toggleInlineLink,
  replaceSelectedText,
  isTextFormatted,
  isStructuralText,
  buildTextCandidates,
  normalizeText,
  stripInlineTags,
  applyPlainEdit,
  setTextAtPath,
  plainTextWithOffsets,
} from '../../utils/inlineTextFormat';
import { readSkillsGrid, placeCaretInSkillCell, appendEmptySkillCell } from '../../utils/templateUtils';
import { rewriteTextInline, explainTextInline } from '../../services/resumeAgentService';
import { ResumeSectionType } from '../../types/resumeSections';
import { SECTION_REGISTRY, createDefaultSectionOrder } from '../../utils/sectionRegistry';
import AddSectionModal from './AddSectionModal';
import ReorderSectionsModal from './ReorderSectionsModal';
import ResumeAgentToolbar from './ResumeAgentToolbar';
import DesignCustomizationModal from './DesignCustomizationModal';
import BatchBulletImproveModal from './BatchBulletImproveModal';
import { SelectionActionsToolbar, SelectionMode } from './SelectionActionsToolbar';


interface EditableFieldEntry {
  path: string;
  span: string;
  via: 'stored' | 'rendered';
}

// ── Caret preservation across write-back re-renders ───────────────────────────
// The live write-back updates ResumeData, which re-renders the page sheets from
// scratch (dangerouslySetInnerHTML). That rebuild destroys the browser caret, so
// without help it jumps to the top of the document (the header/name). We snapshot
// the caret before the write-back and restore it once the rebuilt field map is in
// place — the map-rebuild effect runs right after the re-render commits.
interface CaretSnapshot {
  kind: 'field' | 'skillCell';
  /** Field path (summary, experience.0.description.2, …) or 'skills'. */
  path: string;
  /** Character offset within the field node's text. */
  offset: number;
  /** Skills grid: index of the cell within the grid (cells share the 'skills' path). */
  cellIndex?: number;
}

/** Character offset of the caret within `container`'s text content. A <br> (the
 *  editor's line break) counts as one character, matching the \n the write-back
 *  stores and the re-rendered sheet renders, so caret offsets survive line
 *  breaks exactly. */
const charOffsetIn = (anchor: Node, anchorOffset: number, container: Node): number => {
  let total = 0;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode;
    if (n.nodeType === Node.TEXT_NODE) {
      // Decorative bullet glyphs (span[data-bullet]) are layout-only, not
      // editable content — never count their text, and never treat them as the
      // caret's anchor (a click on the glyph itself snaps to the text start).
      if (n.parentElement?.hasAttribute('data-bullet')) continue;
      if (n === anchor) return total + anchorOffset;
      total += (n as Text).data.length;
    } else if (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName.toLowerCase() === 'br') {
      // Caret resting on the break itself: it sits AT the break (start of the
      // following line), not one char past it.
      if (n === anchor) return total;
      total += 1;
    }
  }
  return total; // element anchor: treat as end of preceding text
};

/** Snapshot a collapsed caret sitting inside the edited sheet (null otherwise). */
const captureCaret = (sheet: HTMLElement, map: Map<Node, EditableFieldEntry>): CaretSnapshot | null => {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const anchor = sel.anchorNode;
  if (!anchor || !sheet.contains(anchor)) return null;
  const el = anchor.nodeType === Node.ELEMENT_NODE ? (anchor as HTMLElement) : anchor.parentElement;

  // Skills grid cell: restore by cell index (every cell maps to the 'skills' path).
  const cell = el?.closest?.('li[data-skill-cell]') as HTMLElement | null;
  if (cell && cell.closest('[data-skills-grid]')) {
    const grid = cell.closest('[data-skills-grid]') as HTMLElement;
    const cells = Array.from(grid.querySelectorAll<HTMLElement>('li[data-skill-cell]'));
    const idx = cells.indexOf(cell);
    if (idx < 0) return null;
    return { kind: 'skillCell', path: 'skills', cellIndex: idx, offset: charOffsetIn(anchor, sel.anchorOffset, cell) };
  }

  if (!sel.isCollapsed) return null;

  // Field: the closest mapped ancestor owns the caret's location.
  let cur: Element | null = anchor.nodeType === Node.TEXT_NODE ? (anchor as Text).parentElement : (anchor as Element);
  while (cur && cur !== sheet) {
    const entry = map.get(cur);
    if (entry) return { kind: 'field', path: entry.path, offset: charOffsetIn(anchor, sel.anchorOffset, cur) };
    cur = cur.parentElement;
  }
  return null;
};

/** Put the caret at a character offset inside `root`'s text. `<br>` elements are
 *  treated as single positions (like the \n they map to), so a caret captured
 *  against a sheet with line breaks lands on the same line after the re-render. */
const placeCaretAt = (root: Node, offset: number): void => {
  // Count total navigable positions (text chars + <br> elements) to clamp the
  // offset. Using textContent.length would silently drop <br> elements, causing
  // the caret to land short of its target when the node contains line breaks.
  let totalPositions = 0;
  const countWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  while (countWalker.nextNode()) {
    const cn = countWalker.currentNode;
    if (cn.nodeType === Node.TEXT_NODE) {
      if ((cn as Text).parentElement?.hasAttribute('data-bullet')) continue;
      totalPositions += (cn as Text).data.length;
    } else if (cn.nodeType === Node.ELEMENT_NODE && (cn as Element).tagName.toLowerCase() === 'br') {
      totalPositions += 1;
    }
  }
  const target = Math.max(0, Math.min(offset, totalPositions));
  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let acc = 0;
  let placed = false;
  while (walker.nextNode()) {
    const n = walker.currentNode;
    if (n.nodeType === Node.TEXT_NODE) {
      const t = n as Text;
      // Decorative bullet glyphs are layout-only — skip them so an offset of 0
      // (start of the cell's real text) never lands inside the glyph, where
      // typed characters would be dropped by the write-back.
      if (t.parentElement?.hasAttribute('data-bullet')) continue;
      if (acc + t.data.length >= target) {
        range.setStart(t, target - acc);
        range.collapse(true);
        placed = true;
        break;
      }
      acc += t.data.length;
    } else if (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName.toLowerCase() === 'br') {
      // The caret's position sits right at this break: place it just past the
      // break — the start of the new line, mirroring the \n the break maps to.
      if (acc >= target) {
        range.setStartAfter(n);
        range.collapse(true);
        placed = true;
        break;
      }
      acc += 1;
    }
  }
  if (!placed) {
    const textSpan = (root.nodeType === Node.ELEMENT_NODE ? (root as HTMLElement).querySelector?.('.flex-1') : null) || root;
    range.selectNodeContents(textSpan);
    range.collapse(false);
  }
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
};

/** Restore a captured caret against the freshly rebuilt DOM + field map. */
const restoreCaret = (snap: CaretSnapshot, map: Map<Node, EditableFieldEntry>, paper: HTMLElement): void => {
  if (snap.kind === 'skillCell') {
    const sheets = Array.from(paper.querySelectorAll<HTMLElement>('.resume-page-sheet'));
    for (const sheet of sheets) {
      const grid = sheet.querySelector('[data-skills-grid]');
      if (!grid) continue;
      const cells = Array.from(grid.querySelectorAll<HTMLElement>('li[data-skill-cell]'));
      const cell = cells[snap.cellIndex ?? 0];
      if (cell) {
        placeCaretAt(cell, snap.offset);
        return;
      }
    }
    return;
  }
  // Field restore: prefer a mapped node inside a visible page sheet (the paper
  // also contains ResumePreview's offscreen measurement container — placing the
  // caret in its invisible copy would look like the caret vanished).
  for (const [node, entry] of map) {
    if (entry.path !== snap.path) continue;
    if (!paper.contains(node)) continue;
    if ((node as Element).closest?.('.resume-page-sheet')) {
      placeCaretAt(node, snap.offset);
      return;
    }
  }
};

interface ResumeWorkspaceProps {
  data: ResumeData;
  onChangeData: (newData: ResumeData) => void;
  pendingChanges?: ResumeChange[];
  onSelectSectionForReview?: (section: string) => void;
  onAcceptChange?: (id: string) => void;
  onRejectChange?: (id: string) => void;
  onAcceptAllChanges?: () => void;
  template: TemplateType;
  onChangeTemplate?: (t: TemplateType) => void;
  jobData?: JobDescriptionData | null;
  saveStatus?: 'idle' | 'saving' | 'saved';
  onSave?: (dataOverride?: ResumeData) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  /** Render inside a fixed-height container (landing hero embed): starts at a
   *  lower zoom so the page fits the narrower canvas without horizontal scroll. */
  embedded?: boolean;
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: (val: boolean) => void;
  onAddSection?: (
    sectionType: ResumeSectionType,
    customConfig?: { title: string; contentType: 'text' | 'bullets' | 'key_value' }
  ) => void;
  onReorderSections?: (newOrder: string[]) => void;
  onToggleSectionVisibility?: (sectionId: string, visible: boolean) => void;
  hideToolbar?: boolean;
  showSectionControls?: boolean;
  onOpenDesignModal?: () => void;
}

export default function ResumeWorkspace({
  data,
  onChangeData,
  pendingChanges = [],
  onSelectSectionForReview,
  onAcceptChange,
  onRejectChange,
  onAcceptAllChanges,
  template,
  onChangeTemplate,
  jobData,
  saveStatus = 'idle',
  onSave: propOnSave,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  embedded = false,
  zoom: propZoom,
  onZoomIn: propOnZoomIn,
  onZoomOut: propOnZoomOut,
  onResetZoom: propOnResetZoom,
  isFullscreen: propIsFullscreen,
  onToggleFullscreen: propOnToggleFullscreen,
  onAddSection,
  onReorderSections,
  onToggleSectionVisibility,
  hideToolbar = false,
  showSectionControls = true,
  onOpenDesignModal,
}: ResumeWorkspaceProps) {
  const [internalZoom, setInternalZoom] = useState<number>(embedded ? 0.9 : 1.2);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [isRewritingInline, setIsRewritingInline] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isBatchImproveModalOpen, setIsBatchImproveModalOpen] = useState(false);
  const [batchImproveTargetKey, setBatchImproveTargetKey] = useState<string | undefined>(undefined);
  const [internalUndoStack, setInternalUndoStack] = useState<ResumeData[]>([]);
  const [internalRedoStack, setInternalRedoStack] = useState<ResumeData[]>([]);
  const internalDataRef = useRef<ResumeData>(data);
  internalDataRef.current = data;

  const handleInternalUndo = useCallback(() => {
    if (onUndo) {
      onUndo();
      return;
    }
    if (internalUndoStack.length === 0) return;
    const previous = internalUndoStack[internalUndoStack.length - 1];
    setInternalRedoStack(prev => [internalDataRef.current, ...prev]);
    setInternalUndoStack(prev => prev.slice(0, -1));
    onChangeData(previous);
  }, [onUndo, internalUndoStack, onChangeData]);

  const handleInternalRedo = useCallback(() => {
    if (onRedo) {
      onRedo();
      return;
    }
    if (internalRedoStack.length === 0) return;
    const next = internalRedoStack[0];
    setInternalUndoStack(prev => [...prev, internalDataRef.current]);
    setInternalRedoStack(prev => prev.slice(1));
    onChangeData(next);
  }, [onRedo, internalRedoStack, onChangeData]);

  const handleInternalChangeData = useCallback((newData: ResumeData) => {
    if (!onUndo && JSON.stringify(internalDataRef.current) !== JSON.stringify(newData)) {
      setInternalUndoStack(prev => [...prev.slice(-30), internalDataRef.current]);
      setInternalRedoStack([]);
    }
    onChangeData(newData);
  }, [onUndo, onChangeData]);

  const handleInternalAddSection = useCallback((
    sectionType: ResumeSectionType,
    customConfig?: { title: string; contentType: 'text' | 'bullets' | 'key_value' }
  ) => {
    if (onAddSection) {
      onAddSection(sectionType, customConfig);
      return;
    }
    let updatedData: ResumeData = { ...data };
    if (sectionType === 'custom' && customConfig) {
      const customId = `custom_${Date.now()}`;
      const newCustomSections = {
        ...(updatedData.customSections || {}),
        [customId]: {
          id: customId,
          title: customConfig.title,
          contentType: customConfig.contentType,
          content:
            customConfig.contentType === 'bullets'
              ? ['Key achievement or highlight in this custom section', 'Additional project milestone or accomplishment']
              : customConfig.contentType === 'key_value'
              ? [{ id: '1', label: 'Item', value: 'Details' }]
              : 'Add descriptive overview or notes for this section.',
        },
      };
      const newSectionOrder = Array.isArray(updatedData.sectionOrder)
        ? [...updatedData.sectionOrder, customId]
        : [...createDefaultSectionOrder(), customId];
      const newVisibility = {
        ...(updatedData.sectionVisibility || {}),
        [customId]: true,
      };
      updatedData = {
        ...updatedData,
        customSections: newCustomSections,
        sectionOrder: newSectionOrder,
        sectionVisibility: newVisibility,
      };
      handleInternalChangeData(updatedData);
    } else {
      const def = SECTION_REGISTRY[sectionType];
      const newVisibility = {
        ...(updatedData.sectionVisibility || {}),
        [sectionType]: true,
      };
      const currentOrder =
        Array.isArray(updatedData.sectionOrder) && updatedData.sectionOrder.length > 0
          ? updatedData.sectionOrder
          : createDefaultSectionOrder();
      const newSectionOrder = currentOrder.includes(sectionType)
        ? currentOrder
        : [...currentOrder, sectionType];
      updatedData = {
        ...updatedData,
        sectionVisibility: newVisibility,
        sectionOrder: newSectionOrder,
      };
      handleInternalChangeData(updatedData);
    }
  }, [onAddSection, data, handleInternalChangeData]);

  const effectiveCanUndo = onUndo ? canUndo : internalUndoStack.length > 0;
  const effectiveCanRedo = onRedo ? canRedo : internalRedoStack.length > 0;

  const { showToast } = useToast();

  const zoom = propZoom !== undefined ? propZoom : internalZoom;
  const isFullscreen = propIsFullscreen !== undefined ? propIsFullscreen : internalIsFullscreen;

  const setIsFullscreen = (val: boolean) => {
    if (propOnToggleFullscreen) {
      propOnToggleFullscreen(val);
    } else {
      setInternalIsFullscreen(val);
    }
  };

  // Redline review: when the agent proposes changes, show a struck-through diff of the
  // affected sections in the canvas instead of the plain document.
  const [reviewMode, setReviewMode] = useState(true);

  // ── In-place editing: contentEditable page with DOM → ResumeData write-back ──
  // (no modal — place the cursor on any text and edit straight away)

  const editableFieldMapRef = useRef<Map<Node, EditableFieldEntry>>(new Map());
  // Caret snapshot taken right before a write-back re-render, restored after it.
  const caretSnapshotRef = useRef<CaretSnapshot | null>(null);
  // True while in-sheet typing has not been written back yet (a debounced
  // write-back is pending). ResumePreview holds sheet re-injection during this
  // window, so a keystroke can never be wiped by a re-render built from stale
  // data. Released on blur, when the debounce fires, or when a toolbar action
  // flushes the pending input.
  const [editHold, setEditHold] = useState(false);
  // The sheet the most recent input event came from, used by the toolbar
  // flush to commit pending typing even though the timer's sheet may have been
  // detached by an intervening re-render.
  const lastInputSheetRef = useRef<HTMLElement | null>(null);

  // Read a field node's text, translating contentEditable line breaks into \n:
  // the browser inserts <br> and <div>/<p> wrappers for Enter presses and
  // multi-line pastes, and plain textContent silently DROPS those boundaries —
  // "line one" + <br> + "line two" would come back as "line oneline two".
  // Block-level children get a trailing newline so the stored text keeps the
  // user's line structure (templates render \n via whitespace-pre-line, or
  // collapse it to a space — never merge words).
  const readNodeText = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      if ((node as Text).parentElement?.hasAttribute('data-bullet')) return '';
      return (node as Text).data;
    }
    const el = node as HTMLElement;
    if (el.hasAttribute('data-bullet')) return '';
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') return '\n';
    let out = '';
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if ((child as Text).parentElement?.hasAttribute('data-bullet')) continue;
        out += (child as Text).data;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childEl = child as HTMLElement;
        if (childEl.hasAttribute('data-bullet')) continue;
        out += readNodeText(childEl);
        if (/^(div|p|li|ul|ol|section|h[1-6])$/i.test(childEl.tagName)) out += '\n';
      }
    }
    return out;
  };

  // Maps rendered DOM nodes to the exact ResumeData field they display, so blur
  // can write edits back in place. Whole-field elements are matched first
  // (deepest wins); leaf text nodes fill the rest (skill chips, a role inside a
  // combined header line) unless an ancestor element already owns that field.
  const buildEditableFieldMap = (root: HTMLElement, resume: ResumeData): Map<Node, EditableFieldEntry> => {
    const map = new Map<Node, EditableFieldEntry>();
    const coveredByElement = new Set<string>();

    const wholeFieldMatch = (text: string): EditableFieldEntry | null => {
      const t = text.trim();
      if (t.length < 2 || t.length > 400) return null;
      const m = findBestTextMatch(t, resume, t, {});
      if (!m) return null;
      const n = normalizeText(t);
      if (m.via === 'stored') {
        const normSpan = normalizeText(m.span);
        if (normSpan === n) return { path: m.path, span: m.span, via: m.via };
        // Mid-edit match: live DOM text contains uncommitted keystrokes or line breaks.
        // Only match if lengths are substantial and one is a prefix of the other (never arbitrary substring)
        if (
          normSpan &&
          n.length >= 4 &&
          normSpan.length >= 4 &&
          (normSpan.startsWith(n) || n.startsWith(normSpan)) &&
          Math.abs(n.length - normSpan.length) <= Math.max(30, Math.min(n.length, normSpan.length) * 0.4)
        ) {
          return { path: m.path, span: m.span, via: m.via };
        }
      }
      // Rendered-only match (dates, case transforms): the node shows a variant.
      for (const c of buildTextCandidates(resume)) {
        if (c.path !== m.path) continue;
        for (const v of c.variants) {
          if (normalizeText(v) === n) return { path: m.path, span: m.stored, via: m.via };
        }
      }
      return null;
    };

    // 0. Explicit data-path attribute mapping (100% exact & preserved while typing).
    const pathEls = Array.from(root.querySelectorAll('[data-path]')) as HTMLElement[];
    const storedByPath = new Map(buildTextCandidates(resume).map(c => [c.path, c.stored]));
    for (const el of pathEls) {
      const path = el.getAttribute('data-path');
      if (!path) continue;
      const stored = storedByPath.get(path) ?? '';
      map.set(el, { path, span: stored, via: 'stored' });
      coveredByElement.add(path);
    }

    // 0.5. Structural bullet list mapping for non-skills <ul>/<ol>
    // Maps all <li> in experience, leadership, achievements, and projects so empty bullets
    // (just created via Enter) are mapped to their array path and retain caret focus.
    const nonSkillsLists = Array.from(root.querySelectorAll('ul:not([data-skills-grid]), ol:not([data-skills-grid])')) as HTMLElement[];
    for (const list of nonSkillsLists) {
      const lis = Array.from(list.querySelectorAll(':scope > li:not([data-skill-cell])')) as HTMLElement[];
      if (lis.length === 0) continue;
      
      // If every li already has an explicit data-path mapped in step 0, skip
      if (lis.every((li) => map.has(li) || li.hasAttribute('data-path'))) continue;

      // 1. Try to get parent path directly from any sibling li that has data-path
      let matchedParentPath: string | null = null;
      for (const li of lis) {
        const dp = li.getAttribute('data-path');
        if (dp && dp.includes('.')) {
          matchedParentPath = dp.slice(0, dp.lastIndexOf('.'));
          break;
        }
      }

      // 2. Fallback: match text if no sibling had data-path
      if (!matchedParentPath) {
        for (const li of lis) {
          const text = li.textContent?.trim() || '';
          if (text.length >= 2) {
            const m = wholeFieldMatch(text);
            if (
              m &&
              /^(?:experience|leadership|volunteering|research|teaching|military|clinicalExperience)\.\d+\.description\.\d+$/.test(
                m.path
              )
            ) {
              matchedParentPath = m.path.slice(0, m.path.lastIndexOf('.'));
              break;
            } else if (
              m &&
              /^(?:projects|portfolio|caseStudies|selectedWork)\.\d+\.description\.\d+$/.test(m.path)
            ) {
              matchedParentPath = m.path.slice(0, m.path.lastIndexOf('.'));
              break;
            } else if (
              m &&
              /^(?:keyAchievements|achievements|awards|publications|conferencesSpeaking|academicAchievements)\.\d+$/.test(
                m.path
              )
            ) {
              matchedParentPath = m.path.slice(0, m.path.lastIndexOf('.'));
              break;
            } else if (m && /^customSections\.[^.]+\.content\.\d+$/.test(m.path)) {
              matchedParentPath = m.path.slice(0, m.path.lastIndexOf('.'));
              break;
            }
          }
        }
      }

      if (matchedParentPath) {
        lis.forEach((li, idx) => {
          if (!map.has(li)) {
            const path = `${matchedParentPath}.${idx}`;
            const stored = storedByPath.get(path) ?? '';
            map.set(li, { path, span: stored, via: 'stored' });
            coveredByElement.add(path);
          }
        });
      }
    }

    // 1. Whole-field elements (bullets, paragraphs, chips, headings, …).
    // NEVER map container elements (ul, ol, dl, section, article, div, table, etc. that contain multiple children or mapped descendants).
    const els = Array.from(root.querySelectorAll('*')) as HTMLElement[];
    for (const el of els) {
      if (map.has(el)) continue;
      const tag = el.tagName ? el.tagName.toLowerCase() : '';
      if (['ul', 'ol', 'dl', 'section', 'article', 'nav', 'header', 'footer', 'form', 'table', 'tbody', 'thead', 'tr'].includes(tag)) {
        continue;
      }
      // Skip container elements that have children already mapped in map
      if (Array.from(map.keys()).some((k) => k !== el && el.contains(k))) {
        continue;
      }
      const entry = wholeFieldMatch(el.textContent || '');
      if (!entry || coveredByElement.has(entry.path)) continue;
      map.set(el, entry);
      coveredByElement.add(entry.path);
    }

    // 2. Leaf text nodes not already inside a mapped element (role, chip, …).
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    while (walker.nextNode()) texts.push(walker.currentNode as Text);
    for (const t of texts) {
      let ancestor = t.parentElement;
      let covered = false;
      while (ancestor && ancestor !== root) {
        if (map.has(ancestor)) {
          covered = true;
          break;
        }
        ancestor = ancestor.parentElement;
      }
      if (covered) continue;
      const entry = wholeFieldMatch(t.data);
      if (!entry || coveredByElement.has(entry.path)) continue;
      map.set(t, entry);
    }
    return map;
  };

  // True when the live caret is still sitting inside the field/cell the snapshot
  // was taken from (i.e. the write-back's re-render did not destroy it).
  const isCaretInSnapshotTarget = (snap: CaretSnapshot): boolean => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return false;
    const anchor = sel.anchorNode;
    if (snap.kind === 'skillCell') {
      const el = anchor.nodeType === Node.ELEMENT_NODE ? (anchor as HTMLElement) : (anchor as Text).parentElement;
      const cell = el?.closest('li[data-skill-cell]') as HTMLElement | null;
      if (!cell) return false;
      const grid = cell.closest('[data-skills-grid]') as HTMLElement | null;
      if (!grid) return false;
      const cells = Array.from(grid.querySelectorAll<HTMLElement>('li[data-skill-cell]'));
      return cells.indexOf(cell) === snap.cellIndex;
    }
    for (const [node, entry] of editableFieldMapRef.current) {
      if (entry.path === snap.path && node.contains(anchor)) return true;
    }
    return false;
  };

  // Rebuild the field map whenever the rendered document changes, and restore the
  // caret a write-back left behind (the sheets were rebuilt from scratch, so the
  // browser's original caret is gone — put it back where the user was editing).
  //
  // The restore is retried a few times because the write-back's re-render can be
  // followed by a SECOND sheet rebuild — ResumePreview's page slicer commits its
  // `setPagesHtml` update in a later render (on slow or backgrounded tabs this
  // lands well after this effect ran), which would destroy the caret again. Each
  // pass only acts when the caret is no longer in its target, so a caret the user
  // has since moved (or that was restored correctly) is never yanked.
  useEffect(() => {
    if (!paperRef.current) return;
    // Update dataRef eagerly so the field-map rebuild below (and the retries)
    // match DOM text against the CURRENT stored text, not the previous render's.
    // Without this the rebuild runs before the no-deps dataRef effect and
    // silently builds a stale map — fields whose text just changed go unmapped
    // and the caret restore falls through to the default (position 0 = the name).
    dataRef.current = data;
    const tryRestore = () => {
      if (!paperRef.current) return;
      rebuildFieldMap();
      const snap = caretSnapshotRef.current;
      if (!snap) return;
      if (isCaretInSnapshotTarget(snap)) return; // already where it belongs
      restoreCaret(snap, editableFieldMapRef.current, paperRef.current);
    };
    tryRestore();
    const t0 = setTimeout(tryRestore, 0);
    const t1 = setTimeout(tryRestore, 150); // let the page slicer settle after a data/template change
    const t2 = setTimeout(() => {
      tryRestore();
      caretSnapshotRef.current = null;
    }, 500);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, template]);

  // The freshest ResumeData, read by the sheets-reinjected callback below
  // (which is stable and must not capture a stale render's `data`).
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  });

  // Build the DOM→field map against the CURRENT sheets, then preserve mappings
  // for nodes that were already mapped and are still in the document. A plain
  // rebuild only maps nodes whose text matches ResumeData, so a node that is
  // mid-edit (DOM text has keystrokes the write-back hasn't committed yet) would
  // be dropped and its edits would silently stop persisting.
  const rebuildFieldMap = useCallback(() => {
    if (!paperRef.current) return;
    const fresh = buildEditableFieldMap(paperRef.current, dataRef.current);
    const storedByPath = new Map(buildTextCandidates(dataRef.current).map(c => [c.path, c.stored]));
    for (const [node, entry] of editableFieldMapRef.current) {
      if (!node.isConnected || fresh.has(node)) continue;
      fresh.set(node, {
        ...entry,
        // Refresh the span against the current stored value so the write-back
        // can still locate and splice the edit after a data change.
        span: storedByPath.get(entry.path) ?? entry.span,
      });
    }
    editableFieldMapRef.current = fresh;
  }, []);

  // ResumePreview re-injected the sheets (pagesHtml commit). Rebuild the field
  // map against the NEW sheet nodes synchronously — in the same layout pass,
  // before the browser paints — so a write-back can never run against detached
  // nodes and silently drop edits. Without this, every re-inject (including
  // the editHold-only re-slices, which never change `data`/`template`) leaves
  // the map pointing at the previous sheets' DOM.
  const handleSheetsReinjected = useCallback(() => {
    rebuildFieldMap();
    // Rebuilding the sheets from scratch destroys the browser caret, which
    // drops to the very start of the document (the front of the name). Restore
    // the write-back's snapshot NOW — in the same layout pass as the innerHTML
    // commit, before paint — so the caret never visibly jumps to the top while
    // typing. The [data] effect's retried restore remains as a fallback.
    const snap = caretSnapshotRef.current;
    if (!snap) return;
    if (isCaretInSnapshotTarget(snap)) return;
    restoreCaret(snap, editableFieldMapRef.current, paperRef.current);
  }, [rebuildFieldMap]);

  const domInputTimerRef = useRef<number | null>(null);

  // Write the edited sheet back into ResumeData. Edits are grouped per field and
  // applied in DOM order so repeated spans (e.g. skill chips) land on the right
  // occurrence; inline tags outside the edited region are preserved.
  // The sheet a debounced write-back was scheduled against may have been detached
  // by an earlier re-render (write-backs rebuild the pages from scratch). Resolve
  // the LIVE sheet the user is actually editing: the one containing the caret, else
  // the first sheet still showing a skills grid (only one page carries it).
  const resolveLiveSheet = (captured: HTMLElement): HTMLElement | null => {
    if (captured.isConnected) return captured;
    const sel = window.getSelection();
    const anchor = sel && sel.anchorNode;
    const anchorEl = anchor
      ? anchor.nodeType === Node.ELEMENT_NODE ? (anchor as HTMLElement) : anchor.parentElement
      : null;
    const caretSheet = anchorEl && anchorEl.closest('.resume-page-sheet') as HTMLElement | null;
    if (caretSheet && paperRef.current?.contains(caretSheet)) return caretSheet;
    const sheets = Array.from(
        paperRef.current?.querySelectorAll('.resume-page-sheet') ?? []
    ) as HTMLElement[];
    return sheets.find((s) => s.querySelector('[data-skills-grid]')) || sheets[0] || null;
  };

  const writeBackSheet = (sheet: HTMLElement): ResumeData | null => {
    const writes = new Map<string, { span: string; via: EditableFieldEntry['via']; newText: string }[]>();

    // Collect every mapped node in this sheet that actually changed.
    const changed: { node: Node; entry: EditableFieldEntry; newText: string }[] = [];
    for (const [node, entry] of editableFieldMapRef.current) {
      if (!sheet.contains(node)) continue;
      // Skills grids are written back as a whole below (readSkillsGrid) — cells
      // inside one are covered there, including cells appended by Enter
      // navigation that the field map has never seen. Skipping them here avoids
      // double-writing (whole-grid + per-span) the same skills field.
      if (node.nodeType === Node.ELEMENT_NODE && (node as Element).closest('[data-skills-grid]')) continue;
      const newText = readNodeText(node).trim();
      const oldPlain = stripInlineTags(entry.span).trim();
      if (oldPlain === newText) continue;
      changed.push({ node, entry, newText });
    }

    // Only the OUTERMOST changed node per path may write. A whole-field element
    // (a bullet <li>, the summary <p>) CONTAINS every inline-tag descendant the
    // map also knows (a <strong> inside the bullet), and its text already
    // includes all of their text. Writing both — with their own spans and the
    // same path — re-applies the same edit twice via indexOf and can hit the
    // WRONG occurrence (e.g. the same word bolded twice: editing one would
    // silently edit the other, adding text the user never typed).
    for (const c of changed) {
      let covered = false;
      for (const o of changed) {
        if (o.node === c.node) continue;
        if (o.entry.path !== c.entry.path) continue;
        if (o.node.nodeType === Node.ELEMENT_NODE && o.node.contains(c.node)) {
          covered = true;
          break;
        }
      }
      if (covered) continue;
      const list = writes.get(c.entry.path) || [];
      list.push({ span: c.entry.span, via: c.entry.via, newText: c.newText });
      writes.set(c.entry.path, list);
    }

    let next = dataRef.current;

    // Whole-grid skills write-back: read every cell in DOM (row-major) order and
    // replace data.skills wholesale, preserving inline tags and picking up cells
    // the user added by pressing Enter at the end of the grid.
    //
    // Compared RAW (not normalizeText): normalizeText strips tags, so legacy
    // span-wrapped stored skills ("<span>Skill</span>") would compare "equal" to
    // the clean DOM grid and the corruption would never heal. The DOM grid is the
    // user-visible truth — any difference (leftover <span> wrappers, entity or
    // whitespace drift) is reconciled toward it.
    const gridSkills = readSkillsGrid(sheet);
    if (gridSkills !== null && (data.skills ?? '') !== gridSkills) {
      next = setTextAtPath(next, 'skills', () => gridSkills);
    }

    for (const [path, list] of writes) {
      next = setTextAtPath(next, path, (old) => {
        if (list.length === 1) {
          const w = list[0];
          return applyPlainEdit(old, stripInlineTags(old), w.newText);
        }
        let cursor = 0;
        let out = old;
        for (const w of list) {
          const idx = out.indexOf(w.span, cursor);
          if (idx < 0) {
            cursor = 0;
            // Fallback: if span not found by exact substring, replace old with newText
            return applyPlainEdit(old, stripInlineTags(old), w.newText);
          }
          const replacement = applyPlainEdit(w.span, stripInlineTags(w.span), w.newText);
          out = out.slice(0, idx) + replacement + out.slice(idx + w.span.length);
          cursor = idx + w.span.length;
        }
        return out;
      });
    }
    if (next === data) return null;
    // The re-render triggered by this change rebuilds the sheets from scratch and
    // destroys the browser caret — snapshot it now so it can be restored after.
    const freshSnap = captureCaret(sheet, editableFieldMapRef.current);
    if (freshSnap) {
      caretSnapshotRef.current = freshSnap;
    }
    onChangeData(next);
    return next;
  };

  // Commit any pending in-sheet typing immediately and release the edit hold,
  // so a toolbar action (bold, paste, AI rewrite) or Save applies on top of the
  // freshest text. Returns the committed data, or null when nothing was pending.
  const flushPendingInput = (): ResumeData | null => {
    if (domInputTimerRef.current !== null) {
      window.clearTimeout(domInputTimerRef.current);
      domInputTimerRef.current = null;
    }
    setEditHold(false);
    const sheets = Array.from(
      paperRef.current?.querySelectorAll('.resume-page-sheet') ?? []
    ) as HTMLElement[];
    let latestData: ResumeData | null = null;
    for (const sheet of sheets) {
      const updated = writeBackSheetRef.current(sheet);
      if (updated) {
        latestData = updated;
      }
    }
    return latestData;
  };

  const handleDomBlur = (sheet: HTMLElement) => {
    if (domInputTimerRef.current !== null) {
      window.clearTimeout(domInputTimerRef.current);
      domInputTimerRef.current = null;
    }
    lastInputSheetRef.current = null;
    setEditHold(false);
    writeBackSheet(sheet);
  };

  // Live write-back while typing (debounced) so edits survive re-renders and focus
  // moves within a sheet. The timer must use the LATEST write-back (a closure from
  // an older render holds stale `data` and would overwrite newer edits with it) and
  // the LIVE sheet (the captured one may be detached by an intervening re-render).
  // While a write-back is pending the edit hold is ON, so ResumePreview never
  // re-injects the sheets mid-keystroke.
  const handleDomInput = (sheet: HTMLElement) => {
    if (domInputTimerRef.current !== null) window.clearTimeout(domInputTimerRef.current);
    lastInputSheetRef.current = sheet;
    setEditHold(true);
    domInputTimerRef.current = window.setTimeout(() => {
      domInputTimerRef.current = null;
      const live = resolveLiveSheet(sheet);
      if (live) writeBackSheetRef.current(live);
      setEditHold(false);
    }, 400);
  };

  // Keep a ref to the latest write-back so the debounced input timer and the
  // append-flush listener never read a stale `data` closure.
  const writeBackSheetRef = useRef(writeBackSheet);
  useEffect(() => {
    writeBackSheetRef.current = writeBackSheet;
  });

  // Skills-grid Enter navigation (ResumePreview) flushes any pending live
  // write-back BEFORE appending a new empty cell. Without this flush the
  // debounced re-render would wipe the freshly appended cell a moment later.
  useEffect(() => {
    const onAppendFlush = (e: Event) => {
      const sheet = e.target as HTMLElement;
      if (!paperRef.current || !paperRef.current.contains(sheet)) return;
      if (domInputTimerRef.current !== null) {
        window.clearTimeout(domInputTimerRef.current);
        domInputTimerRef.current = null;
      }
      // Hold the edit lock across the append: the write-back below re-renders
      // the sheets, and without the lock that re-inject would destroy the fresh
      // cell the keydown handler appends right after (it lands post-render).
      setEditHold(true);
      writeBackSheetRef.current(sheet);
    };
    document.addEventListener('skills-append-flush', onAppendFlush);
    return () => document.removeEventListener('skills-append-flush', onAppendFlush);
  }, []);

  // Synchronous flush listener triggered when user clicks Save header button
  useEffect(() => {
    const handleGlobalFlush = (e: Event) => {
      const flushed = flushPendingInput();
      const customEvent = e as CustomEvent;
      if (customEvent && customEvent.detail && flushed) {
        customEvent.detail.latestData = flushed;
      }
    };
    window.addEventListener('cv_architect_flush_input', handleGlobalFlush);
    return () => window.removeEventListener('cv_architect_flush_input', handleGlobalFlush);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Bullet-list Enter: split the description array directly ────────────────
  // When Enter is pressed inside a non-skills <li>, the caret position divides
  // the bullet's text into "before" and "after". Instead of inserting a <br> and
  // waiting for the write-back to round-trip, we splice the description array
  // immediately so the re-render produces two <li> elements — each with its own
  // bullet marker — and set a caret snapshot for the new bullet's start.
  const handleBulletEnter = useCallback((sheet: HTMLElement) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const anchor = sel.anchorNode;
    if (!anchor || !sheet.contains(anchor)) return;

    const anchorEl = anchor.nodeType === Node.ELEMENT_NODE
      ? (anchor as HTMLElement)
      : (anchor as Text).parentElement;
    const li = anchorEl?.closest?.('li:not([data-skill-cell])') as HTMLElement | null;
    if (!li) return;

    // Find the field-map entry for this <li> (or its closest mapped ancestor).
    let entry: EditableFieldEntry | undefined;
    let mappedNode: Node | undefined;
    for (const [node, e] of editableFieldMapRef.current) {
      if (!sheet.contains(node)) continue;
      if (node === li) { entry = e; mappedNode = node; break; }
    }
    if (!entry) {
      // Walk ancestors if the <li> itself wasn't mapped.
      let cur: Element | null = li;
      while (cur && cur !== sheet) {
        const e = editableFieldMapRef.current.get(cur);
        if (e) { entry = e; mappedNode = cur; break; }
        cur = cur.parentElement;
      }
    }
    if (!entry) return;

    // Commit any pending in-sheet typing first.
    const base = flushPendingInput() ?? data;

    // Character offset of the caret within the <li>'s plain text.
    const caretOffset = charOffsetIn(anchor, sel.anchorOffset, li);

    // Resolve the path.  Bullet paths look like:
    //   experience.0.description.2   (array element)
    //   keyAchievements.1             (array element)
    //   projects.0.description        (single string — no trailing index)
    const path = entry.path;
    const parts = path.split('.');

    // ── Array bullet: experience / leadership / keyAchievements ──────────
    const lastPart = parts[parts.length - 1];
    const bulletIndex = /^\d+$/.test(lastPart) ? parseInt(lastPart, 10) : -1;
    const parentPath = bulletIndex >= 0 ? parts.slice(0, -1).join('.') : null;

    if (parentPath && bulletIndex >= 0) {
      // Read the current stored text (may contain inline tags).
      const stored = String(entry.span ?? '');
      // The caret offset is measured against the DOM text, which for a
      // marker-stripped match (via 'rendered') drops a leading bullet glyph —
      // shift the split by the stripped prefix so the cut lands exactly where
      // the user pressed Enter.
      const strippedStored = stored.replace(/^[•·\-*]\s*/, '');
      const prefixShift =
        entry.via === 'rendered' && strippedStored !== stored
          ? stored.length - strippedStored.length
          : 0;
      // Map the plain-text caret offset into the tagged text.
      const { toRaw } = plainTextWithOffsets(stored);
      const rawOffset = toRaw(caretOffset + prefixShift);

      // Close any open tags at the split point so both halves are valid HTML.
      const beforeTagged = stored.slice(0, rawOffset);
      const afterTagged  = stored.slice(rawOffset);

      // Navigate to the description array and splice.
      let next = { ...base } as any;
      const arrParts = parentPath.split('.');
      let container = next as any;
      for (let i = 0; i < arrParts.length; i++) {
        const key = arrParts[i];
        if (Array.isArray(container[key])) {
          container[key] = [...container[key]];
        } else if (typeof container[key] === 'object' && container[key] !== null) {
          container[key] = { ...container[key] };
        }
        container = container[key];
      }

      // Arrays and legacy newline-separated strings both become a line list;
      // the caret offset already targets the exact line, so the same splice
      // splits the right bullet. String containers are upgraded to the modern
      // array format (markers stripped — they were never rendered anyway) and
      // written back as an array, so every later write-back is array-safe.
      const lines = Array.isArray(container)
        ? container
        : typeof container === 'string'
          ? container.split('\n').map((l) => l.replace(/^[•·\-*]\s*/, ''))
          : null;
      if (lines && bulletIndex < lines.length) {
        const cleanBefore = (prefixShift > 0 ? beforeTagged.replace(/^[•·\-*]\s*/, '') : beforeTagged).trim();
        const cleanAfter  = afterTagged.trim();
        lines.splice(bulletIndex, 1, cleanBefore, cleanAfter);

        // Walk back up and write the (possibly upgraded) array.
        let setter = next as any;
        for (let i = 0; i < arrParts.length - 1; i++) setter = setter[arrParts[i]];
        setter[arrParts[arrParts.length - 1]] = lines;
      }

      // Caret should land at offset 0 of the NEW bullet.
      caretSnapshotRef.current = {
        kind: 'field',
        path: `${parentPath}.${bulletIndex + 1}`,
        offset: 0,
      };
      onChangeData(next as ResumeData);
      return;
    }

    // ── Single-string field (summary, project.description): insert \n ───
    const stored = String(entry.span ?? '');
    const { toRaw } = plainTextWithOffsets(stored);
    const rawOffset = toRaw(caretOffset);
    const newStored = stored.slice(0, rawOffset) + '\n' + stored.slice(rawOffset);
    const next = setTextAtPath(base, path, () => newStored);
    caretSnapshotRef.current = {
      kind: 'field',
      path,
      offset: caretOffset + 1,
    };
    onChangeData(next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, onChangeData]);

  // ── Bullet-list Backspace: merge bullet into previous bullet ──────────────
  const handleBulletBackspace = useCallback((sheet: HTMLElement) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const anchor = sel.anchorNode;
    if (!anchor || !sheet.contains(anchor)) return;

    const anchorEl = anchor.nodeType === Node.ELEMENT_NODE
      ? (anchor as HTMLElement)
      : (anchor as Text).parentElement;
    const li = anchorEl?.closest?.('li:not([data-skill-cell])') as HTMLElement | null;
    if (!li) return;

    let entry: EditableFieldEntry | undefined;
    for (const [node, e] of editableFieldMapRef.current) {
      if (!sheet.contains(node)) continue;
      if (node === li) { entry = e; break; }
    }
    if (!entry) return;

    const base = flushPendingInput() ?? data;
    const path = entry.path;
    const parts = path.split('.');

    const lastPart = parts[parts.length - 1];
    const bulletIndex = /^\d+$/.test(lastPart) ? parseInt(lastPart, 10) : -1;
    const parentPath = bulletIndex >= 0 ? parts.slice(0, -1).join('.') : null;

    if (parentPath && bulletIndex > 0) {
      let next = { ...base } as any;
      const arrParts = parentPath.split('.');
      let container = next as any;
      for (let i = 0; i < arrParts.length; i++) {
        const key = arrParts[i];
        if (Array.isArray(container[key])) {
          container[key] = [...container[key]];
        } else if (typeof container[key] === 'object' && container[key] !== null) {
          container[key] = { ...container[key] };
        }
        container = container[key];
      }

      // Legacy string descriptions are upgraded to the array format so the
      // merge applies uniformly (and never crashes on string indexing).
      const lines = Array.isArray(container)
        ? container
        : typeof container === 'string'
          ? container.split('\n').map((l) => l.replace(/^[•·\-*]\s*/, ''))
          : null;
      if (lines && bulletIndex < lines.length) {
        const prevBullet = String(lines[bulletIndex - 1] ?? '');
        const currBullet = String(lines[bulletIndex] ?? '');
        const prevPlain = stripInlineTags(prevBullet);

        lines[bulletIndex - 1] = prevBullet + currBullet;
        lines.splice(bulletIndex, 1);

        // Walk back up and write the (possibly upgraded) array.
        let setter = next as any;
        for (let i = 0; i < arrParts.length - 1; i++) setter = setter[arrParts[i]];
        setter[arrParts[arrParts.length - 1]] = lines;

        caretSnapshotRef.current = {
          kind: 'field',
          path: `${parentPath}.${bulletIndex - 1}`,
          offset: prevPlain.length,
        };
        onChangeData(next as ResumeData);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, onChangeData]);

  // ── Skills-grid Enter: synchronously navigate to next cell or append new cell ───────
  const handleSkillEnter = useCallback((sheet: HTMLElement, cell: HTMLElement, dir: 1 | -1 = 1) => {
    const grid = cell.closest('[data-skills-grid]') as HTMLElement | null;
    if (!grid) return;

    // Flush any pending typing from the debounce timer immediately so typing is committed
    flushPendingInput();

    const cells = Array.from(grid.querySelectorAll<HTMLElement>('li[data-skill-cell]'));
    const currentIndex = cells.indexOf(cell);
    if (currentIndex < 0) return;

    const targetIndex = currentIndex + dir;

    if (targetIndex >= 0 && targetIndex < cells.length) {
      // Target cell exists: move to it
      const targetCell = cells[targetIndex];
      placeCaretInSkillCell(targetCell, true);
      caretSnapshotRef.current = {
        kind: 'skillCell',
        path: 'skills',
        cellIndex: targetIndex,
        offset: 0,
      };
      writeBackSheet(sheet);
    } else if (dir === 1 && targetIndex >= cells.length) {
      // Beyond end of grid: append fresh empty skill cell with bullet
      const newCell = appendEmptySkillCell(grid);
      placeCaretInSkillCell(newCell, true);
      caretSnapshotRef.current = {
        kind: 'skillCell',
        path: 'skills',
        cellIndex: targetIndex,
        offset: 0,
      };
      writeBackSheet(sheet);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, onChangeData]);

  // ── Skills-grid Backspace: delete empty cell and navigate to previous cell ────────
  const handleSkillBackspace = useCallback((sheet: HTMLElement, cell: HTMLElement) => {
    const grid = cell.closest('[data-skills-grid]') as HTMLElement | null;
    if (!grid) return;

    flushPendingInput();

    const cells = Array.from(grid.querySelectorAll<HTMLElement>('li[data-skill-cell]'));
    const currentIndex = cells.indexOf(cell);
    if (currentIndex <= 0) return;

    const prevIndex = currentIndex - 1;
    const prevCell = cells[prevIndex];

    cell.remove();
    placeCaretInSkillCell(prevCell, false);

    caretSnapshotRef.current = {
      kind: 'skillCell',
      path: 'skills',
      cellIndex: prevIndex,
      offset: (prevCell.textContent || '').length,
    };
    writeBackSheet(sheet);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, onChangeData]);

  useEffect(() => {
    if (pendingChanges.length > 0) setReviewMode(true);
  }, [pendingChanges.length]);

  const showRedline = reviewMode && pendingChanges.length > 0;

  // Floating Contextual Selection Toolbar state
  const [selectedText, setSelectedText] = useState('');
  const [generatedSuggestion, setGeneratedSuggestion] = useState<string | null>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null);
  const [highlightRects, setHighlightRects] = useState<Array<{ top: number; left: number; width: number; height: number }>>([]);
  const [customInlinePrompt, setCustomInlinePrompt] = useState('');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('idle');
  const [currentSelectionAction, setCurrentSelectionAction] = useState('Improve');
  const originalSelectedTextRef = useRef('');
  const pendingRewrittenTextRef = useRef('');
  // Full text of the DOM element the selection lives in — lets the formatter
  // target the EXACT field (e.g. this bullet, this summary paragraph) instead of
  // the first place the same words appear elsewhere in the resume.
  const [selectionContext, setSelectionContext] = useState('');
  // Character offset of the selection start within `selectionContext`'s text.
  // Lets the formatter target the EXACT occurrence when the same words appear
  // twice in one field (bold/paste/edit the one the user selected, not the
  // first match). -1 when no selection is active.
  const [selectionOffset, setSelectionOffset] = useState(-1);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const lastRangeRef = useRef<Range | null>(null);
  const lastSelectionPaperOffsetRef = useRef<{ top: number; left: number; width: number; height: number } | null>(null);


  // Resolve the text of the innermost element that fully contains the selection.
  // This is what lets "bold this word" land in THIS bullet even when the same
  // word also appears in the summary.
  const getSelectionContextText = (range: Range): string => {
    try {
      let node: Node | null = range.commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
      let el = node as HTMLElement | null;
      const selText = range.toString();
      while (el && el !== paperRef.current) {
        const txt = el.textContent || '';
        if (txt.includes(selText) || selText.includes(txt.trim())) {
          // Cap context length: a huge container (e.g. a whole page sheet) carries
          // no disambiguating signal and would match every field.
          return txt.length <= 400 ? txt : '';
        }
        el = el.parentElement;
      }
    } catch (e) {
      // ignore
    }
    return '';
  };

  // Character offset of `range`'s start within `root`'s text content.
  const selectionStartOffsetIn = (root: Node, range: Range): number => {
    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let acc = 0;
      const startNode = range.startContainer;
      const startOff = range.startOffset;
      while (walker.nextNode()) {
        const t = walker.currentNode as Text;
        if (t === startNode) return acc + startOff;
        acc += t.data.length;
      }
      return acc;
    } catch (e) {
      return -1;
    }
  };

  // The DOM element whose text IS `context` (the field the selection lives in),
  // so the selection's character offset can be measured against it.
  const contextElementFor = (range: Range, context: string): HTMLElement | null => {
    try {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
      let el = node as HTMLElement | null;
      while (el && el !== paperRef.current) {
        if ((el.textContent || '') === context) return el;
        el = el.parentElement;
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  // True when the selection lies inside a structural element — a heading (the
  // name, section titles, education degrees, and the experience role/company
  // headers that some templates render as h3) or a `.section-header`. Headings
  // render as siblings of the entries they title, so walking ancestors up to
  // the paper never crosses into a section header from a bullet.
  const isStructuralDomSelection = (range: Range): boolean => {
    try {
      let node: Node | null = range.commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
      let el = node as HTMLElement | null;
      while (el && el !== paperRef.current) {
        const tag = el.tagName ? el.tagName.toLowerCase() : '';
        if (/^h[1-6]$/.test(tag) || el.classList.contains('section-header')) {
          return true;
        }
        el = el.parentElement;
      }
    } catch (e) {
      // ignore
    }
    return false;
  };

  const clearSelectionState = () => {
    setSelectionPosition(null);
    setHighlightRects([]);
    setSelectedText('');
    setSelectionContext('');
    setSelectionOffset(-1);
    setCustomInlinePrompt('');
    setSelectionMode('idle');
    setCurrentSelectionAction('Improve');
    setGeneratedSuggestion(null);
    originalSelectedTextRef.current = '';
    pendingRewrittenTextRef.current = '';
    lastRangeRef.current = null;
    lastSelectionPaperOffsetRef.current = null;
    try {
      window.getSelection()?.removeAllRanges();
    } catch (e) {
      // ignore
    }
  };

  const updateAnchorPositions = useCallback(() => {
    if (!paperRef.current) return;
    const currentZoom = zoom || 1;
    const paperRect = paperRef.current.getBoundingClientRect();
    const selection = window.getSelection();
    const hasLiveSelection = selection && selection.rangeCount > 0 && !selection.isCollapsed;
    const targetRange = hasLiveSelection ? selection.getRangeAt(0) : lastRangeRef.current;

    let rect: { top: number; left: number; width: number; height: number } | null = null;
    if (targetRange) {
      try {
        const r = targetRange.getBoundingClientRect();
        if (r && (r.width > 0 || r.height > 0)) {
          rect = r;
          lastSelectionPaperOffsetRef.current = {
            top: (r.top - paperRect.top) / currentZoom,
            left: (r.left - paperRect.left) / currentZoom,
            width: r.width / currentZoom,
            height: r.height / currentZoom,
          };
        }
      } catch (e) {
        // ignore
      }
    }

    // If range rect was unavailable (e.g. collapsed/detached), compute from stored paper offset
    if (!rect && lastSelectionPaperOffsetRef.current) {
      const offset = lastSelectionPaperOffsetRef.current;
      rect = {
        top: paperRect.top + offset.top * currentZoom,
        left: paperRect.left + offset.left * currentZoom,
        width: offset.width * currentZoom,
        height: offset.height * currentZoom,
      };
    }

    if (rect) {
      setSelectionPosition({
        top: rect.top - 55,
        left: Math.max(rect.left + rect.width / 2 - 150, 20),
      });
    }
  }, [zoom]);

  // Anchor floating toolbar dynamically on container scroll & window resize
  useEffect(() => {
    if (!selectionPosition) return;

    const handleScrollOrResize = () => {
      updateAnchorPositions();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [selectionPosition !== null, updateAnchorPositions]);

  // Smoothly ensure highlighted selection and card are in visible range when result mode activates
  useEffect(() => {
    if (selectionMode === 'result' && lastSelectionPaperOffsetRef.current && paperRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const paperRect = paperRef.current.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const currentZoom = zoom || 1;
      const offset = lastSelectionPaperOffsetRef.current;
      
      const selectionScreenTop = paperRect.top + offset.top * currentZoom;
      const selectionScreenBottom = selectionScreenTop + offset.height * currentZoom;
      
      if (selectionScreenBottom > containerRect.bottom - 220) {
        const delta = selectionScreenBottom - (containerRect.bottom - 260);
        container.scrollBy({ top: delta, behavior: 'smooth' });
      } else if (selectionScreenTop < containerRect.top + 80) {
        const delta = selectionScreenTop - (containerRect.top + 100);
        container.scrollBy({ top: delta, behavior: 'smooth' });
      }
    }
  }, [selectionMode, zoom]);

  // Dismiss the floating toolbar when the user clicks outside it
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (selectionMode === 'thinking' || selectionMode === 'streaming') return;
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement | null;
        const isScrollbar = target && (target === scrollContainerRef.current && (e.offsetX > target.clientWidth || e.offsetY > target.clientHeight));
        if (isScrollbar) return;

        if (selectionPosition) {
          clearSelectionState();
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [selectionPosition !== null, selectionMode]);

  // Human-readable label for which part of the resume a change touches.
  const changeContextLabel = (change: ResumeChange): string => {
    switch (change.section) {
      case 'summary':
        return 'Professional Summary';
      case 'skills':
        return 'Skills';
      case 'keyAchievements':
        return 'Key Achievements';
      case 'experience': {
        const exp = data.experience?.find(e => e.id === change.itemId);
        if (exp) {
          const role = exp.role?.trim();
          const company = exp.company?.trim();
          if (role && company) return `Experience — ${role} at ${company}`;
          if (role) return `Experience — ${role}`;
          if (company) return `Experience — ${company}`;
        }
        return 'Experience';
      }
      default:
        return change.section ? change.section.charAt(0).toUpperCase() + change.section.slice(1) : 'Resume';
    }
  };

  const handleZoomIn = () => {
    if (propOnZoomIn) propOnZoomIn();
    else setInternalZoom((prev) => Math.min(prev + 0.1, 1.5));
  };
  const handleZoomOut = () => {
    if (propOnZoomOut) propOnZoomOut();
    else setInternalZoom((prev) => Math.max(prev - 0.1, 0.5));
  };
  const handleResetZoom = () => {
    if (propOnResetZoom) propOnResetZoom();
    else setInternalZoom(embedded ? 0.9 : 1.2);
  };


  // Check if the current resume has content
  const checkIsResumeEmpty = () => {
    const hasName = !!data.fullName?.trim();
    const hasSummary = !!data.summary?.trim();
    const hasExperience = Array.isArray(data.experience) && data.experience.some(exp => exp.company?.trim() || exp.role?.trim() || (Array.isArray(exp.description) ? exp.description.length > 0 : exp.description?.trim()));
    const hasSkills = !!data.skills?.trim();

    return !hasName && !hasSummary && !hasExperience && !hasSkills;
  };

  // Options shared by every selection-based edit: body text only, and the DOM
  // offset of the selection within its field so a repeated span (e.g. the same
  // word bolded twice) is edited at the occurrence the user actually selected.
  const selectionMatchOpts = { bodyTextOnly: true, selectionOffset };

  // Execute direct inline AI action (Improve, Expand, Tone, or Custom Prompt from Ask Agent)
  const handleRunSelectionAction = async (actionName: string, customPrompt?: string) => {
    const origText = originalSelectedTextRef.current || selectedText;
    if (!origText.trim()) return;

    if (checkIsResumeEmpty()) {
      showToast('This resume is currently empty. Please add your work history or upload an existing resume before rewriting.', 'info');
      clearSelectionState();
      return;
    }

    setSelectionMode('thinking');
    setCurrentSelectionAction(actionName);

    let instruction = customPrompt;
    if (!instruction) {
      if (actionName === 'Improve') {
        instruction = 'Improve the phrasing to be more impactful with strong action verbs and metrics.';
      } else if (actionName === 'Expand') {
        instruction = 'Expand and elaborate this text with more professional detail, quantifiable impact, scope, and depth, while maintaining factual credibility.';
      } else {
        instruction = actionName;
      }
    }

    // Commit any pending in-sheet typing so the rewrite targets the freshest
    // text (the selection is only matchable once it exists in ResumeData).
    const base = flushPendingInput() ?? data;
    const match = findBestTextMatch(origText, base, selectionContext, selectionMatchOpts);
    let targetCompany: string | undefined;
    let targetRole: string | undefined;
    if (match && match.path.startsWith('experience.')) {
      const expIndex = parseInt(match.path.split('.')[1], 10);
      if (!isNaN(expIndex) && base.experience?.[expIndex]) {
        targetCompany = base.experience[expIndex].company;
        targetRole = base.experience[expIndex].role;
      }
    }

    try {
      const rewrittenText = await rewriteTextInline(origText, instruction, jobData, {
        resumeData: base,
        targetRole,
        targetCompany,
      });
      pendingRewrittenTextRef.current = rewrittenText;
      setGeneratedSuggestion(rewrittenText);
      // NOTE: Do not mutate ResumeData yet; user must review comparison and confirm.
      setSelectionMode('result');
    } catch (e) {
      console.error('Inline rewrite error:', e);
      setSelectionMode('idle');
    }
  };

  const handleKeepSelection = () => {
    const origText = originalSelectedTextRef.current || selectedText;
    const replacement = pendingRewrittenTextRef.current;
    if (origText && replacement) {
      const base = flushPendingInput() ?? data;
      const updated = replaceSelectedText(base, origText, replacement, selectionContext, selectionMatchOpts);
      onChangeData(updated);
    }
    clearSelectionState();
  };

  const handleDiscardSelection = () => {
    // No changes were committed to ResumeData yet, simply clear the selection/toolbar
    clearSelectionState();
  };

  // Whether the SELECTED span is already wrapped in the given tag. Scoped to the
  // field the selection belongs to (not "anywhere in the resume"), so a bold word
  // in the summary no longer makes the Bold button show "Remove Bold" for a
  // plain word selected in a bullet. Positional: when the same word appears
  // twice and only the first is bolded, selecting the second reports "not
  // formatted".
  const activeFormats = {
    bold:
      isTextFormatted(selectedText, data, 'strong', selectionContext, selectionMatchOpts) ||
      isTextFormatted(selectedText, data, 'b', selectionContext, selectionMatchOpts),
    italic:
      isTextFormatted(selectedText, data, 'em', selectionContext, selectionMatchOpts) ||
      isTextFormatted(selectedText, data, 'i', selectionContext, selectionMatchOpts),
    underline: isTextFormatted(selectedText, data, 'u', selectionContext, selectionMatchOpts),
    link: isTextFormatted(selectedText, data, 'a', selectionContext, selectionMatchOpts),
  };

  // Copy the selected text to the clipboard. Keeps the toolbar active (selection
  // unchanged), like Microsoft Word.
  const handleCopySelection = async () => {
    const text = selectedText.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Clipboard API unavailable (insecure context / permission denied): fall
      // back to a hidden textarea + execCommand('copy').
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  // Replace the selected span with the clipboard contents (plain text), like
  // Word's paste-over-selection. Clears the toolbar because the document changed
  // under the selection.
  const handlePasteSelection = async () => {
    if (!selectedText.trim()) return;
    // Commit pending typing first: the deferred write-back would otherwise read
    // the old DOM against the pasted data and revert the paste.
    const base = flushPendingInput() ?? data;
    let clipboardText = '';
    try {
      clipboardText = await navigator.clipboard.readText();
    } catch (e) {
      // Reading the clipboard needs permission + a secure context; fall back to a
      // manual paste box so the action still works everywhere.
      const typed = window.prompt('Paste your text here:', '');
      clipboardText = typed ?? '';
    }
    const text = clipboardText.trim();
    if (!text) return;
    const updated = replaceSelectedText(base, selectedText, text, selectionContext, selectionMatchOpts);
    if (updated === base) return;
    onChangeData(updated);
    clearSelectionState();
  };

  // Apply rich-text formatting to the exact field the selection belongs to,
  // Microsoft-Word style: wraps the selected span in the tag, or removes the
  // wrapping when it is already applied.
  const handleInlineFormat = (formatType: 'bold' | 'italic' | 'underline' | 'link') => {
    if (!selectedText.trim()) return;

    // Base the toggle on the freshest data: commit pending typing first so the
    // format lands on top of it (and the deferred write-back cannot revert it).
    const base = flushPendingInput() ?? data;
    let updated: ResumeData;
    if (formatType === 'link') {
      if (activeFormats.link) {
        // Remove the link
        updated = toggleInlineLink(base, selectedText, null, selectionContext, selectionMatchOpts);
      } else {
        const url = prompt('Enter URL for link:', 'https://');
        if (url === null) return;
        updated = toggleInlineLink(base, selectedText, url, selectionContext, selectionMatchOpts);
      }
    } else {
      const tagMap: Record<string, string> = {
        bold: 'strong',
        italic: 'em',
        underline: 'u',
      };
      updated = toggleInlineTag(base, selectedText, tagMap[formatType], selectionContext, selectionMatchOpts);
    }

    if (updated === base) return;
    onChangeData(updated);
    // DO NOT CLEAR SELECTION STATE! Keep selection & toolbar active like Microsoft Word
  };

  // Detect text selection on paper preview
  const handleSelectionCheck = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        return;
      }
      const selText = selection.toString();
      const text = selText.trim();
      if (text.length > 2 && paperRef.current) {
        try {
          const range = selection.getRangeAt(0);
          const context = getSelectionContextText(range);
          // Only body text responds to the inline toolbar — summary paragraphs,
          // bullets, achievement lines, project descriptions. Dates, section
          // headers, and experience headers (job title, company, location)
          // never surface the toolbar, even when highlighted. The checks below
          // are positional/structural, so highlighting a date or a header no
          // longer triggers the toolbar just because the same words also appear
          // in a bullet or the summary.
          if (isStructuralDomSelection(range)) return;
          if (context && isStructuralText(context, data)) return;
          if (!findBestTextMatch(text, data, context, { bodyTextOnly: true })) return;
          if (context && !findBestTextMatch(context, data, undefined, { bodyTextOnly: true })) return;
          lastRangeRef.current = range.cloneRange();
          const rect = range.getBoundingClientRect();
          const paperRect = paperRef.current.getBoundingClientRect();

          if (rect && rect.width > 0) {
            setSelectedText(text);
            originalSelectedTextRef.current = text;
            pendingRewrittenTextRef.current = '';
            setGeneratedSuggestion(null);
            setSelectionMode('idle');
            setCurrentSelectionAction('Improve');
            setSelectionContext(context);
            // Offset of the selection start within its field element — lets the
            // formatter edit the EXACT occurrence of a repeated span.
            const ctxEl = contextElementFor(range, context);
            setSelectionOffset(ctxEl ? selectionStartOffsetIn(ctxEl, range) : -1);
            const currentZoom = zoom || 1;
            lastSelectionPaperOffsetRef.current = {
              top: (rect.top - paperRect.top) / currentZoom,
              left: (rect.left - paperRect.left) / currentZoom,
              width: rect.width / currentZoom,
              height: rect.height / currentZoom,
            };

            setSelectionPosition({
              top: rect.top - 55,
              left: Math.max(rect.left + rect.width / 2 - 150, 20),
            });

            const rects = Array.from(range.getClientRects())
              .map(r => ({
                top: (r.top - paperRect.top) / currentZoom,
                left: (r.left - paperRect.left) / currentZoom,
                width: r.width / currentZoom,
                height: r.height / currentZoom,
              }))
              .filter(r => r.width > 0 && r.height > 0);

            setHighlightRects(rects);
          }
        } catch (e) {
          console.warn('Selection position calculation error:', e);
        }
      }
    }, 20);
  };


  const handleToolbarSave = () => {
    const flushed = flushPendingInput();
    if (propOnSave) {
      propOnSave(flushed || undefined);
    }
  };

  return (
    <div className="flex flex-col bg-brand-bg border-r border-brand-border h-full relative overflow-hidden">
      {/* Floating Figma-style Toolbar Dock */}
      {!hideToolbar && (
        <ResumeAgentToolbar
          data={data}
          onChangeData={handleInternalChangeData}
          onOpenDesignModal={() => (onOpenDesignModal ? onOpenDesignModal() : setIsDesignModalOpen(true))}
          onOpenAddSection={() => setIsAddSectionModalOpen(true)}
          canUndo={effectiveCanUndo}
          canRedo={effectiveCanRedo}
          onUndo={handleInternalUndo}
          onRedo={handleInternalRedo}
          embedded={embedded}
        />
      )}

      {/* Main Canvas: Always render the live visual resume preview */}
      <div ref={scrollContainerRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 pb-28 flex justify-center items-start custom-scrollbar bg-brand-bg">
          <div
            className="transition-transform duration-200 origin-top relative rounded-sm bg-transparent group/canvas"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Rendered document preview. Not directly editable — typing into a
                contentEditable surface was silently discarded on the next render.
                Edits flow through the forms, the agent, and selection→AI-rewrite;
                selecting text still surfaces the floating rewrite toolbar. */}
            <div
              ref={paperRef}
              data-resume-paper="true"
              onMouseUp={handleSelectionCheck}
              onKeyUp={handleSelectionCheck}
              className="select-text relative"
              title="Click any text to edit it directly, or select text to rewrite it with AI"
            >
              <ResumePreview
                data={data}
                template={template}
                editable={true}
                editHold={editHold}
                onSheetsReinjected={handleSheetsReinjected}
                onDomBlur={handleDomBlur}
                onDomInput={handleDomInput}
                onBulletEnter={handleBulletEnter}
                onBulletBackspace={handleBulletBackspace}
                onSkillEnter={handleSkillEnter}
                onSkillBackspace={handleSkillBackspace}
              />

              {/* Highlight overlay — paper-relative so it scrolls naturally with the document */}
              {highlightRects.map((r, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: `${r.top}px`,
                    left: `${r.left}px`,
                    width: `${r.width}px`,
                    height: `${r.height}px`,
                    backgroundColor: 'rgba(112, 224, 152, 0.40)',
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />
              ))}
            </div>

            {/* Interactive Canvas Triggers (Add Section & Reorder) */}
            {showSectionControls && (onAddSection || onReorderSections) && (
              <div className="flex items-center justify-center gap-3 pt-8 pb-16 w-full flex-wrap">
                {onAddSection && (
                  <button
                    type="button"
                    onClick={() => setIsAddSectionModalOpen(true)}
                    className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300/90 hover:border-brand-green text-brand-dark font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-green/20 group-hover:bg-brand-green text-brand-dark flex items-center justify-center transition-colors">
                      <Plus className="w-3.5 h-3.5 text-emerald-800" />
                    </div>
                    <span>Add Section</span>
                  </button>
                )}

                {onReorderSections && (
                  <button
                    type="button"
                    onClick={() => setIsReorderModalOpen(true)}
                    className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300/90 hover:border-slate-400 text-brand-dark font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors">
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                    <span>Reorder</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      {/* Floating Selection Action Toolbar */}
      {selectionPosition && (
        <div ref={toolbarRef}>
          <SelectionActionsToolbar
            selectedText={selectedText}
            suggestedText={generatedSuggestion}
            position={selectionPosition}
            activeFormats={activeFormats}
            onInlineFormat={handleInlineFormat}
            onCopy={handleCopySelection}
            onPaste={handlePasteSelection}
            onRunAction={handleRunSelectionAction}
            onKeep={handleKeepSelection}
            onDiscard={handleDiscardSelection}
            onClose={clearSelectionState}
            mode={selectionMode}
            currentAction={currentSelectionAction}
          />
        </div>
      )}


      {/* Fullscreen Overlay Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col animate-fade-in select-none">
          <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-sm tracking-wide">Fullscreen Document Preview</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-800 rounded-lg p-1 text-xs text-white border border-slate-700">
                <button onClick={handleZoomOut} className="p-1 hover:bg-slate-700 rounded">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-bold text-xs">{Math.round(zoom * 100)}%</span>
                <button onClick={handleZoomIn} className="p-1 hover:bg-slate-700 rounded">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Close Fullscreen</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
            <div
              className="transition-transform duration-200 origin-top rounded-sm bg-transparent"
              style={{ transform: `scale(${zoom})` }}
            >
              <ResumePreview data={data} template={template} editable={false} />
            </div>
          </div>
        </div>
      )}
      {/* Design Customization Slide-Over Modal */}
      <DesignCustomizationModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        data={data}
        onChangeData={onChangeData}
      />

      {/* Batch Bullet & Section Improve Modal */}
      <BatchBulletImproveModal
        isOpen={isBatchImproveModalOpen}
        onClose={() => setIsBatchImproveModalOpen(false)}
        data={data}
        onChangeData={onChangeData}
        jobData={jobData}
        initialTargetKey={batchImproveTargetKey}
      />

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        data={data}
        onAddSection={handleInternalAddSection}
      />

      {/* Reorder Sections Modal */}
      {onReorderSections && (
        <ReorderSectionsModal
          isOpen={isReorderModalOpen}
          onClose={() => setIsReorderModalOpen(false)}
          data={data}
          onReorder={onReorderSections}
          onToggleVisibility={onToggleSectionVisibility}
        />
      )}
    </div>
  );
}
