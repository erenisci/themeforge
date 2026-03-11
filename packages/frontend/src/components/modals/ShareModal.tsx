'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useShare } from '@/hooks/useShare';
import { useUIStore } from '@/store/ui.store';
import { useState } from 'react';

export function ShareModal() {
  const { shareModalOpen, closeShareModal } = useUIStore();
  const { share, shareUrl, loading, error, reset } = useShare();
  const [name, setName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!shareModalOpen) return null;

  const handleClose = () => {
    closeShareModal();
    reset();
    setName('');
    setAuthorName('');
    setIsPublic(false);
    setCopied(false);
  };

  const handleShare = () => share(name || undefined, authorName || undefined, isPublic);

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={handleClose}
      />
      <div className='relative z-10 bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-semibold text-text-primary'>Share Theme</h2>
          <button
            onClick={handleClose}
            className='text-text-muted hover:text-text-primary transition-colors'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {!shareUrl ? (
          <>
            <p className='text-xs text-text-secondary'>
              Generate a link to share your theme. Anyone with the link can open and edit it.
            </p>

            <Input
              label='Name (optional)'
              placeholder='My Awesome Theme'
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <Input
              label='Your name (optional)'
              placeholder='Anonymous'
              value={authorName}
              onChange={e => setAuthorName(e.target.value.slice(0, 50))}
            />

            <label className='flex items-center gap-2.5 cursor-pointer select-none'>
              <input
                type='checkbox'
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                className='w-3.5 h-3.5 rounded accent-accent'
              />
              <span className='text-xs text-text-secondary'>Add to public gallery</span>
            </label>

            {error && <p className='text-xs text-red-400'>{error}</p>}

            <Button
              onClick={handleShare}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Link'}
            </Button>
          </>
        ) : (
          <>
            <p className='text-xs text-text-secondary'>
              Your theme link is ready. Share it with anyone!
            </p>

            <div className='flex gap-2'>
              <input
                readOnly
                value={shareUrl}
                className='flex-1 bg-surface-3 border border-border rounded px-2.5 py-1.5 text-xs font-mono text-text-secondary focus:outline-none'
              />
              <Button
                onClick={handleCopy}
                variant='outline'
                size='sm'
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <button
              onClick={() => {
                reset();
                setName('');
                setAuthorName('');
                setIsPublic(false);
              }}
              className='text-xs text-text-muted hover:text-text-secondary transition-colors text-left'
            >
              Generate another link
            </button>
          </>
        )}
      </div>
    </div>
  );
}
