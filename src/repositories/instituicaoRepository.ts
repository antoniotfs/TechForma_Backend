import { PrismaClient } from '@prisma/client';
import { InstituicaoRepository, InstituicaoWithProgramas } from '../types';

export default (prisma: PrismaClient): InstituicaoRepository => {
  return {
    findAll: () =>
      prisma.instituicao.findMany({
        include: { programas: true },
      }) as Promise<InstituicaoWithProgramas[]>,

    findById: (id: string) =>
      prisma.instituicao.findUnique({
        where: { id },
        include: { programas: true },
      }) as Promise<InstituicaoWithProgramas | null>,

    create: (data) => prisma.instituicao.create({ data }),

    update: (id: string, data) =>
      prisma.instituicao.update({
        where: { id },
        data,
      }),

    delete: (id: string) =>
      prisma.instituicao.delete({
        where: { id },
      }),
  };
};

