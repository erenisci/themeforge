'use client';

interface BadgeProps {
  level: 'AAA' | 'AA' | 'fail';
  ratio?: number;
  className?: string;
}

export function ContrastBadge({ level, ratio, className = '' }: BadgeProps) {
  const styles = {
    AAA: 'bg-emerald-900/40 text-emerald-400 border-emerald-800',
    AA: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
    fail: 'bg-red-900/40 text-red-400 border-red-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${styles[level]} ${className}`}
    >
      {ratio !== undefined && <span>{ratio.toFixed(1)}:1</span>}
      <span className='font-semibold'>{level.toUpperCase()}</span>
    </span>
  );
}
