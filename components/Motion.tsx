'use client';
import { useEffect } from 'react';
export default function Motion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const cards = document.querySelectorAll<HTMLElement>('.steps article,.deliverable-card');
    const titles = document.querySelectorAll<HTMLElement>('main h2,.manifesto .panel-content > p');
    const elements = [...cards, ...titles];
    const revealAll = () => elements.forEach(element => { element.classList.remove('reveal', 'title-reveal', 'visible'); element.style.removeProperty('--reveal-delay'); });
    if (preference.matches) return;
    document.querySelectorAll('.deliverable-grid').forEach(grid => grid.querySelectorAll<HTMLElement>('.deliverable-card').forEach((card, index) => card.style.setProperty('--reveal-delay', `${index * 100}ms`)));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.01 });
    cards.forEach(element => { element.classList.add('reveal'); observer.observe(element); });
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
  return null;
}
