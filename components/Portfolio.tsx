'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const FlexCarousel = dynamic(() => import('./FlexCarousel'), { ssr: false });
const names = ['Fachada', 'Fitas e padrões', 'Sinalização', 'Cartão da marca', 'Papelaria', 'Carrinho de flores', 'Cartões de visita', 'Buquê', 'Embalagem', 'Avental', 'Ecobag'];
const items = names.map((title, index) => ({ src: `/portfolio-image/${index + 1}`, title, alt: `${title} — identidade visual Aurora Floricultura Boutique`, subtitle: 'Aurora · Identidade visual' }));

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(false);
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
  return <section ref={root} id="trabalhos" className="portfolio section">
    <div className="panel-surface" aria-hidden="true"/>
    <div className="panel-content">
      <div className="section-label">01 / TRABALHOS QUE GANHAM VIDA</div>
      <div className="portfolio-heading"><h2>Da essência ao <em>mundo.</em></h2><div><h3>Aurora</h3><p>Floricultura Boutique · Identidade visual</p></div></div>
      <div className="portfolio-gallery">
        {ready && webgl ? <FlexCarousel items={items} preset="ribbon" intro="none" cardHeight={0.76} gap={22} radius={28} fit="natural" bend={0.12} dispersion={0.12} squeeze={0.08} captions={false} captureWheel={false} focusOnClick={false} onSelect={open}/> : <div className="portfolio-native" aria-label="Mockups da Aurora">{items.map((item, index) => <button key={item.src} className="portfolio-native-card" onClick={() => open(index)} aria-label={`Ampliar ${item.title}`}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 78vw, 450px" unoptimized/></button>)}</div>}
      </div>
    </div>
    <dialog ref={dialog} className="portfolio-dialog" aria-label="Mockup Aurora ampliado" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <button className="portfolio-close" onClick={() => dialog.current?.close()} aria-label="Fechar imagem"><X size={22}/></button>
      <div className="portfolio-full-image"><Image src={items[opened].src} alt={items[opened].alt} fill unoptimized sizes="100vw"/></div>
      <div className="portfolio-modal-controls"><button onClick={() => setOpened(i => (i + 10) % 11)} aria-label="Imagem anterior"><ArrowLeft size={20}/></button><span>{items[opened].title} · {opened + 1} / 11</span><button onClick={() => setOpened(i => (i + 1) % 11)} aria-label="Próxima imagem"><ArrowRight size={20}/></button></div>
    </dialog>
  </section>;
}
