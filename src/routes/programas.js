const express = require('express');
const createProgramaRepository = require('../repositories/programaRepository');
const createProgramaService = require('../services/programaService');
const createProgramaController = require('../controllers/programaController');

module.exports = (prisma) => {
  const router = express.Router();

  const repository = createProgramaRepository(prisma);
  const service = createProgramaService(repository);
  const controller = createProgramaController(service);

  router.get('/', controller.listarTodos);

  router.get('/:id', controller.buscarPorId);

  router.post('/', controller.criar);

  router.put('/:id', controller.atualizar);

  router.delete('/:id', controller.deletar);

  return router;
};

