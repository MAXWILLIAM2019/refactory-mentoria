import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import servicoAutenticacao from '@/services/servicoAutenticacao';
import { logger } from '@/utils/logger';

// Tipos para autenticação
interface DadosUsuario {
  idusuario: number;
  login: string;
  nome: string;
  grupo: string;
  permissoes?: string[];
}

interface DadosLogin {
  login: string;
  senha: string;
  grupo?: 'aluno' | 'administrador';
}

interface AuthState {
  isAuthenticated: boolean;
  userRole: 'aluno' | 'administrador' | null;
  userData: DadosUsuario | null;
  loading: boolean;
}

interface AuthContextType {
  // Estado
  isAuthenticated: boolean;
  userRole: 'aluno' | 'administrador' | null;
  userData: DadosUsuario | null;
  loading: boolean;
  
  // Ações
  login: (credentials: DadosLogin) => Promise<void>;
  logout: () => Promise<void>;
  validateToken: () => Promise<boolean>;
  
  // Utilitários
  refreshUserData: () => Promise<void>;
}

// Contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider do contexto de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userRole: null,
    userData: null,
    loading: true
  });

  // Validação automática de token na inicialização
  useEffect(() => {
    const validarTokenInicial = async () => {
      try {
        logger.auth('🔍 Validando token na inicialização');
        
        // Verifica se há token no localStorage
        if (!servicoAutenticacao.estaAutenticado()) {
          logger.auth('❌ Nenhum token encontrado');
          setAuth({
            isAuthenticated: false,
            userRole: null,
            userData: null,
            loading: false
          });
          return;
        }

        // Valida token no servidor
        const tokenValido = await servicoAutenticacao.validarToken();
        
        if (!tokenValido) {
          logger.auth('❌ Token inválido, fazendo logout automático');
          await logout();
          return;
        }

        // Obtém dados do usuário
        const userData = servicoAutenticacao.obterDadosUsuario();
        const userRole = servicoAutenticacao.obterPapelUsuario() as 'aluno' | 'administrador' | null;

        if (userData && userRole) {
          logger.auth('✅ Token válido, usuário autenticado', { 
            usuario: userData.nome, 
            papel: userRole 
          });
          
          setAuth({
            isAuthenticated: true,
            userRole,
            userData,
            loading: false
          });
        } else {
          logger.auth('❌ Dados do usuário incompletos');
          await logout();
        }

      } catch (erro) {
        logger.error('❌ Erro na validação inicial do token:', erro);
        await logout();
      }
    };

    validarTokenInicial();
  }, []);

  // Função de login
  const login = async (credentials: DadosLogin): Promise<void> => {
    try {
      logger.auth('🔐 Iniciando processo de login', { login: credentials.login });
      setAuth(prev => ({ ...prev, loading: true }));

      const resposta = await servicoAutenticacao.fazerLogin(credentials);

      if (resposta.sucesso && resposta.token && resposta.usuario) {
        const userRole = resposta.usuario.grupo?.nome as 'aluno' | 'administrador';
        
        logger.auth('✅ Login realizado com sucesso', { 
          usuario: resposta.usuario.nome, 
          papel: userRole 
        });

        setAuth({
          isAuthenticated: true,
          userRole,
          userData: resposta.usuario,
          loading: false
        });
      } else {
        throw new Error(resposta.mensagem || 'Erro no login');
      }

    } catch (erro) {
      logger.error('❌ Erro no login:', erro);
      setAuth({
        isAuthenticated: false,
        userRole: null,
        userData: null,
        loading: false
      });
      throw erro;
    }
  };

  // Função de logout
  const logout = async (): Promise<void> => {
    try {
      logger.auth('🚪 Iniciando logout');
      
      // Chama logout seguro (backend + frontend)
      await servicoAutenticacao.fazerLogoutSeguro();
      
      logger.auth('✅ Logout realizado com sucesso');
      
      setAuth({
        isAuthenticated: false,
        userRole: null,
        userData: null,
        loading: false
      });

    } catch (erro) {
      logger.error('❌ Erro no logout:', erro);
      // Mesmo com erro, limpa o estado
      setAuth({
        isAuthenticated: false,
        userRole: null,
        userData: null,
        loading: false
      });
    }
  };

  // Função de validação de token
  const validateToken = async (): Promise<boolean> => {
    try {
      logger.auth('🔍 Validando token');
      const tokenValido = await servicoAutenticacao.validarToken();
      
      if (!tokenValido) {
        logger.auth('❌ Token inválido');
        await logout();
        return false;
      }

      logger.auth('✅ Token válido');
      return true;

    } catch (erro) {
      logger.error('❌ Erro na validação do token:', erro);
      await logout();
      return false;
    }
  };

  // Função para atualizar dados do usuário
  const refreshUserData = async (): Promise<void> => {
    try {
      logger.auth('🔄 Atualizando dados do usuário');
      
      const userData = servicoAutenticacao.obterDadosUsuario();
      const userRole = servicoAutenticacao.obterPapelUsuario() as 'aluno' | 'administrador' | null;

      if (userData && userRole) {
        setAuth(prev => ({
          ...prev,
          userData,
          userRole
        }));
        
        logger.auth('✅ Dados do usuário atualizados');
      } else {
        logger.auth('❌ Dados do usuário não encontrados');
        await logout();
      }

    } catch (erro) {
      logger.error('❌ Erro ao atualizar dados do usuário:', erro);
      await logout();
    }
  };

  // Valor do contexto
  const contextValue: AuthContextType = {
    // Estado
    isAuthenticated: auth.isAuthenticated,
    userRole: auth.userRole,
    userData: auth.userData,
    loading: auth.loading,
    
    // Ações
    login,
    logout,
    validateToken,
    
    // Utilitários
    refreshUserData
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
} 