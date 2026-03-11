'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const removeTimer = setTimeout(() => setVisible(false), 2300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      <div
        style={{
          animation: 'splash-scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          opacity: 0,
        }}
      >
        <Image src='/logo.svg' alt='ThemeForge' width={80} height={80} priority />
      </div>
      <div
        style={{
          animation: 'splash-fade-up 0.5s ease 0.3s forwards',
          opacity: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: '#f0f0f0',
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          ThemeForge
        </div>
        <div
          style={{
            color: '#555555',
            fontSize: '13px',
            marginTop: '4px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Code Editor Theme Builder
        </div>
      </div>
      <style>{`
        @keyframes splash-scale-in {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splash-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
