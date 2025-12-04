/**
 * Script para aguardar o banco de dados estar disponível antes de rodar migrations
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const maxRetries = 30;
const retryDelay = 2000; // 2 segundos

async function waitForDatabase(): Promise<boolean> {
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

waitForDatabase()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

