import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

/**
 * Hook para proteção de rotas
 * 
 * Este hook gerencia a proteção de rotas baseada na autenticação
 * e papel do usuário, redirecionando automaticamente se necessário.
 * 
 * @param requiredRole - Papel requerido para acessar a rota (opcional)
 * @param redirectTo - Rota para redirecionamento (padrão: '/login')
 * @returns Objeto com estado de autenticação e loading
 */
export const useProtectedRoute = (
  requiredRole?: 'aluno' | 'administrador',
  redirectTo?: string
) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Aguarda o carregamento inicial
    if (loading) {
      logger.auth('⏳ Aguardando validação inicial de autenticação');
      return;
    }

    // Verifica se está autenticado
    if (!isAuthenticated) {
      logger.auth('❌ Usuário não autenticado, redirecionando para login');
      // Redireciona baseado no papel do usuário ou usa padrão
      const rotaRedirecionamento = redirectTo || '/login';
      navigate(rotaRedirecionamento, { replace: true });
      return;
    }

    // Verifica papel específico se requerido
    if (requiredRole && userRole !== requiredRole) {
      logger.auth('❌ Papel insuficiente para acessar rota', {
        papelAtual: userRole,
        papelRequerido: requiredRole,
        rota: window.location.pathname
      });
      // Redireciona baseado no papel atual do usuário
      const rotaRedirecionamento = userRole === 'administrador' ? '/loginAdm' : '/login';
      navigate(rotaRedirecionamento, { replace: true });
      return;
    }

    // Acesso autorizado
    logger.auth('✅ Acesso autorizado à rota protegida', {
      papel: userRole,
      rota: window.location.pathname
    });

  }, [isAuthenticated, userRole, loading, requiredRole, navigate, redirectTo]);

  return {
    isAuthenticated,
    userRole,
    loading,
    isAuthorized: isAuthenticated && (!requiredRole || userRole === requiredRole)
  };
};

/**
 * Hook para proteção de rotas administrativas
 * 
 * @returns Objeto com estado de autenticação para administradores
 */
export const useAdminRoute = () => {
  return useProtectedRoute('administrador');
};

/**
 * Hook para proteção de rotas de alunos
 * 
 * @returns Objeto com estado de autenticação para alunos
 */
export const useAlunoRoute = () => {
  return useProtectedRoute('aluno');
};

/**
 * Hook para proteção de rotas para qualquer usuário autenticado
 * 
 * @returns Objeto com estado de autenticação para qualquer usuário
 */
export const usePrivateRoute = () => {
  return useProtectedRoute();
}; 