'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Adapted from Skiper 19 by @gurvinder-singh02 (https://skiper-ui.com).
 * Free version: attribution required. Inspired by comgio.ai; independent recreation.
 * Original supplied by the client; adapted to Flammy's colors and responsive layout.
 */
// A continuous, mostly vertical route keeps the drawing aligned with page progress.
const stroke = 'M1010 0 C1010 100 1250 140 1150 300 C1050 460 730 240 800 430 C870 620 1220 530 1160 760 C1100 990 980 1020 1040 1250 C1100 1480 1200 1480 1080 1700 C960 1920 1080 1970 1180 2150 C1280 2330 1050 2480 980 2670 C910 2860 1150 2890 1150 3100 C1150 3310 820 3260 900 3490 C980 3720 1230 3670 1130 3910 C1030 4150 1060 4120 1150 4360 C1240 4600 920 4580 1000 4800 C1080 5020 1210 5050 1120 5300 C1030 5550 920 5500 1000 5710 C1080 5920 1140 5930 1080 6100';

export default function ScrollStroke({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ trackContentSize: true });
  const [visibleFraction, setVisibleFraction] = useState(0.15);

  useEffect(() => {
    const measure = () => setVisibleFraction(Math.min(1, window.innerHeight / document.documentElement.scrollHeight));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const pathLength = useTransform(scrollYProgress, [0, 1], [visibleFraction, 1]);
  const drawing = reducedMotion ? 1 : pathLength;

  return (
    <div className="scroll-site">
      {children}
      <svg className="site-stroke" viewBox="0 0 1340 6100" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        <motion.path d={stroke} stroke="var(--pink)" strokeWidth="14" strokeLinecap="round" style={{ pathLength: drawing }} />
        <motion.path data-scroll-stroke d={stroke} stroke="var(--red)" strokeWidth="6" strokeLinecap="round" style={{ pathLength: drawing }} />
      </svg>
    </div>
  );
}
