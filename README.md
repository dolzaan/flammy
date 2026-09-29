# Flammy — Studio Criativo

Landing page em português com Next.js 16, React 19, TypeScript, CSS responsivo e ícones Lucide. Logo original extraída da referência pública https://bio.site/flammystudio.

## Executar

```sh
npm ci
npm run dev
```

Para produção: `npm run build` e `npm start`. O build e a validação TypeScript passaram nesta entrega. A inspeção visual em navegador não pôde ser concluída nesta sessão; a prévia HTML permite revisar a composição.

## Publicar na conta da Vercel

```sh
npx vercel login
npx vercel link --yes --project flammy --scope paulo-cesar-dolzans-projects
npx vercel --prod
```

Crie um projeto independente chamado Flammy. Não vincule ao Achei no Vale.

## Supabase

A integração está implementada, mas não foi conectada nem testada com um banco real.

1. Crie ou selecione um projeto Supabase dedicado à Flammy.
2. Execute `supabase/migration.sql` no SQL Editor.
3. Configure na Vercel `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `LEAD_HASH_SALT` (segredo aleatório, gerado com `openssl rand -hex 32`). Nunca envie esses segredos pelo chat nem use prefixo NEXT_PUBLIC na chave de serviço.
4. Faça um novo deploy. O formulário aparece somente quando as três variáveis existem.
5. Envie um briefing de teste e confira o registro na tabela `flammy_leads` pelo painel do Supabase.

O banco usa RLS, não permite acesso anônimo às tabelas e recebe os briefings por uma função restrita à chave de serviço no servidor. O endpoint verifica origem, valida campos, limita tamanho, usa honeypot e limita a cinco envios por hora com hash do IP. Não envia notificações por e-mail: os pedidos ficam no Supabase para consulta. Defina um processo de atendimento e retenção dos dados antes de ativar o formulário.

Sem as variáveis, o site utiliza os contatos oficiais: briefing público, flammystudiocriativo@gmail.com e instagram.com/flammystudio. A página não inventa depoimentos, clientes ou projetos de portfólio. Os textos de serviços e processo são sugestões editoriais para revisão pela agência.

## Arquivos de prévia

`flammy-preview.html` é uma versão estática independente para revisar o visual. Usa a logo embutida, CSS embutido e fontes do Google quando há internet; não substitui a aplicação Next.js.
