'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
const links = [{ id: 'studio', label: 'O studio' }, { id: 'servicos', label: 'O que fazemos' }, { id: 'entregas', label: 'Entregas', secondary: true }, { id: 'processo', label: 'Processo', secondary: true }];

export default function Navigation() {
  const [active, setActive] = useState('inicio');
  useEffect(() => {
    let frame = 0;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = 'inicio';
      for (const section of sections) if (section.getBoundingClientRect().top <= line) current = section.id;
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <nav aria-label="Navegação principal">
    {links.map(link => <a key={link.id} href={`#${link.id}`} className={link.secondary ? 'nav-secondary' : undefined} aria-current={active === link.id ? 'location' : undefined}>{link.label}</a>)}
    <a className="nav-cta" href="#contato" aria-current={active === 'contato' ? 'location' : undefined}>Vamos conversar <ArrowUpRight size={16} className="button-arrow" aria-hidden="true" /></a>
  </nav>;
}
