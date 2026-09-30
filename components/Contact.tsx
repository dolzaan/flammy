'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import StarBorder from './StarBorder';
import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react';

type Field = 'name' | 'email' | 'service' | 'message' | 'consent';
type Errors = Partial<Record<Field, string>>;
const serviceHints: Record<string, string> = { 'Estratégia': 'Vamos trazer clareza para o próximo movimento da sua marca.', 'Conteúdo': 'Vamos transformar essência em comunicação.', 'Social Media': 'Vamos construir uma presença digital consistente.', 'Design': 'Vamos dar forma à percepção da sua marca.', 'Projetos especiais': 'Vamos criar um caminho próprio para esta ideia.' };
const fields: Field[] = ['name', 'email', 'service', 'message', 'consent'];

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get('name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const message = String(data.get('message') ?? '').trim();
  if (name.length < 2) errors.name = 'Como podemos chamar você? Digite pelo menos 2 caracteres.';
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Digite um e-mail válido, como voce@empresa.com.';
  if (!['Estratégia', 'Conteúdo', 'Social Media', 'Design', 'Projetos especiais'].includes(String(data.get('service')))) errors.service = 'Escolha o ponto de partida que você tem em mente.';
  if (message.length < 10) errors.message = 'Conte um pouco mais sobre sua ideia: pelo menos 10 caracteres.';
  if (data.get('consent') !== 'on') errors.consent = 'Precisamos da sua autorização para responder ao projeto.';
  return errors;
}

