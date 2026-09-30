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
          <div className="panel-content">
            <div className="hero-heading"><h1>Estratégia<br/>com <em>alma.</em></h1></div>
            <div className="hero-bottom">
              <p>Estratégia, criatividade e sensibilidade para marcas que querem construir algo relevante.</p>
              <Magnet><ContactLink className="button">Vamos construir juntas <ArrowUpRight size={19} className="button-arrow" aria-hidden="true"/></ContactLink></Magnet>
            </div>
          </div>
        </section>

        <div className="ribbon brand-text-loop" aria-hidden="true">
          <TextLoop text="PRESENÇA ✦ CLAREZA ✦ ESSÊNCIA ✦ POSICIONAMENTO ✦ LEGADO ✦ CONEXÃO ✦ INTENÇÃO" shape="wave" curviness={14} speed={45} direction="reverse" fontSize={22} fontWeight={500} letterSpacing={1.8} color="#f4bad1" ribbonColor="#930c17" ribbonWidth={60}/>
        </div>

        <section id="studio" className="studio section">
          <div className="panel-surface" aria-hidden="true"/>
          <div className="panel-content">
            <div className="section-label">01 / QUEM É A FLAMMY</div>
            <div className="studio-content">
              <h2>Entre estratégia<br/>e <em>humanidade.</em></h2>
              <div className="studio-copy">
                <p>A Flammy nasceu da união entre estratégia, criatividade e sensibilidade.</p>
                <p>Somos parceiras de profissionais, empreendedoras, criadores e marcas que querem construir uma presença relevante, consistente e memorável.</p>
                <span className="text-tag">POTENCIAL EM POSICIONAMENTO. PRESENÇA EM AUTORIDADE.</span>
              </div>
            </div>
            <div className="values">
              <span><Plus size={18}/> Humanidade em cada decisão</span>
              <span><Plus size={18}/> Intenção antes da estética</span>
              <span><Plus size={18}/> Clareza para construir</span>
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
                <h2>Vamos construir<br/>algo <em>relevante?</em></h2>
                <p>Conte o que você está construindo.<br/>A gente começa entendendo quem você é.</p>
                <ContactLink className="button light">Quero conversar <ArrowUpRight size={19} className="button-arrow" aria-hidden="true"/></ContactLink>
                <a className="briefing-secondary" href={briefing} target="_blank" rel="noopener noreferrer">Prefere um briefing detalhado? <ArrowUpRight size={15} aria-hidden="true"/></a>
                <div className="contact-links">
                  <a href="mailto:flammystudiocriativo@gmail.com"><Mail size={18}/> E-mail</a>
                  <a href="https://instagram.com/flammystudio" target="_blank" rel="noopener noreferrer"><Camera size={18}/> @flammystudio</a>
                </div>
              </div>
              <Contact enabled={Boolean((process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_FLAMMY_SUPABASE_URL)&&(process.env.FLAMMY_SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY)&&process.env.LEAD_HASH_SALT)} briefing={briefing}/>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <a href="#inicio" className="footer-wordmark" aria-label="Flammy, voltar ao início"><Image src="/flammy-logo.svg" width={846} height={156} unoptimized alt="Flammy" sizes="(max-width: 600px) 240px, 320px"/></a>
        <div><span>Estratégia com alma.</span><span>© {new Date().getFullYear()} Flammy</span><a href="#inicio">Voltar ao início</a></div>
      </footer>
    </div>
  </>;
}
