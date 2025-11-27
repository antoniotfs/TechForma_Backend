const express = require('express');

module.exports = (prisma) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const items = await prisma.programa.findMany();
    res.json(items);
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const item = await prisma.programa.findUnique({ where: { id }});
    if (!item) return res.status(404).json({ error: 'Programa not found' });
    res.json(item);
  });

  router.post('/', async (req, res) => {
    try {
      const payload = req.body;
      // expects periodoInicio and periodoFim as ISO strings
      const created = await prisma.programa.create({ data: payload });
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const updated = await prisma.programa.update({ where: { id }, data });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await prisma.programa.delete({ where: { id }});
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
