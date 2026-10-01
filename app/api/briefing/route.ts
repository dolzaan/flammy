import {NextRequest,NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
// Keep the deployed database's legacy categories compatible with current services.
// The chosen service is retained in the notification and, when space permits, the lead text.
const databaseServices: Record<string, string> = {
 'Estratégia':'Direção criativa',
 'Conteúdo':'Design para o digital',
 'Social Media':'Design para o digital',
 'Design':'Identidade visual',
 'Projetos especiais':'Direção criativa',
};
export async function POST(req:NextRequest){
 if(req.headers.get('origin')!==new URL(req.url).origin)return NextResponse.json({error:'Origem inválida.'},{status:403});
 if(Number(req.headers.get('content-length')||0)>12000)return NextResponse.json({error:'Mensagem muito longa.'},{status:413});
 const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_FLAMMY_SUPABASE_URL,key=process.env.FLAMMY_SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY,salt=process.env.LEAD_HASH_SALT;
 if(!url||!key||!salt)return NextResponse.json({error:'Use o e-mail ou o briefing para entrar em contato.'},{status:503});
 let b;try{const text=await req.text();if(text.length>12000)throw Error();b=JSON.parse(text)}catch{return NextResponse.json({error:'Dados inválidos.'},{status:400})}
 if(b.website)return NextResponse.json({error:'Não foi possível enviar.'},{status:400});
 if(typeof b.name!=='string'||b.name.trim().length<2||b.name.length>120||typeof b.email!=='string'||b.email.length>254||!/^\S+@\S+\.\S+$/.test(b.email)||typeof b.message!=='string'||b.message.trim().length<10||b.message.length>3000||(typeof b.service!=='string'||!Object.hasOwn(databaseServices,b.service))||b.consent!=='on')return NextResponse.json({error:'Confira os campos e a autorização de contato.'},{status:400});
 const servicePrefix = `Serviço escolhido: ${b.service}\n\n`;
 const storedMessage = servicePrefix.length + b.message.trim().length <= 3000 ? servicePrefix + b.message.trim() : b.message.trim();
 const ip=req.headers.get('x-vercel-forwarded-for')?.split(',')[0]||req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
 const hash=createHash('sha256').update(salt+ip).digest('hex');
 try{const response=await fetch(`${url}/rest/v1/rpc/submit_flammy_lead`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({p_name:b.name.trim(),p_email:b.email.trim().toLowerCase(),p_service:databaseServices[b.service],p_message:storedMessage,p_hash:hash}),signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error();const result=await response.json();if(!result)return NextResponse.json({error:'Você já enviou algumas mensagens. Tente novamente em uma hora.'},{status:429});
  try {
   const notification = await fetch('https://formspree.io/f/xrpbjodn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
     name: b.name.trim(),
     email: b.email.trim().toLowerCase(),
     service: b.service,
     message: b.message.trim(),
     _subject: `Novo contato Flammy — ${b.service}`,
    }),
    signal: AbortSignal.timeout(8000),
   });
   const notificationResult = await notification.json();
   if (!notification.ok || notificationResult.ok !== true) throw Error();
   return NextResponse.json({ok:true});
  } catch {
   return NextResponse.json({error:'Seu contato ficou salvo, mas a notificação por e-mail não pôde ser enviada. Para falar diretamente com a Flammy, use o link de e-mail abaixo.'},{status:502});
  }
 }catch{return NextResponse.json({error:'Não conseguimos enviar agora. Entre em contato por e-mail.'},{status:503})}
}
