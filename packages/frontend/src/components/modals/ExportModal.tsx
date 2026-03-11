'use client';

import { Button } from '@/components/ui/Button';
import { useExport } from '@/hooks/useExport';
import { useUIStore } from '@/store/ui.store';

export function ExportModal() {
  const { exportModalOpen, closeExportModal } = useUIStore();
  const { exportVSIX } = useExport();

  if (!exportModalOpen) return null;

  const handleExport = async () => {
    await exportVSIX();
    closeExportModal();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={closeExportModal}
      />
      <div className='relative z-10 bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-semibold text-text-primary'>Export Theme</h2>
          <button
            onClick={closeExportModal}
            className='text-text-muted hover:text-text-primary transition-colors'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <p className='text-xs text-text-secondary'>
          Downloads as a <code className='text-text-primary bg-surface-3 px-1 rounded'>.vsix</code>{' '}
          file. Drag it into the Extensions panel or use{' '}
          <code className='text-text-primary bg-surface-3 px-1 rounded'>
            Extensions: Install from VSIX
          </code>
          .
        </p>

        <div className='flex gap-2'>
          <Button
            onClick={handleExport}
            className='flex-1'
          >
            <svg
              className='w-4 h-4'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 19.06V4.94a1.5 1.5 0 0 0-.85-1.353z' />
            </svg>
            VS Code
          </Button>
          <Button
            onClick={handleExport}
            variant='outline'
            className='flex-1'
          >
            <svg
              className='w-4 h-4'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
            </svg>
            Cursor
          </Button>
        </div>

        <p className='text-[10px] text-text-muted'>VS Code and Cursor use the same .vsix format.</p>
      </div>
    </div>
  );
}
