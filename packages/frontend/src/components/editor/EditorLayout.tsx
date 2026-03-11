'use client';

import { EditorsModal } from '@/components/modals/EditorsModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { useThemeStore } from '@/store/theme.store';
import Link from 'next/link';
import { useEffect } from 'react';
import { PreviewPanel } from './PreviewPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';

export function EditorLayout() {
  const { undo, redo } = useThemeStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  return (
    <div className='h-screen flex flex-col bg-surface-0 overflow-hidden'>
      <Toolbar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <PreviewPanel />
        <PropertiesPanel />
      </div>
      <ShareModal />
      <ExportModal />
      <EditorsModal />
      <footer className='flex items-center justify-between px-4 py-1.5 border-t border-border bg-surface-1 text-[10px] text-text-muted shrink-0'>
        <a
          href='https://github.com/erenisci/themeforge/blob/master/LICENSE'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-text-secondary transition-colors'
        >
          MIT License
        </a>
        <div className='flex items-center gap-3'>
          <a
            href='https://github.com/erenisci/themeforge'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-text-secondary transition-colors'
          >
            GitHub
          </a>
          <Link
            href='/gallery'
            className='hover:text-text-secondary transition-colors'
          >
            Gallery
          </Link>
          <Link
            href='/legal/terms'
            className='hover:text-text-secondary transition-colors'
          >
            Terms
          </Link>
          <Link
            href='/legal/privacy'
            className='hover:text-text-secondary transition-colors'
          >
            Privacy
          </Link>
          <a
            href='https://github.com/erenisci/themeforge/issues'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-text-secondary transition-colors'
          >
            Report abuse
          </a>
        </div>
      </footer>
    </div>
  );
}
