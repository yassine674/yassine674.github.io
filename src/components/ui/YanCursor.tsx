'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

const COLORS = ['#e8445a', '#f4a8b5', '#ffb347', '#a78bfa', '#67e8f9', '#fbbf24', '#f9a8d4'];

interface Burst { id: number; x: number; y: number; }
interface Particle {
  id: number;
  type: 'heart' | 'sparkle';
  color: string;
  angle: number;
  distance: number;
  size: number;
}

function BurstEffect({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const particles = useRef<Particle[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      type: i % 2 === 0 ? 'heart' : 'sparkle',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: (2 * Math.PI * i) / 8 + (Math.random() - 0.5) * 0.5,
      distance: 40 + 50 * Math.random(),
      size: 8 + 6 * Math.random(),
    }))
  ).current;

  useEffect(() => {
    const t = setTimeout(onDone, 800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed pointer-events-none" style={{ left: x, top: y, zIndex: 99999 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            animation: 'burst-particle 0.7s ease-out forwards',
            '--burst-x': `${Math.cos(p.angle) * p.distance}px`,
            '--burst-y': `${Math.sin(p.angle) * p.distance - 30}px`,
          } as React.CSSProperties}
        >
          {p.type === 'heart' ? (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
              <path d="M12 0l3 9h9l-7.5 5.5L19.5 24 12 18l-7.5 6 3-9.5L0 9h9z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export function YanCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const mouse = { x: -100, y: -100 };
    const pos   = { x: -100, y: -100 };
    let raf: number;
    let visible = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const LERP = 0.12;

    const tick = () => {
      pos.x = lerp(pos.x, mouse.x, LERP);
      pos.y = lerp(pos.y, mouse.y, LERP);
      el.style.transform = `translate(${pos.x - 11}px, ${pos.y - 11}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        pos.x = e.clientX;
        pos.y = e.clientY;
        el.style.opacity = '1';
        visible = true;
      }
    };

    const onClick = (e: MouseEvent) => {
      setBursts((prev) => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }]);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] hidden lg:block"
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#FFFFFF',
          mixBlendMode: 'difference',
          opacity: 0,
          willChange: 'transform',
        }}
      />
      {mounted &&
        bursts.map((b) =>
          createPortal(
            <BurstEffect key={b.id} x={b.x} y={b.y} onDone={() => removeBurst(b.id)} />,
            document.body
          )
        )}
    </>
  );
}
