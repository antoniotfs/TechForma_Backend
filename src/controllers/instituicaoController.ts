import { InstituicaoController, InstituicaoService, ExpressRequest, ExpressResponse, ExpressNext } from '../types';

export default (instituicaoService: InstituicaoService): InstituicaoController => {
  return {
    listarTodas: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      try {
        console.log('[GET /instituicoes] Listando todas as instituições');
        const items = await instituicaoService.listarTodas();
        res.json(items);
      } catch (error) {
        next(error);
      }
    },

    buscarPorId: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      const { id } = req.params;
      try {
        console.log(`[GET /instituicoes/${id}] Buscando instituição por ID`);
        const item = await instituicaoService.buscarPorId(id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    criar: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      try {
        console.log('[POST /instituicoes] Criando nova instituição:', req.body);
        const data = req.body;
        const created = await instituicaoService.criar(data);
        console.log('[POST /instituicoes] Instituição criada com sucesso:', created.id);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    },

    atualizar: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      const { id } = req.params;
      try {
        console.log(`[PUT /instituicoes/${id}] Atualizando instituição:`, req.body);
        const data = req.body;
        const updated = await instituicaoService.atualizar(id, data);
        res.json(updated);
      } catch (error) {
        next(error);
      }
    },

    deletar: async (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
      const { id } = req.params;
      try {
        console.log(`[DELETE /instituicoes/${id}] Deletando instituição`);
        await instituicaoService.deletar(id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
};

