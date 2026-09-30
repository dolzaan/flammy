'use client';

import type { ReactNode } from 'react';

// Adapted from React Bits SpotlightCard by David Haz; licenses/react-bits.md.
export default function SpotlightCard({ children }: { children: ReactNode }) {
  return <article className="deliverable-card spotlight-card" onPointerMove={event => {
    if (event.pointerType !== 'mouse') return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
  }}>{children}</article>;
}
