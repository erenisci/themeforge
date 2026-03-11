'use client';

import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';

export function Toolbar() {
  const { theme, setThemeName, setThemeType } = useThemeStore();
  const { openShareModal, openExportModal } = useUIStore();

  return (
    <div className='flex items-center gap-3 px-4 h-12 border-b border-border bg-surface-1 flex-shrink-0'>
      {/* Logo */}
      <div className='flex items-center gap-2 mr-2'>
        <div className='w-5 h-5 rounded bg-accent flex items-center justify-center'>
          <svg
            className='w-3 h-3 text-white'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
          </svg>
        </div>
        <span className='text-sm font-semibold text-text-primary hidden sm:block'>ThemeForge</span>
      </div>

      {/* Divider */}
      <div className='h-5 w-px bg-border' />

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
            onClick={() => setThemeType(type)}
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

      {/* Spacer */}
      <div className='flex-1' />

      {/* Actions */}
      <Button
        variant='ghost'
        size='sm'
        onClick={openShareModal}
      >
        <svg
          className='w-3.5 h-3.5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
          />
        </svg>
        Share
      </Button>

      <Button
        size='sm'
        onClick={openExportModal}
      >
        <svg
          className='w-3.5 h-3.5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
          />
        </svg>
        Export
      </Button>
    </div>
  );
}
