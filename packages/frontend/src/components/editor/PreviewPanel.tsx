'use client';

import { VSCodeChrome } from '@/components/preview/VSCodeChrome';

export function PreviewPanel() {
  return (
    <div className='flex-1 flex flex-col p-4 bg-surface-0 overflow-hidden min-w-0'>
      <VSCodeChrome />
    </div>
  );
}
