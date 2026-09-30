'use client';

import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import ContactLink from './ContactLink';

const services = [
  ['01', 'Identidade visual', 'Uma marca que faz sentido. E faz sentir.', 'Da essência ao sistema visual: logo, cores, tipografia e aplicações que contam a mesma história.'],
  ['02', 'Design para o digital', 'Sua presença merece personalidade.', 'Peças para redes sociais, campanhas e materiais digitais com uma linguagem que é só sua.'],
  ['03', 'Direção criativa', 'Boas ideias. Uma direção clara.', 'Conceito, referências e escolhas visuais que conectam a comunicação à essência do seu negócio.'],
];

function Service({ item }: { item: string[] }) {
  const [number, title, subtitle, description] = item;
  const [open, setOpen] = useState(number === '01');
  const id = useId();
  const reducedMotion = useReducedMotion();
  return <article className="service" data-open={open}>
    <button type="button" id={`${id}-toggle`} className="service-toggle" aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setOpen(current => !current)}>
      <span className="service-number">{number}</span><span className="service-title">{title}</span><span className="service-subtitle">{subtitle}</span><Plus className="plus" size={26} aria-hidden="true" />
    </button>
    <motion.div id={`${id}-body`} className="service-body" role="region" aria-labelledby={`${id}-toggle`} aria-hidden={!open} inert={!open} initial={false} animate={{ height: open ? 'auto' : 0 }} transition={{ duration: reducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}>
      <motion.div className="service-description" initial={false} animate={{opacity: open ? 1 : 0, y: open || reducedMotion ? 0 : -8}} transition={{duration: reducedMotion ? 0 : 0.22, ease: 'easeOut'}}><p>{description}</p><ContactLink service={title}>Quero isso para a minha marca <ArrowUpRight size={16} className="link-arrow" aria-hidden="true" /></ContactLink></motion.div>
    </motion.div>
  </article>;
}
export default function Services() {
  return <div className="service-list">{services.map(item => <Service key={item[0]} item={item} />)}</div>;
}
