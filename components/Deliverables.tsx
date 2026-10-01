import SpotlightCard from './SpotlightCard';
import { Compass, MessageCircleMore, Palette } from 'lucide-react';

const deliverables = [
  {
    number: '01', title: 'Posicionamento', icon: Compass,
    description: 'Clareza para comunicar quem sua marca é, por que existe e aonde quer chegar.',
    items: ['Leitura de contexto e objetivos', 'Planejamento estratégico', 'Direcionamento de marca'],
  },
  {
    number: '02', title: 'Presença e conteúdo', icon: MessageCircleMore,
    description: 'Uma comunicação consistente, próxima e feita para construir conexão.',
    items: ['Estratégia editorial', 'Desenvolvimento de conteúdos', 'Social media e comunidade'],
  },
  {
    number: '03', title: 'Identidade e campanhas', icon: Palette,
    description: 'Soluções visuais e criativas que transformam intenção em percepção.',
    items: ['Identidade e peças visuais', 'Campanhas e lançamentos', 'Direção criativa'],
  },
];

export default function Deliverables() {
  return <section id="entregas" className="deliverables section" aria-labelledby="deliverables-title">
    <div className="panel-surface" aria-hidden="true" />
    <div className="panel-content">
      <div className="section-label">03 / COMO A ESTRATÉGIA GANHA FORMA</div>
      <div className="section-heading">
        <h2 id="deliverables-title">Da intenção<br />à <em>presença.</em></h2>
        <p>Estratégia, comunicação e design.<br />Cada entrega tem uma intenção.</p>
      </div>
      <div className="deliverable-grid">
        {deliverables.map(({ number, title, icon: Icon, description, items }) => <SpotlightCard key={number}>
          <div className="deliverable-top"><span className="deliverable-number">{number}</span><span className="deliverable-icon" aria-hidden="true"><Icon size={27} strokeWidth={1.4} /></span></div>
          <h3>{title}</h3>
          <p>{description}</p>
          <ul>{items.map(item => <li key={item}><span aria-hidden="true">—</span>{item}</li>)}</ul>
        </SpotlightCard>)}
      </div>
      <div className="deliverable-footer">
        <p>Entregas definidas na proposta, de acordo com o momento da sua marca.</p>
      </div>
    </div>
  </section>;
}

