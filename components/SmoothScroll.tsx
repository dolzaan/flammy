'use client';

import { useEffect } from 'react';

const SNAP_SELECTOR = 'main > section';

export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let settling = false;
    let releaseTimer = 0;

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

    const onWheel = (event: WheelEvent) => {
      if (!finePointer.matches || event.ctrlKey || event.deltaY === 0) return;
      // Suppress inertia during a bounded transition. Wheel events must never
      // extend this deadline, or a continuous wheel stream can lock navigation.
      event.preventDefault();
      if (settling || Math.abs(event.deltaY) < 2) return;

      const elements = targets();
      if (!elements.length) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const index = currentIndex(elements);
      const nextIndex = Math.min(elements.length - 1, Math.max(0, index + direction));
      if (nextIndex === index) return;

      settling = true;
      const next = elements[nextIndex];
      window.scrollTo({ top: targetTop(next), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      releaseTimer = window.setTimeout(() => {
        settling = false;
      }, reducedMotion.matches ? 180 : 850);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.clearTimeout(releaseTimer);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return null;
}

