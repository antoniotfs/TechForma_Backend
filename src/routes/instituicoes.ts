import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import createInstituicaoRepository from '../repositories/instituicaoRepository';
import createInstituicaoService from '../services/instituicaoService';
import createInstituicaoController from '../controllers/instituicaoController';

export default (prisma: PrismaClient): Router => {
  const router = express.Router();

  const repository = createInstituicaoRepository(prisma);
  const service = createInstituicaoService(repository);
  const controller = createInstituicaoController(service);

  // GET todas as instituições - deve vir antes das rotas com parâmetros
  router.get('/', controller.listarTodas);

  // POST criar instituição - deve vir antes das rotas com parâmetros
  router.post('/', controller.criar);

  // GET instituição por ID - rota com parâmetro deve vir depois
  router.get('/:id', controller.buscarPorId);

  router.put('/:id', controller.atualizar);

  router.delete('/:id', controller.deletar);

  return router;
};

