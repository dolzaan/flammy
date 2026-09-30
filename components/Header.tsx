"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Navigation from './Navigation';

export default function Header() {
  const [lightSurface, setLightSurface] = useState(false);
  useEffect(() => {
    let frame = 0;
    const surfaces = Array.from(document.querySelectorAll<HTMLElement>('main > section, main > .ribbon'));
    const update = () => {
      frame = 0;
      const header = document.querySelector('header');
      if (!header) return;
      const y = header.getBoundingClientRect().height / 2;
      const x = innerWidth < 600 ? 100 : 190;
      const surface = surfaces.find(element => {
        const rect = element.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      });
      setLightSurface(Boolean(surface && !surface.matches('.contact,.manifesto,.ribbon')));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <header data-tone={lightSurface ? 'light' : 'dark'}>
    <a className="brand" href="#inicio" aria-label="Flammy, início">
      <Image src={lightSurface ? '/flammy-logo.svg' : '/flammy-logo-cream.svg'} width={846} height={156} unoptimized alt="Flammy Studio Criativo" sizes="(max-width: 600px) 160px, 280px" priority/>
    </a><Navigation/>
  </header>;
}
