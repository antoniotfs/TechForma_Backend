import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import createProgramaRepository from '../repositories/programaRepository';
import createProgramaService from '../services/programaService';
import createProgramaController from '../controllers/programaController';

export default (prisma: PrismaClient): Router => {
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

