'use client';

import DarkVeil from './DarkVeil';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

/**
 * Adapted from Skiper 19 by @gurvinder-singh02 (https://skiper-ui.com).
 * Free version: attribution required. Inspired by comgio.ai; independent recreation.
 * Original supplied by the client; adapted to Flammy's colors and responsive layout.
 */
// Hand-drawn route: orbit, knot, wide sweep, spiral, then a loose signature.
const stroke = 'M1050 230 C1130 160 1260 200 1210 320 C1160 440 960 400 970 300 C980 220 1140 300 1100 410 C1060 520 890 440 920 350 C950 260 1070 360 1040 450 C970 580 1230 600 1180 760 C1130 920 790 850 650 960 C510 1070 740 1180 850 1060 C960 940 1050 1200 890 1320 C730 1440 450 1260 260 1450 C70 1640 160 1850 350 1790 C540 1730 330 1560 250 1710 C170 1860 510 1960 750 1890 C990 1820 1280 1980 1160 2220 C1040 2460 800 2250 900 2110 C1000 1970 1170 2320 1010 2480 C850 2640 380 2520 160 2730 C-60 2940 140 3150 380 3060 C620 2970 480 2830 360 2920 C240 3010 560 3200 850 3120 C1140 3040 1310 3260 1170 3440 C1030 3620 870 3490 950 3380 C1030 3270 1210 3500 1090 3650 C970 3800 680 3750 560 3890 C440 4030 700 4180 820 4050 C940 3920 1080 4140 980 4300 C880 4460 1280 4480 1160 4690 C1040 4900 790 4800 860 4630 C930 4460 1150 4780 1010 4930 C870 5080 440 5000 300 5200 C160 5400 510 5510 650 5350 C790 5190 900 5500 770 5650 C640 5800 970 5950 1080 5810 C1190 5670 1310 5920 1140 6120';
type ProtectedArea = { x: number; y: number; width: number; height: number };
type Sample = { y: number; length: number };


export default function ScrollStroke({ children }: { children: ReactNode }) {
  const siteRef = useRef<HTMLDivElement>(null);
  const maskId = useId().replace(/:/g, '');
  const [protectedAreas, setProtectedAreas] = useState<ProtectedArea[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ trackContentSize: true });
  const [visibleFraction, setVisibleFraction] = useState(0.15);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const site = siteRef.current;
      if (!site) return;
      const bounds = site.getBoundingClientRect();
      setVisibleFraction(Math.min(1, window.innerHeight / bounds.height));
      const scaleX = 1340 / bounds.width, scaleY = 6100 / bounds.height;
      const padding = window.innerWidth < 600 ? 8 : 14;
      const selectors = '.hero .eyebrow, .hero .eyebrow span, .hero h1, .hero-bottom, .hero-rule, .services .section-label, .services .section-heading, .service-list, footer';
      const areas = Array.from(site.querySelectorAll<HTMLElement>(selectors)).flatMap(element => {
        if (element.closest('.honeypot')) return [];
        const safePadding = element.closest('.reveal') ? padding + 28 : padding;
        return Array.from(element.getClientRects()).filter(rect => rect.width && rect.height).map(rect => ({
          x: (rect.left - bounds.left - safePadding) * scaleX,
          y: (rect.top - bounds.top - safePadding) * scaleY,
          width: (rect.width + safePadding * 2) * scaleX,
          height: (rect.height + safePadding * 2) * scaleY,
        }));
      });
      setProtectedAreas(areas);
    };
    const scheduleMeasure = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    measure();
    const path = pathRef.current;
    if (path) {
      const total = path.getTotalLength();
      const route: Sample[] = [{ y: 0, length: 0 }];
      let furthestY = 0;
      for (let i = 1; i <= 800; i++) {
        const y = Math.min(1, Math.max(0, path.getPointAtLength(total * i / 800).y / 6100));
        if (y > furthestY) { route.push({ y, length: i / 800 }); furthestY = y; }
      }
      route.push({ y: 1, length: 1 });
      setSamples(route);
    }
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(document.body);
    const site = siteRef.current;
    site?.querySelectorAll('section, details, form, .hero .eyebrow, .hero h1, .hero-bottom, .hero-rule').forEach(element => observer.observe(element));
    site?.addEventListener('toggle', scheduleMeasure, true);
    let active = true;
    document.fonts.ready.then(() => { if (active) scheduleMeasure(); });
    window.addEventListener('resize', scheduleMeasure);
    return () => { active = false; cancelAnimationFrame(frame); observer.disconnect(); site?.removeEventListener('toggle', scheduleMeasure, true); window.removeEventListener('resize', scheduleMeasure); };
  }, []);

  const pathLength = useTransform(scrollYProgress, (progress) => {
    if (progress >= 0.9999) return 1;
    const y = visibleFraction * 0.62 + (1 - visibleFraction) * progress;
    if (!samples.length) return y;
    const index = samples.findIndex(sample => sample.y >= y);
    if (index <= 0) return index === 0 ? samples[0].length : 1;
    const before = samples[index - 1], after = samples[index];
    const fraction = (y - before.y) / (after.y - before.y || 1);
    return before.length + fraction * (after.length - before.length);
  });
  const drawing = reducedMotion ? 1 : pathLength;

  return (
    <div ref={siteRef} className="scroll-site">
      <DarkVeil/>
      {children}
      <svg className="site-stroke" viewBox="0 0 1340 6100" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        <defs><mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1340" height="6100">
          <rect width="1340" height="6100" fill="white" />
          {protectedAreas.map((area, index) => <rect key={index} {...area} fill="black" rx="8" />)}
        </mask></defs>
        <g mask={`url(#${maskId})`}>
        <motion.path d={stroke} stroke="var(--pink)" strokeWidth="13" strokeLinecap="round" style={{ pathLength: drawing }} />
        <motion.path ref={pathRef} data-scroll-stroke d={stroke} stroke="var(--red)" strokeWidth="7" strokeLinecap="round" style={{ pathLength: drawing }} />
        </g>
      </svg>
    </div>
  );
}
