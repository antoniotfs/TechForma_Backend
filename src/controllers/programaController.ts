import { ProgramaController, ProgramaService, ExpressRequest, ExpressResponse, ExpressNext } from '../types';

export default (programaService: ProgramaService): ProgramaController => {
  return {
    listarTodos: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      try {
        console.log('[GET /programas] Listando todos os programas');
        const items = await programaService.listarTodos();
        res.json(items);
      } catch (error) {
        next(error);
      }
    },

    buscarPorId: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      const { id } = req.params;
      try {
        console.log(`[GET /programas/${id}] Buscando programa por ID`);
        const item = await programaService.buscarPorId(id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    criar: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      try {
        console.log('[POST /programas] Criando novo programa:', req.body);
        const payload = req.body;
        const created = await programaService.criar(payload);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    },

    atualizar: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      const { id } = req.params;
      try {
        console.log(`[PUT /programas/${id}] Atualizando programa:`, req.body);
        const data = req.body;
        const updated = await programaService.atualizar(id, data);
        res.json(updated);
      } catch (error) {
        next(error);
      }
    },

    deletar: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      const { id } = req.params;
      try {
        console.log(`[DELETE /programas/${id}] Deletando programa`);
        await programaService.deletar(id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
};

