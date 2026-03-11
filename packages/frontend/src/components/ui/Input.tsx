'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', id, ...props }: InputProps) {
  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label
          htmlFor={id}
          className='text-xs text-text-secondary'
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`bg-surface-3 border border-border rounded px-2.5 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
