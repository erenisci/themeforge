'use client';

import { EditorsModal } from '@/components/modals/EditorsModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { PreviewPanel } from './PreviewPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';

export function EditorLayout() {
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
    </div>
  );
}
