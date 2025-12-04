import { PrismaClient } from '@prisma/client';
import { ProgramaRepository } from '../types';

export default (prisma: PrismaClient): ProgramaRepository => {
  return {
    findAll: () => prisma.programa.findMany(),

    findById: (id: string) =>
      prisma.programa.findUnique({
        where: { id },
      }),

    create: (data) =>
      prisma.programa.create({
        data,
      }),

    update: (id: string, data) =>
      prisma.programa.update({
        where: { id },
        data,
      }),

    delete: (id: string) =>
      prisma.programa.delete({
        where: { id },
      }),
  };
};

