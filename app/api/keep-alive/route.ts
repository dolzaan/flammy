import {NextRequest,NextResponse} from 'next/server';
// Called weekly by Vercel Cron (vercel.json): a light query keeps the free Supabase project from pausing.
export async function GET(req:NextRequest){
 const secret=process.env.CRON_SECRET;
 if(secret&&req.headers.get('authorization')!==`Bearer ${secret}`)return NextResponse.json({error:'Não autorizado.'},{status:401});
 const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_FLAMMY_SUPABASE_URL,key=process.env.FLAMMY_SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return NextResponse.json({error:'Banco não configurado.'},{status:503});
 try{
  const response=await fetch(`${url}/rest/v1/flammy_leads?select=id&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`},cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error();
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'O banco não respondeu.'},{status:502})}
}
