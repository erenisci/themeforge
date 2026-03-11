'use client';

import { LANGUAGES, LANGUAGE_LIST } from '@/data/languages';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useRef, useState } from 'react';
import { TokenizedCode } from './TokenizedCode';

// Maps color keys to which preview region they belong to
const REGION_MAP: Record<string, string> = {
  'titleBar.activeBackground': 'titlebar',
  'titleBar.activeForeground': 'titlebar',
  'activityBar.background': 'activitybar',
  'activityBar.foreground': 'activitybar',
  'sideBar.background': 'sidebar',
  'sideBar.foreground': 'sidebar',
  'statusBar.background': 'statusbar',
  'statusBar.foreground': 'statusbar',
  'editor.background': 'editor',
  'editor.foreground': 'editor',
  'editor.lineHighlightBackground': 'editor',
  'editor.selectionBackground': 'editor',
  'breadcrumb.foreground': 'editor',
  'breadcrumb.activeSelectionForeground': 'editor',
};

// Terminal color keys all map to 'terminal'
const TERMINAL_KEY_PREFIX = 'terminal.';

// Syntax scopes map to 'editor' region
const SYNTAX_SCOPE_ROOTS = [
  'keyword',
  'string',
  'constant',
  'comment',
  'entity',
  'variable',
  'support',
  'storage',
];

function getMappedRegion(focusedKey: string | null): string | null {
  if (!focusedKey) return null;
  if (REGION_MAP[focusedKey]) return REGION_MAP[focusedKey];
  if (focusedKey.startsWith(TERMINAL_KEY_PREFIX)) return 'terminal';
  if (SYNTAX_SCOPE_ROOTS.some(r => focusedKey === r || focusedKey.startsWith(r + '.')))
    return 'editor';
  return null;
}

function highlightStyle(region: string, focusedKey: string | null): React.CSSProperties {
  if (getMappedRegion(focusedKey) !== region) return {};
  return { outline: '2px solid #5865f2', outlineOffset: '0px', zIndex: 10, position: 'relative' };
}

function hoverHighlightStyle(
  region: string,
  hoveredKey: string | null,
  focusedKey: string | null,
): React.CSSProperties {
  if (getMappedRegion(focusedKey) === region) return {}; // focus takes precedence
  if (getMappedRegion(hoveredKey) !== region) return {};
  return {
    outline: '1px solid rgba(88,101,242,0.25)',
    animation: 'region-pulse 1s ease-out forwards',
    position: 'relative',
    zIndex: 5,
  };
}

// Terminal line tokens structure
interface TerminalToken {
  text: string;
  colorKey?: string; // terminal.ansiGreen etc — undefined = terminal.foreground
  clickKey?: string; // which key to focus when clicked
}
interface TerminalLine {
  tokens: TerminalToken[];
  extra?: boolean; // only show when terminal panel expanded
}

const TERMINAL_LINES: TerminalLine[] = [
  {
    tokens: [
      { text: 'user@machine', colorKey: 'terminal.ansiGreen', clickKey: 'terminal.ansiGreen' },
      { text: ':' },
      { text: '~/project', colorKey: 'terminal.ansiCyan', clickKey: 'terminal.ansiCyan' },
      { text: ' $ npm run dev' },
    ],
  },
  {
    tokens: [
      {
        text: '  ✔ compiled successfully in 342ms',
        colorKey: 'terminal.ansiGreen',
        clickKey: 'terminal.ansiGreen',
      },
    ],
  },
  {
    tokens: [
      {
        text: "  ⚠ warning: unused variable 'x'",
        colorKey: 'terminal.ansiYellow',
        clickKey: 'terminal.ansiYellow',
      },
    ],
  },
  {
    tokens: [
      { text: '  ✗ error: ', colorKey: 'terminal.ansiRed', clickKey: 'terminal.ansiRed' },
      { text: 'Cannot find module ' },
      {
        text: "'./missing'",
        colorKey: 'terminal.ansiBrightRed',
        clickKey: 'terminal.ansiBrightRed',
      },
    ],
  },
  {
    extra: true,
    tokens: [{ text: '' }],
  },
  {
    extra: true,
    tokens: [
      { text: 'user@machine', colorKey: 'terminal.ansiGreen', clickKey: 'terminal.ansiGreen' },
      { text: ':' },
      { text: '~/project', colorKey: 'terminal.ansiCyan', clickKey: 'terminal.ansiCyan' },
      { text: ' $ ' },
    ],
  },
];

const ACTIVITY_ICONS = [
  'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v10m0 0h10m-10 0H5m4 0v6',
  'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
];

