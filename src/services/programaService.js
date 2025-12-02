module.exports = (programaRepository) => {
  return {
    listarTodos: () => programaRepository.findAll(),

    buscarPorId: async (id) => {
      const programa = await programaRepository.findById(id);
      if (!programa) {
        const error = new Error('Programa não encontrado');
        error.statusCode = 404;
        throw error;
      }
      return programa;
    },

    criar: (data) => programaRepository.create(data),

    atualizar: (id, data) => programaRepository.update(id, data),

    deletar: (id) => programaRepository.delete(id),
  };
};


