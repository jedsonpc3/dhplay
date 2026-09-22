# DHGPlay — Gestão de assinaturas

Aplicativo web responsivo e instalável (PWA) para administrar clientes, planos, assinaturas e vencimentos.

## Recursos

- Painel com indicadores de clientes, receita recorrente e vencimentos
- Cadastro, edição e exclusão de clientes
- Clientes e seleções organizados automaticamente em ordem alfabética
- Cadastro de planos com valor e duração
- Assinaturas ligando cliente e plano, com situação automática
- Assinaturas com cadastro integral do início da vigência, vencimento e valor contratado
- Relatório gerencial com faturamento por início da vigência e filtros de período, plano e situação
- Receita recorrente mensalizada, com comparação à média histórica de entradas
- Cadastro de custos e despesas com opções sugeridas e descrição livre
- Fluxo de caixa mensal com faturamento, custos, resultado líquido e margem operacional
- Calendário mensal de vencimentos
- Mensagens personalizadas de renovação pelo WhatsApp (5 dias antes, no vencimento e 1 dia depois)
- QR Code e chave PIX compartilháveis por WhatsApp na edição e troca de plano
- Backup e restauração em JSON
- Operação em nuvem com suporte offline após a autenticação
- Login e sincronização remota com Supabase
- Fila offline durável em IndexedDB, com reenvio automático ao reconectar
- Instalação como aplicativo e verificação de versão
- Identidade visual DHG Play responsiva, com banner, ícones PWA e atalho Windows
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

Por segurança do navegador, abra com um servidor HTTP local (por exemplo, Live Server). O acesso ao painel exige autenticação pela nuvem.

## Instalar o atalho no Windows

Execute `INSTALAR-DHGPLAY.bat`. O instalador cria o atalho **DHGPlay** na Área de Trabalho e no Menu Iniciar, abrindo a versão publicada maximizada e sem as barras do navegador.

## Sequência de versões

A linha atual começa em `1.1.0`. Para preparar a próxima correção (`1.1.1`, depois `1.1.2` etc.), execute:

```powershell
.\atualizar-versao.ps1 -Notas "Resumo da atualização"
```

O script atualiza `version.json` e o cache do service worker em conjunto.

