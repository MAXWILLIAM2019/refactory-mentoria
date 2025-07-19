/**
 * Configuração centralizada de middlewares
 * 
 * Este arquivo organiza todos os middlewares do Express em funções
 * reutilizáveis, seguindo o princípio Single Responsibility.
 * 
 * Middlewares incluídos:
 * - Segurança (Helmet)
 * - CORS
 * - Parsing de JSON/URL
 * - Logging de requisições
 * - Tratamento de erros
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from '../utils/logger';
import { CONFIG } from './configuracao';

/**
 * Configura middlewares de segurança e parsing
 */
export const configurarMiddlewaresBase = (app: express.Application): void => {
  // Middleware de segurança HTTP
  app.use(helmet(CONFIG.seguranca.helmet));

  // Configuração CORS
  app.use(cors({
    origin: CONFIG.cors.origem,
    credentials: CONFIG.cors.credenciais,
    methods: CONFIG.cors.metodosPermitidos,
    allowedHeaders: CONFIG.cors.cabecalhosPermitidos
  }));

  // Parsing de JSON e URL-encoded
  app.use(express.json({ limit: CONFIG.seguranca.requestSize.jsonLimit }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: CONFIG.seguranca.requestSize.urlEncodedLimit 
  }));

  logger.server('Middlewares base configurados');
};

/**
 * Configura middleware de logging de requisições
 */
export const configurarMiddlewareLogging = (app: express.Application): void => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.middleware(`${req.method} ${req.originalUrl}`);
    next();
  });

  logger.server('Middleware de logging configurado');
};

/**
 * Configura middleware para rotas não encontradas (404)
 */
export const configurarMiddleware404 = (app: express.Application): void => {
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      sucesso: false,
      mensagem: `Rota ${req.originalUrl} não encontrada`,
      endpoint_disponivel: `${CONFIG.api.prefixo}${CONFIG.api.endpoints.health}`,
      endpoints_disponiveis: {
        health: `GET ${CONFIG.api.prefixo}${CONFIG.api.endpoints.health}`,
        auth: `${CONFIG.api.prefixo}${CONFIG.api.endpoints.auth}/*`
      }
    });
  });

  logger.server('Middleware 404 configurado');
};

/**
 * Configura middleware global de tratamento de erros
 */
export const configurarMiddlewareErros = (app: express.Application): void => {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Erro não tratado:', err);
    
    // Log adicional em desenvolvimento
    if (CONFIG.servidor.ehDesenvolvimento) {
      logger.debug('Stack trace completo:', err.stack);
    }

    res.status(err.status || 500).json({
      sucesso: false,
      mensagem: err.message || 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      ...(CONFIG.servidor.ehDesenvolvimento && { 
        erro: err.message,
        stack: err.stack 
      })
    });
  });

  logger.server('Middleware de tratamento de erros configurado');
};

/**
 * Configura todos os middlewares em ordem correta
 */
export const configurarTodosMiddlewares = (app: express.Application): void => {
  logger.server('Iniciando configuração de middlewares...');

  // 1. Middlewares base (segurança, CORS, parsing)
  configurarMiddlewaresBase(app);

  // 2. Middleware de logging (após parsing, antes das rotas)
  configurarMiddlewareLogging(app);

  logger.success('Todos os middlewares configurados com sucesso!');
};

/**
 * Configura middlewares finais (após todas as rotas)
 */
export const configurarMiddlewaresFinais = (app: express.Application): void => {
  logger.server('Configurando middlewares finais...');

  // 1. Middleware para rotas não encontradas
  configurarMiddleware404(app);

  // 2. Middleware global de tratamento de erros (sempre por último)
  configurarMiddlewareErros(app);

  logger.success('Middlewares finais configurados!');
};

/**
 * Todas as funções já foram exportadas individualmente acima
 * Este comentário serve apenas para documentar que as exportações
 * estão disponíveis para uso individual quando necessário
 */ 