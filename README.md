# Projeto Backend (scaffold gerado)

Este projeto é um *scaffold* para um backend **Express + Prisma + PostgreSQL** gerado com base nos mocks que você enviou.

## O que foi gerado
- Estrutura de pastas modular (routes, controllers, prisma)
- `prisma/schema.prisma` com modelos `Instituicao` e `Programa`
- Rotas REST:
  - GET/POST/PUT/DELETE `/instituicoes`
  - GET/POST/PUT/DELETE `/programas`
- Swagger UI exposto em `/docs` via `openapi.json`
- Script de seed `node scripts/seed.js` (necessita arquivos JSON em `data/`)

## Como usar (local)
1. Copie os arquivos de mocks enviados na sessão para a pasta `data/` em formato JSON:
   - **Origem (no workspace atual):**
     - /mnt/data/instituicoes.ts
     - /mnt/data/programas.ts
   - **Destino (neste projeto):**
     - projeto-backend/data/instituicoes.json
     - projeto-backend/data/programas.json

   > Observação: os arquivos enviados originalmente estão em TypeScript. Você pode:
   > - Abrir /mnt/data/instituicoes.ts e /mnt/data/programas.ts, copiar somente os arrays e salvar como JSON (remova o `export const ...` e os tipos).
   > - Ou executar uma pequena conversão para JSON.

2. Instale dependências:
```bash
npm install
```

3. Configure o banco criando um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/projeto_backend?schema=public"
PORT=3001
```

   **Ou use Docker Compose para subir o PostgreSQL automaticamente:**
   ```bash
   docker-compose up -d
   ```
   
   Isso criará um banco PostgreSQL local. Use esta URL no `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/projeto_backend?schema=public"
   ```

4. Gere client Prisma e rode migration:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Rode o seed:
```bash
node scripts/seed.js
```

6. Inicie a API:
```bash
npm run dev
# ou
npm start
```

7. Acesse:
- API root: http://localhost:3001/
- Swagger UI: http://localhost:3001/docs

## Deploy no Railway

### Pré-requisitos
- Conta no [Railway](https://railway.app)
- Git configurado
- Repositório GitHub/GitLab/Bitbucket (opcional, mas recomendado)

### Passo a passo

1. **Faça commit e push do código para o Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <seu-repositorio-url>
   git push -u origin main
   ```

2. **Crie um novo projeto no Railway:**
   - Acesse [railway.app](https://railway.app)
   - Clique em "New Project"
   - Escolha "Deploy from GitHub repo" (ou faça upload manual)

3. **Adicione o banco de dados PostgreSQL:**
   - No projeto do Railway, clique em "New" → "Database" → "Add PostgreSQL"
   - O Railway criará automaticamente uma variável `DATABASE_URL` no ambiente

4. **Configure as variáveis de ambiente:**
   - No serviço da aplicação, vá em "Variables"
   - Verifique se `DATABASE_URL` está configurada (geralmente já vem do PostgreSQL)
   - Adicione `PORT` se necessário (o Railway define automaticamente, mas pode usar 3001 como fallback)

5. **Configure o serviço:**
   - O Railway detectará automaticamente o Dockerfile
   - O `railway.json` já está configurado para rodar migrations antes de iniciar
   - O deploy iniciará automaticamente

6. **Execute o seed (opcional):**
   - Após o primeiro deploy, você pode executar o seed via Railway CLI ou conectando diretamente:
   ```bash
   # Via Railway CLI
   railway run npm run seed
   ```

7. **Acesse a aplicação:**
   - O Railway gerará uma URL pública automaticamente
   - Exemplo: `https://seu-projeto.up.railway.app`
   - Swagger UI estará disponível em: `https://seu-projeto.up.railway.app/docs`

### Notas importantes
- As migrations são executadas automaticamente durante o deploy (via `railway.json`)
- O Railway detecta mudanças no Git e faz redeploy automático
- A variável `DATABASE_URL` é injetada automaticamente quando você adiciona o PostgreSQL
- O `PORT` é definido automaticamente pelo Railway, mas o código tem fallback para 3001

## Estrutura do Projeto

```
projeto-backend/
├── data/                 # Arquivos JSON para seed
│   ├── instituicoes.json
│   └── programas.json
├── prisma/
│   ├── schema.prisma    # Schema do banco de dados
│   └── migrations/      # Migrations do Prisma
├── scripts/
│   └── seed.js         # Script para popular o banco
├── src/
│   ├── app.js          # Aplicação Express
│   └── routes/         # Rotas da API
├── Dockerfile          # Para deploy no Railway
├── railway.json        # Configuração do Railway
├── docker-compose.yml  # Para desenvolvimento local
└── package.json
```
