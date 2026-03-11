'use client';

import { ColorPicker } from '@/components/color/ColorPicker';
import { ContrastBadge } from '@/components/ui/Badge';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';
import { contrastRatio, wcagLevel } from '@themeforge/shared';

const SEMANTIC_TOKENS = [
  { key: 'class', label: 'Class' },
  { key: 'enum', label: 'Enum' },
  { key: 'interface', label: 'Interface' },
  { key: 'struct', label: 'Struct' },
  { key: 'function', label: 'Function' },
  { key: 'method', label: 'Method' },
  { key: 'variable', label: 'Variable' },
  { key: 'variable.readonly', label: 'Constant' },
  { key: 'parameter', label: 'Parameter' },
  { key: 'property', label: 'Property' },
  { key: 'type', label: 'Type' },
  { key: 'namespace', label: 'Namespace' },
  { key: 'macro', label: 'Macro' },
  { key: 'decorator', label: 'Decorator' },
];

const DEFAULT_FALLBACKS: Record<string, string> = {
  class: '#4ec9b0',
  enum: '#4ec9b0',
  interface: '#4ec9b0',
  struct: '#4ec9b0',
  function: '#dcdcaa',
  method: '#dcdcaa',
  variable: '#9cdcfe',
  'variable.readonly': '#4fc1ff',
  parameter: '#9cdcfe',
  property: '#9cdcfe',
  type: '#4ec9b0',
  namespace: '#4ec9b0',
  macro: '#569cd6',
  decorator: '#dcdcaa',
};

export function SemanticPanel() {
  const { theme, setSemanticColor } = useThemeStore();
  const { setFocusedColorKey, setHoveredColorKey } = useUIStore();

  const bg = theme.colors['editor.background'] || '#1e1e1e';
  const semantic = theme.semanticTokenColors ?? {};

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h3 className='text-xs font-semibold uppercase tracking-widest text-text-muted'>
        Semantic Token Colors
      </h3>
      <p className='text-[10px] text-text-muted leading-relaxed'>
        Semantic colors override syntax colors for TypeScript, Rust, Go and other language servers
        that support semantic highlighting.
      </p>

      {SEMANTIC_TOKENS.map(({ key, label }) => {
        const value = semantic[key] ?? DEFAULT_FALLBACKS[key] ?? '#888888';
        const ratio = contrastRatio(value, bg);
        const level = wcagLevel(ratio);

        return (
          <div
            key={key}
            className='flex flex-col gap-1'
          >
            <span className='text-xs text-text-muted'>{label}</span>
            <ColorPicker
              value={value}
              onChange={hex => setSemanticColor(key, hex)}
              badge={
                <ContrastBadge
                  level={level}
                  ratio={ratio}
                />
              }
              onFocus={() => setFocusedColorKey(`semantic.${key}`)}
              onBlur={() => setFocusedColorKey(null)}
              onHover={() => setHoveredColorKey(`semantic.${key}`)}
              onLeave={() => setHoveredColorKey(null)}
            />
          </div>
        );
      })}
    </div>
  );
}
