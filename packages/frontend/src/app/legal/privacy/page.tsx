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
        <Link
          href='/editor'
          className='flex items-center gap-2 w-fit text-[#f0f0f0] hover:text-white transition-colors'
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
      </header>

      <main className='max-w-2xl mx-auto px-6 py-12'>
        <h1 className='text-xl font-bold mb-2'>Privacy Policy</h1>
        <p className='text-[#a0a0a0] text-xs mb-8'>Effective: March 2025</p>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>What we collect</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            ThemeForge does not require accounts or collect personal information. When you share a
            theme, we store:
          </p>
          <ul className='mt-2 space-y-1 text-sm text-[#a0a0a0] list-disc list-inside'>
            <li>The theme data (color codes only — no code, no text)</li>
            <li>An optional display name for the theme</li>
            <li>An optional author name you provide</li>
            <li>Timestamp of submission</li>
          </ul>
          <p className='text-sm text-[#a0a0a0] leading-relaxed mt-2'>
            IP addresses are used solely for rate limiting (abuse prevention) and are not stored
            linked to theme submissions.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>Cookies</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            We do not use cookies or any tracking technology. No analytics scripts are loaded.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>Shared themes</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            Shared themes are accessible to anyone with the link. Public themes (opted in via the
            gallery checkbox) are additionally listed on the gallery page. We do not guarantee
            permanent storage — themes may be purged after an extended period of inactivity.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>Third-party services</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            The frontend is hosted on Vercel. The backend is hosted on Render. Database is provided
            by Turso. These providers may collect standard infrastructure logs (IP addresses,
            request metadata) per their own privacy policies.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>Contact</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            Questions or takedown requests? Open an issue on{' '}
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
