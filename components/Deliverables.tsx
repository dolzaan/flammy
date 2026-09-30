import SpotlightCard from './SpotlightCard';
import { ArrowUpRight, Compass, Layers, Palette } from 'lucide-react';

const deliverables = [
  {
    number: '01', title: 'Identidade visual', icon: Palette,
    description: 'Um sistema visual para reconhecer sua marca em cada detalhe.',
    items: ['Logo e suas variações', 'Paleta de cores', 'Seleção de tipografias', 'Aplicações e guia de uso'],
  },
  {
    number: '02', title: 'Design para o digital', icon: Layers,
    description: 'Uma linguagem consistente para sua marca ocupar o digital.',
    items: ['Peças para redes sociais', 'Layouts para campanhas', 'Templates, quando previstos', 'Arquivos nos formatos combinados'],
  },
  {
    number: '03', title: 'Direção criativa', icon: Compass,
    description: 'Uma direção visual que conecta as ideias à essência do negócio.',
    items: ['Conceito criativo', 'Painel de referências', 'Diretrizes visuais', 'Orientação para aplicações'],
  },
];

export default function Deliverables() {
  return <section id="entregas" className="deliverables section" aria-labelledby="deliverables-title">
    <div className="panel-surface" aria-hidden="true" />
    <div className="panel-content">
      <div className="section-label">03 / O QUE VOCÊ RECEBE</div>
      <div className="section-heading">
        <h2 id="deliverables-title">Da ideia ao que<br />você pode <em>usar.</em></h2>
        <p>Veja exemplos de entregas para cada serviço.<br />Tudo pensado para fazer sua marca acontecer.</p>
      </div>
      <div className="deliverable-grid">
        {deliverables.map(({ number, title, icon: Icon, description, items }) => <SpotlightCard key={number}>
          <div className="deliverable-top"><span className="deliverable-number">{number}</span><span className="deliverable-icon" aria-hidden="true"><Icon size={27} strokeWidth={1.4} /></span></div>
          <h3>{title}</h3>
          <p>{description}</p>
          <span className="deliverable-caption">PODE INCLUIR</span>
          <ul>{items.map(item => <li key={item}><span aria-hidden="true">✦</span>{item}</li>)}</ul>
        </SpotlightCard>)}
      </div>
      <div className="deliverable-footer">
        <p>O projeto é feito para você. As entregas, quantidades e formatos são definidos na proposta, de acordo com o que sua marca precisa.</p>
        <a className="button" href="#contato">Vamos definir seu projeto <ArrowUpRight size={18} className="button-arrow" aria-hidden="true" /></a>
      </div>
    </div>
  </section>;
}
