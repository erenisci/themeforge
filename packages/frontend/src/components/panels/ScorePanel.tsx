'use client';

import { ContrastBadge } from '@/components/ui/Badge';
import { useThemeStore } from '@/store/theme.store';

export function ScorePanel() {
  const analysis = useThemeStore(s => s.analysis);

  const harmonyColors: Record<string, string> = {
    complementary: 'text-purple-400',
    analogous: 'text-blue-400',
    triadic: 'text-emerald-400',
    'split-complementary': 'text-orange-400',
    mixed: 'text-text-secondary',
  };

  return (
    <div className='flex flex-col gap-5 p-4'>
      <h3 className='text-xs font-semibold uppercase tracking-widest text-text-muted'>
        Theme Analysis
      </h3>

      {/* Overall */}
      <div className='flex items-center gap-3 p-3 rounded-md border border-border bg-surface-2'>
        <div className='text-center'>
          <div className='text-2xl font-bold text-text-primary'>{analysis.readabilityScore}</div>
          <div className='text-[10px] text-text-muted'>Readability</div>
        </div>
        <div className='flex-1 border-l border-border pl-3'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-xs text-text-secondary'>WCAG Level</span>
            <ContrastBadge level={analysis.overallWcagLevel} />
          </div>
          <div className='text-xs text-text-secondary'>
            Harmony:{' '}
            <span
              className={`font-medium ${harmonyColors[analysis.harmonyResult.type] || 'text-text-secondary'}`}
            >
              {analysis.harmonyResult.type.charAt(0).toUpperCase() +
                analysis.harmonyResult.type.slice(1)}
            </span>{' '}
            ({analysis.harmonyResult.score}/100)
          </div>
        </div>
      </div>

      {/* Per-token contrast */}
      <div>
        <h4 className='text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2'>
          Contrast Details
        </h4>
        <div className='flex flex-col gap-2'>
          {analysis.contrastResults.map(result => (
            <div
              key={result.name}
              className='flex items-center gap-2'
            >
              <div
                className='w-3 h-3 rounded-sm flex-shrink-0 border border-border'
                style={{ background: result.foreground }}
              />
              <span className='flex-1 text-xs text-text-secondary truncate'>{result.name}</span>
              <ContrastBadge
                level={result.wcagLevel}
                ratio={result.ratio}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {analysis.overallWcagLevel === 'fail' && (
        <div className='p-3 rounded-md border border-red-800/50 bg-red-900/20 text-xs text-red-400'>
          Some token colors don't meet WCAG contrast requirements. Adjust them in the Syntax or
          Editor panels.
        </div>
      )}
      {analysis.overallWcagLevel === 'AAA' && (
        <div className='p-3 rounded-md border border-emerald-800/50 bg-emerald-900/20 text-xs text-emerald-400'>
          Excellent! Your theme meets WCAG AAA contrast requirements.
        </div>
      )}
    </div>
  );
}
