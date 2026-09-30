'use client';

import { useEffect } from 'react';

const SNAP_SELECTOR = 'main > section, .scroll-site > footer';

export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let gestureLocked = false;
    let unlockTimer = 0;
    let minimumLockUntil = 0;

    const targets = () => Array.from(document.querySelectorAll<HTMLElement>(SNAP_SELECTOR));

    const targetTop = (element: HTMLElement) => {
      const headerHeight = document.querySelector<HTMLElement>('header')?.offsetHeight ?? 0;
      return Math.max(0, element.getBoundingClientRect().top + window.scrollY - headerHeight);
    };

    const currentIndex = (elements: HTMLElement[]) => {
      const headerHeight = document.querySelector<HTMLElement>('header')?.offsetHeight ?? 0;
      const anchor = window.scrollY + headerHeight;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      elements.forEach((element, index) => {
        const distance = Math.abs(element.getBoundingClientRect().top + window.scrollY - anchor);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      return bestIndex;
    };

    const scheduleUnlock = () => {
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        const wait = Math.max(0, minimumLockUntil - performance.now());
        if (wait > 0) {
          unlockTimer = window.setTimeout(() => { gestureLocked = false; }, wait);
        } else {
          gestureLocked = false;
        }
      }, 180);
    };

    const onWheel = (event: WheelEvent) => {
      if (!finePointer.matches || event.ctrlKey || Math.abs(event.deltaY) < 8) return;
      event.preventDefault();
      scheduleUnlock();
      if (gestureLocked) return;

      const elements = targets();
      if (!elements.length) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(elements.length - 1, Math.max(0, currentIndex(elements) + direction));
      const next = elements[nextIndex];
      if (!next) return;

      gestureLocked = true;
      minimumLockUntil = performance.now() + (reducedMotion.matches ? 120 : 680);
      window.scrollTo({ top: targetTop(next), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.clearTimeout(unlockTimer);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return null;
}
