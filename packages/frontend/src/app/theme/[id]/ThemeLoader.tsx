'use client';

import { EditorLayout } from '@/components/editor/EditorLayout';
import { useThemeStore } from '@/store/theme.store';
import { useUIStore } from '@/store/ui.store';
import type { SharedTheme } from '@themeforge/shared';
import { useEffect } from 'react';

export function ThemeLoader({ theme }: { theme: SharedTheme }) {
  const loadTheme = useThemeStore(s => s.loadTheme);
  const setReadOnly = useUIStore(s => s.setReadOnly);

  useEffect(() => {
    loadTheme(theme);
    setReadOnly(true);
    return () => setReadOnly(false);
  }, [theme, loadTheme, setReadOnly]);

  return <EditorLayout />;
}
