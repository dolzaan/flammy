import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase:new URL('https://flammy.vercel.app'),
  title:'Flammy — Studio Criativo',
  description:'Estratégia, criatividade e sensibilidade para marcas que querem construir algo relevante.',
  robots:{index:true,follow:true},
  icons:{
    icon:[{url:'/flammy-icon.svg?v=2',type:'image/svg+xml',sizes:'any'},{url:'/brand-icon/32?v=2',type:'image/png',sizes:'32x32'},{url:'/brand-icon/192?v=2',type:'image/png',sizes:'192x192'},{url:'/brand-icon/512?v=2',type:'image/png',sizes:'512x512'}],
    apple:{url:'/brand-icon/180?v=2',sizes:'180x180'}
  },
  openGraph:{
    title:'Flammy — Studio Criativo',
    description:'Transformamos potencial em posicionamento e presença em autoridade.',
    locale:'pt_BR',
    type:'website',
    url:'/'
  },
  twitter:{card:'summary_large_image'}
};

export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="pt-BR"><body>{children}<Analytics/><SpeedInsights/></body></html>;
}
