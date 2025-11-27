const express = require('express');

module.exports = (prisma) => {
  const router = express.Router();

  // GET todas as instituições - deve vir antes das rotas com parâmetros
  router.get('/', async (req, res) => {
    console.log('[GET /instituicoes] Listando todas as instituições');
    const items = await prisma.instituicao.findMany({ include: { programas: true }});
    res.json(items);
  });

  // POST criar instituição - deve vir antes das rotas com parâmetros
  router.post('/', async (req, res) => {
    console.log('[POST /instituicoes] Criando nova instituição:', req.body);
    try {
      const data = req.body;
      const created = await prisma.instituicao.create({ data });
      console.log('[POST /instituicoes] Instituição criada com sucesso:', created.id);
      res.status(201).json(created);
    } catch (err) {
      console.error('[POST /instituicoes] Erro ao criar instituição:', err.message);
      res.status(400).json({ error: err.message });
    }
  });

  // GET instituição por ID - rota com parâmetro deve vir depois
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`[GET /instituicoes/${id}] Buscando instituição por ID`);
    const item = await prisma.instituicao.findUnique({ where: { id } , include: { programas: true }});
    if (!item) {
      console.log(`[GET /instituicoes/${id}] Instituição não encontrada`);
      return res.status(404).json({ error: 'Instituicao not found' });
    }
    res.json(item);
  });

  router.put('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`[PUT /instituicoes/${id}] Atualizando instituição:`, req.body);
    try {
      const data = req.body;
      const updated = await prisma.instituicao.update({ where: { id }, data });
      res.json(updated);
    } catch (err) {
      console.error(`[PUT /instituicoes/${id}] Erro ao atualizar:`, err.message);
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`[DELETE /instituicoes/${id}] Deletando instituição`);
    try {
      await prisma.instituicao.delete({ where: { id }});
      res.status(204).send();
    } catch (err) {
      console.error(`[DELETE /instituicoes/${id}] Erro ao deletar:`, err.message);
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
