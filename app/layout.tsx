import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata: Metadata = {
  title:'Flammy — Estratégia com alma',
  description:'Estratégia, criatividade e sensibilidade para marcas que querem construir algo relevante.',
  robots:{index:true,follow:true},
  icons:{
    icon:[{url:'/flammy-icon.svg',type:'image/svg+xml'},{url:'/flammy-icon-32.png',type:'image/png',sizes:'32x32'}],
    apple:{url:'/flammy-icon-180.png',sizes:'180x180'}
  },
  openGraph:{
    title:'Flammy — Estratégia com alma',
    description:'Transformamos potencial em posicionamento e presença em autoridade.',
    locale:'pt_BR',
    type:'website'
  }
};

export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="pt-BR"><body>{children}<Analytics/><SpeedInsights/></body></html>;
}
