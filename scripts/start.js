/**
 * Script de startup para Railway
 * Aguarda o banco estar pronto, roda migrations e inicia a aplicação
 */
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

// Verifica se DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please configure DATABASE_URL in Railway project settings.');
  process.exit(1);
}

console.log('📋 DATABASE_URL configured:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

const maxRetries = 20; // Reduzido para 20 tentativas (40 segundos)
const retryDelay = 2000; // 2 segundos

async function waitForDatabase() {
  console.log('🔄 Waiting for database to be ready...');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database is ready!');
      await prisma.$disconnect();
      return true;
    } catch (error) {
      const attempt = i + 1;
      if (attempt % 5 === 0 || attempt === maxRetries) {
        console.log(`⏳ Waiting for database... (${attempt}/${maxRetries}) - ${error.message}`);
      }
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.error('❌ Database connection failed after maximum retries');
  console.error('Please check:');
  console.error('1. Database service is running in Railway');
  console.error('2. DATABASE_URL is correctly configured');
  console.error('3. Database credentials are correct');
  await prisma.$disconnect();
  return false;
}

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  try {
    // Tenta conectar primeiro para garantir que o banco está acessível
    const testPrisma = new PrismaClient();
    await testPrisma.$connect();
    await testPrisma.$disconnect();
    
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('✅ Migrations completed successfully!');
    return true;
  } catch (error) {
    // Se o erro for sobre migrations já aplicadas, continua
    if (error.message && error.message.includes('already applied')) {
      console.log('ℹ️  Migrations already applied, continuing...');
      return true;
    }
    console.error('❌ Migration failed:', error.message);
    console.log('⚠️  Attempting to continue - application may work if migrations are already applied');
    return true; // Continua mesmo se migration falhar
  }
}

async function start() {
  try {
    const dbReady = await waitForDatabase();
    if (!dbReady) {
      console.error('❌ Cannot proceed without database connection');
      process.exit(1);
    }

    await runMigrations();

    console.log('✅ Starting application...');
    // Inicia a aplicação diretamente
    require('../src/app.js');
  } catch (error) {
    console.error('❌ Fatal error during startup:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para shutdown graceful
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

start();

