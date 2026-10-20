import {NextRequest,NextResponse} from 'next/server';
import postgres from 'postgres';
// Called twice a week by Vercel Cron (vercel.json): a direct query keeps the free Supabase project from pausing.
// It goes straight to Postgres, so it does not depend on which tables the REST API exposes.
export async function GET(req:NextRequest){
 const secret=process.env.CRON_SECRET;
 if(secret&&req.headers.get('authorization')!==`Bearer ${secret}`)return NextResponse.json({error:'Não autorizado.'},{status:401});
 const url=process.env.FLAMMY_POSTGRES_URL_NON_POOLING||process.env.FLAMMY_POSTGRES_URL||process.env.POSTGRES_URL;
 if(!url)return NextResponse.json({error:'Banco não configurado.'},{status:503});
 const sql=postgres(url,{max:1,prepare:false,connect_timeout:10,idle_timeout:1});
 try{
  await sql`select 1`;
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'O banco não respondeu.'},{status:502})}
 finally{await sql.end({timeout:2})}
}
