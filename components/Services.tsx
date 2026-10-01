'use client';

import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import ContactLink from './ContactLink';

const services = [
  ['01', 'Estratégia', 'Clareza antes de qualquer movimento.', 'Planejamento, posicionamento e direcionamento estratégico para sua marca crescer sem abrir mão da essência.'],
  ['02', 'Conteúdo', 'Comunicação com intenção.', 'Estratégia editorial e desenvolvimento de conteúdos que traduzem quem sua marca é e por que ela existe.'],
  ['03', 'Social Media', 'Presença que cria conexão.', 'Gestão da presença digital e construção de comunidade com consistência, proximidade e direção.'],
  ['04', 'Design', 'Forma, função e personalidade.', 'Identidade, peças e soluções visuais para uma comunicação coerente e memorável.'],
  ['05', 'Projetos especiais', 'Ideias importantes pedem caminhos próprios.', 'Campanhas, lançamentos e projetos personalizados construídos para os objetivos da sua marca.'],
];

function Service({ item, open, onToggle }: { item: string[]; open: boolean; onToggle: () => void }) {
  const [number, title, subtitle, description] = item;
  const id = useId();
  const reducedMotion = useReducedMotion();

  return <article className="service" data-open={open}>
    <button type="button" id={`${id}-toggle`} className="service-toggle" aria-expanded={open} aria-controls={`${id}-body`} onClick={onToggle}>
      <span className="service-number">{number}</span>
      <span className="service-title">{title}</span>
      <span className="service-subtitle">{subtitle}</span>
      <Plus className="plus" size={26} aria-hidden="true" />
    </button>
    <motion.div id={`${id}-body`} className="service-body" role="region" aria-labelledby={`${id}-toggle`} aria-hidden={!open} inert={!open} initial={false} animate={{ height: open ? 'auto' : 0 }} transition={{ duration: reducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}>
      <motion.div className="service-description" initial={false} animate={{opacity: open ? 1 : 0, y: open || reducedMotion ? 0 : -8}} transition={{duration: reducedMotion ? 0 : 0.22, ease: 'easeOut'}}>
        <p>{description}</p>
        <ContactLink service={title}>Conversar sobre {title} <ArrowUpRight size={16} className="link-arrow" aria-hidden="true" /></ContactLink>
      </motion.div>
    </motion.div>
  </article>;
}

export default function Services() {
  const [active, setActive] = useState<string | null>('01');
  return <div className="service-list">{services.map(item => <Service key={item[0]} item={item} open={active === item[0]} onToggle={() => setActive(current => current === item[0] ? null : item[0])} />)}</div>;
}

