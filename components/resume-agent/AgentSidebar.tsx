import React, { useMemo } from 'react';
import {
  AISidebar,
  SidebarResource,
  SidebarResourceMove,
  SidebarResourceMenuControls,
} from '../agents/ai-sidebar';
import { Pencil, Trash2, Copy, PanelLeftClose, PanelLeftOpen, Plus, FileText, FolderOpen } from 'lucide-react';
import { SavedResume } from '../../services/resumeService';

interface AgentSidebarProps {
  resumes: SavedResume[];
  activeResumeId: string | null;
  activeResumeTitle?: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onLoadResume: (resume: SavedResume) => void;
  onRenameResume: (id: string, label: string) => Promise<void> | void;
  onDuplicateResume?: (id: string) => void;
  onDeleteResume: (id: string) => void;
  onNewResume: () => void;
}

const MENU_BUTTON_CLASS =
  'flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring';

/**
 * Left-hand resource sidebar for the Resume Agent workspace. Lists the user's
 * saved resumes (from the `resumes` table) as a folder tree built on the
 * shadcn AISidebar (beui ai-sidebar). Selecting a file loads that resume into
 * the workspace; rename/delete persist back to Supabase. Collapsible to a
 * narrow icon rail.
 */
export default function AgentSidebar({
  resumes,
  activeResumeId,
  activeResumeTitle,
  collapsed,
  onToggleCollapsed,
  onLoadResume,
  onRenameResume,
  onDuplicateResume,
  onDeleteResume,
  onNewResume,
}: AgentSidebarProps) {
  const items: SidebarResource[] = useMemo(
    () => [
      {
        id: 'folder-my-resumes',
        label: 'My Resumes',
        kind: 'project',
        children: resumes.map((r) => {
          const displayLabel =
            r.id === activeResumeId && activeResumeTitle?.trim()
              ? activeResumeTitle.trim()
              : r.title || 'Untitled resume';
          return {
            id: r.id,
            label: displayLabel,
            kind: 'file',
          };
        }),
      },
    ],
    [resumes, activeResumeId, activeResumeTitle]
  );

  // Drag-and-drop reorders the tree locally only (there's no position column to
  // persist to), so the move is always accepted.
  const handleMove = async (_move: SidebarResourceMove) => {};

  const handleRename = async (item: SidebarResource, label: string) => {
    if (item.kind === 'file') {
      await onRenameResume(item.id, label);
    }
    // Folders: cosmetic rename only, nothing to persist.
  };

  const renderMenu = (item: SidebarResource, controls: SidebarResourceMenuControls) => (
    <div className="flex flex-col gap-0.5">
      <button type="button" onClick={() => controls.rename()} className={MENU_BUTTON_CLASS}>
        <Pencil aria-hidden="true" className="size-3.5" />
        Rename
      </button>
      {item.kind === 'file' && onDuplicateResume && (
        <button
          type="button"
          onClick={() => {
            controls.close();
            onDuplicateResume(item.id);
          }}
          className={MENU_BUTTON_CLASS}
        >
          <Copy aria-hidden="true" className="size-3.5" />
          Duplicate
        </button>
      )}
      {item.kind === 'file' && (
        <button
          type="button"
          onClick={() => {
            controls.close();
            onDeleteResume(item.id);
          }}
          className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs text-red-600 outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
          Delete
        </button>
      )}
    </div>
  );

  const renderIcon = (item: SidebarResource) => {
    if (item.kind === 'file') return <FileText className="size-4 text-brand-dark/60" />;
    if (item.kind === 'project' || item.kind === 'folder')
      return <FolderOpen className="size-4 text-brand-green" />;
    return undefined;
  };

  // Collapsed: narrow icon rail so the workspace keeps its width.
  if (collapsed) {
    return (
      <aside className="w-12 shrink-0 h-full bg-white border-r border-brand-border flex flex-col items-center py-2.5 gap-1 select-none">
        <button
          type="button"
          onClick={onToggleCollapsed}
          title="Expand sidebar"
          className="p-2 rounded-lg text-brand-dark/60 hover:text-brand-dark hover:bg-gray-100 transition-colors"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onNewResume}
          title="New resume"
          className="p-2 rounded-lg text-brand-dark/60 hover:text-brand-dark hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 shrink-0 h-full bg-white border-r border-brand-border flex flex-col select-none">
      {/* Sidebar header */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-brand-border shrink-0">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-dark">
          Resumes
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onNewResume}
            title="New resume"
            className="p-1.5 rounded-lg text-brand-dark/60 hover:text-brand-dark hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleCollapsed}
            title="Collapse sidebar"
            className="p-1.5 rounded-lg text-brand-dark/60 hover:text-brand-dark hover:bg-gray-100 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resource tree */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-2">
        <AISidebar
          items={items}
          activeId={activeResumeId}
          onActiveChange={(id) => {
            const resume = resumes.find((r) => r.id === id);
            if (resume) onLoadResume(resume);
          }}
          onMove={handleMove}
          onRename={handleRename}
          renderMenu={renderMenu}
          renderIcon={renderIcon}
          defaultExpandedIds={['folder-my-resumes']}
          ariaLabel="Saved resumes"
        />
      </div>
    </aside>
  );
}
