import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRoute, AlunoRoute, PrivateRoute } from './components/ProtectedRoute';
import Page from './app/dashboard/page';
import LoginPage from './app/login/page';
import LoginAdmPage from './app/loginAdm/page';
import AlunosPage from './app/alunos/page';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota raiz - Redireciona para login */}
            <Route 
              path="/" 
              element={<Navigate to="/login" replace />} 
            />

            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/loginAdm" element={<LoginAdmPage />} />

            {/* Rotas protegidas - Administrador */}
            <Route 
              path="/dashboard" 
              element={
                <AdminRoute>
                  <Page />
                </AdminRoute>
              } 
            />

            <Route 
              path="/alunos" 
              element={
                <AdminRoute>
                  <AlunosPage />
                </AdminRoute>
              } 
            />

            {/* Rotas protegidas - Aluno */}
            <Route 
              path="/aluno/dashboard" 
              element={
                <AlunoRoute>
                  <Page />
                </AlunoRoute>
              } 
            />

            {/* Rotas protegidas - Qualquer usuário autenticado */}
            <Route 
              path="/chat" 
              element={
                <PrivateRoute>
                  <div>Chat (em desenvolvimento)</div>
                </PrivateRoute>
              } 
            />

            {/* Redireciona qualquer rota não definida para login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
