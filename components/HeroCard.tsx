'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function HeroCard({ children }: { children: ReactNode }) {
  const card = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);
  const frame = useRef<number | null>(null);
  const point = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { enabled.current = pointer.matches && !reduced.matches; };
    update();
    pointer.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      pointer.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);
  return <div className="panel-content hero-card" ref={card} onPointerMove={event => {
    if (!enabled.current || event.pointerType !== 'mouse') return;
    point.current = { x: event.clientX, y: event.clientY };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const element = card.current;
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      element.style.setProperty('--hero-light-x', `${point.current.x - bounds.left}px`);
      element.style.setProperty('--hero-light-y', `${point.current.y - bounds.top}px`);
    });
  }} onPointerLeave={() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }}>{children}</div>;
}
