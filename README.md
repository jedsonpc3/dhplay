# DHPlay — Gestão de assinaturas

Aplicativo web responsivo e instalável (PWA) para administrar clientes, planos, assinaturas e vencimentos.

## Recursos

- Painel com indicadores de clientes, receita recorrente e vencimentos
- Cadastro, edição e exclusão de clientes
- Cadastro de planos com valor e duração
- Assinaturas ligando cliente e plano, com situação automática
- Calendário mensal de vencimentos
- Backup e restauração em JSON
- Funcionamento local/offline
- Login e sincronização remota com Supabase
- Fila offline durável em IndexedDB, com reenvio automático ao reconectar
- Instalação como aplicativo e verificação de versão
- Estrutura estática pronta para GitHub Pages

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute `supabase-schema.sql`.
3. Em Authentication > Users, crie os usuários autorizados.
4. Copie a URL do projeto e a chave pública `anon`/`publishable` para `supabase-config.js`.
5. Nunca use a chave `service_role` no aplicativo.

## Publicar no GitHub Pages

Crie um repositório, envie estes arquivos para a branch principal e, em Settings > Pages, publique a partir da raiz dessa branch. O arquivo `.nojekyll` já está incluído.

## Testar localmente

Por segurança do navegador, abra com um servidor HTTP local (por exemplo, Live Server). O modo “Usar neste dispositivo” funciona sem Supabase; os dados ficam no navegador.

