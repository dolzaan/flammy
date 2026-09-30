'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

/** Header adaptation of React Bits GlassSurface by David Haz.
 * RGB displacement filter and generated gradient map; license: licenses/react-bits.md.
 */
export default function GlassSurface() {
  const id = `header-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const root = useRef<HTMLDivElement>(null);
  const map = useRef<SVGFEImageElement>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const supports = () => {
      const safari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      setSupported(!safari && !/Firefox/.test(navigator.userAgent) && !preference.matches && CSS.supports('backdrop-filter', `url(#${id})`));
    };
    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      const edge = Math.min(width, height) * .05;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="r" x1="100%" x2="0%"><stop offset="0" stop-color="#0000"/><stop offset="1" stop-color="red"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0" stop-color="#0000"/><stop offset="1" stop-color="blue"/></linearGradient></defs><rect width="${width}" height="${height}" fill="black"/><rect width="${width}" height="${height}" fill="url(#r)"/><rect width="${width}" height="${height}" fill="url(#b)" style="mix-blend-mode:difference"/><rect x="${edge}" y="${edge}" width="${Math.max(0, width - edge * 2)}" height="${Math.max(0, height - edge * 2)}" fill="hsl(0 0% 50% / .96)" style="filter:blur(10px)"/></svg>`;
      map.current?.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(svg)}`);
    };
    update();
    supports();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    preference.addEventListener('change', supports);
    return () => { observer.disconnect(); preference.removeEventListener('change', supports); };
  }, [id]);

  return <div ref={root} className="header-glass" data-refraction={supported} aria-hidden="true" style={{ '--glass-filter': `url(#${id})` } as CSSProperties}>
    <svg className="header-glass__filter" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs><filter id={id} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
        <feImage ref={map} width="100%" height="100%" preserveAspectRatio="none" result="map"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-24" xChannelSelector="R" yChannelSelector="B" result="dispRed"/>
        <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-22" xChannelSelector="R" yChannelSelector="B" result="dispGreen"/>
        <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-20" xChannelSelector="R" yChannelSelector="B" result="dispBlue"/>
        <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
        <feBlend in="red" in2="green" mode="screen" result="rg"/>
        <feBlend in="rg" in2="blue" mode="screen" result="output"/>
        <feGaussianBlur in="output" stdDeviation=".7"/>
      </filter></defs>
    </svg>
  </div>;
}
