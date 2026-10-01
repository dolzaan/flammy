'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// Adapted from React Bits SpotlightCard by David Haz; licenses/react-bits.md.
export default function SpotlightCard({ children, className = 'deliverable-card' }: { children: ReactNode; className?: string }) {
  const frame = useRef<number | null>(null);
  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); }, []);
  return <article className={className + ' spotlight-card'} onPointerMove={event => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = event.currentTarget;
    const x = event.clientX, y = event.clientY;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${x - bounds.left}px`);
      card.style.setProperty('--mouse-y', `${y - bounds.top}px`);
      frame.current = null;
    });
  }} onPointerLeave={() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }}>{children}</article>;
}
