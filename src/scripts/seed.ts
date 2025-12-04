import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProgramaData {
  id: string;
  instituicaoId?: string;
  titulo?: string;
  area?: string;
  modalidade?: string;
  nivel?: string;
  publicoAlvo?: string;
  periodoInscricao?: {
    inicio: string | Date;
    fim: string | Date;
  };
  periodoInicio?: string;
  periodoFim?: string;
  cidade?: string;
  estado?: string;
  resumo?: string;
  descricaoCompleta?: string;
  tags?: string[];
  [key: string]: unknown;
}

async function main(): Promise<void> {
  const base = path.resolve(__dirname, '..');
  const instPath = path.join(base, 'data', 'instituicoes.json');
  const progPath = path.join(base, 'data', 'programas.json');

  if (!fs.existsSync(instPath) || !fs.existsSync(progPath)) {
    console.error('Missing data files.');
    process.exit(1);
  }

  const instData = JSON.parse(fs.readFileSync(instPath, 'utf-8'));
  const progData: ProgramaData[] = JSON.parse(fs.readFileSync(progPath, 'utf-8'));

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
    
    // Converte datas
    const periodoInicio = p.periodoInscricao
      ? new Date(p.periodoInscricao.inicio).toISOString()
      : p.periodoInicio || new Date().toISOString();

    const periodoFim = p.periodoInscricao
      ? new Date(p.periodoInscricao.fim).toISOString()
      : p.periodoFim || new Date().toISOString();

    // Construção COMPLETA do payload exigido pelo Prisma
    const payload = {
      id: p.id,
      instituicaoId: p.instituicaoId || instData[0]?.id || "1",

      titulo: p.titulo || "Título não informado",
      area: p.area || "Geral",
      modalidade: p.modalidade || "Presencial",
      nivel: p.nivel || "Livre",
      publicoAlvo: p.publicoAlvo || "Estudantes",

      periodoInicio,
      periodoFim,

      cidade: p.cidade || "Cidade não informada",
      estado: p.estado || "UF",

      resumo: p.resumo || "Resumo não informado",
      descricaoCompleta: p.descricaoCompleta || "Descrição não informada",

      tags: p.tags || [],
    };

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
