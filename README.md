## Visão geral

Backend em **Node.js + Express + Prisma + PostgreSQL**, com documentação **OpenAPI/Swagger** e estrutura em camadas:

- **Routes** → recebem a requisição HTTP e delegam
- **Controllers** → orquestram a chamada de serviços e montam a resposta
- **Services** → concentram a regra de negócio
- **Repositories** → fazem o acesso ao banco via Prisma

As rotas e comportamentos principais da API são:

- `GET /instituicoes`, `POST /instituicoes`, `PUT /instituicoes/:id`, `DELETE /instituicoes/:id`
- `GET /programas`, `POST /programas`, `PUT /programas/:id`, `DELETE /programas/:id`
- `GET /` (health básico)
- `GET /health` (health com verificação de banco)

> Observação: a refatoração em camadas **não altera as URLs, métodos HTTP nem os status codes esperados**; apenas organiza o código internamente.

---

## Requisitos

- **Node.js** >= 18  
- **npm** >= 8  
- **PostgreSQL** (local, via Docker ou via Railway)

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com, no mínimo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/projeto_backend?schema=public"
PORT=3001
NODE_ENV=development
```

Se você usar o `docker-compose.yml` incluso, pode usar:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/projeto_backend?schema=public"
PORT=3001
NODE_ENV=development
```

---

## Como rodar o projeto localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir o PostgreSQL

- **Opção A – PostgreSQL já instalado na máquina**
  - Crie um banco (ex.: `projeto_backend`);
  - Ajuste a `DATABASE_URL` no `.env` apontando para esse banco.

- **Opção B – usando Docker Compose (recomendado)**

```bash
docker-compose up -d
```

Isso cria um PostgreSQL local com usuário `postgres`, senha `postgres` e banco `projeto_backend`.

### 3. Rodar comandos do Prisma

- **Gerar o client Prisma**

```bash
npx prisma generate
```

- **Criar/atualizar o schema com migrations (dev)**

```bash
npx prisma migrate dev --name init
```

- **Opcional: aplicar o schema sem criar migrations (ambientes efêmeros)**

```bash
npx prisma db push
```

### 4. Popular o banco (seed)

Os arquivos JSON já estão em `data/`:

- `data/instituicoes.json`
- `data/programas.json`

Execute:

```bash
node scripts/seed.js
```

### 5. Iniciar o servidor

Desenvolvimento (com reload, se configurado no `package.json`):

```bash
npm run dev
```

Produção/local simples:

```bash
npm start
# ou diretamente:
node src/app.js
```

### 6. Testar a API e o Swagger

- **API root**: `http://localhost:3001/`  
- **Health check**: `http://localhost:3001/health`  
- **Swagger UI**: `http://localhost:3001/docs`

A documentação é servida a partir do arquivo `openapi.json` na raiz do projeto, via `swagger-ui-express` configurado em `src/app.js`.

---

## Conexão com PostgreSQL

- **Localmente (sem Docker)**:
  - Ajuste a `DATABASE_URL` com host/porta/usuário/senha do seu PostgreSQL;
  - Exemplo:

    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/projeto_backend?schema=public"
    ```

- **Com Docker (`docker-compose.yml`)**:
  - O serviço `db` já expõe a porta 5432 e cria o banco `projeto_backend`;
  - Use a mesma `DATABASE_URL` do exemplo acima.

- **Em produção (Railway)**:
  - Ao adicionar um banco PostgreSQL no projeto, o Railway cria automaticamente a variável `DATABASE_URL`;
  - Basta garantir que o serviço Node use essa variável (o código já lê de `process.env.DATABASE_URL`).

---

## Scripts npm úteis

- `npm start` → inicia o servidor para produção (usa `node src/app.js` ou script equivalente)  
- `npm run dev` → inicia o servidor em modo desenvolvimento (nodemon, se configurado)  
- `node scripts/seed.js` → roda o seed e popula o banco com os JSON em `data/`  
- `npx prisma migrate dev --name <nome>` → cria/aplica migrations em desenvolvimento  
- `npx prisma db push` → aplica o schema diretamente no banco (sem migration)  
- `npx prisma generate` → (re)gera o client Prisma  
- `npx prisma studio` → abre uma interface web para visualizar/editar os dados

---

## Estrutura do projeto

```text
projeto-backend/
├── data/                    # Arquivos JSON para seed
│   ├── instituicoes.json
│   └── programas.json
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   └── migrations/          # Migrations do Prisma
├── scripts/
│   ├── seed.js              # Script para popular o banco
│   ├── start.js             # Script auxiliar para start em produção
│   └── wait-for-db.js       # Aguarda o banco subir (Docker/Railway)
├── src/
│   ├── app.js               # Aplicação Express (ponto de entrada)
│   ├── routes/              # Rotas HTTP
│   │   ├── instituicoes.js
│   │   └── programas.js
│   ├── controllers/         # Controllers (camada de orquestração)
│   │   ├── instituicaoController.js
│   │   └── programaController.js
│   ├── services/            # Camada de regra de negócio
│   │   ├── instituicaoService.js
│   │   └── programaService.js
│   └── repositories/        # Acesso ao banco via Prisma
│       ├── instituicaoRepository.js
│       └── programaRepository.js
├── openapi.json             # Especificação OpenAPI/Swagger
├── Dockerfile               # Build da imagem para produção (ex.: Railway)
├── docker-compose.yml       # Stack de desenvolvimento local (API + Postgres)
├── railway.json             # Configuração de deploy/migrations no Railway
└── package.json
```

---

## Deploy no Railway (resumo)

1. Faça commit do código e envie para um repositório Git remoto.
2. Crie um projeto no Railway e conecte ao repositório.
3. Adicione um banco PostgreSQL no projeto (o Railway criará a variável `DATABASE_URL`).
4. Confirme que o serviço Node está usando `DATABASE_URL` e `PORT` (o Railway define `PORT`; o código usa `process.env.PORT || 3001`).
5. O `Dockerfile` e o `railway.json` já estão preparados para rodar migrations antes de subir a app.
6. Após o primeiro deploy, rode o seed, se desejar:

```bash
railway run node scripts/seed.js
```