# Poderosas Cripto

Portal de meme coins com tema das Meninas Superpoderas, hospedado no Vercel.

## Estrutura
- `public/`: Arquivos estáticos (frontend).
- `api/`: Funções serverless (backend).
- `vercel.json`: Configuração do Vercel.
- `package.json`: Dependências.

## Configuração
1. Crie um repositório no GitHub e faça upload dos arquivos.
2. Crie um cluster no MongoDB Atlas e obtenha a URL de conexão.
3. No Vercel:
   - Importe o repositório.
   - Configure variáveis de ambiente:
     - `MONGODB_URI`: URL do MongoDB Atlas.
     - `JWT_SECRET`: Chave para JWT (ex.: `JwtSecretPoderosas2025`).
     - `ADMIN_SECRET`: Chave para registro de admins (ex.: `PoderosasCripto2025!Secret`).
   - Faça deploy.
4. Crie os 10 administradores:
   - Use o endpoint `/api/setup-admins` com POST:
     ```json
     { "secret": "sua-chave-secreta" }
     ```
   - Ou registre manualmente via `/api/auth/register`.
5. Acesse o site em `https://seu-projeto.vercel.app` e o painel em `/admin`.

## Funcionalidades
- Tema rosa/escuro com adaptação claro/escuro.
- Carrossel de meme coins, notícias, e feed do X.
- Painel admin para gerenciar conteúdo.
- Link do Telegram: https://t.me/lancamentosMGJ.
