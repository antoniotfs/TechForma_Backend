import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Instituicao, Programa } from '@prisma/client';

// Express types
export type ExpressRequest = Request;
export type ExpressResponse = Response;
export type ExpressNext = NextFunction;

// Prisma types with relations
export type InstituicaoWithProgramas = Instituicao & {
  programas: Programa[];
};

export type ProgramaWithInstituicao = Programa & {
  instituicao: Instituicao;
};

// Repository interfaces
export interface InstituicaoRepository {
  findAll(): Promise<InstituicaoWithProgramas[]>;
  findById(id: string): Promise<InstituicaoWithProgramas | null>;
  create(data: Omit<Instituicao, 'programas'>): Promise<Instituicao>;
  update(id: string, data: Partial<Omit<Instituicao, 'id' | 'programas'>>): Promise<Instituicao>;
  delete(id: string): Promise<Instituicao>;
}

export interface ProgramaRepository {
  findAll(): Promise<Programa[]>;
  findById(id: string): Promise<Programa | null>;
  create(data: Omit<Programa, 'instituicao'>): Promise<Programa>;
  update(id: string, data: Partial<Omit<Programa, 'id' | 'instituicao'>>): Promise<Programa>;
  delete(id: string): Promise<Programa>;
}

// Service interfaces
export interface InstituicaoService {
  listarTodas(): Promise<InstituicaoWithProgramas[]>;
  buscarPorId(id: string): Promise<InstituicaoWithProgramas>;
  criar(data: Omit<Instituicao, 'programas'>): Promise<Instituicao>;
  atualizar(id: string, data: Partial<Omit<Instituicao, 'id' | 'programas'>>): Promise<Instituicao>;
  deletar(id: string): Promise<void>;
}

export interface ProgramaService {
  listarTodos(): Promise<Programa[]>;
  buscarPorId(id: string): Promise<Programa>;
  criar(data: Omit<Programa, 'instituicao'>): Promise<Programa>;
  atualizar(id: string, data: Partial<Omit<Programa, 'id' | 'instituicao'>>): Promise<Programa>;
  deletar(id: string): Promise<void>;
}

// Controller types
export interface InstituicaoController {
  listarTodas: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
  buscarPorId: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
  criar: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
  atualizar: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
  deletar: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
}

export interface ProgramaController {
  listarTodos: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
  buscarPorId: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
  criar: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
  atualizar: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
  deletar: (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => Promise<void>;
}

// Custom error type
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

