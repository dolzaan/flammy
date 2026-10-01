"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Navigation from './Navigation';
import GlassSurface from './GlassSurface';

export default function Header() {
  const [lightSurface, setLightSurface] = useState(false);
  useEffect(() => {
    let frame = 0;
    // Measure painted cards, not their transparent section wrappers.
    const surfaces = Array.from(document.querySelectorAll<HTMLElement>('.panel-surface, .hero > .panel-content, .brand-text-loop, footer'));
    const brand = document.querySelector<HTMLElement>('header .brand');
    const update = () => {
      frame = 0;
      if (!brand) return;
      const logo = brand.getBoundingClientRect();
      const points = [0.2, 0.5, 0.8].map(ratio => ({ x: logo.left + logo.width * ratio, y: logo.top + logo.height / 2 }));
      const painted = surfaces.map(surface => ({ style: getComputedStyle(surface), rect: surface.getBoundingClientRect() }));
      let lightPoints = 0;
      for (const point of points) {
        let light = false;
        for (const { style, rect } of painted) {
          if (style.display === 'none' || style.visibility === 'hidden') continue;
          if (point.x < rect.left || point.x > rect.right || point.y < rect.top || point.y > rect.bottom) continue;
          const radius = Math.min(parseFloat(style.borderTopLeftRadius) || 0, rect.width / 2, rect.height / 2);
          const dx = Math.max(rect.left + radius - point.x, 0, point.x - (rect.right - radius));
          const dy = Math.max(rect.top + radius - point.y, 0, point.y - (rect.bottom - radius));
          if (dx * dx + dy * dy > radius * radius) continue;
          const colors = style.backgroundImage.match(/rgba?\([^)]+\)/g);
          const color = style.backgroundColor === 'rgba(0, 0, 0, 0)' ? colors?.at(-1) : style.backgroundColor;
          const values = color?.match(/[\d.]+/g)?.map(Number);
          if (!values || (values[3] ?? 1) < 0.4) continue;
          const luminance = (0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2]) / 255;
          light = luminance > 0.6;
        }
        if (light) lightPoints++;
      }
      setLightSurface(lightPoints >= 2);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    surfaces.forEach(surface => observer.observe(surface));
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <header data-tone={lightSurface ? 'light' : 'dark'}>
    <GlassSurface/>
    <a className="brand" href="#inicio" aria-label="Flammy, início">
      <Image className="brand-logo brand-logo--cream" src="/flammy-logo-cream.svg" width={846} height={156} unoptimized alt="Flammy Studio Criativo" sizes="(max-width: 600px) 160px, 280px" priority/>
      <Image className="brand-logo brand-logo--wine" src="/flammy-logo.svg" width={846} height={156} unoptimized alt="" aria-hidden="true" sizes="(max-width: 600px) 160px, 280px" priority/>
    </a><Navigation/>
  </header>;
}
