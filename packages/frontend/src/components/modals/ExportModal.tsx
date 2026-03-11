'use client';

import { Button } from '@/components/ui/Button';
import { useExport } from '@/hooks/useExport';
import { useUIStore } from '@/store/ui.store';

const EDITOR_EXPORT_CONFIG: Record<
  string,
  { buttons: { label: string }[]; format: string; note: string }
> = {
  vscode: {
    buttons: [{ label: 'VS Code' }, { label: 'Cursor' }],
    format: '.vsix',
    note: 'VS Code and Cursor use the same .vsix format.',
  },
};

export function ExportModal() {
  const { exportModalOpen, closeExportModal, activeEditor } = useUIStore();
  const { exportVSIX } = useExport();

  if (!exportModalOpen) return null;

  const handleExport = async () => {
    await exportVSIX();
    closeExportModal();
  };

  const config = EDITOR_EXPORT_CONFIG[activeEditor];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={closeExportModal} />
      <div className='relative z-10 bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-semibold text-text-primary'>Export Theme</h2>
          <button
            onClick={closeExportModal}
            className='text-text-muted hover:text-text-primary transition-colors'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {config ? (
          <>
            <p className='text-xs text-text-secondary'>
              Downloads as a{' '}
              <code className='text-text-primary bg-surface-3 px-1 rounded'>{config.format}</code>{' '}
              file.
            </p>
            <div className='flex gap-2'>
              {config.buttons.map((btn, i) => (
                <Button
                  key={btn.label}
                  onClick={handleExport}
                  variant={i === 0 ? undefined : 'outline'}
                  className='flex-1'
                >
                  {btn.label}
                </Button>
              ))}
            </div>
            <p className='text-[10px] text-text-muted'>{config.note}</p>
          </>
        ) : (
          <p className='text-xs text-text-secondary'>
            Export is not yet available for this editor.
          </p>
        )}
      </div>
    </div>
  );
}
