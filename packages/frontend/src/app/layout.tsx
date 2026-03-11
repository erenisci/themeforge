import SplashScreen from '@/components/SplashScreen';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'ThemeForge — Code Editor Theme Builder',
    template: '%s | ThemeForge',
  },
  description:
    'Create, preview, and export VS Code and Cursor color themes in your browser. Free, open source, no account required.',
  keywords: [
    'VS Code theme',
    'Cursor theme',
    'theme editor',
    'vsix',
    'color scheme',
    'VS Code color theme',
    'theme generator',
    'syntax highlighting',
  ],
  authors: [{ name: 'ThemeForge' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192' },
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    title: 'ThemeForge — Code Editor Theme Builder',
    description:
      'Create, preview, and export VS Code and Cursor color themes in your browser. Free and open source.',
    type: 'website',
    url: 'https://themeforge.app',
    siteName: 'ThemeForge',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ThemeForge' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThemeForge — Code Editor Theme Builder',
    description: 'Create, preview, and export VS Code and Cursor color themes in your browser.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('https://themeforge.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
