import { InstituicaoService, InstituicaoRepository, AppError } from '../types';

export default (instituicaoRepository: InstituicaoRepository): InstituicaoService => {
  return {
    listarTodas: () => instituicaoRepository.findAll(),

    buscarPorId: async (id: string) => {
      const instituicao = await instituicaoRepository.findById(id);
      if (!instituicao) {
        throw new AppError('Instituição não encontrada', 404);
      }
      return instituicao;
    },

    criar: (data) => instituicaoRepository.create(data),

    atualizar: (id: string, data) => instituicaoRepository.update(id, data),

    deletar: async (id: string) => {
      await instituicaoRepository.delete(id);
    },
  };
};

