import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import openapi from '../openapi.json';
import instituicoesRouter from './routes/instituicoes';
import programasRouter from './routes/programas';

dotenv.config();

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

const app = express();

// Logging middleware para debug
app.use((req: Request, res: Response, next) => {
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

// Swagger UI - deve vir antes das rotas da API para evitar conflitos
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi as unknown as swaggerUi.JsonObject, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API - Programas e Instituições'
}));

// Rotas da API - devem vir depois do Swagger
app.use('/instituicoes', instituicoesRouter(prisma));
app.use('/programas', programasRouter(prisma));

app.get('/', (req: Request, res: Response) => res.send({ ok: true }));

app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(503).json({ status: 'error', database: 'disconnected', error: errorMessage });
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

