/**
 * Seed script for populating the database.
 *
 * IMPORTANT:
 * - Place two JSON files into the `data/` folder:
 *   1) data/instituicoes.json
 *   2) data/programas.json
 *
 * You can copy your existing mocks from the workspace:
 * - /mnt/data/instituicoes.ts
 * - /mnt/data/programas.ts
 *
 * Convert them to JSON arrays named like above, or paste the JS arrays into JSON files.
 *
 * Example:
 * node scripts/seed.js
 *
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const base = path.resolve(__dirname, '..');
  const instPath = path.join(base, 'data', 'instituicoes.json');
  const progPath = path.join(base, 'data', 'programas.json');

  if (!fs.existsSync(instPath) || !fs.existsSync(progPath)) {
    console.error('Missing data files. Please copy the JSON exports of your mocks to:');
    console.error(instPath);
    console.error(progPath);
    console.error('\nYou can use the uploaded files from the workspace:');
    console.error(' - /mnt/data/instituicoes.ts');
    console.error(' - /mnt/data/programas.ts');
    process.exit(1);
  }

  const instData = JSON.parse(fs.readFileSync(instPath, 'utf-8'));
  const progData = JSON.parse(fs.readFileSync(progPath, 'utf-8'));

  console.log('Seeding institutions...');
  for (const i of instData) {
    await prisma.instituicao.upsert({
      where: { id: i.id },
      update: i,
      create: i
    });
  }

  console.log('Seeding programs...');
  for (const p of progData) {
    // convert periodo to periodoInicio and periodoFim ISO strings
    const periodoInicio = new Date(p.periodoInscricao.inicio).toISOString();
    const periodoFim = new Date(p.periodoInscricao.fim).toISOString();
    const payload = Object.assign({}, p, {
      periodoInicio,
      periodoFim,
      tags: p.tags || []
    });
    // remove periodoInscricao to match Prisma fields
    delete payload.periodoInscricao;
    await prisma.programa.upsert({
      where: { id: p.id },
      update: payload,
      create: payload
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
