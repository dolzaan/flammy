'use client';

import { useEffect, useRef, type ButtonHTMLAttributes } from 'react';

// Adapted from React Bits StarBorder by David Haz; licenses/react-bits.md.
export default function StarBorder({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const root = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const button = root.current;
    if (!button) return;
    let visible = false;
    const update = () => { button.dataset.running = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(button);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <button ref={root} className={`star-border ${className}`} {...props}>
    <span className="star-border__bottom" aria-hidden="true"/><span className="star-border__top" aria-hidden="true"/>
    <span className="star-border__content">{children}</span>
  </button>;
}
