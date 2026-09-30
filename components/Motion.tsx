'use client';
import { useEffect } from 'react';
export default function Motion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const elements = document.querySelectorAll<HTMLElement>('.section-heading,.studio-content,.steps article,.deliverable-card');
    const revealAll = () => elements.forEach(element => { element.classList.remove('reveal'); element.style.removeProperty('--reveal-delay'); });
    if (preference.matches) return;
    document.querySelectorAll('.deliverable-grid').forEach(grid => grid.querySelectorAll<HTMLElement>('.deliverable-card').forEach((card, index) => card.style.setProperty('--reveal-delay', `${index * 100}ms`)));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    elements.forEach(element => { element.classList.add('reveal'); observer.observe(element); });
    const onChange = () => { if (preference.matches) { observer.disconnect(); revealAll(); } };
    preference.addEventListener('change', onChange);
    return () => { observer.disconnect(); preference.removeEventListener('change', onChange); revealAll(); };
  }, []);
  return null;
}
