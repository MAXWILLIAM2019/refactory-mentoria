import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Page from './app/dashboard/page';
import LoginPage from './app/login/page';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-foreground mb-4">Sistema de Mentoria</h1>
                  <p className="text-muted-foreground mb-8">Bem-vindo ao seu sistema de mentoria</p>
                                  <div className="space-y-4">
                  <a 
                    href="/login" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
                  >
                    Fazer Login
                  </a>
                  <br />
                  <a 
                    href="/dashboard" 
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
                  >
                    Ver Dashboard
                  </a>
                </div>
                </div>
              </div>
            } 
          />
          <Route path="/dashboard" element={<Page />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
