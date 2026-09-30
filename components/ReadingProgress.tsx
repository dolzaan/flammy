'use client';
import { motion, useScroll } from 'framer-motion';
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll({ trackContentSize: true });
  return <div className="reading-progress" aria-hidden="true"><motion.div style={{ scaleX: scrollYProgress }} /></div>;
}
