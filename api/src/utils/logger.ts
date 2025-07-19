/**
 * Utilitário centralizado de logging
 * 
 * Sistema padronizado para logs categorizados com emojis visuais
 * Facilita debug, manutenção e futura migração para Winston/arquivo
 * 
 * Uso:
 * - logger.auth('Login realizado', { usuario: 'admin' })
 * - logger.server('Servidor iniciado na porta 3001')
 * - logger.database('Conexão estabelecida')
 * - logger.error('Erro crítico', erro)
 */

import { LOGGING, SERVIDOR } from '../config/configuracao';

/**
 * Configuração do logger
 * Usa configurações centralizadas de ./config/configuracao.ts
 */

const CONFIGURACAO_LOGGER = {
  ativo: LOGGING.ativo,
  nivel: LOGGING.nivel,
  timestamp: LOGGING.timestamp,
  categorias: {
    auth: '🔐',
    server: '🚀', 
    database: '📊',
    middleware: '🔄',
    error: '❌',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️',
    debug: '🐛'
  }
};

/**
 * Tipo para níveis de log
 */
type NivelLog = 'error' | 'warning' | 'info' | 'debug';

/**
 * Classe Logger centralizada
 */
class Logger {
  private formatarTimestamp(): string {
    return new Date().toISOString();
  }

  private formatarMensagem(categoria: string, emoji: string, mensagem: string, dados?: any): void {
    if (!CONFIGURACAO_LOGGER.ativo) return;

    const timestamp = CONFIGURACAO_LOGGER.timestamp 
      ? `[${this.formatarTimestamp()}]` 
      : '';
    
    const prefixo = `${emoji} [${categoria.toUpperCase()}]`;
    const mensagemCompleta = `${timestamp} ${prefixo} ${mensagem}`;

    if (dados !== undefined) {
      console.log(mensagemCompleta, dados);
    } else {
      console.log(mensagemCompleta);
    }
  }

  /**
   * Logs de autenticação
   * Ex: login, logout, validação de token, permissões
   */
  auth(mensagem: string, dados?: any): void {
    this.formatarMensagem('auth', CONFIGURACAO_LOGGER.categorias.auth, mensagem, dados);
  }

  /**
   * Logs do servidor
   * Ex: inicialização, rotas, middlewares globais
   */
  server(mensagem: string, dados?: any): void {
    this.formatarMensagem('server', CONFIGURACAO_LOGGER.categorias.server, mensagem, dados);
  }

  /**
   * Logs de banco de dados
   * Ex: conexão, queries, sincronização, modelos
   */
  database(mensagem: string, dados?: any): void {
    this.formatarMensagem('database', CONFIGURACAO_LOGGER.categorias.database, mensagem, dados);
  }

  /**
   * Logs de middleware
   * Ex: requisições, validações, processamento
   */
  middleware(mensagem: string, dados?: any): void {
    this.formatarMensagem('middleware', CONFIGURACAO_LOGGER.categorias.middleware, mensagem, dados);
  }

  /**
   * Logs de erro
   * Ex: exceptions, falhas, problemas críticos
   */
  error(mensagem: string, dados?: any): void {
    this.formatarMensagem('error', CONFIGURACAO_LOGGER.categorias.error, mensagem, dados);
    
    // Erros também vão para console.error para stack trace
    if (dados instanceof Error) {
      console.error(dados);
    }
  }

  /**
   * Logs de sucesso
   * Ex: operações concluídas, validações aprovadas
   */
  success(mensagem: string, dados?: any): void {
    this.formatarMensagem('success', CONFIGURACAO_LOGGER.categorias.success, mensagem, dados);
  }

  /**
   * Logs de warning
   * Ex: operações temporárias, configs faltando, deprecations
   */
  warning(mensagem: string, dados?: any): void {
    this.formatarMensagem('warning', CONFIGURACAO_LOGGER.categorias.warning, mensagem, dados);
  }

  /**
   * Logs informativos
   * Ex: status, estatísticas, informações gerais
   */
  info(mensagem: string, dados?: any): void {
    this.formatarMensagem('info', CONFIGURACAO_LOGGER.categorias.info, mensagem, dados);
  }

  /**
   * Logs de debug
   * Ex: valores de variáveis, fluxo de execução (só em dev)
   */
  debug(mensagem: string, dados?: any): void {
    if (SERVIDOR.ehDesenvolvimento) {
      this.formatarMensagem('debug', CONFIGURACAO_LOGGER.categorias.debug, mensagem, dados);
    }
  }

  /**
   * Log genérico (mantém compatibilidade com console.log)
   */
  log(mensagem: string, dados?: any): void {
    this.info(mensagem, dados);
  }

  /**
   * Configurar logger (para testes ou ambientes específicos)
   */
  static configurar(opcoes: Partial<typeof CONFIGURACAO_LOGGER>): void {
    Object.assign(CONFIGURACAO_LOGGER, opcoes);
  }

  /**
   * Desabilitar logs (útil para testes)
   */
  static silenciar(): void {
    CONFIGURACAO_LOGGER.ativo = false;
  }

  /**
   * Reabilitar logs
   */
  static reativar(): void {
    CONFIGURACAO_LOGGER.ativo = true;
  }
}

/**
 * Instância singleton do logger
 */
export const logger = new Logger();

/**
 * Exporta classe para casos especiais
 */
export { Logger };

/**
 * Export default para conveniência
 */
export default logger; 