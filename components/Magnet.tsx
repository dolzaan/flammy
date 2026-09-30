'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Adapted from React Bits Magnet by David Haz; licenses/react-bits.md.
export default function Magnet({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);
  const reset = () => { inner.current?.style.setProperty('--magnet-x', '0px'); inner.current?.style.setProperty('--magnet-y', '0px'); };
  useEffect(() => {
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { enabled.current = pointer.matches && !reduced.matches; if (!enabled.current) reset(); };
    update(); pointer.addEventListener('change', update); reduced.addEventListener('change', update);
    return () => { pointer.removeEventListener('change', update); reduced.removeEventListener('change', update); };
  }, []);
  return <div className="magnet" ref={root} onPointerLeave={reset} onFocusCapture={reset} onPointerMove={event => {
    if (!enabled.current || event.pointerType !== 'mouse' || !root.current || !inner.current) return;
    const bounds = root.current.getBoundingClientRect();
    const x = Math.max(-6, Math.min(6, (event.clientX - bounds.left - bounds.width / 2) / 12));
    const y = Math.max(-4, Math.min(4, (event.clientY - bounds.top - bounds.height / 2) / 12));
    inner.current.style.setProperty('--magnet-x', `${x}px`);
    inner.current.style.setProperty('--magnet-y', `${y}px`);
  }}><div className="magnet__content" ref={inner}>{children}</div></div>;
}
