const express = require('express');

module.exports = (prisma) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const items = await prisma.instituicao.findMany({ include: { programas: true }});
    res.json(items);
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const item = await prisma.instituicao.findUnique({ where: { id } , include: { programas: true }});
    if (!item) return res.status(404).json({ error: 'Instituicao not found' });
    res.json(item);
  });

  router.post('/', async (req, res) => {
    try {
      const data = req.body;
      const created = await prisma.instituicao.create({ data });
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const updated = await prisma.instituicao.update({ where: { id }, data });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await prisma.instituicao.delete({ where: { id }});
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
