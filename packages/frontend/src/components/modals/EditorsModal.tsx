'use client';

import { useUIStore, type ActiveEditor } from '@/store/ui.store';

interface EditorOption {
  id: string;
  label: string;
  description: string;
  available: boolean;
  exportFormat?: string;
}

const EDITORS: EditorOption[] = [
  {
    id: 'vscode',
    label: 'VS Code / Cursor',
    description: 'Export as .vsix extension. Works with VS Code and Cursor.',
    available: true,
    exportFormat: '.vsix',
  },
  {
    id: 'vim',
    label: 'Vim / Neovim',
    description: 'Export as .vim colorscheme file.',
    available: false,
  },
  {
    id: 'jetbrains',
    label: 'JetBrains IDEs',
    description: 'Export as .icls color scheme for IntelliJ, PyCharm, etc.',
    available: false,
  },
  {
    id: 'sublime',
    label: 'Sublime Text',
    description: 'Export as .tmTheme file.',
    available: false,
  },
  {
    id: 'zed',
    label: 'Zed',
    description: 'Export as Zed theme JSON.',
    available: false,
  },
];

export function EditorsModal() {
  const { editorsModalOpen, closeEditorsModal, activeEditor, setActiveEditor } = useUIStore();

  if (!editorsModalOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={closeEditorsModal}
      />

      {/* Modal */}
      <div className='relative z-10 w-full max-w-md bg-surface-1 border border-border rounded-xl shadow-2xl p-6'>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h2 className='text-sm font-semibold text-text-primary'>Choose Editor</h2>
            <p className='text-xs text-text-muted mt-0.5'>
              Select which editor to preview and export for
            </p>
          </div>
          <button
            onClick={closeEditorsModal}
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

        <div className='flex flex-col gap-2'>
          {EDITORS.map(editor => {
            const isSelected = activeEditor === editor.id;
            return (
            <div
              key={editor.id}
              onClick={() => {
                if (!editor.available) return;
                setActiveEditor(editor.id as ActiveEditor);
                closeEditorsModal();
              }}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                editor.available
                  ? isSelected
                    ? 'border-accent bg-accent/10 cursor-pointer'
                    : 'border-border hover:border-accent/50 hover:bg-accent/5 cursor-pointer'
                  : 'border-border opacity-50 cursor-not-allowed'
              }`}
            >
              <div className='mt-0.5 flex-shrink-0'>
                {editor.available ? (
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-accent' : 'border-border'}`}>
                    {isSelected && <div className='w-2 h-2 rounded-full bg-accent' />}
                  </div>
                ) : (
                  <div className='w-4 h-4 rounded-full border-2 border-border' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-medium text-text-primary'>{editor.label}</span>
                  {editor.available ? (
                    <span className='text-[9px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-medium'>
                      Active
                    </span>
                  ) : (
                    <span className='text-[9px] px-1.5 py-0.5 rounded-full bg-surface-3 text-text-muted font-medium'>
                      Coming soon
                    </span>
                  )}
                  {editor.exportFormat && (
                    <span className='text-[9px] px-1.5 py-0.5 rounded bg-surface-3 text-text-muted font-mono'>
                      {editor.exportFormat}
                    </span>
                  )}
                </div>
                <p className='text-[11px] text-text-muted mt-0.5'>{editor.description}</p>
              </div>
            </div>
          );})}
        </div>

        <div className='mt-5 pt-4 border-t border-border'>
          <p className='text-[10px] text-text-muted'>
            Want to add support for another editor?{' '}
            <a
              href='https://github.com/erenisci/themeforge/blob/main/CONTRIBUTING.md'
              target='_blank'
              rel='noopener noreferrer'
              className='text-accent hover:underline'
            >
              See the contributing guide →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
