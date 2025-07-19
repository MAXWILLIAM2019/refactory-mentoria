import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';
import { BANCO_DADOS } from './configuracao';

/**
 * Configuração do Sequelize para PostgreSQL
 * Baseado na estrutura do MVP mas adaptado para TypeScript
 * Configurações centralizadas em ./configuracao.ts
 */
const sequelize = new Sequelize({
  database: BANCO_DADOS.nome,
  username: BANCO_DADOS.usuario, 
  password: BANCO_DADOS.senha,
  host: BANCO_DADOS.host,
  port: BANCO_DADOS.porta,
  dialect: BANCO_DADOS.dialeto,
  logging: BANCO_DADOS.logging ? console.log : false,
  dialectOptions: {
    // Opções específicas do PostgreSQL se necessário
  },
  pool: {
    max: BANCO_DADOS.pool.max,
    min: BANCO_DADOS.pool.min,
    acquire: BANCO_DADOS.pool.acquire,
    idle: BANCO_DADOS.pool.idle
  }
});

/**
 * Testa a conexão com o banco de dados
 */
export const testarConexaoBanco = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.database('Conexão com PostgreSQL estabelecida com sucesso!');
  } catch (erro) {
    logger.error('Erro ao conectar com o banco de dados:', erro);
    throw erro;
  }
};

/**
 * Sincroniza os modelos com o banco de dados
 */
export const sincronizarBanco = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    logger.database('Modelos sincronizados com o banco de dados!');
  } catch (erro) {
    logger.error('Erro ao sincronizar modelos:', erro);
    throw erro;
  }
};

export default sequelize; 