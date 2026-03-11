'use client';

import { buildVSIX } from '@/lib/vsix-builder';
import { useThemeStore } from '@/store/theme.store';

export function useExport() {
  const theme = useThemeStore(s => s.theme);

  const exportVSIX = async () => {
    const blob = await buildVSIX(theme);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}.vsix`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { exportVSIX };
}
