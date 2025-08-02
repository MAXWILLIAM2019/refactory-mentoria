import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { logger } from '@/utils/logger';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'aluno' | 'administrador';
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Componente de Proteção de Rotas
 * 
 * Este componente protege rotas baseado na autenticação e papel do usuário.
 * Fornece loading states e redirecionamento automático.
 * 
 * @param children - Componentes filhos a serem renderizados se autorizado
 * @param requiredRole - Papel requerido para acessar a rota (opcional)
 * @param fallback - Componente de loading (opcional)
 * @param redirectTo - Rota para redirecionamento (padrão baseado no papel)
 */
export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback = <ProtectedRouteSkeleton />,
  redirectTo
}: ProtectedRouteProps) {
  const { isAuthenticated, userRole, loading, isAuthorized } = useProtectedRoute(
    requiredRole,
    redirectTo
  );

  // Log de tentativa de acesso
  useEffect(() => {
    if (!loading) {
      logger.auth('🔒 Tentativa de acesso a rota protegida', {
        rota: window.location.pathname,
        papelRequerido: requiredRole,
        papelAtual: userRole,
        autenticado: isAuthenticated,
        autorizado: isAuthorized
      });
    }
  }, [loading, isAuthenticated, userRole, isAuthorized, requiredRole]);

  // Loading state
  if (loading) {
    logger.auth('⏳ Carregando verificação de autenticação');
    return <>{fallback}</>;
  }

  // Não autenticado ou não autorizado
  if (!isAuthorized) {
    logger.auth('❌ Acesso negado à rota protegida', {
      rota: window.location.pathname,
      papelRequerido: requiredRole,
      papelAtual: userRole
    });
    return null; // Redirecionamento é feito pelo hook
  }

  // Acesso autorizado
  logger.auth('✅ Acesso autorizado à rota protegida', {
    rota: window.location.pathname,
    papel: userRole
  });

  return <>{children}</>;
}

/**
 * Componente de Skeleton para Loading usando ShadCN
 * 
 * Fornece um loading state visual enquanto a autenticação é verificada.
 */
function ProtectedRouteSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
        
        {/* Texto de loading */}
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        {/* Indicador de progresso */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para Rotas Administrativas
 * 
 * Wrapper específico para rotas que requerem papel de administrador.
 */
export function AdminRoute({ 
  children, 
  fallback 
}: { 
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute 
      requiredRole="administrador" 
      redirectTo="/loginAdm"
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}

/**
 * Componente para Rotas de Alunos
 * 
 * Wrapper específico para rotas que requerem papel de aluno.
 */
export function AlunoRoute({ 
  children, 
  fallback 
}: { 
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute 
      requiredRole="aluno" 
      redirectTo="/login"
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}

/**
 * Componente para Rotas Privadas (qualquer usuário autenticado)
 * 
 * Wrapper para rotas que requerem apenas autenticação.
 */
export function PrivateRoute({ 
  children, 
  fallback 
}: { 
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute 
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
} 