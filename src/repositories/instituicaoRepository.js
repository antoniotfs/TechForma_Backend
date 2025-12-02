module.exports = (prisma) => {
  return {
    findAll: () =>
      prisma.instituicao.findMany({
        include: { programas: true },
      }),

    findById: (id) =>
      prisma.instituicao.findUnique({
        where: { id },
        include: { programas: true },
      }),

    create: (data) => prisma.instituicao.create({ data }),

    update: (id, data) =>
      prisma.instituicao.update({
        where: { id },
        data,
      }),

    delete: (id) =>
      prisma.instituicao.delete({
        where: { id },
      }),
  };
};


