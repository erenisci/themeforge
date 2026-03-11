// Readability Score - checks key token pairs against their backgrounds
import type { SharedTheme } from '../types/theme.types';
import { contrastRatio } from './wcag';

interface TokenPair {
  name: string;
  scope: string;
  bgKey: string;
  minRatio: number;
}

// Key token pairs that matter most for code readability
const TOKEN_PAIRS: TokenPair[] = [
  { name: 'Comment', scope: 'comment', bgKey: 'editor.background', minRatio: 3.0 },
  { name: 'Keyword', scope: 'keyword', bgKey: 'editor.background', minRatio: 4.5 },
  { name: 'String', scope: 'string', bgKey: 'editor.background', minRatio: 4.5 },
  { name: 'Number', scope: 'constant.numeric', bgKey: 'editor.background', minRatio: 4.5 },
  { name: 'Function', scope: 'entity.name.function', bgKey: 'editor.background', minRatio: 4.5 },
  { name: 'Variable', scope: 'variable', bgKey: 'editor.background', minRatio: 4.5 },
  { name: 'Type', scope: 'entity.name.type', bgKey: 'editor.background', minRatio: 4.5 },
];

function resolveTokenColor(theme: SharedTheme, scope: string): string | null {
  for (const token of theme.tokenColors) {
    const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
    if (scopes.some(s => s === scope || scope.startsWith(s))) {
      return token.settings.foreground ?? null;
    }
  }
  return null;
}

export function readabilityScore(theme: SharedTheme): number {
  let passing = 0;
  let total = 0;

  for (const pair of TOKEN_PAIRS) {
    const fg = resolveTokenColor(theme, pair.scope);
    const bg = theme.colors[pair.bgKey];

    if (!fg || !bg) continue;

    total++;
    const ratio = contrastRatio(fg, bg);
    if (ratio >= pair.minRatio) passing++;
  }

  if (total === 0) return 50; // neutral if no data
  return Math.round((passing / total) * 100);
}
