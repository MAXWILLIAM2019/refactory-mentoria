/**
 * Tipos e interfaces para sistema de autenticação
 * 
 * Arquivo centralizado de tipos TypeScript para o módulo de autenticação
 * seguindo diretrizes de nomenclatura em português.
 */

/**
 * Enum para tipos de grupos de usuário
 */
export enum TipoGrupoUsuario {
  ALUNO = 'aluno',
  ADMINISTRADOR = 'administrador'
}

/**
 * Interface para dados de login
 */
export interface DadosLogin {
  login: string;
  senha: string;
  grupo?: TipoGrupoUsuario; // Opcional - para login unificado
}

/**
 * Interface para dados de registro de usuário
 */
export interface DadosRegistroUsuario {
  nome: string;
  login: string;
  senha: string;
  cpf?: string;
  grupo: number;
  email?: string; // Para futura integração com aluno_info/administrador_info
}

/**
 * Interface para resposta de autenticação
 */
export interface RespostaAutenticacao {
  sucesso: boolean;
  mensagem: string;
  token?: string;
  usuario?: {
    idusuario: number;
    nome: string;
    login: string;
    grupo: {
      idgrupo: number;
      nome: string;
      descricao?: string;
    };
  };
}

/**
 * Interface para payload do JWT
 * Baseado na estrutura do MVP
 */
export interface PayloadJWT {
  idusuario: number;
  login: string;
  grupo: number;
  nomeGrupo: string;
  estaPersonificando?: boolean;
  'sis-mentoria': {
    nome_papel: string;
    permissoes: string[];
    personificando?: {
      idOriginal: number;
      papelOriginal: string;
    };
  };
  iat?: number; // issued at
  exp?: number; // expiration
}

/**
 * Interface para dados de validação de token
 */
export interface DadosValidacaoToken {
  valido: boolean;
  usuario?: PayloadJWT;
  erro?: string;
}

/**
 * Tipo para status de situação do usuário
 */
export type StatusUsuario = 'ativo' | 'inativo' | 'bloqueado' | 'pendente';

/**
 * Interface para filtros de busca de usuários
 */
export interface FiltrosBuscaUsuarios {
  nome?: string;
  login?: string;
  grupo?: number;
  situacao?: boolean;
  cpf?: string;
  limite?: number;
  offset?: number;
}

/**
 * Interface para resposta paginada
 */
export interface RespostaPaginada<T> {
  dados: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
} 