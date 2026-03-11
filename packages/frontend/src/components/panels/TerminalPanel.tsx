'use client';

import { ColorPicker } from '@/components/color/ColorPicker';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';

const STANDARD_COLORS = [
  { key: 'terminal.ansiBlack', label: 'Black' },
  { key: 'terminal.ansiRed', label: 'Red' },
  { key: 'terminal.ansiGreen', label: 'Green' },
  { key: 'terminal.ansiYellow', label: 'Yellow' },
  { key: 'terminal.ansiBlue', label: 'Blue' },
  { key: 'terminal.ansiMagenta', label: 'Magenta' },
  { key: 'terminal.ansiCyan', label: 'Cyan' },
  { key: 'terminal.ansiWhite', label: 'White' },
];

const BRIGHT_COLORS = [
  { key: 'terminal.ansiBrightBlack', label: 'Bright Black' },
  { key: 'terminal.ansiBrightRed', label: 'Bright Red' },
  { key: 'terminal.ansiBrightGreen', label: 'Bright Green' },
  { key: 'terminal.ansiBrightYellow', label: 'Bright Yellow' },
  { key: 'terminal.ansiBrightBlue', label: 'Bright Blue' },
  { key: 'terminal.ansiBrightMagenta', label: 'Bright Magenta' },
  { key: 'terminal.ansiBrightCyan', label: 'Bright Cyan' },
  { key: 'terminal.ansiBrightWhite', label: 'Bright White' },
];

const BASE_COLORS = [
  { key: 'terminal.background', label: 'Background' },
  { key: 'terminal.foreground', label: 'Foreground' },
];

export function TerminalPanel() {
  const { theme, setColor } = useThemeStore();
  const { setFocusedColorKey, focusedColorKey, setHoveredColorKey } = useUIStore();

  const allKeys = [...STANDARD_COLORS, ...BRIGHT_COLORS];

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h3 className='text-xs font-semibold uppercase tracking-widest text-text-muted'>
        Terminal Colors
      </h3>

      {/* Base */}
      <div className='flex flex-col gap-3'>
        <span className='text-[10px] uppercase tracking-widest text-text-muted'>Base</span>
        {BASE_COLORS.map(({ key, label }) => (
          <div
            key={key}
            className='flex flex-col gap-1'
          >
            <span className='text-xs text-text-secondary'>{label}</span>
            <ColorPicker
              value={theme.colors[key] || '#000000'}
              onChange={hex => setColor(key, hex)}
              onFocus={() => setFocusedColorKey(key)}
              onBlur={() => setFocusedColorKey(null)}
              onHover={() => setHoveredColorKey(key)}
              onLeave={() => setHoveredColorKey(null)}
            />
          </div>
        ))}
      </div>

      {/* Color palette swatch strip — 16 colors */}
      <div className='rounded border border-border overflow-hidden'>
        <div
          className='flex p-2 gap-1'
          style={{ background: theme.colors['terminal.background'] || '#1e1e1e' }}
        >
          {allKeys.map(({ key, label }) => (
            <div
              key={key}
              className='flex-1 h-5 rounded-sm cursor-pointer transition-transform hover:scale-110'
              style={{
                background: theme.colors[key] || '#000000',
                outline: focusedColorKey === key ? '2px solid #5865f2' : undefined,
              }}
              title={label}
              onClick={() => setFocusedColorKey(key)}
            />
          ))}
        </div>
      </div>

      {/* Standard ANSI */}
      <div className='flex flex-col gap-3'>
        <span className='text-[10px] uppercase tracking-widest text-text-muted'>
          Standard (0–7)
        </span>
        {STANDARD_COLORS.map(({ key, label }) => (
          <div
            key={key}
            className='flex flex-col gap-1'
          >
            <span className='text-xs text-text-secondary'>{label}</span>
            <ColorPicker
              value={theme.colors[key] || '#000000'}
              onChange={hex => setColor(key, hex)}
              onFocus={() => setFocusedColorKey(key)}
              onBlur={() => setFocusedColorKey(null)}
              onHover={() => setHoveredColorKey(key)}
              onLeave={() => setHoveredColorKey(null)}
            />
          </div>
        ))}
      </div>

      {/* Bright ANSI */}
      <div className='flex flex-col gap-3'>
        <span className='text-[10px] uppercase tracking-widest text-text-muted'>Bright (8–15)</span>
        {BRIGHT_COLORS.map(({ key, label }) => (
          <div
            key={key}
            className='flex flex-col gap-1'
          >
            <span className='text-xs text-text-secondary'>{label}</span>
            <ColorPicker
              value={theme.colors[key] || '#888888'}
              onChange={hex => setColor(key, hex)}
              onFocus={() => setFocusedColorKey(key)}
              onBlur={() => setFocusedColorKey(null)}
              onHover={() => setHoveredColorKey(key)}
              onLeave={() => setHoveredColorKey(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
