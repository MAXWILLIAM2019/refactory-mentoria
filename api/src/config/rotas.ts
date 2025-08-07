/**
 * Configuração centralizada de rotas
 * 
 * Este arquivo organiza todas as rotas da API de forma modular
 * e escalável, seguindo o padrão de separation of concerns.
 * 
 * Rotas incluídas:
 * - Health Check (monitoramento)
 * - Autenticação (/auth/*)
 * - Alunos (/alunos/*)
 * - Futuras rotas de funcionalidades
 */

import express, { Request, Response } from 'express';
import autenticacaoRoutes from '../routes/autenticacaoRoutes';
import alunosRoutes from '../routes/alunosRoutes';
import { logger } from '../utils/logger';
import { CONFIG } from './configuracao';

/**
 * Configura rota de health check
 */
export const configurarRotaHealth = (app: express.Application): void => {
  const rotaHealth = `${CONFIG.api.prefixo}${CONFIG.api.endpoints.health}`;
  
  app.get(rotaHealth, (req: Request, res: Response) => {
    res.json({
      sucesso: true,
      mensagem: 'API do Sistema de Mentoria funcionando!',
      timestamp: new Date().toISOString(),
      versao: CONFIG.api.versao,
      ambiente: CONFIG.servidor.ambiente,
      porta: CONFIG.servidor.porta,
      uptime: process.uptime(),
      memoria: {
        usada: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        externa: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      node_version: process.version,
      pid: process.pid
    });
  });

  logger.server(`Rota health configurada: ${rotaHealth}`);
};

/**
 * Configura rotas de autenticação
 */
export const configurarRotasAutenticacao = (app: express.Application): void => {
  const rotaAuth = `${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}`;
  
  app.use(rotaAuth, autenticacaoRoutes);

  logger.server(`Rotas de autenticação configuradas: ${rotaAuth}/*`);
};

/**
 * Configura rotas de alunos
 */
export const configurarRotasAlunos = (app: express.Application): void => {
  const rotaAlunos = `${CONFIG.api.prefixo}/alunos`;
  
  app.use(rotaAlunos, alunosRoutes);

  logger.server(`Rotas de alunos configuradas: ${rotaAlunos}/*`);
};

/**
 * Configura rotas futuras do sistema
 */
export const configurarRotasFuturas = (app: express.Application): void => {
  // TODO: Implementar quando necessário
  // const rotaUsuarios = `${CONFIG.api.prefixo}${CONFIG.api.endpoints.usuarios}`;
  // const rotaPlanos = `${CONFIG.api.prefixo}${CONFIG.api.endpoints.planos}`;
  // const rotaSprints = `${CONFIG.api.prefixo}${CONFIG.api.endpoints.sprints}`;
  // const rotaMetas = `${CONFIG.api.prefixo}${CONFIG.api.endpoints.metas}`;

  logger.debug('Rotas futuras serão implementadas conforme necessário');
};

/**
 * Configura rota de informações da API
 */
export const configurarRotaInfo = (app: express.Application): void => {
  const rotaInfo = `${CONFIG.api.prefixo}/info`;
  
  app.get(rotaInfo, (req: Request, res: Response) => {
    res.json({
      sucesso: true,
      api: {
        nome: 'Sistema de Mentoria - API',
        versao: CONFIG.api.versao,
        ambiente: CONFIG.servidor.ambiente,
        descricao: 'API backend para sistema de mentoria educacional'
      },
      endpoints_principais: {
        health: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.health}`,
        info: `GET ${rotaInfo}`,
        auth: {
          base: `${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}`,
          login: `POST ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/login`,
          cadastrarUsuario: `POST ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/cadastrarUsuario`,
          me: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/me`,
          validate: `POST ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/validar`,
          test: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/teste`
        },
        alunos: {
          listar: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/alunos`,
          excluir: `DELETE ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/alunos/:id`,
          cadastrar: `POST ${CONFIG.api.prefixo}/alunos`
        }
      },
      configuracao: {
        cors_origem: CONFIG.cors.origem,
        timeout: CONFIG.api.timeout,
        rate_limit: CONFIG.seguranca.rateLimit
      },
      timestamp: new Date().toISOString()
    });
  });

  logger.server(`Rota de informações configurada: ${rotaInfo}`);
};

/**
 * Configura todas as rotas da aplicação
 */
export const configurarTodasRotas = (app: express.Application): void => {
  logger.server('Iniciando configuração de rotas...');

  // 1. Rota de health check (monitoramento)
  configurarRotaHealth(app);

  // 2. Rota de informações da API
  configurarRotaInfo(app);

  // 3. Rotas de autenticação
  configurarRotasAutenticacao(app);

  // 4. Rotas de alunos
  configurarRotasAlunos(app);

  // 5. Rotas futuras (placeholder)
  configurarRotasFuturas(app);

  logger.success('Todas as rotas configuradas com sucesso!');
  logger.info('Endpoints ativos:', {
    health: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.health}`,
    info: `GET ${CONFIG.api.prefixo}/info`,
    authTest: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/teste`,
    login: `POST ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/login`,
    cadastrarUsuario: `POST ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/cadastrarUsuario`,
    me: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/me`,
    validate: `POST ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/validar`,
    listarAlunos: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/alunos`,
    excluirAluno: `DELETE ${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/alunos/:id`,
    alunos: `POST ${CONFIG.api.prefixo}/alunos`
  });
}; 