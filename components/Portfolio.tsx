'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FlexCarousel = dynamic(() => import('./FlexCarousel'), { ssr: false });
const names = ['Fachada', 'Fitas e padrões', 'Sinalização', 'Cartão da marca', 'Papelaria', 'Carrinho de flores', 'Cartões de visita', 'Buquê', 'Embalagem', 'Avental', 'Ecobag'];
const dimensions = [[2048,1365],[2048,1536],[2048,1536],[2048,1536],[1365,2048],[1365,2048],[2048,1536],[1366,2048],[1365,2047],[1856,1578],[2048,1365]];
const items = names.map((title, index) => ({ src: `/portfolio-image/${index + 1}`, title, alt: `${title} — identidade visual Aurora Floricultura Boutique`, subtitle: 'Aurora · Identidade visual' }));

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [opened, setOpened] = useState(0);
  const [active, setActive] = useState(0);
  const [explored, setExplored] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const scrollFrame = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      setWebgl(Boolean(gl) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      setReady(true);
      observer.disconnect();
    }, { rootMargin: '180px' });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (webgl) return;
    const gallery = root.current?.querySelector<HTMLElement>('.portfolio-native');
    if (!gallery) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? gallery.clientWidth : 1;
      const delta = event.deltaY * unit;
      const limit = gallery.scrollWidth - gallery.clientWidth;
      if (limit <= 0 || (delta < 0 && gallery.scrollLeft <= 1) || (delta > 0 && gallery.scrollLeft >= limit - 1)) return;
      event.preventDefault();
      gallery.scrollLeft += delta;
    };
    gallery.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      gallery.removeEventListener('wheel', onWheel);
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    };
  }, [webgl, ready]);

  const open = (index: number) => { setClosing(false); setOpened(index); setIsOpen(true); dialog.current?.showModal(); };
  const close = () => {
    if (closing) return;
    if (reducedMotion) { dialog.current?.close(); return; }
    setClosing(true);
    closeTimer.current = setTimeout(() => { dialog.current?.close(); setClosing(false); closeTimer.current = null; }, 220);
  };
  return <section ref={root} id="trabalhos" className="portfolio section">
    <div className="panel-surface" aria-hidden="true"/>
    <div className="panel-content">
      <div className="section-label">01 / TRABALHOS QUE GANHAM VIDA</div>
      <div className="portfolio-heading"><h2>Da essência ao <em>mundo.</em></h2><div><h3>Aurora</h3><p>Floricultura Boutique · Identidade visual</p></div></div>
      <div className="portfolio-gallery" onWheelCapture={() => setExplored(true)} onTouchMove={() => setExplored(true)} onPointerMove={event => { if (event.buttons === 1) setExplored(true); }}>
        {ready && webgl ? <FlexCarousel items={items} preset="ribbon" intro="none" cardHeight={0.76} gap={22} radius={28} fit="natural" bend={0.12} dispersion={0.12} squeeze={0.08} captions={false} captureWheel={true} focusOnClick={false} onSelect={open} onChange={setActive}/> : <div className="portfolio-native" aria-label="Mockups da Aurora" onScroll={event => {
          if (scrollFrame.current !== null) return;
          const gallery = event.currentTarget;
          scrollFrame.current = requestAnimationFrame(() => {
            scrollFrame.current = null;
            const bounds = gallery.getBoundingClientRect();
            const center = bounds.left + bounds.width / 2;
            let closest = 0;
            let distance = Infinity;
            Array.from(gallery.children).forEach((card, index) => {
              const rect = card.getBoundingClientRect();
              const next = Math.abs(rect.left + rect.width / 2 - center);
              if (next < distance) { closest = index; distance = next; }
            });
            setActive(closest);
          });
        }} onPointerDown={event => {
          if (event.pointerType !== 'mouse' || event.button !== 0) return;
          drag.current = { down: true, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false };
        }} onPointerMove={event => {
          if (!drag.current.down) return;
          if (!(event.buttons & 1)) { drag.current.down = false; return; }
          const delta = event.clientX - drag.current.startX;
          if (Math.abs(delta) > 6) drag.current.moved = true;
          if (drag.current.moved) { event.preventDefault(); event.currentTarget.scrollLeft = drag.current.startScroll - delta; }
        }} onPointerUp={() => { drag.current.down = false; }} onPointerLeave={() => { drag.current.down = false; }} onPointerCancel={() => { drag.current.down = false; }} onClickCapture={event => {
          if (drag.current.moved) { event.preventDefault(); event.stopPropagation(); drag.current.moved = false; }
        }} onDragStart={event => event.preventDefault()}>{items.map((item, index) => <button key={item.src} className="portfolio-native-card" onClick={() => open(index)} aria-label={`Ampliar ${item.title}`}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 78vw, 450px" unoptimized draggable={false}/></button>)}</div>}
      </div>
      <div className="portfolio-explore">
        <span className="portfolio-drag-arrow" data-hidden={explored} aria-hidden="true"><svg width="62" height="18" viewBox="0 0 62 18" fill="none"><path d="M1 9H60M52 1L60 9L52 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
        <div className="portfolio-position" aria-label={`Imagem ${active + 1} de ${items.length}: ${items[active].title}`}>
          <div className="portfolio-dots" aria-hidden="true">{items.map((item, index) => <span key={item.src} data-active={active === index}/>)}</div>
          <span className="portfolio-count" aria-hidden="true">{String(active + 1).padStart(2, '0')} / {items.length}</span>
        </div>
      </div>
    </div>
    <dialog ref={dialog} className="portfolio-dialog" data-closing={closing} aria-label="Mockup Aurora ampliado. Clique fora da imagem ou pressione Esc para fechar." onCancel={e => { e.preventDefault(); close(); }} onClose={() => setIsOpen(false)} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setOpened(i => (i + (e.key === 'ArrowRight' ? 1 : 10)) % 11); } }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <motion.div key={opened} className="portfolio-full-image" initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.24, ease: 'easeOut' }}><Image src={items[opened].src} alt={items[opened].alt} width={dimensions[opened][0]} height={dimensions[opened][1]} unoptimized sizes="94vw"/></motion.div>
      <div className="portfolio-modal-controls"><button onClick={() => setOpened(i => (i + 10) % 11)} aria-label="Imagem anterior"><ArrowLeft size={20}/></button><span>{items[opened].title} · {opened + 1} / 11</span><button onClick={() => setOpened(i => (i + 1) % 11)} aria-label="Próxima imagem"><ArrowRight size={20}/></button></div>
    </dialog>
  </section>;
}
