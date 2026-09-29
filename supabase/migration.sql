-- Execute em um projeto Supabase dedicado à Flammy.
create table public.flammy_leads (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(name) between 2 and 120),
 email text not null check(length(email) <=254),
 service text not null check(service in ('Identidade visual','Design para o digital','Direção criativa')),
 message text not null check(length(message) between 10 and 3000),
 consent_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
create table public.flammy_submission_limits (hash text primary key, window_start timestamptz not null, attempts integer not null);
alter table public.flammy_leads enable row level security;
alter table public.flammy_submission_limits enable row level security;
revoke all on public.flammy_leads,public.flammy_submission_limits from anon,authenticated;
create function public.submit_flammy_lead(p_name text,p_email text,p_service text,p_message text,p_hash text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare n integer;
begin
 insert into flammy_submission_limits values(p_hash,now(),1)
 on conflict(hash) do update set
 attempts=case when flammy_submission_limits.window_start<now()-interval '1 hour' then 1 else flammy_submission_limits.attempts+1 end,
 window_start=case when flammy_submission_limits.window_start<now()-interval '1 hour' then now() else flammy_submission_limits.window_start end
 returning attempts into n;
 if n>5 then return false; end if;
 insert into flammy_leads(name,email,service,message) values(p_name,p_email,p_service,p_message);
 delete from flammy_submission_limits where window_start<now()-interval '2 days';
 return true;
end;$$;
revoke all on function public.submit_flammy_lead(text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_flammy_lead(text,text,text,text,text) to service_role;
