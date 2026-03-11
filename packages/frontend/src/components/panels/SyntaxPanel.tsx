'use client';

import { ColorPicker } from '@/components/color/ColorPicker';
import { ContrastBadge } from '@/components/ui/Badge';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';
import { contrastRatio, wcagLevel } from '@themeforge/shared';

const SYNTAX_TOKENS = [
  { scope: 'keyword', label: 'Keyword' },
  { scope: 'keyword.control', label: 'Control Flow' },
  { scope: 'string', label: 'String' },
  { scope: 'constant.numeric', label: 'Number' },
  { scope: 'comment', label: 'Comment' },
  { scope: 'entity.name.function', label: 'Function' },
  { scope: 'variable', label: 'Variable' },
  { scope: 'entity.name.type', label: 'Type' },
  { scope: 'keyword.operator', label: 'Operator' },
  { scope: 'support.function', label: 'Built-in Function' },
  { scope: 'entity.name.class', label: 'Class' },
  { scope: 'variable.language', label: 'Self / This' },
];

const FONT_STYLES = [
  { flag: 'bold', label: 'B', title: 'Bold' },
  { flag: 'italic', label: 'I', title: 'Italic' },
  { flag: 'underline', label: 'U', title: 'Underline' },
];

function parseFontStyle(fontStyle?: string): string[] {
  if (!fontStyle) return [];
  return fontStyle.split(' ').filter(Boolean);
}

function buildFontStyle(flags: string[]): string {
  return flags.join(' ');
}

export function SyntaxPanel() {
  const { theme, setTokenColor, setTokenFontStyle } = useThemeStore();
  const { setFocusedColorKey, setHoveredColorKey } = useUIStore();

  function getToken(scope: string) {
    for (const token of theme.tokenColors) {
      const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
      if (scopes.some(s => s === scope)) return token;
    }
    return null;
  }

  function getTokenColor(scope: string): string {
    return getToken(scope)?.settings?.foreground || theme.colors['editor.foreground'] || '#d4d4d4';
  }

  function getTokenFontStyle(scope: string): string[] {
    return parseFontStyle(getToken(scope)?.settings?.fontStyle as string | undefined);
  }

  function toggleFontStyle(scope: string, flag: string) {
    const current = getTokenFontStyle(scope);
    const next = current.includes(flag) ? current.filter(f => f !== flag) : [...current, flag];
    setTokenFontStyle(scope, buildFontStyle(next));
  }

  const bg = theme.colors['editor.background'] || '#1e1e1e';

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h3 className='text-xs font-semibold uppercase tracking-widest text-text-muted'>
        Syntax Colors
      </h3>

      {SYNTAX_TOKENS.map(({ scope, label }) => {
        const color = getTokenColor(scope);
        const activeFontStyles = getTokenFontStyle(scope);
        const ratio = contrastRatio(color, bg);
        const level = wcagLevel(ratio);

        return (
          <div
            key={scope}
            className='flex flex-col gap-1.5'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs text-text-muted'>{label}</span>
              <div className='flex items-center gap-0.5'>
                {FONT_STYLES.map(({ flag, label: fl, title }) => {
                  const isActive = activeFontStyles.includes(flag);
                  return (
                    <button
                      key={flag}
                      title={title}
                      onClick={() => toggleFontStyle(scope, flag)}
                      className='w-5 h-5 rounded text-[10px] flex items-center justify-center transition-colors text-text-muted hover:text-text-primary'
                      style={{
                        fontWeight: flag === 'bold' ? 700 : undefined,
                        fontStyle: flag === 'italic' ? 'italic' : undefined,
                        textDecoration: flag === 'underline' ? 'underline' : undefined,
                        color: isActive ? '#5865f2' : undefined,
                        background: isActive ? '#5865f220' : undefined,
                      }}
                    >
                      {fl}
                    </button>
                  );
                })}
              </div>
            </div>
            <ColorPicker
              value={color}
              onChange={hex => setTokenColor(scope, hex)}
              badge={
                <ContrastBadge
                  level={level}
                  ratio={ratio}
                />
              }
              onFocus={() => setFocusedColorKey(scope)}
              onBlur={() => setFocusedColorKey(null)}
              onHover={() => setHoveredColorKey(scope)}
              onLeave={() => setHoveredColorKey(null)}
            />
          </div>
        );
      })}
    </div>
  );
}