export default function Contact({ enabled, briefing }: { enabled: boolean; briefing: string }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef(false);
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    if (state === 'success') successRef.current?.focus();
    else if (state === 'idle' && returnFocus.current) {
      formRef.current?.querySelector<HTMLInputElement>('[name="name"]')?.focus();
      returnFocus.current = false;
    }
  }, [state]);

  useEffect(() => {
    const openContact = (event: Event) => {
      const service = (event as CustomEvent<{ service?: string }>).detail?.service;
      if (service && Object.hasOwn(serviceHints, service)) {
        setSelectedService(service);
        setErrors(current => ({ ...current, service: undefined }));
      }
      if (state === 'success') { returnFocus.current = true; setState('idle'); }
      else requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('[name="name"]')?.focus({ preventScroll: true }));
    };
    window.addEventListener('flammy:contact', openContact);
    return () => window.removeEventListener('flammy:contact', openContact);
  }, [state]);

  function checkField(field: Field) {
    if (!formRef.current) return;
    const error = validate(new FormData(formRef.current))[field];
    setErrors(current => ({ ...current, [field]: error }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data);
    setErrors(nextErrors);
    const firstInvalid = fields.find(field => nextErrors[field]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setState('sending');
    setMessage('');
    data.set('name', String(data.get('name')).trim());
    data.set('email', String(data.get('email')).trim());
    data.set('message', String(data.get('message')).trim());
    try {
      const response = await fetch('/api/briefing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)), signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não conseguimos enviar agora.');
      form.reset();
      setSelectedService('');
      setState('success');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error && error.name !== 'TimeoutError' ? error.message : 'O envio demorou mais do que o esperado. Tente novamente ou fale com a gente por e-mail.');
    }
  }

  const errorFor = (field: Field) => errors[field] ? <span id={`${id}-${field}-error`} className="field-error" aria-live="polite">{errors[field]}</span> : null;
  const attributesFor = (field: Field) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${id}-${field}-error` : undefined,
    onBlur: () => checkField(field),
    onChange: () => { if (errors[field]) checkField(field); },
  });

  if (!enabled) return <div className="contact-note"><span className="note-star" aria-hidden="true">✦</span><h3>Estratégia que<br />começa escutando.</h3><p>Antes de criar, a gente quer entender quem você é. Conte sobre a sua marca, seus objetivos e aonde quer chegar.</p><a href={briefing} target="_blank" rel="noopener noreferrer">Preencher briefing <ArrowUpRight size={17} aria-hidden="true" /></a><span className="note-caption">CLAREZA PARA CONSTRUIR ALGO RELEVANTE.</span></div>;

  if (state === 'success') return <div className="contact-success">
    <span className="success-icon" aria-hidden="true"><Check size={30} /></span>
    <h3 ref={successRef} tabIndex={-1}>Recebemos sua mensagem.</h3>
    <p role="status">Obrigada por compartilhar o que você está construindo. A Flammy vai responder pelo e-mail informado.</p>
    <button type="button" className="button light" onClick={() => { returnFocus.current = true; setErrors({}); setSelectedService(''); setState('idle'); }}>Enviar outra ideia <ArrowUpRight size={18} className="button-arrow" aria-hidden="true" /></button>
  </div>;

  return <form ref={formRef} onSubmit={submit} className="contact-form" noValidate aria-busy={state === 'sending'}>
    <h3>Conte sua ideia</h3>
    <p className="form-intro">A conversa começa pela sua essência, seus objetivos e o que precisa ganhar direção.</p><p className="required-note">* Campos obrigatórios</p>
    <fieldset disabled={state === 'sending'}>
      <div className="form-field"><label htmlFor={`${id}-name`}>Seu nome <span aria-hidden="true">*</span></label><input id={`${id}-name`} name="name" placeholder="Como podemos chamar você?" autoComplete="name" required maxLength={120} {...attributesFor('name')} />{errorFor('name')}</div>
      <div className="form-field"><label htmlFor={`${id}-email`}>E-mail <span aria-hidden="true">*</span></label><input id={`${id}-email`} name="email" placeholder="voce@exemplo.com" type="email" autoComplete="email" required maxLength={254} {...attributesFor('email')} />{errorFor('email')}</div>
      <div className="form-field"><label htmlFor={`${id}-service`}>O que sua marca precisa? <span aria-hidden="true">*</span></label><select id={`${id}-service`} name="service" value={selectedService} required {...attributesFor('service')} aria-describedby={errors.service ? `${id}-service-error ${id}-service-hint` : `${id}-service-hint`} onChange={event => { setSelectedService(event.target.value); if (errors.service) checkField('service'); }}><option value="">Selecione um serviço</option><option>Estratégia</option><option>Conteúdo</option><option>Social Media</option><option>Design</option><option>Projetos especiais</option></select>{errorFor('service')}<span id={`${id}-service-hint`} className="service-hint" role="status">{serviceHints[selectedService] ?? 'Escolha uma frente para encontrarmos o melhor ponto de partida.'}</span></div>
      <div className="form-field"><label htmlFor={`${id}-message`}>Sobre o projeto <span aria-hidden="true">*</span></label><textarea id={`${id}-message`} name="message" placeholder="Conte sobre sua marca, seus objetivos e o que deseja construir" rows={3} required minLength={10} maxLength={3000} {...attributesFor('message')} />{errorFor('message')}</div>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="consent"><input type="checkbox" name="consent" required {...attributesFor('consent')} /> Autorizo a Flammy a usar estes dados para responder sobre meu projeto. <span aria-hidden="true">*</span></label>{errorFor('consent')}
    </fieldset>
    <StarBorder type="submit" className="button light form-submit" disabled={state === 'sending'}>{state === 'sending' ? <><LoaderCircle size={18} className="sending-icon" aria-hidden="true" /> Enviando sua ideia…</> : <>Enviar minha mensagem <ArrowUpRight size={18} className="button-arrow" aria-hidden="true" /></>}</StarBorder>
    <p role="status" aria-live="polite" className="form-status">{state === 'error' ? message : state === 'sending' ? 'Estamos enviando seu projeto.' : ''}</p>
    {state === 'error' ? <a className="form-fallback" href="mailto:flammystudiocriativo@gmail.com">Prefiro conversar por e-mail <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
  </form>;
}
