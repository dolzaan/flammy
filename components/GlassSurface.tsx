/** Lightweight GlassSurface treatment: the glass stays crisp without an SVG
 * displacement filter being recomposited during every scroll frame. */
export default function GlassSurface({ className = '' }: { className?: string }) {
  return <div className={`header-glass ${className}`} aria-hidden="true" />;
}
