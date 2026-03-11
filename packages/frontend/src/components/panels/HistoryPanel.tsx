'use client';

import { useThemeStore } from '@/store/theme.store';

function timeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function HistoryPanel() {
  const { history, future, jumpToHistory, clearHistory, undo, redo, canUndo, canRedo } =
    useThemeStore();

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
        <h2 className='text-xs font-semibold text-text-secondary uppercase tracking-wide'>History</h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className='text-[10px] text-text-muted hover:text-text-secondary transition-colors'
          >
            Clear
          </button>
        )}
      </div>

      {/* Undo / Redo buttons */}
      <div className='flex gap-2 px-4 py-2 border-b border-border'>
        <button
          onClick={undo}
          disabled={!canUndo}
          className='flex-1 flex items-center justify-center gap-1.5 h-7 rounded text-xs bg-surface-2 hover:bg-surface-3 text-text-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' />
          </svg>
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className='flex-1 flex items-center justify-center gap-1.5 h-7 rounded text-xs bg-surface-2 hover:bg-surface-3 text-text-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
        >
          Redo
          <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6' />
          </svg>
        </button>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {history.length === 0 ? (
          <p className='px-4 py-6 text-xs text-text-muted text-center'>
            No history yet.<br />Start editing to track changes.
          </p>
        ) : (
          <div className='py-1'>
            {/* Current state (top) */}
            <div className='flex items-center gap-2 px-4 py-2'>
              <div className='w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0' />
              <span className='text-xs text-text-primary font-medium flex-1'>Current state</span>
              {future.length > 0 && (
                <span className='text-[10px] text-text-muted'>{future.length} ahead</span>
              )}
            </div>

            {/* History entries — most recent first */}
            {[...history].reverse().map((entry, reversedIdx) => {
              const idx = history.length - 1 - reversedIdx;
              return (
                <button
                  key={`${entry.timestamp}-${idx}`}
                  onClick={() => jumpToHistory(idx)}
                  className='w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-surface-2 transition-colors group'
                >
                  <div className='w-1.5 h-1.5 rounded-full bg-surface-4 group-hover:bg-text-muted flex-shrink-0' />
                  <span className='text-xs text-text-secondary flex-1 truncate'>{entry.label}</span>
                  <span className='text-[10px] text-text-muted flex-shrink-0'>{timeAgo(entry.timestamp)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
