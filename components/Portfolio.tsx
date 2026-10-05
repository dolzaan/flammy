'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';

const FlexCarousel = dynamic(() => import('./FlexCarousel'), { ssr: false });
const names = ['Fachada', 'Fitas e padrões', 'Sinalização', 'Cartão da marca', 'Papelaria', 'Carrinho de flores', 'Cartões de visita', 'Buquê', 'Embalagem', 'Avental', 'Ecobag'];
const items = names.map((title, index) => ({ src: `/portfolio-image/${index + 1}`, title, alt: `${title} — identidade visual Aurora Floricultura Boutique`, subtitle: 'Aurora · Identidade visual' }));

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(0);
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
  const open = (index: number) => { setOpened(index); dialog.current?.showModal(); };
  const step = (direction: number) => {
    if (!webgl) { setActive(i => (i + direction + items.length) % items.length); return; }
    const carousel = root.current?.querySelector<HTMLElement>('.flex-carousel');
    carousel?.dispatchEvent(new KeyboardEvent('keydown', { key: direction > 0 ? 'ArrowRight' : 'ArrowLeft', bubbles: true }));
  };
  return <section ref={root} id="trabalhos" className="portfolio section">
    <div className="panel-surface" aria-hidden="true"/>
    <div className="panel-content">
      <div className="section-label">03 / TRABALHOS QUE GANHAM VIDA</div>
      <div className="portfolio-heading"><h2>Da essência ao <em>mundo.</em></h2><div><h3>Aurora</h3><p>Floricultura Boutique · Identidade visual</p></div></div>
      <div className="portfolio-gallery">
        {ready && webgl ? <FlexCarousel items={items} preset="ribbon" intro="none" cardHeight={0.76} gap={22} radius={18} fit="natural" bend={0.2} dispersion={0.12} squeeze={0.08} captions={false} captureWheel={false} focusOnClick={false} onChange={setActive} onSelect={open}/> : <button className="portfolio-fallback" onClick={() => open(active)} aria-label={`Ampliar ${items[active].title}`}><Image src={items[active].src} alt={items[active].alt} fill sizes="(max-width: 700px) 90vw, 800px" unoptimized/></button>}
      </div>
      <div className="portfolio-controls"><span>{String(active + 1).padStart(2, '0')} / 11 <span className="portfolio-current">· {items[active].title}</span></span><div><button onClick={() => step(-1)} aria-label="Mockup anterior"><ArrowLeft size={18}/></button><button onClick={() => open(active)} aria-label="Ampliar mockup"><Expand size={17}/></button><button onClick={() => step(1)} aria-label="Próximo mockup"><ArrowRight size={18}/></button></div></div>
      <p className="portfolio-hint">Arraste para explorar. Clique na imagem central para ampliar.</p>
    </div>
    <dialog ref={dialog} className="portfolio-dialog" aria-label="Mockup Aurora ampliado" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <button className="portfolio-close" onClick={() => dialog.current?.close()} aria-label="Fechar imagem"><X size={22}/></button>
      <div className="portfolio-full-image"><Image src={items[opened].src} alt={items[opened].alt} fill unoptimized sizes="100vw"/></div>
      <div className="portfolio-modal-controls"><button onClick={() => setOpened(i => (i + 10) % 11)} aria-label="Imagem anterior"><ArrowLeft size={20}/></button><span>{items[opened].title} · {opened + 1} / 11</span><button onClick={() => setOpened(i => (i + 1) % 11)} aria-label="Próxima imagem"><ArrowRight size={20}/></button></div>
    </dialog>
  </section>;
}
