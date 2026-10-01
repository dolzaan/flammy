import SpotlightCard from '../components/SpotlightCard';
import HeroCard from '../components/HeroCard';
import Magnet from '../components/Magnet';
import TextLoop from '../components/TextLoop';
import Image from 'next/image';
import { Camera, Mail, Sparkles, Plus, ArrowUpRight } from 'lucide-react';
import Contact from '../components/Contact';
import ContactLink from '../components/ContactLink';
import Deliverables from '../components/Deliverables';
import Motion from '../components/Motion';
import Services from '../components/Services';
import Header from '../components/Header';
import GlassSurface from '../components/GlassSurface';
import LineSidebar from '../components/LineSidebar';
import ReadingProgress from '../components/ReadingProgress';
import DarkVeil from '../components/DarkVeil';

const briefing='https://impartial-quesadilla-191.notion.site/3d18079a32dc80509f86f8195fdfce22?pvs=143';

export default function Page(){
  return <>
    <Motion/><ReadingProgress/>
    <a className="skip" href="#principal">Pular para o conteúdo</a>
    <div className="scroll-site">
      <DarkVeil/><Header/><LineSidebar/>
      <main id="principal">
        <section className="hero" id="inicio">
          <div className="panel-surface" aria-hidden="true"/>
          <HeroCard>
            <div className="hero-heading"><h1>Design que<br/>acende <em className="hero-word-reveal">marcas.</em></h1></div>
            <div className="hero-bottom">
              <p>Identidades com estratégia e personalidade.</p>
              <Magnet><ContactLink className="button">Vamos criar juntos <ArrowUpRight size={19} className="button-arrow" aria-hidden="true"/></ContactLink></Magnet>
            </div>
          </HeroCard>
          <a className="hero-scroll-cue" href="#studio" aria-label="Role para conhecer a Flammy"><svg width="20" height="52" viewBox="0 0 24 60" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v50m-7-7 7 7 7-7"/></svg></a>
        </section>

        <div className="ribbon brand-text-loop" aria-hidden="true">
          <TextLoop text="IDEIAS QUE ACENDEM ✦ MARCAS QUE CONECTAM ✦ DESIGN QUE FICA" shape="wave" curviness={14} speed={45} direction="reverse" fontSize={22} fontWeight={500} letterSpacing={1.8} color="#f4bad1" ribbonColor="#930c17" ribbonWidth={60}/>
        </div>

        <section id="studio" className="studio section">
          <div className="panel-surface" aria-hidden="true"/>
          <div className="panel-content">
            <div className="section-label">01 / QUEM É A FLAMMY</div>
            <div className="studio-content">
              <h2 className="studio-blur-text"><span>Entre estratégia</span><span>e <em>humanidade.</em></span></h2>
              <div className="studio-copy">
                <p>A Flammy nasceu da união entre estratégia, criatividade e sensibilidade.</p>
                <p>Somos parceiras de profissionais, empreendedoras, criadores e marcas que querem construir uma presença relevante, consistente e memorável.</p>
                <span className="text-tag">POTENCIAL EM POSICIONAMENTO. PRESENÇA EM AUTORIDADE.</span>
              </div>
            </div>
            <div className="values">
              <SpotlightCard className="value-spotlight"><span><Plus size={18} aria-hidden="true"/> Humanidade em cada decisão</span></SpotlightCard>
              <SpotlightCard className="value-spotlight"><span><Plus size={18} aria-hidden="true"/> Intenção antes da estética</span></SpotlightCard>
              <SpotlightCard className="value-spotlight"><span><Plus size={18} aria-hidden="true"/> Clareza para construir</span></SpotlightCard>
            </div>
          </div>
        </section>

        <section id="servicos" className="services section">
          <div className="panel-surface" aria-hidden="true"/>
          <div className="panel-content">
            <div className="section-label">02 / O QUE FAZEMOS</div>
            <div className="section-heading">
              <h2>Clareza para crescer<br/>sem perder a <em>essência.</em></h2>
              <p>Estratégia que respeita pessoas.<br/>Criatividade com direção.</p>
            </div>
            <Services/>
          </div>
        </section>

        <Deliverables/>

        <section className="manifesto">
          <div className="panel-surface" aria-hidden="true"/>
          <div className="panel-content">
            <span className="section-label">PESSOAS ANTES DE PERFIS.</span>
            <p>A gente não faz<br/>barulho por <em>fazer.</em><br/>Faz com <em>intenção.</em></p>
            <Sparkles aria-hidden="true" strokeWidth={1}/>
            <span className="manifesto-bottom">ESTRATÉGIA COM ALMA. MARCA COM LEGADO.</span>
          </div>
        </section>

        <section className="process section" id="processo">
          <div className="panel-surface" aria-hidden="true"/>
          <div className="panel-content">
            <div className="section-label">04 / COMO TRABALHAMOS</div>
            <div className="section-heading">
              <h2>Construção com método.<br/>Evolução com <em>presença.</em></h2>
              <p>A gente escuta antes de falar.<br/>E pensa antes de criar.</p>
            </div>
            <div className="steps">
              {[
                ['01','Entender','Mergulhamos no contexto, nos objetivos e na essência da marca antes de criar.'],
                ['02','Estruturar','Transformamos informações em estratégia, posicionamento e direcionamento.'],
                ['03','Criar','Desenvolvemos comunicação com intenção, criatividade e coerência.'],
                ['04','Acompanhar','Analisamos resultados, aprendemos com os dados e ajustamos a rota.'],
                ['05','Evoluir','Marcas relevantes são construídas continuamente.']
              ].map(([n,t,d])=><article key={n}><span className="step-number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}
            </div>
          </div>
        </section>

        <section className="contact section" id="contato">
          <div className="panel-surface" aria-hidden="true"/>
          <div className="panel-content">
            <div className="section-label">05 / VAMOS CONVERSAR</div>
            <div className="contact-grid">
              <div>
                <h2>Vamos construir<br/>{' '}algo <em>relevante?</em></h2>
                <div className="contact-links">
                  <a className="contact-direct" href="mailto:flammystudiocriativo@gmail.com"><Mail size={17} strokeWidth={1.6} aria-hidden="true"/><span>flammystudiocriativo@gmail.com</span></a>
                  <a className="contact-direct" href="https://www.instagram.com/flammystudio/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Flammy (abre em nova aba)"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg><span>@flammystudio</span><ArrowUpRight size={13} aria-hidden="true"/></a>
                </div>
              </div>
              <Contact enabled={Boolean((process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_FLAMMY_SUPABASE_URL)&&(process.env.FLAMMY_SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY)&&process.env.LEAD_HASH_SALT)} briefing={briefing}/>
            </div>

          </div>
        </section>
      </main>
      <footer className="site-footer">
        <GlassSurface className="footer-glass"/>
        <a href="#inicio" className="footer-wordmark" aria-label="Flammy, voltar ao início"><Image src="/flammy-logo.svg" width={846} height={156} unoptimized alt="Flammy" sizes="140px"/></a>
        <div><span>Estratégia com alma.</span><span>© {new Date().getFullYear()} Flammy</span><a href="#inicio">Voltar ao início</a></div>
      </footer>

    </div>
  </>;
}
