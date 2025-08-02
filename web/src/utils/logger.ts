/**
 * Utilitário de Logging Centralizado
 * 
 * Este módulo centraliza todos os logs da aplicação,
 * fornecendo categorização, formatação e controle de nível.
 * 
 * Categorias disponíveis:
 * - auth: Autenticação, login, logout, validação de tokens
 * - server: Operações do servidor, rotas, middlewares
 * - database: Operações de banco de dados
 * - middleware: Middlewares de autenticação e autorização
 * - error: Erros gerais da aplicação
 * - success: Operações bem-sucedidas
 * - warning: Avisos e alertas
 * - info: Informações gerais
 * - debug: Logs de debug (apenas em desenvolvimento)
 */

// Configuração do logger
const CONFIGURACAO_LOGGER = {
  ativo: true,
  nivel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  categorias: {
    auth: '🔐',
    server: '🖥️',
    database: '🗄️',
    middleware: '🔧',
    error: '❌',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️',
    debug: '🐛'
  }
};

// Níveis de log (ordem de importância)
const NIVEIS_LOG = {
  error: 0,
  warning: 1,
  info: 2,
  success: 3,
  debug: 4
};

class Logger {
  private formatarMensagem(
    nivel: string,
    categoria: string,
    mensagem: string,
    dados?: any
  ): void {
    if (!CONFIGURACAO_LOGGER.ativo) return;

    const nivelAtual = NIVEIS_LOG[CONFIGURACAO_LOGGER.nivel as keyof typeof NIVEIS_LOG] || 2;
    const nivelMensagem = NIVEIS_LOG[nivel as keyof typeof NIVEIS_LOG] || 2;

    if (nivelMensagem > nivelAtual) return;

    const timestamp = new Date().toISOString();
    const categoriaIcone = CONFIGURACAO_LOGGER.categorias[categoria as keyof typeof CONFIGURACAO_LOGGER.categorias] || '📝';
    
    const logMessage = `${categoriaIcone} [${timestamp}] ${mensagem}`;
    
    if (dados) {
      console.log(logMessage, dados);
    } else {
      console.log(logMessage);
    }
  }

  // Logs de autenticação
  auth(mensagem: string, dados?: any): void {
    this.formatarMensagem('info', 'auth', mensagem, dados);
  }

  // Logs do servidor
  server(mensagem: string, dados?: any): void {
    this.formatarMensagem('info', 'server', mensagem, dados);
  }

  // Logs de banco de dados
  database(mensagem: string, dados?: any): void {
    this.formatarMensagem('info', 'database', mensagem, dados);
  }

  // Logs de middleware
  middleware(mensagem: string, dados?: any): void {
    this.formatarMensagem('info', 'middleware', mensagem, dados);
  }

  // Logs de erro
  error(mensagem: string, dados?: any): void {
    this.formatarMensagem('error', 'error', mensagem, dados);
  }

  // Logs de sucesso
  success(mensagem: string, dados?: any): void {
    this.formatarMensagem('success', 'success', mensagem, dados);
  }

  // Logs de aviso
  warning(mensagem: string, dados?: any): void {
    this.formatarMensagem('warning', 'warning', mensagem, dados);
  }

  // Logs de informação
  info(mensagem: string, dados?: any): void {
    this.formatarMensagem('info', 'info', mensagem, dados);
  }

  // Logs de debug
  debug(mensagem: string, dados?: any): void {
    this.formatarMensagem('debug', 'debug', mensagem, dados);
  }

  // Log genérico
  log(mensagem: string, dados?: any): void {
    this.formatarMensagem('info', 'info', mensagem, dados);
  }
}

// Instância única do logger
export const logger = new Logger(); 