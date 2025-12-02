module.exports = (prisma) => {
  return {
    findAll: () => prisma.programa.findMany(),

    findById: (id) =>
      prisma.programa.findUnique({
        where: { id },
      }),

    create: (data) =>
      prisma.programa.create({
        data,
      }),

    update: (id, data) =>
      prisma.programa.update({
        where: { id },
        data,
      }),

    delete: (id) =>
      prisma.programa.delete({
        where: { id },
      }),
  };
};


