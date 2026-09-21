# DHPlay — Gestão de assinaturas

Aplicativo web responsivo e instalável (PWA) para administrar clientes, planos, assinaturas e vencimentos.

## Recursos

- Painel com indicadores de clientes, receita recorrente e vencimentos
- Cadastro, edição e exclusão de clientes
- Cadastro de planos com valor e duração
- Assinaturas ligando cliente e plano, com situação automática
- Calendário mensal de vencimentos
- Mensagens personalizadas de renovação pelo WhatsApp (5 dias antes, no vencimento e 1 dia depois)
- Backup e restauração em JSON
- Funcionamento local/offline
- Login e sincronização remota com Supabase
- Fila offline durável em IndexedDB, com reenvio automático ao reconectar
- Instalação como aplicativo e verificação de versão
- Estrutura estática pronta para GitHub Pages
- Instalador de atalho para Windows, com abertura maximizada em modo aplicativo

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

## Instalar o atalho no Windows

Execute `INSTALAR-DHPLAY.bat`. O instalador cria o atalho **DHPlay** na Área de Trabalho e no Menu Iniciar, abrindo a versão publicada maximizada e sem as barras do navegador.

## Sequência de versões

A linha atual começa em `1.1.0`. Para preparar a próxima correção (`1.1.1`, depois `1.1.2` etc.), execute:

```powershell
.\atualizar-versao.ps1 -Notas "Resumo da atualização"
```

O script atualiza `version.json` e o cache do service worker em conjunto.

