import { ProgramaService, ProgramaRepository, AppError } from '../types';

export default (programaRepository: ProgramaRepository): ProgramaService => {
  return {
    listarTodos: () => programaRepository.findAll(),

    buscarPorId: async (id: string) => {
      const programa = await programaRepository.findById(id);
      if (!programa) {
        throw new AppError('Programa não encontrado', 404);
      }
      return programa;
    },

    criar: (data) => programaRepository.create(data),

    atualizar: (id: string, data) => programaRepository.update(id, data),

    deletar: async (id: string) => {
      await programaRepository.delete(id);
    },
  };
};

