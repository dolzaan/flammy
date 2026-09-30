/** Lightweight GlassSurface treatment: the glass stays crisp without an SVG
 * displacement filter being recomposited during every scroll frame. */
export default function GlassSurface() {
  return <div className="header-glass" aria-hidden="true" />;
}
