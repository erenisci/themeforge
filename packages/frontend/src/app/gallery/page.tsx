import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Theme Gallery',
  description: 'Browse publicly shared VS Code and Cursor themes created with ThemeForge.',
};

interface GalleryTheme {
  id: string;
  name: string | null;
  author_name: string | null;
  type: string;
  created_at: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchGallery(): Promise<GalleryTheme[]> {
  try {
    const res = await fetch(`${API_URL}/api/themes/gallery`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.themes ?? [];
  } catch {
    return [];
  }
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default async function GalleryPage() {
  const themes = await fetchGallery();

  return (
    <div className='min-h-screen bg-[#080808] text-[#f0f0f0]'>
      <header className='border-b border-[#2d2d2d] px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link
            href='/editor'
            className='flex items-center gap-2 text-[#f0f0f0] hover:text-white transition-colors'
          >
            <svg
              className='w-5 h-5 text-[#5865f2]'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path d='M12 2L2 7l10 5 10-5-10-5' />
              <path d='M2 17l10 5 10-5' />
              <path d='M2 12l10 5 10-5' />
            </svg>
            <span className='font-semibold text-sm'>ThemeForge</span>
          </Link>
          <span className='text-[#2d2d2d]'>/</span>
          <span className='text-sm text-[#a0a0a0]'>Gallery</span>
        </div>
        <Link
          href='/editor'
          className='text-xs px-3 py-1.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-md transition-colors font-medium'
        >
          Create Theme
        </Link>
      </header>

      <main className='max-w-5xl mx-auto px-6 py-10'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-1'>Theme Gallery</h1>
          <p className='text-sm text-[#a0a0a0]'>
            Community-shared themes for VS Code and Cursor.
          </p>
        </div>

        {themes.length === 0 ? (
          <div className='text-center py-24 text-[#555555]'>
            <svg
              className='w-10 h-10 mx-auto mb-3 opacity-40'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <p className='text-sm'>No public themes yet.</p>
            <p className='text-xs mt-1'>
              <Link
                href='/editor'
                className='text-[#5865f2] hover:underline'
              >
                Create one
              </Link>{' '}
              and share it with the community!
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {themes.map(t => (
              <Link
                key={t.id}
                href={`/theme/${t.id}`}
                className='group block bg-[#111111] border border-[#2d2d2d] rounded-xl p-4 hover:border-[#5865f2]/60 hover:bg-[#141414] transition-all'
              >
                <div className='flex items-start justify-between mb-3'>
                  <h2 className='text-sm font-medium text-[#f0f0f0] truncate pr-2 leading-snug'>
                    {t.name || 'Untitled Theme'}
                  </h2>
                  <span
                    className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      t.type === 'dark'
                        ? 'bg-[#1e1e2e] text-[#cba6f7] border border-[#45475a]'
                        : 'bg-[#eff1f5] text-[#4c4f69] border border-[#ccd0da]'
                    }`}
                  >
                    {t.type === 'dark' ? 'Dark' : 'Light'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-[#555555] truncate'>
                    {t.author_name ? `by ${t.author_name}` : 'Anonymous'}
                  </span>
                  <span className='text-xs text-[#555555] shrink-0 ml-2'>
                    {timeAgo(t.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
