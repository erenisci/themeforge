import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'ThemeForge — VS Code & Cursor Theme Editor',
    template: '%s | ThemeForge',
  },
  description:
    'Create, preview, and export beautiful VS Code and Cursor themes. Free, open source, no account required.',
  keywords: ['VS Code theme', 'Cursor theme', 'theme editor', 'vsix', 'color scheme'],
  openGraph: {
    title: 'ThemeForge — VS Code & Cursor Theme Editor',
    description: 'Create, preview, and export beautiful VS Code and Cursor themes. Free and open source.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
