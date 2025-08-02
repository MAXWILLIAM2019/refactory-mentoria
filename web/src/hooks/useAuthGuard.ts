import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

/**
 * Hook para guarda de autenticação
 * 
 * Este hook fornece validação automática de autenticação
 * e pode ser usado em componentes que precisam garantir
 * que o usuário está autenticado antes de renderizar.
 * 
 * @param options - Opções de configuração do guard
 * @returns Objeto com estado de validação
 */
interface AuthGuardOptions {
  requiredRole?: 'aluno' | 'administrador';
  autoValidate?: boolean;
  validateInterval?: number; // em milissegundos
}

export const useAuthGuard = (options: AuthGuardOptions = {}) => {
  const {
    requiredRole,
    autoValidate = true,
    validateInterval = 5 * 60 * 1000 // 5 minutos
  } = options;

  const { isAuthenticated, userRole, loading, validateToken } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);

  // Validação automática periódica
  useEffect(() => {
    if (!autoValidate || !isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        setIsValidating(true);
        logger.auth('🔄 Validação automática de token');
        
        const isValid = await validateToken();
        
        if (isValid) {
          setLastValidation(new Date());
          logger.auth('✅ Validação automática bem-sucedida');
        } else {
          logger.auth('❌ Validação automática falhou');
        }
      } catch (erro) {
        logger.error('❌ Erro na validação automática:', erro);
      } finally {
        setIsValidating(false);
      }
    }, validateInterval);

    return () => clearInterval(interval);
  }, [autoValidate, isAuthenticated, validateToken, validateInterval]);

  // Validação manual
  const validateAuth = async (): Promise<boolean> => {
    try {
      setIsValidating(true);
      logger.auth('🔍 Validação manual de autenticação');
      
      const isValid = await validateToken();
      
      if (isValid) {
        setLastValidation(new Date());
        logger.auth('✅ Validação manual bem-sucedida');
      } else {
        logger.auth('❌ Validação manual falhou');
      }
      
      return isValid;
    } catch (erro) {
      logger.error('❌ Erro na validação manual:', erro);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Verifica se o usuário tem o papel requerido
  const hasRequiredRole = (): boolean => {
    if (!requiredRole) return true;
    return userRole === requiredRole;
  };

  // Verifica se o acesso está autorizado
  const isAuthorized = (): boolean => {
    return isAuthenticated && hasRequiredRole();
  };

  // Estado de carregamento geral
  const isLoading = loading || isValidating;

  return {
    // Estado
    isAuthenticated,
    userRole,
    isLoading,
    isValidating,
    lastValidation,
    
    // Validação
    isAuthorized: isAuthorized(),
    hasRequiredRole: hasRequiredRole(),
    
    // Ações
    validateAuth,
    
    // Utilitários
    canAccess: isAuthorized() && !isLoading
  };
};

/**
 * Hook para guarda de autenticação administrativa
 * 
 * @returns Objeto com estado de validação para administradores
 */
export const useAdminGuard = () => {
  return useAuthGuard({ requiredRole: 'administrador' });
};

/**
 * Hook para guarda de autenticação de alunos
 * 
 * @returns Objeto com estado de validação para alunos
 */
export const useAlunoGuard = () => {
  return useAuthGuard({ requiredRole: 'aluno' });
};

/**
 * Hook para guarda de autenticação genérica
 * 
 * @returns Objeto com estado de validação para qualquer usuário autenticado
 */
export const useAuthGuardGeneric = () => {
  return useAuthGuard();
}; 