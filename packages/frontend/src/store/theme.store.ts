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

const MAX_HISTORY = 50;

function computeAnalysis(theme: SharedTheme): ThemeAnalysis {
  const bg = theme.colors['editor.background'] || '#000000';
  const fg = theme.colors['editor.foreground'] || '#ffffff';

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

export interface HistoryEntry {
  theme: SharedTheme;
  label: string;
  timestamp: number;
}

interface ThemeState {
  theme: SharedTheme;
  analysis: ThemeAnalysis;
  isDirty: boolean;
  history: HistoryEntry[];
  future: HistoryEntry[];
  canUndo: boolean;
  canRedo: boolean;

  setColor: (key: string, hex: string) => void;
  setTokenColor: (scope: string, hex: string) => void;
  setTokenFontStyle: (scope: string, fontStyle: string) => void;
  setSemanticColor: (key: string, hex: string) => void;
  setEditorSetting: (key: keyof EditorSettings, value: number | string) => void;
  setThemeName: (name: string) => void;
  setThemeType: (type: 'dark' | 'light') => void;
  loadTheme: (theme: SharedTheme) => void;
  undo: () => void;
  redo: () => void;
  jumpToHistory: (index: number) => void;
  clearHistory: () => void;
}

function pushHistory(
  history: HistoryEntry[],
  theme: SharedTheme,
  label: string,
): HistoryEntry[] {
  const entry: HistoryEntry = { theme, label, timestamp: Date.now() };
  return [...history.slice(-MAX_HISTORY + 1), entry];
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: defaultDark,
  analysis: computeAnalysis(defaultDark),
  isDirty: false,
  history: [],
  future: [],
  canUndo: false,
  canRedo: false,

  setColor: (key, hex) => {
    const prev = get().theme;
    const theme = { ...prev, colors: { ...prev.colors, [key]: hex } };
    set(s => ({
      theme,
      analysis: computeAnalysis(theme),
      isDirty: true,
      history: pushHistory(s.history, prev, `Changed ${key}`),
      future: [],
      canUndo: true,
      canRedo: false,
    }));
  },

  setTokenColor: (scope, hex) => {
    const prev = get().theme;
    const exists = prev.tokenColors.some(t => {
      const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
      return scopes.includes(scope);
    });
    const tokenColors = exists
      ? prev.tokenColors.map(t => {
          const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
          if (scopes.includes(scope)) return { ...t, settings: { ...t.settings, foreground: hex } };
          return t;
        })
      : [...prev.tokenColors, { name: scope, scope, settings: { foreground: hex } }];
    const theme = { ...prev, tokenColors };
    set(s => ({
      theme,
      analysis: computeAnalysis(theme),
      isDirty: true,
      history: pushHistory(s.history, prev, `Changed ${scope} color`),
      future: [],
      canUndo: true,
      canRedo: false,
    }));
  },

  setTokenFontStyle: (scope, fontStyle) => {
    const prev = get().theme;
    const exists = prev.tokenColors.some(t => {
      const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
      return scopes.includes(scope);
    });
    const tokenColors = exists
      ? prev.tokenColors.map(t => {
          const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
          if (scopes.includes(scope)) return { ...t, settings: { ...t.settings, fontStyle } };
          return t;
        })
      : [...prev.tokenColors, { name: scope, scope, settings: { fontStyle } }];
    const theme = { ...prev, tokenColors };
    set(s => ({
      theme,
      analysis: computeAnalysis(theme),
      isDirty: true,
      history: pushHistory(s.history, prev, `Changed ${scope} style`),
      future: [],
      canUndo: true,
      canRedo: false,
    }));
  },

  setSemanticColor: (key, hex) => {
    const prev = get().theme;
    const theme = { ...prev, semanticTokenColors: { ...prev.semanticTokenColors, [key]: hex } };
    set(s => ({
      theme,
      analysis: computeAnalysis(theme),
      isDirty: true,
      history: pushHistory(s.history, prev, `Changed ${key}`),
      future: [],
      canUndo: true,
      canRedo: false,
    }));
  },

  setEditorSetting: (key, value) => {
    const prev = get().theme;
    const theme = { ...prev, editorSettings: { ...prev.editorSettings, [key]: value } };
    set(s => ({
      theme,
      analysis: computeAnalysis(theme),
      isDirty: true,
      history: pushHistory(s.history, prev, `Changed ${key}`),
      future: [],
      canUndo: true,
      canRedo: false,
    }));
  },

  setThemeName: name => {
    set(s => ({ theme: { ...s.theme, name }, isDirty: true }));
  },

  setThemeType: type => {
    const prev = get().theme;
    const base = type === 'light' ? defaultLight : defaultDark;
    const wasDefault = prev.name === 'My Dark Theme' || prev.name === 'My Light Theme';
    const name = wasDefault ? base.name : prev.name;
    const theme = { ...base, name };
    set({
      theme,
      analysis: computeAnalysis(theme),
      isDirty: false,
      history: [],
      future: [],
      canUndo: false,
      canRedo: false,
    });
  },

  loadTheme: theme => {
    set({ theme, analysis: computeAnalysis(theme), isDirty: false, history: [], future: [], canUndo: false, canRedo: false });
  },

  undo: () => {
    const { history, theme, future } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const newFuture: HistoryEntry[] = [{ theme, label: 'Current', timestamp: Date.now() }, ...future];
    set({
      theme: prev.theme,
      analysis: computeAnalysis(prev.theme),
      isDirty: true,
      history: newHistory,
      future: newFuture.slice(0, MAX_HISTORY),
      canUndo: newHistory.length > 0,
      canRedo: true,
    });
  },

  redo: () => {
    const { future, theme, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    const newHistory = [...history, { theme, label: 'Current', timestamp: Date.now() }];
    set({
      theme: next.theme,
      analysis: computeAnalysis(next.theme),
      isDirty: true,
      history: newHistory.slice(-MAX_HISTORY),
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
  },

  jumpToHistory: index => {
    const { history, theme } = get();
    if (index < 0 || index >= history.length) return;
    const target = history[index];
    const newHistory = history.slice(0, index);
    const newFuture: HistoryEntry[] = [
      { theme, label: 'Current', timestamp: Date.now() },
      ...history.slice(index + 1).reverse(),
    ];
    set({
      theme: target.theme,
      analysis: computeAnalysis(target.theme),
      isDirty: true,
      history: newHistory,
      future: newFuture.slice(0, MAX_HISTORY),
      canUndo: newHistory.length > 0,
      canRedo: newFuture.length > 0,
    });
  },

  clearHistory: () => set({ history: [], future: [], canUndo: false, canRedo: false }),
}));
