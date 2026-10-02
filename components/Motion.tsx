'use client';
import { useEffect } from 'react';
import SmoothScroll from './SmoothScroll';

export default function Motion() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const titles = [...document.querySelectorAll<HTMLElement>('main h1,main h2,.manifesto .panel-content > p')];
    const content = [...document.querySelectorAll<HTMLElement>('.service,.deliverable-card,.steps article,#studio .value-spotlight,.studio-copy,.hero-bottom,.contact-grid>div,.contact-form,.manifesto-bottom')].filter(el => !el.querySelector('.contact-form'));
    const elements = [...titles, ...content];
    const spotlight = [...document.querySelectorAll<HTMLElement>('.service,.steps article')];
    const clean = () => elements.forEach(el => {
      el.classList.remove('site-blur-ready','site-content-ready','visible');
      el.style.removeProperty('--reveal-delay');
    });
    if (preference.matches) return;
    document.querySelectorAll('.service-list,.deliverable-grid,.steps,.values').forEach(group =>
      Array.from(group.children).forEach((el,index) => (el as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(index * 60,240)}ms`))
    );
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    titles.forEach(el => { el.classList.add('site-blur-ready'); observer.observe(el); });
    content.forEach(el => { el.classList.add('site-content-ready'); observer.observe(el); });
    let frame: number | null = null;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || preference.matches || !(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>('.service,.steps article');
      if (!card) return;
      if (frame !== null) cancelAnimationFrame(frame);
      const x = event.clientX, y = event.clientY;
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${x-bounds.left}px`);
        card.style.setProperty('--mouse-y', `${y-bounds.top}px`);
        frame = null;
      });
    };
    spotlight.forEach(el => el.classList.add('site-spotlight'));
    document.addEventListener('pointermove',onPointer,{passive:true});
    const onChange = () => {
      if (preference.matches) {
        observer.disconnect(); clean();
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
      }
    };
    preference.addEventListener('change',onChange);
    return () => {
      observer.disconnect(); clean();
      document.removeEventListener('pointermove',onPointer);
      preference.removeEventListener('change',onChange);
      spotlight.forEach(el => el.classList.remove('site-spotlight'));
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);
  return <SmoothScroll />;
}
