'use client';

import { Button } from '@/components/ui/Button';
import { importTheme } from '@/lib/theme-importer';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';
import { Download, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

export function Toolbar() {
  const { theme, setThemeName, setThemeType, loadTheme, canUndo, canRedo, undo, redo } =
    useThemeStore();
  const { openShareModal, openExportModal, isReadOnly, setReadOnly } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<'dark' | 'light' | null>(null);

  const handleTypeChange = (type: 'dark' | 'light') => {
    if (type === theme.type) return;
    if (canUndo) {
      setPendingType(type);
    } else {
      setThemeType(type);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importTheme(file);
      loadTheme(imported);
      setImportError(null);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <>
      <div className='flex items-center gap-3 px-4 h-12 border-b border-border bg-surface-1 flex-shrink-0'>
        {/* Logo */}
        <div className='flex items-center gap-2 mr-3'>
          <Image src='/logo.svg' alt='ThemeForge' width={32} height={32} />
          <span className='text-sm font-semibold text-text-primary hidden sm:block'>ThemeForge</span>
        </div>

        {/* Divider */}
        <div className='h-5 w-px bg-border' />

        {isReadOnly ? (
          <div className='flex items-center gap-3'>
            <span className='text-sm text-text-secondary truncate max-w-48'>{theme.name}</span>
            <span className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-text-muted border border-border'>
              view only
            </span>
          </div>
        ) : (
          <>
            {/* Theme name */}
            <input
              value={theme.name}
              onChange={e => setThemeName(e.target.value)}
              onBlur={() => {
                if (!theme.name.trim()) {
                  setThemeName(theme.type === 'light' ? 'My Light Theme' : 'My Dark Theme');
                }
              }}
              className='bg-transparent border-none text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-0 min-w-0 max-w-48'
              placeholder='Theme name...'
              spellCheck={false}
            />

            {/* Theme type toggle */}
            <div className='flex items-center gap-1 bg-surface-2 border border-border rounded-md p-0.5 ml-1'>
              {(['dark', 'light'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors capitalize ${
                    theme.type === type
                      ? 'bg-surface-4 text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Undo / Redo */}
        {!isReadOnly && (
          <div className='flex items-center gap-0.5 ml-1'>
            <button
              onClick={undo}
              disabled={!canUndo}
              title='Undo (Ctrl+Z)'
              className='p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors disabled:opacity-25 disabled:cursor-not-allowed'
            >
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title='Redo (Ctrl+Y)'
              className='p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors disabled:opacity-25 disabled:cursor-not-allowed'
            >
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6' />
              </svg>
            </button>
          </div>
        )}

        {/* Spacer */}
        <div className='flex-1' />

        {importError && (
          <span className='text-[11px] text-red-400 truncate max-w-48'>{importError}</span>
        )}

        {isReadOnly ? (
          <Button size='sm' onClick={() => setReadOnly(false)}>
            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
            </svg>
            Edit a copy
          </Button>
        ) : (
          <>
            <input ref={fileInputRef} type='file' accept='.json,.vsix' className='hidden' onChange={handleImport} />
            <Button variant='ghost' size='sm' onClick={() => fileInputRef.current?.click()}>
              <Download className='w-3.5 h-3.5' />
              Import
            </Button>

            <Button variant='ghost' size='sm' onClick={openShareModal}>
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' />
              </svg>
              Share
            </Button>

            <Button size='sm' onClick={openExportModal}>
              <Upload className='w-3.5 h-3.5' />
              Export
            </Button>
          </>
        )}
      </div>

      {/* Theme type switch confirmation modal */}
      {pendingType && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={() => setPendingType(null)} />
          <div className='relative z-10 bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4'>
            <h2 className='text-sm font-semibold text-text-primary'>
              Switch to {pendingType} theme?
            </h2>
            <p className='text-xs text-text-secondary'>
              Your current changes will be lost and replaced with the default{' '}
              <span className='text-text-primary capitalize'>{pendingType}</span> theme.
            </p>
            <div className='flex gap-2 justify-end'>
              <Button variant='ghost' size='sm' onClick={() => setPendingType(null)}>
                Cancel
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  setThemeType(pendingType);
                  setPendingType(null);
                }}
              >
                Switch
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
