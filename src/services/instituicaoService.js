module.exports = (instituicaoRepository) => {
  return {
    listarTodas: () => instituicaoRepository.findAll(),

    buscarPorId: async (id) => {
      const instituicao = await instituicaoRepository.findById(id);
      if (!instituicao) {
        const error = new Error('Instituição não encontrada');
        error.statusCode = 404;
        throw error;
      }
      return instituicao;
    },

    criar: (data) => instituicaoRepository.create(data),

    atualizar: (id, data) => instituicaoRepository.update(id, data),

    deletar: (id) => instituicaoRepository.delete(id),
  };
};


