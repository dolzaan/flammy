'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Adapted from David Haz's React Bits LineSidebar.
 * Native links, CSS interactions and scroll-aware selection for Flammy.
 * https://github.com/DavidHDev/react-bits — license in licenses/react-bits.md.
 */
const links = [
  { id: 'trabalhos', label: 'Trabalhos' },
  { id: 'studio', label: 'Studio' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'entregas', label: 'Entregas' },
  { id: 'processo', label: 'Processo' },
  { id: 'contato', label: 'Contato' }
];

export default function LineSidebar() {
  const [active, setActive] = useState('inicio');
  const [visible, setVisible] = useState(false);
  const aside = useRef<HTMLElement>(null);
  const interacting = useRef(false);
  const hideTimer = useRef<number | undefined>(undefined);
  const activeRef = useRef('inicio');
  const visibleRef = useRef(false);

  const setVisibility = useCallback((next: boolean) => {
    if (visibleRef.current === next) return;
    visibleRef.current = next;
    setVisible(next);
  }, []);
  const hideAfterIdle = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!interacting.current && !aside.current?.contains(document.activeElement)) setVisibility(false);
    }, 2500);
  }, [setVisibility]);

  useEffect(() => {
    let frame = 0;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    const update = () => {
      frame = 0;
      let id = 'trabalhos';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= innerHeight * 0.35) id = section.id;
      }
      if (id !== activeRef.current) {
        activeRef.current = id;
        setActive(id);
      }
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onScroll = () => {
      setVisibility(window.scrollY > 12);
      hideAfterIdle();
      scheduleUpdate();
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleUpdate);
      window.clearTimeout(hideTimer.current);
    };
  }, [hideAfterIdle, setVisibility]);

  const activePosition = Math.max(1, links.findIndex(link => link.id === active) + 1);
  return <aside ref={aside} className="section-sidebar" data-visible={visible} aria-hidden={!visible} inert={!visible}
    onPointerEnter={() => { interacting.current = true; window.clearTimeout(hideTimer.current); }}
    onPointerLeave={() => { interacting.current = false; hideAfterIdle(); }}
    onFocusCapture={() => window.clearTimeout(hideTimer.current)} onBlurCapture={hideAfterIdle}>
    <nav className="line-sidebar" aria-label="Seções do site">
      <p className="line-sidebar__counter" aria-label={`Seção ${activePosition} de ${links.length}`} style={{visibility: active === 'inicio' ? 'hidden' : 'visible'}}>
        {String(activePosition).padStart(2, '0')} <span>de {String(links.length).padStart(2, '0')}</span>
      </p>
      <ul className="line-sidebar__list">
        {links.map((link, index) => <li key={link.id} className="line-sidebar__item">
          <a className="line-sidebar__link" href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined}>
            <span className="line-sidebar__marker" aria-hidden="true"/>
            <span className="line-sidebar__label"><span className="line-sidebar__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{link.label}</span>
          </a>
        </li>)}
      </ul>
    </nav>
  </aside>;
}
