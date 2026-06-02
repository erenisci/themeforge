import { Logo } from '@/components/ui/Logo';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ThemeForge Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-[#080808] text-[#f0f0f0]'>
      <header className='border-b border-[#2d2d2d] px-6 py-4'>
        <Logo />
      </header>

      <main className='max-w-2xl mx-auto px-6 py-12'>
        <h1 className='text-xl font-bold mb-2'>Privacy Policy</h1>
        <p className='text-[#a0a0a0] text-xs mb-8'>Last updated: June 2026</p>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>No accounts, no tracking</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            ThemeForge does not require an account and does not collect personal information. We use
            no cookies, no analytics, and no third-party tracking. Everything you do in the editor
            happens locally in your browser.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>What we store</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            We only store data when you explicitly choose to share a theme. In that case we save:
          </p>
          <ul className='mt-2 space-y-1 text-sm text-[#a0a0a0] list-disc list-inside'>
            <li>The theme data (color values only — no source code, no documents)</li>
            <li>An optional theme name and author name, if you provide them</li>
            <li>A timestamp</li>
          </ul>
          <p className='text-sm text-[#a0a0a0] leading-relaxed mt-2'>
            If you never click “Share”, nothing is sent to or stored on our servers.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>Shared &amp; public themes</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            A shared theme is reachable by anyone who has its link. If you opt in to the gallery,
            the theme is also listed publicly. Don’t put anything private in a theme name or author
            field. We don’t guarantee permanent storage — shared themes may be removed over time.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>Hosting</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            The app and its sharing service run on third-party hosting providers, which may keep
            standard server logs (such as IP addresses and request metadata) under their own privacy
            policies. We use these logs only to keep the service running and to prevent abuse.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>Removing a theme</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            Want a shared theme taken down, or have a question? Open an issue on{' '}
            <a
              href='https://github.com/erenisci/themeforge/issues'
              className='text-[#5865f2] hover:underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </main>

      <footer className='border-t border-[#2d2d2d] px-6 py-4 text-center'>
        <div className='flex items-center justify-center gap-4 text-xs text-[#555555]'>
          <Link
            href='/legal/terms'
            className='hover:text-[#a0a0a0] transition-colors'
          >
            Terms
          </Link>
          <Link
            href='/editor'
            className='hover:text-[#a0a0a0] transition-colors'
          >
            Editor
          </Link>
        </div>
      </footer>
    </div>
  );
}
