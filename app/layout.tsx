import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
export const metadata: Metadata = {title:'Flammy — Studio Criativo',description:'Design com intenção. Identidade visual, presença digital e direção criativa para marcas que querem ser lembradas.',robots:{index:true,follow:true},icons:{icon:[{url:'/flammy-icon.svg',type:'image/svg+xml'},{url:'/flammy-icon-32.png',type:'image/png',sizes:'32x32'}],apple:{url:'/flammy-icon-180.png',sizes:'180x180'}},openGraph:{title:'Flammy — Studio Criativo',description:'A sua marca merece acender.',locale:'pt_BR',type:'website'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}<Analytics /></body></html>}
