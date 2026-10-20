-- Aceita os serviços atuais do site na coluna service.
-- As categorias antigas continuam válidas para os contatos enviados antes desta mudança.
alter table public.flammy_leads drop constraint if exists flammy_leads_service_check;
alter table public.flammy_leads add constraint flammy_leads_service_check check(service in (
 'Estratégia','Conteúdo','Social Media','Design','Projetos especiais','Vamos descobrir juntos',
 'Identidade visual','Design para o digital','Direção criativa'
));
-- Contatos que guardaram o serviço escolhido no início da mensagem passam a tê-lo na coluna.
update public.flammy_leads
 set service=substring(message from '^Serviço escolhido: ([^\n]+)')
 where message like 'Serviço escolhido:%'
 and substring(message from '^Serviço escolhido: ([^\n]+)') in ('Estratégia','Conteúdo','Social Media','Design','Projetos especiais','Vamos descobrir juntos');
