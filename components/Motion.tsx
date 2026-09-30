'use client';
import { useEffect } from 'react';
import SmoothScroll from './SmoothScroll';
export default function Motion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const cards = document.querySelectorAll<HTMLElement>('.steps article,.deliverable-card');
    const titles = document.querySelectorAll<HTMLElement>('main h2,.manifesto .panel-content > p');
    const sections = document.querySelectorAll<HTMLElement>('main>section:not(.hero)>.panel-content,main>.brand-text-loop');
    const elements = [...cards, ...titles, ...sections];
    const revealAll = () => elements.forEach(element => { element.classList.remove('reveal', 'title-reveal', 'scroll-reveal', 'visible'); element.style.removeProperty('--reveal-delay'); });
    if (preference.matches) return;
    document.querySelectorAll('.deliverable-grid').forEach(grid => grid.querySelectorAll<HTMLElement>('.deliverable-card').forEach((card, index) => card.style.setProperty('--reveal-delay', `${index * 100}ms`)));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });
    cards.forEach(element => { element.classList.add('reveal'); observer.observe(element); });
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
    const onChange = () => { if (preference.matches) { observer.disconnect(); revealAll(); } };
    preference.addEventListener('change', onChange);
    return () => { observer.disconnect(); preference.removeEventListener('change', onChange); revealAll(); };
  }, []);
  return <SmoothScroll />;
}
