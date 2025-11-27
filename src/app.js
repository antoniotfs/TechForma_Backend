const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const openapi = require('../openapi.json');

dotenv.config();

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

const app = express();

// Logging middleware para debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.path}`);
  console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

const instituicoesRouter = require('./routes/instituicoes');
const programasRouter = require('./routes/programas');

// Swagger UI - deve vir antes das rotas da API para evitar conflitos
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API - Programas e Instituições'
}));

// Rotas da API - devem vir depois do Swagger
app.use('/instituicoes', instituicoesRouter(prisma));
app.use('/programas', programasRouter(prisma));

app.get('/', (req, res) => res.send({ ok: true }));

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📚 Swagger UI available at http://localhost:${port}/docs`);
});
