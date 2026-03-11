import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ThemeForge Terms of Service',
};

export default function TermsPage() {
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

      <main className='max-w-2xl mx-auto px-6 py-12 prose prose-invert prose-sm'>
        <h1 className='text-xl font-bold mb-2'>Terms of Service</h1>
        <p className='text-[#a0a0a0] text-xs mb-8'>Effective: March 2025</p>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>1. Overview</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            ThemeForge is a free, open-source tool for creating VS Code and Cursor color themes. No
            account or payment is required. By using ThemeForge, you agree to these terms.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>2. User Content</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            When you share a theme, it is stored on our servers and accessible to anyone with the
            link. If you make a theme public, it will appear in the gallery. You are responsible for
            any content you submit. Shared themes consist only of color codes and names — no
            personal data is collected.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>3. Acceptable Use</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            You agree not to abuse the service (e.g., automated mass-submission, spam). Rate
            limiting is enforced. Violations may result in IP-level blocking.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>4. No Warranty</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            ThemeForge is provided "as is" without warranties of any kind. We may change, suspend,
            or discontinue the service at any time without notice.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>5. Open Source</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            ThemeForge is MIT-licensed. The source code is available on{' '}
            <a
              href='https://github.com/erenisci/themeforge'
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
          <Link href='/legal/privacy' className='hover:text-[#a0a0a0] transition-colors'>
            Privacy
          </Link>
          <Link href='/editor' className='hover:text-[#a0a0a0] transition-colors'>
            Editor
          </Link>
        </div>
      </footer>
    </div>
  );
}
