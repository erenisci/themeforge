'use client';

import { ColorPicker } from '@/components/color/ColorPicker';
import { ContrastBadge } from '@/components/ui/Badge';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';

const EDITOR_COLORS = [
  { key: 'editor.background', label: 'Background' },
  { key: 'editor.foreground', label: 'Foreground' },
  { key: 'editor.lineHighlightBackground', label: 'Line Highlight' },
  { key: 'editor.selectionBackground', label: 'Selection' },
];

const FONT_FAMILIES = [
  'Consolas',
  'Fira Code',
  'JetBrains Mono',
  'Source Code Pro',
  'Monaco',
  'Menlo',
  'Courier New',
];

export function EditorColorsPanel() {
  const { theme, analysis, setColor, setEditorSetting } = useThemeStore();
  const { setFocusedColorKey, setHoveredColorKey } = useUIStore();

  const fontSize = theme.editorSettings?.fontSize ?? 13;
  const lineHeight = theme.editorSettings?.lineHeight ?? 1.6;
  const fontFamily = theme.editorSettings?.fontFamily ?? 'Consolas';

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h3 className='text-xs font-semibold uppercase tracking-widest text-text-muted'>
        Editor Colors
      </h3>

      {EDITOR_COLORS.map(({ key, label }) => {
        const value = theme.colors[key] || '#000000';
        const contrastResult = analysis.contrastResults.find(r => r.foreground === value);

        return (
          <div
            key={key}
            className='flex flex-col gap-1'
          >
            <span className='text-xs text-text-muted'>{label}</span>
            <ColorPicker
              value={value}
              onChange={hex => setColor(key, hex)}
              badge={
                contrastResult && (
                  <ContrastBadge
                    level={contrastResult.wcagLevel}
                    ratio={contrastResult.ratio}
                  />
                )
              }
              onFocus={() => setFocusedColorKey(key)}
              onBlur={() => setFocusedColorKey(null)}
              onHover={() => setHoveredColorKey(key)}
              onLeave={() => setHoveredColorKey(null)}
            />
          </div>
        );
      })}

      {/* Typography */}
      <div className='pt-2 border-t border-border flex flex-col gap-4'>
        <h3 className='text-xs font-semibold uppercase tracking-widest text-text-muted'>
          Typography
        </h3>

        {/* Font Family */}
        <div className='flex flex-col gap-1.5'>
          <span className='text-xs text-text-muted'>Font Family</span>
          <select
            value={fontFamily}
            onChange={e => setEditorSetting('fontFamily', e.target.value)}
            className='w-full text-xs bg-surface-2 border border-border rounded px-2 py-1.5 text-text-primary appearance-none'
          >
            {FONT_FAMILIES.map(f => (
              <option
                key={f}
                value={f}
              >
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-text-muted'>Font Size</span>
            <span className='text-xs font-mono text-text-secondary'>{fontSize}px</span>
          </div>
          <input
            type='range'
            min={10}
            max={20}
            step={1}
            value={fontSize}
            onChange={e => setEditorSetting('fontSize', Number(e.target.value))}
            className='w-full h-1.5 rounded accent-accent'
          />
        </div>

        {/* Line Height */}
        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-text-muted'>Line Height</span>
            <span className='text-xs font-mono text-text-secondary'>{lineHeight.toFixed(1)}</span>
          </div>
          <input
            type='range'
            min={1.2}
            max={2.0}
            step={0.1}
            value={lineHeight}
            onChange={e => setEditorSetting('lineHeight', Number(e.target.value))}
            className='w-full h-1.5 rounded accent-accent'
          />
        </div>
      </div>
    </div>
  );
}
