/**
 * Script de startup para Railway
 * Aguarda o banco estar pronto, roda migrations e inicia a aplicação
 */
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const maxRetries = 30;
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
      console.log(`⏳ Waiting for database... (${i + 1}/${maxRetries})`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.error('❌ Database connection failed after maximum retries');
  await prisma.$disconnect();
  return false;
}

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

async function start() {
  const dbReady = await waitForDatabase();
  if (!dbReady) {
    process.exit(1);
  }

  const migrationsOk = await runMigrations();
  if (!migrationsOk) {
    process.exit(1);
  }

  console.log('✅ Starting application...');
  // Inicia a aplicação diretamente
  require('../src/app.js');
}

start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

