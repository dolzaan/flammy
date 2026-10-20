import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aviso de privacidade — Flammy',
  description: 'Como a Flammy trata os dados enviados pelo formulário de contato.',
  alternates: { canonical: '/privacidade' },
};

// Describes what app/api/briefing/route.ts actually does with each submission; keep both in sync.
export default function Privacidade() {
  return <main className="privacy-page">
    <header className="privacy-header">
      <a href="/" aria-label="Flammy, voltar ao site"><Image src="/flammy-logo-cream.svg" width={846} height={156} unoptimized alt="Flammy" /></a>
      <a href="/" className="privacy-back"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao site</a>
    </header>
    <article className="privacy-card">
      <div className="section-label">AVISO DE PRIVACIDADE</div>
      <h1>Seus dados, com <em>cuidado.</em></h1>
      <p className="privacy-intro">Este aviso explica o que acontece com as informações que você envia pelo formulário de contato da Flammy Studio Criativo.</p>

      <h2>O que coletamos</h2>
      <p>Quando você envia o formulário, recebemos o seu nome, o seu e-mail, o serviço escolhido e o que você contou sobre o projeto. Também registramos a data do envio e a sua autorização.</p>
      <p>Para evitar envios em massa, calculamos um código a partir do endereço IP do seu acesso. O endereço em si não é guardado, e o código é apagado em até dois dias.</p>

      <h2>Para que usamos</h2>
      <p>Usamos esses dados apenas para ler o seu pedido e responder por e-mail sobre o seu projeto. Não vendemos nem compartilhamos as suas informações para publicidade.</p>

      <h2>Onde os dados ficam</h2>
      <p>O pedido é guardado em um banco de dados no Supabase, com servidores em São Paulo. Uma cópia é enviada por e-mail para a equipe da Flammy pelo Formspree, um serviço de formulários. O site é hospedado na Vercel, que também mede visitas de forma agregada, sem cookies.</p>

      <h2>Seus direitos</h2>
      <p>Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir para ver, corrigir ou apagar os seus dados, ou retirar a autorização a qualquer momento. Basta escrever para <a href="mailto:flammystudiocriativo@gmail.com">flammystudiocriativo@gmail.com</a>.</p>

      <h2>Por quanto tempo</h2>
      <p>Guardamos o pedido enquanto ele for necessário para a conversa sobre o seu projeto. Depois disso, ou quando você pedir, os dados são apagados.</p>
    </article>
  </main>;
}
