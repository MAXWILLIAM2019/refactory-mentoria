/**
 * Gerenciamento e inicialização do servidor
 * 
 * Este arquivo centraliza toda a lógica de inicialização do servidor Express,
 * incluindo configuração de middlewares, rotas e tratamento de sinais do sistema.
 * 
 * Responsabilidades:
 * - Criação da aplicação Express
 * - Configuração de middlewares e rotas
 * - Inicialização do servidor
 * - Tratamento de sinais de encerramento
 * - Validação de configurações
 */

import express from 'express';
import { logger } from './utils/logger';
import { CONFIG, validarConfiguracoes, obterInfoConfiguracoes } from './config/configuracao';
import { testarConexaoBanco } from './config/bancoDados';
import { 
  configurarTodosMiddlewares, 
  configurarMiddlewaresFinais 
} from './config/middlewares';
import { configurarTodasRotas } from './config/rotas';
import './models'; // Importa models e inicializa relacionamentos

/**
 * Classe responsável pelo gerenciamento do servidor
 */
class ServidorAPI {
  private app: express.Application;
  private servidor: any = null;

  constructor() {
    this.app = express();
  }

  /**
   * Valida configurações obrigatórias antes de iniciar
   */
  private async validarConfiguracoesInicializacao(): Promise<void> {
    try {
      logger.server('Validando configurações...');
      
      // Valida configurações obrigatórias
      validarConfiguracoes();
      
      // Log das configurações (sem dados sensíveis)
      const infoConfig = obterInfoConfiguracoes();
      logger.info('Configurações validadas:', infoConfig);
      
      logger.success('Configurações válidas!');
    } catch (erro) {
      logger.error('Erro na validação de configurações:', erro);
      throw erro;
    }
  }

  /**
   * Configura todos os middlewares da aplicação
   */
  private configurarMiddlewares(): void {
    try {
      // Middlewares base (segurança, CORS, parsing, logging)
      configurarTodosMiddlewares(this.app);
      
      logger.success('Middlewares configurados!');
    } catch (erro) {
      logger.error('Erro ao configurar middlewares:', erro);
      throw erro;
    }
  }

  /**
   * Configura todas as rotas da aplicação
   */
  private configurarRotas(): void {
    try {
      // Todas as rotas da aplicação
      configurarTodasRotas(this.app);
      
      logger.success('Rotas configuradas!');
    } catch (erro) {
      logger.error('Erro ao configurar rotas:', erro);
      throw erro;
    }
  }

  /**
   * Configura middlewares finais (404 e error handler)
   */
  private configurarMiddlewaresFinais(): void {
    try {
      // Middlewares que devem vir após todas as rotas
      configurarMiddlewaresFinais(this.app);
      
      logger.success('Middlewares finais configurados!');
    } catch (erro) {
      logger.error('Erro ao configurar middlewares finais:', erro);
      throw erro;
    }
  }

  /**
   * Testa conexão com o banco de dados
   */
  private async testarConexaoBancoDados(): Promise<void> {
    try {
      logger.database('Testando conexão com o banco de dados...');
      await testarConexaoBanco();
      logger.success('Conexão com banco estabelecida!');
    } catch (erro) {
      logger.error('Erro ao conectar com banco de dados:', erro);
      throw erro;
    }
  }

  /**
   * Inicia o servidor HTTP
   */
  private async iniciarServidorHTTP(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.servidor = this.app.listen(CONFIG.servidor.porta, () => {
          logger.success('Servidor da API iniciado com sucesso!');
          logger.server(`URL: http://localhost:${CONFIG.servidor.porta}`);
          logger.info(`Ambiente: ${CONFIG.servidor.ambiente}`);
          logger.info(`Processo PID: ${process.pid}`);
          logger.info(`Node.js versão: ${process.version}`);
          logger.success('🎉 Sistema de Mentoria - API Backend pronta para uso!');
          resolve(undefined);
        });

        this.servidor.on('error', (erro: any) => {
          if (erro.code === 'EADDRINUSE') {
            logger.error(`Porta ${CONFIG.servidor.porta} já está em uso!`);
          } else {
            logger.error('Erro no servidor HTTP:', erro);
          }
          reject(erro);
        });

      } catch (erro) {
        logger.error('Erro ao iniciar servidor HTTP:', erro);
        reject(erro);
      }
    });
  }

  /**
   * Configura tratamento de sinais de encerramento gracioso
   */
  private configurarSinaisEncerramento(): void {
    // SIGTERM (usado por Docker, Kubernetes, etc.)
    process.on('SIGTERM', () => {
      logger.warning('🛑 Recebido SIGTERM. Encerrando servidor graciosamente...');
      this.encerrarGraciosamente();
    });

    // SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      logger.warning('🛑 Recebido SIGINT. Encerrando servidor...');
      this.encerrarGraciosamente();
    });

    // Uncaught Exception
    process.on('uncaughtException', (erro) => {
      logger.error('💥 Exceção não capturada:', erro);
      this.encerrarGraciosamente(1);
    });

    // Unhandled Promise Rejection
    process.on('unhandledRejection', (razao, promise) => {
      logger.error('💥 Promise rejection não tratada:', { razao, promise });
      this.encerrarGraciosamente(1);
    });

    logger.server('Tratamento de sinais de encerramento configurado');
  }

  /**
   * Encerra o servidor graciosamente
   */
  private encerrarGraciosamente(codigoSaida: number = 0): void {
    logger.server('Iniciando encerramento gracioso...');

    if (this.servidor) {
      this.servidor.close((erro: any) => {
        if (erro) {
          logger.error('Erro ao fechar servidor:', erro);
          process.exit(1);
        } else {
          logger.success('Servidor encerrado com sucesso');
          process.exit(codigoSaida);
        }
      });

      // Timeout de segurança (força encerramento após 10 segundos)
      setTimeout(() => {
        logger.warning('Forçando encerramento do servidor (timeout)');
        process.exit(1);
      }, 10000);
    } else {
      process.exit(codigoSaida);
    }
  }

  /**
   * Inicializa o servidor completo
   */
  public async inicializar(): Promise<void> {
    try {
      logger.server('🚀 Iniciando Sistema de Mentoria - API Backend...');

      // 1. Validar configurações
      await this.validarConfiguracoesInicializacao();

      // 2. Testar conexão com banco
      await this.testarConexaoBancoDados();

      // 3. Configurar middlewares base
      this.configurarMiddlewares();

      // 4. Configurar rotas
      this.configurarRotas();

      // 5. Configurar middlewares finais
      this.configurarMiddlewaresFinais();

      // 6. Configurar tratamento de sinais
      this.configurarSinaisEncerramento();

      // 7. Iniciar servidor HTTP
      await this.iniciarServidorHTTP();

    } catch (erro) {
      logger.error('❌ Erro ao inicializar servidor:', erro);
      process.exit(1);
    }
  }

  /**
   * Retorna a instância da aplicação Express (para testes)
   */
  public obterApp(): express.Application {
    return this.app;
  }
}

/**
 * Instância singleton do servidor
 */
export const servidorAPI = new ServidorAPI();

/**
 * Função utilitária para inicializar o servidor
 */
export const iniciarServidor = async (): Promise<void> => {
  await servidorAPI.inicializar();
};

/**
 * Export default para conveniência
 */
export default servidorAPI; 