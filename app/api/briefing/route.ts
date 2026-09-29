import {NextRequest,NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
export async function POST(req:NextRequest){
 if(req.headers.get('origin')!==new URL(req.url).origin)return NextResponse.json({error:'Origem inválida.'},{status:403});
 if(Number(req.headers.get('content-length')||0)>12000)return NextResponse.json({error:'Mensagem muito longa.'},{status:413});
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY,salt=process.env.LEAD_HASH_SALT;
 if(!url||!key||!salt)return NextResponse.json({error:'Use o e-mail ou o briefing para entrar em contato.'},{status:503});
 let b;try{const text=await req.text();if(text.length>12000)throw Error();b=JSON.parse(text)}catch{return NextResponse.json({error:'Dados inválidos.'},{status:400})}
 if(b.website)return NextResponse.json({error:'Não foi possível enviar.'},{status:400});
 if(typeof b.name!=='string'||b.name.trim().length<2||b.name.length>120||typeof b.email!=='string'||b.email.length>254||!/^\S+@\S+\.\S+$/.test(b.email)||typeof b.message!=='string'||b.message.trim().length<10||b.message.length>3000||!['Identidade visual','Design para o digital','Direção criativa'].includes(b.service)||b.consent!=='on')return NextResponse.json({error:'Confira os campos e a autorização de contato.'},{status:400});
 const ip=req.headers.get('x-vercel-forwarded-for')?.split(',')[0]||req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
 const hash=createHash('sha256').update(salt+ip).digest('hex');
 try{const response=await fetch(`${url}/rest/v1/rpc/submit_flammy_lead`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({p_name:b.name.trim(),p_email:b.email.trim().toLowerCase(),p_service:b.service,p_message:b.message.trim(),p_hash:hash}),signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error();const result=await response.json();if(!result)return NextResponse.json({error:'Você já enviou algumas mensagens. Tente novamente em uma hora.'},{status:429});return NextResponse.json({ok:true})}catch{return NextResponse.json({error:'Não conseguimos enviar agora. Entre em contato por e-mail.'},{status:503})}
}