interface SortableTabProps {
  langId: string;
  label: string;
  isActive: boolean;
  editorBg: string;
  titleBg: string;
  titleFg: string;
  sidebarBorder: string;
  tabActiveBorder: string;
  onActivate: () => void;
  onClose: (e: React.MouseEvent) => void;
}

function SortableTab({
  langId,
  label,
  isActive,
  editorBg,
  titleBg,
  titleFg,
  sidebarBorder,
  tabActiveBorder,
  onActivate,
  onClose,
}: SortableTabProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: langId,
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onActivate}
      className='flex items-center gap-1.5 px-3 h-full border-r text-[11px] transition-colors select-none'
      style={{
        background: isActive ? editorBg : `${titleBg}cc`,
        color: isActive ? titleFg : `${titleFg}77`,
        borderColor: sidebarBorder,
        borderBottom: isActive ? `2px solid ${tabActiveBorder}` : '2px solid transparent',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'pointer',
        touchAction: 'none',
      }}
    >
      <span>{label}</span>
      <span
        className='opacity-40 hover:opacity-100 text-[10px] ml-0.5 transition-opacity'
        onClick={onClose}
      >
        ×
      </span>
    </button>
  );
}

export function VSCodeChrome() {
  const colors = useThemeStore(s => s.theme.colors);
  const themeName = useThemeStore(s => s.theme.name);
  const {
    focusedColorKey,
    hoveredColorKey,
    activePanel,
    activeLanguage,
    openTabs,
    addTab,
    removeTab,
    reorderTabs,
    setActiveLanguage,
    setActivePanel,
    setFocusedColorKey,
  } = useUIStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = openTabs.indexOf(active.id as string);
      const newIndex = openTabs.indexOf(over.id as string);
      reorderTabs(arrayMove(openTabs, oldIndex, newIndex));
    }
  };

  const currentLang = activeLanguage
    ? (LANGUAGES[activeLanguage] ?? LANGUAGES['typescript'])
    : null;

  // Track which explorer file is "active" (clicked)
  const [activeFile, setActiveFile] = useState<string>(currentLang?.filename ?? '');
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const plusBtnRef = useRef<HTMLButtonElement>(null);

  // When language changes, reset active file to that language's main file
  useEffect(() => {
    if (currentLang) setActiveFile(currentLang.filename);
  }, [activeLanguage]);

  // Resolve active file's breadcrumb and lines
  const activeFileData = currentLang?.explorer.find(f => f.name === activeFile);
  const activeBreadcrumb = activeFileData?.breadcrumb ?? currentLang?.breadcrumb ?? [];
  const activeLines = activeFileData?.lines ?? currentLang?.lines ?? [];

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  const titleBg = colors['titleBar.activeBackground'] || '#3c3c3c';
  const titleFg = colors['titleBar.activeForeground'] || '#cccccc';
  const activityBg = colors['activityBar.background'] || '#333333';
  const activityFg = colors['activityBar.foreground'] || '#ffffff';
  const statusBg = colors['statusBar.background'] || '#007acc';
  const statusFg = colors['statusBar.foreground'] || '#ffffff';
  const sidebarBg = colors['sideBar.background'] || '#252526';
  const sidebarFg = colors['sideBar.foreground'] || '#cccccc';
  const sidebarBorder = colors['sideBar.border'] || '#333333';
  const editorBg = colors['editor.background'] || '#1e1e1e';
  const editorFg = colors['editor.foreground'] || '#d4d4d4';
  const terminalBg = colors['terminal.background'] || editorBg;
  const terminalFg = colors['terminal.foreground'] || editorFg;
  const activeSelBg = colors['list.activeSelectionBackground'] || '#094771';
  const activeSelFg = colors['list.activeSelectionForeground'] || '#ffffff';
  const hoverBg = colors['list.hoverBackground'] || '#2a2d2e';
  const breadcrumbFg = colors['breadcrumb.foreground'] || `${editorFg}99`;
  const breadcrumbActiveFg = colors['breadcrumb.activeSelectionForeground'] || editorFg;
  const tabActiveBorder =
    colors['tab.activeBorderTop'] || colors['statusBar.background'] || '#007acc';

  const showTerminal = activePanel === 'terminal';

  const hs = (region: string) => ({
    ...highlightStyle(region, focusedColorKey),
    ...hoverHighlightStyle(region, hoveredColorKey, focusedColorKey),
  });

  const resolveTerminalColor = (colorKey?: string) => {
    if (!colorKey) return terminalFg;
    return colors[colorKey] || terminalFg;
  };

  const handleTerminalClick = (clickKey?: string) => {
    if (!clickKey) return;
    setActivePanel('terminal');
    setFocusedColorKey(clickKey);
  };

  return (
    <div
      className='flex flex-col h-full overflow-hidden rounded-md border border-border'
      style={{
        background: editorBg,
        ['--editor-selection-bg' as string]:
          colors['editor.selectionBackground'] || 'rgba(88,101,242,0.35)',
      }}
    >
      {/* Title bar */}
      <div
        className='flex items-center gap-2 px-3 h-8 flex-shrink-0 text-xs select-none'
        style={{ background: titleBg, color: titleFg, ...hs('titlebar') }}
      >
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-3 rounded-full bg-[#ff5f57]' />
          <div className='w-3 h-3 rounded-full bg-[#ffbd2e]' />
          <div className='w-3 h-3 rounded-full bg-[#28c840]' />
        </div>
        <span className='ml-auto opacity-60 text-[10px]'>{themeName}</span>
      </div>

      {/* Tab bar */}
      <div
        className='flex items-end h-9 flex-shrink-0 text-xs select-none overflow-x-auto'
        style={{ background: titleBg, overflowY: 'visible' }}
      >
        <div
          className='flex items-end h-full relative'
          ref={pickerRef}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={openTabs}
              strategy={horizontalListSortingStrategy}
            >
              {openTabs.map(langId => {
                const l = LANGUAGES[langId];
                if (!l) return null;
                const isActive = langId === activeLanguage;
                return (
                  <SortableTab
                    key={langId}
                    langId={langId}
                    label={l.label}
                    isActive={isActive}
                    editorBg={editorBg}
                    titleBg={titleBg}
                    titleFg={titleFg}
                    sidebarBorder={sidebarBorder}
                    tabActiveBorder={tabActiveBorder}
                    onActivate={() => setActiveLanguage(langId as 'typescript' | 'python')}
                    onClose={e => {
                      e.stopPropagation();
                      removeTab(langId);
                    }}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
          {/* + button */}
          <button
            ref={plusBtnRef}
            className='flex items-center justify-center px-2 h-full text-[14px] opacity-40 hover:opacity-80 transition-opacity'
            style={{ color: titleFg }}
            onClick={() => {
              const rect = plusBtnRef.current?.getBoundingClientRect();
              if (rect) setPickerPos({ top: rect.bottom + 2, left: rect.left });
              setPickerOpen(o => !o);
            }}
          >
            +
          </button>
          {/* Language picker dropdown — fixed to + button position */}
          {pickerOpen && (
            <div
              className='fixed z-[9999] bg-surface-2 border border-border rounded shadow-lg py-1 min-w-[120px]'
              style={{ top: pickerPos.top, left: pickerPos.left }}
            >
              {LANGUAGE_LIST.filter(l => !openTabs.includes(l.id)).map(l => (
                <button
                  key={l.id}
                  className='w-full text-left px-3 py-1.5 text-[11px] text-text-primary hover:bg-surface-3 transition-colors'
                  onClick={() => {
                    addTab(l.id);
                    setPickerOpen(false);
                  }}
                >
                  {l.label}
                </button>
              ))}
              {LANGUAGE_LIST.every(l => openTabs.includes(l.id)) && (
                <span className='block px-3 py-1.5 text-[11px] text-text-muted'>
                  All languages open
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className='flex flex-1 overflow-hidden min-h-0'>
        {/* Activity bar */}
        <div
          className='w-10 flex-shrink-0 flex flex-col items-center py-2 gap-4'
          style={{ background: activityBg, ...hs('activitybar') }}
        >
          {ACTIVITY_ICONS.map((path, i) => (
            <svg
              key={i}
              className='w-5 h-5 opacity-60 hover:opacity-100 transition-opacity'
              fill='none'
              stroke={activityFg}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d={path}
              />
            </svg>
          ))}
        </div>

        {/* Sidebar / Explorer */}
        <div
          className='w-40 flex-shrink-0 border-r text-[11px] py-1 overflow-hidden flex flex-col'
          style={{
            background: sidebarBg,
            borderColor: sidebarBorder,
            color: sidebarFg,
            ...hs('sidebar'),
          }}
        >
          <div className='px-3 py-1 text-[9px] uppercase tracking-widest opacity-50 font-semibold'>
            Explorer
          </div>
          {(currentLang?.explorer ?? []).map((file, i) => {
            const isActive = file.name === activeFile;
            const indent = file.indent ?? 0;

            // If this file belongs to a collapsed folder (indent > 0 and prev folder is collapsed)
            if (!file.isFolder && indent > 0) {
              const parentFolder = (currentLang?.explorer ?? [])
                .slice(0, i)
                .reverse()
                .find(f => f.isFolder && (f.indent ?? 0) < indent);
              if (parentFolder && collapsedFolders.has(parentFolder.name)) return null;
            }

            return (
              <div
                key={i}
                className='px-2 py-0.5 cursor-pointer flex items-center gap-1 transition-colors'
                style={{
                  paddingLeft: `${8 + indent * 12}px`,
                  background: isActive ? activeSelBg : undefined,
                  color: isActive ? activeSelFg : sidebarFg,
                }}
                onClick={() => {
                  if (file.isFolder) {
                    setCollapsedFolders(prev => {
                      const next = new Set(prev);
                      if (next.has(file.name)) next.delete(file.name);
                      else next.add(file.name);
                      return next;
                    });
                  } else {
                    setActiveFile(file.name);
                  }
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = hoverBg;
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = '';
                }}
              >
                {file.isFolder ? (
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 10 10'
                    className='opacity-50 flex-shrink-0'
                    style={{
                      transition: 'transform 0.15s',
                      transform: collapsedFolders.has(file.name)
                        ? 'rotate(-90deg)'
                        : 'rotate(0deg)',
                    }}
                  >
                    <path d='M2 3.5L5 6.5L8 3.5' stroke='currentColor' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                ) : (
                  <span className='w-2.5 flex-shrink-0' />
                )}
                <span>{file.name}</span>
              </div>
            );
          })}
        </div>

        {/* Editor + terminal area */}
        <div className='flex-1 flex flex-col overflow-hidden min-w-0'>
          {/* Breadcrumbs */}
          <div
            className='flex items-center h-6 flex-shrink-0 px-3 gap-1 text-[11px] select-none'
            style={{ background: editorBg, borderBottom: `1px solid ${sidebarBorder}20` }}
          >
            {activeBreadcrumb.map((crumb, i) => {
              const isLast = i === activeBreadcrumb.length - 1;
              return (
                <span
                  key={i}
                  className='flex items-center gap-1'
                >
                  {i > 0 && <span style={{ color: breadcrumbFg, opacity: 0.5 }}>›</span>}
                  <span style={{ color: isLast ? breadcrumbActiveFg : breadcrumbFg }}>{crumb}</span>
                </span>
              );
            })}
          </div>

          {/* Code editor */}
          <div
            className='flex-1 overflow-hidden min-h-0'
            style={hs('editor')}
          >
            <TokenizedCode lines={activeLines} />
          </div>

          {/* Terminal panel */}
          <div
            className='flex-shrink-0 border-t overflow-hidden transition-all duration-200'
            style={{
              borderColor: sidebarBorder,
              height: showTerminal ? 148 : 92,
            }}
          >
            {/* Terminal tab bar */}
            <div
              className='flex items-center h-7 px-2 gap-1 text-[10px] flex-shrink-0 border-b'
              style={{
                background: sidebarBg,
                color: terminalFg,
                borderColor: `${sidebarBorder}80`,
              }}
            >
              {['TERMINAL', 'PROBLEMS', 'OUTPUT'].map((tab, i) => (
                <div
                  key={tab}
                  className='px-2 py-0.5 rounded-sm'
                  style={
                    i === 0
                      ? {
                          background: terminalBg,
                          color: terminalFg,
                          borderBottom: `1px solid ${tabActiveBorder}`,
                        }
                      : { opacity: 0.4 }
                  }
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Terminal content */}
            <div
              className='px-3 py-1.5 font-mono text-[11px] leading-5 overflow-hidden'
              style={{ background: terminalBg, color: terminalFg, ...hs('terminal') }}
            >
              {TERMINAL_LINES.filter(l => !l.extra || showTerminal).map((line, li) => (
                <div
                  key={li}
                  className='flex flex-wrap'
                >
                  {line.tokens.map((tok, ti) => {
                    const color = resolveTerminalColor(tok.colorKey);
                    const clickable = !!tok.clickKey;
                    return (
                      <span
                        key={ti}
                        style={{ color }}
                        className={clickable ? 'cursor-pointer hover:underline' : ''}
                        onClick={clickable ? () => handleTerminalClick(tok.clickKey) : undefined}
                      >
                        {tok.text}
                      </span>
                    );
                  })}
                  {li === TERMINAL_LINES.filter(l => !l.extra || showTerminal).length - 1 &&
                    showTerminal && (
                      <span
                        className='animate-pulse'
                        style={{ color: terminalFg }}
                      >
                        ▌
                      </span>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div
        className='flex items-center gap-4 px-3 h-6 flex-shrink-0 text-[10px] select-none'
        style={{ background: statusBg, color: statusFg, ...hs('statusbar') }}
      >
        <span> main</span>
        <span className='ml-auto'>{currentLang?.statusBarLabel ?? ''}</span>
        <span>UTF-8</span>
        <span>Ln 11, Col 1</span>
      </div>
    </div>
  );
}
