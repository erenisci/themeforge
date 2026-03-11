'use client';

import { LANGUAGES } from '@/data/languages';
import type { LanguageLine } from '@/data/languages';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';
import type { TokenColor } from '@themeforge/shared';

function resolveTokenColor(tokenColors: TokenColor[], scope: string): string | undefined {
  for (const token of tokenColors) {
    const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
    if (scopes.some(s => s === scope || scope.startsWith(s + '.') || scope === s)) {
      return token.settings.foreground;
    }
  }
  return undefined;
}

function isScopeHighlighted(focusedKey: string | null, scope: string): boolean {
  if (!focusedKey) return false;
  if (focusedKey === scope) return true;
  if (scope.startsWith(focusedKey + '.') || focusedKey.startsWith(scope + '.')) return true;
  return false;
}

const HIGHLIGHT_STYLE: React.CSSProperties = {
  textDecoration: 'underline',
  textDecorationStyle: 'dotted',
  textDecorationColor: '#5865f2',
  fontWeight: 600,
};

interface TokenizedCodeProps {
  lines?: LanguageLine[];
}

export function TokenizedCode({ lines: linesProp }: TokenizedCodeProps = {}) {
  const theme = useThemeStore(s => s.theme);
  const activeLanguage = useUIStore(s => s.activeLanguage);
  const focusedColorKey = useUIStore(s => s.focusedColorKey);
  const hoveredColorKey = useUIStore(s => s.hoveredColorKey);
  const { colors, tokenColors } = theme;

  const bg = colors['editor.background'] || '#1e1e1e';
  const fg = colors['editor.foreground'] || '#d4d4d4';
  const lineHighlight = colors['editor.lineHighlightBackground'] || '#2a2d2e';
  const selection = colors['editor.selectionBackground'] || '#264f78';
  const lineNumColor = `${fg}55`;

  const fontSize = theme.editorSettings?.fontSize ?? 13;
  const lineHeight = theme.editorSettings?.lineHeight ?? 1.6;

  const lang = (activeLanguage ? LANGUAGES[activeLanguage] : null) ?? LANGUAGES['typescript'];
  const lines = linesProp ?? lang.lines;

  const c = (scope: string) => resolveTokenColor(tokenColors, scope) || fg;
  const hl = (scope: string): React.CSSProperties =>
    isScopeHighlighted(focusedColorKey, scope) ? HIGHLIGHT_STYLE : {};
  const hoverHl = (scope: string): React.CSSProperties =>
    !isScopeHighlighted(focusedColorKey, scope) && isScopeHighlighted(hoveredColorKey, scope)
      ? {
          textDecoration: 'underline',
          textDecorationStyle: 'wavy',
          textDecorationColor: 'rgba(88,101,242,0.6)',
          animation: 'token-fade-underline 1s ease-out forwards',
        }
      : {};

  return (
    <div
      className='flex-1 overflow-auto font-mono'
      style={{ background: bg, color: fg, fontSize, lineHeight }}
    >
      <div className='flex p-3'>
        {/* Gutter */}
        <div
          className='select-none pr-4 text-right flex-shrink-0'
          style={{ color: lineNumColor, minWidth: '2rem' }}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code */}
        <div
          className='flex-1 min-w-0'
          style={{ whiteSpace: 'pre' }}
        >
          {lines.map((line, lineIdx) => {
            const bgStyle =
              line.highlight === 'line'
                ? { background: lineHighlight }
                : line.highlight === 'selection'
                  ? { background: selection }
                  : {};

            return (
              <div
                key={lineIdx}
                style={bgStyle}
              >
                {line.tokens.map((token, tokIdx) => {
                  if (!token.scope) {
                    return (
                      <span
                        key={tokIdx}
                        style={{ color: fg }}
                      >
                        {token.text || '\u00a0'}
                      </span>
                    );
                  }
                  return (
                    <span
                      key={tokIdx}
                      style={{ color: c(token.scope), ...hoverHl(token.scope), ...hl(token.scope) }}
                    >
                      {token.text}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
