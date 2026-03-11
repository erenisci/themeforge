'use client';

import { api } from '@/lib/api';
import { useThemeStore } from '@/store/theme.store';
import { useState } from 'react';

interface ShareResponse {
  id: string;
  url: string;
}

export function useShare() {
  const theme = useThemeStore(s => s.theme);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const share = async (name?: string, authorName?: string, isPublic = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ShareResponse>('/api/themes/share', { name, theme, authorName: authorName || undefined, isPublic });
      // Construct frontend URL from the returned ID
      const frontendUrl = `${window.location.origin}/theme/${res.id}`;
      setShareUrl(frontendUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share theme');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setShareUrl(null);
    setError(null);
  };

  return { share, shareUrl, loading, error, reset } as const;
}
