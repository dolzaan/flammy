# Flammy — Studio Criativo

Landing page em português com Next.js 16, React 19, TypeScript, CSS responsivo e ícones Lucide. Logo original extraída da referência pública https://bio.site/flammystudio.

## Executar

```sh
npm ci
npm run dev
```

Para produção: `npm run build` e `npm start`. Para ver o formulário localmente, crie um `.env.local` com as variáveis do Supabase (veja abaixo); sem elas, a seção de contato mostra o link do briefing público.

## Publicar

O projeto `flammy` da Vercel está ligado ao repositório: cada push na `main` gera um deploy de produção automaticamente. Para publicar pela linha de comando:

```sh
npx vercel login
npx vercel link --yes --project flammy --scope paulo-cesar-dolzans-projects
npx vercel --prod
```

É um projeto independente. Não vincule ao Achei no Vale.

## Formulário de contato

Cada envio passa por `app/api/briefing/route.ts`, que verifica origem, valida campos, limita tamanho, usa honeypot e limita a cinco envios por hora com hash do IP. Depois:

1. **Salva no Supabase**, na tabela `flammy_leads`, pela função `submit_flammy_lead`, restrita à chave de serviço. O banco usa RLS e não permite acesso anônimo às tabelas.
2. **Envia um aviso por e-mail pelo Formspree** (formulário `xrpbjodn`), para o e-mail cadastrado nessa conta do Formspree.

O aviso por e-mail sai mesmo quando o banco não responde, para nenhum pedido se perder; nesse caso o assunto termina com "(não salvo no banco)". Enquanto o banco estiver fora, o limite de cinco envios por hora não é aplicado. A pessoa só vê erro se o banco e o e-mail falharem juntos.

O formulário aparece somente quando a URL do Supabase, a chave de serviço e `LEAD_HASH_SALT` existem. Sem elas, o site utiliza os contatos oficiais: briefing público, flammystudiocriativo@gmail.com e instagram.com/flammystudio. A página não inventa depoimentos, clientes ou projetos de portfólio. Os textos de serviços e processo são sugestões editoriais para revisão pela agência.

## Supabase

Projeto `sfohvokxjtibqshuvltq`, região São Paulo, plano gratuito, com `supabase/migration.sql` aplicado. Está conectado ao projeto da Vercel pela integração nativa, que administra as chaves: a aplicação lê `NEXT_PUBLIC_FLAMMY_SUPABASE_URL` e `FLAMMY_SUPABASE_SERVICE_ROLE_KEY` (ou `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`), e `LEAD_HASH_SALT` fica no servidor. Nunca envie esses segredos pelo chat nem use prefixo NEXT_PUBLIC na chave de serviço.

O plano gratuito pausa projetos sem atividade. Para evitar isso, `vercel.json` agenda um cron às segundas e quintas que chama `/api/keep-alive`, uma consulta leve ao banco. Se `CRON_SECRET` estiver definida na Vercel, a rota só responde a chamadas do cron.

Se o projeto for pausado mesmo assim, o formulário passa a depender só do e-mail e os deploys falham na etapa "Provisioning Integrations". Para resolver, abra o banco na Vercel (Storage › flammy › Open in Supabase), clique em **Restore project** e faça um redeploy.

## Ambiente publicado

Site: https://flammy.vercel.app/
Repositório privado: https://github.com/dolzaan/flammy
