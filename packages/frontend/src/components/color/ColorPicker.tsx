'use client';

import { hexToHsl, hslToHex, isValidHex } from '@/lib/color-utils';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  badge?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  '#0d0d0d',
  '#1a1a1a',
  '#2d2d2d',
  '#404040',
  '#595959',
  '#737373',
  '#8c8c8c',
  '#a6a6a6',
  '#bfbfbf',
  '#d9d9d9',
  '#f2f2f2',
  '#ffffff',
  '#e53e3e',
  '#ed8936',
  '#ecc94b',
  '#48bb78',
  '#38b2ac',
  '#4299e1',
  '#667eea',
  '#ed64a6',
  '#9f7aea',
  '#f687b3',
  '#68d391',
  '#63b3ed',
  '#742a2a',
  '#7b341e',
  '#744210',
  '#276749',
  '#285e61',
  '#2a4365',
  '#3c366b',
  '#702459',
  '#553c9a',
  '#97266d',
  '#22543d',
  '#2c5282',
];

export function ColorPicker({
  value,
  onChange,
  label,
  badge,
  onFocus,
  onBlur,
  onHover,
  onLeave,
  disabled = false,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [hsl, setHsl] = useState<[number, number, number]>([0, 100, 50]);
  const containerRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    setHexInput(value);
    const h = hexToHsl(value);
    if (h) setHsl(h);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  const handleHexChange = (raw: string) => {
    const val = raw.startsWith('#') ? raw : '#' + raw;
    setHexInput(val);
    if (isValidHex(val)) {
      onChange(val);
      const h = hexToHsl(val);
      if (h) setHsl(h);
    }
  };

  const pickFromPalette = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const el = paletteRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); // saturation 0→1
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)); // value 1→0
      // HSV → HSL conversion
      const sv = x; // saturation in HSV
      const v = 1 - y; // value in HSV (1=top, 0=bottom)
      const l = v * (1 - sv / 2);
      const s = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
      const newHsl: [number, number, number] = [hsl[0], Math.round(s * 100), Math.round(l * 100)];
      setHsl(newHsl);
      const hex = hslToHex(newHsl[0], newHsl[1], newHsl[2]);
      setHexInput(hex);
      onChange(hex);
    },
    [hsl, onChange],
  );

  const handlePaletteMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    pickFromPalette(e);
    const move = (ev: MouseEvent) => {
      if (dragging.current) pickFromPalette(ev);
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const handleHueChange = useCallback(
    (newHue: number) => {
      const newHsl: [number, number, number] = [newHue, hsl[1], hsl[2]];
      setHsl(newHsl);
      const hex = hslToHex(newHsl[0], newHsl[1], newHsl[2]);
      setHexInput(hex);
      onChange(hex);
    },
    [hsl, onChange],
  );

  // HSL → HSV for cursor position
  const l = hsl[2] / 100;
  const s = hsl[1] / 100;
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);
  const cursorX = `${Math.round(sv * 100)}%`;
  const cursorY = `${Math.round((1 - v) * 100)}%`;

  return (
    <div
      ref={containerRef}
      className='relative'
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {label && <span className='text-xs text-text-secondary mb-1 block'>{label}</span>}

      {/* Trigger row: swatch + hex + optional badge */}
      <button
        type='button'
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        className={`flex items-center gap-2 w-full group ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div
          className={`w-7 h-7 rounded border flex-shrink-0 transition-all ${open ? 'border-accent ring-1 ring-accent' : 'border-border group-hover:border-text-muted'}`}
          style={{ background: value }}
        />
        <span className='text-xs font-mono text-text-secondary group-hover:text-text-primary transition-colors flex-1 text-left'>
          {value.toLowerCase()}
        </span>
        {badge}
      </button>

      {/* Picker dropdown */}
      {open && (
        <div className='absolute left-0 z-50 mt-1.5 w-64 bg-surface-2 border border-border rounded-lg shadow-xl p-3 flex flex-col gap-2.5'>
          {/* 2D palette: left→right = white→hue, top→bottom = opaque→black */}
          <div
            ref={paletteRef}
            className='relative w-full rounded cursor-crosshair select-none overflow-hidden'
            style={{
              height: 100,
              background: `hsl(${hsl[0]}, 100%, 50%)`,
            }}
            onMouseDown={handlePaletteMouseDown}
          >
            {/* white gradient: left=white, right=transparent */}
            <div
              className='absolute inset-0 pointer-events-none'
              style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }}
            />
            {/* black gradient: top=transparent, bottom=black */}
            <div
              className='absolute inset-0 pointer-events-none'
              style={{ background: 'linear-gradient(to bottom, transparent, #000000)' }}
            />
            <div
              className='absolute w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none'
              style={{
                left: cursorX,
                top: cursorY,
                transform: 'translate(-50%, -50%)',
                background: value,
              }}
            />
          </div>

          {/* Hue slider */}
          <input
            type='range'
            min={0}
            max={360}
            value={hsl[0]}
            onChange={e => handleHueChange(Number(e.target.value))}
            className='w-full h-2 rounded appearance-none cursor-pointer'
            style={{
              background:
                'linear-gradient(to right, hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(360,100%,50%))',
            }}
          />

          {/* Swatch + hex input */}
          <div className='flex items-center gap-2'>
            <div
              className='w-7 h-7 rounded border border-border flex-shrink-0'
              style={{ background: value }}
            />
            <input
              type='text'
              value={hexInput}
              onChange={e => handleHexChange(e.target.value)}
              className='flex-1 bg-surface-3 border border-border rounded px-2 py-1 text-xs font-mono text-text-primary focus:border-accent focus:outline-none'
              maxLength={7}
              spellCheck={false}
            />
          </div>

          {/* Preset grid */}
          <div
            className='grid gap-0.5 pt-1 border-t border-border'
            style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
          >
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                onClick={() => onChange(color)}
                title={color}
                className={`h-4 rounded-sm border transition-transform hover:scale-110 ${
                  value.toLowerCase() === color.toLowerCase()
                    ? 'border-accent ring-1 ring-accent'
                    : 'border-transparent hover:border-border'
                }`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
