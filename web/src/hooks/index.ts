/**
 * Hooks de Autenticação - Exportações Centralizadas
 * 
 * Este arquivo centraliza todas as exportações dos hooks de autenticação,
 * facilitando a importação e mantendo a organização do código.
 */

// Hooks de proteção de rotas
export { 
  useProtectedRoute, 
  useAdminRoute, 
  useAlunoRoute, 
  usePrivateRoute 
} from './useProtectedRoute';

// Hooks de guarda de autenticação
export { 
  useAuthGuard, 
  useAdminGuard, 
  useAlunoGuard, 
  useAuthGuardGeneric 
} from './useAuthGuard';

// Hook principal de autenticação (do AuthContext)
export { useAuth } from '@/contexts/AuthContext'; 