import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Preview shown when the site link is shared (WhatsApp, Instagram, LinkedIn).
export const alt = 'Flammy — Studio Criativo. Design que acende marcas.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const file = (name: string) => readFile(join(process.cwd(), 'public', name));
  const [logo, serif, serifItalic, sans] = await Promise.all([
    file('flammy-logo-cream.svg'),
    file('fonts/fraunces-normal-500.woff'),
    file('fonts/fraunces-italic-500.woff'),
    file('fonts/dm-sans-normal-500.woff'),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 84px', background: 'linear-gradient(135deg, #930c17 0%, #4b1824 58%, #301015 100%)', color: '#f9f5f1', fontFamily: 'DM Sans' }}>
      <div style={{ display: 'flex' }}>
        {/* The logo artwork already includes "Studio Criativo". */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={347} height={64} alt="" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Fraunces', fontSize: 112, lineHeight: 1.02, letterSpacing: -4 }}>
        <span>Design que</span>
        <div style={{ display: 'flex' }}><span>acende</span><span style={{ fontStyle: 'italic', color: '#f4bad1', marginLeft: 26 }}>marcas.</span></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, letterSpacing: 2, opacity: 0.85 }}>
        <span>IDENTIDADES COM ESTRATÉGIA E PERSONALIDADE</span>
        <span>flammy.vercel.app</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: serif, style: 'normal', weight: 500 },
        { name: 'Fraunces', data: serifItalic, style: 'italic', weight: 500 },
        { name: 'DM Sans', data: sans, style: 'normal', weight: 500 },
      ],
    },
  );
}
