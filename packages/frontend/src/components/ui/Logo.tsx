import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  /** Where the logo links to. Defaults to the editor. */
  href?: string;
  /** Icon size in px. */
  size?: number;
  /** Show the "ThemeForge" wordmark next to the icon. */
  showWordmark?: boolean;
  className?: string;
}

/**
 * The ThemeForge brand mark (icon + optional wordmark), rendered consistently
 * across every page. Uses the real /logo.svg asset.
 */
export function Logo({ href = '/editor', size = 28, showWordmark = true, className }: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 w-fit transition-opacity hover:opacity-80 ${className ?? ''}`}
    >
      <Image
        src='/logo.svg'
        alt='ThemeForge'
        width={size}
        height={size}
        priority
      />
      {showWordmark && <span className='font-semibold text-sm text-[#f0f0f0]'>ThemeForge</span>}
    </Link>
  );
}
