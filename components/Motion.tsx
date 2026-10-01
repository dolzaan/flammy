'use client';
import { useEffect } from 'react';
import SmoothScroll from './SmoothScroll';
export default function Motion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const cards = document.querySelectorAll<HTMLElement>('.steps article,.deliverable-card');
    const titles = document.querySelectorAll<HTMLElement>('main h2:not(.studio-blur-text),.manifesto .panel-content > p');
    const sections = document.querySelectorAll<HTMLElement>('main>section:not(.hero)>.panel-content,main>.brand-text-loop');
    const blurTitles = document.querySelectorAll<HTMLElement>('.studio-blur-text');
    const elements = [...cards, ...titles, ...sections, ...blurTitles];
    const revealAll = () => elements.forEach(element => { element.classList.remove('reveal', 'title-reveal', 'scroll-reveal', 'blur-text-ready', 'visible'); element.style.removeProperty('--reveal-delay'); });
    if (preference.matches) return;
    document.querySelectorAll('.deliverable-grid').forEach(grid => grid.querySelectorAll<HTMLElement>('.deliverable-card').forEach((card, index) => card.style.setProperty('--reveal-delay', `${index * 100}ms`)));
    document.querySelectorAll<HTMLElement>('#processo .steps article').forEach((card, index) => card.style.setProperty('--reveal-delay', `${index * 70}ms`));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });
    cards.forEach(element => { element.classList.add('reveal'); observer.observe(element); });
    blurTitles.forEach(element => { element.classList.add('blur-text-ready'); observer.observe(element); });
    sections.forEach(element => {
      if (element.closest('#studio,#processo')) return;
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
