'use client';

import { ColorPicker } from '@/components/color/ColorPicker';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';

const UI_COLORS = [
  { key: 'sideBar.background', label: 'Sidebar BG' },
  { key: 'sideBar.foreground', label: 'Sidebar FG' },
  { key: 'activityBar.background', label: 'Activity Bar BG' },
  { key: 'activityBar.foreground', label: 'Activity Bar FG' },
  { key: 'statusBar.background', label: 'Status Bar BG' },
  { key: 'statusBar.foreground', label: 'Status Bar FG' },
  { key: 'titleBar.activeBackground', label: 'Title Bar BG' },
  { key: 'titleBar.activeForeground', label: 'Title Bar FG' },
];

export function UIColorsPanel() {
  const { theme, setColor } = useThemeStore();
  const { setFocusedColorKey, setHoveredColorKey } = useUIStore();

  return (
    <div className='flex flex-col gap-5 p-4'>
      <h3 className='text-xs font-semibold uppercase tracking-widest text-text-muted'>UI Colors</h3>

      {UI_COLORS.map(({ key, label }) => {
        const value = theme.colors[key] || '#000000';
        return (
          <div
            key={key}
            className='flex flex-col gap-2'
          >
            <span className='text-xs text-text-secondary'>{label}</span>
            <ColorPicker
              value={value}
              onChange={hex => setColor(key, hex)}
              onFocus={() => setFocusedColorKey(key)}
              onBlur={() => setFocusedColorKey(null)}
              onHover={() => setHoveredColorKey(key)}
              onLeave={() => setHoveredColorKey(null)}
            />
          </div>
        );
      })}
    </div>
  );
}
