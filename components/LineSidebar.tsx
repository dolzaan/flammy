'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Adapted from David Haz's React Bits LineSidebar.
 * Original proximity/smoothing interaction; native links and scroll-aware selection for Flammy.
 * https://github.com/DavidHDev/react-bits — license in licenses/react-bits.md.
 */
const links = [
  { id: 'studio', label: 'Studio' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'entregas', label: 'Entregas' },
  { id: 'processo', label: 'Processo' }
];

export default function LineSidebar() {
  const [active, setActive] = useState('inicio');
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const targets = useRef<number[]>([]);
  const current = useRef<number[]>([]);
  const activeIndex = useRef(-1);
  const frame = useRef(0);
  const last = useRef(0);
  const reduced = useRef(false);

  const runFrame = useCallback((now: number) => {
    frame.current = 0;
    const dt = Math.min((now - last.current) / 1000, 0.05);
    last.current = now;
    const k = reduced.current ? 1 : 1 - Math.exp(-dt / 0.1);
    let moving = false;
    items.current.forEach((item, i) => {
      if (!item) return;
      const target = Math.max(targets.current[i] || 0, activeIndex.current === i ? 1 : 0);
      const value = (current.current[i] || 0) + (target - (current.current[i] || 0)) * k;
      const settled = Math.abs(target - value) < 0.0015;
      current.current[i] = settled ? target : value;
      item.style.setProperty('--effect', current.current[i].toFixed(4));
      if (!settled) moving = true;
    });
    if (moving) frame.current = requestAnimationFrame(runFrame);
  }, []);
  const schedule = useCallback(() => {
    if (!frame.current) { last.current = performance.now(); frame.current = requestAnimationFrame(runFrame); }
  }, [runFrame]);
  const reset = () => { targets.current = links.map(() => 0); schedule(); };

  useEffect(() => {
    activeIndex.current = links.findIndex(link => link.id === active);
    schedule();
  }, [active, schedule]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { reduced.current = preference.matches; schedule(); };
    change(); preference.addEventListener('change', change);
    let scrollFrame = 0;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    const update = () => {
      scrollFrame = 0;
      let id = 'inicio';
      for (const section of sections) if (section.getBoundingClientRect().top <= innerHeight * 0.35) id = section.id;
      setActive(id);
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(scrollFrame); cancelAnimationFrame(frame.current); frame.current = 0;
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll);
      preference.removeEventListener('change', change);
    };
  }, [schedule]);

  return <aside className="section-sidebar">
    <span className="sidebar-caption">EXPLORE O STUDIO</span>
    <nav className="line-sidebar" aria-label="Seções do site">
      <ul className="line-sidebar__list" onPointerLeave={reset} onPointerMove={event => {
        if (event.pointerType === 'touch') return;
        targets.current = items.current.map(item => {
          if (!item) return 0;
          const rect = item.getBoundingClientRect();
          const p = Math.max(0, 1 - Math.abs(event.clientY - rect.top - rect.height / 2) / 90);
          return p * p * (3 - 2 * p);
        });
        schedule();
      }}>
        {links.map((link, index) => <li key={link.id} className="line-sidebar__item" ref={element => { items.current[index] = element; }}>
          <a className="line-sidebar__link" href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined}
            onFocus={() => { targets.current[index] = 1; schedule(); }} onBlur={reset}>
            <span className="line-sidebar__marker" aria-hidden="true"/>
            <span className="line-sidebar__label"><span className="line-sidebar__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{link.label}</span>
          </a>
        </li>)}
      </ul>
    </nav>
  </aside>;
}
