'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Smooths precise wheel input without keeping an animation loop alive while idle. */
export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let stopVirtualScroll: (() => void) | undefined;
    let frame = 0;

    const tick = (time: number) => {
      frame = 0;
      if (!lenis || document.hidden) return;
      lenis.raf(time);
      if (lenis.isScrolling) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (lenis && !frame && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      stopVirtualScroll?.();
      stopVirtualScroll = undefined;
      lenis?.destroy();
      lenis = null;
      window.removeEventListener('pointerup', wake, true);
    };

    const sync = () => {
      const shouldRun = finePointer.matches && !reducedMotion.matches;
      if (!shouldRun) {
        stop();
        return;
      }
      if (lenis) return;
      lenis = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        lerp: 0.14,
        wheelMultiplier: 0.88,
        syncTouch: false,
        overscroll: false,
        anchors: { offset: -84 },
      });
      stopVirtualScroll = lenis.on('virtual-scroll', wake);
      window.addEventListener('pointerup', wake, { passive: true, capture: true });
    };

    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (lenis?.isScrolling) {
        wake();
      }
    };

    sync();
    finePointer.addEventListener('change', sync);
    reducedMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      stop();
      finePointer.removeEventListener('change', sync);
      reducedMotion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return null;
}
