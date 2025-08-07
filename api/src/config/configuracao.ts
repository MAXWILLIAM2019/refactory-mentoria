/**
 * Configurações centralizadas da aplicação
 * 
 * Este arquivo centraliza todas as configurações e variáveis de ambiente
 * em um local único, facilitando manutenção e validação.
 * 
 * Baseado no padrão de configuration object para melhor organização.
 */

import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Configurações do servidor
 */
export const SERVIDOR = {
  porta: parseInt(process.env.PORT || '3001'),
  ambiente: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  ehProducao: process.env.NODE_ENV === 'production',
  ehDesenvolvimento: process.env.NODE_ENV === 'development',
  ehTeste: process.env.NODE_ENV === 'test'
};

/**
 * Configurações de CORS
 */
export const CORS = {
  origem: 'http://localhost:5173', // Forçado para corrigir CORS
  credenciais: true,
  metodosPermitidos: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as string[],
  cabecalhosPermitidos: ['Content-Type', 'Authorization'] as string[]
};

/**
 * Configurações do banco de dados
 */
export const BANCO_DADOS = {
  nome: process.env.DB_NAME || 'mentoria_sistema',
  usuario: process.env.DB_USER || 'postgres',
  senha: process.env.DB_PASS || '1127',
  host: process.env.DB_HOST || 'localhost',
  porta: parseInt(process.env.DB_PORT || '5432'),
  dialeto: 'postgres' as const,
  logging: SERVIDOR.ehDesenvolvimento,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '5'),
    min: parseInt(process.env.DB_POOL_MIN || '0'),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
    idle: parseInt(process.env.DB_POOL_IDLE || '10000')
  }
};

/**
 * Configurações de autenticação
 */
export const AUTENTICACAO = {
  jwt: {
    secret: process.env.JWT_SECRET || 'sistema-mentoria-secret-temp',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    algorithm: 'HS256' as const
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_ROUNDS || '12')
  },
  session: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24h em ms
    secure: SERVIDOR.ehProducao
  }
};

/**
 * Configurações de logging
 */
export const LOGGING = {
  ativo: !SERVIDOR.ehTeste,
  nivel: (process.env.LOG_LEVEL || 'info') as 'error' | 'warn' | 'info' | 'debug',
  timestamp: true,
  arquivo: {
    ativo: SERVIDOR.ehProducao,
    caminho: process.env.LOG_FILE_PATH || './logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '5')
  }
};

/**
 * Configurações de segurança
 */
export const SEGURANCA = {
  helmet: {
    contentSecurityPolicy: !SERVIDOR.ehDesenvolvimento,
    crossOriginEmbedderPolicy: false
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // 100 requests por window
    message: 'Muitas tentativas. Tente novamente em 15 minutos.'
  },
  requestSize: {
    jsonLimit: process.env.JSON_LIMIT || '10mb',
    urlEncodedLimit: process.env.URL_ENCODED_LIMIT || '10mb'
  }
};

/**
 * Configurações de API
 */
export const API = {
  versao: '1.0.0',
  prefixo: '/api',
  endpoints: {
    health: '/health',
    auth: '/auth',
    usuarios: '/usuarios',
    planos: '/planos',
    sprints: '/sprints',
    metas: '/metas'
  },
  timeout: parseInt(process.env.API_TIMEOUT || '30000') // 30 segundos
};

/**
 * URLs e integrações externas
 */
export const EXTERNOS = {
  frontend: {
    url: 'http://localhost:5173', // Forçado para corrigir CORS
    urlProducao: process.env.FRONTEND_PROD_URL
  },
  webhook: {
    url: process.env.WEBHOOK_URL,
    secret: process.env.WEBHOOK_SECRET
  }
};

/**
 * Configuração consolidada - Export principal
 */
export const CONFIG = {
  servidor: SERVIDOR,
  cors: CORS,
  bancoDados: BANCO_DADOS,
  autenticacao: AUTENTICACAO,
  logging: LOGGING,
  seguranca: SEGURANCA,
  api: API,
  externos: EXTERNOS
};

/**
 * Validação das configurações obrigatórias
 */
export const validarConfiguracoes = (): void => {
  const configsObrigatorias = [
    { nome: 'DB_NAME', valor: BANCO_DADOS.nome },
    { nome: 'DB_USER', valor: BANCO_DADOS.usuario },
    { nome: 'DB_HOST', valor: BANCO_DADOS.host }
  ];

  const configsFaltando = configsObrigatorias.filter(
    config => !config.valor || config.valor === ''
  );

  if (configsFaltando.length > 0) {
    throw new Error(
      `Configurações obrigatórias não encontradas: ${
        configsFaltando.map(c => c.nome).join(', ')
      }`
    );
  }
};

/**
 * Informações de debug das configurações (sem dados sensíveis)
 */
export const obterInfoConfiguracoes = () => ({
  ambiente: SERVIDOR.ambiente,
  porta: SERVIDOR.porta,
  database: {
    host: BANCO_DADOS.host,
    porta: BANCO_DADOS.porta,
    nome: BANCO_DADOS.nome
  },
  frontend: EXTERNOS.frontend.url,
  logging: {
    ativo: LOGGING.ativo,
    nivel: LOGGING.nivel
  }
});

/**
 * Export default para conveniência
 */
export default CONFIG; 