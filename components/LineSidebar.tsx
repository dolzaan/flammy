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
  const [visible, setVisible] = useState(false);
  const aside = useRef<HTMLElement>(null);
  const interacting = useRef(false);
  const hideTimer = useRef<number | undefined>(undefined);
  const hideAfterIdle = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!interacting.current && !aside.current?.contains(document.activeElement)) setVisible(false);
    }, 1100);
  }, []);
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
      // Labels inherit a contrasting tone from the actual surface beneath them.
      items.current.forEach(item => {
        if (!item) return;
        const bounds = item.getBoundingClientRect();
        const x = innerWidth - 100, y = bounds.top + bounds.height / 2;
        const dark = sections.some(section => {
          if (!section.matches('.contact,.manifesto')) return false;
          const rect = section.getBoundingClientRect();
          return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        });
        item.style.setProperty('--sidebar-label-color', dark ? '#f4bad1' : '#930c17');
      });
    };
    const onResize = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(update); };
    const onScroll = () => {
      setVisible(window.scrollY > 12);
      hideAfterIdle();
      onResize();
    };
    update(); window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(scrollFrame); cancelAnimationFrame(frame.current); frame.current = 0;
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize);
      window.clearTimeout(hideTimer.current);
      preference.removeEventListener('change', change);
    };
  }, [schedule, hideAfterIdle]);

  return <aside ref={aside} className="section-sidebar" data-visible={visible} aria-hidden={!visible} inert={!visible}
    onPointerEnter={() => { interacting.current = true; window.clearTimeout(hideTimer.current); }}
    onPointerLeave={() => { interacting.current = false; hideAfterIdle(); }}
    onFocusCapture={() => window.clearTimeout(hideTimer.current)} onBlurCapture={hideAfterIdle}>
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
