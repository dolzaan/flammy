'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const sync = () => {
      const shouldRun = finePointer.matches && !reducedMotion.matches;
      if (shouldRun && !lenis) {
        lenis = new Lenis({
          autoRaf: true,
          smoothWheel: true,
          lerp: 0.11,
          wheelMultiplier: 0.9,
          syncTouch: false,
          anchors: { offset: -84 },
        });
      } else if (!shouldRun && lenis) {
        lenis.destroy();
        lenis = null;
      }
    };

    sync();
    finePointer.addEventListener('change', sync);
    reducedMotion.addEventListener('change', sync);
    return () => {
      finePointer.removeEventListener('change', sync);
      reducedMotion.removeEventListener('change', sync);
      lenis?.destroy();
    };
  }, []);
  return null;
}
