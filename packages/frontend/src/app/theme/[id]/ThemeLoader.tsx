'use client';

import { EditorLayout } from '@/components/editor/EditorLayout';
import { useThemeStore } from '@/store/theme.store';
import type { SharedTheme } from '@themeforge/shared';
import { useEffect } from 'react';

export function ThemeLoader({ theme }: { theme: SharedTheme }) {
  const loadTheme = useThemeStore(s => s.loadTheme);

  useEffect(() => {
    loadTheme(theme);
  }, [theme, loadTheme]);

  return <EditorLayout />;
}
