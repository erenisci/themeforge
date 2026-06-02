import { Logo } from '@/components/ui/Logo';
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
        <Logo />
      </header>

      <main className='max-w-2xl mx-auto px-6 py-12 prose prose-invert prose-sm'>
        <h1 className='text-xl font-bold mb-2'>Terms of Service</h1>
        <p className='text-[#a0a0a0] text-xs mb-8'>Last updated: June 2026</p>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>1. Overview</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            ThemeForge is a free, open-source tool for creating VS Code and Cursor color themes. No
            account or payment is required. By using ThemeForge, you agree to these terms.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>2. Your themes</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            Editing happens in your browser. If you choose to share a theme, it is stored and
            becomes reachable by link; if you opt in to the gallery, it is also shown publicly. A
            shared theme contains only color values and any name you add. You are responsible for
            the names and content you submit, and you keep ownership of your themes.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>3. Acceptable use</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            Don’t abuse the service or use it to publish unlawful, abusive, or infringing content.
            We may remove shared themes and limit abusive usage to keep the service healthy.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>4. No warranty</h2>
          <p className='text-sm text-[#a0a0a0] leading-relaxed'>
            ThemeForge is provided “as is”, without warranties of any kind. We may change, suspend,
            or discontinue the service at any time without notice.
          </p>
        </section>

        <section className='mb-6'>
          <h2 className='text-sm font-semibold mb-2 text-[#f0f0f0]'>5. Open source</h2>
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
          <Link
            href='/legal/privacy'
            className='hover:text-[#a0a0a0] transition-colors'
          >
            Privacy
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
