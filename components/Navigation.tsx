'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  { id: 'trabalhos', label: 'Trabalhos' },
  { id: 'studio', label: 'Studio' }, { id: 'servicos', label: 'Serviços' },
  { id: 'entregas', label: 'Entregas' }, { id: 'processo', label: 'Processo' }
];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const menuId = useId();
  const controls = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { rootMargin: '-90px 0px 0px', threshold: 0.1 });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = () => { setOpen(false); toggle.current?.focus({ preventScroll: true }); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    const outside = (event: PointerEvent) => { if (!controls.current?.contains(event.target as Node)) setOpen(false); };
    const media = window.matchMedia('(min-width: 1101px)');
    const resize = () => { if (media.matches) setOpen(false); };
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', outside);
    media.addEventListener('change', resize);
    return () => {
      document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside);
      media.removeEventListener('change', resize);
    };
  }, [open]);
  return <div className="header-controls" ref={controls}>
    <button className="mobile-menu-toggle" ref={toggle} type="button" aria-expanded={open} aria-controls={menuId}
      aria-label={open ? 'Fechar menu de seções' : 'Abrir menu de seções'} onClick={() => setOpen(value => !value)}>
      {open ? <X size={18} aria-hidden="true"/> : <Menu size={18} aria-hidden="true"/>}<span>Menu</span>
    </button>
    <a className="nav-cta header-contact" href="#contato" onClick={event => {
      setOpen(false);
      if (contactVisible) {
        const field = document.querySelector<HTMLInputElement>('.contact-form input[name="name"]');
        if (field) {
          event.preventDefault();
          field.focus({ preventScroll: true });
          const bounds = field.getBoundingClientRect();
          if (bounds.top < 100 || bounds.bottom > innerHeight) field.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        }
      }
    }}>
      <span className="contact-label-full">{contactVisible ? 'Conte sua ideia' : 'Vamos conversar'}</span><span className="contact-label-short">{contactVisible ? 'Sua ideia' : 'Conversar'}</span>
      <ArrowUpRight size={16} className="button-arrow" aria-hidden="true"/>
    </a>
    <nav id={menuId} className="mobile-navigation" aria-label="Menu de seções" hidden={!open}>
      {links.map((link, index) => <a href={`#${link.id}`} key={link.id} onClick={() => { setOpen(false); toggle.current?.focus({preventScroll:true}); }}>
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{link.label}<ArrowUpRight size={16} aria-hidden="true"/>
      </a>)}
    </nav>
  </div>;
}
