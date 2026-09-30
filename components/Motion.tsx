'use client';
import { useEffect } from 'react';
import SmoothScroll from './SmoothScroll';
export default function Motion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const pinCapable = matchMedia('(min-width: 901px) and (min-height: 560px) and (hover: hover) and (pointer: fine)');
    const cards = document.querySelectorAll<HTMLElement>('.steps article,.deliverable-card');
    const titles = document.querySelectorAll<HTMLElement>('main h2,.manifesto .panel-content > p');
    const sections = document.querySelectorAll<HTMLElement>('main>section:not(.hero)>.panel-content,.story-stage>section>.panel-content,main>.brand-text-loop');
    const scenes = document.querySelectorAll<HTMLElement>('.story-stage>section');
    const details = document.querySelectorAll<HTMLElement>('.section-label,.studio-copy,.values>span,.section-heading>p,.service,.deliverable-footer,.manifesto-bottom,.contact-grid>div');
    const elements = [...cards, ...titles, ...sections, ...details, ...scenes];
    const clearPins = () => scenes.forEach(scene => { scene.classList.remove('scroll-pin'); scene.style.removeProperty('--scene-layer'); });
    const revealAll = () => elements.forEach(element => {
      element.classList.remove('reveal', 'title-reveal', 'scroll-reveal', 'detail-reveal', 'scene-reveal', 'visible');
      element.style.removeProperty('--reveal-delay');
      element.style.removeProperty('--detail-delay');
    });
    if (preference.matches) return;
    let resizeFrame = 0;
    const updatePins = () => {
      resizeFrame = 0;
      clearPins();
      if (!pinCapable.matches) return;
      scenes.forEach((scene, index) => {
        if (scene.offsetHeight <= innerHeight - 76) {
          scene.classList.add('scroll-pin');
          scene.style.setProperty('--scene-layer', String(index + 1));
        }
      });
    };
    const schedulePins = () => { if (!resizeFrame) resizeFrame = requestAnimationFrame(updatePins); };
    updatePins();
    window.addEventListener('resize', schedulePins);
    pinCapable.addEventListener('change', schedulePins);
    document.querySelectorAll('.deliverable-grid').forEach(grid => grid.querySelectorAll<HTMLElement>('.deliverable-card').forEach((card, index) => card.style.setProperty('--reveal-delay', `${index * 100}ms`)));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });
    cards.forEach(element => { element.classList.add('reveal'); observer.observe(element); });
    details.forEach((element, index) => {
      if (element.getBoundingClientRect().top < innerHeight * 0.92) return;
      element.classList.add('detail-reveal');
      element.style.setProperty('--detail-delay', `${(index % 4) * 70}ms`);
      observer.observe(element);
    });
    scenes.forEach(scene => {
      if (scene.getBoundingClientRect().top < innerHeight * 0.9) return;
      scene.classList.add('scene-reveal');
      observer.observe(scene);
    });
    sections.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top < innerHeight * 0.9 && rect.bottom > 0) return;
      element.classList.add('scroll-reveal');
      observer.observe(element);
    });
    titles.forEach(element => {
      // Keep titles already on screen readable during hydration.
      if (element.getBoundingClientRect().top < innerHeight) return;
      element.classList.add('title-reveal');
      observer.observe(element);
    });
    const onChange = () => { if (preference.matches) { observer.disconnect(); clearPins(); revealAll(); } };
    preference.addEventListener('change', onChange);
    return () => {
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      window.removeEventListener('resize', schedulePins);
      pinCapable.removeEventListener('change', schedulePins);
      preference.removeEventListener('change', onChange);
      clearPins();
      revealAll();
    };
  }, []);
  return <SmoothScroll />;
}
