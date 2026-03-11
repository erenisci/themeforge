'use client';

import { defaultDark, defaultLight } from '@/lib/default-themes';
import type {
  ContrastResult,
  EditorSettings,
  SharedTheme,
  ThemeAnalysis,
} from '@themeforge/shared';
import { analyzeHarmony, contrastRatio, readabilityScore, wcagLevel } from '@themeforge/shared';
import { create } from 'zustand';

function computeAnalysis(theme: SharedTheme): ThemeAnalysis {
  const bg = theme.colors['editor.background'] || '#000000';
  const fg = theme.colors['editor.foreground'] || '#ffffff';

  // Key token pairs to check
  const pairs: { name: string; scope: string }[] = [
    { name: 'Comment', scope: 'comment' },
    { name: 'Keyword', scope: 'keyword' },
    { name: 'String', scope: 'string' },
    { name: 'Number', scope: 'constant.numeric' },
    { name: 'Function', scope: 'entity.name.function' },
    { name: 'Variable', scope: 'variable' },
    { name: 'Type', scope: 'entity.name.type' },
  ];

  function resolveColor(scope: string): string | null {
    for (const token of theme.tokenColors) {
      const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
      if (scopes.some(s => s === scope || scope.startsWith(s))) {
        return token.settings.foreground ?? null;
      }
    }
    return null;
  }

  const contrastResults: ContrastResult[] = [
    {
      name: 'Editor Text',
      foreground: fg,
      background: bg,
      ratio: contrastRatio(fg, bg),
      wcagLevel: wcagLevel(contrastRatio(fg, bg)),
    },
  ];

  for (const pair of pairs) {
    const color = resolveColor(pair.scope);
    if (color) {
      const ratio = contrastRatio(color, bg);
      contrastResults.push({
        name: pair.name,
        foreground: color,
        background: bg,
        ratio,
        wcagLevel: wcagLevel(ratio),
      });
    }
  }

  // Collect all unique foreground colors for harmony analysis
  const allColors = [
    fg,
    ...(theme.tokenColors.map(t => t.settings.foreground).filter(Boolean) as string[]),
  ];
  const harmonyResult = analyzeHarmony(allColors);

  const readScore = readabilityScore(theme);

  const passing = contrastResults.filter(r => r.wcagLevel !== 'fail');
  const hasAAA = passing.every(r => r.wcagLevel === 'AAA');
  const hasAA = passing.length === contrastResults.length;

  return {
    contrastResults,
    harmonyResult,
    readabilityScore: readScore,
    overallWcagLevel: hasAAA ? 'AAA' : hasAA ? 'AA' : 'fail',
  };
}

interface ThemeState {
  theme: SharedTheme;
  analysis: ThemeAnalysis;
  isDirty: boolean;

  setColor: (key: string, hex: string) => void;
  setTokenColor: (scope: string, hex: string) => void;
  setTokenFontStyle: (scope: string, fontStyle: string) => void;
  setSemanticColor: (key: string, hex: string) => void;
  setEditorSetting: (key: keyof EditorSettings, value: number | string) => void;
  setThemeName: (name: string) => void;
  setThemeType: (type: 'dark' | 'light') => void;
  loadTheme: (theme: SharedTheme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: defaultDark,
  analysis: computeAnalysis(defaultDark),
  isDirty: false,

  setColor: (key, hex) => {
    const theme = { ...get().theme, colors: { ...get().theme.colors, [key]: hex } };
    set({ theme, analysis: computeAnalysis(theme), isDirty: true });
  },

  setTokenColor: (scope, hex) => {
    const theme = get().theme;
    const exists = theme.tokenColors.some(t => {
      const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
      return scopes.includes(scope);
    });

    const tokenColors = exists
      ? theme.tokenColors.map(t => {
          const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
          if (scopes.includes(scope)) {
            return { ...t, settings: { ...t.settings, foreground: hex } };
          }
          return t;
        })
      : [
          ...theme.tokenColors,
          {
            name: scope,
            scope,
            settings: { foreground: hex },
          },
        ];

    const updated = { ...theme, tokenColors };
    set({ theme: updated, analysis: computeAnalysis(updated), isDirty: true });
  },

  setTokenFontStyle: (scope, fontStyle) => {
    const theme = get().theme;
    const exists = theme.tokenColors.some(t => {
      const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
      return scopes.includes(scope);
    });
    const tokenColors = exists
      ? theme.tokenColors.map(t => {
          const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
          if (scopes.includes(scope)) {
            return { ...t, settings: { ...t.settings, fontStyle } };
          }
          return t;
        })
      : [...theme.tokenColors, { name: scope, scope, settings: { fontStyle } }];
    const updated = { ...theme, tokenColors };
    set({ theme: updated, analysis: computeAnalysis(updated), isDirty: true });
  },

  setSemanticColor: (key, hex) => {
    const theme = get().theme;
    const updated = { ...theme, semanticTokenColors: { ...theme.semanticTokenColors, [key]: hex } };
    set({ theme: updated, analysis: computeAnalysis(updated), isDirty: true });
  },

  setEditorSetting: (key, value) => {
    const theme = get().theme;
    const updated = { ...theme, editorSettings: { ...theme.editorSettings, [key]: value } };
    set({ theme: updated, analysis: computeAnalysis(updated), isDirty: true });
  },

  setThemeName: name => {
    set(s => ({ theme: { ...s.theme, name }, isDirty: true }));
  },

  setThemeType: type => {
    const base = type === 'light' ? defaultLight : defaultDark;
    const currentName = get().theme.name;
    const wasDefault = currentName === 'My Dark Theme' || currentName === 'My Light Theme';
    const name = wasDefault ? base.name : currentName;
    const theme = { ...base, name };
    set({ theme, analysis: computeAnalysis(theme), isDirty: true });
  },

  loadTheme: theme => {
    set({ theme, analysis: computeAnalysis(theme), isDirty: false });
  },
}));
