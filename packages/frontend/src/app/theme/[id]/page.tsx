import { redirect } from 'next/navigation';
import { ThemeLoader } from './ThemeLoader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchTheme(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/themes/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function SharedThemePage({ params }: { params: { id: string } }) {
  const theme = await fetchTheme(params.id);

  if (!theme) {
    redirect('/editor');
  }

  return <ThemeLoader theme={theme} />;
}
