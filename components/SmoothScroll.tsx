'use client';

import { useEffect } from 'react';

const SNAP_SELECTOR = 'main > section';

export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let settling = false;
    let scrollFinished = true;
    let wheelIdle = true;
    let idleTimer = 0;
    let fallbackTimer = 0;

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

    const releaseIfReady = () => {
      if (scrollFinished && wheelIdle) settling = false;
    };

    const markWheelActivity = () => {
      wheelIdle = false;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        wheelIdle = true;
        releaseIfReady();
      }, 320);
    };

    const onScrollEnd = () => {
      scrollFinished = true;
      window.clearTimeout(fallbackTimer);
      releaseIfReady();
    };

    const onWheel = (event: WheelEvent) => {
      if (!finePointer.matches || event.ctrlKey || event.deltaY === 0) return;
      // Consume the entire gesture, including the tiny inertial tail. Letting
      // those events scroll natively can interrupt snapping or advance twice.
      event.preventDefault();
      // Ignore sensor noise for the lock timer, while still preventing native
      // scrolling. Otherwise a stream of tiny deltas keeps navigation locked.
      if (Math.abs(event.deltaY) < 8) return;
      markWheelActivity();
      if (settling) return;

      const elements = targets();
      if (!elements.length) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const index = currentIndex(elements);
      const nextIndex = Math.min(elements.length - 1, Math.max(0, index + direction));
      if (nextIndex === index) return;

      settling = true;
      scrollFinished = false;
      const next = elements[nextIndex];
      window.scrollTo({ top: targetTop(next), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      window.clearTimeout(fallbackTimer);
      fallbackTimer = window.setTimeout(() => {
        scrollFinished = true;
        releaseIfReady();
      }, reducedMotion.matches ? 120 : 1000);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scrollend', onScrollEnd);
    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scrollend', onScrollEnd);
    };
  }, []);

  return null;
}

